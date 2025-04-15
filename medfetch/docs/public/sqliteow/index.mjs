var di = Object.defineProperty;
var hi = (t, e, n) => e in t ? di(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var l = (t, e, n) => hi(t, typeof e != "symbol" ? e + "" : e, n);
import { d as pr, a as fi, b as mr, c as ht, e as pi, f, p as Ue, N as _r, t as gr, g as Sr, h as Ct, i as bt, r as Er, m as mi, j as _i, k as gi, u as Si, _ as Ei, l as Ci, n as bi, o as yi, q as vi, s as c, v as ze, w as ce, x as ft, y as Pi, C as Oi, z as ie, A as xi, B as ae, D as B, E as fe, F as le, G as wi, H as zt, I as Ii, J as Cr, K as ki, L as Di, M as br, O as yr, P as X, Q as Mt, R as Ri, S as Fi, T as $i, U as vr, V as Pr, W as kn, X as Ti, Y as Or, Z as It, $ as Dn, a0 as xr, a1 as Ai, a2 as wr, a3 as Ni, a4 as G, a5 as Li, a6 as rn, a7 as et, a8 as Y, a9 as y, aa as zi, ab as yt, ac as x, ad as Ye, ae as Ir, af as Mi, ag as Ui, ah as qi, ai as _, aj as Wi, ak as Se, al as Bi, am as O, an as ji, ao as Qi, ap as D, aq as R, ar as Vi, as as Hi, at as kr, au as Ut, av as Ee, aw as Ki, ax as qt, ay as Z, az as ee, aA as Gi, aB as j, aC as Wt, aD as $e, aE as Qe, aF as k, aG as Bt, aH as K, aI as Q, aJ as pt, aK as A, aL as Ge, aM as Ji, aN as Yi, aO as Xi, aP as Zi, aQ as Dr, aR as ea, aS as Re, aT as ta, aU as na, aV as Oe, aW as Xe, aX as mt, aY as ra, aZ as sa, a_ as jt, a$ as Qt, b0 as ia, b1 as aa, b2 as oa, b3 as ca, b4 as Rn, b5 as Rr, b6 as ua, b7 as la, b8 as Fn, b9 as ut, ba as $n, bb as da, bc as ha, bd as fa, be as Fr, bf as pa, bg as ma, bh as kt, bi as Dt, bj as Me, bk as Tn, bl as _a, bm as ga, bn as Sa, bo as Ea, bp as Vt, bq as sn, br as Ca, bs as ba, bt as ya, bu as an, bv as va, bw as Pa, bx as Oa, by as xa, bz as wa, bA as N, bB as $r, bC as Ia, bD as ka, bE as u, bF as Da, bG as Ra, bH as Tr, bI as vt, bJ as Ar, bK as E, bL as on, bM as S, bN as ue, bO as Nr, bP as Fa, bQ as cn, bR as un, bS as $a, bT as Ta, bU as ln, bV as ye, bW as Lr, bX as zr, bY as Mr, bZ as dn, b_ as Aa, b$ as Na, c0 as Ur, c1 as La, c2 as We, c3 as za, c4 as An, c5 as Nn, c6 as Ln, c7 as qr, c8 as Ma, c9 as Wr, ca as oe, cb as Ua, cc as qa, cd as se, ce as Wa, cf as Ba, cg as ot, ch as H, ci as ja, cj as Qa, ck as Ht, cl as Va, cm as Ha, cn as Ka } from "./view-BCMoZj0M.mjs";
import { cr as gl, cq as Sl, ct as El, cu as Cl, cp as bl, cs as yl, cv as vl, co as Pl } from "./view-BCMoZj0M.mjs";
import { sof as xl } from "./sof.mjs";
const te = pr, F = ht, Ga = pi, Kt = fi, ne = mr, zn = /* @__PURE__ */ Symbol.for("effect/MutableList"), Ja = {
  [zn]: zn,
  [Symbol.iterator]() {
    let t = !1, e = this.head;
    return {
      next() {
        if (t)
          return this.return();
        if (e == null)
          return t = !0, this.return();
        const n = e.value;
        return e = e.next, {
          done: t,
          value: n
        };
      },
      return(n) {
        return t || (t = !0), {
          done: !0,
          value: n
        };
      }
    };
  },
  toString() {
    return Sr(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableList",
      values: Array.from(this).map(gr)
    };
  },
  [_r]() {
    return this.toJSON();
  },
  pipe() {
    return Ue(this, arguments);
  }
}, Ya = (t) => ({
  value: t,
  removed: !1,
  prev: void 0,
  next: void 0
}), Xa = () => {
  const t = Object.create(Ja);
  return t.head = void 0, t.tail = void 0, t._length = 0, t;
}, Br = (t) => hn(t) === 0, hn = (t) => t._length, Za = /* @__PURE__ */ f(2, (t, e) => {
  const n = Ya(e);
  return t.head === void 0 && (t.head = n), t.tail === void 0 || (t.tail.next = n, n.prev = t.tail), t.tail = n, t._length += 1, t;
}), eo = (t) => {
  const e = t.head;
  if (e !== void 0)
    return to(t, e), e.value;
}, to = (t, e) => {
  e.removed || (e.removed = !0, e.prev !== void 0 && e.next !== void 0 ? (e.prev.next = e.next, e.next.prev = e.prev) : e.prev !== void 0 ? (t.tail = e.prev, e.prev.next = void 0) : e.next !== void 0 ? (t.head = e.next, e.next.prev = void 0) : (t.tail = void 0, t.head = void 0), t._length > 0 && (t._length -= 1));
}, Mn = /* @__PURE__ */ Symbol.for("effect/MutableQueue"), T = /* @__PURE__ */ Symbol.for("effect/mutable/MutableQueue/Empty"), no = {
  [Mn]: Mn,
  [Symbol.iterator]() {
    return Array.from(this.queue)[Symbol.iterator]();
  },
  toString() {
    return Sr(this.toJSON());
  },
  toJSON() {
    return {
      _id: "MutableQueue",
      values: Array.from(this).map(gr)
    };
  },
  [_r]() {
    return this.toJSON();
  },
  pipe() {
    return Ue(this, arguments);
  }
}, jr = (t) => {
  const e = Object.create(no);
  return e.queue = Xa(), e.capacity = t, e;
}, ro = (t) => jr(t), fn = () => jr(void 0), pn = (t) => hn(t.queue), Gt = (t) => Br(t.queue), so = (t) => t.capacity === void 0 ? 1 / 0 : t.capacity, Ze = /* @__PURE__ */ f(2, (t, e) => {
  const n = hn(t.queue);
  return t.capacity !== void 0 && n === t.capacity ? !1 : (Za(e)(t.queue), !0);
}), Qr = /* @__PURE__ */ f(2, (t, e) => {
  const n = e[Symbol.iterator]();
  let r, s = bt(), i = !0;
  for (; i && (r = n.next()) && !r.done; )
    i = Ze(r.value)(t);
  for (; r != null && !r.done; )
    s = Ct(r.value)(s), r = n.next();
  return Er(s);
}), de = /* @__PURE__ */ f(2, (t, e) => Br(t.queue) ? e : eo(t.queue)), mn = /* @__PURE__ */ f(2, (t, e) => {
  let n = bt(), r = 0;
  for (; r < e; ) {
    const s = de(T)(t);
    if (s === T)
      break;
    n = Ct(s)(n), r += 1;
  }
  return Er(n);
}), Vr = mi, io = gi, Be = _i, ao = Si, oo = (t) => t.toUpperCase(), co = (t) => t.toLowerCase(), Hr = (t) => t.length === 0 ? t : oo(t[0]) + t.slice(1), uo = (t) => t.length === 0 ? t : co(t[0]) + t.slice(1), lo = (t, e) => (n) => n.replace(t, e), Kr = Ei, Un = Ci, Ce = yi, ho = bi, qn = vi, fo = "effect/QueueEnqueue", po = /* @__PURE__ */ Symbol.for(fo), mo = "effect/QueueDequeue", _o = /* @__PURE__ */ Symbol.for(mo), go = "effect/QueueStrategy", Gr = /* @__PURE__ */ Symbol.for(go), So = "effect/BackingQueue", Eo = /* @__PURE__ */ Symbol.for(So), Jr = {
  /* c8 ignore next */
  _A: (t) => t
}, Co = {
  /* c8 ignore next */
  _A: (t) => t
}, bo = {
  /* c8 ignore next */
  _In: (t) => t
}, yo = {
  /* c8 ignore next */
  _Out: (t) => t
};
var sr, ir, ar;
class vo extends (ar = Oi, ir = po, sr = _o, ar) {
  constructor(n, r, s, i, a) {
    super();
    l(this, "queue");
    l(this, "takers");
    l(this, "shutdownHook");
    l(this, "shutdownFlag");
    l(this, "strategy");
    l(this, ir, bo);
    l(this, sr, yo);
    this.queue = n, this.takers = r, this.shutdownHook = s, this.shutdownFlag = i, this.strategy = a;
  }
  pipe() {
    return Ue(this, arguments);
  }
  commit() {
    return this.take;
  }
  capacity() {
    return this.queue.capacity();
  }
  get size() {
    return ie(() => xi(this.unsafeSize(), () => ae));
  }
  unsafeSize() {
    return B(this.shutdownFlag) ? fe() : le(this.queue.length() - pn(this.takers) + this.strategy.surplusSize());
  }
  get isEmpty() {
    return ft(this.size, (n) => n <= 0);
  }
  get isFull() {
    return ft(this.size, (n) => n >= this.capacity());
  }
  get shutdown() {
    return wi(zt((n) => (c(this.shutdownFlag, Ii(!0)), c(br(Le(this.takers), (r) => yr(r, n.id()), !1, !1), Di(this.strategy.shutdown), ki(mr(this.shutdownHook, void 0)), Cr))));
  }
  get isShutdown() {
    return ce(() => B(this.shutdownFlag));
  }
  get awaitShutdown() {
    return ht(this.shutdownHook);
  }
  isActive() {
    return !B(this.shutdownFlag);
  }
  unsafeOffer(n) {
    if (B(this.shutdownFlag))
      return !1;
    let r;
    if (this.queue.length() === 0) {
      const i = c(this.takers, de(T));
      i !== T ? (be(i, n), r = !0) : r = !1;
    } else
      r = !1;
    if (r)
      return !0;
    const s = this.queue.offer(n);
    return Te(this.strategy, this.queue, this.takers), s;
  }
  offer(n) {
    return ie(() => {
      if (B(this.shutdownFlag))
        return ae;
      let r;
      if (this.queue.length() === 0) {
        const i = c(this.takers, de(T));
        i !== T ? (be(i, n), r = !0) : r = !1;
      } else
        r = !1;
      if (r)
        return X(!0);
      const s = this.queue.offer(n);
      return Te(this.strategy, this.queue, this.takers), s ? X(!0) : this.strategy.handleSurplus([n], this.queue, this.takers, this.shutdownFlag);
    });
  }
  offerAll(n) {
    return ie(() => {
      if (B(this.shutdownFlag))
        return ae;
      const r = Mt(n), s = this.queue.length() === 0 ? Mt(No(this.takers, r.length)) : Ri, [i, a] = c(r, Fi(s.length));
      for (let h = 0; h < s.length; h++) {
        const p = s[h], g = i[h];
        be(p, g);
      }
      if (a.length === 0)
        return X(!0);
      const d = this.queue.offerAll(a);
      return Te(this.strategy, this.queue, this.takers), $i(d) ? X(!0) : this.strategy.handleSurplus(d, this.queue, this.takers, this.shutdownFlag);
    });
  }
  get take() {
    return zt((n) => {
      if (B(this.shutdownFlag))
        return ae;
      const r = this.queue.poll(T);
      if (r !== T)
        return this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers), X(r);
      {
        const s = vr(n.id());
        return c(ie(() => (c(this.takers, Ze(s)), Te(this.strategy, this.queue, this.takers), B(this.shutdownFlag) ? ae : ht(s))), Pr(() => ce(() => Lo(this.takers, s))));
      }
    });
  }
  get takeAll() {
    return ie(() => B(this.shutdownFlag) ? ae : ce(() => {
      const n = this.queue.pollUpTo(Number.POSITIVE_INFINITY);
      return this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers), kn(n);
    }));
  }
  takeUpTo(n) {
    return ie(() => B(this.shutdownFlag) ? ae : ce(() => {
      const r = this.queue.pollUpTo(n);
      return this.strategy.unsafeOnQueueEmptySpace(this.queue, this.takers), kn(r);
    }));
  }
  takeBetween(n, r) {
    return ie(() => Yr(this, n, r, bt()));
  }
}
const Yr = (t, e, n, r) => n < e ? X(r) : c(Ro(t, n), ze((s) => {
  const i = e - s.length;
  return i === 1 ? c(Jt(t), ft((a) => c(r, It(s), Dn(a)))) : i > 1 ? c(Jt(t), ze((a) => Yr(t, i - 1, n - s.length - 1, c(r, It(s), Dn(a))))) : X(c(r, It(s)));
})), Po = (t) => c(ce(() => ro(t)), ze((e) => Xr(Zr(e), Fo()))), Oo = () => c(ce(() => fn()), ze((t) => Xr(Zr(t), $o()))), xo = (t, e, n, r, s) => new vo(t, e, n, r, s), Xr = (t, e) => c(pr(), ft((n) => xo(t, fn(), n, Pi(!1), e)));
var or;
or = Eo;
class wo {
  constructor(e) {
    l(this, "mutable");
    l(this, or, Co);
    this.mutable = e;
  }
  poll(e) {
    return de(this.mutable, e);
  }
  pollUpTo(e) {
    return mn(this.mutable, e);
  }
  offerAll(e) {
    return Qr(this.mutable, e);
  }
  offer(e) {
    return Ze(this.mutable, e);
  }
  capacity() {
    return so(this.mutable);
  }
  length() {
    return pn(this.mutable);
  }
}
const Zr = (t) => new wo(t), Io = (t) => t.size, ko = (t) => t.shutdown, Do = /* @__PURE__ */ f(2, (t, e) => t.offer(e)), Jt = (t) => t.take, Ro = /* @__PURE__ */ f(2, (t, e) => t.takeUpTo(e)), Fo = () => new To(), $o = () => new Ao();
var cr;
cr = Gr;
class To {
  constructor() {
    l(this, cr, Jr);
    l(this, "putters", /* @__PURE__ */ fn());
  }
  surplusSize() {
    return pn(this.putters);
  }
  onCompleteTakersWithEmptyQueue(e) {
    for (; !Gt(this.putters) && !Gt(e); ) {
      const n = de(e, void 0), r = de(this.putters, void 0);
      r[2] && be(r[1], !0), be(n, r[0]);
    }
  }
  get shutdown() {
    return c(Ai, ze((e) => c(ce(() => Le(this.putters)), ze((n) => br(n, ([r, s, i]) => i ? c(yr(s, e), Cr) : xr, !1, !1)))));
  }
  handleSurplus(e, n, r, s) {
    return zt((i) => {
      const a = vr(i.id());
      return c(ie(() => (this.unsafeOffer(e, a), this.unsafeOnQueueEmptySpace(n, r), Te(this, n, r), B(s) ? ae : ht(a))), Pr(() => ce(() => this.unsafeRemove(a))));
    });
  }
  unsafeOnQueueEmptySpace(e, n) {
    let r = !0;
    for (; r && (e.capacity() === Number.POSITIVE_INFINITY || e.length() < e.capacity()); ) {
      const s = c(this.putters, de(T));
      if (s === T)
        r = !1;
      else {
        const i = e.offer(s[0]);
        i && s[2] ? be(s[1], !0) : i || _t(this.putters, c(Le(this.putters), Ct(s))), Te(this, e, n);
      }
    }
  }
  unsafeOffer(e, n) {
    const r = Mt(e);
    for (let s = 0; s < r.length; s++) {
      const i = r[s];
      s === r.length - 1 ? c(this.putters, Ze([i, n, !0])) : c(this.putters, Ze([i, n, !1]));
    }
  }
  unsafeRemove(e) {
    _t(this.putters, c(Le(this.putters), Or(([, n]) => n !== e)));
  }
}
var ur;
ur = Gr;
class Ao {
  constructor() {
    l(this, ur, Jr);
  }
  surplusSize() {
    return 0;
  }
  get shutdown() {
    return xr;
  }
  onCompleteTakersWithEmptyQueue() {
  }
  handleSurplus(e, n, r, s) {
    return X(!1);
  }
  unsafeOnQueueEmptySpace(e, n) {
  }
}
const be = (t, e) => Ti(t, X(e)), _t = (t, e) => c(t, Qr(e)), Le = (t) => c(t, mn(Number.POSITIVE_INFINITY)), No = (t, e) => c(t, mn(e)), Lo = (t, e) => {
  _t(t, c(Le(t), Or((n) => e !== n)));
}, Te = (t, e, n) => {
  let r = !0;
  for (; r && e.length() !== 0; ) {
    const s = c(n, de(T));
    if (s !== T) {
      const i = e.poll(T);
      i !== T ? (be(s, i), t.unsafeOnQueueEmptySpace(e, n)) : _t(n, c(Le(n), Ct(s))), r = !0;
    } else
      r = !1;
  }
  r && e.length() === 0 && !Gt(n) && t.onCompleteTakersWithEmptyQueue(n);
}, zo = Po, Mo = Oo, Uo = Io, Wn = ko, xe = Do, Bn = Jt, es = "Continue", qo = "Close", Wo = "Yield", Bo = "effect/ChannelChildExecutorDecision", jn = /* @__PURE__ */ Symbol.for(Bo), jo = {
  [jn]: jn
}, ts = (t) => {
  const e = Object.create(jo);
  return e._tag = es, e;
}, lt = "ContinuationK", Qo = "ContinuationFinalizer", ns = /* @__PURE__ */ Symbol.for("effect/ChannelContinuation"), rs = {
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
  _OutDone: (t) => t,
  /* c8 ignore next */
  _OutErr2: (t) => t,
  /* c8 ignore next */
  _OutElem: (t) => t,
  /* c8 ignore next */
  _OutDone2: (t) => t
};
var lr;
lr = ns;
class ss {
  constructor(e, n) {
    l(this, "onSuccess");
    l(this, "onHalt");
    l(this, "_tag", lt);
    l(this, lr, rs);
    this.onSuccess = e, this.onHalt = n;
  }
  onExit(e) {
    return wr(e) ? this.onHalt(e.cause) : this.onSuccess(e.value);
  }
}
var dr;
dr = ns;
class Vo {
  constructor(e) {
    l(this, "finalizer");
    l(this, "_tag", Qo);
    l(this, dr, rs);
    this.finalizer = e;
  }
}
const is = "PullAfterNext", Ho = "PullAfterAllEnqueued", Ko = "effect/ChannelUpstreamPullStrategy", Go = /* @__PURE__ */ Symbol.for(Ko), Jo = {
  /* c8 ignore next */
  _A: (t) => t
}, Yo = {
  [Go]: Jo
}, as = (t) => {
  const e = Object.create(Yo);
  return e._tag = is, e.emitSeparator = t, e;
}, os = "BracketOut", cs = "Bridge", _n = "ConcatAll", us = "Emit", ls = "Ensuring", ds = "Fail", hs = "Fold", fs = "FromEffect", ps = "PipeTo", Xo = "Provide", ms = "Read", _s = "Succeed", gs = "SucceedNow", Ss = "Suspend", Zo = "effect/Channel", Es = /* @__PURE__ */ Symbol.for(Zo), ec = {
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
}, L = {
  [Es]: ec,
  pipe() {
    return Ue(this, arguments);
  }
}, Cs = (t) => rn(t, Es) || et(t), tc = /* @__PURE__ */ f(2, (t, e) => {
  const n = Object.create(L);
  return n._tag = os, n.acquire = () => t, n.finalizer = e, n;
}), bs = (t, e, n) => {
  const r = Object.create(L);
  return r._tag = _n, r.combineInners = e, r.combineAll = n, r.onPull = () => as(fe()), r.onEmit = () => ts, r.value = () => t, r.k = Y, r;
}, nc = /* @__PURE__ */ f(4, (t, e, n, r) => {
  const s = Object.create(L);
  return s._tag = _n, s.combineInners = n, s.combineAll = r, s.onPull = () => as(fe()), s.onEmit = () => ts, s.value = () => t, s.k = e, s;
}), ys = /* @__PURE__ */ f(2, (t, e) => {
  const n = Object.create(L);
  return n._tag = cs, n.input = e, n.channel = t, n;
}), rc = /* @__PURE__ */ f(2, (t, e) => {
  const n = Object.create(L);
  return n._tag = ls, n.channel = t, n.finalizer = e, n;
}), Pt = (t) => V(Ni(t)), V = (t) => sc(() => t), sc = (t) => {
  const e = Object.create(L);
  return e._tag = ds, e.error = t, e;
}, w = /* @__PURE__ */ f(2, (t, e) => {
  const n = Object.create(L);
  return n._tag = hs, n.channel = t, n.k = new ss(e, V), n;
}), z = (t) => {
  const e = Object.create(L);
  return e._tag = fs, e.effect = () => t, e;
}, J = /* @__PURE__ */ f(2, (t, e) => {
  const n = Object.create(L);
  return n._tag = ps, n.left = () => t, n.right = () => e, n;
}), gn = (t) => Sn({
  onInput: t.onInput,
  onFailure: (e) => G(Li(e), {
    onLeft: t.onFailure,
    onRight: V
  }),
  onDone: t.onDone
}), Sn = (t) => {
  const e = Object.create(L);
  return e._tag = ms, e.more = t.onInput, e.done = new ss(t.onDone, t.onFailure), e;
}, vs = (t) => Ps(() => t), ve = (t) => {
  const e = Object.create(L);
  return e._tag = gs, e.terminal = t, e;
}, En = (t) => {
  const e = Object.create(L);
  return e._tag = Ss, e.channel = t, e;
}, Ps = (t) => {
  const e = Object.create(L);
  return e._tag = _s, e.evaluate = t, e;
}, tt = /* @__PURE__ */ ve(void 0), $ = (t) => {
  const e = Object.create(L);
  return e._tag = us, e.out = t, e;
}, nt = "Done", rt = "Emit", qe = "FromEffect", st = "Read", ic = /* @__PURE__ */ Symbol.for("effect/ChannelState"), ac = {
  /* c8 ignore next */
  _E: (t) => t,
  /* c8 ignore next */
  _R: (t) => t
}, Ot = {
  [ic]: ac
}, we = () => {
  const t = Object.create(Ot);
  return t._tag = nt, t;
}, Rt = () => {
  const t = Object.create(Ot);
  return t._tag = rt, t;
}, je = (t) => {
  const e = Object.create(Ot);
  return e._tag = qe, e.effect = t, e;
}, Ft = (t, e, n, r) => {
  const s = Object.create(Ot);
  return s._tag = st, s.upstream = t, s.onEffect = e, s.onEmit = n, s.onDone = r, s;
}, gt = (t) => t._tag === qe, oc = (t) => gt(t) ? t.effect : y, Qn = (t) => gt(t) ? zi(t.effect) : void 0, Os = "PullFromChild", Yt = "PullFromUpstream", Xt = "DrainChildExecutors", xs = "Emit";
class ct {
  constructor(e, n, r) {
    l(this, "childExecutor");
    l(this, "parentSubexecutor");
    l(this, "onEmit");
    l(this, "_tag", Os);
    this.childExecutor = e, this.parentSubexecutor = n, this.onEmit = r;
  }
  close(e) {
    const n = this.childExecutor.close(e), r = this.parentSubexecutor.close(e);
    return n !== void 0 && r !== void 0 ? yt(x(n), x(r), (s, i) => c(s, Ye(i))) : n !== void 0 ? n : r !== void 0 ? r : void 0;
  }
  enqueuePullFromChild(e) {
    return this;
  }
}
class _e {
  constructor(e, n, r, s, i, a, d, h) {
    l(this, "upstreamExecutor");
    l(this, "createChild");
    l(this, "lastDone");
    l(this, "activeChildExecutors");
    l(this, "combineChildResults");
    l(this, "combineWithChildResult");
    l(this, "onPull");
    l(this, "onEmit");
    l(this, "_tag", Yt);
    this.upstreamExecutor = e, this.createChild = n, this.lastDone = r, this.activeChildExecutors = s, this.combineChildResults = i, this.combineWithChildResult = a, this.onPull = d, this.onEmit = h;
  }
  close(e) {
    const n = this.upstreamExecutor.close(e), s = [...this.activeChildExecutors.map((i) => i !== void 0 ? i.childExecutor.close(e) : void 0), n].reduce((i, a) => i !== void 0 && a !== void 0 ? yt(i, x(a), (d, h) => Ye(d, h)) : i !== void 0 ? i : a !== void 0 ? x(a) : void 0, void 0);
    return s;
  }
  enqueuePullFromChild(e) {
    return new _e(this.upstreamExecutor, this.createChild, this.lastDone, [...this.activeChildExecutors, e], this.combineChildResults, this.combineWithChildResult, this.onPull, this.onEmit);
  }
}
class Ae {
  constructor(e, n, r, s, i, a, d) {
    l(this, "upstreamExecutor");
    l(this, "lastDone");
    l(this, "activeChildExecutors");
    l(this, "upstreamDone");
    l(this, "combineChildResults");
    l(this, "combineWithChildResult");
    l(this, "onPull");
    l(this, "_tag", Xt);
    this.upstreamExecutor = e, this.lastDone = n, this.activeChildExecutors = r, this.upstreamDone = s, this.combineChildResults = i, this.combineWithChildResult = a, this.onPull = d;
  }
  close(e) {
    const n = this.upstreamExecutor.close(e), s = [...this.activeChildExecutors.map((i) => i !== void 0 ? i.childExecutor.close(e) : void 0), n].reduce((i, a) => i !== void 0 && a !== void 0 ? yt(i, x(a), (d, h) => Ye(d, h)) : i !== void 0 ? i : a !== void 0 ? x(a) : void 0, void 0);
    return s;
  }
  enqueuePullFromChild(e) {
    return new Ae(this.upstreamExecutor, this.lastDone, [...this.activeChildExecutors, e], this.upstreamDone, this.combineChildResults, this.combineWithChildResult, this.onPull);
  }
}
class $t {
  constructor(e, n) {
    l(this, "value");
    l(this, "next");
    l(this, "_tag", xs);
    this.value = e, this.next = n;
  }
  close(e) {
    const n = this.next.close(e);
    return n;
  }
  enqueuePullFromChild(e) {
    return this;
  }
}
const cc = "Pulled", uc = "NoUpstream", lc = "effect/ChannelUpstreamPullRequest", dc = /* @__PURE__ */ Symbol.for(lc), hc = {
  /* c8 ignore next */
  _A: (t) => t
}, ws = {
  [dc]: hc
}, Vn = (t) => {
  const e = Object.create(ws);
  return e._tag = cc, e.value = t, e;
}, fc = (t) => {
  const e = Object.create(ws);
  return e._tag = uc, e.activeDownstreamCount = t, e;
};
class ge {
  constructor(e, n, r) {
    l(this, "_activeSubexecutor");
    l(this, "_cancelled");
    l(this, "_closeLastSubstream");
    l(this, "_currentChannel");
    l(this, "_done");
    l(this, "_doneStack", []);
    l(this, "_emitted");
    l(this, "_executeCloseLastSubstream");
    l(this, "_input");
    l(this, "_inProgressFinalizer");
    l(this, "_providedEnv");
    this._currentChannel = e, this._executeCloseLastSubstream = r, this._providedEnv = n;
  }
  run() {
    let e;
    for (; e === void 0; )
      if (this._cancelled !== void 0)
        e = this.processCancellation();
      else if (this._activeSubexecutor !== void 0)
        e = this.runSubexecutor();
      else
        try {
          if (this._currentChannel === void 0)
            e = we();
          else
            switch (et(this._currentChannel) && (this._currentChannel = z(this._currentChannel)), this._currentChannel._tag) {
              case os: {
                e = this.runBracketOut(this._currentChannel);
                break;
              }
              case cs: {
                const n = this._currentChannel.input;
                if (this._currentChannel = this._currentChannel.channel, this._input !== void 0) {
                  const r = this._input;
                  this._input = void 0;
                  const s = () => _(n.awaitRead(), () => R(() => {
                    const i = r.run();
                    switch (i._tag) {
                      case nt:
                        return ee(r.getDone(), {
                          onFailure: (a) => n.error(a),
                          onSuccess: (a) => n.done(a)
                        });
                      case rt:
                        return _(n.emit(r.getEmit()), () => s());
                      case qe:
                        return Z(i.effect, {
                          onFailure: (a) => n.error(a),
                          onSuccess: () => s()
                        });
                      case st:
                        return Cn(i, () => s(), (a) => n.error(a));
                    }
                  }));
                  e = je(_(Gi(j(s())), (i) => D(() => this.addFinalizer((a) => _(Ce(i), () => R(() => {
                    const d = this.restorePipe(a, r);
                    return d !== void 0 ? d : y;
                  }))))));
                }
                break;
              }
              case _n: {
                const n = new ge(this._currentChannel.value(), this._providedEnv, (s) => D(() => {
                  const i = this._closeLastSubstream === void 0 ? y : this._closeLastSubstream;
                  this._closeLastSubstream = c(i, O(s));
                }));
                n._input = this._input;
                const r = this._currentChannel;
                this._activeSubexecutor = new _e(n, (s) => r.k(s), void 0, [], (s, i) => r.combineInners(s, i), (s, i) => r.combineAll(s, i), (s) => r.onPull(s), (s) => r.onEmit(s)), this._closeLastSubstream = void 0, this._currentChannel = void 0;
                break;
              }
              case us: {
                this._emitted = this._currentChannel.out, this._currentChannel = this._activeSubexecutor !== void 0 ? void 0 : tt, e = Rt();
                break;
              }
              case ls: {
                this.runEnsuring(this._currentChannel);
                break;
              }
              case ds: {
                e = this.doneHalt(this._currentChannel.error());
                break;
              }
              case hs: {
                this._doneStack.push(this._currentChannel.k), this._currentChannel = this._currentChannel.channel;
                break;
              }
              case fs: {
                const n = this._providedEnv === void 0 ? this._currentChannel.effect() : c(this._currentChannel.effect(), qt(this._providedEnv));
                e = je(Z(n, {
                  onFailure: (r) => {
                    const s = this.doneHalt(r);
                    return s !== void 0 && gt(s) ? s.effect : y;
                  },
                  onSuccess: (r) => {
                    const s = this.doneSucceed(r);
                    return s !== void 0 && gt(s) ? s.effect : y;
                  }
                }));
                break;
              }
              case ps: {
                const n = this._input, r = new ge(this._currentChannel.left(), this._providedEnv, (s) => this._executeCloseLastSubstream(s));
                r._input = n, this._input = r, this.addFinalizer((s) => {
                  const i = this.restorePipe(s, n);
                  return i !== void 0 ? i : y;
                }), this._currentChannel = this._currentChannel.right();
                break;
              }
              case Xo: {
                const n = this._providedEnv;
                this._providedEnv = this._currentChannel.context(), this._currentChannel = this._currentChannel.inner, this.addFinalizer(() => D(() => {
                  this._providedEnv = n;
                }));
                break;
              }
              case ms: {
                const n = this._currentChannel;
                e = Ft(this._input, Y, (r) => {
                  try {
                    this._currentChannel = n.more(r);
                  } catch (s) {
                    this._currentChannel = n.done.onExit(Ki(s));
                  }
                }, (r) => {
                  const s = (i) => n.done.onExit(i);
                  this._currentChannel = s(r);
                });
                break;
              }
              case _s: {
                e = this.doneSucceed(this._currentChannel.evaluate());
                break;
              }
              case gs: {
                e = this.doneSucceed(this._currentChannel.terminal);
                break;
              }
              case Ss: {
                this._currentChannel = this._currentChannel.channel();
                break;
              }
              default:
                this._currentChannel._tag;
            }
        } catch (n) {
          this._currentChannel = V(Wt(n));
        }
    return e;
  }
  getDone() {
    return this._done;
  }
  getEmit() {
    return this._emitted;
  }
  cancelWith(e) {
    this._cancelled = e;
  }
  clearInProgressFinalizer() {
    this._inProgressFinalizer = void 0;
  }
  storeInProgressFinalizer(e) {
    this._inProgressFinalizer = e;
  }
  popAllFinalizers(e) {
    const n = [];
    let r = this._doneStack.pop();
    for (; r; )
      r._tag === "ContinuationFinalizer" && n.push(r.finalizer), r = this._doneStack.pop();
    const s = n.length === 0 ? y : At(n, e);
    return this.storeInProgressFinalizer(s), s;
  }
  popNextFinalizers() {
    const e = [];
    for (; this._doneStack.length !== 0; ) {
      const n = this._doneStack[this._doneStack.length - 1];
      if (n._tag === lt)
        return e;
      e.push(n), this._doneStack.pop();
    }
    return e;
  }
  restorePipe(e, n) {
    const r = this._input;
    return this._input = n, r !== void 0 ? r.close(e) : y;
  }
  close(e) {
    let n;
    const r = this._inProgressFinalizer;
    r !== void 0 && (n = c(r, $e(D(() => this.clearInProgressFinalizer()))));
    let s;
    const i = this.popAllFinalizers(e);
    i !== void 0 && (s = c(i, $e(D(() => this.clearInProgressFinalizer()))));
    const a = this._activeSubexecutor === void 0 ? void 0 : this._activeSubexecutor.close(e);
    if (!(a === void 0 && n === void 0 && s === void 0))
      return c(
        x(Tt(a)),
        Bt(x(Tt(n))),
        Bt(x(Tt(s))),
        k(([[d, h], p]) => c(d, Ye(h), Ye(p))),
        Qe,
        // TODO: remove
        _((d) => R(() => d))
      );
  }
  doneSucceed(e) {
    if (this._doneStack.length === 0)
      return this._done = K(e), this._currentChannel = void 0, we();
    const n = this._doneStack[this._doneStack.length - 1];
    if (n._tag === lt) {
      this._doneStack.pop(), this._currentChannel = n.onSuccess(e);
      return;
    }
    const r = this.popNextFinalizers();
    if (this._doneStack.length === 0)
      return this._doneStack = r.reverse(), this._done = K(e), this._currentChannel = void 0, we();
    const s = At(r.map((a) => a.finalizer), K(e));
    this.storeInProgressFinalizer(s);
    const i = c(s, $e(D(() => this.clearInProgressFinalizer())), Qe, _(() => D(() => this.doneSucceed(e))));
    return je(i);
  }
  doneHalt(e) {
    if (this._doneStack.length === 0)
      return this._done = Q(e), this._currentChannel = void 0, we();
    const n = this._doneStack[this._doneStack.length - 1];
    if (n._tag === lt) {
      this._doneStack.pop();
      try {
        this._currentChannel = n.onHalt(e);
      } catch (a) {
        this._currentChannel = V(Wt(a));
      }
      return;
    }
    const r = this.popNextFinalizers();
    if (this._doneStack.length === 0)
      return this._doneStack = r.reverse(), this._done = Q(e), this._currentChannel = void 0, we();
    const s = At(r.map((a) => a.finalizer), Q(e));
    this.storeInProgressFinalizer(s);
    const i = c(s, $e(D(() => this.clearInProgressFinalizer())), Qe, _(() => D(() => this.doneHalt(e))));
    return je(i);
  }
  processCancellation() {
    return this._currentChannel = void 0, this._done = this._cancelled, this._cancelled = void 0, we();
  }
  runBracketOut(e) {
    const n = Qe(Z(this.provide(e.acquire()), {
      onFailure: (r) => D(() => {
        this._currentChannel = V(r);
      }),
      onSuccess: (r) => D(() => {
        this.addFinalizer((s) => this.provide(e.finalizer(r, s))), this._currentChannel = $(r);
      })
    }));
    return je(n);
  }
  provide(e) {
    return this._providedEnv === void 0 ? e : c(e, qt(this._providedEnv));
  }
  runEnsuring(e) {
    this.addFinalizer(e.finalizer), this._currentChannel = e.channel;
  }
  addFinalizer(e) {
    this._doneStack.push(new Vo(e));
  }
  runSubexecutor() {
    const e = this._activeSubexecutor;
    switch (e._tag) {
      case Os:
        return this.pullFromChild(e.childExecutor, e.parentSubexecutor, e.onEmit, e);
      case Yt:
        return this.pullFromUpstream(e);
      case Xt:
        return this.drainChildExecutors(e);
      case xs:
        return this._emitted = e.value, this._activeSubexecutor = e.next, Rt();
    }
  }
  replaceSubexecutor(e) {
    this._currentChannel = void 0, this._activeSubexecutor = e;
  }
  finishWithExit(e) {
    const n = ee(e, {
      onFailure: (r) => this.doneHalt(r),
      onSuccess: (r) => this.doneSucceed(r)
    });
    return this._activeSubexecutor = void 0, n === void 0 ? y : oc(n);
  }
  finishSubexecutorWithCloseEffect(e, ...n) {
    this.addFinalizer(() => c(n, pt((s) => c(D(() => s(e)), _((i) => i !== void 0 ? i : y)), {
      discard: !0
    })));
    const r = c(e, ee({
      onFailure: (s) => this.doneHalt(s),
      onSuccess: (s) => this.doneSucceed(s)
    }));
    return this._activeSubexecutor = void 0, r;
  }
  applyUpstreamPullStrategy(e, n, r) {
    switch (r._tag) {
      case is: {
        const s = !e || n.some((i) => i !== void 0);
        return [r.emitSeparator, s ? [void 0, ...n] : n];
      }
      case Ho: {
        const s = !e || n.some((i) => i !== void 0);
        return [r.emitSeparator, s ? [...n, void 0] : n];
      }
    }
  }
  pullFromChild(e, n, r, s) {
    return Ft(e, Y, (i) => {
      const a = r(i);
      switch (a._tag) {
        case es:
          break;
        case qo: {
          this.finishWithDoneValue(e, n, a.value);
          break;
        }
        case Wo: {
          const d = n.enqueuePullFromChild(s);
          this.replaceSubexecutor(d);
          break;
        }
      }
      this._activeSubexecutor = new $t(i, this._activeSubexecutor);
    }, ee({
      onFailure: (i) => {
        const a = this.handleSubexecutorFailure(e, n, i);
        return a === void 0 ? void 0 : Qn(a);
      },
      onSuccess: (i) => {
        this.finishWithDoneValue(e, n, i);
      }
    }));
  }
  finishWithDoneValue(e, n, r) {
    const s = n;
    switch (s._tag) {
      case Yt: {
        const i = new _e(s.upstreamExecutor, s.createChild, s.lastDone !== void 0 ? s.combineChildResults(s.lastDone, r) : r, s.activeChildExecutors, s.combineChildResults, s.combineWithChildResult, s.onPull, s.onEmit);
        this._closeLastSubstream = e.close(K(r)), this.replaceSubexecutor(i);
        break;
      }
      case Xt: {
        const i = new Ae(s.upstreamExecutor, s.lastDone !== void 0 ? s.combineChildResults(s.lastDone, r) : r, s.activeChildExecutors, s.upstreamDone, s.combineChildResults, s.combineWithChildResult, s.onPull);
        this._closeLastSubstream = e.close(K(r)), this.replaceSubexecutor(i);
        break;
      }
    }
  }
  handleSubexecutorFailure(e, n, r) {
    return this.finishSubexecutorWithCloseEffect(Q(r), (s) => n.close(s), (s) => e.close(s));
  }
  pullFromUpstream(e) {
    if (e.activeChildExecutors.length === 0)
      return this.performPullFromUpstream(e);
    const n = e.activeChildExecutors[0], r = new _e(e.upstreamExecutor, e.createChild, e.lastDone, e.activeChildExecutors.slice(1), e.combineChildResults, e.combineWithChildResult, e.onPull, e.onEmit);
    if (n === void 0)
      return this.performPullFromUpstream(r);
    this.replaceSubexecutor(new ct(n.childExecutor, r, n.onEmit));
  }
  performPullFromUpstream(e) {
    return Ft(e.upstreamExecutor, (n) => {
      const r = this._closeLastSubstream === void 0 ? y : this._closeLastSubstream;
      return this._closeLastSubstream = void 0, c(this._executeCloseLastSubstream(r), O(n));
    }, (n) => {
      if (this._closeLastSubstream !== void 0) {
        const a = this._closeLastSubstream;
        return this._closeLastSubstream = void 0, c(this._executeCloseLastSubstream(a), k(() => {
          const d = new ge(e.createChild(n), this._providedEnv, this._executeCloseLastSubstream);
          d._input = this._input;
          const [h, p] = this.applyUpstreamPullStrategy(!1, e.activeChildExecutors, e.onPull(Vn(n)));
          this._activeSubexecutor = new ct(d, new _e(e.upstreamExecutor, e.createChild, e.lastDone, p, e.combineChildResults, e.combineWithChildResult, e.onPull, e.onEmit), e.onEmit), Ge(h) && (this._activeSubexecutor = new $t(h.value, this._activeSubexecutor));
        }));
      }
      const r = new ge(e.createChild(n), this._providedEnv, this._executeCloseLastSubstream);
      r._input = this._input;
      const [s, i] = this.applyUpstreamPullStrategy(!1, e.activeChildExecutors, e.onPull(Vn(n)));
      this._activeSubexecutor = new ct(r, new _e(e.upstreamExecutor, e.createChild, e.lastDone, i, e.combineChildResults, e.combineWithChildResult, e.onPull, e.onEmit), e.onEmit), Ge(s) && (this._activeSubexecutor = new $t(s.value, this._activeSubexecutor));
    }, (n) => {
      if (e.activeChildExecutors.some((i) => i !== void 0)) {
        const i = new Ae(e.upstreamExecutor, e.lastDone, [void 0, ...e.activeChildExecutors], e.upstreamExecutor.getDone(), e.combineChildResults, e.combineWithChildResult, e.onPull);
        if (this._closeLastSubstream !== void 0) {
          const a = this._closeLastSubstream;
          return this._closeLastSubstream = void 0, c(this._executeCloseLastSubstream(a), k(() => this.replaceSubexecutor(i)));
        }
        this.replaceSubexecutor(i);
        return;
      }
      const r = this._closeLastSubstream, s = this.finishSubexecutorWithCloseEffect(c(n, ea((i) => e.combineWithChildResult(e.lastDone, i))), () => r, (i) => e.upstreamExecutor.close(i));
      return s === void 0 ? void 0 : (
        // NOTE: assuming finalizers cannot fail
        Qn(s)
      );
    });
  }
  drainChildExecutors(e) {
    if (e.activeChildExecutors.length === 0) {
      const i = this._closeLastSubstream;
      return i !== void 0 && this.addFinalizer(() => A(i)), this.finishSubexecutorWithCloseEffect(e.upstreamDone, () => i, (a) => e.upstreamExecutor.close(a));
    }
    const n = e.activeChildExecutors[0], r = e.activeChildExecutors.slice(1);
    if (n === void 0) {
      const [i, a] = this.applyUpstreamPullStrategy(!0, r, e.onPull(fc(r.reduce((d, h) => h !== void 0 ? d + 1 : d, 0))));
      return this.replaceSubexecutor(new Ae(e.upstreamExecutor, e.lastDone, a, e.upstreamDone, e.combineChildResults, e.combineWithChildResult, e.onPull)), Ge(i) ? (this._emitted = i.value, Rt()) : void 0;
    }
    const s = new Ae(e.upstreamExecutor, e.lastDone, r, e.upstreamDone, e.combineChildResults, e.combineWithChildResult, e.onPull);
    this.replaceSubexecutor(new ct(n.childExecutor, s, n.onEmit));
  }
}
const Tt = (t) => t !== void 0 ? t : y, At = (t, e) => c(pt(t, (n) => x(n(e))), k((n) => c(Ji(n), Yi(() => Xi))), _((n) => R(() => n))), Cn = (t, e, n) => {
  const r = [t], s = () => {
    const i = r.pop();
    if (i === void 0 || i.upstream === void 0)
      return Zi("Unexpected end of input for channel execution");
    const a = i.upstream.run();
    switch (a._tag) {
      case rt: {
        const d = i.onEmit(i.upstream.getEmit());
        return r.length === 0 ? d === void 0 ? R(e) : c(d, Z({
          onFailure: n,
          onSuccess: e
        })) : d === void 0 ? R(() => s()) : c(d, Z({
          onFailure: n,
          onSuccess: () => s()
        }));
      }
      case nt: {
        const d = i.onDone(i.upstream.getDone());
        return r.length === 0 ? d === void 0 ? R(e) : c(d, Z({
          onFailure: n,
          onSuccess: e
        })) : d === void 0 ? R(() => s()) : c(d, Z({
          onFailure: n,
          onSuccess: () => s()
        }));
      }
      case qe:
        return r.push(i), c(i.onEffect(a.effect), Dr((d) => R(() => {
          const h = i.onDone(Q(d));
          return h === void 0 ? y : h;
        })), Z({
          onFailure: n,
          onSuccess: () => s()
        }));
      case st:
        return r.push(i), r.push(a), R(() => s());
    }
  };
  return s();
}, pc = /* @__PURE__ */ f(2, (t, e) => {
  const n = (r, s, i) => Wi(D(() => new ge(t, void 0, Y)), (a) => R(() => dt(a.run(), a).pipe(Vi(r), O(F(r)), Hi(F(s)))), (a, d) => {
    const h = a.close(d);
    return h === void 0 ? y : kr(h, (p) => Ut(i, Ee(p)));
  });
  return Ir((r) => Mi([Ui(e, qi), te(), te()]).pipe(_(([s, i, a]) => r(n(i, a, s)).pipe(Se(e), _((d) => e.addFinalizer((h) => {
    const p = wr(h) ? Bi(h.cause) : void 0;
    return Kt(i).pipe(_((g) => g ? ne(a, void 0).pipe(O(Kr(d)), O(Un(d))) : ne(a, void 0).pipe(O(p && ji(p) > 0 ? ho(d, Qi(p)) : Ce(d)), O(Un(d)))));
  }).pipe(O(r(F(i)))))))));
}), dt = (t, e) => {
  const n = t;
  switch (n._tag) {
    case qe:
      return c(n.effect, _(() => dt(e.run(), e)));
    case rt:
      return dt(e.run(), e);
    case nt:
      return R(() => e.getDone());
    case st:
      return Cn(n, () => dt(e.run(), e), Ee);
  }
}, mc = "Done", _c = "Await", gc = "effect/ChannelMergeDecision", Sc = /* @__PURE__ */ Symbol.for(gc), Ec = {
  [Sc]: {
    _R: (t) => t,
    _E0: (t) => t,
    _Z0: (t) => t,
    _E: (t) => t,
    _Z: (t) => t
  }
}, Hn = (t) => {
  const e = Object.create(Ec);
  return e._tag = _c, e.f = t, e;
}, Is = "BothRunning", ks = "LeftDone", Ds = "RightDone", Cc = "effect/ChannelMergeState", Kn = /* @__PURE__ */ Symbol.for(Cc), bn = {
  [Kn]: Kn
}, Nt = (t, e) => {
  const n = Object.create(bn);
  return n._tag = Is, n.left = t, n.right = e, n;
}, Gn = (t) => {
  const e = Object.create(bn);
  return e._tag = ks, e.f = t, e;
}, Jn = (t) => {
  const e = Object.create(bn);
  return e._tag = Ds, e.f = t, e;
}, Rs = "BackPressure", Fs = "BufferSliding", bc = "effect/ChannelMergeStrategy", Yn = /* @__PURE__ */ Symbol.for(bc), $s = {
  [Yn]: Yn
}, yc = (t) => {
  const e = Object.create($s);
  return e._tag = Rs, e;
}, vc = (t) => {
  const e = Object.create($s);
  return e._tag = Fs, e;
}, Pc = /* @__PURE__ */ f(2, (t, {
  onBackPressure: e,
  onBufferSliding: n
}) => {
  switch (t._tag) {
    case Rs:
      return e();
    case Fs:
      return n();
  }
}), Fe = "Empty", Ve = "Emit", He = "Error", Ke = "Done", Ts = (t) => ({
  _tag: Fe,
  notifyProducer: t
}), Lt = (t) => ({
  _tag: Ve,
  notifyConsumers: t
}), Oc = (t) => ({
  _tag: He,
  cause: t
}), xc = (t) => ({
  _tag: Ke,
  done: t
});
class wc {
  constructor(e) {
    l(this, "ref");
    this.ref = e;
  }
  awaitRead() {
    return Re(Be(this.ref, (e) => e._tag === Fe ? [F(e.notifyProducer), e] : [y, e]));
  }
  get close() {
    return ta((e) => this.error(na(e)));
  }
  done(e) {
    return Re(Be(this.ref, (n) => {
      switch (n._tag) {
        case Fe:
          return [F(n.notifyProducer), n];
        case Ve:
          return [pt(n.notifyConsumers, (r) => ne(r, Xe(e)), {
            discard: !0
          }), xc(e)];
        case He:
          return [Oe, n];
        case Ke:
          return [Oe, n];
      }
    }));
  }
  emit(e) {
    return _(te(), (n) => Re(Be(this.ref, (r) => {
      switch (r._tag) {
        case Fe:
          return [F(r.notifyProducer), r];
        case Ve: {
          const s = r.notifyConsumers[0], i = r.notifyConsumers.slice(1);
          if (s !== void 0)
            return [ne(s, mt(e)), i.length === 0 ? Ts(n) : Lt(i)];
          throw new Error("Bug: Channel.SingleProducerAsyncInput.emit - Queue was empty! please report an issue at https://github.com/Effect-TS/effect/issues");
        }
        case He:
          return [Oe, r];
        case Ke:
          return [Oe, r];
      }
    })));
  }
  error(e) {
    return Re(Be(this.ref, (n) => {
      switch (n._tag) {
        case Fe:
          return [F(n.notifyProducer), n];
        case Ve:
          return [pt(n.notifyConsumers, (r) => Ga(r, e), {
            discard: !0
          }), Oc(e)];
        case He:
          return [Oe, n];
        case Ke:
          return [Oe, n];
      }
    }));
  }
  get take() {
    return this.takeWith((e) => Q(ra(e, Xe)), (e) => K(e), (e) => sa(mt(e)));
  }
  takeWith(e, n, r) {
    return _(te(), (s) => Re(Be(this.ref, (i) => {
      switch (i._tag) {
        case Fe:
          return [O(ne(i.notifyProducer, void 0), jt(F(s), {
            onFailure: e,
            onSuccess: G({
              onLeft: r,
              onRight: n
            })
          })), Lt([s])];
        case Ve:
          return [jt(F(s), {
            onFailure: e,
            onSuccess: G({
              onLeft: r,
              onRight: n
            })
          }), Lt([...i.notifyConsumers, s])];
        case He:
          return [A(e(i.cause)), i];
        case Ke:
          return [A(r(i.done)), i];
      }
    })));
  }
}
const As = () => c(te(), _((t) => Vr(Ts(t))), k((t) => new wc(t))), Ic = /* @__PURE__ */ f(2, (t, e) => vn(t, () => e)), Zt = /* @__PURE__ */ f(2, (t, e) => nc(t, e, () => {
}, () => {
})), kc = (t) => {
  const e = Sn({
    onInput: () => e,
    onFailure: V,
    onDone: vs
  });
  return J(t, e);
}, Dc = /* @__PURE__ */ f(2, (t, e) => rc(t, () => e)), Rc = (t) => w(t, Y), yn = (t) => he(t.takeWith(V, (e) => w($(e), () => yn(t)), vs)), vn = /* @__PURE__ */ f(2, (t, e) => w(t, (n) => Ps(() => e(n)))), Fc = /* @__PURE__ */ f(2, (t, e) => {
  const n = gn({
    onInput: (r) => w($(e(r)), () => n),
    onFailure: Pt,
    onDone: ve
  });
  return J(t, n);
}), $c = (t) => (e) => Tc(t)(e, ua), Tc = ({
  bufferSize: t = 16,
  concurrency: e,
  mergeStrategy: n = yc()
}) => (r, s) => zs((i) => ut(function* () {
  const a = e === "unbounded" ? Number.MAX_SAFE_INTEGER : e, d = yield* As(), h = yn(d), p = yield* zo(t);
  yield* Ut(i, Wn(p));
  const g = yield* Mo();
  yield* Ut(i, Wn(g));
  const C = yield* Vr(fe()), M = yield* te(), U = (yield* pa(a)).withPermits, W = yield* Je(J(h, r), i);
  function q(b) {
    return b.pipe(_(G({
      onLeft: (m) => A(le(m)),
      onRight: (m) => Dt(xe(p, A(mt(m))), fe())
    })), Tn({
      until: (m) => Ge(m)
    }), _((m) => ao(C, Me({
      onNone: () => le(m.value),
      onSome: (I) => le(s(I, m.value))
    }))), Dr((m) => _a(m) ? Ee(m) : xe(p, Ee(m)).pipe(O(ne(M, void 0)), ga)));
  }
  yield* W.pipe(Z({
    onFailure: (b) => xe(p, Ee(b)).pipe(O(A(!1))),
    onSuccess: G({
      onLeft: (b) => Fr(j(F(M)), j(U(a)(y)), {
        onSelfDone: (m, I) => Dt(Ce(I), !1),
        onOtherDone: (m, I) => O(Ce(I), io(C).pipe(_(Me({
          onNone: () => xe(p, A(Xe(b))),
          onSome: (at) => xe(p, A(Xe(s(at, b))))
        })), Dt(!1)))
      }),
      onRight: (b) => Pc(n, {
        onBackPressure: () => ut(function* () {
          const m = yield* te(), I = Qt((xt) => Je(J(h, b), xt).pipe(_((In) => kt(x(q(In)), x(j(F(M))))), _(Y)));
          return yield* ne(m, void 0).pipe(O(I), U(1), Se(i)), yield* F(m), !(yield* Kt(M));
        }),
        onBufferSliding: () => ut(function* () {
          const m = yield* te(), I = yield* te(), at = yield* Uo(g);
          yield* Bn(g).pipe(_((wt) => ne(wt, void 0)), ma(() => at >= a)), yield* xe(g, m);
          const xt = Qt((wt) => Je(J(h, b), wt).pipe(_((li) => x(q(li)).pipe(kt(x(j(F(M)))), kt(x(j(F(m)))))), _(Y)));
          return yield* ne(I, void 0).pipe(O(xt), U(1), Se(i)), yield* F(I), !(yield* Kt(M));
        })
      })
    })
  }), Tn({
    while: (b) => b
  }), Se(i));
  const pe = c(Bn(p), Re, jt({
    onFailure: V,
    onSuccess: G({
      onLeft: ve,
      onRight: (b) => w($(b), () => pe)
    })
  }), he);
  return ys(pe, d);
})), Ns = /* @__PURE__ */ f(3, (t, e, n) => $c(n)(Fc(t, e))), Ac = /* @__PURE__ */ f(2, (t, e) => {
  function n(r) {
    return ut(function* () {
      const s = yield* As(), i = yn(s), a = yield* Je(J(i, t), r), d = yield* Je(J(i, e.other), r);
      function h(g, C, M) {
        return (U, W, q) => {
          function pe(b) {
            const m = b;
            return m._tag === mc ? A(z(O(Ce(C), m.effect))) : k(Kr(C), ee({
              onFailure: (I) => z(m.f(Q(I))),
              onSuccess: G({
                onLeft: (I) => z(m.f(K(I))),
                onRight: (I) => qs($(I), p(q(m.f)))
              })
            }));
          }
          return ee(g, {
            onFailure: (b) => pe(U(Q(b))),
            onSuccess: G({
              onLeft: (b) => pe(U(K(b))),
              onRight: (b) => A(w($(b), () => w(z(Se(j(M), r)), (m) => p(W(m, C)))))
            })
          });
        };
      }
      function p(g) {
        switch (g._tag) {
          case Is: {
            const C = j(qn(g.left)), M = j(qn(g.right));
            return he(Fr(C, M, {
              onSelfDone: (U, W) => O(Ce(W), h(U, g.right, a)(e.onSelfDone, Nt, (q) => Gn(q))),
              onOtherDone: (U, W) => O(Ce(W), h(U, g.left, d)(e.onOtherDone, (q, pe) => Nt(pe, q), (q) => Jn(q)))
            }));
          }
          case ks:
            return he(k(x(d), ee({
              onFailure: (C) => z(g.f(Q(C))),
              onSuccess: G({
                onLeft: (C) => z(g.f(K(C))),
                onRight: (C) => w($(C), () => p(Gn(g.f)))
              })
            })));
          case Ds:
            return he(k(x(a), ee({
              onFailure: (C) => z(g.f(Q(C))),
              onSuccess: G({
                onLeft: (C) => z(g.f(K(C))),
                onRight: (C) => w($(C), () => p(Jn(g.f)))
              })
            })));
        }
      }
      return z($n((g) => {
        const C = $n((W) => (W.transferChildren(g.scope()), y)), M = j(a).pipe($e(C), Se(r)), U = j(d).pipe($e(C), Se(r));
        return yt(M, U, (W, q) => Nt(W, q));
      })).pipe(w(p), ys(s));
    });
  }
  return zs(n);
}), Nc = /* @__PURE__ */ f(2, (t, e) => En(() => {
  let n;
  const r = gn({
    onInput: (i) => w($(i), () => r),
    onFailure: (i) => (n = Wc(i), V(Wt(n))),
    onDone: ve
  }), s = Sn({
    onInput: (i) => c($(i), w(() => s)),
    onFailure: (i) => ia(i) && Bc(i.defect) && aa(i.defect, n) ? Pt(i.defect.error) : V(i),
    onDone: ve
  });
  return J(J(J(t, r), e), s);
})), Lc = (t) => Qt((e) => pc(t, e)), zc = (t) => Lc(kc(t)), Ls = (t) => he(Ir((e) => k(oa(), (n) => tc(kr(e(ca(t, n)), (r) => Rn(n, Q(r))), (r, s) => Rn(n, s))))), Mc = (t) => Uc(k(la, (e) => w(z(t(e)), $))), Je = /* @__PURE__ */ f(2, (t, e) => Bt(D(() => new ge(t, void 0, Y)), da()).pipe(ha(([n, r]) => fa(e, (s) => {
  const i = n.close(s);
  return i !== void 0 ? qt(i, r) : y;
})), Qe, k(([n]) => R(() => en(n.run(), n))))), en = (t, e) => {
  const n = t;
  switch (n._tag) {
    case nt:
      return ee(e.getDone(), {
        onFailure: Ee,
        onSuccess: (r) => A(Xe(r))
      });
    case rt:
      return A(mt(e.getEmit()));
    case qe:
      return c(n.effect, _(() => en(e.run(), e)));
    case st:
      return Cn(n, () => en(e.run(), e), (r) => Ee(r));
  }
}, he = (t) => Rc(z(t)), Uc = (t) => bs(Ls(t), (e, n) => e, (e, n) => e), zs = (t) => bs(Mc(t), (e, n) => e, (e, n) => e), Ms = (t) => Us(0, t.length, t), Us = (t, e, n) => t === e ? tt : c($(c(n, Rr(t))), w(() => Us(t + 1, e, n))), qc = /* @__PURE__ */ f((t) => Cs(t[1]), (t, e, n) => n != null && n.concurrent ? Ac(t, {
  other: e,
  onSelfDone: (r) => Hn((s) => R(() => Fn(r, s))),
  onOtherDone: (r) => Hn((s) => R(() => Fn(s, r)))
}) : w(t, (r) => vn(e, (s) => [r, s]))), qs = /* @__PURE__ */ f((t) => Cs(t[1]), (t, e, n) => n != null && n.concurrent ? vn(qc(t, e, {
  concurrent: !0
}), (r) => r[1]) : w(t, () => e)), tn = /* @__PURE__ */ Symbol.for("effect/Channel/ChannelException"), Wc = (t) => ({
  _tag: "ChannelException",
  [tn]: tn,
  error: t
}), Bc = (t) => rn(t, tn), jc = /* @__PURE__ */ Symbol.for("effect/Sink"), Qc = {
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
};
var hr;
hr = jc;
class Pn {
  constructor(e) {
    l(this, "channel");
    l(this, hr, Qc);
    this.channel = e;
  }
  pipe() {
    return Ue(this, arguments);
  }
}
const Vc = (t) => new Pn(En(() => On(t()))), Hc = (t, e, n) => Vc(() => new Pn(Ws(t, e, n))), Ws = (t, e, n) => e(t) ? gn({
  onInput: (r) => {
    const [s, i] = Bs(t, r, e, n, 0, r.length);
    return Sa(i) ? c($(i), Ic(s)) : Ws(s, e, n);
  },
  onFailure: Pt,
  onDone: () => ve(t)
}) : ve(t), Bs = (t, e, n, r, s, i) => {
  if (s === i)
    return [t, bt()];
  const a = r(t, c(e, Rr(s)));
  return n(a) ? Bs(a, e, n, r, s + 1, i) : [a, c(e, Ea(s + 1))];
}, Kc = (t) => new Pn(z(t)), On = (t) => et(t) ? On(Kc(t)) : t.channel, Gc = "effect/Stream", js = /* @__PURE__ */ Symbol.for(Gc), Jc = {
  _R: (t) => t,
  _E: (t) => t,
  _A: (t) => t
};
var fr;
fr = js;
class Pe {
  constructor(e) {
    l(this, "channel");
    l(this, fr, Jc);
    this.channel = e;
  }
  pipe() {
    return Ue(this, arguments);
  }
}
const Qs = (t) => rn(t, js) || et(t), Yc = /* @__PURE__ */ f((t) => Qs(t[0]), (t, e, n) => {
  const r = (n == null ? void 0 : n.bufferSize) ?? 16;
  return n != null && n.switch ? Xn(n == null ? void 0 : n.concurrency, () => Zn(t, 1, r, e), (s) => Zn(t, s, r, e)) : Xn(n == null ? void 0 : n.concurrency, () => new Pe(Zt(re(t), (s) => c(s, xa((i) => re(e(i))), Oa(tt, (i, a) => c(i, qs(a)))))), (s) => new Pe(c(re(t), Zt(Ms), Ns((i) => re(e(i)), n))));
}), Xn = (t, e, n) => {
  switch (t) {
    case void 0:
      return e();
    case "unbounded":
      return n(Number.MAX_SAFE_INTEGER);
    default:
      return t > 1 ? n(t) : e();
  }
}, Zn = /* @__PURE__ */ f(4, (t, e, n, r) => new Pe(c(re(t), Zt(Ms), Ns((s) => re(r(s)), {
  concurrency: e,
  mergeStrategy: vc(),
  bufferSize: n
})))), Xc = /* @__PURE__ */ f((t) => Qs(t[0]), (t, e) => Yc(t, Y, e)), Zc = (t, e) => c(Ca(D(() => t[Symbol.asyncIterator]()), (n) => n.return ? ba(async () => n.return()) : y), k((n) => ru(c(Vt({
  try: async () => n.next(),
  catch: (r) => le(e(r))
}), _((r) => r.done ? sn(fe()) : A(r.value))))), lu), re = (t) => {
  if ("channel" in t)
    return t.channel;
  if (et(t))
    return re(eu(t));
  throw new TypeError("Expected a Stream.");
}, eu = (t) => c(t, va(le), tu), tu = (t) => new Pe(he(Pa(t, {
  onFailure: Me({
    onNone: () => tt,
    onSome: Pt
  }),
  onSuccess: (e) => $(an(e))
}))), nu = (t) => uu(t, (e) => c(k(e, (n) => le([n, e])), wa(Me({
  onNone: () => A(fe()),
  onSome: sn
})))), ru = (t) => nu(c(t, k(an))), su = /* @__PURE__ */ f(2, (t, e) => re(t).pipe(Nc(On(e)), zc)), iu = /* @__PURE__ */ f(3, (t, e, n) => au(t, e, ya, n)), au = /* @__PURE__ */ f(4, (t, e, n, r) => su(t, Hc(e, n, r))), ou = (t) => new Pe(Dc(Ls(c(t, k(an))), y)), cu = (t) => new Pe(En(() => re(t()))), uu = (t, e) => cu(() => {
  const n = (r) => he(k(e(r), Me({
    onNone: () => tt,
    onSome: ([s, i]) => w($(s), () => n(i))
  })));
  return new Pe(n(t));
}), lu = (t) => Xc(ou(t)), du = Zc, hu = iu, Vs = N(
  "Resource",
  "BackboneElement",
  "Reference",
  "Extension",
  "System.String",
  "positiveInt",
  "string",
  "boolean",
  "Period",
  "Identifier",
  "uri",
  "code",
  "Meta",
  "Narrative",
  "CodeableConcept",
  "date",
  "ContactDetail",
  "markdown",
  "dateTime",
  "Dosage",
  "Expression",
  "canonical",
  "Quantity",
  "RelatedArtifact",
  "Age",
  "Duration",
  "Range",
  "Timing",
  "UsageContext",
  "decimal",
  "Annotation",
  "instant",
  "unsignedInt",
  "base64Binary",
  "url",
  "Coding",
  "integer",
  "Attachment",
  "Signature",
  "ContactPoint",
  "Money",
  "Address",
  "time",
  "Element",
  "ProdCharacteristic",
  "ProductShelfLife",
  "Ratio",
  "id",
  "Contributor",
  "Count",
  "DataRequirement",
  "Distance",
  "HumanName",
  "oid",
  "ParameterDefinition",
  "SampledData",
  "TriggerDefinition",
  "uuid",
  "MarketingStatus",
  "Population",
  "xhtml",
  "ElementDefinition",
  "SubstanceAmount",
  "System.Boolean",
  "System.Date",
  "System.DateTime",
  "System.Decimal",
  "System.Integer",
  "System.Time"
), fu = (t) => typeof t == "string" && Vs.literals.includes(t), pu = N(
  "0.01",
  "0.05",
  "0.06",
  "0.11",
  "0.0",
  "0.0.80",
  "0.0.81",
  "0.0.82",
  "0.4",
  "0.4.0",
  "0.5",
  "0.5.0",
  "1.0",
  "1.0.0",
  "1.0.1",
  "1.0.2",
  "1.1",
  "1.1.0",
  "1.4",
  "1.4.0",
  "1.6",
  "1.6.0",
  "1.8",
  "1.8.0",
  "3.0",
  "3.0.0",
  "3.0.1",
  "3.0.2",
  "3.3",
  "3.3.0",
  "3.5",
  "3.5.0",
  "4.0",
  "4.0.0",
  "4.0.1",
  "4.1",
  "4.1.0",
  "4.2",
  "4.2.0",
  "4.3",
  "4.3.0",
  "4.3.0-cibuild",
  "4.3.0-snapshot1",
  "4.4",
  "4.4.0",
  "4.5",
  "4.5.0",
  "4.6",
  "4.6.0",
  "5.0",
  "5.0.0",
  "5.0.0-cibuild",
  "5.0.0-snapshot1",
  "5.0.0-snapshot2",
  "5.0.0-ballot",
  "5.0.0-snapshot3",
  "5.0.0-draft-final"
);
N(
  "Account",
  "ActivityDefinition",
  "AdverseEvent",
  "AllergyIntolerance",
  "Appointment",
  "AppointmentResponse",
  "AuditEvent",
  "Basic",
  "Binary",
  "BiologicallyDerivedProduct",
  "BodyStructure",
  "Bundle",
  "CapabilityStatement",
  "CarePlan",
  "CareTeam",
  "CatalogEntry",
  "ChargeItem",
  "ChargeItemDefinition",
  "Claim",
  "ClaimResponse",
  "ClinicalImpression",
  "CodeSystem",
  "Communication",
  "CommunicationRequest",
  "CompartmentDefinition",
  "Composition",
  "ConceptMap",
  "Condition",
  "Consent",
  "Contract",
  "Coverage",
  "CoverageEligibilityRequest",
  "CoverageEligibilityResponse",
  "DetectedIssue",
  "Device",
  "DeviceDefinition",
  "DeviceMetric",
  "DeviceRequest",
  "DeviceUseStatement",
  "DiagnosticReport",
  "DocumentManifest",
  "DocumentReference",
  "DomainResource",
  "EffectEvidenceSynthesis",
  "Encounter",
  "Endpoint",
  "EnrollmentRequest",
  "EnrollmentResponse",
  "EpisodeOfCare",
  "EventDefinition",
  "Evidence",
  "EvidenceVariable",
  "ExampleScenario",
  "ExplanationOfBenefit",
  "FamilyMemberHistory",
  "Flag",
  "Goal",
  "GraphDefinition",
  "Group",
  "GuidanceResponse",
  "HealthcareService",
  "ImagingStudy",
  "Immunization",
  "ImmunizationEvaluation",
  "ImmunizationRecommendation",
  "ImplementationGuide",
  "InsurancePlan",
  "Invoice",
  "Library",
  "Linkage",
  "List",
  "Location",
  "Measure",
  "MeasureReport",
  "Media",
  "Medication",
  "MedicationAdministration",
  "MedicationDispense",
  "MedicationKnowledge",
  "MedicationRequest",
  "MedicationStatement",
  "MedicinalProduct",
  "MedicinalProductAuthorization",
  "MedicinalProductContraindication",
  "MedicinalProductIndication",
  "MedicinalProductIngredient",
  "MedicinalProductInteraction",
  "MedicinalProductManufactured",
  "MedicinalProductPackaged",
  "MedicinalProductPharmaceutical",
  "MedicinalProductUndesirableEffect",
  "MessageDefinition",
  "MessageHeader",
  "MetadataResource",
  "MolecularSequence",
  "NamingSystem",
  "NutritionOrder",
  "Observation",
  "ObservationDefinition",
  "OperationDefinition",
  "OperationOutcome",
  "Organization",
  "OrganizationAffiliation",
  "Parameters",
  "Patient",
  "PaymentNotice",
  "PaymentReconciliation",
  "Person",
  "PlanDefinition",
  "Practitioner",
  "PractitionerRole",
  "Procedure",
  "Provenance",
  "Questionnaire",
  "QuestionnaireResponse",
  "RelatedPerson",
  "RequestGroup",
  "ResearchDefinition",
  "ResearchElementDefinition",
  "ResearchStudy",
  "ResearchSubject",
  "RiskAssessment",
  "RiskEvidenceSynthesis",
  "Schedule",
  "SearchParameter",
  "ServiceRequest",
  "Slot",
  "Specimen",
  "SpecimenDefinition",
  "StructureDefinition",
  "StructureMap",
  "Subscription",
  "Substance",
  "SubstanceNucleicAcid",
  "SubstancePolymer",
  "SubstanceProtein",
  "SubstanceReferenceInformation",
  "SubstanceSourceMaterial",
  "SubstanceSpecification",
  "SupplyDelivery",
  "SupplyRequest",
  "Task",
  "TerminologyCapabilities",
  "TestReport",
  "TestScript",
  "ValueSet",
  "VerificationResult",
  "VisionPrescription"
);
const Hs = N(
  "base64Binary",
  "boolean",
  "canonical",
  "code",
  "date",
  "dateTime",
  "decimal",
  "id",
  "instant",
  "integer",
  "oid",
  "string",
  "positiveInt",
  "time",
  "unsignedInt",
  "uri",
  "url",
  "uuid"
), mu = N(
  ...Hs.literals.map((t) => Hr(t))
);
$r(N("value"), mu);
const Ks = (t) => `value${Hr(t)}`;
Hs.literals.map(Ks);
function _u(t) {
  return c(
    t,
    Object.keys,
    Ar((e) => e.startsWith("value"))
  );
}
function gu(t) {
  return c(
    t,
    lo("value", ""),
    uo
  );
}
const Su = u, Eu = vt, Cu = u, bu = u, yu = u, vu = u, Pu = Tr, Ou = u, xu = u, wu = Ra, Iu = u, ku = u, Gs = Ia.pipe(ka()), Du = u, Ru = Da, Fu = u, $u = u, Tu = u, o = on, Js = E({
  start: o(u, { exact: !0 }),
  end: o(u, { exact: !0 })
}), St = E({
  system: o(u, { exact: !0 }),
  version: o(u, { exact: !0 }),
  code: o(u, { exact: !0 }),
  display: o(u, { exact: !0 }),
  userSelected: o(vt, { exact: !0 })
}), Ys = E({
  text: on(u, { exact: !0 }),
  coding: o(S(St), { exact: !0 })
}), Et = E({
  value: o(Tr, { exact: !0 }),
  comparator: o(N(">", "<=", ">=", ">"), { exact: !0 }),
  unit: o(u, { exact: !0 }),
  system: o(u, { exact: !0 }),
  code: o(u, { exact: !0 })
});
Et.pick("value", "unit");
const Au = E({
  low: o(Et.pick("value", "unit"), { exact: !0 }),
  high: o(Et.pick("value", "unit"), { exact: !0 })
}), Nu = E({
  system: o(
    N("phone", "fax", "email", "pager", "url", "sms", "other"),
    { exact: !0 }
  ),
  value: o(u, { exact: !0 }),
  use: o(N("home", "work", "temp", "old", "mobile"), {
    exact: !0
  }),
  rank: o(Gs, { exact: !0 }),
  period: o(Js, { exact: !0 })
}), Lu = E({
  name: o(u, { exact: !0 }),
  telecom: o(S(Nu), { exact: !0 })
}), zu = E({
  versionId: o(u, { exact: !0 }),
  lastUpdated: o(u, { exact: !0 }),
  source: o(u, { exact: !0 }),
  profile: o(S(u), { exact: !0 }),
  security: o(S(St), { exact: !0 }),
  tag: o(S(St), { exact: !0 })
}), Xs = E({
  use: on(
    N("usual", "official", "temp", "secondary", "old"),
    { exact: !0 }
  ),
  type: o(Ys, { exact: !0 }),
  system: o(u, { exact: !0 }),
  value: o(u, { exact: !0 }),
  period: o(Js, { exact: !0 }),
  assigner: o(
    ue(() => Zs),
    { exact: !0 }
  )
}), Mu = Xs, Zs = E({
  reference: o(u, { exact: !0 }),
  type: o(u, { exact: !0 }),
  identifier: o(
    ue(() => Xs),
    { exact: !0 }
  ),
  display: o(u, { exact: !0 })
}), Uu = E({
  code: St,
  valueCodeableConcept: o(Ys, { exact: !0 }),
  valueQuantity: o(Et, { exact: !0 }),
  valueRange: o(Au, { exact: !0 }),
  valueReference: o(Zs, { exact: !0 })
}), qu = E({
  name: u,
  value: u
}), Wu = E({
  path: u,
  name: u,
  description: o(u, { exact: !0 }),
  collection: o(vt, { exact: !0, default: () => !1 }),
  type: o(u, { exact: !0 }),
  tags: o(S(qu), { exact: !0, default: () => [] })
}), xn = Wu, ei = E({
  path: u,
  description: o(u, { exact: !0 })
}), nn = E({
  column: o(S(xn), {
    exact: !0
  }),
  select: o(
    S(
      ue(
        () => nn
      )
    ),
    { exact: !0 }
  ),
  forEach: o(u, { exact: !0 }),
  forEachOrNull: o(u, { exact: !0 }),
  unionAll: o(
    S(
      ue(
        () => nn
      )
    ),
    { exact: !0 }
  )
}), ti = nn, ni = E({
  name: u,
  valueBase64Binary: o(Su, { exact: !0 }),
  valueBoolean: o(Eu, { exact: !0 }),
  valueCanonical: o(Cu, { exact: !0 }),
  valueCode: o(bu, { exact: !0 }),
  valueDate: o(yu, { exact: !0 }),
  valueDateTime: o(vu, { exact: !0 }),
  valueDecimal: o(Pu, { exact: !0 }),
  valueId: o(Ou, { exact: !0 }),
  valueInstant: o(xu, { exact: !0 }),
  valueInteger: o(wu, { exact: !0 }),
  valueOid: o(Iu, { exact: !0 }),
  valuePositiveInt: o(Gs, { exact: !0 }),
  valueString: o(ku, { exact: !0 }),
  valueTime: o(Du, { exact: !0 }),
  valueUnsignedInt: o(Ru, { exact: !0 }),
  valueUri: o(Fu, { exact: !0 }),
  valueUrl: o($u, { exact: !0 }),
  valueUuid: o(Tu, { exact: !0 })
}), ri = ni, Bu = E({
  status: N("draft", "active", "retired", "unknown"),
  url: o(u, { exact: !0 }),
  identifier: o(S(Mu), { exact: !0 }),
  name: o(u, { exact: !0 }),
  title: o(u, { exact: !0 }),
  meta: o(zu, { exact: !0 }),
  experimental: o(vt, { exact: !0 }),
  publisher: o(u, { exact: !0 }),
  contact: o(S(Lu), { exact: !0 }),
  description: o(u, { exact: !0 }),
  useContext: o(Uu, { exact: !0 }),
  copyright: o(u, { exact: !0 }),
  resource: u,
  fhirVersion: o(pu, { exact: !0 }),
  constant: o(S(ni), {
    exact: !0
  }),
  where: o(S(ei), { exact: !0 }),
  select: Nr(ti)
}), it = Bu;
Fa(it);
cn(it);
un($a(it));
const ju = E(
  {
    resourceType: u
  },
  { key: u, value: Ta }
), Qu = ju, Vu = E({
  name: N("sql"),
  value: ln(
    N("NOT NULL"),
    $r("REFERENCES ", u)
  )
}), si = Vu, Hu = un(si), Ku = xn.pipe(
  ye,
  Lr("path", "name", "collection"),
  zr
).pipe(
  Mr(
    E({
      type: Vs,
      tags: S(si)
    })
  )
), Gu = Ku, Ju = dn(
  ye(xn),
  Gu,
  {
    strict: !0,
    decode: ({ tags: t, type: e, ...n }) => c(
      t,
      Na((r) => Hu(r)),
      Aa((r, s) => r.value === s.value),
      (r) => ({
        ...n,
        tags: r,
        type: fu(e) ? e : "System.String"
      })
    ),
    encode: Y
  }
), ii = Ju, Ie = Ur(ii), { Select: me, Column: ke, ForEach: er, ForEachOrNull: tr, UnionAll: De, $match: fl } = La(), Ne = ln(
  We("Column", {
    column: S(ye(ii))
  }),
  We("Select", {
    select: S(ue(() => Ne))
  }),
  We("ForEach", {
    forEach: u,
    select: S(ue(() => Ne))
  }),
  We("ForEachOrNull", {
    forEachOrNull: u,
    select: S(ue(() => Ne))
  }),
  We("UnionAll", {
    unionAll: S(ue(() => Ne))
  })
);
function P(t) {
  return qa(t).pipe(
    se(
      {
        forEach: ot,
        forEachOrNull: ot
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(t, null, 2)}`
        );
      }
    ),
    se(
      {
        forEach: ot
      },
      ({ forEach: e, select: n = [], unionAll: r, column: s }) => er({
        forEach: e,
        select: [
          ...r ? [
            De({
              unionAll: r.map(
                (i) => P(i)
              )
            })
          ] : [],
          ...s ? [
            ke({
              column: oe(
                s,
                (i) => Ie(
                  i
                )
              )
            })
          ] : [],
          ...n.map(P)
        ]
      })
    ),
    se(
      {
        forEachOrNull: ot
      },
      ({ forEachOrNull: e, select: n = [], unionAll: r, column: s }) => tr({
        forEachOrNull: e,
        select: [
          ...r ? [
            De({
              unionAll: r.map(
                (i) => P(i)
              )
            })
          ] : [],
          ...s ? [
            ke({
              column: oe(
                s,
                (i) => Ie(
                  i
                )
              )
            })
          ] : [],
          ...n.map(P)
        ]
      })
    ),
    se(
      {
        column: H,
        select: H,
        unionAll: H
      },
      ({ column: e = [], select: n = [], unionAll: r = [] }) => me({
        select: [
          De({
            unionAll: r.map(P)
          }),
          ke({
            column: oe(
              e,
              (s) => Ie(s)
            )
          }),
          ...n.map(P)
        ]
      })
    ),
    se(
      {
        unionAll: H,
        select: H
      },
      ({ unionAll: e = [], select: n = [] }) => me({
        select: [
          De({
            unionAll: e.map(P)
          }),
          ...n.map(P)
        ]
      })
    ),
    se(
      {
        select: H,
        column: H
      },
      ({ select: e = [], column: n = [] }) => me({
        select: [
          ke({
            column: oe(
              n,
              (r) => Ie(r)
            )
          }),
          ...e.map(P)
        ]
      })
    ),
    se(
      {
        column: H,
        unionAll: H
      },
      ({ column: e = [], unionAll: n = [], select: r = [] }) => me({
        select: [
          ke({
            column: oe(
              e,
              (s) => Ie(s)
            )
          }),
          De({
            unionAll: n.map(P)
          }),
          ...r.map(P)
        ]
      })
    ),
    se(
      {
        select: H
      },
      ({ select: e = [] }) => me({
        select: e.map(P)
      })
    ),
    Wa((e) => {
      var n, r;
      return e.unionAll ? De({
        unionAll: e.unionAll.map(P)
      }) : e.column ? ke({
        column: oe(
          e.column,
          (s) => Ie(s)
        )
      }) : e.forEach ? er({
        forEach: e.forEach,
        select: ((n = e.select) == null ? void 0 : n.map(P)) ?? []
      }) : e.forEachOrNull ? tr({
        forEachOrNull: e.forEachOrNull,
        select: ((r = e.select) == null ? void 0 : r.map(P)) ?? []
      }) : e.select ? me({
        select: e.select.map(P)
      }) : me({
        select: []
      });
    })
  );
}
const Yu = dn(ti, Ne, {
  strict: !0,
  encode: ({ _tag: t, ...e }) => e,
  decode: (t) => P(t)
}), Xu = cn(Yu), v = (t) => ri.pipe(
  Lr(Ks(t), "name"),
  zr,
  Ba("_tag", t)
), Zu = ln(
  v("boolean"),
  v("base64Binary"),
  v("canonical"),
  v("code"),
  v("date"),
  v("dateTime"),
  v("decimal"),
  v("id"),
  v("instant"),
  v("integer"),
  v("oid"),
  v("string"),
  v("positiveInt"),
  v("time"),
  v("unsignedInt"),
  v("uri"),
  v("url"),
  v("uuid")
), wn = ri.pipe(
  (t) => za(
    ye(t),
    ye(Zu),
    {
      strict: !0,
      decode: (e, n, r) => c(
        e,
        _u,
        Me({
          onNone: () => Nn(
            new Ln(
              r,
              e,
              "Failed to extract at least 1 value[x] key"
            )
          ),
          onSome: (s) => {
            if (e[s] === void 0)
              return Nn(
                new Ln(
                  r,
                  e,
                  "data[value[x]] present with undefined value"
                )
              );
            const i = {
              _tag: gu(s),
              name: e.name,
              [s]: e[s]
            };
            return An(i);
          }
        })
      ),
      encode: ({ _tag: e, ...n }) => An(n)
    }
  )
), el = Ur(wn);
qr(wn);
const tl = it.pipe(
  // strip the fields we are transforming from the Data type
  Ma("constant", "select", "where", "name"),
  // A ViewDefinition is every a Node is and more.
  // namely it has a NonEmpty Select + is the only node
  // allowed to have a 'where' clause
  Mr(
    E({
      _tag: Wr("Select"),
      select: Nr(Ne),
      constant: S(wn),
      where: S(ei),
      name: u
    })
  )
), nl = dn(
  ye(it),
  ye(tl),
  {
    strict: !0,
    decode: ({ name: t, where: e, constant: n, select: r, ...s }) => ({
      ...s,
      _tag: "Select",
      name: t ?? s.resource,
      select: Ua(r, (i) => Xu(i)),
      constant: oe(
        n ?? [],
        (i) => el(i)
      ),
      where: e ?? []
    }),
    encode: ({ _tag: t, ...e }) => e
  }
), ai = nl;
qr(ai);
cn(ai);
const rl = E({
  relation: u,
  url: u
}), oi = rl, sl = E({
  fullUrl: o(u, { exact: !0 }),
  link: o(S(oi), { exact: !0 }),
  resource: o(Qu, { exact: !0 })
}), il = sl;
N(
  "document",
  "message",
  "transaction",
  "transaction-response",
  "batch",
  "batch-response",
  "history",
  "searchset",
  "collection",
  "subscription-notification"
);
const ci = E({
  resourceType: Wr("Bundle"),
  link: o(S(oi), { exact: !0, default: () => [] }),
  entry: o(S(il), { exact: !0, default: () => [] })
}), ui = ci;
ci.make;
const al = ja(ui);
un(ui);
class ol extends Qa("Data") {
}
const nr = (t) => Ar(t.link, (e) => e.relation === "next").pipe(
  Ka((e) => e.url)
), rr = (t) => Vt(() => fetch(t)).pipe(
  _(
    (e) => e.ok ? Vt(() => e.json()) : sn(
      new Error(`Response not ok! Status: ${e.status}`)
    )
  ),
  _(al)
), cl = (t, e) => async function* (n, r) {
  const s = n < 0 ? 1 / 0 : n;
  let i = 0;
  const a = await Ht(
    rr(`${t}/${e}?_count=${r}`)
  );
  yield a, i += a.entry.length;
  let d = nr(a);
  for (; Ge(d) && i < s; ) {
    const h = Ha(d), p = await Ht(rr(h));
    yield p, i++, d = nr(p);
  }
}, ul = (t, e, n = 100, r = 250) => du(
  cl(t, e)(n, r),
  (s) => new ol({ message: String(s) })
), ll = (t) => t.pipe(
  hu(
    [],
    (e, n) => c(
      n.entry,
      oe(
        (r) => r.resource !== void 0 ? le(r.resource) : fe()
      ),
      (r) => Va(e, r)
    )
  )
);
async function pl(...t) {
  return c(ul(...t), ll, Ht);
}
export {
  gl as column,
  Sl as columnPath,
  El as forEach,
  Cl as forEachOrNull,
  bl as normalize,
  pl as pagen,
  yl as select,
  xl as sof,
  vl as unionAll,
  Pl as viewDefinition
};
