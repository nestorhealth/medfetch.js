var dr = Object.defineProperty;
var he = (t) => {
  throw TypeError(t);
};
var mr = (t, e, r) => e in t ? dr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : t[e] = r;
var f = (t, e, r) => mr(t, typeof e != "symbol" ? e + "" : e, r), ge = (t, e, r) => e.has(t) || he("Cannot " + r);
var pe = (t, e, r) => (ge(t, e, "read from private field"), r ? r.call(t) : e.get(t)), de = (t, e, r) => e.has(t) ? he("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), me = (t, e, r, n) => (ge(t, e, "write to private field"), n ? n.call(t, r) : e.set(t, r), r);
import { Schema as u } from "effect";
const yr = (t) => typeof t == "function", m = function(t, e) {
  if (typeof t == "function")
    return function() {
      return t(arguments) ? e.apply(this, arguments) : (r) => e(r, ...arguments);
    };
  switch (t) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${t}`);
    case 2:
      return function(r, n) {
        return arguments.length >= 2 ? e(r, n) : function(s) {
          return e(s, r);
        };
      };
    case 3:
      return function(r, n, s) {
        return arguments.length >= 3 ? e(r, n, s) : function(i) {
          return e(i, r, n);
        };
      };
    case 4:
      return function(r, n, s, i) {
        return arguments.length >= 4 ? e(r, n, s, i) : function(o) {
          return e(o, r, n, s);
        };
      };
    case 5:
      return function(r, n, s, i, o) {
        return arguments.length >= 5 ? e(r, n, s, i, o) : function(a) {
          return e(a, r, n, s, i);
        };
      };
    default:
      return function() {
        if (arguments.length >= t)
          return e.apply(this, arguments);
        const r = arguments;
        return function(n) {
          return e(n, ...r);
        };
      };
  }
}, pt = (t) => t, Gt = (t) => () => t, ye = /* @__PURE__ */ Gt(!0), _e = /* @__PURE__ */ Gt(!1), _r = /* @__PURE__ */ Gt(void 0);
function _(t, e, r, n, s, i, o, a, c) {
  switch (arguments.length) {
    case 1:
      return t;
    case 2:
      return e(t);
    case 3:
      return r(e(t));
    case 4:
      return n(r(e(t)));
    case 5:
      return s(n(r(e(t))));
    case 6:
      return i(s(n(r(e(t)))));
    case 7:
      return o(i(s(n(r(e(t))))));
    case 8:
      return a(o(i(s(n(r(e(t)))))));
    case 9:
      return c(a(o(i(s(n(r(e(t))))))));
    default: {
      let l = arguments[0];
      for (let g = 1; g < arguments.length; g++)
        l = arguments[g](l);
      return l;
    }
  }
}
const Sr = (t) => (e, r) => e === r || t(e, r);
let br = "3.14.1";
const Me = () => br, dt = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ Me()}`;
let nt;
const kt = (t, e) => (nt || (globalThis[dt] ?? (globalThis[dt] = /* @__PURE__ */ new Map()), nt = globalThis[dt]), nt.has(t) || nt.set(t, e()), nt.get(t)), Kt = yr, vr = (t) => typeof t == "object" && t !== null, Pe = (t) => vr(t) || Kt(t), C = /* @__PURE__ */ m(2, (t, e) => Pe(t) && e in t), xe = /* @__PURE__ */ m(2, (t, e) => C(t, "_tag") && t._tag === e), Le = (t) => `BUG: ${t} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let Er = class Je {
  constructor(e) {
    f(this, "self");
    f(this, "called", !1);
    this.self = e;
  }
  /**
   * @since 2.0.0
   */
  next(e) {
    return this.called ? {
      value: e,
      done: !0
    } : (this.called = !0, {
      value: this.self,
      done: !1
    });
  }
  /**
   * @since 2.0.0
   */
  return(e) {
    return {
      value: e,
      done: !0
    };
  }
  /**
   * @since 2.0.0
   */
  throw(e) {
    throw e;
  }
  /**
   * @since 2.0.0
   */
  [Symbol.iterator]() {
    return new Je(this.self);
  }
};
const Or = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var ft;
class Yt {
  constructor(e) {
    /**
     * @since 3.0.6
     */
    de(this, ft);
    me(this, ft, e);
  }
  /**
   * @since 3.0.6
   */
  [Or]() {
    return pe(this, ft);
  }
}
ft = new WeakMap();
const A = /* @__PURE__ */ kt("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), jt = /* @__PURE__ */ kt(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), b = /* @__PURE__ */ Symbol.for("effect/Hash"), d = (t) => {
  if (A.enabled === !0)
    return 0;
  switch (typeof t) {
    case "number":
      return Re(t);
    case "bigint":
      return J(t.toString(10));
    case "boolean":
      return J(String(t));
    case "symbol":
      return J(String(t));
    case "string":
      return J(t);
    case "undefined":
      return J("undefined");
    case "function":
    case "object":
      return t === null ? J("null") : t instanceof Date ? d(t.toISOString()) : wr(t) ? t[b]() : Xt(t);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof t} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, Xt = (t) => (jt.has(t) || jt.set(t, Re(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), jt.get(t)), M = (t) => (e) => e * 53 ^ t, At = (t) => t & 3221225471 | t >>> 1 & 1073741824, wr = (t) => C(t, b), Re = (t) => {
  if (t !== t || t === 1 / 0)
    return 0;
  let e = t | 0;
  for (e !== t && (e ^= t * 4294967295); t > 4294967295; )
    e ^= t /= 4294967295;
  return At(e);
}, J = (t) => {
  let e = 5381, r = t.length;
  for (; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return At(e);
}, kr = (t, e) => {
  let r = 12289;
  for (let n = 0; n < e.length; n++)
    r ^= _(J(e[n]), M(d(t[e[n]])));
  return At(r);
}, Ar = (t) => kr(t, Object.keys(t)), Cr = (t) => {
  let e = 6151;
  for (let r = 0; r < t.length; r++)
    e = _(e, M(d(t[r])));
  return At(e);
}, P = function() {
  if (arguments.length === 1) {
    const r = arguments[0];
    return function(n) {
      return Object.defineProperty(r, b, {
        value() {
          return n;
        },
        enumerable: !1
      }), n;
    };
  }
  const t = arguments[0], e = arguments[1];
  return Object.defineProperty(t, b, {
    value() {
      return e;
    },
    enumerable: !1
  }), e;
}, O = /* @__PURE__ */ Symbol.for("effect/Equal");
function k() {
  return arguments.length === 1 ? (t) => _t(t, arguments[0]) : _t(arguments[0], arguments[1]);
}
function _t(t, e) {
  if (t === e)
    return !0;
  const r = typeof t;
  if (r !== typeof e)
    return !1;
  if (r === "object" || r === "function") {
    if (t !== null && e !== null) {
      if (Se(t) && Se(e))
        return d(t) === d(e) && t[O](e) ? !0 : A.enabled && A.tester ? A.tester(t, e) : !1;
      if (t instanceof Date && e instanceof Date)
        return t.toISOString() === e.toISOString();
    }
    if (A.enabled) {
      if (Array.isArray(t) && Array.isArray(e))
        return t.length === e.length && t.every((n, s) => _t(n, e[s]));
      if (Object.getPrototypeOf(t) === Object.prototype && Object.getPrototypeOf(t) === Object.prototype) {
        const n = Object.keys(t), s = Object.keys(e);
        if (n.length === s.length) {
          for (const i of n)
            if (!(i in e && _t(t[i], e[i])))
              return A.tester ? A.tester(t, e) : !1;
          return !0;
        }
      }
      return A.tester ? A.tester(t, e) : !1;
    }
  }
  return A.enabled && A.tester ? A.tester(t, e) : !1;
}
const Se = (t) => C(t, O), x = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), E = (t) => {
  try {
    if (C(t, "toJSON") && Kt(t.toJSON) && t.toJSON.length === 0)
      return t.toJSON();
    if (Array.isArray(t))
      return t.map(E);
  } catch {
    return {};
  }
  return Nr(t);
}, B = (t) => JSON.stringify(t, null, 2), Ir = (t, e) => {
  let r = [];
  const n = JSON.stringify(t, (s, i) => typeof i == "object" && i !== null ? r.includes(i) ? void 0 : r.push(i) && (St.fiberRefs !== void 0 && Fe(i) ? i[Qt](St.fiberRefs) : i) : i, e);
  return r = void 0, n;
}, Qt = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable"), Fe = (t) => typeof t == "object" && t !== null && Qt in t, St = /* @__PURE__ */ kt("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
})), Nr = (t) => Fe(t) && St.fiberRefs !== void 0 ? t[Qt](St.fiberRefs) : t, H = (t, e) => {
  switch (e.length) {
    case 0:
      return t;
    case 1:
      return e[0](t);
    case 2:
      return e[1](e[0](t));
    case 3:
      return e[2](e[1](e[0](t)));
    case 4:
      return e[3](e[2](e[1](e[0](t))));
    case 5:
      return e[4](e[3](e[2](e[1](e[0](t)))));
    case 6:
      return e[5](e[4](e[3](e[2](e[1](e[0](t))))));
    case 7:
      return e[6](e[5](e[4](e[3](e[2](e[1](e[0](t)))))));
    case 8:
      return e[7](e[6](e[5](e[4](e[3](e[2](e[1](e[0](t))))))));
    case 9:
      return e[8](e[7](e[6](e[5](e[4](e[3](e[2](e[1](e[0](t)))))))));
    default: {
      let r = t;
      for (let n = 0, s = e.length; n < s; n++)
        r = e[n](r);
      return r;
    }
  }
}, $r = "Commit", Tr = "Failure", jr = "WithRuntime", Mr = /* @__PURE__ */ Symbol.for("effect/Effect"), Pr = /* @__PURE__ */ Symbol.for("effect/Stream"), xr = /* @__PURE__ */ Symbol.for("effect/Sink"), Lr = /* @__PURE__ */ Symbol.for("effect/Channel"), bt = {
  /* c8 ignore next */
  _R: (t) => t,
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _A: (t) => t,
  _V: /* @__PURE__ */ Me()
}, Jr = {
  /* c8 ignore next */
  _A: (t) => t,
  /* c8 ignore next */
  _In: (t) => t,
  /* c8 ignore next */
  _L: (t) => t,
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
}, Rr = {
  /* c8 ignore next */
  _Env: (t) => t,
  /* c8 ignore next */
  _InErr: (t) => t,
  /* c8 ignore next */
  _InElem: (t) => t,
  /* c8 ignore next */
  _InDone: (t) => t,
  /* c8 ignore next */
  _OutErr: (t) => t,
  /* c8 ignore next */
  _OutElem: (t) => t,
  /* c8 ignore next */
  _OutDone: (t) => t
}, Zt = {
  [Mr]: bt,
  [Pr]: bt,
  [xr]: Jr,
  [Lr]: Rr,
  [O](t) {
    return this === t;
  },
  [b]() {
    return P(this, Xt(this));
  },
  [Symbol.iterator]() {
    return new Er(new Yt(this));
  },
  pipe() {
    return H(this, arguments);
  }
}, te = {
  [b]() {
    return P(this, Ar(this));
  },
  [O](t) {
    const e = Object.keys(this), r = Object.keys(t);
    if (e.length !== r.length)
      return !1;
    for (const n of e)
      if (!(n in t && k(this[n], t[n])))
        return !1;
    return !0;
  }
}, Fr = {
  ...Zt,
  _op: $r
}, Hr = {
  ...Fr,
  ...te
}, He = /* @__PURE__ */ Symbol.for("effect/Option"), Ue = {
  ...Zt,
  [He]: {
    _A: (t) => t
  },
  [x]() {
    return this.toJSON();
  },
  toString() {
    return B(this.toJSON());
  }
}, Ur = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ue), {
  _tag: "Some",
  _op: "Some",
  [O](t) {
    return qe(t) && Be(t) && k(this.value, t.value);
  },
  [b]() {
    return P(this, M(d(this._tag))(d(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: E(this.value)
    };
  }
}), qr = /* @__PURE__ */ d("None"), Wr = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ue), {
  _tag: "None",
  _op: "None",
  [O](t) {
    return qe(t) && We(t);
  },
  [b]() {
    return qr;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
}), qe = (t) => C(t, He), We = (t) => t._tag === "None", Be = (t) => t._tag === "Some", Br = /* @__PURE__ */ Object.create(Wr), Dr = (t) => {
  const e = Object.create(Ur);
  return e.value = t, e;
}, De = /* @__PURE__ */ Symbol.for("effect/Either"), Ve = {
  ...Zt,
  [De]: {
    _R: (t) => t
  },
  [x]() {
    return this.toJSON();
  },
  toString() {
    return B(this.toJSON());
  }
}, Vr = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ve), {
  _tag: "Right",
  _op: "Right",
  [O](t) {
    return ee(t) && Kr(t) && k(this.right, t.right);
  },
  [b]() {
    return M(d(this._tag))(d(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: E(this.right)
    };
  }
}), zr = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Ve), {
  _tag: "Left",
  _op: "Left",
  [O](t) {
    return ee(t) && Gr(t) && k(this.left, t.left);
  },
  [b]() {
    return M(d(this._tag))(d(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: E(this.left)
    };
  }
}), ee = (t) => C(t, De), Gr = (t) => t._tag === "Left", Kr = (t) => t._tag === "Right", Yr = (t) => {
  const e = Object.create(zr);
  return e.left = t, e;
}, Xr = (t) => {
  const e = Object.create(Vr);
  return e.right = t, e;
}, N = Xr, it = Yr, Qr = ee, I = () => Br, ot = Dr, j = We, Z = Be, Zr = /* @__PURE__ */ m(2, (t, e) => j(t) ? e() : t.value), tn = /* @__PURE__ */ Zr(_r), vt = (t) => Array.isArray(t) ? t : Array.from(t), en = /* @__PURE__ */ m(2, (t, e) => vt(t).concat(vt(e))), be = (t) => Array.from(t).reverse(), D = /* @__PURE__ */ m(2, (t, e) => {
  const r = vt(t), n = [];
  for (let s = 0; s < r.length; s++) {
    const i = e(r[s], s);
    Z(i) && n.push(i.value);
  }
  return n;
}), rn = /* @__PURE__ */ m(3, (t, e, r) => vt(t).reduce((n, s, i) => r(n, s, i), e)), nn = /* @__PURE__ */ Symbol.for("@effect/matcher/Matcher"), sn = {
  [nn]: {
    _input: pt,
    _filters: pt,
    _result: pt,
    _return: pt
  },
  _tag: "ValueMatcher",
  add(t) {
    return this.value._tag === "Right" ? this : t._tag === "When" && t.guard(this.provided) === !0 ? xt(this.provided, N(t.evaluate(this.provided))) : t._tag === "Not" && t.guard(this.provided) === !1 ? xt(this.provided, N(t.evaluate(this.provided))) : this;
  },
  pipe() {
    return H(this, arguments);
  }
};
function xt(t, e) {
  const r = Object.create(sn);
  return r.provided = t, r.value = e, r;
}
const on = (t, e) => ({
  _tag: "When",
  guard: t,
  evaluate: e
}), Lt = (t) => {
  if (typeof t == "function")
    return t;
  if (Array.isArray(t)) {
    const e = t.map(Lt), r = e.length;
    return (n) => {
      if (!Array.isArray(n))
        return !1;
      for (let s = 0; s < r; s++)
        if (e[s](n[s]) === !1)
          return !1;
      return !0;
    };
  } else if (t !== null && typeof t == "object") {
    const e = Object.entries(t).map(([n, s]) => [n, Lt(s)]), r = e.length;
    return (n) => {
      if (typeof n != "object" || n === null)
        return !1;
      for (let s = 0; s < r; s++) {
        const [i, o] = e[s];
        if (!(i in n) || o(n[i]) === !1)
          return !1;
      }
      return !0;
    };
  }
  return (e) => e === t;
}, cn = (t) => xt(t, it(t)), an = (t, e) => (r) => r.add(on(Lt(t), e)), un = (t) => t != null, ln = (t) => (e) => {
  const r = fn(e);
  return Qr(r) ? r._tag === "Right" ? r.right : t(r.left) : (n) => {
    const s = r(n);
    return s._tag === "Right" ? s.right : t(s.left);
  };
}, fn = (t) => {
  if (t._tag === "ValueMatcher")
    return t.value;
  const e = t.cases.length;
  if (e === 1) {
    const r = t.cases[0];
    return (n) => r._tag === "When" && r.guard(n) === !0 || r._tag === "Not" && r.guard(n) === !1 ? N(r.evaluate(n)) : it(n);
  }
  return (r) => {
    for (let n = 0; n < e; n++) {
      const s = t.cases[n];
      if (s._tag === "When" && s.guard(r) === !0)
        return N(s.evaluate(r));
      if (s._tag === "Not" && s.guard(r) === !1)
        return N(s.evaluate(r));
    }
    return it(r);
  };
}, hn = cn, L = an, mt = un, gn = ln, ze = /* @__PURE__ */ Symbol.for("effect/Chunk");
function pn(t, e, r, n, s) {
  for (let i = e; i < Math.min(t.length, e + s); i++)
    r[n + i - e] = t[i];
  return r;
}
const Ge = [], dn = (t) => Sr((e, r) => e.length === r.length && st(e).every((n, s) => t(n, X(r, s)))), mn = /* @__PURE__ */ dn(k), yn = {
  [ze]: {
    _A: (t) => t
  },
  toString() {
    return B(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: st(this).map(E)
    };
  },
  [x]() {
    return this.toJSON();
  },
  [O](t) {
    return _n(t) && mn(this, t);
  },
  [b]() {
    return P(this, Cr(st(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray":
        return this.backing.array[Symbol.iterator]();
      case "IEmpty":
        return Ge[Symbol.iterator]();
      default:
        return st(this)[Symbol.iterator]();
    }
  },
  pipe() {
    return H(this, arguments);
  }
}, S = (t) => {
  const e = Object.create(yn);
  switch (e.backing = t, t._tag) {
    case "IEmpty": {
      e.length = 0, e.depth = 0, e.left = e, e.right = e;
      break;
    }
    case "IConcat": {
      e.length = t.left.length + t.right.length, e.depth = 1 + Math.max(t.left.depth, t.right.depth), e.left = t.left, e.right = t.right;
      break;
    }
    case "IArray": {
      e.length = t.array.length, e.depth = 0, e.left = T, e.right = T;
      break;
    }
    case "ISingleton": {
      e.length = 1, e.depth = 0, e.left = T, e.right = T;
      break;
    }
    case "ISlice": {
      e.length = t.length, e.depth = t.chunk.depth + 1, e.left = T, e.right = T;
      break;
    }
  }
  return e;
}, _n = (t) => C(t, ze), T = /* @__PURE__ */ S({
  _tag: "IEmpty"
}), tt = () => T, Mt = (...t) => vn(t), ct = (t) => S({
  _tag: "ISingleton",
  a: t
}), Jt = (t, e, r) => {
  switch (t.backing._tag) {
    case "IArray": {
      pn(t.backing.array, 0, e, r, t.length);
      break;
    }
    case "IConcat": {
      Jt(t.left, e, r), Jt(t.right, e, r + t.left.length);
      break;
    }
    case "ISingleton": {
      e[r] = t.backing.a;
      break;
    }
    case "ISlice": {
      let n = 0, s = r;
      for (; n < t.length; )
        e[s] = X(t, n), n += 1, s += 1;
      break;
    }
  }
}, Sn = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
      return Ge;
    case "IArray":
      return t.backing.array;
    default: {
      const e = new Array(t.length);
      return Jt(t, e, 0), t.backing = {
        _tag: "IArray",
        array: e
      }, t.left = T, t.right = T, t.depth = 0, e;
    }
  }
}, st = Sn, bn = (t) => {
  switch (t.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return t;
    case "IArray":
      return S({
        _tag: "IArray",
        array: be(t.backing.array)
      });
    case "IConcat":
      return S({
        _tag: "IConcat",
        left: Rt(t.backing.right),
        right: Rt(t.backing.left)
      });
    case "ISlice":
      return Ke(be(st(t)));
  }
}, Rt = bn, Ke = (t) => t.length === 0 ? tt() : t.length === 1 ? ct(t[0]) : S({
  _tag: "IArray",
  array: t
}), vn = (t) => Ke(t), X = /* @__PURE__ */ m(2, (t, e) => {
  switch (t.backing._tag) {
    case "IEmpty":
      throw new Error("Index out of bounds");
    case "ISingleton": {
      if (e !== 0)
        throw new Error("Index out of bounds");
      return t.backing.a;
    }
    case "IArray": {
      if (e >= t.length || e < 0)
        throw new Error("Index out of bounds");
      return t.backing.array[e];
    }
    case "IConcat":
      return e < t.left.length ? X(t.left, e) : X(t.right, e - t.left.length);
    case "ISlice":
      return X(t.backing.chunk, e + t.backing.offset);
  }
}), Ye = /* @__PURE__ */ m(2, (t, e) => R(ct(e), t)), R = /* @__PURE__ */ m(2, (t, e) => {
  if (t.backing._tag === "IEmpty")
    return e;
  if (e.backing._tag === "IEmpty")
    return t;
  const r = e.depth - t.depth;
  if (Math.abs(r) <= 1)
    return S({
      _tag: "IConcat",
      left: t,
      right: e
    });
  if (r < -1)
    if (t.left.depth >= t.right.depth) {
      const n = R(t.right, e);
      return S({
        _tag: "IConcat",
        left: t.left,
        right: n
      });
    } else {
      const n = R(t.right.right, e);
      if (n.depth === t.depth - 3) {
        const s = S({
          _tag: "IConcat",
          left: t.right.left,
          right: n
        });
        return S({
          _tag: "IConcat",
          left: t.left,
          right: s
        });
      } else {
        const s = S({
          _tag: "IConcat",
          left: t.left,
          right: t.right.left
        });
        return S({
          _tag: "IConcat",
          left: s,
          right: n
        });
      }
    }
  else if (e.right.depth >= e.left.depth) {
    const n = R(t, e.left);
    return S({
      _tag: "IConcat",
      left: n,
      right: e.right
    });
  } else {
    const n = R(t, e.left.left);
    if (n.depth === e.depth - 3) {
      const s = S({
        _tag: "IConcat",
        left: n,
        right: e.left.right
      });
      return S({
        _tag: "IConcat",
        left: s,
        right: e.right
      });
    } else {
      const s = S({
        _tag: "IConcat",
        left: e.left.right,
        right: e.right
      });
      return S({
        _tag: "IConcat",
        left: n,
        right: s
      });
    }
  }
}), En = (t) => t.length === 0, ve = (t) => t.length > 0, On = (t) => X(t, 0), Ee = On, W = 5, re = /* @__PURE__ */ Math.pow(2, W), wn = re - 1, kn = re / 2, An = re / 4;
function Cn(t) {
  return t -= t >> 1 & 1431655765, t = (t & 858993459) + (t >> 2 & 858993459), t = t + (t >> 4) & 252645135, t += t >> 8, t += t >> 16, t & 127;
}
function et(t, e) {
  return e >>> t & wn;
}
function K(t) {
  return 1 << t;
}
function Xe(t, e) {
  return Cn(t & e - 1);
}
const In = (t, e) => ({
  value: t,
  previous: e
});
function Q(t, e, r, n) {
  let s = n;
  if (!t) {
    const i = n.length;
    s = new Array(i);
    for (let o = 0; o < i; ++o) s[o] = n[o];
  }
  return s[e] = r, s;
}
function Qe(t, e, r) {
  const n = r.length - 1;
  let s = 0, i = 0, o = r;
  if (t)
    s = i = e;
  else
    for (o = new Array(n); s < e; ) o[i++] = r[s++];
  for (++s; s <= n; ) o[i++] = r[s++];
  return t && (o.length = n), o;
}
function Nn(t, e, r, n) {
  const s = n.length;
  if (t) {
    let c = s;
    for (; c >= e; ) n[c--] = n[c];
    return n[e] = r, n;
  }
  let i = 0, o = 0;
  const a = new Array(s + 1);
  for (; i < e; ) a[o++] = n[i++];
  for (a[e] = r; i < s; ) a[++o] = n[i++];
  return a;
}
class F {
  constructor() {
    f(this, "_tag", "EmptyNode");
  }
  modify(e, r, n, s, i, o) {
    const a = n(I());
    return j(a) ? new F() : (++o.value, new q(e, s, i, a));
  }
}
function $(t) {
  return xe(t, "EmptyNode");
}
function $n(t) {
  return $(t) || t._tag === "LeafNode" || t._tag === "CollisionNode";
}
function Ct(t, e) {
  return $(t) ? !1 : e === t.edit;
}
class q {
  constructor(e, r, n, s) {
    f(this, "edit");
    f(this, "hash");
    f(this, "key");
    f(this, "value");
    f(this, "_tag", "LeafNode");
    this.edit = e, this.hash = r, this.key = n, this.value = s;
  }
  modify(e, r, n, s, i, o) {
    if (k(i, this.key)) {
      const c = n(this.value);
      return c === this.value ? this : j(c) ? (--o.value, new F()) : Ct(this, e) ? (this.value = c, this) : new q(e, s, i, c);
    }
    const a = n(I());
    return j(a) ? this : (++o.value, Ze(e, r, this.hash, this, s, new q(e, s, i, a)));
  }
}
class ne {
  constructor(e, r, n) {
    f(this, "edit");
    f(this, "hash");
    f(this, "children");
    f(this, "_tag", "CollisionNode");
    this.edit = e, this.hash = r, this.children = n;
  }
  modify(e, r, n, s, i, o) {
    if (s === this.hash) {
      const c = Ct(this, e), l = this.updateCollisionList(c, e, this.hash, this.children, n, i, o);
      return l === this.children ? this : l.length > 1 ? new ne(e, this.hash, l) : l[0];
    }
    const a = n(I());
    return j(a) ? this : (++o.value, Ze(e, r, this.hash, this, s, new q(e, s, i, a)));
  }
  updateCollisionList(e, r, n, s, i, o, a) {
    const c = s.length;
    for (let g = 0; g < c; ++g) {
      const p = s[g];
      if ("key" in p && k(o, p.key)) {
        const w = p.value, v = i(w);
        return v === w ? s : j(v) ? (--a.value, Qe(e, g, s)) : Q(e, g, new q(r, n, o, v), s);
      }
    }
    const l = i(I());
    return j(l) ? s : (++a.value, Q(e, c, new q(r, n, o, l), s));
  }
}
class rt {
  constructor(e, r, n) {
    f(this, "edit");
    f(this, "mask");
    f(this, "children");
    f(this, "_tag", "IndexedNode");
    this.edit = e, this.mask = r, this.children = n;
  }
  modify(e, r, n, s, i, o) {
    const a = this.mask, c = this.children, l = et(r, s), g = K(l), p = Xe(a, g), w = a & g, v = Ct(this, e);
    if (!w) {
      const Tt = new F().modify(e, r + W, n, s, i, o);
      return Tt ? c.length >= kn ? jn(e, l, Tt, a, c) : new rt(e, a | g, Nn(v, p, Tt, c)) : this;
    }
    const fe = c[p], $t = fe.modify(e, r + W, n, s, i, o);
    if (fe === $t) return this;
    let ht = a, gt;
    if ($($t)) {
      if (ht &= ~g, !ht) return new F();
      if (c.length <= 2 && $n(c[p ^ 1]))
        return c[p ^ 1];
      gt = Qe(v, p, c);
    } else
      gt = Q(v, p, $t, c);
    return v ? (this.mask = ht, this.children = gt, this) : new rt(e, ht, gt);
  }
}
class se {
  constructor(e, r, n) {
    f(this, "edit");
    f(this, "size");
    f(this, "children");
    f(this, "_tag", "ArrayNode");
    this.edit = e, this.size = r, this.children = n;
  }
  modify(e, r, n, s, i, o) {
    let a = this.size;
    const c = this.children, l = et(r, s), g = c[l], p = (g || new F()).modify(e, r + W, n, s, i, o);
    if (g === p) return this;
    const w = Ct(this, e);
    let v;
    if ($(g) && !$(p))
      ++a, v = Q(w, l, p, c);
    else if (!$(g) && $(p)) {
      if (--a, a <= An)
        return Tn(e, a, l, c);
      v = Q(w, l, new F(), c);
    } else
      v = Q(w, l, p, c);
    return w ? (this.size = a, this.children = v, this) : new se(e, a, v);
  }
}
function Tn(t, e, r, n) {
  const s = new Array(e - 1);
  let i = 0, o = 0;
  for (let a = 0, c = n.length; a < c; ++a)
    if (a !== r) {
      const l = n[a];
      l && !$(l) && (s[i++] = l, o |= 1 << a);
    }
  return new rt(t, o, s);
}
function jn(t, e, r, n, s) {
  const i = [];
  let o = n, a = 0;
  for (let c = 0; o; ++c)
    o & 1 && (i[c] = s[a++]), o >>>= 1;
  return i[e] = r, new se(t, a + 1, i);
}
function Mn(t, e, r, n, s, i) {
  if (r === s) return new ne(t, r, [i, n]);
  const o = et(e, r), a = et(e, s);
  if (o === a)
    return (c) => new rt(t, K(o) | K(a), [c]);
  {
    const c = o < a ? [n, i] : [i, n];
    return new rt(t, K(o) | K(a), c);
  }
}
function Ze(t, e, r, n, s, i) {
  let o, a = e;
  for (; ; ) {
    const c = Mn(t, a, r, n, s, i);
    if (typeof c == "function")
      o = In(c, o), a = a + W;
    else {
      let l = c;
      for (; o != null; )
        l = o.value(l), o = o.previous;
      return l;
    }
  }
}
const tr = "effect/HashMap", Ft = /* @__PURE__ */ Symbol.for(tr), Pn = {
  [Ft]: Ft,
  [Symbol.iterator]() {
    return new It(this, (t, e) => [t, e]);
  },
  [b]() {
    let t = d(tr);
    for (const e of this)
      t ^= _(d(e[0]), M(d(e[1])));
    return P(this, t);
  },
  [O](t) {
    if (Jn(t)) {
      if (t._size !== this._size)
        return !1;
      for (const e of this) {
        const r = _(t, Rn(e[0], d(e[0])));
        if (j(r))
          return !1;
        if (!k(e[1], r.value))
          return !1;
      }
      return !0;
    }
    return !1;
  },
  toString() {
    return B(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(E)
    };
  },
  [x]() {
    return this.toJSON();
  },
  pipe() {
    return H(this, arguments);
  }
}, ie = (t, e, r, n) => {
  const s = Object.create(Pn);
  return s._editable = t, s._edit = e, s._root = r, s._size = n, s;
};
class It {
  constructor(e, r) {
    f(this, "map");
    f(this, "f");
    f(this, "v");
    this.map = e, this.f = r, this.v = er(this.map._root, this.f, void 0);
  }
  next() {
    if (j(this.v))
      return {
        done: !0,
        value: void 0
      };
    const e = this.v.value;
    return this.v = Et(e.cont), {
      done: !1,
      value: e.value
    };
  }
  [Symbol.iterator]() {
    return new It(this.map, this.f);
  }
}
const Et = (t) => t ? rr(t[0], t[1], t[2], t[3], t[4]) : I(), er = (t, e, r = void 0) => {
  switch (t._tag) {
    case "LeafNode":
      return Z(t.value) ? ot({
        value: e(t.key, t.value.value),
        cont: r
      }) : Et(r);
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const n = t.children;
      return rr(n.length, n, 0, e, r);
    }
    default:
      return Et(r);
  }
}, rr = (t, e, r, n, s) => {
  for (; r < t; ) {
    const i = e[r++];
    if (i && !$(i))
      return er(i, n, [t, e, r, n, s]);
  }
  return Et(s);
}, xn = /* @__PURE__ */ ie(!1, 0, /* @__PURE__ */ new F(), 0), Ln = () => xn, Jn = (t) => C(t, Ft), Rn = /* @__PURE__ */ m(3, (t, e, r) => {
  let n = t._root, s = 0;
  for (; ; )
    switch (n._tag) {
      case "LeafNode":
        return k(e, n.key) ? n.value : I();
      case "CollisionNode": {
        if (r === n.hash) {
          const i = n.children;
          for (let o = 0, a = i.length; o < a; ++o) {
            const c = i[o];
            if ("key" in c && k(e, c.key))
              return c.value;
          }
        }
        return I();
      }
      case "IndexedNode": {
        const i = et(s, r), o = K(i);
        if (n.mask & o) {
          n = n.children[Xe(n.mask, o)], s += W;
          break;
        }
        return I();
      }
      case "ArrayNode": {
        if (n = n.children[et(s, r)], n) {
          s += W;
          break;
        }
        return I();
      }
      default:
        return I();
    }
}), Oe = /* @__PURE__ */ m(3, (t, e, r) => qn(t, e, () => ot(r))), Fn = /* @__PURE__ */ m(3, (t, e, r) => t._editable ? (t._root = e, t._size = r, t) : e === t._root ? t : ie(t._editable, t._edit, e, r)), Hn = (t) => new It(t, (e) => e), Ht = (t) => t._size, Un = (t) => ie(!0, t._edit + 1, t._root, t._size), qn = /* @__PURE__ */ m(3, (t, e, r) => Wn(t, e, d(e), r)), Wn = /* @__PURE__ */ m(4, (t, e, r, n) => {
  const s = {
    value: t._size
  }, i = t._root.modify(t._editable ? t._edit : NaN, 0, n, r, e, s);
  return _(t, Fn(i, s.value));
}), Bn = /* @__PURE__ */ m(2, (t, e) => Dn(t, void 0, (r, n, s) => e(n, s))), Dn = /* @__PURE__ */ m(3, (t, e, r) => {
  const n = t._root;
  if (n._tag === "LeafNode")
    return Z(n.value) ? r(e, n.value.value, n.key) : e;
  if (n._tag === "EmptyNode")
    return e;
  const s = [n.children];
  let i;
  for (; i = s.pop(); )
    for (let o = 0, a = i.length; o < a; ) {
      const c = i[o++];
      c && !$(c) && (c._tag === "LeafNode" ? Z(c.value) && (e = r(e, c.value.value, c.key)) : s.push(c.children));
    }
  return e;
}), nr = "effect/HashSet", Ut = /* @__PURE__ */ Symbol.for(nr), Vn = {
  [Ut]: Ut,
  [Symbol.iterator]() {
    return Hn(this._keyMap);
  },
  [b]() {
    return P(this, M(d(this._keyMap))(d(nr)));
  },
  [O](t) {
    return zn(t) ? Ht(this._keyMap) === Ht(t._keyMap) && k(this._keyMap, t._keyMap) : !1;
  },
  toString() {
    return B(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(E)
    };
  },
  [x]() {
    return this.toJSON();
  },
  pipe() {
    return H(this, arguments);
  }
}, oe = (t) => {
  const e = Object.create(Vn);
  return e._keyMap = t, e;
}, zn = (t) => C(t, Ut), Gn = /* @__PURE__ */ oe(/* @__PURE__ */ Ln()), sr = () => Gn, Kn = (t) => Ht(t._keyMap), Yn = (t) => oe(Un(t._keyMap)), Xn = (t) => (t._keyMap._editable = !1, t), Qn = /* @__PURE__ */ m(2, (t, e) => {
  const r = Yn(t);
  return e(r), Xn(r);
}), qt = /* @__PURE__ */ m(2, (t, e) => t._keyMap._editable ? (Oe(e, !0)(t._keyMap), t) : oe(Oe(e, !0)(t._keyMap))), Zn = /* @__PURE__ */ m(2, (t, e) => Qn(sr(), (r) => {
  ts(t, (n) => qt(r, n));
  for (const n of e)
    qt(r, n);
})), ts = /* @__PURE__ */ m(2, (t, e) => Bn(t._keyMap, (r, n) => e(n))), Ot = sr, es = Kn, Pt = qt, Wt = Zn, rs = (t) => Object.assign(Object.create(te), t), ir = "Die", Bt = "Empty", ce = "Fail", or = "Interrupt", at = "Parallel", ut = "Sequential", cr = "effect/Cause", ar = /* @__PURE__ */ Symbol.for(cr), ns = {
  /* c8 ignore next */
  _E: (t) => t
}, ae = {
  [ar]: ns,
  [b]() {
    return _(d(cr), M(d(as(this))), P(this));
  },
  [O](t) {
    return is(t) && cs(this, t);
  },
  pipe() {
    return H(this, arguments);
  },
  toJSON() {
    switch (this._tag) {
      case "Empty":
        return {
          _id: "Cause",
          _tag: this._tag
        };
      case "Die":
        return {
          _id: "Cause",
          _tag: this._tag,
          defect: E(this.defect)
        };
      case "Interrupt":
        return {
          _id: "Cause",
          _tag: this._tag,
          fiberId: this.fiberId.toJSON()
        };
      case "Fail":
        return {
          _id: "Cause",
          _tag: this._tag,
          failure: E(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: E(this.left),
          right: E(this.right)
        };
    }
  },
  toString() {
    return lr(this);
  },
  [x]() {
    return this.toJSON();
  }
}, Dt = (t) => {
  const e = Object.create(ae);
  return e._tag = ce, e.error = t, e;
}, ss = (t, e) => {
  const r = Object.create(ae);
  return r._tag = at, r.left = t, r.right = e, r;
}, yt = (t, e) => {
  const r = Object.create(ae);
  return r._tag = ut, r.left = t, r.right = e, r;
}, is = (t) => C(t, ar), os = (t) => ur(void 0, ls)(t), cs = (t, e) => {
  let r = ct(t), n = ct(e);
  for (; ve(r) && ve(n); ) {
    const [s, i] = _(Ee(r), Ae([Ot(), tt()], ([c, l], g) => {
      const [p, w] = Vt(g);
      return ot([_(c, Wt(p)), _(l, R(w))]);
    })), [o, a] = _(Ee(n), Ae([Ot(), tt()], ([c, l], g) => {
      const [p, w] = Vt(g);
      return ot([_(c, Wt(p)), _(l, R(w))]);
    }));
    if (!k(s, o))
      return !1;
    r = i, n = a;
  }
  return !0;
}, as = (t) => us(ct(t), tt()), us = (t, e) => {
  for (; ; ) {
    const [r, n] = _(t, rn([Ot(), tt()], ([i, o], a) => {
      const [c, l] = Vt(a);
      return [_(i, Wt(c)), _(o, R(l))];
    })), s = es(r) > 0 ? _(e, Ye(r)) : e;
    if (En(n))
      return Rt(s);
    t = n, e = s;
  }
  throw new Error(Le("Cause.flattenCauseLoop"));
}, Vt = (t) => {
  let e = t;
  const r = [];
  let n = Ot(), s = tt();
  for (; e !== void 0; )
    switch (e._tag) {
      case Bt: {
        if (r.length === 0)
          return [n, s];
        e = r.pop();
        break;
      }
      case ce: {
        if (n = Pt(n, Mt(e._tag, e.error)), r.length === 0)
          return [n, s];
        e = r.pop();
        break;
      }
      case ir: {
        if (n = Pt(n, Mt(e._tag, e.defect)), r.length === 0)
          return [n, s];
        e = r.pop();
        break;
      }
      case or: {
        if (n = Pt(n, Mt(e._tag, e.fiberId)), r.length === 0)
          return [n, s];
        e = r.pop();
        break;
      }
      case ut: {
        switch (e.left._tag) {
          case Bt: {
            e = e.right;
            break;
          }
          case ut: {
            e = yt(e.left.left, yt(e.left.right, e.right));
            break;
          }
          case at: {
            e = ss(yt(e.left.left, e.right), yt(e.left.right, e.right));
            break;
          }
          default: {
            s = Ye(s, e.right), e = e.left;
            break;
          }
        }
        break;
      }
      case at: {
        r.push(e.right), e = e.left;
        break;
      }
    }
  throw new Error(Le("Cause.evaluateCauseLoop"));
}, ls = {
  emptyCase: ye,
  failCase: _e,
  dieCase: _e,
  interruptCase: ye,
  sequentialCase: (t, e, r) => e && r,
  parallelCase: (t, e, r) => e && r
}, we = "SequentialCase", ke = "ParallelCase", Ae = /* @__PURE__ */ m(3, (t, e, r) => {
  let n = e, s = t;
  const i = [];
  for (; s !== void 0; ) {
    const o = r(n, s);
    switch (n = Z(o) ? o.value : n, s._tag) {
      case ut: {
        i.push(s.right), s = s.left;
        break;
      }
      case at: {
        i.push(s.right), s = s.left;
        break;
      }
      default: {
        s = void 0;
        break;
      }
    }
    s === void 0 && i.length > 0 && (s = i.pop());
  }
  return n;
}), ur = /* @__PURE__ */ m(3, (t, e, r) => {
  const n = [t], s = [];
  for (; n.length > 0; ) {
    const o = n.pop();
    switch (o._tag) {
      case Bt: {
        s.push(N(r.emptyCase(e)));
        break;
      }
      case ce: {
        s.push(N(r.failCase(e, o.error)));
        break;
      }
      case ir: {
        s.push(N(r.dieCase(e, o.defect)));
        break;
      }
      case or: {
        s.push(N(r.interruptCase(e, o.fiberId)));
        break;
      }
      case ut: {
        n.push(o.right), n.push(o.left), s.push(it({
          _tag: we
        }));
        break;
      }
      case at: {
        n.push(o.right), n.push(o.left), s.push(it({
          _tag: ke
        }));
        break;
      }
    }
  }
  const i = [];
  for (; s.length > 0; ) {
    const o = s.pop();
    switch (o._tag) {
      case "Left": {
        switch (o.left._tag) {
          case we: {
            const a = i.pop(), c = i.pop(), l = r.sequentialCase(e, a, c);
            i.push(l);
            break;
          }
          case ke: {
            const a = i.pop(), c = i.pop(), l = r.parallelCase(e, a, c);
            i.push(l);
            break;
          }
        }
        break;
      }
      case "Right": {
        i.push(o.right);
        break;
      }
    }
  }
  if (i.length === 0)
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  return i.pop();
}), lr = (t, e) => os(t) ? "All fibers interrupted without errors." : ds(t).map(function(r) {
  return (e == null ? void 0 : e.renderErrorCause) !== !0 || r.cause === void 0 ? r.stack : `${r.stack} {
${fr(r.cause, "  ")}
}`;
}).join(`
`), fr = (t, e) => {
  const r = t.stack.split(`
`);
  let n = `${e}[cause]: ${r[0]}`;
  for (let s = 1, i = r.length; s < i; s++)
    n += `
${e}${r[s]}`;
  return t.cause && (n += ` {
${fr(t.cause, `${e}  `)}
${e}}`), n;
};
class wt extends globalThis.Error {
  constructor(r) {
    const n = typeof r == "object" && r !== null, s = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(fs(r), n && "cause" in r && typeof r.cause < "u" ? {
      cause: new wt(r.cause)
    } : void 0);
    f(this, "span");
    this.message === "" && (this.message = "An error has occurred"), Error.stackTraceLimit = s, this.name = r instanceof Error ? r.name : "Error", n && (lt in r && (this.span = r[lt]), Object.keys(r).forEach((i) => {
      i in this || (this[i] = r[i]);
    })), this.stack = ps(`${this.name}: ${this.message}`, r instanceof Error && r.stack ? r.stack : "", this.span);
  }
}
const fs = (t) => {
  if (typeof t == "string")
    return t;
  if (typeof t == "object" && t !== null && t instanceof Error)
    return t.message;
  try {
    if (C(t, "toString") && Kt(t.toString) && t.toString !== Object.prototype.toString && t.toString !== globalThis.Array.prototype.toString)
      return t.toString();
  } catch {
  }
  return Ir(t);
}, hs = /\((.*)\)/g, gs = /* @__PURE__ */ kt("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap()), ps = (t, e, r) => {
  const n = [t], s = e.startsWith(t) ? e.slice(t.length).split(`
`) : e.split(`
`);
  for (let i = 1; i < s.length && !s[i].includes("Generator.next"); i++) {
    if (s[i].includes("effect_internal_function")) {
      n.pop();
      break;
    }
    n.push(s[i].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (r) {
    let i = r, o = 0;
    for (; i && i._tag === "Span" && o < 10; ) {
      const a = gs.get(i);
      if (typeof a == "function") {
        const c = a();
        if (typeof c == "string") {
          const l = c.matchAll(hs);
          let g = !1;
          for (const [, p] of l)
            g = !0, n.push(`    at ${i.name} (${p})`);
          g || n.push(`    at ${i.name} (${c.replace(/^at /, "")})`);
        } else
          n.push(`    at ${i.name}`);
      } else
        n.push(`    at ${i.name}`);
      i = tn(i.parent), o++;
    }
  }
  return n.join(`
`);
}, lt = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation"), ds = (t) => ur(t, void 0, {
  emptyCase: () => [],
  dieCase: (e, r) => [new wt(r)],
  failCase: (e, r) => [new wt(r)],
  interruptCase: () => [],
  parallelCase: (e, r, n) => [...r, ...n],
  sequentialCase: (e, r, n) => [...r, ...n]
});
class Nt {
  constructor(e) {
    f(this, "self");
    f(this, "called", !1);
    this.self = e;
  }
  next(e) {
    return this.called ? {
      value: e,
      done: !0
    } : (this.called = !0, {
      value: this.self,
      done: !1
    });
  }
  return(e) {
    return {
      value: e,
      done: !0
    };
  }
  throw(e) {
    throw e;
  }
  [Symbol.iterator]() {
    return new Nt(this.self);
  }
}
const ue = /* @__PURE__ */ Symbol.for("effect/Effect");
var Te;
class ms {
  constructor(e) {
    f(this, "_op");
    f(this, "effect_instruction_i0");
    f(this, "effect_instruction_i1");
    f(this, "effect_instruction_i2");
    f(this, "trace");
    f(this, Te, bt);
    this._op = e;
  }
  [(Te = ue, O)](e) {
    return this === e;
  }
  [b]() {
    return P(this, Xt(this));
  }
  pipe() {
    return H(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: E(this.effect_instruction_i0),
      effect_instruction_i1: E(this.effect_instruction_i1),
      effect_instruction_i2: E(this.effect_instruction_i2)
    };
  }
  toString() {
    return B(this.toJSON());
  }
  [x]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Nt(new Yt(this));
  }
}
var je;
class ys {
  constructor(e) {
    f(this, "_op");
    f(this, "effect_instruction_i0");
    f(this, "effect_instruction_i1");
    f(this, "effect_instruction_i2");
    f(this, "trace");
    f(this, je, bt);
    this._op = e, this._tag = e;
  }
  [(je = ue, O)](e) {
    return Os(e) && e._op === "Failure" && // @ts-expect-error
    k(this.effect_instruction_i0, e.effect_instruction_i0);
  }
  [b]() {
    return _(
      // @ts-expect-error
      J(this._tag),
      // @ts-expect-error
      M(d(this.effect_instruction_i0)),
      P(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return H(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return B(this.toJSON());
  }
  [x]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Nt(new Yt(this));
  }
}
const _s = (t) => C(t, ue), Ss = (t) => {
  const e = new ms(jr);
  return e.effect_instruction_i0 = t, e;
}, Ce = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation"), bs = (t, e) => Z(e) ? new Proxy(t, {
  has(r, n) {
    return n === lt || n === Ce || n in r;
  },
  get(r, n) {
    return n === lt ? e.value : n === Ce ? t : r[n];
  }
}) : t, vs = (t) => Pe(t) && !(lt in t) ? Ss((e) => Ie(Dt(bs(t, ws(e))))) : Ie(Dt(t)), Ie = (t) => {
  const e = new ys(Tr);
  return e.effect_instruction_i0 = t, e;
}, Es = /* @__PURE__ */ function() {
  class t extends globalThis.Error {
    commit() {
      return vs(this);
    }
    toJSON() {
      const r = {
        ...this
      };
      return this.message && (r.message = this.message), this.cause && (r.cause = this.cause), r;
    }
    [x]() {
      return this.toString !== globalThis.Error.prototype.toString ? this.stack ? `${this.toString()}
${this.stack.split(`
`).slice(1).join(`
`)}` : this.toString() : "Bun" in globalThis ? lr(Dt(this), {
        renderErrorCause: !0
      }) : this;
    }
  }
  return Object.assign(t.prototype, Hr), t;
}(), Os = (t) => _s(t) && "_tag" in t && (t._tag === "Success" || t._tag === "Failure"), ws = (t) => {
  const e = t.currentSpan;
  return e !== void 0 && e._tag === "Span" ? ot(e) : I();
}, ks = rs, hr = (t) => (e) => {
  const r = e === void 0 ? Object.create(te) : ks(e);
  return r._tag = t, r;
}, As = () => new Proxy({}, {
  get(t, e, r) {
    return e === "$is" ? xe : e === "$match" ? Cs : hr(e);
  }
});
function Cs() {
  if (arguments.length === 1) {
    const r = arguments[0];
    return function(n) {
      return r[n._tag](n);
    };
  }
  const t = arguments[0];
  return arguments[1][t._tag](t);
}
const Is = /* @__PURE__ */ function() {
  const t = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  return class extends Es {
    constructor(r) {
      super(r == null ? void 0 : r.message, r != null && r.cause ? {
        cause: r.cause
      } : void 0), r && (Object.assign(this, r), Object.defineProperty(this, t, {
        value: r,
        enumerable: !1
      }));
    }
    toJSON() {
      return {
        ...this[t],
        ...this
      };
    }
  };
}(), Rs = (t) => {
  class e extends Is {
    constructor() {
      super(...arguments);
      f(this, "_tag", t);
    }
  }
  return e.prototype.name = t, e;
}, h = u.optionalWith, Ns = u.Struct({
  path: u.String,
  description: h(u.String, { exact: !0 })
}), $s = u.Struct({
  name: u.String,
  valueBase64Binary: h(u.String, { exact: !0 }),
  valueBoolean: h(u.String, { exact: !0 }),
  valueCanonical: h(u.String, { exact: !0 }),
  valueCode: h(u.String, { exact: !0 }),
  valueDate: h(u.String, { exact: !0 }),
  valueDateTime: h(u.String, { exact: !0 }),
  valueDecimal: h(u.String, { exact: !0 }),
  valueId: h(u.String, { exact: !0 }),
  valueInstant: h(u.Number, { exact: !0 }),
  valueInteger: h(u.Number, { exact: !0 }),
  valueOid: h(u.String, { exact: !0 }),
  valuePositiveInt: h(u.Number, { exact: !0 }),
  valueString: h(u.String, { exact: !0 }),
  valueTime: h(u.String, { exact: !0 }),
  valueUnsignedInt: h(u.Number, { exact: !0 }),
  valueUri: h(u.String, { exact: !0 }),
  valueUrl: h(u.String, { exact: !0 }),
  valueUuid: h(u.String, { exact: !0 })
}), Ts = $s, js = u.Struct({
  name: u.String,
  value: u.String
}), gr = js, Fs = u.is(gr), pr = u.Struct({
  path: u.String,
  name: u.String,
  description: h(u.String, { exact: !0 }),
  collection: h(u.Boolean, { exact: !0 }),
  type: h(u.String, { exact: !0 }),
  tags: h(u.Array(gr), { exact: !0 })
}), le = pr, Hs = pr.make, V = u.decodeOption(le), zt = u.Struct({
  column: h(u.Array(le), {
    exact: !0
  }),
  select: h(
    u.Array(
      u.suspend(() => zt)
    ),
    { exact: !0 }
  ),
  forEach: h(u.String, { exact: !0 }),
  forEachOrNull: h(u.String, { exact: !0 }),
  unionAll: h(
    u.Array(
      u.suspend(() => zt)
    ),
    { exact: !0 }
  )
}), { Select: U, Column: z, ForEach: Ne, ForEachOrNull: $e, UnionAll: G, $match: Ms } = As(), Y = u.Union(
  u.TaggedStruct("Column", {
    column: u.Array(u.typeSchema(le))
  }),
  u.TaggedStruct("Select", {
    select: u.Array(u.suspend(() => Y))
  }),
  u.TaggedStruct("ForEach", {
    forEach: u.String,
    select: u.Array(u.suspend(() => Y))
  }),
  u.TaggedStruct("ForEachOrNull", {
    forEachOrNull: u.String,
    select: u.Array(u.suspend(() => Y))
  }),
  u.TaggedStruct("UnionAll", {
    unionAll: u.Array(u.suspend(() => Y))
  })
);
function y(t) {
  return hn(t).pipe(
    L(
      {
        forEach: mt,
        forEachOrNull: mt
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(t, null, 2)}`
        );
      }
    ),
    L(
      {
        forEach: mt
      },
      ({ forEach: e, select: r = [], unionAll: n, column: s }) => Ne({
        forEach: e,
        select: [
          ...n ? [
            G({
              unionAll: n.map(
                (i) => y(i)
              )
            })
          ] : [],
          ...s ? [
            z({
              column: D(
                s,
                (i) => V(i)
              )
            })
          ] : [],
          ...r.map(y)
        ]
      })
    ),
    L(
      {
        forEachOrNull: mt
      },
      ({ forEachOrNull: e, select: r = [], unionAll: n, column: s }) => $e({
        forEachOrNull: e,
        select: [
          ...n ? [
            G({
              unionAll: n.map(
                (i) => y(i)
              )
            })
          ] : [],
          ...s ? [
            z({
              column: D(
                s,
                (i) => V(i)
              )
            })
          ] : [],
          ...r.map(y)
        ]
      })
    ),
    L(
      {
        column: Array.isArray,
        select: Array.isArray,
        unionAll: Array.isArray
      },
      ({ column: e = [], select: r = [], unionAll: n = [] }) => U({
        select: [
          G({
            unionAll: n.map(y)
          }),
          z({
            column: D(
              e,
              (s) => V(s)
            )
          }),
          ...r.map(y)
        ]
      })
    ),
    L(
      {
        unionAll: Array.isArray,
        select: Array.isArray
      },
      ({ unionAll: e = [], select: r = [] }) => U({
        select: [
          G({
            unionAll: e.map(y)
          }),
          ...r.map(y)
        ]
      })
    ),
    L(
      {
        select: Array.isArray,
        column: Array.isArray
      },
      ({ select: e = [], column: r = [] }) => U({
        select: [
          z({
            column: D(
              r,
              (n) => V(n)
            )
          }),
          ...e.map(y)
        ]
      })
    ),
    L(
      {
        column: Array.isArray,
        unionAll: Array.isArray
      },
      ({ column: e = [], unionAll: r = [], select: n = [] }) => U({
        select: [
          z({
            column: D(
              e,
              (s) => V(s)
            )
          }),
          G({
            unionAll: r.map(y)
          }),
          ...n.map(y)
        ]
      })
    ),
    L(
      {
        select: Array.isArray
      },
      ({ select: e = [] }) => U({
        select: e.map(y)
      })
    ),
    gn((e) => {
      var r, n;
      return e.unionAll ? G({
        unionAll: e.unionAll.map(y)
      }) : e.column ? z({
        column: D(
          e.column,
          (s) => V(s)
        )
      }) : e.forEach ? Ne({
        forEach: e.forEach,
        select: ((r = e.select) == null ? void 0 : r.map(y)) ?? []
      }) : e.forEachOrNull ? $e({
        forEachOrNull: e.forEachOrNull,
        select: ((n = e.select) == null ? void 0 : n.map(y)) ?? []
      }) : e.select ? U({
        select: e.select.map(y)
      }) : U({
        select: []
      });
    })
  );
}
const Ps = u.transform(zt, Y, {
  strict: !0,
  encode: ({ _tag: t, ...e }) => e,
  decode: (t) => y(t)
}), Us = u.decodeSync(Ps);
u.TaggedStruct("Select", {
  status: u.Literal("draft", "active", "retired", "unknown"),
  url: h(u.String, { exact: !0 }),
  name: h(u.String, { exact: !0 }),
  title: h(u.String, { exact: !0 }),
  experimental: h(u.Boolean, { exact: !0 }),
  publisher: h(u.String, { exact: !0 }),
  description: h(u.String, { exact: !0 }),
  copyright: h(u.String, { exact: !0 }),
  resource: u.String,
  constant: h(u.Array(Ts), {
    exact: !0
  }),
  where: h(u.Array(Ns), { exact: !0 }),
  select: u.NonEmptyArray(Y)
});
const qs = hr("Select");
function Ws(t, e = (r) => !0) {
  const r = (i, o) => Ms(o, {
    ForEach: ({ select: a }) => a.flatMap((c) => r(i, c)),
    ForEachOrNull: ({ select: a }) => a.flatMap((c) => r(i, c)),
    Select: ({ select: a }) => a.flatMap((c) => r(i, c)),
    UnionAll: ({ unionAll: a }) => a.flatMap((c) => r(i, c)),
    Column: ({ column: a }) => en(i, a)
  });
  return r([], t).filter(e);
}
export {
  Ms as $,
  z as C,
  Ne as F,
  U as S,
  Rs as T,
  G as U,
  Ns as W,
  hn as a,
  $e as b,
  Hs as c,
  m as d,
  Ts as e,
  gr as f,
  le as g,
  y as h,
  Fs as i,
  Ws as j,
  Us as n,
  gn as o,
  qs as v,
  L as w
};
