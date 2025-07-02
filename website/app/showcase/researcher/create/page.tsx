import { Database } from "lucide-react";
import { CreateWorkspaceForm } from "@/app/showcase/researcher/create/page.client";

export default async function CreateWorkspacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-500/20 rounded-full border border-blue-400/30">
              <Database className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Create Your Workspace
          </h1>
          <p className="text-slate-300 text-lg">
            Set up your own research environment with real clinical data
          </p>
        </div>
        <CreateWorkspaceForm />
        <div className="text-center mt-6">
          <p className="text-slate-400 text-sm">
            Your workspace will be created with the selected data and settings
          </p>
        </div>
      </div>
    </div>
  );
}