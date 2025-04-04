import { Schema } from "effect";
import { ow } from "./data.element";
import { Resource } from "./data";
const _Link = Schema.Struct({
    relation: Schema.String,
    url: Schema.String
});
;
export const Link = _Link;
const _Entry = Schema.Struct({
    fullUrl: ow(Schema.String, { exact: true }),
    link: ow(Schema.Array(Link), { exact: true }),
    resource: ow(Resource, { exact: true })
});
;
export const Entry = _Entry;
/**
 * Schema for `Bundle.type`
 *
 * Pulled straight from
 * [Bundle Type](https://build.fhir.org/valueset-bundle-type.html)
 * value set.
 */
export const Type = Schema.Literal("document", "message", "transaction", "transaction-response", "batch", "batch-response", "history", "searchset", "collection", "subscription-notification");
const _Bundle = Schema.Struct({
    resourceType: Schema.tag("Bundle"),
    link: ow(Schema.Array(Link), { exact: true, default: () => [] }),
    entry: ow(Schema.Array(Entry), { exact: true, default: () => [] }),
});
;
;
/**
 * Schema for `Bundle` Resource.
 */
export const Bundle = _Bundle;
/**
 * Bundle constructor
 * @param props the bundle properties
 * @param makeOptions effect's `MakeOptions`
 * @returns a Bundle
 */
export const make = _Bundle.make;
/**
 * Effectful `Bundle` decoder
 * @param u the data stream
 * @param overrideOptions effect's `ParseOptions`
 * @returns a `Bundle` Effect
 */
export const decodeUnknown = Schema.decodeUnknown(Bundle);
/**
 * predicate fn that checks if the given
 * value matches our `Bundle` schema.
 *
 * @param u the unknown data to check
 * @param parseOptions optional `ParseOptions` from Effect
 * @returns true if `u` is a `Bundle`. false otherwise
 */
export const isBundle = Schema.is(Bundle);
