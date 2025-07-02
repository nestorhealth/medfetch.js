import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import type { Reference } from "fhir/r4";
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
    Dialect,
} from "kysely";
import type { FhirDataType, PrimitiveKey } from "./json/json.parse.js";
import { unzipJSONSchema } from "./json/json.page.js";

/**
 * Default column map of FHIR type to SQL type for SQLite
 */
export const DEFAULT_SQLITE_FROM_FHIR = {
    boolean: "integer", // SQLite has no native boolean; use 0/1
    base64Binary: "blob", // binary content
    canonical: "text", // like a URI
    code: "text", // constrained string
    id: "text", // short string, but still text
    oid: "text", // e.g., "urn:oid:1.2.3"
    string: "text",
    url: "text",
    uri: "text",
    uuid: "text", // SQLite has no native UUID type

    date: "text", // stored as ISO 8601 string
    dateTime: "text",
    instant: "text", // precise ISO timestamp
    time: "text",

    decimal: "real", // SQLite uses REAL for float-like values
    integer: "integer",
    positiveInt: "integer",
    unsignedInt: "integer",
} satisfies Record<PrimitiveKey, ColumnDataType>;

/**
 * Default column map of FHIR type to SQL type for Postgresql
 */
export const DEFAULT_POSTGRESQL_FROM_FHIR = {
    base64Binary: "bytea", // PostgreSQL binary
    canonical: "text", // FHIR URI-like string
    code: "text", // Enumerated string
    id: "text", // Short string
    oid: "text", // FHIR OID (not PG OID type)
    string: "text",
    uri: "text",
    url: "text",
    uuid: "uuid", // PostgreSQL has native UUID type

    // Boolean and integer types
    boolean: "boolean",
    integer: "integer",
    positiveInt: "integer", // PostgreSQL doesn't distinguish unsigned
    unsignedInt: "integer",

    // Decimal (floating point)
    decimal: "numeric", // Arbitrary precision decimal (better than float)

    // Temporal types
    date: "date", // Calendar date
    dateTime: "timestamptz", // Timestamp with time zone
    instant: "timestamptz", // FHIR Instant → PostgreSQL timestamp
    time: "time", // Time without date
} satisfies Record<PrimitiveKey, ColumnDataType>;

const DEFAULT_JSON_SCHEMA_OPTIONS = {
    jsonSchemaURL: "https://build.fhir.org/fhir.schema.json.zip",
    jsonSchemaFilename: "fhir.schema.json",
    scope: [],
} satisfies JSONSchemaOptions;

/**
 * The sql text syntaxes the fetcher works with
 */
export type SqlFlavor = "sqlite" | "postgresql";

type ScalarColumnFrom<T> =
    Exclude<T, undefined> extends string | number | boolean
        ? Exclude<T, undefined>
        : string;

/**
 * Turn some type T into something that looks like a row
 * (a 1-level record with objects / arrays turned into strings)
 */
type Rowify<T> = {
    [K in keyof T]-?: undefined extends T[K]
        ? NonNullable<ScalarColumnFrom<T[K]>> | null
        : ScalarColumnFrom<T[K]>;
};

/**
 * Generic for a sql on fhir "dialect"
 */
export interface SqlOnFhirDialect<Resources extends { resourceType: string }>
    extends Dialect {
    readonly $db: {
        [R in Resources["resourceType"]]: Rowify<Resources["resourceType"]> & {
            id: string;
        };
    };
}

/**
 * The JSON field presented as a "column" with an
 * additional {@link dataType} field attached
 */
interface ColumnValue {
    dataType: ColumnDataType;
    value: any | null;
}

/**
 * The underlying js-land data generated that the database has access to at runtime
 * @internal
 */
export interface SQLResolver {
    /**
     * List of resource type to sql migration text associations held in a 2-tuple
     */
    migrations: Array<
        [
            string, // ResourceType
            string, // Migration Text
        ]
    >;

    /**
     * From the fetched resource presented in arg0 and the given
     * index at arg1, give me the corresponding column value along with the
     * sql datatype you saved in the internal schema
     * @param resource The runtime fetched resource. Don't assume this is validated
     * @param index The column index
     * @returns The sql data type the map has saved for this resource and this index
     */
    index: (resource: unknown, index: number) => ColumnValue;
}

/**
 * Static dummy kysely orm object
 * @param sqlFlavor The dialect enum
 */
export function dummy(sqlFlavor: "sqlite" | "postgresql"): Dialect {
    switch (sqlFlavor) {
        case "sqlite": {
            return {
                createAdapter: () => new SqliteAdapter(),
                createDriver: () => new DummyDriver(),
                createIntrospector: (db) => new SqliteIntrospector(db),
                createQueryCompiler: () => new SqliteQueryCompiler(),
            } satisfies Dialect;
        }
        case "postgresql": {
            return {
                createAdapter: () => new PostgresAdapter(),
                createDriver: () => new DummyDriver(),
                createIntrospector: (db) => new PostgresIntrospector(db),
                createQueryCompiler: () => new PostgresQueryCompiler(),
            };
        }
    }
}

/**
 * Expects the JSON schema $ref word after the last '/' character
 * to be a {@link FhirDataType}
 * @param $ref The refstring
 * @returns Coerced as a FhirDataType string literal
 */
function typenameFromRef($ref: string): FhirDataType {
    return $ref.split("/").pop()! as any;
}

interface ColumnKey {
    name: string;
    fhirType: FhirDataType;
    dataType: ColumnDataType;
}

interface ColumnValue {
    dataType: ColumnDataType;
    value: any | null;
}

interface FhirTableMigration {
    sql: string;
    columnKeys: Array<ColumnKey>;
}

/**
 * The type for resolving a resource's field from a column index
 */
export type ResolveColumn = (resource: any, index: number) => ColumnValue;

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

/**
 * Default key filter callback for JSON schema. Removes extension keys
 * (those that begin with '_') and isn't equal to "id" (this by default sets that to the primary key)
 * @param key The JSON key name
 * @returns If {@link key} should be iterated over in the column builder
 */
const defaultKeyFilter = (key: string) =>
    key.charCodeAt(0) !== 95 && key !== "id";

/**
 * Get the "create table" migration text for the given resource type from the data
 * in the json schema
 * @param db The kysely database
 * @param resourceType The resourceType, this will be the name of the table
 * @param jsonSchemaDefinitions The definitions object map
 * @param keyFilter What keys to take out? Default to extended fields (start with "_") and filters out "resourceType"
 * @returns The table migration text
 */
function generateFhirTableMigration(
    resourceType: string,
    columns: [string, JSONSchema7Definition][],
    db: Kysely<any>,
    sqlColumnMap: Record<string, ColumnDataType>,
    keyFilter: (key: string) => boolean = defaultKeyFilter,
): FhirTableMigration {
    const tb = db.schema
        .createTable(resourceType)
        .ifNotExists()
        .addColumn("id", "text", (col) => col.primaryKey());

    const columnKeys = new Array<ColumnKey>();
    columnKeys.push({ name: "id", dataType: "text", fhirType: "string" });
    const finalTb = columns.reduce((tb, [key, value]) => {
        if (typeof value === "boolean") {
            throw new Error();
        }
        if (!keyFilter(key)) {
            return tb;
        }

        let columnDataType: ColumnDataType = "text";
        let typename: FhirDataType = "string";
        if (value.$ref) {
            typename = typenameFromRef(value.$ref);
            columnDataType = sqlColumnMap[typename] ?? "text";
        }

        columnKeys.push({
            name: key,
            dataType: columnDataType,
            fhirType: typename,
        });
        return tb.addColumn(key, columnDataType);
    }, tb);
    return {
        sql: finalTb.compile().sql + ";\n",
        columnKeys: columnKeys,
    };
}

function generateMigrations(
    db: Kysely<any>,
    jsonSchema: JSONSchema7,
    sqlColumnMap: Record<PrimitiveKey, ColumnDataType>,
    resources?: string[],
): SQLResolver {
    const definitions = jsonSchema["definitions"] as Record<
        string,
        Exclude<JSONSchema7Definition, boolean>
    >;
    if (!definitions) {
        throw new Error("Bad json schema");
    }
    if (!resources) {
        resources = Object.keys(
            (jsonSchema as any)["discriminator"]["mapping"],
        );
    }

    const columnMap = new Map<string, Array<ColumnKey>>();
    const schemaEntries = resources.map((resourceType) => {
        const resourceDefinition = definitions[resourceType];
        if (!resourceDefinition || !resourceDefinition["properties"]) {
            throw new Error(
                `That resource key doesn't exist: "${resourceType}"`,
            );
        }
        const resourceProperties = resourceDefinition["properties"];
        const migration = generateFhirTableMigration(
            resourceType,
            Object.entries(resourceProperties),
            db,
            sqlColumnMap,
        );
        columnMap.set(resourceType, migration.columnKeys);
        return [resourceType, migration.sql] as const;
    });

    const resolveColumn = (resource: any, index: number): ColumnValue => {
        checkResource(resource);
        if (!columnMap.has(resource["resourceType"])) {
            return { value: null, dataType: "text" };
        }
        const columnKeys = columnMap.get(resource["resourceType"])!;
        const orderedRecord = columnKeys.map((column) => {
            let value = resource[column.name];
            if (value) {
                if (typeof value === "object") {
                    switch (column.fhirType) {
                        // Just take its
                        case "Reference": {
                            value = (value as Reference).reference ?? null;
                            break;
                        }
                        default: {
                            value = JSON.stringify(value);
                        }
                    }
                }
            }
            return { value: value ?? null, dataType: column.dataType };
        });
        return orderedRecord[index];
    };

    return {
        migrations: schemaEntries as any,
        index: resolveColumn,
    };
}

type JSONSchemaOptions = {
    jsonSchemaURL: string | undefined;
    jsonSchemaFilename: string | undefined;
    scope: string[];
};

/**
 * Create a FHIR to SQL database schema
 * @param sqlFlavor The sql text dialect
 * @param resourceTypes The resource types to include
 * @param config Optional options. From {@link JSONSchemaOptions}
 * @returns A SQL on FHIR view for the given schema
 */
export async function fromFhir(
    dialect: SqlFlavor,
    sqlColumnMap: Record<PrimitiveKey, ColumnDataType>,
    jsonSchemaOptions: Partial<JSONSchemaOptions>,
): Promise<SQLResolver> {
    const { jsonSchemaURL, jsonSchemaFilename, scope } = jsonSchemaOptions;
    const db = new Kysely({
        dialect: dummy(dialect),
    });
    return unzipJSONSchema(
        jsonSchemaURL ?? DEFAULT_JSON_SCHEMA_OPTIONS.jsonSchemaURL,
        jsonSchemaFilename ?? DEFAULT_JSON_SCHEMA_OPTIONS.jsonSchemaFilename,
    ).then((schema) => generateMigrations(db, schema, sqlColumnMap, scope));
}
