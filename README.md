# medfetch.js monorepo
This is the monorepo for NestorHealth's core SQL-on-FHIR library, Medfetch.js.

## Building
Build the sql-on-fhir library:

```bash
pnpm run build:sof
```

Then build the docs:
```bash
pnpm run build:docs
```

## Organization
There are two "subrepos", `docs` and `medfetch`. `medfetch` is the main sql-on-fhir library while `docs` is the documentation
site. This may expand depending on the complexity of implementing this on PostgreSQL.

## Roadmap
Currently, the only database extension that is implemented is the SQLite Virtual Table module for
the Web Assembly build. Since FHIRPath isn't implemented on C as of the time of writing (I think),
the next on the TODOs is to port the extension over to a PostgreSQL and MySQL Web Assembly build,
though making SQLite stable is the priority right now.

---

## Contributing

## Credits
This library relies on the [fhirpath.js](https://www.npmjs.com/package/fhirpath/v/3.8.1) library to run its fhirpath evaluations.
All credits go to the libraries that made the adapters:

- [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) for the SQLite WASM port
