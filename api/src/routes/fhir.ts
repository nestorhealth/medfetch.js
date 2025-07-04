import patients from "~/../public/researcher-demo/Patient.json";
import conditions from "~/../public/researcher-demo/Condition.json";
import procedures from "~/../public/researcher-demo/Procedure.json";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Address, BundleEntry } from "fhir/r4";
import { Search } from "~/routes/fhir/schema";
import { faker } from "@faker-js/faker";

const fhir = new OpenAPIHono<{ Bindings: Env; Variables: Vars }>();

function cases(
  resourceType: "Patient" | "Condition" | "Procedure",
  caseMap: {
    [Key in "Patient" | "Condition" | "Procedure"]: BundleEntry<unknown>[];
  },
) {
  return caseMap[resourceType];
}

function fakeFhirAddresses(max = 5): Address[] {
  const count = faker.number.int({ min: 1, max });
  return Array.from({ length: count }).map(() => ({
    use: faker.helpers.arrayElement(['home', 'work', 'temp', 'old']),
    type: faker.helpers.arrayElement(['postal', 'physical', 'both']),
    text: faker.location.streetAddress({ useFullAddress: true }),
    line: [faker.location.streetAddress()],
    city: faker.location.city(),
    district: faker.location.county(),
    state: faker.location.state(),
    postalCode: faker.location.zipCode(),
    country: faker.location.country(),
  }));
}

const validateResourceType = (s: string) =>
  s === "Patient" || s === "Condition" || s === "Procedure";

fhir.openapi(Search.type, async (c) => {
  const resourceType = c.req.param("resourceType");
  if (!validateResourceType(resourceType)) {
    return c.json(
      {
        error: "NOT FOUND",
        message: `That resource doesn't exist: ${resourceType}`,
      },
      404,
    );
  }

  const payload = cases(resourceType, {
    Patient: (patients as unknown[] as BundleEntry[]).map((p) => ({
      resource: {
        ...p,
        address: fakeFhirAddresses(5)
      },
    })),
    Condition: (conditions as unknown[] as BundleEntry[]).map((p) => ({
      resource: p,
    })),
    Procedure: (procedures as unknown[] as BundleEntry[]).map((p) => ({
      resource: p,
    })),
  });

  return c.json({
    id: crypto.randomUUID(),
    resourceType: "Bundle" as const,
    link: [],
    entry: payload,
    meta: {
      lastUpdated: new Date().toISOString(),
    },
  }, 200);
});

export default fhir;
