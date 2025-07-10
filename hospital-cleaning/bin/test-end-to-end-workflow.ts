#!/usr/bin/env tsx

/**
 * End-to-End IRB Workflow Test
 * 
 * This script demonstrates the complete hospital data cleaning workflow:
 * 1. Submit IRB data to admin server
 * 2. Simulate admin approval
 * 3. Monitor workflow progress
 * 4. Verify seed dataset creation
 * 5. Test researcher portal access
 */

import axios from 'axios';
import { IRBExtraction } from '../utils/aiProcessing';

// Configuration
const ADMIN_SERVER_URL = 'http://localhost:3001';
const RESEARCHER_SERVER_URL = 'http://localhost:3002';

// Sample IRB data for testing
const sampleIRBData: IRBExtraction = {
  study_title: "Cardiovascular Health Study 2024",
  principal_investigator: "Dr. Sarah Johnson",
  resources: ["Patient", "Condition", "Encounter"],
  filters: {
    age_range: "18-85"
  },
  date_range: {
    from: "2023-01-01",
    to: "2024-12-31"
  },
  target_patient_count: 1000,
  additional_notes: "Observational study focusing on cardiovascular health outcomes",
  fhir_queries: [
    {
      resourceType: "Patient",
      filters: { active: true },
      count: 1000,
      priority: "high",
      reasoning: "Primary patient population for cardiovascular study"
    },
    {
      resourceType: "Condition",
      filters: { "clinical-status": "active" },
      count: 2000,
      priority: "high",
      reasoning: "Study requires condition data for cardiovascular analysis"
    },
    {
      resourceType: "Encounter",
      filters: { status: "finished" },
      count: 1500,
      priority: "medium",
      reasoning: "Study may require encounter data for context"
    }
  ],
  patient_criteria: {
    age_range: { min: 18, max: 85 },
    gender: ["male", "female"],
    conditions: ["I10", "I25.10", "E11.9"], // Hypertension, CAD, Diabetes
    encounter_types: ["outpatient", "inpatient"]
  },
  data_requirements: {
    minimum_records: 100,
    preferred_records: 1000,
    data_quality_requirements: ["Complete patient demographics", "Valid medical codes"],
    privacy_considerations: ["HIPAA compliance", "Data anonymization"]
  }
};

// Utility functions
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function log(message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info'): void {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type];
  
  console.log(`${emoji} [${timestamp}] ${message}`);
}

// Test functions
async function testIRBSubmission(): Promise<boolean> {
  try {
    log('Submitting IRB data to admin server...');
    
    const response = await axios.post(`${ADMIN_SERVER_URL}/submit-irb`, sampleIRBData);
    
    if (response.data.success) {
      log('IRB data submitted successfully', 'success');
      return true;
    } else {
      log('Failed to submit IRB data', 'error');
      return false;
    }
  } catch (error) {
    log(`Error submitting IRB data: ${error}`, 'error');
    return false;
  }
}

async function testAdminApproval(): Promise<string | null> {
  try {
    log('Simulating admin approval...');
    
    const response = await axios.post(`${ADMIN_SERVER_URL}/start-query`, {
      action: 'approve',
      comment: 'Approved for research use. Data looks good for cardiovascular study.',
      irbData: sampleIRBData
    });
    
    if (response.data.success) {
      const workflowId = response.data.workflowId;
      log(`Workflow approved and started: ${workflowId}`, 'success');
      log(`Summary: ${response.data.summary.totalResources} resources → ${response.data.summary.totalCleaned} cleaned → Seed: ${response.data.summary.seedId}`, 'info');
      return workflowId;
    } else {
      log(`Workflow failed: ${response.data.error}`, 'error');
      return null;
    }
  } catch (error) {
    log(`Error during admin approval: ${error}`, 'error');
    return null;
  }
}

async function monitorWorkflowProgress(workflowId: string, maxWaitTime: number = 300000): Promise<boolean> {
  const startTime = Date.now();
  let lastPercentage = 0;
  
  log(`Monitoring workflow progress: ${workflowId}`);
  
  while (Date.now() - startTime < maxWaitTime) {
    try {
      const response = await axios.get(`${ADMIN_SERVER_URL}/api/workflows/${workflowId}/status`);
      const status = response.data;
      
      if (status.percentage > lastPercentage) {
        log(`Progress: ${status.stage} - ${status.message} (${status.percentage}%)`, 'info');
        lastPercentage = status.percentage;
      }
      
      if (status.success) {
        log(`Workflow completed successfully!`, 'success');
        log(`Final summary:`, 'info');
        log(`  - Total resources: ${status.summary.totalResources}`, 'info');
        log(`  - Total cleaned: ${status.summary.totalCleaned}`, 'info');
        log(`  - Seed created: ${status.summary.seedCreated}`, 'info');
        log(`  - Seed ID: ${status.summary.seedId}`, 'info');
        log(`  - Total time: ${(status.summary.totalTime / 1000).toFixed(2)}s`, 'info');
        return true;
      }
      
      if (status.stage === 'failed') {
        log(`Workflow failed: ${status.message}`, 'error');
        return false;
      }
      
      // Wait before checking again
      await sleep(2000);
      
    } catch (error) {
      log(`Error monitoring workflow: ${error}`, 'error');
      return false;
    }
  }
  
  log('Workflow monitoring timed out', 'warning');
  return false;
}

async function testWorkflowManagement(): Promise<void> {
  try {
    log('Testing workflow management endpoints...');
    
    // Get all workflows
    const workflowsResponse = await axios.get(`${ADMIN_SERVER_URL}/api/workflows`);
    log(`Found ${workflowsResponse.data.workflows.length} workflows`, 'info');
    
    // Get workflow statistics
    const statsResponse = await axios.get(`${ADMIN_SERVER_URL}/api/workflows/stats`);
    const stats = statsResponse.data.stats;
    log(`Workflow Statistics:`, 'info');
    log(`  - Total workflows: ${stats.totalWorkflows}`, 'info');
    log(`  - Completed: ${stats.completedWorkflows}`, 'info');
    log(`  - Failed: ${stats.failedWorkflows}`, 'info');
    log(`  - Success rate: ${stats.successRate}%`, 'info');
    log(`  - Total resources processed: ${stats.totalResources}`, 'info');
    log(`  - Total cleaned: ${stats.totalCleaned}`, 'info');
    log(`  - Average time: ${stats.averageTime}s`, 'info');
    
  } catch (error) {
    log(`Error testing workflow management: ${error}`, 'error');
  }
}

async function testResearcherPortal(): Promise<void> {
  try {
    log('Testing researcher portal...');
    
    // Get available seed datasets
    const response = await axios.get(`${RESEARCHER_SERVER_URL}/api/seeds`);
    
    if (response.data.success) {
      const seeds = response.data.seeds;
      log(`Found ${seeds.length} available seed datasets`, 'success');
      
      for (const seed of seeds) {
        log(`Seed: ${seed.seedId}`, 'info');
        log(`  - Title: ${seed.metadata.study_title}`, 'info');
        log(`  - PI: ${seed.metadata.principal_investigator}`, 'info');
        log(`  - Created: ${seed.metadata.created_at}`, 'info');
        log(`  - Size: ${(seed.fileSize / 1024 / 1024).toFixed(2)} MB`, 'info');
        log(`  - Files: ${seed.files.join(', ')}`, 'info');
      }
      
      // Test downloading a seed dataset
      if (seeds.length > 0) {
        const firstSeed = seeds[0];
        log(`Testing download for seed: ${firstSeed.seedId}`, 'info');
        
        const downloadResponse = await axios.get(`${RESEARCHER_SERVER_URL}/api/seeds/${firstSeed.seedId}/download`, {
          responseType: 'stream'
        });
        
        log(`Download response status: ${downloadResponse.status}`, 'success');
        log(`Content-Type: ${downloadResponse.headers['content-type']}`, 'info');
      }
      
    } else {
      log('Failed to get seed datasets', 'error');
    }
    
  } catch (error) {
    log(`Error testing researcher portal: ${error}`, 'error');
  }
}

async function testErrorHandling(): Promise<void> {
  try {
    log('Testing error handling...');
    
    // Test with invalid workflow ID
    try {
      await axios.get(`${ADMIN_SERVER_URL}/api/workflows/invalid-id`);
    } catch (error: any) {
      if (error.response?.status === 404) {
        log('Correctly handled invalid workflow ID', 'success');
      } else {
        log('Unexpected error for invalid workflow ID', 'error');
      }
    }
    
    // Test retry with non-existent workflow
    try {
      await axios.post(`${ADMIN_SERVER_URL}/api/workflows/invalid-id/retry`, { options: {} });
    } catch (error: any) {
      if (error.response?.status === 500) {
        log('Correctly handled retry of non-existent workflow', 'success');
      } else {
        log('Unexpected error for retry of non-existent workflow', 'error');
      }
    }
    
  } catch (error) {
    log(`Error in error handling test: ${error}`, 'error');
  }
}

// Main test runner
async function runEndToEndTest(): Promise<void> {
  log('🚀 Starting End-to-End IRB Workflow Test', 'info');
  log('==========================================', 'info');
  
  // Check if servers are running
  try {
    await axios.get(`${ADMIN_SERVER_URL}/health`);
    log('Admin server is running', 'success');
  } catch (error) {
    log('Admin server is not running. Please start it first: npm run admin-server', 'error');
    return;
  }
  
  try {
    await axios.get(`${RESEARCHER_SERVER_URL}/health`);
    log('Researcher server is running', 'success');
  } catch (error) {
    log('Researcher server is not running. Please start it first: npm run researcher-server', 'error');
    return;
  }
  
  // Run tests
  const results = {
    irbSubmission: false,
    adminApproval: false,
    workflowProgress: false,
    workflowManagement: false,
    researcherPortal: false,
    errorHandling: false
  };
  
  // Test 1: IRB Submission
  results.irbSubmission = await testIRBSubmission();
  if (!results.irbSubmission) {
    log('IRB submission failed, stopping test', 'error');
    return;
  }
  
  await sleep(1000);
  
  // Test 2: Admin Approval
  const workflowId = await testAdminApproval();
  if (!workflowId) {
    log('Admin approval failed, stopping test', 'error');
    return;
  }
  results.adminApproval = true;
  
  // Test 3: Monitor Workflow Progress
  results.workflowProgress = await monitorWorkflowProgress(workflowId);
  
  await sleep(2000);
  
  // Test 4: Workflow Management
  await testWorkflowManagement();
  results.workflowManagement = true;
  
  await sleep(1000);
  
  // Test 5: Researcher Portal
  await testResearcherPortal();
  results.researcherPortal = true;
  
  await sleep(1000);
  
  // Test 6: Error Handling
  await testErrorHandling();
  results.errorHandling = true;
  
  // Final results
  log('==========================================', 'info');
  log('🎯 End-to-End Test Results:', 'info');
  log(`IRB Submission: ${results.irbSubmission ? '✅ PASS' : '❌ FAIL'}`, results.irbSubmission ? 'success' : 'error');
  log(`Admin Approval: ${results.adminApproval ? '✅ PASS' : '❌ FAIL'}`, results.adminApproval ? 'success' : 'error');
  log(`Workflow Progress: ${results.workflowProgress ? '✅ PASS' : '❌ FAIL'}`, results.workflowProgress ? 'success' : 'error');
  log(`Workflow Management: ${results.workflowManagement ? '✅ PASS' : '❌ FAIL'}`, results.workflowManagement ? 'success' : 'error');
  log(`Researcher Portal: ${results.researcherPortal ? '✅ PASS' : '❌ FAIL'}`, results.researcherPortal ? 'success' : 'error');
  log(`Error Handling: ${results.errorHandling ? '✅ PASS' : '❌ FAIL'}`, results.errorHandling ? 'success' : 'error');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  log(`Overall: ${passedTests}/${totalTests} tests passed`, passedTests === totalTests ? 'success' : 'warning');
  
  if (passedTests === totalTests) {
    log('🎉 All tests passed! The end-to-end workflow is working correctly.', 'success');
  } else {
    log('⚠️ Some tests failed. Please check the logs above for details.', 'warning');
  }
}

// Run the test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEndToEndTest().catch(error => {
    log(`Fatal error in end-to-end test: ${error}`, 'error');
    process.exit(1);
  });
} 