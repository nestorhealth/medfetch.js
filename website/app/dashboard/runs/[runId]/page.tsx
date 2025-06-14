import Link from "next/link";

interface Params { 
  runId: string 
}

interface RunResource {
  resourceType: string;
  id: string;
  payload: Record<string, any>;
}

export default async function RunDetailsPage({ params }: { params: Params }) {
  const { runId } = params;
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/runs/${runId}`,
    { cache: 'no-store' } // Disable caching to always get fresh data
  );
  
  if (!res.ok) {
    throw new Error('Failed to fetch run details');
  }
  
  const resources: RunResource[] = await res.json();

  return (
    <main className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Run Details: {runId}</h1>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            ← Back to all runs
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900">
              Resources ({resources.length})
            </h2>
          </div>
          
          <div className="border-t border-gray-200">
            <div className="space-y-4 p-4">
              {resources.map((resource, i) => (
                <div key={`${resource.resourceType}-${resource.id}`} className="bg-gray-50 rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-gray-100 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">
                      {resource.resourceType} / {resource.id}
                    </h3>
                  </div>
                  <pre className="p-4 text-sm overflow-auto font-mono bg-white">
                    {JSON.stringify(resource.payload, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 