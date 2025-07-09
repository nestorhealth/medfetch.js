import {
    type Dialect,
    type ColumnDataType,
    type Expression,
    type CreateTableBuilder,

    SqliteAdapter,
    DummyDriver,
    SqliteIntrospector,
    SqliteQueryCompiler,
    PostgresAdapter,
    PostgresIntrospector,
    PostgresQueryCompiler,
    Kysely,
    sql,
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
        dialect: dummy(sqlFlavor)
    })
}

// Kysely doesn't expose this so we just union it ourselves. This is internal anyway
export type DataTypeExpression = ColumnDataType | Expression<any>;

/**
 * 
 * @param columnKey column name in database
 * @param pathKey The child path you want to use instead
 * @param columnDataType What type that should be in the database
 * @returns A table builder function
 */
export function rewriteColumnPath(columnKey: string, pathKey: string, columnDataType: DataTypeExpression) {
    return (tb: CreateTableBuilder<string>): CreateTableBuilder<string> =>
        tb
        .addColumn(`_${columnKey}`, sql`TEXT HIDDEN`)
        .addColumn(columnKey, columnDataType)

}