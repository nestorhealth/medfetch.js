# ICD Dataset example

1. Show me pediatric patients under 18 years old admitted in the US after 2015 with 
tibial shaft fractures

```ts
const initialState = await db
.selectFrom("Patient")
.innerJoin("Condition", "Condition.subject", "Patient.id")
.selectAll("Patient")
  .where("Patient.birthDate", ">=", sql<string>`date('now', '-18 years')`)
  .where((eb) =>
    eb.or([
      eb("Patient.address", "like", sql<string>`'%United States%'`),
      eb("Patient.address", "like", sql<string>`'%USA%'`),
    ])
  )
  .where("Condition.recordedDate", ">=", "2015-01-01")
  .where((eb) =>
    eb.or([
      eb(sql<string>`Condition.code -> 'coding' -> 0 ->> code`, "like", "%S82.20%"),
    ])
  )
  .execute();
```