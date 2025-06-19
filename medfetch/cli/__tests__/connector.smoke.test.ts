import { describe, it, expect } from 'vitest';
import run from '../connector';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import { D1DatabaseWrapper } from '../d1-wrapper';
import { D1Database } from '@cloudflare/workers-types';

dotenv.config();

const HAPI_BASE = process.env.FHIR_BASE_URL || 'https://hapi.fhir.org/baseR4';
// Use a local manifest file from the examples directory
const manifestPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'examples', 'manifest.yaml');

// Set env for the test
process.env.FHIR_BASE_URL = HAPI_BASE;
process.env.MANIFEST_URL = manifestPath;

const patientId = 'smoketest-patient-1';
const procedureId = 'smoketest-procedure-1';

const events = [
  // CREATE Patient
  {
    payload: {
      op: 'c',
      after: {
        id: patientId,
        gender: 'male',
        first_name: 'John',
        last_name: 'Doe',
        birth_date: '1980-01-01',
        city: 'Boston',
        state: 'MA',
      },
    },
    source: { table: 'patients' },
  },
  // CREATE Procedure
  {
    payload: {
      op: 'c',
      after: {
        uid: procedureId,
        code: '12345',
        status: 'completed',
        subject_id: `Patient/${patientId}`,
        performed_date: '2023-01-01',
      },
    },
    source: { table: 'procedures' },
  },
  // UPDATE Patient
  {
    payload: {
      op: 'u',
      after: {
        id: patientId,
        gender: 'male',
        first_name: 'Johnny',
        last_name: 'Doe',
        birth_date: '1980-01-01',
        city: 'Cambridge',
        state: 'MA',
      },
    },
    source: { table: 'patients' },
  },
  // DELETE Procedure
  {
    payload: {
      op: 'd',
      before: {
        uid: procedureId,
        code: '12345',
        status: 'completed',
        subject_id: `Patient/${patientId}`,
        performed_date: '2023-01-01',
      },
    },
    source: { table: 'procedures' },
  },
];

describe('connector smoke test (HAPI FHIR sandbox)', () => {
  it('should process Patient and Procedure events and return metrics', async () => {
    const result = await run(events, { 
      db: new D1DatabaseWrapper(process.env.DB as unknown as D1Database), 
      env: { 
        FHIR_BASE_URL: HAPI_BASE,
        MANIFEST_URL: manifestPath
      } 
    });
    console.log('Connector smoke test metrics:', result);
    expect(result.successCount + result.failureCount).toBe(events.length);
    expect(result.deadLetter.length).toBe(result.failureCount);
  }, 30000);
}); 