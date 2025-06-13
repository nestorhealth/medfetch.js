<script setup lang="ts">
import { onMounted } from "vue";
import { sqliteOnFhir } from "~/sqlite.browser";
import { Kysely, sql } from "kysely"
import SqliteWorker from "~/sqlite-wasm.thread?worker";

onMounted(async () => {
const worker = new SqliteWorker({
  name: "sqlite-wasm.thread"
})
  const dialect = sqliteOnFhir(":memory:", "http://localhost:8787/fhir", [
    "Patient",
    "Condition"
  ], worker);

  const db = new Kysely<typeof dialect.$db>({ dialect: dialect });
  const p = await db.selectFrom("Patient").selectAll("Patient").execute();
  console.log("here", p)
  console.log("p")
  const pc = await db.selectFrom("Patient").innerJoin("Condition", "Condition.subject", "Patient.id").select(["Patient.id as pid", "Condition.subject as cid"]).execute();
  console.log("pc", pc)
});

</script>

# Filter by ICD codes

This page demonstrates how to query Resources with ICD code filters. This is
specific to ICD, but the general logic should work with any other code system.

## Within a certain Range
Let's find all Patients under 18 years old admitted after 2015 with tibial shaft fractures.
For ICD, that's any code in the `S82.20`-`S82.299` range.
- SQL:
```sql
CREATE TABLE "patients" AS
SELECT
  "Patient"."id" AS "patient_id",
  "Patient"."name" -> 0 -> 'given' ->> 0 AS "first_name",
  "Patient"."name" -> 0 ->> 'family' AS "last_name",
  "Patient"."birthDate" AS "birth_date",
  "Condition"."code" -> 'coding' -> 0 ->> 'code' AS "icd_code",
  "Condition"."onsetDateTime" AS "condition_onset"
FROM "Patient"
INNER JOIN "Condition" ON "Condition"."subject" = "Patient"."id"
WHERE
  -- Patient is under 18
  date("Patient"."birthDate") > date('now', '-18 years')
  
  -- Condition happened after 2015
  AND date("Condition"."onsetDateTime") > date('2015-01-01')
  
  -- ICD code is in the S82.20–S82.299 range
  AND "Condition"."code" -> 'coding' -> 0 ->> 'code' LIKE 'S82.2%';
```
- Javascript:
```ts
const patients = await db
  .selectFrom("Patient")
  .innerJoin("Condition", "Condition.subject", "Patient.id")
  .where(() => sql`date("Patient"."birthDate") > date('now', '-18 years')`)
  .where(() => sql`date("Condition"."onsetDateTime") > date('2015-01-01')`)
  .where(() => sql`"Condition"."code" -> 'coding' -> 0 ->> 'code' LIKE 'S82.2%'`)
```

## Custom Containers

**Input**

```md
::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
