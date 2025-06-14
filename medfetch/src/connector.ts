import { loadManifest } from './manifest';
import { parseEvent } from './eventParser';
import { mapToFhir } from './mapper';
import { CleanLog, D1Client } from './d1';

interface Env {
  FHIR_BASE_URL: string;
  MANIFEST_URL: string | undefined;
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 5, baseDelay = 200): Promise<Response> {
  let attempt = 0;
  let lastError: any;
  while (attempt < maxRetries) {
    try {
      const res = await fetch(url, options);
      if (res.ok || (res.status >= 400 && res.status < 500)) {
        return res;
      }
      lastError = res;
    } catch (err) {
      lastError = err;
    }
    await new Promise((r) => setTimeout(r, baseDelay * Math.pow(2, attempt)));
    attempt++;
  }
  throw lastError;
}

export interface ConnectorOptions {
  db?: D1Client;
  env: Env;
}

export interface ConnectorResult {
  runId: string;
  successCount: number;
  failureCount: number;
  deadLetter: any[];
}

export default async function run(events: any[], options: ConnectorOptions): Promise<ConnectorResult> {
  const { env, db } = options;
  if (!env.FHIR_BASE_URL) {
    throw new Error('FHIR_BASE_URL environment variable is required');
  }

  // Load manifest at runtime to pick up environment variables
  const manifest = await loadManifest(env.MANIFEST_URL ?? '');

  // Initialize clean log if D1 client is provided
  const cleanLog = db ? new CleanLog(db) : undefined;
  const runId = cleanLog?.getRunId() ?? 'no-db';

  let successCount = 0;
  let failureCount = 0;
  const deadLetter: any[] = [];

  for (const evt of events) {
    try {
      const change = parseEvent(evt);
      const { resourceType, id, body } = mapToFhir(change, manifest);
      let url = `${env.FHIR_BASE_URL}/${resourceType}`;
      let options: RequestInit = { headers: { 'Content-Type': 'application/fhir+json' } };
      if (change.operation === 'CREATE') {
        options = { ...options, method: 'POST', body: JSON.stringify(body) };
      } else if (change.operation === 'UPDATE') {
        url += `/${id}`;
        options = { ...options, method: 'PUT', body: JSON.stringify(body) };
      } else if (change.operation === 'DELETE') {
        url += `/${id}`;
        options = { ...options, method: 'DELETE' };
      }
      const res = await fetchWithRetry(url, options);
      if (res.ok) {
        successCount++;
        // Log successful resource to clean_log if D1 is available
        if (cleanLog && change.operation !== 'DELETE') {
          await cleanLog.logResource(resourceType, id, body);
        }
      } else {
        failureCount++;
        deadLetter.push({ evt, error: await res.text() });
      }
    } catch (err: any) {
      failureCount++;
      deadLetter.push({ evt, error: err.message || String(err) });
    }
  }
  return { runId, successCount, failureCount, deadLetter };
} 