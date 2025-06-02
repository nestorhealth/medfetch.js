"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { initMedfetchDB, type MedfetchClient } from "medfetch";
import dynamic from 'next/dynamic';
import { TableManager, type ColumnDefinition } from "../../utils/tableManager";
import ChatUI from "../../components/ChatUI";

const AGGridTable = dynamic(() => import('../../components/AGGridTable'), {
  ssr: false
});

export default function ResearcherClient() {
  const [db, setDB] = useState<MedfetchClient | null>(null);
  const [currentResource, setCurrentResource] = useState<"Patient" | "Procedure">("Patient");
  const [rawData, setRawData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const tableManager = useRef<TableManager | null>(null);
  const [primaryKey, setPrimaryKey] = useState<string>("patient_id");

  // Initialize database and load initial data
  useEffect(() => {
    (async () => {
      try {
        const medDb = await initMedfetchDB();
        setDB(medDb);
        tableManager.current = new TableManager(medDb);
        // For demo, create a minimal Patient table if it doesn't exist and insert a dummy row.
        await medDb.db.exec(`
          CREATE TABLE IF NOT EXISTS Patient (
            patient_id TEXT PRIMARY KEY,
            givenName TEXT,
            familyName TEXT,
            birthDate TEXT,
            gender TEXT,
            condition TEXT,
            status TEXT
          );
        `);
        await medDb.db.exec(`
          INSERT OR IGNORE INTO Patient (patient_id, givenName, familyName, birthDate, gender, condition, status)
          VALUES ('p1', 'John', 'Doe', '1970-01-01', 'male', 'None', 'Active');
        `);
        // Determine primary key for the resource
        const schema = await tableManager.current.getTableSchema(currentResource);
        const pkCol = schema.find((col: ColumnDefinition) => col.primaryKey)?.name || "patient_id";
        setPrimaryKey(pkCol);
        const rows = await medDb.db.prepare(`SELECT * FROM ${currentResource};`).all();
        setRawData(rows);
      } catch (err) {
        setError("Failed to initialize Medfetch DB: " + (err as Error).message);
      }
    })();
  }, [currentResource]);

  const handleCellEdit = async (rowId: any, col: string, newValue: any) => {
    if (!db || !primaryKey) return;
    try {
      setError(null);
      const updateSQL = `UPDATE ${currentResource} SET ${col} = ${typeof newValue === "string" ? `'${newValue}'` : newValue} WHERE ${primaryKey} = '${rowId}';`;
      await db.db.exec("BEGIN TRANSACTION;");
      await db.db.exec(updateSQL);
      await db.db.exec("COMMIT;");
      const newRows = await db.db.prepare(`SELECT * FROM ${currentResource};`).all();
      setRawData(newRows);
    } catch (err) {
      setError("Edit failed: " + (err as Error).message);
    }
  };

  // Handle SQL query execution from chat
  const handleQuery = useCallback(async (sql: string) => {
    if (!db) return;

    try {
      setError(null);
      // Execute the query
      const result = await db.db.prepare(sql).all();
      
      // Update the current resource if the query affects a different table
      const tableMatch = sql.match(/FROM\s+(\w+)/i) || sql.match(/UPDATE\s+(\w+)/i) || sql.match(/INSERT\s+INTO\s+(\w+)/i);
      if (tableMatch && (tableMatch[1] === 'Patient' || tableMatch[1] === 'Procedure')) {
        setCurrentResource(tableMatch[1] as "Patient" | "Procedure");
      }

      // Refresh the current view
      const rows = await db.db.prepare(`SELECT * FROM ${currentResource};`).all();
      setRawData(rows);
    } catch (err) {
      setError("Query failed: " + (err as Error).message);
      throw err; // Re-throw to let ChatUI handle the error
    }
  }, [db, currentResource]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Data Grid Panel */}
      <div style={{ flex: 3, padding: 24, display: "flex", flexDirection: "column" }}>
        {error && (
          <div style={{
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #ef4444",
            borderRadius: 4,
            padding: 8,
            marginBottom: 8
          }}>{error}</div>
        )}
        {db ? (
          <AGGridTable
            db={db}
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
      <div style={{ flex: 2, borderLeft: "1px solid #e5e7eb", height: "100%" }}>
        {db ? (
          <ChatUI db={db} onQuery={handleQuery} />
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