import type { Resource } from "fhir/r4.js";
import { kdvParser, type PathValue } from "./json.parse.js";
import { strFromU8, unzipSync } from "fflate";
import type { JSONSchema7 } from "json-schema";
import type { Bundle } from "fhir/r5.js";
import { PageLoaderFn } from "~/sqlite-wasm/vtab.js";

/// Implementation level types
type Link = PathValue<Bundle, "Bundle">["link"];
type Entry = PathValue<Bundle, "Bundle">["entry"];

/// Their parse functions
const parseLink = kdvParser<Link[]>("link", 1);
const parseEntry = kdvParser<Entry[]>("entry", 1);

export type FetchTextSync = (...args: Parameters<typeof fetch>) => string;

/**
 * Parse a synchronous text generator of a Bundle
 * and yields a generator of its resources
 */
export class Page {
    #nextURL: string | null;
    #isLinkParsed: boolean;
    #cursor: number;
    #acc: Resource[];
    #chunks: Generator<string>;
    #rows: Generator<Resource> | undefined = undefined;
    #fetcher: ((url: string) => Generator<string>) | undefined;

    /**
     * Create a {@link PageLoaderFn}. You probably won't need to use this yourself
     * @param baseURL Either a string to indicate the base fhir url or a singular File of a {@link Bundle} that serves as the base of the fhir data
     * @param syncFetch The {@link FetchTextSync} text getter function
     * @returns A page loader
     *
     * @example
     * ```ts
     * // src/sqlite-wasm.worker.ts
     * const pageLoader = Page.createLoader(baseURL, syncFetch);
     * // Map database index to medfetch_module "instance"
     * const dbIndex = dbCount.set();
     * modules[dbIndex] = medfetch_module_alloc(
     *     pageLoader,
     *     sqlite3,
     *     resourcesToRows
     * );
     * ```
     */
    static createLoader(
        baseURL: string | File,
        syncFetch: FetchTextSync,
    ): PageLoaderFn {
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
                let responseText: string = syncFetch(
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
        this.#isLinkParsed = false;
        this.#cursor = -1;
        this.#acc = [];
        this.#chunks = chunks instanceof Function ? chunks() : chunks;
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
                const link = parseLink(value);
                if (link) {
                    this.#isLinkParsed = true;
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
                    this.#acc.push(...hd);
                    let front = this.#acc.shift();
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
 * Fetch the JSON schema and get back the parsed version from a zipfile
 * @param zipURL URL of the zip endpoint, defaults to the core fhir schema json zip file from the CI build
 * @param filename Optionally pass in filename
 * @returns The JSON parsed JSON schema object
 */
export async function unzipJSONSchema(
    zipURL: string,
    filename: string,
): Promise<JSONSchema7> {
    const response = await fetch(zipURL).catch((error) => {
        console.error(`Couldn't handle "fetch" request: ${error}`);
        throw new Error();
    });
    if (!response.ok) {
        console.error(`Bad response from endpoint: ${zipURL}`, response.status);
        throw new Error();
    }

    const entries = unzipSync(new Uint8Array(await response.arrayBuffer()));
    const schemaFile = entries[filename];
    if (!schemaFile) {
        console.error(
            `Schema file ${filename} not found in unzipped. Keys are: ${Object.keys(entries)}`,
        );
        throw new Error();
    }

    try {
        const parsed: JSONSchema7 = JSON.parse(strFromU8(schemaFile));
        parsed.definitions = Object.fromEntries(
            Object.entries(parsed.definitions!).filter(
                ([key]) => !key.includes("_"),
            ),
        );
        return parsed;
    } catch (error) {
        console.error(`Couldn't parse the JSON file ${filename}: ${error}`);
        throw new Error("");
    }
}
