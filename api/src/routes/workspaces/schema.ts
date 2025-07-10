import { z, createRoute } from "@hono/zod-openapi";
import { ERRORS } from "~/lib/errors";
import { vfsTypes } from "~/lib/types";

const CreateBodySchema = z
  .object({
    name: z.string(),
  })
  .openapi("CreateWorkspaceBody");

const WorkspaceSchema = CreateBodySchema.extend({
  // SERIAL key is always a positive int
  id: z.number().positive().int(),
  vfsType: vfsTypes,
}).openapi("Workspace");

export const POST = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateBodySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: "201 Created",
      content: {
        "application/json": {
          schema: WorkspaceSchema,
        },
      },
    },
    401: ERRORS[401],
    409: ERRORS[409]
  },
});

export const GET = {
  one: createRoute({
    method: "get",
    path: "/{id}",
    request: {
      params: z.object({
        id: z.string()
      })
    },
    responses: {
      200: {
        description: "200 OK",
        content: {
          "application/json": {
            schema: WorkspaceSchema,
          },
        },
      },
      400: ERRORS[400],
      401: ERRORS[401],
      404: ERRORS[404]
    },
  }),
  list: createRoute({
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "200 OK",
        content: {
          "application/json": {
            schema: WorkspaceSchema.array()
          }
        }
      },
      401: ERRORS[401]
    }
  })
};

export const DELETE = createRoute({
  method: "delete",
  path: "/{id}",
  request: {
    params: z.object({
      id: z.string()
    })
  },
  responses: {
    200: {
      description: "200 OK",
      content: {
        "application/json": {
          schema: WorkspaceSchema
        }
      }
    },
    401: ERRORS[401],
    404: ERRORS[404]
  }
})