import { createSeedDataset } from '../utils/seedDatasetCreator';
import { join } from 'path';

async function testSeedDatasetCreator() {
  try {
    console.log('📦 Testing Seed Dataset Creator...\n');
    
    // Test parameters
    const studyTitle = 'Test Research Study';
    const principalInvestigator = 'Dr. Test Researcher';
    const metadata = {
      studyTitle,
      principalInvestigator,
      createdAt: new Date().toISOString(),
      description: 'Test dataset for validation'
    };
    
    console.log('1️⃣ Creating seed dataset...');
    console.log('📋 Study Title:', studyTitle);
    console.log('👨‍⚕️ Principal Investigator:', principalInvestigator);
    
    const result = await createSeedDataset(
      'test-cleaned-data',
      studyTitle,
      principalInvestigator,
      metadata
    );
    
    if (result.success) {
      console.log('\n✅ Seed dataset created successfully!');
      console.log('📁 File:', result.filePath);
      console.log('📊 Size:', result.fileSize, 'bytes');
      console.log('🆔 Seed ID:', result.seedId);
      
      // Check if file exists
      const fs = require('fs');
      if (fs.existsSync(result.filePath)) {
        console.log('✅ File exists and is accessible');
      } else {
        console.log('❌ File not found at expected location');
      }
      
    } else {
      console.log('\n❌ Failed to create seed dataset');
      console.log('Error:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Run the test
testSeedDatasetCreator(); 