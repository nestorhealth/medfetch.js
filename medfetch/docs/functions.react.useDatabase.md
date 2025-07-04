# `useDatabase`
The `useDatabase` function allows you to define arbitrary React state derived
from a [Dialect](https://kysely.dev/docs/dialects) and a provided
`read` callback function.

<<< ../../website/app/sanity-checks/useDatabase1/page.tsx

## Parameters
```ts
const databaseQuery = useDatabase(dialect, read, writeBack);
```

| Parameter   | Type                                          | Description                                        |
|-------------|-----------------------------------------------|----------------------------------------------------|
| `dialect`   | [`Dialect`](https://kysely.dev/docs/dialects) | Any browser-compatible Kysely dialect              |
| `read`      | `(db: Kysely<any>) => Promise<any>`           | Function that returns the "view" state.            |
| `writeBack` | [`WriteBack`](#writeback)                     | Optional callback for defining a mutation function |

## Returns
If you don't pass in a [`writeBack`](#writeback) function, then `useDatabase`
will return a [`ReadonlyDatabaseQuery`](#readonlydatabasequery) object,
which is simply the query fields returned by the underlying call to `useQuery`.

To define the mutaton, you actually need to define **2** functions. First, write a function that takes exactly 2 parameters.

<<< ../../website/app/sanity-checks/useDatabase2/page.tsx#writeBack{1}

The first is the database made with your `dialect`. The second is a [`QueryCacheProxy`](#querycacheproxy) object, 
which we'll go over soon.

Next, define *another* function that takes in exactly 1 parameter, and return it from function 1. 
You can type the 1 parameter out any type you want, since this is the mutation function in the `useMutation()` call.

<<< ../../website/app/sanity-checks/useDatabase2/page.tsx#writeBack{2}

So even though this may seem a bit roundabout - writing a function just to return another one -
think of the first function simply as a means to provide you the `db` and `cache` variables so
you can define your mutation function with them.

It's the equivalent of writing this out:
```tsx
"use client";
import { Kysely } from "kysely";
import { useMutation } from "@tanstack/react-query";
// This is an imaginary module, we don't have a pglite port yet 😅
import medfetch from "medfetch/pglite"; 

export default function Page() {
    const dialect = medfetch(...);
    const db = new Kysely({ dialect });

    const mutation = useMutation({
        mutationFn: async (formLike: { id: string; newName: string }) => {
            await db
            .updateTable("patients")
            .set({
                full_name: formLike.newName,
            })
            .where("patients.id", "=", formLike.id)
            .execute();
            await cache.invalidate();
        },
    })
}
```

Circling back to the `cache` parameter from function 1, this is an object that holds a few functions (you think we got enough functions?) 
for interacting with the [`QueryClient`](https://tanstack.com/query/v5/docs/reference/QueryClient) responsible for your `read` function:

1. `QueryCacheProxy.invalidate()` - Purges the query cache so that your read query reruns *after* your mutation:

<<< ../../website/app/sanity-checks/useDatabase2/page.tsx#writeBack{10}

2. `QueryCacheProxy.set(nextState)` - Manually sets the read query state. For example, instead of invalidating, you *could* reselect the data
yourself and set that as the new view state:
```ts{18}
import { Kysely } from "kysely";
import { useMutation } from "@tanstack/react-query";
import { useDatabase } from "medfetch/next";
import medfetch from "medfetch/pglite"; 

export default function Page() {
    const dialect = medfetch(...);
    const view = useDatabase(
        dialect,
        db => db.selectFrom("bar").selectAll().execute(),
        (db, cache) => {
            return async (formData: FormData) => {
                await db.updateTable("bar")
                    .set({ name: formData.get("name")! })
                    .where("bar.id", "=", formData.get("barId")!)
                    .execute();
                const tableData = await db.selectFrom("bar").selectAll().execute();
                cache.set(tableData); // synchronous!
            }
        }
    );
    ...
}
```

It's usually more useful in conjunction with `invalidate()` for setting optimistic states.

```ts{19}
import { Kysely } from "kysely";
import { useMutation } from "@tanstack/react-query";
import { useDatabase } from "medfetch/next";
import medfetch from "medfetch/pglite"; 

export default function Page() {
    const dialect = medfetch(...);
    const view = useDatabase(
        dialect,
        db => db.selectFrom("bar").selectAll().execute(),
        (db, cache) => {
            return async (formData: FormData) => {
                if (view.queryData) {
                    // don't mutate the view data directly!
                    const copy = view.queryData.slice();
                    const index = copy.findIndex(
                        barItem => bar.id === formData.get("id"));
                    copy[index].name = formData.get("name")!
                    cache.set(copy); // With "updated" row entry
                }

                // Your view UI data updates before the actual query is run
                await db.updateTable("bar")
                    .set({ name: formData.get("name")! })
                    .where("bar.id", "=", formData.get("barId")!)
                    .execute();
                await cache.invalidate(); // Then revalidate 
            }
        }
    );
    ...
}
```

Typescript is able to infer the "correct" `nextState` type because `useDatabase` assumes you want to read the query data after a mutation.
This is just at the compile-level though, so you
can pass in whatever you want, though don't expect things to work if you just pass in whatever!

## Example with Mutation

::: code-group
<<< ../../website/app/sanity-checks/useDatabase2/page.tsx{44-54}
<<< ../../website/app/sanity-checks/useDatabase2/page.EditName.tsx
:::

## Typescript Reference
### `Writeback`
<<< ../src/next.ts#WriteBack

### `ReadonlyDatabaseQuery`
<<< ../src/next.ts#ReadonlyDatabaseQuery

### `WritableDatabaseQuery`
<<< ../src/next.ts#WritableDatabaseQuery

### `QueryCacheProxy`
<<< ../src/next.ts#QueryCacheProxy