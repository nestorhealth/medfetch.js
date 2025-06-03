import nl2sql from "./routes/nl2sql";
import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";
import OpenAI from "openai";

const app = new OpenAPIHono<{
  Bindings: Cloudflare.Env;
}>();

app.use("/*", (c, next) => {
  const corsHandler = cors({
    origin: [c.env.DOCS_HOST],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    maxAge: 86400
  });
  return corsHandler(c, next);
});

app.openapi(nl2sql.POST, async (c) => {
  try {
    const openai = new OpenAI({
      apiKey: c.env.OPENAI_API_KEY,
    });
    const { query } = c.req.valid("json");

    if (!query) {
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
   - When you receive a researcher's natural-language request, you will output exactly two things:
     1. **A one-sentence summary**, prefixed with \`Summary: \`.  
     2. **A fenced code block labeled \`sql\`**, containing only valid SQLite statements (UPDATE/INSERT/DELETE) that implement that intent.
   - **Format example**:
     \`\`\`
     Summary: I will update the status field to 'Reviewed' for diabetic patients older than 50.

     \`\`\`sql
     UPDATE Patient
       SET status = 'Reviewed'
       WHERE condition = 'Diabetes'
         AND ((julianday('now') - julianday(birthDate)) / 365.25) >= 50;
     \`\`\`
     \`\`\`
   - **Important:** 
      Assume any NL queries that translate to migration-related statements (i.e. ALTER TABLE) are related to the "Patient"
      table only and assume the querier can only read from the "Patient" table. Further, for any NL queries that translate
      to adding any columns in the form of:
      \`\`\`sql
      ALTER TABLE Patient
      ADD (...);
      \`\`\`
      Your available choices are any columns from the "Procedure" table and any "Patient" tables
      the user has removed and is asking to be put back.
      Do not output any other commentary, prose, or disclaimers. Only the summary line and the SQL code.  

3. **Error Handling**  
   - If the request is **ambiguous** or if it references a column that does not exist, respond with exactly:
     \`\`\`
     ERROR: <brief explanation>
     \`\`\`
     and do not emit any SQL code.  

4. **Edge Cases**  
   - If the user wants to **INSERT** a new record, generate a valid \`INSERT INTO Patient (...) VALUES (...)\` statement.  
   - If the request implies multiple SQL statements, you may output multiple statements inside the same fenced block, separated by semicolons and each ending with a semicolon.  

5. **No Extra Output**  
   - Under no circumstances should you output anything besides (1) a one-sentence summary and (2) a \`\`\`sql fenced block\`\`\`, or an \`ERROR:\` line.  
   - Do not give a numbered list, do not add commentary on best practices, do not apologize—only follow this exact format.`;

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
          content: query,
        },
      ],
      temperature: 0.1, // Low temperature for more deterministic results
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
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

    // Return the parsed response
    return c.json(
      {
        summary,
        sql: sql || undefined,
        error: error || undefined,
      },
      200
    );
  } catch (error) {
    return c.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      500
    );
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
