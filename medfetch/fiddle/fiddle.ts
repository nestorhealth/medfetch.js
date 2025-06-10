import { medfetch } from "~/sqlite-wasm";

const db = medfetch("https://r4.smarthealthit.org", [
    "Patient",
    "Practitioner",
    "Procedure"
]);

const result = await db
    .selectFrom("Practitioner")
    .selectAll("Practitioner")
    .execute();

console.log('db result', JSON.stringify(result[0], null, 2))