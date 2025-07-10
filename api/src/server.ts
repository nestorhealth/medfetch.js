import app from "~/app";
import { serve } from "@hono/node-server";
import "dotenv/config";

serve({
  port: 8787,
  fetch: app.fetch
});
