"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { initMedfetchDB, type MedfetchClient } from "@/lib/client";
import { TableManager, type ColumnDefinition } from "@/utils/tableManager";
import ChatUI from "@/components/ChatUI";
import AGGridTable from "@/components/AGGridTable";
import { Database, MessageSquare, Users, Activity, AlertCircle, RefreshCw, Settings } from "lucide-react";

export default function ResearcherDemo() {
  const [db, setDB] = useState<MedfetchClient | null>(null);
  const [currentResource, setCurrentResource] = useState<"Patient" | "Procedure">("Patient");
  const [rawData, setRawData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const tableManager = useRef<TableManager | null>(null);
  const [primaryKey, setPrimaryKey] = useState<string>("patient_id");

  useEffect(() => {
    (async () => {
      try {
        setIsInitializing(true);
        
        const medDb = initMedfetchDB({
          baseURL: "https://r4.smarthealthit.org",
          filename: 'medfetch.db',
          trace: true
        } as { baseURL?: string; trace?: boolean; filename?: string });
        setDB(medDb);
        tableManager.current = new TableManager(medDb);

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
          CREATE TABLE IF NOT EXISTS Procedure (
            procedure_id TEXT PRIMARY KEY,
            patient_id TEXT,
            code TEXT,
            performedDate TEXT,
            notes TEXT,
            FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
          );
        `);

        const patientCount = await medDb.db.prepare('SELECT COUNT(*) as count FROM Patient;').all();
        if (patientCount[0].count === 0) {
          await medDb.db.exec(`
            INSERT INTO Patient (patient_id, givenName, familyName, birthDate, gender, condition, status)
            VALUES 
              ('p1', 'John', 'Doe', '1970-01-01', 'male', 'Diabetes', 'Active'),
              ('p2', 'Jane', 'Smith', '1985-03-15', 'female', 'Hypertension', 'Active'),
              ('p3', 'Bob', 'Johnson', '1962-07-22', 'male', 'Heart Disease', 'Inactive'),
              ('p4', 'Alice', 'Brown', '1978-11-08', 'female', 'Diabetes', 'Active'),
              ('p5', 'Charlie', 'Wilson', '1955-09-30', 'male', 'COPD', 'Active');
          `);
          
          await medDb.db.exec(`
            INSERT INTO Procedure (procedure_id, patient_id, code, performedDate, notes)
            VALUES 
              ('pr1', 'p1', 'Blood Test', '2024-01-15', 'Routine glucose check'),
              ('pr2', 'p2', 'BP Monitoring', '2024-01-20', 'Weekly blood pressure check'),
              ('pr3', 'p1', 'HbA1c Test', '2024-02-01', 'Diabetes monitoring'),
              ('pr4', 'p3', 'ECG', '2024-01-25', 'Heart rhythm check'),
              ('pr5', 'p4', 'Blood Test', '2024-02-10', 'Routine glucose check');
          `);
        }

        const schema = await tableManager.current.getTableSchema(currentResource);
        const pkCol = schema.find((col: ColumnDefinition) => col.primaryKey)?.name || "patient_id";
        setPrimaryKey(pkCol);
        const rows = await medDb.db.prepare(`SELECT * FROM ${currentResource};`).all();
        setRawData(rows);
      } catch (err) {
        setError("Failed to initialize Medfetch DB: " + (err as Error).message);
      } finally {
        setIsInitializing(false);
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

  const handleQuery = useCallback(async (sql: string): Promise<void> => {
    if (!db) return;

    try {
      setError(null);
      
      // Split multiple SQL statements if present
      const statements = sql.split(';').filter(stmt => stmt.trim());
      const isSelect = statements[0].trim().toLowerCase().startsWith('select');
      
      // Start transaction for non-SELECT queries
      if (!isSelect) {
        await db.db.exec('BEGIN TRANSACTION;');
      }

      try {
        // Execute each statement
        for (const statement of statements) {
          if (statement.trim()) {
            const result = await db.db.prepare(statement + ';').all();
            console.log('Statement result:', result);
          }
        }

        // Commit transaction for non-SELECT queries
        if (!isSelect) {
          await db.db.exec('COMMIT;');
          console.log('Transaction committed');
        }

        // Determine which table was affected by looking at the first statement
        let affectedTable: "Patient" | "Procedure" | null = null;
        const firstStmt = statements[0].trim().toLowerCase();
        if (firstStmt.startsWith('select')) {
          const tableMatch = firstStmt.match(/from\s+(\w+)/i);
          if (tableMatch) affectedTable = tableMatch[1] as "Patient" | "Procedure";
        } else if (firstStmt.startsWith('insert')) {
          const tableMatch = firstStmt.match(/into\s+(\w+)/i);
          if (tableMatch) affectedTable = tableMatch[1] as "Patient" | "Procedure";
        } else if (firstStmt.startsWith('update') || firstStmt.startsWith('delete')) {
          const tableMatch = firstStmt.match(/(?:update|delete from)\s+(\w+)/i);
          if (tableMatch) affectedTable = tableMatch[1] as "Patient" | "Procedure";
        }

        // Update the current resource if a different table was affected
        if (affectedTable && affectedTable !== currentResource) {
          setCurrentResource(affectedTable);
        }

        const rows = await db.db.prepare(`SELECT * FROM ${currentResource};`).all();
        console.log('Current table state after all operations:', rows);
        setRawData(rows);
      } catch (err) {
        if (!isSelect) {
          await db.db.exec('ROLLBACK;');
          console.log('Transaction rolled back due to error:', err);
        }
        throw err;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Query failed: ${errorMessage}`);
      throw err;
    }
  }, [db, currentResource]);

  const refreshData = async () => {
    if (!db) return;
    try {
      setError(null);
      const rows = await db.db.prepare(`SELECT * FROM ${currentResource};`).all();
      setRawData(rows);
    } catch (err) {
      setError("Failed to refresh data: " + (err as Error).message);
    }
  };

  const getTableStats = () => {
    if (!rawData) return { total: 0, active: 0 };
    const total = rawData.length;
    const active = rawData.filter(row => row.status === 'Active' || !row.status).length;
    return { total, active };
  };

  const stats = getTableStats();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">Initializing Database</h3>
            <p className="text-slate-400">Setting up your medical data workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-500/20 rounded-xl p-3">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Medical Data Explorer</h1>
                <p className="text-slate-400 text-sm">Interactive database with natural language queries</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setCurrentResource("Patient")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                    currentResource === "Patient"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Patients</span>
                </button>
                <button
                  onClick={() => setCurrentResource("Procedure")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                    currentResource === "Procedure"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Activity className="h-4 w-4" />
                  <span>Procedures</span>
                </button>
              </div>

              <button
                onClick={refreshData}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-slate-300">Total Records: <span className="text-white font-medium">{stats.total}</span></span>
            </div>
            {currentResource === "Patient" && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">Active: <span className="text-white font-medium">{stats.active}</span></span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Table: <span className="text-white font-medium">{currentResource}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        <div className="flex-1 p-6 min-w-0">
          <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl h-full flex flex-col overflow-hidden">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentResource === "Patient" ? (
                    <Users className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Activity className="h-5 w-5 text-purple-400" />
                  )}
                  <h2 className="text-lg font-semibold text-white">{currentResource} Data</h2>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Settings className="h-4 w-4" />
                  <span>Click cells to edit</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mx-6 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-red-400 font-medium">Error</h4>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              </div>
            )}

            <div className="flex-1 p-6">
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
                    <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-400">Loading database...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-96 border-l border-slate-700">
          {db ? (
            <ChatUI db={db} onQuery={handleQuery} />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-900">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-400">Loading chat interface...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}