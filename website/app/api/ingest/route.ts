import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // forward raw CDC event array to your ingest worker
  const res = await fetch(
    `${process.env.WORKER_URL}/ingest`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: req.headers.get("authorization") || ""
      },
      body: JSON.stringify(body)
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: await res.text() }, { status: res.status });
  }

  const data = await res.json(); // { runId, successCount, failureCount }
  return NextResponse.json(data);
} 