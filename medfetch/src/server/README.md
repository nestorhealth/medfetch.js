# SQLite-On-FHIR C extension!
A virtual table implementation in C that uses FHIR APIs
as the data source for the virtual table. Built for running
sqlite3 on the server.

## Usage
The `fetch` function has a signature that looks something like this:

```c
struct VirtualTable *fetch(const char *base_url, const char *resource_type, int n);
```

Except that you invoke it directly in SQLite exactly at the `CREATE VIRTUAL TABLE` statement.

- `base_url` is the address of the server
(need trailing slash since the string concat for the final url just uses the `%s%s` flag without any slashes)
- `resource_type` is the name of the resource you want to fetch
- `n` is the total number of resources you want, so the fetcher
will traverse the bundle links until it hits n or it reaches the
end of the bundle, whichever comes first. Pass in -1 to traverse
to the end.

```sql
.load ./path-to-fetch.so;

-- The extension creates a "fhir" table whose rows the upcoming fetch call queries to find the url of the server
INSERT INTO fhir ("id", "base_url") VALUES ('myserver', 'https://some-fhir-server.com/'); -- trailing slash is required

-- Then create a virtual table using the custom `fetch` module function
CREATE VIRTUAL TABLE Patient USING FETCH('myserver', 'Patient');

/* 
 * Each virtual table has 1 column name "row", 
 * as if it were created using:
 *
 * CREATE TABLE Patient (row TEXT NOT NULL);
 *
 */

-- select query:
SELECT
    row ->> 'id' AS id,
    row ->> 'name' AS name,
    row ->> 'birthDate' AS birth_date
FROM Patient;
    
-- create table as query:
CREATE TABLE myserver_patients AS
SELECT
    row ->> 'id' AS id,
    row ->> 'name' AS name,
    row ->> 'birthDate' AS birth_date
FROM Patient;
```

## Building
First you need to build + install the `cfhir` library at `../cfhir`:
```bash
make install
```

Then for the third party deps:

- [libsqlite3](https://www.sqlite.org/howtocompile.html) -- the C/C++ API for sqlite3
- [libcurl](https://curl.se/libcurl/) -- for http request handling
- [jansson](https://jansson.readthedocs.io/en/latest/) -- for JSON data handling

Refer to their docs on how to install for your system, but for linux ubuntu,
installation looks something like:

```bash
apt install libcurl4-openssl-dev libjansson-dev libsqlite3-dev
```

And on mac homebrew:
```bash
brew install curl jansson sqlite3
```

You will also need sqlite3 on your computer (duh)

## Scripts:
1. Building:
`make`

2. Clean:
`make clean`

3. Initialize test sqlite connection:
`sqlite3 -init bootup.sql`

