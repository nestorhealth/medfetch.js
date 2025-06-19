import Ajv from 'ajv';
import yaml from 'js-yaml';
import manifestSchema from './manifest.schema.json';
import { promises as fs } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

// Type definitions
export interface FieldMapping {
  [key: string]: string;  // column name -> FHIRPath
}

export interface ResourceMapping {
  resourceType: string;
  table: string;
  idColumn: string;
  fieldMappings: FieldMapping;
}

export interface Manifest {
  version?: string;
  resources: ResourceMapping[];
}

// Schema validation setup
const ajv = new Ajv({
  allErrors: true,
  strict: true,
  verbose: true
});

const validate = ajv.compile(manifestSchema);

export class ManifestValidationError extends Error {
  constructor(public errors: any[]) {
    super('Manifest validation failed: ' + errors.map(e => `${e.instancePath} ${e.message}`).join(', '));
    this.name = 'ManifestValidationError';
  }
}

/**
 * Loads and validates a manifest from a URL or file path
 * @param url The URL to fetch the manifest from, or a file path. If undefined, defaults to './public/manifest.yaml'
 * @returns A validated Manifest object
 * @throws {ManifestValidationError} If the manifest is invalid
 * @throws {Error} For network, file system, or parsing errors
 */
export async function loadManifest(url?: string): Promise<Manifest> {
  try {
    // Default to local manifest if no URL provided
    if (!url) {
      url = './public/manifest.yaml';
    }

    let yamlText: string;
    
    // Handle HTTP(S) URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch manifest: ${response.statusText}`);
      }
      yamlText = await response.text();
    } 
    // Handle file:// URLs
    else if (url.startsWith('file://')) {
      const filePath = fileURLToPath(url);
      yamlText = await fs.readFile(filePath, 'utf8');
    }
    // Handle local file paths
    else {
      // Resolve relative paths from the current file's directory
      const currentDir = dirname(fileURLToPath(import.meta.url));
      const absolutePath = resolve(currentDir, url);
      yamlText = await fs.readFile(absolutePath, 'utf8');
    }

    const manifest = yaml.load(yamlText) as Manifest;

    if (!validate(manifest)) {
      throw new ManifestValidationError(validate.errors || []);
    }

    return manifest;
  } catch (error) {
    if (error instanceof ManifestValidationError) {
      throw error;
    }
    throw new Error(`Failed to load manifest: ${error instanceof Error ? error.message : String(error)}`);
  }
} 