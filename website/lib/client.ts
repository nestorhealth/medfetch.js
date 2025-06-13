import { Kysely, sql } from "kysely";
import { sqliteOnFhir } from "medfetch/sqlite"

// Types
export interface MedfetchDB {
  exec: (sql: string) => Promise<void>;
  prepare: (sql: string) => {
    all: () => Promise<any[]>;
    run: () => Promise<void>;
  };
}

export interface MedfetchClient {
  db: MedfetchDB;
  loadFHIRJson: (resourceName: string, json: any[]) => Promise<void>;
  runSQL: (sql: string) => Promise<any[]>;
  queryAll: (sql: string) => Promise<any[]>;
}

// Define options type for initMedfetchDB
export interface MedfetchDBOptions {
  baseURL?: string;
  trace?: boolean;
  filename?: string;
}

// Initialize Medfetch database
export async function initMedfetchDB(): Promise<MedfetchClient> {
  // Initialize Medfetch with SQLite WASM
  const dialect = sqliteOnFhir(":memory:", `${process.env.NEXT_PUBLIC_API_URL!}/fhir`, [
    "Condition",
    "Patient"
  ]);
  const _db = new Kysely<typeof dialect.$db>({ dialect });
  
  const result = await _db.selectFrom("Condition")
    .selectAll("Condition")
    .executeTakeFirst();
  console.log("got", result)

  // Create a database handle with common operations
  const db: MedfetchDB = {
    exec: async (sqlString: string) => {
      await sql.raw(sqlString).execute(_db);
    },
    prepare: (sqlString: string) => ({
      all: async () => {
        const result = await sql.raw(sqlString).execute(_db);
        return result.rows;
      },
      run: async () => {
        await sql.raw(sqlString).execute(_db);
      },
    }),
  };

  // Helper to load FHIR JSON into a virtual table
  const loadFHIRJson = async (resourceName: string, json: any[]) => {
    // First, ensure the table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS ${resourceName} (
        id TEXT PRIMARY KEY,
        json TEXT,
        type TEXT HIDDEN,
        fp TEXT HIDDEN
      );
    `);

    // Then insert the JSON data
    for (const resource of json) {
      await db.exec(`
        INSERT OR REPLACE INTO ${resourceName} (id, json, type)
        VALUES (
          '${resource.id}',
          '${JSON.stringify(resource)}',
          '${resource.resourceType}'
        );
      `);
    }
  };

  // Helper to run SQL and return results
  const runSQL = async (sqlString: string): Promise<any[]> => {
    return await db.prepare(sqlString).all();
  };

  // Helper to query all rows from a table
  const queryAll = async (sqlString: string): Promise<any[]> => {
    return await db.prepare(sqlString).all();
  };

  // Return the client interface
  return {
    db,
    loadFHIRJson,
    runSQL,
    queryAll,
  };
}

// Example usage:
/*
const client = await initMedfetchDB();
await client.loadFHIRJson("Patient", samplePatientData);
const patients = await client.queryAll("SELECT * FROM Patient;");
*/
