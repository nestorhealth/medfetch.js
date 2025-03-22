#include "../src/search.h"
#include <string.h>
#include <stdio.h>
#include <emscripten/fetch.h>
#include <jansson.h>
#include <emscripten.h>

EM_ASYNC_JS(char *, get_json_payload, (const char *url), {
    const encoded = UTF8ToString(url);
    const response = await fetch(encoded);
    if (!response.ok) {
        return 0;
    }
    const text = await response.text();
    if (text.length == 0) {
        return 0;
    }
    return stringToNewUTF8(text);
});

int fetch_f(fhir_intr_t *intr) {
    char *payload = get_json_payload(intr->next);
    if (payload == NULL) {
        return 1;
    }
    size_t payload_size = strlen(payload) + 1;
    char *buf = realloc(intr->response->buf, intr->response->size + payload_size);
    if (!buf) {
        return 1;
    }
    intr->response->buf = buf;
    memcpy(intr->response->buf + intr->response->size, payload, payload_size);
    intr->response->size += payload_size;
    intr->response->buf[intr->response->size] = 0;
    return 0;
}

int main() {
    fhir_intr_t *search = fhir_search("https://r4.smarthealthit.org/", "Patient", fetch_f);
    json_t *resources = search_flatmap(search, -1, 250);
    char *dumped = json_dumps(resources, JSON_COMPACT);
    printf("Got total (serialized) payload size of %lu bytes\n", strlen(dumped) + 1);

    fhir_search_free(search);
    json_decref(resources);
    return 0;
}
