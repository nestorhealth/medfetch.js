import { IRBExtraction, FHIRQuery } from './aiProcessing';

// FHIR Query Builder for Dynamic Queries
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
}

// Build FHIR queries from IRB extraction
export function buildFHIRQueries(irbExtraction: IRBExtraction): FHIRQuery[] {
  const queries: FHIRQuery[] = [];
  
  // Use the enhanced queries from IRB extraction if available
  if (irbExtraction.fhir_queries && irbExtraction.fhir_queries.length > 0) {
    queries.push(...irbExtraction.fhir_queries);
  } else {
    // Fallback to basic query generation
    queries.push(...generateBasicQueries(irbExtraction));
  }
  
  // Sort by priority (high -> medium -> low)
  queries.sort((a, b) => {
    const priorityOrder: Record<'high' | 'medium' | 'low', number> = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
  
  console.log(`🔍 Built ${queries.length} FHIR queries from IRB extraction`);
  queries.forEach((query, index) => {
    console.log(`  ${index + 1}. ${query.resourceType} (${query.priority} priority): ${query.reasoning}`);
  });
  
  return queries;
}

// Generate basic queries when enhanced extraction is not available
function generateBasicQueries(irbExtraction: IRBExtraction): FHIRQuery[] {
  const queries: FHIRQuery[] = [];
  
  // Patient query
  queries.push({
    resourceType: 'Patient',
    filters: {
      active: true,
      ...(irbExtraction.filters?.gender && irbExtraction.filters.gender !== 'all' && { gender: irbExtraction.filters.gender }),
      ...(irbExtraction.filters?.age_min && { 'birthdate': `le${new Date().getFullYear() - parseInt(irbExtraction.filters.age_min)}-12-31` }),
      ...(irbExtraction.filters?.age_max && { 'birthdate': `ge${new Date().getFullYear() - parseInt(irbExtraction.filters.age_max)}-01-01` })
    },
    count: irbExtraction.target_patient_count || 100,
    priority: 'high',
    reasoning: 'Primary patient population for study'
  });
  
  // Add queries for each resource type mentioned
  irbExtraction.resources.forEach(resourceType => {
    if (resourceType === 'Patient') return; // Already handled
    
    const query = generateResourceQuery(resourceType, irbExtraction);
    if (query) {
      queries.push(query);
    }
  });
  
  return queries;
}

// Generate query for specific resource type
function generateResourceQuery(resourceType: string, irbExtraction: IRBExtraction): FHIRQuery | null {
  const baseFilters: Record<string, any> = {};
  
  switch (resourceType) {
    case 'Condition':
      baseFilters['clinical-status'] = 'active';
      if (irbExtraction.filters?.conditions) {
        // Add condition-specific filters if available
        baseFilters.code = irbExtraction.filters.conditions;
      }
      break;
      
    case 'Procedure':
      baseFilters.status = 'completed';
      if (irbExtraction.filters?.procedures) {
        baseFilters.code = irbExtraction.filters.procedures;
      }
      break;
      
    case 'Observation':
      baseFilters.status = 'final';
      break;
      
    case 'MedicationRequest':
      baseFilters.status = 'active';
      if (irbExtraction.filters?.medications) {
        baseFilters.medication = irbExtraction.filters.medications;
      }
      break;
      
    case 'Encounter':
      baseFilters.status = 'finished';
      break;
      
    default:
      // For unknown resource types, use basic filters
      break;
  }
  
  // Add date range filters if specified
  if (irbExtraction.date_range) {
    const dateField = getDateFieldForResource(resourceType);
    if (dateField) {
      baseFilters[dateField] = `ge${irbExtraction.date_range.from}`;
    }
  }
  
  return {
    resourceType,
    filters: baseFilters,
    count: (irbExtraction.target_patient_count || 100) * getResourceMultiplier(resourceType),
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

// Get resource multiplier for count calculation
function getResourceMultiplier(resourceType: string): number {
  const multipliers: Record<string, number> = {
    'Patient': 1,
    'Condition': 2,
    'Procedure': 1.5,
    'Observation': 3,
    'MedicationRequest': 2,
    'Encounter': 1.5
  };
  
  return multipliers[resourceType] || 1;
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

// Execute FHIR queries against HAPI server
export async function executeFHIRQueries(queries: FHIRQuery[]): Promise<FHIRQuerySummary> {
  const results: FHIRQueryResult[] = [];
  const errors: string[] = [];
  const resourceBreakdown: Record<string, number> = {};
  const startTime = Date.now();
  
  console.log(`🚀 Executing ${queries.length} FHIR queries...`);
  
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
    errors
  };
  
  console.log(`✅ FHIR Query Execution Summary:`, {
    totalQueries: summary.totalQueries,
    successfulQueries: summary.successfulQueries,
    totalResources: summary.totalResources,
    executionTime: `${summary.executionTime}ms`,
    errors: summary.errors.length
  });
  
  return summary;
}

// Simplify filters to avoid HAPI server issues
function simplifyFilters(filters: Record<string, any>): Record<string, any> {
  const simplified: Record<string, any> = {};
  
  Object.entries(filters).forEach(([key, value]) => {
    // Skip complex date ranges that might cause issues
    if (key.includes('date') && typeof value === 'string' && value.includes(',')) {
      // For date ranges, use a more recent date that's likely to have data
      if (key.includes('birthdate')) {
        // For birthdate, use a reasonable range that's likely to have data
        simplified[key] = 'ge1950-01-01';
      } else {
        // For other dates, use a recent date
        simplified[key] = 'ge2020-01-01';
      }
    }
    // Handle arrays by taking only the first few items
    else if (Array.isArray(value) && value.length > 2) {
      simplified[key] = value.slice(0, 2);
    }
    // Skip empty arrays
    else if (Array.isArray(value) && value.length === 0) {
      // Skip empty arrays entirely
      return;
    }
    // Keep simple values as is
    else {
      simplified[key] = value;
    }
  });
  
  return simplified;
}

// Execute a single FHIR query
async function executeSingleQuery(query: FHIRQuery): Promise<FHIRQueryResult> {
  const startTime = Date.now();
  
  try {
    // Simplify filters to avoid HAPI server issues
    const simplifiedFilters = simplifyFilters(query.filters);
    console.log(`🔍 Executing ${query.resourceType} query with filters:`, simplifiedFilters);
    
    // Build query URL - using HAPI FHIR test server
    const baseUrl = 'https://hapi.fhir.org/baseR4';
    const queryParams = new URLSearchParams();
    
    // Add filters with proper array handling
    Object.entries(simplifiedFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Handle arrays by adding each value separately
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
    
    // Execute query
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json'
      }
    });
    
    if (!response.ok) {
      // Try to get more detailed error information
      let errorDetails = `${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.issue && errorData.issue.length > 0) {
          errorDetails += ` - ${errorData.issue[0].diagnostics || 'Unknown error'}`;
        }
      } catch (e) {
        // If we can't parse the error response, use the status text
      }
      throw new Error(`HTTP ${errorDetails}`);
    }
    
    const data = await response.json();
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