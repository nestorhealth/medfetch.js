import { Kysely, sql } from "kysely";
import medfetch from "medfetch/sqlite-wasm";

const apiURL = process.env.NEXT_PUBLIC_API_URL!;
const API_URL = apiURL.endsWith("/")
  ? apiURL.slice(0, apiURL.length - 1)
  : apiURL;

const dbCache = new Map<string, Kysely<any>>();

/**
 * Open an existing sqlite3 datbase file persisted on the browser
 * @param filename The filename of the sqlite3 file without
 * @param vfs The backing browser filesystem - kvfs only works on browser, opfs only works on worker threads
 * @returns The kysely instance
 */
export async function openDB(baseURL: string | File, filename?: string) {
  const cacheKey = `${filename}`;
  if (dbCache.has(cacheKey)) return dbCache.get(cacheKey)!;
  const dialect = medfetch(baseURL, {
    filename: filename
  });

  const db = new Kysely<any>({ dialect });
  dbCache.set(cacheKey, db);
  return db;
}

const dialect = medfetch(`${API_URL}/fhir`);

export const memoryDB = new Kysely<any>({
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
    .execute(memoryDB)
    .then((result) => result.rows);
}

// Define options type for initMedfetchDB
export interface MedfetchDBOptions {
  baseURL?: string;
  trace?: boolean;
  filename?: string;
}

// Example usage:
/*
const client = await initMedfetchDB();
await client.loadFHIRJson("Patient", samplePatientData);
const patients = await client.queryAll("SELECT * FROM Patient;");
*/
