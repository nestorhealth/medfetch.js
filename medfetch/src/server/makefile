# Detect and normalize OS/arch
arch ?= $(shell uname -m)
raw_os := $(shell uname -s)
os := $(shell echo $(raw_os) | tr A-Z a-z)

# Output directory: namespaced by OS/arch
output_dir := build/$(os)/$(arch)

# Determine the output library extension based on OS
ifeq ($(os),Darwin)
    libext = dylib
    ldflags = -dynamiclib -Wl,-install_name,@rpath/medfetch.$(libext)
else
    libext = so
    ldflags = -shared -Wl,-rpath=/usr/local/lib
endif

# Source and target
src := medfetch.c
obj := $(output_dir)/medfetch.o
shared := $(output_dir)/medfetch.$(libext)

# Compiler and flags
cflags := -fPIC -I/usr/local/include
libflags := -L/usr/local/lib -lcfhir -ljansson -lcurl

# Default target
all: $(shared)

# Ensure build dir
$(output_dir)/.dirstamp:
	mkdir -p $(output_dir)
	touch $@

# Compile
$(output_dir)/medfetch.o: medfetch.c | $(output_dir)/.dirstamp
	$(CC) $(cflags) -c $< -o $@

# Link
$(shared): $(obj)
	$(CC) $(ldflags) -o $@ $^ $(libflags)

# Install to /usr/local/lib
install: all
	mkdir -p /usr/local/lib
	cp $(shared) /usr/local/lib/medfetch.$(libext)

# Clean
clean:
	rm -rf build/

.PHONY: all clean install

