/**
 * public api header file
 */

#ifndef CFHIR_H
#define CFHIR_H

#include <cfhir/buffer.h>
#include <cfhir/intr.h>
#include <cfhir/search.h>

#pragma GCC visibility push(hidden)

int fhir_intr_step(fhir_intr_t *intr);
int fhir_intr_json(fhir_intr_t *intr);

/// Parse a `string` representation of an `int` using strtol.
int parse_int(const char *str, int *out) __attribute__((visibility("default")));

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
int search_pgmax(const char *base_url, const char *resource_type) __attribute__((visibility("default")));

fhir_intr_t *fhir_search(const char *base_url, const char *resource_type, fetch_fn f) __attribute__((visibility("default")));
int fhir_search_free(fhir_intr_t *search) __attribute__((visibility("default")));

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
json_t *search_minpg(fhir_intr_t *search, int n, size_t pagemax) __attribute__((visibility("default")));

#pragma GCC visibility pop

#endif /* CFHIR_H */
