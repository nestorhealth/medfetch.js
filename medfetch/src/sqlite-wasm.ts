import { dummy, type SqlOnFhirDialect } from "./sql.js";
import { worker1DB, Worker1PromiserDialect } from "./dialects.js";
import { BROWSER } from "esm-env";
import type { Worker1OpenRequest } from "./sqlite-wasm/worker1.types.js";
import { promiserSyncV2 } from "./sqlite-wasm/worker1.main.js";

// singleton
let __worker: Worker | null = null;

async function openPromiserDB<
    TWorker = Worker
>(worker: TWorker, openMsg: Worker1OpenRequest) {
    const promiser = promiserSyncV2(worker);
    const response = await promiser(openMsg);
    if (response.type === "error" || !response.dbId) {
        throw new Error(`Couldn't get back database ID from "openPromiserDB", early exiting...`)
    }
    const dbId = response.dbId;
    return worker1DB(dbId, promiser);
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
 * To allow for a plain array input for the scope as opposed to a nested
 * object when using the default :memory: mode
 * @param opts 
 * @returns 
 */
function normalizeOptions<Resources extends {resourceType: string}>(opts: ClientOptions<Resources> | Resources["resourceType"][]): ClientOptions<Resources> {
    if (Array.isArray(opts)) {
        return {
            scope: opts,
            filename: ":memory:",
            worker: accessWorker()
        }
    } else {
        return opts;
    }
}

type ClientOptions<Resources extends {
    resourceType: string;
}> = {
    scope?: Resources["resourceType"][];
    worker?: Worker;
    filename?: string;
};

/**
 * Medfetch's default sqlite on FHIR client dialect constructor.
 * This delays opening the worker thread until the very first call sqlite-wasm worker thread from the neighboring [sqlite-wasm.thread.ts](./sqlite-wasm.thread.ts), so in that sense this is lazy
 * file.
 * @param filename The filename to persist the database to, uses opfs by default but if you pass in ":memory:", then the opfs vfs option will be
 * @param baseURL The fhir data source, either the base URL of a FHIR API or a raw File Bundle
 * @param resources The resource types to include
 * @returns A plain {@link Worker1PromiserDialect} wrapped over a {@link SqlOnFhirDialect} for typescript
 * 
 * @example 
 * From a FHIR server
 * ```ts
 * const dialect = medfetch("https://my.fhir.api.com", [
 *   "Patient",
 *   "Condition",
 *   "Encounter"
 * ]);
 * ```
 * 
 * @example
 * From a File
 * ```ts
 * const file = new File(...)
 * const dialect = medfetch(file, [
 *   "Patient",
 *   "Condition",
 *   "Encounter"
 * ]);
 * ```
 */
export default function medfetch<
    const Resources extends {resourceType: string}
>(
    baseURL: string | File,
    config: ClientOptions<Resources> | Resources["resourceType"][] = []
): SqlOnFhirDialect<Resources> {
    if (!BROWSER) {
        console.warn(
            `[medfetch/sqlite-wasm] > Called in non-browser environment, returning dummy...`,
        );
        return dummy("sqlite") as any as SqlOnFhirDialect<Resources>;
    }
    const { worker, filename, scope } = normalizeOptions(config);
    
    return new Worker1PromiserDialect({
        database: async () => {
            const sqliteWorker = accessWorker(worker);
            const promiserDB = await openPromiserDB(sqliteWorker, {
                type: "open",
                args: {
                    vfs: "opfs",
                    filename: filename ?? ":memory:"
                },
                aux: {
                    baseURL: baseURL,
                    scope: scope
                }
            });
            return promiserDB;
        }
    }) as SqlOnFhirDialect<Resources>;
}