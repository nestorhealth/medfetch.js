import { worker1 } from "~/sqlite-wasm/worker1/worker1.worker";
import initSqlite3 from "@sqlite.org/sqlite-wasm";

const sqlite3 = await initSqlite3();

worker1(sqlite3);