"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/recma-jsx@1.0.0_acorn@8.14.1";
exports.ids = ["vendor-chunks/recma-jsx@1.0.0_acorn@8.14.1"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/recma-jsx@1.0.0_acorn@8.14.1/node_modules/recma-jsx/lib/index.js":
/*!**********************************************************************************************!*\
  !*** ../node_modules/.pnpm/recma-jsx@1.0.0_acorn@8.14.1/node_modules/recma-jsx/lib/index.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ recmaJsx)\n/* harmony export */ });\n/* harmony import */ var acorn_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! acorn-jsx */ \"(rsc)/../node_modules/.pnpm/acorn-jsx@5.3.2_acorn@8.14.1/node_modules/acorn-jsx/index.js\");\n/* harmony import */ var estree_util_to_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! estree-util-to-js */ \"(rsc)/../node_modules/.pnpm/estree-util-to-js@2.0.0/node_modules/estree-util-to-js/lib/jsx.js\");\n/**\n * @import {} from 'recma-parse'\n * @import {} from 'recma-stringify'\n * @import {Processor} from 'unified'\n */\n\n\n\n\n/**\n * Plugin to add support for parsing and serializing JSX.\n *\n * @this {Processor}\n *   Processor.\n * @returns {undefined}\n *   Nothing.\n */\nfunction recmaJsx() {\n  const data = this.data()\n  const settings = data.settings || (data.settings = {})\n  const handlers = settings.handlers || (settings.handlers = {})\n  const plugins = settings.plugins || (settings.plugins = [])\n\n  // No useful options yet.\n  plugins.push(acorn_jsx__WEBPACK_IMPORTED_MODULE_0__())\n  Object.assign(handlers, estree_util_to_js__WEBPACK_IMPORTED_MODULE_1__.jsx)\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlY21hLWpzeEAxLjAuMF9hY29ybkA4LjE0LjEvbm9kZV9tb2R1bGVzL3JlY21hLWpzeC9saWIvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQSxjQUFjO0FBQ2QsY0FBYztBQUNkLFlBQVksV0FBVztBQUN2Qjs7QUFFaUM7QUFDbUI7O0FBRXBEO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ2U7QUFDZjtBQUNBLHVEQUF1RDtBQUN2RCwrREFBK0Q7QUFDL0Q7O0FBRUE7QUFDQSxlQUFlLHNDQUFTO0FBQ3hCLDBCQUEwQixrREFBVztBQUNyQyIsInNvdXJjZXMiOlsiL1VzZXJzL2V0aGFua2ltL05lc3Rvci9tZWRmZXRjaC5qcy9ub2RlX21vZHVsZXMvLnBucG0vcmVjbWEtanN4QDEuMC4wX2Fjb3JuQDguMTQuMS9ub2RlX21vZHVsZXMvcmVjbWEtanN4L2xpYi9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBpbXBvcnQge30gZnJvbSAncmVjbWEtcGFyc2UnXG4gKiBAaW1wb3J0IHt9IGZyb20gJ3JlY21hLXN0cmluZ2lmeSdcbiAqIEBpbXBvcnQge1Byb2Nlc3Nvcn0gZnJvbSAndW5pZmllZCdcbiAqL1xuXG5pbXBvcnQganN4UGx1Z2luIGZyb20gJ2Fjb3JuLWpzeCdcbmltcG9ydCB7anN4IGFzIGpzeEhhbmRsZXJzfSBmcm9tICdlc3RyZWUtdXRpbC10by1qcydcblxuLyoqXG4gKiBQbHVnaW4gdG8gYWRkIHN1cHBvcnQgZm9yIHBhcnNpbmcgYW5kIHNlcmlhbGl6aW5nIEpTWC5cbiAqXG4gKiBAdGhpcyB7UHJvY2Vzc29yfVxuICogICBQcm9jZXNzb3IuXG4gKiBAcmV0dXJucyB7dW5kZWZpbmVkfVxuICogICBOb3RoaW5nLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWNtYUpzeCgpIHtcbiAgY29uc3QgZGF0YSA9IHRoaXMuZGF0YSgpXG4gIGNvbnN0IHNldHRpbmdzID0gZGF0YS5zZXR0aW5ncyB8fCAoZGF0YS5zZXR0aW5ncyA9IHt9KVxuICBjb25zdCBoYW5kbGVycyA9IHNldHRpbmdzLmhhbmRsZXJzIHx8IChzZXR0aW5ncy5oYW5kbGVycyA9IHt9KVxuICBjb25zdCBwbHVnaW5zID0gc2V0dGluZ3MucGx1Z2lucyB8fCAoc2V0dGluZ3MucGx1Z2lucyA9IFtdKVxuXG4gIC8vIE5vIHVzZWZ1bCBvcHRpb25zIHlldC5cbiAgcGx1Z2lucy5wdXNoKGpzeFBsdWdpbigpKVxuICBPYmplY3QuYXNzaWduKGhhbmRsZXJzLCBqc3hIYW5kbGVycylcbn1cbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/recma-jsx@1.0.0_acorn@8.14.1/node_modules/recma-jsx/lib/index.js\n");

/***/ })

};
;