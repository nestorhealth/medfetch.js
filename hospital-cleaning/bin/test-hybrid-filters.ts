#!/usr/bin/env tsx

/**
 * Test Hybrid FHIR Filter Generation
 * 
 * This script tests the hybrid approach combining AI and rule-based
 * FHIR filter generation.
 */

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
    console.log('🔑 OpenAI API Key status:', {
      NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY ? 'set' : 'not set',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'not set'
    });
  } else {
    console.warn('⚠️ No .env file found in project root');
  }
}

// Load environment variables before importing other modules
loadEnvFile();

import { generateFHIRFilters, generateFHIRFiltersAI, generateFHIRFiltersRuleBased, type FHIRFilterRequest } from '../utils/fhirFilterGenerator';

// Utility to build FHIR query URL
function buildFhirQueryUrl(resourceType: string, filters: Record<string, any>, count = 5): string {
  const baseUrl = 'https://hapi.fhir.org/baseR4';
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => params.append(key, v));
    } else {
      params.append(key, value);
    }
  });
  params.append('_count', String(count));
  return `${baseUrl}/${resourceType}?${params.toString()}`;
}

// Utility to fetch FHIR resources
async function fetchFhirResources(url: string): Promise<number> {
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.resourceType === 'Bundle' && Array.isArray(data.entry)) {
      return data.entry.length;
    }
    return 0;
  } catch (e) {
    console.error('Fetch error:', e);
    return 0;
  }
}

async function testKnownGoodQueries() {
  console.log('\n============================');
  console.log('🔬 Known-Good FHIR Query Tests');
  console.log('============================\n');

  // --- Patient Test ---
  const patientHandFilters = { active: true, gender: 'male' };
  const patientHandUrl = buildFhirQueryUrl('Patient', patientHandFilters);
  console.log('🔍 DEBUG - Hybrid Test Patient Query URL:', patientHandUrl);
  console.log('🔍 DEBUG - Hybrid Test Patient Query Params:', patientHandFilters);
  const patientHandCount = await fetchFhirResources(patientHandUrl);
  console.log(`Hand-crafted Patient Query: ${patientHandCount} resources found`);

  const patientHybridReq: FHIRFilterRequest = {
    resourceType: 'Patient',
    description: 'active male patients'
  };
  const patientHybrid = await generateFHIRFilters(patientHybridReq);
  const patientHybridUrl = buildFhirQueryUrl('Patient', patientHybrid.filters);
  console.log('Patient AI/Hybrid Query URL:', patientHybridUrl);
  const patientHybridCount = await fetchFhirResources(patientHybridUrl);
  console.log(`AI/Hybrid Patient Query: ${patientHybridCount} resources found`);

  // --- Condition Test ---
  const conditionHandFilters = { code: 'http://snomed.info/sct|38341003', 'clinical-status': 'active' };
  const conditionHandUrl = buildFhirQueryUrl('Condition', conditionHandFilters);
  console.log('\nCondition Hand-crafted Query URL:', conditionHandUrl);
  const conditionHandCount = await fetchFhirResources(conditionHandUrl);
  console.log(`Hand-crafted Condition Query: ${conditionHandCount} resources found`);

  const conditionHybridReq: FHIRFilterRequest = {
    resourceType: 'Condition',
    description: 'patients with active hypertension'
  };
  const conditionHybrid = await generateFHIRFilters(conditionHybridReq);
  const conditionHybridUrl = buildFhirQueryUrl('Condition', conditionHybrid.filters);
  console.log('Condition AI/Hybrid Query URL:', conditionHybridUrl);
  const conditionHybridCount = await fetchFhirResources(conditionHybridUrl);
  console.log(`AI/Hybrid Condition Query: ${conditionHybridCount} resources found`);

  // --- Summary ---
  console.log('\n============================');
  console.log('Summary:');
  console.log(`Patient: Hand-crafted = ${patientHandCount}, AI/Hybrid = ${patientHybridCount}`);
  console.log(`Condition: Hand-crafted = ${conditionHandCount}, AI/Hybrid = ${conditionHybridCount}`);
  console.log('============================\n');
}

async function testHybridFilterGeneration() {
  console.log('🧪 Testing Hybrid FHIR Filter Generation');
  console.log('=======================================\n');

  // Test cases with different scenarios
  const testCases: FHIRFilterRequest[] = [
    {
      resourceType: 'Patient',
      description: 'active patients aged 18-65',
      dateRange: { from: '2024-01-01', to: '2025-12-31' },
      patientCriteria: {
        ageRange: { min: 18, max: 65 },
        gender: ['male', 'female']
      }
    },
    {
      resourceType: 'Condition',
      description: 'patients with diabetes and hypertension',
      dateRange: { from: '2024-01-01', to: '2025-12-31' }
    },
    {
      resourceType: 'Observation',
      description: 'HbA1c and cholesterol lab values',
      dateRange: { from: '2024-01-01', to: '2025-12-31' }
    },
    {
      resourceType: 'Procedure',
      description: 'completed cardiovascular procedures',
      dateRange: { from: '2024-01-01', to: '2025-12-31' }
    },
    {
      resourceType: 'MedicationRequest',
      description: 'active diabetes medications',
      dateRange: { from: '2024-01-01', to: '2025-12-31' }
    },
    {
      resourceType: 'Encounter',
      description: 'finished outpatient encounters',
      dateRange: { from: '2024-01-01', to: '2025-12-31' }
    }
  ];

  console.log(`🚀 Testing ${testCases.length} filter generation scenarios\n`);

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`📋 Test Case ${i + 1}: ${testCase.resourceType}`);
    console.log(`   Description: ${testCase.description}`);
    console.log(`   Date Range: ${testCase.dateRange?.from} to ${testCase.dateRange?.to}`);
    
    try {
      // Test hybrid approach
      console.log('   🔄 Testing Hybrid Approach...');
      const hybridResult = await generateFHIRFilters(testCase);
      
      console.log(`   ✅ Hybrid Result:`);
      console.log(`      Filters: ${JSON.stringify(hybridResult.filters)}`);
      console.log(`      Confidence: ${hybridResult.confidence}`);
      console.log(`      Reasoning: ${hybridResult.reasoning}`);
      if (hybridResult.codes) {
        console.log(`      Codes: ${hybridResult.codes.join(', ')}`);
      }
      
      // Test AI-only approach
      console.log('   🤖 Testing AI-Only Approach...');
      const aiResult = await generateFHIRFiltersAI(testCase);
      
      console.log(`   ✅ AI Result:`);
      console.log(`      Filters: ${JSON.stringify(aiResult.filters)}`);
      console.log(`      Confidence: ${aiResult.confidence}`);
      console.log(`      Reasoning: ${aiResult.reasoning}`);
      
      // Test rule-based approach
      console.log('   🔧 Testing Rule-Based Approach...');
      const ruleResult = generateFHIRFiltersRuleBased(testCase);
      
      console.log(`   ✅ Rule-Based Result:`);
      console.log(`      Filters: ${JSON.stringify(ruleResult.filters)}`);
      console.log(`      Confidence: ${ruleResult.confidence}`);
      console.log(`      Reasoning: ${ruleResult.reasoning}`);
      
      // Compare results
      console.log('   📊 Comparison:');
      const hybridFilterCount = Object.keys(hybridResult.filters).length;
      const aiFilterCount = Object.keys(aiResult.filters).length;
      const ruleFilterCount = Object.keys(ruleResult.filters).length;
      
      console.log(`      Hybrid filters: ${hybridFilterCount}`);
      console.log(`      AI filters: ${aiFilterCount}`);
      console.log(`      Rule-based filters: ${ruleFilterCount}`);
      
      if (hybridFilterCount > 0) {
        console.log(`      ✅ Hybrid approach generated ${hybridFilterCount} filters`);
      } else {
        console.log(`      ⚠️ Hybrid approach generated no filters`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error in test case ${i + 1}:`, error);
    }
    
    console.log(''); // Empty line for readability
  }

  // Test batch generation
  console.log('🚀 Testing Batch Filter Generation...');
  try {
    const { generateBatchFHIRFilters } = await import('../utils/fhirFilterGenerator');
    const batchResults = await generateBatchFHIRFilters(testCases);
    
    console.log(`✅ Batch generation completed for ${Object.keys(batchResults).length} resources`);
    
    Object.entries(batchResults).forEach(([resourceType, result]) => {
      console.log(`   ${resourceType}: ${Object.keys(result.filters).length} filters (confidence: ${result.confidence})`);
    });
    
  } catch (error) {
    console.error('❌ Batch generation failed:', error);
  }

  console.log('\n🎯 Summary:');
  console.log('✅ Hybrid filter generation test completed!');
  console.log('🔧 The system combines AI and rule-based approaches for robust filter generation');
  console.log('🤖 AI provides intelligent, context-aware filters');
  console.log('📋 Rule-based fallback ensures consistent results');
  console.log('🔄 Automatic fallback when AI is unavailable or fails');
}

// Run the test
testHybridFilterGeneration().then(testKnownGoodQueries).catch(console.error); 