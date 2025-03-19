#ifndef BUFFER_H
#define BUFFER_H

#include <stddef.h>

#define INT_STR_MAX 12

/**
 * A byte buffer, or a standard "c string"
 * with size bytes
 */
struct buffer_s {
    /// the number of BYTES the buffer has
    size_t size;

    /// pointer to the buffer
    char *data;
};
typedef struct buffer_s buffer_t;

/**
 * destroys any dynamically allocated buffer_s
 * struct including its data pointer.
 * 
 * ERRORS:
 * `buf` is NULL (-1)
 *
 * `buf->data` is NULL (-1)
 * 
 * @param buf the buffer struct to destroy
 * @returns 0 on success, -1 on error
 */
int buffer_destroy(struct buffer_s *buf);

struct str_buffer_s {
    size_t len;
    char **data;
};
typedef struct str_buffer_s str_buffer_t;

/// (key, value) struct to represent
/// a char buffer to char buffer mapping
/// @field key the key char buffer
/// @field value the value char buffer
struct kv_str2_s { 
                   char *key; size_t key_len; 
                   char *value; size_t value_len;
                 };
/// typedef for 
/// ```c
/// struct kv_str2_s { 
///                    char *key; size_t key_len
///                    char *value; size_t value_len
///                  };
/// ```
typedef struct kv_str2_s kv_str2_t;

struct kh_int2_s;
typedef struct kh_int2_s kh_int2_t;

/// forward declare the kh_str2_s struct generated from the macro
/// this is the khashmap declared via
/// ```c
/// #include "khash.h"
/// KHASH_INIT_MAP_STR(str2, char *)
/// ```
struct kh_str2_s;
/// Wrapper over the kh_str2_t generated typedef for the kh_str2_s
/// struct as a plain kh_str2 name.
/// In buffer.c:
/// ```c
/// #include "khash.h"
/// KHASH_INIT_MAP_STR(str2, char *)
/// ```
/// This is the khashmap of arbitrary char buffer -> char buffer entries
typedef struct kh_str2_s kh_str2_t;

/// Wrapper over kh_destroy_str2()
/// @param kh_str2 the kh str2 hashmap to free
/// @returns 0 if successful (kh_str2 exists), 1 otherwise
int kh_str2_free(kh_str2_t *kh_str2);

/**
 * Make a dynamically allocated kh_str2 struct from a list of key value pairs.
 * @param kvls the list of kv_str2 structs
 * @param len how many elements does it have?
 * @returns a pointer to the string -> string (str^2) khashmap if every kv pair in kvls
 *          were allocated in the map. NULL otherwise.
 *
 * example usage:
 * ```c
 * struct kv_str2 kv1 = { "foo_key", "foo_value" };
 * struct kv_str2 kv2 = { "bar_key", "bar_value" };
 * struct kv_str2 *kvls[] = { &kv1, &kv2 };
 * struct kh_str2 *kh_str2 = kh_str2_from_kvls(ls, 2);
 * ```
 */

kh_str2_t *kh_str2_from_kvls(struct kv_str2_s **kvls, size_t len);

typedef void (*kh_foreach_f) (struct kv_str2_s kv);
void kh_str2_foreach(kh_str2_t *kh_str2, kh_foreach_f f);

typedef void (*kh_fold_f)(void *acc, kv_str2_t *kv, size_t i, size_t h_size);
int kh_str2_fold(kh_str2_t *kh_str2, void *init, kh_fold_f f);

/// frees a 2d buffer, calling free on its elements
/// and then on itself.
/// @param ptr some malloced 2d pointer
/// @param len how many elements to free?
/// @returns 0 if successful, 1 if the parent is a null pointer
/// or at least one of its elements is
int free_array(void **ptr, int len);

/// Parse a `string` representation of an `int` using strtol.
/// @param str the string to parse
/// @param out the int pointer to write to
/// @return - 0 on success, -1 and -2 on error
int parse_int(const char *str, int *out);

/**
 * Wrapper over snprintf(NULL, 0, "%d", x).
 * @param x the int x
 * @returns the length of x intstring
 */
size_t int_strlen(const int x);

/**
 * MODIFY `y` in place to write `x`'s char buf representation
 * as a plain int string.
 * 
 * Can use the provided int_string_len wrapper over the snprintf
 * trick.
 * 
 * @param x the int to get the string representation of
 * @param y the char buffer to write to
 * @param y_len the expected length of y
 * @returns 0 on success, 1 otherwise
 */
int int_to_string(const int x, char *y, const size_t y_len);

/// frees n pointers, IN ORDER OF ARGS
/// @param n the number of pointers
/// @param ptrs the pointers
/// @return the number of pointers NOT freed
int free_n(size_t n, ...);

#endif
