# Detect system OS and architecture
user_os := $(shell uname -s)
user_arch := $(shell uname -m)

# Source files
src = intr.c buffer.c search.c
obj = $(patsubst %.c, build/%.o, $(src))  # Object files inside build/

# Detect the compiler and flags based on the target system
ifeq ($(user_os),Darwin)
    default_target = mac_x86_64
    cc = clang
    ldflags = -dynamiclib -Wl,-install_name,/usr/local/lib/libcfhir.dylib
    cfhir_shared = build/libcfhir.dylib
else
    default_target = linux_x86_64
    cc = gcc
    ldflags = -shared
    cfhir_shared = build/libcfhir.so
endif

# Compiler flags
cflags = -g -fpic -Wall -I. -fvisibility=hidden
libflags = -lcurl -ljansson  # Dynamically link libcurl and jansson

# Default target: build for the user's system
all: $(cfhir_shared)

# Ensure build directory exists
build/:
	mkdir -p build/

# Build rules
build/%.o: %.c | build/
	$(cc) $(cflags) -c $< -o $@

$(cfhir_shared): $(obj) | build/
	$(cc) $(ldflags) -o $@ $^ $(libflags)

# Cross-compilation targets
linux_x86_64:
	$(MAKE) cc=gcc ldflags="-shared" cfhir_shared=build/libcfhir.so all

mac_x86_64:
	$(MAKE) cc=clang ldflags="-dynamiclib -Wl,-install_name,/usr/local/lib/libcfhir.dylib" cfhir_shared=build/libcfhir.dylib all

# Installation paths
prefix ?= /usr/local
includedir = $(prefix)/include/cfhir
libdir = $(prefix)/lib

# Install headers and libraries
install: all
	mkdir -p $(includedir)
	mkdir -p $(libdir)
	# Copy headers
	cp cfhir.h buffer.h intr.h search.h $(includedir)/
	# Create a symlink for cfhir.h
	ln -sf $(includedir)/cfhir.h $(prefix)/include/cfhir.h
	# Install shared library
	cp $(cfhir_shared) $(libdir)/

# Uninstall headers and libraries
uninstall:
	rm -f $(includedir)/cfhir.h $(includedir)/buffer.h $(includedir)/intr.h $(includedir)/search.h
	rm -f $(prefix)/include/cfhir.h  # Remove symlink
	rm -f $(libdir)/libcfhir.so $(libdir)/libcfhir.dylib

# Clean build files
clean:
	rm -rf build/

.PHONY: all clean install uninstall linux_x86_64 mac_x86_64

