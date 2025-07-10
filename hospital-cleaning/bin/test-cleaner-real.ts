import { cleanAllFHIRData } from '../utils/fhirDataCleaner';

async function testCleanerWithRealData() {
  try {
    console.log('🧹 Testing FHIR Data Cleaner with real data...\n');
    
    console.log('📁 Cleaning all FHIR data from: test-fhir-data');
    const results = await cleanAllFHIRData('test-fhir-data', 'test-cleaned-data');
    
    console.log('\n📊 Cleaning Results:');
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.resourceType}: ${result.cleanedCount}/${result.originalCount} → ${result.outputFile}`);
      } else {
        console.log(`❌ ${result.resourceType}: Failed - ${result.error}`);
      }
    });
    
    const totalSuccess = results.filter(r => r.success).length;
    const totalCleaned = results.reduce((sum, r) => sum + r.cleanedCount, 0);
    const totalResources = results.reduce((sum, r) => sum + r.originalCount, 0);
    
    console.log(`\n🎯 Summary: ${totalSuccess}/${results.length} files successful`);
    console.log(`📈 Total: ${totalCleaned}/${totalResources} resources cleaned`);
    
    if (totalSuccess > 0) {
      console.log('\n✅ FHIR Data Cleaner test completed successfully!');
      console.log('📁 Check the "test-cleaned-data" directory for cleaned CSV files.');
    } else {
      console.log('\n❌ FHIR Data Cleaner test failed - no files were cleaned.');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testCleanerWithRealData(); 