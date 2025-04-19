import { Schema } from "effect";
import { Resource } from "./data";
declare const _Link: Schema.Struct<{
    relation: typeof Schema.String;
    url: typeof Schema.String;
}>;
/**
 * Schema for `Bundle.link`
 */
export interface Link extends Schema.Schema.Type<typeof _Link> {
}
export declare const Link: Schema.Schema<Link>;
declare const _Entry: Schema.Struct<{
    fullUrl: Schema.optionalWith<typeof Schema.String, {
        exact: true;
    }>;
    link: Schema.optionalWith<Schema.Array$<Schema.Schema<Link, Link, never>>, {
        exact: true;
    }>;
    resource: Schema.optionalWith<Schema.Schema<Resource, Resource, never>, {
        exact: true;
    }>;
}>;
/**
 * Schema for `Bundle.entry`
 */
export interface Entry extends Schema.Schema.Type<typeof _Entry> {
}
export declare const Entry: Schema.Schema<Entry>;
/**
 * Schema for `Bundle.type`
 *
 * Pulled straight from
 * [Bundle Type](https://build.fhir.org/valueset-bundle-type.html)
 * value set.
 */
export declare const Type: Schema.Literal<["document", "message", "transaction", "transaction-response", "batch", "batch-response", "history", "searchset", "collection", "subscription-notification"]>;
export type Type = typeof Type.Type;
declare const _Bundle: Schema.Struct<{
    resourceType: Schema.tag<"Bundle">;
    link: Schema.optionalWith<Schema.Array$<Schema.Schema<Link, Link, never>>, {
        exact: true;
        default: () => never[];
    }>;
    entry: Schema.optionalWith<Schema.Array$<Schema.Schema<Entry, Entry, never>>, {
        exact: true;
        default: () => never[];
    }>;
}>;
export interface FHIRBundle extends Schema.Schema.Encoded<typeof _Bundle> {
}
export interface Bundle extends Schema.Schema.Type<typeof _Bundle> {
}
/**
 * Schema for `Bundle` Resource.
 */
export declare const Bundle: Schema.Schema<Bundle, FHIRBundle>;
/**
 * Bundle constructor
 * @param props the bundle properties
 * @param makeOptions effect's `MakeOptions`
 * @returns a Bundle
 */
export declare const make: (...args: Parameters<typeof _Bundle.make>) => Bundle;
/**
 * Effectful `Bundle` decoder
 * @param u the data stream
 * @param overrideOptions effect's `ParseOptions`
 * @returns a `Bundle` Effect
 */
export declare const decodeUnknown: (u: unknown, overrideOptions?: import("effect/SchemaAST").ParseOptions) => import("effect/Effect").Effect<Bundle, import("effect/ParseResult").ParseError, never>;
/**
 * predicate fn that checks if the given
 * value matches our `Bundle` schema.
 *
 * @param u the unknown data to check
 * @param parseOptions optional `ParseOptions` from Effect
 * @returns true if `u` is a `Bundle`. false otherwise
 */
export declare const isBundle: (u: unknown, overrideOptions?: import("effect/SchemaAST").ParseOptions | number) => u is Bundle;
export {};
