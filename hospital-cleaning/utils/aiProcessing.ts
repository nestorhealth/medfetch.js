import OpenAI from 'openai';
import { z } from 'zod';
import type { Patient, Procedure } from './fhirProcessing';

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