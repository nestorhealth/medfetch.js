"use client";

import { sql, type Kysely } from "kysely";
import type { Patient } from "fhir/r5";

import medfetch from "medfetch/sqlite-wasm";
import { useDatabase } from "medfetch/next";
import type { Rowify } from "medfetch/dialects";
import { useMemo } from "react";
import EditName from "@/app/sanity-checks/useDatabase2/page.EditName";

export type DB = {
  Patient: Rowify<Patient> & { id: string };
  patients: {
    id: string;
    full_name: string | null;
  };
};

export default function Page() {
  const dialect = useMemo(
    () => medfetch(`${process.env.NEXT_PUBLIC_API_URL!}/fhir`),
    []
  );
  const patientsView = useDatabase(
    dialect,
    // Read function
    async (db: Kysely<DB>) => {
      const ctas = db.selectFrom("Patient").select([
        "Patient.id",
        sql<string>`
          concat("Patient"."name" -> 0 -> 'given' ->> 0,
            ' ',
            "Patient"."name" -> 0 ->> 'family'
          )
          `.as("full_name"),
      ]);
      // Can't mutate the API data directly, so make a copy using a CTAS
      await db.schema.createTable("patients").ifNotExists().as(ctas).execute();
      // View will be patients table
      return db.selectFrom("patients").selectAll().execute();
    },
    // #region writeBack
    (db: Kysely<DB>, cache) =>
      async (formLike: { id: string; newName: string }) => {
        await db
          .updateTable("patients")
          .set({
            full_name: formLike.newName,
          })
          .where("patients.id", "=", formLike.id)
          .execute();
        await cache.invalidate();
      },
    // #endregion writeBack
  );
  if (!patientsView.queryData) {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {patientsView.queryData.map((patient) => {
        return (
          <div key={patient.id} className="border-b border-b-gray-700">
            <EditName
              {...patient}
              mutate={patientsView.mutate}
              isMutationPending={patientsView.isMutationPending}
            />
            Name in database: {patient.full_name}
          </div>
        );
      })}
    </main>
  );
}
