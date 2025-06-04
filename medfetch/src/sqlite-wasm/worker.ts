/// <reference lib="webworker" />
// This is the default database worker script for medfetch/sqlite-wasm
import { worker1 } from "~/sqlite-wasm/worker1";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import { virtualTable } from "~/sqlite-wasm/vtab";
import { _FetchSync, FetchSync } from "~/workers/fetch.services";

// For logs
const tag = "medfetch/sqlite-wasm::worker";

// The sqlite3 wasm module
const sqlite3 = await sqlite3InitModule();

// For fetch worker
const fetchSync = await FetchSync();

// Medfetch sqlite3 virtual table module
const extension = virtualTable(
    {
        aux: {
            baseURL: "https://r4.smarthealthit.org",
        },
        transfer: [],
    },
    sqlite3,
    fetchSync
);

const moduleSet = new Set<number>();

const rc = worker1(sqlite3, (msg, next) => {
    if (msg.data.type === "exec") {
        const ptr = pointer(msg.data.dbId!);
        if (!moduleSet.has(ptr)) {
            sqlite3.capi.sqlite3_create_module(
                ptr,
                "medfetch",
                extension.pointer!,
                0,
            );
            moduleSet.add(ptr);
        }
    }
    next();
});

if (rc) {
    console.error(`[${tag}] > Fatal error loading sqlite-wasm binary.`);
} else {
    console.log(`[${tag}] > sqlite-wasm binary loaded!`);
}

function pointer(internalDbId: string): number {
    const split = internalDbId.split("@");
    return Number(split[split.length - 1]);
}
