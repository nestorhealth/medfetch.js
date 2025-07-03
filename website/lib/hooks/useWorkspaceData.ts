import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Kysely, sql } from "kysely";
import medfetch from "medfetch/sqlite-wasm";
import { call } from "@/lib/utils";

const queryKey = (table: string) => ["workspaceData", table];

function createDatabase(...args: Parameters<typeof medfetch>) {
  const dialect = medfetch(...args);
  const db = new Kysely<any>({
    dialect,
  });
  return db;
}

export function useWorkspaceData(
  workspaceName: string,
  view: {
    tableName: string;
    virtualTableName: string;
  }
) {
  const [currentTableName, setCurrentTableName] =
    useState<string>(view.tableName);
  const [error, setError] = useState<string | null>(null);

  const raw = globalThis.localStorage?.getItem("workspaceData");
  const parsed = JSON.parse(raw ?? '{"jsonData": null}');
  const blob = new Blob([JSON.stringify(parsed.jsonData)], {
    type: "application/json",
  });
  const file = new File([blob], "idontmatter.json", {
    type: "application/json",
    lastModified: Date.now(),
  });

  const db = createDatabase(file, {
    filename: workspaceName,
  });

  const queryClient = useQueryClient();
  const [initialTableStatement, setInitialTableStatement] = useState<string>();
  const [isInitialized, setIsInitialized] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (isInitialized) return;
    call(async () => {
      try {
        await db.schema
          .createTable(view.tableName)
          .ifNotExists()
          .as(db.selectFrom(view.tableName).selectAll(view.tableName))
          .execute();
        const resultRow = await db
          .selectFrom("sqlite_master")
          .select("sql")
          .where("name", "=", "patients")
          .executeTakeFirstOrThrow();
        const initialData = await db.selectFrom(view.tableName).selectAll(view.tableName).execute();
        setData(initialData);
        setInitialTableStatement(resultRow.sql);
        setIsInitialized(true);
      } catch (e: any) {
        setError(`Initialization error: ${e.message}`);
      }
    });
  }, [db, view.tableName, isInitialized, view.virtualTableName]);

  const dbTable = currentTableName === "Patient" ? "patients" : "procedures";
  
  const { data: sqlRows = [], isLoading: sqlLoading } = useQuery({
    queryKey: [...queryKey(dbTable), isInitialized],
    queryFn: async () => {
      return await sql
        .raw(`SELECT * FROM "${dbTable}"`)
        .execute(db)
        .then((result) => result.rows);
    },
    initialData: data,
    enabled: isInitialized,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  const executeQuery = useMutation({
    mutationFn: async (sqlText: string) => {
      if (!db) throw new Error("Database not initialized");
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
              .execute(db)
              .then((result) => result.rows),
          );
        }
      } else
        await db.transaction().execute(async (tx) => {
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
      if (!db) throw new Error("Database not initialized");
      const safeValue =
        typeof newValue === "string" ? `'${newValue}'` : newValue;
      const updateSQL = `UPDATE "${currentTableName}" SET "${col}" = ${safeValue} WHERE "patient_id" = '${rowId}';`;
      await db.transaction().execute(async (tx) => {
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
  const rawData = sqlRows;

  const stats = {
    total: rawData.length,
    active:
      currentTableName === "Patient"
        ? rawData.filter((r: any) => r.status === "Active").length
        : 0,
  };

  const isLoading = !isInitialized || sqlLoading;

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
    initialTableStatement,
    db: db,
  };
}
