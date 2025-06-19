"use client";

import { db } from "@/lib/client";
import { sql } from "kysely";
import { useQuery } from "@tanstack/react-query";

const conditionCode = sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'code'`;

export function HeroQuery() {
  const { data } = useQuery({
    queryKey: ["/hero"],
    queryFn: async () => {
      const initialState = await db
        .selectFrom("Patient")
        .innerJoin("Condition", "Condition.subject", "Patient.id")
        .select([
          "Patient.id as patient_id",
          "Patient.gender as gender",
          conditionCode.as("fracture_code"),
          sql<string>`"Condition"."code" -> 'coding' -> 0 ->> 'display'`.as(
            "fracture_text",
          ),
          sql<number>`
    CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', "Patient"."birthDate") AS INTEGER)
    `.as("age"),
          sql<string>`CASE Patient.active WHEN 1 THEN 'true' ELSE 'false' END`.as(
            "active",
          ),
          sql<number>`CAST(strftime('%Y', "Condition"."onsetDateTime") AS INTEGER)`.as(
            "onset_year",
          ),
        ])
        .where("Patient.birthDate", "<", sql<string>`date('now', '-18 years')`) // Under 18
        .where(
          sql<number>`CAST(strftime('%Y', "Condition"."onsetDateTime") AS INTEGER)`,
          ">",
          2015,
        ) // After 2015
        .where(() => sql`${conditionCode} LIKE 'S82%' COLLATE NOCASE`)
        .execute();
      return initialState;
    },
  });
  console.log("data", data)

  return <div>lol</div>;
}
