import type { Condition, Patient } from "fhir/r4";
import {
  sql,
  Kysely,
  DummyDriver,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from "kysely";
import type { Rowify } from "~/sql";

type UserDB = {
  Patient: Rowify<Patient>;
  Condition: Rowify<Condition>;
  patients: {
    patient_id: string;
    age: number;
    onset_year: string;
    icd_code: string;
    first_name: string;
    last_name: string;
  };
};

const db = new Kysely<UserDB>({
  dialect: {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  },
});

const initial = db.schema
  .createTable("patients")
  .ifNotExists()
  .as(
    db
      .selectFrom("Patient")
      .innerJoin("Condition", "Condition.subject", "Patient.id")
      .select([
        "Patient.id as patient_id",
        "Patient.gender",
        sql<string>`strftime('%Y', "Condition"."onsetDateTime")`.as(
          "onset_year",
        ),
        sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'code'`.as(
          "icd_code",
        ),
        sql<string>`"Patient"."name" -> 0 -> 'given' ->> 0`.as("first_name"),
        sql<string>`"Patient"."name" -> 0 ->> 'family'`.as("last_name"),
        sql<number>`
        CAST(
        (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
        - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
        AS INTEGER
      )
        `.as("age"),
      ]),
  );

const initialQuery = initial.compile();

// Show me pediatric patients over 18 years old in the US after 2015 with
// tibial shaft fractures."
const adultPatients = db
  .selectFrom("patients")
  .selectAll("patients")
  .where("patients.age", ">", 18)
  .where("patients.icd_code", "like", "S82.20%")
  .where("patients.onset_year", ">", "2015");

const adultPatientsQuery = adultPatients.compile();


export async function table0(db: Kysely<any>) {
  const rows = await db
    .executeQuery(initialQuery)
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
  const rows = await db.executeQuery(adultPatientsQuery).then((r) => r.rows);
  const columns =
    (await db.introspection.getTables()).find((t) => t.name === "patients")
      ?.columns ?? [];

  return {
    rows,
    columns,
  };
}
