import type { QueryResult } from "kysely";
import {
    buildQueryFn,
    GenericSqliteDialect,
    type IGenericSqlite,
    type Promisable,
} from "kysely-generic-sqlite";
import { fromNullableOrThrow } from "~/json.types";
import type {
    Worker1OpenRequest,
    Worker1Promiser,
} from "~/sqlite-wasm/worker1.types";
import { check } from "~/sqlite-wasm/worker1.main";

/* Its `db` field is a string */
type Sqlite3WasmDB = IGenericSqlite<string>;

/**
 * Database interface
 * @param promiser Main thread messenger for worker1 thread (sqlite3 calls their messenger interface the "Promiser")
 * @returns {@link IGenericSqlite} implementation using promiser
 */
async function sqlite3WasmDB(
    promiser: Worker1Promiser,
    openMessage?: Worker1OpenRequest,
): Promise<Sqlite3WasmDB> {
    let dbId: string;
    if (openMessage) {
        dbId = await promiser(openMessage)
            .then(check)
            .then((res) => fromNullableOrThrow(res.dbId)[0]);
    } else {
        dbId = await promiser("open")
            .then(check)
            .then((res) => fromNullableOrThrow(res.dbId)[0]);
    }

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
                    const [resultRows] = fromNullableOrThrow(
                        response.result.resultRows,
                    );
                    const numAffectedRows = BigInt(resultRows.length);
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
        },
    };
}

/**
 * {@link GenericSqliteDialect} implementation for the worker1promiser api
 * from @sqlite.org/sqlite-wasm
 */
export class Worker1PromiserDialect extends GenericSqliteDialect {
    constructor(
        openMessage: Worker1OpenRequest,
        worker1Promiser: Worker1Promiser,
    ) {
        super(async () => {
            const db = await sqlite3WasmDB(worker1Promiser, openMessage);
            return {
                db,
                close: () => db.close(),
                query: buildQueryFn({
                    all: async (sql, params) => {
                        const response = await worker1Promiser("exec", {
                            sql,
                            bind: params as any,
                            rowMode: "object",
                        });
                        const data = check(response);
                        return data.result.resultRows ?? [];
                    },
                    run: async () => {
                        const response = await worker1Promiser("exec", {
                            sql: "SELECT last_insert_rowid()",
                        }).then(check);
                        const insertId = BigInt(
                            response.result.resultRows?.at(0) ?? 0,
                        );
                        return {
                            insertId,
                        };
                    },
                }),
            };
        });
    }
}
