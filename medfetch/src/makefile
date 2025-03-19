# Detect OS and Architecture
OS := $(shell uname | tr '[:upper:]' '[:lower:]')
ARCH := $(shell uname -m)

# Build Directory
BUILD_DIR := build/$(OS)-$(ARCH)

# SQLite related paths
SQLITE_PATH := ../sqlite
SQLITE_WASM_PATH := $(SQLITE_PATH)/ext/wasm
SQLITE_WASM_OUT_PATH := $(SQLITE_WASM_PATH)/jswasm
SQLITE_WASM_MODIFIED_MAKE := $(shell pwd)/sqlite-makes/GNUmakefile
SQLITE_WASM_NEW_NAME := _GNUmakefile

SQLITE_EXTENSION_SRC := $(SQLITE_WASM_PATH)/medfetch

# Compiler (Emscripten)
EMSDK_HOME ?= $(HOME)/emsdk
EMCC ?= $(EMSDK_HOME)/upstream/emscripten/emcc

# source code
SRC = buffer.c intr.c medfetch.c search.c
HEADERS = buffer.h intr.h khash.h search.h
LOADER_FILE = sqlite3_wasm_extra_init.c

# Output WASM Library
WASM_ESM  = $(BUILD_DIR)/sqlite3.mjs
WASM_JS   = $(BUILD_DIR)/sqlite3.js
WASM_WASM = $(BUILD_DIR)/sqlite3.wasm
WASM_WORKER = $(BUILD_DIR)/sqlite3-worker1.js

# Default Target: ES6 Module Build
wasm_esm:
	mkdir -p $(SQLITE_EXTENSION_SRC)
	# Ensure source files are copied into SQLite's WASM build directory
	cp $(SRC) $(SQLITE_EXTENSION_SRC)
	cp $(HEADERS) $(SQLITE_EXTENSION_SRC)
	cp $(LOADER_FILE) $(SQLITE_WASM_PATH)

	# Configure and build SQLite WASM
	cd $(SQLITE_PATH) && ./configure --enable-all && \
	cd $(SQLITE_WASM_PATH) && cp $(SQLITE_WASM_MODIFIED_MAKE) $(SQLITE_WASM_NEW_NAME) && \
	make -f $(SQLITE_WASM_NEW_NAME)

	# Copy built artifacts to the output directory
	mkdir -p $(BUILD_DIR)
	cp $(SQLITE_WASM_OUT_PATH)/sqlite3.mjs $(WASM_ESM)
	cp $(SQLITE_WASM_OUT_PATH)/sqlite3.js $(WASM_JS)
	cp $(SQLITE_WASM_OUT_PATH)/sqlite3.wasm $(WASM_WASM)
	cp $(SQLITE_WASM_OUT_PATH)/sqlite3-worker1.js $(WASM_WORKER)

# Clean Up
.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

