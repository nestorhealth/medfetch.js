import { betterAuth } from "better-auth";
import { db } from "~/middleware";
import { openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/auth",
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
