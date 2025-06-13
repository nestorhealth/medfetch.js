/// <reference lib="webworker" />
import { PageLoaderFn, medfetch_module_alloc } from "~/sqlite-wasm/vtab";
import { attach } from "~/sqlite-wasm/worker1";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { Counter } from "~/sqlite-wasm/counter";
import { Page } from "~/json.page";
import type { Sqlite3Module } from "~/sqlite-wasm/worker1.types";
import { ping, syncFetch } from "~/sqlite-wasm.block";
import { sqlOnFhir } from "~/sql";
import { DummyDriver, Kysely, SqliteAdapter, SqliteIntrospector, SqliteQueryCompiler } from "kysely";
import { DEFAULT_SQLITE_FROM_FHIR } from "~/sql.types";

const qb = new Kysely({
    dialect: {
        createAdapter: () => new SqliteAdapter(),
        createDriver: () => new DummyDriver(),
        createIntrospector: (db) => new SqliteIntrospector(db),
        createQueryCompiler: () => new SqliteQueryCompiler(),
    }
})

// Logs
const tag = "medfetch/sqlite-wasm";
const taggedMessage = (msg: string) => `[${tag}] > ${msg}`;

const block = new Worker(new URL(
    import.meta.env.DEV ?
    "./sqlite-wasm.block.js" :
    "./sqlite-wasm.block.js",
    import.meta.url
), {
    type: "module",
    name: "sqlite-wasm.block"
})

// Load in sqlite3 on wasm
sqlite3InitModule().then(async (sqlite3) => {
    await ping(block);
    const dbCount = new Counter();
    const modules: Record<string, Sqlite3Module>[] = [];
    const moduleSet = new Set<number>();

    const rc = attach(sqlite3, async (msg, next) => {
        if (msg.data?.type === "open") {
            // Get baseURL
            const baseURL = msg.data.aux?.baseURL;
            const scope = msg.data.aux?.scope ?? null;
            if (!baseURL) {
                throw new Error(
                    taggedMessage(
                        `Need a base URL to open a medfetch database, but got nothing.`,
                    ),
                );
            }

            const schema = await sqlOnFhir(qb, DEFAULT_SQLITE_FROM_FHIR, scope);
            if (typeof baseURL !== "string" && !(baseURL instanceof File)) {
                throw new Error(
                    taggedMessage(`Can't handle that baseURL ${baseURL}`),
                );
            }
            const getPage: PageLoaderFn = (resourceType) => {
                const responseText = syncFetch(`${baseURL}/${resourceType}`);
                const generator = function*() {
                    yield responseText;
                };
                
                return new Page(
                    generator(),
                    (nextURL) => {
                        return (function* () {
                            const responseText = syncFetch(nextURL);
                            yield responseText;
                        })();
                    },
                );
            }

            console.log(
                taggedMessage(`Received init message with baseURL: ${baseURL}`),
            );

            // Map database index to medfetch_module "instance"
            const dbIndex = dbCount.set();
            modules[dbIndex] = medfetch_module_alloc(getPage, sqlite3, schema);
        }

        // We don't get the dbId until after "open"
        if (msg.data.type === "exec") {
            if (!msg.data.dbId) {
                throw new Error(
                    `[${tag}] > Can't query database with an undefined "dbId"`,
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
});

function index(internalDbId: string): number {
    return parseInt(internalDbId.split("#")[1][0]) - 1;
}

/**
 * Hack to get the pointer from the dbId, despite the docs saying it's
 * not guaranteed to mean anything...
 * Based on the dist code:
 * ```ts
 * // sqlite3.mjs line 11390 (lol)
 * const getDbId = function (db) {
 *   let id = wState.idMap.get(db);
 *   if (id) return id;
 *   id = 'db#' + ++wState.idSeq + '@' + db.pointer;
 *
 *   wState.idMap.set(db, id);
 *   return id;
 * };
 * ```
 * A virtual table / any runtime loadable extension lives in memory only,
 * so the lifetime of an extension should match that of a database
 * on the heap, so this should (hopefully) be fine...
 *
 * @param internalDbId The database id assigned by the worker API
 * @returns The pointer value as a raw js number
 *
 */
function pointer(internalDbId: string): number {
    const split = internalDbId.split("@");
    return parseInt(split[split.length - 1]);
}
