import { promiserSyncV2 } from "~/sqlite-wasm/worker1.main.js";
import { Worker1PromiserDialect } from "~/sqlite-wasm/dialect.js";
import { Kysely } from "kysely";
import { Worker1Promiser } from "~/sqlite-wasm/types.patch";

interface MedfetchSqlite3WasmOptions {
    filename?: string;
    worker?: Worker;
}

export function medfetch<DB = any>(
    baseURL: string | File,
    opts: MedfetchSqlite3WasmOptions = {},
) {
    let promiser: Worker1Promiser;
    if (opts.worker) {
        promiser = promiserSyncV2(opts.worker);
    } else {
        promiser = promiserSyncV2(new Worker(
          new URL(
            import.meta.env.DEV ?
            "./worker" : "./worker.mjs",
            import.meta.url
          ),
          {
            type: "module"
          }
        ));
    }

    const dialect = new Worker1PromiserDialect(baseURL, promiser);
    return new Kysely<DB>({
        dialect
    });
}
