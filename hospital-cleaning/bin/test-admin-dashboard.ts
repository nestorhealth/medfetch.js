// Test script to simulate IRB submission to admin dashboard
const sampleIRBData = {
  resources: ['Patient', 'Condition', 'Encounter', 'MedicationRequest'],
  filters: {
    gender: 'male',
    age_min: '18',
    age_max: '65',
    conditions: 'Type 2 Diabetes',
    medications: 'Metformin, Insulin'
  },
  date_range: {
    from: '2020-01-01',
    to: '2023-12-31'
  },
  study_title: 'Diabetes Management in Male Patients',
  principal_investigator: 'Dr. Sarah Johnson',
  target_patient_count: 500,
  additional_notes: 'Focus on medication adherence and glycemic control patterns.'
};

async function submitIRBToAdmin() {
  try {
    console.log('📤 Submitting IRB data to admin dashboard...');
    console.log('Sample IRB Data:', JSON.stringify(sampleIRBData, null, 2));
    
    const response = await fetch('http://localhost:3001/submit-irb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleIRBData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ IRB data submitted successfully!');
      console.log('Response:', result);
      console.log('\n🌐 Admin Dashboard available at: http://localhost:3001');
      console.log('📋 You can now review and approve/reject the IRB submission.');
    } else {
      const error = await response.text();
      console.error('❌ Failed to submit IRB data:', error);
    }
  } catch (error) {
    console.error('❌ Error submitting IRB data:', error);
    console.log('\n💡 Make sure the admin server is running with: npm run admin');
  }
}

// Run the test
submitIRBToAdmin(); 