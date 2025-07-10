import patients from "~/../public/researcher-demo/Patient.json";
import conditions from "~/../public/researcher-demo/Condition.json";
import procedures from "~/../public/researcher-demo/Procedure.json";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { Address, BundleEntry, Patient } from "fhir/r4";
import { Search } from "~/routes/fhir/schema";
import { faker } from "@faker-js/faker";
import { codeMap, generateCodeableConcept } from "./fhir/generate";
import { generate } from "kysely-codegen";

const fhir = new OpenAPIHono<{ Bindings: Env; Variables: Vars }>();
const patientMaritalStatusMap = codeMap();
const maritalStatusCodes = {
  A: {
    code: "A",
    display: "Annulled",
  },
  D: {
    code: "D",
    display: "Divorced",
  },
  L: {
    code: "L",
    display: "Legally Separated",
  },
  M: {
    code: "M",
    display: "Married",
  },
}
patientMaritalStatusMap.set("MaritalStatus", maritalStatusCodes);

const multipleBirthStatusMap = codeMap();
const multipleBirthStatusCodes = {
  true: {
    type: "boolean",
    value: true,
    display: "Part of a multiple birth",
  },
  false: {
    type: "boolean",
    value: false,
    display: "Single birth",
  },
}
multipleBirthStatusMap.set("MultipleBirth", multipleBirthStatusCodes);

const languageMap = codeMap();
const languageCodes = {
  en: {
    code: "en",
    display: "English",
  },
  es: {
    code: "es",
    display: "Spanish",
  },
  zh: {
    code: "zh",
    display: "Chinese",
  },
  ar: {
    code: "ar",
    display: "Arabic",
  },
  fr: {
    code: "fr",
    display: "French",
  },
  hi: {
    code: "hi",
    display: "Hindi",
  },
};

languageMap.set("Language", languageCodes);

const generalPractitionerMap = codeMap();
const generalPractitionerCodes = {
  practitioner: {
    reference: "Practitioner/example-practitioner-id",
    display: "Dr. Alex Johnson (MD)",
  },
  organization: {
    reference: "Organization/example-organization-id",
    display: "Harmony Health Group",
  },
  practitionerRole: {
    reference: "PractitionerRole/example-role-id",
    display: "Primary Care Provider Role",
  },
};

generalPractitionerMap.set("GeneralPractitioner", generalPractitionerCodes);




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

  //checking tailend - pass in resource type (tailvalue)
  const payload = cases(resourceType, {
    Patient: (patients as unknown[] as Patient[]).map((p) =>
      (() => {
        const isDeceased = Math.random() < 0.2;
        const dateOfDeath = faker.date.past({ years: 20 }).toISOString();

        return {
          resource: {
            ...p,
            active: Math.random() < 0.5,

            maritalStatus: generateCodeableConcept(patientMaritalStatusMap),
            multipleBirthBoolean: Math.random() < 0.3,
            multipleBirthInteger:
              Math.random() < 0.3
                ? faker.number.int({ min: 1, max: 4 })
                : undefined,
            ...(isDeceased
              ? { deceasedDateTime: dateOfDeath }
              : { deceasedBoolean: false }),

            address: fakeFhirAddresses(5),
            generalPractitioner: [
              faker.helpers.arrayElement(
                Object.values(
                  generalPractitionerMap.get("GeneralPractitioner")!
                )
              ),
            ],
            communication: [
              {
                language: generateCodeableConcept(languageMap),
                preferred: true,
              },
            ],
            managingOrganization: {
              reference: "Organization/example-managing-org-id",
              display: "Johns Hopkins Hospital",
            },
            photo: [],
          } as Patient,
        };
      })()
    ),



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
