import { fetchFHIRResources, checkFHIRServerStatus } from '../utils/fhirQueryEngine';

// Sample IRB query data for testing - using broader filters to get consistent data
const sampleIRBQuery = {
  resources: ['Patient', 'Condition'],
  filters: {
    // Removed specific filters to get more data
  },
  date_range: {
    from: '2020-01-01',
    to: '2025-12-31'  // Extended to current date
  }
};

async function testFHIRQueryEngine() {
  try {
    console.log('🧪 Testing FHIR Query Engine...\n');
    
    // First check if FHIR server is accessible
    console.log('1️⃣ Checking FHIR server status...');
    const serverStatus = await checkFHIRServerStatus();
    
    if (!serverStatus) {
      console.error('❌ FHIR server is not accessible. Please check your internet connection.');
      return;
    }
    
    console.log('✅ FHIR server is accessible!\n');
    
    // Test the main query function
    console.log('2️⃣ Testing FHIR resource fetching...');
    console.log('📋 Sample IRB Query:', JSON.stringify(sampleIRBQuery, null, 2));
    
    const results = await fetchFHIRResources(sampleIRBQuery, 'test-fhir-data');
    
    console.log('\n3️⃣ Test Results:');
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.resourceType}: ${result.totalResources} resources saved to ${result.fileName}`);
      } else {
        console.log(`❌ ${result.resourceType}: Failed - ${result.error}`);
      }
    });
    
    const totalSuccess = results.filter(r => r.success).length;
    const totalResources = results.reduce((sum, r) => sum + r.totalResources, 0);
    
    console.log(`\n🎯 Summary: ${totalSuccess}/${results.length} resource types successful`);
    console.log(`📈 Total resources fetched: ${totalResources}`);
    
    if (totalSuccess > 0) {
      console.log('\n✅ FHIR Query Engine test completed successfully!');
      console.log('📁 Check the "test-fhir-data" directory for the fetched JSON files.');
    } else {
      console.log('\n❌ FHIR Query Engine test failed - no resources were fetched.');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testFHIRQueryEngine(); 