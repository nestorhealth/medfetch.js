#include "intr.h"
#include "search.h"
#include <jansson.h>
#include <stdlib.h>
#include <string.h>

#define MAX_COUNT 99999

fhir_intr_t *fhir_search(const char *base_url, const char *resource_type, fetch_fn f) {
    fhir_intr_t *intr = malloc(sizeof(fhir_intr_t));
    if (!intr) {
        return NULL;
    }

    size_t size = strlen(base_url) + strlen(resource_type) + 1;
    if (size > MAX_URL_SIZE) {
        free(intr);
        return NULL;
    }
    char *next = malloc(strlen(base_url) + strlen(resource_type) + 1);
    if (!next) {
        free(intr);
        return NULL;
    }
    int bytes = snprintf(next, size, "%s%s", base_url, resource_type);
    if (bytes > MAX_URL_SIZE) {
        free(next);
        free(intr);
        return NULL;
    }

    *intr = (fhir_intr_t) {
        .mode = INTR_SEARCH,
        .base_url = base_url,
        .resource_type = resource_type,
        .id = NULL,

        .fetch = f,

        .gen_params = NULL,
        .search_params = NULL,
        .json = NULL,
        .response = NULL,
        .next = next,
    };
    return intr;
}

int fhir_search_free(fhir_intr_t *search) {
    int count = 0;
    if (!search) {
        return 0;
    }
    if (search->json) {
        json_decref(search->json);
        search->json = NULL;
        count++;
    }
    if (search->response) {
        if (search->response->buf) {
            free(search->response->buf);
            count++;
        }
        free(search->response);
        count++;
    }

    return count;
}

int search_set_params(fhir_intr_t *search, gen_params_t *gen_params, search_params_t *search_params) {
    if (!search) {
        return 1;
    }

    search->gen_params = gen_params;
    search->search_params = search_params;

    return 0;
}

// 0 on ok, -1 otherwise
int fhir_search_begin(fhir_intr_t *search) {
    if (!search)
        return -1;
    buffer_t *url = fhir_intr_url(search);
    if (!url)
        return -1;
    search->next = url->data;
    search->page = 0;
    // now caller is in charge of freeing
    // search->next
    free(url);
    return search->page;
}

int fhir_search_end(fhir_intr_t *search) {
    if (search->page == 0) {
        return 1;
    }
    if (search->next != NULL) {
        return search->page + 1;
    } else {
        return -1; // could do search->page but just to be sure lol
    }
}


/**
 * Accumulate results from the bundle result
 * of the given search result and write back to
 * the user pointer init
 * 
 * fhir_search_foldw(search, init, f) = page count,
 * when for each search->json state, f(search->json),
 * otherwise -1 on error
 */
int fhir_search_foldw(fhir_intr_t *search, void *init, fhir_bundle_iterf f) {
    if (!search || !init) {
        return 1;
    }

    for (int i = fhir_search_begin(search); i < fhir_search_end(search); i++) {
        if (fhir_intr_step(search)) return 1;
        if (fhir_intr_json(search)) return 1;
        if(f(init, search->json, i)) return 1;
    }
    return 0;
}


/// GET [base]/[type]?_summary=count(&_pretty=false)
int search_sumcount(const char *base_url, const char *resource_type) {
    if (base_url == NULL || resource_type == NULL)
        return -1;

    gen_params_t gparams = GEN_PARAMS(false, _SUMMARY_COUNT, NULL, NULL);
    fhir_intr_t search = fhir_intr_make(INTR_SEARCH, base_url, resource_type, NULL, &gparams, NULL, NULL, NULL, NULL, 0);
    if (fhir_intr_step(&search))
        return -2;
    if (fhir_intr_json(&search)) {
        free_n(2, search.response->buf, search.response);
        return -2;
    }
    json_int_t total = json_integer_value(json_object_get(search.json, "total"));

    // network + json parse went ok, so don't consider a count of 0 as an error
    // but just as the fact that the server has 0 resources of type resource_type
    if (total < 0)
        return 0;
    
    json_decref(search.json);
    free_n(2, search.response->buf, search.response);
    return total;
}

/// GET [base]/[type]?_count=MAX_COUNT(&_summary=true&_pretty=false)
__attribute__((visibility("default")))
int search_pgmax(const char *base_url, const char *resource_type) {
    if (base_url == NULL || resource_type == NULL) {
        return -1;
    }

    // small optimization: set _pretty = false and _summary = true to minimize payload size
    gen_params_t gparams = GEN_PARAMS(false, _SUMMARY_TRUE, NULL, NULL);
    search_params_t sparams = SEARCH_PARAMS(MAX_COUNT, _CONTAINED_FALSE, _CONTAINED_TYPE_CONTAINER, NULL, NULL, NULL);
    fhir_intr_t search = fhir_intr_make(INTR_SEARCH, base_url, resource_type, NULL, 
                                        &gparams, &sparams, NULL, NULL, NULL, 0);
    
    if(fhir_search_begin(&search)) {
        return -1;
    }

    if (fhir_intr_step(&search)) {
        return -1;
    }

    if (fhir_intr_json(&search)) {
        free_n(2, search.response->buf, search.response);
        return -1;
    }
    
    size_t size = json_array_size(
        json_object_get(search.json, "entry")
    );
    
    json_decref(search.json);
    free_n(3, search.response->buf, search.response, search.next);
    return size;
}

/// runs [base]/[type]?_count={pagemax}
/// returns NULL on error, or the json array with len min(n, sumcount()) 
__attribute__((visibility("default")))

json_t *search_minpg(const char *base_url, const char *resource_type, int n, size_t pagemax) {
    if (!base_url || !resource_type)
        return NULL;
    int count = 0;
    json_t *acc = json_array();

    if (!acc) {
        return NULL;
    }
    gen_params_t gparams = GEN_PARAMS(false, _SUMMARY_FALSE, NULL, NULL);
    search_params_t sparams = SEARCH_PARAMS(pagemax, _CONTAINED_FALSE, _CONTAINED_TYPE_CONTAINER, 
                                            NULL, NULL, NULL);
    fhir_intr_t search = fhir_intr_make(INTR_SEARCH, base_url, resource_type, NULL,
                                        &gparams, &sparams, NULL, NULL, NULL, 0);

    for (int i = fhir_search_begin(&search); i < fhir_search_end(&search); i++) {
        if(fhir_intr_step(&search)) {
            json_decref(acc);
            return NULL;
        }
        if (fhir_intr_json(&search)) {
            json_decref(acc);
            return NULL;
        }

        json_t *entries = json_object_get(search.json, "entry");
        if (!entries || !json_is_array(entries)) {
            json_decref(acc);
            return NULL;
        }
        size_t j;
        json_t *entry;
        json_array_foreach(entries, j, entry) {
            json_t *resource = json_object_get(entry, "resource");
            if (!resource) {
                json_decref(acc);
                return NULL;
            }
            if (count++ == n) {
                if (search.json) {
                    json_decref(search.json);
                }
                if (search.response) {
                    if (search.response->buf)
                        free(search.response->buf);
                    free(search.response);
                }
                if (search.next)
                    free(search.next);
                return acc;
            }
            json_array_append(acc, resource);
        }
    }
    if (search.json) {
        json_decref(search.json);
    }
    if (search.response) {
        if (search.response->buf)
            free(search.response->buf);
        free(search.response);
    }
    if (search.next)
        free(search.next);
    return acc;
}
