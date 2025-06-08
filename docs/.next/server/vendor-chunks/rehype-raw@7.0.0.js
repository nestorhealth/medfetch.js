"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/rehype-raw@7.0.0";
exports.ids = ["vendor-chunks/rehype-raw@7.0.0"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/rehype-raw@7.0.0/node_modules/rehype-raw/lib/index.js":
/*!***********************************************************************************!*\
  !*** ../node_modules/.pnpm/rehype-raw@7.0.0/node_modules/rehype-raw/lib/index.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ rehypeRaw)\n/* harmony export */ });\n/* harmony import */ var hast_util_raw__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! hast-util-raw */ \"(rsc)/../node_modules/.pnpm/hast-util-raw@9.1.0/node_modules/hast-util-raw/lib/index.js\");\n/**\n * @typedef {import('hast').Root} Root\n * @typedef {import('hast-util-raw').Options} RawOptions\n * @typedef {import('vfile').VFile} VFile\n */\n\n/**\n * @typedef {Omit<RawOptions, 'file'>} Options\n *   Configuration.\n */\n\n\n\n/**\n * Parse the tree (and raw nodes) again, keeping positional info okay.\n *\n * @param {Options | null | undefined}  [options]\n *   Configuration (optional).\n * @returns\n *   Transform.\n */\nfunction rehypeRaw(options) {\n  /**\n   * @param {Root} tree\n   *   Tree.\n   * @param {VFile} file\n   *   File.\n   * @returns {Root}\n   *   New tree.\n   */\n  return function (tree, file) {\n    // Assume root in -> root out.\n    const result = /** @type {Root} */ ((0,hast_util_raw__WEBPACK_IMPORTED_MODULE_0__.raw)(tree, {...options, file}))\n    return result\n  }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlaHlwZS1yYXdANy4wLjAvbm9kZV9tb2R1bGVzL3JlaHlwZS1yYXcvbGliL2luZGV4LmpzIiwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7QUFDQSxhQUFhLHFCQUFxQjtBQUNsQyxhQUFhLGlDQUFpQztBQUM5QyxhQUFhLHVCQUF1QjtBQUNwQzs7QUFFQTtBQUNBLGFBQWEsMEJBQTBCO0FBQ3ZDO0FBQ0E7O0FBRWlDOztBQUVqQztBQUNBO0FBQ0E7QUFDQSxXQUFXLDZCQUE2QjtBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNlO0FBQ2Y7QUFDQSxhQUFhLE1BQU07QUFDbkI7QUFDQSxhQUFhLE9BQU87QUFDcEI7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsTUFBTSxJQUFJLGtEQUFHLFFBQVEsaUJBQWlCO0FBQ3BFO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2V0aGFua2ltL05lc3Rvci9tZWRmZXRjaC5qcy9ub2RlX21vZHVsZXMvLnBucG0vcmVoeXBlLXJhd0A3LjAuMC9ub2RlX21vZHVsZXMvcmVoeXBlLXJhdy9saWIvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdoYXN0JykuUm9vdH0gUm9vdFxuICogQHR5cGVkZWYge2ltcG9ydCgnaGFzdC11dGlsLXJhdycpLk9wdGlvbnN9IFJhd09wdGlvbnNcbiAqIEB0eXBlZGVmIHtpbXBvcnQoJ3ZmaWxlJykuVkZpbGV9IFZGaWxlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T21pdDxSYXdPcHRpb25zLCAnZmlsZSc+fSBPcHRpb25zXG4gKiAgIENvbmZpZ3VyYXRpb24uXG4gKi9cblxuaW1wb3J0IHtyYXd9IGZyb20gJ2hhc3QtdXRpbC1yYXcnXG5cbi8qKlxuICogUGFyc2UgdGhlIHRyZWUgKGFuZCByYXcgbm9kZXMpIGFnYWluLCBrZWVwaW5nIHBvc2l0aW9uYWwgaW5mbyBva2F5LlxuICpcbiAqIEBwYXJhbSB7T3B0aW9ucyB8IG51bGwgfCB1bmRlZmluZWR9ICBbb3B0aW9uc11cbiAqICAgQ29uZmlndXJhdGlvbiAob3B0aW9uYWwpLlxuICogQHJldHVybnNcbiAqICAgVHJhbnNmb3JtLlxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWh5cGVSYXcob3B0aW9ucykge1xuICAvKipcbiAgICogQHBhcmFtIHtSb290fSB0cmVlXG4gICAqICAgVHJlZS5cbiAgICogQHBhcmFtIHtWRmlsZX0gZmlsZVxuICAgKiAgIEZpbGUuXG4gICAqIEByZXR1cm5zIHtSb290fVxuICAgKiAgIE5ldyB0cmVlLlxuICAgKi9cbiAgcmV0dXJuIGZ1bmN0aW9uICh0cmVlLCBmaWxlKSB7XG4gICAgLy8gQXNzdW1lIHJvb3QgaW4gLT4gcm9vdCBvdXQuXG4gICAgY29uc3QgcmVzdWx0ID0gLyoqIEB0eXBlIHtSb290fSAqLyAocmF3KHRyZWUsIHsuLi5vcHRpb25zLCBmaWxlfSkpXG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/rehype-raw@7.0.0/node_modules/rehype-raw/lib/index.js\n");

/***/ })

};
;