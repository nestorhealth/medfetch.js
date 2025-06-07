import {
    Kysely,
} from "kysely";
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
): string {
    const columns = Object.entries(
        jsonSchemaDefinitions[resourceType]["properties"]
    );
    const tb = db.schema.createTable(resourceType);
    const finalTb = columns.reduce((tb, [key]) => {
        if (keyFilter(key)) {
            return tb.addColumn(key, "text");
        } else {
            return tb;
        }
    }, tb);
    return finalTb.compile().sql + ";\n";
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
    ...resourceTypes: string[]
): string {
    const db = kyselyDummy(dialect);
    return resourceTypes.reduce(
        (acc, resourceType) => {
            return acc += tableMigration(
                db,
                resourceType,
                jsonSchema["definitions"]
            )
        },
        ""
    )
}
