import type {
    sqlite3_module,
    sqlite3_vtab_cursor,
    Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";
import type { Resource } from "fhir/r4";
import { Page } from "../json/json.page.js";
import { Sqlite3, Sqlite3Module } from "../sqlite-wasm/worker1.types.js";
import type { ResolveColumn, RowResolver } from "../sql.js";

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
}

/**
 * For loading in a memoized version of {@link Page}.
 * The memo is a temporary(?) fix to xFilter having to
 * refetch per row on an inner join, which obviously isn't ideal in the
 * worst case.
 */
export type PageLoaderFn = (resourceType: string) => Page;

const log = {
    on: (f: boolean, cb: () => void) => {
        if (f) {
            cb();
        }
        cb();
    },
    info: console.info,
    error: console.error,
    warn: console.warn,
};

/**
 * Allocate the medfetch_module object on the Web Assembly heap
 * and get back its struct-like object
 * @param loadPage {@link loadPage} handle closure over the FHIR data source
 * @param _sqlite3 Sqlite3
 * @param tokenFetcher Token fetcher for auth if needed
 * @returns The struct-like {@link Sqlite3Module}
 */
export function medfetch_module_alloc(
    loadPage: PageLoaderFn,
    sqlite3: Sqlite3Static,
    sof: RowResolver,
): Record<string, Sqlite3Module> {
    const modules: Record<string, Sqlite3Module> = {};

    for (const [resourceType, migrationText] of sof.migrations) {
        const mod: sqlite3_module = (sqlite3.vtab as any).setupModule({
            methods: {
                xCreate: 0,
                xConnect: x_connect(sqlite3, migrationText, resourceType),
                xBestIndex: x_best_index(sqlite3),
                xDisconnect: x_disconnect(sqlite3),
                xOpen: x_open(sqlite3, loadPage, resourceType),
                xClose: x_close(sqlite3),
                xNext: x_next(sqlite3),
                xColumn: x_column(sqlite3, sof.index),
                xEof: x_eof(sqlite3),
                xFilter: x_filter(sqlite3)
            },
        });

        if (!mod.pointer)
            throw new Error(`failed to allocate module for ${resourceType}`);
        modules[resourceType] = mod;
    }

    return modules;
}

type Params<Key extends keyof sqlite3_module> = Parameters<
    sqlite3_module[Key] extends (...args: any[]) => any
        ? sqlite3_module[Key]
        : never
>;
/**
 * The xConnect method factory function
 * @param sqlite3 The database instance
 * @param baseURL Base URL of the FHIR server
 * @param args {@link Params<"xConnect">}
 * @returns The x_connect method
 */
export function x_connect(
    _sqlite3: Sqlite3Static,
    migrationText: string,
    tableName: string,
) {
    let sqlite3 = _sqlite3;
    return (...args: Params<"xConnect">) => {
        let [pdb, _paux, _argc, _argv, ppvtab] = args;
        let rc = sqlite3.capi.SQLITE_OK;
        rc += sqlite3.capi.sqlite3_declare_vtab(pdb, migrationText);
        if (!rc) {
            sqlite3.vtab.xVtab.create(ppvtab);
            log.info(
                `medfetch virtual table ${tableName} xConnect() to ${tableName} OK`,
            );
        }
        return rc;
    };
}
export function x_best_index(_sqlite3: Sqlite3Static) {
    const sqlite3 = _sqlite3 as Sqlite3;

    return (...args: Params<"xBestIndex">) => {
        const [, pIdxInfo] = args;
        const index = sqlite3.vtab.xIndexInfo(pIdxInfo);
        (index as any).$idxNum = 0;
        (index as any).$estimatedCost = 10;
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

export function x_open(
    _sqlite3: Sqlite3Static,
    loadPage: PageLoaderFn,
    resourceType: string,
) {
    let sqlite3 = _sqlite3 as Sqlite3;

    return (...args: Params<"xOpen">) => {
        let [pVtab, ppCursor] = args;
        let cursor = sqlite3.vtab.xCursor.create(
            ppCursor,
        ) as medfetch_vtab_cursor;
        cursor.pVtab = pVtab;
        const rawGen = loadPage(resourceType).rows;
        const buffer: any[] = [];
        let index = 0;
        cursor.page = {
            rows: {
                next: () => {
                    if (index < buffer.length) {
                        return { value: buffer[index++], done: false };
                    }
                    const next = rawGen.next();
                    if (!next.done) {
                        buffer.push(next.value);
                        index++;
                    }
                    return next;
                },
                reset: (() => {
                    index = 0;
                }) as any,
            },
        } as any;

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
        cursor.peeked = next;
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_column(
    _sqlite3: Sqlite3Static,
    resolveColumn: ResolveColumn,
) {
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
        const { value, dataType } = resolveColumn(hd.value, iCol);
        if (value === null) {
            sqlite3.capi.sqlite3_result_null(pCtx);
        } else {
            switch (dataType) {
                case "blob":
                case "text": {
                    sqlite3.capi.sqlite3_result_text(
                        pCtx,
                        value,
                        -1,
                        sqlite3.capi.SQLITE_TRANSIENT,
                    );
                    break;
                }
                case "integer": {
                    sqlite3.capi.sqlite3_result_int(pCtx, value);
                    break;
                }
                case "boolean": {
                    const asInt = Number(!!value);
                    sqlite3.capi.sqlite3_result_int(pCtx, asInt);
                    break;
                }
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

/**
 * @param _sqlite3
 * @param getPage
 * @param resourceType
 * @returns
 */
export function x_filter(
    _sqlite3: Sqlite3Static,
) {
    let sqlite3 = _sqlite3 as Sqlite3;
    let { capi, vtab } = sqlite3;

    return (..._args: Params<"xFilter">) => {
        const [pCursor, _idxNum, _idxCStr] = _args;
        const cursor = vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        if (!cursor) return capi.SQLITE_ERROR;

        // Start the generator
        cursor.peeked = cursor.page.rows.next();
        if (cursor.peeked.done) {
            (cursor.page.rows as any).reset();
            cursor.peeked = cursor.page.rows.next();
        }

        return capi.SQLITE_OK;
    };
}
