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

export const Clarinet = <Value = unknown>(
    kd: { key: string; depth: number },
    _kveq?: <T>(k: string, v: T) => boolean // ignored for now
) => {
    const parser = clarinet.parser();
    let currentKey = "";
    let depth = 0;

    let v: Value | null = null;
    let capturing = false;
    let captureDepth = 0;

    let stack: any[] = [];
    const top = () => stack[stack.length - 1];
    const empty = () => stack.length === 0;

    parser.onkey = (key) => {
        if (key === kd.key && depth === kd.depth) {
            capturing = true;
            captureDepth = depth;
        }
        currentKey = key;
    };

    parser.onopenobject = (key) => {
        if ((depth + 1) === kd.depth && key === kd.key) {
            capturing = true;
            captureDepth = depth + 1;
            stack.push({});
        } else if (capturing) {
            if (empty()) {
                stack.push({});
            } else {
                const obj = {};
                if (Array.isArray(top())) {
                    top().push(obj);
                } else {
                    top()[currentKey] = obj;
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
                if (Array.isArray(top())) {
                    top().push(arr);
                } else {
                    top()[currentKey] = arr;
                }
                stack.push(arr);
            }
        }
        depth++;
    };

    parser.onvalue = (value) => {
        if (capturing) {
            if (stack.length > 0) {
                if (Array.isArray(top())) {
                    top().push(value);
                } else {
                    top()[currentKey] = value;
                }
            } else {
                v = value as Value;
                capturing = false;
            }
        } else if (currentKey === kd.key && depth === kd.depth) {
            v = value as Value;
        }
    };

    parser.oncloseobject = () => {
        depth--;
        if (capturing) {
            const top = stack.pop();
            if (depth === captureDepth) {
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
            if (depth === captureDepth) {
                capturing = false;
                stack = [];
                v = top;
            }
        }
    };


    return (chunk: string): Option.Option<Value> => {
        parser.write(chunk);
        if (v == null) {
            return Option.none();
        } else {
            return Option.some(v);
        }
    };
};


export class Page extends Effect.Service<Page>()("data.Page", {
    sync: () => ({
        buffers: {
            link: "",
            entry: ""
        },
        parser: Clarinet(),
        resources: [] as Resource[],
        flush(stream: Stream.Stream<string>) {
            if (this.resources.length > 0)
                return this.resources.shift();

            const parser = clarinet.parser();
            let insideEntryArray = false;
            let currentResource: any = null;
            let depth = 0;
            let currentKey = "";
            
            parser.onopenarray = () => {
                if (currentKey === "entry") {
                    insideEntryArray = true;
                }
                if (insideEntryArray) depth++;
            };

            parser.onopenobject = () => {
                if (insideEntryArray) {
                    depth++;
                    if (depth === 1) {
                        currentResource = {};
                    }
                }
            };

            parser.onkey = (key) => {
                currentKey = key;
            };

            parser.onvalue = (value) => {
                if (insideEntryArray && currentResource !== null) {
                    currentResource[parser.currentKey] = value;
                }
            };

            parser.oncloseobject = () => {
                if (insideEntryArray) {
                    if (depth === 1) {
                        this.resources.push(currentResource);
                        currentResource = null;
                    }
                    depth--;
                    if (this.resources.length > 0) {
                        parser.close(); // stop parsing after 1+ resource
                    }
                }
            };
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
