import type {
    sqlite3_module,
    sqlite3_vtab_cursor,
    Sqlite3Static,
} from "@sqlite.org/sqlite-wasm";
import Page from "../json/page.js";
import type { Sqlite3, Sqlite3Module } from "./types.js";
import { entries, getTableName, virtualTable } from "../sql/table.js";
import walk, { type Walk } from "~/json/walk.js";

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
    peeked: IteratorResult<Record<string, unknown>>;
}

/**
 * For loading in a memoized version of {@link Page}.
 * The memo is a temporary(?) fix to xFilter having to
 * refetch per row on an inner join, which obviously isn't ideal in the
 * worst case.
 */
export type FetchPageFn = (resourceType: string) => string;

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
 * @param fetchPage A {@link FetchPageFn} handle closure over the FHIR data source
 * @param sqlite3 sqlite-wasm's web assembly api object
 * @param virtualMigration The initial migration text to define the "virtual" schema. Can be any valid (non as-select) create table statement,
 * with parsing of constraints and indexes being the abstraction layer this ultimately provides.
 * @returns The struct-like {@link Sqlite3Module}
 */
// #region medfetch_module_alloc
export function medfetch_module_alloc(
    fetchPage: FetchPageFn,
    sqlite3: Sqlite3Static,
    virtualMigration: string,
    walkFunc: Walk = walk,
): Record<string, Sqlite3Module> {
    const modules: Record<string, Sqlite3Module> = {};
    const tables = entries(virtualMigration);

    for (const [resourceType, migrationText] of tables) {
        const vt = virtualTable(migrationText.trim(), walkFunc);
        const mod: sqlite3_module = (sqlite3.vtab as any).setupModule({
            methods: {
                xCreate: 0,
                xConnect: x_connect(sqlite3, vt.statement),
                xBestIndex: x_best_index(sqlite3),
                xDisconnect: x_disconnect(sqlite3),
                xOpen: x_open(sqlite3, fetchPage, resourceType),
                xClose: x_close(sqlite3),
                xNext: x_next(sqlite3),
                xColumn: x_column(sqlite3, vt.lookupForeignColumn),
                xEof: x_eof(sqlite3),
                xFilter: x_filter(sqlite3),
            },
        });

        if (!mod.pointer)
            throw new Error(`failed to allocate module for ${resourceType}`);
        modules[resourceType] = mod;
    }

    return modules;
}
// #endregion medfetch_module_alloc

type Params<Key extends keyof sqlite3_module> = Parameters<
    sqlite3_module[Key] extends (...args: any[]) => any
        ? sqlite3_module[Key]
        : never
>;

/**
 * The [xConnect](https://www.sqlite.org/vtab.html#the_xconnect_method) method factory function
 * @param sqlite3 The {@link Sqlite3Static} wasm api object
 * @param baseURL Base URL of the FHIR server
 * @param args {@link Params<"xConnect">}
 * @returns The x_connect method
 */
export function x_connect(sqlite3: Sqlite3Static, migrationText: string) {
    // #region x_connect
    // This is the xConnect function with the migrationText in closure
    return (...args: Params<"xConnect">) => {
        const [pdb, _paux, _argc, _argv, ppvtab] = args;
        let rc = 0; // SQLITE_OK
        rc += sqlite3.capi.sqlite3_declare_vtab(pdb, migrationText);
        const tableName = getTableName(migrationText);
        if (rc) {
            log.error(
                `[medfetch/sqlite-wasm.vtab] >> 'xConnect' to virtual table "${tableName}" failed. Migration text was:\n${migrationText}`,
            );
            return rc;
        }
        sqlite3.vtab.xVtab.create(ppvtab);
        log.info(
            `medfetch virtual table ${tableName} xConnect() to ${tableName} OK`,
        );
        return rc;
    };
    // #endregion x_connect
}

export function x_best_index(sqlite3: Sqlite3Static) {
    return (...args: Params<"xBestIndex">) => {
        const [, pIdxInfo] = args;
        const index = sqlite3.vtab.xIndexInfo(pIdxInfo);
        (index as any).$idxNum = 0;
        (index as any).$estimatedCost = 10;
        index.dispose();
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_disconnect(sqlite3: Sqlite3Static) {
    return (...args: Params<"xDisconnect">) => {
        const [pVtab] = args;
        (sqlite3 as Sqlite3).vtab.xVtab.unget(pVtab);
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_open(
    sqlite3: Sqlite3Static,
    fetchPage: FetchPageFn,
    resourceType: string,
) {
    return (...args: Params<"xOpen">) => {
        const [pVtab, ppCursor] = args;
        const cursor = sqlite3.vtab.xCursor.create(
            ppCursor,
        ) as medfetch_vtab_cursor;
        cursor.pVtab = pVtab;
        try {
            const pageBuffer = fetchPage(resourceType);
            const asGen = function* () {
                console.log("right", pageBuffer)
                yield pageBuffer;
            }
            cursor.page = new Page(asGen);

            return sqlite3.capi.SQLITE_OK;
        } catch (err) {
            log.error(
                `xOpen() error on resourceType="${resourceType}": ${err}`,
            );
            return sqlite3.capi.SQLITE_ERROR;
        }
    };
}

export function x_close(sqlite3: Sqlite3Static) {
    return (...args: Params<"xClose">) => {
        const [pCursor] = args;
        (sqlite3 as Sqlite3).vtab.xCursor.unget(pCursor);
        return sqlite3.capi.SQLITE_OK;
    };
}

export function x_next(sqlite3: Sqlite3Static) {
    return (...args: Params<"xNext">) => {
        const [pCursor] = args;
        const cursor = sqlite3.vtab.xCursor.get(
            pCursor,
        ) as medfetch_vtab_cursor;
        const next = cursor.page.entries.next();
        cursor.peeked = next;
        return sqlite3.capi.SQLITE_OK;
    };
}

/**
 * Get back the [xColumn](https://www.sqlite.org/vtab.html#the_xcolumn_method) function sqlite3 calls which figures out
 * how to display a given column at index `iCol`.
 * @param sqlite3 The {@link Sqlite3Static} web assembly api object
 * @param resolveColumn The column resolver function
 * @returns `xColumn()` vtab callback implementation
 */
// #region x_column
export function x_column(
    sqlite3: Sqlite3Static,
    columns: ReadonlyMap<number, (json: unknown) => unknown>,
) {
    return (...args: Params<"xColumn">) => {
        const [pCursor, pCtx, iCol] = args;
        const cursor = sqlite3.vtab.xCursor.get(
            pCursor,
        ) as medfetch_vtab_cursor;
        const hd = cursor.peeked;
        if (hd.done || !hd.value) {
            console.error(
                `xColumn called on cursor with empty last peeked resource!`,
            );
            return sqlite3.capi.SQLITE_ERROR;
        }

        const column = columns.get(iCol)!;
        const columnValue = column(hd.value);
        if (!columnValue) {
            sqlite3.capi.sqlite3_result_null(pCtx);
        } else {
            switch (typeof columnValue) {
                case "object": {
                    sqlite3.capi.sqlite3_result_text(
                        pCtx,
                        JSON.stringify(columnValue),
                        -1,
                        sqlite3.capi.SQLITE_TRANSIENT,
                    );
                    break;
                }
                case "string": {
                    sqlite3.capi.sqlite3_result_text(
                        pCtx,
                        columnValue,
                        -1,
                        sqlite3.capi.SQLITE_TRANSIENT,
                    );
                    break;
                }
                case "number": {
                    sqlite3.capi.sqlite3_result_int(pCtx, columnValue);
                    break;
                }
                case "boolean": {
                    const asInt = Number(!!columnValue);
                    sqlite3.capi.sqlite3_result_int(pCtx, asInt);
                    break;
                }

                case "function":
                case "bigint":
                case "symbol":
                case "undefined": {
                    sqlite3.capi.sqlite3_result_null(pCtx);
                    break;
                }
            }
        }
        return sqlite3.capi.SQLITE_OK;
    };
}
// #endregion x_column

export function x_eof(sqlite3: Sqlite3Static) {
    return (...args: Params<"xEof">) => {
        const [pCursor] = args;

        const cursor = sqlite3.vtab.xCursor.get(
            pCursor,
        ) as medfetch_vtab_cursor;

        if (cursor.peeked.done || !cursor.peeked.value) {
            const nextPage = cursor.page.next;
            if (!nextPage) {
                return 1;
            }
            cursor.page = nextPage;
            cursor.peeked = cursor.page.entries.next();
        }
        return sqlite3.capi.SQLITE_OK;
    };
}

/**
 * Create the [xFilter](https://www.sqlite.org/vtab.html#the_xfilter_method)
 * callback sqlite3 calls to begin a search of a virtual table
 * @param sqlite3 The {@link Sqlite3} static web assembly helper object
 * @returns `xFilter()` vtab implementation
 */
export function x_filter(sqlite3: Sqlite3Static) {
    const { capi, vtab } = sqlite3;

    return (..._args: Params<"xFilter">) => {
        const [pCursor] = _args;
        const cursor = vtab.xCursor.get(pCursor) as medfetch_vtab_cursor;
        if (!cursor) return capi.SQLITE_ERROR;

        // Start the generator
        cursor.peeked = cursor.page.entries.next();
        console.log("and we're back...")
        if (cursor.peeked.done) {
            cursor.page.reset();
            cursor.peeked = cursor.page.entries.next();
        }

        return capi.SQLITE_OK;
    };
}
