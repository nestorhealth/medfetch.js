import { z } from "@hono/zod-openapi"

const baseErrorSchema = z.object({
  error: z.string(),
  message: z.string().optional()
});

export const ERRORS = {
  400: {
    description: "400 Bad Request",
    content: {
      "application/json": {
        schema: baseErrorSchema
      }
    }
  },
  401: {
    description: "401 Unauthorized",
    content: {
      "application/json": {
        schema: baseErrorSchema
      }
    }
  },
  404: {
    description: "404 Not Found",
    content: {
      "application/json": {
        schema: baseErrorSchema
      }
    }
  },
  409: {
    description: "409 Conflict",
    content: {
      "application/json": {
        schema: baseErrorSchema
      }
    }
  }
} as const