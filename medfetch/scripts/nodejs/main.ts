import { Kysely } from "kysely";
import { medfetch } from "../../src/sqlite-wasm.node.js";
import { isMainThread, Worker } from "node:worker_threads";
import { setSyncFetch } from "./worker.js";

if (isMainThread) {
  console.log("here?")
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
        workerData: {
            name: "db",
        },
    });
    setSyncFetch(worker).then(async () => {
        const dialect = medfetch(":memory:", `http://localhost:8787/fhir`, {
            scope: ["Patient"],
            worker,
        });
        const db = new Kysely<any>({ dialect });
        db.selectFrom("Patient")
            .selectAll("Patient")
            .execute()
            .then(console.log);
    });
}
