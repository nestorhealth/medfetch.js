import type { Resource } from "~/data.schema.js";
import { Schema } from "effect";

/** The bundle 'shape' aka the stuff we care about from a FHIR bundle
 */
export type Bundle<TResource extends Resource = Resource> = Resource<"Bundle", {
    readonly link: {
        readonly relation: string;
        readonly url: string;
    }[];
    readonly entry: { 
        readonly resource: 
        TResource;
    }[];
}>;

/**
 * `fp` hidden column accepted types once it is JSON parsed
 */
const UserFp = Schema.Array(Schema.Union(
    /* 'any.path.string()'; name becomes 'path' (last non-function subpath) */
    Schema.String,
    /* json_array('column_name', 'column_path') */
    Schema.Tuple(Schema.String, Schema.String),
    /* json_array('forEach' | 'forEachOrNull', 'parent_path', 'child_column_path')'
       'child_column_path' column name defaults to last non-function subpath */
    Schema.Tuple(Schema.String, Schema.String, Schema.String),
    /* json_array('forEach' | 'forEachOrNull', 'parent_path', 'child_column_name', 'child_column_name') */
    Schema.Tuple(Schema.String, Schema.String, Schema.String, Schema.String),
));

/**
 * Decodes the hidden fp column constraint into a 1-3 string tuple element array
 * @param u The fp column string
 * @param options Effect options
 * @returns The validated JSON parsed object (array).
 */
export const decodeJsonFp = Schema.parseJson(UserFp).pipe(Schema.decodeSync);