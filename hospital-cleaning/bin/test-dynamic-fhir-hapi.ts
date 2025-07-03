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

// Check OpenAI API key
function checkOpenAIKey() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  const status = apiKey ? 'set' : 'not set';
  console.log('🔑 OpenAI API Key status:', { NEXT_PUBLIC_OPENAI_API_KEY: status, OPENAI_API_KEY: status });
  return apiKey;
}

async function testDynamicFHIRQuerying() {
  console.log('🧪 Testing HAPI-Optimized Dynamic FHIR Querying');
  console.log('==============================================\n');

  // Check OpenAI API key
  const apiKey = checkOpenAIKey();
  if (!apiKey) {
    console.error('❌ OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY or OPENAI_API_KEY in your .env file.');
    return;
  }

  try {
    // Load test IRB document
    const irbFilePath = join(process.cwd(), 'test-irb-document.txt');
    if (!existsSync(irbFilePath)) {
      console.error('❌ Test IRB document not found. Please ensure test-irb-document.txt exists.');
      return;
    }

    const irbContent = readFileSync(irbFilePath, 'utf8');
    console.log(`📄 Loaded test IRB document: ${irbContent.length} characters`);

    // Extract IRB data using AI processing
    console.log('\n🔍 Extracting IRB data with AI processing...');
    const irbExtraction = await parseIRBDocument(irbContent, 'txt');
    
    console.log('✅ IRB Data Extraction Results:');
    console.log(`   Study Title: ${irbExtraction.study_title || 'N/A'}`);
    console.log(`   Principal Investigator: ${irbExtraction.principal_investigator || 'N/A'}`);
    console.log(`   Target Patient Count: ${irbExtraction.target_patient_count || 'N/A'}`);
    console.log(`   Resources: ${irbExtraction.resources?.join(', ') || 'N/A'}`);
    console.log(`   Date Range: ${irbExtraction.date_range?.from || 'N/A'} to ${irbExtraction.date_range?.to || 'N/A'}`);
    
    if (irbExtraction.fhir_queries && irbExtraction.fhir_queries.length > 0) {
      console.log(`   Enhanced FHIR Queries: ${irbExtraction.fhir_queries.length} queries`);
      irbExtraction.fhir_queries.forEach((query: any, index: number) => {
        console.log(`     ${index + 1}. ${query.resourceType} (${query.priority}): ${query.reasoning}`);
      });
    }

    // Build FHIR queries using HAPI-optimized utility
    console.log('\n🔍 Building HAPI-optimized FHIR queries...');
    const queries = buildFHIRQueries(irbExtraction);
    
    console.log(`✅ Built ${queries.length} HAPI-optimized queries:`);
    queries.forEach((query, index) => {
      console.log(`   ${index + 1}. ${query.resourceType} (${query.priority} priority)`);
      console.log(`      Filters: ${JSON.stringify(query.filters)}`);
      console.log(`      Count: ${query.count}`);
      console.log(`      Reasoning: ${query.reasoning}`);
    });

    // Execute FHIR queries against HAPI server
    console.log('\n🚀 Executing HAPI-optimized FHIR queries...');
    const results = await executeFHIRQueries(queries);

    // Display results
    console.log('\n📊 HAPI-Optimized FHIR Query Results:');
    console.log('=====================================');
    console.log(`Total Queries: ${results.totalQueries}`);
    console.log(`Successful Queries: ${results.successfulQueries}`);
    console.log(`Total Resources Retrieved: ${results.totalResources}`);
    console.log(`Execution Time: ${results.executionTime}ms`);
    
    if (results.resourceBreakdown && Object.keys(results.resourceBreakdown).length > 0) {
      console.log('\n📋 Resource Breakdown:');
      Object.entries(results.resourceBreakdown).forEach(([resourceType, count]) => {
        console.log(`   ${resourceType}: ${count} resources`);
      });
    }

    if (results.errors && results.errors.length > 0) {
      console.log('\n❌ Errors:');
      results.errors.forEach(error => {
        console.log(`   - ${error}`);
      });
    }

    // Success rate calculation
    const successRate = (results.successfulQueries / results.totalQueries) * 100;
    console.log(`\n📈 Success Rate: ${successRate.toFixed(1)}%`);

    if (results.totalResources > 0) {
      console.log('\n🎉 SUCCESS: HAPI-optimized queries retrieved real data!');
      console.log('This demonstrates that the dynamic FHIR querying system works correctly');
      console.log('when optimized for the specific FHIR server being used.');
    } else {
      console.log('\n⚠️ No resources retrieved. This may indicate:');
      console.log('   - The HAPI server doesn\'t contain data matching the specific filters');
      console.log('   - The filters are still too restrictive for the available data');
      console.log('   - Network connectivity issues with the HAPI server');
    }

  } catch (error) {
    console.error('❌ Error during HAPI-optimized dynamic FHIR testing:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the test
testDynamicFHIRQuerying().then(() => {
  console.log('\n🏁 HAPI-optimized dynamic FHIR testing completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Fatal error during testing:', error);
  process.exit(1);
}); 