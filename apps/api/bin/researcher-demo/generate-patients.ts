#!/usr/bin/env tsx

import { Patient } from "+/zod-fhir/Patient";
import { faker } from "@faker-js/faker";
import { makeFactory } from "~/lib/mock"
import type { HumanName } from "fhir/r4";

const patient = makeFactory(Patient);

export function generatePatients(count: number) {
  const patients = Array.from({ length: count }, () => {
    return patient({
      id: () => crypto.randomUUID(),
      resourceType: () => "Patient",
      name: (): Partial<HumanName>[] => [
        {
          family: faker.person.lastName(),
          given: [faker.person.firstName()]
        },
      ],
      birthDate: () => faker.date.birthdate().toISOString().slice(0, 10)
    });
  });
  return patients;
}