import { z, createRoute } from "@hono/zod-openapi";

const NLSchema = z
  .object({
    query: z.string().openapi({
      example: "Get me all happy Patients"
    }),
  })
  .openapi("POST");

const SQLSchema = z
  .object({
    summary: z.string(),
    sql: z.string().optional().openapi({
      example: "SELECT * FROM Patient"
    }),
    error: z.string().optional(),
  })
  .openapi("SQL");

const ErrorSchema = z
  .object({
    error: z.string(),
  })
  .openapi("Error");

const POST = createRoute({
  method: "post",
  path: "/",
  request: {
    body: {
      content: {
        "application/json": {
          schema: NLSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        "application/json": {
          schema: SQLSchema
        },
      },
      description: "SQL from natural language",
    },
    400: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Bad request"
    },
    500: {
      content: {
        "application/json": {
          schema: ErrorSchema,
        },
      },
      description: "Internal server error"
    }
  },
});

const schema = {
  POST,
}

export default schema;
