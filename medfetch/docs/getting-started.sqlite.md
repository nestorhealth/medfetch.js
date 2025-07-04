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

const dialect = medfetch("https://my.fhir.api.com");
```

By default this will use the [CI FHIR Master JSON schema](https://build.fhir.org/downloads.html)
to generate the Virtual Table `CREATE TABLE` statements that SQLite3 needs upfront from the
Medfetch extension.


3. Instantiate ORM interface:
```ts
import { sql, Kysely } from "kysely";

const dialect = medfetch("https://my.fhir.api.com");
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

## Persistence
If you want to persist the database to [OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system), pass in a `filename`
field to the options arg1:

```ts
const dialect = medfetch("https://my.fhir.api.com", {
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

See the [About](./getting-started.what-is-medfetch-js.md#jsons-and-schemas) section for more info on JSON schema usage.