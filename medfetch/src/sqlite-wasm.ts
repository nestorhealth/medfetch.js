import { DEFAULT_SQLITE_FROM_FHIR, dummyDialect, migrations, type SqlOnFhirDialect } from "./sql.js";
import { worker1DB, Worker1PromiserDialect } from "./dialects.js";
import { BROWSER } from "esm-env";
import type { Sqlite3Module, Worker1OpenRequest } from "./sqlite-wasm/worker1.types.js";
import { promiserSyncV2 } from "./sqlite-wasm/worker1.main.js";
import type { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { Page } from "./json/json.page.js";
import { Counter } from "./sqlite-wasm/counter.js";
import { PageLoaderFn, medfetch_module_alloc } from "./sqlite-wasm/vtab.js";
import { attach, index, pointer } from "./sqlite-wasm/worker1.js";

// Logs
let __worker: Worker | null = null;
const tag = "medfetch/sqlite-wasm";
const taggedMessage = (msg: string) => `[${tag}] > ${msg}`;

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

export type LoadExtensionConfig = {
    fetch: (...args: Parameters<typeof fetch>) => string;
}

/**
 * Attach the message handler to the *worker* thread that has {@link Sqlite3Static} loaded.
 * This loads medfetch_module into every database opened
 * 
 * @param sqlite3Wasm The sqlite3 static object exposed by sqlite-wasm's esm module init function
 * @param syncFetch The synchronous fetch callback. Needs to block 
 * @returns 0 on success, 1 otherwise.
 * 
 * note: We add a callback if multiple databases per client is wanted
 */
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
