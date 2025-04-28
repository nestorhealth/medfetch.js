import type { Resource } from "~/data.schema.js";
import { Schema } from "effect";
import type { SqlValue } from "@sqlite.org/sqlite-wasm";
import { Column, ColumnPath, ViewDefinition } from "~/view";
import { TaggedError } from "effect/Data";

/**
 * Namespaced error class
 */
class MedfetchVtabError extends TaggedError(
    "sqlite-wasm/vtab",
)<{
    message: string;
}> {
    constructor(args: { message: string } | string) {
        if (typeof args === "string") super({ message: args });
        else super(args);
    }
}

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

function getColumnName(path: string | [string, any]) {
    if (typeof path !== "string") return path[0]; // default to the 'key' element in the 2-tuple

    let cleaned = path;
    while (cleaned.match(/\.\w+\([^)]*\)$/)) {
        cleaned = cleaned.replace(/\.\w+\([^)]*\)$/, "");
    }

    // split on '.' and return tail
    const parts = cleaned.split(".");
    return parts[parts.length - 1];
}

/**
 * Generates a ViewDefinition from a `WHERE "fp" = json_array(...)` query clause
 * @param args The vtable function args
 * @returns The ViewDefinition 
 */
export function generateViewDefinition(args: SqlValue[]) {
    const [resourceType, fp] = args;
    if (!resourceType || typeof resourceType !== "string")
        throw new MedfetchVtabError(`unexpected invalid "type" column value (args[0])`);

    if (!fp || typeof fp !== "string") {
        // no fhirpath map, then just return null and default to the whole object
        return null;
    }
    const paths = decodeJsonFp(fp);
    const columns = paths.reduce(
        (acc, pathArg) => {
            if (typeof pathArg === "string") {
                acc.push(({
                    path: pathArg,
                    name: getColumnName(pathArg),
                    collection: true
                }));
            } else if (pathArg.length === 2) {
                const [name, path] = pathArg;
                acc.push(
                    ({
                        path,
                        name,
                        collection: true
                    })
                );
            }
            return acc;
        },
        [] as ColumnPath[]
    );
    return ViewDefinition({
        status: "active",
        name: resourceType,
        resource: resourceType,
        constant: [],
        select: [
            Column({
                column: columns
            }),
        ],
        where: [],
    });
}