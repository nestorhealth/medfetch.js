import { compile } from "fhirpath";
import { getFetchPath } from "./src/sqlite";

const f = <TPath extends string>(path: TPath) => compile(path, undefined, { async: false });

const bundle = {
  "link": f("link"),
  "link.relation": f("link.relation"),
  "link.url": f("link.url"),
  "entry": f("entry"),
  "entry.resource": f("entry.resource")
};

const Bundle = {
    entry: Object.assign((data: any[]) => bundle["entry"](data), {
      resource: bundle["entry.resource"]
    }),
    link: Object.assign((data: any[]) => bundle["link"](data), {
      relation: (data: any[]) => bundle["link.relation"](data),
      url: (data: any[]) => bundle["link.url"](data)
    }),
};

import Database from "better-sqlite3";

const db = new Database(":memory");
db.loadExtension(getFetchPath());

db.prepare("insert into fhir values ('r4', 'https://r4.smarthealthit.org')").run()
