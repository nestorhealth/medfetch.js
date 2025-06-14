import { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { Separator } from './ui/separator';
import { ColumnDef } from '@tanstack/react-table';

interface RunSummary {
  run_id: string;
  start_time: string;
  resource_count: number;
  patient_count: number;
  procedure_count: number;
}

interface RunResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export function RunHistory() {
  const [runs, setRuns] = useState<RunSummary[]>([]);
  const [selectedRun, setSelectedRun] = useState<string | null>(null);
  const [resources, setResources] = useState<RunResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runColumns: ColumnDef<RunSummary>[] = [
    {
      accessorKey: 'run_id',
      header: 'Run ID',
      cell: ({ row }) => (
        <Button
          variant="link"
          onClick={() => setSelectedRun(row.original.run_id)}
        >
          {row.original.run_id}
        </Button>
      ),
    },
    {
      accessorKey: 'start_time',
      header: 'Start Time',
      cell: ({ row }) => new Date(row.original.start_time).toLocaleString(),
    },
    {
      accessorKey: 'resource_count',
      header: 'Total Resources',
    },
    {
      accessorKey: 'patient_count',
      header: 'Patients',
    },
    {
      accessorKey: 'procedure_count',
      header: 'Procedures',
    },
  ];

  const resourceColumns: ColumnDef<RunResource>[] = [
    {
      accessorKey: 'resourceType',
      header: 'Type',
    },
    {
      accessorKey: 'id',
      header: 'ID',
    },
    {
      accessorKey: 'payload',
      header: 'Payload',
      cell: ({ row }) => (
        <pre className="text-xs">
          {JSON.stringify(row.original, null, 2)}
        </pre>
      ),
    },
  ];

  // Fetch run history
  useEffect(() => {
    async function fetchRuns() {
      try {
        const response = await fetch('/api/runs');
        if (!response.ok) throw new Error('Failed to fetch runs');
        const data = await response.json() as RunSummary[];
        setRuns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load runs');
      } finally {
        setLoading(false);
      }
    }
    fetchRuns();
  }, []);

  // Fetch resources for selected run
  useEffect(() => {
    if (!selectedRun) {
      setResources([]);
      return;
    }

    async function fetchResources() {
      try {
        const response = await fetch(`/api/runs/${selectedRun}`);
        if (!response.ok) throw new Error('Failed to fetch resources');
        const data = await response.json() as RunResource[];
        setResources(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load resources');
      }
    }
    fetchResources();
  }, [selectedRun]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-3/4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Run History</h2>
        <DataTable
          data={runs}
          columns={runColumns}
        />
      </div>

      {selectedRun && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources for Run {selectedRun}</h3>
            <DataTable
              data={resources}
              columns={resourceColumns}
            />
          </div>
        </>
      )}
    </div>
  );
} 