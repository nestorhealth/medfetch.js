"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useMedDB } from "@/lib/client";
import { TableManager, type ColumnDefinition } from "@/utils/tableManager";
import ChatUI from "@/components/ChatUI";
import AGGridTable from "@/components/AGGridTable";
import { useRouter } from "next/navigation";

// Import icons directly
import { 
  ArrowLeft,
  Database,
  Users,
  Activity,
  AlertCircle,
  RefreshCw,
  Settings 
} from "lucide-react";

export default function WorkspacePage() {
  const router = useRouter();
  const dbRef = useMedDB();
  const tableManagerRef = useRef<TableManager | null>(null);
  const isInitializedRef = useRef(false);
  
  const [currentResource, setCurrentResource] = useState<"Patient" | "Procedure">("Patient");
  const [rawData, setRawData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryKey, setPrimaryKey] = useState<string>("patient_id");

  const initializeDatabase = useCallback(async () => {
    if (isInitializedRef.current || !dbRef) return;
    
    try {
      setIsLoading(true);
      isInitializedRef.current = true;
      tableManagerRef.current = new TableManager(dbRef);

      await dbRef.exec(`
        BEGIN TRANSACTION;
        
        CREATE TABLE IF NOT EXISTS Patient (
          patient_id TEXT PRIMARY KEY,
          givenName TEXT,
          familyName TEXT,
          birthDate TEXT,
          gender TEXT,
          condition TEXT,
          status TEXT
        );

        CREATE TABLE IF NOT EXISTS Procedure (
          procedure_id TEXT PRIMARY KEY,
          patient_id TEXT,
          code TEXT,
          performedDate TEXT,
          notes TEXT,
          FOREIGN KEY (patient_id) REFERENCES Patient(patient_id)
        );
        
        COMMIT;
      `);

      const patientCount = await dbRef.prepare('SELECT COUNT(*) as count FROM Patient;').all();
      if (patientCount[0].count === 0) {
        await dbRef.exec(`
          BEGIN TRANSACTION;
          
          INSERT INTO Patient (patient_id, givenName, familyName, birthDate, gender, condition, status)
          VALUES 
            ('p1', 'John', 'Doe', '1970-01-01', 'male', 'Diabetes', 'Active'),
            ('p2', 'Jane', 'Smith', '1985-03-15', 'female', 'Hypertension', 'Active'),
            ('p3', 'Bob', 'Johnson', '1962-07-22', 'male', 'Heart Disease', 'Inactive'),
            ('p4', 'Alice', 'Brown', '1978-11-08', 'female', 'Diabetes', 'Active'),
            ('p5', 'Charlie', 'Wilson', '1955-09-30', 'male', 'COPD', 'Active');
          
          INSERT INTO Procedure (procedure_id, patient_id, code, performedDate, notes)
          VALUES 
            ('pr1', 'p1', 'Blood Test', '2024-01-15', 'Routine glucose check'),
            ('pr2', 'p2', 'BP Monitoring', '2024-01-20', 'Weekly blood pressure check'),
            ('pr3', 'p1', 'HbA1c Test', '2024-02-01', 'Diabetes monitoring'),
            ('pr4', 'p3', 'ECG', '2024-01-25', 'Heart rhythm check'),
            ('pr5', 'p4', 'Blood Test', '2024-02-10', 'Routine glucose check');
          
          COMMIT;
        `);
      }

    } catch (err) {
      setError("Failed to initialize Medfetch DB: " + (err as Error).message);
      isInitializedRef.current = false;
    } finally {
      setIsLoading(false);
    }
  }, [dbRef]);

  const loadResourceData = useCallback(async (resource: "Patient" | "Procedure") => {
    if (!dbRef || !tableManagerRef.current) return;
    
    try {
      setError(null);
      const schema = await tableManagerRef.current.getTableSchema("patients");
      const pkCol = schema.find((col: ColumnDefinition) => col.primaryKey)?.name || "patient_id";
      setPrimaryKey(pkCol);
      const rows = await dbRef.prepare(`SELECT * FROM "patients";`).all();
      console.log("i got", rows)
      setRawData(rows);
    } catch (err) {
      setError("Failed to load data: " + (err as Error).message);
    }
  }, [dbRef]);

  useEffect(() => {
    initializeDatabase();
  }, [initializeDatabase]);

  useEffect(() => {
    if (dbRef && !isLoading) {
      loadResourceData(currentResource);
    }
  }, [currentResource, dbRef, isLoading, loadResourceData]);

  const handleCellEdit = useCallback(async (rowId: any, col: string, newValue: any) => {
    if (!dbRef || !primaryKey) return;
    
    try {
      setError(null);
      const updateSQL = `UPDATE ${currentResource} SET ${col} = ${typeof newValue === "string" ? `'${newValue}'` : newValue} WHERE ${primaryKey} = '${rowId}';`;
      
      await dbRef.exec(`
        BEGIN TRANSACTION;
        ${updateSQL}
        COMMIT;
      `);
      
      await loadResourceData(currentResource);
    } catch (err) {
      setError("Edit failed: " + (err as Error).message);
    }
  }, [dbRef, primaryKey, currentResource, loadResourceData]);

  const handleQuery = useCallback(async (sql: string): Promise<void> => {
    if (!dbRef) return;

    try {
      setError(null);
      
      const statements = sql.split(';').filter(stmt => stmt.trim());
      const isSelect = statements[0].trim().toLowerCase().startsWith('select');
      
      if (isSelect) {
        for (const statement of statements) {
          if (statement.trim()) {
            await dbRef.prepare(statement + ';').all();
          }
        }
      } else {
        const transactionSQL = `
          BEGIN TRANSACTION;
          ${statements.join(';')};
          COMMIT;
        `;
        await dbRef.exec(transactionSQL);
      }

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

      if (affectedTable && affectedTable !== currentResource) {
        setCurrentResource(affectedTable);
      } else {
        await loadResourceData(currentResource);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Query failed: ${errorMessage}`);
      throw err;
    }
  }, [currentResource, dbRef, loadResourceData]);

  const refreshData = useCallback(async () => {
    if (!dbRef) return;
    await loadResourceData(currentResource);
  }, [currentResource, dbRef, loadResourceData]);

  const getTableStats = useCallback(() => {
    if (!rawData) return { total: 0, active: 0 };
    const total = rawData.length;
    const active = rawData.filter(row => row.status === 'Active' || !row.status).length;
    return { total, active };
  }, [rawData]);

  const stats = getTableStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="p-8 border bg-slate-800/50 backdrop-blur-sm border-slate-700 rounded-2xl">
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            <h3 className="mb-2 text-lg font-semibold text-white">Initializing Workspace</h3>
            <p className="text-slate-400">Setting up your medical data environment...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="px-6 py-4 border-b bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/showcase/researcher')}
                className="p-2 transition-colors rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                title="Back to Connection Setup"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Medical Data Workspace</h1>
                <p className="text-sm text-slate-400">Connected to SMART Health IT FHIR Server</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Connected</span>
              </div>
              
              <div className="flex p-1 rounded-lg bg-slate-800">
                <button
                  onClick={() => setCurrentResource("Patient")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                    currentResource === "Patient"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Users className="w-4 h-4" />
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
                  <Activity className="w-4 h-4" />
                  <span>Procedures</span>
                </button>
              </div>

              <button
                onClick={refreshData}
                className="p-2 transition-colors rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center mt-4 space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-slate-300">Total Records: <span className="font-medium text-white">{stats.total}</span></span>
            </div>
            {currentResource === "Patient" && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">Active: <span className="font-medium text-white">{stats.active}</span></span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">Table: <span className="font-medium text-white">{currentResource}</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-120px)]">
        <div className="flex-1 min-w-0 p-6">
          <div className="flex flex-col h-full overflow-hidden border bg-slate-800/30 backdrop-blur-sm border-slate-700 rounded-2xl">
            <div className="px-6 py-4 border-b bg-slate-800/50 border-slate-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentResource === "Patient" ? (
                    <Users className="w-5 h-5 text-blue-400" />
                  ) : (
                    <Activity className="w-5 h-5 text-purple-400" />
                  )}
                  <h2 className="text-lg font-semibold text-white">{currentResource} Data</h2>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Settings className="w-4 h-4" />
                  <span>Click cells to edit</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-start p-4 mx-6 mt-4 space-x-3 border rounded-lg bg-red-500/10 border-red-500/20">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-400">Error</h4>
                  <p className="mt-1 text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}

            <div className="flex-1 p-6">
              {dbRef ? (
                <AGGridTable 
                  resource={currentResource}
                  rowData={rawData}
                  onCellEdit={handleCellEdit}
                  onError={setError}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                    <p className="text-slate-400">Loading database...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-l w-96 border-slate-700">
          {dbRef ? (
            <ChatUI onQuery={handleQuery} />
          ) : (
            <div className="flex items-center justify-center h-full bg-slate-900">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                <p className="text-slate-400">Loading chat interface...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
