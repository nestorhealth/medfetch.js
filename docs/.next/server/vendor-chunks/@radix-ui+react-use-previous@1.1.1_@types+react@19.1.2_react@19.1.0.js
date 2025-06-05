"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/@radix-ui+react-use-previous@1.1.1_@types+react@19.1.2_react@19.1.0";
exports.ids = ["vendor-chunks/@radix-ui+react-use-previous@1.1.1_@types+react@19.1.2_react@19.1.0"];
exports.modules = {

/***/ "(ssr)/../node_modules/.pnpm/@radix-ui+react-use-previous@1.1.1_@types+react@19.1.2_react@19.1.0/node_modules/@radix-ui/react-use-previous/dist/index.mjs":
/*!**********************************************************************************************************************************************************!*\
  !*** ../node_modules/.pnpm/@radix-ui+react-use-previous@1.1.1_@types+react@19.1.2_react@19.1.0/node_modules/@radix-ui/react-use-previous/dist/index.mjs ***!
  \**********************************************************************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   usePrevious: () => (/* binding */ usePrevious)\n/* harmony export */ });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"(ssr)/../node_modules/.pnpm/next@15.3.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js\");\n// packages/react/use-previous/src/use-previous.tsx\n\nfunction usePrevious(value) {\n  const ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef({ value, previous: value });\n  return react__WEBPACK_IMPORTED_MODULE_0__.useMemo(() => {\n    if (ref.current.value !== value) {\n      ref.current.previous = ref.current.value;\n      ref.current.value = value;\n    }\n    return ref.current.previous;\n  }, [value]);\n}\n\n//# sourceMappingURL=index.mjs.map\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL0ByYWRpeC11aStyZWFjdC11c2UtcHJldmlvdXNAMS4xLjFfQHR5cGVzK3JlYWN0QDE5LjEuMl9yZWFjdEAxOS4xLjAvbm9kZV9tb2R1bGVzL0ByYWRpeC11aS9yZWFjdC11c2UtcHJldmlvdXMvZGlzdC9pbmRleC5tanMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQTtBQUMrQjtBQUMvQjtBQUNBLGNBQWMseUNBQVksR0FBRyx3QkFBd0I7QUFDckQsU0FBUywwQ0FBYTtBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBR0U7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2V0aGFua2ltL05lc3Rvci9tZWRmZXRjaC5qcy9ub2RlX21vZHVsZXMvLnBucG0vQHJhZGl4LXVpK3JlYWN0LXVzZS1wcmV2aW91c0AxLjEuMV9AdHlwZXMrcmVhY3RAMTkuMS4yX3JlYWN0QDE5LjEuMC9ub2RlX21vZHVsZXMvQHJhZGl4LXVpL3JlYWN0LXVzZS1wcmV2aW91cy9kaXN0L2luZGV4Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBwYWNrYWdlcy9yZWFjdC91c2UtcHJldmlvdXMvc3JjL3VzZS1wcmV2aW91cy50c3hcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xuZnVuY3Rpb24gdXNlUHJldmlvdXModmFsdWUpIHtcbiAgY29uc3QgcmVmID0gUmVhY3QudXNlUmVmKHsgdmFsdWUsIHByZXZpb3VzOiB2YWx1ZSB9KTtcbiAgcmV0dXJuIFJlYWN0LnVzZU1lbW8oKCkgPT4ge1xuICAgIGlmIChyZWYuY3VycmVudC52YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHJlZi5jdXJyZW50LnByZXZpb3VzID0gcmVmLmN1cnJlbnQudmFsdWU7XG4gICAgICByZWYuY3VycmVudC52YWx1ZSA9IHZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gcmVmLmN1cnJlbnQucHJldmlvdXM7XG4gIH0sIFt2YWx1ZV0pO1xufVxuZXhwb3J0IHtcbiAgdXNlUHJldmlvdXNcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbmRleC5tanMubWFwXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/.pnpm/@radix-ui+react-use-previous@1.1.1_@types+react@19.1.2_react@19.1.0/node_modules/@radix-ui/react-use-previous/dist/index.mjs\n");

/***/ })

};
;