# Build Configuration
BUILD_DIR = build

EMCC_FLAGS = -ljansson -sFETCH -sASYNCIFY -sEXPORT_ES6 -sDEFAULT_LIBRARY_FUNCS_TO_INCLUDE='$$stringToNewUTF8' -sALLOW_MEMORY_GROWTH=1 -O3

SRC_FILES = search.c intr.c buffer.c
SRC_PATH = ../src
SRC_DEPS = $(addprefix $(SRC_PATH)/, $(SRC_FILES))

# Output binaries
OUTPUTS = step_simple search_flatmap

# Create build directory if it doesn't exist
$(BUILD_DIR):
	mkdir -p $(BUILD_DIR)

# Build all targets
all: $(addprefix $(BUILD_DIR)/, $(OUTPUTS:=.js))

# Generic build rule for each target
$(BUILD_DIR)/%.js: %.c $(SRC_DEPS) | $(BUILD_DIR)
	emcc $(EMCC_FLAGS) $(SRC_DEPS) -I$(SRC_PATH) $< -o $@

# Cleaning
.PHONY: clean
clean:
	rm -rf $(BUILD_DIR)

