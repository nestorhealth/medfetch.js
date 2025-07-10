#!/usr/bin/env tsx

/**
 * Test HAPI FHIR Server Connection
 * 
 * This script tests the connection to the HAPI FHIR test server
 * and shows what resources are available.
 */

async function testHAPIConnection() {
  console.log('🧪 Testing HAPI FHIR Server Connection');
  console.log('=====================================\n');

  const baseUrl = 'https://hapi.fhir.org/baseR4';
  
  try {
    // Test 1: Basic connection test
    console.log('🔗 Test 1: Basic connection test...');
    const response = await fetch(`${baseUrl}/Patient?_count=5`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ Connection successful! Found ${data.total} total patients`);
    console.log(`📊 Retrieved ${data.entry?.length || 0} sample patients`);
    console.log('');

    // Test 2: Test different resource types
    console.log('🔍 Test 2: Testing different resource types...');
    const resourceTypes = ['Patient', 'Condition', 'Observation', 'Procedure', 'Encounter'];
    
    for (const resourceType of resourceTypes) {
      try {
        const resourceResponse = await fetch(`${baseUrl}/${resourceType}?_count=1`);
        if (resourceResponse.ok) {
          const resourceData = await resourceResponse.json();
          console.log(`✅ ${resourceType}: ${resourceData.total} total resources available`);
        } else {
          console.log(`❌ ${resourceType}: HTTP ${resourceResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ ${resourceType}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    console.log('');

    // Test 3: Test with specific filters
    console.log('🎯 Test 3: Testing with specific filters...');
    
    // Test Patient with gender filter
    const genderResponse = await fetch(`${baseUrl}/Patient?gender=male&_count=3`);
    if (genderResponse.ok) {
      const genderData = await genderResponse.json();
      console.log(`✅ Patients with gender=male: ${genderData.total} found, retrieved ${genderData.entry?.length || 0}`);
    }
    
    // Test Condition with clinical status
    const conditionResponse = await fetch(`${baseUrl}/Condition?clinical-status=active&_count=3`);
    if (conditionResponse.ok) {
      const conditionData = await conditionResponse.json();
      console.log(`✅ Conditions with clinical-status=active: ${conditionData.total} found, retrieved ${conditionData.entry?.length || 0}`);
    }
    
    // Test Observation with status
    const observationResponse = await fetch(`${baseUrl}/Observation?status=final&_count=3`);
    if (observationResponse.ok) {
      const observationData = await observationResponse.json();
      console.log(`✅ Observations with status=final: ${observationData.total} found, retrieved ${observationData.entry?.length || 0}`);
    }
    
    console.log('');

    // Test 4: Show sample data structure
    console.log('📋 Test 4: Sample data structure...');
    if (data.entry && data.entry.length > 0) {
      const samplePatient = data.entry[0].resource;
      console.log('Sample Patient resource structure:');
      console.log(`  - ID: ${samplePatient.id}`);
      console.log(`  - Resource Type: ${samplePatient.resourceType}`);
      console.log(`  - Gender: ${samplePatient.gender || 'Not specified'}`);
      console.log(`  - Birth Date: ${samplePatient.birthDate || 'Not specified'}`);
      console.log(`  - Active: ${samplePatient.active !== false ? 'Yes' : 'No'}`);
      if (samplePatient.name && samplePatient.name.length > 0) {
        const name = samplePatient.name[0];
        console.log(`  - Name: ${name.given?.join(' ') || ''} ${name.family || ''}`);
      }
    }
    console.log('');

    console.log('✅ HAPI FHIR server connection test completed successfully!');
    console.log('🎉 The server is ready for dynamic FHIR querying.');
    
  } catch (error) {
    console.error('❌ HAPI FHIR server connection test failed:', error);
    console.error('Please check your internet connection and try again.');
  }
}

// Run the test
testHAPIConnection().catch(console.error); 