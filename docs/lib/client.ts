import { medfetch } from "../../medfetch/src/sqlite-wasm";

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

// Constants
const DEFAULT_FHIR_SERVER = "https://r4.smarthealthit.org";

// Initialize Medfetch database
export async function initMedfetchDB(options: MedfetchDBOptions = {}): Promise<MedfetchClient> {
  const { baseURL = DEFAULT_FHIR_SERVER, trace = true, filename } = options;
  
  // Initialize Medfetch with SQLite WASM
  const sql = medfetch(baseURL, { trace, filename });
  
  // Create a database handle with common operations
  const db: MedfetchDB = {
    exec: async (sqlString: string) => {
      await sql`${sqlString}`;
    },
    prepare: (sqlString: string) => ({
      all: async () => await sql`${sqlString}`,
      run: async () => {
        await sql`${sqlString}`;
      }
    })
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
    queryAll
  };
}

// Example usage:
/*
const client = await initMedfetchDB();
await client.loadFHIRJson("Patient", samplePatientData);
const patients = await client.queryAll("SELECT * FROM Patient;");
*/ 