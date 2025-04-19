import { Stream } from "effect";
import { Resource, Link, Entry } from "./data.schema.js";
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
declare class DataError extends DataError_base<{
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
export declare const pages: (baseUrl: string, resourceType: string, n?: number, maxPageSize?: number) => Stream.Stream<{
    readonly id: string;
    readonly resourceType: "Bundle";
} & {
    readonly link: readonly Link[];
    readonly entry: readonly Entry<Resource<string, {
        readonly id: string;
        readonly resourceType: string;
    }>>[];
}, DataError, never>;
export {};
