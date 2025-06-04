import { sql } from "kysely";
import { medfetch } from "~/browser";
import { SqliteWasmDialect } from "~/sqlite-wasm/dialect";

const dialect = new SqliteWasmDialect();
const db = medfetch("", {
  dialect
});

await db.schema.createTable("foo").addColumn("id", "text").execute();
await db.insertInto("foo").values({id:"bar"}).returningAll().execute()
const result = await db.selectFrom("foo").selectAll("foo").execute();
console.log("regular: ", result)

const medfetchResult = await sql`select * from medfetch('Patient')`.execute(db);
console.log("medfetch: ", medfetchResult)