import { medfetch } from "medfetch/sqlite-wasm";
import { sql } from "kysely";

const db = medfetch("https://r4.smarthealthit.org");
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
