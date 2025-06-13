import { bundle } from "~/lib/mock";
import patients from "~/../public/researcher-demo/Patient.json";
import conditions from "~/../public/researcher-demo/Condition.json";
import procedures from "~/../public/researcher-demo/Procedure.json";
import { Hono } from "hono";

const fhir = new Hono<{ Bindings: Env; Variables: Vars }>();

fhir.get("/Patient", async (c) => {
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

fhir.get("/Condition", async (c) => {
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

fhir.get("/Procedure", async (c) => {
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
