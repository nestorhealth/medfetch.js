import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialect, Kysely, sql } from "kysely";
import { useDatabase } from "medfetch/next";

export function useWorkspaceData(
  dialect: Dialect,
  viewOpts: {
    tableName: string;
    virtualTableName: string;
    workspaceName?: string;
  },
) {
  const db = new Kysely({ dialect });
  const [error, setError] = useState<string | null>(null);

  const workspaceView = useDatabase(
    dialect,
    async (db: Kysely<any>) => {
      await db.schema
        .createTable(viewOpts.tableName)
        .ifNotExists()
        .as(db.selectFrom(viewOpts.virtualTableName).selectAll())
        .execute();
      const masterRow = await db
        .selectFrom("sqlite_master")
        .selectAll()
        .where("name", "=", viewOpts.tableName)
        .executeTakeFirstOrThrow();

      const resultRows = await db
        .selectFrom(viewOpts.tableName)
        .selectAll()
        .execute();
      return {
        resultRows,
        ctas: masterRow.sql,
      };
    },
    (db: Kysely<any>, { set }) =>
      async (sqlText: string) => {
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
        } else {
          await db.transaction().execute(async (tx) => {
            await sql.raw(sqlText).execute(tx);
          });
        }
        const { sql: ctas } = await db
          .selectFrom("sqlite_master")
          .select("sql")
          .where("name", "=", viewOpts.tableName)
          .executeTakeFirstOrThrow();
        set((prev) => {
          if (!isSelect) {
            return prev;
          }
          return {
            resultRows: results,
            ctas,
          };
        });
      },
      [viewOpts.workspaceName]
  );

  const queryClient = useQueryClient();
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
      const updateSQL = `UPDATE "${viewOpts.tableName}" SET "${col}" = ${safeValue} WHERE "patient_id" = '${rowId}';`;
      await db.transaction().execute(async (tx) => {
        sql.raw(updateSQL).execute(tx);
      });
      console.log("Transaction update complete", updateSQL);
      await queryClient.invalidateQueries({
        queryKey: ["db"],
      });
    },
    onError: (e: any) => setError(e instanceof Error ? e.message : String(e)),
  });

  const stats = {
    total: workspaceView.queryData?.resultRows?.length ?? 0,
    active:
        workspaceView.queryData?.resultRows?.filter(
            (r: any) => r.status === "Active",
          ).length
        ?? 0,
  };

  return {
    isLoading: workspaceView.isQueryLoading || workspaceView.isMutationPending,
    error,
    setError,
    executeQuery: {
      mutate: workspaceView.mutate!,
      mutateAsync: workspaceView.mutateAsync!,
    },
    editCell,
    stats,
    rows: workspaceView.queryData?.resultRows ?? [],
    ctas: workspaceView.queryData?.ctas ?? "",
  };
}
