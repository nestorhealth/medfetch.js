#!/usr/bin/env tsx

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseIRBDocument } from '../utils/aiProcessing';
import { buildFHIRQueries, executeFHIRQueries } from '../utils/dynamicFhirQueryHapi';

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

async function testIRB(irbPath: string, description: string) {
  console.log(`\n🧪 Testing IRB: ${description}`);
  console.log('=' .repeat(60));
  
  try {
    const irbContent = readFileSync(irbPath, 'utf8');
    console.log(`📄 IRB Content Length: ${irbContent.length} characters`);
    
    const irbExtraction = await parseIRBDocument(irbContent, 'txt');
    console.log('✅ IRB Parsing Results:');
    console.log(`   - Study Title: ${irbExtraction.study_title || 'Not specified'}`);
    console.log(`   - Resources: ${irbExtraction.resources.join(', ')}`);
    console.log(`   - Date Range: ${irbExtraction.date_range.from} to ${irbExtraction.date_range.to}`);
    
    const queries = buildFHIRQueries(irbExtraction);
    console.log(`✅ Built ${queries.length} FHIR queries`);
    
    const results = await executeFHIRQueries(queries);
    
    console.log('\n📊 FHIR Query Results:');
    console.log(`   - Total Queries: ${results.totalQueries}`);
    console.log(`   - Successful Queries: ${results.successfulQueries}`);
    console.log(`   - Total Resources: ${results.totalResources}`);
    console.log(`   - Execution Time: ${results.executionTime}ms`);
    
    if (results.resourceBreakdown && Object.keys(results.resourceBreakdown).length > 0) {
      console.log('\n📋 Resource Breakdown:');
      Object.entries(results.resourceBreakdown).forEach(([resource, count]) => {
        console.log(`   - ${resource}: ${count} resources`);
      });
    }
    
    return { success: true, results };
    
  } catch (error) {
    console.error(`❌ Error testing IRB: ${error}`);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

async function main() {
  console.log('🧪 IRB Dynamic FHIR Query Testing');
  console.log('=====================================');
  
  const testIRBs = [
    { path: 'test-irbs/good-cardiovascular-study.txt', description: 'Good Cardiovascular Study' },
    { path: 'test-irbs/good-diabetes-study.txt', description: 'Good Diabetes Study' },
    { path: 'test-irbs/bad-missing-consent.txt', description: 'Bad IRB - Missing Consent' },
    { path: 'test-irbs/bad-no-risk-assessment.txt', description: 'Bad IRB - No Risk Assessment' },
    { path: 'test-irbs/bad-incomplete.txt', description: 'Bad IRB - Incomplete' }
  ];
  
  for (const irbTest of testIRBs) {
    await testIRB(join(process.cwd(), irbTest.path), irbTest.description);
  }
  
  console.log('\n✅ IRB Dynamic FHIR Query Testing completed!');
}

main().catch(console.error); 