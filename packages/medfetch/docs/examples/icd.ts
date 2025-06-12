import { InferResult, Kysely, sql } from "kysely";
import { set } from "~/sql";
import { sqliteOnFhir } from "~/sqlite.browser";

const dialect = sqliteOnFhir(":memory:", "http://localhost:8787/fhir", [
    "Patient",
    "Condition",
]);

const db = new Kysely<typeof dialect.$db>({
    dialect,
});

const conditionCode = sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'code'`;

// "Show me pediatric patients under 18 years old admitted in the US after 2015 with
// tibial shaft fractures."

const sanityCheck = await db
    .selectFrom("Condition")
    .selectAll("Condition")
    .execute();
console.log("Sanity Check results:", sanityCheck);

const initialQuery = db
    .selectFrom("Patient")
    .innerJoin("Condition", "Condition.subject", "Patient.id")
    .select([
        "Patient.id as patient_id",
        "Patient.gender as gender",
        conditionCode.as("fracture_code"),
        sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'display'`.as(
            "fracture_text",
        ),
        sql<number>`
    CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', "Patient"."birthDate") AS INTEGER)
    `.as("age"),
        sql<string>`CASE Patient.active WHEN 1 THEN 'true' ELSE 'false' END`.as(
            "active",
        ),
        sql<number>`CAST(strftime('%Y', "Condition"."onsetDateTime") AS INTEGER)`.as(
            "onset_year",
        ),
    ])
    .where("Patient.birthDate", "<", sql<string>`date('now', '-18 years')`) // Under 18
    .where(
        sql<number>`CAST(strftime('%Y', "Condition"."onsetDateTime") AS INTEGER)`,
        ">",
        2015,
    ) // After 2015
    .where(() => sql`${conditionCode} LIKE 'S82%' COLLATE NOCASE`);

type Changes = {
    patients: InferResult<typeof initialQuery>;
};

db.schema.createTable("patients").ifNotExists().as(initialQuery).execute();

const db2 = set<typeof dialect.$db & Changes>(db);

export const patients = () => db2
    .selectFrom("patients")
    .selectAll("patients")
    .execute();
