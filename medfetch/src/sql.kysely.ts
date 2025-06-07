import {
    DummyDriver,
    Kysely,
    PostgresAdapter,
    PostgresIntrospector,
    PostgresQueryCompiler,
    SqliteAdapter,
    SqliteIntrospector,
    SqliteQueryCompiler,
} from "kysely";
import type { SqlDialect } from "~/sql.types";

/**
 * Static dummy kysely orm object
 * @param dialect The dialect enum
 */
export function kyselyDummy<DB = any>(dialect: SqlDialect) {
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
