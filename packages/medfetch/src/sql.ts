import { JSONSchema7, JSONSchema7Definition } from "json-schema";
import type { FhirResource, Reference } from "fhir/r4";
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
import type { FhirDataType, PrimitiveKey } from "~/data.types";
import { unzipJSONSchema } from "~/data";

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
 * @param sqlFlavor The dialect enum
 */
export function kyselyDummy<DB = SqliteDBGeneric>(
    sqlFlavor: "sqlite" | "postgresql",
) {
    switch (sqlFlavor) {
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
    columns: Array<ColumnKey>;
}

/**
 * The type for resolving a resource's field from a column index
 */
export type ResolveColumn = (resource: any, index: number) => ColumnValue;

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
    db: Kysely<any>,
    resourceType: string,
    jsonSchemaDefinitions: {
        [x in string]: Exclude<JSONSchema7Definition, boolean>;
    },
    primitiveMap: Record<string, ColumnDataType>,
    keyFilter: (key: string) => boolean = (key) =>
        !key.startsWith("_") && key !== "id",
): FhirTableMigration {
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

    const columns = new Array<ColumnKey>();
    columns.push({ name: "id", dataType: "text", fhirType: "string" });
    const finalTb = columnEntries.reduce((tb, [key, value]) => {
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
            columnDataType = primitiveMap[typename] ?? "text";
        }

        columns.push({
            name: key,
            dataType: columnDataType,
            fhirType: typename,
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

type SqlFlavor = "sqlite" | "postgresql";

const DEFAULT_COLUMN_MAP: Record<
    SqlFlavor,
    Record<PrimitiveKey, ColumnDataType>
> = {
    sqlite: {
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
    },
    postgresql: {
        // Binary and string-like
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
    },
};

export function migrations(
    sqlFlavor: SqlFlavor,
    jsonSchema: JSONSchema7,
    resourceTypes: string[],
    override: Partial<Record<PrimitiveKey, ColumnDataType>> = {},
) {
    const definitions = jsonSchema["definitions"] as Record<
        string,
        Exclude<JSONSchema7Definition, boolean>
    >;
    if (!definitions) {
        throw new Error("Bad json schema");
    }
    const primitives: Record<PrimitiveKey, ColumnDataType> = {
        ...DEFAULT_COLUMN_MAP[sqlFlavor],
        ...override,
    };
    const db = kyselyDummy(sqlFlavor);
    const columnMap = new Map<string, Array<ColumnKey>>();
    const schemaEntries = resourceTypes.map((resourceType) => {
        const migration = generateFhirTableMigration(
            db,
            resourceType,
            definitions,
            primitives,
        );
        columnMap.set(resourceType, migration.columns);
        return [resourceType, migration.sql] as const;
    });

    const resolveColumn = (resource: any, index: number): ColumnValue => {
        checkResource(resource);
        if (!columnMap.has(resource["resourceType"])) {
            return { value: null, dataType: "text" };
        }
        const columns = columnMap.get(resource["resourceType"])!;
        const orderedRecord = columns.map((column) => {
            let value = resource[column.name];
            if (value) {
                if (typeof value === "object") {
                    switch (column.fhirType) {
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
        schemaEntries,
        resolveColumn,
    };
}

/**
 * Get the default FHIR to SQL database schema
 * @param sqlFlavor The sql text dialect
 * @param resourceTypes The resource types to include
 * @param overridePrimitives Any primitive element -> sql column included here will be overriden
 * @returns A SQL on FHIR view for the given schema
 */
export async function sqlOnFhir(
    sqlFlavor: SqlFlavor,
    resourceTypes: string[],
    overridePrimitives: Partial<Record<PrimitiveKey, ColumnDataType>> = {},
) {
    return unzipJSONSchema().then(schema => migrations(sqlFlavor, schema, resourceTypes, overridePrimitives));
}

// Utility: Determine if a type is a primitive (objects → string)
type IsPrimitiveValue<T> = T extends
    | string
    | number
    | boolean
    | null
    | undefined
    ? T
    : string;

// 1. Flatten fields: require `id`, drop `_` keys, no optional props, undefined → null
type FlattenFHIRFields<T> = {
    id: string;
} & {
    [K in keyof T as K extends "id"
        ? never
        : K extends `_${string}`
          ? never
          : K]-?: IsPrimitiveValue<T[K]> extends undefined
        ? null
        : Exclude<IsPrimitiveValue<T[K]>, undefined> | null;
};

/**
 * This is just a key value record of resources to their javascript runtimes returned by the database driver,
 * so it isn't really specific to Kysely
 *
 * @template Resources The resource types to include
 */
export type InferKyselyFhir<
    Resources extends readonly [
        FhirResource["resourceType"],
        ...FhirResource["resourceType"][],
    ],
> = {
    [R in Resources[number]]: FlattenFHIRFields<
        Extract<FhirResource, { resourceType: R }>
    >;
};
