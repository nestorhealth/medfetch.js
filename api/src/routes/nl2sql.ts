import schema from "./nl2sql/schema";
import { OpenAPIHono } from "@hono/zod-openapi";
import { translate } from "~/routes/nl2sql/ai";

const nl2sql = new OpenAPIHono<{
  Variables: Vars;
  Bindings: Env;
}>();

nl2sql.openapi(schema.POST, async (c) => {
  try {
    const { query: userQuery, tableStatement  } = c.req.valid("json");

    if (!userQuery) {
      return c.json({ error: "Query is required" }, 400);
    }
    const response = await translate(c, userQuery, tableStatement);

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