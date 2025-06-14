import { z } from 'zod';

// Schema definitions for validation
const PatientSchema = z.object({
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
  })).optional()
});

const ProcedureSchema = z.object({
  resourceType: z.literal('Procedure'),
  id: z.string(),
  subject: z.object({
    reference: z.string()
  }).optional(),
  code: z.object({
    coding: z.array(z.object({
      code: z.string()
    }))
  }).optional(),
  status: z.string().optional(),
  performedDateTime: z.string().optional()
});

export type Patient = z.infer<typeof PatientSchema>;
export type Procedure = z.infer<typeof ProcedureSchema>;

export interface ProcessingResult {
  patients: Patient[];
  procedures: Procedure[];
  errors: string[];
}

export function processFhirBundle(data: unknown): ProcessingResult {
  const result: ProcessingResult = {
    patients: [],
    procedures: [],
    errors: []
  };

  if (!Array.isArray(data)) {
    result.errors.push('Input data must be an array');
    return result;
  }

  data.forEach((item, index) => {
    try {
      if (item.resourceType === 'Patient') {
        const patient = PatientSchema.parse(item);
        result.patients.push(patient);
      } else if (item.resourceType === 'Procedure') {
        const procedure = ProcedureSchema.parse(item);
        result.procedures.push(procedure);
      }
    } catch (err) {
      result.errors.push(`Error processing item ${index}: ${err}`);
    }
  });

  return result;
}

export function cleanPatientData(patient: Patient): {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string;
  address_line1?: string;
  city?: string;
  state?: string;
  zip?: string;
} {
  return {
    id: patient.id,
    first_name: patient.name?.[0]?.given?.[0] || '',
    last_name: patient.name?.[0]?.family || '',
    gender: patient.gender || '',
    birth_date: patient.birthDate || '',
    address_line1: patient.address?.[0]?.line?.[0],
    city: patient.address?.[0]?.city,
    state: patient.address?.[0]?.state,
    zip: patient.address?.[0]?.postalCode
  };
}

export function cleanProcedureData(procedure: Procedure): {
  id: string;
  patient_id: string;
  code: string;
  status: string;
  performed_date: string;
} {
  return {
    id: procedure.id,
    patient_id: procedure.subject?.reference?.split('/')[1] || '',
    code: procedure.code?.coding?.[0]?.code || '',
    status: procedure.status || '',
    performed_date: procedure.performedDateTime || ''
  };
}

export function calculateCleaningStats(result: ProcessingResult) {
  const cleanedPatients = result.patients.filter(p => 
    p.name?.[0]?.given?.[0] && p.name?.[0]?.family
  ).length;

  const cleanedProcedures = result.procedures.filter(p => 
    p.code?.coding?.[0]?.code && p.status
  ).length;

  return {
    totalPatients: result.patients.length,
    totalProcedures: result.procedures.length,
    cleanedPatients,
    cleanedProcedures,
    patientSuccessRate: result.patients.length ? 
      (cleanedPatients / result.patients.length) * 100 : 0,
    procedureSuccessRate: result.procedures.length ? 
      (cleanedProcedures / result.procedures.length) * 100 : 0
  };
} 