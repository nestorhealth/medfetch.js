import type { Resource } from "fhir/r4.js";
import kdv, { type Pathify } from "./kdv.js";
import type { Bundle } from "fhir/r5.js";
import { type FetchPageFn } from "~/sqlite-wasm/vtab.js";

/// Implementation level types
type Link = Pathify<Bundle, `_${string}`>["link"];
type Entry = Pathify<Bundle, `_${string}`>["entry"];

/// Their parse functions
const parseLink = kdv<Link[]>("link", 1);
const parseEntry = kdv<Entry[]>("entry", 1);

/**
 * Function that looks like fetch in its args and returns a plaintext string
 * synchronously.
 */
export type FetchTextSync = (...args: Parameters<typeof fetch>) => string;

/**
 */
export default class Page<T = any> {
    #nextURL: string | null;
    #isNextLinkParsed: boolean;
    #cursor: number;
    #acc: T[];
    #chunks: Generator<string>;
    #rows: Generator<T> | undefined = undefined;
    #fetcher: ((url: string) => Generator<string>) | undefined;

    /**
     * Create a {@link FetchPageFn}. You probably won't need to use this yourself
     * @param baseURL Either a string to indicate the base fhir url or a singular File of a {@link Bundle} that serves as the base of the fhir data
     * @param syncFetch The {@link FetchTextSync} text getter function
     * @returns A page fetcher function
     *
     * @example
     * ```ts
     * // src/sqlite-wasm.worker.ts
     * const pageLoader = Page.fetcher(baseURL, syncFetch);
     * // Map database index to medfetch_module "instance"
     * const dbIndex = dbCount.set();
     * modules[dbIndex] = medfetch_module_alloc(
     *     pageLoader,
     *     sqlite3,
     *     resourcesToRows
     * );
     * ```
     */
    static fetcher(
        baseURL: string | File,
        syncFetch: FetchTextSync,
    ): FetchPageFn {
        if (baseURL instanceof File) {
            const url = URL.createObjectURL(baseURL);
            const bundle: Bundle = JSON.parse(syncFetch(url));
            const pageCache: Map<string, string> = new Map();
            return (resourceType) => {
                let filteredBundle = pageCache.get(resourceType);
                if (!filteredBundle) {
                    filteredBundle = JSON.stringify({
                        ...bundle,
                        entry: bundle.entry?.filter(
                            (entry) =>
                                entry.resource?.resourceType === resourceType,
                        ),
                    });
                    pageCache.set(resourceType, filteredBundle);
                }
                return new Page(function* () {
                    const chunkSize = 400_000;
                    for (let i = 0; i < filteredBundle.length; i += chunkSize) {
                        yield filteredBundle.slice(i, i + chunkSize);
                    }
                });
            };
        } else {
            return (resourceType) => {
                const responseText: string = syncFetch(
                    `${baseURL}/${resourceType}`,
                );
                const generator = function* () {
                    // just yield the whole text for now until
                    yield responseText;
                };

                return new Page(generator(), (nextURL) => {
                    return (function* () {
                        const responseText = syncFetch(nextURL);
                        yield responseText;
                    })();
                });
            };
        }
    }

    constructor(
        chunks: Generator<string> | (() => Generator<string>),
        nextPage?: (nextURL: string) => Generator<string>,
    ) {
        this.#nextURL = null;
        this.#isNextLinkParsed = false;
        this.#cursor = -1;
        this.#acc = [];
        this.#chunks = chunks instanceof Function ? chunks() : chunks;
        this.#fetcher = nextPage;
    }

    *#entries() {
        while (true) {
            if (this.#acc.length > 0) {
                yield this.#acc.shift()!;
            }
            const { done, value } = this.#chunks.next();
            if (done || !value) break;
            if (!this.#nextURL && !this.#isNextLinkParsed) {
                const link = parseLink(value);
                if (link) {
                    this.#isNextLinkParsed = true;
                    const nextLink = link.hd.find(
                        (link) => link.relation === "next",
                    )?.url;
                    if (nextLink) {
                        this.#nextURL = nextLink;
                    }
                }
            }
            const popped = parseEntry(value);
            if (popped) {
                if (popped.hd.length > 0) {
                    const hd = popped.hd
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
                    // TODO - Make this more generic (prolly goes for entire Page class...)
                    this.#acc.push(...hd as any);
                    const front = this.#acc.shift();
                    if (front) {
                        yield front;
                    }
                }
            }
        }
        while (this.#acc.length > 0) yield this.#acc.shift()!;
    }

    /**
     * Get back a generator wrapper over the Bundle text chunk generator provided
     * that flushes out resources one by one.
     * @returns {@link Resource} generator
     */
    get rows(): Generator<T> {
        if (!this.#rows) {
            this.#rows = this.#entries();
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
