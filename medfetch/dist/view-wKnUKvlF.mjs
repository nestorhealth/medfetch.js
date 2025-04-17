var Ae = Object.defineProperty;
var z = (e) => {
  throw TypeError(e);
};
var be = (e, t, r) => t in e ? Ae(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var k = (e, t, r) => be(e, typeof t != "symbol" ? t + "" : t, r), X = (e, t, r) => t.has(e) || z("Cannot " + r);
var Q = (e, t, r) => (X(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Z = (e, t, r) => t.has(e) ? z("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), ee = (e, t, r, n) => (X(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import { Schema as u } from "effect";
const _e = (e) => typeof e == "function", C = function(e, t) {
  if (typeof e == "function")
    return function() {
      return e(arguments) ? t.apply(this, arguments) : (r) => t(r, ...arguments);
    };
  switch (e) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${e}`);
    case 2:
      return function(r, n) {
        return arguments.length >= 2 ? t(r, n) : function(c) {
          return t(c, r);
        };
      };
    case 3:
      return function(r, n, c) {
        return arguments.length >= 3 ? t(r, n, c) : function(a) {
          return t(a, r, n);
        };
      };
    case 4:
      return function(r, n, c, a) {
        return arguments.length >= 4 ? t(r, n, c, a) : function(f) {
          return t(f, r, n, c);
        };
      };
    case 5:
      return function(r, n, c, a, f) {
        return arguments.length >= 5 ? t(r, n, c, a, f) : function(i) {
          return t(i, r, n, c, a);
        };
      };
    default:
      return function() {
        if (arguments.length >= e)
          return t.apply(this, arguments);
        const r = arguments;
        return function(n) {
          return t(n, ...r);
        };
      };
  }
}, T = (e) => e;
function Oe(e, t, r, n, c, a, f, i, h) {
  switch (arguments.length) {
    case 1:
      return e;
    case 2:
      return t(e);
    case 3:
      return r(t(e));
    case 4:
      return n(r(t(e)));
    case 5:
      return c(n(r(t(e))));
    case 6:
      return a(c(n(r(t(e)))));
    case 7:
      return f(a(c(n(r(t(e))))));
    case 8:
      return i(f(a(c(n(r(t(e)))))));
    case 9:
      return h(i(f(a(c(n(r(t(e))))))));
    default: {
      let P = arguments[0];
      for (let $ = 1; $ < arguments.length; $++)
        P = arguments[$](P);
      return P;
    }
  }
}
let ve = "3.14.1";
const oe = () => ve, w = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ oe()}`;
let x;
const D = (e, t) => (x || (globalThis[w] ?? (globalThis[w] = /* @__PURE__ */ new Map()), x = globalThis[w]), x.has(e) || x.set(e, t()), x.get(e)), ae = _e, Ee = (e) => typeof e == "object" && e !== null, xe = (e) => Ee(e) || ae(e), j = /* @__PURE__ */ C(2, (e, t) => xe(e) && t in e), Ne = /* @__PURE__ */ C(2, (e, t) => j(e, "_tag") && e._tag === t);
class B {
  constructor(t) {
    k(this, "self");
    k(this, "called", !1);
    this.self = t;
  }
  /**
   * @since 2.0.0
   */
  next(t) {
    return this.called ? {
      value: t,
      done: !0
    } : (this.called = !0, {
      value: this.self,
      done: !1
    });
  }
  /**
   * @since 2.0.0
   */
  return(t) {
    return {
      value: t,
      done: !0
    };
  }
  /**
   * @since 2.0.0
   */
  throw(t) {
    throw t;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new B(this.self);
  }
}
const je = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var N;
class Te {
  constructor(t) {
    /**
     * @since 3.0.6
     */
    Z(this, N);
    ee(this, N, t);
  }
  /**
   * @since 3.0.6
   */
  [je]() {
    return Q(this, N);
  }
}
N = new WeakMap();
const l = /* @__PURE__ */ D("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), M = /* @__PURE__ */ D(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), m = /* @__PURE__ */ Symbol.for("effect/Hash"), S = (e) => {
  if (l.enabled === !0)
    return 0;
  switch (typeof e) {
    case "number":
      return ie(e);
    case "bigint":
      return y(e.toString(10));
    case "boolean":
      return y(String(e));
    case "symbol":
      return y(String(e));
    case "string":
      return y(e);
    case "undefined":
      return y("undefined");
    case "function":
    case "object":
      return e === null ? y("null") : e instanceof Date ? S(e.toISOString()) : we(e) ? e[m]() : se(e);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof e} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, se = (e) => (M.has(e) || M.set(e, ie(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), M.get(e)), L = (e) => (t) => t * 53 ^ e, H = (e) => e & 3221225471 | e >>> 1 & 1073741824, we = (e) => j(e, m), ie = (e) => {
  if (e !== e || e === 1 / 0)
    return 0;
  let t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    t ^= e /= 4294967295;
  return H(t);
}, y = (e) => {
  let t = 5381, r = e.length;
  for (; r; )
    t = t * 33 ^ e.charCodeAt(--r);
  return H(t);
}, Ie = (e, t) => {
  let r = 12289;
  for (let n = 0; n < t.length; n++)
    r ^= Oe(y(t[n]), L(S(e[t[n]])));
  return H(r);
}, Re = (e) => Ie(e, Object.keys(e)), le = function() {
  if (arguments.length === 1) {
    const r = arguments[0];
    return function(n) {
      return Object.defineProperty(r, m, {
        value() {
          return n;
        },
        enumerable: !1
      }), n;
    };
  }
  const e = arguments[0], t = arguments[1];
  return Object.defineProperty(e, m, {
    value() {
      return t;
    },
    enumerable: !1
  }), t;
}, E = /* @__PURE__ */ Symbol.for("effect/Equal");
function q() {
  return arguments.length === 1 ? (e) => R(e, arguments[0]) : R(arguments[0], arguments[1]);
}
function R(e, t) {
  if (e === t)
    return !0;
  const r = typeof e;
  if (r !== typeof t)
    return !1;
  if (r === "object" || r === "function") {
    if (e !== null && t !== null) {
      if (te(e) && te(t))
        return S(e) === S(t) && e[E](t) ? !0 : l.enabled && l.tester ? l.tester(e, t) : !1;
      if (e instanceof Date && t instanceof Date)
        return e.toISOString() === t.toISOString();
    }
    if (l.enabled) {
      if (Array.isArray(e) && Array.isArray(t))
        return e.length === t.length && e.every((n, c) => R(n, t[c]));
      if (Object.getPrototypeOf(e) === Object.prototype && Object.getPrototypeOf(e) === Object.prototype) {
        const n = Object.keys(e), c = Object.keys(t);
        if (n.length === c.length) {
          for (const a of n)
            if (!(a in t && R(e[a], t[a])))
              return l.tester ? l.tester(e, t) : !1;
          return !0;
        }
      }
      return l.tester ? l.tester(e, t) : !1;
    }
  }
  return l.enabled && l.tester ? l.tester(e, t) : !1;
}
const te = (e) => j(e, E), Ce = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), G = (e) => {
  try {
    if (j(e, "toJSON") && ae(e.toJSON) && e.toJSON.length === 0)
      return e.toJSON();
    if (Array.isArray(e))
      return e.map(G);
  } catch {
    return {};
  }
  return ke(e);
}, Pe = (e) => JSON.stringify(e, null, 2), fe = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable"), $e = (e) => typeof e == "object" && e !== null && fe in e, re = /* @__PURE__ */ D("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
})), ke = (e) => $e(e) && re.fiberRefs !== void 0 ? e[fe](re.fiberRefs) : e, he = (e, t) => {
  switch (t.length) {
    case 0:
      return e;
    case 1:
      return t[0](e);
    case 2:
      return t[1](t[0](e));
    case 3:
      return t[2](t[1](t[0](e)));
    case 4:
      return t[3](t[2](t[1](t[0](e))));
    case 5:
      return t[4](t[3](t[2](t[1](t[0](e)))));
    case 6:
      return t[5](t[4](t[3](t[2](t[1](t[0](e))))));
    case 7:
      return t[6](t[5](t[4](t[3](t[2](t[1](t[0](e)))))));
    case 8:
      return t[7](t[6](t[5](t[4](t[3](t[2](t[1](t[0](e))))))));
    case 9:
      return t[8](t[7](t[6](t[5](t[4](t[3](t[2](t[1](t[0](e)))))))));
    default: {
      let r = e;
      for (let n = 0, c = t.length; n < c; n++)
        r = t[n](r);
      return r;
    }
  }
}, Me = /* @__PURE__ */ Symbol.for("effect/Effect"), Je = /* @__PURE__ */ Symbol.for("effect/Stream"), Ue = /* @__PURE__ */ Symbol.for("effect/Sink"), Ve = /* @__PURE__ */ Symbol.for("effect/Channel"), ne = {
  /* c8 ignore next */
  _R: (e) => e,
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e,
  _V: /* @__PURE__ */ oe()
}, We = {
  /* c8 ignore next */
  _A: (e) => e,
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _L: (e) => e,
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _R: (e) => e
}, Fe = {
  /* c8 ignore next */
  _Env: (e) => e,
  /* c8 ignore next */
  _InErr: (e) => e,
  /* c8 ignore next */
  _InElem: (e) => e,
  /* c8 ignore next */
  _InDone: (e) => e,
  /* c8 ignore next */
  _OutErr: (e) => e,
  /* c8 ignore next */
  _OutElem: (e) => e,
  /* c8 ignore next */
  _OutDone: (e) => e
}, De = {
  [Me]: ne,
  [Je]: ne,
  [Ue]: We,
  [Ve]: Fe,
  [E](e) {
    return this === e;
  },
  [m]() {
    return le(this, se(this));
  },
  [Symbol.iterator]() {
    return new B(new Te(this));
  },
  pipe() {
    return he(this, arguments);
  }
}, ge = {
  [m]() {
    return le(this, Re(this));
  },
  [E](e) {
    const t = Object.keys(this), r = Object.keys(e);
    if (t.length !== r.length)
      return !1;
    for (const n of t)
      if (!(n in e && q(this[n], e[n])))
        return !1;
    return !0;
  }
}, Be = (e) => e._tag === "Some", me = /* @__PURE__ */ Symbol.for("effect/Either"), Se = {
  ...De,
  [me]: {
    _R: (e) => e
  },
  [Ce]() {
    return this.toJSON();
  },
  toString() {
    return Pe(this.toJSON());
  }
}, Le = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Se), {
  _tag: "Right",
  _op: "Right",
  [E](e) {
    return K(e) && Ge(e) && q(this.right, e.right);
  },
  [m]() {
    return L(S(this._tag))(S(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: G(this.right)
    };
  }
}), He = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Se), {
  _tag: "Left",
  _op: "Left",
  [E](e) {
    return K(e) && qe(e) && q(this.left, e.left);
  },
  [m]() {
    return L(S(this._tag))(S(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: G(this.left)
    };
  }
}), K = (e) => j(e, me), qe = (e) => e._tag === "Left", Ge = (e) => e._tag === "Right", Ke = (e) => {
  const t = Object.create(He);
  return t.left = e, t;
}, Ye = (e) => {
  const t = Object.create(Le);
  return t.right = e, t;
}, O = Ye, J = Ke, ze = K, Xe = Be, U = (e) => Array.isArray(e) ? e : Array.from(e), Qe = /* @__PURE__ */ C(2, (e, t) => U(e).concat(U(t))), p = /* @__PURE__ */ C(2, (e, t) => {
  const r = U(e), n = [];
  for (let c = 0; c < r.length; c++) {
    const a = t(r[c], c);
    Xe(a) && n.push(a.value);
  }
  return n;
}), Ze = /* @__PURE__ */ Symbol.for("@effect/matcher/Matcher"), et = {
  [Ze]: {
    _input: T,
    _filters: T,
    _result: T,
    _return: T
  },
  _tag: "ValueMatcher",
  add(e) {
    return this.value._tag === "Right" ? this : e._tag === "When" && e.guard(this.provided) === !0 ? V(this.provided, O(e.evaluate(this.provided))) : e._tag === "Not" && e.guard(this.provided) === !1 ? V(this.provided, O(e.evaluate(this.provided))) : this;
  },
  pipe() {
    return he(this, arguments);
  }
};
function V(e, t) {
  const r = Object.create(et);
  return r.provided = e, r.value = t, r;
}
const tt = (e, t) => ({
  _tag: "When",
  guard: e,
  evaluate: t
}), W = (e) => {
  if (typeof e == "function")
    return e;
  if (Array.isArray(e)) {
    const t = e.map(W), r = t.length;
    return (n) => {
      if (!Array.isArray(n))
        return !1;
      for (let c = 0; c < r; c++)
        if (t[c](n[c]) === !1)
          return !1;
      return !0;
    };
  } else if (e !== null && typeof e == "object") {
    const t = Object.entries(e).map(([n, c]) => [n, W(c)]), r = t.length;
    return (n) => {
      if (typeof n != "object" || n === null)
        return !1;
      for (let c = 0; c < r; c++) {
        const [a, f] = t[c];
        if (!(a in n) || f(n[a]) === !1)
          return !1;
      }
      return !0;
    };
  }
  return (t) => t === e;
}, rt = (e) => V(e, J(e)), nt = (e, t) => (r) => r.add(tt(W(e), t)), ut = (e) => e != null, ct = (e) => (t) => {
  const r = ot(t);
  return ze(r) ? r._tag === "Right" ? r.right : e(r.left) : (n) => {
    const c = r(n);
    return c._tag === "Right" ? c.right : e(c.left);
  };
}, ot = (e) => {
  if (e._tag === "ValueMatcher")
    return e.value;
  const t = e.cases.length;
  if (t === 1) {
    const r = e.cases[0];
    return (n) => r._tag === "When" && r.guard(n) === !0 || r._tag === "Not" && r.guard(n) === !1 ? O(r.evaluate(n)) : J(n);
  }
  return (r) => {
    for (let n = 0; n < t; n++) {
      const c = e.cases[n];
      if (c._tag === "When" && c.guard(r) === !0)
        return O(c.evaluate(r));
      if (c._tag === "Not" && c.guard(r) === !1)
        return O(c.evaluate(r));
    }
    return J(r);
  };
}, at = rt, g = nt, I = ut, st = ct, it = (e) => Object.assign(Object.create(ge), e), lt = it, de = (e) => (t) => {
  const r = t === void 0 ? Object.create(ge) : lt(t);
  return r._tag = e, r;
}, ft = () => new Proxy({}, {
  get(e, t, r) {
    return t === "$is" ? Ne : t === "$match" ? ht : de(t);
  }
});
function ht() {
  if (arguments.length === 1) {
    const r = arguments[0];
    return function(n) {
      return r[n._tag](n);
    };
  }
  const e = arguments[0];
  return arguments[1][e._tag](e);
}
const o = u.optionalWith, gt = u.Struct({
  path: u.String,
  description: o(u.String, { exact: !0 })
}), mt = u.Struct({
  name: u.String,
  valueBase64Binary: o(u.String, { exact: !0 }),
  valueBoolean: o(u.String, { exact: !0 }),
  valueCanonical: o(u.String, { exact: !0 }),
  valueCode: o(u.String, { exact: !0 }),
  valueDate: o(u.String, { exact: !0 }),
  valueDateTime: o(u.String, { exact: !0 }),
  valueDecimal: o(u.String, { exact: !0 }),
  valueId: o(u.String, { exact: !0 }),
  valueInstant: o(u.Number, { exact: !0 }),
  valueInteger: o(u.Number, { exact: !0 }),
  valueOid: o(u.String, { exact: !0 }),
  valuePositiveInt: o(u.Number, { exact: !0 }),
  valueString: o(u.String, { exact: !0 }),
  valueTime: o(u.String, { exact: !0 }),
  valueUnsignedInt: o(u.Number, { exact: !0 }),
  valueUri: o(u.String, { exact: !0 }),
  valueUrl: o(u.String, { exact: !0 }),
  valueUuid: o(u.String, { exact: !0 })
}), St = mt, dt = u.Struct({
  name: u.String,
  value: u.String
}), ye = dt, _t = u.is(ye), pe = u.Struct({
  path: u.String,
  name: u.String,
  description: o(u.String, { exact: !0 }),
  collection: o(u.Boolean, { exact: !0 }),
  type: o(u.String, { exact: !0 }),
  tags: o(u.Array(ye), { exact: !0 })
}), Y = pe, Ot = pe.make, A = u.decodeOption(Y), F = u.Struct({
  column: o(u.Array(Y), {
    exact: !0
  }),
  select: o(
    u.Array(
      u.suspend(() => F)
    ),
    { exact: !0 }
  ),
  forEach: o(u.String, { exact: !0 }),
  forEachOrNull: o(u.String, { exact: !0 }),
  unionAll: o(
    u.Array(
      u.suspend(() => F)
    ),
    { exact: !0 }
  )
}), { Select: d, Column: b, ForEach: ue, ForEachOrNull: ce, UnionAll: _, $match: yt } = ft(), v = u.Union(
  u.TaggedStruct("Column", {
    column: u.Array(u.typeSchema(Y))
  }),
  u.TaggedStruct("Select", {
    select: u.Array(u.suspend(() => v))
  }),
  u.TaggedStruct("ForEach", {
    forEach: u.String,
    select: u.Array(u.suspend(() => v))
  }),
  u.TaggedStruct("ForEachOrNull", {
    forEachOrNull: u.String,
    select: u.Array(u.suspend(() => v))
  }),
  u.TaggedStruct("UnionAll", {
    unionAll: u.Array(u.suspend(() => v))
  })
);
function s(e) {
  return at(e).pipe(
    g(
      {
        forEach: I,
        forEachOrNull: I
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(e, null, 2)}`
        );
      }
    ),
    g(
      {
        forEach: I
      },
      ({ forEach: t, select: r = [], unionAll: n, column: c }) => ue({
        forEach: t,
        select: [
          ...n ? [
            _({
              unionAll: n.map(
                (a) => s(a)
              )
            })
          ] : [],
          ...c ? [
            b({
              column: p(
                c,
                (a) => A(a)
              )
            })
          ] : [],
          ...r.map(s)
        ]
      })
    ),
    g(
      {
        forEachOrNull: I
      },
      ({ forEachOrNull: t, select: r = [], unionAll: n, column: c }) => ce({
        forEachOrNull: t,
        select: [
          ...n ? [
            _({
              unionAll: n.map(
                (a) => s(a)
              )
            })
          ] : [],
          ...c ? [
            b({
              column: p(
                c,
                (a) => A(a)
              )
            })
          ] : [],
          ...r.map(s)
        ]
      })
    ),
    g(
      {
        column: Array.isArray,
        select: Array.isArray,
        unionAll: Array.isArray
      },
      ({ column: t = [], select: r = [], unionAll: n = [] }) => d({
        select: [
          _({
            unionAll: n.map(s)
          }),
          b({
            column: p(
              t,
              (c) => A(c)
            )
          }),
          ...r.map(s)
        ]
      })
    ),
    g(
      {
        unionAll: Array.isArray,
        select: Array.isArray
      },
      ({ unionAll: t = [], select: r = [] }) => d({
        select: [
          _({
            unionAll: t.map(s)
          }),
          ...r.map(s)
        ]
      })
    ),
    g(
      {
        select: Array.isArray,
        column: Array.isArray
      },
      ({ select: t = [], column: r = [] }) => d({
        select: [
          b({
            column: p(
              r,
              (n) => A(n)
            )
          }),
          ...t.map(s)
        ]
      })
    ),
    g(
      {
        column: Array.isArray,
        unionAll: Array.isArray
      },
      ({ column: t = [], unionAll: r = [], select: n = [] }) => d({
        select: [
          b({
            column: p(
              t,
              (c) => A(c)
            )
          }),
          _({
            unionAll: r.map(s)
          }),
          ...n.map(s)
        ]
      })
    ),
    g(
      {
        select: Array.isArray
      },
      ({ select: t = [] }) => d({
        select: t.map(s)
      })
    ),
    st((t) => {
      var r, n;
      return t.unionAll ? _({
        unionAll: t.unionAll.map(s)
      }) : t.column ? b({
        column: p(
          t.column,
          (c) => A(c)
        )
      }) : t.forEach ? ue({
        forEach: t.forEach,
        select: ((r = t.select) == null ? void 0 : r.map(s)) ?? []
      }) : t.forEachOrNull ? ce({
        forEachOrNull: t.forEachOrNull,
        select: ((n = t.select) == null ? void 0 : n.map(s)) ?? []
      }) : t.select ? d({
        select: t.select.map(s)
      }) : d({
        select: []
      });
    })
  );
}
const pt = u.transform(F, v, {
  strict: !0,
  encode: ({ _tag: e, ...t }) => t,
  decode: (e) => s(e)
}), vt = u.decodeSync(pt);
u.TaggedStruct("Select", {
  status: u.Literal("draft", "active", "retired", "unknown"),
  url: o(u.String, { exact: !0 }),
  name: o(u.String, { exact: !0 }),
  title: o(u.String, { exact: !0 }),
  experimental: o(u.Boolean, { exact: !0 }),
  publisher: o(u.String, { exact: !0 }),
  description: o(u.String, { exact: !0 }),
  copyright: o(u.String, { exact: !0 }),
  resource: u.String,
  constant: o(u.Array(St), {
    exact: !0
  }),
  where: o(u.Array(gt), { exact: !0 }),
  select: u.NonEmptyArray(v)
});
const Et = de("Select");
function xt(e, t = (r) => !0) {
  const r = (a, f) => yt(f, {
    ForEach: ({ select: i }) => i.flatMap((h) => r(a, h)),
    ForEachOrNull: ({ select: i }) => i.flatMap((h) => r(a, h)),
    Select: ({ select: i }) => i.flatMap((h) => r(a, h)),
    UnionAll: ({ unionAll: i }) => i.flatMap((h) => r(a, h)),
    Column: ({ column: i }) => Qe(a, i)
  });
  return r([], e).filter(t);
}
export {
  yt as $,
  b as C,
  ue as F,
  d as S,
  ye as T,
  _ as U,
  gt as W,
  ce as a,
  at as b,
  Ot as c,
  C as d,
  St as e,
  Y as f,
  s as g,
  xt as h,
  _t as i,
  vt as n,
  st as o,
  Et as v,
  g as w
};
