/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-integer@1.0.7";
exports.ids = ["vendor-chunks/is-integer@1.0.7"];
exports.modules = {

/***/ "(ssr)/../node_modules/.pnpm/is-integer@1.0.7/node_modules/is-integer/index.js":
/*!*******************************************************************************!*\
  !*** ../node_modules/.pnpm/is-integer@1.0.7/node_modules/is-integer/index.js ***!
  \*******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("// https://github.com/paulmillr/es6-shim\n// http://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.isinteger\nvar isFinite = __webpack_require__(/*! is-finite */ \"(ssr)/../node_modules/.pnpm/is-finite@1.1.0/node_modules/is-finite/index.js\");\nmodule.exports = Number.isInteger || function(val) {\n  return typeof val === \"number\" &&\n    isFinite(val) &&\n    Math.floor(val) === val;\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL2lzLWludGVnZXJAMS4wLjcvbm9kZV9tb2R1bGVzL2lzLWludGVnZXIvaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBLGVBQWUsbUJBQU8sQ0FBQyw4RkFBVztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvZXRoYW5raW0vTmVzdG9yL21lZGZldGNoLmpzL25vZGVfbW9kdWxlcy8ucG5wbS9pcy1pbnRlZ2VyQDEuMC43L25vZGVfbW9kdWxlcy9pcy1pbnRlZ2VyL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9wYXVsbWlsbHIvZXM2LXNoaW1cbi8vIGh0dHA6Ly9wZW9wbGUubW96aWxsYS5vcmcvfmpvcmVuZG9yZmYvZXM2LWRyYWZ0Lmh0bWwjc2VjLW51bWJlci5pc2ludGVnZXJcbnZhciBpc0Zpbml0ZSA9IHJlcXVpcmUoXCJpcy1maW5pdGVcIik7XG5tb2R1bGUuZXhwb3J0cyA9IE51bWJlci5pc0ludGVnZXIgfHwgZnVuY3Rpb24odmFsKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsID09PSBcIm51bWJlclwiICYmXG4gICAgaXNGaW5pdGUodmFsKSAmJlxuICAgIE1hdGguZmxvb3IodmFsKSA9PT0gdmFsO1xufTtcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/../node_modules/.pnpm/is-integer@1.0.7/node_modules/is-integer/index.js\n");

/***/ })

};
;