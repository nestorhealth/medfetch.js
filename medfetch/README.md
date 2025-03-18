# medfetch-sof
SQL on FHIR implementation

## Building the C extensions
x86:
> pnpm build:x86

ARM:
> pnpm build:arm

Binaries output at the `bin/<dialect>/<arch>` folder. So
to find the `postgresql` extension for x86, it would be located at:
> bin/postgresql/x86_64/fetch.so

To build a specific extension, the build script is named
`pnpm build:<dialect>:<arch>`

So to build the SQLite extension for x86, you would run:
>pnpm build:sqlite-x86

`package.json` holds the rest of the scripts if you ever want to look them up.

## sqlite-on-fhir
### How it works
Extend SQLite with the fetch loadable extension to run the
Medfetch implementation of SQL On FHIR for [SQLite](https://www.sqlite.org/). It does 2 things:

1. Creates the `"fhir"` auxilliary table:
```sql
CREATE TABLE IF NOT EXISTS fhir (
    /* a unique alias used to denote the server in the eventual `fetch`  call */
    id TEXT PRIMARY KEY NOT NULL,
    
    /* the base url of the server */
    base_url TEXT NOT NULL
);
```

2. Provides the `fetch` [virtual table](https://www.sqlite.org/vtab.html) implementation. The virtual table interface is a simple 1-column table:
```sql
CREATE TABLE fetch_virtual_table (
    row TEXT NOT NULL
);
```
Where column "row" holds the JSON serialized string of the [FHIR resource](https://build.fhir.org/resourcelist.html).

Basic fetch usage:

```sql
-- args are
-- arg0 (required, text): the id of the fhir row whose base_url you are fetching from
-- arg1 (required, text): the resource type to fetch 
-- arg2 (optional, integer): the total number of resources to fetch.
--                           Defaults to -1, which is the value 
--                           to denote all resources available.
CREATE VIRTUAL TABLE Patient USING FETCH('server_id', 'Patient', n);
```

### Running sqlite-on-fhir
There are multiple ways to run our implementation of sqlite-on-fhir:

#### cli
Just load the binary like any other runtime loadable extension in sqlite3:

```bash
sqlite3
# inside sqlite3
>sqlite: .load ./fetch # assuming the fetch binary is in your directory
```

#### nodejs
You have 2 ways to do this, loading it manually or calling the
convenience wrapper function this library provides.

Either way, you will need to download a nodejs sqlite3 driver,
since we don't include those in our nodejs build and include them
as peer dependencies (you have to explicitly install them yourself).
Here are the ones the wrapper functions support:

- [better-sqlite3](https://github.com/WiseLibs/better-sqlite3)
    ```bash
    pnpm add better-sqlite3
    ```

Then depending on which method you choose:

1. Manually
```ts
// Example with better-sqlite3.
// You can use any nodejs compatible sqlite3 driver as long it supports loading extensions.

import Database from "better-sqlite3";

const db = new Database();
db.loadExtension("path-to-fetch-binary");
```

**This is exactly what the wrapper call does, returning the instantiated client with the extension loaded**

2. Via wrapper calls
```ts
// Example with better-sqlite3, see the full list of supported
// nodejs drivers for the wrapper calls above.

import { medfetch } from "medfetch-sof/better-sqlite3";

// db is just a Database instance of whichever driver you chose
const db = medfetch();
```

Each wrapper arguments are slightly different, but they all follow
the same schema:

```ts
/**
 * @param {string | undefined} binaryPath the path to the binary
 * @param {...any[]} ctor the rest of the argument for the database
 * driver constructor call.
 */
export function medfetch(binaryPath?: string, ...ctor): Database;
```

For convenience, the path to the binary is optional, defaulting
to the prebuilt binary path in the package. This can be accessed
using:
```ts
import { getFetchPath } from "medfetch-sof/sqlite";

// this is what arg0 defaults to!
export function medfetch(binaryPath = getFetchPath(), ...): Database;
```