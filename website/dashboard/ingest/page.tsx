"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface IngestResponse {
  runId: string;
  error?: string;
}

export default function IngestPage() {
  const [eventsJson, setEventsJson] = useState("[]");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [runId, setRunId] = useState<string>();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(undefined);
    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: eventsJson,
      });
      const data = (await res.json()) as IngestResponse;
      if (!res.ok) throw new Error(data.error || "Ingest failed");
      setRunId(data.runId);
      // navigate to details immediately
      router.push(`/dashboard/runs/${data.runId}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Trigger Clean Ingest</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          <span className="text-sm font-medium">CDC Events JSON</span>
          <textarea
            className="mt-1 block w-full h-40 p-2 border rounded font-mono text-sm"
            value={eventsJson}
            onChange={(e) => setEventsJson(e.target.value)}
            placeholder="Paste your CDC events array here..."
          />
        </label>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {busy ? "Running…" : "Start Ingest"}
        </button>
      </form>
      {runId && (
        <p className="mt-4 text-green-600">
          Started run <strong>{runId}</strong>. Redirecting…
        </p>
      )}
    </main>
  );
} 