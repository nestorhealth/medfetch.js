"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/nlcst-to-string@4.0.0";
exports.ids = ["vendor-chunks/nlcst-to-string@4.0.0"];
exports.modules = {

/***/ "(rsc)/../node_modules/.pnpm/nlcst-to-string@4.0.0/node_modules/nlcst-to-string/lib/index.js":
/*!*********************************************************************************************!*\
  !*** ../node_modules/.pnpm/nlcst-to-string@4.0.0/node_modules/nlcst-to-string/lib/index.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   toString: () => (/* binding */ toString)\n/* harmony export */ });\n/**\n * @typedef {import('nlcst').Nodes} Nodes\n */\n\n/** @type {Readonly<Array<Nodes>>} */\nconst emptyNodes = []\n\n/**\n * Get the text content of a node or list of nodes.\n *\n * Prefers the node’s plain-text fields, otherwise serializes its children, and\n * if the given value is an array, serialize the nodes in it.\n *\n * @param {Array<Nodes> | Nodes} value\n *   Node or list of nodes to serialize.\n * @returns {string}\n *   Result.\n */\nfunction toString(value) {\n  let index = -1\n\n  if (!value || (!Array.isArray(value) && !value.type)) {\n    throw new Error('Expected node, not `' + value + '`')\n  }\n\n  if ('value' in value) return value.value\n\n  const children = (Array.isArray(value) ? value : value.children) || emptyNodes\n\n  /** @type {Array<string>} */\n  const values = []\n\n  while (++index < children.length) {\n    values[index] = toString(children[index])\n  }\n\n  return values.join('')\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi4vbm9kZV9tb2R1bGVzLy5wbnBtL25sY3N0LXRvLXN0cmluZ0A0LjAuMC9ub2RlX21vZHVsZXMvbmxjc3QtdG8tc3RyaW5nL2xpYi9pbmRleC5qcyIsIm1hcHBpbmdzIjoiOzs7O0FBQUE7QUFDQSxhQUFhLHVCQUF1QjtBQUNwQzs7QUFFQSxXQUFXLHdCQUF3QjtBQUNuQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLHNCQUFzQjtBQUNqQztBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ087QUFDUDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsYUFBYSxlQUFlO0FBQzVCOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyIvVXNlcnMvZXRoYW5raW0vTmVzdG9yL21lZGZldGNoLmpzL25vZGVfbW9kdWxlcy8ucG5wbS9ubGNzdC10by1zdHJpbmdANC4wLjAvbm9kZV9tb2R1bGVzL25sY3N0LXRvLXN0cmluZy9saWIvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAdHlwZWRlZiB7aW1wb3J0KCdubGNzdCcpLk5vZGVzfSBOb2Rlc1xuICovXG5cbi8qKiBAdHlwZSB7UmVhZG9ubHk8QXJyYXk8Tm9kZXM+Pn0gKi9cbmNvbnN0IGVtcHR5Tm9kZXMgPSBbXVxuXG4vKipcbiAqIEdldCB0aGUgdGV4dCBjb250ZW50IG9mIGEgbm9kZSBvciBsaXN0IG9mIG5vZGVzLlxuICpcbiAqIFByZWZlcnMgdGhlIG5vZGXigJlzIHBsYWluLXRleHQgZmllbGRzLCBvdGhlcndpc2Ugc2VyaWFsaXplcyBpdHMgY2hpbGRyZW4sIGFuZFxuICogaWYgdGhlIGdpdmVuIHZhbHVlIGlzIGFuIGFycmF5LCBzZXJpYWxpemUgdGhlIG5vZGVzIGluIGl0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXk8Tm9kZXM+IHwgTm9kZXN9IHZhbHVlXG4gKiAgIE5vZGUgb3IgbGlzdCBvZiBub2RlcyB0byBzZXJpYWxpemUuXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICogICBSZXN1bHQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1N0cmluZyh2YWx1ZSkge1xuICBsZXQgaW5kZXggPSAtMVxuXG4gIGlmICghdmFsdWUgfHwgKCFBcnJheS5pc0FycmF5KHZhbHVlKSAmJiAhdmFsdWUudHlwZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIG5vZGUsIG5vdCBgJyArIHZhbHVlICsgJ2AnKVxuICB9XG5cbiAgaWYgKCd2YWx1ZScgaW4gdmFsdWUpIHJldHVybiB2YWx1ZS52YWx1ZVxuXG4gIGNvbnN0IGNoaWxkcmVuID0gKEFycmF5LmlzQXJyYXkodmFsdWUpID8gdmFsdWUgOiB2YWx1ZS5jaGlsZHJlbikgfHwgZW1wdHlOb2Rlc1xuXG4gIC8qKiBAdHlwZSB7QXJyYXk8c3RyaW5nPn0gKi9cbiAgY29uc3QgdmFsdWVzID0gW11cblxuICB3aGlsZSAoKytpbmRleCA8IGNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHZhbHVlc1tpbmRleF0gPSB0b1N0cmluZyhjaGlsZHJlbltpbmRleF0pXG4gIH1cblxuICByZXR1cm4gdmFsdWVzLmpvaW4oJycpXG59XG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/../node_modules/.pnpm/nlcst-to-string@4.0.0/node_modules/nlcst-to-string/lib/index.js\n");

/***/ })

};
;