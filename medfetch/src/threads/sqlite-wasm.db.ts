/// <reference lib="webworker" />
import { loadExtension } from "../sqlite-wasm.worker.js";
import { setSyncFetch, syncFetch } from "./sqlite-wasm.fetch.js";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm"; // external

// Default sqlite3 worker -- connects to the fetch worker 
sqlite3InitModule().then(
  async sqlite3 => {
    const fetchWorker = new Worker(
      new URL(
        import.meta.env.DEV ?
        "./sqlite-wasm.fetch.js" : "./sqlite-wasm.fetch.js",
        import.meta.url
      ),
      {
        type: "module",
        name: "sqlite-wasm.fetch"
      }
    );
    await setSyncFetch(fetchWorker);
    const rc = loadExtension(sqlite3, syncFetch);
    if (rc) {
      console.error("Oops... Error loading in sqlite-wasm extension");
    } else {
      console.log("Loaded medfetch extension!");
    }
  }
)