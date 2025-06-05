import { sql } from "kysely";
import { medfetch } from "~/sqlite-wasm/index";

const db = medfetch("https://r4.smarthealthit.org");

await db.schema.createTable("foo").addColumn("id", "text").execute();
await db.insertInto("foo").values({id:"bar"}).returningAll().execute()
const result = await db.selectFrom("foo").selectAll("foo").execute();
console.log("regular: ", result)

const medfetchResult = await sql`select * from medfetch('Patient')`.execute(db);
console.log("medfetch raw sql: ", medfetchResult)

const qbResult = await db.selectFrom("medfetch").where("type", "=", "Patient").selectAll("medfetch").execute();
console.log("HERE", qbResult);