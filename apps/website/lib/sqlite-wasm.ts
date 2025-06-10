import { sqliteWasmOnFhir } from "medfetch/sqlite-wasm";
import { Kysely, sql } from "kysely";

const dialect = sqliteWasmOnFhir(":memory:", "https://r4.smarthealthit.org", [
  "Patient",
  "Practitioner",
  "Procedure",
  "Condition"
]);

export const db = new Kysely<typeof dialect.$db>({
  dialect,
});

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
