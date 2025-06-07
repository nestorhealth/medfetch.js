import { createRoute } from "@hono/zod-openapi";
import { Bundle } from "+/zod-fhir/Bundle";

const REGISTERED = [
  "Patient",
  "Procedure",
  "Condition"
] as const;

const search = <ResourceType extends typeof REGISTERED[number]>(resourceType: ResourceType) => createRoute({
  method: "get",
  path: `/fhir/${resourceType}`,
  responses: {
    200: {
      description: "Search response",
      content: {
        "application/json": {
          schema: Bundle
        }
      }
    }
  }
});

const schema = {
  Patient: {
    GET: search("Patient")
  }
}

export default schema;