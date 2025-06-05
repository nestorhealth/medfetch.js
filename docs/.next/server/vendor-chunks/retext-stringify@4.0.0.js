"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/retext-stringify@4.0.0";
exports.ids = ["vendor-chunks/retext-stringify@4.0.0"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/retext-stringify@4.0.0/node_modules/retext-stringify/lib/index.js":
/*!***********************************************************************************************!*\
  !*** ../node_modules/.pnpm/retext-stringify@4.0.0/node_modules/retext-stringify/lib/index.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ retextStringify)\n/* harmony export */ });\n/* harmony import */ var nlcst_to_string__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! nlcst-to-string */ \"(rsc)/../node_modules/.pnpm/nlcst-to-string@4.0.0/node_modules/nlcst-to-string/lib/index.js\");\n/**\n * @typedef {import('nlcst').Root} Root\n */\n\n\n\n/**\n * Add support for serializing natural language.\n *\n * @returns {undefined}\n *   Nothing.\n */\nfunction retextStringify() {\n  // eslint-disable-next-line unicorn/no-this-assignment\n  const self =\n    /** @type {import('unified').Processor<undefined, undefined, undefined, Root, string>} */ (\n      // @ts-expect-error -- TS in JSDoc doesn’t understand `this`.\n      this\n    )\n\n  self.compiler = compiler\n}\n\n/** @type {import('unified').Compiler<Root, string>} */\nfunction compiler(tree) {\n  return (0,nlcst_to_string__WEBPACK_IMPORTED_MODULE_0__.toString)(tree)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JldGV4dC1zdHJpbmdpZnlANC4wLjAvbm9kZV9tb2R1bGVzL3JldGV4dC1zdHJpbmdpZnkvbGliL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQSxhQUFhLHNCQUFzQjtBQUNuQzs7QUFFd0M7O0FBRXhDO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ2U7QUFDZjtBQUNBO0FBQ0EsZUFBZSw0RUFBNEU7QUFDM0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsV0FBVywwQ0FBMEM7QUFDckQ7QUFDQSxTQUFTLHlEQUFRO0FBQ2pCIiwic291cmNlcyI6WyIvVXNlcnMvZXRoYW5raW0vTmVzdG9yL21lZGZldGNoLmpzL25vZGVfbW9kdWxlcy8ucG5wbS9yZXRleHQtc3RyaW5naWZ5QDQuMC4wL25vZGVfbW9kdWxlcy9yZXRleHQtc3RyaW5naWZ5L2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ25sY3N0JykuUm9vdH0gUm9vdFxuICovXG5cbmltcG9ydCB7dG9TdHJpbmd9IGZyb20gJ25sY3N0LXRvLXN0cmluZydcblxuLyoqXG4gKiBBZGQgc3VwcG9ydCBmb3Igc2VyaWFsaXppbmcgbmF0dXJhbCBsYW5ndWFnZS5cbiAqXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICogICBOb3RoaW5nLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZXRleHRTdHJpbmdpZnkoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSB1bmljb3JuL25vLXRoaXMtYXNzaWdubWVudFxuICBjb25zdCBzZWxmID1cbiAgICAvKiogQHR5cGUge2ltcG9ydCgndW5pZmllZCcpLlByb2Nlc3Nvcjx1bmRlZmluZWQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBSb290LCBzdHJpbmc+fSAqLyAoXG4gICAgICAvLyBAdHMtZXhwZWN0LWVycm9yIC0tIFRTIGluIEpTRG9jIGRvZXNu4oCZdCB1bmRlcnN0YW5kIGB0aGlzYC5cbiAgICAgIHRoaXNcbiAgICApXG5cbiAgc2VsZi5jb21waWxlciA9IGNvbXBpbGVyXG59XG5cbi8qKiBAdHlwZSB7aW1wb3J0KCd1bmlmaWVkJykuQ29tcGlsZXI8Um9vdCwgc3RyaW5nPn0gKi9cbmZ1bmN0aW9uIGNvbXBpbGVyKHRyZWUpIHtcbiAgcmV0dXJuIHRvU3RyaW5nKHRyZWUpXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/retext-stringify@4.0.0/node_modules/retext-stringify/lib/index.js\n");

/***/ })

};
;