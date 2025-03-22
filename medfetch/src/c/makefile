# Detect system OS and architecture
arch ?= $(shell uname -m)
os := $(shell uname -s)

# Define fetch implementation from command (defaults to curl)
fetch_impl ?= curl

# Define architecture-specific build directory
output_dir = build/$(os)/$(arch)/$(fetch_impl)

# Source files: always compile common.c + selected fetch implementation
src = $(fetch_impl).c common.c
obj = $(patsubst %.c, $(output_dir)/%.o, $(src))

# Determine the output library extension based on OS
ifeq ($(os),Darwin)
    libext = dylib
    ldflags = -dynamiclib -Wl,-install_name,@rpath/medfetch.$(libext)
else
    libext = so
    ldflags = -shared
endif

# Shared library output (namespaced by fetch provider)
fetch_shared = $(output_dir)/medfetch.$(libext)

# Compiler and linker paths
sqlite_prefix := /usr/local/opt/sqlite
jansson_prefix := /usr/local/opt/jansson
curl_prefix := /usr/local/opt/curl
cfhir_prefix := /usr/local/lib

# Compiler flags (includes headers for all dependencies)
cflags = -I$(sqlite_prefix)/include -I$(jansson_prefix)/include -I$(curl_prefix)/include

# Linker flags (adds the necessary libraries and runtime paths)
libflags = -L$(sqlite_prefix)/lib -L$(jansson_prefix)/lib -L$(cfhir_prefix) -L$(curl_prefix)/lib \
           -Wl,-rpath,$(sqlite_prefix)/lib -Wl,-rpath,$(jansson_prefix)/lib -Wl,-rpath,$(curl_prefix)/lib \
           -lsqlite3 -ljansson -lcfhir -lcurl

# Default target (builds the selected fetch implementation)
all: $(fetch_shared)

# Ensure the build directory exists
$(output_dir)/.dirstamp:
	mkdir -p $(output_dir)
	touch $@

# Compile each .c file into .o object file
$(output_dir)/%.o: %.c | $(output_dir)/.dirstamp
	$(CC) $(cflags) -c $< -o $@

# Link object files into a shared library
$(fetch_shared): $(obj) | $(output_dir)/.dirstamp
	$(CC) $(ldflags) -o $@ $^ $(libflags)

# Install the shared library
install: all
	mkdir -p /usr/local/lib
	cp $(fetch_shared) /usr/local/lib/medfetch.$(libext)

# Clean build directory
clean:
	rm -rf build/

# Allow dynamic make commands like `make curl` or `make browser`
curl: fetch_impl=curl
curl: all

browser: fetch_impl=browser
browser: all

.PHONY: all clean install curl browser

