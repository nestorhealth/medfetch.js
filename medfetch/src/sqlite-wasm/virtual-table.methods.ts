import { sqlite3_module } from "@sqlite.org/sqlite-wasm";
import { Effect, gen, logError } from "effect/Effect";
import { Page } from "~/data";
import { FetchSync } from "~/fetch.services";
import { flat } from "~/sof";
import {
    ModuleContext,
    medfetch_vtab,
    Sqlite3WebAssembly,
    medfetch_vtab_cursor,
    TokenFetcher,
    generateViewDefinition,
} from "~/sqlite-wasm/virtual-table.services";

type Params<Key extends keyof sqlite3_module> = Parameters<
    sqlite3_module[Key] extends (...args: any[]) => any
        ? sqlite3_module[Key]
        : never
>;

/**
 * The xConnect method
 * @param args {@link Params<"xConnect">}
 * @returns The x_connect method
 */
export function x_connect(
    ...args: Params<"xConnect">
): Effect<number, never, Sqlite3WebAssembly | ModuleContext> {
    let [pdb, _paux, _argc, _argv, ppvtab] = args;

    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        let ctx = yield* ModuleContext;

        let rc = sqlite3.capi.SQLITE_OK;
        rc += sqlite3.capi.sqlite3_declare_vtab(
            pdb,
            `CREATE TABLE resource(
                id TEXT,
                json TEXT,
                type HIDDEN,
                fp   HIDDEN
            )`,
        );
        if (!rc) {
            let virtualTable = sqlite3.vtab.xVtab.create(
                ppvtab,
            ) as medfetch_vtab;
            virtualTable.baseURL = ctx.aux["baseURL"];
        }
        return rc;
    });
}

export function x_best_index(...args: Params<"xBestIndex">) {
    let [, pIdxInfo] = args;
    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        const index = sqlite3.vtab.xIndexInfo(pIdxInfo);
        for (let i = 0; i < index.$nConstraint; i++) {
            const constraint = index.nthConstraint(i);
            const usage = index.nthConstraintUsage(i);
            switch (constraint.$op) {
                case sqlite3.capi.SQLITE_INDEX_CONSTRAINT_LIMIT: {
                    usage.$argvIndex = i + 1;
                    usage.$omit = 1;
                    break;
                }
                case sqlite3.capi.SQLITE_INDEX_CONSTRAINT_OFFSET: {
                    usage.$argvIndex = i + 1;
                    usage.$omit = 1;
                    break;
                }
                default: {
                    usage.$argvIndex = i + 1;
                    usage.$omit = 1;
                }
            }
        }

        index.dispose();
        return sqlite3.capi.SQLITE_OK;
    });
}

export function x_disconnect(...args: Params<"xDisconnect">) {
    let [pVtab] = args;
    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        sqlite3.vtab.xVtab.unget(pVtab);
        return sqlite3.capi.SQLITE_OK;
    });
}

export function x_open(...args: Params<"xOpen">) {
    let [pVtab, ppCursor] = args;
    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        let cursor = sqlite3.vtab.xCursor.create(
            ppCursor,
        ) as medfetch_vtab_cursor;
        cursor.pVtab = pVtab;
        return sqlite3.capi.SQLITE_OK;
    });
}

export function x_close(...args: Params<"xClose">) {
    let [pCursor] = args;
    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        sqlite3.vtab.xCursor.unget(pCursor);
        return sqlite3.capi.SQLITE_OK;
    });
}

export function x_next(...args: Params<"xNext">) {
    let [pCursor] = args;
    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        let cursor = sqlite3.vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        cursor.peeked = cursor.rows.next();
        return sqlite3.capi.SQLITE_OK;
    });
}

export function x_column(...args: Params<"xColumn">) {
    let [pCursor, pCtx, iCol] = args;

    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        let cursor = sqlite3.vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        let hd = cursor.peeked;
        if (hd.done || !hd.value) {
            yield* logError(
                `xColumn called on cursor with empty last peeked resource!`,
            );
            return sqlite3.capi.SQLITE_ERROR;
        }
        switch (iCol) {
            case 0: {
                sqlite3.capi.sqlite3_result_text(
                    pCtx,
                    hd.value.id,
                    -1,
                    sqlite3.capi.SQLITE_TRANSIENT,
                );
                break;
            }
            case 1: {
                let json: string;
                if (cursor.viewDefinition)
                    json = JSON.stringify(
                        flat([hd.value], cursor.viewDefinition)[0],
                    );
                else json = JSON.stringify(hd.value);
                sqlite3.capi.sqlite3_result_text(
                    pCtx,
                    json,
                    -1,
                    sqlite3.capi.SQLITE_TRANSIENT,
                );
                break;
            }
        }
        return sqlite3.capi.SQLITE_OK;
    });
}

export function x_eof(...args: Params<"xEof">) {
    let [pCursor] = args;

    return gen(function* () {
        let sqlite3 = yield* Sqlite3WebAssembly;
        let fetchSync = yield* FetchSync;
        let tokenFetcher = yield* TokenFetcher;
        const headers = (expired = false): Record<string, string> => {
            const kvs: Record<string, string> = {
                "Content-Type": "application/json+fhir",
            };
            const token = tokenFetcher.get(expired);
            if (token) kvs["Authorization"] = `Bearer ${token}`;
            return kvs;
        };

        const cursor = sqlite3.vtab.xCursor.get(
            pCursor,
        ) as medfetch_vtab_cursor;
        if (!cursor.peeked)
            // False on initial call
            cursor.peeked = cursor.rows.next();

        if (cursor.peeked.done) {
            const nextURL = cursor.pageNext();
            if (nextURL) {
                let response = fetchSync(nextURL, {
                    headers: headers(),
                });
                if (response.status === 401) {
                    response = fetchSync(nextURL, {
                        headers: headers(true),
                    });
                    if (!response.ok) {
                        console.error(
                            `[medfetch/sqlite-wasm/vtab]: Bad response from server even after refreshing token, exiting now`,
                        );
                        return sqlite3.capi.SQLITE_ERROR;
                    }
                }
                let stream = Page(response.stream);
                cursor.rows = stream.resources();
                cursor.pageNext = stream.next;
                cursor.peeked = cursor.rows.next();
                return cursor.peeked.done ? 1 : sqlite3.capi.SQLITE_OK;
            } else return 1;
        }
        return sqlite3.capi.SQLITE_OK;
    });
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

export function x_filter(...args: Params<"xFilter">) {
    let [pCursor, _idxNum, _idxCStr, argc, argv] = args;

    return gen(function* () {
        let { capi, vtab } = yield* Sqlite3WebAssembly;
        let fetchSync = yield* FetchSync;
        let tokenFetcher = yield* TokenFetcher;

        const headers = (expired = false): Record<string, string> => {
            const kvs: Record<string, string> = {
                "Content-Type": "application/json+fhir",
            };
            const token = tokenFetcher.get(expired);
            if (token) kvs["Authorization"] = `Bearer ${token}`;
            return kvs;
        };
        let args = capi.sqlite3_values_to_js(argc, argv);
        if (args.length < 1 || typeof args[0] !== "string") {
            yield* logError(`can't handle empty arguments`);
            return capi.SQLITE_ERROR;
        }

        let [resourceType] = args;
        let cursor = vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        let { baseURL } = vtab.xVtab.get(cursor.pVtab);
        let response = fetchSync(url(baseURL, resourceType), {
            headers: headers(),
        });
        if (response.status === 401) {
            response = fetchSync(url(baseURL, resourceType), {
                headers: headers(true)
            });
            if (!response.ok) {
                yield *logError(`Couldn't fetch access token on retry`);
                return capi.SQLITE_ERROR;
            }
        }
        
        let { resources, next } = Page(response.stream);
        cursor.rows = resources();
        cursor.pageNext = next;
        cursor.viewDefinition = generateViewDefinition(args);
        return capi.SQLITE_OK;
    });
};
