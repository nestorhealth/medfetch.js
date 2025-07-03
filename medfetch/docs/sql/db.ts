import { Kysely } from "kysely";
import DBWorker from "./db.worker?worker";
import medfetch from "~/sqlite-wasm";

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
      scope: ["Patient", "Condition"],
    },
  )
});