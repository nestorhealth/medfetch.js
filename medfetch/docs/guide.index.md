---
outline: [2, 3]
---
# Getting Started
SQLite drivers supported by medfetch as of the time of writing are:
| Driver                    | Platform               | Notes                                 |
|---------------------------|------------------------|---------------------------------------|
| [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) | Browser / Node (Experimental) | Official SQLite WASM dialect |

(lol)

## Steps
### 1. Install dependencies
You're going to need this package + [Kysely](https://kysely.dev)
```bash
pnpm add medfetch kysely
```
Medfetch (plans) to support a variety of javascript database drivers so you need to install the driver(s) yourself.
For the Web Assembly build of [SQLite](http://sqlite.org/wasm):
```bash
pnpm add @sqlite.org/sqlite-wasm
```

### 2. Create your dialect
```ts
import { medfetch } from "medfetch/sqlite-wasm";

const dialect = medfetch(":memory:", "https://my.fhir.api.com", {
    scope: ["Patient", "Condition", "Encounter"]
});
```
The `dialect` object returned is **just** an implementation of a [Dialect](https://kysely.dev/docs/dialects)
from [kysely](https://kysely.dev).

### 3. Load it onto [Kysely](https://kysely.dev) ORM
```ts
import { medfetch } from "medfetch/sqlite-wasm";
import { Kysely } from "kysely"; // <-- Add this

// This is just a Kysely dialect with one additional compile-level field 
// for optional typescript inference
const dialect = medfetch(":memory:", "https://my.fhir.api.com", {
    scope: ["Patient", "Condition", "Encounter"]
});

// Pass in dialect to get back plain Kysely instance
export const db = new Kysely({ dialect }); 

```

If you want to providing an existing worker thread instead (not yet stable API):
```ts
import { medfetch } from "medfetch/sqlite-wasm";
import { Kysely } from "kysely";
// If your bundler supports ?worker url imports
import MyOwnDbWorker from "./db-worker.js?worker"; 

const DbWorker = new MyOwnDbWorker();
const dialect = medfetch(":memory:", "https://my.fhir.api.com", {
    scope: ["Patient", "Condition", "Encounter"],
    worker: DbWorker
});

export const db = new Kysely({ dialect });
```

## Typescript
If you're on Typescript *and* you know the database-schema you want to work with upfront,
then you can define your own FHIR type definitions like so:
```ts
type ManuallyTypedPatient = {
    id: string;
    resourceType: "Patient";
    ...
};
type ManuallyTypedCondition = {
    id: string;
    resourceType: "Condition";
    ...
}

type RESOURCES = ManuallyTypedPatient | ManuallyTypedCondition;
const dialect = medfetch<RESOURCES>(":memory:", "http://my.fhir.api.com", {
    // Now "scope" values are limited to "resourceType" field values you passed in!
    scope: ["Patient", "Condition"] 
});
const db = new Kysely<typeof dialect.$db>({ dialect });

// The query-builder is now typed!
const myPatients = await db.selectFrom("Patient").selectAll("Patient").execute();
```


All you get are the runtime *types*. No *values* are changed whatsoever at runtime. So if you imported the types from the official
[FHIR](https://www.npmjs.com/package/@types/fhir) types library and made a query like this, you'd just get back the field types:

```ts{6}
import type { Patient, Address } from "fhir/r5";
const dialect = medfetch<Patient>(...);
const patientDB = new Kysely<typeof dialect.$db>({ dialect });

// Typescript will say you're right here
const addresses: {address: Address[]}[] = await patientDB
    .selectFrom("Patient")
    .select("address")
    .execute();
```
By default, `medfetch` will convert all complex (object) types into text/blobs (depending on the underlying database),
only retaining *scalar* values such as plain `TEXT`, `INTEGER`, `REAL`, etc. In general, `medfetch` will "retain"
over "reduce" FHIR data key-values that it pipes into your database.

> [!IMPORTANT]
> The ONLY explicit "reduction" of data `medfetch` does by default is reducing [Reference](https://build.fhir.org/references.html) fields
into their scalar `Reference.reference` value. This was done so JOINs don't take millenia.

If you want to grab these so-called "scalar-value" types from existing types (such as the offical FHIR ones), you can use the exported `Rowify` helper type from `medfetch/sql`.

<<< ../src/sql.ts#snippet{}

You can use it like this:

```ts
import type { Rowify } from "medfetch/sql";
import type { Patient } from "fhir/r5";

type PatientRow = Rowify<Patient>;
const dialect = medfetch(":memory:", "https://my.fhir.api.com", {
    scope: ["Patient", "Condition", "Encounter"],
    worker: DbWorker
});
```

Please don't use static types as a replacement for data-validation if you're pulling from sources
you don't control!