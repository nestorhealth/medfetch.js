<script lang="ts">
import { sql, Kysely } from "kysely";
import { dummyDialect, type SqlOnFhirDB } from "~/sql";

const db = new Kysely<any>({
  dialect: dummyDialect("sqlite")
});
const fp: Kysely<SqlOnFhirDB> = db as any;

const initial = fp
  .selectFrom("Patient")
  .innerJoin("Condition", "Condition.subject", "Patient.id")
  .select([
    "Patient.id as patient_id",
    sql<string>`strftime('%Y', "Condition"."onsetDateTime")`.as("onset_year"),
    sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'code'`.as("icd_code"),
    sql<string>`"Patient"."name" -> 0 -> 'given' ->> 0`.as("first_name"),
    sql<string>`"Patient"."name" -> 0 ->> 'family'`.as("last_name"),
    sql<number>`
    CAST(
    (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
    - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
    AS INTEGER
  )
    `.as("age"),
  ]);
export const initialQuery = initial.compile();
  
const pediatricPatients = db
  .selectFrom("patients")
  .selectAll("patients")
  .where("patients.age", "<", 18);
  
export const pediatricPatientQuery = pediatricPatients.compile();

export async function table0(db: Kysely<any>) {
  const rows = await db.schema
    .createTable("patients")
    .as(initial)
    .execute()
    .then(() => db.selectFrom("patients").selectAll("patients").execute());
  const columns =
    (await db.introspection.getTables()).find((t) => t.name === "patients")
      ?.columns ?? [];

  return {
    rows,
    columns,
  };
}

export async function table1(db: Kysely<any>) {
  const rows = await db.executeQuery(pediatricPatientQuery).then(r => r.rows)
  console.log("no rows?", rows)
  const columns =
    (await db.introspection.getTables()).find((t) => t.name === "patients")
      ?.columns ?? [];

  return {
    rows,
    columns,
  };
}
</script>
