import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import { strFromU8, unzipSync } from "fflate";
import type { FhirResource } from "fhir/r4";
import {
    DummyDriver,
    ColumnDataType,
    Kysely,
    PostgresAdapter,
    PostgresIntrospector,
    PostgresQueryCompiler,
    SqliteAdapter,
    SqliteIntrospector,
    SqliteQueryCompiler,
} from "kysely";

interface SqliteMaster {
    type: string;
    name: string;
    tbl_name: string;
    rootpage: number;
    sql: string | null;
}

interface SqliteDBGeneric extends SqliteMaster, Record<string, any> {
    sqlite_master: SqliteMaster;
}

/**
 * Static dummy kysely orm object
 * @param dialect The dialect enum
 */
export function kyselyDummy<DB = SqliteDBGeneric>(
    dialect: "sqlite" | "postgresql",
) {
    switch (dialect) {
        case "sqlite": {
            return new Kysely<DB>({
                dialect: {
                    createAdapter: () => new SqliteAdapter(),
                    createDriver: () => new DummyDriver(),
                    createIntrospector: (db) => new SqliteIntrospector(db),
                    createQueryCompiler: () => new SqliteQueryCompiler(),
                },
            });
        }
        case "postgresql": {
            return new Kysely<DB>({
                dialect: {
                    createAdapter: () => new PostgresAdapter(),
                    createDriver: () => new DummyDriver(),
                    createIntrospector: (db) => new PostgresIntrospector(db),
                    createQueryCompiler: () => new PostgresQueryCompiler(),
                },
            });
        }
    }
}

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
        throw new Error();
    });
    if (!response.ok) {
        console.error(`Bad response from endpoint: ${zipURL}`, response.status);
        throw new Error();
    }

    const entries = unzipSync(new Uint8Array(await response.arrayBuffer()));
    const schemaFile = entries[filename];
    if (!schemaFile) {
        console.error(
            `Schema file ${filename} not found in unzipped. Keys are: ${Object.keys(entries)}`,
        );
        throw new Error();
    }

    try {
        return JSON.parse(strFromU8(schemaFile));
    } catch (error) {
        console.error(`Couldn't parse the JSON file ${filename}: ${error}`);
        throw new Error("", { cause: error });
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

interface ColumnMeta {
    name: string;
    dataType: ColumnDataType;
}

type ColumnMapping = {
    dataType: ColumnDataType;
    value: any | null;
};

export type ResolveColumn = (resource: any, index: number) => ColumnMapping;

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
        !key.startsWith("_") && key !== "id",
): { sql: string; columns: Array<ColumnMeta> } {
    if (!jsonSchemaDefinitions[resourceType]) {
        throw new Error(`That key doesn't exist: "${resourceType}"`);
    }
    if (!jsonSchemaDefinitions[resourceType]["properties"]) {
        throw new Error(`That key isn't a Resource: "${resourceType}"`);
    }
    const columnEntries = Object.entries(
        jsonSchemaDefinitions[resourceType]["properties"],
    );
    const tb = db.schema
        .createTable(resourceType)
        .ifNotExists()
        .addColumn("id", "text", (col) => col.primaryKey());

    const columns = new Array<ColumnMeta>();
    columns.push({ name: "id", dataType: "text" });
    const finalTb = columnEntries.reduce((tb, [key, value]) => {
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

        columns.push({
            name: key,
            dataType: columnDataType,
        });
        return tb.addColumn(key, columnDataType);
    }, tb);
    return {
        sql: finalTb.compile().sql + ";\n",
        columns: columns,
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
    const columnMap = new Map<string, Array<ColumnMeta>>();
    const schemaEntries = resourceTypes.map((resourceType) => {
        const migration = tableMigration(
            db,
            resourceType,
            definitions,
            primitives,
        );
        columnMap.set(resourceType, migration.columns);
        return [resourceType, migration.sql] as const;
    });
    const resolveColumn = (resource: any, index: number): ColumnMapping => {
        checkResource(resource);
        if (!columnMap.has(resource["resourceType"])) {
            return { value: null, dataType: "text" };
        }
        const columns = columnMap.get(resource["resourceType"])!;
        const orderedRecord = columns.map((column) => {
            let value = resource[column.name];
            if (value) {
                if (typeof value === "object") {
                    value = JSON.stringify(value);
                }
            }
            return { value: value ?? null, dataType: column.dataType };
        });
        return orderedRecord[index];
    };

    return {
        schemaEntries,
        resolveColumn,
    };
}

/**
 *
 * @param resourceTypes
 * @param map
 * @returns
 */
export async function sqliteOnFhir(
    resourceTypes: string[],
    map: Partial<Record<primitive_t, ColumnDataType>> = {},
) {
    return unzipJSONSchema().then((schema) =>
        sqliteMigrationsSync(schema, resourceTypes, map),
    );
}

// Utility: Determine if a type is a primitive (objects → string)
type IsPrimitive<T> = T extends string | number | boolean | null | undefined
  ? T
  : string;

// 1. Flatten fields: require `id`, drop `_` keys, no optional props, undefined → null
type FlattenFHIRFields<T> = {
  id: string;
} & {
  [K in keyof T as
    K extends "id" ? never :
    K extends `_${string}` ? never :
    K
  ]-?: IsPrimitive<T[K]> extends undefined ? null : Exclude<IsPrimitive<T[K]>, undefined> | null;
};

/**
 * This is just a key value record of resources to their javascript runtimes returned by the database driver,
 * so it isn't really specific to Kysely
 *
 * @template Resources The resource types to include
 */
export type InferKyselyFhirDB<
    Resources extends readonly [
        FhirResource["resourceType"],
        ...FhirResource["resourceType"][],
    ],
> = {
    [R in Resources[number]]: FlattenFHIRFields<
        Extract<FhirResource, { resourceType: R }>
    >;
};
