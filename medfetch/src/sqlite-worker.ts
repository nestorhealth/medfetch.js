import sqliteOnWasm, { type WasmPointer } from "@sqlite.org/sqlite-wasm";
import { isResourceType, View } from "./schema";
import { getViewDefinitionQuery, queryToViewDefinition } from "./parse.js";
import { unionKeys } from "./data";
import { project, rows } from "./sof";

const BASE_URL = "https://r4.smarthealthit.org";

const fetchCache = new Map<string, any[]>();

let fetcher;
let db;

self.onmessage = async (event: MessageEvent) => {
    if (event.data.type === "init") {
        fetcher = event.data.fetcherPort;
        fetcher.onmessage = (msg: MessageEvent) => {
            const { resources, tblName } = msg.data;
            fetchCache.set(tblName, resources);
        }

        const { wasm, capi, oo1, vtab } = await sqliteOnWasm();

        db = new oo1.DB();
        if (db.pointer === undefined) {
            throw new Error("sqlite db was not properly initialized!");
        }

        const medfetchModule = vtab.setupModule({
            name: "medfetch",
            methods: {
                xCreate: (pDb: WasmPointer, pAux: WasmPointer, argc: number, argv: WasmPointer, ppVtab: WasmPointer, pzErr: WasmPointer) => {
                    const args = wasm.cArgvToJs(argc, argv);
                    if (!args || !args.every((arg) => arg !== null) || args.length < 3) {
                        throw new Error("medfetch: bad arguments");
                    }
                    if (argc === 3 && !isResourceType(args[2])) {
                        throw new Error(`medfetch: can only be invoked with argc = 0 when the table name (argv[2]) is a ResourceType`);
                    }

                    let viewDefinition: View.ViewDefinition | null = null;
                    let columnNames: string[] = [];
                    let resourceType: string = "";

                    const tblName = args[2];
                    if (argc === 3) {
                        resourceType = tblName;
                    } else {
                        const query = getViewDefinitionQuery(args);
                        if (!query) {
                            throw new Error(`Unable to get a valid view definition query from the args`);
                        }
                        viewDefinition = queryToViewDefinition(args[2], query);
                        resourceType = viewDefinition.resource;
                        columnNames = View.getColumns(viewDefinition).map(col => col.name);
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
                    let resources = JSON.parse(jsonStr);

                    // if no view def query is passed then the columns is just union of json props
                    if (argc === 3) {
                        columnNames = unionKeys(resources).values().toArray();
                    } else if (viewDefinition !== null) {
                        resources = rows(viewDefinition, resources);
                        console.log("got resources", resources);
                    }

                    const columnDeclaration = columnNames
                        .reduce((acc, columnName, index, self) => index === self.length - 1 ? acc += columnName : acc += columnName + ",", "");

                    const rc = capi.sqlite3_declare_vtab(db.pointer!, `CREATE TABLE x(${columnDeclaration})`);
                    if (rc === 0) {
                        const p = vtab.xVtab.create(ppVtab);
                        p.resources = resources;
                        p.columns = columnNames;
                    }

                    return rc;
                },
                xConnect: true,
                xDestroy: (pVtab: WasmPointer) => {
                    vtab.xVtab.dispose(pVtab);
                },
                xDisconnect: true,
                xOpen: (pVtab: WasmPointer, ppCursor: WasmPointer) => {
                    const vTab = vtab.xVtab.get(pVtab);
                    const cursor = vtab.xCursor.create(ppCursor);
                    cursor.index = 0;
                    cursor.rows = vTab.resources;
                    cursor.columns = vTab.columns;
                },
                xClose: (pCursor: WasmPointer) => {
                    const c = vtab.xCursor.unget(pCursor);
                    c.dispose();
                },
                xNext: (pCursor: WasmPointer) => {
                    vtab.xCursor.get(pCursor).index++;
                    return 0;
                },
                xColumn: (pCursor: WasmPointer, pCtx: WasmPointer, iCol: WasmPointer) => {
                    const cursor = vtab.xCursor.get(pCursor);
                    const row = cursor.rows[cursor.index];
                    capi.sqlite3_result_text(pCtx, row[cursor.columns[iCol]], -1, capi.SQLITE_TRANSIENT);
                    return 0;
                },
                xRowid: (pCursor: WasmPointer, ppRowid64: WasmPointer) => {
                    const c = vtab.xCursor.get(pCursor);
                    vtab.xRowid(ppRowid64, c._rowId);
                },
                xEof: (pCursor: WasmPointer) => {
                    const cursor = vtab.xCursor.get(pCursor);
                    return cursor.index >= cursor.rows.length;
                },
                xFilter: (pCursor: WasmPointer, idxNum: number, idxCStr: number,
                                argc: number, argv: WasmPointer) => {
                    const cursor = vtab.xCursor.get(pCursor);
                    cursor.index = 0;
                    return 0;
                },
                xBestIndex: function(pVtab: WasmPointer, pIdxInfo: WasmPointer){
                    const pii = vtab.xIndexInfo(pIdxInfo);
                    pii.dispose();
                }
            }
        });
        db.checkRc(capi.sqlite3_create_module(db.pointer, "medfetch", medfetchModule.pointer, 0));
    }

    if (event.data.type === "query") {
        const { sql } = event.data;
        try {
            const stmt = db.prepare(sql);
            const results = [];
            while (stmt.step()) {
                results.push(stmt.get({}));
            }

            self.postMessage({ type: "result", results });
        } catch (error) {
            self.postMessage({ type: "error", error: error.message });
        }
    }
}
