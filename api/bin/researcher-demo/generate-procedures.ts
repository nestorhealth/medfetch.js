#!/usr/bin/env tsx

import { makeFactory } from "~/lib/mock";
import { Procedure } from "+/zod-fhir/Procedure";

const procedure = makeFactory(Procedure);

export function generateProcedures(pids: string[]) {
  const patients = Array.from({ length: pids.length }, (_, i) => {
    return procedure({
      id: () => crypto.randomUUID(),
      resourceType: () => "Procedure",
      subject: () => {
        return {
          reference: pids[i++],
        };
      },
    });
  });
  return patients;
}
