"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UploadIcon } from "lucide-react";

export default function CreateWorkspacePage() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientCount, setPatientCount] = useState<number>(0);

  const router = useRouter();

  /* ─────────────── local upload ─────────────── */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = JSON.parse(event.target?.result as string);
        setJsonData(result);

        const patients = Array.isArray(result.entry)
          ? result.entry.filter(
              (item) => item.resource?.resourceType === "Patient"
            )
          : [];
        setPatientCount(patients.length);

        setUploadSuccess(true);
        setError(null);
      } catch {
        setUploadSuccess(false);
        setError("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  /* ─────────────── create workspace (upload) ─────────────── */
  const handleSubmit = () => {
    if (!workspaceName || !jsonData) {
      setError("Please enter a workspace name and upload a valid JSON file.");
      return;
    }

    localStorage.setItem(
      "workspaceData",
      JSON.stringify({ workspaceName, jsonData })
    );
    router.push("/showcase/researcher");
  };

  /* ─────────────── demo json ─────────────── */
  const handleDemoJson = async () => {
    try {
      const res = await fetch("/api/public/researcher-demo/Patient.json");
      if (!res.ok) throw new Error("Failed to fetch demo JSON");
      const demo = await res.json();

      /* Wrap plain array into FHIR-style bundle if necessary */
      const wrapped =
        Array.isArray(demo)
          ? { entry: demo.map((resource: any) => ({ resource })) }
          : demo;

      localStorage.setItem(
        "workspaceData",
        JSON.stringify({
          workspaceName: workspaceName || "Demo Workspace",
          jsonData: wrapped,
        })
      );

      router.push("/showcase/researcher");
    } catch {
      setError("Could not load demo JSON.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 px-6 py-16">
      <div className="max-w-2xl mx-auto bg-slate-800/60 backdrop-blur-md p-10 rounded-3xl border border-slate-700 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Create a New Workspace
        </h1>
        <Separator className="mb-8 bg-slate-600" />

        <div className="space-y-6 text-white">
          {/* Workspace Name */}
          <div>
            <label
              htmlFor="workspaceName"
              className="block text-sm font-semibold mb-2"
            >
              Workspace Name
            </label>
            <input
              id="workspaceName"
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="e.g. Pediatric Tibial Fractures"
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* JSON Upload */}
          <div>
            <label
              htmlFor="jsonUpload"
              className="block text-sm font-semibold mb-2"
            >
              Upload .json File
            </label>
            <input
              id="jsonUpload"
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="block w-full text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-100 file:px-4 file:py-2 file:font-medium file:text-blue-900 hover:file:bg-blue-200"
            />
          </div>

          {/* Success */}
          {uploadSuccess && (
            <div className="text-sm text-green-300 bg-green-900/30 border border-green-700/30 rounded-lg px-4 py-3">
              ✅ Upload successful. Found <strong>{patientCount}</strong>{" "}
              patient{patientCount === 1 ? "" : "s"} in the JSON file.
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-sm text-red-300 bg-red-900/30 border border-red-700/30 rounded-lg px-4 py-3">
              ❌ {error}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 space-y-3">
            <Button
              onClick={handleSubmit}
              className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white"
            >
              <UploadIcon className="mr-2 size-4" />
              Create Workspace
            </Button>

            <Button
              variant="outline"
              onClick={handleDemoJson}
              className="w-full h-11 border-blue-600 text-blue-300 hover:bg-blue-600/20"
            >
              Use Demo JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
