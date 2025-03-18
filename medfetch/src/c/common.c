#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include <cfhir.h>
#include "common.h"

/// run the parameritized query:
/// ```sql
/// SELECT base_url FROM fhir WHERE id = `fhir_key`
/// ```
/// @param db - the database pointer
/// @param fhir_key - the pkey of the fhir row
/// @return - the base_url, or NULL if there is an error. CALLER MUST FREE THE POINTER!!!
char *select_base_url(sqlite3 *db, const char *fhir_key) 
{
    size_t len = strlen(fhir_key);
    if (len < 2 || fhir_key[0] != '\'' || fhir_key[len - 1] != '\'')
    {
        printf("Incorrect module usage: fetch() requires a quoted string argument for arg 0 to denote the fhir server pkey.\n");
        return NULL;
    }
    
    char trimmed_fhir_key[len - 1];
    memcpy(trimmed_fhir_key, fhir_key + 1, len - 2);
    trimmed_fhir_key[len - 2] = '\0';
    
    sqlite3_stmt *stmt;
    const char *query = "SELECT base_url FROM fhir WHERE id = ?";
    if (sqlite3_prepare_v2(db, query, -1, &stmt, NULL) != SQLITE_OK)
    {
        printf("Failed to SELECT \"base_url\" from pkey: %s\n", trimmed_fhir_key);
        return NULL;
    }
    
    if (sqlite3_bind_text(stmt, 1, trimmed_fhir_key, -1, SQLITE_TRANSIENT) != SQLITE_OK)
    {
        printf("Failed to bind fhir key: %s\n", sqlite3_errmsg(db));
        sqlite3_finalize(stmt);
        return NULL;
    }
    
    char *base_url = NULL;
    int rc = sqlite3_step(stmt);
    if (rc == SQLITE_ROW)
    {
        // Retrieve the base_url result
        const char *url = (const char *)sqlite3_column_text(stmt, 0);
        if (url)
        {
            // dynamic allocation here -- CALLER HAS TO FREE
            base_url = sqlite3_mprintf("%s", url);
        }
    }
    else if (rc == SQLITE_DONE)
    {
        printf("No matching fhir_key found.\n");
    }
    else
    {
        printf("Error executing query: %s\n", sqlite3_errmsg(db));
    }
    
    sqlite3_finalize(stmt);
    return base_url;
}


int setup_fetch_config(sqlite3 *db) {
    char *err_msg = NULL;
    const char *ct_sql =
        "CREATE TABLE IF NOT EXISTS fhir ("
        "   id TEXT PRIMARY KEY NOT NULL,"
        "   base_url TEXT NOT NULL"
        ");";
    
    if (sqlite3_exec(db, ct_sql, NULL, NULL, &err_msg) != SQLITE_OK) {
        printf("setup_fetch_config(): Error creating table: %s\n", err_msg);
        sqlite3_free(err_msg);
        return SQLITE_ERROR;
    }
    
    return SQLITE_OK;
}

/**
 * connect - Initializes the virtual table
 */
int medfetch_connect(
    sqlite3 *db, void *pAux, int argc, const char *const *argv,
    sqlite3_vtab **ppVtab, char **pzErr)
{
    if (argc < 4)
    {
        *pzErr = sqlite3_mprintf("fetch: incorrect usage, requires at least 2 args.", argc - 3);
        return SQLITE_ERROR;
    }

    medfetch_vtab *vtab = (medfetch_vtab *)sqlite3_malloc(sizeof(medfetch_vtab));
    if (vtab == NULL)
        return SQLITE_NOMEM;

    vtab->db = db;

    const char *fhir_key = argv[3];
    char *base_url = select_base_url(db, fhir_key);
    if (base_url == NULL) {
        return SQLITE_ERROR;
    }
    vtab->base_url = base_url;

    const char *raw_resource = argv[4];
    if (raw_resource[0] == '\'' && raw_resource[strlen(raw_resource) - 1] == '\'')
    {
        vtab->resource = sqlite3_mprintf("%.*s", (int)strlen(raw_resource) - 2, raw_resource + 1);
    }
    else
    {
        printf("Error: fetch() requires a quoted string argument at arg 1.\n");
        return SQLITE_ERROR;
    }
    
    // DEFAULT TO -1, which indicates get me ALL resources
    int n_dec = -1;
    if (argc > 5 && argv[5] != NULL)
    {
        const char *n_enc = argv[5];
        if (parse_int(n_enc, &n_dec) != 0)
        {
            printf("Error: couldn't parse 'n'\n");
            return SQLITE_ERROR;
        }
    }
    vtab->n = n_dec;

    *ppVtab = (sqlite3_vtab *) vtab;
    int rc = sqlite3_declare_vtab(db, "CREATE TABLE x(row TEXT);");
    if (rc != SQLITE_OK)
    {
        sqlite3_free(vtab);
    }
    return rc;
}

/**
 * fetch_disconnect - Cleans up virtual table memory
 */
int medfetch_disconnect(sqlite3_vtab *pVtab)
{
    medfetch_vtab *vtab = (medfetch_vtab *)pVtab;
    if (vtab)
    {
        if (vtab->resource)
            sqlite3_free(vtab->resource);
        if (vtab->base_url)
            sqlite3_free(vtab->base_url);

        sqlite3_free(vtab);
    }
    return SQLITE_OK;
}

/**
 * fetch_open - Creates a new cursor
 */
int medfetch_open(sqlite3_vtab *pVtab, sqlite3_vtab_cursor **ppCursor)
{
    medfetch_cursor *cur = (medfetch_cursor *)sqlite3_malloc(sizeof(medfetch_cursor));
    if (cur == NULL)
        return SQLITE_NOMEM;

    memset(cur, 0, sizeof(medfetch_cursor));
    cur->stmt = NULL;
    *ppCursor = (sqlite3_vtab_cursor *)cur;
    return SQLITE_OK;
}

int medfetch_close(sqlite3_vtab_cursor *cur)
{
    medfetch_cursor *fc = (medfetch_cursor *)cur;

    if (!fc)
    {
        return SQLITE_OK;
    }

    if (fc->stmt)
    {
        sqlite3_finalize(fc->stmt);
        fc->stmt = NULL;
    }

    sqlite3_free(fc);

    return SQLITE_OK;
}

/**
 * todo
 */
int medfetch_best_index(sqlite3_vtab *pVtab, sqlite3_index_info *pIdxInfo)
{
    return SQLITE_OK;
}

/**
 * fetch_next - Moves to the next row in the query
 */
int medfetch_next(sqlite3_vtab_cursor *cur)
{
    medfetch_cursor *fc = (medfetch_cursor *)cur;

    int rc = sqlite3_step(fc->stmt);

    if (rc == SQLITE_ROW)
    {
        return SQLITE_OK;
    }
    else if (rc == SQLITE_DONE)
    {
        sqlite3_finalize(fc->stmt);
        fc->stmt = NULL;

        return SQLITE_OK;
    }
    else
    {
        return SQLITE_ERROR;
    }
}

/**
 * fetch_eof - Checks if we've reached the end of rows
 */
int medfetch_eof(sqlite3_vtab_cursor *cur)
{
    medfetch_cursor *fc = (medfetch_cursor *)cur;
    int is_eof = (fc->stmt == NULL);
    return is_eof;
}

/**
 * fetch_column - Retrieves a column value
 */
int medfetch_column(sqlite3_vtab_cursor *cur, sqlite3_context *ctx, int i)
{
    medfetch_cursor *fc = (medfetch_cursor *)cur;

    if (fc->stmt == NULL)
    {
        return SQLITE_ERROR;
    }

    const char *data = (const char *)sqlite3_column_text(fc->stmt, i);
    sqlite3_result_text(ctx, data, -1, SQLITE_TRANSIENT);

    return SQLITE_OK;
}

/**
 * fetch_rowid - Required for row-based queries
 */
int medfetch_rowid(sqlite3_vtab_cursor *cur, sqlite_int64 *pRowid)
{
    *pRowid = 0;
    return SQLITE_OK;
}

