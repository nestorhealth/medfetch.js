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

import { parseIRBDocument } from '../utils/aiProcessing';
import { buildFHIRQueries, executeFHIRQueries } from '../utils/dynamicFhirQueryHapi';

// Load test IRB content from file
const testIRBPath = join(process.cwd(), 'test-irb-document.txt');
let sampleIRBContent: string;

if (existsSync(testIRBPath)) {
  sampleIRBContent = readFileSync(testIRBPath, 'utf8');
  console.log(`📄 Loaded test IRB document from: ${testIRBPath}`);
} else {
  // Fallback to sample content if file doesn't exist
  sampleIRBContent = `
RESEARCH PROTOCOL: Diabetes Management Study

PRINCIPAL INVESTIGATOR: Dr. Maria Rodriguez, MD, PhD
Department of Endocrinology, University Medical Center

STUDY TITLE: Comparative Effectiveness of Diabetes Management Strategies in Adult Patients

RESEARCH OBJECTIVE:
This study aims to evaluate the effectiveness of different diabetes management strategies in adult patients aged 30-70 years with Type 2 Diabetes Mellitus. We will analyze patient outcomes, medication adherence, and healthcare utilization patterns.

STUDY POPULATION:
- Age: 30-70 years
- Gender: Male and Female
- Primary Diagnosis: Type 2 Diabetes Mellitus (ICD-10: E11)
- Secondary Conditions: Hypertension (ICD-10: I10), Hyperlipidemia (ICD-10: E78)
- Active patients with at least one encounter in the past 12 months

INCLUSION CRITERIA:
- Patients with confirmed Type 2 Diabetes Mellitus diagnosis
- Age between 30 and 70 years
- Active patient status
- At least one documented encounter in the past 12 months
- Prescribed diabetes medications (Metformin, Insulin, Sulfonylureas)

EXCLUSION CRITERIA:
- Patients under 30 or over 70 years of age
- Type 1 Diabetes Mellitus patients
- Inactive patient status
- No recent encounters

DATA REQUIREMENTS:
We require access to the following FHIR resources:
1. Patient demographics (age, gender, race/ethnicity)
2. Condition records (diabetes, hypertension, hyperlipidemia diagnoses)
3. MedicationRequest records (diabetes medications, antihypertensives, statins)
4. Observation records (HbA1c, blood glucose, blood pressure, cholesterol levels)
5. Encounter records (outpatient visits, hospitalizations)
6. Procedure records (diabetes-related procedures, cardiovascular procedures)

SPECIFIC MEDICAL CODES:
- Diabetes Mellitus: SNOMED CT 44054006 (Type 2 Diabetes Mellitus)
- Hypertension: SNOMED CT 38341003 (Essential Hypertension)
- Hyperlipidemia: SNOMED CT 55822004 (Hyperlipidemia)
- HbA1c Test: LOINC 4548-4 (Hemoglobin A1c)
- Blood Glucose: LOINC 2339-0 (Glucose)
- Blood Pressure: LOINC 85354-9 (Blood Pressure)
- Cholesterol: LOINC 2093-3 (Cholesterol Total)

MEDICATIONS OF INTEREST:
- Metformin: RxNorm 6809 (Metformin)
- Insulin: RxNorm 860975 (Insulin)
- Sulfonylureas: RxNorm 197361 (Glyburide)
- ACE Inhibitors: RxNorm 197379 (Lisinopril)
- Statins: RxNorm 197361 (Atorvastatin)

STUDY TIMELINE:
- Data collection period: January 1, 2020 to December 31, 2024
- Analysis period: January 1, 2025 to June 30, 2025
- Target patient count: 500 patients

DATA SECURITY:
All data will be de-identified and stored in HIPAA-compliant systems. Patient identifiers will be removed and replaced with unique study codes.

INFORMED CONSENT:
This study will use de-identified data only. No direct patient contact is required as this is a retrospective analysis of existing medical records.

RISK ASSESSMENT:
This study poses minimal risk as it involves only retrospective analysis of de-identified data. No direct patient intervention is involved.

BENEFITS:
This study will contribute to understanding the effectiveness of different diabetes management strategies and may lead to improved patient care protocols.

DATA ANALYSIS PLAN:
- Descriptive statistics for patient demographics
- Comparative analysis of treatment outcomes
- Statistical modeling of medication adherence patterns
- Healthcare utilization analysis

BUDGET:
Total budget: $150,000
- Data analysis: $80,000
- Personnel: $50,000
- Software and tools: $20,000

INSTITUTIONAL REVIEW BOARD COMPLIANCE:
This protocol has been designed to meet all IRB requirements including adequate data security measures, appropriate risk-benefit ratio, and compliance with HIPAA regulations.

MONITORING:
The study will be monitored by the institutional review board and may be subject to external audits. Regular progress reports will be submitted to the IRB.

CONFIDENTIALITY:
All participant data will be kept strictly confidential. Personal identifiers will be removed and replaced with unique study codes. Access to identifiable data will be limited to authorized research personnel only.

VOLUNTARY PARTICIPATION:
This study uses de-identified data only. No direct patient participation is required as this is a retrospective analysis of existing medical records.

ADDITIONAL NOTES:
This study focuses specifically on Type 2 Diabetes Mellitus patients with common comorbidities including hypertension and hyperlipidemia. We are particularly interested in patients who have been prescribed standard diabetes medications and have regular monitoring of their HbA1c levels.
`;
  console.log('⚠️ Test IRB file not found, using fallback content');
}

async function testDynamicFHIRQuerying() {
  console.log('🧪 Testing Dynamic FHIR Querying System');
  console.log('=====================================\n');

  try {
    // Step 1: Parse IRB document
    console.log('📄 Step 1: Parsing IRB document...');
    const irbExtraction = await parseIRBDocument(sampleIRBContent, 'txt');
    
    console.log('✅ IRB Extraction Results:');
    console.log(`   - Study Title: ${irbExtraction.study_title}`);
    console.log(`   - Principal Investigator: ${irbExtraction.principal_investigator}`);
    console.log(`   - Target Patient Count: ${irbExtraction.target_patient_count}`);
    console.log(`   - Resources: ${irbExtraction.resources.join(', ')}`);
    console.log(`   - Date Range: ${irbExtraction.date_range.from} to ${irbExtraction.date_range.to}`);
    console.log(`   - FHIR Queries: ${irbExtraction.fhir_queries?.length || 0} queries`);
    console.log(`   - Patient Criteria: ${irbExtraction.patient_criteria ? 'extracted' : 'default'}`);
    console.log(`   - Data Requirements: ${irbExtraction.data_requirements ? 'extracted' : 'default'}`);
    console.log('');

    // Step 2: Build FHIR queries
    console.log('🔍 Step 2: Building dynamic FHIR queries...');
    const queries = buildFHIRQueries(irbExtraction);
    
    console.log(`✅ Built ${queries.length} FHIR queries:`);
    queries.forEach((query, index) => {
      console.log(`   ${index + 1}. ${query.resourceType} (${query.priority} priority)`);
      console.log(`      - Filters: ${JSON.stringify(query.filters)}`);
      console.log(`      - Count: ${query.count}`);
      console.log(`      - Reasoning: ${query.reasoning}`);
    });
    console.log('');

    // Step 3: Execute FHIR queries against HAPI test server
    console.log('🚀 Step 3: Executing FHIR queries...');
    console.log('Note: Using HAPI FHIR test server at https://hapi.fhir.org/baseR4');
    console.log('This server contains millions of pre-populated FHIR resources for testing.\n');
    
    const querySummary = await executeFHIRQueries(queries);
    
    console.log('✅ FHIR Query Execution Summary:');
    console.log(`   - Total Queries: ${querySummary.totalQueries}`);
    console.log(`   - Successful Queries: ${querySummary.successfulQueries}`);
    console.log(`   - Total Resources: ${querySummary.totalResources}`);
    console.log(`   - Execution Time: ${querySummary.executionTime}ms`);
    console.log(`   - Resource Breakdown:`, querySummary.resourceBreakdown);
    
    if (querySummary.errors.length > 0) {
      console.log(`   - Errors: ${querySummary.errors.length}`);
      querySummary.errors.forEach(error => {
        console.log(`     * ${error}`);
      });
    }
    console.log('');

    // Step 4: Summary and recommendations
    console.log('📊 Step 4: Analysis and Recommendations');
    console.log('=====================================');
    
    if (querySummary.successfulQueries > 0) {
      console.log('✅ Dynamic FHIR querying is working!');
      console.log(`   - Successfully retrieved ${querySummary.totalResources} resources`);
      console.log(`   - Query success rate: ${(querySummary.successfulQueries / querySummary.totalQueries * 100).toFixed(1)}%`);
      
      // Analyze resource distribution
      const resourceEntries = Object.entries(querySummary.resourceBreakdown);
      if (resourceEntries.length > 0) {
        console.log('   - Resource distribution:');
        resourceEntries.forEach(([resourceType, count]) => {
          console.log(`     * ${resourceType}: ${count} resources`);
        });
      }
    } else {
      console.log('⚠️  No FHIR queries were successful. This could be due to:');
      console.log('   - HAPI FHIR server not running');
      console.log('   - Network connectivity issues');
      console.log('   - Invalid query parameters');
      console.log('   - Server configuration issues');
    }
    
    console.log('');
    console.log('🎯 Key Benefits of Dynamic FHIR Querying:');
    console.log('   - AI-driven query generation based on IRB content');
    console.log('   - Intelligent resource selection and filtering');
    console.log('   - Priority-based query execution');
    console.log('   - Comprehensive error handling and reporting');
    console.log('   - Scalable and extensible architecture');
    
  } catch (error) {
    console.error('❌ Error in dynamic FHIR querying test:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
  }
}

// Run the test
if (require.main === module) {
  testDynamicFHIRQuerying()
    .then(() => {
      console.log('\n✅ Dynamic FHIR querying test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Dynamic FHIR querying test failed:', error);
      process.exit(1);
    });
}

export { testDynamicFHIRQuerying }; 