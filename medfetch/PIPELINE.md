## What is it?

Medfetch sql-on-fhir, or just `medfetch` for short, is an
_opinionated_ implementation of the [sql-on-fhir](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/index.html) specification.
At its core, it acts as a readonly pipe from a FHIR server
to itself plus a read and write pipe between itself and an SQL
database of your choice.

More precisely, it handles read operations from your FHIR server over
native `fetch()` calls, and then allows you to make read/write calls
to your database using a mix of native SQL queries and FHIRPath
to abstract away some of the operations you can perform with
FHIR resources and View Definitions.

In terms of the pipeline architecture from the specs:

**Spec pipeline:** `Data ---> View ---> Analytics`

Medfetch encompasses these parts:

**Medfetch:** `Data (---> View --->) Analytics`

If you need to pipe data from a FHIR server to a tabular database,
then Medfetch could help with that!

## Usage

_TODO_

## Deeper look into the pipeline

### Setup and Motivation

To understand the Medfetch data pipeline better, let's go through a specific
example. Suppose we wanted to persist all [Patient](https://build.fhir.org/patient.html)
files who have at least one [Condition](https://build.fhir.org/condition.html)
file of a certain code 'foo' that references the Patient, but have exactly 0 [Procedure](https://build.fhir.org/procedure.html) files of
a certain code 'bar', in an [SQLite](https://www.sqlite.org/) database on disk.

From these patients, suppose we want to get record the most recent
[Observation](https://www.hl7.org/fhir/observation.html) value
for Observations related to the 'foo' Condition.

Now imagine we've created a dedicated SQL table for each FHIR resource in our database,
with our own FHIR-Type -> SQL column mappings to simplify their representation in
the database. Further suppose we stored [CodeableConcept](https://build.fhir.org/datatypes.html#CodeableConcept) values
as simple TEXT values that encode a JSON array directly in the text column, where each `(system, code)` assocation
is encoded as simple `(system_alias)#(code_value)` strings. So for example, a `code` column that maps to a CodeableConcept
might look like this in memory:

```C
char *code_column[] = { "SYS_A#123", "SYS_B#123", "SYS_C#WOOF" };
```

And then look like this in the SQL column:

```SQL
'[SYS_A#123, SYS_B#123, SYS_C#WOOF]'
```

Then our SQL query might look something like this:

```sql
SELECT
    Patient.identifier AS mrn, -- Stores identifier.value scalar only
    Patient.name AS patient_name,
    (SELECT o.value
     FROM Observation AS o
     INNER JOIN Condition AS c ON Condition.encounter = Observation.encounter
     WHERE o.subject = Patient.id AND c.code LIKE '%SCT#foo$' -- Assuming 'SCT#x' maps to a SNOMED code of value 'x'.
     ORDER BY o.createdAt DESC
     LIMIT 1) AS last_checkup_value -- Get me the most recent Observation value related to the 'foo' Condition for this Patient
FROM Patient
INNER JOIN Condition ON Condition.subject = Patient.id
WHERE
    Condition.code LIKE '%SCT#foo%'
    AND NOT EXISTS (
        SELECT 1
        FROM Procedure p
        WHERE p.subject = Patient.id
        AND p.code LIKE '%SCT#bar%'
    ) -- We want to check for NON existence of Procedures
```

Then from a high level, we can come up with the following pipeline design:

1. Prepare data dependencies:
    - `GET /Patient, /Observation, /Condition, /Procedure` from the FHIR server.
    - Create corresponding SQL tables and migrate them to db
    - Keep track of mappings FROM FHIR resource paths TO SQL columns
2. Apply said mappings to the fetched resources.
3. Insert rows into database:

    ```sql
    BEGIN TRANSACTION;

    INSERT INTO Patient VALUES (?, ?, ?, ...);
    INSERT INTO Observation VALUES (?, ?, ?, ...);
    INSERT INTO Condition VALUES (?, ?, ?, ...);
    INSERT INTO Procedure VALUES (?, ?, ?, ...);

    COMMIT;
    ```

4. Run your query:
    ```sql
    SELECT
        Patient.identifier AS mrn, -- Stores identifier.value scalar only
        Patient.name AS patient_name,
        ... -- Rest of query from above
    ```

Let's run through potential implementations for each step
in our hypothetical pipeline, and then seeing which medfetch
approach medfetch uses.

### Step 1. Preparing Data Dependencies

Although this step is long in its explanation, this
is the only part in the pipeline that requires making significant
design decisions, with the rest of the steps being much simpler
compared to this one, so just going through this part
will give you a good idea of how Medfetch facilitates
the sql-on-fhir pipeline.

Step 1 can be split up into sub-steps that don't have
any dependencies between each other. We've listed the main ones
in the bullets in step 1 above. At a high level, we need:

1. A connection to a FHIR server
2. An HTTP Client
3. An SQL database
4. Migration scripts
5. JSON property -> SQL Column maps

Implementing parts `1` and `2` is relatively simple since
there are only so many ways you could carry out the network
request. The main differences would lie in the search parameters
applied to minimize the size intermediate data-set. To be sure,
applying the correct search parameters is a **nontrivial**
optimization, especially as the FHIR server grows in size. But for our
hypothetical implementation, let's just go with a simple JavaScript
`fetch()` wrapper to act as the fetcher, that just gets all
the resources in the array. Ignoring bundle link paging, it might look
something like:

```ts
import { Array, pipe } from "effect";
import { Resource } from "medfetch-sof/json";

export async function getResources(
    baseUrl: string,
    resources: Resource.ResourceType[],
): Resource.Resource[] {
    return pipe(
        resources,
        Array.flatMap(
            async (resource) =>
                await fetch(`${baseUrl}/${resource}`, {
                    headers: {
                        Accept: "application/json+fhir",
                    },
                }).then((response) => response.json()),
        ).then((bundle) => bundle.entry.map((entry) => entry.resource)),
        Promise.all,
    ); // Async mapping of resource -> fetch() payload
}
```

And just like that, we now have a way to get our FHIR data! So
let's look into implementing the SQL part of the dependencies,
parts `3` through `5` inclusive. For part `3`, we just
need to establish a connection with an SQL database of our choice.
For this example, we chose SQLite, so if we used the better-sqlite3
driver for nodejs, we might do something like:

```ts
// db.ts
import Database from "better-sqlite3";
export const db = new Database(`${process.env.DB_URL!}`);
```

Now onto parts `4` and `5`, where we need to migrate our
desired tables to the database. One way we could go about this
is to handwrite the migrations ourselves:

```ts
const migration = `BEGIN TRANSACTION;

CREATE TABLE Patient (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    name TEXT NOT NULL,
    ...
);
...
CREATE TABLE Procedure (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL REFERENCES Patient (id)
);

COMMIT;`;
```

And then apply them like so:

```ts
import { db } from "./db";

db.exec(migration);
```

Finally, we would need to set up a mapping function
that transforms each FHIR resource from our `getResources()`
implementation into their row objects, let's call it
`project()`, and it would do something like this:

```ts
import { db } from "./db";

const resources = await getResources(process.env.BASE_URL!, [
    "Patient",
    "Observation",
    "Condition",
    "Procedure",
]);
for (const resource of resources) {
    const row = project(resource); // <-- project usage
    db.prepare(`INSERT INTO ${resource.resourceType} VALUES (${row})`).run();
}
```

A very simple implementation we *could* use is a check over each
underlying javascript `(key, value)` pair in the JSON object,
and then determine the corresponding column type:

```ts
function projectRow(resource: Resource.Resource) {
    let accumulator = {};
    for (const [key, value] of Object.entries(resource)) {
        if (typeof value === "string") {
            accumulator = { ...accumulator, [key]: value };
        } else if (typeof value === "number") {
            ...
        }
        ...
    }
    return accumulator;
}
```

Very simple to implement with no need for extra dependencies, as
all the data you need to perform your maps are available at runtime.
And if you didn't care about transforming the underlying values from
the FHIR JSON at all, this would work! But typically, we'll want
to perform some transformations. While there are a variety of
possible transformations you could apply to any given `(key, value)`
pair in the JSON object, let's consider three general maps
we could perform:

1. `key` drops
2. `key` mappings
3. `value` mappings

### Transformation #1: `key` drops

By key drops, I'm simply referring to the ability to filter
`(key, value)` pairs from the projection based on the `key` value.
For instance, suppose you didn't care about saving the
`Patient.gender` field from the JSONs for your analytics. Then
our `projectRow()` function would need some kind of way to know
which keys to include. So it would have to look something like this:

```ts
const checkType = (value: any) => {
    switch (typeof value) {
        case "string": {
            return value;
        }
        case "object": {
            return JSON.stringify(value);
        }
        ...
    }
}

function projectRow(
    resource: Resource.Resource,
    keys: Set<string> // <-- would need something like this
) {
    let accumulator = {};
    for (const [key, value] of Object.entries(resource)) {
        if (!keys.has(key)) continue; // <-- include a check for the key inclusion
        accumulator = { ...accumulator, [key]: checkType(value) }
    }
    return accumulator;
}
```

As you can see, `key` drops are relatively simple to implement, so let's move on.

### Transformation #2: `key` mappings

Now suppose you wanted to have different column names. Let's say
you wanted to change the `id` column name to
`patient_id` for your `Patient` table. Then you would need a map
between JSON key names -> SQL column names:

```ts
function projectRow(
    resource: Resource.Resource, 
    keys: Map<string, string> // <-- Now a Map from JSON key name to SQL column name
) {
    let accumulator = {};
    for (const [key, value] of Object.entries(resource)) {
        if (!keys.has(key)) continue; // <-- include a check for the key inclusion
        const columnName = keys.get(key)!; // ts assert get(key) exists
        accumulator = { ...accumulator, [columnName]: checkType(value) };
    }
    return accumulator;
}
```

Not difficult to implement, but we can start to see how
maintaining the `keys` map can start getting cumbersome and
error-prone. We now need to specify which JSON `key`s from
each Resource we want to include AND their corresponding
column names in a `Map` or map-like object.

Still, since we are dilligent developers that properly test our
`keys` Maps, we choose to stick with this implementation. Now onto
the final transformation.

### Transformation #3. `value` mappings

Suppose we wanted to change the data-representation of
some `value`s from a Resource's `(key, value)` set. This
is probably the broadest category of transformations
since there are practically an infinite amount of ways to transform
such values. Common mappings we may want to perform include:

| FHIR Type       | SQLite Column Type          | FHIRPath projection pseudocode                                                       |
| --------------- | --------------------------- | ------------------------------------------------------------------------------------ |
| Reference       | `TEXT REFERENCES Table(id)` | Reference -> Reference.reference                                                     |
| CodeableConcept | `TEXT`                      | CodeableConcept -> CodeableConcept.coding.system + '#' + CodeableConcept.coding.code |
| Identifier      | `TEXT`                      | Identifier -> Identifier.value                                                       |

In our case, we want to just save the Patient's MRN's value, so from this Identifier JSON:

```json
"identifier": [
    {
        "system": "https://github.com/synthetichealth/synthea",
        "value": "839737a4-5804-4adb-b645-740275239062"
    },
    {
        "type": {
            "coding": [
                {
                    "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
                    "code": "MR",
                    "display": "Medical Record Number"
                }
            ],
        "text": "Medical Record Number"
        },
        "system": "http://hospital.smarthealthit.org",
        "value": "839737a4-5804-4adb-b645-740275239062"
    },
    ...
];
```

We want our projector to map this to:

```json
"identifier": "839737a4-5804-4adb-b645-740275239062"
```

This presents an immediate challenge with our current algorithm, namely that
all the projector knows about a given `identifier` field is that:

```ts
typeof identifier === "object"
```

So we could do something like this:
```ts
function projectRow(
    resource: Resource.Resource, 
    keys: Map<string, { columnName: string, f: (value: any) => any }> // have the corresponding value hold both the column name and the map function
) {
    let accumulator = {};
    for (const [key, value] of Object.entries(resource)) {
        if (!keys.has(key)) continue; // <-- include a check for the key inclusion
        const { columnName, f } = keys.get(key)!; // ts assert get(key) exists
        accumulator = { ...accumulator, [columnName]: f(value) };
    }
    return accumulator;
}
```

Again, simple to implement! But now we can see the cost of
dependency management start to rise significantly. For any given
JSON key `json_key` inside a FHIR resource that we want to map to
a `(sql_column, sql_value)` (column name, column value) tuple, we need to:

1. Write the `json_key` key correctly into the Map.
2. Ensure column `sql_column` is actually included in the migration script.
3. Ensure the mapping function `f` from `resource[json_key]` to `sql_value` is correct.

I know we said we were dilligent developers, but ensuring
`n` resource tables, each with `column_size(table)` columns,
so `n * column_size(tables[0 through n exclusive])` mappings 
is a LOT to handle! 

The crux of the mapping problem boils down to this then:

*How can I ensure my JSON -> SQL mappings align with both the FHIR and SQL schemas?*

If only there existed some kind of way to encode our desired
`json_key -> (sql_column, sql_value)` for each Resource, in 
one data structure, so as to minimize errors in the maps...

### Wrapping up Step 1.
This section has only really scratched the surface of the many 
challenges of transforming JSONs into tabular projection. For
the sake of brevity (lol), let's wrap this discussion up by 
going over the sql-on-fhir [ViewDefinition](https://build.fhir.org/ig/FHIR/sql-on-fhir-v2/StructureDefinition-ViewDefinition.html) resource, and how it helps solve the crux of our problem.

There a lot of fields in the resource, but the main ones that apply
to the projection algorithm are `select, resource, constant, where`, where:

- `resource` specifies which FHIR Resource you are projecting.
- `constant` specifies any constant [primitive](https://build.fhir.org/datatypes.html#primitive) values you want to alias within the FHIRPath evaluator.
- `where` is a list of FHIRPath conditional expressions that
filter the initial input set.
- `select` is a list of FHIRPath expressions that can be *arbitrarily nested*. All leaves of each Select tree item in the array resolve to a `(pathexpr, column_name)` pair encoded as a simple struct:

    ```ts
    { path: string; name: string; };
    ```

From this invariant that Select's always resolve to this
`(pathexpr, column_name)` assocation, we are able to turn
a JSON tree with max depth `n` into an object with a depth of
example `1`<sup>*</sup> using the [Process](https://build.fhir.org/datatypes.html#primitive)
row projection algorithm defined in the spec.

So let's consider what the `Select` field of the Patient MRN
projection could look like:

```json
{
    ...
    "select": [
        {
            "path": "identifier.where(type.coding.where(code = 'MR' and system = 'http://hl7.org/fhir/v2/0203')).value",
            "name": "patient_mrn"
        }
    ],
    ...
}
```

You'll see that we have our desired `json_key -> (sql_column, sql_value)` mapping in one place here:
- `json_key`: the 'identifier' in the "path"
- `sql_column`: the "name" value
- `sql_value`: the function and path invocations after the 'identifier' in the "path", i.e. the `.where().value invocation`

Then our project function could look something like this:

```ts
// sof.ts
import { pipe, Array } from "effect";
import { evaluate } from "fhirpath";

// Doesn't handle `forEach, forEachOrNull, or unionAll` fields,
// but this is the logic that would apply to their eventual column leaf items. 
// The reference implementation and documentation
// expand on this more than I could do it justice here.
export function project(
    viewDefinition: ViewDefinition,
    resources: Resource.Resource[]
) {

    return pipe(
        resources,
        makeFilterFn(viewDefinition.where), // some filter function factory,
        Array.map(
            (resource) => {
                let row = {};
                for (const select of viewDefinition.select) {
                    // some tree traverser function that gets the column-paths for this select item
                    const columns = getColumns(select); 

                    for (const column of columns) {
                        row = { 
                            ...row, 
                            [column.name]: evaluate(resource, column.path)
                        };
                    }
                }
                return row;
            }
        )
    );
}
```


To conclude, let's assume we also have a function, 
call it `tableMigration()`, that simply takes in a ViewDefinition 
and creates the corresponding migration script for that ViewDefinition's SQLite Table representation.

Then preparing our dependencies would look something like this:

```ts
import { getResources } from "./fetcher"; // your JSON data fetcher
import { db } from "./db"; // your database client
import { project } from "./sof"; // the row projection function
import { tableMigration } from "./sqlite"; // the view definition to sqlite table transformer
import { Patient, Procedure, Condition, Observation } from "./view-definitions"; // your defined view definitions for each table

// Prepare SQL database
const migration = [Patient, Procedure, Condition, Observation]
    .map((viewDefinition) => tableMigration(viewDefinition)) // get the table migration SQL script for each view definition...
    .reduce((acc, migrationText) => acc += migrationText + ";" + "\n", "BEGIN TRANSACTION;\n")
    + "COMMIT;" // Finalize transaction
db.exec(migration); // Apply migration

// Get the FHIR data
const data = await getResources(process.env.BASE_URL, [
    "Patient",
    "Procedure",
    "Condition",
    "Observation"
]);
```

And now we **finally** have the FHIR data, the SQL database
setup, AND the JSON -> SQL mappings. So just as a summary on
the dependencies we needed to prepare:

1. A connection to a FHIR server : `getResources()`
2. An HTTP Client : `getResources()`
3. An SQL database : `db`
4. Migration scripts : migration text generated from `tableMigration()`
5. JSON property -> SQL Column maps : `Select` inside the ViewDefinitions

Much like how getResources was able to handle dependencies `1`
and `2`, we see that using `ViewDefinition`s gives us a single
interface for managing dependencies `4` and `5`!

Ok I talked too much here! Let's quickly go through the rest of the pipeline from here.

> \* ok this technically isn't true because you theoretically could 
just run the identity function for each path expr even for array
and or object fields, meaning as a JSON, nothing has changed, including the depth. But even then, assuming you properly serialize the extracted value for your SQL database (either downstream between `Process` and the step that INSERTs the projected resources into the tables, or in the ViewDefinition itself), then as far as your database is concerned,
each resulting tree-like object from the projection has a max depth of 1 for any given field, aka, a `ROW`.

### Step 2. Applying JSON -> SQL mappings
As we'll see here, the more robust Step `1` is, the simpler
everything down the pipeline is! Through our
ViewDefinitions + our `project()` implementation, we see
that this step just amounts to calling the
`project()` function on each resource with their corresponding
ViewDefinition:

```ts
import { getResources } from "./fetcher"; // your JSON data fetcher
import { db } from "./db"; // your database client
import { project } from "./sof"; // the row projection function
import { tableMigration } from "./sqlite"; // the view definition to sqlite table transformer
import { Patient, Procedure, Condition, Observation } from "./view-definitions"; // your defined view definitions for each table

// Set up resource type to ViewDefinition map
const viewDefinitionFromResource = {
    Patient,
    Procedure,
    Condition,
    Observation
};

const resources = await getResources(process.env.BASE_URL!);
const resourceRows = resources.reduce(
    (acc, resource) => {
        const viewDefinition = viewDefinitionFromResource[resource.resourceType];
        // Handle first insertion case
        if (!acc[viewDefinition.name]) {
            acc[resource.resourceType] = [];
        }
        acc[viewDefinition.name]!.push(
            project(viewDefinition, resource)
        );
        return acc;
    },
    {}
);
```

Assuming we use the `name` property of the ViewDefinition to
as the name of the corresponding SQL table, then what we have now
is a map from `table_name -> rows`.

### Step 3. Row Insertions
So with our resourceRows record/map (whatever you want to call it),
we can run insertions rather easily, since [key, value] pairs
of `resourceRows` specifies the tableName and the rows to insert!
Since we're using SQLite here, our implementation would look something
like this:

```ts
// some function that formats the row projection array into a text string for the VALUES parameter in our INSERT clause
import { sqlizeRows } from "./sqlite"; 

// Could also wrap this in a transaction, but chose
// not to here for the sake of brevity
for (const [tableName, rows] of resourceRows) {
    const insertStatement = db.prepare(
        `INSERT INTO ${tableName} VALUES (${sqlizeRows(rows)})`
    );
    insertStatement.run(); // Now run the insert
}
```

Just like that, we now have native SQLite row representations
of our FHIR resources! Not too difficult right? One last step to go!


### Step 4. Run your query!
From here, you would just need to send over your desired query
to your database:

```ts
const myQuery = 
`SELECT
    Patient.identifier AS mrn, -- Stores identifier.value scalar only
    Patient.name AS patient_name,
    ...`
const result = db.prepare(myQuery).all();
```

And that's it! From the `result` variable, you can easily
transform it into something like a `csv` or even just insert
that back into your database under an SQL view, which then
your `Analytics layer` could process.

### Final words on the pipeline
As you can see, this FHIR JSON to SQL transformation
involves a LOT of mappings, but if you were to boil down what
this pipeline is doing, it's essentially just chaining
data transformation function calls from the original FHIR JSON
so they can be inserted into an SQL database. Revisiting the
SQL-on-FHIR layers pipeline:

Data ---> View --> Analytics

Medfetch provides helpers to turn this pipeline into:

Data --`getResources()`-> [ (`project + ViewDefinition + resources`) |> `insertRowsToDatabase` ] --`SQL-query to output desired result-set`-> Analytics

Where the handling of row projections and inserting the resources into the database are handled at and around the `View` layer component of
the architecture. The boundaries for these layers is not as clear-cut as the above diagram may have you believe, but for a high level
overview, it suffices.

If I had to provide just 1 word to explain as to why why you would 
even want to 'sqlize' FHIR jsons for data querying, it would be
because of `JOINs`.

If your sole goal was to implement the fastest relational
data-querier over a FHIR server, then you would probably
look to get as much of your result set from the payload
of the `Response` from the `fetch()` call.

Of course, over HTTP REST, you don't really have a way to
do JOINs. You could chain `_include` and `_revinclude` with
search parameters in your [FHIR search query](https://www.hl7.org/fhir/search.html), but in my experience, I've found using
search parameters to result in incredibly complex and
unreadable URL strings due to the amount of `:iterate` modifiers
you would have to add to facilitate JOINs from any given 'right' tables you brought into the result-set. Add in the fact that FHIR 
servers don't necessarily support the `:iterate` protocol and you'll quickly find that your data-querier is at the mercy of the
capabilities of whatever FHIR server you're querying.

And even in the best case, where you're working with the fastest and most specd-out FHIR servers, you'll *still* find that
you'll need to implement JOIN-like operations after the `fetch()` call, since these parameters resolve referenced resources
in a *flat array* inside the `Bundle.entry` array, so you have no way of knowing which resources are related via their
`Reference` fields that you specified in your search params. And it was at this point where I just decided that
I'll trust the JOIN implementations of battle-tested SQL databases over my own hacky JavaScript implementation.

So if you have the memory and time to wait out the data
maps in your sql-on-fhir runtime, then you can make relational
queries with the power of a native SQL database, using the
simplest HTTP REST Requests that FHIR defines for reading
resources.

Since `medfetch` doesn't enforce any particular database schema downstream at the `Analytics` layer, you're left with a decision to make 
regarding handling your tabular projections in terms of analysis. In particular, notice that the projection you get from `project()` is already
in a flattened row-like format, so in theory, you *could* just use this output to send over to your Analytics tool. And for isolated
resource fetches, this indeed would be the fastest way! But it's when you enter the `JOIN` cases where you would need to make that
extra step of querying your `SQL` data AFTER you've established your tables. So essentially, you're left with deciding between:

1. Pipe `project()` outputs into SQL tables and call it a day
2. Pipe `project()` outputs into SQL tables, **run a native SQL query that can contain JOIN clauses**, and then call it a day

There's no easy answer to this, but I concluded tackling this architectural decision comes down to the particular use case,
so I wanted to leave this SQL-on-FHIR implementation open to be able to do both.

*Note on JOINs and their place in clinical data*
> SQL `JOINs` makes querying relational data incredibly simple,
and considering that healthcare data is inherently relational
(e.g. a "Condition" file never exists in isolation
since a "Condition" refers to some problem regarding a Patient),
you'll probably find yourself wanting to query files from
multiple different Resources so you can do some cool stuff.
Useful functions that JOINs provide include combining columns from 
different Resources into a singular result set, creating WHERE
clauses based on related Tables, and much more.

While this section described a hypothetical (and not very robust)
implementation of SQL-On-FHIR, the main idea of using ViewDefinition
operations to abstract away parts of the JSON to SQL mapping process
is **exactly** how `medfetch-sof` is designed. Feel free to
look at the source code to see the actual implementation and
leave any feedback!
