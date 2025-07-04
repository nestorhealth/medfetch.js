import { Kysely, type Dialect } from "kysely";
import {
    useQuery,
    useMutation,
    useQueryClient,
    type QueryKey,
    QueryClient,
    UseMutateAsyncFunction,
} from "@tanstack/react-query";
import { useMemo } from "react";

/**
 * Constructor for {@link QueryCacheProxy}
 * @param queryClient The react-query client
 * @param key query key
 * @param queryDataState The query data state you (may) overwrite
 * @returns A named two-tuple with an `invalidate()` and `set()` function for updating the query state
 */
function createQueryCacheProxy<Q>(
    queryClient: QueryClient,
    key: QueryKey,
    queryDataState: Q | undefined,
): QueryCacheProxy<Q> {
    return {
        invalidate: async () => {
            await queryClient.invalidateQueries({
                queryKey: key,
            });
        },
        set: (next): void => {
            queryClient.setQueryData(
                key,
                typeof next === "function"
                    ? (next as SetDatabaseQueryFn<Q | undefined>)(
                          queryDataState,
                      )
                    : next,
            );
        },
    };
}

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
type SetDatabaseQueryFn<T> = (value: T | ((prev: T) => T)) => void;

/**
 * Object holding react-query cache related functions
 *
 * @template QueryResult The data returned by a {@link useQuery}
 *
 * @example
 * const PlaintextQueryCache: QueryCacheProxy<string> = {
 *     set: (data) =>
 * }
 */
interface QueryCacheProxy<QueryResult> {
    readonly set: SetDatabaseQueryFn<QueryResult | undefined>;
    readonly invalidate: () => Promise<void>;
}

type ReadonlyDatabaseQuery<QueryResult, Err> = {
    queryData: QueryResult | undefined;
    queryError: Err | null;
    isQueryPending: boolean;
    isQueryLoading: boolean;
};

interface WritableDatabaseQuery<QueryData, Err, MArgs, MResult>
    extends ReadonlyDatabaseQuery<QueryData, Err> {
    mutate: (args: MArgs) => void;
    mutateError: Err | null;
    mutateAsync: UseMutateAsyncFunction<MResult, Err, MArgs>;
    isMutationPending: boolean;
}

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
export function useDatabase<Q, E = Error>(
    dialect: Dialect,
    read: <DB>(db: Kysely<DB>) => Promise<Q>,
): ReadonlyDatabaseQuery<Q, E>;
export function useDatabase<Q, E = Error, MArgs = any, MResult = any>(
    dialect: Dialect,
    read: <DB>(db: Kysely<DB>) => Promise<Q>,
    write: <DB>(
        db: Kysely<DB>,
        cache: QueryCacheProxy<Q>,
    ) => (input: MArgs) => Promise<MResult>,
): WritableDatabaseQuery<Q, E, MArgs, MResult>;

export function useDatabase<Q, E = Error, MArgs = any, MResult = any>(
    dialect: Dialect,
    read: <DB>(db: Kysely<DB>) => Promise<Q>,
    write?: <DB>(
        db: Kysely<DB>,
        cache: QueryCacheProxy<Q>,
    ) => (input: Q) => Promise<any>,
): ReadonlyDatabaseQuery<Q, E> | WritableDatabaseQuery<Q, E, MArgs, MResult> {
    const db = useMemo(() => new Kysely<any>({ dialect }), []);
    const queryClient = useQueryClient();
    const queryKey: QueryKey = ["db", db];

    const { data, isLoading, isPending, error } = useQuery<Q, E, Q>({
        queryKey,
        queryFn: () => read(db),
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    const cache = createQueryCacheProxy(queryClient, queryKey, data);

    const mutation = useMutation<MResult, E, MArgs>({
        mutationFn: write?.(db, cache) ?? ((async () => void 0) as any),
    });

    if (!write) {
        return {
            queryData: data,
            isQueryPending: isPending,
            isQueryLoading: isLoading,
            queryError: error,
        };
    }

    return {
        queryData: data,
        queryError: error,
        isQueryLoading: isLoading,
        isQueryPending: isPending,
        mutate: mutation.mutate,
        mutateAsync: mutation.mutateAsync,
        mutateError: mutation.error,
        isMutationPending: mutation.isPending,
    };
}
