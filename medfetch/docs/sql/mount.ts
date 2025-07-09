import { type Ref } from "vue";
import DBWorker from "./db.worker?worker";
import { Kysely } from "kysely";
import medfetch from "~/sqlite-wasm";
import { table0, table1 } from "./icd-queries";
import { virtualMigration, unzipJSONSchema } from "~/sql";
import { API_URL } from "../data/env";

type Column = {
  name: string;
  dataType: string;
};
type ViewState = { rows: Record<string, unknown>[]; columns: Column[] };

export const mount = (viewStates: Ref<ViewState[]>) => {
  return async () => {
    try {
      const worker = new DBWorker({
        name: "db.worker",
      });

      const db = new Kysely<any>({
        dialect: medfetch(API_URL,
          virtualMigration(() => unzipJSONSchema(), {
            generatedPaths: new Map([
              [
                "#/definitions/Reference",
                "#/definitions/Reference/properties/reference",
              ],
            ]),
          }),
          {
            worker,
          },
        ),
      });
      const t0 = await table0(db);
      const t1 = await table1(db);
      const views: ViewState[] = [t0, t1];
      viewStates.value = views;
    } catch (e) {
      console.error(e);
    }
  };
};
