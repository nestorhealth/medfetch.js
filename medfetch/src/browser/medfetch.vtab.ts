// @ts-nocheck 
import type {
    sqlite3_module,
    sqlite3_vtab,
    sqlite3_vtab_cursor,
    Sqlite3Static,
    WasmPointer,
} from "@sqlite.org/sqlite-wasm";
import type { FetchMessageRequest } from "./fetch.worker.js";

/**
 * service wrapper so we dont need to keep passing it
 * as an arg
 */
function getBaseUrl({ wasm }: Sqlite3Static, pAux: WasmPointer) {
    const size = new DataView(wasm.heap8().buffer, pAux, 4).getUint32(0, true);
    const urlBuffer = new DataView(wasm.heap8().buffer, pAux + 4, size);
    return new TextDecoder().decode(urlBuffer);
}

/**
 * create a worker thread to run fetch() calls and
 * pass it port2 from the constructed MessageChannel
 * to give it a private write-back buffer that sqlite worker will read.
 *
 * this is async because we want to block any calls to this module
 * until we are sure the fetch worker is initialized
 *
 * @returns port2
 */
async function getFetchPort(url: string) {
    const { port1, port2 } = new MessageChannel();
    const fetchWorker = new Worker(url, { type: "module" });
    fetchWorker.postMessage({ type: "init" }, [port2]);

    // block initalization
    return await new Promise<MessagePort>((resolve, reject) => {
        port1.onmessage = (e) => {
            if (e.data === "ready") {
                resolve(port1);
            } else {
                reject();
            }
        };
    });
}

interface medfetch_vtab extends sqlite3_vtab {
    baseUrl: string;
}
interface medfetch_vtab_cursor extends sqlite3_vtab_cursor {
    index: number;
    rows: any[];
}

const Requester = (port: MessagePort) =>
    function request(message: Omit<FetchMessageRequest, "type">) {
        const signal = new Int32Array(message.sharedSignal, 0, 1);
        signal[0] = 0;
        port.postMessage({ ...message, type: "request" });
        // sleep until signal != 0
        Atomics.wait(signal, 0, 0);
    };

export default async function Medfetch(sqlite3: Sqlite3Static, loaderAux: string[]) {
    const { wasm, capi, vtab } = sqlite3;
    const request = await getFetchPort(loaderAux[0]).then(Requester);
    const getCursor = (pcursor: WasmPointer) =>
        vtab.xCursor.get(pcursor) as medfetch_vtab_cursor;
    const getVirtualTable = (pvtab: WasmPointer) =>
        vtab.xVtab.get(pvtab) as medfetch_vtab;

    return {
        xCreate: 0,
        xConnect(pDb, pAux, argc, argv, ppVtab, pzErr) {
            let rc = capi.SQLITE_OK;
            rc += capi.sqlite3_declare_vtab(pDb, 
                `CREATE TABLE resource(
                    id TEXT,
                    json TEXT,
                    type HIDDEN
                )`);
            if (!rc) {
                const virtualTable = vtab.xVtab.create(ppVtab) as medfetch_vtab;
                virtualTable.baseUrl = getBaseUrl(sqlite3, pAux);
            }
            return rc;
        },
        xBestIndex(pVtab, pIdxInfo) {
            const index = vtab.xIndexInfo(pIdxInfo);
            for (let i = 0; i < index.$nConstraint; i++) {
                let u = index.nthConstraintUsage(i);
                u.$argvIndex = 1;
                u.$omit = 1;
            }

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
                case(0): {
                    capi.sqlite3_result_text(pCtx, row.id, -1, capi.SQLITE_TRANSIENT);
                    break;
                }
                case(1): {
                    const encoded = JSON.stringify(row);
                    capi.sqlite3_result_text(pCtx, encoded, -1, capi.SQLITE_TRANSIENT);
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
        xFilter: (pCursor, idxNum, idxCStr, argc, argv) => {
            const [resourceType] = capi.sqlite3_values_to_js(argc, argv);
            if (typeof resourceType !== "string")
                return capi.SQLITE_ERROR;
            const cursor = getCursor(pCursor);
            const { baseUrl } = getVirtualTable(cursor.pVtab);
            // to allow for (1) trailing slash
            let url = baseUrl[baseUrl.length - 1] === '/' ? `${baseUrl}${resourceType}`
                : `${baseUrl}/${resourceType}`;
            let resources: Resource[] = [];
            const sharedSignal = new SharedArrayBuffer(4 + 4 + 3 * 1024 * 1024);
            while (url !== null && url !== undefined) {
                request({ sharedSignal, url });
                const size = new DataView(sharedSignal, 4, 4).getUint32(0, true);
                const dataBytes = new Uint8Array(sharedSignal, 8, size);
                const payloadSerialized = new TextDecoder().decode(dataBytes.slice()); // can't read from shared buffer directly, need to slice() to copy
                const bundle: Bundle = JSON.parse(payloadSerialized);
                const extractedResources = bundle.entry.map(({ resource }) => resource);
                resources.push(...extractedResources);
                url = bundle.link?.find((link) => link.relation === "next")?.url;
            }

            cursor.rows = resources;
            return 0;
        }
    } satisfies sqlite3_module;
}
