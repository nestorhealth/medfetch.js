import { IRBExtraction } from './aiProcessing';
import { buildFHIRQueries, executeFHIRQueries, FHIRQuerySummary } from './dynamicFhirQueryHapi';
import { cleanAllFHIRData, CleaningResult } from './fhirDataCleaner';
import { createSeedDataset, CreateSeedResult } from './seedDatasetCreator';
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';

// QueryResult type for compatibility with existing workflow structure
interface QueryResult {
  resourceType: string;
  success: boolean;
  totalResources: number;
  fileName: string;
  error?: string;
}

// Workflow Orchestrator Types
export interface WorkflowProgress {
  stage: 'initializing' | 'fhir_query' | 'data_cleaning' | 'seed_creation' | 'completed' | 'failed';
  message: string;
  percentage: number;
  details?: any;
  timestamp: string;
}

export interface WorkflowResult {
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
  enableProgressLogging?: boolean;
}

export interface WorkflowOptions {
  outputDir?: string;
  seedOutputDir?: string;
  studyTitle?: string;
  principalInvestigator?: string;
  enableProgressLogging?: boolean;
  maxRetries?: number;
}

// In-memory storage for active workflows
const activeWorkflows: Map<string, WorkflowResult> = new Map();

// File-based storage for workflow persistence
const WORKFLOW_STORAGE_FILE = join(process.cwd(), 'data', 'workflows.json');

// Ensure data directory exists
function ensureDataDirectory(): void {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
}

// Save workflows to file
function saveWorkflowsToFile(): void {
  try {
    ensureDataDirectory();
    const workflows = Array.from(activeWorkflows.values());
    writeFileSync(WORKFLOW_STORAGE_FILE, JSON.stringify(workflows, null, 2));
  } catch (error) {
    console.error('Error saving workflows to file:', error);
  }
}

// Load workflows from file
function loadWorkflowsFromFile(): void {
  try {
    if (existsSync(WORKFLOW_STORAGE_FILE)) {
      const data = readFileSync(WORKFLOW_STORAGE_FILE, 'utf8');
      const workflows: WorkflowResult[] = JSON.parse(data);
      
      console.log(`📂 Found ${workflows.length} workflows in storage file`);
      
      // Only load workflows from the last 24 hours
      const cutoffTime = Date.now() - (24 * 60 * 60 * 1000);
      const recentWorkflows = workflows.filter(w => {
        const firstProgress = w.progress[0];
        return firstProgress && new Date(firstProgress.timestamp).getTime() > cutoffTime;
      });
      
      console.log(`📂 Loading ${recentWorkflows.length} recent workflows (within 24 hours)`);
      
      recentWorkflows.forEach(workflow => {
        activeWorkflows.set(workflow.workflowId, workflow);
        console.log(`  - Loaded workflow: ${workflow.workflowId} (success: ${workflow.success}, seedId: ${workflow.summary.seedId})`);
      });
      
      console.log(`📂 Loaded ${recentWorkflows.length} recent workflows from storage`);
    } else {
      console.log(`📂 No workflow storage file found at: ${WORKFLOW_STORAGE_FILE}`);
    }
  } catch (error) {
    console.error('Error loading workflows from file:', error);
  }
}

// Load workflows on startup
loadWorkflowsFromFile();

// Helper function to generate workflow ID
function generateWorkflowId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `workflow_${timestamp}_${random}`;
}

// Helper function to add progress update
function addProgress(
  workflow: WorkflowResult,
  stage: WorkflowProgress['stage'],
  message: string,
  percentage: number,
  details?: any
): void {
  const progress: WorkflowProgress = {
    stage,
    message,
    percentage,
    details,
    timestamp: new Date().toISOString()
  };
  
  workflow.progress.push(progress);
  
  if (workflow.enableProgressLogging) {
    console.log(`📊 [${workflow.workflowId}] ${stage}: ${message} (${percentage}%)`);
  }
  
  // Save workflows to file whenever progress is updated
  saveWorkflowsToFile();
}

// Helper function to handle errors gracefully
function handleError(workflow: WorkflowResult, error: any, stage: string): void {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[${workflow.workflowId}] Error in ${stage}:`, error);
  
  addProgress(workflow, 'failed', `Failed at ${stage}: ${errorMessage}`, 0, { error: errorMessage });
  workflow.success = false;
  workflow.error = errorMessage;
}

// Main workflow orchestrator function
export async function orchestrateIRBWorkflow(
  irbData: IRBExtraction,
  options: WorkflowOptions = {}
): Promise<WorkflowResult> {
  const startTime = Date.now();
  const workflowId = generateWorkflowId();
  
  // Initialize workflow result
  const workflow: WorkflowResult = {
    success: false,
    workflowId,
    progress: [],
    results: {
      fhirQuery: [],
      dataCleaning: [],
      seedCreation: { success: false, seedId: '', filePath: '', fileSize: 0 }
    },
    summary: {
      totalResources: 0,
      totalCleaned: 0,
      seedCreated: false,
      totalTime: 0
    },
    enableProgressLogging: options.enableProgressLogging ?? true
  };
  
  // Store workflow in memory
  activeWorkflows.set(workflowId, workflow);
  
  try {
    console.log(`🚀 Starting IRB Workflow: ${workflowId}`);
    console.log(`📋 Study: ${irbData.study_title || 'Research Study'}`);
    console.log(`👨‍⚕️ PI: ${irbData.principal_investigator || 'Dr. Researcher'}`);
    
    // Initialize progress
    addProgress(workflow, 'initializing', 'Initializing workflow', 5, { irbData });
    
    // Set default options
    const config: Required<WorkflowOptions> = {
      outputDir: options.outputDir || 'fhir-data',
      seedOutputDir: options.seedOutputDir || 'public/seeds',
      studyTitle: options.studyTitle || irbData.study_title || 'Research Study',
      principalInvestigator: options.principalInvestigator || irbData.principal_investigator || 'Dr. Researcher',
      enableProgressLogging: options.enableProgressLogging ?? true,
      maxRetries: options.maxRetries || 3
    };
    
    // Stage 1: Dynamic FHIR Query
    addProgress(workflow, 'fhir_query', 'Building dynamic FHIR queries from IRB content', 10);
    
    let dynamicQuerySummary: FHIRQuerySummary;
    
    try {
      console.log(`🔍 Stage 1: Building dynamic FHIR queries from IRB content...`);
      
      // Build dynamic queries from IRB extraction
      const dynamicQueries = buildFHIRQueries(irbData);
      addProgress(workflow, 'fhir_query', `Built ${dynamicQueries.length} dynamic queries`, 15, { queries: dynamicQueries });
      
      // Execute dynamic queries
      console.log(`🚀 Executing ${dynamicQueries.length} dynamic FHIR queries...`);
      dynamicQuerySummary = await executeFHIRQueries(dynamicQueries);
      
      // Convert dynamic query results to the expected format for compatibility
      const fhirResults: QueryResult[] = Object.entries(dynamicQuerySummary.resourceBreakdown).map(([resourceType, count]) => ({
        resourceType,
        success: true,
        totalResources: count as number,
        fileName: `${resourceType}_raw.json`
      }));
      
      // Add failed queries as error results
      dynamicQuerySummary.errors.forEach((error: string) => {
        const resourceType = error.split(':')[0];
        fhirResults.push({
          resourceType,
          success: false,
          totalResources: 0,
          fileName: `${resourceType}_raw.json`,
          error: error.split(':')[1]?.trim() || error
        });
      });
      
      workflow.results.fhirQuery = fhirResults;
      
      const successCount = fhirResults.filter(r => r.success).length;
      const totalResources = fhirResults.reduce((sum, r) => sum + r.totalResources, 0);
      
      addProgress(workflow, 'fhir_query', 
        `Dynamic FHIR query completed: ${successCount}/${fhirResults.length} resource types successful (${totalResources} total resources)`, 
        30, 
        { 
          successCount, 
          totalResources, 
          results: fhirResults,
          dynamicQuerySummary,
          queries: dynamicQueries
        }
      );
      
      workflow.summary.totalResources = totalResources;
      
      if (successCount === 0) {
        throw new Error('No FHIR resources were successfully fetched with dynamic queries');
      }
      
      console.log(`✅ Dynamic FHIR querying completed successfully!`);
      console.log(`📊 Query Summary:`);
      console.log(`   - Total queries: ${dynamicQuerySummary.totalQueries}`);
      console.log(`   - Successful queries: ${dynamicQuerySummary.successfulQueries}`);
      console.log(`   - Total resources: ${dynamicQuerySummary.totalResources}`);
      console.log(`   - Execution time: ${dynamicQuerySummary.executionTime}ms`);
      console.log(`   - Resource breakdown:`, dynamicQuerySummary.resourceBreakdown);
      
    } catch (error) {
      handleError(workflow, error, 'Dynamic FHIR Query');
      return workflow;
    }
    
    // Stage 2: Save fetched FHIR data to files for cleaning
    addProgress(workflow, 'data_cleaning', 'Saving fetched FHIR data to files', 40);
    
    try {
      console.log(`💾 Stage 2: Saving fetched FHIR data to files...`);
      
      // Ensure output directory exists
      if (!existsSync(config.outputDir)) {
        mkdirSync(config.outputDir, { recursive: true });
      }
      
      // Clear old files to ensure we only process the new data
      console.log(`🧹 Clearing old files from ${config.outputDir}...`);
      const oldFiles = readdirSync(config.outputDir).filter((file: string) => file.endsWith('_raw.json'));
      for (const oldFile of oldFiles) {
        const oldFilePath = join(config.outputDir, oldFile);
        unlinkSync(oldFilePath);
        console.log(`🗑️ Removed old file: ${oldFile}`);
      }
      
      // Save each resource type's data to a file
      const savedFiles: string[] = [];
      for (const queryResult of dynamicQuerySummary.results) {
        if (queryResult.success && queryResult.resources.length > 0) {
          const fileName = `${queryResult.resourceType}_raw.json`;
          const filePath = join(config.outputDir, fileName);
          
          const fileData = {
            resourceType: queryResult.resourceType,
            resources: queryResult.resources,
            queryParams: queryResult.queryParams,
            executionTime: queryResult.executionTime
          };
          
          writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
          savedFiles.push(filePath);
          console.log(`💾 Saved ${queryResult.resources.length} ${queryResult.resourceType} resources to ${filePath}`);
        }
      }
      
      if (savedFiles.length === 0) {
        throw new Error('No FHIR data files were saved for cleaning');
      }
      
      addProgress(workflow, 'data_cleaning', `Saved ${savedFiles.length} FHIR data files`, 50);
      
      // Now clean the saved files
      console.log(`🧹 Stage 2b: Cleaning FHIR data from saved files...`);
      const cleaningResults = await cleanAllFHIRData(config.outputDir, 'cleaned-data');
      workflow.results.dataCleaning = cleaningResults;
      
      const cleaningSuccessCount = cleaningResults.filter(r => r.success).length;
      const totalCleaned = cleaningResults.reduce((sum, r) => sum + r.cleanedCount, 0);
      
      addProgress(workflow, 'data_cleaning', 
        `Data cleaning completed: ${cleaningSuccessCount}/${cleaningResults.length} files successful`, 
        70, 
        { cleaningSuccessCount, totalCleaned, results: cleaningResults }
      );
      
      workflow.summary.totalCleaned = totalCleaned;
      
      if (cleaningSuccessCount === 0) {
        throw new Error('No data files were successfully cleaned');
      }
      
    } catch (error) {
      handleError(workflow, error, 'Data Cleaning');
      return workflow;
    }
    
    // Stage 3: Seed Dataset Creation
    addProgress(workflow, 'seed_creation', 'Creating seed dataset bundle', 80);
    
    try {
      console.log(`📦 Stage 3: Creating seed dataset...`);
      const seedResult = await createSeedDataset(
        'cleaned-data',
        config.studyTitle,
        config.principalInvestigator,
        {
          irbData,
          fhirQuery: workflow.results.fhirQuery,
          dataCleaning: workflow.results.dataCleaning
        }
      );
      
      workflow.results.seedCreation = seedResult;
      
      if (seedResult.success) {
        addProgress(workflow, 'seed_creation', 
          `Seed dataset created successfully: ${seedResult.seedId}`, 
          95, 
          { seedId: seedResult.seedId, fileSize: seedResult.fileSize }
        );
        
        workflow.summary.seedCreated = true;
        workflow.summary.seedId = seedResult.seedId;
        
      } else {
        throw new Error(`Failed to create seed dataset: ${seedResult.error}`);
      }
      
    } catch (error) {
      handleError(workflow, error, 'Seed Creation');
      return workflow;
    }
    
    // Workflow completed successfully
    const totalTime = Date.now() - startTime;
    workflow.summary.totalTime = totalTime;
    
    addProgress(workflow, 'completed', 
      `Workflow completed successfully in ${(totalTime / 1000).toFixed(2)}s`, 
      100, 
      { 
        totalTime,
        totalResources: workflow.summary.totalResources,
        totalCleaned: workflow.summary.totalCleaned,
        seedId: workflow.summary.seedId
      }
    );
    
    workflow.success = true;
    
    // Ensure the final success state is saved to file
    saveWorkflowsToFile();
    
    console.log(`✅ Workflow ${workflowId} completed successfully!`);
    console.log(`📊 Summary:`);
    console.log(`   - Total resources: ${workflow.summary.totalResources}`);
    console.log(`   - Total cleaned: ${workflow.summary.totalCleaned}`);
    console.log(`   - Seed created: ${workflow.summary.seedCreated}`);
    console.log(`   - Seed ID: ${workflow.summary.seedId}`);
    console.log(`   - Total time: ${(totalTime / 1000).toFixed(2)}s`);
    
    return workflow;
    
  } catch (error) {
    handleError(workflow, error, 'Workflow Orchestration');
    return workflow;
  }
}

// Function to get workflow status
export function getWorkflowStatus(workflowId: string): WorkflowResult | null {
  return activeWorkflows.get(workflowId) || null;
}

// Function to get all active workflows
export function getAllWorkflows(): WorkflowResult[] {
  return Array.from(activeWorkflows.values()).sort((a, b) => 
    new Date(b.progress[0]?.timestamp || '0').getTime() - 
    new Date(a.progress[0]?.timestamp || '0').getTime()
  );
}

// Function to get workflow statistics
export function getWorkflowStats() {
  const workflows = getAllWorkflows();
  const completed = workflows.filter(w => w.success);
  const failed = workflows.filter(w => !w.success);
  const totalResources = workflows.reduce((sum, w) => sum + w.summary.totalResources, 0);
  const totalCleaned = workflows.reduce((sum, w) => sum + w.summary.totalCleaned, 0);
  
  return {
    totalWorkflows: workflows.length,
    completedWorkflows: completed.length,
    failedWorkflows: failed.length,
    successRate: workflows.length > 0 ? (completed.length / workflows.length * 100).toFixed(1) : '0',
    totalResources,
    totalCleaned,
    averageTime: workflows.length > 0 ? 
      (workflows.reduce((sum, w) => sum + w.summary.totalTime, 0) / workflows.length / 1000).toFixed(2) : '0'
  };
}

// Function to clean up old workflows (older than 24 hours)
export function cleanupOldWorkflows(): number {
  const cutoffTime = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
  let cleanedCount = 0;
  
  for (const [workflowId, workflow] of Array.from(activeWorkflows.entries())) {
    const firstProgress = workflow.progress[0];
    if (firstProgress && new Date(firstProgress.timestamp).getTime() < cutoffTime) {
      activeWorkflows.delete(workflowId);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 Cleaned up ${cleanedCount} old workflows`);
  }
  
  return cleanedCount;
}

// Function to retry a failed workflow
export async function retryWorkflow(
  workflowId: string,
  options: WorkflowOptions = {}
): Promise<WorkflowResult | null> {
  const originalWorkflow = getWorkflowStatus(workflowId);
  
  if (!originalWorkflow) {
    throw new Error(`Workflow ${workflowId} not found`);
  }
  
  if (originalWorkflow.success) {
    throw new Error(`Workflow ${workflowId} was successful, no retry needed`);
  }
  
  // Extract IRB data from the original workflow
  const irbData = originalWorkflow.progress[0]?.details?.irbData;
  if (!irbData) {
    throw new Error('No IRB data found in original workflow');
  }
  
  console.log(`🔄 Retrying workflow: ${workflowId}`);
  
  // Run the workflow again
  return await orchestrateIRBWorkflow(irbData, options);
}

// Auto-cleanup every hour
setInterval(() => {
  cleanupOldWorkflows();
}, 60 * 60 * 1000); // 1 hour

// Function to force reload workflows from file
export function reloadWorkflowsFromFile(): void {
  console.log('🔄 Force reloading workflows from file...');
  activeWorkflows.clear();
  loadWorkflowsFromFile();
} 