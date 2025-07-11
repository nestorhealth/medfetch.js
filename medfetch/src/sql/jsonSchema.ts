import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { sql, type ColumnDataType } from "kysely";
import { get } from "jsonpointer";
import { type DataTypeExpression, dummyDB } from "~/sql/kysely";
import type { VirtualMigrationConfig } from "~/sql";
import { makeError } from "~/context";

const exception = makeError("medfetch/sql.json-schema");

function resolveRef(ref: string, rootSchema: JSONSchema7): JSONSchema7 {
    if (!ref.startsWith("#")) {
        throw new Error(
            `resolveRef() can only handle local references (right now)!`,
        );
    }
    const pointer = ref.slice(1); // gets rid of leading #
    const resolved = get(rootSchema, pointer);
    if (!resolved) {
        throw new Error(
            `"resolveRef" couldn't resolve schema ref ${ref} from json-schema ${rootSchema.$schema}`,
        );
    }
    return resolved;
}

function resolve(schema: JSONSchema7, root: JSONSchema7): JSONSchema7 {
    if (schema.$ref) {
        return resolveRef(schema.$ref, root);
    }
    return schema;
}

function boolean(dialect: "sqlite" | "postgresql"): ColumnDataType {
    if (dialect === "sqlite") {
        return "integer";
    } else {
        return "boolean";
    }
}

const switchJSONTypeName = (
    dialect: "sqlite" | "postgresql",
    schema: JSONSchema7,
): DataTypeExpression | null => {
    const typeName = Array.isArray(schema.type) ? schema.type[0] : schema.type;
    switch (typeName) {
        case "object":
        case "array":
        case "string":
            return "text";
        case "integer":
            return "integer";
        case "number":
            return "real";
        case "boolean":
            return boolean(dialect);
        case "null":
            return null;
        default:
            return null;
    }
};

/**
 * Normalizes a JSON Pointer path by removing the leading '#' if present.
 * E.g. '#/foo/bar' → '/foo/bar'
 *
 * @param pointer A JSON Pointer string
 * @returns The normalized pointer path
 */
function normalize(pointer: string): string {
    return pointer.startsWith("#") ? pointer.slice(1) : pointer;
}

function createTable(
    tableName: string,
    root: JSONSchema7,
    { drop, generatedPaths, dialect }: VirtualMigrationConfig,
): string {
    const tb = dummyDB(dialect).schema.createTable(tableName);
    const jsonObjectProps = get(root, `/definitions/${tableName}/properties`);
    if (!jsonObjectProps) {
        return exception(
            `That json object schema doesn't exist: "${tableName}"`,
        );
    }
    const columns: [string, JSONSchema7][] = Object.entries(jsonObjectProps);
    const finalTb = columns.reduce((tb, [key, value]) => {
        if (typeof value === "boolean") {
            return exception(
                `Unexpected "boolean"-valued JSON schema for column ${tableName}.${key}`,
            );
        }
        if (drop?.(key)) {
            return tb;
        }

        // generated column case
        if (value.$ref && generatedPaths?.has(value.$ref)) {
            const path = generatedPaths.get(value.$ref)!;
            const pathSchema = resolve(get(root, normalize(path)), root);
            const columnType = switchJSONTypeName(dialect, pathSchema);
            if (columnType) {
                tb = tb.addColumn(key, columnType, (col) =>
                    col.generatedAlwaysAs(
                        sql.raw(`'${key}'->>'${path.split("/").pop()!}'`),
                    ),
                );
            }
        } else {
            const columnType = switchJSONTypeName(
                dialect,
                resolve(value, root),
            );
            if (columnType) {
                tb = tb.addColumn(key, columnType);
            }
        }

        return tb;
    }, tb);
    const plaintext = finalTb.compile().sql;
    return plaintext;
}

/**
 * Get back the migration text from a JSON schema. This is just 1 implementation of doing so,
 * and certainly isn't the only one possible! This is mainly here to provide *some* option out the box
 * for deriving SQL migration text from a JSON schema.
 * @param schemaObject The JSON schema object
 * @param config Any options from {@link VirtualMigrationConfig}
 * @returns The plaintext migration text
 *
 * @example
 * An sqlite migration
 * ```ts
 * const myJSONSchema = {...}
 * const migrations = jsonSchema(myJSONSchema, {
 *   discriminatorPath: "/discriminator",
 *   dialect: "sqlite"
 * });
 * ```
 */
export default function jsonSchema(
    schemaObject: JSONSchema7,
    config: VirtualMigrationConfig,
): string {
    const definitions = schemaObject["definitions"] as Record<
        string,
        Exclude<JSONSchema7Definition, boolean>
    >;
    if (!definitions) {
        throw new Error("Bad json schema");
    }
    const tableNames: string[] = Object.keys(
        get(schemaObject, config.discriminatorPath),
    );
    return tableNames.reduce(
        (acc, tableName) =>
            acc + "; " + createTable(tableName, schemaObject, config),
    );
}
