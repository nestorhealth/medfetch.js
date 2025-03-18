#ifndef FHIR_SEARCH_H
#define FHIR_SEARCH_H

/**
 * Search operation functions
 * 
 * KNOW THE DIFFERENCE!
 *
 * prepared search statements begin with
 * search_ 
 *
 * state reads / writes to the intr struct begin with
 * fhir_search_
 *
 */

#include "intr.h"

fhir_intr_t *fhir_search(const char *base_url, const char *resource_type, fetch_fn f);

/**
 * Initialize the 'next' url for the given search interaction
 * to begin iterating over the pages.
 * 
 * @param intr the search interaction
 * @returns 0 on success, -1 otherwise
 */
int fhir_search_begin(fhir_intr_t *intr);

/**
 * Get the next known page count from
 * the given interaction state
 * 
 *  OK:(intr->page + 1 when intr->page == 0 or intr->next != NULL)
 *  ERROR:(-1 when search->next == NULL)
 * 
 * @param intr the interaction state
 * @returns intr->page + 1 when next != null or page == 0
 *          -1 on end
 */
int fhir_search_end(fhir_intr_t *intr);

/**
 * Bundle "foreach" function typedef
 * 
 * @param acc the user accumulator pointer
 * @param bundle the search result
 * @returns 0 on success. return anything else to signal to break out of the loop
 */
typedef int (*fhir_bundle_iterf) (void *acc, const json_t *bundle, int index);

/**
 * a reducer/left fold like function that writes back
 * to the user init pointer passed (hence the 'w')
 * 
 * @param search the search interaction
 * @param init user writeback pointer
 * @param f the fhir_bundle_iterf function, see the typedef
 * @returns 0 on success, 1 on error
 */
int fhir_search_foldw(fhir_intr_t *search, void *init, fhir_bundle_iterf f);

/* BEGIN "PREPARED" SEARCH FUNCTIONS */

/**
 * Runs the search: [base]/[type]/?_summary=count
 * Pretty is false here since this just returns the count.
 * @param base_url the server
 * @param resource_type the resource type to count
 * @returns 0 if the resource type could not be found or if the server
 *          actually has 0 of that resource. Otherwise return some positive int.
 */
int search_sumcount(const char *base_url, const char *resource_type);

/**
 * Get back the maximum Bundle entries from a server using a fixed
 * arbitrary limit of 99999 or something like that. So if this returns
 * 'p', then per page, the server can return at most 'p' resources in
 * the entries.
 *
 * @param base_url the server
 * @param resource_type the resource type to count
 * @returns 0 if the resource type could not be found or if the server
 *          actually has 0 of that resource. Otherwise return some positive int.
 */
int search_pgmax(const char *base_url, const char *resource_type);

/**
 * Run a min page search to get n resources
 * 
 * tries to minimize the # pages polled,
 * ie it tries to achieve min(search->page)
 * 
 * @param base_url the base url
 * @param resource_type the resource type
 * @param n the number of resources to fetch
 * @param pagemax the max number of MATCHES per page (if you use a valid _include you WILL get more)
 * @returns NULL on error, pointer to json resources array otherwise
 */
json_t *search_minpg(const char *base_url, const char *resource_type, int n, size_t pagemax);

#endif
