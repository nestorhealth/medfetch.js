import { sqliteWasmOnFhir } from "medfetch/sqlite-wasm";
import { Kysely, sql } from "kysely";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const dialect = sqliteWasmOnFhir(":memory:", `${API_URL}/fhir`, [
  "Patient",
  "Condition",
  "Procedure"
]);

export const db = new Kysely<typeof dialect.$db>({
  dialect,
});

const result = await db.selectFrom("Patient").select([
  "Patient.id", "Patient.name"
]).executeTakeFirstOrThrow();
console.log(result)

/**
 *
 * @param strings
 * @param rest
 * @returns
 */
export function sql2<T>(
  strings: TemplateStringsArray,
  ...rest: any[]
): Promise<T[]> {
  return sql<T>(strings, ...rest)
    .execute(db)
    .then((result) => result.rows);
}
