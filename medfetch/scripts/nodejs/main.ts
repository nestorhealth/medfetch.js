import { isMainThread, Worker } from "node:worker_threads";
import { setSyncFetch } from "./worker.js";

if (isMainThread) {
    const worker = new Worker(new URL("./worker.js", import.meta.url), {
        workerData: {
            name: "db",
        },
    });
    setSyncFetch(worker).then(async () => {
        console.log("Main set worker")
    });
}
