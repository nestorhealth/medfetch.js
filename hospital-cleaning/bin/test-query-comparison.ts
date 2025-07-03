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

// Utility to build FHIR query URL (same as test-hybrid-filters.ts)
function buildFhirQueryUrl(resourceType: string, filters: Record<string, any>, count = 5): string {
  const baseUrl = 'https://hapi.fhir.org/baseR4';
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => {
        params.append(key, item);
      });
    } else {
      params.append(key, value);
    }
  });
  params.append('_count', String(count));
  return `${baseUrl}/${resourceType}?${params.toString()}`;
}

// Utility to fetch FHIR resources (same as test-hybrid-filters.ts)
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

// Simplify filters function from dynamicFhirQuery.ts
function simplifyFilters(filters: Record<string, any>): Record<string, any> {
  const simplified: Record<string, any> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    // Skip complex date ranges that might cause issues
    if (key.includes('date') && typeof value === 'string' && value.includes(',')) {
      // For date ranges, use a more recent date that's likely to have data
      if (key.includes('birthdate')) {
        // For birthdate, use a reasonable range that's likely to have data
        simplified[key] = 'ge1950-01-01';
      } else {
        // For other dates, use a recent date
        simplified[key] = 'ge2020-01-01';
      }
    }
    // Handle arrays by taking only the first few items
    else if (Array.isArray(value) && value.length > 2) {
      simplified[key] = value.slice(0, 2);
    }
    // Skip empty arrays
    else if (Array.isArray(value) && value.length === 0) {
      // Skip empty arrays entirely
      return;
    }
    // Keep simple values as is
    else {
      simplified[key] = value;
    }
  });
  
  return simplified;
}

async function testQueryComparison() {
  console.log('🔬 Testing Query Comparison');
  console.log('==========================\n');

  // Test the exact queries that work in test-hybrid-filters.ts
  const workingQueries = [
    {
      name: 'Patient (Working)',
      resourceType: 'Patient',
      originalFilters: { active: true, gender: 'male' }
    },
    {
      name: 'Condition (Working)',
      resourceType: 'Condition', 
      originalFilters: { code: 'http://snomed.info/sct|38341003', 'clinical-status': 'active' }
    }
  ];

  // Test the queries that dynamic FHIR generates
  const dynamicQueries = [
    {
      name: 'Patient (Dynamic)',
      resourceType: 'Patient',
      originalFilters: { 
        gender: 'male', 
        birthdate: 'le2007-01-01,ge1959-01-01', 
        active: true 
      }
    },
    {
      name: 'Condition (Dynamic)',
      resourceType: 'Condition',
      originalFilters: { 
        code: ['http://snomed.info/sct|38341003', 'http://snomed.info/sct|44054006'], 
        'clinical-status': 'active', 
        'onset-date': 'ge2024-01-01,le2025-12-31' 
      }
    }
  ];

  console.log('📋 Testing Working Queries (from test-hybrid-filters.ts):\n');
  
  for (const query of workingQueries) {
    console.log(`🔍 ${query.name}:`);
    console.log(`   Original filters: ${JSON.stringify(query.originalFilters)}`);
    
    const url = buildFhirQueryUrl(query.resourceType, query.originalFilters);
    console.log(`   URL: ${url}`);
    
    const count = await fetchFhirResources(url);
    console.log(`   ✅ Result: ${count} resources found\n`);
  }

  console.log('📋 Testing Dynamic Queries (before simplification):\n');
  
  for (const query of dynamicQueries) {
    console.log(`🔍 ${query.name}:`);
    console.log(`   Original filters: ${JSON.stringify(query.originalFilters)}`);
    
    const url = buildFhirQueryUrl(query.resourceType, query.originalFilters);
    console.log(`   URL: ${url}`);
    
    const count = await fetchFhirResources(url);
    console.log(`   ✅ Result: ${count} resources found\n`);
  }

  console.log('📋 Testing Dynamic Queries (after simplification):\n');
  
  for (const query of dynamicQueries) {
    console.log(`🔍 ${query.name}:`);
    console.log(`   Original filters: ${JSON.stringify(query.originalFilters)}`);
    
    const simplifiedFilters = simplifyFilters(query.originalFilters);
    console.log(`   Simplified filters: ${JSON.stringify(simplifiedFilters)}`);
    
    const url = buildFhirQueryUrl(query.resourceType, simplifiedFilters);
    console.log(`   URL: ${url}`);
    
    const count = await fetchFhirResources(url);
    console.log(`   ✅ Result: ${count} resources found\n`);
  }

  console.log('🎯 Summary:');
  console.log('This test shows the difference between:');
  console.log('1. Working queries from test-hybrid-filters.ts');
  console.log('2. Dynamic queries before simplification');
  console.log('3. Dynamic queries after simplification');
  console.log('');
  console.log('The issue is likely in the simplifyFilters function over-simplifying the queries.');
}

// Run the test
testQueryComparison().catch(console.error); 