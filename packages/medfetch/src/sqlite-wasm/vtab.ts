import type {
    sqlite3_module,
    sqlite3_vtab_cursor,
    Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";
import type { Resource } from "fhir/r4";
import { Page } from "~/json";
import { Sqlite3, Sqlite3Module } from "~/sqlite-wasm/worker1.types";
import { ResolveColumn } from "~/sql";

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
    sqlite3: Sqlite3Static,
    schemaMap: Record<string, string>,
    column: ResolveColumn,
): Record<string, Sqlite3Module> {
    const modules: Record<string, Sqlite3Module> = {};

    for (const [resourceType, migrationText] of Object.entries(schemaMap)) {
        const mod: sqlite3_module = (sqlite3.vtab as any).setupModule({
            methods: {
                xCreate: 0,
                xConnect: x_connect(sqlite3, migrationText, resourceType),
                xBestIndex: x_best_index(sqlite3),
                xDisconnect: x_disconnect(sqlite3),
                xOpen: x_open(sqlite3),
                xClose: x_close(sqlite3),
                xNext: x_next(sqlite3),
                xColumn: x_column(sqlite3, column),
                xEof: x_eof(sqlite3),
                xFilter: x_filter(sqlite3, getPage, resourceType), // pass resourceType
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
 * The xConnect method
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
        console.log(
            `[medfetch/sqlite-wasm.vtab] > medfetch virtual table ${tableName} connected`,
        );
        let [pdb, _paux, _argc, _argv, ppvtab] = args;
        let rc = sqlite3.capi.SQLITE_OK;
        rc += sqlite3.capi.sqlite3_declare_vtab(pdb, migrationText);
        if (!rc) {
            sqlite3.vtab.xVtab.create(ppvtab);
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

export function x_filter(
    _sqlite3: Sqlite3Static,
    getPage: GetPageFn,
    resourceType: string,
) {
    let sqlite3 = _sqlite3 as Sqlite3;
    let { capi, vtab } = sqlite3;

    return (..._args: Params<"xFilter">) => {
        let [pCursor, _idxNum, _idxCStr] = _args;

        let cursor = vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        cursor.page = getPage(resourceType);
        cursor.peeked = cursor.page.rows.next();
        return capi.SQLITE_OK;
    };
}
