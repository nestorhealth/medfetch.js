import { sql } from "kysely";
import { pages } from "~/data";
import { medfetch } from "~/sqlite-wasm";

const response = await pages("http://localhost:8787/fhir", "Patient").next();
console.log("GOT", response.value);
const asText = JSON.stringify(response.value);
const asFile = new File([asText], "bundle.json");

const db = medfetch(asFile);

await db.schema.createTable("foo").addColumn("id", "text").execute();
await db.insertInto("foo").values({id:"bar"}).returningAll().execute()
const result = await db.selectFrom("foo").selectAll("foo").execute();
console.log("regular: ", result)

const medfetchResult = await sql`select * from medfetch('Patient')`.execute(db);
console.log("medfetch raw sql: ", medfetchResult)

// BUG - File can't be read again
const qbResult = await db.selectFrom("medfetch").where("type", "=", "Patient").selectAll("medfetch").execute();
console.log("HERE", qbResult);