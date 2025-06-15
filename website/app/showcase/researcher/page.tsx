"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMedDB } from "@/lib/client";
import { TableManager, type ColumnDefinition } from "@/utils/tableManager";
import ChatUI from "@/components/ChatUI";
import AGGridTable from "@/components/AGGridTable";
import { 
  ArrowLeft,
  Database,
  Users,
  Activity,
  AlertCircle,
  RefreshCw,
  Settings 
} from "lucide-react";
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

// Dynamically import icons
const LucideIcons = {
  ArrowLeft: dynamic(() => import('lucide-react').then(mod => mod.ArrowLeft)),
  Database: dynamic(() => import('lucide-react').then(mod => mod.Database)),
  Users: dynamic(() => import('lucide-react').then(mod => mod.Users)),
  Activity: dynamic(() => import('lucide-react').then(mod => mod.Activity)),
  AlertCircle: dynamic(() => import('lucide-react').then(mod => mod.AlertCircle)),
  RefreshCw: dynamic(() => import('lucide-react').then(mod => mod.RefreshCw)),
  Settings: dynamic(() => import('lucide-react').then(mod => mod.Settings))
};

export default function WorkspacePage() {
  const medDB = useMedDB();
  const router = useRouter();
  const [currentTableName, setCurrentTableName] = useState<string>("patients");
  const [rawData, setRawData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryKey, setPrimaryKey] = useState<string>("patient_id");

  const tableManagerRef = useRef<TableManager | null>(null);

  const initialize = useCallback(async () => {
  try {
    setIsLoading(true);
    tableManagerRef.current = new TableManager(medDB);

    const schema = await tableManagerRef.current.getTableSchema(currentTableName);
    const pkCol =
      schema?.find((col: ColumnDefinition) => col.primaryKey)?.name || "patient_id";
    setPrimaryKey(pkCol);

    const rows = await medDB.exec(`
      create table patients as
      select "Patient"."id" as "patient_id", strftime('%Y', "Condition"."onsetDateTime") as "onset_year", "Condition"."code" -> 'coding' -> 0 ->> 'code' as "icd_code", "Patient"."name" -> 0 -> 'given' ->> 0 as "first_name", "Patient"."name" -> 0 ->> 'family' as "last_name", 
    CAST(
    (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
    - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
    AS INTEGER) as age
         from "Patient" inner join "Condition" on "Condition"."subject" = "Patient"."id" 
      `).then(
        () => medDB.prepare("select * from patients;").all()
      )
    setRawData(rows);
  } catch (err) {
    setError("Initialization error: " + (err as Error).message);
  } finally {
    setIsLoading(false);
  }
}, [medDB, currentTableName]);

  useEffect(() => {
    initialize()
  },[initialize])

  const loadResourceData = useCallback(
    async () => {
      try {
        setError(null);
        setIsLoading(true);

        const schema = await tableManagerRef.current?.getTableSchema("patients");
        console.log("got schema", schema)
        const pkCol =
          schema?.find((col: ColumnDefinition) => col.primaryKey)?.name ||
          "patient_id";
        setPrimaryKey(pkCol);

        const rows = await medDB.prepare(`SELECT * FROM "patients"`).all();
        setRawData(rows);
      } catch (err) {
        setError("Failed to load data: " + (err as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [medDB],
  );

  const handleCellEdit = useCallback(
    async (rowId: any, col: string, newValue: any) => {
      if (!primaryKey) return;

      try {
        setError(null);
        const safeValue =
          typeof newValue === "string" ? `'${newValue}'` : newValue;
        const updateSQL = `UPDATE "${currentTableName}" SET "${col}" = ${safeValue} WHERE "${primaryKey}" = '${rowId}';`;

        await medDB.exec(`
          BEGIN TRANSACTION;
          ${updateSQL}
          COMMIT;
        `);

        await loadResourceData();
      } catch (err) {
        setError("Edit failed: " + (err as Error).message);
      }
    },
    [primaryKey, currentTableName, medDB, loadResourceData],
  );

  const handleQuery = useCallback(
    async (sql: string): Promise<void> => {
      try {
        setError(null);
        const statements = sql
          .split(";")
          .map((s) => s.trim())
          .filter(Boolean);
        const isSelect = statements[0].toLowerCase().startsWith("select");

        if (isSelect) {
          for (const stmt of statements) {
            await medDB.prepare(stmt + ";").all();
          }
        } else {
          await medDB.exec(`
            BEGIN TRANSACTION;
            ${statements.join(";")};
            COMMIT;
          `);
        }

        let affectedTable: "Patient" | "Procedure" | null = null;
        const first = statements[0].toLowerCase();
        const match =
          first.match(/from\s+(\w+)/i) ||
          first.match(/into\s+(\w+)/i) ||
          first.match(/(?:update|delete from)\s+(\w+)/i);
        if (match) affectedTable = match[1] as "Patient" | "Procedure";

        if (affectedTable && affectedTable !== currentTableName) {
          setCurrentTableName(affectedTable);
        } else {
          await loadResourceData();
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Query failed: ${msg}`);
        throw err;
      }
    },
    [currentTableName, loadResourceData, medDB],
  );

  const refreshData = useCallback(
    () => loadResourceData(),
    [loadResourceData],
  );

  const getTableStats = useCallback(() => {
    const total = rawData.length;
    const active = rawData.filter(
      (r) => r.status === "Active" || !r.status,
    ).length;
    return { total, active };
  }, [rawData]);

  const stats = getTableStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Initializing Workspace
            </h3>
            <p className="text-slate-400">
              Setting up your medical data environment...
            </p>
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
              <button
                onClick={() => router.push("/showcase/researcher")}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors"
                title="Back to Connection Setup"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>

              <div className="bg-blue-500/20 rounded-xl p-3">
                <Database className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Medical Data Workspace
                </h1>
                <p className="text-slate-400 text-sm">
                  Connected to SMART Health IT FHIR Server
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Connected</span>
              </div>

              <div className="flex bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setCurrentTableName("Patient")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                    currentTableName === "Patient"
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>Patients</span>
                </button>
                <button
                  onClick={() => setCurrentTableName("Procedure")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                    currentTableName === "Procedure"
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
              <span className="text-slate-300">
                Total Records:{" "}
                <span className="text-white font-medium">{stats.total}</span>
              </span>
            </div>
            {currentTableName === "Patient" && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-slate-300">
                  Active:{" "}
                  <span className="text-white font-medium">{stats.active}</span>
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-slate-300">
                Table:{" "}
                <span className="text-white font-medium">
                  {currentTableName}
                </span>
              </span>
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
                  {currentTableName === "Patient" ? (
                    <Users className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Activity className="h-5 w-5 text-purple-400" />
                  )}
                  <h2 className="text-lg font-semibold text-white">
                    {currentTableName} Data
                  </h2>
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
              <AGGridTable
                resource={currentTableName}
                rowData={rawData}
                onCellEdit={handleCellEdit}
                onError={setError}
              />
            </div>
          </div>
        </div>

        <div className="w-96 border-l border-slate-700">
          <ChatUI onQuery={handleQuery} />
        </div>
      </div>
    </div>
  );
}
