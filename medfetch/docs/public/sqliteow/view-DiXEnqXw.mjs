var gm = Object.defineProperty;
var Ma = (e) => {
  throw TypeError(e);
};
var mm = (e, t, n) => t in e ? gm(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var c = (e, t, n) => mm(e, typeof t != "symbol" ? t + "" : t, n), Aa = (e, t, n) => t.has(e) || Ma("Cannot " + n);
var Fa = (e, t, n) => (Aa(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Ca = (e, t, n) => t.has(e) ? Ma("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Pa = (e, t, n, r) => (Aa(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n);
const pm = (e) => typeof e == "function", f = function(e, t) {
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
        return arguments.length >= 4 ? t(n, r, s, o) : function(i) {
          return t(i, n, r, s);
        };
      };
    case 5:
      return function(n, r, s, o, i) {
        return arguments.length >= 5 ? t(n, r, s, o, i) : function(a) {
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
}, H = (e) => e, so = (e) => () => e, xa = /* @__PURE__ */ so(!0), yi = /* @__PURE__ */ so(!1), Yl = /* @__PURE__ */ so(void 0), ym = Yl;
function g(e, t, n, r, s, o, i, a, u) {
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
      return i(o(s(r(n(t(e))))));
    case 8:
      return a(i(o(s(r(n(t(e)))))));
    case 9:
      return u(a(i(o(s(r(n(t(e))))))));
    default: {
      let l = arguments[0];
      for (let h = 1; h < arguments.length; h++)
        l = arguments[h](l);
      return l;
    }
  }
}
const oo = (e) => (t, n) => t === n || e(t, n), _m = /* @__PURE__ */ f(2, (e, t) => oo((n, r) => e(t(n), t(r)))), Sm = (e) => oo((t, n) => {
  if (t.length !== n.length)
    return !1;
  for (let r = 0; r < t.length; r++)
    if (!e(t[r], n[r]))
      return !1;
  return !0;
});
let bm = "3.14.1";
const io = () => bm, rs = `effect/GlobalValue/globalStoreId/${/* @__PURE__ */ io()}`;
let nr;
const J = (e, t) => (nr || (globalThis[rs] ?? (globalThis[rs] = /* @__PURE__ */ new Map()), nr = globalThis[rs]), nr.has(e) || nr.set(e, t()), nr.get(e)), ut = (e) => typeof e == "string", Vt = (e) => typeof e == "number", lc = (e) => typeof e == "boolean", co = (e) => typeof e == "bigint", _i = (e) => typeof e == "symbol", Fr = pm, wm = (e) => e === void 0, km = (e) => e !== void 0, zo = (e) => e !== null, Om = (e) => !1, fc = (e) => typeof e == "object" && e !== null, Ft = (e) => fc(e) || Fr(e), M = /* @__PURE__ */ f(2, (e, t) => Ft(e) && t in e), hc = /* @__PURE__ */ f(2, (e, t) => M(e, "_tag") && e._tag === t), on = (e) => e == null, vm = (e) => e != null, Em = (e) => e instanceof Date, Ql = (e) => M(e, Symbol.iterator), Tm = (e) => fc(e) && !Array.isArray(e), Im = (e) => M(e, "then") && Fr(e.then), ao = (e) => `BUG: ${e} - please report an issue at https://github.com/Effect-TS/effect/issues`;
let Xl = class Zl {
  constructor(t) {
    c(this, "self");
    c(this, "called", !1);
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
    return new Zl(this.self);
  }
};
const $m = 335903614, Rm = 4150755663, Nm = 1481765933, Mm = 1284865837, Am = 9007199254740992, Fm = 134217728;
class Cm {
  constructor(t, n, r, s) {
    c(this, "_state");
    return on(n) && on(t) ? (n = Math.random() * 4294967295 >>> 0, t = 0) : on(n) && (n = t, t = 0), on(s) && on(r) ? (s = this._state ? this._state[3] : Rm, r = this._state ? this._state[2] : $m) : on(s) && (s = r, r = 0), this._state = new Int32Array([0, 0, r >>> 0, ((s || 0) | 1) >>> 0]), this._next(), ja(this._state, this._state[0], this._state[1], t >>> 0, n >>> 0), this._next(), this;
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
    return (t * Fm + n) / Am;
  }
  /** @internal */
  _next() {
    const t = this._state[0] >>> 0, n = this._state[1] >>> 0;
    Pm(this._state, t, n, Nm, Mm), ja(this._state, this._state[0], this._state[1], this._state[2], this._state[3]);
    let r = t >>> 18, s = (n >>> 18 | t << 14) >>> 0;
    r = (r ^ t) >>> 0, s = (s ^ n) >>> 0;
    const o = (s >>> 27 | r << 5) >>> 0, i = t >>> 27, a = (-i >>> 0 & 31) >>> 0;
    return (o >>> i | o << a) >>> 0;
  }
}
function Pm(e, t, n, r, s) {
  let o = (n >>> 16) * (s & 65535) >>> 0, i = (n & 65535) * (s >>> 16) >>> 0, a = (n & 65535) * (s & 65535) >>> 0, u = (n >>> 16) * (s >>> 16) + ((i >>> 16) + (o >>> 16)) >>> 0;
  i = i << 16 >>> 0, a = a + i >>> 0, a >>> 0 < i >>> 0 && (u = u + 1 >>> 0), o = o << 16 >>> 0, a = a + o >>> 0, a >>> 0 < o >>> 0 && (u = u + 1 >>> 0), u = u + Math.imul(n, r) >>> 0, u = u + Math.imul(t, s) >>> 0, e[0] = u, e[1] = a;
}
function ja(e, t, n, r, s) {
  let o = t + r >>> 0;
  const i = n + s >>> 0;
  i >>> 0 < n >>> 0 && (o = o + 1 | 0), e[0] = o, e[1] = i;
}
const Si = /* @__PURE__ */ Symbol.for("effect/Utils/YieldWrap");
var Ar;
class Cr {
  constructor(t) {
    /**
     * @since 3.0.6
     */
    Ca(this, Ar);
    Pa(this, Ar, t);
  }
  /**
   * @since 3.0.6
   */
  [Si]() {
    return Fa(this, Ar);
  }
}
Ar = new WeakMap();
function xm(e) {
  if (typeof e == "object" && e !== null && Si in e)
    return e[Si]();
  throw new Error(ao("yieldWrapGet"));
}
const Le = /* @__PURE__ */ J("effect/Utils/isStructuralRegion", () => ({
  enabled: !1,
  tester: void 0
})), jm = (e) => {
  const t = {
    [e](n) {
      return n();
    }
  };
  return function(n) {
    return t[e](n);
  };
}, Te = /* @__PURE__ */ jm("effect_internal_function"), Yo = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/Hash/randomHashCache"), () => /* @__PURE__ */ new WeakMap()), L = /* @__PURE__ */ Symbol.for("effect/Hash"), b = (e) => {
  if (Le.enabled === !0)
    return 0;
  switch (typeof e) {
    case "number":
      return gc(e);
    case "bigint":
      return ne(e.toString(10));
    case "boolean":
      return ne(String(e));
    case "symbol":
      return ne(String(e));
    case "string":
      return ne(e);
    case "undefined":
      return ne("undefined");
    case "function":
    case "object":
      return e === null ? ne("null") : e instanceof Date ? b(e.toISOString()) : Lm(e) ? e[L]() : dc(e);
    default:
      throw new Error(`BUG: unhandled typeof ${typeof e} - please report an issue at https://github.com/Effect-TS/effect/issues`);
  }
}, dc = (e) => (Yo.has(e) || Yo.set(e, gc(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER))), Yo.get(e)), B = (e) => (t) => t * 53 ^ e, uo = (e) => e & 3221225471 | e >>> 1 & 1073741824, Lm = (e) => M(e, L), gc = (e) => {
  if (e !== e || e === 1 / 0)
    return 0;
  let t = e | 0;
  for (t !== e && (t ^= e * 4294967295); e > 4294967295; )
    t ^= e /= 4294967295;
  return uo(t);
}, ne = (e) => {
  let t = 5381, n = e.length;
  for (; n; )
    t = t * 33 ^ e.charCodeAt(--n);
  return uo(t);
}, Km = (e, t) => {
  let n = 12289;
  for (let r = 0; r < t.length; r++)
    n ^= g(ne(t[r]), B(b(e[t[r]])));
  return uo(n);
}, ef = (e) => Km(e, Object.keys(e)), Pr = (e) => {
  let t = 6151;
  for (let n = 0; n < e.length; n++)
    t = g(t, B(b(e[n])));
  return uo(t);
}, Z = function() {
  if (arguments.length === 1) {
    const n = arguments[0];
    return function(r) {
      return Object.defineProperty(n, L, {
        value() {
          return r;
        },
        enumerable: !1
      }), r;
    };
  }
  const e = arguments[0], t = arguments[1];
  return Object.defineProperty(e, L, {
    value() {
      return t;
    },
    enumerable: !1
  }), t;
}, P = /* @__PURE__ */ Symbol.for("effect/Equal");
function x() {
  return arguments.length === 1 ? (e) => $s(e, arguments[0]) : $s(arguments[0], arguments[1]);
}
function $s(e, t) {
  if (e === t)
    return !0;
  const n = typeof e;
  if (n !== typeof t)
    return !1;
  if (n === "object" || n === "function") {
    if (e !== null && t !== null) {
      if (Rs(e) && Rs(t))
        return b(e) === b(t) && e[P](t) ? !0 : Le.enabled && Le.tester ? Le.tester(e, t) : !1;
      if (e instanceof Date && t instanceof Date)
        return e.toISOString() === t.toISOString();
    }
    if (Le.enabled) {
      if (Array.isArray(e) && Array.isArray(t))
        return e.length === t.length && e.every((r, s) => $s(r, t[s]));
      if (Object.getPrototypeOf(e) === Object.prototype && Object.getPrototypeOf(e) === Object.prototype) {
        const r = Object.keys(e), s = Object.keys(t);
        if (r.length === s.length) {
          for (const o of r)
            if (!(o in t && $s(e[o], t[o])))
              return Le.tester ? Le.tester(e, t) : !1;
          return !0;
        }
      }
      return Le.tester ? Le.tester(e, t) : !1;
    }
  }
  return Le.enabled && Le.tester ? Le.tester(e, t) : !1;
}
const Rs = (e) => M(e, P), mc = () => x, Q = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom"), ae = (e) => {
  try {
    if (M(e, "toJSON") && Fr(e.toJSON) && e.toJSON.length === 0)
      return e.toJSON();
    if (Array.isArray(e))
      return e.map(ae);
  } catch {
    return {};
  }
  return Dm(e);
}, ge = (e) => JSON.stringify(e, null, 2), En = (e, t = 2) => {
  if (typeof e == "string")
    return e;
  try {
    return typeof e == "object" ? tf(e, t) : String(e);
  } catch {
    return String(e);
  }
}, tf = (e, t) => {
  let n = [];
  const r = JSON.stringify(e, (s, o) => typeof o == "object" && o !== null ? n.includes(o) ? void 0 : n.push(o) && (Ut.fiberRefs !== void 0 && nf(o) ? o[pc](Ut.fiberRefs) : o) : o, t);
  return n = void 0, r;
}, pc = /* @__PURE__ */ Symbol.for("effect/Inspectable/Redactable"), nf = (e) => typeof e == "object" && e !== null && pc in e, Ut = /* @__PURE__ */ J("effect/Inspectable/redactableState", () => ({
  fiberRefs: void 0
})), Um = (e, t) => {
  const n = Ut.fiberRefs;
  Ut.fiberRefs = e;
  try {
    return t();
  } finally {
    Ut.fiberRefs = n;
  }
}, Dm = (e) => nf(e) && Ut.fiberRefs !== void 0 ? e[pc](Ut.fiberRefs) : e, v = (e, t) => {
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
}, gr = "Async", lo = "Commit", ze = "Failure", Qo = "OnFailure", Ns = "OnSuccess", Ms = "OnSuccessAndFailure", Ye = "Success", rf = "Sync", qm = "Tag", xr = "UpdateRuntimeFlags", As = "While", ps = "Iterator", sf = "WithRuntime", ys = "Yield", yc = "RevertFlags", Bm = /* @__PURE__ */ Symbol.for("effect/Effect"), Jm = /* @__PURE__ */ Symbol.for("effect/Stream"), Vm = /* @__PURE__ */ Symbol.for("effect/Sink"), Wm = /* @__PURE__ */ Symbol.for("effect/Channel"), Tn = {
  /* c8 ignore next */
  _R: (e) => e,
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e,
  _V: /* @__PURE__ */ io()
}, Hm = {
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
}, Gm = {
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
}, jr = {
  [Bm]: Tn,
  [Jm]: Tn,
  [Vm]: Hm,
  [Wm]: Gm,
  [P](e) {
    return this === e;
  },
  [L]() {
    return Z(this, dc(this));
  },
  [Symbol.iterator]() {
    return new Xl(new Cr(this));
  },
  pipe() {
    return v(this, arguments);
  }
}, Lr = {
  [L]() {
    return Z(this, ef(this));
  },
  [P](e) {
    const t = Object.keys(this), n = Object.keys(e);
    if (t.length !== n.length)
      return !1;
    for (const r of t)
      if (!(r in e && x(this[r], e[r])))
        return !1;
    return !0;
  }
}, Kr = {
  ...jr,
  _op: lo
}, zm = {
  ...Kr,
  ...Lr
}, Ym = /* @__PURE__ */ function() {
  function e() {
  }
  return e.prototype = Kr, e;
}(), of = /* @__PURE__ */ Symbol.for("effect/Option"), cf = {
  ...jr,
  [of]: {
    _A: (e) => e
  },
  [Q]() {
    return this.toJSON();
  },
  toString() {
    return ge(this.toJSON());
  }
}, Qm = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(cf), {
  _tag: "Some",
  _op: "Some",
  [P](e) {
    return _c(e) && uf(e) && x(this.value, e.value);
  },
  [L]() {
    return Z(this, B(b(this._tag))(b(this.value)));
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: ae(this.value)
    };
  }
}), Xm = /* @__PURE__ */ b("None"), Zm = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(cf), {
  _tag: "None",
  _op: "None",
  [P](e) {
    return _c(e) && af(e);
  },
  [L]() {
    return Xm;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
}), _c = (e) => M(e, of), af = (e) => e._tag === "None", uf = (e) => e._tag === "Some", fo = /* @__PURE__ */ Object.create(Zm), Sr = (e) => {
  const t = Object.create(Qm);
  return t.value = e, t;
}, lf = /* @__PURE__ */ Symbol.for("effect/Either"), ff = {
  ...jr,
  [lf]: {
    _R: (e) => e
  },
  [Q]() {
    return this.toJSON();
  },
  toString() {
    return ge(this.toJSON());
  }
}, ep = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(ff), {
  _tag: "Right",
  _op: "Right",
  [P](e) {
    return Sc(e) && hf(e) && x(this.right, e.right);
  },
  [L]() {
    return B(b(this._tag))(b(this.right));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      right: ae(this.right)
    };
  }
}), tp = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(ff), {
  _tag: "Left",
  _op: "Left",
  [P](e) {
    return Sc(e) && bc(e) && x(this.left, e.left);
  },
  [L]() {
    return B(b(this._tag))(b(this.left));
  },
  toJSON() {
    return {
      _id: "Either",
      _tag: this._tag,
      left: ae(this.left)
    };
  }
}), Sc = (e) => M(e, lf), bc = (e) => e._tag === "Left", hf = (e) => e._tag === "Right", np = (e) => {
  const t = Object.create(tp);
  return t.left = e, t;
}, rp = (e) => {
  const t = Object.create(ep);
  return t.right = e, t;
}, sp = (e) => bc(e) ? fo : Sr(e.right), C = rp, T = np, df = Sc, he = bc, it = hf, op = /* @__PURE__ */ f(2, (e, {
  onLeft: t,
  onRight: n
}) => he(e) ? T(t(e.left)) : C(n(e.right))), ip = /* @__PURE__ */ f(2, (e, t) => he(e) ? T(t(e.left)) : C(e.right)), cp = /* @__PURE__ */ f(2, (e, t) => it(e) ? C(t(e.right)) : T(e.left)), wc = /* @__PURE__ */ f(2, (e, {
  onLeft: t,
  onRight: n
}) => he(e) ? t(e.left) : n(e.right)), ap = /* @__PURE__ */ wc({
  onLeft: H,
  onRight: H
}), gf = /* @__PURE__ */ f(2, (e, t) => {
  if (it(e))
    return e.right;
  throw t(e.left);
}), up = /* @__PURE__ */ gf(() => new Error("getOrThrow called on a Left")), mf = (e) => e.length > 0, pf = (e) => (t, n) => t === n ? 0 : e(t, n), lp = /* @__PURE__ */ pf((e, t) => e < t ? -1 : 1), yf = /* @__PURE__ */ f(2, (e, t) => pf((n, r) => e(t(n), t(r)))), fp = (e) => f(2, (t, n) => e(t, n) === 1), k = () => fo, N = Sr, hp = _c, te = af, _e = uf, de = /* @__PURE__ */ f(2, (e, {
  onNone: t,
  onSome: n
}) => te(e) ? t() : n(e.value)), dp = sp, me = /* @__PURE__ */ f(2, (e, t) => te(e) ? t() : e.value), yt = /* @__PURE__ */ f(2, (e, t) => te(e) ? t() : e), gp = /* @__PURE__ */ f(2, (e, t) => te(e) ? N(t()) : e), ho = (e) => e == null ? k() : N(e), rt = /* @__PURE__ */ me(Yl), mp = (e) => (...t) => {
  try {
    return N(e(...t));
  } catch {
    return k();
  }
}, _f = /* @__PURE__ */ f(2, (e, t) => te(e) ? k() : N(t(e.value))), Vn = /* @__PURE__ */ f(2, (e, t) => te(e) ? k() : t(e.value)), pp = /* @__PURE__ */ f(2, (e, t) => te(e) ? k() : ho(t(e.value))), yp = Vn, rr = /* @__PURE__ */ f(2, (e, t) => yp(e, (n) => t(n) ? Sr(n) : fo)), _p = (e) => oo((t, n) => te(t) ? te(n) : te(n) ? !1 : e(t.value, n.value)), Sp = (e) => f(2, (t, n) => te(t) ? !1 : e(t.value, n)), bp = /* @__PURE__ */ mc(), wp = /* @__PURE__ */ Sp(bp), kp = /* @__PURE__ */ f(2, (e, t) => te(e) ? !1 : t(e.value)), Op = (...e) => e, go = (e) => new Array(e), vp = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.max(1, Math.floor(e)), r = new Array(n);
  for (let s = 0; s < n; s++)
    r[s] = t(s);
  return r;
}), X = (e) => Array.isArray(e) ? e : Array.from(e), Ep = (e) => Array.isArray(e) ? e : [e], Tp = /* @__PURE__ */ f(2, (e, {
  onEmpty: t,
  onNonEmpty: n
}) => pe(e) ? n(Me(e), Wt(e)) : t()), Fs = /* @__PURE__ */ f(2, (e, t) => [t, ...e]), Ip = /* @__PURE__ */ f(2, (e, t) => [...e, t]), kc = /* @__PURE__ */ f(2, (e, t) => X(e).concat(X(t))), Be = Array.isArray, $p = (e) => e.length === 0, Rp = $p, _s = mf, pe = mf, Sf = (e, t) => e < 0 || e >= t.length, Np = (e, t) => Math.floor(Math.min(Math.max(0, e), t.length)), Mp = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.floor(t);
  return Sf(n, e) ? k() : N(e[n]);
}), bf = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.floor(t);
  if (Sf(n, e))
    throw new Error(`Index ${n} out of bounds`);
  return e[n];
}), mr = /* @__PURE__ */ Mp(0), Me = /* @__PURE__ */ bf(0), Ap = (e) => pe(e) ? N(wf(e)) : k(), wf = (e) => e[e.length - 1], Wt = (e) => e.slice(1), Fp = (e, t) => {
  let n = 0;
  for (const r of e) {
    if (!t(r, n))
      break;
    n++;
  }
  return n;
}, Cp = /* @__PURE__ */ f(2, (e, t) => Lp(e, Fp(e, t))), Pp = /* @__PURE__ */ f(2, (e, t) => {
  const n = X(e);
  return n.slice(Np(t, n), n.length);
}), La = (e) => Array.from(e).reverse(), br = /* @__PURE__ */ f(2, (e, t) => {
  const n = Array.from(e);
  return n.sort(t), n;
}), Ka = /* @__PURE__ */ f(2, (e, t) => xp(e, t, Op)), xp = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = X(e), s = X(t);
  if (pe(r) && pe(s)) {
    const o = [n(Me(r), Me(s))], i = Math.min(r.length, s.length);
    for (let a = 1; a < i; a++)
      o[a] = n(r[a], s[a]);
    return o;
  }
  return [];
}), jp = /* @__PURE__ */ mc(), Lp = /* @__PURE__ */ f(2, (e, t) => {
  const n = Array.from(e), r = Math.floor(t);
  return pe(n) ? r >= 1 ? Kp(n, r) : [[], n] : [n, []];
}), Kp = /* @__PURE__ */ f(2, (e, t) => {
  const n = Math.max(1, Math.floor(t));
  return n >= e.length ? [lr(e), []] : [Fs(e.slice(1, n), Me(e)), e.slice(n)];
}), lr = (e) => e.slice(), Up = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = X(e), s = X(t);
  return pe(r) ? pe(s) ? vf(n)(kc(r, s)) : r : s;
}), Ss = /* @__PURE__ */ f(2, (e, t) => Up(e, t, jp)), In = () => [], Ve = (e) => [e], bn = /* @__PURE__ */ f(2, (e, t) => e.map(t)), kf = /* @__PURE__ */ f(2, (e, t) => {
  if (Rp(e))
    return [];
  const n = [];
  for (let r = 0; r < e.length; r++) {
    const s = t(e[r], r);
    for (let o = 0; o < s.length; o++)
      n.push(s[o]);
  }
  return n;
}), Dp = /* @__PURE__ */ kf(H), cn = /* @__PURE__ */ f(2, (e, t) => {
  const n = X(e), r = [];
  for (let s = 0; s < n.length; s++) {
    const o = t(n[s], s);
    _e(o) && r.push(o.value);
  }
  return r;
}), GI = /* @__PURE__ */ f(2, (e, t) => {
  const n = X(e), r = [];
  for (let s = 0; s < n.length; s++)
    t(n[s], s) && r.push(n[s]);
  return r;
}), Of = /* @__PURE__ */ f(3, (e, t, n) => X(e).reduce((r, s, o) => n(r, s, o), t)), Ua = (e, t) => {
  const n = [];
  let r = e, s;
  for (; _e(s = t(r)); ) {
    const [o, i] = s.value;
    n.push(o), r = i;
  }
  return n;
}, Oc = Sm, vf = /* @__PURE__ */ f(2, (e, t) => {
  const n = X(e);
  if (pe(n)) {
    const r = [Me(n)], s = Wt(n);
    for (const o of s)
      r.every((i) => !t(o, i)) && r.push(o);
    return r;
  }
  return [];
}), qp = (e) => vf(e, mc()), Wn = /* @__PURE__ */ f(2, (e, t) => X(e).join(t)), Ef = (e, t) => {
  switch (t._tag) {
    case "StringKeyword":
    case "TemplateLiteral":
      return Object.keys(e);
    case "SymbolKeyword":
      return Object.getOwnPropertySymbols(e);
    case "Refinement":
      return Ef(e, t.from);
  }
}, wn = (e) => Object.keys(e).concat(Object.getOwnPropertySymbols(e)), Tf = (e) => {
  let t = !1, n;
  return () => (t || (n = e(), t = !0), n);
}, Bp = (e) => {
  try {
    return e.toISOString();
  } catch {
    return String(e);
  }
}, ct = (e, t = !0) => {
  if (Array.isArray(e))
    return `[${e.map((n) => ct(n, t)).join(",")}]`;
  if (Em(e))
    return Bp(e);
  if (M(e, "toString") && Fr(e.toString) && e.toString !== Object.prototype.toString)
    return e.toString();
  if (ut(e))
    return JSON.stringify(e);
  if (Vt(e) || e == null || lc(e) || _i(e))
    return String(e);
  if (co(e))
    return String(e) + "n";
  if (Ql(e))
    return `${e.constructor.name}(${ct(Array.from(e), t)})`;
  try {
    t && JSON.stringify(e);
    const n = `{${wn(e).map((s) => `${ut(s) ? JSON.stringify(s) : String(s)}:${ct(e[s], !1)}`).join(",")}}`, r = e.constructor.name;
    return e.constructor !== Object.prototype.constructor ? `${r}(${n})` : n;
  } catch {
    return "<circular structure>";
  }
}, Jp = (e) => typeof e == "string" ? JSON.stringify(e) : String(e), If = (e) => Array.isArray(e), Da = (e) => `[${Jp(e)}]`, Vp = (e) => If(e) ? e.map(Da).join("") : Da(e), en = (e, t, n, r) => {
  let s = e;
  return t !== void 0 && (s += `
details: ${t}`), r && (s += `
schema (${r._tag}): ${r}`), s;
}, Wp = (e) => en("Unsupported key schema", void 0, void 0, e), Hp = (e) => en("Unsupported literal", `literal value: ${ct(e)}`), qa = (e) => en("Duplicate index signature", `${e} index signature`), Gp = /* @__PURE__ */ en("Unsupported index signature parameter", "An index signature parameter type must be `string`, `symbol`, a template literal type or a refinement of the previous types"), zp = /* @__PURE__ */ en("Invalid element", "A required element cannot follow an optional element. ts(1257)"), Ba = (e) => en("Duplicate property signature transformation", `Duplicate key ${ct(e)}`), Yp = (e) => en("Duplicate property signature", `Duplicate key ${ct(e)}`), $n = lp, Cs = (e) => e.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&"), Qp = /* @__PURE__ */ Symbol.for("effect/annotation/Brand"), Xp = /* @__PURE__ */ Symbol.for("effect/annotation/SchemaId"), $f = /* @__PURE__ */ Symbol.for("effect/annotation/Message"), vc = /* @__PURE__ */ Symbol.for("effect/annotation/MissingMessage"), Rf = /* @__PURE__ */ Symbol.for("effect/annotation/Identifier"), wt = /* @__PURE__ */ Symbol.for("effect/annotation/Title"), bi = /* @__PURE__ */ Symbol.for("effect/annotation/AutoTitle"), Ur = /* @__PURE__ */ Symbol.for("effect/annotation/Description"), Nf = /* @__PURE__ */ Symbol.for("effect/annotation/Examples"), Mf = /* @__PURE__ */ Symbol.for("effect/annotation/Default"), Af = /* @__PURE__ */ Symbol.for("effect/annotation/JSONSchema"), Ff = /* @__PURE__ */ Symbol.for("effect/annotation/Arbitrary"), Cf = /* @__PURE__ */ Symbol.for("effect/annotation/Pretty"), Pf = /* @__PURE__ */ Symbol.for("effect/annotation/Equivalence"), Zp = /* @__PURE__ */ Symbol.for("effect/annotation/Documentation"), xf = /* @__PURE__ */ Symbol.for("effect/annotation/Concurrency"), jf = /* @__PURE__ */ Symbol.for("effect/annotation/Batching"), Lf = /* @__PURE__ */ Symbol.for("effect/annotation/ParseIssueTitle"), Kf = /* @__PURE__ */ Symbol.for("effect/annotation/ParseOptions"), Uf = /* @__PURE__ */ Symbol.for("effect/annotation/DecodingFallback"), Df = /* @__PURE__ */ Symbol.for("effect/annotation/Surrogate"), ey = /* @__PURE__ */ Symbol.for("effect/annotation/StableFilter"), Ie = /* @__PURE__ */ f(2, (e, t) => Object.prototype.hasOwnProperty.call(e.annotations, t) ? N(e.annotations[t]) : k()), ty = /* @__PURE__ */ Ie(Qp), ny = /* @__PURE__ */ Ie($f), ry = /* @__PURE__ */ Ie(vc), qf = /* @__PURE__ */ Ie(wt), Bf = /* @__PURE__ */ Ie(bi), mo = /* @__PURE__ */ Ie(Rf), Jf = /* @__PURE__ */ Ie(Ur), sy = /* @__PURE__ */ Ie(xf), oy = /* @__PURE__ */ Ie(jf), iy = /* @__PURE__ */ Ie(Lf), cy = /* @__PURE__ */ Ie(Kf), ay = /* @__PURE__ */ Ie(Uf), Vf = /* @__PURE__ */ Ie(Df), uy = /* @__PURE__ */ Ie(ey), ly = (e) => kp(uy(e), (t) => t === !0), Wf = /* @__PURE__ */ Symbol.for("effect/annotation/JSONIdentifier"), fy = /* @__PURE__ */ Ie(Wf), hy = (e) => yt(fy(e), () => mo(e));
class po {
  constructor(t, n, r, s = {}) {
    c(this, "typeParameters");
    c(this, "decodeUnknown");
    c(this, "encodeUnknown");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Declaration");
    this.typeParameters = t, this.decodeUnknown = n, this.encodeUnknown = r, this.annotations = s;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return me(lt(this), () => "<declaration schema>");
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      typeParameters: this.typeParameters.map((t) => t.toJSON()),
      annotations: ue(this.annotations)
    };
  }
}
const Dr = (e) => (t) => t._tag === e;
let Ps = class {
  constructor(t, n = {}) {
    c(this, "literal");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Literal");
    this.literal = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return me(lt(this), () => ct(this.literal));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      literal: co(this.literal) ? String(this.literal) : this.literal,
      annotations: ue(this.annotations)
    };
  }
};
const Ja = /* @__PURE__ */ Dr("Literal"), dy = /* @__PURE__ */ new Ps(null);
class gy {
  constructor(t, n = {}) {
    c(this, "symbol");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "UniqueSymbol");
    this.symbol = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return me(lt(this), () => ct(this.symbol));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      symbol: String(this.symbol),
      annotations: ue(this.annotations)
    };
  }
}
class my {
  constructor(t = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "UndefinedKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return nn(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: ue(this.annotations)
    };
  }
}
const py = /* @__PURE__ */ new my({
  [wt]: "undefined"
});
class yy {
  constructor(t = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "NeverKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return nn(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: ue(this.annotations)
    };
  }
}
const Hf = /* @__PURE__ */ new yy({
  [wt]: "never"
});
class _y {
  constructor(t = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "UnknownKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return nn(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: ue(this.annotations)
    };
  }
}
const Sy = /* @__PURE__ */ new _y({
  [wt]: "unknown"
});
class by {
  constructor(t = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "AnyKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return nn(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: ue(this.annotations)
    };
  }
}
const wy = /* @__PURE__ */ new by({
  [wt]: "any"
});
class ky {
  constructor(t = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "StringKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return nn(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: ue(this.annotations)
    };
  }
}
const Oy = /* @__PURE__ */ new ky({
  [wt]: "string",
  [Ur]: "a string"
}), vy = /* @__PURE__ */ Dr("StringKeyword");
class Ey {
  constructor(t = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "NumberKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return nn(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: ue(this.annotations)
    };
  }
}
const Ty = /* @__PURE__ */ new Ey({
  [wt]: "number",
  [Ur]: "a number"
});
class Iy {
  constructor(t = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "BooleanKeyword");
    this.annotations = t;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return nn(this);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      annotations: ue(this.annotations)
    };
  }
}
const $y = /* @__PURE__ */ new Iy({
  [wt]: "boolean",
  [Ur]: "a boolean"
}), Ry = /* @__PURE__ */ Dr("SymbolKeyword");
let yo = class {
  constructor(t, n = {}) {
    c(this, "type");
    c(this, "annotations");
    this.type = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      annotations: ue(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type);
  }
};
class tn extends yo {
  constructor(n, r, s = {}) {
    super(n, s);
    c(this, "isOptional");
    this.isOptional = r;
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      type: this.type.toJSON(),
      isOptional: this.isOptional,
      annotations: ue(this.annotations)
    };
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return String(this.type) + (this.isOptional ? "?" : "");
  }
}
const Gf = (e) => e.map((t) => t.type);
class Ec {
  constructor(t, n, r, s = {}) {
    c(this, "elements");
    c(this, "rest");
    c(this, "isReadonly");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "TupleType");
    this.elements = t, this.rest = n, this.isReadonly = r, this.annotations = s;
    let o = !1, i = !1;
    for (const a of t)
      if (a.isOptional)
        o = !0;
      else if (o) {
        i = !0;
        break;
      }
    if (i || o && n.length > 1)
      throw new Error(zp);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return me(lt(this), () => Ny(this));
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
      annotations: ue(this.annotations)
    };
  }
}
const Ny = (e) => {
  const t = e.elements.map(String).join(", ");
  return Tp(e.rest, {
    onEmpty: () => `readonly [${t}]`,
    onNonEmpty: (n, r) => {
      const s = String(n), o = s.includes(" | ") ? `(${s})` : s;
      if (r.length > 0) {
        const i = r.map(String).join(", ");
        return e.elements.length > 0 ? `readonly [${t}, ...${o}[], ${i}]` : `readonly [...${o}[], ${i}]`;
      } else
        return e.elements.length > 0 ? `readonly [${t}, ...${o}[]]` : `ReadonlyArray<${s}>`;
    }
  });
};
class Oe extends tn {
  constructor(n, r, s, o, i) {
    super(r, s, i);
    c(this, "name");
    c(this, "isReadonly");
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
      annotations: ue(this.annotations)
    };
  }
}
const zf = (e) => {
  switch (e._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return !0;
    case "Refinement":
      return zf(e.from);
  }
  return !1;
};
class _o {
  constructor(t, n, r) {
    c(this, "type");
    c(this, "isReadonly");
    /**
     * @since 3.10.0
     */
    c(this, "parameter");
    if (this.type = n, this.isReadonly = r, zf(t))
      this.parameter = t;
    else
      throw new Error(Gp);
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
class Dt {
  constructor(t, n, r = {}) {
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "TypeLiteral");
    /**
     * @since 3.10.0
     */
    c(this, "propertySignatures");
    /**
     * @since 3.10.0
     */
    c(this, "indexSignatures");
    this.annotations = r;
    const s = {};
    for (let i = 0; i < t.length; i++) {
      const a = t[i].name;
      if (Object.prototype.hasOwnProperty.call(s, a))
        throw new Error(Yp(a));
      s[a] = null;
    }
    const o = {
      string: !1,
      symbol: !1
    };
    for (let i = 0; i < n.length; i++) {
      const a = nh(n[i].parameter);
      if (vy(a)) {
        if (o.string)
          throw new Error(qa("string"));
        o.string = !0;
      } else if (Ry(a)) {
        if (o.symbol)
          throw new Error(qa("symbol"));
        o.symbol = !0;
      }
    }
    this.propertySignatures = t, this.indexSignatures = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return me(lt(this), () => My(this));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      propertySignatures: this.propertySignatures.map((t) => t.toJSON()),
      indexSignatures: this.indexSignatures.map((t) => t.toJSON()),
      annotations: ue(this.annotations)
    };
  }
}
const Va = (e) => e.map(String).join("; "), My = (e) => {
  if (e.propertySignatures.length > 0) {
    const t = e.propertySignatures.map(String).join("; ");
    return e.indexSignatures.length > 0 ? `{ ${t}; ${Va(e.indexSignatures)} }` : `{ ${t} }`;
  } else
    return e.indexSignatures.length > 0 ? `{ ${Va(e.indexSignatures)} }` : "{}";
}, Ay = /* @__PURE__ */ br(/* @__PURE__ */ yf($n, (e) => {
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
})), Fy = {
  string: "StringKeyword",
  number: "NumberKeyword",
  boolean: "BooleanKeyword",
  bigint: "BigIntKeyword"
}, Yf = (e) => kf(e, (t) => Qf(t) ? Yf(t.types) : [t]), Cy = (e) => {
  const t = Ay(e), n = [], r = {}, s = [];
  for (const o of t)
    switch (o._tag) {
      case "NeverKeyword":
        break;
      case "AnyKeyword":
        return [wy];
      case "UnknownKeyword":
        return [Sy];
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
        const i = typeof o.literal;
        switch (i) {
          case "string":
          case "number":
          case "bigint":
          case "boolean": {
            const a = Fy[i];
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
var pt;
let st = (pt = class {
  constructor(t, n = {}) {
    c(this, "types");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Union");
    this.types = t, this.annotations = n;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return me(lt(this), () => this.types.map(String).join(" | "));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      types: this.types.map((t) => t.toJSON()),
      annotations: ue(this.annotations)
    };
  }
}, c(pt, "make", (t, n) => Tc(t) ? new pt(t, n) : t.length === 1 ? t[0] : Hf), /** @internal */
c(pt, "unify", (t, n) => pt.make(Cy(Yf(t)), n)), pt);
const Py = (e, t) => e.map(t), Tc = (e) => e.length > 1, Qf = /* @__PURE__ */ Dr("Union"), Xo = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/Schema/AST/toJSONMemoMap"), () => /* @__PURE__ */ new WeakMap());
class Ic {
  constructor(t, n = {}) {
    c(this, "f");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Suspend");
    this.f = t, this.annotations = n, this.f = Tf(t);
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return lt(this).pipe(yt(() => Vn(mp(this.f)(), (t) => lt(t))), me(() => "<suspended schema>"));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    const t = this.f();
    let n = Xo.get(t);
    return n || (Xo.set(t, {
      _tag: this._tag
    }), n = {
      _tag: this._tag,
      ast: t.toJSON(),
      annotations: ue(this.annotations)
    }, Xo.set(t, n), n);
  }
}
let xy = class {
  constructor(t, n, r = {}) {
    c(this, "from");
    c(this, "filter");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Refinement");
    this.from = t, this.filter = n, this.annotations = r;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return mo(this).pipe(me(() => de(rh(this), {
      onNone: () => `{ ${this.from} | filter }`,
      onSome: (t) => $c(this.from) ? String(this.from) + " & " + t : t
    })));
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      annotations: ue(this.annotations)
    };
  }
};
const $c = /* @__PURE__ */ Dr("Refinement"), Zo = {};
let Xf = class {
  constructor(t, n, r, s = {}) {
    c(this, "from");
    c(this, "to");
    c(this, "transformation");
    c(this, "annotations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Transformation");
    this.from = t, this.to = n, this.transformation = r, this.annotations = s;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return me(lt(this), () => `(${String(this.from)} <-> ${String(this.to)})`);
  }
  /**
   * @since 3.10.0
   */
  toJSON() {
    return {
      _tag: this._tag,
      from: this.from.toJSON(),
      to: this.to.toJSON(),
      annotations: ue(this.annotations)
    };
  }
};
class jy {
  constructor(t, n) {
    c(this, "decode");
    c(this, "encode");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "FinalTransformation");
    this.decode = t, this.encode = n;
  }
}
let Ly = class {
  constructor(t, n, r, s) {
    c(this, "from");
    c(this, "to");
    c(this, "decode");
    c(this, "encode");
    this.from = t, this.to = n, this.decode = r, this.encode = s;
  }
};
class Ky {
  constructor(t) {
    c(this, "propertySignatureTransformations");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "TypeLiteralTransformation");
    this.propertySignatureTransformations = t;
    const n = {}, r = {};
    for (const s of t) {
      const o = s.from;
      if (n[o])
        throw new Error(Ba(o));
      n[o] = !0;
      const i = s.to;
      if (r[i])
        throw new Error(Ba(i));
      r[i] = !0;
    }
  }
}
const Rn = (e, t) => {
  const n = Object.getOwnPropertyDescriptors(e), r = {
    ...e.annotations,
    ...t
  }, s = Vf(e);
  return _e(s) && (r[Df] = Rn(s.value, t)), n.annotations.value = r, Object.create(Object.getPrototypeOf(e), n);
}, Uy = "[\\s\\S]*", Dy = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?", Zf = (e, t) => {
  switch (e._tag) {
    case "Literal":
      return Cs(String(e.literal));
    case "StringKeyword":
      return Uy;
    case "NumberKeyword":
      return Dy;
    case "TemplateLiteral":
      return eh(e);
    case "Union":
      return e.types.map((n) => Zf(n)).join("|");
  }
}, qy = (e, t, n, r) => Qf(e) ? `(${t})` : t, eh = (e, t, n) => {
  let r = "";
  if (e.head !== "") {
    const s = Cs(e.head);
    r += s;
  }
  for (const s of e.spans) {
    const o = Zf(s.type);
    if (r += qy(s.type, o), s.literal !== "") {
      const i = Cs(s.literal);
      r += i;
    }
  }
  return r;
}, By = (e) => new RegExp(`^${eh(e)}$`), Wa = (e, t) => {
  const n = [], r = [], s = (o) => {
    switch (o._tag) {
      case "NeverKeyword":
        break;
      case "StringKeyword":
      case "SymbolKeyword":
      case "TemplateLiteral":
      case "Refinement":
        r.push(new _o(o, t, !0));
        break;
      case "Literal":
        if (ut(o.literal) || Vt(o.literal))
          n.push(new Oe(o.literal, t, !1, !0));
        else
          throw new Error(Hp(o.literal));
        break;
      case "Enums": {
        for (const [i, a] of o.enums)
          n.push(new Oe(a, t, !1, !0));
        break;
      }
      case "UniqueSymbol":
        n.push(new Oe(o.symbol, t, !1, !0));
        break;
      case "Union":
        o.types.forEach(s);
        break;
      default:
        throw new Error(Wp(o));
    }
  };
  return s(e), {
    propertySignatures: n,
    indexSignatures: r
  };
}, th = (e) => (t) => {
  let n;
  for (const r of e)
    Object.prototype.hasOwnProperty.call(t.annotations, r) && (n === void 0 && (n = {}), n[r] = t.annotations[r]);
  return n;
}, Jy = /* @__PURE__ */ th([Nf, Mf, Af, Ff, Cf, Pf]), oe = (e) => {
  switch (e._tag) {
    case "Declaration": {
      const t = Ue(e.typeParameters, oe);
      return t === e.typeParameters ? e : new po(t, e.decodeUnknown, e.encodeUnknown, e.annotations);
    }
    case "TupleType": {
      const t = Ue(e.elements, (s) => {
        const o = oe(s.type);
        return o === s.type ? s : new tn(o, s.isOptional);
      }), n = Gf(e.rest), r = Ue(n, oe);
      return t === e.elements && r === n ? e : new Ec(t, r.map((s) => new yo(s)), e.isReadonly, e.annotations);
    }
    case "TypeLiteral": {
      const t = Ue(e.propertySignatures, (r) => {
        const s = oe(r.type);
        return s === r.type ? r : new Oe(r.name, s, r.isOptional, r.isReadonly);
      }), n = Ue(e.indexSignatures, (r) => {
        const s = oe(r.type);
        return s === r.type ? r : new _o(r.parameter, s, r.isReadonly);
      });
      return t === e.propertySignatures && n === e.indexSignatures ? e : new Dt(t, n, e.annotations);
    }
    case "Union": {
      const t = Ue(e.types, oe);
      return t === e.types ? e : st.make(t, e.annotations);
    }
    case "Suspend":
      return new Ic(() => oe(e.f()), e.annotations);
    case "Refinement": {
      const t = oe(e.from);
      return t === e.from ? e : new xy(t, e.filter, e.annotations);
    }
    case "Transformation": {
      const t = Jy(e);
      return oe(t !== void 0 ? Rn(e.to, t) : e.to);
    }
  }
  return e;
}, an = (e) => de(hy(e), {
  onNone: () => {
  },
  onSome: (t) => ({
    [Wf]: t
  })
});
function Ue(e, t) {
  let n = !1;
  const r = go(e.length);
  for (let s = 0; s < e.length; s++) {
    const o = e[s], i = t(o);
    i !== o && (n = !0), r[s] = i;
  }
  return n ? r : e;
}
const et = (e, t) => {
  switch (e._tag) {
    case "Declaration": {
      const n = Ue(e.typeParameters, (r) => et(r));
      return n === e.typeParameters ? e : new po(n, e.decodeUnknown, e.encodeUnknown, e.annotations);
    }
    case "TupleType": {
      const n = Ue(e.elements, (o) => {
        const i = et(o.type);
        return i === o.type ? o : new tn(i, o.isOptional);
      }), r = Gf(e.rest), s = Ue(r, (o) => et(o));
      return n === e.elements && s === r ? e : new Ec(n, s.map((o) => new yo(o)), e.isReadonly, an(e));
    }
    case "TypeLiteral": {
      const n = Ue(e.propertySignatures, (s) => {
        const o = et(s.type);
        return o === s.type ? s : new Oe(s.name, o, s.isOptional, s.isReadonly);
      }), r = Ue(e.indexSignatures, (s) => {
        const o = et(s.type);
        return o === s.type ? s : new _o(s.parameter, o, s.isReadonly);
      });
      return n === e.propertySignatures && r === e.indexSignatures ? e : new Dt(n, r, an(e));
    }
    case "Union": {
      const n = Ue(e.types, (r) => et(r));
      return n === e.types ? e : st.make(n, an(e));
    }
    case "Suspend":
      return new Ic(() => et(e.f()), an(e));
    case "Refinement": {
      const n = et(e.from), r = an(e);
      return r ? Rn(n, r) : n;
    }
    case "Transformation": {
      const n = an(e);
      return et(n ? Rn(e.from, n) : e.from);
    }
  }
  return e;
}, Ha = (e) => et(e), ue = (e) => {
  const t = {};
  for (const n of Object.getOwnPropertySymbols(e))
    t[String(n)] = e[n];
  return t;
}, nh = (e) => {
  switch (e._tag) {
    case "StringKeyword":
    case "SymbolKeyword":
    case "TemplateLiteral":
      return e;
    case "Refinement":
      return nh(e.from);
  }
}, nn = (e) => me(lt(e), () => e._tag);
function Vy(e) {
  return de(ty(e), {
    onNone: () => "",
    onSome: (t) => t.map((n) => ` & Brand<${ct(n)}>`).join("")
  });
}
const rh = (e) => qf(e).pipe(yt(() => Jf(e)), yt(() => Bf(e)), _f((t) => t + Vy(e))), lt = (e) => yt(mo(e), () => rh(e)), Wy = /* @__PURE__ */ Symbol.for("effect/Context/Tag"), xs = /* @__PURE__ */ Symbol.for("effect/Context/Reference"), Hy = "effect/STM", Gy = /* @__PURE__ */ Symbol.for(Hy), sh = {
  ...jr,
  _op: "Tag",
  [Gy]: Tn,
  [Wy]: {
    _Service: (e) => e,
    _Identifier: (e) => e
  },
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Tag",
      key: this.key,
      stack: this.stack
    };
  },
  [Q]() {
    return this.toJSON();
  },
  of(e) {
    return e;
  },
  context(e) {
    return ih(this, e);
  }
}, zy = {
  ...sh,
  [xs]: xs
}, Yy = (e) => {
  const t = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const n = new Error();
  Error.stackTraceLimit = t;
  const r = Object.create(sh);
  return Object.defineProperty(r, "stack", {
    get() {
      return n.stack;
    }
  }), r.key = e, r;
}, Qy = () => (e, t) => {
  const n = Error.stackTraceLimit;
  Error.stackTraceLimit = 2;
  const r = new Error();
  Error.stackTraceLimit = n;
  function s() {
  }
  return Object.setPrototypeOf(s, zy), s.key = e, s.defaultValue = t.defaultValue, Object.defineProperty(s, "stack", {
    get() {
      return r.stack;
    }
  }), s;
}, oh = /* @__PURE__ */ Symbol.for("effect/Context"), Xy = {
  [oh]: {
    _Services: (e) => e
  },
  [P](e) {
    if (e_(e) && this.unsafeMap.size === e.unsafeMap.size) {
      for (const t of this.unsafeMap.keys())
        if (!e.unsafeMap.has(t) || !x(this.unsafeMap.get(t), e.unsafeMap.get(t)))
          return !1;
      return !0;
    }
    return !1;
  },
  [L]() {
    return Z(this, gc(this.unsafeMap.size));
  },
  pipe() {
    return v(this, arguments);
  },
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.unsafeMap).map(ae)
    };
  },
  [Q]() {
    return this.toJSON();
  }
}, Nn = (e) => {
  const t = Object.create(Xy);
  return t.unsafeMap = e, t;
}, Zy = (e) => {
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
}, e_ = (e) => M(e, oh), t_ = (e) => M(e, xs), n_ = /* @__PURE__ */ Nn(/* @__PURE__ */ new Map()), r_ = () => n_, ih = (e, t) => Nn(/* @__PURE__ */ new Map([[e.key, t]])), s_ = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = new Map(e.unsafeMap);
  return r.set(t.key, n), Nn(r);
}), ei = /* @__PURE__ */ J("effect/Context/defaultValueCache", () => /* @__PURE__ */ new Map()), Rc = (e) => {
  if (ei.has(e.key))
    return ei.get(e.key);
  const t = e.defaultValue();
  return ei.set(e.key, t), t;
}, o_ = (e, t) => e.unsafeMap.has(t.key) ? e.unsafeMap.get(t.key) : Rc(t), ch = /* @__PURE__ */ f(2, (e, t) => {
  if (!e.unsafeMap.has(t.key)) {
    if (xs in t) return Rc(t);
    throw Zy(t);
  }
  return e.unsafeMap.get(t.key);
}), i_ = ch, c_ = /* @__PURE__ */ f(2, (e, t) => e.unsafeMap.has(t.key) ? Sr(e.unsafeMap.get(t.key)) : t_(t) ? Sr(Rc(t)) : fo), a_ = /* @__PURE__ */ f(2, (e, t) => {
  const n = new Map(e.unsafeMap);
  for (const [r, s] of t.unsafeMap)
    n.set(r, s);
  return Nn(n);
}), rn = Yy, Nc = r_, u_ = ih, sr = s_, ah = i_, uh = ch, qr = c_, lh = a_, fh = Qy, hh = /* @__PURE__ */ Symbol.for("effect/Chunk");
function l_(e, t, n, r, s) {
  for (let o = t; o < Math.min(e.length, t + s); o++)
    n[r + o - t] = e[o];
  return n;
}
const dh = [], f_ = (e) => oo((t, n) => t.length === n.length && qt(t).every((r, s) => e(r, kn(n, s)))), h_ = /* @__PURE__ */ f_(x), d_ = {
  [hh]: {
    _A: (e) => e
  },
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: qt(this).map(ae)
    };
  },
  [Q]() {
    return this.toJSON();
  },
  [P](e) {
    return gh(e) && h_(this, e);
  },
  [L]() {
    return Z(this, Pr(qt(this)));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray":
        return this.backing.array[Symbol.iterator]();
      case "IEmpty":
        return dh[Symbol.iterator]();
      default:
        return qt(this)[Symbol.iterator]();
    }
  },
  pipe() {
    return v(this, arguments);
  }
}, se = (e) => {
  const t = Object.create(d_);
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
      t.length = e.array.length, t.depth = 0, t.left = ot, t.right = ot;
      break;
    }
    case "ISingleton": {
      t.length = 1, t.depth = 0, t.left = ot, t.right = ot;
      break;
    }
    case "ISlice": {
      t.length = e.length, t.depth = e.chunk.depth + 1, t.left = ot, t.right = ot;
      break;
    }
  }
  return t;
}, gh = (e) => M(e, hh), ot = /* @__PURE__ */ se({
  _tag: "IEmpty"
}), St = () => ot, ti = (...e) => p_(e), Ce = (e) => se({
  _tag: "ISingleton",
  a: e
}), mh = (e) => gh(e) ? e : So(X(e)), wi = (e, t, n) => {
  switch (e.backing._tag) {
    case "IArray": {
      l_(e.backing.array, 0, t, n, e.length);
      break;
    }
    case "IConcat": {
      wi(e.left, t, n), wi(e.right, t, n + e.left.length);
      break;
    }
    case "ISingleton": {
      t[n] = e.backing.a;
      break;
    }
    case "ISlice": {
      let r = 0, s = n;
      for (; r < e.length; )
        t[s] = kn(e, r), r += 1, s += 1;
      break;
    }
  }
}, g_ = (e) => {
  switch (e.backing._tag) {
    case "IEmpty":
      return dh;
    case "IArray":
      return e.backing.array;
    default: {
      const t = new Array(e.length);
      return wi(e, t, 0), e.backing = {
        _tag: "IArray",
        array: t
      }, e.left = ot, e.right = ot, e.depth = 0, t;
    }
  }
}, qt = g_, m_ = (e) => {
  switch (e.backing._tag) {
    case "IEmpty":
    case "ISingleton":
      return e;
    case "IArray":
      return se({
        _tag: "IArray",
        array: La(e.backing.array)
      });
    case "IConcat":
      return se({
        _tag: "IConcat",
        left: Mn(e.backing.right),
        right: Mn(e.backing.left)
      });
    case "ISlice":
      return So(La(qt(e)));
  }
}, Mn = m_, So = (e) => e.length === 0 ? St() : e.length === 1 ? Ce(e[0]) : se({
  _tag: "IArray",
  array: e
}), p_ = (e) => So(e), kn = /* @__PURE__ */ f(2, (e, t) => {
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
      return t < e.left.length ? kn(e.left, t) : kn(e.right, t - e.left.length);
    case "ISlice":
      return kn(e.backing.chunk, t + e.backing.offset);
  }
}), y_ = /* @__PURE__ */ f(2, (e, t) => He(e, Ce(t))), Qe = /* @__PURE__ */ f(2, (e, t) => He(Ce(t), e)), ki = /* @__PURE__ */ f(2, (e, t) => {
  if (t <= 0)
    return e;
  if (t >= e.length)
    return ot;
  switch (e.backing._tag) {
    case "ISlice":
      return se({
        _tag: "ISlice",
        chunk: e.backing.chunk,
        offset: e.backing.offset + t,
        length: e.backing.length - t
      });
    case "IConcat":
      return t > e.left.length ? ki(e.right, t - e.left.length) : se({
        _tag: "IConcat",
        left: ki(e.left, t),
        right: e.right
      });
    default:
      return se({
        _tag: "ISlice",
        chunk: e,
        offset: t,
        length: e.length - t
      });
  }
}), He = /* @__PURE__ */ f(2, (e, t) => {
  if (e.backing._tag === "IEmpty")
    return t;
  if (t.backing._tag === "IEmpty")
    return e;
  const n = t.depth - e.depth;
  if (Math.abs(n) <= 1)
    return se({
      _tag: "IConcat",
      left: e,
      right: t
    });
  if (n < -1)
    if (e.left.depth >= e.right.depth) {
      const r = He(e.right, t);
      return se({
        _tag: "IConcat",
        left: e.left,
        right: r
      });
    } else {
      const r = He(e.right.right, t);
      if (r.depth === e.depth - 3) {
        const s = se({
          _tag: "IConcat",
          left: e.right.left,
          right: r
        });
        return se({
          _tag: "IConcat",
          left: e.left,
          right: s
        });
      } else {
        const s = se({
          _tag: "IConcat",
          left: e.left,
          right: e.right.left
        });
        return se({
          _tag: "IConcat",
          left: s,
          right: r
        });
      }
    }
  else if (t.right.depth >= t.left.depth) {
    const r = He(e, t.left);
    return se({
      _tag: "IConcat",
      left: r,
      right: t.right
    });
  } else {
    const r = He(e, t.left.left);
    if (r.depth === t.depth - 3) {
      const s = se({
        _tag: "IConcat",
        left: r,
        right: t.left.right
      });
      return se({
        _tag: "IConcat",
        left: s,
        right: t.right
      });
    } else {
      const s = se({
        _tag: "IConcat",
        left: t.left.right,
        right: t.right
      });
      return se({
        _tag: "IConcat",
        left: r,
        right: s
      });
    }
  }
}), __ = (e) => e.length === 0, An = (e) => e.length > 0, ph = (e) => kn(e, 0), Fn = ph, jt = (e) => ki(e, 1), Oi = /* @__PURE__ */ Symbol.for("effect/Duration"), yh = /* @__PURE__ */ BigInt(0), Ga = /* @__PURE__ */ BigInt(24), ss = /* @__PURE__ */ BigInt(60), vi = /* @__PURE__ */ BigInt(1e3), za = /* @__PURE__ */ BigInt(1e6), Ya = /* @__PURE__ */ BigInt(1e9), S_ = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/, bt = (e) => {
  if (_h(e))
    return e;
  if (Vt(e))
    return Ei(e);
  if (co(e))
    return ni(e);
  if (Array.isArray(e) && e.length === 2 && e.every(Vt))
    return e[0] === -1 / 0 || e[1] === -1 / 0 || Number.isNaN(e[0]) || Number.isNaN(e[1]) ? Sh : e[0] === 1 / 0 || e[1] === 1 / 0 ? O_ : ni(BigInt(Math.round(e[0] * 1e9)) + BigInt(Math.round(e[1])));
  if (ut(e)) {
    const t = S_.exec(e);
    if (t) {
      const [n, r, s] = t, o = Number(r);
      switch (s) {
        case "nano":
        case "nanos":
          return ni(BigInt(r));
        case "micro":
        case "micros":
          return v_(BigInt(r));
        case "milli":
        case "millis":
          return Ei(o);
        case "second":
        case "seconds":
          return E_(o);
        case "minute":
        case "minutes":
          return T_(o);
        case "hour":
        case "hours":
          return I_(o);
        case "day":
        case "days":
          return $_(o);
        case "week":
        case "weeks":
          return R_(o);
      }
    }
  }
  throw new Error("Invalid DurationInput");
}, Qa = {
  _tag: "Millis",
  millis: 0
}, b_ = {
  _tag: "Infinity"
}, w_ = {
  [Oi]: Oi,
  [L]() {
    return Z(this, ef(this.value));
  },
  [P](e) {
    return _h(e) && P_(this, e);
  },
  toString() {
    return `Duration(${j_(this)})`;
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
          hrtime: M_(this)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
    }
  },
  [Q]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, ft = (e) => {
  const t = Object.create(w_);
  return Vt(e) ? isNaN(e) || e <= 0 ? t.value = Qa : Number.isFinite(e) ? Number.isInteger(e) ? t.value = {
    _tag: "Millis",
    millis: e
  } : t.value = {
    _tag: "Nanos",
    nanos: BigInt(Math.round(e * 1e6))
  } : t.value = b_ : e <= yh ? t.value = Qa : t.value = {
    _tag: "Nanos",
    nanos: e
  }, t;
}, _h = (e) => M(e, Oi), k_ = (e) => {
  switch (e.value._tag) {
    case "Millis":
      return e.value.millis === 0;
    case "Nanos":
      return e.value.nanos === yh;
    case "Infinity":
      return !1;
  }
}, Sh = /* @__PURE__ */ ft(0), O_ = /* @__PURE__ */ ft(1 / 0), ni = (e) => ft(e), v_ = (e) => ft(e * vi), Ei = (e) => ft(e), E_ = (e) => ft(e * 1e3), T_ = (e) => ft(e * 6e4), I_ = (e) => ft(e * 36e5), $_ = (e) => ft(e * 864e5), R_ = (e) => ft(e * 6048e5), Ti = (e) => A_(e, {
  onMillis: (t) => t,
  onNanos: (t) => Number(t) / 1e6
}), N_ = (e) => {
  const t = bt(e);
  switch (t.value._tag) {
    case "Infinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return t.value.nanos;
    case "Millis":
      return BigInt(Math.round(t.value.millis * 1e6));
  }
}, M_ = (e) => {
  const t = bt(e);
  switch (t.value._tag) {
    case "Infinity":
      return [1 / 0, 0];
    case "Nanos":
      return [Number(t.value.nanos / Ya), Number(t.value.nanos % Ya)];
    case "Millis":
      return [Math.floor(t.value.millis / 1e3), Math.round(t.value.millis % 1e3 * 1e6)];
  }
}, A_ = /* @__PURE__ */ f(2, (e, t) => {
  const n = bt(e);
  switch (n.value._tag) {
    case "Nanos":
      return t.onNanos(n.value.nanos);
    case "Infinity":
      return t.onMillis(1 / 0);
    case "Millis":
      return t.onMillis(n.value.millis);
  }
}), bh = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = bt(e), s = bt(t);
  if (r.value._tag === "Infinity" || s.value._tag === "Infinity")
    return n.onMillis(Ti(r), Ti(s));
  if (r.value._tag === "Nanos" || s.value._tag === "Nanos") {
    const o = r.value._tag === "Nanos" ? r.value.nanos : BigInt(Math.round(r.value.millis * 1e6)), i = s.value._tag === "Nanos" ? s.value.nanos : BigInt(Math.round(s.value.millis * 1e6));
    return n.onNanos(o, i);
  }
  return n.onMillis(r.value.millis, s.value.millis);
}), F_ = (e, t) => bh(e, t, {
  onMillis: (n, r) => n === r,
  onNanos: (n, r) => n === r
}), C_ = /* @__PURE__ */ f(2, (e, t) => bh(e, t, {
  onMillis: (n, r) => n >= r,
  onNanos: (n, r) => n >= r
})), P_ = /* @__PURE__ */ f(2, (e, t) => F_(bt(e), bt(t))), x_ = (e) => {
  const t = bt(e);
  if (t.value._tag === "Infinity")
    return {
      days: 1 / 0,
      hours: 1 / 0,
      minutes: 1 / 0,
      seconds: 1 / 0,
      millis: 1 / 0,
      nanos: 1 / 0
    };
  const n = N_(t), r = n / za, s = r / vi, o = s / ss, i = o / ss, a = i / Ga;
  return {
    days: Number(a),
    hours: Number(i % Ga),
    minutes: Number(o % ss),
    seconds: Number(s % ss),
    millis: Number(r % vi),
    nanos: Number(n % za)
  };
}, j_ = (e) => {
  const t = bt(e);
  if (t.value._tag === "Infinity")
    return "Infinity";
  if (k_(t))
    return "0";
  const n = x_(t), r = [];
  return n.days !== 0 && r.push(`${n.days}d`), n.hours !== 0 && r.push(`${n.hours}h`), n.minutes !== 0 && r.push(`${n.minutes}m`), n.seconds !== 0 && r.push(`${n.seconds}s`), n.millis !== 0 && r.push(`${n.millis}ms`), n.nanos !== 0 && r.push(`${n.nanos}ns`), r.join(" ");
}, Ht = 5, Mc = /* @__PURE__ */ Math.pow(2, Ht), L_ = Mc - 1, K_ = Mc / 2, U_ = Mc / 4;
function D_(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), e = e + (e >> 4) & 252645135, e += e >> 8, e += e >> 16, e & 127;
}
function Cn(e, t) {
  return t >>> e & L_;
}
function yn(e) {
  return 1 << e;
}
function wh(e, t) {
  return D_(e & t - 1);
}
const q_ = (e, t) => ({
  value: e,
  previous: t
});
function On(e, t, n, r) {
  let s = r;
  if (!e) {
    const o = r.length;
    s = new Array(o);
    for (let i = 0; i < o; ++i) s[i] = r[i];
  }
  return s[t] = n, s;
}
function kh(e, t, n) {
  const r = n.length - 1;
  let s = 0, o = 0, i = n;
  if (e)
    s = o = t;
  else
    for (i = new Array(r); s < t; ) i[o++] = n[s++];
  for (++s; s <= r; ) i[o++] = n[s++];
  return e && (i.length = r), i;
}
function B_(e, t, n, r) {
  const s = r.length;
  if (e) {
    let u = s;
    for (; u >= t; ) r[u--] = r[u];
    return r[t] = n, r;
  }
  let o = 0, i = 0;
  const a = new Array(s + 1);
  for (; o < t; ) a[i++] = r[o++];
  for (a[t] = n; o < s; ) a[++i] = r[o++];
  return a;
}
class Nt {
  constructor() {
    c(this, "_tag", "EmptyNode");
  }
  modify(t, n, r, s, o, i) {
    const a = r(k());
    return te(a) ? new Nt() : (++i.value, new Bt(t, s, o, a));
  }
}
function Ge(e) {
  return hc(e, "EmptyNode");
}
function J_(e) {
  return Ge(e) || e._tag === "LeafNode" || e._tag === "CollisionNode";
}
function bo(e, t) {
  return Ge(e) ? !1 : t === e.edit;
}
class Bt {
  constructor(t, n, r, s) {
    c(this, "edit");
    c(this, "hash");
    c(this, "key");
    c(this, "value");
    c(this, "_tag", "LeafNode");
    this.edit = t, this.hash = n, this.key = r, this.value = s;
  }
  modify(t, n, r, s, o, i) {
    if (x(o, this.key)) {
      const u = r(this.value);
      return u === this.value ? this : te(u) ? (--i.value, new Nt()) : bo(this, t) ? (this.value = u, this) : new Bt(t, s, o, u);
    }
    const a = r(k());
    return te(a) ? this : (++i.value, Oh(t, n, this.hash, this, s, new Bt(t, s, o, a)));
  }
}
class Ac {
  constructor(t, n, r) {
    c(this, "edit");
    c(this, "hash");
    c(this, "children");
    c(this, "_tag", "CollisionNode");
    this.edit = t, this.hash = n, this.children = r;
  }
  modify(t, n, r, s, o, i) {
    if (s === this.hash) {
      const u = bo(this, t), l = this.updateCollisionList(u, t, this.hash, this.children, r, o, i);
      return l === this.children ? this : l.length > 1 ? new Ac(t, this.hash, l) : l[0];
    }
    const a = r(k());
    return te(a) ? this : (++i.value, Oh(t, n, this.hash, this, s, new Bt(t, s, o, a)));
  }
  updateCollisionList(t, n, r, s, o, i, a) {
    const u = s.length;
    for (let h = 0; h < u; ++h) {
      const d = s[h];
      if ("key" in d && x(i, d.key)) {
        const p = d.value, m = o(p);
        return m === p ? s : te(m) ? (--a.value, kh(t, h, s)) : On(t, h, new Bt(n, r, i, m), s);
      }
    }
    const l = o(k());
    return te(l) ? s : (++a.value, On(t, u, new Bt(n, r, i, l), s));
  }
}
class Pn {
  constructor(t, n, r) {
    c(this, "edit");
    c(this, "mask");
    c(this, "children");
    c(this, "_tag", "IndexedNode");
    this.edit = t, this.mask = n, this.children = r;
  }
  modify(t, n, r, s, o, i) {
    const a = this.mask, u = this.children, l = Cn(n, s), h = yn(l), d = wh(a, h), p = a & h, m = bo(this, t);
    if (!p) {
      const U = new Nt().modify(t, n + Ht, r, s, o, i);
      return U ? u.length >= K_ ? W_(t, l, U, a, u) : new Pn(t, a | h, B_(m, d, U, u)) : this;
    }
    const y = u[d], O = y.modify(t, n + Ht, r, s, o, i);
    if (y === O) return this;
    let _ = a, S;
    if (Ge(O)) {
      if (_ &= ~h, !_) return new Nt();
      if (u.length <= 2 && J_(u[d ^ 1]))
        return u[d ^ 1];
      S = kh(m, d, u);
    } else
      S = On(m, d, O, u);
    return m ? (this.mask = _, this.children = S, this) : new Pn(t, _, S);
  }
}
class Fc {
  constructor(t, n, r) {
    c(this, "edit");
    c(this, "size");
    c(this, "children");
    c(this, "_tag", "ArrayNode");
    this.edit = t, this.size = n, this.children = r;
  }
  modify(t, n, r, s, o, i) {
    let a = this.size;
    const u = this.children, l = Cn(n, s), h = u[l], d = (h || new Nt()).modify(t, n + Ht, r, s, o, i);
    if (h === d) return this;
    const p = bo(this, t);
    let m;
    if (Ge(h) && !Ge(d))
      ++a, m = On(p, l, d, u);
    else if (!Ge(h) && Ge(d)) {
      if (--a, a <= U_)
        return V_(t, a, l, u);
      m = On(p, l, new Nt(), u);
    } else
      m = On(p, l, d, u);
    return p ? (this.size = a, this.children = m, this) : new Fc(t, a, m);
  }
}
function V_(e, t, n, r) {
  const s = new Array(t - 1);
  let o = 0, i = 0;
  for (let a = 0, u = r.length; a < u; ++a)
    if (a !== n) {
      const l = r[a];
      l && !Ge(l) && (s[o++] = l, i |= 1 << a);
    }
  return new Pn(e, i, s);
}
function W_(e, t, n, r, s) {
  const o = [];
  let i = r, a = 0;
  for (let u = 0; i; ++u)
    i & 1 && (o[u] = s[a++]), i >>>= 1;
  return o[t] = n, new Fc(e, a + 1, o);
}
function H_(e, t, n, r, s, o) {
  if (n === s) return new Ac(e, n, [o, r]);
  const i = Cn(t, n), a = Cn(t, s);
  if (i === a)
    return (u) => new Pn(e, yn(i) | yn(a), [u]);
  {
    const u = i < a ? [r, o] : [o, r];
    return new Pn(e, yn(i) | yn(a), u);
  }
}
function Oh(e, t, n, r, s, o) {
  let i, a = t;
  for (; ; ) {
    const u = H_(e, a, n, r, s, o);
    if (typeof u == "function")
      i = q_(u, i), a = a + Ht;
    else {
      let l = u;
      for (; i != null; )
        l = i.value(l), i = i.previous;
      return l;
    }
  }
}
const vh = "effect/HashMap", Ii = /* @__PURE__ */ Symbol.for(vh), G_ = {
  [Ii]: Ii,
  [Symbol.iterator]() {
    return new wo(this, (e, t) => [e, t]);
  },
  [L]() {
    let e = b(vh);
    for (const t of this)
      e ^= g(b(t[0]), B(b(t[1])));
    return Z(this, e);
  },
  [P](e) {
    if (Q_(e)) {
      if (e._size !== this._size)
        return !1;
      for (const t of this) {
        const n = g(e, Pc(t[0], b(t[0])));
        if (te(n))
          return !1;
        if (!x(t[1], n.value))
          return !1;
      }
      return !0;
    }
    return !1;
  },
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(ae)
    };
  },
  [Q]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, Cc = (e, t, n, r) => {
  const s = Object.create(G_);
  return s._editable = e, s._edit = t, s._root = n, s._size = r, s;
};
class wo {
  constructor(t, n) {
    c(this, "map");
    c(this, "f");
    c(this, "v");
    this.map = t, this.f = n, this.v = Eh(this.map._root, this.f, void 0);
  }
  next() {
    if (te(this.v))
      return {
        done: !0,
        value: void 0
      };
    const t = this.v.value;
    return this.v = js(t.cont), {
      done: !1,
      value: t.value
    };
  }
  [Symbol.iterator]() {
    return new wo(this.map, this.f);
  }
}
const js = (e) => e ? Th(e[0], e[1], e[2], e[3], e[4]) : k(), Eh = (e, t, n = void 0) => {
  switch (e._tag) {
    case "LeafNode":
      return _e(e.value) ? N({
        value: t(e.key, e.value.value),
        cont: n
      }) : js(n);
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const r = e.children;
      return Th(r.length, r, 0, t, n);
    }
    default:
      return js(n);
  }
}, Th = (e, t, n, r, s) => {
  for (; n < e; ) {
    const o = t[n++];
    if (o && !Ge(o))
      return Eh(o, r, [e, t, n, r, s]);
  }
  return js(s);
}, z_ = /* @__PURE__ */ Cc(!1, 0, /* @__PURE__ */ new Nt(), 0), ko = () => z_, Y_ = (e) => {
  const t = $h(ko());
  for (const n of e)
    wr(t, n[0], n[1]);
  return nS(t);
}, Q_ = (e) => M(e, Ii), X_ = (e) => e && Ge(e._root), Z_ = /* @__PURE__ */ f(2, (e, t) => Pc(e, t, b(t))), Pc = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = e._root, s = 0;
  for (; ; )
    switch (r._tag) {
      case "LeafNode":
        return x(t, r.key) ? r.value : k();
      case "CollisionNode": {
        if (n === r.hash) {
          const o = r.children;
          for (let i = 0, a = o.length; i < a; ++i) {
            const u = o[i];
            if ("key" in u && x(t, u.key))
              return u.value;
          }
        }
        return k();
      }
      case "IndexedNode": {
        const o = Cn(s, n), i = yn(o);
        if (r.mask & i) {
          r = r.children[wh(r.mask, i)], s += Ht;
          break;
        }
        return k();
      }
      case "ArrayNode": {
        if (r = r.children[Cn(s, n)], r) {
          s += Ht;
          break;
        }
        return k();
      }
      default:
        return k();
    }
}), eS = /* @__PURE__ */ f(2, (e, t) => _e(Pc(e, t, b(t)))), wr = /* @__PURE__ */ f(3, (e, t, n) => xc(e, t, () => N(n))), tS = /* @__PURE__ */ f(3, (e, t, n) => e._editable ? (e._root = t, e._size = n, e) : t === e._root ? e : Cc(e._editable, e._edit, t, n)), Ih = (e) => new wo(e, (t) => t), $i = (e) => e._size, $h = (e) => Cc(!0, e._edit + 1, e._root, e._size), nS = (e) => (e._editable = !1, e), xc = /* @__PURE__ */ f(3, (e, t, n) => rS(e, t, b(t), n)), rS = /* @__PURE__ */ f(4, (e, t, n, r) => {
  const s = {
    value: e._size
  }, o = e._root.modify(e._editable ? e._edit : NaN, 0, r, n, t, s);
  return g(e, tS(o, s.value));
}), Xa = /* @__PURE__ */ f(2, (e, t) => xc(e, t, k)), sS = /* @__PURE__ */ f(2, (e, t) => Oo(e, ko(), (n, r, s) => wr(n, s, t(r, s)))), oS = /* @__PURE__ */ f(2, (e, t) => Oo(e, void 0, (n, r, s) => t(r, s))), Oo = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = e._root;
  if (r._tag === "LeafNode")
    return _e(r.value) ? n(t, r.value.value, r.key) : t;
  if (r._tag === "EmptyNode")
    return t;
  const s = [r.children];
  let o;
  for (; o = s.pop(); )
    for (let i = 0, a = o.length; i < a; ) {
      const u = o[i++];
      u && !Ge(u) && (u._tag === "LeafNode" ? _e(u.value) && (t = n(t, u.value.value, u.key)) : s.push(u.children));
    }
  return t;
}), Rh = "effect/HashSet", Ri = /* @__PURE__ */ Symbol.for(Rh), iS = {
  [Ri]: Ri,
  [Symbol.iterator]() {
    return Ih(this._keyMap);
  },
  [L]() {
    return Z(this, B(b(this._keyMap))(b(Rh)));
  },
  [P](e) {
    return cS(e) ? $i(this._keyMap) === $i(e._keyMap) && x(this._keyMap, e._keyMap) : !1;
  },
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: Array.from(this).map(ae)
    };
  },
  [Q]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, vo = (e) => {
  const t = Object.create(iS);
  return t._keyMap = e, t;
}, cS = (e) => M(e, Ri), aS = /* @__PURE__ */ vo(/* @__PURE__ */ ko()), Eo = () => aS, uS = (e) => {
  const t = jc(Eo());
  for (const n of e)
    kr(t, n);
  return Lc(t);
}, lS = (...e) => {
  const t = jc(Eo());
  for (const n of e)
    kr(t, n);
  return Lc(t);
}, fS = /* @__PURE__ */ f(2, (e, t) => eS(e._keyMap, t)), hS = (e) => $i(e._keyMap), jc = (e) => vo($h(e._keyMap)), Lc = (e) => (e._keyMap._editable = !1, e), Nh = /* @__PURE__ */ f(2, (e, t) => {
  const n = jc(e);
  return t(n), Lc(n);
}), kr = /* @__PURE__ */ f(2, (e, t) => e._keyMap._editable ? (wr(t, !0)(e._keyMap), e) : vo(wr(t, !0)(e._keyMap))), Mh = /* @__PURE__ */ f(2, (e, t) => e._keyMap._editable ? (Xa(t)(e._keyMap), e) : vo(Xa(t)(e._keyMap))), dS = /* @__PURE__ */ f(2, (e, t) => Nh(e, (n) => {
  for (const r of t)
    Mh(n, r);
})), gS = /* @__PURE__ */ f(2, (e, t) => Nh(Eo(), (n) => {
  mS(e, (r) => kr(n, r));
  for (const r of t)
    kr(n, r);
})), mS = /* @__PURE__ */ f(2, (e, t) => oS(e._keyMap, (n, r) => t(r))), pS = /* @__PURE__ */ f(3, (e, t, n) => Oo(e._keyMap, t, (r, s, o) => n(r, o))), Gt = Eo, yS = uS, Kc = lS, _S = fS, Ah = hS, pr = kr, Fh = Mh, Za = dS, Or = gS, Ls = pS, eu = /* @__PURE__ */ Symbol.for("effect/MutableRef"), SS = {
  [eu]: eu,
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableRef",
      current: ae(this.current)
    };
  },
  [Q]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
}, Ch = (e) => {
  const t = Object.create(SS);
  return t.current = e, t;
}, To = (e) => e.current, Ph = /* @__PURE__ */ f(2, (e, t) => (e.current = t, e)), Uc = "effect/FiberId", vr = /* @__PURE__ */ Symbol.for(Uc), Ks = "None", Ni = "Runtime", bS = "Composite", wS = /* @__PURE__ */ ne(`${Uc}-${Ks}`);
var ol;
let kS = class {
  constructor() {
    c(this, ol, vr);
    c(this, "_tag", Ks);
    c(this, "id", -1);
    c(this, "startTimeMillis", -1);
  }
  [(ol = vr, L)]() {
    return wS;
  }
  [P](t) {
    return xh(t) && t._tag === Ks;
  }
  toString() {
    return ge(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag
    };
  }
  [Q]() {
    return this.toJSON();
  }
};
var il;
class OS {
  constructor(t, n) {
    c(this, "id");
    c(this, "startTimeMillis");
    c(this, il, vr);
    c(this, "_tag", Ni);
    this.id = t, this.startTimeMillis = n;
  }
  [(il = vr, L)]() {
    return Z(this, ne(`${Uc}-${this._tag}-${this.id}-${this.startTimeMillis}`));
  }
  [P](t) {
    return xh(t) && t._tag === Ni && this.id === t.id && this.startTimeMillis === t.startTimeMillis;
  }
  toString() {
    return ge(this.toJSON());
  }
  toJSON() {
    return {
      _id: "FiberId",
      _tag: this._tag,
      id: this.id,
      startTimeMillis: this.startTimeMillis
    };
  }
  [Q]() {
    return this.toJSON();
  }
}
const vS = /* @__PURE__ */ new kS(), xh = (e) => M(e, vr), Mi = (e) => {
  switch (e._tag) {
    case Ks:
      return Gt();
    case Ni:
      return Kc(e.id);
    case bS:
      return g(Mi(e.left), Or(Mi(e.right)));
  }
}, tu = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/Fiber/Id/_fiberCounter"), () => Ch(0)), jh = (e) => Array.from(Mi(e)).map((n) => `#${n}`).join(","), ES = () => {
  const e = To(tu);
  return g(tu, Ph(e + 1)), new OS(e, Date.now());
}, xn = vS, TS = jh, Lh = ES, Dc = ko, IS = Y_, $S = X_, Kh = Z_, Uh = wr, Dh = Ih, RS = xc, NS = sS, qh = Oo, Er = /* @__PURE__ */ Symbol.for("effect/List"), Ai = (e) => X(e), MS = (e) => _m(Oc(e), Ai), AS = /* @__PURE__ */ MS(x), FS = {
  [Er]: Er,
  _tag: "Cons",
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Cons",
      values: Ai(this).map(ae)
    };
  },
  [Q]() {
    return this.toJSON();
  },
  [P](e) {
    return Jh(e) && this._tag === e._tag && AS(this, e);
  },
  [L]() {
    return Z(this, Pr(Ai(this)));
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
}, Us = (e, t) => {
  const n = Object.create(FS);
  return n.head = e, n.tail = t, n;
}, CS = /* @__PURE__ */ ne("Nil"), PS = {
  [Er]: Er,
  _tag: "Nil",
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "List",
      _tag: "Nil"
    };
  },
  [Q]() {
    return this.toJSON();
  },
  [L]() {
    return CS;
  },
  [P](e) {
    return Jh(e) && this._tag === e._tag;
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
}, Bh = /* @__PURE__ */ Object.create(PS), Jh = (e) => M(e, Er), _t = (e) => e._tag === "Nil", xS = (e) => e._tag === "Cons", jS = () => Bh, zt = (e, t) => Us(e, t), jn = jS, qc = (e) => Us(e, Bh), LS = /* @__PURE__ */ f(2, (e, t) => US(t, e)), KS = /* @__PURE__ */ f(2, (e, t) => zt(t, e)), US = /* @__PURE__ */ f(2, (e, t) => {
  if (_t(e))
    return t;
  if (_t(t))
    return e;
  {
    const n = Us(t.head, e);
    let r = n, s = t.tail;
    for (; !_t(s); ) {
      const o = Us(s.head, e);
      r.tail = o, r = o, s = s.tail;
    }
    return n;
  }
}), DS = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = t, s = e;
  for (; !_t(s); )
    r = n(r, s.head), s = s.tail;
  return r;
}), qS = (e) => {
  let t = jn(), n = e;
  for (; !_t(n); )
    t = KS(t, n.head), n = n.tail;
  return t;
}, Bc = /* @__PURE__ */ function() {
  function e(t) {
    t && Object.assign(this, t);
  }
  return e.prototype = Lr, e;
}(), BS = (e) => Object.assign(Object.create(Lr), e), JS = /* @__PURE__ */ Symbol.for("effect/DifferContextPatch");
function nu(e) {
  return e;
}
const Br = {
  ...Bc.prototype,
  [JS]: {
    _Value: nu,
    _Patch: nu
  }
}, VS = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Br), {
  _tag: "Empty"
}), WS = /* @__PURE__ */ Object.create(VS), Vh = () => WS, HS = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Br), {
  _tag: "AndThen"
}), GS = (e, t) => {
  const n = Object.create(HS);
  return n.first = e, n.second = t, n;
}, zS = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Br), {
  _tag: "AddService"
}), YS = (e, t) => {
  const n = Object.create(zS);
  return n.key = e, n.service = t, n;
}, QS = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Br), {
  _tag: "RemoveService"
}), XS = (e) => {
  const t = Object.create(QS);
  return t.key = e, t;
}, ZS = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Br), {
  _tag: "UpdateService"
}), eb = (e, t) => {
  const n = Object.create(ZS);
  return n.key = e, n.update = t, n;
}, tb = (e, t) => {
  const n = new Map(e.unsafeMap);
  let r = Vh();
  for (const [s, o] of t.unsafeMap.entries())
    if (n.has(s)) {
      const i = n.get(s);
      n.delete(s), x(i, o) || (r = bs(eb(s, () => o))(r));
    } else
      n.delete(s), r = bs(YS(s, o))(r);
  for (const [s] of n.entries())
    r = bs(XS(s))(r);
  return r;
}, bs = /* @__PURE__ */ f(2, (e, t) => GS(e, t)), nb = /* @__PURE__ */ f(2, (e, t) => {
  if (e._tag === "Empty")
    return t;
  let n = !1, r = Ce(e);
  const s = new Map(t.unsafeMap);
  for (; An(r); ) {
    const i = Fn(r), a = jt(r);
    switch (i._tag) {
      case "Empty": {
        r = a;
        break;
      }
      case "AddService": {
        s.set(i.key, i.service), r = a;
        break;
      }
      case "AndThen": {
        r = Qe(Qe(a, i.second), i.first);
        break;
      }
      case "RemoveService": {
        s.delete(i.key), r = a;
        break;
      }
      case "UpdateService": {
        s.set(i.key, i.update(s.get(i.key))), n = !0, r = a;
        break;
      }
    }
  }
  if (!n)
    return Nn(s);
  const o = /* @__PURE__ */ new Map();
  for (const [i] of t.unsafeMap)
    s.has(i) && (o.set(i, s.get(i)), s.delete(i));
  for (const [i, a] of s)
    o.set(i, a);
  return Nn(o);
}), rb = /* @__PURE__ */ Symbol.for("effect/DifferHashSetPatch");
function ri(e) {
  return e;
}
const Io = {
  ...Bc.prototype,
  [rb]: {
    _Value: ri,
    _Key: ri,
    _Patch: ri
  }
}, sb = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Io), {
  _tag: "Empty"
}), ob = /* @__PURE__ */ Object.create(sb), Wh = () => ob, ib = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Io), {
  _tag: "AndThen"
}), cb = (e, t) => {
  const n = Object.create(ib);
  return n.first = e, n.second = t, n;
}, ab = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Io), {
  _tag: "Add"
}), ub = (e) => {
  const t = Object.create(ab);
  return t.value = e, t;
}, lb = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Io), {
  _tag: "Remove"
}), fb = (e) => {
  const t = Object.create(lb);
  return t.value = e, t;
}, hb = (e, t) => {
  const [n, r] = Ls([e, Wh()], ([s, o], i) => _S(i)(s) ? [Fh(i)(s), o] : [s, Fi(ub(i))(o)])(t);
  return Ls(r, (s, o) => Fi(fb(o))(s))(n);
}, Fi = /* @__PURE__ */ f(2, (e, t) => cb(e, t)), db = /* @__PURE__ */ f(2, (e, t) => {
  if (e._tag === "Empty")
    return t;
  let n = t, r = Ce(e);
  for (; An(r); ) {
    const s = Fn(r), o = jt(r);
    switch (s._tag) {
      case "Empty": {
        r = o;
        break;
      }
      case "AndThen": {
        r = Qe(s.first)(Qe(s.second)(o));
        break;
      }
      case "Add": {
        n = pr(s.value)(n), r = o;
        break;
      }
      case "Remove":
        n = Fh(s.value)(n), r = o;
    }
  }
  return n;
}), gb = /* @__PURE__ */ Symbol.for("effect/DifferReadonlyArrayPatch");
function ru(e) {
  return e;
}
const Jr = {
  ...Bc.prototype,
  [gb]: {
    _Value: ru,
    _Patch: ru
  }
}, mb = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Jr), {
  _tag: "Empty"
}), pb = /* @__PURE__ */ Object.create(mb), Hh = () => pb, yb = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Jr), {
  _tag: "AndThen"
}), _b = (e, t) => {
  const n = Object.create(yb);
  return n.first = e, n.second = t, n;
}, Sb = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Jr), {
  _tag: "Append"
}), bb = (e) => {
  const t = Object.create(Sb);
  return t.values = e, t;
}, wb = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Jr), {
  _tag: "Slice"
}), kb = (e, t) => {
  const n = Object.create(wb);
  return n.from = e, n.until = t, n;
}, Ob = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(Jr), {
  _tag: "Update"
}), vb = (e, t) => {
  const n = Object.create(Ob);
  return n.index = e, n.patch = t, n;
}, Eb = (e) => {
  let t = 0, n = Hh();
  for (; t < e.oldValue.length && t < e.newValue.length; ) {
    const r = e.oldValue[t], s = e.newValue[t], o = e.differ.diff(r, s);
    x(o, e.differ.empty) || (n = ws(n, vb(t, o))), t = t + 1;
  }
  return t < e.oldValue.length && (n = ws(n, kb(0, t))), t < e.newValue.length && (n = ws(n, bb(Pp(t)(e.newValue)))), n;
}, ws = /* @__PURE__ */ f(2, (e, t) => _b(e, t)), Tb = /* @__PURE__ */ f(3, (e, t, n) => {
  if (e._tag === "Empty")
    return t;
  let r = t.slice(), s = Ve(e);
  for (; _s(s); ) {
    const o = Me(s), i = Wt(s);
    switch (o._tag) {
      case "Empty": {
        s = i;
        break;
      }
      case "AndThen": {
        i.unshift(o.first, o.second), s = i;
        break;
      }
      case "Append": {
        for (const a of o.values)
          r.push(a);
        s = i;
        break;
      }
      case "Slice": {
        r = r.slice(o.from, o.until), s = i;
        break;
      }
      case "Update": {
        r[o.index] = n.patch(o.patch, r[o.index]), s = i;
        break;
      }
    }
  }
  return r;
}), Ib = /* @__PURE__ */ Symbol.for("effect/Differ"), $b = {
  [Ib]: {
    _P: H,
    _V: H
  },
  pipe() {
    return v(this, arguments);
  }
}, Hn = (e) => {
  const t = Object.create($b);
  return t.empty = e.empty, t.diff = e.diff, t.combine = e.combine, t.patch = e.patch, t;
}, Rb = () => Hn({
  empty: Vh(),
  combine: (e, t) => bs(t)(e),
  diff: (e, t) => tb(e, t),
  patch: (e, t) => nb(t)(e)
}), Nb = () => Hn({
  empty: Wh(),
  combine: (e, t) => Fi(t)(e),
  diff: (e, t) => hb(e, t),
  patch: (e, t) => db(t)(e)
}), Mb = (e) => Hn({
  empty: Hh(),
  combine: (t, n) => ws(t, n),
  diff: (t, n) => Eb({
    oldValue: t,
    newValue: n,
    differ: e
  }),
  patch: (t, n) => Tb(t, n, e)
}), Gh = () => Ab((e, t) => t), Ab = (e) => Hn({
  empty: H,
  combine: (t, n) => t === H ? n : n === H ? t : (r) => n(t(r)),
  diff: (t, n) => x(t, n) ? H : so(n),
  patch: (t, n) => e(n, t(n))
}), Tr = 255, zh = 8, Ci = (e) => e & Tr, Pi = (e) => e >> zh & Tr, Vr = (e, t) => (e & Tr) + ((t & e & Tr) << zh), Fb = /* @__PURE__ */ Vr(0, 0), Cb = (e) => Vr(e, e), Pb = (e) => Vr(e, 0), xb = /* @__PURE__ */ f(2, (e, t) => Vr(Ci(e) & ~t, Pi(e))), jb = /* @__PURE__ */ f(2, (e, t) => e | t), Lb = (e) => ~e >>> 0 & Tr, Kb = 0, Gn = 1, Ub = 2, Yh = 4, xi = 16, Qh = 32, Db = (e) => $o(e, Qh), qb = /* @__PURE__ */ f(2, (e, t) => e | t), Et = (e) => Xh(e) && !Jb(e), Xh = (e) => $o(e, Gn), $o = /* @__PURE__ */ f(2, (e, t) => (e & t) !== 0), Zh = (...e) => e.reduce((t, n) => t | n, 0), Bb = /* @__PURE__ */ Zh(Kb), su = (e) => $o(e, Yh), Jb = (e) => $o(e, xi), ks = /* @__PURE__ */ f(2, (e, t) => Vr(e ^ t, t)), Os = /* @__PURE__ */ f(2, (e, t) => e & (Lb(Ci(t)) | Pi(t)) | Ci(t) & Pi(t)), ou = /* @__PURE__ */ Hn({
  empty: Fb,
  diff: (e, t) => ks(e, t),
  combine: (e, t) => jb(t)(e),
  patch: (e, t) => Os(t, e)
}), Vb = Cb, ed = Pb, iu = xb, td = (e, t) => ({
  _tag: "Par",
  left: e,
  right: t
}), os = (e, t) => ({
  _tag: "Seq",
  left: e,
  right: t
}), Wb = (e) => {
  let t = qc(e), n = jn();
  for (; ; ) {
    const [r, s] = DS(t, [nd(), jn()], ([o, i], a) => {
      const [u, l] = Hb(a);
      return [Xb(o, u), LS(i, l)];
    });
    if (n = Gb(n, r), _t(s))
      return qS(n);
    t = s;
  }
  throw new Error("BUG: BlockedRequests.flatten - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Hb = (e) => {
  let t = e, n = nd(), r = jn(), s = jn();
  for (; ; )
    switch (t._tag) {
      case "Empty": {
        if (_t(r))
          return [n, s];
        t = r.head, r = r.tail;
        break;
      }
      case "Par": {
        r = zt(t.right, r), t = t.left;
        break;
      }
      case "Seq": {
        const o = t.left, i = t.right;
        switch (o._tag) {
          case "Empty": {
            t = i;
            break;
          }
          case "Par": {
            const a = o.left, u = o.right;
            t = td(os(a, i), os(u, i));
            break;
          }
          case "Seq": {
            const a = o.left, u = o.right;
            t = os(a, os(u, i));
            break;
          }
          case "Single": {
            t = o, s = zt(i, s);
            break;
          }
        }
        break;
      }
      case "Single": {
        if (n = Qb(n, t), _t(r))
          return [n, s];
        t = r.head, r = r.tail;
        break;
      }
    }
  throw new Error("BUG: BlockedRequests.step - please report an issue at https://github.com/Effect-TS/effect/issues");
}, Gb = (e, t) => {
  if (_t(e))
    return qc(si(t));
  if (Zb(t))
    return e;
  const n = ow(e.head), r = ew(t);
  return n.length === 1 && r.length === 1 && x(n[0], r[0]) ? zt(sw(e.head, si(t)), e.tail) : zt(si(t), e);
}, zb = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockParallel"), Yb = {
  /* c8 ignore next */
  _R: (e) => e
};
var cl;
cl = zb;
class Jc {
  constructor(t) {
    c(this, "map");
    c(this, cl, Yb);
    this.map = t;
  }
}
const nd = () => new Jc(Dc()), Qb = (e, t) => new Jc(RS(e.map, t.dataSource, (n) => gp(_f(n, y_(t.blockedRequest)), () => Ce(t.blockedRequest)))), Xb = (e, t) => new Jc(qh(e.map, t.map, (n, r, s) => Uh(n, s, de(Kh(n, s), {
  onNone: () => r,
  onSome: (o) => He(r, o)
})))), Zb = (e) => $S(e.map), ew = (e) => Array.from(Dh(e.map)), si = (e) => rw(NS(e.map, (t) => Ce(t))), tw = /* @__PURE__ */ Symbol.for("effect/RequestBlock/RequestBlockSequential"), nw = {
  /* c8 ignore next */
  _R: (e) => e
};
var al;
al = tw;
class rd {
  constructor(t) {
    c(this, "map");
    c(this, al, nw);
    this.map = t;
  }
}
const rw = (e) => new rd(e), sw = (e, t) => new rd(qh(t.map, e.map, (n, r, s) => Uh(n, s, de(Kh(n, s), {
  onNone: () => St(),
  onSome: (o) => He(o, r)
})))), ow = (e) => Array.from(Dh(e.map)), iw = (e) => Array.from(e.map), Wr = "Die", Yt = "Empty", sn = "Fail", zn = "Interrupt", Ln = "Parallel", Kn = "Sequential", sd = "effect/Cause", od = /* @__PURE__ */ Symbol.for(sd), cw = {
  /* c8 ignore next */
  _E: (e) => e
}, Yn = {
  [od]: cw,
  [L]() {
    return g(b(sd), B(b(ww(this))), Z(this));
  },
  [P](e) {
    return aw(e) && bw(this, e);
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
          defect: ae(this.defect)
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
          failure: ae(this.error)
        };
      case "Sequential":
      case "Parallel":
        return {
          _id: "Cause",
          _tag: this._tag,
          left: ae(this.left),
          right: ae(this.right)
        };
    }
  },
  toString() {
    return Qn(this);
  },
  [Q]() {
    return this.toJSON();
  }
}, Ir = /* @__PURE__ */ (() => {
  const e = /* @__PURE__ */ Object.create(Yn);
  return e._tag = Yt, e;
})(), Ds = (e) => {
  const t = Object.create(Yn);
  return t._tag = sn, t.error = e, t;
}, at = (e) => {
  const t = Object.create(Yn);
  return t._tag = Wr, t.defect = e, t;
}, Tt = (e) => {
  const t = Object.create(Yn);
  return t._tag = zn, t.fiberId = e, t;
}, Ro = (e, t) => {
  const n = Object.create(Yn);
  return n._tag = Ln, n.left = e, n.right = t, n;
}, De = (e, t) => {
  const n = Object.create(Yn);
  return n._tag = Kn, n.left = e, n.right = t, n;
}, aw = (e) => M(e, od), uw = (e) => e._tag === Yt, lw = (e) => e._tag === sn, fw = (e) => e._tag === Yt ? !0 : Un(e, !0, (t, n) => {
  switch (n._tag) {
    case Yt:
      return N(t);
    case Wr:
    case sn:
    case zn:
      return N(!1);
    default:
      return k();
  }
}), hw = (e) => _e(_w(e)), Vc = (e) => Wc(void 0, Ow)(e), dw = (e) => Mn(Un(e, St(), (t, n) => n._tag === sn ? N(g(t, Qe(n.error))) : k())), gw = (e) => Mn(Un(e, St(), (t, n) => n._tag === Wr ? N(g(t, Qe(n.defect))) : k())), mw = (e) => Un(e, Gt(), (t, n) => n._tag === zn ? N(g(t, pr(n.fiberId))) : k()), pw = (e) => id(e, (t) => t._tag === sn ? N(t.error) : k()), yw = (e) => {
  const t = pw(e);
  switch (t._tag) {
    case "None":
      return C(e);
    case "Some":
      return T(t.value);
  }
}, _w = (e) => id(e, (t) => t._tag === zn ? N(t.fiberId) : k()), cu = (e) => cd(e, {
  onEmpty: Ir,
  onFail: () => Ir,
  onDie: at,
  onInterrupt: Tt,
  onSequential: De,
  onParallel: Ro
}), Sw = (e) => cd(e, {
  onEmpty: Ir,
  onFail: at,
  onDie: at,
  onInterrupt: Tt,
  onSequential: De,
  onParallel: Ro
}), bw = (e, t) => {
  let n = Ce(e), r = Ce(t);
  for (; An(n) && An(r); ) {
    const [s, o] = g(Fn(n), Un([Gt(), St()], ([u, l], h) => {
      const [d, p] = ji(h);
      return N([g(u, Or(d)), g(l, He(p))]);
    })), [i, a] = g(Fn(r), Un([Gt(), St()], ([u, l], h) => {
      const [d, p] = ji(h);
      return N([g(u, Or(d)), g(l, He(p))]);
    }));
    if (!x(s, i))
      return !1;
    n = o, r = a;
  }
  return !0;
}, ww = (e) => kw(Ce(e), St()), kw = (e, t) => {
  for (; ; ) {
    const [n, r] = g(e, Of([Gt(), St()], ([o, i], a) => {
      const [u, l] = ji(a);
      return [g(o, Or(u)), g(i, He(l))];
    })), s = Ah(n) > 0 ? g(t, Qe(n)) : t;
    if (__(r))
      return Mn(s);
    e = r, t = s;
  }
  throw new Error(ao("Cause.flattenCauseLoop"));
}, id = /* @__PURE__ */ f(2, (e, t) => {
  const n = [e];
  for (; n.length > 0; ) {
    const r = n.pop(), s = t(r);
    switch (s._tag) {
      case "None": {
        switch (r._tag) {
          case Kn:
          case Ln: {
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
  return k();
}), ji = (e) => {
  let t = e;
  const n = [];
  let r = Gt(), s = St();
  for (; t !== void 0; )
    switch (t._tag) {
      case Yt: {
        if (n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case sn: {
        if (r = pr(r, ti(t._tag, t.error)), n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case Wr: {
        if (r = pr(r, ti(t._tag, t.defect)), n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case zn: {
        if (r = pr(r, ti(t._tag, t.fiberId)), n.length === 0)
          return [r, s];
        t = n.pop();
        break;
      }
      case Kn: {
        switch (t.left._tag) {
          case Yt: {
            t = t.right;
            break;
          }
          case Kn: {
            t = De(t.left.left, De(t.left.right, t.right));
            break;
          }
          case Ln: {
            t = Ro(De(t.left.left, t.right), De(t.left.right, t.right));
            break;
          }
          default: {
            s = Qe(s, t.right), t = t.left;
            break;
          }
        }
        break;
      }
      case Ln: {
        n.push(t.right), t = t.left;
        break;
      }
    }
  throw new Error(ao("Cause.evaluateCauseLoop"));
}, Ow = {
  emptyCase: xa,
  failCase: yi,
  dieCase: yi,
  interruptCase: xa,
  sequentialCase: (e, t, n) => t && n,
  parallelCase: (e, t, n) => t && n
}, au = "SequentialCase", uu = "ParallelCase", cd = /* @__PURE__ */ f(2, (e, {
  onDie: t,
  onEmpty: n,
  onFail: r,
  onInterrupt: s,
  onParallel: o,
  onSequential: i
}) => Wc(e, void 0, {
  emptyCase: () => n,
  failCase: (a, u) => r(u),
  dieCase: (a, u) => t(u),
  interruptCase: (a, u) => s(u),
  sequentialCase: (a, u, l) => i(u, l),
  parallelCase: (a, u, l) => o(u, l)
})), Un = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = t, s = e;
  const o = [];
  for (; s !== void 0; ) {
    const i = n(r, s);
    switch (r = _e(i) ? i.value : r, s._tag) {
      case Kn: {
        o.push(s.right), s = s.left;
        break;
      }
      case Ln: {
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
}), Wc = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = [e], s = [];
  for (; r.length > 0; ) {
    const i = r.pop();
    switch (i._tag) {
      case Yt: {
        s.push(C(n.emptyCase(t)));
        break;
      }
      case sn: {
        s.push(C(n.failCase(t, i.error)));
        break;
      }
      case Wr: {
        s.push(C(n.dieCase(t, i.defect)));
        break;
      }
      case zn: {
        s.push(C(n.interruptCase(t, i.fiberId)));
        break;
      }
      case Kn: {
        r.push(i.right), r.push(i.left), s.push(T({
          _tag: au
        }));
        break;
      }
      case Ln: {
        r.push(i.right), r.push(i.left), s.push(T({
          _tag: uu
        }));
        break;
      }
    }
  }
  const o = [];
  for (; s.length > 0; ) {
    const i = s.pop();
    switch (i._tag) {
      case "Left": {
        switch (i.left._tag) {
          case au: {
            const a = o.pop(), u = o.pop(), l = n.sequentialCase(t, a, u);
            o.push(l);
            break;
          }
          case uu: {
            const a = o.pop(), u = o.pop(), l = n.parallelCase(t, a, u);
            o.push(l);
            break;
          }
        }
        break;
      }
      case "Right": {
        o.push(i.right);
        break;
      }
    }
  }
  if (o.length === 0)
    throw new Error("BUG: Cause.reduceWithContext - please report an issue at https://github.com/Effect-TS/effect/issues");
  return o.pop();
}), Qn = (e, t) => Vc(e) ? "All fibers interrupted without errors." : ud(e).map(function(n) {
  return (t == null ? void 0 : t.renderErrorCause) !== !0 || n.cause === void 0 ? n.stack : `${n.stack} {
${ad(n.cause, "  ")}
}`;
}).join(`
`), ad = (e, t) => {
  const n = e.stack.split(`
`);
  let r = `${t}[cause]: ${n[0]}`;
  for (let s = 1, o = n.length; s < o; s++)
    r += `
${t}${n[s]}`;
  return e.cause && (r += ` {
${ad(e.cause, `${t}  `)}
${t}}`), r;
};
class qs extends globalThis.Error {
  constructor(n) {
    const r = typeof n == "object" && n !== null, s = Error.stackTraceLimit;
    Error.stackTraceLimit = 1;
    super(vw(n), r && "cause" in n && typeof n.cause < "u" ? {
      cause: new qs(n.cause)
    } : void 0);
    c(this, "span");
    this.message === "" && (this.message = "An error has occurred"), Error.stackTraceLimit = s, this.name = n instanceof Error ? n.name : "Error", r && (Dn in n && (this.span = n[Dn]), Object.keys(n).forEach((o) => {
      o in this || (this[o] = n[o]);
    })), this.stack = Iw(`${this.name}: ${this.message}`, n instanceof Error && n.stack ? n.stack : "", this.span);
  }
}
const vw = (e) => {
  if (typeof e == "string")
    return e;
  if (typeof e == "object" && e !== null && e instanceof Error)
    return e.message;
  try {
    if (M(e, "toString") && Fr(e.toString) && e.toString !== Object.prototype.toString && e.toString !== globalThis.Array.prototype.toString)
      return e.toString();
  } catch {
  }
  return tf(e);
}, Ew = /\((.*)\)/g, Tw = /* @__PURE__ */ J("effect/Tracer/spanToTrace", () => /* @__PURE__ */ new WeakMap()), Iw = (e, t, n) => {
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
    let o = n, i = 0;
    for (; o && o._tag === "Span" && i < 10; ) {
      const a = Tw.get(o);
      if (typeof a == "function") {
        const u = a();
        if (typeof u == "string") {
          const l = u.matchAll(Ew);
          let h = !1;
          for (const [, d] of l)
            h = !0, r.push(`    at ${o.name} (${d})`);
          h || r.push(`    at ${o.name} (${u.replace(/^at /, "")})`);
        } else
          r.push(`    at ${o.name}`);
      } else
        r.push(`    at ${o.name}`);
      o = rt(o.parent), i++;
    }
  }
  return r.join(`
`);
}, Dn = /* @__PURE__ */ Symbol.for("effect/SpanAnnotation"), ud = (e) => Wc(e, void 0, {
  emptyCase: () => [],
  dieCase: (t, n) => [new qs(n)],
  failCase: (t, n) => [new qs(n)],
  interruptCase: () => [],
  parallelCase: (t, n, r) => [...n, ...r],
  sequentialCase: (t, n, r) => [...n, ...r]
}), No = "Pending", ld = "Done", $w = "effect/Deferred", Rw = /* @__PURE__ */ Symbol.for($w), Nw = {
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e
}, Mw = (e) => ({
  _tag: No,
  joiners: e
}), Aw = (e) => ({
  _tag: ld,
  effect: e
});
class Hr {
  constructor(t) {
    c(this, "self");
    c(this, "called", !1);
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
    return new Hr(this.self);
  }
}
const fd = (e, t) => {
  const n = new be("Blocked");
  return n.effect_instruction_i0 = e, n.effect_instruction_i1 = t, n;
}, Fw = (e) => {
  const t = new be("RunBlocked");
  return t.effect_instruction_i0 = e, t;
}, qn = /* @__PURE__ */ Symbol.for("effect/Effect");
class Cw {
  constructor(t, n) {
    c(this, "patch");
    c(this, "op");
    c(this, "_op", yc);
    this.patch = t, this.op = n;
  }
}
var ul;
class be {
  constructor(t) {
    c(this, "_op");
    c(this, "effect_instruction_i0");
    c(this, "effect_instruction_i1");
    c(this, "effect_instruction_i2");
    c(this, "trace");
    c(this, ul, Tn);
    this._op = t;
  }
  [(ul = qn, P)](t) {
    return this === t;
  }
  [L]() {
    return Z(this, dc(this));
  }
  pipe() {
    return v(this, arguments);
  }
  toJSON() {
    return {
      _id: "Effect",
      _op: this._op,
      effect_instruction_i0: ae(this.effect_instruction_i0),
      effect_instruction_i1: ae(this.effect_instruction_i1),
      effect_instruction_i2: ae(this.effect_instruction_i2)
    };
  }
  toString() {
    return ge(this.toJSON());
  }
  [Q]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Hr(new Cr(this));
  }
}
var ll;
class hd {
  constructor(t) {
    c(this, "_op");
    c(this, "effect_instruction_i0");
    c(this, "effect_instruction_i1");
    c(this, "effect_instruction_i2");
    c(this, "trace");
    c(this, ll, Tn);
    this._op = t, this._tag = t;
  }
  [(ll = qn, P)](t) {
    return na(t) && t._op === "Failure" && // @ts-expect-error
    x(this.effect_instruction_i0, t.effect_instruction_i0);
  }
  [L]() {
    return g(
      // @ts-expect-error
      ne(this._tag),
      // @ts-expect-error
      B(b(this.effect_instruction_i0)),
      Z(this)
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
    return ge(this.toJSON());
  }
  [Q]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Hr(new Cr(this));
  }
}
var fl;
class dd {
  constructor(t) {
    c(this, "_op");
    c(this, "effect_instruction_i0");
    c(this, "effect_instruction_i1");
    c(this, "effect_instruction_i2");
    c(this, "trace");
    c(this, fl, Tn);
    this._op = t, this._tag = t;
  }
  [(fl = qn, P)](t) {
    return na(t) && t._op === "Success" && // @ts-expect-error
    x(this.effect_instruction_i0, t.effect_instruction_i0);
  }
  [L]() {
    return g(
      // @ts-expect-error
      ne(this._tag),
      // @ts-expect-error
      B(b(this.effect_instruction_i0)),
      Z(this)
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
      value: ae(this.value)
    };
  }
  toString() {
    return ge(this.toJSON());
  }
  [Q]() {
    return this.toJSON();
  }
  [Symbol.iterator]() {
    return new Hr(new Cr(this));
  }
}
const Mo = (e) => M(e, qn), Pe = (e) => {
  const t = new be(sf);
  return t.effect_instruction_i0 = e, t;
}, Pw = /* @__PURE__ */ f(3, (e, t, n) => Co((r) => I(e, (s) => I(md(ie(() => r(t(s)))), (o) => ie(() => n(s, o)).pipe(Bn({
  onFailure: (i) => {
    switch (o._tag) {
      case ze:
        return Xe(De(o.effect_instruction_i0, i));
      case Ye:
        return Xe(i);
    }
  },
  onSuccess: () => o
})))))), Gr = /* @__PURE__ */ f(2, (e, t) => I(e, () => Y(t))), zr = (e) => Gr(e, void 0), gd = function() {
  const e = new be(lo);
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
      throw new Error(ao("you're not supposed to end up here"));
  }
  return e;
}, Bs = (e, t = xn) => {
  const n = new be(gr);
  let r;
  return n.effect_instruction_i0 = (s) => {
    r = e(s);
  }, n.effect_instruction_i1 = t, bd(n, (s) => Mo(r) ? r : Ze);
}, xw = (e, t = xn) => ie(() => Bs(e, t)), $r = (e, t = xn) => gd(e, function() {
  let n, r;
  function s(u) {
    n ? n(u) : r === void 0 && (r = u);
  }
  const o = new be(gr);
  o.effect_instruction_i0 = (u) => {
    n = u, r && u(r);
  }, o.effect_instruction_i1 = t;
  let i, a;
  return this.effect_instruction_i0.length !== 1 ? (a = new AbortController(), i = Te(() => this.effect_instruction_i0(s, a.signal))) : i = Te(() => this.effect_instruction_i0(s)), i || a ? bd(o, (u) => (a && a.abort(), i ?? Ze)) : o;
}), Li = /* @__PURE__ */ f(2, (e, t) => Gc(e, {
  onFailure: t,
  onSuccess: Y
})), lu = /* @__PURE__ */ Symbol.for("effect/OriginalAnnotation"), Hc = (e, t) => _e(t) ? new Proxy(e, {
  has(n, r) {
    return r === Dn || r === lu || r in n;
  },
  get(n, r) {
    return r === Dn ? t.value : r === lu ? e : n[r];
  }
}) : e, fu = (e) => Ft(e) && !(Dn in e) ? Pe((t) => Xe(at(Hc(e, ra(t))))) : Xe(at(e)), hu = (e) => jw(() => at(new d0(e))), Js = (e) => Gc(e, {
  onFailure: (t) => Y(T(t)),
  onSuccess: (t) => Y(C(t))
}), md = (e) => Uw(e, {
  onFailure: G,
  onSuccess: re
}), Re = (e) => Ft(e) && !(Dn in e) ? Pe((t) => Xe(Ds(Hc(e, ra(t))))) : Xe(Ds(e)), pd = (e) => I(R(e), Re), Xe = (e) => {
  const t = new hd(ze);
  return t.effect_instruction_i0 = e, t;
}, jw = (e) => I(R(e), Xe), Lw = /* @__PURE__ */ Pe((e) => Y(e.id())), yd = (e) => Pe((t) => e(t.id())), I = /* @__PURE__ */ f(2, (e, t) => {
  const n = new be(Ns);
  return n.effect_instruction_i0 = e, n.effect_instruction_i1 = t, n;
}), Kw = (e) => {
  const t = new be("OnStep");
  return t.effect_instruction_i0 = e, t;
}, _d = (e) => I(e, H), Uw = /* @__PURE__ */ f(2, (e, t) => Bn(e, {
  onFailure: (n) => Y(t.onFailure(n)),
  onSuccess: (n) => Y(t.onSuccess(n))
})), Bn = /* @__PURE__ */ f(2, (e, t) => {
  const n = new be(Ms);
  return n.effect_instruction_i0 = e, n.effect_instruction_i1 = t.onFailure, n.effect_instruction_i2 = t.onSuccess, n;
}), Gc = /* @__PURE__ */ f(2, (e, t) => Bn(e, {
  onFailure: (n) => {
    if (gw(n).length > 0)
      return Xe(Sw(n));
    const s = dw(n);
    return s.length > 0 ? t.onFailure(ph(s)) : Xe(n);
  },
  onSuccess: t.onSuccess
})), $t = /* @__PURE__ */ f(2, (e, t) => ie(() => {
  const n = X(e), r = go(n.length);
  let s = 0;
  return Gr(Qc({
    while: () => s < n.length,
    body: () => t(n[s], s),
    step: (o) => {
      r[s++] = o;
    }
  }), r);
})), Ao = /* @__PURE__ */ f(2, (e, t) => ie(() => {
  const n = X(e);
  let r = 0;
  return Qc({
    while: () => r < n.length,
    body: () => t(n[r], r),
    step: () => {
      r++;
    }
  });
})), Sd = (e) => {
  const t = new be(xr);
  return t.effect_instruction_i0 = Vb(Gn), t.effect_instruction_i1 = () => e, t;
}, Ne = /* @__PURE__ */ f(2, (e, t) => I(e, (n) => R(() => t(n)))), zc = /* @__PURE__ */ f(2, (e, t) => Gc(e, {
  onFailure: (n) => pd(() => t.onFailure(n)),
  onSuccess: (n) => R(() => t.onSuccess(n))
})), Fo = /* @__PURE__ */ f(2, (e, t) => Bn(e, {
  onFailure: (n) => {
    const r = yw(n);
    switch (r._tag) {
      case "Left":
        return pd(() => t(r.left));
      case "Right":
        return Xe(r.right);
    }
  },
  onSuccess: Y
})), Yc = /* @__PURE__ */ f(2, (e, t) => Co((n) => Bn(n(e), {
  onFailure: (r) => {
    const s = G(r);
    return Bn(t(s), {
      onFailure: (o) => G(De(r, o)),
      onSuccess: () => s
    });
  },
  onSuccess: (r) => {
    const s = re(r);
    return Po(t(s), s);
  }
}))), bd = /* @__PURE__ */ f(2, (e, t) => Yc(e, Md({
  onFailure: (n) => Vc(n) ? zr(t(mw(n))) : Ze,
  onSuccess: () => Ze
}))), Y = (e) => {
  const t = new dd(Ye);
  return t.effect_instruction_i0 = e, t;
}, ie = (e) => {
  const t = new be(lo);
  return t.commit = e, t;
}, R = (e) => {
  const t = new be(rf);
  return t.effect_instruction_i0 = e, t;
}, Dw = /* @__PURE__ */ f((e) => e.length === 3 || e.length === 2 && !(Ft(e[1]) && "onlyEffect" in e[1]), (e, t) => I(e, (n) => {
  const r = typeof t == "function" ? t(n) : t;
  return Mo(r) ? Gr(r, n) : Im(r) ? Bs((s) => {
    r.then((o) => s(Y(n)), (o) => s(Re(new p0(o, "An unknown error occurred in Effect.tap"))));
  }) : Y(n);
})), qw = (e) => Pe((t) => {
  const n = t.getFiberRef(Ui), r = g(n, me(() => t.scope()));
  return e(xo(Ui, N(r)));
}), wd = (e) => {
  const t = new be(xr);
  return t.effect_instruction_i0 = ed(Gn), t.effect_instruction_i1 = () => e, t;
}, Co = (e) => gd(e, function() {
  const t = new be(xr);
  return t.effect_instruction_i0 = ed(Gn), t.effect_instruction_i1 = (n) => Xh(n) ? Te(() => this.effect_instruction_i0(Sd)) : Te(() => this.effect_instruction_i0(wd)), t;
}), Ze = /* @__PURE__ */ Y(void 0), Bw = (e) => {
  const t = new be(xr);
  return t.effect_instruction_i0 = e, t.effect_instruction_i1 = void 0, t;
}, Qc = (e) => {
  const t = new be(As);
  return t.effect_instruction_i0 = e.while, t.effect_instruction_i1 = e.body, t.effect_instruction_i2 = e.step, t;
}, Xc = (e) => {
  const t = new be(ys);
  return typeof (e == null ? void 0 : e.priority) < "u" ? c0(t, e.priority) : t;
}, kd = /* @__PURE__ */ f(2, (e, t) => I(e, (n) => Ne(t, (r) => [n, r]))), Od = /* @__PURE__ */ f(2, (e, t) => I(e, (n) => Gr(t, n))), Po = /* @__PURE__ */ f(2, (e, t) => I(e, () => t)), Jw = (e) => I(Lw, (t) => g(e, vd(t))), vd = /* @__PURE__ */ f(2, (e, t) => I(e.interruptAsFork(t), () => e.await)), Vw = {
  _tag: "All",
  syslog: 0,
  label: "ALL",
  ordinal: Number.MIN_SAFE_INTEGER,
  pipe() {
    return v(this, arguments);
  }
}, Ww = {
  _tag: "Fatal",
  syslog: 2,
  label: "FATAL",
  ordinal: 5e4,
  pipe() {
    return v(this, arguments);
  }
}, Hw = {
  _tag: "Error",
  syslog: 3,
  label: "ERROR",
  ordinal: 4e4,
  pipe() {
    return v(this, arguments);
  }
}, Gw = {
  _tag: "Warning",
  syslog: 4,
  label: "WARN",
  ordinal: 3e4,
  pipe() {
    return v(this, arguments);
  }
}, Ed = {
  _tag: "Info",
  syslog: 6,
  label: "INFO",
  ordinal: 2e4,
  pipe() {
    return v(this, arguments);
  }
}, Td = {
  _tag: "Debug",
  syslog: 7,
  label: "DEBUG",
  ordinal: 1e4,
  pipe() {
    return v(this, arguments);
  }
}, zw = {
  _tag: "Trace",
  syslog: 7,
  label: "TRACE",
  ordinal: 0,
  pipe() {
    return v(this, arguments);
  }
}, Yw = {
  _tag: "None",
  syslog: 7,
  label: "OFF",
  ordinal: Number.MAX_SAFE_INTEGER,
  pipe() {
    return v(this, arguments);
  }
}, Qw = "effect/FiberRef", Xw = /* @__PURE__ */ Symbol.for(Qw), Zw = {
  /* c8 ignore next */
  _A: (e) => e
}, Zc = (e) => Pe((t) => re(t.getFiberRef(e))), ea = /* @__PURE__ */ f(2, (e, t) => I(Zc(e), t)), du = /* @__PURE__ */ f(2, (e, t) => e0(e, () => [void 0, t])), e0 = /* @__PURE__ */ f(2, (e, t) => Pe((n) => {
  const [r, s] = t(n.getFiberRef(e));
  return n.setFiberRef(e, s), Y(r);
})), xo = /* @__PURE__ */ f(3, (e, t, n) => Pw(Od(Zc(t), du(t, n)), () => e, (r) => du(t, r))), xe = (e, t) => Xn(e, {
  differ: Gh(),
  fork: (t == null ? void 0 : t.fork) ?? H,
  join: t == null ? void 0 : t.join
}), t0 = (e) => {
  const t = Nb();
  return Xn(e, {
    differ: t,
    fork: t.empty
  });
}, n0 = (e) => {
  const t = Mb(Gh());
  return Xn(e, {
    differ: t,
    fork: t.empty
  });
}, Id = (e) => {
  const t = Rb();
  return Xn(e, {
    differ: t,
    fork: t.empty
  });
}, Xn = (e, t) => ({
  ...Kr,
  [Xw]: Zw,
  initial: e,
  commit() {
    return Zc(this);
  },
  diff: (r, s) => t.differ.diff(r, s),
  combine: (r, s) => t.differ.combine(r, s),
  patch: (r) => (s) => t.differ.patch(r, s),
  fork: t.fork,
  join: t.join ?? ((r, s) => s)
}), r0 = (e) => Xn(e, {
  differ: ou,
  fork: ou.empty
}), Yr = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentContext"), () => Id(Nc())), jo = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentSchedulingPriority"), () => xe(0)), $d = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMaxOpsBeforeYield"), () => xe(2048)), s0 = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogAnnotation"), () => xe(Dc())), o0 = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogLevel"), () => xe(Ed)), i0 = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLogSpan"), () => xe(jn())), c0 = /* @__PURE__ */ f(2, (e, t) => xo(e, jo, t)), a0 = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentConcurrency"), () => xe("unbounded")), u0 = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestBatching"), () => xe(!0)), l0 = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentUnhandledErrorLogLevel"), () => xe(N(Td))), Ki = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentMetricLabels"), () => n0(In())), Ui = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentForkScopeOverride"), () => xe(k(), {
  fork: () => k(),
  join: (e, t) => e
})), is = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentInterruptedCause"), () => xe(Ir, {
  fork: () => Ir,
  join: (e, t) => e
})), f0 = (e, t) => e.addFinalizer(() => zr(t)), h0 = (e, t) => e.close(t), Lo = (e, t) => e.fork(t), ta = /* @__PURE__ */ function() {
  class e extends globalThis.Error {
    commit() {
      return Re(this);
    }
    toJSON() {
      const n = {
        ...this
      };
      return this.message && (n.message = this.message), this.cause && (n.cause = this.cause), n;
    }
    [Q]() {
      return this.toString !== globalThis.Error.prototype.toString ? this.stack ? `${this.toString()}
${this.stack.split(`
`).slice(1).join(`
`)}` : this.toString() : "Bun" in globalThis ? Qn(Ds(this), {
        renderErrorCause: !0
      }) : this;
    }
  }
  return Object.assign(e.prototype, zm), e;
}(), Rd = (e, t) => {
  class n extends ta {
    constructor() {
      super(...arguments);
      c(this, "_tag", t);
    }
  }
  return Object.assign(n.prototype, e), n.prototype.name = t, n;
}, gu = /* @__PURE__ */ Symbol.for("effect/Cause/errors/RuntimeException"), d0 = /* @__PURE__ */ Rd({
  [gu]: gu
}, "RuntimeException"), g0 = /* @__PURE__ */ Symbol.for("effect/Cause/errors/InterruptedException"), m0 = (e) => M(e, g0), mu = /* @__PURE__ */ Symbol.for("effect/Cause/errors/NoSuchElement"), Nd = /* @__PURE__ */ Rd({
  [mu]: mu
}, "NoSuchElementException"), pu = /* @__PURE__ */ Symbol.for("effect/Cause/errors/UnknownException"), p0 = /* @__PURE__ */ function() {
  class e extends ta {
    constructor(r, s) {
      super(s ?? "An unknown error occurred", {
        cause: r
      });
      c(this, "_tag", "UnknownException");
      c(this, "error");
      this.error = r;
    }
  }
  return Object.assign(e.prototype, {
    [pu]: pu,
    name: "UnknownException"
  }), e;
}(), na = (e) => Mo(e) && "_tag" in e && (e._tag === "Success" || e._tag === "Failure"), y0 = (e) => e._tag === "Success", yu = (e, t) => w0(e, t != null && t.parallel ? Ro : De), _0 = (e) => G(at(e)), _u = (e) => G(Ds(e)), G = (e) => {
  const t = new hd(ze);
  return t.effect_instruction_i0 = e, t;
}, S0 = (e) => G(Tt(e)), oi = /* @__PURE__ */ f(2, (e, t) => {
  switch (e._tag) {
    case ze:
      return G(e.effect_instruction_i0);
    case Ye:
      return re(t(e.effect_instruction_i0));
  }
}), Md = /* @__PURE__ */ f(2, (e, {
  onFailure: t,
  onSuccess: n
}) => {
  switch (e._tag) {
    case ze:
      return t(e.effect_instruction_i0);
    case Ye:
      return n(e.effect_instruction_i0);
  }
}), re = (e) => {
  const t = new dd(Ye);
  return t.effect_instruction_i0 = e, t;
}, Lt = /* @__PURE__ */ re(void 0), b0 = /* @__PURE__ */ f(3, (e, t, {
  onFailure: n,
  onSuccess: r
}) => {
  switch (e._tag) {
    case ze:
      switch (t._tag) {
        case Ye:
          return G(e.effect_instruction_i0);
        case ze:
          return G(n(e.effect_instruction_i0, t.effect_instruction_i0));
      }
    case Ye:
      switch (t._tag) {
        case Ye:
          return re(r(e.effect_instruction_i0, t.effect_instruction_i0));
        case ze:
          return G(t.effect_instruction_i0);
      }
  }
}), w0 = (e, t) => {
  const n = mh(e);
  return An(n) ? g(jt(n), Of(g(Fn(n), oi(Ce)), (r, s) => g(r, b0(s, {
    onSuccess: (o, i) => g(o, Qe(i)),
    onFailure: t
  }))), oi(Mn), oi((r) => qt(r)), N) : k();
}, k0 = (e) => ({
  ...Kr,
  [Rw]: Nw,
  state: Ch(Mw([])),
  commit() {
    return Ad(this);
  },
  blockingOn: e
}), Ad = (e) => xw((t) => {
  const n = To(e.state);
  switch (n._tag) {
    case ld:
      return t(n.effect);
    case No:
      return n.joiners.push(t), O0(e, t);
  }
}, e.blockingOn), Fd = (e, t) => {
  const n = To(e.state);
  if (n._tag === No) {
    Ph(e.state, Aw(t));
    for (let r = 0, s = n.joiners.length; r < s; r++)
      n.joiners[r](t);
  }
}, O0 = (e, t) => R(() => {
  const n = To(e.state);
  if (n._tag === No) {
    const r = n.joiners.indexOf(t);
    r >= 0 && n.joiners.splice(r, 1);
  }
}), v0 = /* @__PURE__ */ Pe((e) => re(e.currentContext)), E0 = () => v0, Qr = (e) => I(E0(), e), T0 = /* @__PURE__ */ f(2, (e, t) => xo(Yr, t)(e)), I0 = /* @__PURE__ */ f(2, (e, t) => Qr((n) => T0(e, t(n)))), ra = (e) => {
  const t = e.currentSpan;
  return t !== void 0 && t._tag === "Span" ? N(t) : k();
}, $0 = y0, Su = /* @__PURE__ */ Symbol.for("effect/MutableHashMap"), R0 = {
  [Su]: Su,
  [Symbol.iterator]() {
    return new sa(this);
  },
  toString() {
    return ge(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableHashMap",
      values: Array.from(this).map(ae)
    };
  },
  [Q]() {
    return this.toJSON();
  },
  pipe() {
    return v(this, arguments);
  }
};
class sa {
  constructor(t) {
    c(this, "self");
    c(this, "referentialIterator");
    c(this, "bucketIterator");
    this.self = t, this.referentialIterator = t.referential[Symbol.iterator]();
  }
  next() {
    if (this.bucketIterator !== void 0)
      return this.bucketIterator.next();
    const t = this.referentialIterator.next();
    return t.done ? (this.bucketIterator = new N0(this.self.buckets.values()), this.next()) : t;
  }
  [Symbol.iterator]() {
    return new sa(this.self);
  }
}
class N0 {
  constructor(t) {
    c(this, "backing");
    c(this, "currentBucket");
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
const M0 = () => {
  const e = Object.create(R0);
  return e.referential = /* @__PURE__ */ new Map(), e.buckets = /* @__PURE__ */ new Map(), e.bucketsSize = 0, e;
}, xt = /* @__PURE__ */ f(2, (e, t) => {
  if (Rs(t) === !1)
    return e.referential.has(t) ? N(e.referential.get(t)) : k();
  const n = t[L](), r = e.buckets.get(n);
  return r === void 0 ? k() : A0(e, r, t);
}), A0 = (e, t, n, r = !1) => {
  for (let s = 0, o = t.length; s < o; s++)
    if (n[P](t[s][0])) {
      const i = t[s][1];
      return r && (t.splice(s, 1), e.bucketsSize--), N(i);
    }
  return k();
}, or = /* @__PURE__ */ f(2, (e, t) => _e(xt(e, t))), ir = /* @__PURE__ */ f(3, (e, t, n) => {
  if (Rs(t) === !1)
    return e.referential.set(t, n), e;
  const r = t[L](), s = e.buckets.get(r);
  return s === void 0 ? (e.buckets.set(r, [[t, n]]), e.bucketsSize++, e) : (F0(e, s, t), s.push([t, n]), e.bucketsSize++, e);
}), F0 = (e, t, n) => {
  for (let r = 0, s = t.length; r < s; r++)
    if (n[P](t[r][0])) {
      t.splice(r, 1), e.bucketsSize--;
      return;
    }
}, C0 = "effect/Clock", bu = /* @__PURE__ */ Symbol.for(C0), oa = /* @__PURE__ */ rn("effect/Clock"), P0 = 2 ** 31 - 1, wu = {
  unsafeSchedule(e, t) {
    const n = Ti(t);
    if (n > P0)
      return yi;
    let r = !1;
    const s = setTimeout(() => {
      r = !0, e();
    }, n);
    return () => (clearTimeout(s), !r);
  }
}, ku = /* @__PURE__ */ function() {
  const e = /* @__PURE__ */ BigInt(1e6);
  if (typeof performance > "u")
    return () => BigInt(Date.now()) * e;
  if (typeof performance.timeOrigin == "number" && performance.timeOrigin === 0)
    return () => BigInt(Math.round(performance.now() * 1e6));
  const t = /* @__PURE__ */ BigInt(/* @__PURE__ */ Date.now()) * e - /* @__PURE__ */ BigInt(/* @__PURE__ */ Math.round(/* @__PURE__ */ performance.now() * 1e6));
  return () => t + BigInt(Math.round(performance.now() * 1e6));
}(), x0 = /* @__PURE__ */ function() {
  const e = typeof process == "object" && "hrtime" in process && typeof process.hrtime.bigint == "function" ? process.hrtime : void 0;
  if (!e)
    return ku;
  const t = /* @__PURE__ */ ku() - /* @__PURE__ */ e.bigint();
  return () => t + e.bigint();
}();
var hl;
hl = bu;
class j0 {
  constructor() {
    c(this, hl, bu);
    c(this, "currentTimeMillis", /* @__PURE__ */ R(() => this.unsafeCurrentTimeMillis()));
    c(this, "currentTimeNanos", /* @__PURE__ */ R(() => this.unsafeCurrentTimeNanos()));
  }
  unsafeCurrentTimeMillis() {
    return Date.now();
  }
  unsafeCurrentTimeNanos() {
    return x0();
  }
  scheduler() {
    return Y(wu);
  }
  sleep(t) {
    return $r((n) => {
      const r = wu.unsafeSchedule(() => n(Ze), t);
      return zr(R(r));
    });
  }
}
const L0 = () => new j0(), Cd = "And", Pd = "Or", xd = "InvalidData", jd = "MissingData", Ld = "SourceUnavailable", Kd = "Unsupported", K0 = "effect/ConfigError", Ou = /* @__PURE__ */ Symbol.for(K0), Zn = {
  _tag: "ConfigError",
  [Ou]: Ou
}, Ud = (e, t) => {
  const n = Object.create(Zn);
  return n._op = Cd, n.left = e, n.right = t, Object.defineProperty(n, "toString", {
    enumerable: !1,
    value() {
      return `${this.left} and ${this.right}`;
    }
  }), n;
}, Dd = (e, t) => {
  const n = Object.create(Zn);
  return n._op = Pd, n.left = e, n.right = t, Object.defineProperty(n, "toString", {
    enumerable: !1,
    value() {
      return `${this.left} or ${this.right}`;
    }
  }), n;
}, U0 = (e, t, n = {
  pathDelim: "."
}) => {
  const r = Object.create(Zn);
  return r._op = xd, r.path = e, r.message = t, Object.defineProperty(r, "toString", {
    enumerable: !1,
    value() {
      return `(Invalid data at ${g(this.path, Wn(n.pathDelim))}: "${this.message}")`;
    }
  }), r;
}, Qt = (e, t, n = {
  pathDelim: "."
}) => {
  const r = Object.create(Zn);
  return r._op = jd, r.path = e, r.message = t, Object.defineProperty(r, "toString", {
    enumerable: !1,
    value() {
      return `(Missing data at ${g(this.path, Wn(n.pathDelim))}: "${this.message}")`;
    }
  }), r;
}, D0 = (e, t, n, r = {
  pathDelim: "."
}) => {
  const s = Object.create(Zn);
  return s._op = Ld, s.path = e, s.message = t, s.cause = n, Object.defineProperty(s, "toString", {
    enumerable: !1,
    value() {
      return `(Source unavailable at ${g(this.path, Wn(r.pathDelim))}: "${this.message}")`;
    }
  }), s;
}, q0 = (e, t, n = {
  pathDelim: "."
}) => {
  const r = Object.create(Zn);
  return r._op = Kd, r.path = e, r.message = t, Object.defineProperty(r, "toString", {
    enumerable: !1,
    value() {
      return `(Unsupported operation at ${g(this.path, Wn(n.pathDelim))}: "${this.message}")`;
    }
  }), r;
}, Kt = /* @__PURE__ */ f(2, (e, t) => {
  switch (e._op) {
    case Cd:
      return Ud(Kt(e.left, t), Kt(e.right, t));
    case Pd:
      return Dd(Kt(e.left, t), Kt(e.right, t));
    case xd:
      return U0([...t, ...e.path], e.message);
    case jd:
      return Qt([...t, ...e.path], e.message);
    case Ld:
      return D0([...t, ...e.path], e.message, e.cause);
    case Kd:
      return q0([...t, ...e.path], e.message);
  }
}), B0 = {
  _tag: "Empty"
}, ii = /* @__PURE__ */ f(2, (e, t) => {
  let n = qc(t), r = e;
  for (; xS(n); ) {
    const s = n.head;
    switch (s._tag) {
      case "Empty": {
        n = n.tail;
        break;
      }
      case "AndThen": {
        n = zt(s.first, zt(s.second, n.tail));
        break;
      }
      case "MapName": {
        r = bn(r, s.f), n = n.tail;
        break;
      }
      case "Nested": {
        r = Fs(r, s.name), n = n.tail;
        break;
      }
      case "Unnested": {
        if (g(mr(r), wp(s.name)))
          r = Wt(r), n = n.tail;
        else
          return T(Qt(r, `Expected ${s.name} to be in path in ConfigProvider#unnested`));
        break;
      }
    }
  }
  return C(r);
}), J0 = "Constant", V0 = "Fail", W0 = "Fallback", H0 = "Described", G0 = "Lazy", z0 = "MapOrFail", Y0 = "Nested", Q0 = "Primitive", X0 = "Sequence", Z0 = "HashMap", ek = "ZipWith", Vs = (e, t) => [...e, ...t], tk = "effect/ConfigProvider", vu = /* @__PURE__ */ Symbol.for(tk), nk = /* @__PURE__ */ rn("effect/ConfigProvider"), rk = "effect/ConfigProviderFlat", Eu = /* @__PURE__ */ Symbol.for(rk), sk = (e) => ({
  [vu]: vu,
  pipe() {
    return v(this, arguments);
  },
  ...e
}), ok = (e) => ({
  [Eu]: Eu,
  patch: e.patch,
  load: (t, n, r = !0) => e.load(t, n, r),
  enumerateChildren: e.enumerateChildren
}), ik = (e) => sk({
  load: (t) => I(Ke(e, In(), t, !1), (n) => de(mr(n), {
    onNone: () => Re(Qt(In(), `Expected a single value having structure: ${t}`)),
    onSome: Y
  })),
  flattened: e
}), ck = (e) => {
  const {
    pathDelim: t,
    seqDelim: n
  } = Object.assign({}, {
    pathDelim: "_",
    seqDelim: ","
  }, e), r = (u) => g(u, Wn(t)), s = (u) => u.split(t), o = () => typeof process < "u" && "env" in process && typeof process.env == "object" ? process.env : {};
  return ik(ok({
    load: (u, l, h = !0) => {
      const d = r(u), p = o(), m = d in p ? N(p[d]) : k();
      return g(m, Fo(() => Qt(u, `Expected ${d} to exist in the process context`)), I((y) => hk(y, u, l, n, h)));
    },
    enumerateChildren: (u) => R(() => {
      const l = o(), p = Object.keys(l).map((m) => s(m.toUpperCase())).filter((m) => {
        for (let y = 0; y < u.length; y++) {
          const O = g(u, bf(y)), _ = m[y];
          if (_ === void 0 || O !== _)
            return !1;
        }
        return !0;
      }).flatMap((m) => m.slice(u.length, u.length + 1));
      return yS(p);
    }),
    patch: B0
  }));
}, ak = (e, t, n, r) => {
  const s = Ua(n.length, (u) => u >= r.length ? k() : N([e(u), u + 1])), o = Ua(r.length, (u) => u >= n.length ? k() : N([t(u), u + 1])), i = Vs(n, s), a = Vs(r, o);
  return [i, a];
}, uk = (e, t) => {
  let n = t;
  if (n._tag === "Nested") {
    const r = e.slice();
    for (; n._tag === "Nested"; )
      r.push(n.name), n = n.config;
    return r;
  }
  return e;
}, Ke = (e, t, n, r) => {
  const s = n;
  switch (s._tag) {
    case J0:
      return Y(Ve(s.value));
    case H0:
      return ie(() => Ke(e, t, s.config, r));
    case V0:
      return Re(Qt(t, s.message));
    case W0:
      return g(ie(() => Ke(e, t, s.first, r)), Li((o) => s.condition(o) ? g(Ke(e, t, s.second, r), Li((i) => Re(Dd(o, i)))) : Re(o)));
    case G0:
      return ie(() => Ke(e, t, s.config(), r));
    case z0:
      return ie(() => g(Ke(e, t, s.original, r), I($t((o) => g(s.mapOrFail(o), Fo(Kt(uk(t, s.original))))))));
    case Y0:
      return ie(() => Ke(e, Vs(t, Ve(s.name)), s.config, r));
    case Q0:
      return g(ii(t, e.patch), I((o) => g(e.load(o, s, r), I((i) => {
        if (i.length === 0) {
          const a = g(Ap(o), me(() => "<n/a>"));
          return Re(Qt([], `Expected ${s.description} with name ${a}`));
        }
        return Y(i);
      }))));
    case X0:
      return g(ii(t, e.patch), I((o) => g(e.enumerateChildren(o), I(gk), I((i) => i.length === 0 ? ie(() => Ne(Ke(e, t, s.config, !0), Ve)) : g($t(i, (a) => Ke(e, Ip(t, `[${a}]`), s.config, !0)), Ne((a) => {
        const u = Dp(a);
        return u.length === 0 ? Ve(In()) : Ve(u);
      }))))));
    case Z0:
      return ie(() => g(ii(t, e.patch), I((o) => g(e.enumerateChildren(o), I((i) => g(i, $t((a) => Ke(e, Vs(o, Ve(a)), s.valueConfig, r)), Ne((a) => a.length === 0 ? Ve(Dc()) : g(dk(a), bn((u) => IS(Ka(X(i), u)))))))))));
    case ek:
      return ie(() => g(Ke(e, t, s.left, r), Js, I((o) => g(Ke(e, t, s.right, r), Js, I((i) => {
        if (he(o) && he(i))
          return Re(Ud(o.left, i.left));
        if (he(o) && it(i))
          return Re(o.left);
        if (it(o) && he(i))
          return Re(i.left);
        if (it(o) && it(i)) {
          const a = g(t, Wn(".")), u = lk(t, a), [l, h] = ak(u, u, g(o.right, bn(C)), g(i.right, bn(C)));
          return g(l, Ka(h), $t(([d, p]) => g(kd(d, p), Ne(([m, y]) => s.zip(m, y)))));
        }
        throw new Error("BUG: ConfigProvider.fromFlatLoop - please report an issue at https://github.com/Effect-TS/effect/issues");
      })))));
  }
}, lk = (e, t) => (n) => T(Qt(e, `The element at index ${n} in a sequence at path "${t}" was missing`)), fk = (e, t) => e.split(new RegExp(`\\s*${Cs(t)}\\s*`)), hk = (e, t, n, r, s) => s ? g(fk(e, r), $t((o) => n.parse(o.trim())), Fo(Kt(t))) : g(n.parse(e), zc({
  onFailure: Kt(t),
  onSuccess: Ve
})), dk = (e) => Object.keys(e[0]).map((t) => e.map((n) => n[t])), gk = (e) => g($t(e, pk), zc({
  onFailure: () => In(),
  onSuccess: br($n)
}), Js, Ne(ap)), mk = /^(\[(\d+)\])$/, pk = (e) => {
  const t = e.match(mk);
  if (t !== null) {
    const n = t[2];
    return g(n !== void 0 && n.length > 0 ? N(n) : k(), Vn(yk));
  }
  return k();
}, yk = (e) => {
  const t = Number.parseInt(e);
  return Number.isNaN(t) ? k() : N(t);
}, Tu = /* @__PURE__ */ Symbol.for("effect/Console"), qd = /* @__PURE__ */ rn("effect/Console"), _k = {
  [Tu]: Tu,
  assert(e, ...t) {
    return R(() => {
      console.assert(e, ...t);
    });
  },
  clear: /* @__PURE__ */ R(() => {
    console.clear();
  }),
  count(e) {
    return R(() => {
      console.count(e);
    });
  },
  countReset(e) {
    return R(() => {
      console.countReset(e);
    });
  },
  debug(...e) {
    return R(() => {
      console.debug(...e);
    });
  },
  dir(e, t) {
    return R(() => {
      console.dir(e, t);
    });
  },
  dirxml(...e) {
    return R(() => {
      console.dirxml(...e);
    });
  },
  error(...e) {
    return R(() => {
      console.error(...e);
    });
  },
  group(e) {
    return e != null && e.collapsed ? R(() => console.groupCollapsed(e == null ? void 0 : e.label)) : R(() => console.group(e == null ? void 0 : e.label));
  },
  groupEnd: /* @__PURE__ */ R(() => {
    console.groupEnd();
  }),
  info(...e) {
    return R(() => {
      console.info(...e);
    });
  },
  log(...e) {
    return R(() => {
      console.log(...e);
    });
  },
  table(e, t) {
    return R(() => {
      console.table(e, t);
    });
  },
  time(e) {
    return R(() => console.time(e));
  },
  timeEnd(e) {
    return R(() => console.timeEnd(e));
  },
  timeLog(e, ...t) {
    return R(() => {
      console.timeLog(e, ...t);
    });
  },
  trace(...e) {
    return R(() => {
      console.trace(...e);
    });
  },
  warn(...e) {
    return R(() => {
      console.warn(...e);
    });
  },
  unsafe: console
}, Sk = "effect/Random", Iu = /* @__PURE__ */ Symbol.for(Sk), bk = /* @__PURE__ */ rn("effect/Random");
var dl;
dl = Iu;
class wk {
  constructor(t) {
    c(this, "seed");
    c(this, dl, Iu);
    c(this, "PRNG");
    this.seed = t, this.PRNG = new Cm(t);
  }
  get next() {
    return R(() => this.PRNG.number());
  }
  get nextBoolean() {
    return Ne(this.next, (t) => t > 0.5);
  }
  get nextInt() {
    return R(() => this.PRNG.integer(Number.MAX_SAFE_INTEGER));
  }
  nextRange(t, n) {
    return Ne(this.next, (r) => (n - t) * r + t);
  }
  nextIntBetween(t, n) {
    return R(() => this.PRNG.integer(n - t) + t);
  }
  shuffle(t) {
    return kk(t, (n) => this.nextIntBetween(0, n));
  }
}
const kk = (e, t) => ie(() => g(R(() => Array.from(e)), I((n) => {
  const r = [];
  for (let s = n.length; s >= 2; s = s - 1)
    r.push(s);
  return g(r, Ao((s) => g(t(s), Ne((o) => Ok(n, s - 1, o)))), Gr(mh(n)));
}))), Ok = (e, t, n) => {
  const r = e[t];
  return e[t] = e[n], e[n] = r, e;
}, vk = (e) => new wk(b(e)), $u = /* @__PURE__ */ Symbol.for("effect/Tracer"), Ek = (e) => ({
  [$u]: $u,
  ...e
}), Bd = /* @__PURE__ */ rn("effect/Tracer"), Jd = /* @__PURE__ */ rn("effect/ParentSpan"), Ru = /* @__PURE__ */ function() {
  const e = "abcdef0123456789", t = e.length;
  return function(n) {
    let r = "";
    for (let s = 0; s < n; s++)
      r += e.charAt(Math.floor(Math.random() * t));
    return r;
  };
}();
class Tk {
  constructor(t, n, r, s, o, i) {
    c(this, "name");
    c(this, "parent");
    c(this, "context");
    c(this, "startTime");
    c(this, "kind");
    c(this, "_tag", "Span");
    c(this, "spanId");
    c(this, "traceId", "native");
    c(this, "sampled", !0);
    c(this, "status");
    c(this, "attributes");
    c(this, "events", []);
    c(this, "links");
    this.name = t, this.parent = n, this.context = r, this.startTime = o, this.kind = i, this.status = {
      _tag: "Started",
      startTime: o
    }, this.attributes = /* @__PURE__ */ new Map(), this.traceId = n._tag === "Some" ? n.value.traceId : Ru(32), this.spanId = Ru(16), this.links = Array.from(s);
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
const Ik = /* @__PURE__ */ Ek({
  span: (e, t, n, r, s, o) => new Tk(e, t, n, r, s, o),
  context: (e) => e()
}), $k = /* @__PURE__ */ g(/* @__PURE__ */ Nc(), /* @__PURE__ */ sr(oa, /* @__PURE__ */ L0()), /* @__PURE__ */ sr(qd, _k), /* @__PURE__ */ sr(bk, /* @__PURE__ */ vk(/* @__PURE__ */ Math.random())), /* @__PURE__ */ sr(nk, /* @__PURE__ */ ck()), /* @__PURE__ */ sr(Bd, Ik)), Ws = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/DefaultServices/currentServices"), () => Id($k));
function Rk(e) {
  return new Mt(e);
}
function Nk() {
  return Rk(/* @__PURE__ */ new Map());
}
const Nu = /* @__PURE__ */ Symbol.for("effect/FiberRefs");
var gl;
gl = Nu;
class Mt {
  constructor(t) {
    c(this, "locals");
    c(this, gl, Nu);
    this.locals = t;
  }
  pipe() {
    return v(this, arguments);
  }
}
const Mk = (e, t, n, r = !1) => {
  const s = e;
  let o = t, i = n, a = r, u;
  for (; u === void 0; )
    if (pe(o) && pe(i)) {
      const l = Me(o)[0], h = Wt(o), d = Me(i)[0], p = Me(i)[1], m = Wt(i);
      l.startTimeMillis < d.startTimeMillis ? (i = m, a = !0) : l.startTimeMillis > d.startTimeMillis ? o = h : l.id < d.id ? (i = m, a = !0) : l.id > d.id ? o = h : u = [p, a];
    } else
      u = [s.initial, !0];
  return u;
}, Ak = /* @__PURE__ */ f(3, (e, t, n) => {
  const r = new Map(e.locals);
  return n.locals.forEach((s, o) => {
    const i = s[0][1];
    if (!s[0][0][P](t)) {
      if (!r.has(o)) {
        if (x(i, o.initial))
          return;
        r.set(o, [[t, o.join(o.initial, i)]]);
        return;
      }
      const a = r.get(o), [u, l] = Mk(o, a, s);
      if (l) {
        const h = o.diff(u, i), d = a[0][1], p = o.join(d, o.patch(h)(d));
        if (!x(d, p)) {
          let m;
          const y = a[0][0];
          y[P](t) ? m = [[y, p], ...a.slice(1)] : m = [[t, p], ...a], r.set(o, m);
        }
      }
    }
  }), new Mt(r);
}), Fk = /* @__PURE__ */ f(2, (e, t) => {
  const n = /* @__PURE__ */ new Map();
  return Vd(e, n, t), new Mt(n);
}), Vd = (e, t, n) => {
  e.locals.forEach((r, s) => {
    const o = r[0][1], i = s.patch(s.fork)(o);
    x(o, i) ? t.set(s, r) : t.set(s, [[n, i], ...r]);
  });
}, Wd = /* @__PURE__ */ f(2, (e, t) => {
  const n = new Map(e.locals);
  return n.delete(t), new Mt(n);
}), Ck = /* @__PURE__ */ f(2, (e, t) => e.locals.has(t) ? N(Me(e.locals.get(t))[1]) : k()), Rr = /* @__PURE__ */ f(2, (e, t) => g(Ck(e, t), me(() => t.initial))), Di = /* @__PURE__ */ f(2, (e, {
  fiberId: t,
  fiberRef: n,
  value: r
}) => {
  if (e.locals.size === 0)
    return new Mt(/* @__PURE__ */ new Map([[n, [[t, r]]]]));
  const s = new Map(e.locals);
  return qi(s, t, n, r), new Mt(s);
}), qi = (e, t, n, r) => {
  const s = e.get(n) ?? [];
  let o;
  if (pe(s)) {
    const [i, a] = Me(s);
    if (i[P](t)) {
      if (x(a, r))
        return;
      o = [[t, r], ...s.slice(1)];
    } else
      o = [[t, r], ...s];
  } else
    o = [[t, r]];
  e.set(n, o);
}, Pk = /* @__PURE__ */ f(2, (e, {
  entries: t,
  forkAs: n
}) => {
  if (e.locals.size === 0)
    return new Mt(new Map(t));
  const r = new Map(e.locals);
  return n !== void 0 && Vd(e, r, n), t.forEach(([s, o]) => {
    o.length === 1 ? qi(r, o[0][0], s, o[0][1]) : o.forEach(([i, a]) => {
      qi(r, i, s, a);
    });
  }), new Mt(r);
}), xk = Rr, jk = Pk, Lk = Nk, Kk = Vw, Uk = Ww, Dk = Hw, qk = Gw, Bk = Ed, Jk = Td, Vk = zw, Wk = Yw, Hk = /* @__PURE__ */ g($n, /* @__PURE__ */ yf((e) => e.ordinal)), Gk = /* @__PURE__ */ fp(Hk), zk = (e) => {
  switch (e) {
    case "All":
      return Kk;
    case "Debug":
      return Jk;
    case "Error":
      return Dk;
    case "Fatal":
      return Uk;
    case "Info":
      return Bk;
    case "Trace":
      return Vk;
    case "None":
      return Wk;
    case "Warning":
      return qk;
  }
}, Hd = (e) => e.replace(/[\s="]/g, "_"), Yk = (e) => (t) => `${Hd(t.label)}=${e - t.startTime}ms`, Qk = jr, Xk = Ym;
class Zk extends Xk {
}
const Gd = "Empty", zd = "Add", Yd = "Remove", Qd = "Update", Xd = "AndThen", eO = {
  _tag: Gd
}, tO = (e, t) => {
  const n = new Map(e.locals);
  let r = eO;
  for (const [s, o] of t.locals.entries()) {
    const i = Me(o)[1], a = n.get(s);
    if (a !== void 0) {
      const u = Me(a)[1];
      x(u, i) || (r = ci({
        _tag: Qd,
        fiberRef: s,
        patch: s.diff(u, i)
      })(r));
    } else
      r = ci({
        _tag: zd,
        fiberRef: s,
        value: i
      })(r);
    n.delete(s);
  }
  for (const [s] of n.entries())
    r = ci({
      _tag: Yd,
      fiberRef: s
    })(r);
  return r;
}, ci = /* @__PURE__ */ f(2, (e, t) => ({
  _tag: Xd,
  first: e,
  second: t
})), nO = /* @__PURE__ */ f(3, (e, t, n) => {
  let r = n, s = Ve(e);
  for (; pe(s); ) {
    const o = Me(s), i = Wt(s);
    switch (o._tag) {
      case Gd: {
        s = i;
        break;
      }
      case zd: {
        r = Di(r, {
          fiberId: t,
          fiberRef: o.fiberRef,
          value: o.value
        }), s = i;
        break;
      }
      case Yd: {
        r = Wd(r, o.fiberRef), s = i;
        break;
      }
      case Qd: {
        const a = Rr(r, o.fiberRef);
        r = Di(r, {
          fiberId: t,
          fiberRef: o.fiberRef,
          value: o.fiberRef.patch(o.patch)(a)
        }), s = i;
        break;
      }
      case Xd: {
        s = Fs(o.first)(Fs(o.second)(i));
        break;
      }
    }
  }
  return r;
}), Zd = "effect/MetricLabel", Bi = /* @__PURE__ */ Symbol.for(Zd);
var ml;
class rO {
  constructor(t, n) {
    c(this, "key");
    c(this, "value");
    c(this, ml, Bi);
    c(this, "_hash");
    this.key = t, this.value = n, this._hash = ne(Zd + this.key + this.value);
  }
  [(ml = Bi, L)]() {
    return this._hash;
  }
  [P](t) {
    return oO(t) && this.key === t.key && this.value === t.value;
  }
  pipe() {
    return v(this, arguments);
  }
}
const sO = (e, t) => new rO(e, t), oO = (e) => M(e, Bi), iO = "Sequential", cO = "Parallel", aO = "ParallelN", eg = {
  _tag: iO
}, uO = {
  _tag: cO
}, lO = (e) => ({
  _tag: aO,
  parallelism: e
}), Ji = eg, Vi = uO, Wi = lO, fO = tO, hO = nO, Ko = "effect/FiberStatus", Xt = /* @__PURE__ */ Symbol.for(Ko), Hs = "Done", Mu = "Running", Au = "Suspended", dO = /* @__PURE__ */ ne(`${Ko}-${Hs}`);
var pl;
class gO {
  constructor() {
    c(this, pl, Xt);
    c(this, "_tag", Hs);
  }
  [(pl = Xt, L)]() {
    return dO;
  }
  [P](t) {
    return ia(t) && t._tag === Hs;
  }
}
var yl;
class mO {
  constructor(t) {
    c(this, "runtimeFlags");
    c(this, yl, Xt);
    c(this, "_tag", Mu);
    this.runtimeFlags = t;
  }
  [(yl = Xt, L)]() {
    return g(b(Ko), B(b(this._tag)), B(b(this.runtimeFlags)), Z(this));
  }
  [P](t) {
    return ia(t) && t._tag === Mu && this.runtimeFlags === t.runtimeFlags;
  }
}
var _l;
class pO {
  constructor(t, n) {
    c(this, "runtimeFlags");
    c(this, "blockingOn");
    c(this, _l, Xt);
    c(this, "_tag", Au);
    this.runtimeFlags = t, this.blockingOn = n;
  }
  [(_l = Xt, L)]() {
    return g(b(Ko), B(b(this._tag)), B(b(this.runtimeFlags)), B(b(this.blockingOn)), Z(this));
  }
  [P](t) {
    return ia(t) && t._tag === Au && this.runtimeFlags === t.runtimeFlags && x(this.blockingOn, t.blockingOn);
  }
}
const yO = /* @__PURE__ */ new gO(), _O = (e) => new mO(e), SO = (e, t) => new pO(e, t), ia = (e) => M(e, Xt), bO = (e) => e._tag === Hs, wO = yO, tg = _O, kO = SO, OO = bO, vO = /* @__PURE__ */ Symbol.for("effect/Micro"), Gs = /* @__PURE__ */ Symbol.for("effect/Micro/MicroExit"), Fu = /* @__PURE__ */ Symbol.for("effect/Micro/MicroCause"), EO = {
  _E: H
};
var Sl;
class ng extends globalThis.Error {
  constructor(n, r, s) {
    const o = `MicroCause.${n}`;
    let i, a, u;
    if (r instanceof globalThis.Error) {
      i = `(${o}) ${r.name}`, a = r.message;
      const l = a.split(`
`).length;
      u = r.stack ? `(${o}) ${r.stack.split(`
`).slice(0, l + 3).join(`
`)}` : `${i}: ${a}`;
    } else
      i = o, a = En(r, 0), u = `${i}: ${a}`;
    s.length > 0 && (u += `
    ${s.join(`
    `)}`);
    super(a);
    c(this, "_tag");
    c(this, "traces");
    c(this, Sl);
    this._tag = n, this.traces = s, this[Fu] = EO, this.name = i, this.stack = u;
  }
  pipe() {
    return v(this, arguments);
  }
  toString() {
    return this.stack;
  }
  [(Sl = Fu, Q)]() {
    return this.stack;
  }
}
class TO extends ng {
  constructor(n, r = []) {
    super("Die", n, r);
    c(this, "defect");
    this.defect = n;
  }
}
const IO = (e, t = []) => new TO(e, t);
class $O extends ng {
  constructor(t = []) {
    super("Interrupt", "interrupted", t);
  }
}
const RO = (e = []) => new $O(e), NO = (e) => e._tag === "Interrupt", Cu = /* @__PURE__ */ Symbol.for("effect/Micro/MicroFiber"), MO = {
  _A: H,
  _E: H
};
var bl;
bl = Cu;
class AO {
  constructor(t, n = !0) {
    c(this, "context");
    c(this, "interruptible");
    c(this, bl);
    c(this, "_stack", []);
    c(this, "_observers", []);
    c(this, "_exit");
    c(this, "_children");
    c(this, "currentOpCount", 0);
    c(this, "_interrupted", !1);
    // cancel the yielded operation, or for the yielded exit value
    c(this, "_yielded");
    this.context = t, this.interruptible = n, this[Cu] = MO;
  }
  getRef(t) {
    return o_(this.context, t);
  }
  addObserver(t) {
    return this._exit ? (t(this._exit), ym) : (this._observers.push(t), () => {
      const n = this._observers.indexOf(t);
      n >= 0 && this._observers.splice(n, 1);
    });
  }
  unsafeInterrupt() {
    this._exit || (this._interrupted = !0, this.interruptible && this.evaluate(fa));
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
    if (n === cs)
      return;
    const r = Pu.interruptChildren && Pu.interruptChildren(this);
    if (r !== void 0)
      return this.evaluate(Ys(r, () => n));
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
        if (this.currentOpCount++, !n && this.getRef(ha).shouldYield(this)) {
          n = !0;
          const s = r;
          r = Ys(jO, () => s);
        }
        if (r = r[Hi](this), r === cs) {
          const s = this._yielded;
          return Gs in s ? (this._yielded = void 0, s) : cs;
        }
      }
    } catch (s) {
      return M(r, Hi) ? Gi(s) : Gi(`MicroFiber.runLoop: Not a valid effect: ${String(r)}`);
    }
  }
  getCont(t) {
    for (; ; ) {
      const n = this._stack.pop();
      if (!n) return;
      const r = n[zs] && n[zs](this);
      if (r) return {
        [t]: r
      };
      if (n[t]) return n;
    }
  }
  yieldWith(t) {
    return this._yielded = t, cs;
  }
  children() {
    return this._children ?? (this._children = /* @__PURE__ */ new Set());
  }
}
const Pu = /* @__PURE__ */ J("effect/Micro/fiberMiddleware", () => ({
  interruptChildren: void 0
})), rg = /* @__PURE__ */ Symbol.for("effect/Micro/identifier"), ce = /* @__PURE__ */ Symbol.for("effect/Micro/args"), Hi = /* @__PURE__ */ Symbol.for("effect/Micro/evaluate"), Jn = /* @__PURE__ */ Symbol.for("effect/Micro/successCont"), vn = /* @__PURE__ */ Symbol.for("effect/Micro/failureCont"), zs = /* @__PURE__ */ Symbol.for("effect/Micro/ensureCont"), cs = /* @__PURE__ */ Symbol.for("effect/Micro/Yield"), FO = {
  _A: H,
  _E: H,
  _R: H
}, CO = {
  ...Qk,
  _op: "Micro",
  [vO]: FO,
  pipe() {
    return v(this, arguments);
  },
  [Symbol.iterator]() {
    return new Xl(new Cr(this));
  },
  toJSON() {
    return {
      _id: "Micro",
      op: this[rg],
      ...ce in this ? {
        args: this[ce]
      } : void 0
    };
  },
  toString() {
    return ge(this);
  },
  [Q]() {
    return ge(this);
  }
};
function PO(e) {
  return Gi("Micro.evaluate: Not implemented");
}
const Uo = (e) => ({
  ...CO,
  [rg]: e.op,
  [Hi]: e.eval ?? PO,
  [Jn]: e.contA,
  [vn]: e.contE,
  [zs]: e.ensure
}), ca = (e) => {
  const t = Uo(e);
  return function() {
    const n = Object.create(t);
    return n[ce] = e.single === !1 ? arguments : arguments[0], n;
  };
}, sg = (e) => {
  const t = {
    ...Uo(e),
    [Gs]: Gs,
    _tag: e.op,
    get [e.prop]() {
      return this[ce];
    },
    toJSON() {
      return {
        _id: "MicroExit",
        _tag: e.op,
        [e.prop]: this[ce]
      };
    },
    [P](n) {
      return UO(n) && n._tag === e.op && x(this[ce], n[ce]);
    },
    [L]() {
      return Z(this, B(ne(e.op))(b(this[ce])));
    }
  };
  return function(n) {
    const r = Object.create(t);
    return r[ce] = n, r[Jn] = void 0, r[vn] = void 0, r[zs] = void 0, r;
  };
}, aa = /* @__PURE__ */ sg({
  op: "Success",
  prop: "value",
  eval(e) {
    const t = e.getCont(Jn);
    return t ? t[Jn](this[ce], e) : e.yieldWith(this);
  }
}), og = /* @__PURE__ */ sg({
  op: "Failure",
  prop: "cause",
  eval(e) {
    let t = e.getCont(vn);
    for (; NO(this[ce]) && t && e.interruptible; )
      t = e.getCont(vn);
    return t ? t[vn](this[ce], e) : e.yieldWith(this);
  }
}), xO = /* @__PURE__ */ ca({
  op: "Yield",
  eval(e) {
    let t = !1;
    return e.getRef(ha).scheduleTask(() => {
      t || e.evaluate(DO);
    }, this[ce] ?? 0), e.yieldWith(() => {
      t = !0;
    });
  }
}), jO = /* @__PURE__ */ xO(0), LO = /* @__PURE__ */ aa(void 0), ua = /* @__PURE__ */ ca({
  op: "WithMicroFiber",
  eval(e) {
    return this[ce](e);
  }
}), Ys = /* @__PURE__ */ f(2, (e, t) => {
  const n = Object.create(KO);
  return n[ce] = e, n[Jn] = t, n;
}), KO = /* @__PURE__ */ Uo({
  op: "OnSuccess",
  eval(e) {
    return e._stack.push(this), this[ce];
  }
}), UO = (e) => M(e, Gs), ig = aa, la = og, fa = /* @__PURE__ */ la(/* @__PURE__ */ RO()), Gi = (e) => la(IO(e)), DO = /* @__PURE__ */ ig(void 0), qO = "setImmediate" in globalThis ? globalThis.setImmediate : (e) => setTimeout(e, 0);
class cg {
  constructor() {
    c(this, "tasks", []);
    c(this, "running", !1);
    /**
     * @since 3.5.9
     */
    c(this, "afterScheduled", () => {
      this.running = !1, this.runTasks();
    });
  }
  /**
   * @since 3.5.9
   */
  scheduleTask(t, n) {
    this.tasks.push(t), this.running || (this.running = !0, qO(this.afterScheduled));
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
    return t.currentOpCount >= t.getRef(VO);
  }
  /**
   * @since 3.5.9
   */
  flush() {
    for (; this.tasks.length > 0; )
      this.runTasks();
  }
}
const BO = /* @__PURE__ */ f(2, (e, t) => ua((n) => {
  const r = n.context;
  return n.context = t(r), GO(e, () => (n.context = r, LO));
})), JO = /* @__PURE__ */ f(2, (e, t) => BO(e, lh(t)));
class VO extends (/* @__PURE__ */ fh()("effect/Micro/currentMaxOpsBeforeYield", {
  defaultValue: () => 2048
})) {
}
class ha extends (/* @__PURE__ */ fh()("effect/Micro/currentScheduler", {
  defaultValue: () => new cg()
})) {
}
const WO = /* @__PURE__ */ f(2, (e, t) => {
  const n = Object.create(HO);
  return n[ce] = e, n[Jn] = t.onSuccess, n[vn] = t.onFailure, n;
}), HO = /* @__PURE__ */ Uo({
  op: "OnSuccessAndFailure",
  eval(e) {
    return e._stack.push(this), this[ce];
  }
}), GO = /* @__PURE__ */ f(2, (e, t) => YO((n) => WO(n(e), {
  onFailure: (r) => Ys(t(la(r)), () => og(r)),
  onSuccess: (r) => Ys(t(ig(r)), () => aa(r))
}))), ag = /* @__PURE__ */ ca({
  op: "SetInterruptible",
  ensure(e) {
    if (e.interruptible = this[ce], e._interrupted && e.interruptible)
      return () => fa;
  }
}), zO = (e) => ua((t) => t.interruptible ? e : (t.interruptible = !0, t._stack.push(ag(!1)), t._interrupted ? fa : e)), YO = (e) => ua((t) => t.interruptible ? (t.interruptible = !1, t._stack.push(ag(!0)), e(zO)) : e(H)), QO = (e, t) => {
  const n = new AO(ha.context(new cg()));
  return n.evaluate(e), n;
};
class ug {
  constructor() {
    /**
     * @since 2.0.0
     */
    c(this, "buckets", []);
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
class XO {
  constructor(t) {
    c(this, "maxNextTickBeforeTimer");
    /**
     * @since 2.0.0
     */
    c(this, "running", !1);
    /**
     * @since 2.0.0
     */
    c(this, "tasks", /* @__PURE__ */ new ug());
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
    return t.currentOpCount > t.getFiberRef($d) ? t.getFiberRef(jo) : !1;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(t, n) {
    this.tasks.scheduleTask(t, n), this.running || (this.running = !0, this.starve());
  }
}
const lg = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/Scheduler/defaultScheduler"), () => new XO(2048));
class fg {
  constructor() {
    /**
     * @since 2.0.0
     */
    c(this, "tasks", /* @__PURE__ */ new ug());
    /**
     * @since 2.0.0
     */
    c(this, "deferred", !1);
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(t, n) {
    this.deferred ? lg.scheduleTask(t, n) : this.tasks.scheduleTask(t, n);
  }
  /**
   * @since 2.0.0
   */
  shouldYield(t) {
    return t.currentOpCount > t.getFiberRef($d) ? t.getFiberRef(jo) : !1;
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
const hg = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentScheduler"), () => xe(lg)), dg = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentRequestMap"), () => xe(/* @__PURE__ */ new Map())), xu = (e, t, n, r) => {
  switch (e) {
    case void 0:
      return t();
    case "unbounded":
      return n();
    case "inherit":
      return ea(a0, (s) => s === "unbounded" ? n() : s > 1 ? r(s) : t());
    default:
      return e > 1 ? r(e) : t();
  }
}, da = "InterruptSignal", ga = "Stateful", ma = "Resume", pa = "YieldNow", ai = (e) => ({
  _tag: da,
  cause: e
}), vs = (e) => ({
  _tag: ga,
  onFiber: e
}), un = (e) => ({
  _tag: ma,
  effect: e
}), ZO = () => ({
  _tag: pa
}), ev = "effect/FiberScope", Qs = /* @__PURE__ */ Symbol.for(ev);
var wl;
wl = Qs;
class tv {
  constructor() {
    c(this, wl, Qs);
    c(this, "fiberId", xn);
    c(this, "roots", /* @__PURE__ */ new Set());
  }
  add(t, n) {
    this.roots.add(n), n.addObserver(() => {
      this.roots.delete(n);
    });
  }
}
var kl;
kl = Qs;
class nv {
  constructor(t, n) {
    c(this, "fiberId");
    c(this, "parent");
    c(this, kl, Qs);
    this.fiberId = t, this.parent = n;
  }
  add(t, n) {
    this.parent.tell(vs((r) => {
      r.addChild(n), n.addObserver(() => {
        r.removeChild(n);
      });
    }));
  }
}
const rv = (e) => new nv(e.id(), e), ya = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberScope/Global"), () => new tv()), sv = "effect/Fiber", ov = /* @__PURE__ */ Symbol.for(sv), iv = {
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e
}, cv = "effect/Fiber", av = /* @__PURE__ */ Symbol.for(cv), gg = (e) => Od(_d(e.await), e.inheritAll);
({
  ...Kr
});
const Ct = "effect/FiberCurrent", uv = "effect/Logger", lv = /* @__PURE__ */ Symbol.for(uv), fv = {
  /* c8 ignore next */
  _Message: (e) => e,
  /* c8 ignore next */
  _Output: (e) => e
}, _a = (e) => ({
  [lv]: fv,
  log: e,
  pipe() {
    return v(this, arguments);
  }
}), hv = /^[^\s"=]*$/, dv = (e, t) => ({
  annotations: n,
  cause: r,
  date: s,
  fiberId: o,
  logLevel: i,
  message: a,
  spans: u
}) => {
  const l = (y) => y.match(hv) ? y : e(y), h = (y, O) => `${Hd(y)}=${l(O)}`, d = (y, O) => " " + h(y, O);
  let p = h("timestamp", s.toISOString());
  p += d("level", i.label), p += d("fiber", jh(o));
  const m = Ep(a);
  for (let y = 0; y < m.length; y++)
    p += d("message", En(m[y], t));
  uw(r) || (p += d("cause", Qn(r, {
    renderErrorCause: !0
  })));
  for (const y of u)
    p += " " + Yk(s.getTime())(y);
  for (const [y, O] of n)
    p += d(y, En(O, t));
  return p;
}, gv = (e) => `"${e.replace(/\\([\s\S])|(")/g, "\\$1$2")}"`, mv = /* @__PURE__ */ _a(/* @__PURE__ */ dv(gv)), pv = typeof process == "object" && process !== null && typeof process.stdout == "object" && process.stdout !== null;
pv && process.stdout.isTTY;
const mg = "effect/MetricBoundaries", zi = /* @__PURE__ */ Symbol.for(mg);
var Ol;
class yv {
  constructor(t) {
    c(this, "values");
    c(this, Ol, zi);
    c(this, "_hash");
    this.values = t, this._hash = g(ne(mg), B(Pr(this.values)));
  }
  [(Ol = zi, L)]() {
    return this._hash;
  }
  [P](t) {
    return _v(t) && x(this.values, t.values);
  }
  pipe() {
    return v(this, arguments);
  }
}
const _v = (e) => M(e, zi), Sv = (e) => {
  const t = g(e, kc(Ce(Number.POSITIVE_INFINITY)), qp);
  return new yv(t);
}, bv = (e) => g(vp(e.count - 1, (t) => e.start * Math.pow(e.factor, t)), So, Sv), wv = "effect/MetricKeyType", pg = /* @__PURE__ */ Symbol.for(wv), yg = "effect/MetricKeyType/Counter", Yi = /* @__PURE__ */ Symbol.for(yg), kv = "effect/MetricKeyType/Frequency", Ov = /* @__PURE__ */ Symbol.for(kv), vv = "effect/MetricKeyType/Gauge", Ev = /* @__PURE__ */ Symbol.for(vv), _g = "effect/MetricKeyType/Histogram", Qi = /* @__PURE__ */ Symbol.for(_g), Tv = "effect/MetricKeyType/Summary", Iv = /* @__PURE__ */ Symbol.for(Tv), Sg = {
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _Out: (e) => e
};
var vl, El;
class $v {
  constructor(t, n) {
    c(this, "incremental");
    c(this, "bigint");
    c(this, El, Sg);
    c(this, vl, Yi);
    c(this, "_hash");
    this.incremental = t, this.bigint = n, this._hash = ne(yg);
  }
  [(El = pg, vl = Yi, L)]() {
    return this._hash;
  }
  [P](t) {
    return bg(t);
  }
  pipe() {
    return v(this, arguments);
  }
}
var Tl, Il;
class Rv {
  constructor(t) {
    c(this, "boundaries");
    c(this, Il, Sg);
    c(this, Tl, Qi);
    c(this, "_hash");
    this.boundaries = t, this._hash = g(ne(_g), B(b(this.boundaries)));
  }
  [(Il = pg, Tl = Qi, L)]() {
    return this._hash;
  }
  [P](t) {
    return wg(t) && x(this.boundaries, t.boundaries);
  }
  pipe() {
    return v(this, arguments);
  }
}
const Nv = (e) => new $v((e == null ? void 0 : e.incremental) ?? !1, (e == null ? void 0 : e.bigint) ?? !1), Mv = (e) => new Rv(e), bg = (e) => M(e, Yi), Av = (e) => M(e, Ov), Fv = (e) => M(e, Ev), wg = (e) => M(e, Qi), Cv = (e) => M(e, Iv), Pv = "effect/MetricKey", kg = /* @__PURE__ */ Symbol.for(Pv), xv = {
  /* c8 ignore next */
  _Type: (e) => e
}, jv = /* @__PURE__ */ Oc(x);
var $l;
class Sa {
  constructor(t, n, r, s = []) {
    c(this, "name");
    c(this, "keyType");
    c(this, "description");
    c(this, "tags");
    c(this, $l, xv);
    c(this, "_hash");
    this.name = t, this.keyType = n, this.description = r, this.tags = s, this._hash = g(ne(this.name + this.description), B(b(this.keyType)), B(Pr(this.tags)));
  }
  [($l = kg, L)]() {
    return this._hash;
  }
  [P](t) {
    return Lv(t) && this.name === t.name && x(this.keyType, t.keyType) && x(this.description, t.description) && jv(this.tags, t.tags);
  }
  pipe() {
    return v(this, arguments);
  }
}
const Lv = (e) => M(e, kg), Kv = (e, t) => new Sa(e, Nv(t), ho(t == null ? void 0 : t.description)), Uv = (e, t, n) => new Sa(e, Mv(t), ho(n)), Dv = /* @__PURE__ */ f(2, (e, t) => t.length === 0 ? e : new Sa(e.name, e.keyType, e.description, Ss(e.tags, t))), qv = "effect/MetricState", Xr = /* @__PURE__ */ Symbol.for(qv), Og = "effect/MetricState/Counter", Xi = /* @__PURE__ */ Symbol.for(Og), vg = "effect/MetricState/Frequency", Zi = /* @__PURE__ */ Symbol.for(vg), Eg = "effect/MetricState/Gauge", ec = /* @__PURE__ */ Symbol.for(Eg), Tg = "effect/MetricState/Histogram", tc = /* @__PURE__ */ Symbol.for(Tg), Ig = "effect/MetricState/Summary", nc = /* @__PURE__ */ Symbol.for(Ig), Zr = {
  /* c8 ignore next */
  _A: (e) => e
};
var Rl, Nl;
class Bv {
  constructor(t) {
    c(this, "count");
    c(this, Nl, Zr);
    c(this, Rl, Xi);
    this.count = t;
  }
  [(Nl = Xr, Rl = Xi, L)]() {
    return g(b(Og), B(b(this.count)), Z(this));
  }
  [P](t) {
    return eE(t) && this.count === t.count;
  }
  pipe() {
    return v(this, arguments);
  }
}
const Jv = /* @__PURE__ */ Oc(x);
var Ml, Al;
class Vv {
  constructor(t) {
    c(this, "occurrences");
    c(this, Al, Zr);
    c(this, Ml, Zi);
    c(this, "_hash");
    this.occurrences = t;
  }
  [(Al = Xr, Ml = Zi, L)]() {
    return g(ne(vg), B(Pr(X(this.occurrences.entries()))), Z(this));
  }
  [P](t) {
    return tE(t) && Jv(X(this.occurrences.entries()), X(t.occurrences.entries()));
  }
  pipe() {
    return v(this, arguments);
  }
}
var Fl, Cl;
class Wv {
  constructor(t) {
    c(this, "value");
    c(this, Cl, Zr);
    c(this, Fl, ec);
    this.value = t;
  }
  [(Cl = Xr, Fl = ec, L)]() {
    return g(b(Eg), B(b(this.value)), Z(this));
  }
  [P](t) {
    return nE(t) && this.value === t.value;
  }
  pipe() {
    return v(this, arguments);
  }
}
var Pl, xl;
class Hv {
  constructor(t, n, r, s, o) {
    c(this, "buckets");
    c(this, "count");
    c(this, "min");
    c(this, "max");
    c(this, "sum");
    c(this, xl, Zr);
    c(this, Pl, tc);
    this.buckets = t, this.count = n, this.min = r, this.max = s, this.sum = o;
  }
  [(xl = Xr, Pl = tc, L)]() {
    return g(b(Tg), B(b(this.buckets)), B(b(this.count)), B(b(this.min)), B(b(this.max)), B(b(this.sum)), Z(this));
  }
  [P](t) {
    return rE(t) && x(this.buckets, t.buckets) && this.count === t.count && this.min === t.min && this.max === t.max && this.sum === t.sum;
  }
  pipe() {
    return v(this, arguments);
  }
}
var jl, Ll;
class Gv {
  constructor(t, n, r, s, o, i) {
    c(this, "error");
    c(this, "quantiles");
    c(this, "count");
    c(this, "min");
    c(this, "max");
    c(this, "sum");
    c(this, Ll, Zr);
    c(this, jl, nc);
    this.error = t, this.quantiles = n, this.count = r, this.min = s, this.max = o, this.sum = i;
  }
  [(Ll = Xr, jl = nc, L)]() {
    return g(b(Ig), B(b(this.error)), B(b(this.quantiles)), B(b(this.count)), B(b(this.min)), B(b(this.max)), B(b(this.sum)), Z(this));
  }
  [P](t) {
    return sE(t) && this.error === t.error && x(this.quantiles, t.quantiles) && this.count === t.count && this.min === t.min && this.max === t.max && this.sum === t.sum;
  }
  pipe() {
    return v(this, arguments);
  }
}
const zv = (e) => new Bv(e), Yv = (e) => new Vv(e), Qv = (e) => new Wv(e), Xv = (e) => new Hv(e.buckets, e.count, e.min, e.max, e.sum), Zv = (e) => new Gv(e.error, e.quantiles, e.count, e.min, e.max, e.sum), eE = (e) => M(e, Xi), tE = (e) => M(e, Zi), nE = (e) => M(e, ec), rE = (e) => M(e, tc), sE = (e) => M(e, nc), oE = "effect/MetricHook", iE = /* @__PURE__ */ Symbol.for(oE), cE = {
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _Out: (e) => e
}, es = (e) => ({
  [iE]: cE,
  pipe() {
    return v(this, arguments);
  },
  ...e
}), ju = /* @__PURE__ */ BigInt(0), aE = (e) => {
  let t = e.keyType.bigint ? ju : 0;
  const n = e.keyType.incremental ? e.keyType.bigint ? (s) => s >= ju : (s) => s >= 0 : (s) => !0, r = (s) => {
    n(s) && (t = t + s);
  };
  return es({
    get: () => zv(t),
    update: r,
    modify: r
  });
}, uE = (e) => {
  const t = /* @__PURE__ */ new Map();
  for (const r of e.keyType.preregisteredWords)
    t.set(r, 0);
  const n = (r) => {
    const s = t.get(r) ?? 0;
    t.set(r, s + 1);
  };
  return es({
    get: () => Yv(t),
    update: n,
    modify: n
  });
}, lE = (e, t) => {
  let n = t;
  return es({
    get: () => Qv(n),
    update: (r) => {
      n = r;
    },
    modify: (r) => {
      n = n + r;
    }
  });
}, fE = (e) => {
  const t = e.keyType.boundaries.values, n = t.length, r = new Uint32Array(n + 1), s = new Float32Array(n);
  let o = 0, i = 0, a = Number.MAX_VALUE, u = Number.MIN_VALUE;
  g(t, br($n), bn((d, p) => {
    s[p] = d;
  }));
  const l = (d) => {
    let p = 0, m = n;
    for (; p !== m; ) {
      const y = Math.floor(p + (m - p) / 2), O = s[y];
      d <= O ? m = y : p = y, m === p + 1 && (d <= s[p] ? m = p : p = m);
    }
    r[p] = r[p] + 1, o = o + 1, i = i + d, d < a && (a = d), d > u && (u = d);
  }, h = () => {
    const d = go(n);
    let p = 0;
    for (let m = 0; m < n; m++) {
      const y = s[m], O = r[m];
      p = p + O, d[m] = [y, p];
    }
    return d;
  };
  return es({
    get: () => Xv({
      buckets: h(),
      count: o,
      min: a,
      max: u,
      sum: i
    }),
    update: l,
    modify: l
  });
}, hE = (e) => {
  const {
    error: t,
    maxAge: n,
    maxSize: r,
    quantiles: s
  } = e.keyType, o = g(s, br($n)), i = go(r);
  let a = 0, u = 0, l = 0, h = Number.MAX_VALUE, d = Number.MIN_VALUE;
  const p = (y) => {
    const O = [];
    let _ = 0;
    for (; _ !== r - 1; ) {
      const S = i[_];
      if (S != null) {
        const [U, w] = S, $ = Ei(y - U);
        C_($, Sh) && $ <= n && O.push(w);
      }
      _ = _ + 1;
    }
    return dE(t, o, br(O, $n));
  }, m = (y, O) => {
    if (r > 0) {
      a = a + 1;
      const _ = a % r;
      i[_] = [O, y];
    }
    u = u + 1, l = l + y, y < h && (h = y), y > d && (d = y);
  };
  return es({
    get: () => Zv({
      error: t,
      quantiles: p(Date.now()),
      count: u,
      min: h,
      max: d,
      sum: l
    }),
    update: ([y, O]) => m(y, O),
    modify: ([y, O]) => m(y, O)
  });
}, dE = (e, t, n) => {
  const r = n.length;
  if (!pe(t))
    return In();
  const s = t[0], o = t.slice(1), i = Lu(e, r, k(), 0, s, n), a = Ve(i);
  return o.forEach((u) => {
    a.push(Lu(e, r, i.value, i.consumed, u, i.rest));
  }), bn(a, (u) => [u.quantile, u.value]);
}, Lu = (e, t, n, r, s, o) => {
  let i = e, a = t, u = n, l = r, h = s, d = o, p = e, m = t, y = n, O = r, _ = s, S = o;
  for (; ; ) {
    if (!pe(d))
      return {
        quantile: h,
        value: k(),
        consumed: l,
        rest: []
      };
    if (h === 1)
      return {
        quantile: h,
        value: N(wf(d)),
        consumed: l + d.length,
        rest: []
      };
    const U = Cp(d, (j) => j <= d[0]), w = h * a, $ = i / 2 * w, A = l + U[0].length, E = Math.abs(A - w);
    if (A < w - $) {
      p = i, m = a, y = mr(d), O = A, _ = h, S = U[1], i = p, a = m, u = y, l = O, h = _, d = S;
      continue;
    }
    if (A > w + $)
      return {
        quantile: h,
        value: u,
        consumed: l,
        rest: d
      };
    switch (u._tag) {
      case "None": {
        p = i, m = a, y = mr(d), O = A, _ = h, S = U[1], i = p, a = m, u = y, l = O, h = _, d = S;
        continue;
      }
      case "Some": {
        const j = Math.abs(w - u.value);
        if (E < j) {
          p = i, m = a, y = mr(d), O = A, _ = h, S = U[1], i = p, a = m, u = y, l = O, h = _, d = S;
          continue;
        }
        return {
          quantile: h,
          value: N(u.value),
          consumed: l,
          rest: d
        };
      }
    }
  }
  throw new Error("BUG: MetricHook.resolveQuantiles - please report an issue at https://github.com/Effect-TS/effect/issues");
}, gE = "effect/MetricPair", mE = /* @__PURE__ */ Symbol.for(gE), pE = {
  /* c8 ignore next */
  _Type: (e) => e
}, yE = (e, t) => ({
  [mE]: pE,
  metricKey: e,
  metricState: t,
  pipe() {
    return v(this, arguments);
  }
}), _E = "effect/MetricRegistry", Ku = /* @__PURE__ */ Symbol.for(_E);
var Kl;
Kl = Ku;
class SE {
  constructor() {
    c(this, Kl, Ku);
    c(this, "map", /* @__PURE__ */ M0());
  }
  snapshot() {
    const t = [];
    for (const [n, r] of this.map)
      t.push(yE(n, r.get()));
    return t;
  }
  get(t) {
    const n = g(this.map, xt(t), rt);
    if (n == null) {
      if (bg(t.keyType))
        return this.getCounter(t);
      if (Fv(t.keyType))
        return this.getGauge(t);
      if (Av(t.keyType))
        return this.getFrequency(t);
      if (wg(t.keyType))
        return this.getHistogram(t);
      if (Cv(t.keyType))
        return this.getSummary(t);
      throw new Error("BUG: MetricRegistry.get - unknown MetricKeyType - please report an issue at https://github.com/Effect-TS/effect/issues");
    } else
      return n;
  }
  getCounter(t) {
    let n = g(this.map, xt(t), rt);
    if (n == null) {
      const r = aE(t);
      g(this.map, or(t)) || g(this.map, ir(t, r)), n = r;
    }
    return n;
  }
  getFrequency(t) {
    let n = g(this.map, xt(t), rt);
    if (n == null) {
      const r = uE(t);
      g(this.map, or(t)) || g(this.map, ir(t, r)), n = r;
    }
    return n;
  }
  getGauge(t) {
    let n = g(this.map, xt(t), rt);
    if (n == null) {
      const r = lE(t, t.keyType.bigint ? BigInt(0) : 0);
      g(this.map, or(t)) || g(this.map, ir(t, r)), n = r;
    }
    return n;
  }
  getHistogram(t) {
    let n = g(this.map, xt(t), rt);
    if (n == null) {
      const r = fE(t);
      g(this.map, or(t)) || g(this.map, ir(t, r)), n = r;
    }
    return n;
  }
  getSummary(t) {
    let n = g(this.map, xt(t), rt);
    if (n == null) {
      const r = hE(t);
      g(this.map, or(t)) || g(this.map, ir(t, r)), n = r;
    }
    return n;
  }
}
const bE = () => new SE(), wE = "effect/Metric", kE = /* @__PURE__ */ Symbol.for(wE), OE = {
  /* c8 ignore next */
  _Type: (e) => e,
  /* c8 ignore next */
  _In: (e) => e,
  /* c8 ignore next */
  _Out: (e) => e
}, Uu = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/Metric/globalMetricRegistry"), () => bE()), $g = function(e, t, n, r) {
  const s = Object.assign((o) => Dw(o, (i) => IE(s, i)), {
    [kE]: OE,
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
}, Do = (e, t) => Rg(Kv(e, t)), Rg = (e) => {
  let t;
  const n = /* @__PURE__ */ new WeakMap(), r = (s) => {
    if (s.length === 0)
      return t !== void 0 || (t = Uu.get(e)), t;
    let o = n.get(s);
    return o !== void 0 || (o = Uu.get(Dv(e, s)), n.set(s, o)), o;
  };
  return $g(e.keyType, (s, o) => r(o).update(s), (s) => r(s).get(), (s, o) => r(o).modify(s));
}, vE = (e, t, n) => Rg(Uv(e, t, n)), EE = /* @__PURE__ */ f(3, (e, t, n) => TE(e, [sO(t, n)])), TE = /* @__PURE__ */ f(2, (e, t) => $g(e.keyType, (n, r) => e.unsafeUpdate(n, Ss(t, r)), (n) => e.unsafeValue(Ss(t, n)), (n, r) => e.unsafeModify(n, Ss(t, r)))), IE = /* @__PURE__ */ f(2, (e, t) => ea(Ki, (n) => R(() => e.unsafeUpdate(t, n))));
({
  ...Lr
});
const $E = /* @__PURE__ */ f(2, (e, t) => ea(dg, (n) => R(() => {
  if (n.has(e)) {
    const r = n.get(e);
    r.state.completed || (r.state.completed = !0, Fd(r.result, t));
  }
}))), RE = "effect/Supervisor", qo = /* @__PURE__ */ Symbol.for(RE), ba = {
  /* c8 ignore next */
  _T: (e) => e
};
var Ul;
Ul = qo;
const $a = class $a {
  constructor(t, n) {
    c(this, "underlying");
    c(this, "value0");
    c(this, Ul, ba);
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
    return new $a(this, g(this.value, Ne(t)));
  }
  zip(t) {
    return new Zs(this, t);
  }
};
let Xs = $a;
var Dl;
Dl = qo;
const Ra = class Ra {
  constructor(t, n) {
    c(this, "left");
    c(this, "right");
    c(this, "_tag", "Zip");
    c(this, Dl, ba);
    this.left = t, this.right = n;
  }
  get value() {
    return kd(this.left.value, this.right.value);
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
    return new Xs(this, g(this.value, Ne(t)));
  }
  zip(t) {
    return new Ra(this, t);
  }
};
let Zs = Ra;
const Ng = (e) => M(e, qo) && hc(e, "Zip");
var ql;
ql = qo;
class NE {
  constructor(t) {
    c(this, "effect");
    c(this, ql, ba);
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
    return new Xs(this, g(this.value, Ne(t)));
  }
  zip(t) {
    return new Zs(this, t);
  }
  onRun(t, n) {
    return t();
  }
}
const ME = (e) => new NE(e), Bo = /* @__PURE__ */ J("effect/Supervisor/none", () => ME(Ze)), AE = Hn, Mg = "Empty", Ag = "AddSupervisor", Fg = "RemoveSupervisor", Cg = "AndThen", yr = {
  _tag: Mg
}, Es = (e, t) => ({
  _tag: Cg,
  first: e,
  second: t
}), FE = (e, t) => CE(t, Ce(e)), CE = (e, t) => {
  let n = e, r = t;
  for (; An(r); ) {
    const s = Fn(r);
    switch (s._tag) {
      case Mg: {
        r = jt(r);
        break;
      }
      case Ag: {
        n = n.zip(s.supervisor), r = jt(r);
        break;
      }
      case Fg: {
        n = rc(n, s.supervisor), r = jt(r);
        break;
      }
      case Cg: {
        r = Qe(s.first)(Qe(s.second)(jt(r)));
        break;
      }
    }
  }
  return n;
}, rc = (e, t) => x(e, t) ? Bo : Ng(e) ? rc(e.left, t).zip(rc(e.right, t)) : e, eo = (e) => x(e, Bo) ? Gt() : Ng(e) ? g(eo(e.left), Or(eo(e.right))) : Kc(e), PE = (e, t) => {
  if (x(e, t))
    return yr;
  const n = eo(e), r = eo(t), s = g(r, Za(n), Ls(yr, (i, a) => Es(i, {
    _tag: Ag,
    supervisor: a
  }))), o = g(n, Za(r), Ls(yr, (i, a) => Es(i, {
    _tag: Fg,
    supervisor: a
  })));
  return Es(s, o);
}, xE = /* @__PURE__ */ AE({
  empty: yr,
  patch: FE,
  combine: Es,
  diff: PE
}), jE = /* @__PURE__ */ Do("effect_fiber_started", {
  incremental: !0
}), Du = /* @__PURE__ */ Do("effect_fiber_active"), LE = /* @__PURE__ */ Do("effect_fiber_successes", {
  incremental: !0
}), KE = /* @__PURE__ */ Do("effect_fiber_failures", {
  incremental: !0
}), UE = /* @__PURE__ */ EE(/* @__PURE__ */ vE("effect_fiber_lifetimes", /* @__PURE__ */ bv({
  start: 0.5,
  factor: 2,
  count: 35
})), "time_unit", "milliseconds"), cr = "Continue", DE = "Done", qu = "Yield", qE = {
  /* c8 ignore next */
  _E: (e) => e,
  /* c8 ignore next */
  _A: (e) => e
}, as = (e) => {
  throw new Error(`BUG: FiberRuntime - ${En(e)} - please report an issue at https://github.com/Effect-TS/effect/issues`);
}, gt = /* @__PURE__ */ Symbol.for("effect/internal/fiberRuntime/YieldedOp"), mt = /* @__PURE__ */ J("effect/internal/fiberRuntime/yieldedOpChannel", () => ({
  currentOp: null
})), ar = {
  [Ns]: (e, t, n) => Te(() => t.effect_instruction_i1(n)),
  OnStep: (e, t, n) => re(re(n)),
  [Ms]: (e, t, n) => Te(() => t.effect_instruction_i2(n)),
  [yc]: (e, t, n) => (e.patchRuntimeFlags(e.currentRuntimeFlags, t.patch), Et(e.currentRuntimeFlags) && e.isInterrupted() ? G(e.getInterruptedCause()) : re(n)),
  [As]: (e, t, n) => (Te(() => t.effect_instruction_i2(n)), Te(() => t.effect_instruction_i0()) ? (e.pushStack(t), Te(() => t.effect_instruction_i1())) : Ze),
  [ps]: (e, t, n) => {
    const r = Te(() => t.effect_instruction_i0.next(n));
    return r.done ? re(r.value) : (e.pushStack(t), xm(r.value));
  }
}, BE = {
  [da]: (e, t, n, r) => (e.processNewInterruptSignal(r.cause), Et(t) ? G(r.cause) : n),
  [ma]: (e, t, n, r) => {
    throw new Error("It is illegal to have multiple concurrent run loops in a single fiber");
  },
  [ga]: (e, t, n, r) => (r.onFiber(e, tg(t)), n),
  [pa]: (e, t, n, r) => I(Xc(), () => n)
}, JE = (e) => Ao(Wb(e), (t) => Jt(iw(t), ([n, r]) => {
  const s = /* @__PURE__ */ new Map(), o = [];
  for (const a of r) {
    o.push(qt(a));
    for (const u of a)
      s.set(u.request, u);
  }
  const i = o.flat();
  return xo(sT(n.runAll(o), i, () => i.forEach((a) => {
    a.listeners.interrupted = !0;
  })), dg, s);
}, !1, !1)), VE = /* @__PURE__ */ io();
var Bl, Jl;
class Pg extends Zk {
  constructor(n, r, s) {
    super();
    c(this, Jl, iv);
    c(this, Bl, qE);
    c(this, "_fiberRefs");
    c(this, "_fiberId");
    c(this, "_queue", /* @__PURE__ */ new Array());
    c(this, "_children", null);
    c(this, "_observers", /* @__PURE__ */ new Array());
    c(this, "_running", !1);
    c(this, "_stack", []);
    c(this, "_asyncInterruptor", null);
    c(this, "_asyncBlockingOn", null);
    c(this, "_exitValue", null);
    c(this, "_steps", []);
    c(this, "_isYielding", !1);
    c(this, "currentRuntimeFlags");
    c(this, "currentOpCount", 0);
    c(this, "currentSupervisor");
    c(this, "currentScheduler");
    c(this, "currentTracer");
    c(this, "currentSpan");
    c(this, "currentContext");
    c(this, "currentDefaultServices");
    c(this, "run", () => {
      this.drainQueueOnCurrentThread();
    });
    if (this.currentRuntimeFlags = s, this._fiberId = n, this._fiberRefs = r, su(s)) {
      const o = this.getFiberRef(Ki);
      jE.unsafeUpdate(1, o), Du.unsafeUpdate(1, o);
    }
    this.refreshRefCache();
  }
  commit() {
    return gg(this);
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
    this.tell(un(n));
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
    return this.ask((n, r) => OO(r) ? n.currentRuntimeFlags : r.runtimeFlags);
  }
  /**
   * Returns the current `FiberScope` for the fiber.
   */
  scope() {
    return rv(this);
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
    return this.getFiberRef(is);
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
    return ie(() => {
      const r = k0(this._fiberId);
      return this.tell(vs((s, o) => {
        Fd(r, R(() => n(s, o)));
      })), Ad(r);
    });
  }
  /**
   * Adds a message to be processed by the fiber on the fiber.
   */
  tell(n) {
    this._queue.push(n), this._running || (this._running = !0, this.drainQueueLaterOnExecutor());
  }
  get await() {
    return $r((n) => {
      const r = (s) => n(Y(s));
      return this.tell(vs((s, o) => {
        s._exitValue !== null ? r(this._exitValue) : s.addObserver(r);
      })), R(() => this.tell(vs((s, o) => {
        s.removeObserver(r);
      })));
    }, this.id());
  }
  get inheritAll() {
    return Pe((n, r) => {
      const s = n.id(), o = n.getFiberRefs(), i = r.runtimeFlags, a = this.getFiberRefs(), u = Ak(o, s, a);
      n.setFiberRefs(u);
      const l = n.getFiberRef(Hu), h = g(
        ks(i, l),
        // Do not inherit WindDown or Interruption!
        iu(Gn),
        iu(xi)
      );
      return Bw(h);
    });
  }
  /**
   * Tentatively observes the fiber, but returns immediately if it is not
   * already done.
   */
  get poll() {
    return R(() => ho(this._exitValue));
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
    return R(() => this.tell(ai(Tt(n))));
  }
  /**
   * In the background, interrupts the fiber as if interrupted from the specified fiber.
   */
  unsafeInterruptAsFork(n) {
    this.tell(ai(Tt(n)));
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
    return this.setFiberRef(Hu, this.currentRuntimeFlags), this._fiberRefs;
  }
  /**
   * Deletes the specified fiber ref.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  unsafeDeleteFiberRef(n) {
    this._fiberRefs = Wd(this._fiberRefs, n);
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
    this._fiberRefs = Di(this._fiberRefs, {
      fiberId: this._fiberId,
      fiberRef: n,
      value: r
    }), this.refreshRefCache();
  }
  refreshRefCache() {
    this.currentDefaultServices = this.getFiberRef(Ws), this.currentTracer = this.currentDefaultServices.unsafeMap.get(Bd.key), this.currentSupervisor = this.getFiberRef(rT), this.currentScheduler = this.getFiberRef(hg), this.currentContext = this.getFiberRef(Yr), this.currentSpan = this.currentContext.unsafeMap.get(Jd.key);
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
      let r = cr;
      const s = globalThis[Ct];
      globalThis[Ct] = this;
      try {
        for (; r === cr; )
          r = this._queue.length === 0 ? DE : this.evaluateMessageWhileSuspended(this._queue.splice(0, 1)[0]);
      } finally {
        this._running = !1, globalThis[Ct] = s;
      }
      this._queue.length > 0 && !this._running ? (this._running = !0, r === qu ? (this.drainQueueLaterOnExecutor(), n = !1) : n = !0) : n = !1;
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
    this.currentScheduler.scheduleTask(this.run, this.getFiberRef(jo));
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
      s = BE[o._tag](this, n, s, o);
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
    return !fw(this.getFiberRef(is));
  }
  /**
   * Adds an interruptor to the set of interruptors that are interrupting this
   * fiber.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  addInterruptedCause(n) {
    const r = this.getFiberRef(is);
    this.setFiberRef(is, De(r, n));
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
      r.tell(ai(Tt(this.id()))), n = !0;
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
      return Qc({
        while: () => !r,
        body: () => {
          const o = n.next();
          return o.done ? R(() => {
            r = !0;
          }) : zr(o.value.await);
        },
        step: () => {
        }
      });
    }
    return null;
  }
  reportExitValue(n) {
    if (su(this.currentRuntimeFlags)) {
      const r = this.getFiberRef(Ki), s = this.id().startTimeMillis, o = Date.now();
      switch (UE.unsafeUpdate(o - s, r), Du.unsafeUpdate(-1, r), n._tag) {
        case Ye: {
          LE.unsafeUpdate(1, r);
          break;
        }
        case ze: {
          KE.unsafeUpdate(1, r);
          break;
        }
      }
    }
    if (n._tag === "Failure") {
      const r = this.getFiberRef(l0);
      !Vc(n.cause) && r._tag === "Some" && this.log("Fiber terminated with an unhandled error", n.cause, r);
    }
  }
  setExitValue(n) {
    this._exitValue = n, this.reportExitValue(n);
    for (let r = this._observers.length - 1; r >= 0; r--)
      this._observers[r](n);
    this._observers = [];
  }
  getLoggers() {
    return this.getFiberRef(YE);
  }
  log(n, r, s) {
    const o = _e(s) ? s.value : this.getFiberRef(o0), i = this.getFiberRef(WE);
    if (Gk(i, o))
      return;
    const a = this.getFiberRef(i0), u = this.getFiberRef(s0), l = this.getLoggers(), h = this.getFiberRefs();
    if (Ah(l) > 0) {
      const d = ah(this.getFiberRef(Ws), oa), p = new Date(d.unsafeCurrentTimeMillis());
      Um(h, () => {
        for (const m of l)
          m.log({
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
      case pa:
        return qu;
      case da:
        return this.processNewInterruptSignal(n.cause), this._asyncInterruptor !== null && (this._asyncInterruptor(G(n.cause)), this._asyncInterruptor = null), cr;
      case ma:
        return this._asyncInterruptor = null, this._asyncBlockingOn = null, this.evaluateEffect(n.effect), cr;
      case ga:
        return n.onFiber(this, this._exitValue !== null ? wO : kO(this.currentRuntimeFlags, this._asyncBlockingOn)), cr;
      default:
        return as(n);
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
      let r = Et(this.currentRuntimeFlags) && this.isInterrupted() ? G(this.getInterruptedCause()) : n;
      for (; r !== null; ) {
        const s = r, o = this.runLoop(s);
        if (o === gt) {
          const i = mt.currentOp;
          mt.currentOp = null, i._op === ys ? Db(this.currentRuntimeFlags) ? (this.tell(ZO()), this.tell(un(Lt)), r = null) : r = Lt : i._op === gr && (r = null);
        } else {
          this.currentRuntimeFlags = g(this.currentRuntimeFlags, qb(xi));
          const i = this.interruptAllChildren();
          i !== null ? r = I(i, () => o) : (this._queue.length === 0 ? this.setExitValue(o) : this.tell(un(o)), r = null);
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
      this.tell(un(n));
    else {
      this._running = !0;
      const r = globalThis[Ct];
      globalThis[Ct] = this;
      try {
        this.evaluateEffect(n);
      } finally {
        this._running = !1, globalThis[Ct] = r, this._queue.length > 0 && this.drainQueueLaterOnExecutor();
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
    this.tell(un(n));
  }
  /**
   * Takes the current runtime flags, patches them to return the new runtime
   * flags, and then makes any changes necessary to fiber state based on the
   * specified patch.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  patchRuntimeFlags(n, r) {
    const s = Os(n, r);
    return globalThis[Ct] = this, this.currentRuntimeFlags = s, s;
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
    const o = (i) => {
      s || (s = !0, this.tell(un(i)));
    };
    Et(n) && (this._asyncInterruptor = o);
    try {
      r(o);
    } catch (i) {
      o(Xe(at(i)));
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
      if (n._op !== Qo)
        return n;
      n = this.popStack();
    }
  }
  getNextFailCont() {
    let n = this.popStack();
    for (; n; ) {
      if (n._op !== Ns && n._op !== As && n._op !== ps)
        return n;
      n = this.popStack();
    }
  }
  [(Jl = ov, Bl = av, qm)](n) {
    return R(() => uh(this.currentContext, n));
  }
  Left(n) {
    return Re(n.left);
  }
  None(n) {
    return Re(new Nd());
  }
  Right(n) {
    return re(n.right);
  }
  Some(n) {
    return re(n.value);
  }
  Micro(n) {
    return Bs((r) => {
      let s = r;
      const o = QO(JO(n, this.currentContext));
      return o.addObserver((i) => {
        if (i._tag === "Success")
          return s(re(i.value));
        switch (i.cause._tag) {
          case "Interrupt":
            return s(G(Tt(xn)));
          case "Fail":
            return s(Re(i.cause.error));
          case "Die":
            return s(fu(i.cause.defect));
        }
      }), Bs((i) => {
        s = (a) => {
          i(Ze);
        }, o.unsafeInterrupt();
      });
    });
  }
  [rf](n) {
    const r = Te(() => n.effect_instruction_i0()), s = this.getNextSuccessCont();
    return s !== void 0 ? (s._op in ar || as(s), ar[s._op](this, s, r)) : (mt.currentOp = re(r), gt);
  }
  [Ye](n) {
    const r = n, s = this.getNextSuccessCont();
    return s !== void 0 ? (s._op in ar || as(s), ar[s._op](this, s, r.effect_instruction_i0)) : (mt.currentOp = r, gt);
  }
  [ze](n) {
    const r = n.effect_instruction_i0, s = this.getNextFailCont();
    if (s !== void 0)
      switch (s._op) {
        case Qo:
        case Ms:
          return Et(this.currentRuntimeFlags) && this.isInterrupted() ? G(cu(r)) : Te(() => s.effect_instruction_i1(r));
        case "OnStep":
          return Et(this.currentRuntimeFlags) && this.isInterrupted() ? G(cu(r)) : re(G(r));
        case yc:
          return this.patchRuntimeFlags(this.currentRuntimeFlags, s.patch), Et(this.currentRuntimeFlags) && this.isInterrupted() ? G(De(r, this.getInterruptedCause())) : G(r);
        default:
          as(s);
      }
    else
      return mt.currentOp = G(r), gt;
  }
  [sf](n) {
    return Te(() => n.effect_instruction_i0(this, tg(this.currentRuntimeFlags)));
  }
  Blocked(n) {
    const r = this.getFiberRefs(), s = this.currentRuntimeFlags;
    if (this._steps.length > 0) {
      const o = [], i = this._steps[this._steps.length - 1];
      let a = this.popStack();
      for (; a && a._op !== "OnStep"; )
        o.push(a), a = this.popStack();
      this.setFiberRefs(i.refs), this.currentRuntimeFlags = i.flags;
      const u = fO(i.refs, r), l = ks(i.flags, s);
      return re(fd(n.effect_instruction_i0, Pe((h) => {
        for (; o.length > 0; )
          h.pushStack(o.pop());
        return h.setFiberRefs(hO(h.id(), h.getFiberRefs())(u)), h.currentRuntimeFlags = Os(l)(h.currentRuntimeFlags), n.effect_instruction_i1;
      })));
    }
    return Co((o) => I(xg(Fw(n.effect_instruction_i0)), () => o(n.effect_instruction_i1)));
  }
  RunBlocked(n) {
    return JE(n.effect_instruction_i0);
  }
  [xr](n) {
    const r = n.effect_instruction_i0, s = this.currentRuntimeFlags, o = Os(s, r);
    if (Et(o) && this.isInterrupted())
      return G(this.getInterruptedCause());
    if (this.patchRuntimeFlags(this.currentRuntimeFlags, r), n.effect_instruction_i1) {
      const i = ks(o, s);
      return this.pushStack(new Cw(i, n)), Te(() => n.effect_instruction_i1(s));
    } else
      return Lt;
  }
  [Ns](n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  OnStep(n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  [Qo](n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  [Ms](n) {
    return this.pushStack(n), n.effect_instruction_i0;
  }
  [gr](n) {
    return this._asyncBlockingOn = n.effect_instruction_i1, this.initiateAsync(this.currentRuntimeFlags, n.effect_instruction_i0), mt.currentOp = n, gt;
  }
  [ys](n) {
    return this._isYielding = !1, mt.currentOp = n, gt;
  }
  [As](n) {
    const r = n.effect_instruction_i0, s = n.effect_instruction_i1;
    return r() ? (this.pushStack(n), s()) : Lt;
  }
  [ps](n) {
    return ar[ps](this, n, void 0);
  }
  [lo](n) {
    return Te(() => n.commit());
  }
  /**
   * The main run-loop for evaluating effects.
   *
   * **NOTE**: This method must be invoked by the fiber itself.
   */
  runLoop(n) {
    let r = n;
    for (this.currentOpCount = 0; ; ) {
      if ((this.currentRuntimeFlags & Ub) !== 0 && this.currentSupervisor.onEffect(this, r), this._queue.length > 0 && (r = this.drainQueueWhileRunning(this.currentRuntimeFlags, r)), !this._isYielding) {
        this.currentOpCount += 1;
        const s = this.currentScheduler.shouldYield(this);
        if (s !== !1) {
          this._isYielding = !0, this.currentOpCount = 0;
          const o = r;
          r = I(Xc({
            priority: s
          }), () => o);
        }
      }
      try {
        if (r = this.currentTracer.context(() => VE !== r[qn]._V ? hu(`Cannot execute an Effect versioned ${r[qn]._V} with a Runtime of version ${io()}`) : this[r._op](r), this), r === gt) {
          const s = mt.currentOp;
          return s._op === ys || s._op === gr ? gt : (mt.currentOp = null, s._op === Ye || s._op === ze ? s : G(at(s)));
        }
      } catch (s) {
        r !== gt && !M(r, "_op") || !(r._op in this) ? r = hu(`Not a valid effect: ${En(r)}`) : m0(s) ? r = G(De(at(s), Tt(xn))) : r = fu(s);
      }
    }
  }
}
const WE = /* @__PURE__ */ J("effect/FiberRef/currentMinimumLogLevel", () => xe(zk("Info"))), HE = (e) => _a((t) => {
  const n = xk(t.context, Ws);
  ah(n, qd).unsafe.log(e.log(t));
}), GE = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/Logger/defaultLogger"), () => HE(mv)), zE = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/Logger/tracerLogger"), () => _a(({
  annotations: e,
  cause: t,
  context: n,
  fiberId: r,
  logLevel: s,
  message: o
}) => {
  const i = qr(Rr(n, Yr), Jd);
  if (i._tag === "None" || i.value._tag === "ExternalSpan")
    return;
  const a = uh(Rr(n, Ws), oa), u = {};
  for (const [l, h] of e)
    u[l] = h;
  u["effect.fiberId"] = TS(r), u["effect.logLevel"] = s.label, t !== null && t._tag !== "Empty" && (u["effect.cause"] = Qn(t, {
    renderErrorCause: !0
  })), i.value.event(En(Array.isArray(o) ? o[0] : o), a.unsafeCurrentTimeNanos(), u);
})), YE = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/FiberRef/currentLoggers"), () => t0(Kc(GE, zE))), QE = /* @__PURE__ */ f((e) => Ql(e[0]), (e, t, n) => Pe((r) => {
  const s = (n == null ? void 0 : n.batching) === !0 || (n == null ? void 0 : n.batching) === "inherit" && r.getFiberRef(u0);
  return n != null && n.discard ? xu(n.concurrency, () => ln(Ji, n == null ? void 0 : n.concurrentFinalizers)((o) => s ? Jt(e, (i, a) => o(t(i, a)), !0, !1, 1) : Ao(e, (i, a) => o(t(i, a)))), () => ln(Vi, n == null ? void 0 : n.concurrentFinalizers)((o) => Jt(e, (i, a) => o(t(i, a)), s, !1)), (o) => ln(Wi(o), n == null ? void 0 : n.concurrentFinalizers)((i) => Jt(e, (a, u) => i(t(a, u)), s, !1, o))) : xu(n == null ? void 0 : n.concurrency, () => ln(Ji, n == null ? void 0 : n.concurrentFinalizers)((o) => s ? Bu(e, 1, (i, a) => o(t(i, a)), !0) : $t(e, (i, a) => o(t(i, a)))), () => ln(Vi, n == null ? void 0 : n.concurrentFinalizers)((o) => XE(e, (i, a) => o(t(i, a)), s)), (o) => ln(Wi(o), n == null ? void 0 : n.concurrentFinalizers)((i) => Bu(e, o, (a, u) => i(t(a, u)), s)));
})), XE = (e, t, n) => ie(() => {
  const r = X(e), s = new Array(r.length);
  return Po(Jt(r, (i, a) => I(t(i, a), (u) => R(() => s[a] = u)), n, !1), Y(s));
}), Jt = (e, t, n, r, s) => Co((o) => qw((i) => Pe((a) => {
  let u = Array.from(e).reverse(), l = u.length;
  if (l === 0)
    return Ze;
  let h = 0, d = !1;
  const p = s ? Math.min(u.length, s) : u.length, m = /* @__PURE__ */ new Set(), y = new Array(), O = () => m.forEach((F) => {
    F.currentScheduler.scheduleTask(() => {
      F.unsafeInterruptAsFork(a.id());
    }, 0);
  }), _ = new Array(), S = new Array(), U = new Array(), w = () => {
    const F = y.filter(({
      exit: V
    }) => V._tag === "Failure").sort((V, W) => V.index < W.index ? -1 : V.index === W.index ? 0 : 1).map(({
      exit: V
    }) => V);
    return F.length === 0 && F.push(Lt), F;
  }, $ = (F, V = !1) => {
    const W = wd(i(F)), K = eT(W, a, a.currentRuntimeFlags, ya);
    return a.currentScheduler.scheduleTask(() => {
      V && K.unsafeInterruptAsFork(a.id()), K.resume(W);
    }, 0), K;
  }, A = () => {
    r || (l -= u.length, u = []), d = !0, O();
  }, E = n ? Kw : md, j = $($r((F) => {
    const V = (K, z) => {
      K._op === "Blocked" ? U.push(K) : (y.push({
        index: z,
        exit: K
      }), K._op === "Failure" && !d && A());
    }, W = () => {
      if (u.length > 0) {
        const K = u.pop();
        let z = h++;
        const Ae = () => {
          const le = u.pop();
          return z = h++, I(Xc(), () => I(E(o(t(le, z))), $e));
        }, $e = (le) => u.length > 0 && (V(le, z), u.length > 0) ? Ae() : Y(le), ht = I(E(o(t(K, z))), $e), we = $(ht);
        _.push(we), m.add(we), d && we.currentScheduler.scheduleTask(() => {
          we.unsafeInterruptAsFork(a.id());
        }, 0), we.addObserver((le) => {
          let dt;
          if (le._op === "Failure" ? dt = le : dt = le.effect_instruction_i0, S.push(we), m.delete(we), V(dt, z), y.length === l)
            F(Y(me(yu(w(), {
              parallel: !0
            }), () => Lt)));
          else if (U.length + y.length === l) {
            const er = w(), dm = U.map((tr) => tr.effect_instruction_i0).reduce(td);
            F(Y(fd(dm, Jt([me(yu(er, {
              parallel: !0
            }), () => Lt), ...U.map((tr) => tr.effect_instruction_i1)], (tr) => tr, n, !0, s))));
          } else
            W();
        });
      }
    };
    for (let K = 0; K < p; K++)
      W();
  }));
  return zr(Yc(_d(o(gg(j))), Md({
    onFailure: (F) => {
      A();
      const V = U.length + 1, W = Math.min(typeof s == "number" ? s : U.length, U.length), K = Array.from(U);
      return $r((z) => {
        let Ae = 0, $e = 0;
        const ht = (le, dt) => (er) => {
          Ae++, Ae === V && z(re(G(F))), K.length > 0 && dt && we();
        }, we = () => {
          $(K.pop(), !0).addObserver(ht($e, !0)), $e++;
        };
        j.addObserver(ht($e, !1)), $e++;
        for (let le = 0; le < W; le++)
          we();
      });
    },
    onSuccess: () => $t(S, (F) => F.inheritAll)
  })));
}))), Bu = (e, t, n, r) => ie(() => {
  const s = X(e), o = new Array(s.length);
  return Po(Jt(s, (a, u) => Ne(n(a, u), (l) => o[u] = l), r, !1, t), Y(o));
}), xg = (e) => tT(e, ya), ZE = (e, t, n, r = null) => {
  const s = jg(e, t, n, r);
  return s.resume(e), s;
}, eT = (e, t, n, r = null) => jg(e, t, n, r), jg = (e, t, n, r = null) => {
  const s = Lh(), o = t.getFiberRefs(), i = Fk(o, s), a = new Pg(s, i, n), u = Rr(i, Yr), l = a.currentSupervisor;
  return l.onStart(u, e, N(t), a), a.addObserver((d) => l.onEnd(d, a)), (r !== null ? r : g(t.getFiberRef(Ui), me(() => t.scope()))).add(n, a), a;
}, tT = (e, t) => Pe((n, r) => Y(ZE(e, n, r.runtimeFlags, t))), Ju = (e) => Qr((t) => de(qr(t, ts), {
  onNone: () => e,
  onSome: (n) => {
    switch (n.strategy._tag) {
      case "Parallel":
        return e;
      case "Sequential":
      case "ParallelN":
        return I(Lo(n, Vi), (r) => wa(e, r));
    }
  }
})), Vu = (e) => (t) => Qr((n) => de(qr(n, ts), {
  onNone: () => t,
  onSome: (r) => r.strategy._tag === "ParallelN" && r.strategy.parallelism === e ? t : I(Lo(r, Wi(e)), (s) => wa(t, s))
})), ln = (e, t) => (n) => Qr((r) => de(qr(r, ts), {
  onNone: () => n(H),
  onSome: (s) => {
    if (t === !0) {
      const o = e._tag === "Parallel" ? Ju : e._tag === "Sequential" ? Wu : Vu(e.parallelism);
      switch (s.strategy._tag) {
        case "Parallel":
          return o(n(Ju));
        case "Sequential":
          return o(n(Wu));
        case "ParallelN":
          return o(n(Vu(s.strategy.parallelism)));
      }
    } else
      return n(H);
  }
})), Wu = (e) => Qr((t) => de(qr(t, ts), {
  onNone: () => e,
  onSome: (n) => {
    switch (n.strategy._tag) {
      case "Sequential":
        return e;
      case "Parallel":
      case "ParallelN":
        return I(Lo(n, Ji), (r) => wa(e, r));
    }
  }
})), ts = /* @__PURE__ */ rn("effect/Scope"), wa = /* @__PURE__ */ f(2, (e, t) => I0(
  e,
  // @ts-expect-error
  lh(u_(ts, t))
)), nT = (e) => Xn(e, {
  differ: xE,
  fork: yr
}), Hu = /* @__PURE__ */ r0(Bb), rT = /* @__PURE__ */ nT(Bo), sT = (e, t, n) => yd((r) => I(I(xg(Sd(e)), (s) => $r((o) => {
  const i = t.map((l) => l.listeners.count), a = () => {
    i.every((l) => l === 0) && t.every((l) => l.result.state.current._tag === "Pending" ? !0 : !!(l.result.state.current._tag === "Done" && na(l.result.state.current.effect) && l.result.state.current.effect._tag === "Failure" && hw(l.result.state.current.effect.cause))) && (u.forEach((l) => l()), n == null || n(), o(Jw(s)));
  };
  s.addObserver((l) => {
    u.forEach((h) => h()), o(l);
  });
  const u = t.map((l, h) => {
    const d = (p) => {
      i[h] = p, a();
    };
    return l.listeners.addObserver(d), () => l.listeners.removeObserver(d);
  });
  return a(), R(() => {
    u.forEach((l) => l());
  });
})), () => ie(() => {
  const s = t.flatMap((o) => o.state.completed ? [] : [o]);
  return Ao(s, (o) => $E(o.request, S0(r)));
}))), oT = lw, iT = Qn, cT = h0, aT = Lo, uT = BS, Lg = (e) => (t) => {
  const n = t === void 0 ? Object.create(Lr) : uT(t);
  return n._tag = e, n;
}, lT = () => new Proxy({}, {
  get(e, t, n) {
    return t === "$is" ? hc : t === "$match" ? fT : Lg(t);
  }
});
function fT() {
  if (arguments.length === 1) {
    const n = arguments[0];
    return function(r) {
      return n[r._tag](r);
    };
  }
  const e = arguments[0];
  return arguments[1][e._tag](e);
}
const hT = /* @__PURE__ */ function() {
  const e = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  return class extends ta {
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
}(), dT = (e) => {
  class t extends hT {
    constructor() {
      super(...arguments);
      c(this, "_tag", e);
    }
  }
  return t.prototype.name = e, t;
}, ka = (e) => function() {
  if (arguments.length === 1) {
    const t = arguments[0];
    return (n, ...r) => e(t, n, ...r);
  }
  return e.apply(this, arguments);
}, Kg = /* @__PURE__ */ ka((e, t, n) => {
  const r = Lh(), s = [[Yr, [[r, e.context]]]];
  n != null && n.scheduler && s.push([hg, [[r, n.scheduler]]]);
  let o = jk(e.fiberRefs, {
    entries: s,
    forkAs: r
  });
  n != null && n.updateRefs && (o = n.updateRefs(o, r));
  const i = new Pg(r, o, e.runtimeFlags);
  let a = t;
  n != null && n.scope && (a = I(aT(n.scope, eg), (l) => Po(f0(l, yd((h) => x(h, i.id()) ? Ze : vd(i, h))), Yc(t, (h) => cT(l, h)))));
  const u = i.currentSupervisor;
  return u !== Bo && (u.onStart(e.context, a, k(), i), i.addObserver((l) => u.onEnd(l, i))), ya.add(e.runtimeFlags, i), (n == null ? void 0 : n.immediate) === !1 ? i.resume(a) : i.start(a), i;
}), gT = /* @__PURE__ */ ka((e, t) => {
  const n = bT(e)(t);
  if (n._tag === "Failure")
    throw _T(n.effect_instruction_i0);
  return n.effect_instruction_i0;
});
class mT extends Error {
  constructor(n) {
    super(`Fiber #${n.id().id} cannot be resolved synchronously. This is caused by using runSync on an effect that performs async work`);
    c(this, "fiber");
    c(this, "_tag", "AsyncFiberException");
    this.fiber = n, this.name = this._tag, this.stack = this.message;
  }
}
const pT = (e) => {
  const t = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const n = new mT(e);
  return Error.stackTraceLimit = t, n;
}, ui = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure"), us = /* @__PURE__ */ Symbol.for("effect/Runtime/FiberFailure/Cause");
var Vl, Wl;
class yT extends Error {
  constructor(n) {
    const r = ud(n)[0];
    super((r == null ? void 0 : r.message) || "An error has occurred");
    c(this, Wl);
    c(this, Vl);
    this[ui] = ui, this[us] = n, this.name = r ? `(FiberFailure) ${r.name}` : "FiberFailure", r != null && r.stack && (this.stack = r.stack);
  }
  toJSON() {
    return {
      _id: "FiberFailure",
      cause: this[us].toJSON()
    };
  }
  toString() {
    return "(FiberFailure) " + Qn(this[us], {
      renderErrorCause: !0
    });
  }
  [(Wl = ui, Vl = us, Q)]() {
    return this.toString();
  }
}
const _T = (e) => {
  const t = Error.stackTraceLimit;
  Error.stackTraceLimit = 0;
  const n = new yT(e);
  return Error.stackTraceLimit = t, n;
}, ST = (e) => {
  const t = e;
  switch (t._op) {
    case "Failure":
    case "Success":
      return t;
    case "Left":
      return _u(t.left);
    case "Right":
      return re(t.right);
    case "Some":
      return re(t.value);
    case "None":
      return _u(Nd());
  }
}, bT = /* @__PURE__ */ ka((e, t) => {
  const n = ST(t);
  if (n)
    return n;
  const r = new fg(), s = Kg(e)(t, {
    scheduler: r
  });
  r.flush();
  const o = s.unsafePoll();
  return o || _0(Hc(pT(s), ra(s)));
});
class wT {
  constructor(t, n, r) {
    c(this, "context");
    c(this, "runtimeFlags");
    c(this, "fiberRefs");
    this.context = t, this.runtimeFlags = n, this.fiberRefs = r;
  }
  pipe() {
    return v(this, arguments);
  }
}
const kT = (e) => new wT(e.context, e.runtimeFlags, e.fiberRefs), OT = /* @__PURE__ */ Zh(Gn, Qh, Yh), Ug = /* @__PURE__ */ kT({
  context: /* @__PURE__ */ Nc(),
  runtimeFlags: OT,
  fiberRefs: /* @__PURE__ */ Lk()
}), vT = /* @__PURE__ */ Kg(Ug), ET = /* @__PURE__ */ gT(Ug), TT = Mo, Ts = QE, ls = ie, je = Ze, IT = Li, sc = Ne, $T = zc, RT = Fo, fn = Js, tt = I, NT = vT, MT = ET, AT = /* @__PURE__ */ Symbol.for("@effect/matcher/Matcher"), FT = {
  [AT]: {
    _input: H,
    _filters: H,
    _result: H,
    _return: H
  },
  _tag: "ValueMatcher",
  add(e) {
    return this.value._tag === "Right" ? this : e._tag === "When" && e.guard(this.provided) === !0 ? oc(this.provided, C(e.evaluate(this.provided))) : e._tag === "Not" && e.guard(this.provided) === !1 ? oc(this.provided, C(e.evaluate(this.provided))) : this;
  },
  pipe() {
    return v(this, arguments);
  }
};
function oc(e, t) {
  const n = Object.create(FT);
  return n.provided = e, n.value = t, n;
}
const CT = (e, t) => ({
  _tag: "When",
  guard: e,
  evaluate: t
}), ic = (e) => {
  if (typeof e == "function")
    return e;
  if (Array.isArray(e)) {
    const t = e.map(ic), n = t.length;
    return (r) => {
      if (!Array.isArray(r))
        return !1;
      for (let s = 0; s < n; s++)
        if (t[s](r[s]) === !1)
          return !1;
      return !0;
    };
  } else if (e !== null && typeof e == "object") {
    const t = Object.entries(e).map(([r, s]) => [r, ic(s)]), n = t.length;
    return (r) => {
      if (typeof r != "object" || r === null)
        return !1;
      for (let s = 0; s < n; s++) {
        const [o, i] = t[s];
        if (!(o in r) || i(r[o]) === !1)
          return !1;
      }
      return !0;
    };
  }
  return (t) => t === e;
}, PT = (e) => oc(e, T(e)), xT = (e, t) => (n) => n.add(CT(ic(e), t)), jT = (e) => e != null, LT = (e) => (t) => {
  const n = KT(t);
  return df(n) ? n._tag === "Right" ? n.right : e(n.left) : (r) => {
    const s = n(r);
    return s._tag === "Right" ? s.right : e(s.left);
  };
}, KT = (e) => {
  if (e._tag === "ValueMatcher")
    return e.value;
  const t = e.cases.length;
  if (t === 1) {
    const n = e.cases[0];
    return (r) => n._tag === "When" && n.guard(r) === !0 || n._tag === "Not" && n.guard(r) === !1 ? C(n.evaluate(r)) : T(r);
  }
  return (n) => {
    for (let r = 0; r < t; r++) {
      const s = e.cases[r];
      if (s._tag === "When" && s.guard(n) === !0)
        return C(s.evaluate(n));
      if (s._tag === "Not" && s.guard(n) === !1)
        return C(s.evaluate(n));
    }
    return T(n);
  };
}, UT = PT, Ot = xT, fs = jT, DT = LT;
class ke {
  constructor(t, n, r) {
    c(this, "path");
    c(this, "actual");
    c(this, "issue");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Pointer");
    this.path = t, this.actual = n, this.issue = r;
  }
}
class Gu {
  constructor(t, n) {
    c(this, "actual");
    c(this, "message");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Unexpected");
    this.actual = t, this.message = n;
  }
}
class ur {
  constructor(t, n) {
    c(this, "ast");
    c(this, "message");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Missing");
    /**
     * @since 3.10.0
     */
    c(this, "actual");
    this.ast = t, this.message = n;
  }
}
class ee {
  constructor(t, n, r, s) {
    c(this, "ast");
    c(this, "actual");
    c(this, "issues");
    c(this, "output");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Composite");
    this.ast = t, this.actual = n, this.issues = r, this.output = s;
  }
}
class li {
  constructor(t, n, r, s) {
    c(this, "ast");
    c(this, "actual");
    c(this, "kind");
    c(this, "issue");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Refinement");
    this.ast = t, this.actual = n, this.kind = r, this.issue = s;
  }
}
class fi {
  constructor(t, n, r, s) {
    c(this, "ast");
    c(this, "actual");
    c(this, "kind");
    c(this, "issue");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Transformation");
    this.ast = t, this.actual = n, this.kind = r, this.issue = s;
  }
}
class It {
  constructor(t, n, r) {
    c(this, "ast");
    c(this, "actual");
    c(this, "message");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Type");
    this.ast = t, this.actual = n, this.message = r;
  }
}
class zu {
  constructor(t, n, r) {
    c(this, "ast");
    c(this, "actual");
    c(this, "message");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "Forbidden");
    this.ast = t, this.actual = n, this.message = r;
  }
}
const Yu = /* @__PURE__ */ Symbol.for("effect/Schema/ParseErrorTypeId");
var Hl;
class qT extends (/* @__PURE__ */ dT("ParseError")) {
  constructor() {
    super(...arguments);
    /**
     * @since 3.10.0
     */
    c(this, Hl, Yu);
  }
  get message() {
    return this.toString();
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return Is.formatIssueSync(this.issue);
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
  [(Hl = Yu, Q)]() {
    return this.toJSON();
  }
}
const BT = (e) => new qT({
  issue: e
}), to = C, Dg = T, Ee = df, Rt = /* @__PURE__ */ f(2, (e, t) => Ee(e) ? wc(e, {
  onLeft: T,
  onRight: t
}) : tt(e, t)), nt = /* @__PURE__ */ f(2, (e, t) => Ee(e) ? cp(e, t) : sc(e, t)), hi = /* @__PURE__ */ f(2, (e, t) => Ee(e) ? ip(e, t) : RT(e, t)), JT = /* @__PURE__ */ f(2, (e, t) => Ee(e) ? op(e, {
  onLeft: t.onFailure,
  onRight: t.onSuccess
}) : $T(e, t)), qg = /* @__PURE__ */ f(2, (e, t) => Ee(e) ? wc(e, {
  onLeft: t,
  onRight: C
}) : IT(e, t)), Jo = (e, t) => t === void 0 || Vt(t) ? e : e === void 0 ? t : {
  ...e,
  ...t
}, Bg = (e, t, n) => {
  const r = fe(e, t);
  return (s, o) => r(s, Jo(n, o));
}, Jg = (e, t, n) => {
  const r = Bg(e, t, n);
  return (s, o) => gf(r(s, o), BT);
}, VT = (e, t, n) => {
  const r = Bg(e, t, n);
  return (s, o) => dp(r(s, o));
}, Vg = (e, t, n) => {
  const r = fe(e, t);
  return (s, o) => r(s, {
    ...Jo(n, o),
    isEffectAllowed: !0
  });
}, WT = (e, t) => Jg(e.ast, !0, t), HT = (e, t) => VT(e.ast, !0, t), GT = (e, t) => Vg(e.ast, !0, t), zT = (e, t) => Vg(e.ast, !1, t), YT = WT, QT = HT, XT = (e, t) => Jg(oe(e.ast), !0, t), ZT = (e, t) => {
  const n = fe(oe(e.ast), !0);
  return (r, s) => it(n(r, {
    exact: !0,
    ...Jo(t, s)
  }));
}, eI = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/ParseResult/decodeMemoMap"), () => /* @__PURE__ */ new WeakMap()), tI = /* @__PURE__ */ J(/* @__PURE__ */ Symbol.for("effect/ParseResult/encodeMemoMap"), () => /* @__PURE__ */ new WeakMap()), fe = (e, t) => {
  const n = t ? eI : tI, r = n.get(e);
  if (r)
    return r;
  const s = nI(e, t), o = cy(e), i = _e(o) ? (l, h) => s(l, Jo(h, o.value)) : s, a = ay(e), u = t && _e(a) ? (l, h) => hr(qg(i(l, h), a.value), e, l, h) : i;
  return n.set(e, u), u;
}, di = (e) => rt(sy(e)), gi = (e) => rt(oy(e)), nI = (e, t) => {
  switch (e._tag) {
    case "Refinement":
      if (t) {
        const n = fe(e.from, !0);
        return (r, s) => {
          s = s ?? Zo;
          const o = (s == null ? void 0 : s.errors) === "all", i = Rt(qg(n(r, s), (a) => {
            const u = new li(e, r, "From", a);
            return o && ly(e) && zg(a) ? de(e.filter(r, s, e), {
              onNone: () => T(u),
              onSome: (l) => T(new ee(e, r, [u, new li(e, r, "Predicate", l)]))
            }) : T(u);
          }), (a) => de(e.filter(a, s, e), {
            onNone: () => C(a),
            onSome: (u) => T(new li(e, r, "Predicate", u))
          }));
          return hr(i, e, r, s);
        };
      } else {
        const n = fe(oe(e), !0), r = fe(Wg(e.from), !1);
        return (s, o) => hr(Rt(n(s, o), (i) => r(i, o)), e, s, o);
      }
    case "Transformation": {
      const n = oI(e.transformation, t), r = t ? fe(e.from, !0) : fe(e.to, !1), s = t ? fe(e.to, !0) : fe(e.from, !1);
      return (o, i) => hr(Rt(hi(r(o, i), (a) => new fi(e, o, t ? "Encoded" : "Type", a)), (a) => Rt(hi(n(a, i ?? Zo, e, o), (u) => new fi(e, o, "Transformation", u)), (u) => hi(s(u, i), (l) => new fi(e, o, t ? "Type" : "Encoded", l)))), e, o, i);
    }
    case "Declaration": {
      const n = t ? e.decodeUnknown(...e.typeParameters) : e.encodeUnknown(...e.typeParameters);
      return (r, s) => hr(n(r, s ?? Zo, e), e, r, s);
    }
    case "Literal":
      return Fe(e, (n) => n === e.literal);
    case "UniqueSymbol":
      return Fe(e, (n) => n === e.symbol);
    case "UndefinedKeyword":
      return Fe(e, wm);
    case "NeverKeyword":
      return Fe(e, Om);
    case "UnknownKeyword":
    case "AnyKeyword":
    case "VoidKeyword":
      return C;
    case "StringKeyword":
      return Fe(e, ut);
    case "NumberKeyword":
      return Fe(e, Vt);
    case "BooleanKeyword":
      return Fe(e, lc);
    case "BigIntKeyword":
      return Fe(e, co);
    case "SymbolKeyword":
      return Fe(e, _i);
    case "ObjectKeyword":
      return Fe(e, Ft);
    case "Enums":
      return Fe(e, (n) => e.enums.some(([r, s]) => s === n));
    case "TemplateLiteral": {
      const n = By(e);
      return Fe(e, (r) => ut(r) && n.test(r));
    }
    case "TupleType": {
      const n = e.elements.map((l) => fe(l.type, t)), r = e.rest.map((l) => fe(l.type, t));
      let s = e.elements.filter((l) => !l.isOptional);
      e.rest.length > 0 && (s = s.concat(e.rest.slice(1)));
      const o = s.length, i = e.elements.length > 0 ? e.elements.map((l, h) => h).join(" | ") : "never", a = di(e), u = gi(e);
      return (l, h) => {
        if (!Be(l))
          return T(new It(e, l));
        const d = (h == null ? void 0 : h.errors) === "all", p = [];
        let m = 0;
        const y = [], O = l.length;
        for (let w = O; w <= o - 1; w++) {
          const $ = new ke(w, l, new ur(s[w - O]));
          if (d) {
            p.push([m++, $]);
            continue;
          } else
            return T(new ee(e, l, $, y));
        }
        if (e.rest.length === 0)
          for (let w = e.elements.length; w <= O - 1; w++) {
            const $ = new ke(w, l, new Gu(l[w], `is unexpected, expected: ${i}`));
            if (d) {
              p.push([m++, $]);
              continue;
            } else
              return T(new ee(e, l, $, y));
          }
        let _ = 0, S;
        for (; _ < n.length; _++)
          if (O < _ + 1) {
            if (e.elements[_].isOptional)
              continue;
          } else {
            const w = n[_], $ = w(l[_], h);
            if (Ee($)) {
              if (he($)) {
                const A = new ke(_, l, $.left);
                if (d) {
                  p.push([m++, A]);
                  continue;
                } else
                  return T(new ee(e, l, A, qe(y)));
              }
              y.push([m++, $.right]);
            } else {
              const A = m++, E = _;
              S || (S = []), S.push(({
                es: j,
                output: F
              }) => tt(fn($), (V) => {
                if (he(V)) {
                  const W = new ke(E, l, V.left);
                  return d ? (j.push([A, W]), je) : T(new ee(e, l, W, qe(F)));
                }
                return F.push([A, V.right]), je;
              }));
            }
          }
        if (pe(r)) {
          const [w, ...$] = r;
          for (; _ < O - $.length; _++) {
            const A = w(l[_], h);
            if (Ee(A))
              if (he(A)) {
                const E = new ke(_, l, A.left);
                if (d) {
                  p.push([m++, E]);
                  continue;
                } else
                  return T(new ee(e, l, E, qe(y)));
              } else
                y.push([m++, A.right]);
            else {
              const E = m++, j = _;
              S || (S = []), S.push(({
                es: F,
                output: V
              }) => tt(fn(A), (W) => {
                if (he(W)) {
                  const K = new ke(j, l, W.left);
                  return d ? (F.push([E, K]), je) : T(new ee(e, l, K, qe(V)));
                } else
                  return V.push([E, W.right]), je;
              }));
            }
          }
          for (let A = 0; A < $.length; A++)
            if (_ += A, !(O < _ + 1)) {
              const E = $[A](l[_], h);
              if (Ee(E)) {
                if (he(E)) {
                  const j = new ke(_, l, E.left);
                  if (d) {
                    p.push([m++, j]);
                    continue;
                  } else
                    return T(new ee(e, l, j, qe(y)));
                }
                y.push([m++, E.right]);
              } else {
                const j = m++, F = _;
                S || (S = []), S.push(({
                  es: V,
                  output: W
                }) => tt(fn(E), (K) => {
                  if (he(K)) {
                    const z = new ke(F, l, K.left);
                    return d ? (V.push([j, z]), je) : T(new ee(e, l, z, qe(W)));
                  }
                  return W.push([j, K.right]), je;
                }));
              }
            }
        }
        const U = ({
          es: w,
          output: $
        }) => _s(w) ? T(new ee(e, l, qe(w), qe($))) : C(qe($));
        if (S && S.length > 0) {
          const w = S;
          return ls(() => {
            const $ = {
              es: lr(p),
              output: lr(y)
            };
            return tt(Ts(w, (A) => A($), {
              concurrency: a,
              batching: u,
              discard: !0
            }), () => U($));
          });
        }
        return U({
          output: y,
          es: p
        });
      };
    }
    case "TypeLiteral": {
      if (e.propertySignatures.length === 0 && e.indexSignatures.length === 0)
        return Fe(e, vm);
      const n = [], r = {}, s = [];
      for (const h of e.propertySignatures)
        n.push([fe(h.type, t), h]), r[h.name] = null, s.push(h.name);
      const o = e.indexSignatures.map((h) => [fe(h.parameter, t), fe(h.type, t), h.parameter]), i = st.make(e.indexSignatures.map((h) => h.parameter).concat(s.map((h) => _i(h) ? new gy(h) : new Ps(h)))), a = fe(i, t), u = di(e), l = gi(e);
      return (h, d) => {
        if (!Tm(h))
          return T(new It(e, h));
        const p = (d == null ? void 0 : d.errors) === "all", m = [];
        let y = 0;
        const O = (d == null ? void 0 : d.onExcessProperty) === "error", _ = (d == null ? void 0 : d.onExcessProperty) === "preserve", S = {};
        let U;
        if (O || _) {
          U = wn(h);
          for (const E of U) {
            const j = a(E, d);
            if (Ee(j) && he(j))
              if (O) {
                const F = new ke(E, h, new Gu(h[E], `is unexpected, expected: ${String(i)}`));
                if (p) {
                  m.push([y++, F]);
                  continue;
                } else
                  return T(new ee(e, h, F, S));
              } else
                S[E] = h[E];
          }
        }
        let w;
        const $ = (d == null ? void 0 : d.exact) === !0;
        for (let E = 0; E < n.length; E++) {
          const j = n[E][1], F = j.name, V = Object.prototype.hasOwnProperty.call(h, F);
          if (!V) {
            if (j.isOptional)
              continue;
            if ($) {
              const z = new ke(F, h, new ur(j));
              if (p) {
                m.push([y++, z]);
                continue;
              } else
                return T(new ee(e, h, z, S));
            }
          }
          const W = n[E][0], K = W(h[F], d);
          if (Ee(K)) {
            if (he(K)) {
              const z = new ke(F, h, V ? K.left : new ur(j));
              if (p) {
                m.push([y++, z]);
                continue;
              } else
                return T(new ee(e, h, z, S));
            }
            S[F] = K.right;
          } else {
            const z = y++, Ae = F;
            w || (w = []), w.push(({
              es: $e,
              output: ht
            }) => tt(fn(K), (we) => {
              if (he(we)) {
                const le = new ke(Ae, h, V ? we.left : new ur(j));
                return p ? ($e.push([z, le]), je) : T(new ee(e, h, le, ht));
              }
              return ht[Ae] = we.right, je;
            }));
          }
        }
        for (let E = 0; E < o.length; E++) {
          const j = o[E], F = j[0], V = j[1], W = Ef(h, j[2]);
          for (const K of W) {
            const z = F(K, d);
            if (Ee(z) && it(z)) {
              const Ae = V(h[K], d);
              if (Ee(Ae))
                if (he(Ae)) {
                  const $e = new ke(K, h, Ae.left);
                  if (p) {
                    m.push([y++, $e]);
                    continue;
                  } else
                    return T(new ee(e, h, $e, S));
                } else
                  Object.prototype.hasOwnProperty.call(r, K) || (S[K] = Ae.right);
              else {
                const $e = y++, ht = K;
                w || (w = []), w.push(({
                  es: we,
                  output: le
                }) => tt(fn(Ae), (dt) => {
                  if (he(dt)) {
                    const er = new ke(ht, h, dt.left);
                    return p ? (we.push([$e, er]), je) : T(new ee(e, h, er, le));
                  } else
                    return Object.prototype.hasOwnProperty.call(r, K) || (le[K] = dt.right), je;
                }));
              }
            }
          }
        }
        const A = ({
          es: E,
          output: j
        }) => {
          if (_s(E))
            return T(new ee(e, h, qe(E), j));
          if ((d == null ? void 0 : d.propertyOrder) === "original") {
            const F = U || wn(h);
            for (const W of s)
              F.indexOf(W) === -1 && F.push(W);
            const V = {};
            for (const W of F)
              Object.prototype.hasOwnProperty.call(j, W) && (V[W] = j[W]);
            return C(V);
          }
          return C(j);
        };
        if (w && w.length > 0) {
          const E = w;
          return ls(() => {
            const j = {
              es: lr(m),
              output: Object.assign({}, S)
            };
            return tt(Ts(E, (F) => F(j), {
              concurrency: u,
              batching: l,
              discard: !0
            }), () => A(j));
          });
        }
        return A({
          es: m,
          output: S
        });
      };
    }
    case "Union": {
      const n = rI(e.types, t), r = wn(n.keys), s = r.length, o = e.types.length, i = /* @__PURE__ */ new Map();
      for (let l = 0; l < o; l++)
        i.set(e.types[l], fe(e.types[l], t));
      const a = di(e) ?? 1, u = gi(e);
      return (l, h) => {
        const d = [];
        let p = 0, m = [];
        if (s > 0)
          if (fc(l))
            for (let _ = 0; _ < s; _++) {
              const S = r[_], U = n.keys[S].buckets;
              if (Object.prototype.hasOwnProperty.call(l, S)) {
                const w = String(l[S]);
                if (Object.prototype.hasOwnProperty.call(U, w))
                  m = m.concat(U[w]);
                else {
                  const {
                    candidates: $,
                    literals: A
                  } = n.keys[S], E = st.make(A), j = $.length === o ? new Dt([new Oe(S, E, !1, !0)], []) : st.make($);
                  d.push([p++, new ee(j, l, new ke(S, l, new It(E, l[S])))]);
                }
              } else {
                const {
                  candidates: w,
                  literals: $
                } = n.keys[S], A = new Oe(S, st.make($), !1, !0), E = w.length === o ? new Dt([A], []) : st.make(w);
                d.push([p++, new ee(E, l, new ke(S, l, new ur(A)))]);
              }
            }
          else {
            const _ = n.candidates.length === o ? e : st.make(n.candidates);
            d.push([p++, new It(_, l)]);
          }
        n.otherwise.length > 0 && (m = m.concat(n.otherwise));
        let y;
        for (let _ = 0; _ < m.length; _++) {
          const S = m[_], U = i.get(S)(l, h);
          if (Ee(U) && (!y || y.length === 0)) {
            if (it(U))
              return U;
            d.push([p++, U.left]);
          } else {
            const w = p++;
            y || (y = []), y.push(($) => ls(() => "finalResult" in $ ? je : tt(fn(U), (A) => (it(A) ? $.finalResult = A : $.es.push([w, A.left]), je))));
          }
        }
        const O = (_) => _s(_) ? _.length === 1 && _[0][1]._tag === "Type" ? T(_[0][1]) : T(new ee(e, l, qe(_))) : (
          // this should never happen
          T(new It(e, l))
        );
        if (y && y.length > 0) {
          const _ = y;
          return ls(() => {
            const S = {
              es: lr(d)
            };
            return tt(Ts(_, (U) => U(S), {
              concurrency: a,
              batching: u,
              discard: !0
            }), () => "finalResult" in S ? S.finalResult : O(S.es));
          });
        }
        return O(d);
      };
    }
    case "Suspend": {
      const n = Tf(() => fe(Rn(e.f(), e.annotations), t));
      return (r, s) => n()(r, s);
    }
  }
}, Fe = (e, t) => (n) => t(n) ? C(n) : T(new It(e, n)), fr = (e, t) => {
  switch (e._tag) {
    case "Declaration": {
      const n = Vf(e);
      if (_e(n))
        return fr(n.value, t);
      break;
    }
    case "TypeLiteral": {
      const n = [];
      for (let r = 0; r < e.propertySignatures.length; r++) {
        const s = e.propertySignatures[r], o = t ? Ha(s.type) : oe(s.type);
        Ja(o) && !s.isOptional && n.push([s.name, o]);
      }
      return n;
    }
    case "TupleType": {
      const n = [];
      for (let r = 0; r < e.elements.length; r++) {
        const s = e.elements[r], o = t ? Ha(s.type) : oe(s.type);
        Ja(o) && !s.isOptional && n.push([r, o]);
      }
      return n;
    }
    case "Refinement":
      return fr(e.from, t);
    case "Suspend":
      return fr(e.f(), t);
    case "Transformation":
      return fr(t ? e.from : e.to, t);
  }
  return [];
}, rI = (e, t) => {
  const n = {}, r = [], s = [];
  for (let o = 0; o < e.length; o++) {
    const i = e[o], a = fr(i, t);
    if (a.length > 0) {
      s.push(i);
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
          p[d].push(i), n[l].literals.push(h), n[l].candidates.push(i);
        } else {
          p[d] = [i], n[l].literals.push(h), n[l].candidates.push(i);
          break;
        }
      }
    } else
      r.push(i);
  }
  return {
    keys: n,
    otherwise: r,
    candidates: s
  };
}, Wg = (e) => $c(e) ? Wg(e.from) : e, hr = (e, t, n, r) => {
  if ((r == null ? void 0 : r.isEffectAllowed) === !0 || Ee(e))
    return e;
  const s = new fg(), o = NT(e, {
    scheduler: s
  });
  s.flush();
  const i = o.unsafePoll();
  if (i) {
    if ($0(i))
      return C(i.value);
    const a = i.cause;
    return oT(a) ? T(a.error) : T(new zu(t, n, iT(a)));
  }
  return T(new zu(t, n, "cannot be be resolved synchronously, this is caused by using runSync on an effect that performs async work"));
}, sI = ([e], [t]) => e > t ? 1 : e < t ? -1 : 0;
function qe(e) {
  return e.sort(sI).map((t) => t[1]);
}
const oI = (e, t) => {
  switch (e._tag) {
    case "FinalTransformation":
      return t ? e.decode : e.encode;
    case "ComposeTransformation":
      return C;
    case "TypeLiteralTransformation":
      return (n) => {
        let r = C(n);
        for (const s of e.propertySignatureTransformations) {
          const [o, i] = t ? [s.from, s.to] : [s.to, s.from], a = t ? s.decode : s.encode;
          r = nt(r, (l) => {
            const h = a(Object.prototype.hasOwnProperty.call(l, o) ? N(l[o]) : k());
            return delete l[o], _e(h) && (l[i] = h.value), l;
          });
        }
        return r;
      };
  }
}, ve = (e, t = []) => ({
  value: e,
  forest: t
}), Is = {
  formatIssue: (e) => nt(mn(e), iI),
  formatIssueSync: (e) => {
    const t = Is.formatIssue(e);
    return Ee(t) ? up(t) : MT(t);
  },
  formatError: (e) => Is.formatIssue(e.issue),
  formatErrorSync: (e) => Is.formatIssueSync(e.issue)
}, iI = (e) => e.value + Hg(`
`, e.forest), Hg = (e, t) => {
  let n = "";
  const r = t.length;
  let s;
  for (let o = 0; o < r; o++) {
    s = t[o];
    const i = o === r - 1;
    n += e + (i ? "└" : "├") + "─ " + s.value, n += Hg(e + (r > 1 && !i ? "│  " : "   "), s.forest);
  }
  return n;
}, cI = (e) => {
  switch (e) {
    case "Encoded":
      return "Encoded side transformation failure";
    case "Transformation":
      return "Transformation process failure";
    case "Type":
      return "Type side transformation failure";
  }
}, aI = (e) => {
  switch (e) {
    case "From":
      return "From side refinement failure";
    case "Predicate":
      return "Predicate refinement failure";
  }
}, Gg = (e) => "ast" in e ? N(e.ast) : k(), cc = /* @__PURE__ */ C(void 0), uI = (e) => Gg(e).pipe(Vn(ny), de({
  onNone: () => cc,
  onSome: (t) => {
    const n = t(e);
    return ut(n) ? C({
      message: n,
      override: !1
    }) : TT(n) ? sc(n, (r) => ({
      message: r,
      override: !1
    })) : ut(n.message) ? C({
      message: n.message,
      override: n.override
    }) : sc(n.message, (r) => ({
      message: r,
      override: n.override
    }));
  }
})), Oa = (e) => (t) => t._tag === e, zg = /* @__PURE__ */ Oa("Composite"), Qu = /* @__PURE__ */ Oa("Refinement"), Xu = /* @__PURE__ */ Oa("Transformation"), _r = (e) => Rt(uI(e), (t) => t !== void 0 ? !t.override && (zg(e) || Qu(e) && e.kind === "From" || Xu(e) && e.kind !== "Transformation") ? Xu(e) || Qu(e) ? _r(e.issue) : cc : C(t.message) : cc), Yg = (e) => Gg(e).pipe(Vn(iy), pp((t) => t(e)), rt);
function lI(e) {
  return Jf(e).pipe(yt(() => qf(e)), yt(() => Bf(e)), yt(() => mo(e)), me(() => `{ ${e.from} | filter }`));
}
function fI(e) {
  return e.message !== void 0 ? e.message : `Expected ${$c(e.ast) ? lI(e.ast) : String(e.ast)}, actual ${ct(e.actual)}`;
}
const hI = (e) => nt(_r(e), (t) => t ?? Yg(e) ?? fI(e)), hs = (e) => Yg(e) ?? String(e.ast), dI = (e) => e.message ?? "is forbidden", gI = (e) => e.message ?? "is unexpected", mI = (e) => {
  const t = ry(e.ast);
  if (_e(t)) {
    const n = t.value();
    return ut(n) ? C(n) : n;
  }
  return C(e.message ?? "is missing");
}, mn = (e) => {
  switch (e._tag) {
    case "Type":
      return nt(hI(e), ve);
    case "Forbidden":
      return C(ve(hs(e), [ve(dI(e))]));
    case "Unexpected":
      return C(ve(gI(e)));
    case "Missing":
      return nt(mI(e), ve);
    case "Transformation":
      return Rt(_r(e), (t) => t !== void 0 ? C(ve(t)) : nt(mn(e.issue), (n) => ve(hs(e), [ve(cI(e.kind), [n])])));
    case "Refinement":
      return Rt(_r(e), (t) => t !== void 0 ? C(ve(t)) : nt(mn(e.issue), (n) => ve(hs(e), [ve(aI(e.kind), [n])])));
    case "Pointer":
      return nt(mn(e.issue), (t) => ve(Vp(e.path), [t]));
    case "Composite":
      return Rt(_r(e), (t) => {
        if (t !== void 0)
          return C(ve(t));
        const n = hs(e);
        return If(e.issues) ? nt(Ts(e.issues, mn), (r) => ve(n, r)) : nt(mn(e.issues), (r) => ve(n, [r]));
      });
  }
}, pI = /* @__PURE__ */ f((e) => Ft(e[0]), (e, ...t) => {
  const n = {};
  for (const r of t)
    r in e && (n[r] = e[r]);
  return n;
}), yI = /* @__PURE__ */ f((e) => Ft(e[0]), (e, ...t) => {
  const n = {
    ...e
  };
  for (const r of t)
    delete n[r];
  return n;
}), Nr = /* @__PURE__ */ Symbol.for("effect/Schema");
function Se(e) {
  var t, n, r;
  return n = Nr, t = Nr, r = class {
    constructor() {
      c(this, n, Zu);
    }
    static annotations(o) {
      return Se(kt(this.ast, o));
    }
    static pipe() {
      return v(this, arguments);
    }
    static toString() {
      return String(e);
    }
  }, c(r, "ast", e), c(r, "Type"), c(r, "Encoded"), c(r, "Context"), c(r, t, Zu), r;
}
const Zu = {
  /* c8 ignore next */
  _A: (e) => e,
  /* c8 ignore next */
  _I: (e) => e,
  /* c8 ignore next */
  _R: (e) => e
}, el = {
  schemaId: Xp,
  message: $f,
  missingMessage: vc,
  identifier: Rf,
  title: wt,
  description: Ur,
  examples: Nf,
  default: Mf,
  documentation: Zp,
  jsonSchema: Af,
  arbitrary: Ff,
  pretty: Cf,
  equivalence: Pf,
  concurrency: xf,
  batching: jf,
  parseIssueTitle: Lf,
  parseOptions: Kf,
  decodingFallback: Uf
}, ns = (e) => {
  if (!e)
    return {};
  const t = {
    ...e
  };
  for (const n in el)
    if (n in e) {
      const r = el[n];
      t[r] = e[n], delete t[n];
    }
  return t;
}, kt = (e, t) => Rn(e, ns(t)), _I = (e) => String(e.ast), Je = (e) => Se(oe(e.ast)), Zt = (e) => M(e, Nr) && Ft(e[Nr]);
function SI(e) {
  return Tc(e) ? st.make(Py(e, (t) => new Ps(t))) : new Ps(e[0]);
}
function Qg(e, t = SI(e)) {
  var n;
  return n = class extends Se(t) {
    static annotations(s) {
      return Qg(this.literals, kt(this.ast, s));
    }
  }, c(n, "literals", [...e]), n;
}
function Xg(...e) {
  return pe(e) ? Qg(e) : tm;
}
const bI = (e, t, n) => va(e, new po(e.map((r) => r.ast), (...r) => t.decode(...r.map(Se)), (...r) => t.encode(...r.map(Se)), ns(n))), wI = (e, t) => {
  const n = () => (s, o, i) => e(s) ? to(s) : Dg(new It(i, s)), r = n;
  return va([], new po([], n, r, ns(t)));
};
function va(e, t) {
  var n;
  return n = class extends Se(t) {
    static annotations(s) {
      return va(this.typeParameters, kt(this.ast, s));
    }
  }, c(n, "typeParameters", [...e]), n;
}
const kI = function() {
  if (Array.isArray(arguments[0])) {
    const n = arguments[0], r = arguments[1], s = arguments[2];
    return bI(n, r, s);
  }
  const e = arguments[0], t = arguments[1];
  return wI(e, t);
};
class Zg extends (/* @__PURE__ */ Se(py)) {
}
class em extends (/* @__PURE__ */ Se(dy)) {
}
class tm extends (/* @__PURE__ */ Se(Hf)) {
}
class q extends (/* @__PURE__ */ Se(Oy)) {
}
class ds extends (/* @__PURE__ */ Se(Ty)) {
}
class nm extends (/* @__PURE__ */ Se($y)) {
}
const OI = (e) => st.make(e.map((t) => t.ast));
function rm(e, t = OI(e)) {
  var n;
  return n = class extends Se(t) {
    static annotations(s) {
      return rm(this.members, kt(this.ast, s));
    }
  }, c(n, "members", [...e]), n;
}
function Vo(...e) {
  return Tc(e) ? rm(e) : pe(e) ? e[0] : tm;
}
const mi = (e) => Vo(e, em), gs = (e) => Vo(e, Zg), pi = (e) => Vo(e, em, Zg), vI = (e, t) => new Ec(e.map((n) => Zt(n) ? new tn(n.ast, !1) : n.ast), t.map((n) => Zt(n) ? new yo(n.ast) : n.ast), !0);
function Ea(e, t, n = vI(e, t)) {
  var r;
  return r = class extends Se(n) {
    static annotations(o) {
      return Ea(this.elements, this.rest, kt(this.ast, o));
    }
  }, c(r, "elements", [...e]), c(r, "rest", [...t]), r;
}
function sm(e, t) {
  var n;
  return n = class extends Ea([], [e], t) {
    static annotations(s) {
      return sm(this.value, kt(this.ast, s));
    }
  }, c(n, "value", e), n;
}
const We = (e) => sm(e);
function om(e, t) {
  var n;
  return n = class extends Ea([e], [e], t) {
    static annotations(s) {
      return om(this.value, kt(this.ast, s));
    }
  }, c(n, "value", e), n;
}
const EI = (e) => om(e), ac = (e) => e ? '"?:"' : '":"';
class Mr extends tn {
  constructor(n, r, s, o, i) {
    super(n, r, o);
    c(this, "isReadonly");
    c(this, "defaultValue");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "PropertySignatureDeclaration");
    this.isReadonly = s, this.defaultValue = i;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    const n = ac(this.isOptional), r = String(this.type);
    return `PropertySignature<${n}, ${r}, never, ${n}, ${r}>`;
  }
}
class Ta extends tn {
  constructor(n, r, s, o, i) {
    super(n, r, o);
    c(this, "isReadonly");
    c(this, "fromKey");
    this.isReadonly = s, this.fromKey = i;
  }
}
class Wo extends tn {
  constructor(n, r, s, o, i) {
    super(n, r, o);
    c(this, "isReadonly");
    c(this, "defaultValue");
    this.isReadonly = s, this.defaultValue = i;
  }
}
const TI = (e) => e === void 0 ? "never" : ut(e) ? JSON.stringify(e) : String(e);
class Ho {
  constructor(t, n, r, s) {
    c(this, "from");
    c(this, "to");
    c(this, "decode");
    c(this, "encode");
    /**
     * @since 3.10.0
     */
    c(this, "_tag", "PropertySignatureTransformation");
    this.from = t, this.to = n, this.decode = r, this.encode = s;
  }
  /**
   * @since 3.10.0
   */
  toString() {
    return `PropertySignature<${ac(this.to.isOptional)}, ${this.to.type}, ${TI(this.from.fromKey)}, ${ac(this.from.isOptional)}, ${this.from.type}>`;
  }
}
const im = (e, t) => {
  switch (e._tag) {
    case "PropertySignatureDeclaration":
      return new Mr(e.type, e.isOptional, e.isReadonly, {
        ...e.annotations,
        ...t
      }, e.defaultValue);
    case "PropertySignatureTransformation":
      return new Ho(new Ta(e.from.type, e.from.isOptional, e.from.isReadonly, e.from.annotations), new Wo(e.to.type, e.to.isOptional, e.to.isReadonly, {
        ...e.to.annotations,
        ...t
      }, e.to.defaultValue), e.decode, e.encode);
  }
}, cm = /* @__PURE__ */ Symbol.for("effect/PropertySignature"), am = (e) => M(e, cm);
var Gl, zl;
zl = Nr, Gl = cm;
const Na = class Na {
  constructor(t) {
    c(this, "ast");
    c(this, zl);
    c(this, Gl, null);
    c(this, "_TypeToken");
    c(this, "_Key");
    c(this, "_EncodedToken");
    c(this, "_HasDefault");
    this.ast = t;
  }
  pipe() {
    return v(this, arguments);
  }
  annotations(t) {
    return new Na(im(this.ast, ns(t)));
  }
  toString() {
    return String(this.ast);
  }
};
let no = Na;
const ro = (e) => new no(e);
class Go extends no {
  constructor(n, r) {
    super(n);
    c(this, "from");
    this.from = r;
  }
  annotations(n) {
    return new Go(im(this.ast, ns(n)), this.from);
  }
}
const II = (e) => new Go(new Mr(e.ast, !1, !0, {}, void 0), e), dr = /* @__PURE__ */ f(2, (e, t) => {
  const n = e.ast;
  switch (n._tag) {
    case "PropertySignatureDeclaration":
      return ro(new Mr(n.type, n.isOptional, n.isReadonly, n.annotations, t));
    case "PropertySignatureTransformation":
      return ro(new Ho(n.from, new Wo(n.to.type, n.to.isOptional, n.to.isReadonly, n.to.annotations, t), n.decode, n.encode));
  }
}), vt = (e, t, n) => ro(new Ho(new Ta(e.ast, !0, !0, {}, void 0), new Wo(t.ast, !1, !0, {}, void 0), (r) => N(n.decode(r)), Vn(n.encode))), tl = (e, t, n) => ro(new Ho(new Ta(e.ast, !0, !0, {}, void 0), new Wo(t.ast, !0, !0, {}, void 0), n.decode, n.encode)), $I = (e, t) => {
  const n = t == null ? void 0 : t.exact, r = t == null ? void 0 : t.default, s = t == null ? void 0 : t.nullable, o = (t == null ? void 0 : t.as) == "Option", i = t != null && t.onNoneEncoding ? yt(t.onNoneEncoding) : H;
  return n ? r ? s ? dr(vt(mi(e), Je(e), {
    decode: de({
      onNone: r,
      onSome: (a) => a === null ? r() : a
    }),
    encode: N
  }), r).ast : dr(vt(e, Je(e), {
    decode: de({
      onNone: r,
      onSome: H
    }),
    encode: N
  }), r).ast : o ? s ? vt(mi(e), ms(Je(e)), {
    decode: rr(zo),
    encode: i
  }).ast : vt(e, ms(Je(e)), {
    decode: H,
    encode: H
  }).ast : s ? tl(mi(e), Je(e), {
    decode: rr(zo),
    encode: H
  }).ast : new Mr(e.ast, !0, !0, {}, void 0) : r ? s ? dr(vt(pi(e), Je(e), {
    decode: de({
      onNone: r,
      onSome: (a) => a ?? r()
    }),
    encode: N
  }), r).ast : dr(vt(gs(e), Je(e), {
    decode: de({
      onNone: r,
      onSome: (a) => a === void 0 ? r() : a
    }),
    encode: N
  }), r).ast : o ? s ? vt(pi(e), ms(Je(e)), {
    decode: rr((a) => a != null),
    encode: i
  }).ast : vt(gs(e), ms(Je(e)), {
    decode: rr(km),
    encode: i
  }).ast : s ? tl(pi(e), gs(Je(e)), {
    decode: rr(zo),
    encode: H
  }).ast : new Mr(gs(e).ast, !0, !0, {}, void 0);
}, RI = /* @__PURE__ */ f((e) => Zt(e[0]), (e, t) => new Go($I(e, t), e)), NI = /* @__PURE__ */ th([vc]), MI = (e, t) => {
  const n = wn(e), r = [];
  if (n.length > 0) {
    const o = [], i = [], a = [];
    for (let u = 0; u < n.length; u++) {
      const l = n[u], h = e[l];
      if (am(h)) {
        const d = h.ast;
        switch (d._tag) {
          case "PropertySignatureDeclaration": {
            const p = d.type, m = d.isOptional, y = d.annotations;
            o.push(new Oe(l, p, m, !0, NI(d))), i.push(new Oe(l, oe(p), m, !0, y)), r.push(new Oe(l, p, m, !0, y));
            break;
          }
          case "PropertySignatureTransformation": {
            const p = d.from.fromKey ?? l;
            o.push(new Oe(p, d.from.type, d.from.isOptional, !0, d.from.annotations)), i.push(new Oe(l, d.to.type, d.to.isOptional, !0, d.to.annotations)), a.push(new Ly(p, l, d.decode, d.encode));
            break;
          }
        }
      } else
        o.push(new Oe(l, h.ast, !1, !0)), i.push(new Oe(l, oe(h.ast), !1, !0)), r.push(new Oe(l, h.ast, !1, !0));
    }
    if (pe(a)) {
      const u = [], l = [];
      for (const h of t) {
        const {
          indexSignatures: d,
          propertySignatures: p
        } = Wa(h.key.ast, h.value.ast);
        p.forEach((m) => {
          o.push(m), i.push(new Oe(m.name, oe(m.type), m.isOptional, m.isReadonly, m.annotations));
        }), d.forEach((m) => {
          u.push(m), l.push(new _o(m.parameter, oe(m.type), m.isReadonly));
        });
      }
      return new Xf(new Dt(o, u, {
        [bi]: "Struct (Encoded side)"
      }), new Dt(i, l, {
        [bi]: "Struct (Type side)"
      }), new Ky(a));
    }
  }
  const s = [];
  for (const o of t) {
    const {
      indexSignatures: i,
      propertySignatures: a
    } = Wa(o.key.ast, o.value.ast);
    a.forEach((u) => r.push(u)), i.forEach((u) => s.push(u));
  }
  return new Dt(r, s);
}, AI = (e, t) => {
  const n = wn(e);
  for (const r of n) {
    const s = e[r];
    if (t[r] === void 0 && am(s)) {
      const o = s.ast, i = o._tag === "PropertySignatureDeclaration" ? o.defaultValue : o.to.defaultValue;
      i !== void 0 && (t[r] = i());
    }
  }
  return t;
};
function um(e, t, n = MI(e, t)) {
  var r;
  return r = class extends Se(n) {
    static annotations(o) {
      return um(this.fields, this.records, kt(this.ast, o));
    }
    static pick(...o) {
      return At(pI(e, ...o));
    }
    static omit(...o) {
      return At(yI(e, ...o));
    }
  }, c(r, "fields", {
    ...e
  }), c(r, "records", [...t]), c(r, "make", (o, i) => {
    const a = AI(e, {
      ...o
    });
    return UI(i) ? a : XT(r)(a);
  }), r;
}
function At(e, ...t) {
  return um(e, t);
}
const FI = (e) => Xg(e).pipe(II, dr(() => e)), pn = (e, t) => At({
  _tag: FI(e),
  ...t
}), _n = (e) => Se(new Ic(() => e().ast));
function lm(e, t, n) {
  var r;
  return r = class extends Se(n) {
    static annotations(o) {
      return lm(this.from, this.to, kt(this.ast, o));
    }
  }, c(r, "from", e), c(r, "to", t), r;
}
const CI = /* @__PURE__ */ f((e) => Zt(e[0]) && Zt(e[1]), (e, t, n) => lm(e, t, new Xf(e.ast, t.ast, new jy(n.decode, n.encode)))), PI = /* @__PURE__ */ f((e) => Zt(e[0]) && Zt(e[1]), (e, t, n) => CI(e, t, {
  strict: !0,
  decode: (r, s, o, i) => to(n.decode(r, i)),
  encode: (r, s, o, i) => to(n.encode(r, i))
})), xI = (e, t, n, r) => JT(e, {
  onFailure: (s) => new ee(n, r, s),
  onSuccess: t
}), jI = (e) => e._tag === "None" ? k() : N(e.value), LI = (e, t) => (n) => n.oneof(t, n.record({
  _tag: n.constant("None")
}), n.record({
  _tag: n.constant("Some"),
  value: e(n)
})).map(jI), KI = (e) => de({
  onNone: () => "none()",
  onSome: (t) => `some(${e(t)})`
}), nl = (e) => (t, n, r) => hp(t) ? te(t) ? to(k()) : xI(e(t.value, n), N, r, t) : Dg(new It(r, t)), ms = (e) => kI([e], {
  decode: (t) => nl(GT(t)),
  encode: (t) => nl(zT(t))
}, {
  description: `Option<${_I(e)}>`,
  pretty: KI,
  arbitrary: LI,
  equivalence: _p
});
function UI(e) {
  return lc(e) ? e : (e == null ? void 0 : e.disableValidation) ?? !1;
}
const D = RI, DI = At({
  path: q,
  description: D(q, { exact: !0 })
}), qI = At({
  name: q,
  valueBase64Binary: D(q, { exact: !0 }),
  valueBoolean: D(q, { exact: !0 }),
  valueCanonical: D(q, { exact: !0 }),
  valueCode: D(q, { exact: !0 }),
  valueDate: D(q, { exact: !0 }),
  valueDateTime: D(q, { exact: !0 }),
  valueDecimal: D(q, { exact: !0 }),
  valueId: D(q, { exact: !0 }),
  valueInstant: D(ds, { exact: !0 }),
  valueInteger: D(ds, { exact: !0 }),
  valueOid: D(q, { exact: !0 }),
  valuePositiveInt: D(ds, { exact: !0 }),
  valueString: D(q, { exact: !0 }),
  valueTime: D(q, { exact: !0 }),
  valueUnsignedInt: D(ds, { exact: !0 }),
  valueUri: D(q, { exact: !0 }),
  valueUrl: D(q, { exact: !0 }),
  valueUuid: D(q, { exact: !0 })
}), BI = qI, JI = At({
  name: q,
  value: q
}), fm = JI, l$ = ZT(fm), hm = At({
  path: q,
  name: q,
  description: D(q, { exact: !0 }),
  collection: D(nm, { exact: !0 }),
  type: D(q, { exact: !0 }),
  tags: D(We(fm), { exact: !0 })
}), Ia = hm, f$ = hm.make, hn = QT(Ia), uc = At({
  column: D(
    We(
      Ia
    ),
    {
      exact: !0
    }
  ),
  select: D(
    We(_n(() => uc)),
    { exact: !0 }
  ),
  forEach: D(q, { exact: !0 }),
  forEachOrNull: D(q, { exact: !0 }),
  unionAll: D(
    We(_n(() => uc)),
    { exact: !0 }
  )
}), { Select: Pt, Column: dn, ForEach: rl, ForEachOrNull: sl, UnionAll: gn, $match: VI } = lT(), Sn = Vo(
  pn("Column", {
    column: We(Je(Ia))
  }),
  pn("Select", {
    select: We(_n(() => Sn))
  }),
  pn("ForEach", {
    forEach: q,
    select: We(_n(() => Sn))
  }),
  pn("ForEachOrNull", {
    forEachOrNull: q,
    select: We(_n(() => Sn))
  }),
  pn("UnionAll", {
    unionAll: We(_n(() => Sn))
  })
);
function ye(e) {
  return UT(e).pipe(
    Ot(
      {
        forEach: fs,
        forEachOrNull: fs
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(e, null, 2)}`
        );
      }
    ),
    Ot(
      {
        forEach: fs
      },
      ({ forEach: t, select: n = [], unionAll: r, column: s }) => rl({
        forEach: t,
        select: [
          ...r ? [
            gn({
              unionAll: r.map(
                (o) => ye(o)
              )
            })
          ] : [],
          ...s ? [
            dn({
              column: cn(
                s,
                (o) => hn(
                  o
                )
              )
            })
          ] : [],
          ...n.map(ye)
        ]
      })
    ),
    Ot(
      {
        forEachOrNull: fs
      },
      ({ forEachOrNull: t, select: n = [], unionAll: r, column: s }) => sl({
        forEachOrNull: t,
        select: [
          ...r ? [
            gn({
              unionAll: r.map(
                (o) => ye(o)
              )
            })
          ] : [],
          ...s ? [
            dn({
              column: cn(
                s,
                (o) => hn(
                  o
                )
              )
            })
          ] : [],
          ...n.map(ye)
        ]
      })
    ),
    Ot(
      {
        column: Be,
        select: Be,
        unionAll: Be
      },
      ({ column: t = [], select: n = [], unionAll: r = [] }) => Pt({
        select: [
          gn({
            unionAll: r.map(ye)
          }),
          dn({
            column: cn(
              t,
              (s) => hn(s)
            )
          }),
          ...n.map(ye)
        ]
      })
    ),
    Ot(
      {
        unionAll: Be,
        select: Be
      },
      ({ unionAll: t = [], select: n = [] }) => Pt({
        select: [
          gn({
            unionAll: t.map(ye)
          }),
          ...n.map(ye)
        ]
      })
    ),
    Ot(
      {
        select: Be,
        column: Be
      },
      ({ select: t = [], column: n = [] }) => Pt({
        select: [
          dn({
            column: cn(
              n,
              (r) => hn(r)
            )
          }),
          ...t.map(ye)
        ]
      })
    ),
    Ot(
      {
        column: Be,
        unionAll: Be
      },
      ({ column: t = [], unionAll: n = [], select: r = [] }) => Pt({
        select: [
          dn({
            column: cn(
              t,
              (s) => hn(s)
            )
          }),
          gn({
            unionAll: n.map(ye)
          }),
          ...r.map(ye)
        ]
      })
    ),
    Ot(
      {
        select: Be
      },
      ({ select: t = [] }) => Pt({
        select: t.map(ye)
      })
    ),
    DT((t) => {
      var n, r;
      return t.unionAll ? gn({
        unionAll: t.unionAll.map(ye)
      }) : t.column ? dn({
        column: cn(
          t.column,
          (s) => hn(s)
        )
      }) : t.forEach ? rl({
        forEach: t.forEach,
        select: ((n = t.select) == null ? void 0 : n.map(ye)) ?? []
      }) : t.forEachOrNull ? sl({
        forEachOrNull: t.forEachOrNull,
        select: ((r = t.select) == null ? void 0 : r.map(ye)) ?? []
      }) : t.select ? Pt({
        select: t.select.map(ye)
      }) : Pt({
        select: []
      });
    })
  );
}
const WI = PI(uc, Sn, {
  strict: !0,
  encode: ({ _tag: e, ...t }) => t,
  decode: (e) => ye(e)
}), h$ = YT(WI);
pn("Select", {
  status: Xg("draft", "active", "retired", "unknown"),
  url: D(q, { exact: !0 }),
  name: D(q, { exact: !0 }),
  title: D(q, { exact: !0 }),
  experimental: D(nm, { exact: !0 }),
  publisher: D(q, { exact: !0 }),
  description: D(q, { exact: !0 }),
  copyright: D(q, { exact: !0 }),
  resource: q,
  constant: D(We(BI), {
    exact: !0
  }),
  where: D(We(DI), { exact: !0 }),
  select: EI(Sn)
});
const d$ = Lg("Select");
function g$(e, t = (n) => !0) {
  const n = (o, i) => VI(i, {
    ForEach: ({ select: a }) => a.flatMap((u) => n(o, u)),
    ForEachOrNull: ({ select: a }) => a.flatMap((u) => n(o, u)),
    Select: ({ select: a }) => a.flatMap((u) => n(o, u)),
    UnionAll: ({ unionAll: a }) => a.flatMap((u) => n(o, u)),
    Column: ({ column: a }) => kc(o, a)
  });
  return n([], e).filter(t);
}
export {
  VI as $,
  dn as C,
  rl as F,
  Pt as S,
  fm as T,
  gn as U,
  DI as W,
  f as a,
  kf as b,
  f$ as c,
  d$ as d,
  BI as e,
  GI as f,
  Ia as g,
  sl as h,
  l$ as i,
  ye as j,
  g$ as k,
  bn as m,
  h$ as n,
  DT as o,
  g as p,
  Of as r,
  UT as v,
  Ot as w
};
