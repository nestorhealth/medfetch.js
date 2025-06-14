import { z } from 'zod';
import type { JSONSchema7, JSONSchema7Definition } from 'json-schema';
import type { Reference } from 'fhir/r4';

// Types from the original sql.ts
export type FhirDataType = 
  | 'string' 
  | 'boolean' 
  | 'number' 
  | 'integer' 
  | 'date' 
  | 'dateTime' 
  | 'time' 
  | 'Reference';

export type ColumnDataType = 'text' | 'integer' | 'real' | 'boolean' | 'date';

interface ColumnKey {
  name: string;
  fhirType: FhirDataType;
  dataType: ColumnDataType;
}

interface ColumnValue {
  dataType: ColumnDataType;
  value: any | null;
}

// Schema definitions for validation
export const PatientSchema = z.object({
  resourceType: z.literal('Patient'),
  id: z.string(),
  name: z.array(z.object({
    given: z.array(z.string()),
    family: z.string()
  })).optional(),
  gender: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.array(z.object({
    line: z.array(z.string()).optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional()
  })).optional(),
  telecom: z.array(z.object({
    system: z.string(),
    value: z.string()
  })).optional(),
  maritalStatus: z.object({
    coding: z.array(z.object({
      code: z.string()
    }))
  }).optional(),
  extension: z.array(z.object({
    url: z.string(),
    extension: z.array(z.object({
      url: z.string(),
      valueString: z.string()
    }))
  })).optional()
});

export const ProcedureSchema = z.object({
  resourceType: z.literal('Procedure'),
  id: z.string(),
  subject: z.object({
    reference: z.string()
  }).optional(),
  code: z.object({
    coding: z.array(z.object({
      code: z.string(),
      display: z.string().optional()
    }))
  }).optional(),
  status: z.string().optional(),
  performedDateTime: z.string().optional(),
  note: z.array(z.object({
    text: z.string()
  })).optional(),
  category: z.array(z.object({
    coding: z.array(z.object({
      code: z.string(),
      display: z.string().optional()
    }))
  })).optional(),
  outcome: z.object({
    coding: z.array(z.object({
      code: z.string(),
      display: z.string().optional()
    }))
  }).optional()
});

export type Patient = z.infer<typeof PatientSchema>;
export type Procedure = z.infer<typeof ProcedureSchema>;

// Utility functions for processing FHIR data
export function processFhirResource(resource: unknown): { type: 'Patient' | 'Procedure', data: Patient | Procedure } | null {
  try {
    if (PatientSchema.safeParse(resource).success) {
      return { type: 'Patient', data: resource as Patient };
    }
    if (ProcedureSchema.safeParse(resource).success) {
      return { type: 'Procedure', data: resource as Procedure };
    }
    return null;
  } catch (err) {
    console.error('Error processing FHIR resource:', err);
    return null;
  }
}

export function extractFieldValue(resource: any, path: string): any {
  const parts = path.split('.');
  let current = resource;
  
  for (const part of parts) {
    if (part.includes('[')) {
      const [field, index] = part.split('[');
      const idx = parseInt(index);
      if (!current[field] || !Array.isArray(current[field]) || idx >= current[field].length) {
        return null;
      }
      current = current[field][idx];
    } else if (part.includes('where(')) {
      const [field, condition] = part.split('where(');
      const [prop, value] = condition.replace(')', '').split('=');
      if (!current[field] || !Array.isArray(current[field])) {
        return null;
      }
      current = current[field].find((item: any) => item[prop] === value);
      if (!current) return null;
    } else {
      if (!current[part]) return null;
      current = current[part];
    }
  }
  
  return current;
}

export function generateTableSchema(resourceType: string, columns: [string, JSONSchema7Definition][]): ColumnKey[] {
  const columnKeys: ColumnKey[] = [];
  columnKeys.push({ name: 'id', dataType: 'text', fhirType: 'string' });
  
  columns.forEach(([key, value]) => {
    if (typeof value === 'boolean') return;
    if (key.startsWith('_') || key === 'id') return;
    
    let columnDataType: ColumnDataType = 'text';
    let typename: FhirDataType = 'string';
    
    if (value.$ref) {
      const refType = value.$ref.split('/').pop() as FhirDataType;
      typename = refType;
      // Map FHIR types to SQL types
      switch (refType) {
        case 'integer':
          columnDataType = 'integer';
          break;
        case 'number':
          columnDataType = 'real';
          break;
        case 'boolean':
          columnDataType = 'boolean';
          break;
        case 'date':
        case 'dateTime':
          columnDataType = 'date';
          break;
        default:
          columnDataType = 'text';
      }
    }
    
    columnKeys.push({
      name: key,
      dataType: columnDataType,
      fhirType: typename
    });
  });
  
  return columnKeys;
}

export function generateCreateTableSQL(resourceType: string, columns: ColumnKey[]): string {
  const columnDefs = columns.map(col => {
    let def = `"${col.name}" ${col.dataType}`;
    if (col.name === 'id') def += ' PRIMARY KEY';
    return def;
  });
  
  return `
    CREATE TABLE IF NOT EXISTS "${resourceType}" (
      ${columnDefs.join(',\n      ')}
    );
  `;
}

export function transformResourceToRow(resource: any, columns: ColumnKey[]): Record<string, any> {
  const row: Record<string, any> = {};
  
  columns.forEach(col => {
    let value = resource[col.name];
    
    if (value && typeof value === 'object') {
      switch (col.fhirType) {
        case 'Reference':
          value = (value as Reference).reference?.split('/')[1] || null;
          break;
        default:
          value = JSON.stringify(value);
      }
    }
    
    row[col.name] = value;
  });
  
  return row;
} 