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

const UserFp = Schema.Array(Schema.Union(
    Schema.String,
    Schema.Tuple(Schema.String, Schema.String),
    Schema.Tuple(Schema.String, Schema.String, Schema.String),
));

const JsonFromUserFp = Schema.parseJson(UserFp);

/**
 * Decodes the hidden fp column constraint into a 1-3 string tuple element array
 * @param u The fp column string
 * @param options Effect options
 * @returns The validated JSON parsed object (array).
 */
export const decodeJsonFp = Schema.decodeSync(JsonFromUserFp);
