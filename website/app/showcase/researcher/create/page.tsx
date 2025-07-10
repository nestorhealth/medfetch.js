import { Database } from "lucide-react";
import { CreateWorkspaceForm } from "@/app/showcase/researcher/create/page.client";
import { api } from "@/lib/api";
import { Bundle, FhirResource } from "fhir/r5";

const searchAll = (resourceType: "Patient" | "Procedure" | "Condition") =>
  api
    .GET("/fhir/{resourceType}", {
      params: {
        path: {
          resourceType: resourceType,
        },
      },
    })
    .then((res) => {
      if (res.error || !res.data) {
        return null;
      }
      return res.data;
    });

const getDemoBundle = async () => {
  const patients = await searchAll("Patient");
  const conditions = await searchAll("Condition");
  const procedures = await searchAll("Procedure");

  const merged: Bundle<{ resourceType: string }> = {
    id: crypto.randomUUID(),
    type: "searchset",
    resourceType: "Bundle",
    entry: [
      ...(patients?.entry ?? []),
      ...(conditions?.entry ?? []),
      ...(procedures?.entry ?? []),
    ],
  };
  return merged;
};

export default async function CreateWorkspacePage() {
  const demoBundle = await getDemoBundle();

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
      <div className="w-full max-w-3xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 border rounded-full bg-blue-500/20 border-blue-400/30">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-white">
            Create Your Workspace
          </h1>
          <p className="text-lg text-slate-300">
            Set up your own research environment with real clinical data
          </p>
        </div>
        <CreateWorkspaceForm demoBundle={demoBundle as Bundle<FhirResource>} />
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-400">
            Your workspace will be created with the selected data and settings
          </p>
        </div>
      </div>
    </div>
  );
}
