'use client'

import { HospitalCleaningShowcase } from '../components/HospitalCleaningShowcase'
import type { Patient, Procedure } from '../utils/fhirProcessing'

interface Props {
  initialData: (Patient | Procedure)[]
}

export default function ClientShowcase({ initialData }: Props) {
  return <HospitalCleaningShowcase initialData={initialData} />
} 