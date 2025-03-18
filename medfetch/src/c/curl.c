#include <sqlite3ext.h>
SQLITE_EXTENSION_INIT1

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <jansson.h>
#include <curl/curl.h>

#include <cfhir.h>
#include "common.h"

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
    if (!intr->response) {
        return 1;
    }
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *) intr->response);

    CURLcode res = curl_easy_perform(curl);
    int rc = 0;
    // doesn't need to worry about freeing intr fields 
    if (res != CURLE_OK) {
        printf("%s\n", curl_easy_strerror(res));
        rc = 1;
    }
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    curl_global_cleanup();
    return rc;
}

/**
 * Iniitalize the fetch_config table needed
 * to get the base_url context
 */
/**
 * what is called when a SELECT is called on the vtable
 */
static int filter_curl(
    sqlite3_vtab_cursor *cur, int idxNum, const char *idxStr,
    int argc, sqlite3_value **argv)
{
    if (!cur || !cur->pVtab)
        return SQLITE_ERROR;

    medfetch_cursor *fc = (medfetch_cursor *)cur;
    medfetch_vtab *vtab = (medfetch_vtab *)cur->pVtab;

    if (!vtab || !vtab->resource || !vtab->db)
        return SQLITE_ERROR;

    if (!vtab->base_url || strlen(vtab->base_url) == 0)
    {
        return SQLITE_ERROR;
    }

    fhir_intr_t *search = fhir_search(vtab->base_url, vtab->resource, curl_fn);
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

// Register the virtual table module
static sqlite3_module medfetch = { 0, 
    medfetch_connect, medfetch_connect, 
    medfetch_best_index, medfetch_disconnect,
    medfetch_disconnect, medfetch_open, 
    medfetch_close, filter_curl, 
    medfetch_next, medfetch_eof, medfetch_column,
    medfetch_rowid, NULL, NULL, NULL, NULL, NULL, NULL
};

/**
 * initialize medfetch on curl!
 */
int sqlite3_medfetch_init(sqlite3 *db, char **pzErrMsg, const sqlite3_api_routines *pApi)
{
    SQLITE_EXTENSION_INIT2(pApi);

    // CREATE TABLE fetch_config (key TEXT, value TEXT) execution
    if (setup_fetch_config(db) != SQLITE_OK)
    {
        *pzErrMsg = sqlite3_mprintf("Failed to initialize auxilliary fetch_config table.");
        return SQLITE_ERROR;
    }

    return sqlite3_create_module(db, "medfetch", &medfetch, NULL);
}
