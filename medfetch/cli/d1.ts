import { v4 as uuidv4 } from 'uuid';

export interface CleanLogEntry {
  run_id: string;
  timestamp: string;
  resource_type: string;
  resource_id: string;
  payload: any;
}

export interface D1Client {
  prepare(query: string): D1PreparedStatement;
  exec(query: string): Promise<D1ExecResult>;
}

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = unknown>(colName?: string): Promise<T | null>;
  run(): Promise<D1ExecResult>;
  all<T = unknown>(): Promise<D1Result<T>>;
}

export interface D1ExecResult {
  success: boolean;
  error?: string;
}

export interface D1Result<T> {
  results: T[];
  success: boolean;
  error?: string;
}

export class CleanLog {
  private db: D1Client;
  private runId: string;

  constructor(db: D1Client) {
    this.db = db;
    this.runId = uuidv4();
  }

  getRunId(): string {
    return this.runId;
  }

  async logResource(resourceType: string, resourceId: string, payload: any): Promise<void> {
    const entry: CleanLogEntry = {
      run_id: this.runId,
      timestamp: new Date().toISOString(),
      resource_type: resourceType,
      resource_id: resourceId,
      payload
    };

    const stmt = this.db.prepare(`
      INSERT INTO clean_log (run_id, timestamp, resource_type, resource_id, payload)
      VALUES (?, ?, ?, ?, ?)
    `).bind(
      entry.run_id,
      entry.timestamp,
      entry.resource_type,
      entry.resource_id,
      JSON.stringify(entry.payload)
    );

    const result = await stmt.run();
    if (!result.success) {
      throw new Error(`Failed to log resource: ${result.error}`);
    }
  }

  async getRunResources(runId: string): Promise<any[]> {
    const stmt = this.db.prepare(`
      SELECT payload
      FROM clean_log
      WHERE run_id = ?
      ORDER BY timestamp ASC
    `).bind(runId);

    const result = await stmt.all<{ payload: string }>();
    if (!result.success) {
      throw new Error(`Failed to fetch run resources: ${result.error}`);
    }

    return result.results.map(row => JSON.parse(row.payload));
  }
}

// SQL for creating the clean_log table
export const CREATE_CLEAN_LOG_TABLE = `
CREATE TABLE IF NOT EXISTS clean_log (
  run_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  payload TEXT NOT NULL,
  PRIMARY KEY (run_id, resource_type, resource_id)
);
CREATE INDEX IF NOT EXISTS idx_clean_log_run_id ON clean_log(run_id);
CREATE INDEX IF NOT EXISTS idx_clean_log_timestamp ON clean_log(timestamp);
`; 