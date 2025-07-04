"use client";
import { useWorkspaceData } from "@/lib/hooks/useWorkspaceData";
import ChatUI from "@/components/ChatUI";
import AGGridTable from "@/components/AGGridTable";
import { ExportModal } from "@/components/ExportModal";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Database,
  Users,
  Activity,
  AlertCircle,
  RefreshCw,
  Settings,
  Download,
  Upload,
  Save,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { Dialect } from "kysely";
import medfetch from "medfetch/sqlite-wasm";

function WorkspaceHeader({
  currentTableName,
  setCurrentTableName,
  stats,
  onRefresh,
  onDownload,
  onUpload,
  onSave,
  onDelete,
  hasUnsavedChanges,
}: {
  currentTableName: string;
  setCurrentTableName: (name: string) => void;
  stats: { total: number; active: number };
  onRefresh: () => void;
  onDownload: () => void;
  onUpload: (file: File) => void;
  onSave: () => void;
  onDelete: () => void;
  hasUnsavedChanges: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = "";
    }
  };
  return (
    <div className="px-6 py-4 border-b bg-slate-800/50 backdrop-blur-sm border-slate-700">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/showcase/researcher/create")}
              className="p-2 transition-colors rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Database className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="flex items-center space-x-2 text-xl font-bold text-white">
                <span>Medical Data Workspace</span>
                {hasUnsavedChanges && (
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </h1>
              <p className="text-sm text-slate-400">
                Connected to SMART Health IT FHIR Server
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1.5 rounded-lg text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
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
            <div className="flex items-center space-x-2">
              <button
                onClick={onSave}
                className={`p-3 transition-all rounded-xl ${
                  hasUnsavedChanges
                    ? "bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                    : "bg-gray-500/10 hover:bg-gray-500/20 text-gray-500/60 border border-gray-500/20"
                }`}
              >
                {hasUnsavedChanges ? (
                  <Save className="w-4 h-4" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={onDownload}
                className="p-3 text-blue-400 transition-all border rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-3 text-red-400 transition-all border rounded-xl bg-red-500/20 hover:bg-red-500/30 border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleUploadClick}
                className="p-3 text-orange-400 transition-all border rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border-orange-500/30"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                onClick={onRefresh}
                className="p-2 transition-colors rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center mt-4 space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span className="text-slate-300">
              Total Records:{" "}
              <span className="font-medium text-white">{stats.total}</span>
            </span>
          </div>
          {currentTableName === "Patient" && (
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-slate-300">
                Active:{" "}
                <span className="font-medium text-white">{stats.active}</span>
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-slate-300">
              Table:{" "}
              <span className="font-medium text-white">{currentTableName}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataTableSection({
  currentTableName,
  rawData,
  error,
  onCellEdit,
  selectedRows,
  onSelectionChange,
  dialect,
}: {
  dialect: Dialect,
  currentTableName: string;
  rawData: any[];
  error: string | null;
  onCellEdit: (rowId: any, col: string, newValue: any) => Promise<void>;
  selectedRows: any[];
  onSelectionChange: (selectedRows: any[]) => void;
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
              {selectedRows.length > 0 && (
                <span className="px-2 py-1 text-xs text-blue-400 rounded bg-blue-500/20">
                  {selectedRows.length} selected
                </span>
              )}
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
            dialect={dialect}
            resource={currentTableName}
            rowData={rawData}
            onCellEdit={onCellEdit}
            onError={(err) => console.error(err)}
            onSelectionChange={onSelectionChange}
          />
        </div>
      </div>
    </div>
  );
}

function StatusNotification({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}) {
  const bgColor =
    type === "success"
      ? "bg-green-500/20 border-green-500/20"
      : type === "error"
        ? "bg-red-500/20 border-red-500/20"
        : "bg-blue-500/20 border-blue-500/20";
  const textColor =
    type === "success"
      ? "text-green-400"
      : type === "error"
        ? "text-red-400"
        : "text-blue-400";
  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-lg border ${bgColor} ${textColor} z-50 max-w-sm`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm">{message}</span>
        <button
          onClick={onClose}
          className="ml-4 text-lg leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default function WorkspacePage() {
  const workspaceName = "my-cool-workspace2";
  const viewName = "patients";
  const initialResource = "Patient";

  const raw = globalThis.localStorage?.getItem("workspaceData");
  const parsed = JSON.parse(raw ?? '{"jsonData": null}');
  const blob = new Blob([JSON.stringify(parsed.jsonData)], {
    type: "application/json",
  });
  const file = new File([blob], "idontmatter.json", {
    type: "application/json",
    lastModified: Date.now(),
  });
  const dialect = useMemo(() =>  medfetch(file, {
    filename: workspaceName
  }), []);

  const {
    currentTableName,
    setCurrentTableName,
    ctas,
    rows,
    isLoading,
    error,
    setError,
    executeQuery,
    editCell,
    stats,
  } = useWorkspaceData(dialect, {
    tableName: viewName,
    virtualTableName: initialResource,
  });

  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };
  const dbTable = currentTableName === "Patient" ? "patients" : "procedures";

  const handleDownload = (format: "csv" | "json") => {
    try {
      const data = selectedRows.length > 0 ? selectedRows : rows;
      if (data.length === 0) {
        showNotification("No data to download", "info");
        return;
      }
      let blob: Blob, fileName: string;
      if (format === "csv") {
        const headers = Object.keys(data[0]);
        const csv = [
          headers.join(","),
          ...data.map((r) =>
            headers
              .map((h) => {
                const v = r[h];
                return typeof v === "string" && v.includes(",")
                  ? `"${v.replace(/"/g, '""')}"`
                  : v;
              })
              .join(","),
          ),
        ].join("\n");
        blob = new Blob([csv], { type: "text/csv" });
        fileName = `${dbTable}_${Date.now()}.csv`;
      } else {
        blob = new Blob([JSON.stringify(data, null, 2)], {
          type: "application/json",
        });
        fileName = `${dbTable}_${Date.now()}.json`;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(
        `Downloaded ${data.length} rows as ${format.toUpperCase()}`,
        "success",
      );
    } catch {
      showNotification("Download failed", "error");
    }
  };

  const handleUpload = async (file: File) => {
    try {
      const text = await file.text();
      let rows: any[] = [];
      if (file.name.endsWith(".json")) {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) rows = parsed;
        else throw new Error("JSON must be an array of objects");
      } else if (file.name.endsWith(".csv")) {
        const [headerLine, ...lines] = text.trim().split("\n");
        const headers = headerLine.split(",").map((h) => h.trim());
        rows = lines.map((l) => {
          const obj: any = {};
          l.split(",").forEach((v, i) => (obj[headers[i]] = v.trim()));
          return obj;
        });
      } else throw new Error("Unsupported file type");
      if (rows.length === 0) {
        showNotification("No rows found", "info");
        return;
      }
      const insertSqls = rows
        .map((r) => {
          const cols = Object.keys(r)
            .map((c) => `"${c}"`)
            .join(", ");
          const vals = Object.values(r)
            .map((v) =>
              typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : v,
            )
            .join(", ");
          return `INSERT INTO "${dbTable}" (${cols}) VALUES (${vals})`;
        })
        .join("; ");
      await executeQuery.mutateAsync(insertSqls);
      await executeQuery.mutateAsync(`SELECT * FROM "${dbTable}"`);
      setHasUnsavedChanges(true);
      showNotification(`Uploaded ${rows.length} rows`, "success");
    } catch (e: any) {
      showNotification(`Upload failed: ${e.message}`, "error");
    }
  };

  const handleSave = async () => {
    try {
      await executeQuery.mutateAsync("COMMIT");
      setHasUnsavedChanges(false);
      showNotification("Changes saved", "success");
    } catch {
      showNotification("Save failed", "error");
    }
  };

  const handleDelete = async () => {
    if (selectedRows.length === 0) {
      showNotification("No selection", "info");
      return;
    }
    if (!confirm(`Delete ${selectedRows.length} selected rows?`)) return;
    try {
      const idField =
        currentTableName === "Patient" ? "patient_id" : "procedure_id";
      const deleteSql = selectedRows
        .map((r) => `DELETE FROM "${dbTable}" WHERE ${idField}='${r[idField]}'`)
        .join("; ");
      await executeQuery.mutateAsync(deleteSql);
      await executeQuery.mutateAsync(`SELECT * FROM "${dbTable}"`);
      setSelectedRows([]);
      setHasUnsavedChanges(true);
      showNotification("Rows deleted", "success");
    } catch {
      showNotification("Delete failed", "error");
    }
  };

  const handleSelectionChange = (rows: any[]) => setSelectedRows(rows);

  const handleCellEdit = async (rowId: any, col: string, newValue: any) => {
    try {
      await editCell.mutateAsync({ rowId, col, newValue });
      setHasUnsavedChanges(true);
    } catch (e: any) {
      throw e;
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="p-8 text-center border bg-slate-800/50 backdrop-blur-sm border-slate-700 rounded-2xl">
          <div className="w-12 h-12 mx-auto mb-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent" />
          <h3 className="mb-2 text-lg font-semibold text-white">
            Initializing Workspace
          </h3>
          <p className="text-slate-400">
            Setting up your medical data environment…
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {notification && (
        <StatusNotification
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleDownload}
        selectedCount={selectedRows.length}
        totalCount={rows.length}
        tableName={currentTableName}
      />

      <WorkspaceHeader
        currentTableName={currentTableName}
        setCurrentTableName={setCurrentTableName}
        stats={stats}
        onRefresh={() => executeQuery.mutate(`SELECT * FROM "${dbTable}"`)}
        onDownload={() => setShowExportModal(true)}
        onUpload={handleUpload}
        onSave={handleSave}
        onDelete={handleDelete}
        hasUnsavedChanges={hasUnsavedChanges}
      />
      <div className="flex h-[calc(100vh-120px)]">
        {!isLoading && (
          <DataTableSection
            dialect={dialect}
            currentTableName={currentTableName}
            rawData={rows}
            error={error}
            onCellEdit={handleCellEdit}
            selectedRows={selectedRows}
            onSelectionChange={handleSelectionChange}
          />
        )}
        <div className="border-l w-96 border-slate-700">
          <ChatUI
            initialTableStatement={ctas!}
            onQuery={async (sql) => {
              try {
                await executeQuery.mutateAsync(sql);
                setHasUnsavedChanges(true);
              } catch (e: any) {
                setError(e.message);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
