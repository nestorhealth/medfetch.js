'use client';

import { useState } from 'react';
import { ManifestValidationError } from 'medfetch';
import Link from "next/link";

interface RunSummary {
  run_id: string;
  start_time: string;
  resource_count: number;
  patient_count: number;
  procedure_count: number;
}

export default async function DashboardPage() {
  // Server-side fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/runs`, {
    cache: 'no-store' // Disable caching to always get fresh data
  });
  
  if (!res.ok) {
    throw new Error('Failed to fetch runs');
  }
  
  const runs: RunSummary[] = await res.json();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Clean Runs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Run ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Resources
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patients
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Procedures
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {runs.map((run) => (
              <tr key={run.run_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    href={`/dashboard/runs/${run.run_id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                  >
                    {run.run_id}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(run.start_time).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {run.resource_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {run.patient_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                  {run.procedure_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
} 