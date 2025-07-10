import OpenAI from 'openai';
import { z } from 'zod';
import type { Patient, Procedure } from './fhirProcessing';
import pdfParse from 'pdf-parse';
import { generateFHIRFilters, type FHIRFilterRequest } from './fhirFilterGenerator';

// Initialize OpenAI client with error handling
function getOpenAIClient() {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key status:', {
      NEXT_PUBLIC_OPENAI_API_KEY: process.env.NEXT_PUBLIC_OPENAI_API_KEY ? 'set' : 'not set',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'set' : 'not set'
    });
    throw new Error(
      'OpenAI API key not set. Please ensure you have both NEXT_PUBLIC_OPENAI_API_KEY and OPENAI_API_KEY in your .env file and restart the Next.js development server.'
    );
  }

  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Required for client-side usage
  });
}

// Types for AI processing
export interface ManifestSuggestion {
  field: string;
  fhirPath: string;
  confidence: number;
  explanation: string;
}

export interface AnomalyDetection {
  path: string;
  issue: string;
  suggestion: string | null;
  confidence: number;
  resourceId: string;  // ID of the resource this anomaly was detected in
}

export interface RunSummary {
  text: string;
  stats: {
    totalRecords: number;
    cleanedRecords: number;
    anomaliesFound: number;
    suggestionsApplied: number;
  };
}

// IRB Parsing Types
export interface IRBExtraction {
  resources: string[];
  filters: Record<string, string>;
  date_range: {
    from: string;
    to: string;
  };
  study_title?: string;
  principal_investigator?: string;
  target_patient_count?: number;
  additional_notes?: string;
  // Enhanced FHIR query parameters
  fhir_queries: FHIRQuery[];
  patient_criteria?: PatientCriteria;
  data_requirements?: DataRequirements;
}

export interface FHIRQuery {
  resourceType: string;
  filters: Record<string, any>;
  count?: number;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
}

export interface PatientCriteria {
  age_range?: {
    min: number;
    max: number;
  };
  gender?: string[];
  conditions?: string[];
  procedures?: string[];
  medications?: string[];
  encounter_types?: string[];
}

export interface DataRequirements {
  minimum_records?: number;
  preferred_records?: number;
  data_quality_requirements?: string[];
  privacy_considerations?: string[];
}

// AI Manifest Mapping
export async function suggestManifestMappings(
  samples: any[],
  resourceType: string,
  tableName: string
): Promise<ManifestSuggestion[]> {
  const prompt = `
    Here are sample rows from the '${tableName}' table:
    ${JSON.stringify(samples, null, 2)}
    
    Let's map these columns to FHIR ${resourceType} fields. For each column, suggest a FHIRPath expression.
    Return the response as a JSON array of objects with:
    - field: the original column name
    - fhirPath: the suggested FHIRPath expression
    - confidence: a number between 0 and 1
    - explanation: brief explanation of the mapping
    
    Example response format:
    [
      {
        "field": "first_name",
        "fhirPath": "name[0].given[0]",
        "confidence": 0.95,
        "explanation": "Maps to the first given name in the first name array"
      }
    ]
  `;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const response = JSON.parse(content);
    return response.mappings as ManifestSuggestion[];
  } catch (error) {
    console.error('Error getting manifest suggestions:', error);
    throw new Error('Failed to generate manifest suggestions');
  }
}

// AI Anomaly Detection
export async function detectAnomalies(
  resource: Patient | Procedure
): Promise<AnomalyDetection[]> {
  const prompt = `
    Here is a FHIR ${resource.resourceType} resource that may have missing or anomalous fields:
    ${JSON.stringify(resource, null, 2)}

    Analyze this resource and identify any anomalies or missing values.
    Return the response as a JSON object with a single key "anomalies" containing an array of objects with:
    - path: the FHIRPath to the field
    - issue: description of the anomaly
    - suggestion: suggested fix or null if no fix needed
    - confidence: a number between 0 and 1

    Example response format:
    {
      "anomalies": [
        {
          "path": "name[0].given",
          "issue": "Missing given name",
          "suggestion": "['Unknown']",
          "confidence": 0.9
        }
      ]
    }
  `;

  try {
    console.log('Starting anomaly detection for resource:', resource.id);
    const openai = getOpenAIClient();
    
    console.log('Sending request to OpenAI...');
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      console.error('OpenAI response had no content');
      throw new Error('No content received from OpenAI');
    }

    console.log('Received response from OpenAI:', content);
    const response = JSON.parse(content);
    
    if (!response.anomalies || !Array.isArray(response.anomalies)) {
      console.error('Invalid response format:', response);
      throw new Error('Invalid response format from OpenAI - expected anomalies array');
    }

    // Add resourceId to each anomaly
    return response.anomalies.map((anomaly: Omit<AnomalyDetection, 'resourceId'>) => ({
      ...anomaly,
      resourceId: resource.id
    }));
  } catch (error) {
    console.error('Error in detectAnomalies:', {
      error,
      resourceId: resource.id,
      resourceType: resource.resourceType,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to detect anomalies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// AI Run Summary
export async function generateRunSummary(
  resources: (Patient | Procedure)[],
  anomalies: AnomalyDetection[]
): Promise<RunSummary> {
  const prompt = `
    Here is a summary of a data cleaning run:
    - Total records: ${resources.length}
    - Anomalies found: ${anomalies.length}
    - Sample anomalies: ${JSON.stringify(anomalies.slice(0, 3), null, 2)}

    Generate a one-sentence summary of this cleaning run, focusing on the key insights and any notable issues.
    Also provide statistics about the run.
    
    Return the response as a JSON object with:
    - text: the one-sentence summary
    - stats: object containing totalRecords, cleanedRecords, anomaliesFound, suggestionsApplied
  `;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    return JSON.parse(content) as RunSummary;
  } catch (error) {
    console.error('Error generating run summary:', error);
    throw new Error('Failed to generate run summary');
  }
}

// AI Natural Language Query
export async function processNaturalLanguageQuery(
  query: string,
  resources: (Patient | Procedure)[]
): Promise<(Patient | Procedure)[]> {
  const prompt = `
    Here are FHIR resources:
    ${JSON.stringify(resources, null, 2)}

    Return only those entries matching this natural language query: "${query}"
    Return the response as a JSON array of the matching resources.
    Explain your filtering logic in a brief note.
  `;

  try {
    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    const response = JSON.parse(content);
    return response.matches as (Patient | Procedure)[];
  } catch (error) {
    console.error('Error processing natural language query:', error);
    throw new Error('Failed to process query');
  }
}

// Enhanced query enhancement with hybrid filter generation
async function enhanceQueriesWithHybridFilters(queries: FHIRQuery[], extraction: any): Promise<FHIRQuery[]> {
  console.log(`🔧 Enhancing ${queries.length} queries with hybrid filter generation`);
  
  const enhancedQueries: FHIRQuery[] = [];
  
  for (const query of queries) {
    if (!query.filters || Object.keys(query.filters).length === 0) {
      // Generate filters using hybrid approach
      const filterRequest: FHIRFilterRequest = {
        resourceType: query.resourceType,
        description: query.reasoning || `Study requires ${query.resourceType.toLowerCase()} data`,
        dateRange: extraction.date_range,
        patientCriteria: extraction.patient_criteria
      };
      
      try {
        const filterResponse = await generateFHIRFilters(filterRequest);
        
        const enhancedQuery: FHIRQuery = {
          ...query,
          filters: filterResponse.filters,
          count: Math.min(query.count || 100, getResourceCountLimit(query.resourceType))
        };
        
        console.log(`✅ Enhanced ${query.resourceType} query:`, {
          originalFilters: query.filters,
          enhancedFilters: filterResponse.filters,
          confidence: filterResponse.confidence,
          reasoning: filterResponse.reasoning
        });
        
        enhancedQueries.push(enhancedQuery);
      } catch (error) {
        console.error(`❌ Failed to enhance ${query.resourceType} query:`, error);
        // Fallback to basic filters
        enhancedQueries.push({
          ...query,
          filters: getBasicFilters(query.resourceType),
          count: Math.min(query.count || 100, getResourceCountLimit(query.resourceType))
        });
      }
    } else {
      // Query already has filters, keep as is
      enhancedQueries.push(query);
    }
  }
  
  return enhancedQueries;
}

// Helper function to get basic filters for a resource type
function getBasicFilters(resourceType: string): Record<string, any> {
  switch (resourceType) {
    case 'Patient':
      return { active: true };
    case 'Condition':
      return { 'clinical-status': 'active' };
    case 'Observation':
      return { status: 'final' };
    case 'Procedure':
      return { status: 'completed' };
    case 'Encounter':
      return { status: 'finished' };
    case 'MedicationRequest':
      return { status: 'active' };
    default:
      return {};
  }
}

// Helper function to get count limits for resources
function getResourceCountLimit(resourceType: string): number {
  const limits: Record<string, number> = {
    'Patient': 50,
    'Condition': 100,
    'Observation': 150,
    'Procedure': 75,
    'Encounter': 75,
    'MedicationRequest': 100
  };
  
  return limits[resourceType] || 50;
}

// IRB Document Parser with Enhanced FHIR Query Extraction
export async function parseIRBDocument(
  fileContent: Buffer | string,
  fileType: 'pdf' | 'txt'
): Promise<IRBExtraction> {
  let textContent: string;

  try {
    // Extract text from file
    if (fileType === 'pdf') {
      const pdfData = await pdfParse(fileContent as Buffer);
      textContent = pdfData.text;
    } else {
      textContent = fileContent as string;
    }

    console.log('Extracted text content length:', textContent.length);
    
    // Use OpenAI function calling to extract structured data with enhanced FHIR query parameters
    const openai = getOpenAIClient();
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert at parsing Institutional Review Board (IRB) documents and extracting comprehensive information needed for dynamic FHIR data queries. 

Your task is to analyze the IRB document and extract:
1. Basic study information (title, PI, target patient count)
2. Required FHIR resource types
3. Patient inclusion/exclusion criteria
4. Specific medical conditions, procedures, medications mentioned
5. Study timeline and data collection periods
6. Detailed FHIR query parameters for each resource type

Be thorough and extract specific medical terminology, convert to appropriate FHIR resource types and codes, and generate intelligent query filters.`
        },
        {
          role: "user",
          content: `Please parse this IRB document and extract comprehensive information for dynamic FHIR querying:\n\n${textContent.substring(0, 8000)}`
        }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extract_enhanced_irb_data",
            description: "Extract comprehensive structured data from IRB document for dynamic FHIR querying",
            parameters: {
              type: "object",
              properties: {
                study_title: { type: "string", description: "Title of the study" },
                principal_investigator: { type: "string", description: "Name of the principal investigator" },
                target_patient_count: { type: "number", description: "Target number of patients if specified" },
                resources: {
                  type: "array",
                  items: { type: "string" },
                  description: "List of FHIR resource types needed (e.g., Patient, Condition, Encounter, Observation, Procedure, MedicationRequest)"
                },
                filters: {
                  type: "object",
                  description: "Basic patient and data filters",
                  properties: {
                    gender: { type: "string", description: "Gender filter if specified" },
                    age_min: { type: "string", description: "Minimum age if specified" },
                    age_max: { type: "string", description: "Maximum age if specified" },
                    conditions: { type: "string", description: "Medical conditions of interest" },
                    medications: { type: "string", description: "Medications of interest" },
                    procedures: { type: "string", description: "Procedures of interest" }
                  }
                },
                date_range: {
                  type: "object",
                  properties: {
                    from: { type: "string", description: "Start date for data collection (YYYY-MM-DD)" },
                    to: { type: "string", description: "End date for data collection (YYYY-MM-DD)" }
                  },
                  required: ["from", "to"]
                },
                fhir_queries: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      resourceType: { type: "string", description: "FHIR resource type" },
                      filters: { type: "object", description: "Specific filters for this resource" },
                      count: { type: "number", description: "Target count for this resource" },
                      priority: { type: "string", enum: ["high", "medium", "low"], description: "Query priority" },
                      reasoning: { type: "string", description: "Why this query is needed" }
                    },
                    required: ["resourceType", "filters", "priority", "reasoning"]
                  },
                  description: "Detailed FHIR queries with specific filters and reasoning"
                },
                patient_criteria: {
                  type: "object",
                  description: "Detailed patient inclusion/exclusion criteria",
                  properties: {
                    age_range: {
                      type: "object",
                      properties: {
                        min: { type: "number", description: "Minimum age" },
                        max: { type: "number", description: "Maximum age" }
                      }
                    },
                    gender: { type: "array", items: { type: "string" }, description: "Allowed genders" },
                    conditions: { type: "array", items: { type: "string" }, description: "Required conditions" },
                    procedures: { type: "array", items: { type: "string" }, description: "Required procedures" },
                    medications: { type: "array", items: { type: "string" }, description: "Required medications" },
                    encounter_types: { type: "array", items: { type: "string" }, description: "Encounter types" }
                  }
                },
                data_requirements: {
                  type: "object",
                  description: "Data quality and quantity requirements",
                  properties: {
                    minimum_records: { type: "number", description: "Minimum records needed" },
                    preferred_records: { type: "number", description: "Preferred record count" },
                    data_quality_requirements: { type: "array", items: { type: "string" }, description: "Data quality requirements" },
                    privacy_considerations: { type: "array", items: { type: "string" }, description: "Privacy considerations" }
                  }
                },
                additional_notes: { type: "string", description: "Any additional relevant notes" }
              },
              required: ["resources", "filters", "date_range", "fhir_queries"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "extract_enhanced_irb_data" } }
    });

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
    if (!toolCall || toolCall.function.name !== 'extract_enhanced_irb_data') {
      throw new Error('Expected function call not received from OpenAI');
    }

    const extractedData = JSON.parse(toolCall.function.arguments);
    
    // Validate the extracted data with proper null handling
    const validationSchema = z.object({
      resources: z.array(z.string()),
      filters: z.record(z.string().nullable()).transform(val => {
        // Remove null values from filters
        const cleaned: Record<string, string> = {};
        Object.entries(val).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            cleaned[key] = value;
          }
        });
        return cleaned;
      }),
      date_range: z.object({
        from: z.string(),
        to: z.string()
      }),
      fhir_queries: z.array(z.object({
        resourceType: z.string(),
        filters: z.record(z.any()).optional().default({}),
        count: z.number().optional(),
        priority: z.enum(['high', 'medium', 'low']),
        reasoning: z.string()
      })),
      study_title: z.string().optional(),
      principal_investigator: z.string().optional(),
      target_patient_count: z.number().optional(),
      patient_criteria: z.object({
        age_range: z.object({
          min: z.number(),
          max: z.number()
        }).optional(),
        gender: z.array(z.string()).nullable().optional().transform(val => val || []),
        conditions: z.array(z.string()).nullable().optional().transform(val => val || []),
        procedures: z.array(z.string()).nullable().optional().transform(val => val || []),
        medications: z.array(z.string()).nullable().optional().transform(val => val || []),
        encounter_types: z.array(z.string()).nullable().optional().transform(val => val || [])
      }).optional(),
      data_requirements: z.object({
        minimum_records: z.number().nullable().optional(),
        preferred_records: z.number().nullable().optional(),
        data_quality_requirements: z.array(z.string()).optional(),
        privacy_considerations: z.array(z.string()).optional()
      }).optional().transform(val => ({
        minimum_records: val?.minimum_records ?? 50,
        preferred_records: val?.preferred_records ?? 100,
        data_quality_requirements: val?.data_quality_requirements ?? ['Complete patient demographics', 'Valid medical codes'],
        privacy_considerations: val?.privacy_considerations ?? ['HIPAA compliance', 'Data anonymization']
      })),
      additional_notes: z.string().optional()
    });

    const validatedData = validationSchema.parse(extractedData);
    
    console.log('🤖 Enhanced IRB Extraction completed:', {
      studyTitle: validatedData.study_title,
      resources: validatedData.resources.length,
      fhirQueries: validatedData.fhir_queries.length,
      patientCriteria: validatedData.patient_criteria ? 'extracted' : 'default',
      dataRequirements: validatedData.data_requirements ? 'extracted' : 'default'
    });

    // Ensure we have default values for optional fields
    const result: IRBExtraction = {
      ...validatedData,
      fhir_queries: validatedData.fhir_queries.length > 0 ? 
        // If AI generated queries have empty filters, enhance them with hybrid filter generation
        await enhanceQueriesWithHybridFilters(validatedData.fhir_queries, validatedData) : 
        generateDefaultFHIRQueries(validatedData),
      patient_criteria: validatedData.patient_criteria || generateDefaultPatientCriteria(validatedData),
      data_requirements: validatedData.data_requirements ? {
        minimum_records: validatedData.data_requirements.minimum_records || 50,
        preferred_records: validatedData.data_requirements.preferred_records || validatedData.target_patient_count || 100,
        data_quality_requirements: validatedData.data_requirements.data_quality_requirements || ['Complete patient demographics', 'Valid medical codes'],
        privacy_considerations: validatedData.data_requirements.privacy_considerations || ['HIPAA compliance', 'Data anonymization']
      } : {
        minimum_records: 50,
        preferred_records: validatedData.target_patient_count || 100,
        data_quality_requirements: ['Complete patient demographics', 'Valid medical codes'],
        privacy_considerations: ['HIPAA compliance', 'Data anonymization']
      }
    };

    return result;
  } catch (error) {
    console.error('Error parsing IRB document:', error);
    throw new Error(`Failed to parse IRB document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Helper function to generate default FHIR queries based on basic extraction
function generateDefaultFHIRQueries(extraction: any): FHIRQuery[] {
  const queries: FHIRQuery[] = [];
  
  // Always include Patient resource with better filters for HAPI server
  queries.push({
    resourceType: 'Patient',
    filters: {
      active: true,
      ...(extraction.filters?.gender && extraction.filters.gender !== 'all' && { gender: extraction.filters.gender })
    },
    count: Math.min(extraction.target_patient_count || 100, 50), // Limit to 50 for testing
    priority: 'high',
    reasoning: 'Primary patient population for study'
  });
  
  // Add other resources based on extraction with better filters
  if (extraction.resources?.includes('Condition')) {
    queries.push({
      resourceType: 'Condition',
      filters: {
        'clinical-status': 'active'
      },
      count: Math.min((extraction.target_patient_count || 100) * 2, 100), // Limit to 100 for testing
      priority: 'high',
      reasoning: 'Study requires condition data'
    });
  }
  
  if (extraction.resources?.includes('Observation')) {
    queries.push({
      resourceType: 'Observation',
      filters: {
        status: 'final'
      },
      count: Math.min((extraction.target_patient_count || 100) * 3, 150), // Limit to 150 for testing
      priority: 'high',
      reasoning: 'Study requires observation data for measurements and lab values'
    });
  }
  
  if (extraction.resources?.includes('Procedure')) {
    queries.push({
      resourceType: 'Procedure',
      filters: {
        status: 'completed'
      },
      count: Math.min((extraction.target_patient_count || 100) * 1.5, 75), // Limit to 75 for testing
      priority: 'medium',
      reasoning: 'Study may require procedure data'
    });
  }
  
  if (extraction.resources?.includes('Encounter')) {
    queries.push({
      resourceType: 'Encounter',
      filters: {
        status: 'finished'
      },
      count: Math.min((extraction.target_patient_count || 100) * 1.5, 75), // Limit to 75 for testing
      priority: 'medium',
      reasoning: 'Study may require encounter data for visit information'
    });
  }
  
  if (extraction.resources?.includes('MedicationRequest')) {
    queries.push({
      resourceType: 'MedicationRequest',
      filters: {
        status: 'active'
      },
      count: Math.min((extraction.target_patient_count || 100) * 2, 100), // Limit to 100 for testing
      priority: 'medium',
      reasoning: 'Study may require medication data'
    });
  }
  
  return queries;
}

// Helper function to generate default patient criteria
function generateDefaultPatientCriteria(extraction: any): PatientCriteria {
  return {
    age_range: {
      min: parseInt(extraction.filters?.age_min) || 18,
      max: parseInt(extraction.filters?.age_max) || 65
    },
    gender: extraction.filters?.gender && extraction.filters.gender !== 'all' ? [extraction.filters.gender] : ['male', 'female'],
    conditions: extraction.filters?.conditions || [],
    procedures: extraction.filters?.procedures || [],
    medications: [],
    encounter_types: ['outpatient', 'inpatient']
  };
}

// Helper function to validate date format
export function validateDateFormat(dateStr: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) return false;
  
  const date = new Date(dateStr);
  return !isNaN(date.getTime());
} 