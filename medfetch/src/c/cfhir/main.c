#include "intr.h"
#include <stdlib.h>
#include <string.h>
#include <curl/curl.h>
#include "jansson.h"
#include "search.h"

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

    if (!intr->response) {
        intr->response = malloc(1);
        if (!intr->response) {
            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);
            return 1;
        }
        intr->response->buf = malloc(1);
        if (!intr->response->buf) {
            free(intr->response);
            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);
            return 1;
        }
        intr->response->size = 0;
    }
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, (void *) intr->response);

    CURLcode res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        printf("%s\n", curl_easy_strerror(res));
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
        return 1;
    }
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
    return 0;
}

int main() {
    curl_global_init(CURL_GLOBAL_DEFAULT);

    curl_global_cleanup();
    fhir_intr_t *curl_search = fhir_search("https://r4.smarthealthit.org/", "Patient", curl_fn);
    if (fhir_intr_step(curl_search)) {
        printf("here?\n");
    }
    if (fhir_intr_json(curl_search)) {
        printf("here json?\n");
    }

    const char *dumped = json_string_value(json_object_get(curl_search->json, "resourceType"));
    printf("Here! %s\n", dumped);

    return 0;
}
