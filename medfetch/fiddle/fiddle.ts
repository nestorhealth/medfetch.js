import { sql } from "kysely";
import { medfetch } from "~/sqlite-wasm";

const db = medfetch("https://r4.smarthealthit.org");
const result = await sql`select * from medfetch('Patient')`.execute(db);
console.log("UH", result)