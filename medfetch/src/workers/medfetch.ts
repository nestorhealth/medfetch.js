import type { WasmPointer, Sqlite3Static } from "@sqlite.org/sqlite-wasm";
import { Context, Effect } from "effect";
import { unionKeys } from "../data";

/* marks the loaded wasm module as a dependency */
class Sqlite3 extends Context.Tag("Sqlite3")<
    Sqlite3,
    Sqlite3Static
>() {};

class FetchMessagePort extends Context.Tag("FetchMessagePort")<
    FetchMessagePort,
    MessagePort
>() {};

type XCreate = (pDb: WasmPointer, pAux: WasmPointer,
                      argc: number, argv: WasmPointer, 
                      ppVtab: WasmPointer, pzErr: WasmPointer) => number;
type XConnect = XCreate | boolean;
type XDestroy = (pVtab: WasmPointer) => number;
type XDisconnect = XDestroy | boolean;
type XOpen = (pVtab: WasmPointer, ppCursor: WasmPointer) => number;
type XClose = (pCursor: WasmPointer) => number;
type XNext = (pCursor: WasmPointer) => number;
type XColumn = (pCursor: WasmPointer, pCtx: WasmPointer, iCol: WasmPointer) => number;
type XRowid = (pCursor: WasmPointer, ppRowid64: WasmPointer) => number;
type XEof = (pCursor: WasmPointer) => boolean;
type XFilter = (pCursor: WasmPointer, iNum: number, iCStr: number, argc: number, argv: WasmPointer) => number;
type XBestIndex = (pVtab: WasmPointer, pIdxInfo: WasmPointer) => number;

interface Vtab {
    methods: {
        xCreate: XCreate;
        xConnect: XConnect;
        xDestroy: XDestroy;
        xDisconnect: XDisconnect;
        xOpen: XOpen;
        xClose: XClose;
        xNext: XNext;
        xColumn: XColumn;
        xRowid: XRowid;
        xEof: XEof;
        xFilter: XFilter;
        xBestIndex: XBestIndex;
    }
};

const Medfetch = Effect.gen(function* () {
    const fetcher = yield* FetchMessagePort;
    const { wasm, capi, vtab } = yield* Sqlite3;

    return {
        methods: {
            xCreate: (pDb, pAux, argc, argv, ppVtab, pzErr) => {
                const args = wasm.cArgvToJs(argc, argv);
                if (!args || !args.every((arg) => arg !== null) || args.length < 3) {
                    throw new Error("medfetch: bad arguments");
                }

                let columnNames: string[] = [];
                let resourceType: string = "";
                const tblName = args[2];
                if (argc === 3) {
                    resourceType = tblName;
                } 

                const buffer = new SharedArrayBuffer(4 + 3 * 1024 * 1024);
                const signal = new Int32Array(buffer, 0, 1);
                signal[0] = 0;

                fetcher.postMessage({
                    signalBuffer: buffer,
                    resourceType,
                });
                Atomics.wait(signal, 0, 0);

                const dataBytes = new Uint8Array(buffer, 4);
                // todo: write the size into the buffer to avoid linear scan for '\0'
                const endIdx = dataBytes.indexOf(0);
                if (endIdx === -1) {
                    throw new Error("No null terminator written from the fetch thread...");
                }
                const jsonStr = new TextDecoder().decode(dataBytes.slice(0, endIdx));
                const resources = JSON.parse(jsonStr);
                columnNames = unionKeys(resources).values().toArray();

                const columnDeclaration = columnNames
                    .reduce((acc, columnName, index, self) => index === self.length - 1 ? acc += columnName : acc += columnName + ",", "");

                const rc = capi.sqlite3_declare_vtab(pDb, `CREATE TABLE x(${columnDeclaration})`);
                if (rc === 0) {
                    const p = vtab.xVtab.create(ppVtab);
                    p.resources = resources;
                    p.columns = columnNames;
                }

                return rc;
            },
            xConnect: true,
            xDestroy: (pVtab) => {
                vtab.xVtab.dispose(pVtab);
                return 0;
            },
            xDisconnect: true,
            xOpen: (pVtab, ppCursor) => {
                const vTab = vtab.xVtab.get(pVtab);
                const cursor = vtab.xCursor.create(ppCursor);
                cursor.index = 0;
                cursor.rows = vTab.resources;
                cursor.columns = vTab.columns;
                return 0;
            },
            xClose: (pCursor) => {
                const c = vtab.xCursor.unget(pCursor);
                c.dispose();
                return 0;
            },
            xNext: (pCursor) => {
                vtab.xCursor.get(pCursor).index++;
                return 0;
            },
            xColumn: (pCursor, pCtx, iCol) => {
                const cursor = vtab.xCursor.get(pCursor);
                const row = cursor.rows[cursor.index];
                capi.sqlite3_result_text(pCtx, row[cursor.columns[iCol]], -1, capi.SQLITE_TRANSIENT);
                return 0;
            },
            xRowid: (pCursor, ppRowid64) => {
                const c = vtab.xCursor.get(pCursor);
                vtab.xRowid(ppRowid64, c._rowId);
            },
            xEof: (pCursor) => {
                const cursor = vtab.xCursor.get(pCursor);
                return cursor.index >= cursor.rows.length;
            },
            xFilter: (pCursor, idxNum, idxCStr,
                      argc, argv) => {
                const cursor = vtab.xCursor.get(pCursor);
                cursor.index = 0;
                return 0;
            },
            xBestIndex: (pVtab, pIdxInfo) => {
                const pii = vtab.xIndexInfo(pIdxInfo);
                pii.dispose();
                return 0;
            }
        }
    } satisfies Vtab;
});

export function medfetchModule(sqlite3: Sqlite3Static, fetchMessagePort: MessagePort) {
    return Medfetch.pipe(
        Effect.provideService(Sqlite3, sqlite3),
        Effect.provideService(FetchMessagePort, fetchMessagePort)
    );
}
