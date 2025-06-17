import { useState, useCallback, useEffect } from 'react';
import { useMedDB } from '@/lib/client';
import { TableManager, type ColumnDefinition } from '@/utils/tableManager';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useWorkspaceData() {
  const medDB = useMedDB();
  const queryClient = useQueryClient();
  const [currentTableName, setCurrentTableName] = useState<string>("patients");
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize database and create initial table
  useEffect(() => {
    if (!medDB || isInitialized) return;

    const initialize = async () => {
      try {
        // Create the patients table with the required structure
        await medDB.exec(`
          create table if not exists patients as
          select 
            "Patient"."id" as "patient_id", 
            strftime('%Y', "Condition"."onsetDateTime") as "onset_year", 
            "Condition"."code" -> 'coding' -> 0 ->> 'code' as "icd_code", 
            "Patient"."name" -> 0 -> 'given' ->> 0 as "first_name", 
            "Patient"."name" -> 0 ->> 'family' as "last_name", 
            CAST(
              (strftime('%Y', 'now') - strftime('%Y', "Patient"."birthDate")) 
              - (strftime('%m-%d', 'now') < strftime('%m-%d', "Patient"."birthDate"))
              AS INTEGER
            ) as age
          from "Patient" 
          inner join "Condition" on "Condition"."subject" = "Patient"."id"
        `);
        setIsInitialized(true);
      } catch (err) {
        setError("Initialization error: " + (err as Error).message);
      }
    };

    initialize();
  }, [medDB, isInitialized]);

  // Query for table data
  const { data: rawData = [], isLoading } = useQuery({
    queryKey: ['workspaceData', currentTableName],
    queryFn: async () => {
      if (!medDB) throw new Error("Database not initialized");
      if (!isInitialized) throw new Error("Database not initialized");
      
      const rows = await medDB.prepare(`SELECT * FROM "${currentTableName}"`).all();
      return rows;
    },
    enabled: !!medDB && isInitialized,
  });

  // Mutation for executing queries
  const executeQuery = useMutation({
    mutationFn: async (sql: string) => {
      if (!medDB) throw new Error("Database not initialized");
      
      const statements = sql
        .split(";")
        .map((s) => s.trim())
        .filter(Boolean);
      const isSelect = statements[0].toLowerCase().startsWith("select");

      let results: any[] = [];
      if (isSelect) {
        // For SELECT queries, execute and store results
        for (const stmt of statements) {
          const queryResults = await medDB.prepare(stmt + ";").all();
          results = results.concat(queryResults);
        }
      } else {
        // For non-SELECT queries, execute in transaction
        await medDB.exec(`
          BEGIN TRANSACTION;
          ${statements.join(";")};
          COMMIT;
        `);
      }

      let affectedTable: "Patient" | "Procedure" | null = null;
      const first = statements[0].toLowerCase();
      const match =
        first.match(/from\s+(\w+)/i) ||
        first.match(/into\s+(\w+)/i) ||
        first.match(/(?:update|delete from)\s+(\w+)/i);
      if (match) affectedTable = match[1] as "Patient" | "Procedure";

      if (affectedTable && affectedTable !== currentTableName) {
        setCurrentTableName(affectedTable);
      }

      // For SELECT queries, update the data directly
      if (isSelect) {
        queryClient.setQueryData(['workspaceData', currentTableName], results);
      } else {
        // For non-SELECT queries, invalidate and refetch
        await queryClient.invalidateQueries({ queryKey: ['workspaceData', currentTableName] });
      }

      return results;
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  });

  // Mutation for cell edits
  const editCell = useMutation({
    mutationFn: async ({ rowId, col, newValue }: { rowId: any; col: string; newValue: any }) => {
      if (!medDB) throw new Error("Database not initialized");
      
      const safeValue = typeof newValue === "string" ? `'${newValue}'` : newValue;
      const updateSQL = `UPDATE "${currentTableName}" SET "${col}" = ${safeValue} WHERE "patient_id" = '${rowId}';`;

      await medDB.exec(`
        BEGIN TRANSACTION;
        ${updateSQL}
        COMMIT;
      `);

      // Invalidate and refetch
      await queryClient.invalidateQueries({ queryKey: ['workspaceData', currentTableName] });
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    }
  });

  const stats = {
    total: rawData.length,
    active: rawData.filter((r) => r.status === "Active" || !r.status).length,
  };

  return {
    currentTableName,
    setCurrentTableName,
    rawData,
    isLoading: isLoading || !isInitialized,
    error,
    setError,
    executeQuery,
    editCell,
    stats,
  };
} 