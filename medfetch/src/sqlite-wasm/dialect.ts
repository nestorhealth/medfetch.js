import { Worker1Promiser } from "@sqlite.org/sqlite-wasm";
import { Kysely, QueryResult } from "kysely";
import {
    buildQueryFn,
    GenericSqliteDialect,
    IGenericSqlite,
    Promisable,
} from "kysely-generic-sqlite";
import { fromNullableOrThrow } from "~/data";
import { check, promiserSyncV2 } from "~/sqlite-wasm/worker1.main";
import Sqlite3Worker from "./worker?worker";

/* Its `db` field is a string */
export type SqliteWasmDB = IGenericSqlite<string>;

/**
 * Database interface
 * @param promiser Main thread messenger for worker1 thread (sqlite3 calls their messenger interface the "Promiser")
 * @returns {@link IGenericSqlite} implementation using promiser
 */
export async function database(
    baseURL: string | File,
    promiser: Worker1Promiser,
): Promise<SqliteWasmDB> {
    const dbId = await promiser({
        type: "open",
        aux: {
            baseURL
        },
        args: {}
    })
        .then(check)
        .then((res) => fromNullableOrThrow(res.dbId)[0]);

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

export class Worker1PromiserDialect extends GenericSqliteDialect {
    constructor(baseURL: string | File, promiser: Worker1Promiser) {
        super(async () => {
            const db = await database(baseURL, promiser);
            return {
                db,
                close: () => db.close(),
                query: buildQueryFn({
                    all: async (sql, params) => {
                        const response = await promiser("exec", {
                            sql,
                            bind: params as any,
                            rowMode: "object",
                        });
                        const data = check(response);
                        return data.result.resultRows ?? [];
                    },
                    run: async () => {
                        const response = await promiser("exec", {
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

interface MedfetchSqlite3WasmOptions {
    worker?: Worker;
}

export function medfetch<DB = any>(
    baseURL: string | File,
    opts: MedfetchSqlite3WasmOptions = {},
) {
    let promiser: Worker1Promiser;
    if (opts.worker) {
        promiser = promiserSyncV2(opts.worker);
    } else {
        promiser = promiserSyncV2(new Sqlite3Worker());
    }

    const dialect = new Worker1PromiserDialect(baseURL, promiser);
    return new Kysely<DB>({
        dialect
    });
}
