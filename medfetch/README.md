# Medfetch.js
An in-database Javascript [sql-on-fhir](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/) implementation. It connects [@sqlite.org/sqlite-wasm]() 
loaded with our custom virtual-table extension to a [kysely]() orm instance.

## Quick start
1. Install
```bash
pnpm add medfetch kysely @sqlite.org/sqlite-wasm
```

2. Create your sql-on-fhir dialect and instantiate db client
```ts
import { sqliteOnFhir } from "medfetch/sqlite";
import { Kysely } from "kysely";

const dialect = sqliteOnFhir(":memory:", "https://my.fhir.api.com", [
    /* There are over 150 resources so you are in charge
       of picking which ones you care about. */
    "Patient",
    "Condition",
    "Encounter"
]);

export const db = new Kysely({ dialect });
```

You can infer the resolved database type using the infer field `.$db` from the dialect if you're using typescript:
```ts
export const db = new Kysely<typeof dialect.$db>({ dialect }
```