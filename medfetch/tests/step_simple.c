#include "../src/search.h"
#include <string.h>
#include <stdio.h>
#include <emscripten/fetch.h>
#include <emscripten.h>

EM_ASYNC_JS(char *, do_fetch, (const char *url), {
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

int do_fetchw(fhir_intr_t *intr) {
    char *payload = do_fetch(intr->next);
    // 0 == NULL in C
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
    fhir_intr_t *search = fhir_search("https://r4.smarthealthit.org/", "Patient", do_fetchw);
    if (!search) {
        printf("memory allocation failed\n");
        return 1;
    }
    if (fhir_search_begin(search)) {
        printf("couldn't allocate the search->next url pointer...\n");
        return 1;
    }
    if(fhir_intr_step(search)) {
        printf("Error in fhir_intr_step() \n");
        return 1;
    }
    if (fhir_intr_json(search)) {
        printf("Error in fhir_intr_json()\n");
        return 1;
    }
    printf("\n----OK!---\n");
    fhir_search_free(search);

    return 0;
}
