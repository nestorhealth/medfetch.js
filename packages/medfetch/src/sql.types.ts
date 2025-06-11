import type { ColumnDataType, Dialect } from "kysely";
import {
    Merge,
    Normalize,
    PrimitiveKey,
    ResourceFromType,
    ResourceType,
    Scalar,
} from "~/json.types";

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

export const FHIR_TO_SQL = {
    sqlite: DEFAULT_SQLITE_FROM_FHIR,
    postgresql: DEFAULT_POSTGRESQL_FROM_FHIR
} satisfies Record<SqlFlavor, Record<PrimitiveKey, ColumnDataType>>;

/**
 * The sql text syntaxes the fetcher works with
 *
 * So yummy - karl anthony towns
 * I'm (not) sorry mysql 💔
 */
export type SqlFlavor = "sqlite" | "postgresql";
// 1. Flatten fields: require `id`, drop `_` keys, no optional props, undefined → null

export interface SqlOnFhirDialect<
    Fallback,
    Override extends {
        [K in keyof Fallback]?: {
            [Leaf in keyof Fallback[K]]?: any;
        };
    },
> extends Dialect {
    readonly $db: Merge<Fallback, Override>;
}

/**
 * The default path map, only compile-level don't trust these types at
 * runtime unvalidated
 */
export type DefaultPathMap = {
    [R in ResourceType]: Scalar<
        Normalize<ResourceFromType<R>>
    >
};

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
export interface RowResolver<ResourceKey extends ResourceType> {
    /**
     * List of resource type to sql migration text associations held in a 2-tuple
     */
    migrations: Array<[ResourceKey, string]>;

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
 * Generic
 * @internal
 */
export interface SqlOnFhirView {
    /**
     * Get back the sql column type name from the primitive
     * @param primitive A primitive typename
     * @returns A column data type
     */
    scalar: (primitive: PrimitiveKey) => ColumnDataType;
}

/**
 * For the primitive types that can be mapped to non text/blob columns
 */
export type Fhir2SqlScalar = {
    [Key in PrimitiveKey]: ColumnDataType;
};
