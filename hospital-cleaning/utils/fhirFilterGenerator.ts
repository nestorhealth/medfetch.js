import OpenAI from 'openai';

// FHIR Filter Generator using Hybrid Approach
export interface FHIRFilterRequest {
  resourceType: string;
  description: string;
  dateRange?: {
    from: string;
    to: string;
  };
  patientCriteria?: {
    ageRange?: { min: number; max: number };
    gender?: string[];
    conditions?: string[];
  };
}

export interface FHIRFilterResponse {
  filters: Record<string, any>;
  confidence: number;
  reasoning: string;
  codes?: string[];
}

// Enhanced AI prompt for FHIR filter generation
const FHIR_FILTER_PROMPT = `You are a clinical data engineer trained to translate IRB inclusion/exclusion criteria into valid FHIR query filters.

Given a FHIR resource and a plain-English description, return a JSON filter object using real FHIR query syntax.

CRITICAL RULES:
- Use code=<system>|<code> when referencing clinical concepts (SNOMED for Condition, LOINC for Observation, RxNorm for MedicationRequest)
- Include status/date filters if applicable
- Use proper FHIR query parameter syntax
- If nothing matches or description is unclear, return {}
- Do not return text or explanations, only the JSON object
- Always include appropriate status filters (e.g., "clinical-status": "active" for Condition)

COMMON FHIR FILTERS BY RESOURCE:
Patient:
- active: true/false
- gender: male/female/other/unknown
- birthdate: geYYYY-MM-DD, leYYYY-MM-DD

Condition:
- clinical-status: active/inactive/resolved
- code: SNOMED codes for conditions
- onset-date: geYYYY-MM-DD, leYYYY-MM-DD

Observation:
- status: final/amended/cancelled/entered-in-error
- code: LOINC codes for lab values
- date: geYYYY-MM-DD, leYYYY-MM-DD

Procedure:
- status: preparation/in-progress/not-done/on-hold/stopped/completed/entered-in-error/unknown
- code: SNOMED codes for procedures
- date: geYYYY-MM-DD, leYYYY-MM-DD

MedicationRequest:
- status: active/on-hold/cancelled/completed/entered-in-error/stopped/draft/unknown
- medication: RxNorm codes
- authoredon: geYYYY-MM-DD, leYYYY-MM-DD

Encounter:
- status: planned/arrived/triaged/in-progress/onleave/finished/cancelled
- date: geYYYY-MM-DD, leYYYY-MM-DD

COMMON CLINICAL CODES:
Diabetes: http://snomed.info/sct|44054006
Hypertension: http://snomed.info/sct|38341003
HbA1c: http://loinc.org|4548-4
Cholesterol: http://loinc.org|2093-3
Blood Pressure: http://loinc.org|85354-9

EXAMPLES:

Input: Resource: Condition, Description: patients with type 2 diabetes mellitus and hypertension
Output: {
  "code": [
    "http://snomed.info/sct|44054006",
    "http://snomed.info/sct|38341003"
  ],
  "clinical-status": "active"
}

Input: Resource: Observation, Description: HbA1c and cholesterol lab values from 2024-01-01 to 2025-12-31
Output: {
  "code": [
    "http://loinc.org|4548-4",
    "http://loinc.org|2093-3"
  ],
  "status": "final",
  "date": "ge2024-01-01,le2025-12-31"
}

Input: Resource: Patient, Description: active patients aged 18-65
Output: {
  "active": true,
  "birthdate": "le2006-12-31,ge1959-01-01"
}

Now generate filters for the following request:`;

// Rule-based filter generation as fallback
interface FilterTemplate {
  default: Record<string, any>;
  withDateRange?: (from: string, to: string) => Record<string, any>;
  ageBased?: (min: number, max: number) => Record<string, any>;
  genderBased?: (gender: string) => Record<string, any>;
}

const RULE_BASED_FILTERS: Record<string, FilterTemplate> = {
  Patient: {
    default: { active: true },
    ageBased: (min: number, max: number) => ({
      active: true,
      birthdate: `le${new Date().getFullYear() - min}-12-31,ge${new Date().getFullYear() - max}-01-01`
    }),
    genderBased: (gender: string) => ({
      active: true,
      gender: gender.toLowerCase()
    })
  },
  Condition: {
    default: { 'clinical-status': 'active' },
    withDateRange: (from: string, to: string) => ({
      'clinical-status': 'active',
      'onset-date': `ge${from},le${to}`
    })
  },
  Observation: {
    default: { status: 'final' },
    withDateRange: (from: string, to: string) => ({
      status: 'final',
      date: `ge${from},le${to}`
    })
  },
  Procedure: {
    default: { status: 'completed' },
    withDateRange: (from: string, to: string) => ({
      status: 'completed',
      date: `ge${from},le${to}`
    })
  },
  MedicationRequest: {
    default: { status: 'active' },
    withDateRange: (from: string, to: string) => ({
      status: 'active',
      authoredon: `ge${from},le${to}`
    })
  },
  Encounter: {
    default: { status: 'finished' },
    withDateRange: (from: string, to: string) => ({
      status: 'finished',
      date: `ge${from},le${to}`
    })
  }
};

// Clinical concept mapping for rule-based generation
interface ClinicalMapping {
  code: string;
}

interface ClinicalConceptMappings {
  [resourceType: string]: ClinicalMapping;
}

const CLINICAL_CONCEPTS: Record<string, ClinicalConceptMappings> = {
  diabetes: {
    Condition: { code: 'http://snomed.info/sct|44054006' },
    Observation: { code: 'http://loinc.org|4548-4' }
  },
  hypertension: {
    Condition: { code: 'http://snomed.info/sct|38341003' }
  },
  cholesterol: {
    Observation: { code: 'http://loinc.org|2093-3' }
  },
  'blood pressure': {
    Observation: { code: 'http://loinc.org|85354-9' }
  },
  hba1c: {
    Observation: { code: 'http://loinc.org|4548-4' }
  },
  bmi: {
    Observation: { code: 'http://loinc.org|39156-5' }
  }
};

// Initialize OpenAI client
function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not set. Using rule-based filter generation only.');
    return null;
  }
  
  try {
    return new OpenAI({ apiKey });
  } catch (error) {
    console.warn('OpenAI package not available. Using rule-based filter generation only.');
    return null;
  }
}

// Enhanced AI-based filter generation
export async function generateFHIRFiltersAI(request: FHIRFilterRequest): Promise<FHIRFilterResponse> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    console.log('🤖 OpenAI not available, falling back to rule-based generation');
    return generateFHIRFiltersRuleBased(request);
  }

  try {
    console.log(`🤖 Generating AI filters for ${request.resourceType}: ${request.description}`);
    
    const prompt = `${FHIR_FILTER_PROMPT}

Resource: ${request.resourceType}
Description: ${request.description}
${request.dateRange ? `Date Range: ${request.dateRange.from} to ${request.dateRange.to}` : ''}
${request.patientCriteria ? `Patient Criteria: ${JSON.stringify(request.patientCriteria)}` : ''}

Generate the FHIR filters:`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a clinical data engineer. Return only valid JSON filter objects for FHIR queries. No explanations or text outside the JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const filters = JSON.parse(content);
    
    // Validate the response
    if (typeof filters !== 'object' || filters === null) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    console.log(`✅ AI generated filters for ${request.resourceType}:`, filters);
    
    return {
      filters,
      confidence: 0.9,
      reasoning: `AI-generated filters based on description: "${request.description}"`,
      codes: extractCodesFromFilters(filters)
    };

  } catch (error) {
    console.error('❌ AI filter generation failed:', error);
    console.log('🔄 Falling back to rule-based generation');
    return generateFHIRFiltersRuleBased(request);
  }
}

// Rule-based filter generation
export function generateFHIRFiltersRuleBased(request: FHIRFilterRequest): FHIRFilterResponse {
  console.log(`🔧 Generating rule-based filters for ${request.resourceType}: ${request.description}`);
  
  const resourceType = request.resourceType;
  const description = request.description.toLowerCase();
  
  // Get base filters for resource type
  const baseFilters = RULE_BASED_FILTERS[resourceType as keyof typeof RULE_BASED_FILTERS];
  if (!baseFilters) {
    console.warn(`⚠️ No rule-based filters for resource type: ${resourceType}`);
    return {
      filters: {},
      confidence: 0.3,
      reasoning: `No rule-based filters available for ${resourceType}`
    };
  }

  let filters = { ...baseFilters.default };
  let confidence = 0.6;
  let reasoning = `Rule-based filters for ${resourceType}`;
  const codes: string[] = [];

  // Add date range if specified
  if (request.dateRange && baseFilters.withDateRange) {
    filters = { ...filters, ...baseFilters.withDateRange(request.dateRange.from, request.dateRange.to) };
    reasoning += ` with date range ${request.dateRange.from} to ${request.dateRange.to}`;
  }

  // Add clinical concept filters based on description
  for (const [concept, mappings] of Object.entries(CLINICAL_CONCEPTS)) {
    if (description.includes(concept)) {
      const resourceMapping = mappings[resourceType as keyof typeof mappings];
      if (resourceMapping) {
        filters = { ...filters, ...resourceMapping };
        codes.push(resourceMapping.code);
        reasoning += `, includes ${concept}`;
        confidence += 0.1;
      }
    }
  }

  // Add patient criteria if applicable
  if (request.patientCriteria) {
    if (resourceType === 'Patient' && request.patientCriteria.ageRange && RULE_BASED_FILTERS.Patient.ageBased) {
      const ageFilters = RULE_BASED_FILTERS.Patient.ageBased(
        request.patientCriteria.ageRange.min,
        request.patientCriteria.ageRange.max
      );
      filters = { ...filters, ...ageFilters };
      reasoning += `, age range ${request.patientCriteria.ageRange.min}-${request.patientCriteria.ageRange.max}`;
    }
    
    if (resourceType === 'Patient' && request.patientCriteria.gender && RULE_BASED_FILTERS.Patient.genderBased) {
      const genderFilters = RULE_BASED_FILTERS.Patient.genderBased(request.patientCriteria.gender[0]);
      filters = { ...filters, ...genderFilters };
      reasoning += `, gender: ${request.patientCriteria.gender[0]}`;
    }
  }

  // Ensure confidence is within bounds
  confidence = Math.min(0.95, Math.max(0.3, confidence));

  console.log(`✅ Rule-based filters for ${resourceType}:`, filters);
  
  return {
    filters,
    confidence,
    reasoning,
    codes
  };
}

// Hybrid filter generation - tries AI first, falls back to rules
export async function generateFHIRFilters(request: FHIRFilterRequest): Promise<FHIRFilterResponse> {
  try {
    // Try AI first
    const aiResult = await generateFHIRFiltersAI(request);
    
    // If AI returned empty filters, try rule-based
    if (!aiResult.filters || Object.keys(aiResult.filters).length === 0) {
      console.log('🔄 AI returned empty filters, trying rule-based generation');
      return generateFHIRFiltersRuleBased(request);
    }
    
    return aiResult;
  } catch (error) {
    console.error('❌ Hybrid filter generation failed:', error);
    return generateFHIRFiltersRuleBased(request);
  }
}

// Extract codes from filters for validation
function extractCodesFromFilters(filters: Record<string, any>): string[] {
  const codes: string[] = [];
  
  if (filters.code) {
    if (Array.isArray(filters.code)) {
      codes.push(...filters.code);
    } else {
      codes.push(filters.code);
    }
  }
  
  if (filters.medication) {
    if (Array.isArray(filters.medication)) {
      codes.push(...filters.medication);
    } else {
      codes.push(filters.medication);
    }
  }
  
  return codes;
}

// Validate FHIR filters
export function validateFHIRFilters(filters: Record<string, any>, resourceType: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Basic validation
  if (!filters || typeof filters !== 'object') {
    errors.push('Filters must be an object');
    return { valid: false, errors };
  }
  
  // Resource-specific validation
  switch (resourceType) {
    case 'Patient':
      if (filters.active !== undefined && typeof filters.active !== 'boolean') {
        errors.push('Patient active filter must be boolean');
      }
      break;
      
    case 'Condition':
      if (filters['clinical-status'] && !['active', 'inactive', 'resolved'].includes(filters['clinical-status'])) {
        errors.push('Invalid clinical-status for Condition');
      }
      break;
      
    case 'Observation':
      if (filters.status && !['final', 'amended', 'cancelled', 'entered-in-error'].includes(filters.status)) {
        errors.push('Invalid status for Observation');
      }
      break;
      
    case 'Procedure':
      if (filters.status && !['preparation', 'in-progress', 'not-done', 'on-hold', 'stopped', 'completed', 'entered-in-error', 'unknown'].includes(filters.status)) {
        errors.push('Invalid status for Procedure');
      }
      break;
      
    case 'MedicationRequest':
      if (filters.status && !['active', 'on-hold', 'cancelled', 'completed', 'entered-in-error', 'stopped', 'draft', 'unknown'].includes(filters.status)) {
        errors.push('Invalid status for MedicationRequest');
      }
      break;
      
    case 'Encounter':
      if (filters.status && !['planned', 'arrived', 'triaged', 'in-progress', 'onleave', 'finished', 'cancelled'].includes(filters.status)) {
        errors.push('Invalid status for Encounter');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Batch generate filters for multiple resources
export async function generateBatchFHIRFilters(requests: FHIRFilterRequest[]): Promise<Record<string, FHIRFilterResponse>> {
  const results: Record<string, FHIRFilterResponse> = {};
  
  console.log(`🚀 Generating batch filters for ${requests.length} resources`);
  
  // Process requests in parallel
  const promises = requests.map(async (request) => {
    const result = await generateFHIRFilters(request);
    return { resourceType: request.resourceType, result };
  });
  
  const batchResults = await Promise.allSettled(promises);
  
  batchResults.forEach((batchResult, index) => {
    if (batchResult.status === 'fulfilled') {
      results[batchResult.value.resourceType] = batchResult.value.result;
    } else {
      console.error(`❌ Failed to generate filters for ${requests[index].resourceType}:`, batchResult.reason);
      // Fallback to rule-based for failed requests
      results[requests[index].resourceType] = generateFHIRFiltersRuleBased(requests[index]);
    }
  });
  
  console.log(`✅ Batch filter generation completed: ${Object.keys(results).length} successful`);
  
  return results;
} 