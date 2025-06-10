import { medfetch } from "medfetch/sqlite-wasm";
import { sql as kyselySql } from "kysely";

export const db = medfetch("https://r4.smarthealthit.org");

/**
 * 
 * @param strings 
 * @param rest 
 * @returns 
 */
export function sql<T>(strings: TemplateStringsArray, ...rest: any[]): Promise<T[]> {
  return kyselySql<T>(strings, ...rest).execute(db).then(result => result.rows);
}
