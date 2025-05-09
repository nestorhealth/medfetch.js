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
import { generateViewDefinition, Tokenizer } from "./vtab.services";
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
    baseURL: string;
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
//@ts-ignore -- don't need this if user's can pass in plain JS data from the closure
function decodeBaseURL({ wasm }: Sqlite3, pAux: WasmPointer): string {
    const size = new DataView(wasm.heap8().buffer, pAux, 4).getUint32(0, true);
    const urlBuffer = new DataView(wasm.heap8().buffer, pAux + 4, size);
    return new TextDecoder().decode(urlBuffer);
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
 * Based on the original C extension for native, but this time... with actual FHIRPath support !!
 */
const medfetch_module: VirtualTableExtensionFn<{
    baseURL: string;
}> = async (
    sqlite3,
    { transfer, aux },
) => {
    const { capi, vtab } = sqlite3;
    const fetchPort = transfer[0];
    if (!fetchPort)
        throw new Error(
            "medfetch: expected Fetch Worker port at ports[0] but got nothing",
        );
    const tokenPort = transfer.at(1);
    const tokenizer = new Tokenizer(tokenPort);

    // Blocking fetch function
    const fetchSync = FetchSync(fetchPort);
    const getCursor = (pcursor: WasmPointer) =>
        vtab.xCursor.get(pcursor) as medfetch_vtab_cursor;
    const getVirtualTable = (pvtab: WasmPointer) =>
        vtab.xVtab.get(pvtab) as medfetch_vtab;
        
    /* Convenience to get auth headers if token port + access token state matches up to exist */
    const headers = (expired = false): Record<string, string> => {
        const kvs: Record<string, string> = {
            "Content-Type": "application/json+fhir"
        }
        if (tokenPort) {
            const token = tokenizer.get(expired);
            if (token)
                kvs["Authorization"] = `Bearer ${token}`;
        }
        return kvs;
    }

    return {
        /* Set to 0 to mark as eponymous (something to do with being able to call as TVF) */
        xCreate: 0,
        xConnect(pDb, _pAux, _argc, _argv, ppVtab, _pzErr) {
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
                virtualTable.baseURL = aux.baseURL;
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
            if (done || !value) {
                console.error(`[medfetch/sqlite-wasm] Unexpected "done" or undefined "value" returned by cursor (done=${done}, (value == undefined) = ${value === undefined})`);
                return capi.SQLITE_ERROR
            }
            switch (iCol) {
                case 0: {
                    capi.sqlite3_result_text(
                        pCtx,
                        value.id,
                        -1,
                        capi.SQLITE_TRANSIENT,
                    );
                    break;
                }
                case 1: {
                    let json: string;
                    if (cursor.viewDefinition)
                        json = JSON.stringify(flat([value], cursor.viewDefinition)[0]);
                    else
                        json = JSON.stringify(value);
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
                    let response = fetchSync(nextURL, {
                        headers: headers()
                    });
                    if (response.status === 401) {
                        response = fetchSync(nextURL, {
                            headers: headers(true)
                        });
                        if (!response.ok) {
                            console.error(`[medfetch/sqlite-wasm/vtab]: Bad response from server even after refreshing token, exiting now`);
                            return capi.SQLITE_ERROR;
                        }
                    }
                    const stream = response.stream;
                    const { flush, nexturl } = Page.handler(stream);
                    cursor.rows = flush();
                    cursor.pageNext = nexturl;
                    cursor.peeked = cursor.rows.next();
                    return cursor.peeked.done ? 1 : capi.SQLITE_OK;
                } else
                    return 1;
            }
            return capi.SQLITE_OK;
        },
        xFilter: (pCursor, _idxNum, _idxCStr, argc, argv) => {
            const args = capi.sqlite3_values_to_js(argc, argv);
            const [resourceType] = args;
            if (typeof resourceType !== "string") {
                return capi.SQLITE_ERROR;
            }

            const cursor = getCursor(pCursor);
            const { baseURL } = getVirtualTable(cursor.pVtab);
            // Look mom, no await!
            let response = fetchSync(url(baseURL, resourceType), {
                headers: headers()
            });
            if (response.status === 401) {
                response = fetchSync(url(baseURL, resourceType), { 
                    headers: headers(true)
                });
                if (!response.ok) {
                    console.error(`[medfetch/sqlite-wasm/vtab]: Bad response from server even after refreshing token, exiting now`);
                    return capi.SQLITE_ERROR;
                }
            }
            const { flush, nexturl } = Page.handler(response.stream);
            cursor.rows = flush();
            cursor.pageNext = nexturl;
            cursor.viewDefinition = generateViewDefinition(args);
            return capi.SQLITE_OK;
        },
    } satisfies Sqlite3Module;
};

export default medfetch_module;