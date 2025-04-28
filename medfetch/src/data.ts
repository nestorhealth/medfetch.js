import {
    Array,
    Data,
    Effect,
    Option,
    Schema,
    Stream,
} from "effect";
import { Resource, Link, Entry } from "./data.schema.js";
import clarinet from "clarinet";

class DataError extends Data.TaggedError("medfetch.DataError")<{
    readonly message: string;
}> {
    constructor(msg: string | { message: string } = "Unknown error") {
        if (typeof msg === "string") {
            super({ message: msg });
        } else {
            super({ message: msg.message });
        }
    }
}

type KDVResult<Value> = {
    hd: Value;
    tl: Value[keyof Value] | null;
}
/**
 * Returns a clarinet parser that searches for a JSON key `k` at depth `d` 0
 * indexed (so root is depth 0), and returns value `v` indexed by `k`.
 * @param k The key
 * @param d The depth (first key is depth 1)
 * @returns Some value if it exists, None otherwise.
 */
export const kdv = <Value = unknown>(
    k: string,
    d: number
) => {
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
        if ((depth + 1) === d && key === k) {
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

    return (chunk: string): Option.Option<KDVResult<Value>> => {
        parser.write(chunk);
        if (!!v) {
            return Option.some({
                hd: v,
                tl: null
            });
        } else if (stack.length > 0) {
            const hd = structuredClone(stack[0]);
            if (Array.isArray(hd)) {
                const popped = hd.pop();
                return Option.some({
                    hd: hd as Value,
                    tl: popped as any
                });
            } else {
                const keys = Object.keys(hd);
                const last = keys[keys.length - 1];
                const lastChild = hd[last];
                delete hd[last];
                return Option.some({
                    hd: hd as Value,
                    tl: lastChild as any
                });
            }
        } else {
            return Option.none();
        }
    };
};


export class Page extends Effect.Service<Page>()("data.Page", {
    sync: () => ({
        buffers: {
            link: "",
            entry: ""
        },
        next: kdv<Link[]>("link", 1),
        entries: kdv<Entry[]>("entry", 1),
        resources: [] as Resource[],
        flush(stream: Stream.Stream<string>) {
            if (this.resources.length > 0)
                return this.resources.shift() as Resource;
            const parse = this.entries;
            const acc = this.resources;
            const parsedStream = stream.pipe(
                Stream.map(
                    (chunk) => parse(chunk)
                )
            );
            return parsedStream.pipe(
                Stream.takeUntil(
                    Option.isSome,
                ),
                Stream.runCollect,
                Effect.flatMap(
                    ([ chunk ]) =>
                        Effect.gen(function *() {
                            if (Option.isNone(chunk))
                                return yield *new DataError(`data.Page: unexpected None data chunk`);
                            const { hd } = Option.getOrThrowWith(chunk, () => new DataError(`data.Page: couldn't unwrap the chunk Some Option`));
                            const resources = hd
                                .filter((entry): entry is Entry & { resource: Resource } => !!entry.resource)
                                .map(({ resource }) => resource);
                            if (resources.length === 0)
                                return yield *new DataError(`data.Page: unexpected empty resources from parser`);
                            acc.push(...resources);
                            return acc.shift() as Resource;
                        })
                ),
                Effect.runSync
            )
        }
    }),
    accessors: true
}) {};

const Bundle = Resource("Bundle", {
    link: Link.pipe(Schema.Array),
    entry: Entry(Resource()).pipe(Schema.Array),
});
interface Bundle extends Schema.Schema.Type<typeof Bundle> {}
const decodeBundle = Schema.decodeUnknown(Bundle);

/**
 * Gets the link from the `Bundle.link`
 * element where `relation = 'next'`
 * @param bundle the bundle
 * @returns `Option.some` with the url if `'next' in Bundle.link.relation` exists. `Option.none` otherwise.
 *
 */
const nextLink = (bundle: Bundle) =>
    Array.findFirst(bundle.link, (link) => link.relation === "next").pipe(
        Option.map((link) => link.url),
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
const get = (url: string) =>
    Effect.tryPromise(() => fetch(url)).pipe(
        Effect.andThen((response) =>
            Effect.liftPredicate(
                response,
                (res) => res.ok,
                (res) =>
                    new DataError({
                        message: `Response not ok! Status: ${res.status} `,
                    }),
            ),
        ),
        Effect.andThen((response) => Effect.tryPromise(() => response.json())),
        Effect.flatMap(decodeBundle),
    );

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

        const firstPage = await Effect.runPromise(
            get(`${baseUrl}/${resourceType}?_count=${maxPageSize}`),
        );
        yield firstPage;
        count += firstPage.entry!.length;

        let linkOption = nextLink(firstPage);
        while (Option.isSome(linkOption) && count < upperLimit) {
            const link = Option.getOrThrow(linkOption);
            const page = await Effect.runPromise(get(link));
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
) =>
    Stream.fromAsyncIterable(
        pageIterator(baseUrl, resourceType)(n, maxPageSize),
        (e) => new DataError({ message: String(e) }),
    );
