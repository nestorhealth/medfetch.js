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
    /**
     * The next URL state.
     */
    #nextURL: string | null;

    /**
     * One-time flag that checks
     */
    #isNextLinkParsed: boolean;
    #cursor: number;
    #acc: T[];
    #chunks: Generator<string>;
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
                return filteredBundle;
            };
        } else {
            return (resourceType) => {
                const responseText: string = syncFetch(
                    `${baseURL}/${resourceType}`,
                );
                return responseText;
            };
        }
    }

    constructor(
        chunks: Generator<string> | (() => Generator<string>),
        nextPage?: (nextURL: string) => Generator<string>,
    ) {
        this.#nextURL = null;
        this.#isNextLinkParsed = false;
        this.#cursor = 0;
        this.#acc = [];
        this.#chunks = chunks instanceof Function ? chunks() : chunks;
        this.#fetcher = nextPage;
    }

    *#entries(): Generator<T> {
        // Yield any already-parsed entries
        while (this.#cursor < this.#acc.length) {
            yield this.#acc[this.#cursor++];
        }

        // Try to fetch next chunk
        const { done, value } = this.#chunks.next();
        if (done || !value) return;

        // Parse `next` URL from _first_ chunk
        if (!this.#nextURL && !this.#isNextLinkParsed) {
            const link = parseLink(value);
            if (link) {
                this.#isNextLinkParsed = true;
                const nextLink = link.hd.find(
                    (l) => l.relation === "next",
                )?.url;
                if (nextLink) this.#nextURL = nextLink;
            }
        }

        // Parse and append new entries
        const popped = parseEntry(value);
        if (popped && popped.hd?.length > 0) {
            const newEntries = popped.hd
                .slice(this.#cursor)
                .filter(
                    (entry): entry is Entry & { resource: Resource } =>
                        !!entry.resource,
                )
                .map(({ resource }) => resource as T);

            if (newEntries.length > 0) {
                this.#acc.push(...newEntries);
            }
        }

        // Final flush in case new #acc entries appeared
        while (this.#cursor < this.#acc.length) {
            yield this.#acc[this.#cursor++];
        }
    }

    /**
     * Reset the cursor's position back to index 0
     */
    reset() {
        this.#cursor = 0;
    }

    /**
     * Get back a generator wrapper over the Bundle text chunk generator provided
     * that flushes out resources one by one.
     * @returns {@link Resource} generator
     */
    get entries(): Generator<T> {
        return this.#entries();
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
