import { sqliteOnFhir } from "medfetch/sqlite";
import { useRef } from "react";
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

export const medDB: MedfetchDB = {
  exec: async (sqlString: string) => {
    await sql.raw(sqlString).execute(db);
  },
  prepare: (sqlString: string) => ({
    all: async () => {
      const result = await sql.raw(sqlString).execute(db);
      return result.rows;
    },
    run: async () => {
      await sql.raw(sqlString).execute(db);
    },
  }),
};


export function useMedDB(): MedfetchDB {
  const dbRef = useRef<MedfetchDB>(medDB);
  return dbRef.current;
}


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

// Types
export interface MedfetchDB {
  exec: (sql: string) => Promise<void>;
  prepare: (sql: string) => {
    all: () => Promise<any[]>;
    run: () => Promise<void>;
  };
}

// Define options type for initMedfetchDB
export interface MedfetchDBOptions {
  baseURL?: string;
  trace?: boolean;
  filename?: string;
}

// Initialize Medfetch database
export function getMedfetchDB(): MedfetchDB {
  // Initialize Medfetch with SQLite WASM
  // Create a database handle with common operations
  const __db: MedfetchDB = {
    exec: async (sqlString: string) => {
      await sql.raw(sqlString).execute(db);
    },
    prepare: (sqlString: string) => ({
      all: async () => {
        const result = await sql.raw(sqlString).execute(db);
        return result.rows;
      },
      run: async () => {
        await sql.raw(sqlString).execute(db);
      },
    }),
  };

  return __db;
}

// Example usage:
/*
const client = await initMedfetchDB();
await client.loadFHIRJson("Patient", samplePatientData);
const patients = await client.queryAll("SELECT * FROM Patient;");
*/
