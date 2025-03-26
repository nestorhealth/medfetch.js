#ifndef MEDFETCH_COMMON_H
#define MEDFETCH_COMMON_H

#include <sqlite3ext.h>
extern const sqlite3_api_routines *sqlite3_api;

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

char *select_base_url(sqlite3 *db, const char *fhir_id);

int setup_fetch_config(sqlite3 *db);

/**
 * write the virtual table into sqlite3
 */
int medfetch_connect(
    sqlite3 *db, void *pAux, int argc, const char *const *argv,
    sqlite3_vtab **ppVtab, char **pzErr);

/**
 * free resources
 */
int medfetch_disconnect(sqlite3_vtab *pVtab);

/**
 * make a cursor
 */
int medfetch_open(sqlite3_vtab *pVtab, sqlite3_vtab_cursor **ppCursor);

int medfetch_close(sqlite3_vtab_cursor *cur);

int medfetch_best_index(sqlite3_vtab *pVtab, sqlite3_index_info *pIdxInfo);

int medfetch_next(sqlite3_vtab_cursor *cur);

int medfetch_eof(sqlite3_vtab_cursor *cur);

int medfetch_column(sqlite3_vtab_cursor *cur, sqlite3_context *ctx, int i);

int medfetch_rowid(sqlite3_vtab_cursor *cur, sqlite_int64 *pRowid);

#endif /* MEDFETCH_COMMON */
