import { Hono } from "hono";
import hapiPatients from "../../public/hapi-patients.json";

const fhir = new Hono<{ Bindings: Env }>();

fhir.get("/fhir/Patient", async (c) => {
  return c.json(hapiPatients, 200);
});

export default fhir;