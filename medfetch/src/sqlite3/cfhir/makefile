# Detect system OS and architecture
user_os := $(shell uname -s)
user_arch := $(shell uname -m)

# Source files
src := $(wildcard src/*.c)
obj := $(patsubst %src/%.c, build/%.o, $(src))  # Object files inside build/

# Detect the compiler and flags based on the target system
ifeq ($(user_os),Darwin)
    default_target = mac_x86_64
    cc = clang
    ldflags = -dynamiclib -Wl,-install_name,/usr/local/lib/libcfhir.dylib
    cfhir_shared = build/libcfhir.dylib
    cfhir_static = build/libcfhir.a
else
    default_target = linux_x86_64
    cc = gcc
    ldflags = -shared
    cfhir_shared = build/libcfhir.so
    cfhir_static = build/libcfhir.a
endif

# Compiler flags
cflags = -g -fpic -Wall -I. -fvisibility=hidden -I/usr/local
libflags = -L/usr/local/lib -ljansson

# Default target: build for the user's system
all: $(cfhir_shared) $(cfhir_static)

# Ensure build directory exists
build/:
	mkdir -p build/

# Build object files
build/%.o: %.c | build/
	$(cc) $(cflags) -c $< -o $@

# Build shared library (.so/.dylib)
$(cfhir_shared): $(obj) | build/
	$(cc) $(ldflags) -o $@ $^ $(libflags)

# Build static library (.a)
$(cfhir_static): $(obj) | build/
	ar rcs $@ $^

# Install headers and libraries
prefix ?= /usr/local
includedir = $(prefix)/include
libdir = $(prefix)/lib
internal_headers := $(wildcard src/*.h)
public_header := cfhir.h

install: all
	mkdir -p $(includedir)/cfhir
	mkdir -p $(libdir)
	cp $(internal_headers) $(includedir)/cfhir/
	cp $(public_header) $(includedir)/

	# Install shared library
	cp $(cfhir_shared) $(libdir)/
	# Install static library
	cp $(cfhir_static) $(libdir)/

# Uninstall headers and libraries
uninstall:
	rm -f $(includedir)/cfhir.h
	rm -rf $(includedir)/cfhir
	rm -f $(libdir)/libcfhir.so $(libdir)/libcfhir.dylib $(libdir)/libcfhir.a

# Clean build files
clean:
	rm -rf build/

.PHONY: all clean install uninstall
