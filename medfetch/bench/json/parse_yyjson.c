// bench/parse_yyjson.c
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include "yyjson.h"

int main() {
    FILE *fp = fopen("data.json", "rb");
    if (!fp) {
        perror("Failed to open file");
        return 1;
    }

    fseek(fp, 0, SEEK_END);
    long len = ftell(fp);
    fseek(fp, 0, SEEK_SET);
    char *json_data = malloc(len + 1);
    fread(json_data, 1, len, fp);
    json_data[len] = '\0';
    fclose(fp);

    yyjson_doc *doc = yyjson_read(json_data, len, 0);
    if (!doc) {
        fprintf(stderr, "Failed to parse JSON\n");
        return 1;
    }

    struct timeval start, end;
    gettimeofday(&start, NULL);

    char *str = yyjson_write(doc, 0, NULL);

    gettimeofday(&end, NULL);

    long seconds = end.tv_sec - start.tv_sec;
    long useconds = end.tv_usec - start.tv_usec;
    double elapsed_ms = seconds * 1000.0 + useconds / 1000.0;

    printf("C yyjson stringify: %.3fms\n", elapsed_ms);

    yyjson_doc_free(doc);
    free(json_data);
    free(str);
    return 0;
}
