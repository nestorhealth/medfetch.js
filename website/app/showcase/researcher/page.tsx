"use client";
import React from "react";
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
              onClick={onRefresh}
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

        <div className="w-96 border-l border-slate-700">
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
