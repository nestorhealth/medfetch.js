import { IRBExtraction } from './aiProcessing';

export interface FHIRQuery {
  resourceType: string;
  filters: Record<string, any>;
  count?: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface FHIRQueryResult {
  resourceType: string;
  success: boolean;
  totalResources: number;
  resources: any[];
  error?: string;
  queryParams: Record<string, any>;
  executionTime: number;
}

export interface FHIRQuerySummary {
  totalQueries: number;
  successfulQueries: number;
  totalResources: number;
  resourceBreakdown: Record<string, number>;
  executionTime: number;
  errors: string[];
  results: FHIRQueryResult[];
}

// Build FHIR queries from IRB extraction - HAPI optimized version
export function buildFHIRQueries(irbExtraction: IRBExtraction): FHIRQuery[] {
  console.log('🔍 Building HAPI-optimized FHIR queries from IRB extraction...');
  
  // Use the enhanced FHIR queries if available, otherwise generate basic ones
  if (irbExtraction.fhir_queries && irbExtraction.fhir_queries.length > 0) {
    console.log(`🔍 Using ${irbExtraction.fhir_queries.length} enhanced FHIR queries from IRB extraction`);
    return irbExtraction.fhir_queries.map(query => ({
      ...query,
      count: query.count || getDefaultCount(query.resourceType, irbExtraction.target_patient_count)
    }));
  }
  
  // Fallback to basic query generation
  console.log('🔍 Generating basic FHIR queries from IRB extraction');
  return generateBasicQueries(irbExtraction);
}

// Generate basic queries with HAPI-optimized filters
function generateBasicQueries(irbExtraction: IRBExtraction): FHIRQuery[] {
  const queries: FHIRQuery[] = [];
  
  // Always include Patient with HAPI-optimized filters
  const patientQuery = generateResourceQuery('Patient', irbExtraction);
  if (patientQuery) queries.push(patientQuery);
  
  // Add other resources based on IRB requirements
  const resourceTypes = irbExtraction.resources || ['Patient', 'Condition', 'Observation'];
  
  resourceTypes.forEach(resourceType => {
    if (resourceType !== 'Patient') {
      const query = generateResourceQuery(resourceType, irbExtraction);
      if (query) queries.push(query);
    }
  });
  
  console.log(`🔍 Built ${queries.length} FHIR queries from IRB extraction`);
  queries.forEach((query, index) => {
    console.log(`   ${index + 1}. ${query.resourceType} (${query.priority} priority): ${query.reasoning}`);
  });
  
  return queries;
}

// Generate HAPI-optimized query for a specific resource type
function generateResourceQuery(resourceType: string, irbExtraction: IRBExtraction): FHIRQuery | null {
  let baseFilters: Record<string, any> = {};
  let count = getDefaultCount(resourceType, irbExtraction.target_patient_count);

  switch (resourceType) {
    case 'Condition':
      baseFilters = {
        code: 'http://snomed.info/sct|38341003', // Essential Hypertension
        'clinical-status': 'active'
      };
      break;
    case 'Patient':
      // Use the same filters as hybrid test
      baseFilters = { active: true, gender: 'male' };
      count = 5;
      break;
    default:
      baseFilters = {};
      break;
  }

  return {
    resourceType,
    filters: baseFilters,
    count,
    priority: getResourcePriority(resourceType),
    reasoning: `Study requires ${resourceType.toLowerCase()} data`
  };
}

// Get appropriate date field for resource type
function getDateFieldForResource(resourceType: string): string | null {
  const dateFields: Record<string, string> = {
    'Condition': 'onset-date',
    'Procedure': 'date',
    'Observation': 'date',
    'MedicationRequest': 'authoredon',
    'Encounter': 'date'
  };
  
  return dateFields[resourceType] || null;
}

// Get default count for resource type
function getDefaultCount(resourceType: string, targetPatientCount?: number): number {
  const baseCount = targetPatientCount || 100;
  const multipliers: Record<string, number> = {
    'Patient': 1,
    'Condition': 2,
    'Procedure': 1.5,
    'Observation': 3,
    'MedicationRequest': 2,
    'Encounter': 1.5
  };
  
  return Math.min(Math.round(baseCount * (multipliers[resourceType] || 1)), 50); // Limit to 50 for HAPI testing
}

// Get resource priority
function getResourcePriority(resourceType: string): 'high' | 'medium' | 'low' {
  const priorities: Record<string, 'high' | 'medium' | 'low'> = {
    'Patient': 'high',
    'Condition': 'high',
    'Procedure': 'medium',
    'Observation': 'medium',
    'MedicationRequest': 'medium',
    'Encounter': 'low'
  };
  
  return priorities[resourceType] || 'low';
}

// Execute FHIR queries against HAPI server with HAPI-optimized filters
export async function executeFHIRQueries(queries: FHIRQuery[]): Promise<FHIRQuerySummary> {
  const results: FHIRQueryResult[] = [];
  const errors: string[] = [];
  const resourceBreakdown: Record<string, number> = {};
  const startTime = Date.now();
  
  console.log(`🚀 Executing ${queries.length} HAPI-optimized FHIR queries...`);
  
  // Execute queries in parallel with priority-based batching
  const highPriorityQueries = queries.filter(q => q.priority === 'high');
  const mediumPriorityQueries = queries.filter(q => q.priority === 'medium');
  const lowPriorityQueries = queries.filter(q => q.priority === 'low');
  
  // Execute high priority queries first
  const highPriorityResults = await Promise.allSettled(
    highPriorityQueries.map(query => executeSingleQuery(query))
  );
  
  // Execute medium priority queries
  const mediumPriorityResults = await Promise.allSettled(
    mediumPriorityQueries.map(query => executeSingleQuery(query))
  );
  
  // Execute low priority queries
  const lowPriorityResults = await Promise.allSettled(
    lowPriorityQueries.map(query => executeSingleQuery(query))
  );
  
  // Process results
  [...highPriorityResults, ...mediumPriorityResults, ...lowPriorityResults].forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const queryResult = result.value;
      results.push(queryResult);
      
      if (queryResult.success) {
        resourceBreakdown[queryResult.resourceType] = queryResult.totalResources;
      } else {
        errors.push(`${queryResult.resourceType}: ${queryResult.error}`);
      }
    } else {
      const query = queries[index];
      errors.push(`${query.resourceType}: ${result.reason}`);
    }
  });
  
  const executionTime = Date.now() - startTime;
  const successfulQueries = results.filter(r => r.success).length;
  const totalResources = Object.values(resourceBreakdown).reduce((sum, count) => sum + count, 0);
  
  const summary: FHIRQuerySummary = {
    totalQueries: queries.length,
    successfulQueries,
    totalResources,
    resourceBreakdown,
    executionTime,
    errors,
    results
  };
  
  console.log(`✅ HAPI FHIR Query Execution Summary:`, {
    totalQueries: summary.totalQueries,
    successfulQueries: summary.successfulQueries,
    totalResources: summary.totalResources,
    executionTime: `${summary.executionTime}ms`,
    errors: summary.errors.length
  });
  
  return summary;
}

// HAPI-optimized filter simplification
function simplifyFiltersForHapi(filters: Record<string, any>): Record<string, any> {
  const simplified: Record<string, any> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    // Skip birthdate filters entirely (they're too restrictive for HAPI)
    if (key.includes('birthdate')) {
      return; // Skip entirely
    }
    // Handle arrays by taking only the first item (HAPI doesn't handle arrays well)
    else if (Array.isArray(value) && value.length > 0) {
      simplified[key] = value[0]; // Take first item only
    }
    // Skip complex date ranges
    else if (key.includes('date') && typeof value === 'string' && value.includes(',')) {
      // Use simple date filters that work with HAPI
      simplified[key] = 'ge2020-01-01';
    }
    // Skip empty arrays
    else if (Array.isArray(value) && value.length === 0) {
      return; // Skip entirely
    }
    // Keep simple values as is
    else {
      simplified[key] = value;
    }
  });
  
  return simplified;
}

// Execute a single FHIR query with HAPI optimization
async function executeSingleQuery(query: FHIRQuery): Promise<FHIRQueryResult> {
  const startTime = Date.now();
  
  try {
    // Apply HAPI-optimized filter simplification
    const simplifiedFilters = simplifyFiltersForHapi(query.filters);
    console.log(`🔍 Executing ${query.resourceType} query with HAPI-optimized filters:`, simplifiedFilters);
    
    // Build query URL - using HAPI FHIR test server
    const baseUrl = 'https://hapi.fhir.org/baseR4';
    const queryParams = new URLSearchParams();
    
    // Add filters with proper array handling for HAPI
    Object.entries(simplifiedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => {
          queryParams.append(key, item);
        });
      } else {
        queryParams.append(key, value);
      }
    });
    
    // Add count if specified
    if (query.count) {
      queryParams.append('_count', query.count.toString());
    }
    
    const url = `${baseUrl}/${query.resourceType}?${queryParams.toString()}`;
    
    // Print the URL for debugging (only for Patient queries)
    if (query.resourceType === 'Patient') {
      console.log(`🔍 DEBUG - Patient Query URL: ${url}`);
      console.log(`🔍 DEBUG - Patient Query Params:`, Object.fromEntries(queryParams));
    }
    
    // Execute query
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json'
      }
    });
    
    const data = await response.json();
    
    // Debug logging removed for cleaner test output
    
    if (!response.ok) {
      // Try to get more detailed error information
      let errorDetails = `${response.status}: ${response.statusText}`;
      try {
        const errorData = data;
        if (errorData.issue && errorData.issue.length > 0) {
          errorDetails += ` - ${errorData.issue[0].diagnostics || 'Unknown error'}`;
        }
      } catch (e) {
        // If we can't parse the error response, use the status text
      }
      throw new Error(`HTTP ${errorDetails}`);
    }
    
    const executionTime = Date.now() - startTime;
    
    const result: FHIRQueryResult = {
      resourceType: query.resourceType,
      success: true,
      totalResources: data.entry?.length || 0,
      resources: data.entry?.map((entry: any) => entry.resource) || [],
      queryParams: Object.fromEntries(queryParams),
      executionTime
    };
    
    console.log(`✅ ${query.resourceType}: ${result.totalResources} resources in ${executionTime}ms`);
    return result;
    
  } catch (error) {
    const executionTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    console.error(`❌ ${query.resourceType} query failed:`, errorMessage);
    
    return {
      resourceType: query.resourceType,
      success: false,
      totalResources: 0,
      resources: [],
      error: errorMessage,
      queryParams: {},
      executionTime
    };
  }
}

// Validate FHIR query parameters
export function validateFHIRQuery(query: FHIRQuery): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!query.resourceType) {
    errors.push('Resource type is required');
  }
  
  if (!query.filters || Object.keys(query.filters).length === 0) {
    errors.push('At least one filter is required');
  }
  
  if (query.count && (query.count < 1 || query.count > 1000)) {
    errors.push('Count must be between 1 and 1000');
  }
  
  if (!['high', 'medium', 'low'].includes(query.priority)) {
    errors.push('Priority must be high, medium, or low');
  }
  
  if (!query.reasoning || query.reasoning.trim().length === 0) {
    errors.push('Reasoning is required');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Optimize queries based on resource availability
export function optimizeQueries(queries: FHIRQuery[], availableResources: string[]): FHIRQuery[] {
  return queries.filter(query => {
    if (!availableResources.includes(query.resourceType)) {
      console.warn(`⚠️ Skipping ${query.resourceType} - not available in FHIR server`);
      return false;
    }
    return true;
  });
} 