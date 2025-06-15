'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import type { Patient, Procedure } from '../utils/fhirProcessing'
import { HospitalCleaningShowcase } from '../components/HospitalCleaningShowcase'
import React from "react"

// Sample data for demonstration
const sampleData: (Patient | Procedure)[] = [
  {
    resourceType: 'Patient',
    id: 'p1',
    name: [{
      family: 'Smith',
      given: ['John']
    }],
    gender: 'male',
    birthDate: '1974-12-25',
    address: [{
      line: ['123 Main St'],
      city: 'Boston',
      state: 'MA',
      postalCode: '02108'
    }]
  },
  {
    resourceType: 'Procedure',
    id: 'proc1',
    status: 'completed',
    code: {
      coding: [{
        code: '80146002',
        display: 'Appendectomy'
      }]
    },
    subject: {
      reference: 'Patient/p1'
    },
    performedDateTime: '2024-01-15T10:30:00Z'
  }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg text-gray-600">Loading showcase...</div>
        </div>
      }>
        <HospitalCleaningShowcase initialData={sampleData} />
      </Suspense>
    </main>
  )
} 