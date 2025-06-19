import { NextRequest, NextResponse } from 'next/server';
import { mockRunDetails } from "@/src/data/mockRuns";

interface Params { 
  runId: string 
}

export async function GET(
  req: NextRequest,
  { params }: { params: Params }
) {
  const workerUrl = process.env.WORKER_URL;

  if (!workerUrl) {
    // Return mock data when worker URL is not configured
    const details = mockRunDetails[params.runId] || [];
    return NextResponse.json(details);
  }

  try {
    const { runId } = params;
    const res = await fetch(
      `${workerUrl}/runs/${runId}`,
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': req.headers.get("authorization") || "" 
        } 
      }
    );
    
    if (!res.ok) {
      throw new Error(`Worker responded with status: ${res.status}`);
    }
    
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Failed to fetch run ${params.runId}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch run details' },
      { status: 500 }
    );
  }
} 