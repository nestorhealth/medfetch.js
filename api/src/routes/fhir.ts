import { OpenAPIHono, z } from "@hono/zod-openapi";
import hapiPatients from "../../public/hapi-patients.json";
import schema from "./fhir/schema";
import { Bundle } from "+/zod-fhir/Bundle";

const fhir = new OpenAPIHono<{ Bindings: Env }>();

fhir.openapi(schema.Patient.GET, (c) => {
  return c.json(hapiPatients as z.infer<typeof Bundle>, 200);
})

export default fhir;