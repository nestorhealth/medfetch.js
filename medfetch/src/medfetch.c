#include "sqlite3ext.h"
SQLITE_EXTENSION_INIT1

#include "buffer.c"
#include "search.c"
#include "intr.c"
#include <stdio.h>
#include <jansson.h>
#include <string.h>
#include <emscripten/fetch.h>

typedef struct
{
    sqlite3_vtab base;

    sqlite3 *db;
    int n;
    char *resource; char *base_url;
} medfetch_vtab;

typedef struct
{
    sqlite3_vtab_cursor base;
    sqlite3_stmt *stmt;
} medfetch_cursor;


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

static void on_ok(emscripten_fetch_t *fetch) {
    if (!fetch->userData) {
        emscripten_fetch_close(fetch);
        return;
    }
    fhir_intr_t *wb = fetch->userData;
    if (!wb->response || !wb->response->buf) {
        emscripten_fetch_close(fetch);
        return;
    }
    char *buf = realloc(wb->response->buf, wb->response->size + fetch->numBytes + 1);
    if (!buf) {
        emscripten_fetch_close(fetch);
        return;
    }
    wb->response->buf = buf;
    memcpy(wb->response->buf + wb->response->size, fetch->data, fetch->numBytes);
    wb->response->size += fetch->numBytes;
    wb->response->buf[wb->response->size] = 0;
    printf("response successfully written back to\n");

    emscripten_fetch_close(fetch);
}

static void on_notok(emscripten_fetch_t *fetch) {
    printf("uh oh....!!!\n");
    emscripten_fetch_close(fetch);
}

static int setup_fetch(emscripten_fetch_attr_t *attr, fhir_intr_t *intr) {
    if (!intr) {
        return 1;
    }
    strcpy(attr->requestMethod, "GET");
    attr->attributes = EMSCRIPTEN_FETCH_LOAD_TO_MEMORY;
    attr->userData = intr;
    attr->onsuccess = on_ok;
    attr->onerror = on_notok;
    return 0;
}

static int fetch_f(fhir_intr_t *intr) {
    if (!intr) {
        return 1;
    }
    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    setup_fetch(&attr, intr);
    emscripten_fetch(&attr, intr->next);

    return 0;
}

static int medfetch_filter(
    sqlite3_vtab_cursor *cur, int idxNum, const char *idxStr,
    int argc, sqlite3_value **argv) {
    
    if (!cur || !cur->pVtab) {
        return SQLITE_ERROR;
    }
    medfetch_cursor *fc = (medfetch_cursor *) cur;
    medfetch_vtab *vtab = (medfetch_vtab *) cur->pVtab;

    fhir_intr_t *search = fhir_search(vtab->base_url, vtab->resource, fetch_f);
    if (!search) {
        return SQLITE_ERROR;
    }
    json_t *resources = search_minpg(search, vtab->n, 250);
    fhir_search_free(search);
    if (!resources) {
        printf("Network request to API failed\n");
        return SQLITE_ERROR;
    }

    char *serialized = json_dumps(resources, JSON_INDENT(2));
    if (!serialized) {
        fprintf(stderr, "resources could not be serialized!\n");
        json_decref(resources);
        return SQLITE_ERROR;
    }
    json_decref(resources);

    char *sql = sqlite3_mprintf(
        "SELECT value AS row FROM json_each('%q')",
        serialized);
    free(serialized);

    if (sqlite3_prepare_v2(vtab->db, sql, -1, &fc->stmt, NULL) != SQLITE_OK)
    {
        printf("sqlite3_prepare_v2 failed: %s\n", sqlite3_errmsg(vtab->db));
        sqlite3_free(sql);
        return SQLITE_ERROR;
    }

    sqlite3_free(sql);

    int rc = sqlite3_step(fc->stmt);
    if (rc == SQLITE_ROW)
    {
        return SQLITE_OK;
    }
    else
    {
        printf("err %s\n", sqlite3_errmsg(vtab->db));
        return SQLITE_DONE;
    }
}

/**
 * .load .ads
 * insert into fhir values ('r4', 'https://r4.smarthealthit.org/');
 * CREATE VIRTUAL TABLE Patient USING MEDFETCH('r4', 'Patient');
 */
int medfetch_connect(
    sqlite3 *db, void *pAux, int argc, const char *const *argv,
    sqlite3_vtab **ppVtab, char **pzErr) {
    if (argc < 4)
    {
        *pzErr = sqlite3_mprintf("fetch: incorrect usage, requires at least 2 args.", argc - 3);
        return SQLITE_ERROR;
    }

    medfetch_vtab *vtab = (medfetch_vtab *) sqlite3_malloc(sizeof(medfetch_vtab));
    if (vtab == NULL)
        return SQLITE_NOMEM;

    vtab->db = db;

    const char *fhir_key = argv[3];
    char *base_url = select_base_url(db, fhir_key);
    if (base_url == NULL) {
        printf("No entry found for the fhir server: %s\n", fhir_key);
        return SQLITE_ERROR;
    }
    vtab->base_url = base_url;

    emscripten_fetch_attr_t attr;
    emscripten_fetch_attr_init(&attr);
    memcpy(attr.requestMethod, "GET", 4);

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

static sqlite3_module medfetch_module = {
    0, /* iVersion */
    medfetch_connect, /* xCreate */
    medfetch_connect, /* xConnect */
    medfetch_best_index, /* xBestIndex */
    medfetch_disconnect, /* xDisconnect */
    medfetch_disconnect, /* xDestroy */
    medfetch_open, /* xOpen - open a cursor */
    medfetch_close, /* xClose - close a cursor */
    medfetch_filter, /* xFilter - configure scan constraints */
    medfetch_next, /* xNext - advance a cursor */
    medfetch_eof, /* xEof - check for end of scan */
    medfetch_column, /* xColumn - read data */
    medfetch_rowid, /* xRowid - read data */
    0, /* xUpdate */
    0, /* xBegin */
    0, /* xSync */
    0, /* xCommit */
    0, /* xRollback */
    0, /* xFindMethod */
    0, /* xRename */
    0, /* xSavepoint */
    0, /* xRelease */
    0, /* xRollbackTo */
    0  /* xShadowName */
};

int sqlite3_medfetch_init(sqlite3 *db, char **pzErrMsg, const sqlite3_api_routines *pApi) {
    int rc = SQLITE_OK;
    SQLITE_EXTENSION_INIT2(pApi);
    rc += setup_fetch_config(db);
    if (rc != SQLITE_OK) {
        *pzErrMsg = sqlite3_mprintf("Failed to initialize auxilliary fetch_config table.");
        return SQLITE_ERROR;
    }
    rc += sqlite3_create_module(db, "medfetch", &medfetch_module, 0);

    return rc;
}

