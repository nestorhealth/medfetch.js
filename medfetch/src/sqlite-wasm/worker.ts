/// <reference lib="webworker" />
import { worker1 } from "~/sqlite-wasm/worker1";
import sqlite3InitModule, { type Sqlite3Module } from "@sqlite.org/sqlite-wasm";
import { medfetch_module_alloc } from "~/sqlite-wasm/worker.vtab";
import { FetchSyncWorker } from "~/fetch.services";
import { Counter } from "~/sqlite-wasm/counter";
import { Page, __Page } from "~/data";

// For logs
const tag = "medfetch/sqlite-wasm::worker";

// Load in sqlite3 on wasm
sqlite3InitModule().then(async (sqlite3) => {
    // Singular FetchSync handle for all databases
    const fetchSync = await FetchSyncWorker();

    const dbCount = new Counter();
    const modules: Sqlite3Module[] = [];
    const moduleSet = new Set<number>();

    const rc = worker1(sqlite3, async (msg, next) => {
        if (msg.data?.type === "open") {
            // Get baseURL
            const baseURL = msg.data.aux?.baseURL;
            if (!baseURL) {
                throw new Error(
                    `[${tag}] > Need a base URL to open a medfetch database, but got nothing.`,
                );
            }
            console.log(
                `[${tag}] > Received init message with baseURL:`,
                baseURL,
            );

            // Map database id to medfetch_module "instance"
            const dbIndex = dbCount.set();
            const getPage = (resourceType: string) => {
                const response = fetchSync(url(baseURL, resourceType));
                const page = new Page(response.stream, (url) => {
                    const response = fetchSync(url);
                    return response.stream;
                });
                return page;
            };
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
                    console.error(
                        `[${tag}] > Tried to use medfetch module before init`,
                    );
                    return;
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
