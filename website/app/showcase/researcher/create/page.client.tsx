"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UploadIcon, FileJson2, Sparkles, Users } from "lucide-react";
import type { Bundle } from "fhir/r5";
import { saveWorkspaceName } from "@/lib/workspaceopfs";

/**
 * Filter through resources with resourceType key equal to {@link resourceType}. If anything coallesces to undefined, then this returns 0
 * @param bundle The bundle to aggregate the count
 * @param resourceType The resourceType to count
 * @returns The resource count, or 0 if something was undefined in the path chain
 */
const getResourceCount = (
  bundle: Bundle<{resourceType: string}>,
  resourceType: string
) => {
  return bundle.entry?.filter(entry => entry.resource?.resourceType === resourceType).length ?? 0;
}

export function CreateWorkspaceForm(props: {
  demoBundle: Bundle<{resourceType: string;}>
}) {
  const [workspaceName, setWorkspaceName] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientCount, setPatientCount] = useState<number>(0);
  const [isDemo] = useState(false);

  const router = useRouter();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = JSON.parse(event.target?.result as string);
        setJsonData(result);
        setPatientCount(getResourceCount(result, "Patient"));
        setUploadSuccess(true);
        setError(null);
      } catch {
        setUploadSuccess(false);
        setError("Invalid JSON file. Please upload a valid FHIR bundle.");
      }
    };
    reader.readAsText(file);
  };

  const handleUseDemo = () => {
    setJsonData(props.demoBundle);
    const patientCount = getResourceCount(props.demoBundle, "Patient");
    setPatientCount(patientCount);
    setError(null);
    setUploadSuccess(true);
  };

  const handleSubmit = async () => {
    if (!workspaceName) {
      setError("Please enter a workspace name.");
      return;
    }
    if (!jsonData) {
      setError("Please enter a Bundle JSON to load.");
      return;
    }

    const payload: Record<string, any> = { workspaceName };
    payload.demo = false;
    payload.jsonData = jsonData;

    try {
      await saveWorkspaceName(workspaceName);  
    } catch (e) {
      console.error("OPFS save failed; falling back to localStorage", e);
    }
    
    localStorage.setItem(
      "workspaceData",
      JSON.stringify({ workspaceName, jsonData })
    );
    router.push("/showcase/researcher");
  };
  return (
    <div className="bg-slate-800/40 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Workspace Name</h2>
          </div>

          <div>
            <input
              id="workspaceName"
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Enter a descriptive name for your workspace"
              className="w-full rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
            />
          </div>
        </div>

        <Separator className="bg-slate-600/50" />

        <div className="space-y-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileJson2 className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Data Source</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                <h3 className="text-lg font-medium text-white mb-2">
                  Upload .JSON file
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                  Attatch your own data bundle in JSON format
                </p>
                <input
                  id="jsonUpload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-blue-600 file:transition-colors file:cursor-pointer cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-slate-900/30 rounded-2xl border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                <h3 className="text-lg font-medium text-white mb-2">
                  Try with Demo Data
                </h3>
                <p className="text-sm text-slate-300 mb-4">
                  Start with sample data to explore features
                </p>
                <Button
                  variant="outline"
                  onClick={handleUseDemo}
                  className="w-full bg-transparent border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white transition-all duration-200"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Load Demo JSON file
                </Button>
              </div>
            </div>
          </div>
        </div>

        {uploadSuccess && (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-green-500/20 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                {isDemo ? (
                  <div className="text-green-300">
                    <span className="font-medium">
                      Demo Data JSON file selected
                    </span>
                    <p className="text-sm text-green-300/80 mt-1">
                      Ready to create your workspace with sample data
                    </p>
                  </div>
                ) : (
                  <div className="text-green-300">
                    <span className="font-medium">Upload successful!</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-green-300/80">
                        Found <strong>{patientCount}</strong> patient
                        {patientCount === 1 ? "" : "s"} in your data
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-start space-x-3">
              <div className="p-1 bg-red-500/20 rounded-full">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              </div>
              <div className="flex-1">
                <span className="text-red-300 font-medium">Error</span>
                <p className="text-sm text-red-300/80 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!workspaceName || (!jsonData && !isDemo)}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/25"
          >
            <UploadIcon className="mr-2 w-5 h-5" />
            Create Workspace
          </Button>
        </div>
      </div>
    </div>
  );
}
