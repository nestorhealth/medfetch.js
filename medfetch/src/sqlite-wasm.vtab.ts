// @ts-nocheck
import type {
    sqlite3_module,
    sqlite3_vtab,
    sqlite3_vtab_cursor,
    Sqlite3Static,
    SqlValue,
    WasmPointer,
} from "@sqlite.org/sqlite-wasm";
import type { FetchCallRequest } from "./worker.js";
import { flat } from "~/sof";
import { type ColumnPath, Column, viewDefinition, columnPath } from "~/view";
import type { UserVirtualTableExport } from "sqliteow/services";

/**
 * service wrapper so we dont need to keep passing it
 * as an arg
 */
function getBaseUrl({ wasm }: Sqlite3Static, pAux: WasmPointer) {
    const size = new DataView(wasm.heap8().buffer, pAux, 4).getUint32(0, true);
    const urlBuffer = new DataView(wasm.heap8().buffer, pAux + 4, size);
    return new TextDecoder().decode(urlBuffer);
}

interface medfetch_vtab extends sqlite3_vtab {
    baseUrl: string;
}
interface medfetch_vtab_cursor extends sqlite3_vtab_cursor {
    index: number;
    rows: any[];
}

const Requester = (port: MessagePort) =>
    function request(message: Omit<FetchCallRequest, "type">) {
        const signal = new Int32Array(message.sharedSignal, 0, 1);
        signal[0] = 0;
        port.postMessage({ ...message, type: "request" });
        // sleep until signal != 0
        Atomics.wait(signal, 0, 0);
    };

function getColumnName(path: string | [string, any]) {
    if (typeof path !== "string") return path[0]; // default to the 'key' element in the 2-tuple

    let cleaned = path;
    while (cleaned.match(/\.\w+\([^)]*\)$/)) {
        cleaned = cleaned.replace(/\.\w+\([^)]*\)$/, "");
    }

    // split on '.' and return tail
    const parts = cleaned.split(".");
    return parts[parts.length - 1];
}

function top(path: string) {
    const split = path.split(".");
    // check if we have a top level resource pathstring
    // such as "Patient.foo". If so, return foo.
    if (split[0][0].toUpperCase() === split[0][0]) {
        return split[1];
    } else {
        return split[0];
    }
}
function size(path: string) {
    return path.split(".").length;
}

function generateViewDefinition(args: SqlValue[], rows: any[]) {
    const [resourceType, fp] = args;
    if (!resourceType || typeof resourceType !== "string")
        throw new Error(`medfetch: unexpected invalid resourceType in args[0]`);

    if (!fp)
        // no fhirpath map, then just return null and default to the whole object
        return null;

    const paths: (string | [string, any])[] = JSON.parse(fp); // todo: allow for forEach's and more complex path mappings
    if (!Array.isArray(paths))
        // no arg1 then we just return null
        return null;
    const inferredSet = new Set();
    const column: ColumnPath[] = [];
    for (let i = 0; i < rows.length; i++) {
        if (inferredSet.size === paths.length)
            // early exit! ideally we hit this on rows[0]
            break;
        const rowLike = rows[i];
        for (const path of paths) {
            if (typeof path === "string") {
                if (top(path) in rowLike) {
                    const value = rowLike[path];
                    const name = getColumnName(path);
                    // if it's not a top level extraction, then make it an array
                    const collection = Array.isArray(value) || size(path) > 1;
                    inferredSet.add(path);
                    column.push(
                        columnPath({
                            path,
                            name,
                            collection,
                        }),
                    );
                }
            }
        }
    }
    return viewDefinition({
        status: "active",
        name: resourceType,
        resource: resourceType,
        constant: [],
        select: [
            Column({
                column,
            }),
        ],
        where: [],
    });
}

/**
 * JS port of the original Medfetch virtual table extension for native SQLite.
 */
const medfetch_module: UserVirtualTableExport = async (
    sqlite3,
    { preload, transfer },
) => {
    const { wasm, capi, vtab } = sqlite3;
    const fetchPort = transfer[0];
    if (!fetchPort)
        throw new Error(
            "medfetch: expected Fetch Worker port at ports[0] but got nothing",
        );

    const request = Requester(fetchPort);
    const getCursor = (pcursor: WasmPointer) =>
        vtab.xCursor.get(pcursor) as medfetch_vtab_cursor;
    const getVirtualTable = (pvtab: WasmPointer) =>
        vtab.xVtab.get(pvtab) as medfetch_vtab;

    return {
        xCreate: 0,
        xConnect(pDb, pAux, argc, argv, ppVtab, pzErr) {
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
        xBestIndex(pVtab, pIdxInfo) {
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
                    const encoded = JSON.stringify(row);
                    capi.sqlite3_result_text(
                        pCtx,
                        encoded,
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
        xFilter: (pCursor, idxNum, idxCStr, argc, argv) => {
            const args = capi.sqlite3_values_to_js(argc, argv);
            const [resourceType] = args;
            if (typeof resourceType !== "string")
                // basic check, may add enum inclusion check later
                return capi.SQLITE_ERROR;

            const cursor = getCursor(pCursor);
            const { baseUrl } = getVirtualTable(cursor.pVtab);
            // to allow for (1) trailing slash
            let url =
                baseUrl[baseUrl.length - 1] === "/"
                    ? `${baseUrl}${resourceType}`
                    : `${baseUrl}/${resourceType}`;
            let resources: any[] = [];
            const sharedSignal = new SharedArrayBuffer(4 + 4 + 3 * 1024 * 1024);
            while (url !== null && url !== undefined) {
                request({ sharedSignal, url });
                const size = new DataView(sharedSignal, 4, 4).getUint32(
                    0,
                    true,
                );
                const dataBytes = new Uint8Array(sharedSignal, 8, size);
                const payloadSerialized = new TextDecoder().decode(
                    dataBytes.slice(),
                ); // can't read from shared buffer directly, need to slice() to copy
                const bundle: any = JSON.parse(payloadSerialized);
                const extractedResources = bundle.entry.map(
                    ({ resource }) => resource,
                );
                resources.push(...extractedResources);
                url = bundle.link?.find(
                    (link: any) => link.relation === "next",
                )?.url;
            }

            // handle inline fhirpath transformations
            const viewDefinition = generateViewDefinition(args, resources);
            if (viewDefinition) {
                const rows = flat(resources, viewDefinition);
                cursor.rows = rows;
            } else {
                cursor.rows = resources;
            }
            return 0;
        },
    } satisfies sqlite3_module;
};

export default medfetch_module;
