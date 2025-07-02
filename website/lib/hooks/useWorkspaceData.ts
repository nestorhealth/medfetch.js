import { useState, useEffect, useMemo } from "react"
import { useMedfetch } from "@/lib/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { sql } from "kysely"

const queryKey = (table: string) => ["workspaceData", table]

export function useWorkspaceData() {
  const [uploadedBundle, setUploadedBundle] = useState<any | null>(null)
  const [currentTableName, setCurrentTableName] =
    useState<"Patient" | "Procedure">("Patient")
  const [error, setError] = useState<string | null>(null)

  const medDB = useMedfetch();
  const queryClient = useQueryClient()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const raw = localStorage.getItem("workspaceData")
      if (!raw) return
      const parsed = JSON.parse(raw)
      if (parsed.jsonData) setUploadedBundle(parsed.jsonData)
    } catch {}
  }, [])

  const derivedPatients = useMemo(() => {
    if (!uploadedBundle) return []
    const entries = Array.isArray(uploadedBundle.entry) ? uploadedBundle.entry : []
    return entries
      .filter((e: any) => e.resource?.resourceType === "Patient")
      .map(({ resource: r }: any) => {
        const birth = r.birthDate ? new Date(r.birthDate) : undefined
        const age = birth
          ? Math.floor(
              (Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
            )
          : undefined
        return {
          patient_id: r.id,
          first_name: r.name?.[0]?.given?.[0] ?? "",
          last_name: r.name?.[0]?.family ?? "",
          age,
          gender: r.gender,
          status: r.active ? "Active" : "Inactive"
        }
      })
  }, [uploadedBundle])

  const derivedProcedures = useMemo(() => {
    if (!uploadedBundle) return []
    const entries = Array.isArray(uploadedBundle.entry) ? uploadedBundle.entry : []
    return entries
      .filter((e: any) => e.resource?.resourceType === "Procedure")
      .map(({ resource: r }: any) => ({
        procedure_id: r.id,
        patient: r.subject?.reference?.replace("Patient/", "") ?? "",
        code: r.code?.coding?.[0]?.display ?? "",
        performed: r.performedDateTime ?? "",
        status: r.status ?? ""
      }))
  }, [uploadedBundle])

  useEffect(() => {
    if (!medDB || isInitialized || uploadedBundle) return
    ;(async () => {
      try {
        await sql.raw(`
          create table if not exists patients as
          select "Patient"."id" as patient_id,
            strftime('%Y',"Condition"."onsetDateTime") as onset_year,
            "Condition"."code"->'coding'->0->>'code' as icd_code,
            "Patient"."name"->0->'given'->>0 as first_name,
            "Patient"."name"->0->>'family' as last_name,
            CAST((strftime('%Y','now')-strftime('%Y',"Patient"."birthDate"))-(strftime('%m-%d','now')<strftime('%m-%d',"Patient"."birthDate")) AS INTEGER) as age
          from "Patient" inner join "Condition" on "Condition"."subject"="Patient"."id";
          create table if not exists procedures(
            procedure_id text primary key,
            patient text,
            code text,
            performed text,
            status text
          );
        `).execute(medDB);
        setIsInitialized(true)
      } catch (e: any) {
        setError(`Initialization error: ${e.message}`)
      }
    })()
  }, [medDB, isInitialized, uploadedBundle])

  const dbTable = currentTableName === "Patient" ? "patients" : "procedures"

  const {
    data: sqlRows = [],
    isLoading: sqlLoading
  } = useQuery({
    queryKey: queryKey(dbTable),
    queryFn: async () => {
      if (!medDB) throw new Error("DB not ready")
      return await sql.raw(`SELECT * FROM "${dbTable}"`).execute(medDB).then(result => result.rows);
    },
    enabled: !!medDB && isInitialized && !uploadedBundle,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity
  })

  const executeQuery = useMutation({
    mutationFn: async (sqlText: string) => {
      if (uploadedBundle) throw new Error("Database not initialized for uploaded datasets yet.")
      if (!medDB) throw new Error("Database not initialized")
      const stmts = sqlText.split(";").map((s) => s.trim()).filter(Boolean)
      const isSelect = stmts[0].toLowerCase().startsWith("select")
      let results: any[] = []
      if (isSelect) {
        for (const s of stmts) {
          results = await sql.raw(s).execute(medDB).then(result => result.rows)
        }
      } else await medDB.transaction().execute(async tx => {
        await sql.raw(sqlText).execute(tx)
      })
      if (isSelect) queryClient.setQueryData(queryKey(dbTable), results)
      else await queryClient.invalidateQueries({ queryKey: queryKey(dbTable) })
      return results
    },
    onError: (e: any) => setError(e instanceof Error ? e.message : String(e))
  })

  const editCell = useMutation({
    mutationFn: async ({
      rowId,
      col,
      newValue
    }: {
      rowId: any
      col: string
      newValue: any
    }) => {
      if (uploadedBundle) throw new Error("Database not initialized for cell edits yet.")
      if (!medDB) throw new Error("Database not initialized")
      const pk = currentTableName === "Patient" ? "patient_id" : "procedure_id"
      const safe = typeof newValue === "string" ? `'${newValue}'` : newValue
      await medDB.transaction().execute(async tx => {
        tx
          .updateTable(dbTable)
          .set(sql`${col} = ${newValue}`)
          .where(sql`${pk}`, "=", rowId)
          .execute();
      })
      console.log("Transaction update complete")
      await queryClient.invalidateQueries({ queryKey: queryKey(dbTable) })
    },
    onError: (e: any) => setError(e instanceof Error ? e.message : String(e))
  })

  const rawData =
    uploadedBundle && currentTableName === "Patient"
      ? derivedPatients
      : uploadedBundle && currentTableName === "Procedure"
      ? derivedProcedures
      : sqlRows

  const stats = {
    total: rawData.length,
    active:
      currentTableName === "Patient"
        ? rawData.filter((r: any) => r.status === "Active").length
        : 0
  }

  const isLoading = uploadedBundle ? false : sqlLoading || !isInitialized

  return {
    currentTableName,
    setCurrentTableName,
    rawData,
    isLoading,
    error,
    setError,
    executeQuery,
    editCell,
    stats
  }
}
