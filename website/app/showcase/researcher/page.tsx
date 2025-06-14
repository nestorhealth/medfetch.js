"use client";
<<<<<<< HEAD
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useMedDB } from "@/lib/client";
import { TableManager, type ColumnDefinition } from "@/utils/tableManager";
import ChatUI from "@/components/ChatUI";
import AGGridTable from "@/components/AGGridTable";
import {
  Database,
  Users,
  Activity,
  AlertCircle,
  RefreshCw,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function WorkspacePage() {
  const medDB = useMedDB();
  const router = useRouter();
  const [currentResource, setCurrentResource] = useState<
    "Patient" | "Procedure"
  >("Patient");
  const [rawData, setRawData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryKey, setPrimaryKey] = useState<string>("patient_id");

  const tableManagerRef = useRef<TableManager | null>(null);

  const initialize = useCallback(async () => {
  try {
    setIsLoading(true);
    tableManagerRef.current = new TableManager(medDB);

    const schema = await tableManagerRef.current.getTableSchema(currentResource);
    const pkCol =
      schema?.find((col: ColumnDefinition) => col.primaryKey)?.name || "patient_id";
    setPrimaryKey(pkCol);

    const rows = await medDB.prepare(`
      select "Patient"."id" as "patient_id", strftime('%Y', "Condition"."onsetDateTime") as "onset_year", "Condition"."code" -> 'coding' -> 0 ->> 'code' as "icd_code", "Patient"."name" -> 0 -> 'given' ->> 0 as "first_name", "Patient"."name" -> 0 ->> 'family' as "last_name", 
          (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
          - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
         as "age" from "Patient" inner join "Condition" on "Condition"."subject" = "Patient"."id" 
      `).all();
    setRawData(rows);
  } catch (err) {
    setError("Initialization error: " + (err as Error).message);
  } finally {
    setIsLoading(false);
  }
}, [medDB, currentResource]);

  useEffect(() => {
    initialize()
  },[initialize])

  const loadResourceData = useCallback(
    async (resource: "Patient" | "Procedure") => {
      try {
        setError(null);
        setIsLoading(true);

        const schema = await tableManagerRef.current?.getTableSchema(resource);
        const pkCol =
          schema?.find((col: ColumnDefinition) => col.primaryKey)?.name ||
          "patient_id";
        setPrimaryKey(pkCol);

        const rows = await medDB.prepare(`SELECT * FROM "${resource}"`).all();
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
        const updateSQL = `UPDATE "${currentResource}" SET "${col}" = ${safeValue} WHERE "${primaryKey}" = '${rowId}';`;

        await medDB.exec(`
          BEGIN TRANSACTION;
          ${updateSQL}
          COMMIT;
        `);

        await loadResourceData(currentResource);
      } catch (err) {
        setError("Edit failed: " + (err as Error).message);
      }
    },
    [primaryKey, loadResourceData],
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

        if (affectedTable && affectedTable !== currentResource) {
          setCurrentResource(affectedTable);
        } else {
          await loadResourceData(currentResource);
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(`Query failed: ${msg}`);
        throw err;
      }
    },
    [currentResource, loadResourceData],
  );

  const refreshData = useCallback(
    () => loadResourceData(currentResource),
    [currentResource, loadResourceData],
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
              <span className="text-slate-300">
                Total Records:{" "}
                <span className="text-white font-medium">{stats.total}</span>
              </span>
            </div>
            {currentResource === "Patient" && (
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
                  {currentResource}
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
                  {currentResource === "Patient" ? (
                    <Users className="h-5 w-5 text-blue-400" />
                  ) : (
                    <Activity className="h-5 w-5 text-purple-400" />
                  )}
                  <h2 className="text-lg font-semibold text-white">
                    {currentResource} Data
                  </h2>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Settings className="h-4 w-4" />
                  <span>Click cells to edit</span>
=======
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Database, 
  Server, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Globe, 
  Shield,
  Activity,
  Users,
  FileText,
  Download,
  Play
} from "lucide-react";

export default function ConnectionSetupPage() {
  const router = useRouter();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'downloading' | 'processing' | 'complete'>('idle');
  const [selectedEndpoint, setSelectedEndpoint] = useState("https://r4.smarthealthit.org");

  const fhirEndpoints = [
    {
      name: "SMART Health IT (Demo)",
      url: "https://r4.smarthealthit.org",
      description: "Public FHIR R4 test server with sample data",
      status: "recommended"
    },
    {
      name: "HAPI FHIR Test Server",
      url: "https://hapi.fhir.org/baseR4",
      description: "Open source FHIR server for testing",
      status: "available"
    },
    {
      name: "Custom Endpoint",
      url: "custom",
      description: "Enter your own FHIR server URL",
      status: "custom"
    }
  ];

  const connectionSteps = [
    { id: 'connecting', label: 'Establishing Connection', icon: Globe },
    { id: 'downloading', label: 'Downloading FHIR Bundle', icon: Download },
    { id: 'processing', label: 'Processing Data', icon: Database },
    { id: 'complete', label: 'Workspace Ready', icon: CheckCircle }
  ];

  const handleEstablishConnection = async () => {
    setIsConnecting(true);
    setConnectionStep('connecting');

    const steps = ['connecting', 'downloading', 'processing', 'complete'] as const;
    
    for (let i = 0; i < steps.length; i++) {
      setConnectionStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    setTimeout(() => {
      router.push('/showcase/researcher/workspace');
    }, 1000);
  };

  const getStepStatus = (stepId: string) => {
    const currentIndex = connectionSteps.findIndex(step => step.id === connectionStep);
    const stepIndex = connectionSteps.findIndex(step => step.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-600 via-slate-900 to-slate-900">
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-500/20 rounded-xl p-3">
              <Database className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Medical Data Explorer</h1>
              <p className="text-slate-400 text-sm">Connect to FHIR server to begin data analysis</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Connect to FHIR Server
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                Establish a connection to your FHIR server to start analyzing medical data with natural language queries.
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <Server className="h-5 w-5 text-blue-400" />
                <span>Select FHIR Endpoint</span>
              </h3>
              
              <div className="space-y-3">
                {fhirEndpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedEndpoint === endpoint.url
                        ? 'bg-blue-500/20 border-blue-500/50'
                        : 'bg-slate-700/30 border-slate-600 hover:bg-slate-700/50'
                    }`}
                    onClick={() => setSelectedEndpoint(endpoint.url)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-white">{endpoint.name}</h4>
                          {endpoint.status === 'recommended' && (
                            <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{endpoint.description}</p>
                        {endpoint.url !== 'custom' && (
                          <p className="text-slate-500 text-xs font-mono">{endpoint.url}</p>
                        )}
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        selectedEndpoint === endpoint.url
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-slate-500'
                      }`}>
                        {selectedEndpoint === endpoint.url && (
                          <div className="w-full h-full rounded-full bg-white scale-50"></div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedEndpoint === 'custom' && (
                <div className="mt-4">
                  <input
                    type="url"
                    placeholder="Enter FHIR server URL..."
                    className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
              )}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-amber-300 font-medium mb-1">Security Notice</h4>
                  <p className="text-amber-200 text-sm">
                    This demo uses public test servers. Do not use real patient data or production FHIR endpoints.
                  </p>
>>>>>>> main
                </div>
              </div>
            </div>

<<<<<<< HEAD
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
                resource={currentResource}
                rowData={rawData}
                onCellEdit={handleCellEdit}
                onError={setError}
              />
            </div>
          </div>
        </div>

        <div className="w-96 border-l border-slate-700">
          <ChatUI onQuery={handleQuery} />
=======
            <div className="pt-4">
              <button
                onClick={handleEstablishConnection}
                disabled={isConnecting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  isConnecting
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transform hover:scale-[1.02] shadow-xl'
                }`}
              >
                {isConnecting ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-400 border-t-transparent"></div>
                    <span>Establishing Connection...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Zap className="h-5 w-5" />
                    <span>Establish Connection & Pull FHIR Bundle</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {isConnecting && (
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Connection Progress</h3>
                <div className="space-y-4">
                  {connectionSteps.map((step, index) => {
                    const status = getStepStatus(step.id);
                    const Icon = step.icon;
                    
                    return (
                      <div key={step.id} className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          status === 'completed' 
                            ? 'bg-green-500/20 text-green-400' 
                            : status === 'current'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-slate-700 text-slate-500'
                        }`}>
                          {status === 'current' ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                          ) : (
                            <Icon className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium ${
                            status === 'completed' || status === 'current' 
                              ? 'text-white' 
                              : 'text-slate-500'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                        {status === 'completed' && (
                          <CheckCircle className="h-5 w-5 text-green-400" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">What You'll Get</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-500/20 rounded-lg p-2">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Patient Data</h4>
                    <p className="text-slate-400 text-sm">Demographics, conditions, and medical history</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500/20 rounded-lg p-2">
                    <Activity className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Procedures & Observations</h4>
                    <p className="text-slate-400 text-sm">Medical procedures, lab results, and vital signs</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500/20 rounded-lg p-2">
                    <FileText className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Interactive Analysis</h4>
                    <p className="text-slate-400 text-sm">Natural language queries and data visualization</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Demo Features</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Real-time data editing and updates</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Natural language to SQL conversion</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Interactive data grid with filtering</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span className="text-slate-300">Chat-based data exploration</span>
                </div>
              </div>
            </div>
          </div>
>>>>>>> main
        </div>
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> main
