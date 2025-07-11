import type { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import Page, { type FetchTextSync } from "./json/page.js";
import { Counter } from "./sqlite-wasm/counters.js";
import { medfetch_module_alloc } from "./sqlite-wasm/vtab.js";
import { attach, index, pointer } from "./sqlite-wasm/worker1.js";
import type { Sqlite3Module } from "./sqlite-wasm/types.js";
import kdv from "~/json/kdv.js";
import type { BundleLink as Link, BundleEntry as Entry } from "fhir/r5";

// Logs
const tag = "medfetch/sqlite-wasm.worker";
const taggedMessage = (msg: string) => `[${tag}] >> ${msg}`;

/**
 * The expected "aux" data shape from the main thread in js land, NOT
 * pAux for the sqlite vtab
 */
interface AuxJS {
    /**
     * The data source root. Either a FHIR server base URL or a plain
     * Bundle File instance
     */
    readonly baseURL: string | File;

    /**
     * The table migrations of the virtual tables to register
     */
    readonly virtualMigrations: string;
}

const parseLink = kdv<Link[]>("link", 1);
const parseEntry = kdv<Entry[]>("entry", 1);

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
export default function loadExtension(
    sqlite3Wasm: Sqlite3Static,
    syncFetch: FetchTextSync,
): 0 | 1 {
    const sqlite3 = sqlite3Wasm;
    const dbCount = new Counter();
    const modules: Record<string, Sqlite3Module>[] = [];
    const moduleSet = new Set<number>();

    const rc = attach(sqlite3, async (msg, next) => {
        if (msg.data?.type === "open") {
            // Get baseURL
            const aux: AuxJS = msg.data.aux as AuxJS;
            if (!aux.baseURL) {
                throw new Error(`You have no base URL lol`);
            }
            if (
                typeof aux.baseURL !== "string" &&
                !(aux.baseURL instanceof File)
            ) {
                throw new Error(
                    taggedMessage(
                        `Can't handle that "baseURL" = ${aux.baseURL}`,
                    ),
                );
            }

            const fetchPage = Page.fetcher(aux.baseURL, syncFetch, {
                link: (str) => {
                    const parsedLink = parseLink(str);
                    if (parsedLink) {
                        const result = parsedLink.hd.find(
                            (link) => link.relation === "next",
                        )?.url;
                        if (!result) {
                            return null;
                        }
                        return {
                            hd: result,
                            tl: null,
                        };
                    }
                    return null;
                },
                data: (str) => {
                    const entries = parseEntry(str);
                    if (!entries) {
                        return null;
                    }
                    const parsedResources = entries.hd.map(
                        (entry) => entry.resource,
                    );
                    return {
                        hd: parsedResources,
                        tl: null,
                    };
                },
            });
            // Map database index to medfetch_module "instance"
            const dbIndex = dbCount.set();
            modules[dbIndex] = medfetch_module_alloc(
                fetchPage,
                sqlite3,
                aux.virtualMigrations,
            );
        }

        // We don't get the dbId until after "open"
        if (msg.data?.type === "exec") {
            if (!msg.data.dbId) {
                throw new Error(
                    `[${tag}] >> Can't query that: Database with an undefined 'dbId'`,
                );
            }

            const extensions = modules[index(msg.data.dbId)];
            const pDb = pointer(msg.data.dbId);

            if (!moduleSet.has(pDb)) {
                if (!extensions) {
                    throw new Error(
                        `[${tag}] >> No 'medfetch_module' found for database '${msg.data.dbId}'!`,
                    );
                }
                const ok: string[] = [];
                for (const [key, value] of Object.entries(extensions)) {
                    const _rc = sqlite3.capi.sqlite3_create_module(
                        pDb,
                        key,
                        value.pointer,
                        0,
                    );
                    if (_rc) {
                        throw new Error(
                            `[${tag}] >> ${key} returned error code ${rc}`,
                        );
                    } else {
                        ok.push(key);
                    }
                }

                // memory allocation ok
                import.meta.env.DEV
                    ? console.log(
                          `[${tag}] >> allocated virtual tables:\n${ok.map((t) => `"${t}"`).join(", ")}`,
                      )
                    : void 0;

                moduleSet.add(pDb);
            }
        }
        next();
    });

    if (rc) {
        throw new Error(
            `[${tag}] > Unknown fatal error loading sqlite-wasm binary.`,
        );
    } else {
        import.meta.env.DEV
            ? console.log(`[${tag}] >> 'loadExtension' OK`)
            : void 0;
    }
    return rc;
}
