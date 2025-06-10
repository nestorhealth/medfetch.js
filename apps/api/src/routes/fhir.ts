import { OpenAPIHono, z } from "@hono/zod-openapi";
import schema from "./fhir/schema";
import { bundle } from "~/lib/mock";
import patients from "~/../public/researcher-demo/Patient.json";
import conditions from "~/../public/researcher-demo/Condition.json";
import procedures from "~/../public/researcher-demo/Procedure.json";

const fhir = new OpenAPIHono<{ Bindings: Env; Variables: Vars }>();

fhir.openapi(schema.Patient.GET, async (c) => {
  return c.json(
    bundle({
      id: () => crypto.randomUUID(),
      resourceType: () => "Bundle",
      link: () => [],
      entry: () => (patients as any[]).map(p => ({
        resource: p
      })),
      meta: () => ({
        lastUpdated: new Date().toISOString()
      })
    })
  )
});

fhir.openapi(schema.Condition.GET, async (c) => {
  return c.json(
    bundle({
      id: () => crypto.randomUUID(),
      resourceType: () => "Bundle",
      link: () => [],
      entry: () => (conditions as any[]).map(p => ({
        resource: p
      })),
      meta: () => ({
        lastUpdated: new Date().toISOString()
      })
    }),
    200
  )
})

fhir.openapi(schema.Procedure.GET, async (c) => {
  return c.json(
    bundle({
      id: () => crypto.randomUUID(),
      resourceType: () => "Bundle",
      link: () => [],
      entry: () => (procedures as any[]).map(p => ({
        resource: p
      })),
      meta: () => ({
        lastUpdated: new Date().toISOString()
      })
    }),
    200
  )
})

export default fhir;
