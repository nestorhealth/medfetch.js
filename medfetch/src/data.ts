import { Array, Data as D, Effect, Option, pipe, Stream } from "effect";
import { Bundle, Data } from "./schema/index.js";

/**
 * Labeled `Data` layer Error
 * that indicates some error occurred while working
 * with the Data Buffers from the `Data` Layer
 *
 * @field message -> the error message
 */
export class DataError extends D.TaggedError("Data")<{
    readonly message: string;
}> {}

/**
 * Gets the link from the `Bundle.link`
 * element where `relation = 'next'`
 * @param bundle the bundle
 * @returns `Option.some` with the url if `'next' in Bundle.link.relation` exists. `Option.none` otherwise.
 *
 */
const nextLink = (bundle: Bundle.Bundle) =>
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
        Effect.andThen(
            response => Effect.liftPredicate(response, res => res.ok, (res) => new DataError({ message: `Response not ok! Status: ${res.status} `}))
        ),
        Effect.andThen(
            response => Effect.tryPromise(() => response.json())
        ),
        Effect.flatMap(Bundle.decodeUnknown),
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
        count += firstPage.entry.length;

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

/**
 * From a given Bundle `Stream`, fold all of its
 * `entry.resource` elements into an array.
 *
 * Example usage:
 *
 * ```ts
 * // Call `pages()` to get the Patient Bundle pages `Stream`,
 * const patientBundles = pages(url, "Patient");
 *
 * // Then call `flatResources()` on the result;
 * const patients = flatResources(patientBundles);
 *
 * // The above can be equivalently rewritten as
 * const patients2 = pages(url, "Patient").pipe(flatResources);
 * ```
 *
 * @param stream the bundle stream
 * @returns Effect wrapped resource list
 */
export const flatResources = (stream: ReturnType<typeof pages>) =>
    stream.pipe(
        Stream.runFold([] as Data.Resource[], (acc, bundle) =>
            pipe(
                bundle.entry,
                Array.filterMap((entry) =>
                    entry.resource !== undefined
                        ? Option.some(entry.resource)
                        : Option.none(),
                ),
                (resources) => Array.appendAll(acc, resources),
            ),
        ),
    );

/**
 * Promised version of `flatResources(pages(...))`;
 * @param params - the pages params
 * @returns a flat array of n resources from the server
 */
export async function pagen(...params: Parameters<typeof pages>) {
    return pipe(pages(...params), flatResources, Effect.runPromise);
}

export function unionKeys(resources: any[]) {
    return resources.reduce((acc: Set<string>, resource) => {
        const keys = Object.keys(resource);
        if (keys.length > 0) {
            return acc.union(new Set(keys));
        }
        return acc;
    }, new Set<string>());
}
