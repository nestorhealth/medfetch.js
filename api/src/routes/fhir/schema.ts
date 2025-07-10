import { z, createRoute } from "@hono/zod-openapi";
import { ERRORS } from "~/lib/errors";

export const Search = {
  type: createRoute({
    method: "get",
    path: "/{resourceType}",
    request: {
      params: z.object({
        resourceType: z.string()
      })
    },
    description: "Search by Resource Type",
    responses: {
      200: {
        description: "200 OK",
        content: {
          "application/json": {
            schema: z.object({
              id: z.string(),
              resourceType: z.literal("Bundle"),
              link: z
                .object({
                  relation: z.string(),
                  url: z.string(),
                })
                .array(),
              entry: z
                .object({
                  resource: z.object({
                    resourceType: z.string(),
                  })
                  .optional()
                })
                .array(),
            }),
          },
        },
      },
      404: ERRORS[404]
    },
  }),
};
