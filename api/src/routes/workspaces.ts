import { OpenAPIHono } from "@hono/zod-openapi";
import { auth } from "~/lib/auth";
import { customLogger, db } from "~/middleware";
import { GET, POST } from "~/routes/workspaces/schema";

const workspaces = new OpenAPIHono<{
  Bindings: Env;
  Variables: Vars;
}>();

workspaces.openapi(POST, async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });
  if (!session) {
    return c.json({ error: "UNAUTHORIZED" }, 401);
  }
  const body = c.req.valid("json");
  const resultRow = await db
    .insertInto("workspaces")
    .values({
      name: body.name,
      userId: session.user.id,
      vfsType: "opfs",
    })
    .onConflict(oc => oc.columns(["userId", "name"]).doNothing())
    .returningAll()
    .executeTakeFirst();

  if (!resultRow) {
    return c.json({
      error: `You already have a workspace with that name: '${body.name}'`
    }, 409);
  }

  return c.json({
    id: resultRow.id,
    name: resultRow.name,
    vfsType: resultRow.vfsType
  }, 201);
});

function parseId(id: string) {
  let idNum: number | null = null;
  try {
    idNum = parseInt(id);
  } catch {
    customLogger(`That's not an int: '${id}'`);
  }
  return idNum;
}

workspaces.openapi(GET.one, async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  const workspaceId = parseId(c.req.param("id"));
  if (!workspaceId) {
    return c.json({ error: "Bad request" }, 400);
  }
  
  const resultRow = await db
    .selectFrom("workspaces")
    .selectAll("workspaces")
    .where("workspaces.id", "=", workspaceId)
    .executeTakeFirst();
  if (!resultRow || resultRow.userId !== session.user.id) {
    return c.json({ error: "Not Found" }, 404);
  }
  return c.json({
    id: resultRow.id,
    name: resultRow.name,
    vfsType: resultRow.vfsType
  }, 200);
});

workspaces.openapi(GET.list, async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers
  });
  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  
  const resultRows = await db
    .selectFrom("workspaces")
    .select([
      "id",
      "name",
      "vfsType"
    ])
    .where("workspaces.userId", "=", session.user.id)
    .execute();
  return c.json(resultRows, 200);
});

export default workspaces;
