import { Kysely } from "kysely";
import DBWorker from "./db.worker?worker";
import medfetch from "~/sqlite-wasm";
import { unzipJSONSchema } from "~/json/page";

const worker = new DBWorker({
  name: "db.worker",
});

export const db = new Kysely<any>({
  dialect: medfetch(
    import.meta.env.DEV
      ? "http://localhost:8787/fhir"
      : "https://api.medfetch.io/fhir",
    {
      worker,
      schema: () => unzipJSONSchema()
    },
  )
});