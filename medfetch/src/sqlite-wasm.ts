import { dummyDialect, type SqlOnFhirDialect } from "./sql.js";
import { openPromiserDB, Worker1PromiserDialect } from "./dialects.js";
import { BROWSER } from "esm-env";

// Logs
let __worker: Worker | null = null;

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
 * Medfetch's default sqlite on FHIR client dialect constructor.
 * This is not a "pure" function: it spawns in the sqlite-wasm worker thread
 * from the neighboring [sqlite-wasm.thread.ts](./sqlite-wasm.thread.ts)
 * file.
 * @param filename The filename to persist the database to, uses opfs by default but if you pass in ":memory:", then the opfs vfs option will be
 * @param baseURL The fhir data source, either the base URL of a FHIR API or a raw File Bundle
 * @param resources The resource types to include
 * @returns A plain {@link Worker1PromiserDialect} wrapped over a {@link SqlOnFhirDialect} for typescript
 */
export function medfetch<const Resources extends {resourceType: string}>(
    filename: string,
    baseURL: string | File,
    config: {
        scope: [Resources["resourceType"], ...Resources["resourceType"][]];
        worker?: Worker;
    }
): SqlOnFhirDialect<Resources> {
    if (!BROWSER) {
        console.warn(
            `[medfetch/sqlite-wasm] > Called in non-browser environment, returning dummy...`,
        );
        return dummyDialect("sqlite") as any as SqlOnFhirDialect<Resources>;
    }

    return new Worker1PromiserDialect({
        database: async () => {
            const sqliteWorker = accessWorker(config.worker);
            const promiserDB = await openPromiserDB(sqliteWorker, {
                type: "open",
                args: {
                    vfs: "opfs",
                    filename,
                },
                aux: {
                    baseURL: baseURL,
                    scope: config.scope
                }
            });
            return promiserDB;
        }
    }) as SqlOnFhirDialect<Resources>;
}
