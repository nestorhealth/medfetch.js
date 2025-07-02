# SQLite (on FHIR)
SQLite drivers supported by medfetch as of the time of writing are:
| Driver                    | Platform               | Notes                                 |
|---------------------------|------------------------|---------------------------------------|
| [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) | Browser / Node (Experimental) | Official SQLite WASM dialect |

## Usage
1. Install dependencies (including database driver)
```bash
pnpm add medfetch kysely @sqlite.org/sqlite-wasm
```

2. You can create the client for that corresponding client from the module
```ts
import medfetch from "medfetch/sqlite-wasm";
import { Kysely } from "kysely";

// This is just a Kysely Dialect
const dialect = medfetch(":memory:", "https://my.fhir.api.com", [
    /* There are over a lot of resources so you are in charge
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

See their [docs](https://kysely.dev/) for usage.
