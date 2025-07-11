import {
    type Dialect,
    type ColumnDataType,
    type Expression,
    SqliteAdapter,
    DummyDriver,
    SqliteIntrospector,
    SqliteQueryCompiler,
    PostgresAdapter,
    PostgresIntrospector,
    PostgresQueryCompiler,
    Kysely,
} from "kysely";

/**
 * Static dummy kysely dialect object
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

export function dummyDB(sqlFlavor: "sqlite" | "postgresql"): Kysely<any> {
    return new Kysely({
        dialect: dummy(sqlFlavor),
    });
}

// Kysely doesn't expose this so we just union it ourselves. This is internal anyway
export type DataTypeExpression = ColumnDataType | Expression<any>;
