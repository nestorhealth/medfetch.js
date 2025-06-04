import { Worker1Promiser } from "@sqlite.org/sqlite-wasm";
import { QueryResult } from "kysely";
import { buildQueryFn, GenericSqliteDialect, IGenericSqlite, Promisable } from "kysely-generic-sqlite";
import { fromNullableOrThrow } from "~/data";
import { BetterWorker1PromiserFn } from "~/sqlite-wasm/types";
import { check } from "~/sqlite-wasm/worker1/worker1.main";

/* Its `db` field is a string */
export type SqliteWasmDB = IGenericSqlite<string>;

/**
 * Database interface
 * @param promiser 
 * @returns 
 */
export async function database(promiser: BetterWorker1PromiserFn): Promise<SqliteWasmDB> {
    const dbId = await promiser("open")
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
                        }
                    }
                    return queryResult;
                });
        },
    };
}

export class SqliteWasmDialect extends GenericSqliteDialect {
    constructor(promiser: Worker1Promiser) {
        super(
            async () => {
                const db = await database(promiser);
                return {
                    db,
                    close: () => db.close(),
                    query: buildQueryFn({
                        all: (sql, params) => {
                            return promiser("exec", {sql, bind: params as any, rowMode: "object"}).then(check).then(
                                ({ result }) => result.resultRows ?? []
                            )
                        },
                        run: async () => {
                            const response = await promiser("exec", {
                                sql: "SELECT last_insert_rowid()"
                            }).then(check);
                            const insertId = BigInt(response.result.resultRows?.at(0) ?? 0);
                            return {
                                insertId,
                            }
                        }
                    })
                }
            }
        )
    }
}