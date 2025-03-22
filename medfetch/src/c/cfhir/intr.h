#ifndef FHIR_INTR_H
#define FHIR_INTR_H

#define CURL_STATICLIB

#include "buffer.h"

/// first thing i found when i googled max url length (lol)
#define MAX_URL_SIZE 4096

/* general search parameters and the "search" search parameters
   are both just querystrings in a URL, so just lump their
   macros together */

#define ROUTE_METADATA "metadata"

#define BUNDLE_LINK_NEXT "next"

/// key in `?_format=$`
#define PARAM_KEY_FORMAT "_format"
/// key in `?_pretty=$`
#define PARAM_KEY_PRETTY "_pretty"
/// key in `?_summary=$`
#define PARAM_KEY_SUMMARY "_summary"
#define PARAM_KEY_ELEMENTS "_elements"
#define PARAM_KEY_COUNT "_count"
#define PARAM_KEY_CONTAINED "_contained"
#define PARAM_KEY_CONTAINED_TYPE "_containedType"
#define PARAM_KEY_SORT "_sort"
#define PARAM_KEY_INCLUDE "_include"
#define PARAM_KEY_REVINCLUDE "_revinclude"

#define MAX_ELEMENTS_QUERYSTRING_LEN 2000
/// limit to 5 digits (can't imagine wanting to get >= 100,000 in one go)
#define MAX_COUNT_DIGITS 5

#define MACRO_STRLEN(KEY) \
    (sizeof(KEY) - 1)

#define GEN_PARAM_TOTAL 4
#define SEARCH_PARAM_TOTAL 8

/* Define the literal "true" and "false" strings without tying them 
   to a specific parameter type since they're used quite often
   by different params. */
#define PARAM_VALUE_TRUE "true"
#define PARAM_VALUE_FALSE "false"

/* `_summary` value macros */
/// `_summary=text` param
/// return only elements { 'text', 'id', 'meta' } +
/// top level mandatory elements
#define PARAM_VALUE_SUMMARY_TEXT "text"
/// `_summary=data` param
/// remove the 'text' element
#define PARAM_VALUE_SUMMARY_DATA "data"
/// `_summary=count` param
/// return only the count of matches without returning
/// the matches themselves
#define PARAM_VALUE_SUMMARY_COUNT "count"

/// the only `_contained=` parameter that is NOT
/// "true" or "false"
#define PARAM_VALUE_CONTAINED_BOTH "both"

/* `_containedType` macros */
#define PARAM_VALUE_CONTAINED_TYPE_CONTAINER "container"
#define PARAM_VALUE_CONTAINED_TYPE_CONTAINED "contained"

/// static kv_str2 struct value so you don't have to malloc.
/// ONLY for use with parameters with a fixed set of outputs
#define PARAM_KV(KEY, VALUE) \
    ((kv_str2_t){ .key = (KEY), .key_len = MACRO_STRLEN((KEY)), .value = (VALUE), .value_len = MACRO_STRLEN((VALUE)) })

#include <stdbool.h>

/**
 * Enums for the [_total](https://hl7.org/fhir/R4/search.html#total) search param.
 */
enum _TOTAL_PARAM_ENUM {
    _TOTAL_NONE, // DEFAULT
    _TOTAL_ESTIMATE,
    _TOTAL_ACCURATE
};
typedef enum _TOTAL_PARAM_ENUM _TOTAL_PARAM;

/**
 * Enums for the [_contained](https://hl7.org/fhir/R4/search.html#contained) search param.
 */
enum _CONTAINED_PARAM_ENUM {
    _CONTAINED_FALSE, // DEFAULT
    _CONTAINED_TRUE,
    _CONTAINED_BOTH
};
typedef enum _CONTAINED_PARAM_ENUM _CONTAINED_PARAM;

/**
 * Enums for the [_containedType](https://hl7.org/fhir/R4/search.html#containedType) search param.
 */
enum _CONTAINED_TYPE_PARAM_ENUM {
    _CONTAINED_TYPE_CONTAINER, // DEFAULT
    _CONTAINED_TYPE_CONTAINED
};
typedef enum _CONTAINED_TYPE_PARAM_ENUM _CONTAINED_TYPE_PARAM;

enum INTR_MODE_ENUM {
    INTR_READ,
    INTR_VREAD,
    INTR_UPDATE,
    INTR_PATCH,
    INTR_DELETE,
    INTR_HISTORY,
    INTR_CREATE,
    INTR_SEARCH,
    INTR_CAPABILITIES,
    INTR_BATCH,
    INTR_TRANSACTION,
};
typedef enum INTR_MODE_ENUM INTR_MODE;

enum _SUMMARY_PARAM_ENUM {
    _SUMMARY_TRUE,
    _SUMMARY_TEXT,
    _SUMMARY_DATA,
    _SUMMARY_COUNT,
    _SUMMARY_FALSE
};
typedef enum _SUMMARY_PARAM_ENUM _SUMMARY_PARAM;

/**
 * Struct to hold the [R4 General Search Params](https://hl7.org/fhir/R4/http.html#parameters)
 * 
 */
struct gen_params_s {
    /**
     * pretty print the response body?
     * 1 for true, 0 otherwise
     */
    bool _pretty;

    /**
     * how should the matches be summarized?
     * options look like:
     * 0 -> "true"
     * 1 -> "text" 
     * 2 -> "data"
     * 3 -> "count"
     * 4 -> "false"
     */
    _SUMMARY_PARAM _summary;

    /**
     * what mime format? this is a dynamic string
     * without bounded values
     */
    char *_format;

    /**
     * the elements to pick, to get back a payload that can
     * be described as something like this (in typescript):
     *
     * Pick<SomeResource, typeof _elements[number]>`
     * 
     * `str_buffer_t` is a simple struct that wraps a char pointer array,
     * holding an additional 'len' element so we can forgo that param
     * in function sigs.
     */
    str_buffer_t *_elements;
};
/// typedef for `struct gen_search_params_s`:
/// ```c
/// struct gen_params_s { 
///     bool _pretty; 
///     _SUMMARY_PARAM _summary;
///
///     char *_format;
///     str_buffer_t *_elements 
/// };
/// ```
typedef struct gen_params_s gen_params_t;

/**
 * macro function to declare a struct gen_params_s
 * struct on the stack. Only _pretty and _summary need
 * non null values, so they will always be included. 
 *
 * Pass in NULL for _format and _elements
 * to omit either of them.
 */
#define GEN_PARAMS(_PRETTY, _SUMMARY, _FORMAT, _ELEMENTS) \
    ((struct gen_params_s){ ._pretty = (_PRETTY), ._summary = (_SUMMARY), ._format = (_FORMAT), ._elements=(_ELEMENTS) })

/**
 * Holds the 'actual' C-values of the FHIR [search params](https://hl7.org/fhir/R4/search.html#Summary)
 * that can be decoded to a plain querystring buffer.
 * 
 * This REMOVES duplicate keys `_summary` and `_elements` since those are included in the general search params,
 * and a FHIR interaction always has access to both!
 */
struct search_params_s { 
    /// UPPER BOUND on Bundle.entries.length, but not a guarantee
    int _count;
    
    /// idk
    _CONTAINED_PARAM _contained;

    /// lol
    _CONTAINED_TYPE_PARAM _containedType;

    /// list of elements to sort by, prefixing with '-' char
    /// to indicate descending order
    str_buffer_t *_sort;
    char *_include;
    char *_revinclude;
};
typedef struct search_params_s search_params_t;

/**
 * Declare a struct search_params_s on the stack
 */
#define SEARCH_PARAMS(__COUNT, __CONTAINED, __CONTAINED_TYPE, __SORT, __INCLUDE, __REVINCLUDE) \
    ((struct search_params_s){ \
        ._count = (__COUNT), \
        ._contained = (__CONTAINED), \
        ._containedType = (__CONTAINED_TYPE), \
        ._sort = (__SORT), \
        ._include = (__INCLUDE), \
        ._revinclude = (__REVINCLUDE) })

enum CHUNK_BODY_TYPE_ENUM {
    CHUNK_RESOURCE,
    CHUNK_OPERATION_OUTCOME,
    CHUNK_BUNDLE,
    CHUNK_CAPABILITY_STATEMENT,
    CHUNK_PARAMETERS
};
typedef enum CHUNK_BODY_TYPE_ENUM CHUNK_BODY_TYPE;

/**
 * The response body from a FHIR server,
 * which is what the CURL handle uses as its "memory chunk"
 * writeback object
 */
struct response_s {
    char *buf;
    size_t size;
};
typedef struct response_s response_t;

typedef struct json_t json_t;


/**
 * [R4 REST interaction](https://hl7.org/fhir/R4/http.html) configuration struct.
 * 
 * each function that uses a fhir_intr_s struct should think
 * about computations on a intr var as doing something useful 
 * on the server side based on the given inputs
 * 
 * @param mode interaction mode enum
 * @param base_url base url buffer ptr
 * @param resource_type resource type ptr, if it applies
 * @param id logical id for instance interactions, pass NULL for non instance levels
 * @param gen_params a pointer to the gen_params_s struct, pass NULL to apply none
 * @param search_params a pointer to the search_params_s struct, pass NULL to apply none
 * @param response the pointer that holds the response buffer to write to.
 * @param json a pointer to a json_t pointer from the jansson library.
 * @param next a char pointer to the link.url where link.relation = 'next' from the Bundle response (if that applies)
 * @param page the page index
 */
typedef struct fhir_intr_s fhir_intr_t;

typedef int (*fetch_fn) (fhir_intr_t *intr);

struct fhir_intr_s {
    /* client parameters */
    INTR_MODE mode;
    const char *base_url;
    const char *resource_type;
    const char *id;
    gen_params_t *gen_params;
    search_params_t *search_params;

    fetch_fn fetch;

    /* server response */
    response_t *response;
    json_t *json;
    char *next;
    unsigned int page;
};
typedef struct fhir_intr_s fhir_intr_t;

#define fhir_intr_make(MODE, BASE_URL, RESOURCE_TYPE, ID, GEN_PARAMS, SEARCH_PARAMS, RESPONSE, JSON, NEXT, PAGE) \
    ((struct fhir_intr_s){ \
        .mode = (MODE), \
        .base_url = (BASE_URL), \
        .resource_type = (RESOURCE_TYPE), \
        .id = (ID), \
        .gen_params = (GEN_PARAMS), \
        .search_params = (SEARCH_PARAMS), \
        .response = (RESPONSE), \
        .json = (JSON), \
        .next = (NEXT), \
        .page = (PAGE) })

/**
 * Write the search querystring without the '?' char from the given
 * gen_params and search_params struct pointers.
 * 
 * @param gen_params the general parameters
 * @param search_params the search parameters
 * @param querystring the querystring buffer to WRITE the querystring to
 * @returns strlen(querystring) if gen_params != NULL or search_params != NULl. -1 otherwise.
 */
int params_querystring(gen_params_t *gen_params, search_params_t *search_params, char *querystring);

/**
 * malloc wrapper for a buffer_t pointer
 * that 'computes' the url based on the given
 * interaction.
 *
 * @param intr the interaction
 * @returns the url buffer
 */
buffer_t *fhir_intr_url(fhir_intr_t *intr);

/**
 * Executes the given interaction.
 * 
 * @param intr the interaction to run
 * @returns 0 on success, 1 otherwise
 */
int fhir_intr_step(fhir_intr_t *intr);

/**
 * Sets the intr->json = json_loads(intr->response->buf) if .json = NULL,
 * otherwise, it assumes user already owns the reference and COPIES
 * the data from json_loads onto intr->json, handling the freeing of that initial data pointer.
 * @param intr the interaction pointer
 * @returns 0 = ok, 1 = error
 */
int fhir_intr_json(fhir_intr_t *intr);

#endif
