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
import { Bundle, generateViewDefinition } from "./vtab.services";
import { FetchSync } from "~/fetch.services";

interface medfetch_vtab extends sqlite3_vtab {
    baseUrl: string;
}
interface medfetch_vtab_cursor extends sqlite3_vtab_cursor {
    index: number;
    rows: any[];
    viewDefinition: ViewDefinition | null;
}


/**
 * service wrapper so we dont need to keep passing it
 * as an arg
 */
function getBaseUrl({ wasm }: Sqlite3, pAux: WasmPointer) {
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
                virtualTable.baseUrl = getBaseUrl(sqlite3, pAux);
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
            cursor.index = 0;
            cursor.rows = [];
            return capi.SQLITE_OK;
        },
        xClose: (pCursor) => {
            vtab.xCursor.unget(pCursor);
            return capi.SQLITE_OK;
        },
        xNext: (pCursor) => {
            const cursor = getCursor(pCursor);
            cursor.index++;
            return capi.SQLITE_OK;
        },
        xColumn(pCursor, pCtx, iCol) {
            const cursor = getCursor(pCursor);
            const row = cursor.rows[cursor.index];
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
        xRowid: (pCursor, ppRowid64) => {
            const cursor = getCursor(pCursor);
            vtab.xRowid(ppRowid64, cursor.index);
            return capi.SQLITE_OK;
        },
        xEof: (pCursor) => {
            const cursor = getCursor(pCursor);
            const atEnd = cursor.index >= cursor.rows.length;
            return Number(atEnd);
        },
        xFilter: (pCursor, _idxNum, _idxCStr, argc, argv) => {
            const args = capi.sqlite3_values_to_js(argc, argv);
            const [resourceType] = args;
            if (typeof resourceType !== "string") {
                // basic check, may add enum inclusion check later
                return capi.SQLITE_ERROR;
            }

            const cursor = getCursor(pCursor);
            const { baseUrl } = getVirtualTable(cursor.pVtab);
            // to allow for (1) trailing slash
            let url: string | undefined =
                baseUrl[baseUrl.length - 1] === "/"
                    ? `${baseUrl}${resourceType}`
                    : `${baseUrl}/${resourceType}`;

            cursor.rows = [];
            console.time("vtab::fetch+json");
            while (url) {
                // look mom, no await!
                const response = fetchSync(url);
                const bundle: Bundle = response.json;
                url = bundle.link.find(
                    (link) => link.relation === "next"
                )?.url;
                cursor.rows.push(
                    ...bundle.entry.map(({ resource }) => resource)
                );
            }
            console.timeEnd("vtab::fetch+json");

            // handle inline fhirpath transformations
            cursor.viewDefinition = generateViewDefinition(args);
            return 0;
        },
    } satisfies Sqlite3Module;
};

export default medfetch_module;
