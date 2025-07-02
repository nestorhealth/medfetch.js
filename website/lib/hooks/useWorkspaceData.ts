import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Kysely, sql } from "kysely";
import medfetch from "medfetch/sqlite-wasm";

const queryKey = (table: string) => ["workspaceData", table];

export function useWorkspaceData() {
  const [currentTableName, setCurrentTableName] = useState<
    "Patient" | "Procedure"
  >("Patient");
  const [error, setError] = useState<string | null>(null);

  const raw = globalThis.localStorage?.getItem("workspaceData");
  const parsed = JSON.parse(raw ?? '{"jsonData": null}');
  const blob = new Blob([JSON.stringify(parsed.jsonData)], {
    type: "application/json",
  });
  const file = new File([blob], "dummy.json", {
    type: "application/json",
    lastModified: Date.now(),
  });
  const medDB = new Kysely<any>({
    dialect: medfetch(file, {
      scope: ["Patient", "Procedure"],
      filename: "thisReallyDoesntMatter"
    }),
  });

  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);
  const [patients, setPatients] = useState<any[]>([]);

  useEffect(() => {
    if (!medDB || isInitialized) return;
    (async () => {
      try {
        const patients = await medDB.selectFrom("Patient").selectAll("Patient").execute();
        console.log("UH", patients)
        setPatients(patients)
        setIsInitialized(true);
      } catch (e: any) {
        setError(`Initialization error: ${e.message}`);
      }
    })();
  }, [medDB, isInitialized]);

  const dbTable = currentTableName === "Patient" ? "patients" : "procedures";

  const { data: sqlRows = [], isLoading: sqlLoading } = useQuery({
    queryKey: queryKey(dbTable),
    queryFn: async () => {
      if (!medDB) throw new Error("DB not ready");
      return await sql
        .raw(`SELECT * FROM "${dbTable}"`)
        .execute(medDB)
        .then((result) => result.rows);
    },
    enabled: !!medDB && isInitialized,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const executeQuery = useMutation({
    mutationFn: async (sqlText: string) => {
      if (!medDB) throw new Error("Database not initialized");
      const stmts = sqlText
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      const isSelect = stmts[0].toLowerCase().startsWith("select");
      let results: any[] = [];
      if (isSelect) {
        for (const s of stmts) {
          results = results.concat(
            await sql
              .raw(s)
              .execute(medDB)
              .then((result) => result.rows),
          );
        }
      } else
        await medDB.transaction().execute(async (tx) => {
          await sql.raw(sqlText).execute(tx);
        });
      if (isSelect) queryClient.setQueryData(queryKey(dbTable), results);
      else await queryClient.invalidateQueries({ queryKey: queryKey(dbTable) });
      return results;
    },
    onError: (e: any) => setError(e instanceof Error ? e.message : String(e)),
  });

  const editCell = useMutation({
    mutationFn: async ({
      rowId,
      col,
      newValue,
    }: {
      rowId: any;
      col: string;
      newValue: any;
    }) => {
      if (!medDB) throw new Error("Database not initialized");
      const safeValue =
        typeof newValue === "string" ? `'${newValue}'` : newValue;
      const updateSQL = `UPDATE "${currentTableName}" SET "${col}" = ${safeValue} WHERE "patient_id" = '${rowId}';`;
      await medDB.transaction().execute(async (tx) => {
        sql.raw(updateSQL).execute(tx);
      });
      console.log("Transaction update complete");
      await queryClient.invalidateQueries({ queryKey: queryKey(dbTable) });
    },
    onError: (e: any) => setError(e instanceof Error ? e.message : String(e)),
  });

  // const rawData =
  //   uploadedBundle && currentTableName === "Patient"
  //     ? derivedPatients
  //     : uploadedBundle && currentTableName === "Procedure"
  //       ? derivedProcedures
  //       : sqlRows;
  //
  const rawData = patients;

  const stats = {
    total: rawData.length,
    active:
      currentTableName === "Patient"
        ? rawData.filter((r: any) => r.status === "Active").length
        : 0,
  };

  const isLoading = sqlLoading || !isInitialized;

  return {
    currentTableName,
    setCurrentTableName,
    rawData,
    isLoading,
    error,
    setError,
    executeQuery,
    editCell,
    stats,
  };
}
