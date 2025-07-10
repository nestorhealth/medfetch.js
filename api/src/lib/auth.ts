import { betterAuth } from "better-auth";
import { db } from "~/middleware";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none"
    }
  },
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/auth",
  trustedOrigins: [process.env.MEDFETCH_DEMO_HOST ?? "https://medfetchjs.pages.dev", process.env.MEDFETCH_DOCS_HOST ?? "https://docs.medfetch.io"],
  database: {
    db: db,
    type: "postgres",
    casing: "camel",
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [openAPI()],
});
