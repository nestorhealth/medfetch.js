import { dummy } from "./sql/kysely.js";
import {
    type Migrateable,
    virtualMigration,
    Worker1DB,
    Worker1PromiserDialect,
} from "./sql.js";
import { BROWSER } from "esm-env";
import type {
    Worker1OpenRequest,
    Worker1Promiser,
} from "./sqlite-wasm/types.js";
import { promiserSyncV2 } from "./sqlite-wasm/worker1.main.js";
import type { Promisable } from "kysely-generic-sqlite";
import { normalizePromiseableOption } from "~/context.js";

// singleton
let __worker: Worker | null = null;
let __promiser: Worker1Promiser | null = null;

async function openPromiserDB<TWorker = Worker>(
    worker: TWorker,
    openMsg: Worker1OpenRequest,
) {
    if (!__promiser) {
        __promiser = promiserSyncV2(worker);
    }

    const promiser = __promiser;
    const response = await promiser(openMsg);
    if (response.type === "error" || !response.dbId) {
        throw new Error(
            `[medfetch/sqlite-wasm] >> Couldn't get back database ID from "openPromiserDB", early exiting...`,
        );
    }
    const dbId = response.dbId;
    return new Worker1DB(dbId, promiser);
}

/**
 * So we don't load in the module on every recall the browser may have made
 * directly on indirectly to the dialect ctor
 *
 * @param userWorker A user provided Worker instance. If provided,
 * then user is in charge of handling any teardown
 * @returns A worker
 */
const accessWorker = (userWorker?: Worker) => {
    if (userWorker) {
        return userWorker;
    }
    if (!__worker) {
        __worker = new Worker(
            new URL(
                /* Bundler friendly */
                import.meta.env.DEV
                    ? "./threads/sqlite-wasm.db.js"
                    : "./threads/sqlite-wasm.db.js",
                import.meta.url,
            ),
            {
                type: "module",
                name: "sqlite-wasm.db",
            },
        );
    }
    return __worker;
};

/**
 * Options for sqlite-wasm
 */
type SqliteWasmOptions = {
    /**
     * Filename of database. Defaults to ":memory:"
     */
    readonly filename?: string;

    /**
     * The worker thread running the web assembly binary
     */
    readonly worker?: Worker;

    /**
     * Optional mapping hook for response intercepts
     */
    readonly match?: [pattern: string, handler: (response: Response) => any][];
};

/**
 * Medfetch's default sqlite on FHIR client dialect constructor.
 * This delays opening the worker thread until the very first call sqlite-wasm worker thread from the neighboring [sqlite-wasm.thread.ts](./sqlite-wasm.thread.ts), so in that sense this is lazy
 * @param baseURL The data source, either the base URL of a REST API or a raw File `Bundle` (Bundle format will be deprecated in the future, i just cba changing allat for a file handle right now)
 * @param schema The migration text to define the REST API schema
 * @param config Sqlite-wasm specific settings {@link SqliteWasmOptions}
 * @returns A plain {@link Worker1PromiserDialect} wrapped over a {@link SqlOnFhirDialect} for typescript
 *
 * @example
 * From a FHIR server
 * ```ts
 * const dialect = medfetch("https://my.fhir.api.com",
 *   `create table "Patient" (
 *      id TEXT PRIMARY KEY
 *   );
 *   create table "Condition" (
 *      id TEXT PRIMARY KEY,
 *      subject TEXT GENERATED ALWAYS AS ("reference")
 *   );`
 * );
 * ```
 *
 * @example
 * From a File
 * ```ts
 * const file = new File(...)
 * const dialect = medfetch(file);
 * ```
 *
 * @example
 * With a path rewrite
 * ```ts
 * const dialect = medfetch("...", {
 *   rewrites: {
 *     "#/definitions/Reference": "/#definitions/Reference/properties/reference"
 *   }
 * })
 * ```
 */
export default function medfetch(
    baseURL: string | File,
    schema: Promisable<Migrateable> | (() => Promisable<Migrateable>),
    { filename = ":memory:", worker }: SqliteWasmOptions = {},
): Worker1PromiserDialect {
    if (!BROWSER) {
        console.warn(
            `[medfetch/sqlite-wasm] >> Called in non-browser environment, returning dummy...`,
        );
        return dummy("sqlite");
    }

    const dialect = new Worker1PromiserDialect({
        database: async () => {
            const sqliteWorker = accessWorker(worker);
            const migrations =
                await normalizePromiseableOption(schema).then(virtualMigration);
            const promiserDB = await openPromiserDB(sqliteWorker, {
                type: "open",
                args: {
                    vfs: "opfs",
                    filename: filename,
                },
                aux: {
                    baseURL: baseURL,
                    virtualMigrations: migrations,
                },
            });
            return promiserDB;
        },
    });

    return dialect;
}
