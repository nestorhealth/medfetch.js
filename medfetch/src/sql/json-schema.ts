import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { sql, type ColumnDataType } from "kysely";
import { get } from "jsonpointer";
import {
    type DataTypeExpression,
    dummyDB,
} from "~/sql/kysely";
import type { VirtualMigrationsConfig } from "~/sql";
import { make } from "~/exception";

const exception = make("medfetch/sql.json-schema")

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

export function createTable(
    tableName: string,
    root: JSONSchema7,
    { drop, generatedPaths, dialect }: VirtualMigrationsConfig,
): string {
    const tb = dummyDB(dialect).schema.createTable(tableName);
    const jsonObjectProps = get(root, `/definitions/${tableName}/properties`);
    if (!jsonObjectProps) {
        return exception(`That json object schema doesn't exist: "${tableName}"`);
    }
    const columns: [string, JSONSchema7][] = Object.entries(jsonObjectProps);
    const finalTb = columns.reduce((tb, [key, value]) => {
        if (typeof value === "boolean") {
            return exception(`Unexpected "boolean"-valued JSON schema for column ${tableName}.${key}`);
        }
        if (drop?.(key)) {
            return tb;
        }

        // generated column case
        if (value.$ref && generatedPaths.has(value.$ref)) {
            const path = generatedPaths.get(value.$ref)!;
            const pathSchema = resolve(get(root, normalize(path)), root);
            const columnType = switchJSONTypeName(dialect, pathSchema);
            if (columnType) {
                tb = tb.addColumn(key, columnType, col =>
                    col.generatedAlwaysAs(
                        sql.raw(`'${key}'->>'${path.split("/").pop()!}'`)
                    )
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

export function migrations(
    jsonSchema: JSONSchema7,
    config: VirtualMigrationsConfig,
): string {
    const definitions = jsonSchema["definitions"] as Record<
        string,
        Exclude<JSONSchema7Definition, boolean>
    >;
    if (!definitions) {
        throw new Error("Bad json schema");
    }
    const tableNames: string[] = Object.keys(
        get(jsonSchema, config.discriminatorPath),
    );
    return tableNames.reduce(
        (acc, tableName) =>
            acc + "; " + createTable(tableName, jsonSchema, config),
    );
}
