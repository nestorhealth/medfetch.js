import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Dialect, Kysely, sql } from "kysely";
import { view } from "medfetch/react";

export function useWorkspaceData(
  dialect: Dialect,
  viewOpts: {
    tableName: string;
    virtualTableName: string;
  },
) {
  const db = new Kysely<any>({ dialect });
  const [currentTableName, setCurrentTableName] = useState<string>(
    viewOpts.tableName,
  );
  const [error, setError] = useState<string | null>(null);

  const workspaceView = view(dialect)(
    async (db) => {
      await db.schema
        .createTable(viewOpts.tableName)
        .ifNotExists()
        .as(db.selectFrom(viewOpts.virtualTableName).selectAll())
        .execute();
      const { sql } = await db
        .selectFrom("sqlite_master")
        .select("sql")
        .where("name", "=", viewOpts.tableName)
        .executeTakeFirstOrThrow();
      const resultRows = await db
        .selectFrom(viewOpts.tableName)
        .selectAll()
        .execute();
      return {
        resultRows,
        ctas: sql as string,
      };
    },
    (db, set) => async (sqlText: string) => {
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
      const {sql:ctas}= await db
        .selectFrom("sqlite_master")
        .select("sql")
        .where("name", "=", viewOpts.tableName)
        .executeTakeFirstOrThrow();
      set(prev => {
        if (!isSelect) {
          return prev;
        }
        return {
          resultRows: results,
          ctas
        }
      })
    },
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
      const updateSQL = `UPDATE "${currentTableName}" SET "${col}" = ${safeValue} WHERE "patient_id" = '${rowId}';`;
      await db.transaction().execute(async (tx) => {
        sql.raw(updateSQL).execute(tx);
      });
      console.log("Transaction update complete");
      await queryClient.invalidateQueries({
        queryKey: [db, viewOpts],
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

  const stats = {
    total: workspaceView.data?.resultRows.length ?? 0,
    active:
      currentTableName === "Patient"
        ? workspaceView.data?.resultRows.filter((r: any) => r.status === "Active").length
        : 0,
  };

  return {
    currentTableName,
    setCurrentTableName,
    isLoading: workspaceView.isLoading,
    error,
    setError,
    executeQuery: {
      mutate: workspaceView.mutate,
      mutateAsync: workspaceView.mutateAsync,
    },
    editCell,
    stats,
    rows: workspaceView.data?.resultRows ?? [],
    ctas: workspaceView.data?.ctas ?? "",
  };
}
