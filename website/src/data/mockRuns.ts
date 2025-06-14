export interface RunSummary {
  runId: string;
  timestamp: string;
  successCount: number;
  failureCount: number;
}

export const mockRuns: RunSummary[] = [
  {
    runId: "run-001",
    timestamp: "2024-03-20T10:00:00Z",
    successCount: 42,
    failureCount: 3
  },
  {
    runId: "run-002",
    timestamp: "2024-03-20T11:30:00Z",
    successCount: 28,
    failureCount: 1
  },
  {
    runId: "run-003",
    timestamp: "2024-03-20T14:15:00Z",
    successCount: 35,
    failureCount: 0
  }
];

export interface RunRecord {
  payload: Record<string, any>;
}

export const mockRunDetails: Record<string, RunRecord[]> = {
  "run-001": [
    {
      payload: {
        resourceType: "Patient",
        id: "p1",
        gender: "male",
        birthDate: "1970-01-01"
      }
    },
    {
      payload: {
        resourceType: "Procedure",
        id: "proc1",
        status: "completed",
        code: { text: "Annual Physical" }
      }
    }
  ],
  "run-002": [
    {
      payload: {
        resourceType: "Patient",
        id: "p2",
        gender: "female",
        birthDate: "1985-05-15"
      }
    },
    {
      payload: {
        resourceType: "Procedure",
        id: "proc2",
        status: "in-progress",
        code: { text: "Blood Test" }
      }
    },
    {
      payload: {
        resourceType: "Observation",
        id: "obs1",
        status: "final",
        code: { text: "Blood Pressure" }
      }
    }
  ],
  "run-003": [
    {
      payload: {
        resourceType: "Patient",
        id: "p3",
        gender: "male",
        birthDate: "1990-12-31"
      }
    },
    {
      payload: {
        resourceType: "Procedure",
        id: "proc3",
        status: "completed",
        code: { text: "Vaccination" }
      }
    }
  ]
}; 