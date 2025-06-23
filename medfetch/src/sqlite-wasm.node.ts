import { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { NODE } from "esm-env";
import { Worker } from "node:worker_threads";
import { worker1DB, Worker1PromiserDialect } from "./dialects.js";
import { Page } from "./json/json.page.js";
import { dummyDialect, migrations } from "./sql.js";
import { DEFAULT_SQLITE_FROM_FHIR, SqlOnFhirDialect } from "./sql.types.js";
import { LoadExtensionConfig } from "./sqlite-wasm.js";
import { Counter } from "./sqlite-wasm/counter.js";
import { PageLoaderFn, medfetch_module_alloc } from "./sqlite-wasm/vtab.js";
import { attach, index, pointer } from "./sqlite-wasm/worker1.js";
import { promiserSyncV2 } from "./sqlite-wasm/worker1.main.js";
import type { 
    Sqlite3CreateWorker1Promiser,
    Sqlite3Module,
    Worker1Promiser,
    Worker1Request,
    Worker1Response,
    Worker1ResponseError
} from "./sqlite-wasm/worker1.types.js";

const tag = "medfetch/sqlite-wasm";
const taggedMessage = (msg: string) => `[${tag}] > ${msg}`;

// Helper to create a Promiser API from a Node.js Worker
const sqlite3Worker1Promiser: Sqlite3CreateWorker1Promiser<Worker> = {
    async v2({ worker }) {
        let reqId = 0;
        const pending = new Map<number, (result: any) => void>();

        worker.on("message", (event: any) => {
            const { id, type, result, error } = event;
            const resolver = pending.get(id);
            if (resolver) {
                pending.delete(id);
                if (error) {
                    resolver(Promise.reject(error));
                } else {
                    resolver({ type, result });
                }
            }
        });

        const promiser: Worker1Promiser = <T extends Worker1Request["type"]>(
            typeOrMessage: T | Extract<Worker1Request, { type: T }>,
            maybeArgs?: Extract<Worker1Request, { type: T }>["args"],
        ): Promise<
            Extract<Worker1Response, { type: T }> | Worker1ResponseError<T>
        > => {
            const id = ++reqId;

            const msg =
                typeof typeOrMessage === "string"
                    ? { dbId: `db#${id}`, type: typeOrMessage, args: maybeArgs }
                    : { dbId: `db${id}`, ...typeOrMessage };

            return new Promise((resolve) => {
                pending.set(id, resolve);
                worker.postMessage(msg);
            });
        };

        return promiser;
    },
};

export function loadExtension(sqlite3Wasm: Sqlite3Static, config: LoadExtensionConfig): 0 | 1 {
    const syncFetch = config.fetch;
    const sqlite3 = sqlite3Wasm;
    const dbCount = new Counter();
    const modules: Record<string, Sqlite3Module>[] = [];
    const moduleSet = new Set<number>();

    const rc = attach(sqlite3, async (msg, next) => {
        if (msg.data?.type === "open") {
            // Get baseURL
            const baseURL = msg.data.aux?.baseURL;
            const scope = msg.data.aux?.scope;
            if (!baseURL) {
                throw new Error(taggedMessage(`You have no base URL lol`));
            }
            if (scope) {
                if (!Array.isArray(scope)) {
                    throw new Error(
                        taggedMessage(
                            `That's not an array: (scope = ${typeof scope === "string" || typeof scope === "number" ? scope.toString() : "unknown"})`,
                        ),
                    );
                }
            }

            const resourcesToRows = await migrations(
                "sqlite",
                DEFAULT_SQLITE_FROM_FHIR,
                scope,
            );
            if (typeof baseURL !== "string" && !(baseURL instanceof File)) {
                throw new Error(
                    taggedMessage(`Can't handle that: baseURL = ${baseURL}`),
                );
            }

            const getPage: PageLoaderFn = (resourceType) => {
                const responseText = syncFetch(`${baseURL}/${resourceType}`);
                const generator = function* () {
                    // just yield the whole text for now until
                    yield responseText;
                };

                return new Page(generator(), (nextURL) => {
                    return (function* () {
                        const responseText = syncFetch(nextURL);
                        yield responseText;
                    })();
                });
            };

            // Map database index to medfetch_module "instance"
            const dbIndex = dbCount.set();
            modules[dbIndex] = medfetch_module_alloc(
                getPage,
                sqlite3,
                resourcesToRows,
            );

            let scopeMsg: string;
            if (!!scope) {
                scopeMsg = `Fetch set is scoped to ${scope.map((s: string) => `"${s}"`)}`;
            } else [
                scopeMsg = `No scope provided. Fetch set is scoped to all.`
            ]
            console.log(taggedMessage(`Connected to ${baseURL}. ${scopeMsg}`));
        }

        // We don't get the dbId until after "open"
        if (msg.data.type === "exec") {
            if (!msg.data.dbId) {
                throw new Error(
                    `[${tag}] > Can't query that: Database with an undefined "dbId"`,
                );
            }

            const extensions = modules[index(msg.data.dbId)];
            const pDb = pointer(msg.data.dbId);

            if (!moduleSet.has(pDb)) {
                if (!extensions) {
                    throw new Error(`[${tag}] > `);
                }
                for (const [key, value] of Object.entries(extensions)) {
                    const _rc = sqlite3.capi.sqlite3_create_module(
                        pDb,
                        key,
                        value.pointer,
                        0,
                    );
                    if (rc) {
                        console.error(
                            `[medfetch/sqlite-wasm] > ${key} returned error code ${rc}`,
                        );
                    }
                    if (import.meta.env.DEV) {
                        console.log(
                            `[medfetch/sqlite-wasm] > ${key} rc = ${_rc}`,
                        );
                    }
                }
                moduleSet.add(pDb);
            }
        }
        next();
    });

    if (rc) {
        console.error(`[${tag}] > Fatal error loading sqlite-wasm binary.`);
    } else {
        console.log(`[${tag}] > sqlite-wasm binary loaded and medfetch ready.`);
    }
    return rc;
}

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
                    ? "./threads/sqlite-wasm.js"
                    : "./threads/sqlite-wasm.js",
                import.meta.url,
            ),
            {
                name: "sqlite-wasm",
                workerData: {
                    name: "sqlite-wasm"
                }
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
    if (!NODE) {
        console.warn(
            `[medfetch/sqlite-wasm] > Called in non-nodejs environment, returning dummy...`,
        );
        return dummyDialect("sqlite") as any as SqlOnFhirDialect<Resources>;
    }

    return new Worker1PromiserDialect({
        database: async () => {
            const sqliteWorker = accessWorker(config.worker);
            const promiser = promiserSyncV2<Worker>(
                sqliteWorker, 
                sqlite3Worker1Promiser
            );
            const response = await promiser({
                type: "open",
                args: {
                    filename: filename,
                    vfs: "opfs"
                },
                aux: {
                    baseURL,
                    scope: config.scope
                }
            });
            if (response.type === "error" || !response.dbId) {
                throw new Error(`Couldn't get back database ID, early exiting...`)
            }
            const dbId = response.dbId;
            return worker1DB(dbId, promiser);
        }
    }) as SqlOnFhirDialect<Resources>;
}
