#include <string.h>
#include <stdlib.h>
#include <jansson.h>

#include "intr.h"

/// gets the pointer to the url string
/// DONT MODIFY DIRECTLY!!
static const char *next(json_t *bundle) {
    if (!bundle)
        return NULL;
    
    json_t *links = json_object_get(bundle, "link");
    if (!links || !json_is_array(links))
        return NULL;

    size_t i;
    json_t *link;
    json_array_foreach(links, i, link) {
        const char *relation = json_string_value(json_object_get(link, "relation"));
        if (relation && strncmp(relation, BUNDLE_LINK_NEXT, MACRO_STRLEN(BUNDLE_LINK_NEXT)) == 0) {
            return json_string_value(json_object_get(link, "url"));
        }
    }
    return NULL;
}

/**
 * Get the offset needed to accomodate the general search params
 * Adds 1 for the '=' char, and 1 for each comma ',' separated parameters
 * in the gen_params_t.elements field. Includes '\0'.
 *
 * @param params the pointer to the general parameters struct
 * @returns the offset to accomodate the querystring WITHOUT the '?'
 */
int gen_params_offset(gen_params_t *params)
{
    if (!params)
        return 0;
    int _pretty_len = MACRO_STRLEN(PARAM_KEY_PRETTY) + 1 + (params->_pretty ? 4 : 5);
    int _summary_len = MACRO_STRLEN(PARAM_KEY_SUMMARY) + 1 + (params->_summary < _SUMMARY_COUNT ? 4 : 5);
    //                     '&'
    int len = _pretty_len + 1 + _summary_len;
    // _pretty and _summary will always be written in, so init
    // offset using this + length of "true" or "false" buffers
    if (params->_format != NULL) // "_format" '=' "some-format"
        len += MACRO_STRLEN(PARAM_KEY_FORMAT) + 1 + strlen(params->_format);

    if (params->_elements != NULL)
    {
        len += MACRO_STRLEN(PARAM_KEY_ELEMENTS) + 1; // for the '=' char
        for (int i = 0; i < params->_elements->len; i++)
        {
            if (i != params->_elements->len - 1) // add length of the parameter + the comma
                len += strlen(params->_elements->data[i]) + 1;
            else // if last element, add the length of the element
                len += strlen(params->_elements->data[i]);
        }
    }
    return len + 1;
}

int search_params_offset(search_params_t *params)
{
    if (!params)
        return 0;
    int _count_len = MACRO_STRLEN(PARAM_KEY_COUNT) + 1 + int_strlen(params->_count);
    int _contained_len = MACRO_STRLEN(PARAM_KEY_CONTAINED) + 1 + (params->_contained == _CONTAINED_FALSE ? 5 : 4);
    int _containedType_len = MACRO_STRLEN(PARAM_KEY_CONTAINED_TYPE) + 1 + (MACRO_STRLEN(PARAM_KEY_CONTAINED) - 1); // both values are same length, so just subtract '_' from "_contained" existing macro (-1)!
    int offset = _count_len + 1 + _contained_len + 1 + _containedType_len + 1;                               // for offset

    if (params->_include)
        offset += MACRO_STRLEN(PARAM_KEY_INCLUDE) + 1 + strlen(params->_include);
    if (params->_revinclude)
        offset += MACRO_STRLEN(PARAM_KEY_REVINCLUDE) + 1 + strlen(params->_revinclude);
    if (params->_sort)
    {
        offset += MACRO_STRLEN(PARAM_KEY_SORT);
        for (int i = 0; i < params->_sort->len; i++)
        {
            if (i != params->_sort->len - 1)
            {
                offset += strlen(params->_sort->data[i]) + 1;
            }
            else
            {
                offset += strlen(params->_sort->data[i]);
            }
        }
    }
    return offset;
}

int params_querystring(gen_params_t *gen_params, search_params_t *search_params, char *querystring)
{
    if (gen_params == NULL && search_params == NULL)
    {
        return -1;
    }

    // make the buffer an "empty string"
    querystring[0] = '\0';
    int querystring_len = 0;
    int kv_num = 0;

    // list of key value struct pointers with max allocation
    kv_str2_t *kv_ls[GEN_PARAM_TOTAL + SEARCH_PARAM_TOTAL];

    // general search kv struct stack decl
    // handles the _summary and _elements
    // parameters from the 'specific' search operation as well
    kv_str2_t _pretty_kv;
    kv_str2_t _summary_gen_kv;
    kv_str2_t _format_kv;
    kv_str2_t _elements_gen_kv;
    size_t _elements_gen_v_len = 0;
    char _elements_gen_v[MAX_ELEMENTS_QUERYSTRING_LEN] = "";

    // search kv struct stack decl
    kv_str2_t _count_kv;
    int _count_str_len;
    char _count_str[MAX_COUNT_DIGITS] = "";

    kv_str2_t _contained_kv;
    kv_str2_t _containedType_kv;
    kv_str2_t _sort_kv;
    kv_str2_t _include_kv;
    kv_str2_t _revinclude_kv;
    

    if (gen_params != NULL)
    {
        // _pretty and _summary in the struct are not pointers, so just always write them in
        // (i dont wanna make them pointers unless i HAVE TO,
        // would rather deal with char concats rather than pointer management lol)
        _pretty_kv = gen_params->_pretty ? PARAM_KV(PARAM_KEY_PRETTY, PARAM_VALUE_TRUE) : PARAM_KV(PARAM_KEY_PRETTY, PARAM_VALUE_FALSE);
        switch (gen_params->_summary)
        {
        case (_SUMMARY_TEXT):
            _summary_gen_kv = PARAM_KV(PARAM_KEY_SUMMARY, PARAM_VALUE_SUMMARY_TEXT);
            break;
        case (_SUMMARY_DATA):
            _summary_gen_kv = PARAM_KV(PARAM_KEY_SUMMARY, PARAM_VALUE_SUMMARY_DATA);
            break;
        case (_SUMMARY_TRUE):
            _summary_gen_kv = PARAM_KV(PARAM_KEY_SUMMARY, PARAM_VALUE_TRUE);
            break;
        case (_SUMMARY_COUNT):
            _summary_gen_kv = PARAM_KV(PARAM_KEY_SUMMARY, PARAM_VALUE_SUMMARY_COUNT);
            break;
        // fhir api doesn't specify a default value for _summary,
        // so we'll use "false" as the default value
        default:
            _summary_gen_kv = PARAM_KV(PARAM_KEY_SUMMARY, PARAM_VALUE_FALSE);
        }
        kv_ls[kv_num++] = &_pretty_kv;
        kv_ls[kv_num++] = &_summary_gen_kv;

        if (gen_params->_format)
        {
            _format_kv = (kv_str2_t){
                .key = PARAM_KEY_FORMAT,
                .key_len = MACRO_STRLEN(PARAM_KEY_FORMAT),
                .value = gen_params->_format,
                .value_len = strlen(gen_params->_format)};
            kv_ls[kv_num++] = &_format_kv;
        }

        if (gen_params->_elements)
        {
            for (size_t i = 0; i < gen_params->_elements->len; i++)
            {
                _elements_gen_v_len += strlen(gen_params->_elements->data[i]);
                // account for ',' separator
                if (i < gen_params->_elements->len - 1)
                    _elements_gen_v_len++;
            }

            for (size_t i = 0; i < gen_params->_elements->len; i++)
            {
                size_t len = gen_params->_elements->len + 1 + 1;
                // account for ',' in "worst case"
                char element[len];
                if (i < gen_params->_elements->len - 1)
                    snprintf(element, len, "%s,", gen_params->_elements->data[i]);
                else
                    snprintf(element, --len, "%s", gen_params->_elements->data[i]);

                strncat(_elements_gen_v, element, len);
            }
            _elements_gen_v[_elements_gen_v_len] = '\0';
            _elements_gen_kv = (kv_str2_t){
                .key = PARAM_KEY_ELEMENTS,
                .key_len = MACRO_STRLEN(PARAM_KEY_ELEMENTS),
                .value = _elements_gen_v,
                .value_len = _elements_gen_v_len};
            kv_ls[kv_num++] = &_elements_gen_kv;
        }
    }

    if (search_params != NULL)
    {
        /* _count */
        _count_str_len = int_strlen(search_params->_count);
        int_to_string(search_params->_count, _count_str, _count_str_len);
        _count_kv = (kv_str2_t){
            .key = PARAM_KEY_COUNT,
            .key_len = MACRO_STRLEN(PARAM_KEY_COUNT),
            .value = _count_str,
            .value_len = _count_str_len};
        kv_ls[kv_num++] = &_count_kv;

        /* _contained */
        switch (search_params->_contained)
        {
        case (_CONTAINED_TRUE):
            _contained_kv = PARAM_KV(PARAM_KEY_CONTAINED, PARAM_VALUE_TRUE);
            break;
        case (_CONTAINED_BOTH):
            _contained_kv = PARAM_KV(PARAM_KEY_CONTAINED, PARAM_VALUE_CONTAINED_BOTH);
            break;
        default:
            _contained_kv = PARAM_KV(PARAM_KEY_CONTAINED, PARAM_VALUE_FALSE);
        }
        kv_ls[kv_num++] = &_contained_kv;

        /* _containedType */
        switch (search_params->_containedType)
        {
        case (_CONTAINED_TYPE_CONTAINED):
            _containedType_kv = PARAM_KV(PARAM_KEY_CONTAINED_TYPE, PARAM_VALUE_CONTAINED_TYPE_CONTAINED);
            break;
        default:
            _containedType_kv = PARAM_KV(PARAM_KEY_CONTAINED_TYPE, PARAM_VALUE_CONTAINED_TYPE_CONTAINER);
        }
        kv_ls[kv_num++] = &_containedType_kv;

        // TODO: handle the dynamic search params,
        // but maybe also figure out how to extract
        // similar logic to its own function without (hopefuly)
        // needing to do any dynamic allocations (how?)
    }

    for (int i = 0; i < kv_num; i++)
    {
        // base size of "%s=%s" str
        size_t len = kv_ls[i]->key_len + 1 + kv_ls[i]->value_len;
        // allocate enough for '&' char
        char kv[1 + len + 1];
        memset(kv, 0, sizeof(kv));

        if (i == 0)
        {
            // snprintf includes '\0' in the length!
            snprintf(kv, len + 1, "%s=%s", kv_ls[i]->key, kv_ls[i]->value);
        }
        else
        {
            snprintf(kv, (++len) + 1, "&%s=%s", kv_ls[i]->key, kv_ls[i]->value);
        }
        strncat(querystring, kv, len);
        querystring_len += len;
    }

    return querystring_len;
}

/**
 * Append all search parameters as a querystring to the given url.
 *
 * Call this if you have AT LEAST ONE NON NULL params pointer,
 * since it returns -1 if both gen_params and search_params are NULL.
 *
 * Offsets are ignored if the corresponding params_t struct pointer is NULL.
 *
 * @param url the char buffer to MODIFY in place with any search params, can be either stack or heap allocated
 * @param url_buf_size the size of the allocated BUFFER for the url string, which must be strictly greater than strlen(url) (>= strlen + 1)
 * @param gen_params pointer to the general params struct
 * @param search_params pointer to the search params struct
 * @return the final length of the url buffer NOT INCLUDING the '\0'. < 0 on error:
 *         (-1) -> both parameters are null
 *         (-2) -> the final url is > MAX_URL_SIZE bytes
 *
 * gen_params_t refers to the **general** search parameters in
 * the general [REST](https://hl7.org/fhir/R4/http.html) specs,
 * while search_params_t refers to the **specific** search parameters specified
 * by the [search](https://hl7.org/fhir/R4/search.html#Summary) operation.
 *
 */
int params_append(char *url, size_t url_buf_size, gen_params_t *gen_params, search_params_t *search_params)
{
    if (url_buf_size > MAX_URL_SIZE)
        return -2; // -2 means initial url buffer larger than the max url length
    size_t old_len = strlen(url);
    if (old_len + 1 > url_buf_size)
        return -2;

    // turn them back into lengths cuz i cant do offset math
    int gen_qs_len = gen_params_offset(gen_params) - 1;
    int search_qs_len = search_params_offset(search_params) - 1;
    
    if (gen_qs_len == -1 && search_qs_len == -1)
        return 0;
    //                       '&'
    int qs_len = gen_qs_len + 1 + search_qs_len;
    if (gen_qs_len == -1 || search_qs_len == -1)
        qs_len--;
    //                     '?'
    int new_len = old_len + 1 + qs_len;

    // url buffer doesn't have enough room
    if (new_len > url_buf_size)
        return -2;

    char qs[qs_len + 1];
    memset(qs, 0, sizeof(qs));
    int rc = params_querystring(gen_params, search_params, qs);
    if (rc == -1) // return the length of the url if querystring couldnt be built
        return old_len;
    // shift over the null terminator
    url[old_len] = '?';
    url[old_len + 1] = '\0';
    strncat(url, qs, qs_len);

    return new_len;
}

/**
 * Get the dynamically allocated buffer pointer
 * to the url of this interaction
 */
struct buffer_s *fhir_intr_url(struct fhir_intr_s *intr) {
    if (!intr || !intr->base_url)
        return NULL;

    size_t base_url_len = strlen(intr->base_url);
    if (base_url_len >= MAX_URL_SIZE) // too big from the getgo
        return NULL;
    
    buffer_t *url_buf = malloc(sizeof(buffer_t));
    if (!url_buf)
        return NULL;

    url_buf->data = malloc(MAX_URL_SIZE);
    if (!url_buf->data) {
        free(url_buf);
        return NULL;
    }

    switch (intr->mode) {
        case (INTR_CAPABILITIES): {
            size_t size = base_url_len + MACRO_STRLEN(ROUTE_METADATA) + 1;
            if (size < 0) {
                free_n(2, url_buf->data, url_buf);
                return NULL;
            }

            int written = snprintf(url_buf->data, size, "%s%s", intr->base_url, ROUTE_METADATA);
            if (written >= size) {
                free_n(2, url_buf->data, url_buf);
                return NULL;
            }
            url_buf->size = size;
            return url_buf;
        }
        case (INTR_SEARCH): {
            if (!intr->resource_type) {
                free_n(2, url_buf->data, url_buf);
                return NULL;
            }
            int minsize = strlen(intr->base_url) + strlen(intr->resource_type) + 1;
            int written = snprintf(url_buf->data, minsize, "%s%s", intr->base_url, intr->resource_type);
            if (written >= minsize || written > MAX_URL_SIZE) {
                free_n(2, url_buf->data, url_buf);
                return NULL;
            }
            int appended_len = params_append(url_buf->data, MAX_URL_SIZE, intr->gen_params, intr->search_params);
            if (appended_len < 0 || appended_len >= MAX_URL_SIZE) {
                free_n(2, url_buf->data, url_buf);
                return NULL;
            }
            url_buf->size = minsize + appended_len;
            return url_buf;
        }
        default: 
            return NULL;
    }
}

// intr->next IS NOT OWNED BY THE USER
int fhir_intr_step(fhir_intr_t *intr) {
    if (!intr || !intr->next) {
        return 1;
    }

    int rc = intr->fetch(intr);
    if (rc) {
        if (intr->response) {
            if (intr->response->buf) {
                free(intr->response->buf);
            }
            free(intr->response);
        }
        return 1;
    }

    intr->page++;
    free(intr->next); // next link ALWAYS gets cleaned up

    return 0;
}

// intr->next IS NOW OWNED BY USER
int fhir_intr_json(fhir_intr_t *intr) {
    // ensure that the response buffer is NOT NULL
    if (!intr->response) {
        return -1;
    }
    if (!intr->response->buf) {
        return -1;
    }

    json_error_t error;
    json_t *json = json_loads(intr->response->buf, 0, &error);
    if (!json) {
        return -1;
    }
    
    // if user owns the json pointer, then copy over data
    // from the loaded json memory onto their address
    if (intr->json) {
        json_object_update(intr->json, json);
        json_decref(json); // dont need this anymore
    } else {
        intr->json = json; // otherwise just assign it
    }
    
    // handle next url assumes step() has already freed
    // the previous intr->next url
    if (intr->mode == INTR_SEARCH) {
        const char *next_url = next(intr->json);
        if (!next_url) {
            intr->next = NULL;
        } else {
            intr->next = strdup(next_url);
        }
    }
    else {
        intr->next = NULL;
    }

    return 0;
}
