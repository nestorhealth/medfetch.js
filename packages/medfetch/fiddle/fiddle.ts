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

const init = await db
  .selectFrom("Patient")
  .innerJoin("Condition", "Condition.subject", "Patient.id")
  .selectAll("Patient")
  .where("Patient.birthDate", ">=", sql<string>`date('now', '-18 years')`)
  .where((eb) =>
    eb.or([
      eb("Patient.address", "like", sql<string>`'%United States%'`),
      eb("Patient.address", "like", sql<string>`'%USA%'`),
    ])
  )
  .where("Condition.recordedDate", ">=", "2015-01-01")
  .where((eb) =>
    eb.or([
      eb(sql<string>`Condition.code -> 'coding' -> 0 ->> code`, "like", "%S82.20%"),
    ])
  )
  .execute();