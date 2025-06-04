import type {
    Sqlite3,
    sqlite3_module,
    Sqlite3Module,
    Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";
import { Page } from "~/data";
import {
    type medfetch_vtab,
    type medfetch_vtab_cursor,
    type TokenFetcher,
} from "~/sqlite-wasm/virtual-table.services";
import { FetchSyncFn } from "~/workers/fetch.services";
// import { Page } from "~/data";
// import { type FetchSyncFn } from "~/workers/fetch.services";
// import { flat } from "~/sof";
// import type {
//     medfetch_vtab,
//     medfetch_vtab_cursor,
//     TokenFetcher,
// } from "~/sqlite-wasm/virtual-table.services";
// import { generateViewDefinition } from "~/sqlite-wasm/virtual-table.services";

type Params<Key extends keyof sqlite3_module> = Parameters<
    sqlite3_module[Key] extends (...args: any[]) => any
        ? sqlite3_module[Key]
        : never
>;
type ModuleContext = {
    readonly transfer: ReadonlyArray<MessagePort>;
    readonly aux: Record<string, any>;
};

/**
 * The xConnect method
 * @param sqlite3 The database instance
 * @param ctx The context
 * @param args {@link Params<"xConnect">}
 * @returns The x_connect method
 */
export function x_connect(_sqlite3: Sqlite3Static, ctx: ModuleContext) {
    let sqlite3 = _sqlite3;
    return (...args: Params<"xConnect">) => {
        let [pdb, _paux, _argc, _argv, ppvtab] = args;
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
    };
}

export function x_best_index(_sqlite3: Sqlite3Static) {
    let sqlite3 = _sqlite3 as Sqlite3;
    return (...args: Params<"xBestIndex">) => {
        let [, pIdxInfo] = args;
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
    };
}

export function x_disconnect(_sqlite3: Sqlite3Static) {
    return (...args: Params<"xDisconnect">) => {
        let [pVtab] = args;
        let sqlite3 = _sqlite3 as Sqlite3;
        sqlite3.vtab.xVtab.unget(pVtab);
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_open(_sqlite3: Sqlite3Static) {
    let sqlite3 = _sqlite3 as Sqlite3;

    return (...args: Params<"xOpen">) => {
        let [pVtab, ppCursor] = args;
        let cursor = sqlite3.vtab.xCursor.create(
            ppCursor,
        ) as medfetch_vtab_cursor;
        cursor.pVtab = pVtab;
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_close(_sqlite3: Sqlite3Static) {
    let sqlite3 = _sqlite3 as Sqlite3;
    return (...args: Params<"xClose">) => {
        let [pCursor] = args;
        sqlite3.vtab.xCursor.unget(pCursor);
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_next(_sqlite3: Sqlite3Static) {
    let sqlite3 = _sqlite3 as Sqlite3;
    return (...args: Params<"xClose">) => {
        let [pCursor] = args;
        let cursor = sqlite3.vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        cursor.peeked = cursor.rows.next();
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_column(_sqlite3: Sqlite3Static) {
    let sqlite3 = _sqlite3 as Sqlite3;
    return (...args: Params<"xColumn">) => {
        let [pCursor, pCtx, iCol] = args;
        let cursor = sqlite3.vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        let hd = cursor.peeked;
        if (hd.done || !hd.value) {
            console.error(
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
                const json = JSON.stringify(hd.value);
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
    };
}

export function x_eof(
    sqlite3: Sqlite3Static,
    fetchSync: FetchSyncFn,
    tokenFetcher?: TokenFetcher,
) {
    return (...args: Params<"xEof">) => {
        let [pCursor] = args;
        const headers = (expired = false): Record<string, string> => {
            const kvs: Record<string, string> = {
                "Content-Type": "application/json+fhir",
            };
            if (!tokenFetcher) {
                return kvs;
            }
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
    };
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

export function x_filter(
    _sqlite3: Sqlite3,
    fetchSync: FetchSyncFn,
    tokenFetcher?: TokenFetcher,
) {
    let sqlite3 = _sqlite3 as Sqlite3;
    let { capi, vtab } = sqlite3;

    return (..._args: Params<"xFilter">) => {
        let [pCursor, _idxNum, _idxCStr, argc, argv] = _args;
        let args = capi.sqlite3_values_to_js(argc, argv);

        const headers = (expired = false): Record<string, string> => {
            const kvs: Record<string, string> = {
                "Content-Type": "application/json+fhir",
            };
            if (!tokenFetcher) {
                return kvs;
            }
            const token = tokenFetcher.get(expired);
            if (token) kvs["Authorization"] = `Bearer ${token}`;
            return kvs;
        };
        if (args.length < 1 || typeof args[0] !== "string") {
            console.error(`can't handle empty arguments`);
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
                headers: headers(true),
            });
            if (!response.ok) {
                console.error(`Couldn't fetch access token on retry`);
                return capi.SQLITE_ERROR;
            }
        }

        let { resources, next } = Page(response.stream);
        cursor.rows = resources();
        cursor.pageNext = next;
        return capi.SQLITE_OK;
    };
}

/**
 * Get back the medfetch virtual table implementation
 * @param ctx
 * @param _sqlite3
 * @param fetchSync
 * @param tokenFetcher
 * @returns
 */
export function virtualTable(
    ctx: ModuleContext,
    _sqlite3: Sqlite3Static,
    fetchSync: FetchSyncFn,
    tokenFetcher?: TokenFetcher,
): Sqlite3Module {
    let sqlite3 = _sqlite3 as Sqlite3;
    return (sqlite3.vtab as any).setupModule({
        methods: {
            xCreate: 0,
            xConnect: x_connect(sqlite3, ctx),
            xBestIndex: x_best_index(sqlite3),
            xDisconnect: x_disconnect(sqlite3),
            xOpen: x_open(sqlite3),
            xClose: x_close(sqlite3),
            xNext: x_next(sqlite3),
            xColumn: x_column(sqlite3),
            xEof: x_eof(sqlite3, fetchSync, tokenFetcher),
            xFilter: x_filter(sqlite3, fetchSync, tokenFetcher),
        },
    });
}
