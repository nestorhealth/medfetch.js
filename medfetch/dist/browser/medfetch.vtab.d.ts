import type { Sqlite3Static } from "@sqlite.org/sqlite-wasm";
export default function Medfetch(sqlite3: Sqlite3Static, loaderAux: string[]): Promise<{
    methods: {
        xCreate: number;
        xConnect(pDb: number, pAux: number, argc: number, argv: number, ppVtab: number, pzErr: number): number;
        xBestIndex(pVtab: number, pIdxInfo: number): 0;
        xDestroy: boolean;
        xDisconnect(pVtab: number): 0;
        xOpen: (pVtab: number, ppCursor: number) => 0;
        xClose: (pCursor: number) => 0;
        xNext: (pCursor: number) => 0;
        xColumn(pCursor: number, pCtx: number, iCol: number): 0;
        xRowid: (pCursor: number, ppRowid64: number) => 0;
        xEof: (pCursor: number) => number;
        xFilter: (pCursor: number, idxNum: number, idxCStr: number, argc: number, argv: number) => 1 | 0;
    };
}>;
