import type { sqlite3_module, sqlite3_vtab_cursor, Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import type { Resource } from "fhir/r4";
import { Page } from "~/data";
import { Sqlite3, Sqlite3Module } from "~/sqlite-wasm/_types.patch";
import { ViewDefinition } from "~/view";

/**
 * JS version of the medfetch_vtab_cursor "struct". *Extends* sqlite3_vtab cursor
 * rather than composing it, though this may change in the future
 */
export interface medfetch_vtab_cursor extends sqlite3_vtab_cursor {
    /**
     * Current {@link Page}
     */
    page: Page;

    /**
     * The last resource yielded by {@link Page}
     */
    peeked: IteratorResult<Resource>;

    /**
     * The View Definition to apply to {@link peeked} if not null
     */
    viewDefinition: ViewDefinition | null;
}

function log(...args: Parameters<typeof console.log>) {
    if (import.meta.env.DEV) {
        console.log(...args);
    }
}

export type GetPageFn = (resourceType: string) => Page;

/**
 * Allocate the medfetch_module object on the Web Assembly heap
 * and get back its struct-like object
 * @param getPage {@link FetchSync} handle closure over the FHIR data source
 * @param _sqlite3 Sqlite3
 * @param tokenFetcher Token fetcher for auth if needed
 * @returns The struct-like {@link Sqlite3Module}
 */
export function medfetch_module_alloc(
    getPage: GetPageFn,
    _sqlite3: Sqlite3Static,
): Sqlite3Module {
    let sqlite3 = _sqlite3 as Sqlite3;
    const medfetch: sqlite3_module = (sqlite3.vtab as any).setupModule({
        methods: {
            xCreate: 0,
            xConnect: x_connect(sqlite3),
            xBestIndex: x_best_index(sqlite3),
            xDisconnect: x_disconnect(sqlite3),
            xOpen: x_open(sqlite3),
            xClose: x_close(sqlite3),
            xNext: x_next(sqlite3),
            xColumn: x_column(sqlite3),
            xEof: x_eof(sqlite3),
            xFilter: x_filter(sqlite3, getPage),
        },
    });
    if (!medfetch.pointer) {
        throw new Error(`couldn't allocate the module`);
    }
    return medfetch;
}

type Params<Key extends keyof sqlite3_module> = Parameters<
    sqlite3_module[Key] extends (...args: any[]) => any
        ? sqlite3_module[Key]
        : never
>;
/**
 * The xConnect method
 * @param sqlite3 The database instance
 * @param baseURL Base URL of the FHIR server
 * @param args {@link Params<"xConnect">}
 * @returns The x_connect method
 */
export function x_connect(_sqlite3: Sqlite3Static) {
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
            sqlite3.vtab.xVtab.create(ppvtab);
        }
        return rc;
    };
}

export function x_best_index(_sqlite3: Sqlite3Static) {
    let sqlite3 = _sqlite3 as Sqlite3;
    return (...args: Params<"xBestIndex">) => {
        log("xConnect begin");
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
        let next = cursor.page.rows.next();
        log(
            `[xNext()] > Before: ${JSON.stringify(cursor.peeked.value, null, 2)?.slice(0, 50)}\nAfter: ${JSON.stringify(next.value, null, 2)?.slice(0, 50)}`,
        );
        cursor.peeked = next;
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
                    hd.value.id!,
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

export function x_eof(sqlite3: Sqlite3Static) {
    return (...args: Params<"xEof">) => {
        let [pCursor] = args;

        const cursor = sqlite3.vtab.xCursor.get(
            pCursor,
        ) as medfetch_vtab_cursor;

        if (cursor.peeked.done || !cursor.peeked.value) {
            const nextPage = cursor.page.next;
            if (!nextPage) {
                return 1;
            }
            cursor.page = nextPage;
            cursor.peeked = cursor.page.rows.next();
        }
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_filter(
    _sqlite3: Sqlite3,
    getPage: GetPageFn,
) {
    let sqlite3 = _sqlite3 as Sqlite3;
    let { capi, vtab } = sqlite3;

    return (..._args: Params<"xFilter">) => {
        let [pCursor, _idxNum, _idxCStr, argc, argv] = _args;
        let args = capi.sqlite3_values_to_js(argc, argv);
        if (args.length < 1 || typeof args[0] !== "string") {
            console.error(`can't handle empty arguments`);
            return capi.SQLITE_ERROR;
        }

        let [resourceType] = args;
        let cursor = vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        cursor.page = getPage(resourceType);
        cursor.peeked = cursor.page.rows.next();
        return capi.SQLITE_OK;
    };
}
