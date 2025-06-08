import { z, createRoute } from "@hono/zod-openapi";

// Schema for sorting
const SortSchema = z.object({
  field: z.string(),
  direction: z.enum(['asc', 'desc'])
}).openapi('Sort');

// Schema for filtering
const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum(['equals', 'contains', 'greaterThan', 'lessThan', 'between']),
  value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))])
}).openapi('Filter');

// Schema for pagination
const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20)
}).openapi('Pagination');

// Schema for table operations
const TableOperationSchema = z.object({
  table: z.enum(['Patient', 'Procedure']),
  operation: z.enum(['select', 'insert', 'update', 'delete']),
  filters: z.array(FilterSchema).optional(),
  sort: z.array(SortSchema).optional(),
  pagination: PaginationSchema.optional(),
  data: z.record(z.any()).optional() // For insert/update operations
}).openapi('TableOperation');

// Response schema for table operations
const TableResponseSchema = z.object({
  data: z.array(z.record(z.any())),
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  error: z.string().optional()
}).openapi('TableResponse');

// Error schema
const ErrorSchema = z.object({
  error: z.string()
}).openapi('Error');

// Create routes for different operations
const tableOperation = createRoute({
  method: 'post',
  path: '/table',
  request: {
    body: {
      content: {
        'application/json': {
          schema: TableOperationSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: TableResponseSchema
        }
      },
      description: 'Table operation successful'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad request'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Internal server error'
    }
  }
});

// Schema for bulk operations
const BulkOperationSchema = z.object({
  table: z.enum(['Patient', 'Procedure']),
  operation: z.enum(['update', 'delete']),
  filters: z.array(FilterSchema),
  data: z.record(z.any()).optional() // For update operations
}).openapi('BulkOperation');

// Response schema for bulk operations
const BulkResponseSchema = z.object({
  affectedRows: z.number(),
  error: z.string().optional()
}).openapi('BulkResponse');

// Create route for bulk operations
const bulkOperation = createRoute({
  method: 'post',
  path: '/bulk',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BulkOperationSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: BulkResponseSchema
        }
      },
      description: 'Bulk operation successful'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad request'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Internal server error'
    }
  }
});

// Schema for schema operations
const SchemaOperationSchema = z.object({
  operation: z.enum(['get', 'addColumn', 'removeColumn']),
  table: z.enum(['Patient', 'Procedure']),
  column: z.object({
    name: z.string(),
    type: z.enum(['TEXT', 'INTEGER', 'REAL', 'BOOLEAN', 'DATE']),
    nullable: z.boolean().default(true)
  }).optional()
}).openapi('SchemaOperation');

// Response schema for schema operations
const SchemaResponseSchema = z.object({
  schema: z.array(z.object({
    name: z.string(),
    type: z.string(),
    nullable: z.boolean()
  })),
  error: z.string().optional()
}).openapi('SchemaResponse');

// Create route for schema operations
const schemaOperation = createRoute({
  method: 'post',
  path: '/schema',
  request: {
    body: {
      content: {
        'application/json': {
          schema: SchemaOperationSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: SchemaResponseSchema
        }
      },
      description: 'Schema operation successful'
    },
    400: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Bad request'
    },
    500: {
      content: {
        'application/json': {
          schema: ErrorSchema
        }
      },
      description: 'Internal server error'
    }
  }
});

export default {
  tableOperation,
  bulkOperation,
  schemaOperation
};

