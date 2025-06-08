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
export function kyselyDummy<DB = SqliteDBGeneric>(dialect: "sqlite" | "postgresql") {
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
