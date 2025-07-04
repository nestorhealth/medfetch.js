import { Kysely, type Dialect } from "kysely";
import {
  useQuery,
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";

/**
 * A function used to update the local cached view data, similar to React's `setState`.
 *
 * The `set` function accepts either:
 * - A new value of the view data directly, or
 * - A function that receives the previous data and returns the next data.
 *
 * This enables mutation handlers to optimistically update the view after a successful mutation.
 *
 * @typeParam ReadResult - The type of the view data returned from the `read` function.
 *
 * @example
 * ```ts
 * set({ resultRows: [], ctas: "" });
 *
 * // or based on previous state
 * set(prev => [...prev, newRow]);
 * ```
 */
type SetViewFn<ReadResult> =
  (next: ReadResult | ((prev: ReadResult | undefined) => ReadResult | undefined)) => void;

/**
 * A union type representing the overloads for the `view()` hook factory.
 * 
 * The returned hook supports both:
 * - **Read-only views** (just `read`)
 * - **Read + Write views** (with an optional `write`)
 *
 * The hook returned from `view(dialect)` provides typed access to TanStack Query
 * integration, stateful view data, and optional mutation support with optimistic updates.
 *
 * @typeParam DB - The Kysely database schema (used for typing the query builder).
 *
 * @example
 * ```ts
 * const useView = view<DB>(dialect);
 *
 * // read-only mode
 * const { data } = useView(async db => await db.selectFrom("Patient").selectAll().execute());
 *
 * // read + write mode
 * const { data, mutateAsync } = useView(
 *   async db => await db.selectFrom("Patient").selectAll().execute(),
 *   (db, set) => async (newName: string) => {
 *     await db.updateTable("Patient").set({ name: newName }).execute();
 *     set(prev => ({ ...prev, name: newName }));
 *   }
 * );
 * ```
 */
type UseDatabaseView<DB> = {
  /**
   * Creates a read-only database view hook using the given `read` function.
   *
   * @param read - A function that fetches data from the Kysely database.
   * @returns An object containing `data`, `isLoading`, and `error`.
   */
  <ReadResult>(
    read: (db: Kysely<DB>) => Promise<ReadResult>
  ): {
    data: ReadResult | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  /**
   * Creates a read/write database view hook using the given `read` and `write` functions.
   *
   * The `write` function receives:
   * - The Kysely database instance
   * - A `set` function to update the current view state optimistically
   *
   * It returns a mutation function that accepts `WriteInput` and performs async side effects.
   *
   * @param read - A function that fetches data from the database.
   * @param write - A function that returns a mutation handler. It can use `set()` to update local state.
   * @returns An object with query state and mutation handlers.
   */
  <ReadResult, WriteInput = unknown>(
    read: (db: Kysely<DB>) => Promise<ReadResult>,
    write: (
      db: Kysely<DB>,
      set: SetViewFn<ReadResult>
    ) => (input: WriteInput) => Promise<any>
  ): {
    data: ReadResult | undefined;
    isLoading: boolean;
    error: Error | null;
    mutate: (input: WriteInput) => void;
    mutateAsync: (input: WriteInput) => Promise<any>;
    isMutating: boolean;
  };
};

/**
 * Define a database view from the given {@link Dialect} connection
 * and get back a react-query {@link useQuery} result for that data and
 * an optional Mutation, if a write function is provided
 * 
 * @param dialect Your kysely dialect
 * @returns A {@link UseDatabaseView} function
 * @template DB - Your Kysely database schema
 *
 * @example
 * ```ts
 * const useView = view(dialect); 
 * const view = useView(
 *   // read function
 *   async (db) => {
 *     await db.schema
 *       .createTable(viewOpts.tableName)
 *       .ifNotExists()
 *       .as(db.selectFrom(viewOpts.virtualTableName).selectAll())
 *       .execute();
 * 
 *     const { sql } = await db
 *       .selectFrom("sqlite_master")
 *       .select("sql")
 *       .where("name", "=", viewOpts.tableName)
 *       .executeTakeFirstOrThrow();
 * 
 *     const resultRows = await db
 *       .selectFrom(viewOpts.tableName)
 *       .selectAll()
 *       .execute();
 * 
 *     return {
 *       resultRows,
 *       ctas: sql as string,
 *     };
 *   },
 *
 *   // optional write function
 *   (db, set) => async (sqlText: string) => {
 *     const stmts = sqlText
 *       .split(";")
 *       .map((s) => s.trim())
 *       .filter(Boolean);
 * 
 *     const isSelect = stmts[0].toLowerCase().startsWith("select");
 *     let results: any[] = [];
 * 
 *     if (isSelect) {
 *       results = await sql
 *         .raw(sqlText)
 *         .execute(db)
 *         .then((result) => result.rows);
 *     } else {
 *       await db.transaction().execute(async (tx) => {
 *         await sql.raw(sqlText).execute(tx);
 *       });
 *     }
 * 
 *     const { sql: ctas } = await db
 *       .selectFrom("sqlite_master")
 *       .select("sql")
 *       .where("name", "=", viewOpts.tableName)
 *       .executeTakeFirstOrThrow();
 * 
 *     set(prev => {
 *       if (!isSelect) return prev;
 *       return {
 *         resultRows: results,
 *         ctas,
 *       };
 *     });
 *   }
 * );
 * ```
 * 
 */
export function view<DB = any>(dialect: Dialect): UseDatabaseView<DB>;
export function view<DB = any>(dialect: Dialect) {
  return function useDatabaseView<ReadResult, WriteInput = unknown>(
    read: (db: Kysely<DB>) => Promise<ReadResult>,
    write?: (
      db: Kysely<DB>,
      set: (next: ReadResult | ((prev?: ReadResult) => ReadResult)) => void
    ) => (input: WriteInput) => Promise<any>
  ) {
    const db = new Kysely<DB>({ dialect });
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ["databaseQuery", db];

    const { data, isLoading, error } = useQuery<ReadResult>({
      queryKey,
      queryFn: () => read(db),
      staleTime: Infinity,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

    const set: SetViewFn<ReadResult> = (next): void => {
      const newData =
        typeof next === "function"
          ? (next as (prev?: ReadResult) => ReadResult)(data)
          : next;
      queryClient.setQueryData(queryKey, newData);
    };

    const mutation = useMutation({
      mutationFn: write?.(db, set) ?? (async () => void 0),
    });

    if (!write) {
      return {
        data,
        isLoading,
        error: error as Error | null,
      };
    }

    return {
      data,
      isLoading,
      error: error as Error | null,
      mutate: mutation.mutate,
      mutateAsync: mutation.mutateAsync,
      isMutating: mutation.isPending,
    };
  };
}