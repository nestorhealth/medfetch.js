import type { ColumnDataType, Dialect } from "kysely";
import type {
    PrimitiveKey,
    ResourceFromType,
    ResourceType,
} from "./json/json.types";

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

type Scalar<Obj> = {
    [K in keyof Obj]: ScalarColumnFrom<Obj[K]> | null;
};

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
export interface SqlOnFhirDialect<Resources extends {resourceType: string;}>
    extends Dialect {
    readonly $db: {
        [R in Resources["resourceType"]]: Rowify<Resources["resourceType"]> & { id: string };
    };
}

/**
 * The default path map, only compile-level don't trust these types at
 * runtime unvalidated
 */
export type DefaultPathMap = {
    [R in ResourceType]: Scalar<ResourceFromType<R>>;
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
export interface RowResolver {
    /**
     * List of resource type to sql migration text associations held in a 2-tuple
     */
    migrations: Array<[
        string, // ResourceType
        string // Migration Text
    ]>;

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
