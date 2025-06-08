import schema from "./nl2sql.schema";
import { OpenAPIHono } from "@hono/zod-openapi";
import OpenAI from "openai";

const nl2sql = new OpenAPIHono<{
  Bindings: Env
}>();

nl2sql.openapi(schema.POST, async (c) => {
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

export default nl2sql;