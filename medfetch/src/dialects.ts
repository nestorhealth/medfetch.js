import type { QueryResult } from "kysely";
import {
    buildQueryFn,
    GenericSqliteDialect,
    type IGenericSqlite,
} from "kysely-generic-sqlite";
import type { PromiserResult, Worker1Promiser } from "./sqlite-wasm/types.js";
import { check } from "./sqlite-wasm/worker1.main.js";


type ScalarColumnFrom<T> =
    Exclude<T, undefined> extends string | number | boolean
        ? Exclude<T, undefined>
        : string;

/**
 * Turn some type T into something that looks like a row
 * (a 1-level record with objects / arrays turned into strings)
 */
export type Rowify<T> = {
    [K in keyof T]-?: undefined extends T[K]
        ? NonNullable<ScalarColumnFrom<T[K]>> | null
        : ScalarColumnFrom<T[K]>;
};

function fromNullableOrThrow<T>(t: T): NonNullable<T> {
    if (!t) {
        throw new Error("that's null");
    }
    return t;
}

/**
 * Implementation of {@link IGenericSqlite} where the {@link IGenericSqlite["db"]}
 * field is set to `dbId` of the worker1 promiser database.
 */
export class Worker1DB implements IGenericSqlite<string> {
    readonly db: string;

    /**
     * @param dbId
     * @param promiser Main thread messenger function for worker1 thread (sqlite3 calls their messenger interface "Promiser")
     */
    constructor(db: string, private promiser: Worker1Promiser) {
        this.db = db;
    }

    async close(): Promise<PromiserResult<"close">> {
        return await this.promiser({
            type: "close",
            dbId: this.db,
        });
    }

    /**
     * Arbitrary SQL query function handler
     * @param isSelect If the query is a select
     * @param sql Querytext
     * @param parameters Any bindable parameters
     * @returns
     */
    async query(
        isSelect: boolean,
        sql: string,
        parameters?: readonly any[],
    ): Promise<QueryResult<any>> {
        if (!isSelect) {
            return this.promiser({
                type: "exec",
                dbId: this.db,
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
            return this.promiser({
                type: "exec",
                dbId: this.db,
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
    }
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
 * from [`@sqlite.org/sqlite-wasm`](https://github.com/sqlite/sqlite-wasm) for a db interface proxy for
 * querying a sqlite-wasm db thread running on the Worker1 message API.
 */
export class Worker1PromiserDialect extends GenericSqliteDialect {
    constructor(config: {
        database: IGenericSqlite<string> | (() => Promise<IGenericSqlite<string>>) | (() => IGenericSqlite<string>);
    }) {
        super(async () => {
            const db = await accessDB<IGenericSqlite<string>>(config.database);
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
