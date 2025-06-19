"use client";
import { useWorkspaceData } from "@/lib/hooks/useWorkspaceData";
import ChatUI from "@/components/ChatUI";
import AGGridTable from "@/components/AGGridTable";
import { useRouter } from "next/navigation";

// Import icons directly from esm
import { 
  ArrowLeft,
  Database,
  Users,
  Activity,
  AlertCircle,
  RefreshCw,
  Settings 
} from "lucide-react";

// Header component
function WorkspaceHeader({ 
  currentTableName, 
  setCurrentTableName, 
  stats, 
  onRefresh 
}: { 
  currentTableName: string;
  setCurrentTableName: (name: string) => void;
  stats: { total: number; active: number };
  onRefresh: () => void;
}) {
  const router = useRouter();

  return (
    <div className="px-6 py-4 border-b bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/showcase/researcher")}
              className="p-2 transition-colors rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
              title="Back to Connection Setup"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Medical Data Workspace
              </h1>
              <p className="text-sm text-slate-400">
                Connected to SMART Health IT FHIR Server
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Connected</span>
            </div>

            <div className="flex p-1 rounded-lg bg-slate-800">
              <button
                onClick={() => setCurrentTableName("Patient")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 ${
                  currentTableName === "Patient"
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Users className="w-4 h-4" />
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
                <Activity className="w-4 h-4" />
                <span>Procedures</span>
              </button>
            </div>

            <button
              onClick={onRefresh}
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
            <span className="text-slate-300">
              Total Records:{" "}
              <span className="font-medium text-white">{stats.total}</span>
            </span>
          </div>
          {currentTableName === "Patient" && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-slate-300">
                Active:{" "}
                <span className="font-medium text-white">{stats.active}</span>
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-slate-300">
              Table:{" "}
              <span className="font-medium text-white">
                {currentTableName}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Data table component
function DataTableSection({ 
  currentTableName, 
  rawData, 
  error, 
  onCellEdit 
}: { 
  currentTableName: string;
  rawData: any[];
  error: string | null;
  onCellEdit: (rowId: any, col: string, newValue: any) => Promise<void>;
}) {
  return (
    <div className="flex-1 min-w-0 p-6">
      <div className="flex flex-col h-full overflow-hidden border bg-slate-800/30 backdrop-blur-sm border-slate-700 rounded-2xl">
        <div className="px-6 py-4 border-b bg-slate-800/50 border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {currentTableName === "Patient" ? (
                <Users className="w-5 h-5 text-blue-400" />
              ) : (
                <Activity className="w-5 h-5 text-purple-400" />
              )}
              <h2 className="text-lg font-semibold text-white">
                {currentTableName} Data
              </h2>
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
          <AGGridTable
            resource={currentTableName}
            rowData={rawData}
            onCellEdit={onCellEdit}
            onError={(err) => console.error(err)}
          />
        </div>
      </div>
    </div>
  );
}

// Main page component
export default function WorkspacePage() {
  const {
    currentTableName,
    setCurrentTableName,
    rawData,
    isLoading,
    error,
    setError,
    executeQuery,
    editCell,
    stats,
  } = useWorkspaceData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="p-8 border bg-slate-800/50 backdrop-blur-sm border-slate-700 rounded-2xl">
            <div className="w-12 h-12 mx-auto mb-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            <h3 className="mb-2 text-lg font-semibold text-white">
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
      <WorkspaceHeader
        currentTableName={currentTableName}
        setCurrentTableName={setCurrentTableName}
        stats={stats}
        onRefresh={() => executeQuery.mutate(`SELECT * FROM "${currentTableName}"`)}
      />

      <div className="flex h-[calc(100vh-120px)]">
        <DataTableSection
          currentTableName={currentTableName}
          rawData={rawData}
          error={error}
          onCellEdit={async (rowId, col, newValue) => {
            await editCell.mutateAsync({ rowId, col, newValue });
          }}
        />

        <div className="border-l w-96 border-slate-700">
          <ChatUI onQuery={async (sql) => {
            try {
              await executeQuery.mutateAsync(sql);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Unknown error occurred");
            }
          }} />
        </div>
      </div>
    </div>
  );
}
