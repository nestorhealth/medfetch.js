/// <reference lib="webworker" />
import loadExtension from "../sqlite-wasm.loadExtension.js";
import { setSyncFetch, syncFetch } from "./sqlite-wasm.fetch.js";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm"; // external

/// Default sqlite3 worker -- handles loading extension mostly, hence the tag
sqlite3InitModule().then(async (sqlite3) => {
    console.time("[medfetch/sqlite-wasm.db] >> loaded medfetch extension in")
    console.log(`[medfetch/sqlite-wasm.db] >> loading...`)
    const fetchWorker = new Worker(
        new URL(
            import.meta.env.DEV
                ? "./sqlite-wasm.fetch.js"
                : "./sqlite-wasm.fetch.js",
            import.meta.url,
        ),
        {
            type: "module",
            name: "sqlite-wasm.fetch",
        },
    );
    await setSyncFetch(fetchWorker);
    const rc = loadExtension(sqlite3, syncFetch);
    if (rc) {
        console.error(
            "[medfetch/sqlite-wasm.db] >> unknown error loading in sqlite-wasm extension",
        );
    } else {
        console.log(
            `[medfetch/sqlite-wasm.db] >> extension loaded!`,
        );
    }
    console.timeEnd("[medfetch/sqlite-wasm.db] >> loaded medfetch extension in")
});
