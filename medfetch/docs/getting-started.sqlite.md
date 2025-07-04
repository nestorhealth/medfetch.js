# SQLite (on FHIR)
SQLite drivers supported by medfetch as of the time of writing are:
| Driver                    | Platform               | Notes                                 |
|---------------------------|------------------------|---------------------------------------|
| [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) | Browser / Node (Experimental) | Official SQLite WASM dialect |

## Installation
1. Install dependencies (including database driver)
```bash
pnpm add medfetch kysely @sqlite.org/sqlite-wasm
```

2. Create the [Dialect](https://kysely.dev/docs/dialects) for that `medfetch` client
```ts
import medfetch from "medfetch/sqlite-wasm";

const dialect = medfetch("https://my.fhir.api.com", [
    /* There are over a lot of resources so you are in charge
       of picking which ones you care about. */
    "Patient",
    "Condition",
    "Encounter"
]);
```
::: tip
If you don't specify the scope (2nd array arg of resources):
```ts
import medfetch from "medfetch/sqlite-wasm";

const dialect = medfetch("https://my.fhir.api.com");
```

Then `medfetch` will attempt to make a Virtual Table for every Resource listed in the base FHIR JSON schema
that the database will a fetch call to internally at query-time. 

<<< ../src/json/sql.ts#snippet{3-5}

This on its own won't (shouldn't) break the client instantiation flow, since the database will only throw on query-time of the 404 Resource.
But if you know what Resources your app needs ahead of time, you should always specify the scope to speedup the schema lookup time since
that *isn't* an insignificant cost.
:::


3. Instantiate ORM interface:
```ts
import { sql, Kysely } from "kysely";

const dialect = medfetch("https://my.fhir.api.com", [
    "Patient", "Condition", "Encounter"
]);
const db = new Kysely<any>({ dialect: dialect });

// This is just a kysely orm instance
const patients = await db
    .selectFrom("Patient")
    .selectAll("Patient")
    .execute();
// Kysely also lets you pass in raw SQL text
const patientsFromRawQuery = await sql
    .raw("select * from \"Patient\";")
    .execute(db)
    .then(result => result.rows);
```

You can infer the resolved database type using the infer field `.$db` from the dialect if you're using typescript:
```ts
export const db = new Kysely<typeof dialect.$db>({ dialect });
```

See the Kysely [docs](https://kysely.dev/) for details on usage.

## Persistence
If you want to persist the database to [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system),
pass an object as arg1 instead of an array. The resources list will now be specified in the `scope` field:
```ts
const dialect = medfetch("https://my.fhir.api.com", {
    scope: ["Patient", "Condition", "Encounter"],
    filename: "my-fhir.db"
})
```
This only makes a difference if you choose to "materialize" the virtual tables into real tables, otherwise, you're saving nothing
since the data from the virtual tables only exist at runtime.
