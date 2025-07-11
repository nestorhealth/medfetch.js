# Getting started
Medfetch.js doesn't ship with its own database, so you need to provide that connection. 
Supported Javascript drivers as of the time of writing are:
| Driver                                                                             | Database | Browser | Node.js           |
|------------------------------------------------------------------------------------|----------|---------|-------------------|
| [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) | SQLite   | ✅       | ⚠️ (Experimental) |

## Installation
1. Install dependencies (including database driver):
::: code-group

```bash [sqlite-wasm]
pnpm add medfetch kysely @sqlite.org/sqlite-wasm
```
:::

2. Create the [Dialect](https://kysely.dev/docs/dialects) for that `medfetch` client:
```ts
import medfetch from "medfetch/sqlite-wasm";

const dialect = medfetch(
    process.env.NEXT_PUBLIC_API_URL!,
    `CREATE TABLE "Patient" AS (id TEXT, name TEXT);`
);
```

3. Instantiate ORM interface:
```ts
import medfetch from "medfetch/sqlite-wasm";
import { sql, Kysely } from "kysely";

const dialect = medfetch(
    process.env.NEXT_PUBLIC_API_URL!,
    `CREATE TABLE "Patient" AS (id TEXT, name TEXT);`
);
const db = new Kysely<{
    Patient: {
        id: string;
        name: string | null;
    }
}>({ dialect: dialect });

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
Your table names in your initial migrations text (2nd arg) will be the exact routes that are pinged,
with the URL being resolved as `/${baseURL}/${tableName}`.
For example:

```ts
const dialect = medfetch("https://some-api.com", `
    create table foo (id text);
    create table bar (id text);
`);
const db = new Kysely({ dialect });

// GET 'https://restapi.com/foo'
const foos = db.selectFrom("foo").selectAll().execute()
// GET 'https://restapi.com/bar'
const bars = db.selectFrom("bar").selectAll().execute()
```

You can provide this migration text in **4** different ways:
1. As a plaintext value
```ts
const migrationText = "create table \"Patient\" (id TEXT PRIMARY KEY, name TEXT)";
const dialect = medfetch(
    process.env.NEXT_PUBLIC_API_URL,
    migrationText
);
```

2. As a [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise):
```ts
const getMigrationText = async () => fetch("https://some-api.com/migrations/01.sql")
    .then(res => res.text());
const dialect = medfetch(
    process.env.NEXT_PUBLIC_API_URL!,
    getMigrationText()
);
```

3. As an `async` function that returns the migration text (so returns the text in a promise):
```ts
const getMigrationText = async () => fetch("https://some-api.com/migrations/01.sql")
    .then(res => res.text());
const dialect = medfetch(
    process.env.NEXT_PUBLIC_API_URL!,
    getMigrationText // No call! Terser version of writing '() => getMigrationText()'
);
```

4. As a synchronous function that returns the migration text:
```ts
const getMigrationText = () => {
    const textParts = getPlaintexts();
    return joinTextParts(textParts);
}
const dialect = medfetch(
    process.env.NEXT_PUBLIC_API_URL!,
    getMigrationText // No call! Terser version of writing '() => getMigrationText()'
);
```

The `medfetch` entry point doesn't care how you pass it in, though it's recommended to pass it
in as a plaintext value over a synchronous function, and **definitely** recommended to pass an async function 
over the underlying `Promise` to minimize side-effects from firing at entry-time.

`medfetch` can also generate the virtual table migrations from a [json schema](https://json-schema.org/):

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

`medfetch` makes the **naive** assumption that your API returns an array of the table you declared at that endpoint.
For example, if you set the base URL to `(http|https)://localhost:8787`:

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
            .then(patientBundle => validatePatientBundle(patientBundle))
            .then(bundle => bundle.entry.map(entry => entry.resource))
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
TODO