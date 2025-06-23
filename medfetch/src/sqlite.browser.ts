import { isBrowser } from "./json/json.types";
import { Worker1PromiserDialect } from "./dialects";
import type { SqlOnFhirDialect } from "./sql.types";
import { dummyDialect } from "./sql";
import { promiserSyncV2 } from "./sqlite-wasm/worker1.main";

let __worker: Worker | null = null;

/**
 * So we don't load in the module on every recall the browser may have made
 * directly on indirectly to the dialect ctor
 *
 * @param userWorker A user provided Worker instance. If provided,
 * then user is in charge of handling any teardown
 * @returns A worker
 */
const getWorker = (userWorker?: Worker) => {
    if (userWorker) {
        return userWorker;
    }
    if (!__worker) {
        __worker = new Worker(
            new URL(
                /* Bundler friendly */
                import.meta.env.DEV
                    ? "./threads/sqlite-wasm.js"
                    : "./threads/sqlite-wasm.js",
                import.meta.url,
            ),
            {
                type: "module",
                name: "sqlite-wasm",
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
export function sqliteOnFhir<const Resources extends {resourceType: string}>(
    filename: string,
    baseURL: string | File,
    config: {
        scope: ReadonlyArray<Resources["resourceType"]>;
        worker?: Worker;
    }
): SqlOnFhirDialect<Resources> {
    if (!isBrowser()) {
        console.warn(
            `[medfetch/sqlite-wasm] > Called in non-browser environment, returning dummy...`,
        );
        return dummyDialect("sqlite") as any as SqlOnFhirDialect<Resources>;
    }
    const sqliteWorker = getWorker(config.worker);

    return new Worker1PromiserDialect(
        {
            type: "open",
            args: {
                vfs: "opfs",
                filename,
            },
            aux: {
                baseURL,
                scope: config.scope,
            },
        },
        promiserSyncV2(sqliteWorker),
    ) as SqlOnFhirDialect<Resources>;
}
