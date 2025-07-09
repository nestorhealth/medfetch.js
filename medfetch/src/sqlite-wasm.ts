import { dummy } from "./sql/kysely.js";
import { Worker1DB, Worker1PromiserDialect } from "./sql.js";
import { BROWSER } from "esm-env";
import type { Worker1OpenRequest, Worker1Promiser } from "./sqlite-wasm/types.js";
import { promiserSyncV2 } from "./sqlite-wasm/worker1.main.js";
import { unzipJSONSchema } from "~/sql.js"

// singleton
let __worker: Worker | null = null;
let __promiser: Worker1Promiser | null = null;
import { virtualMigrations as generateVirtualMigrations } from "./sql.js";

async function openPromiserDB<
    TWorker = Worker
>(worker: TWorker, openMsg: Worker1OpenRequest) {
    if (!__promiser) {
        __promiser = promiserSyncV2(worker);
    }

    const promiser = __promiser;
    const response = await promiser(openMsg);
    if (response.type === "error" || !response.dbId) {
        throw new Error(`Couldn't get back database ID from "openPromiserDB", early exiting...`)
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
};

/**
 * Medfetch's default sqlite on FHIR client dialect constructor.
 * This delays opening the worker thread until the very first call sqlite-wasm worker thread from the neighboring [sqlite-wasm.thread.ts](./sqlite-wasm.thread.ts), so in that sense this is lazy
 * file.
 * @param baseURL The fhir data source, either the base URL of a FHIR API or a raw File Bundle
 * @param resources The resource types to include
 * @returns A plain {@link Worker1PromiserDialect} wrapped over a {@link SqlOnFhirDialect} for typescript
 * 
 * @example 
 * From a FHIR server
 * ```ts
 * const dialect = medfetch("https://my.fhir.api.com");
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
    virtualMigrations: string | (() => Promise<string>) = () => unzipJSONSchema().then(generateVirtualMigrations),
    {
        filename = ":memory:",
        worker,
    }: SqliteWasmOptions = {}
): Worker1PromiserDialect {
    if (!BROWSER) {
        console.warn(
            `[medfetch/sqlite-wasm] > Called in non-browser environment, returning dummy...`,
        );
        return dummy("sqlite") as any as Worker1PromiserDialect;
    }
    
    return new Worker1PromiserDialect({
        database: async () => {
            const sqliteWorker = accessWorker(worker);
            const migrations = typeof virtualMigrations === "function" ? await virtualMigrations() : virtualMigrations;
            const promiserDB = await openPromiserDB(sqliteWorker, {
                type: "open",
                args: {
                    vfs: "opfs",
                    filename: filename,
                },
                aux: {
                    baseURL: baseURL,
                    virtualMigrations: migrations
                }
            });
            return promiserDB;
        }
    });
}
