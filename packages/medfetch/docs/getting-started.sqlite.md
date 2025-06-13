# SQLite on FHIR
SQLite drivers supported by medfetch as of the time of writing are:
| Driver                    | Platform               | Notes                                 |
|---------------------------|------------------------|---------------------------------------|
| [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) | Browser / Node (Experimental) | Official SQLite WASM dialect |

## Installation
1. Install dependencies
```bash
pnpm add medfetch kysely @sqlite.org/sqlite-wasm
```

2. Create your sql-on-fhir dialect and instantiate db client
```ts
import { sqliteOnFhir } from "medfetch/sqlite";
import { Kysely } from "kysely";

// This is just a Kysely dialect
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

Then you use this like you would any Kysely ORM instance. See their [docs](https://kysely.dev/) for more.