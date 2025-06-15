import { medfetch } from "~/sqlite.sqlite-wasm";
import sqlite3InitModule from "@sqlite.org/sqlite-wasm"
import BlockWorker from "./db.block?worker";
import { ping, syncFetch } from "./db.block";

sqlite3InitModule().then(
  async sqlite3 => {
    await ping(new BlockWorker({ name: "db.block"}));
    medfetch(sqlite3, syncFetch);
  }
);