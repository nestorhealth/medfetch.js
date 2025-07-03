import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Kysely, sql } from "kysely";

const queryKey = (table: string) => ["workspaceData", table];

export function useWorkspaceData(
  db: Kysely<any>,
  view: {
    tableName: string;
    virtualTableName: string;
  },
) {
  const [currentTableName, setCurrentTableName] = useState<string>(
    view.tableName,
  );
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const {
    data: sqlRows = {
      resultRows: [],
      ctas: "",
    },
    isLoading: sqlLoading,
  } = useQuery({
    queryKey: [db, view],
    queryFn: async () => {
      await db.schema
        .createTable(view.tableName)
        .ifNotExists()
        .as(db.selectFrom(view.tableName).selectAll())
        .execute();
      const { sql } = await db
        .selectFrom("sqlite_master")
        .select("sql")
        .where("name", "=", view.tableName)
        .executeTakeFirstOrThrow();
      const resultRows = await db
        .selectFrom(view.tableName)
        .selectAll()
        .execute();
      return {
        resultRows,
        ctas: sql as string,
      };
    },
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const executeQuery = useMutation({
    mutationFn: async (sqlText: string) => {
      const stmts = sqlText
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      const isSelect = stmts[0].toLowerCase().startsWith("select");
      let results: any[] = [];
      if (isSelect) {
        results = await sql
          .raw(sqlText)
          .execute(db)
          .then((result) => result.rows);
      } else
        await db.transaction().execute(async (tx) => {
          await sql.raw(sqlText).execute(tx);
        });
      if (isSelect) {
        const currentData = queryClient.getQueryData([db, view]) as {
          resultRows: any[];
          ctas: string;
        };
        queryClient.setQueryData([db, view], {
          resultRows: results,
          ctas: currentData.ctas
        });
      } else
        await queryClient.invalidateQueries({
          queryKey: [db, view],
        });
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
      if (!db) throw new Error("Database not initialized");
      const safeValue =
        typeof newValue === "string" ? `'${newValue}'` : newValue;
      const updateSQL = `UPDATE "${currentTableName}" SET "${col}" = ${safeValue} WHERE "patient_id" = '${rowId}';`;
      await db.transaction().execute(async (tx) => {
        sql.raw(updateSQL).execute(tx);
      });
      console.log("Transaction update complete");
      await queryClient.invalidateQueries({
        queryKey: [db, view]
      });
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
  const rawData = sqlRows.resultRows;

  const stats = {
    total: rawData?.length ?? 0,
    active:
      currentTableName === "Patient"
        ? rawData.filter((r: any) => r.status === "Active").length
        : 0,
  };

  const isLoading = sqlLoading;

  return {
    currentTableName,
    setCurrentTableName,
    isLoading,
    error,
    setError,
    executeQuery,
    editCell,
    stats,
    rows: sqlRows?.resultRows ?? [],
    ctas: sqlRows?.ctas ?? "",
  };
}
