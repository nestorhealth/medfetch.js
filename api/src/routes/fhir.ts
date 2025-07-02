import patients from "~/../public/researcher-demo/Patient.json";
import conditions from "~/../public/researcher-demo/Condition.json";
import procedures from "~/../public/researcher-demo/Procedure.json";
import { OpenAPIHono } from "@hono/zod-openapi";
import type { BundleEntry } from "fhir/r4";
import { Search } from "~/routes/fhir/schema";

const fhir = new OpenAPIHono<{ Bindings: Env; Variables: Vars }>();

function cases(
  resourceType: "Patient" | "Condition" | "Procedure",
  caseMap: {
    [Key in "Patient" | "Condition" | "Procedure"]: BundleEntry<unknown>[];
  },
) {
  return caseMap[resourceType];
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
      resource: p,
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
