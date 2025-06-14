import { v4 as uuidv4 } from 'uuid';

const API_URL = 'http://localhost:8787'; // Update this to your worker URL after deployment

const testEvents = [
  // CREATE Patient
  {
    payload: {
      op: 'c',
      after: {
        id: `test-patient-${uuidv4()}`,
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
        uid: `test-procedure-${uuidv4()}`,
        code: '12345',
        status: 'completed',
        subject_id: 'Patient/test-patient-1',
        performed_date: '2023-01-01',
      },
    },
    source: { table: 'procedures' },
  },
];

async function testIngest() {
  try {
    // Test POST /ingest
    console.log('Testing POST /ingest...');
    const ingestResponse = await fetch(`${API_URL}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testEvents),
    });

    if (!ingestResponse.ok) {
      throw new Error(`Ingest failed: ${await ingestResponse.text()}`);
    }

    const result = await ingestResponse.json();
    console.log('Ingest result:', result);

    // Test GET /runs/{runId}
    console.log('\nTesting GET /runs/{runId}...');
    const runResponse = await fetch(`${API_URL}/runs/${result.runId}`);
    
    if (!runResponse.ok) {
      throw new Error(`Failed to fetch run: ${await runResponse.text()}`);
    }

    const resources = await runResponse.json();
    console.log('Run resources:', JSON.stringify(resources, null, 2));

  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testIngest(); 