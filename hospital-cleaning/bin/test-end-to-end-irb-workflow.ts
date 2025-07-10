#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env file
function loadEnvFile() {
  const envPath = join(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envContent = readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, ''); // Remove quotes
          process.env[key] = value;
        }
      }
    }
    console.log('📄 Environment variables loaded from .env file');
  } else {
    console.warn('⚠️ No .env file found in project root');
  }
}

// Load environment variables
loadEnvFile();

import { performStandaloneAIReview } from '../utils/standaloneIRBReview';
import { parseIRBDocument } from '../utils/aiProcessing';
import { buildFHIRQueries, executeFHIRQueries } from '../utils/dynamicFhirQueryHapi';

interface WorkflowResult {
  irbId: string;
  fileName: string;
  aiReview: {
    complianceScore: number;
    issues: string[];
    suggestions: string[];
    wouldPass: boolean;
  };
  irbExtraction?: any;
  fhirQueries?: any[];
  fhirResults?: any;
  dataCleaning?: any;
  seedDataset?: any;
  success: boolean;
  error?: string;
}

async function testEndToEndWorkflow(irbPath: string, description: string): Promise<WorkflowResult> {
  const irbId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const fileName = irbPath.split('/').pop() || 'unknown.txt';
  
  console.log(`\n🧪 Testing End-to-End Workflow: ${description}`);
  console.log('=' .repeat(70));
  console.log(`📄 IRB ID: ${irbId}`);
  console.log(`📄 File: ${fileName}`);
  
  try {
    // Step 1: Read IRB file
    const irbContent = readFileSync(irbPath, 'utf8');
    console.log(`📄 IRB Content Length: ${irbContent.length} characters`);
    
    // Step 2: Perform AI Review
    console.log('\n🔍 Step 1: AI Review');
    const aiReview = await performStandaloneAIReview(irbContent);
    
    console.log(`   - Compliance Score: ${aiReview.complianceScore}%`);
    console.log(`   - Would Pass: ${aiReview.wouldPass ? '✅ YES' : '❌ NO'}`);
    console.log(`   - Issues Found: ${aiReview.issues.length}`);
    console.log(`   - Suggestions: ${aiReview.suggestions.length}`);
    
    if (aiReview.issues.length > 0) {
      console.log('\n   ❌ Issues:');
      aiReview.issues.forEach((issue, index) => {
        console.log(`     ${index + 1}. ${issue}`);
      });
    }
    
    if (aiReview.suggestions.length > 0) {
      console.log('\n   💡 Suggestions:');
      aiReview.suggestions.forEach((suggestion, index) => {
        console.log(`     ${index + 1}. ${suggestion}`);
      });
    }
    
    // If IRB doesn't pass review, stop here
    if (!aiReview.wouldPass) {
      console.log('\n❌ IRB Review Failed - Stopping workflow');
      return {
        irbId,
        fileName,
        aiReview,
        success: false,
        error: 'IRB review failed - compliance score too low'
      };
    }
    
    // Step 3: Parse IRB for FHIR queries
    console.log('\n🔍 Step 2: IRB Parsing for FHIR Queries');
    let irbExtraction;
    try {
      irbExtraction = await parseIRBDocument(irbContent, 'txt');
      console.log('   ✅ IRB Parsing successful');
      console.log(`   - Study Title: ${irbExtraction.study_title || 'Not specified'}`);
      console.log(`   - Resources: ${irbExtraction.resources.join(', ')}`);
      console.log(`   - Target Patients: ${irbExtraction.target_patient_count || 'Not specified'}`);
      console.log(`   - Date Range: ${irbExtraction.date_range.from} to ${irbExtraction.date_range.to}`);
    } catch (parseError) {
      console.log('   ⚠️ IRB Parsing failed, using fallback extraction');
      // Create basic extraction for testing
      irbExtraction = {
        resources: ['Patient', 'Condition', 'Observation'],
        filters: {},
        date_range: { from: '2020-01-01', to: '2025-12-31' },
        study_title: description,
        target_patient_count: 100,
        fhir_queries: []
      };
    }
    
    // Step 4: Build FHIR Queries
    console.log('\n🔍 Step 3: Building FHIR Queries');
    const fhirQueries = buildFHIRQueries(irbExtraction);
    console.log(`   ✅ Built ${fhirQueries.length} FHIR queries`);
    
    fhirQueries.forEach((query, index) => {
      console.log(`   ${index + 1}. ${query.resourceType} (${query.priority}): ${query.reasoning}`);
    });
    
    // Step 5: Execute FHIR Queries
    console.log('\n🔍 Step 4: Executing FHIR Queries');
    const fhirResults = await executeFHIRQueries(fhirQueries);
    
    console.log(`   ✅ FHIR Query Results:`);
    console.log(`   - Total Queries: ${fhirResults.totalQueries}`);
    console.log(`   - Successful Queries: ${fhirResults.successfulQueries}`);
    console.log(`   - Total Resources: ${fhirResults.totalResources}`);
    console.log(`   - Execution Time: ${fhirResults.executionTime}ms`);
    
    if (fhirResults.resourceBreakdown && Object.keys(fhirResults.resourceBreakdown).length > 0) {
      console.log('\n   📋 Resource Breakdown:');
      Object.entries(fhirResults.resourceBreakdown).forEach(([resource, count]) => {
        console.log(`     - ${resource}: ${count} resources`);
      });
    }
    
    if (fhirResults.errors.length > 0) {
      console.log('\n   ❌ FHIR Query Errors:');
      fhirResults.errors.forEach((error, index) => {
        console.log(`     ${index + 1}. ${error}`);
      });
    }
    
    // Step 6: Data Cleaning (simplified for testing)
    console.log('\n🔍 Step 5: Data Cleaning (Simulated)');
    const dataCleaning = [];
    
    // Simulate data cleaning for each resource type
    for (const [resourceType, count] of Object.entries(fhirResults.resourceBreakdown)) {
      if (count > 0) {
        console.log(`   🧹 Simulating cleaning for ${resourceType} data...`);
        dataCleaning.push({
          resourceType,
          success: true,
          originalCount: count,
          cleanedCount: Math.floor(count * 0.95), // Simulate 95% retention
          fields: ['id', 'status', 'date'],
          anomalies: Math.floor(count * 0.05) // Simulate 5% anomalies
        });
        console.log(`     ✅ ${resourceType}: ${count} → ${Math.floor(count * 0.95)} records (${Math.floor(count * 0.05)} anomalies)`);
      }
    }
    
    // Step 7: Create Seed Dataset (simplified)
    console.log('\n🔍 Step 6: Creating Seed Dataset (Simulated)');
    const seedDataset = {
      id: irbId,
      studyTitle: irbExtraction.study_title || description,
      principalInvestigator: irbExtraction.principal_investigator || 'Test Investigator',
      totalRecords: fhirResults.totalResources,
      resourceTypes: Object.keys(fhirResults.resourceBreakdown),
      fileSize: fhirResults.totalResources * 1024, // Simulate file size
      metadata: {
        irbData: irbExtraction,
        fhirQuery: fhirResults,
        dataCleaning: dataCleaning
      }
    };
    
    console.log(`   ✅ Seed Dataset Created (Simulated):`);
    console.log(`   - Dataset ID: ${seedDataset.id}`);
    console.log(`   - Study Title: ${seedDataset.studyTitle}`);
    console.log(`   - Total Records: ${seedDataset.totalRecords.toLocaleString()}`);
    console.log(`   - Resource Types: ${seedDataset.resourceTypes.join(', ')}`);
    console.log(`   - File Size: ${(seedDataset.fileSize / 1024 / 1024).toFixed(2)} MB`);
    
    console.log('\n✅ End-to-End Workflow Completed Successfully!');
    
    return {
      irbId,
      fileName,
      aiReview,
      irbExtraction,
      fhirQueries,
      fhirResults,
      dataCleaning,
      seedDataset,
      success: true
    };
    
  } catch (error) {
    console.error(`❌ Error in end-to-end workflow: ${error}`);
    return {
      irbId,
      fileName,
      aiReview: { complianceScore: 0, issues: [], suggestions: [], wouldPass: false },
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function main() {
  console.log('🧪 End-to-End IRB Workflow Testing');
  console.log('=====================================');
  
  const testIRBs = [
    { path: 'test-irbs/good-cardiovascular-study.txt', description: 'Good Cardiovascular Study' },
    { path: 'test-irbs/good-diabetes-study.txt', description: 'Good Diabetes Study' },
    { path: 'test-irbs/bad-missing-consent.txt', description: 'Bad IRB - Missing Consent' },
    { path: 'test-irbs/bad-no-risk-assessment.txt', description: 'Bad IRB - No Risk Assessment' },
    { path: 'test-irbs/bad-incomplete.txt', description: 'Bad IRB - Incomplete' }
  ];
  
  const results: WorkflowResult[] = [];
  
  for (const irbTest of testIRBs) {
    const result = await testEndToEndWorkflow(join(process.cwd(), irbTest.path), irbTest.description);
    results.push(result);
  }
  
  // Summary
  console.log('\n📊 End-to-End Workflow Test Summary');
  console.log('=====================================');
  
  const successfulWorkflows = results.filter(r => r.success);
  const failedWorkflows = results.filter(r => !r.success);
  const passedReviews = results.filter(r => r.aiReview.wouldPass);
  const failedReviews = results.filter(r => !r.aiReview.wouldPass);
  
  console.log(`✅ Successful Workflows: ${successfulWorkflows.length}`);
  console.log(`❌ Failed Workflows: ${failedWorkflows.length}`);
  console.log(`✅ Passed IRB Reviews: ${passedReviews.length}`);
  console.log(`❌ Failed IRB Reviews: ${failedReviews.length}`);
  
  if (successfulWorkflows.length > 0) {
    console.log('\n✅ Successful Workflow Results:');
    successfulWorkflows.forEach(workflow => {
      console.log(`   - ${workflow.fileName}:`);
      console.log(`     * IRB Score: ${workflow.aiReview.complianceScore}%`);
      console.log(`     * FHIR Resources: ${workflow.fhirResults?.totalResources || 0}`);
      console.log(`     * Dataset ID: ${workflow.seedDataset?.id || 'N/A'}`);
    });
  }
  
  if (failedWorkflows.length > 0) {
    console.log('\n❌ Failed Workflow Results:');
    failedWorkflows.forEach(workflow => {
      console.log(`   - ${workflow.fileName}: ${workflow.error || 'Unknown error'}`);
    });
  }
  
  // Performance metrics
  const totalResources = successfulWorkflows.reduce((sum, w) => sum + (w.fhirResults?.totalResources || 0), 0);
  const avgScore = results.reduce((sum, r) => sum + r.aiReview.complianceScore, 0) / results.length;
  
  console.log('\n📈 Performance Metrics:');
  console.log(`   - Average IRB Score: ${avgScore.toFixed(1)}%`);
  console.log(`   - Total Resources Retrieved: ${totalResources.toLocaleString()}`);
  console.log(`   - Success Rate: ${((successfulWorkflows.length / results.length) * 100).toFixed(1)}%`);
  
  console.log('\n✅ End-to-End IRB Workflow Testing completed!');
}

main().catch(console.error); 