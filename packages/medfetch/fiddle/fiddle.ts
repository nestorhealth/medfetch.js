import { Kysely, sql } from "kysely";
import { sqliteOnFhir } from "~/sqlite.browser";

const dialect = sqliteOnFhir(":memory:", "http://localhost:8787/fhir", [
  "Patient",
  "Condition"
]);

const db = new Kysely<typeof dialect.$db>({
    dialect,
});

// "Show me pediatric patients under 18 years old admitted in the US after 2015 with 
// tibial shaft fractures."
// 

const sanityCheck = await db.selectFrom("Condition").selectAll("Condition").execute();
console.log("OK?", sanityCheck)

const initialQuery = await db
  .selectFrom("Patient")
  .innerJoin("Condition", "Condition.subject", "Patient.id")
  .selectAll("Patient")
  .where("Patient.birthDate", "<", "date('now', '-18 years')")
  .execute();
  
console.log("HERE", initialQuery)