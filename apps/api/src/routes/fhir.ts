import { OpenAPIHono, z } from "@hono/zod-openapi";
import hapiPatients from "../../public/hapi-patients.json";
import schema from "./fhir/schema";
import { Bundle } from "+/zod-fhir/Bundle";
import { Kysely, sql } from "kysely";
import { D1Dialect } from "kysely-d1";
import { migrations } from "medfetch/sql";

const fhir = new OpenAPIHono<{ Bindings: Env; Variables: Vars }>();

interface SqliteMaster {
  type: string;
  name: string;
  tbl_name: string;
  rootpage: number;
  sql: string | null;
}

export interface DB extends Record<string, any> {
  sqlite_master: SqliteMaster;
}

/* Attach d1 database client */
fhir.use((c, next) => {
  const db = new Kysely<DB>({
    dialect: new D1Dialect({
      database: c.env.DB,
    }),
  });
  c.set("db", db);
  return next();
});

fhir.openapi(schema.Patient.GET, async (c) => {
  return c.json(hapiPatients as z.infer<typeof Bundle>, 200);
});

export default fhir;
