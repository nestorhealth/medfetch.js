# SQLite
SQLite drivers supported by medfetch as of the time of writing are:
| Driver                    | Platform               | Notes                                 |
|---------------------------|------------------------|---------------------------------------|
| [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) | Browser / Node (Experimental) | Official SQLite WASM dialect |

## Installation
1. Install dependencies (including database driver):
```bash
pnpm add medfetch kysely @sqlite.org/sqlite-wasm
```

2. Create the [Dialect](https://kysely.dev/docs/dialects) for that `medfetch` client:
```ts
import medfetch from "medfetch/sqlite-wasm";

const dialect = medfetch(
    "https://my-rest-api.com",
    `CREATE TABLE "Patient" AS (id TEXT, name TEXT);`
);
```

3. Instantiate ORM interface:
```ts
import { sql, Kysely } from "kysely";

const dialect = medfetch("https://my.fhir.api.com", );
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

See the Kysely [docs](https://kysely.dev/) for details on usage.

## Schema and Maps
Your table names in your initial migrations text (2nd arg) will be the exact routes that are pinged.
For example:

```ts
const dialect = medfetch("https://restapi.com", `
    create table foo (id text);
    create table bar (id text);
`);
const db = new Kysely({ dialect });

// GET 'https://restapi.com/foo'
const foos = db.selectFrom("foo").selectAll().execute()
// GET 'https://restapi.com/bar'
const bars = db.selectFrom("bar").selectAll().execute()
```

If you want to get your migrations dynamically, pass in an async function instead 
(even if the dynamic generation is synchronous, you need to return a Promise):

```ts
const dialect = medfetch(
    "...",
    async () => fetch("https://myapi.com/migrations-01.sql").then(res => res.text())
);
```

`medfetch` can also generate the virtual table migrations from a [json schema](https://json-schema.org/).

```ts
import type { JSONSchema7 } from "json-schema";

const someJSONSchema: JSONSchema7 = {...}
const dialectJSONSchemaSync = medfetch(
    "...",
    someJSONSchema
);
const dialect = medfetch(
    "...",
    async () => fetch("https://myapi.com/my-json-schema").then(res => res.json() as JSONSchema7)
);
```

`medfetch` makes the **naive** assumption that your API returns an array of the table you declared.
For example, if you passed in the base URL "http://localhost:8787", then the query:

::: code-group
```ts
const foos = db.selectFrom("foo").selectAll().execute()
```
```sql
select * from "foo";
```
:::

Results in the underlying fetch call:

```ts
const response = await fetch(`http://localhost:8787/foo`);
```

If the API doesn't match up nicely with this assumption, `medfetch`
provides you an escape hatch via the `match` callback option in the configuration
argument, which allows you to remap the `Response` returned by the underlying fetch. call.

```ts
const dialect = medfetch("https://r4.smarthealthit.org", unzipJSONSchema, {
    match: (on) => [
        // To remap all responses
        on("*", (response) => response
            .json()
            .then(bundle => bundle.entry)
        ),
        on("Patient", (response) => response
            .json()
            .then(patientBundle => doSomePatientTransformation(patientBUndle))
        )
    ]
});
```

## Persistence
If you want to persist the database to [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system), pass in a `filename`
field to the options:

```ts
const dialect = medfetch("https://my.fhir.api.com", "...", {
    filename: "my-fhir.db"
})
```

This only makes a difference if you choose to "materialize" the virtual tables into real tables, otherwise, you're saving nothing
since the data from the virtual tables only exist at runtime:

## Data Types
Runtime data of Resources is determined by the `migrationText` 
plaintext value medfetch provides to sqlite3:
::: code-group
<<< ../src/sqlite-wasm/vtab.ts#vtab-factory{5}
:::

`migrationText` is determined by the `schema` argument passed into medfetch:

```ts
const myJSONSchema = {...}
const dialect = medfetch("...", {
    schema: myJSONSchema
})
```

See the [About](./guide.what-is-medfetch-js.md#jsons-and-schemas) section for more info on JSON schema usage.