#!/usr/bin/env tsx

import { faker } from "@faker-js/faker";
import { Condition } from "+/zod-fhir/Condition";
import { ICD } from "../static/codes.static";
import { makeFactory } from "~/lib/mock"
import { CodeableConcept } from "fhir/r4";

const condition = makeFactory(Condition);

export function generateConditions(pids: string[]) {
  const conditions = Array.from({ length: pids.length }, (_, i) =>
    condition({
      id: () => crypto.randomUUID(),
      resourceType: () => "Condition",
      onsetDateTime: (): string =>
        faker.date
          .between({
            from: new Date("2000-01-01"),
            to: new Date("2025-12-31"),
          })
          .toISOString(),
      subject: () => {
        return {
          reference: pids[i++]
        };
      },
      code: (): CodeableConcept => {
        const entries = Object.entries(ICD);
        const randomIndex = Math.floor(Math.random() * entries.length);
        return {
          coding: [
            entries[randomIndex][1]
          ],
          text: entries[randomIndex][1].display
        }
      },
    })
  );
  return conditions;
}
