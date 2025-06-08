/// <reference lib="webworker" />
import { GetPageFn, medfetch_module_alloc } from "~/sqlite-wasm/vtab";
import { worker1 } from "~/sqlite-wasm/_worker1.worker";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { type FetchSync, blockingFetchFactory } from "~/fetch";
import { Counter } from "~/sqlite-wasm/_counter";
import { Page } from "~/fhir/data";
import type { Sqlite3Module } from "~/sqlite-wasm/_types.patch";

// Logs
const tag = "medfetch/sqlite-wasm.worker";
const taggedMessage = (msg: string) => `[${tag}] > ${msg}`;

// Load in sqlite3 on wasm
sqlite3InitModule().then(async (sqlite3) => {
    // Singular blockingFetch handle for all databases
    const fetchSync = await blockingFetchFactory();

    const dbCount = new Counter();
    const modules: Sqlite3Module[] = [];
    const moduleSet = new Set<number>();

    const rc = worker1(sqlite3, async (msg, next) => {
        if (msg.data?.type === "open") {
            // Get baseURL
            const baseURL = msg.data.aux?.baseURL;
            if (!baseURL) {
                throw new Error(
                    taggedMessage(
                        `Need a base URL to open a medfetch database, but got nothing.`,
                    ),
                );
            }
            if (typeof baseURL !== "string" && !(baseURL instanceof File)) {
                throw new Error(
                    taggedMessage(`Can't handle that baseURL ${baseURL}`),
                );
            }
            const getPage = await createGetPageFn(baseURL, fetchSync);

            console.log(
                taggedMessage(`Received init message with baseURL: ${baseURL}`),
            );

            // Map database index to medfetch_module "instance"
            const dbIndex = dbCount.set();
            modules[dbIndex] = medfetch_module_alloc(getPage, sqlite3);
        }

        // We don't get the dbId until after "open"
        if (msg.data.type === "exec") {
            if (!msg.data.dbId) {
                throw new Error(
                    `[${tag}] > Can't query database with an undefined "dbId"`,
                );
            }

            const extension = modules[index(msg.data.dbId)];
            const pDb = pointer(msg.data.dbId);

            if (!moduleSet.has(pDb)) {
                if (!extension) {
                    throw new Error(`[${tag}] > `);
                }
                sqlite3.capi.sqlite3_create_module(
                    pDb,
                    "medfetch",
                    extension.pointer,
                    0,
                );
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

/**
 * Appends {@link baseURL} with {@link resourceType}, handling
 * if {@link baseURL} was written with a trailing slash or not.
 * @param baseURL The base URL, can have one trailing slash or none
 * @param resourceType The resource type to fetch
 * @returns The initial search URL
 */
function url(baseURL: string, resourceType: string) {
    return baseURL[baseURL.length - 1] === "/"
        ? `${baseURL}${resourceType}`
        : `${baseURL}/${resourceType}`;
}

/**
 * @param baseURL The baseURL of the fhir server or a File of a Bundle
 * @param fetchSync The blocking fetch function
 * @returns A getPage() function for the virtual table to get its FHIR data from
 */
async function createGetPageFn(
    baseURL: string | File,
    fetchSync: FetchSync,
): Promise<GetPageFn> {
    if (typeof baseURL === "string") {
        // REST API
        return (resourceType: string) => {
            const response = fetchSync(url(baseURL, resourceType));
            const page = new Page(response.stream, (url) => {
                const response = fetchSync(url);
                return response.stream;
            });
            return page;
        };
    } else {
        // File
        const buffer = await baseURL.text();

        // Just provide the entire buffer for a File
        return (_resourceType: string) =>
            new Page(
                (function* () {
                    yield buffer;
                })(),
            );
    }
}
