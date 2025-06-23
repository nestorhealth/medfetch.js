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
import { medfetch } from "medfetch/sqlite-wasm";
import { Kysely } from "kysely";

const dialect = medfetch(":memory:", "https://my.fhir.api.com", [
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

## Developing
Docs are in /docs. It deploys to cloudflare workers as a static build.
The official ones are on https://docs.medfetch.io. It updates on pushes to
main.

There are two kinds of module exports this package ships.

1. SQL-on-FHIR related functions.
These are always **named** exports, with the 
`/` prefix matching that of the database-driver name. 
You always import them with the `{ }` curly braces like so:
```ts
import { loadExtension } from "medfetch/sqlite-wasm";
```

If there is a node import available, it will be aliased in the `package.json`
under the same export group under the "node" section, meaning the import will
remain the EXACT same.

2. "Platform" based functions.
These are always **default** exports with the name matching that of the module.
Named value exports are only available in the *base* implementation of that function, (the one titled src/{name}.ts only),
which are generally helpers that the other platform-specific use to make their own implementation of the base.

The *base* implementation will almost be a Browser version, simply because it has the least explicit
amount of dependencies required.

These modules *always* end in `.js` as an arbitrary convention. For example, 

```ts
import block from "medfetch/block.js";
```

Platform specific versions are *NOT* bundled under the same export path, instead
being shipped in its dedicated `{name}.{PLATFORM}.js`.

```ts
import block from "medfetch/block.node.js";
```

The main reason is because of types since these "lower level" primitives tend to be very type-specific
and I don't want to be doing more Typescript Gymnastics than worker messages require!