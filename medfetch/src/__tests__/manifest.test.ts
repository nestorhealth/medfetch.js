import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadManifest, ManifestValidationError, Manifest } from '../manifest';
import { createServer, Server, IncomingMessage, ServerResponse } from 'http';
import { AddressInfo } from 'net';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

describe('manifest loader', () => {
  let server: Server;
  let baseUrl: string;

  beforeAll(() => {
    // Create a test server that serves our manifest
    const requestHandler = (req: IncomingMessage, res: ServerResponse) => {
      if (req.url === '/manifest.yaml') {
        res.writeHead(200, { 'Content-Type': 'application/yaml' });
        res.end(`version: "1.0.0"
resources:
  - resourceType: "Patient"
    table: "patients"
    idColumn: "id"
    fieldMappings:
      gender: "gender"
      first_name: "name.given[0]"
      last_name: "name.family[0]"
      birth_date: "birthDate"
      city: "address[0].city"
      state: "address[0].state"

  - resourceType: "Procedure"
    table: "procedures"
    idColumn: "uid"
    fieldMappings:
      code: "code.coding[0].code"
      status: "status"
      subject_id: "subject.reference"
      performed_date: "performedDateTime"`);
      } else {
        res.writeHead(404);
        res.end();
      }
    };

    server = createServer(requestHandler);

    return new Promise<void>((resolve) => {
      server.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  afterAll(() => {
    return new Promise<void>((resolve, reject) => {
      server.close((err?: Error) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  it('should load and validate a valid manifest from deployed URL', async () => {
    const manifest = await loadManifest(`${baseUrl}/manifest.yaml`);
    
    // Type check
    expect(manifest).toBeDefined();
    expect(manifest).toHaveProperty('version');
    expect(manifest).toHaveProperty('resources');
    
    // Version check
    expect(manifest.version).toBe('1.0.0');
    
    // Resources check
    expect(manifest.resources).toHaveLength(2);
    
    // Patient resource validation
    const patientResource = manifest.resources.find(r => r.resourceType === 'Patient');
    expect(patientResource).toBeDefined();
    expect(patientResource?.table).toBe('patients');
    expect(patientResource?.idColumn).toBe('id');
    expect(patientResource?.fieldMappings).toEqual({
      gender: 'gender',
      first_name: 'name.given[0]',
      last_name: 'name.family[0]',
      birth_date: 'birthDate',
      city: 'address[0].city',
      state: 'address[0].state'
    });

    // Procedure resource validation
    const procedureResource = manifest.resources.find(r => r.resourceType === 'Procedure');
    expect(procedureResource).toBeDefined();
    expect(procedureResource?.table).toBe('procedures');
    expect(procedureResource?.idColumn).toBe('uid');
    expect(procedureResource?.fieldMappings).toEqual({
      code: 'code.coding[0].code',
      status: 'status',
      subject_id: 'subject.reference',
      performed_date: 'performedDateTime'
    });
  });

  it('should throw ManifestValidationError for invalid manifest', async () => {
    // Override server response for this test
    const originalListener = server.listeners('request')[0] as (req: IncomingMessage, res: ServerResponse) => void;
    server.removeListener('request', originalListener);
    
    const invalidManifestHandler = (req: IncomingMessage, res: ServerResponse) => {
      if (req.url === '/manifest.yaml') {
        res.writeHead(200, { 'Content-Type': 'application/yaml' });
        res.end(`version: "1.0.0"
resources:
  - resourceType: "Invalid"
    table: "patients"
    # Missing required idColumn
    fieldMappings:
      test: "test"`);
      } else {
        res.writeHead(404);
        res.end();
      }
    };

    server.once('request', invalidManifestHandler);

    await expect(loadManifest(`${baseUrl}/manifest.yaml`))
      .rejects
      .toThrow(ManifestValidationError);

    // Restore original listener
    server.on('request', originalListener);
  });

  it('should throw error for non-existent manifest', async () => {
    await expect(loadManifest(`${baseUrl}/nonexistent.yaml`))
      .rejects
      .toThrow('Failed to fetch manifest: Not Found');
  });

  it('should throw error for network failures', async () => {
    // Simulate network error by closing server
    await new Promise<void>((resolve) => {
      server.close(() => resolve());
    });
    
    await expect(loadManifest(`${baseUrl}/manifest.yaml`))
      .rejects
      .toThrow('Failed to load manifest: fetch failed');

    // Restart server for other tests
    await new Promise<void>((resolve) => {
      server.listen(0, () => {
        const address = server.address() as AddressInfo;
        baseUrl = `http://localhost:${address.port}`;
        resolve();
      });
    });
  });

  it('should load manifest from default path when no URL provided', async () => {
    // Create a temporary manifest file in the public directory
    const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
    const defaultManifestPath = join(publicDir, 'manifest.yaml');
    
    // Ensure public directory exists
    await fs.mkdir(publicDir, { recursive: true });
    
    // Write a valid manifest
    const manifestContent = `version: "1.0.0"
resources:
  - resourceType: "Patient"
    table: "patients"
    idColumn: "id"
    fieldMappings:
      test: "test"`;
    
    await fs.writeFile(defaultManifestPath, manifestContent, 'utf8');
    
    try {
      const manifest = await loadManifest();
      expect(manifest).toBeDefined();
      expect(manifest.version).toBe('1.0.0');
      expect(manifest.resources).toHaveLength(1);
      expect(manifest.resources[0].resourceType).toBe('Patient');
    } finally {
      // Clean up
      await fs.unlink(defaultManifestPath);
      await fs.rmdir(publicDir);
    }
  });
}); 