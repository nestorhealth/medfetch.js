import { createRoute } from "@hono/zod-openapi";
import { Bundle } from "+/zod-fhir/Bundle";
import { Resource } from "+/zod-fhir/Resource";

const search = <ResourceType extends Resource["resourceType"]>(resourceType: ResourceType) => createRoute({
  method: "get",
  path: `/fhir/${resourceType}`,
  responses: {
    200: {
      description: `${resourceType} instance search response`,
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
  },
  Condition: {
    GET: search("Condition")
  },
  Procedure: {
    GET: search("Procedure")
  }
}

export default schema;