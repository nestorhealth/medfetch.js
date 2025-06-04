/* eslint-disable */
import type {
    Sqlite3,
    Sqlite3Module,
    WasmPointer,
} from "@sqlite.org/sqlite-wasm";
import type { VirtualTableExtensionFn } from "./worker1.services";
import {
    ModuleContext,
    Sqlite3WebAssembly,
    TokenFetcher,
} from "./virtual-table.services";
import { _FetchSync } from "~/fetch.services";
import {
    x_best_index,
    x_close,
    x_column,
    x_connect,
    x_disconnect,
    x_eof,
    x_filter,
    x_next,
    x_open,
} from "~/sqlite-wasm/virtual-table.methods";
import { provideService, runSync } from "effect/Effect";

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
 * Based on the original C extension for native, but this time... with actual FHIRPath support !!
 */
const medfetch_module: VirtualTableExtensionFn = (sqlite3, context) => {
    const fetchPort = context.transfer[0];
    if (!fetchPort)
        throw new Error(
            "medfetch: expected Fetch Worker port at ports[0] but got nothing",
        );
    const tokenPort = context.transfer.at(1);
    const tokenFetcher = TokenFetcher.make(tokenPort);

    // Blocking fetch function
    const fetchSync = _FetchSync.make(fetchPort);

    let provideSqlite3 = provideService(Sqlite3WebAssembly, sqlite3);
    let provideModuleContext = provideService(ModuleContext, context);
    let provideFetchSync = provideService(_FetchSync, fetchSync);
    let provideTokenFetcher = provideService(TokenFetcher, tokenFetcher);

    return {
        /* Set to 0 to mark as eponymous (something to do with being able to call as TVF) */
        xCreate: 0,
        xConnect(...args) {
            return x_connect(...args).pipe(
                provideSqlite3,
                provideModuleContext,
                runSync,
            );
        },
        xBestIndex(...args) {
            return x_best_index(...args).pipe(provideSqlite3, runSync);
        },
        xDestroy: true,
        xDisconnect(...args) {
            return x_disconnect(...args).pipe(provideSqlite3, runSync);
        },
        xOpen(...args) {
            return x_open(...args).pipe(provideSqlite3, runSync);
        },
        xClose: (pCursor) => {
            return x_close(pCursor).pipe(provideSqlite3, runSync);
        },
        xNext(...args) {
            return x_next(...args).pipe(provideSqlite3, runSync);
        },
        xColumn(...args) {
            return x_column(...args).pipe(provideSqlite3, runSync);
        },
        xRowid(_pCursor, _ppRowid64) {
            return 0;
        },
        xEof(...args) {
            return x_eof(...args).pipe(
                provideSqlite3,
                provideFetchSync,
                provideTokenFetcher,
                runSync
            )
        },
        xFilter(...args) {
            return x_filter(...args).pipe(
                provideTokenFetcher,
                provideFetchSync,
                provideSqlite3,
                runSync
            );
        },
    } satisfies Sqlite3Module;
};

export default medfetch_module;
