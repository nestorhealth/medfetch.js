import { NextRequest, NextResponse } from 'next/server';
import { mockRuns } from "@/src/data/mockRuns";

export async function GET(req: NextRequest) {
  const workerUrl = process.env.WORKER_URL;

  if (!workerUrl) {
    // Return mock data when worker URL is not configured
    return NextResponse.json(mockRuns);
  }

  try {
    const res = await fetch(
      `${workerUrl}/runs`,
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
    console.error('Error fetching runs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch runs' },
      { status: 500 }
    );
  }
} 