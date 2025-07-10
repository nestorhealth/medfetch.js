import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename, extname } from 'path';
import { Parser } from 'json2csv';
import { FHIRResource } from './fhirQueryEngine';

// FHIR Data Cleaner Types
export interface CleanedResource {
  [key: string]: string | number | boolean | null;
}

export interface CleaningResult {
  resourceType: string;
  inputFile: string;
  outputFile: string;
  originalCount: number;
  cleanedCount: number;
  success: boolean;
  error?: string;
  fields: string[];
}

// FHIR field flattening configurations
const FIELD_FLATTENING_CONFIG: Record<string, Record<string, string>> = {
  Patient: {
    'name[0].given[0]': 'first_name',
    'name[0].family': 'last_name',
    'name[0].text': 'full_name',
    'gender': 'gender',
    'birthDate': 'birth_date',
    'deceasedBoolean': 'deceased',
    'deceasedDateTime': 'deceased_date',
    'address[0].line[0]': 'address_line1',
    'address[0].line[1]': 'address_line2',
    'address[0].city': 'city',
    'address[0].state': 'state',
    'address[0].postalCode': 'postal_code',
    'address[0].country': 'country',
    'telecom[0].value': 'phone',
    'telecom[1].value': 'email',
    'maritalStatus.text': 'marital_status',
    'communication[0].language.text': 'preferred_language',
    'extension[0].valueString': 'ethnicity',
    'extension[1].valueString': 'race'
  },
  Condition: {
    'code.text': 'condition_name',
    'code.coding[0].code': 'condition_code',
    'code.coding[0].system': 'condition_system',
    'code.coding[0].display': 'condition_display',
    'clinicalStatus.coding[0].code': 'clinical_status',
    'verificationStatus.coding[0].code': 'verification_status',
    'category[0].text': 'condition_category',
    'severity.text': 'severity',
    'onsetDateTime': 'onset_date',
    'abatementDateTime': 'abatement_date',
    'recordedDate': 'recorded_date',
    'subject.reference': 'patient_reference',
    'encounter.reference': 'encounter_reference',
    'asserter.reference': 'asserter_reference',
    'note[0].text': 'condition_notes'
  },
  Encounter: {
    'status': 'encounter_status',
    'class.code': 'encounter_class',
    'class.display': 'encounter_class_display',
    'type[0].text': 'encounter_type',
    'type[0].coding[0].code': 'encounter_type_code',
    'serviceType.text': 'service_type',
    'priority.text': 'priority',
    'subject.reference': 'patient_reference',
    'episodeOfCare[0].reference': 'episode_reference',
    'incomingReferral[0].reference': 'referral_reference',
    'participant[0].individual.reference': 'provider_reference',
    'participant[0].type[0].text': 'participant_type',
    'appointment[0].reference': 'appointment_reference',
    'period.start': 'encounter_start',
    'period.end': 'encounter_end',
    'length.value': 'encounter_length',
    'length.unit': 'encounter_length_unit',
    'reasonCode[0].text': 'reason_text',
    'reasonCode[0].coding[0].code': 'reason_code',
    'diagnosis[0].condition.reference': 'diagnosis_reference',
    'diagnosis[0].rank': 'diagnosis_rank',
    'diagnosis[0].use.text': 'diagnosis_use',
    'hospitalization.admitSource.text': 'admit_source',
    'hospitalization.dischargeDisposition.text': 'discharge_disposition',
    'location[0].location.reference': 'location_reference',
    'location[0].status': 'location_status',
    'location[0].period.start': 'location_start',
    'location[0].period.end': 'location_end'
  }
};

// Helper function to safely get nested object values
function getNestedValue(obj: any, path: string): any {
  try {
    return path.split('.').reduce((current, key) => {
      if (current === null || current === undefined) return null;
      
      // Handle array access like [0]
      if (key.includes('[')) {
        const arrayKey = key.split('[')[0];
        const index = parseInt(key.match(/\[(\d+)\]/)?.[1] || '0');
        return current[arrayKey]?.[index] || null;
      }
      
      return current[key];
    }, obj);
  } catch (error) {
    return null;
  }
}

// Helper function to flatten arrays into comma-separated strings
function flattenArray(value: any): string {
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'object' && item !== null) {
        return JSON.stringify(item);
      }
      return String(item);
    }).join('; ');
  }
  return String(value);
}

// Helper function to clean and flatten a single FHIR resource
function cleanResource(resource: FHIRResource, resourceType: string): CleanedResource {
  const cleaned: CleanedResource = {
    id: resource.id || '',
    resourceType: resource.resourceType || resourceType
  };

  const flatteningConfig = FIELD_FLATTENING_CONFIG[resourceType];
  
  if (flatteningConfig) {
    // Apply field flattening configuration
    Object.entries(flatteningConfig).forEach(([fhirPath, csvField]) => {
      const value = getNestedValue(resource, fhirPath);
      
      if (value !== null && value !== undefined && value !== '') {
        // Handle different data types
        if (typeof value === 'boolean') {
          cleaned[csvField] = value;
        } else if (typeof value === 'number') {
          cleaned[csvField] = value;
        } else if (Array.isArray(value)) {
          cleaned[csvField] = flattenArray(value);
        } else if (typeof value === 'object') {
          cleaned[csvField] = JSON.stringify(value);
        } else {
          cleaned[csvField] = String(value).trim();
        }
      }
    });
  } else {
    // Fallback: flatten all top-level fields
    Object.entries(resource).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'resourceType' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          cleaned[key] = flattenArray(value);
        } else if (typeof value === 'object') {
          cleaned[key] = JSON.stringify(value);
        } else {
          cleaned[key] = String(value).trim();
        }
      }
    });
  }

  // Remove empty values
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
      delete cleaned[key];
    }
  });

  return cleaned;
}

// Helper function to load JSON file
function loadJSONFile(filePath: string): { resourceType: string; resources: FHIRResource[] } {
  try {
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileContent = readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (!data.resources || !Array.isArray(data.resources)) {
      throw new Error('Invalid file format: missing resources array');
    }

    return {
      resourceType: data.resourceType || 'Unknown',
      resources: data.resources
    };
  } catch (error) {
    throw new Error(`Failed to load JSON file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to save CSV file
function saveCSVFile(
  data: CleanedResource[],
  outputPath: string,
  resourceType: string
): { success: boolean; error?: string; fields?: string[] } {
  try {
    if (data.length === 0) {
      return { success: false, error: 'No data to export' };
    }

    // Get all unique fields from all records
    const allFields = new Set<string>();
    data.forEach(record => {
      Object.keys(record).forEach(key => allFields.add(key));
    });

    const fields = Array.from(allFields).sort();
    
    // Create CSV parser
    const parser = new Parser({
      fields
    });

    // Parse data to CSV
    const csv = parser.parse(data);

    // Ensure output directory exists
    const outputDir = join(outputPath, '..');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Write CSV file
    writeFileSync(outputPath, csv, 'utf-8');

    return { success: true, fields };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Main function to clean FHIR data
export async function cleanFHIRData(
  inputFilePath: string,
  outputDir: string = 'cleaned-data'
): Promise<CleaningResult> {
  try {
    console.log(`🧹 Cleaning FHIR data from: ${inputFilePath}`);

    // Load the JSON file
    const { resourceType, resources } = loadJSONFile(inputFilePath);
    console.log(`📊 Loaded ${resources.length} ${resourceType} resources`);

    // Clean and flatten each resource
    const cleanedResources: CleanedResource[] = [];
    let processedCount = 0;

    for (const resource of resources) {
      try {
        const cleaned = cleanResource(resource, resourceType);
        if (Object.keys(cleaned).length > 2) { // More than just id and resourceType
          cleanedResources.push(cleaned);
        }
        processedCount++;
        
        if (processedCount % 100 === 0) {
          console.log(`✅ Processed ${processedCount}/${resources.length} ${resourceType} resources`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to clean resource ${resource.id}:`, error);
      }
    }

    console.log(`✅ Successfully cleaned ${cleanedResources.length}/${resources.length} ${resourceType} resources`);

    // Generate output file path
    const fileName = basename(inputFilePath, extname(inputFilePath));
    const outputFileName = fileName.replace('_raw', '') + '.csv';
    const outputPath = join(outputDir, outputFileName);

    // Save as CSV
    const csvResult = saveCSVFile(cleanedResources, outputPath, resourceType);

    if (!csvResult.success) {
      throw new Error(`Failed to save CSV: ${csvResult.error}`);
    }

    console.log(`💾 Saved cleaned data to: ${outputPath}`);
    console.log(`📋 CSV fields: ${csvResult.fields?.length || 0} fields`);

    return {
      resourceType,
      inputFile: inputFilePath,
      outputFile: outputPath,
      originalCount: resources.length,
      cleanedCount: cleanedResources.length,
      success: true,
      fields: csvResult.fields || []
    };

  } catch (error) {
    console.error(`❌ Error cleaning FHIR data:`, error);
    
    return {
      resourceType: 'Unknown',
      inputFile: inputFilePath,
      outputFile: '',
      originalCount: 0,
      cleanedCount: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      fields: []
    };
  }
}

// Function to clean all FHIR data files in a directory
export async function cleanAllFHIRData(
  inputDir: string = 'fhir-data',
  outputDir: string = 'cleaned-data'
): Promise<CleaningResult[]> {
  const fs = require('fs');
  const path = require('path');
  
  try {
    console.log(`🧹 Cleaning all FHIR data from: ${inputDir}`);
    
    if (!existsSync(inputDir)) {
      throw new Error(`Input directory not found: ${inputDir}`);
    }

    // Get all JSON files in the input directory
    const files = fs.readdirSync(inputDir)
      .filter((file: string) => file.endsWith('_raw.json'))
      .map((file: string) => join(inputDir, file));

    console.log(`📁 Found ${files.length} raw JSON files to clean`);

    const results: CleaningResult[] = [];

    // Process each file
    for (const file of files) {
      console.log(`\n🔍 Processing: ${basename(file)}`);
      const result = await cleanFHIRData(file, outputDir);
      results.push(result);
    }

    // Print summary
    console.log('\n📊 Cleaning Summary:');
    results.forEach(result => {
      if (result.success) {
        console.log(`✅ ${result.resourceType}: ${result.cleanedCount}/${result.originalCount} → ${basename(result.outputFile)}`);
      } else {
        console.log(`❌ ${result.resourceType}: Failed - ${result.error}`);
      }
    });

    const totalSuccess = results.filter(r => r.success).length;
    const totalOriginal = results.reduce((sum, r) => sum + r.originalCount, 0);
    const totalCleaned = results.reduce((sum, r) => sum + r.cleanedCount, 0);

    console.log(`\n🎯 Total: ${totalSuccess}/${results.length} files successful`);
    console.log(`📈 Total resources: ${totalCleaned}/${totalOriginal} cleaned`);
    console.log(`📁 Output directory: ${outputDir}`);

    return results;

  } catch (error) {
    console.error('❌ Error cleaning all FHIR data:', error);
    throw error;
  }
} 