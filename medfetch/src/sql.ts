import type { QueryResult } from "kysely";
import {
    buildQueryFn,
    GenericSqliteDialect,
    type IGenericSqlite,
} from "kysely-generic-sqlite";
import type { PromiserResult, Worker1Promiser } from "./sqlite-wasm/types.js";
import { check } from "./sqlite-wasm/worker1.main.js";
import type { JSONSchema7 } from "json-schema";
import { migrations } from "~/sql/json-schema.js";
import { strFromU8, unzipSync } from "fflate";

export type VirtualMigrationsConfig = {
    dialect: "sqlite" | "postgresql";
    discriminatorPath: string;
    rewritePaths: ReadonlyMap<string, string>;
    drop?: (columnKey: string) => boolean;
};
/**
 * Schemas that we have functions to create sql migrations from
 */
type Migrateable = string | JSONSchema7;

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

export function virtualMigrations<T extends Migrateable>(
    schema: () => Promise<T>,
    config?: Partial<VirtualMigrationsConfig>,
): () => Promise<string>;
export function virtualMigrations<T extends Migrateable>(
    schema: T,
    config?: Partial<VirtualMigrationsConfig>,
): string;

export function virtualMigrations<T extends Migrateable>(
    schema: T | (() => Promise<T>),
    {
        discriminatorPath = "/discriminator/mapping",
        rewritePaths = new Map([
            [
                "#/definitions/Reference",
                "#/definitions/Reference/properties/reference",
            ],
        ]),
        dialect = "sqlite",
        drop = (key: string) => key[0] === "_",
    }: Partial<VirtualMigrationsConfig> = {},
): string | (() => Promise<string>) {
    const match = matchMigrateable({
        string: (s) => s,
        jsonSchema: (s) =>
            migrations(s, {
                discriminatorPath,
                dialect,
                rewritePaths,
                drop
            }),
    });
    if (typeof schema === "function") {
        return () => schema().then(match);
    } else {
        return match(schema);
    }
}

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

/**
 * Fetch the JSON schema and get back the parsed version from a zipfile
 * @param zipURL URL of the zip endpoint, defaults to the core fhir schema json zip file from the CI build
 * @param filename Optionally pass in filename
 * @returns The JSON parsed JSON schema object
 */
export async function unzipJSONSchema(
    zipURL: string = "https://build.fhir.org/fhir.schema.json.zip",
    filename: string = "fhir.schema.json",
): Promise<JSONSchema7> {
    const response = await fetch(zipURL).catch((error) => {
        console.error(`Couldn't handle "fetch" request: ${error}`);
        throw new Error();
    });
    if (!response.ok) {
        console.error(`Bad response from endpoint: ${zipURL}`, response.status);
        throw new Error();
    }

    const entries = unzipSync(new Uint8Array(await response.arrayBuffer()));
    const schemaFile = entries[filename];
    if (!schemaFile) {
        console.error(
            `Schema file ${filename} not found in unzipped. Keys are: ${Object.keys(entries)}`,
        );
        throw new Error();
    }

    try {
        const parsed: JSONSchema7 = JSON.parse(strFromU8(schemaFile));
        return parsed;
    } catch (error) {
        const msg = `Couldn't parse the JSON file ${filename}: ${error}`;
        throw new Error(msg);
    }
}
