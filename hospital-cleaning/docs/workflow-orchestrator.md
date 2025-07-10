# Workflow Orchestrator

The Workflow Orchestrator is the central controller for the complete hospital data cleaning pipeline. It coordinates all stages of the IRB processing workflow from FHIR query to seed dataset creation, providing comprehensive progress tracking, error handling, and workflow management.

## Overview

The orchestrator manages the end-to-end process:

1. **IRB Submission** → Admin Review
2. **Admin Approval** → Workflow Initiation
3. **FHIR Query** → Resource Extraction
4. **Data Cleaning** → Flattening & Validation
5. **Seed Creation** → Dataset Packaging
6. **Researcher Access** → Download & Preview

## Core Components

### `orchestrateIRBWorkflow()`

The main orchestrator function that coordinates the entire pipeline:

```typescript
async function orchestrateIRBWorkflow(
  irbData: IRBExtraction,
  options: WorkflowOptions = {}
): Promise<WorkflowResult>
```

**Parameters:**
- `irbData`: Parsed IRB document data
- `options`: Configuration options for the workflow

**Returns:** Complete workflow result with progress, results, and summary

### Workflow Stages

1. **Initializing** (5%): Setup and validation
2. **FHIR Query** (10-30%): Extract resources from HAPI FHIR server
3. **Data Cleaning** (40-70%): Flatten and clean FHIR data
4. **Seed Creation** (80-95%): Package cleaned data into ZIP archive
5. **Completed** (100%): Workflow finished successfully

## Workflow Management

### Progress Tracking

Each workflow maintains detailed progress information:

```typescript
interface WorkflowProgress {
  stage: 'initializing' | 'fhir_query' | 'data_cleaning' | 'seed_creation' | 'completed' | 'failed';
  message: string;
  percentage: number;
  details?: any;
  timestamp: string;
}
```

### Workflow Results

Complete workflow results include:

```typescript
interface WorkflowResult {
  success: boolean;
  workflowId: string;
  progress: WorkflowProgress[];
  results: {
    fhirQuery: QueryResult[];
    dataCleaning: CleaningResult[];
    seedCreation: CreateSeedResult;
  };
  summary: {
    totalResources: number;
    totalCleaned: number;
    seedCreated: boolean;
    seedId?: string;
    totalTime: number;
  };
  error?: string;
}
```

## API Endpoints

### Admin Server Integration

The admin server provides workflow management endpoints:

- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get workflow details
- `GET /api/workflows/:id/status` - Get current status
- `POST /api/workflows/:id/retry` - Retry failed workflow
- `GET /api/workflows/stats` - Get workflow statistics

### Workflow Status Endpoint

```bash
GET /api/workflows/{workflowId}/status
```

**Response:**
```json
{
  "workflowId": "workflow_1703123456789_1234",
  "success": true,
  "stage": "completed",
  "message": "Workflow completed successfully in 45.23s",
  "percentage": 100,
  "timestamp": "2023-12-21T10:30:45.123Z",
  "summary": {
    "totalResources": 1500,
    "totalCleaned": 1500,
    "seedCreated": true,
    "seedId": "seed_20231221_103045",
    "totalTime": 45230
  }
}
```

## Error Handling

### Graceful Error Recovery

The orchestrator handles errors at each stage:

1. **Stage-specific error handling**: Each stage catches and reports errors
2. **Progress preservation**: Failed workflows maintain progress history
3. **Retry capability**: Failed workflows can be retried with new options
4. **Error details**: Comprehensive error information for debugging

### Error Types

- **FHIR Query Errors**: Network issues, invalid filters, server errors
- **Data Cleaning Errors**: File corruption, schema mismatches
- **Seed Creation Errors**: Disk space, permission issues
- **Workflow Errors**: Configuration problems, missing dependencies

## Configuration Options

### WorkflowOptions

```typescript
interface WorkflowOptions {
  outputDir?: string;           // FHIR data output directory
  seedOutputDir?: string;       // Seed dataset output directory
  studyTitle?: string;          // Override study title
  principalInvestigator?: string; // Override PI name
  enableProgressLogging?: boolean; // Enable detailed logging
  maxRetries?: number;          // Maximum retry attempts
}
```

### Environment Variables

- `HAPI_FHIR_BASE_URL`: HAPI FHIR server URL
- `OPENAI_API_KEY`: OpenAI API key for AI processing
- `WORKFLOW_TIMEOUT`: Maximum workflow execution time (default: 5 minutes)

## Usage Examples

### Basic Workflow Execution

```typescript
import { orchestrateIRBWorkflow } from './utils/workflowOrchestrator';

const irbData = {
  study_title: "Cardiovascular Study",
  principal_investigator: "Dr. Smith",
  resources: ["Patient", "Condition"],
  filters: { date_range: "2023-01-01 to 2024-01-01" },
  date_range: { from: "2023-01-01", to: "2024-01-01" }
};

const result = await orchestrateIRBWorkflow(irbData, {
  studyTitle: "Cardiovascular Health Study 2024",
  enableProgressLogging: true
});

if (result.success) {
  console.log(`Workflow completed: ${result.workflowId}`);
  console.log(`Seed created: ${result.summary.seedId}`);
} else {
  console.error(`Workflow failed: ${result.error}`);
}
```

### Workflow Monitoring

```typescript
import { getWorkflowStatus, getAllWorkflows } from './utils/workflowOrchestrator';

// Get specific workflow status
const workflow = getWorkflowStatus('workflow_123');
if (workflow) {
  const latestProgress = workflow.progress[workflow.progress.length - 1];
  console.log(`Stage: ${latestProgress.stage}, Progress: ${latestProgress.percentage}%`);
}

// Get all workflows
const workflows = getAllWorkflows();
const completed = workflows.filter(w => w.success);
console.log(`Completed workflows: ${completed.length}/${workflows.length}`);
```

### Workflow Retry

```typescript
import { retryWorkflow } from './utils/workflowOrchestrator';

const newWorkflow = await retryWorkflow('failed_workflow_id', {
  maxRetries: 5,
  enableProgressLogging: true
});

if (newWorkflow?.success) {
  console.log(`Retry successful: ${newWorkflow.workflowId}`);
}
```

## Testing

### End-to-End Test

Run the complete workflow test:

```bash
npm run test-end-to-end
```

This test:
1. Submits sample IRB data
2. Simulates admin approval
3. Monitors workflow progress
4. Verifies seed dataset creation
5. Tests researcher portal access
6. Validates error handling

### Individual Component Tests

```bash
npm run test-irb-parser      # Test IRB parsing
npm run test-fhir-query      # Test FHIR query engine
npm run test-cleaner         # Test data cleaning
npm run test-seed            # Test seed creation
```

## Performance Considerations

### Memory Management

- Workflows are stored in memory (consider database for production)
- Old workflows are automatically cleaned up after 24 hours
- Large datasets are processed in chunks

### Timeout Handling

- Default workflow timeout: 5 minutes
- Configurable per workflow via options
- Progress monitoring prevents hanging workflows

### Scalability

- Concurrent workflows supported
- Resource usage monitoring
- Automatic cleanup of completed workflows

## Production Deployment

### Database Integration

For production use, replace in-memory storage with a database:

```typescript
// Replace Map with database calls
const activeWorkflows: Map<string, WorkflowResult> = new Map();

// Use database instead:
async function getWorkflowStatus(workflowId: string): Promise<WorkflowResult | null> {
  return await db.workflows.findUnique({ where: { id: workflowId } });
}
```

### Monitoring & Logging

- Add structured logging (Winston, Pino)
- Integrate with monitoring systems (Prometheus, DataDog)
- Set up alerts for failed workflows

### Security

- Validate IRB data before processing
- Implement rate limiting
- Add authentication for admin endpoints
- Encrypt sensitive data in transit and at rest

## Troubleshooting

### Common Issues

1. **Workflow Timeout**: Increase timeout or optimize processing
2. **Memory Issues**: Process data in smaller chunks
3. **FHIR Server Errors**: Check server availability and credentials
4. **File Permission Errors**: Verify directory permissions

### Debug Mode

Enable detailed logging:

```typescript
const result = await orchestrateIRBWorkflow(irbData, {
  enableProgressLogging: true
});
```

### Workflow Recovery

Failed workflows can be recovered:

```typescript
// Get failed workflows
const failedWorkflows = getAllWorkflows().filter(w => !w.success);

// Retry with different options
for (const workflow of failedWorkflows) {
  await retryWorkflow(workflow.workflowId, {
    maxRetries: 3,
    enableProgressLogging: true
  });
}
```

## Integration with Other Components

### Admin Dashboard

The orchestrator integrates with the admin dashboard to:
- Display workflow progress in real-time
- Show workflow statistics and history
- Provide retry functionality for failed workflows

### Researcher Portal

Completed workflows create seed datasets accessible via:
- Seed dataset listing
- Download functionality
- CSV preview capabilities

### FHIR Query Engine

The orchestrator coordinates with the FHIR query engine to:
- Execute resource queries based on IRB filters
- Handle pagination and large result sets
- Manage query timeouts and retries

### Data Cleaning Engine

Integration with the cleaning engine provides:
- Automatic data flattening and validation
- Anomaly detection and reporting
- Cleaned data export in multiple formats

## Future Enhancements

### Planned Features

1. **Workflow Templates**: Pre-configured workflow patterns
2. **Parallel Processing**: Concurrent resource processing
3. **Incremental Updates**: Delta processing for new data
4. **Workflow Dependencies**: Multi-step workflow chains
5. **Advanced Scheduling**: Time-based workflow execution

### API Extensions

1. **Webhook Support**: Notify external systems of workflow events
2. **REST API**: Full REST API for workflow management
3. **GraphQL**: Query workflow data with GraphQL
4. **Event Streaming**: Real-time workflow event streams

The Workflow Orchestrator provides a robust, scalable foundation for hospital data cleaning workflows, with comprehensive error handling, progress tracking, and management capabilities. 