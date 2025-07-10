import { createMiddleware } from "hono/factory";
import { cors as corsMiddleware } from "hono/cors";
import { HTTPException } from "hono/http-exception";

export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest);
};

export const cors = createMiddleware<{Bindings: Env}>(async (c, next) => {
  const corsHandler = corsMiddleware({
    origin: [c.env?.MEDFETCH_DOCS_HOST ?? "https://docs.medfetch.io", c.env?.MEDFETCH_DEMO_HOST ?? "https://medfetchjs.pages.dev", ...c.env.MEDFETCH_RESEARCH_HOST],
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
    credentials: true
  });
  return corsHandler(c, next);
});

export const errorSetter = createMiddleware<{ Variables: Vars }>((c, next) => {
  c.set("setError", (err) => {
    customLogger(`Internal server error: ${err.message}`);
    throw new HTTPException(500, {
      message: err.message,
      cause: err.cause,
    });
  });
  return next();
});
