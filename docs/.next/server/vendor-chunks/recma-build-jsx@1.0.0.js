"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/recma-build-jsx@1.0.0";
exports.ids = ["vendor-chunks/recma-build-jsx@1.0.0"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/recma-build-jsx@1.0.0/node_modules/recma-build-jsx/lib/index.js":
/*!*********************************************************************************************!*\
  !*** ../node_modules/.pnpm/recma-build-jsx@1.0.0/node_modules/recma-build-jsx/lib/index.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ recmaJsx)\n/* harmony export */ });\n/* harmony import */ var estree_util_build_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! estree-util-build-jsx */ \"(rsc)/../node_modules/.pnpm/estree-util-build-jsx@3.0.1/node_modules/estree-util-build-jsx/lib/index.js\");\n/**\n * @import {Program} from 'estree'\n * @import {Options} from 'recma-build-jsx'\n * @import {VFile} from 'vfile'\n */\n\n\n\n/**\n * Plugin to build JSX.\n *\n * @param {Options | null | undefined} [options]\n *   Configuration (optional).\n * @returns\n *   Transform.\n */\nfunction recmaJsx(options) {\n  /**\n   * @param {Program} tree\n   *   Tree.\n   * @param {VFile} file\n   *   File.\n   * @returns {undefined}\n   *   Nothing.\n   */\n  return function (tree, file) {\n    (0,estree_util_build_jsx__WEBPACK_IMPORTED_MODULE_0__.buildJsx)(tree, {filePath: file.history[0], ...options})\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlY21hLWJ1aWxkLWpzeEAxLjAuMC9ub2RlX21vZHVsZXMvcmVjbWEtYnVpbGQtanN4L2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0EsWUFBWSxTQUFTO0FBQ3JCLFlBQVksU0FBUztBQUNyQixZQUFZLE9BQU87QUFDbkI7O0FBRThDOztBQUU5QztBQUNBO0FBQ0E7QUFDQSxXQUFXLDRCQUE0QjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNlO0FBQ2Y7QUFDQSxhQUFhLFNBQVM7QUFDdEI7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsSUFBSSwrREFBUSxRQUFRLHNDQUFzQztBQUMxRDtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvZXRoYW5raW0vTmVzdG9yL21lZGZldGNoLmpzL25vZGVfbW9kdWxlcy8ucG5wbS9yZWNtYS1idWlsZC1qc3hAMS4wLjAvbm9kZV9tb2R1bGVzL3JlY21hLWJ1aWxkLWpzeC9saWIvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAaW1wb3J0IHtQcm9ncmFtfSBmcm9tICdlc3RyZWUnXG4gKiBAaW1wb3J0IHtPcHRpb25zfSBmcm9tICdyZWNtYS1idWlsZC1qc3gnXG4gKiBAaW1wb3J0IHtWRmlsZX0gZnJvbSAndmZpbGUnXG4gKi9cblxuaW1wb3J0IHtidWlsZEpzeH0gZnJvbSAnZXN0cmVlLXV0aWwtYnVpbGQtanN4J1xuXG4vKipcbiAqIFBsdWdpbiB0byBidWlsZCBKU1guXG4gKlxuICogQHBhcmFtIHtPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZH0gW29wdGlvbnNdXG4gKiAgIENvbmZpZ3VyYXRpb24gKG9wdGlvbmFsKS5cbiAqIEByZXR1cm5zXG4gKiAgIFRyYW5zZm9ybS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVjbWFKc3gob3B0aW9ucykge1xuICAvKipcbiAgICogQHBhcmFtIHtQcm9ncmFtfSB0cmVlXG4gICAqICAgVHJlZS5cbiAgICogQHBhcmFtIHtWRmlsZX0gZmlsZVxuICAgKiAgIEZpbGUuXG4gICAqIEByZXR1cm5zIHt1bmRlZmluZWR9XG4gICAqICAgTm90aGluZy5cbiAgICovXG4gIHJldHVybiBmdW5jdGlvbiAodHJlZSwgZmlsZSkge1xuICAgIGJ1aWxkSnN4KHRyZWUsIHtmaWxlUGF0aDogZmlsZS5oaXN0b3J5WzBdLCAuLi5vcHRpb25zfSlcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/recma-build-jsx@1.0.0/node_modules/recma-build-jsx/lib/index.js\n");

/***/ })

};
;