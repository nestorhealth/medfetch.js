import nl2sql from "./routes/nl2sql";
import db from "./routes/db";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import OpenAI from "openai";
import { D1Database } from "@cloudflare/workers-types";

// Extend the Env type to include DB
declare global {
  interface Env {
    OPENAI_API_KEY: string;
    DOCS_HOST: string;
    DB: D1Database;
  }
}

const app = new OpenAPIHono<{
  Bindings: Env;
}>();

app.use("*", (c, next) => {
  const corsHandler = cors({
    origin: [c.env.DOCS_HOST],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400
  });
  return corsHandler(c, next);
});

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

// Existing nl2sql route
app.openapi(nl2sql.POST, async (c) => {
  try {
    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });
    const { query: userQuery } = c.req.valid("json");

    if (!userQuery) {
      return c.json({ error: "Query is required" }, 400);
    }

    // Prepare the system prompt with the specific instructions
    const systemPrompt = `You are the Medfetch NL→SQL Translator. Your job is simple and precise:

1. **Schema Reference**  
   You know the exact SQLite schema for two tables:

    Name: "Patient"
   ┌─────────────┬────────┐
   │ Column      │ Type   │
   ├─────────────┼────────┤
   │ rowid       │ INTEGER│
   │ patient_id  │ TEXT   │
   │ givenName   │ TEXT   │
   │ familyName  │ TEXT   │
   │ birthDate   │ TEXT   │
   │ gender      │ TEXT   │
   │ condition   │ TEXT   │
   │ status      │ TEXT   │
   └─────────────┴────────┘

   and

    Name: "Procedure"
   ┌──────────────────┬────────┐
   │ Column           │ Type   │
   ├──────────────────┼────────┤
   │ rowid            │ INTEGER│
   │ procedure_id     │ TEXT   │
   │ patient_id       │ TEXT   │
   │ code             │ TEXT   │
   │ performedDate    │ TEXT   │
   │ notes            │ TEXT   │
   └──────────────────┴────────┘

2. **Behavior**  
   - You will receive these inputs from the user in JSON:
     • query: A natural-language description of what to do.  
     • Optional filter: A JSON object mapping column names to filter values (e.g. {"gender":"female","condition":"Diabetes"}).  
     • Optional sortBy: The name of the column to sort by.  
     • Optional sortDir: Either asc or desc (default is asc if sortBy is provided).

   - Produce exactly two things for any valid request:
     1. A one-sentence summary, prefixed with "Summary: ".  
     2. A fenced code block labeled "sql", containing only valid SQLite statements (UPDATE/INSERT/DELETE or SELECT) that implement the intent including any WHERE filters and ORDER BY sorting as specified.

   - Examples:

     (1) Only Query:  
     Summary: I will update the status field to 'Reviewed' for diabetic patients.  

     \`\`\`sql
     UPDATE Patient
       SET status = 'Reviewed'
       WHERE condition = 'Diabetes';
     \`\`\`

     (2) Query + Filter + Sort (SQL generation):  
     Imagine the user supplies:  
     {
       "query": "Return all patients",
       "filter": {"gender":"female","condition":"Asthma"},
       "sortBy": "familyName",
       "sortDir": "desc"
     }  
     You should output:  
     Summary: I will select all female patients with Asthma, sorted by last name descending.

     \`\`\`sql
     SELECT *
       FROM Patient
       WHERE gender = 'female'
         AND condition = 'Asthma'
       ORDER BY familyName DESC;
     \`\`\`

3. **Error Handling**  
   - If the user's request is ambiguous, or references a column that does not exist, respond with exactly:  
     ERROR: <brief explanation>
     and do not output any SQL code.  

4. **Edge Cases**  
   - If filter is provided but empty, ignore it (no WHERE clause).  
   - If sortBy is provided without sortDir, assume ASC.  
   - If sortDir is provided without sortBy, respond with ERROR: sortDir provided but sortBy is missing.  
   - For INSERT or DELETE, incorporate filters/sort only if they logically apply (e.g. DELETE FROM Procedure WHERE code = 'XRAY' ORDER BY performedDate DESC; is allowed but nonsensical—GPT should prioritize WHERE then omit ORDER BY if not applicable).

5. **No Extra Output**  
   - Under no circumstances should you output anything besides the one-sentence summary line, followed by a single sql fenced block, or an ERROR: line.  
   - Do not add commentary, bullet lists, or apologies—only follow this precise format.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userQuery,
        },
      ],
      temperature: 0.1, // Low temperature for more deterministic results
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      return c.json({ 
        summary: "Failed to generate response",
        error: "No response from OpenAI"
      }, 500);
    }

    // Parse the response
    const lines = response.split("\n");
    let summary = "";
    let sql = "";
    let error = "";

    // Extract summary and SQL/error
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith("Summary:")) {
        summary = line.substring(8).trim();
      } else if (line.startsWith("ERROR:")) {
        error = line.substring(6).trim();
        break;
      } else if (line.startsWith("```sql")) {
        // Collect all SQL lines until the closing ```
        let sqlLines = [];
        i++; // Skip the ```sql line
        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          sqlLines.push(lines[i]);
          i++;
        }
        sql = sqlLines.join("\n").trim();
      }
    }

    // If we have an error, return it with a default summary
    if (error) {
      return c.json({
        summary: "Error occurred while processing request",
        error
      }, 400);
    }

    // If we have no summary (shouldn't happen with GPT-4), use a default
    if (!summary) {
      summary = "Generated SQL query";
    }

    // Return the parsed response
    return c.json({
      summary,
      sql: sql || undefined,
      error: undefined
    }, 200);
  } catch (error) {
    return c.json({
      summary: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error"
    }, 500);
  }
});

app.get("/", (c) => {
  return c.text("Hi mom!");
});

app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "Medfetch API",
  },
});

export default app;
