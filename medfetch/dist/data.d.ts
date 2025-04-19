import { Effect, Stream } from "effect";
import { Bundle, Data } from "./schema/index.js";
declare const DataError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "Data";
} & Readonly<A>;
/**
 * Labeled `Data` layer Error
 * that indicates some error occurred while working
 * with the Data Buffers from the `Data` Layer
 *
 * @field message -> the error message
 */
export declare class DataError extends DataError_base<{
    readonly message: string;
}> {
}
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
export declare const pages: (baseUrl: string, resourceType: string, n?: number, maxPageSize?: number) => Stream.Stream<Bundle.Bundle, DataError, never>;
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
export declare const flatResources: (stream: ReturnType<typeof pages>) => Effect.Effect<Data.Resource[], DataError, never>;
/**
 * Promised version of `flatResources(pages(...))`;
 * @param params - the pages params
 * @returns a flat array of n resources from the server
 */
export declare function pagen(...params: Parameters<typeof pages>): Promise<Data.Resource[]>;
export declare function unionKeys(resources: any[]): Set<string>;
export {};
