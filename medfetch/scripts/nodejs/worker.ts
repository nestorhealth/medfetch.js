import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { loadExtension } from "../../src/sqlite-wasm.node.js";
import block from "../../src/block-promise/block.node.js";
import { isMainThread } from "node:worker_threads";

export const [syncFetch, setSyncFetch] = block(
    ["db"],
    (...args: Parameters<typeof fetch>) =>
        fetch(...args).then((res) => res.text()),
);

if (!isMainThread) {
    sqlite3InitModule().then((sqlite3) => {
        console.log("here!", sqlite3);
        loadExtension(sqlite3, {
            fetch: syncFetch,
        });
    });
}
