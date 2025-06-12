import { Kysely, sql } from "kysely";
import { sqliteOnFhir } from "medfetch/sqlite";

const BASE_URL = "https://r4.smarthealthit.org"

const dialect = sqliteOnFhir(":memory:", BASE_URL, [
  "Patient",
  "Condition"
])

const db = new Kysely<typeof dialect.$db>({ dialect });

const conditionCode = sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'code'`;
const hasTibiaFracture = () => sql<any>`${conditionCode} = 'S82.209'`;
const patient = await db.selectFrom("Patient")
  .innerJoin("Condition", "Condition.subject", "Patient.id")
  .select([
    "Patient.id as patient_id",
    "Patient.name as patient_name",
    "Condition.onsetAge as onset_age"
  ])
  .where(hasTibiaFracture)
  .executeTakeFirstOrThrow();
  
console.log(`Hello ${patient.patient_name}!`);
