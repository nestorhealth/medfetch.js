import axios from 'axios';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { IRBExtraction } from './aiProcessing';

// FHIR Query Engine Types
export interface FHIRQueryParams {
  resources: string[];
  filters: Record<string, string>;
  date_range: {
    from: string;
    to: string;
  };
}

export interface FHIRResource {
  resourceType: string;
  id: string;
  [key: string]: any;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'searchset';
  total: number;
  entry: Array<{
    resource: FHIRResource;
  }>;
  link?: Array<{
    relation: string;
    url: string;
  }>;
}

export interface QueryResult {
  resourceType: string;
  totalResources: number;
  fileName: string;
  success: boolean;
  error?: string;
}

// FHIR Server Configuration
const FHIR_BASE_URL = 'http://hapi.fhir.org/baseR4';

// Query parameter mappings for different resource types
const RESOURCE_QUERY_MAPPINGS: Record<string, Record<string, string>> = {
  Patient: {
    gender: 'gender',
    age_min: 'birthdate=le',
    age_max: 'birthdate=ge',
    conditions: '_has:Condition:patient:code',
    medications: '_has:MedicationRequest:patient:medication'
  },
  Condition: {
    conditions: 'code',
    date_range: '_lastUpdated',
    patient_gender: '_has:Patient:condition:gender'
  },
  Encounter: {
    date_range: 'date',
    patient_gender: '_has:Patient:encounter:gender',
    conditions: '_has:Condition:encounter:code'
  },
  Observation: {
    date_range: 'date',
    patient_gender: '_has:Patient:observation:gender',
    conditions: '_has:Condition:observation:code'
  },
  MedicationRequest: {
    medications: 'medication',
    date_range: 'authoredon',
    patient_gender: '_has:Patient:medicationrequest:gender'
  },
  Procedure: {
    procedures: 'code',
    date_range: 'date',
    patient_gender: '_has:Patient:procedure:gender'
  }
};

// Helper function to build FHIR query parameters
function buildQueryParams(
  resourceType: string,
  filters: Record<string, string>,
  dateRange: { from: string; to: string }
): Record<string, any> {
  const params: Record<string, any> = {
    _count: '100', // Number of resources per page
    _format: 'json'
  };

  // Add date range filter
  if (dateRange.from && dateRange.to) {
    const mapping = RESOURCE_QUERY_MAPPINGS[resourceType];
    if (mapping?.date_range) {
      params[mapping.date_range] = [`ge${dateRange.from}`, `le${dateRange.to}`];
    } else {
      // Default to _lastUpdated for resources without specific date fields
      params['_lastUpdated'] = [`ge${dateRange.from}`, `le${dateRange.to}`];
    }
  }

  // Add resource-specific filters
  Object.entries(filters).forEach(([key, value]) => {
    const mapping = RESOURCE_QUERY_MAPPINGS[resourceType];
    if (mapping?.[key]) {
      params[mapping[key]] = value;
    }
  });

  return params;
}

// Helper function to fetch a single page of resources
async function fetchResourcePage(
  resourceType: string,
  params: Record<string, any>,
  pageUrl?: string
): Promise<FHIRBundle> {
  try {
    const url = pageUrl || `${FHIR_BASE_URL}/${resourceType}`;
    console.log(`🔍 Fetching ${resourceType} from: ${url}`);
    console.log(`📋 Query params:`, params);

    const response = await axios.get(url, {
      params: pageUrl ? undefined : params,
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json'
      },
      timeout: 30000 // 30 second timeout
    });

    if (response.status !== 200) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.data as FHIRBundle;
  } catch (error) {
    console.error(`❌ Error fetching ${resourceType}:`, error);
    throw error;
  }
}

// Helper function to fetch all pages for a resource type
async function fetchAllResourcePages(
  resourceType: string,
  params: Record<string, any>,
  maxPages: number = 5  // Limit to 5 pages for testing
): Promise<FHIRResource[]> {
  const allResources: FHIRResource[] = [];
  let nextUrl: string | undefined;
  let pageCount = 0;

  try {
    do {
      pageCount++;
      console.log(`📄 Fetching ${resourceType} page ${pageCount}...`);
      
      const bundle = await fetchResourcePage(resourceType, params, nextUrl);
      
      if (bundle.entry && bundle.entry.length > 0) {
        const resources = bundle.entry.map(entry => entry.resource);
        allResources.push(...resources);
        console.log(`✅ Page ${pageCount}: Found ${resources.length} ${resourceType} resources`);
      }

      // Check for next page
      nextUrl = undefined;
      if (bundle.link && pageCount < maxPages) {
        const nextLink = bundle.link.find(link => link.relation === 'next');
        if (nextLink) {
          nextUrl = nextLink.url;
        }
      }

      // Stop if we've reached the max pages
      if (pageCount >= maxPages) {
        console.log(`⏹️  Stopping at ${maxPages} pages for testing purposes`);
        break;
      }

    } while (nextUrl);

    console.log(`🎉 Completed fetching ${resourceType}: ${allResources.length} total resources (${pageCount} pages)`);
    return allResources;

  } catch (error) {
    console.error(`❌ Error fetching all pages for ${resourceType}:`, error);
    throw error;
  }
}

// Helper function to save resources to JSON file
function saveResourcesToFile(
  resourceType: string,
  resources: FHIRResource[],
  outputDir: string = 'fhir-data'
): string {
  try {
    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${resourceType}_raw.json`;
    const filePath = join(outputDir, fileName);

    const outputData = {
      resourceType,
      totalCount: resources.length,
      timestamp: new Date().toISOString(),
      resources
    };

    writeFileSync(filePath, JSON.stringify(outputData, null, 2));
    console.log(`💾 Saved ${resources.length} ${resourceType} resources to: ${filePath}`);
    
    return fileName;
  } catch (error) {
    console.error(`❌ Error saving ${resourceType} to file:`, error);
    throw error;
  }
}

// Main FHIR Query Engine function
export async function fetchFHIRResources(
  irbQuery: FHIRQueryParams | IRBExtraction,
  outputDir: string = 'fhir-data'
): Promise<QueryResult[]> {
  const results: QueryResult[] = [];
  
  console.log('🚀 Starting FHIR Query Engine...');
  console.log('📋 IRB Query:', JSON.stringify(irbQuery, null, 2));

  // Process each resource type
  for (const resourceType of irbQuery.resources) {
    console.log(`\n🔍 Processing resource type: ${resourceType}`);
    
    try {
      // Build query parameters for this resource type
      const params = buildQueryParams(resourceType, irbQuery.filters, irbQuery.date_range);
      
      // Fetch all resources with pagination
      const resources = await fetchAllResourcePages(resourceType, params);
      
      // Save to file
      const fileName = saveResourcesToFile(resourceType, resources, outputDir);
      
      // Record success
      results.push({
        resourceType,
        totalResources: resources.length,
        fileName,
        success: true
      });

    } catch (error) {
      console.error(`❌ Failed to process ${resourceType}:`, error);
      
      // Record failure
      results.push({
        resourceType,
        totalResources: 0,
        fileName: `${resourceType}_raw.json`,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // Print summary
  console.log('\n📊 FHIR Query Summary:');
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.resourceType}: ${result.totalResources} resources → ${result.fileName}`);
    } else {
      console.log(`❌ ${result.resourceType}: Failed - ${result.error}`);
    }
  });

  const totalSuccess = results.filter(r => r.success).length;
  const totalResources = results.reduce((sum, r) => sum + r.totalResources, 0);
  
  console.log(`\n🎯 Total: ${totalSuccess}/${results.length} resource types successful`);
  console.log(`📈 Total resources fetched: ${totalResources}`);
  console.log(`📁 Output directory: ${outputDir}`);

  return results;
}

// Utility function to get FHIR server status
export async function checkFHIRServerStatus(): Promise<boolean> {
  try {
    console.log('🔍 Checking FHIR server status...');
    const response = await axios.get(`${FHIR_BASE_URL}/metadata`, {
      timeout: 10000
    });
    
    if (response.status === 200) {
      console.log('✅ FHIR server is accessible');
      return true;
    } else {
      console.log('❌ FHIR server returned unexpected status:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ FHIR server is not accessible:', error);
    return false;
  }
}

// Utility function to get available resource types
export async function getAvailableResourceTypes(): Promise<string[]> {
  try {
    const response = await axios.get(`${FHIR_BASE_URL}/metadata`);
    const metadata = response.data;
    
    if (metadata.rest && metadata.rest[0] && metadata.rest[0].resource) {
      return metadata.rest[0].resource.map((r: any) => r.type);
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching available resource types:', error);
    return [];
  }
} 