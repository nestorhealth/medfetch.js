"use client";

import { api, authClient } from "@/lib/api";
import { openDBFile } from "@/lib/client";
import { sql } from "kysely";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SanityCheck() {
  useEffect(() => {
    async function logCheckResult() {
      const session = await authClient.getSession();
      if (session.data) {
        toast.success(`You are authenticated.`)
      } else {
        toast.error(`You should sign-in`);
      }
      const workspace = await api.GET("/workspaces/{id}", {
        params: {
          path: {
            id: 2
          }
        },
      })
      .catch(
        () => {
          toast.warning(`Pinging workspace again...`)
          return api.GET("/workspaces/{id}", {
            params: {
              path: {
                id: 2
              }
            }
          });
        }
      )
      if (!workspace.data) {
        return toast.error(`Unable to fetch workspace:${workspace.error.error}`);
      }
      const db = await openDBFile(workspace.data.name, workspace.data.vfsType);
      const tables = await db.introspection.getTables();
      const hasPatientsTable = tables.some(table => table.name === "patients");
      if (!hasPatientsTable) {
        console.warn("No such patients table in OPFS file \"foo\". Inserting vtab Patients now. You shouldn't see me again unless you wipe your opfs data");
        await sql.raw(`create table "patients" as select * from "Patient";`).execute(db);
      } else {
        console.log("[sanity-check] > Persistence of \"patients\" table OK!");
      }
      const patientsCached = await sql.raw("select * from patients").execute(db);
      console.log("SAVED PATIENTS", patientsCached.rows)
      toast.success(`Successfully cached ${patientsCached.rows.length} custom-schema patients.`);
    }
    logCheckResult();
  }, []);
  return null;
}