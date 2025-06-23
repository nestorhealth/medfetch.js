/// <reference lib="webworker" />
import { loadExtension } from "../sqlite-wasm.js";
import { ping, syncFetch } from "./sqlite-wasm.block.js";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

// The default web worker that handles loading the wasm web worker if user
// doesn't provide one
sqlite3InitModule().then(
  async sqlite3 => {
    const blockFetchWorker = new Worker(
      new URL(
        import.meta.env.DEV ?
        "./sqlite-wasm.block.js" : "./sqlite-wasm.block.js",
        import.meta.url
      ),
      {
        type: "module",
        name: "sqlite-wasm.block"
      }
    );
    await ping(blockFetchWorker);
    const rc = loadExtension(sqlite3, {
      fetch: syncFetch
    });
    if (rc) {
      console.error("oops")
    } else {
      console.log("success!")
    }
  }
)