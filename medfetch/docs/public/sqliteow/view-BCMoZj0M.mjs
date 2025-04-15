var a_ = Object.defineProperty;
var bl = (e) => {
  throw TypeError(e);
};
var u_ = (e, t, n) => t in e ? a_(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var i = (e, t, n) => u_(e, typeof t != "symbol" ? t + "" : t, n), wl = (e, t, n) => t.has(e) || bl("Cannot " + n);
var kl = (e, t, n) => (wl(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Ol = (e, t, n) => t.has(e) ? bl("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), $l = (e, t, n, r) => (wl(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
const l_ = (e) => typeof e == "function", f = function(e, t) {
  if (typeof e == "function")
    return function() {
      return e(arguments) ? t.apply(this, arguments) : (n) => t(n, ...arguments);
    };
  switch (e) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${e}`);
    case 2:
      return function(n, r) {
        return arguments.length >= 2 ? t(n, r) : function(s) {
          return t(s, n);
        };
      };
    case 3:
      return function(n, r, s) {
        return arguments.length >= 3 ? t(n, r, s) : function(o) {
          return t(o, n, r);
        };
      };
    case 4:
      return function(n, r, s, o) {
        return arguments.length >= 4 ? t(n, r, s, o) : function(c) {
          return t(c, n, r, s);
        };
      };
    case 5:
      return function(n, r, s, o, c) {
        return arguments.length >= 5 ? t(n, r, s, o, c) : function(a) {
          return t(a, n, r, s, o);
        };
      };
    default:
      return function() {
        if (arguments.length >= e)
          return t.apply(this, arguments);
        const n = arguments;
        return function(r) {
          return t(r, ...n);
        };
      };
  }
}, D = (e) => e, yc = (e) => () => e, Tl = /* @__PURE__ */ yc(!0), Ai = /* @__PURE__ */ yc(!1), ad = /* @__PURE__ */ yc(void 0), Ci = ad;
function m(e, t, n, r, s, o, c, a, u) {
  switch (arguments.length) {
    case 1:
      return e;
    case 2:
      return t(e);
    case 3:
      return n(t(e));
    case 4:
      return r(n(t(e)));
    case 5:
      return s(r(n(t(e))));
    case 6:
      return o(s(r(n(t(e)))));
    case 7:
      return c(o(s(r(n(t(e))))));
    case 8:
      return a(c(o(s(r(n(t(e)))))));
    case 9:
      return u(a(c(o(s(r(n(t(e))))))));
    default: {
      let l = arguments[0];
      for (let h = 1; h < arguments.length; h++)
        l = arguments[h](l);
      return l;
    }
  }
}
const _c = (e) => (t, n) => t === n || e(t, n), f_ = /* @__PURE__ */ f(2, (e, t) => _c((n, r) => e(t(n), t(r)))), h_ = (e) => _c((t, n) => {
  if (t.length !== n.length)
    return !1;
  for (let r = 0; r < t.length; r++)
    if (!e(t[r], n[r]))
      return !1;
  return !0;
});
let d_ = "3.14.1";
const Sc = () => d_, oo = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ Sc()}`;
let zr;
const z = (e, t) => (zr || (globalThis[oo] ?? (globalThis[oo] = /* @__PURE__ */ new Map()), zr = globalThis[oo]), zr.has(e) || zr.set(e, t()), zr.get(e)), Ue = (e) => typeof e == "string", Ut = (e) => typeof e == "number", kn = (e) => typeof e == "boolean", bc = (e) => typeof e == "bigint", ps = (e) => typeof e == "symbol", Ps = l_, m_ = (e) => e === void 0, g_ = (e) => e !== void 0, hi = (e) => e !== null, p_ = (e) => !1, ja = (e) => typeof e == "object" && e !== null, tn = (e) => ja(e) || Ps(e), M = /* @__PURE__ */ f(2, (e, t) => tn(e) && t in e), Ka = /* @__PURE__ */ f(2, (e, t) => M(e, "_tag") && e._tag === t), Ln = (e) => e == null, y_ = (e) => e != null, __ = (e) => e instanceof Date, Ua = (e) => M(e, Symbol.iterator), S_ = (e) => ja(e) && !Array.isArray(e), b_ = (e) => M(e, "then") && Ps(e.then), wc = (e) => `BUG: ${e} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let ud = class ld {
  constructor(t) {
    i(this, "self");
    i(this, "called", !1);
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
    return new ld(this.self);
  }
};
const w_ = 335903614, k_ = 4150755663, O_ = 1481765933, $_ = 1284865837, T_ = 9007199254740992, v_ = 134217728;
class E_ {
  constructor(t, n, r, s) {
    i(this, "_state");
    return Ln(n) && Ln(t) ? (n = Math.random() * 4294967295 >>> 0, t = 0) : Ln(n) && (n = t, t = 0), Ln(s) && Ln(r) ? (s = this._state ? this._state[3] : k_, r = this._state ? this._state[2] : w_) : Ln(s) && (s = r, r = 0), this._state = new Int32Array([0, 0, r >>> 0, ((s || 0) | 1) >>> 0]), this._next(), vl(this._state, this._state[0], this._state[1], t >>> 0, n >>> 0), this._next(), this;
  }
  /**
   * Returns a copy of the internal state of this random number generator as a
   * JavaScript Array.
   *
   * @category getters
   * @since 2.0.0
   */
  getState() {
    return [this._state[0], this._state[1], this._state[2], this._state[3]];
  }
  /**
   * Restore state previously retrieved using `getState()`.
   *
   * @since 2.0.0
   */
  setState(t) {
    this._state[0] = t[0], this._state[1] = t[1], this._state[2] = t[2], this._state[3] = t[3] | 1;
  }
  /**
   * Get a uniformly distributed 32 bit integer between [0, max).
   *
   * @category getter
   * @since 2.0.0
   */
  integer(t) {
    return Math.round(this.number() * Number.MAX_SAFE_INTEGER) % t;
  }
  /**
   * Get a uniformly distributed IEEE-754 double between 0.0 and 1.0, with
   * 53 bits of precision (every bit of the mantissa is randomized).
   *
   * @category getters
   * @since 2.0.0
   */
  number() {
    const t = (this._next() & 67108863) * 1, n = (this._next() & 134217727) * 1;
    return (t * v_ + n) / T_;
  }
  /** @internal */
  _next() {
    const t = this._state[0] >>> 0, n = this._state[1] >>> 0;
    I_(this._state, t, n, O_, $_), vl(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let r = t >>> 18, s = (n >>> 18 | t << 14) >>> 0;
    r = (r ^ t) >>> 0, s = (s ^ n) >>> 0;
    const o = (s >>> 27 | r << 5) >>> 0, c = t >>> 27, a = (-c >>> 0 & 31) >>> 0;
    return (o >>> c | o << a) >>> 0;
  }
}
function I_(e, t, n, r, s) {
  let o = (n >>> 16) * (s & 65535) >>> 0, c = (n & 65535) * (s >>> 16) >>> 0, a = (n & 65535) * (s & 65535) >>> 0, u = (n >>> 16) * (s >>> 16) + ((c >>> 16) + (o >>> 16)) >>> 0;
  c = c << 16 >>> 0, a = a + c >>> 0, a >>> 0 < c >>> 0 && (u = u + 1 >>> 0), o = o << 16 >>> 0, a = a + o >>> 0, a >>> 0 < o >>> 0 && (u = u + 1 >>> 0), u = u + Math.imul(n, r) >>> 0, u = u + Math.imul(t, s) >>> 0, e[0] = u, e[1] = a;
}
function vl(e, t, n, r, s) {
  let o = t + r >>> 0;
  const c = n + s >>> 0;
  c >>> 0 < n >>> 0 && (o = o + 1 | 0), e[0] = o, e[1] = c;
}
const Pi = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var Cs;
class xs {
  constructor(t) {
    /**
     * @since 3.0.6
     */
    Ol(this, Cs);
    $l(this, Cs, t);
  }
  /**
   * @since 3.0.6
   */
  [Pi]() {
    return kl(this, Cs);
  }
}
Cs = new WeakMap();
function R_(e) {
  if (typeof e == "object" && e !== null && Pi in e)
    return e[Pi]();
  throw new Error(wc("yieldWrapGet"));
}
const We = /* @__PURE__ */ z("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), M_ = (e) => {
  const t = {
    [e](n) {
      return n();
    }
  };
  return function(n) {
    return t[e](n);
  };
}, Ce = /* @__PURE__ */ M_("effect_internal_function"), di = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), j = /* @__PURE__ */ Symbol.for("effect/Hash"), $ = (e) => {
  if (We.enabled === !0)
    return 0;
  switch (typeof e) {
    case "number":
      return qa(e);
    case "bigint":
      return fe(e.toString(10));
    case "boolean":
      return fe(String(e));
    case "symbol":
      return fe(String(e));
    case "string":
      return fe(e);
    case "undefined":
      return fe("undefined");
    case "function":
    case "object":
      return e === null ? fe("null") : e instanceof Date ? $(e.toISOString()) : F_(e) ? e[j]() : Da(e);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof e} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, Da = (e) => (di.has(e) || di.set(e, qa(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), di.get(e)), J = (e) => (t) => t * 53 ^ e, kc = (e) => e & 3221225471 | e >>> 1 & 1073741824, F_ = (e) => M(e, j), qa = (e) => {
  if (e !== e || e === 1 / 0)
    return 0;
  let t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    t ^= e /= 4294967295;
  return kc(t);
}, fe = (e) => {
  let t = 5381, n = e.length;
  for (; n; )
    t = t * 33 ^ e.charCodeAt(--n);
  return kc(t);
}, N_ = (e, t) => {
  let n = 12289;
  for (let r = 0; r < t.length; r++)
    n ^= m(fe(t[r]), J($(e[t[r]])));
  return kc(n);
}, fd = (e) => N_(e, Object.keys(e)), Ls = (e) => {
  let t = 6151;
  for (let n = 0; n < e.length; n++)
    t = m(t, J($(e[n])));
  return kc(t);
}, ie = function() {
  if (arguments.length === 1) {
    const n = arguments[0];
    return function(r) {
      return Object.defineProperty(n, j, {
        value() {
          return r;
        },
        enumerable: !1
      }), r;
    };
  }
  const e = arguments[0], t = arguments[1];
  return Object.defineProperty(e, j, {
    value() {
      return t;
    },
    enumerable: !1
  }), t;
}, C = /* @__PURE__ */ Symbol.for("effect/Equal");
function R() {
  return arguments.length === 1 ? (e) => Fo(e, arguments[0]) : Fo(arguments[0], arguments[1]);
}
function Fo(e, t) {
  if (e === t)
    return !0;
  const n = typeof e;
  if (n !== typeof t)
    return !1;
  if (n === "object" || n === "function") {
    if (e !== null && t !== null) {
      if (No(e) && No(t))
        return $(e) === $(t) && e[C](t) ? !0 : We.enabled && We.tester ? We.tester(e, t) : !1;
      if (e instanceof Date && t instanceof Date)
        return e.toISOString() === t.toISOString();
    }
    if (We.enabled) {
      if (Array.isArray(e) && Array.isArray(t))
        return e.length === t.length && e.every((r, s) => Fo(r, t[s]));
      if (Object.getPrototypeOf(e) === Object.prototype && Object.getPrototypeOf(e) === Object.prototype) {
        const r = Object.keys(e), s = Object.keys(t);
        if (r.length === s.length) {
          for (const o of r)
            if (!(o in t && Fo(e[o], t[o])))
              return We.tester ? We.tester(e, t) : !1;
          return !0;
        }
      }
      return We.tester ? We.tester(e, t) : !1;
    }
  }
  return We.enabled && We.tester ? We.tester(e, t) : !1;
}
const No = (e) => M(e, C), Ba = () => R, re = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), he = (e) => {
  try {
    if (M(e, "toJSON") && Ps(e.toJSON) && e.toJSON.length === 0)
      return e.toJSON();
    if (Array.isArray(e))
      return e.map(he);
  } catch {
    return {};
  }
  return C_(e);
}, we = (e) => JSON.stringify(e, null, 2), sr = (e, t = 2) => {
  if (typeof e == "string")
    return e;
  try {
    return typeof e == "object" ? hd(e, t) : String(e);
  } catch {
    return String(e);
  }
}, hd = (e, t) => {
  let n = [];
  const r = JSON.stringify(e, (s, o) => typeof o == "object" && o !== null ? n.includes(o) ? void 0 : n.push(o) && (mn.fiberRefs !== void 0 && dd(o) ? o[Ja](mn.fiberRefs) : o) : o, t);
  return n = void 0, r;
}, Ja = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable"), dd = (e) => typeof e == "object" && e !== null && Ja in e, mn = /* @__PURE__ */ z("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
})), A_ = (e, t) => {
  const n = mn.fiberRefs;
  mn.fiberRefs = e;
  try {
    return t();
  } finally {
    mn.fiberRefs = n;
  }
}, C_ = (e) => dd(e) && mn.fiberRefs !== void 0 ? e[Ja](mn.fiberRefs) : e, v = (e, t) => {
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
      let n = e;
      for (let r = 0, s = t.length; r < s; r++)
        n = t[r](n);
      return n;
    }
  }
}, as = "Async", Oc = "Commit", Ie = "Failure", _o = "OnFailure", Ao = "OnSuccess", Co = "OnSuccessAndFailure", Re = "Success", md = "Sync", P_ = "Tag", Rr = "UpdateRuntimeFlags", Po = "While", us = "Iterator", gd = "WithRuntime", So = "Yield", Va = "RevertFlags", x_ = /* @__PURE__ */ Symbol.for("effect/Effect"), L_ = /* @__PURE__ */ Symbol.for("effect/Stream"), j_ = /* @__PURE__ */ Symbol.for("effect/Sink"), K_ = /* @__PURE__ */ Symbol.for("effect/Channel"), or = {
  /* c8 ignore next */
  _R: (e) => e,
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e,
  _V: /* @__PURE__ */ Sc()
}, U_ = {
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
}, D_ = {
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
}, js = {
  [x_]: or,
  [L_]: or,
  [j_]: U_,
  [K_]: D_,
  [C](e) {
    return this === e;
  },
  [j]() {
    return ie(this, Da(this));
  },
  [Symbol.iterator]() {
    return new ud(new xs(this));
  },
  pipe() {
    return v(this, arguments);
  }
}, Ks = {
  [j]() {
    return ie(this, fd(this));
  },
  [C](e) {
    const t = Object.keys(this), n = Object.keys(e);
    if (t.length !== n.length)
      return !1;
    for (const r of t)
      if (!(r in e && R(this[r], e[r])))
        return !1;
    return !0;
  }
}, Us = {
  ...js,
  _op: Oc
}, q_ = {
  ...Us,
  ...Ks
}, B_ = /* @__PURE__ */ function() {
  function e() {
  }
  return e.prototype = Us, e;
}(), pd = /* @__PURE__ */ Symbol.for("effect/Option"), yd = {
  ...js,
  [pd]: {
    _A: (e) => e
  },
  [re]() {
    return this.toJSON();
  },
  toString() {
    return we(this.toJSON());
  }
}, J_ = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(yd), {
  _tag: "Some",
  _op: "Some",
  [C](e) {
    return za(e) && Sd(e) && R(this.value, e.value);
  },
  [j]() {
    return ie(this, J($(this._tag))($(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: he(this.value)
    };
  }
}), V_ = /* @__PURE__ */ $("None"), z_ = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(yd), {
  _tag: "None",
  _op: "None",
  [C](e) {
    return za(e) && _d(e);
  },
  [j]() {
    return V_;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
}), za = (e) => M(e, pd), _d = (e) => e._tag === "None", Sd = (e) => e._tag === "Some", $c = /* @__PURE__ */ Object.create(z_), ys = (e) => {
  const t = Object.create(J_);
  return t.value = e, t;
}, bd = /* @__PURE__ */ Symbol.for("effect/Either"), wd = {
  ...js,
  [bd]: {
    _R: (e) => e
  },
  [re]() {
    return this.toJSON();
  },
  toString() {
    return we(this.toJSON());
  }
}, W_ = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(wd), {
  _tag: "Right",
  _op: "Right",
  [C](e) {
    return Wa(e) && kd(e) && R(this.right, e.right);
  },
  [j]() {
    return J($(this._tag))($(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: he(this.right)
    };
  }
}), G_ = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(wd), {
  _tag: "Left",
  _op: "Left",
  [C](e) {
    return Wa(e) && Ga(e) && R(this.left, e.left);
  },
  [j]() {
    return J($(this._tag))($(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: he(this.left)
    };
  }
}), Wa = (e) => M(e, bd), Ga = (e) => e._tag === "Left", kd = (e) => e._tag === "Right", H_ = (e) => {
  const t = Object.create(G_);
  return t.left = e, t;
}, Y_ = (e) => {
  const t = Object.create(W_);
  return t.right = e, t;
}, Q_ = (e) => Ga(e) ? $c : ys(e.right), L = Y_, N = H_, Od = Wa, Te = Ga, bt = kd, Z_ = /* @__PURE__ */ f(2, (e, {
  onLeft: t,
  onRight: n
}) => Te(e) ? N(t(e.left)) : L(n(e.right))), X_ = /* @__PURE__ */ f(2, (e, t) => Te(e) ? N(t(e.left)) : L(e.right)), eS = /* @__PURE__ */ f(2, (e, t) => bt(e) ? L(t(e.right)) : N(e.left)), Ha = /* @__PURE__ */ f(2, (e, {
  onLeft: t,
  onRight: n
}) => Te(e) ? t(e.left) : n(e.right)), tS = /* @__PURE__ */ Ha({
  onLeft: D,
  onRight: D
}), $d = /* @__PURE__ */ f(2, (e, t) => {
  if (bt(e))
    return e.right;
  throw t(e.left);
}), nS = /* @__PURE__ */ $d(() => new Error("getOrThrow called on a Left")), Td = (e) => e.length > 0, vd = (e) => (t, n) => t === n ? 0 : e(t, n), rS = /* @__PURE__ */ vd((e, t) => e < t ? -1 : 1), Ed = /* @__PURE__ */ f(2, (e, t) => vd((n, r) => e(t(n), t(r)))), sS = (e) => f(2, (t, n) => e(t, n) === 1), b = () => $c, O = ys, oS = za, de = _d, ne = Sd, be = /* @__PURE__ */ f(2, (e, {
  onNone: t,
  onSome: n
}) => de(e) ? t() : n(e.value)), cS = Q_, te = /* @__PURE__ */ f(2, (e, t) => de(e) ? t() : e.value), jt = /* @__PURE__ */ f(2, (e, t) => de(e) ? t() : e), iS = /* @__PURE__ */ f(2, (e, t) => de(e) ? O(t()) : e), Tc = (e) => e == null ? b() : O(e), _t = /* @__PURE__ */ te(ad), aS = (e) => (...t) => {
  try {
    return O(e(...t));
  } catch {
    return b();
  }
}, uS = /* @__PURE__ */ f(2, (e, t) => {
  if (ne(e))
    return e.value;
  throw t();
}), lN = /* @__PURE__ */ uS(() => new Error("getOrThrow called on a None")), ls = /* @__PURE__ */ f(2, (e, t) => de(e) ? b() : O(t(e.value))), Mr = /* @__PURE__ */ f(2, (e, t) => de(e) ? b() : t(e.value)), lS = /* @__PURE__ */ f(2, (e, t) => de(e) ? b() : Tc(t(e.value))), fS = Mr, Wr = /* @__PURE__ */ f(2, (e, t) => fS(e, (n) => t(n) ? ys(n) : $c)), hS = (e) => _c((t, n) => de(t) ? de(n) : de(n) ? !1 : e(t.value, n.value)), dS = (e) => f(2, (t, n) => de(t) ? !1 : e(t.value, n)), mS = /* @__PURE__ */ Ba(), gS = /* @__PURE__ */ dS(mS), pS = /* @__PURE__ */ f(2, (e, t) => de(e) ? !1 : t(e.value)), yS = (...e) => e, _S = /* @__PURE__ */ f(2, (e, t) => {
  let n = 0;
  for (const r of e) {
    const s = t(r, n);
    if (kn(s)) {
      if (s)
        return O(r);
    } else if (ne(s))
      return s;
    n++;
  }
  return b();
}), vc = (e) => new Array(e), SS = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.max(1, Math.floor(e)), r = new Array(n);
  for (let s = 0; s < n; s++)
    r[s] = t(s);
  return r;
}), oe = (e) => Array.isArray(e) ? e : Array.from(e), bS = (e) => Array.isArray(e) ? e : [e], wS = /* @__PURE__ */ f(2, (e, {
  onEmpty: t,
  onNonEmpty: n
}) => ce(e) ? n(Ke(e), On(e)) : t()), xo = /* @__PURE__ */ f(2, (e, t) => [t, ...e]), kS = /* @__PURE__ */ f(2, (e, t) => [...e, t]), Ya = /* @__PURE__ */ f(2, (e, t) => oe(e).concat(oe(t))), rt = Array.isArray, OS = (e) => e.length === 0, $S = OS, fs = Td, ce = Td, Id = (e, t) => e < 0 || e >= t.length, TS = (e, t) => Math.floor(Math.min(Math.max(0, e), t.length)), vS = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.floor(t);
  return Id(n, e) ? b() : O(e[n]);
}), Rd = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.floor(t);
  if (Id(n, e))
    throw new Error(`Index ${n} out of bounds`);
  return e[n];
}), hs = /* @__PURE__ */ vS(0), Ke = /* @__PURE__ */ Rd(0), ES = (e) => ce(e) ? O(Md(e)) : b(), Md = (e) => e[e.length - 1], On = (e) => e.slice(1), IS = (e, t) => {
  let n = 0;
  for (const r of e) {
    if (!t(r, n))
      break;
    n++;
  }
  return n;
}, RS = /* @__PURE__ */ f(2, (e, t) => CS(e, IS(e, t))), MS = /* @__PURE__ */ f(2, (e, t) => {
  const n = oe(e);
  return n.slice(TS(t, n), n.length);
}), FS = _S, El = (e) => Array.from(e).reverse(), _s = /* @__PURE__ */ f(2, (e, t) => {
  const n = Array.from(e);
  return n.sort(t), n;
}), Il = /* @__PURE__ */ f(2, (e, t) => NS(e, t, yS)), NS = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = oe(e), s = oe(t);
  if (ce(r) && ce(s)) {
    const o = [n(Ke(r), Ke(s))], c = Math.min(r.length, s.length);
    for (let a = 1; a < c; a++)
      o[a] = n(r[a], s[a]);
    return o;
  }
  return [];
}), AS = (e) => f(2, (t, n) => {
  for (const r of t)
    if (e(n, r))
      return !0;
  return !1;
}), Fd = /* @__PURE__ */ Ba(), CS = /* @__PURE__ */ f(2, (e, t) => {
  const n = Array.from(e), r = Math.floor(t);
  return ce(n) ? r >= 1 ? PS(n, r) : [[], n] : [n, []];
}), PS = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.max(1, Math.floor(t));
  return n >= e.length ? [ns(e), []] : [xo(e.slice(1, n), Ke(e)), e.slice(n)];
}), ns = (e) => e.slice(), xS = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = oe(e), s = oe(t);
  return ce(r) ? ce(s) ? Nd(n)(Ya(r, s)) : r : s;
}), bo = /* @__PURE__ */ f(2, (e, t) => xS(e, t, Fd)), LS = (e) => {
  const t = AS(e);
  return f(2, (n, r) => oe(n).filter((s) => t(r, s)));
}, jS = /* @__PURE__ */ LS(Fd), cr = () => [], st = (e) => [e], gn = /* @__PURE__ */ f(2, (e, t) => e.map(t)), Lo = /* @__PURE__ */ f(2, (e, t) => {
  if ($S(e))
    return [];
  const n = [];
  for (let r = 0; r < e.length; r++) {
    const s = t(e[r], r);
    for (let o = 0; o < s.length; o++)
      n.push(s[o]);
  }
  return n;
}), KS = /* @__PURE__ */ Lo(D), un = /* @__PURE__ */ f(2, (e, t) => {
  const n = oe(e), r = [];
  for (let s = 0; s < n.length; s++) {
    const o = t(n[s], s);
    ne(o) && r.push(o.value);
  }
  return r;
}), US = /* @__PURE__ */ f(2, (e, t) => {
  const n = oe(e), r = [];
  for (let s = 0; s < n.length; s++)
    t(n[s], s) && r.push(n[s]);
  return r;
}), Qa = /* @__PURE__ */ f(3, (e, t, n) => oe(e).reduce((r, s, o) => n(r, s, o), t)), Rl = (e, t) => {
  const n = [];
  let r = e, s;
  for (; ne(s = t(r)); ) {
    const [o, c] = s.value;
    n.push(o), r = c;
  }
  return n;
}, Za = h_, Nd = /* @__PURE__ */ f(2, (e, t) => {
  const n = oe(e);
  if (ce(n)) {
    const r = [Ke(n)], s = On(n);
    for (const o of s)
      r.every((c) => !t(o, c)) && r.push(o);
    return r;
  }
  return [];
}), DS = (e) => Nd(e, Ba()), Fr = /* @__PURE__ */ f(2, (e, t) => oe(e).join(t)), Ad = (e, t) => {
  switch (t._tag) {
    case "StringKeyword":
    case "TemplateLiteral":
      return Object.keys(e);
    case "SymbolKeyword":
      return Object.getOwnPropertySymbols(e);
    case "Refinement":
      return Ad(e, t.from);
  }
}, Zn = (e) => Object.keys(e).concat(Object.getOwnPropertySymbols(e)), Cd = (e) => {
  let t = !1, n;
  return () => (t || (n = e(), t = !0), n);
}, qS = (e) => {
  try {
    return e.toISOString();
  } catch {
    return String(e);
  }
}, Ot = (e, t = !0) => {
  if (Array.isArray(e))
    return `[${e.map((n) => Ot(n, t)).join(",")}]`;
  if (__(e))
    return qS(e);
  if (M(e, "toString") && Ps(e.toString) && e.toString !== Object.prototype.toString)
    return e.toString();
  if (Ue(e))
    return JSON.stringify(e);
  if (Ut(e) || e == null || kn(e) || ps(e))
    return String(e);
  if (bc(e))
    return String(e) + "n";
  if (Ua(e))
    return `${e.constructor.name}(${Ot(Array.from(e), t)})`;
  try {
    t && JSON.stringify(e);
    const n = `{${Zn(e).map((s) => `${Ue(s) ? JSON.stringify(s) : String(s)}:${Ot(e[s], !1)}`).join(",")}}`, r = e.constructor.name;
    return e.constructor !== Object.prototype.constructor ? `${r}(${n})` : n;
  } catch {
    return "<circular structure>";
  }
}, BS = (e) => typeof e == "string" ? JSON.stringify(e) : String(e), Pd = (e) => Array.isArray(e), JS = (e) => !Array.isArray(e), Ml = (e) => `[${BS(e)}]`, xd = (e) => Pd(e) ? e.map(Ml).join("") : Ml(e), Et = (e, t, n, r) => {
  let s = e;
  return n && ce(n) && (s += `
at path: ${xd(n)}`), t !== void 0 && (s += `
details: ${t}`), r && (s += `
schema (${r._tag}): ${r}`), s;
}, VS = (e, t, n) => Et("Unsupported schema", e, t, n), Ld = (e, t, n) => Et("Unsupported schema or overlapping types", `cannot extend ${e} with ${t}`, n), zS = (e) => Et("Unsupported template literal span", void 0, void 0, e), jo = (e) => VS(void 0, void 0, e), WS = (e) => Et("Unsupported key schema", void 0, void 0, e), GS = (e) => Et("Unsupported literal", `literal value: ${Ot(e)}`), Fl = (e) => Et("Duplicate index signature", `${e} index signature`), HS = /* @__PURE__ */ Et("Unsupported index signature parameter", "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types"), YS = /* @__PURE__ */ Et("Invalid element", "A required element cannot follow an optional element. ts(1257)"), Nl = (e) => Et("Duplicate property signature transformation", `Duplicate key ${Ot(e)}`), QS = (e) => Et("Duplicate property signature", `Duplicate key ${Ot(e)}`), ZS = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThan"), XS = /* @__PURE__ */ Symbol.for("effect/SchemaId/GreaterThanOrEqualTo"), eb = /* @__PURE__ */ Symbol.for("effect/SchemaId/Int"), ir = rS, Ko = (e) => e.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"), tb = /* @__PURE__ */ Symbol.for("effect/annotation/Brand"), nb = /* @__PURE__ */ Symbol.for("effect/annotation/SchemaId"), jd = /* @__PURE__ */ Symbol.for("effect/annotation/Message"), Xa = /* @__PURE__ */ Symbol.for("effect/annotation/MissingMessage"), eu = /* @__PURE__ */ Symbol.for("effect/annotation/Identifier"), Bt = /* @__PURE__ */ Symbol.for("effect/annotation/Title"), xi = /* @__PURE__ */ Symbol.for("effect/annotation/AutoTitle"), Ds = /* @__PURE__ */ Symbol.for("effect/annotation/Description"), Kd = /* @__PURE__ */ Symbol.for("effect/annotation/Examples"), Ud = /* @__PURE__ */ Symbol.for("effect/annotation/Default"), Dd = /* @__PURE__ */ Symbol.for("effect/annotation/JSONSchema"), qd = /* @__PURE__ */ Symbol.for("effect/annotation/Arbitrary"), Bd = /* @__PURE__ */ Symbol.for("effect/annotation/Pretty"), Jd = /* @__PURE__ */ Symbol.for("effect/annotation/Equivalence"), rb = /* @__PURE__ */ Symbol.for("effect/annotation/Documentation"), Vd = /* @__PURE__ */ Symbol.for("effect/annotation/Concurrency"), zd = /* @__PURE__ */ Symbol.for("effect/annotation/Batching"), Wd = /* @__PURE__ */ Symbol.for("effect/annotation/ParseIssueTitle"), Gd = /* @__PURE__ */ Symbol.for("effect/annotation/ParseOptions"), Hd = /* @__PURE__ */ Symbol.for("effect/annotation/DecodingFallback"), Yd = /* @__PURE__ */ Symbol.for("effect/annotation/Surrogate"), sb = /* @__PURE__ */ Symbol.for("effect/annotation/StableFilter"), xe = /* @__PURE__ */ f(2, (e, t) => Object.prototype.hasOwnProperty.call(e.annotations, t) ? O(e.annotations[t]) : b()), ob = /* @__PURE__ */ xe(tb), cb = /* @__PURE__ */ xe(jd), ib = /* @__PURE__ */ xe(Xa), Qd = /* @__PURE__ */ xe(Bt), Zd = /* @__PURE__ */ xe(xi), Ec = /* @__PURE__ */ xe(eu), Xd = /* @__PURE__ */ xe(Ds), ab = /* @__PURE__ */ xe(Vd), ub = /* @__PURE__ */ xe(zd), lb = /* @__PURE__ */ xe(Wd), fb = /* @__PURE__ */ xe(Gd), hb = /* @__PURE__ */ xe(Hd), Nr = /* @__PURE__ */ xe(Yd), db = /* @__PURE__ */ xe(sb), mb = (e) => pS(db(e), (t) => t === !0), em = /* @__PURE__ */ Symbol.for("effect/annotation/JSONIdentifier"), gb = /* @__PURE__ */ xe(em), pb = (e) => jt(gb(e), () => Ec(e));
class Ic {
  constructor(t, n, r, s = {}) {
    i(this, "typeParameters");
    i(this, "decodeUnknown");
    i(this, "encodeUnknown");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Declaration");
    this.typeParameters = t, this.decodeUnknown = n, this.encodeUnknown = r, this.annotations = s;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => "<declaration schema>");
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      typeParameters: this.typeParameters.map((t) => t.toJSON()),
      annotations: pe(this.annotations)
    };
  }
}
const It = (e) => (t) => t._tag === e;
let ar = class {
  constructor(t, n = {}) {
    i(this, "literal");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Literal");
    this.literal = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => Ot(this.literal));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      literal: bc(this.literal) ? String(this.literal) : this.literal,
      annotations: pe(this.annotations)
    };
  }
};
const pn = /* @__PURE__ */ It("Literal"), yb = /* @__PURE__ */ new ar(null);
class tm {
  constructor(t, n = {}) {
    i(this, "symbol");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "UniqueSymbol");
    this.symbol = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => Ot(this.symbol));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      symbol: String(this.symbol),
      annotations: pe(this.annotations)
    };
  }
}
class _b {
  constructor(t = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "UndefinedKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return An(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: pe(this.annotations)
    };
  }
}
const Sb = /* @__PURE__ */ new _b({
  [Bt]: "undefined"
});
class bb {
  constructor(t = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "NeverKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return An(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: pe(this.annotations)
    };
  }
}
const nm = /* @__PURE__ */ new bb({
  [Bt]: "never"
});
class wb {
  constructor(t = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "UnknownKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return An(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: pe(this.annotations)
    };
  }
}
const kb = /* @__PURE__ */ new wb({
  [Bt]: "unknown"
});
class Ob {
  constructor(t = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "AnyKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return An(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: pe(this.annotations)
    };
  }
}
const rm = /* @__PURE__ */ new Ob({
  [Bt]: "any"
});
class $b {
  constructor(t = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "StringKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return An(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: pe(this.annotations)
    };
  }
}
const Li = /* @__PURE__ */ new $b({
  [Bt]: "string",
  [Ds]: "a string"
}), Uo = /* @__PURE__ */ It("StringKeyword");
class Tb {
  constructor(t = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "NumberKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return An(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: pe(this.annotations)
    };
  }
}
const ji = /* @__PURE__ */ new Tb({
  [Bt]: "number",
  [Ds]: "a number"
}), Al = /* @__PURE__ */ It("NumberKeyword");
class vb {
  constructor(t = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "BooleanKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return An(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: pe(this.annotations)
    };
  }
}
const Ki = /* @__PURE__ */ new vb({
  [Bt]: "boolean",
  [Ds]: "a boolean"
}), Cl = /* @__PURE__ */ It("BooleanKeyword"), sm = /* @__PURE__ */ It("SymbolKeyword"), om = (e) => {
  switch (e._tag) {
    case "Literal":
    case "NumberKeyword":
    case "StringKeyword":
    case "TemplateLiteral":
      return !0;
    case "Union":
      return e.types.every(om);
  }
  return !1;
}, cm = (e) => {
  switch (e._tag) {
    case "Literal":
      return JSON.stringify(String(e.literal));
    case "StringKeyword":
      return "string";
    case "NumberKeyword":
      return "number";
    case "TemplateLiteral":
      return String(e);
    case "Union":
      return e.types.map(cm).join(" | ");
  }
}, Eb = (e) => {
  switch (e._tag) {
    case "Literal":
      return String(e.literal);
    case "StringKeyword":
      return "${string}";
    case "NumberKeyword":
      return "${number}";
    case "TemplateLiteral":
      return "${" + String(e) + "}";
    case "Union":
      return "${" + e.types.map(cm).join(" | ") + "}";
  }
};
class Gr {
  constructor(t, n) {
    i(this, "literal");
    /**
     * @since 3.10.0
     */
    i(this, "type");
    if (this.literal = n, om(t))
      this.type = t;
    else
      throw new Error(zS(t));
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return Eb(this.type) + this.literal;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      literal: this.literal
    };
  }
}
let Pl = class {
  constructor(t, n, r = {}) {
    i(this, "head");
    i(this, "spans");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "TemplateLiteral");
    this.head = t, this.spans = n, this.annotations = r;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => Ib(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      head: this.head,
      spans: this.spans.map((t) => t.toJSON()),
      annotations: pe(this.annotations)
    };
  }
};
const Ib = (e) => "`" + e.head + e.spans.map(String).join("") + "`", Rb = /* @__PURE__ */ It("TemplateLiteral");
let Rc = class {
  constructor(t, n = {}) {
    i(this, "type");
    i(this, "annotations");
    this.type = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      annotations: pe(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type);
  }
};
class nn extends Rc {
  constructor(n, r, s = {}) {
    super(n, s);
    i(this, "isOptional");
    this.isOptional = r;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      annotations: pe(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type) + (this.isOptional ? "?" : "");
  }
}
const im = (e) => e.map((t) => t.type);
class Mc {
  constructor(t, n, r, s = {}) {
    i(this, "elements");
    i(this, "rest");
    i(this, "isReadonly");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "TupleType");
    this.elements = t, this.rest = n, this.isReadonly = r, this.annotations = s;
    let o = !1, c = !1;
    for (const a of t)
      if (a.isOptional)
        o = !0;
      else if (o) {
        c = !0;
        break;
      }
    if (c || o && n.length > 1)
      throw new Error(YS);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => Mb(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      elements: this.elements.map((t) => t.toJSON()),
      rest: this.rest.map((t) => t.toJSON()),
      isReadonly: this.isReadonly,
      annotations: pe(this.annotations)
    };
  }
}
const Mb = (e) => {
  const t = e.elements.map(String).join(", ");
  return wS(e.rest, {
    onEmpty: () => `readonly [${t}]`,
    onNonEmpty: (n, r) => {
      const s = String(n), o = s.includes(" | ") ? `(${s})` : s;
      if (r.length > 0) {
        const c = r.map(String).join(", ");
        return e.elements.length > 0 ? `readonly [${t}, ...${o}[], ${c}]` : `readonly [...${o}[], ${c}]`;
      } else
        return e.elements.length > 0 ? `readonly [${t}, ...${o}[]]` : `ReadonlyArray<${s}>`;
    }
  });
};
class ue extends nn {
  constructor(n, r, s, o, c) {
    super(r, s, c);
    i(this, "name");
    i(this, "isReadonly");
    this.name = n, this.isReadonly = o;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + String(this.name) + (this.isOptional ? "?" : "") + ": " + this.type;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      name: String(this.name),
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      isReadonly: this.isReadonly,
      annotations: pe(this.annotations)
    };
  }
}
const am = (e) => {
  switch (e._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return !0;
    case "Refinement":
      return am(e.from);
  }
  return !1;
};
class Fc {
  constructor(t, n, r) {
    i(this, "type");
    i(this, "isReadonly");
    /**
     * @since 3.10.0
     */
    i(this, "parameter");
    if (this.type = n, this.isReadonly = r, am(t))
      this.parameter = t;
    else
      throw new Error(HS);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return (this.isReadonly ? "readonly " : "") + `[x: ${this.parameter}]: ${this.type}`;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      parameter: this.parameter.toJSON(),
      type: this.type.toJSON(),
      isReadonly: this.isReadonly
    };
  }
}
class Ze {
  constructor(t, n, r = {}) {
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "TypeLiteral");
    /**
     * @since 3.10.0
     */
    i(this, "propertySignatures");
    /**
     * @since 3.10.0
     */
    i(this, "indexSignatures");
    this.annotations = r;
    const s = {};
    for (let c = 0; c < t.length; c++) {
      const a = t[c].name;
      if (Object.prototype.hasOwnProperty.call(s, a))
        throw new Error(QS(a));
      s[a] = null;
    }
    const o = {
      string: !1,
      symbol: !1
    };
    for (let c = 0; c < n.length; c++) {
      const a = fr(n[c].parameter);
      if (Uo(a)) {
        if (o.string)
          throw new Error(Fl("string"));
        o.string = !0;
      } else if (sm(a)) {
        if (o.symbol)
          throw new Error(Fl("symbol"));
        o.symbol = !0;
      }
    }
    this.propertySignatures = t, this.indexSignatures = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => Fb(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      propertySignatures: this.propertySignatures.map((t) => t.toJSON()),
      indexSignatures: this.indexSignatures.map((t) => t.toJSON()),
      annotations: pe(this.annotations)
    };
  }
}
const xl = (e) => e.map(String).join("; "), Fb = (e) => {
  if (e.propertySignatures.length > 0) {
    const t = e.propertySignatures.map(String).join("; ");
    return e.indexSignatures.length > 0 ? `{ ${t}; ${xl(e.indexSignatures)} }` : `{ ${t} }`;
  } else
    return e.indexSignatures.length > 0 ? `{ ${xl(e.indexSignatures)} }` : "{}";
}, Ll = /* @__PURE__ */ It("TypeLiteral"), Nb = /* @__PURE__ */ _s(/* @__PURE__ */ Ed(ir, (e) => {
  switch (e._tag) {
    case "AnyKeyword":
      return 0;
    case "UnknownKeyword":
      return 1;
    case "ObjectKeyword":
      return 2;
    case "StringKeyword":
    case "NumberKeyword":
    case "BooleanKeyword":
    case "BigIntKeyword":
    case "SymbolKeyword":
      return 3;
  }
  return 4;
})), Ab = {
  string: "StringKeyword",
  number: "NumberKeyword",
  boolean: "BooleanKeyword",
  bigint: "BigIntKeyword"
}, um = (e) => Lo(e, (t) => nu(t) ? um(t.types) : [t]), Cb = (e) => {
  const t = Nb(e), n = [], r = {}, s = [];
  for (const o of t)
    switch (o._tag) {
      case "NeverKeyword":
        break;
      case "AnyKeyword":
        return [rm];
      case "UnknownKeyword":
        return [kb];
      // uniques
      case "ObjectKeyword":
      case "UndefinedKeyword":
      case "VoidKeyword":
      case "StringKeyword":
      case "NumberKeyword":
      case "BooleanKeyword":
      case "BigIntKeyword":
      case "SymbolKeyword": {
        r[o._tag] || (r[o._tag] = o, n.push(o));
        break;
      }
      case "Literal": {
        const c = typeof o.literal;
        switch (c) {
          case "string":
          case "number":
          case "bigint":
          case "boolean": {
            const a = Ab[c];
            !r[a] && !s.includes(o.literal) && (s.push(o.literal), n.push(o));
            break;
          }
          // null
          case "object": {
            s.includes(o.literal) || (s.push(o.literal), n.push(o));
            break;
          }
        }
        break;
      }
      case "UniqueSymbol": {
        !r.SymbolKeyword && !s.includes(o.symbol) && (s.push(o.symbol), n.push(o));
        break;
      }
      case "TupleType": {
        r.ObjectKeyword || n.push(o);
        break;
      }
      case "TypeLiteral": {
        o.propertySignatures.length === 0 && o.indexSignatures.length === 0 ? r["{}"] || (r["{}"] = o, n.push(o)) : r.ObjectKeyword || n.push(o);
        break;
      }
      default:
        n.push(o);
    }
  return n;
};
var Pt;
let Je = (Pt = class {
  constructor(t, n = {}) {
    i(this, "types");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Union");
    this.types = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => this.types.map(String).join(" | "));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      types: this.types.map((t) => t.toJSON()),
      annotations: pe(this.annotations)
    };
  }
}, i(Pt, "make", (t, n) => tu(t) ? new Pt(t, n) : t.length === 1 ? t[0] : nm), /** @internal */
i(Pt, "unify", (t, n) => Pt.make(Cb(um(t)), n)), Pt);
const Pb = (e, t) => e.map(t), tu = (e) => e.length > 1, nu = /* @__PURE__ */ It("Union"), mi = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/Schema/AST/toJSONMemoMap"), () => /* @__PURE__ */ new WeakMap());
class ur {
  constructor(t, n = {}) {
    i(this, "f");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Suspend");
    this.f = t, this.annotations = n, this.f = Cd(t);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return ht(this).pipe(jt(() => Mr(aS(this.f)(), (t) => ht(t))), te(() => "<suspended schema>"));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    const t = this.f();
    let n = mi.get(t);
    return n || (mi.set(t, {
      _tag: this._tag
    }), n = {
      _tag: this._tag,
      ast: t.toJSON(),
      annotations: pe(this.annotations)
    }, mi.set(t, n), n);
  }
}
let ru = class {
  constructor(t, n, r = {}) {
    i(this, "from");
    i(this, "filter");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Refinement");
    this.from = t, this.filter = n, this.annotations = r;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return Ec(this).pipe(te(() => be(_m(this), {
      onNone: () => `{ ${this.from} | filter }`,
      onSome: (t) => Xn(this.from) ? String(this.from) + " & " + t : t
    })));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      annotations: pe(this.annotations)
    };
  }
};
const Xn = /* @__PURE__ */ It("Refinement"), gi = {};
let wt = class {
  constructor(t, n, r, s = {}) {
    i(this, "from");
    i(this, "to");
    i(this, "transformation");
    i(this, "annotations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Transformation");
    this.from = t, this.to = n, this.transformation = r, this.annotations = s;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return te(ht(this), () => `(${String(this.from)} <-> ${String(this.to)})`);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      to: this.to.toJSON(),
      annotations: pe(this.annotations)
    };
  }
};
const xb = /* @__PURE__ */ It("Transformation");
class lm {
  constructor(t, n) {
    i(this, "decode");
    i(this, "encode");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "FinalTransformation");
    this.decode = t, this.encode = n;
  }
}
const Lb = (e) => (t) => t._tag === e;
class jb {
  constructor() {
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "ComposeTransformation");
  }
}
const fm = /* @__PURE__ */ new jb();
let hm = class {
  constructor(t, n, r, s) {
    i(this, "from");
    i(this, "to");
    i(this, "decode");
    i(this, "encode");
    this.from = t, this.to = n, this.decode = r, this.encode = s;
  }
};
const Kb = (e) => e.decode === D && e.encode === D;
class Ss {
  constructor(t) {
    i(this, "propertySignatureTransformations");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "TypeLiteralTransformation");
    this.propertySignatureTransformations = t;
    const n = {}, r = {};
    for (const s of t) {
      const o = s.from;
      if (n[o])
        throw new Error(Nl(o));
      n[o] = !0;
      const c = s.to;
      if (r[c])
        throw new Error(Nl(c));
      r[c] = !0;
    }
  }
}
const Ui = /* @__PURE__ */ Lb("TypeLiteralTransformation"), lr = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {
    ...e.annotations,
    ...t
  }, s = Nr(e);
  return ne(s) && (r[Yd] = lr(s.value, t)), n.annotations.value = r, Object.create(Object.getPrototypeOf(e), n);
}, Ub = "[\\s\\S]*", Db = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?", dm = (e, t) => {
  switch (e._tag) {
    case "Literal":
      return Ko(String(e.literal));
    case "StringKeyword":
      return Ub;
    case "NumberKeyword":
      return Db;
    case "TemplateLiteral":
      return mm(e);
    case "Union":
      return e.types.map((n) => dm(n)).join("|");
  }
}, qb = (e, t, n, r) => nu(e) ? `(${t})` : t, mm = (e, t, n) => {
  let r = "";
  if (e.head !== "") {
    const s = Ko(e.head);
    r += s;
  }
  for (const s of e.spans) {
    const o = dm(s.type);
    if (r += qb(s.type, o), s.literal !== "") {
      const c = Ko(s.literal);
      r += c;
    }
  }
  return r;
}, gm = (e) => new RegExp(`^${mm(e)}$`), wo = (e) => {
  const t = Nr(e);
  if (ne(t))
    return wo(t.value);
  switch (e._tag) {
    case "TypeLiteral":
      return e.indexSignatures.slice();
    case "Suspend":
      return wo(e.f());
    case "Refinement":
      return wo(e.from);
  }
  return [];
}, pm = (e, t) => {
  const n = FS(e.propertySignatures, (r) => r.name === t);
  if (ne(n))
    return n.value;
  if (Ue(t)) {
    let r;
    for (const s of e.indexSignatures) {
      const o = fr(s.parameter);
      switch (o._tag) {
        case "TemplateLiteral": {
          if (gm(o).test(t))
            return new ue(t, s.type, !1, !0);
          break;
        }
        case "StringKeyword":
          r === void 0 && (r = new ue(t, s.type, !1, !0));
      }
    }
    if (r)
      return r;
  } else if (ps(t))
    for (const r of e.indexSignatures) {
      const s = fr(r.parameter);
      if (sm(s))
        return new ue(t, r.type, !1, !0);
    }
}, rs = (e, t) => {
  const n = Nr(e);
  if (ne(n))
    return rs(n.value, t);
  switch (e._tag) {
    case "TypeLiteral": {
      const r = pm(e, t);
      if (r)
        return r;
      break;
    }
    case "Union":
      return new ue(t, Je.make(e.types.map((r) => rs(r, t).type)), !1, !0);
    case "Suspend":
      return rs(e.f(), t);
    case "Refinement":
      return rs(e.from, t);
  }
  throw new Error(jo(e));
}, ln = (e) => {
  const t = Nr(e);
  if (ne(t))
    return ln(t.value);
  switch (e._tag) {
    case "TypeLiteral":
      return e.propertySignatures.map((n) => n.name);
    case "Union":
      return e.types.slice(1).reduce((n, r) => jS(n, ln(r)), ln(e.types[0]));
    case "Suspend":
      return ln(e.f());
    case "Refinement":
      return ln(e.from);
    case "Transformation":
      return ln(e.to);
  }
  return [];
}, jl = (e, t) => {
  const n = [], r = [], s = (o) => {
    switch (o._tag) {
      case "NeverKeyword":
        break;
      case "StringKeyword":
      case "SymbolKeyword":
      case "TemplateLiteral":
      case "Refinement":
        r.push(new Fc(o, t, !0));
        break;
      case "Literal":
        if (Ue(o.literal) || Ut(o.literal))
          n.push(new ue(o.literal, t, !1, !0));
        else
          throw new Error(GS(o.literal));
        break;
      case "Enums": {
        for (const [c, a] of o.enums)
          n.push(new ue(a, t, !1, !0));
        break;
      }
      case "UniqueSymbol":
        n.push(new ue(o.symbol, t, !1, !0));
        break;
      case "Union":
        o.types.forEach(s);
        break;
      default:
        throw new Error(WS(o));
    }
  };
  return s(e), {
    propertySignatures: n,
    indexSignatures: r
  };
}, yt = (e, t) => {
  const n = Nr(e);
  if (ne(n))
    return yt(n.value, t);
  switch (e._tag) {
    case "TypeLiteral": {
      const r = [], s = {};
      for (const o of e.propertySignatures)
        s[o.name] = null, t.includes(o.name) && r.push(o);
      for (const o of t)
        if (!(o in s)) {
          const c = pm(e, o);
          c && r.push(c);
        }
      return new Ze(r, []);
    }
    case "Union":
      return new Ze(t.map((r) => rs(e, r)), []);
    case "Suspend":
      return yt(e.f(), t);
    case "Refinement":
      return yt(e.from, t);
    case "Transformation":
      switch (e.transformation._tag) {
        case "ComposeTransformation":
          return new wt(yt(e.from, t), yt(e.to, t), fm);
        case "TypeLiteralTransformation": {
          const r = [], s = [];
          for (const o of t) {
            const c = e.transformation.propertySignatureTransformations.find((a) => a.to === o);
            c ? (r.push(c), s.push(c.from)) : s.push(o);
          }
          return ce(r) ? new wt(yt(e.from, s), yt(e.to, t), new Ss(r)) : yt(e.from, s);
        }
      }
  }
  throw new Error(jo(e));
}, Bb = (e, t) => {
  let n = wo(e);
  return n.length > 0 ? (n.some((r) => Uo(fr(r.parameter))) && (n = n.filter((r) => !Rb(fr(r.parameter)))), new Ze([], n)) : yt(e, ln(e).filter((r) => !t.includes(r)));
}, ss = (e) => {
  switch (e._tag) {
    case "TupleType":
      return new Mc(e.elements.map((t) => new nn(t.type, !1)), e.rest, e.isReadonly);
    case "TypeLiteral":
      return new Ze(e.propertySignatures.map((t) => new ue(t.name, t.type, !1, t.isReadonly, t.annotations)), e.indexSignatures);
    case "Union":
      return Je.make(e.types.map((t) => ss(t)));
    case "Suspend":
      return new ur(() => ss(e.f()));
    case "Declaration":
    case "Refinement":
      throw new Error(jo(e));
    case "Transformation": {
      if (Ui(e.transformation) && e.transformation.propertySignatureTransformations.every(Kb))
        return new wt(ss(e.from), ss(e.to), e.transformation);
      throw new Error(jo(e));
    }
  }
  return e;
}, ym = (e) => (t) => {
  let n;
  for (const r of e)
    Object.prototype.hasOwnProperty.call(t.annotations, r) && (n === void 0 && (n = {}), n[r] = t.annotations[r]);
  return n;
}, Jb = (e) => (t) => {
  const n = {
    ...t.annotations
  };
  for (const r of e)
    delete n[r];
  return n;
}, Vb = /* @__PURE__ */ ym([Kd, Ud, Dd, qd, Bd, Jd]), ge = (e) => {
  switch (e._tag) {
    case "Declaration": {
      const t = Qe(e.typeParameters, ge);
      return t === e.typeParameters ? e : new Ic(t, e.decodeUnknown, e.encodeUnknown, e.annotations);
    }
    case "TupleType": {
      const t = Qe(e.elements, (s) => {
        const o = ge(s.type);
        return o === s.type ? s : new nn(o, s.isOptional);
      }), n = im(e.rest), r = Qe(n, ge);
      return t === e.elements && r === n ? e : new Mc(t, r.map((s) => new Rc(s)), e.isReadonly, e.annotations);
    }
    case "TypeLiteral": {
      const t = Qe(e.propertySignatures, (r) => {
        const s = ge(r.type);
        return s === r.type ? r : new ue(r.name, s, r.isOptional, r.isReadonly);
      }), n = Qe(e.indexSignatures, (r) => {
        const s = ge(r.type);
        return s === r.type ? r : new Fc(r.parameter, s, r.isReadonly);
      });
      return t === e.propertySignatures && n === e.indexSignatures ? e : new Ze(t, n, e.annotations);
    }
    case "Union": {
      const t = Qe(e.types, ge);
      return t === e.types ? e : Je.make(t, e.annotations);
    }
    case "Suspend":
      return new ur(() => ge(e.f()), e.annotations);
    case "Refinement": {
      const t = ge(e.from);
      return t === e.from ? e : new ru(t, e.filter, e.annotations);
    }
    case "Transformation": {
      const t = Vb(e);
      return ge(t !== void 0 ? lr(e.to, t) : e.to);
    }
  }
  return e;
}, jn = (e) => be(pb(e), {
  onNone: () => {
  },
  onSome: (t) => ({
    [em]: t
  })
});
function Qe(e, t) {
  let n = !1;
  const r = vc(e.length);
  for (let s = 0; s < e.length; s++) {
    const o = e[s], c = t(o);
    c !== o && (n = !0), r[s] = c;
  }
  return n ? r : e;
}
const gt = (e, t) => {
  switch (e._tag) {
    case "Declaration": {
      const n = Qe(e.typeParameters, (r) => gt(r));
      return n === e.typeParameters ? e : new Ic(n, e.decodeUnknown, e.encodeUnknown, e.annotations);
    }
    case "TupleType": {
      const n = Qe(e.elements, (o) => {
        const c = gt(o.type);
        return c === o.type ? o : new nn(c, o.isOptional);
      }), r = im(e.rest), s = Qe(r, (o) => gt(o));
      return n === e.elements && s === r ? e : new Mc(n, s.map((o) => new Rc(o)), e.isReadonly, jn(e));
    }
    case "TypeLiteral": {
      const n = Qe(e.propertySignatures, (s) => {
        const o = gt(s.type);
        return o === s.type ? s : new ue(s.name, o, s.isOptional, s.isReadonly);
      }), r = Qe(e.indexSignatures, (s) => {
        const o = gt(s.type);
        return o === s.type ? s : new Fc(s.parameter, o, s.isReadonly);
      });
      return n === e.propertySignatures && r === e.indexSignatures ? e : new Ze(n, r, jn(e));
    }
    case "Union": {
      const n = Qe(e.types, (r) => gt(r));
      return n === e.types ? e : Je.make(n, jn(e));
    }
    case "Suspend":
      return new ur(() => gt(e.f()), jn(e));
    case "Refinement": {
      const n = gt(e.from), r = jn(e);
      return r ? lr(n, r) : n;
    }
    case "Transformation": {
      const n = jn(e);
      return gt(n ? lr(e.from, n) : e.from);
    }
  }
  return e;
}, Di = (e) => gt(e), pe = (e) => {
  const t = {};
  for (const n of Object.getOwnPropertySymbols(e))
    t[String(n)] = e[n];
  return t;
}, fr = (e) => {
  switch (e._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return e;
    case "Refinement":
      return fr(e.from);
  }
}, An = (e) => te(ht(e), () => e._tag);
function zb(e) {
  return be(ob(e), {
    onNone: () => "",
    onSome: (t) => t.map((n) => ` & Brand<${Ot(n)}>`).join("")
  });
}
const _m = (e) => Qd(e).pipe(jt(() => Xd(e)), jt(() => Zd(e)), ls((t) => t + zb(e))), ht = (e) => jt(Ec(e), () => _m(e)), Wb = /* @__PURE__ */ Symbol.for("effect/Context/Tag"), Do = /* @__PURE__ */ Symbol.for("effect/Context/Reference"), Gb = "effect/STM", Hb = /* @__PURE__ */ Symbol.for(Gb), Sm = {
  ...js,
  _op: "Tag",
  [Hb]: or,
  [Wb]: {
    _Service: (e) => e,
    _Identifier: (e) => e
  },
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [re]() {
    return this.toJSON();
  },
  of(e) {
    return e;
  },
  context(e) {
    return km(this, e);
  }
}, Yb = {
  ...Sm,
  [Do]: Do
}, Qb = (e) => {
  const t = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const n = new Error();
  Error.stackTraceLimit = t;
  const r = Object.create(Sm);
  return Object.defineProperty(r, "stack", {
    get() {
      return n.stack;
    }
  }), r.key = e, r;
}, Zb = () => (e, t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const r = new Error();
  Error.stackTraceLimit = n;
  function s() {
  }
  return Object.setPrototypeOf(s, Yb), s.key = e, s.defaultValue = t.defaultValue, Object.defineProperty(s, "stack", {
    get() {
      return r.stack;
    }
  }), s;
}, bm = /* @__PURE__ */ Symbol.for("effect/Context"), Xb = {
  [bm]: {
    _Services: (e) => e
  },
  [C](e) {
    if (wm(e) && this.unsafeMap.size === e.unsafeMap.size) {
      for (const t of this.unsafeMap.keys())
        if (!e.unsafeMap.has(t) || !R(this.unsafeMap.get(t), e.unsafeMap.get(t)))
          return !1;
      return !0;
    }
    return !1;
  },
  [j]() {
    return ie(this, qa(this.unsafeMap.size));
  },
  pipe() {
    return v(this, arguments);
  },
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(he)
    };
  },
  [re]() {
    return this.toJSON();
  }
}, hr = (e) => {
  const t = Object.create(Xb);
  return t.unsafeMap = e, t;
}, ew = (e) => {
  const t = new Error(`Service not found${e.key ? `: ${String(e.key)}` : ""}`);
  if (e.stack) {
    const n = e.stack.split(`
`);
    if (n.length > 2) {
      const r = n[2].match(/at (.*)/);
      r && (t.message = t.message + ` (defined at ${r[1]})`);
    }
  }
  if (t.stack) {
    const n = t.stack.split(`
`);
    n.splice(1, 3), t.stack = n.join(`
`);
  }
  return t;
}, wm = (e) => M(e, bm), tw = (e) => M(e, Do), nw = /* @__PURE__ */ hr(/* @__PURE__ */ new Map()), rw = () => nw, km = (e, t) => hr(/* @__PURE__ */ new Map([[e.key, t]])), sw = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = new Map(e.unsafeMap);
  return r.set(t.key, n), hr(r);
}), pi = /* @__PURE__ */ z("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map()), su = (e) => {
  if (pi.has(e.key))
    return pi.get(e.key);
  const t = e.defaultValue();
  return pi.set(e.key, t), t;
}, ow = (e, t) => e.unsafeMap.has(t.key) ? e.unsafeMap.get(t.key) : su(t), Om = /* @__PURE__ */ f(2, (e, t) => {
  if (!e.unsafeMap.has(t.key)) {
    if (Do in t) return su(t);
    throw ew(t);
  }
  return e.unsafeMap.get(t.key);
}), cw = Om, iw = /* @__PURE__ */ f(2, (e, t) => e.unsafeMap.has(t.key) ? ys(e.unsafeMap.get(t.key)) : tw(t) ? ys(su(t)) : $c), aw = /* @__PURE__ */ f(2, (e, t) => {
  const n = new Map(e.unsafeMap);
  for (const [r, s] of t.unsafeMap)
    n.set(r, s);
  return hr(n);
}), Cn = Qb, uw = wm, ou = rw, lw = km, Vn = sw, $m = cw, Tm = Om, qs = iw, Bs = aw, cu = Zb, vm = /* @__PURE__ */ Symbol.for("effect/Chunk");
function fw(e, t, n, r, s) {
  for (let o = t; o < Math.min(e.length, t + s); o++)
    n[r + o - t] = e[o];
  return n;
}
const Em = [], hw = (e) => _c((t, n) => t.length === n.length && Ht(t).every((r, s) => e(r, yn(n, s)))), dw = /* @__PURE__ */ hw(R), mw = {
  [vm]: {
    _A: (e) => e
  },
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: Ht(this).map(he)
    };
  },
  [re]() {
    return this.toJSON();
  },
  [C](e) {
    return Im(e) && dw(this, e);
  },
  [j]() {
    return ie(this, Ls(Ht(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray":
        return this.backing.array[Symbol.iterator]();
      case "IEmpty":
        return Em[Symbol.iterator]();
      default:
        return Ht(this)[Symbol.iterator]();
    }
  },
  pipe() {
    return v(this, arguments);
  }
}, _e = (e) => {
  const t = Object.create(mw);
  switch (t.backing = e, e._tag) {
    case "IEmpty": {
      t.length = 0, t.depth = 0, t.left = t, t.right = t;
      break;
    }
    case "IConcat": {
      t.length = e.left.length + e.right.length, t.depth = 1 + Math.max(e.left.depth, e.right.depth), t.left = e.left, t.right = e.right;
      break;
    }
    case "IArray": {
      t.length = e.array.length, t.depth = 0, t.left = St, t.right = St;
      break;
    }
    case "ISingleton": {
      t.length = 1, t.depth = 0, t.left = St, t.right = St;
      break;
    }
    case "ISlice": {
      t.length = e.length, t.depth = e.chunk.depth + 1, t.left = St, t.right = St;
      break;
    }
  }
  return t;
}, Im = (e) => M(e, vm), St = /* @__PURE__ */ _e({
  _tag: "IEmpty"
}), $t = () => St, yi = (...e) => _w(e), Pe = (e) => _e({
  _tag: "ISingleton",
  a: e
}), Rm = (e) => Im(e) ? e : Ar(oe(e)), qi = (e, t, n) => {
  switch (e.backing._tag) {
    case "IArray": {
      fw(e.backing.array, 0, t, n, e.length);
      break;
    }
    case "IConcat": {
      qi(e.left, t, n), qi(e.right, t, n + e.left.length);
      break;
    }
    case "ISingleton": {
      t[n] = e.backing.a;
      break;
    }
    case "ISlice": {
      let r = 0, s = n;
      for (; r < e.length; )
        t[s] = yn(e, r), r += 1, s += 1;
      break;
    }
  }
}, gw = (e) => {
  switch (e.backing._tag) {
    case "IEmpty":
      return Em;
    case "IArray":
      return e.backing.array;
    default: {
      const t = new Array(e.length);
      return qi(e, t, 0), e.backing = {
        _tag: "IArray",
        array: t
      }, e.left = St, e.right = St, e.depth = 0, t;
    }
  }
}, Ht = gw, pw = (e) => {
  switch (e.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return e;
    case "IArray":
      return _e({
        _tag: "IArray",
        array: El(e.backing.array)
      });
    case "IConcat":
      return _e({
        _tag: "IConcat",
        left: $n(e.backing.right),
        right: $n(e.backing.left)
      });
    case "ISlice":
      return Ar(El(Ht(e)));
  }
}, $n = pw, yw = /* @__PURE__ */ f(2, (e, t) => t < 0 || t >= e.length ? b() : O(yn(e, t))), Ar = (e) => e.length === 0 ? $t() : e.length === 1 ? Pe(e[0]) : _e({
  _tag: "IArray",
  array: e
}), _w = (e) => Ar(e), yn = /* @__PURE__ */ f(2, (e, t) => {
  switch (e.backing._tag) {
    case "IEmpty":
      throw new Error("Index out of bounds");
    case "ISingleton": {
      if (t !== 0)
        throw new Error("Index out of bounds");
      return e.backing.a;
    }
    case "IArray": {
      if (t >= e.length || t < 0)
        throw new Error("Index out of bounds");
      return e.backing.array[t];
    }
    case "IConcat":
      return t < e.left.length ? yn(e.left, t) : yn(e.right, t - e.left.length);
    case "ISlice":
      return yn(e.backing.chunk, t + e.backing.offset);
  }
}), Sw = /* @__PURE__ */ f(2, (e, t) => at(e, Pe(t))), et = /* @__PURE__ */ f(2, (e, t) => at(Pe(t), e)), Bi = /* @__PURE__ */ f(2, (e, t) => {
  if (t <= 0)
    return e;
  if (t >= e.length)
    return St;
  switch (e.backing._tag) {
    case "ISlice":
      return _e({
        _tag: "ISlice",
        chunk: e.backing.chunk,
        offset: e.backing.offset + t,
        length: e.backing.length - t
      });
    case "IConcat":
      return t > e.left.length ? Bi(e.right, t - e.left.length) : _e({
        _tag: "IConcat",
        left: Bi(e.left, t),
        right: e.right
      });
    default:
      return _e({
        _tag: "ISlice",
        chunk: e,
        offset: t,
        length: e.length - t
      });
  }
}), at = /* @__PURE__ */ f(2, (e, t) => {
  if (e.backing._tag === "IEmpty")
    return t;
  if (t.backing._tag === "IEmpty")
    return e;
  const n = t.depth - e.depth;
  if (Math.abs(n) <= 1)
    return _e({
      _tag: "IConcat",
      left: e,
      right: t
    });
  if (n < -1)
    if (e.left.depth >= e.right.depth) {
      const r = at(e.right, t);
      return _e({
        _tag: "IConcat",
        left: e.left,
        right: r
      });
    } else {
      const r = at(e.right.right, t);
      if (r.depth === e.depth - 3) {
        const s = _e({
          _tag: "IConcat",
          left: e.right.left,
          right: r
        });
        return _e({
          _tag: "IConcat",
          left: e.left,
          right: s
        });
      } else {
        const s = _e({
          _tag: "IConcat",
          left: e.left,
          right: e.right.left
        });
        return _e({
          _tag: "IConcat",
          left: s,
          right: r
        });
      }
    }
  else if (t.right.depth >= t.left.depth) {
    const r = at(e, t.left);
    return _e({
      _tag: "IConcat",
      left: r,
      right: t.right
    });
  } else {
    const r = at(e, t.left.left);
    if (r.depth === t.depth - 3) {
      const s = _e({
        _tag: "IConcat",
        left: r,
        right: t.left.right
      });
      return _e({
        _tag: "IConcat",
        left: s,
        right: t.right
      });
    } else {
      const s = _e({
        _tag: "IConcat",
        left: t.left.right,
        right: t.right
      });
      return _e({
        _tag: "IConcat",
        left: r,
        right: s
      });
    }
  }
}), yN = /* @__PURE__ */ f(2, (e, t) => Ar(US(e, t))), bw = (e) => e.length === 0, Dt = (e) => e.length > 0, Mm = /* @__PURE__ */ yw(0), Fm = (e) => yn(e, 0), kt = Fm, _N = /* @__PURE__ */ f(2, (e, t) => e.backing._tag === "ISingleton" ? Pe(t(e.backing.a, 0)) : Ar(m(Ht(e), gn((n, r) => t(n, r))))), xt = (e) => Bi(e, 1), SN = Qa, Ji = /* @__PURE__ */ Symbol.for("effect/Duration"), Nm = /* @__PURE__ */ BigInt(0), Kl = /* @__PURE__ */ BigInt(24), co = /* @__PURE__ */ BigInt(60), Vi = /* @__PURE__ */ BigInt(1e3), Ul = /* @__PURE__ */ BigInt(1e6), Dl = /* @__PURE__ */ BigInt(1e9), ww = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/, Tt = (e) => {
  if (Am(e))
    return e;
  if (Ut(e))
    return qo(e);
  if (bc(e))
    return _i(e);
  if (Array.isArray(e) && e.length === 2 && e.every(Ut))
    return e[0] === -1 / 0 || e[1] === -1 / 0 || Number.isNaN(e[0]) || Number.isNaN(e[1]) ? Cm : e[0] === 1 / 0 || e[1] === 1 / 0 ? Tw : _i(BigInt(Math.round(e[0] * 1e9)) + BigInt(Math.round(e[1])));
  if (Ue(e)) {
    const t = ww.exec(e);
    if (t) {
      const [n, r, s] = t, o = Number(r);
      switch (s) {
        case "nano":
        case "nanos":
          return _i(BigInt(r));
        case "micro":
        case "micros":
          return vw(BigInt(r));
        case "milli":
        case "millis":
          return qo(o);
        case "second":
        case "seconds":
          return Ew(o);
        case "minute":
        case "minutes":
          return Iw(o);
        case "hour":
        case "hours":
          return Rw(o);
        case "day":
        case "days":
          return Mw(o);
        case "week":
        case "weeks":
          return Fw(o);
      }
    }
  }
  throw new Error("Invalid DurationInput");
}, ql = {
  _tag: "Millis",
  millis: 0
}, kw = {
  _tag: "Infinity"
}, Ow = {
  [Ji]: Ji,
  [j]() {
    return ie(this, fd(this.value));
  },
  [C](e) {
    return Am(e) && Lw(this, e);
  },
  toString() {
    return `Duration(${Kw(this)})`;
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          hrtime: Aw(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [re]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, Rt = (e) => {
  const t = Object.create(Ow);
  return Ut(e) ? isNaN(e) || e <= 0 ? t.value = ql : Number.isFinite(e) ? Number.isInteger(e) ? t.value = {
    _tag: "Millis",
    millis: e
  } : t.value = {
    _tag: "Nanos",
    nanos: BigInt(Math.round(e * 1e6))
  } : t.value = kw : e <= Nm ? t.value = ql : t.value = {
    _tag: "Nanos",
    nanos: e
  }, t;
}, Am = (e) => M(e, Ji), $w = (e) => {
  switch (e.value._tag) {
    case "Millis":
      return e.value.millis === 0;
    case "Nanos":
      return e.value.nanos === Nm;
    case "Infinity":
      return !1;
  }
}, Cm = /* @__PURE__ */ Rt(0), Tw = /* @__PURE__ */ Rt(1 / 0), _i = (e) => Rt(e), vw = (e) => Rt(e * Vi), qo = (e) => Rt(e), Ew = (e) => Rt(e * 1e3), Iw = (e) => Rt(e * 6e4), Rw = (e) => Rt(e * 36e5), Mw = (e) => Rt(e * 864e5), Fw = (e) => Rt(e * 6048e5), zi = (e) => Cw(e, {
  onMillis: (t) => t,
  onNanos: (t) => Number(t) / 1e6
}), Nw = (e) => {
  const t = Tt(e);
  switch (t.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return t.value.nanos;
    case "Millis":
      return BigInt(Math.round(t.value.millis * 1e6));
  }
}, Aw = (e) => {
  const t = Tt(e);
  switch (t.value._tag) {
    case "Infinity":
      return [1 / 0, 0];
    case "Nanos":
      return [Number(t.value.nanos / Dl), Number(t.value.nanos % Dl)];
    case "Millis":
      return [Math.floor(t.value.millis / 1e3), Math.round(t.value.millis % 1e3 * 1e6)];
  }
}, Cw = /* @__PURE__ */ f(2, (e, t) => {
  const n = Tt(e);
  switch (n.value._tag) {
    case "Nanos":
      return t.onNanos(n.value.nanos);
    case "Infinity":
      return t.onMillis(1 / 0);
    case "Millis":
      return t.onMillis(n.value.millis);
  }
}), Pm = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = Tt(e), s = Tt(t);
  if (r.value._tag === "Infinity" || s.value._tag === "Infinity")
    return n.onMillis(zi(r), zi(s));
  if (r.value._tag === "Nanos" || s.value._tag === "Nanos") {
    const o = r.value._tag === "Nanos" ? r.value.nanos : BigInt(Math.round(r.value.millis * 1e6)), c = s.value._tag === "Nanos" ? s.value.nanos : BigInt(Math.round(s.value.millis * 1e6));
    return n.onNanos(o, c);
  }
  return n.onMillis(r.value.millis, s.value.millis);
}), Pw = (e, t) => Pm(e, t, {
  onMillis: (n, r) => n === r,
  onNanos: (n, r) => n === r
}), xw = /* @__PURE__ */ f(2, (e, t) => Pm(e, t, {
  onMillis: (n, r) => n >= r,
  onNanos: (n, r) => n >= r
})), Lw = /* @__PURE__ */ f(2, (e, t) => Pw(Tt(e), Tt(t))), jw = (e) => {
  const t = Tt(e);
  if (t.value._tag === "Infinity")
    return {
      days: 1 / 0,
      hours: 1 / 0,
      minutes: 1 / 0,
      seconds: 1 / 0,
      millis: 1 / 0,
      nanos: 1 / 0
    };
  const n = Nw(t), r = n / Ul, s = r / Vi, o = s / co, c = o / co, a = c / Kl;
  return {
    days: Number(a),
    hours: Number(c % Kl),
    minutes: Number(o % co),
    seconds: Number(s % co),
    millis: Number(r % Vi),
    nanos: Number(n % Ul)
  };
}, Kw = (e) => {
  const t = Tt(e);
  if (t.value._tag === "Infinity")
    return "Infinity";
  if ($w(t))
    return "0";
  const n = jw(t), r = [];
  return n.days !== 0 && r.push(`${n.days}d`), n.hours !== 0 && r.push(`${n.hours}h`), n.minutes !== 0 && r.push(`${n.minutes}m`), n.seconds !== 0 && r.push(`${n.seconds}s`), n.millis !== 0 && r.push(`${n.millis}ms`), n.nanos !== 0 && r.push(`${n.nanos}ns`), r.join(" ");
}, Tn = 5, iu = /* @__PURE__ */ Math.pow(2, Tn), Uw = iu - 1, Dw = iu / 2, qw = iu / 4;
function Bw(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function dr(e, t) {
  return t >>> e & Uw;
}
function Gn(e) {
  return 1 << e;
}
function xm(e, t) {
  return Bw(e & t - 1);
}
const Jw = (e, t) => ({
  value: e,
  previous: t
});
function er(e, t, n, r) {
  let s = r;
  if (!e) {
    const o = r.length;
    s = new Array(o);
    for (let c = 0; c < o; ++c) s[c] = r[c];
  }
  return s[t] = n, s;
}
function Lm(e, t, n) {
  const r = n.length - 1;
  let s = 0, o = 0, c = n;
  if (e)
    s = o = t;
  else
    for (c = new Array(r); s < t; ) c[o++] = n[s++];
  for (++s; s <= r; ) c[o++] = n[s++];
  return e && (c.length = r), c;
}
function Vw(e, t, n, r) {
  const s = r.length;
  if (e) {
    let u = s;
    for (; u >= t; ) r[u--] = r[u];
    return r[t] = n, r;
  }
  let o = 0, c = 0;
  const a = new Array(s + 1);
  for (; o < t; ) a[c++] = r[o++];
  for (a[t] = n; o < s; ) a[++c] = r[o++];
  return a;
}
class Qt {
  constructor() {
    i(this, "_tag", "EmptyNode");
  }
  modify(t, n, r, s, o, c) {
    const a = r(b());
    return de(a) ? new Qt() : (++c.value, new _n(t, s, o, a));
  }
}
function ut(e) {
  return Ka(e, "EmptyNode");
}
function zw(e) {
  return ut(e) || e._tag === "LeafNode" || e._tag === "CollisionNode";
}
function Nc(e, t) {
  return ut(e) ? !1 : t === e.edit;
}
class _n {
  constructor(t, n, r, s) {
    i(this, "edit");
    i(this, "hash");
    i(this, "key");
    i(this, "value");
    i(this, "_tag", "LeafNode");
    this.edit = t, this.hash = n, this.key = r, this.value = s;
  }
  modify(t, n, r, s, o, c) {
    if (R(o, this.key)) {
      const u = r(this.value);
      return u === this.value ? this : de(u) ? (--c.value, new Qt()) : Nc(this, t) ? (this.value = u, this) : new _n(t, s, o, u);
    }
    const a = r(b());
    return de(a) ? this : (++c.value, jm(t, n, this.hash, this, s, new _n(t, s, o, a)));
  }
}
class au {
  constructor(t, n, r) {
    i(this, "edit");
    i(this, "hash");
    i(this, "children");
    i(this, "_tag", "CollisionNode");
    this.edit = t, this.hash = n, this.children = r;
  }
  modify(t, n, r, s, o, c) {
    if (s === this.hash) {
      const u = Nc(this, t), l = this.updateCollisionList(u, t, this.hash, this.children, r, o, c);
      return l === this.children ? this : l.length > 1 ? new au(t, this.hash, l) : l[0];
    }
    const a = r(b());
    return de(a) ? this : (++c.value, jm(t, n, this.hash, this, s, new _n(t, s, o, a)));
  }
  updateCollisionList(t, n, r, s, o, c, a) {
    const u = s.length;
    for (let h = 0; h < u; ++h) {
      const d = s[h];
      if ("key" in d && R(c, d.key)) {
        const p = d.value, g = o(p);
        return g === p ? s : de(g) ? (--a.value, Lm(t, h, s)) : er(t, h, new _n(n, r, c, g), s);
      }
    }
    const l = o(b());
    return de(l) ? s : (++a.value, er(t, u, new _n(n, r, c, l), s));
  }
}
class mr {
  constructor(t, n, r) {
    i(this, "edit");
    i(this, "mask");
    i(this, "children");
    i(this, "_tag", "IndexedNode");
    this.edit = t, this.mask = n, this.children = r;
  }
  modify(t, n, r, s, o, c) {
    const a = this.mask, u = this.children, l = dr(n, s), h = Gn(l), d = xm(a, h), p = a & h, g = Nc(this, t);
    if (!p) {
      const q = new Qt().modify(t, n + Tn, r, s, o, c);
      return q ? u.length >= Dw ? Gw(t, l, q, a, u) : new mr(t, a | h, Vw(g, d, q, u)) : this;
    }
    const y = u[d], I = y.modify(t, n + Tn, r, s, o, c);
    if (y === I) return this;
    let w = a, k;
    if (ut(I)) {
      if (w &= ~h, !w) return new Qt();
      if (u.length <= 2 && zw(u[d ^ 1]))
        return u[d ^ 1];
      k = Lm(g, d, u);
    } else
      k = er(g, d, I, u);
    return g ? (this.mask = w, this.children = k, this) : new mr(t, w, k);
  }
}
class uu {
  constructor(t, n, r) {
    i(this, "edit");
    i(this, "size");
    i(this, "children");
    i(this, "_tag", "ArrayNode");
    this.edit = t, this.size = n, this.children = r;
  }
  modify(t, n, r, s, o, c) {
    let a = this.size;
    const u = this.children, l = dr(n, s), h = u[l], d = (h || new Qt()).modify(t, n + Tn, r, s, o, c);
    if (h === d) return this;
    const p = Nc(this, t);
    let g;
    if (ut(h) && !ut(d))
      ++a, g = er(p, l, d, u);
    else if (!ut(h) && ut(d)) {
      if (--a, a <= qw)
        return Ww(t, a, l, u);
      g = er(p, l, new Qt(), u);
    } else
      g = er(p, l, d, u);
    return p ? (this.size = a, this.children = g, this) : new uu(t, a, g);
  }
}
function Ww(e, t, n, r) {
  const s = new Array(t - 1);
  let o = 0, c = 0;
  for (let a = 0, u = r.length; a < u; ++a)
    if (a !== n) {
      const l = r[a];
      l && !ut(l) && (s[o++] = l, c |= 1 << a);
    }
  return new mr(e, c, s);
}
function Gw(e, t, n, r, s) {
  const o = [];
  let c = r, a = 0;
  for (let u = 0; c; ++u)
    c & 1 && (o[u] = s[a++]), c >>>= 1;
  return o[t] = n, new uu(e, a + 1, o);
}
function Hw(e, t, n, r, s, o) {
  if (n === s) return new au(e, n, [o, r]);
  const c = dr(t, n), a = dr(t, s);
  if (c === a)
    return (u) => new mr(e, Gn(c) | Gn(a), [u]);
  {
    const u = c < a ? [r, o] : [o, r];
    return new mr(e, Gn(c) | Gn(a), u);
  }
}
function jm(e, t, n, r, s, o) {
  let c, a = t;
  for (; ; ) {
    const u = Hw(e, a, n, r, s, o);
    if (typeof u == "function")
      c = Jw(u, c), a = a + Tn;
    else {
      let l = u;
      for (; c != null; )
        l = c.value(l), c = c.previous;
      return l;
    }
  }
}
const Km = "effect/HashMap", Wi = /* @__PURE__ */ Symbol.for(Km), Yw = {
  [Wi]: Wi,
  [Symbol.iterator]() {
    return new Ac(this, (e, t) => [e, t]);
  },
  [j]() {
    let e = $(Km);
    for (const t of this)
      e ^= m($(t[0]), J($(t[1])));
    return ie(this, e);
  },
  [C](e) {
    if (Xw(e)) {
      if (e._size !== this._size)
        return !1;
      for (const t of this) {
        const n = m(e, fu(t[0], $(t[0])));
        if (de(n))
          return !1;
        if (!R(t[1], n.value))
          return !1;
      }
      return !0;
    }
    return !1;
  },
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(he)
    };
  },
  [re]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, lu = (e, t, n, r) => {
  const s = Object.create(Yw);
  return s._editable = e, s._edit = t, s._root = n, s._size = r, s;
};
class Ac {
  constructor(t, n) {
    i(this, "map");
    i(this, "f");
    i(this, "v");
    this.map = t, this.f = n, this.v = Um(this.map._root, this.f, void 0);
  }
  next() {
    if (de(this.v))
      return {
        done: !0,
        value: void 0
      };
    const t = this.v.value;
    return this.v = Bo(t.cont), {
      done: !1,
      value: t.value
    };
  }
  [Symbol.iterator]() {
    return new Ac(this.map, this.f);
  }
}
const Bo = (e) => e ? Dm(e[0], e[1], e[2], e[3], e[4]) : b(), Um = (e, t, n = void 0) => {
  switch (e._tag) {
    case "LeafNode":
      return ne(e.value) ? O({
        value: t(e.key, e.value.value),
        cont: n
      }) : Bo(n);
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const r = e.children;
      return Dm(r.length, r, 0, t, n);
    }
    default:
      return Bo(n);
  }
}, Dm = (e, t, n, r, s) => {
  for (; n < e; ) {
    const o = t[n++];
    if (o && !ut(o))
      return Um(o, r, [e, t, n, r, s]);
  }
  return Bo(s);
}, Qw = /* @__PURE__ */ lu(!1, 0, /* @__PURE__ */ new Qt(), 0), Cc = () => Qw, Zw = (e) => {
  const t = Bm(Cc());
  for (const n of e)
    bs(t, n[0], n[1]);
  return sk(t);
}, Xw = (e) => M(e, Wi), ek = (e) => e && ut(e._root), tk = /* @__PURE__ */ f(2, (e, t) => fu(e, t, $(t))), fu = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = e._root, s = 0;
  for (; ; )
    switch (r._tag) {
      case "LeafNode":
        return R(t, r.key) ? r.value : b();
      case "CollisionNode": {
        if (n === r.hash) {
          const o = r.children;
          for (let c = 0, a = o.length; c < a; ++c) {
            const u = o[c];
            if ("key" in u && R(t, u.key))
              return u.value;
          }
        }
        return b();
      }
      case "IndexedNode": {
        const o = dr(s, n), c = Gn(o);
        if (r.mask & c) {
          r = r.children[xm(r.mask, c)], s += Tn;
          break;
        }
        return b();
      }
      case "ArrayNode": {
        if (r = r.children[dr(s, n)], r) {
          s += Tn;
          break;
        }
        return b();
      }
      default:
        return b();
    }
}), nk = /* @__PURE__ */ f(2, (e, t) => ne(fu(e, t, $(t)))), bs = /* @__PURE__ */ f(3, (e, t, n) => hu(e, t, () => O(n))), rk = /* @__PURE__ */ f(3, (e, t, n) => e._editable ? (e._root = t, e._size = n, e) : t === e._root ? e : lu(e._editable, e._edit, t, n)), qm = (e) => new Ac(e, (t) => t), Gi = (e) => e._size, Bm = (e) => lu(!0, e._edit + 1, e._root, e._size), sk = (e) => (e._editable = !1, e), hu = /* @__PURE__ */ f(3, (e, t, n) => ok(e, t, $(t), n)), ok = /* @__PURE__ */ f(4, (e, t, n, r) => {
  const s = {
    value: e._size
  }, o = e._root.modify(e._editable ? e._edit : NaN, 0, r, n, t, s);
  return m(e, rk(o, s.value));
}), Bl = /* @__PURE__ */ f(2, (e, t) => hu(e, t, b)), ck = /* @__PURE__ */ f(2, (e, t) => Pc(e, Cc(), (n, r, s) => bs(n, s, t(r, s)))), ik = /* @__PURE__ */ f(2, (e, t) => Pc(e, void 0, (n, r, s) => t(r, s))), Pc = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = e._root;
  if (r._tag === "LeafNode")
    return ne(r.value) ? n(t, r.value.value, r.key) : t;
  if (r._tag === "EmptyNode")
    return t;
  const s = [r.children];
  let o;
  for (; o = s.pop(); )
    for (let c = 0, a = o.length; c < a; ) {
      const u = o[c++];
      u && !ut(u) && (u._tag === "LeafNode" ? ne(u.value) && (t = n(t, u.value.value, u.key)) : s.push(u.children));
    }
  return t;
}), Jm = "effect/HashSet", Hi = /* @__PURE__ */ Symbol.for(Jm), ak = {
  [Hi]: Hi,
  [Symbol.iterator]() {
    return qm(this._keyMap);
  },
  [j]() {
    return ie(this, J($(this._keyMap))($(Jm)));
  },
  [C](e) {
    return uk(e) ? Gi(this._keyMap) === Gi(e._keyMap) && R(this._keyMap, e._keyMap) : !1;
  },
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(he)
    };
  },
  [re]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, xc = (e) => {
  const t = Object.create(ak);
  return t._keyMap = e, t;
}, uk = (e) => M(e, Hi), lk = /* @__PURE__ */ xc(/* @__PURE__ */ Cc()), Lc = () => lk, fk = (e) => {
  const t = du(Lc());
  for (const n of e)
    ws(t, n);
  return mu(t);
}, hk = (...e) => {
  const t = du(Lc());
  for (const n of e)
    ws(t, n);
  return mu(t);
}, dk = /* @__PURE__ */ f(2, (e, t) => nk(e._keyMap, t)), mk = (e) => Gi(e._keyMap), du = (e) => xc(Bm(e._keyMap)), mu = (e) => (e._keyMap._editable = !1, e), Vm = /* @__PURE__ */ f(2, (e, t) => {
  const n = du(e);
  return t(n), mu(n);
}), ws = /* @__PURE__ */ f(2, (e, t) => e._keyMap._editable ? (bs(t, !0)(e._keyMap), e) : xc(bs(t, !0)(e._keyMap))), zm = /* @__PURE__ */ f(2, (e, t) => e._keyMap._editable ? (Bl(t)(e._keyMap), e) : xc(Bl(t)(e._keyMap))), gk = /* @__PURE__ */ f(2, (e, t) => Vm(e, (n) => {
  for (const r of t)
    zm(n, r);
})), pk = /* @__PURE__ */ f(2, (e, t) => Vm(Lc(), (n) => {
  yk(e, (r) => ws(n, r));
  for (const r of t)
    ws(n, r);
})), yk = /* @__PURE__ */ f(2, (e, t) => ik(e._keyMap, (n, r) => t(r))), _k = /* @__PURE__ */ f(3, (e, t, n) => Pc(e._keyMap, t, (r, s, o) => n(r, o))), vn = Lc, Sk = fk, gu = hk, bk = dk, Wm = mk, ds = ws, Gm = zm, Jl = gk, ks = pk, Os = _k, Vl = /* @__PURE__ */ Symbol.for("effect/MutableRef"), wk = {
  [Vl]: Vl,
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: he(this.current)
    };
  },
  [re]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, jc = (e) => {
  const t = Object.create(wk);
  return t.current = e, t;
}, kk = /* @__PURE__ */ f(3, (e, t, n) => R(t, e.current) ? (e.current = n, !0) : !1), Zt = (e) => e.current, Kc = /* @__PURE__ */ f(2, (e, t) => (e.current = t, e)), Uc = "effect/FiberId", En = /* @__PURE__ */ Symbol.for(Uc), gr = "None", Yi = "Runtime", Qi = "Composite", Ok = /* @__PURE__ */ fe(`${Uc}-${gr}`);
var oh;
let $k = class {
  constructor() {
    i(this, oh, En);
    i(this, "_tag", gr);
    i(this, "id", -1);
    i(this, "startTimeMillis", -1);
  }
  [(oh = En, j)]() {
    return Ok;
  }
  [C](t) {
    return pu(t) && t._tag === gr;
  }
  toString() {
    return we(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [re]() {
    return this.toJSON();
  }
};
var ch;
class Tk {
  constructor(t, n) {
    i(this, "id");
    i(this, "startTimeMillis");
    i(this, ch, En);
    i(this, "_tag", Yi);
    this.id = t, this.startTimeMillis = n;
  }
  [(ch = En, j)]() {
    return ie(this, fe(`${Uc}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [C](t) {
    return pu(t) && t._tag === Yi && this.id === t.id && this.startTimeMillis === t.startTimeMillis;
  }
  toString() {
    return we(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [re]() {
    return this.toJSON();
  }
}
var ih;
let vk = class {
  constructor(t, n) {
    i(this, "left");
    i(this, "right");
    i(this, ih, En);
    i(this, "_tag", Qi);
    i(this, "_hash");
    this.left = t, this.right = n;
  }
  [(ih = En, j)]() {
    return m(fe(`${Uc}-${this._tag}`), J($(this.left)), J($(this.right)), ie(this));
  }
  [C](t) {
    return pu(t) && t._tag === Qi && R(this.left, t.left) && R(this.right, t.right);
  }
  toString() {
    return we(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      left: he(this.left),
      right: he(this.right)
    };
  }
  [re]() {
    return this.toJSON();
  }
};
const Hm = /* @__PURE__ */ new $k(), pu = (e) => M(e, En), Ym = /* @__PURE__ */ f(2, (e, t) => e._tag === gr ? t : t._tag === gr ? e : new vk(e, t)), Ek = (e) => m(e, Os(Hm, (t, n) => Ym(n)(t))), Zi = (e) => {
  switch (e._tag) {
    case gr:
      return vn();
    case Yi:
      return gu(e.id);
    case Qi:
      return m(Zi(e.left), ks(Zi(e.right)));
  }
}, zl = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => jc(0)), Qm = (e) => Array.from(Zi(e)).map((n) => `#${n}`).join(","), Ik = () => {
  const e = Zt(zl);
  return m(zl, Kc(e + 1)), new Tk(e, Date.now());
}, pr = Hm, Rk = Ym, kN = Ek, Mk = Qm, Zm = Ik, yu = Cc, Fk = Zw, Nk = ek, Xm = tk, eg = bs, tg = qm, Ak = hu, Ck = ck, ng = Pc, $s = /* @__PURE__ */ Symbol.for("effect/List"), Xi = (e) => oe(e), Pk = (e) => f_(Za(e), Xi), xk = /* @__PURE__ */ Pk(R), Lk = {
  [$s]: $s,
  _tag: "Cons",
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: Xi(this).map(he)
    };
  },
  [re]() {
    return this.toJSON();
  },
  [C](e) {
    return sg(e) && this._tag === e._tag && xk(this, e);
  },
  [j]() {
    return ie(this, Ls(Xi(this)));
  },
  [Symbol.iterator]() {
    let e = !1, t = this;
    return {
      next() {
        if (e)
          return this.return();
        if (t._tag === "Nil")
          return e = !0, this.return();
        const n = t.head;
        return t = t.tail, {
          done: e,
          value: n
        };
      },
      return(n) {
        return e || (e = !0), {
          done: !0,
          value: n
        };
      }
    };
  },
  pipe() {
    return v(this, arguments);
  }
}, Jo = (e, t) => {
  const n = Object.create(Lk);
  return n.head = e, n.tail = t, n;
}, jk = /* @__PURE__ */ fe("Nil"), Kk = {
  [$s]: $s,
  _tag: "Nil",
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [re]() {
    return this.toJSON();
  },
  [j]() {
    return jk;
  },
  [C](e) {
    return sg(e) && this._tag === e._tag;
  },
  [Symbol.iterator]() {
    return {
      next() {
        return {
          done: !0,
          value: void 0
        };
      }
    };
  },
  pipe() {
    return v(this, arguments);
  }
}, rg = /* @__PURE__ */ Object.create(Kk), sg = (e) => M(e, $s), Kt = (e) => e._tag === "Nil", Uk = (e) => e._tag === "Cons", Dk = () => rg, In = (e, t) => Jo(e, t), yr = Dk, _u = (e) => Jo(e, rg), qk = /* @__PURE__ */ f(2, (e, t) => Jk(t, e)), Bk = /* @__PURE__ */ f(2, (e, t) => In(t, e)), Jk = /* @__PURE__ */ f(2, (e, t) => {
  if (Kt(e))
    return t;
  if (Kt(t))
    return e;
  {
    const n = Jo(t.head, e);
    let r = n, s = t.tail;
    for (; !Kt(s); ) {
      const o = Jo(s.head, e);
      r.tail = o, r = o, s = s.tail;
    }
    return n;
  }
}), Vk = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = t, s = e;
  for (; !Kt(s); )
    r = n(r, s.head), s = s.tail;
  return r;
}), zk = (e) => {
  let t = yr(), n = e;
  for (; !Kt(n); )
    t = Bk(t, n.head), n = n.tail;
  return t;
}, Su = /* @__PURE__ */ function() {
  function e(t) {
    t && Object.assign(this, t);
  }
  return e.prototype = Ks, e;
}(), Wk = (e) => Object.assign(Object.create(Ks), e), Gk = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function Wl(e) {
  return e;
}
const Js = {
  ...Su.prototype,
  [Gk]: {
    _Value: Wl,
    _Patch: Wl
  }
}, Hk = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Js), {
  _tag: "Empty"
}), Yk = /* @__PURE__ */ Object.create(Hk), og = () => Yk, Qk = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Js), {
  _tag: "AndThen"
}), Zk = (e, t) => {
  const n = Object.create(Qk);
  return n.first = e, n.second = t, n;
}, Xk = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Js), {
  _tag: "AddService"
}), e0 = (e, t) => {
  const n = Object.create(Xk);
  return n.key = e, n.service = t, n;
}, t0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Js), {
  _tag: "RemoveService"
}), n0 = (e) => {
  const t = Object.create(t0);
  return t.key = e, t;
}, r0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Js), {
  _tag: "UpdateService"
}), s0 = (e, t) => {
  const n = Object.create(r0);
  return n.key = e, n.update = t, n;
}, o0 = (e, t) => {
  const n = new Map(e.unsafeMap);
  let r = og();
  for (const [s, o] of t.unsafeMap.entries())
    if (n.has(s)) {
      const c = n.get(s);
      n.delete(s), R(c, o) || (r = ko(s0(s, () => o))(r));
    } else
      n.delete(s), r = ko(e0(s, o))(r);
  for (const [s] of n.entries())
    r = ko(n0(s))(r);
  return r;
}, ko = /* @__PURE__ */ f(2, (e, t) => Zk(e, t)), c0 = /* @__PURE__ */ f(2, (e, t) => {
  if (e._tag === "Empty")
    return t;
  let n = !1, r = Pe(e);
  const s = new Map(t.unsafeMap);
  for (; Dt(r); ) {
    const c = kt(r), a = xt(r);
    switch (c._tag) {
      case "Empty": {
        r = a;
        break;
      }
      case "AddService": {
        s.set(c.key, c.service), r = a;
        break;
      }
      case "AndThen": {
        r = et(et(a, c.second), c.first);
        break;
      }
      case "RemoveService": {
        s.delete(c.key), r = a;
        break;
      }
      case "UpdateService": {
        s.set(c.key, c.update(s.get(c.key))), n = !0, r = a;
        break;
      }
    }
  }
  if (!n)
    return hr(s);
  const o = /* @__PURE__ */ new Map();
  for (const [c] of t.unsafeMap)
    s.has(c) && (o.set(c, s.get(c)), s.delete(c));
  for (const [c, a] of s)
    o.set(c, a);
  return hr(o);
}), i0 = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function Si(e) {
  return e;
}
const Dc = {
  ...Su.prototype,
  [i0]: {
    _Value: Si,
    _Key: Si,
    _Patch: Si
  }
}, a0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Dc), {
  _tag: "Empty"
}), u0 = /* @__PURE__ */ Object.create(a0), cg = () => u0, l0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Dc), {
  _tag: "AndThen"
}), f0 = (e, t) => {
  const n = Object.create(l0);
  return n.first = e, n.second = t, n;
}, h0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Dc), {
  _tag: "Add"
}), d0 = (e) => {
  const t = Object.create(h0);
  return t.value = e, t;
}, m0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Dc), {
  _tag: "Remove"
}), g0 = (e) => {
  const t = Object.create(m0);
  return t.value = e, t;
}, p0 = (e, t) => {
  const [n, r] = Os([e, cg()], ([s, o], c) => bk(c)(s) ? [Gm(c)(s), o] : [s, ea(d0(c))(o)])(t);
  return Os(r, (s, o) => ea(g0(o))(s))(n);
}, ea = /* @__PURE__ */ f(2, (e, t) => f0(e, t)), y0 = /* @__PURE__ */ f(2, (e, t) => {
  if (e._tag === "Empty")
    return t;
  let n = t, r = Pe(e);
  for (; Dt(r); ) {
    const s = kt(r), o = xt(r);
    switch (s._tag) {
      case "Empty": {
        r = o;
        break;
      }
      case "AndThen": {
        r = et(s.first)(et(s.second)(o));
        break;
      }
      case "Add": {
        n = ds(s.value)(n), r = o;
        break;
      }
      case "Remove":
        n = Gm(s.value)(n), r = o;
    }
  }
  return n;
}), _0 = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function Gl(e) {
  return e;
}
const Vs = {
  ...Su.prototype,
  [_0]: {
    _Value: Gl,
    _Patch: Gl
  }
}, S0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Vs), {
  _tag: "Empty"
}), b0 = /* @__PURE__ */ Object.create(S0), ig = () => b0, w0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Vs), {
  _tag: "AndThen"
}), k0 = (e, t) => {
  const n = Object.create(w0);
  return n.first = e, n.second = t, n;
}, O0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Vs), {
  _tag: "Append"
}), $0 = (e) => {
  const t = Object.create(O0);
  return t.values = e, t;
}, T0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Vs), {
  _tag: "Slice"
}), v0 = (e, t) => {
  const n = Object.create(T0);
  return n.from = e, n.until = t, n;
}, E0 = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Vs), {
  _tag: "Update"
}), I0 = (e, t) => {
  const n = Object.create(E0);
  return n.index = e, n.patch = t, n;
}, R0 = (e) => {
  let t = 0, n = ig();
  for (; t < e.oldValue.length && t < e.newValue.length; ) {
    const r = e.oldValue[t], s = e.newValue[t], o = e.differ.diff(r, s);
    R(o, e.differ.empty) || (n = Oo(n, I0(t, o))), t = t + 1;
  }
  return t < e.oldValue.length && (n = Oo(n, v0(0, t))), t < e.newValue.length && (n = Oo(n, $0(MS(t)(e.newValue)))), n;
}, Oo = /* @__PURE__ */ f(2, (e, t) => k0(e, t)), M0 = /* @__PURE__ */ f(3, (e, t, n) => {
  if (e._tag === "Empty")
    return t;
  let r = t.slice(), s = st(e);
  for (; fs(s); ) {
    const o = Ke(s), c = On(s);
    switch (o._tag) {
      case "Empty": {
        s = c;
        break;
      }
      case "AndThen": {
        c.unshift(o.first, o.second), s = c;
        break;
      }
      case "Append": {
        for (const a of o.values)
          r.push(a);
        s = c;
        break;
      }
      case "Slice": {
        r = r.slice(o.from, o.until), s = c;
        break;
      }
      case "Update": {
        r[o.index] = n.patch(o.patch, r[o.index]), s = c;
        break;
      }
    }
  }
  return r;
}), F0 = /* @__PURE__ */ Symbol.for("effect/Differ"), N0 = {
  [F0]: {
    _P: D,
    _V: D
  },
  pipe() {
    return v(this, arguments);
  }
}, Cr = (e) => {
  const t = Object.create(N0);
  return t.empty = e.empty, t.diff = e.diff, t.combine = e.combine, t.patch = e.patch, t;
}, A0 = () => Cr({
  empty: og(),
  combine: (e, t) => ko(t)(e),
  diff: (e, t) => o0(e, t),
  patch: (e, t) => c0(t)(e)
}), C0 = () => Cr({
  empty: cg(),
  combine: (e, t) => ea(t)(e),
  diff: (e, t) => p0(e, t),
  patch: (e, t) => y0(t)(e)
}), P0 = (e) => Cr({
  empty: ig(),
  combine: (t, n) => Oo(t, n),
  diff: (t, n) => R0({
    oldValue: t,
    newValue: n,
    differ: e
  }),
  patch: (t, n) => M0(t, n, e)
}), ag = () => x0((e, t) => t), x0 = (e) => Cr({
  empty: D,
  combine: (t, n) => t === D ? n : n === D ? t : (r) => n(t(r)),
  diff: (t, n) => R(t, n) ? D : yc(n),
  patch: (t, n) => e(n, t(n))
}), Ts = 255, ug = 8, ta = (e) => e & Ts, na = (e) => e >> ug & Ts, zs = (e, t) => (e & Ts) + ((t & e & Ts) << ug), L0 = /* @__PURE__ */ zs(0, 0), j0 = (e) => zs(e, e), K0 = (e) => zs(e, 0), U0 = /* @__PURE__ */ f(2, (e, t) => zs(ta(e) & ~t, na(e))), D0 = /* @__PURE__ */ f(2, (e, t) => e | t), q0 = (e) => ~e >>> 0 & Ts, B0 = 0, Pr = 1, J0 = 2, lg = 4, ra = 16, fg = 32, V0 = (e) => qc(e, fg), z0 = /* @__PURE__ */ f(2, (e, t) => e | t), Wt = (e) => hg(e) && !G0(e), hg = (e) => qc(e, Pr), qc = /* @__PURE__ */ f(2, (e, t) => (e & t) !== 0), dg = (...e) => e.reduce((t, n) => t | n, 0), W0 = /* @__PURE__ */ dg(B0), Hl = (e) => qc(e, lg), G0 = (e) => qc(e, ra), Sn = /* @__PURE__ */ f(2, (e, t) => zs(e ^ t, t)), tr = /* @__PURE__ */ f(2, (e, t) => e & (q0(ta(t)) | na(t)) | ta(t) & na(t)), Yl = /* @__PURE__ */ Cr({
  empty: L0,
  diff: (e, t) => Sn(e, t),
  combine: (e, t) => D0(t)(e),
  patch: (e, t) => tr(t, e)
}), H0 = j0, mg = K0, Ql = U0, gg = (e, t) => ({
  _tag: "Par",
  left: e,
  right: t
}), io = (e, t) => ({
  _tag: "Seq",
  left: e,
  right: t
}), Y0 = (e) => {
  let t = _u(e), n = yr();
  for (; ; ) {
    const [r, s] = Vk(t, [pg(), yr()], ([o, c], a) => {
      const [u, l] = Q0(a);
      return [nO(o, u), qk(c, l)];
    });
    if (n = Z0(n, r), Kt(s))
      return zk(n);
    t = s;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Q0 = (e) => {
  let t = e, n = pg(), r = yr(), s = yr();
  for (; ; )
    switch (t._tag) {
      case "Empty": {
        if (Kt(r))
          return [n, s];
        t = r.head, r = r.tail;
        break;
      }
      case "Par": {
        r = In(t.right, r), t = t.left;
        break;
      }
      case "Seq": {
        const o = t.left, c = t.right;
        switch (o._tag) {
          case "Empty": {
            t = c;
            break;
          }
          case "Par": {
            const a = o.left, u = o.right;
            t = gg(io(a, c), io(u, c));
            break;
          }
          case "Seq": {
            const a = o.left, u = o.right;
            t = io(a, io(u, c));
            break;
          }
          case "Single": {
            t = o, s = In(c, s);
            break;
          }
        }
        break;
      }
      case "Single": {
        if (n = tO(n, t), Kt(r))
          return [n, s];
        t = r.head, r = r.tail;
        break;
      }
    }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Z0 = (e, t) => {
  if (Kt(e))
    return _u(bi(t));
  if (rO(t))
    return e;
  const n = uO(e.head), r = sO(t);
  return n.length === 1 && r.length === 1 && R(n[0], r[0]) ? In(aO(e.head, bi(t)), e.tail) : In(bi(t), e);
}, X0 = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel"), eO = {
  /* c8 ignore next */
  _R: (e) => e
};
var ah;
ah = X0;
class bu {
  constructor(t) {
    i(this, "map");
    i(this, ah, eO);
    this.map = t;
  }
}
const pg = () => new bu(yu()), tO = (e, t) => new bu(Ak(e.map, t.dataSource, (n) => iS(ls(n, Sw(t.blockedRequest)), () => Pe(t.blockedRequest)))), nO = (e, t) => new bu(ng(e.map, t.map, (n, r, s) => eg(n, s, be(Xm(n, s), {
  onNone: () => r,
  onSome: (o) => at(r, o)
})))), rO = (e) => Nk(e.map), sO = (e) => Array.from(tg(e.map)), bi = (e) => iO(Ck(e.map, (t) => Pe(t))), oO = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential"), cO = {
  /* c8 ignore next */
  _R: (e) => e
};
var uh;
uh = oO;
class yg {
  constructor(t) {
    i(this, "map");
    i(this, uh, cO);
    this.map = t;
  }
}
const iO = (e) => new yg(e), aO = (e, t) => new yg(ng(t.map, e.map, (n, r, s) => eg(n, s, be(Xm(n, s), {
  onNone: () => $t(),
  onSome: (o) => at(o, r)
})))), uO = (e) => Array.from(tg(e.map)), lO = (e) => Array.from(e.map), xr = "Die", Rn = "Empty", Pn = "Fail", Lr = "Interrupt", _r = "Parallel", Sr = "Sequential", _g = "effect/Cause", Sg = /* @__PURE__ */ Symbol.for(_g), fO = {
  /* c8 ignore next */
  _E: (e) => e
}, jr = {
  [Sg]: fO,
  [j]() {
    return m($(_g), J($($O(this))), ie(this));
  },
  [C](e) {
    return hO(e) && OO(this, e);
  },
  pipe() {
    return v(this, arguments);
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
          defect: he(this.defect)
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
          failure: he(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: he(this.left),
          right: he(this.right)
        };
    }
  },
  toString() {
    return Kr(this);
  },
  [re]() {
    return this.toJSON();
  }
}, br = /* @__PURE__ */ (() => {
  const e = /* @__PURE__ */ Object.create(jr);
  return e._tag = Rn, e;
})(), wr = (e) => {
  const t = Object.create(jr);
  return t._tag = Pn, t.error = e, t;
}, Xe = (e) => {
  const t = Object.create(jr);
  return t._tag = xr, t.defect = e, t;
}, ot = (e) => {
  const t = Object.create(jr);
  return t._tag = Lr, t.fiberId = e, t;
}, Mn = (e, t) => {
  const n = Object.create(jr);
  return n._tag = _r, n.left = e, n.right = t, n;
}, Fe = (e, t) => {
  const n = Object.create(jr);
  return n._tag = Sr, n.left = e, n.right = t, n;
}, hO = (e) => M(e, Sg), dO = (e) => e._tag === Rn, mO = (e) => e._tag === Pn, bg = (e) => e._tag === xr, gO = (e) => e._tag === Rn ? !0 : kr(e, !0, (t, n) => {
  switch (n._tag) {
    case Rn:
      return O(t);
    case xr:
    case Pn:
    case Lr:
      return O(!1);
    default:
      return b();
  }
}), wg = (e) => ne(SO(e)), wu = (e) => $u(void 0, vO)(e), pO = (e) => $n(kr(e, $t(), (t, n) => n._tag === Pn ? O(m(t, et(n.error))) : b())), yO = (e) => $n(kr(e, $t(), (t, n) => n._tag === xr ? O(m(t, et(n.defect))) : b())), kg = (e) => kr(e, vn(), (t, n) => n._tag === Lr ? O(m(t, ds(n.fiberId))) : b()), _O = (e) => ku(e, (t) => t._tag === Pn ? O(t.error) : b()), Og = (e) => {
  const t = _O(e);
  switch (t._tag) {
    case "None":
      return L(e);
    case "Some":
      return N(t.value);
  }
}, SO = (e) => ku(e, (t) => t._tag === Lr ? O(t.fiberId) : b()), Zl = (e) => Ou(e, {
  onEmpty: br,
  onFail: () => br,
  onDie: Xe,
  onInterrupt: ot,
  onSequential: Fe,
  onParallel: Mn
}), bO = (e) => Ou(e, {
  onEmpty: br,
  onFail: Xe,
  onDie: Xe,
  onInterrupt: ot,
  onSequential: Fe,
  onParallel: Mn
}), wO = /* @__PURE__ */ f(2, (e, t) => kO(e, (n) => wr(t(n)))), kO = /* @__PURE__ */ f(2, (e, t) => Ou(e, {
  onEmpty: br,
  onFail: (n) => t(n),
  onDie: (n) => Xe(n),
  onInterrupt: (n) => ot(n),
  onSequential: (n, r) => Fe(n, r),
  onParallel: (n, r) => Mn(n, r)
})), OO = (e, t) => {
  let n = Pe(e), r = Pe(t);
  for (; Dt(n) && Dt(r); ) {
    const [s, o] = m(kt(n), kr([vn(), $t()], ([u, l], h) => {
      const [d, p] = sa(h);
      return O([m(u, ks(d)), m(l, at(p))]);
    })), [c, a] = m(kt(r), kr([vn(), $t()], ([u, l], h) => {
      const [d, p] = sa(h);
      return O([m(u, ks(d)), m(l, at(p))]);
    }));
    if (!R(s, c))
      return !1;
    n = o, r = a;
  }
  return !0;
}, $O = (e) => TO(Pe(e), $t()), TO = (e, t) => {
  for (; ; ) {
    const [n, r] = m(e, Qa([vn(), $t()], ([o, c], a) => {
      const [u, l] = sa(a);
      return [m(o, ks(u)), m(c, at(l))];
    })), s = Wm(n) > 0 ? m(t, et(n)) : t;
    if (bw(r))
      return $n(s);
    e = r, t = s;
  }
  throw new Error(wc("Cause.flattenCauseLoop"));
}, ku = /* @__PURE__ */ f(2, (e, t) => {
  const n = [e];
  for (; n.length > 0; ) {
    const r = n.pop(), s = t(r);
    switch (s._tag) {
      case "None": {
        switch (r._tag) {
          case Sr:
          case _r: {
            n.push(r.right), n.push(r.left);
            break;
          }
        }
        break;
      }
      case "Some":
        return s;
    }
  }
  return b();
}), sa = (e) => {
  let t = e;
  const n = [];
  let r = vn(), s = $t();
  for (; t !== void 0; )
    switch (t._tag) {
      case Rn: {
        if (n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case Pn: {
        if (r = ds(r, yi(t._tag, t.error)), n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case xr: {
        if (r = ds(r, yi(t._tag, t.defect)), n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case Lr: {
        if (r = ds(r, yi(t._tag, t.fiberId)), n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case Sr: {
        switch (t.left._tag) {
          case Rn: {
            t = t.right;
            break;
          }
          case Sr: {
            t = Fe(t.left.left, Fe(t.left.right, t.right));
            break;
          }
          case _r: {
            t = Mn(Fe(t.left.left, t.right), Fe(t.left.right, t.right));
            break;
          }
          default: {
            s = et(s, t.right), t = t.left;
            break;
          }
        }
        break;
      }
      case _r: {
        n.push(t.right), t = t.left;
        break;
      }
    }
  throw new Error(wc("Cause.evaluateCauseLoop"));
}, vO = {
  emptyCase: Tl,
  failCase: Ai,
  dieCase: Ai,
  interruptCase: Tl,
  sequentialCase: (e, t, n) => t && n,
  parallelCase: (e, t, n) => t && n
}, Xl = "SequentialCase", ef = "ParallelCase", Ou = /* @__PURE__ */ f(2, (e, {
  onDie: t,
  onEmpty: n,
  onFail: r,
  onInterrupt: s,
  onParallel: o,
  onSequential: c
}) => $u(e, void 0, {
  emptyCase: () => n,
  failCase: (a, u) => r(u),
  dieCase: (a, u) => t(u),
  interruptCase: (a, u) => s(u),
  sequentialCase: (a, u, l) => c(u, l),
  parallelCase: (a, u, l) => o(u, l)
})), kr = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = t, s = e;
  const o = [];
  for (; s !== void 0; ) {
    const c = n(r, s);
    switch (r = ne(c) ? c.value : r, s._tag) {
      case Sr: {
        o.push(s.right), s = s.left;
        break;
      }
      case _r: {
        o.push(s.right), s = s.left;
        break;
      }
      default: {
        s = void 0;
        break;
      }
    }
    s === void 0 && o.length > 0 && (s = o.pop());
  }
  return r;
}), $u = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = [e], s = [];
  for (; r.length > 0; ) {
    const c = r.pop();
    switch (c._tag) {
      case Rn: {
        s.push(L(n.emptyCase(t)));
        break;
      }
      case Pn: {
        s.push(L(n.failCase(t, c.error)));
        break;
      }
      case xr: {
        s.push(L(n.dieCase(t, c.defect)));
        break;
      }
      case Lr: {
        s.push(L(n.interruptCase(t, c.fiberId)));
        break;
      }
      case Sr: {
        r.push(c.right), r.push(c.left), s.push(N({
          _tag: Xl
        }));
        break;
      }
      case _r: {
        r.push(c.right), r.push(c.left), s.push(N({
          _tag: ef
        }));
        break;
      }
    }
  }
  const o = [];
  for (; s.length > 0; ) {
    const c = s.pop();
    switch (c._tag) {
      case "Left": {
        switch (c.left._tag) {
          case Xl: {
            const a = o.pop(), u = o.pop(), l = n.sequentialCase(t, a, u);
            o.push(l);
            break;
          }
          case ef: {
            const a = o.pop(), u = o.pop(), l = n.parallelCase(t, a, u);
            o.push(l);
            break;
          }
        }
        break;
      }
      case "Right": {
        o.push(c.right);
        break;
      }
    }
  }
  if (o.length === 0)
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  return o.pop();
}), Kr = (e, t) => wu(e) ? "All fibers interrupted without errors." : Tg(e).map(function(n) {
  return (t == null ? void 0 : t.renderErrorCause) !== !0 || n.cause === void 0 ? n.stack : `${n.stack} {
${$g(n.cause, "  ")}
}`;
}).join(`
`), $g = (e, t) => {
  const n = e.stack.split(`
`);
  let r = `${t}[cause]: ${n[0]}`;
  for (let s = 1, o = n.length; s < o; s++)
    r += `
${t}${n[s]}`;
  return e.cause && (r += ` {
${$g(e.cause, `${t}  `)}
${t}}`), r;
};
class Vo extends globalThis.Error {
  constructor(n) {
    const r = typeof n == "object" && n !== null, s = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(EO(n), r && "cause" in n && typeof n.cause < "u" ? {
      cause: new Vo(n.cause)
    } : void 0);
    i(this, "span");
    this.message === "" && (this.message = "An error has occurred"), Error.stackTraceLimit = s, this.name = n instanceof Error ? n.name : "Error", r && (Or in n && (this.span = n[Or]), Object.keys(n).forEach((o) => {
      o in this || (this[o] = n[o]);
    })), this.stack = MO(`${this.name}: ${this.message}`, n instanceof Error && n.stack ? n.stack : "", this.span);
  }
}
const EO = (e) => {
  if (typeof e == "string")
    return e;
  if (typeof e == "object" && e !== null && e instanceof Error)
    return e.message;
  try {
    if (M(e, "toString") && Ps(e.toString) && e.toString !== Object.prototype.toString && e.toString !== globalThis.Array.prototype.toString)
      return e.toString();
  } catch {
  }
  return hd(e);
}, IO = /\((.*)\)/g, RO = /* @__PURE__ */ z("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap()), MO = (e, t, n) => {
  const r = [e], s = t.startsWith(e) ? t.slice(e.length).split(`
`) : t.split(`
`);
  for (let o = 1; o < s.length && !s[o].includes("Generator.next"); o++) {
    if (s[o].includes("effect_internal_function")) {
      r.pop();
      break;
    }
    r.push(s[o].replace(/at .*effect_instruction_i.*\((.*)\)/, "at $1").replace(/EffectPrimitive\.\w+/, "<anonymous>"));
  }
  if (n) {
    let o = n, c = 0;
    for (; o && o._tag === "Span" && c < 10; ) {
      const a = RO.get(o);
      if (typeof a == "function") {
        const u = a();
        if (typeof u == "string") {
          const l = u.matchAll(IO);
          let h = !1;
          for (const [, d] of l)
            h = !0, r.push(`    at ${o.name} (${d})`);
          h || r.push(`    at ${o.name} (${u.replace(/^at /, "")})`);
        } else
          r.push(`    at ${o.name}`);
      } else
        r.push(`    at ${o.name}`);
      o = _t(o.parent), c++;
    }
  }
  return r.join(`
`);
}, Or = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation"), Tg = (e) => $u(e, void 0, {
  emptyCase: () => [],
  dieCase: (t, n) => [new Vo(n)],
  failCase: (t, n) => [new Vo(n)],
  interruptCase: () => [],
  parallelCase: (t, n, r) => [...n, ...r],
  sequentialCase: (t, n, r) => [...n, ...r]
}), Ws = "Pending", Bc = "Done", FO = "effect/Deferred", NO = /* @__PURE__ */ Symbol.for(FO), AO = {
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e
}, CO = (e) => ({
  _tag: Ws,
  joiners: e
}), vg = (e) => ({
  _tag: Bc,
  effect: e
});
class Gs {
  constructor(t) {
    i(this, "self");
    i(this, "called", !1);
    this.self = t;
  }
  next(t) {
    return this.called ? {
      value: t,
      done: !0
    } : (this.called = !0, {
      value: this.self,
      done: !1
    });
  }
  return(t) {
    return {
      value: t,
      done: !0
    };
  }
  throw(t) {
    throw t;
  }
  [Symbol.iterator]() {
    return new Gs(this.self);
  }
}
const Eg = (e, t) => {
  const n = new ye("Blocked");
  return n.effect_instruction_i0 = e, n.effect_instruction_i1 = t, n;
}, PO = (e) => {
  const t = new ye("RunBlocked");
  return t.effect_instruction_i0 = e, t;
}, $r = /* @__PURE__ */ Symbol.for("effect/Effect");
class xO {
  constructor(t, n) {
    i(this, "patch");
    i(this, "op");
    i(this, "_op", Va);
    this.patch = t, this.op = n;
  }
}
var lh;
class ye {
  constructor(t) {
    i(this, "_op");
    i(this, "effect_instruction_i0");
    i(this, "effect_instruction_i1");
    i(this, "effect_instruction_i2");
    i(this, "trace");
    i(this, lh, or);
    this._op = t;
  }
  [(lh = $r, C)](t) {
    return this === t;
  }
  [j]() {
    return ie(this, Da(this));
  }
  pipe() {
    return v(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: he(this.effect_instruction_i0),
      effect_instruction_i1: he(this.effect_instruction_i1),
      effect_instruction_i2: he(this.effect_instruction_i2)
    };
  }
  toString() {
    return we(this.toJSON());
  }
  [re]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Gs(new xs(this));
  }
}
var fh;
class Ig {
  constructor(t) {
    i(this, "_op");
    i(this, "effect_instruction_i0");
    i(this, "effect_instruction_i1");
    i(this, "effect_instruction_i2");
    i(this, "trace");
    i(this, fh, or);
    this._op = t, this._tag = t;
  }
  [(fh = $r, C)](t) {
    return xu(t) && t._op === "Failure" && // @ts-expect-error
    R(this.effect_instruction_i0, t.effect_instruction_i0);
  }
  [j]() {
    return m(
      // @ts-expect-error
      fe(this._tag),
      // @ts-expect-error
      J($(this.effect_instruction_i0)),
      ie(this)
    );
  }
  get cause() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return v(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      cause: this.cause.toJSON()
    };
  }
  toString() {
    return we(this.toJSON());
  }
  [re]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Gs(new xs(this));
  }
}
var hh;
class Rg {
  constructor(t) {
    i(this, "_op");
    i(this, "effect_instruction_i0");
    i(this, "effect_instruction_i1");
    i(this, "effect_instruction_i2");
    i(this, "trace");
    i(this, hh, or);
    this._op = t, this._tag = t;
  }
  [(hh = $r, C)](t) {
    return xu(t) && t._op === "Success" && // @ts-expect-error
    R(this.effect_instruction_i0, t.effect_instruction_i0);
  }
  [j]() {
    return m(
      // @ts-expect-error
      fe(this._tag),
      // @ts-expect-error
      J($(this.effect_instruction_i0)),
      ie(this)
    );
  }
  get value() {
    return this.effect_instruction_i0;
  }
  pipe() {
    return v(this, arguments);
  }
  toJSON() {
    return {
      _id: "Exit",
      _tag: this._op,
      value: he(this.value)
    };
  }
  toString() {
    return we(this.toJSON());
  }
  [re]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Gs(new xs(this));
  }
}
const Jt = (e) => M(e, $r), ee = (e) => {
  const t = new ye(gd);
  return t.effect_instruction_i0 = e, t;
}, Mg = /* @__PURE__ */ f(3, (e, t, n) => dt((r) => _(e, (s) => _(Yt(Z(() => r(t(s)))), (o) => Z(() => n(s, o)).pipe(tt({
  onFailure: (c) => {
    switch (o._tag) {
      case Ie:
        return ke(Fe(o.effect_instruction_i0, c));
      case Re:
        return ke(c);
    }
  },
  onSuccess: () => o
})))))), De = /* @__PURE__ */ f(2, (e, t) => _(e, () => T(t))), rn = (e) => De(e, void 0), Fg = function() {
  const e = new ye(Oc);
  switch (arguments.length) {
    case 2: {
      e.effect_instruction_i0 = arguments[0], e.commit = arguments[1];
      break;
    }
    case 3: {
      e.effect_instruction_i0 = arguments[0], e.effect_instruction_i1 = arguments[1], e.commit = arguments[2];
      break;
    }
    case 4: {
      e.effect_instruction_i0 = arguments[0], e.effect_instruction_i1 = arguments[1], e.effect_instruction_i2 = arguments[2], e.commit = arguments[3];
      break;
    }
    default:
      throw new Error(wc("you're not supposed to end up here"));
  }
  return e;
}, zo = (e, t = pr) => {
  const n = new ye(as);
  let r;
  return n.effect_instruction_i0 = (s) => {
    r = e(s);
  }, n.effect_instruction_i1 = t, Lg(n, (s) => Jt(r) ? r : me);
}, Ng = (e, t = pr) => Z(() => zo(e, t)), vt = (e, t = pr) => Fg(e, function() {
  let n, r;
  function s(u) {
    n ? n(u) : r === void 0 && (r = u);
  }
  const o = new ye(as);
  o.effect_instruction_i0 = (u) => {
    n = u, r && u(r);
  }, o.effect_instruction_i1 = t;
  let c, a;
  return this.effect_instruction_i0.length !== 1 ? (a = new AbortController(), c = Ce(() => this.effect_instruction_i0(s, a.signal))) : c = Ce(() => this.effect_instruction_i0(s)), c || a ? Lg(o, (u) => (a && a.abort(), c ?? me)) : o;
}), Ag = /* @__PURE__ */ f(2, (e, t) => {
  const n = new ye(_o);
  return n.effect_instruction_i0 = e, n.effect_instruction_i1 = t, n;
}), Wo = /* @__PURE__ */ f(2, (e, t) => Xt(e, {
  onFailure: t,
  onSuccess: T
})), tf = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation"), Tu = (e, t) => ne(t) ? new Proxy(e, {
  has(n, r) {
    return r === Or || r === tf || r in n;
  },
  get(n, r) {
    return r === Or ? t.value : r === tf ? e : n[r];
  }
}) : e, Go = (e) => tn(e) && !(Or in e) ? ee((t) => ke(Xe(Tu(e, Du(t))))) : ke(Xe(e)), oa = (e) => Cg(() => Xe(new g$(e))), Tr = (e) => Xt(e, {
  onFailure: (t) => T(N(t)),
  onSuccess: (t) => T(L(t))
}), Yt = (e) => Pg(e, {
  onFailure: Q,
  onSuccess: X
}), le = (e) => tn(e) && !(Or in e) ? ee((t) => ke(wr(Tu(e, Du(t))))) : ke(wr(e)), Jc = (e) => _(S(e), le), ke = (e) => {
  const t = new Ig(Ie);
  return t.effect_instruction_i0 = e, t;
}, Cg = (e) => _(S(e), ke), vu = /* @__PURE__ */ ee((e) => T(e.id())), Hs = (e) => ee((t) => e(t.id())), _ = /* @__PURE__ */ f(2, (e, t) => {
  const n = new ye(Ao);
  return n.effect_instruction_i0 = e, n.effect_instruction_i1 = t, n;
}), LO = (e) => {
  const t = new ye("OnStep");
  return t.effect_instruction_i0 = e, t;
}, Vc = (e) => _(e, D), Pg = /* @__PURE__ */ f(2, (e, t) => tt(e, {
  onFailure: (n) => T(t.onFailure(n)),
  onSuccess: (n) => T(t.onSuccess(n))
})), tt = /* @__PURE__ */ f(2, (e, t) => {
  const n = new ye(Co);
  return n.effect_instruction_i0 = e, n.effect_instruction_i1 = t.onFailure, n.effect_instruction_i2 = t.onSuccess, n;
}), Xt = /* @__PURE__ */ f(2, (e, t) => tt(e, {
  onFailure: (n) => {
    if (yO(n).length > 0)
      return ke(bO(n));
    const s = pO(n);
    return s.length > 0 ? t.onFailure(Fm(s)) : ke(n);
  },
  onSuccess: t.onSuccess
})), Lt = /* @__PURE__ */ f(2, (e, t) => Z(() => {
  const n = oe(e), r = vc(n.length);
  let s = 0;
  return De(Mu({
    while: () => s < n.length,
    body: () => t(n[s], s),
    step: (o) => {
      r[s++] = o;
    }
  }), r);
})), zc = /* @__PURE__ */ f(2, (e, t) => Z(() => {
  const n = oe(e);
  let r = 0;
  return Mu({
    while: () => r < n.length,
    body: () => t(n[r], r),
    step: () => {
      r++;
    }
  });
})), jO = /* @__PURE__ */ _(vu, (e) => xg(e)), xg = (e) => ke(ot(e)), Eu = (e) => {
  const t = new ye(Rr);
  return t.effect_instruction_i0 = H0(Pr), t.effect_instruction_i1 = () => e, t;
}, KO = /* @__PURE__ */ f(2, (e, t) => dt((n) => _(Yt(n(e)), (r) => E$(t, r)))), H = /* @__PURE__ */ f(2, (e, t) => _(e, (n) => S(() => t(n)))), Iu = /* @__PURE__ */ f(2, (e, t) => Xt(e, {
  onFailure: (n) => Jc(() => t.onFailure(n)),
  onSuccess: (n) => S(() => t.onSuccess(n))
})), Wc = /* @__PURE__ */ f(2, (e, t) => tt(e, {
  onFailure: (n) => {
    const r = Og(n);
    switch (r._tag) {
      case "Left":
        return Jc(() => t(r.left));
      case "Right":
        return ke(r.right);
    }
  },
  onSuccess: T
})), vr = /* @__PURE__ */ f(2, (e, t) => dt((n) => tt(n(e), {
  onFailure: (r) => {
    const s = Q(r);
    return tt(t(s), {
      onFailure: (o) => Q(Fe(r, o)),
      onSuccess: () => s
    });
  },
  onSuccess: (r) => {
    const s = X(r);
    return je(t(s), s);
  }
}))), Lg = /* @__PURE__ */ f(2, (e, t) => vr(e, Qc({
  onFailure: (n) => wu(n) ? rn(t(kg(n))) : me,
  onSuccess: () => me
}))), UO = (e) => DO(e, D), DO = /* @__PURE__ */ f(2, (e, t) => Xt(e, {
  onFailure: (n) => Go(t(n)),
  onSuccess: T
})), T = (e) => {
  const t = new Rg(Re);
  return t.effect_instruction_i0 = e, t;
}, Z = (e) => {
  const t = new ye(Oc);
  return t.commit = e, t;
}, S = (e) => {
  const t = new ye(md);
  return t.effect_instruction_i0 = e, t;
}, Ru = /* @__PURE__ */ f((e) => e.length === 3 || e.length === 2 && !(tn(e[1]) && "onlyEffect" in e[1]), (e, t) => _(e, (n) => {
  const r = typeof t == "function" ? t(n) : t;
  return Jt(r) ? De(r, n) : b_(r) ? zo((s) => {
    r.then((o) => s(T(n)), (o) => s(le(new Wg(o, "An unknown error occurred in Effect.tap"))));
  }) : T(n);
})), qO = (e) => ee((t) => {
  const n = t.getFiberRef(ia), r = m(n, te(() => t.scope()));
  return e(Ys(ia, O(r)));
}), Gc = (e) => {
  const t = new ye(Rr);
  return t.effect_instruction_i0 = mg(Pr), t.effect_instruction_i1 = () => e, t;
}, dt = (e) => Fg(e, function() {
  const t = new ye(Rr);
  return t.effect_instruction_i0 = mg(Pr), t.effect_instruction_i1 = (n) => hg(n) ? Ce(() => this.effect_instruction_i0(Eu)) : Ce(() => this.effect_instruction_i0(Gc)), t;
}), me = /* @__PURE__ */ T(void 0), BO = (e) => {
  const t = new ye(Rr);
  return t.effect_instruction_i0 = e, t.effect_instruction_i1 = void 0, t;
}, JO = /* @__PURE__ */ f(2, (e, t) => _(t, (n) => n ? m(e, H(O)) : T(b()))), Mu = (e) => {
  const t = new ye(Po);
  return t.effect_instruction_i0 = e.while, t.effect_instruction_i1 = e.body, t.effect_instruction_i2 = e.step, t;
}, VO = (e) => Z(() => {
  const t = new ye(us);
  return t.effect_instruction_i0 = e(), t;
}), zO = function() {
  const e = arguments.length === 1 ? arguments[0] : arguments[1].bind(arguments[0]);
  return VO(() => e(m));
}, WO = /* @__PURE__ */ f(2, (e, t) => {
  const n = new ye(Rr);
  return n.effect_instruction_i0 = t, n.effect_instruction_i1 = () => e, n;
}), Fu = (e) => {
  const t = new ye(So);
  return typeof (e == null ? void 0 : e.priority) < "u" ? f$(t, e.priority) : t;
}, jg = /* @__PURE__ */ f(2, (e, t) => _(e, (n) => H(t, (r) => [n, r]))), Nu = /* @__PURE__ */ f(2, (e, t) => _(e, (n) => De(t, n))), je = /* @__PURE__ */ f(2, (e, t) => _(e, () => t)), Kg = /* @__PURE__ */ f(3, (e, t, n) => _(e, (r) => H(t, (s) => n(r, s)))), Ug = (e) => _(vu, (t) => m(e, Ho(t))), Ho = /* @__PURE__ */ f(2, (e, t) => _(e.interruptAsFork(t), () => e.await)), GO = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return v(this, arguments);
  }
}, HO = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return v(this, arguments);
  }
}, YO = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return v(this, arguments);
  }
}, QO = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return v(this, arguments);
  }
}, Dg = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return v(this, arguments);
  }
}, qg = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return v(this, arguments);
  }
}, ZO = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return v(this, arguments);
  }
}, XO = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return v(this, arguments);
  }
}, e$ = "effect/FiberRef", t$ = /* @__PURE__ */ Symbol.for(e$), n$ = {
  /* c8 ignore next */
  _A: (e) => e
}, Au = (e) => ee((t) => X(t.getFiberRef(e))), Hc = /* @__PURE__ */ f(2, (e, t) => _(Au(e), t)), nf = /* @__PURE__ */ f(2, (e, t) => r$(e, () => [void 0, t])), r$ = /* @__PURE__ */ f(2, (e, t) => ee((n) => {
  const [r, s] = t(n.getFiberRef(e));
  return n.setFiberRef(e, s), T(r);
})), Ys = /* @__PURE__ */ f(3, (e, t, n) => Mg(Nu(Au(t), nf(t, n)), () => e, (r) => nf(t, r))), s$ = /* @__PURE__ */ f(3, (e, t, n) => Hc(t, (r) => Ys(e, t, n(r)))), Ve = (e, t) => Ur(e, {
  differ: ag(),
  fork: (t == null ? void 0 : t.fork) ?? D,
  join: t == null ? void 0 : t.join
}), o$ = (e) => {
  const t = C0();
  return Ur(e, {
    differ: t,
    fork: t.empty
  });
}, c$ = (e) => {
  const t = P0(ag());
  return Ur(e, {
    differ: t,
    fork: t.empty
  });
}, Bg = (e) => {
  const t = A0();
  return Ur(e, {
    differ: t,
    fork: t.empty
  });
}, Ur = (e, t) => ({
  ...Us,
  [t$]: n$,
  initial: e,
  commit() {
    return Au(this);
  },
  diff: (r, s) => t.differ.diff(r, s),
  combine: (r, s) => t.differ.combine(r, s),
  patch: (r) => (s) => t.differ.patch(r, s),
  fork: t.fork,
  join: t.join ?? ((r, s) => s)
}), i$ = (e) => Ur(e, {
  differ: Yl,
  fork: Yl.empty
}), sn = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => Bg(ou())), Qs = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => Ve(0)), Jg = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => Ve(2048)), a$ = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => Ve(yu())), u$ = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => Ve(Dg)), l$ = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => Ve(yr())), f$ = /* @__PURE__ */ f(2, (e, t) => Ys(e, Qs, t)), h$ = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => Ve("unbounded")), d$ = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => Ve(!0)), m$ = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => Ve(O(qg))), ca = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => c$(cr())), ia = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => Ve(b(), {
  fork: () => b(),
  join: (e, t) => e
})), ao = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => Ve(br, {
  fork: () => br,
  join: (e, t) => e
})), rf = /* @__PURE__ */ Symbol.for("effect/Scope"), sf = /* @__PURE__ */ Symbol.for("effect/CloseableScope"), Vg = (e, t) => e.addFinalizer(() => rn(t)), Yo = (e, t) => e.addFinalizer(t), aa = (e, t) => e.close(t), Yc = (e, t) => e.fork(t), Cu = /* @__PURE__ */ function() {
  class e extends globalThis.Error {
    commit() {
      return le(this);
    }
    toJSON() {
      const n = {
        ...this
      };
      return this.message && (n.message = this.message), this.cause && (n.cause = this.cause), n;
    }
    [re]() {
      return this.toString !== globalThis.Error.prototype.toString ? this.stack ? `${this.toString()}
${this.stack.split(`
`).slice(1).join(`
`)}` : this.toString() : "Bun" in globalThis ? Kr(wr(this), {
        renderErrorCause: !0
      }) : this;
    }
  }
  return Object.assign(e.prototype, q_), e;
}(), zg = (e, t) => {
  class n extends Cu {
    constructor() {
      super(...arguments);
      i(this, "_tag", t);
    }
  }
  return Object.assign(n.prototype, e), n.prototype.name = t, n;
}, of = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException"), g$ = /* @__PURE__ */ zg({
  [of]: of
}, "RuntimeException"), p$ = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException"), y$ = (e) => M(e, p$), cf = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement"), Pu = /* @__PURE__ */ zg({
  [cf]: cf
}, "NoSuchElementException"), af = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException"), Wg = /* @__PURE__ */ function() {
  class e extends Cu {
    constructor(r, s) {
      super(s ?? "An unknown error occurred", {
        cause: r
      });
      i(this, "_tag", "UnknownException");
      i(this, "error");
      this.error = r;
    }
  }
  return Object.assign(e.prototype, {
    [af]: af,
    name: "UnknownException"
  }), e;
}(), xu = (e) => Jt(e) && "_tag" in e && (e._tag === "Success" || e._tag === "Failure"), _$ = (e) => e._tag === "Failure", S$ = (e) => e._tag === "Success", b$ = /* @__PURE__ */ f(2, (e, t) => {
  switch (e._tag) {
    case Ie:
      return Q(e.effect_instruction_i0);
    case Re:
      return X(t);
  }
}), wi = (e) => b$(e, void 0), nr = (e, t) => $$(e, t != null && t.parallel ? Mn : Fe), Hn = (e) => Q(Xe(e)), ua = (e) => Q(wr(e)), Q = (e) => {
  const t = new Ig(Ie);
  return t.effect_instruction_i0 = e, t;
}, w$ = (e) => Q(ot(e)), $o = /* @__PURE__ */ f(2, (e, t) => {
  switch (e._tag) {
    case Ie:
      return Q(e.effect_instruction_i0);
    case Re:
      return X(t(e.effect_instruction_i0));
  }
}), Qc = /* @__PURE__ */ f(2, (e, {
  onFailure: t,
  onSuccess: n
}) => {
  switch (e._tag) {
    case Ie:
      return t(e.effect_instruction_i0);
    case Re:
      return n(e.effect_instruction_i0);
  }
}), la = /* @__PURE__ */ f(2, (e, {
  onFailure: t,
  onSuccess: n
}) => {
  switch (e._tag) {
    case Ie:
      return t(e.effect_instruction_i0);
    case Re:
      return n(e.effect_instruction_i0);
  }
}), X = (e) => {
  const t = new Rg(Re);
  return t.effect_instruction_i0 = e, t;
}, lt = /* @__PURE__ */ X(void 0), k$ = /* @__PURE__ */ f(2, (e, t) => Lu(e, t, {
  onSuccess: (n, r) => [n, r],
  onFailure: Fe
})), O$ = /* @__PURE__ */ f(2, (e, t) => Lu(e, t, {
  onSuccess: (n, r) => r,
  onFailure: Fe
})), Lu = /* @__PURE__ */ f(3, (e, t, {
  onFailure: n,
  onSuccess: r
}) => {
  switch (e._tag) {
    case Ie:
      switch (t._tag) {
        case Re:
          return Q(e.effect_instruction_i0);
        case Ie:
          return Q(n(e.effect_instruction_i0, t.effect_instruction_i0));
      }
    case Re:
      switch (t._tag) {
        case Re:
          return X(r(e.effect_instruction_i0, t.effect_instruction_i0));
        case Ie:
          return Q(t.effect_instruction_i0);
      }
  }
}), $$ = (e, t) => {
  const n = Rm(e);
  return Dt(n) ? m(xt(n), Qa(m(kt(n), $o(Pe)), (r, s) => m(r, Lu(s, {
    onSuccess: (o, c) => m(o, et(c)),
    onFailure: t
  }))), $o($n), $o((r) => Ht(r)), O) : b();
}, Gg = (e) => ({
  ...Us,
  [NO]: AO,
  state: jc(CO([])),
  commit() {
    return ju(this);
  },
  blockingOn: e
}), T$ = () => _(vu, (e) => v$(e)), v$ = (e) => S(() => Gg(e)), ju = (e) => Ng((t) => {
  const n = Zt(e.state);
  switch (n._tag) {
    case Bc:
      return t(n.effect);
    case Ws:
      return n.joiners.push(t), M$(e, t);
  }
}, e.blockingOn), Zc = /* @__PURE__ */ f(2, (e, t) => S(() => {
  const n = Zt(e.state);
  switch (n._tag) {
    case Bc:
      return !1;
    case Ws: {
      Kc(e.state, vg(t));
      for (let r = 0, s = n.joiners.length; r < s; r++)
        n.joiners[r](t);
      return !0;
    }
  }
})), E$ = /* @__PURE__ */ f(2, (e, t) => Zc(e, t)), I$ = /* @__PURE__ */ f(2, (e, t) => Zc(e, ke(t))), ON = /* @__PURE__ */ f(2, (e, t) => Zc(e, xg(t))), $N = (e) => S(() => Zt(e.state)._tag === Bc), R$ = /* @__PURE__ */ f(2, (e, t) => Zc(e, T(t))), Hg = (e, t) => {
  const n = Zt(e.state);
  if (n._tag === Ws) {
    Kc(e.state, vg(t));
    for (let r = 0, s = n.joiners.length; r < s; r++)
      n.joiners[r](t);
  }
}, M$ = (e, t) => S(() => {
  const n = Zt(e.state);
  if (n._tag === Ws) {
    const r = n.joiners.indexOf(t);
    r >= 0 && n.joiners.splice(r, 1);
  }
}), F$ = /* @__PURE__ */ ee((e) => X(e.currentContext)), N$ = () => F$, Dr = (e) => _(N$(), e), Ku = /* @__PURE__ */ f(2, (e, t) => Ys(sn, t)(e)), Uu = /* @__PURE__ */ f(2, (e, t) => s$(sn, (n) => Bs(n, t))(e)), A$ = /* @__PURE__ */ f(2, (e, t) => Dr((n) => Ku(e, t(n)))), Du = (e) => {
  const t = e.currentSpan;
  return t !== void 0 && t._tag === "Span" ? O(t) : b();
}, TN = _$, C$ = S$, vN = nr, EN = Hn, IN = ua, RN = Q, MN = $o, FN = Qc, NN = X, AN = lt, CN = k$, PN = O$, uf = /* @__PURE__ */ Symbol.for("effect/MutableHashMap"), P$ = {
  [uf]: uf,
  [Symbol.iterator]() {
    return new qu(this);
  },
  toString() {
    return we(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(he)
    };
  },
  [re]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
};
class qu {
  constructor(t) {
    i(this, "self");
    i(this, "referentialIterator");
    i(this, "bucketIterator");
    this.self = t, this.referentialIterator = t.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0)
      return this.bucketIterator.next();
    const t = this.referentialIterator.next();
    return t.done ? (this.bucketIterator = new x$(this.self.buckets.values()), this.next()) : t;
  }
  [Symbol.iterator]() {
    return new qu(this.self);
  }
}
class x$ {
  constructor(t) {
    i(this, "backing");
    i(this, "currentBucket");
    this.backing = t;
  }
  next() {
    if (this.currentBucket === void 0) {
      const n = this.backing.next();
      if (n.done)
        return n;
      this.currentBucket = n.value[Symbol.iterator]();
    }
    const t = this.currentBucket.next();
    return t.done ? (this.currentBucket = void 0, this.next()) : t;
  }
}
const L$ = () => {
  const e = Object.create(P$);
  return e.referential = /* @__PURE__ */ new Map(), e.buckets = /* @__PURE__ */ new Map(), e.bucketsSize = 0, e;
}, fn = /* @__PURE__ */ f(2, (e, t) => {
  if (No(t) === !1)
    return e.referential.has(t) ? O(e.referential.get(t)) : b();
  const n = t[j](), r = e.buckets.get(n);
  return r === void 0 ? b() : j$(e, r, t);
}), j$ = (e, t, n, r = !1) => {
  for (let s = 0, o = t.length; s < o; s++)
    if (n[C](t[s][0])) {
      const c = t[s][1];
      return r && (t.splice(s, 1), e.bucketsSize--), O(c);
    }
  return b();
}, Hr = /* @__PURE__ */ f(2, (e, t) => ne(fn(e, t))), Yr = /* @__PURE__ */ f(3, (e, t, n) => {
  if (No(t) === !1)
    return e.referential.set(t, n), e;
  const r = t[j](), s = e.buckets.get(r);
  return s === void 0 ? (e.buckets.set(r, [[t, n]]), e.bucketsSize++, e) : (K$(e, s, t), s.push([t, n]), e.bucketsSize++, e);
}), K$ = (e, t, n) => {
  for (let r = 0, s = t.length; r < s; r++)
    if (n[C](t[r][0])) {
      t.splice(r, 1), e.bucketsSize--;
      return;
    }
}, U$ = "effect/Clock", lf = /* @__PURE__ */ Symbol.for(U$), Xc = /* @__PURE__ */ Cn("effect/Clock"), D$ = 2 ** 31 - 1, ff = {
  unsafeSchedule(e, t) {
    const n = zi(t);
    if (n > D$)
      return Ai;
    let r = !1;
    const s = setTimeout(() => {
      r = !0, e();
    }, n);
    return () => (clearTimeout(s), !r);
  }
}, hf = /* @__PURE__ */ function() {
  const e = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance > "u")
    return () => BigInt(Date.now()) * e;
  if (typeof performance.timeOrigin == "number" && performance.timeOrigin === 0)
    return () => BigInt(Math.round(performance.now() * 1e6));
  const t = /* @__PURE__ */ BigInt(/* @__PURE__ */ Date.now()) * e - /* @__PURE__ */ BigInt(/* @__PURE__ */ Math.round(/* @__PURE__ */ performance.now() * 1e6));
  return () => t + BigInt(Math.round(performance.now() * 1e6));
}(), q$ = /* @__PURE__ */ function() {
  const e = typeof process == "object" && "hrtime" in process && typeof process.hrtime.bigint == "function" ? process.hrtime : void 0;
  if (!e)
    return hf;
  const t = /* @__PURE__ */ hf() - /* @__PURE__ */ e.bigint();
  return () => t + e.bigint();
}();
var dh;
dh = lf;
class B$ {
  constructor() {
    i(this, dh, lf);
    i(this, "currentTimeMillis", /* @__PURE__ */ S(() => this.unsafeCurrentTimeMillis()));
    i(this, "currentTimeNanos", /* @__PURE__ */ S(() => this.unsafeCurrentTimeNanos()));
  }
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return q$();
  }
  scheduler() {
    return T(ff);
  }
  sleep(t) {
    return vt((n) => {
      const r = ff.unsafeSchedule(() => n(me), t);
      return rn(S(r));
    });
  }
}
const J$ = () => new B$(), Yg = "And", Qg = "Or", Zg = "InvalidData", Xg = "MissingData", ep = "SourceUnavailable", tp = "Unsupported", V$ = "effect/ConfigError", df = /* @__PURE__ */ Symbol.for(V$), qr = {
  _tag: "ConfigError",
  [df]: df
}, np = (e, t) => {
  const n = Object.create(qr);
  return n._op = Yg, n.left = e, n.right = t, Object.defineProperty(n, "toString", {
    enumerable: !1,
    value() {
      return `${this.left} and ${this.right}`;
    }
  }), n;
}, rp = (e, t) => {
  const n = Object.create(qr);
  return n._op = Qg, n.left = e, n.right = t, Object.defineProperty(n, "toString", {
    enumerable: !1,
    value() {
      return `${this.left} or ${this.right}`;
    }
  }), n;
}, z$ = (e, t, n = {
  pathDelim: "."
}) => {
  const r = Object.create(qr);
  return r._op = Zg, r.path = e, r.message = t, Object.defineProperty(r, "toString", {
    enumerable: !1,
    value() {
      return `(Invalid data at ${m(this.path, Fr(n.pathDelim))}: "${this.message}")`;
    }
  }), r;
}, Fn = (e, t, n = {
  pathDelim: "."
}) => {
  const r = Object.create(qr);
  return r._op = Xg, r.path = e, r.message = t, Object.defineProperty(r, "toString", {
    enumerable: !1,
    value() {
      return `(Missing data at ${m(this.path, Fr(n.pathDelim))}: "${this.message}")`;
    }
  }), r;
}, W$ = (e, t, n, r = {
  pathDelim: "."
}) => {
  const s = Object.create(qr);
  return s._op = ep, s.path = e, s.message = t, s.cause = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Source unavailable at ${m(this.path, Fr(r.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, G$ = (e, t, n = {
  pathDelim: "."
}) => {
  const r = Object.create(qr);
  return r._op = tp, r.path = e, r.message = t, Object.defineProperty(r, "toString", {
    enumerable: !1,
    value() {
      return `(Unsupported operation at ${m(this.path, Fr(n.pathDelim))}: "${this.message}")`;
    }
  }), r;
}, hn = /* @__PURE__ */ f(2, (e, t) => {
  switch (e._op) {
    case Yg:
      return np(hn(e.left, t), hn(e.right, t));
    case Qg:
      return rp(hn(e.left, t), hn(e.right, t));
    case Zg:
      return z$([...t, ...e.path], e.message);
    case Xg:
      return Fn([...t, ...e.path], e.message);
    case ep:
      return W$([...t, ...e.path], e.message, e.cause);
    case tp:
      return G$([...t, ...e.path], e.message);
  }
}), H$ = {
  _tag: "Empty"
}, ki = /* @__PURE__ */ f(2, (e, t) => {
  let n = _u(t), r = e;
  for (; Uk(n); ) {
    const s = n.head;
    switch (s._tag) {
      case "Empty": {
        n = n.tail;
        break;
      }
      case "AndThen": {
        n = In(s.first, In(s.second, n.tail));
        break;
      }
      case "MapName": {
        r = gn(r, s.f), n = n.tail;
        break;
      }
      case "Nested": {
        r = xo(r, s.name), n = n.tail;
        break;
      }
      case "Unnested": {
        if (m(hs(r), gS(s.name)))
          r = On(r), n = n.tail;
        else
          return N(Fn(r, `Expected ${s.name} to be in path in ConfigProvider#unnested`));
        break;
      }
    }
  }
  return L(r);
}), Y$ = "Constant", Q$ = "Fail", Z$ = "Fallback", X$ = "Described", eT = "Lazy", tT = "MapOrFail", nT = "Nested", rT = "Primitive", sT = "Sequence", oT = "HashMap", cT = "ZipWith", Qo = (e, t) => [...e, ...t], iT = "effect/ConfigProvider", mf = /* @__PURE__ */ Symbol.for(iT), aT = /* @__PURE__ */ Cn("effect/ConfigProvider"), uT = "effect/ConfigProviderFlat", gf = /* @__PURE__ */ Symbol.for(uT), lT = (e) => ({
  [mf]: mf,
  pipe() {
    return v(this, arguments);
  },
  ...e
}), fT = (e) => ({
  [gf]: gf,
  patch: e.patch,
  load: (t, n, r = !0) => e.load(t, n, r),
  enumerateChildren: e.enumerateChildren
}), hT = (e) => lT({
  load: (t) => _(Ge(e, cr(), t, !1), (n) => be(hs(n), {
    onNone: () => le(Fn(cr(), `Expected a single value having structure: ${t}`)),
    onSome: T
  })),
  flattened: e
}), dT = (e) => {
  const {
    pathDelim: t,
    seqDelim: n
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, e), r = (u) => m(u, Fr(t)), s = (u) => u.split(t), o = () => typeof process < "u" && "env" in process && typeof process.env == "object" ? process.env : {};
  return hT(fT({
    load: (u, l, h = !0) => {
      const d = r(u), p = o(), g = d in p ? O(p[d]) : b();
      return m(g, Wc(() => Fn(u, `Expected ${d} to exist in the process context`)), _((y) => _T(y, u, l, n, h)));
    },
    enumerateChildren: (u) => S(() => {
      const l = o(), p = Object.keys(l).map((g) => s(g.toUpperCase())).filter((g) => {
        for (let y = 0; y < u.length; y++) {
          const I = m(u, Rd(y)), w = g[y];
          if (w === void 0 || I !== w)
            return !1;
        }
        return !0;
      }).flatMap((g) => g.slice(u.length, u.length + 1));
      return Sk(p);
    }),
    patch: H$
  }));
}, mT = (e, t, n, r) => {
  const s = Rl(n.length, (u) => u >= r.length ? b() : O([e(u), u + 1])), o = Rl(r.length, (u) => u >= n.length ? b() : O([t(u), u + 1])), c = Qo(n, s), a = Qo(r, o);
  return [c, a];
}, gT = (e, t) => {
  let n = t;
  if (n._tag === "Nested") {
    const r = e.slice();
    for (; n._tag === "Nested"; )
      r.push(n.name), n = n.config;
    return r;
  }
  return e;
}, Ge = (e, t, n, r) => {
  const s = n;
  switch (s._tag) {
    case Y$:
      return T(st(s.value));
    case X$:
      return Z(() => Ge(e, t, s.config, r));
    case Q$:
      return le(Fn(t, s.message));
    case Z$:
      return m(Z(() => Ge(e, t, s.first, r)), Wo((o) => s.condition(o) ? m(Ge(e, t, s.second, r), Wo((c) => le(rp(o, c)))) : le(o)));
    case eT:
      return Z(() => Ge(e, t, s.config(), r));
    case tT:
      return Z(() => m(Ge(e, t, s.original, r), _(Lt((o) => m(s.mapOrFail(o), Wc(hn(gT(t, s.original))))))));
    case nT:
      return Z(() => Ge(e, Qo(t, st(s.name)), s.config, r));
    case rT:
      return m(ki(t, e.patch), _((o) => m(e.load(o, s, r), _((c) => {
        if (c.length === 0) {
          const a = m(ES(o), te(() => "<n/a>"));
          return le(Fn([], `Expected ${s.description} with name ${a}`));
        }
        return T(c);
      }))));
    case sT:
      return m(ki(t, e.patch), _((o) => m(e.enumerateChildren(o), _(bT), _((c) => c.length === 0 ? Z(() => H(Ge(e, t, s.config, !0), st)) : m(Lt(c, (a) => Ge(e, kS(t, `[${a}]`), s.config, !0)), H((a) => {
        const u = KS(a);
        return u.length === 0 ? st(cr()) : st(u);
      }))))));
    case oT:
      return Z(() => m(ki(t, e.patch), _((o) => m(e.enumerateChildren(o), _((c) => m(c, Lt((a) => Ge(e, Qo(o, st(a)), s.valueConfig, r)), H((a) => a.length === 0 ? st(yu()) : m(ST(a), gn((u) => Fk(Il(oe(c), u)))))))))));
    case cT:
      return Z(() => m(Ge(e, t, s.left, r), Tr, _((o) => m(Ge(e, t, s.right, r), Tr, _((c) => {
        if (Te(o) && Te(c))
          return le(np(o.left, c.left));
        if (Te(o) && bt(c))
          return le(o.left);
        if (bt(o) && Te(c))
          return le(c.left);
        if (bt(o) && bt(c)) {
          const a = m(t, Fr(".")), u = pT(t, a), [l, h] = mT(u, u, m(o.right, gn(L)), m(c.right, gn(L)));
          return m(l, Il(h), Lt(([d, p]) => m(jg(d, p), H(([g, y]) => s.zip(g, y)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
  }
}, pT = (e, t) => (n) => N(Fn(e, `The element at index ${n} in a sequence at path "${t}" was missing`)), yT = (e, t) => e.split(new RegExp(`\\s*${Ko(t)}\\s*`)), _T = (e, t, n, r, s) => s ? m(yT(e, r), Lt((o) => n.parse(o.trim())), Wc(hn(t))) : m(n.parse(e), Iu({
  onFailure: hn(t),
  onSuccess: st
})), ST = (e) => Object.keys(e[0]).map((t) => e.map((n) => n[t])), bT = (e) => m(Lt(e, kT), Iu({
  onFailure: () => cr(),
  onSuccess: _s(ir)
}), Tr, H(tS)), wT = /^(\[(\d+)\])$/, kT = (e) => {
  const t = e.match(wT);
  if (t !== null) {
    const n = t[2];
    return m(n !== void 0 && n.length > 0 ? O(n) : b(), Mr(OT));
  }
  return b();
}, OT = (e) => {
  const t = Number.parseInt(e);
  return Number.isNaN(t) ? b() : O(t);
}, pf = /* @__PURE__ */ Symbol.for("effect/Console"), sp = /* @__PURE__ */ Cn("effect/Console"), $T = {
  [pf]: pf,
  assert(e, ...t) {
    return S(() => {
      console.assert(e, ...t);
    });
  },
  clear: /* @__PURE__ */ S(() => {
    console.clear();
  }),
  count(e) {
    return S(() => {
      console.count(e);
    });
  },
  countReset(e) {
    return S(() => {
      console.countReset(e);
    });
  },
  debug(...e) {
    return S(() => {
      console.debug(...e);
    });
  },
  dir(e, t) {
    return S(() => {
      console.dir(e, t);
    });
  },
  dirxml(...e) {
    return S(() => {
      console.dirxml(...e);
    });
  },
  error(...e) {
    return S(() => {
      console.error(...e);
    });
  },
  group(e) {
    return e != null && e.collapsed ? S(() => console.groupCollapsed(e == null ? void 0 : e.label)) : S(() => console.group(e == null ? void 0 : e.label));
  },
  groupEnd: /* @__PURE__ */ S(() => {
    console.groupEnd();
  }),
  info(...e) {
    return S(() => {
      console.info(...e);
    });
  },
  log(...e) {
    return S(() => {
      console.log(...e);
    });
  },
  table(e, t) {
    return S(() => {
      console.table(e, t);
    });
  },
  time(e) {
    return S(() => console.time(e));
  },
  timeEnd(e) {
    return S(() => console.timeEnd(e));
  },
  timeLog(e, ...t) {
    return S(() => {
      console.timeLog(e, ...t);
    });
  },
  trace(...e) {
    return S(() => {
      console.trace(...e);
    });
  },
  warn(...e) {
    return S(() => {
      console.warn(...e);
    });
  },
  unsafe: console
}, TT = "effect/Random", yf = /* @__PURE__ */ Symbol.for(TT), vT = /* @__PURE__ */ Cn("effect/Random");
var mh;
mh = yf;
class ET {
  constructor(t) {
    i(this, "seed");
    i(this, mh, yf);
    i(this, "PRNG");
    this.seed = t, this.PRNG = new E_(t);
  }
  get next() {
    return S(() => this.PRNG.number());
  }
  get nextBoolean() {
    return H(this.next, (t) => t > 0.5);
  }
  get nextInt() {
    return S(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(t, n) {
    return H(this.next, (r) => (n - t) * r + t);
  }
  nextIntBetween(t, n) {
    return S(() => this.PRNG.integer(n - t) + t);
  }
  shuffle(t) {
    return IT(t, (n) => this.nextIntBetween(0, n));
  }
}
const IT = (e, t) => Z(() => m(S(() => Array.from(e)), _((n) => {
  const r = [];
  for (let s = n.length; s >= 2; s = s - 1)
    r.push(s);
  return m(r, zc((s) => m(t(s), H((o) => RT(n, s - 1, o)))), De(Rm(n)));
}))), RT = (e, t, n) => {
  const r = e[t];
  return e[t] = e[n], e[n] = r, e;
}, MT = (e) => new ET($(e)), _f = /* @__PURE__ */ Symbol.for("effect/Tracer"), FT = (e) => ({
  [_f]: _f,
  ...e
}), op = /* @__PURE__ */ Cn("effect/Tracer"), cp = /* @__PURE__ */ Cn("effect/ParentSpan"), Sf = /* @__PURE__ */ function() {
  const e = "abcdef0123456789", t = e.length;
  return function(n) {
    let r = "";
    for (let s = 0; s < n; s++)
      r += e.charAt(Math.floor(Math.random() * t));
    return r;
  };
}();
class NT {
  constructor(t, n, r, s, o, c) {
    i(this, "name");
    i(this, "parent");
    i(this, "context");
    i(this, "startTime");
    i(this, "kind");
    i(this, "_tag", "Span");
    i(this, "spanId");
    i(this, "traceId", "native");
    i(this, "sampled", !0);
    i(this, "status");
    i(this, "attributes");
    i(this, "events", []);
    i(this, "links");
    this.name = t, this.parent = n, this.context = r, this.startTime = o, this.kind = c, this.status = {
      _tag: "Started",
      startTime: o
    }, this.attributes = /* @__PURE__ */ new Map(), this.traceId = n._tag === "Some" ? n.value.traceId : Sf(32), this.spanId = Sf(16), this.links = Array.from(s);
  }
  end(t, n) {
    this.status = {
      _tag: "Ended",
      endTime: t,
      exit: n,
      startTime: this.status.startTime
    };
  }
  attribute(t, n) {
    this.attributes.set(t, n);
  }
  event(t, n, r) {
    this.events.push([t, n, r ?? {}]);
  }
  addLinks(t) {
    this.links.push(...t);
  }
}
const AT = /* @__PURE__ */ FT({
  span: (e, t, n, r, s, o) => new NT(e, t, n, r, s, o),
  context: (e) => e()
}), CT = /* @__PURE__ */ m(/* @__PURE__ */ ou(), /* @__PURE__ */ Vn(Xc, /* @__PURE__ */ J$()), /* @__PURE__ */ Vn(sp, $T), /* @__PURE__ */ Vn(vT, /* @__PURE__ */ MT(/* @__PURE__ */ Math.random())), /* @__PURE__ */ Vn(aT, /* @__PURE__ */ dT()), /* @__PURE__ */ Vn(op, AT)), Zo = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => Bg(CT)), PT = (e) => {
  const t = Tt(e);
  return ip((n) => n.sleep(t));
}, xT = (e) => ee((t) => e(t.currentDefaultServices)), ip = (e) => xT((t) => e(t.unsafeMap.get(Xc.key))), LT = /* @__PURE__ */ ip((e) => e.currentTimeMillis), jT = PT, KT = LT;
function UT(e) {
  return new en(e);
}
function DT() {
  return UT(/* @__PURE__ */ new Map());
}
const bf = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var gh;
gh = bf;
class en {
  constructor(t) {
    i(this, "locals");
    i(this, gh, bf);
    this.locals = t;
  }
  pipe() {
    return v(this, arguments);
  }
}
const qT = (e, t, n, r = !1) => {
  const s = e;
  let o = t, c = n, a = r, u;
  for (; u === void 0; )
    if (ce(o) && ce(c)) {
      const l = Ke(o)[0], h = On(o), d = Ke(c)[0], p = Ke(c)[1], g = On(c);
      l.startTimeMillis < d.startTimeMillis ? (c = g, a = !0) : l.startTimeMillis > d.startTimeMillis ? o = h : l.id < d.id ? (c = g, a = !0) : l.id > d.id ? o = h : u = [p, a];
    } else
      u = [s.initial, !0];
  return u;
}, BT = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = new Map(e.locals);
  return n.locals.forEach((s, o) => {
    const c = s[0][1];
    if (!s[0][0][C](t)) {
      if (!r.has(o)) {
        if (R(c, o.initial))
          return;
        r.set(o, [[t, o.join(o.initial, c)]]);
        return;
      }
      const a = r.get(o), [u, l] = qT(o, a, s);
      if (l) {
        const h = o.diff(u, c), d = a[0][1], p = o.join(d, o.patch(h)(d));
        if (!R(d, p)) {
          let g;
          const y = a[0][0];
          y[C](t) ? g = [[y, p], ...a.slice(1)] : g = [[t, p], ...a], r.set(o, g);
        }
      }
    }
  }), new en(r);
}), JT = /* @__PURE__ */ f(2, (e, t) => {
  const n = /* @__PURE__ */ new Map();
  return ap(e, n, t), new en(n);
}), ap = (e, t, n) => {
  e.locals.forEach((r, s) => {
    const o = r[0][1], c = s.patch(s.fork)(o);
    R(o, c) ? t.set(s, r) : t.set(s, [[n, c], ...r]);
  });
}, up = /* @__PURE__ */ f(2, (e, t) => {
  const n = new Map(e.locals);
  return n.delete(t), new en(n);
}), VT = /* @__PURE__ */ f(2, (e, t) => e.locals.has(t) ? O(Ke(e.locals.get(t))[1]) : b()), vs = /* @__PURE__ */ f(2, (e, t) => m(VT(e, t), te(() => t.initial))), fa = /* @__PURE__ */ f(2, (e, {
  fiberId: t,
  fiberRef: n,
  value: r
}) => {
  if (e.locals.size === 0)
    return new en(/* @__PURE__ */ new Map([[n, [[t, r]]]]));
  const s = new Map(e.locals);
  return ha(s, t, n, r), new en(s);
}), ha = (e, t, n, r) => {
  const s = e.get(n) ?? [];
  let o;
  if (ce(s)) {
    const [c, a] = Ke(s);
    if (c[C](t)) {
      if (R(a, r))
        return;
      o = [[t, r], ...s.slice(1)];
    } else
      o = [[t, r], ...s];
  } else
    o = [[t, r]];
  e.set(n, o);
}, zT = /* @__PURE__ */ f(2, (e, {
  entries: t,
  forkAs: n
}) => {
  if (e.locals.size === 0)
    return new en(new Map(t));
  const r = new Map(e.locals);
  return n !== void 0 && ap(e, r, n), t.forEach(([s, o]) => {
    o.length === 1 ? ha(r, o[0][0], s, o[0][1]) : o.forEach(([c, a]) => {
      ha(r, c, s, a);
    });
  }), new en(r);
}), WT = vs, GT = zT, HT = DT, YT = GO, QT = HO, ZT = YO, XT = QO, ev = Dg, tv = qg, nv = ZO, rv = XO, sv = /* @__PURE__ */ m(ir, /* @__PURE__ */ Ed((e) => e.ordinal)), ov = /* @__PURE__ */ sS(sv), cv = (e) => {
  switch (e) {
    case "All":
      return YT;
    case "Debug":
      return tv;
    case "Error":
      return ZT;
    case "Fatal":
      return QT;
    case "Info":
      return ev;
    case "Trace":
      return nv;
    case "None":
      return rv;
    case "Warning":
      return XT;
  }
}, lp = (e) => e.replace(/[\s="]/g, "_"), iv = (e) => (t) => `${lp(t.label)}=${e - t.startTime}ms`, av = js, uv = B_;
class Bu extends uv {
}
const Xo = /* @__PURE__ */ Symbol.for("effect/Readable"), fp = /* @__PURE__ */ Symbol.for("effect/Ref"), hp = {
  /* c8 ignore next */
  _A: (e) => e
};
var ph, yh, _h;
class lv extends (_h = Bu, yh = fp, ph = Xo, _h) {
  constructor(n) {
    super();
    i(this, "ref");
    i(this, yh, hp);
    i(this, ph, Xo);
    i(this, "get");
    this.ref = n, this.get = S(() => Zt(this.ref));
  }
  commit() {
    return this.get;
  }
  modify(n) {
    return S(() => {
      const r = Zt(this.ref), [s, o] = n(r);
      return r !== o && Kc(o)(this.ref), s;
    });
  }
}
const dp = (e) => new lv(jc(e)), da = (e) => S(() => dp(e)), bn = (e) => e.get, ec = /* @__PURE__ */ f(2, (e, t) => e.modify(() => [void 0, t])), fv = /* @__PURE__ */ f(2, (e, t) => e.modify(t)), wf = /* @__PURE__ */ f(2, (e, t) => e.modify((n) => [void 0, t(n)])), mp = "Empty", gp = "Add", pp = "Remove", yp = "Update", _p = "AndThen", hv = {
  _tag: mp
}, Sp = (e, t) => {
  const n = new Map(e.locals);
  let r = hv;
  for (const [s, o] of t.locals.entries()) {
    const c = Ke(o)[1], a = n.get(s);
    if (a !== void 0) {
      const u = Ke(a)[1];
      R(u, c) || (r = Oi({
        _tag: yp,
        fiberRef: s,
        patch: s.diff(u, c)
      })(r));
    } else
      r = Oi({
        _tag: gp,
        fiberRef: s,
        value: c
      })(r);
    n.delete(s);
  }
  for (const [s] of n.entries())
    r = Oi({
      _tag: pp,
      fiberRef: s
    })(r);
  return r;
}, Oi = /* @__PURE__ */ f(2, (e, t) => ({
  _tag: _p,
  first: e,
  second: t
})), bp = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = n, s = st(e);
  for (; ce(s); ) {
    const o = Ke(s), c = On(s);
    switch (o._tag) {
      case mp: {
        s = c;
        break;
      }
      case gp: {
        r = fa(r, {
          fiberId: t,
          fiberRef: o.fiberRef,
          value: o.value
        }), s = c;
        break;
      }
      case pp: {
        r = up(r, o.fiberRef), s = c;
        break;
      }
      case yp: {
        const a = vs(r, o.fiberRef);
        r = fa(r, {
          fiberId: t,
          fiberRef: o.fiberRef,
          value: o.fiberRef.patch(o.patch)(a)
        }), s = c;
        break;
      }
      case _p: {
        s = xo(o.first)(xo(o.second)(c));
        break;
      }
    }
  }
  return r;
}), wp = "effect/MetricLabel", ma = /* @__PURE__ */ Symbol.for(wp);
var Sh;
class dv {
  constructor(t, n) {
    i(this, "key");
    i(this, "value");
    i(this, Sh, ma);
    i(this, "_hash");
    this.key = t, this.value = n, this._hash = fe(wp + this.key + this.value);
  }
  [(Sh = ma, j)]() {
    return this._hash;
  }
  [C](t) {
    return gv(t) && this.key === t.key && this.value === t.value;
  }
  pipe() {
    return v(this, arguments);
  }
}
const mv = (e, t) => new dv(e, t), gv = (e) => M(e, ma), pv = (e) => H(e, O), yv = (e) => vv(e, _v, Sp), kp = /* @__PURE__ */ f(2, (e, t) => Xt(e, {
  onFailure: (n) => T(t.onFailure(n)),
  onSuccess: (n) => T(t.onSuccess(n))
})), _v = /* @__PURE__ */ ee((e) => T(e.getFiberRefs())), Sv = (e) => kp(e, {
  onFailure: Ci,
  onSuccess: Ci
}), kf = /* @__PURE__ */ f(2, (e, t) => tt(e, {
  onFailure: (n) => Cg(() => t(n)),
  onSuccess: T
})), bv = (e) => H(e, (t) => !t), wv = (e) => Rv((t, n) => m(e, bp(t, n))), kv = (e) => e.length >= 1 ? vt((t, n) => {
  try {
    e(n).then((r) => t(X(r)), (r) => t(Hn(r)));
  } catch (r) {
    t(Hn(r));
  }
}) : vt((t) => {
  try {
    e().then((n) => t(X(n)), (n) => t(Hn(n)));
  } catch (n) {
    t(Hn(n));
  }
}), Ov = /* @__PURE__ */ f(3, (e, t, n) => Dr((r) => Ku(e, Vn(r, t, n)))), $v = jT, Tv = /* @__PURE__ */ T(/* @__PURE__ */ b()), vv = /* @__PURE__ */ f(3, (e, t, n) => _(t, (r) => _(e, (s) => H(t, (o) => [n(r, o), s])))), Ev = /* @__PURE__ */ f(2, (e, t) => tt(e, {
  onFailure: (n) => je(t(n), ke(n)),
  onSuccess: T
})), Iv = (e) => {
  let t, n;
  typeof e == "function" ? t = e : (t = e.try, n = e.catch);
  const r = (s) => n ? Jc(() => n(s)) : le(new Wg(s, "An unknown error occurred in Effect.tryPromise"));
  return t.length >= 1 ? vt((s, o) => {
    try {
      t(o).then((c) => s(X(c)), (c) => s(r(c)));
    } catch (c) {
      s(r(c));
    }
  }) : vt((s) => {
    try {
      t().then((o) => s(X(o)), (o) => s(r(o)));
    } catch (o) {
      s(r(o));
    }
  });
}, Rv = (e) => ee((t) => (t.setFiberRefs(e(t.id(), t.getFiberRefs())), me)), Mv = /* @__PURE__ */ f(2, (e, t) => Z(() => t() ? H(e, O) : T(b()))), Op = "Sequential", $p = "Parallel", Fv = "ParallelN", ei = {
  _tag: Op
}, Nv = {
  _tag: $p
}, Av = (e) => ({
  _tag: Fv,
  parallelism: e
}), Cv = (e) => e._tag === Op, Pv = (e) => e._tag === $p, ga = ei, pa = Nv, ya = Av, Es = Sp, Is = bp, ti = "effect/FiberStatus", Nn = /* @__PURE__ */ Symbol.for(ti), tc = "Done", Of = "Running", $f = "Suspended", xv = /* @__PURE__ */ fe(`${ti}-${tc}`);
var bh;
class Lv {
  constructor() {
    i(this, bh, Nn);
    i(this, "_tag", tc);
  }
  [(bh = Nn, j)]() {
    return xv;
  }
  [C](t) {
    return Ju(t) && t._tag === tc;
  }
}
var wh;
class jv {
  constructor(t) {
    i(this, "runtimeFlags");
    i(this, wh, Nn);
    i(this, "_tag", Of);
    this.runtimeFlags = t;
  }
  [(wh = Nn, j)]() {
    return m($(ti), J($(this._tag)), J($(this.runtimeFlags)), ie(this));
  }
  [C](t) {
    return Ju(t) && t._tag === Of && this.runtimeFlags === t.runtimeFlags;
  }
}
var kh;
class Kv {
  constructor(t, n) {
    i(this, "runtimeFlags");
    i(this, "blockingOn");
    i(this, kh, Nn);
    i(this, "_tag", $f);
    this.runtimeFlags = t, this.blockingOn = n;
  }
  [(kh = Nn, j)]() {
    return m($(ti), J($(this._tag)), J($(this.runtimeFlags)), J($(this.blockingOn)), ie(this));
  }
  [C](t) {
    return Ju(t) && t._tag === $f && this.runtimeFlags === t.runtimeFlags && R(this.blockingOn, t.blockingOn);
  }
}
const Uv = /* @__PURE__ */ new Lv(), Dv = (e) => new jv(e), qv = (e, t) => new Kv(e, t), Ju = (e) => M(e, Nn), Bv = (e) => e._tag === tc, Jv = Uv, Tp = Dv, Vv = qv, zv = Bv, Wv = /* @__PURE__ */ Symbol.for("effect/Micro"), nc = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit"), Tf = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause"), Gv = {
  _E: D
};
var Oh;
class vp extends globalThis.Error {
  constructor(n, r, s) {
    const o = `MicroCause.${n}`;
    let c, a, u;
    if (r instanceof globalThis.Error) {
      c = `(${o}) ${r.name}`, a = r.message;
      const l = a.split(`
`).length;
      u = r.stack ? `(${o}) ${r.stack.split(`
`).slice(0, l + 3).join(`
`)}` : `${c}: ${a}`;
    } else
      c = o, a = sr(r, 0), u = `${c}: ${a}`;
    s.length > 0 && (u += `
    ${s.join(`
    `)}`);
    super(a);
    i(this, "_tag");
    i(this, "traces");
    i(this, Oh);
    this._tag = n, this.traces = s, this[Tf] = Gv, this.name = c, this.stack = u;
  }
  pipe() {
    return v(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [(Oh = Tf, re)]() {
    return this.stack;
  }
}
class Hv extends vp {
  constructor(n, r = []) {
    super("Die", n, r);
    i(this, "defect");
    this.defect = n;
  }
}
const Yv = (e, t = []) => new Hv(e, t);
class Qv extends vp {
  constructor(t = []) {
    super("Interrupt", "interrupted", t);
  }
}
const Zv = (e = []) => new Qv(e), Xv = (e) => e._tag === "Interrupt", vf = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber"), eE = {
  _A: D,
  _E: D
};
var $h;
$h = vf;
class tE {
  constructor(t, n = !0) {
    i(this, "context");
    i(this, "interruptible");
    i(this, $h);
    i(this, "_stack", []);
    i(this, "_observers", []);
    i(this, "_exit");
    i(this, "_children");
    i(this, "currentOpCount", 0);
    i(this, "_interrupted", !1);
    // cancel the yielded operation, or for the yielded exit value
    i(this, "_yielded");
    this.context = t, this.interruptible = n, this[vf] = eE;
  }
  getRef(t) {
    return ow(this.context, t);
  }
  addObserver(t) {
    return this._exit ? (t(this._exit), Ci) : (this._observers.push(t), () => {
      const n = this._observers.indexOf(t);
      n >= 0 && this._observers.splice(n, 1);
    });
  }
  unsafeInterrupt() {
    this._exit || (this._interrupted = !0, this.interruptible && this.evaluate(Hu));
  }
  unsafePoll() {
    return this._exit;
  }
  evaluate(t) {
    if (this._exit)
      return;
    if (this._yielded !== void 0) {
      const s = this._yielded;
      this._yielded = void 0, s();
    }
    const n = this.runLoop(t);
    if (n === uo)
      return;
    const r = Ef.interruptChildren && Ef.interruptChildren(this);
    if (r !== void 0)
      return this.evaluate(sc(r, () => n));
    this._exit = n;
    for (let s = 0; s < this._observers.length; s++)
      this._observers[s](n);
    this._observers.length = 0;
  }
  runLoop(t) {
    let n = !1, r = t;
    this.currentOpCount = 0;
    try {
      for (; ; ) {
        if (this.currentOpCount++, !n && this.getRef(Yu).shouldYield(this)) {
          n = !0;
          const s = r;
          r = sc(cE, () => s);
        }
        if (r = r[_a](this), r === uo) {
          const s = this._yielded;
          return nc in s ? (this._yielded = void 0, s) : uo;
        }
      }
    } catch (s) {
      return M(r, _a) ? Sa(s) : Sa(`MicroFiber.runLoop: Not a valid effect: ${String(r)}`);
    }
  }
  getCont(t) {
    for (; ; ) {
      const n = this._stack.pop();
      if (!n) return;
      const r = n[rc] && n[rc](this);
      if (r) return {
        [t]: r
      };
      if (n[t]) return n;
    }
  }
  yieldWith(t) {
    return this._yielded = t, uo;
  }
  children() {
    return this._children ?? (this._children = /* @__PURE__ */ new Set());
  }
}
const Ef = /* @__PURE__ */ z("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
})), Ep = /* @__PURE__ */ Symbol.for("effect/Micro/identifier"), Se = /* @__PURE__ */ Symbol.for("effect/Micro/args"), _a = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate"), Er = /* @__PURE__ */ Symbol.for("effect/Micro/successCont"), rr = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont"), rc = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont"), uo = /* @__PURE__ */ Symbol.for("effect/Micro/Yield"), nE = {
  _A: D,
  _E: D,
  _R: D
}, rE = {
  ...av,
  _op: "Micro",
  [Wv]: nE,
  pipe() {
    return v(this, arguments);
  },
  [Symbol.iterator]() {
    return new ud(new xs(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[Ep],
      ...Se in this ? {
        args: this[Se]
      } : void 0
    };
  },
  toString() {
    return we(this);
  },
  [re]() {
    return we(this);
  }
};
function sE(e) {
  return Sa("Micro.evaluate: Not implemented");
}
const ni = (e) => ({
  ...rE,
  [Ep]: e.op,
  [_a]: e.eval ?? sE,
  [Er]: e.contA,
  [rr]: e.contE,
  [rc]: e.ensure
}), Vu = (e) => {
  const t = ni(e);
  return function() {
    const n = Object.create(t);
    return n[Se] = e.single === !1 ? arguments : arguments[0], n;
  };
}, Ip = (e) => {
  const t = {
    ...ni(e),
    [nc]: nc,
    _tag: e.op,
    get [e.prop]() {
      return this[Se];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: e.op,
        [e.prop]: this[Se]
      };
    },
    [C](n) {
      return uE(n) && n._tag === e.op && R(this[Se], n[Se]);
    },
    [j]() {
      return ie(this, J(fe(e.op))($(this[Se])));
    }
  };
  return function(n) {
    const r = Object.create(t);
    return r[Se] = n, r[Er] = void 0, r[rr] = void 0, r[rc] = void 0, r;
  };
}, zu = /* @__PURE__ */ Ip({
  op: "Success",
  prop: "value",
  eval(e) {
    const t = e.getCont(Er);
    return t ? t[Er](this[Se], e) : e.yieldWith(this);
  }
}), Rp = /* @__PURE__ */ Ip({
  op: "Failure",
  prop: "cause",
  eval(e) {
    let t = e.getCont(rr);
    for (; Xv(this[Se]) && t && e.interruptible; )
      t = e.getCont(rr);
    return t ? t[rr](this[Se], e) : e.yieldWith(this);
  }
}), oE = /* @__PURE__ */ Vu({
  op: "Yield",
  eval(e) {
    let t = !1;
    return e.getRef(Yu).scheduleTask(() => {
      t || e.evaluate(lE);
    }, this[Se] ?? 0), e.yieldWith(() => {
      t = !0;
    });
  }
}), cE = /* @__PURE__ */ oE(0), iE = /* @__PURE__ */ zu(void 0), Wu = /* @__PURE__ */ Vu({
  op: "WithMicroFiber",
  eval(e) {
    return this[Se](e);
  }
}), sc = /* @__PURE__ */ f(2, (e, t) => {
  const n = Object.create(aE);
  return n[Se] = e, n[Er] = t, n;
}), aE = /* @__PURE__ */ ni({
  op: "OnSuccess",
  eval(e) {
    return e._stack.push(this), this[Se];
  }
}), uE = (e) => M(e, nc), Mp = zu, Gu = Rp, Hu = /* @__PURE__ */ Gu(/* @__PURE__ */ Zv()), Sa = (e) => Gu(Yv(e)), lE = /* @__PURE__ */ Mp(void 0), fE = "setImmediate" in globalThis ? globalThis.setImmediate : (e) => setTimeout(e, 0);
class Fp {
  constructor() {
    i(this, "tasks", []);
    i(this, "running", !1);
    /**
     * @since 3.5.9
     */
    i(this, "afterScheduled", () => {
      this.running = !1, this.runTasks();
    });
  }
  /**
   * @since 3.5.9
   */
  scheduleTask(t, n) {
    this.tasks.push(t), this.running || (this.running = !0, fE(this.afterScheduled));
  }
  /**
   * @since 3.5.9
   */
  runTasks() {
    const t = this.tasks;
    this.tasks = [];
    for (let n = 0, r = t.length; n < r; n++)
      t[n]();
  }
  /**
   * @since 3.5.9
   */
  shouldYield(t) {
    return t.currentOpCount >= t.getRef(mE);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    for (; this.tasks.length > 0; )
      this.runTasks();
  }
}
const hE = /* @__PURE__ */ f(2, (e, t) => Wu((n) => {
  const r = n.context;
  return n.context = t(r), yE(e, () => (n.context = r, iE));
})), dE = /* @__PURE__ */ f(2, (e, t) => hE(e, Bs(t)));
class mE extends (/* @__PURE__ */ cu()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
}
class Yu extends (/* @__PURE__ */ cu()("effect/Micro/currentScheduler", {
  defaultValue: () => new Fp()
})) {
}
const gE = /* @__PURE__ */ f(2, (e, t) => {
  const n = Object.create(pE);
  return n[Se] = e, n[Er] = t.onSuccess, n[rr] = t.onFailure, n;
}), pE = /* @__PURE__ */ ni({
  op: "OnSuccessAndFailure",
  eval(e) {
    return e._stack.push(this), this[Se];
  }
}), yE = /* @__PURE__ */ f(2, (e, t) => SE((n) => gE(n(e), {
  onFailure: (r) => sc(t(Gu(r)), () => Rp(r)),
  onSuccess: (r) => sc(t(Mp(r)), () => zu(r))
}))), Np = /* @__PURE__ */ Vu({
  op: "SetInterruptible",
  ensure(e) {
    if (e.interruptible = this[Se], e._interrupted && e.interruptible)
      return () => Hu;
  }
}), _E = (e) => Wu((t) => t.interruptible ? e : (t.interruptible = !0, t._stack.push(Np(!1)), t._interrupted ? Hu : e)), SE = (e) => Wu((t) => t.interruptible ? (t.interruptible = !1, t._stack.push(Np(!0)), e(_E)) : e(D)), bE = (e, t) => {
  const n = new tE(Yu.context(new Fp()));
  return n.evaluate(e), n;
};
class Ap {
  constructor() {
    /**
     * @since 2.0.0
     */
    i(this, "buckets", []);
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(t, n) {
    const r = this.buckets.length;
    let s, o = 0;
    for (; o < r && this.buckets[o][0] <= n; o++)
      s = this.buckets[o];
    s && s[0] === n ? s[1].push(t) : o === r ? this.buckets.push([n, [t]]) : this.buckets.splice(o, 0, [n, [t]]);
  }
}
class wE {
  constructor(t) {
    i(this, "maxNextTickBeforeTimer");
    /**
     * @since 2.0.0
     */
    i(this, "running", !1);
    /**
     * @since 2.0.0
     */
    i(this, "tasks", /* @__PURE__ */ new Ap());
    this.maxNextTickBeforeTimer = t;
  }
  /**
   * @since 2.0.0
   */
  starveInternal(t) {
    const n = this.tasks.buckets;
    this.tasks.buckets = [];
    for (const [r, s] of n)
      for (let o = 0; o < s.length; o++)
        s[o]();
    this.tasks.buckets.length === 0 ? this.running = !1 : this.starve(t);
  }
  /**
   * @since 2.0.0
   */
  starve(t = 0) {
    t >= this.maxNextTickBeforeTimer ? setTimeout(() => this.starveInternal(0), 0) : Promise.resolve(void 0).then(() => this.starveInternal(t + 1));
  }
  /**
   * @since 2.0.0
   */
  shouldYield(t) {
    return t.currentOpCount > t.getFiberRef(Jg) ? t.getFiberRef(Qs) : !1;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(t, n) {
    this.tasks.scheduleTask(t, n), this.running || (this.running = !0, this.starve());
  }
}
const Cp = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new wE(2048));
class Pp {
  constructor() {
    /**
     * @since 2.0.0
     */
    i(this, "tasks", /* @__PURE__ */ new Ap());
    /**
     * @since 2.0.0
     */
    i(this, "deferred", !1);
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(t, n) {
    this.deferred ? Cp.scheduleTask(t, n) : this.tasks.scheduleTask(t, n);
  }
  /**
   * @since 2.0.0
   */
  shouldYield(t) {
    return t.currentOpCount > t.getFiberRef(Jg) ? t.getFiberRef(Qs) : !1;
  }
  /**
   * @since 2.0.0
   */
  flush() {
    for (; this.tasks.buckets.length > 0; ) {
      const t = this.tasks.buckets;
      this.tasks.buckets = [];
      for (const [n, r] of t)
        for (let s = 0; s < r.length; s++)
          r[s]();
    }
    this.deferred = !0;
  }
}
const Qu = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => Ve(Cp)), xp = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => Ve(/* @__PURE__ */ new Map())), If = (e, t, n, r) => {
  switch (e) {
    case void 0:
      return t();
    case "unbounded":
      return n();
    case "inherit":
      return Hc(h$, (s) => s === "unbounded" ? n() : s > 1 ? r(s) : t());
    default:
      return e > 1 ? r(e) : t();
  }
}, Zu = "InterruptSignal", Xu = "Stateful", el = "Resume", tl = "YieldNow", $i = (e) => ({
  _tag: Zu,
  cause: e
}), To = (e) => ({
  _tag: Xu,
  onFiber: e
}), Kn = (e) => ({
  _tag: el,
  effect: e
}), kE = () => ({
  _tag: tl
}), OE = "effect/FiberScope", oc = /* @__PURE__ */ Symbol.for(OE);
var Th;
Th = oc;
class $E {
  constructor() {
    i(this, Th, oc);
    i(this, "fiberId", pr);
    i(this, "roots", /* @__PURE__ */ new Set());
  }
  add(t, n) {
    this.roots.add(n), n.addObserver(() => {
      this.roots.delete(n);
    });
  }
}
var vh;
vh = oc;
class TE {
  constructor(t, n) {
    i(this, "fiberId");
    i(this, "parent");
    i(this, vh, oc);
    this.fiberId = t, this.parent = n;
  }
  add(t, n) {
    this.parent.tell(To((r) => {
      r.addChild(n), n.addObserver(() => {
        r.removeChild(n);
      });
    }));
  }
}
const vE = (e) => new TE(e.id(), e), ri = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new $E()), EE = "effect/Fiber", IE = /* @__PURE__ */ Symbol.for(EE), RE = {
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e
}, ME = "effect/Fiber", FE = /* @__PURE__ */ Symbol.for(ME), xN = (e) => e.await, LN = (e) => e.inheritAll, cc = (e) => Nu(Vc(e.await), e.inheritAll);
({
  ...Us
});
const on = "effect/FiberCurrent", NE = "effect/Logger", AE = /* @__PURE__ */ Symbol.for(NE), CE = {
  /* c8 ignore next */
  _Message: (e) => e,
  /* c8 ignore next */
  _Output: (e) => e
}, nl = (e) => ({
  [AE]: CE,
  log: e,
  pipe() {
    return v(this, arguments);
  }
}), PE = /^[^\s"=]*$/, xE = (e, t) => ({
  annotations: n,
  cause: r,
  date: s,
  fiberId: o,
  logLevel: c,
  message: a,
  spans: u
}) => {
  const l = (y) => y.match(PE) ? y : e(y), h = (y, I) => `${lp(y)}=${l(I)}`, d = (y, I) => " " + h(y, I);
  let p = h("timestamp", s.toISOString());
  p += d("level", c.label), p += d("fiber", Qm(o));
  const g = bS(a);
  for (let y = 0; y < g.length; y++)
    p += d("message", sr(g[y], t));
  dO(r) || (p += d("cause", Kr(r, {
    renderErrorCause: !0
  })));
  for (const y of u)
    p += " " + iv(s.getTime())(y);
  for (const [y, I] of n)
    p += d(y, sr(I, t));
  return p;
}, LE = (e) => `"${e.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`, jE = /* @__PURE__ */ nl(/* @__PURE__ */ xE(LE)), KE = typeof process == "object" && process !== null && typeof process.stdout == "object" && process.stdout !== null;
KE && process.stdout.isTTY;
const Lp = "effect/MetricBoundaries", ba = /* @__PURE__ */ Symbol.for(Lp);
var Eh;
class UE {
  constructor(t) {
    i(this, "values");
    i(this, Eh, ba);
    i(this, "_hash");
    this.values = t, this._hash = m(fe(Lp), J(Ls(this.values)));
  }
  [(Eh = ba, j)]() {
    return this._hash;
  }
  [C](t) {
    return DE(t) && R(this.values, t.values);
  }
  pipe() {
    return v(this, arguments);
  }
}
const DE = (e) => M(e, ba), qE = (e) => {
  const t = m(e, Ya(Pe(Number.POSITIVE_INFINITY)), DS);
  return new UE(t);
}, BE = (e) => m(SS(e.count - 1, (t) => e.start * Math.pow(e.factor, t)), Ar, qE), JE = "effect/MetricKeyType", jp = /* @__PURE__ */ Symbol.for(JE), Kp = "effect/MetricKeyType/Counter", wa = /* @__PURE__ */ Symbol.for(Kp), VE = "effect/MetricKeyType/Frequency", zE = /* @__PURE__ */ Symbol.for(VE), WE = "effect/MetricKeyType/Gauge", GE = /* @__PURE__ */ Symbol.for(WE), Up = "effect/MetricKeyType/Histogram", ka = /* @__PURE__ */ Symbol.for(Up), HE = "effect/MetricKeyType/Summary", YE = /* @__PURE__ */ Symbol.for(HE), Dp = {
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _Out: (e) => e
};
var Ih, Rh;
class QE {
  constructor(t, n) {
    i(this, "incremental");
    i(this, "bigint");
    i(this, Rh, Dp);
    i(this, Ih, wa);
    i(this, "_hash");
    this.incremental = t, this.bigint = n, this._hash = fe(Kp);
  }
  [(Rh = jp, Ih = wa, j)]() {
    return this._hash;
  }
  [C](t) {
    return qp(t);
  }
  pipe() {
    return v(this, arguments);
  }
}
var Mh, Fh;
class ZE {
  constructor(t) {
    i(this, "boundaries");
    i(this, Fh, Dp);
    i(this, Mh, ka);
    i(this, "_hash");
    this.boundaries = t, this._hash = m(fe(Up), J($(this.boundaries)));
  }
  [(Fh = jp, Mh = ka, j)]() {
    return this._hash;
  }
  [C](t) {
    return Bp(t) && R(this.boundaries, t.boundaries);
  }
  pipe() {
    return v(this, arguments);
  }
}
const XE = (e) => new QE((e == null ? void 0 : e.incremental) ?? !1, (e == null ? void 0 : e.bigint) ?? !1), eI = (e) => new ZE(e), qp = (e) => M(e, wa), tI = (e) => M(e, zE), nI = (e) => M(e, GE), Bp = (e) => M(e, ka), rI = (e) => M(e, YE), sI = "effect/MetricKey", Jp = /* @__PURE__ */ Symbol.for(sI), oI = {
  /* c8 ignore next */
  _Type: (e) => e
}, cI = /* @__PURE__ */ Za(R);
var Nh;
class rl {
  constructor(t, n, r, s = []) {
    i(this, "name");
    i(this, "keyType");
    i(this, "description");
    i(this, "tags");
    i(this, Nh, oI);
    i(this, "_hash");
    this.name = t, this.keyType = n, this.description = r, this.tags = s, this._hash = m(fe(this.name + this.description), J($(this.keyType)), J(Ls(this.tags)));
  }
  [(Nh = Jp, j)]() {
    return this._hash;
  }
  [C](t) {
    return iI(t) && this.name === t.name && R(this.keyType, t.keyType) && R(this.description, t.description) && cI(this.tags, t.tags);
  }
  pipe() {
    return v(this, arguments);
  }
}
const iI = (e) => M(e, Jp), aI = (e, t) => new rl(e, XE(t), Tc(t == null ? void 0 : t.description)), uI = (e, t, n) => new rl(e, eI(t), Tc(n)), lI = /* @__PURE__ */ f(2, (e, t) => t.length === 0 ? e : new rl(e.name, e.keyType, e.description, bo(e.tags, t))), fI = "effect/MetricState", Zs = /* @__PURE__ */ Symbol.for(fI), Vp = "effect/MetricState/Counter", Oa = /* @__PURE__ */ Symbol.for(Vp), zp = "effect/MetricState/Frequency", $a = /* @__PURE__ */ Symbol.for(zp), Wp = "effect/MetricState/Gauge", Ta = /* @__PURE__ */ Symbol.for(Wp), Gp = "effect/MetricState/Histogram", va = /* @__PURE__ */ Symbol.for(Gp), Hp = "effect/MetricState/Summary", Ea = /* @__PURE__ */ Symbol.for(Hp), Xs = {
  /* c8 ignore next */
  _A: (e) => e
};
var Ah, Ch;
class hI {
  constructor(t) {
    i(this, "count");
    i(this, Ch, Xs);
    i(this, Ah, Oa);
    this.count = t;
  }
  [(Ch = Zs, Ah = Oa, j)]() {
    return m($(Vp), J($(this.count)), ie(this));
  }
  [C](t) {
    return OI(t) && this.count === t.count;
  }
  pipe() {
    return v(this, arguments);
  }
}
const dI = /* @__PURE__ */ Za(R);
var Ph, xh;
class mI {
  constructor(t) {
    i(this, "occurrences");
    i(this, xh, Xs);
    i(this, Ph, $a);
    i(this, "_hash");
    this.occurrences = t;
  }
  [(xh = Zs, Ph = $a, j)]() {
    return m(fe(zp), J(Ls(oe(this.occurrences.entries()))), ie(this));
  }
  [C](t) {
    return $I(t) && dI(oe(this.occurrences.entries()), oe(t.occurrences.entries()));
  }
  pipe() {
    return v(this, arguments);
  }
}
var Lh, jh;
class gI {
  constructor(t) {
    i(this, "value");
    i(this, jh, Xs);
    i(this, Lh, Ta);
    this.value = t;
  }
  [(jh = Zs, Lh = Ta, j)]() {
    return m($(Wp), J($(this.value)), ie(this));
  }
  [C](t) {
    return TI(t) && this.value === t.value;
  }
  pipe() {
    return v(this, arguments);
  }
}
var Kh, Uh;
class pI {
  constructor(t, n, r, s, o) {
    i(this, "buckets");
    i(this, "count");
    i(this, "min");
    i(this, "max");
    i(this, "sum");
    i(this, Uh, Xs);
    i(this, Kh, va);
    this.buckets = t, this.count = n, this.min = r, this.max = s, this.sum = o;
  }
  [(Uh = Zs, Kh = va, j)]() {
    return m($(Gp), J($(this.buckets)), J($(this.count)), J($(this.min)), J($(this.max)), J($(this.sum)), ie(this));
  }
  [C](t) {
    return vI(t) && R(this.buckets, t.buckets) && this.count === t.count && this.min === t.min && this.max === t.max && this.sum === t.sum;
  }
  pipe() {
    return v(this, arguments);
  }
}
var Dh, qh;
class yI {
  constructor(t, n, r, s, o, c) {
    i(this, "error");
    i(this, "quantiles");
    i(this, "count");
    i(this, "min");
    i(this, "max");
    i(this, "sum");
    i(this, qh, Xs);
    i(this, Dh, Ea);
    this.error = t, this.quantiles = n, this.count = r, this.min = s, this.max = o, this.sum = c;
  }
  [(qh = Zs, Dh = Ea, j)]() {
    return m($(Hp), J($(this.error)), J($(this.quantiles)), J($(this.count)), J($(this.min)), J($(this.max)), J($(this.sum)), ie(this));
  }
  [C](t) {
    return EI(t) && this.error === t.error && R(this.quantiles, t.quantiles) && this.count === t.count && this.min === t.min && this.max === t.max && this.sum === t.sum;
  }
  pipe() {
    return v(this, arguments);
  }
}
const _I = (e) => new hI(e), SI = (e) => new mI(e), bI = (e) => new gI(e), wI = (e) => new pI(e.buckets, e.count, e.min, e.max, e.sum), kI = (e) => new yI(e.error, e.quantiles, e.count, e.min, e.max, e.sum), OI = (e) => M(e, Oa), $I = (e) => M(e, $a), TI = (e) => M(e, Ta), vI = (e) => M(e, va), EI = (e) => M(e, Ea), II = "effect/MetricHook", RI = /* @__PURE__ */ Symbol.for(II), MI = {
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _Out: (e) => e
}, eo = (e) => ({
  [RI]: MI,
  pipe() {
    return v(this, arguments);
  },
  ...e
}), Rf = /* @__PURE__ */ BigInt(0), FI = (e) => {
  let t = e.keyType.bigint ? Rf : 0;
  const n = e.keyType.incremental ? e.keyType.bigint ? (s) => s >= Rf : (s) => s >= 0 : (s) => !0, r = (s) => {
    n(s) && (t = t + s);
  };
  return eo({
    get: () => _I(t),
    update: r,
    modify: r
  });
}, NI = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.keyType.preregisteredWords)
    t.set(r, 0);
  const n = (r) => {
    const s = t.get(r) ?? 0;
    t.set(r, s + 1);
  };
  return eo({
    get: () => SI(t),
    update: n,
    modify: n
  });
}, AI = (e, t) => {
  let n = t;
  return eo({
    get: () => bI(n),
    update: (r) => {
      n = r;
    },
    modify: (r) => {
      n = n + r;
    }
  });
}, CI = (e) => {
  const t = e.keyType.boundaries.values, n = t.length, r = new Uint32Array(n + 1), s = new Float32Array(n);
  let o = 0, c = 0, a = Number.MAX_VALUE, u = Number.MIN_VALUE;
  m(t, _s(ir), gn((d, p) => {
    s[p] = d;
  }));
  const l = (d) => {
    let p = 0, g = n;
    for (; p !== g; ) {
      const y = Math.floor(p + (g - p) / 2), I = s[y];
      d <= I ? g = y : p = y, g === p + 1 && (d <= s[p] ? g = p : p = g);
    }
    r[p] = r[p] + 1, o = o + 1, c = c + d, d < a && (a = d), d > u && (u = d);
  }, h = () => {
    const d = vc(n);
    let p = 0;
    for (let g = 0; g < n; g++) {
      const y = s[g], I = r[g];
      p = p + I, d[g] = [y, p];
    }
    return d;
  };
  return eo({
    get: () => wI({
      buckets: h(),
      count: o,
      min: a,
      max: u,
      sum: c
    }),
    update: l,
    modify: l
  });
}, PI = (e) => {
  const {
    error: t,
    maxAge: n,
    maxSize: r,
    quantiles: s
  } = e.keyType, o = m(s, _s(ir)), c = vc(r);
  let a = 0, u = 0, l = 0, h = Number.MAX_VALUE, d = Number.MIN_VALUE;
  const p = (y) => {
    const I = [];
    let w = 0;
    for (; w !== r - 1; ) {
      const k = c[w];
      if (k != null) {
        const [q, E] = k, A = qo(y - q);
        xw(A, Cm) && A <= n && I.push(E);
      }
      w = w + 1;
    }
    return xI(t, o, _s(I, ir));
  }, g = (y, I) => {
    if (r > 0) {
      a = a + 1;
      const w = a % r;
      c[w] = [I, y];
    }
    u = u + 1, l = l + y, y < h && (h = y), y > d && (d = y);
  };
  return eo({
    get: () => kI({
      error: t,
      quantiles: p(Date.now()),
      count: u,
      min: h,
      max: d,
      sum: l
    }),
    update: ([y, I]) => g(y, I),
    modify: ([y, I]) => g(y, I)
  });
}, xI = (e, t, n) => {
  const r = n.length;
  if (!ce(t))
    return cr();
  const s = t[0], o = t.slice(1), c = Mf(e, r, b(), 0, s, n), a = st(c);
  return o.forEach((u) => {
    a.push(Mf(e, r, c.value, c.consumed, u, c.rest));
  }), gn(a, (u) => [u.quantile, u.value]);
}, Mf = (e, t, n, r, s, o) => {
  let c = e, a = t, u = n, l = r, h = s, d = o, p = e, g = t, y = n, I = r, w = s, k = o;
  for (; ; ) {
    if (!ce(d))
      return {
        quantile: h,
        value: b(),
        consumed: l,
        rest: []
      };
    if (h === 1)
      return {
        quantile: h,
        value: O(Md(d)),
        consumed: l + d.length,
        rest: []
      };
    const q = RS(d, (K) => K <= d[0]), E = h * a, A = c / 2 * E, P = l + q[0].length, F = Math.abs(P - E);
    if (P < E - A) {
      p = c, g = a, y = hs(d), I = P, w = h, k = q[1], c = p, a = g, u = y, l = I, h = w, d = k;
      continue;
    }
    if (P > E + A)
      return {
        quantile: h,
        value: u,
        consumed: l,
        rest: d
      };
    switch (u._tag) {
      case "None": {
        p = c, g = a, y = hs(d), I = P, w = h, k = q[1], c = p, a = g, u = y, l = I, h = w, d = k;
        continue;
      }
      case "Some": {
        const K = Math.abs(E - u.value);
        if (F < K) {
          p = c, g = a, y = hs(d), I = P, w = h, k = q[1], c = p, a = g, u = y, l = I, h = w, d = k;
          continue;
        }
        return {
          quantile: h,
          value: O(u.value),
          consumed: l,
          rest: d
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
}, LI = "effect/MetricPair", jI = /* @__PURE__ */ Symbol.for(LI), KI = {
  /* c8 ignore next */
  _Type: (e) => e
}, UI = (e, t) => ({
  [jI]: KI,
  metricKey: e,
  metricState: t,
  pipe() {
    return v(this, arguments);
  }
}), DI = "effect/MetricRegistry", Ff = /* @__PURE__ */ Symbol.for(DI);
var Bh;
Bh = Ff;
class qI {
  constructor() {
    i(this, Bh, Ff);
    i(this, "map", /* @__PURE__ */ L$());
  }
  snapshot() {
    const t = [];
    for (const [n, r] of this.map)
      t.push(UI(n, r.get()));
    return t;
  }
  get(t) {
    const n = m(this.map, fn(t), _t);
    if (n == null) {
      if (qp(t.keyType))
        return this.getCounter(t);
      if (nI(t.keyType))
        return this.getGauge(t);
      if (tI(t.keyType))
        return this.getFrequency(t);
      if (Bp(t.keyType))
        return this.getHistogram(t);
      if (rI(t.keyType))
        return this.getSummary(t);
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else
      return n;
  }
  getCounter(t) {
    let n = m(this.map, fn(t), _t);
    if (n == null) {
      const r = FI(t);
      m(this.map, Hr(t)) || m(this.map, Yr(t, r)), n = r;
    }
    return n;
  }
  getFrequency(t) {
    let n = m(this.map, fn(t), _t);
    if (n == null) {
      const r = NI(t);
      m(this.map, Hr(t)) || m(this.map, Yr(t, r)), n = r;
    }
    return n;
  }
  getGauge(t) {
    let n = m(this.map, fn(t), _t);
    if (n == null) {
      const r = AI(t, t.keyType.bigint ? BigInt(0) : 0);
      m(this.map, Hr(t)) || m(this.map, Yr(t, r)), n = r;
    }
    return n;
  }
  getHistogram(t) {
    let n = m(this.map, fn(t), _t);
    if (n == null) {
      const r = CI(t);
      m(this.map, Hr(t)) || m(this.map, Yr(t, r)), n = r;
    }
    return n;
  }
  getSummary(t) {
    let n = m(this.map, fn(t), _t);
    if (n == null) {
      const r = PI(t);
      m(this.map, Hr(t)) || m(this.map, Yr(t, r)), n = r;
    }
    return n;
  }
}
const BI = () => new qI(), JI = "effect/Metric", VI = /* @__PURE__ */ Symbol.for(JI), zI = {
  /* c8 ignore next */
  _Type: (e) => e,
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _Out: (e) => e
}, Nf = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => BI()), Yp = function(e, t, n, r) {
  const s = Object.assign((o) => Ru(o, (c) => YI(s, c)), {
    [VI]: zI,
    keyType: e,
    unsafeUpdate: t,
    unsafeValue: n,
    unsafeModify: r,
    register() {
      return this.unsafeValue([]), this;
    },
    pipe() {
      return v(this, arguments);
    }
  });
  return s;
}, si = (e, t) => Qp(aI(e, t)), Qp = (e) => {
  let t;
  const n = /* @__PURE__ */ new WeakMap(), r = (s) => {
    if (s.length === 0)
      return t !== void 0 || (t = Nf.get(e)), t;
    let o = n.get(s);
    return o !== void 0 || (o = Nf.get(lI(e, s)), n.set(s, o)), o;
  };
  return Yp(e.keyType, (s, o) => r(o).update(s), (s) => r(s).get(), (s, o) => r(o).modify(s));
}, WI = (e, t, n) => Qp(uI(e, t, n)), GI = /* @__PURE__ */ f(3, (e, t, n) => HI(e, [mv(t, n)])), HI = /* @__PURE__ */ f(2, (e, t) => Yp(e.keyType, (n, r) => e.unsafeUpdate(n, bo(t, r)), (n) => e.unsafeValue(bo(t, n)), (n, r) => e.unsafeModify(n, bo(t, r)))), YI = /* @__PURE__ */ f(2, (e, t) => Hc(ca, (n) => S(() => e.unsafeUpdate(t, n))));
({
  ...Ks
});
const QI = /* @__PURE__ */ f(2, (e, t) => Hc(xp, (n) => S(() => {
  if (n.has(e)) {
    const r = n.get(e);
    r.state.completed || (r.state.completed = !0, Hg(r.result, t));
  }
}))), ZI = "effect/Supervisor", oi = /* @__PURE__ */ Symbol.for(ZI), sl = {
  /* c8 ignore next */
  _T: (e) => e
};
var Jh;
Jh = oi;
const yl = class yl {
  constructor(t, n) {
    i(this, "underlying");
    i(this, "value0");
    i(this, Jh, sl);
    this.underlying = t, this.value0 = n;
  }
  get value() {
    return this.value0;
  }
  onStart(t, n, r, s) {
    this.underlying.onStart(t, n, r, s);
  }
  onEnd(t, n) {
    this.underlying.onEnd(t, n);
  }
  onEffect(t, n) {
    this.underlying.onEffect(t, n);
  }
  onSuspend(t) {
    this.underlying.onSuspend(t);
  }
  onResume(t) {
    this.underlying.onResume(t);
  }
  map(t) {
    return new yl(this, m(this.value, H(t)));
  }
  zip(t) {
    return new ac(this, t);
  }
};
let ic = yl;
var Vh;
Vh = oi;
const _l = class _l {
  constructor(t, n) {
    i(this, "left");
    i(this, "right");
    i(this, "_tag", "Zip");
    i(this, Vh, sl);
    this.left = t, this.right = n;
  }
  get value() {
    return jg(this.left.value, this.right.value);
  }
  onStart(t, n, r, s) {
    this.left.onStart(t, n, r, s), this.right.onStart(t, n, r, s);
  }
  onEnd(t, n) {
    this.left.onEnd(t, n), this.right.onEnd(t, n);
  }
  onEffect(t, n) {
    this.left.onEffect(t, n), this.right.onEffect(t, n);
  }
  onSuspend(t) {
    this.left.onSuspend(t), this.right.onSuspend(t);
  }
  onResume(t) {
    this.left.onResume(t), this.right.onResume(t);
  }
  map(t) {
    return new ic(this, m(this.value, H(t)));
  }
  zip(t) {
    return new _l(this, t);
  }
};
let ac = _l;
const Zp = (e) => M(e, oi) && Ka(e, "Zip");
var zh;
zh = oi;
class XI {
  constructor(t) {
    i(this, "effect");
    i(this, zh, sl);
    this.effect = t;
  }
  get value() {
    return this.effect;
  }
  onStart(t, n, r, s) {
  }
  onEnd(t, n) {
  }
  onEffect(t, n) {
  }
  onSuspend(t) {
  }
  onResume(t) {
  }
  map(t) {
    return new ic(this, m(this.value, H(t)));
  }
  zip(t) {
    return new ac(this, t);
  }
  onRun(t, n) {
    return t();
  }
}
const e1 = (e) => new XI(e), ci = /* @__PURE__ */ z("effect/Supervisor/none", () => e1(me)), t1 = Cr, Xp = "Empty", ey = "AddSupervisor", ty = "RemoveSupervisor", ny = "AndThen", ms = {
  _tag: Xp
}, vo = (e, t) => ({
  _tag: ny,
  first: e,
  second: t
}), n1 = (e, t) => r1(t, Pe(e)), r1 = (e, t) => {
  let n = e, r = t;
  for (; Dt(r); ) {
    const s = kt(r);
    switch (s._tag) {
      case Xp: {
        r = xt(r);
        break;
      }
      case ey: {
        n = n.zip(s.supervisor), r = xt(r);
        break;
      }
      case ty: {
        n = Ia(n, s.supervisor), r = xt(r);
        break;
      }
      case ny: {
        r = et(s.first)(et(s.second)(xt(r)));
        break;
      }
    }
  }
  return n;
}, Ia = (e, t) => R(e, t) ? ci : Zp(e) ? Ia(e.left, t).zip(Ia(e.right, t)) : e, uc = (e) => R(e, ci) ? vn() : Zp(e) ? m(uc(e.left), ks(uc(e.right))) : gu(e), s1 = (e, t) => {
  if (R(e, t))
    return ms;
  const n = uc(e), r = uc(t), s = m(r, Jl(n), Os(ms, (c, a) => vo(c, {
    _tag: ey,
    supervisor: a
  }))), o = m(n, Jl(r), Os(ms, (c, a) => vo(c, {
    _tag: ty,
    supervisor: a
  })));
  return vo(s, o);
}, o1 = /* @__PURE__ */ t1({
  empty: ms,
  patch: n1,
  combine: vo,
  diff: s1
}), c1 = /* @__PURE__ */ si("effect_fiber_started", {
  incremental: !0
}), Af = /* @__PURE__ */ si("effect_fiber_active"), i1 = /* @__PURE__ */ si("effect_fiber_successes", {
  incremental: !0
}), a1 = /* @__PURE__ */ si("effect_fiber_failures", {
  incremental: !0
}), u1 = /* @__PURE__ */ GI(/* @__PURE__ */ WI("effect_fiber_lifetimes", /* @__PURE__ */ BE({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds"), Qr = "Continue", l1 = "Done", Cf = "Yield", f1 = {
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e
}, lo = (e) => {
  throw new Error(`BUG: FiberRuntime - ${sr(e)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
}, Nt = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp"), At = /* @__PURE__ */ z("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
})), Zr = {
  [Ao]: (e, t, n) => Ce(() => t.effect_instruction_i1(n)),
  OnStep: (e, t, n) => X(X(n)),
  [Co]: (e, t, n) => Ce(() => t.effect_instruction_i2(n)),
  [Va]: (e, t, n) => (e.patchRuntimeFlags(e.currentRuntimeFlags, t.patch), Wt(e.currentRuntimeFlags) && e.isInterrupted() ? Q(e.getInterruptedCause()) : X(n)),
  [Po]: (e, t, n) => (Ce(() => t.effect_instruction_i2(n)), Ce(() => t.effect_instruction_i0()) ? (e.pushStack(t), Ce(() => t.effect_instruction_i1())) : me),
  [us]: (e, t, n) => {
    const r = Ce(() => t.effect_instruction_i0.next(n));
    return r.done ? X(r.value) : (e.pushStack(t), R_(r.value));
  }
}, h1 = {
  [Zu]: (e, t, n, r) => (e.processNewInterruptSignal(r.cause), Wt(t) ? Q(r.cause) : n),
  [el]: (e, t, n, r) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [Xu]: (e, t, n, r) => (r.onFiber(e, Tp(t)), n),
  [tl]: (e, t, n, r) => _(Fu(), () => n)
}, d1 = (e) => zc(Y0(e), (t) => wn(lO(t), ([n, r]) => {
  const s = /* @__PURE__ */ new Map(), o = [];
  for (const a of r) {
    o.push(Ht(a));
    for (const u of a)
      s.set(u.request, u);
  }
  const c = o.flat();
  return Ys(L1(n.runAll(o), c, () => c.forEach((a) => {
    a.listeners.interrupted = !0;
  })), xp, s);
}, !1, !1)), m1 = /* @__PURE__ */ Sc();
var Wh, Gh;
class ry extends Bu {
  constructor(n, r, s) {
    super();
    i(this, Gh, RE);
    i(this, Wh, f1);
    i(this, "_fiberRefs");
    i(this, "_fiberId");
    i(this, "_queue", /* @__PURE__ */ new Array());
    i(this, "_children", null);
    i(this, "_observers", /* @__PURE__ */ new Array());
    i(this, "_running", !1);
    i(this, "_stack", []);
    i(this, "_asyncInterruptor", null);
    i(this, "_asyncBlockingOn", null);
    i(this, "_exitValue", null);
    i(this, "_steps", []);
    i(this, "_isYielding", !1);
    i(this, "currentRuntimeFlags");
    i(this, "currentOpCount", 0);
    i(this, "currentSupervisor");
    i(this, "currentScheduler");
    i(this, "currentTracer");
    i(this, "currentSpan");
    i(this, "currentContext");
    i(this, "currentDefaultServices");
    i(this, "run", () => {
      this.drainQueueOnCurrentThread();
    });
    if (this.currentRuntimeFlags = s, this._fiberId = n, this._fiberRefs = r, Hl(s)) {
      const o = this.getFiberRef(ca);
      c1.unsafeUpdate(1, o), Af.unsafeUpdate(1, o);
    }
    this.refreshRefCache();
  }
  commit() {
    return cc(this);
  }
  /**
   * The identity of the fiber.
   */
  id() {
    return this._fiberId;
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background. This can be called to "kick off" execution of a fiber after
   * it has been created.
   */
  resume(n) {
    this.tell(Kn(n));
  }
  /**
   * The status of the fiber.
   */
  get status() {
    return this.ask((n, r) => r);
  }
  /**
   * Gets the fiber runtime flags.
   */
  get runtimeFlags() {
    return this.ask((n, r) => zv(r) ? n.currentRuntimeFlags : r.runtimeFlags);
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return vE(this);
  }
  /**
   * Retrieves the immediate children of the fiber.
   */
  get children() {
    return this.ask((n) => Array.from(n.getChildren()));
  }
  /**
   * Gets the fiber's set of children.
   */
  getChildren() {
    return this._children === null && (this._children = /* @__PURE__ */ new Set()), this._children;
  }
  /**
   * Retrieves the interrupted cause of the fiber, which will be `Cause.empty`
   * if the fiber has not been interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getInterruptedCause() {
    return this.getFiberRef(ao);
  }
  /**
   * Retrieves the whole set of fiber refs.
   */
  fiberRefs() {
    return this.ask((n) => n.getFiberRefs());
  }
  /**
   * Returns an effect that will contain information computed from the fiber
   * state and status while running on the fiber.
   *
   * This allows the outside world to interact safely with mutable fiber state
   * without locks or immutable data.
   */
  ask(n) {
    return Z(() => {
      const r = Gg(this._fiberId);
      return this.tell(To((s, o) => {
        Hg(r, S(() => n(s, o)));
      })), ju(r);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(n) {
    this._queue.push(n), this._running || (this._running = !0, this.drainQueueLaterOnExecutor());
  }
  get await() {
    return vt((n) => {
      const r = (s) => n(T(s));
      return this.tell(To((s, o) => {
        s._exitValue !== null ? r(this._exitValue) : s.addObserver(r);
      })), S(() => this.tell(To((s, o) => {
        s.removeObserver(r);
      })));
    }, this.id());
  }
  get inheritAll() {
    return ee((n, r) => {
      const s = n.id(), o = n.getFiberRefs(), c = r.runtimeFlags, a = this.getFiberRefs(), u = BT(o, s, a);
      n.setFiberRefs(u);
      const l = n.getFiberRef(jf), h = m(
        Sn(c, l),
        // Do not inherit WindDown or Interruption!
        Ql(Pr),
        Ql(ra)
      );
      return BO(h);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return S(() => Tc(this._exitValue));
  }
  /**
   * Unsafely observes the fiber, but returns immediately if it is not
   * already done.
   */
  unsafePoll() {
    return this._exitValue;
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  interruptAsFork(n) {
    return S(() => this.tell($i(ot(n))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(n) {
    this.tell($i(ot(n)));
  }
  /**
   * Adds an observer to the list of observers.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addObserver(n) {
    this._exitValue !== null ? n(this._exitValue) : this._observers.push(n);
  }
  /**
   * Removes the specified observer from the list of observers that will be
   * notified when the fiber exits.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeObserver(n) {
    this._observers = this._observers.filter((r) => r !== n);
  }
  /**
   * Retrieves all fiber refs of the fiber.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRefs() {
    return this.setFiberRef(jf, this.currentRuntimeFlags), this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(n) {
    this._fiberRefs = up(this._fiberRefs, n);
  }
  /**
   * Retrieves the state of the fiber ref, or else its initial value.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  getFiberRef(n) {
    return this._fiberRefs.locals.has(n) ? this._fiberRefs.locals.get(n)[0][1] : n.initial;
  }
  /**
   * Sets the fiber ref to the specified value.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRef(n, r) {
    this._fiberRefs = fa(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef: n,
      value: r
    }), this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(Zo), this.currentTracer = this.currentDefaultServices.unsafeMap.get(op.key), this.currentSupervisor = this.getFiberRef(C1), this.currentScheduler = this.getFiberRef(Qu), this.currentContext = this.getFiberRef(sn), this.currentSpan = this.currentContext.unsafeMap.get(cp.key);
  }
  /**
   * Wholesale replaces all fiber refs of this fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  setFiberRefs(n) {
    this._fiberRefs = n, this.refreshRefCache();
  }
  /**
   * Adds a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addChild(n) {
    this.getChildren().add(n);
  }
  /**
   * Removes a reference to the specified fiber inside the children set.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  removeChild(n) {
    this.getChildren().delete(n);
  }
  /**
   * Transfers all children of this fiber that are currently running to the
   * specified fiber scope.
   *
   * **NOTE**: This method must be invoked by the fiber itself after it has
   * evaluated the effects but prior to exiting.
   */
  transferChildren(n) {
    const r = this._children;
    if (this._children = null, r !== null && r.size > 0)
      for (const s of r)
        s._exitValue === null && n.add(this.currentRuntimeFlags, s);
  }
  /**
   * On the current thread, executes all messages in the fiber's inbox. This
   * method may return before all work is done, in the event the fiber executes
   * an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueOnCurrentThread() {
    let n = !0;
    for (; n; ) {
      let r = Qr;
      const s = globalThis[on];
      globalThis[on] = this;
      try {
        for (; r === Qr; )
          r = this._queue.length === 0 ? l1 : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
      } finally {
        this._running = !1, globalThis[on] = s;
      }
      this._queue.length > 0 && !this._running ? (this._running = !0, r === Cf ? (this.drainQueueLaterOnExecutor(), n = !1) : n = !0) : n = !1;
    }
  }
  /**
   * Schedules the execution of all messages in the fiber's inbox.
   *
   * This method will return immediately after the scheduling
   * operation is completed, but potentially before such messages have been
   * executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueLaterOnExecutor() {
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(Qs));
  }
  /**
   * Drains the fiber's message queue while the fiber is actively running,
   * returning the next effect to execute, which may be the input effect if no
   * additional effect needs to be executed.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  drainQueueWhileRunning(n, r) {
    let s = r;
    for (; this._queue.length > 0; ) {
      const o = this._queue.splice(0, 1)[0];
      s = h1[o._tag](this, n, s, o);
    }
    return s;
  }
  /**
   * Determines if the fiber is interrupted.
   *
   * **NOTE**: This method is safe to invoke on any fiber, but if not invoked
   * on this fiber, then values derived from the fiber's state (including the
   * log annotations and log level) may not be up-to-date.
   */
  isInterrupted() {
    return !gO(this.getFiberRef(ao));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(n) {
    const r = this.getFiberRef(ao);
    this.setFiberRef(ao, Fe(r, n));
  }
  /**
   * Processes a new incoming interrupt signal.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  processNewInterruptSignal(n) {
    this.addInterruptedCause(n), this.sendInterruptSignalToAllChildren();
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  sendInterruptSignalToAllChildren() {
    if (this._children === null || this._children.size === 0)
      return !1;
    let n = !1;
    for (const r of this._children)
      r.tell($i(ot(this.id()))), n = !0;
    return n;
  }
  /**
   * Interrupts all children of the current fiber, returning an effect that will
   * await the exit of the children. This method will return null if the fiber
   * has no children.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  interruptAllChildren() {
    if (this.sendInterruptSignalToAllChildren()) {
      const n = this._children.values();
      this._children = null;
      let r = !1;
      return Mu({
        while: () => !r,
        body: () => {
          const o = n.next();
          return o.done ? S(() => {
            r = !0;
          }) : rn(o.value.await);
        },
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(n) {
    if (Hl(this.currentRuntimeFlags)) {
      const r = this.getFiberRef(ca), s = this.id().startTimeMillis, o = Date.now();
      switch (u1.unsafeUpdate(o - s, r), Af.unsafeUpdate(-1, r), n._tag) {
        case Re: {
          i1.unsafeUpdate(1, r);
          break;
        }
        case Ie: {
          a1.unsafeUpdate(1, r);
          break;
        }
      }
    }
    if (n._tag === "Failure") {
      const r = this.getFiberRef(m$);
      !wu(n.cause) && r._tag === "Some" && this.log("Fiber terminated with an unhandled error", n.cause, r);
    }
  }
  setExitValue(n) {
    this._exitValue = n, this.reportExitValue(n);
    for (let r = this._observers.length - 1; r >= 0; r--)
      this._observers[r](n);
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(S1);
  }
  log(n, r, s) {
    const o = ne(s) ? s.value : this.getFiberRef(u$), c = this.getFiberRef(g1);
    if (ov(c, o))
      return;
    const a = this.getFiberRef(l$), u = this.getFiberRef(a$), l = this.getLoggers(), h = this.getFiberRefs();
    if (Wm(l) > 0) {
      const d = $m(this.getFiberRef(Zo), Xc), p = new Date(d.unsafeCurrentTimeMillis());
      A_(h, () => {
        for (const g of l)
          g.log({
            fiberId: this.id(),
            logLevel: o,
            message: n,
            cause: r,
            context: h,
            spans: a,
            annotations: u,
            date: p
          });
      });
    }
  }
  /**
   * Evaluates a single message on the current thread, while the fiber is
   * suspended. This method should only be called while evaluation of the
   * fiber's effect is suspended due to an asynchronous operation.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateMessageWhileSuspended(n) {
    switch (n._tag) {
      case tl:
        return Cf;
      case Zu:
        return this.processNewInterruptSignal(n.cause), this._asyncInterruptor !== null && (this._asyncInterruptor(Q(n.cause)), this._asyncInterruptor = null), Qr;
      case el:
        return this._asyncInterruptor = null, this._asyncBlockingOn = null, this.evaluateEffect(n.effect), Qr;
      case Xu:
        return n.onFiber(this, this._exitValue !== null ? Jv : Vv(this.currentRuntimeFlags, this._asyncBlockingOn)), Qr;
      default:
        return lo(n);
    }
  }
  /**
   * Evaluates an effect until completion, potentially asynchronously.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  evaluateEffect(n) {
    this.currentSupervisor.onResume(this);
    try {
      let r = Wt(this.currentRuntimeFlags) && this.isInterrupted() ? Q(this.getInterruptedCause()) : n;
      for (; r !== null; ) {
        const s = r, o = this.runLoop(s);
        if (o === Nt) {
          const c = At.currentOp;
          At.currentOp = null, c._op === So ? V0(this.currentRuntimeFlags) ? (this.tell(kE()), this.tell(Kn(lt)), r = null) : r = lt : c._op === as && (r = null);
        } else {
          this.currentRuntimeFlags = m(this.currentRuntimeFlags, z0(ra));
          const c = this.interruptAllChildren();
          c !== null ? r = _(c, () => o) : (this._queue.length === 0 ? this.setExitValue(o) : this.tell(Kn(o)), r = null);
        }
      }
    } finally {
      this.currentSupervisor.onSuspend(this);
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on the current
   * thread. This can be called to "kick off" execution of a fiber after it has
   * been created, in hopes that the effect can be executed synchronously.
   *
   * This is not the normal way of starting a fiber, but it is useful when the
   * express goal of executing the fiber is to synchronously produce its exit.
   */
  start(n) {
    if (this._running)
      this.tell(Kn(n));
    else {
      this._running = !0;
      const r = globalThis[on];
      globalThis[on] = this;
      try {
        this.evaluateEffect(n);
      } finally {
        this._running = !1, globalThis[on] = r, this._queue.length > 0 && this.drainQueueLaterOnExecutor();
      }
    }
  }
  /**
   * Begins execution of the effect associated with this fiber on in the
   * background, and on the correct thread pool. This can be called to "kick
   * off" execution of a fiber after it has been created, in hopes that the
   * effect can be executed synchronously.
   */
  startFork(n) {
    this.tell(Kn(n));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(n, r) {
    const s = tr(n, r);
    return globalThis[on] = this, this.currentRuntimeFlags = s, s;
  }
  /**
   * Initiates an asynchronous operation, by building a callback that will
   * resume execution, and then feeding that callback to the registration
   * function, handling error cases and repeated resumptions appropriately.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  initiateAsync(n, r) {
    let s = !1;
    const o = (c) => {
      s || (s = !0, this.tell(Kn(c)));
    };
    Wt(n) && (this._asyncInterruptor = o);
    try {
      r(o);
    } catch (c) {
      o(ke(Xe(c)));
    }
  }
  pushStack(n) {
    this._stack.push(n), n._op === "OnStep" && this._steps.push({
      refs: this.getFiberRefs(),
      flags: this.currentRuntimeFlags
    });
  }
  popStack() {
    const n = this._stack.pop();
    if (n)
      return n._op === "OnStep" && this._steps.pop(), n;
  }
  getNextSuccessCont() {
    let n = this.popStack();
    for (; n; ) {
      if (n._op !== _o)
        return n;
      n = this.popStack();
    }
  }
  getNextFailCont() {
    let n = this.popStack();
    for (; n; ) {
      if (n._op !== Ao && n._op !== Po && n._op !== us)
        return n;
      n = this.popStack();
    }
  }
  [(Gh = IE, Wh = FE, P_)](n) {
    return S(() => Tm(this.currentContext, n));
  }
  Left(n) {
    return le(n.left);
  }
  None(n) {
    return le(new Pu());
  }
  Right(n) {
    return X(n.right);
  }
  Some(n) {
    return X(n.value);
  }
  Micro(n) {
    return zo((r) => {
      let s = r;
      const o = bE(dE(n, this.currentContext));
      return o.addObserver((c) => {
        if (c._tag === "Success")
          return s(X(c.value));
        switch (c.cause._tag) {
          case "Interrupt":
            return s(Q(ot(pr)));
          case "Fail":
            return s(le(c.cause.error));
          case "Die":
            return s(Go(c.cause.defect));
        }
      }), zo((c) => {
        s = (a) => {
          c(me);
        }, o.unsafeInterrupt();
      });
    });
  }
  [md](n) {
    const r = Ce(() => n.effect_instruction_i0()), s = this.getNextSuccessCont();
    return s !== void 0 ? (s._op in Zr || lo(s), Zr[s._op](this, s, r)) : (At.currentOp = X(r), Nt);
  }
  [Re](n) {
    const r = n, s = this.getNextSuccessCont();
    return s !== void 0 ? (s._op in Zr || lo(s), Zr[s._op](this, s, r.effect_instruction_i0)) : (At.currentOp = r, Nt);
  }
  [Ie](n) {
    const r = n.effect_instruction_i0, s = this.getNextFailCont();
    if (s !== void 0)
      switch (s._op) {
        case _o:
        case Co:
          return Wt(this.currentRuntimeFlags) && this.isInterrupted() ? Q(Zl(r)) : Ce(() => s.effect_instruction_i1(r));
        case "OnStep":
          return Wt(this.currentRuntimeFlags) && this.isInterrupted() ? Q(Zl(r)) : X(Q(r));
        case Va:
          return this.patchRuntimeFlags(this.currentRuntimeFlags, s.patch), Wt(this.currentRuntimeFlags) && this.isInterrupted() ? Q(Fe(r, this.getInterruptedCause())) : Q(r);
        default:
          lo(s);
      }
    else
      return At.currentOp = Q(r), Nt;
  }
  [gd](n) {
    return Ce(() => n.effect_instruction_i0(this, Tp(this.currentRuntimeFlags)));
  }
  Blocked(n) {
    const r = this.getFiberRefs(), s = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const o = [], c = this._steps[this._steps.length - 1];
      let a = this.popStack();
      for (; a && a._op !== "OnStep"; )
        o.push(a), a = this.popStack();
      this.setFiberRefs(c.refs), this.currentRuntimeFlags = c.flags;
      const u = Es(c.refs, r), l = Sn(c.flags, s);
      return X(Eg(n.effect_instruction_i0, ee((h) => {
        for (; o.length > 0; )
          h.pushStack(o.pop());
        return h.setFiberRefs(Is(h.id(), h.getFiberRefs())(u)), h.currentRuntimeFlags = tr(l)(h.currentRuntimeFlags), n.effect_instruction_i1;
      })));
    }
    return dt((o) => _(ol(PO(n.effect_instruction_i0)), () => o(n.effect_instruction_i1)));
  }
  RunBlocked(n) {
    return d1(n.effect_instruction_i0);
  }
  [Rr](n) {
    const r = n.effect_instruction_i0, s = this.currentRuntimeFlags, o = tr(s, r);
    if (Wt(o) && this.isInterrupted())
      return Q(this.getInterruptedCause());
    if (this.patchRuntimeFlags(this.currentRuntimeFlags, r), n.effect_instruction_i1) {
      const c = Sn(o, s);
      return this.pushStack(new xO(c, n)), Ce(() => n.effect_instruction_i1(s));
    } else
      return lt;
  }
  [Ao](n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  OnStep(n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  [_o](n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  [Co](n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  [as](n) {
    return this._asyncBlockingOn = n.effect_instruction_i1, this.initiateAsync(this.currentRuntimeFlags, n.effect_instruction_i0), At.currentOp = n, Nt;
  }
  [So](n) {
    return this._isYielding = !1, At.currentOp = n, Nt;
  }
  [Po](n) {
    const r = n.effect_instruction_i0, s = n.effect_instruction_i1;
    return r() ? (this.pushStack(n), s()) : lt;
  }
  [us](n) {
    return Zr[us](this, n, void 0);
  }
  [Oc](n) {
    return Ce(() => n.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(n) {
    let r = n;
    for (this.currentOpCount = 0; ; ) {
      if ((this.currentRuntimeFlags & J0) !== 0 && this.currentSupervisor.onEffect(this, r), this._queue.length > 0 && (r = this.drainQueueWhileRunning(this.currentRuntimeFlags, r)), !this._isYielding) {
        this.currentOpCount += 1;
        const s = this.currentScheduler.shouldYield(this);
        if (s !== !1) {
          this._isYielding = !0, this.currentOpCount = 0;
          const o = r;
          r = _(Fu({
            priority: s
          }), () => o);
        }
      }
      try {
        if (r = this.currentTracer.context(() => m1 !== r[$r]._V ? oa(`Cannot execute an Effect versioned ${r[$r]._V} with a Runtime of version ${Sc()}`) : this[r._op](r), this), r === Nt) {
          const s = At.currentOp;
          return s._op === So || s._op === as ? Nt : (At.currentOp = null, s._op === Re || s._op === Ie ? s : Q(Xe(s)));
        }
      } catch (s) {
        r !== Nt && !M(r, "_op") || !(r._op in this) ? r = oa(`Not a valid effect: ${sr(r)}`) : y$(s) ? r = Q(Fe(Xe(s), ot(pr))) : r = Go(s);
      }
    }
  }
}
const g1 = /* @__PURE__ */ z("effect/FiberRef/currentMinimumLogLevel", () => Ve(cv("Info"))), p1 = (e) => nl((t) => {
  const n = WT(t.context, Zo);
  $m(n, sp).unsafe.log(e.log(t));
}), y1 = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => p1(jE)), _1 = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => nl(({
  annotations: e,
  cause: t,
  context: n,
  fiberId: r,
  logLevel: s,
  message: o
}) => {
  const c = qs(vs(n, sn), cp);
  if (c._tag === "None" || c.value._tag === "ExternalSpan")
    return;
  const a = Tm(vs(n, Zo), Xc), u = {};
  for (const [l, h] of e)
    u[l] = h;
  u["effect.fiberId"] = Mk(r), u["effect.logLevel"] = s.label, t !== null && t._tag !== "Empty" && (u["effect.cause"] = Kr(t, {
    renderErrorCause: !0
  })), c.value.event(sr(Array.isArray(o) ? o[0] : o), a.unsafeCurrentTimeNanos(), u);
})), S1 = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => o$(gu(y1, _1))), b1 = /* @__PURE__ */ f((e) => Jt(e[0]), (e, t) => Gc(Ru(e, (n) => w1((r) => t(n, r))))), w1 = (e) => ee((t) => {
  const n = t.getFiberRefs(), r = t.currentRuntimeFlags;
  return _(ay, (s) => Yo(s, (o) => ee((c) => {
    const a = c.getFiberRefs(), u = c.currentRuntimeFlags, l = Es(a, n), h = Sn(u, r), d = Es(n, a);
    return c.setFiberRefs(Is(l, c.id(), n)), Rs(WO(e(o), h), S(() => {
      c.setFiberRefs(Is(d, c.id(), c.getFiberRefs()));
    }));
  })));
}), k1 = (e) => {
  if (Array.isArray(e) || Ua(e))
    return [e, b()];
  const t = Object.keys(e), n = t.length;
  return [t.map((r) => e[r]), O((r) => {
    const s = {};
    for (let o = 0; o < n; o++)
      s[t[o]] = r[o];
    return s;
  })];
}, O1 = (e, t, n) => {
  const r = [];
  for (const s of e)
    r.push(Tr(s));
  return _(Ir(r, D, {
    concurrency: n == null ? void 0 : n.concurrency,
    batching: n == null ? void 0 : n.batching,
    concurrentFinalizers: n == null ? void 0 : n.concurrentFinalizers
  }), (s) => {
    const o = b(), c = s.length, a = new Array(c), u = new Array(c);
    let l = !1;
    for (let h = 0; h < c; h++) {
      const d = s[h];
      d._tag === "Left" ? (a[h] = O(d.left), l = !0) : (u[h] = d.right, a[h] = o);
    }
    return l ? t._tag === "Some" ? le(t.value(a)) : le(a) : n != null && n.discard ? me : t._tag === "Some" ? T(t.value(u)) : T(u);
  });
}, $1 = (e, t, n) => {
  const r = [];
  for (const s of e)
    r.push(Tr(s));
  return n != null && n.discard ? Ir(r, D, {
    concurrency: n == null ? void 0 : n.concurrency,
    batching: n == null ? void 0 : n.batching,
    discard: !0,
    concurrentFinalizers: n == null ? void 0 : n.concurrentFinalizers
  }) : H(Ir(r, D, {
    concurrency: n == null ? void 0 : n.concurrency,
    batching: n == null ? void 0 : n.batching,
    concurrentFinalizers: n == null ? void 0 : n.concurrentFinalizers
  }), (s) => t._tag === "Some" ? t.value(s) : s);
}, sy = (e, t) => {
  const [n, r] = k1(e);
  return (t == null ? void 0 : t.mode) === "validate" ? O1(n, r, t) : (t == null ? void 0 : t.mode) === "either" ? $1(n, r, t) : (t == null ? void 0 : t.discard) !== !0 && r._tag === "Some" ? H(Ir(n, D, t), r.value) : Ir(n, D, t);
}, Ir = /* @__PURE__ */ f((e) => Ua(e[0]), (e, t, n) => ee((r) => {
  const s = (n == null ? void 0 : n.batching) === !0 || (n == null ? void 0 : n.batching) === "inherit" && r.getFiberRef(d$);
  return n != null && n.discard ? If(n.concurrency, () => Un(ga, n == null ? void 0 : n.concurrentFinalizers)((o) => s ? wn(e, (c, a) => o(t(c, a)), !0, !1, 1) : zc(e, (c, a) => o(t(c, a)))), () => Un(pa, n == null ? void 0 : n.concurrentFinalizers)((o) => wn(e, (c, a) => o(t(c, a)), s, !1)), (o) => Un(ya(o), n == null ? void 0 : n.concurrentFinalizers)((c) => wn(e, (a, u) => c(t(a, u)), s, !1, o))) : If(n == null ? void 0 : n.concurrency, () => Un(ga, n == null ? void 0 : n.concurrentFinalizers)((o) => s ? Ra(e, 1, (c, a) => o(t(c, a)), !0) : Lt(e, (c, a) => o(t(c, a)))), () => Un(pa, n == null ? void 0 : n.concurrentFinalizers)((o) => oy(e, (c, a) => o(t(c, a)), s)), (o) => Un(ya(o), n == null ? void 0 : n.concurrentFinalizers)((c) => Ra(e, o, (a, u) => c(t(a, u)), s)));
})), oy = (e, t, n) => Z(() => {
  const r = oe(e), s = new Array(r.length);
  return je(wn(r, (c, a) => _(t(c, a), (u) => S(() => s[a] = u)), n, !1), T(s));
}), wn = (e, t, n, r, s) => dt((o) => qO((c) => ee((a) => {
  let u = Array.from(e).reverse(), l = u.length;
  if (l === 0)
    return me;
  let h = 0, d = !1;
  const p = s ? Math.min(u.length, s) : u.length, g = /* @__PURE__ */ new Set(), y = new Array(), I = () => g.forEach((x) => {
    x.currentScheduler.scheduleTask(() => {
      x.unsafeInterruptAsFork(a.id());
    }, 0);
  }), w = new Array(), k = new Array(), q = new Array(), E = () => {
    const x = y.filter(({
      exit: W
    }) => W._tag === "Failure").sort((W, G) => W.index < G.index ? -1 : W.index === G.index ? 0 : 1).map(({
      exit: W
    }) => W);
    return x.length === 0 && x.push(lt), x;
  }, A = (x, W = !1) => {
    const G = Gc(c(x)), U = T1(G, a, a.currentRuntimeFlags, ri);
    return a.currentScheduler.scheduleTask(() => {
      W && U.unsafeInterruptAsFork(a.id()), U.resume(G);
    }, 0), U;
  }, P = () => {
    r || (l -= u.length, u = []), d = !0, I();
  }, F = n ? LO : Yt, K = A(vt((x) => {
    const W = (U, se) => {
      U._op === "Blocked" ? q.push(U) : (y.push({
        index: se,
        exit: U
      }), U._op === "Failure" && !d && P());
    }, G = () => {
      if (u.length > 0) {
        const U = u.pop();
        let se = h++;
        const qe = () => {
          const Oe = u.pop();
          return se = h++, _(Fu(), () => _(F(o(t(Oe, se))), Le));
        }, Le = (Oe) => u.length > 0 && (W(Oe, se), u.length > 0) ? qe() : T(Oe), Mt = _(F(o(t(U, se))), Le), Me = A(Mt);
        w.push(Me), g.add(Me), d && Me.currentScheduler.scheduleTask(() => {
          Me.unsafeInterruptAsFork(a.id());
        }, 0), Me.addObserver((Oe) => {
          let Ft;
          if (Oe._op === "Failure" ? Ft = Oe : Ft = Oe.effect_instruction_i0, k.push(Me), g.delete(Me), W(Ft, se), y.length === l)
            x(T(te(nr(E(), {
              parallel: !0
            }), () => lt)));
          else if (q.length + y.length === l) {
            const Jr = E(), i_ = q.map((Vr) => Vr.effect_instruction_i0).reduce(gg);
            x(T(Eg(i_, wn([te(nr(Jr, {
              parallel: !0
            }), () => lt), ...q.map((Vr) => Vr.effect_instruction_i1)], (Vr) => Vr, n, !0, s))));
          } else
            G();
        });
      }
    };
    for (let U = 0; U < p; U++)
      G();
  }));
  return rn(vr(Vc(o(cc(K))), Qc({
    onFailure: (x) => {
      P();
      const W = q.length + 1, G = Math.min(typeof s == "number" ? s : q.length, q.length), U = Array.from(q);
      return vt((se) => {
        let qe = 0, Le = 0;
        const Mt = (Oe, Ft) => (Jr) => {
          qe++, qe === W && se(X(Q(x))), U.length > 0 && Ft && Me();
        }, Me = () => {
          A(U.pop(), !0).addObserver(Mt(Le, !0)), Le++;
        };
        K.addObserver(Mt(Le, !1)), Le++;
        for (let Oe = 0; Oe < G; Oe++)
          Me();
      });
    },
    onSuccess: () => Lt(k, (x) => x.inheritAll)
  })));
}))), Ra = (e, t, n, r) => Z(() => {
  const s = oe(e), o = new Array(s.length);
  return je(wn(s, (a, u) => H(n(a, u), (l) => o[u] = l), r, !1, t), T(o));
}), ol = (e) => v1(e, ri), cy = (e, t, n, r = null) => {
  const s = lc(e, t, n, r);
  return s.resume(e), s;
}, T1 = (e, t, n, r = null) => lc(e, t, n, r), lc = (e, t, n, r = null) => {
  const s = Zm(), o = t.getFiberRefs(), c = JT(o, s), a = new ry(s, c, n), u = vs(c, sn), l = a.currentSupervisor;
  return l.onStart(u, e, O(t), a), a.addObserver((d) => l.onEnd(d, a)), (r !== null ? r : m(t.getFiberRef(ia), te(() => t.scope()))).add(n, a), a;
}, v1 = (e, t) => ee((n, r) => T(cy(e, n, r.runtimeFlags, t))), Pf = (e) => Dr((t) => be(qs(t, xn), {
  onNone: () => e,
  onSome: (n) => {
    switch (n.strategy._tag) {
      case "Parallel":
        return e;
      case "Sequential":
      case "ParallelN":
        return _(Yc(n, pa), (r) => no(e, r));
    }
  }
})), xf = (e) => (t) => Dr((n) => be(qs(n, xn), {
  onNone: () => t,
  onSome: (r) => r.strategy._tag === "ParallelN" && r.strategy.parallelism === e ? t : _(Yc(r, ya(e)), (s) => no(t, s))
})), Un = (e, t) => (n) => Dr((r) => be(qs(r, xn), {
  onNone: () => n(D),
  onSome: (s) => {
    if (t === !0) {
      const o = e._tag === "Parallel" ? Pf : e._tag === "Sequential" ? Lf : xf(e.parallelism);
      switch (s.strategy._tag) {
        case "Parallel":
          return o(n(Pf));
        case "Sequential":
          return o(n(Lf));
        case "ParallelN":
          return o(n(xf(s.strategy.parallelism)));
      }
    } else
      return n(D);
  }
})), E1 = (e) => _(xn, e), iy = (e) => _(cl(), (t) => vr(e(t), (n) => t.close(n))), Lf = (e) => Dr((t) => be(qs(t, xn), {
  onNone: () => e,
  onSome: (n) => {
    switch (n.strategy._tag) {
      case "Sequential":
        return e;
      case "Parallel":
      case "ParallelN":
        return _(Yc(n, ga), (r) => no(e, r));
    }
  }
})), I1 = /* @__PURE__ */ f((e) => Jt(e[1]), (e, t, n) => to(e, t, (r, s) => [r, s], n)), R1 = /* @__PURE__ */ f((e) => Jt(e[1]), (e, t, n) => (n == null ? void 0 : n.concurrent) !== !0 && ((n == null ? void 0 : n.batching) === void 0 || n.batching === !1) ? Nu(e, t) : to(e, t, (r, s) => r, n)), M1 = /* @__PURE__ */ f((e) => Jt(e[1]), (e, t, n) => (n == null ? void 0 : n.concurrent) !== !0 && ((n == null ? void 0 : n.batching) === void 0 || n.batching === !1) ? je(e, t) : to(e, t, (r, s) => s, n)), to = /* @__PURE__ */ f((e) => Jt(e[1]), (e, t, n, r) => H(sy([e, t], {
  concurrency: r != null && r.concurrent ? 2 : 1,
  batching: r == null ? void 0 : r.batching,
  concurrentFinalizers: r == null ? void 0 : r.concurrentFinalizers
}), ([s, o]) => n(s, o))), xn = /* @__PURE__ */ Cn("effect/Scope"), ay = xn, F1 = (e, t) => {
  e.state._tag === "Open" && e.state.finalizers.set({}, t);
}, N1 = {
  [rf]: rf,
  [sf]: sf,
  pipe() {
    return v(this, arguments);
  },
  fork(e) {
    return S(() => {
      const t = uy(e);
      if (this.state._tag === "Closed")
        return t.state = this.state, t;
      const n = {}, r = (s) => t.close(s);
      return this.state.finalizers.set(n, r), F1(t, (s) => S(() => {
        this.state._tag === "Open" && this.state.finalizers.delete(n);
      })), t;
    });
  },
  close(e) {
    return Z(() => {
      if (this.state._tag === "Closed")
        return me;
      const t = Array.from(this.state.finalizers.values()).reverse();
      return this.state = {
        _tag: "Closed",
        exit: e
      }, t.length === 0 ? me : Cv(this.strategy) ? m(Lt(t, (n) => Yt(n(e))), _((n) => m(nr(n), ls(wi), te(() => lt)))) : Pv(this.strategy) ? m(oy(t, (n) => Yt(n(e)), !1), _((n) => m(nr(n, {
        parallel: !0
      }), ls(wi), te(() => lt)))) : m(Ra(t, this.strategy.parallelism, (n) => Yt(n(e)), !1), _((n) => m(nr(n, {
        parallel: !0
      }), ls(wi), te(() => lt))));
    });
  },
  addFinalizer(e) {
    return Z(() => this.state._tag === "Closed" ? e(this.state.exit) : (this.state.finalizers.set({}, e), me));
  }
}, uy = (e = ei) => {
  const t = Object.create(N1);
  return t.strategy = e, t.state = {
    _tag: "Open",
    finalizers: /* @__PURE__ */ new Map()
  }, t;
}, cl = (e = ei) => S(() => uy(e)), no = /* @__PURE__ */ f(2, (e, t) => A$(
  e,
  // @ts-expect-error
  Bs(lw(xn, t))
)), A1 = (e) => Ur(e, {
  differ: o1,
  fork: ms
}), jf = /* @__PURE__ */ i$(W0), C1 = /* @__PURE__ */ A1(ci), ly = /* @__PURE__ */ f(3, (e, t, n) => x1(e, t, {
  onSelfWin: (r, s) => _(r.await, (o) => {
    switch (o._tag) {
      case Re:
        return _(r.inheritAll, () => n.onSelfDone(o, s));
      case Ie:
        return n.onSelfDone(o, s);
    }
  }),
  onOtherWin: (r, s) => _(r.await, (o) => {
    switch (o._tag) {
      case Re:
        return _(r.inheritAll, () => n.onOtherDone(o, s));
      case Ie:
        return n.onOtherDone(o, s);
    }
  })
})), P1 = /* @__PURE__ */ f(2, (e, t) => Hs((n) => ly(e, t, {
  onSelfDone: (r, s) => la(r, {
    onFailure: (o) => m(cc(s), kf((c) => Mn(o, c))),
    onSuccess: (o) => m(s, Ho(n), De(o))
  }),
  onOtherDone: (r, s) => la(r, {
    onFailure: (o) => m(cc(s), kf((c) => Mn(c, o))),
    onSuccess: (o) => m(s, Ho(n), De(o))
  })
}))), x1 = /* @__PURE__ */ f(3, (e, t, n) => ee((r, s) => {
  const o = s.runtimeFlags, c = jc(!0), a = lc(e, r, o, n.selfScope), u = lc(t, r, o, n.otherScope);
  return vt((l) => {
    a.addObserver(() => Kf(a, u, n.onSelfWin, c, l)), u.addObserver(() => Kf(u, a, n.onOtherWin, c, l)), a.startFork(e), u.startFork(t);
  }, Rk(a.id(), u.id()));
})), Kf = (e, t, n, r, s) => {
  kk(!0, !1)(r) && s(n(e, t));
}, Rs = /* @__PURE__ */ f(2, (e, t) => dt((n) => tt(n(e), {
  onFailure: (r) => tt(t, {
    onFailure: (s) => ke(Fe(r, s)),
    onSuccess: () => ke(r)
  }),
  onSuccess: (r) => De(t, r)
}))), L1 = (e, t, n) => Hs((r) => _(_(ol(Eu(e)), (s) => vt((o) => {
  const c = t.map((l) => l.listeners.count), a = () => {
    c.every((l) => l === 0) && t.every((l) => l.result.state.current._tag === "Pending" ? !0 : !!(l.result.state.current._tag === "Done" && xu(l.result.state.current.effect) && l.result.state.current.effect._tag === "Failure" && wg(l.result.state.current.effect.cause))) && (u.forEach((l) => l()), n == null || n(), o(Ug(s)));
  };
  s.addObserver((l) => {
    u.forEach((h) => h()), o(l);
  });
  const u = t.map((l, h) => {
    const d = (p) => {
      c[h] = p, a();
    };
    return l.listeners.addObserver(d), () => l.listeners.removeObserver(d);
  });
  return a(), S(() => {
    u.forEach((l) => l());
  });
})), () => Z(() => {
  const s = t.flatMap((o) => o.state.completed ? [] : [o]);
  return zc(s, (o) => QI(o.request, w$(r)));
}))), jN = wr, KN = Xe, UN = ot, j1 = mO, DN = bg, qN = wg, BN = kg, JN = Og, VN = wO, K1 = Kr, U1 = "effect/ScheduleInterval", fc = /* @__PURE__ */ Symbol.for(U1), fy = {
  [fc]: fc,
  startMillis: 0,
  endMillis: 0
}, hy = (e, t) => e > t ? fy : {
  [fc]: fc,
  startMillis: e,
  endMillis: t
}, D1 = /* @__PURE__ */ f(2, (e, t) => q1(e, t) === e), q1 = /* @__PURE__ */ f(2, (e, t) => e.endMillis <= t.startMillis ? e : t.endMillis <= e.startMillis ? t : e.startMillis < t.startMillis ? e : t.startMillis < e.startMillis ? t : e.endMillis <= t.endMillis ? e : t), B1 = (e) => e.startMillis >= e.endMillis, J1 = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.max(e.startMillis, t.startMillis), r = Math.min(e.endMillis, t.endMillis);
  return hy(n, r);
}), V1 = (e) => hy(e, Number.POSITIVE_INFINITY), dy = fy, z1 = D1, W1 = B1, G1 = J1, H1 = V1, Y1 = "effect/ScheduleIntervals", Uf = /* @__PURE__ */ Symbol.for(Y1), my = (e) => ({
  [Uf]: Uf,
  intervals: e
}), Q1 = /* @__PURE__ */ f(2, (e, t) => Z1(e.intervals, t.intervals, $t())), Z1 = (e, t, n) => {
  let r = e, s = t, o = n;
  for (; Dt(r) && Dt(s); ) {
    const c = m(kt(r), G1(kt(s))), a = W1(c) ? o : m(o, et(c));
    m(kt(r), z1(kt(s))) ? r = xt(r) : s = xt(s), o = a;
  }
  return my($n(o));
}, Ma = (e) => m(e.intervals, Mm, te(() => dy)).startMillis, X1 = (e) => m(e.intervals, Mm, te(() => dy)).endMillis, eR = /* @__PURE__ */ f(2, (e, t) => Ma(e) < Ma(t)), tR = (e) => Dt(e.intervals), nR = my, rR = Q1, sR = Ma, Df = X1, oR = eR, cR = tR, il = "Continue", gy = "Done", iR = (e) => ({
  _tag: il,
  intervals: e
}), aR = (e) => ({
  _tag: il,
  intervals: nR(Pe(e))
}), uR = {
  _tag: gy
}, lR = (e) => e._tag === il, fR = (e) => e._tag === gy, hR = iR, dR = aR, Ms = uR, qf = lR, hc = fR, zN = Vg, WN = Yo, mR = aa, GN = no, gR = Yc, HN = cl, pR = Wk, py = (e) => (t) => {
  const n = t === void 0 ? Object.create(Ks) : pR(t);
  return n._tag = e, n;
}, yR = () => new Proxy({}, {
  get(e, t, n) {
    return t === "$is" ? Ka : t === "$match" ? _R : py(t);
  }
});
function _R() {
  if (arguments.length === 1) {
    const n = arguments[0];
    return function(r) {
      return n[r._tag](r);
    };
  }
  const e = arguments[0];
  return arguments[1][e._tag](e);
}
const SR = /* @__PURE__ */ function() {
  const e = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  return class extends Cu {
    constructor(n) {
      super(n == null ? void 0 : n.message, n != null && n.cause ? {
        cause: n.cause
      } : void 0), n && (Object.assign(this, n), Object.defineProperty(this, e, {
        value: n,
        enumerable: !1
      }));
    }
    toJSON() {
      return {
        ...this[e],
        ...this
      };
    }
  };
}(), bR = (e) => {
  class t extends SR {
    constructor() {
      super(...arguments);
      i(this, "_tag", e);
    }
  }
  return t.prototype.name = e, t;
}, wR = "effect/Schedule", yy = /* @__PURE__ */ Symbol.for(wR), kR = (e) => M(e, yy), OR = "effect/ScheduleDriver", $R = /* @__PURE__ */ Symbol.for(OR), TR = {
  /* c8 ignore next */
  _Out: (e) => e,
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _R: (e) => e
}, vR = {
  /* c8 ignore next */
  _Out: (e) => e,
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _R: (e) => e
};
var Hh;
Hh = yy;
class ER {
  constructor(t, n) {
    i(this, "initial");
    i(this, "step");
    i(this, Hh, TR);
    this.initial = t, this.step = n;
  }
  pipe() {
    return v(this, arguments);
  }
}
var Yh;
Yh = $R;
class IR {
  constructor(t, n) {
    i(this, "schedule");
    i(this, "ref");
    i(this, Yh, vR);
    this.schedule = t, this.ref = n;
  }
  get state() {
    return H(bn(this.ref), (t) => t[1]);
  }
  get last() {
    return _(bn(this.ref), ([t, n]) => {
      switch (t._tag) {
        case "None":
          return Jc(() => new Pu());
        case "Some":
          return T(t.value);
      }
    });
  }
  get reset() {
    return ec(this.ref, [b(), this.schedule.initial]);
  }
  next(t) {
    return m(H(bn(this.ref), (n) => n[1]), _((n) => m(KT, _((r) => m(Z(() => this.schedule.step(r, t, n)), _(([s, o, c]) => {
      const a = ec(this.ref, [O(o), s]);
      if (hc(c))
        return je(a, le(b()));
      const u = sR(c.intervals) - r;
      return u <= 0 ? De(a, o) : m(a, je($v(qo(u))), De(o));
    }))))));
  }
}
const ro = (e, t) => new ER(e, t), RR = /* @__PURE__ */ f(2, (e, t) => al(e, (n, r) => S(() => t(n, r)))), al = /* @__PURE__ */ f(2, (e, t) => ro(e.initial, (n, r, s) => _(e.step(n, r, s), ([o, c, a]) => hc(a) ? T([o, c, Ms]) : H(t(r, c), (u) => u ? [o, c, a] : [o, c, Ms])))), MR = (e) => m(da([b(), e.initial]), H((t) => new IR(e, t))), FR = /* @__PURE__ */ f(2, (e, t) => NR(e, t, rR)), NR = /* @__PURE__ */ f(3, (e, t, n) => ro([e.initial, t.initial], (r, s, o) => m(Kg(e.step(r, s, o[0]), t.step(r, s, o[1]), (c, a) => [c, a]), _(([[c, a, u], [l, h, d]]) => qf(u) && qf(d) ? Fa(e, t, s, c, a, u.intervals, l, h, d.intervals, n) : T([[c, l], [a, h], Ms]))))), Fa = (e, t, n, r, s, o, c, a, u, l) => {
  const h = l(o, u);
  return cR(h) ? T([[r, c], [s, a], hR(h)]) : m(o, oR(u)) ? _(e.step(Df(o), n, r), ([d, p, g]) => hc(g) ? T([[d, c], [p, a], Ms]) : Fa(e, t, n, d, p, g.intervals, c, a, u, l)) : _(t.step(Df(u), n, c), ([d, p, g]) => hc(g) ? T([[r, d], [s, p], Ms]) : Fa(e, t, n, r, s, o, d, p, g.intervals, l));
}, AR = /* @__PURE__ */ f(2, (e, t) => CR(e, (n) => S(() => t(n)))), CR = /* @__PURE__ */ f(2, (e, t) => ro(e.initial, (n, r, s) => _(e.step(n, r, s), ([o, c, a]) => H(t(c), (u) => [o, u, a])))), PR = (e) => ro(e.initial, (t, n, r) => m(e.step(t, n, r), H(([s, o, c]) => [s, n, c]))), xR = (e) => UR(Sy, (t) => t < e), LR = (e, t) => ro(e, (n, r, s) => S(() => [t(s), s, dR(H1(n))])), jR = /* @__PURE__ */ f(2, (e, t) => al(e, (n, r) => bv(t(n)))), KR = /* @__PURE__ */ f(2, (e, t) => al(e, (n, r) => t(n))), UR = /* @__PURE__ */ f(2, (e, t) => RR(e, (n, r) => t(r))), Eo = /* @__PURE__ */ Symbol.for("effect/Schedule/ScheduleDefect");
var Qh;
Qh = Eo;
class DR {
  constructor(t) {
    i(this, "error");
    i(this, Qh);
    this.error = t, this[Eo] = Eo;
  }
}
const qR = (e) => M(e, Eo), Bf = (e) => Wo(e, (t) => Go(new DR(t))), BR = (e) => Ag(e, (t) => be(ku(t, (n) => bg(n) && qR(n.defect) ? O(n.defect) : b()), {
  onNone: () => ke(t),
  onSome: (n) => le(n.error)
})), Jf = /* @__PURE__ */ f(2, (e, t) => VR(e, t, (n, r) => le(n))), JR = /* @__PURE__ */ f(2, (e, t) => {
  if (kR(t))
    return Jf(e, t);
  const n = t.schedule ?? PR(Sy), r = t.while ? KR(n, (c) => {
    const a = t.while(c);
    return typeof a == "boolean" ? T(a) : Bf(a);
  }) : n, s = t.until ? jR(r, (c) => {
    const a = t.until(c);
    return typeof a == "boolean" ? T(a) : Bf(a);
  }) : r, o = t.times ? FR(s, xR(t.times)).pipe(AR((c) => c[0])) : s;
  return BR(Jf(e, o));
}), VR = /* @__PURE__ */ f(3, (e, t, n) => _(MR(t), (r) => Xt(e, {
  onFailure: (s) => n(s, b()),
  onSuccess: (s) => _y(e, r, n, s)
}))), _y = (e, t, n, r) => Xt(t.next(r), {
  onFailure: () => UO(t.last),
  onSuccess: (s) => Xt(e, {
    onFailure: (o) => n(o, O(s)),
    onSuccess: (o) => _y(e, t, n, o)
  })
}), Sy = /* @__PURE__ */ LR(0, (e) => e + 1);
class zR {
  constructor(t) {
    i(this, "permits");
    i(this, "waiters", /* @__PURE__ */ new Set());
    i(this, "taken", 0);
    i(this, "take", (t) => Ng((n) => {
      if (this.free < t) {
        const r = () => {
          this.free < t || (this.waiters.delete(r), this.taken += t, n(T(t)));
        };
        return this.waiters.add(r), S(() => {
          this.waiters.delete(r);
        });
      }
      return this.taken += t, n(T(t));
    }));
    i(this, "updateTaken", (t) => ee((n) => (this.taken = t(this.taken), this.waiters.size > 0 && n.getFiberRef(Qu).scheduleTask(() => {
      const r = this.waiters.values();
      let s = r.next();
      for (; s.done === !1 && this.free > 0; )
        s.value(), s = r.next();
    }, n.getFiberRef(Qs)), T(this.free))));
    i(this, "release", (t) => this.updateTaken((n) => n - t));
    i(this, "releaseAll", /* @__PURE__ */ this.updateTaken((t) => 0));
    i(this, "withPermits", (t) => (n) => dt((r) => _(r(this.take(t)), (s) => Rs(r(n), this.release(s)))));
    i(this, "withPermitsIfAvailable", (t) => (n) => dt((r) => Z(() => this.free < t ? Tv : (this.taken += t, Rs(r(pv(n)), this.release(t))))));
    this.permits = t;
  }
  get free() {
    return this.permits - this.taken;
  }
}
const by = (e) => new zR(e), WR = (e) => S(() => by(e)), GR = /* @__PURE__ */ f(2, (e, t) => ee((n, r) => {
  const s = t, o = cy(e, n, r.runtimeFlags, ri);
  if (s.state._tag === "Open") {
    const c = () => Hs((u) => R(u, o.id()) ? me : rn(Ug(o))), a = {};
    s.state.finalizers.set(a, c), o.addObserver(() => {
      s.state._tag !== "Closed" && s.state.finalizers.delete(a);
    });
  } else
    o.unsafeInterruptAsFork(n.id());
  return T(o);
})), HR = "effect/Ref/SynchronizedRef", YR = /* @__PURE__ */ Symbol.for(HR), QR = {
  /* c8 ignore next */
  _A: (e) => e
};
var Zh, Xh, ed, td;
class ZR extends (td = Bu, ed = YR, Xh = fp, Zh = Xo, td) {
  constructor(n, r) {
    super();
    i(this, "ref");
    i(this, "withLock");
    i(this, ed, QR);
    i(this, Xh, hp);
    i(this, Zh, Xo);
    i(this, "get");
    this.ref = n, this.withLock = r, this.get = bn(this.ref);
  }
  commit() {
    return this.get;
  }
  modify(n) {
    return this.modifyEffect((r) => T(n(r)));
  }
  modifyEffect(n) {
    return this.withLock(m(_(bn(this.ref), n), _(([r, s]) => De(ec(this.ref, s), r))));
  }
}
const XR = (e) => S(() => wy(e)), wy = (e) => {
  const t = dp(e), n = by(1);
  return new ZR(t, n.withPermits(1));
}, eM = /* @__PURE__ */ Symbol.for("effect/ManagedRuntime"), tM = "Fresh", nM = "Suspend", rM = "ZipWith", so = (e) => function() {
  if (arguments.length === 1) {
    const t = arguments[0];
    return (n, ...r) => e(t, n, ...r);
  }
  return e.apply(this, arguments);
}, ul = /* @__PURE__ */ so((e, t, n) => {
  const r = Zm(), s = [[sn, [[r, e.context]]]];
  n != null && n.scheduler && s.push([Qu, [[r, n.scheduler]]]);
  let o = GT(e.fiberRefs, {
    entries: s,
    forkAs: r
  });
  n != null && n.updateRefs && (o = n.updateRefs(o, r));
  const c = new ry(r, o, e.runtimeFlags);
  let a = t;
  n != null && n.scope && (a = _(gR(n.scope, ei), (l) => je(Vg(l, Hs((h) => R(h, c.id()) ? me : Ho(c, h))), vr(t, (h) => mR(l, h)))));
  const u = c.currentSupervisor;
  return u !== ci && (u.onStart(e.context, a, b(), c), c.addObserver((l) => u.onEnd(l, c))), ri.add(e.runtimeFlags, c), (n == null ? void 0 : n.immediate) === !1 ? c.resume(a) : c.start(a), c;
}), sM = /* @__PURE__ */ so((e, t) => {
  const n = aM(e)(t);
  if (n._tag === "Failure")
    throw ky(n.effect_instruction_i0);
  return n.effect_instruction_i0;
});
class oM extends Error {
  constructor(n) {
    super(`Fiber #${n.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`);
    i(this, "fiber");
    i(this, "_tag", "AsyncFiberException");
    this.fiber = n, this.name = this._tag, this.stack = this.message;
  }
}
const cM = (e) => {
  const t = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const n = new oM(e);
  return Error.stackTraceLimit = t, n;
}, Ti = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure"), fo = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var nd, rd;
class iM extends Error {
  constructor(n) {
    const r = Tg(n)[0];
    super((r == null ? void 0 : r.message) || "An error has occurred");
    i(this, rd);
    i(this, nd);
    this[Ti] = Ti, this[fo] = n, this.name = r ? `(FiberFailure) ${r.name}` : "FiberFailure", r != null && r.stack && (this.stack = r.stack);
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[fo].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + Kr(this[fo], {
      renderErrorCause: !0
    });
  }
  [(rd = Ti, nd = fo, re)]() {
    return this.toString();
  }
}
const ky = (e) => {
  const t = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const n = new iM(e);
  return Error.stackTraceLimit = t, n;
}, Oy = (e) => {
  const t = e;
  switch (t._op) {
    case "Failure":
    case "Success":
      return t;
    case "Left":
      return ua(t.left);
    case "Right":
      return X(t.right);
    case "Some":
      return X(t.value);
    case "None":
      return ua(Pu());
  }
}, aM = /* @__PURE__ */ so((e, t) => {
  const n = Oy(t);
  if (n)
    return n;
  const r = new Pp(), s = ul(e)(t, {
    scheduler: r
  });
  r.flush();
  const o = s.unsafePoll();
  return o || Hn(Tu(cM(s), Du(s)));
}), uM = /* @__PURE__ */ so((e, t, n) => lM(e, t, n).then((r) => {
  switch (r._tag) {
    case Re:
      return r.effect_instruction_i0;
    case Ie:
      throw ky(r.effect_instruction_i0);
  }
})), lM = /* @__PURE__ */ so((e, t, n) => new Promise((r) => {
  const s = Oy(t);
  s && r(s);
  const o = ul(e)(t);
  o.addObserver((c) => {
    r(c);
  }), (n == null ? void 0 : n.signal) !== void 0 && (n.signal.aborted ? o.unsafeInterruptAsFork(o.id()) : n.signal.addEventListener("abort", () => {
    o.unsafeInterruptAsFork(o.id());
  }, {
    once: !0
  }));
}));
class $y {
  constructor(t, n, r) {
    i(this, "context");
    i(this, "runtimeFlags");
    i(this, "fiberRefs");
    this.context = t, this.runtimeFlags = n, this.fiberRefs = r;
  }
  pipe() {
    return v(this, arguments);
  }
}
const fM = (e) => new $y(e.context, e.runtimeFlags, e.fiberRefs), hM = () => ee((e, t) => T(new $y(e.getFiberRef(sn), t.runtimeFlags, e.getFiberRefs()))), dM = /* @__PURE__ */ dg(Pr, fg, lg), Fs = /* @__PURE__ */ fM({
  context: /* @__PURE__ */ ou(),
  runtimeFlags: dM,
  fiberRefs: /* @__PURE__ */ HT()
}), mM = /* @__PURE__ */ ul(Fs), gM = /* @__PURE__ */ uM(Fs), pM = /* @__PURE__ */ sM(Fs), yM = /* @__PURE__ */ f(2, (e, t) => e.modifyEffect(t)), _M = "effect/Layer", Ty = /* @__PURE__ */ Symbol.for(_M), SM = {
  /* c8 ignore next */
  _RIn: (e) => e,
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _ROut: (e) => e
}, vy = {
  [Ty]: SM,
  pipe() {
    return v(this, arguments);
  }
}, bM = "effect/Layer/MemoMap", vi = /* @__PURE__ */ Symbol.for(bM), wM = /* @__PURE__ */ cu()("effect/Layer/CurrentMemoMap", {
  defaultValue: () => TM()
}), kM = (e) => M(e, Ty), OM = (e) => e._op_layer === tM;
var sd;
sd = vi;
class Ey {
  constructor(t) {
    i(this, "ref");
    i(this, sd);
    this.ref = t, this[vi] = vi;
  }
  /**
   * Checks the memo map to see if a layer exists. If it is, immediately
   * returns it. Otherwise, obtains the layer, stores it in the memo map,
   * and adds a finalizer to the `Scope`.
   */
  getOrElseMemoize(t, n) {
    return m(yM(this.ref, (r) => {
      const s = r.get(t);
      if (s !== void 0) {
        const [o, c] = s, a = m(o, _(([u, l]) => m(wv(u), De(l))), vr(Qc({
          onFailure: () => me,
          onSuccess: () => Yo(n, c)
        })));
        return T([a, r]);
      }
      return m(da(0), _((o) => m(T$(), _((c) => m(da(() => me), H((a) => {
        const u = dt((h) => m(cl(), _((d) => m(h(_(Ry(t, d, !0), (p) => yv(p(this)))), Yt, _((p) => {
          switch (p._tag) {
            case Ie:
              return m(I$(c, p.effect_instruction_i0), je(aa(d, p)), je(ke(p.effect_instruction_i0)));
            case Re:
              return m(ec(a, (g) => m(aa(d, g), JO(fv(o, (y) => [y === 1, y - 1])), rn)), je(wf(o, (g) => g + 1)), je(Yo(n, (g) => m(S(() => r.delete(t)), je(bn(a)), _((y) => y(g))))), je(R$(c, p.effect_instruction_i0)), De(p.effect_instruction_i0[1]));
          }
        }))))), l = [m(ju(c), vr(la({
          onFailure: () => me,
          onSuccess: () => wf(o, (h) => h + 1)
        }))), (h) => m(bn(a), _((d) => d(h)))];
        return [u, OM(t) ? r : r.set(t, l)];
      }))))));
    }), Vc);
  }
}
const $M = /* @__PURE__ */ Z(() => H(XR(/* @__PURE__ */ new Map()), (e) => new Ey(e))), TM = () => new Ey(wy(/* @__PURE__ */ new Map())), Iy = /* @__PURE__ */ f(2, (e, t) => _($M, (n) => vM(e, n, t))), vM = /* @__PURE__ */ f(3, (e, t, n) => _(Ry(e, n), (r) => Ov(r(t), wM, t))), Ry = (e, t, n = !1) => {
  const r = e;
  switch (r._op_layer) {
    case "Locally":
      return S(() => (s) => r.f(s.getOrElseMemoize(r.self, t)));
    case "ExtendScope":
      return S(() => (s) => E1((o) => s.getOrElseMemoize(r.layer, o)));
    case "Fold":
      return S(() => (s) => m(s.getOrElseMemoize(r.layer, t), tt({
        onFailure: (o) => s.getOrElseMemoize(r.failureK(o), t),
        onSuccess: (o) => s.getOrElseMemoize(r.successK(o), t)
      })));
    case "Fresh":
      return S(() => (s) => m(r.layer, Iy(t)));
    case "FromEffect":
      return S(n ? () => (s) => r.effect : () => (s) => s.getOrElseMemoize(e, t));
    case "Provide":
      return S(() => (s) => m(s.getOrElseMemoize(r.first, t), _((o) => m(s.getOrElseMemoize(r.second, t), Ku(o)))));
    case "Scoped":
      return S(n ? () => (s) => no(r.effect, t) : () => (s) => s.getOrElseMemoize(e, t));
    case "Suspend":
      return S(() => (s) => s.getOrElseMemoize(r.evaluate(), t));
    case "ProvideMerge":
      return S(() => (s) => m(s.getOrElseMemoize(r.first, t), Kg(s.getOrElseMemoize(r.second, t), r.zipK)));
    case "ZipWith":
      return S(() => (s) => m(s.getOrElseMemoize(r.first, t), to(s.getOrElseMemoize(r.second, t), r.zipK, {
        concurrent: !0
      })));
  }
}, EM = /* @__PURE__ */ f(2, (e, t) => MM(e, t, (n, r) => Bs(n, r))), IM = (...e) => {
  let t = e[0];
  for (let n = 1; n < e.length; n++)
    t = EM(t, e[n]);
  return t;
}, RM = (e) => {
  const t = Object.create(vy);
  return t._op_layer = nM, t.evaluate = e, t;
}, MM = /* @__PURE__ */ f(3, (e, t, n) => RM(() => {
  const r = Object.create(vy);
  return r._op_layer = rM, r.first = e, r.second = t, r.zipK = n, r;
})), Vf = /* @__PURE__ */ f(2, (e, t) => iy((n) => _(Iy(t, n), (r) => Uu(e, r)))), zf = /* @__PURE__ */ f(2, (e, t) => {
  const n = Es(Fs.fiberRefs, t.fiberRefs), r = Sn(Fs.runtimeFlags, t.runtimeFlags);
  return dt((s) => ee((o) => {
    const c = o.getFiberRef(sn), a = o.getFiberRefs(), u = Is(o.id(), a)(n), l = o.currentRuntimeFlags, h = tr(r)(l), d = Es(u, a), p = Sn(h, l);
    return o.setFiberRefs(u), o.currentRuntimeFlags = h, Rs(Uu(s(e), Bs(c, t.context)), ee((g) => (g.setFiberRefs(Is(g.id(), g.getFiberRefs())(d)), g.currentRuntimeFlags = tr(p)(g.currentRuntimeFlags), me)));
  }));
}), FM = /* @__PURE__ */ f(2, (e, t) => Array.isArray(t) ? Vf(e, IM(...t)) : kM(t) ? Vf(e, t) : uw(t) ? Uu(e, t) : eM in t ? _(t.runtimeEffect, (n) => zf(e, n)) : zf(e, t)), NM = Jt, QN = sy, Io = Ir, ZN = ee, XN = le, eA = ke, tA = oa, nA = zO, rA = kv, sA = T, ho = Z, oA = S, ze = me, AM = Wo, cA = Ag, iA = Sv, aA = Iv, uA = jO, lA = Eu, fA = Gc, hA = dt, dA = De, mA = rn, Na = H, CM = Iu, PM = Wc, gA = b1, pA = Mg, yA = Rs, _A = ay, SA = iy, bA = Hs, wA = ol, kA = GR, OA = FM, Dn = Tr, $A = Yt, TA = KO, vA = Mv, pt = _, EA = Vc, IA = P1, RA = ly, MA = Ru, FA = Ev, NA = JR, AA = kp, CA = Pg, PA = tt, xA = hM, LA = WR, xM = mM, jA = gM, LM = pM, KA = I1, UA = R1, DA = M1, qA = to, jM = /* @__PURE__ */ Symbol.for("@effect/matcher/Matcher"), KM = {
  [jM]: {
    _input: D,
    _filters: D,
    _result: D,
    _return: D
  },
  _tag: "ValueMatcher",
  add(e) {
    return this.value._tag === "Right" ? this : e._tag === "When" && e.guard(this.provided) === !0 ? Aa(this.provided, L(e.evaluate(this.provided))) : e._tag === "Not" && e.guard(this.provided) === !1 ? Aa(this.provided, L(e.evaluate(this.provided))) : this;
  },
  pipe() {
    return v(this, arguments);
  }
};
function Aa(e, t) {
  const n = Object.create(KM);
  return n.provided = e, n.value = t, n;
}
const UM = (e, t) => ({
  _tag: "When",
  guard: e,
  evaluate: t
}), Ca = (e) => {
  if (typeof e == "function")
    return e;
  if (Array.isArray(e)) {
    const t = e.map(Ca), n = t.length;
    return (r) => {
      if (!Array.isArray(r))
        return !1;
      for (let s = 0; s < n; s++)
        if (t[s](r[s]) === !1)
          return !1;
      return !0;
    };
  } else if (e !== null && typeof e == "object") {
    const t = Object.entries(e).map(([r, s]) => [r, Ca(s)]), n = t.length;
    return (r) => {
      if (typeof r != "object" || r === null)
        return !1;
      for (let s = 0; s < n; s++) {
        const [o, c] = t[s];
        if (!(o in r) || c(r[o]) === !1)
          return !1;
      }
      return !0;
    };
  }
  return (t) => t === e;
}, DM = (e) => Aa(e, N(e)), qM = (e, t) => (n) => n.add(UM(Ca(e), t)), BM = (e) => e != null, JM = (e) => (t) => {
  const n = VM(t);
  return Od(n) ? n._tag === "Right" ? n.right : e(n.left) : (r) => {
    const s = n(r);
    return s._tag === "Right" ? s.right : e(s.left);
  };
}, VM = (e) => {
  if (e._tag === "ValueMatcher")
    return e.value;
  const t = e.cases.length;
  if (t === 1) {
    const n = e.cases[0];
    return (r) => n._tag === "When" && n.guard(r) === !0 || n._tag === "Not" && n.guard(r) === !1 ? L(n.evaluate(r)) : N(r);
  }
  return (n) => {
    for (let r = 0; r < t; r++) {
      const s = e.cases[r];
      if (s._tag === "When" && s.guard(n) === !0)
        return L(s.evaluate(n));
      if (s._tag === "Not" && s.guard(n) === !1)
        return L(s.evaluate(n));
    }
    return N(n);
  };
}, zM = DM, Vt = qM, mo = BM, WM = JM;
class ve {
  constructor(t, n, r) {
    i(this, "path");
    i(this, "actual");
    i(this, "issue");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Pointer");
    this.path = t, this.actual = n, this.issue = r;
  }
}
class Wf {
  constructor(t, n) {
    i(this, "actual");
    i(this, "message");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Unexpected");
    this.actual = t, this.message = n;
  }
}
class Xr {
  constructor(t, n) {
    i(this, "ast");
    i(this, "message");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Missing");
    /**
     * @since 3.10.0
     */
    i(this, "actual");
    this.ast = t, this.message = n;
  }
}
class ae {
  constructor(t, n, r, s) {
    i(this, "ast");
    i(this, "actual");
    i(this, "issues");
    i(this, "output");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Composite");
    this.ast = t, this.actual = n, this.issues = r, this.output = s;
  }
}
class Ei {
  constructor(t, n, r, s) {
    i(this, "ast");
    i(this, "actual");
    i(this, "kind");
    i(this, "issue");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Refinement");
    this.ast = t, this.actual = n, this.kind = r, this.issue = s;
  }
}
class Ii {
  constructor(t, n, r, s) {
    i(this, "ast");
    i(this, "actual");
    i(this, "kind");
    i(this, "issue");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Transformation");
    this.ast = t, this.actual = n, this.kind = r, this.issue = s;
  }
}
class ct {
  constructor(t, n, r) {
    i(this, "ast");
    i(this, "actual");
    i(this, "message");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Type");
    this.ast = t, this.actual = n, this.message = r;
  }
}
class Gf {
  constructor(t, n, r) {
    i(this, "ast");
    i(this, "actual");
    i(this, "message");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "Forbidden");
    this.ast = t, this.actual = n, this.message = r;
  }
}
const Hf = /* @__PURE__ */ Symbol.for("effect/Schema/ParseErrorTypeId");
var od;
class GM extends (/* @__PURE__ */ bR("ParseError")) {
  constructor() {
    super(...arguments);
    /**
     * @since 3.10.0
     */
    i(this, od, Hf);
  }
  get message() {
    return this.toString();
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return Mo.formatIssueSync(this.issue);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _id: "ParseError",
      message: this.toString()
    };
  }
  /**
   * @since 3.10.0
   */
  [(od = Hf, re)]() {
    return this.toJSON();
  }
}
const My = (e) => new GM({
  issue: e
}), dc = L, Fy = N, Ae = Od, Gt = /* @__PURE__ */ f(2, (e, t) => Ae(e) ? Ha(e, {
  onLeft: N,
  onRight: t
}) : pt(e, t)), Ye = /* @__PURE__ */ f(2, (e, t) => Ae(e) ? eS(e, t) : Na(e, t)), Ro = /* @__PURE__ */ f(2, (e, t) => Ae(e) ? X_(e, t) : PM(e, t)), HM = /* @__PURE__ */ f(2, (e, t) => Ae(e) ? Z_(e, {
  onLeft: t.onFailure,
  onRight: t.onSuccess
}) : CM(e, t)), Ny = /* @__PURE__ */ f(2, (e, t) => Ae(e) ? Ha(e, {
  onLeft: t,
  onRight: L
}) : AM(e, t)), ii = (e, t) => t === void 0 || Ut(t) ? e : e === void 0 ? t : {
  ...e,
  ...t
}, Ay = (e, t, n) => {
  const r = $e(e, t);
  return (s, o) => r(s, ii(n, o));
}, Cy = (e, t, n) => {
  const r = Ay(e, t, n);
  return (s, o) => $d(r(s, o), My);
}, YM = (e, t, n) => {
  const r = Ay(e, t, n);
  return (s, o) => cS(r(s, o));
}, Py = (e, t, n) => {
  const r = $e(e, t);
  return (s, o) => r(s, {
    ...ii(n, o),
    isEffectAllowed: !0
  });
}, QM = (e, t) => Cy(e.ast, !0, t), ZM = (e, t) => YM(e.ast, !0, t), xy = (e, t) => Py(e.ast, !0, t), XM = (e, t) => Py(e.ast, !1, t), eF = QM, tF = ZM, Ly = (e, t) => Cy(ge(e.ast), !0, t), nF = (e, t) => {
  const n = $e(ge(e.ast), !0);
  return (r, s) => bt(n(r, {
    exact: !0,
    ...ii(t, s)
  }));
}, rF = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/ParseResult/decodeMemoMap"), () => /* @__PURE__ */ new WeakMap()), sF = /* @__PURE__ */ z(/* @__PURE__ */ Symbol.for("effect/ParseResult/encodeMemoMap"), () => /* @__PURE__ */ new WeakMap()), $e = (e, t) => {
  const n = t ? rF : sF, r = n.get(e);
  if (r)
    return r;
  const s = oF(e, t), o = fb(e), c = ne(o) ? (l, h) => s(l, ii(h, o.value)) : s, a = hb(e), u = t && ne(a) ? (l, h) => cs(Ny(c(l, h), a.value), e, l, h) : c;
  return n.set(e, u), u;
}, Ri = (e) => _t(ab(e)), Mi = (e) => _t(ub(e)), oF = (e, t) => {
  switch (e._tag) {
    case "Refinement":
      if (t) {
        const n = $e(e.from, !0);
        return (r, s) => {
          s = s ?? gi;
          const o = (s == null ? void 0 : s.errors) === "all", c = Gt(Ny(n(r, s), (a) => {
            const u = new Ei(e, r, "From", a);
            return o && mb(e) && Dy(a) ? be(e.filter(r, s, e), {
              onNone: () => N(u),
              onSome: (l) => N(new ae(e, r, [u, new Ei(e, r, "Predicate", l)]))
            }) : N(u);
          }), (a) => be(e.filter(a, s, e), {
            onNone: () => L(a),
            onSome: (u) => N(new Ei(e, r, "Predicate", u))
          }));
          return cs(c, e, r, s);
        };
      } else {
        const n = $e(ge(e), !0), r = $e(jy(e.from), !1);
        return (s, o) => cs(Gt(n(s, o), (c) => r(c, o)), e, s, o);
      }
    case "Transformation": {
      const n = aF(e.transformation, t), r = t ? $e(e.from, !0) : $e(e.to, !1), s = t ? $e(e.to, !0) : $e(e.from, !1);
      return (o, c) => cs(Gt(Ro(r(o, c), (a) => new Ii(e, o, t ? "Encoded" : "Type", a)), (a) => Gt(Ro(n(a, c ?? gi, e, o), (u) => new Ii(e, o, "Transformation", u)), (u) => Ro(s(u, c), (l) => new Ii(e, o, t ? "Type" : "Encoded", l)))), e, o, c);
    }
    case "Declaration": {
      const n = t ? e.decodeUnknown(...e.typeParameters) : e.encodeUnknown(...e.typeParameters);
      return (r, s) => cs(n(r, s ?? gi, e), e, r, s);
    }
    case "Literal":
      return Be(e, (n) => n === e.literal);
    case "UniqueSymbol":
      return Be(e, (n) => n === e.symbol);
    case "UndefinedKeyword":
      return Be(e, m_);
    case "NeverKeyword":
      return Be(e, p_);
    case "UnknownKeyword":
    case "AnyKeyword":
    case "VoidKeyword":
      return L;
    case "StringKeyword":
      return Be(e, Ue);
    case "NumberKeyword":
      return Be(e, Ut);
    case "BooleanKeyword":
      return Be(e, kn);
    case "BigIntKeyword":
      return Be(e, bc);
    case "SymbolKeyword":
      return Be(e, ps);
    case "ObjectKeyword":
      return Be(e, tn);
    case "Enums":
      return Be(e, (n) => e.enums.some(([r, s]) => s === n));
    case "TemplateLiteral": {
      const n = gm(e);
      return Be(e, (r) => Ue(r) && n.test(r));
    }
    case "TupleType": {
      const n = e.elements.map((l) => $e(l.type, t)), r = e.rest.map((l) => $e(l.type, t));
      let s = e.elements.filter((l) => !l.isOptional);
      e.rest.length > 0 && (s = s.concat(e.rest.slice(1)));
      const o = s.length, c = e.elements.length > 0 ? e.elements.map((l, h) => h).join(" | ") : "never", a = Ri(e), u = Mi(e);
      return (l, h) => {
        if (!rt(l))
          return N(new ct(e, l));
        const d = (h == null ? void 0 : h.errors) === "all", p = [];
        let g = 0;
        const y = [], I = l.length;
        for (let E = I; E <= o - 1; E++) {
          const A = new ve(E, l, new Xr(s[E - I]));
          if (d) {
            p.push([g++, A]);
            continue;
          } else
            return N(new ae(e, l, A, y));
        }
        if (e.rest.length === 0)
          for (let E = e.elements.length; E <= I - 1; E++) {
            const A = new ve(E, l, new Wf(l[E], `is unexpected, expected: ${c}`));
            if (d) {
              p.push([g++, A]);
              continue;
            } else
              return N(new ae(e, l, A, y));
          }
        let w = 0, k;
        for (; w < n.length; w++)
          if (I < w + 1) {
            if (e.elements[w].isOptional)
              continue;
          } else {
            const E = n[w], A = E(l[w], h);
            if (Ae(A)) {
              if (Te(A)) {
                const P = new ve(w, l, A.left);
                if (d) {
                  p.push([g++, P]);
                  continue;
                } else
                  return N(new ae(e, l, P, nt(y)));
              }
              y.push([g++, A.right]);
            } else {
              const P = g++, F = w;
              k || (k = []), k.push(({
                es: K,
                output: x
              }) => pt(Dn(A), (W) => {
                if (Te(W)) {
                  const G = new ve(F, l, W.left);
                  return d ? (K.push([P, G]), ze) : N(new ae(e, l, G, nt(x)));
                }
                return x.push([P, W.right]), ze;
              }));
            }
          }
        if (ce(r)) {
          const [E, ...A] = r;
          for (; w < I - A.length; w++) {
            const P = E(l[w], h);
            if (Ae(P))
              if (Te(P)) {
                const F = new ve(w, l, P.left);
                if (d) {
                  p.push([g++, F]);
                  continue;
                } else
                  return N(new ae(e, l, F, nt(y)));
              } else
                y.push([g++, P.right]);
            else {
              const F = g++, K = w;
              k || (k = []), k.push(({
                es: x,
                output: W
              }) => pt(Dn(P), (G) => {
                if (Te(G)) {
                  const U = new ve(K, l, G.left);
                  return d ? (x.push([F, U]), ze) : N(new ae(e, l, U, nt(W)));
                } else
                  return W.push([F, G.right]), ze;
              }));
            }
          }
          for (let P = 0; P < A.length; P++)
            if (w += P, !(I < w + 1)) {
              const F = A[P](l[w], h);
              if (Ae(F)) {
                if (Te(F)) {
                  const K = new ve(w, l, F.left);
                  if (d) {
                    p.push([g++, K]);
                    continue;
                  } else
                    return N(new ae(e, l, K, nt(y)));
                }
                y.push([g++, F.right]);
              } else {
                const K = g++, x = w;
                k || (k = []), k.push(({
                  es: W,
                  output: G
                }) => pt(Dn(F), (U) => {
                  if (Te(U)) {
                    const se = new ve(x, l, U.left);
                    return d ? (W.push([K, se]), ze) : N(new ae(e, l, se, nt(G)));
                  }
                  return G.push([K, U.right]), ze;
                }));
              }
            }
        }
        const q = ({
          es: E,
          output: A
        }) => fs(E) ? N(new ae(e, l, nt(E), nt(A))) : L(nt(A));
        if (k && k.length > 0) {
          const E = k;
          return ho(() => {
            const A = {
              es: ns(p),
              output: ns(y)
            };
            return pt(Io(E, (P) => P(A), {
              concurrency: a,
              batching: u,
              discard: !0
            }), () => q(A));
          });
        }
        return q({
          output: y,
          es: p
        });
      };
    }
    case "TypeLiteral": {
      if (e.propertySignatures.length === 0 && e.indexSignatures.length === 0)
        return Be(e, y_);
      const n = [], r = {}, s = [];
      for (const h of e.propertySignatures)
        n.push([$e(h.type, t), h]), r[h.name] = null, s.push(h.name);
      const o = e.indexSignatures.map((h) => [$e(h.parameter, t), $e(h.type, t), h.parameter]), c = Je.make(e.indexSignatures.map((h) => h.parameter).concat(s.map((h) => ps(h) ? new tm(h) : new ar(h)))), a = $e(c, t), u = Ri(e), l = Mi(e);
      return (h, d) => {
        if (!S_(h))
          return N(new ct(e, h));
        const p = (d == null ? void 0 : d.errors) === "all", g = [];
        let y = 0;
        const I = (d == null ? void 0 : d.onExcessProperty) === "error", w = (d == null ? void 0 : d.onExcessProperty) === "preserve", k = {};
        let q;
        if (I || w) {
          q = Zn(h);
          for (const F of q) {
            const K = a(F, d);
            if (Ae(K) && Te(K))
              if (I) {
                const x = new ve(F, h, new Wf(h[F], `is unexpected, expected: ${String(c)}`));
                if (p) {
                  g.push([y++, x]);
                  continue;
                } else
                  return N(new ae(e, h, x, k));
              } else
                k[F] = h[F];
          }
        }
        let E;
        const A = (d == null ? void 0 : d.exact) === !0;
        for (let F = 0; F < n.length; F++) {
          const K = n[F][1], x = K.name, W = Object.prototype.hasOwnProperty.call(h, x);
          if (!W) {
            if (K.isOptional)
              continue;
            if (A) {
              const se = new ve(x, h, new Xr(K));
              if (p) {
                g.push([y++, se]);
                continue;
              } else
                return N(new ae(e, h, se, k));
            }
          }
          const G = n[F][0], U = G(h[x], d);
          if (Ae(U)) {
            if (Te(U)) {
              const se = new ve(x, h, W ? U.left : new Xr(K));
              if (p) {
                g.push([y++, se]);
                continue;
              } else
                return N(new ae(e, h, se, k));
            }
            k[x] = U.right;
          } else {
            const se = y++, qe = x;
            E || (E = []), E.push(({
              es: Le,
              output: Mt
            }) => pt(Dn(U), (Me) => {
              if (Te(Me)) {
                const Oe = new ve(qe, h, W ? Me.left : new Xr(K));
                return p ? (Le.push([se, Oe]), ze) : N(new ae(e, h, Oe, Mt));
              }
              return Mt[qe] = Me.right, ze;
            }));
          }
        }
        for (let F = 0; F < o.length; F++) {
          const K = o[F], x = K[0], W = K[1], G = Ad(h, K[2]);
          for (const U of G) {
            const se = x(U, d);
            if (Ae(se) && bt(se)) {
              const qe = W(h[U], d);
              if (Ae(qe))
                if (Te(qe)) {
                  const Le = new ve(U, h, qe.left);
                  if (p) {
                    g.push([y++, Le]);
                    continue;
                  } else
                    return N(new ae(e, h, Le, k));
                } else
                  Object.prototype.hasOwnProperty.call(r, U) || (k[U] = qe.right);
              else {
                const Le = y++, Mt = U;
                E || (E = []), E.push(({
                  es: Me,
                  output: Oe
                }) => pt(Dn(qe), (Ft) => {
                  if (Te(Ft)) {
                    const Jr = new ve(Mt, h, Ft.left);
                    return p ? (Me.push([Le, Jr]), ze) : N(new ae(e, h, Jr, Oe));
                  } else
                    return Object.prototype.hasOwnProperty.call(r, U) || (Oe[U] = Ft.right), ze;
                }));
              }
            }
          }
        }
        const P = ({
          es: F,
          output: K
        }) => {
          if (fs(F))
            return N(new ae(e, h, nt(F), K));
          if ((d == null ? void 0 : d.propertyOrder) === "original") {
            const x = q || Zn(h);
            for (const G of s)
              x.indexOf(G) === -1 && x.push(G);
            const W = {};
            for (const G of x)
              Object.prototype.hasOwnProperty.call(K, G) && (W[G] = K[G]);
            return L(W);
          }
          return L(K);
        };
        if (E && E.length > 0) {
          const F = E;
          return ho(() => {
            const K = {
              es: ns(g),
              output: Object.assign({}, k)
            };
            return pt(Io(F, (x) => x(K), {
              concurrency: u,
              batching: l,
              discard: !0
            }), () => P(K));
          });
        }
        return P({
          es: g,
          output: k
        });
      };
    }
    case "Union": {
      const n = cF(e.types, t), r = Zn(n.keys), s = r.length, o = e.types.length, c = /* @__PURE__ */ new Map();
      for (let l = 0; l < o; l++)
        c.set(e.types[l], $e(e.types[l], t));
      const a = Ri(e) ?? 1, u = Mi(e);
      return (l, h) => {
        const d = [];
        let p = 0, g = [];
        if (s > 0)
          if (ja(l))
            for (let w = 0; w < s; w++) {
              const k = r[w], q = n.keys[k].buckets;
              if (Object.prototype.hasOwnProperty.call(l, k)) {
                const E = String(l[k]);
                if (Object.prototype.hasOwnProperty.call(q, E))
                  g = g.concat(q[E]);
                else {
                  const {
                    candidates: A,
                    literals: P
                  } = n.keys[k], F = Je.make(P), K = A.length === o ? new Ze([new ue(k, F, !1, !0)], []) : Je.make(A);
                  d.push([p++, new ae(K, l, new ve(k, l, new ct(F, l[k])))]);
                }
              } else {
                const {
                  candidates: E,
                  literals: A
                } = n.keys[k], P = new ue(k, Je.make(A), !1, !0), F = E.length === o ? new Ze([P], []) : Je.make(E);
                d.push([p++, new ae(F, l, new ve(k, l, new Xr(P)))]);
              }
            }
          else {
            const w = n.candidates.length === o ? e : Je.make(n.candidates);
            d.push([p++, new ct(w, l)]);
          }
        n.otherwise.length > 0 && (g = g.concat(n.otherwise));
        let y;
        for (let w = 0; w < g.length; w++) {
          const k = g[w], q = c.get(k)(l, h);
          if (Ae(q) && (!y || y.length === 0)) {
            if (bt(q))
              return q;
            d.push([p++, q.left]);
          } else {
            const E = p++;
            y || (y = []), y.push((A) => ho(() => "finalResult" in A ? ze : pt(Dn(q), (P) => (bt(P) ? A.finalResult = P : A.es.push([E, P.left]), ze))));
          }
        }
        const I = (w) => fs(w) ? w.length === 1 && w[0][1]._tag === "Type" ? N(w[0][1]) : N(new ae(e, l, nt(w))) : (
          // this should never happen
          N(new ct(e, l))
        );
        if (y && y.length > 0) {
          const w = y;
          return ho(() => {
            const k = {
              es: ns(d)
            };
            return pt(Io(w, (q) => q(k), {
              concurrency: a,
              batching: u,
              discard: !0
            }), () => "finalResult" in k ? k.finalResult : I(k.es));
          });
        }
        return I(d);
      };
    }
    case "Suspend": {
      const n = Cd(() => $e(lr(e.f(), e.annotations), t));
      return (r, s) => n()(r, s);
    }
  }
}, Be = (e, t) => (n) => t(n) ? L(n) : N(new ct(e, n)), os = (e, t) => {
  switch (e._tag) {
    case "Declaration": {
      const n = Nr(e);
      if (ne(n))
        return os(n.value, t);
      break;
    }
    case "TypeLiteral": {
      const n = [];
      for (let r = 0; r < e.propertySignatures.length; r++) {
        const s = e.propertySignatures[r], o = t ? Di(s.type) : ge(s.type);
        pn(o) && !s.isOptional && n.push([s.name, o]);
      }
      return n;
    }
    case "TupleType": {
      const n = [];
      for (let r = 0; r < e.elements.length; r++) {
        const s = e.elements[r], o = t ? Di(s.type) : ge(s.type);
        pn(o) && !s.isOptional && n.push([r, o]);
      }
      return n;
    }
    case "Refinement":
      return os(e.from, t);
    case "Suspend":
      return os(e.f(), t);
    case "Transformation":
      return os(t ? e.from : e.to, t);
  }
  return [];
}, cF = (e, t) => {
  const n = {}, r = [], s = [];
  for (let o = 0; o < e.length; o++) {
    const c = e[o], a = os(c, t);
    if (a.length > 0) {
      s.push(c);
      for (let u = 0; u < a.length; u++) {
        const [l, h] = a[u], d = String(h.literal);
        n[l] = n[l] || {
          buckets: {},
          literals: [],
          candidates: []
        };
        const p = n[l].buckets;
        if (Object.prototype.hasOwnProperty.call(p, d)) {
          if (u < a.length - 1)
            continue;
          p[d].push(c), n[l].literals.push(h), n[l].candidates.push(c);
        } else {
          p[d] = [c], n[l].literals.push(h), n[l].candidates.push(c);
          break;
        }
      }
    } else
      r.push(c);
  }
  return {
    keys: n,
    otherwise: r,
    candidates: s
  };
}, jy = (e) => Xn(e) ? jy(e.from) : e, cs = (e, t, n, r) => {
  if ((r == null ? void 0 : r.isEffectAllowed) === !0 || Ae(e))
    return e;
  const s = new Pp(), o = xM(e, {
    scheduler: s
  });
  s.flush();
  const c = o.unsafePoll();
  if (c) {
    if (C$(c))
      return L(c.value);
    const a = c.cause;
    return j1(a) ? N(a.error) : N(new Gf(t, n, K1(a)));
  }
  return N(new Gf(t, n, "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"));
}, iF = ([e], [t]) => e > t ? 1 : e < t ? -1 : 0;
function nt(e) {
  return e.sort(iF).map((t) => t[1]);
}
const aF = (e, t) => {
  switch (e._tag) {
    case "FinalTransformation":
      return t ? e.decode : e.encode;
    case "ComposeTransformation":
      return L;
    case "TypeLiteralTransformation":
      return (n) => {
        let r = L(n);
        for (const s of e.propertySignatureTransformations) {
          const [o, c] = t ? [s.from, s.to] : [s.to, s.from], a = t ? s.decode : s.encode;
          r = Ye(r, (l) => {
            const h = a(Object.prototype.hasOwnProperty.call(l, o) ? O(l[o]) : b());
            return delete l[o], ne(h) && (l[c] = h.value), l;
          });
        }
        return r;
      };
  }
}, Ne = (e, t = []) => ({
  value: e,
  forest: t
}), Mo = {
  formatIssue: (e) => Ye(zn(e), uF),
  formatIssueSync: (e) => {
    const t = Mo.formatIssue(e);
    return Ae(t) ? nS(t) : LM(t);
  },
  formatError: (e) => Mo.formatIssue(e.issue),
  formatErrorSync: (e) => Mo.formatIssueSync(e.issue)
}, uF = (e) => e.value + Ky(`
`, e.forest), Ky = (e, t) => {
  let n = "";
  const r = t.length;
  let s;
  for (let o = 0; o < r; o++) {
    s = t[o];
    const c = o === r - 1;
    n += e + (c ? "└" : "├") + "─ " + s.value, n += Ky(e + (r > 1 && !c ? "│  " : "   "), s.forest);
  }
  return n;
}, lF = (e) => {
  switch (e) {
    case "Encoded":
      return "Encoded side transformation failure";
    case "Transformation":
      return "Transformation process failure";
    case "Type":
      return "Type side transformation failure";
  }
}, fF = (e) => {
  switch (e) {
    case "From":
      return "From side refinement failure";
    case "Predicate":
      return "Predicate refinement failure";
  }
}, Uy = (e) => "ast" in e ? O(e.ast) : b(), Pa = /* @__PURE__ */ L(void 0), hF = (e) => Uy(e).pipe(Mr(cb), be({
  onNone: () => Pa,
  onSome: (t) => {
    const n = t(e);
    return Ue(n) ? L({
      message: n,
      override: !1
    }) : NM(n) ? Na(n, (r) => ({
      message: r,
      override: !1
    })) : Ue(n.message) ? L({
      message: n.message,
      override: n.override
    }) : Na(n.message, (r) => ({
      message: r,
      override: n.override
    }));
  }
})), ll = (e) => (t) => t._tag === e, Dy = /* @__PURE__ */ ll("Composite"), Yf = /* @__PURE__ */ ll("Refinement"), Qf = /* @__PURE__ */ ll("Transformation"), gs = (e) => Gt(hF(e), (t) => t !== void 0 ? !t.override && (Dy(e) || Yf(e) && e.kind === "From" || Qf(e) && e.kind !== "Transformation") ? Qf(e) || Yf(e) ? gs(e.issue) : Pa : L(t.message) : Pa), qy = (e) => Uy(e).pipe(Mr(lb), lS((t) => t(e)), _t);
function dF(e) {
  return Xd(e).pipe(jt(() => Qd(e)), jt(() => Zd(e)), jt(() => Ec(e)), te(() => `{ ${e.from} | filter }`));
}
function mF(e) {
  return e.message !== void 0 ? e.message : `Expected ${Xn(e.ast) ? dF(e.ast) : String(e.ast)}, actual ${Ot(e.actual)}`;
}
const gF = (e) => Ye(gs(e), (t) => t ?? qy(e) ?? mF(e)), go = (e) => qy(e) ?? String(e.ast), pF = (e) => e.message ?? "is forbidden", yF = (e) => e.message ?? "is unexpected", _F = (e) => {
  const t = ib(e.ast);
  if (ne(t)) {
    const n = t.value();
    return Ue(n) ? L(n) : n;
  }
  return L(e.message ?? "is missing");
}, zn = (e) => {
  switch (e._tag) {
    case "Type":
      return Ye(gF(e), Ne);
    case "Forbidden":
      return L(Ne(go(e), [Ne(pF(e))]));
    case "Unexpected":
      return L(Ne(yF(e)));
    case "Missing":
      return Ye(_F(e), Ne);
    case "Transformation":
      return Gt(gs(e), (t) => t !== void 0 ? L(Ne(t)) : Ye(zn(e.issue), (n) => Ne(go(e), [Ne(lF(e.kind), [n])])));
    case "Refinement":
      return Gt(gs(e), (t) => t !== void 0 ? L(Ne(t)) : Ye(zn(e.issue), (n) => Ne(go(e), [Ne(fF(e.kind), [n])])));
    case "Pointer":
      return Ye(zn(e.issue), (t) => Ne(xd(e.path), [t]));
    case "Composite":
      return Gt(gs(e), (t) => {
        if (t !== void 0)
          return L(Ne(t));
        const n = go(e);
        return Pd(e.issues) ? Ye(Io(e.issues, zn), (r) => Ne(n, r)) : Ye(zn(e.issues), (r) => Ne(n, [r]));
      });
  }
}, SF = /* @__PURE__ */ f((e) => tn(e[0]), (e, ...t) => {
  const n = {};
  for (const r of t)
    r in e && (n[r] = e[r]);
  return n;
}), bF = /* @__PURE__ */ f((e) => tn(e[0]), (e, ...t) => {
  const n = {
    ...e
  };
  for (const r of t)
    delete n[r];
  return n;
}), Ns = /* @__PURE__ */ Symbol.for("effect/Schema");
function Y(e) {
  var t, n, r;
  return n = Ns, t = Ns, r = class {
    constructor() {
      i(this, n, Zf);
    }
    static annotations(o) {
      return Y(mt(this.ast, o));
    }
    static pipe() {
      return v(this, arguments);
    }
    static toString() {
      return String(e);
    }
  }, i(r, "ast", e), i(r, "Type"), i(r, "Encoded"), i(r, "Context"), i(r, t, Zf), r;
}
const Zf = {
  /* c8 ignore next */
  _A: (e) => e,
  /* c8 ignore next */
  _I: (e) => e,
  /* c8 ignore next */
  _R: (e) => e
}, Xf = {
  schemaId: nb,
  message: jd,
  missingMessage: Xa,
  identifier: eu,
  title: Bt,
  description: Ds,
  examples: Kd,
  default: Ud,
  documentation: rb,
  jsonSchema: Dd,
  arbitrary: qd,
  pretty: Bd,
  equivalence: Jd,
  concurrency: Vd,
  batching: zd,
  parseIssueTitle: Wd,
  parseOptions: Gd,
  decodingFallback: Hd
}, Br = (e) => {
  if (!e)
    return {};
  const t = {
    ...e
  };
  for (const n in Xf)
    if (n in e) {
      const r = Xf[n];
      t[r] = e[n], delete t[n];
    }
  return t;
}, mt = (e, t) => lr(e, Br(t)), wF = (e) => String(e.ast), JA = (e) => Y(Di(e.ast)), He = (e) => Y(ge(e.ast)), kF = (e, t) => {
  const n = xy(e, t);
  return (r, s) => Ro(n(r, s), My);
}, VA = kF, ft = (e) => M(e, Ns) && tn(e[Ns]);
function OF(e) {
  return tu(e) ? Je.make(Pb(e, (t) => new ar(t))) : new ar(e[0]);
}
function By(e, t = OF(e)) {
  var n;
  return n = class extends Y(t) {
    static annotations(s) {
      return By(this.literals, mt(this.ast, s));
    }
  }, i(n, "literals", [...e]), n;
}
function fl(...e) {
  return ce(e) ? By(e) : zy;
}
const $F = (e) => Y(new tm(e)), WA = (...[e, ...t]) => {
  const n = [];
  let r = "", s = t;
  ft(e) ? pn(e.ast) ? r = String(e.ast.literal) : s = [e, ...s] : r = String(e);
  for (let o = 0; o < s.length; o++) {
    const c = s[o];
    if (ft(c)) {
      if (o < s.length - 1) {
        const a = s[o + 1];
        if (ft(a)) {
          if (pn(a.ast)) {
            n.push(new Gr(c.ast, String(a.ast.literal))), o++;
            continue;
          }
        } else {
          n.push(new Gr(c.ast, String(a))), o++;
          continue;
        }
      }
      n.push(new Gr(c.ast, ""));
    } else
      n.push(new Gr(new ar(c), ""));
  }
  return fs(n) ? Y(new Pl(r, n)) : Y(new Pl("", [new Gr(new ar(r), "")]));
}, TF = (e, t, n) => hl(e, new Ic(e.map((r) => r.ast), (...r) => t.decode(...r.map(Y)), (...r) => t.encode(...r.map(Y)), Br(n))), vF = (e, t) => {
  const n = () => (s, o, c) => e(s) ? dc(s) : Fy(new ct(c, s)), r = n;
  return hl([], new Ic([], n, r, Br(t)));
};
function hl(e, t) {
  var n;
  return n = class extends Y(t) {
    static annotations(s) {
      return hl(this.typeParameters, mt(this.ast, s));
    }
  }, i(n, "typeParameters", [...e]), n;
}
const EF = function() {
  if (Array.isArray(arguments[0])) {
    const n = arguments[0], r = arguments[1], s = arguments[2];
    return TF(n, r, s);
  }
  const e = arguments[0], t = arguments[1];
  return vF(e, t);
};
class Jy extends (/* @__PURE__ */ Y(Sb)) {
}
class Vy extends (/* @__PURE__ */ Y(yb)) {
}
class zy extends (/* @__PURE__ */ Y(nm)) {
}
class HA extends (/* @__PURE__ */ Y(rm)) {
}
class V extends (/* @__PURE__ */ Y(Li)) {
}
class dn extends (/* @__PURE__ */ Y(ji)) {
}
class Wy extends (/* @__PURE__ */ Y(Ki)) {
}
const IF = (e) => Je.make(e.map((t) => t.ast));
function Gy(e, t = IF(e)) {
  var n;
  return n = class extends Y(t) {
    static annotations(s) {
      return Gy(this.members, mt(this.ast, s));
    }
  }, i(n, "members", [...e]), n;
}
function ai(...e) {
  return tu(e) ? Gy(e) : ce(e) ? e[0] : zy;
}
const Fi = (e) => ai(e, Vy), po = (e) => ai(e, Jy), Ni = (e) => ai(e, Vy, Jy), RF = (e, t) => new Mc(e.map((n) => ft(n) ? new nn(n.ast, !1) : n.ast), t.map((n) => ft(n) ? new Rc(n.ast) : n.ast), !0);
function dl(e, t, n = RF(e, t)) {
  var r;
  return r = class extends Y(n) {
    static annotations(o) {
      return dl(this.elements, this.rest, mt(this.ast, o));
    }
  }, i(r, "elements", [...e]), i(r, "rest", [...t]), r;
}
function Hy(e, t) {
  var n;
  return n = class extends dl([], [e], t) {
    static annotations(s) {
      return Hy(this.value, mt(this.ast, s));
    }
  }, i(n, "value", e), n;
}
const it = (e) => Hy(e);
function Yy(e, t) {
  var n;
  return n = class extends dl([e], [e], t) {
    static annotations(s) {
      return Yy(this.value, mt(this.ast, s));
    }
  }, i(n, "value", e), n;
}
const MF = (e) => Yy(e), xa = (e) => e ? '"?:"' : '":"';
class As extends nn {
  constructor(n, r, s, o, c) {
    super(n, r, o);
    i(this, "isReadonly");
    i(this, "defaultValue");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "PropertySignatureDeclaration");
    this.isReadonly = s, this.defaultValue = c;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    const n = xa(this.isOptional), r = String(this.type);
    return `PropertySignature<${n}, ${r}, never, ${n}, ${r}>`;
  }
}
class ml extends nn {
  constructor(n, r, s, o, c) {
    super(n, r, o);
    i(this, "isReadonly");
    i(this, "fromKey");
    this.isReadonly = s, this.fromKey = c;
  }
}
class ui extends nn {
  constructor(n, r, s, o, c) {
    super(n, r, o);
    i(this, "isReadonly");
    i(this, "defaultValue");
    this.isReadonly = s, this.defaultValue = c;
  }
}
const FF = (e) => e === void 0 ? "never" : Ue(e) ? JSON.stringify(e) : String(e);
class li {
  constructor(t, n, r, s) {
    i(this, "from");
    i(this, "to");
    i(this, "decode");
    i(this, "encode");
    /**
     * @since 3.10.0
     */
    i(this, "_tag", "PropertySignatureTransformation");
    this.from = t, this.to = n, this.decode = r, this.encode = s;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return `PropertySignature<${xa(this.to.isOptional)}, ${this.to.type}, ${FF(this.from.fromKey)}, ${xa(this.from.isOptional)}, ${this.from.type}>`;
  }
}
const Qy = (e, t) => {
  switch (e._tag) {
    case "PropertySignatureDeclaration":
      return new As(e.type, e.isOptional, e.isReadonly, {
        ...e.annotations,
        ...t
      }, e.defaultValue);
    case "PropertySignatureTransformation":
      return new li(new ml(e.from.type, e.from.isOptional, e.from.isReadonly, e.from.annotations), new ui(e.to.type, e.to.isOptional, e.to.isReadonly, {
        ...e.to.annotations,
        ...t
      }, e.to.defaultValue), e.decode, e.encode);
  }
}, Zy = /* @__PURE__ */ Symbol.for("effect/PropertySignature"), Xy = (e) => M(e, Zy);
var cd, id;
id = Ns, cd = Zy;
const Sl = class Sl {
  constructor(t) {
    i(this, "ast");
    i(this, id);
    i(this, cd, null);
    i(this, "_TypeToken");
    i(this, "_Key");
    i(this, "_EncodedToken");
    i(this, "_HasDefault");
    this.ast = t;
  }
  pipe() {
    return v(this, arguments);
  }
  annotations(t) {
    return new Sl(Qy(this.ast, Br(t)));
  }
  toString() {
    return String(this.ast);
  }
};
let mc = Sl;
const gc = (e) => new mc(e);
class fi extends mc {
  constructor(n, r) {
    super(n);
    i(this, "from");
    this.from = r;
  }
  annotations(n) {
    return new fi(Qy(this.ast, Br(n)), this.from);
  }
}
const NF = (e) => new fi(new As(e.ast, !1, !0, {}, void 0), e), is = /* @__PURE__ */ f(2, (e, t) => {
  const n = e.ast;
  switch (n._tag) {
    case "PropertySignatureDeclaration":
      return gc(new As(n.type, n.isOptional, n.isReadonly, n.annotations, t));
    case "PropertySignatureTransformation":
      return gc(new li(n.from, new ui(n.to.type, n.to.isOptional, n.to.isReadonly, n.to.annotations, t), n.decode, n.encode));
  }
}), zt = (e, t, n) => gc(new li(new ml(e.ast, !0, !0, {}, void 0), new ui(t.ast, !1, !0, {}, void 0), (r) => O(n.decode(r)), Mr(n.encode))), eh = (e, t, n) => gc(new li(new ml(e.ast, !0, !0, {}, void 0), new ui(t.ast, !0, !0, {}, void 0), n.decode, n.encode)), AF = (e, t) => {
  const n = t == null ? void 0 : t.exact, r = t == null ? void 0 : t.default, s = t == null ? void 0 : t.nullable, o = (t == null ? void 0 : t.as) == "Option", c = t != null && t.onNoneEncoding ? jt(t.onNoneEncoding) : D;
  return n ? r ? s ? is(zt(Fi(e), He(e), {
    decode: be({
      onNone: r,
      onSome: (a) => a === null ? r() : a
    }),
    encode: O
  }), r).ast : is(zt(e, He(e), {
    decode: be({
      onNone: r,
      onSome: D
    }),
    encode: O
  }), r).ast : o ? s ? zt(Fi(e), yo(He(e)), {
    decode: Wr(hi),
    encode: c
  }).ast : zt(e, yo(He(e)), {
    decode: D,
    encode: D
  }).ast : s ? eh(Fi(e), He(e), {
    decode: Wr(hi),
    encode: D
  }).ast : new As(e.ast, !0, !0, {}, void 0) : r ? s ? is(zt(Ni(e), He(e), {
    decode: be({
      onNone: r,
      onSome: (a) => a ?? r()
    }),
    encode: O
  }), r).ast : is(zt(po(e), He(e), {
    decode: be({
      onNone: r,
      onSome: (a) => a === void 0 ? r() : a
    }),
    encode: O
  }), r).ast : o ? s ? zt(Ni(e), yo(He(e)), {
    decode: Wr((a) => a != null),
    encode: c
  }).ast : zt(po(e), yo(He(e)), {
    decode: Wr(g_),
    encode: c
  }).ast : s ? eh(Ni(e), po(He(e)), {
    decode: Wr(hi),
    encode: D
  }).ast : new As(po(e).ast, !0, !0, {}, void 0);
}, CF = /* @__PURE__ */ f((e) => ft(e[0]), (e, t) => new fi(AF(e, t), e)), PF = /* @__PURE__ */ ym([Xa]), xF = (e, t) => {
  const n = Zn(e), r = [];
  if (n.length > 0) {
    const o = [], c = [], a = [];
    for (let u = 0; u < n.length; u++) {
      const l = n[u], h = e[l];
      if (Xy(h)) {
        const d = h.ast;
        switch (d._tag) {
          case "PropertySignatureDeclaration": {
            const p = d.type, g = d.isOptional, y = d.annotations;
            o.push(new ue(l, p, g, !0, PF(d))), c.push(new ue(l, ge(p), g, !0, y)), r.push(new ue(l, p, g, !0, y));
            break;
          }
          case "PropertySignatureTransformation": {
            const p = d.from.fromKey ?? l;
            o.push(new ue(p, d.from.type, d.from.isOptional, !0, d.from.annotations)), c.push(new ue(l, d.to.type, d.to.isOptional, !0, d.to.annotations)), a.push(new hm(p, l, d.decode, d.encode));
            break;
          }
        }
      } else
        o.push(new ue(l, h.ast, !1, !0)), c.push(new ue(l, ge(h.ast), !1, !0)), r.push(new ue(l, h.ast, !1, !0));
    }
    if (ce(a)) {
      const u = [], l = [];
      for (const h of t) {
        const {
          indexSignatures: d,
          propertySignatures: p
        } = jl(h.key.ast, h.value.ast);
        p.forEach((g) => {
          o.push(g), c.push(new ue(g.name, ge(g.type), g.isOptional, g.isReadonly, g.annotations));
        }), d.forEach((g) => {
          u.push(g), l.push(new Fc(g.parameter, ge(g.type), g.isReadonly));
        });
      }
      return new wt(new Ze(o, u, {
        [xi]: "Struct (Encoded side)"
      }), new Ze(c, l, {
        [xi]: "Struct (Type side)"
      }), new Ss(a));
    }
  }
  const s = [];
  for (const o of t) {
    const {
      indexSignatures: c,
      propertySignatures: a
    } = jl(o.key.ast, o.value.ast);
    a.forEach((u) => r.push(u)), c.forEach((u) => s.push(u));
  }
  return new Ze(r, s);
}, LF = (e, t) => {
  const n = Zn(e);
  for (const r of n) {
    const s = e[r];
    if (t[r] === void 0 && Xy(s)) {
      const o = s.ast, c = o._tag === "PropertySignatureDeclaration" ? o.defaultValue : o.to.defaultValue;
      c !== void 0 && (t[r] = c());
    }
  }
  return t;
};
function e_(e, t, n = xF(e, t)) {
  var r;
  return r = class extends Y(n) {
    static annotations(o) {
      return e_(this.fields, this.records, mt(this.ast, o));
    }
    static pick(...o) {
      return qt(SF(e, ...o));
    }
    static omit(...o) {
      return qt(bF(e, ...o));
    }
  }, i(r, "fields", {
    ...e
  }), i(r, "records", [...t]), i(r, "make", (o, c) => {
    const a = LF(e, {
      ...o
    });
    return s_(c) ? a : Ly(r)(a);
  }), r;
}
function qt(e, ...t) {
  return e_(e, t);
}
const jF = (e) => fl(e).pipe(NF, is(() => e)), Wn = (e, t) => qt({
  _tag: jF(e),
  ...t
}), eC = (...e) => (t) => Y(yt(t.ast, e)), tC = (...e) => (t) => Y(Bb(t.ast, e)), nC = (e) => Y(ss(e.ast)), es = (e, t, n) => {
  if (Ll(e) && Ll(t)) {
    const r = [...e.propertySignatures];
    for (const s of t.propertySignatures) {
      const o = s.name, c = r.findIndex((a) => a.name === o);
      if (c === -1)
        r.push(s);
      else {
        const {
          isOptional: a,
          type: u
        } = r[c];
        r[c] = new ue(o, pc(u, s.type, n.concat(o)), a, !0);
      }
    }
    return new Ze(r, e.indexSignatures.concat(t.indexSignatures));
  }
  throw new Error(Ld(e, t, n));
}, KF = /* @__PURE__ */ Jb([eu]), ts = (e, t) => t.map((n) => new ru(n, e.filter, KF(e))), pc = (e, t, n) => Je.make(Ct([e], [t], n)), cn = (e) => nu(e) ? e.types : [e], Ct = (e, t, n) => Lo(e, (r) => Lo(t, (s) => {
  switch (s._tag) {
    case "Literal": {
      if (Ue(s.literal) && Uo(r) || Ut(s.literal) && Al(r) || kn(s.literal) && Cl(r))
        return [s];
      break;
    }
    case "StringKeyword": {
      if (s === Li) {
        if (Uo(r) || pn(r) && Ue(r.literal))
          return [r];
        if (Xn(r))
          return ts(r, Ct(cn(r.from), [s], n));
      } else if (r === Li)
        return [s];
      break;
    }
    case "NumberKeyword": {
      if (s === ji) {
        if (Al(r) || pn(r) && Ut(r.literal))
          return [r];
        if (Xn(r))
          return ts(r, Ct(cn(r.from), [s], n));
      } else if (r === ji)
        return [s];
      break;
    }
    case "BooleanKeyword": {
      if (s === Ki) {
        if (Cl(r) || pn(r) && kn(r.literal))
          return [r];
        if (Xn(r))
          return ts(r, Ct(cn(r.from), [s], n));
      } else if (r === Ki)
        return [s];
      break;
    }
    case "Union":
      return Ct(cn(r), s.types, n);
    case "Suspend":
      return [new ur(() => pc(r, s.f(), n))];
    case "Refinement":
      return ts(s, Ct(cn(r), cn(s.from), n));
    case "TypeLiteral": {
      switch (r._tag) {
        case "Union":
          return Ct(r.types, [s], n);
        case "Suspend":
          return [new ur(() => pc(r.f(), s, n))];
        case "Refinement":
          return ts(r, Ct(cn(r.from), [s], n));
        case "TypeLiteral":
          return [es(r, s, n)];
        case "Transformation": {
          const o = r.transformation, c = es(r.from, s, n), a = es(r.to, ge(s), n);
          switch (o._tag) {
            case "TypeLiteralTransformation":
              return [new wt(c, a, new Ss(o.propertySignatureTransformations))];
            case "ComposeTransformation":
              return [new wt(c, a, fm)];
            case "FinalTransformation":
              return [new wt(c, a, new lm((u, l, h, d) => Ye(o.decode(u, l, h, d), (p) => ({
                ...u,
                ...p
              })), (u, l, h, d) => Ye(o.encode(u, l, h, d), (p) => ({
                ...u,
                ...p
              }))))];
          }
        }
      }
      break;
    }
    case "Transformation": {
      if (xb(r)) {
        if (Ui(s.transformation) && Ui(r.transformation))
          return [new wt(es(r.from, s.from, n), es(r.to, s.to, n), new Ss(s.transformation.propertySignatureTransformations.concat(r.transformation.propertySignatureTransformations)))];
      } else
        return Ct([s], [r], n);
      break;
    }
  }
  throw new Error(Ld(r, s, n));
})), UF = /* @__PURE__ */ f(2, (e, t) => Y(pc(e.ast, t.ast, []))), Yn = (e) => Y(new ur(() => e().ast)), DF = /* @__PURE__ */ Symbol.for("effect/SchemaId/Refine");
function t_(e, t, n) {
  var r, s, o;
  return o = class extends (s = Y(n), r = DF, s) {
    static annotations(a) {
      return t_(this.from, this.filter, mt(this.ast, a));
    }
  }, i(o, r, e), i(o, "from", e), i(o, "filter", t), i(o, "make", (a, u) => s_(u) ? a : Ly(o)(a)), o;
}
const th = (e, t, n) => {
  if (kn(e))
    return e ? b() : O(new ct(t, n));
  if (Ue(e))
    return O(new ct(t, n, e));
  if (e !== void 0) {
    if ("_tag" in e)
      return O(e);
    const r = new ct(t, n, e.message);
    return O(ce(e.path) ? new ve(e.path, n, r) : r);
  }
  return b();
}, qF = (e, t, n) => {
  if (JS(e))
    return th(e, t, n);
  if (ce(e)) {
    const r = un(e, (s) => th(s, t, n));
    if (ce(r))
      return O(r.length === 1 ? r[0] : new ae(t, n, r));
  }
  return b();
};
function gl(e, t) {
  return (n) => {
    function r(o, c, a) {
      return qF(e(o, c, a), a, o);
    }
    const s = new ru(n.ast, r, Br(t));
    return t_(n, r, s);
  };
}
function n_(e, t, n) {
  var r;
  return r = class extends Y(n) {
    static annotations(o) {
      return n_(this.from, this.to, mt(this.ast, o));
    }
  }, i(r, "from", e), i(r, "to", t), r;
}
const BF = /* @__PURE__ */ f((e) => ft(e[0]) && ft(e[1]), (e, t, n) => n_(e, t, new wt(e.ast, t.ast, new lm(n.decode, n.encode)))), JF = /* @__PURE__ */ f((e) => ft(e[0]) && ft(e[1]), (e, t, n) => BF(e, t, {
  strict: !0,
  decode: (r, s, o, c) => dc(n.decode(r, c)),
  encode: (r, s, o, c) => dc(n.encode(r, c))
})), sC = /* @__PURE__ */ f((e) => ft(e[0]), (e, t, n, r) => {
  const s = UF(He(e), qt({
    [t]: ps(n) ? $F(n) : fl(n)
  })).ast;
  return Y(new wt(e.ast, r ? mt(s, r) : s, new Ss([new hm(t, t, () => O(n), () => b())])));
}), VF = ZS, zF = (e, t) => (n) => n.pipe(gl((r) => r > e, {
  schemaId: VF,
  title: `greaterThan(${e})`,
  description: "a positive number",
  jsonSchema: {
    exclusiveMinimum: e
  },
  ...t
})), WF = XS, GF = (e, t) => (n) => n.pipe(gl((r) => r >= e, {
  schemaId: WF,
  title: `greaterThanOrEqualTo(${e})`,
  description: "a non-negative number",
  jsonSchema: {
    minimum: e
  },
  ...t
})), HF = eb, r_ = (e) => (t) => t.pipe(gl((n) => Number.isSafeInteger(n), {
  schemaId: HF,
  title: "int",
  description: "an integer",
  jsonSchema: {
    type: "integer"
  },
  ...e
})), YF = (e) => zF(0, {
  title: "positive",
  ...e
}), QF = (e) => GF(0, {
  title: "nonNegative",
  ...e
});
class oC extends (/* @__PURE__ */ dn.pipe(/* @__PURE__ */ r_({
  identifier: "Int"
}))) {
}
class cC extends (/* @__PURE__ */ dn.pipe(/* @__PURE__ */ YF({
  identifier: "Positive"
}))) {
}
class ZF extends (/* @__PURE__ */ dn.pipe(/* @__PURE__ */ QF({
  identifier: "NonNegative"
}))) {
}
const XF = (e, t, n, r) => HM(e, {
  onFailure: (s) => new ae(n, r, s),
  onSuccess: t
}), iC = /* @__PURE__ */ ZF.pipe(r_()).annotations({
  identifier: "NonNegativeInt"
}), eN = (e) => e._tag === "None" ? b() : O(e.value), tN = (e, t) => (n) => n.oneof(t, n.record({
  _tag: n.constant("None")
}), n.record({
  _tag: n.constant("Some"),
  value: e(n)
})).map(eN), nN = (e) => be({
  onNone: () => "none()",
  onSome: (t) => `some(${e(t)})`
}), nh = (e) => (t, n, r) => oS(t) ? de(t) ? dc(b()) : XF(e(t.value, n), O, r, t) : Fy(new ct(r, t)), yo = (e) => EF([e], {
  decode: (t) => nh(xy(t)),
  encode: (t) => nh(XM(t))
}, {
  description: `Option<${wF(e)}>`,
  pretty: nN,
  arbitrary: tN,
  equivalence: hS
});
function s_(e) {
  return kn(e) ? e : (e == null ? void 0 : e.disableValidation) ?? !1;
}
const B = CF, rN = qt({
  path: V,
  description: B(V, { exact: !0 })
}), sN = qt({
  name: V,
  valueBase64Binary: B(V, { exact: !0 }),
  valueBoolean: B(V, { exact: !0 }),
  valueCanonical: B(V, { exact: !0 }),
  valueCode: B(V, { exact: !0 }),
  valueDate: B(V, { exact: !0 }),
  valueDateTime: B(V, { exact: !0 }),
  valueDecimal: B(V, { exact: !0 }),
  valueId: B(V, { exact: !0 }),
  valueInstant: B(dn, { exact: !0 }),
  valueInteger: B(dn, { exact: !0 }),
  valueOid: B(V, { exact: !0 }),
  valuePositiveInt: B(dn, { exact: !0 }),
  valueString: B(V, { exact: !0 }),
  valueTime: B(V, { exact: !0 }),
  valueUnsignedInt: B(dn, { exact: !0 }),
  valueUri: B(V, { exact: !0 }),
  valueUrl: B(V, { exact: !0 }),
  valueUuid: B(V, { exact: !0 })
}), oN = sN, cN = qt({
  name: V,
  value: V
}), o_ = cN, aC = nF(o_), c_ = qt({
  path: V,
  name: V,
  description: B(V, { exact: !0 }),
  collection: B(Wy, { exact: !0 }),
  type: B(V, { exact: !0 }),
  tags: B(it(o_), { exact: !0 })
}), pl = c_, uC = c_.make, qn = tF(pl), La = qt({
  column: B(it(pl), {
    exact: !0
  }),
  select: B(
    it(
      Yn(() => La)
    ),
    { exact: !0 }
  ),
  forEach: B(V, { exact: !0 }),
  forEachOrNull: B(V, { exact: !0 }),
  unionAll: B(
    it(
      Yn(() => La)
    ),
    { exact: !0 }
  )
}), { Select: an, Column: Bn, ForEach: rh, ForEachOrNull: sh, UnionAll: Jn, $match: iN } = yR(), Qn = ai(
  Wn("Column", {
    column: it(He(pl))
  }),
  Wn("Select", {
    select: it(Yn(() => Qn))
  }),
  Wn("ForEach", {
    forEach: V,
    select: it(Yn(() => Qn))
  }),
  Wn("ForEachOrNull", {
    forEachOrNull: V,
    select: it(Yn(() => Qn))
  }),
  Wn("UnionAll", {
    unionAll: it(Yn(() => Qn))
  })
);
function Ee(e) {
  return zM(e).pipe(
    Vt(
      {
        forEach: mo,
        forEachOrNull: mo
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(e, null, 2)}`
        );
      }
    ),
    Vt(
      {
        forEach: mo
      },
      ({ forEach: t, select: n = [], unionAll: r, column: s }) => rh({
        forEach: t,
        select: [
          ...r ? [
            Jn({
              unionAll: r.map(
                (o) => Ee(o)
              )
            })
          ] : [],
          ...s ? [
            Bn({
              column: un(
                s,
                (o) => qn(
                  o
                )
              )
            })
          ] : [],
          ...n.map(Ee)
        ]
      })
    ),
    Vt(
      {
        forEachOrNull: mo
      },
      ({ forEachOrNull: t, select: n = [], unionAll: r, column: s }) => sh({
        forEachOrNull: t,
        select: [
          ...r ? [
            Jn({
              unionAll: r.map(
                (o) => Ee(o)
              )
            })
          ] : [],
          ...s ? [
            Bn({
              column: un(
                s,
                (o) => qn(
                  o
                )
              )
            })
          ] : [],
          ...n.map(Ee)
        ]
      })
    ),
    Vt(
      {
        column: rt,
        select: rt,
        unionAll: rt
      },
      ({ column: t = [], select: n = [], unionAll: r = [] }) => an({
        select: [
          Jn({
            unionAll: r.map(Ee)
          }),
          Bn({
            column: un(
              t,
              (s) => qn(s)
            )
          }),
          ...n.map(Ee)
        ]
      })
    ),
    Vt(
      {
        unionAll: rt,
        select: rt
      },
      ({ unionAll: t = [], select: n = [] }) => an({
        select: [
          Jn({
            unionAll: t.map(Ee)
          }),
          ...n.map(Ee)
        ]
      })
    ),
    Vt(
      {
        select: rt,
        column: rt
      },
      ({ select: t = [], column: n = [] }) => an({
        select: [
          Bn({
            column: un(
              n,
              (r) => qn(r)
            )
          }),
          ...t.map(Ee)
        ]
      })
    ),
    Vt(
      {
        column: rt,
        unionAll: rt
      },
      ({ column: t = [], unionAll: n = [], select: r = [] }) => an({
        select: [
          Bn({
            column: un(
              t,
              (s) => qn(s)
            )
          }),
          Jn({
            unionAll: n.map(Ee)
          }),
          ...r.map(Ee)
        ]
      })
    ),
    Vt(
      {
        select: rt
      },
      ({ select: t = [] }) => an({
        select: t.map(Ee)
      })
    ),
    WM((t) => {
      var n, r;
      return t.unionAll ? Jn({
        unionAll: t.unionAll.map(Ee)
      }) : t.column ? Bn({
        column: un(
          t.column,
          (s) => qn(s)
        )
      }) : t.forEach ? rh({
        forEach: t.forEach,
        select: ((n = t.select) == null ? void 0 : n.map(Ee)) ?? []
      }) : t.forEachOrNull ? sh({
        forEachOrNull: t.forEachOrNull,
        select: ((r = t.select) == null ? void 0 : r.map(Ee)) ?? []
      }) : t.select ? an({
        select: t.select.map(Ee)
      }) : an({
        select: []
      });
    })
  );
}
const aN = JF(La, Qn, {
  strict: !0,
  encode: ({ _tag: e, ...t }) => t,
  decode: (e) => Ee(e)
}), lC = eF(aN);
Wn("Select", {
  status: fl("draft", "active", "retired", "unknown"),
  url: B(V, { exact: !0 }),
  name: B(V, { exact: !0 }),
  title: B(V, { exact: !0 }),
  experimental: B(Wy, { exact: !0 }),
  publisher: B(V, { exact: !0 }),
  description: B(V, { exact: !0 }),
  copyright: B(V, { exact: !0 }),
  resource: V,
  constant: B(it(oN), {
    exact: !0
  }),
  where: B(it(rN), { exact: !0 }),
  select: MF(Qn)
});
const fC = py("Select");
function hC(e, t = (n) => !0) {
  const n = (o, c) => iN(c, {
    ForEach: ({ select: a }) => a.flatMap((u) => n(o, u)),
    ForEachOrNull: ({ select: a }) => a.flatMap((u) => n(o, u)),
    Select: ({ select: a }) => a.flatMap((u) => n(o, u)),
    UnionAll: ({ unionAll: a }) => a.flatMap((u) => n(o, u)),
    Column: ({ column: a }) => Ya(o, a)
  });
  return n([], e).filter(t);
}
export {
  Sw as $,
  Wo as A,
  jO as B,
  Bu as C,
  Zt as D,
  b as E,
  O as F,
  Gc as G,
  ee as H,
  Kc as I,
  rn as J,
  JO as K,
  je as L,
  wn as M,
  re as N,
  ON as O,
  T as P,
  oe as Q,
  cr as R,
  CS as S,
  bw as T,
  Gg as U,
  Lg as V,
  Rm as W,
  Hg as X,
  yN as Y,
  at as Z,
  xN as _,
  $N as a,
  SA as a$,
  me as a0,
  vu as a1,
  TN as a2,
  jN as a3,
  Ha as a4,
  JN as a5,
  M as a6,
  NM as a7,
  D as a8,
  ze as a9,
  wA as aA,
  lA as aB,
  KN as aC,
  yA as aD,
  fA as aE,
  Na as aF,
  KA as aG,
  NN as aH,
  RN as aI,
  Io as aJ,
  sA as aK,
  ne as aL,
  vN as aM,
  te as aN,
  AN as aO,
  tA as aP,
  cA as aQ,
  MN as aR,
  EA as aS,
  bA as aT,
  UN as aU,
  uA as aV,
  N as aW,
  L as aX,
  VN as aY,
  IN as aZ,
  CA as a_,
  iA as aa,
  qA as ab,
  $A as ac,
  PN as ad,
  hA as ae,
  QN as af,
  gR as ag,
  ga as ah,
  pt as ai,
  pA as aj,
  kA as ak,
  BN as al,
  DA as am,
  Wm as an,
  kN as ao,
  oA as ap,
  ho as aq,
  TA as ar,
  UA as as,
  FA as at,
  zN as au,
  eA as av,
  EN as aw,
  OA as ax,
  PA as ay,
  FN as az,
  R$ as b,
  US as b$,
  DN as b0,
  R as b1,
  HN as b2,
  GN as b3,
  mR as b4,
  yn as b5,
  Ci as b6,
  _A as b7,
  CN as b8,
  nA as b9,
  fl as bA,
  WA as bB,
  cC as bC,
  r_ as bD,
  V as bE,
  iC as bF,
  oC as bG,
  dn as bH,
  Wy as bI,
  FS as bJ,
  qt as bK,
  CF as bL,
  it as bM,
  Yn as bN,
  MF as bO,
  QM as bP,
  eF as bQ,
  nF as bR,
  JA as bS,
  HA as bT,
  ai as bU,
  He as bV,
  eC as bW,
  nC as bX,
  UF as bY,
  JF as bZ,
  Nd as b_,
  ZN as ba,
  xA as bb,
  MA as bc,
  WN as bd,
  RA as be,
  LA as bf,
  vA as bg,
  IA as bh,
  dA as bi,
  be as bj,
  NA as bk,
  qN as bl,
  mA as bm,
  Dt as bn,
  Bi as bo,
  aA as bp,
  XN as bq,
  gA as br,
  rA as bs,
  Tl as bt,
  Pe as bu,
  PM as bv,
  AA as bw,
  SN as bx,
  _N as by,
  AM as bz,
  ju as c,
  tF as c0,
  yR as c1,
  Wn as c2,
  BF as c3,
  dc as c4,
  Fy as c5,
  ct as c6,
  VA as c7,
  tC as c8,
  jF as c9,
  oN as cA,
  o_ as cB,
  aC as cC,
  pl as cD,
  Ee as cE,
  hC as cF,
  un as ca,
  gn as cb,
  zM as cc,
  Vt as cd,
  WM as ce,
  sC as cf,
  mo as cg,
  rt as ch,
  kF as ci,
  bR as cj,
  jA as ck,
  Ya as cl,
  lN as cm,
  ls as cn,
  fC as co,
  lC as cp,
  uC as cq,
  Bn as cr,
  an as cs,
  rh as ct,
  sh as cu,
  Jn as cv,
  iN as cw,
  Lo as cx,
  Qa as cy,
  rN as cz,
  T$ as d,
  I$ as e,
  f,
  we as g,
  et as h,
  $t as i,
  fv as j,
  bn as k,
  LN as l,
  da as m,
  Ho as n,
  Ug as o,
  v as p,
  cc as q,
  $n as r,
  m as s,
  he as t,
  wf as u,
  _ as v,
  S as w,
  H as x,
  jc as y,
  Z as z
};
