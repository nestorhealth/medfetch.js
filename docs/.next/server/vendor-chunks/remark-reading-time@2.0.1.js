"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/remark-reading-time@2.0.1";
exports.ids = ["vendor-chunks/remark-reading-time@2.0.1"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/remark-reading-time@2.0.1/node_modules/remark-reading-time/index.js":
/*!*************************************************************************************************!*\
  !*** ../node_modules/.pnpm/remark-reading-time@2.0.1/node_modules/remark-reading-time/index.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ readingTime)\n/* harmony export */ });\n/* harmony import */ var reading_time__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! reading-time */ \"(rsc)/../node_modules/.pnpm/reading-time@1.5.0/node_modules/reading-time/index.js\");\n/* harmony import */ var unist_util_visit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! unist-util-visit */ \"(rsc)/../node_modules/.pnpm/unist-util-visit@3.1.0/node_modules/unist-util-visit/index.js\");\n\n\n\nfunction readingTime({\n  /**\n   * The attribute name to store the reading time under data.\n   *\n   * @type {string}\n   * @default \"readingTime\"\n   */\n  attribute = \"readingTime\",\n} = {}) {\n  return function (info, file) {\n    let text = \"\";\n\n    (0,unist_util_visit__WEBPACK_IMPORTED_MODULE_1__.visit)(info, [\"text\", \"code\"], (node) => {\n      text += node.value;\n    });\n\n    file.data[attribute] = reading_time__WEBPACK_IMPORTED_MODULE_0__(text);\n  };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL3JlbWFyay1yZWFkaW5nLXRpbWVAMi4wLjEvbm9kZV9tb2R1bGVzL3JlbWFyay1yZWFkaW5nLXRpbWUvaW5kZXguanMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQTBDO0FBQ0Q7O0FBRTFCO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLEVBQUUsSUFBSTtBQUNOO0FBQ0E7O0FBRUEsSUFBSSx1REFBSztBQUNUO0FBQ0EsS0FBSzs7QUFFTCwyQkFBMkIseUNBQWM7QUFDekM7QUFDQSIsInNvdXJjZXMiOlsiL1VzZXJzL2V0aGFua2ltL05lc3Rvci9tZWRmZXRjaC5qcy9ub2RlX21vZHVsZXMvLnBucG0vcmVtYXJrLXJlYWRpbmctdGltZUAyLjAuMS9ub2RlX21vZHVsZXMvcmVtYXJrLXJlYWRpbmctdGltZS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2V0UmVhZGluZ1RpbWUgZnJvbSBcInJlYWRpbmctdGltZVwiO1xuaW1wb3J0IHsgdmlzaXQgfSBmcm9tIFwidW5pc3QtdXRpbC12aXNpdFwiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWFkaW5nVGltZSh7XG4gIC8qKlxuICAgKiBUaGUgYXR0cmlidXRlIG5hbWUgdG8gc3RvcmUgdGhlIHJlYWRpbmcgdGltZSB1bmRlciBkYXRhLlxuICAgKlxuICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgKiBAZGVmYXVsdCBcInJlYWRpbmdUaW1lXCJcbiAgICovXG4gIGF0dHJpYnV0ZSA9IFwicmVhZGluZ1RpbWVcIixcbn0gPSB7fSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGluZm8sIGZpbGUpIHtcbiAgICBsZXQgdGV4dCA9IFwiXCI7XG5cbiAgICB2aXNpdChpbmZvLCBbXCJ0ZXh0XCIsIFwiY29kZVwiXSwgKG5vZGUpID0+IHtcbiAgICAgIHRleHQgKz0gbm9kZS52YWx1ZTtcbiAgICB9KTtcblxuICAgIGZpbGUuZGF0YVthdHRyaWJ1dGVdID0gZ2V0UmVhZGluZ1RpbWUodGV4dCk7XG4gIH07XG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/remark-reading-time@2.0.1/node_modules/remark-reading-time/index.js\n");

/***/ })

};
;