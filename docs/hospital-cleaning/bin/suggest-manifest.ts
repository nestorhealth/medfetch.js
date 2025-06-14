#!/usr/bin/env node

import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { suggestManifestMappings } from '../utils/aiProcessing';
import yaml from 'js-yaml';

const program = new Command();

program
  .name('suggest-manifest')
  .description('AI-powered FHIR manifest mapping suggestions')
  .requiredOption('--sample <path>', 'path to sample JSON file')
  .requiredOption('--resourceType <string>', 'FHIR resource type (e.g., Patient, Procedure)')
  .requiredOption('--table <string>', 'source table name')
  .option('--output <path>', 'output manifest file path', 'manifest.yaml')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    // Read and parse sample data
    const sampleData = JSON.parse(
      await fs.readFile(options.sample, 'utf-8')
    );

    // Get AI suggestions
    console.log('Analyzing sample data and generating mapping suggestions...');
    const suggestions = await suggestManifestMappings(
      sampleData,
      options.resourceType,
      options.table
    );

    // Create manifest structure
    const manifest = {
      version: '1.0',
      resources: [{
        resourceType: options.resourceType,
        source: {
          table: options.table,
          fieldMappings: suggestions.reduce((acc, suggestion) => ({
            ...acc,
            [suggestion.field]: {
              fhirPath: suggestion.fhirPath,
              confidence: suggestion.confidence,
              explanation: suggestion.explanation
            }
          }), {})
        }
      }]
    };

    // Write manifest file
    const outputPath = path.resolve(options.output);
    await fs.writeFile(
      outputPath,
      yaml.dump(manifest, { indent: 2 })
    );

    console.log(`\nManifest written to ${outputPath}`);
    console.log('\nMapping suggestions:');
    suggestions.forEach(suggestion => {
      console.log(`\n${suggestion.field}:`);
      console.log(`  FHIRPath: ${suggestion.fhirPath}`);
      console.log(`  Confidence: ${(suggestion.confidence * 100).toFixed(1)}%`);
      console.log(`  Explanation: ${suggestion.explanation}`);
    });

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 