# Gets filtered by the configure script
bin.bash = /bin/bash
bin.emcc = /Users/nathanoh/dev/packages/medfetch/sqlite/tool/emcc.sh
bin.wasm-strip = 
bin.wasm-opt = /Users/nathanoh/emsdk/upstream/bin/wasm-opt

SHELL := $(bin.bash)

# The following overrides can be uncommented to test various
# validation and if/else branches the makefile code:
#
#bin.bash :=
#bin.emcc :=
#bin.wasm-strip :=
#bin.wasm-opt :=
