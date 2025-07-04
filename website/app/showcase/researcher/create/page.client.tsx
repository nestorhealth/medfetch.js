"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  Folder,
  Calendar,
  Database,
  ChevronDown,
  Sparkles,
  Clock,
  ArrowRight,
  FileJson,
  Beaker,
  CheckCircle,
  Users,
  AlertCircle,
} from "lucide-react";
import { saveWorkspaceName, listWorkspaceNames } from "@/lib/workspaceopfs";
import type { FhirResource, Bundle } from "fhir/r5";

const getResourceCount = (bundle: Bundle<FhirResource>, resourceType: string) =>
  bundle.entry?.filter((entry) => entry.resource?.resourceType === resourceType)
    .length ?? 0;

interface CreateWorkspaceFormProps {
  demoBundle: Bundle<FhirResource> | null;
}

interface Workspace {
  name: string;
  createdAt: number;
  patientCount: number;
}

export function CreateWorkspaceForm({ demoBundle }: CreateWorkspaceFormProps) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [description, setDescription] = useState("");
  const [dataSource, setDataSource] = useState<"none" | "demo" | "upload">(
    "none",
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [bundleData, setBundleData] = useState<Bundle<FhirResource> | null>(
    null,
  );
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [patientCount, setPatientCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { scrollY } = useScroll();
  const formScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const formOpacity = useTransform(scrollY, [0, 200], [1, 0.8]);
  const formY = useTransform(scrollY, [0, 300], [0, -20]);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await listWorkspaceNames();
        const withCounts = list.map((w) => ({
          ...w,
          patientCount: 0,
        }));
        setWorkspaces(withCounts.sort((a, b) => b.createdAt - a.createdAt));
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [refreshTrigger]);

  const handleUseDemo = () => {
    if (!demoBundle) return;
    setDataSource("demo");
    setUploadedFile(null);
    setBundleData(demoBundle);
    setPatientCount(getResourceCount(demoBundle, "Patient"));
    setUploadSuccess(true);
    setError(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setDataSource("upload");
    setUploadSuccess(false);

    try {
      const text = await file.text();
      const json = JSON.parse(text) as Bundle<FhirResource>;
      setBundleData(json);
      const count = getResourceCount(json, "Patient");
      setPatientCount(count);
      setUploadSuccess(true);
      setError(null);
    } catch {
      setBundleData(null);
      setPatientCount(0);
      setUploadSuccess(false);
      setError("Invalid JSON file. Please upload a valid FHIR bundle.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      setError("Please enter a workspace name.");
      return;
    }
    if (!bundleData) {
      setError("Please select or upload a Bundle JSON to load.");
      return;
    }
    setIsCreating(true);
    setError(null);
    try {
      await saveWorkspaceName(workspaceName);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(
      "workspaceData",
      JSON.stringify({
        workspaceName,
        description,
        jsonData: bundleData,
      }),
    );
    setTimeout(() => {
      router.push("/showcase/researcher");
    }, 300);
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 6e4);
    const hrs = Math.floor(diff / 3.6e6);
    const days = Math.floor(diff / 8.64e7);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
    if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <motion.div
        ref={formRef}
        style={{ scale: formScale, opacity: formOpacity, y: formY }}
        className="relative mb-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl rounded-3xl" />
          <div className="relative bg-slate-900/70 border border-slate-800/50 rounded-xl p-6 hover:border-slate-700/50 transition-all duration-300">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="workspace-name"
                  className="text-sm font-medium text-slate-300 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  Workspace Name
                </label>
                <input
                  id="workspace-name"
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="e.g., Pediatric Tibial Fractures Q1"
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-slate-300"
                >
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your workspace purpose..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 resize-none"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  Data Source
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      dataSource === "upload"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-700 hover:border-slate-600 bg-slate-800/30"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          dataSource === "upload"
                            ? "bg-blue-500/20"
                            : "bg-slate-700/50"
                        }`}
                      >
                        <FileJson
                          className={`w-5 h-5 ${
                            dataSource === "upload"
                              ? "text-blue-400"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Upload JSON File
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {uploadedFile
                            ? uploadSuccess
                              ? "File uploaded successfully"
                              : uploadedFile.name
                            : "Import your FHIR data"}
                        </p>
                      </div>
                      {dataSource === "upload" && (
                        <CheckCircle className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUseDemo}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      dataSource === "demo"
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-slate-700 hover:border-slate-600 bg-slate-800/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          dataSource === "demo"
                            ? "bg-purple-500/20"
                            : "bg-slate-700/50"
                        }`}
                      >
                        <Beaker
                          className={`w-5 h-5 ${
                            dataSource === "demo"
                              ? "text-purple-400"
                              : "text-slate-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          Try with Demo Data
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {demoBundle?.entry?.length ?? 0} sample records
                        </p>
                      </div>
                      {dataSource === "demo" && (
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                      )}
                    </div>
                  </motion.div>
                </div>
              </div>
              {dataSource !== "none" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`rounded-lg p-4 ${
                      dataSource === "demo"
                        ? "bg-purple-900/20 border border-purple-800/30"
                        : "bg-blue-900/20 border border-blue-800/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Database
                        className={`w-5 h-5 mt-0.5 ${
                          dataSource === "demo"
                            ? "text-purple-400"
                            : "text-blue-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p
                          className={`text-sm font-medium ${
                            dataSource === "demo"
                              ? "text-purple-300"
                              : "text-blue-300"
                          }`}
                        >
                          {dataSource === "demo"
                            ? "Demo Data Selected"
                            : uploadSuccess
                              ? "Upload successful!"
                              : "File Uploaded"}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            dataSource === "demo"
                              ? "text-purple-300/70"
                              : "text-blue-300/70"
                          }`}
                        >
                          {dataSource === "demo"
                            ? `Obtained ${patientCount} patient${
                                patientCount !== 1 ? "s" : ""
                              } in demo bundle`
                            : uploadSuccess
                              ? `Found ${patientCount} patient${
                                  patientCount !== 1 ? "s" : ""
                                } in your data`
                              : `File: ${uploadedFile?.name ?? "Unknown"}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="rounded-lg p-4 bg-rose-950/20 border border-rose-800/30">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 mt-0.5 text-rose-400" />
                      <p className="text-sm text-rose-300">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
              <motion.button
                type="submit"
                disabled={isCreating || !workspaceName.trim() || !bundleData}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating Workspace...
                  </>
                ) : (
                  <>
                    Create Workspace
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
        {workspaces.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center mt-6"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-slate-400"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <div className="mt-12 space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Workspaces
          </h2>
          <p className="text-slate-400">
            {workspaces.length
              ? "Access and manage your research environments"
              : "Create your first workspace to get started"}
          </p>
        </motion.div>

        <AnimatePresence mode="popLayout">
          {workspaces.length ? (
            <motion.div
              className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
              layout
            >
              {workspaces.map((ws, i) => (
                <motion.div
                  key={ws.name}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="group relative"
                >
                  <div className="relative bg-slate-900/90 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <Folder className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(ws.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {ws.name}
                    </h3>

                    <div className="flex items-center text-sm text-slate-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      Created {new Date(ws.createdAt).toLocaleDateString()}
                    </div>

                    <div className="flex items-center text-sm text-slate-400 mt-2">
                      <Users className="w-4 h-4 mr-1" />
                      {ws.patientCount} patient
                      {ws.patientCount !== 1 ? "s" : ""}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-slate-900/80 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:backdrop-blur-sm group-hover:pointer-events-auto transition-all duration-200 rounded-xl"
                    >
                      <button
                        onClick={() => router.push("/showcase/researcher")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Open Workspace
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-800/50 rounded-full mb-4">
                <Folder className="w-8 h-8 text-slate-600" />
              </div>
              <p className="text-slate-400">No workspaces yet</p>
              <p className="text-sm text-slate-500 mt-2">
                Create your first workspace above to start researching
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
