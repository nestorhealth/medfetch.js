import 'dotenv/config';
import { Command } from 'commander';
import { promises as fs } from 'node:fs';
import { OpenAI } from 'openai';
import { stringify } from 'yaml';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { Manifest, ResourceMapping } from '../manifest.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

interface SampleRow {
  [key: string]: any;
}

async function suggestMappings(
  samples: SampleRow[],
  resourceType: string,
  table: string
): Promise<ResourceMapping> {
  // Extract all unique keys from sample rows
  const allKeys = new Set<string>();
  samples.forEach(row => {
    Object.keys(row).forEach(key => allKeys.add(key));
  });

  // Build the prompt
  const prompt = `Here are sample rows from the '${table}' table:
${JSON.stringify(samples.slice(0, 3), null, 2)}

Let's map these columns to FHIR ${resourceType} fields. For each column, suggest a FHIRPath expression.
Return the mapping as a JSON object where:
- Keys are the column names
- Values are FHIRPath expressions or null if no mapping is obvious
- Include a comment for each mapping explaining the choice

Example format:
{
  "id": "Patient.id",
  "gender": "Patient.gender",
  "first_name": "Patient.name[0].given[0]",
  // ... other mappings
}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: "You are a healthcare data mapping expert. Your task is to map database columns to FHIR resource fields using FHIRPath expressions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.3,
    response_format: { type: "json_object" }
  });

  const response = completion.choices[0].message.content;
  if (!response) {
    throw new Error("No response from OpenAI");
  }

  const mappings = JSON.parse(response);
  
  // Create the resource mapping
  return {
    resourceType,
    table,
    idColumn: Object.keys(mappings).find(k => k.toLowerCase().includes('id')) || Object.keys(mappings)[0],
    fieldMappings: mappings
  };
}

// Add direct execution support
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = createSuggestManifestCommand();
  command.parse(process.argv);
}

export function createSuggestManifestCommand(): Command {
  const command = new Command('suggest-manifest')
    .description('Suggest FHIR field mappings for a table using AI')
    .requiredOption('--sample <path>', 'Path to JSON file containing sample rows')
    .requiredOption('--resourceType <string>', 'FHIR resource type (e.g., Patient, Procedure)')
    .requiredOption('--table <string>', 'Source table name')
    .option('--output <path>', 'Output path for manifest YAML', 'manifest.yaml')
    .action(async (options) => {
      try {
        // Read and parse sample file
        const samplePath = resolve(process.cwd(), options.sample);
        const sampleText = await fs.readFile(samplePath, 'utf8');
        const samples = JSON.parse(sampleText) as SampleRow[];

        if (!Array.isArray(samples)) {
          throw new Error('Sample file must contain an array of objects');
        }

        // Get AI suggestions
        const resourceMapping = await suggestMappings(
          samples,
          options.resourceType,
          options.table
        );

        // Create manifest
        const manifest: Manifest = {
          version: '1.0',
          resources: [resourceMapping]
        };

        // Write manifest
        const outputPath = resolve(process.cwd(), options.output);
        await fs.writeFile(outputPath, stringify(manifest), 'utf8');

        console.log(`✨ Manifest written to ${options.output}`);
        console.log('\nSuggested mappings:');
        console.log(stringify(resourceMapping.fieldMappings));
      } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
        process.exit(1);
      }
    });

  return command;
} 