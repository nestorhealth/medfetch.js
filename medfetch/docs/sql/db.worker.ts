import { loadExtension } from "~/sqlite-wasm";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm"
import BlockWorker from "./db.block?worker";
import { setSyncFetch, syncFetch } from "./db.block";

sqlite3InitModule().then(
  async sqlite3 => {
    await setSyncFetch(new BlockWorker({ name: "db.block"}));
    loadExtension(sqlite3, {
      fetch: syncFetch
    });
  }
);