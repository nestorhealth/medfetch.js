import { promiserV2 } from "~/sqlite-wasm/main";
import MyWorker from "./sqlite?worker";
import { medfetch } from "~/browser";
import { SqliteWasmDialect } from "~/sqlite-wasm/sqlite-wasm.dialect";

const worker = new MyWorker();
const promiser = promiserV2(worker);

const dialect = new SqliteWasmDialect(promiser);
const db = medfetch("", {
  dialect
});

await db.schema.createTable("foo").addColumn("id", "text").execute();
const result = await db.insertInto("foo").values({id:"bar"}).returningAll().execute()
console.log("HERE", result)