import { useState, useEffect, useMemo } from "react";
import { useMedDB } from "@/lib/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type TableName = "Patient" | "Procedure";

export function useWorkspaceData() {
  const [uploadedBundle, setUploadedBundle] = useState<any | null>(null);
  const [currentTableName, setCurrentTableName] =
    useState<TableName>("Patient");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("workspaceData");
      if (raw) {
        const { jsonData } = JSON.parse(raw);
        setUploadedBundle(jsonData);
      }
    } catch {
    }
  }, []);

  const derivedPatients = useMemo(() => {
    if (!uploadedBundle) return [];
    const entries = Array.isArray(uploadedBundle.entry)
      ? uploadedBundle.entry
      : [];
    return entries
      .filter((e: any) => e.resource?.resourceType === "Patient")
      .map(({ resource: r }: any) => {
        const birth = r.birthDate ? new Date(r.birthDate) : undefined;
        const age = birth
          ? Math.floor(
              (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
            )
          : undefined;
        return {
          patient_id: r.id,
          first_name: r.name?.[0]?.given?.[0] ?? "",
          last_name: r.name?.[0]?.family ?? "",
          gender: r.gender,
          birthDate: r.birthDate,
          age,
          status: r.active ? "Active" : "Inactive",
        };
      });
  }, [uploadedBundle]);

  const derivedProcedures = useMemo(() => {
    if (!uploadedBundle) return [];
    const entries = Array.isArray(uploadedBundle.entry)
      ? uploadedBundle.entry
      : [];
    return entries
      .filter((e: any) => e.resource?.resourceType === "Procedure")
      .map(({ resource: r }: any) => ({
        procedure_id: r.id,
        patient: r.subject?.reference?.replace("Patient/", "") ?? "",
        code: r.code?.coding?.[0]?.display ?? "",
        performed: r.performedDateTime ?? "",
        status: r.status ?? "",
      }));
  }, [uploadedBundle]);

  const medDB = useMedDB();
  const queryClient = useQueryClient();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!medDB || isInitialized || uploadedBundle) return;
    (async () => {
      try {
        await medDB.exec(`
          create table if not exists patients as
          select 
            "Patient"."id"                                as patient_id,
            "Patient"."name" -> 0 ->> 'family'            as last_name,
            "Patient"."name" -> 0 -> 'given' ->> 0        as first_name,
            CAST((strftime('%Y','now') - strftime('%Y',"Patient"."birthDate"))
                 - (strftime('%m-%d','now') < strftime('%m-%d',"Patient"."birthDate"))
                 AS INTEGER)                              as age,
            "Condition"."code" -> 'coding' -> 0 ->> 'code' as icd_code
          from "Patient"
          inner join "Condition" 
               on "Condition"."subject" = "Patient"."id";
        `);
        setIsInitialized(true);
      } catch (err) {
        setError(`Initialization error: ${(err as Error).message}`);
      }
    })();
  }, [medDB, isInitialized, uploadedBundle]);

  const { data: sqlRows = [], isLoading: sqlLoading } = useQuery({
    queryKey: ["workspaceData", currentTableName],
    queryFn: async () => {
      if (!medDB || !isInitialized) throw new Error("DB not ready");
      return await medDB.prepare(
        `SELECT * FROM "${currentTableName}"`
      ).all();
    },
    enabled: !!medDB && isInitialized && !uploadedBundle,
  });

  const executeQuery = useMutation({
    mutationFn: async (sql: string) => {
      if (uploadedBundle)
        throw new Error(
          "SQL queries are disabled when using an uploaded dataset."
        );
      if (!medDB) throw new Error("Database not initialized");

      const stmts = sql
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      const isSelect = stmts[0].toLowerCase().startsWith("select");
      let results: any[] = [];

      if (isSelect) {
        for (const stmt of stmts) {
          const r = await medDB.prepare(stmt + ";").all();
          results = results.concat(r);
        }
      } else {
        await medDB.exec(`BEGIN; ${stmts.join(";")}; COMMIT;`);
      }

      if (isSelect) {
        queryClient.setQueryData(
          ["workspaceData", currentTableName],
          results
        );
      } else {
        await queryClient.invalidateQueries({
          queryKey: ["workspaceData", currentTableName],
        });
      }
      return results;
    },
    onError: (err: any) =>
      setError(err instanceof Error ? err.message : String(err)),
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
      if (uploadedBundle)
        throw new Error(
          "Direct cell edits are disabled when using an uploaded dataset."
        );
      if (!medDB) throw new Error("Database not initialized");

      const safe =
        typeof newValue === "string" ? `'${newValue}'` : newValue;
      await medDB.exec(
        `BEGIN; UPDATE "${currentTableName}" SET "${col}"=${safe} WHERE "patient_id"='${rowId}'; COMMIT;`
      );
      await queryClient.invalidateQueries({
        queryKey: ["workspaceData", currentTableName],
      });
    },
    onError: (err: any) =>
      setError(err instanceof Error ? err.message : String(err)),
  });

  const rawData =
    uploadedBundle && currentTableName === "Patient"
      ? derivedPatients
      : uploadedBundle && currentTableName === "Procedure"
      ? derivedProcedures
      : sqlRows;

  const stats = {
    total: rawData.length,
    active:
      currentTableName === "Patient"
        ? rawData.filter((r: any) => r.status === "Active").length
        : 0,
  };

  const isLoading =
    uploadedBundle ? false : sqlLoading || !isInitialized;

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
