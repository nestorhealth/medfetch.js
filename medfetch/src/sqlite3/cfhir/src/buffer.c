#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <limits.h>
#include <jansson.h>
#include <string.h>

#include "buffer.h"
#include "khash.h"
KHASH_MAP_INIT_STR(str2, char *)
KHASH_MAP_INIT_INT(int2, int)

#define FREE_SUCCESS 0
#define FREE_NULL_PTR 1
    
kh_str2_t *kh_str2_from_kvls(struct kv_str2_s **kvls, size_t len) {
    int rc = 0;
    kh_str2_t *h = kh_init_str2();
    for (size_t i = 0; i < len; i++) {
        khint_t k = kh_put_str2(h, kvls[i]->key, &rc);
        if (rc) {
            kh_value(h, k) = kvls[i]->value;
        } else {
            // if even one key could not be allocated,
            // then destroy the map and return NULL
            kh_destroy_str2(h);
            return NULL;
        }
    }
    return h;
}

int kh_str2_free(kh_str2_t *kh_str2) {
    if (!kh_str2) return 1;
    kh_destroy_str2((kh_str2_t *) kh_str2);
    return 0;
}

int kh_str2_fold(kh_str2_t *h, void *init, kh_fold_f f) {
    int rc = 0;
    size_t i = 0;
    khint_t h_size = kh_size(h);
    for (khint_t kit = kh_begin(h); kit != kh_end(h); ++kit) {
        if (kh_exist(h, kit)) {
            const char *key = kh_key(h, kit);
            size_t key_len = strlen(key);
            const char *value = kh_value(h, kit);
            size_t value_len = strlen(value);

            kv_str2_t kv = { key, key_len, value, value_len };
            f(init, &kv, i, h_size);
        } else {
            rc = 1;
        }
        i++;
    }
    return rc;
}

void kh_str2_foreach(kh_str2_t *kh_str2, kh_foreach_f f) {
    if (!kh_str2) return;
    
    for (khint_t kit = kh_begin(kh_str2); kit != kh_end(kh_str2); ++kit) {
        if (kh_exist(kh_str2, kit)) {
            struct kv_str2_s kv_s = {  (char *)kh_key(kh_str2, kit), (size_t) kh_value(kh_str2, kit) };
            f(kv_s);
        }
    }
    return;
}

// free a 2d array
int free_array(void **ptr, int len) {
    if (!ptr) return FREE_NULL_PTR;
    int rc = FREE_SUCCESS;

    for (int i = 0; i < len; i++) {
        if (ptr[i]) {
            free(ptr[i]);
        } else {
            rc = FREE_NULL_PTR;
        }
    }
    free(ptr);
    return rc;
}

/// Parse a `string` representation of an `int` using strtol.
__attribute__((visibility("default")))
int parse_int(const char *str, int *out) {
    char *endptr;
    errno = 0;
    
    long val = strtol(str, &endptr, 10);

    // Check for conversion errors
    if (errno == ERANGE || val > INT_MAX || val < INT_MIN) {
        return -1;  // Value out of range
    }
    if (endptr == str || *endptr != '\0') {
        return -2;  // No valid conversion or extra characters
    }

    *out = (int)val;  // Store result in out parameter
    return 0;  // Success
}

/// snprintf trick wrapper
size_t int_strlen(const int x) {
    return snprintf(NULL, 0, "%d", x);
}

/// writes an int x to a string y
int int_to_string(const int x, char *y, const size_t y_len) {
    return snprintf(y, y_len + 1, "%d", x);
}

/// free n pointers, and get back the count of pointers not freed
/// so 0 is OK
int free_n(size_t n, ...) {
    int rc = 0;
    va_list args;
    va_start(args, n);
    
    for (size_t i = 0; i < n; i++) {
        void *ptr = va_arg(args, void *);
        if (ptr) free(ptr);
        else rc++;
    }
    
    return rc;
}

int buffer_destroy(struct buffer_s *buf) {
    if (!buf)
        return -1;
    if (!buf->data)
        return -1;
    free_n(2, buf->data, buf);
    buf->size = 0;
    return 0;
}