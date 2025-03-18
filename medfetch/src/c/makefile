# Detect system OS and architecture
arch ?= $(shell uname -m)
os := $(shell uname -s)

# Define architecture-specific build directory
output_dir = build/$(os)/$(arch)

# Source files
src = curl.c common.c
obj = $(patsubst %.c, $(output_dir)/%.o, $(src))

# Determine the output library extension based on OS
ifeq ($(os),Darwin)
    libext = dylib
    ldflags = -dynamiclib -Wl,-install_name,@rpath/medfetch.dylib
else
    libext = so
    ldflags = -shared
endif

# Shared library output
fetch_shared = $(output_dir)/medfetch.$(libext)

# Compiler and linker paths
sqlite_prefix := /usr/local/opt/sqlite
jansson_prefix := /usr/local/opt/jansson
cfhir_prefix := /usr/local/lib

# Compiler and linker flags
cflags = -I$(sqlite_prefix)/include -I$(jansson_prefix)/include
libflags = -L$(sqlite_prefix)/lib -L$(jansson_prefix)/lib -L$(cfhir_prefix) \
           -Wl,-rpath,$(sqlite_prefix)/lib -Wl,-rpath,$(jansson_prefix)/lib \
           -lsqlite3 -ljansson -lcfhir -lcurl

# Build the shared library
all: $(fetch_shared)

# Ensure architecture-specific build directory exists
$(output_dir):
	mkdir -p $(output_dir)

# Compile each .c file into .o object file
$(output_dir)/%.o: %.c | $(output_dir)
	$(CC) $(cflags) -c $< -o $@

# Link object files into a shared library
$(fetch_shared): $(obj) | $(output_dir)
	$(CC) $(ldflags) -o $@ $^ $(libflags)

# Install the shared library
install: all
	mkdir -p /usr/local/lib
	cp $(fetch_shared) /usr/local/lib/

# Clean build directory
clean:
	rm -rf build/

.PHONY: all clean install
