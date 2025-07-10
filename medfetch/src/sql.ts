import type { QueryResult } from "kysely";
import {
    buildQueryFn,
    GenericSqliteDialect,
    type IGenericSqlite,
} from "kysely-generic-sqlite";
import type { PromiserResult, Worker1Promiser } from "./sqlite-wasm/types.js";
import { check } from "./sqlite-wasm/worker1.main.js";
import type { JSONSchema7 } from "json-schema";
import jsonSchema from "~/sql/jsonSchema.js";

/**
 * "Generic" options for generating a virtual migration text from some JSON object
 * schema
 */
export type VirtualMigrationConfig = {
    /**
     * What "syntax" of sql to use to determine column types.
     * @todo Provide a more granular way to determine column mappings
     */
    readonly dialect: "sqlite" | "postgresql";
    
    /**
     * The path to an object child whose keys/props contains the Tables
     * to generate migration texts for.
     */
    readonly discriminatorPath: string;
    
    /**
     * What l1 (immediate) child keys from the parent object
     * should be "generated" (usually a deeper path extraction)
     */
    readonly generatedPaths?: ReadonlyMap<string, string>;
    
    /**
     * Optional filter to omit column keys dynamically rather than have to
     * do so within the JSON schema itself.
     * @param columnKey The column key name from the JSON schema
     * @returns [Drop it](https://www.youtube.com/watch?v=C3jFLJWF75U)
     */
    readonly drop?: (columnKey: string) => boolean;
};

/**
 * Schemas that we have functions to create sql migrations from.
 */
export type Migrateable = string | JSONSchema7;

const isString = (m: unknown) => typeof m === "string";
// temp naive check until (if) we implement other schemas
const isJSONSchema = (m: unknown): m is JSONSchema7 =>
    !!m && typeof m === "object" && "$schema" in m;

const matchMigrateable = (handlers: {
    string: (migrationsRaw: string) => string;
    jsonSchema: (jsonSchema: JSONSchema7) => string;
}) => {
    return (m: Migrateable) => {
        if (isString(m)) {
            return handlers["string"](m);
        }
        if (isJSONSchema(m)) {
            return handlers["jsonSchema"](m);
        }

        throw new Error(
            `matchMigrateable callback failed to match ${String(m)} to any of 'type': 'string' | 'JSONSchema7'`,
        );
    };
};

/**
 * "Translate" the provided {@link Migrateable} {@link T} from either an async callback (fetching dynamically)
 * or the value itself.
 * @param schema The schema or a callback to get the schema. If this is plaintext (`string`), then it just returns that
 * stirng ***unmodified***.
 * @param config Any options from {@link VirtualMigrationConfig}
 * @returns The migration text or the text wrapped in a promise function, depending on whatever shape passed in {@link T} takes.
 */
export function virtualMigration<T extends Migrateable>(
    schema: () => Promise<T>,
    config?: Partial<VirtualMigrationConfig>,
): () => Promise<string>;
export function virtualMigration<T extends Migrateable>(
    schema: T,
    config?: Partial<VirtualMigrationConfig>,
): string;

export function virtualMigration<T extends Migrateable>(
    schema: T | (() => Promise<T>),
    {
        discriminatorPath = "/discriminator/mapping",
        generatedPaths = new Map([
            [
                "#/definitions/Reference",
                "#/definitions/Reference/properties/reference",
            ],
        ]),
        dialect = "sqlite",
        drop = (key: string) => key[0] === "_",
    }: Partial<VirtualMigrationConfig> = {},
): string | (() => Promise<string>) {
    const match = matchMigrateable({
        string: (s) => s,
        jsonSchema: (s) =>
            jsonSchema(s, {
                discriminatorPath,
                dialect,
                generatedPaths,
                drop,
            }),
    });
    if (typeof schema === "function") {
        return () => schema().then(match);
    } else {
        return match(schema);
    }
}

/**
 * Map object children of {@link T}
 */
type ScalarColumnFrom<T> =
    Exclude<T, undefined> extends string | number | boolean
        ? Exclude<T, undefined>
        : string;

// #region snippet
/**
 * Turn some type T into something that looks like a row
 * (a 1-level record with objects / arrays turned into strings)
 */
export type Rowify<T> = {
    [K in keyof T]-?: undefined extends T[K]
        ? NonNullable<ScalarColumnFrom<T[K]>> | null
        : ScalarColumnFrom<T[K]>;
};
// #endregion snippet

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
    constructor(
        db: string,
        private promiser: Worker1Promiser,
    ) {
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

async function access<T>(t: T | (() => T) | (() => Promise<T>)): Promise<T> {
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
        database:
            | IGenericSqlite<string>
            | (() => Promise<IGenericSqlite<string>>)
            | (() => IGenericSqlite<string>);
    }) {
        super(async () => {
            const db = await access<IGenericSqlite<string>>(config.database);
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
