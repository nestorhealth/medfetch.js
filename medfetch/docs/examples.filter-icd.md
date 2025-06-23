<script setup lang="ts">
import { table0, table1 } from "./sql/icd-queries";
import { onMounted, ref } from "vue";
import DataTable from "./components/DataTable.vue";
import { sqliteOnFhir } from "~/sqlite.browser";
import DBWorker from "./sql/db.worker?worker";
import { Kysely } from "kysely";

const worker = new DBWorker({ name: "db.worker" });

const dialect = sqliteOnFhir(
  ":memory:",
  `${import.meta.env.MODE === "development" ? "http://localhost:8787/fhir" : "https://api.medfetch.io/fhir"}`,
  {
    worker,
    scope: ["Patient", "Condition"]
  }
);
const db = new Kysely({
  dialect,
});

type Column = {
  name: string;
  dataType: string;
};
type ViewState = { rows: Record<string, unknown>[]; columns: Column[] }

const viewStates = ref<ViewState[]>([]);
onMounted(async () => {
  try {
    const t0  = await table0(db);
    const t1 = await table1(db)
    const views: ViewState[] = [
      t0,
      t1,
    ];
    viewStates.value = views
  } catch (e) {
    console.error(e);
  }
});

</script>


# ICD Code Query example
This is what we'll start with:
::: code-group
```ts [queries.ts]
const initial = db.schema
  .createTable("patients")
  .as(
    db
      .selectFrom("Patient")
      .innerJoin("Condition", "Condition.subject", "Patient.id")
      .select([
        "Patient.id as patient_id",
        sql<string>`strftime('%Y', "Condition"."onsetDateTime")`.as("onset_year"),
        sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'code'`.as("icd_code"),
        sql<string>`"Patient"."name" -> 0 -> 'given' ->> 0`.as("first_name"),
        sql<string>`"Patient"."name" -> 0 ->> 'family'`.as("last_name"),
        sql<number>`
        CAST(
        (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
        - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
        AS INTEGER
      )
        `.as("age"),
      ])
  );
// Query the initial row state:
const initialQuery = initial.compile();
...
const rows = await db
  .executeQuery(initialQuery)
  .then(() => db.selectFrom("patients").selectAll("patients").execute());
```

```sql [initial.sql]
create table "patients" as 
select 
  "Patient"."id" as "patient_id", 
  strftime('%Y', "Condition"."onsetDateTime") as "onset_year",
  "Condition"."code" -> 'coding' -> 0 ->> 'code' as "icd_code",
  "Patient"."name" -> 0 -> 'given' ->> 0 as "first_name",
  "Patient"."name" -> 0 ->> 'family' as "last_name",
  CAST(
    (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
    - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
    AS INTEGER
  ) as "age" 
  from "Patient" 
  inner join "Condition" 
  on "Condition"."subject" = "Patient"."id";

select * from "patients";
```

:::

<ClientOnly>
- Result
<DataTable :columns="viewStates[0].columns" :rows="viewStates[0].rows" />

This uses the ICD code system but the same logic should apply for most others.

> [!TIP]
> In almost all cases you will want to do a CREATE TABLE AS statement so you can
> cache the results in memory and save yourself the round trip to the resource.

## General Inclusion
Let's filter by adult patients who were admitted in the US after 2015 for
any tibial shaft fractures. So that's any code `LIKE S82.20%` in SQLite.

"Show me adult patients over 18 years old admitted in the US after 2015 with 
tibial shaft fractures."

::: code-group

```js [adultPatients.js]
const adultPatients = db
  .selectFrom("patients")
  .selectAll("patients")
  .where("patients.age", ">", 18)
  .where("patients.icd_code", "like", "S82.20%")
  .where("patients.onset_year", ">", "2015");
```

```sql [adult-patients.sql]
SELECT * FROM "patients"
WHERE patients.age > 18 AND patients.icd_code like 'S82.20%'
AND patients.onset_year > "2015"
```
:::

- Result
  <DataTable
    v-if="viewStates.length > 1 && viewStates[1].rows?.length"
    :columns="viewStates[1].columns"
    :rows="viewStates[1].rows"
  />

## Fracture Type Breakdown
Let's group patients by their fracture type

::: code-group

```js [fractureTypes.js]
const groupByCaseQuery = db
  .selectFrom("patients")
  .select((eb) => [
    eb
      .case()
      .when("icd_code", "like", "%A")
      .then("Closed Fracture (A)")
      .when("icd_code", "like", "%B")
      .then("Open Type I/II (B)")
      .when("icd_code", "like", "%C")
      .then("Open Type III (C)")
      .else("Other/Unspecified")
      .endCase()
      .as("fracture_type"),
    eb.fn.countAll().as("total_cases"),
  ])
  .where("icd_code", "like", "S82.20%")
  .groupBy("fracture_type")
  .compile();
```

```sql [fracture-types.sql]
SELECT
  CASE
    WHEN icd_code LIKE '%A' THEN 'Closed Fracture (A)'
    WHEN icd_code LIKE '%B' THEN 'Open Type I/II (B)'
    WHEN icd_code LIKE '%C' THEN 'Open Type III (C)'
    ELSE 'Other/Unspecified'
  END AS fracture_type,
  COUNT(*) AS total_cases
FROM patients
WHERE icd_code LIKE 'S82.20%'
GROUP BY fracture_type;
:::
</ClientOnly>

