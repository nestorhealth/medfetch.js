import { DEFAULT_SQLITE_FROM_FHIR, fromFhir } from "./sql.js";
import type { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { type FetchTextSync, Page } from "./json/json.page.js";
import { Counter } from "./sqlite-wasm/counter.js";
import { medfetch_module_alloc } from "./sqlite-wasm/vtab.js";
import { attach, index, pointer } from "./sqlite-wasm/worker1.js";
import type { Sqlite3Module } from "./sqlite-wasm/worker1.types.js";

// Logs
const tag = "medfetch/sqlite-wasm";
const taggedMessage = (msg: string) => `[${tag}] > ${msg}`;


type LoadExtensionConfig = {
    fetch: FetchTextSync;
    jsonSchemaURL?: string;
    jsonSchemaFilename?: string;
};

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
export function loadExtension(
    sqlite3Wasm: Sqlite3Static,
    config: LoadExtensionConfig,
): 0 | 1 {
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

            const resourcesToRows = await fromFhir(
                "sqlite",
                DEFAULT_SQLITE_FROM_FHIR,
                {
                    scope: scope,
                    jsonSchemaURL: config.jsonSchemaURL,
                    jsonSchemaFilename: config.jsonSchemaFilename,
                },
            );
            if (typeof baseURL !== "string" && !(baseURL instanceof File)) {
                throw new Error(
                    taggedMessage(`Can't handle that: baseURL = ${baseURL}`),
                );
            }

            const pageLoader = Page.createLoader(baseURL, syncFetch);
            // Map database index to medfetch_module "instance"
            const dbIndex = dbCount.set();
            modules[dbIndex] = medfetch_module_alloc(
                pageLoader,
                sqlite3,
                resourcesToRows,
            );

            let scopeMsg: string;
            if (!!scope) {
                scopeMsg = `Fetch set is scoped to ${scope.map((s: string) => `"${s}"`)}`;
            } else
                [(scopeMsg = `No scope provided. Fetch set is scoped to all.`)];
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
