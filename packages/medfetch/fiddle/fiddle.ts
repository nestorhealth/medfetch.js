import { Kysely } from "kysely";
import { sqliteWasmOnFhir } from "~/sqlite-wasm";

const dialect = sqliteWasmOnFhir(":memory:", "https://r4.smarthealthit.org", [
    "Practitioner"
]);

const db = new Kysely<typeof dialect.$db>({
    dialect
});

const practitioners = await db
    .selectFrom("Practitioner")
    .select("Practitioner.gender")
    .execute();
    
console.log("OK", practitioners)