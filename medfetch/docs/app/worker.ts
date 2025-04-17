import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

sqlite3InitModule().then(
    (sqlite3) => sqlite3.initWorker1API()
);
