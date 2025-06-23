import type { QueryResult } from "kysely";
import {
    buildQueryFn,
    GenericSqliteDialect,
    type IGenericSqlite,
    type Promisable,
} from "kysely-generic-sqlite";
import type { Worker1Promiser } from "./sqlite-wasm/worker1.types";
import { check } from "./sqlite-wasm/worker1.main";

/* Its `db` field is a string */
type Worker1DB = IGenericSqlite<string>;

function fromNullableOrThrow<T>(t: T): NonNullable<T> {
    if (!t) {
        throw new Error("that's null");
    }
    return t;
}

/**
 * Database interface
 * @param promiser Main thread messenger for worker1 thread (sqlite3 calls their messenger interface the "Promiser")
 * @returns {@link IGenericSqlite} implementation using promiser
 */
export async function worker1DB(
    dbId: string,
    promiser: Worker1Promiser,
): Promise<Worker1DB> {
    return {
        db: dbId,
        close() {
            return promiser({
                type: "close",
                dbId,
            });
        },
        query(
            isSelect: boolean,
            sql: string,
            parameters?: any[] | readonly any[],
        ): Promisable<QueryResult<any>> {
            if (!isSelect) {
                return promiser({
                    type: "exec",
                    dbId,
                    args: {
                        rowMode: "array",
                        sql,
                        bind: parameters ?? [],
                    },
                })
                    .then(check)
                    .then((response): QueryResult<any> => {
                        const [resultRows] = fromNullableOrThrow(
                            response.result.resultRows,
                        );
                        const numAffectedRows = BigInt(resultRows);
                        let queryResult: QueryResult<any> = {
                            rows: resultRows,
                        };
                        if (!isSelect) {
                            queryResult = {
                                ...queryResult,
                                numAffectedRows,
                            };
                        }
                        return queryResult;
                    });
            } else {
                return promiser({
                    type: "exec",
                    dbId,
                    args: {
                        rowMode: "object",
                        sql,
                        bind: parameters ?? [],
                    },
                })
                    .then(check)
                    .then((response): QueryResult<any> => {
                        return {
                            rows: response.result.resultRows ?? [],
                        };
                    });
            }
        },
    };
}

async function accessDB<T>(t: T | (() => T) | (() => Promise<T>)): Promise<T> {
    if (typeof t === "function") {
        const result = (t as () => T | Promise<T>)(); // call the function
        return await result;
    } else {
        return t;
    }
}

/**
 * {@link GenericSqliteDialect} implementation for the worker1promiser api
 * from @sqlite.org/sqlite-wasm
 */
export class Worker1PromiserDialect extends GenericSqliteDialect {
    constructor(config: {
        database: Worker1DB | (() => Promise<Worker1DB>) | (() => Worker1DB);
    }) {
        super(async () => {
            const db = await accessDB<Worker1DB>(config.database);
            return {
                db,
                close: () => db.close(),
                query: buildQueryFn({
                    all: async (sql, params) => {
                        const response = await db.query(true, sql, params);
                        return response.rows ?? [];
                    },
                    run: async (sql, params) => {
                        const result = await db.query(false, sql, params);

                        // Check if this is an INSERT
                        const isInsert = /^\s*insert\s+/i.test(sql);

                        const insertId: bigint = BigInt(
                            isInsert
                                ? ((
                                      await db.query(
                                          false,
                                          "SELECT last_insert_rowid()",
                                      )
                                  ).rows.at(0)?.["last_insert_rowid()"] ?? 0)
                                : 0,
                        );

                        return {
                            insertId,
                            numAffectedRows: result.numAffectedRows ?? 0n,
                        };
                    },
                }),
            };
        });
    }
}
