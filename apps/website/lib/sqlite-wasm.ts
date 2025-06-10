import { sqliteWasmOnFhir } from "medfetch/sqlite-wasm";
import { Kysely, sql } from "kysely";

const dialect = sqliteWasmOnFhir(":memory:", "https://r4.smarthealthit.org", [
  "Patient",
  "Practitioner"
])
const db = new Kysely<typeof dialect.$db>({
  dialect
});
const patient = await db
    .selectFrom("Patient")
    .select([
        "Patient.id",
        "Patient.name",
        "Patient.birthDate",
        "Patient.gender",
        sql<null>`NULL`.as("condition"),
        sql<null>`NULL`.as("status")
    ])
    .executeTakeFirst();
    
console.log("IM HERE", patient)

/**
 * 
 * @param strings 
 * @param rest 
 * @returns 
 */
export function sql2<T>(strings: TemplateStringsArray, ...rest: any[]): Promise<T[]> {
  return sql<T>(strings, ...rest).execute(db).then(result => result.rows);
}
