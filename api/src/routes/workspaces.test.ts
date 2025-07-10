import workspaces from "~/routes/workspaces";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import authRouter from "~/routes/auth";
import { Hono } from "hono";
import { down, up } from "~/../migrations/01";
import { db } from "~/middleware";

let COOKIE: string | null = null;
let MY_WORKSPACE_ID: number | null = null;

const app = new Hono();

const checkPayload = (payload: unknown) => {
  expect(payload).toHaveProperty("id", 1);
  expect(payload).toHaveProperty("name", "my-workspace");
  expect(payload).toHaveProperty("vfsType", "opfs")
}

describe("/workspaces", () => {
  beforeAll(async () => {
    await down(db);
    await up(db);
    const tables = await db.introspection.getTables();
    console.log(
      "Migrated test tables are",
      tables.map((table) => table.name),
    );
    app.route("/auth", authRouter);
    app.route("/workspaces", workspaces);
    const response = await app.request("/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "test@email.com",
        name: "Test Client",
        password: "password",
      }),
    });
    COOKIE = response.headers.get("set-cookie")!;
  });
  afterAll(async () => {
    await down(db);
    await db.destroy();
  });

  test("[POST / > Unauthorized (401)]: Returns Unauthorized Error when no session cookie is sent in the fetch()", async () => {
    const res = await app.request("/workspaces", {
      method: "POST",
      body: JSON.stringify({
        name: "my-workspace",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(res.status).toEqual(401);
  });


  test.sequential("[POST / > Created (201)]: Works on new workspace body", async () => {
    const res = await app.request("/workspaces", {
      method: "POST",
      body: JSON.stringify({
        name: "my-workspace",
      }),
      headers: {
        Cookie: COOKIE!,
        "Content-Type": "application/json",
      },
    });
    expect(res.status).toEqual(201);
    const payload = await res.json();

    MY_WORKSPACE_ID = (payload as {id: number}).id;
    console.log(`Successfully created test workspace. Setting global "MY_WORKSPACE_ID" to ${MY_WORKSPACE_ID}`)
    expect(typeof MY_WORKSPACE_ID).toEqual("number");
    checkPayload(payload)
  });
  
  test.sequential("[POST / > Conflict (409)]: Returns conflict error on same-user, same-name database", async () => {
    const res = await app.request("/workspaces", {
      method: "POST",
      body: JSON.stringify({
        name: "my-workspace",
      }),
      headers: {
        Cookie: COOKIE!,
        "Content-Type": "application/json",
      },
    });
    expect(res.status).toEqual(409);
  })
  
  test.sequential("[GET /{id} > OK (200)]: Returns back newly created workspace object", async () => {
    const res = await app.request(`/workspaces/${MY_WORKSPACE_ID}`, {
      headers: {
        Cookie: COOKIE!,
        "Content-Type": "application/json"
      }
    });
    expect(res.status).toEqual(200);
    const payload = await res.json();
    checkPayload(payload);
  });
});
