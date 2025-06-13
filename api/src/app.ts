import db from "./routes/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import { D1Database } from "@cloudflare/workers-types";
import { showRoutes } from "hono/dev";
import { logger } from "hono/logger";
import nl2sql from "./routes/nl2sql";
import fhir, { DB } from "./routes/fhir";
import { customLogger } from "~/lib/context";
import { HTTPException } from "hono/http-exception";
import { Kysely } from "kysely";
import { serveStatic } from "hono/serve-static";

// Extend the Env type to include DB
declare global {
  type Env = Cloudflare.Env & { DB: D1Database };
  type Vars = {
    setError: <ErrorObject extends Error>(err: ErrorObject) => never;
    db: Kysely<DB>;
  }
}

const app = new OpenAPIHono<{
  Bindings: Env;
  Variables: Vars;
}>();

// Cors
app.use("*", (c, next) => {
  const corsHandler = cors({
    origin: [c.env.DOCS_HOST, c.env.MEDFETCH_DEV_HOST],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400
  });
  return corsHandler(c, next);
});

// Attach logger middleware
app.use(logger(customLogger));

// For server side errors, return 500
app.use(
  (c, next) => {
    c.set("setError",
      (err) => {
        customLogger(`Internal server error: ${err.message}`);
        throw new HTTPException(500, {
          message: err.message,
          cause: err.cause,
        })
      }
    );
    return next();
  }
);

// Helper function to build WHERE clause from filters
function buildWhereClause(filters: { field: string; operator: string; value: any }[] | undefined) {
  if (!filters || filters.length === 0) return '';
  
  const conditions = filters.map(filter => {
    const { field, operator, value } = filter;
    switch (operator) {
      case 'equals':
        return `${field} = '${value}'`;
      case 'contains':
        return `${field} LIKE '%${value}%'`;
      case 'greaterThan':
        return `${field} > ${value}`;
      case 'lessThan':
        return `${field} < ${value}`;
      case 'between':
        const [min, max] = value as [number, number];
        return `${field} BETWEEN ${min} AND ${max}`;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  });
  
  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
}

// Helper function to build ORDER BY clause from sort
function buildOrderByClause(sort: { field: string; direction: 'asc' | 'desc' }[] | undefined) {
  if (!sort || sort.length === 0) return '';
  
  const orders = sort.map(s => `${s.field} ${s.direction.toUpperCase()}`);
  return orders.length > 0 ? `ORDER BY ${orders.join(', ')}` : '';
}

// Helper function to build pagination
function buildPagination(pagination: any) {
  if (!pagination) return '';
  const { page, pageSize } = pagination;
  const offset = (page - 1) * pageSize;
  return `LIMIT ${pageSize} OFFSET ${offset}`;
}

// Table operations handler
app.openapi(db.tableOperation, async (c) => {
  try {
    const { table, operation, filters, sort, pagination, data } = c.req.valid('json');
    
    switch (operation) {
      case 'select': {
        const whereClause = buildWhereClause(filters || []);
        const orderByClause = buildOrderByClause(sort || []);
        const paginationClause = buildPagination(pagination);
        
        // Get total count
        const countQuery = `SELECT COUNT(*) as total FROM ${table} ${whereClause}`;
        const countResult = await c.env.DB.prepare(countQuery).first();
        const total = Number(countResult?.total || 0);
        
        // Get data
        const query = `
          SELECT * FROM ${table}
          ${whereClause}
          ${orderByClause}
          ${paginationClause}
        `;
        const result = await c.env.DB.prepare(query).all();
        
        return c.json({
          page: pagination?.page || 1,
          pageSize: pagination?.pageSize || 20,
          data: [...(result.results || [])],
          total,
          error: undefined
        }, 200);
      }
      
      case 'insert': {
        if (!data) {
          return c.json({
            page: 1,
            pageSize: 1,
            data: [],
            total: 0,
            error: 'Data is required for insert operation'
          }, 400);
        }
        
        const columns = Object.keys(data).join(', ');
        const values = Object.values(data).map(v => `'${v}'`).join(', ');
        const query = `INSERT INTO ${table} (${columns}) VALUES (${values})`;
        
        await c.env.DB.prepare(query).run();
        return c.json({
          page: 1,
          pageSize: 1,
          data: [],
          total: 1,
          error: undefined
        }, 200);
      }
      
      case 'update': {
        if (!data) {
          return c.json({
            page: 1,
            pageSize: 1,
            data: [],
            total: 0,
            error: 'Data is required for update operation'
          }, 400);
        }
        
        const whereClause = buildWhereClause(filters || []);
        const setClause = Object.entries(data)
          .map(([key, value]) => `${key} = '${value}'`)
          .join(', ');
        
        const query = `UPDATE ${table} SET ${setClause} ${whereClause}`;
        await c.env.DB.prepare(query).run();
        return c.json({
          page: 1,
          pageSize: 1,
          data: [],
          total: 1,
          error: undefined
        }, 200);
      }
      
      case 'delete': {
        const whereClause = buildWhereClause(filters || []);
        const query = `DELETE FROM ${table} ${whereClause}`;
        await c.env.DB.prepare(query).run();
        return c.json({
          page: 1,
          pageSize: 1,
          data: [],
          total: 1,
          error: undefined
        }, 200);
      }
      
      default:
        return c.json({
          page: 1,
          pageSize: 1,
          data: [],
          total: 0,
          error: `Unsupported operation: ${operation}`
        }, 400);
    }
  } catch (error) {
    return c.json({
      page: 1,
      pageSize: 1,
      data: [],
      total: 0,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, 500);
  }
});

// Bulk operations handler
app.openapi(db.bulkOperation, async (c) => {
  try {
    const { table, operation, filters, data } = c.req.valid('json');
    const whereClause = buildWhereClause(filters || []);
    
    switch (operation) {
      case 'update': {
        if (!data) {
          return c.json({
            affectedRows: 0,
            error: 'Data is required for update operation'
          }, 400);
        }
        
        const setClause = Object.entries(data)
          .map(([key, value]) => `${key} = '${value}'`)
          .join(', ');
        
        const query = `UPDATE ${table} SET ${setClause} ${whereClause}`;
        const result = await c.env.DB.prepare(query).run();
        return c.json({
          affectedRows: result.meta?.changes || 0,
          error: undefined
        }, 200);
      }
      
      case 'delete': {
        const query = `DELETE FROM ${table} ${whereClause}`;
        const result = await c.env.DB.prepare(query).run();
        return c.json({
          affectedRows: result.meta?.changes || 0,
          error: undefined
        }, 200);
      }
      
      default:
        return c.json({
          affectedRows: 0,
          error: `Unsupported operation: ${operation}`
        }, 400);
    }
  } catch (error) {
    return c.json({
      affectedRows: 0,
      error: error instanceof Error ? error.message : 'Internal server error'
    }, 500);
  }
});

// Schema operations handler
app.openapi(db.schemaOperation, async (c) => {
  try {
    const { table, operation, column } = c.req.valid('json');
    
    switch (operation) {
      case 'get': {
        const query = `PRAGMA table_info(${table})`;
        const result = await c.env.DB.prepare(query).all();
        return c.json({
          schema: [...(result.results || [])].map((col: any) => ({
            name: col.name,
            type: col.type,
            nullable: !col.notnull
          })),
          error: undefined
        }, 200);
      }
      
      case 'addColumn': {
        if (!column) {
          return c.json({
            schema: [],
            error: 'Column definition is required for addColumn operation'
          }, 400);
        }
        const { name, type, nullable } = column;
        const query = `ALTER TABLE ${table} ADD COLUMN ${name} ${type} ${nullable ? '' : 'NOT NULL'}`;
        await c.env.DB.prepare(query).run();
        return c.json({
          schema: [],
          error: undefined
        }, 200);
      }
      
      case 'removeColumn': {
        if (!column) {
          return c.json({
            schema: [],
            error: 'Column definition is required for removeColumn operation'
          }, 400);
        }
        
        // Get current schema
        const schemaQuery = `PRAGMA table_info(${table})`;
        const schemaResult = await c.env.DB.prepare(schemaQuery).all();
        const columns = [...(schemaResult.results || [])]
          .filter((col: any) => col.name !== column.name)
          .map((col: any) => `${col.name} ${col.type} ${col.notnull ? 'NOT NULL' : ''}`)
          .join(', ');
        
        // Create new table and copy data
        const queries = [
          `CREATE TABLE ${table}_new (${columns})`,
          `INSERT INTO ${table}_new SELECT ${[...(schemaResult.results || [])]
            .filter((col: any) => col.name !== column.name)
            .map((col: any) => col.name)
            .join(', ')} FROM ${table}`,
          `DROP TABLE ${table}`,
          `ALTER TABLE ${table}_new RENAME TO ${table}`
        ];
        
        for (const query of queries) {
          await c.env.DB.prepare(query).run();
        }
        
        return c.json({
          schema: [],
          error: undefined
        }, 200);
      }
      
      default:
        return c.json({
          schema: [],
          error: `Unsupported operation: ${operation}`
        }, 400);
    }
  } catch (error) {
    return c.json({
      schema: [],
      error: error instanceof Error ? error.message : 'Internal server error'
    }, 500);
  }
});

app.route("/nl2sql", nl2sql);
app.route("/fhir", fhir";

// openapi reference
app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Medfetch API",
  },
});

app.get("/", (c) => {
  return c.text("Hi mom!");
});

showRoutes(app);

export default app;
