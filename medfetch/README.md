# Medfetch.js
An in-database Javascript [sql-on-fhir](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/) implementation. It connects [@sqlite.org/sqlite-wasm]() 
loaded with our custom virtual-table extension to a [kysely]() orm instance.

## Modules

All public ones are under `src/*`. Bundling is kind of fragile with browser builds that involve worker contexts so don't do barrel exports here.
If a file has a `*.node.ts `, this means this is the node export:
```json
"exports": {
    "./block.js": {
        "types": "./dist/block.d.ts",
        "import": "./dist/block.js",
        "node": "./dist/block.node.js",
        "default": "./dist/block.js"
    ...
    }
...
}
```

Otherwise, every file is exported as is, including any `module-tag.module-name`.
Module definitions and side effects are allowed
can be run on any module-tag only file. 

The only rule is that there are no barrel exports where you just export from another module
only without importing it. This messes with bundlers so
it's better to sacrifice the bundling into a single file
since the modules will be bundled into js by the consumer
bundler anyway.

Modules include
- `sqlite-wasm` - The `medfetch` default export (*main* thread)
- `sqlite-wasm.worker` - Functions for invoking the extension directly on the worker thread.
- `block` - A default export function for main thread blocking
- `dialects` - Kysely related functions, mainly internal
- `sql` - Helpers for deriving runtime SQL on FHIR data
