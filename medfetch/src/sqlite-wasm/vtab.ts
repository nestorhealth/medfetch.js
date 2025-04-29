/* eslint-disable */
import type {
    Sqlite3,
    sqlite3_vtab,
    sqlite3_vtab_cursor,
    Sqlite3Module,
    WasmPointer,
} from "@sqlite.org/sqlite-wasm";
import { flat } from "~/sof";
import { ViewDefinition } from "~/view.js";
import type { VirtualTableExtensionFn } from "./worker1.services";
import { generateViewDefinition } from "./vtab.services";
import { FetchSync } from "~/fetch.services";
import { Page } from "~/data";
import { Resource } from "~/data.schema";

/**
 * JS version of the medfetch_vtab "struct". *Extends* the vtab struct
 * rather than composing it, but this might change later
 */
interface medfetch_vtab extends sqlite3_vtab {
    /**
     * The base URL of the FHIR server to ping, expected
     * to be passed in via pAux from the user.
     */
    baseUrl: string;
}

/**
 * JS version of the medfetch_vtab_cursor "struct". *Extends* sqlite3_vtab cursor
 * rather than composing it, though this may change in the future
 */
interface medfetch_vtab_cursor extends sqlite3_vtab_cursor {
    /**
     * Return resources one by one via the `flush()` generator returned by {@link Page.handler}
     */
    rows: Generator<Resource>;
    
    /**
     * Get the next bundle page URL via the `nexturl()` function returned by {@link Page.handler}.
     * @returns The next Bundle page's URL if it exists, otherwise null.
     */
    pageNext: () => string | null;
    
    /**
     * The last resource popped by `flush()` from {@link Page.handler}
     */
    peeked: IteratorResult<Resource>;

    /**
     * The View Definition to apply to {@link peeked} if not null
     */
    viewDefinition: ViewDefinition | null;
}

/**
 * UTF-8 decode the base URL from the wasm pointer `pAux`
 * @param sqlite3 The Sqlite3Static module that the sqlite-wasm loader retursn
 * @param pAux The pointer to the 
 * @returns pAux dereferneced: *(pAux)
 */
function decodeBaseURL({ wasm }: Sqlite3, pAux: WasmPointer): string {
    const size = new DataView(wasm.heap8().buffer, pAux, 4).getUint32(0, true);
    const urlBuffer = new DataView(wasm.heap8().buffer, pAux + 4, size);
    return new TextDecoder().decode(urlBuffer);
}

/**
 * Based on the original C extension for native, but this time... 
 * with actual FHIRPath support !!
 */
const medfetch_module: VirtualTableExtensionFn = async (
    sqlite3,
    { transfer },
) => {
    const { capi, vtab } = sqlite3;
    const fetchPort = transfer[0];
    if (!fetchPort)
        throw new Error(
            "medfetch: expected Fetch Worker port at ports[0] but got nothing",
        );

    // Blocking fetch function
    const fetchSync = FetchSync(fetchPort);
    const getCursor = (pcursor: WasmPointer) =>
        vtab.xCursor.get(pcursor) as medfetch_vtab_cursor;
    const getVirtualTable = (pvtab: WasmPointer) =>
        vtab.xVtab.get(pvtab) as medfetch_vtab;

    return {
        /* Set to 0 to mark as eponymous (something to do with being able to call as TVF) */
        xCreate: 0,
        xConnect(pDb, pAux, _argc, _argv, ppVtab, _pzErr) {
            let rc = capi.SQLITE_OK;
            rc += capi.sqlite3_declare_vtab(
                pDb,
                `CREATE TABLE resource(
                    id TEXT,
                    json TEXT,
                    type HIDDEN,
                    fp   HIDDEN
                )`,
            );
            if (!rc) {
                const virtualTable = vtab.xVtab.create(ppVtab) as medfetch_vtab;
                virtualTable.baseUrl = decodeBaseURL(sqlite3, pAux);
            }
            return rc;
        },
        xBestIndex(_pVtab, pIdxInfo) {
            const index = vtab.xIndexInfo(pIdxInfo);
            for (let i = 0; i < index.$nConstraint; i++) {
                const constraint = index.nthConstraint(i);
                const usage = index.nthConstraintUsage(i);
                switch (constraint.$op) {
                    case capi.SQLITE_INDEX_CONSTRAINT_LIMIT: {
                        usage.$argvIndex = i + 1;
                        usage.$omit = 1;
                        break;
                    }
                    case capi.SQLITE_INDEX_CONSTRAINT_OFFSET: {
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
            return capi.SQLITE_OK;
        },
        xDestroy: true,
        xDisconnect(pVtab) {
            vtab.xVtab.unget(pVtab);
            return capi.SQLITE_OK;
        },
        xOpen: (pVtab, ppCursor) => {
            const cursor = vtab.xCursor.create(
                ppCursor,
            ) as medfetch_vtab_cursor;
            cursor.pVtab = pVtab;
            return capi.SQLITE_OK;
        },
        xClose: (pCursor) => {
            vtab.xCursor.unget(pCursor);
            return capi.SQLITE_OK;
        },
        xNext: (pCursor) => {
            const cursor = getCursor(pCursor);
            cursor.peeked = cursor.rows.next();
            return capi.SQLITE_OK;
        },
        xColumn(pCursor, pCtx, iCol) {
            const cursor = getCursor(pCursor);
            const { done, value } = cursor.peeked;
            if (done)
                throw new Error(`xColumn: cursor.peeked shouldn't be done...`);
            const row = value;
            switch (iCol) {
                case 0: {
                    capi.sqlite3_result_text(
                        pCtx,
                        row.id,
                        -1,
                        capi.SQLITE_TRANSIENT,
                    );
                    break;
                }
                case 1: {
                    let json: string;
                    if (cursor.viewDefinition)
                        json = JSON.stringify(flat([row], cursor.viewDefinition)[0]);
                    else
                        json = JSON.stringify(row);
                    capi.sqlite3_result_text(
                        pCtx,
                        json,
                        -1,
                        capi.SQLITE_TRANSIENT,
                    );
                    break;
                }
            }
            return capi.SQLITE_OK;
        },
        xRowid: (_pCursor, _ppRowid64) => {
            return capi.SQLITE_OK;
        },
        xEof: (pCursor) => {
            const cursor = getCursor(pCursor);
            if (!cursor.peeked) // False on initial call
                cursor.peeked = cursor.rows.next();
            
            if (cursor.peeked.done) {
                const nextURL = cursor.pageNext();
                if (nextURL) {
                    const stream = fetchSync(nextURL).stream;
                    const { flush, nexturl } = Page.handler(stream);
                    cursor.rows = flush();
                    cursor.pageNext = nexturl;
                    cursor.peeked = cursor.rows.next();
                    return cursor.peeked.done ? 1 : 0;
                } else
                    return 1;
            }
            return 0;
        },
        xFilter: (pCursor, _idxNum, _idxCStr, argc, argv) => {
            const args = capi.sqlite3_values_to_js(argc, argv);
            const [resourceType] = args;
            if (typeof resourceType !== "string") {
                return capi.SQLITE_ERROR;
            }

            const cursor = getCursor(pCursor);
            const { baseUrl } = getVirtualTable(cursor.pVtab);
            let url: string | undefined =
                baseUrl[baseUrl.length - 1] === "/"
                    ? `${baseUrl}${resourceType}`
                    : `${baseUrl}/${resourceType}`;

            // Look mom, no await!
            const response = fetchSync(url);
            const { flush, nexturl } = Page.handler(response.stream);
            cursor.rows = flush();
            cursor.pageNext = nexturl;
            cursor.viewDefinition = generateViewDefinition(args);
            return 0;
        },
    } satisfies Sqlite3Module;
};

export default medfetch_module;