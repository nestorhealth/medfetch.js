import { Kysely, CamelCasePlugin, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";
import { Pool } from "pg";

export const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL!,
  }),
});


export const db = new Kysely<DB>({
  dialect: dialect,
  plugins: [new CamelCasePlugin()],
});
