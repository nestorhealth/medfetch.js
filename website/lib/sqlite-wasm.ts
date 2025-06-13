import { sqliteOnFhir } from "../../medfetch/dist/sqlite.browser";
import { Kysely, sql } from "kysely";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const dialect = sqliteOnFhir(":memory:", `${API_URL}/fhir`, [
  "Patient",
  "Procedure",
  "Condition",
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
