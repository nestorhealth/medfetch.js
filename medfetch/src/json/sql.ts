import type { JSONSchema7, JSONSchema7Definition } from "json-schema";
import {
    DummyDriver,
    Kysely,
    PostgresAdapter,
    PostgresIntrospector,
    PostgresQueryCompiler,
    SqliteAdapter,
    SqliteIntrospector,
    SqliteQueryCompiler,
    Dialect,
    ColumnMetadata,
    isColumnDataType,
    isExpression,
    type ColumnDataType,
    type Expression,
} from "kysely";
import { get, set } from "jsonpointer";

type DataTypeExpression = ColumnDataType | Expression<any>;

function tail(s: string) {
    return s.split("/").pop()!;
}

function resolveRef(ref: string, rootSchema: JSONSchema7): JSONSchema7 | null {
    if (!ref.startsWith("#")) {
        throw new Error(
            `resolveRef() can only handle local references right now!`,
        );
    }
    const pointer = ref.slice(1); // gets rid of leading #
    const resolved = get(rootSchema, pointer);
    return resolved ?? null;
}

export function isDataTypeExpression(t: unknown): t is DataTypeExpression {
    return (typeof t === "string" && isColumnDataType(t)) || isExpression(t);
}

function resolveColumnMetadata(
    name: string,
    columnSchema: JSONSchema7,
    root: JSONSchema7,
): ColumnMetadata {
    let schema: JSONSchema7;
    // at leaf
    if (columnSchema.type || columnSchema.const || columnSchema.enum) {
        schema = columnSchema;
    } else if (columnSchema.$ref) {
        schema = resolveRef(columnSchema.$ref, root) ?? {
            type: "string",
            description: `Unresolveable $ref defaulted type`
        };
    } else {
        throw new Error(`I don't know how to get the type from that JSON schema: ${name}`)
    }
    
    // #region data-types
    const types = [schema.type, schema.const, schema.enum].filter(Boolean)
    const baseType = types.find((type) => type !== "null"); // First type that is not null
    let dataType: ColumnMetadata["dataType"] = "text"; // fallback
    switch (baseType) {
        case "string":
            dataType = "text";
            break;
        case "integer":
            dataType = "integer";
            break;
        case "number":
            dataType = "real";
            break;
        case "boolean":
            dataType = "integer";
            break;
        case "array":
        case "object":
        default:
            dataType = "text";
            break;
    }
    return {
        name: name,
        dataType: dataType,
        isNullable: types.includes("null"),
        isAutoIncrementing: false,
        hasDefaultValue: false,
    };
    // #endregion data-types
}


/**
 * The sql text syntaxes the fetcher works with
 */
export type SqlFlavor = "sqlite" | "postgresql";

/**
 * The JSON field presented as a "column" with an
 * additional {@link dataType} field attached
 */
interface ColumnValue {
    dataType: string;
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
    readonly migrations: ReadonlyArray<
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
    readonly index: (resource: unknown, index: number) => ColumnValue;
}

/**
 * Static dummy kysely orm object
 * @param sqlFlavor The dialect enum
 *
 * @internal
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

interface ColumnValue {
    dataType: string;
    value: any | null;
}

interface JsonTableMigration {
    sql: string;
    columnsMetadata: Array<ColumnMetadata>;
}

/**
 * The type for resolving a resource's field from a column index
 */
export type ResolveColumn = (resource: any, index: number) => ColumnValue;

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
function jsonTableMigration(
    db: Kysely<any>,
    tableName: string,
    root: JSONSchema7,
    keyFilter: (key: string) => boolean = defaultKeyFilter,
    rewrites?: Record<string, string>
): JsonTableMigration {
    const tb = db.schema
        .createTable(tableName)
        .ifNotExists()
        .addColumn("id", "text", (col) => col.primaryKey());

    const columnsMetadata = new Array<ColumnMetadata & {map?: string;}>();
    columnsMetadata.push({
        name: "id",
        dataType: "text",
        isAutoIncrementing: false,
        isNullable: false,
        hasDefaultValue: false,
    });
    const jsonObjectProps = get(root, `/definitions/${tableName}/properties`);
    if (!jsonObjectProps) {
        throw new Error(`That json object schema doesn't exist: "${tableName}"`);
    }
    const columns: [string, JSONSchema7][] = Object.entries(jsonObjectProps);
    const finalTb = columns.reduce((tb, [key, value]) => {
        if (typeof value === "boolean") {
            throw new Error(
                `Unexpected boolean JSON schema for column ${tableName}.${key}`,
            );
        }
        if (!keyFilter(key)) {
            return tb;
        }
        
        let columnSchema = value;
        let rewritten: string | null = null;
        if (value.$ref && rewrites?.[value.$ref]) {
            rewritten = rewrites[value.$ref];
            const resolved = resolveRef(rewritten, root);
            if (!resolved) {
                throw new Error(`That json pointer doesn't exist for rewrite ${value.$ref}: ${resolved}`);
            }
            columnSchema = resolved;
        }
        
        // Column key remains the same!!
        let column = resolveColumnMetadata(key, columnSchema, root);
        if (rewritten) {
            set(column, "/rewrite", `${key}/${tail(rewritten)}`);
        }
        columnsMetadata.push(column)
        return tb.addColumn(
            key,
            isDataTypeExpression(column.dataType) ? column.dataType : "text",
        );
    }, tb);
    return {
        sql: finalTb.compile().sql + ";\n",
        columnsMetadata: columnsMetadata,
    };
}

/**
 * Map from FHIR JSON schemas to SQL migration text + column lookup
 * @param db A dummy kysely querybuilder
 * @param jsonSchema The master JSON schema
 * @param sqlColumnMap FHIR type -> SQL column data type
 * @param resourceScope Scope
 * @returns An object with a migrations array listen in order of the {@link resourceScope} field in its `migrations` field and a `index` function that indexes a given Resource with the corresponding column number
 */
export function migrationsFromJson(
    dialect: "sqlite" | "postgresql",
    jsonSchema: JSONSchema7,
    rewrites?: Record<string, string>
): SQLResolver {
    const definitions = jsonSchema["definitions"] as Record<
        string,
        Exclude<JSONSchema7Definition, boolean>
    >;
    if (!definitions) {
        throw new Error("Bad json schema");
    }
    // #region snippet
    const jsonTables: string[] = Object.keys(get(jsonSchema, "/discriminator/mapping"));
    const discriminatorKey: string = get(jsonSchema, "/discriminator/propertyName");
    // #endregion snippet

    const db = new Kysely({
        dialect: dummy(dialect),
    });
    const resolveMap = new Map<
        string,
        (ColumnMetadata & {rewrite?: string;})[]
    >();
    const tableMigrations = jsonTables.map((jsonTableName) => {
        const migration = jsonTableMigration(
            db,
            jsonTableName,
            jsonSchema,
            defaultKeyFilter,
            rewrites
        );
        resolveMap.set(jsonTableName, migration.columnsMetadata);
        return [jsonTableName, migration.sql] as const;
    });

    /**
     * 
     * @param resource 
     * @param iCol The 0-based index of the column as it appeared in the underlying vtab create table statement, so you need to have kept track of that
     * @returns 
     */
    const index = (resource: any, iCol: number) => {
        if (!resolveMap.has(resource[discriminatorKey])) {
            return { value: null, dataType: "text" };
        }
        const metadata = resolveMap.get(resource[discriminatorKey])!;
        const columnMetadata = metadata[iCol];
        let value = get(resource, `/${columnMetadata.name}`);
        if (columnMetadata.rewrite) {
            value = get(resource, `/${columnMetadata.rewrite}`);
        }
        
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        return {
            value,
            dataType: columnMetadata.dataType
        }
    };

    return {
        migrations: tableMigrations as any,
        index: index,
    };
}

/**
 * 2-tuple for defining a table {@link SqlView.tableName} derived from a virtual table {@link SqlView.virtualTableName}
 *
 * @example
 *
 * type PatientView = SqlView<{
 *   Patient: {...};
 *   patients: {...};
 * }>;
 * const patientView: PatientView = {
 *   tableName: "patients_cached",
 *   virtualTableName: "Patient",
 *   ctasStatement: `create table "patients_cached" as select * from Patient;`
 * }
 */
export type SqlView<T> = {
    tableName: Extract<keyof T, string>;
    virtualTableName: Extract<keyof T, string>;
};

export type SqlViewData<T> = {
    rows: T[];
    ctasStatement: string;
};
