import { cleanFHIRData, cleanAllFHIRData } from '../utils/fhirDataCleaner';
import { join } from 'path';

// Sample FHIR data for testing
const samplePatientData = {
  resourceType: 'Patient',
  totalCount: 2,
  timestamp: new Date().toISOString(),
  resources: [
    {
      resourceType: 'Patient',
      id: 'patient-1',
      name: [
        {
          given: ['John'],
          family: 'Doe',
          text: 'John Doe'
        }
      ],
      gender: 'male',
      birthDate: '1980-01-15',
      address: [
        {
          line: ['123 Main St', 'Apt 4B'],
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'US'
        }
      ],
      telecom: [
        { value: '+1-555-123-4567' },
        { value: 'john.doe@email.com' }
      ],
      maritalStatus: { text: 'Married' },
      communication: [
        { language: { text: 'English' } }
      ]
    },
    {
      resourceType: 'Patient',
      id: 'patient-2',
      name: [
        {
          given: ['Jane'],
          family: 'Smith',
          text: 'Jane Smith'
        }
      ],
      gender: 'female',
      birthDate: '1985-06-20',
      address: [
        {
          line: ['456 Oak Ave'],
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90210',
          country: 'US'
        }
      ],
      telecom: [
        { value: '+1-555-987-6543' }
      ],
      maritalStatus: { text: 'Single' }
    }
  ]
};

const sampleConditionData = {
  resourceType: 'Condition',
  totalCount: 2,
  timestamp: new Date().toISOString(),
  resources: [
    {
      resourceType: 'Condition',
      id: 'condition-1',
      code: {
        text: 'Type 2 Diabetes',
        coding: [
          {
            code: 'E11.9',
            system: 'http://hl7.org/fhir/sid/icd-10',
            display: 'Type 2 diabetes mellitus without complications'
          }
        ]
      },
      clinicalStatus: {
        coding: [{ code: 'active' }]
      },
      verificationStatus: {
        coding: [{ code: 'confirmed' }]
      },
      category: [{ text: 'Endocrine' }],
      severity: { text: 'Moderate' },
      onsetDateTime: '2020-03-15',
      subject: { reference: 'Patient/patient-1' },
      encounter: { reference: 'Encounter/encounter-1' }
    },
    {
      resourceType: 'Condition',
      id: 'condition-2',
      code: {
        text: 'Hypertension',
        coding: [
          {
            code: 'I10',
            system: 'http://hl7.org/fhir/sid/icd-10',
            display: 'Essential (primary) hypertension'
          }
        ]
      },
      clinicalStatus: {
        coding: [{ code: 'active' }]
      },
      verificationStatus: {
        coding: [{ code: 'confirmed' }]
      },
      category: [{ text: 'Cardiovascular' }],
      onsetDateTime: '2019-08-10',
      subject: { reference: 'Patient/patient-2' }
    }
  ]
};

async function createTestData() {
  const fs = require('fs');
  const testDir = 'test-fhir-data';
  
  // Create test directory
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Write sample data files
  fs.writeFileSync(
    join(testDir, 'Patient_raw.json'),
    JSON.stringify(samplePatientData, null, 2)
  );
  
  fs.writeFileSync(
    join(testDir, 'Condition_raw.json'),
    JSON.stringify(sampleConditionData, null, 2)
  );
  
  console.log('✅ Created test data files in:', testDir);
  return testDir;
}

async function testSingleFileCleaning() {
  try {
    console.log('🧪 Testing single file cleaning...\n');
    
    const testDir = await createTestData();
    const patientFile = join(testDir, 'Patient_raw.json');
    
    console.log('1️⃣ Testing Patient data cleaning...');
    const result = await cleanFHIRData(patientFile, 'test-cleaned-data');
    
    if (result.success) {
      console.log('✅ Patient cleaning successful!');
      console.log(`📊 Original: ${result.originalCount}, Cleaned: ${result.cleanedCount}`);
      console.log(`📁 Output: ${result.outputFile}`);
      console.log(`📋 Fields: ${result.fields.length} fields`);
      console.log('   -', result.fields.join(', '));
    } else {
      console.error('❌ Patient cleaning failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

async function testBatchCleaning() {
  try {
    console.log('\n🧪 Testing batch cleaning...\n');
    
    const testDir = await createTestData();
    
    console.log('2️⃣ Testing batch cleaning of all files...');
    const results = await cleanAllFHIRData(testDir, 'test-cleaned-data');
    
    console.log('\n📊 Batch Cleaning Results:');
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.resourceType}: ${result.cleanedCount}/${result.originalCount} → ${result.outputFile}`);
      } else {
        console.log(`❌ ${result.resourceType}: Failed - ${result.error}`);
      }
    });
    
    const totalSuccess = results.filter(r => r.success).length;
    const totalOriginal = results.reduce((sum, r) => sum + r.originalCount, 0);
    const totalCleaned = results.reduce((sum, r) => sum + r.cleanedCount, 0);
    
    console.log(`\n🎯 Summary: ${totalSuccess}/${results.length} files successful`);
    console.log(`📈 Total: ${totalCleaned}/${totalOriginal} resources cleaned`);
    
  } catch (error) {
    console.error('❌ Batch test failed:', error);
  }
}

async function runTests() {
  console.log('🧹 Testing FHIR Data Cleaner...\n');
  
  await testSingleFileCleaning();
  await testBatchCleaning();
  
  console.log('\n✅ FHIR Data Cleaner tests completed!');
  console.log('📁 Check the "test-cleaned-data" directory for cleaned CSV files.');
}

// Run the tests
runTests(); 