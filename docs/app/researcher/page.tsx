// (docs/app/researcher/page.tsx) – Server component (no "use client")
import React from "react";
// @ts-ignore (or install @types/react and configure tsconfig paths for medfetch)
import ResearcherClient from "./ResearcherClient";

export default function ResearcherDashboard() {
  return <ResearcherClient />;
}
