// Shared storage for IRB submissions between researcher and admin servers
// In production, this would be a database

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface IRBSubmission {
  id: string;
  researcherId: string;
  fileName: string;
  filePath: string;
  fileContent?: string; // Store the actual file content for parsing
  uploadedAt: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  workflowId?: string; // ID of the workflow created when IRB is approved
  aiReview?: {
    issues: string[];
    suggestions: string[];
    complianceScore: number;
  };
  adminReview?: {
    approved: boolean;
    feedback?: string;
    reviewedAt?: string;
  };
}

// File-based storage for sharing between servers
const STORAGE_FILE = join(process.cwd(), 'data', 'irb-submissions.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    require('fs').mkdirSync(dataDir, { recursive: true });
  }
}

// Read submissions from file
function readSubmissions(): Map<string, IRBSubmission> {
  ensureDataDir();
  
  if (!existsSync(STORAGE_FILE)) {
    return new Map();
  }
  
  try {
    const data = readFileSync(STORAGE_FILE, 'utf-8');
    const submissions = JSON.parse(data);
    return new Map(Object.entries(submissions));
  } catch (error) {
    console.error('Error reading IRB submissions:', error);
    return new Map();
  }
}

// Write submissions to file
function writeSubmissions(submissions: Map<string, IRBSubmission>) {
  ensureDataDir();
  
  try {
    const data = Object.fromEntries(submissions);
    writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing IRB submissions:', error);
  }
}

// Helper function to generate unique IRB ID
export function generateIRBId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `irb_${timestamp}_${random}`;
}

// CRUD operations
export function createIRBSubmission(submission: IRBSubmission): void {
  const submissions = readSubmissions();
  submissions.set(submission.id, submission);
  writeSubmissions(submissions);
}

export function getIRBSubmission(id: string): IRBSubmission | null {
  const submissions = readSubmissions();
  return submissions.get(id) || null;
}

export function getAllIRBSubmissions(): IRBSubmission[] {
  const submissions = readSubmissions();
  return Array.from(submissions.values())
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export function getIRBSubmissionsByResearcher(researcherId: string): IRBSubmission[] {
  const submissions = readSubmissions();
  return Array.from(submissions.values())
    .filter(s => s.researcherId === researcherId)
    .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export function updateIRBSubmission(id: string, updates: Partial<IRBSubmission>): boolean {
  const submissions = readSubmissions();
  const submission = submissions.get(id);
  if (!submission) {
    return false;
  }
  
  submissions.set(id, { ...submission, ...updates });
  writeSubmissions(submissions);
  return true;
}

export function deleteIRBSubmission(id: string): boolean {
  const submissions = readSubmissions();
  const deleted = submissions.delete(id);
  if (deleted) {
    writeSubmissions(submissions);
  }
  return deleted;
}

// Statistics
export function getIRBStats() {
  const submissions = getAllIRBSubmissions();
  return {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'submitted').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
    draft: submissions.filter(s => s.status === 'draft').length
  };
}

// Function to get seed dataset ID for an IRB submission
export function getSeedDatasetIdForIRB(irbId: string): string | null {
  const submission = getIRBSubmission(irbId);
  console.log(`🔍 Looking for dataset for IRB: ${irbId}`);
  console.log(`📄 IRB submission:`, submission);
  
  if (!submission) {
    console.log(`❌ No IRB submission found for ID: ${irbId}`);
    return null;
  }
  
  if (!submission.workflowId) {
    console.log(`❌ No workflow ID found for IRB: ${irbId}`);
    return null;
  }
  
  console.log(`🔗 IRB ${irbId} has workflow ID: ${submission.workflowId}`);
  
  // Import workflow functions dynamically to avoid circular dependencies
  try {
    const { getWorkflowStatus, getAllWorkflows } = require('./workflowOrchestrator');
    
    // Debug: List all available workflows
    const allWorkflows = getAllWorkflows();
    console.log(`📋 Available workflows (${allWorkflows.length}):`);
    allWorkflows.forEach((w: any) => {
      console.log(`  - ${w.workflowId}: success=${w.success}, seedId=${w.summary.seedId}`);
    });
    
    // Debug: Check workflow file directly
    const workflowFile = join(process.cwd(), 'data', 'workflows.json');
    if (existsSync(workflowFile)) {
      const workflowData = readFileSync(workflowFile, 'utf8');
      const workflowsFromFile = JSON.parse(workflowData);
      console.log(`📁 Workflows in file (${workflowsFromFile.length}):`);
      workflowsFromFile.forEach((w: any) => {
        console.log(`  - ${w.workflowId}: success=${w.success}, seedId=${w.summary.seedId}`);
      });
      
      // Look for the specific workflow in the file
      const targetWorkflow = workflowsFromFile.find((w: any) => w.workflowId === submission.workflowId);
      if (targetWorkflow) {
        console.log(`🎯 Found target workflow in file: ${targetWorkflow.workflowId}`);
        console.log(`📊 Workflow success: ${targetWorkflow.success}`);
        console.log(`📦 Workflow seed ID: ${targetWorkflow.summary.seedId}`);
        
        if (targetWorkflow.success && targetWorkflow.summary.seedId) {
          console.log(`✅ Found seed dataset ID from file: ${targetWorkflow.summary.seedId}`);
          return targetWorkflow.summary.seedId;
        }
      } else {
        console.log(`❌ Target workflow ${submission.workflowId} not found in file`);
      }
    } else {
      console.log(`❌ No workflow file found at: ${workflowFile}`);
    }
    
    const workflow = getWorkflowStatus(submission.workflowId);
    
    console.log(`⚙️ Workflow found:`, workflow ? 'Yes' : 'No');
    if (workflow) {
      console.log(`📊 Workflow success: ${workflow.success}`);
      console.log(`📦 Workflow seed ID: ${workflow.summary.seedId}`);
    }
    
    if (workflow && workflow.success && workflow.summary.seedId) {
      console.log(`✅ Found seed dataset ID: ${workflow.summary.seedId}`);
      return workflow.summary.seedId;
    }
  } catch (error) {
    console.error('Error getting seed dataset ID for IRB:', error);
  }
  
  // Fallback: try to find dataset by matching IRB filename with dataset metadata
  try {
    const { getAllSeedDatasets } = require('./seedDatasetCreator');
    const allDatasets = getAllSeedDatasets();
    
    console.log(`🔍 Checking ${allDatasets.length} available datasets for IRB match...`);
    
    // Try to match by IRB filename or study title
    const irbFileName = submission.fileName.replace(/\.[^/.]+$/, ""); // Remove extension
    const matchingDataset = allDatasets.find((dataset: any) => {
      const datasetTitle = dataset.studyTitle.toLowerCase();
      const irbName = irbFileName.toLowerCase();
      
      // Check if dataset title contains IRB filename or vice versa
      return datasetTitle.includes(irbName) || irbName.includes(datasetTitle) ||
             dataset.metadata?.irbData?.study_title?.toLowerCase().includes(irbName);
    });
    
    if (matchingDataset) {
      console.log(`✅ Found matching dataset by name: ${matchingDataset.id}`);
      return matchingDataset.id;
    }
    
    console.log(`❌ No matching dataset found for IRB: ${irbId}`);
  } catch (error) {
    console.error('Error in fallback dataset search:', error);
  }
  
  return null;
} 