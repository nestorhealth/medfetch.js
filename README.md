# medfetch.js monorepo
This is the monorepo for NestorHealth's core SQL-on-FHIR library, Medfetch.js!

## Organization
Currently, there exist only two "subrepos", `docs` and `medfetch`. For the time being,
the `medfetch` library is the main sql-on-fhir library while `docs` is the documentation
site. I plan on turning `medfetch` -> `medfetch-sqlite` once PostgreSQL is added so that each "subrepo" can focus and test against its database
specific logic!

## Roadmap

This roadmap outlines the planned development milestones for Medfetch.js as we expand support across different SQL backends. Each step aims to stabilize and productionize support for a given engine or deployment mode.

### 0. Stabilize in-memory sql-on-fhir API
- We want to make the in-memory sql-on-fhir runner act as the "template"
for the sql-on-fhir APIs, so ideally this is solidified first.
- Decide upon a Schema API for the FHIR JSONs, if any at all... (this is really difficult, so maybe we forgo this and just assume everything
evaluated by fhirpath is an array!)

### 1. Stabilize SQLite (WASM)
- Finalize API design and error handling
- Remove blocking on parsing entire fetch payload of FHIR Bundle and implement streaming of resources to the SQLite core engine.
- Ensure compatibility with other SQLite virtual table extensions besides medfetch
- Add tests for multi-tab shared access

### 2. Port Unstable SQLite (WASM) to Native
- Extract shared core logic from WASM-specific hooks for native node.js drivers
- Test against system-installed SQLite

### 3. Add pglite (PostgreSQL WASM) Support
- Implement FHIR resource projection on pglite
- Add SQL function fallbacks where needed
- Publish `medfetch/pglite` alpha

### 4. Add WASM-MySQL Support (Driver TBD)

### 5. Stabilize SQLite Native

### 6. Stabilize PostgreSQL Native

### 7. Stabilize MySQL Native

---

We got a long ways ahead, but hopefully we can get there faster with
your help!

## Contributing
TODO

## Credits
This library relies on the [fhirpath.js](https://www.npmjs.com/package/fhirpath/v/3.8.1) library to run its fhirpath evaluations, so big
thank you to the guys working on that for doing the hard part for me!!

Also, the Web Assembly adapters are NOT made by this library, and
all credits go to the libraries that made the adapters:

- [`@sqlite.org/sqlite-wasm`](https://www.npmjs.com/package/@sqlite.org/sqlite-wasm) for the SQLite WASM port
