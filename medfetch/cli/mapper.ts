import { RecordChange } from './eventParser';
import type { Manifest, ResourceMapping } from './manifest';

// Minimal setFhirPath implementation (supports dot and [index] notation)
function setFhirPath(obj: any, path: string, value: any) {
  const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in curr)) {
      // If next part is a number, make an array
      curr[part] = isNaN(Number(parts[i + 1])) ? {} : [];
    }
    curr = curr[part];
  }
  curr[parts[parts.length - 1]] = value;
}

export function mapToFhir(change: RecordChange, manifest: Manifest): { resourceType: string; id: string; body: any } {
  const mapping = manifest.resources.find((m) => m.table === change.table);
  if (!mapping) throw new Error(`No mapping found for table: ${change.table}`);
  const id = String(change.key[mapping.idColumn]);
  if (!id) throw new Error(`Missing id for resource: ${mapping.resourceType}`);
  const body: any = { resourceType: mapping.resourceType, id };
  for (const [column, fhirPath] of Object.entries(mapping.fieldMappings)) {
    setFhirPath(body, fhirPath, change.payload[column]);
  }
  return { resourceType: mapping.resourceType, id, body };
} 