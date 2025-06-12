import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __publicField
} from "./chunk-MZQ22LAU.js";

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/object-utils.js
function isUndefined(obj) {
  return typeof obj === "undefined" || obj === void 0;
}
function isString(obj) {
  return typeof obj === "string";
}
function isNumber(obj) {
  return typeof obj === "number";
}
function isBoolean(obj) {
  return typeof obj === "boolean";
}
function isNull(obj) {
  return obj === null;
}
function isDate(obj) {
  return obj instanceof Date;
}
function isBigInt(obj) {
  return typeof obj === "bigint";
}
function isBuffer(obj) {
  return typeof Buffer !== "undefined" && Buffer.isBuffer(obj);
}
function isFunction(obj) {
  return typeof obj === "function";
}
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
function isPlainObject(obj) {
  if (!isObject(obj) || getTag(obj) !== "[object Object]") {
    return false;
  }
  if (Object.getPrototypeOf(obj) === null) {
    return true;
  }
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
}
function getLast(arr) {
  return arr[arr.length - 1];
}
function freeze(obj) {
  return Object.freeze(obj);
}
function asArray(arg) {
  if (isReadonlyArray(arg)) {
    return arg;
  } else {
    return [arg];
  }
}
function isReadonlyArray(arg) {
  return Array.isArray(arg);
}
function noop(obj) {
  return obj;
}
function compare(obj1, obj2) {
  if (isReadonlyArray(obj1) && isReadonlyArray(obj2)) {
    return compareArrays(obj1, obj2);
  } else if (isObject(obj1) && isObject(obj2)) {
    return compareObjects(obj1, obj2);
  }
  return obj1 === obj2;
}
function compareArrays(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  for (let i = 0; i < arr1.length; ++i) {
    if (!compare(arr1[i], arr2[i])) {
      return false;
    }
  }
  return true;
}
function compareObjects(obj1, obj2) {
  if (isBuffer(obj1) && isBuffer(obj2)) {
    return compareBuffers(obj1, obj2);
  } else if (isDate(obj1) && isDate(obj2)) {
    return compareDates(obj1, obj2);
  }
  return compareGenericObjects(obj1, obj2);
}
function compareBuffers(buf1, buf2) {
  return Buffer.compare(buf1, buf2) === 0;
}
function compareDates(date1, date2) {
  return date1.getTime() === date2.getTime();
}
function compareGenericObjects(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!compare(obj1[key], obj2[key])) {
      return false;
    }
  }
  return true;
}
var toString = Object.prototype.toString;
function getTag(value) {
  if (value == null) {
    return value === void 0 ? "[object Undefined]" : "[object Null]";
  }
  return toString.call(value);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/alter-table-node.js
var AlterTableNode = freeze({
  is(node) {
    return node.kind === "AlterTableNode";
  },
  create(table) {
    return freeze({
      kind: "AlterTableNode",
      table
    });
  },
  cloneWithTableProps(node, props) {
    return freeze({
      ...node,
      ...props
    });
  },
  cloneWithColumnAlteration(node, columnAlteration) {
    return freeze({
      ...node,
      columnAlterations: node.columnAlterations ? [...node.columnAlterations, columnAlteration] : [columnAlteration]
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/identifier-node.js
var IdentifierNode = freeze({
  is(node) {
    return node.kind === "IdentifierNode";
  },
  create(name) {
    return freeze({
      kind: "IdentifierNode",
      name
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/create-index-node.js
var CreateIndexNode = freeze({
  is(node) {
    return node.kind === "CreateIndexNode";
  },
  create(name) {
    return freeze({
      kind: "CreateIndexNode",
      name: IdentifierNode.create(name)
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  },
  cloneWithColumns(node, columns) {
    return freeze({
      ...node,
      columns: [...node.columns || [], ...columns]
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/create-schema-node.js
var CreateSchemaNode = freeze({
  is(node) {
    return node.kind === "CreateSchemaNode";
  },
  create(schema, params) {
    return freeze({
      kind: "CreateSchemaNode",
      schema: IdentifierNode.create(schema),
      ...params
    });
  },
  cloneWith(createSchema, params) {
    return freeze({
      ...createSchema,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/create-table-node.js
var ON_COMMIT_ACTIONS = ["preserve rows", "delete rows", "drop"];
var CreateTableNode = freeze({
  is(node) {
    return node.kind === "CreateTableNode";
  },
  create(table) {
    return freeze({
      kind: "CreateTableNode",
      table,
      columns: freeze([])
    });
  },
  cloneWithColumn(createTable, column) {
    return freeze({
      ...createTable,
      columns: freeze([...createTable.columns, column])
    });
  },
  cloneWithConstraint(createTable, constraint) {
    return freeze({
      ...createTable,
      constraints: createTable.constraints ? freeze([...createTable.constraints, constraint]) : freeze([constraint])
    });
  },
  cloneWithFrontModifier(createTable, modifier) {
    return freeze({
      ...createTable,
      frontModifiers: createTable.frontModifiers ? freeze([...createTable.frontModifiers, modifier]) : freeze([modifier])
    });
  },
  cloneWithEndModifier(createTable, modifier) {
    return freeze({
      ...createTable,
      endModifiers: createTable.endModifiers ? freeze([...createTable.endModifiers, modifier]) : freeze([modifier])
    });
  },
  cloneWith(createTable, params) {
    return freeze({
      ...createTable,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/schemable-identifier-node.js
var SchemableIdentifierNode = freeze({
  is(node) {
    return node.kind === "SchemableIdentifierNode";
  },
  create(identifier) {
    return freeze({
      kind: "SchemableIdentifierNode",
      identifier: IdentifierNode.create(identifier)
    });
  },
  createWithSchema(schema, identifier) {
    return freeze({
      kind: "SchemableIdentifierNode",
      schema: IdentifierNode.create(schema),
      identifier: IdentifierNode.create(identifier)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/drop-index-node.js
var DropIndexNode = freeze({
  is(node) {
    return node.kind === "DropIndexNode";
  },
  create(name, params) {
    return freeze({
      kind: "DropIndexNode",
      name: SchemableIdentifierNode.create(name),
      ...params
    });
  },
  cloneWith(dropIndex, props) {
    return freeze({
      ...dropIndex,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/drop-schema-node.js
var DropSchemaNode = freeze({
  is(node) {
    return node.kind === "DropSchemaNode";
  },
  create(schema, params) {
    return freeze({
      kind: "DropSchemaNode",
      schema: IdentifierNode.create(schema),
      ...params
    });
  },
  cloneWith(dropSchema, params) {
    return freeze({
      ...dropSchema,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/drop-table-node.js
var DropTableNode = freeze({
  is(node) {
    return node.kind === "DropTableNode";
  },
  create(table, params) {
    return freeze({
      kind: "DropTableNode",
      table,
      ...params
    });
  },
  cloneWith(dropIndex, params) {
    return freeze({
      ...dropIndex,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/alias-node.js
var AliasNode = freeze({
  is(node) {
    return node.kind === "AliasNode";
  },
  create(node, alias) {
    return freeze({
      kind: "AliasNode",
      node,
      alias
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/table-node.js
var TableNode = freeze({
  is(node) {
    return node.kind === "TableNode";
  },
  create(table) {
    return freeze({
      kind: "TableNode",
      table: SchemableIdentifierNode.create(table)
    });
  },
  createWithSchema(schema, table) {
    return freeze({
      kind: "TableNode",
      table: SchemableIdentifierNode.createWithSchema(schema, table)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/operation-node-source.js
function isOperationNodeSource(obj) {
  return isObject(obj) && isFunction(obj.toOperationNode);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/expression/expression.js
function isExpression(obj) {
  return isObject(obj) && "expressionType" in obj && isOperationNodeSource(obj);
}
function isAliasedExpression(obj) {
  return isObject(obj) && "expression" in obj && isString(obj.alias) && isOperationNodeSource(obj);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/select-modifier-node.js
var SelectModifierNode = freeze({
  is(node) {
    return node.kind === "SelectModifierNode";
  },
  create(modifier, of) {
    return freeze({
      kind: "SelectModifierNode",
      modifier,
      of
    });
  },
  createWithExpression(modifier) {
    return freeze({
      kind: "SelectModifierNode",
      rawModifier: modifier
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/and-node.js
var AndNode = freeze({
  is(node) {
    return node.kind === "AndNode";
  },
  create(left, right) {
    return freeze({
      kind: "AndNode",
      left,
      right
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/or-node.js
var OrNode = freeze({
  is(node) {
    return node.kind === "OrNode";
  },
  create(left, right) {
    return freeze({
      kind: "OrNode",
      left,
      right
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/on-node.js
var OnNode = freeze({
  is(node) {
    return node.kind === "OnNode";
  },
  create(filter) {
    return freeze({
      kind: "OnNode",
      on: filter
    });
  },
  cloneWithOperation(onNode, operator, operation) {
    return freeze({
      ...onNode,
      on: operator === "And" ? AndNode.create(onNode.on, operation) : OrNode.create(onNode.on, operation)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/join-node.js
var JoinNode = freeze({
  is(node) {
    return node.kind === "JoinNode";
  },
  create(joinType, table) {
    return freeze({
      kind: "JoinNode",
      joinType,
      table,
      on: void 0
    });
  },
  createWithOn(joinType, table, on) {
    return freeze({
      kind: "JoinNode",
      joinType,
      table,
      on: OnNode.create(on)
    });
  },
  cloneWithOn(joinNode, operation) {
    return freeze({
      ...joinNode,
      on: joinNode.on ? OnNode.cloneWithOperation(joinNode.on, "And", operation) : OnNode.create(operation)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/binary-operation-node.js
var BinaryOperationNode = freeze({
  is(node) {
    return node.kind === "BinaryOperationNode";
  },
  create(leftOperand, operator, rightOperand) {
    return freeze({
      kind: "BinaryOperationNode",
      leftOperand,
      operator,
      rightOperand
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/operator-node.js
var COMPARISON_OPERATORS = [
  "=",
  "==",
  "!=",
  "<>",
  ">",
  ">=",
  "<",
  "<=",
  "in",
  "not in",
  "is",
  "is not",
  "like",
  "not like",
  "match",
  "ilike",
  "not ilike",
  "@>",
  "<@",
  "^@",
  "&&",
  "?",
  "?&",
  "?|",
  "!<",
  "!>",
  "<=>",
  "!~",
  "~",
  "~*",
  "!~*",
  "@@",
  "@@@",
  "!!",
  "<->",
  "regexp",
  "is distinct from",
  "is not distinct from"
];
var ARITHMETIC_OPERATORS = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "^",
  "&",
  "|",
  "#",
  "<<",
  ">>"
];
var JSON_OPERATORS = ["->", "->>"];
var BINARY_OPERATORS = [
  ...COMPARISON_OPERATORS,
  ...ARITHMETIC_OPERATORS,
  "&&",
  "||"
];
var UNARY_FILTER_OPERATORS = ["exists", "not exists"];
var UNARY_OPERATORS = ["not", "-", ...UNARY_FILTER_OPERATORS];
var OPERATORS = [
  ...BINARY_OPERATORS,
  ...JSON_OPERATORS,
  ...UNARY_OPERATORS,
  "between",
  "between symmetric"
];
var OperatorNode = freeze({
  is(node) {
    return node.kind === "OperatorNode";
  },
  create(operator) {
    return freeze({
      kind: "OperatorNode",
      operator
    });
  }
});
function isOperator(op) {
  return isString(op) && OPERATORS.includes(op);
}
function isBinaryOperator(op) {
  return isString(op) && BINARY_OPERATORS.includes(op);
}
function isComparisonOperator(op) {
  return isString(op) && COMPARISON_OPERATORS.includes(op);
}
function isArithmeticOperator(op) {
  return isString(op) && ARITHMETIC_OPERATORS.includes(op);
}
function isJSONOperator(op) {
  return isString(op) && JSON_OPERATORS.includes(op);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/column-node.js
var ColumnNode = freeze({
  is(node) {
    return node.kind === "ColumnNode";
  },
  create(column) {
    return freeze({
      kind: "ColumnNode",
      column: IdentifierNode.create(column)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/select-all-node.js
var SelectAllNode = freeze({
  is(node) {
    return node.kind === "SelectAllNode";
  },
  create() {
    return freeze({
      kind: "SelectAllNode"
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/reference-node.js
var ReferenceNode = freeze({
  is(node) {
    return node.kind === "ReferenceNode";
  },
  create(column, table) {
    return freeze({
      kind: "ReferenceNode",
      table,
      column
    });
  },
  createSelectAll(table) {
    return freeze({
      kind: "ReferenceNode",
      table,
      column: SelectAllNode.create()
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dynamic/dynamic-reference-builder.js
var _dynamicReference;
var DynamicReferenceBuilder = class {
  constructor(reference) {
    __privateAdd(this, _dynamicReference);
    __privateSet(this, _dynamicReference, reference);
  }
  get dynamicReference() {
    return __privateGet(this, _dynamicReference);
  }
  /**
   * @private
   *
   * This needs to be here just so that the typings work. Without this
   * the generated .d.ts file contains no reference to the type param R
   * which causes this type to be equal to DynamicReferenceBuilder with
   * any R.
   */
  get refType() {
    return void 0;
  }
  toOperationNode() {
    return parseSimpleReferenceExpression(__privateGet(this, _dynamicReference));
  }
};
_dynamicReference = new WeakMap();
function isDynamicReferenceBuilder(obj) {
  return isObject(obj) && isOperationNodeSource(obj) && isString(obj.dynamicReference);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/order-by-item-node.js
var OrderByItemNode = freeze({
  is(node) {
    return node.kind === "OrderByItemNode";
  },
  create(orderBy, direction) {
    return freeze({
      kind: "OrderByItemNode",
      orderBy,
      direction
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/raw-node.js
var RawNode = freeze({
  is(node) {
    return node.kind === "RawNode";
  },
  create(sqlFragments, parameters) {
    return freeze({
      kind: "RawNode",
      sqlFragments: freeze(sqlFragments),
      parameters: freeze(parameters)
    });
  },
  createWithSql(sql2) {
    return RawNode.create([sql2], []);
  },
  createWithChild(child) {
    return RawNode.create(["", ""], [child]);
  },
  createWithChildren(children) {
    return RawNode.create(new Array(children.length + 1).fill(""), children);
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/collate-node.js
var CollateNode = {
  is(node) {
    return node.kind === "CollateNode";
  },
  create(collation) {
    return freeze({
      kind: "CollateNode",
      collation: IdentifierNode.create(collation)
    });
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/order-by-item-builder.js
var _props;
var _OrderByItemBuilder = class _OrderByItemBuilder {
  constructor(props) {
    __privateAdd(this, _props);
    __privateSet(this, _props, freeze(props));
  }
  /**
   * Adds `desc` to the `order by` item.
   *
   * See {@link asc} for the opposite.
   */
  desc() {
    return new _OrderByItemBuilder({
      node: OrderByItemNode.cloneWith(__privateGet(this, _props).node, {
        direction: RawNode.createWithSql("desc")
      })
    });
  }
  /**
   * Adds `asc` to the `order by` item.
   *
   * See {@link desc} for the opposite.
   */
  asc() {
    return new _OrderByItemBuilder({
      node: OrderByItemNode.cloneWith(__privateGet(this, _props).node, {
        direction: RawNode.createWithSql("asc")
      })
    });
  }
  /**
   * Adds `nulls last` to the `order by` item.
   *
   * This is only supported by some dialects like PostgreSQL and SQLite.
   *
   * See {@link nullsFirst} for the opposite.
   */
  nullsLast() {
    return new _OrderByItemBuilder({
      node: OrderByItemNode.cloneWith(__privateGet(this, _props).node, { nulls: "last" })
    });
  }
  /**
   * Adds `nulls first` to the `order by` item.
   *
   * This is only supported by some dialects like PostgreSQL and SQLite.
   *
   * See {@link nullsLast} for the opposite.
   */
  nullsFirst() {
    return new _OrderByItemBuilder({
      node: OrderByItemNode.cloneWith(__privateGet(this, _props).node, { nulls: "first" })
    });
  }
  /**
   * Adds `collate <collationName>` to the `order by` item.
   */
  collate(collation) {
    return new _OrderByItemBuilder({
      node: OrderByItemNode.cloneWith(__privateGet(this, _props).node, {
        collation: CollateNode.create(collation)
      })
    });
  }
  toOperationNode() {
    return __privateGet(this, _props).node;
  }
};
_props = new WeakMap();
var OrderByItemBuilder = _OrderByItemBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/log-once.js
var LOGGED_MESSAGES = /* @__PURE__ */ new Set();
function logOnce(message) {
  if (LOGGED_MESSAGES.has(message)) {
    return;
  }
  LOGGED_MESSAGES.add(message);
  console.log(message);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/order-by-parser.js
function isOrderByDirection(thing) {
  return thing === "asc" || thing === "desc";
}
function parseOrderBy(args) {
  if (args.length === 2) {
    return [parseOrderByItem(args[0], args[1])];
  }
  if (args.length === 1) {
    const [orderBy] = args;
    if (Array.isArray(orderBy)) {
      logOnce("orderBy(array) is deprecated, use multiple orderBy calls instead.");
      return orderBy.map((item) => parseOrderByItem(item));
    }
    return [parseOrderByItem(orderBy)];
  }
  throw new Error(`Invalid number of arguments at order by! expected 1-2, received ${args.length}`);
}
function parseOrderByItem(expr, modifiers) {
  const parsedRef = parseOrderByExpression(expr);
  if (OrderByItemNode.is(parsedRef)) {
    if (modifiers) {
      throw new Error("Cannot specify direction twice!");
    }
    return parsedRef;
  }
  return parseOrderByWithModifiers(parsedRef, modifiers);
}
function parseOrderByExpression(expr) {
  if (isExpressionOrFactory(expr)) {
    return parseExpression(expr);
  }
  if (isDynamicReferenceBuilder(expr)) {
    return expr.toOperationNode();
  }
  const [ref, direction] = expr.split(" ");
  if (direction) {
    logOnce("`orderBy('column asc')` is deprecated. Use `orderBy('column', 'asc')` instead.");
    return parseOrderByWithModifiers(parseStringReference(ref), direction);
  }
  return parseStringReference(expr);
}
function parseOrderByWithModifiers(expr, modifiers) {
  if (typeof modifiers === "string") {
    if (!isOrderByDirection(modifiers)) {
      throw new Error(`Invalid order by direction: ${modifiers}`);
    }
    return OrderByItemNode.create(expr, RawNode.createWithSql(modifiers));
  }
  if (isExpression(modifiers)) {
    logOnce("`orderBy(..., expr)` is deprecated. Use `orderBy(..., 'asc')` or `orderBy(..., (ob) => ...)` instead.");
    return OrderByItemNode.create(expr, modifiers.toOperationNode());
  }
  const node = OrderByItemNode.create(expr);
  if (!modifiers) {
    return node;
  }
  return modifiers(new OrderByItemBuilder({ node })).toOperationNode();
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/json-reference-node.js
var JSONReferenceNode = freeze({
  is(node) {
    return node.kind === "JSONReferenceNode";
  },
  create(reference, traversal) {
    return freeze({
      kind: "JSONReferenceNode",
      reference,
      traversal
    });
  },
  cloneWithTraversal(node, traversal) {
    return freeze({
      ...node,
      traversal
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/json-operator-chain-node.js
var JSONOperatorChainNode = freeze({
  is(node) {
    return node.kind === "JSONOperatorChainNode";
  },
  create(operator) {
    return freeze({
      kind: "JSONOperatorChainNode",
      operator,
      values: freeze([])
    });
  },
  cloneWithValue(node, value) {
    return freeze({
      ...node,
      values: freeze([...node.values, value])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/json-path-node.js
var JSONPathNode = freeze({
  is(node) {
    return node.kind === "JSONPathNode";
  },
  create(inOperator) {
    return freeze({
      kind: "JSONPathNode",
      inOperator,
      pathLegs: freeze([])
    });
  },
  cloneWithLeg(jsonPathNode, pathLeg) {
    return freeze({
      ...jsonPathNode,
      pathLegs: freeze([...jsonPathNode.pathLegs, pathLeg])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/reference-parser.js
function parseSimpleReferenceExpression(exp) {
  if (isString(exp)) {
    return parseStringReference(exp);
  }
  return exp.toOperationNode();
}
function parseReferenceExpressionOrList(arg) {
  if (isReadonlyArray(arg)) {
    return arg.map((it) => parseReferenceExpression(it));
  } else {
    return [parseReferenceExpression(arg)];
  }
}
function parseReferenceExpression(exp) {
  if (isExpressionOrFactory(exp)) {
    return parseExpression(exp);
  }
  return parseSimpleReferenceExpression(exp);
}
function parseJSONReference(ref, op) {
  const referenceNode = parseStringReference(ref);
  if (isJSONOperator(op)) {
    return JSONReferenceNode.create(referenceNode, JSONOperatorChainNode.create(OperatorNode.create(op)));
  }
  const opWithoutLastChar = op.slice(0, -1);
  if (isJSONOperator(opWithoutLastChar)) {
    return JSONReferenceNode.create(referenceNode, JSONPathNode.create(OperatorNode.create(opWithoutLastChar)));
  }
  throw new Error(`Invalid JSON operator: ${op}`);
}
function parseStringReference(ref) {
  const COLUMN_SEPARATOR = ".";
  if (!ref.includes(COLUMN_SEPARATOR)) {
    return ReferenceNode.create(ColumnNode.create(ref));
  }
  const parts = ref.split(COLUMN_SEPARATOR).map(trim);
  if (parts.length === 3) {
    return parseStringReferenceWithTableAndSchema(parts);
  }
  if (parts.length === 2) {
    return parseStringReferenceWithTable(parts);
  }
  throw new Error(`invalid column reference ${ref}`);
}
function parseAliasedStringReference(ref) {
  const ALIAS_SEPARATOR = " as ";
  if (ref.includes(ALIAS_SEPARATOR)) {
    const [columnRef, alias] = ref.split(ALIAS_SEPARATOR).map(trim);
    return AliasNode.create(parseStringReference(columnRef), IdentifierNode.create(alias));
  } else {
    return parseStringReference(ref);
  }
}
function parseColumnName(column) {
  return ColumnNode.create(column);
}
function parseOrderedColumnName(column) {
  const ORDER_SEPARATOR = " ";
  if (column.includes(ORDER_SEPARATOR)) {
    const [columnName, order] = column.split(ORDER_SEPARATOR).map(trim);
    if (!isOrderByDirection(order)) {
      throw new Error(`invalid order direction "${order}" next to "${columnName}"`);
    }
    return parseOrderBy([columnName, order])[0];
  } else {
    return parseColumnName(column);
  }
}
function parseStringReferenceWithTableAndSchema(parts) {
  const [schema, table, column] = parts;
  return ReferenceNode.create(ColumnNode.create(column), TableNode.createWithSchema(schema, table));
}
function parseStringReferenceWithTable(parts) {
  const [table, column] = parts;
  return ReferenceNode.create(ColumnNode.create(column), TableNode.create(table));
}
function trim(str) {
  return str.trim();
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/primitive-value-list-node.js
var PrimitiveValueListNode = freeze({
  is(node) {
    return node.kind === "PrimitiveValueListNode";
  },
  create(values) {
    return freeze({
      kind: "PrimitiveValueListNode",
      values: freeze([...values])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/value-list-node.js
var ValueListNode = freeze({
  is(node) {
    return node.kind === "ValueListNode";
  },
  create(values) {
    return freeze({
      kind: "ValueListNode",
      values: freeze(values)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/value-node.js
var ValueNode = freeze({
  is(node) {
    return node.kind === "ValueNode";
  },
  create(value) {
    return freeze({
      kind: "ValueNode",
      value
    });
  },
  createImmediate(value) {
    return freeze({
      kind: "ValueNode",
      value,
      immediate: true
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/value-parser.js
function parseValueExpressionOrList(arg) {
  if (isReadonlyArray(arg)) {
    return parseValueExpressionList(arg);
  }
  return parseValueExpression(arg);
}
function parseValueExpression(exp) {
  if (isExpressionOrFactory(exp)) {
    return parseExpression(exp);
  }
  return ValueNode.create(exp);
}
function isSafeImmediateValue(value) {
  return isNumber(value) || isBoolean(value) || isNull(value);
}
function parseSafeImmediateValue(value) {
  if (!isSafeImmediateValue(value)) {
    throw new Error(`unsafe immediate value ${JSON.stringify(value)}`);
  }
  return ValueNode.createImmediate(value);
}
function parseValueExpressionList(arg) {
  if (arg.some(isExpressionOrFactory)) {
    return ValueListNode.create(arg.map((it) => parseValueExpression(it)));
  }
  return PrimitiveValueListNode.create(arg);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/parens-node.js
var ParensNode = freeze({
  is(node) {
    return node.kind === "ParensNode";
  },
  create(node) {
    return freeze({
      kind: "ParensNode",
      node
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/binary-operation-parser.js
function parseValueBinaryOperationOrExpression(args) {
  if (args.length === 3) {
    return parseValueBinaryOperation(args[0], args[1], args[2]);
  } else if (args.length === 1) {
    return parseValueExpression(args[0]);
  }
  throw new Error(`invalid arguments: ${JSON.stringify(args)}`);
}
function parseValueBinaryOperation(left, operator, right) {
  if (isIsOperator(operator) && needsIsOperator(right)) {
    return BinaryOperationNode.create(parseReferenceExpression(left), parseOperator(operator), ValueNode.createImmediate(right));
  }
  return BinaryOperationNode.create(parseReferenceExpression(left), parseOperator(operator), parseValueExpressionOrList(right));
}
function parseReferentialBinaryOperation(left, operator, right) {
  return BinaryOperationNode.create(parseReferenceExpression(left), parseOperator(operator), parseReferenceExpression(right));
}
function parseFilterObject(obj, combinator) {
  return parseFilterList(Object.entries(obj).filter(([, v]) => !isUndefined(v)).map(([k, v]) => parseValueBinaryOperation(k, needsIsOperator(v) ? "is" : "=", v)), combinator);
}
function parseFilterList(list, combinator, withParens = true) {
  const combine = combinator === "and" ? AndNode.create : OrNode.create;
  if (list.length === 0) {
    return BinaryOperationNode.create(ValueNode.createImmediate(1), OperatorNode.create("="), ValueNode.createImmediate(combinator === "and" ? 1 : 0));
  }
  let node = toOperationNode(list[0]);
  for (let i = 1; i < list.length; ++i) {
    node = combine(node, toOperationNode(list[i]));
  }
  if (list.length > 1 && withParens) {
    return ParensNode.create(node);
  }
  return node;
}
function isIsOperator(operator) {
  return operator === "is" || operator === "is not";
}
function needsIsOperator(value) {
  return isNull(value) || isBoolean(value);
}
function parseOperator(operator) {
  if (isString(operator) && OPERATORS.includes(operator)) {
    return OperatorNode.create(operator);
  }
  if (isOperationNodeSource(operator)) {
    return operator.toOperationNode();
  }
  throw new Error(`invalid operator ${JSON.stringify(operator)}`);
}
function toOperationNode(nodeOrSource) {
  return isOperationNodeSource(nodeOrSource) ? nodeOrSource.toOperationNode() : nodeOrSource;
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/order-by-node.js
var OrderByNode = freeze({
  is(node) {
    return node.kind === "OrderByNode";
  },
  create(items) {
    return freeze({
      kind: "OrderByNode",
      items: freeze([...items])
    });
  },
  cloneWithItems(orderBy, items) {
    return freeze({
      ...orderBy,
      items: freeze([...orderBy.items, ...items])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/partition-by-node.js
var PartitionByNode = freeze({
  is(node) {
    return node.kind === "PartitionByNode";
  },
  create(items) {
    return freeze({
      kind: "PartitionByNode",
      items: freeze(items)
    });
  },
  cloneWithItems(partitionBy, items) {
    return freeze({
      ...partitionBy,
      items: freeze([...partitionBy.items, ...items])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/over-node.js
var OverNode = freeze({
  is(node) {
    return node.kind === "OverNode";
  },
  create() {
    return freeze({
      kind: "OverNode"
    });
  },
  cloneWithOrderByItems(overNode, items) {
    return freeze({
      ...overNode,
      orderBy: overNode.orderBy ? OrderByNode.cloneWithItems(overNode.orderBy, items) : OrderByNode.create(items)
    });
  },
  cloneWithPartitionByItems(overNode, items) {
    return freeze({
      ...overNode,
      partitionBy: overNode.partitionBy ? PartitionByNode.cloneWithItems(overNode.partitionBy, items) : PartitionByNode.create(items)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/from-node.js
var FromNode = freeze({
  is(node) {
    return node.kind === "FromNode";
  },
  create(froms) {
    return freeze({
      kind: "FromNode",
      froms: freeze(froms)
    });
  },
  cloneWithFroms(from, froms) {
    return freeze({
      ...from,
      froms: freeze([...from.froms, ...froms])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/group-by-node.js
var GroupByNode = freeze({
  is(node) {
    return node.kind === "GroupByNode";
  },
  create(items) {
    return freeze({
      kind: "GroupByNode",
      items: freeze(items)
    });
  },
  cloneWithItems(groupBy, items) {
    return freeze({
      ...groupBy,
      items: freeze([...groupBy.items, ...items])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/having-node.js
var HavingNode = freeze({
  is(node) {
    return node.kind === "HavingNode";
  },
  create(filter) {
    return freeze({
      kind: "HavingNode",
      having: filter
    });
  },
  cloneWithOperation(havingNode, operator, operation) {
    return freeze({
      ...havingNode,
      having: operator === "And" ? AndNode.create(havingNode.having, operation) : OrNode.create(havingNode.having, operation)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/insert-query-node.js
var InsertQueryNode = freeze({
  is(node) {
    return node.kind === "InsertQueryNode";
  },
  create(into, withNode, replace) {
    return freeze({
      kind: "InsertQueryNode",
      into,
      ...withNode && { with: withNode },
      replace
    });
  },
  createWithoutInto() {
    return freeze({
      kind: "InsertQueryNode"
    });
  },
  cloneWith(insertQuery, props) {
    return freeze({
      ...insertQuery,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/list-node.js
var ListNode = freeze({
  is(node) {
    return node.kind === "ListNode";
  },
  create(items) {
    return freeze({
      kind: "ListNode",
      items: freeze(items)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/update-query-node.js
var UpdateQueryNode = freeze({
  is(node) {
    return node.kind === "UpdateQueryNode";
  },
  create(tables, withNode) {
    return freeze({
      kind: "UpdateQueryNode",
      // For backwards compatibility, use the raw table node when there's only one table
      // and don't rename the property to something like `tables`.
      table: tables.length === 1 ? tables[0] : ListNode.create(tables),
      ...withNode && { with: withNode }
    });
  },
  createWithoutTable() {
    return freeze({
      kind: "UpdateQueryNode"
    });
  },
  cloneWithFromItems(updateQuery, fromItems) {
    return freeze({
      ...updateQuery,
      from: updateQuery.from ? FromNode.cloneWithFroms(updateQuery.from, fromItems) : FromNode.create(fromItems)
    });
  },
  cloneWithUpdates(updateQuery, updates) {
    return freeze({
      ...updateQuery,
      updates: updateQuery.updates ? freeze([...updateQuery.updates, ...updates]) : updates
    });
  },
  cloneWithLimit(updateQuery, limit) {
    return freeze({
      ...updateQuery,
      limit
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/using-node.js
var UsingNode = freeze({
  is(node) {
    return node.kind === "UsingNode";
  },
  create(tables) {
    return freeze({
      kind: "UsingNode",
      tables: freeze(tables)
    });
  },
  cloneWithTables(using, tables) {
    return freeze({
      ...using,
      tables: freeze([...using.tables, ...tables])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/delete-query-node.js
var DeleteQueryNode = freeze({
  is(node) {
    return node.kind === "DeleteQueryNode";
  },
  create(fromItems, withNode) {
    return freeze({
      kind: "DeleteQueryNode",
      from: FromNode.create(fromItems),
      ...withNode && { with: withNode }
    });
  },
  // TODO: remove in v0.29
  /**
   * @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
   */
  cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
  // TODO: remove in v0.29
  /**
   * @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
   */
  cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
  cloneWithLimit(deleteNode, limit) {
    return freeze({
      ...deleteNode,
      limit
    });
  },
  cloneWithoutLimit(deleteNode) {
    return freeze({
      ...deleteNode,
      limit: void 0
    });
  },
  cloneWithUsing(deleteNode, tables) {
    return freeze({
      ...deleteNode,
      using: deleteNode.using !== void 0 ? UsingNode.cloneWithTables(deleteNode.using, tables) : UsingNode.create(tables)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/where-node.js
var WhereNode = freeze({
  is(node) {
    return node.kind === "WhereNode";
  },
  create(filter) {
    return freeze({
      kind: "WhereNode",
      where: filter
    });
  },
  cloneWithOperation(whereNode, operator, operation) {
    return freeze({
      ...whereNode,
      where: operator === "And" ? AndNode.create(whereNode.where, operation) : OrNode.create(whereNode.where, operation)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/returning-node.js
var ReturningNode = freeze({
  is(node) {
    return node.kind === "ReturningNode";
  },
  create(selections) {
    return freeze({
      kind: "ReturningNode",
      selections: freeze(selections)
    });
  },
  cloneWithSelections(returning, selections) {
    return freeze({
      ...returning,
      selections: returning.selections ? freeze([...returning.selections, ...selections]) : freeze(selections)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/explain-node.js
var ExplainNode = freeze({
  is(node) {
    return node.kind === "ExplainNode";
  },
  create(format, options) {
    return freeze({
      kind: "ExplainNode",
      format,
      options
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/when-node.js
var WhenNode = freeze({
  is(node) {
    return node.kind === "WhenNode";
  },
  create(condition) {
    return freeze({
      kind: "WhenNode",
      condition
    });
  },
  cloneWithResult(whenNode, result) {
    return freeze({
      ...whenNode,
      result
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/merge-query-node.js
var MergeQueryNode = freeze({
  is(node) {
    return node.kind === "MergeQueryNode";
  },
  create(into, withNode) {
    return freeze({
      kind: "MergeQueryNode",
      into,
      ...withNode && { with: withNode }
    });
  },
  cloneWithUsing(mergeNode, using) {
    return freeze({
      ...mergeNode,
      using
    });
  },
  cloneWithWhen(mergeNode, when) {
    return freeze({
      ...mergeNode,
      whens: mergeNode.whens ? freeze([...mergeNode.whens, when]) : freeze([when])
    });
  },
  cloneWithThen(mergeNode, then) {
    return freeze({
      ...mergeNode,
      whens: mergeNode.whens ? freeze([
        ...mergeNode.whens.slice(0, -1),
        WhenNode.cloneWithResult(mergeNode.whens[mergeNode.whens.length - 1], then)
      ]) : void 0
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/output-node.js
var OutputNode = freeze({
  is(node) {
    return node.kind === "OutputNode";
  },
  create(selections) {
    return freeze({
      kind: "OutputNode",
      selections: freeze(selections)
    });
  },
  cloneWithSelections(output, selections) {
    return freeze({
      ...output,
      selections: output.selections ? freeze([...output.selections, ...selections]) : freeze(selections)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/query-node.js
var QueryNode = freeze({
  is(node) {
    return SelectQueryNode.is(node) || InsertQueryNode.is(node) || UpdateQueryNode.is(node) || DeleteQueryNode.is(node) || MergeQueryNode.is(node);
  },
  cloneWithEndModifier(node, modifier) {
    return freeze({
      ...node,
      endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
    });
  },
  cloneWithWhere(node, operation) {
    return freeze({
      ...node,
      where: node.where ? WhereNode.cloneWithOperation(node.where, "And", operation) : WhereNode.create(operation)
    });
  },
  cloneWithJoin(node, join) {
    return freeze({
      ...node,
      joins: node.joins ? freeze([...node.joins, join]) : freeze([join])
    });
  },
  cloneWithReturning(node, selections) {
    return freeze({
      ...node,
      returning: node.returning ? ReturningNode.cloneWithSelections(node.returning, selections) : ReturningNode.create(selections)
    });
  },
  cloneWithoutReturning(node) {
    return freeze({
      ...node,
      returning: void 0
    });
  },
  cloneWithoutWhere(node) {
    return freeze({
      ...node,
      where: void 0
    });
  },
  cloneWithExplain(node, format, options) {
    return freeze({
      ...node,
      explain: ExplainNode.create(format, options == null ? void 0 : options.toOperationNode())
    });
  },
  cloneWithTop(node, top) {
    return freeze({
      ...node,
      top
    });
  },
  cloneWithOutput(node, selections) {
    return freeze({
      ...node,
      output: node.output ? OutputNode.cloneWithSelections(node.output, selections) : OutputNode.create(selections)
    });
  },
  cloneWithOrderByItems(node, items) {
    return freeze({
      ...node,
      orderBy: node.orderBy ? OrderByNode.cloneWithItems(node.orderBy, items) : OrderByNode.create(items)
    });
  },
  cloneWithoutOrderBy(node) {
    return freeze({
      ...node,
      orderBy: void 0
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/select-query-node.js
var SelectQueryNode = freeze({
  is(node) {
    return node.kind === "SelectQueryNode";
  },
  create(withNode) {
    return freeze({
      kind: "SelectQueryNode",
      ...withNode && { with: withNode }
    });
  },
  createFrom(fromItems, withNode) {
    return freeze({
      kind: "SelectQueryNode",
      from: FromNode.create(fromItems),
      ...withNode && { with: withNode }
    });
  },
  cloneWithSelections(select, selections) {
    return freeze({
      ...select,
      selections: select.selections ? freeze([...select.selections, ...selections]) : freeze(selections)
    });
  },
  cloneWithDistinctOn(select, expressions) {
    return freeze({
      ...select,
      distinctOn: select.distinctOn ? freeze([...select.distinctOn, ...expressions]) : freeze(expressions)
    });
  },
  cloneWithFrontModifier(select, modifier) {
    return freeze({
      ...select,
      frontModifiers: select.frontModifiers ? freeze([...select.frontModifiers, modifier]) : freeze([modifier])
    });
  },
  // TODO: remove in v0.29
  /**
   * @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
   */
  cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
  cloneWithGroupByItems(selectNode, items) {
    return freeze({
      ...selectNode,
      groupBy: selectNode.groupBy ? GroupByNode.cloneWithItems(selectNode.groupBy, items) : GroupByNode.create(items)
    });
  },
  cloneWithLimit(selectNode, limit) {
    return freeze({
      ...selectNode,
      limit
    });
  },
  cloneWithOffset(selectNode, offset) {
    return freeze({
      ...selectNode,
      offset
    });
  },
  cloneWithFetch(selectNode, fetch) {
    return freeze({
      ...selectNode,
      fetch
    });
  },
  cloneWithHaving(selectNode, operation) {
    return freeze({
      ...selectNode,
      having: selectNode.having ? HavingNode.cloneWithOperation(selectNode.having, "And", operation) : HavingNode.create(operation)
    });
  },
  cloneWithSetOperations(selectNode, setOperations) {
    return freeze({
      ...selectNode,
      setOperations: selectNode.setOperations ? freeze([...selectNode.setOperations, ...setOperations]) : freeze([...setOperations])
    });
  },
  cloneWithoutSelections(select) {
    return freeze({
      ...select,
      selections: []
    });
  },
  cloneWithoutLimit(select) {
    return freeze({
      ...select,
      limit: void 0
    });
  },
  cloneWithoutOffset(select) {
    return freeze({
      ...select,
      offset: void 0
    });
  },
  // TODO: remove in v0.29
  /**
   * @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
   */
  cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
  cloneWithoutGroupBy(select) {
    return freeze({
      ...select,
      groupBy: void 0
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/join-builder.js
var _props2;
var _JoinBuilder = class _JoinBuilder {
  constructor(props) {
    __privateAdd(this, _props2);
    __privateSet(this, _props2, freeze(props));
  }
  on(...args) {
    return new _JoinBuilder({
      ...__privateGet(this, _props2),
      joinNode: JoinNode.cloneWithOn(__privateGet(this, _props2).joinNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  /**
   * Just like {@link WhereInterface.whereRef} but adds an item to the join's
   * `on` clause instead.
   *
   * See {@link WhereInterface.whereRef} for documentation and examples.
   */
  onRef(lhs, op, rhs) {
    return new _JoinBuilder({
      ...__privateGet(this, _props2),
      joinNode: JoinNode.cloneWithOn(__privateGet(this, _props2).joinNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  /**
   * Adds `on true`.
   */
  onTrue() {
    return new _JoinBuilder({
      ...__privateGet(this, _props2),
      joinNode: JoinNode.cloneWithOn(__privateGet(this, _props2).joinNode, RawNode.createWithSql("true"))
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props2).joinNode;
  }
};
_props2 = new WeakMap();
var JoinBuilder = _JoinBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/partition-by-item-node.js
var PartitionByItemNode = freeze({
  is(node) {
    return node.kind === "PartitionByItemNode";
  },
  create(partitionBy) {
    return freeze({
      kind: "PartitionByItemNode",
      partitionBy
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/partition-by-parser.js
function parsePartitionBy(partitionBy) {
  return parseReferenceExpressionOrList(partitionBy).map(PartitionByItemNode.create);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/over-builder.js
var _props3;
var _OverBuilder = class _OverBuilder {
  constructor(props) {
    __privateAdd(this, _props3);
    __privateSet(this, _props3, freeze(props));
  }
  orderBy(...args) {
    return new _OverBuilder({
      overNode: OverNode.cloneWithOrderByItems(__privateGet(this, _props3).overNode, parseOrderBy(args))
    });
  }
  clearOrderBy() {
    return new _OverBuilder({
      overNode: QueryNode.cloneWithoutOrderBy(__privateGet(this, _props3).overNode)
    });
  }
  partitionBy(partitionBy) {
    return new _OverBuilder({
      overNode: OverNode.cloneWithPartitionByItems(__privateGet(this, _props3).overNode, parsePartitionBy(partitionBy))
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props3).overNode;
  }
};
_props3 = new WeakMap();
var OverBuilder = _OverBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/selection-node.js
var SelectionNode = freeze({
  is(node) {
    return node.kind === "SelectionNode";
  },
  create(selection) {
    return freeze({
      kind: "SelectionNode",
      selection
    });
  },
  createSelectAll() {
    return freeze({
      kind: "SelectionNode",
      selection: SelectAllNode.create()
    });
  },
  createSelectAllFromTable(table) {
    return freeze({
      kind: "SelectionNode",
      selection: ReferenceNode.createSelectAll(table)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/select-parser.js
function parseSelectArg(selection) {
  if (isFunction(selection)) {
    return parseSelectArg(selection(expressionBuilder()));
  } else if (isReadonlyArray(selection)) {
    return selection.map((it) => parseSelectExpression(it));
  } else {
    return [parseSelectExpression(selection)];
  }
}
function parseSelectExpression(selection) {
  if (isString(selection)) {
    return SelectionNode.create(parseAliasedStringReference(selection));
  } else if (isDynamicReferenceBuilder(selection)) {
    return SelectionNode.create(selection.toOperationNode());
  } else {
    return SelectionNode.create(parseAliasedExpression(selection));
  }
}
function parseSelectAll(table) {
  if (!table) {
    return [SelectionNode.createSelectAll()];
  } else if (Array.isArray(table)) {
    return table.map(parseSelectAllArg);
  } else {
    return [parseSelectAllArg(table)];
  }
}
function parseSelectAllArg(table) {
  if (isString(table)) {
    return SelectionNode.createSelectAllFromTable(parseTable(table));
  }
  throw new Error(`invalid value selectAll expression: ${JSON.stringify(table)}`);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/values-node.js
var ValuesNode = freeze({
  is(node) {
    return node.kind === "ValuesNode";
  },
  create(values) {
    return freeze({
      kind: "ValuesNode",
      values: freeze(values)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/default-insert-value-node.js
var DefaultInsertValueNode = freeze({
  is(node) {
    return node.kind === "DefaultInsertValueNode";
  },
  create() {
    return freeze({
      kind: "DefaultInsertValueNode"
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/insert-values-parser.js
function parseInsertExpression(arg) {
  const objectOrList = isFunction(arg) ? arg(expressionBuilder()) : arg;
  const list = isReadonlyArray(objectOrList) ? objectOrList : freeze([objectOrList]);
  return parseInsertColumnsAndValues(list);
}
function parseInsertColumnsAndValues(rows) {
  const columns = parseColumnNamesAndIndexes(rows);
  return [
    freeze([...columns.keys()].map(ColumnNode.create)),
    ValuesNode.create(rows.map((row) => parseRowValues(row, columns)))
  ];
}
function parseColumnNamesAndIndexes(rows) {
  const columns = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const cols = Object.keys(row);
    for (const col of cols) {
      if (!columns.has(col) && row[col] !== void 0) {
        columns.set(col, columns.size);
      }
    }
  }
  return columns;
}
function parseRowValues(row, columns) {
  const rowColumns = Object.keys(row);
  const rowValues = Array.from({
    length: columns.size
  });
  let hasUndefinedOrComplexColumns = false;
  let indexedRowColumns = rowColumns.length;
  for (const col of rowColumns) {
    const columnIdx = columns.get(col);
    if (isUndefined(columnIdx)) {
      indexedRowColumns--;
      continue;
    }
    const value = row[col];
    if (isUndefined(value) || isExpressionOrFactory(value)) {
      hasUndefinedOrComplexColumns = true;
    }
    rowValues[columnIdx] = value;
  }
  const hasMissingColumns = indexedRowColumns < columns.size;
  if (hasMissingColumns || hasUndefinedOrComplexColumns) {
    const defaultValue = DefaultInsertValueNode.create();
    return ValueListNode.create(rowValues.map((it) => isUndefined(it) ? defaultValue : parseValueExpression(it)));
  }
  return PrimitiveValueListNode.create(rowValues);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/column-update-node.js
var ColumnUpdateNode = freeze({
  is(node) {
    return node.kind === "ColumnUpdateNode";
  },
  create(column, value) {
    return freeze({
      kind: "ColumnUpdateNode",
      column,
      value
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/update-set-parser.js
function parseUpdate(...args) {
  if (args.length === 2) {
    return [
      ColumnUpdateNode.create(parseReferenceExpression(args[0]), parseValueExpression(args[1]))
    ];
  }
  return parseUpdateObjectExpression(args[0]);
}
function parseUpdateObjectExpression(update) {
  const updateObj = isFunction(update) ? update(expressionBuilder()) : update;
  return Object.entries(updateObj).filter(([_, value]) => value !== void 0).map(([key, value]) => {
    return ColumnUpdateNode.create(ColumnNode.create(key), parseValueExpression(value));
  });
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/on-duplicate-key-node.js
var OnDuplicateKeyNode = freeze({
  is(node) {
    return node.kind === "OnDuplicateKeyNode";
  },
  create(updates) {
    return freeze({
      kind: "OnDuplicateKeyNode",
      updates
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/insert-result.js
var InsertResult = class {
  constructor(insertId, numInsertedOrUpdatedRows) {
    /**
     * The auto incrementing primary key of the inserted row.
     *
     * This property can be undefined when the query contains an `on conflict`
     * clause that makes the query succeed even when nothing gets inserted.
     *
     * This property is always undefined on dialects like PostgreSQL that
     * don't return the inserted id by default. On those dialects you need
     * to use the {@link ReturningInterface.returning | returning} method.
     */
    __publicField(this, "insertId");
    /**
     * Affected rows count.
     */
    __publicField(this, "numInsertedOrUpdatedRows");
    this.insertId = insertId;
    this.numInsertedOrUpdatedRows = numInsertedOrUpdatedRows;
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/no-result-error.js
var NoResultError = class extends Error {
  constructor(node) {
    super("no result");
    /**
     * The operation node tree of the query that was executed.
     */
    __publicField(this, "node");
    this.node = node;
  }
};
function isNoResultErrorConstructor(fn) {
  return Object.prototype.hasOwnProperty.call(fn, "prototype");
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/on-conflict-node.js
var OnConflictNode = freeze({
  is(node) {
    return node.kind === "OnConflictNode";
  },
  create() {
    return freeze({
      kind: "OnConflictNode"
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  },
  cloneWithIndexWhere(node, operation) {
    return freeze({
      ...node,
      indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "And", operation) : WhereNode.create(operation)
    });
  },
  cloneWithIndexOrWhere(node, operation) {
    return freeze({
      ...node,
      indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "Or", operation) : WhereNode.create(operation)
    });
  },
  cloneWithUpdateWhere(node, operation) {
    return freeze({
      ...node,
      updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "And", operation) : WhereNode.create(operation)
    });
  },
  cloneWithUpdateOrWhere(node, operation) {
    return freeze({
      ...node,
      updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "Or", operation) : WhereNode.create(operation)
    });
  },
  cloneWithoutIndexWhere(node) {
    return freeze({
      ...node,
      indexWhere: void 0
    });
  },
  cloneWithoutUpdateWhere(node) {
    return freeze({
      ...node,
      updateWhere: void 0
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/on-conflict-builder.js
var _props4;
var _OnConflictBuilder = class _OnConflictBuilder {
  constructor(props) {
    __privateAdd(this, _props4);
    __privateSet(this, _props4, freeze(props));
  }
  /**
   * Specify a single column as the conflict target.
   *
   * Also see the {@link columns}, {@link constraint} and {@link expression}
   * methods for alternative ways to specify the conflict target.
   */
  column(column) {
    const columnNode = ColumnNode.create(column);
    return new _OnConflictBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWith(__privateGet(this, _props4).onConflictNode, {
        columns: __privateGet(this, _props4).onConflictNode.columns ? freeze([...__privateGet(this, _props4).onConflictNode.columns, columnNode]) : freeze([columnNode])
      })
    });
  }
  /**
   * Specify a list of columns as the conflict target.
   *
   * Also see the {@link column}, {@link constraint} and {@link expression}
   * methods for alternative ways to specify the conflict target.
   */
  columns(columns) {
    const columnNodes = columns.map(ColumnNode.create);
    return new _OnConflictBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWith(__privateGet(this, _props4).onConflictNode, {
        columns: __privateGet(this, _props4).onConflictNode.columns ? freeze([...__privateGet(this, _props4).onConflictNode.columns, ...columnNodes]) : freeze(columnNodes)
      })
    });
  }
  /**
   * Specify a specific constraint by name as the conflict target.
   *
   * Also see the {@link column}, {@link columns} and {@link expression}
   * methods for alternative ways to specify the conflict target.
   */
  constraint(constraintName) {
    return new _OnConflictBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWith(__privateGet(this, _props4).onConflictNode, {
        constraint: IdentifierNode.create(constraintName)
      })
    });
  }
  /**
   * Specify an expression as the conflict target.
   *
   * This can be used if the unique index is an expression index.
   *
   * Also see the {@link column}, {@link columns} and {@link constraint}
   * methods for alternative ways to specify the conflict target.
   */
  expression(expression) {
    return new _OnConflictBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWith(__privateGet(this, _props4).onConflictNode, {
        indexExpression: expression.toOperationNode()
      })
    });
  }
  where(...args) {
    return new _OnConflictBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWithIndexWhere(__privateGet(this, _props4).onConflictNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  whereRef(lhs, op, rhs) {
    return new _OnConflictBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWithIndexWhere(__privateGet(this, _props4).onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  clearWhere() {
    return new _OnConflictBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWithoutIndexWhere(__privateGet(this, _props4).onConflictNode)
    });
  }
  /**
   * Adds the "do nothing" conflict action.
   *
   * ### Examples
   *
   * ```ts
   * const id = 1
   * const first_name = 'John'
   *
   * await db
   *   .insertInto('person')
   *   .values({ first_name, id })
   *   .onConflict((oc) => oc
   *     .column('id')
   *     .doNothing()
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name", "id")
   * values ($1, $2)
   * on conflict ("id") do nothing
   * ```
   */
  doNothing() {
    return new OnConflictDoNothingBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWith(__privateGet(this, _props4).onConflictNode, {
        doNothing: true
      })
    });
  }
  /**
   * Adds the "do update set" conflict action.
   *
   * ### Examples
   *
   * ```ts
   * const id = 1
   * const first_name = 'John'
   *
   * await db
   *   .insertInto('person')
   *   .values({ first_name, id })
   *   .onConflict((oc) => oc
   *     .column('id')
   *     .doUpdateSet({ first_name })
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name", "id")
   * values ($1, $2)
   * on conflict ("id")
   * do update set "first_name" = $3
   * ```
   *
   * In the next example we use the `ref` method to reference
   * columns of the virtual table `excluded` in a type-safe way
   * to create an upsert operation:
   *
   * ```ts
   * import type { NewPerson } from 'type-editor' // imaginary module
   *
   * async function upsertPerson(person: NewPerson): Promise<void> {
   *   await db.insertInto('person')
   *     .values(person)
   *     .onConflict((oc) => oc
   *       .column('id')
   *       .doUpdateSet((eb) => ({
   *         first_name: eb.ref('excluded.first_name'),
   *         last_name: eb.ref('excluded.last_name')
   *       })
   *     )
   *   )
   *   .execute()
   * }
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name", "last_name")
   * values ($1, $2)
   * on conflict ("id")
   * do update set
   *  "first_name" = excluded."first_name",
   *  "last_name" = excluded."last_name"
   * ```
   */
  doUpdateSet(update) {
    return new OnConflictUpdateBuilder({
      ...__privateGet(this, _props4),
      onConflictNode: OnConflictNode.cloneWith(__privateGet(this, _props4).onConflictNode, {
        updates: parseUpdateObjectExpression(update)
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
};
_props4 = new WeakMap();
var OnConflictBuilder = _OnConflictBuilder;
var _props5;
var OnConflictDoNothingBuilder = class {
  constructor(props) {
    __privateAdd(this, _props5);
    __privateSet(this, _props5, freeze(props));
  }
  toOperationNode() {
    return __privateGet(this, _props5).onConflictNode;
  }
};
_props5 = new WeakMap();
var _props6;
var _OnConflictUpdateBuilder = class _OnConflictUpdateBuilder {
  constructor(props) {
    __privateAdd(this, _props6);
    __privateSet(this, _props6, freeze(props));
  }
  where(...args) {
    return new _OnConflictUpdateBuilder({
      ...__privateGet(this, _props6),
      onConflictNode: OnConflictNode.cloneWithUpdateWhere(__privateGet(this, _props6).onConflictNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  /**
   * Specify a where condition for the update operation.
   *
   * See {@link WhereInterface.whereRef} for more info.
   */
  whereRef(lhs, op, rhs) {
    return new _OnConflictUpdateBuilder({
      ...__privateGet(this, _props6),
      onConflictNode: OnConflictNode.cloneWithUpdateWhere(__privateGet(this, _props6).onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  clearWhere() {
    return new _OnConflictUpdateBuilder({
      ...__privateGet(this, _props6),
      onConflictNode: OnConflictNode.cloneWithoutUpdateWhere(__privateGet(this, _props6).onConflictNode)
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props6).onConflictNode;
  }
};
_props6 = new WeakMap();
var OnConflictUpdateBuilder = _OnConflictUpdateBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/top-node.js
var TopNode = freeze({
  is(node) {
    return node.kind === "TopNode";
  },
  create(expression, modifiers) {
    return freeze({
      kind: "TopNode",
      expression,
      modifiers
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/top-parser.js
function parseTop(expression, modifiers) {
  if (!isNumber(expression) && !isBigInt(expression)) {
    throw new Error(`Invalid top expression: ${expression}`);
  }
  if (!isUndefined(modifiers) && !isTopModifiers(modifiers)) {
    throw new Error(`Invalid top modifiers: ${modifiers}`);
  }
  return TopNode.create(expression, modifiers);
}
function isTopModifiers(modifiers) {
  return modifiers === "percent" || modifiers === "with ties" || modifiers === "percent with ties";
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/or-action-node.js
var OrActionNode = freeze({
  is(node) {
    return node.kind === "OrActionNode";
  },
  create(action) {
    return freeze({
      kind: "OrActionNode",
      action
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/insert-query-builder.js
var _props7;
var _InsertQueryBuilder = class _InsertQueryBuilder {
  constructor(props) {
    __privateAdd(this, _props7);
    __privateSet(this, _props7, freeze(props));
  }
  /**
   * Sets the values to insert for an {@link Kysely.insertInto | insert} query.
   *
   * This method takes an object whose keys are column names and values are
   * values to insert. In addition to the column's type, the values can be
   * raw {@link sql} snippets or select queries.
   *
   * You must provide all fields you haven't explicitly marked as nullable
   * or optional using {@link Generated} or {@link ColumnType}.
   *
   * The return value of an `insert` query is an instance of {@link InsertResult}. The
   * {@link InsertResult.insertId | insertId} field holds the auto incremented primary
   * key if the database returned one.
   *
   * On PostgreSQL and some other dialects, you need to call `returning` to get
   * something out of the query.
   *
   * Also see the {@link expression} method for inserting the result of a select
   * query or any other expression.
   *
   * ### Examples
   *
   * <!-- siteExample("insert", "Single row", 10) -->
   *
   * Insert a single row:
   *
   * ```ts
   * const result = await db
   *   .insertInto('person')
   *   .values({
   *     first_name: 'Jennifer',
   *     last_name: 'Aniston',
   *     age: 40
   *   })
   *   .executeTakeFirst()
   *
   * // `insertId` is only available on dialects that
   * // automatically return the id of the inserted row
   * // such as MySQL and SQLite. On PostgreSQL, for example,
   * // you need to add a `returning` clause to the query to
   * // get anything out. See the "returning data" example.
   * console.log(result.insertId)
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * insert into `person` (`first_name`, `last_name`, `age`) values (?, ?, ?)
   * ```
   *
   * <!-- siteExample("insert", "Multiple rows", 20) -->
   *
   * On dialects that support it (for example PostgreSQL) you can insert multiple
   * rows by providing an array. Note that the return value is once again very
   * dialect-specific. Some databases may only return the id of the *last* inserted
   * row and some return nothing at all unless you call `returning`.
   *
   * ```ts
   * await db
   *   .insertInto('person')
   *   .values([{
   *     first_name: 'Jennifer',
   *     last_name: 'Aniston',
   *     age: 40,
   *   }, {
   *     first_name: 'Arnold',
   *     last_name: 'Schwarzenegger',
   *     age: 70,
   *   }])
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name", "last_name", "age") values (($1, $2, $3), ($4, $5, $6))
   * ```
   *
   * <!-- siteExample("insert", "Returning data", 30) -->
   *
   * On supported dialects like PostgreSQL you need to chain `returning` to the query to get
   * the inserted row's columns (or any other expression) as the return value. `returning`
   * works just like `select`. Refer to `select` method's examples and documentation for
   * more info.
   *
   * ```ts
   * const result = await db
   *   .insertInto('person')
   *   .values({
   *     first_name: 'Jennifer',
   *     last_name: 'Aniston',
   *     age: 40,
   *   })
   *   .returning(['id', 'first_name as name'])
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name", "last_name", "age") values ($1, $2, $3) returning "id", "first_name" as "name"
   * ```
   *
   * <!-- siteExample("insert", "Complex values", 40) -->
   *
   * In addition to primitives, the values can also be arbitrary expressions.
   * You can build the expressions by using a callback and calling the methods
   * on the expression builder passed to it:
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * const ani = "Ani"
   * const ston = "ston"
   *
   * const result = await db
   *   .insertInto('person')
   *   .values(({ ref, selectFrom, fn }) => ({
   *     first_name: 'Jennifer',
   *     last_name: sql<string>`concat(${ani}, ${ston})`,
   *     middle_name: ref('first_name'),
   *     age: selectFrom('person')
   *       .select(fn.avg<number>('age').as('avg_age')),
   *   }))
   *   .executeTakeFirst()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" (
   *   "first_name",
   *   "last_name",
   *   "middle_name",
   *   "age"
   * )
   * values (
   *   $1,
   *   concat($2, $3),
   *   "first_name",
   *   (select avg("age") as "avg_age" from "person")
   * )
   * ```
   *
   * You can also use the callback version of subqueries or raw expressions:
   *
   * ```ts
   * await db.with('jennifer', (db) => db
   *   .selectFrom('person')
   *   .where('first_name', '=', 'Jennifer')
   *   .select(['id', 'first_name', 'gender'])
   *   .limit(1)
   * ).insertInto('pet').values((eb) => ({
   *   owner_id: eb.selectFrom('jennifer').select('id'),
   *   name: eb.selectFrom('jennifer').select('first_name'),
   *   species: 'cat',
   * }))
   * .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * with "jennifer" as (
   *   select "id", "first_name", "gender"
   *   from "person"
   *   where "first_name" = $1
   *   limit $2
   * )
   * insert into "pet" ("owner_id", "name", "species")
   * values (
   *  (select "id" from "jennifer"),
   *  (select "first_name" from "jennifer"),
   *  $3
   * )
   * ```
   */
  values(insert) {
    const [columns, values] = parseInsertExpression(insert);
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        columns,
        values
      })
    });
  }
  /**
   * Sets the columns to insert.
   *
   * The {@link values} method sets both the columns and the values and this method
   * is not needed. But if you are using the {@link expression} method, you can use
   * this method to set the columns to insert.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .columns(['first_name'])
   *   .expression((eb) => eb.selectFrom('pet').select('pet.name'))
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name")
   * select "pet"."name" from "pet"
   * ```
   */
  columns(columns) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        columns: freeze(columns.map(ColumnNode.create))
      })
    });
  }
  /**
   * Insert an arbitrary expression. For example the result of a select query.
   *
   * ### Examples
   *
   * <!-- siteExample("insert", "Insert subquery", 50) -->
   *
   * You can create an `INSERT INTO SELECT FROM` query using the `expression` method.
   * This API doesn't follow our WYSIWYG principles and might be a bit difficult to
   * remember. The reasons for this design stem from implementation difficulties.
   *
   * ```ts
   * const result = await db.insertInto('person')
   *   .columns(['first_name', 'last_name', 'age'])
   *   .expression((eb) => eb
   *     .selectFrom('pet')
   *     .select((eb) => [
   *       'pet.name',
   *       eb.val('Petson').as('last_name'),
   *       eb.lit(7).as('age'),
   *     ])
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name", "last_name", "age")
   * select "pet"."name", $1 as "last_name", 7 as "age from "pet"
   * ```
   */
  expression(expression) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        values: parseExpression(expression)
      })
    });
  }
  /**
   * Creates an `insert into "person" default values` query.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .defaultValues()
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" default values
   * ```
   */
  defaultValues() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        defaultValues: true
      })
    });
  }
  /**
   * This can be used to add any additional SQL to the end of the query.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.insertInto('person')
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'male',
   *   })
   *   .modifyEnd(sql`-- This is a comment`)
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * insert into `person` ("first_name", "last_name", "gender")
   * values (?, ?, ?) -- This is a comment
   * ```
   */
  modifyEnd(modifier) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props7).queryNode, modifier.toOperationNode())
    });
  }
  /**
   * Changes an `insert into` query to an `insert ignore into` query.
   *
   * This is only supported by some dialects like MySQL.
   *
   * To avoid a footgun, when invoked with the SQLite dialect, this method will
   * be handled like {@link orIgnore}. See also, {@link orAbort}, {@link orFail},
   * {@link orReplace}, and {@link orRollback}.
   *
   * If you use the ignore modifier, ignorable errors that occur while executing the
   * insert statement are ignored. For example, without ignore, a row that duplicates
   * an existing unique index or primary key value in the table causes a duplicate-key
   * error and the statement is aborted. With ignore, the row is discarded and no error
   * occurs.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .ignore()
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'female',
   *   })
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
   * ```
   *
   * The generated SQL (SQLite):
   *
   * ```sql
   * insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
   * ```
   */
  ignore() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        orAction: OrActionNode.create("ignore")
      })
    });
  }
  /**
   * Changes an `insert into` query to an `insert or ignore into` query.
   *
   * This is only supported by some dialects like SQLite.
   *
   * To avoid a footgun, when invoked with the MySQL dialect, this method will
   * be handled like {@link ignore}.
   *
   * See also, {@link orAbort}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .orIgnore()
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'female',
   *   })
   *   .execute()
   * ```
   *
   * The generated SQL (SQLite):
   *
   * ```sql
   * insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
   * ```
   */
  orIgnore() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        orAction: OrActionNode.create("ignore")
      })
    });
  }
  /**
   * Changes an `insert into` query to an `insert or abort into` query.
   *
   * This is only supported by some dialects like SQLite.
   *
   * See also, {@link orIgnore}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .orAbort()
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'female',
   *   })
   *   .execute()
   * ```
   *
   * The generated SQL (SQLite):
   *
   * ```sql
   * insert or abort into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
   * ```
   */
  orAbort() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        orAction: OrActionNode.create("abort")
      })
    });
  }
  /**
   * Changes an `insert into` query to an `insert or fail into` query.
   *
   * This is only supported by some dialects like SQLite.
   *
   * See also, {@link orIgnore}, {@link orAbort}, {@link orReplace}, and {@link orRollback}.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .orFail()
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'female',
   *   })
   *   .execute()
   * ```
   *
   * The generated SQL (SQLite):
   *
   * ```sql
   * insert or fail into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
   * ```
   */
  orFail() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        orAction: OrActionNode.create("fail")
      })
    });
  }
  /**
   * Changes an `insert into` query to an `insert or replace into` query.
   *
   * This is only supported by some dialects like SQLite.
   *
   * You can also use {@link Kysely.replaceInto} to achieve the same result.
   *
   * See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orRollback}.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .orReplace()
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'female',
   *   })
   *   .execute()
   * ```
   *
   * The generated SQL (SQLite):
   *
   * ```sql
   * insert or replace into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
   * ```
   */
  orReplace() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        orAction: OrActionNode.create("replace")
      })
    });
  }
  /**
   * Changes an `insert into` query to an `insert or rollback into` query.
   *
   * This is only supported by some dialects like SQLite.
   *
   * See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orReplace}.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .orRollback()
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'female',
   *   })
   *   .execute()
   * ```
   *
   * The generated SQL (SQLite):
   *
   * ```sql
   * insert or rollback into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
   * ```
   */
  orRollback() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        orAction: OrActionNode.create("rollback")
      })
    });
  }
  /**
   * Changes an `insert into` query to an `insert top into` query.
   *
   * `top` clause is only supported by some dialects like MS SQL Server.
   *
   * ### Examples
   *
   * Insert the first 5 rows:
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.insertInto('person')
   *   .top(5)
   *   .columns(['first_name', 'gender'])
   *   .expression(
   *     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * insert top(5) into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
   * ```
   *
   * Insert the first 50 percent of rows:
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.insertInto('person')
   *   .top(50, 'percent')
   *   .columns(['first_name', 'gender'])
   *   .expression(
   *     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * insert top(50) percent into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
   * ```
   */
  top(expression, modifiers) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithTop(__privateGet(this, _props7).queryNode, parseTop(expression, modifiers))
    });
  }
  /**
   * Adds an `on conflict` clause to the query.
   *
   * `on conflict` is only supported by some dialects like PostgreSQL and SQLite. On MySQL
   * you can use {@link ignore} and {@link onDuplicateKeyUpdate} to achieve similar results.
   *
   * ### Examples
   *
   * ```ts
   * await db
   *   .insertInto('pet')
   *   .values({
   *     name: 'Catto',
   *     species: 'cat',
   *     owner_id: 3,
   *   })
   *   .onConflict((oc) => oc
   *     .column('name')
   *     .doUpdateSet({ species: 'hamster' })
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "pet" ("name", "species", "owner_id")
   * values ($1, $2, $3)
   * on conflict ("name")
   * do update set "species" = $4
   * ```
   *
   * You can provide the name of the constraint instead of a column name:
   *
   * ```ts
   * await db
   *   .insertInto('pet')
   *   .values({
   *     name: 'Catto',
   *     species: 'cat',
   *     owner_id: 3,
   *   })
   *   .onConflict((oc) => oc
   *     .constraint('pet_name_key')
   *     .doUpdateSet({ species: 'hamster' })
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "pet" ("name", "species", "owner_id")
   * values ($1, $2, $3)
   * on conflict on constraint "pet_name_key"
   * do update set "species" = $4
   * ```
   *
   * You can also specify an expression as the conflict target in case
   * the unique index is an expression index:
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db
   *   .insertInto('pet')
   *   .values({
   *     name: 'Catto',
   *     species: 'cat',
   *     owner_id: 3,
   *   })
   *   .onConflict((oc) => oc
   *     .expression(sql<string>`lower(name)`)
   *     .doUpdateSet({ species: 'hamster' })
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "pet" ("name", "species", "owner_id")
   * values ($1, $2, $3)
   * on conflict (lower(name))
   * do update set "species" = $4
   * ```
   *
   * You can add a filter for the update statement like this:
   *
   * ```ts
   * await db
   *   .insertInto('pet')
   *   .values({
   *     name: 'Catto',
   *     species: 'cat',
   *     owner_id: 3,
   *   })
   *   .onConflict((oc) => oc
   *     .column('name')
   *     .doUpdateSet({ species: 'hamster' })
   *     .where('excluded.name', '!=', 'Catto')
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "pet" ("name", "species", "owner_id")
   * values ($1, $2, $3)
   * on conflict ("name")
   * do update set "species" = $4
   * where "excluded"."name" != $5
   * ```
   *
   * You can create an `on conflict do nothing` clauses like this:
   *
   * ```ts
   * await db
   *   .insertInto('pet')
   *   .values({
   *     name: 'Catto',
   *     species: 'cat',
   *     owner_id: 3,
   *   })
   *   .onConflict((oc) => oc
   *     .column('name')
   *     .doNothing()
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "pet" ("name", "species", "owner_id")
   * values ($1, $2, $3)
   * on conflict ("name") do nothing
   * ```
   *
   * You can refer to the columns of the virtual `excluded` table
   * in a type-safe way using a callback and the `ref` method of
   * `ExpressionBuilder`:
   *
   * ```ts
   * await db.insertInto('person')
   *   .values({
   *     id: 1,
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'male',
   *   })
   *   .onConflict(oc => oc
   *     .column('id')
   *     .doUpdateSet({
   *       first_name: (eb) => eb.ref('excluded.first_name'),
   *       last_name: (eb) => eb.ref('excluded.last_name')
   *     })
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * insert into "person" ("id", "first_name", "last_name", "gender")
   * values ($1, $2, $3, $4)
   * on conflict ("id")
   * do update set
   *  "first_name" = "excluded"."first_name",
   *  "last_name" = "excluded"."last_name"
   * ```
   */
  onConflict(callback) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        onConflict: callback(new OnConflictBuilder({
          onConflictNode: OnConflictNode.create()
        })).toOperationNode()
      })
    });
  }
  /**
   * Adds `on duplicate key update` to the query.
   *
   * If you specify `on duplicate key update`, and a row is inserted that would cause
   * a duplicate value in a unique index or primary key, an update of the old row occurs.
   *
   * This is only implemented by some dialects like MySQL. On most dialects you should
   * use {@link onConflict} instead.
   *
   * ### Examples
   *
   * ```ts
   * await db
   *   .insertInto('person')
   *   .values({
   *     id: 1,
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'male',
   *   })
   *   .onDuplicateKeyUpdate({ updated_at: new Date().toISOString() })
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * insert into `person` (`id`, `first_name`, `last_name`, `gender`)
   * values (?, ?, ?, ?)
   * on duplicate key update `updated_at` = ?
   * ```
   */
  onDuplicateKeyUpdate(update) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: InsertQueryNode.cloneWith(__privateGet(this, _props7).queryNode, {
        onDuplicateKey: OnDuplicateKeyNode.create(parseUpdateObjectExpression(update))
      })
    });
  }
  returning(selection) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props7).queryNode, parseSelectArg(selection))
    });
  }
  returningAll() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props7).queryNode, parseSelectAll())
    });
  }
  output(args) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props7).queryNode, parseSelectArg(args))
    });
  }
  outputAll(table) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props7).queryNode, parseSelectAll(table))
    });
  }
  /**
   * Clears all `returning` clauses from the query.
   *
   * ### Examples
   *
   * ```ts
   * await db.insertInto('person')
   *   .values({ first_name: 'James', last_name: 'Smith', gender: 'male' })
   *   .returning(['first_name'])
   *   .clearReturning()
   *   .execute()
   * ```
   *
   * The generated SQL(PostgreSQL):
   *
   * ```sql
   * insert into "person" ("first_name", "last_name", "gender") values ($1, $2, $3)
   * ```
   */
  clearReturning() {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithoutReturning(__privateGet(this, _props7).queryNode)
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   *
   * If you want to conditionally call a method on `this`, see
   * the {@link $if} method.
   *
   * ### Examples
   *
   * The next example uses a helper function `log` to log a query:
   *
   * ```ts
   * import type { Compilable } from 'kysely'
   *
   * function log<T extends Compilable>(qb: T): T {
   *   console.log(qb.compile())
   *   return qb
   * }
   *
   * await db.insertInto('person')
   *   .values({ first_name: 'John', last_name: 'Doe', gender: 'male' })
   *   .$call(log)
   *   .execute()
   * ```
   */
  $call(func) {
    return func(this);
  }
  /**
   * Call `func(this)` if `condition` is true.
   *
   * This method is especially handy with optional selects. Any `returning` or `returningAll`
   * method calls add columns as optional fields to the output type when called inside
   * the `func` callback. This is because we can't know if those selections were actually
   * made before running the code.
   *
   * You can also call any other methods inside the callback.
   *
   * ### Examples
   *
   * ```ts
   * import type { NewPerson } from 'type-editor' // imaginary module
   *
   * async function insertPerson(values: NewPerson, returnLastName: boolean) {
   *   return await db
   *     .insertInto('person')
   *     .values(values)
   *     .returning(['id', 'first_name'])
   *     .$if(returnLastName, (qb) => qb.returning('last_name'))
   *     .executeTakeFirstOrThrow()
   * }
   * ```
   *
   * Any selections added inside the `if` callback will be added as optional fields to the
   * output type since we can't know if the selections were actually made before running
   * the code. In the example above the return type of the `insertPerson` function is:
   *
   * ```ts
   * Promise<{
   *   id: number
   *   first_name: string
   *   last_name?: string
   * }>
   * ```
   */
  $if(condition, func) {
    if (condition) {
      return func(this);
    }
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7)
    });
  }
  /**
   * Change the output type of the query.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `InsertQueryBuilder` with a new output type.
   */
  $castTo() {
    return new _InsertQueryBuilder(__privateGet(this, _props7));
  }
  /**
   * Narrows (parts of) the output type of the query.
   *
   * Kysely tries to be as type-safe as possible, but in some cases we have to make
   * compromises for better maintainability and compilation performance. At present,
   * Kysely doesn't narrow the output type of the query based on {@link values} input
   * when using {@link returning} or {@link returningAll}.
   *
   * This utility method is very useful for these situations, as it removes unncessary
   * runtime assertion/guard code. Its input type is limited to the output type
   * of the query, so you can't add a column that doesn't exist, or change a column's
   * type to something that doesn't exist in its union type.
   *
   * ### Examples
   *
   * Turn this code:
   *
   * ```ts
   * import type { Person } from 'type-editor' // imaginary module
   *
   * const person = await db.insertInto('person')
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'male',
   *     nullable_column: 'hell yeah!'
   *   })
   *   .returningAll()
   *   .executeTakeFirstOrThrow()
   *
   * if (isWithNoNullValue(person)) {
   *   functionThatExpectsPersonWithNonNullValue(person)
   * }
   *
   * function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
   *   return person.nullable_column != null
   * }
   * ```
   *
   * Into this:
   *
   * ```ts
   * import type { NotNull } from 'kysely'
   *
   * const person = await db.insertInto('person')
   *   .values({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *     gender: 'male',
   *     nullable_column: 'hell yeah!'
   *   })
   *   .returningAll()
   *   .$narrowType<{ nullable_column: NotNull }>()
   *   .executeTakeFirstOrThrow()
   *
   * functionThatExpectsPersonWithNonNullValue(person)
   * ```
   */
  $narrowType() {
    return new _InsertQueryBuilder(__privateGet(this, _props7));
  }
  /**
   * Asserts that query's output row type equals the given type `T`.
   *
   * This method can be used to simplify excessively complex types to make TypeScript happy
   * and much faster.
   *
   * Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
   * for TypeScript and you get errors like this:
   *
   * ```
   * error TS2589: Type instantiation is excessively deep and possibly infinite.
   * ```
   *
   * In these case you can often use this method to help TypeScript a little bit. When you use this
   * method to assert the output type of a query, Kysely can drop the complex output type that
   * consists of multiple nested helper types and replace it with the simple asserted type.
   *
   * Using this method doesn't reduce type safety at all. You have to pass in a type that is
   * structurally equal to the current type.
   *
   * ### Examples
   *
   * ```ts
   * import type { NewPerson, NewPet, Species } from 'type-editor' // imaginary module
   *
   * async function insertPersonAndPet(person: NewPerson, pet: Omit<NewPet, 'owner_id'>) {
   *   return await db
   *     .with('new_person', (qb) => qb
   *       .insertInto('person')
   *       .values(person)
   *       .returning('id')
   *       .$assertType<{ id: number }>()
   *     )
   *     .with('new_pet', (qb) => qb
   *       .insertInto('pet')
   *       .values((eb) => ({
   *         owner_id: eb.selectFrom('new_person').select('id'),
   *         ...pet
   *       }))
   *       .returning(['name as pet_name', 'species'])
   *       .$assertType<{ pet_name: string, species: Species }>()
   *     )
   *     .selectFrom(['new_person', 'new_pet'])
   *     .selectAll()
   *     .executeTakeFirstOrThrow()
   * }
   * ```
   */
  $assertType() {
    return new _InsertQueryBuilder(__privateGet(this, _props7));
  }
  /**
   * Returns a copy of this InsertQueryBuilder instance with the given plugin installed.
   */
  withPlugin(plugin) {
    return new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      executor: __privateGet(this, _props7).executor.withPlugin(plugin)
    });
  }
  toOperationNode() {
    return __privateGet(this, _props7).executor.transformQuery(__privateGet(this, _props7).queryNode, __privateGet(this, _props7).queryId);
  }
  compile() {
    return __privateGet(this, _props7).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props7).queryId);
  }
  /**
   * Executes the query and returns an array of rows.
   *
   * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
   */
  async execute() {
    const compiledQuery = this.compile();
    const result = await __privateGet(this, _props7).executor.executeQuery(compiledQuery, __privateGet(this, _props7).queryId);
    const { adapter } = __privateGet(this, _props7).executor;
    const query = compiledQuery.query;
    if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) {
      return result.rows;
    }
    return [
      new InsertResult(result.insertId, result.numAffectedRows ?? BigInt(0))
    ];
  }
  /**
   * Executes the query and returns the first result or undefined if
   * the query returned no result.
   */
  async executeTakeFirst() {
    const [result] = await this.execute();
    return result;
  }
  /**
   * Executes the query and returns the first result or throws if
   * the query returned no result.
   *
   * By default an instance of {@link NoResultError} is thrown, but you can
   * provide a custom error class, or callback as the only argument to throw a different
   * error.
   */
  async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
    const result = await this.executeTakeFirst();
    if (result === void 0) {
      const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
      throw error;
    }
    return result;
  }
  async *stream(chunkSize = 100) {
    const compiledQuery = this.compile();
    const stream = __privateGet(this, _props7).executor.stream(compiledQuery, chunkSize, __privateGet(this, _props7).queryId);
    for await (const item of stream) {
      yield* item.rows;
    }
  }
  async explain(format, options) {
    const builder = new _InsertQueryBuilder({
      ...__privateGet(this, _props7),
      queryNode: QueryNode.cloneWithExplain(__privateGet(this, _props7).queryNode, format, options)
    });
    return await builder.execute();
  }
};
_props7 = new WeakMap();
var InsertQueryBuilder = _InsertQueryBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/delete-result.js
var DeleteResult = class {
  constructor(numDeletedRows) {
    __publicField(this, "numDeletedRows");
    this.numDeletedRows = numDeletedRows;
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/limit-node.js
var LimitNode = freeze({
  is(node) {
    return node.kind === "LimitNode";
  },
  create(limit) {
    return freeze({
      kind: "LimitNode",
      limit
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/delete-query-builder.js
var _props8, _DeleteQueryBuilder_instances, join_fn;
var _DeleteQueryBuilder = class _DeleteQueryBuilder {
  constructor(props) {
    __privateAdd(this, _DeleteQueryBuilder_instances);
    __privateAdd(this, _props8);
    __privateSet(this, _props8, freeze(props));
  }
  where(...args) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithWhere(__privateGet(this, _props8).queryNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  whereRef(lhs, op, rhs) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithWhere(__privateGet(this, _props8).queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  clearWhere() {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithoutWhere(__privateGet(this, _props8).queryNode)
    });
  }
  /**
   * Changes a `delete from` query into a `delete top from` query.
   *
   * `top` clause is only supported by some dialects like MS SQL Server.
   *
   * ### Examples
   *
   * Delete the first 5 rows:
   *
   * ```ts
   * await db
   *   .deleteFrom('person')
   *   .top(5)
   *   .where('age', '>', 18)
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * delete top(5) from "person" where "age" > @1
   * ```
   *
   * Delete the first 50% of rows:
   *
   * ```ts
   * await db
   *   .deleteFrom('person')
   *   .top(50, 'percent')
   *   .where('age', '>', 18)
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * delete top(50) percent from "person" where "age" > @1
   * ```
   */
  top(expression, modifiers) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithTop(__privateGet(this, _props8).queryNode, parseTop(expression, modifiers))
    });
  }
  using(tables) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: DeleteQueryNode.cloneWithUsing(__privateGet(this, _props8).queryNode, parseTableExpressionOrList(tables))
    });
  }
  innerJoin(...args) {
    return __privateMethod(this, _DeleteQueryBuilder_instances, join_fn).call(this, "InnerJoin", args);
  }
  leftJoin(...args) {
    return __privateMethod(this, _DeleteQueryBuilder_instances, join_fn).call(this, "LeftJoin", args);
  }
  rightJoin(...args) {
    return __privateMethod(this, _DeleteQueryBuilder_instances, join_fn).call(this, "RightJoin", args);
  }
  fullJoin(...args) {
    return __privateMethod(this, _DeleteQueryBuilder_instances, join_fn).call(this, "FullJoin", args);
  }
  returning(selection) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props8).queryNode, parseSelectArg(selection))
    });
  }
  returningAll(table) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props8).queryNode, parseSelectAll(table))
    });
  }
  output(args) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props8).queryNode, parseSelectArg(args))
    });
  }
  outputAll(table) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props8).queryNode, parseSelectAll(table))
    });
  }
  /**
   * Clears all `returning` clauses from the query.
   *
   * ### Examples
   *
   * ```ts
   * await db.deleteFrom('pet')
   *   .returningAll()
   *   .where('name', '=', 'Max')
   *   .clearReturning()
   *   .execute()
   * ```
   *
   * The generated SQL(PostgreSQL):
   *
   * ```sql
   * delete from "pet" where "name" = "Max"
   * ```
   */
  clearReturning() {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithoutReturning(__privateGet(this, _props8).queryNode)
    });
  }
  /**
   * Clears the `limit` clause from the query.
   *
   * ### Examples
   *
   * ```ts
   * await db.deleteFrom('pet')
   *   .returningAll()
   *   .where('name', '=', 'Max')
   *   .limit(5)
   *   .clearLimit()
   *   .execute()
   * ```
   *
   * The generated SQL(PostgreSQL):
   *
   * ```sql
   * delete from "pet" where "name" = "Max" returning *
   * ```
   */
  clearLimit() {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: DeleteQueryNode.cloneWithoutLimit(__privateGet(this, _props8).queryNode)
    });
  }
  orderBy(...args) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithOrderByItems(__privateGet(this, _props8).queryNode, parseOrderBy(args))
    });
  }
  clearOrderBy() {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithoutOrderBy(__privateGet(this, _props8).queryNode)
    });
  }
  /**
   * Adds a limit clause to the query.
   *
   * A limit clause in a delete query is only supported by some dialects
   * like MySQL.
   *
   * ### Examples
   *
   * Delete 5 oldest items in a table:
   *
   * ```ts
   * await db
   *   .deleteFrom('pet')
   *   .orderBy('created_at')
   *   .limit(5)
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * delete from `pet` order by `created_at` limit ?
   * ```
   */
  limit(limit) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: DeleteQueryNode.cloneWithLimit(__privateGet(this, _props8).queryNode, LimitNode.create(parseValueExpression(limit)))
    });
  }
  /**
   * This can be used to add any additional SQL to the end of the query.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.deleteFrom('person')
   *   .where('first_name', '=', 'John')
   *   .modifyEnd(sql`-- This is a comment`)
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * delete from `person`
   * where `first_name` = "John" -- This is a comment
   * ```
   */
  modifyEnd(modifier) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props8).queryNode, modifier.toOperationNode())
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   *
   * If you want to conditionally call a method on `this`, see
   * the {@link $if} method.
   *
   * ### Examples
   *
   * The next example uses a helper function `log` to log a query:
   *
   * ```ts
   * import type { Compilable } from 'kysely'
   *
   * function log<T extends Compilable>(qb: T): T {
   *   console.log(qb.compile())
   *   return qb
   * }
   *
   * await db.deleteFrom('person')
   *   .$call(log)
   *   .execute()
   * ```
   */
  $call(func) {
    return func(this);
  }
  /**
   * Call `func(this)` if `condition` is true.
   *
   * This method is especially handy with optional selects. Any `returning` or `returningAll`
   * method calls add columns as optional fields to the output type when called inside
   * the `func` callback. This is because we can't know if those selections were actually
   * made before running the code.
   *
   * You can also call any other methods inside the callback.
   *
   * ### Examples
   *
   * ```ts
   * async function deletePerson(id: number, returnLastName: boolean) {
   *   return await db
   *     .deleteFrom('person')
   *     .where('id', '=', id)
   *     .returning(['id', 'first_name'])
   *     .$if(returnLastName, (qb) => qb.returning('last_name'))
   *     .executeTakeFirstOrThrow()
   * }
   * ```
   *
   * Any selections added inside the `if` callback will be added as optional fields to the
   * output type since we can't know if the selections were actually made before running
   * the code. In the example above the return type of the `deletePerson` function is:
   *
   * ```ts
   * Promise<{
   *   id: number
   *   first_name: string
   *   last_name?: string
   * }>
   * ```
   */
  $if(condition, func) {
    if (condition) {
      return func(this);
    }
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8)
    });
  }
  /**
   * Change the output type of the query.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `DeleteQueryBuilder` with a new output type.
   */
  $castTo() {
    return new _DeleteQueryBuilder(__privateGet(this, _props8));
  }
  /**
   * Narrows (parts of) the output type of the query.
   *
   * Kysely tries to be as type-safe as possible, but in some cases we have to make
   * compromises for better maintainability and compilation performance. At present,
   * Kysely doesn't narrow the output type of the query when using {@link where} and {@link returning} or {@link returningAll}.
   *
   * This utility method is very useful for these situations, as it removes unncessary
   * runtime assertion/guard code. Its input type is limited to the output type
   * of the query, so you can't add a column that doesn't exist, or change a column's
   * type to something that doesn't exist in its union type.
   *
   * ### Examples
   *
   * Turn this code:
   *
   * ```ts
   * import type { Person } from 'type-editor' // imaginary module
   *
   * const person = await db.deleteFrom('person')
   *   .where('id', '=', 3)
   *   .where('nullable_column', 'is not', null)
   *   .returningAll()
   *   .executeTakeFirstOrThrow()
   *
   * if (isWithNoNullValue(person)) {
   *   functionThatExpectsPersonWithNonNullValue(person)
   * }
   *
   * function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
   *   return person.nullable_column != null
   * }
   * ```
   *
   * Into this:
   *
   * ```ts
   * import type { NotNull } from 'kysely'
   *
   * const person = await db.deleteFrom('person')
   *   .where('id', '=', 3)
   *   .where('nullable_column', 'is not', null)
   *   .returningAll()
   *   .$narrowType<{ nullable_column: NotNull }>()
   *   .executeTakeFirstOrThrow()
   *
   * functionThatExpectsPersonWithNonNullValue(person)
   * ```
   */
  $narrowType() {
    return new _DeleteQueryBuilder(__privateGet(this, _props8));
  }
  /**
   * Asserts that query's output row type equals the given type `T`.
   *
   * This method can be used to simplify excessively complex types to make TypeScript happy
   * and much faster.
   *
   * Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
   * for TypeScript and you get errors like this:
   *
   * ```
   * error TS2589: Type instantiation is excessively deep and possibly infinite.
   * ```
   *
   * In these case you can often use this method to help TypeScript a little bit. When you use this
   * method to assert the output type of a query, Kysely can drop the complex output type that
   * consists of multiple nested helper types and replace it with the simple asserted type.
   *
   * Using this method doesn't reduce type safety at all. You have to pass in a type that is
   * structurally equal to the current type.
   *
   * ### Examples
   *
   * ```ts
   * import type { Species } from 'type-editor' // imaginary module
   *
   * async function deletePersonAndPets(personId: number) {
   *   return await db
   *     .with('deleted_person', (qb) => qb
   *        .deleteFrom('person')
   *        .where('id', '=', personId)
   *        .returning('first_name')
   *        .$assertType<{ first_name: string }>()
   *     )
   *     .with('deleted_pets', (qb) => qb
   *       .deleteFrom('pet')
   *       .where('owner_id', '=', personId)
   *       .returning(['name as pet_name', 'species'])
   *       .$assertType<{ pet_name: string, species: Species }>()
   *     )
   *     .selectFrom(['deleted_person', 'deleted_pets'])
   *     .selectAll()
   *     .execute()
   * }
   * ```
   */
  $assertType() {
    return new _DeleteQueryBuilder(__privateGet(this, _props8));
  }
  /**
   * Returns a copy of this DeleteQueryBuilder instance with the given plugin installed.
   */
  withPlugin(plugin) {
    return new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      executor: __privateGet(this, _props8).executor.withPlugin(plugin)
    });
  }
  toOperationNode() {
    return __privateGet(this, _props8).executor.transformQuery(__privateGet(this, _props8).queryNode, __privateGet(this, _props8).queryId);
  }
  compile() {
    return __privateGet(this, _props8).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props8).queryId);
  }
  /**
   * Executes the query and returns an array of rows.
   *
   * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
   */
  async execute() {
    const compiledQuery = this.compile();
    const result = await __privateGet(this, _props8).executor.executeQuery(compiledQuery, __privateGet(this, _props8).queryId);
    const { adapter } = __privateGet(this, _props8).executor;
    const query = compiledQuery.query;
    if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) {
      return result.rows;
    }
    return [new DeleteResult(result.numAffectedRows ?? BigInt(0))];
  }
  /**
   * Executes the query and returns the first result or undefined if
   * the query returned no result.
   */
  async executeTakeFirst() {
    const [result] = await this.execute();
    return result;
  }
  /**
   * Executes the query and returns the first result or throws if
   * the query returned no result.
   *
   * By default an instance of {@link NoResultError} is thrown, but you can
   * provide a custom error class, or callback as the only argument to throw a different
   * error.
   */
  async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
    const result = await this.executeTakeFirst();
    if (result === void 0) {
      const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
      throw error;
    }
    return result;
  }
  async *stream(chunkSize = 100) {
    const compiledQuery = this.compile();
    const stream = __privateGet(this, _props8).executor.stream(compiledQuery, chunkSize, __privateGet(this, _props8).queryId);
    for await (const item of stream) {
      yield* item.rows;
    }
  }
  async explain(format, options) {
    const builder = new _DeleteQueryBuilder({
      ...__privateGet(this, _props8),
      queryNode: QueryNode.cloneWithExplain(__privateGet(this, _props8).queryNode, format, options)
    });
    return await builder.execute();
  }
};
_props8 = new WeakMap();
_DeleteQueryBuilder_instances = new WeakSet();
join_fn = function(joinType, args) {
  return new _DeleteQueryBuilder({
    ...__privateGet(this, _props8),
    queryNode: QueryNode.cloneWithJoin(__privateGet(this, _props8).queryNode, parseJoin(joinType, args))
  });
};
var DeleteQueryBuilder = _DeleteQueryBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/update-result.js
var UpdateResult = class {
  constructor(numUpdatedRows, numChangedRows) {
    /**
     * The number of rows the update query updated (even if not changed).
     */
    __publicField(this, "numUpdatedRows");
    /**
     * The number of rows the update query changed.
     *
     * This is **optional** and only supported in dialects such as MySQL.
     * You would probably use {@link numUpdatedRows} in most cases.
     */
    __publicField(this, "numChangedRows");
    this.numUpdatedRows = numUpdatedRows;
    this.numChangedRows = numChangedRows;
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/update-query-builder.js
var _props9, _UpdateQueryBuilder_instances, join_fn2;
var _UpdateQueryBuilder = class _UpdateQueryBuilder {
  constructor(props) {
    __privateAdd(this, _UpdateQueryBuilder_instances);
    __privateAdd(this, _props9);
    __privateSet(this, _props9, freeze(props));
  }
  where(...args) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithWhere(__privateGet(this, _props9).queryNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  whereRef(lhs, op, rhs) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithWhere(__privateGet(this, _props9).queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  clearWhere() {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithoutWhere(__privateGet(this, _props9).queryNode)
    });
  }
  /**
   * Changes an `update` query into a `update top` query.
   *
   * `top` clause is only supported by some dialects like MS SQL Server.
   *
   * ### Examples
   *
   * Update the first row:
   *
   * ```ts
   * await db.updateTable('person')
   *   .top(1)
   *   .set({ first_name: 'Foo' })
   *   .where('age', '>', 18)
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * update top(1) "person" set "first_name" = @1 where "age" > @2
   * ```
   *
   * Update the 50% first rows:
   *
   * ```ts
   * await db.updateTable('person')
   *   .top(50, 'percent')
   *   .set({ first_name: 'Foo' })
   *   .where('age', '>', 18)
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * update top(50) percent "person" set "first_name" = @1 where "age" > @2
   * ```
   */
  top(expression, modifiers) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithTop(__privateGet(this, _props9).queryNode, parseTop(expression, modifiers))
    });
  }
  from(from) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: UpdateQueryNode.cloneWithFromItems(__privateGet(this, _props9).queryNode, parseTableExpressionOrList(from))
    });
  }
  innerJoin(...args) {
    return __privateMethod(this, _UpdateQueryBuilder_instances, join_fn2).call(this, "InnerJoin", args);
  }
  leftJoin(...args) {
    return __privateMethod(this, _UpdateQueryBuilder_instances, join_fn2).call(this, "LeftJoin", args);
  }
  rightJoin(...args) {
    return __privateMethod(this, _UpdateQueryBuilder_instances, join_fn2).call(this, "RightJoin", args);
  }
  fullJoin(...args) {
    return __privateMethod(this, _UpdateQueryBuilder_instances, join_fn2).call(this, "FullJoin", args);
  }
  orderBy(...args) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithOrderByItems(__privateGet(this, _props9).queryNode, parseOrderBy(args))
    });
  }
  clearOrderBy() {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithoutOrderBy(__privateGet(this, _props9).queryNode)
    });
  }
  /**
   * Adds a limit clause to the update query for supported databases, such as MySQL.
   *
   * ### Examples
   *
   * Update the first 2 rows in the 'person' table:
   *
   * ```ts
   * await db
   *   .updateTable('person')
   *   .set({ first_name: 'Foo' })
   *   .limit(2)
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * update `person` set `first_name` = ? limit ?
   * ```
   */
  limit(limit) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: UpdateQueryNode.cloneWithLimit(__privateGet(this, _props9).queryNode, LimitNode.create(parseValueExpression(limit)))
    });
  }
  set(...args) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: UpdateQueryNode.cloneWithUpdates(__privateGet(this, _props9).queryNode, parseUpdate(...args))
    });
  }
  returning(selection) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props9).queryNode, parseSelectArg(selection))
    });
  }
  returningAll(table) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props9).queryNode, parseSelectAll(table))
    });
  }
  output(args) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props9).queryNode, parseSelectArg(args))
    });
  }
  outputAll(table) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props9).queryNode, parseSelectAll(table))
    });
  }
  /**
   * This can be used to add any additional SQL to the end of the query.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.updateTable('person')
   *   .set({ age: 39 })
   *   .where('first_name', '=', 'John')
   *   .modifyEnd(sql.raw('-- This is a comment'))
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * update `person`
   * set `age` = 39
   * where `first_name` = "John" -- This is a comment
   * ```
   */
  modifyEnd(modifier) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props9).queryNode, modifier.toOperationNode())
    });
  }
  /**
   * Clears all `returning` clauses from the query.
   *
   * ### Examples
   *
   * ```ts
   * db.updateTable('person')
   *   .returningAll()
   *   .set({ age: 39 })
   *   .where('first_name', '=', 'John')
   *   .clearReturning()
   * ```
   *
   * The generated SQL(PostgreSQL):
   *
   * ```sql
   * update "person" set "age" = 39 where "first_name" = "John"
   * ```
   */
  clearReturning() {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithoutReturning(__privateGet(this, _props9).queryNode)
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   *
   * If you want to conditionally call a method on `this`, see
   * the {@link $if} method.
   *
   * ### Examples
   *
   * The next example uses a helper function `log` to log a query:
   *
   * ```ts
   * import type { Compilable } from 'kysely'
   * import type { PersonUpdate } from 'type-editor' // imaginary module
   *
   * function log<T extends Compilable>(qb: T): T {
   *   console.log(qb.compile())
   *   return qb
   * }
   *
   * const values = {
   *   first_name: 'John',
   * } satisfies PersonUpdate
   *
   * db.updateTable('person')
   *   .set(values)
   *   .$call(log)
   *   .execute()
   * ```
   */
  $call(func) {
    return func(this);
  }
  /**
   * Call `func(this)` if `condition` is true.
   *
   * This method is especially handy with optional selects. Any `returning` or `returningAll`
   * method calls add columns as optional fields to the output type when called inside
   * the `func` callback. This is because we can't know if those selections were actually
   * made before running the code.
   *
   * You can also call any other methods inside the callback.
   *
   * ### Examples
   *
   * ```ts
   * import type { PersonUpdate } from 'type-editor' // imaginary module
   *
   * async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
   *   return await db
   *     .updateTable('person')
   *     .set(updates)
   *     .where('id', '=', id)
   *     .returning(['id', 'first_name'])
   *     .$if(returnLastName, (qb) => qb.returning('last_name'))
   *     .executeTakeFirstOrThrow()
   * }
   * ```
   *
   * Any selections added inside the `if` callback will be added as optional fields to the
   * output type since we can't know if the selections were actually made before running
   * the code. In the example above the return type of the `updatePerson` function is:
   *
   * ```ts
   * Promise<{
   *   id: number
   *   first_name: string
   *   last_name?: string
   * }>
   * ```
   */
  $if(condition, func) {
    if (condition) {
      return func(this);
    }
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9)
    });
  }
  /**
   * Change the output type of the query.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `UpdateQueryBuilder` with a new output type.
   */
  $castTo() {
    return new _UpdateQueryBuilder(__privateGet(this, _props9));
  }
  /**
   * Narrows (parts of) the output type of the query.
   *
   * Kysely tries to be as type-safe as possible, but in some cases we have to make
   * compromises for better maintainability and compilation performance. At present,
   * Kysely doesn't narrow the output type of the query based on {@link set} input
   * when using {@link where} and/or {@link returning} or {@link returningAll}.
   *
   * This utility method is very useful for these situations, as it removes unncessary
   * runtime assertion/guard code. Its input type is limited to the output type
   * of the query, so you can't add a column that doesn't exist, or change a column's
   * type to something that doesn't exist in its union type.
   *
   * ### Examples
   *
   * Turn this code:
   *
   * ```ts
   * import type { Person } from 'type-editor' // imaginary module
   *
   * const id = 1
   * const now = new Date().toISOString()
   *
   * const person = await db.updateTable('person')
   *   .set({ deleted_at: now })
   *   .where('id', '=', id)
   *   .where('nullable_column', 'is not', null)
   *   .returningAll()
   *   .executeTakeFirstOrThrow()
   *
   * if (isWithNoNullValue(person)) {
   *   functionThatExpectsPersonWithNonNullValue(person)
   * }
   *
   * function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
   *   return person.nullable_column != null
   * }
   * ```
   *
   * Into this:
   *
   * ```ts
   * import type { NotNull } from 'kysely'
   *
   * const id = 1
   * const now = new Date().toISOString()
   *
   * const person = await db.updateTable('person')
   *   .set({ deleted_at: now })
   *   .where('id', '=', id)
   *   .where('nullable_column', 'is not', null)
   *   .returningAll()
   *   .$narrowType<{ deleted_at: Date; nullable_column: NotNull }>()
   *   .executeTakeFirstOrThrow()
   *
   * functionThatExpectsPersonWithNonNullValue(person)
   * ```
   */
  $narrowType() {
    return new _UpdateQueryBuilder(__privateGet(this, _props9));
  }
  /**
   * Asserts that query's output row type equals the given type `T`.
   *
   * This method can be used to simplify excessively complex types to make TypeScript happy
   * and much faster.
   *
   * Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
   * for TypeScript and you get errors like this:
   *
   * ```
   * error TS2589: Type instantiation is excessively deep and possibly infinite.
   * ```
   *
   * In these case you can often use this method to help TypeScript a little bit. When you use this
   * method to assert the output type of a query, Kysely can drop the complex output type that
   * consists of multiple nested helper types and replace it with the simple asserted type.
   *
   * Using this method doesn't reduce type safety at all. You have to pass in a type that is
   * structurally equal to the current type.
   *
   * ### Examples
   *
   * ```ts
   * import type { PersonUpdate, PetUpdate, Species } from 'type-editor' // imaginary module
   *
   * const person = {
   *   id: 1,
   *   gender: 'other',
   * } satisfies PersonUpdate
   *
   * const pet = {
   *   name: 'Fluffy',
   * } satisfies PetUpdate
   *
   * const result = await db
   *   .with('updated_person', (qb) => qb
   *     .updateTable('person')
   *     .set(person)
   *     .where('id', '=', person.id)
   *     .returning('first_name')
   *     .$assertType<{ first_name: string }>()
   *   )
   *   .with('updated_pet', (qb) => qb
   *     .updateTable('pet')
   *     .set(pet)
   *     .where('owner_id', '=', person.id)
   *     .returning(['name as pet_name', 'species'])
   *     .$assertType<{ pet_name: string, species: Species }>()
   *   )
   *   .selectFrom(['updated_person', 'updated_pet'])
   *   .selectAll()
   *   .executeTakeFirstOrThrow()
   * ```
   */
  $assertType() {
    return new _UpdateQueryBuilder(__privateGet(this, _props9));
  }
  /**
   * Returns a copy of this UpdateQueryBuilder instance with the given plugin installed.
   */
  withPlugin(plugin) {
    return new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      executor: __privateGet(this, _props9).executor.withPlugin(plugin)
    });
  }
  toOperationNode() {
    return __privateGet(this, _props9).executor.transformQuery(__privateGet(this, _props9).queryNode, __privateGet(this, _props9).queryId);
  }
  compile() {
    return __privateGet(this, _props9).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props9).queryId);
  }
  /**
   * Executes the query and returns an array of rows.
   *
   * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
   */
  async execute() {
    const compiledQuery = this.compile();
    const result = await __privateGet(this, _props9).executor.executeQuery(compiledQuery, __privateGet(this, _props9).queryId);
    const { adapter } = __privateGet(this, _props9).executor;
    const query = compiledQuery.query;
    if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) {
      return result.rows;
    }
    return [
      new UpdateResult(result.numAffectedRows ?? BigInt(0), result.numChangedRows)
    ];
  }
  /**
   * Executes the query and returns the first result or undefined if
   * the query returned no result.
   */
  async executeTakeFirst() {
    const [result] = await this.execute();
    return result;
  }
  /**
   * Executes the query and returns the first result or throws if
   * the query returned no result.
   *
   * By default an instance of {@link NoResultError} is thrown, but you can
   * provide a custom error class, or callback as the only argument to throw a different
   * error.
   */
  async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
    const result = await this.executeTakeFirst();
    if (result === void 0) {
      const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
      throw error;
    }
    return result;
  }
  async *stream(chunkSize = 100) {
    const compiledQuery = this.compile();
    const stream = __privateGet(this, _props9).executor.stream(compiledQuery, chunkSize, __privateGet(this, _props9).queryId);
    for await (const item of stream) {
      yield* item.rows;
    }
  }
  async explain(format, options) {
    const builder = new _UpdateQueryBuilder({
      ...__privateGet(this, _props9),
      queryNode: QueryNode.cloneWithExplain(__privateGet(this, _props9).queryNode, format, options)
    });
    return await builder.execute();
  }
};
_props9 = new WeakMap();
_UpdateQueryBuilder_instances = new WeakSet();
join_fn2 = function(joinType, args) {
  return new _UpdateQueryBuilder({
    ...__privateGet(this, _props9),
    queryNode: QueryNode.cloneWithJoin(__privateGet(this, _props9).queryNode, parseJoin(joinType, args))
  });
};
var UpdateQueryBuilder = _UpdateQueryBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/common-table-expression-name-node.js
var CommonTableExpressionNameNode = freeze({
  is(node) {
    return node.kind === "CommonTableExpressionNameNode";
  },
  create(tableName, columnNames) {
    return freeze({
      kind: "CommonTableExpressionNameNode",
      table: TableNode.create(tableName),
      columns: columnNames ? freeze(columnNames.map(ColumnNode.create)) : void 0
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/common-table-expression-node.js
var CommonTableExpressionNode = freeze({
  is(node) {
    return node.kind === "CommonTableExpressionNode";
  },
  create(name, expression) {
    return freeze({
      kind: "CommonTableExpressionNode",
      name,
      expression
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/cte-builder.js
var _props10;
var _CTEBuilder = class _CTEBuilder {
  constructor(props) {
    __privateAdd(this, _props10);
    __privateSet(this, _props10, freeze(props));
  }
  /**
   * Makes the common table expression materialized.
   */
  materialized() {
    return new _CTEBuilder({
      ...__privateGet(this, _props10),
      node: CommonTableExpressionNode.cloneWith(__privateGet(this, _props10).node, {
        materialized: true
      })
    });
  }
  /**
   * Makes the common table expression not materialized.
   */
  notMaterialized() {
    return new _CTEBuilder({
      ...__privateGet(this, _props10),
      node: CommonTableExpressionNode.cloneWith(__privateGet(this, _props10).node, {
        materialized: false
      })
    });
  }
  toOperationNode() {
    return __privateGet(this, _props10).node;
  }
};
_props10 = new WeakMap();
var CTEBuilder = _CTEBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/with-parser.js
function parseCommonTableExpression(nameOrBuilderCallback, expression) {
  const expressionNode = expression(createQueryCreator()).toOperationNode();
  if (isFunction(nameOrBuilderCallback)) {
    return nameOrBuilderCallback(cteBuilderFactory(expressionNode)).toOperationNode();
  }
  return CommonTableExpressionNode.create(parseCommonTableExpressionName(nameOrBuilderCallback), expressionNode);
}
function cteBuilderFactory(expressionNode) {
  return (name) => {
    return new CTEBuilder({
      node: CommonTableExpressionNode.create(parseCommonTableExpressionName(name), expressionNode)
    });
  };
}
function parseCommonTableExpressionName(name) {
  if (name.includes("(")) {
    const parts = name.split(/[\(\)]/);
    const table = parts[0];
    const columns = parts[1].split(",").map((it) => it.trim());
    return CommonTableExpressionNameNode.create(table, columns);
  } else {
    return CommonTableExpressionNameNode.create(name);
  }
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/with-node.js
var WithNode = freeze({
  is(node) {
    return node.kind === "WithNode";
  },
  create(expression, params) {
    return freeze({
      kind: "WithNode",
      expressions: freeze([expression]),
      ...params
    });
  },
  cloneWithExpression(withNode, expression) {
    return freeze({
      ...withNode,
      expressions: freeze([...withNode.expressions, expression])
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/random-string.js
var CHARS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9"
];
function randomString(length) {
  let chars = "";
  for (let i = 0; i < length; ++i) {
    chars += randomChar();
  }
  return chars;
}
function randomChar() {
  return CHARS[~~(Math.random() * CHARS.length)];
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/query-id.js
function createQueryId() {
  return new LazyQueryId();
}
var _queryId;
var LazyQueryId = class {
  constructor() {
    __privateAdd(this, _queryId);
  }
  get queryId() {
    if (__privateGet(this, _queryId) === void 0) {
      __privateSet(this, _queryId, randomString(8));
    }
    return __privateGet(this, _queryId);
  }
};
_queryId = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/require-all-props.js
function requireAllProps(obj) {
  return obj;
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/operation-node-transformer.js
var _transformers;
var OperationNodeTransformer = class {
  constructor() {
    __publicField(this, "nodeStack", []);
    __privateAdd(this, _transformers, freeze({
      AliasNode: this.transformAlias.bind(this),
      ColumnNode: this.transformColumn.bind(this),
      IdentifierNode: this.transformIdentifier.bind(this),
      SchemableIdentifierNode: this.transformSchemableIdentifier.bind(this),
      RawNode: this.transformRaw.bind(this),
      ReferenceNode: this.transformReference.bind(this),
      SelectQueryNode: this.transformSelectQuery.bind(this),
      SelectionNode: this.transformSelection.bind(this),
      TableNode: this.transformTable.bind(this),
      FromNode: this.transformFrom.bind(this),
      SelectAllNode: this.transformSelectAll.bind(this),
      AndNode: this.transformAnd.bind(this),
      OrNode: this.transformOr.bind(this),
      ValueNode: this.transformValue.bind(this),
      ValueListNode: this.transformValueList.bind(this),
      PrimitiveValueListNode: this.transformPrimitiveValueList.bind(this),
      ParensNode: this.transformParens.bind(this),
      JoinNode: this.transformJoin.bind(this),
      OperatorNode: this.transformOperator.bind(this),
      WhereNode: this.transformWhere.bind(this),
      InsertQueryNode: this.transformInsertQuery.bind(this),
      DeleteQueryNode: this.transformDeleteQuery.bind(this),
      ReturningNode: this.transformReturning.bind(this),
      CreateTableNode: this.transformCreateTable.bind(this),
      AddColumnNode: this.transformAddColumn.bind(this),
      ColumnDefinitionNode: this.transformColumnDefinition.bind(this),
      DropTableNode: this.transformDropTable.bind(this),
      DataTypeNode: this.transformDataType.bind(this),
      OrderByNode: this.transformOrderBy.bind(this),
      OrderByItemNode: this.transformOrderByItem.bind(this),
      GroupByNode: this.transformGroupBy.bind(this),
      GroupByItemNode: this.transformGroupByItem.bind(this),
      UpdateQueryNode: this.transformUpdateQuery.bind(this),
      ColumnUpdateNode: this.transformColumnUpdate.bind(this),
      LimitNode: this.transformLimit.bind(this),
      OffsetNode: this.transformOffset.bind(this),
      OnConflictNode: this.transformOnConflict.bind(this),
      OnDuplicateKeyNode: this.transformOnDuplicateKey.bind(this),
      CreateIndexNode: this.transformCreateIndex.bind(this),
      DropIndexNode: this.transformDropIndex.bind(this),
      ListNode: this.transformList.bind(this),
      PrimaryKeyConstraintNode: this.transformPrimaryKeyConstraint.bind(this),
      UniqueConstraintNode: this.transformUniqueConstraint.bind(this),
      ReferencesNode: this.transformReferences.bind(this),
      CheckConstraintNode: this.transformCheckConstraint.bind(this),
      WithNode: this.transformWith.bind(this),
      CommonTableExpressionNode: this.transformCommonTableExpression.bind(this),
      CommonTableExpressionNameNode: this.transformCommonTableExpressionName.bind(this),
      HavingNode: this.transformHaving.bind(this),
      CreateSchemaNode: this.transformCreateSchema.bind(this),
      DropSchemaNode: this.transformDropSchema.bind(this),
      AlterTableNode: this.transformAlterTable.bind(this),
      DropColumnNode: this.transformDropColumn.bind(this),
      RenameColumnNode: this.transformRenameColumn.bind(this),
      AlterColumnNode: this.transformAlterColumn.bind(this),
      ModifyColumnNode: this.transformModifyColumn.bind(this),
      AddConstraintNode: this.transformAddConstraint.bind(this),
      DropConstraintNode: this.transformDropConstraint.bind(this),
      RenameConstraintNode: this.transformRenameConstraint.bind(this),
      ForeignKeyConstraintNode: this.transformForeignKeyConstraint.bind(this),
      CreateViewNode: this.transformCreateView.bind(this),
      RefreshMaterializedViewNode: this.transformRefreshMaterializedView.bind(this),
      DropViewNode: this.transformDropView.bind(this),
      GeneratedNode: this.transformGenerated.bind(this),
      DefaultValueNode: this.transformDefaultValue.bind(this),
      OnNode: this.transformOn.bind(this),
      ValuesNode: this.transformValues.bind(this),
      SelectModifierNode: this.transformSelectModifier.bind(this),
      CreateTypeNode: this.transformCreateType.bind(this),
      DropTypeNode: this.transformDropType.bind(this),
      ExplainNode: this.transformExplain.bind(this),
      DefaultInsertValueNode: this.transformDefaultInsertValue.bind(this),
      AggregateFunctionNode: this.transformAggregateFunction.bind(this),
      OverNode: this.transformOver.bind(this),
      PartitionByNode: this.transformPartitionBy.bind(this),
      PartitionByItemNode: this.transformPartitionByItem.bind(this),
      SetOperationNode: this.transformSetOperation.bind(this),
      BinaryOperationNode: this.transformBinaryOperation.bind(this),
      UnaryOperationNode: this.transformUnaryOperation.bind(this),
      UsingNode: this.transformUsing.bind(this),
      FunctionNode: this.transformFunction.bind(this),
      CaseNode: this.transformCase.bind(this),
      WhenNode: this.transformWhen.bind(this),
      JSONReferenceNode: this.transformJSONReference.bind(this),
      JSONPathNode: this.transformJSONPath.bind(this),
      JSONPathLegNode: this.transformJSONPathLeg.bind(this),
      JSONOperatorChainNode: this.transformJSONOperatorChain.bind(this),
      TupleNode: this.transformTuple.bind(this),
      MergeQueryNode: this.transformMergeQuery.bind(this),
      MatchedNode: this.transformMatched.bind(this),
      AddIndexNode: this.transformAddIndex.bind(this),
      CastNode: this.transformCast.bind(this),
      FetchNode: this.transformFetch.bind(this),
      TopNode: this.transformTop.bind(this),
      OutputNode: this.transformOutput.bind(this),
      OrActionNode: this.transformOrAction.bind(this),
      CollateNode: this.transformCollate.bind(this)
    }));
  }
  transformNode(node, queryId) {
    if (!node) {
      return node;
    }
    this.nodeStack.push(node);
    const out = this.transformNodeImpl(node, queryId);
    this.nodeStack.pop();
    return freeze(out);
  }
  transformNodeImpl(node, queryId) {
    return __privateGet(this, _transformers)[node.kind](node, queryId);
  }
  transformNodeList(list, queryId) {
    if (!list) {
      return list;
    }
    return freeze(list.map((node) => this.transformNode(node, queryId)));
  }
  transformSelectQuery(node, queryId) {
    return requireAllProps({
      kind: "SelectQueryNode",
      from: this.transformNode(node.from, queryId),
      selections: this.transformNodeList(node.selections, queryId),
      distinctOn: this.transformNodeList(node.distinctOn, queryId),
      joins: this.transformNodeList(node.joins, queryId),
      groupBy: this.transformNode(node.groupBy, queryId),
      orderBy: this.transformNode(node.orderBy, queryId),
      where: this.transformNode(node.where, queryId),
      frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
      endModifiers: this.transformNodeList(node.endModifiers, queryId),
      limit: this.transformNode(node.limit, queryId),
      offset: this.transformNode(node.offset, queryId),
      with: this.transformNode(node.with, queryId),
      having: this.transformNode(node.having, queryId),
      explain: this.transformNode(node.explain, queryId),
      setOperations: this.transformNodeList(node.setOperations, queryId),
      fetch: this.transformNode(node.fetch, queryId),
      top: this.transformNode(node.top, queryId)
    });
  }
  transformSelection(node, queryId) {
    return requireAllProps({
      kind: "SelectionNode",
      selection: this.transformNode(node.selection, queryId)
    });
  }
  transformColumn(node, queryId) {
    return requireAllProps({
      kind: "ColumnNode",
      column: this.transformNode(node.column, queryId)
    });
  }
  transformAlias(node, queryId) {
    return requireAllProps({
      kind: "AliasNode",
      node: this.transformNode(node.node, queryId),
      alias: this.transformNode(node.alias, queryId)
    });
  }
  transformTable(node, queryId) {
    return requireAllProps({
      kind: "TableNode",
      table: this.transformNode(node.table, queryId)
    });
  }
  transformFrom(node, queryId) {
    return requireAllProps({
      kind: "FromNode",
      froms: this.transformNodeList(node.froms, queryId)
    });
  }
  transformReference(node, queryId) {
    return requireAllProps({
      kind: "ReferenceNode",
      column: this.transformNode(node.column, queryId),
      table: this.transformNode(node.table, queryId)
    });
  }
  transformAnd(node, queryId) {
    return requireAllProps({
      kind: "AndNode",
      left: this.transformNode(node.left, queryId),
      right: this.transformNode(node.right, queryId)
    });
  }
  transformOr(node, queryId) {
    return requireAllProps({
      kind: "OrNode",
      left: this.transformNode(node.left, queryId),
      right: this.transformNode(node.right, queryId)
    });
  }
  transformValueList(node, queryId) {
    return requireAllProps({
      kind: "ValueListNode",
      values: this.transformNodeList(node.values, queryId)
    });
  }
  transformParens(node, queryId) {
    return requireAllProps({
      kind: "ParensNode",
      node: this.transformNode(node.node, queryId)
    });
  }
  transformJoin(node, queryId) {
    return requireAllProps({
      kind: "JoinNode",
      joinType: node.joinType,
      table: this.transformNode(node.table, queryId),
      on: this.transformNode(node.on, queryId)
    });
  }
  transformRaw(node, queryId) {
    return requireAllProps({
      kind: "RawNode",
      sqlFragments: freeze([...node.sqlFragments]),
      parameters: this.transformNodeList(node.parameters, queryId)
    });
  }
  transformWhere(node, queryId) {
    return requireAllProps({
      kind: "WhereNode",
      where: this.transformNode(node.where, queryId)
    });
  }
  transformInsertQuery(node, queryId) {
    return requireAllProps({
      kind: "InsertQueryNode",
      into: this.transformNode(node.into, queryId),
      columns: this.transformNodeList(node.columns, queryId),
      values: this.transformNode(node.values, queryId),
      returning: this.transformNode(node.returning, queryId),
      onConflict: this.transformNode(node.onConflict, queryId),
      onDuplicateKey: this.transformNode(node.onDuplicateKey, queryId),
      endModifiers: this.transformNodeList(node.endModifiers, queryId),
      with: this.transformNode(node.with, queryId),
      ignore: node.ignore,
      orAction: this.transformNode(node.orAction, queryId),
      replace: node.replace,
      explain: this.transformNode(node.explain, queryId),
      defaultValues: node.defaultValues,
      top: this.transformNode(node.top, queryId),
      output: this.transformNode(node.output, queryId)
    });
  }
  transformValues(node, queryId) {
    return requireAllProps({
      kind: "ValuesNode",
      values: this.transformNodeList(node.values, queryId)
    });
  }
  transformDeleteQuery(node, queryId) {
    return requireAllProps({
      kind: "DeleteQueryNode",
      from: this.transformNode(node.from, queryId),
      using: this.transformNode(node.using, queryId),
      joins: this.transformNodeList(node.joins, queryId),
      where: this.transformNode(node.where, queryId),
      returning: this.transformNode(node.returning, queryId),
      endModifiers: this.transformNodeList(node.endModifiers, queryId),
      with: this.transformNode(node.with, queryId),
      orderBy: this.transformNode(node.orderBy, queryId),
      limit: this.transformNode(node.limit, queryId),
      explain: this.transformNode(node.explain, queryId),
      top: this.transformNode(node.top, queryId),
      output: this.transformNode(node.output, queryId)
    });
  }
  transformReturning(node, queryId) {
    return requireAllProps({
      kind: "ReturningNode",
      selections: this.transformNodeList(node.selections, queryId)
    });
  }
  transformCreateTable(node, queryId) {
    return requireAllProps({
      kind: "CreateTableNode",
      table: this.transformNode(node.table, queryId),
      columns: this.transformNodeList(node.columns, queryId),
      constraints: this.transformNodeList(node.constraints, queryId),
      temporary: node.temporary,
      ifNotExists: node.ifNotExists,
      onCommit: node.onCommit,
      frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
      endModifiers: this.transformNodeList(node.endModifiers, queryId),
      selectQuery: this.transformNode(node.selectQuery, queryId)
    });
  }
  transformColumnDefinition(node, queryId) {
    return requireAllProps({
      kind: "ColumnDefinitionNode",
      column: this.transformNode(node.column, queryId),
      dataType: this.transformNode(node.dataType, queryId),
      references: this.transformNode(node.references, queryId),
      primaryKey: node.primaryKey,
      autoIncrement: node.autoIncrement,
      unique: node.unique,
      notNull: node.notNull,
      unsigned: node.unsigned,
      defaultTo: this.transformNode(node.defaultTo, queryId),
      check: this.transformNode(node.check, queryId),
      generated: this.transformNode(node.generated, queryId),
      frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
      endModifiers: this.transformNodeList(node.endModifiers, queryId),
      nullsNotDistinct: node.nullsNotDistinct,
      identity: node.identity,
      ifNotExists: node.ifNotExists
    });
  }
  transformAddColumn(node, queryId) {
    return requireAllProps({
      kind: "AddColumnNode",
      column: this.transformNode(node.column, queryId)
    });
  }
  transformDropTable(node, queryId) {
    return requireAllProps({
      kind: "DropTableNode",
      table: this.transformNode(node.table, queryId),
      ifExists: node.ifExists,
      cascade: node.cascade
    });
  }
  transformOrderBy(node, queryId) {
    return requireAllProps({
      kind: "OrderByNode",
      items: this.transformNodeList(node.items, queryId)
    });
  }
  transformOrderByItem(node, queryId) {
    return requireAllProps({
      kind: "OrderByItemNode",
      orderBy: this.transformNode(node.orderBy, queryId),
      direction: this.transformNode(node.direction, queryId),
      collation: this.transformNode(node.collation, queryId),
      nulls: node.nulls
    });
  }
  transformGroupBy(node, queryId) {
    return requireAllProps({
      kind: "GroupByNode",
      items: this.transformNodeList(node.items, queryId)
    });
  }
  transformGroupByItem(node, queryId) {
    return requireAllProps({
      kind: "GroupByItemNode",
      groupBy: this.transformNode(node.groupBy, queryId)
    });
  }
  transformUpdateQuery(node, queryId) {
    return requireAllProps({
      kind: "UpdateQueryNode",
      table: this.transformNode(node.table, queryId),
      from: this.transformNode(node.from, queryId),
      joins: this.transformNodeList(node.joins, queryId),
      where: this.transformNode(node.where, queryId),
      updates: this.transformNodeList(node.updates, queryId),
      returning: this.transformNode(node.returning, queryId),
      endModifiers: this.transformNodeList(node.endModifiers, queryId),
      with: this.transformNode(node.with, queryId),
      explain: this.transformNode(node.explain, queryId),
      limit: this.transformNode(node.limit, queryId),
      top: this.transformNode(node.top, queryId),
      output: this.transformNode(node.output, queryId),
      orderBy: this.transformNode(node.orderBy, queryId)
    });
  }
  transformColumnUpdate(node, queryId) {
    return requireAllProps({
      kind: "ColumnUpdateNode",
      column: this.transformNode(node.column, queryId),
      value: this.transformNode(node.value, queryId)
    });
  }
  transformLimit(node, queryId) {
    return requireAllProps({
      kind: "LimitNode",
      limit: this.transformNode(node.limit, queryId)
    });
  }
  transformOffset(node, queryId) {
    return requireAllProps({
      kind: "OffsetNode",
      offset: this.transformNode(node.offset, queryId)
    });
  }
  transformOnConflict(node, queryId) {
    return requireAllProps({
      kind: "OnConflictNode",
      columns: this.transformNodeList(node.columns, queryId),
      constraint: this.transformNode(node.constraint, queryId),
      indexExpression: this.transformNode(node.indexExpression, queryId),
      indexWhere: this.transformNode(node.indexWhere, queryId),
      updates: this.transformNodeList(node.updates, queryId),
      updateWhere: this.transformNode(node.updateWhere, queryId),
      doNothing: node.doNothing
    });
  }
  transformOnDuplicateKey(node, queryId) {
    return requireAllProps({
      kind: "OnDuplicateKeyNode",
      updates: this.transformNodeList(node.updates, queryId)
    });
  }
  transformCreateIndex(node, queryId) {
    return requireAllProps({
      kind: "CreateIndexNode",
      name: this.transformNode(node.name, queryId),
      table: this.transformNode(node.table, queryId),
      columns: this.transformNodeList(node.columns, queryId),
      unique: node.unique,
      using: this.transformNode(node.using, queryId),
      ifNotExists: node.ifNotExists,
      where: this.transformNode(node.where, queryId),
      nullsNotDistinct: node.nullsNotDistinct
    });
  }
  transformList(node, queryId) {
    return requireAllProps({
      kind: "ListNode",
      items: this.transformNodeList(node.items, queryId)
    });
  }
  transformDropIndex(node, queryId) {
    return requireAllProps({
      kind: "DropIndexNode",
      name: this.transformNode(node.name, queryId),
      table: this.transformNode(node.table, queryId),
      ifExists: node.ifExists,
      cascade: node.cascade
    });
  }
  transformPrimaryKeyConstraint(node, queryId) {
    return requireAllProps({
      kind: "PrimaryKeyConstraintNode",
      columns: this.transformNodeList(node.columns, queryId),
      name: this.transformNode(node.name, queryId),
      deferrable: node.deferrable,
      initiallyDeferred: node.initiallyDeferred
    });
  }
  transformUniqueConstraint(node, queryId) {
    return requireAllProps({
      kind: "UniqueConstraintNode",
      columns: this.transformNodeList(node.columns, queryId),
      name: this.transformNode(node.name, queryId),
      nullsNotDistinct: node.nullsNotDistinct,
      deferrable: node.deferrable,
      initiallyDeferred: node.initiallyDeferred
    });
  }
  transformForeignKeyConstraint(node, queryId) {
    return requireAllProps({
      kind: "ForeignKeyConstraintNode",
      columns: this.transformNodeList(node.columns, queryId),
      references: this.transformNode(node.references, queryId),
      name: this.transformNode(node.name, queryId),
      onDelete: node.onDelete,
      onUpdate: node.onUpdate,
      deferrable: node.deferrable,
      initiallyDeferred: node.initiallyDeferred
    });
  }
  transformSetOperation(node, queryId) {
    return requireAllProps({
      kind: "SetOperationNode",
      operator: node.operator,
      expression: this.transformNode(node.expression, queryId),
      all: node.all
    });
  }
  transformReferences(node, queryId) {
    return requireAllProps({
      kind: "ReferencesNode",
      table: this.transformNode(node.table, queryId),
      columns: this.transformNodeList(node.columns, queryId),
      onDelete: node.onDelete,
      onUpdate: node.onUpdate
    });
  }
  transformCheckConstraint(node, queryId) {
    return requireAllProps({
      kind: "CheckConstraintNode",
      expression: this.transformNode(node.expression, queryId),
      name: this.transformNode(node.name, queryId)
    });
  }
  transformWith(node, queryId) {
    return requireAllProps({
      kind: "WithNode",
      expressions: this.transformNodeList(node.expressions, queryId),
      recursive: node.recursive
    });
  }
  transformCommonTableExpression(node, queryId) {
    return requireAllProps({
      kind: "CommonTableExpressionNode",
      name: this.transformNode(node.name, queryId),
      materialized: node.materialized,
      expression: this.transformNode(node.expression, queryId)
    });
  }
  transformCommonTableExpressionName(node, queryId) {
    return requireAllProps({
      kind: "CommonTableExpressionNameNode",
      table: this.transformNode(node.table, queryId),
      columns: this.transformNodeList(node.columns, queryId)
    });
  }
  transformHaving(node, queryId) {
    return requireAllProps({
      kind: "HavingNode",
      having: this.transformNode(node.having, queryId)
    });
  }
  transformCreateSchema(node, queryId) {
    return requireAllProps({
      kind: "CreateSchemaNode",
      schema: this.transformNode(node.schema, queryId),
      ifNotExists: node.ifNotExists
    });
  }
  transformDropSchema(node, queryId) {
    return requireAllProps({
      kind: "DropSchemaNode",
      schema: this.transformNode(node.schema, queryId),
      ifExists: node.ifExists,
      cascade: node.cascade
    });
  }
  transformAlterTable(node, queryId) {
    return requireAllProps({
      kind: "AlterTableNode",
      table: this.transformNode(node.table, queryId),
      renameTo: this.transformNode(node.renameTo, queryId),
      setSchema: this.transformNode(node.setSchema, queryId),
      columnAlterations: this.transformNodeList(node.columnAlterations, queryId),
      addConstraint: this.transformNode(node.addConstraint, queryId),
      dropConstraint: this.transformNode(node.dropConstraint, queryId),
      renameConstraint: this.transformNode(node.renameConstraint, queryId),
      addIndex: this.transformNode(node.addIndex, queryId),
      dropIndex: this.transformNode(node.dropIndex, queryId)
    });
  }
  transformDropColumn(node, queryId) {
    return requireAllProps({
      kind: "DropColumnNode",
      column: this.transformNode(node.column, queryId)
    });
  }
  transformRenameColumn(node, queryId) {
    return requireAllProps({
      kind: "RenameColumnNode",
      column: this.transformNode(node.column, queryId),
      renameTo: this.transformNode(node.renameTo, queryId)
    });
  }
  transformAlterColumn(node, queryId) {
    return requireAllProps({
      kind: "AlterColumnNode",
      column: this.transformNode(node.column, queryId),
      dataType: this.transformNode(node.dataType, queryId),
      dataTypeExpression: this.transformNode(node.dataTypeExpression, queryId),
      setDefault: this.transformNode(node.setDefault, queryId),
      dropDefault: node.dropDefault,
      setNotNull: node.setNotNull,
      dropNotNull: node.dropNotNull
    });
  }
  transformModifyColumn(node, queryId) {
    return requireAllProps({
      kind: "ModifyColumnNode",
      column: this.transformNode(node.column, queryId)
    });
  }
  transformAddConstraint(node, queryId) {
    return requireAllProps({
      kind: "AddConstraintNode",
      constraint: this.transformNode(node.constraint, queryId)
    });
  }
  transformDropConstraint(node, queryId) {
    return requireAllProps({
      kind: "DropConstraintNode",
      constraintName: this.transformNode(node.constraintName, queryId),
      ifExists: node.ifExists,
      modifier: node.modifier
    });
  }
  transformRenameConstraint(node, queryId) {
    return requireAllProps({
      kind: "RenameConstraintNode",
      oldName: this.transformNode(node.oldName, queryId),
      newName: this.transformNode(node.newName, queryId)
    });
  }
  transformCreateView(node, queryId) {
    return requireAllProps({
      kind: "CreateViewNode",
      name: this.transformNode(node.name, queryId),
      temporary: node.temporary,
      orReplace: node.orReplace,
      ifNotExists: node.ifNotExists,
      materialized: node.materialized,
      columns: this.transformNodeList(node.columns, queryId),
      as: this.transformNode(node.as, queryId)
    });
  }
  transformRefreshMaterializedView(node, queryId) {
    return requireAllProps({
      kind: "RefreshMaterializedViewNode",
      name: this.transformNode(node.name, queryId),
      concurrently: node.concurrently,
      withNoData: node.withNoData
    });
  }
  transformDropView(node, queryId) {
    return requireAllProps({
      kind: "DropViewNode",
      name: this.transformNode(node.name, queryId),
      ifExists: node.ifExists,
      materialized: node.materialized,
      cascade: node.cascade
    });
  }
  transformGenerated(node, queryId) {
    return requireAllProps({
      kind: "GeneratedNode",
      byDefault: node.byDefault,
      always: node.always,
      identity: node.identity,
      stored: node.stored,
      expression: this.transformNode(node.expression, queryId)
    });
  }
  transformDefaultValue(node, queryId) {
    return requireAllProps({
      kind: "DefaultValueNode",
      defaultValue: this.transformNode(node.defaultValue, queryId)
    });
  }
  transformOn(node, queryId) {
    return requireAllProps({
      kind: "OnNode",
      on: this.transformNode(node.on, queryId)
    });
  }
  transformSelectModifier(node, queryId) {
    return requireAllProps({
      kind: "SelectModifierNode",
      modifier: node.modifier,
      rawModifier: this.transformNode(node.rawModifier, queryId),
      of: this.transformNodeList(node.of, queryId)
    });
  }
  transformCreateType(node, queryId) {
    return requireAllProps({
      kind: "CreateTypeNode",
      name: this.transformNode(node.name, queryId),
      enum: this.transformNode(node.enum, queryId)
    });
  }
  transformDropType(node, queryId) {
    return requireAllProps({
      kind: "DropTypeNode",
      name: this.transformNode(node.name, queryId),
      ifExists: node.ifExists
    });
  }
  transformExplain(node, queryId) {
    return requireAllProps({
      kind: "ExplainNode",
      format: node.format,
      options: this.transformNode(node.options, queryId)
    });
  }
  transformSchemableIdentifier(node, queryId) {
    return requireAllProps({
      kind: "SchemableIdentifierNode",
      schema: this.transformNode(node.schema, queryId),
      identifier: this.transformNode(node.identifier, queryId)
    });
  }
  transformAggregateFunction(node, queryId) {
    return requireAllProps({
      kind: "AggregateFunctionNode",
      func: node.func,
      aggregated: this.transformNodeList(node.aggregated, queryId),
      distinct: node.distinct,
      orderBy: this.transformNode(node.orderBy, queryId),
      withinGroup: this.transformNode(node.withinGroup, queryId),
      filter: this.transformNode(node.filter, queryId),
      over: this.transformNode(node.over, queryId)
    });
  }
  transformOver(node, queryId) {
    return requireAllProps({
      kind: "OverNode",
      orderBy: this.transformNode(node.orderBy, queryId),
      partitionBy: this.transformNode(node.partitionBy, queryId)
    });
  }
  transformPartitionBy(node, queryId) {
    return requireAllProps({
      kind: "PartitionByNode",
      items: this.transformNodeList(node.items, queryId)
    });
  }
  transformPartitionByItem(node, queryId) {
    return requireAllProps({
      kind: "PartitionByItemNode",
      partitionBy: this.transformNode(node.partitionBy, queryId)
    });
  }
  transformBinaryOperation(node, queryId) {
    return requireAllProps({
      kind: "BinaryOperationNode",
      leftOperand: this.transformNode(node.leftOperand, queryId),
      operator: this.transformNode(node.operator, queryId),
      rightOperand: this.transformNode(node.rightOperand, queryId)
    });
  }
  transformUnaryOperation(node, queryId) {
    return requireAllProps({
      kind: "UnaryOperationNode",
      operator: this.transformNode(node.operator, queryId),
      operand: this.transformNode(node.operand, queryId)
    });
  }
  transformUsing(node, queryId) {
    return requireAllProps({
      kind: "UsingNode",
      tables: this.transformNodeList(node.tables, queryId)
    });
  }
  transformFunction(node, queryId) {
    return requireAllProps({
      kind: "FunctionNode",
      func: node.func,
      arguments: this.transformNodeList(node.arguments, queryId)
    });
  }
  transformCase(node, queryId) {
    return requireAllProps({
      kind: "CaseNode",
      value: this.transformNode(node.value, queryId),
      when: this.transformNodeList(node.when, queryId),
      else: this.transformNode(node.else, queryId),
      isStatement: node.isStatement
    });
  }
  transformWhen(node, queryId) {
    return requireAllProps({
      kind: "WhenNode",
      condition: this.transformNode(node.condition, queryId),
      result: this.transformNode(node.result, queryId)
    });
  }
  transformJSONReference(node, queryId) {
    return requireAllProps({
      kind: "JSONReferenceNode",
      reference: this.transformNode(node.reference, queryId),
      traversal: this.transformNode(node.traversal, queryId)
    });
  }
  transformJSONPath(node, queryId) {
    return requireAllProps({
      kind: "JSONPathNode",
      inOperator: this.transformNode(node.inOperator, queryId),
      pathLegs: this.transformNodeList(node.pathLegs, queryId)
    });
  }
  transformJSONPathLeg(node, _queryId2) {
    return requireAllProps({
      kind: "JSONPathLegNode",
      type: node.type,
      value: node.value
    });
  }
  transformJSONOperatorChain(node, queryId) {
    return requireAllProps({
      kind: "JSONOperatorChainNode",
      operator: this.transformNode(node.operator, queryId),
      values: this.transformNodeList(node.values, queryId)
    });
  }
  transformTuple(node, queryId) {
    return requireAllProps({
      kind: "TupleNode",
      values: this.transformNodeList(node.values, queryId)
    });
  }
  transformMergeQuery(node, queryId) {
    return requireAllProps({
      kind: "MergeQueryNode",
      into: this.transformNode(node.into, queryId),
      using: this.transformNode(node.using, queryId),
      whens: this.transformNodeList(node.whens, queryId),
      with: this.transformNode(node.with, queryId),
      top: this.transformNode(node.top, queryId),
      endModifiers: this.transformNodeList(node.endModifiers, queryId),
      output: this.transformNode(node.output, queryId),
      returning: this.transformNode(node.returning, queryId)
    });
  }
  transformMatched(node, _queryId2) {
    return requireAllProps({
      kind: "MatchedNode",
      not: node.not,
      bySource: node.bySource
    });
  }
  transformAddIndex(node, queryId) {
    return requireAllProps({
      kind: "AddIndexNode",
      name: this.transformNode(node.name, queryId),
      columns: this.transformNodeList(node.columns, queryId),
      unique: node.unique,
      using: this.transformNode(node.using, queryId),
      ifNotExists: node.ifNotExists
    });
  }
  transformCast(node, queryId) {
    return requireAllProps({
      kind: "CastNode",
      expression: this.transformNode(node.expression, queryId),
      dataType: this.transformNode(node.dataType, queryId)
    });
  }
  transformFetch(node, queryId) {
    return requireAllProps({
      kind: "FetchNode",
      rowCount: this.transformNode(node.rowCount, queryId),
      modifier: node.modifier
    });
  }
  transformTop(node, _queryId2) {
    return requireAllProps({
      kind: "TopNode",
      expression: node.expression,
      modifiers: node.modifiers
    });
  }
  transformOutput(node, queryId) {
    return requireAllProps({
      kind: "OutputNode",
      selections: this.transformNodeList(node.selections, queryId)
    });
  }
  transformDataType(node, _queryId2) {
    return node;
  }
  transformSelectAll(node, _queryId2) {
    return node;
  }
  transformIdentifier(node, _queryId2) {
    return node;
  }
  transformValue(node, _queryId2) {
    return node;
  }
  transformPrimitiveValueList(node, _queryId2) {
    return node;
  }
  transformOperator(node, _queryId2) {
    return node;
  }
  transformDefaultInsertValue(node, _queryId2) {
    return node;
  }
  transformOrAction(node, _queryId2) {
    return node;
  }
  transformCollate(node, _queryId2) {
    return node;
  }
};
_transformers = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/with-schema/with-schema-transformer.js
var ROOT_OPERATION_NODES = freeze({
  AlterTableNode: true,
  CreateIndexNode: true,
  CreateSchemaNode: true,
  CreateTableNode: true,
  CreateTypeNode: true,
  CreateViewNode: true,
  RefreshMaterializedViewNode: true,
  DeleteQueryNode: true,
  DropIndexNode: true,
  DropSchemaNode: true,
  DropTableNode: true,
  DropTypeNode: true,
  DropViewNode: true,
  InsertQueryNode: true,
  RawNode: true,
  SelectQueryNode: true,
  UpdateQueryNode: true,
  MergeQueryNode: true
});
var SCHEMALESS_FUNCTIONS = {
  json_agg: true,
  to_json: true
};
var _schema, _schemableIds, _ctes, _WithSchemaTransformer_instances, transformTableArgsWithoutSchemas_fn, isRootOperationNode_fn, collectSchemableIds_fn, collectCTEs_fn, collectSchemableIdsFromTableExpr_fn, collectSchemableId_fn, collectCTEIds_fn;
var WithSchemaTransformer = class extends OperationNodeTransformer {
  constructor(schema) {
    super();
    __privateAdd(this, _WithSchemaTransformer_instances);
    __privateAdd(this, _schema);
    __privateAdd(this, _schemableIds, /* @__PURE__ */ new Set());
    __privateAdd(this, _ctes, /* @__PURE__ */ new Set());
    __privateSet(this, _schema, schema);
  }
  transformNodeImpl(node, queryId) {
    if (!__privateMethod(this, _WithSchemaTransformer_instances, isRootOperationNode_fn).call(this, node)) {
      return super.transformNodeImpl(node, queryId);
    }
    const ctes = __privateMethod(this, _WithSchemaTransformer_instances, collectCTEs_fn).call(this, node);
    for (const cte of ctes) {
      __privateGet(this, _ctes).add(cte);
    }
    const tables = __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableIds_fn).call(this, node);
    for (const table of tables) {
      __privateGet(this, _schemableIds).add(table);
    }
    const transformed = super.transformNodeImpl(node, queryId);
    for (const table of tables) {
      __privateGet(this, _schemableIds).delete(table);
    }
    for (const cte of ctes) {
      __privateGet(this, _ctes).delete(cte);
    }
    return transformed;
  }
  transformSchemableIdentifier(node, queryId) {
    const transformed = super.transformSchemableIdentifier(node, queryId);
    if (transformed.schema || !__privateGet(this, _schemableIds).has(node.identifier.name)) {
      return transformed;
    }
    return {
      ...transformed,
      schema: IdentifierNode.create(__privateGet(this, _schema))
    };
  }
  transformReferences(node, queryId) {
    const transformed = super.transformReferences(node, queryId);
    if (transformed.table.table.schema) {
      return transformed;
    }
    return {
      ...transformed,
      table: TableNode.createWithSchema(__privateGet(this, _schema), transformed.table.table.identifier.name)
    };
  }
  transformAggregateFunction(node, queryId) {
    return {
      ...super.transformAggregateFunction({ ...node, aggregated: [] }, queryId),
      aggregated: __privateMethod(this, _WithSchemaTransformer_instances, transformTableArgsWithoutSchemas_fn).call(this, node, queryId, "aggregated")
    };
  }
  transformFunction(node, queryId) {
    return {
      ...super.transformFunction({ ...node, arguments: [] }, queryId),
      arguments: __privateMethod(this, _WithSchemaTransformer_instances, transformTableArgsWithoutSchemas_fn).call(this, node, queryId, "arguments")
    };
  }
};
_schema = new WeakMap();
_schemableIds = new WeakMap();
_ctes = new WeakMap();
_WithSchemaTransformer_instances = new WeakSet();
transformTableArgsWithoutSchemas_fn = function(node, queryId, argsKey) {
  return SCHEMALESS_FUNCTIONS[node.func] ? node[argsKey].map((arg) => !TableNode.is(arg) || arg.table.schema ? this.transformNode(arg, queryId) : {
    ...arg,
    table: this.transformIdentifier(arg.table.identifier, queryId)
  }) : this.transformNodeList(node[argsKey], queryId);
};
isRootOperationNode_fn = function(node) {
  return node.kind in ROOT_OPERATION_NODES;
};
collectSchemableIds_fn = function(node) {
  const schemableIds = /* @__PURE__ */ new Set();
  if ("name" in node && node.name && SchemableIdentifierNode.is(node.name)) {
    __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableId_fn).call(this, node.name, schemableIds);
  }
  if ("from" in node && node.from) {
    for (const from of node.from.froms) {
      __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableIdsFromTableExpr_fn).call(this, from, schemableIds);
    }
  }
  if ("into" in node && node.into) {
    __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableIdsFromTableExpr_fn).call(this, node.into, schemableIds);
  }
  if ("table" in node && node.table) {
    __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableIdsFromTableExpr_fn).call(this, node.table, schemableIds);
  }
  if ("joins" in node && node.joins) {
    for (const join of node.joins) {
      __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableIdsFromTableExpr_fn).call(this, join.table, schemableIds);
    }
  }
  if ("using" in node && node.using) {
    __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableIdsFromTableExpr_fn).call(this, node.using, schemableIds);
  }
  return schemableIds;
};
collectCTEs_fn = function(node) {
  const ctes = /* @__PURE__ */ new Set();
  if ("with" in node && node.with) {
    __privateMethod(this, _WithSchemaTransformer_instances, collectCTEIds_fn).call(this, node.with, ctes);
  }
  return ctes;
};
collectSchemableIdsFromTableExpr_fn = function(node, schemableIds) {
  if (TableNode.is(node)) {
    __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableId_fn).call(this, node.table, schemableIds);
  } else if (AliasNode.is(node) && TableNode.is(node.node)) {
    __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableId_fn).call(this, node.node.table, schemableIds);
  } else if (ListNode.is(node)) {
    for (const table of node.items) {
      __privateMethod(this, _WithSchemaTransformer_instances, collectSchemableIdsFromTableExpr_fn).call(this, table, schemableIds);
    }
  }
};
collectSchemableId_fn = function(node, schemableIds) {
  const id = node.identifier.name;
  if (!__privateGet(this, _schemableIds).has(id) && !__privateGet(this, _ctes).has(id)) {
    schemableIds.add(id);
  }
};
collectCTEIds_fn = function(node, ctes) {
  for (const expr of node.expressions) {
    const cteId = expr.name.table.table.identifier.name;
    if (!__privateGet(this, _ctes).has(cteId)) {
      ctes.add(cteId);
    }
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/with-schema/with-schema-plugin.js
var _transformer;
var WithSchemaPlugin = class {
  constructor(schema) {
    __privateAdd(this, _transformer);
    __privateSet(this, _transformer, new WithSchemaTransformer(schema));
  }
  transformQuery(args) {
    return __privateGet(this, _transformer).transformNode(args.node, args.queryId);
  }
  async transformResult(args) {
    return args.result;
  }
};
_transformer = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/matched-node.js
var MatchedNode = freeze({
  is(node) {
    return node.kind === "MatchedNode";
  },
  create(not, bySource = false) {
    return freeze({
      kind: "MatchedNode",
      not,
      bySource
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/merge-parser.js
function parseMergeWhen(type, args, refRight) {
  return WhenNode.create(parseFilterList([
    MatchedNode.create(!type.isMatched, type.bySource),
    ...args && args.length > 0 ? [
      args.length === 3 && refRight ? parseReferentialBinaryOperation(args[0], args[1], args[2]) : parseValueBinaryOperationOrExpression(args)
    ] : []
  ], "and", false));
}
function parseMergeThen(result) {
  if (isString(result)) {
    return RawNode.create([result], []);
  }
  if (isOperationNodeSource(result)) {
    return result.toOperationNode();
  }
  return result;
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/deferred.js
var _promise, _resolve, _reject;
var Deferred = class {
  constructor() {
    __privateAdd(this, _promise);
    __privateAdd(this, _resolve);
    __privateAdd(this, _reject);
    __publicField(this, "resolve", (value) => {
      if (__privateGet(this, _resolve)) {
        __privateGet(this, _resolve).call(this, value);
      }
    });
    __publicField(this, "reject", (reason) => {
      if (__privateGet(this, _reject)) {
        __privateGet(this, _reject).call(this, reason);
      }
    });
    __privateSet(this, _promise, new Promise((resolve, reject) => {
      __privateSet(this, _reject, reject);
      __privateSet(this, _resolve, resolve);
    }));
  }
  get promise() {
    return __privateGet(this, _promise);
  }
};
_promise = new WeakMap();
_resolve = new WeakMap();
_reject = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/provide-controlled-connection.js
async function provideControlledConnection(connectionProvider) {
  const connectionDefer = new Deferred();
  const connectionReleaseDefer = new Deferred();
  connectionProvider.provideConnection(async (connection) => {
    connectionDefer.resolve(connection);
    return await connectionReleaseDefer.promise;
  }).catch((ex) => connectionDefer.reject(ex));
  return freeze({
    connection: await connectionDefer.promise,
    release: connectionReleaseDefer.resolve
  });
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-executor/query-executor-base.js
var NO_PLUGINS = freeze([]);
var _plugins, _QueryExecutorBase_instances, transformResult_fn;
var QueryExecutorBase = class {
  constructor(plugins = NO_PLUGINS) {
    __privateAdd(this, _QueryExecutorBase_instances);
    __privateAdd(this, _plugins);
    __privateSet(this, _plugins, plugins);
  }
  get plugins() {
    return __privateGet(this, _plugins);
  }
  transformQuery(node, queryId) {
    for (const plugin of __privateGet(this, _plugins)) {
      const transformedNode = plugin.transformQuery({ node, queryId });
      if (transformedNode.kind === node.kind) {
        node = transformedNode;
      } else {
        throw new Error([
          `KyselyPlugin.transformQuery must return a node`,
          `of the same kind that was given to it.`,
          `The plugin was given a ${node.kind}`,
          `but it returned a ${transformedNode.kind}`
        ].join(" "));
      }
    }
    return node;
  }
  async executeQuery(compiledQuery, queryId) {
    return await this.provideConnection(async (connection) => {
      const result = await connection.executeQuery(compiledQuery);
      if ("numUpdatedOrDeletedRows" in result) {
        logOnce("kysely:warning: outdated driver/plugin detected! `QueryResult.numUpdatedOrDeletedRows` has been replaced with `QueryResult.numAffectedRows`.");
      }
      return await __privateMethod(this, _QueryExecutorBase_instances, transformResult_fn).call(this, result, queryId);
    });
  }
  async *stream(compiledQuery, chunkSize, queryId) {
    const { connection, release } = await provideControlledConnection(this);
    try {
      for await (const result of connection.streamQuery(compiledQuery, chunkSize)) {
        yield await __privateMethod(this, _QueryExecutorBase_instances, transformResult_fn).call(this, result, queryId);
      }
    } finally {
      release();
    }
  }
};
_plugins = new WeakMap();
_QueryExecutorBase_instances = new WeakSet();
transformResult_fn = async function(result, queryId) {
  for (const plugin of __privateGet(this, _plugins)) {
    result = await plugin.transformResult({ result, queryId });
  }
  return result;
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-executor/noop-query-executor.js
var NoopQueryExecutor = class _NoopQueryExecutor extends QueryExecutorBase {
  get adapter() {
    throw new Error("this query cannot be compiled to SQL");
  }
  compileQuery() {
    throw new Error("this query cannot be compiled to SQL");
  }
  provideConnection() {
    throw new Error("this query cannot be executed");
  }
  withConnectionProvider() {
    throw new Error("this query cannot have a connection provider");
  }
  withPlugin(plugin) {
    return new _NoopQueryExecutor([...this.plugins, plugin]);
  }
  withPlugins(plugins) {
    return new _NoopQueryExecutor([...this.plugins, ...plugins]);
  }
  withPluginAtFront(plugin) {
    return new _NoopQueryExecutor([plugin, ...this.plugins]);
  }
  withoutPlugins() {
    return new _NoopQueryExecutor([]);
  }
};
var NOOP_QUERY_EXECUTOR = new NoopQueryExecutor();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/merge-result.js
var MergeResult = class {
  constructor(numChangedRows) {
    __publicField(this, "numChangedRows");
    this.numChangedRows = numChangedRows;
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/merge-query-builder.js
var _props11;
var _MergeQueryBuilder = class _MergeQueryBuilder {
  constructor(props) {
    __privateAdd(this, _props11);
    __privateSet(this, _props11, freeze(props));
  }
  /**
   * This can be used to add any additional SQL to the end of the query.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db
   *   .mergeInto('person')
   *   .using('pet', 'pet.owner_id', 'person.id')
   *   .whenMatched()
   *   .thenDelete()
   *   .modifyEnd(sql.raw('-- this is a comment'))
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
   * ```
   */
  modifyEnd(modifier) {
    return new _MergeQueryBuilder({
      ...__privateGet(this, _props11),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props11).queryNode, modifier.toOperationNode())
    });
  }
  /**
   * Changes a `merge into` query to an `merge top into` query.
   *
   * `top` clause is only supported by some dialects like MS SQL Server.
   *
   * ### Examples
   *
   * Affect 5 matched rows at most:
   *
   * ```ts
   * await db.mergeInto('person')
   *   .top(5)
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenMatched()
   *   .thenDelete()
   *   .execute()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * merge top(5) into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when matched then
   *   delete
   * ```
   *
   * Affect 50% of matched rows:
   *
   * ```ts
   * await db.mergeInto('person')
   *   .top(50, 'percent')
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenMatched()
   *   .thenDelete()
   *   .execute()
   * ```
   *
   * The generated SQL (MS SQL Server):
   *
   * ```sql
   * merge top(50) percent into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when matched then
   *   delete
   * ```
   */
  top(expression, modifiers) {
    return new _MergeQueryBuilder({
      ...__privateGet(this, _props11),
      queryNode: QueryNode.cloneWithTop(__privateGet(this, _props11).queryNode, parseTop(expression, modifiers))
    });
  }
  using(...args) {
    return new WheneableMergeQueryBuilder({
      ...__privateGet(this, _props11),
      queryNode: MergeQueryNode.cloneWithUsing(__privateGet(this, _props11).queryNode, parseJoin("Using", args))
    });
  }
  returning(args) {
    return new _MergeQueryBuilder({
      ...__privateGet(this, _props11),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props11).queryNode, parseSelectArg(args))
    });
  }
  returningAll(table) {
    return new _MergeQueryBuilder({
      ...__privateGet(this, _props11),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props11).queryNode, parseSelectAll(table))
    });
  }
  output(args) {
    return new _MergeQueryBuilder({
      ...__privateGet(this, _props11),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props11).queryNode, parseSelectArg(args))
    });
  }
  outputAll(table) {
    return new _MergeQueryBuilder({
      ...__privateGet(this, _props11),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props11).queryNode, parseSelectAll(table))
    });
  }
};
_props11 = new WeakMap();
var MergeQueryBuilder = _MergeQueryBuilder;
var _props12, _WheneableMergeQueryBuilder_instances, whenMatched_fn, whenNotMatched_fn;
var _WheneableMergeQueryBuilder = class _WheneableMergeQueryBuilder {
  constructor(props) {
    __privateAdd(this, _WheneableMergeQueryBuilder_instances);
    __privateAdd(this, _props12);
    __privateSet(this, _props12, freeze(props));
  }
  /**
   * This can be used to add any additional SQL to the end of the query.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db
   *   .mergeInto('person')
   *   .using('pet', 'pet.owner_id', 'person.id')
   *   .whenMatched()
   *   .thenDelete()
   *   .modifyEnd(sql.raw('-- this is a comment'))
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
   * ```
   */
  modifyEnd(modifier) {
    return new _WheneableMergeQueryBuilder({
      ...__privateGet(this, _props12),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props12).queryNode, modifier.toOperationNode())
    });
  }
  /**
   * See {@link MergeQueryBuilder.top}.
   */
  top(expression, modifiers) {
    return new _WheneableMergeQueryBuilder({
      ...__privateGet(this, _props12),
      queryNode: QueryNode.cloneWithTop(__privateGet(this, _props12).queryNode, parseTop(expression, modifiers))
    });
  }
  /**
   * Adds a simple `when matched` clause to the query.
   *
   * For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
   *
   * For a simple `when not matched` clause, see {@link whenNotMatched}.
   *
   * For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db.mergeInto('person')
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenMatched()
   *   .thenDelete()
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when matched then
   *   delete
   * ```
   */
  whenMatched() {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenMatched_fn).call(this, []);
  }
  whenMatchedAnd(...args) {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenMatched_fn).call(this, args);
  }
  /**
   * Adds the `when matched` clause to the query with an `and` condition. But unlike
   * {@link whenMatchedAnd}, this method accepts a column reference as the 3rd argument.
   *
   * This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
   * for that method for more examples.
   */
  whenMatchedAndRef(lhs, op, rhs) {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenMatched_fn).call(this, [lhs, op, rhs], true);
  }
  /**
   * Adds a simple `when not matched` clause to the query.
   *
   * For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
   *
   * For a simple `when matched` clause, see {@link whenMatched}.
   *
   * For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db.mergeInto('person')
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenNotMatched()
   *   .thenInsertValues({
   *     first_name: 'John',
   *     last_name: 'Doe',
   *   })
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when not matched then
   *   insert ("first_name", "last_name") values ($1, $2)
   * ```
   */
  whenNotMatched() {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenNotMatched_fn).call(this, []);
  }
  whenNotMatchedAnd(...args) {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenNotMatched_fn).call(this, args);
  }
  /**
   * Adds the `when not matched` clause to the query with an `and` condition. But unlike
   * {@link whenNotMatchedAnd}, this method accepts a column reference as the 3rd argument.
   *
   * Unlike {@link whenMatchedAndRef}, you cannot reference columns from the target table.
   *
   * This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
   * for that method for more examples.
   */
  whenNotMatchedAndRef(lhs, op, rhs) {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenNotMatched_fn).call(this, [lhs, op, rhs], true);
  }
  /**
   * Adds a simple `when not matched by source` clause to the query.
   *
   * Supported in MS SQL Server.
   *
   * Similar to {@link whenNotMatched}, but returns a {@link MatchedThenableMergeQueryBuilder}.
   */
  whenNotMatchedBySource() {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenNotMatched_fn).call(this, [], false, true);
  }
  whenNotMatchedBySourceAnd(...args) {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenNotMatched_fn).call(this, args, false, true);
  }
  /**
   * Adds the `when not matched by source` clause to the query with an `and` condition.
   *
   * Similar to {@link whenNotMatchedAndRef}, but you can reference columns from
   * the target table, and not from source table and returns a {@link MatchedThenableMergeQueryBuilder}.
   */
  whenNotMatchedBySourceAndRef(lhs, op, rhs) {
    return __privateMethod(this, _WheneableMergeQueryBuilder_instances, whenNotMatched_fn).call(this, [lhs, op, rhs], true, true);
  }
  returning(args) {
    return new _WheneableMergeQueryBuilder({
      ...__privateGet(this, _props12),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props12).queryNode, parseSelectArg(args))
    });
  }
  returningAll(table) {
    return new _WheneableMergeQueryBuilder({
      ...__privateGet(this, _props12),
      queryNode: QueryNode.cloneWithReturning(__privateGet(this, _props12).queryNode, parseSelectAll(table))
    });
  }
  output(args) {
    return new _WheneableMergeQueryBuilder({
      ...__privateGet(this, _props12),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props12).queryNode, parseSelectArg(args))
    });
  }
  outputAll(table) {
    return new _WheneableMergeQueryBuilder({
      ...__privateGet(this, _props12),
      queryNode: QueryNode.cloneWithOutput(__privateGet(this, _props12).queryNode, parseSelectAll(table))
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   *
   * If you want to conditionally call a method on `this`, see
   * the {@link $if} method.
   *
   * ### Examples
   *
   * The next example uses a helper function `log` to log a query:
   *
   * ```ts
   * import type { Compilable } from 'kysely'
   *
   * function log<T extends Compilable>(qb: T): T {
   *   console.log(qb.compile())
   *   return qb
   * }
   *
   * await db.updateTable('person')
   *   .set({ first_name: 'John' })
   *   .$call(log)
   *   .execute()
   * ```
   */
  $call(func) {
    return func(this);
  }
  /**
   * Call `func(this)` if `condition` is true.
   *
   * This method is especially handy with optional selects. Any `returning` or `returningAll`
   * method calls add columns as optional fields to the output type when called inside
   * the `func` callback. This is because we can't know if those selections were actually
   * made before running the code.
   *
   * You can also call any other methods inside the callback.
   *
   * ### Examples
   *
   * ```ts
   * import type { PersonUpdate } from 'type-editor' // imaginary module
   *
   * async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
   *   return await db
   *     .updateTable('person')
   *     .set(updates)
   *     .where('id', '=', id)
   *     .returning(['id', 'first_name'])
   *     .$if(returnLastName, (qb) => qb.returning('last_name'))
   *     .executeTakeFirstOrThrow()
   * }
   * ```
   *
   * Any selections added inside the `if` callback will be added as optional fields to the
   * output type since we can't know if the selections were actually made before running
   * the code. In the example above the return type of the `updatePerson` function is:
   *
   * ```ts
   * Promise<{
   *   id: number
   *   first_name: string
   *   last_name?: string
   * }>
   * ```
   */
  $if(condition, func) {
    if (condition) {
      return func(this);
    }
    return new _WheneableMergeQueryBuilder({
      ...__privateGet(this, _props12)
    });
  }
  toOperationNode() {
    return __privateGet(this, _props12).executor.transformQuery(__privateGet(this, _props12).queryNode, __privateGet(this, _props12).queryId);
  }
  compile() {
    return __privateGet(this, _props12).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props12).queryId);
  }
  /**
   * Executes the query and returns an array of rows.
   *
   * Also see the {@link executeTakeFirst} and {@link executeTakeFirstOrThrow} methods.
   */
  async execute() {
    const compiledQuery = this.compile();
    const result = await __privateGet(this, _props12).executor.executeQuery(compiledQuery, __privateGet(this, _props12).queryId);
    const { adapter } = __privateGet(this, _props12).executor;
    const query = compiledQuery.query;
    if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) {
      return result.rows;
    }
    return [new MergeResult(result.numAffectedRows)];
  }
  /**
   * Executes the query and returns the first result or undefined if
   * the query returned no result.
   */
  async executeTakeFirst() {
    const [result] = await this.execute();
    return result;
  }
  /**
   * Executes the query and returns the first result or throws if
   * the query returned no result.
   *
   * By default an instance of {@link NoResultError} is thrown, but you can
   * provide a custom error class, or callback as the only argument to throw a different
   * error.
   */
  async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
    const result = await this.executeTakeFirst();
    if (result === void 0) {
      const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
      throw error;
    }
    return result;
  }
};
_props12 = new WeakMap();
_WheneableMergeQueryBuilder_instances = new WeakSet();
whenMatched_fn = function(args, refRight) {
  return new MatchedThenableMergeQueryBuilder({
    ...__privateGet(this, _props12),
    queryNode: MergeQueryNode.cloneWithWhen(__privateGet(this, _props12).queryNode, parseMergeWhen({ isMatched: true }, args, refRight))
  });
};
whenNotMatched_fn = function(args, refRight = false, bySource = false) {
  const props = {
    ...__privateGet(this, _props12),
    queryNode: MergeQueryNode.cloneWithWhen(__privateGet(this, _props12).queryNode, parseMergeWhen({ isMatched: false, bySource }, args, refRight))
  };
  const Builder = bySource ? MatchedThenableMergeQueryBuilder : NotMatchedThenableMergeQueryBuilder;
  return new Builder(props);
};
var WheneableMergeQueryBuilder = _WheneableMergeQueryBuilder;
var _props13;
var MatchedThenableMergeQueryBuilder = class {
  constructor(props) {
    __privateAdd(this, _props13);
    __privateSet(this, _props13, freeze(props));
  }
  /**
   * Performs the `delete` action.
   *
   * To perform the `do nothing` action, see {@link thenDoNothing}.
   *
   * To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db.mergeInto('person')
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenMatched()
   *   .thenDelete()
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when matched then
   *   delete
   * ```
   */
  thenDelete() {
    return new WheneableMergeQueryBuilder({
      ...__privateGet(this, _props13),
      queryNode: MergeQueryNode.cloneWithThen(__privateGet(this, _props13).queryNode, parseMergeThen("delete"))
    });
  }
  /**
   * Performs the `do nothing` action.
   *
   * This is supported in PostgreSQL.
   *
   * To perform the `delete` action, see {@link thenDelete}.
   *
   * To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db.mergeInto('person')
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenMatched()
   *   .thenDoNothing()
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when matched then
   *   do nothing
   * ```
   */
  thenDoNothing() {
    return new WheneableMergeQueryBuilder({
      ...__privateGet(this, _props13),
      queryNode: MergeQueryNode.cloneWithThen(__privateGet(this, _props13).queryNode, parseMergeThen("do nothing"))
    });
  }
  /**
   * Perform an `update` operation with a full-fledged {@link UpdateQueryBuilder}.
   * This is handy when multiple `set` invocations are needed.
   *
   * For a shorthand version of this method, see {@link thenUpdateSet}.
   *
   * To perform the `delete` action, see {@link thenDelete}.
   *
   * To perform the `do nothing` action, see {@link thenDoNothing}.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * const result = await db.mergeInto('person')
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenMatched()
   *   .thenUpdate((ub) => ub
   *     .set(sql`metadata['has_pets']`, 'Y')
   *     .set({
   *       updated_at: new Date().toISOString(),
   *     })
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when matched then
   *   update set metadata['has_pets'] = $1, "updated_at" = $2
   * ```
   */
  thenUpdate(set) {
    return new WheneableMergeQueryBuilder({
      ...__privateGet(this, _props13),
      queryNode: MergeQueryNode.cloneWithThen(__privateGet(this, _props13).queryNode, parseMergeThen(set(new UpdateQueryBuilder({
        queryId: __privateGet(this, _props13).queryId,
        executor: NOOP_QUERY_EXECUTOR,
        queryNode: UpdateQueryNode.createWithoutTable()
      }))))
    });
  }
  thenUpdateSet(...args) {
    return this.thenUpdate((ub) => ub.set(...args));
  }
};
_props13 = new WeakMap();
var _props14;
var NotMatchedThenableMergeQueryBuilder = class {
  constructor(props) {
    __privateAdd(this, _props14);
    __privateSet(this, _props14, freeze(props));
  }
  /**
   * Performs the `do nothing` action.
   *
   * This is supported in PostgreSQL.
   *
   * To perform the `insert` action, see {@link thenInsertValues}.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db.mergeInto('person')
   *   .using('pet', 'person.id', 'pet.owner_id')
   *   .whenNotMatched()
   *   .thenDoNothing()
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person"
   * using "pet" on "person"."id" = "pet"."owner_id"
   * when not matched then
   *   do nothing
   * ```
   */
  thenDoNothing() {
    return new WheneableMergeQueryBuilder({
      ...__privateGet(this, _props14),
      queryNode: MergeQueryNode.cloneWithThen(__privateGet(this, _props14).queryNode, parseMergeThen("do nothing"))
    });
  }
  thenInsertValues(insert) {
    const [columns, values] = parseInsertExpression(insert);
    return new WheneableMergeQueryBuilder({
      ...__privateGet(this, _props14),
      queryNode: MergeQueryNode.cloneWithThen(__privateGet(this, _props14).queryNode, parseMergeThen(InsertQueryNode.cloneWith(InsertQueryNode.createWithoutInto(), {
        columns,
        values
      })))
    });
  }
};
_props14 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-creator.js
var _props15;
var _QueryCreator = class _QueryCreator {
  constructor(props) {
    __privateAdd(this, _props15);
    __privateSet(this, _props15, freeze(props));
  }
  /**
   * Creates a `select` query builder for the given table or tables.
   *
   * The tables passed to this method are built as the query's `from` clause.
   *
   * ### Examples
   *
   * Create a select query for one table:
   *
   * ```ts
   * db.selectFrom('person').selectAll()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select * from "person"
   * ```
   *
   * Create a select query for one table with an alias:
   *
   * ```ts
   * const persons = await db.selectFrom('person as p')
   *   .select(['p.id', 'first_name'])
   *   .execute()
   *
   * console.log(persons[0].id)
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "p"."id", "first_name" from "person" as "p"
   * ```
   *
   * Create a select query from a subquery:
   *
   * ```ts
   * const persons = await db.selectFrom(
   *     (eb) => eb.selectFrom('person').select('person.id as identifier').as('p')
   *   )
   *   .select('p.identifier')
   *   .execute()
   *
   * console.log(persons[0].identifier)
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "p"."identifier",
   * from (
   *   select "person"."id" as "identifier" from "person"
   * ) as p
   * ```
   *
   * Create a select query from raw sql:
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * const items = await db
   *   .selectFrom(sql<{ one: number }>`(select 1 as one)`.as('q'))
   *   .select('q.one')
   *   .execute()
   *
   * console.log(items[0].one)
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "q"."one",
   * from (
   *   select 1 as one
   * ) as q
   * ```
   *
   * When you use the `sql` tag you need to also provide the result type of the
   * raw snippet / query so that Kysely can figure out what columns are
   * available for the rest of the query.
   *
   * The `selectFrom` method also accepts an array for multiple tables. All
   * the above examples can also be used in an array.
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * const items = await db.selectFrom([
   *     'person as p',
   *     db.selectFrom('pet').select('pet.species').as('a'),
   *     sql<{ one: number }>`(select 1 as one)`.as('q')
   *   ])
   *   .select(['p.id', 'a.species', 'q.one'])
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "p".id, "a"."species", "q"."one"
   * from
   *   "person" as "p",
   *   (select "pet"."species" from "pet") as a,
   *   (select 1 as one) as "q"
   * ```
   */
  selectFrom(from) {
    return createSelectQueryBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _props15).executor,
      queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(from), __privateGet(this, _props15).withNode)
    });
  }
  selectNoFrom(selection) {
    return createSelectQueryBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _props15).executor,
      queryNode: SelectQueryNode.cloneWithSelections(SelectQueryNode.create(__privateGet(this, _props15).withNode), parseSelectArg(selection))
    });
  }
  /**
   * Creates an insert query.
   *
   * The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
   * has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
   * the inserted row if the db returned one.
   *
   * See the {@link InsertQueryBuilder.values | values} method for more info and examples. Also see
   * the {@link ReturningInterface.returning | returning} method for a way to return columns
   * on supported databases like PostgreSQL.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db
   *   .insertInto('person')
   *   .values({
   *     first_name: 'Jennifer',
   *     last_name: 'Aniston'
   *   })
   *   .executeTakeFirst()
   *
   * console.log(result.insertId)
   * ```
   *
   * Some databases like PostgreSQL support the `returning` method:
   *
   * ```ts
   * const { id } = await db
   *   .insertInto('person')
   *   .values({
   *     first_name: 'Jennifer',
   *     last_name: 'Aniston'
   *   })
   *   .returning('id')
   *   .executeTakeFirstOrThrow()
   * ```
   */
  insertInto(table) {
    return new InsertQueryBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _props15).executor,
      queryNode: InsertQueryNode.create(parseTable(table), __privateGet(this, _props15).withNode)
    });
  }
  /**
   * Creates a "replace into" query.
   *
   * This is only supported by some dialects like MySQL or SQLite.
   *
   * Similar to MySQL's {@link InsertQueryBuilder.onDuplicateKeyUpdate} that deletes
   * and inserts values on collision instead of updating existing rows.
   *
   * An alias of SQLite's {@link InsertQueryBuilder.orReplace}.
   *
   * The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
   * has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
   * the inserted row if the db returned one.
   *
   * See the {@link InsertQueryBuilder.values | values} method for more info and examples.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db
   *   .replaceInto('person')
   *   .values({
   *     first_name: 'Jennifer',
   *     last_name: 'Aniston'
   *   })
   *   .executeTakeFirstOrThrow()
   *
   * console.log(result.insertId)
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * replace into `person` (`first_name`, `last_name`) values (?, ?)
   * ```
   */
  replaceInto(table) {
    return new InsertQueryBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _props15).executor,
      queryNode: InsertQueryNode.create(parseTable(table), __privateGet(this, _props15).withNode, true)
    });
  }
  /**
   * Creates a delete query.
   *
   * See the {@link DeleteQueryBuilder.where} method for examples on how to specify
   * a where clause for the delete operation.
   *
   * The return value of the query is an instance of {@link DeleteResult}.
   *
   * ### Examples
   *
   * <!-- siteExample("delete", "Single row", 10) -->
   *
   * Delete a single row:
   *
   * ```ts
   * const result = await db
   *   .deleteFrom('person')
   *   .where('person.id', '=', 1)
   *   .executeTakeFirst()
   *
   * console.log(result.numDeletedRows)
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * delete from "person" where "person"."id" = $1
   * ```
   *
   * Some databases such as MySQL support deleting from multiple tables:
   *
   * ```ts
   * const result = await db
   *   .deleteFrom(['person', 'pet'])
   *   .using('person')
   *   .innerJoin('pet', 'pet.owner_id', 'person.id')
   *   .where('person.id', '=', 1)
   *   .executeTakeFirst()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * delete from `person`, `pet`
   * using `person`
   * inner join `pet` on `pet`.`owner_id` = `person`.`id`
   * where `person`.`id` = ?
   * ```
   */
  deleteFrom(from) {
    return new DeleteQueryBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _props15).executor,
      queryNode: DeleteQueryNode.create(parseTableExpressionOrList(from), __privateGet(this, _props15).withNode)
    });
  }
  /**
   * Creates an update query.
   *
   * See the {@link UpdateQueryBuilder.where} method for examples on how to specify
   * a where clause for the update operation.
   *
   * See the {@link UpdateQueryBuilder.set} method for examples on how to
   * specify the updates.
   *
   * The return value of the query is an {@link UpdateResult}.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db
   *   .updateTable('person')
   *   .set({ first_name: 'Jennifer' })
   *   .where('person.id', '=', 1)
   *   .executeTakeFirst()
   *
   * console.log(result.numUpdatedRows)
   * ```
   */
  updateTable(tables) {
    return new UpdateQueryBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _props15).executor,
      queryNode: UpdateQueryNode.create(parseTableExpressionOrList(tables), __privateGet(this, _props15).withNode)
    });
  }
  /**
   * Creates a merge query.
   *
   * The return value of the query is a {@link MergeResult}.
   *
   * See the {@link MergeQueryBuilder.using} method for examples on how to specify
   * the other table.
   *
   * ### Examples
   *
   * <!-- siteExample("merge", "Source row existence", 10) -->
   *
   * Update a target column based on the existence of a source row:
   *
   * ```ts
   * const result = await db
   *   .mergeInto('person as target')
   *   .using('pet as source', 'source.owner_id', 'target.id')
   *   .whenMatchedAnd('target.has_pets', '!=', 'Y')
   *   .thenUpdateSet({ has_pets: 'Y' })
   *   .whenNotMatchedBySourceAnd('target.has_pets', '=', 'Y')
   *   .thenUpdateSet({ has_pets: 'N' })
   *   .executeTakeFirstOrThrow()
   *
   * console.log(result.numChangedRows)
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "person"
   * using "pet"
   * on "pet"."owner_id" = "person"."id"
   * when matched and "has_pets" != $1
   * then update set "has_pets" = $2
   * when not matched by source and "has_pets" = $3
   * then update set "has_pets" = $4
   * ```
   *
   * <!-- siteExample("merge", "Temporary changes table", 20) -->
   *
   * Merge new entries from a temporary changes table:
   *
   * ```ts
   * const result = await db
   *   .mergeInto('wine as target')
   *   .using(
   *     'wine_stock_change as source',
   *     'source.wine_name',
   *     'target.name',
   *   )
   *   .whenNotMatchedAnd('source.stock_delta', '>', 0)
   *   .thenInsertValues(({ ref }) => ({
   *     name: ref('source.wine_name'),
   *     stock: ref('source.stock_delta'),
   *   }))
   *   .whenMatchedAnd(
   *     (eb) => eb('target.stock', '+', eb.ref('source.stock_delta')),
   *     '>',
   *     0,
   *   )
   *   .thenUpdateSet('stock', (eb) =>
   *     eb('target.stock', '+', eb.ref('source.stock_delta')),
   *   )
   *   .whenMatched()
   *   .thenDelete()
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * merge into "wine" as "target"
   * using "wine_stock_change" as "source"
   * on "source"."wine_name" = "target"."name"
   * when not matched and "source"."stock_delta" > $1
   * then insert ("name", "stock") values ("source"."wine_name", "source"."stock_delta")
   * when matched and "target"."stock" + "source"."stock_delta" > $2
   * then update set "stock" = "target"."stock" + "source"."stock_delta"
   * when matched
   * then delete
   * ```
   */
  mergeInto(targetTable) {
    return new MergeQueryBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _props15).executor,
      queryNode: MergeQueryNode.create(parseAliasedTable(targetTable), __privateGet(this, _props15).withNode)
    });
  }
  /**
   * Creates a `with` query (Common Table Expression).
   *
   * ### Examples
   *
   * <!-- siteExample("cte", "Simple selects", 10) -->
   *
   * Common table expressions (CTE) are a great way to modularize complex queries.
   * Essentially they allow you to run multiple separate queries within a
   * single roundtrip to the DB.
   *
   * Since CTEs are a part of the main query, query optimizers inside DB
   * engines are able to optimize the overall query. For example, postgres
   * is able to inline the CTEs inside the using queries if it decides it's
   * faster.
   *
   * ```ts
   * const result = await db
   *   // Create a CTE called `jennifers` that selects all
   *   // persons named 'Jennifer'.
   *   .with('jennifers', (db) => db
   *     .selectFrom('person')
   *     .where('first_name', '=', 'Jennifer')
   *     .select(['id', 'age'])
   *   )
   *   // Select all rows from the `jennifers` CTE and
   *   // further filter it.
   *   .with('adult_jennifers', (db) => db
   *     .selectFrom('jennifers')
   *     .where('age', '>', 18)
   *     .select(['id', 'age'])
   *   )
   *   // Finally select all adult jennifers that are
   *   // also younger than 60.
   *   .selectFrom('adult_jennifers')
   *   .where('age', '<', 60)
   *   .selectAll()
   *   .execute()
   * ```
   *
   * <!-- siteExample("cte", "Inserts, updates and deletions", 20) -->
   *
   * Some databases like postgres also allow you to run other queries than selects
   * in CTEs. On these databases CTEs are extremely powerful:
   *
   * ```ts
   * const result = await db
   *   .with('new_person', (db) => db
   *     .insertInto('person')
   *     .values({
   *       first_name: 'Jennifer',
   *       age: 35,
   *     })
   *     .returning('id')
   *   )
   *   .with('new_pet', (db) => db
   *     .insertInto('pet')
   *     .values({
   *       name: 'Doggo',
   *       species: 'dog',
   *       is_favorite: true,
   *       // Use the id of the person we just inserted.
   *       owner_id: db
   *         .selectFrom('new_person')
   *         .select('id')
   *     })
   *     .returning('id')
   *   )
   *   .selectFrom(['new_person', 'new_pet'])
   *   .select([
   *     'new_person.id as person_id',
   *     'new_pet.id as pet_id'
   *   ])
   *   .execute()
   * ```
   *
   * The CTE name can optionally specify column names in addition to
   * a name. In that case Kysely requires the expression to retun
   * rows with the same columns.
   *
   * ```ts
   * await db
   *   .with('jennifers(id, age)', (db) => db
   *     .selectFrom('person')
   *     .where('first_name', '=', 'Jennifer')
   *     // This is ok since we return columns with the same
   *     // names as specified by `jennifers(id, age)`.
   *     .select(['id', 'age'])
   *   )
   *   .selectFrom('jennifers')
   *   .selectAll()
   *   .execute()
   * ```
   *
   * The first argument can also be a callback. The callback is passed
   * a `CTEBuilder` instance that can be used to configure the CTE:
   *
   * ```ts
   * await db
   *   .with(
   *     (cte) => cte('jennifers').materialized(),
   *     (db) => db
   *       .selectFrom('person')
   *       .where('first_name', '=', 'Jennifer')
   *       .select(['id', 'age'])
   *   )
   *   .selectFrom('jennifers')
   *   .selectAll()
   *   .execute()
   * ```
   */
  with(nameOrBuilder, expression) {
    const cte = parseCommonTableExpression(nameOrBuilder, expression);
    return new _QueryCreator({
      ...__privateGet(this, _props15),
      withNode: __privateGet(this, _props15).withNode ? WithNode.cloneWithExpression(__privateGet(this, _props15).withNode, cte) : WithNode.create(cte)
    });
  }
  /**
   * Creates a recursive `with` query (Common Table Expression).
   *
   * Note that recursiveness is a property of the whole `with` statement.
   * You cannot have recursive and non-recursive CTEs in a same `with` statement.
   * Therefore the recursiveness is determined by the **first** `with` or
   * `withRecusive` call you make.
   *
   * See the {@link with} method for examples and more documentation.
   */
  withRecursive(nameOrBuilder, expression) {
    const cte = parseCommonTableExpression(nameOrBuilder, expression);
    return new _QueryCreator({
      ...__privateGet(this, _props15),
      withNode: __privateGet(this, _props15).withNode ? WithNode.cloneWithExpression(__privateGet(this, _props15).withNode, cte) : WithNode.create(cte, { recursive: true })
    });
  }
  /**
   * Returns a copy of this query creator instance with the given plugin installed.
   */
  withPlugin(plugin) {
    return new _QueryCreator({
      ...__privateGet(this, _props15),
      executor: __privateGet(this, _props15).executor.withPlugin(plugin)
    });
  }
  /**
   * Returns a copy of this query creator instance without any plugins.
   */
  withoutPlugins() {
    return new _QueryCreator({
      ...__privateGet(this, _props15),
      executor: __privateGet(this, _props15).executor.withoutPlugins()
    });
  }
  /**
   * Sets the schema to be used for all table references that don't explicitly
   * specify a schema.
   *
   * This only affects the query created through the builder returned from
   * this method and doesn't modify the `db` instance.
   *
   * See [this recipe](https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0007-schemas.md)
   * for a more detailed explanation.
   *
   * ### Examples
   *
   * ```
   * await db
   *   .withSchema('mammals')
   *   .selectFrom('pet')
   *   .selectAll()
   *   .innerJoin('public.person', 'public.person.id', 'pet.owner_id')
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select * from "mammals"."pet"
   * inner join "public"."person"
   * on "public"."person"."id" = "mammals"."pet"."owner_id"
   * ```
   *
   * `withSchema` is smart enough to not add schema for aliases,
   * common table expressions or other places where the schema
   * doesn't belong to:
   *
   * ```
   * await db
   *   .withSchema('mammals')
   *   .selectFrom('pet as p')
   *   .select('p.name')
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "p"."name" from "mammals"."pet" as "p"
   * ```
   */
  withSchema(schema) {
    return new _QueryCreator({
      ...__privateGet(this, _props15),
      executor: __privateGet(this, _props15).executor.withPluginAtFront(new WithSchemaPlugin(schema))
    });
  }
};
_props15 = new WeakMap();
var QueryCreator = _QueryCreator;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/parse-utils.js
function createQueryCreator() {
  return new QueryCreator({
    executor: NOOP_QUERY_EXECUTOR
  });
}
function createJoinBuilder(joinType, table) {
  return new JoinBuilder({
    joinNode: JoinNode.create(joinType, parseTableExpression(table))
  });
}
function createOverBuilder() {
  return new OverBuilder({
    overNode: OverNode.create()
  });
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/join-parser.js
function parseJoin(joinType, args) {
  if (args.length === 3) {
    return parseSingleOnJoin(joinType, args[0], args[1], args[2]);
  } else if (args.length === 2) {
    return parseCallbackJoin(joinType, args[0], args[1]);
  } else if (args.length === 1) {
    return parseOnlessJoin(joinType, args[0]);
  } else {
    throw new Error("not implemented");
  }
}
function parseCallbackJoin(joinType, from, callback) {
  return callback(createJoinBuilder(joinType, from)).toOperationNode();
}
function parseSingleOnJoin(joinType, from, lhsColumn, rhsColumn) {
  return JoinNode.createWithOn(joinType, parseTableExpression(from), parseReferentialBinaryOperation(lhsColumn, "=", rhsColumn));
}
function parseOnlessJoin(joinType, from) {
  return JoinNode.create(joinType, parseTableExpression(from));
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/offset-node.js
var OffsetNode = freeze({
  is(node) {
    return node.kind === "OffsetNode";
  },
  create(offset) {
    return freeze({
      kind: "OffsetNode",
      offset
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/group-by-item-node.js
var GroupByItemNode = freeze({
  is(node) {
    return node.kind === "GroupByItemNode";
  },
  create(groupBy) {
    return freeze({
      kind: "GroupByItemNode",
      groupBy
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/group-by-parser.js
function parseGroupBy(groupBy) {
  groupBy = isFunction(groupBy) ? groupBy(expressionBuilder()) : groupBy;
  return parseReferenceExpressionOrList(groupBy).map(GroupByItemNode.create);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/set-operation-node.js
var SetOperationNode = freeze({
  is(node) {
    return node.kind === "SetOperationNode";
  },
  create(operator, expression, all) {
    return freeze({
      kind: "SetOperationNode",
      operator,
      expression,
      all
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/set-operation-parser.js
function parseSetOperations(operator, expression, all) {
  if (isFunction(expression)) {
    expression = expression(createExpressionBuilder());
  }
  if (!isReadonlyArray(expression)) {
    expression = [expression];
  }
  return expression.map((expr) => SetOperationNode.create(operator, parseExpression(expr), all));
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/expression/expression-wrapper.js
var _node;
var _ExpressionWrapper = class _ExpressionWrapper {
  constructor(node) {
    __privateAdd(this, _node);
    __privateSet(this, _node, node);
  }
  /** @private */
  get expressionType() {
    return void 0;
  }
  as(alias) {
    return new AliasedExpressionWrapper(this, alias);
  }
  or(...args) {
    return new OrWrapper(OrNode.create(__privateGet(this, _node), parseValueBinaryOperationOrExpression(args)));
  }
  and(...args) {
    return new AndWrapper(AndNode.create(__privateGet(this, _node), parseValueBinaryOperationOrExpression(args)));
  }
  /**
   * Change the output type of the expression.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `ExpressionWrapper` with a new output type.
   */
  $castTo() {
    return new _ExpressionWrapper(__privateGet(this, _node));
  }
  /**
   * Omit null from the expression's type.
   *
   * This function can be useful in cases where you know an expression can't be
   * null, but Kysely is unable to infer it.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of `this` with a new output type.
   */
  $notNull() {
    return new _ExpressionWrapper(__privateGet(this, _node));
  }
  toOperationNode() {
    return __privateGet(this, _node);
  }
};
_node = new WeakMap();
var ExpressionWrapper = _ExpressionWrapper;
var _expr, _alias;
var AliasedExpressionWrapper = class {
  constructor(expr, alias) {
    __privateAdd(this, _expr);
    __privateAdd(this, _alias);
    __privateSet(this, _expr, expr);
    __privateSet(this, _alias, alias);
  }
  /** @private */
  get expression() {
    return __privateGet(this, _expr);
  }
  /** @private */
  get alias() {
    return __privateGet(this, _alias);
  }
  toOperationNode() {
    return AliasNode.create(__privateGet(this, _expr).toOperationNode(), isOperationNodeSource(__privateGet(this, _alias)) ? __privateGet(this, _alias).toOperationNode() : IdentifierNode.create(__privateGet(this, _alias)));
  }
};
_expr = new WeakMap();
_alias = new WeakMap();
var _node2;
var _OrWrapper = class _OrWrapper {
  constructor(node) {
    __privateAdd(this, _node2);
    __privateSet(this, _node2, node);
  }
  /** @private */
  get expressionType() {
    return void 0;
  }
  as(alias) {
    return new AliasedExpressionWrapper(this, alias);
  }
  or(...args) {
    return new _OrWrapper(OrNode.create(__privateGet(this, _node2), parseValueBinaryOperationOrExpression(args)));
  }
  /**
   * Change the output type of the expression.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `OrWrapper` with a new output type.
   */
  $castTo() {
    return new _OrWrapper(__privateGet(this, _node2));
  }
  toOperationNode() {
    return ParensNode.create(__privateGet(this, _node2));
  }
};
_node2 = new WeakMap();
var OrWrapper = _OrWrapper;
var _node3;
var _AndWrapper = class _AndWrapper {
  constructor(node) {
    __privateAdd(this, _node3);
    __privateSet(this, _node3, node);
  }
  /** @private */
  get expressionType() {
    return void 0;
  }
  as(alias) {
    return new AliasedExpressionWrapper(this, alias);
  }
  and(...args) {
    return new _AndWrapper(AndNode.create(__privateGet(this, _node3), parseValueBinaryOperationOrExpression(args)));
  }
  /**
   * Change the output type of the expression.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `AndWrapper` with a new output type.
   */
  $castTo() {
    return new _AndWrapper(__privateGet(this, _node3));
  }
  toOperationNode() {
    return ParensNode.create(__privateGet(this, _node3));
  }
};
_node3 = new WeakMap();
var AndWrapper = _AndWrapper;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/fetch-node.js
var FetchNode = {
  is(node) {
    return node.kind === "FetchNode";
  },
  create(rowCount, modifier) {
    return {
      kind: "FetchNode",
      rowCount: ValueNode.create(rowCount),
      modifier
    };
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/fetch-parser.js
function parseFetch(rowCount, modifier) {
  if (!isNumber(rowCount) && !isBigInt(rowCount)) {
    throw new Error(`Invalid fetch row count: ${rowCount}`);
  }
  if (!isFetchModifier(modifier)) {
    throw new Error(`Invalid fetch modifier: ${modifier}`);
  }
  return FetchNode.create(rowCount, modifier);
}
function isFetchModifier(value) {
  return value === "only" || value === "with ties";
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/select-query-builder.js
var _props16, _SelectQueryBuilderImpl_instances, join_fn3;
var _SelectQueryBuilderImpl = class _SelectQueryBuilderImpl {
  constructor(props) {
    __privateAdd(this, _SelectQueryBuilderImpl_instances);
    __privateAdd(this, _props16);
    __privateSet(this, _props16, freeze(props));
  }
  get expressionType() {
    return void 0;
  }
  get isSelectQueryBuilder() {
    return true;
  }
  where(...args) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithWhere(__privateGet(this, _props16).queryNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  whereRef(lhs, op, rhs) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithWhere(__privateGet(this, _props16).queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  having(...args) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithHaving(__privateGet(this, _props16).queryNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  havingRef(lhs, op, rhs) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithHaving(__privateGet(this, _props16).queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  select(selection) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSelections(__privateGet(this, _props16).queryNode, parseSelectArg(selection))
    });
  }
  distinctOn(selection) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithDistinctOn(__privateGet(this, _props16).queryNode, parseReferenceExpressionOrList(selection))
    });
  }
  modifyFront(modifier) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithFrontModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
    });
  }
  modifyEnd(modifier) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
    });
  }
  distinct() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithFrontModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.create("Distinct"))
    });
  }
  forUpdate(of) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.create("ForUpdate", of ? asArray(of).map(parseTable) : void 0))
    });
  }
  forShare(of) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.create("ForShare", of ? asArray(of).map(parseTable) : void 0))
    });
  }
  forKeyShare(of) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.create("ForKeyShare", of ? asArray(of).map(parseTable) : void 0))
    });
  }
  forNoKeyUpdate(of) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.create("ForNoKeyUpdate", of ? asArray(of).map(parseTable) : void 0))
    });
  }
  skipLocked() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.create("SkipLocked"))
    });
  }
  noWait() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithEndModifier(__privateGet(this, _props16).queryNode, SelectModifierNode.create("NoWait"))
    });
  }
  selectAll(table) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSelections(__privateGet(this, _props16).queryNode, parseSelectAll(table))
    });
  }
  innerJoin(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "InnerJoin", args);
  }
  leftJoin(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "LeftJoin", args);
  }
  rightJoin(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "RightJoin", args);
  }
  fullJoin(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "FullJoin", args);
  }
  crossJoin(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "CrossJoin", args);
  }
  innerJoinLateral(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "LateralInnerJoin", args);
  }
  leftJoinLateral(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "LateralLeftJoin", args);
  }
  crossJoinLateral(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "LateralCrossJoin", args);
  }
  crossApply(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "CrossApply", args);
  }
  outerApply(...args) {
    return __privateMethod(this, _SelectQueryBuilderImpl_instances, join_fn3).call(this, "OuterApply", args);
  }
  orderBy(...args) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithOrderByItems(__privateGet(this, _props16).queryNode, parseOrderBy(args))
    });
  }
  groupBy(groupBy) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithGroupByItems(__privateGet(this, _props16).queryNode, parseGroupBy(groupBy))
    });
  }
  limit(limit) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithLimit(__privateGet(this, _props16).queryNode, LimitNode.create(parseValueExpression(limit)))
    });
  }
  offset(offset) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithOffset(__privateGet(this, _props16).queryNode, OffsetNode.create(parseValueExpression(offset)))
    });
  }
  fetch(rowCount, modifier = "only") {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithFetch(__privateGet(this, _props16).queryNode, parseFetch(rowCount, modifier))
    });
  }
  top(expression, modifiers) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithTop(__privateGet(this, _props16).queryNode, parseTop(expression, modifiers))
    });
  }
  union(expression) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSetOperations(__privateGet(this, _props16).queryNode, parseSetOperations("union", expression, false))
    });
  }
  unionAll(expression) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSetOperations(__privateGet(this, _props16).queryNode, parseSetOperations("union", expression, true))
    });
  }
  intersect(expression) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSetOperations(__privateGet(this, _props16).queryNode, parseSetOperations("intersect", expression, false))
    });
  }
  intersectAll(expression) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSetOperations(__privateGet(this, _props16).queryNode, parseSetOperations("intersect", expression, true))
    });
  }
  except(expression) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSetOperations(__privateGet(this, _props16).queryNode, parseSetOperations("except", expression, false))
    });
  }
  exceptAll(expression) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithSetOperations(__privateGet(this, _props16).queryNode, parseSetOperations("except", expression, true))
    });
  }
  as(alias) {
    return new AliasedSelectQueryBuilderImpl(this, alias);
  }
  clearSelect() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithoutSelections(__privateGet(this, _props16).queryNode)
    });
  }
  clearWhere() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithoutWhere(__privateGet(this, _props16).queryNode)
    });
  }
  clearLimit() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithoutLimit(__privateGet(this, _props16).queryNode)
    });
  }
  clearOffset() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithoutOffset(__privateGet(this, _props16).queryNode)
    });
  }
  clearOrderBy() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithoutOrderBy(__privateGet(this, _props16).queryNode)
    });
  }
  clearGroupBy() {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: SelectQueryNode.cloneWithoutGroupBy(__privateGet(this, _props16).queryNode)
    });
  }
  $call(func) {
    return func(this);
  }
  $if(condition, func) {
    if (condition) {
      return func(this);
    }
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16)
    });
  }
  $castTo() {
    return new _SelectQueryBuilderImpl(__privateGet(this, _props16));
  }
  $narrowType() {
    return new _SelectQueryBuilderImpl(__privateGet(this, _props16));
  }
  $assertType() {
    return new _SelectQueryBuilderImpl(__privateGet(this, _props16));
  }
  $asTuple() {
    return new ExpressionWrapper(this.toOperationNode());
  }
  $asScalar() {
    return new ExpressionWrapper(this.toOperationNode());
  }
  withPlugin(plugin) {
    return new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      executor: __privateGet(this, _props16).executor.withPlugin(plugin)
    });
  }
  toOperationNode() {
    return __privateGet(this, _props16).executor.transformQuery(__privateGet(this, _props16).queryNode, __privateGet(this, _props16).queryId);
  }
  compile() {
    return __privateGet(this, _props16).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props16).queryId);
  }
  async execute() {
    const compiledQuery = this.compile();
    const result = await __privateGet(this, _props16).executor.executeQuery(compiledQuery, __privateGet(this, _props16).queryId);
    return result.rows;
  }
  async executeTakeFirst() {
    const [result] = await this.execute();
    return result;
  }
  async executeTakeFirstOrThrow(errorConstructor = NoResultError) {
    const result = await this.executeTakeFirst();
    if (result === void 0) {
      const error = isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
      throw error;
    }
    return result;
  }
  async *stream(chunkSize = 100) {
    const compiledQuery = this.compile();
    const stream = __privateGet(this, _props16).executor.stream(compiledQuery, chunkSize, __privateGet(this, _props16).queryId);
    for await (const item of stream) {
      yield* item.rows;
    }
  }
  async explain(format, options) {
    const builder = new _SelectQueryBuilderImpl({
      ...__privateGet(this, _props16),
      queryNode: QueryNode.cloneWithExplain(__privateGet(this, _props16).queryNode, format, options)
    });
    return await builder.execute();
  }
};
_props16 = new WeakMap();
_SelectQueryBuilderImpl_instances = new WeakSet();
join_fn3 = function(joinType, args) {
  return new _SelectQueryBuilderImpl({
    ...__privateGet(this, _props16),
    queryNode: QueryNode.cloneWithJoin(__privateGet(this, _props16).queryNode, parseJoin(joinType, args))
  });
};
var SelectQueryBuilderImpl = _SelectQueryBuilderImpl;
function createSelectQueryBuilder(props) {
  return new SelectQueryBuilderImpl(props);
}
var _queryBuilder, _alias2;
var AliasedSelectQueryBuilderImpl = class {
  constructor(queryBuilder, alias) {
    __privateAdd(this, _queryBuilder);
    __privateAdd(this, _alias2);
    __privateSet(this, _queryBuilder, queryBuilder);
    __privateSet(this, _alias2, alias);
  }
  get expression() {
    return __privateGet(this, _queryBuilder);
  }
  get alias() {
    return __privateGet(this, _alias2);
  }
  get isAliasedSelectQueryBuilder() {
    return true;
  }
  toOperationNode() {
    return AliasNode.create(__privateGet(this, _queryBuilder).toOperationNode(), IdentifierNode.create(__privateGet(this, _alias2)));
  }
};
_queryBuilder = new WeakMap();
_alias2 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/aggregate-function-node.js
var AggregateFunctionNode = freeze({
  is(node) {
    return node.kind === "AggregateFunctionNode";
  },
  create(aggregateFunction, aggregated = []) {
    return freeze({
      kind: "AggregateFunctionNode",
      func: aggregateFunction,
      aggregated
    });
  },
  cloneWithDistinct(aggregateFunctionNode) {
    return freeze({
      ...aggregateFunctionNode,
      distinct: true
    });
  },
  cloneWithOrderBy(aggregateFunctionNode, orderItems, withinGroup = false) {
    const prop = withinGroup ? "withinGroup" : "orderBy";
    return freeze({
      ...aggregateFunctionNode,
      [prop]: aggregateFunctionNode[prop] ? OrderByNode.cloneWithItems(aggregateFunctionNode[prop], orderItems) : OrderByNode.create(orderItems)
    });
  },
  cloneWithFilter(aggregateFunctionNode, filter) {
    return freeze({
      ...aggregateFunctionNode,
      filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "And", filter) : WhereNode.create(filter)
    });
  },
  cloneWithOrFilter(aggregateFunctionNode, filter) {
    return freeze({
      ...aggregateFunctionNode,
      filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "Or", filter) : WhereNode.create(filter)
    });
  },
  cloneWithOver(aggregateFunctionNode, over) {
    return freeze({
      ...aggregateFunctionNode,
      over
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/function-node.js
var FunctionNode = freeze({
  is(node) {
    return node.kind === "FunctionNode";
  },
  create(func, args) {
    return freeze({
      kind: "FunctionNode",
      func,
      arguments: args
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/aggregate-function-builder.js
var _props17;
var _AggregateFunctionBuilder = class _AggregateFunctionBuilder {
  constructor(props) {
    __privateAdd(this, _props17);
    __privateSet(this, _props17, freeze(props));
  }
  /** @private */
  get expressionType() {
    return void 0;
  }
  /**
   * Returns an aliased version of the function.
   *
   * In addition to slapping `as "the_alias"` to the end of the SQL,
   * this method also provides strict typing:
   *
   * ```ts
   * const result = await db
   *   .selectFrom('person')
   *   .select(
   *     (eb) => eb.fn.count<number>('id').as('person_count')
   *   )
   *   .executeTakeFirstOrThrow()
   *
   * // `person_count: number` field exists in the result type.
   * console.log(result.person_count)
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select count("id") as "person_count"
   * from "person"
   * ```
   */
  as(alias) {
    return new AliasedAggregateFunctionBuilder(this, alias);
  }
  /**
   * Adds a `distinct` clause inside the function.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db
   *   .selectFrom('person')
   *   .select((eb) =>
   *     eb.fn.count<number>('first_name').distinct().as('first_name_count')
   *   )
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select count(distinct "first_name") as "first_name_count"
   * from "person"
   * ```
   */
  distinct() {
    return new _AggregateFunctionBuilder({
      ...__privateGet(this, _props17),
      aggregateFunctionNode: AggregateFunctionNode.cloneWithDistinct(__privateGet(this, _props17).aggregateFunctionNode)
    });
  }
  orderBy(...args) {
    return new _AggregateFunctionBuilder({
      ...__privateGet(this, _props17),
      aggregateFunctionNode: QueryNode.cloneWithOrderByItems(__privateGet(this, _props17).aggregateFunctionNode, parseOrderBy(args))
    });
  }
  clearOrderBy() {
    return new _AggregateFunctionBuilder({
      ...__privateGet(this, _props17),
      aggregateFunctionNode: QueryNode.cloneWithoutOrderBy(__privateGet(this, _props17).aggregateFunctionNode)
    });
  }
  withinGroupOrderBy(...args) {
    return new _AggregateFunctionBuilder({
      ...__privateGet(this, _props17),
      aggregateFunctionNode: AggregateFunctionNode.cloneWithOrderBy(__privateGet(this, _props17).aggregateFunctionNode, parseOrderBy(args), true)
    });
  }
  filterWhere(...args) {
    return new _AggregateFunctionBuilder({
      ...__privateGet(this, _props17),
      aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(__privateGet(this, _props17).aggregateFunctionNode, parseValueBinaryOperationOrExpression(args))
    });
  }
  /**
   * Adds a `filter` clause with a nested `where` clause after the function, where
   * both sides of the operator are references to columns.
   *
   * Similar to {@link WhereInterface}'s `whereRef` method.
   *
   * ### Examples
   *
   * Count people with same first and last names versus general public:
   *
   * ```ts
   * const result = await db
   *   .selectFrom('person')
   *   .select((eb) => [
   *     eb.fn
   *       .count<number>('id')
   *       .filterWhereRef('first_name', '=', 'last_name')
   *       .as('repeat_name_count'),
   *     eb.fn.count<number>('id').as('total_count'),
   *   ])
   *   .executeTakeFirstOrThrow()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select
   *   count("id") filter(where "first_name" = "last_name") as "repeat_name_count",
   *   count("id") as "total_count"
   * from "person"
   * ```
   */
  filterWhereRef(lhs, op, rhs) {
    return new _AggregateFunctionBuilder({
      ...__privateGet(this, _props17),
      aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(__privateGet(this, _props17).aggregateFunctionNode, parseReferentialBinaryOperation(lhs, op, rhs))
    });
  }
  /**
   * Adds an `over` clause (window functions) after the function.
   *
   * ### Examples
   *
   * ```ts
   * const result = await db
   *   .selectFrom('person')
   *   .select(
   *     (eb) => eb.fn.avg<number>('age').over().as('average_age')
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select avg("age") over() as "average_age"
   * from "person"
   * ```
   *
   * Also supports passing a callback that returns an over builder,
   * allowing to add partition by and sort by clauses inside over.
   *
   * ```ts
   * const result = await db
   *   .selectFrom('person')
   *   .select(
   *     (eb) => eb.fn.avg<number>('age').over(
   *       ob => ob.partitionBy('last_name').orderBy('first_name', 'asc')
   *     ).as('average_age')
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select avg("age") over(partition by "last_name" order by "first_name" asc) as "average_age"
   * from "person"
   * ```
   */
  over(over) {
    const builder = createOverBuilder();
    return new _AggregateFunctionBuilder({
      ...__privateGet(this, _props17),
      aggregateFunctionNode: AggregateFunctionNode.cloneWithOver(__privateGet(this, _props17).aggregateFunctionNode, (over ? over(builder) : builder).toOperationNode())
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  /**
   * Casts the expression to the given type.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `AggregateFunctionBuilder` with a new output type.
   */
  $castTo() {
    return new _AggregateFunctionBuilder(__privateGet(this, _props17));
  }
  /**
   * Omit null from the expression's type.
   *
   * This function can be useful in cases where you know an expression can't be
   * null, but Kysely is unable to infer it.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of `this` with a new output type.
   */
  $notNull() {
    return new _AggregateFunctionBuilder(__privateGet(this, _props17));
  }
  toOperationNode() {
    return __privateGet(this, _props17).aggregateFunctionNode;
  }
};
_props17 = new WeakMap();
var AggregateFunctionBuilder = _AggregateFunctionBuilder;
var _aggregateFunctionBuilder, _alias3;
var AliasedAggregateFunctionBuilder = class {
  constructor(aggregateFunctionBuilder, alias) {
    __privateAdd(this, _aggregateFunctionBuilder);
    __privateAdd(this, _alias3);
    __privateSet(this, _aggregateFunctionBuilder, aggregateFunctionBuilder);
    __privateSet(this, _alias3, alias);
  }
  /** @private */
  get expression() {
    return __privateGet(this, _aggregateFunctionBuilder);
  }
  /** @private */
  get alias() {
    return __privateGet(this, _alias3);
  }
  toOperationNode() {
    return AliasNode.create(__privateGet(this, _aggregateFunctionBuilder).toOperationNode(), IdentifierNode.create(__privateGet(this, _alias3)));
  }
};
_aggregateFunctionBuilder = new WeakMap();
_alias3 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/function-module.js
function createFunctionModule() {
  const fn = (name, args) => {
    return new ExpressionWrapper(FunctionNode.create(name, parseReferenceExpressionOrList(args ?? [])));
  };
  const agg = (name, args) => {
    return new AggregateFunctionBuilder({
      aggregateFunctionNode: AggregateFunctionNode.create(name, args ? parseReferenceExpressionOrList(args) : void 0)
    });
  };
  return Object.assign(fn, {
    agg,
    avg(column) {
      return agg("avg", [column]);
    },
    coalesce(...values) {
      return fn("coalesce", values);
    },
    count(column) {
      return agg("count", [column]);
    },
    countAll(table) {
      return new AggregateFunctionBuilder({
        aggregateFunctionNode: AggregateFunctionNode.create("count", parseSelectAll(table))
      });
    },
    max(column) {
      return agg("max", [column]);
    },
    min(column) {
      return agg("min", [column]);
    },
    sum(column) {
      return agg("sum", [column]);
    },
    any(column) {
      return fn("any", [column]);
    },
    jsonAgg(table) {
      return new AggregateFunctionBuilder({
        aggregateFunctionNode: AggregateFunctionNode.create("json_agg", [
          isString(table) ? parseTable(table) : table.toOperationNode()
        ])
      });
    },
    toJson(table) {
      return new ExpressionWrapper(FunctionNode.create("to_json", [
        isString(table) ? parseTable(table) : table.toOperationNode()
      ]));
    }
  });
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/unary-operation-node.js
var UnaryOperationNode = freeze({
  is(node) {
    return node.kind === "UnaryOperationNode";
  },
  create(operator, operand) {
    return freeze({
      kind: "UnaryOperationNode",
      operator,
      operand
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/unary-operation-parser.js
function parseUnaryOperation(operator, operand) {
  return UnaryOperationNode.create(OperatorNode.create(operator), parseReferenceExpression(operand));
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/case-node.js
var CaseNode = freeze({
  is(node) {
    return node.kind === "CaseNode";
  },
  create(value) {
    return freeze({
      kind: "CaseNode",
      value
    });
  },
  cloneWithWhen(caseNode, when) {
    return freeze({
      ...caseNode,
      when: freeze(caseNode.when ? [...caseNode.when, when] : [when])
    });
  },
  cloneWithThen(caseNode, then) {
    return freeze({
      ...caseNode,
      when: caseNode.when ? freeze([
        ...caseNode.when.slice(0, -1),
        WhenNode.cloneWithResult(caseNode.when[caseNode.when.length - 1], then)
      ]) : void 0
    });
  },
  cloneWith(caseNode, props) {
    return freeze({
      ...caseNode,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/case-builder.js
var _props18;
var CaseBuilder = class {
  constructor(props) {
    __privateAdd(this, _props18);
    __privateSet(this, _props18, freeze(props));
  }
  when(...args) {
    return new CaseThenBuilder({
      ...__privateGet(this, _props18),
      node: CaseNode.cloneWithWhen(__privateGet(this, _props18).node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
    });
  }
};
_props18 = new WeakMap();
var _props19;
var CaseThenBuilder = class {
  constructor(props) {
    __privateAdd(this, _props19);
    __privateSet(this, _props19, freeze(props));
  }
  then(valueExpression) {
    return new CaseWhenBuilder({
      ...__privateGet(this, _props19),
      node: CaseNode.cloneWithThen(__privateGet(this, _props19).node, isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression))
    });
  }
};
_props19 = new WeakMap();
var _props20;
var CaseWhenBuilder = class {
  constructor(props) {
    __privateAdd(this, _props20);
    __privateSet(this, _props20, freeze(props));
  }
  when(...args) {
    return new CaseThenBuilder({
      ...__privateGet(this, _props20),
      node: CaseNode.cloneWithWhen(__privateGet(this, _props20).node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
    });
  }
  else(valueExpression) {
    return new CaseEndBuilder({
      ...__privateGet(this, _props20),
      node: CaseNode.cloneWith(__privateGet(this, _props20).node, {
        else: isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression)
      })
    });
  }
  end() {
    return new ExpressionWrapper(CaseNode.cloneWith(__privateGet(this, _props20).node, { isStatement: false }));
  }
  endCase() {
    return new ExpressionWrapper(CaseNode.cloneWith(__privateGet(this, _props20).node, { isStatement: true }));
  }
};
_props20 = new WeakMap();
var _props21;
var CaseEndBuilder = class {
  constructor(props) {
    __privateAdd(this, _props21);
    __privateSet(this, _props21, freeze(props));
  }
  end() {
    return new ExpressionWrapper(CaseNode.cloneWith(__privateGet(this, _props21).node, { isStatement: false }));
  }
  endCase() {
    return new ExpressionWrapper(CaseNode.cloneWith(__privateGet(this, _props21).node, { isStatement: true }));
  }
};
_props21 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/json-path-leg-node.js
var JSONPathLegNode = freeze({
  is(node) {
    return node.kind === "JSONPathLegNode";
  },
  create(type, value) {
    return freeze({
      kind: "JSONPathLegNode",
      type,
      value
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-builder/json-path-builder.js
var _node4, _JSONPathBuilder_instances, createBuilderWithPathLeg_fn;
var JSONPathBuilder = class {
  constructor(node) {
    __privateAdd(this, _JSONPathBuilder_instances);
    __privateAdd(this, _node4);
    __privateSet(this, _node4, node);
  }
  /**
   * Access an element of a JSON array in a specific location.
   *
   * Since there's no guarantee an element exists in the given array location, the
   * resulting type is always nullable. If you're sure the element exists, you
   * should use {@link SelectQueryBuilder.$assertType} to narrow the type safely.
   *
   * See also {@link key} to access properties of JSON objects.
   *
   * ### Examples
   *
   * ```ts
   * await db.selectFrom('person')
   *   .select(eb =>
   *     eb.ref('nicknames', '->').at(0).as('primary_nickname')
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "nicknames"->0 as "primary_nickname" from "person"
   *```
   *
   * Combined with {@link key}:
   *
   * ```ts
   * db.selectFrom('person').select(eb =>
   *   eb.ref('experience', '->').at(0).key('role').as('first_role')
   * )
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "experience"->0->'role' as "first_role" from "person"
   * ```
   *
   * You can use `'last'` to access the last element of the array in MySQL:
   *
   * ```ts
   * db.selectFrom('person').select(eb =>
   *   eb.ref('nicknames', '->$').at('last').as('last_nickname')
   * )
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * select `nicknames`->'$[last]' as `last_nickname` from `person`
   * ```
   *
   * Or `'#-1'` in SQLite:
   *
   * ```ts
   * db.selectFrom('person').select(eb =>
   *   eb.ref('nicknames', '->>$').at('#-1').as('last_nickname')
   * )
   * ```
   *
   * The generated SQL (SQLite):
   *
   * ```sql
   * select "nicknames"->>'$[#-1]' as `last_nickname` from `person`
   * ```
   */
  at(index) {
    return __privateMethod(this, _JSONPathBuilder_instances, createBuilderWithPathLeg_fn).call(this, "ArrayLocation", index);
  }
  /**
   * Access a property of a JSON object.
   *
   * If a field is optional, the resulting type will be nullable.
   *
   * See also {@link at} to access elements of JSON arrays.
   *
   * ### Examples
   *
   * ```ts
   * db.selectFrom('person').select(eb =>
   *   eb.ref('address', '->').key('city').as('city')
   * )
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "address"->'city' as "city" from "person"
   * ```
   *
   * Going deeper:
   *
   * ```ts
   * db.selectFrom('person').select(eb =>
   *   eb.ref('profile', '->$').key('website').key('url').as('website_url')
   * )
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * select `profile`->'$.website.url' as `website_url` from `person`
   * ```
   *
   * Combined with {@link at}:
   *
   * ```ts
   * db.selectFrom('person').select(eb =>
   *   eb.ref('profile', '->').key('addresses').at(0).key('city').as('city')
   * )
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "profile"->'addresses'->0->'city' as "city" from "person"
   * ```
   */
  key(key) {
    return __privateMethod(this, _JSONPathBuilder_instances, createBuilderWithPathLeg_fn).call(this, "Member", key);
  }
};
_node4 = new WeakMap();
_JSONPathBuilder_instances = new WeakSet();
createBuilderWithPathLeg_fn = function(legType, value) {
  if (JSONReferenceNode.is(__privateGet(this, _node4))) {
    return new TraversedJSONPathBuilder(JSONReferenceNode.cloneWithTraversal(__privateGet(this, _node4), JSONPathNode.is(__privateGet(this, _node4).traversal) ? JSONPathNode.cloneWithLeg(__privateGet(this, _node4).traversal, JSONPathLegNode.create(legType, value)) : JSONOperatorChainNode.cloneWithValue(__privateGet(this, _node4).traversal, ValueNode.createImmediate(value))));
  }
  return new TraversedJSONPathBuilder(JSONPathNode.cloneWithLeg(__privateGet(this, _node4), JSONPathLegNode.create(legType, value)));
};
var _node5;
var _TraversedJSONPathBuilder = class _TraversedJSONPathBuilder extends JSONPathBuilder {
  constructor(node) {
    super(node);
    __privateAdd(this, _node5);
    __privateSet(this, _node5, node);
  }
  /** @private */
  get expressionType() {
    return void 0;
  }
  as(alias) {
    return new AliasedJSONPathBuilder(this, alias);
  }
  /**
   * Change the output type of the json path.
   *
   * This method call doesn't change the SQL in any way. This methods simply
   * returns a copy of this `JSONPathBuilder` with a new output type.
   */
  $castTo() {
    return new _TraversedJSONPathBuilder(__privateGet(this, _node5));
  }
  $notNull() {
    return new _TraversedJSONPathBuilder(__privateGet(this, _node5));
  }
  toOperationNode() {
    return __privateGet(this, _node5);
  }
};
_node5 = new WeakMap();
var TraversedJSONPathBuilder = _TraversedJSONPathBuilder;
var _jsonPath, _alias4;
var AliasedJSONPathBuilder = class {
  constructor(jsonPath, alias) {
    __privateAdd(this, _jsonPath);
    __privateAdd(this, _alias4);
    __privateSet(this, _jsonPath, jsonPath);
    __privateSet(this, _alias4, alias);
  }
  /** @private */
  get expression() {
    return __privateGet(this, _jsonPath);
  }
  /** @private */
  get alias() {
    return __privateGet(this, _alias4);
  }
  toOperationNode() {
    return AliasNode.create(__privateGet(this, _jsonPath).toOperationNode(), isOperationNodeSource(__privateGet(this, _alias4)) ? __privateGet(this, _alias4).toOperationNode() : IdentifierNode.create(__privateGet(this, _alias4)));
  }
};
_jsonPath = new WeakMap();
_alias4 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/tuple-node.js
var TupleNode = freeze({
  is(node) {
    return node.kind === "TupleNode";
  },
  create(values) {
    return freeze({
      kind: "TupleNode",
      values: freeze(values)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/data-type-node.js
var SIMPLE_COLUMN_DATA_TYPES = [
  "varchar",
  "char",
  "text",
  "integer",
  "int2",
  "int4",
  "int8",
  "smallint",
  "bigint",
  "boolean",
  "real",
  "double precision",
  "float4",
  "float8",
  "decimal",
  "numeric",
  "binary",
  "bytea",
  "date",
  "datetime",
  "time",
  "timetz",
  "timestamp",
  "timestamptz",
  "serial",
  "bigserial",
  "uuid",
  "json",
  "jsonb",
  "blob",
  "varbinary",
  "int4range",
  "int4multirange",
  "int8range",
  "int8multirange",
  "numrange",
  "nummultirange",
  "tsrange",
  "tsmultirange",
  "tstzrange",
  "tstzmultirange",
  "daterange",
  "datemultirange"
];
var COLUMN_DATA_TYPE_REGEX = [
  /^varchar\(\d+\)$/,
  /^char\(\d+\)$/,
  /^decimal\(\d+, \d+\)$/,
  /^numeric\(\d+, \d+\)$/,
  /^binary\(\d+\)$/,
  /^datetime\(\d+\)$/,
  /^time\(\d+\)$/,
  /^timetz\(\d+\)$/,
  /^timestamp\(\d+\)$/,
  /^timestamptz\(\d+\)$/,
  /^varbinary\(\d+\)$/
];
var DataTypeNode = freeze({
  is(node) {
    return node.kind === "DataTypeNode";
  },
  create(dataType) {
    return freeze({
      kind: "DataTypeNode",
      dataType
    });
  }
});
function isColumnDataType(dataType) {
  if (SIMPLE_COLUMN_DATA_TYPES.includes(dataType)) {
    return true;
  }
  if (COLUMN_DATA_TYPE_REGEX.some((r) => r.test(dataType))) {
    return true;
  }
  return false;
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/data-type-parser.js
function parseDataTypeExpression(dataType) {
  if (isOperationNodeSource(dataType)) {
    return dataType.toOperationNode();
  }
  if (isColumnDataType(dataType)) {
    return DataTypeNode.create(dataType);
  }
  throw new Error(`invalid column data type ${JSON.stringify(dataType)}`);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/cast-node.js
var CastNode = freeze({
  is(node) {
    return node.kind === "CastNode";
  },
  create(expression, dataType) {
    return freeze({
      kind: "CastNode",
      expression,
      dataType
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/expression/expression-builder.js
function createExpressionBuilder(executor = NOOP_QUERY_EXECUTOR) {
  function binary(lhs, op, rhs) {
    return new ExpressionWrapper(parseValueBinaryOperation(lhs, op, rhs));
  }
  function unary(op, expr) {
    return new ExpressionWrapper(parseUnaryOperation(op, expr));
  }
  const eb = Object.assign(binary, {
    fn: void 0,
    eb: void 0,
    selectFrom(table) {
      return createSelectQueryBuilder({
        queryId: createQueryId(),
        executor,
        queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(table))
      });
    },
    case(reference) {
      return new CaseBuilder({
        node: CaseNode.create(isUndefined(reference) ? void 0 : parseReferenceExpression(reference))
      });
    },
    ref(reference, op) {
      if (isUndefined(op)) {
        return new ExpressionWrapper(parseStringReference(reference));
      }
      return new JSONPathBuilder(parseJSONReference(reference, op));
    },
    jsonPath() {
      return new JSONPathBuilder(JSONPathNode.create());
    },
    table(table) {
      return new ExpressionWrapper(parseTable(table));
    },
    val(value) {
      return new ExpressionWrapper(parseValueExpression(value));
    },
    refTuple(...values) {
      return new ExpressionWrapper(TupleNode.create(values.map(parseReferenceExpression)));
    },
    tuple(...values) {
      return new ExpressionWrapper(TupleNode.create(values.map(parseValueExpression)));
    },
    lit(value) {
      return new ExpressionWrapper(parseSafeImmediateValue(value));
    },
    unary,
    not(expr) {
      return unary("not", expr);
    },
    exists(expr) {
      return unary("exists", expr);
    },
    neg(expr) {
      return unary("-", expr);
    },
    between(expr, start, end) {
      return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
    },
    betweenSymmetric(expr, start, end) {
      return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between symmetric"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
    },
    and(exprs) {
      if (isReadonlyArray(exprs)) {
        return new ExpressionWrapper(parseFilterList(exprs, "and"));
      }
      return new ExpressionWrapper(parseFilterObject(exprs, "and"));
    },
    or(exprs) {
      if (isReadonlyArray(exprs)) {
        return new ExpressionWrapper(parseFilterList(exprs, "or"));
      }
      return new ExpressionWrapper(parseFilterObject(exprs, "or"));
    },
    parens(...args) {
      const node = parseValueBinaryOperationOrExpression(args);
      if (ParensNode.is(node)) {
        return new ExpressionWrapper(node);
      } else {
        return new ExpressionWrapper(ParensNode.create(node));
      }
    },
    cast(expr, dataType) {
      return new ExpressionWrapper(CastNode.create(parseReferenceExpression(expr), parseDataTypeExpression(dataType)));
    },
    withSchema(schema) {
      return createExpressionBuilder(executor.withPluginAtFront(new WithSchemaPlugin(schema)));
    }
  });
  eb.fn = createFunctionModule();
  eb.eb = eb;
  return eb;
}
function expressionBuilder(_) {
  return createExpressionBuilder();
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/expression-parser.js
function parseExpression(exp) {
  if (isOperationNodeSource(exp)) {
    return exp.toOperationNode();
  } else if (isFunction(exp)) {
    return exp(expressionBuilder()).toOperationNode();
  }
  throw new Error(`invalid expression: ${JSON.stringify(exp)}`);
}
function parseAliasedExpression(exp) {
  if (isOperationNodeSource(exp)) {
    return exp.toOperationNode();
  } else if (isFunction(exp)) {
    return exp(expressionBuilder()).toOperationNode();
  }
  throw new Error(`invalid aliased expression: ${JSON.stringify(exp)}`);
}
function isExpressionOrFactory(obj) {
  return isExpression(obj) || isAliasedExpression(obj) || isFunction(obj);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dynamic/dynamic-table-builder.js
var _table;
var DynamicTableBuilder = class {
  constructor(table) {
    __privateAdd(this, _table);
    __privateSet(this, _table, table);
  }
  get table() {
    return __privateGet(this, _table);
  }
  as(alias) {
    return new AliasedDynamicTableBuilder(__privateGet(this, _table), alias);
  }
};
_table = new WeakMap();
var _table2, _alias5;
var AliasedDynamicTableBuilder = class {
  constructor(table, alias) {
    __privateAdd(this, _table2);
    __privateAdd(this, _alias5);
    __privateSet(this, _table2, table);
    __privateSet(this, _alias5, alias);
  }
  get table() {
    return __privateGet(this, _table2);
  }
  get alias() {
    return __privateGet(this, _alias5);
  }
  toOperationNode() {
    return AliasNode.create(parseTable(__privateGet(this, _table2)), IdentifierNode.create(__privateGet(this, _alias5)));
  }
};
_table2 = new WeakMap();
_alias5 = new WeakMap();
function isAliasedDynamicTableBuilder(obj) {
  return isObject(obj) && isOperationNodeSource(obj) && isString(obj.table) && isString(obj.alias);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/table-parser.js
function parseTableExpressionOrList(table) {
  if (isReadonlyArray(table)) {
    return table.map((it) => parseTableExpression(it));
  } else {
    return [parseTableExpression(table)];
  }
}
function parseTableExpression(table) {
  if (isString(table)) {
    return parseAliasedTable(table);
  } else if (isAliasedDynamicTableBuilder(table)) {
    return table.toOperationNode();
  } else {
    return parseAliasedExpression(table);
  }
}
function parseAliasedTable(from) {
  const ALIAS_SEPARATOR = " as ";
  if (from.includes(ALIAS_SEPARATOR)) {
    const [table, alias] = from.split(ALIAS_SEPARATOR).map(trim2);
    return AliasNode.create(parseTable(table), IdentifierNode.create(alias));
  } else {
    return parseTable(from);
  }
}
function parseTable(from) {
  const SCHEMA_SEPARATOR = ".";
  if (from.includes(SCHEMA_SEPARATOR)) {
    const [schema, table] = from.split(SCHEMA_SEPARATOR).map(trim2);
    return TableNode.createWithSchema(schema, table);
  } else {
    return TableNode.create(from);
  }
}
function trim2(str) {
  return str.trim();
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/add-column-node.js
var AddColumnNode = freeze({
  is(node) {
    return node.kind === "AddColumnNode";
  },
  create(column) {
    return freeze({
      kind: "AddColumnNode",
      column
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/column-definition-node.js
var ColumnDefinitionNode = freeze({
  is(node) {
    return node.kind === "ColumnDefinitionNode";
  },
  create(column, dataType) {
    return freeze({
      kind: "ColumnDefinitionNode",
      column: ColumnNode.create(column),
      dataType
    });
  },
  cloneWithFrontModifier(node, modifier) {
    return freeze({
      ...node,
      frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : [modifier]
    });
  },
  cloneWithEndModifier(node, modifier) {
    return freeze({
      ...node,
      endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : [modifier]
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/drop-column-node.js
var DropColumnNode = freeze({
  is(node) {
    return node.kind === "DropColumnNode";
  },
  create(column) {
    return freeze({
      kind: "DropColumnNode",
      column: ColumnNode.create(column)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/rename-column-node.js
var RenameColumnNode = freeze({
  is(node) {
    return node.kind === "RenameColumnNode";
  },
  create(column, newColumn) {
    return freeze({
      kind: "RenameColumnNode",
      column: ColumnNode.create(column),
      renameTo: ColumnNode.create(newColumn)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/check-constraint-node.js
var CheckConstraintNode = freeze({
  is(node) {
    return node.kind === "CheckConstraintNode";
  },
  create(expression, constraintName) {
    return freeze({
      kind: "CheckConstraintNode",
      expression,
      name: constraintName ? IdentifierNode.create(constraintName) : void 0
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/references-node.js
var ON_MODIFY_FOREIGN_ACTIONS = [
  "no action",
  "restrict",
  "cascade",
  "set null",
  "set default"
];
var ReferencesNode = freeze({
  is(node) {
    return node.kind === "ReferencesNode";
  },
  create(table, columns) {
    return freeze({
      kind: "ReferencesNode",
      table,
      columns: freeze([...columns])
    });
  },
  cloneWithOnDelete(references, onDelete) {
    return freeze({
      ...references,
      onDelete
    });
  },
  cloneWithOnUpdate(references, onUpdate) {
    return freeze({
      ...references,
      onUpdate
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/default-value-parser.js
function parseDefaultValueExpression(value) {
  return isOperationNodeSource(value) ? value.toOperationNode() : ValueNode.createImmediate(value);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/generated-node.js
var GeneratedNode = freeze({
  is(node) {
    return node.kind === "GeneratedNode";
  },
  create(params) {
    return freeze({
      kind: "GeneratedNode",
      ...params
    });
  },
  createWithExpression(expression) {
    return freeze({
      kind: "GeneratedNode",
      always: true,
      expression
    });
  },
  cloneWith(node, params) {
    return freeze({
      ...node,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/default-value-node.js
var DefaultValueNode = freeze({
  is(node) {
    return node.kind === "DefaultValueNode";
  },
  create(defaultValue) {
    return freeze({
      kind: "DefaultValueNode",
      defaultValue
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/on-modify-action-parser.js
function parseOnModifyForeignAction(action) {
  if (ON_MODIFY_FOREIGN_ACTIONS.includes(action)) {
    return action;
  }
  throw new Error(`invalid OnModifyForeignAction ${action}`);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/column-definition-builder.js
var _node6;
var _ColumnDefinitionBuilder = class _ColumnDefinitionBuilder {
  constructor(node) {
    __privateAdd(this, _node6);
    __privateSet(this, _node6, node);
  }
  /**
   * Adds `auto_increment` or `autoincrement` to the column definition
   * depending on the dialect.
   *
   * Some dialects like PostgreSQL don't support this. On PostgreSQL
   * you can use the `serial` or `bigserial` data type instead.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `id` integer primary key auto_increment
   * )
   * ```
   */
  autoIncrement() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { autoIncrement: true }));
  }
  /**
   * Makes the column an identity column.
   *
   * This only works on some dialects like MS SQL Server (MSSQL).
   *
   * For PostgreSQL's `generated always as identity` use {@link generatedAlwaysAsIdentity}.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.identity().primaryKey())
   *   .execute()
   * ```
   *
   * The generated SQL (MSSQL):
   *
   * ```sql
   * create table "person" (
   *   "id" integer identity primary key
   * )
   * ```
   */
  identity() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { identity: true }));
  }
  /**
   * Makes the column the primary key.
   *
   * If you want to specify a composite primary key use the
   * {@link CreateTableBuilder.addPrimaryKeyConstraint} method.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.primaryKey())
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `id` integer primary key
   * )
   */
  primaryKey() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { primaryKey: true }));
  }
  /**
   * Adds a foreign key constraint for the column.
   *
   * If your database engine doesn't support foreign key constraints in the
   * column definition (like MySQL 5) you need to call the table level
   * {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn('owner_id', 'integer', (col) => col.references('person.id'))
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create table "pet" (
   *   "owner_id" integer references "person" ("id")
   * )
   * ```
   */
  references(ref) {
    const references = parseStringReference(ref);
    if (!references.table || SelectAllNode.is(references.column)) {
      throw new Error(`invalid call references('${ref}'). The reference must have format table.column or schema.table.column`);
    }
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      references: ReferencesNode.create(references.table, [
        references.column
      ])
    }));
  }
  /**
   * Adds an `on delete` constraint for the foreign key column.
   *
   * If your database engine doesn't support foreign key constraints in the
   * column definition (like MySQL 5) you need to call the table level
   * {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn(
   *     'owner_id',
   *     'integer',
   *     (col) => col.references('person.id').onDelete('cascade')
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create table "pet" (
   *   "owner_id" integer references "person" ("id") on delete cascade
   * )
   * ```
   */
  onDelete(onDelete) {
    if (!__privateGet(this, _node6).references) {
      throw new Error("on delete constraint can only be added for foreign keys");
    }
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      references: ReferencesNode.cloneWithOnDelete(__privateGet(this, _node6).references, parseOnModifyForeignAction(onDelete))
    }));
  }
  /**
   * Adds an `on update` constraint for the foreign key column.
   *
   * If your database engine doesn't support foreign key constraints in the
   * column definition (like MySQL 5) you need to call the table level
   * {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn(
   *     'owner_id',
   *     'integer',
   *     (col) => col.references('person.id').onUpdate('cascade')
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create table "pet" (
   *   "owner_id" integer references "person" ("id") on update cascade
   * )
   * ```
   */
  onUpdate(onUpdate) {
    if (!__privateGet(this, _node6).references) {
      throw new Error("on update constraint can only be added for foreign keys");
    }
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      references: ReferencesNode.cloneWithOnUpdate(__privateGet(this, _node6).references, parseOnModifyForeignAction(onUpdate))
    }));
  }
  /**
   * Adds a unique constraint for the column.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('email', 'varchar(255)', col => col.unique())
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `email` varchar(255) unique
   * )
   * ```
   */
  unique() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { unique: true }));
  }
  /**
   * Adds a `not null` constraint for the column.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('first_name', 'varchar(255)', col => col.notNull())
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `first_name` varchar(255) not null
   * )
   * ```
   */
  notNull() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { notNull: true }));
  }
  /**
   * Adds a `unsigned` modifier for the column.
   *
   * This only works on some dialects like MySQL.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('age', 'integer', col => col.unsigned())
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `age` integer unsigned
   * )
   * ```
   */
  unsigned() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { unsigned: true }));
  }
  /**
   * Adds a default value constraint for the column.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn('number_of_legs', 'integer', (col) => col.defaultTo(4))
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `pet` (
   *   `number_of_legs` integer default 4
   * )
   * ```
   *
   * Values passed to `defaultTo` are interpreted as value literals by default. You can define
   * an arbitrary SQL expression using the {@link sql} template tag:
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('pet')
   *   .addColumn(
   *     'created_at',
   *     'timestamp',
   *     (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `pet` (
   *   `created_at` timestamp default CURRENT_TIMESTAMP
   * )
   * ```
   */
  defaultTo(value) {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      defaultTo: DefaultValueNode.create(parseDefaultValueExpression(value))
    }));
  }
  /**
   * Adds a check constraint for the column.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('pet')
   *   .addColumn('number_of_legs', 'integer', (col) =>
   *     col.check(sql`number_of_legs < 5`)
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `pet` (
   *   `number_of_legs` integer check (number_of_legs < 5)
   * )
   * ```
   */
  check(expression) {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      check: CheckConstraintNode.create(expression.toOperationNode())
    }));
  }
  /**
   * Makes the column a generated column using a `generated always as` statement.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('person')
   *   .addColumn('full_name', 'varchar(255)',
   *     (col) => col.generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name))
   * )
   * ```
   */
  generatedAlwaysAs(expression) {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      generated: GeneratedNode.createWithExpression(expression.toOperationNode())
    }));
  }
  /**
   * Adds the `generated always as identity` specifier.
   *
   * This only works on some dialects like PostgreSQL.
   *
   * For MS SQL Server (MSSQL)'s identity column use {@link identity}.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.generatedAlwaysAsIdentity().primaryKey())
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create table "person" (
   *   "id" integer generated always as identity primary key
   * )
   * ```
   */
  generatedAlwaysAsIdentity() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      generated: GeneratedNode.create({ identity: true, always: true })
    }));
  }
  /**
   * Adds the `generated by default as identity` specifier on supported dialects.
   *
   * This only works on some dialects like PostgreSQL.
   *
   * For MS SQL Server (MSSQL)'s identity column use {@link identity}.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.generatedByDefaultAsIdentity().primaryKey())
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create table "person" (
   *   "id" integer generated by default as identity primary key
   * )
   * ```
   */
  generatedByDefaultAsIdentity() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      generated: GeneratedNode.create({ identity: true, byDefault: true })
    }));
  }
  /**
   * Makes a generated column stored instead of virtual. This method can only
   * be used with {@link generatedAlwaysAs}
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('person')
   *   .addColumn('full_name', 'varchar(255)', (col) => col
   *     .generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
   *     .stored()
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name)) stored
   * )
   * ```
   */
  stored() {
    if (!__privateGet(this, _node6).generated) {
      throw new Error("stored() can only be called after generatedAlwaysAs");
    }
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), {
      generated: GeneratedNode.cloneWith(__privateGet(this, _node6).generated, {
        stored: true
      })
    }));
  }
  /**
   * This can be used to add any additional SQL right after the column's data type.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.primaryKey())
   *   .addColumn(
   *     'first_name',
   *     'varchar(36)',
   *     (col) => col.modifyFront(sql`collate utf8mb4_general_ci`).notNull()
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `id` integer primary key,
   *   `first_name` varchar(36) collate utf8mb4_general_ci not null
   * )
   * ```
   */
  modifyFront(modifier) {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithFrontModifier(__privateGet(this, _node6), modifier.toOperationNode()));
  }
  /**
   * Adds `nulls not distinct` specifier.
   * Should be used with `unique` constraint.
   *
   * This only works on some dialects like PostgreSQL.
   *
   * ### Examples
   *
   * ```ts
   * db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.primaryKey())
   *   .addColumn('first_name', 'varchar(30)', col => col.unique().nullsNotDistinct())
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create table "person" (
   *   "id" integer primary key,
   *   "first_name" varchar(30) unique nulls not distinct
   * )
   * ```
   */
  nullsNotDistinct() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { nullsNotDistinct: true }));
  }
  /**
   * Adds `if not exists` specifier. This only works for PostgreSQL.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .alterTable('person')
   *   .addColumn('email', 'varchar(255)', col => col.unique().ifNotExists())
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * alter table "person" add column if not exists "email" varchar(255) unique
   * ```
   */
  ifNotExists() {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(__privateGet(this, _node6), { ifNotExists: true }));
  }
  /**
   * This can be used to add any additional SQL to the end of the column definition.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.primaryKey())
   *   .addColumn(
   *     'age',
   *     'integer',
   *     col => col.unsigned()
   *       .notNull()
   *       .modifyEnd(sql`comment ${sql.lit('it is not polite to ask a woman her age')}`)
   *   )
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `id` integer primary key,
   *   `age` integer unsigned not null comment 'it is not polite to ask a woman her age'
   * )
   * ```
   */
  modifyEnd(modifier) {
    return new _ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithEndModifier(__privateGet(this, _node6), modifier.toOperationNode()));
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _node6);
  }
};
_node6 = new WeakMap();
var ColumnDefinitionBuilder = _ColumnDefinitionBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/modify-column-node.js
var ModifyColumnNode = freeze({
  is(node) {
    return node.kind === "ModifyColumnNode";
  },
  create(column) {
    return freeze({
      kind: "ModifyColumnNode",
      column
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/foreign-key-constraint-node.js
var ForeignKeyConstraintNode = freeze({
  is(node) {
    return node.kind === "ForeignKeyConstraintNode";
  },
  create(sourceColumns, targetTable, targetColumns, constraintName) {
    return freeze({
      kind: "ForeignKeyConstraintNode",
      columns: sourceColumns,
      references: ReferencesNode.create(targetTable, targetColumns),
      name: constraintName ? IdentifierNode.create(constraintName) : void 0
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/foreign-key-constraint-builder.js
var _node7;
var _ForeignKeyConstraintBuilder = class _ForeignKeyConstraintBuilder {
  constructor(node) {
    __privateAdd(this, _node7);
    __privateSet(this, _node7, node);
  }
  onDelete(onDelete) {
    return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(__privateGet(this, _node7), {
      onDelete: parseOnModifyForeignAction(onDelete)
    }));
  }
  onUpdate(onUpdate) {
    return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(__privateGet(this, _node7), {
      onUpdate: parseOnModifyForeignAction(onUpdate)
    }));
  }
  deferrable() {
    return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(__privateGet(this, _node7), { deferrable: true }));
  }
  notDeferrable() {
    return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(__privateGet(this, _node7), { deferrable: false }));
  }
  initiallyDeferred() {
    return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(__privateGet(this, _node7), {
      initiallyDeferred: true
    }));
  }
  initiallyImmediate() {
    return new _ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(__privateGet(this, _node7), {
      initiallyDeferred: false
    }));
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _node7);
  }
};
_node7 = new WeakMap();
var ForeignKeyConstraintBuilder = _ForeignKeyConstraintBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/add-constraint-node.js
var AddConstraintNode = freeze({
  is(node) {
    return node.kind === "AddConstraintNode";
  },
  create(constraint) {
    return freeze({
      kind: "AddConstraintNode",
      constraint
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/unique-constraint-node.js
var UniqueConstraintNode = freeze({
  is(node) {
    return node.kind === "UniqueConstraintNode";
  },
  create(columns, constraintName, nullsNotDistinct) {
    return freeze({
      kind: "UniqueConstraintNode",
      columns: freeze(columns.map(ColumnNode.create)),
      name: constraintName ? IdentifierNode.create(constraintName) : void 0,
      nullsNotDistinct
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/drop-constraint-node.js
var DropConstraintNode = freeze({
  is(node) {
    return node.kind === "DropConstraintNode";
  },
  create(constraintName) {
    return freeze({
      kind: "DropConstraintNode",
      constraintName: IdentifierNode.create(constraintName)
    });
  },
  cloneWith(dropConstraint, props) {
    return freeze({
      ...dropConstraint,
      ...props
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/alter-column-node.js
var AlterColumnNode = freeze({
  is(node) {
    return node.kind === "AlterColumnNode";
  },
  create(column, prop, value) {
    return freeze({
      kind: "AlterColumnNode",
      column: ColumnNode.create(column),
      [prop]: value
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/alter-column-builder.js
var _column;
var AlterColumnBuilder = class {
  constructor(column) {
    __privateAdd(this, _column);
    __privateSet(this, _column, column);
  }
  setDataType(dataType) {
    return new AlteredColumnBuilder(AlterColumnNode.create(__privateGet(this, _column), "dataType", parseDataTypeExpression(dataType)));
  }
  setDefault(value) {
    return new AlteredColumnBuilder(AlterColumnNode.create(__privateGet(this, _column), "setDefault", parseDefaultValueExpression(value)));
  }
  dropDefault() {
    return new AlteredColumnBuilder(AlterColumnNode.create(__privateGet(this, _column), "dropDefault", true));
  }
  setNotNull() {
    return new AlteredColumnBuilder(AlterColumnNode.create(__privateGet(this, _column), "setNotNull", true));
  }
  dropNotNull() {
    return new AlteredColumnBuilder(AlterColumnNode.create(__privateGet(this, _column), "dropNotNull", true));
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
};
_column = new WeakMap();
var _alterColumnNode;
var AlteredColumnBuilder = class {
  constructor(alterColumnNode) {
    __privateAdd(this, _alterColumnNode);
    __privateSet(this, _alterColumnNode, alterColumnNode);
  }
  toOperationNode() {
    return __privateGet(this, _alterColumnNode);
  }
};
_alterColumnNode = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/alter-table-executor.js
var _props22;
var AlterTableExecutor = class {
  constructor(props) {
    __privateAdd(this, _props22);
    __privateSet(this, _props22, freeze(props));
  }
  toOperationNode() {
    return __privateGet(this, _props22).executor.transformQuery(__privateGet(this, _props22).node, __privateGet(this, _props22).queryId);
  }
  compile() {
    return __privateGet(this, _props22).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props22).queryId);
  }
  async execute() {
    await __privateGet(this, _props22).executor.executeQuery(this.compile(), __privateGet(this, _props22).queryId);
  }
};
_props22 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/alter-table-add-foreign-key-constraint-builder.js
var _props23;
var _AlterTableAddForeignKeyConstraintBuilder = class _AlterTableAddForeignKeyConstraintBuilder {
  constructor(props) {
    __privateAdd(this, _props23);
    __privateSet(this, _props23, freeze(props));
  }
  onDelete(onDelete) {
    return new _AlterTableAddForeignKeyConstraintBuilder({
      ...__privateGet(this, _props23),
      constraintBuilder: __privateGet(this, _props23).constraintBuilder.onDelete(onDelete)
    });
  }
  onUpdate(onUpdate) {
    return new _AlterTableAddForeignKeyConstraintBuilder({
      ...__privateGet(this, _props23),
      constraintBuilder: __privateGet(this, _props23).constraintBuilder.onUpdate(onUpdate)
    });
  }
  deferrable() {
    return new _AlterTableAddForeignKeyConstraintBuilder({
      ...__privateGet(this, _props23),
      constraintBuilder: __privateGet(this, _props23).constraintBuilder.deferrable()
    });
  }
  notDeferrable() {
    return new _AlterTableAddForeignKeyConstraintBuilder({
      ...__privateGet(this, _props23),
      constraintBuilder: __privateGet(this, _props23).constraintBuilder.notDeferrable()
    });
  }
  initiallyDeferred() {
    return new _AlterTableAddForeignKeyConstraintBuilder({
      ...__privateGet(this, _props23),
      constraintBuilder: __privateGet(this, _props23).constraintBuilder.initiallyDeferred()
    });
  }
  initiallyImmediate() {
    return new _AlterTableAddForeignKeyConstraintBuilder({
      ...__privateGet(this, _props23),
      constraintBuilder: __privateGet(this, _props23).constraintBuilder.initiallyImmediate()
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props23).executor.transformQuery(AlterTableNode.cloneWithTableProps(__privateGet(this, _props23).node, {
      addConstraint: AddConstraintNode.create(__privateGet(this, _props23).constraintBuilder.toOperationNode())
    }), __privateGet(this, _props23).queryId);
  }
  compile() {
    return __privateGet(this, _props23).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props23).queryId);
  }
  async execute() {
    await __privateGet(this, _props23).executor.executeQuery(this.compile(), __privateGet(this, _props23).queryId);
  }
};
_props23 = new WeakMap();
var AlterTableAddForeignKeyConstraintBuilder = _AlterTableAddForeignKeyConstraintBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/alter-table-drop-constraint-builder.js
var _props24;
var _AlterTableDropConstraintBuilder = class _AlterTableDropConstraintBuilder {
  constructor(props) {
    __privateAdd(this, _props24);
    __privateSet(this, _props24, freeze(props));
  }
  ifExists() {
    return new _AlterTableDropConstraintBuilder({
      ...__privateGet(this, _props24),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props24).node, {
        dropConstraint: DropConstraintNode.cloneWith(__privateGet(this, _props24).node.dropConstraint, {
          ifExists: true
        })
      })
    });
  }
  cascade() {
    return new _AlterTableDropConstraintBuilder({
      ...__privateGet(this, _props24),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props24).node, {
        dropConstraint: DropConstraintNode.cloneWith(__privateGet(this, _props24).node.dropConstraint, {
          modifier: "cascade"
        })
      })
    });
  }
  restrict() {
    return new _AlterTableDropConstraintBuilder({
      ...__privateGet(this, _props24),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props24).node, {
        dropConstraint: DropConstraintNode.cloneWith(__privateGet(this, _props24).node.dropConstraint, {
          modifier: "restrict"
        })
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props24).executor.transformQuery(__privateGet(this, _props24).node, __privateGet(this, _props24).queryId);
  }
  compile() {
    return __privateGet(this, _props24).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props24).queryId);
  }
  async execute() {
    await __privateGet(this, _props24).executor.executeQuery(this.compile(), __privateGet(this, _props24).queryId);
  }
};
_props24 = new WeakMap();
var AlterTableDropConstraintBuilder = _AlterTableDropConstraintBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/primary-key-constraint-node.js
var PrimaryKeyConstraintNode = freeze({
  is(node) {
    return node.kind === "PrimaryKeyConstraintNode";
  },
  create(columns, constraintName) {
    return freeze({
      kind: "PrimaryKeyConstraintNode",
      columns: freeze(columns.map(ColumnNode.create)),
      name: constraintName ? IdentifierNode.create(constraintName) : void 0
    });
  },
  cloneWith(node, props) {
    return freeze({ ...node, ...props });
  }
});
var PrimaryConstraintNode = PrimaryKeyConstraintNode;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/add-index-node.js
var AddIndexNode = freeze({
  is(node) {
    return node.kind === "AddIndexNode";
  },
  create(name) {
    return freeze({
      kind: "AddIndexNode",
      name: IdentifierNode.create(name)
    });
  },
  cloneWith(node, props) {
    return freeze({
      ...node,
      ...props
    });
  },
  cloneWithColumns(node, columns) {
    return freeze({
      ...node,
      columns: [...node.columns || [], ...columns]
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/alter-table-add-index-builder.js
var _props25;
var _AlterTableAddIndexBuilder = class _AlterTableAddIndexBuilder {
  constructor(props) {
    __privateAdd(this, _props25);
    __privateSet(this, _props25, freeze(props));
  }
  /**
   * Makes the index unique.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .alterTable('person')
   *   .addIndex('person_first_name_index')
   *   .unique()
   *   .column('email')
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * alter table `person` add unique index `person_first_name_index` (`email`)
   * ```
   */
  unique() {
    return new _AlterTableAddIndexBuilder({
      ...__privateGet(this, _props25),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props25).node, {
        addIndex: AddIndexNode.cloneWith(__privateGet(this, _props25).node.addIndex, {
          unique: true
        })
      })
    });
  }
  /**
   * Adds a column to the index.
   *
   * Also see {@link columns} for adding multiple columns at once or {@link expression}
   * for specifying an arbitrary expression.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .alterTable('person')
   *   .addIndex('person_first_name_and_age_index')
   *   .column('first_name')
   *   .column('age desc')
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * alter table `person` add index `person_first_name_and_age_index` (`first_name`, `age` desc)
   * ```
   */
  column(column) {
    return new _AlterTableAddIndexBuilder({
      ...__privateGet(this, _props25),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props25).node, {
        addIndex: AddIndexNode.cloneWithColumns(__privateGet(this, _props25).node.addIndex, [
          parseOrderedColumnName(column)
        ])
      })
    });
  }
  /**
   * Specifies a list of columns for the index.
   *
   * Also see {@link column} for adding a single column or {@link expression} for
   * specifying an arbitrary expression.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .alterTable('person')
   *   .addIndex('person_first_name_and_age_index')
   *   .columns(['first_name', 'age desc'])
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * alter table `person` add index `person_first_name_and_age_index` (`first_name`, `age` desc)
   * ```
   */
  columns(columns) {
    return new _AlterTableAddIndexBuilder({
      ...__privateGet(this, _props25),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props25).node, {
        addIndex: AddIndexNode.cloneWithColumns(__privateGet(this, _props25).node.addIndex, columns.map(parseOrderedColumnName))
      })
    });
  }
  /**
   * Specifies an arbitrary expression for the index.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .alterTable('person')
   *   .addIndex('person_first_name_index')
   *   .expression(sql<boolean>`(first_name < 'Sami')`)
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * alter table `person` add index `person_first_name_index` ((first_name < 'Sami'))
   * ```
   */
  expression(expression) {
    return new _AlterTableAddIndexBuilder({
      ...__privateGet(this, _props25),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props25).node, {
        addIndex: AddIndexNode.cloneWithColumns(__privateGet(this, _props25).node.addIndex, [
          expression.toOperationNode()
        ])
      })
    });
  }
  using(indexType) {
    return new _AlterTableAddIndexBuilder({
      ...__privateGet(this, _props25),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props25).node, {
        addIndex: AddIndexNode.cloneWith(__privateGet(this, _props25).node.addIndex, {
          using: RawNode.createWithSql(indexType)
        })
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props25).executor.transformQuery(__privateGet(this, _props25).node, __privateGet(this, _props25).queryId);
  }
  compile() {
    return __privateGet(this, _props25).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props25).queryId);
  }
  async execute() {
    await __privateGet(this, _props25).executor.executeQuery(this.compile(), __privateGet(this, _props25).queryId);
  }
};
_props25 = new WeakMap();
var AlterTableAddIndexBuilder = _AlterTableAddIndexBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/unique-constraint-builder.js
var _node8;
var _UniqueConstraintNodeBuilder = class _UniqueConstraintNodeBuilder {
  constructor(node) {
    __privateAdd(this, _node8);
    __privateSet(this, _node8, node);
  }
  /**
   * Adds `nulls not distinct` to the unique constraint definition
   *
   * Supported by PostgreSQL dialect only
   */
  nullsNotDistinct() {
    return new _UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(__privateGet(this, _node8), { nullsNotDistinct: true }));
  }
  deferrable() {
    return new _UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(__privateGet(this, _node8), { deferrable: true }));
  }
  notDeferrable() {
    return new _UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(__privateGet(this, _node8), { deferrable: false }));
  }
  initiallyDeferred() {
    return new _UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(__privateGet(this, _node8), {
      initiallyDeferred: true
    }));
  }
  initiallyImmediate() {
    return new _UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(__privateGet(this, _node8), {
      initiallyDeferred: false
    }));
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _node8);
  }
};
_node8 = new WeakMap();
var UniqueConstraintNodeBuilder = _UniqueConstraintNodeBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/primary-key-constraint-builder.js
var _node9;
var _PrimaryKeyConstraintBuilder = class _PrimaryKeyConstraintBuilder {
  constructor(node) {
    __privateAdd(this, _node9);
    __privateSet(this, _node9, node);
  }
  deferrable() {
    return new _PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(__privateGet(this, _node9), { deferrable: true }));
  }
  notDeferrable() {
    return new _PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(__privateGet(this, _node9), { deferrable: false }));
  }
  initiallyDeferred() {
    return new _PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(__privateGet(this, _node9), {
      initiallyDeferred: true
    }));
  }
  initiallyImmediate() {
    return new _PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(__privateGet(this, _node9), {
      initiallyDeferred: false
    }));
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _node9);
  }
};
_node9 = new WeakMap();
var PrimaryKeyConstraintBuilder = _PrimaryKeyConstraintBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/check-constraint-builder.js
var _node10;
var CheckConstraintBuilder = class {
  constructor(node) {
    __privateAdd(this, _node10);
    __privateSet(this, _node10, node);
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _node10);
  }
};
_node10 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/rename-constraint-node.js
var RenameConstraintNode = freeze({
  is(node) {
    return node.kind === "RenameConstraintNode";
  },
  create(oldName, newName) {
    return freeze({
      kind: "RenameConstraintNode",
      oldName: IdentifierNode.create(oldName),
      newName: IdentifierNode.create(newName)
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/alter-table-builder.js
var _props26;
var AlterTableBuilder = class {
  constructor(props) {
    __privateAdd(this, _props26);
    __privateSet(this, _props26, freeze(props));
  }
  renameTo(newTableName) {
    return new AlterTableExecutor({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        renameTo: parseTable(newTableName)
      })
    });
  }
  setSchema(newSchema) {
    return new AlterTableExecutor({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        setSchema: IdentifierNode.create(newSchema)
      })
    });
  }
  alterColumn(column, alteration) {
    const builder = alteration(new AlterColumnBuilder(column));
    return new AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props26).node, builder.toOperationNode())
    });
  }
  dropColumn(column) {
    return new AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props26).node, DropColumnNode.create(column))
    });
  }
  renameColumn(column, newColumn) {
    return new AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props26).node, RenameColumnNode.create(column, newColumn))
    });
  }
  addColumn(columnName, dataType, build = noop) {
    const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
    return new AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props26).node, AddColumnNode.create(builder.toOperationNode()))
    });
  }
  modifyColumn(columnName, dataType, build = noop) {
    const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
    return new AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props26).node, ModifyColumnNode.create(builder.toOperationNode()))
    });
  }
  /**
   * See {@link CreateTableBuilder.addUniqueConstraint}
   */
  addUniqueConstraint(constraintName, columns, build = noop) {
    const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns, constraintName)));
    return new AlterTableExecutor({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        addConstraint: AddConstraintNode.create(uniqueConstraintBuilder.toOperationNode())
      })
    });
  }
  /**
   * See {@link CreateTableBuilder.addCheckConstraint}
   */
  addCheckConstraint(constraintName, checkExpression, build = noop) {
    const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
    return new AlterTableExecutor({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode())
      })
    });
  }
  /**
   * See {@link CreateTableBuilder.addForeignKeyConstraint}
   *
   * Unlike {@link CreateTableBuilder.addForeignKeyConstraint} this method returns
   * the constraint builder and doesn't take a callback as the last argument. This
   * is because you can only add one column per `ALTER TABLE` query.
   */
  addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
    const constraintBuilder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
    return new AlterTableAddForeignKeyConstraintBuilder({
      ...__privateGet(this, _props26),
      constraintBuilder
    });
  }
  /**
   * See {@link CreateTableBuilder.addPrimaryKeyConstraint}
   */
  addPrimaryKeyConstraint(constraintName, columns, build = noop) {
    const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
    return new AlterTableExecutor({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode())
      })
    });
  }
  dropConstraint(constraintName) {
    return new AlterTableDropConstraintBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        dropConstraint: DropConstraintNode.create(constraintName)
      })
    });
  }
  renameConstraint(oldName, newName) {
    return new AlterTableDropConstraintBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        renameConstraint: RenameConstraintNode.create(oldName, newName)
      })
    });
  }
  /**
   * This can be used to add index to table.
   *
   *  ### Examples
   *
   * ```ts
   * db.schema.alterTable('person')
   *   .addIndex('person_email_index')
   *   .column('email')
   *   .unique()
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * alter table `person` add unique index `person_email_index` (`email`)
   * ```
   */
  addIndex(indexName) {
    return new AlterTableAddIndexBuilder({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        addIndex: AddIndexNode.create(indexName)
      })
    });
  }
  /**
   * This can be used to drop index from table.
   *
   * ### Examples
   *
   * ```ts
   * db.schema.alterTable('person')
   *   .dropIndex('person_email_index')
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * alter table `person` drop index `test_first_name_index`
   * ```
   */
  dropIndex(indexName) {
    return new AlterTableExecutor({
      ...__privateGet(this, _props26),
      node: AlterTableNode.cloneWithTableProps(__privateGet(this, _props26).node, {
        dropIndex: DropIndexNode.create(indexName)
      })
    });
  }
  /**
   * Calls the given function passing `this` as the only argument.
   *
   * See {@link CreateTableBuilder.$call}
   */
  $call(func) {
    return func(this);
  }
};
_props26 = new WeakMap();
var _props27;
var _AlterTableColumnAlteringBuilder = class _AlterTableColumnAlteringBuilder {
  constructor(props) {
    __privateAdd(this, _props27);
    __privateSet(this, _props27, freeze(props));
  }
  alterColumn(column, alteration) {
    const builder = alteration(new AlterColumnBuilder(column));
    return new _AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props27),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props27).node, builder.toOperationNode())
    });
  }
  dropColumn(column) {
    return new _AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props27),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props27).node, DropColumnNode.create(column))
    });
  }
  renameColumn(column, newColumn) {
    return new _AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props27),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props27).node, RenameColumnNode.create(column, newColumn))
    });
  }
  addColumn(columnName, dataType, build = noop) {
    const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
    return new _AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props27),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props27).node, AddColumnNode.create(builder.toOperationNode()))
    });
  }
  modifyColumn(columnName, dataType, build = noop) {
    const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
    return new _AlterTableColumnAlteringBuilder({
      ...__privateGet(this, _props27),
      node: AlterTableNode.cloneWithColumnAlteration(__privateGet(this, _props27).node, ModifyColumnNode.create(builder.toOperationNode()))
    });
  }
  toOperationNode() {
    return __privateGet(this, _props27).executor.transformQuery(__privateGet(this, _props27).node, __privateGet(this, _props27).queryId);
  }
  compile() {
    return __privateGet(this, _props27).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props27).queryId);
  }
  async execute() {
    await __privateGet(this, _props27).executor.executeQuery(this.compile(), __privateGet(this, _props27).queryId);
  }
};
_props27 = new WeakMap();
var AlterTableColumnAlteringBuilder = _AlterTableColumnAlteringBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/immediate-value/immediate-value-transformer.js
var ImmediateValueTransformer = class extends OperationNodeTransformer {
  transformPrimitiveValueList(node) {
    return ValueListNode.create(node.values.map(ValueNode.createImmediate));
  }
  transformValue(node) {
    return ValueNode.createImmediate(node.value);
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/create-index-builder.js
var _props28;
var _CreateIndexBuilder = class _CreateIndexBuilder {
  constructor(props) {
    __privateAdd(this, _props28);
    __privateSet(this, _props28, freeze(props));
  }
  /**
   * Adds the "if not exists" modifier.
   *
   * If the index already exists, no error is thrown if this method has been called.
   */
  ifNotExists() {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWith(__privateGet(this, _props28).node, {
        ifNotExists: true
      })
    });
  }
  /**
   * Makes the index unique.
   */
  unique() {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWith(__privateGet(this, _props28).node, {
        unique: true
      })
    });
  }
  /**
   * Adds `nulls not distinct` specifier to index.
   * This only works on some dialects like PostgreSQL.
   *
   * ### Examples
   *
   * ```ts
   * db.schema.createIndex('person_first_name_index')
   *  .on('person')
   *  .column('first_name')
   *  .nullsNotDistinct()
   *  .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create index "person_first_name_index"
   * on "test" ("first_name")
   * nulls not distinct;
   * ```
   */
  nullsNotDistinct() {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWith(__privateGet(this, _props28).node, {
        nullsNotDistinct: true
      })
    });
  }
  /**
   * Specifies the table for the index.
   */
  on(table) {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWith(__privateGet(this, _props28).node, {
        table: parseTable(table)
      })
    });
  }
  /**
   * Adds a column to the index.
   *
   * Also see {@link columns} for adding multiple columns at once or {@link expression}
   * for specifying an arbitrary expression.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *         .createIndex('person_first_name_and_age_index')
   *         .on('person')
   *         .column('first_name')
   *         .column('age desc')
   *         .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create index "person_first_name_and_age_index" on "person" ("first_name", "age" desc)
   * ```
   */
  column(column) {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWithColumns(__privateGet(this, _props28).node, [
        parseOrderedColumnName(column)
      ])
    });
  }
  /**
   * Specifies a list of columns for the index.
   *
   * Also see {@link column} for adding a single column or {@link expression} for
   * specifying an arbitrary expression.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *         .createIndex('person_first_name_and_age_index')
   *         .on('person')
   *         .columns(['first_name', 'age desc'])
   *         .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create index "person_first_name_and_age_index" on "person" ("first_name", "age" desc)
   * ```
   */
  columns(columns) {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWithColumns(__privateGet(this, _props28).node, columns.map(parseOrderedColumnName))
    });
  }
  /**
   * Specifies an arbitrary expression for the index.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createIndex('person_first_name_index')
   *   .on('person')
   *   .expression(sql`first_name COLLATE "fi_FI"`)
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create index "person_first_name_index" on "person" (first_name COLLATE "fi_FI")
   * ```
   */
  expression(expression) {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWithColumns(__privateGet(this, _props28).node, [
        expression.toOperationNode()
      ])
    });
  }
  using(indexType) {
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: CreateIndexNode.cloneWith(__privateGet(this, _props28).node, {
        using: RawNode.createWithSql(indexType)
      })
    });
  }
  where(...args) {
    const transformer = new ImmediateValueTransformer();
    return new _CreateIndexBuilder({
      ...__privateGet(this, _props28),
      node: QueryNode.cloneWithWhere(__privateGet(this, _props28).node, transformer.transformNode(parseValueBinaryOperationOrExpression(args), __privateGet(this, _props28).queryId))
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props28).executor.transformQuery(__privateGet(this, _props28).node, __privateGet(this, _props28).queryId);
  }
  compile() {
    return __privateGet(this, _props28).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props28).queryId);
  }
  async execute() {
    await __privateGet(this, _props28).executor.executeQuery(this.compile(), __privateGet(this, _props28).queryId);
  }
};
_props28 = new WeakMap();
var CreateIndexBuilder = _CreateIndexBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/create-schema-builder.js
var _props29;
var _CreateSchemaBuilder = class _CreateSchemaBuilder {
  constructor(props) {
    __privateAdd(this, _props29);
    __privateSet(this, _props29, freeze(props));
  }
  ifNotExists() {
    return new _CreateSchemaBuilder({
      ...__privateGet(this, _props29),
      node: CreateSchemaNode.cloneWith(__privateGet(this, _props29).node, { ifNotExists: true })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props29).executor.transformQuery(__privateGet(this, _props29).node, __privateGet(this, _props29).queryId);
  }
  compile() {
    return __privateGet(this, _props29).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props29).queryId);
  }
  async execute() {
    await __privateGet(this, _props29).executor.executeQuery(this.compile(), __privateGet(this, _props29).queryId);
  }
};
_props29 = new WeakMap();
var CreateSchemaBuilder = _CreateSchemaBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/on-commit-action-parse.js
function parseOnCommitAction(action) {
  if (ON_COMMIT_ACTIONS.includes(action)) {
    return action;
  }
  throw new Error(`invalid OnCommitAction ${action}`);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/create-table-builder.js
var _props30;
var _CreateTableBuilder = class _CreateTableBuilder {
  constructor(props) {
    __privateAdd(this, _props30);
    __privateSet(this, _props30, freeze(props));
  }
  /**
   * Adds the "temporary" modifier.
   *
   * Use this to create a temporary table.
   */
  temporary() {
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWith(__privateGet(this, _props30).node, {
        temporary: true
      })
    });
  }
  /**
   * Adds an "on commit" statement.
   *
   * This can be used in conjunction with temporary tables on supported databases
   * like PostgreSQL.
   */
  onCommit(onCommit) {
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWith(__privateGet(this, _props30).node, {
        onCommit: parseOnCommitAction(onCommit)
      })
    });
  }
  /**
   * Adds the "if not exists" modifier.
   *
   * If the table already exists, no error is thrown if this method has been called.
   */
  ifNotExists() {
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWith(__privateGet(this, _props30).node, {
        ifNotExists: true
      })
    });
  }
  /**
   * Adds a column to the table.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
   *   .addColumn('first_name', 'varchar(50)', (col) => col.notNull())
   *   .addColumn('last_name', 'varchar(255)')
   *   .addColumn('bank_balance', 'numeric(8, 2)')
   *   // You can specify any data type using the `sql` tag if the types
   *   // don't include it.
   *   .addColumn('data', sql`any_type_here`)
   *   .addColumn('parent_id', 'integer', (col) =>
   *     col.references('person.id').onDelete('cascade')
   *   )
   * ```
   *
   * With this method, it's once again good to remember that Kysely just builds the
   * query and doesn't provide the same API for all databases. For example, some
   * databases like older MySQL don't support the `references` statement in the
   * column definition. Instead foreign key constraints need to be defined in the
   * `create table` query. See the next example:
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', (col) => col.primaryKey())
   *   .addColumn('parent_id', 'integer')
   *   .addForeignKeyConstraint(
   *     'person_parent_id_fk',
   *     ['parent_id'],
   *     'person',
   *     ['id'],
   *     (cb) => cb.onDelete('cascade')
   *   )
   *   .execute()
   * ```
   *
   * Another good example is that PostgreSQL doesn't support the `auto_increment`
   * keyword and you need to define an autoincrementing column for example using
   * `serial`:
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'serial', (col) => col.primaryKey())
   *   .execute()
   * ```
   */
  addColumn(columnName, dataType, build = noop) {
    const columnBuilder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWithColumn(__privateGet(this, _props30).node, columnBuilder.toOperationNode())
    });
  }
  /**
   * Adds a primary key constraint for one or more columns.
   *
   * The constraint name can be anything you want, but it must be unique
   * across the whole database.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('first_name', 'varchar(64)')
   *   .addColumn('last_name', 'varchar(64)')
   *   .addPrimaryKeyConstraint('primary_key', ['first_name', 'last_name'])
   *   .execute()
   * ```
   */
  addPrimaryKeyConstraint(constraintName, columns, build = noop) {
    const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWithConstraint(__privateGet(this, _props30).node, constraintBuilder.toOperationNode())
    });
  }
  /**
   * Adds a unique constraint for one or more columns.
   *
   * The constraint name can be anything you want, but it must be unique
   * across the whole database.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('first_name', 'varchar(64)')
   *   .addColumn('last_name', 'varchar(64)')
   *   .addUniqueConstraint(
   *     'first_name_last_name_unique',
   *     ['first_name', 'last_name']
   *   )
   *   .execute()
   * ```
   *
   * In dialects such as PostgreSQL you can specify `nulls not distinct` as follows:
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('first_name', 'varchar(64)')
   *   .addColumn('last_name', 'varchar(64)')
   *   .addUniqueConstraint(
   *     'first_name_last_name_unique',
   *     ['first_name', 'last_name'],
   *     (cb) => cb.nullsNotDistinct()
   *   )
   *   .execute()
   * ```
   */
  addUniqueConstraint(constraintName, columns, build = noop) {
    const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns, constraintName)));
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWithConstraint(__privateGet(this, _props30).node, uniqueConstraintBuilder.toOperationNode())
    });
  }
  /**
   * Adds a check constraint.
   *
   * The constraint name can be anything you want, but it must be unique
   * across the whole database.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('animal')
   *   .addColumn('number_of_legs', 'integer')
   *   .addCheckConstraint('check_legs', sql`number_of_legs < 5`)
   *   .execute()
   * ```
   */
  addCheckConstraint(constraintName, checkExpression, build = noop) {
    const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWithConstraint(__privateGet(this, _props30).node, constraintBuilder.toOperationNode())
    });
  }
  /**
   * Adds a foreign key constraint.
   *
   * The constraint name can be anything you want, but it must be unique
   * across the whole database.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn('owner_id', 'integer')
   *   .addForeignKeyConstraint(
   *     'owner_id_foreign',
   *     ['owner_id'],
   *     'person',
   *     ['id'],
   *   )
   *   .execute()
   * ```
   *
   * Add constraint for multiple columns:
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn('owner_id1', 'integer')
   *   .addColumn('owner_id2', 'integer')
   *   .addForeignKeyConstraint(
   *     'owner_id_foreign',
   *     ['owner_id1', 'owner_id2'],
   *     'person',
   *     ['id1', 'id2'],
   *     (cb) => cb.onDelete('cascade')
   *   )
   *   .execute()
   * ```
   */
  addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
    const builder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWithConstraint(__privateGet(this, _props30).node, builder.toOperationNode())
    });
  }
  /**
   * This can be used to add any additional SQL to the front of the query __after__ the `create` keyword.
   *
   * Also see {@link temporary}.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('person')
   *   .modifyFront(sql`global temporary`)
   *   .addColumn('id', 'integer', col => col.primaryKey())
   *   .addColumn('first_name', 'varchar(64)', col => col.notNull())
   *   .addColumn('last_name', 'varchar(64)', col => col.notNull())
   *   .execute()
   * ```
   *
   * The generated SQL (Postgres):
   *
   * ```sql
   * create global temporary table "person" (
   *   "id" integer primary key,
   *   "first_name" varchar(64) not null,
   *   "last_name" varchar(64) not null
   * )
   * ```
   */
  modifyFront(modifier) {
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWithFrontModifier(__privateGet(this, _props30).node, modifier.toOperationNode())
    });
  }
  /**
   * This can be used to add any additional SQL to the end of the query.
   *
   * Also see {@link onCommit}.
   *
   * ### Examples
   *
   * ```ts
   * import { sql } from 'kysely'
   *
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.primaryKey())
   *   .addColumn('first_name', 'varchar(64)', col => col.notNull())
   *   .addColumn('last_name', 'varchar(64)', col => col.notNull())
   *   .modifyEnd(sql`collate utf8_unicode_ci`)
   *   .execute()
   * ```
   *
   * The generated SQL (MySQL):
   *
   * ```sql
   * create table `person` (
   *   `id` integer primary key,
   *   `first_name` varchar(64) not null,
   *   `last_name` varchar(64) not null
   * ) collate utf8_unicode_ci
   * ```
   */
  modifyEnd(modifier) {
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWithEndModifier(__privateGet(this, _props30).node, modifier.toOperationNode())
    });
  }
  /**
   * Allows to create table from `select` query.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('copy')
   *   .temporary()
   *   .as(db.selectFrom('person').select(['first_name', 'last_name']))
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * create temporary table "copy" as
   * select "first_name", "last_name" from "person"
   * ```
   */
  as(expression) {
    return new _CreateTableBuilder({
      ...__privateGet(this, _props30),
      node: CreateTableNode.cloneWith(__privateGet(this, _props30).node, {
        selectQuery: parseExpression(expression)
      })
    });
  }
  /**
   * Calls the given function passing `this` as the only argument.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createTable('test')
   *   .$call((builder) => builder.addColumn('id', 'integer'))
   *   .execute()
   * ```
   *
   * This is useful for creating reusable functions that can be called with a builder.
   *
   * ```ts
   * import { type CreateTableBuilder, sql } from 'kysely'
   *
   * const addDefaultColumns = (ctb: CreateTableBuilder<any, any>) => {
   *   return ctb
   *     .addColumn('id', 'integer', (col) => col.notNull())
   *     .addColumn('created_at', 'date', (col) =>
   *       col.notNull().defaultTo(sql`now()`)
   *     )
   *     .addColumn('updated_at', 'date', (col) =>
   *       col.notNull().defaultTo(sql`now()`)
   *     )
   * }
   *
   * await db.schema
   *   .createTable('test')
   *   .$call(addDefaultColumns)
   *   .execute()
   * ```
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props30).executor.transformQuery(__privateGet(this, _props30).node, __privateGet(this, _props30).queryId);
  }
  compile() {
    return __privateGet(this, _props30).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props30).queryId);
  }
  async execute() {
    await __privateGet(this, _props30).executor.executeQuery(this.compile(), __privateGet(this, _props30).queryId);
  }
};
_props30 = new WeakMap();
var CreateTableBuilder = _CreateTableBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/drop-index-builder.js
var _props31;
var _DropIndexBuilder = class _DropIndexBuilder {
  constructor(props) {
    __privateAdd(this, _props31);
    __privateSet(this, _props31, freeze(props));
  }
  /**
   * Specifies the table the index was created for. This is not needed
   * in all dialects.
   */
  on(table) {
    return new _DropIndexBuilder({
      ...__privateGet(this, _props31),
      node: DropIndexNode.cloneWith(__privateGet(this, _props31).node, {
        table: parseTable(table)
      })
    });
  }
  ifExists() {
    return new _DropIndexBuilder({
      ...__privateGet(this, _props31),
      node: DropIndexNode.cloneWith(__privateGet(this, _props31).node, {
        ifExists: true
      })
    });
  }
  cascade() {
    return new _DropIndexBuilder({
      ...__privateGet(this, _props31),
      node: DropIndexNode.cloneWith(__privateGet(this, _props31).node, {
        cascade: true
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props31).executor.transformQuery(__privateGet(this, _props31).node, __privateGet(this, _props31).queryId);
  }
  compile() {
    return __privateGet(this, _props31).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props31).queryId);
  }
  async execute() {
    await __privateGet(this, _props31).executor.executeQuery(this.compile(), __privateGet(this, _props31).queryId);
  }
};
_props31 = new WeakMap();
var DropIndexBuilder = _DropIndexBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/drop-schema-builder.js
var _props32;
var _DropSchemaBuilder = class _DropSchemaBuilder {
  constructor(props) {
    __privateAdd(this, _props32);
    __privateSet(this, _props32, freeze(props));
  }
  ifExists() {
    return new _DropSchemaBuilder({
      ...__privateGet(this, _props32),
      node: DropSchemaNode.cloneWith(__privateGet(this, _props32).node, {
        ifExists: true
      })
    });
  }
  cascade() {
    return new _DropSchemaBuilder({
      ...__privateGet(this, _props32),
      node: DropSchemaNode.cloneWith(__privateGet(this, _props32).node, {
        cascade: true
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props32).executor.transformQuery(__privateGet(this, _props32).node, __privateGet(this, _props32).queryId);
  }
  compile() {
    return __privateGet(this, _props32).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props32).queryId);
  }
  async execute() {
    await __privateGet(this, _props32).executor.executeQuery(this.compile(), __privateGet(this, _props32).queryId);
  }
};
_props32 = new WeakMap();
var DropSchemaBuilder = _DropSchemaBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/drop-table-builder.js
var _props33;
var _DropTableBuilder = class _DropTableBuilder {
  constructor(props) {
    __privateAdd(this, _props33);
    __privateSet(this, _props33, freeze(props));
  }
  ifExists() {
    return new _DropTableBuilder({
      ...__privateGet(this, _props33),
      node: DropTableNode.cloneWith(__privateGet(this, _props33).node, {
        ifExists: true
      })
    });
  }
  cascade() {
    return new _DropTableBuilder({
      ...__privateGet(this, _props33),
      node: DropTableNode.cloneWith(__privateGet(this, _props33).node, {
        cascade: true
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props33).executor.transformQuery(__privateGet(this, _props33).node, __privateGet(this, _props33).queryId);
  }
  compile() {
    return __privateGet(this, _props33).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props33).queryId);
  }
  async execute() {
    await __privateGet(this, _props33).executor.executeQuery(this.compile(), __privateGet(this, _props33).queryId);
  }
};
_props33 = new WeakMap();
var DropTableBuilder = _DropTableBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/create-view-node.js
var CreateViewNode = freeze({
  is(node) {
    return node.kind === "CreateViewNode";
  },
  create(name) {
    return freeze({
      kind: "CreateViewNode",
      name: SchemableIdentifierNode.create(name)
    });
  },
  cloneWith(createView, params) {
    return freeze({
      ...createView,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/immediate-value/immediate-value-plugin.js
var _transformer2;
var ImmediateValuePlugin = class {
  constructor() {
    __privateAdd(this, _transformer2, new ImmediateValueTransformer());
  }
  transformQuery(args) {
    return __privateGet(this, _transformer2).transformNode(args.node, args.queryId);
  }
  transformResult(args) {
    return Promise.resolve(args.result);
  }
};
_transformer2 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/create-view-builder.js
var _props34;
var _CreateViewBuilder = class _CreateViewBuilder {
  constructor(props) {
    __privateAdd(this, _props34);
    __privateSet(this, _props34, freeze(props));
  }
  /**
   * Adds the "temporary" modifier.
   *
   * Use this to create a temporary view.
   */
  temporary() {
    return new _CreateViewBuilder({
      ...__privateGet(this, _props34),
      node: CreateViewNode.cloneWith(__privateGet(this, _props34).node, {
        temporary: true
      })
    });
  }
  materialized() {
    return new _CreateViewBuilder({
      ...__privateGet(this, _props34),
      node: CreateViewNode.cloneWith(__privateGet(this, _props34).node, {
        materialized: true
      })
    });
  }
  /**
   * Only implemented on some dialects like SQLite. On most dialects, use {@link orReplace}.
   */
  ifNotExists() {
    return new _CreateViewBuilder({
      ...__privateGet(this, _props34),
      node: CreateViewNode.cloneWith(__privateGet(this, _props34).node, {
        ifNotExists: true
      })
    });
  }
  orReplace() {
    return new _CreateViewBuilder({
      ...__privateGet(this, _props34),
      node: CreateViewNode.cloneWith(__privateGet(this, _props34).node, {
        orReplace: true
      })
    });
  }
  columns(columns) {
    return new _CreateViewBuilder({
      ...__privateGet(this, _props34),
      node: CreateViewNode.cloneWith(__privateGet(this, _props34).node, {
        columns: columns.map(parseColumnName)
      })
    });
  }
  /**
   * Sets the select query or a `values` statement that creates the view.
   *
   * WARNING!
   * Some dialects don't support parameterized queries in DDL statements and therefore
   * the query or raw {@link sql } expression passed here is interpolated into a single
   * string opening an SQL injection vulnerability. DO NOT pass unchecked user input
   * into the query or raw expression passed to this method!
   */
  as(query) {
    const queryNode = query.withPlugin(new ImmediateValuePlugin()).toOperationNode();
    return new _CreateViewBuilder({
      ...__privateGet(this, _props34),
      node: CreateViewNode.cloneWith(__privateGet(this, _props34).node, {
        as: queryNode
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props34).executor.transformQuery(__privateGet(this, _props34).node, __privateGet(this, _props34).queryId);
  }
  compile() {
    return __privateGet(this, _props34).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props34).queryId);
  }
  async execute() {
    await __privateGet(this, _props34).executor.executeQuery(this.compile(), __privateGet(this, _props34).queryId);
  }
};
_props34 = new WeakMap();
var CreateViewBuilder = _CreateViewBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/drop-view-node.js
var DropViewNode = freeze({
  is(node) {
    return node.kind === "DropViewNode";
  },
  create(name) {
    return freeze({
      kind: "DropViewNode",
      name: SchemableIdentifierNode.create(name)
    });
  },
  cloneWith(dropView, params) {
    return freeze({
      ...dropView,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/drop-view-builder.js
var _props35;
var _DropViewBuilder = class _DropViewBuilder {
  constructor(props) {
    __privateAdd(this, _props35);
    __privateSet(this, _props35, freeze(props));
  }
  materialized() {
    return new _DropViewBuilder({
      ...__privateGet(this, _props35),
      node: DropViewNode.cloneWith(__privateGet(this, _props35).node, {
        materialized: true
      })
    });
  }
  ifExists() {
    return new _DropViewBuilder({
      ...__privateGet(this, _props35),
      node: DropViewNode.cloneWith(__privateGet(this, _props35).node, {
        ifExists: true
      })
    });
  }
  cascade() {
    return new _DropViewBuilder({
      ...__privateGet(this, _props35),
      node: DropViewNode.cloneWith(__privateGet(this, _props35).node, {
        cascade: true
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props35).executor.transformQuery(__privateGet(this, _props35).node, __privateGet(this, _props35).queryId);
  }
  compile() {
    return __privateGet(this, _props35).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props35).queryId);
  }
  async execute() {
    await __privateGet(this, _props35).executor.executeQuery(this.compile(), __privateGet(this, _props35).queryId);
  }
};
_props35 = new WeakMap();
var DropViewBuilder = _DropViewBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/create-type-node.js
var CreateTypeNode = freeze({
  is(node) {
    return node.kind === "CreateTypeNode";
  },
  create(name) {
    return freeze({
      kind: "CreateTypeNode",
      name
    });
  },
  cloneWithEnum(createType, values) {
    return freeze({
      ...createType,
      enum: ValueListNode.create(values.map(ValueNode.createImmediate))
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/create-type-builder.js
var _props36;
var _CreateTypeBuilder = class _CreateTypeBuilder {
  constructor(props) {
    __privateAdd(this, _props36);
    __privateSet(this, _props36, freeze(props));
  }
  toOperationNode() {
    return __privateGet(this, _props36).executor.transformQuery(__privateGet(this, _props36).node, __privateGet(this, _props36).queryId);
  }
  /**
   * Creates an anum type.
   *
   * ### Examples
   *
   * ```ts
   * db.schema.createType('species').asEnum(['cat', 'dog', 'frog'])
   * ```
   */
  asEnum(values) {
    return new _CreateTypeBuilder({
      ...__privateGet(this, _props36),
      node: CreateTypeNode.cloneWithEnum(__privateGet(this, _props36).node, values)
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  compile() {
    return __privateGet(this, _props36).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props36).queryId);
  }
  async execute() {
    await __privateGet(this, _props36).executor.executeQuery(this.compile(), __privateGet(this, _props36).queryId);
  }
};
_props36 = new WeakMap();
var CreateTypeBuilder = _CreateTypeBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/drop-type-node.js
var DropTypeNode = freeze({
  is(node) {
    return node.kind === "DropTypeNode";
  },
  create(name) {
    return freeze({
      kind: "DropTypeNode",
      name
    });
  },
  cloneWith(dropType, params) {
    return freeze({
      ...dropType,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/drop-type-builder.js
var _props37;
var _DropTypeBuilder = class _DropTypeBuilder {
  constructor(props) {
    __privateAdd(this, _props37);
    __privateSet(this, _props37, freeze(props));
  }
  ifExists() {
    return new _DropTypeBuilder({
      ...__privateGet(this, _props37),
      node: DropTypeNode.cloneWith(__privateGet(this, _props37).node, {
        ifExists: true
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props37).executor.transformQuery(__privateGet(this, _props37).node, __privateGet(this, _props37).queryId);
  }
  compile() {
    return __privateGet(this, _props37).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props37).queryId);
  }
  async execute() {
    await __privateGet(this, _props37).executor.executeQuery(this.compile(), __privateGet(this, _props37).queryId);
  }
};
_props37 = new WeakMap();
var DropTypeBuilder = _DropTypeBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/identifier-parser.js
function parseSchemableIdentifier(id) {
  const SCHEMA_SEPARATOR = ".";
  if (id.includes(SCHEMA_SEPARATOR)) {
    const parts = id.split(SCHEMA_SEPARATOR).map(trim3);
    if (parts.length === 2) {
      return SchemableIdentifierNode.createWithSchema(parts[0], parts[1]);
    } else {
      throw new Error(`invalid schemable identifier ${id}`);
    }
  } else {
    return SchemableIdentifierNode.create(id);
  }
}
function trim3(str) {
  return str.trim();
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/refresh-materialized-view-node.js
var RefreshMaterializedViewNode = freeze({
  is(node) {
    return node.kind === "RefreshMaterializedViewNode";
  },
  create(name) {
    return freeze({
      kind: "RefreshMaterializedViewNode",
      name: SchemableIdentifierNode.create(name)
    });
  },
  cloneWith(createView, params) {
    return freeze({
      ...createView,
      ...params
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/refresh-materialized-view-builder.js
var _props38;
var _RefreshMaterializedViewBuilder = class _RefreshMaterializedViewBuilder {
  constructor(props) {
    __privateAdd(this, _props38);
    __privateSet(this, _props38, freeze(props));
  }
  /**
   * Adds the "concurrently" modifier.
   *
   * Use this to refresh the view without locking out concurrent selects on the materialized view.
   *
   * WARNING!
   * This cannot be used with the "with no data" modifier.
   */
  concurrently() {
    return new _RefreshMaterializedViewBuilder({
      ...__privateGet(this, _props38),
      node: RefreshMaterializedViewNode.cloneWith(__privateGet(this, _props38).node, {
        concurrently: true,
        withNoData: false
      })
    });
  }
  /**
   * Adds the "with data" modifier.
   *
   * If specified (or defaults) the backing query is executed to provide the new data, and the materialized view is left in a scannable state
   */
  withData() {
    return new _RefreshMaterializedViewBuilder({
      ...__privateGet(this, _props38),
      node: RefreshMaterializedViewNode.cloneWith(__privateGet(this, _props38).node, {
        withNoData: false
      })
    });
  }
  /**
   * Adds the "with no data" modifier.
   *
   * If specified, no new data is generated and the materialized view is left in an unscannable state.
   *
   * WARNING!
   * This cannot be used with the "concurrently" modifier.
   */
  withNoData() {
    return new _RefreshMaterializedViewBuilder({
      ...__privateGet(this, _props38),
      node: RefreshMaterializedViewNode.cloneWith(__privateGet(this, _props38).node, {
        withNoData: true,
        concurrently: false
      })
    });
  }
  /**
   * Simply calls the provided function passing `this` as the only argument. `$call` returns
   * what the provided function returns.
   */
  $call(func) {
    return func(this);
  }
  toOperationNode() {
    return __privateGet(this, _props38).executor.transformQuery(__privateGet(this, _props38).node, __privateGet(this, _props38).queryId);
  }
  compile() {
    return __privateGet(this, _props38).executor.compileQuery(this.toOperationNode(), __privateGet(this, _props38).queryId);
  }
  async execute() {
    await __privateGet(this, _props38).executor.executeQuery(this.compile(), __privateGet(this, _props38).queryId);
  }
};
_props38 = new WeakMap();
var RefreshMaterializedViewBuilder = _RefreshMaterializedViewBuilder;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/schema/schema.js
var _executor;
var _SchemaModule = class _SchemaModule {
  constructor(executor) {
    __privateAdd(this, _executor);
    __privateSet(this, _executor, executor);
  }
  /**
   * Create a new table.
   *
   * ### Examples
   *
   * This example creates a new table with columns `id`, `first_name`,
   * `last_name` and `gender`:
   *
   * ```ts
   * await db.schema
   *   .createTable('person')
   *   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
   *   .addColumn('first_name', 'varchar', col => col.notNull())
   *   .addColumn('last_name', 'varchar', col => col.notNull())
   *   .addColumn('gender', 'varchar')
   *   .execute()
   * ```
   *
   * This example creates a table with a foreign key. Not all database
   * engines support column-level foreign key constraint definitions.
   * For example if you are using MySQL 5.X see the next example after
   * this one.
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
   *   .addColumn('owner_id', 'integer', col => col
   *     .references('person.id')
   *     .onDelete('cascade')
   *   )
   *   .execute()
   * ```
   *
   * This example adds a foreign key constraint for a columns just
   * like the previous example, but using a table-level statement.
   * On MySQL 5.X you need to define foreign key constraints like
   * this:
   *
   * ```ts
   * await db.schema
   *   .createTable('pet')
   *   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
   *   .addColumn('owner_id', 'integer')
   *   .addForeignKeyConstraint(
   *     'pet_owner_id_foreign', ['owner_id'], 'person', ['id'],
   *     (constraint) => constraint.onDelete('cascade')
   *   )
   *   .execute()
   * ```
   */
  createTable(table) {
    return new CreateTableBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: CreateTableNode.create(parseTable(table))
    });
  }
  /**
   * Drop a table.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .dropTable('person')
   *   .execute()
   * ```
   */
  dropTable(table) {
    return new DropTableBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: DropTableNode.create(parseTable(table))
    });
  }
  /**
   * Create a new index.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createIndex('person_full_name_unique_index')
   *   .on('person')
   *   .columns(['first_name', 'last_name'])
   *   .execute()
   * ```
   */
  createIndex(indexName) {
    return new CreateIndexBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: CreateIndexNode.create(indexName)
    });
  }
  /**
   * Drop an index.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .dropIndex('person_full_name_unique_index')
   *   .execute()
   * ```
   */
  dropIndex(indexName) {
    return new DropIndexBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: DropIndexNode.create(indexName)
    });
  }
  /**
   * Create a new schema.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createSchema('some_schema')
   *   .execute()
   * ```
   */
  createSchema(schema) {
    return new CreateSchemaBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: CreateSchemaNode.create(schema)
    });
  }
  /**
   * Drop a schema.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .dropSchema('some_schema')
   *   .execute()
   * ```
   */
  dropSchema(schema) {
    return new DropSchemaBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: DropSchemaNode.create(schema)
    });
  }
  /**
   * Alter a table.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .alterTable('person')
   *   .alterColumn('first_name', (ac) => ac.setDataType('text'))
   *   .execute()
   * ```
   */
  alterTable(table) {
    return new AlterTableBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: AlterTableNode.create(parseTable(table))
    });
  }
  /**
   * Create a new view.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createView('dogs')
   *   .orReplace()
   *   .as(db.selectFrom('pet').selectAll().where('species', '=', 'dog'))
   *   .execute()
   * ```
   */
  createView(viewName) {
    return new CreateViewBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: CreateViewNode.create(viewName)
    });
  }
  /**
   * Refresh a materialized view.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .refreshMaterializedView('my_view')
   *   .concurrently()
   *   .execute()
   * ```
   */
  refreshMaterializedView(viewName) {
    return new RefreshMaterializedViewBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: RefreshMaterializedViewNode.create(viewName)
    });
  }
  /**
   * Drop a view.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .dropView('dogs')
   *   .ifExists()
   *   .execute()
   * ```
   */
  dropView(viewName) {
    return new DropViewBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: DropViewNode.create(viewName)
    });
  }
  /**
   * Create a new type.
   *
   * Only some dialects like PostgreSQL have user-defined types.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .createType('species')
   *   .asEnum(['dog', 'cat', 'frog'])
   *   .execute()
   * ```
   */
  createType(typeName) {
    return new CreateTypeBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: CreateTypeNode.create(parseSchemableIdentifier(typeName))
    });
  }
  /**
   * Drop a type.
   *
   * Only some dialects like PostgreSQL have user-defined types.
   *
   * ### Examples
   *
   * ```ts
   * await db.schema
   *   .dropType('species')
   *   .ifExists()
   *   .execute()
   * ```
   */
  dropType(typeName) {
    return new DropTypeBuilder({
      queryId: createQueryId(),
      executor: __privateGet(this, _executor),
      node: DropTypeNode.create(parseSchemableIdentifier(typeName))
    });
  }
  /**
   * Returns a copy of this schema module with the given plugin installed.
   */
  withPlugin(plugin) {
    return new _SchemaModule(__privateGet(this, _executor).withPlugin(plugin));
  }
  /**
   * Returns a copy of this schema module  without any plugins.
   */
  withoutPlugins() {
    return new _SchemaModule(__privateGet(this, _executor).withoutPlugins());
  }
  /**
   * See {@link QueryCreator.withSchema}
   */
  withSchema(schema) {
    return new _SchemaModule(__privateGet(this, _executor).withPluginAtFront(new WithSchemaPlugin(schema)));
  }
};
_executor = new WeakMap();
var SchemaModule = _SchemaModule;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dynamic/dynamic.js
var DynamicModule = class {
  /**
   * Creates a dynamic reference to a column that is not know at compile time.
   *
   * Kysely is built in a way that by default you can't refer to tables or columns
   * that are not actually visible in the current query and context. This is all
   * done by TypeScript at compile time, which means that you need to know the
   * columns and tables at compile time. This is not always the case of course.
   *
   * This method is meant to be used in those cases where the column names
   * come from the user input or are not otherwise known at compile time.
   *
   * WARNING! Unlike values, column names are not escaped by the database engine
   * or Kysely and if you pass in unchecked column names using this method, you
   * create an SQL injection vulnerability. Always __always__ validate the user
   * input before passing it to this method.
   *
   * There are couple of examples below for some use cases, but you can pass
   * `ref` to other methods as well. If the types allow you to pass a `ref`
   * value to some place, it should work.
   *
   * ### Examples
   *
   * Filter by a column not know at compile time:
   *
   * ```ts
   * async function someQuery(filterColumn: string, filterValue: string) {
   *   const { ref } = db.dynamic
   *
   *   return await db
   *     .selectFrom('person')
   *     .selectAll()
   *     .where(ref(filterColumn), '=', filterValue)
   *     .execute()
   * }
   *
   * someQuery('first_name', 'Arnold')
   * someQuery('person.last_name', 'Aniston')
   * ```
   *
   * Order by a column not know at compile time:
   *
   * ```ts
   * async function someQuery(orderBy: string) {
   *   const { ref } = db.dynamic
   *
   *   return await db
   *     .selectFrom('person')
   *     .select('person.first_name as fn')
   *     .orderBy(ref(orderBy))
   *     .execute()
   * }
   *
   * someQuery('fn')
   * ```
   *
   * In this example we add selections dynamically:
   *
   * ```ts
   * const { ref } = db.dynamic
   *
   * // Some column name provided by the user. Value not known at compile time.
   * const columnFromUserInput: PossibleColumns = 'birthdate';
   *
   * // A type that lists all possible values `columnFromUserInput` can have.
   * // You can use `keyof Person` if any column of an interface is allowed.
   * type PossibleColumns = 'last_name' | 'first_name' | 'birthdate'
   *
   * const [person] = await db.selectFrom('person')
   *   .select([
   *     ref<PossibleColumns>(columnFromUserInput),
   *     'id'
   *   ])
   *   .execute()
   *
   * // The resulting type contains all `PossibleColumns` as optional fields
   * // because we cannot know which field was actually selected before
   * // running the code.
   * const lastName: string | null | undefined = person?.last_name
   * const firstName: string | undefined = person?.first_name
   * const birthDate: Date | null | undefined = person?.birthdate
   *
   * // The result type also contains the compile time selection `id`.
   * person?.id
   * ```
   */
  ref(reference) {
    return new DynamicReferenceBuilder(reference);
  }
  /**
   * Creates a table reference to a table that's not fully known at compile time.
   *
   * The type `T` is allowed to be a union of multiple tables.
   *
   * <!-- siteExample("select", "Generic find query", 130) -->
   *
   * A generic type-safe helper function for finding a row by a column value:
   *
   * ```ts
   * import { SelectType } from 'kysely'
   * import { Database } from 'type-editor'
   *
   * async function getRowByColumn<
   *   T extends keyof Database,
   *   C extends keyof Database[T] & string,
   *   V extends SelectType<Database[T][C]>,
   * >(t: T, c: C, v: V) {
   *   // We need to use the dynamic module since the table name
   *   // is not known at compile time.
   *   const { table, ref } = db.dynamic
   *
   *   return await db
   *     .selectFrom(table(t).as('t'))
   *     .selectAll()
   *     .where(ref(c), '=', v)
   *     .orderBy('t.id')
   *     .executeTakeFirstOrThrow()
   * }
   *
   * const person = await getRowByColumn('person', 'first_name', 'Arnold')
   * ```
   */
  table(table) {
    return new DynamicTableBuilder(table);
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/driver/default-connection-provider.js
var _driver;
var DefaultConnectionProvider = class {
  constructor(driver) {
    __privateAdd(this, _driver);
    __privateSet(this, _driver, driver);
  }
  async provideConnection(consumer) {
    const connection = await __privateGet(this, _driver).acquireConnection();
    try {
      return await consumer(connection);
    } finally {
      await __privateGet(this, _driver).releaseConnection(connection);
    }
  }
};
_driver = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-executor/default-query-executor.js
var _compiler, _adapter, _connectionProvider;
var _DefaultQueryExecutor = class _DefaultQueryExecutor extends QueryExecutorBase {
  constructor(compiler, adapter, connectionProvider, plugins = []) {
    super(plugins);
    __privateAdd(this, _compiler);
    __privateAdd(this, _adapter);
    __privateAdd(this, _connectionProvider);
    __privateSet(this, _compiler, compiler);
    __privateSet(this, _adapter, adapter);
    __privateSet(this, _connectionProvider, connectionProvider);
  }
  get adapter() {
    return __privateGet(this, _adapter);
  }
  compileQuery(node, queryId) {
    return __privateGet(this, _compiler).compileQuery(node, queryId);
  }
  provideConnection(consumer) {
    return __privateGet(this, _connectionProvider).provideConnection(consumer);
  }
  withPlugins(plugins) {
    return new _DefaultQueryExecutor(__privateGet(this, _compiler), __privateGet(this, _adapter), __privateGet(this, _connectionProvider), [...this.plugins, ...plugins]);
  }
  withPlugin(plugin) {
    return new _DefaultQueryExecutor(__privateGet(this, _compiler), __privateGet(this, _adapter), __privateGet(this, _connectionProvider), [...this.plugins, plugin]);
  }
  withPluginAtFront(plugin) {
    return new _DefaultQueryExecutor(__privateGet(this, _compiler), __privateGet(this, _adapter), __privateGet(this, _connectionProvider), [plugin, ...this.plugins]);
  }
  withConnectionProvider(connectionProvider) {
    return new _DefaultQueryExecutor(__privateGet(this, _compiler), __privateGet(this, _adapter), connectionProvider, [...this.plugins]);
  }
  withoutPlugins() {
    return new _DefaultQueryExecutor(__privateGet(this, _compiler), __privateGet(this, _adapter), __privateGet(this, _connectionProvider), []);
  }
};
_compiler = new WeakMap();
_adapter = new WeakMap();
_connectionProvider = new WeakMap();
var DefaultQueryExecutor = _DefaultQueryExecutor;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/performance-now.js
function performanceNow() {
  if (typeof performance !== "undefined" && isFunction(performance.now)) {
    return performance.now();
  } else {
    return Date.now();
  }
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/driver/runtime-driver.js
var _driver2, _log, _initPromise, _initDone, _destroyPromise, _connections, _RuntimeDriver_instances, needsLogging_fn, addLogging_fn, logError_fn, logQuery_fn, calculateDurationMillis_fn;
var RuntimeDriver = class {
  constructor(driver, log) {
    __privateAdd(this, _RuntimeDriver_instances);
    __privateAdd(this, _driver2);
    __privateAdd(this, _log);
    __privateAdd(this, _initPromise);
    __privateAdd(this, _initDone);
    __privateAdd(this, _destroyPromise);
    __privateAdd(this, _connections, /* @__PURE__ */ new WeakSet());
    __privateSet(this, _initDone, false);
    __privateSet(this, _driver2, driver);
    __privateSet(this, _log, log);
  }
  async init() {
    if (__privateGet(this, _destroyPromise)) {
      throw new Error("driver has already been destroyed");
    }
    if (!__privateGet(this, _initPromise)) {
      __privateSet(this, _initPromise, __privateGet(this, _driver2).init().then(() => {
        __privateSet(this, _initDone, true);
      }).catch((err) => {
        __privateSet(this, _initPromise, void 0);
        return Promise.reject(err);
      }));
    }
    await __privateGet(this, _initPromise);
  }
  async acquireConnection() {
    if (__privateGet(this, _destroyPromise)) {
      throw new Error("driver has already been destroyed");
    }
    if (!__privateGet(this, _initDone)) {
      await this.init();
    }
    const connection = await __privateGet(this, _driver2).acquireConnection();
    if (!__privateGet(this, _connections).has(connection)) {
      if (__privateMethod(this, _RuntimeDriver_instances, needsLogging_fn).call(this)) {
        __privateMethod(this, _RuntimeDriver_instances, addLogging_fn).call(this, connection);
      }
      __privateGet(this, _connections).add(connection);
    }
    return connection;
  }
  async releaseConnection(connection) {
    await __privateGet(this, _driver2).releaseConnection(connection);
  }
  beginTransaction(connection, settings) {
    return __privateGet(this, _driver2).beginTransaction(connection, settings);
  }
  commitTransaction(connection) {
    return __privateGet(this, _driver2).commitTransaction(connection);
  }
  rollbackTransaction(connection) {
    return __privateGet(this, _driver2).rollbackTransaction(connection);
  }
  savepoint(connection, savepointName, compileQuery) {
    if (__privateGet(this, _driver2).savepoint) {
      return __privateGet(this, _driver2).savepoint(connection, savepointName, compileQuery);
    }
    throw new Error("The `savepoint` method is not supported by this driver");
  }
  rollbackToSavepoint(connection, savepointName, compileQuery) {
    if (__privateGet(this, _driver2).rollbackToSavepoint) {
      return __privateGet(this, _driver2).rollbackToSavepoint(connection, savepointName, compileQuery);
    }
    throw new Error("The `rollbackToSavepoint` method is not supported by this driver");
  }
  releaseSavepoint(connection, savepointName, compileQuery) {
    if (__privateGet(this, _driver2).releaseSavepoint) {
      return __privateGet(this, _driver2).releaseSavepoint(connection, savepointName, compileQuery);
    }
    throw new Error("The `releaseSavepoint` method is not supported by this driver");
  }
  async destroy() {
    if (!__privateGet(this, _initPromise)) {
      return;
    }
    await __privateGet(this, _initPromise);
    if (!__privateGet(this, _destroyPromise)) {
      __privateSet(this, _destroyPromise, __privateGet(this, _driver2).destroy().catch((err) => {
        __privateSet(this, _destroyPromise, void 0);
        return Promise.reject(err);
      }));
    }
    await __privateGet(this, _destroyPromise);
  }
};
_driver2 = new WeakMap();
_log = new WeakMap();
_initPromise = new WeakMap();
_initDone = new WeakMap();
_destroyPromise = new WeakMap();
_connections = new WeakMap();
_RuntimeDriver_instances = new WeakSet();
needsLogging_fn = function() {
  return __privateGet(this, _log).isLevelEnabled("query") || __privateGet(this, _log).isLevelEnabled("error");
};
// This method monkey patches the database connection's executeQuery method
// by adding logging code around it. Monkey patching is not pretty, but it's
// the best option in this case.
addLogging_fn = function(connection) {
  const executeQuery = connection.executeQuery;
  const streamQuery = connection.streamQuery;
  const dis = this;
  connection.executeQuery = async (compiledQuery) => {
    var _a, _b;
    let caughtError;
    const startTime = performanceNow();
    try {
      return await executeQuery.call(connection, compiledQuery);
    } catch (error) {
      caughtError = error;
      await __privateMethod(_a = dis, _RuntimeDriver_instances, logError_fn).call(_a, error, compiledQuery, startTime);
      throw error;
    } finally {
      if (!caughtError) {
        await __privateMethod(_b = dis, _RuntimeDriver_instances, logQuery_fn).call(_b, compiledQuery, startTime);
      }
    }
  };
  connection.streamQuery = async function* (compiledQuery, chunkSize) {
    var _a, _b;
    let caughtError;
    const startTime = performanceNow();
    try {
      for await (const result of streamQuery.call(connection, compiledQuery, chunkSize)) {
        yield result;
      }
    } catch (error) {
      caughtError = error;
      await __privateMethod(_a = dis, _RuntimeDriver_instances, logError_fn).call(_a, error, compiledQuery, startTime);
      throw error;
    } finally {
      if (!caughtError) {
        await __privateMethod(_b = dis, _RuntimeDriver_instances, logQuery_fn).call(_b, compiledQuery, startTime, true);
      }
    }
  };
};
logError_fn = async function(error, compiledQuery, startTime) {
  await __privateGet(this, _log).error(() => ({
    level: "error",
    error,
    query: compiledQuery,
    queryDurationMillis: __privateMethod(this, _RuntimeDriver_instances, calculateDurationMillis_fn).call(this, startTime)
  }));
};
logQuery_fn = async function(compiledQuery, startTime, isStream = false) {
  await __privateGet(this, _log).query(() => ({
    level: "query",
    isStream,
    query: compiledQuery,
    queryDurationMillis: __privateMethod(this, _RuntimeDriver_instances, calculateDurationMillis_fn).call(this, startTime)
  }));
};
calculateDurationMillis_fn = function(startTime) {
  return performanceNow() - startTime;
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/driver/single-connection-provider.js
var ignoreError = () => {
};
var _connection, _runningPromise, _SingleConnectionProvider_instances, run_fn;
var SingleConnectionProvider = class {
  constructor(connection) {
    __privateAdd(this, _SingleConnectionProvider_instances);
    __privateAdd(this, _connection);
    __privateAdd(this, _runningPromise);
    __privateSet(this, _connection, connection);
  }
  async provideConnection(consumer) {
    while (__privateGet(this, _runningPromise)) {
      await __privateGet(this, _runningPromise).catch(ignoreError);
    }
    __privateSet(this, _runningPromise, __privateMethod(this, _SingleConnectionProvider_instances, run_fn).call(this, consumer).finally(() => {
      __privateSet(this, _runningPromise, void 0);
    }));
    return __privateGet(this, _runningPromise);
  }
};
_connection = new WeakMap();
_runningPromise = new WeakMap();
_SingleConnectionProvider_instances = new WeakSet();
run_fn = async function(runner) {
  return await runner(__privateGet(this, _connection));
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/driver/driver.js
var TRANSACTION_ACCESS_MODES = ["read only", "read write"];
var TRANSACTION_ISOLATION_LEVELS = [
  "read uncommitted",
  "read committed",
  "repeatable read",
  "serializable",
  "snapshot"
];
function validateTransactionSettings(settings) {
  if (settings.accessMode && !TRANSACTION_ACCESS_MODES.includes(settings.accessMode)) {
    throw new Error(`invalid transaction access mode ${settings.accessMode}`);
  }
  if (settings.isolationLevel && !TRANSACTION_ISOLATION_LEVELS.includes(settings.isolationLevel)) {
    throw new Error(`invalid transaction isolation level ${settings.isolationLevel}`);
  }
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/log.js
var LOG_LEVELS = freeze(["query", "error"]);
var _levels, _logger;
var Log = class {
  constructor(config) {
    __privateAdd(this, _levels);
    __privateAdd(this, _logger);
    if (isFunction(config)) {
      __privateSet(this, _logger, config);
      __privateSet(this, _levels, freeze({
        query: true,
        error: true
      }));
    } else {
      __privateSet(this, _logger, defaultLogger);
      __privateSet(this, _levels, freeze({
        query: config.includes("query"),
        error: config.includes("error")
      }));
    }
  }
  isLevelEnabled(level) {
    return __privateGet(this, _levels)[level];
  }
  async query(getEvent) {
    if (__privateGet(this, _levels).query) {
      await __privateGet(this, _logger).call(this, getEvent());
    }
  }
  async error(getEvent) {
    if (__privateGet(this, _levels).error) {
      await __privateGet(this, _logger).call(this, getEvent());
    }
  }
};
_levels = new WeakMap();
_logger = new WeakMap();
function defaultLogger(event) {
  if (event.level === "query") {
    const prefix = `kysely:query:${event.isStream ? "stream:" : ""}`;
    console.log(`${prefix} ${event.query.sql}`);
    console.log(`${prefix} duration: ${event.queryDurationMillis.toFixed(1)}ms`);
  } else if (event.level === "error") {
    if (event.error instanceof Error) {
      console.error(`kysely:error: ${event.error.stack ?? event.error.message}`);
    } else {
      console.error(`kysely:error: ${JSON.stringify({
        error: event.error,
        query: event.query.sql,
        queryDurationMillis: event.queryDurationMillis
      })}`);
    }
  }
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/compilable.js
function isCompilable(value) {
  return isObject(value) && isFunction(value.compile);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/kysely.js
Symbol.asyncDispose ?? (Symbol.asyncDispose = Symbol("Symbol.asyncDispose"));
var _props39;
var _Kysely = class _Kysely extends QueryCreator {
  constructor(args) {
    let superProps;
    let props;
    if (isKyselyProps(args)) {
      superProps = { executor: args.executor };
      props = { ...args };
    } else {
      const dialect = args.dialect;
      const driver = dialect.createDriver();
      const compiler = dialect.createQueryCompiler();
      const adapter = dialect.createAdapter();
      const log = new Log(args.log ?? []);
      const runtimeDriver = new RuntimeDriver(driver, log);
      const connectionProvider = new DefaultConnectionProvider(runtimeDriver);
      const executor = new DefaultQueryExecutor(compiler, adapter, connectionProvider, args.plugins ?? []);
      superProps = { executor };
      props = {
        config: args,
        executor,
        dialect,
        driver: runtimeDriver
      };
    }
    super(superProps);
    __privateAdd(this, _props39);
    __privateSet(this, _props39, freeze(props));
  }
  /**
   * Returns the {@link SchemaModule} module for building database schema.
   */
  get schema() {
    return new SchemaModule(__privateGet(this, _props39).executor);
  }
  /**
   * Returns a the {@link DynamicModule} module.
   *
   * The {@link DynamicModule} module can be used to bypass strict typing and
   * passing in dynamic values for the queries.
   */
  get dynamic() {
    return new DynamicModule();
  }
  /**
   * Returns a {@link DatabaseIntrospector | database introspector}.
   */
  get introspection() {
    return __privateGet(this, _props39).dialect.createIntrospector(this.withoutPlugins());
  }
  case(value) {
    return new CaseBuilder({
      node: CaseNode.create(isUndefined(value) ? void 0 : parseExpression(value))
    });
  }
  /**
   * Returns a {@link FunctionModule} that can be used to write somewhat type-safe function
   * calls.
   *
   * ```ts
   * const { count } = db.fn
   *
   * await db.selectFrom('person')
   *   .innerJoin('pet', 'pet.owner_id', 'person.id')
   *   .select([
   *     'id',
   *     count('pet.id').as('person_count'),
   *   ])
   *   .groupBy('person.id')
   *   .having(count('pet.id'), '>', 10)
   *   .execute()
   * ```
   *
   * The generated SQL (PostgreSQL):
   *
   * ```sql
   * select "person"."id", count("pet"."id") as "person_count"
   * from "person"
   * inner join "pet" on "pet"."owner_id" = "person"."id"
   * group by "person"."id"
   * having count("pet"."id") > $1
   * ```
   *
   * Why "somewhat" type-safe? Because the function calls are not bound to the
   * current query context. They allow you to reference columns and tables that
   * are not in the current query. E.g. remove the `innerJoin` from the previous
   * query and TypeScript won't even complain.
   *
   * If you want to make the function calls fully type-safe, you can use the
   * {@link ExpressionBuilder.fn} getter for a query context-aware, stricter {@link FunctionModule}.
   *
   * ```ts
   * await db.selectFrom('person')
   *   .innerJoin('pet', 'pet.owner_id', 'person.id')
   *   .select((eb) => [
   *     'person.id',
   *     eb.fn.count('pet.id').as('pet_count')
   *   ])
   *   .groupBy('person.id')
   *   .having((eb) => eb.fn.count('pet.id'), '>', 10)
   *   .execute()
   * ```
   */
  get fn() {
    return createFunctionModule();
  }
  /**
   * Creates a {@link TransactionBuilder} that can be used to run queries inside a transaction.
   *
   * The returned {@link TransactionBuilder} can be used to configure the transaction. The
   * {@link TransactionBuilder.execute} method can then be called to run the transaction.
   * {@link TransactionBuilder.execute} takes a function that is run inside the
   * transaction. If the function throws an exception,
   * 1. the exception is caught,
   * 2. the transaction is rolled back, and
   * 3. the exception is thrown again.
   * Otherwise the transaction is committed.
   *
   * The callback function passed to the {@link TransactionBuilder.execute | execute}
   * method gets the transaction object as its only argument. The transaction is
   * of type {@link Transaction} which inherits {@link Kysely}. Any query
   * started through the transaction object is executed inside the transaction.
   *
   * To run a controlled transaction, allowing you to commit and rollback manually,
   * use {@link startTransaction} instead.
   *
   * ### Examples
   *
   * <!-- siteExample("transactions", "Simple transaction", 10) -->
   *
   * This example inserts two rows in a transaction. If an exception is thrown inside
   * the callback passed to the `execute` method,
   * 1. the exception is caught,
   * 2. the transaction is rolled back, and
   * 3. the exception is thrown again.
   * Otherwise the transaction is committed.
   *
   * ```ts
   * const catto = await db.transaction().execute(async (trx) => {
   *   const jennifer = await trx.insertInto('person')
   *     .values({
   *       first_name: 'Jennifer',
   *       last_name: 'Aniston',
   *       age: 40,
   *     })
   *     .returning('id')
   *     .executeTakeFirstOrThrow()
   *
   *   return await trx.insertInto('pet')
   *     .values({
   *       owner_id: jennifer.id,
   *       name: 'Catto',
   *       species: 'cat',
   *       is_favorite: false,
   *     })
   *     .returningAll()
   *     .executeTakeFirst()
   * })
   * ```
   *
   * Setting the isolation level:
   *
   * ```ts
   * import type { Kysely } from 'kysely'
   *
   * await db
   *   .transaction()
   *   .setIsolationLevel('serializable')
   *   .execute(async (trx) => {
   *     await doStuff(trx)
   *   })
   *
   * async function doStuff(kysely: typeof db) {
   *   // ...
   * }
   * ```
   */
  transaction() {
    return new TransactionBuilder({ ...__privateGet(this, _props39) });
  }
  /**
   * Creates a {@link ControlledTransactionBuilder} that can be used to run queries inside a controlled transaction.
   *
   * The returned {@link ControlledTransactionBuilder} can be used to configure the transaction.
   * The {@link ControlledTransactionBuilder.execute} method can then be called
   * to start the transaction and return a {@link ControlledTransaction}.
   *
   * A {@link ControlledTransaction} allows you to commit and rollback manually,
   * execute savepoint commands. It extends {@link Transaction} which extends {@link Kysely},
   * so you can run queries inside the transaction. Once the transaction is committed,
   * or rolled back, it can't be used anymore - all queries will throw an error.
   * This is to prevent accidentally running queries outside the transaction - where
   * atomicity is not guaranteed anymore.
   *
   * ### Examples
   *
   * <!-- siteExample("transactions", "Controlled transaction", 11) -->
   *
   * A controlled transaction allows you to commit and rollback manually, execute
   * savepoint commands, and queries in general.
   *
   * In this example we start a transaction, use it to insert two rows and then commit
   * the transaction. If an error is thrown, we catch it and rollback the transaction.
   *
   * ```ts
   * const trx = await db.startTransaction().execute()
   *
   * try {
   *   const jennifer = await trx.insertInto('person')
   *     .values({
   *       first_name: 'Jennifer',
   *       last_name: 'Aniston',
   *       age: 40,
   *     })
   *     .returning('id')
   *     .executeTakeFirstOrThrow()
   *
   *   const catto = await trx.insertInto('pet')
   *     .values({
   *       owner_id: jennifer.id,
   *       name: 'Catto',
   *       species: 'cat',
   *       is_favorite: false,
   *     })
   *     .returningAll()
   *     .executeTakeFirstOrThrow()
   *
   *   await trx.commit().execute()
   *
   *   // ...
   * } catch (error) {
   *   await trx.rollback().execute()
   * }
   * ```
   *
   * <!-- siteExample("transactions", "Controlled transaction /w savepoints", 12) -->
   *
   * A controlled transaction allows you to commit and rollback manually, execute
   * savepoint commands, and queries in general.
   *
   * In this example we start a transaction, insert a person, create a savepoint,
   * try inserting a toy and a pet, and if an error is thrown, we rollback to the
   * savepoint. Eventually we release the savepoint, insert an audit record and
   * commit the transaction. If an error is thrown, we catch it and rollback the
   * transaction.
   *
   * ```ts
   * const trx = await db.startTransaction().execute()
   *
   * try {
   *   const jennifer = await trx
   *     .insertInto('person')
   *     .values({
   *       first_name: 'Jennifer',
   *       last_name: 'Aniston',
   *       age: 40,
   *     })
   *     .returning('id')
   *     .executeTakeFirstOrThrow()
   *
   *   const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
   *
   *   try {
   *     const catto = await trxAfterJennifer
   *       .insertInto('pet')
   *       .values({
   *         owner_id: jennifer.id,
   *         name: 'Catto',
   *         species: 'cat',
   *       })
   *       .returning('id')
   *       .executeTakeFirstOrThrow()
   *
   *     await trxAfterJennifer
   *       .insertInto('toy')
   *       .values({ name: 'Bone', price: 1.99, pet_id: catto.id })
   *       .execute()
   *   } catch (error) {
   *     await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
   *   }
   *
   *   await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
   *
   *   await trx.insertInto('audit').values({ action: 'added Jennifer' }).execute()
   *
   *   await trx.commit().execute()
   * } catch (error) {
   *   await trx.rollback().execute()
   * }
   * ```
   */
  startTransaction() {
    return new ControlledTransactionBuilder({ ...__privateGet(this, _props39) });
  }
  /**
   * Provides a kysely instance bound to a single database connection.
   *
   * ### Examples
   *
   * ```ts
   * await db
   *   .connection()
   *   .execute(async (db) => {
   *     // `db` is an instance of `Kysely` that's bound to a single
   *     // database connection. All queries executed through `db` use
   *     // the same connection.
   *     await doStuff(db)
   *   })
   *
   * async function doStuff(kysely: typeof db) {
   *   // ...
   * }
   * ```
   */
  connection() {
    return new ConnectionBuilder({ ...__privateGet(this, _props39) });
  }
  /**
   * Returns a copy of this Kysely instance with the given plugin installed.
   */
  withPlugin(plugin) {
    return new _Kysely({
      ...__privateGet(this, _props39),
      executor: __privateGet(this, _props39).executor.withPlugin(plugin)
    });
  }
  /**
   * Returns a copy of this Kysely instance without any plugins.
   */
  withoutPlugins() {
    return new _Kysely({
      ...__privateGet(this, _props39),
      executor: __privateGet(this, _props39).executor.withoutPlugins()
    });
  }
  /**
   * @override
   */
  withSchema(schema) {
    return new _Kysely({
      ...__privateGet(this, _props39),
      executor: __privateGet(this, _props39).executor.withPluginAtFront(new WithSchemaPlugin(schema))
    });
  }
  /**
   * Returns a copy of this Kysely instance with tables added to its
   * database type.
   *
   * This method only modifies the types and doesn't affect any of the
   * executed queries in any way.
   *
   * ### Examples
   *
   * The following example adds and uses a temporary table:
   *
   * ```ts
   * await db.schema
   *   .createTable('temp_table')
   *   .temporary()
   *   .addColumn('some_column', 'integer')
   *   .execute()
   *
   * const tempDb = db.withTables<{
   *   temp_table: {
   *     some_column: number
   *   }
   * }>()
   *
   * await tempDb
   *   .insertInto('temp_table')
   *   .values({ some_column: 100 })
   *   .execute()
   * ```
   */
  withTables() {
    return new _Kysely({ ...__privateGet(this, _props39) });
  }
  /**
   * Releases all resources and disconnects from the database.
   *
   * You need to call this when you are done using the `Kysely` instance.
   */
  async destroy() {
    await __privateGet(this, _props39).driver.destroy();
  }
  /**
   * Returns true if this `Kysely` instance is a transaction.
   *
   * You can also use `db instanceof Transaction`.
   */
  get isTransaction() {
    return false;
  }
  /**
   * @internal
   * @private
   */
  getExecutor() {
    return __privateGet(this, _props39).executor;
  }
  /**
   * Executes a given compiled query or query builder.
   *
   * See {@link https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0004-splitting-query-building-and-execution.md#execute-compiled-queries splitting build, compile and execute code recipe} for more information.
   */
  executeQuery(query, queryId = createQueryId()) {
    const compiledQuery = isCompilable(query) ? query.compile() : query;
    return this.getExecutor().executeQuery(compiledQuery, queryId);
  }
  async [Symbol.asyncDispose]() {
    await this.destroy();
  }
};
_props39 = new WeakMap();
var Kysely = _Kysely;
var _props40;
var _Transaction = class _Transaction extends Kysely {
  constructor(props) {
    super(props);
    __privateAdd(this, _props40);
    __privateSet(this, _props40, props);
  }
  // The return type is `true` instead of `boolean` to make Kysely<DB>
  // unassignable to Transaction<DB> while allowing assignment the
  // other way around.
  get isTransaction() {
    return true;
  }
  transaction() {
    throw new Error("calling the transaction method for a Transaction is not supported");
  }
  connection() {
    throw new Error("calling the connection method for a Transaction is not supported");
  }
  async destroy() {
    throw new Error("calling the destroy method for a Transaction is not supported");
  }
  withPlugin(plugin) {
    return new _Transaction({
      ...__privateGet(this, _props40),
      executor: __privateGet(this, _props40).executor.withPlugin(plugin)
    });
  }
  withoutPlugins() {
    return new _Transaction({
      ...__privateGet(this, _props40),
      executor: __privateGet(this, _props40).executor.withoutPlugins()
    });
  }
  withSchema(schema) {
    return new _Transaction({
      ...__privateGet(this, _props40),
      executor: __privateGet(this, _props40).executor.withPluginAtFront(new WithSchemaPlugin(schema))
    });
  }
  withTables() {
    return new _Transaction({ ...__privateGet(this, _props40) });
  }
};
_props40 = new WeakMap();
var Transaction = _Transaction;
function isKyselyProps(obj) {
  return isObject(obj) && isObject(obj.config) && isObject(obj.driver) && isObject(obj.executor) && isObject(obj.dialect);
}
var _props41;
var ConnectionBuilder = class {
  constructor(props) {
    __privateAdd(this, _props41);
    __privateSet(this, _props41, freeze(props));
  }
  async execute(callback) {
    return __privateGet(this, _props41).executor.provideConnection(async (connection) => {
      const executor = __privateGet(this, _props41).executor.withConnectionProvider(new SingleConnectionProvider(connection));
      const db = new Kysely({
        ...__privateGet(this, _props41),
        executor
      });
      return await callback(db);
    });
  }
};
_props41 = new WeakMap();
var _props42;
var _TransactionBuilder = class _TransactionBuilder {
  constructor(props) {
    __privateAdd(this, _props42);
    __privateSet(this, _props42, freeze(props));
  }
  setAccessMode(accessMode) {
    return new _TransactionBuilder({
      ...__privateGet(this, _props42),
      accessMode
    });
  }
  setIsolationLevel(isolationLevel) {
    return new _TransactionBuilder({
      ...__privateGet(this, _props42),
      isolationLevel
    });
  }
  async execute(callback) {
    const { isolationLevel, accessMode, ...kyselyProps } = __privateGet(this, _props42);
    const settings = { isolationLevel, accessMode };
    validateTransactionSettings(settings);
    return __privateGet(this, _props42).executor.provideConnection(async (connection) => {
      const executor = __privateGet(this, _props42).executor.withConnectionProvider(new SingleConnectionProvider(connection));
      const transaction = new Transaction({
        ...kyselyProps,
        executor
      });
      try {
        await __privateGet(this, _props42).driver.beginTransaction(connection, settings);
        const result = await callback(transaction);
        await __privateGet(this, _props42).driver.commitTransaction(connection);
        return result;
      } catch (error) {
        await __privateGet(this, _props42).driver.rollbackTransaction(connection);
        throw error;
      }
    });
  }
};
_props42 = new WeakMap();
var TransactionBuilder = _TransactionBuilder;
var _props43;
var _ControlledTransactionBuilder = class _ControlledTransactionBuilder {
  constructor(props) {
    __privateAdd(this, _props43);
    __privateSet(this, _props43, freeze(props));
  }
  setAccessMode(accessMode) {
    return new _ControlledTransactionBuilder({
      ...__privateGet(this, _props43),
      accessMode
    });
  }
  setIsolationLevel(isolationLevel) {
    return new _ControlledTransactionBuilder({
      ...__privateGet(this, _props43),
      isolationLevel
    });
  }
  async execute() {
    const { isolationLevel, accessMode, ...props } = __privateGet(this, _props43);
    const settings = { isolationLevel, accessMode };
    validateTransactionSettings(settings);
    const connection = await provideControlledConnection(__privateGet(this, _props43).executor);
    await __privateGet(this, _props43).driver.beginTransaction(connection.connection, settings);
    return new ControlledTransaction({
      ...props,
      connection,
      executor: __privateGet(this, _props43).executor.withConnectionProvider(new SingleConnectionProvider(connection.connection))
    });
  }
};
_props43 = new WeakMap();
var ControlledTransactionBuilder = _ControlledTransactionBuilder;
var _props44, _compileQuery, _state;
var _ControlledTransaction = class _ControlledTransaction extends Transaction {
  constructor(props) {
    const state = { isCommitted: false, isRolledBack: false };
    props = {
      ...props,
      executor: new NotCommittedOrRolledBackAssertingExecutor(props.executor, state)
    };
    const { connection, ...transactionProps } = props;
    super(transactionProps);
    __privateAdd(this, _props44);
    __privateAdd(this, _compileQuery);
    __privateAdd(this, _state);
    __privateSet(this, _props44, freeze(props));
    __privateSet(this, _state, state);
    const queryId = createQueryId();
    __privateSet(this, _compileQuery, (node) => props.executor.compileQuery(node, queryId));
  }
  get isCommitted() {
    return __privateGet(this, _state).isCommitted;
  }
  get isRolledBack() {
    return __privateGet(this, _state).isRolledBack;
  }
  /**
   * Commits the transaction.
   *
   * See {@link rollback}.
   *
   * ### Examples
   *
   * ```ts
   * import type { Kysely } from 'kysely'
   * import type { Database } from 'type-editor' // imaginary module
   *
   * const trx = await db.startTransaction().execute()
   *
   * try {
   *   await doSomething(trx)
   *
   *   await trx.commit().execute()
   * } catch (error) {
   *   await trx.rollback().execute()
   * }
   *
   * async function doSomething(kysely: Kysely<Database>) {}
   * ```
   */
  commit() {
    assertNotCommittedOrRolledBack(__privateGet(this, _state));
    return new Command(async () => {
      await __privateGet(this, _props44).driver.commitTransaction(__privateGet(this, _props44).connection.connection);
      __privateGet(this, _state).isCommitted = true;
      __privateGet(this, _props44).connection.release();
    });
  }
  /**
   * Rolls back the transaction.
   *
   * See {@link commit} and {@link rollbackToSavepoint}.
   *
   * ### Examples
   *
   * ```ts
   * import type { Kysely } from 'kysely'
   * import type { Database } from 'type-editor' // imaginary module
   *
   * const trx = await db.startTransaction().execute()
   *
   * try {
   *   await doSomething(trx)
   *
   *   await trx.commit().execute()
   * } catch (error) {
   *   await trx.rollback().execute()
   * }
   *
   * async function doSomething(kysely: Kysely<Database>) {}
   * ```
   */
  rollback() {
    assertNotCommittedOrRolledBack(__privateGet(this, _state));
    return new Command(async () => {
      await __privateGet(this, _props44).driver.rollbackTransaction(__privateGet(this, _props44).connection.connection);
      __privateGet(this, _state).isRolledBack = true;
      __privateGet(this, _props44).connection.release();
    });
  }
  /**
   * Creates a savepoint with a given name.
   *
   * See {@link rollbackToSavepoint} and {@link releaseSavepoint}.
   *
   * For a type-safe experience, you should use the returned instance from now on.
   *
   * ### Examples
   *
   * ```ts
   * import type { Kysely } from 'kysely'
   * import type { Database } from 'type-editor' // imaginary module
   *
   * const trx = await db.startTransaction().execute()
   *
   * await insertJennifer(trx)
   *
   * const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
   *
   * try {
   *   await doSomething(trxAfterJennifer)
   * } catch (error) {
   *   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
   * }
   *
   * async function insertJennifer(kysely: Kysely<Database>) {}
   * async function doSomething(kysely: Kysely<Database>) {}
   * ```
   */
  savepoint(savepointName) {
    assertNotCommittedOrRolledBack(__privateGet(this, _state));
    return new Command(async () => {
      var _a, _b;
      await ((_b = (_a = __privateGet(this, _props44).driver).savepoint) == null ? void 0 : _b.call(_a, __privateGet(this, _props44).connection.connection, savepointName, __privateGet(this, _compileQuery)));
      return new _ControlledTransaction({ ...__privateGet(this, _props44) });
    });
  }
  /**
   * Rolls back to a savepoint with a given name.
   *
   * See {@link savepoint} and {@link releaseSavepoint}.
   *
   * You must use the same instance returned by {@link savepoint}, or
   * escape the type-check by using `as any`.
   *
   * ### Examples
   *
   * ```ts
   * import type { Kysely } from 'kysely'
   * import type { Database } from 'type-editor' // imaginary module
   *
   * const trx = await db.startTransaction().execute()
   *
   * await insertJennifer(trx)
   *
   * const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
   *
   * try {
   *   await doSomething(trxAfterJennifer)
   * } catch (error) {
   *   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
   * }
   *
   * async function insertJennifer(kysely: Kysely<Database>) {}
   * async function doSomething(kysely: Kysely<Database>) {}
   * ```
   */
  rollbackToSavepoint(savepointName) {
    assertNotCommittedOrRolledBack(__privateGet(this, _state));
    return new Command(async () => {
      var _a, _b;
      await ((_b = (_a = __privateGet(this, _props44).driver).rollbackToSavepoint) == null ? void 0 : _b.call(_a, __privateGet(this, _props44).connection.connection, savepointName, __privateGet(this, _compileQuery)));
      return new _ControlledTransaction({ ...__privateGet(this, _props44) });
    });
  }
  /**
   * Releases a savepoint with a given name.
   *
   * See {@link savepoint} and {@link rollbackToSavepoint}.
   *
   * You must use the same instance returned by {@link savepoint}, or
   * escape the type-check by using `as any`.
   *
   * ### Examples
   *
   * ```ts
   * import type { Kysely } from 'kysely'
   * import type { Database } from 'type-editor' // imaginary module
   *
   * const trx = await db.startTransaction().execute()
   *
   * await insertJennifer(trx)
   *
   * const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
   *
   * try {
   *   await doSomething(trxAfterJennifer)
   * } catch (error) {
   *   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
   * }
   *
   * await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
   *
   * await doSomethingElse(trx)
   *
   * async function insertJennifer(kysely: Kysely<Database>) {}
   * async function doSomething(kysely: Kysely<Database>) {}
   * async function doSomethingElse(kysely: Kysely<Database>) {}
   * ```
   */
  releaseSavepoint(savepointName) {
    assertNotCommittedOrRolledBack(__privateGet(this, _state));
    return new Command(async () => {
      var _a, _b;
      await ((_b = (_a = __privateGet(this, _props44).driver).releaseSavepoint) == null ? void 0 : _b.call(_a, __privateGet(this, _props44).connection.connection, savepointName, __privateGet(this, _compileQuery)));
      return new _ControlledTransaction({ ...__privateGet(this, _props44) });
    });
  }
  withPlugin(plugin) {
    return new _ControlledTransaction({
      ...__privateGet(this, _props44),
      executor: __privateGet(this, _props44).executor.withPlugin(plugin)
    });
  }
  withoutPlugins() {
    return new _ControlledTransaction({
      ...__privateGet(this, _props44),
      executor: __privateGet(this, _props44).executor.withoutPlugins()
    });
  }
  withSchema(schema) {
    return new _ControlledTransaction({
      ...__privateGet(this, _props44),
      executor: __privateGet(this, _props44).executor.withPluginAtFront(new WithSchemaPlugin(schema))
    });
  }
  withTables() {
    return new _ControlledTransaction({ ...__privateGet(this, _props44) });
  }
};
_props44 = new WeakMap();
_compileQuery = new WeakMap();
_state = new WeakMap();
var ControlledTransaction = _ControlledTransaction;
var _cb;
var Command = class {
  constructor(cb) {
    __privateAdd(this, _cb);
    __privateSet(this, _cb, cb);
  }
  /**
   * Executes the command.
   */
  async execute() {
    return await __privateGet(this, _cb).call(this);
  }
};
_cb = new WeakMap();
function assertNotCommittedOrRolledBack(state) {
  if (state.isCommitted) {
    throw new Error("Transaction is already committed");
  }
  if (state.isRolledBack) {
    throw new Error("Transaction is already rolled back");
  }
}
var _executor2, _state2;
var _NotCommittedOrRolledBackAssertingExecutor = class _NotCommittedOrRolledBackAssertingExecutor {
  constructor(executor, state) {
    __privateAdd(this, _executor2);
    __privateAdd(this, _state2);
    if (executor instanceof _NotCommittedOrRolledBackAssertingExecutor) {
      __privateSet(this, _executor2, __privateGet(executor, _executor2));
    } else {
      __privateSet(this, _executor2, executor);
    }
    __privateSet(this, _state2, state);
  }
  get adapter() {
    return __privateGet(this, _executor2).adapter;
  }
  get plugins() {
    return __privateGet(this, _executor2).plugins;
  }
  transformQuery(node, queryId) {
    return __privateGet(this, _executor2).transformQuery(node, queryId);
  }
  compileQuery(node, queryId) {
    return __privateGet(this, _executor2).compileQuery(node, queryId);
  }
  provideConnection(consumer) {
    return __privateGet(this, _executor2).provideConnection(consumer);
  }
  executeQuery(compiledQuery, queryId) {
    assertNotCommittedOrRolledBack(__privateGet(this, _state2));
    return __privateGet(this, _executor2).executeQuery(compiledQuery, queryId);
  }
  stream(compiledQuery, chunkSize, queryId) {
    assertNotCommittedOrRolledBack(__privateGet(this, _state2));
    return __privateGet(this, _executor2).stream(compiledQuery, chunkSize, queryId);
  }
  withConnectionProvider(connectionProvider) {
    return new _NotCommittedOrRolledBackAssertingExecutor(__privateGet(this, _executor2).withConnectionProvider(connectionProvider), __privateGet(this, _state2));
  }
  withPlugin(plugin) {
    return new _NotCommittedOrRolledBackAssertingExecutor(__privateGet(this, _executor2).withPlugin(plugin), __privateGet(this, _state2));
  }
  withPlugins(plugins) {
    return new _NotCommittedOrRolledBackAssertingExecutor(__privateGet(this, _executor2).withPlugins(plugins), __privateGet(this, _state2));
  }
  withPluginAtFront(plugin) {
    return new _NotCommittedOrRolledBackAssertingExecutor(__privateGet(this, _executor2).withPluginAtFront(plugin), __privateGet(this, _state2));
  }
  withoutPlugins() {
    return new _NotCommittedOrRolledBackAssertingExecutor(__privateGet(this, _executor2).withoutPlugins(), __privateGet(this, _state2));
  }
};
_executor2 = new WeakMap();
_state2 = new WeakMap();
var NotCommittedOrRolledBackAssertingExecutor = _NotCommittedOrRolledBackAssertingExecutor;

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/raw-builder/raw-builder.js
var _props45, _RawBuilderImpl_instances, getExecutor_fn, toOperationNode_fn, compile_fn;
var _RawBuilderImpl = class _RawBuilderImpl {
  constructor(props) {
    __privateAdd(this, _RawBuilderImpl_instances);
    __privateAdd(this, _props45);
    __privateSet(this, _props45, freeze(props));
  }
  get expressionType() {
    return void 0;
  }
  get isRawBuilder() {
    return true;
  }
  as(alias) {
    return new AliasedRawBuilderImpl(this, alias);
  }
  $castTo() {
    return new _RawBuilderImpl({ ...__privateGet(this, _props45) });
  }
  $notNull() {
    return new _RawBuilderImpl(__privateGet(this, _props45));
  }
  withPlugin(plugin) {
    return new _RawBuilderImpl({
      ...__privateGet(this, _props45),
      plugins: __privateGet(this, _props45).plugins !== void 0 ? freeze([...__privateGet(this, _props45).plugins, plugin]) : freeze([plugin])
    });
  }
  toOperationNode() {
    return __privateMethod(this, _RawBuilderImpl_instances, toOperationNode_fn).call(this, __privateMethod(this, _RawBuilderImpl_instances, getExecutor_fn).call(this));
  }
  compile(executorProvider) {
    return __privateMethod(this, _RawBuilderImpl_instances, compile_fn).call(this, __privateMethod(this, _RawBuilderImpl_instances, getExecutor_fn).call(this, executorProvider));
  }
  async execute(executorProvider) {
    const executor = __privateMethod(this, _RawBuilderImpl_instances, getExecutor_fn).call(this, executorProvider);
    return executor.executeQuery(__privateMethod(this, _RawBuilderImpl_instances, compile_fn).call(this, executor), __privateGet(this, _props45).queryId);
  }
};
_props45 = new WeakMap();
_RawBuilderImpl_instances = new WeakSet();
getExecutor_fn = function(executorProvider) {
  const executor = executorProvider !== void 0 ? executorProvider.getExecutor() : NOOP_QUERY_EXECUTOR;
  return __privateGet(this, _props45).plugins !== void 0 ? executor.withPlugins(__privateGet(this, _props45).plugins) : executor;
};
toOperationNode_fn = function(executor) {
  return executor.transformQuery(__privateGet(this, _props45).rawNode, __privateGet(this, _props45).queryId);
};
compile_fn = function(executor) {
  return executor.compileQuery(__privateMethod(this, _RawBuilderImpl_instances, toOperationNode_fn).call(this, executor), __privateGet(this, _props45).queryId);
};
var RawBuilderImpl = _RawBuilderImpl;
function createRawBuilder(props) {
  return new RawBuilderImpl(props);
}
var _rawBuilder, _alias6;
var AliasedRawBuilderImpl = class {
  constructor(rawBuilder, alias) {
    __privateAdd(this, _rawBuilder);
    __privateAdd(this, _alias6);
    __privateSet(this, _rawBuilder, rawBuilder);
    __privateSet(this, _alias6, alias);
  }
  get expression() {
    return __privateGet(this, _rawBuilder);
  }
  get alias() {
    return __privateGet(this, _alias6);
  }
  get rawBuilder() {
    return __privateGet(this, _rawBuilder);
  }
  toOperationNode() {
    return AliasNode.create(__privateGet(this, _rawBuilder).toOperationNode(), isOperationNodeSource(__privateGet(this, _alias6)) ? __privateGet(this, _alias6).toOperationNode() : IdentifierNode.create(__privateGet(this, _alias6)));
  }
};
_rawBuilder = new WeakMap();
_alias6 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/raw-builder/sql.js
var sql = Object.assign((sqlFragments, ...parameters) => {
  return createRawBuilder({
    queryId: createQueryId(),
    rawNode: RawNode.create(sqlFragments, (parameters == null ? void 0 : parameters.map(parseParameter)) ?? [])
  });
}, {
  ref(columnReference) {
    return createRawBuilder({
      queryId: createQueryId(),
      rawNode: RawNode.createWithChild(parseStringReference(columnReference))
    });
  },
  val(value) {
    return createRawBuilder({
      queryId: createQueryId(),
      rawNode: RawNode.createWithChild(parseValueExpression(value))
    });
  },
  value(value) {
    return this.val(value);
  },
  table(tableReference) {
    return createRawBuilder({
      queryId: createQueryId(),
      rawNode: RawNode.createWithChild(parseTable(tableReference))
    });
  },
  id(...ids) {
    const fragments = new Array(ids.length + 1).fill(".");
    fragments[0] = "";
    fragments[fragments.length - 1] = "";
    return createRawBuilder({
      queryId: createQueryId(),
      rawNode: RawNode.create(fragments, ids.map(IdentifierNode.create))
    });
  },
  lit(value) {
    return createRawBuilder({
      queryId: createQueryId(),
      rawNode: RawNode.createWithChild(ValueNode.createImmediate(value))
    });
  },
  literal(value) {
    return this.lit(value);
  },
  raw(sql2) {
    return createRawBuilder({
      queryId: createQueryId(),
      rawNode: RawNode.createWithSql(sql2)
    });
  },
  join(array, separator = sql`, `) {
    const nodes = new Array(Math.max(2 * array.length - 1, 0));
    const sep = separator.toOperationNode();
    for (let i = 0; i < array.length; ++i) {
      nodes[2 * i] = parseParameter(array[i]);
      if (i !== array.length - 1) {
        nodes[2 * i + 1] = sep;
      }
    }
    return createRawBuilder({
      queryId: createQueryId(),
      rawNode: RawNode.createWithChildren(nodes)
    });
  }
});
function parseParameter(param) {
  if (isOperationNodeSource(param)) {
    return param.toOperationNode();
  }
  return parseValueExpression(param);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/operation-node/operation-node-visitor.js
var _visitors;
var OperationNodeVisitor = class {
  constructor() {
    __publicField(this, "nodeStack", []);
    __privateAdd(this, _visitors, freeze({
      AliasNode: this.visitAlias.bind(this),
      ColumnNode: this.visitColumn.bind(this),
      IdentifierNode: this.visitIdentifier.bind(this),
      SchemableIdentifierNode: this.visitSchemableIdentifier.bind(this),
      RawNode: this.visitRaw.bind(this),
      ReferenceNode: this.visitReference.bind(this),
      SelectQueryNode: this.visitSelectQuery.bind(this),
      SelectionNode: this.visitSelection.bind(this),
      TableNode: this.visitTable.bind(this),
      FromNode: this.visitFrom.bind(this),
      SelectAllNode: this.visitSelectAll.bind(this),
      AndNode: this.visitAnd.bind(this),
      OrNode: this.visitOr.bind(this),
      ValueNode: this.visitValue.bind(this),
      ValueListNode: this.visitValueList.bind(this),
      PrimitiveValueListNode: this.visitPrimitiveValueList.bind(this),
      ParensNode: this.visitParens.bind(this),
      JoinNode: this.visitJoin.bind(this),
      OperatorNode: this.visitOperator.bind(this),
      WhereNode: this.visitWhere.bind(this),
      InsertQueryNode: this.visitInsertQuery.bind(this),
      DeleteQueryNode: this.visitDeleteQuery.bind(this),
      ReturningNode: this.visitReturning.bind(this),
      CreateTableNode: this.visitCreateTable.bind(this),
      AddColumnNode: this.visitAddColumn.bind(this),
      ColumnDefinitionNode: this.visitColumnDefinition.bind(this),
      DropTableNode: this.visitDropTable.bind(this),
      DataTypeNode: this.visitDataType.bind(this),
      OrderByNode: this.visitOrderBy.bind(this),
      OrderByItemNode: this.visitOrderByItem.bind(this),
      GroupByNode: this.visitGroupBy.bind(this),
      GroupByItemNode: this.visitGroupByItem.bind(this),
      UpdateQueryNode: this.visitUpdateQuery.bind(this),
      ColumnUpdateNode: this.visitColumnUpdate.bind(this),
      LimitNode: this.visitLimit.bind(this),
      OffsetNode: this.visitOffset.bind(this),
      OnConflictNode: this.visitOnConflict.bind(this),
      OnDuplicateKeyNode: this.visitOnDuplicateKey.bind(this),
      CreateIndexNode: this.visitCreateIndex.bind(this),
      DropIndexNode: this.visitDropIndex.bind(this),
      ListNode: this.visitList.bind(this),
      PrimaryKeyConstraintNode: this.visitPrimaryKeyConstraint.bind(this),
      UniqueConstraintNode: this.visitUniqueConstraint.bind(this),
      ReferencesNode: this.visitReferences.bind(this),
      CheckConstraintNode: this.visitCheckConstraint.bind(this),
      WithNode: this.visitWith.bind(this),
      CommonTableExpressionNode: this.visitCommonTableExpression.bind(this),
      CommonTableExpressionNameNode: this.visitCommonTableExpressionName.bind(this),
      HavingNode: this.visitHaving.bind(this),
      CreateSchemaNode: this.visitCreateSchema.bind(this),
      DropSchemaNode: this.visitDropSchema.bind(this),
      AlterTableNode: this.visitAlterTable.bind(this),
      DropColumnNode: this.visitDropColumn.bind(this),
      RenameColumnNode: this.visitRenameColumn.bind(this),
      AlterColumnNode: this.visitAlterColumn.bind(this),
      ModifyColumnNode: this.visitModifyColumn.bind(this),
      AddConstraintNode: this.visitAddConstraint.bind(this),
      DropConstraintNode: this.visitDropConstraint.bind(this),
      RenameConstraintNode: this.visitRenameConstraint.bind(this),
      ForeignKeyConstraintNode: this.visitForeignKeyConstraint.bind(this),
      CreateViewNode: this.visitCreateView.bind(this),
      RefreshMaterializedViewNode: this.visitRefreshMaterializedView.bind(this),
      DropViewNode: this.visitDropView.bind(this),
      GeneratedNode: this.visitGenerated.bind(this),
      DefaultValueNode: this.visitDefaultValue.bind(this),
      OnNode: this.visitOn.bind(this),
      ValuesNode: this.visitValues.bind(this),
      SelectModifierNode: this.visitSelectModifier.bind(this),
      CreateTypeNode: this.visitCreateType.bind(this),
      DropTypeNode: this.visitDropType.bind(this),
      ExplainNode: this.visitExplain.bind(this),
      DefaultInsertValueNode: this.visitDefaultInsertValue.bind(this),
      AggregateFunctionNode: this.visitAggregateFunction.bind(this),
      OverNode: this.visitOver.bind(this),
      PartitionByNode: this.visitPartitionBy.bind(this),
      PartitionByItemNode: this.visitPartitionByItem.bind(this),
      SetOperationNode: this.visitSetOperation.bind(this),
      BinaryOperationNode: this.visitBinaryOperation.bind(this),
      UnaryOperationNode: this.visitUnaryOperation.bind(this),
      UsingNode: this.visitUsing.bind(this),
      FunctionNode: this.visitFunction.bind(this),
      CaseNode: this.visitCase.bind(this),
      WhenNode: this.visitWhen.bind(this),
      JSONReferenceNode: this.visitJSONReference.bind(this),
      JSONPathNode: this.visitJSONPath.bind(this),
      JSONPathLegNode: this.visitJSONPathLeg.bind(this),
      JSONOperatorChainNode: this.visitJSONOperatorChain.bind(this),
      TupleNode: this.visitTuple.bind(this),
      MergeQueryNode: this.visitMergeQuery.bind(this),
      MatchedNode: this.visitMatched.bind(this),
      AddIndexNode: this.visitAddIndex.bind(this),
      CastNode: this.visitCast.bind(this),
      FetchNode: this.visitFetch.bind(this),
      TopNode: this.visitTop.bind(this),
      OutputNode: this.visitOutput.bind(this),
      OrActionNode: this.visitOrAction.bind(this),
      CollateNode: this.visitCollate.bind(this)
    }));
    __publicField(this, "visitNode", (node) => {
      this.nodeStack.push(node);
      __privateGet(this, _visitors)[node.kind](node);
      this.nodeStack.pop();
    });
  }
  get parentNode() {
    return this.nodeStack[this.nodeStack.length - 2];
  }
};
_visitors = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-compiler/default-query-compiler.js
var LIT_WRAP_REGEX = /'/g;
var _sql, _parameters;
var DefaultQueryCompiler = class extends OperationNodeVisitor {
  constructor() {
    super(...arguments);
    __privateAdd(this, _sql, "");
    __privateAdd(this, _parameters, []);
  }
  get numParameters() {
    return __privateGet(this, _parameters).length;
  }
  compileQuery(node, queryId) {
    __privateSet(this, _sql, "");
    __privateSet(this, _parameters, []);
    this.nodeStack.splice(0, this.nodeStack.length);
    this.visitNode(node);
    return freeze({
      query: node,
      queryId,
      sql: this.getSql(),
      parameters: [...__privateGet(this, _parameters)]
    });
  }
  getSql() {
    return __privateGet(this, _sql);
  }
  visitSelectQuery(node) {
    var _a, _b;
    const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !InsertQueryNode.is(this.parentNode) && !CreateTableNode.is(this.parentNode) && !CreateViewNode.is(this.parentNode) && !SetOperationNode.is(this.parentNode);
    if (this.parentNode === void 0 && node.explain) {
      this.visitNode(node.explain);
      this.append(" ");
    }
    if (wrapInParens) {
      this.append("(");
    }
    if (node.with) {
      this.visitNode(node.with);
      this.append(" ");
    }
    this.append("select");
    if (node.distinctOn) {
      this.append(" ");
      this.compileDistinctOn(node.distinctOn);
    }
    if ((_a = node.frontModifiers) == null ? void 0 : _a.length) {
      this.append(" ");
      this.compileList(node.frontModifiers, " ");
    }
    if (node.top) {
      this.append(" ");
      this.visitNode(node.top);
    }
    if (node.selections) {
      this.append(" ");
      this.compileList(node.selections);
    }
    if (node.from) {
      this.append(" ");
      this.visitNode(node.from);
    }
    if (node.joins) {
      this.append(" ");
      this.compileList(node.joins, " ");
    }
    if (node.where) {
      this.append(" ");
      this.visitNode(node.where);
    }
    if (node.groupBy) {
      this.append(" ");
      this.visitNode(node.groupBy);
    }
    if (node.having) {
      this.append(" ");
      this.visitNode(node.having);
    }
    if (node.setOperations) {
      this.append(" ");
      this.compileList(node.setOperations, " ");
    }
    if (node.orderBy) {
      this.append(" ");
      this.visitNode(node.orderBy);
    }
    if (node.limit) {
      this.append(" ");
      this.visitNode(node.limit);
    }
    if (node.offset) {
      this.append(" ");
      this.visitNode(node.offset);
    }
    if (node.fetch) {
      this.append(" ");
      this.visitNode(node.fetch);
    }
    if ((_b = node.endModifiers) == null ? void 0 : _b.length) {
      this.append(" ");
      this.compileList(this.sortSelectModifiers([...node.endModifiers]), " ");
    }
    if (wrapInParens) {
      this.append(")");
    }
  }
  visitFrom(node) {
    this.append("from ");
    this.compileList(node.froms);
  }
  visitSelection(node) {
    this.visitNode(node.selection);
  }
  visitColumn(node) {
    this.visitNode(node.column);
  }
  compileDistinctOn(expressions) {
    this.append("distinct on (");
    this.compileList(expressions);
    this.append(")");
  }
  compileList(nodes, separator = ", ") {
    const lastIndex = nodes.length - 1;
    for (let i = 0; i <= lastIndex; i++) {
      this.visitNode(nodes[i]);
      if (i < lastIndex) {
        this.append(separator);
      }
    }
  }
  visitWhere(node) {
    this.append("where ");
    this.visitNode(node.where);
  }
  visitHaving(node) {
    this.append("having ");
    this.visitNode(node.having);
  }
  visitInsertQuery(node) {
    var _a;
    const rootQueryNode = this.nodeStack.find(QueryNode.is);
    const isSubQuery = rootQueryNode !== node;
    if (!isSubQuery && node.explain) {
      this.visitNode(node.explain);
      this.append(" ");
    }
    if (isSubQuery && !MergeQueryNode.is(rootQueryNode)) {
      this.append("(");
    }
    if (node.with) {
      this.visitNode(node.with);
      this.append(" ");
    }
    this.append(node.replace ? "replace" : "insert");
    if (node.ignore) {
      logOnce("`InsertQueryNode.ignore` is deprecated. Use `InsertQueryNode.orAction` instead.");
      this.append(" ignore");
    }
    if (node.orAction) {
      this.append(" ");
      this.visitNode(node.orAction);
    }
    if (node.top) {
      this.append(" ");
      this.visitNode(node.top);
    }
    if (node.into) {
      this.append(" into ");
      this.visitNode(node.into);
    }
    if (node.columns) {
      this.append(" (");
      this.compileList(node.columns);
      this.append(")");
    }
    if (node.output) {
      this.append(" ");
      this.visitNode(node.output);
    }
    if (node.values) {
      this.append(" ");
      this.visitNode(node.values);
    }
    if (node.defaultValues) {
      this.append(" ");
      this.append("default values");
    }
    if (node.onConflict) {
      this.append(" ");
      this.visitNode(node.onConflict);
    }
    if (node.onDuplicateKey) {
      this.append(" ");
      this.visitNode(node.onDuplicateKey);
    }
    if (node.returning) {
      this.append(" ");
      this.visitNode(node.returning);
    }
    if (isSubQuery && !MergeQueryNode.is(rootQueryNode)) {
      this.append(")");
    }
    if ((_a = node.endModifiers) == null ? void 0 : _a.length) {
      this.append(" ");
      this.compileList(node.endModifiers, " ");
    }
  }
  visitValues(node) {
    this.append("values ");
    this.compileList(node.values);
  }
  visitDeleteQuery(node) {
    var _a;
    const isSubQuery = this.nodeStack.find(QueryNode.is) !== node;
    if (!isSubQuery && node.explain) {
      this.visitNode(node.explain);
      this.append(" ");
    }
    if (isSubQuery) {
      this.append("(");
    }
    if (node.with) {
      this.visitNode(node.with);
      this.append(" ");
    }
    this.append("delete ");
    if (node.top) {
      this.visitNode(node.top);
      this.append(" ");
    }
    this.visitNode(node.from);
    if (node.output) {
      this.append(" ");
      this.visitNode(node.output);
    }
    if (node.using) {
      this.append(" ");
      this.visitNode(node.using);
    }
    if (node.joins) {
      this.append(" ");
      this.compileList(node.joins, " ");
    }
    if (node.where) {
      this.append(" ");
      this.visitNode(node.where);
    }
    if (node.orderBy) {
      this.append(" ");
      this.visitNode(node.orderBy);
    }
    if (node.limit) {
      this.append(" ");
      this.visitNode(node.limit);
    }
    if (node.returning) {
      this.append(" ");
      this.visitNode(node.returning);
    }
    if (isSubQuery) {
      this.append(")");
    }
    if ((_a = node.endModifiers) == null ? void 0 : _a.length) {
      this.append(" ");
      this.compileList(node.endModifiers, " ");
    }
  }
  visitReturning(node) {
    this.append("returning ");
    this.compileList(node.selections);
  }
  visitAlias(node) {
    this.visitNode(node.node);
    this.append(" as ");
    this.visitNode(node.alias);
  }
  visitReference(node) {
    if (node.table) {
      this.visitNode(node.table);
      this.append(".");
    }
    this.visitNode(node.column);
  }
  visitSelectAll(_) {
    this.append("*");
  }
  visitIdentifier(node) {
    this.append(this.getLeftIdentifierWrapper());
    this.compileUnwrappedIdentifier(node);
    this.append(this.getRightIdentifierWrapper());
  }
  compileUnwrappedIdentifier(node) {
    if (!isString(node.name)) {
      throw new Error("a non-string identifier was passed to compileUnwrappedIdentifier.");
    }
    this.append(this.sanitizeIdentifier(node.name));
  }
  visitAnd(node) {
    this.visitNode(node.left);
    this.append(" and ");
    this.visitNode(node.right);
  }
  visitOr(node) {
    this.visitNode(node.left);
    this.append(" or ");
    this.visitNode(node.right);
  }
  visitValue(node) {
    if (node.immediate) {
      this.appendImmediateValue(node.value);
    } else {
      this.appendValue(node.value);
    }
  }
  visitValueList(node) {
    this.append("(");
    this.compileList(node.values);
    this.append(")");
  }
  visitTuple(node) {
    this.append("(");
    this.compileList(node.values);
    this.append(")");
  }
  visitPrimitiveValueList(node) {
    this.append("(");
    const { values } = node;
    for (let i = 0; i < values.length; ++i) {
      this.appendValue(values[i]);
      if (i !== values.length - 1) {
        this.append(", ");
      }
    }
    this.append(")");
  }
  visitParens(node) {
    this.append("(");
    this.visitNode(node.node);
    this.append(")");
  }
  visitJoin(node) {
    this.append(JOIN_TYPE_SQL[node.joinType]);
    this.append(" ");
    this.visitNode(node.table);
    if (node.on) {
      this.append(" ");
      this.visitNode(node.on);
    }
  }
  visitOn(node) {
    this.append("on ");
    this.visitNode(node.on);
  }
  visitRaw(node) {
    const { sqlFragments, parameters: params } = node;
    for (let i = 0; i < sqlFragments.length; ++i) {
      this.append(sqlFragments[i]);
      if (params.length > i) {
        this.visitNode(params[i]);
      }
    }
  }
  visitOperator(node) {
    this.append(node.operator);
  }
  visitTable(node) {
    this.visitNode(node.table);
  }
  visitSchemableIdentifier(node) {
    if (node.schema) {
      this.visitNode(node.schema);
      this.append(".");
    }
    this.visitNode(node.identifier);
  }
  visitCreateTable(node) {
    this.append("create ");
    if (node.frontModifiers && node.frontModifiers.length > 0) {
      this.compileList(node.frontModifiers, " ");
      this.append(" ");
    }
    if (node.temporary) {
      this.append("temporary ");
    }
    this.append("table ");
    if (node.ifNotExists) {
      this.append("if not exists ");
    }
    this.visitNode(node.table);
    if (node.selectQuery) {
      this.append(" as ");
      this.visitNode(node.selectQuery);
    } else {
      this.append(" (");
      this.compileList([...node.columns, ...node.constraints ?? []]);
      this.append(")");
      if (node.onCommit) {
        this.append(" on commit ");
        this.append(node.onCommit);
      }
      if (node.endModifiers && node.endModifiers.length > 0) {
        this.append(" ");
        this.compileList(node.endModifiers, " ");
      }
    }
  }
  visitColumnDefinition(node) {
    if (node.ifNotExists) {
      this.append("if not exists ");
    }
    this.visitNode(node.column);
    this.append(" ");
    this.visitNode(node.dataType);
    if (node.unsigned) {
      this.append(" unsigned");
    }
    if (node.frontModifiers && node.frontModifiers.length > 0) {
      this.append(" ");
      this.compileList(node.frontModifiers, " ");
    }
    if (node.generated) {
      this.append(" ");
      this.visitNode(node.generated);
    }
    if (node.identity) {
      this.append(" identity");
    }
    if (node.defaultTo) {
      this.append(" ");
      this.visitNode(node.defaultTo);
    }
    if (node.notNull) {
      this.append(" not null");
    }
    if (node.unique) {
      this.append(" unique");
    }
    if (node.nullsNotDistinct) {
      this.append(" nulls not distinct");
    }
    if (node.primaryKey) {
      this.append(" primary key");
    }
    if (node.autoIncrement) {
      this.append(" ");
      this.append(this.getAutoIncrement());
    }
    if (node.references) {
      this.append(" ");
      this.visitNode(node.references);
    }
    if (node.check) {
      this.append(" ");
      this.visitNode(node.check);
    }
    if (node.endModifiers && node.endModifiers.length > 0) {
      this.append(" ");
      this.compileList(node.endModifiers, " ");
    }
  }
  getAutoIncrement() {
    return "auto_increment";
  }
  visitReferences(node) {
    this.append("references ");
    this.visitNode(node.table);
    this.append(" (");
    this.compileList(node.columns);
    this.append(")");
    if (node.onDelete) {
      this.append(" on delete ");
      this.append(node.onDelete);
    }
    if (node.onUpdate) {
      this.append(" on update ");
      this.append(node.onUpdate);
    }
  }
  visitDropTable(node) {
    this.append("drop table ");
    if (node.ifExists) {
      this.append("if exists ");
    }
    this.visitNode(node.table);
    if (node.cascade) {
      this.append(" cascade");
    }
  }
  visitDataType(node) {
    this.append(node.dataType);
  }
  visitOrderBy(node) {
    this.append("order by ");
    this.compileList(node.items);
  }
  visitOrderByItem(node) {
    this.visitNode(node.orderBy);
    if (node.collation) {
      this.append(" ");
      this.visitNode(node.collation);
    }
    if (node.direction) {
      this.append(" ");
      this.visitNode(node.direction);
    }
    if (node.nulls) {
      this.append(" nulls ");
      this.append(node.nulls);
    }
  }
  visitGroupBy(node) {
    this.append("group by ");
    this.compileList(node.items);
  }
  visitGroupByItem(node) {
    this.visitNode(node.groupBy);
  }
  visitUpdateQuery(node) {
    var _a;
    const rootQueryNode = this.nodeStack.find(QueryNode.is);
    const isSubQuery = rootQueryNode !== node;
    if (!isSubQuery && node.explain) {
      this.visitNode(node.explain);
      this.append(" ");
    }
    if (isSubQuery && !MergeQueryNode.is(rootQueryNode)) {
      this.append("(");
    }
    if (node.with) {
      this.visitNode(node.with);
      this.append(" ");
    }
    this.append("update ");
    if (node.top) {
      this.visitNode(node.top);
      this.append(" ");
    }
    if (node.table) {
      this.visitNode(node.table);
      this.append(" ");
    }
    this.append("set ");
    if (node.updates) {
      this.compileList(node.updates);
    }
    if (node.output) {
      this.append(" ");
      this.visitNode(node.output);
    }
    if (node.from) {
      this.append(" ");
      this.visitNode(node.from);
    }
    if (node.joins) {
      if (!node.from) {
        throw new Error("Joins in an update query are only supported as a part of a PostgreSQL 'update set from join' query. If you want to create a MySQL 'update join set' query, see https://kysely.dev/docs/examples/update/my-sql-joins");
      }
      this.append(" ");
      this.compileList(node.joins, " ");
    }
    if (node.where) {
      this.append(" ");
      this.visitNode(node.where);
    }
    if (node.orderBy) {
      this.append(" ");
      this.visitNode(node.orderBy);
    }
    if (node.limit) {
      this.append(" ");
      this.visitNode(node.limit);
    }
    if (node.returning) {
      this.append(" ");
      this.visitNode(node.returning);
    }
    if (isSubQuery && !MergeQueryNode.is(rootQueryNode)) {
      this.append(")");
    }
    if ((_a = node.endModifiers) == null ? void 0 : _a.length) {
      this.append(" ");
      this.compileList(node.endModifiers, " ");
    }
  }
  visitColumnUpdate(node) {
    this.visitNode(node.column);
    this.append(" = ");
    this.visitNode(node.value);
  }
  visitLimit(node) {
    this.append("limit ");
    this.visitNode(node.limit);
  }
  visitOffset(node) {
    this.append("offset ");
    this.visitNode(node.offset);
  }
  visitOnConflict(node) {
    this.append("on conflict");
    if (node.columns) {
      this.append(" (");
      this.compileList(node.columns);
      this.append(")");
    } else if (node.constraint) {
      this.append(" on constraint ");
      this.visitNode(node.constraint);
    } else if (node.indexExpression) {
      this.append(" (");
      this.visitNode(node.indexExpression);
      this.append(")");
    }
    if (node.indexWhere) {
      this.append(" ");
      this.visitNode(node.indexWhere);
    }
    if (node.doNothing === true) {
      this.append(" do nothing");
    } else if (node.updates) {
      this.append(" do update set ");
      this.compileList(node.updates);
      if (node.updateWhere) {
        this.append(" ");
        this.visitNode(node.updateWhere);
      }
    }
  }
  visitOnDuplicateKey(node) {
    this.append("on duplicate key update ");
    this.compileList(node.updates);
  }
  visitCreateIndex(node) {
    this.append("create ");
    if (node.unique) {
      this.append("unique ");
    }
    this.append("index ");
    if (node.ifNotExists) {
      this.append("if not exists ");
    }
    this.visitNode(node.name);
    if (node.table) {
      this.append(" on ");
      this.visitNode(node.table);
    }
    if (node.using) {
      this.append(" using ");
      this.visitNode(node.using);
    }
    if (node.columns) {
      this.append(" (");
      this.compileList(node.columns);
      this.append(")");
    }
    if (node.nullsNotDistinct) {
      this.append(" nulls not distinct");
    }
    if (node.where) {
      this.append(" ");
      this.visitNode(node.where);
    }
  }
  visitDropIndex(node) {
    this.append("drop index ");
    if (node.ifExists) {
      this.append("if exists ");
    }
    this.visitNode(node.name);
    if (node.table) {
      this.append(" on ");
      this.visitNode(node.table);
    }
    if (node.cascade) {
      this.append(" cascade");
    }
  }
  visitCreateSchema(node) {
    this.append("create schema ");
    if (node.ifNotExists) {
      this.append("if not exists ");
    }
    this.visitNode(node.schema);
  }
  visitDropSchema(node) {
    this.append("drop schema ");
    if (node.ifExists) {
      this.append("if exists ");
    }
    this.visitNode(node.schema);
    if (node.cascade) {
      this.append(" cascade");
    }
  }
  visitPrimaryKeyConstraint(node) {
    if (node.name) {
      this.append("constraint ");
      this.visitNode(node.name);
      this.append(" ");
    }
    this.append("primary key (");
    this.compileList(node.columns);
    this.append(")");
    this.buildDeferrable(node);
  }
  buildDeferrable(node) {
    if (node.deferrable !== void 0) {
      if (node.deferrable) {
        this.append(" deferrable");
      } else {
        this.append(" not deferrable");
      }
    }
    if (node.initiallyDeferred !== void 0) {
      if (node.initiallyDeferred) {
        this.append(" initially deferred");
      } else {
        this.append(" initially immediate");
      }
    }
  }
  visitUniqueConstraint(node) {
    if (node.name) {
      this.append("constraint ");
      this.visitNode(node.name);
      this.append(" ");
    }
    this.append("unique");
    if (node.nullsNotDistinct) {
      this.append(" nulls not distinct");
    }
    this.append(" (");
    this.compileList(node.columns);
    this.append(")");
    this.buildDeferrable(node);
  }
  visitCheckConstraint(node) {
    if (node.name) {
      this.append("constraint ");
      this.visitNode(node.name);
      this.append(" ");
    }
    this.append("check (");
    this.visitNode(node.expression);
    this.append(")");
  }
  visitForeignKeyConstraint(node) {
    if (node.name) {
      this.append("constraint ");
      this.visitNode(node.name);
      this.append(" ");
    }
    this.append("foreign key (");
    this.compileList(node.columns);
    this.append(") ");
    this.visitNode(node.references);
    if (node.onDelete) {
      this.append(" on delete ");
      this.append(node.onDelete);
    }
    if (node.onUpdate) {
      this.append(" on update ");
      this.append(node.onUpdate);
    }
    this.buildDeferrable(node);
  }
  visitList(node) {
    this.compileList(node.items);
  }
  visitWith(node) {
    this.append("with ");
    if (node.recursive) {
      this.append("recursive ");
    }
    this.compileList(node.expressions);
  }
  visitCommonTableExpression(node) {
    this.visitNode(node.name);
    this.append(" as ");
    if (isBoolean(node.materialized)) {
      if (!node.materialized) {
        this.append("not ");
      }
      this.append("materialized ");
    }
    this.visitNode(node.expression);
  }
  visitCommonTableExpressionName(node) {
    this.visitNode(node.table);
    if (node.columns) {
      this.append("(");
      this.compileList(node.columns);
      this.append(")");
    }
  }
  visitAlterTable(node) {
    this.append("alter table ");
    this.visitNode(node.table);
    this.append(" ");
    if (node.renameTo) {
      this.append("rename to ");
      this.visitNode(node.renameTo);
    }
    if (node.setSchema) {
      this.append("set schema ");
      this.visitNode(node.setSchema);
    }
    if (node.addConstraint) {
      this.visitNode(node.addConstraint);
    }
    if (node.dropConstraint) {
      this.visitNode(node.dropConstraint);
    }
    if (node.renameConstraint) {
      this.visitNode(node.renameConstraint);
    }
    if (node.columnAlterations) {
      this.compileColumnAlterations(node.columnAlterations);
    }
    if (node.addIndex) {
      this.visitNode(node.addIndex);
    }
    if (node.dropIndex) {
      this.visitNode(node.dropIndex);
    }
  }
  visitAddColumn(node) {
    this.append("add column ");
    this.visitNode(node.column);
  }
  visitRenameColumn(node) {
    this.append("rename column ");
    this.visitNode(node.column);
    this.append(" to ");
    this.visitNode(node.renameTo);
  }
  visitDropColumn(node) {
    this.append("drop column ");
    this.visitNode(node.column);
  }
  visitAlterColumn(node) {
    this.append("alter column ");
    this.visitNode(node.column);
    this.append(" ");
    if (node.dataType) {
      if (this.announcesNewColumnDataType()) {
        this.append("type ");
      }
      this.visitNode(node.dataType);
      if (node.dataTypeExpression) {
        this.append("using ");
        this.visitNode(node.dataTypeExpression);
      }
    }
    if (node.setDefault) {
      this.append("set default ");
      this.visitNode(node.setDefault);
    }
    if (node.dropDefault) {
      this.append("drop default");
    }
    if (node.setNotNull) {
      this.append("set not null");
    }
    if (node.dropNotNull) {
      this.append("drop not null");
    }
  }
  visitModifyColumn(node) {
    this.append("modify column ");
    this.visitNode(node.column);
  }
  visitAddConstraint(node) {
    this.append("add ");
    this.visitNode(node.constraint);
  }
  visitDropConstraint(node) {
    this.append("drop constraint ");
    if (node.ifExists) {
      this.append("if exists ");
    }
    this.visitNode(node.constraintName);
    if (node.modifier === "cascade") {
      this.append(" cascade");
    } else if (node.modifier === "restrict") {
      this.append(" restrict");
    }
  }
  visitRenameConstraint(node) {
    this.append("rename constraint ");
    this.visitNode(node.oldName);
    this.append(" to ");
    this.visitNode(node.newName);
  }
  visitSetOperation(node) {
    this.append(node.operator);
    this.append(" ");
    if (node.all) {
      this.append("all ");
    }
    this.visitNode(node.expression);
  }
  visitCreateView(node) {
    this.append("create ");
    if (node.orReplace) {
      this.append("or replace ");
    }
    if (node.materialized) {
      this.append("materialized ");
    }
    if (node.temporary) {
      this.append("temporary ");
    }
    this.append("view ");
    if (node.ifNotExists) {
      this.append("if not exists ");
    }
    this.visitNode(node.name);
    this.append(" ");
    if (node.columns) {
      this.append("(");
      this.compileList(node.columns);
      this.append(") ");
    }
    if (node.as) {
      this.append("as ");
      this.visitNode(node.as);
    }
  }
  visitRefreshMaterializedView(node) {
    this.append("refresh materialized view ");
    if (node.concurrently) {
      this.append("concurrently ");
    }
    this.visitNode(node.name);
    if (node.withNoData) {
      this.append(" with no data");
    } else {
      this.append(" with data");
    }
  }
  visitDropView(node) {
    this.append("drop ");
    if (node.materialized) {
      this.append("materialized ");
    }
    this.append("view ");
    if (node.ifExists) {
      this.append("if exists ");
    }
    this.visitNode(node.name);
    if (node.cascade) {
      this.append(" cascade");
    }
  }
  visitGenerated(node) {
    this.append("generated ");
    if (node.always) {
      this.append("always ");
    }
    if (node.byDefault) {
      this.append("by default ");
    }
    this.append("as ");
    if (node.identity) {
      this.append("identity");
    }
    if (node.expression) {
      this.append("(");
      this.visitNode(node.expression);
      this.append(")");
    }
    if (node.stored) {
      this.append(" stored");
    }
  }
  visitDefaultValue(node) {
    this.append("default ");
    this.visitNode(node.defaultValue);
  }
  visitSelectModifier(node) {
    if (node.rawModifier) {
      this.visitNode(node.rawModifier);
    } else {
      this.append(SELECT_MODIFIER_SQL[node.modifier]);
    }
    if (node.of) {
      this.append(" of ");
      this.compileList(node.of, ", ");
    }
  }
  visitCreateType(node) {
    this.append("create type ");
    this.visitNode(node.name);
    if (node.enum) {
      this.append(" as enum ");
      this.visitNode(node.enum);
    }
  }
  visitDropType(node) {
    this.append("drop type ");
    if (node.ifExists) {
      this.append("if exists ");
    }
    this.visitNode(node.name);
  }
  visitExplain(node) {
    this.append("explain");
    if (node.options || node.format) {
      this.append(" ");
      this.append(this.getLeftExplainOptionsWrapper());
      if (node.options) {
        this.visitNode(node.options);
        if (node.format) {
          this.append(this.getExplainOptionsDelimiter());
        }
      }
      if (node.format) {
        this.append("format");
        this.append(this.getExplainOptionAssignment());
        this.append(node.format);
      }
      this.append(this.getRightExplainOptionsWrapper());
    }
  }
  visitDefaultInsertValue(_) {
    this.append("default");
  }
  visitAggregateFunction(node) {
    this.append(node.func);
    this.append("(");
    if (node.distinct) {
      this.append("distinct ");
    }
    this.compileList(node.aggregated);
    if (node.orderBy) {
      this.append(" ");
      this.visitNode(node.orderBy);
    }
    this.append(")");
    if (node.withinGroup) {
      this.append(" within group (");
      this.visitNode(node.withinGroup);
      this.append(")");
    }
    if (node.filter) {
      this.append(" filter(");
      this.visitNode(node.filter);
      this.append(")");
    }
    if (node.over) {
      this.append(" ");
      this.visitNode(node.over);
    }
  }
  visitOver(node) {
    this.append("over(");
    if (node.partitionBy) {
      this.visitNode(node.partitionBy);
      if (node.orderBy) {
        this.append(" ");
      }
    }
    if (node.orderBy) {
      this.visitNode(node.orderBy);
    }
    this.append(")");
  }
  visitPartitionBy(node) {
    this.append("partition by ");
    this.compileList(node.items);
  }
  visitPartitionByItem(node) {
    this.visitNode(node.partitionBy);
  }
  visitBinaryOperation(node) {
    this.visitNode(node.leftOperand);
    this.append(" ");
    this.visitNode(node.operator);
    this.append(" ");
    this.visitNode(node.rightOperand);
  }
  visitUnaryOperation(node) {
    this.visitNode(node.operator);
    if (!this.isMinusOperator(node.operator)) {
      this.append(" ");
    }
    this.visitNode(node.operand);
  }
  isMinusOperator(node) {
    return OperatorNode.is(node) && node.operator === "-";
  }
  visitUsing(node) {
    this.append("using ");
    this.compileList(node.tables);
  }
  visitFunction(node) {
    this.append(node.func);
    this.append("(");
    this.compileList(node.arguments);
    this.append(")");
  }
  visitCase(node) {
    this.append("case");
    if (node.value) {
      this.append(" ");
      this.visitNode(node.value);
    }
    if (node.when) {
      this.append(" ");
      this.compileList(node.when, " ");
    }
    if (node.else) {
      this.append(" else ");
      this.visitNode(node.else);
    }
    this.append(" end");
    if (node.isStatement) {
      this.append(" case");
    }
  }
  visitWhen(node) {
    this.append("when ");
    this.visitNode(node.condition);
    if (node.result) {
      this.append(" then ");
      this.visitNode(node.result);
    }
  }
  visitJSONReference(node) {
    this.visitNode(node.reference);
    this.visitNode(node.traversal);
  }
  visitJSONPath(node) {
    if (node.inOperator) {
      this.visitNode(node.inOperator);
    }
    this.append("'$");
    for (const pathLeg of node.pathLegs) {
      this.visitNode(pathLeg);
    }
    this.append("'");
  }
  visitJSONPathLeg(node) {
    const isArrayLocation = node.type === "ArrayLocation";
    this.append(isArrayLocation ? "[" : ".");
    this.append(String(node.value));
    if (isArrayLocation) {
      this.append("]");
    }
  }
  visitJSONOperatorChain(node) {
    for (let i = 0, len = node.values.length; i < len; i++) {
      if (i === len - 1) {
        this.visitNode(node.operator);
      } else {
        this.append("->");
      }
      this.visitNode(node.values[i]);
    }
  }
  visitMergeQuery(node) {
    var _a;
    if (node.with) {
      this.visitNode(node.with);
      this.append(" ");
    }
    this.append("merge ");
    if (node.top) {
      this.visitNode(node.top);
      this.append(" ");
    }
    this.append("into ");
    this.visitNode(node.into);
    if (node.using) {
      this.append(" ");
      this.visitNode(node.using);
    }
    if (node.whens) {
      this.append(" ");
      this.compileList(node.whens, " ");
    }
    if (node.returning) {
      this.append(" ");
      this.visitNode(node.returning);
    }
    if (node.output) {
      this.append(" ");
      this.visitNode(node.output);
    }
    if ((_a = node.endModifiers) == null ? void 0 : _a.length) {
      this.append(" ");
      this.compileList(node.endModifiers, " ");
    }
  }
  visitMatched(node) {
    if (node.not) {
      this.append("not ");
    }
    this.append("matched");
    if (node.bySource) {
      this.append(" by source");
    }
  }
  visitAddIndex(node) {
    this.append("add ");
    if (node.unique) {
      this.append("unique ");
    }
    this.append("index ");
    this.visitNode(node.name);
    if (node.columns) {
      this.append(" (");
      this.compileList(node.columns);
      this.append(")");
    }
    if (node.using) {
      this.append(" using ");
      this.visitNode(node.using);
    }
  }
  visitCast(node) {
    this.append("cast(");
    this.visitNode(node.expression);
    this.append(" as ");
    this.visitNode(node.dataType);
    this.append(")");
  }
  visitFetch(node) {
    this.append("fetch next ");
    this.visitNode(node.rowCount);
    this.append(` rows ${node.modifier}`);
  }
  visitOutput(node) {
    this.append("output ");
    this.compileList(node.selections);
  }
  visitTop(node) {
    this.append(`top(${node.expression})`);
    if (node.modifiers) {
      this.append(` ${node.modifiers}`);
    }
  }
  visitOrAction(node) {
    this.append(node.action);
  }
  visitCollate(node) {
    this.append("collate ");
    this.visitNode(node.collation);
  }
  append(str) {
    __privateSet(this, _sql, __privateGet(this, _sql) + str);
  }
  appendValue(parameter) {
    this.addParameter(parameter);
    this.append(this.getCurrentParameterPlaceholder());
  }
  getLeftIdentifierWrapper() {
    return '"';
  }
  getRightIdentifierWrapper() {
    return '"';
  }
  getCurrentParameterPlaceholder() {
    return "$" + this.numParameters;
  }
  getLeftExplainOptionsWrapper() {
    return "(";
  }
  getExplainOptionAssignment() {
    return " ";
  }
  getExplainOptionsDelimiter() {
    return ", ";
  }
  getRightExplainOptionsWrapper() {
    return ")";
  }
  sanitizeIdentifier(identifier) {
    const leftWrap = this.getLeftIdentifierWrapper();
    const rightWrap = this.getRightIdentifierWrapper();
    let sanitized = "";
    for (const c of identifier) {
      sanitized += c;
      if (c === leftWrap) {
        sanitized += leftWrap;
      } else if (c === rightWrap) {
        sanitized += rightWrap;
      }
    }
    return sanitized;
  }
  sanitizeStringLiteral(value) {
    return value.replace(LIT_WRAP_REGEX, "''");
  }
  addParameter(parameter) {
    __privateGet(this, _parameters).push(parameter);
  }
  appendImmediateValue(value) {
    if (isString(value)) {
      this.appendStringLiteral(value);
    } else if (isNumber(value) || isBoolean(value)) {
      this.append(value.toString());
    } else if (isNull(value)) {
      this.append("null");
    } else if (isDate(value)) {
      this.appendImmediateValue(value.toISOString());
    } else if (isBigInt(value)) {
      this.appendImmediateValue(value.toString());
    } else {
      throw new Error(`invalid immediate value ${value}`);
    }
  }
  appendStringLiteral(value) {
    this.append("'");
    this.append(this.sanitizeStringLiteral(value));
    this.append("'");
  }
  sortSelectModifiers(arr) {
    arr.sort((left, right) => left.modifier && right.modifier ? SELECT_MODIFIER_PRIORITY[left.modifier] - SELECT_MODIFIER_PRIORITY[right.modifier] : 1);
    return freeze(arr);
  }
  compileColumnAlterations(columnAlterations) {
    this.compileList(columnAlterations);
  }
  /**
   * controls whether the dialect adds a "type" keyword before a column's new data
   * type in an ALTER TABLE statement.
   */
  announcesNewColumnDataType() {
    return true;
  }
};
_sql = new WeakMap();
_parameters = new WeakMap();
var SELECT_MODIFIER_SQL = freeze({
  ForKeyShare: "for key share",
  ForNoKeyUpdate: "for no key update",
  ForUpdate: "for update",
  ForShare: "for share",
  NoWait: "nowait",
  SkipLocked: "skip locked",
  Distinct: "distinct"
});
var SELECT_MODIFIER_PRIORITY = freeze({
  ForKeyShare: 1,
  ForNoKeyUpdate: 1,
  ForUpdate: 1,
  ForShare: 1,
  NoWait: 2,
  SkipLocked: 2,
  Distinct: 0
});
var JOIN_TYPE_SQL = freeze({
  InnerJoin: "inner join",
  LeftJoin: "left join",
  RightJoin: "right join",
  FullJoin: "full join",
  CrossJoin: "cross join",
  LateralInnerJoin: "inner join lateral",
  LateralLeftJoin: "left join lateral",
  LateralCrossJoin: "cross join lateral",
  OuterApply: "outer apply",
  CrossApply: "cross apply",
  Using: "using"
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/query-compiler/compiled-query.js
var CompiledQuery = freeze({
  raw(sql2, parameters = []) {
    return freeze({
      sql: sql2,
      query: RawNode.createWithSql(sql2),
      parameters: freeze(parameters),
      queryId: createQueryId()
    });
  }
});

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/driver/dummy-driver.js
var DummyDriver = class {
  async init() {
  }
  async acquireConnection() {
    return new DummyConnection();
  }
  async beginTransaction() {
  }
  async commitTransaction() {
  }
  async rollbackTransaction() {
  }
  async releaseConnection() {
  }
  async destroy() {
  }
  async releaseSavepoint() {
  }
  async rollbackToSavepoint() {
  }
  async savepoint() {
  }
};
var DummyConnection = class {
  async executeQuery() {
    return {
      rows: []
    };
  }
  async *streamQuery() {
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/dialect-adapter-base.js
var DialectAdapterBase = class {
  get supportsCreateIfNotExists() {
    return true;
  }
  get supportsTransactionalDdl() {
    return false;
  }
  get supportsReturning() {
    return false;
  }
  get supportsOutput() {
    return false;
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/parser/savepoint-parser.js
function parseSavepointCommand(command, savepointName) {
  return RawNode.createWithChildren([
    RawNode.createWithSql(`${command} `),
    IdentifierNode.create(savepointName)
    // ensures savepointName gets sanitized
  ]);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-driver.js
var _config, _connectionMutex, _db, _connection2;
var SqliteDriver = class {
  constructor(config) {
    __privateAdd(this, _config);
    __privateAdd(this, _connectionMutex, new ConnectionMutex());
    __privateAdd(this, _db);
    __privateAdd(this, _connection2);
    __privateSet(this, _config, freeze({ ...config }));
  }
  async init() {
    __privateSet(this, _db, isFunction(__privateGet(this, _config).database) ? await __privateGet(this, _config).database() : __privateGet(this, _config).database);
    __privateSet(this, _connection2, new SqliteConnection(__privateGet(this, _db)));
    if (__privateGet(this, _config).onCreateConnection) {
      await __privateGet(this, _config).onCreateConnection(__privateGet(this, _connection2));
    }
  }
  async acquireConnection() {
    await __privateGet(this, _connectionMutex).lock();
    return __privateGet(this, _connection2);
  }
  async beginTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }
  async commitTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }
  async savepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
  }
  async rollbackToSavepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
  }
  async releaseSavepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
  }
  async releaseConnection() {
    __privateGet(this, _connectionMutex).unlock();
  }
  async destroy() {
    var _a;
    (_a = __privateGet(this, _db)) == null ? void 0 : _a.close();
  }
};
_config = new WeakMap();
_connectionMutex = new WeakMap();
_db = new WeakMap();
_connection2 = new WeakMap();
var _db2;
var SqliteConnection = class {
  constructor(db) {
    __privateAdd(this, _db2);
    __privateSet(this, _db2, db);
  }
  executeQuery(compiledQuery) {
    const { sql: sql2, parameters } = compiledQuery;
    const stmt = __privateGet(this, _db2).prepare(sql2);
    if (stmt.reader) {
      return Promise.resolve({
        rows: stmt.all(parameters)
      });
    }
    const { changes, lastInsertRowid } = stmt.run(parameters);
    return Promise.resolve({
      numAffectedRows: changes !== void 0 && changes !== null ? BigInt(changes) : void 0,
      insertId: lastInsertRowid !== void 0 && lastInsertRowid !== null ? BigInt(lastInsertRowid) : void 0,
      rows: []
    });
  }
  async *streamQuery(compiledQuery, _chunkSize) {
    const { sql: sql2, parameters, query } = compiledQuery;
    const stmt = __privateGet(this, _db2).prepare(sql2);
    if (SelectQueryNode.is(query)) {
      const iter = stmt.iterate(parameters);
      for (const row of iter) {
        yield {
          rows: [row]
        };
      }
    } else {
      throw new Error("Sqlite driver only supports streaming of select queries");
    }
  }
};
_db2 = new WeakMap();
var _promise2, _resolve2;
var ConnectionMutex = class {
  constructor() {
    __privateAdd(this, _promise2);
    __privateAdd(this, _resolve2);
  }
  async lock() {
    while (__privateGet(this, _promise2)) {
      await __privateGet(this, _promise2);
    }
    __privateSet(this, _promise2, new Promise((resolve) => {
      __privateSet(this, _resolve2, resolve);
    }));
  }
  unlock() {
    const resolve = __privateGet(this, _resolve2);
    __privateSet(this, _promise2, void 0);
    __privateSet(this, _resolve2, void 0);
    resolve == null ? void 0 : resolve();
  }
};
_promise2 = new WeakMap();
_resolve2 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-query-compiler.js
var ID_WRAP_REGEX = /"/g;
var SqliteQueryCompiler = class extends DefaultQueryCompiler {
  visitOrAction(node) {
    this.append("or ");
    this.append(node.action);
  }
  getCurrentParameterPlaceholder() {
    return "?";
  }
  getLeftExplainOptionsWrapper() {
    return "";
  }
  getRightExplainOptionsWrapper() {
    return "";
  }
  getLeftIdentifierWrapper() {
    return '"';
  }
  getRightIdentifierWrapper() {
    return '"';
  }
  getAutoIncrement() {
    return "autoincrement";
  }
  sanitizeIdentifier(identifier) {
    return identifier.replace(ID_WRAP_REGEX, '""');
  }
  visitDefaultInsertValue(_) {
    this.append("null");
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/noop-plugin.js
var NoopPlugin = class {
  transformQuery(args) {
    return args.node;
  }
  async transformResult(args) {
    return args.result;
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/migration/migrator.js
var DEFAULT_MIGRATION_TABLE = "kysely_migration";
var DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
var DEFAULT_ALLOW_UNORDERED_MIGRATIONS = false;
var MIGRATION_LOCK_ID = "migration_lock";
var NO_MIGRATIONS = freeze({ __noMigrations__: true });
var _props46, _Migrator_instances, migrate_fn, migrationTableSchema_get, migrationTable_get, migrationLockTable_get, allowUnorderedMigrations_get, schemaPlugin_get, ensureMigrationTablesExists_fn, ensureMigrationTableSchemaExists_fn, ensureMigrationTableExists_fn, ensureMigrationLockTableExists_fn, ensureLockRowExists_fn, doesSchemaExists_fn, doesTableExists_fn, doesLockRowExists_fn, runMigrations_fn, getState_fn, getPendingMigrations_fn, resolveMigrations_fn, getExecutedMigrations_fn, ensureNoMissingMigrations_fn, ensureMigrationsInOrder_fn, migrateDown_fn, migrateUp_fn, createIfNotExists_fn;
var Migrator = class {
  constructor(props) {
    __privateAdd(this, _Migrator_instances);
    __privateAdd(this, _props46);
    __privateSet(this, _props46, freeze(props));
  }
  /**
   * Returns a {@link MigrationInfo} object for each migration.
   *
   * The returned array is sorted by migration name.
   */
  async getMigrations() {
    const executedMigrations = await __privateMethod(this, _Migrator_instances, doesTableExists_fn).call(this, __privateGet(this, _Migrator_instances, migrationTable_get)) ? await __privateGet(this, _props46).db.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).selectFrom(__privateGet(this, _Migrator_instances, migrationTable_get)).select(["name", "timestamp"]).$narrowType().execute() : [];
    const migrations = await __privateMethod(this, _Migrator_instances, resolveMigrations_fn).call(this);
    return migrations.map(({ name, ...migration }) => {
      const executed = executedMigrations.find((it) => it.name === name);
      return {
        name,
        migration,
        executedAt: executed ? new Date(executed.timestamp) : void 0
      };
    });
  }
  /**
   * Runs all migrations that have not yet been run.
   *
   * This method returns a {@link MigrationResultSet} instance and _never_ throws.
   * {@link MigrationResultSet.error} holds the error if something went wrong.
   * {@link MigrationResultSet.results} contains information about which migrations
   * were executed and which failed. See the examples below.
   *
   * This method goes through all possible migrations provided by the provider and runs the
   * ones whose names come alphabetically after the last migration that has been run. If the
   * list of executed migrations doesn't match the beginning of the list of possible migrations
   * an error is returned.
   *
   * ### Examples
   *
   * ```ts
   * import { promises as fs } from 'node:fs'
   * import path from 'node:path'
   * import * as Sqlite from 'better-sqlite3'
   * import { FileMigrationProvider, Migrator } from 'kysely'
   *
   * const migrator = new Migrator({
   *   db,
   *   provider: new FileMigrationProvider({
   *     fs,
   *     migrationFolder: 'some/path/to/migrations',
   *     path,
   *   })
   * })
   *
   * const { error, results } = await migrator.migrateToLatest()
   *
   * results?.forEach((it) => {
   *   if (it.status === 'Success') {
   *     console.log(`migration "${it.migrationName}" was executed successfully`)
   *   } else if (it.status === 'Error') {
   *     console.error(`failed to execute migration "${it.migrationName}"`)
   *   }
   * })
   *
   * if (error) {
   *   console.error('failed to run `migrateToLatest`')
   *   console.error(error)
   * }
   * ```
   */
  async migrateToLatest() {
    return __privateMethod(this, _Migrator_instances, migrate_fn).call(this, () => ({ direction: "Up", step: Infinity }));
  }
  /**
   * Migrate up/down to a specific migration.
   *
   * This method returns a {@link MigrationResultSet} instance and _never_ throws.
   * {@link MigrationResultSet.error} holds the error if something went wrong.
   * {@link MigrationResultSet.results} contains information about which migrations
   * were executed and which failed.
   *
   * ### Examples
   *
   * ```ts
   * import { promises as fs } from 'node:fs'
   * import path from 'node:path'
   * import { FileMigrationProvider, Migrator } from 'kysely'
   *
   * const migrator = new Migrator({
   *   db,
   *   provider: new FileMigrationProvider({
   *     fs,
   *     // Path to the folder that contains all your migrations.
   *     migrationFolder: 'some/path/to/migrations',
   *     path,
   *   })
   * })
   *
   * await migrator.migrateTo('some_migration')
   * ```
   *
   * If you specify the name of the first migration, this method migrates
   * down to the first migration, but doesn't run the `down` method of
   * the first migration. In case you want to migrate all the way down,
   * you can use a special constant `NO_MIGRATIONS`:
   *
   * ```ts
   * import { promises as fs } from 'node:fs'
   * import path from 'node:path'
   * import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from 'kysely'
   *
   * const migrator = new Migrator({
   *   db,
   *   provider: new FileMigrationProvider({
   *     fs,
   *     // Path to the folder that contains all your migrations.
   *     migrationFolder: 'some/path/to/migrations',
   *     path,
   *   })
   * })
   *
   * await migrator.migrateTo(NO_MIGRATIONS)
   * ```
   */
  async migrateTo(targetMigrationName) {
    return __privateMethod(this, _Migrator_instances, migrate_fn).call(this, ({ migrations, executedMigrations, pendingMigrations }) => {
      if (targetMigrationName === NO_MIGRATIONS) {
        return { direction: "Down", step: Infinity };
      }
      if (!migrations.find((m) => m.name === targetMigrationName)) {
        throw new Error(`migration "${targetMigrationName}" doesn't exist`);
      }
      const executedIndex = executedMigrations.indexOf(targetMigrationName);
      const pendingIndex = pendingMigrations.findIndex((m) => m.name === targetMigrationName);
      if (executedIndex !== -1) {
        return {
          direction: "Down",
          step: executedMigrations.length - executedIndex - 1
        };
      } else if (pendingIndex !== -1) {
        return { direction: "Up", step: pendingIndex + 1 };
      } else {
        throw new Error(`migration "${targetMigrationName}" isn't executed or pending`);
      }
    });
  }
  /**
   * Migrate one step up.
   *
   * This method returns a {@link MigrationResultSet} instance and _never_ throws.
   * {@link MigrationResultSet.error} holds the error if something went wrong.
   * {@link MigrationResultSet.results} contains information about which migrations
   * were executed and which failed.
   *
   * ### Examples
   *
   * ```ts
   * import { promises as fs } from 'node:fs'
   * import path from 'node:path'
   * import { FileMigrationProvider, Migrator } from 'kysely'
   *
   * const migrator = new Migrator({
   *   db,
   *   provider: new FileMigrationProvider({
   *     fs,
   *     // Path to the folder that contains all your migrations.
   *     migrationFolder: 'some/path/to/migrations',
   *     path,
   *   })
   * })
   *
   * await migrator.migrateUp()
   * ```
   */
  async migrateUp() {
    return __privateMethod(this, _Migrator_instances, migrate_fn).call(this, () => ({ direction: "Up", step: 1 }));
  }
  /**
   * Migrate one step down.
   *
   * This method returns a {@link MigrationResultSet} instance and _never_ throws.
   * {@link MigrationResultSet.error} holds the error if something went wrong.
   * {@link MigrationResultSet.results} contains information about which migrations
   * were executed and which failed.
   *
   * ### Examples
   *
   * ```ts
   * import { promises as fs } from 'node:fs'
   * import path from 'node:path'
   * import { FileMigrationProvider, Migrator } from 'kysely'
   *
   * const migrator = new Migrator({
   *   db,
   *   provider: new FileMigrationProvider({
   *     fs,
   *     // Path to the folder that contains all your migrations.
   *     migrationFolder: 'some/path/to/migrations',
   *     path,
   *   })
   * })
   *
   * await migrator.migrateDown()
   * ```
   */
  async migrateDown() {
    return __privateMethod(this, _Migrator_instances, migrate_fn).call(this, () => ({ direction: "Down", step: 1 }));
  }
};
_props46 = new WeakMap();
_Migrator_instances = new WeakSet();
migrate_fn = async function(getMigrationDirectionAndStep) {
  try {
    await __privateMethod(this, _Migrator_instances, ensureMigrationTablesExists_fn).call(this);
    return await __privateMethod(this, _Migrator_instances, runMigrations_fn).call(this, getMigrationDirectionAndStep);
  } catch (error) {
    if (error instanceof MigrationResultSetError) {
      return error.resultSet;
    }
    return { error };
  }
};
migrationTableSchema_get = function() {
  return __privateGet(this, _props46).migrationTableSchema;
};
migrationTable_get = function() {
  return __privateGet(this, _props46).migrationTableName ?? DEFAULT_MIGRATION_TABLE;
};
migrationLockTable_get = function() {
  return __privateGet(this, _props46).migrationLockTableName ?? DEFAULT_MIGRATION_LOCK_TABLE;
};
allowUnorderedMigrations_get = function() {
  return __privateGet(this, _props46).allowUnorderedMigrations ?? DEFAULT_ALLOW_UNORDERED_MIGRATIONS;
};
schemaPlugin_get = function() {
  if (__privateGet(this, _Migrator_instances, migrationTableSchema_get)) {
    return new WithSchemaPlugin(__privateGet(this, _Migrator_instances, migrationTableSchema_get));
  }
  return new NoopPlugin();
};
ensureMigrationTablesExists_fn = async function() {
  await __privateMethod(this, _Migrator_instances, ensureMigrationTableSchemaExists_fn).call(this);
  await __privateMethod(this, _Migrator_instances, ensureMigrationTableExists_fn).call(this);
  await __privateMethod(this, _Migrator_instances, ensureMigrationLockTableExists_fn).call(this);
  await __privateMethod(this, _Migrator_instances, ensureLockRowExists_fn).call(this);
};
ensureMigrationTableSchemaExists_fn = async function() {
  if (!__privateGet(this, _Migrator_instances, migrationTableSchema_get)) {
    return;
  }
  if (!await __privateMethod(this, _Migrator_instances, doesSchemaExists_fn).call(this)) {
    try {
      await __privateMethod(this, _Migrator_instances, createIfNotExists_fn).call(this, __privateGet(this, _props46).db.schema.createSchema(__privateGet(this, _Migrator_instances, migrationTableSchema_get)));
    } catch (error) {
      if (!await __privateMethod(this, _Migrator_instances, doesSchemaExists_fn).call(this)) {
        throw error;
      }
    }
  }
};
ensureMigrationTableExists_fn = async function() {
  if (!await __privateMethod(this, _Migrator_instances, doesTableExists_fn).call(this, __privateGet(this, _Migrator_instances, migrationTable_get))) {
    try {
      if (__privateGet(this, _Migrator_instances, migrationTableSchema_get)) {
        await __privateMethod(this, _Migrator_instances, createIfNotExists_fn).call(this, __privateGet(this, _props46).db.schema.createSchema(__privateGet(this, _Migrator_instances, migrationTableSchema_get)));
      }
      await __privateMethod(this, _Migrator_instances, createIfNotExists_fn).call(this, __privateGet(this, _props46).db.schema.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).createTable(__privateGet(this, _Migrator_instances, migrationTable_get)).addColumn("name", "varchar(255)", (col) => col.notNull().primaryKey()).addColumn("timestamp", "varchar(255)", (col) => col.notNull()));
    } catch (error) {
      if (!await __privateMethod(this, _Migrator_instances, doesTableExists_fn).call(this, __privateGet(this, _Migrator_instances, migrationTable_get))) {
        throw error;
      }
    }
  }
};
ensureMigrationLockTableExists_fn = async function() {
  if (!await __privateMethod(this, _Migrator_instances, doesTableExists_fn).call(this, __privateGet(this, _Migrator_instances, migrationLockTable_get))) {
    try {
      await __privateMethod(this, _Migrator_instances, createIfNotExists_fn).call(this, __privateGet(this, _props46).db.schema.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).createTable(__privateGet(this, _Migrator_instances, migrationLockTable_get)).addColumn("id", "varchar(255)", (col) => col.notNull().primaryKey()).addColumn("is_locked", "integer", (col) => col.notNull().defaultTo(0)));
    } catch (error) {
      if (!await __privateMethod(this, _Migrator_instances, doesTableExists_fn).call(this, __privateGet(this, _Migrator_instances, migrationLockTable_get))) {
        throw error;
      }
    }
  }
};
ensureLockRowExists_fn = async function() {
  if (!await __privateMethod(this, _Migrator_instances, doesLockRowExists_fn).call(this)) {
    try {
      await __privateGet(this, _props46).db.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).insertInto(__privateGet(this, _Migrator_instances, migrationLockTable_get)).values({ id: MIGRATION_LOCK_ID, is_locked: 0 }).execute();
    } catch (error) {
      if (!await __privateMethod(this, _Migrator_instances, doesLockRowExists_fn).call(this)) {
        throw error;
      }
    }
  }
};
doesSchemaExists_fn = async function() {
  const schemas = await __privateGet(this, _props46).db.introspection.getSchemas();
  return schemas.some((it) => it.name === __privateGet(this, _Migrator_instances, migrationTableSchema_get));
};
doesTableExists_fn = async function(tableName) {
  const schema = __privateGet(this, _Migrator_instances, migrationTableSchema_get);
  const tables = await __privateGet(this, _props46).db.introspection.getTables({
    withInternalKyselyTables: true
  });
  return tables.some((it) => it.name === tableName && (!schema || it.schema === schema));
};
doesLockRowExists_fn = async function() {
  const lockRow = await __privateGet(this, _props46).db.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).selectFrom(__privateGet(this, _Migrator_instances, migrationLockTable_get)).where("id", "=", MIGRATION_LOCK_ID).select("id").executeTakeFirst();
  return !!lockRow;
};
runMigrations_fn = async function(getMigrationDirectionAndStep) {
  const adapter = __privateGet(this, _props46).db.getExecutor().adapter;
  const lockOptions = freeze({
    lockTable: __privateGet(this, _props46).migrationLockTableName ?? DEFAULT_MIGRATION_LOCK_TABLE,
    lockRowId: MIGRATION_LOCK_ID,
    lockTableSchema: __privateGet(this, _props46).migrationTableSchema
  });
  const run = async (db) => {
    try {
      await adapter.acquireMigrationLock(db, lockOptions);
      const state = await __privateMethod(this, _Migrator_instances, getState_fn).call(this, db);
      if (state.migrations.length === 0) {
        return { results: [] };
      }
      const { direction, step } = getMigrationDirectionAndStep(state);
      if (step <= 0) {
        return { results: [] };
      }
      if (direction === "Down") {
        return await __privateMethod(this, _Migrator_instances, migrateDown_fn).call(this, db, state, step);
      } else if (direction === "Up") {
        return await __privateMethod(this, _Migrator_instances, migrateUp_fn).call(this, db, state, step);
      }
      return { results: [] };
    } finally {
      await adapter.releaseMigrationLock(db, lockOptions);
    }
  };
  if (adapter.supportsTransactionalDdl && !__privateGet(this, _props46).disableTransactions) {
    return __privateGet(this, _props46).db.transaction().execute(run);
  } else {
    return __privateGet(this, _props46).db.connection().execute(run);
  }
};
getState_fn = async function(db) {
  const migrations = await __privateMethod(this, _Migrator_instances, resolveMigrations_fn).call(this);
  const executedMigrations = await __privateMethod(this, _Migrator_instances, getExecutedMigrations_fn).call(this, db);
  __privateMethod(this, _Migrator_instances, ensureNoMissingMigrations_fn).call(this, migrations, executedMigrations);
  if (!__privateGet(this, _Migrator_instances, allowUnorderedMigrations_get)) {
    __privateMethod(this, _Migrator_instances, ensureMigrationsInOrder_fn).call(this, migrations, executedMigrations);
  }
  const pendingMigrations = __privateMethod(this, _Migrator_instances, getPendingMigrations_fn).call(this, migrations, executedMigrations);
  return freeze({
    migrations,
    executedMigrations,
    lastMigration: getLast(executedMigrations),
    pendingMigrations
  });
};
getPendingMigrations_fn = function(migrations, executedMigrations) {
  return migrations.filter((migration) => {
    return !executedMigrations.includes(migration.name);
  });
};
resolveMigrations_fn = async function() {
  const allMigrations = await __privateGet(this, _props46).provider.getMigrations();
  return Object.keys(allMigrations).sort().map((name) => ({
    ...allMigrations[name],
    name
  }));
};
getExecutedMigrations_fn = async function(db) {
  const executedMigrations = await db.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).selectFrom(__privateGet(this, _Migrator_instances, migrationTable_get)).select(["name", "timestamp"]).$narrowType().execute();
  const nameComparator = __privateGet(this, _props46).nameComparator || ((a, b) => a.localeCompare(b));
  return executedMigrations.sort((a, b) => {
    if (a.timestamp === b.timestamp) {
      return nameComparator(a.name, b.name);
    }
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  }).map((it) => it.name);
};
ensureNoMissingMigrations_fn = function(migrations, executedMigrations) {
  for (const executed of executedMigrations) {
    if (!migrations.some((it) => it.name === executed)) {
      throw new Error(`corrupted migrations: previously executed migration ${executed} is missing`);
    }
  }
};
ensureMigrationsInOrder_fn = function(migrations, executedMigrations) {
  for (let i = 0; i < executedMigrations.length; ++i) {
    if (migrations[i].name !== executedMigrations[i]) {
      throw new Error(`corrupted migrations: expected previously executed migration ${executedMigrations[i]} to be at index ${i} but ${migrations[i].name} was found in its place. New migrations must always have a name that comes alphabetically after the last executed migration.`);
    }
  }
};
migrateDown_fn = async function(db, state, step) {
  const migrationsToRollback = state.executedMigrations.slice().reverse().slice(0, step).map((name) => {
    return state.migrations.find((it) => it.name === name);
  });
  const results = migrationsToRollback.map((migration) => {
    return {
      migrationName: migration.name,
      direction: "Down",
      status: "NotExecuted"
    };
  });
  for (let i = 0; i < results.length; ++i) {
    const migration = migrationsToRollback[i];
    try {
      if (migration.down) {
        await migration.down(db);
        await db.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).deleteFrom(__privateGet(this, _Migrator_instances, migrationTable_get)).where("name", "=", migration.name).execute();
        results[i] = {
          migrationName: migration.name,
          direction: "Down",
          status: "Success"
        };
      }
    } catch (error) {
      results[i] = {
        migrationName: migration.name,
        direction: "Down",
        status: "Error"
      };
      throw new MigrationResultSetError({
        error,
        results
      });
    }
  }
  return { results };
};
migrateUp_fn = async function(db, state, step) {
  const migrationsToRun = state.pendingMigrations.slice(0, step);
  const results = migrationsToRun.map((migration) => {
    return {
      migrationName: migration.name,
      direction: "Up",
      status: "NotExecuted"
    };
  });
  for (let i = 0; i < results.length; i++) {
    const migration = state.pendingMigrations[i];
    try {
      await migration.up(db);
      await db.withPlugin(__privateGet(this, _Migrator_instances, schemaPlugin_get)).insertInto(__privateGet(this, _Migrator_instances, migrationTable_get)).values({
        name: migration.name,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }).execute();
      results[i] = {
        migrationName: migration.name,
        direction: "Up",
        status: "Success"
      };
    } catch (error) {
      results[i] = {
        migrationName: migration.name,
        direction: "Up",
        status: "Error"
      };
      throw new MigrationResultSetError({
        error,
        results
      });
    }
  }
  return { results };
};
createIfNotExists_fn = async function(qb) {
  if (__privateGet(this, _props46).db.getExecutor().adapter.supportsCreateIfNotExists) {
    qb = qb.ifNotExists();
  }
  await qb.execute();
};
var _resultSet;
var MigrationResultSetError = class extends Error {
  constructor(result) {
    super();
    __privateAdd(this, _resultSet);
    __privateSet(this, _resultSet, result);
  }
  get resultSet() {
    return __privateGet(this, _resultSet);
  }
};
_resultSet = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-introspector.js
var _db3, _SqliteIntrospector_instances, tablesQuery_fn, getTableMetadata_fn;
var SqliteIntrospector = class {
  constructor(db) {
    __privateAdd(this, _SqliteIntrospector_instances);
    __privateAdd(this, _db3);
    __privateSet(this, _db3, db);
  }
  async getSchemas() {
    return [];
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    return await __privateMethod(this, _SqliteIntrospector_instances, getTableMetadata_fn).call(this, options);
  }
  async getMetadata(options) {
    return {
      tables: await this.getTables(options)
    };
  }
};
_db3 = new WeakMap();
_SqliteIntrospector_instances = new WeakSet();
tablesQuery_fn = function(qb, options) {
  let tablesQuery = qb.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").select(["name", "sql", "type"]).orderBy("name");
  if (!options.withInternalKyselyTables) {
    tablesQuery = tablesQuery.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
  }
  return tablesQuery;
};
getTableMetadata_fn = async function(options) {
  var _a;
  const tablesResult = await __privateMethod(this, _SqliteIntrospector_instances, tablesQuery_fn).call(this, __privateGet(this, _db3), options).execute();
  const tableMetadata = await __privateGet(this, _db3).with("table_list", (qb) => __privateMethod(this, _SqliteIntrospector_instances, tablesQuery_fn).call(this, qb, options)).selectFrom([
    "table_list as tl",
    sql`pragma_table_info(tl.name)`.as("p")
  ]).select([
    "tl.name as table",
    "p.cid",
    "p.name",
    "p.type",
    "p.notnull",
    "p.dflt_value",
    "p.pk"
  ]).orderBy("tl.name").orderBy("p.cid").execute();
  const columnsByTable = {};
  for (const row of tableMetadata) {
    columnsByTable[_a = row.table] ?? (columnsByTable[_a] = []);
    columnsByTable[row.table].push(row);
  }
  return tablesResult.map(({ name, sql: sql2, type }) => {
    var _a2, _b, _c, _d, _e;
    let autoIncrementCol = (_e = (_d = (_c = (_b = (_a2 = sql2 == null ? void 0 : sql2.split(/[\(\),]/)) == null ? void 0 : _a2.find((it) => it.toLowerCase().includes("autoincrement"))) == null ? void 0 : _b.trimStart()) == null ? void 0 : _c.split(/\s+/)) == null ? void 0 : _d[0]) == null ? void 0 : _e.replace(/["`]/g, "");
    const columns = columnsByTable[name] ?? [];
    if (!autoIncrementCol) {
      const pkCols = columns.filter((r) => r.pk > 0);
      if (pkCols.length === 1 && pkCols[0].type.toLowerCase() === "integer") {
        autoIncrementCol = pkCols[0].name;
      }
    }
    return {
      name,
      isView: type === "view",
      columns: columns.map((col) => ({
        name: col.name,
        dataType: col.type,
        isNullable: !col.notnull,
        isAutoIncrementing: col.name === autoIncrementCol,
        hasDefaultValue: col.dflt_value != null,
        comment: void 0
      }))
    };
  });
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-adapter.js
var SqliteAdapter = class extends DialectAdapterBase {
  get supportsTransactionalDdl() {
    return false;
  }
  get supportsReturning() {
    return true;
  }
  async acquireMigrationLock(_db7, _opt) {
  }
  async releaseMigrationLock(_db7, _opt) {
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/sqlite/sqlite-dialect.js
var _config2;
var SqliteDialect = class {
  constructor(config) {
    __privateAdd(this, _config2);
    __privateSet(this, _config2, freeze({ ...config }));
  }
  createDriver() {
    return new SqliteDriver(__privateGet(this, _config2));
  }
  createQueryCompiler() {
    return new SqliteQueryCompiler();
  }
  createAdapter() {
    return new SqliteAdapter();
  }
  createIntrospector(db) {
    return new SqliteIntrospector(db);
  }
};
_config2 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/postgres/postgres-query-compiler.js
var ID_WRAP_REGEX2 = /"/g;
var PostgresQueryCompiler = class extends DefaultQueryCompiler {
  sanitizeIdentifier(identifier) {
    return identifier.replace(ID_WRAP_REGEX2, '""');
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/postgres/postgres-introspector.js
var _db4, _PostgresIntrospector_instances, parseTableMetadata_fn;
var PostgresIntrospector = class {
  constructor(db) {
    __privateAdd(this, _PostgresIntrospector_instances);
    __privateAdd(this, _db4);
    __privateSet(this, _db4, db);
  }
  async getSchemas() {
    let rawSchemas = await __privateGet(this, _db4).selectFrom("pg_catalog.pg_namespace").select("nspname").$castTo().execute();
    return rawSchemas.map((it) => ({ name: it.nspname }));
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    let query = __privateGet(this, _db4).selectFrom("pg_catalog.pg_attribute as a").innerJoin("pg_catalog.pg_class as c", "a.attrelid", "c.oid").innerJoin("pg_catalog.pg_namespace as ns", "c.relnamespace", "ns.oid").innerJoin("pg_catalog.pg_type as typ", "a.atttypid", "typ.oid").innerJoin("pg_catalog.pg_namespace as dtns", "typ.typnamespace", "dtns.oid").select([
      "a.attname as column",
      "a.attnotnull as not_null",
      "a.atthasdef as has_default",
      "c.relname as table",
      "c.relkind as table_type",
      "ns.nspname as schema",
      "typ.typname as type",
      "dtns.nspname as type_schema",
      sql`col_description(a.attrelid, a.attnum)`.as("column_description"),
      sql`pg_get_serial_sequence(quote_ident(ns.nspname) || '.' || quote_ident(c.relname), a.attname)`.as("auto_incrementing")
    ]).where("c.relkind", "in", [
      "r",
      "v",
      "p"
    ]).where("ns.nspname", "!~", "^pg_").where("ns.nspname", "!=", "information_schema").where("a.attnum", ">=", 0).where("a.attisdropped", "!=", true).orderBy("ns.nspname").orderBy("c.relname").orderBy("a.attnum").$castTo();
    if (!options.withInternalKyselyTables) {
      query = query.where("c.relname", "!=", DEFAULT_MIGRATION_TABLE).where("c.relname", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    }
    const rawColumns = await query.execute();
    return __privateMethod(this, _PostgresIntrospector_instances, parseTableMetadata_fn).call(this, rawColumns);
  }
  async getMetadata(options) {
    return {
      tables: await this.getTables(options)
    };
  }
};
_db4 = new WeakMap();
_PostgresIntrospector_instances = new WeakSet();
parseTableMetadata_fn = function(columns) {
  return columns.reduce((tables, it) => {
    let table = tables.find((tbl) => tbl.name === it.table && tbl.schema === it.schema);
    if (!table) {
      table = freeze({
        name: it.table,
        isView: it.table_type === "v",
        schema: it.schema,
        columns: []
      });
      tables.push(table);
    }
    table.columns.push(freeze({
      name: it.column,
      dataType: it.type,
      dataTypeSchema: it.type_schema,
      isNullable: !it.not_null,
      isAutoIncrementing: it.auto_incrementing !== null,
      hasDefaultValue: it.has_default,
      comment: it.column_description ?? void 0
    }));
    return tables;
  }, []);
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/postgres/postgres-adapter.js
var LOCK_ID = BigInt("3853314791062309107");
var PostgresAdapter = class extends DialectAdapterBase {
  get supportsTransactionalDdl() {
    return true;
  }
  get supportsReturning() {
    return true;
  }
  async acquireMigrationLock(db, _opt) {
    await sql`select pg_advisory_xact_lock(${sql.lit(LOCK_ID)})`.execute(db);
  }
  async releaseMigrationLock(_db7, _opt) {
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/util/stack-trace-utils.js
function extendStackTrace(err, stackError) {
  if (isStackHolder(err) && stackError.stack) {
    const stackExtension = stackError.stack.split("\n").slice(1).join("\n");
    err.stack += `
${stackExtension}`;
    return err;
  }
  return err;
}
function isStackHolder(obj) {
  return isObject(obj) && isString(obj.stack);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mysql/mysql-driver.js
var PRIVATE_RELEASE_METHOD = Symbol();
var _config3, _connections2, _pool, _MysqlDriver_instances, acquireConnection_fn;
var MysqlDriver = class {
  constructor(configOrPool) {
    __privateAdd(this, _MysqlDriver_instances);
    __privateAdd(this, _config3);
    __privateAdd(this, _connections2, /* @__PURE__ */ new WeakMap());
    __privateAdd(this, _pool);
    __privateSet(this, _config3, freeze({ ...configOrPool }));
  }
  async init() {
    __privateSet(this, _pool, isFunction(__privateGet(this, _config3).pool) ? await __privateGet(this, _config3).pool() : __privateGet(this, _config3).pool);
  }
  async acquireConnection() {
    var _a, _b;
    const rawConnection = await __privateMethod(this, _MysqlDriver_instances, acquireConnection_fn).call(this);
    let connection = __privateGet(this, _connections2).get(rawConnection);
    if (!connection) {
      connection = new MysqlConnection(rawConnection);
      __privateGet(this, _connections2).set(rawConnection, connection);
      if ((_a = __privateGet(this, _config3)) == null ? void 0 : _a.onCreateConnection) {
        await __privateGet(this, _config3).onCreateConnection(connection);
      }
    }
    if ((_b = __privateGet(this, _config3)) == null ? void 0 : _b.onReserveConnection) {
      await __privateGet(this, _config3).onReserveConnection(connection);
    }
    return connection;
  }
  async beginTransaction(connection, settings) {
    if (settings.isolationLevel || settings.accessMode) {
      const parts = [];
      if (settings.isolationLevel) {
        parts.push(`isolation level ${settings.isolationLevel}`);
      }
      if (settings.accessMode) {
        parts.push(settings.accessMode);
      }
      const sql2 = `set transaction ${parts.join(", ")}`;
      await connection.executeQuery(CompiledQuery.raw(sql2));
    }
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }
  async commitTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }
  async savepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
  }
  async rollbackToSavepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
  }
  async releaseSavepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("release savepoint", savepointName), createQueryId()));
  }
  async releaseConnection(connection) {
    connection[PRIVATE_RELEASE_METHOD]();
  }
  async destroy() {
    return new Promise((resolve, reject) => {
      __privateGet(this, _pool).end((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
_config3 = new WeakMap();
_connections2 = new WeakMap();
_pool = new WeakMap();
_MysqlDriver_instances = new WeakSet();
acquireConnection_fn = async function() {
  return new Promise((resolve, reject) => {
    __privateGet(this, _pool).getConnection(async (err, rawConnection) => {
      if (err) {
        reject(err);
      } else {
        resolve(rawConnection);
      }
    });
  });
};
function isOkPacket(obj) {
  return isObject(obj) && "insertId" in obj && "affectedRows" in obj;
}
var _rawConnection, _MysqlConnection_instances, executeQuery_fn;
var MysqlConnection = class {
  constructor(rawConnection) {
    __privateAdd(this, _MysqlConnection_instances);
    __privateAdd(this, _rawConnection);
    __privateSet(this, _rawConnection, rawConnection);
  }
  async executeQuery(compiledQuery) {
    try {
      const result = await __privateMethod(this, _MysqlConnection_instances, executeQuery_fn).call(this, compiledQuery);
      if (isOkPacket(result)) {
        const { insertId, affectedRows, changedRows } = result;
        return {
          insertId: insertId !== void 0 && insertId !== null && insertId.toString() !== "0" ? BigInt(insertId) : void 0,
          numAffectedRows: affectedRows !== void 0 && affectedRows !== null ? BigInt(affectedRows) : void 0,
          numChangedRows: changedRows !== void 0 && changedRows !== null ? BigInt(changedRows) : void 0,
          rows: []
        };
      } else if (Array.isArray(result)) {
        return {
          rows: result
        };
      }
      return {
        rows: []
      };
    } catch (err) {
      throw extendStackTrace(err, new Error());
    }
  }
  async *streamQuery(compiledQuery, _chunkSize) {
    const stream = __privateGet(this, _rawConnection).query(compiledQuery.sql, compiledQuery.parameters).stream({
      objectMode: true
    });
    try {
      for await (const row of stream) {
        yield {
          rows: [row]
        };
      }
    } catch (ex) {
      if (ex && typeof ex === "object" && "code" in ex && // @ts-ignore
      ex.code === "ERR_STREAM_PREMATURE_CLOSE") {
        return;
      }
      throw ex;
    }
  }
  [PRIVATE_RELEASE_METHOD]() {
    __privateGet(this, _rawConnection).release();
  }
};
_rawConnection = new WeakMap();
_MysqlConnection_instances = new WeakSet();
executeQuery_fn = function(compiledQuery) {
  return new Promise((resolve, reject) => {
    __privateGet(this, _rawConnection).query(compiledQuery.sql, compiledQuery.parameters, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mysql/mysql-query-compiler.js
var ID_WRAP_REGEX3 = /`/g;
var MysqlQueryCompiler = class extends DefaultQueryCompiler {
  getCurrentParameterPlaceholder() {
    return "?";
  }
  getLeftExplainOptionsWrapper() {
    return "";
  }
  getExplainOptionAssignment() {
    return "=";
  }
  getExplainOptionsDelimiter() {
    return " ";
  }
  getRightExplainOptionsWrapper() {
    return "";
  }
  getLeftIdentifierWrapper() {
    return "`";
  }
  getRightIdentifierWrapper() {
    return "`";
  }
  sanitizeIdentifier(identifier) {
    return identifier.replace(ID_WRAP_REGEX3, "``");
  }
  visitCreateIndex(node) {
    this.append("create ");
    if (node.unique) {
      this.append("unique ");
    }
    this.append("index ");
    if (node.ifNotExists) {
      this.append("if not exists ");
    }
    this.visitNode(node.name);
    if (node.using) {
      this.append(" using ");
      this.visitNode(node.using);
    }
    if (node.table) {
      this.append(" on ");
      this.visitNode(node.table);
    }
    if (node.columns) {
      this.append(" (");
      this.compileList(node.columns);
      this.append(")");
    }
    if (node.where) {
      this.append(" ");
      this.visitNode(node.where);
    }
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mysql/mysql-introspector.js
var _db5, _MysqlIntrospector_instances, parseTableMetadata_fn2;
var MysqlIntrospector = class {
  constructor(db) {
    __privateAdd(this, _MysqlIntrospector_instances);
    __privateAdd(this, _db5);
    __privateSet(this, _db5, db);
  }
  async getSchemas() {
    let rawSchemas = await __privateGet(this, _db5).selectFrom("information_schema.schemata").select("schema_name").$castTo().execute();
    return rawSchemas.map((it) => ({ name: it.SCHEMA_NAME }));
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    let query = __privateGet(this, _db5).selectFrom("information_schema.columns as columns").innerJoin("information_schema.tables as tables", (b) => b.onRef("columns.TABLE_CATALOG", "=", "tables.TABLE_CATALOG").onRef("columns.TABLE_SCHEMA", "=", "tables.TABLE_SCHEMA").onRef("columns.TABLE_NAME", "=", "tables.TABLE_NAME")).select([
      "columns.COLUMN_NAME",
      "columns.COLUMN_DEFAULT",
      "columns.TABLE_NAME",
      "columns.TABLE_SCHEMA",
      "tables.TABLE_TYPE",
      "columns.IS_NULLABLE",
      "columns.DATA_TYPE",
      "columns.EXTRA",
      "columns.COLUMN_COMMENT"
    ]).where("columns.TABLE_SCHEMA", "=", sql`database()`).orderBy("columns.TABLE_NAME").orderBy("columns.ORDINAL_POSITION").$castTo();
    if (!options.withInternalKyselyTables) {
      query = query.where("columns.TABLE_NAME", "!=", DEFAULT_MIGRATION_TABLE).where("columns.TABLE_NAME", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    }
    const rawColumns = await query.execute();
    return __privateMethod(this, _MysqlIntrospector_instances, parseTableMetadata_fn2).call(this, rawColumns);
  }
  async getMetadata(options) {
    return {
      tables: await this.getTables(options)
    };
  }
};
_db5 = new WeakMap();
_MysqlIntrospector_instances = new WeakSet();
parseTableMetadata_fn2 = function(columns) {
  return columns.reduce((tables, it) => {
    let table = tables.find((tbl) => tbl.name === it.TABLE_NAME);
    if (!table) {
      table = freeze({
        name: it.TABLE_NAME,
        isView: it.TABLE_TYPE === "VIEW",
        schema: it.TABLE_SCHEMA,
        columns: []
      });
      tables.push(table);
    }
    table.columns.push(freeze({
      name: it.COLUMN_NAME,
      dataType: it.DATA_TYPE,
      isNullable: it.IS_NULLABLE === "YES",
      isAutoIncrementing: it.EXTRA.toLowerCase().includes("auto_increment"),
      hasDefaultValue: it.COLUMN_DEFAULT !== null,
      comment: it.COLUMN_COMMENT === "" ? void 0 : it.COLUMN_COMMENT
    }));
    return tables;
  }, []);
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mysql/mysql-adapter.js
var LOCK_ID2 = "ea586330-2c93-47c8-908d-981d9d270f9d";
var LOCK_TIMEOUT_SECONDS = 60 * 60;
var MysqlAdapter = class extends DialectAdapterBase {
  get supportsTransactionalDdl() {
    return false;
  }
  get supportsReturning() {
    return false;
  }
  async acquireMigrationLock(db, _opt) {
    await sql`select get_lock(${sql.lit(LOCK_ID2)}, ${sql.lit(LOCK_TIMEOUT_SECONDS)})`.execute(db);
  }
  async releaseMigrationLock(db, _opt) {
    await sql`select release_lock(${sql.lit(LOCK_ID2)})`.execute(db);
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mysql/mysql-dialect.js
var _config4;
var MysqlDialect = class {
  constructor(config) {
    __privateAdd(this, _config4);
    __privateSet(this, _config4, config);
  }
  createDriver() {
    return new MysqlDriver(__privateGet(this, _config4));
  }
  createQueryCompiler() {
    return new MysqlQueryCompiler();
  }
  createAdapter() {
    return new MysqlAdapter();
  }
  createIntrospector(db) {
    return new MysqlIntrospector(db);
  }
};
_config4 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/postgres/postgres-driver.js
var PRIVATE_RELEASE_METHOD2 = Symbol();
var _config5, _connections3, _pool2;
var PostgresDriver = class {
  constructor(config) {
    __privateAdd(this, _config5);
    __privateAdd(this, _connections3, /* @__PURE__ */ new WeakMap());
    __privateAdd(this, _pool2);
    __privateSet(this, _config5, freeze({ ...config }));
  }
  async init() {
    __privateSet(this, _pool2, isFunction(__privateGet(this, _config5).pool) ? await __privateGet(this, _config5).pool() : __privateGet(this, _config5).pool);
  }
  async acquireConnection() {
    const client = await __privateGet(this, _pool2).connect();
    let connection = __privateGet(this, _connections3).get(client);
    if (!connection) {
      connection = new PostgresConnection(client, {
        cursor: __privateGet(this, _config5).cursor ?? null
      });
      __privateGet(this, _connections3).set(client, connection);
      if (__privateGet(this, _config5).onCreateConnection) {
        await __privateGet(this, _config5).onCreateConnection(connection);
      }
    }
    if (__privateGet(this, _config5).onReserveConnection) {
      await __privateGet(this, _config5).onReserveConnection(connection);
    }
    return connection;
  }
  async beginTransaction(connection, settings) {
    if (settings.isolationLevel || settings.accessMode) {
      let sql2 = "start transaction";
      if (settings.isolationLevel) {
        sql2 += ` isolation level ${settings.isolationLevel}`;
      }
      if (settings.accessMode) {
        sql2 += ` ${settings.accessMode}`;
      }
      await connection.executeQuery(CompiledQuery.raw(sql2));
    } else {
      await connection.executeQuery(CompiledQuery.raw("begin"));
    }
  }
  async commitTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }
  async savepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
  }
  async rollbackToSavepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
  }
  async releaseSavepoint(connection, savepointName, compileQuery) {
    await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
  }
  async releaseConnection(connection) {
    connection[PRIVATE_RELEASE_METHOD2]();
  }
  async destroy() {
    if (__privateGet(this, _pool2)) {
      const pool = __privateGet(this, _pool2);
      __privateSet(this, _pool2, void 0);
      await pool.end();
    }
  }
};
_config5 = new WeakMap();
_connections3 = new WeakMap();
_pool2 = new WeakMap();
var _client, _options;
var PostgresConnection = class {
  constructor(client, options) {
    __privateAdd(this, _client);
    __privateAdd(this, _options);
    __privateSet(this, _client, client);
    __privateSet(this, _options, options);
  }
  async executeQuery(compiledQuery) {
    try {
      const { command, rowCount, rows } = await __privateGet(this, _client).query(compiledQuery.sql, [...compiledQuery.parameters]);
      return {
        numAffectedRows: command === "INSERT" || command === "UPDATE" || command === "DELETE" || command === "MERGE" ? BigInt(rowCount) : void 0,
        rows: rows ?? []
      };
    } catch (err) {
      throw extendStackTrace(err, new Error());
    }
  }
  async *streamQuery(compiledQuery, chunkSize) {
    if (!__privateGet(this, _options).cursor) {
      throw new Error("'cursor' is not present in your postgres dialect config. It's required to make streaming work in postgres.");
    }
    if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
      throw new Error("chunkSize must be a positive integer");
    }
    const cursor = __privateGet(this, _client).query(new (__privateGet(this, _options)).cursor(compiledQuery.sql, compiledQuery.parameters.slice()));
    try {
      while (true) {
        const rows = await cursor.read(chunkSize);
        if (rows.length === 0) {
          break;
        }
        yield {
          rows
        };
      }
    } finally {
      await cursor.close();
    }
  }
  [PRIVATE_RELEASE_METHOD2]() {
    __privateGet(this, _client).release();
  }
};
_client = new WeakMap();
_options = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/postgres/postgres-dialect.js
var _config6;
var PostgresDialect = class {
  constructor(config) {
    __privateAdd(this, _config6);
    __privateSet(this, _config6, config);
  }
  createDriver() {
    return new PostgresDriver(__privateGet(this, _config6));
  }
  createQueryCompiler() {
    return new PostgresQueryCompiler();
  }
  createAdapter() {
    return new PostgresAdapter();
  }
  createIntrospector(db) {
    return new PostgresIntrospector(db);
  }
};
_config6 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mssql/mssql-adapter.js
var MssqlAdapter = class extends DialectAdapterBase {
  get supportsCreateIfNotExists() {
    return false;
  }
  get supportsTransactionalDdl() {
    return true;
  }
  get supportsOutput() {
    return true;
  }
  async acquireMigrationLock(db) {
    await sql`exec sp_getapplock @DbPrincipal = ${sql.lit("dbo")}, @Resource = ${sql.lit(DEFAULT_MIGRATION_TABLE)}, @LockMode = ${sql.lit("Exclusive")}`.execute(db);
  }
  async releaseMigrationLock() {
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mssql/mssql-driver.js
var PRIVATE_RESET_METHOD = Symbol();
var PRIVATE_DESTROY_METHOD = Symbol();
var _config7, _pool3;
var MssqlDriver = class {
  constructor(config) {
    __privateAdd(this, _config7);
    __privateAdd(this, _pool3);
    __privateSet(this, _config7, freeze({ ...config }));
    const { tarn, tedious, validateConnections } = __privateGet(this, _config7);
    const { validateConnections: deprecatedValidateConnections, ...poolOptions } = tarn.options;
    __privateSet(this, _pool3, new tarn.Pool({
      ...poolOptions,
      create: async () => {
        const connection = await tedious.connectionFactory();
        return await new MssqlConnection(connection, tedious).connect();
      },
      destroy: async (connection) => {
        await connection[PRIVATE_DESTROY_METHOD]();
      },
      // @ts-ignore `tarn` accepts a function that returns a promise here, but
      // the types are not aligned and it type errors.
      validate: validateConnections === false || deprecatedValidateConnections === false ? void 0 : (connection) => connection.validate()
    }));
  }
  async init() {
  }
  async acquireConnection() {
    return await __privateGet(this, _pool3).acquire().promise;
  }
  async beginTransaction(connection, settings) {
    await connection.beginTransaction(settings);
  }
  async commitTransaction(connection) {
    await connection.commitTransaction();
  }
  async rollbackTransaction(connection) {
    await connection.rollbackTransaction();
  }
  async savepoint(connection, savepointName) {
    await connection.savepoint(savepointName);
  }
  async rollbackToSavepoint(connection, savepointName) {
    await connection.rollbackTransaction(savepointName);
  }
  async releaseConnection(connection) {
    if (__privateGet(this, _config7).resetConnectionsOnRelease || __privateGet(this, _config7).tedious.resetConnectionOnRelease) {
      await connection[PRIVATE_RESET_METHOD]();
    }
    __privateGet(this, _pool3).release(connection);
  }
  async destroy() {
    await __privateGet(this, _pool3).destroy();
  }
};
_config7 = new WeakMap();
_pool3 = new WeakMap();
var _connection3, _tedious, _MssqlConnection_instances, getTediousIsolationLevel_fn, cancelRequest_fn;
var MssqlConnection = class {
  constructor(connection, tedious) {
    __privateAdd(this, _MssqlConnection_instances);
    __privateAdd(this, _connection3);
    __privateAdd(this, _tedious);
    __privateSet(this, _connection3, connection);
    __privateSet(this, _tedious, tedious);
    __privateGet(this, _connection3).on("error", console.error);
    __privateGet(this, _connection3).once("end", () => {
      __privateGet(this, _connection3).off("error", console.error);
    });
  }
  async beginTransaction(settings) {
    const { isolationLevel } = settings;
    await new Promise((resolve, reject) => __privateGet(this, _connection3).beginTransaction((error) => {
      if (error)
        reject(error);
      else
        resolve(void 0);
    }, isolationLevel ? randomString(8) : void 0, isolationLevel ? __privateMethod(this, _MssqlConnection_instances, getTediousIsolationLevel_fn).call(this, isolationLevel) : void 0));
  }
  async commitTransaction() {
    await new Promise((resolve, reject) => __privateGet(this, _connection3).commitTransaction((error) => {
      if (error)
        reject(error);
      else
        resolve(void 0);
    }));
  }
  async connect() {
    await new Promise((resolve, reject) => {
      __privateGet(this, _connection3).connect((error) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(void 0);
        }
      });
    });
    return this;
  }
  async executeQuery(compiledQuery) {
    try {
      const deferred = new Deferred();
      const request = new MssqlRequest({
        compiledQuery,
        tedious: __privateGet(this, _tedious),
        onDone: deferred
      });
      __privateGet(this, _connection3).execSql(request.request);
      const { rowCount, rows } = await deferred.promise;
      return {
        numAffectedRows: rowCount !== void 0 ? BigInt(rowCount) : void 0,
        rows
      };
    } catch (err) {
      throw extendStackTrace(err, new Error());
    }
  }
  async rollbackTransaction(savepointName) {
    await new Promise((resolve, reject) => __privateGet(this, _connection3).rollbackTransaction((error) => {
      if (error)
        reject(error);
      else
        resolve(void 0);
    }, savepointName));
  }
  async savepoint(savepointName) {
    await new Promise((resolve, reject) => __privateGet(this, _connection3).saveTransaction((error) => {
      if (error)
        reject(error);
      else
        resolve(void 0);
    }, savepointName));
  }
  async *streamQuery(compiledQuery, chunkSize) {
    if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
      throw new Error("chunkSize must be a positive integer");
    }
    const request = new MssqlRequest({
      compiledQuery,
      streamChunkSize: chunkSize,
      tedious: __privateGet(this, _tedious)
    });
    __privateGet(this, _connection3).execSql(request.request);
    try {
      while (true) {
        const rows = await request.readChunk();
        if (rows.length === 0) {
          break;
        }
        yield { rows };
        if (rows.length < chunkSize) {
          break;
        }
      }
    } finally {
      await __privateMethod(this, _MssqlConnection_instances, cancelRequest_fn).call(this, request);
    }
  }
  async validate() {
    try {
      const deferred = new Deferred();
      const request = new MssqlRequest({
        compiledQuery: CompiledQuery.raw("select 1"),
        onDone: deferred,
        tedious: __privateGet(this, _tedious)
      });
      __privateGet(this, _connection3).execSql(request.request);
      await deferred.promise;
      return true;
    } catch {
      return false;
    }
  }
  async [PRIVATE_RESET_METHOD]() {
    await new Promise((resolve, reject) => {
      __privateGet(this, _connection3).reset((error) => {
        if (error)
          reject(error);
        else
          resolve(void 0);
      });
    });
  }
  [PRIVATE_DESTROY_METHOD]() {
    return new Promise((resolve) => {
      __privateGet(this, _connection3).once("end", () => {
        resolve(void 0);
      });
      __privateGet(this, _connection3).close();
    });
  }
};
_connection3 = new WeakMap();
_tedious = new WeakMap();
_MssqlConnection_instances = new WeakSet();
getTediousIsolationLevel_fn = function(isolationLevel) {
  const { ISOLATION_LEVEL } = __privateGet(this, _tedious);
  const mapper = {
    "read committed": ISOLATION_LEVEL.READ_COMMITTED,
    "read uncommitted": ISOLATION_LEVEL.READ_UNCOMMITTED,
    "repeatable read": ISOLATION_LEVEL.REPEATABLE_READ,
    serializable: ISOLATION_LEVEL.SERIALIZABLE,
    snapshot: ISOLATION_LEVEL.SNAPSHOT
  };
  const tediousIsolationLevel = mapper[isolationLevel];
  if (tediousIsolationLevel === void 0) {
    throw new Error(`Unknown isolation level: ${isolationLevel}`);
  }
  return tediousIsolationLevel;
};
cancelRequest_fn = function(request) {
  return new Promise((resolve) => {
    request.request.once("requestCompleted", resolve);
    const wasCanceled = __privateGet(this, _connection3).cancel();
    if (!wasCanceled) {
      request.request.off("requestCompleted", resolve);
      resolve(void 0);
    }
  });
};
var _request, _rows, _streamChunkSize, _subscribers, _tedious2, _rowCount, _MssqlRequest_instances, addParametersToRequest_fn, attachListeners_fn, getTediousDataType_fn;
var MssqlRequest = class {
  constructor(props) {
    __privateAdd(this, _MssqlRequest_instances);
    __privateAdd(this, _request);
    __privateAdd(this, _rows);
    __privateAdd(this, _streamChunkSize);
    __privateAdd(this, _subscribers);
    __privateAdd(this, _tedious2);
    __privateAdd(this, _rowCount);
    const { compiledQuery, onDone, streamChunkSize, tedious } = props;
    __privateSet(this, _rows, []);
    __privateSet(this, _streamChunkSize, streamChunkSize);
    __privateSet(this, _subscribers, {});
    __privateSet(this, _tedious2, tedious);
    if (onDone) {
      const subscriptionKey = "onDone";
      __privateGet(this, _subscribers)[subscriptionKey] = (event, error) => {
        if (event === "chunkReady") {
          return;
        }
        delete __privateGet(this, _subscribers)[subscriptionKey];
        if (event === "error") {
          onDone.reject(error);
        } else {
          onDone.resolve({
            rowCount: __privateGet(this, _rowCount),
            rows: __privateGet(this, _rows)
          });
        }
      };
    }
    __privateSet(this, _request, new (__privateGet(this, _tedious2)).Request(compiledQuery.sql, (err, rowCount) => {
      if (err) {
        Object.values(__privateGet(this, _subscribers)).forEach((subscriber) => subscriber("error", err instanceof AggregateError ? err.errors : err));
      } else {
        __privateSet(this, _rowCount, rowCount);
      }
    }));
    __privateMethod(this, _MssqlRequest_instances, addParametersToRequest_fn).call(this, compiledQuery.parameters);
    __privateMethod(this, _MssqlRequest_instances, attachListeners_fn).call(this);
  }
  get request() {
    return __privateGet(this, _request);
  }
  readChunk() {
    const subscriptionKey = this.readChunk.name;
    return new Promise((resolve, reject) => {
      __privateGet(this, _subscribers)[subscriptionKey] = (event, error) => {
        delete __privateGet(this, _subscribers)[subscriptionKey];
        if (event === "error") {
          reject(error);
        } else {
          resolve(__privateGet(this, _rows).splice(0, __privateGet(this, _streamChunkSize)));
        }
      };
      __privateGet(this, _request).resume();
    });
  }
};
_request = new WeakMap();
_rows = new WeakMap();
_streamChunkSize = new WeakMap();
_subscribers = new WeakMap();
_tedious2 = new WeakMap();
_rowCount = new WeakMap();
_MssqlRequest_instances = new WeakSet();
addParametersToRequest_fn = function(parameters) {
  for (let i = 0; i < parameters.length; i++) {
    const parameter = parameters[i];
    __privateGet(this, _request).addParameter(String(i + 1), __privateMethod(this, _MssqlRequest_instances, getTediousDataType_fn).call(this, parameter), parameter);
  }
};
attachListeners_fn = function() {
  const pauseAndEmitChunkReady = __privateGet(this, _streamChunkSize) ? () => {
    if (__privateGet(this, _streamChunkSize) <= __privateGet(this, _rows).length) {
      __privateGet(this, _request).pause();
      Object.values(__privateGet(this, _subscribers)).forEach((subscriber) => subscriber("chunkReady"));
    }
  } : () => {
  };
  const rowListener = (columns) => {
    const row = {};
    for (const column of columns) {
      row[column.metadata.colName] = column.value;
    }
    __privateGet(this, _rows).push(row);
    pauseAndEmitChunkReady();
  };
  __privateGet(this, _request).on("row", rowListener);
  __privateGet(this, _request).once("requestCompleted", () => {
    Object.values(__privateGet(this, _subscribers)).forEach((subscriber) => subscriber("completed"));
    __privateGet(this, _request).off("row", rowListener);
  });
};
getTediousDataType_fn = function(value) {
  if (isNull(value) || isUndefined(value) || isString(value)) {
    return __privateGet(this, _tedious2).TYPES.NVarChar;
  }
  if (isBigInt(value) || isNumber(value) && value % 1 === 0) {
    if (value < -2147483648 || value > 2147483647) {
      return __privateGet(this, _tedious2).TYPES.BigInt;
    } else {
      return __privateGet(this, _tedious2).TYPES.Int;
    }
  }
  if (isNumber(value)) {
    return __privateGet(this, _tedious2).TYPES.Float;
  }
  if (isBoolean(value)) {
    return __privateGet(this, _tedious2).TYPES.Bit;
  }
  if (isDate(value)) {
    return __privateGet(this, _tedious2).TYPES.DateTime;
  }
  if (isBuffer(value)) {
    return __privateGet(this, _tedious2).TYPES.VarBinary;
  }
  return __privateGet(this, _tedious2).TYPES.NVarChar;
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mssql/mssql-introspector.js
var _db6;
var MssqlIntrospector = class {
  constructor(db) {
    __privateAdd(this, _db6);
    __privateSet(this, _db6, db);
  }
  async getSchemas() {
    return await __privateGet(this, _db6).selectFrom("sys.schemas").select("name").execute();
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    const rawColumns = await __privateGet(this, _db6).selectFrom("sys.tables as tables").leftJoin("sys.schemas as table_schemas", "table_schemas.schema_id", "tables.schema_id").innerJoin("sys.columns as columns", "columns.object_id", "tables.object_id").innerJoin("sys.types as types", "types.user_type_id", "columns.user_type_id").leftJoin("sys.schemas as type_schemas", "type_schemas.schema_id", "types.schema_id").leftJoin("sys.extended_properties as comments", (join) => join.onRef("comments.major_id", "=", "tables.object_id").onRef("comments.minor_id", "=", "columns.column_id").on("comments.name", "=", "MS_Description")).$if(!options.withInternalKyselyTables, (qb) => qb.where("tables.name", "!=", DEFAULT_MIGRATION_TABLE).where("tables.name", "!=", DEFAULT_MIGRATION_LOCK_TABLE)).select([
      "tables.name as table_name",
      (eb) => eb.ref("tables.type").$castTo().as("table_type"),
      "table_schemas.name as table_schema_name",
      "columns.default_object_id as column_default_object_id",
      "columns.generated_always_type_desc as column_generated_always_type",
      "columns.is_computed as column_is_computed",
      "columns.is_identity as column_is_identity",
      "columns.is_nullable as column_is_nullable",
      "columns.is_rowguidcol as column_is_rowguidcol",
      "columns.name as column_name",
      "types.is_nullable as type_is_nullable",
      "types.name as type_name",
      "type_schemas.name as type_schema_name",
      "comments.value as column_comment"
    ]).unionAll(__privateGet(this, _db6).selectFrom("sys.views as views").leftJoin("sys.schemas as view_schemas", "view_schemas.schema_id", "views.schema_id").innerJoin("sys.columns as columns", "columns.object_id", "views.object_id").innerJoin("sys.types as types", "types.user_type_id", "columns.user_type_id").leftJoin("sys.schemas as type_schemas", "type_schemas.schema_id", "types.schema_id").leftJoin("sys.extended_properties as comments", (join) => join.onRef("comments.major_id", "=", "views.object_id").onRef("comments.minor_id", "=", "columns.column_id").on("comments.name", "=", "MS_Description")).select([
      "views.name as table_name",
      "views.type as table_type",
      "view_schemas.name as table_schema_name",
      "columns.default_object_id as column_default_object_id",
      "columns.generated_always_type_desc as column_generated_always_type",
      "columns.is_computed as column_is_computed",
      "columns.is_identity as column_is_identity",
      "columns.is_nullable as column_is_nullable",
      "columns.is_rowguidcol as column_is_rowguidcol",
      "columns.name as column_name",
      "types.is_nullable as type_is_nullable",
      "types.name as type_name",
      "type_schemas.name as type_schema_name",
      "comments.value as column_comment"
    ])).orderBy("table_schema_name").orderBy("table_name").orderBy("column_name").execute();
    const tableDictionary = {};
    for (const rawColumn of rawColumns) {
      const key = `${rawColumn.table_schema_name}.${rawColumn.table_name}`;
      const table = tableDictionary[key] = tableDictionary[key] || freeze({
        columns: [],
        isView: rawColumn.table_type === "V ",
        name: rawColumn.table_name,
        schema: rawColumn.table_schema_name ?? void 0
      });
      table.columns.push(freeze({
        dataType: rawColumn.type_name,
        dataTypeSchema: rawColumn.type_schema_name ?? void 0,
        hasDefaultValue: rawColumn.column_default_object_id > 0 || rawColumn.column_generated_always_type !== "NOT_APPLICABLE" || rawColumn.column_is_identity || rawColumn.column_is_computed || rawColumn.column_is_rowguidcol,
        isAutoIncrementing: rawColumn.column_is_identity,
        isNullable: rawColumn.column_is_nullable && rawColumn.type_is_nullable,
        name: rawColumn.column_name,
        comment: rawColumn.column_comment ?? void 0
      }));
    }
    return Object.values(tableDictionary);
  }
  async getMetadata(options) {
    return {
      tables: await this.getTables(options)
    };
  }
};
_db6 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mssql/mssql-query-compiler.js
var COLLATION_CHAR_REGEX = /^[a-z0-9_]$/i;
var MssqlQueryCompiler = class extends DefaultQueryCompiler {
  getCurrentParameterPlaceholder() {
    return `@${this.numParameters}`;
  }
  visitOffset(node) {
    super.visitOffset(node);
    this.append(" rows");
  }
  // mssql allows multi-column alterations in a single statement,
  // but you can only use the command keyword/s once.
  // it also doesn't support multiple kinds of commands in the same
  // alter table statement, but we compile that anyway for the sake
  // of WYSIWYG.
  compileColumnAlterations(columnAlterations) {
    const nodesByKind = {};
    for (const columnAlteration of columnAlterations) {
      if (!nodesByKind[columnAlteration.kind]) {
        nodesByKind[columnAlteration.kind] = [];
      }
      nodesByKind[columnAlteration.kind].push(columnAlteration);
    }
    let first = true;
    if (nodesByKind.AddColumnNode) {
      this.append("add ");
      this.compileList(nodesByKind.AddColumnNode);
      first = false;
    }
    if (nodesByKind.AlterColumnNode) {
      if (!first)
        this.append(", ");
      this.compileList(nodesByKind.AlterColumnNode);
    }
    if (nodesByKind.DropColumnNode) {
      if (!first)
        this.append(", ");
      this.append("drop column ");
      this.compileList(nodesByKind.DropColumnNode);
    }
    if (nodesByKind.ModifyColumnNode) {
      if (!first)
        this.append(", ");
      this.compileList(nodesByKind.ModifyColumnNode);
    }
    if (nodesByKind.RenameColumnNode) {
      if (!first)
        this.append(", ");
      this.compileList(nodesByKind.RenameColumnNode);
    }
  }
  visitAddColumn(node) {
    this.visitNode(node.column);
  }
  visitDropColumn(node) {
    this.visitNode(node.column);
  }
  visitMergeQuery(node) {
    super.visitMergeQuery(node);
    this.append(";");
  }
  visitCollate(node) {
    this.append("collate ");
    const { name } = node.collation;
    for (const char2 of name) {
      if (!COLLATION_CHAR_REGEX.test(char2)) {
        throw new Error(`Invalid collation: ${name}`);
      }
    }
    this.append(name);
  }
  announcesNewColumnDataType() {
    return false;
  }
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/dialect/mssql/mssql-dialect.js
var _config8;
var MssqlDialect = class {
  constructor(config) {
    __privateAdd(this, _config8);
    __privateSet(this, _config8, config);
  }
  createDriver() {
    return new MssqlDriver(__privateGet(this, _config8));
  }
  createQueryCompiler() {
    return new MssqlQueryCompiler();
  }
  createAdapter() {
    return new MssqlAdapter();
  }
  createIntrospector(db) {
    return new MssqlIntrospector(db);
  }
};
_config8 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/migration/file-migration-provider.js
var _props47;
var FileMigrationProvider = class {
  constructor(props) {
    __privateAdd(this, _props47);
    __privateSet(this, _props47, props);
  }
  async getMigrations() {
    const migrations = {};
    const files = await __privateGet(this, _props47).fs.readdir(__privateGet(this, _props47).migrationFolder);
    for (const fileName of files) {
      if (fileName.endsWith(".js") || fileName.endsWith(".ts") && !fileName.endsWith(".d.ts") || fileName.endsWith(".mjs") || fileName.endsWith(".mts") && !fileName.endsWith(".d.mts")) {
        const migration = await import(
          /* webpackIgnore: true */
          __privateGet(this, _props47).path.join(__privateGet(this, _props47).migrationFolder, fileName)
        );
        const migrationKey = fileName.substring(0, fileName.lastIndexOf("."));
        if (isMigration(migration == null ? void 0 : migration.default)) {
          migrations[migrationKey] = migration.default;
        } else if (isMigration(migration)) {
          migrations[migrationKey] = migration;
        }
      }
    }
    return migrations;
  }
};
_props47 = new WeakMap();
function isMigration(obj) {
  return isObject(obj) && isFunction(obj.up);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/camel-case/camel-case-transformer.js
var _snakeCase;
var SnakeCaseTransformer = class extends OperationNodeTransformer {
  constructor(snakeCase) {
    super();
    __privateAdd(this, _snakeCase);
    __privateSet(this, _snakeCase, snakeCase);
  }
  transformIdentifier(node, queryId) {
    node = super.transformIdentifier(node, queryId);
    return {
      ...node,
      name: __privateGet(this, _snakeCase).call(this, node.name)
    };
  }
};
_snakeCase = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/camel-case/camel-case.js
function createSnakeCaseMapper({ upperCase = false, underscoreBeforeDigits = false, underscoreBetweenUppercaseLetters = false } = {}) {
  return memoize((str) => {
    if (str.length === 0) {
      return str;
    }
    const upper = str.toUpperCase();
    const lower = str.toLowerCase();
    let out = lower[0];
    for (let i = 1, l = str.length; i < l; ++i) {
      const char2 = str[i];
      const prevChar = str[i - 1];
      const upperChar = upper[i];
      const prevUpperChar = upper[i - 1];
      const lowerChar = lower[i];
      const prevLowerChar = lower[i - 1];
      if (underscoreBeforeDigits && isDigit(char2) && !isDigit(prevChar) && !out.endsWith("_")) {
        out += "_" + char2;
        continue;
      }
      if (char2 === upperChar && upperChar !== lowerChar) {
        const prevCharacterIsUppercase = prevChar === prevUpperChar && prevUpperChar !== prevLowerChar;
        if (underscoreBetweenUppercaseLetters || !prevCharacterIsUppercase) {
          out += "_" + lowerChar;
        } else {
          out += lowerChar;
        }
      } else {
        out += char2;
      }
    }
    if (upperCase) {
      return out.toUpperCase();
    } else {
      return out;
    }
  });
}
function createCamelCaseMapper({ upperCase = false } = {}) {
  return memoize((str) => {
    if (str.length === 0) {
      return str;
    }
    if (upperCase && isAllUpperCaseSnakeCase(str)) {
      str = str.toLowerCase();
    }
    let out = str[0];
    for (let i = 1, l = str.length; i < l; ++i) {
      const char2 = str[i];
      const prevChar = str[i - 1];
      if (char2 !== "_") {
        if (prevChar === "_") {
          out += char2.toUpperCase();
        } else {
          out += char2;
        }
      }
    }
    return out;
  });
}
function isAllUpperCaseSnakeCase(str) {
  for (let i = 1, l = str.length; i < l; ++i) {
    const char2 = str[i];
    if (char2 !== "_" && char2 !== char2.toUpperCase()) {
      return false;
    }
  }
  return true;
}
function isDigit(char2) {
  return char2 >= "0" && char2 <= "9";
}
function memoize(func) {
  const cache = /* @__PURE__ */ new Map();
  return (str) => {
    let mapped = cache.get(str);
    if (!mapped) {
      mapped = func(str);
      cache.set(str, mapped);
    }
    return mapped;
  };
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/camel-case/camel-case-plugin.js
var _camelCase, _snakeCase2, _snakeCaseTransformer;
var CamelCasePlugin = class {
  constructor(opt = {}) {
    __publicField(this, "opt");
    __privateAdd(this, _camelCase);
    __privateAdd(this, _snakeCase2);
    __privateAdd(this, _snakeCaseTransformer);
    this.opt = opt;
    __privateSet(this, _camelCase, createCamelCaseMapper(opt));
    __privateSet(this, _snakeCase2, createSnakeCaseMapper(opt));
    __privateSet(this, _snakeCaseTransformer, new SnakeCaseTransformer(this.snakeCase.bind(this)));
  }
  transformQuery(args) {
    return __privateGet(this, _snakeCaseTransformer).transformNode(args.node, args.queryId);
  }
  async transformResult(args) {
    if (args.result.rows && Array.isArray(args.result.rows)) {
      return {
        ...args.result,
        rows: args.result.rows.map((row) => this.mapRow(row))
      };
    }
    return args.result;
  }
  mapRow(row) {
    return Object.keys(row).reduce((obj, key) => {
      let value = row[key];
      if (Array.isArray(value)) {
        value = value.map((it) => canMap(it, this.opt) ? this.mapRow(it) : it);
      } else if (canMap(value, this.opt)) {
        value = this.mapRow(value);
      }
      obj[this.camelCase(key)] = value;
      return obj;
    }, {});
  }
  snakeCase(str) {
    return __privateGet(this, _snakeCase2).call(this, str);
  }
  camelCase(str) {
    return __privateGet(this, _camelCase).call(this, str);
  }
};
_camelCase = new WeakMap();
_snakeCase2 = new WeakMap();
_snakeCaseTransformer = new WeakMap();
function canMap(obj, opt) {
  return isPlainObject(obj) && !(opt == null ? void 0 : opt.maintainNestedObjectKeys);
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/deduplicate-joins/deduplicate-joins-transformer.js
var _DeduplicateJoinsTransformer_instances, transformQuery_fn, deduplicateJoins_fn;
var DeduplicateJoinsTransformer = class extends OperationNodeTransformer {
  constructor() {
    super(...arguments);
    __privateAdd(this, _DeduplicateJoinsTransformer_instances);
  }
  transformSelectQuery(node, queryId) {
    return __privateMethod(this, _DeduplicateJoinsTransformer_instances, transformQuery_fn).call(this, super.transformSelectQuery(node, queryId));
  }
  transformUpdateQuery(node, queryId) {
    return __privateMethod(this, _DeduplicateJoinsTransformer_instances, transformQuery_fn).call(this, super.transformUpdateQuery(node, queryId));
  }
  transformDeleteQuery(node, queryId) {
    return __privateMethod(this, _DeduplicateJoinsTransformer_instances, transformQuery_fn).call(this, super.transformDeleteQuery(node, queryId));
  }
};
_DeduplicateJoinsTransformer_instances = new WeakSet();
transformQuery_fn = function(node) {
  if (!node.joins || node.joins.length === 0) {
    return node;
  }
  return freeze({
    ...node,
    joins: __privateMethod(this, _DeduplicateJoinsTransformer_instances, deduplicateJoins_fn).call(this, node.joins)
  });
};
deduplicateJoins_fn = function(joins) {
  const out = [];
  for (let i = 0; i < joins.length; ++i) {
    let foundDuplicate = false;
    for (let j = 0; j < out.length; ++j) {
      if (compare(joins[i], out[j])) {
        foundDuplicate = true;
        break;
      }
    }
    if (!foundDuplicate) {
      out.push(joins[i]);
    }
  }
  return freeze(out);
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/deduplicate-joins/deduplicate-joins-plugin.js
var _transformer3;
var DeduplicateJoinsPlugin = class {
  constructor() {
    __privateAdd(this, _transformer3, new DeduplicateJoinsTransformer());
  }
  transformQuery(args) {
    return __privateGet(this, _transformer3).transformNode(args.node, args.queryId);
  }
  transformResult(args) {
    return Promise.resolve(args.result);
  }
};
_transformer3 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/parse-json-results/parse-json-results-plugin.js
var _objectStrategy;
var ParseJSONResultsPlugin = class {
  constructor(opt = {}) {
    __publicField(this, "opt");
    __privateAdd(this, _objectStrategy);
    this.opt = opt;
    __privateSet(this, _objectStrategy, opt.objectStrategy || "in-place");
  }
  // noop
  transformQuery(args) {
    return args.node;
  }
  async transformResult(args) {
    return {
      ...args.result,
      rows: parseArray(args.result.rows, __privateGet(this, _objectStrategy))
    };
  }
};
_objectStrategy = new WeakMap();
function parseArray(arr, objectStrategy) {
  const target = objectStrategy === "create" ? new Array(arr.length) : arr;
  for (let i = 0; i < arr.length; ++i) {
    target[i] = parse(arr[i], objectStrategy);
  }
  return target;
}
function parse(obj, objectStrategy) {
  if (isString(obj)) {
    return parseString(obj);
  }
  if (Array.isArray(obj)) {
    return parseArray(obj, objectStrategy);
  }
  if (isPlainObject(obj)) {
    return parseObject(obj, objectStrategy);
  }
  return obj;
}
function parseString(str) {
  if (maybeJson(str)) {
    try {
      return parse(JSON.parse(str), "in-place");
    } catch (err) {
    }
  }
  return str;
}
function maybeJson(value) {
  return value.match(/^[\[\{]/) != null;
}
function parseObject(obj, objectStrategy) {
  const target = objectStrategy === "create" ? {} : obj;
  for (const key in obj) {
    target[key] = parse(obj[key], objectStrategy);
  }
  return target;
}

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/handle-empty-in-lists/handle-empty-in-lists-transformer.js
var _strategy, _HandleEmptyInListsTransformer_instances, isEmptyInListNode_fn;
var HandleEmptyInListsTransformer = class extends OperationNodeTransformer {
  constructor(strategy) {
    super();
    __privateAdd(this, _HandleEmptyInListsTransformer_instances);
    __privateAdd(this, _strategy);
    __privateSet(this, _strategy, strategy);
  }
  transformBinaryOperation(node) {
    if (__privateMethod(this, _HandleEmptyInListsTransformer_instances, isEmptyInListNode_fn).call(this, node)) {
      return __privateGet(this, _strategy).call(this, node);
    }
    return node;
  }
};
_strategy = new WeakMap();
_HandleEmptyInListsTransformer_instances = new WeakSet();
isEmptyInListNode_fn = function(node) {
  const { operator, rightOperand } = node;
  return (PrimitiveValueListNode.is(rightOperand) || ValueListNode.is(rightOperand)) && rightOperand.values.length === 0 && OperatorNode.is(operator) && (operator.operator === "in" || operator.operator === "not in");
};

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/handle-empty-in-lists/handle-empty-in-lists-plugin.js
var _transformer4;
var HandleEmptyInListsPlugin = class {
  constructor(opt) {
    __publicField(this, "opt");
    __privateAdd(this, _transformer4);
    this.opt = opt;
    __privateSet(this, _transformer4, new HandleEmptyInListsTransformer(opt.strategy));
  }
  transformQuery(args) {
    return __privateGet(this, _transformer4).transformNode(args.node, args.queryId);
  }
  async transformResult(args) {
    return args.result;
  }
};
_transformer4 = new WeakMap();

// ../../node_modules/.pnpm/kysely@0.28.2/node_modules/kysely/dist/esm/plugin/handle-empty-in-lists/handle-empty-in-lists.js
var contradiction;
var eq;
var one;
var tautology;
function replaceWithNoncontingentExpression(node) {
  const _one = one || (one = ValueNode.createImmediate(1));
  const _eq = eq || (eq = OperatorNode.create("="));
  if (node.operator.operator === "in") {
    return contradiction || (contradiction = BinaryOperationNode.create(_one, _eq, ValueNode.createImmediate(0)));
  }
  return tautology || (tautology = BinaryOperationNode.create(_one, _eq, _one));
}
var char;
var listNull;
var listVal;
function pushValueIntoList(uniqueNotInLiteral) {
  return function pushValueIntoList2(node) {
    if (node.operator.operator === "in") {
      return freeze({
        ...node,
        rightOperand: listNull || (listNull = ValueListNode.create([
          ValueNode.createImmediate(null)
        ]))
      });
    }
    return freeze({
      ...node,
      leftOperand: CastNode.create(node.leftOperand, char || (char = DataTypeNode.create("char"))),
      rightOperand: listVal || (listVal = ValueListNode.create([
        ValueNode.createImmediate(uniqueNotInLiteral)
      ]))
    });
  };
}

export {
  AlterTableNode,
  IdentifierNode,
  CreateIndexNode,
  CreateSchemaNode,
  ON_COMMIT_ACTIONS,
  CreateTableNode,
  SchemableIdentifierNode,
  DropIndexNode,
  DropSchemaNode,
  DropTableNode,
  AliasNode,
  TableNode,
  isOperationNodeSource,
  isExpression,
  isAliasedExpression,
  SelectModifierNode,
  AndNode,
  OrNode,
  OnNode,
  JoinNode,
  BinaryOperationNode,
  COMPARISON_OPERATORS,
  ARITHMETIC_OPERATORS,
  JSON_OPERATORS,
  BINARY_OPERATORS,
  UNARY_FILTER_OPERATORS,
  UNARY_OPERATORS,
  OPERATORS,
  OperatorNode,
  isOperator,
  isBinaryOperator,
  isComparisonOperator,
  isArithmeticOperator,
  isJSONOperator,
  ColumnNode,
  SelectAllNode,
  ReferenceNode,
  OrderByItemNode,
  RawNode,
  CollateNode,
  OrderByItemBuilder,
  logOnce,
  JSONReferenceNode,
  JSONOperatorChainNode,
  JSONPathNode,
  PrimitiveValueListNode,
  ValueListNode,
  ValueNode,
  ParensNode,
  OrderByNode,
  PartitionByNode,
  OverNode,
  FromNode,
  GroupByNode,
  HavingNode,
  InsertQueryNode,
  ListNode,
  UpdateQueryNode,
  UsingNode,
  DeleteQueryNode,
  WhereNode,
  ReturningNode,
  ExplainNode,
  WhenNode,
  MergeQueryNode,
  OutputNode,
  QueryNode,
  SelectQueryNode,
  JoinBuilder,
  PartitionByItemNode,
  SelectionNode,
  ValuesNode,
  DefaultInsertValueNode,
  ColumnUpdateNode,
  OnDuplicateKeyNode,
  InsertResult,
  NoResultError,
  isNoResultErrorConstructor,
  OnConflictNode,
  OnConflictBuilder,
  OnConflictDoNothingBuilder,
  OnConflictUpdateBuilder,
  TopNode,
  OrActionNode,
  InsertQueryBuilder,
  DeleteResult,
  LimitNode,
  DeleteQueryBuilder,
  UpdateResult,
  UpdateQueryBuilder,
  CommonTableExpressionNameNode,
  CommonTableExpressionNode,
  WithNode,
  createQueryId,
  OperationNodeTransformer,
  WithSchemaPlugin,
  MatchedNode,
  NoopQueryExecutor,
  NOOP_QUERY_EXECUTOR,
  MergeResult,
  MergeQueryBuilder,
  WheneableMergeQueryBuilder,
  MatchedThenableMergeQueryBuilder,
  NotMatchedThenableMergeQueryBuilder,
  QueryCreator,
  OffsetNode,
  GroupByItemNode,
  SetOperationNode,
  ExpressionWrapper,
  AliasedExpressionWrapper,
  OrWrapper,
  AndWrapper,
  FetchNode,
  createSelectQueryBuilder,
  AggregateFunctionNode,
  FunctionNode,
  AggregateFunctionBuilder,
  AliasedAggregateFunctionBuilder,
  createFunctionModule,
  UnaryOperationNode,
  CaseNode,
  CaseBuilder,
  CaseThenBuilder,
  CaseWhenBuilder,
  CaseEndBuilder,
  JSONPathLegNode,
  JSONPathBuilder,
  TraversedJSONPathBuilder,
  AliasedJSONPathBuilder,
  TupleNode,
  DataTypeNode,
  isColumnDataType,
  CastNode,
  expressionBuilder,
  AddColumnNode,
  ColumnDefinitionNode,
  DropColumnNode,
  RenameColumnNode,
  CheckConstraintNode,
  ON_MODIFY_FOREIGN_ACTIONS,
  ReferencesNode,
  GeneratedNode,
  DefaultValueNode,
  ColumnDefinitionBuilder,
  ModifyColumnNode,
  ForeignKeyConstraintNode,
  ForeignKeyConstraintBuilder,
  AddConstraintNode,
  UniqueConstraintNode,
  DropConstraintNode,
  AlterColumnNode,
  AlterColumnBuilder,
  AlteredColumnBuilder,
  PrimaryKeyConstraintNode,
  PrimaryConstraintNode,
  AddIndexNode,
  RenameConstraintNode,
  AlterTableBuilder,
  AlterTableColumnAlteringBuilder,
  CreateIndexBuilder,
  CreateSchemaBuilder,
  CreateTableBuilder,
  DropIndexBuilder,
  DropSchemaBuilder,
  DropTableBuilder,
  CreateViewNode,
  CreateViewBuilder,
  DropViewNode,
  DropViewBuilder,
  CreateTypeNode,
  CreateTypeBuilder,
  DropTypeNode,
  DropTypeBuilder,
  RefreshMaterializedViewNode,
  RefreshMaterializedViewBuilder,
  SchemaModule,
  DynamicModule,
  DefaultConnectionProvider,
  DefaultQueryExecutor,
  SingleConnectionProvider,
  TRANSACTION_ACCESS_MODES,
  TRANSACTION_ISOLATION_LEVELS,
  validateTransactionSettings,
  LOG_LEVELS,
  Log,
  isCompilable,
  Kysely,
  Transaction,
  isKyselyProps,
  ConnectionBuilder,
  TransactionBuilder,
  ControlledTransactionBuilder,
  ControlledTransaction,
  Command,
  createRawBuilder,
  sql,
  OperationNodeVisitor,
  DefaultQueryCompiler,
  CompiledQuery,
  DummyDriver,
  DialectAdapterBase,
  SqliteDriver,
  SqliteQueryCompiler,
  DEFAULT_MIGRATION_TABLE,
  DEFAULT_MIGRATION_LOCK_TABLE,
  DEFAULT_ALLOW_UNORDERED_MIGRATIONS,
  MIGRATION_LOCK_ID,
  NO_MIGRATIONS,
  Migrator,
  SqliteIntrospector,
  SqliteAdapter,
  SqliteDialect,
  PostgresQueryCompiler,
  PostgresIntrospector,
  PostgresAdapter,
  MysqlDriver,
  MysqlQueryCompiler,
  MysqlIntrospector,
  MysqlAdapter,
  MysqlDialect,
  PostgresDriver,
  PostgresDialect,
  MssqlAdapter,
  MssqlDriver,
  MssqlIntrospector,
  MssqlQueryCompiler,
  MssqlDialect,
  FileMigrationProvider,
  CamelCasePlugin,
  DeduplicateJoinsPlugin,
  ParseJSONResultsPlugin,
  HandleEmptyInListsPlugin,
  replaceWithNoncontingentExpression,
  pushValueIntoList
};
//# sourceMappingURL=chunk-EP7ZSNVX.js.map
