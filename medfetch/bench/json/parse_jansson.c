// bench/parse_jansson.c
#include <jansson.h>
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>

int main() {
    json_error_t error;
    json_t *root = json_load_file("data.json", 0, &error);
    if (!root) {
        fprintf(stderr, "Failed to parse JSON: %s\n", error.text);
        return 1;
    }

    struct timeval start, end;
    gettimeofday(&start, NULL);

    char *dump = json_dumps(root, JSON_INDENT(0));

    gettimeofday(&end, NULL);

    long seconds = end.tv_sec - start.tv_sec;
    long useconds = end.tv_usec - start.tv_usec;
    double elapsed_ms = seconds * 1000.0 + useconds / 1000.0;

    printf("C Jansson stringify: %.3fms\n", elapsed_ms);

    free(dump);
    json_decref(root);
    return 0;
}
