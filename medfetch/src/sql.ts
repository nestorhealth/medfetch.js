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
import type {
    FhirDataType,
    PrimitiveKey,
} from "~/json.types";
import { unzipJSONSchema } from "~/json.page";
import { type RowResolver } from "~/sql.types";

/**
 * Static dummy kysely orm object
 * @param sqlFlavor The dialect enum
 */
export function dummyDialect(sqlFlavor: "sqlite" | "postgresql"): Dialect {
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
const defaultKeyFilter = (key: string) => key.charCodeAt(0) !== 95 && key !== "id";

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
    keyFilter: (key: string) => boolean = defaultKeyFilter
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
        columnKeys: columnKeys
    };
}

export function migrations(
    db: Kysely<any>,
    jsonSchema: JSONSchema7,
    sqlColumnMap: Record<PrimitiveKey, ColumnDataType>,
    resources?: string[]
): RowResolver {
    const definitions = jsonSchema["definitions"] as Record<
        string,
        Exclude<JSONSchema7Definition, boolean>
    >;
    if (!definitions) {
        throw new Error("Bad json schema");
    }
    if (!resources) {
        resources = Object.keys((jsonSchema as any)["discriminator"]["mapping"]);
    }

    const columnMap = new Map<string, Array<ColumnKey>>();
    const schemaEntries = resources.map((resourceType) => {
        const resourceDefinition = definitions[resourceType];
        if (!resourceDefinition || !resourceDefinition["properties"]) {
            throw new Error(`That resource key doesn't exist: "${resourceType}"`);
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

/**
 * Get the default FHIR to SQL database schema
 * @param sqlFlavor The sql text dialect
 * @param resourceTypes The resource types to include
 * @param sqlColumnMap Any primitive element -> sql column included here will be overriden
 * @returns A SQL on FHIR view for the given schema
 */
export async function sqlOnFhir(
    db: Kysely<any>,
    sqlColumnMap: Record<PrimitiveKey, ColumnDataType>,
    resources?: string[]
): Promise<RowResolver> {
    return unzipJSONSchema().then((schema) =>
        migrations(db, schema, sqlColumnMap, resources),
    );
}

/**
 * Just pretend like this is real. For getting back
 * itself when you know the next state and want its static types included
 * in the the typecheck.
 * @param db The previous kysely instance
 * @returns The "new" one
 */
export function set<NewDB>(
  db: Kysely<any>,
): Kysely<NewDB> {
    return db as Kysely<NewDB>;
}

export type { SqlOnFhirDB } from "./sql.types";