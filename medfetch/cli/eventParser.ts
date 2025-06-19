export type Operation = 'CREATE' | 'UPDATE' | 'DELETE';

export interface RecordChange {
  operation: Operation;
  table: string;
  key: Record<string, string | number>;
  payload: Record<string, any>;
}

/**
 * Parses a Debezium-style CDC event into a RecordChange object.
 * @param eventJson The raw event JSON
 * @returns RecordChange
 * @throws Error if the event cannot be parsed
 */
export function parseEvent(eventJson: any): RecordChange {
  if (!eventJson || !eventJson.payload || !eventJson.source) {
    throw new Error('Invalid event: missing payload or source');
  }

  const opMap: Record<string, Operation> = {
    c: 'CREATE',
    u: 'UPDATE',
    d: 'DELETE',
  };

  const op = opMap[eventJson.payload.op];
  if (!op) {
    throw new Error(`Unknown operation: ${eventJson.payload.op}`);
  }

  const table = eventJson.source.table;
  if (!table) {
    throw new Error('Missing table in event source');
  }

  let key: Record<string, string | number>;
  let payload: Record<string, any>;

  if (op === 'DELETE') {
    if (!eventJson.payload.before) {
      throw new Error('Missing before for DELETE operation');
    }
    key = { ...eventJson.payload.before };
    payload = { ...eventJson.payload.before };
  } else {
    if (!eventJson.payload.after) {
      throw new Error('Missing after for CREATE/UPDATE operation');
    }
    key = { ...eventJson.payload.after };
    payload = { ...eventJson.payload.after };
  }

  // Only keep primary key fields in key (if available)
  // For simplicity, assume all fields in before/after are part of the key
  // (You can enhance this to use a manifest or schema for real PK detection)

  return {
    operation: op,
    table,
    key,
    payload,
  };
} 