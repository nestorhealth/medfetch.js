# What is Medfetch.js

"Make Everything (a) Database Fetch".js (med) fetch, or Medfetch.js for short, is an 
*opinionated* REST API HTTP client for Javascript. It allows you to
query JSON-based REST APIs just like a database:

```ts
import { Kysely } from "kysely";
import medfetch from "medfetch/sqlite-wasm";

const apiConnection = medfetch("https://r4.smarthealthit.org");
const db = new Kysely({
    dialect: apiConnection // This is just a Dialect
});
```

::: info
Only the [Kysely](https://kysely.dev/) ORM interface is supported out
the box, but perhaps more can come in the future.
:::

For most APIs, you can work with the data purely within "JS"-land and be just fine:
```tsx
export default async function TodosPage() {
    const response = await fetch("https://dummyjson.com/todos");
    if (!response.ok) {
        throw new Error("oops")
    }
    const payload = await response.json();
    
    return (
        <main>
            <TodosComponent todos={payload} />
            ...
        </main>
    );
}
```
But if you wanted to perform `JOIN`-like operations with your API data, then you'll probably end up doing
something like this:
```tsx{8-21}

const getJsonData = (resourceName: string) => fetch(`https://dummyjson.com/${resourceName}`)
    .then(response => response.json());

export default async function UsersTodosPage() {
    const todos = await getJsonData("todos");
    const users = await getJsonData("users");
    const usersWithTodos = users.map(
        (user) => {
            user.todos = [];
            return todos.reduce(
                (acc, todo) => {
                    if (user.id === todo.userId) {
                        acc.todos.push(todo);
                    }
                    return acc;
                },
                user
            )
        }
    );
    
    return (
        <main>
            <UsersTodos users={usersWithTodos} />
            ...
        </main>
    );
}
```
Things can get messy with filters...
```ts
const usersWithRecentImportantTodos = users.map(
    (user) => {
        user.todos = [];
        return todos.reduce(
            (acc, todo) => {
                // Does todo "fkey" user?
                if (user.id === todo.userId) {
                    // Conversion for filter comparison
                    const todosDate = new Date(todo.createdAt);
                    if (
                        // Is todo recent?
                        todosDate.getTime() > (Date.now() - 7 * msInDay)
                        &&
                        // Is todo important
                        todo.priorityLevel = "important"
                    ) {
                        acc.todos.push(todo);
                    }
                }
                return acc;
            },
            user
        )
    }
)
```
What about a many to many?
```ts
// .map() is a loop
const usersWithRecentSharedImportantTodos = users.map(
    (user) => {
        user.todos = [];
        // so is .reduce()
        return todos.reduce(
            (acc, todo) => {
                // so is .includes()
                if (todo.userIds.includes(user.id)) {
                    // Conversion for filter comparison
                    const todosDate = new Date(todo.createdAt);
                    if (
                        todosDate.getTime() > (Date.now() - 7 * msInDay)
                        &&
                        todos.priority === "important"
                    ) {
                        acc.todos.push(todo);
                    }
                }
                return acc;
            },
            user
        )
    }
);
```
You'd probably want to lift this logic...
```ts
export function join<Left, Right>(
    left: Left[],
    right: Right[],
    on: (left: Left, right: Right) => boolean,
    where: (left: Left, right: Right) => boolean,
    attachToKey: string
) {
    return left.map(
        (l) => {
            l[attachToKey] = [];
            return right.reduce(
                (acc, r) => {
                    if (on(l, r) && where(l, r)) {
                        l[attachToKey].push(r);
                    }
                },
                l
            )
        }
    );
}
```

What if you only cared about joining the `category` field of a Todo and nothing else?
```ts
export function join<Left, Right>(
    left: Left[],
    right: Right[],
    on: (left: Left, right: Right) => boolean,
    where: (left: Left, right: Right) => boolean,
    attachToKey: keyof Left,
    selectRightKeys?: (keyof Right)[]
) {
    return left.map(
        (l) => {
            l[attachToKey] = [];
            return right.reduce(
                (acc, r) => {
                    if (on(l, r) && where(l, r)) {
                        let rightObj = r;
                        if (selectRightKeys) {
                            rightObj = Object.fromEntries(
                                Object
                                .entries(rightObj) 
                                .filter(entry => selectRightKeys.includes(entry[0]))
                            );
                        }
                        l[attachToKey].push(rightObj);
                    }
                },
                l
            )
        }
    );
}
```

Phew, glad we got that done 😅. Sure it's a little messy but at 
least all that messiness is hidden away in our super `join` function.
Let's see it in action:
```tsx:line-numbers {4-17}
export default async function UsersTodosPage() {
    const todos = await getJsonData("todos");
    const users = await getJsonData("users");
    const usersWithTodos = join(
        users,
        todos,
        (user, todo) => user.id === todo.userId,
        (_user, todo) => {
            const todosDate = new Date(todo.createdAt);
            return (
                todosDate.getTime() > (Date.now() - 7 * msInDay)
                && todo.priorityLevel === "important"
            )
        },
        "todos",
        ["category"]
    );
    
    return (
        <main>
            <UsersTodos users={usersWithTodos} />
            ...
        </main>
    );
}
```
Uhh, is that more readable than the inlined version?
```tsx:line-numbers {4-23}
export default async function UsersTodosPage() {
    const todos = await getJsonData("todos");
    const users = await getJsonData("users");
    const usersWithTodos = users.map(
        (user) => {
            user.todos = [];
            return todos.reduce(
                (acc, todo) => {
                    if (todo.userId === user.id) {
                        const todosDate = new Date(todo.createdAt);
                        if (
                            todosDate.getTime() > (Date.now() - 7 * msInDay)
                            && todo.priorityLevel === "important"
                        ) {
                            acc.todos.push({ category: todo["category"] });
                        }
                    }
                    return acc;
                },
                user
            )
        }
    );
    
    return (
        <main>
            <UsersTodos users={usersWithTodos} />
            ...
        </main>
    );
}
```
There isn't really a right answer to that since readability is (mostly) an opinion.
But that's far from the only baggage that (may) come with staying purely in "JS"-land for data queries like this.

For one, our `join` function ended up looking a lot like a query builder function. Sure it works, but
do you *really* want to be continuously extending that `join` function as your query-needs expand? Are you
ready to inevitably add more query builder functions? And what about query performance? 
Are you willing to put in the time to optimize your query builders if they're too slow for your app?

I answered **no** to all of those questions, so I decided to build Medfetch.js, a thin database extension
that maps JSON data to real* SQL tables with the [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) API:

```tsx:line-numbers {9-14}
import medfetch from "medfetch/sqlite-wasm";

export default async function UsersTodosPage() {
    const dialect = medfetch("https://dummyjson.com", {
        schema: "https://dummyjson.com/openapi"
    });
    const db = new Kysely({ dialect });

    const usersWithTodos = await db
        .selectFrom("users")
        .selectAll("users")
        .innerJoin("todos", "todos.userId", "users.id")
        .select(["todos.category"])
        .execute();
    
    return (
        <main>
            <UsersTodos users={usersWithTodos} />
            ...
        </main>
    );
}
```

So thank you to the maintainers over at [Kysely](https://kysely.dev/) and [Sqlite](https://sqlite.org/) for answering **yes**
instead for us, allowing us (and hopefully others!) to build our FHIR data queries with more confidence!

## SQL on FHIR
Medfetch was specifically built for pulling [FHIR JSON](https://www.hl7.org/fhir/json.html), but it can* work
with any JSON schema. You just need to provide it:

```ts
import type { JSONSchema7 } from "json-schema";

const jsonSchema: JSONSchema7 = {...}
const dialect = medfetch("https://my.fhir.api.com", {
    schema: jsonSchema
});
```

If you want to provide it dynamically, wrap it in a function:

```ts
const getJSONSchema = () => fetch("...").then(response => response.json());
const dialect = medfetch("https://my.fhir.api.com", {
    schema: getJSONSchema
});

```
This function will execute when the database opens and can `await` it.

Medfetch accepts any valid JSON schema, with the addition of a
custom `discriminator` field (based on the FHIR master schema):
```ts
const dialect = medfetch("...", {
    schema: {
        discriminator: {
            propertyName: "resourceType",
            mapping: {
                Patient: "#definitions/Patient",
                Condition: "#definitions/Condition"
            },
        },
        definitions: {
            Patient: {...},
            Condition: {...}
        }
    }
});
```

Without it, Medfetch has no way of knowing which keys inside the `definitions` object correspond
to a Resource (SQL Table) and which ones map to child Elements (SQL columns):

```ts
const dialect = medfetch("...", {
    schema: {
        definitions: {
            // 😀 "Patient" is a resource
            Patient: {...},
            // 😀 "Condition" is a resource
            Condition: {...},
            // 🙁 That's not a resource...
            id: {},
            // 🙁 Neither is that
            Address: {}
        }
    }
});
```

::: warning
*As mentioned above, Medfetch still needs to choose JSON Schema properties specific to the FHIR master JSON schema, since that is the fallback:

::: code-group
<<< ../src/json/sql.ts#snippet
We're looking into how to generalize this better in the future for
other non-FHIR APIs.
:::

## Comparison
> ["Comparison is the thief of joy."](https://www.better-auth.com/docs/comparison)


### vs View Definitions
::: code-group
```tsx [/fhirpath/page.tsx]
import { evaluate } from "fhirpath";
import runView from "some-view-runner";

export default async function PatientsPage() {
    const patients = await fetch("https://someapi.com/Patient")
        .then(res => res.json())
        .then(bundle => evaluate(bundle, "Bundle.entry.resource"));
    const resultRows = runView(patients, viewDefinition);
    
    return (
        <main>
            <PatientsAddresses patients={resultRows} />
            ...
        </main>
    );
}

const viewDefinition = {
  "resourceType": "http://hl7.org/fhir/uv/sql-on-fhir/StructureDefinition/ViewDefinition",
  "select": [
    {
      "column": [
        {
          "path": "getResourceKey()",
          "name": "patient_id"
        }
      ]
    },
    {
      "column": [
        {
          "path": "line.join('\n')",
          "name": "street",
          "description": "The full street address, including newlines if present."
        },
        {
          "path": "use",
          "name": "use"
        },
        {
          "path": "city",
          "name": "city"
        },
        {
          "path": "postalCode",
          "name": "zip"
        }
      ],
      "forEach": "address"
    }
  ],
  "name": "patient_addresses",
  "status": "draft",
  "resource": "Patient"
};
```

```tsx [/medfetch/page.tsx]
import { sql } from "Kysely";
import medfetch from "medfetch/sqlite-wasm";

const dialect = medfetch("https://someapi.com");
const db = new Kysely<any>({ dialect });

export default async function PatientsPage() {
  const resultRows = await db
    .selectFrom("Patient")
    .innerJoin(sql`json_each("Patient"."address")`.as("json_each"), (join) =>
      join.onTrue(),
    )
    .innerJoin(
      sql`json_each(json_each.value -> 'line')`.as("line_item"),
      (join) => join.onTrue(),
    )
    .select([
      sql`Patient.id`.as("patient_id"),
      sql`json_each.value ->> 'use'`.as("use"),
      sql`json_each.value ->> 'city'`.as("city"),
      sql`json_each.value ->> 'postalCode'`.as("zip"),
      sql`group_concat(line_item.value, '\n')`.as("street"),
    ])
    .groupBy([
      sql`Patient.id`,
      sql`json_each.value ->> 'use'`,
      sql`json_each.value ->> 'city'`,
      sql`json_each.value ->> 'postalCode'`,
    ])
    .execute();

    
    return (
        <main>
            <PatientsAddresses patients={resultRows} />
            ...
        </main>
    );
}
```
:::