import { medfetch } from "~/sqlite-wasm";

const db = medfetch("https://r4.smarthealthit.org", {
    resources: ["Practitioner"],
});

const result = await db
    .selectFrom("Practitioner")
    .selectAll("Practitioner")
    .execute();

console.log(JSON.stringify(result[0], null, 2))