import { Kysely } from "kysely";
import { kyselyDummy } from "~/sql.kysely";
import { SqlDialect } from "~/sql.types";

/**
 * Get the "create table" migration text for the given resource type from the data
 * in the json schema
 * @param db The kysely database
 * @param resourceType The resourceType, this will be the name of the table
 * @param jsonSchemaDefinitions The definitions object map
 * @param keyFilter What keys to take out? Default to extended fields (start with "_") and filters out "resourceType"
 * @returns The table migration text
 */
function tableMigration(
    db: Kysely<any>,
    resourceType: string,
    jsonSchemaDefinitions: any,
    keyFilter: (key: string) => boolean = (key) =>
        !key.startsWith("_") && key !== "resourceType",
): { sql: string; columns: Set<string> } {
    if (!jsonSchemaDefinitions[resourceType]) {
        throw new Error(`That key doesn't exist: "${resourceType}"`);
    }
    if (!jsonSchemaDefinitions[resourceType]["properties"]) {
        throw new Error(`That key isn't a Resource: "${resourceType}"`);
    }
    const columns = Object.entries(
        jsonSchemaDefinitions[resourceType]["properties"],
    );
    const tb = db.schema.createTable(resourceType);
    const columnSet = new Set<string>();
    const finalTb = columns.reduce((tb, [key]) => {
        if (keyFilter(key)) {
            columnSet.add(key);
            return tb.addColumn(key, "text");
        } else {
            return tb;
        }
    }, tb);
    return {
        sql: finalTb.compile().sql + ";\n",
        columns: columnSet,
    };
}

/**
 * Get the corresponding database migration from a big FHIR schema
 * @param dialect The sql dialect
 * @param jsonSchema The FHIR JSON schema root
 * @returns The migration text if successful. Throws otherwise
 */
export function migrations(
    dialect: SqlDialect,
    jsonSchema: any,
    resourceTypes: string[],
): {
    sql: string;
    preprocess: (resourceType: any) => object | null;
} {
    const db = kyselyDummy(dialect);
    const columnMap = new Map<string, Set<string>>();
    const sql = resourceTypes.reduce((acc, resourceType) => {
        const { sql, columns } = tableMigration(
            db,
            resourceType,
            jsonSchema["definitions"],
        );
        columnMap.set(resourceType, columns);
        return (acc += sql);
    }, "");
    const preprocess = (resource: any): object | null => {
        if (typeof resource !== "object") {
            throw new Error(
                `migrations.preprocess: That's not an object: ${typeof resource}`,
            );
        }
        if (!("id" in resource && "resourceType" in resource)) {
            throw new Error(
                `migrations.preprocess: I don't know how to preprocess that: (has_id=${"id" in resource}, has_resourceType=${"resourceType" in resource})`,
            );
        }
        if (!columnMap.has(resource["resourceType"])) {
            return null;
        }

        const columnSet = columnMap.get(resource["resourceType"])!;
        return Object.fromEntries(
            Object.entries(resource)
                .filter(([key]) => columnSet.has(key))
                .map(([key, value]) => [key, value])
        );
    };

    return {
        sql,
        preprocess,
    };
}
