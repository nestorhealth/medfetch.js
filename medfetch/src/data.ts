import { pipe } from "effect";
import { Resource, Link, Entry } from "./data.schema.js";
import clarinet from "clarinet";
import {
    none,
    type Option,
    some,
    map as mapOption,
    flatMap as flatMapOption,
    isSome,
    getOrThrow,
    fromNullable,
} from "effect/Option";
import { DataError } from "~/data.error.js";
import { AnyBundle } from "~/fhir/bundle.js";

/**
 * Unwrapped return type of calling the parser returned by {@link kdv}
 * @template Value The expected type of value at key `k`. This is *NOT* a runtime type:
 * you must validate the payload yourself if you're unsure about type at key `k`.
 */
interface KDVParseResult<Value> {
    /**
     * A *copy* of the first element of the value stack from the provided key (so the 'bottom' of the stack).
     * If stack head is a container (array / object) and has a child pointer that points to an incomplete
     * child (so hd.next / stack[1], same thing), then that child is pruned.
     */
    hd: Value;

    /**
     * The pruned incomplete child of {@link hd} if it exists. Otherwise null.
     */
    tl: Value[keyof Value] | null;
}

/**
 * The key-depth-value {@link clarinet} parser returned by {@link kdv}.
 * @template Value The expected type of the value from the key provided to {@link kdv} ctor.
 * @param chunk The next available chunk of the Bundle to send to {@link clarinet.CParser.write}
 * @returns Some {@link KDVParseResult} if it exists. None otherwise.
 */
type KDVParseFn<Value> = (chunk: string) => Option<KDVParseResult<Value>>;

/**
 * Returns a clarinet parser that searches for a JSON key `k` at depth `d` 0
 * indexed (so root is depth 0), and returns value `v` indexed by `k`.
 * @param k The key
 * @param d The depth (first key is depth 1)
 * @returns Some value if it exists, None otherwise.
 */
export const kdv = <Value = unknown>(
    k: string,
    d: number,
): KDVParseFn<Value> => {
    const parser = clarinet.parser();

    let currentKey = "";
    let depth = 0;

    let v: Value | null = null;
    let capturing = false;

    let stack: any[] = [];
    const peek = () => stack[stack.length - 1];
    const empty = () => stack.length === 0;

    parser.onkey = (key) => {
        if (key === k && depth === d) {
            capturing = true;
        }
        currentKey = key;
    };

    parser.onopenobject = (key) => {
        if (depth + 1 === d && key === k) {
            capturing = true;
            stack.push({});
        } else if (capturing) {
            if (empty()) {
                stack.push({});
            } else {
                const obj = {};
                if (Array.isArray(peek())) {
                    peek().push(obj);
                } else {
                    peek()[currentKey] = obj;
                }
                stack.push(obj);
            }
        }
        depth++;
        currentKey = key;
    };

    parser.onopenarray = () => {
        if (capturing) {
            const arr: any[] = [];
            if (empty()) {
                stack.push([]);
            } else {
                if (Array.isArray(peek())) {
                    peek().push(arr);
                } else {
                    peek()[currentKey] = arr;
                }
                stack.push(arr);
            }
        }
        depth++;
    };

    parser.onvalue = (value) => {
        if (capturing) {
            if (stack.length > 0) {
                if (Array.isArray(peek())) {
                    peek().push(value);
                } else {
                    peek()[currentKey] = value;
                }
            } else {
                v = value as Value;
                capturing = false;
            }
        } else if (currentKey === k && depth === d) {
            v = value as Value;
        }
    };

    parser.oncloseobject = () => {
        depth--;
        if (capturing) {
            const top = stack.pop();
            if (depth === d) {
                capturing = false;
                stack = [];
                v = top;
            }
        }
    };

    parser.onclosearray = () => {
        depth--;
        if (capturing) {
            const top = stack.pop();
            if (depth === d) {
                capturing = false;
                stack = [];
                v = top;
            }
        }
    };

    return (chunk: string): Option<KDVParseResult<Value>> => {
        parser.write(chunk);
        if (!!v) {
            return some({
                hd: v,
                tl: null,
            });
        } else if (stack.length > 0) {
            const hd = structuredClone(stack[0]);
            if (Array.isArray(hd)) {
                const popped = hd.pop();
                return some({
                    hd: hd as Value,
                    tl: popped as any,
                });
            } else {
                const keys = Object.keys(hd);
                const last = keys[keys.length - 1];
                const lastChild = hd[last];
                delete hd[last];
                return some({
                    hd: hd as Value,
                    tl: lastChild as any,
                });
            }
        } else {
            return none();
        }
    };
};

const parseLink = kdv<Link[]>("link", 1);
const parseEntry = kdv<Entry[]>("entry", 1);

/**
 * Somewhat abstract mapping of a grouping or "page" of related FHIR data
 */
export class Page {
    #nextURL: string | null;
    #isLinkParsed: boolean;
    #cursor: number;
    #acc: Resource[];
    #chunks: Generator<string>;
    #rows: Generator<Resource> | undefined = undefined;
    #fetcher: ((url: string) => Generator<string>) | undefined;

    constructor(
        chunks: Generator<string>,
        nextPage?: (nextURL: string) => Generator<string>,
    ) {
        this.#nextURL = null;
        this.#isLinkParsed = false;
        this.#cursor = -1;
        this.#acc = [];
        this.#chunks = chunks;
        this.#fetcher = nextPage;
    }

    *#resources() {
        while (true) {
            if (this.#acc.length > 0) {
                yield this.#acc.shift()!;
            }
            const { done, value } = this.#chunks.next();
            if (done || !value) break;
            if (!this.#nextURL && !this.#isLinkParsed) {
                parseLink(value).pipe(
                    mapOption(({ hd }) => {
                        this.#isLinkParsed = true;
                        const searched = hd.find(
                            (link) => link.relation === "next",
                        )?.url;
                        if (searched) this.#nextURL = searched;
                    }),
                );
            }
            const popped = parseEntry(value).pipe(
                flatMapOption(({ hd }) => {
                    if (hd.length > 0) {
                        const flushed = hd
                            .slice(this.#cursor + 1)
                            .filter(
                                (
                                    entry,
                                ): entry is Entry & {
                                    resource: Resource;
                                } => !!entry.resource,
                            )
                            .map(({ resource }) => resource);
                        this.#cursor = hd.length - 1;
                        this.#acc.push(...flushed);
                        return some(this.#acc.shift()!);
                    } else return none();
                }),
            );
            if (isSome(popped)) {
                yield getOrThrow(popped);
            }
        }
        while (this.#acc.length > 0) yield this.#acc.shift()!;
    }

    /**
     * Get back a generator wrapper over the Bundle text chunk generator provided
     * that flushes out resources one by one.
     * @returns {@link Resource} generator
     */
    get rows() {
        if (!this.#rows) {
            this.#rows = this.#resources();
        }
        return this.#rows;
    }

    /**
     * Stateful next bundle url getter that only returns non-null if
     * 1. The {@link Link} property was able to be parsed at depth 1 and
     * 2. The {@link Link} array value has an element with key "relation" == "next".
     * Call when {@link resources} returns `done` to check if a next URL exists or not.
     * @returns The next page URL if it exists, null otherwise.
     */
    get next(): Page | null {
        if (!this.#nextURL || !this.#fetcher) {
            return null;
        } else {
            const nextChunks = this.#fetcher(this.#nextURL);
            return new Page(nextChunks, this.#fetcher);
        }
    }
}

/**
 * Gets the link from the `Bundle.link`
 * element where `relation = 'next'`
 * @param bundle the bundle
 * @returns `Option.some` with the url if `'next' in Bundle.link.relation` exists. `Option.none` otherwise.
 *
 */
const nextLink = (bundle: AnyBundle): Option<string> =>
    pipe(
        bundle.link?.find((link) => link.relation === "next"),
        fromNullable,
        mapOption((link) => link.url),
    );

/**
 * `fetch()` wrapper over an HTTP GET call.
 *
 * It doesn't need to necessarily be a `search` result,
 * but it decodes a [Bundle](https://build.fhir.org/bundle.html) from a JSON.
 *
 * So make sure whatever url you're calling returns a Bundle JSON.
 *
 * @param url - the server url
 * @returns a decoded Bundle
 */
const getBundle = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new DataError(`Response not ok! Status: ${response.status}`);
    }
    const payload = await response.json();
    return AnyBundle.parse(payload);
};
/**
 * Create an async iterator over
 * a Bundle and its links
 * @param baseUrl - server url
 * @param resourceType - resource to fetch
 * @returns - async iterator over Bundle
 */
const pageIterator = (baseUrl: string, resourceType: string) =>
    async function* (n: number, maxPageSize: number) {
        const upperLimit = n < 0 ? Infinity : n;
        let count = 0;

        const firstPage = await getBundle(
            `${baseUrl}/${resourceType}?_count=${maxPageSize}`,
        );
        yield firstPage;
        count += firstPage.entry!.length;

        let linkOption = nextLink(firstPage);
        while (isSome(linkOption) && count < upperLimit) {
            const link = getOrThrow(linkOption);
            const page = await getBundle(link);
            yield page;

            count++;
            linkOption = nextLink(page);
        }
    };

/**
 * Creates a `Stream` of `Bundle`'s.
 *
 * - START: fetch(`${baseUrl}/${resourceType}`)
 * - STEP: Bundle.link.where(relation = 'next').url
 * - END: 'next' not in Bundle.link.relation
 *
 * @param baseUrl server url
 * @param resourceType resource to fetch
 * @param n (max) number of resources to fetch
 * @param maxPageSize the maximum number of resources
 *        per bundle entry for this endpoint, defaults to 250
 *        which is the maxPageSize of the R4 smarthealthit
 *        sandbox server.
 * @returns a Stream of Bundles
 */
export const pages = (
    baseUrl: string,
    resourceType: string,
    n = 100,
    maxPageSize = 250,
) => pageIterator(baseUrl, resourceType)(n, maxPageSize);

export { pkce } from "./data.auth.js";

export function fromNullableOrThrow<T extends readonly unknown[]>(
    ...args: T
): { [K in keyof T]: NonNullable<T[K]> } {
    for (let i = 0; i < args.length; i++) {
        if (args[i] == null) {
            throw new Error(`unexpected nullable value at index ${i}`);
        }
    }
    return args as { [K in keyof T]: NonNullable<T[K]> };
}
