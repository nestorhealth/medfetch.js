#include "sqlite3ext.h"
SQLITE_EXTENSION_INIT1

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <jansson.h>
#include <cfhir.h>
#include <curl/curl.h>

static size_t write_response(char *data, size_t size,
                             size_t nmemb, void *v_chunk) {
    size_t realsize = size * nmemb;
    response_t *res = (response_t *)v_chunk;
    if (res == NULL) {
        return 0;
    }

    char *ptr = realloc(res->buf, res->size + realsize + 1);
    if (!ptr)
        return 0;

    res->buf = ptr;
    memcpy(&(res->buf[res->size]), data, realsize);
    res->size += realsize;
    res->buf[res->size] = 0;
    return realsize;
}

static int curl_fn(fhir_intr_t *intr) {
    curl_global_init(CURL_GLOBAL_DEFAULT);
    if (!intr) {
        curl_global_cleanup();
        return 1;
    }
    CURL *curl = curl_easy_init();
    curl_easy_setopt(curl, CURLOPT_URL, intr->next);
    struct curl_slist *headers = NULL;
    headers = curl_slist_append(headers, "Accept: application/json+fhir");
    headers = curl_slist_append(headers, "Content-Type: application/json+fhir");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
    curl_easy_setopt(curl, CURLOPT_USERAGENT, "libcurl-agent/1.0");
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, write_response);

    // caller should expect intr->response to exist if called from
    // the ctor function fhir_search()
    if (!intr->response)
        return 1;
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *) intr->response);

    CURLcode res = curl_easy_perform(curl);
    int rc = 0;
    // doesn't need to worry about freeing intr fields 
    if (res != CURLE_OK) {
        fprintf(stderr, "Bad response from server\n");
        rc = 1;
    }
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    curl_global_cleanup();
    return rc;
}

#define MEDFETCH_CREATE NULL
#define MEDFETCH_DESTROY NULL

typedef struct {
    sqlite3_vtab base;

    const char *base_url;
} medfetch_vtab;

typedef struct {
    sqlite3_vtab_cursor base;
    int index;
    json_t *rows;
} medfetch_cursor;

static const char *json_id_string(const json_t *curr) {
    json_t *id = json_object_get(curr, "id");
    if (!id || !json_is_string(id))
        return NULL;
    return json_string_value(id);
}

static int xconnect(
    sqlite3 *pdb, void *paux, int argc, const char *const *argv,
    sqlite3_vtab **pp_vtab, char **pz_err)
{
    int rc = SQLITE_OK;
    rc += sqlite3_declare_vtab(pdb, "CREATE TABLE resource(id TEXT, json TEXT, type HIDDEN)");
    if (rc == SQLITE_OK) {
        medfetch_vtab *vtab = sqlite3_malloc(sizeof(medfetch_vtab));
        if (vtab == NULL)
            return SQLITE_NOMEM;
        memset(vtab, 0, sizeof(medfetch_vtab));
        vtab->base_url = (const char *) paux;
        *pp_vtab = (sqlite3_vtab *) vtab;
    }
    return rc;
}

static int xbest_index(sqlite3_vtab *pvtab, sqlite3_index_info *index_info) {
    for (int i = 0; i < index_info->nConstraint; i++) {
        index_info->aConstraintUsage[i].argvIndex = 1;
        index_info->aConstraintUsage[i].omit = 1;
    }
    return SQLITE_OK;
}

static int xdisconnect(sqlite3_vtab *pvtab) {
    return SQLITE_OK;
}

static int xopen(sqlite3_vtab *pvtab, sqlite3_vtab_cursor **pp_cursor) {
    medfetch_cursor *cur = sqlite3_malloc(sizeof(medfetch_cursor));
    if (cur == NULL)
        return SQLITE_NOMEM;
    memset(cur, 0, sizeof(medfetch_cursor));
    cur->index = 0;
    *pp_cursor = (sqlite3_vtab_cursor *) cur;
    (*pp_cursor)->pVtab = pvtab;
    return SQLITE_OK;
}

static int xnext(sqlite3_vtab_cursor *pcursor) {
    ((medfetch_cursor *) pcursor) -> index++;
    return SQLITE_OK;
}

static int xeof(sqlite3_vtab_cursor *pcursor) {
    medfetch_cursor *cursor = (medfetch_cursor *) pcursor;
    return cursor->index >= json_array_size(cursor->rows);
}

static int xcolumn(sqlite3_vtab_cursor *pcursor, sqlite3_context *pctx, int icol) {
    medfetch_cursor *cursor = (medfetch_cursor *) pcursor;
    const json_t *row = json_array_get(cursor->rows, cursor->index);
    if (!row)
        return SQLITE_ERROR;
    switch(icol) {
        case(0): {
            const char *id = json_id_string(row);
            sqlite3_result_text(pctx, id, -1, SQLITE_TRANSIENT);
        }
        case(1): {
            sqlite3_result_text(pctx, json_dumps(row, NULL), -1, SQLITE_TRANSIENT);
        }
    }
    return SQLITE_OK;
}

static int xrowid(sqlite3_vtab_cursor *pcursor, sqlite3_int64 *prowid) {
    *prowid = ((medfetch_cursor *) pcursor) -> index;
    return SQLITE_OK;
}

static int xfilter(
    sqlite3_vtab_cursor *cur, int idxNum, const char *idxStr,
    int argc, sqlite3_value **argv) {
    if (argc != 1)
        return SQLITE_ERROR;

    if (!cur || !cur->pVtab)
        return SQLITE_ERROR;

    medfetch_cursor *cursor = (medfetch_cursor *) cur;
    medfetch_vtab *vtab = (medfetch_vtab *) cur->pVtab;
    if (!vtab || !vtab->base_url)
        return SQLITE_ERROR;

    const unsigned char *resource = sqlite3_value_text(argv[0]);
    if (!resource)
        return SQLITE_ERROR;
    fhir_intr_t *search = fhir_search(vtab->base_url, (const char *) resource, curl_fn);
    if (!search)
        return SQLITE_NOMEM;
    json_t *result = search_minpg(search, -1, 250);
    if (!result) {
        fhir_search_free(search);
        return SQLITE_ERROR;
    }
    cursor->rows = result;
    return SQLITE_OK;
}

static int xclose(sqlite3_vtab_cursor *cur) {
    medfetch_cursor *cursor = (medfetch_cursor *) cur;
    if (!cursor) {
        return SQLITE_OK;
    }
    sqlite3_free(cur);
    return SQLITE_OK;
}

// Register the virtual table module
static sqlite3_module medfetch = { 
    0,                                        // iVersion
    MEDFETCH_CREATE,
    xconnect,                                 
    xbest_index,
    xdisconnect,
    MEDFETCH_DESTROY,
    xopen,
    xclose,
    xfilter,
    xnext,
    xeof,
    xcolumn,
    xrowid,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    NULL
};

/**
 * initialize medfetch on curl!
 */
int sqlite3_medfetch_init(sqlite3 *db, char **pzErrMsg, const sqlite3_api_routines *pApi) {
    SQLITE_EXTENSION_INIT2(pApi);
    return sqlite3_create_module(db, "medfetch", &medfetch, "https://r4.smarthealthit.org/");
}
