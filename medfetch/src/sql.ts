import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { ColumnDataType, Kysely } from "kysely";
import { kyselyDummy } from "~/sql.kysely";
import { strFromU8, unzipSync } from "fflate";

/**
 * Fetch the JSON schema and get back the parsed version from a zipfile
 * @param zipURL URL of the zip endpoint, defaults to the core fhir schema json zip file from the CI build
 * @param filename Optionally pass in filename
 * @returns The JSON parsed JSON schema object
 */
export async function unzipJSONSchema(
    zipURL: string = "https://build.fhir.org/fhir.schema.json.zip",
    filename = "fhir.schema.json",
): Promise<Exclude<JSONSchema7, boolean>> {
    const response = await fetch(zipURL).catch((error) => {
        console.error(`Couldn't handle "fetch" request: ${error}`);
        process.exit(1);
    });
    if (!response.ok) {
        console.error(`Bad response from endpoint: ${zipURL}`, response.status);
        process.exit(1);
    }

    const entries = unzipSync(new Uint8Array(await response.arrayBuffer()));
    const schemaFile = entries[filename];
    if (!schemaFile) {
        console.error(
            `Schema file ${filename} not found in unzipped. Keys are: ${Object.keys(entries)}`,
        );
        process.exit(1);
    }

    try {
        return JSON.parse(strFromU8(schemaFile));
    } catch (error) {
        console.error(`Couldn't parse the JSON file ${filename}: ${error}`);
        process.exit(1);
    }
}

/**
 * The primitive typenames
 */
type primitive_t =
    | "boolean"
    | "base64Binary"
    | "canonical"
    | "date"
    | "dateTime"
    | "instant"
    | "time"
    | "decimal"
    | "integer"
    | "integer64"
    | "code"
    | "string"
    | "markdown"
    | "id"
    | "oid"
    | "uuid"
    | "positiveInt"
    | "unsignedInt"
    | "url";

function typenameFromRef($ref: string) {
    return $ref.split("/").pop()!;
}

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
    jsonSchemaDefinitions: {
        [x in string]: Exclude<JSONSchema7Definition, boolean>;
    },
    primitiveMap: Record<string, ColumnDataType>,
    keyFilter: (key: string) => boolean = (key) =>
        !key.startsWith("_") && key !== "resourceType" && key !== "id",
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
    const tb = db.schema
        .createTable(resourceType)
        .ifNotExists()
        .addColumn("id", "text", (col) => col.primaryKey());
    const columnSet = new Set<string>(["id"]);
    const finalTb = columns.reduce((tb, [key, value]) => {
        if (typeof value === "boolean") {
            throw new Error();
        }
        if (!keyFilter(key)) {
            return tb;
        }

        let columnDataType: ColumnDataType = "text";
        if (value.$ref) {
            const typename = typenameFromRef(value.$ref);
            columnDataType = primitiveMap[typename] ?? "text";
        }
        columnSet.add(key);
        return tb.addColumn(key, columnDataType);
    }, tb);
    return {
        sql: finalTb.compile().sql + ";\n",
        columns: columnSet,
    };
}

/**
 * Checks an arbitrary object and asserts that "id" in resource and "resourceType" in resource. That's it.
 * @param resource Some arbitrary js value
 * @returns Itself if it is a resource
 */
function checkResource(
    resource: any,
): { id: string; resourceType: string } & Record<string, any> {
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
    return resource;
}

const SQLITE_DEFAULT: Record<primitive_t, ColumnDataType> = {
    boolean: "integer", // SQLite has no native boolean; use 0/1
    base64Binary: "blob", // binary content
    canonical: "text", // like a URI
    code: "text", // constrained string
    id: "text", // short string, but still text
    markdown: "text",
    oid: "text", // e.g., "urn:oid:1.2.3"
    string: "text",
    url: "text",
    uuid: "text", // SQLite has no native UUID type

    date: "text", // stored as ISO 8601 string
    dateTime: "text",
    instant: "text", // precise ISO timestamp
    time: "text",

    decimal: "real", // SQLite uses REAL for float-like values
    integer: "integer",
    integer64: "integer", // same as above; SQLite ints are 64-bit
    positiveInt: "integer",
    unsignedInt: "integer",
};

export function sqliteMigrationsSync(
    jsonSchema: JSONSchema7,
    resourceTypes: string[],
    map: Partial<Record<primitive_t, ColumnDataType>> = {},
) {
    const definitions = jsonSchema["definitions"] as Record<
        string,
        Exclude<JSONSchema7Definition, boolean>
    >;
    if (!definitions) {
        throw new Error("Bad json schema");
    }
    const primitives: Record<primitive_t, ColumnDataType> = {
        ...SQLITE_DEFAULT,
        ...map,
    };
    const db = kyselyDummy("sqlite");
    const columnMap = new Map<string, Set<string>>();
    const sql = resourceTypes.reduce((acc, resourceType) => {
        const { sql, columns } = tableMigration(
            db,
            resourceType,
            definitions,
            primitives,
        );
        columnMap.set(resourceType, columns);
        return (acc += sql);
    }, "");

    const preprocess = (resource: any): object | null => {
        checkResource(resource);
        if (!columnMap.has(resource["resourceType"])) {
            return null;
        }
        const columnSet = columnMap.get(resource["resourceType"])!;
        return Object.fromEntries(
            Object.entries(resource)
                .filter(([key]) => columnSet.has(key))
                .map(([key, value]) => [key, value]),
        );
    };

    return {
        sql,
        preprocess,
    };
}

export async function sqliteMigrations(
    resourceTypes: string[],
    map: Partial<Record<primitive_t, ColumnDataType>> = {},
) {
    return unzipJSONSchema().then(
        (schema) => sqliteMigrationsSync(schema, resourceTypes, map)
    )
}
