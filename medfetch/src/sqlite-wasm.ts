import { promiserSyncV2 } from "~/sqlite-wasm/_worker1.main.js";
import { Kysely, type QueryResult } from "kysely";
import {
    buildQueryFn,
    GenericSqliteDialect,
    IGenericSqlite,
    Promisable,
} from "kysely-generic-sqlite";
import { fromNullableOrThrow } from "~/fhir/data";
import type {
    Worker1OpenRequest,
    Worker1Promiser,
} from "~/sqlite-wasm/_types.patch";
import { check } from "~/sqlite-wasm/_worker1.main";
import { isBrowser } from "~/fhir/env";
import { type FhirResource } from "fhir/r4";
import { type InferKyselyFhirDB, kyselyDummy } from "~/sql";

/* Its `db` field is a string */
type Sqlite3WasmDB = IGenericSqlite<string>;

/**
 * Database interface
 * @param promiser Main thread messenger for worker1 thread (sqlite3 calls their messenger interface the "Promiser")
 * @returns {@link IGenericSqlite} implementation using promiser
 */
async function database(
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
 */
export class Worker1PromiserDialect extends GenericSqliteDialect {
    constructor(promiser: Worker1Promiser, openMessage?: Worker1OpenRequest) {
        super(async () => {
            const db = await database(promiser, openMessage);
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

/**
 * Extra configuration
 */
interface MedfetchSqlite3WasmConfig {
    worker: Worker;
    filename: string;
}

/**
 * Provide the worker1 {@link Worker} to promiser v2
 * @param worker The sqlite web worker
 * @returns {@link Worker1Promiser}
 */
function wrapSqlite3Worker(worker: Worker | undefined): Worker1Promiser {
    if (worker) {
        return promiserSyncV2(worker);
    } else {
        return promiserSyncV2(
            new Worker(
                new URL(
                    import.meta.env.DEV
                        ? "./sqlite-wasm.worker.js"
                        : "./sqlite-wasm.worker.js",
                    import.meta.url,
                ),
                {
                    type: "module",
                    name: "sqlite-wasm.worker",
                },
            ),
        );
    }
}

/**
 * Get back a Kysely database interface over the medfetch sql-on-fhir database
 * @param baseURL The data source, either a string to indicate REST or a Bundle {@link File}
 * @param resources What resources to include. Defaults to `Patient`, `Procedure`, and `Condition`
 * @param opts Optional config (see {@link MedfetchSqlite3WasmConfig})
 * @returns A kysely orm interface over the sqlite-wasm database with the medfetch extension
 * 
 * @template DB The rest of the database, if you need those types
 * @template Resources The resource types the medfetch extension should fetch from the baseURL
 */
export function medfetch<
    DB = {},
    const Resources extends [FhirResource["resourceType"], ...FhirResource["resourceType"][]] = [
        "Patient",
        "Condition",
        "Procedure"
    ]
>(
    baseURL: string | File,
    resources: Resources = ["Patient", "Condition", "Procedure"] as any,
    opts: Partial<MedfetchSqlite3WasmConfig> = {},
): Kysely<InferKyselyFhirDB<Resources> & DB> {
    if (!isBrowser()) {
        console.warn(
            `Called medfetch/sqlite-wasm::medfetch() on the server, returning empty kysely instance.`,
        );
        return kyselyDummy("sqlite");
    }

    // Wrap the sqlite wasm worker with the promiser handle
    const promiser = wrapSqlite3Worker(opts.worker);

    if (!opts.filename) {
        // Use memory by default
        return new Kysely<InferKyselyFhirDB<Resources> & DB>({
            dialect: new Worker1PromiserDialect(promiser, {
                type: "open",
                aux: {
                    baseURL,
                    resources,
                },
            }),
        });
    }
    // Otherwise attach it to opfs -- will enable other web file systems
    // as needed in the future
    const dialect = new Worker1PromiserDialect(promiser, {
        type: "open",
        aux: {
            baseURL,
            resources,
        },
        args: {
            filename: opts.filename,
            vfs: "opfs",
        },
    });
    return new Kysely<InferKyselyFhirDB<Resources> & DB>({
        dialect,
    });
}
