import { type Ref } from "vue";
import DBWorker from "./db.worker?worker";
import { Kysely } from "kysely";
import medfetch from "~/sqlite-wasm";
import { table0, table1 } from "./icd-queries";
import { API_URL } from "../data/env";
import type { JSONSchema7 } from "json-schema";
import { unzipSync, strFromU8 } from "fflate";

async function unzipJSONSchema(
  zipURL: string = "https://build.fhir.org/fhir.schema.json.zip",
  filename: string = "fhir.schema.json",
): Promise<JSONSchema7> {
  const response = await fetch(zipURL).catch((error) => {
    console.error(`Couldn't handle "fetch" request: ${error}`);
    throw new Error();
  });
  if (!response.ok) {
    console.error(`Bad response from endpoint: ${zipURL}`, response.status);
    throw new Error();
  }

  const entries = unzipSync(new Uint8Array(await response.arrayBuffer()));
  const schemaFile = entries[filename];
  if (!schemaFile) {
    console.error(
      `Schema file ${filename} not found in unzipped. Keys are: ${Object.keys(entries)}`,
    );
    throw new Error();
  }

  try {
    const parsed: JSONSchema7 = JSON.parse(strFromU8(schemaFile));
    return parsed;
  } catch (error) {
    const msg = `Couldn't parse the JSON file ${filename}: ${error}`;
    throw new Error(msg);
  }
}

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
        dialect: medfetch(API_URL, unzipJSONSchema, {
          worker,
        }),
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
