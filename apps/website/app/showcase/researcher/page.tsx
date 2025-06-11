"use client";
import React, { useState, useRef, useCallback } from "react";
import { type MedfetchClient } from "@/lib/client";
import ChatUI from "@/components/ChatUI";
import AgGridDataTable from "@/components/AgGridDataTable";
import { db } from "@/lib/sqlite-wasm";
import { Kysely, sql } from "kysely";
import { useQuery } from "@tanstack/react-query";

interface PatientView {
  patient_id: string;
  given_name: string | null;
  family_name: string | null;
  birthDate: string | null;
  gender: string | null;
  condition: string | null;
  status: string | null;
}

async function initialTableState() {
  await db.schema
    .createTable("conditions")
    .ifNotExists()
    .as(
      db
        .selectFrom("Condition")
        .select([
          "Condition.id as id",
          "Condition.subject as subject",
          sql`Condition.code ->> 'display'`.as("display"),
        ]),
    )
    .execute();

  await db.schema
    .createTable("patients")
    .ifNotExists()
    .as(
      db
        .selectFrom("Patient")
        .select([
          "Patient.id as id",
          sql<string | null>`Patient.name -> 0 -> 'given' ->> 0`.as(
            "given_name",
          ),
          sql<string | null>`Patient.name -> 0 ->> 'family'`.as("family_name"),
          "Patient.birthDate as birth_date",
          "Patient.gender as gender",
          sql<string | null>`NULL`.as("condition"),
          sql<string | null>`NULL`.as("status"),
        ]),
    )
    .execute();

  await db.schema
    .createTable("procedures")
    .ifNotExists()
    .as(
      db
        .selectFrom("Procedure")
        .select(["id as procedure_id", "subject as patient_id", "code"]),
    )
    .execute();

  db.schema
    .createTable("patient_view")
    .ifNotExists()
    .as(
      (db as Kysely<any>)
        .selectFrom("patients")
        .select([
          "patients.id as patient_id",
          "conditions.display as condition",
        ])
        .innerJoin("conditions", "conditions.subject", "patients.id"),
    )
    .execute();

  const patientView = await (db as Kysely<any>)
    .selectFrom("patient_view")
    .selectAll("patient_view")
    .execute();
    
  const schema = await db.introspection.getTables()
  const patientViewTable = schema.find(
    (tbl) => tbl.name === "patient_view"
  );
  console.log("GOT", patientViewTable)
  return patientView;
}

async function syncPatientView() {
  await initialTableState();
  const patientView =
    await sql<PatientView>`select * from patient_view`.execute(db);
  console.log("received", patientView);
  return patientView.rows;
}

export default function ResearcherPage() {
  const { data, error: syncQueryError } = useQuery({
    queryKey: ["researcher-demo"],
    queryFn: async () => {
      const result = await syncPatientView();
      return result;
    },
  });
  const dbRef = useRef<MedfetchClient | null>(null);
  const [currentResource, setCurrentResource] = useState<
    "Patient" | "Procedure"
  >("Patient");
  const [rawData, setRawData] = useState<any[]>(data ?? ["asdf"]);
  const [error, setError] = useState<string | null>(
    syncQueryError?.message ?? null,
  );

  // Initialize database and load initial data
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       if (dbRef.current) return; // Skip if already initialized

  //       // Initialize with a persisted database file
  //       const medDb = await initMedfetchDB({
  //         baseURL: "https://r4.smarthealthit.org",
  //         filename: 'medfetch.db',
  //         trace: true
  //       } as { baseURL?: string; trace?: boolean; filename?: string });
  //       dbRef.current = medDb;
  //       tableManager.current = new TableManager(medDb);

  //       // Create tables if they don't exist
  //       await medDb.db.exec(`
  //         drop table if exists Patient;
  //         create table if not exists Patient as select
  //             id as patient_id,
  //             json -> 'name' -> 0 -> 'given' ->> 0 as givenName,
  //             json -> 'name' -> 0 ->> 'family' as familyName,
  //             json ->> 'birthDate' as birthDate,
  //             json ->> 'gender' as gender,
  //             NULL as condition,
  //             NULL as status
  //         from medfetch where "type" = 'Patient';
  //       `);

  //       await medDb.db.exec(`
  //         CREATE TABLE IF NOT EXISTS Procedure (
  //           procedure_id TEXT PRIMARY KEY,
  //           patient_id TEXT,
  //           code TEXT,
  //           performedDate TEXT,
  //           notes TEXT,
  //           FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
  //         );
  //       `);

  //       // Only insert dummy data if the Patient table is empty
  //       const patientCount = await medDb.db.prepare('SELECT COUNT(*) as count FROM Patient;').all();
  //       console.log('Patient count:', await medDb.db.prepare(`SELECT * FROM medfetch where "type" = 'Patient';`).all());
  //       if (patientCount[0].count === 0) {
  //         await medDb.db.exec(`
  //           INSERT INTO Patient (patient_id, givenName, familyName, birthDate, gender, condition, status)
  //           VALUES ('p1', 'John', 'Doe', '1970-01-01', 'male', 'None', 'Active');
  //         `);
  //       }

  //       // Determine primary key for the resource
  //       const schema = await tableManager.current.getTableSchema(currentResource);
  //       const pkCol = schema.find((col: ColumnDefinition) => col.primaryKey)?.name || "patient_id";
  //       setPrimaryKey(pkCol);
  //       const rows = await medDb.db.prepare(`SELECT * FROM ${currentResource};`).all();
  //       setRawData(rows);
  //       setIsLoading(false);
  //     } catch (err) {
  //       setError("Failed to initialize Medfetch DB: " + (err as Error).message);
  //       setIsLoading(false);
  //     }
  //   })();
  // }, [currentResource]);

  const handleCellEdit = async (rowId: any, col: string, newValue: any) => {
    if (!dbRef.current) return;
    try {
      setError(null);
      const result = await db.transaction().execute(async (trx) => {
        const tx = trx as Kysely<any>;
        await tx
          .updateTable("patient_view")
          .set(col, newValue)
          .where("patient_id", "=", rowId)
          .execute();
        return await tx
          .selectFrom("patient_view")
          .selectAll("patient_view")
          .execute();
      });
      setRawData(result);
    } catch (err) {
      setError("Edit failed: " + (err as Error).message);
    }
  };

  // Handle SQL query execution from chat
  const handleQuery = useCallback(
    async (rawSqlText: string): Promise<void> => {
      if (!dbRef.current) return;

      try {
        setError(null);

        // Split multiple SQL statements if present
        const statements = rawSqlText.split(";").filter((stmt) => stmt.trim());
        const isSelect = statements[0]
          .trim()
          .toLowerCase()
          .startsWith("select");

        // Extract sort information from the first SELECT statement if it exists
        let sortClause = "";
        if (isSelect) {
          const orderByMatch = statements[0].match(/ORDER\s+BY\s+([^;]+)/i);
          if (orderByMatch) {
            sortClause = ` ORDER BY ${orderByMatch[1]}`;
          }
        }

        // Start transaction for all queries to ensure atomicity
        const tx = await (db as Kysely<any>).startTransaction().execute();
        try {
          for (const statement of statements) {
            const trimmed = statement.trim();
            if (trimmed) {
              await tx.executeQuery(
                sql
                  .raw(trimmed.endsWith(";") ? trimmed : trimmed + ";")
                  .compile(db),
              );
            }
          }
          await tx.commit().execute();
        } catch (err) {
          await tx.rollback().execute();
          setError((err as any).message ?? "Unknown error with callback");
        }
        try {
          // Execute each statement
          for (const statement of statements) {
            console.log("STATEMENT", statement)
            if (statement.trim()) {
              const result = await dbRef.current.db
                .prepare(statement + ";")
                .all();
              console.log("Statement result:", result);
            }
          }

          // Determine which table was affected by looking at the first statement
          let affectedTable: "Patient" | "Procedure" | null = null;
          const firstStmt = statements[0].trim().toLowerCase();
          if (firstStmt.startsWith("select")) {
            const tableMatch = firstStmt.match(/from\s+(\w+)/i);
            if (tableMatch)
              affectedTable = tableMatch[1] as "Patient" | "Procedure";
          } else if (firstStmt.startsWith("insert")) {
            const tableMatch = firstStmt.match(/into\s+(\w+)/i);
            if (tableMatch)
              affectedTable = tableMatch[1] as "Patient" | "Procedure";
          } else if (
            firstStmt.startsWith("update") ||
            firstStmt.startsWith("delete")
          ) {
            const tableMatch = firstStmt.match(
              /(?:update|delete from)\s+(\w+)/i,
            );
            if (tableMatch)
              affectedTable = tableMatch[1] as "Patient" | "Procedure";
          }

          // Update the current resource if a different table was affected
          if (affectedTable && affectedTable !== currentResource) {
            setCurrentResource(affectedTable);
          }

          // Get the latest data for the current resource, preserving sort order if it was specified
          const query = `SELECT * FROM ${currentResource}${sortClause};`;
          console.log("Refreshing data with query:", query);
          const rows = await dbRef.current.db.prepare(query).all();
          console.log("Current table state after all operations:", rows);

          // Commit the transaction
          await dbRef.current.db.exec("COMMIT;");
          console.log("Transaction committed");

          // Update the data only once after the transaction is committed
          setRawData(rows);
        } catch (err) {
          // Rollback transaction on error
          await dbRef.current.db.exec("ROLLBACK;");
          console.log("Transaction rolled back due to error:", err);
          throw err;
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Query failed: ${errorMessage}`);
        throw err;
      }
    },
    [currentResource],
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Data Grid Panel */}
      <div
        style={{
          width: "60%",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              border: "1px solid #ef4444",
              borderRadius: 4,
              padding: 8,
              marginBottom: 8,
            }}
          >
            {error}
          </div>
        )}
        {rawData.length > 0 ? (
          <AgGridDataTable
            db={{}}
            resource={currentResource}
            rowData={rawData}
            onCellEdit={handleCellEdit}
            onError={setError}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading database...</p>
            </div>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <div
        style={{
          width: "40%",
          borderLeft: "1px solid #e5e7eb",
          height: "100%",
          minWidth: 0,
        }}
      >
        {rawData.length > 0 ? (
          <ChatUI db={dbRef.current!} onQuery={handleQuery} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading chat interface...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
