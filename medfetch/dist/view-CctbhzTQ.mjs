var Ae = Object.defineProperty;
var z = (e) => {
  throw TypeError(e);
};
var be = (e, t, r) => t in e ? Ae(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var M = (e, t, r) => be(e, typeof t != "symbol" ? t + "" : t, r), X = (e, t, r) => t.has(e) || z("Cannot " + r);
var Q = (e, t, r) => (X(e, t, "read from private field"), r ? r.call(e) : t.get(e)), Z = (e, t, r) => t.has(e) ? z("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), ee = (e, t, r, n) => (X(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r);
import { Schema as u } from "effect";
const _e = (e) => typeof e == "function", y = function(e, t) {
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
        return arguments.length >= 3 ? t(r, n, c) : function(o) {
          return t(o, r, n);
        };
      };
    case 4:
      return function(r, n, c, o) {
        return arguments.length >= 4 ? t(r, n, c, o) : function(f) {
          return t(f, r, n, c);
        };
      };
    case 5:
      return function(r, n, c, o, f) {
        return arguments.length >= 5 ? t(r, n, c, o, f) : function(i) {
          return t(i, r, n, c, o);
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
}, I = (e) => e;
function Oe(e, t, r, n, c, o, f, i, h) {
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
      return o(c(n(r(t(e)))));
    case 7:
      return f(o(c(n(r(t(e))))));
    case 8:
      return i(f(o(c(n(r(t(e)))))));
    case 9:
      return h(i(f(o(c(n(r(t(e))))))));
    default: {
      let $ = arguments[0];
      for (let k = 1; k < arguments.length; k++)
        $ = arguments[k]($);
      return $;
    }
  }
}
let ve = "3.14.1";
const oe = () => ve, R = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ oe()}`;
let N;
const D = (e, t) => (N || (globalThis[R] ?? (globalThis[R] = /* @__PURE__ */ new Map()), N = globalThis[R]), N.has(e) || N.set(e, t()), N.get(e)), ae = _e, Ee = (e) => typeof e == "object" && e !== null, xe = (e) => Ee(e) || ae(e), w = /* @__PURE__ */ y(2, (e, t) => xe(e) && t in e), Ne = /* @__PURE__ */ y(2, (e, t) => w(e, "_tag") && e._tag === t);
class B {
  constructor(t) {
    M(this, "self");
    M(this, "called", !1);
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
var T;
class Te {
  constructor(t) {
    /**
     * @since 3.0.6
     */
    Z(this, T);
    ee(this, T, t);
  }
  /**
   * @since 3.0.6
   */
  [je]() {
    return Q(this, T);
  }
}
T = new WeakMap();
const l = /* @__PURE__ */ D("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), J = /* @__PURE__ */ D(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), m = /* @__PURE__ */ Symbol.for("effect/Hash"), d = (e) => {
  if (l.enabled === !0)
    return 0;
  switch (typeof e) {
    case "number":
      return ie(e);
    case "bigint":
      return p(e.toString(10));
    case "boolean":
      return p(String(e));
    case "symbol":
      return p(String(e));
    case "string":
      return p(e);
    case "undefined":
      return p("undefined");
    case "function":
    case "object":
      return e === null ? p("null") : e instanceof Date ? d(e.toISOString()) : we(e) ? e[m]() : se(e);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof e} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, se = (e) => (J.has(e) || J.set(e, ie(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), J.get(e)), L = (e) => (t) => t * 53 ^ e, H = (e) => e & 3221225471 | e >>> 1 & 1073741824, we = (e) => w(e, m), ie = (e) => {
  if (e !== e || e === 1 / 0)
    return 0;
  let t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    t ^= e /= 4294967295;
  return H(t);
}, p = (e) => {
  let t = 5381, r = e.length;
  for (; r; )
    t = t * 33 ^ e.charCodeAt(--r);
  return H(t);
}, Ie = (e, t) => {
  let r = 12289;
  for (let n = 0; n < t.length; n++)
    r ^= Oe(p(t[n]), L(d(e[t[n]])));
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
}, x = /* @__PURE__ */ Symbol.for("effect/Equal");
function q() {
  return arguments.length === 1 ? (e) => P(e, arguments[0]) : P(arguments[0], arguments[1]);
}
function P(e, t) {
  if (e === t)
    return !0;
  const r = typeof e;
  if (r !== typeof t)
    return !1;
  if (r === "object" || r === "function") {
    if (e !== null && t !== null) {
      if (te(e) && te(t))
        return d(e) === d(t) && e[x](t) ? !0 : l.enabled && l.tester ? l.tester(e, t) : !1;
      if (e instanceof Date && t instanceof Date)
        return e.toISOString() === t.toISOString();
    }
    if (l.enabled) {
      if (Array.isArray(e) && Array.isArray(t))
        return e.length === t.length && e.every((n, c) => P(n, t[c]));
      if (Object.getPrototypeOf(e) === Object.prototype && Object.getPrototypeOf(e) === Object.prototype) {
        const n = Object.keys(e), c = Object.keys(t);
        if (n.length === c.length) {
          for (const o of n)
            if (!(o in t && P(e[o], t[o])))
              return l.tester ? l.tester(e, t) : !1;
          return !0;
        }
      }
      return l.tester ? l.tester(e, t) : !1;
    }
  }
  return l.enabled && l.tester ? l.tester(e, t) : !1;
}
const te = (e) => w(e, x), Ce = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), G = (e) => {
  try {
    if (w(e, "toJSON") && ae(e.toJSON) && e.toJSON.length === 0)
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
  [x](e) {
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
  [x](e) {
    const t = Object.keys(this), r = Object.keys(e);
    if (t.length !== r.length)
      return !1;
    for (const n of t)
      if (!(n in e && q(this[n], e[n])))
        return !1;
    return !0;
  }
}, Be = (e) => e._tag === "Some", me = /* @__PURE__ */ Symbol.for("effect/Either"), de = {
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
}, Le = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(de), {
  _tag: "Right",
  _op: "Right",
  [x](e) {
    return K(e) && Ge(e) && q(this.right, e.right);
  },
  [m]() {
    return L(d(this._tag))(d(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: G(this.right)
    };
  }
}), He = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(de), {
  _tag: "Left",
  _op: "Left",
  [x](e) {
    return K(e) && qe(e) && q(this.left, e.left);
  },
  [m]() {
    return L(d(this._tag))(d(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: G(this.left)
    };
  }
}), K = (e) => w(e, me), qe = (e) => e._tag === "Left", Ge = (e) => e._tag === "Right", Ke = (e) => {
  const t = Object.create(He);
  return t.left = e, t;
}, Ye = (e) => {
  const t = Object.create(Le);
  return t.right = e, t;
}, v = Ye, U = Ke, ze = K, Xe = Be, j = (e) => Array.isArray(e) ? e : Array.from(e), Qe = /* @__PURE__ */ y(2, (e, t) => j(e).concat(j(t))), Ze = (e) => e.length === 0, et = Ze, vt = /* @__PURE__ */ y(2, (e, t) => e.map(t)), Et = /* @__PURE__ */ y(2, (e, t) => {
  if (et(e))
    return [];
  const r = [];
  for (let n = 0; n < e.length; n++) {
    const c = t(e[n], n);
    for (let o = 0; o < c.length; o++)
      r.push(c[o]);
  }
  return r;
}), A = /* @__PURE__ */ y(2, (e, t) => {
  const r = j(e), n = [];
  for (let c = 0; c < r.length; c++) {
    const o = t(r[c], c);
    Xe(o) && n.push(o.value);
  }
  return n;
}), xt = /* @__PURE__ */ y(2, (e, t) => {
  const r = j(e), n = [];
  for (let c = 0; c < r.length; c++)
    t(r[c], c) && n.push(r[c]);
  return n;
}), Nt = /* @__PURE__ */ y(3, (e, t, r) => j(e).reduce((n, c, o) => r(n, c, o), t)), tt = /* @__PURE__ */ Symbol.for("@effect/matcher/Matcher"), rt = {
  [tt]: {
    _input: I,
    _filters: I,
    _result: I,
    _return: I
  },
  _tag: "ValueMatcher",
  add(e) {
    return this.value._tag === "Right" ? this : e._tag === "When" && e.guard(this.provided) === !0 ? V(this.provided, v(e.evaluate(this.provided))) : e._tag === "Not" && e.guard(this.provided) === !1 ? V(this.provided, v(e.evaluate(this.provided))) : this;
  },
  pipe() {
    return he(this, arguments);
  }
};
function V(e, t) {
  const r = Object.create(rt);
  return r.provided = e, r.value = t, r;
}
const nt = (e, t) => ({
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
        const [o, f] = t[c];
        if (!(o in n) || f(n[o]) === !1)
          return !1;
      }
      return !0;
    };
  }
  return (t) => t === e;
}, ut = (e) => V(e, U(e)), ct = (e, t) => (r) => r.add(nt(W(e), t)), ot = (e) => e != null, at = (e) => (t) => {
  const r = st(t);
  return ze(r) ? r._tag === "Right" ? r.right : e(r.left) : (n) => {
    const c = r(n);
    return c._tag === "Right" ? c.right : e(c.left);
  };
}, st = (e) => {
  if (e._tag === "ValueMatcher")
    return e.value;
  const t = e.cases.length;
  if (t === 1) {
    const r = e.cases[0];
    return (n) => r._tag === "When" && r.guard(n) === !0 || r._tag === "Not" && r.guard(n) === !1 ? v(r.evaluate(n)) : U(n);
  }
  return (r) => {
    for (let n = 0; n < t; n++) {
      const c = e.cases[n];
      if (c._tag === "When" && c.guard(r) === !0)
        return v(c.evaluate(r));
      if (c._tag === "Not" && c.guard(r) === !1)
        return v(c.evaluate(r));
    }
    return U(r);
  };
}, it = ut, g = ct, C = ot, lt = at, ft = (e) => Object.assign(Object.create(ge), e), ht = ft, ye = (e) => (t) => {
  const r = t === void 0 ? Object.create(ge) : ht(t);
  return r._tag = e, r;
}, gt = () => new Proxy({}, {
  get(e, t, r) {
    return t === "$is" ? Ne : t === "$match" ? mt : ye(t);
  }
});
function mt() {
  if (arguments.length === 1) {
    const r = arguments[0];
    return function(n) {
      return r[n._tag](n);
    };
  }
  const e = arguments[0];
  return arguments[1][e._tag](e);
}
const a = u.optionalWith, dt = u.Struct({
  path: u.String,
  description: a(u.String, { exact: !0 })
}), yt = u.Struct({
  name: u.String,
  valueBase64Binary: a(u.String, { exact: !0 }),
  valueBoolean: a(u.String, { exact: !0 }),
  valueCanonical: a(u.String, { exact: !0 }),
  valueCode: a(u.String, { exact: !0 }),
  valueDate: a(u.String, { exact: !0 }),
  valueDateTime: a(u.String, { exact: !0 }),
  valueDecimal: a(u.String, { exact: !0 }),
  valueId: a(u.String, { exact: !0 }),
  valueInstant: a(u.Number, { exact: !0 }),
  valueInteger: a(u.Number, { exact: !0 }),
  valueOid: a(u.String, { exact: !0 }),
  valuePositiveInt: a(u.Number, { exact: !0 }),
  valueString: a(u.String, { exact: !0 }),
  valueTime: a(u.String, { exact: !0 }),
  valueUnsignedInt: a(u.Number, { exact: !0 }),
  valueUri: a(u.String, { exact: !0 }),
  valueUrl: a(u.String, { exact: !0 }),
  valueUuid: a(u.String, { exact: !0 })
}), St = yt, pt = u.Struct({
  name: u.String,
  value: u.String
}), Se = pt, jt = u.is(Se), pe = u.Struct({
  path: u.String,
  name: u.String,
  description: a(u.String, { exact: !0 }),
  collection: a(u.Boolean, { exact: !0 }),
  type: a(u.String, { exact: !0 }),
  tags: a(u.Array(Se), { exact: !0 })
}), Y = pe, Tt = pe.make, b = u.decodeOption(Y), F = u.Struct({
  column: a(u.Array(Y), {
    exact: !0
  }),
  select: a(
    u.Array(
      u.suspend(() => F)
    ),
    { exact: !0 }
  ),
  forEach: a(u.String, { exact: !0 }),
  forEachOrNull: a(u.String, { exact: !0 }),
  unionAll: a(
    u.Array(
      u.suspend(() => F)
    ),
    { exact: !0 }
  )
}), { Select: S, Column: _, ForEach: ue, ForEachOrNull: ce, UnionAll: O, $match: At } = gt(), E = u.Union(
  u.TaggedStruct("Column", {
    column: u.Array(u.typeSchema(Y))
  }),
  u.TaggedStruct("Select", {
    select: u.Array(u.suspend(() => E))
  }),
  u.TaggedStruct("ForEach", {
    forEach: u.String,
    select: u.Array(u.suspend(() => E))
  }),
  u.TaggedStruct("ForEachOrNull", {
    forEachOrNull: u.String,
    select: u.Array(u.suspend(() => E))
  }),
  u.TaggedStruct("UnionAll", {
    unionAll: u.Array(u.suspend(() => E))
  })
);
function s(e) {
  return it(e).pipe(
    g(
      {
        forEach: C,
        forEachOrNull: C
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(e, null, 2)}`
        );
      }
    ),
    g(
      {
        forEach: C
      },
      ({ forEach: t, select: r = [], unionAll: n, column: c }) => ue({
        forEach: t,
        select: [
          ...n ? [
            O({
              unionAll: n.map(
                (o) => s(o)
              )
            })
          ] : [],
          ...c ? [
            _({
              column: A(
                c,
                (o) => b(o)
              )
            })
          ] : [],
          ...r.map(s)
        ]
      })
    ),
    g(
      {
        forEachOrNull: C
      },
      ({ forEachOrNull: t, select: r = [], unionAll: n, column: c }) => ce({
        forEachOrNull: t,
        select: [
          ...n ? [
            O({
              unionAll: n.map(
                (o) => s(o)
              )
            })
          ] : [],
          ...c ? [
            _({
              column: A(
                c,
                (o) => b(o)
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
      ({ column: t = [], select: r = [], unionAll: n = [] }) => S({
        select: [
          O({
            unionAll: n.map(s)
          }),
          _({
            column: A(
              t,
              (c) => b(c)
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
      ({ unionAll: t = [], select: r = [] }) => S({
        select: [
          O({
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
      ({ select: t = [], column: r = [] }) => S({
        select: [
          _({
            column: A(
              r,
              (n) => b(n)
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
      ({ column: t = [], unionAll: r = [], select: n = [] }) => S({
        select: [
          _({
            column: A(
              t,
              (c) => b(c)
            )
          }),
          O({
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
      ({ select: t = [] }) => S({
        select: t.map(s)
      })
    ),
    lt((t) => {
      var r, n;
      return t.unionAll ? O({
        unionAll: t.unionAll.map(s)
      }) : t.column ? _({
        column: A(
          t.column,
          (c) => b(c)
        )
      }) : t.forEach ? ue({
        forEach: t.forEach,
        select: ((r = t.select) == null ? void 0 : r.map(s)) ?? []
      }) : t.forEachOrNull ? ce({
        forEachOrNull: t.forEachOrNull,
        select: ((n = t.select) == null ? void 0 : n.map(s)) ?? []
      }) : t.select ? S({
        select: t.select.map(s)
      }) : S({
        select: []
      });
    })
  );
}
const bt = u.transform(F, E, {
  strict: !0,
  encode: ({ _tag: e, ...t }) => t,
  decode: (e) => s(e)
}), wt = u.decodeSync(bt);
u.TaggedStruct("Select", {
  status: u.Literal("draft", "active", "retired", "unknown"),
  url: a(u.String, { exact: !0 }),
  name: a(u.String, { exact: !0 }),
  title: a(u.String, { exact: !0 }),
  experimental: a(u.Boolean, { exact: !0 }),
  publisher: a(u.String, { exact: !0 }),
  description: a(u.String, { exact: !0 }),
  copyright: a(u.String, { exact: !0 }),
  resource: u.String,
  constant: a(u.Array(St), {
    exact: !0
  }),
  where: a(u.Array(dt), { exact: !0 }),
  select: u.NonEmptyArray(E)
});
const It = ye("Select");
function Rt(e, t = (r) => !0) {
  const r = (o, f) => At(f, {
    ForEach: ({ select: i }) => i.flatMap((h) => r(o, h)),
    ForEachOrNull: ({ select: i }) => i.flatMap((h) => r(o, h)),
    Select: ({ select: i }) => i.flatMap((h) => r(o, h)),
    UnionAll: ({ unionAll: i }) => i.flatMap((h) => r(o, h)),
    Column: ({ column: i }) => Qe(o, i)
  });
  return r([], e).filter(t);
}
export {
  At as $,
  _ as C,
  ue as F,
  S,
  Se as T,
  O as U,
  dt as W,
  ce as a,
  Et as b,
  Tt as c,
  y as d,
  it as e,
  xt as f,
  St as g,
  Y as h,
  jt as i,
  s as j,
  Rt as k,
  vt as m,
  wt as n,
  lt as o,
  Nt as r,
  It as v,
  g as w
};
