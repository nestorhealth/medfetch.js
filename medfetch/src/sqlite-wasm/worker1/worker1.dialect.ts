import { Worker1Promiser } from "@sqlite.org/sqlite-wasm";
import { QueryResult } from "kysely";
import type {
    IGenericSqlite,
    Promisable,
} from "kysely-generic-sqlite";
import { buildQueryFn, GenericSqliteDialect } from "kysely-generic-sqlite";

async function selectArray(
    dbId: string,
    promiser: Worker1Promiser,
    sql: string,
    parameters?: readonly any[],
): Promise<unknown[]> {
    const response = await promiser({
        type: "exec",
        dbId: dbId,
        args: {
            sql: sql,
            rowMode: "object",
            bind: parameters ?? []
        },
    });
    if (response.type === "error") {
        throw new Error("OfficialWasmProxyDialect error");
    }
    return response.result.resultRows as unknown[];
}

class Worker1Dialect extends GenericSqliteDialect {
    constructor(dbId: string, promiser: Worker1Promiser) {
        const db: IGenericSqlite<string> = {
            db: dbId,
            close: () => promiser({ dbId, type: "close" }),
            query: (
                isSelect: boolean,
                sql: string,
                parameters?: any[] | readonly any[],
            ): Promisable<QueryResult<any>> => {
                if (isSelect) {
                    const result = await promiser("exec", {
                    })
                    return {
                    }
                }
            },
        };

        super(async () => {
            return {
                db: {},
                close: () => {
                    return promiser({
                        type: "close",
                    });
                },
                query: buildQueryFn({
                    all: async (sql, parameters) => {
                        return selectArray(promiser, sql, parameters);
                    },
                    run: async () => {
                        const result = await selectArray(
                            promiser,
                            "SELECT last_insert_rowid()",
                        );

                        return {
                            insertId: BigInt((result[0] as number) ?? 0),
                            numAffectedRows: BigInt(),
                        };
                    },
                }),
            };
        });
    }
}
