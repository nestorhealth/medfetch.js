var rs = Object.defineProperty;
var us = (f, C, y) => C in f ? rs(f, C, { enumerable: !0, configurable: !0, writable: !0, value: y }) : f[C] = y;
var se = (f, C, y) => us(f, typeof C != "symbol" ? C + "" : C, y);
import { a as as, f as os, $ as cs, m as Pn, b as Fn, r as qn, p as fs, S as et, v as ms, w as Le, o as hs } from "./view-DiXEnqXw.mjs";
const ds = /* @__PURE__ */ as(3, (f, C, y) => ({
  ...f,
  [C]: y
}));
var Dn = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
const ps = "3.17.1", gs = {
  version: ps
};
var re = {}, xe = {}, tt, Bn;
function oe() {
  if (Bn) return tt;
  Bn = 1;
  function f(m) {
    return m === null ? "null" : m;
  }
  function C(m) {
    return Array.isArray(m) ? "[" + m.map(f).join(", ") + "]" : "null";
  }
  String.prototype.seed = String.prototype.seed || Math.round(Math.random() * Math.pow(2, 32)), String.prototype.hashCode = function() {
    const m = this.toString();
    let c, d;
    const h = m.length & 3, _ = m.length - h;
    let T = String.prototype.seed;
    const M = 3432918353, P = 461845907;
    let q = 0;
    for (; q < _; )
      d = m.charCodeAt(q) & 255 | (m.charCodeAt(++q) & 255) << 8 | (m.charCodeAt(++q) & 255) << 16 | (m.charCodeAt(++q) & 255) << 24, ++q, d = (d & 65535) * M + (((d >>> 16) * M & 65535) << 16) & 4294967295, d = d << 15 | d >>> 17, d = (d & 65535) * P + (((d >>> 16) * P & 65535) << 16) & 4294967295, T ^= d, T = T << 13 | T >>> 19, c = (T & 65535) * 5 + (((T >>> 16) * 5 & 65535) << 16) & 4294967295, T = (c & 65535) + 27492 + (((c >>> 16) + 58964 & 65535) << 16);
    switch (d = 0, h) {
      case 3:
        d ^= (m.charCodeAt(q + 2) & 255) << 16;
      case 2:
        d ^= (m.charCodeAt(q + 1) & 255) << 8;
      case 1:
        d ^= m.charCodeAt(q) & 255, d = (d & 65535) * M + (((d >>> 16) * M & 65535) << 16) & 4294967295, d = d << 15 | d >>> 17, d = (d & 65535) * P + (((d >>> 16) * P & 65535) << 16) & 4294967295, T ^= d;
    }
    return T ^= m.length, T ^= T >>> 16, T = (T & 65535) * 2246822507 + (((T >>> 16) * 2246822507 & 65535) << 16) & 4294967295, T ^= T >>> 13, T = (T & 65535) * 3266489909 + (((T >>> 16) * 3266489909 & 65535) << 16) & 4294967295, T ^= T >>> 16, T >>> 0;
  };
  function y(m, c) {
    return m ? m.equals(c) : m == c;
  }
  function p(m) {
    return m ? m.hashCode() : -1;
  }
  class l {
    constructor(c, d) {
      this.data = {}, this.hashFunction = c || p, this.equalsFunction = d || y;
    }
    add(c) {
      const h = "hash_" + this.hashFunction(c);
      if (h in this.data) {
        const _ = this.data[h];
        for (let T = 0; T < _.length; T++)
          if (this.equalsFunction(c, _[T]))
            return _[T];
        return _.push(c), c;
      } else
        return this.data[h] = [c], c;
    }
    contains(c) {
      return this.get(c) != null;
    }
    get(c) {
      const h = "hash_" + this.hashFunction(c);
      if (h in this.data) {
        const _ = this.data[h];
        for (let T = 0; T < _.length; T++)
          if (this.equalsFunction(c, _[T]))
            return _[T];
      }
      return null;
    }
    values() {
      let c = [];
      for (const d in this.data)
        d.indexOf("hash_") === 0 && (c = c.concat(this.data[d]));
      return c;
    }
    toString() {
      return C(this.values());
    }
    get length() {
      let c = 0;
      for (const d in this.data)
        d.indexOf("hash_") === 0 && (c = c + this.data[d].length);
      return c;
    }
  }
  class r {
    constructor() {
      this.data = [];
    }
    add(c) {
      this.data[c] = !0;
    }
    or(c) {
      const d = this;
      Object.keys(c.data).map(function(h) {
        d.add(h);
      });
    }
    remove(c) {
      delete this.data[c];
    }
    contains(c) {
      return this.data[c] === !0;
    }
    values() {
      return Object.keys(this.data);
    }
    minValue() {
      return Math.min.apply(null, this.values());
    }
    hashCode() {
      const c = new s();
      return c.update(this.values()), c.finish();
    }
    equals(c) {
      return c instanceof r ? this.hashCode() === c.hashCode() : !1;
    }
    toString() {
      return "{" + this.values().join(", ") + "}";
    }
    get length() {
      return this.values().length;
    }
  }
  class e {
    constructor(c, d) {
      this.data = {}, this.hashFunction = c || p, this.equalsFunction = d || y;
    }
    put(c, d) {
      const h = "hash_" + this.hashFunction(c);
      if (h in this.data) {
        const _ = this.data[h];
        for (let T = 0; T < _.length; T++) {
          const M = _[T];
          if (this.equalsFunction(c, M.key)) {
            const P = M.value;
            return M.value = d, P;
          }
        }
        return _.push({ key: c, value: d }), d;
      } else
        return this.data[h] = [{ key: c, value: d }], d;
    }
    containsKey(c) {
      const d = "hash_" + this.hashFunction(c);
      if (d in this.data) {
        const h = this.data[d];
        for (let _ = 0; _ < h.length; _++) {
          const T = h[_];
          if (this.equalsFunction(c, T.key))
            return !0;
        }
      }
      return !1;
    }
    get(c) {
      const d = "hash_" + this.hashFunction(c);
      if (d in this.data) {
        const h = this.data[d];
        for (let _ = 0; _ < h.length; _++) {
          const T = h[_];
          if (this.equalsFunction(c, T.key))
            return T.value;
        }
      }
      return null;
    }
    entries() {
      let c = [];
      for (const d in this.data)
        d.indexOf("hash_") === 0 && (c = c.concat(this.data[d]));
      return c;
    }
    getKeys() {
      return this.entries().map(function(c) {
        return c.key;
      });
    }
    getValues() {
      return this.entries().map(function(c) {
        return c.value;
      });
    }
    toString() {
      return "[" + this.entries().map(function(d) {
        return "{" + d.key + ":" + d.value + "}";
      }).join(", ") + "]";
    }
    get length() {
      let c = 0;
      for (const d in this.data)
        d.indexOf("hash_") === 0 && (c = c + this.data[d].length);
      return c;
    }
  }
  class a {
    constructor() {
      this.data = {};
    }
    get(c) {
      return c = "k-" + c, c in this.data ? this.data[c] : null;
    }
    put(c, d) {
      c = "k-" + c, this.data[c] = d;
    }
    values() {
      const c = this.data;
      return Object.keys(this.data).map(function(h) {
        return c[h];
      });
    }
  }
  class u {
    constructor(c) {
      this.defaultMapCtor = c || e, this.cacheMap = new this.defaultMapCtor();
    }
    get(c, d) {
      const h = this.cacheMap.get(c) || null;
      return h === null ? null : h.get(d) || null;
    }
    set(c, d, h) {
      let _ = this.cacheMap.get(c) || null;
      _ === null && (_ = new this.defaultMapCtor(), this.cacheMap.put(c, _)), _.put(d, h);
    }
  }
  class s {
    constructor() {
      this.count = 0, this.hash = 0;
    }
    update() {
      for (let c = 0; c < arguments.length; c++) {
        const d = arguments[c];
        if (d != null)
          if (Array.isArray(d))
            this.update.apply(this, d);
          else {
            let h = 0;
            switch (typeof d) {
              case "undefined":
              case "function":
                continue;
              case "number":
              case "boolean":
                h = d;
                break;
              case "string":
                h = d.hashCode();
                break;
              default:
                d.updateHashCode ? d.updateHashCode(this) : console.log("No updateHashCode for " + d.toString());
                continue;
            }
            h = h * 3432918353, h = h << 15 | h >>> 17, h = h * 461845907, this.count = this.count + 1;
            let _ = this.hash ^ h;
            _ = _ << 13 | _ >>> 19, _ = _ * 5 + 3864292196, this.hash = _;
          }
      }
    }
    finish() {
      let c = this.hash ^ this.count * 4;
      return c = c ^ c >>> 16, c = c * 2246822507, c = c ^ c >>> 13, c = c * 3266489909, c = c ^ c >>> 16, c;
    }
  }
  function t() {
    const m = new s();
    return m.update.apply(m, arguments), m.finish();
  }
  function i(m, c) {
    return m = m.replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r"), c && (m = m.replace(/ /g, "·")), m;
  }
  function n(m) {
    return m.replace(/\w\S*/g, function(c) {
      return c.charAt(0).toUpperCase() + c.substr(1);
    });
  }
  function o(m, c) {
    if (!Array.isArray(m) || !Array.isArray(c))
      return !1;
    if (m === c)
      return !0;
    if (m.length !== c.length)
      return !1;
    for (let d = 0; d < m.length; d++)
      if (m[d] !== c[d] && (!m[d].equals || !m[d].equals(c[d])))
        return !1;
    return !0;
  }
  return tt = {
    Hash: s,
    Set: l,
    Map: e,
    BitSet: r,
    AltDict: a,
    DoubleDict: u,
    hashStuff: t,
    escapeWhitespace: i,
    arrayToString: C,
    titleCase: n,
    equalArrays: o
  }, tt;
}
var nt, Hn;
function ue() {
  if (Hn) return nt;
  Hn = 1;
  class f {
    constructor() {
      this.source = null, this.type = null, this.channel = null, this.start = null, this.stop = null, this.tokenIndex = null, this.line = null, this.column = null, this._text = null;
    }
    getTokenSource() {
      return this.source[0];
    }
    getInputStream() {
      return this.source[1];
    }
    get text() {
      return this._text;
    }
    set text(p) {
      this._text = p;
    }
  }
  f.INVALID_TYPE = 0, f.EPSILON = -2, f.MIN_USER_TOKEN_TYPE = 1, f.EOF = -1, f.DEFAULT_CHANNEL = 0, f.HIDDEN_CHANNEL = 1;
  class C extends f {
    constructor(p, l, r, e, a) {
      super(), this.source = p !== void 0 ? p : C.EMPTY_SOURCE, this.type = l !== void 0 ? l : null, this.channel = r !== void 0 ? r : f.DEFAULT_CHANNEL, this.start = e !== void 0 ? e : -1, this.stop = a !== void 0 ? a : -1, this.tokenIndex = -1, this.source[0] !== null ? (this.line = p[0].line, this.column = p[0].column) : this.column = -1;
    }
    /**
     * Constructs a new {@link CommonToken} as a copy of another {@link Token}.
     *
     * <p>
     * If {@code oldToken} is also a {@link CommonToken} instance, the newly
     * constructed token will share a reference to the {@link //text} field and
     * the {@link Pair} stored in {@link //source}. Otherwise, {@link //text} will
     * be assigned the result of calling {@link //getText}, and {@link //source}
     * will be constructed from the result of {@link Token//getTokenSource} and
     * {@link Token//getInputStream}.</p>
     *
     * @param oldToken The token to copy.
     */
    clone() {
      const p = new C(this.source, this.type, this.channel, this.start, this.stop);
      return p.tokenIndex = this.tokenIndex, p.line = this.line, p.column = this.column, p.text = this.text, p;
    }
    toString() {
      let p = this.text;
      return p !== null ? p = p.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") : p = "<no text>", "[@" + this.tokenIndex + "," + this.start + ":" + this.stop + "='" + p + "',<" + this.type + ">" + (this.channel > 0 ? ",channel=" + this.channel : "") + "," + this.line + ":" + this.column + "]";
    }
    get text() {
      if (this._text !== null)
        return this._text;
      const p = this.getInputStream();
      if (p === null)
        return null;
      const l = p.size;
      return this.start < l && this.stop < l ? p.getText(this.start, this.stop) : "<EOF>";
    }
    set text(p) {
      this._text = p;
    }
  }
  return C.EMPTY_SOURCE = [null, null], nt = {
    Token: f,
    CommonToken: C
  }, nt;
}
var Ke = {}, lt, Vn;
function Ue() {
  if (Vn) return lt;
  Vn = 1;
  class f {
    constructor() {
      this.atn = null, this.stateNumber = f.INVALID_STATE_NUMBER, this.stateType = null, this.ruleIndex = 0, this.epsilonOnlyTransitions = !1, this.transitions = [], this.nextTokenWithinRule = null;
    }
    toString() {
      return this.stateNumber;
    }
    equals(d) {
      return d instanceof f ? this.stateNumber === d.stateNumber : !1;
    }
    isNonGreedyExitState() {
      return !1;
    }
    addTransition(d, h) {
      h === void 0 && (h = -1), this.transitions.length === 0 ? this.epsilonOnlyTransitions = d.isEpsilon : this.epsilonOnlyTransitions !== d.isEpsilon && (this.epsilonOnlyTransitions = !1), h === -1 ? this.transitions.push(d) : this.transitions.splice(h, 1, d);
    }
  }
  f.INVALID_TYPE = 0, f.BASIC = 1, f.RULE_START = 2, f.BLOCK_START = 3, f.PLUS_BLOCK_START = 4, f.STAR_BLOCK_START = 5, f.TOKEN_START = 6, f.RULE_STOP = 7, f.BLOCK_END = 8, f.STAR_LOOP_BACK = 9, f.STAR_LOOP_ENTRY = 10, f.PLUS_LOOP_BACK = 11, f.LOOP_END = 12, f.serializationNames = [
    "INVALID",
    "BASIC",
    "RULE_START",
    "BLOCK_START",
    "PLUS_BLOCK_START",
    "STAR_BLOCK_START",
    "TOKEN_START",
    "RULE_STOP",
    "BLOCK_END",
    "STAR_LOOP_BACK",
    "STAR_LOOP_ENTRY",
    "PLUS_LOOP_BACK",
    "LOOP_END"
  ], f.INVALID_STATE_NUMBER = -1;
  class C extends f {
    constructor() {
      super(), this.stateType = f.BASIC;
    }
  }
  class y extends f {
    constructor() {
      return super(), this.decision = -1, this.nonGreedy = !1, this;
    }
  }
  class p extends y {
    constructor() {
      return super(), this.endState = null, this;
    }
  }
  class l extends p {
    constructor() {
      return super(), this.stateType = f.BLOCK_START, this;
    }
  }
  class r extends f {
    constructor() {
      return super(), this.stateType = f.BLOCK_END, this.startState = null, this;
    }
  }
  class e extends f {
    constructor() {
      return super(), this.stateType = f.RULE_STOP, this;
    }
  }
  class a extends f {
    constructor() {
      return super(), this.stateType = f.RULE_START, this.stopState = null, this.isPrecedenceRule = !1, this;
    }
  }
  class u extends y {
    constructor() {
      return super(), this.stateType = f.PLUS_LOOP_BACK, this;
    }
  }
  class s extends p {
    constructor() {
      return super(), this.stateType = f.PLUS_BLOCK_START, this.loopBackState = null, this;
    }
  }
  class t extends p {
    constructor() {
      return super(), this.stateType = f.STAR_BLOCK_START, this;
    }
  }
  class i extends f {
    constructor() {
      return super(), this.stateType = f.STAR_LOOP_BACK, this;
    }
  }
  class n extends y {
    constructor() {
      return super(), this.stateType = f.STAR_LOOP_ENTRY, this.loopBackState = null, this.isPrecedenceDecision = null, this;
    }
  }
  class o extends f {
    constructor() {
      return super(), this.stateType = f.LOOP_END, this.loopBackState = null, this;
    }
  }
  class m extends y {
    constructor() {
      return super(), this.stateType = f.TOKEN_START, this;
    }
  }
  return lt = {
    ATNState: f,
    BasicState: C,
    DecisionState: y,
    BlockStartState: p,
    BlockEndState: r,
    LoopEndState: o,
    RuleStartState: a,
    RuleStopState: e,
    TokensStartState: m,
    PlusLoopbackState: u,
    StarLoopbackState: i,
    StarLoopEntryState: n,
    PlusBlockStartState: s,
    StarBlockStartState: t,
    BasicBlockStartState: l
  }, lt;
}
var st, Gn;
function Ve() {
  if (Gn) return st;
  Gn = 1;
  const { Set: f, Hash: C, equalArrays: y } = oe();
  class p {
    hashCode() {
      const s = new C();
      return this.updateHashCode(s), s.finish();
    }
    /**
     * For context independent predicates, we evaluate them without a local
     * context (i.e., null context). That way, we can evaluate them without
     * having to create proper rule-specific context during prediction (as
     * opposed to the parser, which creates them naturally). In a practical
     * sense, this avoids a cast exception from RuleContext to myruleContext.
     *
     * <p>For context dependent predicates, we must pass in a local context so that
     * references such as $arg evaluate properly as _localctx.arg. We only
     * capture context dependent predicates in the context in which we begin
     * prediction, so we passed in the outer context here in case of context
     * dependent predicate evaluation.</p>
     */
    evaluate(s, t) {
    }
    /**
     * Evaluate the precedence predicates for the context and reduce the result.
     *
     * @param parser The parser instance.
     * @param outerContext The current parser context object.
     * @return The simplified semantic context after precedence predicates are
     * evaluated, which will be one of the following values.
     * <ul>
     * <li>{@link //NONE}: if the predicate simplifies to {@code true} after
     * precedence predicates are evaluated.</li>
     * <li>{@code null}: if the predicate simplifies to {@code false} after
     * precedence predicates are evaluated.</li>
     * <li>{@code this}: if the semantic context is not changed as a result of
     * precedence predicate evaluation.</li>
     * <li>A non-{@code null} {@link SemanticContext}: the new simplified
     * semantic context after precedence predicates are evaluated.</li>
     * </ul>
     */
    evalPrecedence(s, t) {
      return this;
    }
    static andContext(s, t) {
      if (s === null || s === p.NONE)
        return t;
      if (t === null || t === p.NONE)
        return s;
      const i = new e(s, t);
      return i.opnds.length === 1 ? i.opnds[0] : i;
    }
    static orContext(s, t) {
      if (s === null)
        return t;
      if (t === null)
        return s;
      if (s === p.NONE || t === p.NONE)
        return p.NONE;
      const i = new a(s, t);
      return i.opnds.length === 1 ? i.opnds[0] : i;
    }
  }
  class l extends p {
    constructor(s, t, i) {
      super(), this.ruleIndex = s === void 0 ? -1 : s, this.predIndex = t === void 0 ? -1 : t, this.isCtxDependent = i === void 0 ? !1 : i;
    }
    evaluate(s, t) {
      const i = this.isCtxDependent ? t : null;
      return s.sempred(i, this.ruleIndex, this.predIndex);
    }
    updateHashCode(s) {
      s.update(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }
    equals(s) {
      return this === s ? !0 : s instanceof l ? this.ruleIndex === s.ruleIndex && this.predIndex === s.predIndex && this.isCtxDependent === s.isCtxDependent : !1;
    }
    toString() {
      return "{" + this.ruleIndex + ":" + this.predIndex + "}?";
    }
  }
  p.NONE = new l();
  class r extends p {
    constructor(s) {
      super(), this.precedence = s === void 0 ? 0 : s;
    }
    evaluate(s, t) {
      return s.precpred(t, this.precedence);
    }
    evalPrecedence(s, t) {
      return s.precpred(t, this.precedence) ? p.NONE : null;
    }
    compareTo(s) {
      return this.precedence - s.precedence;
    }
    updateHashCode(s) {
      s.update(this.precedence);
    }
    equals(s) {
      return this === s ? !0 : s instanceof r ? this.precedence === s.precedence : !1;
    }
    toString() {
      return "{" + this.precedence + ">=prec}?";
    }
    static filterPrecedencePredicates(s) {
      const t = [];
      return s.values().map(function(i) {
        i instanceof r && t.push(i);
      }), t;
    }
  }
  class e extends p {
    /**
     * A semantic context which is true whenever none of the contained contexts
     * is false
     */
    constructor(s, t) {
      super();
      const i = new f();
      s instanceof e ? s.opnds.map(function(o) {
        i.add(o);
      }) : i.add(s), t instanceof e ? t.opnds.map(function(o) {
        i.add(o);
      }) : i.add(t);
      const n = r.filterPrecedencePredicates(i);
      if (n.length > 0) {
        let o = null;
        n.map(function(m) {
          (o === null || m.precedence < o.precedence) && (o = m);
        }), i.add(o);
      }
      this.opnds = Array.from(i.values());
    }
    equals(s) {
      return this === s ? !0 : s instanceof e ? y(this.opnds, s.opnds) : !1;
    }
    updateHashCode(s) {
      s.update(this.opnds, "AND");
    }
    /**
     * {@inheritDoc}
     *
     * <p>
     * The evaluation of predicates by this context is short-circuiting, but
     * unordered.</p>
     */
    evaluate(s, t) {
      for (let i = 0; i < this.opnds.length; i++)
        if (!this.opnds[i].evaluate(s, t))
          return !1;
      return !0;
    }
    evalPrecedence(s, t) {
      let i = !1;
      const n = [];
      for (let m = 0; m < this.opnds.length; m++) {
        const c = this.opnds[m], d = c.evalPrecedence(s, t);
        if (i |= d !== c, d === null)
          return null;
        d !== p.NONE && n.push(d);
      }
      if (!i)
        return this;
      if (n.length === 0)
        return p.NONE;
      let o = null;
      return n.map(function(m) {
        o = o === null ? m : p.andContext(o, m);
      }), o;
    }
    toString() {
      const s = this.opnds.map((t) => t.toString());
      return (s.length > 3 ? s.slice(3) : s).join("&&");
    }
  }
  class a extends p {
    /**
     * A semantic context which is true whenever at least one of the contained
     * contexts is true
     */
    constructor(s, t) {
      super();
      const i = new f();
      s instanceof a ? s.opnds.map(function(o) {
        i.add(o);
      }) : i.add(s), t instanceof a ? t.opnds.map(function(o) {
        i.add(o);
      }) : i.add(t);
      const n = r.filterPrecedencePredicates(i);
      if (n.length > 0) {
        const o = n.sort(function(c, d) {
          return c.compareTo(d);
        }), m = o[o.length - 1];
        i.add(m);
      }
      this.opnds = Array.from(i.values());
    }
    equals(s) {
      return this === s ? !0 : s instanceof a ? y(this.opnds, s.opnds) : !1;
    }
    updateHashCode(s) {
      s.update(this.opnds, "OR");
    }
    /**
     * <p>
     * The evaluation of predicates by this context is short-circuiting, but
     * unordered.</p>
     */
    evaluate(s, t) {
      for (let i = 0; i < this.opnds.length; i++)
        if (this.opnds[i].evaluate(s, t))
          return !0;
      return !1;
    }
    evalPrecedence(s, t) {
      let i = !1;
      const n = [];
      for (let m = 0; m < this.opnds.length; m++) {
        const c = this.opnds[m], d = c.evalPrecedence(s, t);
        if (i |= d !== c, d === p.NONE)
          return p.NONE;
        d !== null && n.push(d);
      }
      return i ? (n.length === 0, null) : this;
    }
    toString() {
      const s = this.opnds.map((t) => t.toString());
      return (s.length > 3 ? s.slice(3) : s).join("||");
    }
  }
  return st = {
    SemanticContext: p,
    PrecedencePredicate: r,
    Predicate: l
  }, st;
}
var zn;
function Je() {
  if (zn) return Ke;
  zn = 1;
  const { DecisionState: f } = Ue(), { SemanticContext: C } = Ve(), { Hash: y } = oe();
  function p(e, a) {
    if (e === null) {
      const u = { state: null, alt: null, context: null, semanticContext: null };
      return a && (u.reachesIntoOuterContext = 0), u;
    } else {
      const u = {};
      return u.state = e.state || null, u.alt = e.alt === void 0 ? null : e.alt, u.context = e.context || null, u.semanticContext = e.semanticContext || null, a && (u.reachesIntoOuterContext = e.reachesIntoOuterContext || 0, u.precedenceFilterSuppressed = e.precedenceFilterSuppressed || !1), u;
    }
  }
  let l = class Sn {
    /**
     * @param {Object} params A tuple: (ATN state, predicted alt, syntactic, semantic context).
     * The syntactic context is a graph-structured stack node whose
     * path(s) to the root is the rule invocation(s)
     * chain used to arrive at the state.  The semantic context is
     * the tree of semantic predicates encountered before reaching
     * an ATN state
     */
    constructor(a, u) {
      this.checkContext(a, u), a = p(a), u = p(u, !0), this.state = a.state !== null ? a.state : u.state, this.alt = a.alt !== null ? a.alt : u.alt, this.context = a.context !== null ? a.context : u.context, this.semanticContext = a.semanticContext !== null ? a.semanticContext : u.semanticContext !== null ? u.semanticContext : C.NONE, this.reachesIntoOuterContext = u.reachesIntoOuterContext, this.precedenceFilterSuppressed = u.precedenceFilterSuppressed;
    }
    checkContext(a, u) {
      (a.context === null || a.context === void 0) && (u === null || u.context === null || u.context === void 0) && (this.context = null);
    }
    hashCode() {
      const a = new y();
      return this.updateHashCode(a), a.finish();
    }
    updateHashCode(a) {
      a.update(this.state.stateNumber, this.alt, this.context, this.semanticContext);
    }
    /**
     * An ATN configuration is equal to another if both have
     * the same state, they predict the same alternative, and
     * syntactic/semantic contexts are the same
     */
    equals(a) {
      return this === a ? !0 : a instanceof Sn ? this.state.stateNumber === a.state.stateNumber && this.alt === a.alt && (this.context === null ? a.context === null : this.context.equals(a.context)) && this.semanticContext.equals(a.semanticContext) && this.precedenceFilterSuppressed === a.precedenceFilterSuppressed : !1;
    }
    hashCodeForConfigSet() {
      const a = new y();
      return a.update(this.state.stateNumber, this.alt, this.semanticContext), a.finish();
    }
    equalsForConfigSet(a) {
      return this === a ? !0 : a instanceof Sn ? this.state.stateNumber === a.state.stateNumber && this.alt === a.alt && this.semanticContext.equals(a.semanticContext) : !1;
    }
    toString() {
      return "(" + this.state + "," + this.alt + (this.context !== null ? ",[" + this.context.toString() + "]" : "") + (this.semanticContext !== C.NONE ? "," + this.semanticContext.toString() : "") + (this.reachesIntoOuterContext > 0 ? ",up=" + this.reachesIntoOuterContext : "") + ")";
    }
  };
  class r extends l {
    constructor(a, u) {
      super(a, u);
      const s = a.lexerActionExecutor || null;
      return this.lexerActionExecutor = s || (u !== null ? u.lexerActionExecutor : null), this.passedThroughNonGreedyDecision = u !== null ? this.checkNonGreedyDecision(u, this.state) : !1, this.hashCodeForConfigSet = r.prototype.hashCode, this.equalsForConfigSet = r.prototype.equals, this;
    }
    updateHashCode(a) {
      a.update(this.state.stateNumber, this.alt, this.context, this.semanticContext, this.passedThroughNonGreedyDecision, this.lexerActionExecutor);
    }
    equals(a) {
      return this === a || a instanceof r && this.passedThroughNonGreedyDecision === a.passedThroughNonGreedyDecision && (this.lexerActionExecutor ? this.lexerActionExecutor.equals(a.lexerActionExecutor) : !a.lexerActionExecutor) && super.equals(a);
    }
    checkNonGreedyDecision(a, u) {
      return a.passedThroughNonGreedyDecision || u instanceof f && u.nonGreedy;
    }
  }
  return Ke.ATNConfig = l, Ke.LexerATNConfig = r, Ke;
}
var it, $n;
function me() {
  if ($n) return it;
  $n = 1;
  const { Token: f } = ue();
  class C {
    constructor(l, r) {
      this.start = l, this.stop = r;
    }
    clone() {
      return new C(this.start, this.stop);
    }
    contains(l) {
      return l >= this.start && l < this.stop;
    }
    toString() {
      return this.start === this.stop - 1 ? this.start.toString() : this.start.toString() + ".." + (this.stop - 1).toString();
    }
    get length() {
      return this.stop - this.start;
    }
  }
  class y {
    constructor() {
      this.intervals = null, this.readOnly = !1;
    }
    first(l) {
      return this.intervals === null || this.intervals.length === 0 ? f.INVALID_TYPE : this.intervals[0].start;
    }
    addOne(l) {
      this.addInterval(new C(l, l + 1));
    }
    addRange(l, r) {
      this.addInterval(new C(l, r + 1));
    }
    addInterval(l) {
      if (this.intervals === null)
        this.intervals = [], this.intervals.push(l.clone());
      else {
        for (let r = 0; r < this.intervals.length; r++) {
          const e = this.intervals[r];
          if (l.stop < e.start) {
            this.intervals.splice(r, 0, l);
            return;
          } else if (l.stop === e.start) {
            this.intervals[r] = new C(l.start, e.stop);
            return;
          } else if (l.start <= e.stop) {
            this.intervals[r] = new C(Math.min(e.start, l.start), Math.max(e.stop, l.stop)), this.reduce(r);
            return;
          }
        }
        this.intervals.push(l.clone());
      }
    }
    addSet(l) {
      return l.intervals !== null && l.intervals.forEach((r) => this.addInterval(r), this), this;
    }
    reduce(l) {
      if (l < this.intervals.length - 1) {
        const r = this.intervals[l], e = this.intervals[l + 1];
        r.stop >= e.stop ? (this.intervals.splice(l + 1, 1), this.reduce(l)) : r.stop >= e.start && (this.intervals[l] = new C(r.start, e.stop), this.intervals.splice(l + 1, 1));
      }
    }
    complement(l, r) {
      const e = new y();
      return e.addInterval(new C(l, r + 1)), this.intervals !== null && this.intervals.forEach((a) => e.removeRange(a)), e;
    }
    contains(l) {
      if (this.intervals === null)
        return !1;
      for (let r = 0; r < this.intervals.length; r++)
        if (this.intervals[r].contains(l))
          return !0;
      return !1;
    }
    removeRange(l) {
      if (l.start === l.stop - 1)
        this.removeOne(l.start);
      else if (this.intervals !== null) {
        let r = 0;
        for (let e = 0; e < this.intervals.length; e++) {
          const a = this.intervals[r];
          if (l.stop <= a.start)
            return;
          if (l.start > a.start && l.stop < a.stop) {
            this.intervals[r] = new C(a.start, l.start);
            const u = new C(l.stop, a.stop);
            this.intervals.splice(r, 0, u);
            return;
          } else l.start <= a.start && l.stop >= a.stop ? (this.intervals.splice(r, 1), r = r - 1) : l.start < a.stop ? this.intervals[r] = new C(a.start, l.start) : l.stop < a.stop && (this.intervals[r] = new C(l.stop, a.stop));
          r += 1;
        }
      }
    }
    removeOne(l) {
      if (this.intervals !== null)
        for (let r = 0; r < this.intervals.length; r++) {
          const e = this.intervals[r];
          if (l < e.start)
            return;
          if (l === e.start && l === e.stop - 1) {
            this.intervals.splice(r, 1);
            return;
          } else if (l === e.start) {
            this.intervals[r] = new C(e.start + 1, e.stop);
            return;
          } else if (l === e.stop - 1) {
            this.intervals[r] = new C(e.start, e.stop - 1);
            return;
          } else if (l < e.stop - 1) {
            const a = new C(e.start, l);
            e.start = l + 1, this.intervals.splice(r, 0, a);
            return;
          }
        }
    }
    toString(l, r, e) {
      return l = l || null, r = r || null, e = e || !1, this.intervals === null ? "{}" : l !== null || r !== null ? this.toTokenString(l, r) : e ? this.toCharString() : this.toIndexString();
    }
    toCharString() {
      const l = [];
      for (let r = 0; r < this.intervals.length; r++) {
        const e = this.intervals[r];
        e.stop === e.start + 1 ? e.start === f.EOF ? l.push("<EOF>") : l.push("'" + String.fromCharCode(e.start) + "'") : l.push("'" + String.fromCharCode(e.start) + "'..'" + String.fromCharCode(e.stop - 1) + "'");
      }
      return l.length > 1 ? "{" + l.join(", ") + "}" : l[0];
    }
    toIndexString() {
      const l = [];
      for (let r = 0; r < this.intervals.length; r++) {
        const e = this.intervals[r];
        e.stop === e.start + 1 ? e.start === f.EOF ? l.push("<EOF>") : l.push(e.start.toString()) : l.push(e.start.toString() + ".." + (e.stop - 1).toString());
      }
      return l.length > 1 ? "{" + l.join(", ") + "}" : l[0];
    }
    toTokenString(l, r) {
      const e = [];
      for (let a = 0; a < this.intervals.length; a++) {
        const u = this.intervals[a];
        for (let s = u.start; s < u.stop; s++)
          e.push(this.elementName(l, r, s));
      }
      return e.length > 1 ? "{" + e.join(", ") + "}" : e[0];
    }
    elementName(l, r, e) {
      return e === f.EOF ? "<EOF>" : e === f.EPSILON ? "<EPSILON>" : l[e] || r[e];
    }
    get length() {
      return this.intervals.map((l) => l.length).reduce((l, r) => l + r);
    }
  }
  return it = {
    Interval: C,
    IntervalSet: y
  }, it;
}
var rt, Kn;
function Ge() {
  if (Kn) return rt;
  Kn = 1;
  const { Token: f } = ue(), { IntervalSet: C } = me(), { Predicate: y, PrecedencePredicate: p } = Ve();
  class l {
    constructor(h) {
      if (h == null)
        throw "target cannot be null.";
      this.target = h, this.isEpsilon = !1, this.label = null;
    }
  }
  l.EPSILON = 1, l.RANGE = 2, l.RULE = 3, l.PREDICATE = 4, l.ATOM = 5, l.ACTION = 6, l.SET = 7, l.NOT_SET = 8, l.WILDCARD = 9, l.PRECEDENCE = 10, l.serializationNames = [
    "INVALID",
    "EPSILON",
    "RANGE",
    "RULE",
    "PREDICATE",
    "ATOM",
    "ACTION",
    "SET",
    "NOT_SET",
    "WILDCARD",
    "PRECEDENCE"
  ], l.serializationTypes = {
    EpsilonTransition: l.EPSILON,
    RangeTransition: l.RANGE,
    RuleTransition: l.RULE,
    PredicateTransition: l.PREDICATE,
    AtomTransition: l.ATOM,
    ActionTransition: l.ACTION,
    SetTransition: l.SET,
    NotSetTransition: l.NOT_SET,
    WildcardTransition: l.WILDCARD,
    PrecedencePredicateTransition: l.PRECEDENCE
  };
  class r extends l {
    constructor(h, _) {
      super(h), this.label_ = _, this.label = this.makeLabel(), this.serializationType = l.ATOM;
    }
    makeLabel() {
      const h = new C();
      return h.addOne(this.label_), h;
    }
    matches(h, _, T) {
      return this.label_ === h;
    }
    toString() {
      return this.label_;
    }
  }
  class e extends l {
    constructor(h, _, T, M) {
      super(h), this.ruleIndex = _, this.precedence = T, this.followState = M, this.serializationType = l.RULE, this.isEpsilon = !0;
    }
    matches(h, _, T) {
      return !1;
    }
  }
  class a extends l {
    constructor(h, _) {
      super(h), this.serializationType = l.EPSILON, this.isEpsilon = !0, this.outermostPrecedenceReturn = _;
    }
    matches(h, _, T) {
      return !1;
    }
    toString() {
      return "epsilon";
    }
  }
  class u extends l {
    constructor(h, _, T) {
      super(h), this.serializationType = l.RANGE, this.start = _, this.stop = T, this.label = this.makeLabel();
    }
    makeLabel() {
      const h = new C();
      return h.addRange(this.start, this.stop), h;
    }
    matches(h, _, T) {
      return h >= this.start && h <= this.stop;
    }
    toString() {
      return "'" + String.fromCharCode(this.start) + "'..'" + String.fromCharCode(this.stop) + "'";
    }
  }
  class s extends l {
    constructor(h) {
      super(h);
    }
  }
  class t extends s {
    constructor(h, _, T, M) {
      super(h), this.serializationType = l.PREDICATE, this.ruleIndex = _, this.predIndex = T, this.isCtxDependent = M, this.isEpsilon = !0;
    }
    matches(h, _, T) {
      return !1;
    }
    getPredicate() {
      return new y(this.ruleIndex, this.predIndex, this.isCtxDependent);
    }
    toString() {
      return "pred_" + this.ruleIndex + ":" + this.predIndex;
    }
  }
  class i extends l {
    constructor(h, _, T, M) {
      super(h), this.serializationType = l.ACTION, this.ruleIndex = _, this.actionIndex = T === void 0 ? -1 : T, this.isCtxDependent = M === void 0 ? !1 : M, this.isEpsilon = !0;
    }
    matches(h, _, T) {
      return !1;
    }
    toString() {
      return "action_" + this.ruleIndex + ":" + this.actionIndex;
    }
  }
  class n extends l {
    constructor(h, _) {
      super(h), this.serializationType = l.SET, _ != null ? this.label = _ : (this.label = new C(), this.label.addOne(f.INVALID_TYPE));
    }
    matches(h, _, T) {
      return this.label.contains(h);
    }
    toString() {
      return this.label.toString();
    }
  }
  class o extends n {
    constructor(h, _) {
      super(h, _), this.serializationType = l.NOT_SET;
    }
    matches(h, _, T) {
      return h >= _ && h <= T && !super.matches(h, _, T);
    }
    toString() {
      return "~" + super.toString();
    }
  }
  class m extends l {
    constructor(h) {
      super(h), this.serializationType = l.WILDCARD;
    }
    matches(h, _, T) {
      return h >= _ && h <= T;
    }
    toString() {
      return ".";
    }
  }
  class c extends s {
    constructor(h, _) {
      super(h), this.serializationType = l.PRECEDENCE, this.precedence = _, this.isEpsilon = !0;
    }
    matches(h, _, T) {
      return !1;
    }
    getPredicate() {
      return new p(this.precedence);
    }
    toString() {
      return this.precedence + " >= _p";
    }
  }
  return rt = {
    Transition: l,
    AtomTransition: r,
    SetTransition: n,
    NotSetTransition: o,
    RuleTransition: e,
    ActionTransition: i,
    EpsilonTransition: a,
    RangeTransition: u,
    WildcardTransition: m,
    PredicateTransition: t,
    PrecedencePredicateTransition: c,
    AbstractPredicateTransition: s
  }, rt;
}
var ut, jn;
function Ee() {
  if (jn) return ut;
  jn = 1;
  const { Token: f } = ue(), { Interval: C } = me(), y = new C(-1, -2);
  class p {
  }
  class l extends p {
    constructor() {
      super();
    }
  }
  class r extends l {
    constructor() {
      super();
    }
  }
  class e extends r {
    constructor() {
      super();
    }
    getRuleContext() {
      throw new Error("missing interface implementation");
    }
  }
  class a extends r {
    constructor() {
      super();
    }
  }
  class u extends a {
    constructor() {
      super();
    }
  }
  class s {
    visit(c) {
      return Array.isArray(c) ? c.map(function(d) {
        return d.accept(this);
      }, this) : c.accept(this);
    }
    visitChildren(c) {
      return c.children ? this.visit(c.children) : null;
    }
    visitTerminal(c) {
    }
    visitErrorNode(c) {
    }
  }
  class t {
    visitTerminal(c) {
    }
    visitErrorNode(c) {
    }
    enterEveryRule(c) {
    }
    exitEveryRule(c) {
    }
  }
  class i extends a {
    constructor(c) {
      super(), this.parentCtx = null, this.symbol = c;
    }
    getChild(c) {
      return null;
    }
    getSymbol() {
      return this.symbol;
    }
    getParent() {
      return this.parentCtx;
    }
    getPayload() {
      return this.symbol;
    }
    getSourceInterval() {
      if (this.symbol === null)
        return y;
      const c = this.symbol.tokenIndex;
      return new C(c, c);
    }
    getChildCount() {
      return 0;
    }
    accept(c) {
      return c.visitTerminal(this);
    }
    getText() {
      return this.symbol.text;
    }
    toString() {
      return this.symbol.type === f.EOF ? "<EOF>" : this.symbol.text;
    }
  }
  class n extends i {
    constructor(c) {
      super(c);
    }
    isErrorNode() {
      return !0;
    }
    accept(c) {
      return c.visitErrorNode(this);
    }
  }
  class o {
    /**
     * Performs a walk on the given parse tree starting at the root and going down recursively
     * with depth-first search. On each node, {@link ParseTreeWalker//enterRule} is called before
     * recursively walking down into child nodes, then
     * {@link ParseTreeWalker//exitRule} is called after the recursive call to wind up.
     * @param listener The listener used by the walker to process grammar rules
     * @param t The parse tree to be walked on
     */
    walk(c, d) {
      if (d instanceof u || d.isErrorNode !== void 0 && d.isErrorNode())
        c.visitErrorNode(d);
      else if (d instanceof a)
        c.visitTerminal(d);
      else {
        this.enterRule(c, d);
        for (let _ = 0; _ < d.getChildCount(); _++) {
          const T = d.getChild(_);
          this.walk(c, T);
        }
        this.exitRule(c, d);
      }
    }
    /**
     * Enters a grammar rule by first triggering the generic event {@link ParseTreeListener//enterEveryRule}
     * then by triggering the event specific to the given parse tree node
     * @param listener The listener responding to the trigger events
     * @param r The grammar rule containing the rule context
     */
    enterRule(c, d) {
      const h = d.getRuleContext();
      c.enterEveryRule(h), h.enterRule(c);
    }
    /**
     * Exits a grammar rule by first triggering the event specific to the given parse tree node
     * then by triggering the generic event {@link ParseTreeListener//exitEveryRule}
     * @param listener The listener responding to the trigger events
     * @param r The grammar rule containing the rule context
     */
    exitRule(c, d) {
      const h = d.getRuleContext();
      h.exitRule(c), c.exitEveryRule(h);
    }
  }
  return o.DEFAULT = new o(), ut = {
    RuleNode: e,
    ErrorNode: u,
    TerminalNode: a,
    ErrorNodeImpl: n,
    TerminalNodeImpl: i,
    ParseTreeListener: t,
    ParseTreeVisitor: s,
    ParseTreeWalker: o,
    INVALID_INTERVAL: y
  }, ut;
}
var at, Wn;
function P0() {
  if (Wn) return at;
  Wn = 1;
  const f = oe(), { Token: C } = ue(), { ErrorNode: y, TerminalNode: p, RuleNode: l } = Ee(), r = {
    /**
     * Print out a whole tree in LISP form. {@link //getNodeText} is used on the
     *  node payloads to get the text for the nodes.  Detect
     *  parse trees and extract data appropriately.
     */
    toStringTree: function(e, a, u) {
      a = a || null, u = u || null, u !== null && (a = u.ruleNames);
      let s = r.getNodeText(e, a);
      s = f.escapeWhitespace(s, !1);
      const t = e.getChildCount();
      if (t === 0)
        return s;
      let i = "(" + s + " ";
      t > 0 && (s = r.toStringTree(e.getChild(0), a), i = i.concat(s));
      for (let n = 1; n < t; n++)
        s = r.toStringTree(e.getChild(n), a), i = i.concat(" " + s);
      return i = i.concat(")"), i;
    },
    getNodeText: function(e, a, u) {
      if (a = a || null, u = u || null, u !== null && (a = u.ruleNames), a !== null)
        if (e instanceof l) {
          const i = e.getRuleContext().getAltNumber();
          return i != 0 ? a[e.ruleIndex] + ":" + i : a[e.ruleIndex];
        } else {
          if (e instanceof y)
            return e.toString();
          if (e instanceof p && e.symbol !== null)
            return e.symbol.text;
        }
      const s = e.getPayload();
      return s instanceof C ? s.text : e.getPayload().toString();
    },
    /**
     * Return ordered list of all children of this node
     */
    getChildren: function(e) {
      const a = [];
      for (let u = 0; u < e.getChildCount(); u++)
        a.push(e.getChild(u));
      return a;
    },
    /**
     * Return a list of all ancestors of this node.  The first node of
     * list is the root and the last is the parent of this node.
     */
    getAncestors: function(e) {
      let a = [];
      for (e = e.getParent(); e !== null; )
        a = [e].concat(a), e = e.getParent();
      return a;
    },
    findAllTokenNodes: function(e, a) {
      return r.findAllNodes(e, a, !0);
    },
    findAllRuleNodes: function(e, a) {
      return r.findAllNodes(e, a, !1);
    },
    findAllNodes: function(e, a, u) {
      const s = [];
      return r._findAllNodes(e, a, u, s), s;
    },
    _findAllNodes: function(e, a, u, s) {
      u && e instanceof p ? e.symbol.type === a && s.push(e) : !u && e instanceof l && e.ruleIndex === a && s.push(e);
      for (let t = 0; t < e.getChildCount(); t++)
        r._findAllNodes(e.getChild(t), a, u, s);
    },
    descendants: function(e) {
      let a = [e];
      for (let u = 0; u < e.getChildCount(); u++)
        a = a.concat(r.descendants(e.getChild(u)));
      return a;
    }
  };
  return at = r, at;
}
var ot, Jn;
function En() {
  if (Jn) return ot;
  Jn = 1;
  const { RuleNode: f } = Ee(), { INVALID_INTERVAL: C } = Ee(), y = P0();
  class p extends f {
    /** A rule context is a record of a single rule invocation. It knows
     * which context invoked it, if any. If there is no parent context, then
     * naturally the invoking state is not valid.  The parent link
     * provides a chain upwards from the current rule invocation to the root
     * of the invocation tree, forming a stack. We actually carry no
     * information about the rule associated with this context (except
     * when parsing). We keep only the state number of the invoking state from
     * the ATN submachine that invoked this. Contrast this with the s
     * pointer inside ParserRuleContext that tracks the current state
     * being "executed" for the current rule.
     *
     * The parent contexts are useful for computing lookahead sets and
     * getting error information.
     *
     * These objects are used during parsing and prediction.
     * For the special case of parsers, we use the subclass
     * ParserRuleContext.
     *
     * @see ParserRuleContext
     */
    constructor(r, e) {
      super(), this.parentCtx = r || null, this.invokingState = e || -1;
    }
    depth() {
      let r = 0, e = this;
      for (; e !== null; )
        e = e.parentCtx, r += 1;
      return r;
    }
    /**
     * A context is empty if there is no invoking state; meaning nobody call
     * current context.
     */
    isEmpty() {
      return this.invokingState === -1;
    }
    // satisfy the ParseTree / SyntaxTree interface
    getSourceInterval() {
      return C;
    }
    getRuleContext() {
      return this;
    }
    getPayload() {
      return this;
    }
    /**
     * Return the combined text of all child nodes. This method only considers
     * tokens which have been added to the parse tree.
     * <p>
     * Since tokens on hidden channels (e.g. whitespace or comments) are not
     * added to the parse trees, they will not appear in the output of this
     * method.
     */
    getText() {
      return this.getChildCount() === 0 ? "" : this.children.map(function(r) {
        return r.getText();
      }).join("");
    }
    /**
     * For rule associated with this parse tree internal node, return
     * the outer alternative number used to match the input. Default
     * implementation does not compute nor store this alt num. Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     * to set it.
     */
    getAltNumber() {
      return 0;
    }
    /**
     * Set the outer alternative number for this context node. Default
     * implementation does nothing to avoid backing field overhead for
     * trees that don't need it.  Create
     * a subclass of ParserRuleContext with backing field and set
     * option contextSuperClass.
     */
    setAltNumber(r) {
    }
    getChild(r) {
      return null;
    }
    getChildCount() {
      return 0;
    }
    accept(r) {
      return r.visitChildren(this);
    }
    /**
     * Print out a whole tree, not just a node, in LISP format
     * (root child1 .. childN). Print just a node if this is a leaf.
     */
    toStringTree(r, e) {
      return y.toStringTree(this, r, e);
    }
    toString(r, e) {
      r = r || null, e = e || null;
      let a = this, u = "[";
      for (; a !== null && a !== e; ) {
        if (r === null)
          a.isEmpty() || (u += a.invokingState);
        else {
          const s = a.ruleIndex, t = s >= 0 && s < r.length ? r[s] : "" + s;
          u += t;
        }
        a.parentCtx !== null && (r !== null || !a.parentCtx.isEmpty()) && (u += " "), a = a.parentCtx;
      }
      return u += "]", u;
    }
  }
  return ot = p, ot;
}
var ct, Yn;
function Te() {
  if (Yn) return ct;
  Yn = 1;
  const f = En(), { Hash: C, Map: y, equalArrays: p } = oe();
  class l {
    constructor(h) {
      this.cachedHashCode = h;
    }
    /**
     * Stores the computed hash code of this {@link PredictionContext}. The hash
     * code is computed in parts to match the following reference algorithm.
     *
     * <pre>
     * private int referenceHashCode() {
     * int hash = {@link MurmurHash//initialize MurmurHash.initialize}({@link
     * //INITIAL_HASH});
     *
     * for (int i = 0; i &lt; {@link //size()}; i++) {
     * hash = {@link MurmurHash//update MurmurHash.update}(hash, {@link //getParent
     * getParent}(i));
     * }
     *
     * for (int i = 0; i &lt; {@link //size()}; i++) {
     * hash = {@link MurmurHash//update MurmurHash.update}(hash, {@link
     * //getReturnState getReturnState}(i));
     * }
     *
     * hash = {@link MurmurHash//finish MurmurHash.finish}(hash, 2// {@link
     * //size()});
     * return hash;
     * }
     * </pre>
     * This means only the {@link //EMPTY} context is in set.
     */
    isEmpty() {
      return this === l.EMPTY;
    }
    hasEmptyPath() {
      return this.getReturnState(this.length - 1) === l.EMPTY_RETURN_STATE;
    }
    hashCode() {
      return this.cachedHashCode;
    }
    updateHashCode(h) {
      h.update(this.cachedHashCode);
    }
  }
  l.EMPTY = null, l.EMPTY_RETURN_STATE = 2147483647, l.globalNodeCount = 1, l.id = l.globalNodeCount;
  class r {
    constructor() {
      this.cache = new y();
    }
    /**
     * Add a context to the cache and return it. If the context already exists,
     * return that one instead and do not add a new context to the cache.
     * Protect shared cache from unsafe thread access.
     */
    add(h) {
      if (h === l.EMPTY)
        return l.EMPTY;
      const _ = this.cache.get(h) || null;
      return _ !== null ? _ : (this.cache.put(h, h), h);
    }
    get(h) {
      return this.cache.get(h) || null;
    }
    get length() {
      return this.cache.length;
    }
  }
  class e extends l {
    constructor(h, _) {
      let T = 0;
      const M = new C();
      h !== null ? M.update(h, _) : M.update(1), T = M.finish(), super(T), this.parentCtx = h, this.returnState = _;
    }
    getParent(h) {
      return this.parentCtx;
    }
    getReturnState(h) {
      return this.returnState;
    }
    equals(h) {
      return this === h ? !0 : h instanceof e ? this.hashCode() !== h.hashCode() || this.returnState !== h.returnState ? !1 : this.parentCtx == null ? h.parentCtx == null : this.parentCtx.equals(h.parentCtx) : !1;
    }
    toString() {
      const h = this.parentCtx === null ? "" : this.parentCtx.toString();
      return h.length === 0 ? this.returnState === l.EMPTY_RETURN_STATE ? "$" : "" + this.returnState : "" + this.returnState + " " + h;
    }
    get length() {
      return 1;
    }
    static create(h, _) {
      return _ === l.EMPTY_RETURN_STATE && h === null ? l.EMPTY : new e(h, _);
    }
  }
  class a extends e {
    constructor() {
      super(null, l.EMPTY_RETURN_STATE);
    }
    isEmpty() {
      return !0;
    }
    getParent(h) {
      return null;
    }
    getReturnState(h) {
      return this.returnState;
    }
    equals(h) {
      return this === h;
    }
    toString() {
      return "$";
    }
  }
  l.EMPTY = new a();
  class u extends l {
    constructor(h, _) {
      const T = new C();
      T.update(h, _);
      const M = T.finish();
      return super(M), this.parents = h, this.returnStates = _, this;
    }
    isEmpty() {
      return this.returnStates[0] === l.EMPTY_RETURN_STATE;
    }
    getParent(h) {
      return this.parents[h];
    }
    getReturnState(h) {
      return this.returnStates[h];
    }
    equals(h) {
      return this === h ? !0 : h instanceof u ? this.hashCode() !== h.hashCode() ? !1 : p(this.returnStates, h.returnStates) && p(this.parents, h.parents) : !1;
    }
    toString() {
      if (this.isEmpty())
        return "[]";
      {
        let h = "[";
        for (let _ = 0; _ < this.returnStates.length; _++) {
          if (_ > 0 && (h = h + ", "), this.returnStates[_] === l.EMPTY_RETURN_STATE) {
            h = h + "$";
            continue;
          }
          h = h + this.returnStates[_], this.parents[_] !== null ? h = h + " " + this.parents[_] : h = h + "null";
        }
        return h + "]";
      }
    }
    get length() {
      return this.returnStates.length;
    }
  }
  function s(d, h) {
    if (h == null && (h = f.EMPTY), h.parentCtx === null || h === f.EMPTY)
      return l.EMPTY;
    const _ = s(d, h.parentCtx), M = d.states[h.invokingState].transitions[0];
    return e.create(_, M.followState.stateNumber);
  }
  function t(d, h, _, T) {
    if (d === h)
      return d;
    if (d instanceof e && h instanceof e)
      return i(d, h, _, T);
    if (_) {
      if (d instanceof a)
        return d;
      if (h instanceof a)
        return h;
    }
    return d instanceof e && (d = new u([d.getParent()], [d.returnState])), h instanceof e && (h = new u([h.getParent()], [h.returnState])), o(d, h, _, T);
  }
  function i(d, h, _, T) {
    if (T !== null) {
      let P = T.get(d, h);
      if (P !== null || (P = T.get(h, d), P !== null))
        return P;
    }
    const M = n(d, h, _);
    if (M !== null)
      return T !== null && T.set(d, h, M), M;
    if (d.returnState === h.returnState) {
      const P = t(d.parentCtx, h.parentCtx, _, T);
      if (P === d.parentCtx)
        return d;
      if (P === h.parentCtx)
        return h;
      const q = e.create(P, d.returnState);
      return T !== null && T.set(d, h, q), q;
    } else {
      let P = null;
      if ((d === h || d.parentCtx !== null && d.parentCtx === h.parentCtx) && (P = d.parentCtx), P !== null) {
        const Y = [d.returnState, h.returnState];
        d.returnState > h.returnState && (Y[0] = h.returnState, Y[1] = d.returnState);
        const w = [P, P], v = new u(w, Y);
        return T !== null && T.set(d, h, v), v;
      }
      const q = [d.returnState, h.returnState];
      let z = [d.parentCtx, h.parentCtx];
      d.returnState > h.returnState && (q[0] = h.returnState, q[1] = d.returnState, z = [h.parentCtx, d.parentCtx]);
      const W = new u(z, q);
      return T !== null && T.set(d, h, W), W;
    }
  }
  function n(d, h, _) {
    if (_) {
      if (d === l.EMPTY || h === l.EMPTY)
        return l.EMPTY;
    } else {
      if (d === l.EMPTY && h === l.EMPTY)
        return l.EMPTY;
      if (d === l.EMPTY) {
        const T = [
          h.returnState,
          l.EMPTY_RETURN_STATE
        ], M = [h.parentCtx, null];
        return new u(M, T);
      } else if (h === l.EMPTY) {
        const T = [d.returnState, l.EMPTY_RETURN_STATE], M = [d.parentCtx, null];
        return new u(M, T);
      }
    }
    return null;
  }
  function o(d, h, _, T) {
    if (T !== null) {
      let w = T.get(d, h);
      if (w !== null || (w = T.get(h, d), w !== null))
        return w;
    }
    let M = 0, P = 0, q = 0, z = [], W = [];
    for (; M < d.returnStates.length && P < h.returnStates.length; ) {
      const w = d.parents[M], v = h.parents[P];
      if (d.returnStates[M] === h.returnStates[P]) {
        const U = d.returnStates[M];
        U === l.EMPTY_RETURN_STATE && w === null && v === null || w !== null && v !== null && w === v ? (W[q] = w, z[q] = U) : (W[q] = t(w, v, _, T), z[q] = U), M += 1, P += 1;
      } else d.returnStates[M] < h.returnStates[P] ? (W[q] = w, z[q] = d.returnStates[M], M += 1) : (W[q] = v, z[q] = h.returnStates[P], P += 1);
      q += 1;
    }
    if (M < d.returnStates.length)
      for (let w = M; w < d.returnStates.length; w++)
        W[q] = d.parents[w], z[q] = d.returnStates[w], q += 1;
    else
      for (let w = P; w < h.returnStates.length; w++)
        W[q] = h.parents[w], z[q] = h.returnStates[w], q += 1;
    if (q < W.length) {
      if (q === 1) {
        const w = e.create(
          W[0],
          z[0]
        );
        return T !== null && T.set(d, h, w), w;
      }
      W = W.slice(0, q), z = z.slice(0, q);
    }
    const Y = new u(W, z);
    return Y === d ? (T !== null && T.set(d, h, d), d) : Y === h ? (T !== null && T.set(d, h, h), h) : (m(W), T !== null && T.set(d, h, Y), Y);
  }
  function m(d) {
    const h = new y();
    for (let _ = 0; _ < d.length; _++) {
      const T = d[_];
      h.containsKey(T) || h.put(T, T);
    }
    for (let _ = 0; _ < d.length; _++)
      d[_] = h.get(d[_]);
  }
  function c(d, h, _) {
    if (d.isEmpty())
      return d;
    let T = _.get(d) || null;
    if (T !== null)
      return T;
    if (T = h.get(d), T !== null)
      return _.put(d, T), T;
    let M = !1, P = [];
    for (let z = 0; z < P.length; z++) {
      const W = c(d.getParent(z), h, _);
      if (M || W !== d.getParent(z)) {
        if (!M) {
          P = [];
          for (let Y = 0; Y < d.length; Y++)
            P[Y] = d.getParent(Y);
          M = !0;
        }
        P[z] = W;
      }
    }
    if (!M)
      return h.add(d), _.put(d, d), d;
    let q = null;
    return P.length === 0 ? q = l.EMPTY : P.length === 1 ? q = e.create(P[0], d.getReturnState(0)) : q = new u(P, d.returnStates), h.add(q), _.put(q, q), _.put(d, q), q;
  }
  return ct = {
    merge: t,
    PredictionContext: l,
    PredictionContextCache: r,
    SingletonPredictionContext: e,
    predictionContextFromRuleContext: s,
    getCachedPredictionContext: c
  }, ct;
}
var ft, Zn;
function F0() {
  if (Zn) return ft;
  Zn = 1;
  const { Set: f, BitSet: C } = oe(), { Token: y } = ue(), { ATNConfig: p } = Je(), { IntervalSet: l } = me(), { RuleStopState: r } = Ue(), { RuleTransition: e, NotSetTransition: a, WildcardTransition: u, AbstractPredicateTransition: s } = Ge(), { predictionContextFromRuleContext: t, PredictionContext: i, SingletonPredictionContext: n } = Te();
  class o {
    constructor(c) {
      this.atn = c;
    }
    /**
     * Calculates the SLL(1) expected lookahead set for each outgoing transition
     * of an {@link ATNState}. The returned array has one element for each
     * outgoing transition in {@code s}. If the closure from transition
     * <em>i</em> leads to a semantic predicate before matching a symbol, the
     * element at index <em>i</em> of the result will be {@code null}.
     *
     * @param s the ATN state
     * @return the expected symbols for each outgoing transition of {@code s}.
     */
    getDecisionLookahead(c) {
      if (c === null)
        return null;
      const d = c.transitions.length, h = [];
      for (let _ = 0; _ < d; _++) {
        h[_] = new l();
        const T = new f();
        this._LOOK(
          c.transition(_).target,
          null,
          i.EMPTY,
          h[_],
          T,
          new C(),
          !1,
          !1
        ), (h[_].length === 0 || h[_].contains(o.HIT_PRED)) && (h[_] = null);
      }
      return h;
    }
    /**
     * Compute set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     *
     * <p>If {@code ctx} is {@code null} and the end of the rule containing
     * {@code s} is reached, {@link Token//EPSILON} is added to the result set.
     * If {@code ctx} is not {@code null} and the end of the outermost rule is
     * reached, {@link Token//EOF} is added to the result set.</p>
     *
     * @param s the ATN state
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx the complete parser context, or {@code null} if the context
     * should be ignored
     *
     * @return The set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     */
    LOOK(c, d, h) {
      const _ = new l(), T = !0;
      h = h || null;
      const M = h !== null ? t(c.atn, h) : null;
      return this._LOOK(c, d, M, _, new f(), new C(), T, !0), _;
    }
    /**
     * Compute set of tokens that can follow {@code s} in the ATN in the
     * specified {@code ctx}.
     *
     * <p>If {@code ctx} is {@code null} and {@code stopState} or the end of the
     * rule containing {@code s} is reached, {@link Token//EPSILON} is added to
     * the result set. If {@code ctx} is not {@code null} and {@code addEOF} is
     * {@code true} and {@code stopState} or the end of the outermost rule is
     * reached, {@link Token//EOF} is added to the result set.</p>
     *
     * @param s the ATN state.
     * @param stopState the ATN state to stop at. This can be a
     * {@link BlockEndState} to detect epsilon paths through a closure.
     * @param ctx The outer context, or {@code null} if the outer context should
     * not be used.
     * @param look The result lookahead set.
     * @param lookBusy A set used for preventing epsilon closures in the ATN
     * from causing a stack overflow. Outside code should pass
     * {@code new Set<ATNConfig>} for this argument.
     * @param calledRuleStack A set used for preventing left recursion in the
     * ATN from causing a stack overflow. Outside code should pass
     * {@code new BitSet()} for this argument.
     * @param seeThruPreds {@code true} to true semantic predicates as
     * implicitly {@code true} and "see through them", otherwise {@code false}
     * to treat semantic predicates as opaque and add {@link //HIT_PRED} to the
     * result if one is encountered.
     * @param addEOF Add {@link Token//EOF} to the result if the end of the
     * outermost context is reached. This parameter has no effect if {@code ctx}
     * is {@code null}.
     */
    _LOOK(c, d, h, _, T, M, P, q) {
      const z = new p({ state: c, alt: 0, context: h }, null);
      if (!T.contains(z)) {
        if (T.add(z), c === d) {
          if (h === null) {
            _.addOne(y.EPSILON);
            return;
          } else if (h.isEmpty() && q) {
            _.addOne(y.EOF);
            return;
          }
        }
        if (c instanceof r) {
          if (h === null) {
            _.addOne(y.EPSILON);
            return;
          } else if (h.isEmpty() && q) {
            _.addOne(y.EOF);
            return;
          }
          if (h !== i.EMPTY) {
            const W = M.contains(c.ruleIndex);
            try {
              M.remove(c.ruleIndex);
              for (let Y = 0; Y < h.length; Y++) {
                const w = this.atn.states[h.getReturnState(Y)];
                this._LOOK(w, d, h.getParent(Y), _, T, M, P, q);
              }
            } finally {
              W && M.add(c.ruleIndex);
            }
            return;
          }
        }
        for (let W = 0; W < c.transitions.length; W++) {
          const Y = c.transitions[W];
          if (Y.constructor === e) {
            if (M.contains(Y.target.ruleIndex))
              continue;
            const w = n.create(h, Y.followState.stateNumber);
            try {
              M.add(Y.target.ruleIndex), this._LOOK(Y.target, d, w, _, T, M, P, q);
            } finally {
              M.remove(Y.target.ruleIndex);
            }
          } else if (Y instanceof s)
            P ? this._LOOK(Y.target, d, h, _, T, M, P, q) : _.addOne(o.HIT_PRED);
          else if (Y.isEpsilon)
            this._LOOK(Y.target, d, h, _, T, M, P, q);
          else if (Y.constructor === u)
            _.addRange(y.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType);
          else {
            let w = Y.label;
            w !== null && (Y instanceof a && (w = w.complement(y.MIN_USER_TOKEN_TYPE, this.atn.maxTokenType)), _.addSet(w));
          }
        }
      }
    }
  }
  return o.HIT_PRED = y.INVALID_TYPE, ft = o, ft;
}
var mt, Qn;
function Ne() {
  if (Qn) return mt;
  Qn = 1;
  const f = F0(), { IntervalSet: C } = me(), { Token: y } = ue();
  class p {
    constructor(r, e) {
      this.grammarType = r, this.maxTokenType = e, this.states = [], this.decisionToState = [], this.ruleToStartState = [], this.ruleToStopState = null, this.modeNameToStartState = {}, this.ruleToTokenType = null, this.lexerActions = null, this.modeToStartState = [];
    }
    /**
     * Compute the set of valid tokens that can occur starting in state {@code s}.
     * If {@code ctx} is null, the set of tokens will not include what can follow
     * the rule surrounding {@code s}. In other words, the set will be
     * restricted to tokens reachable staying within {@code s}'s rule
     */
    nextTokensInContext(r, e) {
      return new f(this).LOOK(r, null, e);
    }
    /**
     * Compute the set of valid tokens that can occur starting in {@code s} and
     * staying in same rule. {@link Token//EPSILON} is in set if we reach end of
     * rule
     */
    nextTokensNoContext(r) {
      return r.nextTokenWithinRule !== null || (r.nextTokenWithinRule = this.nextTokensInContext(r, null), r.nextTokenWithinRule.readOnly = !0), r.nextTokenWithinRule;
    }
    nextTokens(r, e) {
      return e === void 0 ? this.nextTokensNoContext(r) : this.nextTokensInContext(r, e);
    }
    addState(r) {
      r !== null && (r.atn = this, r.stateNumber = this.states.length), this.states.push(r);
    }
    removeState(r) {
      this.states[r.stateNumber] = null;
    }
    defineDecisionState(r) {
      return this.decisionToState.push(r), r.decision = this.decisionToState.length - 1, r.decision;
    }
    getDecisionState(r) {
      return this.decisionToState.length === 0 ? null : this.decisionToState[r];
    }
    /**
     * Computes the set of input symbols which could follow ATN state number
     * {@code stateNumber} in the specified full {@code context}. This method
     * considers the complete parser context, but does not evaluate semantic
     * predicates (i.e. all predicates encountered during the calculation are
     * assumed true). If a path in the ATN exists from the starting state to the
     * {@link RuleStopState} of the outermost context without matching any
     * symbols, {@link Token//EOF} is added to the returned set.
     *
     * <p>If {@code context} is {@code null}, it is treated as
     * {@link ParserRuleContext//EMPTY}.</p>
     *
     * @param stateNumber the ATN state number
     * @param ctx the full parse context
     *
     * @return {IntervalSet} The set of potentially valid input symbols which could follow the
     * specified state in the specified context.
     *
     * @throws IllegalArgumentException if the ATN does not contain a state with
     * number {@code stateNumber}
     */
    getExpectedTokens(r, e) {
      if (r < 0 || r >= this.states.length)
        throw "Invalid state number.";
      const a = this.states[r];
      let u = this.nextTokens(a);
      if (!u.contains(y.EPSILON))
        return u;
      const s = new C();
      for (s.addSet(u), s.removeOne(y.EPSILON); e !== null && e.invokingState >= 0 && u.contains(y.EPSILON); ) {
        const i = this.states[e.invokingState].transitions[0];
        u = this.nextTokens(i.followState), s.addSet(u), s.removeOne(y.EPSILON), e = e.parentCtx;
      }
      return u.contains(y.EPSILON) && s.addOne(y.EOF), s;
    }
  }
  return p.INVALID_ALT_NUMBER = 0, mt = p, mt;
}
var ht, Xn;
function Cs() {
  return Xn || (Xn = 1, ht = {
    LEXER: 0,
    PARSER: 1
  }), ht;
}
var dt, el;
function q0() {
  if (el) return dt;
  el = 1;
  class f {
    constructor(y) {
      y === void 0 && (y = null), this.readOnly = !1, this.verifyATN = y === null ? !0 : y.verifyATN, this.generateRuleBypassTransitions = y === null ? !1 : y.generateRuleBypassTransitions;
    }
  }
  return f.defaultOptions = new f(), f.defaultOptions.readOnly = !0, dt = f, dt;
}
var pt, tl;
function D0() {
  if (tl) return pt;
  tl = 1;
  const f = {
    // The type of a {@link LexerChannelAction} action.
    CHANNEL: 0,
    // The type of a {@link LexerCustomAction} action
    CUSTOM: 1,
    // The type of a {@link LexerModeAction} action.
    MODE: 2,
    //The type of a {@link LexerMoreAction} action.
    MORE: 3,
    //The type of a {@link LexerPopModeAction} action.
    POP_MODE: 4,
    //The type of a {@link LexerPushModeAction} action.
    PUSH_MODE: 5,
    //The type of a {@link LexerSkipAction} action.
    SKIP: 6,
    //The type of a {@link LexerTypeAction} action.
    TYPE: 7
  };
  class C {
    constructor(n) {
      this.actionType = n, this.isPositionDependent = !1;
    }
    hashCode() {
      const n = new Hash();
      return this.updateHashCode(n), n.finish();
    }
    updateHashCode(n) {
      n.update(this.actionType);
    }
    equals(n) {
      return this === n;
    }
  }
  class y extends C {
    constructor() {
      super(f.SKIP);
    }
    execute(n) {
      n.skip();
    }
    toString() {
      return "skip";
    }
  }
  y.INSTANCE = new y();
  class p extends C {
    constructor(n) {
      super(f.TYPE), this.type = n;
    }
    execute(n) {
      n.type = this.type;
    }
    updateHashCode(n) {
      n.update(this.actionType, this.type);
    }
    equals(n) {
      return this === n ? !0 : n instanceof p ? this.type === n.type : !1;
    }
    toString() {
      return "type(" + this.type + ")";
    }
  }
  class l extends C {
    constructor(n) {
      super(f.PUSH_MODE), this.mode = n;
    }
    /**
     * <p>This action is implemented by calling {@link Lexer//pushMode} with the
     * value provided by {@link //getMode}.</p>
     */
    execute(n) {
      n.pushMode(this.mode);
    }
    updateHashCode(n) {
      n.update(this.actionType, this.mode);
    }
    equals(n) {
      return this === n ? !0 : n instanceof l ? this.mode === n.mode : !1;
    }
    toString() {
      return "pushMode(" + this.mode + ")";
    }
  }
  class r extends C {
    constructor() {
      super(f.POP_MODE);
    }
    /**
     * <p>This action is implemented by calling {@link Lexer//popMode}.</p>
     */
    execute(n) {
      n.popMode();
    }
    toString() {
      return "popMode";
    }
  }
  r.INSTANCE = new r();
  class e extends C {
    constructor() {
      super(f.MORE);
    }
    /**
     * <p>This action is implemented by calling {@link Lexer//popMode}.</p>
     */
    execute(n) {
      n.more();
    }
    toString() {
      return "more";
    }
  }
  e.INSTANCE = new e();
  class a extends C {
    constructor(n) {
      super(f.MODE), this.mode = n;
    }
    /**
     * <p>This action is implemented by calling {@link Lexer//mode} with the
     * value provided by {@link //getMode}.</p>
     */
    execute(n) {
      n.mode(this.mode);
    }
    updateHashCode(n) {
      n.update(this.actionType, this.mode);
    }
    equals(n) {
      return this === n ? !0 : n instanceof a ? this.mode === n.mode : !1;
    }
    toString() {
      return "mode(" + this.mode + ")";
    }
  }
  class u extends C {
    /**
     * Constructs a custom lexer action with the specified rule and action
     * indexes.
     *
     * @param ruleIndex The rule index to use for calls to
     * {@link Recognizer//action}.
     * @param actionIndex The action index to use for calls to
     * {@link Recognizer//action}.
     */
    constructor(n, o) {
      super(f.CUSTOM), this.ruleIndex = n, this.actionIndex = o, this.isPositionDependent = !0;
    }
    /**
     * <p>Custom actions are implemented by calling {@link Lexer//action} with the
     * appropriate rule and action indexes.</p>
     */
    execute(n) {
      n.action(null, this.ruleIndex, this.actionIndex);
    }
    updateHashCode(n) {
      n.update(this.actionType, this.ruleIndex, this.actionIndex);
    }
    equals(n) {
      return this === n ? !0 : n instanceof u ? this.ruleIndex === n.ruleIndex && this.actionIndex === n.actionIndex : !1;
    }
  }
  class s extends C {
    constructor(n) {
      super(f.CHANNEL), this.channel = n;
    }
    /**
     * <p>This action is implemented by calling {@link Lexer//setChannel} with the
     * value provided by {@link //getChannel}.</p>
     */
    execute(n) {
      n._channel = this.channel;
    }
    updateHashCode(n) {
      n.update(this.actionType, this.channel);
    }
    equals(n) {
      return this === n ? !0 : n instanceof s ? this.channel === n.channel : !1;
    }
    toString() {
      return "channel(" + this.channel + ")";
    }
  }
  class t extends C {
    constructor(n, o) {
      super(o.actionType), this.offset = n, this.action = o, this.isPositionDependent = !0;
    }
    /**
     * <p>This method calls {@link //execute} on the result of {@link //getAction}
     * using the provided {@code lexer}.</p>
     */
    execute(n) {
      this.action.execute(n);
    }
    updateHashCode(n) {
      n.update(this.actionType, this.offset, this.action);
    }
    equals(n) {
      return this === n ? !0 : n instanceof t ? this.offset === n.offset && this.action === n.action : !1;
    }
  }
  return pt = {
    LexerActionType: f,
    LexerSkipAction: y,
    LexerChannelAction: s,
    LexerCustomAction: u,
    LexerIndexedCustomAction: t,
    LexerMoreAction: e,
    LexerTypeAction: p,
    LexerPushModeAction: l,
    LexerPopModeAction: r,
    LexerModeAction: a
  }, pt;
}
var gt, nl;
function B0() {
  if (nl) return gt;
  nl = 1;
  const { Token: f } = ue(), C = Ne(), y = Cs(), {
    ATNState: p,
    BasicState: l,
    DecisionState: r,
    BlockStartState: e,
    BlockEndState: a,
    LoopEndState: u,
    RuleStartState: s,
    RuleStopState: t,
    TokensStartState: i,
    PlusLoopbackState: n,
    StarLoopbackState: o,
    StarLoopEntryState: m,
    PlusBlockStartState: c,
    StarBlockStartState: d,
    BasicBlockStartState: h
  } = Ue(), {
    Transition: _,
    AtomTransition: T,
    SetTransition: M,
    NotSetTransition: P,
    RuleTransition: q,
    RangeTransition: z,
    ActionTransition: W,
    EpsilonTransition: Y,
    WildcardTransition: w,
    PredicateTransition: v,
    PrecedencePredicateTransition: U
  } = Ge(), { IntervalSet: I } = me(), S = q0(), {
    LexerActionType: b,
    LexerSkipAction: E,
    LexerChannelAction: N,
    LexerCustomAction: F,
    LexerMoreAction: j,
    LexerTypeAction: $,
    LexerPushModeAction: Q,
    LexerPopModeAction: X,
    LexerModeAction: ee
  } = D0(), le = "AADB8D7E-AEEF-4415-AD2B-8204D6CF042E", ae = "59627784-3BE5-417A-B9EB-8131A7286089", ce = [le, ae], k = 3, G = ae;
  function D(J, A) {
    const R = [];
    return R[J - 1] = A, R.map(function(x) {
      return A;
    });
  }
  class B {
    constructor(A) {
      A == null && (A = S.defaultOptions), this.deserializationOptions = A, this.stateFactories = null, this.actionFactories = null;
    }
    /**
     * Determines if a particular serialized representation of an ATN supports
     * a particular feature, identified by the {@link UUID} used for serializing
     * the ATN at the time the feature was first introduced.
     *
     * @param feature The {@link UUID} marking the first time the feature was
     * supported in the serialized ATN.
     * @param actualUuid The {@link UUID} of the actual serialized ATN which is
     * currently being deserialized.
     * @return {@code true} if the {@code actualUuid} value represents a
     * serialized ATN at or after the feature identified by {@code feature} was
     * introduced; otherwise, {@code false}.
    */
    isFeatureSupported(A, R) {
      const x = ce.indexOf(A);
      return x < 0 ? !1 : ce.indexOf(R) >= x;
    }
    deserialize(A) {
      this.reset(A), this.checkVersion(), this.checkUUID();
      const R = this.readATN();
      this.readStates(R), this.readRules(R), this.readModes(R);
      const x = [];
      return this.readSets(R, x, this.readInt.bind(this)), this.isFeatureSupported(ae, this.uuid) && this.readSets(R, x, this.readInt32.bind(this)), this.readEdges(R, x), this.readDecisions(R), this.readLexerActions(R), this.markPrecedenceDecisions(R), this.verifyATN(R), this.deserializationOptions.generateRuleBypassTransitions && R.grammarType === y.PARSER && (this.generateRuleBypassTransitions(R), this.verifyATN(R)), R;
    }
    reset(A) {
      const R = function(V) {
        const g = V.charCodeAt(0);
        return g > 1 ? g - 2 : g + 65534;
      }, x = A.split("").map(R);
      x[0] = A.charCodeAt(0), this.data = x, this.pos = 0;
    }
    checkVersion() {
      const A = this.readInt();
      if (A !== k)
        throw "Could not deserialize ATN with version " + A + " (expected " + k + ").";
    }
    checkUUID() {
      const A = this.readUUID();
      if (ce.indexOf(A) < 0)
        throw G;
      this.uuid = A;
    }
    readATN() {
      const A = this.readInt(), R = this.readInt();
      return new C(A, R);
    }
    readStates(A) {
      let R, x, V;
      const g = [], L = [], O = this.readInt();
      for (let ie = 0; ie < O; ie++) {
        const ne = this.readInt();
        if (ne === p.INVALID_TYPE) {
          A.addState(null);
          continue;
        }
        let fe = this.readInt();
        fe === 65535 && (fe = -1);
        const de = this.stateFactory(ne, fe);
        if (ne === p.LOOP_END) {
          const pe = this.readInt();
          g.push([de, pe]);
        } else if (de instanceof e) {
          const pe = this.readInt();
          L.push([de, pe]);
        }
        A.addState(de);
      }
      for (R = 0; R < g.length; R++)
        x = g[R], x[0].loopBackState = A.states[x[1]];
      for (R = 0; R < L.length; R++)
        x = L[R], x[0].endState = A.states[x[1]];
      let Z = this.readInt();
      for (R = 0; R < Z; R++)
        V = this.readInt(), A.states[V].nonGreedy = !0;
      let te = this.readInt();
      for (R = 0; R < te; R++)
        V = this.readInt(), A.states[V].isPrecedenceRule = !0;
    }
    readRules(A) {
      let R;
      const x = this.readInt();
      for (A.grammarType === y.LEXER && (A.ruleToTokenType = D(x, 0)), A.ruleToStartState = D(x, 0), R = 0; R < x; R++) {
        const V = this.readInt();
        if (A.ruleToStartState[R] = A.states[V], A.grammarType === y.LEXER) {
          let g = this.readInt();
          g === 65535 && (g = f.EOF), A.ruleToTokenType[R] = g;
        }
      }
      for (A.ruleToStopState = D(x, 0), R = 0; R < A.states.length; R++) {
        const V = A.states[R];
        V instanceof t && (A.ruleToStopState[V.ruleIndex] = V, A.ruleToStartState[V.ruleIndex].stopState = V);
      }
    }
    readModes(A) {
      const R = this.readInt();
      for (let x = 0; x < R; x++) {
        let V = this.readInt();
        A.modeToStartState.push(A.states[V]);
      }
    }
    readSets(A, R, x) {
      const V = this.readInt();
      for (let g = 0; g < V; g++) {
        const L = new I();
        R.push(L);
        const O = this.readInt();
        this.readInt() !== 0 && L.addOne(-1);
        for (let te = 0; te < O; te++) {
          const ie = x(), ne = x();
          L.addRange(ie, ne);
        }
      }
    }
    readEdges(A, R) {
      let x, V, g, L, O;
      const Z = this.readInt();
      for (x = 0; x < Z; x++) {
        const te = this.readInt(), ie = this.readInt(), ne = this.readInt(), fe = this.readInt(), de = this.readInt(), pe = this.readInt();
        L = this.edgeFactory(A, ne, te, ie, fe, de, pe, R), A.states[te].addTransition(L);
      }
      for (x = 0; x < A.states.length; x++)
        for (g = A.states[x], V = 0; V < g.transitions.length; V++) {
          const te = g.transitions[V];
          if (!(te instanceof q))
            continue;
          let ie = -1;
          A.ruleToStartState[te.target.ruleIndex].isPrecedenceRule && te.precedence === 0 && (ie = te.target.ruleIndex), L = new Y(te.followState, ie), A.ruleToStopState[te.target.ruleIndex].addTransition(L);
        }
      for (x = 0; x < A.states.length; x++) {
        if (g = A.states[x], g instanceof e) {
          if (g.endState === null || g.endState.startState !== null)
            throw "IllegalState";
          g.endState.startState = g;
        }
        if (g instanceof n)
          for (V = 0; V < g.transitions.length; V++)
            O = g.transitions[V].target, O instanceof c && (O.loopBackState = g);
        else if (g instanceof o)
          for (V = 0; V < g.transitions.length; V++)
            O = g.transitions[V].target, O instanceof m && (O.loopBackState = g);
      }
    }
    readDecisions(A) {
      const R = this.readInt();
      for (let x = 0; x < R; x++) {
        const V = this.readInt(), g = A.states[V];
        A.decisionToState.push(g), g.decision = x;
      }
    }
    readLexerActions(A) {
      if (A.grammarType === y.LEXER) {
        const R = this.readInt();
        A.lexerActions = D(R, null);
        for (let x = 0; x < R; x++) {
          const V = this.readInt();
          let g = this.readInt();
          g === 65535 && (g = -1);
          let L = this.readInt();
          L === 65535 && (L = -1), A.lexerActions[x] = this.lexerActionFactory(V, g, L);
        }
      }
    }
    generateRuleBypassTransitions(A) {
      let R;
      const x = A.ruleToStartState.length;
      for (R = 0; R < x; R++)
        A.ruleToTokenType[R] = A.maxTokenType + R + 1;
      for (R = 0; R < x; R++)
        this.generateRuleBypassTransition(A, R);
    }
    generateRuleBypassTransition(A, R) {
      let x, V;
      const g = new h();
      g.ruleIndex = R, A.addState(g);
      const L = new a();
      L.ruleIndex = R, A.addState(L), g.endState = L, A.defineDecisionState(g), L.startState = g;
      let O = null, Z = null;
      if (A.ruleToStartState[R].isPrecedenceRule) {
        for (Z = null, x = 0; x < A.states.length; x++)
          if (V = A.states[x], this.stateIsEndStateFor(V, R)) {
            Z = V, O = V.loopBackState.transitions[0];
            break;
          }
        if (O === null)
          throw "Couldn't identify final state of the precedence rule prefix section.";
      } else
        Z = A.ruleToStopState[R];
      for (x = 0; x < A.states.length; x++) {
        V = A.states[x];
        for (let fe = 0; fe < V.transitions.length; fe++) {
          const de = V.transitions[fe];
          de !== O && de.target === Z && (de.target = L);
        }
      }
      const te = A.ruleToStartState[R], ie = te.transitions.length;
      for (; ie > 0; )
        g.addTransition(te.transitions[ie - 1]), te.transitions = te.transitions.slice(-1);
      A.ruleToStartState[R].addTransition(new Y(g)), L.addTransition(new Y(Z));
      const ne = new l();
      A.addState(ne), ne.addTransition(new T(L, A.ruleToTokenType[R])), g.addTransition(new Y(ne));
    }
    stateIsEndStateFor(A, R) {
      if (A.ruleIndex !== R || !(A instanceof m))
        return null;
      const x = A.transitions[A.transitions.length - 1].target;
      return x instanceof u && x.epsilonOnlyTransitions && x.transitions[0].target instanceof t ? A : null;
    }
    /**
     * Analyze the {@link StarLoopEntryState} states in the specified ATN to set
     * the {@link StarLoopEntryState//isPrecedenceDecision} field to the
     * correct value.
     * @param atn The ATN.
     */
    markPrecedenceDecisions(A) {
      for (let R = 0; R < A.states.length; R++) {
        const x = A.states[R];
        if (x instanceof m && A.ruleToStartState[x.ruleIndex].isPrecedenceRule) {
          const V = x.transitions[x.transitions.length - 1].target;
          V instanceof u && V.epsilonOnlyTransitions && V.transitions[0].target instanceof t && (x.isPrecedenceDecision = !0);
        }
      }
    }
    verifyATN(A) {
      if (this.deserializationOptions.verifyATN)
        for (let R = 0; R < A.states.length; R++) {
          const x = A.states[R];
          if (x !== null)
            if (this.checkCondition(x.epsilonOnlyTransitions || x.transitions.length <= 1), x instanceof c)
              this.checkCondition(x.loopBackState !== null);
            else if (x instanceof m)
              if (this.checkCondition(x.loopBackState !== null), this.checkCondition(x.transitions.length === 2), x.transitions[0].target instanceof d)
                this.checkCondition(x.transitions[1].target instanceof u), this.checkCondition(!x.nonGreedy);
              else if (x.transitions[0].target instanceof u)
                this.checkCondition(x.transitions[1].target instanceof d), this.checkCondition(x.nonGreedy);
              else
                throw "IllegalState";
            else x instanceof o ? (this.checkCondition(x.transitions.length === 1), this.checkCondition(x.transitions[0].target instanceof m)) : x instanceof u ? this.checkCondition(x.loopBackState !== null) : x instanceof s ? this.checkCondition(x.stopState !== null) : x instanceof e ? this.checkCondition(x.endState !== null) : x instanceof a ? this.checkCondition(x.startState !== null) : x instanceof r ? this.checkCondition(x.transitions.length <= 1 || x.decision >= 0) : this.checkCondition(x.transitions.length <= 1 || x instanceof t);
        }
    }
    checkCondition(A, R) {
      if (!A)
        throw R == null && (R = "IllegalState"), R;
    }
    readInt() {
      return this.data[this.pos++];
    }
    readInt32() {
      const A = this.readInt(), R = this.readInt();
      return A | R << 16;
    }
    readLong() {
      const A = this.readInt32(), R = this.readInt32();
      return A & 4294967295 | R << 32;
    }
    readUUID() {
      const A = [];
      for (let R = 7; R >= 0; R--) {
        const x = this.readInt();
        A[2 * R + 1] = x & 255, A[2 * R] = x >> 8 & 255;
      }
      return H[A[0]] + H[A[1]] + H[A[2]] + H[A[3]] + "-" + H[A[4]] + H[A[5]] + "-" + H[A[6]] + H[A[7]] + "-" + H[A[8]] + H[A[9]] + "-" + H[A[10]] + H[A[11]] + H[A[12]] + H[A[13]] + H[A[14]] + H[A[15]];
    }
    edgeFactory(A, R, x, V, g, L, O, Z) {
      const te = A.states[V];
      switch (R) {
        case _.EPSILON:
          return new Y(te);
        case _.RANGE:
          return O !== 0 ? new z(te, f.EOF, L) : new z(te, g, L);
        case _.RULE:
          return new q(A.states[g], L, O, te);
        case _.PREDICATE:
          return new v(te, g, L, O !== 0);
        case _.PRECEDENCE:
          return new U(te, g);
        case _.ATOM:
          return O !== 0 ? new T(te, f.EOF) : new T(te, g);
        case _.ACTION:
          return new W(te, g, L, O !== 0);
        case _.SET:
          return new M(te, Z[g]);
        case _.NOT_SET:
          return new P(te, Z[g]);
        case _.WILDCARD:
          return new w(te);
        default:
          throw "The specified transition type: " + R + " is not valid.";
      }
    }
    stateFactory(A, R) {
      if (this.stateFactories === null) {
        const x = [];
        x[p.INVALID_TYPE] = null, x[p.BASIC] = () => new l(), x[p.RULE_START] = () => new s(), x[p.BLOCK_START] = () => new h(), x[p.PLUS_BLOCK_START] = () => new c(), x[p.STAR_BLOCK_START] = () => new d(), x[p.TOKEN_START] = () => new i(), x[p.RULE_STOP] = () => new t(), x[p.BLOCK_END] = () => new a(), x[p.STAR_LOOP_BACK] = () => new o(), x[p.STAR_LOOP_ENTRY] = () => new m(), x[p.PLUS_LOOP_BACK] = () => new n(), x[p.LOOP_END] = () => new u(), this.stateFactories = x;
      }
      if (A > this.stateFactories.length || this.stateFactories[A] === null)
        throw "The specified state type " + A + " is not valid.";
      {
        const x = this.stateFactories[A]();
        if (x !== null)
          return x.ruleIndex = R, x;
      }
    }
    lexerActionFactory(A, R, x) {
      if (this.actionFactories === null) {
        const V = [];
        V[b.CHANNEL] = (g, L) => new N(g), V[b.CUSTOM] = (g, L) => new F(g, L), V[b.MODE] = (g, L) => new ee(g), V[b.MORE] = (g, L) => j.INSTANCE, V[b.POP_MODE] = (g, L) => X.INSTANCE, V[b.PUSH_MODE] = (g, L) => new Q(g), V[b.SKIP] = (g, L) => E.INSTANCE, V[b.TYPE] = (g, L) => new $(g), this.actionFactories = V;
      }
      if (A > this.actionFactories.length || this.actionFactories[A] === null)
        throw "The specified lexer action type " + A + " is not valid.";
      return this.actionFactories[A](R, x);
    }
  }
  function K() {
    const J = [];
    for (let A = 0; A < 256; A++)
      J[A] = (A + 256).toString(16).substr(1).toUpperCase();
    return J;
  }
  const H = K();
  return gt = B, gt;
}
var Ct, ll;
function je() {
  if (ll) return Ct;
  ll = 1;
  class f {
    syntaxError(l, r, e, a, u, s) {
    }
    reportAmbiguity(l, r, e, a, u, s, t) {
    }
    reportAttemptingFullContext(l, r, e, a, u, s) {
    }
    reportContextSensitivity(l, r, e, a, u, s) {
    }
  }
  class C extends f {
    constructor() {
      super();
    }
    syntaxError(l, r, e, a, u, s) {
      console.error("line " + e + ":" + a + " " + u);
    }
  }
  C.INSTANCE = new C();
  class y extends f {
    constructor(l) {
      if (super(), l === null)
        throw "delegates";
      return this.delegates = l, this;
    }
    syntaxError(l, r, e, a, u, s) {
      this.delegates.map((t) => t.syntaxError(l, r, e, a, u, s));
    }
    reportAmbiguity(l, r, e, a, u, s, t) {
      this.delegates.map((i) => i.reportAmbiguity(l, r, e, a, u, s, t));
    }
    reportAttemptingFullContext(l, r, e, a, u, s) {
      this.delegates.map((t) => t.reportAttemptingFullContext(l, r, e, a, u, s));
    }
    reportContextSensitivity(l, r, e, a, u, s) {
      this.delegates.map((t) => t.reportContextSensitivity(l, r, e, a, u, s));
    }
  }
  return Ct = { ErrorListener: f, ConsoleErrorListener: C, ProxyErrorListener: y }, Ct;
}
var yt, sl;
function H0() {
  if (sl) return yt;
  sl = 1;
  const { Token: f } = ue(), { ConsoleErrorListener: C } = je(), { ProxyErrorListener: y } = je();
  class p {
    constructor() {
      this._listeners = [C.INSTANCE], this._interp = null, this._stateNumber = -1;
    }
    checkVersion(r) {
      const e = "4.9.3";
      e !== r && console.log("ANTLR runtime and generated code versions disagree: " + e + "!=" + r);
    }
    addErrorListener(r) {
      this._listeners.push(r);
    }
    removeErrorListeners() {
      this._listeners = [];
    }
    getLiteralNames() {
      return Object.getPrototypeOf(this).constructor.literalNames || [];
    }
    getSymbolicNames() {
      return Object.getPrototypeOf(this).constructor.symbolicNames || [];
    }
    getTokenNames() {
      if (!this.tokenNames) {
        const r = this.getLiteralNames(), e = this.getSymbolicNames(), a = r.length > e.length ? r.length : e.length;
        this.tokenNames = [];
        for (let u = 0; u < a; u++)
          this.tokenNames[u] = r[u] || e[u] || "<INVALID";
      }
      return this.tokenNames;
    }
    getTokenTypeMap() {
      const r = this.getTokenNames();
      if (r === null)
        throw "The current recognizer does not provide a list of token names.";
      let e = this.tokenTypeMapCache[r];
      return e === void 0 && (e = r.reduce(function(a, u, s) {
        a[u] = s;
      }), e.EOF = f.EOF, this.tokenTypeMapCache[r] = e), e;
    }
    /**
     * Get a map from rule names to rule indexes.
     * <p>Used for XPath and tree pattern compilation.</p>
     */
    getRuleIndexMap() {
      const r = this.ruleNames;
      if (r === null)
        throw "The current recognizer does not provide a list of rule names.";
      let e = this.ruleIndexMapCache[r];
      return e === void 0 && (e = r.reduce(function(a, u, s) {
        a[u] = s;
      }), this.ruleIndexMapCache[r] = e), e;
    }
    getTokenType(r) {
      const e = this.getTokenTypeMap()[r];
      return e !== void 0 ? e : f.INVALID_TYPE;
    }
    // What is the error header, normally line/character position information?
    getErrorHeader(r) {
      const e = r.getOffendingToken().line, a = r.getOffendingToken().column;
      return "line " + e + ":" + a;
    }
    /**
     * How should a token be displayed in an error message? The default
     * is to display just the text, but during development you might
     * want to have a lot of information spit out.  Override in that case
     * to use t.toString() (which, for CommonToken, dumps everything about
     * the token). This is better than forcing you to override a method in
     * your token objects because you don't have to go modify your lexer
     * so that it creates a new Java type.
     *
     * @deprecated This method is not called by the ANTLR 4 Runtime. Specific
     * implementations of {@link ANTLRErrorStrategy} may provide a similar
     * feature when necessary. For example, see
     * {@link DefaultErrorStrategy//getTokenErrorDisplay}.*/
    getTokenErrorDisplay(r) {
      if (r === null)
        return "<no token>";
      let e = r.text;
      return e === null && (r.type === f.EOF ? e = "<EOF>" : e = "<" + r.type + ">"), e = e.replace(`
`, "\\n").replace("\r", "\\r").replace("	", "\\t"), "'" + e + "'";
    }
    getErrorListenerDispatch() {
      return new y(this._listeners);
    }
    /**
     * subclass needs to override these if there are sempreds or actions
     * that the ATN interp needs to execute
     */
    sempred(r, e, a) {
      return !0;
    }
    precpred(r, e) {
      return !0;
    }
    get state() {
      return this._stateNumber;
    }
    set state(r) {
      this._stateNumber = r;
    }
  }
  return p.tokenTypeMapCache = {}, p.ruleIndexMapCache = {}, yt = p, yt;
}
var _t, il;
function ys() {
  if (il) return _t;
  il = 1;
  const f = ue().CommonToken;
  class C {
  }
  class y extends C {
    constructor(l) {
      super(), this.copyText = l === void 0 ? !1 : l;
    }
    create(l, r, e, a, u, s, t, i) {
      const n = new f(l, r, a, u, s);
      return n.line = t, n.column = i, e !== null ? n.text = e : this.copyText && l[1] !== null && (n.text = l[1].getText(u, s)), n;
    }
    createThin(l, r) {
      const e = new f(null, l);
      return e.text = r, e;
    }
  }
  return y.DEFAULT = new y(), _t = y, _t;
}
var Lt, rl;
function Ce() {
  if (rl) return Lt;
  rl = 1;
  const { PredicateTransition: f } = Ge(), { Interval: C } = me().Interval;
  class y extends Error {
    constructor(t) {
      super(t.message), Error.captureStackTrace ? Error.captureStackTrace(this, y) : new Error().stack, this.message = t.message, this.recognizer = t.recognizer, this.input = t.input, this.ctx = t.ctx, this.offendingToken = null, this.offendingState = -1, this.recognizer !== null && (this.offendingState = this.recognizer.state);
    }
    /**
     * Gets the set of input symbols which could potentially follow the
     * previously matched symbol at the time this exception was thrown.
     *
     * <p>If the set of expected tokens is not known and could not be computed,
     * this method returns {@code null}.</p>
     *
     * @return The set of token types that could potentially follow the current
     * state in the ATN, or {@code null} if the information is not available.
     */
    getExpectedTokens() {
      return this.recognizer !== null ? this.recognizer.atn.getExpectedTokens(this.offendingState, this.ctx) : null;
    }
    // <p>If the state number is not known, this method returns -1.</p>
    toString() {
      return this.message;
    }
  }
  class p extends y {
    constructor(t, i, n, o) {
      super({ message: "", recognizer: t, input: i, ctx: null }), this.startIndex = n, this.deadEndConfigs = o;
    }
    toString() {
      let t = "";
      return this.startIndex >= 0 && this.startIndex < this.input.size && (t = this.input.getText(new C(this.startIndex, this.startIndex))), "LexerNoViableAltException" + t;
    }
  }
  class l extends y {
    constructor(t, i, n, o, m, c) {
      c = c || t._ctx, o = o || t.getCurrentToken(), n = n || t.getCurrentToken(), i = i || t.getInputStream(), super({ message: "", recognizer: t, input: i, ctx: c }), this.deadEndConfigs = m, this.startToken = n, this.offendingToken = o;
    }
  }
  class r extends y {
    constructor(t) {
      super({ message: "", recognizer: t, input: t.getInputStream(), ctx: t._ctx }), this.offendingToken = t.getCurrentToken();
    }
  }
  function e(s, t) {
    return t !== null ? t : "failed predicate: {" + s + "}?";
  }
  class a extends y {
    constructor(t, i, n) {
      super({
        message: e(i, n || null),
        recognizer: t,
        input: t.getInputStream(),
        ctx: t._ctx
      });
      const m = t._interp.atn.states[t.state].transitions[0];
      m instanceof f ? (this.ruleIndex = m.ruleIndex, this.predicateIndex = m.predIndex) : (this.ruleIndex = 0, this.predicateIndex = 0), this.predicate = i, this.offendingToken = t.getCurrentToken();
    }
  }
  class u extends Error {
    constructor() {
      super(), Error.captureStackTrace(this, u);
    }
  }
  return Lt = {
    RecognitionException: y,
    NoViableAltException: l,
    LexerNoViableAltException: p,
    InputMismatchException: r,
    FailedPredicateException: a,
    ParseCancellationException: u
  }, Lt;
}
var Tt, ul;
function Ye() {
  if (ul) return Tt;
  ul = 1;
  const { Token: f } = ue(), C = H0(), y = ys(), { RecognitionException: p } = Ce(), { LexerNoViableAltException: l } = Ce();
  class r extends C {
    constructor(a) {
      super(), this._input = a, this._factory = y.DEFAULT, this._tokenFactorySourcePair = [this, a], this._interp = null, this._token = null, this._tokenStartCharIndex = -1, this._tokenStartLine = -1, this._tokenStartColumn = -1, this._hitEOF = !1, this._channel = f.DEFAULT_CHANNEL, this._type = f.INVALID_TYPE, this._modeStack = [], this._mode = r.DEFAULT_MODE, this._text = null;
    }
    reset() {
      this._input !== null && this._input.seek(0), this._token = null, this._type = f.INVALID_TYPE, this._channel = f.DEFAULT_CHANNEL, this._tokenStartCharIndex = -1, this._tokenStartColumn = -1, this._tokenStartLine = -1, this._text = null, this._hitEOF = !1, this._mode = r.DEFAULT_MODE, this._modeStack = [], this._interp.reset();
    }
    // Return a token from this source; i.e., match a token on the char stream.
    nextToken() {
      if (this._input === null)
        throw "nextToken requires a non-null input stream.";
      const a = this._input.mark();
      try {
        for (; ; ) {
          if (this._hitEOF)
            return this.emitEOF(), this._token;
          this._token = null, this._channel = f.DEFAULT_CHANNEL, this._tokenStartCharIndex = this._input.index, this._tokenStartColumn = this._interp.column, this._tokenStartLine = this._interp.line, this._text = null;
          let u = !1;
          for (; ; ) {
            this._type = f.INVALID_TYPE;
            let s = r.SKIP;
            try {
              s = this._interp.match(this._input, this._mode);
            } catch (t) {
              if (t instanceof p)
                this.notifyListeners(t), this.recover(t);
              else
                throw console.log(t.stack), t;
            }
            if (this._input.LA(1) === f.EOF && (this._hitEOF = !0), this._type === f.INVALID_TYPE && (this._type = s), this._type === r.SKIP) {
              u = !0;
              break;
            }
            if (this._type !== r.MORE)
              break;
          }
          if (!u)
            return this._token === null && this.emit(), this._token;
        }
      } finally {
        this._input.release(a);
      }
    }
    /**
     * Instruct the lexer to skip creating a token for current lexer rule
     * and look for another token. nextToken() knows to keep looking when
     * a lexer rule finishes with token set to SKIP_TOKEN. Recall that
     * if token==null at end of any token rule, it creates one for you
     * and emits it.
     */
    skip() {
      this._type = r.SKIP;
    }
    more() {
      this._type = r.MORE;
    }
    mode(a) {
      this._mode = a;
    }
    pushMode(a) {
      this._interp.debug && console.log("pushMode " + a), this._modeStack.push(this._mode), this.mode(a);
    }
    popMode() {
      if (this._modeStack.length === 0)
        throw "Empty Stack";
      return this._interp.debug && console.log("popMode back to " + this._modeStack.slice(0, -1)), this.mode(this._modeStack.pop()), this._mode;
    }
    /**
     * By default does not support multiple emits per nextToken invocation
     * for efficiency reasons. Subclass and override this method, nextToken,
     * and getToken (to push tokens into a list and pull from that list
     * rather than a single variable as this implementation does).
     */
    emitToken(a) {
      this._token = a;
    }
    /**
     * The standard method called to automatically emit a token at the
     * outermost lexical rule. The token object should point into the
     * char buffer start..stop. If there is a text override in 'text',
     * use that to set the token's text. Override this method to emit
     * custom Token objects or provide a new factory.
     */
    emit() {
      const a = this._factory.create(
        this._tokenFactorySourcePair,
        this._type,
        this._text,
        this._channel,
        this._tokenStartCharIndex,
        this.getCharIndex() - 1,
        this._tokenStartLine,
        this._tokenStartColumn
      );
      return this.emitToken(a), a;
    }
    emitEOF() {
      const a = this.column, u = this.line, s = this._factory.create(
        this._tokenFactorySourcePair,
        f.EOF,
        null,
        f.DEFAULT_CHANNEL,
        this._input.index,
        this._input.index - 1,
        u,
        a
      );
      return this.emitToken(s), s;
    }
    // What is the index of the current character of lookahead?///
    getCharIndex() {
      return this._input.index;
    }
    /**
     * Return a list of all Token objects in input char stream.
     * Forces load of all tokens. Does not include EOF token.
     */
    getAllTokens() {
      const a = [];
      let u = this.nextToken();
      for (; u.type !== f.EOF; )
        a.push(u), u = this.nextToken();
      return a;
    }
    notifyListeners(a) {
      const u = this._tokenStartCharIndex, s = this._input.index, t = this._input.getText(u, s), i = "token recognition error at: '" + this.getErrorDisplay(t) + "'";
      this.getErrorListenerDispatch().syntaxError(
        this,
        null,
        this._tokenStartLine,
        this._tokenStartColumn,
        i,
        a
      );
    }
    getErrorDisplay(a) {
      const u = [];
      for (let s = 0; s < a.length; s++)
        u.push(a[s]);
      return u.join("");
    }
    getErrorDisplayForChar(a) {
      return a.charCodeAt(0) === f.EOF ? "<EOF>" : a === `
` ? "\\n" : a === "	" ? "\\t" : a === "\r" ? "\\r" : a;
    }
    getCharErrorDisplay(a) {
      return "'" + this.getErrorDisplayForChar(a) + "'";
    }
    /**
     * Lexers can normally match any char in it's vocabulary after matching
     * a token, so do the easy thing and just kill a character and hope
     * it all works out. You can instead use the rule invocation stack
     * to do sophisticated error recovery if you are in a fragment rule.
     */
    recover(a) {
      this._input.LA(1) !== f.EOF && (a instanceof l ? this._interp.consume(this._input) : this._input.consume());
    }
    get inputStream() {
      return this._input;
    }
    set inputStream(a) {
      this._input = null, this._tokenFactorySourcePair = [this, this._input], this.reset(), this._input = a, this._tokenFactorySourcePair = [this, this._input];
    }
    get sourceName() {
      return this._input.sourceName;
    }
    get type() {
      return this._type;
    }
    set type(a) {
      this._type = a;
    }
    get line() {
      return this._interp.line;
    }
    set line(a) {
      this._interp.line = a;
    }
    get column() {
      return this._interp.column;
    }
    set column(a) {
      this._interp.column = a;
    }
    get text() {
      return this._text !== null ? this._text : this._interp.getText(this._input);
    }
    set text(a) {
      this._text = a;
    }
  }
  return r.DEFAULT_MODE = 0, r.MORE = -2, r.SKIP = -3, r.DEFAULT_TOKEN_CHANNEL = f.DEFAULT_CHANNEL, r.HIDDEN = f.HIDDEN_CHANNEL, r.MIN_CHAR_VALUE = 0, r.MAX_CHAR_VALUE = 1114111, Tt = r, Tt;
}
var Ut, al;
function Oe() {
  if (al) return Ut;
  al = 1;
  const f = Ne(), C = oe(), { SemanticContext: y } = Ve(), { merge: p } = Te();
  function l(u) {
    return u.hashCodeForConfigSet();
  }
  function r(u, s) {
    return u === s ? !0 : u === null || s === null ? !1 : u.equalsForConfigSet(s);
  }
  class e {
    constructor(s) {
      this.configLookup = new C.Set(l, r), this.fullCtx = s === void 0 ? !0 : s, this.readOnly = !1, this.configs = [], this.uniqueAlt = 0, this.conflictingAlts = null, this.hasSemanticContext = !1, this.dipsIntoOuterContext = !1, this.cachedHashCode = -1;
    }
    /**
     * Adding a new config means merging contexts with existing configs for
     * {@code (s, i, pi, _)}, where {@code s} is the
     * {@link ATNConfig//state}, {@code i} is the {@link ATNConfig//alt}, and
     * {@code pi} is the {@link ATNConfig//semanticContext}. We use
     * {@code (s,i,pi)} as key.
     *
     * <p>This method updates {@link //dipsIntoOuterContext} and
     * {@link //hasSemanticContext} when necessary.</p>
     */
    add(s, t) {
      if (t === void 0 && (t = null), this.readOnly)
        throw "This set is readonly";
      s.semanticContext !== y.NONE && (this.hasSemanticContext = !0), s.reachesIntoOuterContext > 0 && (this.dipsIntoOuterContext = !0);
      const i = this.configLookup.add(s);
      if (i === s)
        return this.cachedHashCode = -1, this.configs.push(s), !0;
      const n = !this.fullCtx, o = p(i.context, s.context, n, t);
      return i.reachesIntoOuterContext = Math.max(i.reachesIntoOuterContext, s.reachesIntoOuterContext), s.precedenceFilterSuppressed && (i.precedenceFilterSuppressed = !0), i.context = o, !0;
    }
    getStates() {
      const s = new C.Set();
      for (let t = 0; t < this.configs.length; t++)
        s.add(this.configs[t].state);
      return s;
    }
    getPredicates() {
      const s = [];
      for (let t = 0; t < this.configs.length; t++) {
        const i = this.configs[t].semanticContext;
        i !== y.NONE && s.push(i.semanticContext);
      }
      return s;
    }
    optimizeConfigs(s) {
      if (this.readOnly)
        throw "This set is readonly";
      if (this.configLookup.length !== 0)
        for (let t = 0; t < this.configs.length; t++) {
          const i = this.configs[t];
          i.context = s.getCachedContext(i.context);
        }
    }
    addAll(s) {
      for (let t = 0; t < s.length; t++)
        this.add(s[t]);
      return !1;
    }
    equals(s) {
      return this === s || s instanceof e && C.equalArrays(this.configs, s.configs) && this.fullCtx === s.fullCtx && this.uniqueAlt === s.uniqueAlt && this.conflictingAlts === s.conflictingAlts && this.hasSemanticContext === s.hasSemanticContext && this.dipsIntoOuterContext === s.dipsIntoOuterContext;
    }
    hashCode() {
      const s = new C.Hash();
      return s.update(this.configs), s.finish();
    }
    updateHashCode(s) {
      this.readOnly ? (this.cachedHashCode === -1 && (this.cachedHashCode = this.hashCode()), s.update(this.cachedHashCode)) : s.update(this.hashCode());
    }
    isEmpty() {
      return this.configs.length === 0;
    }
    contains(s) {
      if (this.configLookup === null)
        throw "This method is not implemented for readonly sets.";
      return this.configLookup.contains(s);
    }
    containsFast(s) {
      if (this.configLookup === null)
        throw "This method is not implemented for readonly sets.";
      return this.configLookup.containsFast(s);
    }
    clear() {
      if (this.readOnly)
        throw "This set is readonly";
      this.configs = [], this.cachedHashCode = -1, this.configLookup = new C.Set();
    }
    setReadonly(s) {
      this.readOnly = s, s && (this.configLookup = null);
    }
    toString() {
      return C.arrayToString(this.configs) + (this.hasSemanticContext ? ",hasSemanticContext=" + this.hasSemanticContext : "") + (this.uniqueAlt !== f.INVALID_ALT_NUMBER ? ",uniqueAlt=" + this.uniqueAlt : "") + (this.conflictingAlts !== null ? ",conflictingAlts=" + this.conflictingAlts : "") + (this.dipsIntoOuterContext ? ",dipsIntoOuterContext" : "");
    }
    get items() {
      return this.configs;
    }
    get length() {
      return this.configs.length;
    }
  }
  class a extends e {
    constructor() {
      super(), this.configLookup = new C.Set();
    }
  }
  return Ut = {
    ATNConfigSet: e,
    OrderedATNConfigSet: a
  }, Ut;
}
var xt, ol;
function ze() {
  if (ol) return xt;
  ol = 1;
  const { ATNConfigSet: f } = Oe(), { Hash: C, Set: y } = oe();
  class p {
    constructor(e, a) {
      this.alt = a, this.pred = e;
    }
    toString() {
      return "(" + this.pred + ", " + this.alt + ")";
    }
  }
  class l {
    constructor(e, a) {
      return e === null && (e = -1), a === null && (a = new f()), this.stateNumber = e, this.configs = a, this.edges = null, this.isAcceptState = !1, this.prediction = 0, this.lexerActionExecutor = null, this.requiresFullContext = !1, this.predicates = null, this;
    }
    /**
     * Get the set of all alts mentioned by all ATN configurations in this
     * DFA state.
     */
    getAltSet() {
      const e = new y();
      if (this.configs !== null)
        for (let a = 0; a < this.configs.length; a++) {
          const u = this.configs[a];
          e.add(u.alt);
        }
      return e.length === 0 ? null : e;
    }
    /**
     * Two {@link DFAState} instances are equal if their ATN configuration sets
     * are the same. This method is used to see if a state already exists.
     *
     * <p>Because the number of alternatives and number of ATN configurations are
     * finite, there is a finite number of DFA states that can be processed.
     * This is necessary to show that the algorithm terminates.</p>
     *
     * <p>Cannot test the DFA state numbers here because in
     * {@link ParserATNSimulator//addDFAState} we need to know if any other state
     * exists that has this exact set of ATN configurations. The
     * {@link //stateNumber} is irrelevant.</p>
     */
    equals(e) {
      return this === e || e instanceof l && this.configs.equals(e.configs);
    }
    toString() {
      let e = "" + this.stateNumber + ":" + this.configs;
      return this.isAcceptState && (e = e + "=>", this.predicates !== null ? e = e + this.predicates : e = e + this.prediction), e;
    }
    hashCode() {
      const e = new C();
      return e.update(this.configs), e.finish();
    }
  }
  return xt = { DFAState: l, PredPrediction: p }, xt;
}
var bt, cl;
function V0() {
  if (cl) return bt;
  cl = 1;
  const { DFAState: f } = ze(), { ATNConfigSet: C } = Oe(), { getCachedPredictionContext: y } = Te(), { Map: p } = oe();
  class l {
    constructor(e, a) {
      return this.atn = e, this.sharedContextCache = a, this;
    }
    getCachedContext(e) {
      if (this.sharedContextCache === null)
        return e;
      const a = new p();
      return y(e, this.sharedContextCache, a);
    }
  }
  return l.ERROR = new f(2147483647, new C()), bt = l, bt;
}
var vt, fl;
function _s() {
  if (fl) return vt;
  fl = 1;
  const { hashStuff: f } = oe(), { LexerIndexedCustomAction: C } = D0();
  class y {
    /**
     * Represents an executor for a sequence of lexer actions which traversed during
     * the matching operation of a lexer rule (token).
     *
     * <p>The executor tracks position information for position-dependent lexer actions
     * efficiently, ensuring that actions appearing only at the end of the rule do
     * not cause bloating of the {@link DFA} created for the lexer.</p>
     */
    constructor(l) {
      return this.lexerActions = l === null ? [] : l, this.cachedHashCode = f(l), this;
    }
    /**
     * Creates a {@link LexerActionExecutor} which encodes the current offset
     * for position-dependent lexer actions.
     *
     * <p>Normally, when the executor encounters lexer actions where
     * {@link LexerAction//isPositionDependent} returns {@code true}, it calls
     * {@link IntStream//seek} on the input {@link CharStream} to set the input
     * position to the <em>end</em> of the current token. This behavior provides
     * for efficient DFA representation of lexer actions which appear at the end
     * of a lexer rule, even when the lexer rule matches a variable number of
     * characters.</p>
     *
     * <p>Prior to traversing a match transition in the ATN, the current offset
     * from the token start index is assigned to all position-dependent lexer
     * actions which have not already been assigned a fixed offset. By storing
     * the offsets relative to the token start index, the DFA representation of
     * lexer actions which appear in the middle of tokens remains efficient due
     * to sharing among tokens of the same length, regardless of their absolute
     * position in the input stream.</p>
     *
     * <p>If the current executor already has offsets assigned to all
     * position-dependent lexer actions, the method returns {@code this}.</p>
     *
     * @param offset The current offset to assign to all position-dependent
     * lexer actions which do not already have offsets assigned.
     *
     * @return {LexerActionExecutor} A {@link LexerActionExecutor} which stores input stream offsets
     * for all position-dependent lexer actions.
     */
    fixOffsetBeforeMatch(l) {
      let r = null;
      for (let e = 0; e < this.lexerActions.length; e++)
        this.lexerActions[e].isPositionDependent && !(this.lexerActions[e] instanceof C) && (r === null && (r = this.lexerActions.concat([])), r[e] = new C(
          l,
          this.lexerActions[e]
        ));
      return r === null ? this : new y(r);
    }
    /**
     * Execute the actions encapsulated by this executor within the context of a
     * particular {@link Lexer}.
     *
     * <p>This method calls {@link IntStream//seek} to set the position of the
     * {@code input} {@link CharStream} prior to calling
     * {@link LexerAction//execute} on a position-dependent action. Before the
     * method returns, the input position will be restored to the same position
     * it was in when the method was invoked.</p>
     *
     * @param lexer The lexer instance.
     * @param input The input stream which is the source for the current token.
     * When this method is called, the current {@link IntStream//index} for
     * {@code input} should be the start of the following token, i.e. 1
     * character past the end of the current token.
     * @param startIndex The token start index. This value may be passed to
     * {@link IntStream//seek} to set the {@code input} position to the beginning
     * of the token.
     */
    execute(l, r, e) {
      let a = !1;
      const u = r.index;
      try {
        for (let s = 0; s < this.lexerActions.length; s++) {
          let t = this.lexerActions[s];
          if (t instanceof C) {
            const i = t.offset;
            r.seek(e + i), t = t.action, a = e + i !== u;
          } else t.isPositionDependent && (r.seek(u), a = !1);
          t.execute(l);
        }
      } finally {
        a && r.seek(u);
      }
    }
    hashCode() {
      return this.cachedHashCode;
    }
    updateHashCode(l) {
      l.update(this.cachedHashCode);
    }
    equals(l) {
      if (this === l)
        return !0;
      if (l instanceof y) {
        if (this.cachedHashCode != l.cachedHashCode)
          return !1;
        if (this.lexerActions.length != l.lexerActions.length)
          return !1;
        {
          const r = this.lexerActions.length;
          for (let e = 0; e < r; ++e)
            if (!this.lexerActions[e].equals(l.lexerActions[e]))
              return !1;
          return !0;
        }
      } else return !1;
    }
    /**
     * Creates a {@link LexerActionExecutor} which executes the actions for
     * the input {@code lexerActionExecutor} followed by a specified
     * {@code lexerAction}.
     *
     * @param lexerActionExecutor The executor for actions already traversed by
     * the lexer while matching a token within a particular
     * {@link LexerATNConfig}. If this is {@code null}, the method behaves as
     * though it were an empty executor.
     * @param lexerAction The lexer action to execute after the actions
     * specified in {@code lexerActionExecutor}.
     *
     * @return {LexerActionExecutor} A {@link LexerActionExecutor} for executing the combine actions
     * of {@code lexerActionExecutor} and {@code lexerAction}.
     */
    static append(l, r) {
      if (l === null)
        return new y([r]);
      const e = l.lexerActions.concat([r]);
      return new y(e);
    }
  }
  return vt = y, vt;
}
var It, ml;
function Ls() {
  if (ml) return It;
  ml = 1;
  const { Token: f } = ue(), C = Ye(), y = Ne(), p = V0(), { DFAState: l } = ze(), { OrderedATNConfigSet: r } = Oe(), { PredictionContext: e } = Te(), { SingletonPredictionContext: a } = Te(), { RuleStopState: u } = Ue(), { LexerATNConfig: s } = Je(), { Transition: t } = Ge(), i = _s(), { LexerNoViableAltException: n } = Ce();
  function o(d) {
    d.index = -1, d.line = 0, d.column = -1, d.dfaState = null;
  }
  class m {
    constructor() {
      o(this);
    }
    reset() {
      o(this);
    }
  }
  class c extends p {
    /**
     * When we hit an accept state in either the DFA or the ATN, we
     * have to notify the character stream to start buffering characters
     * via {@link IntStream//mark} and record the current state. The current sim state
     * includes the current index into the input, the current line,
     * and current character position in that line. Note that the Lexer is
     * tracking the starting line and characterization of the token. These
     * variables track the "state" of the simulator when it hits an accept state.
     *
     * <p>We track these variables separately for the DFA and ATN simulation
     * because the DFA simulation often has to fail over to the ATN
     * simulation. If the ATN simulation fails, we need the DFA to fall
     * back to its previously accepted state, if any. If the ATN succeeds,
     * then the ATN does the accept and the DFA simulator that invoked it
     * can simply return the predicted token type.</p>
     */
    constructor(h, _, T, M) {
      super(_, M), this.decisionToDFA = T, this.recog = h, this.startIndex = -1, this.line = 1, this.column = 0, this.mode = C.DEFAULT_MODE, this.prevAccept = new m();
    }
    copyState(h) {
      this.column = h.column, this.line = h.line, this.mode = h.mode, this.startIndex = h.startIndex;
    }
    match(h, _) {
      this.match_calls += 1, this.mode = _;
      const T = h.mark();
      try {
        this.startIndex = h.index, this.prevAccept.reset();
        const M = this.decisionToDFA[_];
        return M.s0 === null ? this.matchATN(h) : this.execATN(h, M.s0);
      } finally {
        h.release(T);
      }
    }
    reset() {
      this.prevAccept.reset(), this.startIndex = -1, this.line = 1, this.column = 0, this.mode = C.DEFAULT_MODE;
    }
    matchATN(h) {
      const _ = this.atn.modeToStartState[this.mode];
      c.debug && console.log("matchATN mode " + this.mode + " start: " + _);
      const T = this.mode, M = this.computeStartState(h, _), P = M.hasSemanticContext;
      M.hasSemanticContext = !1;
      const q = this.addDFAState(M);
      P || (this.decisionToDFA[this.mode].s0 = q);
      const z = this.execATN(h, q);
      return c.debug && console.log("DFA after matchATN: " + this.decisionToDFA[T].toLexerString()), z;
    }
    execATN(h, _) {
      c.debug && console.log("start state closure=" + _.configs), _.isAcceptState && this.captureSimState(this.prevAccept, h, _);
      let T = h.LA(1), M = _;
      for (; ; ) {
        c.debug && console.log("execATN loop starting closure: " + M.configs);
        let P = this.getExistingTargetState(M, T);
        if (P === null && (P = this.computeTargetState(h, M, T)), P === p.ERROR || (T !== f.EOF && this.consume(h), P.isAcceptState && (this.captureSimState(this.prevAccept, h, P), T === f.EOF)))
          break;
        T = h.LA(1), M = P;
      }
      return this.failOrAccept(this.prevAccept, h, M.configs, T);
    }
    /**
     * Get an existing target state for an edge in the DFA. If the target state
     * for the edge has not yet been computed or is otherwise not available,
     * this method returns {@code null}.
     *
     * @param s The current DFA state
     * @param t The next input symbol
     * @return The existing target DFA state for the given input symbol
     * {@code t}, or {@code null} if the target state for this edge is not
     * already cached
     */
    getExistingTargetState(h, _) {
      if (h.edges === null || _ < c.MIN_DFA_EDGE || _ > c.MAX_DFA_EDGE)
        return null;
      let T = h.edges[_ - c.MIN_DFA_EDGE];
      return T === void 0 && (T = null), c.debug && T !== null && console.log("reuse state " + h.stateNumber + " edge to " + T.stateNumber), T;
    }
    /**
     * Compute a target state for an edge in the DFA, and attempt to add the
     * computed state and corresponding edge to the DFA.
     *
     * @param input The input stream
     * @param s The current DFA state
     * @param t The next input symbol
     *
     * @return The computed target DFA state for the given input symbol
     * {@code t}. If {@code t} does not lead to a valid DFA state, this method
     * returns {@link //ERROR}.
     */
    computeTargetState(h, _, T) {
      const M = new r();
      return this.getReachableConfigSet(h, _.configs, M, T), M.items.length === 0 ? (M.hasSemanticContext || this.addDFAEdge(_, T, p.ERROR), p.ERROR) : this.addDFAEdge(_, T, null, M);
    }
    failOrAccept(h, _, T, M) {
      if (this.prevAccept.dfaState !== null) {
        const P = h.dfaState.lexerActionExecutor;
        return this.accept(
          _,
          P,
          this.startIndex,
          h.index,
          h.line,
          h.column
        ), h.dfaState.prediction;
      } else {
        if (M === f.EOF && _.index === this.startIndex)
          return f.EOF;
        throw new n(this.recog, _, this.startIndex, T);
      }
    }
    /**
     * Given a starting configuration set, figure out all ATN configurations
     * we can reach upon input {@code t}. Parameter {@code reach} is a return
     * parameter.
     */
    getReachableConfigSet(h, _, T, M) {
      let P = y.INVALID_ALT_NUMBER;
      for (let q = 0; q < _.items.length; q++) {
        const z = _.items[q], W = z.alt === P;
        if (!(W && z.passedThroughNonGreedyDecision)) {
          c.debug && console.log(`testing %s at %s
`, this.getTokenName(M), z.toString(this.recog, !0));
          for (let Y = 0; Y < z.state.transitions.length; Y++) {
            const w = z.state.transitions[Y], v = this.getReachableTarget(w, M);
            if (v !== null) {
              let U = z.lexerActionExecutor;
              U !== null && (U = U.fixOffsetBeforeMatch(h.index - this.startIndex));
              const I = M === f.EOF, S = new s({ state: v, lexerActionExecutor: U }, z);
              this.closure(
                h,
                S,
                T,
                W,
                !0,
                I
              ) && (P = z.alt);
            }
          }
        }
      }
    }
    accept(h, _, T, M, P, q) {
      c.debug && console.log(`ACTION %s
`, _), h.seek(M), this.line = P, this.column = q, _ !== null && this.recog !== null && _.execute(this.recog, h, T);
    }
    getReachableTarget(h, _) {
      return h.matches(_, 0, C.MAX_CHAR_VALUE) ? h.target : null;
    }
    computeStartState(h, _) {
      const T = e.EMPTY, M = new r();
      for (let P = 0; P < _.transitions.length; P++) {
        const q = _.transitions[P].target, z = new s({ state: q, alt: P + 1, context: T }, null);
        this.closure(h, z, M, !1, !1, !1);
      }
      return M;
    }
    /**
     * Since the alternatives within any lexer decision are ordered by
     * preference, this method stops pursuing the closure as soon as an accept
     * state is reached. After the first accept state is reached by depth-first
     * search from {@code config}, all other (potentially reachable) states for
     * this rule would have a lower priority.
     *
     * @return {Boolean} {@code true} if an accept state is reached, otherwise
     * {@code false}.
     */
    closure(h, _, T, M, P, q) {
      let z = null;
      if (c.debug && console.log("closure(" + _.toString(this.recog, !0) + ")"), _.state instanceof u) {
        if (c.debug && (this.recog !== null ? console.log(`closure at %s rule stop %s
`, this.recog.ruleNames[_.state.ruleIndex], _) : console.log(`closure at rule stop %s
`, _)), _.context === null || _.context.hasEmptyPath()) {
          if (_.context === null || _.context.isEmpty())
            return T.add(_), !0;
          T.add(new s({ state: _.state, context: e.EMPTY }, _)), M = !0;
        }
        if (_.context !== null && !_.context.isEmpty()) {
          for (let W = 0; W < _.context.length; W++)
            if (_.context.getReturnState(W) !== e.EMPTY_RETURN_STATE) {
              const Y = _.context.getParent(W), w = this.atn.states[_.context.getReturnState(W)];
              z = new s({ state: w, context: Y }, _), M = this.closure(
                h,
                z,
                T,
                M,
                P,
                q
              );
            }
        }
        return M;
      }
      _.state.epsilonOnlyTransitions || (!M || !_.passedThroughNonGreedyDecision) && T.add(_);
      for (let W = 0; W < _.state.transitions.length; W++) {
        const Y = _.state.transitions[W];
        z = this.getEpsilonTarget(h, _, Y, T, P, q), z !== null && (M = this.closure(
          h,
          z,
          T,
          M,
          P,
          q
        ));
      }
      return M;
    }
    // side-effect: can alter configs.hasSemanticContext
    getEpsilonTarget(h, _, T, M, P, q) {
      let z = null;
      if (T.serializationType === t.RULE) {
        const W = a.create(_.context, T.followState.stateNumber);
        z = new s({ state: T.target, context: W }, _);
      } else {
        if (T.serializationType === t.PRECEDENCE)
          throw "Precedence predicates are not supported in lexers.";
        if (T.serializationType === t.PREDICATE)
          c.debug && console.log("EVAL rule " + T.ruleIndex + ":" + T.predIndex), M.hasSemanticContext = !0, this.evaluatePredicate(h, T.ruleIndex, T.predIndex, P) && (z = new s({ state: T.target }, _));
        else if (T.serializationType === t.ACTION)
          if (_.context === null || _.context.hasEmptyPath()) {
            const W = i.append(
              _.lexerActionExecutor,
              this.atn.lexerActions[T.actionIndex]
            );
            z = new s({ state: T.target, lexerActionExecutor: W }, _);
          } else
            z = new s({ state: T.target }, _);
        else T.serializationType === t.EPSILON ? z = new s({ state: T.target }, _) : (T.serializationType === t.ATOM || T.serializationType === t.RANGE || T.serializationType === t.SET) && q && T.matches(f.EOF, 0, C.MAX_CHAR_VALUE) && (z = new s({ state: T.target }, _));
      }
      return z;
    }
    /**
     * Evaluate a predicate specified in the lexer.
     *
     * <p>If {@code speculative} is {@code true}, this method was called before
     * {@link //consume} for the matched character. This method should call
     * {@link //consume} before evaluating the predicate to ensure position
     * sensitive values, including {@link Lexer//getText}, {@link Lexer//getLine},
     * and {@link Lexer//getcolumn}, properly reflect the current
     * lexer state. This method should restore {@code input} and the simulator
     * to the original state before returning (i.e. undo the actions made by the
     * call to {@link //consume}.</p>
     *
     * @param input The input stream.
     * @param ruleIndex The rule containing the predicate.
     * @param predIndex The index of the predicate within the rule.
     * @param speculative {@code true} if the current index in {@code input} is
     * one character before the predicate's location.
     *
     * @return {@code true} if the specified predicate evaluates to
     * {@code true}.
     */
    evaluatePredicate(h, _, T, M) {
      if (this.recog === null)
        return !0;
      if (!M)
        return this.recog.sempred(null, _, T);
      const P = this.column, q = this.line, z = h.index, W = h.mark();
      try {
        return this.consume(h), this.recog.sempred(null, _, T);
      } finally {
        this.column = P, this.line = q, h.seek(z), h.release(W);
      }
    }
    captureSimState(h, _, T) {
      h.index = _.index, h.line = this.line, h.column = this.column, h.dfaState = T;
    }
    addDFAEdge(h, _, T, M) {
      if (T === void 0 && (T = null), M === void 0 && (M = null), T === null && M !== null) {
        const P = M.hasSemanticContext;
        if (M.hasSemanticContext = !1, T = this.addDFAState(M), P)
          return T;
      }
      return _ < c.MIN_DFA_EDGE || _ > c.MAX_DFA_EDGE || (c.debug && console.log("EDGE " + h + " -> " + T + " upon " + _), h.edges === null && (h.edges = []), h.edges[_ - c.MIN_DFA_EDGE] = T), T;
    }
    /**
     * Add a new DFA state if there isn't one with this set of
     * configurations already. This method also detects the first
     * configuration containing an ATN rule stop state. Later, when
     * traversing the DFA, we will know which rule to accept.
     */
    addDFAState(h) {
      const _ = new l(null, h);
      let T = null;
      for (let z = 0; z < h.items.length; z++) {
        const W = h.items[z];
        if (W.state instanceof u) {
          T = W;
          break;
        }
      }
      T !== null && (_.isAcceptState = !0, _.lexerActionExecutor = T.lexerActionExecutor, _.prediction = this.atn.ruleToTokenType[T.state.ruleIndex]);
      const M = this.decisionToDFA[this.mode], P = M.states.get(_);
      if (P !== null)
        return P;
      const q = _;
      return q.stateNumber = M.states.length, h.setReadonly(!0), q.configs = h, M.states.add(q), q;
    }
    getDFA(h) {
      return this.decisionToDFA[h];
    }
    // Get the text matched so far for the current token.
    getText(h) {
      return h.getText(this.startIndex, h.index - 1);
    }
    consume(h) {
      h.LA(1) === 10 ? (this.line += 1, this.column = 0) : this.column += 1, h.consume();
    }
    getTokenName(h) {
      return h === -1 ? "EOF" : "'" + String.fromCharCode(h) + "'";
    }
  }
  return c.debug = !1, c.dfa_debug = !1, c.MIN_DFA_EDGE = 0, c.MAX_DFA_EDGE = 127, c.match_calls = 0, It = c, It;
}
var St, hl;
function G0() {
  if (hl) return St;
  hl = 1;
  const { Map: f, BitSet: C, AltDict: y, hashStuff: p } = oe(), l = Ne(), { RuleStopState: r } = Ue(), { ATNConfigSet: e } = Oe(), { ATNConfig: a } = Je(), { SemanticContext: u } = Ve(), s = {
    /**
     * The SLL(*) prediction mode. This prediction mode ignores the current
     * parser context when making predictions. This is the fastest prediction
     * mode, and provides correct results for many grammars. This prediction
     * mode is more powerful than the prediction mode provided by ANTLR 3, but
     * may result in syntax errors for grammar and input combinations which are
     * not SLL.
     *
     * <p>
     * When using this prediction mode, the parser will either return a correct
     * parse tree (i.e. the same parse tree that would be returned with the
     * {@link //LL} prediction mode), or it will report a syntax error. If a
     * syntax error is encountered when using the {@link //SLL} prediction mode,
     * it may be due to either an actual syntax error in the input or indicate
     * that the particular combination of grammar and input requires the more
     * powerful {@link //LL} prediction abilities to complete successfully.</p>
     *
     * <p>
     * This prediction mode does not provide any guarantees for prediction
     * behavior for syntactically-incorrect inputs.</p>
     */
    SLL: 0,
    /**
     * The LL(*) prediction mode. This prediction mode allows the current parser
     * context to be used for resolving SLL conflicts that occur during
     * prediction. This is the fastest prediction mode that guarantees correct
     * parse results for all combinations of grammars with syntactically correct
     * inputs.
     *
     * <p>
     * When using this prediction mode, the parser will make correct decisions
     * for all syntactically-correct grammar and input combinations. However, in
     * cases where the grammar is truly ambiguous this prediction mode might not
     * report a precise answer for <em>exactly which</em> alternatives are
     * ambiguous.</p>
     *
     * <p>
     * This prediction mode does not provide any guarantees for prediction
     * behavior for syntactically-incorrect inputs.</p>
     */
    LL: 1,
    /**
     *
     * The LL(*) prediction mode with exact ambiguity detection. In addition to
     * the correctness guarantees provided by the {@link //LL} prediction mode,
     * this prediction mode instructs the prediction algorithm to determine the
     * complete and exact set of ambiguous alternatives for every ambiguous
     * decision encountered while parsing.
     *
     * <p>
     * This prediction mode may be used for diagnosing ambiguities during
     * grammar development. Due to the performance overhead of calculating sets
     * of ambiguous alternatives, this prediction mode should be avoided when
     * the exact results are not necessary.</p>
     *
     * <p>
     * This prediction mode does not provide any guarantees for prediction
     * behavior for syntactically-incorrect inputs.</p>
     */
    LL_EXACT_AMBIG_DETECTION: 2,
    /**
     *
     * Computes the SLL prediction termination condition.
     *
     * <p>
     * This method computes the SLL prediction termination condition for both of
     * the following cases.</p>
     *
     * <ul>
     * <li>The usual SLL+LL fallback upon SLL conflict</li>
     * <li>Pure SLL without LL fallback</li>
     * </ul>
     *
     * <p><strong>COMBINED SLL+LL PARSING</strong></p>
     *
     * <p>When LL-fallback is enabled upon SLL conflict, correct predictions are
     * ensured regardless of how the termination condition is computed by this
     * method. Due to the substantially higher cost of LL prediction, the
     * prediction should only fall back to LL when the additional lookahead
     * cannot lead to a unique SLL prediction.</p>
     *
     * <p>Assuming combined SLL+LL parsing, an SLL configuration set with only
     * conflicting subsets should fall back to full LL, even if the
     * configuration sets don't resolve to the same alternative (e.g.
     * {@code {1,2}} and {@code {3,4}}. If there is at least one non-conflicting
     * configuration, SLL could continue with the hopes that more lookahead will
     * resolve via one of those non-conflicting configurations.</p>
     *
     * <p>Here's the prediction termination rule them: SLL (for SLL+LL parsing)
     * stops when it sees only conflicting configuration subsets. In contrast,
     * full LL keeps going when there is uncertainty.</p>
     *
     * <p><strong>HEURISTIC</strong></p>
     *
     * <p>As a heuristic, we stop prediction when we see any conflicting subset
     * unless we see a state that only has one alternative associated with it.
     * The single-alt-state thing lets prediction continue upon rules like
     * (otherwise, it would admit defeat too soon):</p>
     *
     * <p>{@code [12|1|[], 6|2|[], 12|2|[]]. s : (ID | ID ID?) ';' ;}</p>
     *
     * <p>When the ATN simulation reaches the state before {@code ';'}, it has a
     * DFA state that looks like: {@code [12|1|[], 6|2|[], 12|2|[]]}. Naturally
     * {@code 12|1|[]} and {@code 12|2|[]} conflict, but we cannot stop
     * processing this node because alternative to has another way to continue,
     * via {@code [6|2|[]]}.</p>
     *
     * <p>It also let's us continue for this rule:</p>
     *
     * <p>{@code [1|1|[], 1|2|[], 8|3|[]] a : A | A | A B ;}</p>
     *
     * <p>After matching input A, we reach the stop state for rule A, state 1.
     * State 8 is the state right before B. Clearly alternatives 1 and 2
     * conflict and no amount of further lookahead will separate the two.
     * However, alternative 3 will be able to continue and so we do not stop
     * working on this state. In the previous example, we're concerned with
     * states associated with the conflicting alternatives. Here alt 3 is not
     * associated with the conflicting configs, but since we can continue
     * looking for input reasonably, don't declare the state done.</p>
     *
     * <p><strong>PURE SLL PARSING</strong></p>
     *
     * <p>To handle pure SLL parsing, all we have to do is make sure that we
     * combine stack contexts for configurations that differ only by semantic
     * predicate. From there, we can do the usual SLL termination heuristic.</p>
     *
     * <p><strong>PREDICATES IN SLL+LL PARSING</strong></p>
     *
     * <p>SLL decisions don't evaluate predicates until after they reach DFA stop
     * states because they need to create the DFA cache that works in all
     * semantic situations. In contrast, full LL evaluates predicates collected
     * during start state computation so it can ignore predicates thereafter.
     * This means that SLL termination detection can totally ignore semantic
     * predicates.</p>
     *
     * <p>Implementation-wise, {@link ATNConfigSet} combines stack contexts but not
     * semantic predicate contexts so we might see two configurations like the
     * following.</p>
     *
     * <p>{@code (s, 1, x, {}), (s, 1, x', {p})}</p>
     *
     * <p>Before testing these configurations against others, we have to merge
     * {@code x} and {@code x'} (without modifying the existing configurations).
     * For example, we test {@code (x+x')==x''} when looking for conflicts in
     * the following configurations.</p>
     *
     * <p>{@code (s, 1, x, {}), (s, 1, x', {p}), (s, 2, x'', {})}</p>
     *
     * <p>If the configuration set has predicates (as indicated by
     * {@link ATNConfigSet//hasSemanticContext}), this algorithm makes a copy of
     * the configurations to strip out all of the predicates so that a standard
     * {@link ATNConfigSet} will merge everything ignoring predicates.</p>
     */
    hasSLLConflictTerminatingPrediction: function(t, i) {
      if (s.allConfigsInRuleStopStates(i))
        return !0;
      if (t === s.SLL && i.hasSemanticContext) {
        const o = new e();
        for (let m = 0; m < i.items.length; m++) {
          let c = i.items[m];
          c = new a({ semanticContext: u.NONE }, c), o.add(c);
        }
        i = o;
      }
      const n = s.getConflictingAltSubsets(i);
      return s.hasConflictingAltSet(n) && !s.hasStateAssociatedWithOneAlt(i);
    },
    /**
     * Checks if any configuration in {@code configs} is in a
     * {@link RuleStopState}. Configurations meeting this condition have reached
     * the end of the decision rule (local context) or end of start rule (full
     * context).
     *
     * @param configs the configuration set to test
     * @return {@code true} if any configuration in {@code configs} is in a
     * {@link RuleStopState}, otherwise {@code false}
     */
    hasConfigInRuleStopState: function(t) {
      for (let i = 0; i < t.items.length; i++)
        if (t.items[i].state instanceof r)
          return !0;
      return !1;
    },
    /**
     * Checks if all configurations in {@code configs} are in a
     * {@link RuleStopState}. Configurations meeting this condition have reached
     * the end of the decision rule (local context) or end of start rule (full
     * context).
     *
     * @param configs the configuration set to test
     * @return {@code true} if all configurations in {@code configs} are in a
     * {@link RuleStopState}, otherwise {@code false}
     */
    allConfigsInRuleStopStates: function(t) {
      for (let i = 0; i < t.items.length; i++)
        if (!(t.items[i].state instanceof r))
          return !1;
      return !0;
    },
    /**
     *
     * Full LL prediction termination.
     *
     * <p>Can we stop looking ahead during ATN simulation or is there some
     * uncertainty as to which alternative we will ultimately pick, after
     * consuming more input? Even if there are partial conflicts, we might know
     * that everything is going to resolve to the same minimum alternative. That
     * means we can stop since no more lookahead will change that fact. On the
     * other hand, there might be multiple conflicts that resolve to different
     * minimums. That means we need more look ahead to decide which of those
     * alternatives we should predict.</p>
     *
     * <p>The basic idea is to split the set of configurations {@code C}, into
     * conflicting subsets {@code (s, _, ctx, _)} and singleton subsets with
     * non-conflicting configurations. Two configurations conflict if they have
     * identical {@link ATNConfig//state} and {@link ATNConfig//context} values
     * but different {@link ATNConfig//alt} value, e.g. {@code (s, i, ctx, _)}
     * and {@code (s, j, ctx, _)} for {@code i!=j}.</p>
     *
     * <p>Reduce these configuration subsets to the set of possible alternatives.
     * You can compute the alternative subsets in one pass as follows:</p>
     *
     * <p>{@code A_s,ctx = {i | (s, i, ctx, _)}} for each configuration in
     * {@code C} holding {@code s} and {@code ctx} fixed.</p>
     *
     * <p>Or in pseudo-code, for each configuration {@code c} in {@code C}:</p>
     *
     * <pre>
     * map[c] U= c.{@link ATNConfig//alt alt} // map hash/equals uses s and x, not
     * alt and not pred
     * </pre>
     *
     * <p>The values in {@code map} are the set of {@code A_s,ctx} sets.</p>
     *
     * <p>If {@code |A_s,ctx|=1} then there is no conflict associated with
     * {@code s} and {@code ctx}.</p>
     *
     * <p>Reduce the subsets to singletons by choosing a minimum of each subset. If
     * the union of these alternative subsets is a singleton, then no amount of
     * more lookahead will help us. We will always pick that alternative. If,
     * however, there is more than one alternative, then we are uncertain which
     * alternative to predict and must continue looking for resolution. We may
     * or may not discover an ambiguity in the future, even if there are no
     * conflicting subsets this round.</p>
     *
     * <p>The biggest sin is to terminate early because it means we've made a
     * decision but were uncertain as to the eventual outcome. We haven't used
     * enough lookahead. On the other hand, announcing a conflict too late is no
     * big deal; you will still have the conflict. It's just inefficient. It
     * might even look until the end of file.</p>
     *
     * <p>No special consideration for semantic predicates is required because
     * predicates are evaluated on-the-fly for full LL prediction, ensuring that
     * no configuration contains a semantic context during the termination
     * check.</p>
     *
     * <p><strong>CONFLICTING CONFIGS</strong></p>
     *
     * <p>Two configurations {@code (s, i, x)} and {@code (s, j, x')}, conflict
     * when {@code i!=j} but {@code x=x'}. Because we merge all
     * {@code (s, i, _)} configurations together, that means that there are at
     * most {@code n} configurations associated with state {@code s} for
     * {@code n} possible alternatives in the decision. The merged stacks
     * complicate the comparison of configuration contexts {@code x} and
     * {@code x'}. Sam checks to see if one is a subset of the other by calling
     * merge and checking to see if the merged result is either {@code x} or
     * {@code x'}. If the {@code x} associated with lowest alternative {@code i}
     * is the superset, then {@code i} is the only possible prediction since the
     * others resolve to {@code min(i)} as well. However, if {@code x} is
     * associated with {@code j>i} then at least one stack configuration for
     * {@code j} is not in conflict with alternative {@code i}. The algorithm
     * should keep going, looking for more lookahead due to the uncertainty.</p>
     *
     * <p>For simplicity, I'm doing a equality check between {@code x} and
     * {@code x'} that lets the algorithm continue to consume lookahead longer
     * than necessary. The reason I like the equality is of course the
     * simplicity but also because that is the test you need to detect the
     * alternatives that are actually in conflict.</p>
     *
     * <p><strong>CONTINUE/STOP RULE</strong></p>
     *
     * <p>Continue if union of resolved alternative sets from non-conflicting and
     * conflicting alternative subsets has more than one alternative. We are
     * uncertain about which alternative to predict.</p>
     *
     * <p>The complete set of alternatives, {@code [i for (_,i,_)]}, tells us which
     * alternatives are still in the running for the amount of input we've
     * consumed at this point. The conflicting sets let us to strip away
     * configurations that won't lead to more states because we resolve
     * conflicts to the configuration with a minimum alternate for the
     * conflicting set.</p>
     *
     * <p><strong>CASES</strong></p>
     *
     * <ul>
     *
     * <li>no conflicts and more than 1 alternative in set =&gt; continue</li>
     *
     * <li> {@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s, 3, z)},
     * {@code (s', 1, y)}, {@code (s', 2, y)} yields non-conflicting set
     * {@code {3}} U conflicting sets {@code min({1,2})} U {@code min({1,2})} =
     * {@code {1,3}} =&gt; continue
     * </li>
     *
     * <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 1, y)},
     * {@code (s', 2, y)}, {@code (s'', 1, z)} yields non-conflicting set
     * {@code {1}} U conflicting sets {@code min({1,2})} U {@code min({1,2})} =
     * {@code {1}} =&gt; stop and predict 1</li>
     *
     * <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 1, y)},
     * {@code (s', 2, y)} yields conflicting, reduced sets {@code {1}} U
     * {@code {1}} = {@code {1}} =&gt; stop and predict 1, can announce
     * ambiguity {@code {1,2}}</li>
     *
     * <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 2, y)},
     * {@code (s', 3, y)} yields conflicting, reduced sets {@code {1}} U
     * {@code {2}} = {@code {1,2}} =&gt; continue</li>
     *
     * <li>{@code (s, 1, x)}, {@code (s, 2, x)}, {@code (s', 3, y)},
     * {@code (s', 4, y)} yields conflicting, reduced sets {@code {1}} U
     * {@code {3}} = {@code {1,3}} =&gt; continue</li>
     *
     * </ul>
     *
     * <p><strong>EXACT AMBIGUITY DETECTION</strong></p>
     *
     * <p>If all states report the same conflicting set of alternatives, then we
     * know we have the exact ambiguity set.</p>
     *
     * <p><code>|A_<em>i</em>|&gt;1</code> and
     * <code>A_<em>i</em> = A_<em>j</em></code> for all <em>i</em>, <em>j</em>.</p>
     *
     * <p>In other words, we continue examining lookahead until all {@code A_i}
     * have more than one alternative and all {@code A_i} are the same. If
     * {@code A={{1,2}, {1,3}}}, then regular LL prediction would terminate
     * because the resolved set is {@code {1}}. To determine what the real
     * ambiguity is, we have to know whether the ambiguity is between one and
     * two or one and three so we keep going. We can only stop prediction when
     * we need exact ambiguity detection when the sets look like
     * {@code A={{1,2}}} or {@code {{1,2},{1,2}}}, etc...</p>
     */
    resolvesToJustOneViableAlt: function(t) {
      return s.getSingleViableAlt(t);
    },
    /**
     * Determines if every alternative subset in {@code altsets} contains more
     * than one alternative.
     *
     * @param altsets a collection of alternative subsets
     * @return {@code true} if every {@link BitSet} in {@code altsets} has
     * {@link BitSet//cardinality cardinality} &gt; 1, otherwise {@code false}
     */
    allSubsetsConflict: function(t) {
      return !s.hasNonConflictingAltSet(t);
    },
    /**
     * Determines if any single alternative subset in {@code altsets} contains
     * exactly one alternative.
     *
     * @param altsets a collection of alternative subsets
     * @return {@code true} if {@code altsets} contains a {@link BitSet} with
     * {@link BitSet//cardinality cardinality} 1, otherwise {@code false}
     */
    hasNonConflictingAltSet: function(t) {
      for (let i = 0; i < t.length; i++)
        if (t[i].length === 1)
          return !0;
      return !1;
    },
    /**
     * Determines if any single alternative subset in {@code altsets} contains
     * more than one alternative.
     *
     * @param altsets a collection of alternative subsets
     * @return {@code true} if {@code altsets} contains a {@link BitSet} with
     * {@link BitSet//cardinality cardinality} &gt; 1, otherwise {@code false}
     */
    hasConflictingAltSet: function(t) {
      for (let i = 0; i < t.length; i++)
        if (t[i].length > 1)
          return !0;
      return !1;
    },
    /**
     * Determines if every alternative subset in {@code altsets} is equivalent.
     *
     * @param altsets a collection of alternative subsets
     * @return {@code true} if every member of {@code altsets} is equal to the
     * others, otherwise {@code false}
     */
    allSubsetsEqual: function(t) {
      let i = null;
      for (let n = 0; n < t.length; n++) {
        const o = t[n];
        if (i === null)
          i = o;
        else if (o !== i)
          return !1;
      }
      return !0;
    },
    /**
     * Returns the unique alternative predicted by all alternative subsets in
     * {@code altsets}. If no such alternative exists, this method returns
     * {@link ATN//INVALID_ALT_NUMBER}.
     *
     * @param altsets a collection of alternative subsets
     */
    getUniqueAlt: function(t) {
      const i = s.getAlts(t);
      return i.length === 1 ? i.minValue() : l.INVALID_ALT_NUMBER;
    },
    /**
     * Gets the complete set of represented alternatives for a collection of
     * alternative subsets. This method returns the union of each {@link BitSet}
     * in {@code altsets}.
     *
     * @param altsets a collection of alternative subsets
     * @return the set of represented alternatives in {@code altsets}
     */
    getAlts: function(t) {
      const i = new C();
      return t.map(function(n) {
        i.or(n);
      }), i;
    },
    /**
     * This function gets the conflicting alt subsets from a configuration set.
     * For each configuration {@code c} in {@code configs}:
     *
     * <pre>
     * map[c] U= c.{@link ATNConfig//alt alt} // map hash/equals uses s and x, not
     * alt and not pred
     * </pre>
     */
    getConflictingAltSubsets: function(t) {
      const i = new f();
      return i.hashFunction = function(n) {
        p(n.state.stateNumber, n.context);
      }, i.equalsFunction = function(n, o) {
        return n.state.stateNumber === o.state.stateNumber && n.context.equals(o.context);
      }, t.items.map(function(n) {
        let o = i.get(n);
        o === null && (o = new C(), i.put(n, o)), o.add(n.alt);
      }), i.getValues();
    },
    /**
     * Get a map from state to alt subset from a configuration set. For each
     * configuration {@code c} in {@code configs}:
     *
     * <pre>
     * map[c.{@link ATNConfig//state state}] U= c.{@link ATNConfig//alt alt}
     * </pre>
     */
    getStateToAltMap: function(t) {
      const i = new y();
      return t.items.map(function(n) {
        let o = i.get(n.state);
        o === null && (o = new C(), i.put(n.state, o)), o.add(n.alt);
      }), i;
    },
    hasStateAssociatedWithOneAlt: function(t) {
      const i = s.getStateToAltMap(t).values();
      for (let n = 0; n < i.length; n++)
        if (i[n].length === 1)
          return !0;
      return !1;
    },
    getSingleViableAlt: function(t) {
      let i = null;
      for (let n = 0; n < t.length; n++) {
        const m = t[n].minValue();
        if (i === null)
          i = m;
        else if (i !== m)
          return l.INVALID_ALT_NUMBER;
      }
      return i;
    }
  };
  return St = s, St;
}
var Mt, dl;
function z0() {
  if (dl) return Mt;
  dl = 1;
  const f = En(), C = Ee(), y = C.INVALID_INTERVAL, p = C.TerminalNode, l = C.TerminalNodeImpl, r = C.ErrorNodeImpl, e = me().Interval;
  class a extends f {
    constructor(s, t) {
      s = s || null, t = t || null, super(s, t), this.ruleIndex = -1, this.children = null, this.start = null, this.stop = null, this.exception = null;
    }
    // COPY a ctx (I'm deliberately not using copy constructor)
    copyFrom(s) {
      this.parentCtx = s.parentCtx, this.invokingState = s.invokingState, this.children = null, this.start = s.start, this.stop = s.stop, s.children && (this.children = [], s.children.map(function(t) {
        t instanceof r && (this.children.push(t), t.parentCtx = this);
      }, this));
    }
    // Double dispatch methods for listeners
    enterRule(s) {
    }
    exitRule(s) {
    }
    // Does not set parent link; other add methods do that
    addChild(s) {
      return this.children === null && (this.children = []), this.children.push(s), s;
    }
    /** Used by enterOuterAlt to toss out a RuleContext previously added as
     * we entered a rule. If we have // label, we will need to remove
     * generic ruleContext object.
     */
    removeLastChild() {
      this.children !== null && this.children.pop();
    }
    addTokenNode(s) {
      const t = new l(s);
      return this.addChild(t), t.parentCtx = this, t;
    }
    addErrorNode(s) {
      const t = new r(s);
      return this.addChild(t), t.parentCtx = this, t;
    }
    getChild(s, t) {
      if (t = t || null, this.children === null || s < 0 || s >= this.children.length)
        return null;
      if (t === null)
        return this.children[s];
      for (let i = 0; i < this.children.length; i++) {
        const n = this.children[i];
        if (n instanceof t) {
          if (s === 0)
            return n;
          s -= 1;
        }
      }
      return null;
    }
    getToken(s, t) {
      if (this.children === null || t < 0 || t >= this.children.length)
        return null;
      for (let i = 0; i < this.children.length; i++) {
        const n = this.children[i];
        if (n instanceof p && n.symbol.type === s) {
          if (t === 0)
            return n;
          t -= 1;
        }
      }
      return null;
    }
    getTokens(s) {
      if (this.children === null)
        return [];
      {
        const t = [];
        for (let i = 0; i < this.children.length; i++) {
          const n = this.children[i];
          n instanceof p && n.symbol.type === s && t.push(n);
        }
        return t;
      }
    }
    getTypedRuleContext(s, t) {
      return this.getChild(t, s);
    }
    getTypedRuleContexts(s) {
      if (this.children === null)
        return [];
      {
        const t = [];
        for (let i = 0; i < this.children.length; i++) {
          const n = this.children[i];
          n instanceof s && t.push(n);
        }
        return t;
      }
    }
    getChildCount() {
      return this.children === null ? 0 : this.children.length;
    }
    getSourceInterval() {
      return this.start === null || this.stop === null ? y : new e(this.start.tokenIndex, this.stop.tokenIndex);
    }
  }
  return f.EMPTY = new a(), Mt = a, Mt;
}
var Et, pl;
function Ts() {
  if (pl) return Et;
  pl = 1;
  const f = oe(), { Set: C, BitSet: y, DoubleDict: p } = f, l = Ne(), { ATNState: r, RuleStopState: e } = Ue(), { ATNConfig: a } = Je(), { ATNConfigSet: u } = Oe(), { Token: s } = ue(), { DFAState: t, PredPrediction: i } = ze(), n = V0(), o = G0(), m = En();
  z0();
  const { SemanticContext: c } = Ve(), { PredictionContext: d } = Te(), { Interval: h } = me(), { Transition: _, SetTransition: T, NotSetTransition: M, RuleTransition: P, ActionTransition: q } = Ge(), { NoViableAltException: z } = Ce(), { SingletonPredictionContext: W, predictionContextFromRuleContext: Y } = Te();
  class w extends n {
    constructor(U, I, S, b) {
      super(I, b), this.parser = U, this.decisionToDFA = S, this.predictionMode = o.LL, this._input = null, this._startIndex = 0, this._outerContext = null, this._dfa = null, this.mergeCache = null, this.debug = !1, this.debug_closure = !1, this.debug_add = !1, this.debug_list_atn_decisions = !1, this.dfa_debug = !1, this.retry_debug = !1;
    }
    reset() {
    }
    adaptivePredict(U, I, S) {
      (this.debug || this.debug_list_atn_decisions) && console.log("adaptivePredict decision " + I + " exec LA(1)==" + this.getLookaheadName(U) + " line " + U.LT(1).line + ":" + U.LT(1).column), this._input = U, this._startIndex = U.index, this._outerContext = S;
      const b = this.decisionToDFA[I];
      this._dfa = b;
      const E = U.mark(), N = U.index;
      try {
        let F;
        if (b.precedenceDfa ? F = b.getPrecedenceStartState(this.parser.getPrecedence()) : F = b.s0, F === null) {
          S === null && (S = m.EMPTY), (this.debug || this.debug_list_atn_decisions) && console.log("predictATN decision " + b.decision + " exec LA(1)==" + this.getLookaheadName(U) + ", outerContext=" + S.toString(this.parser.ruleNames));
          let Q = this.computeStartState(b.atnStartState, m.EMPTY, !1);
          b.precedenceDfa ? (b.s0.configs = Q, Q = this.applyPrecedenceFilter(Q), F = this.addDFAState(b, new t(null, Q)), b.setPrecedenceStartState(this.parser.getPrecedence(), F)) : (F = this.addDFAState(b, new t(null, Q)), b.s0 = F);
        }
        const j = this.execATN(b, F, U, N, S);
        return this.debug && console.log("DFA after predictATN: " + b.toString(this.parser.literalNames, this.parser.symbolicNames)), j;
      } finally {
        this._dfa = null, this.mergeCache = null, U.seek(N), U.release(E);
      }
    }
    /**
     * Performs ATN simulation to compute a predicted alternative based
     *  upon the remaining input, but also updates the DFA cache to avoid
     *  having to traverse the ATN again for the same input sequence.
     *
     * There are some key conditions we're looking for after computing a new
     * set of ATN configs (proposed DFA state):
     *       if the set is empty, there is no viable alternative for current symbol
     *       does the state uniquely predict an alternative?
     *       does the state have a conflict that would prevent us from
     *         putting it on the work list?
     *
     * We also have some key operations to do:
     *       add an edge from previous DFA state to potentially new DFA state, D,
     *         upon current symbol but only if adding to work list, which means in all
     *         cases except no viable alternative (and possibly non-greedy decisions?)
     *       collecting predicates and adding semantic context to DFA accept states
     *       adding rule context to context-sensitive DFA accept states
     *       consuming an input symbol
     *       reporting a conflict
     *       reporting an ambiguity
     *       reporting a context sensitivity
     *       reporting insufficient predicates
     *
     * cover these cases:
     *    dead end
     *    single alt
     *    single alt + preds
     *    conflict
     *    conflict + preds
     *
     */
    execATN(U, I, S, b, E) {
      (this.debug || this.debug_list_atn_decisions) && console.log("execATN decision " + U.decision + " exec LA(1)==" + this.getLookaheadName(S) + " line " + S.LT(1).line + ":" + S.LT(1).column);
      let N, F = I;
      this.debug && console.log("s0 = " + I);
      let j = S.LA(1);
      for (; ; ) {
        let $ = this.getExistingTargetState(F, j);
        if ($ === null && ($ = this.computeTargetState(U, F, j)), $ === n.ERROR) {
          const Q = this.noViableAlt(S, E, F.configs, b);
          if (S.seek(b), N = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(F.configs, E), N !== l.INVALID_ALT_NUMBER)
            return N;
          throw Q;
        }
        if ($.requiresFullContext && this.predictionMode !== o.SLL) {
          let Q = null;
          if ($.predicates !== null) {
            this.debug && console.log("DFA state has preds in DFA sim LL failover");
            const le = S.index;
            if (le !== b && S.seek(b), Q = this.evalSemanticContext($.predicates, E, !0), Q.length === 1)
              return this.debug && console.log("Full LL avoided"), Q.minValue();
            le !== b && S.seek(le);
          }
          this.dfa_debug && console.log("ctx sensitive state " + E + " in " + $);
          const ee = this.computeStartState(U.atnStartState, E, !0);
          return this.reportAttemptingFullContext(U, Q, $.configs, b, S.index), N = this.execATNWithFullContext(U, $, ee, S, b, E), N;
        }
        if ($.isAcceptState) {
          if ($.predicates === null)
            return $.prediction;
          const Q = S.index;
          S.seek(b);
          const X = this.evalSemanticContext($.predicates, E, !0);
          if (X.length === 0)
            throw this.noViableAlt(S, E, $.configs, b);
          return X.length === 1 || this.reportAmbiguity(U, $, b, Q, !1, X, $.configs), X.minValue();
        }
        F = $, j !== s.EOF && (S.consume(), j = S.LA(1));
      }
    }
    /**
     * Get an existing target state for an edge in the DFA. If the target state
     * for the edge has not yet been computed or is otherwise not available,
     * this method returns {@code null}.
     *
     * @param previousD The current DFA state
     * @param t The next input symbol
     * @return The existing target DFA state for the given input symbol
     * {@code t}, or {@code null} if the target state for this edge is not
     * already cached
     */
    getExistingTargetState(U, I) {
      const S = U.edges;
      return S === null ? null : S[I + 1] || null;
    }
    /**
     * Compute a target state for an edge in the DFA, and attempt to add the
     * computed state and corresponding edge to the DFA.
     *
     * @param dfa The DFA
     * @param previousD The current DFA state
     * @param t The next input symbol
     *
     * @return The computed target DFA state for the given input symbol
     * {@code t}. If {@code t} does not lead to a valid DFA state, this method
     * returns {@link //ERROR
     */
    computeTargetState(U, I, S) {
      const b = this.computeReachSet(I.configs, S, !1);
      if (b === null)
        return this.addDFAEdge(U, I, S, n.ERROR), n.ERROR;
      let E = new t(null, b);
      const N = this.getUniqueAlt(b);
      if (this.debug) {
        const F = o.getConflictingAltSubsets(b);
        console.log("SLL altSubSets=" + f.arrayToString(F) + /*", previous=" + previousD.configs + */
        ", configs=" + b + ", predict=" + N + ", allSubsetsConflict=" + o.allSubsetsConflict(F) + ", conflictingAlts=" + this.getConflictingAlts(b));
      }
      return N !== l.INVALID_ALT_NUMBER ? (E.isAcceptState = !0, E.configs.uniqueAlt = N, E.prediction = N) : o.hasSLLConflictTerminatingPrediction(this.predictionMode, b) && (E.configs.conflictingAlts = this.getConflictingAlts(b), E.requiresFullContext = !0, E.isAcceptState = !0, E.prediction = E.configs.conflictingAlts.minValue()), E.isAcceptState && E.configs.hasSemanticContext && (this.predicateDFAState(E, this.atn.getDecisionState(U.decision)), E.predicates !== null && (E.prediction = l.INVALID_ALT_NUMBER)), E = this.addDFAEdge(U, I, S, E), E;
    }
    predicateDFAState(U, I) {
      const S = I.transitions.length, b = this.getConflictingAltsOrUniqueAlt(U.configs), E = this.getPredsForAmbigAlts(b, U.configs, S);
      E !== null ? (U.predicates = this.getPredicatePredictions(b, E), U.prediction = l.INVALID_ALT_NUMBER) : U.prediction = b.minValue();
    }
    // comes back with reach.uniqueAlt set to a valid alt
    execATNWithFullContext(U, I, S, b, E, N) {
      (this.debug || this.debug_list_atn_decisions) && console.log("execATNWithFullContext " + S);
      const F = !0;
      let j = !1, $, Q = S;
      b.seek(E);
      let X = b.LA(1), ee = -1;
      for (; ; ) {
        if ($ = this.computeReachSet(Q, X, F), $ === null) {
          const ae = this.noViableAlt(b, N, Q, E);
          b.seek(E);
          const ce = this.getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(Q, N);
          if (ce !== l.INVALID_ALT_NUMBER)
            return ce;
          throw ae;
        }
        const le = o.getConflictingAltSubsets($);
        if (this.debug && console.log("LL altSubSets=" + le + ", predict=" + o.getUniqueAlt(le) + ", resolvesToJustOneViableAlt=" + o.resolvesToJustOneViableAlt(le)), $.uniqueAlt = this.getUniqueAlt($), $.uniqueAlt !== l.INVALID_ALT_NUMBER) {
          ee = $.uniqueAlt;
          break;
        } else if (this.predictionMode !== o.LL_EXACT_AMBIG_DETECTION) {
          if (ee = o.resolvesToJustOneViableAlt(le), ee !== l.INVALID_ALT_NUMBER)
            break;
        } else if (o.allSubsetsConflict(le) && o.allSubsetsEqual(le)) {
          j = !0, ee = o.getSingleViableAlt(le);
          break;
        }
        Q = $, X !== s.EOF && (b.consume(), X = b.LA(1));
      }
      return $.uniqueAlt !== l.INVALID_ALT_NUMBER ? (this.reportContextSensitivity(U, ee, $, E, b.index), ee) : (this.reportAmbiguity(U, I, E, b.index, j, null, $), ee);
    }
    computeReachSet(U, I, S) {
      this.debug && console.log("in computeReachSet, starting closure: " + U), this.mergeCache === null && (this.mergeCache = new p());
      const b = new u(S);
      let E = null;
      for (let F = 0; F < U.items.length; F++) {
        const j = U.items[F];
        if (this.debug && console.log("testing " + this.getTokenName(I) + " at " + j), j.state instanceof e) {
          (S || I === s.EOF) && (E === null && (E = []), E.push(j), this.debug_add && console.log("added " + j + " to skippedStopStates"));
          continue;
        }
        for (let $ = 0; $ < j.state.transitions.length; $++) {
          const Q = j.state.transitions[$], X = this.getReachableTarget(Q, I);
          if (X !== null) {
            const ee = new a({ state: X }, j);
            b.add(ee, this.mergeCache), this.debug_add && console.log("added " + ee + " to intermediate");
          }
        }
      }
      let N = null;
      if (E === null && I !== s.EOF && (b.items.length === 1 || this.getUniqueAlt(b) !== l.INVALID_ALT_NUMBER) && (N = b), N === null) {
        N = new u(S);
        const F = new C(), j = I === s.EOF;
        for (let $ = 0; $ < b.items.length; $++)
          this.closure(b.items[$], N, F, !1, S, j);
      }
      if (I === s.EOF && (N = this.removeAllConfigsNotInRuleStopState(N, N === b)), E !== null && (!S || !o.hasConfigInRuleStopState(N)))
        for (let F = 0; F < E.length; F++)
          N.add(E[F], this.mergeCache);
      return N.items.length === 0 ? null : N;
    }
    /**
     * Return a configuration set containing only the configurations from
     * {@code configs} which are in a {@link RuleStopState}. If all
     * configurations in {@code configs} are already in a rule stop state, this
     * method simply returns {@code configs}.
     *
     * <p>When {@code lookToEndOfRule} is true, this method uses
     * {@link ATN//nextTokens} for each configuration in {@code configs} which is
     * not already in a rule stop state to see if a rule stop state is reachable
     * from the configuration via epsilon-only transitions.</p>
     *
     * @param configs the configuration set to update
     * @param lookToEndOfRule when true, this method checks for rule stop states
     * reachable by epsilon-only transitions from each configuration in
     * {@code configs}.
     *
     * @return {@code configs} if all configurations in {@code configs} are in a
     * rule stop state, otherwise return a new configuration set containing only
     * the configurations from {@code configs} which are in a rule stop state
     */
    removeAllConfigsNotInRuleStopState(U, I) {
      if (o.allConfigsInRuleStopStates(U))
        return U;
      const S = new u(U.fullCtx);
      for (let b = 0; b < U.items.length; b++) {
        const E = U.items[b];
        if (E.state instanceof e) {
          S.add(E, this.mergeCache);
          continue;
        }
        if (I && E.state.epsilonOnlyTransitions && this.atn.nextTokens(E.state).contains(s.EPSILON)) {
          const F = this.atn.ruleToStopState[E.state.ruleIndex];
          S.add(new a({ state: F }, E), this.mergeCache);
        }
      }
      return S;
    }
    computeStartState(U, I, S) {
      const b = Y(this.atn, I), E = new u(S);
      for (let N = 0; N < U.transitions.length; N++) {
        const F = U.transitions[N].target, j = new a({ state: F, alt: N + 1, context: b }, null), $ = new C();
        this.closure(j, E, $, !0, S, !1);
      }
      return E;
    }
    /**
     * This method transforms the start state computed by
     * {@link //computeStartState} to the special start state used by a
     * precedence DFA for a particular precedence value. The transformation
     * process applies the following changes to the start state's configuration
     * set.
     *
     * <ol>
     * <li>Evaluate the precedence predicates for each configuration using
     * {@link SemanticContext//evalPrecedence}.</li>
     * <li>Remove all configurations which predict an alternative greater than
     * 1, for which another configuration that predicts alternative 1 is in the
     * same ATN state with the same prediction context. This transformation is
     * valid for the following reasons:
     * <ul>
     * <li>The closure block cannot contain any epsilon transitions which bypass
     * the body of the closure, so all states reachable via alternative 1 are
     * part of the precedence alternatives of the transformed left-recursive
     * rule.</li>
     * <li>The "primary" portion of a left recursive rule cannot contain an
     * epsilon transition, so the only way an alternative other than 1 can exist
     * in a state that is also reachable via alternative 1 is by nesting calls
     * to the left-recursive rule, with the outer calls not being at the
     * preferred precedence level.</li>
     * </ul>
     * </li>
     * </ol>
     *
     * <p>
     * The prediction context must be considered by this filter to address
     * situations like the following.
     * </p>
     * <code>
     * <pre>
     * grammar TA;
     * prog: statement* EOF;
     * statement: letterA | statement letterA 'b' ;
     * letterA: 'a';
     * </pre>
     * </code>
     * <p>
     * If the above grammar, the ATN state immediately before the token
     * reference {@code 'a'} in {@code letterA} is reachable from the left edge
     * of both the primary and closure blocks of the left-recursive rule
     * {@code statement}. The prediction context associated with each of these
     * configurations distinguishes between them, and prevents the alternative
     * which stepped out to {@code prog} (and then back in to {@code statement}
     * from being eliminated by the filter.
     * </p>
     *
     * @param configs The configuration set computed by
     * {@link //computeStartState} as the start state for the DFA.
     * @return The transformed configuration set representing the start state
     * for a precedence DFA at a particular precedence level (determined by
     * calling {@link Parser//getPrecedence})
     */
    applyPrecedenceFilter(U) {
      let I;
      const S = [], b = new u(U.fullCtx);
      for (let E = 0; E < U.items.length; E++) {
        if (I = U.items[E], I.alt !== 1)
          continue;
        const N = I.semanticContext.evalPrecedence(this.parser, this._outerContext);
        N !== null && (S[I.state.stateNumber] = I.context, N !== I.semanticContext ? b.add(new a({ semanticContext: N }, I), this.mergeCache) : b.add(I, this.mergeCache));
      }
      for (let E = 0; E < U.items.length; E++)
        if (I = U.items[E], I.alt !== 1) {
          if (!I.precedenceFilterSuppressed) {
            const N = S[I.state.stateNumber] || null;
            if (N !== null && N.equals(I.context))
              continue;
          }
          b.add(I, this.mergeCache);
        }
      return b;
    }
    getReachableTarget(U, I) {
      return U.matches(I, 0, this.atn.maxTokenType) ? U.target : null;
    }
    getPredsForAmbigAlts(U, I, S) {
      let b = [];
      for (let N = 0; N < I.items.length; N++) {
        const F = I.items[N];
        U.contains(F.alt) && (b[F.alt] = c.orContext(b[F.alt] || null, F.semanticContext));
      }
      let E = 0;
      for (let N = 1; N < S + 1; N++) {
        const F = b[N] || null;
        F === null ? b[N] = c.NONE : F !== c.NONE && (E += 1);
      }
      return E === 0 && (b = null), this.debug && console.log("getPredsForAmbigAlts result " + f.arrayToString(b)), b;
    }
    getPredicatePredictions(U, I) {
      const S = [];
      let b = !1;
      for (let E = 1; E < I.length; E++) {
        const N = I[E];
        U !== null && U.contains(E) && S.push(new i(N, E)), N !== c.NONE && (b = !0);
      }
      return b ? S : null;
    }
    /**
     * This method is used to improve the localization of error messages by
     * choosing an alternative rather than throwing a
     * {@link NoViableAltException} in particular prediction scenarios where the
     * {@link //ERROR} state was reached during ATN simulation.
     *
     * <p>
     * The default implementation of this method uses the following
     * algorithm to identify an ATN configuration which successfully parsed the
     * decision entry rule. Choosing such an alternative ensures that the
     * {@link ParserRuleContext} returned by the calling rule will be complete
     * and valid, and the syntax error will be reported later at a more
     * localized location.</p>
     *
     * <ul>
     * <li>If a syntactically valid path or paths reach the end of the decision rule and
     * they are semantically valid if predicated, return the min associated alt.</li>
     * <li>Else, if a semantically invalid but syntactically valid path exist
     * or paths exist, return the minimum associated alt.
     * </li>
     * <li>Otherwise, return {@link ATN//INVALID_ALT_NUMBER}.</li>
     * </ul>
     *
     * <p>
     * In some scenarios, the algorithm described above could predict an
     * alternative which will result in a {@link FailedPredicateException} in
     * the parser. Specifically, this could occur if the <em>only</em> configuration
     * capable of successfully parsing to the end of the decision rule is
     * blocked by a semantic predicate. By choosing this alternative within
     * {@link //adaptivePredict} instead of throwing a
     * {@link NoViableAltException}, the resulting
     * {@link FailedPredicateException} in the parser will identify the specific
     * predicate which is preventing the parser from successfully parsing the
     * decision rule, which helps developers identify and correct logic errors
     * in semantic predicates.
     * </p>
     *
     * @param configs The ATN configurations which were valid immediately before
     * the {@link //ERROR} state was reached
     * @param outerContext The is the \gamma_0 initial parser context from the paper
     * or the parser stack at the instant before prediction commences.
     *
     * @return The value to return from {@link //adaptivePredict}, or
     * {@link ATN//INVALID_ALT_NUMBER} if a suitable alternative was not
     * identified and {@link //adaptivePredict} should report an error instead
     */
    getSynValidOrSemInvalidAltThatFinishedDecisionEntryRule(U, I) {
      const S = this.splitAccordingToSemanticValidity(U, I), b = S[0], E = S[1];
      let N = this.getAltThatFinishedDecisionEntryRule(b);
      return N !== l.INVALID_ALT_NUMBER || E.items.length > 0 && (N = this.getAltThatFinishedDecisionEntryRule(E), N !== l.INVALID_ALT_NUMBER) ? N : l.INVALID_ALT_NUMBER;
    }
    getAltThatFinishedDecisionEntryRule(U) {
      const I = [];
      for (let S = 0; S < U.items.length; S++) {
        const b = U.items[S];
        (b.reachesIntoOuterContext > 0 || b.state instanceof e && b.context.hasEmptyPath()) && I.indexOf(b.alt) < 0 && I.push(b.alt);
      }
      return I.length === 0 ? l.INVALID_ALT_NUMBER : Math.min.apply(null, I);
    }
    /**
     * Walk the list of configurations and split them according to
     * those that have preds evaluating to true/false.  If no pred, assume
     * true pred and include in succeeded set.  Returns Pair of sets.
     *
     * Create a new set so as not to alter the incoming parameter.
     *
     * Assumption: the input stream has been restored to the starting point
     * prediction, which is where predicates need to evaluate.*/
    splitAccordingToSemanticValidity(U, I) {
      const S = new u(U.fullCtx), b = new u(U.fullCtx);
      for (let E = 0; E < U.items.length; E++) {
        const N = U.items[E];
        N.semanticContext !== c.NONE ? N.semanticContext.evaluate(this.parser, I) ? S.add(N) : b.add(N) : S.add(N);
      }
      return [S, b];
    }
    /**
     * Look through a list of predicate/alt pairs, returning alts for the
     * pairs that win. A {@code NONE} predicate indicates an alt containing an
     * unpredicated config which behaves as "always true." If !complete
     * then we stop at the first predicate that evaluates to true. This
     * includes pairs with null predicates.
     */
    evalSemanticContext(U, I, S) {
      const b = new y();
      for (let E = 0; E < U.length; E++) {
        const N = U[E];
        if (N.pred === c.NONE) {
          if (b.add(N.alt), !S)
            break;
          continue;
        }
        const F = N.pred.evaluate(this.parser, I);
        if ((this.debug || this.dfa_debug) && console.log("eval pred " + N + "=" + F), F && ((this.debug || this.dfa_debug) && console.log("PREDICT " + N.alt), b.add(N.alt), !S))
          break;
      }
      return b;
    }
    // TODO: If we are doing predicates, there is no point in pursuing
    //     closure operations if we reach a DFA state that uniquely predicts
    //     alternative. We will not be caching that DFA state and it is a
    //     waste to pursue the closure. Might have to advance when we do
    //     ambig detection thought :(
    //
    closure(U, I, S, b, E, N) {
      this.closureCheckingStopState(
        U,
        I,
        S,
        b,
        E,
        0,
        N
      );
    }
    closureCheckingStopState(U, I, S, b, E, N, F) {
      if ((this.debug || this.debug_closure) && (console.log("closure(" + U.toString(this.parser, !0) + ")"), U.reachesIntoOuterContext > 50))
        throw "problem";
      if (U.state instanceof e)
        if (U.context.isEmpty())
          if (E) {
            I.add(U, this.mergeCache);
            return;
          } else
            this.debug && console.log("FALLING off rule " + this.getRuleName(U.state.ruleIndex));
        else {
          for (let j = 0; j < U.context.length; j++) {
            if (U.context.getReturnState(j) === d.EMPTY_RETURN_STATE) {
              if (E) {
                I.add(new a({ state: U.state, context: d.EMPTY }, U), this.mergeCache);
                continue;
              } else
                this.debug && console.log("FALLING off rule " + this.getRuleName(U.state.ruleIndex)), this.closure_(
                  U,
                  I,
                  S,
                  b,
                  E,
                  N,
                  F
                );
              continue;
            }
            const $ = this.atn.states[U.context.getReturnState(j)], Q = U.context.getParent(j), X = { state: $, alt: U.alt, context: Q, semanticContext: U.semanticContext }, ee = new a(X, null);
            ee.reachesIntoOuterContext = U.reachesIntoOuterContext, this.closureCheckingStopState(ee, I, S, b, E, N - 1, F);
          }
          return;
        }
      this.closure_(U, I, S, b, E, N, F);
    }
    // Do the actual work of walking epsilon edges//
    closure_(U, I, S, b, E, N, F) {
      const j = U.state;
      j.epsilonOnlyTransitions || I.add(U, this.mergeCache);
      for (let $ = 0; $ < j.transitions.length; $++) {
        if ($ === 0 && this.canDropLoopEntryEdgeInLeftRecursiveRule(U))
          continue;
        const Q = j.transitions[$], X = b && !(Q instanceof q), ee = this.getEpsilonTarget(U, Q, X, N === 0, E, F);
        if (ee !== null) {
          let le = N;
          if (U.state instanceof e) {
            if (this._dfa !== null && this._dfa.precedenceDfa && Q.outermostPrecedenceReturn === this._dfa.atnStartState.ruleIndex && (ee.precedenceFilterSuppressed = !0), ee.reachesIntoOuterContext += 1, S.add(ee) !== ee)
              continue;
            I.dipsIntoOuterContext = !0, le -= 1, this.debug && console.log("dips into outer ctx: " + ee);
          } else {
            if (!Q.isEpsilon && S.add(ee) !== ee)
              continue;
            Q instanceof P && le >= 0 && (le += 1);
          }
          this.closureCheckingStopState(ee, I, S, X, E, le, F);
        }
      }
    }
    canDropLoopEntryEdgeInLeftRecursiveRule(U) {
      const I = U.state;
      if (I.stateType !== r.STAR_LOOP_ENTRY || I.stateType !== r.STAR_LOOP_ENTRY || !I.isPrecedenceDecision || U.context.isEmpty() || U.context.hasEmptyPath())
        return !1;
      const S = U.context.length;
      for (let F = 0; F < S; F++)
        if (this.atn.states[U.context.getReturnState(F)].ruleIndex !== I.ruleIndex)
          return !1;
      const E = I.transitions[0].target.endState.stateNumber, N = this.atn.states[E];
      for (let F = 0; F < S; F++) {
        const j = U.context.getReturnState(F), $ = this.atn.states[j];
        if ($.transitions.length !== 1 || !$.transitions[0].isEpsilon)
          return !1;
        const Q = $.transitions[0].target;
        if (!($.stateType === r.BLOCK_END && Q === I) && $ !== N && Q !== N && !(Q.stateType === r.BLOCK_END && Q.transitions.length === 1 && Q.transitions[0].isEpsilon && Q.transitions[0].target === I))
          return !1;
      }
      return !0;
    }
    getRuleName(U) {
      return this.parser !== null && U >= 0 ? this.parser.ruleNames[U] : "<rule " + U + ">";
    }
    getEpsilonTarget(U, I, S, b, E, N) {
      switch (I.serializationType) {
        case _.RULE:
          return this.ruleTransition(U, I);
        case _.PRECEDENCE:
          return this.precedenceTransition(U, I, S, b, E);
        case _.PREDICATE:
          return this.predTransition(U, I, S, b, E);
        case _.ACTION:
          return this.actionTransition(U, I);
        case _.EPSILON:
          return new a({ state: I.target }, U);
        case _.ATOM:
        case _.RANGE:
        case _.SET:
          return N && I.matches(s.EOF, 0, 1) ? new a({ state: I.target }, U) : null;
        default:
          return null;
      }
    }
    actionTransition(U, I) {
      if (this.debug) {
        const S = I.actionIndex === -1 ? 65535 : I.actionIndex;
        console.log("ACTION edge " + I.ruleIndex + ":" + S);
      }
      return new a({ state: I.target }, U);
    }
    precedenceTransition(U, I, S, b, E) {
      this.debug && (console.log("PRED (collectPredicates=" + S + ") " + I.precedence + ">=_p, ctx dependent=true"), this.parser !== null && console.log("context surrounding pred is " + f.arrayToString(this.parser.getRuleInvocationStack())));
      let N = null;
      if (S && b)
        if (E) {
          const F = this._input.index;
          this._input.seek(this._startIndex);
          const j = I.getPredicate().evaluate(this.parser, this._outerContext);
          this._input.seek(F), j && (N = new a({ state: I.target }, U));
        } else {
          const F = c.andContext(U.semanticContext, I.getPredicate());
          N = new a({ state: I.target, semanticContext: F }, U);
        }
      else
        N = new a({ state: I.target }, U);
      return this.debug && console.log("config from pred transition=" + N), N;
    }
    predTransition(U, I, S, b, E) {
      this.debug && (console.log("PRED (collectPredicates=" + S + ") " + I.ruleIndex + ":" + I.predIndex + ", ctx dependent=" + I.isCtxDependent), this.parser !== null && console.log("context surrounding pred is " + f.arrayToString(this.parser.getRuleInvocationStack())));
      let N = null;
      if (S && (I.isCtxDependent && b || !I.isCtxDependent))
        if (E) {
          const F = this._input.index;
          this._input.seek(this._startIndex);
          const j = I.getPredicate().evaluate(this.parser, this._outerContext);
          this._input.seek(F), j && (N = new a({ state: I.target }, U));
        } else {
          const F = c.andContext(U.semanticContext, I.getPredicate());
          N = new a({ state: I.target, semanticContext: F }, U);
        }
      else
        N = new a({ state: I.target }, U);
      return this.debug && console.log("config from pred transition=" + N), N;
    }
    ruleTransition(U, I) {
      this.debug && console.log("CALL rule " + this.getRuleName(I.target.ruleIndex) + ", ctx=" + U.context);
      const S = I.followState, b = W.create(U.context, S.stateNumber);
      return new a({ state: I.target, context: b }, U);
    }
    getConflictingAlts(U) {
      const I = o.getConflictingAltSubsets(U);
      return o.getAlts(I);
    }
    /**
     * Sam pointed out a problem with the previous definition, v3, of
     * ambiguous states. If we have another state associated with conflicting
     * alternatives, we should keep going. For example, the following grammar
     *
     * s : (ID | ID ID?) ';' ;
     *
     * When the ATN simulation reaches the state before ';', it has a DFA
     * state that looks like: [12|1|[], 6|2|[], 12|2|[]]. Naturally
     * 12|1|[] and 12|2|[] conflict, but we cannot stop processing this node
     * because alternative to has another way to continue, via [6|2|[]].
     * The key is that we have a single state that has config's only associated
     * with a single alternative, 2, and crucially the state transitions
     * among the configurations are all non-epsilon transitions. That means
     * we don't consider any conflicts that include alternative 2. So, we
     * ignore the conflict between alts 1 and 2. We ignore a set of
     * conflicting alts when there is an intersection with an alternative
     * associated with a single alt state in the state&rarr;config-list map.
     *
     * It's also the case that we might have two conflicting configurations but
     * also a 3rd nonconflicting configuration for a different alternative:
     * [1|1|[], 1|2|[], 8|3|[]]. This can come about from grammar:
     *
     * a : A | A | A B ;
     *
     * After matching input A, we reach the stop state for rule A, state 1.
     * State 8 is the state right before B. Clearly alternatives 1 and 2
     * conflict and no amount of further lookahead will separate the two.
     * However, alternative 3 will be able to continue and so we do not
     * stop working on this state. In the previous example, we're concerned
     * with states associated with the conflicting alternatives. Here alt
     * 3 is not associated with the conflicting configs, but since we can continue
     * looking for input reasonably, I don't declare the state done. We
     * ignore a set of conflicting alts when we have an alternative
     * that we still need to pursue
     */
    getConflictingAltsOrUniqueAlt(U) {
      let I = null;
      return U.uniqueAlt !== l.INVALID_ALT_NUMBER ? (I = new y(), I.add(U.uniqueAlt)) : I = U.conflictingAlts, I;
    }
    getTokenName(U) {
      if (U === s.EOF)
        return "EOF";
      if (this.parser !== null && this.parser.literalNames !== null)
        if (U >= this.parser.literalNames.length && U >= this.parser.symbolicNames.length)
          console.log("" + U + " ttype out of range: " + this.parser.literalNames), console.log("" + this.parser.getInputStream().getTokens());
        else
          return (this.parser.literalNames[U] || this.parser.symbolicNames[U]) + "<" + U + ">";
      return "" + U;
    }
    getLookaheadName(U) {
      return this.getTokenName(U.LA(1));
    }
    /**
     * Used for debugging in adaptivePredict around execATN but I cut
     * it out for clarity now that alg. works well. We can leave this
     * "dead" code for a bit
     */
    dumpDeadEndConfigs(U) {
      console.log("dead end configs: ");
      const I = U.getDeadEndConfigs();
      for (let S = 0; S < I.length; S++) {
        const b = I[S];
        let E = "no edges";
        if (b.state.transitions.length > 0) {
          const N = b.state.transitions[0];
          N instanceof AtomTransition ? E = "Atom " + this.getTokenName(N.label) : N instanceof T && (E = (N instanceof M ? "~" : "") + "Set " + N.set);
        }
        console.error(b.toString(this.parser, !0) + ":" + E);
      }
    }
    noViableAlt(U, I, S, b) {
      return new z(this.parser, U, U.get(b), U.LT(1), S, I);
    }
    getUniqueAlt(U) {
      let I = l.INVALID_ALT_NUMBER;
      for (let S = 0; S < U.items.length; S++) {
        const b = U.items[S];
        if (I === l.INVALID_ALT_NUMBER)
          I = b.alt;
        else if (b.alt !== I)
          return l.INVALID_ALT_NUMBER;
      }
      return I;
    }
    /**
     * Add an edge to the DFA, if possible. This method calls
     * {@link //addDFAState} to ensure the {@code to} state is present in the
     * DFA. If {@code from} is {@code null}, or if {@code t} is outside the
     * range of edges that can be represented in the DFA tables, this method
     * returns without adding the edge to the DFA.
     *
     * <p>If {@code to} is {@code null}, this method returns {@code null}.
     * Otherwise, this method returns the {@link DFAState} returned by calling
     * {@link //addDFAState} for the {@code to} state.</p>
     *
     * @param dfa The DFA
     * @param from_ The source state for the edge
     * @param t The input symbol
     * @param to The target state for the edge
     *
     * @return If {@code to} is {@code null}, this method returns {@code null};
     * otherwise this method returns the result of calling {@link //addDFAState}
     * on {@code to}
     */
    addDFAEdge(U, I, S, b) {
      if (this.debug && console.log("EDGE " + I + " -> " + b + " upon " + this.getTokenName(S)), b === null)
        return null;
      if (b = this.addDFAState(U, b), I === null || S < -1 || S > this.atn.maxTokenType)
        return b;
      if (I.edges === null && (I.edges = []), I.edges[S + 1] = b, this.debug) {
        const E = this.parser === null ? null : this.parser.literalNames, N = this.parser === null ? null : this.parser.symbolicNames;
        console.log(`DFA=
` + U.toString(E, N));
      }
      return b;
    }
    /**
     * Add state {@code D} to the DFA if it is not already present, and return
     * the actual instance stored in the DFA. If a state equivalent to {@code D}
     * is already in the DFA, the existing state is returned. Otherwise this
     * method returns {@code D} after adding it to the DFA.
     *
     * <p>If {@code D} is {@link //ERROR}, this method returns {@link //ERROR} and
     * does not change the DFA.</p>
     *
     * @param dfa The dfa
     * @param D The DFA state to add
     * @return The state stored in the DFA. This will be either the existing
     * state if {@code D} is already in the DFA, or {@code D} itself if the
     * state was not already present
     */
    addDFAState(U, I) {
      if (I === n.ERROR)
        return I;
      const S = U.states.get(I);
      return S !== null ? S : (I.stateNumber = U.states.length, I.configs.readOnly || (I.configs.optimizeConfigs(this), I.configs.setReadonly(!0)), U.states.add(I), this.debug && console.log("adding new DFA state: " + I), I);
    }
    reportAttemptingFullContext(U, I, S, b, E) {
      if (this.debug || this.retry_debug) {
        const N = new h(b, E + 1);
        console.log("reportAttemptingFullContext decision=" + U.decision + ":" + S + ", input=" + this.parser.getTokenStream().getText(N));
      }
      this.parser !== null && this.parser.getErrorListenerDispatch().reportAttemptingFullContext(this.parser, U, b, E, I, S);
    }
    reportContextSensitivity(U, I, S, b, E) {
      if (this.debug || this.retry_debug) {
        const N = new h(b, E + 1);
        console.log("reportContextSensitivity decision=" + U.decision + ":" + S + ", input=" + this.parser.getTokenStream().getText(N));
      }
      this.parser !== null && this.parser.getErrorListenerDispatch().reportContextSensitivity(this.parser, U, b, E, I, S);
    }
    // If context sensitive parsing, we know it's ambiguity not conflict//
    reportAmbiguity(U, I, S, b, E, N, F) {
      if (this.debug || this.retry_debug) {
        const j = new h(S, b + 1);
        console.log("reportAmbiguity " + N + ":" + F + ", input=" + this.parser.getTokenStream().getText(j));
      }
      this.parser !== null && this.parser.getErrorListenerDispatch().reportAmbiguity(this.parser, U, S, b, E, N, F);
    }
  }
  return Et = w, Et;
}
var gl;
function Us() {
  return gl || (gl = 1, xe.ATN = Ne(), xe.ATNDeserializer = B0(), xe.LexerATNSimulator = Ls(), xe.ParserATNSimulator = Ts(), xe.PredictionMode = G0()), xe;
}
var Cl = {};
/*! https://mths.be/codepointat v0.2.0 by @mathias */
var yl;
function $0() {
  return yl || (yl = 1, String.prototype.codePointAt || function() {
    var f = function() {
      let y;
      try {
        const p = {}, l = Object.defineProperty;
        y = l(p, p, p) && l;
      } catch {
      }
      return y;
    }();
    const C = function(y) {
      if (this == null)
        throw TypeError();
      const p = String(this), l = p.length;
      let r = y ? Number(y) : 0;
      if (r !== r && (r = 0), r < 0 || r >= l)
        return;
      const e = p.charCodeAt(r);
      let a;
      return (
        // check if it’s the start of a surrogate pair
        e >= 55296 && e <= 56319 && // high surrogate
        l > r + 1 && (a = p.charCodeAt(r + 1), a >= 56320 && a <= 57343) ? (e - 55296) * 1024 + a - 56320 + 65536 : e
      );
    };
    f ? f(String.prototype, "codePointAt", {
      value: C,
      configurable: !0,
      writable: !0
    }) : String.prototype.codePointAt = C;
  }()), Cl;
}
var Se = {}, Nt, _l;
function We() {
  if (_l) return Nt;
  _l = 1;
  const f = oe();
  class C {
    constructor(l, r, e) {
      this.dfa = l, this.literalNames = r || [], this.symbolicNames = e || [];
    }
    toString() {
      if (this.dfa.s0 === null)
        return null;
      let l = "";
      const r = this.dfa.sortedStates();
      for (let e = 0; e < r.length; e++) {
        const a = r[e];
        if (a.edges !== null) {
          const u = a.edges.length;
          for (let s = 0; s < u; s++) {
            const t = a.edges[s] || null;
            t !== null && t.stateNumber !== 2147483647 && (l = l.concat(this.getStateString(a)), l = l.concat("-"), l = l.concat(this.getEdgeLabel(s)), l = l.concat("->"), l = l.concat(this.getStateString(t)), l = l.concat(`
`));
          }
        }
      }
      return l.length === 0 ? null : l;
    }
    getEdgeLabel(l) {
      return l === 0 ? "EOF" : this.literalNames !== null || this.symbolicNames !== null ? this.literalNames[l - 1] || this.symbolicNames[l - 1] : String.fromCharCode(l - 1);
    }
    getStateString(l) {
      const r = (l.isAcceptState ? ":" : "") + "s" + l.stateNumber + (l.requiresFullContext ? "^" : "");
      return l.isAcceptState ? l.predicates !== null ? r + "=>" + f.arrayToString(l.predicates) : r + "=>" + l.prediction.toString() : r;
    }
  }
  class y extends C {
    constructor(l) {
      super(l, null);
    }
    getEdgeLabel(l) {
      return "'" + String.fromCharCode(l) + "'";
    }
  }
  return Nt = { DFASerializer: C, LexerDFASerializer: y }, Nt;
}
var Ot, Ll;
function xs() {
  if (Ll) return Ot;
  Ll = 1;
  const { Set: f } = oe(), { DFAState: C } = ze(), { StarLoopEntryState: y } = Ue(), { ATNConfigSet: p } = Oe(), { DFASerializer: l } = We(), { LexerDFASerializer: r } = We();
  class e {
    constructor(u, s) {
      if (s === void 0 && (s = 0), this.atnStartState = u, this.decision = s, this._states = new f(), this.s0 = null, this.precedenceDfa = !1, u instanceof y && u.isPrecedenceDecision) {
        this.precedenceDfa = !0;
        const t = new C(null, new p());
        t.edges = [], t.isAcceptState = !1, t.requiresFullContext = !1, this.s0 = t;
      }
    }
    /**
     * Get the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @return The start state corresponding to the specified precedence, or
     * {@code null} if no start state exists for the specified precedence.
     *
     * @throws IllegalStateException if this is not a precedence DFA.
     * @see //isPrecedenceDfa()
     */
    getPrecedenceStartState(u) {
      if (!this.precedenceDfa)
        throw "Only precedence DFAs may contain a precedence start state.";
      return u < 0 || u >= this.s0.edges.length ? null : this.s0.edges[u] || null;
    }
    /**
     * Set the start state for a specific precedence value.
     *
     * @param precedence The current precedence.
     * @param startState The start state corresponding to the specified
     * precedence.
     *
     * @throws IllegalStateException if this is not a precedence DFA.
     * @see //isPrecedenceDfa()
     */
    setPrecedenceStartState(u, s) {
      if (!this.precedenceDfa)
        throw "Only precedence DFAs may contain a precedence start state.";
      u < 0 || (this.s0.edges[u] = s);
    }
    /**
     * Sets whether this is a precedence DFA. If the specified value differs
     * from the current DFA configuration, the following actions are taken;
     * otherwise no changes are made to the current DFA.
     *
     * <ul>
     * <li>The {@link //states} map is cleared</li>
     * <li>If {@code precedenceDfa} is {@code false}, the initial state
     * {@link //s0} is set to {@code null}; otherwise, it is initialized to a new
     * {@link DFAState} with an empty outgoing {@link DFAState//edges} array to
     * store the start states for individual precedence values.</li>
     * <li>The {@link //precedenceDfa} field is updated</li>
     * </ul>
     *
     * @param precedenceDfa {@code true} if this is a precedence DFA; otherwise,
     * {@code false}
     */
    setPrecedenceDfa(u) {
      if (this.precedenceDfa !== u) {
        if (this._states = new f(), u) {
          const s = new C(null, new p());
          s.edges = [], s.isAcceptState = !1, s.requiresFullContext = !1, this.s0 = s;
        } else
          this.s0 = null;
        this.precedenceDfa = u;
      }
    }
    /**
     * Return a list of all states in this DFA, ordered by state number.
     */
    sortedStates() {
      return this._states.values().sort(function(s, t) {
        return s.stateNumber - t.stateNumber;
      });
    }
    toString(u, s) {
      return u = u || null, s = s || null, this.s0 === null ? "" : new l(this, u, s).toString();
    }
    toLexerString() {
      return this.s0 === null ? "" : new r(this).toString();
    }
    get states() {
      return this._states;
    }
  }
  return Ot = e, Ot;
}
var Tl;
function bs() {
  return Tl || (Tl = 1, Se.DFA = xs(), Se.DFASerializer = We().DFASerializer, Se.LexerDFASerializer = We().LexerDFASerializer, Se.PredPrediction = ze().PredPrediction), Se;
}
var Ul = {};
/*! https://mths.be/fromcodepoint v0.2.1 by @mathias */
var xl;
function K0() {
  return xl || (xl = 1, String.fromCodePoint || function() {
    const f = function() {
      let l;
      try {
        const r = {}, e = Object.defineProperty;
        l = e(r, r, r) && e;
      } catch {
      }
      return l;
    }(), C = String.fromCharCode, y = Math.floor, p = function(l) {
      const e = [];
      let a, u, s = -1;
      const t = arguments.length;
      if (!t)
        return "";
      let i = "";
      for (; ++s < t; ) {
        let n = Number(arguments[s]);
        if (!isFinite(n) || // `NaN`, `+Infinity`, or `-Infinity`
        n < 0 || // not a valid Unicode code point
        n > 1114111 || // not a valid Unicode code point
        y(n) !== n)
          throw RangeError("Invalid code point: " + n);
        n <= 65535 ? e.push(n) : (n -= 65536, a = (n >> 10) + 55296, u = n % 1024 + 56320, e.push(a, u)), (s + 1 === t || e.length > 16384) && (i += C.apply(null, e), e.length = 0);
      }
      return i;
    };
    f ? f(String, "fromCodePoint", {
      value: p,
      configurable: !0,
      writable: !0
    }) : String.fromCodePoint = p;
  }()), Ul;
}
var At, bl;
function vs() {
  if (bl) return At;
  bl = 1;
  const f = Ee(), C = P0();
  return At = { ...f, Trees: C }, At;
}
var ge = {}, Rt, vl;
function Is() {
  if (vl) return Rt;
  vl = 1;
  const { BitSet: f } = oe(), { ErrorListener: C } = je(), { Interval: y } = me();
  class p extends C {
    constructor(r) {
      super(), r = r || !0, this.exactOnly = r;
    }
    reportAmbiguity(r, e, a, u, s, t, i) {
      if (this.exactOnly && !s)
        return;
      const n = "reportAmbiguity d=" + this.getDecisionDescription(r, e) + ": ambigAlts=" + this.getConflictingAlts(t, i) + ", input='" + r.getTokenStream().getText(new y(a, u)) + "'";
      r.notifyErrorListeners(n);
    }
    reportAttemptingFullContext(r, e, a, u, s, t) {
      const i = "reportAttemptingFullContext d=" + this.getDecisionDescription(r, e) + ", input='" + r.getTokenStream().getText(new y(a, u)) + "'";
      r.notifyErrorListeners(i);
    }
    reportContextSensitivity(r, e, a, u, s, t) {
      const i = "reportContextSensitivity d=" + this.getDecisionDescription(r, e) + ", input='" + r.getTokenStream().getText(new y(a, u)) + "'";
      r.notifyErrorListeners(i);
    }
    getDecisionDescription(r, e) {
      const a = e.decision, u = e.atnStartState.ruleIndex, s = r.ruleNames;
      if (u < 0 || u >= s.length)
        return "" + a;
      const t = s[u] || null;
      return t === null || t.length === 0 ? "" + a : `${a} (${t})`;
    }
    /**
     * Computes the set of conflicting or ambiguous alternatives from a
     * configuration set, if that information was not already provided by the
     * parser.
     *
     * @param reportedAlts The set of conflicting or ambiguous alternatives, as
     * reported by the parser.
     * @param configs The conflicting or ambiguous configuration set.
     * @return Returns {@code reportedAlts} if it is not {@code null}, otherwise
     * returns the set of alternatives represented in {@code configs}.
        */
    getConflictingAlts(r, e) {
      if (r !== null)
        return r;
      const a = new f();
      for (let u = 0; u < e.items.length; u++)
        a.add(e.items[u].alt);
      return `{${a.values().join(", ")}}`;
    }
  }
  return Rt = p, Rt;
}
var wt, Il;
function Mn() {
  if (Il) return wt;
  Il = 1;
  const { Token: f } = ue(), { NoViableAltException: C, InputMismatchException: y, FailedPredicateException: p, ParseCancellationException: l } = Ce(), { ATNState: r } = Ue(), { Interval: e, IntervalSet: a } = me();
  class u {
    reset(n) {
    }
    recoverInline(n) {
    }
    recover(n, o) {
    }
    sync(n) {
    }
    inErrorRecoveryMode(n) {
    }
    reportError(n) {
    }
  }
  class s extends u {
    constructor() {
      super(), this.errorRecoveryMode = !1, this.lastErrorIndex = -1, this.lastErrorStates = null, this.nextTokensContext = null, this.nextTokenState = 0;
    }
    /**
     * <p>The default implementation simply calls {@link //endErrorCondition} to
     * ensure that the handler is not in error recovery mode.</p>
    */
    reset(n) {
      this.endErrorCondition(n);
    }
    /**
     * This method is called to enter error recovery mode when a recognition
     * exception is reported.
     *
     * @param recognizer the parser instance
    */
    beginErrorCondition(n) {
      this.errorRecoveryMode = !0;
    }
    inErrorRecoveryMode(n) {
      return this.errorRecoveryMode;
    }
    /**
     * This method is called to leave error recovery mode after recovering from
     * a recognition exception.
     * @param recognizer
     */
    endErrorCondition(n) {
      this.errorRecoveryMode = !1, this.lastErrorStates = null, this.lastErrorIndex = -1;
    }
    /**
     * {@inheritDoc}
     * <p>The default implementation simply calls {@link //endErrorCondition}.</p>
     */
    reportMatch(n) {
      this.endErrorCondition(n);
    }
    /**
     * {@inheritDoc}
     *
     * <p>The default implementation returns immediately if the handler is already
     * in error recovery mode. Otherwise, it calls {@link //beginErrorCondition}
     * and dispatches the reporting task based on the runtime type of {@code e}
     * according to the following table.</p>
     *
     * <ul>
     * <li>{@link NoViableAltException}: Dispatches the call to
     * {@link //reportNoViableAlternative}</li>
     * <li>{@link InputMismatchException}: Dispatches the call to
     * {@link //reportInputMismatch}</li>
     * <li>{@link FailedPredicateException}: Dispatches the call to
     * {@link //reportFailedPredicate}</li>
     * <li>All other types: calls {@link Parser//notifyErrorListeners} to report
     * the exception</li>
     * </ul>
     */
    reportError(n, o) {
      this.inErrorRecoveryMode(n) || (this.beginErrorCondition(n), o instanceof C ? this.reportNoViableAlternative(n, o) : o instanceof y ? this.reportInputMismatch(n, o) : o instanceof p ? this.reportFailedPredicate(n, o) : (console.log("unknown recognition error type: " + o.constructor.name), console.log(o.stack), n.notifyErrorListeners(o.getOffendingToken(), o.getMessage(), o)));
    }
    /**
     *
     * {@inheritDoc}
     *
     * <p>The default implementation resynchronizes the parser by consuming tokens
     * until we find one in the resynchronization set--loosely the set of tokens
     * that can follow the current rule.</p>
     *
     */
    recover(n, o) {
      this.lastErrorIndex === n.getInputStream().index && this.lastErrorStates !== null && this.lastErrorStates.indexOf(n.state) >= 0 && n.consume(), this.lastErrorIndex = n._input.index, this.lastErrorStates === null && (this.lastErrorStates = []), this.lastErrorStates.push(n.state);
      const m = this.getErrorRecoverySet(n);
      this.consumeUntil(n, m);
    }
    /**
     * The default implementation of {@link ANTLRErrorStrategy//sync} makes sure
     * that the current lookahead symbol is consistent with what were expecting
     * at this point in the ATN. You can call this anytime but ANTLR only
     * generates code to check before subrules/loops and each iteration.
     *
     * <p>Implements Jim Idle's magic sync mechanism in closures and optional
     * subrules. E.g.,</p>
     *
     * <pre>
     * a : sync ( stuff sync )* ;
     * sync : {consume to what can follow sync} ;
     * </pre>
     *
     * At the start of a sub rule upon error, {@link //sync} performs single
     * token deletion, if possible. If it can't do that, it bails on the current
     * rule and uses the default error recovery, which consumes until the
     * resynchronization set of the current rule.
     *
     * <p>If the sub rule is optional ({@code (...)?}, {@code (...)*}, or block
     * with an empty alternative), then the expected set includes what follows
     * the subrule.</p>
     *
     * <p>During loop iteration, it consumes until it sees a token that can start a
     * sub rule or what follows loop. Yes, that is pretty aggressive. We opt to
     * stay in the loop as long as possible.</p>
     *
     * <p><strong>ORIGINS</strong></p>
     *
     * <p>Previous versions of ANTLR did a poor job of their recovery within loops.
     * A single mismatch token or missing token would force the parser to bail
     * out of the entire rules surrounding the loop. So, for rule</p>
     *
     * <pre>
     * classDef : 'class' ID '{' member* '}'
     * </pre>
     *
     * input with an extra token between members would force the parser to
     * consume until it found the next class definition rather than the next
     * member definition of the current class.
     *
     * <p>This functionality cost a little bit of effort because the parser has to
     * compare token set at the start of the loop and at each iteration. If for
     * some reason speed is suffering for you, you can turn off this
     * functionality by simply overriding this method as a blank { }.</p>
     *
     */
    sync(n) {
      if (this.inErrorRecoveryMode(n))
        return;
      const o = n._interp.atn.states[n.state], m = n.getTokenStream().LA(1), c = n.atn.nextTokens(o);
      if (c.contains(m)) {
        this.nextTokensContext = null, this.nextTokenState = r.INVALID_STATE_NUMBER;
        return;
      } else if (c.contains(f.EPSILON)) {
        this.nextTokensContext === null && (this.nextTokensContext = n._ctx, this.nextTokensState = n._stateNumber);
        return;
      }
      switch (o.stateType) {
        case r.BLOCK_START:
        case r.STAR_BLOCK_START:
        case r.PLUS_BLOCK_START:
        case r.STAR_LOOP_ENTRY:
          if (this.singleTokenDeletion(n) !== null)
            return;
          throw new y(n);
        case r.PLUS_LOOP_BACK:
        case r.STAR_LOOP_BACK:
          this.reportUnwantedToken(n);
          const d = new a();
          d.addSet(n.getExpectedTokens());
          const h = d.addSet(this.getErrorRecoverySet(n));
          this.consumeUntil(n, h);
          break;
      }
    }
    /**
     * This is called by {@link //reportError} when the exception is a
     * {@link NoViableAltException}.
     *
     * @see //reportError
     *
     * @param recognizer the parser instance
     * @param e the recognition exception
     */
    reportNoViableAlternative(n, o) {
      const m = n.getTokenStream();
      let c;
      m !== null ? o.startToken.type === f.EOF ? c = "<EOF>" : c = m.getText(new e(o.startToken.tokenIndex, o.offendingToken.tokenIndex)) : c = "<unknown input>";
      const d = "no viable alternative at input " + this.escapeWSAndQuote(c);
      n.notifyErrorListeners(d, o.offendingToken, o);
    }
    /**
     * This is called by {@link //reportError} when the exception is an
     * {@link InputMismatchException}.
     *
     * @see //reportError
     *
     * @param recognizer the parser instance
     * @param e the recognition exception
     */
    reportInputMismatch(n, o) {
      const m = "mismatched input " + this.getTokenErrorDisplay(o.offendingToken) + " expecting " + o.getExpectedTokens().toString(n.literalNames, n.symbolicNames);
      n.notifyErrorListeners(m, o.offendingToken, o);
    }
    /**
     * This is called by {@link //reportError} when the exception is a
     * {@link FailedPredicateException}.
     *
     * @see //reportError
     *
     * @param recognizer the parser instance
     * @param e the recognition exception
     */
    reportFailedPredicate(n, o) {
      const c = "rule " + n.ruleNames[n._ctx.ruleIndex] + " " + o.message;
      n.notifyErrorListeners(c, o.offendingToken, o);
    }
    /**
     * This method is called to report a syntax error which requires the removal
     * of a token from the input stream. At the time this method is called, the
     * erroneous symbol is current {@code LT(1)} symbol and has not yet been
     * removed from the input stream. When this method returns,
     * {@code recognizer} is in error recovery mode.
     *
     * <p>This method is called when {@link //singleTokenDeletion} identifies
     * single-token deletion as a viable recovery strategy for a mismatched
     * input error.</p>
     *
     * <p>The default implementation simply returns if the handler is already in
     * error recovery mode. Otherwise, it calls {@link //beginErrorCondition} to
     * enter error recovery mode, followed by calling
     * {@link Parser//notifyErrorListeners}.</p>
     *
     * @param recognizer the parser instance
     *
     */
    reportUnwantedToken(n) {
      if (this.inErrorRecoveryMode(n))
        return;
      this.beginErrorCondition(n);
      const o = n.getCurrentToken(), m = this.getTokenErrorDisplay(o), c = this.getExpectedTokens(n), d = "extraneous input " + m + " expecting " + c.toString(n.literalNames, n.symbolicNames);
      n.notifyErrorListeners(d, o, null);
    }
    /**
     * This method is called to report a syntax error which requires the
     * insertion of a missing token into the input stream. At the time this
     * method is called, the missing token has not yet been inserted. When this
     * method returns, {@code recognizer} is in error recovery mode.
     *
     * <p>This method is called when {@link //singleTokenInsertion} identifies
     * single-token insertion as a viable recovery strategy for a mismatched
     * input error.</p>
     *
     * <p>The default implementation simply returns if the handler is already in
     * error recovery mode. Otherwise, it calls {@link //beginErrorCondition} to
     * enter error recovery mode, followed by calling
     * {@link Parser//notifyErrorListeners}.</p>
     *
     * @param recognizer the parser instance
     */
    reportMissingToken(n) {
      if (this.inErrorRecoveryMode(n))
        return;
      this.beginErrorCondition(n);
      const o = n.getCurrentToken(), c = "missing " + this.getExpectedTokens(n).toString(n.literalNames, n.symbolicNames) + " at " + this.getTokenErrorDisplay(o);
      n.notifyErrorListeners(c, o, null);
    }
    /**
     * <p>The default implementation attempts to recover from the mismatched input
     * by using single token insertion and deletion as described below. If the
     * recovery attempt fails, this method throws an
     * {@link InputMismatchException}.</p>
     *
     * <p><strong>EXTRA TOKEN</strong> (single token deletion)</p>
     *
     * <p>{@code LA(1)} is not what we are looking for. If {@code LA(2)} has the
     * right token, however, then assume {@code LA(1)} is some extra spurious
     * token and delete it. Then consume and return the next token (which was
     * the {@code LA(2)} token) as the successful result of the match operation.</p>
     *
     * <p>This recovery strategy is implemented by {@link
     * //singleTokenDeletion}.</p>
     *
     * <p><strong>MISSING TOKEN</strong> (single token insertion)</p>
     *
     * <p>If current token (at {@code LA(1)}) is consistent with what could come
     * after the expected {@code LA(1)} token, then assume the token is missing
     * and use the parser's {@link TokenFactory} to create it on the fly. The
     * "insertion" is performed by returning the created token as the successful
     * result of the match operation.</p>
     *
     * <p>This recovery strategy is implemented by {@link
     * //singleTokenInsertion}.</p>
     *
     * <p><strong>EXAMPLE</strong></p>
     *
     * <p>For example, Input {@code i=(3;} is clearly missing the {@code ')'}. When
     * the parser returns from the nested call to {@code expr}, it will have
     * call chain:</p>
     *
     * <pre>
     * stat &rarr; expr &rarr; atom
     * </pre>
     *
     * and it will be trying to match the {@code ')'} at this point in the
     * derivation:
     *
     * <pre>
     * =&gt; ID '=' '(' INT ')' ('+' atom)* ';'
     * ^
     * </pre>
     *
     * The attempt to match {@code ')'} will fail when it sees {@code ';'} and
     * call {@link //recoverInline}. To recover, it sees that {@code LA(1)==';'}
     * is in the set of tokens that can follow the {@code ')'} token reference
     * in rule {@code atom}. It can assume that you forgot the {@code ')'}.
     */
    recoverInline(n) {
      const o = this.singleTokenDeletion(n);
      if (o !== null)
        return n.consume(), o;
      if (this.singleTokenInsertion(n))
        return this.getMissingSymbol(n);
      throw new y(n);
    }
    /**
     * This method implements the single-token insertion inline error recovery
     * strategy. It is called by {@link //recoverInline} if the single-token
     * deletion strategy fails to recover from the mismatched input. If this
     * method returns {@code true}, {@code recognizer} will be in error recovery
     * mode.
     *
     * <p>This method determines whether or not single-token insertion is viable by
     * checking if the {@code LA(1)} input symbol could be successfully matched
     * if it were instead the {@code LA(2)} symbol. If this method returns
     * {@code true}, the caller is responsible for creating and inserting a
     * token with the correct type to produce this behavior.</p>
     *
     * @param recognizer the parser instance
     * @return {@code true} if single-token insertion is a viable recovery
     * strategy for the current mismatched input, otherwise {@code false}
     */
    singleTokenInsertion(n) {
      const o = n.getTokenStream().LA(1), m = n._interp.atn, d = m.states[n.state].transitions[0].target;
      return m.nextTokens(d, n._ctx).contains(o) ? (this.reportMissingToken(n), !0) : !1;
    }
    /**
     * This method implements the single-token deletion inline error recovery
     * strategy. It is called by {@link //recoverInline} to attempt to recover
     * from mismatched input. If this method returns null, the parser and error
     * handler state will not have changed. If this method returns non-null,
     * {@code recognizer} will <em>not</em> be in error recovery mode since the
     * returned token was a successful match.
     *
     * <p>If the single-token deletion is successful, this method calls
     * {@link //reportUnwantedToken} to report the error, followed by
     * {@link Parser//consume} to actually "delete" the extraneous token. Then,
     * before returning {@link //reportMatch} is called to signal a successful
     * match.</p>
     *
     * @param recognizer the parser instance
     * @return the successfully matched {@link Token} instance if single-token
     * deletion successfully recovers from the mismatched input, otherwise
     * {@code null}
     */
    singleTokenDeletion(n) {
      const o = n.getTokenStream().LA(2);
      if (this.getExpectedTokens(n).contains(o)) {
        this.reportUnwantedToken(n), n.consume();
        const c = n.getCurrentToken();
        return this.reportMatch(n), c;
      } else
        return null;
    }
    /**
     * Conjure up a missing token during error recovery.
     *
     * The recognizer attempts to recover from single missing
     * symbols. But, actions might refer to that missing symbol.
     * For example, x=ID {f($x);}. The action clearly assumes
     * that there has been an identifier matched previously and that
     * $x points at that token. If that token is missing, but
     * the next token in the stream is what we want we assume that
     * this token is missing and we keep going. Because we
     * have to return some token to replace the missing token,
     * we have to conjure one up. This method gives the user control
     * over the tokens returned for missing tokens. Mostly,
     * you will want to create something special for identifier
     * tokens. For literals such as '{' and ',', the default
     * action in the parser or tree parser works. It simply creates
     * a CommonToken of the appropriate type. The text will be the token.
     * If you change what tokens must be created by the lexer,
     * override this method to create the appropriate tokens.
     *
     */
    getMissingSymbol(n) {
      const o = n.getCurrentToken(), c = this.getExpectedTokens(n).first();
      let d;
      c === f.EOF ? d = "<missing EOF>" : d = "<missing " + n.literalNames[c] + ">";
      let h = o;
      const _ = n.getTokenStream().LT(-1);
      return h.type === f.EOF && _ !== null && (h = _), n.getTokenFactory().create(
        h.source,
        c,
        d,
        f.DEFAULT_CHANNEL,
        -1,
        -1,
        h.line,
        h.column
      );
    }
    getExpectedTokens(n) {
      return n.getExpectedTokens();
    }
    /**
     * How should a token be displayed in an error message? The default
     * is to display just the text, but during development you might
     * want to have a lot of information spit out. Override in that case
     * to use t.toString() (which, for CommonToken, dumps everything about
     * the token). This is better than forcing you to override a method in
     * your token objects because you don't have to go modify your lexer
     * so that it creates a new Java type.
     */
    getTokenErrorDisplay(n) {
      if (n === null)
        return "<no token>";
      let o = n.text;
      return o === null && (n.type === f.EOF ? o = "<EOF>" : o = "<" + n.type + ">"), this.escapeWSAndQuote(o);
    }
    escapeWSAndQuote(n) {
      return n = n.replace(/\n/g, "\\n"), n = n.replace(/\r/g, "\\r"), n = n.replace(/\t/g, "\\t"), "'" + n + "'";
    }
    /**
     * Compute the error recovery set for the current rule. During
     * rule invocation, the parser pushes the set of tokens that can
     * follow that rule reference on the stack; this amounts to
     * computing FIRST of what follows the rule reference in the
     * enclosing rule. See LinearApproximator.FIRST().
     * This local follow set only includes tokens
     * from within the rule; i.e., the FIRST computation done by
     * ANTLR stops at the end of a rule.
     *
     * EXAMPLE
     *
     * When you find a "no viable alt exception", the input is not
     * consistent with any of the alternatives for rule r. The best
     * thing to do is to consume tokens until you see something that
     * can legally follow a call to r//or* any rule that called r.
     * You don't want the exact set of viable next tokens because the
     * input might just be missing a token--you might consume the
     * rest of the input looking for one of the missing tokens.
     *
     * Consider grammar:
     *
     * a : '[' b ']'
     * | '(' b ')'
     * ;
     * b : c '^' INT ;
     * c : ID
     * | INT
     * ;
     *
     * At each rule invocation, the set of tokens that could follow
     * that rule is pushed on a stack. Here are the various
     * context-sensitive follow sets:
     *
     * FOLLOW(b1_in_a) = FIRST(']') = ']'
     * FOLLOW(b2_in_a) = FIRST(')') = ')'
     * FOLLOW(c_in_b) = FIRST('^') = '^'
     *
     * Upon erroneous input "[]", the call chain is
     *
     * a -> b -> c
     *
     * and, hence, the follow context stack is:
     *
     * depth follow set start of rule execution
     * 0 <EOF> a (from main())
     * 1 ']' b
     * 2 '^' c
     *
     * Notice that ')' is not included, because b would have to have
     * been called from a different context in rule a for ')' to be
     * included.
     *
     * For error recovery, we cannot consider FOLLOW(c)
     * (context-sensitive or otherwise). We need the combined set of
     * all context-sensitive FOLLOW sets--the set of all tokens that
     * could follow any reference in the call chain. We need to
     * resync to one of those tokens. Note that FOLLOW(c)='^' and if
     * we resync'd to that token, we'd consume until EOF. We need to
     * sync to context-sensitive FOLLOWs for a, b, and c: {']','^'}.
     * In this case, for input "[]", LA(1) is ']' and in the set, so we would
     * not consume anything. After printing an error, rule c would
     * return normally. Rule b would not find the required '^' though.
     * At this point, it gets a mismatched token error and throws an
     * exception (since LA(1) is not in the viable following token
     * set). The rule exception handler tries to recover, but finds
     * the same recovery set and doesn't consume anything. Rule b
     * exits normally returning to rule a. Now it finds the ']' (and
     * with the successful match exits errorRecovery mode).
     *
     * So, you can see that the parser walks up the call chain looking
     * for the token that was a member of the recovery set.
     *
     * Errors are not generated in errorRecovery mode.
     *
     * ANTLR's error recovery mechanism is based upon original ideas:
     *
     * "Algorithms + Data Structures = Programs" by Niklaus Wirth
     *
     * and
     *
     * "A note on error recovery in recursive descent parsers":
     * http://portal.acm.org/citation.cfm?id=947902.947905
     *
     * Later, Josef Grosch had some good ideas:
     *
     * "Efficient and Comfortable Error Recovery in Recursive Descent
     * Parsers":
     * ftp://www.cocolab.com/products/cocktail/doca4.ps/ell.ps.zip
     *
     * Like Grosch I implement context-sensitive FOLLOW sets that are combined
     * at run-time upon error to avoid overhead during parsing.
     */
    getErrorRecoverySet(n) {
      const o = n._interp.atn;
      let m = n._ctx;
      const c = new a();
      for (; m !== null && m.invokingState >= 0; ) {
        const h = o.states[m.invokingState].transitions[0], _ = o.nextTokens(h.followState);
        c.addSet(_), m = m.parentCtx;
      }
      return c.removeOne(f.EPSILON), c;
    }
    // Consume tokens until one matches the given token set.//
    consumeUntil(n, o) {
      let m = n.getTokenStream().LA(1);
      for (; m !== f.EOF && !o.contains(m); )
        n.consume(), m = n.getTokenStream().LA(1);
    }
  }
  class t extends s {
    constructor() {
      super();
    }
    /**
     * Instead of recovering from exception {@code e}, re-throw it wrapped
     * in a {@link ParseCancellationException} so it is not caught by the
     * rule function catches. Use {@link Exception//getCause()} to get the
     * original {@link RecognitionException}.
     */
    recover(n, o) {
      let m = n._ctx;
      for (; m !== null; )
        m.exception = o, m = m.parentCtx;
      throw new l(o);
    }
    /**
     * Make sure we don't attempt to recover inline; if the parser
     * successfully recovers, it won't throw an exception.
     */
    recoverInline(n) {
      this.recover(n, new y(n));
    }
    // Make sure we don't attempt to recover from problems in subrules.//
    sync(n) {
    }
  }
  return wt = { BailErrorStrategy: t, DefaultErrorStrategy: s }, wt;
}
var Sl;
function Ss() {
  return Sl || (Sl = 1, ge.RecognitionException = Ce().RecognitionException, ge.NoViableAltException = Ce().NoViableAltException, ge.LexerNoViableAltException = Ce().LexerNoViableAltException, ge.InputMismatchException = Ce().InputMismatchException, ge.FailedPredicateException = Ce().FailedPredicateException, ge.DiagnosticErrorListener = Is(), ge.BailErrorStrategy = Mn().BailErrorStrategy, ge.DefaultErrorStrategy = Mn().DefaultErrorStrategy, ge.ErrorListener = je().ErrorListener), ge;
}
var kt, Ml;
function Ms() {
  if (Ml) return kt;
  Ml = 1;
  const { Token: f } = ue();
  $0(), K0();
  class C {
    constructor(p, l) {
      if (this.name = "<empty>", this.strdata = p, this.decodeToUnicodeCodePoints = l || !1, this._index = 0, this.data = [], this.decodeToUnicodeCodePoints)
        for (let r = 0; r < this.strdata.length; ) {
          const e = this.strdata.codePointAt(r);
          this.data.push(e), r += e <= 65535 ? 1 : 2;
        }
      else {
        this.data = new Array(this.strdata.length);
        for (let r = 0; r < this.strdata.length; r++) {
          const e = this.strdata.charCodeAt(r);
          this.data[r] = e;
        }
      }
      this._size = this.data.length;
    }
    /**
     * Reset the stream so that it's in the same state it was
     * when the object was created *except* the data array is not
     * touched.
     */
    reset() {
      this._index = 0;
    }
    consume() {
      if (this._index >= this._size)
        throw "cannot consume EOF";
      this._index += 1;
    }
    LA(p) {
      if (p === 0)
        return 0;
      p < 0 && (p += 1);
      const l = this._index + p - 1;
      return l < 0 || l >= this._size ? f.EOF : this.data[l];
    }
    LT(p) {
      return this.LA(p);
    }
    // mark/release do nothing; we have entire buffer
    mark() {
      return -1;
    }
    release(p) {
    }
    /**
     * consume() ahead until p==_index; can't just set p=_index as we must
     * update line and column. If we seek backwards, just set p
     */
    seek(p) {
      if (p <= this._index) {
        this._index = p;
        return;
      }
      this._index = Math.min(p, this._size);
    }
    getText(p, l) {
      if (l >= this._size && (l = this._size - 1), p >= this._size)
        return "";
      if (this.decodeToUnicodeCodePoints) {
        let r = "";
        for (let e = p; e <= l; e++)
          r += String.fromCodePoint(this.data[e]);
        return r;
      } else
        return this.strdata.slice(p, l + 1);
    }
    toString() {
      return this.strdata;
    }
    get index() {
      return this._index;
    }
    get size() {
      return this._size;
    }
  }
  return kt = C, kt;
}
var Pt, El;
function Es() {
  if (El) return Pt;
  El = 1;
  const { Token: f } = ue(), C = Ye(), { Interval: y } = me();
  class p {
  }
  class l extends p {
    constructor(e) {
      super(), this.tokenSource = e, this.tokens = [], this.index = -1, this.fetchedEOF = !1;
    }
    mark() {
      return 0;
    }
    release(e) {
    }
    reset() {
      this.seek(0);
    }
    seek(e) {
      this.lazyInit(), this.index = this.adjustSeekIndex(e);
    }
    get(e) {
      return this.lazyInit(), this.tokens[e];
    }
    consume() {
      let e = !1;
      if (this.index >= 0 ? this.fetchedEOF ? e = this.index < this.tokens.length - 1 : e = this.index < this.tokens.length : e = !1, !e && this.LA(1) === f.EOF)
        throw "cannot consume EOF";
      this.sync(this.index + 1) && (this.index = this.adjustSeekIndex(this.index + 1));
    }
    /**
     * Make sure index {@code i} in tokens has a token.
     *
     * @return {Boolean} {@code true} if a token is located at index {@code i}, otherwise
     * {@code false}.
     * @see //get(int i)
     */
    sync(e) {
      const a = e - this.tokens.length + 1;
      return a > 0 ? this.fetch(a) >= a : !0;
    }
    /**
     * Add {@code n} elements to buffer.
     *
     * @return {Number} The actual number of elements added to the buffer.
     */
    fetch(e) {
      if (this.fetchedEOF)
        return 0;
      for (let a = 0; a < e; a++) {
        const u = this.tokenSource.nextToken();
        if (u.tokenIndex = this.tokens.length, this.tokens.push(u), u.type === f.EOF)
          return this.fetchedEOF = !0, a + 1;
      }
      return e;
    }
    // Get all tokens from start..stop inclusively///
    getTokens(e, a, u) {
      if (u === void 0 && (u = null), e < 0 || a < 0)
        return null;
      this.lazyInit();
      const s = [];
      a >= this.tokens.length && (a = this.tokens.length - 1);
      for (let t = e; t < a; t++) {
        const i = this.tokens[t];
        if (i.type === f.EOF)
          break;
        (u === null || u.contains(i.type)) && s.push(i);
      }
      return s;
    }
    LA(e) {
      return this.LT(e).type;
    }
    LB(e) {
      return this.index - e < 0 ? null : this.tokens[this.index - e];
    }
    LT(e) {
      if (this.lazyInit(), e === 0)
        return null;
      if (e < 0)
        return this.LB(-e);
      const a = this.index + e - 1;
      return this.sync(a), a >= this.tokens.length ? this.tokens[this.tokens.length - 1] : this.tokens[a];
    }
    /**
     * Allowed derived classes to modify the behavior of operations which change
     * the current stream position by adjusting the target token index of a seek
     * operation. The default implementation simply returns {@code i}. If an
     * exception is thrown in this method, the current stream index should not be
     * changed.
     *
     * <p>For example, {@link CommonTokenStream} overrides this method to ensure
     * that
     * the seek target is always an on-channel token.</p>
     *
     * @param {Number} i The target token index.
     * @return {Number} The adjusted target token index.
     */
    adjustSeekIndex(e) {
      return e;
    }
    lazyInit() {
      this.index === -1 && this.setup();
    }
    setup() {
      this.sync(0), this.index = this.adjustSeekIndex(0);
    }
    // Reset this token stream by setting its token source.///
    setTokenSource(e) {
      this.tokenSource = e, this.tokens = [], this.index = -1, this.fetchedEOF = !1;
    }
    /**
     * Given a starting index, return the index of the next token on channel.
     * Return i if tokens[i] is on channel. Return -1 if there are no tokens
     * on channel between i and EOF.
     */
    nextTokenOnChannel(e, a) {
      if (this.sync(e), e >= this.tokens.length)
        return -1;
      let u = this.tokens[e];
      for (; u.channel !== this.channel; ) {
        if (u.type === f.EOF)
          return -1;
        e += 1, this.sync(e), u = this.tokens[e];
      }
      return e;
    }
    /**
     * Given a starting index, return the index of the previous token on channel.
     * Return i if tokens[i] is on channel. Return -1 if there are no tokens
     * on channel between i and 0.
     */
    previousTokenOnChannel(e, a) {
      for (; e >= 0 && this.tokens[e].channel !== a; )
        e -= 1;
      return e;
    }
    /**
     * Collect all tokens on specified channel to the right of
     * the current token up until we see a token on DEFAULT_TOKEN_CHANNEL or
     * EOF. If channel is -1, find any non default channel token.
     */
    getHiddenTokensToRight(e, a) {
      if (a === void 0 && (a = -1), this.lazyInit(), e < 0 || e >= this.tokens.length)
        throw "" + e + " not in 0.." + this.tokens.length - 1;
      const u = this.nextTokenOnChannel(e + 1, C.DEFAULT_TOKEN_CHANNEL), s = e + 1, t = u === -1 ? this.tokens.length - 1 : u;
      return this.filterForChannel(s, t, a);
    }
    /**
     * Collect all tokens on specified channel to the left of
     * the current token up until we see a token on DEFAULT_TOKEN_CHANNEL.
     * If channel is -1, find any non default channel token.
     */
    getHiddenTokensToLeft(e, a) {
      if (a === void 0 && (a = -1), this.lazyInit(), e < 0 || e >= this.tokens.length)
        throw "" + e + " not in 0.." + this.tokens.length - 1;
      const u = this.previousTokenOnChannel(e - 1, C.DEFAULT_TOKEN_CHANNEL);
      if (u === e - 1)
        return null;
      const s = u + 1, t = e - 1;
      return this.filterForChannel(s, t, a);
    }
    filterForChannel(e, a, u) {
      const s = [];
      for (let t = e; t < a + 1; t++) {
        const i = this.tokens[t];
        u === -1 ? i.channel !== C.DEFAULT_TOKEN_CHANNEL && s.push(i) : i.channel === u && s.push(i);
      }
      return s.length === 0 ? null : s;
    }
    getSourceName() {
      return this.tokenSource.getSourceName();
    }
    // Get the text of all tokens in this buffer.///
    getText(e) {
      this.lazyInit(), this.fill(), e == null && (e = new y(0, this.tokens.length - 1));
      let a = e.start;
      a instanceof f && (a = a.tokenIndex);
      let u = e.stop;
      if (u instanceof f && (u = u.tokenIndex), a === null || u === null || a < 0 || u < 0)
        return "";
      u >= this.tokens.length && (u = this.tokens.length - 1);
      let s = "";
      for (let t = a; t < u + 1; t++) {
        const i = this.tokens[t];
        if (i.type === f.EOF)
          break;
        s = s + i.text;
      }
      return s;
    }
    // Get all tokens from lexer until EOF///
    fill() {
      for (this.lazyInit(); this.fetch(1e3) === 1e3; )
        ;
    }
  }
  return Pt = l, Pt;
}
var Ft, Nl;
function Ns() {
  if (Nl) return Ft;
  Nl = 1;
  const f = ue().Token, C = Es();
  class y extends C {
    constructor(l, r) {
      super(l), this.channel = r === void 0 ? f.DEFAULT_CHANNEL : r;
    }
    adjustSeekIndex(l) {
      return this.nextTokenOnChannel(l, this.channel);
    }
    LB(l) {
      if (l === 0 || this.index - l < 0)
        return null;
      let r = this.index, e = 1;
      for (; e <= l; )
        r = this.previousTokenOnChannel(r - 1, this.channel), e += 1;
      return r < 0 ? null : this.tokens[r];
    }
    LT(l) {
      if (this.lazyInit(), l === 0)
        return null;
      if (l < 0)
        return this.LB(-l);
      let r = this.index, e = 1;
      for (; e < l; )
        this.sync(r + 1) && (r = this.nextTokenOnChannel(r + 1, this.channel)), e += 1;
      return this.tokens[r];
    }
    // Count EOF just once.
    getNumberOfOnChannelTokens() {
      let l = 0;
      this.fill();
      for (let r = 0; r < this.tokens.length; r++) {
        const e = this.tokens[r];
        if (e.channel === this.channel && (l += 1), e.type === f.EOF)
          break;
      }
      return l;
    }
  }
  return Ft = y, Ft;
}
var qt, Ol;
function Os() {
  if (Ol) return qt;
  Ol = 1;
  const { Token: f } = ue(), { ParseTreeListener: C, TerminalNode: y, ErrorNode: p } = Ee(), l = H0(), { DefaultErrorStrategy: r } = Mn(), e = B0(), a = q0(), u = Ye();
  class s extends C {
    constructor(n) {
      super(), this.parser = n;
    }
    enterEveryRule(n) {
      console.log("enter   " + this.parser.ruleNames[n.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
    }
    visitTerminal(n) {
      console.log("consume " + n.symbol + " rule " + this.parser.ruleNames[this.parser._ctx.ruleIndex]);
    }
    exitEveryRule(n) {
      console.log("exit    " + this.parser.ruleNames[n.ruleIndex] + ", LT(1)=" + this.parser._input.LT(1).text);
    }
  }
  class t extends l {
    /**
     * this is all the parsing support code essentially; most of it is error
     * recovery stuff.
     */
    constructor(n) {
      super(), this._input = null, this._errHandler = new r(), this._precedenceStack = [], this._precedenceStack.push(0), this._ctx = null, this.buildParseTrees = !0, this._tracer = null, this._parseListeners = null, this._syntaxErrors = 0, this.setInputStream(n);
    }
    // reset the parser's state
    reset() {
      this._input !== null && this._input.seek(0), this._errHandler.reset(this), this._ctx = null, this._syntaxErrors = 0, this.setTrace(!1), this._precedenceStack = [], this._precedenceStack.push(0), this._interp !== null && this._interp.reset();
    }
    /**
     * Match current input symbol against {@code ttype}. If the symbol type
     * matches, {@link ANTLRErrorStrategy//reportMatch} and {@link //consume} are
     * called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy//recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link //getBuildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext//addErrorNode}.</p>
     *
     * @param ttype the token type to match
     * @return the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * {@code ttype} and the error strategy could not recover from the
     * mismatched symbol
     */
    match(n) {
      let o = this.getCurrentToken();
      return o.type === n ? (this._errHandler.reportMatch(this), this.consume()) : (o = this._errHandler.recoverInline(this), this.buildParseTrees && o.tokenIndex === -1 && this._ctx.addErrorNode(o)), o;
    }
    /**
     * Match current input symbol as a wildcard. If the symbol type matches
     * (i.e. has a value greater than 0), {@link ANTLRErrorStrategy//reportMatch}
     * and {@link //consume} are called to complete the match process.
     *
     * <p>If the symbol type does not match,
     * {@link ANTLRErrorStrategy//recoverInline} is called on the current error
     * strategy to attempt recovery. If {@link //getBuildParseTree} is
     * {@code true} and the token index of the symbol returned by
     * {@link ANTLRErrorStrategy//recoverInline} is -1, the symbol is added to
     * the parse tree by calling {@link ParserRuleContext//addErrorNode}.</p>
     *
     * @return the matched symbol
     * @throws RecognitionException if the current input symbol did not match
     * a wildcard and the error strategy could not recover from the mismatched
     * symbol
     */
    matchWildcard() {
      let n = this.getCurrentToken();
      return n.type > 0 ? (this._errHandler.reportMatch(this), this.consume()) : (n = this._errHandler.recoverInline(this), this._buildParseTrees && n.tokenIndex === -1 && this._ctx.addErrorNode(n)), n;
    }
    getParseListeners() {
      return this._parseListeners || [];
    }
    /**
     * Registers {@code listener} to receive events during the parsing process.
     *
     * <p>To support output-preserving grammar transformations (including but not
     * limited to left-recursion removal, automated left-factoring, and
     * optimized code generation), calls to listener methods during the parse
     * may differ substantially from calls made by
     * {@link ParseTreeWalker//DEFAULT} used after the parse is complete. In
     * particular, rule entry and exit events may occur in a different order
     * during the parse than after the parser. In addition, calls to certain
     * rule entry methods may be omitted.</p>
     *
     * <p>With the following specific exceptions, calls to listener events are
     * <em>deterministic</em>, i.e. for identical input the calls to listener
     * methods will be the same.</p>
     *
     * <ul>
     * <li>Alterations to the grammar used to generate code may change the
     * behavior of the listener calls.</li>
     * <li>Alterations to the command line options passed to ANTLR 4 when
     * generating the parser may change the behavior of the listener calls.</li>
     * <li>Changing the version of the ANTLR Tool used to generate the parser
     * may change the behavior of the listener calls.</li>
     * </ul>
     *
     * @param listener the listener to add
     *
     * @throws NullPointerException if {@code} listener is {@code null}
     */
    addParseListener(n) {
      if (n === null)
        throw "listener";
      this._parseListeners === null && (this._parseListeners = []), this._parseListeners.push(n);
    }
    /**
     * Remove {@code listener} from the list of parse listeners.
     *
     * <p>If {@code listener} is {@code null} or has not been added as a parse
     * listener, this method does nothing.</p>
     * @param listener the listener to remove
     */
    removeParseListener(n) {
      if (this._parseListeners !== null) {
        const o = this._parseListeners.indexOf(n);
        o >= 0 && this._parseListeners.splice(o, 1), this._parseListeners.length === 0 && (this._parseListeners = null);
      }
    }
    // Remove all parse listeners.
    removeParseListeners() {
      this._parseListeners = null;
    }
    // Notify any parse listeners of an enter rule event.
    triggerEnterRuleEvent() {
      if (this._parseListeners !== null) {
        const n = this._ctx;
        this._parseListeners.forEach(function(o) {
          o.enterEveryRule(n), n.enterRule(o);
        });
      }
    }
    /**
     * Notify any parse listeners of an exit rule event.
     * @see //addParseListener
     */
    triggerExitRuleEvent() {
      if (this._parseListeners !== null) {
        const n = this._ctx;
        this._parseListeners.slice(0).reverse().forEach(function(o) {
          n.exitRule(o), o.exitEveryRule(n);
        });
      }
    }
    getTokenFactory() {
      return this._input.tokenSource._factory;
    }
    // Tell our token source and error strategy about a new way to create tokens.
    setTokenFactory(n) {
      this._input.tokenSource._factory = n;
    }
    /**
     * The ATN with bypass alternatives is expensive to create so we create it
     * lazily.
     *
     * @throws UnsupportedOperationException if the current parser does not
     * implement the {@link //getSerializedATN()} method.
     */
    getATNWithBypassAlts() {
      const n = this.getSerializedATN();
      if (n === null)
        throw "The current parser does not support an ATN with bypass alternatives.";
      let o = this.bypassAltsAtnCache[n];
      if (o === null) {
        const m = new a();
        m.generateRuleBypassTransitions = !0, o = new e(m).deserialize(n), this.bypassAltsAtnCache[n] = o;
      }
      return o;
    }
    /**
     * The preferred method of getting a tree pattern. For example, here's a
     * sample use:
     *
     * <pre>
     * ParseTree t = parser.expr();
     * ParseTreePattern p = parser.compileParseTreePattern("&lt;ID&gt;+0",
     * MyParser.RULE_expr);
     * ParseTreeMatch m = p.match(t);
     * String id = m.get("ID");
     * </pre>
     */
    compileParseTreePattern(n, o, m) {
      if (m = m || null, m === null && this.getTokenStream() !== null) {
        const d = this.getTokenStream().tokenSource;
        d instanceof u && (m = d);
      }
      if (m === null)
        throw "Parser can't discover a lexer to use";
      return new ParseTreePatternMatcher(m, this).compile(n, o);
    }
    getInputStream() {
      return this.getTokenStream();
    }
    setInputStream(n) {
      this.setTokenStream(n);
    }
    getTokenStream() {
      return this._input;
    }
    // Set the token stream and reset the parser.
    setTokenStream(n) {
      this._input = null, this.reset(), this._input = n;
    }
    /**
     * Match needs to return the current input symbol, which gets put
     * into the label for the associated token ref; e.g., x=ID.
     */
    getCurrentToken() {
      return this._input.LT(1);
    }
    notifyErrorListeners(n, o, m) {
      o = o || null, m = m || null, o === null && (o = this.getCurrentToken()), this._syntaxErrors += 1;
      const c = o.line, d = o.column;
      this.getErrorListenerDispatch().syntaxError(this, o, c, d, n, m);
    }
    /**
     * Consume and return the {@linkplain //getCurrentToken current symbol}.
     *
     * <p>E.g., given the following input with {@code A} being the current
     * lookahead symbol, this function moves the cursor to {@code B} and returns
     * {@code A}.</p>
     *
     * <pre>
     * A B
     * ^
     * </pre>
     *
     * If the parser is not in error recovery mode, the consumed symbol is added
     * to the parse tree using {@link ParserRuleContext//addChild(Token)}, and
     * {@link ParseTreeListener//visitTerminal} is called on any parse listeners.
     * If the parser <em>is</em> in error recovery mode, the consumed symbol is
     * added to the parse tree using
     * {@link ParserRuleContext//addErrorNode(Token)}, and
     * {@link ParseTreeListener//visitErrorNode} is called on any parse
     * listeners.
     */
    consume() {
      const n = this.getCurrentToken();
      n.type !== f.EOF && this.getInputStream().consume();
      const o = this._parseListeners !== null && this._parseListeners.length > 0;
      if (this.buildParseTrees || o) {
        let m;
        this._errHandler.inErrorRecoveryMode(this) ? m = this._ctx.addErrorNode(n) : m = this._ctx.addTokenNode(n), m.invokingState = this.state, o && this._parseListeners.forEach(function(c) {
          m instanceof p || m.isErrorNode !== void 0 && m.isErrorNode() ? c.visitErrorNode(m) : m instanceof y && c.visitTerminal(m);
        });
      }
      return n;
    }
    addContextToParseTree() {
      this._ctx.parentCtx !== null && this._ctx.parentCtx.addChild(this._ctx);
    }
    /**
     * Always called by generated parsers upon entry to a rule. Access field
     * {@link //_ctx} get the current context.
     */
    enterRule(n, o, m) {
      this.state = o, this._ctx = n, this._ctx.start = this._input.LT(1), this.buildParseTrees && this.addContextToParseTree(), this.triggerEnterRuleEvent();
    }
    exitRule() {
      this._ctx.stop = this._input.LT(-1), this.triggerExitRuleEvent(), this.state = this._ctx.invokingState, this._ctx = this._ctx.parentCtx;
    }
    enterOuterAlt(n, o) {
      n.setAltNumber(o), this.buildParseTrees && this._ctx !== n && this._ctx.parentCtx !== null && (this._ctx.parentCtx.removeLastChild(), this._ctx.parentCtx.addChild(n)), this._ctx = n;
    }
    /**
     * Get the precedence level for the top-most precedence rule.
     *
     * @return The precedence level for the top-most precedence rule, or -1 if
     * the parser context is not nested within a precedence rule.
     */
    getPrecedence() {
      return this._precedenceStack.length === 0 ? -1 : this._precedenceStack[this._precedenceStack.length - 1];
    }
    enterRecursionRule(n, o, m, c) {
      this.state = o, this._precedenceStack.push(c), this._ctx = n, this._ctx.start = this._input.LT(1), this.triggerEnterRuleEvent();
    }
    // Like {@link //enterRule} but for recursive rules.
    pushNewRecursionContext(n, o, m) {
      const c = this._ctx;
      c.parentCtx = n, c.invokingState = o, c.stop = this._input.LT(-1), this._ctx = n, this._ctx.start = c.start, this.buildParseTrees && this._ctx.addChild(c), this.triggerEnterRuleEvent();
    }
    unrollRecursionContexts(n) {
      this._precedenceStack.pop(), this._ctx.stop = this._input.LT(-1);
      const o = this._ctx, m = this.getParseListeners();
      if (m !== null && m.length > 0)
        for (; this._ctx !== n; )
          this.triggerExitRuleEvent(), this._ctx = this._ctx.parentCtx;
      else
        this._ctx = n;
      o.parentCtx = n, this.buildParseTrees && n !== null && n.addChild(o);
    }
    getInvokingContext(n) {
      let o = this._ctx;
      for (; o !== null; ) {
        if (o.ruleIndex === n)
          return o;
        o = o.parentCtx;
      }
      return null;
    }
    precpred(n, o) {
      return o >= this._precedenceStack[this._precedenceStack.length - 1];
    }
    inContext(n) {
      return !1;
    }
    /**
     * Checks whether or not {@code symbol} can follow the current state in the
     * ATN. The behavior of this method is equivalent to the following, but is
     * implemented such that the complete context-sensitive follow set does not
     * need to be explicitly constructed.
     *
     * <pre>
     * return getExpectedTokens().contains(symbol);
     * </pre>
     *
     * @param symbol the symbol type to check
     * @return {@code true} if {@code symbol} can follow the current state in
     * the ATN, otherwise {@code false}.
     */
    isExpectedToken(n) {
      const o = this._interp.atn;
      let m = this._ctx;
      const c = o.states[this.state];
      let d = o.nextTokens(c);
      if (d.contains(n))
        return !0;
      if (!d.contains(f.EPSILON))
        return !1;
      for (; m !== null && m.invokingState >= 0 && d.contains(f.EPSILON); ) {
        const _ = o.states[m.invokingState].transitions[0];
        if (d = o.nextTokens(_.followState), d.contains(n))
          return !0;
        m = m.parentCtx;
      }
      return !!(d.contains(f.EPSILON) && n === f.EOF);
    }
    /**
     * Computes the set of input symbols which could follow the current parser
     * state and context, as given by {@link //getState} and {@link //getContext},
     * respectively.
     *
     * @see ATN//getExpectedTokens(int, RuleContext)
     */
    getExpectedTokens() {
      return this._interp.atn.getExpectedTokens(this.state, this._ctx);
    }
    getExpectedTokensWithinCurrentRule() {
      const n = this._interp.atn, o = n.states[this.state];
      return n.nextTokens(o);
    }
    // Get a rule's index (i.e., {@code RULE_ruleName} field) or -1 if not found.
    getRuleIndex(n) {
      const o = this.getRuleIndexMap()[n];
      return o !== null ? o : -1;
    }
    /**
     * Return List&lt;String&gt; of the rule names in your parser instance
     * leading up to a call to the current rule. You could override if
     * you want more details such as the file/line info of where
     * in the ATN a rule is invoked.
     *
     * this is very useful for error messages.
     */
    getRuleInvocationStack(n) {
      n = n || null, n === null && (n = this._ctx);
      const o = [];
      for (; n !== null; ) {
        const m = n.ruleIndex;
        m < 0 ? o.push("n/a") : o.push(this.ruleNames[m]), n = n.parentCtx;
      }
      return o;
    }
    // For debugging and other purposes.
    getDFAStrings() {
      return this._interp.decisionToDFA.toString();
    }
    // For debugging and other purposes.
    dumpDFA() {
      let n = !1;
      for (let o = 0; o < this._interp.decisionToDFA.length; o++) {
        const m = this._interp.decisionToDFA[o];
        m.states.length > 0 && (n && console.log(), this.printer.println("Decision " + m.decision + ":"), this.printer.print(m.toString(this.literalNames, this.symbolicNames)), n = !0);
      }
    }
    /*
    	"			printer = function() {\r\n" +
    	"				this.println = function(s) { document.getElementById('output') += s + '\\n'; }\r\n" +
    	"				this.print = function(s) { document.getElementById('output') += s; }\r\n" +
    	"			};\r\n" +
    	*/
    getSourceName() {
      return this._input.sourceName;
    }
    /**
     * During a parse is sometimes useful to listen in on the rule entry and exit
     * events as well as token matches. this is for quick and dirty debugging.
     */
    setTrace(n) {
      n ? (this._tracer !== null && this.removeParseListener(this._tracer), this._tracer = new s(this), this.addParseListener(this._tracer)) : (this.removeParseListener(this._tracer), this._tracer = null);
    }
  }
  return t.bypassAltsAtnCache = {}, qt = t, qt;
}
var Al;
function Ze() {
  if (Al) return re;
  Al = 1, re.atn = Us(), re.codepointat = $0(), re.dfa = bs(), re.fromcodepoint = K0(), re.tree = vs(), re.error = Ss(), re.Token = ue().Token, re.CommonToken = ue().CommonToken, re.InputStream = Ms(), re.CommonTokenStream = Ns(), re.Lexer = Ye(), re.Parser = Os();
  var f = Te();
  return re.PredictionContextCache = f.PredictionContextCache, re.ParserRuleContext = z0(), re.Interval = me().Interval, re.IntervalSet = me().IntervalSet, re.Utils = oe(), re.LL1Analyzer = F0().LL1Analyzer, re;
}
var Dt, Rl;
function As() {
  if (Rl) return Dt;
  Rl = 1;
  const f = Ze(), C = [
    "悋Ꜫ脳맭䅼㯧瞆",
    "奤Aȃ\b		",
    "			\x07",
    `	\x07\b	\b			
	
\v	\v`,
    "\f	\f\r	\r		",
    "				",
    "			",
    "				",
    "\x1B	\x1B		",
    '		 	 !	!"	"#',
    "	#$	$%	%&	&'	'(	()	)",
    "*	*+	+,	,-	-.	./	/0	0",
    "1	12	23	34	45	56	67	7",
    "8	89	9:	:;	;<	<=	=>	>",
    "?	?@	@A	AB	BC	CD	D",
    "",
    "\x07\x07\b",
    `\b				



`,
    "\v\v\f\f\r\r\r",
    "",
    "",
    "",
    "",
    "",
    "",
    "\x1B",
    "\x1B\x1B\x1B",
    "",
    " ",
    ' !!!!!"""',
    '"""##$$$$$',
    "$%%%%%%%&",
    "&&&&&&''((",
    "((())))))*",
    "****++++,,",
    ",,,-------",
    ".......///",
    "/////////0",
    "0000011111",
    "1122222233",
    "3334444445",
    "5555555666",
    "6666677777",
    "7777777788",
    "8888888888",
    `88ƃ
88ƅ
88Ƈ
888Ɗ`,
    `
89999:::::`,
    `::::::ƚ
:\r::ƛ`,
    `:ƞ
::Ơ
::Ƣ
::::`,
    `:::::ƫ
:;;Ʈ
;`,
    `;\x07;Ʊ
;\f;;ƴ\v;<<<\x07`,
    `<ƹ
<\f<<Ƽ\v<<<==`,
    `=\x07=ǃ
=\f==ǆ\v===>`,
    `>ǋ
>\r>>ǌ>>>Ǒ
>\r>>ǒ`,
    `>Ǖ
>??ǘ
?\r??Ǚ?`,
    `?@@@@\x07@Ǣ
@\f@@ǥ\v`,
    "@@@@@@AAAA\x07",
    `Aǰ
A\fAAǳ\vAAABB`,
    `BBǺ
BCCCCCCD`,
    "DǣE\x07	\v",
    `\x07\r\b	
\v\f\r\x1B`,
    "!#%')+",
    "-/13\x1B579;= ?!A",
    `"C#E$G%I&K'M(O)Q*S+U,W-Y.[/]0_1a2c3e4g5i6k7m8o9q:su;w<y={>}`,
    "?@A\f",
    "2;--//C\\aac|2;C\\aac|",
    '^^bb))\v\f""',
    `\f\f
))11^^bbhhppttvv2;CHchȔ`,
    "",
    "\x07	",
    "\v\r",
    "",
    "",
    "",
    "\x1B",
    "!",
    "#%",
    "')+",
    "-/",
    "13",
    "57",
    "9;",
    "=?A",
    "CE",
    "GI",
    "KM",
    "OQ",
    "SUW",
    "Y[",
    "]_",
    "ac",
    "eg",
    "ikm",
    "oq",
    "uw",
    "y{",
    "}",
    "",
    "\x07",
    "	\v",
    "\r",
    "",
    "¡",
    "£\x1B¦",
    "¨ª",
    "!­#°%³",
    "'µ)·",
    "+º-½",
    "/À1É",
    "3Í5Ð",
    "7Ô9Ü;Þ",
    "=à?â",
    "AäCé",
    "EïGñ",
    "I÷Kþ",
    "MąOćQČ",
    "SĒUė",
    "WěYĠ",
    "[ħ]Į",
    "_ĺaŀ",
    "cŇeōgŒ",
    "iŘkŠ",
    "mŨoŵ",
    "qƋsƏ",
    "uƭwƵ",
    "yƿ{Ǌ}Ǘ",
    "ǝǫ",
    "Ƕǻ",
    "ȁ",
    "\x070",
    "\x07]",
    "\x07_\b\x07",
    `-
\x07/`,
    "\f\x07,",
    "\x071",
    "\x07f",
    "\x07k\x07x",
    "\x07o",
    "\x07q\x07f",
    " \x07( ",
    "¡¢\x07~¢",
    "£¤\x07>¤¥",
    "\x07?¥¦§",
    "\x07>§¨©",
    "\x07@©ª«",
    "\x07@«¬\x07?¬ ",
    "­®\x07k®¯\x07u",
    '¯"°±\x07c',
    "±²\x07u²$³",
    "´\x07?´&µ¶",
    "\x07¶(·¸",
    "\x07#¸¹\x07?¹*",
    "º»\x07#»¼\x07",
    "¼,½¾\x07k",
    "¾¿\x07p¿.",
    "ÀÁ\x07eÁÂ\x07qÂ",
    "Ã\x07pÃÄ\x07vÄÅ",
    "\x07cÅÆ\x07kÆÇ\x07",
    "pÇÈ\x07uÈ0",
    "ÉÊ\x07cÊË\x07p",
    "ËÌ\x07fÌ2Í",
    "Î\x07qÎÏ\x07tÏ4",
    "ÐÑ\x07zÑÒ\x07",
    "qÒÓ\x07tÓ6",
    "ÔÕ\x07kÕÖ\x07o",
    "Ö×\x07r×Ø\x07nØ",
    "Ù\x07kÙÚ\x07gÚÛ",
    "\x07uÛ8ÜÝ\x07",
    "*Ý:Þß\x07+",
    "ß<àá\x07}",
    "á>âã\x07",
    "ã@äå\x07vå",
    "æ\x07tæç\x07wçè",
    "\x07gèBéê\x07",
    "hêë\x07cëì\x07n",
    "ìí\x07uíî\x07g",
    "îDïð\x07'ð",
    "Fñò\x07&òó",
    "\x07vóô\x07jôõ\x07",
    "kõö\x07uöH",
    "÷ø\x07&øù\x07k",
    "ùú\x07púû\x07fû",
    "ü\x07güý\x07zýJ",
    "þÿ\x07&ÿĀ\x07",
    "vĀā\x07qāĂ\x07v",
    "Ăă\x07căĄ\x07n",
    "ĄLąĆ\x07.Ć",
    "NćĈ\x07{Ĉĉ",
    "\x07gĉĊ\x07cĊċ\x07",
    "tċPČč\x07o",
    "čĎ\x07qĎď\x07p",
    "ďĐ\x07vĐđ\x07jđ",
    "RĒē\x07yēĔ",
    "\x07gĔĕ\x07gĕĖ\x07",
    "mĖTėĘ\x07f",
    "Ęę\x07cęĚ\x07{",
    "ĚVěĜ\x07jĜ",
    "ĝ\x07qĝĞ\x07wĞğ",
    "\x07tğXĠġ\x07",
    "oġĢ\x07kĢģ\x07p",
    "ģĤ\x07wĤĥ\x07v",
    "ĥĦ\x07gĦZħ",
    "Ĩ\x07uĨĩ\x07gĩĪ",
    "\x07eĪī\x07qīĬ\x07",
    "pĬĭ\x07fĭ\\",
    "Įį\x07oįİ\x07k",
    "İı\x07nıĲ\x07nĲ",
    "ĳ\x07kĳĴ\x07uĴĵ",
    "\x07gĵĶ\x07eĶķ\x07",
    "qķĸ\x07pĸĹ\x07f",
    "Ĺ^ĺĻ\x07{",
    "Ļļ\x07gļĽ\x07cĽ",
    "ľ\x07tľĿ\x07uĿ`",
    "ŀŁ\x07oŁł\x07",
    "qłŃ\x07pŃń\x07v",
    "ńŅ\x07jŅņ\x07u",
    "ņbŇň\x07yň",
    "ŉ\x07gŉŊ\x07gŊŋ",
    "\x07mŋŌ\x07uŌd",
    "ōŎ\x07fŎŏ\x07c",
    "ŏŐ\x07{Őő\x07u",
    "őfŒœ\x07jœ",
    "Ŕ\x07qŔŕ\x07wŕŖ",
    "\x07tŖŗ\x07uŗh",
    "Řř\x07ořŚ\x07k",
    "Śś\x07pśŜ\x07w",
    "Ŝŝ\x07vŝŞ\x07gŞ",
    "ş\x07uşjŠš",
    "\x07ušŢ\x07gŢţ\x07",
    "eţŤ\x07qŤť\x07p",
    "ťŦ\x07fŦŧ\x07u",
    "ŧlŨũ\x07oũ",
    "Ū\x07kŪū\x07nūŬ",
    "\x07nŬŭ\x07kŭŮ\x07",
    "uŮů\x07gůŰ\x07e",
    "Űű\x07qűŲ\x07p",
    "Ųų\x07fųŴ\x07uŴ",
    "nŵŶ\x07BŶŷ",
    "	ŷŸ	ŸŹ	",
    "ŹƆ	źŻ\x07/",
    "Żż	żƄ	",
    "Žž\x07/žſ	ſ",
    "Ƃ	ƀƁ\x07VƁƃ",
    "s:ƂƀƂƃ",
    "ƃƅƄŽ",
    "ƄƅƅƇ",
    "ƆźƆƇ",
    "ƇƉƈƊ\x07",
    "\\ƉƈƉƊ",
    "ƊpƋƌ\x07",
    "Bƌƍ\x07VƍƎs:",
    "ƎrƏƐ	Ɛ",
    "ơ	Ƒƒ\x07<ƒƓ",
    "	ƓƟ	Ɣƕ\x07",
    "<ƕƖ	ƖƝ	",
    "Ɨƙ\x070Ƙƚ	",
    "ƙƘƚƛ",
    "ƛƙƛƜ",
    "ƜƞƝƗ",
    "ƝƞƞƠ",
    "ƟƔƟƠ",
    "ƠƢơƑ",
    "ơƢƢƪ",
    "ƣƫ\x07\\Ƥƥ	ƥ",
    "Ʀ	ƦƧ	Ƨƨ",
    "\x07<ƨƩ	Ʃƫ	",
    "ƪƣƪƤ",
    "ƪƫƫt",
    "ƬƮ	ƭƬ",
    "ƮƲƯƱ	",
    "ưƯƱƴ",
    "ƲưƲƳ",
    "ƳvƴƲ",
    "Ƶƺ\x07bƶƹ",
    `BƷƹ
Ƹƶ`,
    "ƸƷƹƼ",
    "ƺƸƺƻ",
    "ƻƽƼƺ",
    "ƽƾ\x07bƾx",
    "ƿǄ\x07)ǀǃBǁ",
    `ǃ
\x07ǂǀǂ`,
    "ǁǃǆǄ",
    "ǂǄǅǅ",
    "ǇǆǄǇ",
    "ǈ\x07)ǈzǉǋ",
    "	Ǌǉǋǌ",
    "ǌǊǌǍ",
    "Ǎǔǎǐ",
    "\x070ǏǑ	ǐǏ",
    "Ǒǒǒǐ",
    "ǒǓǓǕ",
    "ǔǎǔǕ",
    "Ǖ|ǖǘ	\b",
    "ǗǖǘǙ",
    "ǙǗǙǚ",
    "ǚǛǛǜ\b?",
    "ǜ~ǝǞ\x071Ǟ",
    "ǟ\x07,ǟǣǠ",
    "Ǣ\vǡǠǢ",
    "ǥǣǤǣ",
    "ǡǤǦǥ",
    "ǣǦǧ\x07,ǧ",
    "Ǩ\x071Ǩǩǩ",
    "Ǫ\b@ǪǫǬ",
    "\x071Ǭǭ\x071ǭǱ",
    `Ǯǰ
	ǯǮ`,
    "ǰǳǱǯ",
    "ǱǲǲǴ",
    "ǳǱǴǵ\bA",
    "ǵǶǹ\x07^",
    `ǷǺ	
ǸǺCǹ`,
    "ǷǹǸǺ",
    "ǻǼ\x07wǼ",
    "ǽDǽǾDǾǿ",
    "DǿȀDȀ",
    "ȁȂ	\vȂ",
    "ƂƄƆƉƛƝƟ",
    "ơƪƭưƲƸƺǂǄǌǒǔ",
    "ǙǣǱǹ"
  ].join(""), y = new f.atn.ATNDeserializer().deserialize(C), p = y.decisionToState.map((r, e) => new f.dfa.DFA(r, e));
  class l extends f.Lexer {
    constructor(e) {
      super(e), this._interp = new f.atn.LexerATNSimulator(this, y, p, new f.PredictionContextCache());
    }
    get atn() {
      return y;
    }
  }
  return se(l, "grammarFileName", "FHIRPath.g4"), se(l, "channelNames", ["DEFAULT_TOKEN_CHANNEL", "HIDDEN"]), se(l, "modeNames", ["DEFAULT_MODE"]), se(l, "literalNames", [
    null,
    "'.'",
    "'['",
    "']'",
    "'+'",
    "'-'",
    "'*'",
    "'/'",
    "'div'",
    "'mod'",
    "'&'",
    "'|'",
    "'<='",
    "'<'",
    "'>'",
    "'>='",
    "'is'",
    "'as'",
    "'='",
    "'~'",
    "'!='",
    "'!~'",
    "'in'",
    "'contains'",
    "'and'",
    "'or'",
    "'xor'",
    "'implies'",
    "'('",
    "')'",
    "'{'",
    "'}'",
    "'true'",
    "'false'",
    "'%'",
    "'$this'",
    "'$index'",
    "'$total'",
    "','",
    "'year'",
    "'month'",
    "'week'",
    "'day'",
    "'hour'",
    "'minute'",
    "'second'",
    "'millisecond'",
    "'years'",
    "'months'",
    "'weeks'",
    "'days'",
    "'hours'",
    "'minutes'",
    "'seconds'",
    "'milliseconds'"
  ]), se(l, "symbolicNames", [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "DATETIME",
    "TIME",
    "IDENTIFIER",
    "DELIMITEDIDENTIFIER",
    "STRING",
    "NUMBER",
    "WS",
    "COMMENT",
    "LINE_COMMENT"
  ]), se(l, "ruleNames", [
    "T__0",
    "T__1",
    "T__2",
    "T__3",
    "T__4",
    "T__5",
    "T__6",
    "T__7",
    "T__8",
    "T__9",
    "T__10",
    "T__11",
    "T__12",
    "T__13",
    "T__14",
    "T__15",
    "T__16",
    "T__17",
    "T__18",
    "T__19",
    "T__20",
    "T__21",
    "T__22",
    "T__23",
    "T__24",
    "T__25",
    "T__26",
    "T__27",
    "T__28",
    "T__29",
    "T__30",
    "T__31",
    "T__32",
    "T__33",
    "T__34",
    "T__35",
    "T__36",
    "T__37",
    "T__38",
    "T__39",
    "T__40",
    "T__41",
    "T__42",
    "T__43",
    "T__44",
    "T__45",
    "T__46",
    "T__47",
    "T__48",
    "T__49",
    "T__50",
    "T__51",
    "T__52",
    "T__53",
    "DATETIME",
    "TIME",
    "TIMEFORMAT",
    "IDENTIFIER",
    "DELIMITEDIDENTIFIER",
    "STRING",
    "NUMBER",
    "WS",
    "COMMENT",
    "LINE_COMMENT",
    "ESC",
    "UNICODE",
    "HEX"
  ]), l.EOF = f.Token.EOF, l.T__0 = 1, l.T__1 = 2, l.T__2 = 3, l.T__3 = 4, l.T__4 = 5, l.T__5 = 6, l.T__6 = 7, l.T__7 = 8, l.T__8 = 9, l.T__9 = 10, l.T__10 = 11, l.T__11 = 12, l.T__12 = 13, l.T__13 = 14, l.T__14 = 15, l.T__15 = 16, l.T__16 = 17, l.T__17 = 18, l.T__18 = 19, l.T__19 = 20, l.T__20 = 21, l.T__21 = 22, l.T__22 = 23, l.T__23 = 24, l.T__24 = 25, l.T__25 = 26, l.T__26 = 27, l.T__27 = 28, l.T__28 = 29, l.T__29 = 30, l.T__30 = 31, l.T__31 = 32, l.T__32 = 33, l.T__33 = 34, l.T__34 = 35, l.T__35 = 36, l.T__36 = 37, l.T__37 = 38, l.T__38 = 39, l.T__39 = 40, l.T__40 = 41, l.T__41 = 42, l.T__42 = 43, l.T__43 = 44, l.T__44 = 45, l.T__45 = 46, l.T__46 = 47, l.T__47 = 48, l.T__48 = 49, l.T__49 = 50, l.T__50 = 51, l.T__51 = 52, l.T__52 = 53, l.T__53 = 54, l.DATETIME = 55, l.TIME = 56, l.IDENTIFIER = 57, l.DELIMITEDIDENTIFIER = 58, l.STRING = 59, l.NUMBER = 60, l.WS = 61, l.COMMENT = 62, l.LINE_COMMENT = 63, Dt = l, Dt;
}
var Bt, wl;
function j0() {
  if (wl) return Bt;
  wl = 1;
  const f = Ze();
  class C extends f.tree.ParseTreeListener {
    // Enter a parse tree produced by FHIRPathParser#entireExpression.
    enterEntireExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#entireExpression.
    exitEntireExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#indexerExpression.
    enterIndexerExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#indexerExpression.
    exitIndexerExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#polarityExpression.
    enterPolarityExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#polarityExpression.
    exitPolarityExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#additiveExpression.
    enterAdditiveExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#additiveExpression.
    exitAdditiveExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#multiplicativeExpression.
    enterMultiplicativeExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#multiplicativeExpression.
    exitMultiplicativeExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#unionExpression.
    enterUnionExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#unionExpression.
    exitUnionExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#orExpression.
    enterOrExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#orExpression.
    exitOrExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#andExpression.
    enterAndExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#andExpression.
    exitAndExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#membershipExpression.
    enterMembershipExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#membershipExpression.
    exitMembershipExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#inequalityExpression.
    enterInequalityExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#inequalityExpression.
    exitInequalityExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#invocationExpression.
    enterInvocationExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#invocationExpression.
    exitInvocationExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#equalityExpression.
    enterEqualityExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#equalityExpression.
    exitEqualityExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#impliesExpression.
    enterImpliesExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#impliesExpression.
    exitImpliesExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#termExpression.
    enterTermExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#termExpression.
    exitTermExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#typeExpression.
    enterTypeExpression(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#typeExpression.
    exitTypeExpression(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#invocationTerm.
    enterInvocationTerm(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#invocationTerm.
    exitInvocationTerm(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#literalTerm.
    enterLiteralTerm(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#literalTerm.
    exitLiteralTerm(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#externalConstantTerm.
    enterExternalConstantTerm(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#externalConstantTerm.
    exitExternalConstantTerm(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#parenthesizedTerm.
    enterParenthesizedTerm(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#parenthesizedTerm.
    exitParenthesizedTerm(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#nullLiteral.
    enterNullLiteral(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#nullLiteral.
    exitNullLiteral(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#booleanLiteral.
    enterBooleanLiteral(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#booleanLiteral.
    exitBooleanLiteral(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#stringLiteral.
    enterStringLiteral(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#stringLiteral.
    exitStringLiteral(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#numberLiteral.
    enterNumberLiteral(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#numberLiteral.
    exitNumberLiteral(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#dateTimeLiteral.
    enterDateTimeLiteral(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#dateTimeLiteral.
    exitDateTimeLiteral(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#timeLiteral.
    enterTimeLiteral(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#timeLiteral.
    exitTimeLiteral(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#quantityLiteral.
    enterQuantityLiteral(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#quantityLiteral.
    exitQuantityLiteral(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#externalConstant.
    enterExternalConstant(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#externalConstant.
    exitExternalConstant(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#memberInvocation.
    enterMemberInvocation(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#memberInvocation.
    exitMemberInvocation(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#functionInvocation.
    enterFunctionInvocation(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#functionInvocation.
    exitFunctionInvocation(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#thisInvocation.
    enterThisInvocation(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#thisInvocation.
    exitThisInvocation(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#indexInvocation.
    enterIndexInvocation(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#indexInvocation.
    exitIndexInvocation(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#totalInvocation.
    enterTotalInvocation(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#totalInvocation.
    exitTotalInvocation(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#functn.
    enterFunctn(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#functn.
    exitFunctn(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#paramList.
    enterParamList(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#paramList.
    exitParamList(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#quantity.
    enterQuantity(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#quantity.
    exitQuantity(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#unit.
    enterUnit(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#unit.
    exitUnit(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#dateTimePrecision.
    enterDateTimePrecision(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#dateTimePrecision.
    exitDateTimePrecision(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#pluralDateTimePrecision.
    enterPluralDateTimePrecision(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#pluralDateTimePrecision.
    exitPluralDateTimePrecision(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#typeSpecifier.
    enterTypeSpecifier(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#typeSpecifier.
    exitTypeSpecifier(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#qualifiedIdentifier.
    enterQualifiedIdentifier(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#qualifiedIdentifier.
    exitQualifiedIdentifier(p) {
    }
    // Enter a parse tree produced by FHIRPathParser#identifier.
    enterIdentifier(p) {
    }
    // Exit a parse tree produced by FHIRPathParser#identifier.
    exitIdentifier(p) {
    }
  }
  return Bt = C, Bt;
}
var Ht, kl;
function Rs() {
  if (kl) return Ht;
  kl = 1;
  const f = Ze(), C = j0(), y = [
    "悋Ꜫ脳맭䅼㯧瞆",
    "奤A		",
    "			\x07	\x07",
    `\b	\b			
	
\v	\v\f	\f`,
    "\r	\r			",
    "",
    `(
`,
    "",
    "",
    "",
    "",
    "",
    "\x07",
    `P
\fS\v`,
    "\\",
    `
`,
    `f
`,
    `k
\x07\x07`,
    `\x07\x07\x07\x07r
\x07\b`,
    `\b\b\bw
\b\b\b			\x07`,
    `	~
	\f		\v	




`,
    `\v\v\v\v
\v`,
    "\f\f\r\r",
    `\x07
\f`,
    "\v",
    `\b
\f`,
    "\x07\b\v",
    "\x07\f\f",
    "\x1B",
    '"#)018',
    ";<­ '",
    "[\be",
    `
g\fqs`,
    "z",
    "",
    "",
    "",
    ' !!"\x07',
    '"#$\b$(',
    "%&	&(\r'#",
    "'%(Q",
    ")*\f\f*+	+P\r,-\f\v",
    `-.	.P\f/0\f
`,
    "01\x07\r1P\v23\f	",
    `34	4P
56\f\x076`,
    "7	7P\b89\f9:",
    "	\x07:P\x07;<\f",
    "<=\x07=P>?\f",
    "?@	\b@PAB\f",
    "BC\x07CPDE\f",
    "EF\x07FP\f\x07GH\f",
    "HI\x07IJJK\x07",
    "KPLM\f\bMN		",
    "NPO)O,",
    "O/O2O5",
    "O8O;",
    "O>OAOD",
    "OGOLPS",
    "QOQRR",
    "SQT\\\f\x07",
    `U\\\bV\\
WX\x07`,
    "XYYZ\x07Z\\",
    "[T[U",
    "[V[W\\\x07",
    `]^\x07 ^f\x07!_f	
`,
    "`f\x07=af\x07>bf\x079cf\x07",
    `:df
e]e_`,
    "e`ea",
    "ebeced",
    "f	gj\x07$hk",
    "ik\x07=jhji",
    "k\vlr",
    "mr\bnr\x07%or\x07&",
    "pr\x07'qlqm",
    "qnqoqp",
    "r\rsttv",
    "\x07uw	vu",
    "vwwxxy\x07",
    "yz",
    "{|\x07(|~}{",
    "~}",
    "",
    "\x07>",
    "\v",
    "",
    "\f\r",
    "\x07=",
    "",
    "	\v",
    "	\f",
    "\x1B",
    "",
    "\x07",
    "",
    "",
    "",
    "	\r'OQ[ejqv",
    ""
  ].join(""), p = new f.atn.ATNDeserializer().deserialize(y), l = p.decisionToState.map((V, g) => new f.dfa.DFA(V, g)), r = new f.PredictionContextCache(), x = class x extends f.Parser {
    constructor(g) {
      super(g), this._interp = new f.atn.ParserATNSimulator(this, p, l, r), this.ruleNames = x.ruleNames, this.literalNames = x.literalNames, this.symbolicNames = x.symbolicNames;
    }
    get atn() {
      return p;
    }
    sempred(g, L, O) {
      switch (L) {
        case 1:
          return this.expression_sempred(g, O);
        default:
          throw "No predicate with index:" + L;
      }
    }
    expression_sempred(g, L) {
      switch (L) {
        case 0:
          return this.precpred(this._ctx, 10);
        case 1:
          return this.precpred(this._ctx, 9);
        case 2:
          return this.precpred(this._ctx, 8);
        case 3:
          return this.precpred(this._ctx, 7);
        case 4:
          return this.precpred(this._ctx, 5);
        case 5:
          return this.precpred(this._ctx, 4);
        case 6:
          return this.precpred(this._ctx, 3);
        case 7:
          return this.precpred(this._ctx, 2);
        case 8:
          return this.precpred(this._ctx, 1);
        case 9:
          return this.precpred(this._ctx, 13);
        case 10:
          return this.precpred(this._ctx, 12);
        case 11:
          return this.precpred(this._ctx, 6);
        default:
          throw "No predicate with index:" + L;
      }
    }
    entireExpression() {
      let g = new a(this, this._ctx, this.state);
      this.enterRule(g, 0, x.RULE_entireExpression);
      try {
        this.enterOuterAlt(g, 1), this.state = 30, this.expression(0), this.state = 31, this.match(x.EOF);
      } catch (L) {
        if (L instanceof f.error.RecognitionException)
          g.exception = L, this._errHandler.reportError(this, L), this._errHandler.recover(this, L);
        else
          throw L;
      } finally {
        this.exitRule();
      }
      return g;
    }
    expression(g) {
      g === void 0 && (g = 0);
      const L = this._ctx, O = this.state;
      let Z = new u(this, this._ctx, O), te = Z;
      const ie = 2;
      this.enterRecursionRule(Z, 2, x.RULE_expression, g);
      var ne = 0;
      try {
        switch (this.enterOuterAlt(Z, 1), this.state = 37, this._errHandler.sync(this), this._input.LA(1)) {
          case x.T__15:
          case x.T__16:
          case x.T__21:
          case x.T__22:
          case x.T__27:
          case x.T__29:
          case x.T__31:
          case x.T__32:
          case x.T__33:
          case x.T__34:
          case x.T__35:
          case x.T__36:
          case x.DATETIME:
          case x.TIME:
          case x.IDENTIFIER:
          case x.DELIMITEDIDENTIFIER:
          case x.STRING:
          case x.NUMBER:
            Z = new P(this, Z), this._ctx = Z, te = Z, this.state = 34, this.term();
            break;
          case x.T__3:
          case x.T__4:
            Z = new t(this, Z), this._ctx = Z, te = Z, this.state = 35, ne = this._input.LA(1), ne === x.T__3 || ne === x.T__4 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 36, this.expression(11);
            break;
          default:
            throw new f.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1), this.state = 79, this._errHandler.sync(this);
        for (var fe = this._interp.adaptivePredict(this._input, 2, this._ctx); fe != 2 && fe != f.atn.ATN.INVALID_ALT_NUMBER; ) {
          if (fe === 1) {
            this._parseListeners !== null && this.triggerExitRuleEvent(), te = Z, this.state = 77, this._errHandler.sync(this);
            var de = this._interp.adaptivePredict(this._input, 1, this._ctx);
            switch (de) {
              case 1:
                if (Z = new n(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 39, !this.precpred(this._ctx, 10))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 10)");
                this.state = 40, ne = this._input.LA(1), (ne & -32) == 0 && (1 << ne & (1 << x.T__5 | 1 << x.T__6 | 1 << x.T__7 | 1 << x.T__8)) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 41, this.expression(11);
                break;
              case 2:
                if (Z = new i(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 42, !this.precpred(this._ctx, 9))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 9)");
                this.state = 43, ne = this._input.LA(1), (ne & -32) == 0 && (1 << ne & (1 << x.T__3 | 1 << x.T__4 | 1 << x.T__9)) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 44, this.expression(10);
                break;
              case 3:
                if (Z = new o(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 45, !this.precpred(this._ctx, 8))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 8)");
                this.state = 46, this.match(x.T__10), this.state = 47, this.expression(9);
                break;
              case 4:
                if (Z = new h(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 48, !this.precpred(this._ctx, 7))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 7)");
                this.state = 49, ne = this._input.LA(1), (ne & -32) == 0 && (1 << ne & (1 << x.T__11 | 1 << x.T__12 | 1 << x.T__13 | 1 << x.T__14)) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 50, this.expression(8);
                break;
              case 5:
                if (Z = new T(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 51, !this.precpred(this._ctx, 5))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                this.state = 52, ne = this._input.LA(1), (ne & -32) == 0 && (1 << ne & (1 << x.T__17 | 1 << x.T__18 | 1 << x.T__19 | 1 << x.T__20)) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 53, this.expression(6);
                break;
              case 6:
                if (Z = new d(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 54, !this.precpred(this._ctx, 4))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                this.state = 55, ne = this._input.LA(1), ne === x.T__21 || ne === x.T__22 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 56, this.expression(5);
                break;
              case 7:
                if (Z = new c(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 57, !this.precpred(this._ctx, 3))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 3)");
                this.state = 58, this.match(x.T__23), this.state = 59, this.expression(4);
                break;
              case 8:
                if (Z = new m(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 60, !this.precpred(this._ctx, 2))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 2)");
                this.state = 61, ne = this._input.LA(1), ne === x.T__24 || ne === x.T__25 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 62, this.expression(3);
                break;
              case 9:
                if (Z = new M(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 63, !this.precpred(this._ctx, 1))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 1)");
                this.state = 64, this.match(x.T__26), this.state = 65, this.expression(2);
                break;
              case 10:
                if (Z = new _(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 66, !this.precpred(this._ctx, 13))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 13)");
                this.state = 67, this.match(x.T__0), this.state = 68, this.invocation();
                break;
              case 11:
                if (Z = new s(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 69, !this.precpred(this._ctx, 12))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 12)");
                this.state = 70, this.match(x.T__1), this.state = 71, this.expression(0), this.state = 72, this.match(x.T__2);
                break;
              case 12:
                if (Z = new q(this, new u(this, L, O)), this.pushNewRecursionContext(Z, ie, x.RULE_expression), this.state = 74, !this.precpred(this._ctx, 6))
                  throw new f.error.FailedPredicateException(this, "this.precpred(this._ctx, 6)");
                this.state = 75, ne = this._input.LA(1), ne === x.T__15 || ne === x.T__16 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this), this.state = 76, this.typeSpecifier();
                break;
            }
          }
          this.state = 81, this._errHandler.sync(this), fe = this._interp.adaptivePredict(this._input, 2, this._ctx);
        }
      } catch (pe) {
        if (pe instanceof f.error.RecognitionException)
          Z.exception = pe, this._errHandler.reportError(this, pe), this._errHandler.recover(this, pe);
        else
          throw pe;
      } finally {
        this.unrollRecursionContexts(L);
      }
      return Z;
    }
    term() {
      let g = new z(this, this._ctx, this.state);
      this.enterRule(g, 4, x.RULE_term);
      try {
        switch (this.state = 89, this._errHandler.sync(this), this._input.LA(1)) {
          case x.T__15:
          case x.T__16:
          case x.T__21:
          case x.T__22:
          case x.T__34:
          case x.T__35:
          case x.T__36:
          case x.IDENTIFIER:
          case x.DELIMITEDIDENTIFIER:
            g = new v(this, g), this.enterOuterAlt(g, 1), this.state = 82, this.invocation();
            break;
          case x.T__29:
          case x.T__31:
          case x.T__32:
          case x.DATETIME:
          case x.TIME:
          case x.STRING:
          case x.NUMBER:
            g = new Y(this, g), this.enterOuterAlt(g, 2), this.state = 83, this.literal();
            break;
          case x.T__33:
            g = new W(this, g), this.enterOuterAlt(g, 3), this.state = 84, this.externalConstant();
            break;
          case x.T__27:
            g = new w(this, g), this.enterOuterAlt(g, 4), this.state = 85, this.match(x.T__27), this.state = 86, this.expression(0), this.state = 87, this.match(x.T__28);
            break;
          default:
            throw new f.error.NoViableAltException(this);
        }
      } catch (L) {
        if (L instanceof f.error.RecognitionException)
          g.exception = L, this._errHandler.reportError(this, L), this._errHandler.recover(this, L);
        else
          throw L;
      } finally {
        this.exitRule();
      }
      return g;
    }
    literal() {
      let g = new U(this, this._ctx, this.state);
      this.enterRule(g, 6, x.RULE_literal);
      var L = 0;
      try {
        this.state = 99, this._errHandler.sync(this);
        var O = this._interp.adaptivePredict(this._input, 4, this._ctx);
        switch (O) {
          case 1:
            g = new S(this, g), this.enterOuterAlt(g, 1), this.state = 91, this.match(x.T__29), this.state = 92, this.match(x.T__30);
            break;
          case 2:
            g = new N(this, g), this.enterOuterAlt(g, 2), this.state = 93, L = this._input.LA(1), L === x.T__31 || L === x.T__32 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this);
            break;
          case 3:
            g = new E(this, g), this.enterOuterAlt(g, 3), this.state = 94, this.match(x.STRING);
            break;
          case 4:
            g = new F(this, g), this.enterOuterAlt(g, 4), this.state = 95, this.match(x.NUMBER);
            break;
          case 5:
            g = new b(this, g), this.enterOuterAlt(g, 5), this.state = 96, this.match(x.DATETIME);
            break;
          case 6:
            g = new I(this, g), this.enterOuterAlt(g, 6), this.state = 97, this.match(x.TIME);
            break;
          case 7:
            g = new j(this, g), this.enterOuterAlt(g, 7), this.state = 98, this.quantity();
            break;
        }
      } catch (Z) {
        if (Z instanceof f.error.RecognitionException)
          g.exception = Z, this._errHandler.reportError(this, Z), this._errHandler.recover(this, Z);
        else
          throw Z;
      } finally {
        this.exitRule();
      }
      return g;
    }
    externalConstant() {
      let g = new $(this, this._ctx, this.state);
      this.enterRule(g, 8, x.RULE_externalConstant);
      try {
        switch (this.enterOuterAlt(g, 1), this.state = 101, this.match(x.T__33), this.state = 104, this._errHandler.sync(this), this._input.LA(1)) {
          case x.T__15:
          case x.T__16:
          case x.T__21:
          case x.T__22:
          case x.IDENTIFIER:
          case x.DELIMITEDIDENTIFIER:
            this.state = 102, this.identifier();
            break;
          case x.STRING:
            this.state = 103, this.match(x.STRING);
            break;
          default:
            throw new f.error.NoViableAltException(this);
        }
      } catch (L) {
        if (L instanceof f.error.RecognitionException)
          g.exception = L, this._errHandler.reportError(this, L), this._errHandler.recover(this, L);
        else
          throw L;
      } finally {
        this.exitRule();
      }
      return g;
    }
    invocation() {
      let g = new Q(this, this._ctx, this.state);
      this.enterRule(g, 10, x.RULE_invocation);
      try {
        this.state = 111, this._errHandler.sync(this);
        var L = this._interp.adaptivePredict(this._input, 6, this._ctx);
        switch (L) {
          case 1:
            g = new ce(this, g), this.enterOuterAlt(g, 1), this.state = 106, this.identifier();
            break;
          case 2:
            g = new ae(this, g), this.enterOuterAlt(g, 2), this.state = 107, this.functn();
            break;
          case 3:
            g = new ee(this, g), this.enterOuterAlt(g, 3), this.state = 108, this.match(x.T__34);
            break;
          case 4:
            g = new le(this, g), this.enterOuterAlt(g, 4), this.state = 109, this.match(x.T__35);
            break;
          case 5:
            g = new X(this, g), this.enterOuterAlt(g, 5), this.state = 110, this.match(x.T__36);
            break;
        }
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
    functn() {
      let g = new k(this, this._ctx, this.state);
      this.enterRule(g, 12, x.RULE_functn);
      var L = 0;
      try {
        this.enterOuterAlt(g, 1), this.state = 113, this.identifier(), this.state = 114, this.match(x.T__27), this.state = 116, this._errHandler.sync(this), L = this._input.LA(1), ((L & -32) == 0 && (1 << L & (1 << x.T__3 | 1 << x.T__4 | 1 << x.T__15 | 1 << x.T__16 | 1 << x.T__21 | 1 << x.T__22 | 1 << x.T__27 | 1 << x.T__29)) !== 0 || (L - 32 & -32) == 0 && (1 << L - 32 & (1 << x.T__31 - 32 | 1 << x.T__32 - 32 | 1 << x.T__33 - 32 | 1 << x.T__34 - 32 | 1 << x.T__35 - 32 | 1 << x.T__36 - 32 | 1 << x.DATETIME - 32 | 1 << x.TIME - 32 | 1 << x.IDENTIFIER - 32 | 1 << x.DELIMITEDIDENTIFIER - 32 | 1 << x.STRING - 32 | 1 << x.NUMBER - 32)) !== 0) && (this.state = 115, this.paramList()), this.state = 118, this.match(x.T__28);
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
    paramList() {
      let g = new G(this, this._ctx, this.state);
      this.enterRule(g, 14, x.RULE_paramList);
      var L = 0;
      try {
        for (this.enterOuterAlt(g, 1), this.state = 120, this.expression(0), this.state = 125, this._errHandler.sync(this), L = this._input.LA(1); L === x.T__37; )
          this.state = 121, this.match(x.T__37), this.state = 122, this.expression(0), this.state = 127, this._errHandler.sync(this), L = this._input.LA(1);
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
    quantity() {
      let g = new D(this, this._ctx, this.state);
      this.enterRule(g, 16, x.RULE_quantity);
      try {
        this.enterOuterAlt(g, 1), this.state = 128, this.match(x.NUMBER), this.state = 130, this._errHandler.sync(this);
        var L = this._interp.adaptivePredict(this._input, 9, this._ctx);
        L === 1 && (this.state = 129, this.unit());
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
    unit() {
      let g = new B(this, this._ctx, this.state);
      this.enterRule(g, 18, x.RULE_unit);
      try {
        switch (this.state = 135, this._errHandler.sync(this), this._input.LA(1)) {
          case x.T__38:
          case x.T__39:
          case x.T__40:
          case x.T__41:
          case x.T__42:
          case x.T__43:
          case x.T__44:
          case x.T__45:
            this.enterOuterAlt(g, 1), this.state = 132, this.dateTimePrecision();
            break;
          case x.T__46:
          case x.T__47:
          case x.T__48:
          case x.T__49:
          case x.T__50:
          case x.T__51:
          case x.T__52:
          case x.T__53:
            this.enterOuterAlt(g, 2), this.state = 133, this.pluralDateTimePrecision();
            break;
          case x.STRING:
            this.enterOuterAlt(g, 3), this.state = 134, this.match(x.STRING);
            break;
          default:
            throw new f.error.NoViableAltException(this);
        }
      } catch (L) {
        if (L instanceof f.error.RecognitionException)
          g.exception = L, this._errHandler.reportError(this, L), this._errHandler.recover(this, L);
        else
          throw L;
      } finally {
        this.exitRule();
      }
      return g;
    }
    dateTimePrecision() {
      let g = new K(this, this._ctx, this.state);
      this.enterRule(g, 20, x.RULE_dateTimePrecision);
      var L = 0;
      try {
        this.enterOuterAlt(g, 1), this.state = 137, L = this._input.LA(1), (L - 39 & -32) == 0 && (1 << L - 39 & (1 << x.T__38 - 39 | 1 << x.T__39 - 39 | 1 << x.T__40 - 39 | 1 << x.T__41 - 39 | 1 << x.T__42 - 39 | 1 << x.T__43 - 39 | 1 << x.T__44 - 39 | 1 << x.T__45 - 39)) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this);
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
    pluralDateTimePrecision() {
      let g = new H(this, this._ctx, this.state);
      this.enterRule(g, 22, x.RULE_pluralDateTimePrecision);
      var L = 0;
      try {
        this.enterOuterAlt(g, 1), this.state = 139, L = this._input.LA(1), (L - 47 & -32) == 0 && (1 << L - 47 & (1 << x.T__46 - 47 | 1 << x.T__47 - 47 | 1 << x.T__48 - 47 | 1 << x.T__49 - 47 | 1 << x.T__50 - 47 | 1 << x.T__51 - 47 | 1 << x.T__52 - 47 | 1 << x.T__53 - 47)) !== 0 ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this);
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
    typeSpecifier() {
      let g = new J(this, this._ctx, this.state);
      this.enterRule(g, 24, x.RULE_typeSpecifier);
      try {
        this.enterOuterAlt(g, 1), this.state = 141, this.qualifiedIdentifier();
      } catch (L) {
        if (L instanceof f.error.RecognitionException)
          g.exception = L, this._errHandler.reportError(this, L), this._errHandler.recover(this, L);
        else
          throw L;
      } finally {
        this.exitRule();
      }
      return g;
    }
    qualifiedIdentifier() {
      let g = new A(this, this._ctx, this.state);
      this.enterRule(g, 26, x.RULE_qualifiedIdentifier);
      try {
        this.enterOuterAlt(g, 1), this.state = 143, this.identifier(), this.state = 148, this._errHandler.sync(this);
        for (var L = this._interp.adaptivePredict(this._input, 11, this._ctx); L != 2 && L != f.atn.ATN.INVALID_ALT_NUMBER; )
          L === 1 && (this.state = 144, this.match(x.T__0), this.state = 145, this.identifier()), this.state = 150, this._errHandler.sync(this), L = this._interp.adaptivePredict(this._input, 11, this._ctx);
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
    identifier() {
      let g = new R(this, this._ctx, this.state);
      this.enterRule(g, 28, x.RULE_identifier);
      var L = 0;
      try {
        this.enterOuterAlt(g, 1), this.state = 151, L = this._input.LA(1), (L & -32) == 0 && (1 << L & (1 << x.T__15 | 1 << x.T__16 | 1 << x.T__21 | 1 << x.T__22)) !== 0 || L === x.IDENTIFIER || L === x.DELIMITEDIDENTIFIER ? (this._errHandler.reportMatch(this), this.consume()) : this._errHandler.recoverInline(this);
      } catch (O) {
        if (O instanceof f.error.RecognitionException)
          g.exception = O, this._errHandler.reportError(this, O), this._errHandler.recover(this, O);
        else
          throw O;
      } finally {
        this.exitRule();
      }
      return g;
    }
  };
  se(x, "grammarFileName", "FHIRPath.g4"), se(x, "literalNames", [
    null,
    "'.'",
    "'['",
    "']'",
    "'+'",
    "'-'",
    "'*'",
    "'/'",
    "'div'",
    "'mod'",
    "'&'",
    "'|'",
    "'<='",
    "'<'",
    "'>'",
    "'>='",
    "'is'",
    "'as'",
    "'='",
    "'~'",
    "'!='",
    "'!~'",
    "'in'",
    "'contains'",
    "'and'",
    "'or'",
    "'xor'",
    "'implies'",
    "'('",
    "')'",
    "'{'",
    "'}'",
    "'true'",
    "'false'",
    "'%'",
    "'$this'",
    "'$index'",
    "'$total'",
    "','",
    "'year'",
    "'month'",
    "'week'",
    "'day'",
    "'hour'",
    "'minute'",
    "'second'",
    "'millisecond'",
    "'years'",
    "'months'",
    "'weeks'",
    "'days'",
    "'hours'",
    "'minutes'",
    "'seconds'",
    "'milliseconds'"
  ]), se(x, "symbolicNames", [
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    null,
    "DATETIME",
    "TIME",
    "IDENTIFIER",
    "DELIMITEDIDENTIFIER",
    "STRING",
    "NUMBER",
    "WS",
    "COMMENT",
    "LINE_COMMENT"
  ]), se(x, "ruleNames", [
    "entireExpression",
    "expression",
    "term",
    "literal",
    "externalConstant",
    "invocation",
    "functn",
    "paramList",
    "quantity",
    "unit",
    "dateTimePrecision",
    "pluralDateTimePrecision",
    "typeSpecifier",
    "qualifiedIdentifier",
    "identifier"
  ]);
  let e = x;
  e.EOF = f.Token.EOF, e.T__0 = 1, e.T__1 = 2, e.T__2 = 3, e.T__3 = 4, e.T__4 = 5, e.T__5 = 6, e.T__6 = 7, e.T__7 = 8, e.T__8 = 9, e.T__9 = 10, e.T__10 = 11, e.T__11 = 12, e.T__12 = 13, e.T__13 = 14, e.T__14 = 15, e.T__15 = 16, e.T__16 = 17, e.T__17 = 18, e.T__18 = 19, e.T__19 = 20, e.T__20 = 21, e.T__21 = 22, e.T__22 = 23, e.T__23 = 24, e.T__24 = 25, e.T__25 = 26, e.T__26 = 27, e.T__27 = 28, e.T__28 = 29, e.T__29 = 30, e.T__30 = 31, e.T__31 = 32, e.T__32 = 33, e.T__33 = 34, e.T__34 = 35, e.T__35 = 36, e.T__36 = 37, e.T__37 = 38, e.T__38 = 39, e.T__39 = 40, e.T__40 = 41, e.T__41 = 42, e.T__42 = 43, e.T__43 = 44, e.T__44 = 45, e.T__45 = 46, e.T__46 = 47, e.T__47 = 48, e.T__48 = 49, e.T__49 = 50, e.T__50 = 51, e.T__51 = 52, e.T__52 = 53, e.T__53 = 54, e.DATETIME = 55, e.TIME = 56, e.IDENTIFIER = 57, e.DELIMITEDIDENTIFIER = 58, e.STRING = 59, e.NUMBER = 60, e.WS = 61, e.COMMENT = 62, e.LINE_COMMENT = 63, e.RULE_entireExpression = 0, e.RULE_expression = 1, e.RULE_term = 2, e.RULE_literal = 3, e.RULE_externalConstant = 4, e.RULE_invocation = 5, e.RULE_functn = 6, e.RULE_paramList = 7, e.RULE_quantity = 8, e.RULE_unit = 9, e.RULE_dateTimePrecision = 10, e.RULE_pluralDateTimePrecision = 11, e.RULE_typeSpecifier = 12, e.RULE_qualifiedIdentifier = 13, e.RULE_identifier = 14;
  class a extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_entireExpression;
    }
    expression() {
      return this.getTypedRuleContext(u, 0);
    }
    EOF() {
      return this.getToken(e.EOF, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterEntireExpression(this);
    }
    exitRule(g) {
      g instanceof C && g.exitEntireExpression(this);
    }
  }
  class u extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_expression;
    }
    copyFrom(g) {
      super.copyFrom(g);
    }
  }
  class s extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterIndexerExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitIndexerExpression(this);
    }
  }
  e.IndexerExpressionContext = s;
  class t extends u {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    expression() {
      return this.getTypedRuleContext(u, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterPolarityExpression(this);
    }
    exitRule(g) {
      g instanceof C && g.exitPolarityExpression(this);
    }
  }
  e.PolarityExpressionContext = t;
  class i extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterAdditiveExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitAdditiveExpression(this);
    }
  }
  e.AdditiveExpressionContext = i;
  class n extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterMultiplicativeExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitMultiplicativeExpression(this);
    }
  }
  e.MultiplicativeExpressionContext = n;
  class o extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterUnionExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitUnionExpression(this);
    }
  }
  e.UnionExpressionContext = o;
  class m extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterOrExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitOrExpression(this);
    }
  }
  e.OrExpressionContext = m;
  class c extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterAndExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitAndExpression(this);
    }
  }
  e.AndExpressionContext = c;
  class d extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterMembershipExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitMembershipExpression(this);
    }
  }
  e.MembershipExpressionContext = d;
  class h extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterInequalityExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitInequalityExpression(this);
    }
  }
  e.InequalityExpressionContext = h;
  class _ extends u {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    expression() {
      return this.getTypedRuleContext(u, 0);
    }
    invocation() {
      return this.getTypedRuleContext(Q, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterInvocationExpression(this);
    }
    exitRule(g) {
      g instanceof C && g.exitInvocationExpression(this);
    }
  }
  e.InvocationExpressionContext = _;
  class T extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterEqualityExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitEqualityExpression(this);
    }
  }
  e.EqualityExpressionContext = T;
  class M extends u {
    constructor(L, O) {
      super(L);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      super.copyFrom(O);
    }
    enterRule(L) {
      L instanceof C && L.enterImpliesExpression(this);
    }
    exitRule(L) {
      L instanceof C && L.exitImpliesExpression(this);
    }
  }
  e.ImpliesExpressionContext = M;
  class P extends u {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    term() {
      return this.getTypedRuleContext(z, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterTermExpression(this);
    }
    exitRule(g) {
      g instanceof C && g.exitTermExpression(this);
    }
  }
  e.TermExpressionContext = P;
  class q extends u {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    expression() {
      return this.getTypedRuleContext(u, 0);
    }
    typeSpecifier() {
      return this.getTypedRuleContext(J, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterTypeExpression(this);
    }
    exitRule(g) {
      g instanceof C && g.exitTypeExpression(this);
    }
  }
  e.TypeExpressionContext = q;
  class z extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_term;
    }
    copyFrom(g) {
      super.copyFrom(g);
    }
  }
  class W extends z {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    externalConstant() {
      return this.getTypedRuleContext($, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterExternalConstantTerm(this);
    }
    exitRule(g) {
      g instanceof C && g.exitExternalConstantTerm(this);
    }
  }
  e.ExternalConstantTermContext = W;
  class Y extends z {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    literal() {
      return this.getTypedRuleContext(U, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterLiteralTerm(this);
    }
    exitRule(g) {
      g instanceof C && g.exitLiteralTerm(this);
    }
  }
  e.LiteralTermContext = Y;
  class w extends z {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    expression() {
      return this.getTypedRuleContext(u, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterParenthesizedTerm(this);
    }
    exitRule(g) {
      g instanceof C && g.exitParenthesizedTerm(this);
    }
  }
  e.ParenthesizedTermContext = w;
  class v extends z {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    invocation() {
      return this.getTypedRuleContext(Q, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterInvocationTerm(this);
    }
    exitRule(g) {
      g instanceof C && g.exitInvocationTerm(this);
    }
  }
  e.InvocationTermContext = v;
  class U extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_literal;
    }
    copyFrom(g) {
      super.copyFrom(g);
    }
  }
  class I extends U {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    TIME() {
      return this.getToken(e.TIME, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterTimeLiteral(this);
    }
    exitRule(g) {
      g instanceof C && g.exitTimeLiteral(this);
    }
  }
  e.TimeLiteralContext = I;
  class S extends U {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    enterRule(g) {
      g instanceof C && g.enterNullLiteral(this);
    }
    exitRule(g) {
      g instanceof C && g.exitNullLiteral(this);
    }
  }
  e.NullLiteralContext = S;
  class b extends U {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    DATETIME() {
      return this.getToken(e.DATETIME, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterDateTimeLiteral(this);
    }
    exitRule(g) {
      g instanceof C && g.exitDateTimeLiteral(this);
    }
  }
  e.DateTimeLiteralContext = b;
  class E extends U {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    STRING() {
      return this.getToken(e.STRING, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterStringLiteral(this);
    }
    exitRule(g) {
      g instanceof C && g.exitStringLiteral(this);
    }
  }
  e.StringLiteralContext = E;
  class N extends U {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    enterRule(g) {
      g instanceof C && g.enterBooleanLiteral(this);
    }
    exitRule(g) {
      g instanceof C && g.exitBooleanLiteral(this);
    }
  }
  e.BooleanLiteralContext = N;
  class F extends U {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    NUMBER() {
      return this.getToken(e.NUMBER, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterNumberLiteral(this);
    }
    exitRule(g) {
      g instanceof C && g.exitNumberLiteral(this);
    }
  }
  e.NumberLiteralContext = F;
  class j extends U {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    quantity() {
      return this.getTypedRuleContext(D, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterQuantityLiteral(this);
    }
    exitRule(g) {
      g instanceof C && g.exitQuantityLiteral(this);
    }
  }
  e.QuantityLiteralContext = j;
  class $ extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_externalConstant;
    }
    identifier() {
      return this.getTypedRuleContext(R, 0);
    }
    STRING() {
      return this.getToken(e.STRING, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterExternalConstant(this);
    }
    exitRule(g) {
      g instanceof C && g.exitExternalConstant(this);
    }
  }
  class Q extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_invocation;
    }
    copyFrom(g) {
      super.copyFrom(g);
    }
  }
  class X extends Q {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    enterRule(g) {
      g instanceof C && g.enterTotalInvocation(this);
    }
    exitRule(g) {
      g instanceof C && g.exitTotalInvocation(this);
    }
  }
  e.TotalInvocationContext = X;
  class ee extends Q {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    enterRule(g) {
      g instanceof C && g.enterThisInvocation(this);
    }
    exitRule(g) {
      g instanceof C && g.exitThisInvocation(this);
    }
  }
  e.ThisInvocationContext = ee;
  class le extends Q {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    enterRule(g) {
      g instanceof C && g.enterIndexInvocation(this);
    }
    exitRule(g) {
      g instanceof C && g.exitIndexInvocation(this);
    }
  }
  e.IndexInvocationContext = le;
  class ae extends Q {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    functn() {
      return this.getTypedRuleContext(k, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterFunctionInvocation(this);
    }
    exitRule(g) {
      g instanceof C && g.exitFunctionInvocation(this);
    }
  }
  e.FunctionInvocationContext = ae;
  class ce extends Q {
    constructor(g, L) {
      super(g), super.copyFrom(L);
    }
    identifier() {
      return this.getTypedRuleContext(R, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterMemberInvocation(this);
    }
    exitRule(g) {
      g instanceof C && g.exitMemberInvocation(this);
    }
  }
  e.MemberInvocationContext = ce;
  class k extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_functn;
    }
    identifier() {
      return this.getTypedRuleContext(R, 0);
    }
    paramList() {
      return this.getTypedRuleContext(G, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterFunctn(this);
    }
    exitRule(g) {
      g instanceof C && g.exitFunctn(this);
    }
  }
  class G extends f.ParserRuleContext {
    constructor(L, O, Z) {
      O === void 0 && (O = null), Z == null && (Z = -1);
      super(O, Z);
      se(this, "expression", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(u) : this.getTypedRuleContext(u, L);
      });
      this.parser = L, this.ruleIndex = e.RULE_paramList;
    }
    enterRule(L) {
      L instanceof C && L.enterParamList(this);
    }
    exitRule(L) {
      L instanceof C && L.exitParamList(this);
    }
  }
  class D extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_quantity;
    }
    NUMBER() {
      return this.getToken(e.NUMBER, 0);
    }
    unit() {
      return this.getTypedRuleContext(B, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterQuantity(this);
    }
    exitRule(g) {
      g instanceof C && g.exitQuantity(this);
    }
  }
  class B extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_unit;
    }
    dateTimePrecision() {
      return this.getTypedRuleContext(K, 0);
    }
    pluralDateTimePrecision() {
      return this.getTypedRuleContext(H, 0);
    }
    STRING() {
      return this.getToken(e.STRING, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterUnit(this);
    }
    exitRule(g) {
      g instanceof C && g.exitUnit(this);
    }
  }
  class K extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_dateTimePrecision;
    }
    enterRule(g) {
      g instanceof C && g.enterDateTimePrecision(this);
    }
    exitRule(g) {
      g instanceof C && g.exitDateTimePrecision(this);
    }
  }
  class H extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_pluralDateTimePrecision;
    }
    enterRule(g) {
      g instanceof C && g.enterPluralDateTimePrecision(this);
    }
    exitRule(g) {
      g instanceof C && g.exitPluralDateTimePrecision(this);
    }
  }
  class J extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_typeSpecifier;
    }
    qualifiedIdentifier() {
      return this.getTypedRuleContext(A, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterTypeSpecifier(this);
    }
    exitRule(g) {
      g instanceof C && g.exitTypeSpecifier(this);
    }
  }
  class A extends f.ParserRuleContext {
    constructor(L, O, Z) {
      O === void 0 && (O = null), Z == null && (Z = -1);
      super(O, Z);
      se(this, "identifier", function(L) {
        return L === void 0 && (L = null), L === null ? this.getTypedRuleContexts(R) : this.getTypedRuleContext(R, L);
      });
      this.parser = L, this.ruleIndex = e.RULE_qualifiedIdentifier;
    }
    enterRule(L) {
      L instanceof C && L.enterQualifiedIdentifier(this);
    }
    exitRule(L) {
      L instanceof C && L.exitQualifiedIdentifier(this);
    }
  }
  class R extends f.ParserRuleContext {
    constructor(g, L, O) {
      L === void 0 && (L = null), O == null && (O = -1), super(L, O), this.parser = g, this.ruleIndex = e.RULE_identifier;
    }
    IDENTIFIER() {
      return this.getToken(e.IDENTIFIER, 0);
    }
    DELIMITEDIDENTIFIER() {
      return this.getToken(e.DELIMITEDIDENTIFIER, 0);
    }
    enterRule(g) {
      g instanceof C && g.enterIdentifier(this);
    }
    exitRule(g) {
      g instanceof C && g.exitIdentifier(this);
    }
  }
  return e.EntireExpressionContext = a, e.ExpressionContext = u, e.TermContext = z, e.LiteralContext = U, e.ExternalConstantContext = $, e.InvocationContext = Q, e.FunctnContext = k, e.ParamListContext = G, e.QuantityContext = D, e.UnitContext = B, e.DateTimePrecisionContext = K, e.PluralDateTimePrecisionContext = H, e.TypeSpecifierContext = J, e.QualifiedIdentifierContext = A, e.IdentifierContext = R, Ht = e, Ht;
}
var Vt, Pl;
function ws() {
  if (Pl) return Vt;
  Pl = 1;
  const f = Ze(), C = As(), y = Rs(), p = j0();
  class l extends f.error.ErrorListener {
    constructor(a) {
      super(), this.errors = a;
    }
    syntaxError(a, u, s, t, i, n) {
      this.errors.push([a, u, s, t, i, n]);
    }
  }
  var r = function(e) {
    var a = new f.InputStream(e), u = new C(a), s = new f.CommonTokenStream(u), t = new y(s);
    t.buildParseTrees = !0;
    var i = [], n = new l(i);
    u.removeErrorListeners(), u.addErrorListener(n), t.removeErrorListeners(), t.addErrorListener(n);
    var o = t.entireExpression();
    class m extends p {
      constructor() {
        super();
      }
    }
    var c = {}, d, h = [c];
    for (let M of Object.getOwnPropertyNames(p.prototype))
      M.startsWith("enter") ? m.prototype[M] = function(P) {
        let q = h[h.length - 1];
        d = { type: M.slice(5) }, d.text = P.getText(), q.children || (q.children = []), q.children.push(d), h.push(d), d.terminalNodeText = [];
        for (let W of P.children)
          W.symbol && d.terminalNodeText.push(W.getText());
      } : M.startsWith("exit") && (m.prototype[M] = function() {
        h.pop();
      });
    var _ = new m();
    if (f.tree.ParseTreeWalker.DEFAULT.walk(_, o), i.length > 0) {
      let M = [];
      for (let P = 0, q = i.length; P < q; ++P) {
        let z = i[P], W = "line: " + z[2] + "; column: " + z[3] + "; message: " + z[4];
        M.push(W);
      }
      var T = new Error(M.join(`
`));
      throw T.errors = i, T;
    }
    return c;
  };
  return Vt = {
    parse: r
  }, Vt;
}
var Gt, Fl;
function ks() {
  if (Fl) return Gt;
  Fl = 1;
  var f = 6e4;
  return Gt = function(y) {
    var p = new Date(y.getTime()), l = p.getTimezoneOffset();
    p.setSeconds(0, 0);
    var r = p.getTime() % f;
    return l * f + r;
  }, Gt;
}
var zt, ql;
function Ps() {
  if (ql) return zt;
  ql = 1;
  function f(C) {
    return C instanceof Date;
  }
  return zt = f, zt;
}
var $t, Dl;
function Qe() {
  if (Dl) return $t;
  Dl = 1;
  var f = ks(), C = Ps(), y = 36e5, p = 6e4, l = 2, r = /[T ]/, e = /:/, a = /^(\d{2})$/, u = [
    /^([+-]\d{2})$/,
    // 0 additional digits
    /^([+-]\d{3})$/,
    // 1 additional digit
    /^([+-]\d{4})$/
    // 2 additional digits
  ], s = /^(\d{4})/, t = [
    /^([+-]\d{4})/,
    // 0 additional digits
    /^([+-]\d{5})/,
    // 1 additional digit
    /^([+-]\d{6})/
    // 2 additional digits
  ], i = /^-(\d{2})$/, n = /^-?(\d{3})$/, o = /^-?(\d{2})-?(\d{2})$/, m = /^-?W(\d{2})$/, c = /^-?W(\d{2})-?(\d{1})$/, d = /^(\d{2}([.,]\d*)?)$/, h = /^(\d{2}):?(\d{2}([.,]\d*)?)$/, _ = /^(\d{2}):?(\d{2}):?(\d{2}([.,]\d*)?)$/, T = /([Z+-].*)$/, M = /^(Z)$/, P = /^([+-])(\d{2})$/, q = /^([+-])(\d{2}):?(\d{2})$/;
  function z(S, b) {
    if (C(S))
      return new Date(S.getTime());
    if (typeof S != "string")
      return new Date(S);
    var E = b || {}, N = E.additionalDigits;
    N == null ? N = l : N = Number(N);
    var F = W(S), j = Y(F.date, N), $ = j.year, Q = j.restDateString, X = w(Q, $);
    if (X) {
      var ee = X.getTime(), le = 0, ae;
      if (F.time && (le = v(F.time)), F.timezone)
        ae = U(F.timezone) * p;
      else {
        var ce = ee + le, k = new Date(ce);
        ae = f(k);
        var G = new Date(ce);
        G.setDate(k.getDate() + 1);
        var D = f(G) - f(k);
        D > 0 && (ae += D);
      }
      return new Date(ee + le + ae);
    } else
      return new Date(S);
  }
  function W(S) {
    var b = {}, E = S.split(r), N;
    if (e.test(E[0]) ? (b.date = null, N = E[0]) : (b.date = E[0], N = E[1]), N) {
      var F = T.exec(N);
      F ? (b.time = N.replace(F[1], ""), b.timezone = F[1]) : b.time = N;
    }
    return b;
  }
  function Y(S, b) {
    var E = u[b], N = t[b], F;
    if (F = s.exec(S) || N.exec(S), F) {
      var j = F[1];
      return {
        year: parseInt(j, 10),
        restDateString: S.slice(j.length)
      };
    }
    if (F = a.exec(S) || E.exec(S), F) {
      var $ = F[1];
      return {
        year: parseInt($, 10) * 100,
        restDateString: S.slice($.length)
      };
    }
    return {
      year: null
    };
  }
  function w(S, b) {
    if (b === null)
      return null;
    var E, N, F, j;
    if (S.length === 0)
      return N = /* @__PURE__ */ new Date(0), N.setUTCFullYear(b), N;
    if (E = i.exec(S), E)
      return N = /* @__PURE__ */ new Date(0), F = parseInt(E[1], 10) - 1, N.setUTCFullYear(b, F), N;
    if (E = n.exec(S), E) {
      N = /* @__PURE__ */ new Date(0);
      var $ = parseInt(E[1], 10);
      return N.setUTCFullYear(b, 0, $), N;
    }
    if (E = o.exec(S), E) {
      N = /* @__PURE__ */ new Date(0), F = parseInt(E[1], 10) - 1;
      var Q = parseInt(E[2], 10);
      return N.setUTCFullYear(b, F, Q), N;
    }
    if (E = m.exec(S), E)
      return j = parseInt(E[1], 10) - 1, I(b, j);
    if (E = c.exec(S), E) {
      j = parseInt(E[1], 10) - 1;
      var X = parseInt(E[2], 10) - 1;
      return I(b, j, X);
    }
    return null;
  }
  function v(S) {
    var b, E, N;
    if (b = d.exec(S), b)
      return E = parseFloat(b[1].replace(",", ".")), E % 24 * y;
    if (b = h.exec(S), b)
      return E = parseInt(b[1], 10), N = parseFloat(b[2].replace(",", ".")), E % 24 * y + N * p;
    if (b = _.exec(S), b) {
      E = parseInt(b[1], 10), N = parseInt(b[2], 10);
      var F = parseFloat(b[3].replace(",", "."));
      return E % 24 * y + N * p + F * 1e3;
    }
    return null;
  }
  function U(S) {
    var b, E;
    return b = M.exec(S), b ? 0 : (b = P.exec(S), b ? (E = parseInt(b[2], 10) * 60, b[1] === "+" ? -E : E) : (b = q.exec(S), b ? (E = parseInt(b[2], 10) * 60 + parseInt(b[3], 10), b[1] === "+" ? -E : E) : 0));
  }
  function I(S, b, E) {
    b = b || 0, E = E || 0;
    var N = /* @__PURE__ */ new Date(0);
    N.setUTCFullYear(S, 0, 4);
    var F = N.getUTCDay() || 7, j = b * 7 + E + 1 - F;
    return N.setUTCDate(N.getUTCDate() + j), N;
  }
  return $t = z, $t;
}
var Kt, Bl;
function Xe() {
  if (Bl) return Kt;
  Bl = 1;
  var f = Qe();
  function C(y, p) {
    var l = f(y).getTime(), r = Number(p);
    return new Date(l + r);
  }
  return Kt = C, Kt;
}
var jt, Hl;
function Vl() {
  if (Hl) return jt;
  Hl = 1;
  var f = Xe(), C = 6e4;
  function y(p, l) {
    var r = Number(l);
    return f(p, r * C);
  }
  return jt = y, jt;
}
var _e = {}, Re = {}, Gl;
function Ie() {
  if (Gl) return Re;
  Gl = 1, Object.defineProperty(Re, "__esModule", {
    value: !0
  }), Re.Ucum = void 0;
  var f = {
    /**
     *  Flag indicating whether or not we're using case sensitive labels
     *  I don't think we need this.  I think we're just going with
     *  case sensitive, per Clem.   Gunther's code has this flag, but I
     *  am removing it, at least for now.  lm, 6/2016
     */
    //caseSensitive_: true ,
    /**
     *  The number of elements in a Dimension array.   Currently this
     *  is set as a configuration variable, but when we get to the point
     *  of loading the unit definitions from a file, this value will be
     *  set from that.
     */
    dimLen_: 7,
    /**
     *  The characters used as valid operators in a UCUM unit expression,
     *  where '.' is for multiplication and '/' is for division.
     */
    validOps_: [".", "/"],
    /**
     * The string used to separate a unit code and unit name when they
     * are displayed together
     */
    codeSep_: ": ",
    // Message text variations for validation methods and conversion methods
    valMsgStart_: "Did you mean ",
    valMsgEnd_: "?",
    cnvMsgStart_: "We assumed you meant ",
    cnvMsgEnd_: ".",
    /**
       * Default opening string used to emphasize portions of error messages.
       * Used when NOT displaying messages on a web site, i.e., for output
       * from the library methods or to a file.
       */
    openEmph_: " ->",
    /**
     * Default closing string used to emphasize portions of error messages.
     * Used when NOT displaying messages on a web site, i.e., for output
     * from the library methods or to a file.
     */
    closeEmph_: "<- ",
    /**
     * Opening HTML used to emphasize portions of error messages.  Used when
     * displaying messages on a web site; should be blank when output is
     * to a file.
     */
    openEmphHTML_: ' <span class="emphSpan">',
    /**
     * Closing HTML used to emphasize portions of error messages.  Used when
     * displaying messages on a web site; should be blank when output is
     * to a file.
     */
    closeEmphHTML_: "</span> ",
    /**
     * Message that is displayed when annotations are included in a unit
     * string, to let the user know how they are interpreted.
     */
    bracesMsg_: "FYI - annotations (text in curly braces {}) are ignored, except that an annotation without a leading symbol implies the default unit 1 (the unity).",
    /**
     * Message that is displayed or returned when a conversion is requested
     * for two units where (only) a mass<->moles conversion is appropriate
     * but no molecular weight was specified.
     */
    needMoleWeightMsg_: "Did you wish to convert between mass and moles?  The molecular weight of the substance represented by the units is required to perform the conversion.",
    /**
     * Hash that matches unit column names to names used in the csv file
     * that is submitted to the data updater.
     */
    csvCols_: {
      "case-sensitive code": "csCode_",
      "LOINC property": "loincProperty_",
      "name (display)": "name_",
      synonyms: "synonyms_",
      source: "source_",
      category: "category_",
      Guidance: "guidance_"
    },
    /**
     * Name of the column in the csv file that serves as the key
     */
    inputKey_: "case-sensitive code",
    /**
     * Special codes that contain operators within brackets.  The operator
     * within these codes causes them to parse incorrectly if they are preceded
     * by a prefix, because the parsing algorithm splits them up on the operator.
     * So we use this object to identify them and substitute placeholders to
     * avoid that.
     */
    specUnits_: {
      "B[10.nV]": "specialUnitOne",
      "[m/s2/Hz^(1/2)]": "specialUnitTwo"
    }
  };
  return Re.Ucum = f, Re;
}
var we = {}, be = {}, ke = {}, zl;
function Fs() {
  if (zl) return ke;
  zl = 1, Object.defineProperty(ke, "__esModule", {
    value: !0
  }), ke.Prefix = void 0, Ie();
  class f {
    /**
     * Creates a single prefix object.
     *
     * @param attrs a hash of the values to use in creating the prefix object.
     *  They should be:
     *   code_ - which is the case-sensitive code used for the prefix,
     *    e.g., k for kilo
     *   ciCode_ - which is the case-insensitive code used for the prefix,
     *    e.g., K for kilo
     *   name_ - which is the name of the prefix, e.g., kilo
     *   printSymbol_ - which is the print symbol for the prefix, e.g., k for kilo
     *   value_ - which is teh value to use in multiplying the magnitude of
     *    a unit, e.g., for a prefix of c the value will be .01.
     *   exp_ - which is the exponent used to get the value. For decimal based
     *    prefixes the base is 10 and the exp_ is applied to 10, e.g., for a
     *    prefix of c, the exponent will be -2.  For prefixes that are not
     *    decimal based, this will be null (but must not be undefined).
     *
     * @throws an error if the not all required parameters are provided
     */
    constructor(y) {
      if (y.code_ === void 0 || y.code_ === null || y.name_ === void 0 || y.name_ === null || y.value_ === void 0 || y.value_ === null || y.exp_ === void 0)
        throw new Error("Prefix constructor called missing one or more parameters.  Prefix codes (cs or ci), name, value and exponent must all be specified and all but the exponent must not be null.");
      this.code_ = y.code_, this.ciCode_ = y.ciCode_, this.name_ = y.name_, this.printSymbol_ = y.printSymbol_, typeof y.value_ == "string" ? this.value_ = parseFloat(y.value_) : this.value_ = y.value_, this.exp_ = y.exp_;
    }
    // end constructor
    /**
     * Returns the value for the current prefix object
     * @return the value for the prefix object with the specified code
     * */
    getValue() {
      return this.value_;
    }
    /**
     * Returns the prefix code for the current prefix object
     * @return the code for the current prefix object
     */
    getCode() {
      return this.code_;
    }
    /**
     * Returns the case-insensitive code for the current prefix object
     * @return the case_insensitive code for the current prefix object
     */
    getCiCode() {
      return this.ciCode_;
    }
    /**
     * Returns the prefix name for the current prefix object
     * @return the name for the current prefix object
     */
    getName() {
      return this.name_;
    }
    /**
     * Returns the print symbol for the current prefix object
     * @return the print symbol for the current prefix object
     */
    getPrintSymbol() {
      return this.printSymbol_;
    }
    /**
     * Returns the exponent for the current prefix object
     * @return the exponent for the current prefix object
     */
    getExp() {
      return this.exp_;
    }
    /**
     * Provides way to tell if one prefix equals another.  The second prefix
     * must match all attribute values.
     *
     * @param prefix2 prefix object to check for a match
     * @return true for a match; false if one or more attributes don't match
     */
    equals(y) {
      return this.code_ === y.code_ && this.ciCode_ === y.ciCode_ && this.name_ === y.name_ && this.printSymbol_ === y.printSymbol_ && this.value_ === y.value_ && this.exp_ === y.exp_;
    }
  }
  return ke.Prefix = f, ke;
}
var ve = {}, $l;
function W0() {
  if ($l) return ve;
  $l = 1, Object.defineProperty(ve, "__esModule", {
    value: !0
  }), ve.PrefixTables = ve.PrefixTablesFactory = void 0;
  class f {
    /**
     * Constructor.  This creates the empty PrefixTable hashes once.
     * There is one hash whose key is the prefix code and one whose
     * key is the prefix value.
     *
     * Implementation of this as a singleton is based on the UnitTables
     * implementation.  See that class for details.
     */
    constructor() {
      this.byCode_ = {}, this.byValue_ = {};
    }
    /**
     * Provides the number of prefix objects in each table
     * @returns count of the number of prefix objects in each table
     */
    prefixCount() {
      return Object.keys(this.byCode_).length;
    }
    /**
     * This is used to get all prefix objects by value.  Currently it is used
     * to create a csv file with all prefixes and units.
     * @returns csv string containing all prefix objects, ordered by value.
     */
    allPrefixesByValue() {
      let l = "", r = Object.keys(this.byValue_), e = r.length;
      for (let a = 0; a < e; a++) {
        let u = this.getPrefixByValue(r[a]);
        l += u.code_ + "," + u.name_ + ",," + u.value_ + `\r
`;
      }
      return l;
    }
    /**
     * This is used to get all prefix objects.  Currently it is used
     * to get the objects to write to the json ucum definitions file
     * that is used to provide prefix and unit definition objects for
     * conversions and validations.
     *
     * @returns an array containing all prefix objects, ordered by code.
     */
    allPrefixesByCode() {
      let l = [], r = Object.keys(this.byCode_);
      r.sort();
      let e = r.length;
      for (let a = 0; a < e; a++)
        l.push(this.getPrefixByCode(r[a]));
      return l;
    }
    /**
     * Adds a prefix object to the tables
     *
     * @param prefixObj the object to be added to the tables
     */
    add(l) {
      this.byCode_[l.getCode()] = l, this.byValue_[l.getValue()] = l;
    }
    /**
     * Tests whether a prefix object is found for a specified code.  This
     * is used to determine whether or not a prefix object has been created
     * for the code.
     *
     * @param code the code to be used to find the prefix object
     * @return boolean indicating whether or not a prefix object was found
     *  for the specified code
     */
    isDefined(l) {
      return this.byCode_[l] !== null && this.byCode_[l] !== void 0;
    }
    /**
     * Obtains a prefix object for a specified code.
     *
     * @param code the code to be used to find the prefix object
     * @return the prefix object found, or null if nothing was found
     */
    getPrefixByCode(l) {
      return this.byCode_[l];
    }
    /**
     * Obtains a prefix object for a specified value.
     *
     * @param value the value to be used to find the prefix object
     * @return the prefix object found, or null if nothing was found
     */
    getPrefixByValue(l) {
      return this.byValue_[l];
    }
  }
  ve.PrefixTablesFactory = f;
  var C = new f();
  const y = {
    getInstance: function() {
      return C;
    }
  };
  return ve.PrefixTables = y, ve;
}
var Pe = {}, Fe = {}, Kl;
function qs() {
  if (Kl) return Fe;
  Kl = 1, Object.defineProperty(Fe, "__esModule", {
    value: !0
  }), Fe.default = void 0;
  class f {
    /**
     * Constructor
     *
     * Creates the singleton object that contains the list of functions used
     * to convert special units.
     */
    constructor() {
      this.funcs = {}, this.funcs.cel = {
        cnvTo: function(p) {
          return p - 273.15;
        },
        cnvFrom: function(p) {
          return p + 273.15;
        }
      }, this.funcs.degf = {
        cnvTo: function(p) {
          return p - 459.67;
        },
        cnvFrom: function(p) {
          return p + 459.67;
        }
      }, this.funcs.degre = {
        cnvTo: function(p) {
          return p - 273.15;
        },
        cnvFrom: function(p) {
          return p + 273.15;
        }
      }, this.funcs.ph = {
        cnvTo: function(p) {
          return -Math.log(p) / Math.LN10;
        },
        cnvFrom: function(p) {
          return Math.pow(10, -p);
        }
      }, this.funcs.ln = {
        cnvTo: function(p) {
          return Math.log(p);
        },
        cnvFrom: function(p) {
          return Math.exp(p);
        }
      }, this.funcs["2ln"] = {
        cnvTo: function(p) {
          return 2 * Math.log(p);
        },
        cnvFrom: function(p) {
          return Math.exp(p / 2);
        }
      }, this.funcs.lg = {
        cnvTo: function(p) {
          return Math.log(p) / Math.LN10;
        },
        cnvFrom: function(p) {
          return Math.pow(10, p);
        }
      }, this.funcs["10lg"] = {
        cnvTo: function(p) {
          return 10 * Math.log(p) / Math.LN10;
        },
        cnvFrom: function(p) {
          return Math.pow(10, p / 10);
        }
      }, this.funcs["20lg"] = {
        cnvTo: function(p) {
          return 20 * Math.log(p) / Math.LN10;
        },
        cnvFrom: function(p) {
          return Math.pow(10, p / 20);
        }
      }, this.funcs["2lg"] = {
        cnvTo: function(p) {
          return 2 * Math.log(p) / Math.LN10;
        },
        cnvFrom: function(p) {
          return Math.pow(10, p / 2);
        }
      }, this.funcs.lgtimes2 = this.funcs["2lg"], this.funcs.ld = {
        cnvTo: function(p) {
          return Math.log(p) / Math.LN2;
        },
        cnvFrom: function(p) {
          return Math.pow(2, p);
        }
      }, this.funcs["100tan"] = {
        cnvTo: function(p) {
          return Math.tan(p) * 100;
        },
        cnvFrom: function(p) {
          return Math.atan(p / 100);
        }
      }, this.funcs.tanTimes100 = this.funcs["100tan"], this.funcs.sqrt = {
        cnvTo: function(p) {
          return Math.sqrt(p);
        },
        cnvFrom: function(p) {
          return p * p;
        }
      }, this.funcs.inv = {
        cnvTo: function(p) {
          return 1 / p;
        },
        cnvFrom: function(p) {
          return 1 / p;
        }
      }, this.funcs.hpX = {
        cnvTo: function(p) {
          return -this.funcs.lg(p);
        },
        cnvFrom: function(p) {
          return Math.pow(10, -p);
        }
      }, this.funcs.hpC = {
        cnvTo: function(p) {
          return -this.func.ln(p) / this.funcs.ln(100);
        },
        cnvFrom: function(p) {
          return Math.pow(100, -p);
        }
      }, this.funcs.hpM = {
        cnvTo: function(p) {
          return -this.funcs.ln(p) / this.funcs.ln(1e3);
        },
        cnvFrom: function(p) {
          return Math.pow(1e3, -p);
        }
      }, this.funcs.hpQ = {
        cnvTo: function(p) {
          return -this.funcs.ln(p) / this.funcs.ln(5e4);
        },
        cnvFrom: function(p) {
          return Math.pow(5e4, -p);
        }
      };
    }
    // end of constructor
    /**
     * Returns the function with the name specified
     *
     * @param fname name of the function to be returned
     * @return the function with the specified name
     * @throws an error message if the function is not found
     */
    forName(p) {
      p = p.toLowerCase();
      let l = this.funcs[p];
      if (l === null) throw new Error(`Requested function ${p} is not defined`);
      return l;
    }
    /**
     * Returns a flag indicating whether or not the function has been
     * defined.
     *
     * @param fname name of the function in question
     * @return true if it has been defined; false if not
     */
    isDefined(p) {
      return p = p.toLowerCase(), this.funcs[p] !== null;
    }
  }
  var C = new f();
  return Fe.default = C, Fe;
}
var Me = {}, qe = {}, jl;
function Ae() {
  if (jl) return qe;
  jl = 1, Object.defineProperty(qe, "__esModule", {
    value: !0
  }), qe.UnitTables = void 0;
  var f = Ie().Ucum;
  class C {
    /**
     * Constructor.  This creates the empty unit tables (hashes) once. After the
     * tables are created, it redefines this constructor to throw an error
     * stating that the constructor is no longer available and that the
     * getInstance function must be used.   Here's a description of the first
     * and then all subsequent calls to this constructor.
     *
     * First call to constructor:
     * 1. creates  OBJECT1
     * 2. initializes attributes of OBJECT1
     * 3. stores reference to OBJECT1.prototype in holdthis local variable
     * 4. redefines OBJECT1 as a function that throws an error
     * 5. defines the getInstance function (which is also defined outside of
     *    the class definition - see below).
     *
     * All subsequent calls to constructor:
     * 1. throw error message referring to getInstance
     * 2. call getInstance, returns this - which is OBJECT1.
     */
    constructor() {
      this.unitNames_ = {}, this.unitCodes_ = {}, this.codeOrder_ = [], this.unitStrings_ = {}, this.unitDimensions_ = {}, this.unitSynonyms_ = {}, this.massDimIndex_ = 0, this.dimVecIndexToBaseUnit_ = {};
    }
    /**
     * Provides the number of unit objects written to the tables, using the
     * codes table since codes must be unique.
     *
     * @returns count of the number of unit objects in the unitCodes_ table.
     */
    unitsCount() {
      return Object.keys(this.unitCodes_).length;
    }
    /**
     * Adds a Unit object to the tables.
     *
     * @param theUnit the unit to be added
     * @returns nothing
     * @throws passes on an error if one is thrown by the called functions for
     *  a problem with the unit code or unit name
     */
    addUnit(r) {
      r.name_ && this.addUnitName(r), this.addUnitCode(r), this.addUnitString(r);
      try {
        r.dim_.getProperty("dimVec_") && this.addUnitDimension(r);
      } catch {
      }
      if (r.isBase_) {
        const a = r.dim_.dimVec_;
        let u;
        for (let s = 0, t = a.length; u == null && s < t; ++s)
          a[s] != 0 && (u = s);
        this.dimVecIndexToBaseUnit_[u] = r.csCode_;
      }
    }
    // end addUnit
    /**
     * Adds a Unit object to the unitNames_ table.  More than one unit
     * can have the same name, e.g., the two units with the name "second",
     * where the code for one of them is 's' and the code for the other is
     * "'".  Because of this, an array of unit objects is stored for the
     * name.  In most cases it will be an array of one object, but this
     * clarifies that there may be more than one.
     *
     * @param theUnit the unit to be added
     * @returns nothing
     * @throws an error if the unit has no name
     */
    addUnitName(r) {
      let e = r.name_;
      if (e)
        this.unitNames_[e] ? this.unitNames_[e].push(r) : this.unitNames_[e] = [r];
      else throw new Error(`UnitTables.addUnitName called for a unit with no name.  Unit code = ${r.csCode_}.`);
    }
    // end addUnitName
    /**
     * Adds a Unit object to the unitCodes_, unitUcCodes_, unitLcCodes_ and
     * codeOrder_ tables.  This also sets the mass dimension index when the
     * base mass unit (gram) is read.
     *
     * @param theUnit the unit to be added
     * @returns nothing
     * @throws an error if the unitCodes_ table already contains a unit with
     *  the code
     */
    addUnitCode(r) {
      let e = r.csCode_;
      if (e) {
        if (this.unitCodes_[e]) throw new Error(`UnitTables.addUnitCode called, already contains entry for unit with code = ${e}`);
        if (this.unitCodes_[e] = r, this.codeOrder_.push(e), e == "g") {
          let a = r.dim_.dimVec_, u = 0;
          for (; u < a.length && a[u] < 1; u++) ;
          this.massDimIndex_ = u;
        }
      } else throw new Error("UnitTables.addUnitCode called for unit that has no code.");
    }
    // end addUnitCode
    /**
     * Adds a unit object to the unitStrings_ table.  More than one unit
     * can have the same string, so an array of unit objects is stored
     * for the string.  The unit string is the string that creates a non-base
     * unit, e.g., a Newton has a unit code of N, a name of Newton, and a
     * unitString of kg.m/s2.
     *
     * If the unit has no string, nothing is stored and no error is reported.
     *
     * @param theUnit the unit to be added
     * @returns nothing
     */
    addUnitString(r) {
      let e = null;
      if (f.caseSensitive_ == !0 ? e = r.csUnitString_ : e = r.ciUnitString_, e) {
        let a = {
          mag: r.baseFactorStr_,
          unit: r
        };
        this.unitStrings_[e] ? this.unitStrings_[e].push(a) : this.unitStrings_[e] = [a];
      }
    }
    // end addUnitString
    /**
     * Adds a Unit object to the unitDimensions_ table.  More than one unit
     * can have the same dimension (commensurable units have the same dimension).
     * Because of this, an array of unit objects is stored for the
     * dimension.
     *
     * @param theUnit the unit to be added
     * @returns nothing
     * @throws an error if the unit has no dimension
     */
    addUnitDimension(r) {
      let e = r.dim_.getProperty("dimVec_");
      if (e)
        this.unitDimensions_[e] ? this.unitDimensions_[e].push(r) : this.unitDimensions_[e] = [r];
      else throw new Error(`UnitTables.addUnitDimension called for a unit with no dimension.  Unit code = ${r.csCode_}.`);
    }
    // end addUnitDimension
    /**
     * Builds the unitSynonyms_ table. This is called the first time the
     * getUnitsBySynonym method is called.  The table/hash contains each word
     * (once) from each synonym as well as each word from each unit name.
     *
     * Hash keys are the words.  Hash values are an array of unit codes for
     * each unit that has that word in its synonyms or name.
     *
     * @returns nothing
     */
    buildUnitSynonyms() {
      for (let r in this.unitCodes_) {
        let e = this.unitCodes_[r], a = e.synonyms_;
        if (a) {
          let u = a.split(";");
          if (u[0] !== "") {
            let s = u.length;
            for (let t = 0; t < s; t++) {
              let i = u[t].trim();
              this.addSynonymCodes(r, i);
            }
          }
        }
        this.addSynonymCodes(r, e.name_);
      }
    }
    // end buildUnitSynonyms
    /**
     * Adds unit code entries to the synonyms table for a string containing
     * one or more words to be considered as synonyms.
     *
     * @param theCode the unit code to be connected to the synonyms
     * @param theSynonyms a string containing one or more words to be
     *  considered synonyms (and thus to be added to the unitSynonyms hash).
     */
    addSynonymCodes(r, e) {
      let a = e.split(" "), u = a.length;
      for (let s = 0; s < u; s++) {
        let t = a[s];
        this.unitSynonyms_[t] ? this.unitSynonyms_[t].indexOf(r) === -1 && this.unitSynonyms_[t].push(r) : this.unitSynonyms_[t] = [r];
      }
    }
    // end addSynonymCodes
    /**
     *  Returns a unit object with a case-sensitive code matching the
     *  uCode parameter, or null if no unit is found with that code.
     *
     *  @param uCode the code of the unit to be returned
     *  @returns the unit object or null if it is not found
     */
    getUnitByCode(r) {
      let e = null;
      return r && (e = this.unitCodes_[r]), e;
    }
    /**
     *  Returns a array of unit objects based on the unit's name.  Usually this
     *  will be an array of one, but there may be more, since unit names are
     *  not necessarily unique.
     *
     *  @param uName the name of the unit to be returned.  If more than one
     *  unit has the same name and you only want one specific unit, append the
     *  csCode of the unit you want to the end of the name, separated by the
     *  Ucum.codeSep_ value, e.g., inch - [in_i] vs. inch - [in_us].
     *  @returns null if no unit was found for the specified name OR an array of
     *  unit objects with the specified name.  Normally this will be an array
     *  of one object.
     *  @throws an error if no name is provided to search on
     */
    getUnitByName(r) {
      if (r == null)
        throw new Error("Unable to find unit by name because no name was provided.");
      let e = r.indexOf(f.codeSep_), a = null;
      e >= 1 && (a = r.substr(e + f.codeSep_.length), r = r.substr(0, e));
      let u = this.unitNames_[r];
      if (u) {
        let s = u.length;
        if (a && s > 1) {
          let t = 0;
          for (; u[t].csCode_ !== a && t < s; t++) ;
          t < s ? u = [u[t]] : u = null;
        }
      }
      return u;
    }
    // end getUnitByName
    /**
     *  Returns an array of unit objects with the specified unit string.
     *  The array may contain one or more unit reference objects.
     *  Or none, if no units have a matching unit string (which is not
     *  considered an error)
     *
     *  @param name the name of the unit to be returned
     *  @returns the array of unit references or null if none were found
     */
    getUnitByString(r) {
      let e = null;
      return r && (e = this.unitStrings_[r], e === void 0 && (e = null)), e;
    }
    /**
     *  Returns a array of unit objects based on the unit's dimension vector.
     *
     *  @param uName the dimension vector of the units to be returned.
     *
     *  @returns null if no unit was found for the specified vector OR an array of
     *  one or more unit objects with the specified vector.
     *  @throws an error if no vector is provided to search on
     *  logs an error to the console if no unit is found
     */
    getUnitsByDimension(r) {
      let e = null;
      if (r == null)
        throw new Error("Unable to find unit by because no dimension vector was provided.");
      return e = this.unitDimensions_[r], e == null && console.log(`Unable to find unit with dimension = ${r}`), e;
    }
    // end getUnitsByDimension
    /**
     *  Returns a array of unit objects that include the specified synonym.
     *
     *  @param uSyn the synonym of the units to be returned.
     *
     *  @returns an object with two of the following three elements:
     *   'status' will be error, failed or succeeded
     *   'msg' will be included for returns with status = error or failed and
     *     will explain why the request did not return any units
     *   'units' any array of unit objects with the specified synonym will be
     *     returned for requests with status = succeeded
     */
    getUnitBySynonym(r) {
      let e = {}, a = [];
      try {
        if (r == null)
          throw e.status = "error", new Error("Unable to find unit by synonym because no synonym was provided.");
        Object.keys(this.unitSynonyms_).length === 0 && this.buildUnitSynonyms();
        let u = [];
        if (u = this.unitSynonyms_[r], u) {
          e.status = "succeeded";
          let s = u.length;
          for (let t = 0; t < s; t++)
            a.push(this.unitCodes_[u[t]]);
          e.units = a;
        }
        a.length === 0 && (e.status = "failed", e.msg = `Unable to find any units with synonym = ${r}`);
      } catch (u) {
        e.msg = u.message;
      }
      return e;
    }
    // end getUnitBySynonym
    /**
     * Gets a list of all unit names in the Unit tables
     *
     * @returns an array of the unit names
     */
    getAllUnitNames() {
      return Object.keys(this.unitNames_);
    }
    // end getAllUnitNames
    /**
     * Gets a list of all unit names in the tables.  Where more than one
     * unit has the same name, the unit code, in parentheses, is appended
     * to the end of the name.
     *
     * @returns {Array}
     */
    getUnitNamesList() {
      let r = [], e = Object.keys(this.unitCodes_);
      e.sort(this.compareCodes);
      let a = e.length;
      for (let u = 0; u < a; u++)
        r[u] = e[u] + f.codeSep_ + this.unitCodes_[e[u]].name_;
      return r;
    }
    /*
     * Returns the mass dimension index
     * @returns this.massDimIndex_
     */
    getMassDimensionIndex() {
      return this.massDimIndex_;
    }
    /**
     * This provides a sort function for unit codes so that sorting ignores
     * square brackets and case.
     *
     * @param a first value
     * @param b second value
     * @returns -1 if a is should fall before b; otherwise 1.
     */
    compareCodes(r, e) {
      return r = r.replace(/[\[\]]/g, ""), r = r.toLowerCase(), e = e.replace(/[\[\]]/g, ""), e = e.toLowerCase(), r < e ? -1 : 1;
    }
    /**
     * Gets a list of all unit codes in the Unit tables
     *
     * @returns an array of the unit names
     */
    getAllUnitCodes() {
      return Object.keys(this.unitCodes_);
    }
    // end getAllUnitNames
    /**
     * This is used to get all unit objects.  Currently it is used
     * to get the objects to write to the json ucum definitions file
     * that is used to provide prefix and unit definition objects for
     * conversions and validations.
     *
     * @returns an array containing all unit objects, ordered by definition
     * order
     */
    allUnitsByDef() {
      let r = [], e = this.codeOrder_.length;
      for (let a = 0; a < e; a++)
        r.push(this.getUnitByCode(this.codeOrder_[a]));
      return r;
    }
    // end allUnitsByDef
    /**
     * This is used to get all unit objects, ordered by unit name.  Currently it
     * is used to create a csv list of all units.
     * @param sep separator character (or string) to be used to separate each
     *  column in the output.  Optional, defaults to '|' if not specified.
     *  (Used to use ; but the synonyms use that extensively).  Don't use a
     *  comma or any other punctuation found in the output data.
     * @returns a buffer containing all unit objects, ordered by name
     * order
     */
    allUnitsByName(r, e) {
      e == null && (e = "|");
      let a = "", u = this.getAllUnitNames(), s = u.length, t = r.length;
      for (let i = 0; i < s; i++) {
        let n = this.getUnitByName(u[i]);
        for (let o = 0; o < n.length; o++) {
          let m = n[o];
          for (let c = 0; c < t; c++)
            if (c > 0 && (a += e), r[c] === "dim_")
              m.dim_ !== null && m.dim_ !== void 0 && m.dim_.dimVec_ instanceof Array ? a += "[" + m.dim_.dimVec_.join(",") + "]" : a += "";
            else {
              let d = m[r[c]];
              typeof d == "string" ? a += d.replace(/[\n\r]/g, " ") : a += d;
            }
          a += `\r
`;
        }
      }
      return a;
    }
    // end allUnitsByName
    /**
     * This creates a list of all units in the tables.  It uses the byCode
     * table, and uses the codeOrder_ array to determine the order in which
     * the units are listed.
     *
     * @param doLong boolean indicating how much to output.  If true, all data
     *  from the unit objects is included.   If false, only a few major values
     *  are included.
     * @param sep separator character (or string) to be used to separate each
     *  column in the output.  Optional, defaults to '|' if not specified.
     *  (Used to use ; but the synonyms use that extensively).
     * @returns {string} buffer containing all the listings
     */
    printUnits(r, e) {
      r === void 0 && (r = !1), e === void 0 && (e = "|");
      let a = "", u = this.codeOrder_.length, s = "csCode" + e;
      r && (s += "ciCode" + e), s += "name" + e, r && (s += "isBase" + e), s += "magnitude" + e + "dimension" + e + "from unit(s)" + e + "value" + e + "function" + e, r && (s += "property" + e + "printSymbol" + e + "synonyms" + e + "source" + e + "class" + e + "isMetric" + e + "variable" + e + "isSpecial" + e + "isAbitrary" + e), s += "comment", a = s + `
`;
      for (let t = 0; t < u; t++) {
        let i = this.getUnitByCode(this.codeOrder_[t]);
        s = this.codeOrder_[t] + e, r && (s += i.getProperty("ciCode_") + e), s += i.getProperty("name_") + e, r && (i.getProperty("isBase_") ? s += "true" + e : s += "false" + e), s += i.getProperty("magnitude_") + e;
        let n = i.getProperty("dim_");
        n ? s += n.dimVec_ + e : s += "null" + e, i.csUnitString_ ? s += i.csUnitString_ + e + i.baseFactor_ + e : s += "null" + e + "null" + e, i.cnv_ ? s += i.cnv_ + e : s += "null" + e, r && (s += i.getProperty("property_") + e + i.getProperty("printSymbol_") + e + i.getProperty("synonyms_") + e + i.getProperty("source_") + e + i.getProperty("class_") + e + i.getProperty("isMetric_") + e + i.getProperty("variable_") + e + i.getProperty("isSpecial_") + e + i.getProperty("isArbitrary_") + e), i.defError_ && (s += "problem parsing this one, deferred to later."), a += s + `
`;
      }
      return a;
    }
  }
  var y = new C();
  const p = {
    getInstance: function() {
      return y;
    }
  };
  return qe.UnitTables = p, qe;
}
var Wl;
function Nn() {
  if (Wl) return Me;
  Wl = 1, Object.defineProperty(Me, "__esModule", {
    value: !0
  }), Me.isNumericString = C, Me.isIntegerUnit = y, Me.getSynonyms = p;
  var f = Ae().UnitTables;
  function C(l) {
    let r = "" + l;
    return !isNaN(r) && !isNaN(parseFloat(r));
  }
  function y(l) {
    return /^\d+$/.test(l);
  }
  function p(l) {
    let r = {}, e = f.getInstance(), a = {};
    if (a = e.getUnitBySynonym(l), !a.units)
      r.status = a.status, r.msg = a.msg;
    else {
      r.status = "succeeded";
      let u = a.units.length;
      r.units = [];
      for (let s = 0; s < u; s++) {
        let t = a.units[s];
        r.units[s] = {
          code: t.csCode_,
          name: t.name_,
          guidance: t.guidance_
        };
      }
    }
    return r;
  }
  return Me;
}
var De = {}, Wt, Jl;
function Ds() {
  return Jl || (Jl = 1, Wt = Number.isFinite || function(f) {
    return !(typeof f != "number" || f !== f || f === 1 / 0 || f === -1 / 0);
  }), Wt;
}
var Jt, Yl;
function J0() {
  if (Yl) return Jt;
  Yl = 1;
  var f = Ds();
  return Jt = Number.isInteger || function(C) {
    return typeof C == "number" && f(C) && Math.floor(C) === C;
  }, Jt;
}
var Zl;
function Bs() {
  if (Zl) return De;
  Zl = 1, Object.defineProperty(De, "__esModule", {
    value: !0
  }), De.Dimension = void 0;
  var f = Ie(), C = J0();
  class y {
    /**
     * Constructor.
     *
     * @param dimSetting an optional parameter that may be:
     *  null, which means that the dimVec_ attribute for this object will be null; or
     *  an array, which must be the length defined by Ucum.dimLen_, and
     *    whose contents will be copied to this new object's vector; or
     *  an integer, which must be between 0 and 1 less than the vector length
     *    defined by Ucum.dimLen_.  This new object's vector will be
     *    initialized to zero for all elements except the one whose index
     *    matches the number passed in.  That element will be set to one.
      * @throws an error if the dimSetting parameter does not meet the types
     *  listed above.
     *  An error will also be thrown if Ucum.dimLen_ has not been set yet,
     *  i.e., is still zero.   Currently that won't happen, because the
     *  value is set in the config.js file.  But further down the road
     *  the setting will come from a definitions input file, so we check
     *  here anyway.
     *
     */
    constructor(l) {
      if (f.Ucum.dimLen_ === 0)
        throw new Error("Dimension.setDimensionLen must be called before Dimension constructor");
      if (l == null)
        this.assignZero();
      else if (l instanceof Array) {
        if (l.length !== f.Ucum.dimLen_)
          throw new Error(`Parameter error, incorrect length of vector passed to Dimension constructor, vector = ${JSON.stringify(l)}`);
        this.dimVec_ = [];
        for (let r = 0; r < f.Ucum.dimLen_; r++) this.dimVec_.push(l[r]);
      } else if (C(l)) {
        if (l < 0 || l >= f.Ucum.dimLen_)
          throw new Error("Parameter error, invalid element number specified for Dimension constructor");
        this.assignZero(), this.dimVec_[l] = 1;
      }
    }
    // end constructor
    /**
     * Sets the element at the specified position to a specified value.  The
     * default value is 1.  If the dimension vector is null when this is called
     * a zero-filled vector is created and then the indicated position is set.
     *
     * @param indexPos the index of the element to be set
     * @param value the value to assign to the specified element; optional,
     *  default value is 1
     * @throws an exception if the specified position is invalid, i.e., not a
     *   number or is less than 0 or greater than Ucum.dimLen_
     **/
    setElementAt(l, r) {
      if (!C(l) || l < 0 || l >= f.Ucum.dimLen_)
        throw new Error(`Dimension.setElementAt called with an invalid index position (${l})`);
      this.dimVec_ || this.assignZero(), r == null && (r = 1), this.dimVec_[l] = r;
    }
    /**
     * Gets the value of the element at the specified position
     *
     * @param indexPos the index of the element whose value is to be returned
     * @return the value of the element at indexPos, or null if the dimension
     *  vector is null
     * @throws an exception if the specified position is invalid, i.e., not a
     *   number or is less than 0 or greater than Ucum.dimLen_
     **/
    getElementAt(l) {
      if (!C(l) || l < 0 || l >= f.Ucum.dimLen_)
        throw new Error(`Dimension.getElementAt called with an invalid index position (${l})`);
      let r = null;
      return this.dimVec_ && (r = this.dimVec_[l]), r;
    }
    /**
     * This returns the value of the property named by the parameter
     * passed in.  Although we currently only have one property, dimVec_,
     * that this will get, it's possible that we'll have additional
     * properties.   If we don't this could just be replaced by a
     * getVector function.
     *
     * @param propertyName name of the property to be returned, with
     *        or without the trailing underscore.
     * @return the requested property, if found for this Dimension
     * @throws an error if the property is not found for this Dimension
     */
    getProperty(l) {
      let r = l.charAt(l.length - 1) === "_" ? l : l + "_";
      return this[r];
    }
    // end getProperty
    /**
     * Return a string that represents the dimension vector.  Returns null if
     * the dimension vector is null.
     *
     * @return the string that represents the dimension vector.  The
     *         values are enclosed in square brackets, each separated
     *         by a comma and a space
     **/
    toString() {
      let l = null;
      return this.dimVec_ && (l = "[" + this.dimVec_.join(", ") + "]"), l;
    }
    /**
     * Adds the vector of the dimension object passed in to this
     * dimension object's vector.  This object's vector is changed.
     * If either dimension vector is null, no changes are made to this object.
     *
     *
     * @param dim2 the dimension whose vector is to be added to this one
     * @return this object
     * @throws an exception if dim2 is not a Dimension object
     **/
    add(l) {
      if (!l instanceof y)
        throw new Error(`Dimension.add called with an invalid parameter - ${typeof l} instead of a Dimension object`);
      if (this.dimVec_ && l.dimVec_)
        for (let r = 0; r < f.Ucum.dimLen_; r++) this.dimVec_[r] += l.dimVec_[r];
      return this;
    }
    /**
     * Subtracts the vector of the dimension object passed in from this
     * dimension object's vector.  This object's vector is changed.
     * If either dimension vector is null, no changes are made to this object.
     *
     * @param dim2 the dimension whose vector is to be subtracted from this one
     * @return this object
     * @throws an exception if dim2 is not a Dimension object
     **/
    sub(l) {
      if (!l instanceof y)
        throw new Error(`Dimension.sub called with an invalid parameter - ${typeof l} instead of a Dimension object`);
      if (this.dimVec_ && l.dimVec_)
        for (let r = 0; r < f.Ucum.dimLen_; r++) this.dimVec_[r] -= l.dimVec_[r];
      return this;
    }
    /**
     * Inverts this dimension object's vector (by multiplying each element
     * by negative 1).  This object's vector is changed - unless it is null,
     * in which case it stays that way.
     *
     * @return this object
     **/
    minus() {
      if (this.dimVec_)
        for (let l = 0; l < f.Ucum.dimLen_; l++) this.dimVec_[l] = -this.dimVec_[l];
      return this;
    }
    /**
     * Multiplies this dimension object's vector with a scalar.  This is used
     * when a unit is raised to a power.  This object's vector is changed unless
     * the vector is null, in which case it stays that way.
     *
     * @param s the scalar to use
     * @return this object
     * @throws an exception if s is not a number
     */
    mul(l) {
      if (!C(l))
        throw new Error(`Dimension.sub called with an invalid parameter - ${typeof dim2} instead of a number`);
      if (this.dimVec_)
        for (let r = 0; r < f.Ucum.dimLen_; r++) this.dimVec_[r] *= l;
      return this;
    }
    /**
     * Tests for equality of this dimension object's vector and that of
     * the dimension object passed in.  If the dimension vector for one of
     * the objects is null, the dimension vector for the other object must
     * also be null for the two to be equal.  (I know - duh.  still)
     *
     * @param dim2 the dimension object whose vector is to be compared to this one
     * @return true if the two vectors are equal; false otherwise.
     * @throws an exception if dim2 is not a Dimension object
     */
    equals(l) {
      if (!l instanceof y)
        throw new Error(`Dimension.equals called with an invalid parameter - ${typeof l} instead of a Dimension object`);
      let r = !0, e = l.dimVec_;
      if (this.dimVec_ && e)
        for (let a = 0; r && a < f.Ucum.dimLen_; a++) r = this.dimVec_[a] === e[a];
      else
        r = this.dimVec_ === null && e === null;
      return r;
    }
    /**
     * Assigns the contents of the vector belonging to the dimension object
     * passed in to this dimension's vector.  If this dimension vector is null
     * and the other is not, this one will get the contents of the other.  If
     * this dimension vector is not null but the one passed in is null, this
     * one will be set to null.
     *
     * @param dim2 the dimension object with the vector whose contents are
     *  to be assigned to this dimension's vector
     * @return this object (not sure why)
     * @throws an exception if dim2 is not a Dimension object
     */
    assignDim(l) {
      if (!l instanceof y)
        throw new Error(`Dimension.assignDim called with an invalid parameter - ${typeof l} instead of a Dimension object`);
      if (l.dimVec_ === null) this.dimVec_ = null;
      else {
        this.dimVec_ === null && (this.dimVec_ = []);
        for (let r = 0; r < f.Ucum.dimLen_; r++) this.dimVec_[r] = l.dimVec_[r];
      }
      return this;
    }
    /**
     * Sets all elements of this dimension object's vector to zero.
     * If this object's vector is null, it is created as a zero-filled vector.
     *
     * @return this object (not sure why)
     */
    assignZero() {
      (this.dimVec_ === null || this.dimVec_ === void 0) && (this.dimVec_ = []);
      for (let l = 0; l < f.Ucum.dimLen_; l++)
        this.dimVec_.push(0);
      return this;
    }
    /**
     * Tests for a dimension vector set to all zeroes.
     *
     * @return true if exponents (elements) of this dimension's vector are all
     * zero; false otherwise (including if the current vector is null).
     *
     */
    isZero() {
      let l = this.dimVec_ !== null;
      if (this.dimVec_)
        for (let r = 0; l && r < f.Ucum.dimLen_; r++) l = this.dimVec_[r] === 0;
      return l;
    }
    /**
     * Tests for a Dimension object with no dimension vector (dimVec_ is null).
     *
     * @return true the dimension vector is null; false if it is not
     *
     */
    isNull() {
      return this.dimVec_ === null;
    }
    /**
     * Creates and returns a clone of this Dimension object
     *
     * @return the clone
     */
    clone() {
      let l = new y();
      return l.assignDim(this), l;
    }
  }
  return De.Dimension = y, De;
}
var Ql;
function Y0() {
  if (Ql) return Pe;
  Ql = 1, Object.defineProperty(Pe, "__esModule", {
    value: !0
  }), Pe.Unit = void 0;
  var f = l(qs()), C = p(Nn());
  function y() {
    if (typeof WeakMap != "function") return null;
    var t = /* @__PURE__ */ new WeakMap();
    return y = function() {
      return t;
    }, t;
  }
  function p(t) {
    if (t && t.__esModule)
      return t;
    if (t === null || typeof t != "object" && typeof t != "function")
      return { default: t };
    var i = y();
    if (i && i.has(t))
      return i.get(t);
    var n = {}, o = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var m in t)
      if (Object.prototype.hasOwnProperty.call(t, m)) {
        var c = o ? Object.getOwnPropertyDescriptor(t, m) : null;
        c && (c.get || c.set) ? Object.defineProperty(n, m, c) : n[m] = t[m];
      }
    return n.default = t, i && i.set(t, n), n;
  }
  function l(t) {
    return t && t.__esModule ? t : { default: t };
  }
  var r = Ie().Ucum, e = Bs().Dimension, a, u = J0();
  class s {
    /**
     * Constructor.
     *
     * @param attrs an optional parameter that may be:
     *  a string, which is parsed by the unit parser, which creates
     *  the unit from the parsed string; or
     *  a hash containing all or some values for the attributes of
     *  the unit, where the keys are the attribute names, without a
     *  trailing underscore, e.g., name instead of name_; or
     *  null, in which case an empty hash is created and used to
     *  set the values forthe attributes.
     *  If a hash (empty or not) is used, attributes for which no value
     *  is specified are assigned a default value.
     *
     */
    constructor(i = {}) {
      this.isBase_ = i.isBase_ || !1, this.name_ = i.name_ || "", this.csCode_ = i.csCode_ || "", this.ciCode_ = i.ciCode_ || "", this.property_ = i.property_ || "", this.magnitude_ = i.magnitude_ || 1, i.dim_ === void 0 || i.dim_ === null ? this.dim_ = new e() : i.dim_.dimVec_ !== void 0 ? this.dim_ = new e(i.dim_.dimVec_) : i.dim_ instanceof e ? this.dim_ = i.dim_ : i.dim_ instanceof Array || u(i.dim_) ? this.dim_ = new e(i.dim_) : this.dim_ = new e(), this.printSymbol_ = i.printSymbol_ || null, this.class_ = i.class_ || null, this.isMetric_ = i.isMetric_ || !1, this.variable_ = i.variable_ || null, this.cnv_ = i.cnv_ || null, this.cnvPfx_ = i.cnvPfx_ || 1, this.isSpecial_ = i.isSpecial_ || !1, this.isArbitrary_ = i.isArbitrary_ || !1, this.moleExp_ = i.moleExp_ || 0, this.synonyms_ = i.synonyms_ || null, this.source_ = i.source_ || null, this.loincProperty_ = i.loincProperty_ || null, this.category_ = i.category_ || null, this.guidance_ = i.guidance_ || null, this.csUnitString_ = i.csUnitString_ || null, this.ciUnitString_ = i.ciUnitString_ || null, this.baseFactorStr_ = i.baseFactorStr_ || null, this.baseFactor_ = i.baseFactor_ || null, this.defError_ = i.defError_ || !1;
    }
    // end constructor
    /**
     * Assign the unity (= dimensionless unit 1) to this unit.
     *
     * @return this unit
     */
    assignUnity() {
      return this.name_ = "", this.magnitude_ = 1, this.dim_ || (this.dim_ = new e()), this.dim_.assignZero(), this.cnv_ = null, this.cnvPfx_ = 1, this;
    }
    // end assignUnity
    /**
     * This assigns one or more values, as provided in the hash passed in,
     * to this unit.
     *
     * @param vals hash of values to be assigned to the attributes
     *        specified by the key(s), which should be the attribute
     *        name without the trailing underscore, e.g., name instead
     *        of name_.
     * @return nothing
     */
    assignVals(i) {
      for (let n in i) {
        let o = !n.charAt(n.length - 1) === "_" ? n + "_" : n;
        if (this.hasOwnProperty(o)) this[o] = i[n];
        else throw new Error(`Parameter error; ${n} is not a property of a Unit`);
      }
    }
    // end assignVals
    /**
     * This creates a clone of this unit.
     *
     * @return the clone
     */
    clone() {
      let i = new s();
      return Object.getOwnPropertyNames(this).forEach((n) => {
        n === "dim_" ? this.dim_ ? i.dim_ = this.dim_.clone() : i.dim_ = null : i[n] = this[n];
      }), i;
    }
    // end clone
    /**
     * This assigns all properties of a unit passed to it to this unit.
     *
     * @param unit2 the unit whose properties are to be assigned to this one.
     * @return nothing; this unit is updated
     */
    assign(i) {
      Object.getOwnPropertyNames(i).forEach((n) => {
        n === "dim_" ? i.dim_ ? this.dim_ = i.dim_.clone() : this.dim_ = null : this[n] = i[n];
      });
    }
    // end assign
    /**
     * This determines whether or not object properties of the unit
     * passed in are equal to the corresponding properties in this unit.
     * The following properties are the only ones checked:
     *   magnitude_, dim_, cnv_ and cnvPfx_
     *
     * @param unit2 the unit whose properties are to be checked.
     * @return boolean indicating whether or not they match
     */
    equals(i) {
      return this.magnitude_ === i.magnitude_ && this.cnv_ === i.cnv_ && this.cnvPfx_ === i.cnvPfx_ && (this.dim_ === null && i.dim_ === null || this.dim_.equals(i.dim_));
    }
    // end equals
    /**
     * This method compares every attribute of two objects to determine
     * if they all match.
     *
     * @param unit2 the unit that is to be compared to this unit
     * @return boolean indicating whether or not every attribute matches
     */
    fullEquals(i) {
      let n = Object.keys(this).sort(), o = Object.keys(i).sort(), m = n.length, c = m === o.length;
      for (let d = 0; d < m && c; d++)
        n[d] === o[d] ? n[d] === "dim_" ? c = this.dim_.equals(i.dim_) : c = this[n[d]] === i[n[d]] : c = !1;
      return c;
    }
    // end of fullEquals
    /**
     * This returns the value of the property named by the parameter
     * passed in.
     *
     * @param propertyName name of the property to be returned, with
     *        or without the trailing underscore.
     * @return the requested property, if found for this unit
     * @throws an error if the property is not found for this unit
     */
    getProperty(i) {
      let n = i.charAt(i.length - 1) === "_" ? i : i + "_";
      return this[n];
    }
    // end getProperty
    /**
     * Takes a measurement consisting of a number of units and a unit and returns
     * the equivalent number of this unit.  So, 15 mL would translate
     * to 1 tablespoon if this object is a tablespoon.
     *
     * Note that the number returned may not be what is normally expected.
     * For example, converting 10 Celsius units to Fahrenheit would "normally"
     * return a value of 50.   But in this case you'll get back something like
     * 49.99999999999994.
     *
     * If either unit is an arbitrary unit an exception is raised.
     *
     * @param num the magnitude for the unit to be translated (e.g. 15 for 15 mL)
     * @param fromUnit the unit to be translated to one of this type (e.g. a mL unit)
     *
     * @return the number of converted units (e.g. 1 for 1 tablespoon)
     * @throws an error if the dimension of the fromUnit differs from this unit's
     * dimension
     */
    convertFrom(i, n) {
      let o = 0;
      if (this.isArbitrary_) throw new Error(`Attempt to convert to arbitrary unit "${this.csCode_}"`);
      if (n.isArbitrary_) throw new Error(`Attempt to convert arbitrary unit "${n.csCode_}"`);
      if (n.dim_ && this.dim_ && !n.dim_.equals(this.dim_))
        throw this.isMoleMassCommensurable(n) ? new Error(r.needMoleWeightMsg_) : new Error(`Sorry.  ${n.csCode_} cannot be converted to ${this.csCode_}.`);
      if (n.dim_ && (!this.dim_ || this.dim_.isNull()))
        throw new Error(`Sorry.  ${n.csCode_} cannot be converted to ${this.csCode_}.`);
      if (this.dim_ && (!n.dim_ || n.dim_.isNull()))
        throw new Error(`Sorry.  ${n.csCode_} cannot be converted to ${this.csCode_}.`);
      let m = n.cnv_, c = n.magnitude_, d;
      return m != null ? d = f.default.forName(m).cnvFrom(i * n.cnvPfx_) * c : d = i * c, this.cnv_ != null ? o = f.default.forName(this.cnv_).cnvTo(d / this.magnitude_) / this.cnvPfx_ : o = d / this.magnitude_, o;
    }
    // end convertFrom
    /**
     * Takes a number and a target unit and returns the number for a measurement
     * of this unit that corresponds to the number of the target unit passed in.
     * So, 1 tablespoon (where this unit represents a tablespoon) would translate
     * to 15 mL.
     *
     * See the note on convertFrom about return values.
     *
     * @param mag the magnitude for this unit (e.g. 1 for 1 tablespoon)
     * @param toUnit the unit to which this unit is to be translated
     *  (e.g. an mL unit)
     *
     * @return the converted number value (e.g. 15 mL)
     * @throws an error if the dimension of the toUnit differs from this unit's
     *   dimension
     */
    convertTo(i, n) {
      return n.convertFrom(i, this);
    }
    // end convertTo
    /**
     * Takes a given number of this unit returns the number of this unit
     * if it is converted into a coherent unit.  Does not change this unit.
     *
     * If this is a coherent unit already, just gives back the number
     * passed in.
     *
     * @param num the number for the coherent version of this unit
     * @return the number for the coherent version of this unit
     */
    convertCoherent(i) {
      return this.cnv_ !== null && (i = this.cnv_.f_from(i / this.cnvPfx_) * this.magnitude_), i;
    }
    // end convertCoherent
    /**
     * Mutates this unit into a coherent unit and converts a given number of
     * units to the appropriate value for this unit as a coherent unit
     *
     * @param num the number for this unit before conversion
     * @return the number of this unit after conversion
     * @throws an error if the dimensions differ
     */
    mutateCoherent(i) {
      i = this.convertCoherent(i), this.magnitude_ = 1, this.cnv_ = null, this.cnvPfx_ = 1, this.name_ = "";
      for (let n = 0, o = e.getMax(); n < o; n++) {
        let m = this.dim_.getElementAt(n), d = this._getUnitTables().getUnitsByDimension(new e(n));
        if (d == null) throw new Error(`Can't find base unit for dimension ${n}`);
        this.name_ = d.name + m;
      }
      return i;
    }
    // end mutateCoherent
    /**
     * Calculates the number of units that would result from converting a unit
     * expressed in mass/grams to a unit expressed in moles.  The "this" unit is
     * the unit expressed in some form of mass (g, mg, mmg, kg, whatever) and the
     * target or "to" unit - the molUnit parameter - is a unit expressed in moles
     * - mol, umol, mmol, etc.  The unit expressions surrounding the moles and
     * mass must be convertible.  No validation of this requirement is performed.
     *
     * @param amt the quantity of this unit to be converted
     * @param molUnit the target/to unit for which the converted # is wanted
     * @param molecularWeight the molecular weight of the substance for which the
     *  conversion is being made
     * @return the equivalent amount in molUnit
     */
    convertMassToMol(i, n, o) {
      let m = this.magnitude_ * i / o, d = this._getUnitTables().getUnitByCode("mol").magnitude_, h = n.magnitude_ / d;
      return m / h;
    }
    /**
     * Calculates the number of units that would result from converting a unit
     * expressed in moles to a unit expressed in mass (grams).  The "this" unit
     * is the unit expressed in some form of moles, e.g., mol, umol, mmol, etc.,
     * and the target or "to" unit is a unit expressed in some form of mass, e.g.,
     * g, mg, mmg, kg, etc.  Any unit expressions surrounding the moles and mass
     * must be convertible. No validation of this requirement is performed.
     *
     * @param amt the quantity of this unit to be converted
     * @param massUnit the target/to unit for which the converted # is wanted
     * @param molecularWeight the molecular weight of the substance for which the
     *  conversion is being made
     * @return the equivalent amount in massUnit
     */
    convertMolToMass(i, n, o) {
      let c = this._getUnitTables().getUnitByCode("mol").magnitude_;
      return this.magnitude_ / c * i * o / n.magnitude_;
    }
    /**
     * Mutates this unit into a unit on a ratio scale and converts a specified
     * number of units to an appropriate value for this converted unit
     *
     * @param num the number of this unit before it's converted
     * @return the magnitude of this unit after it's converted
     * @throw an error if the dimensions differ
     */
    mutateRatio(i) {
      return this.cnv_ == null ? this.mutateCoherent(i) : i;
    }
    // end mutateRatio
    /**
     * Multiplies this unit with a scalar. Special meaning for
     * special units so that (0.1*B) is 1 dB.
     *
     * This function DOES NOT modify this unit.
     *
     * @param s the value by which this unit is to be multiplied
     * @return a copy this unit multiplied by s
     * */
    multiplyThis(i) {
      let n = this.clone();
      n.cnv_ != null ? n.cnvPfx_ *= i : n.magnitude_ *= i;
      let o = i.toString();
      return n.name_ = this._concatStrs(o, "*", this.name_, "[", "]"), n.csCode_ = this._concatStrs(o, ".", this.csCode_, "(", ")"), n.ciCode_ = this._concatStrs(o, ".", this.ciCode_, "(", ")"), n.printSymbol_ = this._concatStrs(o, ".", this.printSymbol_, "(", ")"), n;
    }
    // end multiplyThis
    /**
     * Multiplies this unit with another unit. If one of the
     * units is a non-ratio unit the other must be dimensionless or
     * else an exception is thrown.
     *
     * This function does NOT modify this unit
     * @param unit2 the unit to be multiplied with this one
     * @return this unit after it is multiplied
     * @throws an error if one of the units is not on a ratio-scale
     *         and the other is not dimensionless.
     */
    multiplyThese(i) {
      var n = this.clone();
      if (n.cnv_ != null)
        if (i.cnv_ == null && (!i.dim_ || i.dim_.isZero())) n.cnvPfx_ *= i.magnitude_;
        else throw new Error(`Attempt to multiply non-ratio unit ${n.name_} failed.`);
      else if (i.cnv_ != null)
        if (!n.dim_ || n.dim_.isZero())
          n.cnvPfx_ = i.cnvPfx_ * n.magnitude_, n.magnitude_ = i.magnitude_, n.cnv_ = i.cnv_;
        else throw new Error(`Attempt to multiply non-ratio unit ${i.name_}`);
      else
        n.magnitude_ *= i.magnitude_;
      return !n.dim_ || n.dim_ && !n.dim_.dimVec_ ? i.dim_ ? n.dim_ = i.dim_.clone() : n.dim_ = i.dim_ : i.dim_ && i.dim_ instanceof e && n.dim_.add(i.dim_), n.name_ = this._concatStrs(n.name_, "*", i.name_, "[", "]"), n.csCode_ = this._concatStrs(n.csCode_, ".", i.csCode_, "(", ")"), n.ciCode_ && i.ciCode_ ? n.ciCode_ = this._concatStrs(n.ciCode_, ".", i.ciCode_, "(", ")") : i.ciCode_ && (n.ciCode_ = i.ciCode_), n.resetFieldsForDerivedUnit(), n.printSymbol_ && i.printSymbol_ ? n.printSymbol_ = this._concatStrs(n.printSymbol_, ".", i.printSymbol_, "(", ")") : i.printSymbol_ && (n.printSymbol_ = i.printSymbol_), n.moleExp_ = n.moleExp_ + i.moleExp_, n.isArbitrary_ || (n.isArbitrary_ = i.isArbitrary_), n.isSpecial_ || (n.isSpecial_ = i.isSpecial_), n;
    }
    // end multiplyThese
    /**
     *  Clears fields like isBase_, synonyms_, etc. when a unit has been cloned
     *  from a known unit but it being used to construct a derived unit.
     */
    resetFieldsForDerivedUnit() {
      this.guidance_ = "", this.synonyms_ = null, this.isBase_ = !1;
    }
    /**
     * Divides this unit by another unit. If this unit is not on a ratio
     * scale an exception is raised. Mutating to a ratio scale unit
     * is not possible for a unit, only for a measurement.
     *
     * This unit is NOT modified by this function.
     * @param unit2 the unit by which to divide this one
     * @return this unit after it is divided by unit2
     * @throws an error if either of the units is not on a ratio scale.
     * */
    divide(i) {
      var n = this.clone();
      if (n.cnv_ != null) throw new Error(`Attempt to divide non-ratio unit ${n.name_}`);
      if (i.cnv_ != null) throw new Error(`Attempt to divide by non-ratio unit ${i.name_}`);
      return n.name_ && i.name_ ? n.name_ = this._concatStrs(n.name_, "/", i.name_, "[", "]") : i.name_ && (n.name_ = i.invertString(i.name_)), n.csCode_ = this._concatStrs(n.csCode_, "/", i.csCode_, "(", ")"), n.ciCode_ && i.ciCode_ ? n.ciCode_ = this._concatStrs(n.ciCode_, "/", i.ciCode_, "(", ")") : i.ciCode_ && (n.ciCode_ = i.invertString(i.ciCode_)), n.resetFieldsForDerivedUnit(), n.magnitude_ /= i.magnitude_, n.printSymbol_ && i.printSymbol_ ? n.printSymbol_ = this._concatStrs(n.printSymbol_, "/", i.printSymbol_, "(", ")") : i.printSymbol_ && (n.printSymbol_ = i.invertString(i.printSymbol_)), i.dim_ && (n.dim_ ? (n.dim_.isNull() && n.dim_.assignZero(), n.dim_ = n.dim_.sub(i.dim_)) : n.dim_ = i.dim_.clone().minus()), n.moleExp_ = n.moleExp_ - i.moleExp_, n.isArbitrary_ || (n.isArbitrary_ = i.isArbitrary_), n;
    }
    // end divide
    /**
     * Invert this unit with respect to multiplication. If this unit is not
     * on a ratio scale an exception is thrown. Mutating to a ratio scale unit
     * is not possible for a unit, only for a measurement (the magnitude and
     * dimension).
     *
     *  This unit is modified by this function.
     * @return this unit after being inverted
     * @throws and error if this unit is not on a ratio scale
     */
    invert() {
      if (this.cnv_ != null) throw new Error(`Attempt to invert a non-ratio unit - ${this.name_}`);
      return this.name_ = this.invertString(this.name_), this.magnitude_ = 1 / this.magnitude_, this.dim_.minus(), this;
    }
    // end invert
    /**
     * Inverts a string, where the string is assumed to be a code or a name
     * of a division operation where the string is the divisor and the dividend
     * is blank.
     *
     * @param the string to be inverted
     * @return the inverted string
     */
    invertString(i) {
      if (i.length > 0) {
        let n = i.replace("/", "!").replace(".", "/").replace("<!", "</").replace("!", ".");
        switch (n.charAt(0)) {
          case ".":
            i = n.substr(1);
            break;
          case "/":
            i = n;
            break;
          default:
            i = "/" + n;
        }
      }
      return i;
    }
    // end invertString
    /**
     * This function handles concatenation of two strings and an operator.
     * It's called to build unit data, e.g., unit name, unit code, etc., from
     * two different units, joined by the specified operator.
     *
     * @param str1 the first string to appear in the result
     * @param operator the operator ('*', '.' or '/') to appear between the strings
     * @param str2 the second string to appear in the result
     * @param startChar the starting character to be used, when needed, to
     *  enclose a string
     * @param endChar the ending character to be used, when needed, to enclose
     *  a string
     * @returns the built string
     */
    _concatStrs(i, n, o, m, c) {
      return this._buildOneString(i, m, c) + n + this._buildOneString(o, m, c);
    }
    /**
     * This function handles creation of one string to be included in a
     * concatenated string.   Basically it checks to see if the string
     * needs to be enclosed either in parentheses or square brackets.
     *
     * The string is enclosed if it is not a number, is not already enclosed in a pair of
     * parentheses or square brackets, and includes a period, and asterisk,
     * a slash or a blank space.
     *
     * @param str the string
     * @param startChar starting enclosing character
     * @param endChar ending enclosing character
     * @returns the string
     */
    _buildOneString(i, n, o) {
      let m = "";
      return C.isNumericString(i) || i.charAt(0) === "(" && i.endsWith(")") || i.charAt(0) === "[" && i.endsWith("]") ? m = i : /[./* ]/.test(i) ? m = n + i + o : m = i, m;
    }
    /**
     * Raises the unit to a power.  For example
     *  kg.m/s2 raised to the -2 power would be kg-2.m-2/s-4
     *
     * If this unit is not on a ratio scale an error is thrown. Mutating
     * to a ratio scale unit is not possible for a unit, only for a
     * measurement (magnitude and dimension).
     *
     * This is based on the pow method in Gunter Schadow's java version,
     * although it uses javascript capabilities to simplify the processing.
     *
     * This unit is modified by this function
     *
     * @param p the power to with this unit is to be raise
     * @return this unit after it is raised
     * @throws an error if this unit is not on a ratio scale.
     */
    power(i) {
      if (this.cnv_ != null) throw new Error(`Attempt to raise a non-ratio unit, ${this.name_}, to a power.`);
      let o = this.csCode_.match(/([./]|[^./]+)/g), m = o.length;
      for (let c = 0; c < m; c++) {
        let d = o[c];
        if (d !== "/" && d !== ".") {
          let h = parseInt(d);
          if (u(h)) o[c] = Math.pow(h, i).toString();
          else {
            let _ = d.length;
            for (let T = _ - 1; T >= 0; T--) {
              let M = parseInt(d[T]);
              if (!u(M)) {
                if ((d[T] === "-" || d[T] === "+") && T--, T < _ - 1) {
                  let P = parseInt(d.substr(T));
                  P = Math.pow(P, i), o[c] = d.substr(0, T) + P.toString(), T = -1;
                } else
                  o[c] += i.toString(), T = -1;
                T = -1;
              }
            }
          }
        }
      }
      return this.csCode_ = o.join(""), this.magnitude_ = Math.pow(this.magnitude_, i), this.dim_ && this.dim_.mul(i), this;
    }
    // end power
    /*
     * This function tests this unit against the unit passed in to see if the
     * two are mole to mass commensurable.  It assumes that one of the units
     * is a mole-based unit and the other is a mass-based unit.  It also assumes
     * that the mole-based unit has a single mole unit in the numerator and that
     * the mass-based unit has a single mass unit in the numerator.  It does NOT
     * check to validate those assumptions.
     *
     * The check is made by setting the dimension vector element corresponding
     * to the base mass unit (gram) in the mole unit, and then comparing the
     * two dimension vectors.  If they match, the units are commensurable.
     * Otherwise they are not.
     *
     * @param unit2 the unit to be compared to this one
     * @returns boolean indicating commensurability
     */
    isMoleMassCommensurable(i) {
      let o = this._getUnitTables().getMassDimensionIndex(), m = !1;
      if (this.moleExp_ === 1 && i.moleExp_ === 0) {
        let c = this.dim_.clone(), d = c.getElementAt(o);
        c.setElementAt(o, d + this.moleExp_), m = c.equals(i.dim_);
      } else if (i.moleExp_ === 1 && this.moleExp_ === 0) {
        let c = i.dim_.clone(), d = c.getElementAt(o);
        c.setElementAt(o, d + i.moleExp_), m = c.equals(this.dim_);
      }
      return m;
    }
    /**
     * This returns the UnitTables singleton object.  Including the require
     * statement included here causes a circular dependency condition that
     * resulted in the UnitTables object not being defined for the Unit object.
     * sigh.  Thanks, Paul, for figuring this out.
     *
     * @private
     */
    _getUnitTables() {
      return a || (a = Ae().UnitTables), a.getInstance();
    }
  }
  return Pe.Unit = s, Pe;
}
var Be = {}, Xl;
function Hs() {
  if (Xl) return Be;
  Xl = 1, Object.defineProperty(Be, "__esModule", {
    value: !0
  }), Be.packArray = e, Be.unpackArray = a;
  const f = Array.prototype.push;
  function C(u) {
    return Object.prototype.toString.call(u) === "[object Object]";
  }
  function y(u) {
    return Object.keys(u).reduce((s, t) => (C(u[t]) ? f.apply(s, y(u[t]).map((i) => [t, ...[].concat(i)])) : s.push(t), s), []);
  }
  function p(u) {
    return u.map((s) => Array.isArray(s) ? s : [s]);
  }
  function l(u, s) {
    if (u.join() !== p(y(s)).join())
      throw new Error("Object of unusual structure");
    return u.map((t) => {
      let i = s;
      return t.forEach((n) => {
        if (i = i[n], i === void 0)
          throw new Error("Object of unusual structure");
      }), i;
    });
  }
  function r(u, s) {
    let t = {};
    return u.forEach((i, n) => {
      let o = t;
      for (let m = 0; m < i.length - 1; m++)
        o = o[i[m]] = o[i[m]] || {};
      o[i[i.length - 1]] = s[n];
    }), t;
  }
  function e(u) {
    if (u && u.length) {
      const s = y(u[0]), t = p(s);
      if (s.length)
        return {
          config: s,
          data: u.map(l.bind(null, t))
        };
    }
    return {
      config: [],
      data: u
    };
  }
  function a(u) {
    const s = u && u.config;
    if (s)
      if (s.length && u.data) {
        const t = p(s);
        return u.data.map(r.bind(null, t));
      } else
        return u.data;
    return u;
  }
  return Be;
}
const Vs = { config: ["code_", "ciCode_", "name_", "printSymbol_", "value_", "exp_"], data: [["E", "EX", "exa", "E", 1e18, "18"], ["G", "GA", "giga", "G", 1e9, "9"], ["Gi", "GIB", "gibi", "Gi", 1073741824, null], ["Ki", "KIB", "kibi", "Ki", 1024, null], ["M", "MA", "mega", "M", 1e6, "6"], ["Mi", "MIB", "mebi", "Mi", 1048576, null], ["P", "PT", "peta", "P", 1e15, "15"], ["T", "TR", "tera", "T", 1e12, "12"], ["Ti", "TIB", "tebi", "Ti", 1099511627776, null], ["Y", "YA", "yotta", "Y", 1e24, "24"], ["Z", "ZA", "zetta", "Z", 1e21, "21"], ["a", "A", "atto", "a", 1e-18, "-18"], ["c", "C", "centi", "c", 0.01, "-2"], ["d", "D", "deci", "d", 0.1, "-1"], ["da", "DA", "deka", "da", 10, "1"], ["f", "F", "femto", "f", 1e-15, "-15"], ["h", "H", "hecto", "h", 100, "2"], ["k", "K", "kilo", "k", 1e3, "3"], ["m", "M", "milli", "m", 1e-3, "-3"], ["n", "N", "nano", "n", 1e-9, "-9"], ["p", "P", "pico", "p", 1e-12, "-12"], ["u", "U", "micro", "μ", 1e-6, "-6"], ["y", "YO", "yocto", "y", 1e-24, "-24"], ["z", "ZO", "zepto", "z", 1e-21, "-21"]] }, Gs = /* @__PURE__ */ JSON.parse(`{"config":["isBase_","name_","csCode_","ciCode_","property_","magnitude_",["dim_","dimVec_"],"printSymbol_","class_","isMetric_","variable_","cnv_","cnvPfx_","isSpecial_","isArbitrary_","moleExp_","synonyms_","source_","loincProperty_","category_","guidance_","csUnitString_","ciUnitString_","baseFactorStr_","baseFactor_","defError_"],"data":[[true,"meter","m","M","length",1,[1,0,0,0,0,0,0],"m",null,false,"L",null,1,false,false,0,"meters; metres; distance","UCUM","Len","Clinical","unit of length = 1.09361 yards",null,null,null,null,false],[true,"second - time","s","S","time",1,[0,1,0,0,0,0,0],"s",null,false,"T",null,1,false,false,0,"seconds","UCUM","Time","Clinical","",null,null,null,null,false],[true,"gram","g","G","mass",1,[0,0,1,0,0,0,0],"g",null,false,"M",null,1,false,false,0,"grams; gm","UCUM","Mass","Clinical","",null,null,null,null,false],[true,"radian","rad","RAD","plane angle",1,[0,0,0,1,0,0,0],"rad",null,false,"A",null,1,false,false,0,"radians","UCUM","Angle","Clinical","unit of angular measure where 1 radian = 1/2π turn =  57.296 degrees. ",null,null,null,null,false],[true,"degree Kelvin","K","K","temperature",1,[0,0,0,0,1,0,0],"K",null,false,"C",null,1,false,false,0,"Kelvin; degrees","UCUM","Temp","Clinical","absolute, thermodynamic temperature scale ",null,null,null,null,false],[true,"coulomb","C","C","electric charge",1,[0,0,0,0,0,1,0],"C",null,false,"Q",null,1,false,false,0,"coulombs","UCUM","","Clinical","defined as amount of 1 electron charge = 6.2415093×10^18 e, and equivalent to 1 Ampere-second",null,null,null,null,false],[true,"candela","cd","CD","luminous intensity",1,[0,0,0,0,0,0,1],"cd",null,false,"F",null,1,false,false,0,"candelas","UCUM","","Clinical","SI base unit of luminous intensity",null,null,null,null,false],[false,"the number ten for arbitrary powers","10*","10*","number",10,[0,0,0,0,0,0,0],"10","dimless",false,null,null,1,false,false,0,"10^; 10 to the arbitrary powers","UCUM","Num","Clinical","10* by itself is the same as 10, but users can add digits after the *. For example, 10*3 = 1000.","1","1","10",10,false],[false,"the number ten for arbitrary powers","10^","10^","number",10,[0,0,0,0,0,0,0],"10","dimless",false,null,null,1,false,false,0,"10*; 10 to the arbitrary power","UCUM","Num","Clinical","10* by itself is the same as 10, but users can add digits after the *. For example, 10*3 = 1000.","1","1","10",10,false],[false,"the number pi","[pi]","[PI]","number",3.141592653589793,[0,0,0,0,0,0,0],"π","dimless",false,null,null,1,false,false,0,"π","UCUM","","Constant","a mathematical constant; the ratio of a circle's circumference to its diameter ≈ 3.14159","1","1","3.1415926535897932384626433832795028841971693993751058209749445923",3.141592653589793,false],[false,"","%","%","fraction",0.01,[0,0,0,0,0,0,0],"%","dimless",false,null,null,1,false,false,0,"percents","UCUM","FR; NFR; MFR; CFR; SFR Rto; etc. ","Clinical","","10*-2","10*-2","1",1,false],[false,"parts per thousand","[ppth]","[PPTH]","fraction",0.001,[0,0,0,0,0,0,0],"ppth","dimless",false,null,null,1,false,false,0,"ppth; 10^-3","UCUM","MCnc; MCnt","Clinical","[ppth] is often used in solution concentrations as 1 g/L or 1 g/kg.\\n\\nCan be ambigous and would be better if the metric units was used directly. ","10*-3","10*-3","1",1,false],[false,"parts per million","[ppm]","[PPM]","fraction",0.000001,[0,0,0,0,0,0,0],"ppm","dimless",false,null,null,1,false,false,0,"ppm; 10^-6","UCUM","MCnt; MCnc; SFr","Clinical","[ppm] is often used in solution concentrations as 1 mg/L  or 1 mg/kg. Also used to express mole fractions as 1 mmol/mol.\\n\\n[ppm] is also used in nuclear magnetic resonance (NMR) to represent chemical shift - the difference of a measured frequency in parts per million from the reference frequency.\\n\\nCan be ambigous and would be better if the metric units was used directly. ","10*-6","10*-6","1",1,false],[false,"parts per billion","[ppb]","[PPB]","fraction",1e-9,[0,0,0,0,0,0,0],"ppb","dimless",false,null,null,1,false,false,0,"ppb; 10^-9","UCUM","MCnt; MCnc; SFr","Clinical","[ppb] is often used in solution concentrations as 1 ug/L  or 1 ug/kg. Also used to express mole fractions as 1 umol/mol.\\n\\nCan be ambigous and would be better if the metric units was used directly. ","10*-9","10*-9","1",1,false],[false,"parts per trillion","[pptr]","[PPTR]","fraction",1e-12,[0,0,0,0,0,0,0],"pptr","dimless",false,null,null,1,false,false,0,"pptr; 10^-12","UCUM","MCnt; MCnc; SFr","Clinical","[pptr] is often used in solution concentrations as 1 ng/L or 1 ng/kg. Also used to express mole fractions as 1 nmol/mol.\\n\\nCan be ambigous and would be better if the metric units was used directly. ","10*-12","10*-12","1",1,false],[false,"mole","mol","MOL","amount of substance",6.0221367e+23,[0,0,0,0,0,0,0],"mol","si",true,null,null,1,false,false,1,"moles","UCUM","Sub","Clinical","Measure the number of molecules ","10*23","10*23","6.0221367",6.0221367,false],[false,"steradian - solid angle","sr","SR","solid angle",1,[0,0,0,2,0,0,0],"sr","si",true,null,null,1,false,false,0,"square radian; rad2; rad^2","UCUM","Angle","Clinical","unit of solid angle in three-dimensional geometry analagous to radian; used in photometry which measures the perceived brightness of object by human eye (e.g. radiant intensity = watt/steradian)","rad2","RAD2","1",1,false],[false,"hertz","Hz","HZ","frequency",1,[0,-1,0,0,0,0,0],"Hz","si",true,null,null,1,false,false,0,"Herz; frequency; frequencies","UCUM","Freq; Num","Clinical","equal to one cycle per second","s-1","S-1","1",1,false],[false,"newton","N","N","force",1000,[1,-2,1,0,0,0,0],"N","si",true,null,null,1,false,false,0,"Newtons","UCUM","Force","Clinical","unit of force with base units kg.m/s2","kg.m/s2","KG.M/S2","1",1,false],[false,"pascal","Pa","PAL","pressure",1000,[-1,-2,1,0,0,0,0],"Pa","si",true,null,null,1,false,false,0,"pascals","UCUM","Pres","Clinical","standard unit of pressure equal to 1 newton per square meter (N/m2)","N/m2","N/M2","1",1,false],[false,"joule","J","J","energy",1000,[2,-2,1,0,0,0,0],"J","si",true,null,null,1,false,false,0,"joules","UCUM","Enrg","Clinical","unit of energy defined as the work required to move an object 1 m with a force of 1 N (N.m) or an electric charge of 1 C through 1 V (C.V), or to produce 1 W for 1 s (W.s) ","N.m","N.M","1",1,false],[false,"watt","W","W","power",1000,[2,-3,1,0,0,0,0],"W","si",true,null,null,1,false,false,0,"watts","UCUM","EngRat","Clinical","unit of power equal to 1 Joule per second (J/s) =  kg⋅m2⋅s−3","J/s","J/S","1",1,false],[false,"Ampere","A","A","electric current",1,[0,-1,0,0,0,1,0],"A","si",true,null,null,1,false,false,0,"Amperes","UCUM","ElpotRat","Clinical","unit of electric current equal to flow rate of electrons equal to 6.2415×10^18 elementary charges moving past a boundary in one second or 1 Coulomb/second","C/s","C/S","1",1,false],[false,"volt","V","V","electric potential",1000,[2,-2,1,0,0,-1,0],"V","si",true,null,null,1,false,false,0,"volts","UCUM","Elpot","Clinical","unit of electric potential (voltage) = 1 Joule per Coulomb (J/C)","J/C","J/C","1",1,false],[false,"farad","F","F","electric capacitance",0.001,[-2,2,-1,0,0,2,0],"F","si",true,null,null,1,false,false,0,"farads; electric capacitance","UCUM","","Clinical","CGS unit of electric capacitance with base units C/V (Coulomb per Volt)","C/V","C/V","1",1,false],[false,"ohm","Ohm","OHM","electric resistance",1000,[2,-1,1,0,0,-2,0],"Ω","si",true,null,null,1,false,false,0,"Ω; resistance; ohms","UCUM","","Clinical","unit of electrical resistance with units of Volt per Ampere","V/A","V/A","1",1,false],[false,"siemens","S","SIE","electric conductance",0.001,[-2,1,-1,0,0,2,0],"S","si",true,null,null,1,false,false,0,"Reciprocal ohm; mho; Ω−1; conductance","UCUM","","Clinical","unit of electric conductance (the inverse of electrical resistance) equal to ohm^-1","Ohm-1","OHM-1","1",1,false],[false,"weber","Wb","WB","magnetic flux",1000,[2,-1,1,0,0,-1,0],"Wb","si",true,null,null,1,false,false,0,"magnetic flux; webers","UCUM","","Clinical","unit of magnetic flux equal to Volt second","V.s","V.S","1",1,false],[false,"degree Celsius","Cel","CEL","temperature",1,[0,0,0,0,1,0,0],"°C","si",true,null,"Cel",1,true,false,0,"°C; degrees","UCUM","Temp","Clinical","","K",null,null,1,false],[false,"tesla","T","T","magnetic flux density",1000,[0,-1,1,0,0,-1,0],"T","si",true,null,null,1,false,false,0,"Teslas; magnetic field","UCUM","","Clinical","SI unit of magnetic field strength for magnetic field B equal to 1 Weber/square meter =  1 kg/(s2*A)","Wb/m2","WB/M2","1",1,false],[false,"henry","H","H","inductance",1000,[2,0,1,0,0,-2,0],"H","si",true,null,null,1,false,false,0,"henries; inductance","UCUM","","Clinical","unit of electrical inductance; usually expressed in millihenrys (mH) or microhenrys (uH).","Wb/A","WB/A","1",1,false],[false,"lumen","lm","LM","luminous flux",1,[0,0,0,2,0,0,1],"lm","si",true,null,null,1,false,false,0,"luminous flux; lumens","UCUM","","Clinical","unit of luminous flux defined as 1 lm = 1 cd⋅sr (candela times sphere)","cd.sr","CD.SR","1",1,false],[false,"lux","lx","LX","illuminance",1,[-2,0,0,2,0,0,1],"lx","si",true,null,null,1,false,false,0,"illuminance; luxes","UCUM","","Clinical","unit of illuminance equal to one lumen per square meter. ","lm/m2","LM/M2","1",1,false],[false,"becquerel","Bq","BQ","radioactivity",1,[0,-1,0,0,0,0,0],"Bq","si",true,null,null,1,false,false,0,"activity; radiation; becquerels","UCUM","","Clinical","measure of the atomic radiation rate with units s^-1","s-1","S-1","1",1,false],[false,"gray","Gy","GY","energy dose",1,[2,-2,0,0,0,0,0],"Gy","si",true,null,null,1,false,false,0,"absorbed doses; ionizing radiation doses; kerma; grays","UCUM","EngCnt","Clinical","unit of ionizing radiation dose with base units of 1 joule of radiation energy per kilogram of matter","J/kg","J/KG","1",1,false],[false,"sievert","Sv","SV","dose equivalent",1,[2,-2,0,0,0,0,0],"Sv","si",true,null,null,1,false,false,0,"sieverts; radiation dose quantities; equivalent doses; effective dose; operational dose; committed dose","UCUM","","Clinical","SI unit for radiation dose equivalent equal to 1 Joule/kilogram.","J/kg","J/KG","1",1,false],[false,"degree - plane angle","deg","DEG","plane angle",0.017453292519943295,[0,0,0,1,0,0,0],"°","iso1000",false,null,null,1,false,false,0,"°; degree of arc; arc degree; arcdegree; angle","UCUM","Angle","Clinical","one degree is equivalent to π/180 radians.","[pi].rad/360","[PI].RAD/360","2",2,false],[false,"gon","gon","GON","plane angle",0.015707963267948967,[0,0,0,1,0,0,0],"□<sup>g</sup>","iso1000",false,null,null,1,false,false,0,"gon (grade); gons","UCUM","Angle","Nonclinical","unit of plane angle measurement equal to 1/400 circle","deg","DEG","0.9",0.9,false],[false,"arc minute","'","'","plane angle",0.0002908882086657216,[0,0,0,1,0,0,0],"'","iso1000",false,null,null,1,false,false,0,"arcminutes; arcmin; arc minutes; arc mins","UCUM","Angle","Clinical","equal to 1/60 degree; used in optometry and opthamology (e.g. visual acuity tests)","deg/60","DEG/60","1",1,false],[false,"arc second","''","''","plane angle",0.00000484813681109536,[0,0,0,1,0,0,0],"''","iso1000",false,null,null,1,false,false,0,"arcseconds; arcsecs","UCUM","Angle","Clinical","equal to 1/60 arcminute = 1/3600 degree; used in optometry and opthamology (e.g. visual acuity tests)","'/60","'/60","1",1,false],[false,"Liters","l","L","volume",0.001,[3,0,0,0,0,0,0],"l","iso1000",true,null,null,1,false,false,0,"cubic decimeters; decimeters cubed; decimetres; dm3; dm^3; litres; liters, LT ","UCUM","Vol","Clinical","Because lower case \\"l\\" can be read as the number \\"1\\", though this is a valid UCUM units. UCUM strongly reccomends using  \\"L\\"","dm3","DM3","1",1,false],[false,"Liters","L","L","volume",0.001,[3,0,0,0,0,0,0],"L","iso1000",true,null,null,1,false,false,0,"cubic decimeters; decimeters cubed; decimetres; dm3; dm^3; litres; liters, LT ","UCUM","Vol","Clinical","Because lower case \\"l\\" can be read as the number \\"1\\", though this is a valid UCUM units. UCUM strongly reccomends using  \\"L\\"","l",null,"1",1,false],[false,"are","ar","AR","area",100,[2,0,0,0,0,0,0],"a","iso1000",true,null,null,1,false,false,0,"100 m2; 100 m^2; 100 square meter; meters squared; metres","UCUM","Area","Clinical","metric base unit for area defined as 100 m^2","m2","M2","100",100,false],[false,"minute","min","MIN","time",60,[0,1,0,0,0,0,0],"min","iso1000",false,null,null,1,false,false,0,"minutes","UCUM","Time","Clinical","","s","S","60",60,false],[false,"hour","h","HR","time",3600,[0,1,0,0,0,0,0],"h","iso1000",false,null,null,1,false,false,0,"hours; hrs; age","UCUM","Time","Clinical","","min","MIN","60",60,false],[false,"day","d","D","time",86400,[0,1,0,0,0,0,0],"d","iso1000",false,null,null,1,false,false,0,"days; age; dy; 24 hours; 24 hrs","UCUM","Time","Clinical","","h","HR","24",24,false],[false,"tropical year","a_t","ANN_T","time",31556925.216,[0,1,0,0,0,0,0],"a<sub>t</sub>","iso1000",false,null,null,1,false,false,0,"solar years; a tropical; years","UCUM","Time","Clinical","has an average of 365.242181 days but is constantly changing.","d","D","365.24219",365.24219,false],[false,"mean Julian year","a_j","ANN_J","time",31557600,[0,1,0,0,0,0,0],"a<sub>j</sub>","iso1000",false,null,null,1,false,false,0,"mean Julian yr; a julian; years","UCUM","Time","Clinical","has an average of 365.25 days, and in everyday use, has been replaced by the Gregorian year. However, this unit is used in astronomy to calculate light year. ","d","D","365.25",365.25,false],[false,"mean Gregorian year","a_g","ANN_G","time",31556952,[0,1,0,0,0,0,0],"a<sub>g</sub>","iso1000",false,null,null,1,false,false,0,"mean Gregorian yr; a gregorian; years","UCUM","Time","Clinical","has an average of 365.2425 days and is the most internationally used civil calendar.","d","D","365.2425",365.2425,false],[false,"year","a","ANN","time",31557600,[0,1,0,0,0,0,0],"a","iso1000",false,null,null,1,false,false,0,"years; a; yr, yrs; annum","UCUM","Time","Clinical","","a_j","ANN_J","1",1,false],[false,"week","wk","WK","time",604800,[0,1,0,0,0,0,0],"wk","iso1000",false,null,null,1,false,false,0,"weeks; wks","UCUM","Time","Clinical","","d","D","7",7,false],[false,"synodal month","mo_s","MO_S","time",2551442.976,[0,1,0,0,0,0,0],"mo<sub>s</sub>","iso1000",false,null,null,1,false,false,0,"Moon; synodic month; lunar month; mo-s; mo s; months; moons","UCUM","Time","Nonclinical","has an average of 29.53 days per month, unit used in astronomy","d","D","29.53059",29.53059,false],[false,"mean Julian month","mo_j","MO_J","time",2629800,[0,1,0,0,0,0,0],"mo<sub>j</sub>","iso1000",false,null,null,1,false,false,0,"mo-julian; mo Julian; months","UCUM","Time","Clinical","has an average of 30.435 days per month","a_j/12","ANN_J/12","1",1,false],[false,"mean Gregorian month","mo_g","MO_G","time",2629746,[0,1,0,0,0,0,0],"mo<sub>g</sub>","iso1000",false,null,null,1,false,false,0,"months; month-gregorian; mo-gregorian","UCUM","Time","Clinical","has an average 30.436875 days per month and is from the most internationally used civil calendar.","a_g/12","ANN_G/12","1",1,false],[false,"month","mo","MO","time",2629800,[0,1,0,0,0,0,0],"mo","iso1000",false,null,null,1,false,false,0,"months; duration","UCUM","Time","Clinical","based on Julian calendar which has an average of 30.435 days per month (this unit is used in astronomy but not in everyday life - see mo_g)","mo_j","MO_J","1",1,false],[false,"metric ton","t","TNE","mass",1000000,[0,0,1,0,0,0,0],"t","iso1000",true,null,null,1,false,false,0,"tonnes; megagrams; tons","UCUM","Mass","Nonclinical","equal to 1000 kg used in the US (recognized by NIST as metric ton), and internationally (recognized as tonne)","kg","KG","1e3",1000,false],[false,"bar","bar","BAR","pressure",100000000,[-1,-2,1,0,0,0,0],"bar","iso1000",true,null,null,1,false,false,0,"bars","UCUM","Pres","Nonclinical","unit of pressure equal to 10^5 Pascals, primarily used by meteorologists and in weather forecasting","Pa","PAL","1e5",100000,false],[false,"unified atomic mass unit","u","AMU","mass",1.6605402e-24,[0,0,1,0,0,0,0],"u","iso1000",true,null,null,1,false,false,0,"unified atomic mass units; amu; Dalton; Da","UCUM","Mass","Clinical","the mass of 1/12 of an unbound Carbon-12 atom nuclide equal to 1.6606x10^-27 kg ","g","G","1.6605402e-24",1.6605402e-24,false],[false,"astronomic unit","AU","ASU","length",149597870691,[1,0,0,0,0,0,0],"AU","iso1000",false,null,null,1,false,false,0,"AU; units","UCUM","Len","Clinical","unit of length used in astronomy for measuring distance in Solar system","Mm","MAM","149597.870691",149597.870691,false],[false,"parsec","pc","PRS","length",30856780000000000,[1,0,0,0,0,0,0],"pc","iso1000",true,null,null,1,false,false,0,"parsecs","UCUM","Len","Clinical","unit of length equal to 3.26 light years, and used to measure large distances to objects outside our Solar System","m","M","3.085678e16",30856780000000000,false],[false,"velocity of light in a vacuum","[c]","[C]","velocity",299792458,[1,-1,0,0,0,0,0],"<i>c</i>","const",true,null,null,1,false,false,0,"speed of light","UCUM","Vel","Constant","equal to 299792458 m/s (approximately 3 x 10^8 m/s)","m/s","M/S","299792458",299792458,false],[false,"Planck constant","[h]","[H]","action",6.6260755e-31,[2,-1,1,0,0,0,0],"<i>h</i>","const",true,null,null,1,false,false,0,"Planck's constant","UCUM","","Constant","constant = 6.62607004 × 10-34 m2.kg/s; defined as quantum of action","J.s","J.S","6.6260755e-34",6.6260755e-34,false],[false,"Boltzmann constant","[k]","[K]","(unclassified)",1.380658e-20,[2,-2,1,0,-1,0,0],"<i>k</i>","const",true,null,null,1,false,false,0,"k; kB","UCUM","","Constant","physical constant relating energy at the individual particle level with temperature = 1.38064852 ×10^−23 J/K","J/K","J/K","1.380658e-23",1.380658e-23,false],[false,"permittivity of vacuum - electric","[eps_0]","[EPS_0]","electric permittivity",8.854187817000001e-15,[-3,2,-1,0,0,2,0],"<i>ε<sub><r>0</r></sub></i>","const",true,null,null,1,false,false,0,"ε0; Electric Constant; vacuum permittivity; permittivity of free space ","UCUM","","Constant","approximately equal to 8.854 × 10^−12 F/m (farads per meter)","F/m","F/M","8.854187817e-12",8.854187817e-12,false],[false,"permeability of vacuum - magnetic","[mu_0]","[MU_0]","magnetic permeability",0.0012566370614359172,[1,0,1,0,0,-2,0],"<i>μ<sub><r>0</r></sub></i>","const",true,null,null,1,false,false,0,"μ0; vacuum permeability; permeability of free space; magnetic constant","UCUM","","Constant","equal to 4π×10^−7 N/A2 (Newtons per square ampere) ≈ 1.2566×10^−6 H/m (Henry per meter)","N/A2","4.[PI].10*-7.N/A2","1",0.0000012566370614359173,false],[false,"elementary charge","[e]","[E]","electric charge",1.60217733e-19,[0,0,0,0,0,1,0],"<i>e</i>","const",true,null,null,1,false,false,0,"e; q; electric charges","UCUM","","Constant","the magnitude of the electric charge carried by a single electron or proton ≈ 1.60217×10^-19 Coulombs","C","C","1.60217733e-19",1.60217733e-19,false],[false,"electronvolt","eV","EV","energy",1.60217733e-16,[2,-2,1,0,0,0,0],"eV","iso1000",true,null,null,1,false,false,0,"Electron Volts; electronvolts","UCUM","Eng","Clinical","unit of kinetic energy = 1 V * 1.602×10^−19 C = 1.6×10−19 Joules","[e].V","[E].V","1",1,false],[false,"electron mass","[m_e]","[M_E]","mass",9.1093897e-28,[0,0,1,0,0,0,0],"<i>m<sub><r>e</r></sub></i>","const",true,null,null,1,false,false,0,"electron rest mass; me","UCUM","Mass","Constant","approximately equal to 9.10938356 × 10-31 kg; defined as the mass of a stationary electron","g","g","9.1093897e-28",9.1093897e-28,false],[false,"proton mass","[m_p]","[M_P]","mass",1.6726231e-24,[0,0,1,0,0,0,0],"<i>m<sub><r>p</r></sub></i>","const",true,null,null,1,false,false,0,"mp; masses","UCUM","Mass","Constant","approximately equal to 1.672622×10−27 kg","g","g","1.6726231e-24",1.6726231e-24,false],[false,"Newtonian constant of gravitation","[G]","[GC]","(unclassified)",6.67259e-14,[3,-2,-1,0,0,0,0],"<i>G</i>","const",true,null,null,1,false,false,0,"G; gravitational constant; Newton's constant","UCUM","","Constant","gravitational constant = 6.674×10−11 N⋅m2/kg2","m3.kg-1.s-2","M3.KG-1.S-2","6.67259e-11",6.67259e-11,false],[false,"standard acceleration of free fall","[g]","[G]","acceleration",9.80665,[1,-2,0,0,0,0,0],"<i>g<sub>n</sub></i>","const",true,null,null,1,false,false,0,"standard gravity; g; ɡ0; ɡn","UCUM","Accel","Constant","defined by standard = 9.80665 m/s2","m/s2","M/S2","980665e-5",9.80665,false],[false,"Torr","Torr","Torr","pressure",133322,[-1,-2,1,0,0,0,0],"Torr","const",false,null,null,1,false,false,0,"torrs","UCUM","Pres","Clinical","1 torr = 1 mmHg; unit used to measure blood pressure","Pa","PAL","133.322",133.322,false],[false,"standard atmosphere","atm","ATM","pressure",101325000,[-1,-2,1,0,0,0,0],"atm","const",false,null,null,1,false,false,0,"reference pressure; atmos; std atmosphere","UCUM","Pres","Clinical","defined as being precisely equal to 101,325 Pa","Pa","PAL","101325",101325,false],[false,"light-year","[ly]","[LY]","length",9460730472580800,[1,0,0,0,0,0,0],"l.y.","const",true,null,null,1,false,false,0,"light years; ly","UCUM","Len","Constant","unit of astronomal distance = 5.88×10^12 mi","[c].a_j","[C].ANN_J","1",1,false],[false,"gram-force","gf","GF","force",9.80665,[1,-2,1,0,0,0,0],"gf","const",true,null,null,1,false,false,0,"Newtons; gram forces","UCUM","Force","Clinical","May be specific to unit related to cardiac output","g.[g]","G.[G]","1",1,false],[false,"Kayser","Ky","KY","lineic number",100,[-1,0,0,0,0,0,0],"K","cgs",true,null,null,1,false,false,0,"wavenumbers; kaysers","UCUM","InvLen","Clinical","unit of wavelength equal to cm^-1","cm-1","CM-1","1",1,false],[false,"Gal","Gal","GL","acceleration",0.01,[1,-2,0,0,0,0,0],"Gal","cgs",true,null,null,1,false,false,0,"galileos; Gals","UCUM","Accel","Clinical","unit of acceleration used in gravimetry; equivalent to cm/s2 ","cm/s2","CM/S2","1",1,false],[false,"dyne","dyn","DYN","force",0.01,[1,-2,1,0,0,0,0],"dyn","cgs",true,null,null,1,false,false,0,"dynes","UCUM","Force","Clinical","unit of force equal to 10^-5 Newtons","g.cm/s2","G.CM/S2","1",1,false],[false,"erg","erg","ERG","energy",0.0001,[2,-2,1,0,0,0,0],"erg","cgs",true,null,null,1,false,false,0,"10^-7 Joules, 10-7 Joules; 100 nJ; 100 nanoJoules; 1 dyne cm; 1 g.cm2/s2","UCUM","Eng","Clinical","unit of energy = 1 dyne centimeter = 10^-7 Joules","dyn.cm","DYN.CM","1",1,false],[false,"Poise","P","P","dynamic viscosity",100.00000000000001,[-1,-1,1,0,0,0,0],"P","cgs",true,null,null,1,false,false,0,"dynamic viscosity; poises","UCUM","Visc","Clinical","unit of dynamic viscosity where 1 Poise = 1/10 Pascal second","dyn.s/cm2","DYN.S/CM2","1",1,false],[false,"Biot","Bi","BI","electric current",10,[0,-1,0,0,0,1,0],"Bi","cgs",true,null,null,1,false,false,0,"Bi; abamperes; abA","UCUM","ElpotRat","Clinical","equal to 10 amperes","A","A","10",10,false],[false,"Stokes","St","ST","kinematic viscosity",0.00009999999999999999,[2,-1,0,0,0,0,0],"St","cgs",true,null,null,1,false,false,0,"kinematic viscosity","UCUM","Visc","Clinical","unit of kimematic viscosity with units cm2/s","cm2/s","CM2/S","1",1,false],[false,"Maxwell","Mx","MX","flux of magnetic induction",0.00001,[2,-1,1,0,0,-1,0],"Mx","cgs",true,null,null,1,false,false,0,"magnetix flux; Maxwells","UCUM","","Clinical","unit of magnetic flux","Wb","WB","1e-8",1e-8,false],[false,"Gauss","G","GS","magnetic flux density",0.1,[0,-1,1,0,0,-1,0],"Gs","cgs",true,null,null,1,false,false,0,"magnetic fields; magnetic flux density; induction; B","UCUM","magnetic","Clinical","CGS unit of magnetic flux density, known as magnetic field B; defined as one maxwell unit per square centimeter (see Oersted for CGS unit for H field)","T","T","1e-4",0.0001,false],[false,"Oersted","Oe","OE","magnetic field intensity",79.57747154594767,[-1,-1,0,0,0,1,0],"Oe","cgs",true,null,null,1,false,false,0,"H magnetic B field; Oersteds","UCUM","","Clinical","CGS unit of the auxiliary magnetic field H defined as 1 dyne per unit pole = 1000/4π amperes per meter (see Gauss for CGS unit for B field)","A/m","/[PI].A/M","250",79.57747154594767,false],[false,"Gilbert","Gb","GB","magnetic tension",0.7957747154594768,[0,-1,0,0,0,1,0],"Gb","cgs",true,null,null,1,false,false,0,"Gi; magnetomotive force; Gilberts","UCUM","","Clinical","unit of magnetomotive force (magnetic potential)","Oe.cm","OE.CM","1",1,false],[false,"stilb","sb","SB","lum. intensity density",10000,[-2,0,0,0,0,0,1],"sb","cgs",true,null,null,1,false,false,0,"stilbs","UCUM","","Obsolete","unit of luminance; equal to and replaced by unit candela per square centimeter (cd/cm2)","cd/cm2","CD/CM2","1",1,false],[false,"Lambert","Lmb","LMB","brightness",3183.098861837907,[-2,0,0,0,0,0,1],"L","cgs",true,null,null,1,false,false,0,"luminance; lamberts","UCUM","","Clinical","unit of luminance defined as 1 lambert = 1/ π candela per square meter","cd/cm2/[pi]","CD/CM2/[PI]","1",1,false],[false,"phot","ph","PHT","illuminance",0.0001,[-2,0,0,2,0,0,1],"ph","cgs",true,null,null,1,false,false,0,"phots","UCUM","","Clinical","CGS photometric unit of illuminance, or luminous flux through an area equal to 10000 lumens per square meter = 10000 lux","lx","LX","1e-4",0.0001,false],[false,"Curie","Ci","CI","radioactivity",37000000000,[0,-1,0,0,0,0,0],"Ci","cgs",true,null,null,1,false,false,0,"curies","UCUM","","Obsolete","unit for measuring atomic disintegration rate; replaced by the Bequerel (Bq) unit","Bq","BQ","37e9",37000000000,false],[false,"Roentgen","R","ROE","ion dose",2.58e-7,[0,0,-1,0,0,1,0],"R","cgs",true,null,null,1,false,false,0,"röntgen; Roentgens","UCUM","","Clinical","unit of exposure of X-rays and gamma rays in air; unit used primarily in the US but strongly discouraged by NIST","C/kg","C/KG","2.58e-4",0.000258,false],[false,"radiation absorbed dose","RAD","[RAD]","energy dose",0.01,[2,-2,0,0,0,0,0],"RAD","cgs",true,null,null,1,false,false,0,"doses","UCUM","","Clinical","unit of radiation absorbed dose used primarily in the US with base units 100 ergs per gram of material. Also see the SI unit Gray (Gy).","erg/g","ERG/G","100",100,false],[false,"radiation equivalent man","REM","[REM]","dose equivalent",0.01,[2,-2,0,0,0,0,0],"REM","cgs",true,null,null,1,false,false,0,"Roentgen Equivalent in Man; rems; dose equivalents","UCUM","","Clinical","unit of equivalent dose which measures the effect of radiation on humans equal to 0.01 sievert. Used primarily in the US. Also see SI unit Sievert (Sv)","RAD","[RAD]","1",1,false],[false,"inch","[in_i]","[IN_I]","length",0.025400000000000002,[1,0,0,0,0,0,0],"in","intcust",false,null,null,1,false,false,0,"inches; in; international inch; body height","UCUM","Len","Clinical","standard unit for inch in the US and internationally","cm","CM","254e-2",2.54,false],[false,"foot","[ft_i]","[FT_I]","length",0.3048,[1,0,0,0,0,0,0],"ft","intcust",false,null,null,1,false,false,0,"ft; fts; foot; international foot; feet; international feet; height","UCUM","Len","Clinical","unit used in the US and internationally","[in_i]","[IN_I]","12",12,false],[false,"yard","[yd_i]","[YD_I]","length",0.9144000000000001,[1,0,0,0,0,0,0],"yd","intcust",false,null,null,1,false,false,0,"international yards; yds; distance","UCUM","Len","Clinical","standard unit used in the US and internationally","[ft_i]","[FT_I]","3",3,false],[false,"mile","[mi_i]","[MI_I]","length",1609.344,[1,0,0,0,0,0,0],"mi","intcust",false,null,null,1,false,false,0,"international miles; mi I; statute mile","UCUM","Len","Clinical","standard unit used in the US and internationally","[ft_i]","[FT_I]","5280",5280,false],[false,"fathom","[fth_i]","[FTH_I]","depth of water",1.8288000000000002,[1,0,0,0,0,0,0],"fth","intcust",false,null,null,1,false,false,0,"international fathoms","UCUM","Len","Nonclinical","unit used in the US and internationally to measure depth of water; same length as the US fathom","[ft_i]","[FT_I]","6",6,false],[false,"nautical mile","[nmi_i]","[NMI_I]","length",1852,[1,0,0,0,0,0,0],"n.mi","intcust",false,null,null,1,false,false,0,"nautical mile; nautical miles; international nautical mile; international nautical miles; nm; n.m.; nmi","UCUM","Len","Nonclinical","standard unit used in the US and internationally","m","M","1852",1852,false],[false,"knot","[kn_i]","[KN_I]","velocity",0.5144444444444445,[1,-1,0,0,0,0,0],"knot","intcust",false,null,null,1,false,false,0,"kn; kt; international knots","UCUM","Vel","Nonclinical","defined as equal to one nautical mile (1.852 km) per hour","[nmi_i]/h","[NMI_I]/H","1",1,false],[false,"square inch","[sin_i]","[SIN_I]","area",0.0006451600000000001,[2,0,0,0,0,0,0],null,"intcust",false,null,null,1,false,false,0,"in2; in^2; inches squared; sq inch; inches squared; international","UCUM","Area","Clinical","standard unit used in the US and internationally","[in_i]2","[IN_I]2","1",1,false],[false,"square foot","[sft_i]","[SFT_I]","area",0.09290304,[2,0,0,0,0,0,0],null,"intcust",false,null,null,1,false,false,0,"ft2; ft^2; ft squared; sq ft; feet; international","UCUM","Area","Clinical","standard unit used in the US and internationally","[ft_i]2","[FT_I]2","1",1,false],[false,"square yard","[syd_i]","[SYD_I]","area",0.8361273600000002,[2,0,0,0,0,0,0],null,"intcust",false,null,null,1,false,false,0,"yd2; yd^2; sq. yds; yards squared; international","UCUM","Area","Clinical","standard unit used in the US and internationally","[yd_i]2","[YD_I]2","1",1,false],[false,"cubic inch","[cin_i]","[CIN_I]","volume",0.000016387064000000006,[3,0,0,0,0,0,0],null,"intcust",false,null,null,1,false,false,0,"in3; in^3; in*3; inches^3; inches*3; cu. in; cu in; cubic inches; inches cubed; cin","UCUM","Vol","Clinical","standard unit used in the US and internationally","[in_i]3","[IN_I]3","1",1,false],[false,"cubic foot","[cft_i]","[CFT_I]","volume",0.028316846592000004,[3,0,0,0,0,0,0],null,"intcust",false,null,null,1,false,false,0,"ft3; ft^3; ft*3; cu. ft; cubic feet; cubed; [ft_i]3; international","UCUM","Vol","Clinical","","[ft_i]3","[FT_I]3","1",1,false],[false,"cubic yard","[cyd_i]","[CYD_I]","volume",0.7645548579840002,[3,0,0,0,0,0,0],"cu.yd","intcust",false,null,null,1,false,false,0,"cubic yards; cubic yds; cu yards; CYs; yards^3; yd^3; yds^3; yd3; yds3","UCUM","Vol","Nonclinical","standard unit used in the US and internationally","[yd_i]3","[YD_I]3","1",1,false],[false,"board foot","[bf_i]","[BF_I]","volume",0.0023597372160000006,[3,0,0,0,0,0,0],null,"intcust",false,null,null,1,false,false,0,"BDFT; FBM; BF; board feet; international","UCUM","Vol","Nonclinical","unit of volume used to measure lumber","[in_i]3","[IN_I]3","144",144,false],[false,"cord","[cr_i]","[CR_I]","volume",3.6245563637760005,[3,0,0,0,0,0,0],null,"intcust",false,null,null,1,false,false,0,"crd I; international cords","UCUM","Vol","Nonclinical","unit of measure of dry volume used to measure firewood equal 128 ft3","[ft_i]3","[FT_I]3","128",128,false],[false,"mil","[mil_i]","[MIL_I]","length",0.000025400000000000004,[1,0,0,0,0,0,0],"mil","intcust",false,null,null,1,false,false,0,"thou, thousandth; mils; international","UCUM","Len","Clinical","equal to 0.001 international inch","[in_i]","[IN_I]","1e-3",0.001,false],[false,"circular mil","[cml_i]","[CML_I]","area",5.067074790974979e-10,[2,0,0,0,0,0,0],"circ.mil","intcust",false,null,null,1,false,false,0,"circular mils; cml I; international","UCUM","Area","Clinical","","[pi]/4.[mil_i]2","[PI]/4.[MIL_I]2","1",1,false],[false,"hand","[hd_i]","[HD_I]","height of horses",0.10160000000000001,[1,0,0,0,0,0,0],"hd","intcust",false,null,null,1,false,false,0,"hands; international","UCUM","Len","Nonclinical","used to measure horse height","[in_i]","[IN_I]","4",4,false],[false,"foot - US","[ft_us]","[FT_US]","length",0.3048006096012192,[1,0,0,0,0,0,0],"ft<sub>us</sub>","us-lengths",false,null,null,1,false,false,0,"US foot; foot US; us ft; ft us; height; visual distance; feet","UCUM","Len","Obsolete","Better to use [ft_i] which refers to the length used worldwide, including in the US;  [ft_us] may be confused with land survey units. ","m/3937","M/3937","1200",1200,false],[false,"yard - US","[yd_us]","[YD_US]","length",0.9144018288036575,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"US yards; us yds; distance","UCUM","Len; Nrat","Obsolete","Better to use [yd_i] which refers to the length used worldwide, including in the US; [yd_us] refers to unit used in land surveys in the US","[ft_us]","[FT_US]","3",3,false],[false,"inch - US","[in_us]","[IN_US]","length",0.0254000508001016,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"US inches; in us; us in; inch US","UCUM","Len","Obsolete","Better to use [in_i] which refers to the length used worldwide, including in the US","[ft_us]/12","[FT_US]/12","1",1,false],[false,"rod - US","[rd_us]","[RD_US]","length",5.029210058420117,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"US rod; US rods; rd US; US rd","UCUM","Len","Obsolete","","[ft_us]","[FT_US]","16.5",16.5,false],[false,"Gunter's chain - US","[ch_us]","[CH_US]","length",20.116840233680467,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"surveyor's chain; Surveyor's chain USA; Gunter’s measurement; surveyor’s measurement; Gunter's Chain USA","UCUM","Len","Obsolete","historical unit used for land survey used only in the US","[rd_us]","[RD_US]","4",4,false],[false,"link for Gunter's chain - US","[lk_us]","[LK_US]","length",0.20116840233680466,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"Links for Gunter's Chain USA","UCUM","Len","Obsolete","","[ch_us]/100","[CH_US]/100","1",1,false],[false,"Ramden's chain - US","[rch_us]","[RCH_US]","length",30.480060960121918,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"Ramsden's chain; engineer's chains","UCUM","Len","Obsolete","distance measuring device used for land survey","[ft_us]","[FT_US]","100",100,false],[false,"link for Ramden's chain - US","[rlk_us]","[RLK_US]","length",0.3048006096012192,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"links for Ramsden's chain","UCUM","Len","Obsolete","","[rch_us]/100","[RCH_US]/100","1",1,false],[false,"fathom - US","[fth_us]","[FTH_US]","length",1.828803657607315,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"US fathoms; fathom USA; fth us","UCUM","Len","Obsolete","same length as the international fathom - better to use international fathom ([fth_i])","[ft_us]","[FT_US]","6",6,false],[false,"furlong - US","[fur_us]","[FUR_US]","length",201.16840233680466,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"US furlongs; fur us","UCUM","Len","Nonclinical","distance unit in horse racing","[rd_us]","[RD_US]","40",40,false],[false,"mile - US","[mi_us]","[MI_US]","length",1609.3472186944373,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"U.S. Survey Miles; US statute miles; survey mi; US mi; distance","UCUM","Len","Nonclinical","Better to use [mi_i] which refers to the length used worldwide, including in the US","[fur_us]","[FUR_US]","8",8,false],[false,"acre - US","[acr_us]","[ACR_US]","area",4046.872609874252,[2,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"Acre USA Survey; Acre USA; survey acres","UCUM","Area","Nonclinical","an older unit based on pre 1959 US statute lengths that is still sometimes used in the US only for land survey purposes. ","[rd_us]2","[RD_US]2","160",160,false],[false,"square rod - US","[srd_us]","[SRD_US]","area",25.292953811714074,[2,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"rod2; rod^2; sq. rod; rods squared","UCUM","Area","Nonclinical","Used only in the US to measure land area, based on US statute land survey length units","[rd_us]2","[RD_US]2","1",1,false],[false,"square mile - US","[smi_us]","[SMI_US]","area",2589998.470319521,[2,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"mi2; mi^2; sq mi; miles squared","UCUM","Area","Nonclinical","historical unit used only in the US for land survey purposes (based on the US survey mile), not the internationally recognized [mi_i]","[mi_us]2","[MI_US]2","1",1,false],[false,"section","[sct]","[SCT]","area",2589998.470319521,[2,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"sct; sections","UCUM","Area","Nonclinical","tract of land approximately equal to 1 mile square containing 640 acres","[mi_us]2","[MI_US]2","1",1,false],[false,"township","[twp]","[TWP]","area",93239944.93150276,[2,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"twp; townships","UCUM","Area","Nonclinical","land measurement equal to 6 mile square","[sct]","[SCT]","36",36,false],[false,"mil - US","[mil_us]","[MIL_US]","length",0.0000254000508001016,[1,0,0,0,0,0,0],null,"us-lengths",false,null,null,1,false,false,0,"thou, thousandth; mils","UCUM","Len","Obsolete","better to use [mil_i] which is based on the internationally recognized inch","[in_us]","[IN_US]","1e-3",0.001,false],[false,"inch - British","[in_br]","[IN_BR]","length",0.025399980000000003,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"imperial inches; imp in; br in; british inches","UCUM","Len","Obsolete","","cm","CM","2.539998",2.539998,false],[false,"foot - British","[ft_br]","[FT_BR]","length",0.30479976000000003,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"British Foot; Imperial Foot; feet; imp fts; br fts","UCUM","Len","Obsolete","","[in_br]","[IN_BR]","12",12,false],[false,"rod - British","[rd_br]","[RD_BR]","length",5.02919604,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"British rods; br rd","UCUM","Len","Obsolete","","[ft_br]","[FT_BR]","16.5",16.5,false],[false,"Gunter's chain - British","[ch_br]","[CH_BR]","length",20.11678416,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"Gunter's Chain British; Gunters Chain British; Surveyor's Chain British","UCUM","Len","Obsolete","historical unit used for land survey used only in Great Britain","[rd_br]","[RD_BR]","4",4,false],[false,"link for Gunter's chain - British","[lk_br]","[LK_BR]","length",0.2011678416,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"Links for Gunter's Chain British","UCUM","Len","Obsolete","","[ch_br]/100","[CH_BR]/100","1",1,false],[false,"fathom - British","[fth_br]","[FTH_BR]","length",1.82879856,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"British fathoms; imperial fathoms; br fth; imp fth","UCUM","Len","Obsolete","","[ft_br]","[FT_BR]","6",6,false],[false,"pace - British","[pc_br]","[PC_BR]","length",0.7619994000000001,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"British paces; br pc","UCUM","Len","Nonclinical","traditional unit of length equal to 152.4 centimeters, or 1.52 meter. ","[ft_br]","[FT_BR]","2.5",2.5,false],[false,"yard - British","[yd_br]","[YD_BR]","length",0.91439928,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"British yards; Br yds; distance","UCUM","Len","Obsolete","","[ft_br]","[FT_BR]","3",3,false],[false,"mile - British","[mi_br]","[MI_BR]","length",1609.3427328000002,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"imperial miles; British miles; English statute miles; imp mi, br mi","UCUM","Len","Obsolete","","[ft_br]","[FT_BR]","5280",5280,false],[false,"nautical mile - British","[nmi_br]","[NMI_BR]","length",1853.1825408000002,[1,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"British nautical miles; Imperial nautical miles; Admiralty miles; n.m. br; imp nm","UCUM","Len","Obsolete","","[ft_br]","[FT_BR]","6080",6080,false],[false,"knot - British","[kn_br]","[KN_BR]","velocity",0.5147729280000001,[1,-1,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"British knots; kn br; kt","UCUM","Vel","Obsolete","based on obsolete British nautical mile ","[nmi_br]/h","[NMI_BR]/H","1",1,false],[false,"acre","[acr_br]","[ACR_BR]","area",4046.850049400269,[2,0,0,0,0,0,0],null,"brit-length",false,null,null,1,false,false,0,"Imperial acres; British; a; ac; ar; acr","UCUM","Area","Nonclinical","the standard unit for acre used in the US and internationally","[yd_br]2","[YD_BR]2","4840",4840,false],[false,"gallon - US","[gal_us]","[GAL_US]","fluid volume",0.0037854117840000014,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US gallons; US liquid gallon; gal us; Queen Anne's wine gallon","UCUM","Vol","Nonclinical","only gallon unit used in the US; [gal_us] is only used in some other countries in South American and Africa to measure gasoline volume","[in_i]3","[IN_I]3","231",231,false],[false,"barrel - US","[bbl_us]","[BBL_US]","fluid volume",0.15898729492800007,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"bbl","UCUM","Vol","Nonclinical","[bbl_us] is the standard unit for oil barrel, which is a unit only used in the US to measure the volume oil. ","[gal_us]","[GAL_US]","42",42,false],[false,"quart - US","[qt_us]","[QT_US]","fluid volume",0.0009463529460000004,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US quarts; us qts","UCUM","Vol","Clinical","Used only in the US","[gal_us]/4","[GAL_US]/4","1",1,false],[false,"pint - US","[pt_us]","[PT_US]","fluid volume",0.0004731764730000002,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US pints; pint US; liquid pint; pt us; us pt","UCUM","Vol","Clinical","Used only in the US","[qt_us]/2","[QT_US]/2","1",1,false],[false,"gill - US","[gil_us]","[GIL_US]","fluid volume",0.00011829411825000005,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US gills; gil us","UCUM","Vol","Nonclinical","only used in the context of alcohol volume in the US","[pt_us]/4","[PT_US]/4","1",1,false],[false,"fluid ounce - US","[foz_us]","[FOZ_US]","fluid volume",0.00002957352956250001,[3,0,0,0,0,0,0],"oz fl","us-volumes",false,null,null,1,false,false,0,"US fluid ounces; fl ozs; FO; fl. oz.; foz us","UCUM","Vol","Clinical","unit used only in the US","[gil_us]/4","[GIL_US]/4","1",1,false],[false,"fluid dram - US","[fdr_us]","[FDR_US]","fluid volume",0.0000036966911953125014,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US fluid drams; fdr us","UCUM","Vol","Nonclinical","equal to 1/8 US fluid ounce = 3.69 mL; used informally to mean small amount of liquor, especially Scotch whiskey","[foz_us]/8","[FOZ_US]/8","1",1,false],[false,"minim - US","[min_us]","[MIN_US]","fluid volume",6.161151992187503e-8,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"min US; US min; ♏ US","UCUM","Vol","Obsolete","","[fdr_us]/60","[FDR_US]/60","1",1,false],[false,"cord - US","[crd_us]","[CRD_US]","fluid volume",3.6245563637760005,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US cord; US cords; crd us; us crd","UCUM","Vol","Nonclinical","unit of measure of dry volume used to measure firewood equal 128 ft3 (the same as international cord [cr_i])","[ft_i]3","[FT_I]3","128",128,false],[false,"bushel - US","[bu_us]","[BU_US]","dry volume",0.035239070166880014,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US bushels; US bsh; US bu","UCUM","Vol","Obsolete","Historical unit of dry volume that is rarely used today","[in_i]3","[IN_I]3","2150.42",2150.42,false],[false,"gallon - historical","[gal_wi]","[GAL_WI]","dry volume",0.004404883770860002,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"Corn Gallon British; Dry Gallon US; Gallons Historical; Grain Gallon British; Winchester Corn Gallon; historical winchester gallons; wi gal","UCUM","Vol","Obsolete","historical unit of dry volume no longer used","[bu_us]/8","[BU_US]/8","1",1,false],[false,"peck - US","[pk_us]","[PK_US]","dry volume",0.008809767541720004,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"US pecks; US pk","UCUM","Vol","Nonclinical","unit of dry volume rarely used today (can be used to measure volume of apples)","[bu_us]/4","[BU_US]/4","1",1,false],[false,"dry quart - US","[dqt_us]","[DQT_US]","dry volume",0.0011012209427150004,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"dry quarts; dry quart US; US dry quart; dry qt; us dry qt; dqt; dqt us","UCUM","Vol","Nonclinical","historical unit of dry volume only in the US, but is rarely used today","[pk_us]/8","[PK_US]/8","1",1,false],[false,"dry pint - US","[dpt_us]","[DPT_US]","dry volume",0.0005506104713575002,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"dry pints; dry pint US; US dry pint; dry pt; dpt; dpt us","UCUM","Vol","Nonclinical","historical unit of dry volume only in the US, but is rarely used today","[dqt_us]/2","[DQT_US]/2","1",1,false],[false,"tablespoon - US","[tbs_us]","[TBS_US]","volume",0.000014786764781250006,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"Tbs; tbsp; tbs us; US tablespoons","UCUM","Vol","Clinical","unit defined as 0.5 US fluid ounces or 3 teaspoons - used only in the US. See [tbs_m] for the unit used internationally and in the US for nutrional labelling. ","[foz_us]/2","[FOZ_US]/2","1",1,false],[false,"teaspoon - US","[tsp_us]","[TSP_US]","volume",0.000004928921593750002,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"tsp; t; US teaspoons","UCUM","Vol","Nonclinical","unit defined as 1/6 US fluid ounces - used only in the US. See [tsp_m] for the unit used internationally and in the US for nutrional labelling. ","[tbs_us]/3","[TBS_US]/3","1",1,false],[false,"cup - US customary","[cup_us]","[CUP_US]","volume",0.0002365882365000001,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"cup us; us cups","UCUM","Vol","Nonclinical","Unit defined as 1/2 US pint or 16 US tablespoons ≈ 236.59 mL, which is not the standard unit defined by the FDA of 240 mL - see [cup_m] (metric cup)","[tbs_us]","[TBS_US]","16",16,false],[false,"fluid ounce - metric","[foz_m]","[FOZ_M]","fluid volume",0.000029999999999999997,[3,0,0,0,0,0,0],"oz fl","us-volumes",false,null,null,1,false,false,0,"metric fluid ounces; fozs m; fl ozs m","UCUM","Vol","Clinical","unit used only in the US for nutritional labelling, as set by the FDA","mL","ML","30",30,false],[false,"cup - US legal","[cup_m]","[CUP_M]","volume",0.00023999999999999998,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"cup m; metric cups","UCUM","Vol","Clinical","standard unit equal to 240 mL used in the US for nutritional labelling, as defined by the FDA. Note that this is different from the US customary cup (236.59 mL) and the metric cup used in Commonwealth nations (250 mL).","mL","ML","240",240,false],[false,"teaspoon - metric","[tsp_m]","[TSP_M]","volume",0.0000049999999999999996,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"tsp; t; metric teaspoons","UCUM","Vol","Clinical","standard unit used in the US and internationally","mL","mL","5",5,false],[false,"tablespoon - metric","[tbs_m]","[TBS_M]","volume",0.000014999999999999999,[3,0,0,0,0,0,0],null,"us-volumes",false,null,null,1,false,false,0,"metric tablespoons; Tbs; tbsp; T; tbs m","UCUM","Vol","Clinical","standard unit used in the US and internationally","mL","mL","15",15,false],[false,"gallon- British","[gal_br]","[GAL_BR]","volume",0.004546090000000001,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"imperial gallons, UK gallons; British gallons; br gal; imp gal","UCUM","Vol","Nonclinical","Used only in Great Britain and other Commonwealth countries","l","L","4.54609",4.54609,false],[false,"peck - British","[pk_br]","[PK_BR]","volume",0.009092180000000002,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"imperial pecks; British pecks; br pk; imp pk","UCUM","Vol","Nonclinical","unit of dry volume rarely used today (can be used to measure volume of apples)","[gal_br]","[GAL_BR]","2",2,false],[false,"bushel - British","[bu_br]","[BU_BR]","volume",0.03636872000000001,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"British bushels; imperial; br bsh; br bu; imp","UCUM","Vol","Obsolete","Historical unit of dry volume that is rarely used today","[pk_br]","[PK_BR]","4",4,false],[false,"quart - British","[qt_br]","[QT_BR]","volume",0.0011365225000000002,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"British quarts; imperial quarts; br qts","UCUM","Vol","Clinical","Used only in Great Britain and other Commonwealth countries","[gal_br]/4","[GAL_BR]/4","1",1,false],[false,"pint - British","[pt_br]","[PT_BR]","volume",0.0005682612500000001,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"British pints; imperial pints; pt br; br pt; imp pt; pt imp","UCUM","Vol","Clinical","Used only in Great Britain and other Commonwealth countries","[qt_br]/2","[QT_BR]/2","1",1,false],[false,"gill - British","[gil_br]","[GIL_BR]","volume",0.00014206531250000003,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"imperial gills; British gills; imp gill, br gill","UCUM","Vol","Nonclinical","only used in the context of alcohol volume in Great Britain","[pt_br]/4","[PT_BR]/4","1",1,false],[false,"fluid ounce - British","[foz_br]","[FOZ_BR]","volume",0.000028413062500000005,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"British fluid ounces; Imperial fluid ounces; br fozs; imp fozs; br fl ozs","UCUM","Vol","Clinical","Used only in Great Britain and other Commonwealth countries","[gil_br]/5","[GIL_BR]/5","1",1,false],[false,"fluid dram - British","[fdr_br]","[FDR_BR]","volume",0.0000035516328125000006,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"British fluid drams; fdr br","UCUM","Vol","Nonclinical","equal to 1/8 Imperial fluid ounce = 3.55 mL; used informally to mean small amount of liquor, especially Scotch whiskey","[foz_br]/8","[FOZ_BR]/8","1",1,false],[false,"minim - British","[min_br]","[MIN_BR]","volume",5.919388020833334e-8,[3,0,0,0,0,0,0],null,"brit-volumes",false,null,null,1,false,false,0,"min br; br min; ♏ br","UCUM","Vol","Obsolete","","[fdr_br]/60","[FDR_BR]/60","1",1,false],[false,"grain","[gr]","[GR]","mass",0.06479891,[0,0,1,0,0,0,0],null,"avoirdupois",false,null,null,1,false,false,0,"gr; grains","UCUM","Mass","Nonclinical","an apothecary measure of mass rarely used today","mg","MG","64.79891",64.79891,false],[false,"pound","[lb_av]","[LB_AV]","mass",453.59237,[0,0,1,0,0,0,0],"lb","avoirdupois",false,null,null,1,false,false,0,"avoirdupois pounds, international pounds; av lbs; pounds","UCUM","Mass","Clinical","standard unit used in the US and internationally","[gr]","[GR]","7000",7000,false],[false,"pound force - US","[lbf_av]","[LBF_AV]","force",4448.2216152605,[1,-2,1,0,0,0,0],"lbf","const",false,null,null,1,false,false,0,"lbfs; US lbf; US pound forces","UCUM","Force","Clinical","only rarely needed in health care - see [lb_av] which is the more common unit to express weight","[lb_av].[g]","[LB_AV].[G]","1",1,false],[false,"ounce","[oz_av]","[OZ_AV]","mass",28.349523125,[0,0,1,0,0,0,0],"oz","avoirdupois",false,null,null,1,false,false,0,"ounces; international ounces; avoirdupois ounces; av ozs","UCUM","Mass","Clinical","standard unit used in the US and internationally","[lb_av]/16","[LB_AV]/16","1",1,false],[false,"Dram mass unit","[dr_av]","[DR_AV]","mass",1.7718451953125,[0,0,1,0,0,0,0],null,"avoirdupois",false,null,null,1,false,false,0,"Dram; drams avoirdupois; avoidupois dram; international dram","UCUM","Mass","Clinical","unit from the avoirdupois system, which is used in the US and internationally","[oz_av]/16","[OZ_AV]/16","1",1,false],[false,"short hundredweight","[scwt_av]","[SCWT_AV]","mass",45359.237,[0,0,1,0,0,0,0],null,"avoirdupois",false,null,null,1,false,false,0,"hundredweights; s cwt; scwt; avoirdupois","UCUM","Mass","Nonclinical","Used only in the US to equal 100 pounds","[lb_av]","[LB_AV]","100",100,false],[false,"long hundredweight","[lcwt_av]","[LCWT_AV]","mass",50802.345440000005,[0,0,1,0,0,0,0],null,"avoirdupois",false,null,null,1,false,false,0,"imperial hundredweights; imp cwt; lcwt; avoirdupois","UCUM","Mass","Obsolete","","[lb_av]","[LB_AV]","112",112,false],[false,"short ton - US","[ston_av]","[STON_AV]","mass",907184.74,[0,0,1,0,0,0,0],null,"avoirdupois",false,null,null,1,false,false,0,"ton; US tons; avoirdupois tons","UCUM","Mass","Clinical","Used only in the US","[scwt_av]","[SCWT_AV]","20",20,false],[false,"long ton - British","[lton_av]","[LTON_AV]","mass",1016046.9088000001,[0,0,1,0,0,0,0],null,"avoirdupois",false,null,null,1,false,false,0,"imperial tons; weight tons; British long tons; long ton avoirdupois","UCUM","Mass","Nonclinical","Used only in Great Britain and other Commonwealth countries","[lcwt_av]","[LCWT_AV]","20",20,false],[false,"stone - British","[stone_av]","[STONE_AV]","mass",6350.293180000001,[0,0,1,0,0,0,0],null,"avoirdupois",false,null,null,1,false,false,0,"British stones; avoirdupois","UCUM","Mass","Nonclinical","Used primarily in the UK and Ireland to measure body weight","[lb_av]","[LB_AV]","14",14,false],[false,"pennyweight - troy","[pwt_tr]","[PWT_TR]","mass",1.5551738400000001,[0,0,1,0,0,0,0],null,"troy",false,null,null,1,false,false,0,"dwt; denarius weights","UCUM","Mass","Obsolete","historical unit used to measure mass and cost of precious metals","[gr]","[GR]","24",24,false],[false,"ounce - troy","[oz_tr]","[OZ_TR]","mass",31.103476800000003,[0,0,1,0,0,0,0],null,"troy",false,null,null,1,false,false,0,"troy ounces; tr ozs","UCUM","Mass","Nonclinical","unit of mass for precious metals and gemstones only","[pwt_tr]","[PWT_TR]","20",20,false],[false,"pound - troy","[lb_tr]","[LB_TR]","mass",373.2417216,[0,0,1,0,0,0,0],null,"troy",false,null,null,1,false,false,0,"troy pounds; tr lbs","UCUM","Mass","Nonclinical","only used for weighing precious metals","[oz_tr]","[OZ_TR]","12",12,false],[false,"scruple","[sc_ap]","[SC_AP]","mass",1.2959782,[0,0,1,0,0,0,0],null,"apoth",false,null,null,1,false,false,0,"scruples; sc ap","UCUM","Mass","Obsolete","","[gr]","[GR]","20",20,false],[false,"dram - apothecary","[dr_ap]","[DR_AP]","mass",3.8879346,[0,0,1,0,0,0,0],null,"apoth",false,null,null,1,false,false,0,"ʒ; drachm; apothecaries drams; dr ap; dram ap","UCUM","Mass","Nonclinical","unit still used in the US occasionally to measure amount of drugs in pharmacies","[sc_ap]","[SC_AP]","3",3,false],[false,"ounce - apothecary","[oz_ap]","[OZ_AP]","mass",31.1034768,[0,0,1,0,0,0,0],null,"apoth",false,null,null,1,false,false,0,"apothecary ounces; oz ap; ap ozs; ozs ap","UCUM","Mass","Obsolete","","[dr_ap]","[DR_AP]","8",8,false],[false,"pound - apothecary","[lb_ap]","[LB_AP]","mass",373.2417216,[0,0,1,0,0,0,0],null,"apoth",false,null,null,1,false,false,0,"apothecary pounds; apothecaries pounds; ap lb; lb ap; ap lbs; lbs ap","UCUM","Mass","Obsolete","","[oz_ap]","[OZ_AP]","12",12,false],[false,"ounce - metric","[oz_m]","[OZ_M]","mass",28,[0,0,1,0,0,0,0],null,"apoth",false,null,null,1,false,false,0,"metric ounces; m ozs","UCUM","Mass","Clinical","see [oz_av] (the avoirdupois ounce) for the standard ounce used internationally; [oz_m] is equal to 28 grams and is based on the apothecaries' system of mass units which is used in some US pharmacies. ","g","g","28",28,false],[false,"line","[lne]","[LNE]","length",0.002116666666666667,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"British lines; br L; L; l","UCUM","Len","Obsolete","","[in_i]/12","[IN_I]/12","1",1,false],[false,"point (typography)","[pnt]","[PNT]","length",0.0003527777777777778,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"DTP points; desktop publishing point; pt; pnt","UCUM","Len","Nonclinical","typography unit for typesetter's length","[lne]/6","[LNE]/6","1",1,false],[false,"pica (typography)","[pca]","[PCA]","length",0.004233333333333334,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"picas","UCUM","Len","Nonclinical","typography unit for typesetter's length","[pnt]","[PNT]","12",12,false],[false,"Printer's point (typography)","[pnt_pr]","[PNT_PR]","length",0.00035145980000000004,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"pnt pr","UCUM","Len","Nonclinical","typography unit for typesetter's length","[in_i]","[IN_I]","0.013837",0.013837,false],[false,"Printer's pica  (typography)","[pca_pr]","[PCA_PR]","length",0.004217517600000001,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"pca pr; Printer's picas","UCUM","Len","Nonclinical","typography unit for typesetter's length","[pnt_pr]","[PNT_PR]","12",12,false],[false,"pied","[pied]","[PIED]","length",0.3248,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"pieds du roi; Paris foot; royal; French; feet","UCUM","Len","Obsolete","","cm","CM","32.48",32.48,false],[false,"pouce","[pouce]","[POUCE]","length",0.027066666666666666,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"historical French inches; French royal inches","UCUM","Len","Obsolete","","[pied]/12","[PIED]/12","1",1,false],[false,"ligne","[ligne]","[LIGNE]","length",0.0022555555555555554,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"Paris lines; lignes","UCUM","Len","Obsolete","","[pouce]/12","[POUCE]/12","1",1,false],[false,"didot","[didot]","[DIDOT]","length",0.0003759259259259259,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"Didot point; dd; Didots Point; didots; points","UCUM","Len","Obsolete","typography unit for typesetter's length","[ligne]/6","[LIGNE]/6","1",1,false],[false,"cicero","[cicero]","[CICERO]","length",0.004511111111111111,[1,0,0,0,0,0,0],null,"typeset",false,null,null,1,false,false,0,"Didot's pica; ciceros; picas","UCUM","Len","Obsolete","typography unit for typesetter's length","[didot]","[DIDOT]","12",12,false],[false,"degrees Fahrenheit","[degF]","[DEGF]","temperature",0.5555555555555556,[0,0,0,0,1,0,0],"°F","heat",false,null,"degF",1,true,false,0,"°F; deg F","UCUM","Temp","Clinical","","K",null,null,0.5555555555555556,false],[false,"degrees Rankine","[degR]","[degR]","temperature",0.5555555555555556,[0,0,0,0,1,0,0],"°R","heat",false,null,null,1,false,false,0,"°R; °Ra; Rankine","UCUM","Temp","Obsolete","Replaced by Kelvin","K/9","K/9","5",5,false],[false,"degrees Réaumur","[degRe]","[degRe]","temperature",1.25,[0,0,0,0,1,0,0],"°Ré","heat",false,null,"degRe",1,true,false,0,"°Ré, °Re, °r; Réaumur; degree Reaumur; Reaumur","UCUM","Temp","Obsolete","replaced by Celsius","K",null,null,1.25,false],[false,"calorie at 15°C","cal_[15]","CAL_[15]","energy",4185.8,[2,-2,1,0,0,0,0],"cal<sub>15°C</sub>","heat",true,null,null,1,false,false,0,"calorie 15 C; cals 15 C; calories at 15 C","UCUM","Enrg","Nonclinical","equal to 4.1855 joules; calorie most often used in engineering","J","J","4.18580",4.1858,false],[false,"calorie at 20°C","cal_[20]","CAL_[20]","energy",4181.9,[2,-2,1,0,0,0,0],"cal<sub>20°C</sub>","heat",true,null,null,1,false,false,0,"calorie 20 C; cal 20 C; calories at 20 C","UCUM","Enrg","Clinical","equal to 4.18190  joules. ","J","J","4.18190",4.1819,false],[false,"mean calorie","cal_m","CAL_M","energy",4190.0199999999995,[2,-2,1,0,0,0,0],"cal<sub>m</sub>","heat",true,null,null,1,false,false,0,"mean cals; mean calories","UCUM","Enrg","Clinical","equal to 4.19002 joules. ","J","J","4.19002",4.19002,false],[false,"international table calorie","cal_IT","CAL_IT","energy",4186.8,[2,-2,1,0,0,0,0],"cal<sub>IT</sub>","heat",true,null,null,1,false,false,0,"calories IT; IT cals; international steam table calories","UCUM","Enrg","Nonclinical","used in engineering steam tables and defined as 1/860 international watt-hour; equal to 4.1868 joules","J","J","4.1868",4.1868,false],[false,"thermochemical calorie","cal_th","CAL_TH","energy",4184,[2,-2,1,0,0,0,0],"cal<sub>th</sub>","heat",true,null,null,1,false,false,0,"thermochemical calories; th cals","UCUM","Enrg","Clinical","equal to 4.184 joules; used as the unit in medicine and biochemistry (equal to cal)","J","J","4.184",4.184,false],[false,"calorie","cal","CAL","energy",4184,[2,-2,1,0,0,0,0],"cal","heat",true,null,null,1,false,false,0,"gram calories; small calories","UCUM","Enrg","Clinical","equal to 4.184 joules (the same value as the thermochemical calorie, which is the most common calorie used in medicine and biochemistry)","cal_th","CAL_TH","1",1,false],[false,"nutrition label Calories","[Cal]","[CAL]","energy",4184000,[2,-2,1,0,0,0,0],"Cal","heat",false,null,null,1,false,false,0,"food calories; Cal; kcal","UCUM","Eng","Clinical","","kcal_th","KCAL_TH","1",1,false],[false,"British thermal unit at 39°F","[Btu_39]","[BTU_39]","energy",1059670,[2,-2,1,0,0,0,0],"Btu<sub>39°F</sub>","heat",false,null,null,1,false,false,0,"BTU 39F; BTU 39 F; B.T.U. 39 F; B.Th.U. 39 F; BThU 39 F; British thermal units","UCUM","Eng","Nonclinical","equal to 1.05967 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries","kJ","kJ","1.05967",1.05967,false],[false,"British thermal unit at 59°F","[Btu_59]","[BTU_59]","energy",1054800,[2,-2,1,0,0,0,0],"Btu<sub>59°F</sub>","heat",false,null,null,1,false,false,0,"BTU 59 F; BTU 59F; B.T.U. 59 F; B.Th.U. 59 F; BThU 59F; British thermal units","UCUM","Eng","Nonclinical","equal to  1.05480 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries","kJ","kJ","1.05480",1.0548,false],[false,"British thermal unit at 60°F","[Btu_60]","[BTU_60]","energy",1054680,[2,-2,1,0,0,0,0],"Btu<sub>60°F</sub>","heat",false,null,null,1,false,false,0,"BTU 60 F; BTU 60F; B.T.U. 60 F; B.Th.U. 60 F; BThU 60 F; British thermal units 60 F","UCUM","Eng","Nonclinical","equal to 1.05468 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries","kJ","kJ","1.05468",1.05468,false],[false,"mean British thermal unit","[Btu_m]","[BTU_M]","energy",1055870,[2,-2,1,0,0,0,0],"Btu<sub>m</sub>","heat",false,null,null,1,false,false,0,"BTU mean; B.T.U. mean; B.Th.U. mean; BThU mean; British thermal units mean; ","UCUM","Eng","Nonclinical","equal to 1.05587 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries","kJ","kJ","1.05587",1.05587,false],[false,"international table British thermal unit","[Btu_IT]","[BTU_IT]","energy",1055055.85262,[2,-2,1,0,0,0,0],"Btu<sub>IT</sub>","heat",false,null,null,1,false,false,0,"BTU IT; B.T.U. IT; B.Th.U. IT; BThU IT; British thermal units IT","UCUM","Eng","Nonclinical","equal to 1.055 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries","kJ","kJ","1.05505585262",1.05505585262,false],[false,"thermochemical British thermal unit","[Btu_th]","[BTU_TH]","energy",1054350,[2,-2,1,0,0,0,0],"Btu<sub>th</sub>","heat",false,null,null,1,false,false,0,"BTU Th; B.T.U. Th; B.Th.U. Th; BThU Th; thermochemical British thermal units","UCUM","Eng","Nonclinical","equal to 1.054350 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries","kJ","kJ","1.054350",1.05435,false],[false,"British thermal unit","[Btu]","[BTU]","energy",1054350,[2,-2,1,0,0,0,0],"btu","heat",false,null,null,1,false,false,0,"BTU; B.T.U. ; B.Th.U.; BThU; British thermal units","UCUM","Eng","Nonclinical","equal to the thermochemical British thermal unit equal to 1.054350 kJ; used as a measure of power in the electric power, steam generation, heating, and air conditioning industries","[Btu_th]","[BTU_TH]","1",1,false],[false,"horsepower - mechanical","[HP]","[HP]","power",745699.8715822703,[2,-3,1,0,0,0,0],null,"heat",false,null,null,1,false,false,0,"imperial horsepowers","UCUM","EngRat","Nonclinical","refers to mechanical horsepower, which is unit used to measure engine power primarily in the US. ","[ft_i].[lbf_av]/s","[FT_I].[LBF_AV]/S","550",550,false],[false,"tex","tex","TEX","linear mass density (of textile thread)",0.001,[-1,0,1,0,0,0,0],"tex","heat",true,null,null,1,false,false,0,"linear mass density; texes","UCUM","","Clinical","unit of linear mass density for fibers equal to gram per 1000 meters","g/km","G/KM","1",1,false],[false,"Denier (linear mass density)","[den]","[DEN]","linear mass density (of textile thread)",0.0001111111111111111,[-1,0,1,0,0,0,0],"den","heat",false,null,null,1,false,false,0,"den; deniers","UCUM","","Nonclinical","equal to the mass in grams per 9000 meters of the fiber (1 denier = 1 strand of silk)","g/9/km","G/9/KM","1",1,false],[false,"meter of water column","m[H2O]","M[H2O]","pressure",9806650,[-1,-2,1,0,0,0,0],"m HO<sub><r>2</r></sub>","clinical",true,null,null,1,false,false,0,"mH2O; m H2O; meters of water column; metres; pressure","UCUM","Pres","Clinical","","kPa","KPAL","980665e-5",9.80665,false],[false,"meter of mercury column","m[Hg]","M[HG]","pressure",133322000,[-1,-2,1,0,0,0,0],"m Hg","clinical",true,null,null,1,false,false,0,"mHg; m Hg; meters of mercury column; metres; pressure","UCUM","Pres","Clinical","","kPa","KPAL","133.3220",133.322,false],[false,"inch of water column","[in_i'H2O]","[IN_I'H2O]","pressure",249088.91000000003,[-1,-2,1,0,0,0,0],"in HO<sub><r>2</r></sub>","clinical",false,null,null,1,false,false,0,"inches WC; inAq; in H2O; inch of water gauge; iwg; pressure","UCUM","Pres","Clinical","unit of pressure, especially in respiratory and ventilation care","m[H2O].[in_i]/m","M[H2O].[IN_I]/M","1",1,false],[false,"inch of mercury column","[in_i'Hg]","[IN_I'HG]","pressure",3386378.8000000003,[-1,-2,1,0,0,0,0],"in Hg","clinical",false,null,null,1,false,false,0,"inHg; in Hg; pressure; inches","UCUM","Pres","Clinical","unit of pressure used in US to measure barometric pressure and occasionally blood pressure (see mm[Hg] for unit used internationally)","m[Hg].[in_i]/m","M[HG].[IN_I]/M","1",1,false],[false,"peripheral vascular resistance unit","[PRU]","[PRU]","fluid resistance",133322000000,[-4,-1,1,0,0,0,0],"P.R.U.","clinical",false,null,null,1,false,false,0,"peripheral vascular resistance units; peripheral resistance unit; peripheral resistance units; PRU","UCUM","FldResist","Clinical","used to assess blood flow in the capillaries; equal to 1 mmH.min/mL = 133.3 Pa·min/mL","mm[Hg].s/ml","MM[HG].S/ML","1",1,false],[false,"Wood unit","[wood'U]","[WOOD'U]","fluid resistance",7999320000,[-4,-1,1,0,0,0,0],"Wood U.","clinical",false,null,null,1,false,false,0,"hybrid reference units; HRU; mmHg.min/L; vascular resistance","UCUM","Pres","Clinical","simplified unit of measurement for for measuring pulmonary vascular resistance that uses pressure; equal to mmHg.min/L","mm[Hg].min/L","MM[HG].MIN/L","1",1,false],[false,"diopter (lens)","[diop]","[DIOP]","refraction of a lens",1,[1,0,0,0,0,0,0],"dpt","clinical",false,null,"inv",1,false,false,0,"diopters; diop; dioptre; dpt; refractive power","UCUM","InvLen","Clinical","unit of optical power of lens represented by inverse meters (m^-1)","m","/M","1",1,false],[false,"prism diopter (magnifying power)","[p'diop]","[P'DIOP]","refraction of a prism",1,[0,0,0,1,0,0,0],"PD","clinical",false,null,"tanTimes100",1,true,false,0,"diopters; dioptres; p diops; pdiop; dpt; pdptr; Δ; cm/m; centimeter per meter; centimetre; metre","UCUM","Angle","Clinical","unit for prism correction in eyeglass prescriptions","rad",null,null,1,false],[false,"percent of slope","%[slope]","%[SLOPE]","slope",0.017453292519943295,[0,0,0,1,0,0,0],"%","clinical",false,null,"100tan",1,true,false,0,"% slope; %slope; percents slopes","UCUM","VelFr; ElpotRatFr; VelRtoFr; AccelFr","Clinical","","deg",null,null,1,false],[false,"mesh","[mesh_i]","[MESH_I]","lineic number",0.025400000000000002,[1,0,0,0,0,0,0],null,"clinical",false,null,"inv",1,false,false,0,"meshes","UCUM","NLen (lineic number)","Clinical","traditional unit of length defined as the number of strands or particles per inch","[in_i]","/[IN_I]","1",1,false],[false,"French (catheter gauge) ","[Ch]","[CH]","gauge of catheters",0.0003333333333333333,[1,0,0,0,0,0,0],"Ch","clinical",false,null,null,1,false,false,0,"Charrières, French scales; French gauges; Fr, Fg, Ga, FR, Ch","UCUM","Len; Circ; Diam","Clinical","","mm/3","MM/3","1",1,false],[false,"drop - metric (1/20 mL)","[drp]","[DRP]","volume",5e-8,[3,0,0,0,0,0,0],"drp","clinical",false,null,null,1,false,false,0,"drop dosing units; metric drops; gtt","UCUM","Vol","Clinical","standard unit used in the US and internationally for clinical medicine but note that although [drp] is defined as 1/20 milliliter, in practice, drop sizes will vary due to external factors","ml/20","ML/20","1",1,false],[false,"Hounsfield unit","[hnsf'U]","[HNSF'U]","x-ray attenuation",1,[0,0,0,0,0,0,0],"HF","clinical",false,null,null,1,false,false,0,"HU; units","UCUM","","Clinical","used to measure X-ray attenuation, especially in CT scans.","1","1","1",1,false],[false,"Metabolic Equivalent of Task ","[MET]","[MET]","metabolic cost of physical activity",5.833333333333334e-11,[3,-1,-1,0,0,0,0],"MET","clinical",false,null,null,1,false,false,0,"metabolic equivalents","UCUM","RelEngRat","Clinical","unit used to measure rate of energy expenditure per power in treadmill and other functional tests","mL/min/kg","ML/MIN/KG","3.5",3.5,false],[false,"homeopathic potency of decimal series (retired)","[hp'_X]","[HP'_X]","homeopathic potency (retired)",1,[0,0,0,0,0,0,0],"X","clinical",false,null,"hpX",1,true,false,0,null,"UCUM",null,null,null,"1",null,null,1,false],[false,"homeopathic potency of centesimal series (retired)","[hp'_C]","[HP'_C]","homeopathic potency (retired)",1,[0,0,0,0,0,0,0],"C","clinical",false,null,"hpC",1,true,false,0,null,"UCUM",null,null,null,"1",null,null,1,false],[false,"homeopathic potency of millesimal series (retired)","[hp'_M]","[HP'_M]","homeopathic potency (retired)",1,[0,0,0,0,0,0,0],"M","clinical",false,null,"hpM",1,true,false,0,null,"UCUM",null,null,null,"1",null,null,1,false],[false,"homeopathic potency of quintamillesimal series (retired)","[hp'_Q]","[HP'_Q]","homeopathic potency (retired)",1,[0,0,0,0,0,0,0],"Q","clinical",false,null,"hpQ",1,true,false,0,null,"UCUM",null,null,null,"1",null,null,1,false],[false,"homeopathic potency of decimal hahnemannian series","[hp_X]","[HP_X]","homeopathic potency (Hahnemann)",1,[0,0,0,0,0,0,0],"X","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"homeopathic potency of centesimal hahnemannian series","[hp_C]","[HP_C]","homeopathic potency (Hahnemann)",1,[0,0,0,0,0,0,0],"C","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"homeopathic potency of millesimal hahnemannian series","[hp_M]","[HP_M]","homeopathic potency (Hahnemann)",1,[0,0,0,0,0,0,0],"M","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"homeopathic potency of quintamillesimal hahnemannian series","[hp_Q]","[HP_Q]","homeopathic potency (Hahnemann)",1,[0,0,0,0,0,0,0],"Q","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"homeopathic potency of decimal korsakovian series","[kp_X]","[KP_X]","homeopathic potency (Korsakov)",1,[0,0,0,0,0,0,0],"X","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"homeopathic potency of centesimal korsakovian series","[kp_C]","[KP_C]","homeopathic potency (Korsakov)",1,[0,0,0,0,0,0,0],"C","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"homeopathic potency of millesimal korsakovian series","[kp_M]","[KP_M]","homeopathic potency (Korsakov)",1,[0,0,0,0,0,0,0],"M","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"homeopathic potency of quintamillesimal korsakovian series","[kp_Q]","[KP_Q]","homeopathic potency (Korsakov)",1,[0,0,0,0,0,0,0],"Q","clinical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"equivalent","eq","EQ","amount of substance",6.0221367e+23,[0,0,0,0,0,0,0],"eq","chemical",true,null,null,1,false,false,1,"equivalents","UCUM","Sub","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"osmole","osm","OSM","amount of substance (dissolved particles)",6.0221367e+23,[0,0,0,0,0,0,0],"osm","chemical",true,null,null,1,false,false,1,"osmoles; osmols","UCUM","Osmol","Clinical","the number of moles of solute that contribute to the osmotic pressure of a solution","mol","MOL","1",1,false],[false,"pH","[pH]","[PH]","acidity",6.0221366999999994e+26,[-3,0,0,0,0,0,0],"pH","chemical",false,null,"pH",1,true,false,0,"pH scale","UCUM","LogCnc","Clinical","Log concentration of H+","mol/l",null,null,1,false],[false,"gram percent","g%","G%","mass concentration",10000,[-3,0,1,0,0,0,0],"g%","chemical",true,null,null,1,false,false,0,"gram %; gram%; grams per deciliter; g/dL; gm per dL; gram percents","UCUM","MCnc","Clinical","equivalent to unit gram per deciliter (g/dL), a unit often used in medical tests to represent solution concentrations","g/dl","G/DL","1",1,false],[false,"Svedberg unit","[S]","[S]","sedimentation coefficient",1e-13,[0,1,0,0,0,0,0],"S","chemical",false,null,null,1,false,false,0,"Sv; 10^-13 seconds; 100 fs; 100 femtoseconds","UCUM","Time","Clinical","unit of time used in measuring particle's sedimentation rate, usually after centrifugation. ","s","10*-13.S","1",1e-13,false],[false,"high power field (microscope)","[HPF]","[HPF]","view area in microscope",1,[0,0,0,0,0,0,0],"HPF","chemical",false,null,null,1,false,false,0,"HPF","UCUM","Area","Clinical","area visible under the maximum magnification power of the objective in microscopy (usually 400x)\\n","1","1","1",1,false],[false,"low power field (microscope)","[LPF]","[LPF]","view area in microscope",1,[0,0,0,0,0,0,0],"LPF","chemical",false,null,null,1,false,false,0,"LPF; fields","UCUM","Area","Clinical","area visible under the low magnification of the objective in microscopy (usually 100 x)\\n","1","1","100",100,false],[false,"katal","kat","KAT","catalytic activity",6.0221367e+23,[0,-1,0,0,0,0,0],"kat","chemical",true,null,null,1,false,false,1,"mol/secs; moles per second; mol*sec-1; mol*s-1; mol.s-1; katals; catalytic activity; enzymatic; enzyme units; activities","UCUM","CAct","Clinical","kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.","mol/s","MOL/S","1",1,false],[false,"enzyme unit","U","U","catalytic activity",10036894500000000,[0,-1,0,0,0,0,0],"U","chemical",true,null,null,1,false,false,1,"micromoles per minute; umol/min; umol per minute; umol min-1; enzymatic activity; enzyme activity","UCUM","CAct","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"international unit - arbitrary","[iU]","[IU]","arbitrary",1,[0,0,0,0,0,0,0],"IU","chemical",true,null,null,1,false,true,0,"international units; IE; F2","UCUM","Arb","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","1","1","1",1,false],[false,"international unit - arbitrary","[IU]","[IU]","arbitrary",1,[0,0,0,0,0,0,0],"i.U.","chemical",true,null,null,1,false,true,0,"international units; IE; F2","UCUM","Arb","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"arbitary unit","[arb'U]","[ARB'U]","arbitrary",1,[0,0,0,0,0,0,0],"arb. U","chemical",false,null,null,1,false,true,0,"arbitary units; arb units; arbU","UCUM","Arb","Clinical","relative unit of measurement to show the ratio of test measurement to reference measurement","1","1","1",1,false],[false,"United States Pharmacopeia unit","[USP'U]","[USP'U]","arbitrary",1,[0,0,0,0,0,0,0],"U.S.P.","chemical",false,null,null,1,false,true,0,"USP U; USP'U","UCUM","Arb","Clinical","a dose unit to express potency of drugs and vitamins defined by the United States Pharmacopoeia; usually 1 USP = 1 IU","1","1","1",1,false],[false,"GPL unit","[GPL'U]","[GPL'U]","biologic activity of anticardiolipin IgG",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"GPL Units; GPL U; IgG anticardiolipin units; IgG Phospholipid","UCUM","ACnc; AMass","Clinical","Units for an antiphospholipid test","1","1","1",1,false],[false,"MPL unit","[MPL'U]","[MPL'U]","biologic activity of anticardiolipin IgM",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"MPL units; MPL U; MPL'U; IgM anticardiolipin units; IgM Phospholipid Units ","UCUM","ACnc","Clinical","units for antiphospholipid test","1","1","1",1,false],[false,"APL unit","[APL'U]","[APL'U]","biologic activity of anticardiolipin IgA",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"APL units; APL U; IgA anticardiolipin; IgA Phospholipid; biologic activity of","UCUM","AMass; ACnc","Clinical","Units for an anti phospholipid syndrome test","1","1","1",1,false],[false,"Bethesda unit","[beth'U]","[BETH'U]","biologic activity of factor VIII inhibitor",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"BU","UCUM","ACnc","Clinical","measures of blood coagulation inhibitior for many blood factors","1","1","1",1,false],[false,"anti factor Xa unit","[anti'Xa'U]","[ANTI'XA'U]","biologic activity of factor Xa inhibitor (heparin)",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"units","UCUM","ACnc","Clinical","[anti'Xa'U] unit is equivalent to and can be converted to IU/mL. ","1","1","1",1,false],[false,"Todd unit","[todd'U]","[TODD'U]","biologic activity antistreptolysin O",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"units","UCUM","InvThres; RtoThres","Clinical","the unit for the results of the testing for antistreptolysin O (ASO)","1","1","1",1,false],[false,"Dye unit","[dye'U]","[DYE'U]","biologic activity of amylase",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"units","UCUM","CCnc","Obsolete","equivalent to the Somogyi unit, which is an enzyme unit for amylase but better to use U, the standard enzyme unit for measuring catalytic activity","1","1","1",1,false],[false,"Somogyi unit","[smgy'U]","[SMGY'U]","biologic activity of amylase",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"Somogyi units; smgy U","UCUM","CAct","Clinical","measures the enzymatic activity of amylase in blood serum - better to use base units mg/mL ","1","1","1",1,false],[false,"Bodansky unit","[bdsk'U]","[BDSK'U]","biologic activity of phosphatase",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"","UCUM","ACnc","Obsolete","Enzyme unit specific to alkaline phosphatase - better to use standard enzyme unit of U","1","1","1",1,false],[false,"King-Armstrong unit","[ka'U]","[KA'U]","biologic activity of phosphatase",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"King-Armstrong Units; King units","UCUM","AMass","Obsolete","enzyme units for acid phosphatase - better to use enzyme unit [U]","1","1","1",1,false],[false,"Kunkel unit","[knk'U]","[KNK'U]","arbitrary biologic activity",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,null,"UCUM",null,null,null,"1","1","1",1,false],[false,"Mac Lagan unit","[mclg'U]","[MCLG'U]","arbitrary biologic activity",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"galactose index; galactose tolerance test; thymol turbidity test unit; mclg U; units; indexes","UCUM","ACnc","Obsolete","unit for liver tests - previously used in thymol turbidity tests for liver disease diagnoses, and now is sometimes referred to in the oral galactose tolerance test","1","1","1",1,false],[false,"tuberculin unit","[tb'U]","[TB'U]","biologic activity of tuberculin",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"TU; units","UCUM","Arb","Clinical","amount of tuberculin antigen -usually in reference to a TB skin test ","1","1","1",1,false],[false,"50% cell culture infectious dose","[CCID_50]","[CCID_50]","biologic activity (infectivity) of an infectious agent preparation",1,[0,0,0,0,0,0,0],"CCID<sub>50</sub>","chemical",false,null,null,1,false,true,0,"CCID50; 50% cell culture infective doses","UCUM","NumThres","Clinical","","1","1","1",1,false],[false,"50% tissue culture infectious dose","[TCID_50]","[TCID_50]","biologic activity (infectivity) of an infectious agent preparation",1,[0,0,0,0,0,0,0],"TCID<sub>50</sub>","chemical",false,null,null,1,false,true,0,"TCID50; 50% tissue culture infective dose","UCUM","NumThres","Clinical","","1","1","1",1,false],[false,"50% embryo infectious dose","[EID_50]","[EID_50]","biologic activity (infectivity) of an infectious agent preparation",1,[0,0,0,0,0,0,0],"EID<sub>50</sub>","chemical",false,null,null,1,false,true,0,"EID50; 50% embryo infective doses; EID50 Egg Infective Dosage","UCUM","thresNum","Clinical","","1","1","1",1,false],[false,"plaque forming units","[PFU]","[PFU]","amount of an infectious agent",1,[0,0,0,0,0,0,0],"PFU","chemical",false,null,null,1,false,true,0,"PFU","UCUM","ACnc","Clinical","tests usually report unit as number of PFU per unit volume","1","1","1",1,false],[false,"focus forming units (cells)","[FFU]","[FFU]","amount of an infectious agent",1,[0,0,0,0,0,0,0],"FFU","chemical",false,null,null,1,false,true,0,"FFU","UCUM","EntNum","Clinical","","1","1","1",1,false],[false,"colony forming units","[CFU]","[CFU]","amount of a proliferating organism",1,[0,0,0,0,0,0,0],"CFU","chemical",false,null,null,1,false,true,0,"CFU","UCUM","Num","Clinical","","1","1","1",1,false],[false,"index of reactivity (allergen)","[IR]","[IR]","amount of an allergen callibrated through in-vivo testing using the Stallergenes® method.",1,[0,0,0,0,0,0,0],"IR","chemical",false,null,null,1,false,true,0,"IR; indexes","UCUM","Acnc","Clinical","amount of an allergen callibrated through in-vivo testing using the Stallergenes method. Usually reported in tests as IR/mL","1","1","1",1,false],[false,"bioequivalent allergen unit","[BAU]","[BAU]","amount of an allergen callibrated through in-vivo testing based on the ID50EAL method of (intradermal dilution for 50mm sum of erythema diameters",1,[0,0,0,0,0,0,0],"BAU","chemical",false,null,null,1,false,true,0,"BAU; Bioequivalent Allergy Units; bioequivalent allergen units","UCUM","Arb","Clinical","","1","1","1",1,false],[false,"allergy unit","[AU]","[AU]","procedure defined amount of an allergen using some reference standard",1,[0,0,0,0,0,0,0],"AU","chemical",false,null,null,1,false,true,0,"allergy units; allergen units; AU","UCUM","Arb","Clinical","Most standard test allergy units are reported as [IU] or as %. ","1","1","1",1,false],[false,"allergen unit for Ambrosia artemisiifolia","[Amb'a'1'U]","[AMB'A'1'U]","procedure defined amount of the major allergen of ragweed.",1,[0,0,0,0,0,0,0],"Amb a 1 U","chemical",false,null,null,1,false,true,0,"Amb a 1 unit; Antigen E; AgE U; allergen units","UCUM","Arb","Clinical","Amb a 1 is the major allergen in short ragweed, and can be converted Bioequivalent allergen units (BAU) where 350 Amb a 1 U/mL = 100,000 BAU/mL","1","1","1",1,false],[false,"protein nitrogen unit (allergen testing)","[PNU]","[PNU]","procedure defined amount of a protein substance",1,[0,0,0,0,0,0,0],"PNU","chemical",false,null,null,1,false,true,0,"protein nitrogen units; PNU","UCUM","Mass","Clinical","defined as 0.01 ug of phosphotungstic acid-precipitable protein nitrogen. Being replaced by bioequivalent allergy units (BAU).","1","1","1",1,false],[false,"Limit of flocculation","[Lf]","[LF]","procedure defined amount of an antigen substance",1,[0,0,0,0,0,0,0],"Lf","chemical",false,null,null,1,false,true,0,"Lf doses","UCUM","Arb","Clinical","the antigen content  forming 1:1 ratio against 1 unit of antitoxin","1","1","1",1,false],[false,"D-antigen unit (polio)","[D'ag'U]","[D'AG'U]","procedure defined amount of a poliomyelitis d-antigen substance",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"DAgU; units","UCUM","Acnc","Clinical","unit of potency of poliovirus vaccine used for poliomyelitis prevention reported as D antigen units/mL. The unit is poliovirus type-specific.","1","1","1",1,false],[false,"fibrinogen equivalent units","[FEU]","[FEU]","amount of fibrinogen broken down into the measured d-dimers",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"FEU","UCUM","MCnc","Clinical","Note both the FEU and DDU units are used to report D-dimer measurements. 1 DDU = 1/2 FFU","1","1","1",1,false],[false,"ELISA unit","[ELU]","[ELU]","arbitrary ELISA unit",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"Enzyme-Linked Immunosorbent Assay Units; ELU; EL. U","UCUM","ACnc","Clinical","","1","1","1",1,false],[false,"Ehrlich units (urobilinogen)","[EU]","[EU]","Ehrlich unit",1,[0,0,0,0,0,0,0],null,"chemical",false,null,null,1,false,true,0,"EU/dL; mg{urobilinogen}/dL","UCUM","ACnc","Clinical","","1","1","1",1,false],[false,"neper","Np","NEP","level",1,[0,0,0,0,0,0,0],"Np","levels",true,null,"ln",1,true,false,0,"nepers","UCUM","LogRto","Clinical","logarithmic unit for ratios of measurements of physical field and power quantities, such as gain and loss of electronic signals","1",null,null,1,false],[false,"bel","B","B","level",1,[0,0,0,0,0,0,0],"B","levels",true,null,"lg",1,true,false,0,"bels","UCUM","LogRto","Clinical","Logarithm of the ratio of power- or field-type quantities; usually expressed in decibels ","1",null,null,1,false],[false,"bel sound pressure","B[SPL]","B[SPL]","pressure level",0.019999999999999997,[-1,-2,1,0,0,0,0],"B(SPL)","levels",true,null,"lgTimes2",1,true,false,0,"bel SPL; B SPL; sound pressure bels","UCUM","LogRto","Clinical","used to measure sound level in acoustics","Pa",null,null,0.000019999999999999998,false],[false,"bel volt","B[V]","B[V]","electric potential level",1000,[2,-2,1,0,0,-1,0],"B(V)","levels",true,null,"lgTimes2",1,true,false,0,"bel V; B V; volts bels","UCUM","LogRtoElp","Clinical","used to express power gain in electrical circuits","V",null,null,1,false],[false,"bel millivolt","B[mV]","B[MV]","electric potential level",1,[2,-2,1,0,0,-1,0],"B(mV)","levels",true,null,"lgTimes2",1,true,false,0,"bel mV; B mV; millivolt bels; 10^-3V bels; 10*-3V ","UCUM","LogRtoElp","Clinical","used to express power gain in electrical circuits","mV",null,null,1,false],[false,"bel microvolt","B[uV]","B[UV]","electric potential level",0.001,[2,-2,1,0,0,-1,0],"B(μV)","levels",true,null,"lgTimes2",1,true,false,0,"bel uV; B uV; microvolts bels; 10^-6V bel; 10*-6V bel","UCUM","LogRto","Clinical","used to express power gain in electrical circuits","uV",null,null,1,false],[false,"bel 10 nanovolt","B[10.nV]","B[10.NV]","electric potential level",0.000010000000000000003,[2,-2,1,0,0,-1,0],"B(10 nV)","levels",true,null,"lgTimes2",1,true,false,0,"bel 10 nV; B 10 nV; 10 nanovolts bels","UCUM","LogRtoElp","Clinical","used to express power gain in electrical circuits","nV",null,null,10,false],[false,"bel watt","B[W]","B[W]","power level",1000,[2,-3,1,0,0,0,0],"B(W)","levels",true,null,"lg",1,true,false,0,"bel W; b W; b Watt; Watts bels","UCUM","LogRto","Clinical","used to express power","W",null,null,1,false],[false,"bel kilowatt","B[kW]","B[KW]","power level",1000000,[2,-3,1,0,0,0,0],"B(kW)","levels",true,null,"lg",1,true,false,0,"bel kW; B kW; kilowatt bel; kW bel; kW B","UCUM","LogRto","Clinical","used to express power","kW",null,null,1,false],[false,"stere","st","STR","volume",1,[3,0,0,0,0,0,0],"st","misc",true,null,null,1,false,false,0,"stère; m3; cubic meter; m^3; meters cubed; metre","UCUM","Vol","Nonclinical","equal to one cubic meter, usually used for measuring firewood","m3","M3","1",1,false],[false,"Ångström","Ao","AO","length",1.0000000000000002e-10,[1,0,0,0,0,0,0],"Å","misc",false,null,null,1,false,false,0,"Å; Angstroms; Ao; Ångströms","UCUM","Len","Clinical","equal to 10^-10 meters; used to express wave lengths and atom scaled differences ","nm","NM","0.1",0.1,false],[false,"barn","b","BRN","action area",1.0000000000000001e-28,[2,0,0,0,0,0,0],"b","misc",false,null,null,1,false,false,0,"barns","UCUM","Area","Clinical","used in high-energy physics to express cross-sectional areas","fm2","FM2","100",100,false],[false,"technical atmosphere","att","ATT","pressure",98066500,[-1,-2,1,0,0,0,0],"at","misc",false,null,null,1,false,false,0,"at; tech atm; tech atmosphere; kgf/cm2; atms; atmospheres","UCUM","Pres","Obsolete","non-SI unit of pressure equal to one kilogram-force per square centimeter","kgf/cm2","KGF/CM2","1",1,false],[false,"mho","mho","MHO","electric conductance",0.001,[-2,1,-1,0,0,2,0],"mho","misc",true,null,null,1,false,false,0,"siemens; ohm reciprocals; Ω^−1; Ω-1 ","UCUM","","Obsolete","unit of electric conductance (the inverse of electrical resistance) equal to ohm^-1","S","S","1",1,false],[false,"pound per square inch","[psi]","[PSI]","pressure",6894757.293168359,[-1,-2,1,0,0,0,0],"psi","misc",false,null,null,1,false,false,0,"psi; lb/in2; lb per in2","UCUM","Pres","Clinical","","[lbf_av]/[in_i]2","[LBF_AV]/[IN_I]2","1",1,false],[false,"circle - plane angle","circ","CIRC","plane angle",6.283185307179586,[0,0,0,1,0,0,0],"circ","misc",false,null,null,1,false,false,0,"angles; circles","UCUM","Angle","Clinical","","[pi].rad","[PI].RAD","2",2,false],[false,"spere - solid angle","sph","SPH","solid angle",12.566370614359172,[0,0,0,2,0,0,0],"sph","misc",false,null,null,1,false,false,0,"speres","UCUM","Angle","Clinical","equal to the solid angle of an entire sphere = 4πsr (sr = steradian) ","[pi].sr","[PI].SR","4",4,false],[false,"metric carat","[car_m]","[CAR_M]","mass",0.2,[0,0,1,0,0,0,0],"ct<sub>m</sub>","misc",false,null,null,1,false,false,0,"carats; ct; car m","UCUM","Mass","Nonclinical","unit of mass for gemstones","g","G","2e-1",0.2,false],[false,"carat of gold alloys","[car_Au]","[CAR_AU]","mass fraction",0.041666666666666664,[0,0,0,0,0,0,0],"ct<sub><r>Au</r></sub>","misc",false,null,null,1,false,false,0,"karats; k; kt; car au; carats","UCUM","MFr","Nonclinical","unit of purity for gold alloys","/24","/24","1",1,false],[false,"Smoot","[smoot]","[SMOOT]","length",1.7018000000000002,[1,0,0,0,0,0,0],null,"misc",false,null,null,1,false,false,0,"","UCUM","Len","Nonclinical","prank unit of length from MIT","[in_i]","[IN_I]","67",67,false],[false,"meter per square seconds per square root of hertz","[m/s2/Hz^(1/2)]","[M/S2/HZ^(1/2)]","amplitude spectral density",1,[2,-3,0,0,0,0,0],null,"misc",false,null,"sqrt",1,true,false,0,"m/s2/(Hz^.5); m/s2/(Hz^(1/2)); m per s2 per Hz^1/2","UCUM","","Constant","measures amplitude spectral density, and is equal to the square root of power spectral density\\n ","m2/s4/Hz",null,null,1,false],[false,"bit - logarithmic","bit_s","BIT_S","amount of information",1,[0,0,0,0,0,0,0],"bit<sub>s</sub>","infotech",false,null,"ld",1,true,false,0,"bit-s; bit s; bit logarithmic","UCUM","LogA","Nonclinical","defined as the log base 2 of the number of distinct signals; cannot practically be used to express more than 1000 bits\\n\\nIn information theory, the definition of the amount of self-information and information entropy is often expressed with the binary logarithm (log base 2)","1",null,null,1,false],[false,"bit","bit","BIT","amount of information",1,[0,0,0,0,0,0,0],"bit","infotech",true,null,null,1,false,false,0,"bits","UCUM","","Nonclinical","dimensionless information unit of 1 used in computing and digital communications","1","1","1",1,false],[false,"byte","By","BY","amount of information",8,[0,0,0,0,0,0,0],"B","infotech",true,null,null,1,false,false,0,"bytes","UCUM","","Nonclinical","equal to 8 bits","bit","bit","8",8,false],[false,"baud","Bd","BD","signal transmission rate",1,[0,1,0,0,0,0,0],"Bd","infotech",true,null,"inv",1,false,false,0,"Bd; bauds","UCUM","Freq","Nonclinical","unit to express rate in symbols per second or pulses per second. ","s","/s","1",1,false],[false,"per twelve hour","/(12.h)","1/(12.HR)","",0.000023148148148148147,[0,-1,0,0,0,0,0],"/h",null,false,null,null,1,false,false,0,"per 12 hours; 12hrs; 12 hrs; /12hrs","LOINC","Rat","Clinical","",null,null,null,null,false],[false,"per arbitrary unit","/[arb'U]","1/[ARB'U]","",1,[0,0,0,0,0,0,0],"/arb/ U",null,false,null,null,1,false,true,0,"/arbU","LOINC","InvA ","Clinical","",null,null,null,null,false],[false,"per high power field","/[HPF]","1/[HPF]","",1,[0,0,0,0,0,0,0],"/HPF",null,false,null,null,1,false,false,0,"/HPF; per HPF","LOINC","Naric","Clinical","",null,null,null,null,false],[false,"per international unit","/[IU]","1/[IU]","",1,[0,0,0,0,0,0,0],"/i/U.",null,false,null,null,1,false,true,0,"international units; /IU; per IU","LOINC","InvA","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)",null,null,null,null,false],[false,"per low power field","/[LPF]","1/[LPF]","",1,[0,0,0,0,0,0,0],"/LPF",null,false,null,null,1,false,false,0,"/LPF; per LPF","LOINC","Naric","Clinical","",null,null,null,null,false],[false,"per 10 billion  ","/10*10","1/(10*10)","",1e-10,[0,0,0,0,0,0,0],"/10<sup>10</sup>",null,false,null,null,1,false,false,0,"/10^10; per 10*10","LOINC","NFr","Clinical","used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator",null,null,null,null,false],[false,"per trillion ","/10*12","1/(10*12)","",1e-12,[0,0,0,0,0,0,0],"/10<sup>12</sup>",null,false,null,null,1,false,false,0,"/10^12; per 10*12","LOINC","NFr","Clinical","used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator",null,null,null,null,false],[false,"per thousand","/10*3","1/(10*3)","",0.001,[0,0,0,0,0,0,0],"/10<sup>3</sup>",null,false,null,null,1,false,false,0,"/10^3; per 10*3","LOINC","NFr","Clinical","used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator",null,null,null,null,false],[false,"per million","/10*6","1/(10*6)","",0.000001,[0,0,0,0,0,0,0],"/10<sup>6</sup>",null,false,null,null,1,false,false,0,"/10^6; per 10*6;","LOINC","NFr","Clinical","used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator",null,null,null,null,false],[false,"per billion","/10*9","1/(10*9)","",1e-9,[0,0,0,0,0,0,0],"/10<sup>9</sup>",null,false,null,null,1,false,false,0,"/10^9; per 10*9","LOINC","NFr","Clinical","used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator",null,null,null,null,false],[false,"per 100","/100","1/100","",0.01,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"per hundred; 10^2; 10*2","LOINC","NFr","Clinical","used for counting entities, e.g. blood cells; usually these kinds of terms have numerators such as moles or milligrams, and counting that amount per the number in the denominator",null,null,null,null,false],[false,"per 100 cells","/100{cells}","1/100","",0.01,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"/100 cells; /100cells; per hundred","LOINC","EntMass; EntNum; NFr","Clinical","",null,null,null,null,false],[false,"per 100 neutrophils","/100{neutrophils}","1/100","",0.01,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"/100 neutrophils; /100neutrophils; per hundred","LOINC","EntMass; EntNum; NFr","Clinical","",null,null,null,null,false],[false,"per 100 spermatozoa","/100{spermatozoa}","1/100","",0.01,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"/100 spermatozoa; /100spermatozoa; per hundred","LOINC","NFr","Clinical","",null,null,null,null,false],[false,"per 100 white blood cells","/100{WBCs}","1/100","",0.01,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"/100 WBCs; /100WBCs; per hundred","LOINC","Ratio; NFr","Clinical","",null,null,null,null,false],[false,"per year","/a","1/ANN","",3.168808781402895e-8,[0,-1,0,0,0,0,0],"/a",null,false,null,null,1,false,false,0,"/Years; /yrs; yearly","LOINC","NRat","Clinical","",null,null,null,null,false],[false,"per centimeter of water","/cm[H2O]","1/CM[H2O]","",0.000010197162129779282,[1,2,-1,0,0,0,0],"/cm HO<sub><r>2</r></sub>",null,false,null,null,1,false,false,0,"/cmH2O; /cm H2O; centimeters; centimetres","LOINC","InvPress","Clinical","",null,null,null,null,false],[false,"per day","/d","1/D","",0.000011574074074074073,[0,-1,0,0,0,0,0],"/d",null,false,null,null,1,false,false,0,"/dy; per day","LOINC","NRat","Clinical","",null,null,null,null,false],[false,"per deciliter","/dL","1/DL","",10000,[-3,0,0,0,0,0,0],"/dL",null,false,null,null,1,false,false,0,"per dL; /deciliter; decilitre","LOINC","NCnc","Clinical","",null,null,null,null,false],[false,"per gram","/g","1/G","",1,[0,0,-1,0,0,0,0],"/g",null,false,null,null,1,false,false,0,"/gm; /gram; per g","LOINC","NCnt","Clinical","",null,null,null,null,false],[false,"per hour","/h","1/HR","",0.0002777777777777778,[0,-1,0,0,0,0,0],"/h",null,false,null,null,1,false,false,0,"/hr; /hour; per hr","LOINC","NRat","Clinical","",null,null,null,null,false],[false,"per kilogram","/kg","1/KG","",0.001,[0,0,-1,0,0,0,0],"/kg",null,false,null,null,1,false,false,0,"per kg; per kilogram","LOINC","NCnt","Clinical","",null,null,null,null,false],[false,"per liter","/L","1/L","",1000,[-3,0,0,0,0,0,0],"/L",null,false,null,null,1,false,false,0,"/liter; litre","LOINC","NCnc","Clinical","",null,null,null,null,false],[false,"per square meter","/m2","1/M2","",1,[-2,0,0,0,0,0,0],"/m<sup>2</sup>",null,false,null,null,1,false,false,0,"/m^2; /m*2; /sq. m; per square meter; meter squared; metre","LOINC","Naric","Clinical","",null,null,null,null,false],[false,"per cubic meter","/m3","1/M3","",1,[-3,0,0,0,0,0,0],"/m<sup>3</sup>",null,false,null,null,1,false,false,0,"/m^3; /m*3; /cu. m; per cubic meter; meter cubed; per m3; metre","LOINC","NCncn","Clinical","",null,null,null,null,false],[false,"per milligram","/mg","1/MG","",1000,[0,0,-1,0,0,0,0],"/mg",null,false,null,null,1,false,false,0,"/milligram; per mg","LOINC","NCnt","Clinical","",null,null,null,null,false],[false,"per minute","/min","1/MIN","",0.016666666666666666,[0,-1,0,0,0,0,0],"/min",null,false,null,null,1,false,false,0,"/minute; per mins; breaths beats per minute","LOINC","NRat","Clinical","",null,null,null,null,false],[false,"per milliliter","/mL","1/ML","",1000000,[-3,0,0,0,0,0,0],"/mL",null,false,null,null,1,false,false,0,"/milliliter; per mL; millilitre","LOINC","NCncn","Clinical","",null,null,null,null,false],[false,"per millimeter","/mm","1/MM","",1000,[-1,0,0,0,0,0,0],"/mm",null,false,null,null,1,false,false,0,"/millimeter; per mm; millimetre","LOINC","InvLen","Clinical","",null,null,null,null,false],[false,"per month","/mo","1/MO","",3.802570537683474e-7,[0,-1,0,0,0,0,0],"/mo",null,false,null,null,1,false,false,0,"/month; per mo; monthly; month","LOINC","NRat","Clinical","",null,null,null,null,false],[false,"per second","/s","1/S","",1,[0,-1,0,0,0,0,0],"/s",null,false,null,null,1,false,false,0,"/second; /sec; per sec; frequency; Hertz; Herz; Hz; becquerels; Bq; s-1; s^-1","LOINC","NRat","Clinical","",null,null,null,null,false],[false,"per enzyme unit","/U","1/U","",9.963241120049633e-17,[0,1,0,0,0,0,0],"/U",null,false,null,null,1,false,false,-1,"/enzyme units; per U","LOINC","InvC; NCat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)",null,null,null,null,false],[false,"per microliter","/uL","1/UL","",999999999.9999999,[-3,0,0,0,0,0,0],"/μL",null,false,null,null,1,false,false,0,"/microliter; microlitre; /mcl; per uL","LOINC","ACnc","Clinical","",null,null,null,null,false],[false,"per week","/wk","1/WK","",0.0000016534391534391535,[0,-1,0,0,0,0,0],"/wk",null,false,null,null,1,false,false,0,"/week; per wk; weekly, weeks","LOINC","NRat","Clinical","",null,null,null,null,false],[false,"APL unit per milliliter","[APL'U]/mL","[APL'U]/ML","biologic activity of anticardiolipin IgA",1000000,[-3,0,0,0,0,0,0],"/mL","chemical",false,null,null,1,false,true,0,"APL/mL; APL'U/mL; APL U/mL; APL/milliliter; IgA anticardiolipin units per milliliter; IgA Phospholipid Units; millilitre; biologic activity of","LOINC","ACnc","Clinical","Units for an anti phospholipid syndrome test","1","1","1",1,false],[false,"arbitrary unit per milliliter","[arb'U]/mL","[ARB'U]/ML","arbitrary",1000000,[-3,0,0,0,0,0,0],"(arb. U)/mL","chemical",false,null,null,1,false,true,0,"arb'U/mL; arbU/mL; arb U/mL; arbitrary units per milliliter; millilitre","LOINC","ACnc","Clinical","relative unit of measurement to show the ratio of test measurement to reference measurement","1","1","1",1,false],[false,"colony forming units per liter","[CFU]/L","[CFU]/L","amount of a proliferating organism",1000,[-3,0,0,0,0,0,0],"CFU/L","chemical",false,null,null,1,false,true,0,"CFU per Liter; CFU/L","LOINC","NCnc","Clinical","","1","1","1",1,false],[false,"colony forming units per milliliter","[CFU]/mL","[CFU]/ML","amount of a proliferating organism",1000000,[-3,0,0,0,0,0,0],"CFU/mL","chemical",false,null,null,1,false,true,0,"CFU per mL; CFU/mL","LOINC","NCnc","Clinical","","1","1","1",1,false],[false,"foot per foot - US","[ft_us]/[ft_us]","[FT_US]/[FT_US]","length",1,[0,0,0,0,0,0,0],"(ft<sub>us</sub>)/(ft<sub>us</sub>)","us-lengths",false,null,null,1,false,false,0,"ft/ft; ft per ft; feet per feet; visual acuity","","LenRto","Clinical","distance ratio to measure 20:20 vision","m/3937","M/3937","1200",1200,false],[false,"GPL unit per milliliter","[GPL'U]/mL","[GPL'U]/ML","biologic activity of anticardiolipin IgG",1000000,[-3,0,0,0,0,0,0],"/mL","chemical",false,null,null,1,false,true,0,"GPL U/mL; GPL'U/mL; GPL/mL; GPL U per mL; IgG Phospholipid Units per milliliters; IgG anticardiolipin units; millilitres ","LOINC","ACnc; AMass","Clinical","Units for an antiphospholipid test","1","1","1",1,false],[false,"international unit per 2 hour","[IU]/(2.h)","[IU]/(2.HR)","arbitrary",0.0001388888888888889,[0,-1,0,0,0,0,0],"(i.U.)/h","chemical",true,null,null,1,false,true,0,"IU/2hrs; IU/2 hours; IU per 2 hrs; international units per 2 hours","LOINC","ARat","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per 24 hour","[IU]/(24.h)","[IU]/(24.HR)","arbitrary",0.000011574074074074073,[0,-1,0,0,0,0,0],"(i.U.)/h","chemical",true,null,null,1,false,true,0,"IU/24hr; IU/24 hours; IU per 24 hrs; international units per 24 hours","LOINC","ARat","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per day","[IU]/d","[IU]/D","arbitrary",0.000011574074074074073,[0,-1,0,0,0,0,0],"(i.U.)/d","chemical",true,null,null,1,false,true,0,"IU/dy; IU/days; IU per dys; international units per day","LOINC","ARat","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per deciliter","[IU]/dL","[IU]/DL","arbitrary",10000,[-3,0,0,0,0,0,0],"(i.U.)/dL","chemical",true,null,null,1,false,true,0,"IU/dL; IU per dL; international units per deciliters; decilitres","LOINC","ACnc","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per gram","[IU]/g","[IU]/G","arbitrary",1,[0,0,-1,0,0,0,0],"(i.U.)/g","chemical",true,null,null,1,false,true,0,"IU/gm; IU/gram; IU per gm; IU per g; international units per gram","LOINC","ACnt","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per hour","[IU]/h","[IU]/HR","arbitrary",0.0002777777777777778,[0,-1,0,0,0,0,0],"(i.U.)/h","chemical",true,null,null,1,false,true,0,"IU/hrs; IU per hours; international units per hour","LOINC","ARat","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per kilogram","[IU]/kg","[IU]/KG","arbitrary",0.001,[0,0,-1,0,0,0,0],"(i.U.)/kg","chemical",true,null,null,1,false,true,0,"IU/kg; IU/kilogram; IU per kg; units","LOINC","ACnt","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per kilogram per day","[IU]/kg/d","([IU]/KG)/D","arbitrary",1.1574074074074074e-8,[0,-1,-1,0,0,0,0],"((i.U.)/kg)/d","chemical",true,null,null,1,false,true,0,"IU/kg/dy; IU/kg/day; IU/kilogram/day; IU per kg per day; units","LOINC","ACntRat","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per liter","[IU]/L","[IU]/L","arbitrary",1000,[-3,0,0,0,0,0,0],"(i.U.)/L","chemical",true,null,null,1,false,true,0,"IU/L; IU/liter; IU per liter; units; litre","LOINC","ACnc","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per minute","[IU]/min","[IU]/MIN","arbitrary",0.016666666666666666,[0,-1,0,0,0,0,0],"(i.U.)/min","chemical",true,null,null,1,false,true,0,"IU/min; IU/minute; IU per minute; international units","LOINC","ARat","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"international unit per milliliter","[IU]/mL","[IU]/ML","arbitrary",1000000,[-3,0,0,0,0,0,0],"(i.U.)/mL","chemical",true,null,null,1,false,true,0,"IU/mL; IU per mL; international units per milliliter; millilitre","LOINC","ACnc","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"MPL unit per milliliter","[MPL'U]/mL","[MPL'U]/ML","biologic activity of anticardiolipin IgM",1000000,[-3,0,0,0,0,0,0],"/mL","chemical",false,null,null,1,false,true,0,"MPL/mL; MPL U/mL; MPL'U/mL; IgM anticardiolipin units; IgM Phospholipid Units; millilitre ","LOINC","ACnc","Clinical","units for antiphospholipid test\\n","1","1","1",1,false],[false,"number per high power field","{#}/[HPF]","{#}/[HPF]","",1,[0,0,0,0,0,0,0],"/HPF",null,false,null,null,1,false,false,0,"#/HPF; # per HPF; number/HPF; numbers per high power field","LOINC","Naric","Clinical","",null,null,null,null,false],[false,"number per low power field","{#}/[LPF]","{#}/[LPF]","",1,[0,0,0,0,0,0,0],"/LPF",null,false,null,null,1,false,false,0,"#/LPF; # per LPF; number/LPF; numbers per low power field","LOINC","Naric","Clinical","",null,null,null,null,false],[false,"IgA antiphosphatidylserine unit ","{APS'U}","{APS'U}","",1,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"APS Unit; Phosphatidylserine Antibody IgA Units","LOINC","ACnc","Clinical","unit for antiphospholipid test",null,null,null,null,false],[false,"EIA index","{EIA_index}","{EIA_index}","",1,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"enzyme immunoassay index","LOINC","ACnc","Clinical","",null,null,null,null,false],[false,"kaolin clotting time","{KCT'U}","{KCT'U}","",1,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"KCT","LOINC","Time","Clinical","sensitive test to detect lupus anticoagulants; measured in seconds",null,null,null,null,false],[false,"IgM antiphosphatidylserine unit","{MPS'U}","{MPS'U}","",1,[0,0,0,0,0,0,0],null,null,false,null,null,1,false,false,0,"Phosphatidylserine Antibody IgM Measurement ","LOINC","ACnc","Clinical","",null,null,null,null,false],[false,"trillion per liter","10*12/L","(10*12)/L","number",1000000000000000,[-3,0,0,0,0,0,0],"(10<sup>12</sup>)/L","dimless",false,null,null,1,false,false,0,"10^12/L; 10*12 per Liter; trillion per liter; litre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"10^3 (used for cell count)","10*3","10*3","number",1000,[0,0,0,0,0,0,0],"10<sup>3</sup>","dimless",false,null,null,1,false,false,0,"10^3; thousand","LOINC","Num","Clinical","usually used for counting entities (e.g. blood cells) per volume","1","1","10",10,false],[false,"thousand per liter","10*3/L","(10*3)/L","number",1000000,[-3,0,0,0,0,0,0],"(10<sup>3</sup>)/L","dimless",false,null,null,1,false,false,0,"10^3/L; 10*3 per liter; litre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"thousand per milliliter","10*3/mL","(10*3)/ML","number",1000000000,[-3,0,0,0,0,0,0],"(10<sup>3</sup>)/mL","dimless",false,null,null,1,false,false,0,"10^3/mL; 10*3 per mL; thousand per milliliter; millilitre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"thousand per microliter","10*3/uL","(10*3)/UL","number",999999999999.9999,[-3,0,0,0,0,0,0],"(10<sup>3</sup>)/μL","dimless",false,null,null,1,false,false,0,"10^3/uL; 10*3 per uL; thousand per microliter; microlitre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"10 thousand per microliter","10*4/uL","(10*4)/UL","number",10000000000000,[-3,0,0,0,0,0,0],"(10<sup>4</sup>)/μL","dimless",false,null,null,1,false,false,0,"10^4/uL; 10*4 per uL; microlitre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"10^5 ","10*5","10*5","number",100000,[0,0,0,0,0,0,0],"10<sup>5</sup>","dimless",false,null,null,1,false,false,0,"one hundred thousand","LOINC","Num","Clinical","","1","1","10",10,false],[false,"10^6","10*6","10*6","number",1000000,[0,0,0,0,0,0,0],"10<sup>6</sup>","dimless",false,null,null,1,false,false,0,"","LOINC","Num","Clinical","","1","1","10",10,false],[false,"million colony forming unit per liter","10*6.[CFU]/L","((10*6).[CFU])/L","number",1000000000,[-3,0,0,0,0,0,0],"((10<sup>6</sup>).CFU)/L","dimless",false,null,null,1,false,true,0,"10*6 CFU/L; 10^6 CFU/L; 10^6CFU; 10^6 CFU per liter; million colony forming units; litre","LOINC","ACnc","Clinical","","1","1","10",10,false],[false,"million international unit","10*6.[IU]","(10*6).[IU]","number",1000000,[0,0,0,0,0,0,0],"(10<sup>6</sup>).(i.U.)","dimless",false,null,null,1,false,true,0,"10*6 IU; 10^6 IU; international units","LOINC","arb","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","1","1","10",10,false],[false,"million per 24 hour","10*6/(24.h)","(10*6)/(24.HR)","number",11.574074074074074,[0,-1,0,0,0,0,0],"(10<sup>6</sup>)/h","dimless",false,null,null,1,false,false,0,"10*6/24hrs; 10^6/24 hrs; 10*6 per 24 hrs; 10^6 per 24 hours","LOINC","NRat","Clinical","","1","1","10",10,false],[false,"million per kilogram","10*6/kg","(10*6)/KG","number",1000,[0,0,-1,0,0,0,0],"(10<sup>6</sup>)/kg","dimless",false,null,null,1,false,false,0,"10^6/kg; 10*6 per kg; 10*6 per kilogram; millions","LOINC","NCnt","Clinical","","1","1","10",10,false],[false,"million per liter","10*6/L","(10*6)/L","number",1000000000,[-3,0,0,0,0,0,0],"(10<sup>6</sup>)/L","dimless",false,null,null,1,false,false,0,"10^6/L; 10*6 per Liter; 10^6 per Liter; litre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"million per milliliter","10*6/mL","(10*6)/ML","number",1000000000000,[-3,0,0,0,0,0,0],"(10<sup>6</sup>)/mL","dimless",false,null,null,1,false,false,0,"10^6/mL; 10*6 per mL; 10*6 per milliliter; millilitre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"million per microliter","10*6/uL","(10*6)/UL","number",1000000000000000,[-3,0,0,0,0,0,0],"(10<sup>6</sup>)/μL","dimless",false,null,null,1,false,false,0,"10^6/uL; 10^6 per uL; 10^6/mcl; 10^6 per mcl; 10^6 per microliter; microlitre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"10^8","10*8","10*8","number",100000000,[0,0,0,0,0,0,0],"10<sup>8</sup>","dimless",false,null,null,1,false,false,0,"100 million; one hundred million; 10^8","LOINC","Num","Clinical","","1","1","10",10,false],[false,"billion per liter","10*9/L","(10*9)/L","number",1000000000000,[-3,0,0,0,0,0,0],"(10<sup>9</sup>)/L","dimless",false,null,null,1,false,false,0,"10^9/L; 10*9 per Liter; litre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"billion per milliliter","10*9/mL","(10*9)/ML","number",1000000000000000,[-3,0,0,0,0,0,0],"(10<sup>9</sup>)/mL","dimless",false,null,null,1,false,false,0,"10^9/mL; 10*9 per mL; 10^9 per mL; 10*9 per milliliter; millilitre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"billion per microliter","10*9/uL","(10*9)/UL","number",1000000000000000000,[-3,0,0,0,0,0,0],"(10<sup>9</sup>)/μL","dimless",false,null,null,1,false,false,0,"10^9/uL; 10^9 per uL; 10^9/mcl; 10^9 per mcl; 10*9 per uL; 10*9 per mcl; 10*9/mcl; 10^9 per microliter; microlitre","LOINC","NCncn","Clinical","","1","1","10",10,false],[false,"10 liter per minute per square meter","10.L/(min.m2)","(10.L)/(MIN.M2)","",0.00016666666666666666,[1,-1,0,0,0,0,0],"L/(min.(m<sup>2</sup>))",null,false,null,null,1,false,false,0,"10 liters per minutes per square meter; 10 L per min per m2; m^2; 10 L/(min*m2); 10L/(min*m^2); litres; sq. meter; metre; meters squared","LOINC","ArVRat","Clinical","",null,null,null,null,false],[false,"10 liter per minute","10.L/min","(10.L)/MIN","",0.00016666666666666666,[3,-1,0,0,0,0,0],"L/min",null,false,null,null,1,false,false,0,"10 liters per minute; 10 L per min; 10L; 10 L/min; litre","LOINC","VRat","Clinical","",null,null,null,null,false],[false,"10 micronewton second per centimeter to the fifth power per square meter","10.uN.s/(cm5.m2)","((10.UN).S)/(CM5.M2)","",100000000,[-6,-1,1,0,0,0,0],"(μN.s)/(cm<sup>5</sup>).(m<sup>2</sup>)",null,false,null,null,1,false,false,0,"dyne seconds per centimeter5 and square meter; dyn.s/(cm5.m2); dyn.s/cm5/m2; cm^5; m^2","LOINC","","Clinical","unit to measure systemic vascular resistance per body surface area",null,null,null,null,false],[false,"24 hour","24.h","24.HR","",86400,[0,1,0,0,0,0,0],"h",null,false,null,null,1,false,false,0,"24hrs; 24 hrs; 24 hours; days; dy","LOINC","Time","Clinical","",null,null,null,null,false],[false,"ampere per meter","A/m","A/M","electric current",1,[-1,-1,0,0,0,1,0],"A/m","si",true,null,null,1,false,false,0,"A/m; amp/meter; magnetic field strength; H; B; amperes per meter; metre","LOINC","","Clinical","unit of magnetic field strength","C/s","C/S","1",1,false],[false,"centigram","cg","CG","mass",0.01,[0,0,1,0,0,0,0],"cg",null,false,"M",null,1,false,false,0,"centigrams; cg; cgm","LOINC","Mass","Clinical","",null,null,null,null,false],[false,"centiliter","cL","CL","volume",0.00001,[3,0,0,0,0,0,0],"cL","iso1000",true,null,null,1,false,false,0,"centiliters; centilitres","LOINC","Vol","Clinical","","l",null,"1",1,false],[false,"centimeter","cm","CM","length",0.01,[1,0,0,0,0,0,0],"cm",null,false,"L",null,1,false,false,0,"centimeters; centimetres","LOINC","Len","Clinical","",null,null,null,null,false],[false,"centimeter of water","cm[H2O]","CM[H2O]","pressure",98066.5,[-1,-2,1,0,0,0,0],"cm HO<sub><r>2</r></sub>","clinical",true,null,null,1,false,false,0,"cm H2O; cmH2O; centimetres; pressure","LOINC","Pres","Clinical","unit of pressure mostly applies to blood pressure","kPa","KPAL","980665e-5",9.80665,false],[false,"centimeter of water per liter per second","cm[H2O]/L/s","(CM[H2O]/L)/S","pressure",98066500,[-4,-3,1,0,0,0,0],"((cm HO<sub><r>2</r></sub>)/L)/s","clinical",true,null,null,1,false,false,0,"cm[H2O]/(L/s); cm[H2O].s/L; cm H2O/L/sec; cmH2O/L/sec; cmH2O/Liter; cmH2O per L per secs; centimeters of water per liters per second; centimetres; litres; cm[H2O]/(L/s)","LOINC","PresRat","Clinical","unit used to measure mean pulmonary resistance","kPa","KPAL","980665e-5",9.80665,false],[false,"centimeter of water per second per meter","cm[H2O]/s/m","(CM[H2O]/S)/M","pressure",98066.5,[-2,-3,1,0,0,0,0],"((cm HO<sub><r>2</r></sub>)/s)/m","clinical",true,null,null,1,false,false,0,"cm[H2O]/(s.m); cm H2O/s/m; cmH2O; cmH2O/sec/m; cmH2O per secs per meters; centimeters of water per seconds per meter; centimetres; metre","LOINC","PresRat","Clinical","unit used to measure pulmonary pressure time product","kPa","KPAL","980665e-5",9.80665,false],[false,"centimeter of mercury","cm[Hg]","CM[HG]","pressure",1333220,[-1,-2,1,0,0,0,0],"cm Hg","clinical",true,null,null,1,false,false,0,"centimeters of mercury; centimetres; cmHg; cm Hg","LOINC","Pres","Clinical","unit of pressure where 1 cmHg = 10 torr","kPa","KPAL","133.3220",133.322,false],[false,"square centimeter","cm2","CM2","length",0.0001,[2,0,0,0,0,0,0],"cm<sup>2</sup>",null,false,"L",null,1,false,false,0,"cm^2; sq cm; centimeters squared; square centimeters; centimetre; area","LOINC","Area","Clinical","",null,null,null,null,false],[false,"square centimeter per second","cm2/s","CM2/S","length",0.0001,[2,-1,0,0,0,0,0],"(cm<sup>2</sup>)/s",null,false,"L",null,1,false,false,0,"cm^2/sec; square centimeters per second; sq cm per sec; cm2; centimeters squared; centimetres","LOINC","AreaRat","Clinical","",null,null,null,null,false],[false,"centipoise","cP","CP","dynamic viscosity",1.0000000000000002,[-1,-1,1,0,0,0,0],"cP","cgs",true,null,null,1,false,false,0,"cps; centiposes","LOINC","Visc","Clinical","unit of dynamic viscosity in the CGS system with base units: 10^−3 Pa.s = 1 mPa·.s (1 millipascal second)","dyn.s/cm2","DYN.S/CM2","1",1,false],[false,"centistoke","cSt","CST","kinematic viscosity",0.000001,[2,-1,0,0,0,0,0],"cSt","cgs",true,null,null,1,false,false,0,"centistokes","LOINC","Visc","Clinical","unit for kinematic viscosity with base units of mm^2/s (square millimeter per second)","cm2/s","CM2/S","1",1,false],[false,"dekaliter per minute","daL/min","DAL/MIN","volume",0.00016666666666666666,[3,-1,0,0,0,0,0],"daL/min","iso1000",true,null,null,1,false,false,0,"dekalitres; dekaliters per minute; per min","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"dekaliter per minute per square meter","daL/min/m2","(DAL/MIN)/M2","volume",0.00016666666666666666,[1,-1,0,0,0,0,0],"(daL/min)/(m<sup>2</sup>)","iso1000",true,null,null,1,false,false,0,"daL/min/m^2; daL/minute/m2; sq. meter; dekaliters per minutes per square meter; meter squared; dekalitres; metre","LOINC","ArVRat","Clinical","The area usually is the body surface area used to normalize cardiovascular measures for patient's size","l",null,"1",1,false],[false,"decibel","dB","DB","level",1,[0,0,0,0,0,0,0],"dB","levels",true,null,"lg",0.1,true,false,0,"decibels","LOINC","LogRto","Clinical","unit most commonly used in acoustics as unit of sound pressure level. (also see B[SPL] or bel sound pressure level). ","1",null,null,1,false],[false,"degree per second","deg/s","DEG/S","plane angle",0.017453292519943295,[0,-1,0,1,0,0,0],"°/s","iso1000",false,null,null,1,false,false,0,"deg/sec; deg per sec; °/sec; twist rate; angular speed; rotational speed","LOINC","ARat","Clinical","unit of angular (rotational) speed used to express turning rate","[pi].rad/360","[PI].RAD/360","2",2,false],[false,"decigram","dg","DG","mass",0.1,[0,0,1,0,0,0,0],"dg",null,false,"M",null,1,false,false,0,"decigrams; dgm; 0.1 grams; 1/10 gm","LOINC","Mass","Clinical","equal to 1/10 gram",null,null,null,null,false],[false,"deciliter","dL","DL","volume",0.0001,[3,0,0,0,0,0,0],"dL","iso1000",true,null,null,1,false,false,0,"deciliters; decilitres; 0.1 liters; 1/10 L","LOINC","Vol","Clinical","equal to 1/10 liter","l",null,"1",1,false],[false,"decimeter","dm","DM","length",0.1,[1,0,0,0,0,0,0],"dm",null,false,"L",null,1,false,false,0,"decimeters; decimetres; 0.1 meters; 1/10 m; 10 cm; centimeters","LOINC","Len","Clinical","equal to 1/10 meter or 10 centimeters",null,null,null,null,false],[false,"square decimeter per square second","dm2/s2","DM2/S2","length",0.010000000000000002,[2,-2,0,0,0,0,0],"(dm<sup>2</sup>)/(s<sup>2</sup>)",null,false,"L",null,1,false,false,0,"dm2 per s2; dm^2/s^2; decimeters squared per second squared; sq dm; sq sec","LOINC","EngMass (massic energy)","Clinical","units for energy per unit mass or Joules per kilogram (J/kg = kg.m2/s2/kg = m2/s2) ",null,null,null,null,false],[false,"dyne second per centimeter per square meter","dyn.s/(cm.m2)","(DYN.S)/(CM.M2)","force",1,[-2,-1,1,0,0,0,0],"(dyn.s)/(cm.(m<sup>2</sup>))","cgs",true,null,null,1,false,false,0,"(dyn*s)/(cm*m2); (dyn*s)/(cm*m^2); dyn s per cm per m2; m^2; dyne seconds per centimeters per square meter; centimetres; sq. meter; squared","LOINC","","Clinical","","g.cm/s2","G.CM/S2","1",1,false],[false,"dyne second per centimeter","dyn.s/cm","(DYN.S)/CM","force",1,[0,-1,1,0,0,0,0],"(dyn.s)/cm","cgs",true,null,null,1,false,false,0,"(dyn*s)/cm; dyn sec per cm; seconds; centimetre; dyne seconds","LOINC","","Clinical","","g.cm/s2","G.CM/S2","1",1,false],[false,"equivalent per liter","eq/L","EQ/L","amount of substance",6.0221366999999994e+26,[-3,0,0,0,0,0,0],"eq/L","chemical",true,null,null,1,false,false,1,"eq/liter; eq/litre; eqs; equivalents per liter; litre","LOINC","SCnc","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"equivalent per milliliter","eq/mL","EQ/ML","amount of substance",6.0221367e+29,[-3,0,0,0,0,0,0],"eq/mL","chemical",true,null,null,1,false,false,1,"equivalent/milliliter; equivalents per milliliter; eq per mL; millilitre","LOINC","SCnc","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"equivalent per millimole","eq/mmol","EQ/MMOL","amount of substance",1000,[0,0,0,0,0,0,0],"eq/mmol","chemical",true,null,null,1,false,false,0,"equivalent/millimole; equivalents per millimole; eq per mmol","LOINC","SRto","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"equivalent per micromole","eq/umol","EQ/UMOL","amount of substance",1000000,[0,0,0,0,0,0,0],"eq/μmol","chemical",true,null,null,1,false,false,0,"equivalent/micromole; equivalents per micromole; eq per umol","LOINC","SRto","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"femtogram","fg","FG","mass",1e-15,[0,0,1,0,0,0,0],"fg",null,false,"M",null,1,false,false,0,"fg; fgm; femtograms; weight","LOINC","Mass","Clinical","equal to 10^-15 grams",null,null,null,null,false],[false,"femtoliter","fL","FL","volume",1e-18,[3,0,0,0,0,0,0],"fL","iso1000",true,null,null,1,false,false,0,"femtolitres; femtoliters","LOINC","Vol; EntVol","Clinical","equal to 10^-15 liters","l",null,"1",1,false],[false,"femtometer","fm","FM","length",1e-15,[1,0,0,0,0,0,0],"fm",null,false,"L",null,1,false,false,0,"femtometres; femtometers","LOINC","Len","Clinical","equal to 10^-15 meters",null,null,null,null,false],[false,"femtomole","fmol","FMOL","amount of substance",602213670,[0,0,0,0,0,0,0],"fmol","si",true,null,null,1,false,false,1,"femtomoles","LOINC","EntSub","Clinical","equal to 10^-15 moles","10*23","10*23","6.0221367",6.0221367,false],[false,"femtomole per gram","fmol/g","FMOL/G","amount of substance",602213670,[0,0,-1,0,0,0,0],"fmol/g","si",true,null,null,1,false,false,1,"femtomoles; fmol/gm; fmol per gm","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"femtomole per liter","fmol/L","FMOL/L","amount of substance",602213670000,[-3,0,0,0,0,0,0],"fmol/L","si",true,null,null,1,false,false,1,"femtomoles; fmol per liter; litre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"femtomole per milligram","fmol/mg","FMOL/MG","amount of substance",602213670000,[0,0,-1,0,0,0,0],"fmol/mg","si",true,null,null,1,false,false,1,"fmol per mg; femtomoles","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"femtomole per milliliter","fmol/mL","FMOL/ML","amount of substance",602213670000000,[-3,0,0,0,0,0,0],"fmol/mL","si",true,null,null,1,false,false,1,"femtomoles; millilitre; fmol per mL; fmol per milliliter","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"gram meter","g.m","G.M","mass",1,[1,0,1,0,0,0,0],"g.m",null,false,"M",null,1,false,false,0,"g*m; gxm; meters; metres","LOINC","Enrg","Clinical","Unit for measuring stroke work (heart work)",null,null,null,null,false],[false,"gram per 100 gram","g/(100.g)","G/(100.G)","mass",0.01,[0,0,0,0,0,0,0],"g/g",null,false,"M",null,1,false,false,0,"g/100 gm; 100gm; grams per 100 grams; gm per 100 gm","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"gram per 12 hour","g/(12.h)","G/(12.HR)","mass",0.000023148148148148147,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/12hrs; 12 hrs; gm per 12 hrs; 12hrs; grams per 12 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per 24 hour","g/(24.h)","G/(24.HR)","mass",0.000011574074074074073,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/24hrs; gm/24 hrs; gm per 24 hrs; 24hrs; grams per 24 hours; gm/dy; gm per dy; grams per day","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per 3 days","g/(3.d)","G/(3.D)","mass",0.000003858024691358025,[0,-1,1,0,0,0,0],"g/d",null,false,"M",null,1,false,false,0,"gm/3dy; gm/3 dy; gm per 3 days; grams","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per 4 hour","g/(4.h)","G/(4.HR)","mass",0.00006944444444444444,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/4hrs; gm/4 hrs; gm per 4 hrs; 4hrs; grams per 4 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per 48 hour","g/(48.h)","G/(48.HR)","mass",0.000005787037037037037,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/48hrs; gm/48 hrs; gm per 48 hrs; 48hrs; grams per 48 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per 5 hour","g/(5.h)","G/(5.HR)","mass",0.00005555555555555556,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/5hrs; gm/5 hrs; gm per 5 hrs; 5hrs; grams per 5 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per 6 hour","g/(6.h)","G/(6.HR)","mass",0.000046296296296296294,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/6hrs; gm/6 hrs; gm per 6 hrs; 6hrs; grams per 6 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per 72 hour","g/(72.h)","G/(72.HR)","mass",0.000003858024691358025,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/72hrs; gm/72 hrs; gm per 72 hrs; 72hrs; grams per 72 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per cubic centimeter","g/cm3","G/CM3","mass",999999.9999999999,[-3,0,1,0,0,0,0],"g/(cm<sup>3</sup>)",null,false,"M",null,1,false,false,0,"g/cm^3; gm per cm3; g per cm^3; grams per centimeter cubed; cu. cm; centimetre; g/mL; gram per milliliter; millilitre","LOINC","MCnc","Clinical","g/cm3 = g/mL",null,null,null,null,false],[false,"gram per day","g/d","G/D","mass",0.000011574074074074073,[0,-1,1,0,0,0,0],"g/d",null,false,"M",null,1,false,false,0,"gm/dy; gm per dy; grams per day; gm/24hrs; gm/24 hrs; gm per 24 hrs; 24hrs; grams per 24 hours; serving","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per deciliter","g/dL","G/DL","mass",10000,[-3,0,1,0,0,0,0],"g/dL",null,false,"M",null,1,false,false,0,"gm/dL; gm per dL; grams per deciliter; decilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"gram per gram","g/g","G/G","mass",1,[0,0,0,0,0,0,0],"g/g",null,false,"M",null,1,false,false,0,"gm; grams","LOINC","MRto ","Clinical","",null,null,null,null,false],[false,"gram per hour","g/h","G/HR","mass",0.0002777777777777778,[0,-1,1,0,0,0,0],"g/h",null,false,"M",null,1,false,false,0,"gm/hr; gm per hr; grams; intake; output","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per hour per square meter","g/h/m2","(G/HR)/M2","mass",0.0002777777777777778,[-2,-1,1,0,0,0,0],"(g/h)/(m<sup>2</sup>)",null,false,"M",null,1,false,false,0,"gm/hr/m2; gm/h/m2; /m^2; sq. m; g per hr per m2; grams per hours per square meter; meter squared; metre","LOINC","ArMRat","Clinical","",null,null,null,null,false],[false,"gram per kilogram","g/kg ","G/KG","mass",0.001,[0,0,0,0,0,0,0],"g/kg",null,false,"M",null,1,false,false,0,"g per kg; gram per kilograms","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"gram per kilogram per 8 hour ","g/kg/(8.h)","(G/KG)/(8.HR)","mass",3.472222222222222e-8,[0,-1,0,0,0,0,0],"(g/kg)/h",null,false,"M",null,1,false,false,0,"g/(8.kg.h); gm/kg/8hrs; 8 hrs; g per kg per 8 hrs; 8hrs; grams per kilograms per 8 hours; shift","LOINC","MCntRat; RelMRat","Clinical","unit often used to describe mass in grams of protein consumed in a 8 hours, divided by the subject's body weight in kilograms. Also used to measure mass dose rate per body mass",null,null,null,null,false],[false,"gram per kilogram per day","g/kg/d","(G/KG)/D","mass",1.1574074074074074e-8,[0,-1,0,0,0,0,0],"(g/kg)/d",null,false,"M",null,1,false,false,0,"g/(kg.d); gm/kg/dy; gm per kg per dy; grams per kilograms per day","LOINC","RelMRat","Clinical","unit often used to describe mass in grams of protein consumed in a day, divided by the subject's body weight in kilograms. Also used to measure mass dose rate per body mass",null,null,null,null,false],[false,"gram per kilogram per hour","g/kg/h","(G/KG)/HR","mass",2.7777777777777776e-7,[0,-1,0,0,0,0,0],"(g/kg)/h",null,false,"M",null,1,false,false,0,"g/(kg.h); g/kg/hr; g per kg per hrs; grams per kilograms per hour","LOINC","MCntRat; RelMRat","Clinical","unit used to measure mass dose rate per body mass",null,null,null,null,false],[false,"gram per kilogram per minute","g/kg/min","(G/KG)/MIN","mass",0.000016666666666666667,[0,-1,0,0,0,0,0],"(g/kg)/min",null,false,"M",null,1,false,false,0,"g/(kg.min); g/kg/min; g per kg per min; grams per kilograms per minute","LOINC","MCntRat; RelMRat","Clinical","unit used to measure mass dose rate per body mass",null,null,null,null,false],[false,"gram per liter","g/L","G/L","mass",1000,[-3,0,1,0,0,0,0],"g/L",null,false,"M",null,1,false,false,0,"gm per liter; g/liter; grams per liter; litre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"gram per square meter","g/m2","G/M2","mass",1,[-2,0,1,0,0,0,0],"g/(m<sup>2</sup>)",null,false,"M",null,1,false,false,0,"g/m^2; gram/square meter; g/sq m; g per m2; g per m^2; grams per square meter; meters squared; metre","LOINC","ArMass","Clinical","Tests measure myocardial mass (heart ventricle system) per body surface area; unit used to measure mass dose per body surface area",null,null,null,null,false],[false,"gram per milligram","g/mg","G/MG","mass",1000,[0,0,0,0,0,0,0],"g/mg",null,false,"M",null,1,false,false,0,"g per mg; grams per milligram","LOINC","MCnt; MRto","Clinical","",null,null,null,null,false],[false,"gram per minute","g/min","G/MIN","mass",0.016666666666666666,[0,-1,1,0,0,0,0],"g/min",null,false,"M",null,1,false,false,0,"g per min; grams per minute; gram/minute","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"gram per milliliter","g/mL","G/ML","mass",1000000,[-3,0,1,0,0,0,0],"g/mL",null,false,"M",null,1,false,false,0,"g per mL; grams per milliliter; millilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"gram per millimole","g/mmol","G/MMOL","mass",1.6605401866749388e-21,[0,0,1,0,0,0,0],"g/mmol",null,false,"M",null,1,false,false,-1,"grams per millimole; g per mmol","LOINC","Ratio","Clinical","",null,null,null,null,false],[false,"joule per liter","J/L","J/L","energy",1000000,[-1,-2,1,0,0,0,0],"J/L","si",true,null,null,1,false,false,0,"joules per liter; litre; J per L","LOINC","EngCnc","Clinical","","N.m","N.M","1",1,false],[false,"degree Kelvin per Watt","K/W","K/W","temperature",0.001,[-2,3,-1,0,1,0,0],"K/W",null,false,"C",null,1,false,false,0,"degree Kelvin/Watt; K per W; thermal ohm; thermal resistance; degrees","LOINC","TempEngRat","Clinical","unit for absolute thermal resistance equal to the reciprocal of thermal conductance. Unit used for tests to measure work of breathing",null,null,null,null,false],[false,"kilo international unit per liter","k[IU]/L","K[IU]/L","arbitrary",1000000,[-3,0,0,0,0,0,0],"(ki.U.)/L","chemical",true,null,null,1,false,true,0,"kIU/L; kIU per L; kIU per liter; kilo international units; litre; allergens; allergy units","LOINC","ACnc","Clinical","IgE has an WHO reference standard so IgE allergen testing can be reported as k[IU]/L","[iU]","[IU]","1",1,false],[false,"kilo international unit per milliliter","k[IU]/mL","K[IU]/ML","arbitrary",1000000000,[-3,0,0,0,0,0,0],"(ki.U.)/mL","chemical",true,null,null,1,false,true,0,"kIU/mL; kIU per mL; kIU per milliliter; kilo international units; millilitre; allergens; allergy units","LOINC","ACnc","Clinical","IgE has an WHO reference standard so IgE allergen testing can be reported as k[IU]/mL","[iU]","[IU]","1",1,false],[false,"katal per kilogram","kat/kg","KAT/KG","catalytic activity",602213670000000000000,[0,-1,-1,0,0,0,0],"kat/kg","chemical",true,null,null,1,false,false,1,"kat per kg; katals per kilogram; mol/s/kg; moles per seconds per kilogram","LOINC","CCnt","Clinical","kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.","mol/s","MOL/S","1",1,false],[false,"katal per liter","kat/L","KAT/L","catalytic activity",6.0221366999999994e+26,[-3,-1,0,0,0,0,0],"kat/L","chemical",true,null,null,1,false,false,1,"kat per L; katals per liter; litre; mol/s/L; moles per seconds per liter","LOINC","CCnc","Clinical","kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.","mol/s","MOL/S","1",1,false],[false,"kilocalorie","kcal","KCAL","energy",4184000,[2,-2,1,0,0,0,0],"kcal","heat",true,null,null,1,false,false,0,"kilogram calories; large calories; food calories; kcals","LOINC","EngRat","Clinical","It is equal to 1000 calories (equal to 4.184 kJ). But in practical usage, kcal refers to food calories which excludes caloric content in fiber and other constitutes that is not digestible by humans. Also see nutrition label Calories ([Cal])","cal_th","CAL_TH","1",1,false],[false,"kilocalorie per 24 hour","kcal/(24.h)","KCAL/(24.HR)","energy",48.425925925925924,[2,-3,1,0,0,0,0],"kcal/h","heat",true,null,null,1,false,false,0,"kcal/24hrs; kcal/24 hrs; kcal per 24hrs; kilocalories per 24 hours; kilojoules; kJ/24hr; kJ/(24.h); kJ/dy; kilojoules per days; intake; calories burned; metabolic rate; food calories","","EngRat","Clinical","","cal_th","CAL_TH","1",1,false],[false,"kilocalorie per ounce","kcal/[oz_av]","KCAL/[OZ_AV]","energy",147586.25679704445,[2,-2,0,0,0,0,0],"kcal/oz","heat",true,null,null,1,false,false,0,"kcal/oz; kcal per ozs; large calories per ounces; food calories; servings; international","LOINC","EngCnt","Clinical","used in nutrition to represent calorie of food","cal_th","CAL_TH","1",1,false],[false,"kilocalorie per day","kcal/d","KCAL/D","energy",48.425925925925924,[2,-3,1,0,0,0,0],"kcal/d","heat",true,null,null,1,false,false,0,"kcal/dy; kcal per day; kilocalories per days; kilojoules; kJ/dy; kilojoules per days; intake; calories burned; metabolic rate; food calories","LOINC","EngRat","Clinical","unit in nutrition for food intake (measured in calories) in a day","cal_th","CAL_TH","1",1,false],[false,"kilocalorie per hour","kcal/h","KCAL/HR","energy",1162.2222222222222,[2,-3,1,0,0,0,0],"kcal/h","heat",true,null,null,1,false,false,0,"kcal/hrs; kcals per hr; intake; kilocalories per hours; kilojoules","LOINC","EngRat","Clinical","used in nutrition to represent caloric requirement or consumption","cal_th","CAL_TH","1",1,false],[false,"kilocalorie per kilogram per 24 hour","kcal/kg/(24.h)","(KCAL/KG)/(24.HR)","energy",0.04842592592592593,[2,-3,0,0,0,0,0],"(kcal/kg)/h","heat",true,null,null,1,false,false,0,"kcal/kg/24hrs; 24 hrs; kcal per kg per 24hrs; kilocalories per kilograms per 24 hours; kilojoules","LOINC","EngCntRat","Clinical","used in nutrition to represent caloric requirement per day based on subject's body weight in kilograms","cal_th","CAL_TH","1",1,false],[false,"kilogram","kg","KG","mass",1000,[0,0,1,0,0,0,0],"kg",null,false,"M",null,1,false,false,0,"kilograms; kgs","LOINC","Mass","Clinical","",null,null,null,null,false],[false,"kilogram meter per second","kg.m/s","(KG.M)/S","mass",1000,[1,-1,1,0,0,0,0],"(kg.m)/s",null,false,"M",null,1,false,false,0,"kg*m/s; kg.m per sec; kg*m per sec; p; momentum","LOINC","","Clinical","unit for momentum =  mass times velocity",null,null,null,null,false],[false,"kilogram per second per square meter","kg/(s.m2)","KG/(S.M2)","mass",1000,[-2,-1,1,0,0,0,0],"kg/(s.(m<sup>2</sup>))",null,false,"M",null,1,false,false,0,"kg/(s*m2); kg/(s*m^2); kg per s per m2; per sec; per m^2; kilograms per seconds per square meter; meter squared; metre","LOINC","ArMRat","Clinical","",null,null,null,null,false],[false,"kilogram per hour","kg/h","KG/HR","mass",0.2777777777777778,[0,-1,1,0,0,0,0],"kg/h",null,false,"M",null,1,false,false,0,"kg/hr; kg per hr; kilograms per hour","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"kilogram per liter","kg/L","KG/L","mass",1000000,[-3,0,1,0,0,0,0],"kg/L",null,false,"M",null,1,false,false,0,"kg per liter; litre; kilograms","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"kilogram per square meter","kg/m2","KG/M2","mass",1000,[-2,0,1,0,0,0,0],"kg/(m<sup>2</sup>)",null,false,"M",null,1,false,false,0,"kg/m^2; kg/sq. m; kg per m2; per m^2; per sq. m; kilograms; meter squared; metre; BMI","LOINC","Ratio","Clinical","units for body mass index (BMI)",null,null,null,null,false],[false,"kilogram per cubic meter","kg/m3","KG/M3","mass",1000,[-3,0,1,0,0,0,0],"kg/(m<sup>3</sup>)",null,false,"M",null,1,false,false,0,"kg/m^3; kg/cu. m; kg per m3; per m^3; per cu. m; kilograms; meters cubed; metre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"kilogram per minute","kg/min","KG/MIN","mass",16.666666666666668,[0,-1,1,0,0,0,0],"kg/min",null,false,"M",null,1,false,false,0,"kilogram/minute; kg per min; kilograms per minute","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"kilogram per mole","kg/mol","KG/MOL","mass",1.6605401866749388e-21,[0,0,1,0,0,0,0],"kg/mol",null,false,"M",null,1,false,false,-1,"kilogram/mole; kg per mol; kilograms per mole","LOINC","SCnt","Clinical","",null,null,null,null,false],[false,"kilogram per second","kg/s","KG/S","mass",1000,[0,-1,1,0,0,0,0],"kg/s",null,false,"M",null,1,false,false,0,"kg/sec; kilogram/second; kg per sec; kilograms; second","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"kiloliter","kL","KL","volume",1,[3,0,0,0,0,0,0],"kL","iso1000",true,null,null,1,false,false,0,"kiloliters; kilolitres; m3; m^3; meters cubed; metre","LOINC","Vol","Clinical","","l",null,"1",1,false],[false,"kilometer","km","KM","length",1000,[1,0,0,0,0,0,0],"km",null,false,"L",null,1,false,false,0,"kilometers; kilometres; distance","LOINC","Len","Clinical","",null,null,null,null,false],[false,"kilopascal","kPa","KPAL","pressure",1000000,[-1,-2,1,0,0,0,0],"kPa","si",true,null,null,1,false,false,0,"kilopascals; pressure","LOINC","Pres; PPresDiff","Clinical","","N/m2","N/M2","1",1,false],[false,"kilosecond","ks","KS","time",1000,[0,1,0,0,0,0,0],"ks",null,false,"T",null,1,false,false,0,"kiloseconds; ksec","LOINC","Time","Clinical","",null,null,null,null,false],[false,"kilo enzyme unit","kU","KU","catalytic activity",10036894500000000000,[0,-1,0,0,0,0,0],"kU","chemical",true,null,null,1,false,false,1,"units; mmol/min; millimoles per minute","LOINC","CAct","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min","umol/min","UMOL/MIN","1",1,false],[false,"kilo enzyme unit per gram","kU/g","KU/G","catalytic activity",10036894500000000000,[0,-1,-1,0,0,0,0],"kU/g","chemical",true,null,null,1,false,false,1,"units per grams; kU per gm","LOINC","CCnt","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min","umol/min","UMOL/MIN","1",1,false],[false,"kilo enzyme unit per liter","kU/L","KU/L","catalytic activity",1.00368945e+22,[-3,-1,0,0,0,0,0],"kU/L","chemical",true,null,null,1,false,false,1,"units per liter; litre; enzymatic activity; enzyme activity per volume; activities","LOINC","ACnc; CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min","umol/min","UMOL/MIN","1",1,false],[false,"kilo enzyme unit per milliliter","kU/mL","KU/ML","catalytic activity",1.00368945e+25,[-3,-1,0,0,0,0,0],"kU/mL","chemical",true,null,null,1,false,false,1,"kU per mL; units per milliliter; millilitre; enzymatic activity per volume; enzyme activities","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 kU = 1 mmol/min","umol/min","UMOL/MIN","1",1,false],[false,"Liters per 24 hour","L/(24.h)","L/(24.HR)","volume",1.1574074074074074e-8,[3,-1,0,0,0,0,0],"L/h","iso1000",true,null,null,1,false,false,0,"L/24hrs; L/24 hrs; L per 24hrs; liters per 24 hours; day; dy; litres; volume flow rate","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"Liters per 8 hour","L/(8.h)","L/(8.HR)","volume",3.472222222222222e-8,[3,-1,0,0,0,0,0],"L/h","iso1000",true,null,null,1,false,false,0,"L/8hrs; L/8 hrs; L per 8hrs; liters per 8 hours; litres; volume flow rate; shift","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"Liters per minute per square meter","L/(min.m2) ","L/(MIN.M2)","volume",0.000016666666666666667,[1,-1,0,0,0,0,0],"L/(min.(m<sup>2</sup>))","iso1000",true,null,null,1,false,false,0,"L/(min.m2); L/min/m^2; L/min/sq. meter; L per min per m2; m^2; liters per minutes per square meter; meter squared; litres; metre ","LOINC","ArVRat","Clinical","unit for tests that measure cardiac output per body surface area (cardiac index)","l",null,"1",1,false],[false,"Liters per day","L/d","L/D","volume",1.1574074074074074e-8,[3,-1,0,0,0,0,0],"L/d","iso1000",true,null,null,1,false,false,0,"L/dy; L per day; 24hrs; 24 hrs; 24 hours; liters; litres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"Liters per hour","L/h","L/HR","volume",2.7777777777777776e-7,[3,-1,0,0,0,0,0],"L/h","iso1000",true,null,null,1,false,false,0,"L/hr; L per hr; litres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"Liters per kilogram","L/kg","L/KG","volume",0.000001,[3,0,-1,0,0,0,0],"L/kg","iso1000",true,null,null,1,false,false,0,"L per kg; litre","LOINC","VCnt","Clinical","","l",null,"1",1,false],[false,"Liters per liter","L/L","L/L","volume",1,[0,0,0,0,0,0,0],"L/L","iso1000",true,null,null,1,false,false,0,"L per L; liter/liter; litre","LOINC","VFr","Clinical","","l",null,"1",1,false],[false,"Liters per minute","L/min","L/MIN","volume",0.000016666666666666667,[3,-1,0,0,0,0,0],"L/min","iso1000",true,null,null,1,false,false,0,"liters per minute; litre","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"Liters per minute per square meter","L/min/m2","(L/MIN)/M2","volume",0.000016666666666666667,[1,-1,0,0,0,0,0],"(L/min)/(m<sup>2</sup>)","iso1000",true,null,null,1,false,false,0,"L/(min.m2); L/min/m^2; L/min/sq. meter; L per min per m2; m^2; liters per minutes per square meter; meter squared; litres; metre ","","ArVRat","Clinical","unit for tests that measure cardiac output per body surface area (cardiac index)","l",null,"1",1,false],[false,"Liters per second","L/s","L/S","volume",0.001,[3,-1,0,0,0,0,0],"L/s","iso1000",true,null,null,1,false,false,0,"L per sec; litres","LOINC","VRat","Clinical","unit used often to measure gas flow and peak expiratory flow","l",null,"1",1,false],[false,"Liters per second per square second","L/s/s2","(L/S)/S2","volume",0.001,[3,-3,0,0,0,0,0],"(L/s)/(s<sup>2</sup>)","iso1000",true,null,null,1,false,false,0,"L/s/s^2; L/sec/sec2; L/sec/sec^2; L/sec/sq. sec; L per s per s2; L per sec per sec2; s^2; sec^2; liters per seconds per square second; second squared; litres ","LOINC","ArVRat","Clinical","unit for tests that measure cardiac output/body surface area","l",null,"1",1,false],[false,"lumen square meter","lm.m2","LM.M2","luminous flux",1,[2,0,0,2,0,0,1],"lm.(m<sup>2</sup>)","si",true,null,null,1,false,false,0,"lm*m2; lm*m^2; lumen meters squared; lumen sq. meters; metres","LOINC","","Clinical","","cd.sr","CD.SR","1",1,false],[false,"meter per second","m/s","M/S","length",1,[1,-1,0,0,0,0,0],"m/s",null,false,"L",null,1,false,false,0,"meter/second; m per sec; meters per second; metres; velocity; speed","LOINC","Vel","Clinical","unit of velocity",null,null,null,null,false],[false,"meter per square second","m/s2","M/S2","length",1,[1,-2,0,0,0,0,0],"m/(s<sup>2</sup>)",null,false,"L",null,1,false,false,0,"m/s^2; m/sq. sec; m per s2; per s^2; meters per square second; second squared; sq second; metres; acceleration","LOINC","Accel","Clinical","unit of acceleration",null,null,null,null,false],[false,"milli international unit per liter","m[IU]/L","M[IU]/L","arbitrary",1,[-3,0,0,0,0,0,0],"(mi.U.)/L","chemical",true,null,null,1,false,true,0,"mIU/L; m IU/L; mIU per liter; units; litre","LOINC","ACnc","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"milli  international unit per milliliter","m[IU]/mL","M[IU]/ML","arbitrary",1000.0000000000001,[-3,0,0,0,0,0,0],"(mi.U.)/mL","chemical",true,null,null,1,false,true,0,"mIU/mL; m IU/mL; mIU per mL; milli international units per milliliter; millilitre","LOINC","ACnc","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"square meter","m2","M2","length",1,[2,0,0,0,0,0,0],"m<sup>2</sup>",null,false,"L",null,1,false,false,0,"m^2; sq m; square meters; meters squared; metres","LOINC","Area","Clinical","unit often used to represent body surface area",null,null,null,null,false],[false,"square meter per second","m2/s","M2/S","length",1,[2,-1,0,0,0,0,0],"(m<sup>2</sup>)/s",null,false,"L",null,1,false,false,0,"m^2/sec; m2 per sec; m^2 per sec; sq m/sec; meters squared/seconds; sq m per sec; meters squared; metres","LOINC","ArRat","Clinical","",null,null,null,null,false],[false,"cubic meter per second","m3/s","M3/S","length",1,[3,-1,0,0,0,0,0],"(m<sup>3</sup>)/s",null,false,"L",null,1,false,false,0,"m^3/sec; m3 per sec; m^3 per sec; cu m/sec; cubic meters per seconds; meters cubed; metres","LOINC","VRat","Clinical","",null,null,null,null,false],[false,"milliampere","mA","MA","electric current",0.001,[0,-1,0,0,0,1,0],"mA","si",true,null,null,1,false,false,0,"mamp; milliamperes","LOINC","ElpotRat","Clinical","unit of electric current","C/s","C/S","1",1,false],[false,"millibar","mbar","MBAR","pressure",100000,[-1,-2,1,0,0,0,0],"mbar","iso1000",true,null,null,1,false,false,0,"millibars","LOINC","Pres","Clinical","unit of pressure","Pa","PAL","1e5",100000,false],[false,"millibar second per liter","mbar.s/L","(MBAR.S)/L","pressure",100000000,[-4,-1,1,0,0,0,0],"(mbar.s)/L","iso1000",true,null,null,1,false,false,0,"mbar*s/L; mbar.s per L; mbar*s per L; millibar seconds per liter; millibar second per litre","LOINC","","Clinical","unit to measure expiratory resistance","Pa","PAL","1e5",100000,false],[false,"millibar per liter per second","mbar/L/s","(MBAR/L)/S","pressure",100000000,[-4,-3,1,0,0,0,0],"(mbar/L)/s","iso1000",true,null,null,1,false,false,0,"mbar/(L.s); mbar/L/sec; mbar/liter/second; mbar per L per sec; mbar per liter per second; millibars per liters per seconds; litres","LOINC","PresCncRat","Clinical","unit to measure expiratory resistance","Pa","PAL","1e5",100000,false],[false,"milliequivalent","meq","MEQ","amount of substance",602213670000000000000,[0,0,0,0,0,0,0],"meq","chemical",true,null,null,1,false,false,1,"milliequivalents; meqs","LOINC","Sub","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per 2 hour","meq/(2.h)","MEQ/(2.HR)","amount of substance",83640787500000000,[0,-1,0,0,0,0,0],"meq/h","chemical",true,null,null,1,false,false,1,"meq/2hrs; meq/2 hrs; meq per 2 hrs; milliequivalents per 2 hours","LOINC","SRat","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per 24 hour","meq/(24.h)","MEQ/(24.HR)","amount of substance",6970065625000000,[0,-1,0,0,0,0,0],"meq/h","chemical",true,null,null,1,false,false,1,"meq/24hrs; meq/24 hrs; meq per 24 hrs; milliequivalents per 24 hours","LOINC","SRat","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per 8 hour","meq/(8.h)","MEQ/(8.HR)","amount of substance",20910196875000000,[0,-1,0,0,0,0,0],"meq/h","chemical",true,null,null,1,false,false,1,"meq/8hrs; meq/8 hrs; meq per 8 hrs; milliequivalents per 8 hours; shift","LOINC","SRat","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per day","meq/d","MEQ/D","amount of substance",6970065625000000,[0,-1,0,0,0,0,0],"meq/d","chemical",true,null,null,1,false,false,1,"meq/dy; meq per day; milliquivalents per days; meq/24hrs; meq/24 hrs; meq per 24 hrs; milliequivalents per 24 hours","LOINC","SRat","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per deciliter","meq/dL","MEQ/DL","amount of substance",6.022136699999999e+24,[-3,0,0,0,0,0,0],"meq/dL","chemical",true,null,null,1,false,false,1,"meq per dL; milliequivalents per deciliter; decilitre","LOINC","SCnc","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per gram","meq/g","MEQ/G","amount of substance",602213670000000000000,[0,0,-1,0,0,0,0],"meq/g","chemical",true,null,null,1,false,false,1,"mgq/gm; meq per gm; milliequivalents per gram","LOINC","MCnt","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per hour","meq/h","MEQ/HR","amount of substance",167281575000000000,[0,-1,0,0,0,0,0],"meq/h","chemical",true,null,null,1,false,false,1,"meq/hrs; meq per hrs; milliequivalents per hour","LOINC","SRat","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per kilogram","meq/kg","MEQ/KG","amount of substance",602213670000000000,[0,0,-1,0,0,0,0],"meq/kg","chemical",true,null,null,1,false,false,1,"meq per kg; milliequivalents per kilogram","LOINC","SCnt","Clinical","equivalence equals moles per valence; used to measure dose per patient body mass","mol","MOL","1",1,false],[false,"milliequivalent per kilogram per hour","meq/kg/h","(MEQ/KG)/HR","amount of substance",167281575000000,[0,-1,-1,0,0,0,0],"(meq/kg)/h","chemical",true,null,null,1,false,false,1,"meq/(kg.h); meq/kg/hr; meq per kg per hr; milliequivalents per kilograms per hour","LOINC","SCntRat","Clinical","equivalence equals moles per valence; unit used to measure dose rate per patient body mass","mol","MOL","1",1,false],[false,"milliequivalent per liter","meq/L","MEQ/L","amount of substance",6.0221367e+23,[-3,0,0,0,0,0,0],"meq/L","chemical",true,null,null,1,false,false,1,"milliequivalents per liter; litre; meq per l; acidity","LOINC","SCnc","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per square meter","meq/m2","MEQ/M2","amount of substance",602213670000000000000,[-2,0,0,0,0,0,0],"meq/(m<sup>2</sup>)","chemical",true,null,null,1,false,false,1,"meq/m^2; meq/sq. m; milliequivalents per square meter; meter squared; metre","LOINC","ArSub","Clinical","equivalence equals moles per valence; note that the use of m2 in clinical units ofter refers to body surface area","mol","MOL","1",1,false],[false,"milliequivalent per minute","meq/min","MEQ/MIN","amount of substance",10036894500000000000,[0,-1,0,0,0,0,0],"meq/min","chemical",true,null,null,1,false,false,1,"meq per min; milliequivalents per minute","LOINC","SRat","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milliequivalent per milliliter","meq/mL","MEQ/ML","amount of substance",6.0221367e+26,[-3,0,0,0,0,0,0],"meq/mL","chemical",true,null,null,1,false,false,1,"meq per mL; milliequivalents per milliliter; millilitre","LOINC","SCnc","Clinical","equivalence equals moles per valence","mol","MOL","1",1,false],[false,"milligram","mg","MG","mass",0.001,[0,0,1,0,0,0,0],"mg",null,false,"M",null,1,false,false,0,"milligrams","LOINC","Mass","Clinical","",null,null,null,null,false],[false,"milligram per 10 hour","mg/(10.h)","MG/(10.HR)","mass",2.7777777777777777e-8,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/10hrs; mg/10 hrs; mg per 10 hrs; milligrams per 10 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per 12 hour","mg/(12.h)","MG/(12.HR)","mass",2.3148148148148148e-8,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/12hrs; mg/12 hrs; per 12 hrs; 12hrs; milligrams per 12 hours","LOINC","MRat","Clinical","units used for tests in urine",null,null,null,null,false],[false,"milligram per 2 hour","mg/(2.h)","MG/(2.HR)","mass",1.3888888888888888e-7,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/2hrs; mg/2 hrs; mg per 2 hrs; 2hrs; milligrams per 2 hours","LOINC","MRat","Clinical","units used for tests in urine",null,null,null,null,false],[false,"milligram per 24 hour","mg/(24.h)","MG/(24.HR)","mass",1.1574074074074074e-8,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/24hrs; mg/24 hrs; milligrams per 24 hours; mg/kg/dy; mg per kg per day; milligrams per kilograms per days","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per 6 hour","mg/(6.h)","MG/(6.HR)","mass",4.6296296296296295e-8,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/6hrs; mg/6 hrs; mg per 6 hrs; 6hrs; milligrams per 6 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per 72 hour","mg/(72.h)","MG/(72.HR)","mass",3.858024691358025e-9,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/72hrs; mg/72 hrs; 72 hrs; 72hrs; milligrams per 72 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per 8 hour","mg/(8.h)","MG/(8.HR)","mass",3.472222222222222e-8,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/8hrs; mg/8 hrs; milligrams per 8 hours; shift","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per day","mg/d","MG/D","mass",1.1574074074074074e-8,[0,-1,1,0,0,0,0],"mg/d",null,false,"M",null,1,false,false,0,"mg/24hrs; mg/24 hrs; milligrams per 24 hours; mg/dy; mg per day; milligrams","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per deciliter","mg/dL","MG/DL","mass",10,[-3,0,1,0,0,0,0],"mg/dL",null,false,"M",null,1,false,false,0,"mg per dL; milligrams per deciliter; decilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"milligram per gram","mg/g","MG/G","mass",0.001,[0,0,0,0,0,0,0],"mg/g",null,false,"M",null,1,false,false,0,"mg per gm; milligrams per gram","LOINC","MCnt; MRto","Clinical","",null,null,null,null,false],[false,"milligram per hour","mg/h","MG/HR","mass",2.7777777777777776e-7,[0,-1,1,0,0,0,0],"mg/h",null,false,"M",null,1,false,false,0,"mg/hr; mg per hr; milligrams","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per kilogram","mg/kg","MG/KG","mass",0.000001,[0,0,0,0,0,0,0],"mg/kg",null,false,"M",null,1,false,false,0,"mg per kg; milligrams per kilograms","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"milligram per kilogram per 8 hour","mg/kg/(8.h)","(MG/KG)/(8.HR)","mass",3.472222222222222e-11,[0,-1,0,0,0,0,0],"(mg/kg)/h",null,false,"M",null,1,false,false,0,"mg/(8.h.kg); mg/kg/8hrs; mg/kg/8 hrs; mg per kg per 8hrs; 8 hrs; milligrams per kilograms per 8 hours; shift","LOINC","RelMRat; MCntRat","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"milligram per kilogram per day","mg/kg/d","(MG/KG)/D","mass",1.1574074074074074e-11,[0,-1,0,0,0,0,0],"(mg/kg)/d",null,false,"M",null,1,false,false,0,"mg/(kg.d); mg/(kg.24.h)mg/kg/dy; mg per kg per day; milligrams per kilograms per days; mg/kg/(24.h); mg/kg/24hrs; 24 hrs; 24 hours","LOINC","RelMRat ","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"milligram per kilogram per hour","mg/kg/h","(MG/KG)/HR","mass",2.7777777777777777e-10,[0,-1,0,0,0,0,0],"(mg/kg)/h",null,false,"M",null,1,false,false,0,"mg/(kg.h); mg/kg/hr; mg per kg per hr; milligrams per kilograms per hour","LOINC","RelMRat; MCntRat","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"milligram per kilogram per minute","mg/kg/min","(MG/KG)/MIN","mass",1.6666666666666667e-8,[0,-1,0,0,0,0,0],"(mg/kg)/min",null,false,"M",null,1,false,false,0,"mg/(kg.min); mg per kg per min; milligrams per kilograms per minute","LOINC","RelMRat; MCntRat","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"milligram per liter","mg/L","MG/L","mass",1,[-3,0,1,0,0,0,0],"mg/L",null,false,"M",null,1,false,false,0,"mg per l; milligrams per liter; litre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"milligram per square meter","mg/m2","MG/M2","mass",0.001,[-2,0,1,0,0,0,0],"mg/(m<sup>2</sup>)",null,false,"M",null,1,false,false,0,"mg/m^2; mg/sq. m; mg per m2; mg per m^2; mg per sq. milligrams; meter squared; metre","LOINC","ArMass","Clinical","",null,null,null,null,false],[false,"milligram per cubic meter","mg/m3","MG/M3","mass",0.001,[-3,0,1,0,0,0,0],"mg/(m<sup>3</sup>)",null,false,"M",null,1,false,false,0,"mg/m^3; mg/cu. m; mg per m3; milligrams per cubic meter; meter cubed; metre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"milligram per milligram","mg/mg","MG/MG","mass",1,[0,0,0,0,0,0,0],"mg/mg",null,false,"M",null,1,false,false,0,"mg per mg; milligrams; milligram/milligram","LOINC","MRto","Clinical","",null,null,null,null,false],[false,"milligram per minute","mg/min","MG/MIN","mass",0.000016666666666666667,[0,-1,1,0,0,0,0],"mg/min",null,false,"M",null,1,false,false,0,"mg per min; milligrams per minutes; milligram/minute","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"milligram per milliliter","mg/mL","MG/ML","mass",1000.0000000000001,[-3,0,1,0,0,0,0],"mg/mL",null,false,"M",null,1,false,false,0,"mg per mL; milligrams per milliliters; millilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"milligram per millimole","mg/mmol","MG/MMOL","mass",1.660540186674939e-24,[0,0,1,0,0,0,0],"mg/mmol",null,false,"M",null,1,false,false,-1,"mg per mmol; milligrams per millimole; ","LOINC","Ratio","Clinical","",null,null,null,null,false],[false,"milligram per week","mg/wk","MG/WK","mass",1.6534391534391535e-9,[0,-1,1,0,0,0,0],"mg/wk",null,false,"M",null,1,false,false,0,"mg/week; mg per wk; milligrams per weeks; milligram/week","LOINC","Mrat","Clinical","",null,null,null,null,false],[false,"milliliter","mL","ML","volume",0.000001,[3,0,0,0,0,0,0],"mL","iso1000",true,null,null,1,false,false,0,"milliliters; millilitres","LOINC","Vol","Clinical","","l",null,"1",1,false],[false,"milliliter per 10 hour","mL/(10.h)","ML/(10.HR)","volume",2.7777777777777777e-11,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/10hrs; ml/10 hrs; mL per 10hrs; 10 hrs; milliliters per 10 hours; millilitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 12 hour","mL/(12.h)","ML/(12.HR)","volume",2.3148148148148147e-11,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/12hrs; ml/12 hrs; mL per 12hrs; 12 hrs; milliliters per 12 hours; millilitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 2 hour","mL/(2.h)","ML/(2.HR)","volume",1.3888888888888888e-10,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/2hrs; ml/2 hrs; mL per 2hrs; 2 hrs; milliliters per 2 hours; millilitres ","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 24 hour","mL/(24.h)","ML/(24.HR)","volume",1.1574074074074074e-11,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/24hrs; ml/24 hrs; mL per 24hrs; 24 hrs; milliliters per 24 hours; millilitres; ml/dy; /day; ml per dy; days; fluid outputs; fluid inputs; flow rate","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 4 hour","mL/(4.h)","ML/(4.HR)","volume",6.944444444444444e-11,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/4hrs; ml/4 hrs; mL per 4hrs; 4 hrs; milliliters per 4 hours; millilitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 5 hour","mL/(5.h)","ML/(5.HR)","volume",5.5555555555555553e-11,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/5hrs; ml/5 hrs; mL per 5hrs; 5 hrs; milliliters per 5 hours; millilitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 6 hour","mL/(6.h)","ML/(6.HR)","volume",4.6296296296296294e-11,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/6hrs; ml/6 hrs; mL per 6hrs; 6 hrs; milliliters per 6 hours; millilitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 72 hour","mL/(72.h)","ML/(72.HR)","volume",3.8580246913580245e-12,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/72hrs; ml/72 hrs; mL per 72hrs; 72 hrs; milliliters per 72 hours; millilitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 8 hour","mL/(8.h)","ML/(8.HR)","volume",3.472222222222222e-11,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"ml/8hrs; ml/8 hrs; mL per 8hrs; 8 hrs; milliliters per 8 hours; millilitres; shift","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per 8 hour per kilogram","mL/(8.h)/kg","(ML/(8.HR))/KG","volume",3.472222222222222e-14,[3,-1,-1,0,0,0,0],"(mL/h)/kg","iso1000",true,null,null,1,false,false,0,"mL/kg/(8.h); ml/8h/kg; ml/8 h/kg; ml/8hr/kg; ml/8 hr/kgr; mL per 8h per kg; 8 h; 8hr; 8 hr; milliliters per 8 hours per kilogram; millilitres; shift","LOINC","VRatCnt","Clinical","unit used to measure renal excretion volume rate per body mass","l",null,"1",1,false],[false,"milliliter per square inch (international)","mL/[sin_i]","ML/[SIN_I]","volume",0.0015500031000061998,[1,0,0,0,0,0,0],"mL","iso1000",true,null,null,1,false,false,0,"mL/sin; mL/in2; mL/in^2; mL per sin; in2; in^2; sq. in; milliliters per square inch; inch squared","LOINC","ArVol","Clinical","","l",null,"1",1,false],[false,"milliliter per centimeter of water","mL/cm[H2O]","ML/CM[H2O]","volume",1.0197162129779282e-11,[4,2,-1,0,0,0,0],"mL/(cm HO<sub><r>2</r></sub>)","iso1000",true,null,null,1,false,false,0,"milliliters per centimeter of water; millilitre per centimetre of water; millilitres per centimetre of water; mL/cmH2O; mL/cm H2O; mL per cmH2O; mL per cm H2O","LOINC","Compli","Clinical","unit used to measure dynamic lung compliance","l",null,"1",1,false],[false,"milliliter per day","mL/d","ML/D","volume",1.1574074074074074e-11,[3,-1,0,0,0,0,0],"mL/d","iso1000",true,null,null,1,false,false,0,"ml/day; ml per day; milliliters per day; 24 hours; 24hrs; millilitre;","LOINC","VRat","Clinical","usually used to measure fluid output or input; flow rate","l",null,"1",1,false],[false,"milliliter per deciliter","mL/dL","ML/DL","volume",0.009999999999999998,[0,0,0,0,0,0,0],"mL/dL","iso1000",true,null,null,1,false,false,0,"mL per dL; millilitres; decilitre; milliliters","LOINC","VFr; VFrDiff","Clinical","","l",null,"1",1,false],[false,"milliliter per hour","mL/h","ML/HR","volume",2.7777777777777777e-10,[3,-1,0,0,0,0,0],"mL/h","iso1000",true,null,null,1,false,false,0,"mL/hr; mL per hr; milliliters per hour; millilitres; fluid intake; fluid output","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per kilogram","mL/kg","ML/KG","volume",9.999999999999999e-10,[3,0,-1,0,0,0,0],"mL/kg","iso1000",true,null,null,1,false,false,0,"mL per kg; milliliters per kilogram; millilitres","LOINC","VCnt","Clinical","","l",null,"1",1,false],[false,"milliliter per kilogram per 8 hour","mL/kg/(8.h)","(ML/KG)/(8.HR)","volume",3.472222222222222e-14,[3,-1,-1,0,0,0,0],"(mL/kg)/h","iso1000",true,null,null,1,false,false,0,"mL/(8.h.kg); mL/kg/8hrs; mL/kg/8 hrs; mL per kg per 8hrs; 8 hrs; milliliters per kilograms per 8 hours; millilitres; shift","LOINC","VCntRat; RelEngRat","Clinical","unit used to measure renal excretion volume rate per body mass","l",null,"1",1,false],[false,"milliliter per kilogram per day","mL/kg/d","(ML/KG)/D","volume",1.1574074074074072e-14,[3,-1,-1,0,0,0,0],"(mL/kg)/d","iso1000",true,null,null,1,false,false,0,"mL/(kg.d); mL/kg/dy; mL per kg per day; milliliters per kilograms per day; mg/kg/24hrs; 24 hrs; per 24 hours millilitres","LOINC","VCntRat; RelEngRat","Clinical","unit used to measure renal excretion volume rate per body mass","l",null,"1",1,false],[false,"milliliter per kilogram per hour","mL/kg/h","(ML/KG)/HR","volume",2.7777777777777774e-13,[3,-1,-1,0,0,0,0],"(mL/kg)/h","iso1000",true,null,null,1,false,false,0,"mL/(kg.h); mL/kg/hr; mL per kg per hr; milliliters per kilograms per hour; millilitres","LOINC","VCntRat; RelEngRat","Clinical","unit used to measure renal excretion volume rate per body mass","l",null,"1",1,false],[false,"milliliter per kilogram per minute","mL/kg/min","(ML/KG)/MIN","volume",1.6666666666666664e-11,[3,-1,-1,0,0,0,0],"(mL/kg)/min","iso1000",true,null,null,1,false,false,0,"mL/(kg.min); mL/kg/dy; mL per kg per day; milliliters per kilograms per day; millilitres","LOINC","RelEngRat","Clinical","used for tests that measure activity metabolic rate compared to standard resting metabolic rate ","l",null,"1",1,false],[false,"milliliter per square meter","mL/m2","ML/M2","volume",0.000001,[1,0,0,0,0,0,0],"mL/(m<sup>2</sup>)","iso1000",true,null,null,1,false,false,0,"mL/m^2; mL/sq. meter; mL per m2; m^2; sq. meter; milliliters per square meter; millilitres; meter squared","LOINC","ArVol","Clinical","used for tests that relate to heart work - e.g. ventricular stroke volume; atrial volume per body surface area","l",null,"1",1,false],[false,"milliliter per millibar","mL/mbar","ML/MBAR","volume",1e-11,[4,2,-1,0,0,0,0],"mL/mbar","iso1000",true,null,null,1,false,false,0,"mL per mbar; milliliters per millibar; millilitres","LOINC","","Clinical","unit used to measure dynamic lung compliance","l",null,"1",1,false],[false,"milliliter per minute","mL/min","ML/MIN","volume",1.6666666666666667e-8,[3,-1,0,0,0,0,0],"mL/min","iso1000",true,null,null,1,false,false,0,"mL per min; milliliters; millilitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"milliliter per minute per square meter","mL/min/m2","(ML/MIN)/M2","volume",1.6666666666666667e-8,[1,-1,0,0,0,0,0],"(mL/min)/(m<sup>2</sup>)","iso1000",true,null,null,1,false,false,0,"ml/min/m^2; ml/min/sq. meter; mL per min per m2; m^2; sq. meter; milliliters per minutes per square meter; millilitres; metre; meter squared","LOINC","ArVRat","Clinical","unit used to measure volume per body surface area; oxygen consumption index","l",null,"1",1,false],[false,"milliliter per millimeter","mL/mm","ML/MM","volume",0.001,[2,0,0,0,0,0,0],"mL/mm","iso1000",true,null,null,1,false,false,0,"mL per mm; milliliters per millimeter; millilitres; millimetre","LOINC","Lineic Volume","Clinical","","l",null,"1",1,false],[false,"milliliter per second","mL/s","ML/S","volume",0.000001,[3,-1,0,0,0,0,0],"mL/s","iso1000",true,null,null,1,false,false,0,"ml/sec; mL per sec; milliliters per second; millilitres","LOINC","Vel; VelRat; VRat","Clinical","","l",null,"1",1,false],[false,"millimeter","mm","MM","length",0.001,[1,0,0,0,0,0,0],"mm",null,false,"L",null,1,false,false,0,"millimeters; millimetres; height; length; diameter; thickness; axis; curvature; size","LOINC","Len","Clinical","",null,null,null,null,false],[false,"millimeter per hour","mm/h","MM/HR","length",2.7777777777777776e-7,[1,-1,0,0,0,0,0],"mm/h",null,false,"L",null,1,false,false,0,"mm/hr; mm per hr; millimeters per hour; millimetres","LOINC","Vel","Clinical","unit to measure sedimentation rate",null,null,null,null,false],[false,"millimeter per minute","mm/min","MM/MIN","length",0.000016666666666666667,[1,-1,0,0,0,0,0],"mm/min",null,false,"L",null,1,false,false,0,"mm per min; millimeters per minute; millimetres","LOINC","Vel","Clinical","",null,null,null,null,false],[false,"millimeter of water","mm[H2O]","MM[H2O]","pressure",9806.65,[-1,-2,1,0,0,0,0],"mm HO<sub><r>2</r></sub>","clinical",true,null,null,1,false,false,0,"mmH2O; mm H2O; millimeters of water; millimetres","LOINC","Pres","Clinical","","kPa","KPAL","980665e-5",9.80665,false],[false,"millimeter of mercury","mm[Hg]","MM[HG]","pressure",133322,[-1,-2,1,0,0,0,0],"mm Hg","clinical",true,null,null,1,false,false,0,"mmHg; mm Hg; millimeters of mercury; millimetres","LOINC","Pres; PPres; Ratio","Clinical","1 mm[Hg] = 1 torr; unit to measure blood pressure","kPa","KPAL","133.3220",133.322,false],[false,"square millimeter","mm2","MM2","length",0.000001,[2,0,0,0,0,0,0],"mm<sup>2</sup>",null,false,"L",null,1,false,false,0,"mm^2; sq. mm.; sq. millimeters; millimeters squared; millimetres","LOINC","Area","Clinical","",null,null,null,null,false],[false,"millimole","mmol","MMOL","amount of substance",602213670000000000000,[0,0,0,0,0,0,0],"mmol","si",true,null,null,1,false,false,1,"millimoles","LOINC","Sub","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per 12 hour","mmol/(12.h)","MMOL/(12.HR)","amount of substance",13940131250000000,[0,-1,0,0,0,0,0],"mmol/h","si",true,null,null,1,false,false,1,"mmol/12hrs; mmol/12 hrs; mmol per 12 hrs; 12hrs; millimoles per 12 hours","LOINC","SRat","Clinical","unit for tests related to urine","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per 2 hour","mmol/(2.h)","MMOL/(2.HR)","amount of substance",83640787500000000,[0,-1,0,0,0,0,0],"mmol/h","si",true,null,null,1,false,false,1,"mmol/2hrs; mmol/2 hrs; mmol per 2 hrs; 2hrs; millimoles per 2 hours","LOINC","SRat","Clinical","unit for tests related to urine","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per 24 hour","mmol/(24.h)","MMOL/(24.HR)","amount of substance",6970065625000000,[0,-1,0,0,0,0,0],"mmol/h","si",true,null,null,1,false,false,1,"mmol/24hrs; mmol/24 hrs; mmol per 24 hrs; 24hrs; millimoles per 24 hours","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per 5 hour","mmol/(5.h)","MMOL/(5.HR)","amount of substance",33456315000000000,[0,-1,0,0,0,0,0],"mmol/h","si",true,null,null,1,false,false,1,"mmol/5hrs; mmol/5 hrs; mmol per 5 hrs; 5hrs; millimoles per 5 hours","LOINC","SRat","Clinical","unit for tests related to doses","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per 6 hour","mmol/(6.h)","MMOL/(6.HR)","amount of substance",27880262500000000,[0,-1,0,0,0,0,0],"mmol/h","si",true,null,null,1,false,false,1,"mmol/6hrs; mmol/6 hrs; mmol per 6 hrs; 6hrs; millimoles per 6 hours","LOINC","SRat","Clinical","unit for tests related to urine","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per 8 hour","mmol/(8.h)","MMOL/(8.HR)","amount of substance",20910196875000000,[0,-1,0,0,0,0,0],"mmol/h","si",true,null,null,1,false,false,1,"mmol/8hrs; mmol/8 hrs; mmol per 8 hrs; 8hrs; millimoles per 8 hours; shift","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per day","mmol/d","MMOL/D","amount of substance",6970065625000000,[0,-1,0,0,0,0,0],"mmol/d","si",true,null,null,1,false,false,1,"mmol/24hrs; mmol/24 hrs; mmol per 24 hrs; 24hrs; millimoles per 24 hours","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per deciliter","mmol/dL","MMOL/DL","amount of substance",6.022136699999999e+24,[-3,0,0,0,0,0,0],"mmol/dL","si",true,null,null,1,false,false,1,"mmol per dL; millimoles; decilitre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per gram","mmol/g","MMOL/G","amount of substance",602213670000000000000,[0,0,-1,0,0,0,0],"mmol/g","si",true,null,null,1,false,false,1,"mmol per gram; millimoles","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per hour","mmol/h","MMOL/HR","amount of substance",167281575000000000,[0,-1,0,0,0,0,0],"mmol/h","si",true,null,null,1,false,false,1,"mmol/hr; mmol per hr; millimoles per hour","LOINC","SRat","Clinical","unit for tests related to urine","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per kilogram","mmol/kg","MMOL/KG","amount of substance",602213670000000000,[0,0,-1,0,0,0,0],"mmol/kg","si",true,null,null,1,false,false,1,"mmol per kg; millimoles per kilogram","LOINC","SCnt","Clinical","unit for tests related to stool","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per kilogram per 8 hour","mmol/kg/(8.h)","(MMOL/KG)/(8.HR)","amount of substance",20910196875000,[0,-1,-1,0,0,0,0],"(mmol/kg)/h","si",true,null,null,1,false,false,1,"mmol/(8.h.kg); mmol/kg/8hrs; mmol/kg/8 hrs; mmol per kg per 8hrs; 8 hrs; millimoles per kilograms per 8 hours; shift","LOINC","CCnt","Clinical","unit used to measure molar dose rate per patient body mass","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per kilogram per day","mmol/kg/d","(MMOL/KG)/D","amount of substance",6970065625000,[0,-1,-1,0,0,0,0],"(mmol/kg)/d","si",true,null,null,1,false,false,1,"mmol/kg/dy; mmol/kg/day; mmol per kg per dy; millimoles per kilograms per day","LOINC","RelSRat","Clinical","unit used to measure molar dose rate per patient body mass","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per kilogram per hour","mmol/kg/h","(MMOL/KG)/HR","amount of substance",167281575000000,[0,-1,-1,0,0,0,0],"(mmol/kg)/h","si",true,null,null,1,false,false,1,"mmol/kg/hr; mmol per kg per hr; millimoles per kilograms per hour","LOINC","CCnt","Clinical","unit used to measure molar dose rate per patient body mass","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per kilogram per minute","mmol/kg/min","(MMOL/KG)/MIN","amount of substance",10036894500000000,[0,-1,-1,0,0,0,0],"(mmol/kg)/min","si",true,null,null,1,false,false,1,"mmol/(kg.min); mmol/kg/min; mmol per kg per min; millimoles per kilograms per minute","LOINC","CCnt","Clinical","unit used to measure molar dose rate per patient body mass; note that the unit for the enzyme unit U = umol/min. mmol/kg/min = kU/kg; ","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per liter","mmol/L","MMOL/L","amount of substance",6.0221367e+23,[-3,0,0,0,0,0,0],"mmol/L","si",true,null,null,1,false,false,1,"mmol per L; millimoles per liter; litre","LOINC","SCnc","Clinical","unit for tests related to doses","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per square meter","mmol/m2","MMOL/M2","amount of substance",602213670000000000000,[-2,0,0,0,0,0,0],"mmol/(m<sup>2</sup>)","si",true,null,null,1,false,false,1,"mmol/m^2; mmol/sq. meter; mmol per m2; m^2; sq. meter; millimoles; meter squared; metre","LOINC","ArSub","Clinical","unit used to measure molar dose per patient body surface area","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per minute","mmol/min","MMOL/MIN","amount of substance",10036894500000000000,[0,-1,0,0,0,0,0],"mmol/min","si",true,null,null,1,false,false,1,"mmol per min; millimoles per minute","LOINC","Srat; CAct","Clinical","unit for the enzyme unit U = umol/min. mmol/min = kU","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per millimole","mmol/mmol","MMOL/MMOL","amount of substance",1,[0,0,0,0,0,0,0],"mmol/mmol","si",true,null,null,1,false,false,0,"mmol per mmol; millimoles per millimole","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per mole","mmol/mol","MMOL/MOL","amount of substance",0.001,[0,0,0,0,0,0,0],"mmol/mol","si",true,null,null,1,false,false,0,"mmol per mol; millimoles per mole","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"millimole per second per liter","mmol/s/L","(MMOL/S)/L","amount of substance",6.0221367e+23,[-3,-1,0,0,0,0,0],"(mmol/s)/L","si",true,null,null,1,false,false,1,"mmol/sec/L; mmol per s per L; per sec; millimoles per seconds per liter; litre","LOINC","CCnc ","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"mole per kilogram","mol/kg","MOL/KG","amount of substance",602213670000000000000,[0,0,-1,0,0,0,0],"mol/kg","si",true,null,null,1,false,false,1,"mol per kg; moles; mols","LOINC","SCnt","Clinical","unit for tests related to stool","10*23","10*23","6.0221367",6.0221367,false],[false,"mole per kilogram per second","mol/kg/s","(MOL/KG)/S","amount of substance",602213670000000000000,[0,-1,-1,0,0,0,0],"(mol/kg)/s","si",true,null,null,1,false,false,1,"mol/kg/sec; mol per kg per sec; moles per kilograms per second; mols","LOINC","CCnt","Clinical","unit of catalytic activity (mol/s) per mass (kg)","10*23","10*23","6.0221367",6.0221367,false],[false,"mole per liter","mol/L","MOL/L","amount of substance",6.0221366999999994e+26,[-3,0,0,0,0,0,0],"mol/L","si",true,null,null,1,false,false,1,"mol per L; moles per liter; litre; moles; mols","LOINC","SCnc","Clinical","unit often used in tests measuring oxygen content","10*23","10*23","6.0221367",6.0221367,false],[false,"mole per cubic meter","mol/m3","MOL/M3","amount of substance",6.0221367e+23,[-3,0,0,0,0,0,0],"mol/(m<sup>3</sup>)","si",true,null,null,1,false,false,1,"mol/m^3; mol/cu. m; mol per m3; m^3; cu. meter; mols; moles; meters cubed; metre; mole per kiloliter; kilolitre; mol/kL","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"mole per milliliter","mol/mL","MOL/ML","amount of substance",6.0221367e+29,[-3,0,0,0,0,0,0],"mol/mL","si",true,null,null,1,false,false,1,"mol per mL; moles; millilitre; mols","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"mole per mole","mol/mol","MOL/MOL","amount of substance",1,[0,0,0,0,0,0,0],"mol/mol","si",true,null,null,1,false,false,0,"mol per mol; moles per mol; mols","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"mole per second","mol/s","MOL/S","amount of substance",6.0221367e+23,[0,-1,0,0,0,0,0],"mol/s","si",true,null,null,1,false,false,1,"mol per sec; moles per second; mols","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"milliosmole","mosm","MOSM","amount of substance (dissolved particles)",602213670000000000000,[0,0,0,0,0,0,0],"mosm","chemical",true,null,null,1,false,false,1,"milliosmoles","LOINC","Osmol","Clinical","equal to 1/1000 of an osmole","mol","MOL","1",1,false],[false,"milliosmole per kilogram","mosm/kg","MOSM/KG","amount of substance (dissolved particles)",602213670000000000,[0,0,-1,0,0,0,0],"mosm/kg","chemical",true,null,null,1,false,false,1,"mosm per kg; milliosmoles per kilogram","LOINC","Osmol","Clinical","","mol","MOL","1",1,false],[false,"milliosmole per liter","mosm/L","MOSM/L","amount of substance (dissolved particles)",6.0221367e+23,[-3,0,0,0,0,0,0],"mosm/L","chemical",true,null,null,1,false,false,1,"mosm per liter; litre; milliosmoles","LOINC","Osmol","Clinical","","mol","MOL","1",1,false],[false,"millipascal","mPa","MPAL","pressure",1,[-1,-2,1,0,0,0,0],"mPa","si",true,null,null,1,false,false,0,"millipascals","LOINC","Pres","Clinical","unit of pressure","N/m2","N/M2","1",1,false],[false,"millipascal second","mPa.s","MPAL.S","pressure",1,[-1,-1,1,0,0,0,0],"mPa.s","si",true,null,null,1,false,false,0,"mPa*s; millipoise; mP; dynamic viscosity","LOINC","Visc","Clinical","base units for millipoise, a measurement of dynamic viscosity","N/m2","N/M2","1",1,false],[false,"megasecond","Ms","MAS","time",1000000,[0,1,0,0,0,0,0],"Ms",null,false,"T",null,1,false,false,0,"megaseconds","LOINC","Time","Clinical","",null,null,null,null,false],[false,"millisecond","ms","MS","time",0.001,[0,1,0,0,0,0,0],"ms",null,false,"T",null,1,false,false,0,"milliseconds; duration","LOINC","Time","Clinical","",null,null,null,null,false],[false,"milli enzyme unit per gram","mU/g","MU/G","catalytic activity",10036894500000,[0,-1,-1,0,0,0,0],"mU/g","chemical",true,null,null,1,false,false,1,"mU per gm; milli enzyme units per gram; enzyme activity; enzymatic activity per mass","LOINC","CCnt","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min","umol/min","UMOL/MIN","1",1,false],[false,"milli enzyme unit per liter","mU/L","MU/L","catalytic activity",10036894500000000,[-3,-1,0,0,0,0,0],"mU/L","chemical",true,null,null,1,false,false,1,"mU per liter; litre; milli enzyme units enzymatic activity per volume; enzyme activity","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min","umol/min","UMOL/MIN","1",1,false],[false,"milli enzyme unit per milligram","mU/mg","MU/MG","catalytic activity",10036894500000000,[0,-1,-1,0,0,0,0],"mU/mg","chemical",true,null,null,1,false,false,1,"mU per mg; milli enzyme units per milligram","LOINC","CCnt","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min","umol/min","UMOL/MIN","1",1,false],[false,"milli enzyme unit per milliliter","mU/mL","MU/ML","catalytic activity",10036894500000000000,[-3,-1,0,0,0,0,0],"mU/mL","chemical",true,null,null,1,false,false,1,"mU per mL; milli enzyme units per milliliter; millilitre; enzymatic activity per volume; enzyme activity","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min","umol/min","UMOL/MIN","1",1,false],[false,"milli enzyme unit per milliliter per minute","mU/mL/min","(MU/ML)/MIN","catalytic activity",167281575000000000,[-3,-2,0,0,0,0,0],"(mU/mL)/min","chemical",true,null,null,1,false,false,1,"mU per mL per min; mU per milliliters per minute; millilitres; milli enzyme units; enzymatic activity; enzyme activity","LOINC","CCncRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 mU = 1 nmol/min","umol/min","UMOL/MIN","1",1,false],[false,"millivolt","mV","MV","electric potential",1,[2,-2,1,0,0,-1,0],"mV","si",true,null,null,1,false,false,0,"millivolts","LOINC","Elpot","Clinical","unit of electric potential (voltage)","J/C","J/C","1",1,false],[false,"Newton centimeter","N.cm","N.CM","force",10,[2,-2,1,0,0,0,0],"N.cm","si",true,null,null,1,false,false,0,"N*cm; Ncm; N cm; Newton*centimeters; Newton* centimetres; torque; work","LOINC","","Clinical","as a measurement of work, N.cm = 1/100 Joules;\\nnote that N.m is the standard unit of measurement for torque (although dimensionally equivalent to Joule), and N.cm can also be thought of as a torqe unit","kg.m/s2","KG.M/S2","1",1,false],[false,"Newton second","N.s","N.S","force",1000,[1,-1,1,0,0,0,0],"N.s","si",true,null,null,1,false,false,0,"Newton*seconds; N*s; N s; Ns; impulse; imp","LOINC","","Clinical","standard unit of impulse","kg.m/s2","KG.M/S2","1",1,false],[false,"nanogram","ng","NG","mass",1e-9,[0,0,1,0,0,0,0],"ng",null,false,"M",null,1,false,false,0,"nanograms","LOINC","Mass","Clinical","",null,null,null,null,false],[false,"nanogram per 24 hour","ng/(24.h)","NG/(24.HR)","mass",1.1574074074074075e-14,[0,-1,1,0,0,0,0],"ng/h",null,false,"M",null,1,false,false,0,"ng/24hrs; ng/24 hrs; nanograms per 24 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"nanogram per 8 hour","ng/(8.h)","NG/(8.HR)","mass",3.4722222222222224e-14,[0,-1,1,0,0,0,0],"ng/h",null,false,"M",null,1,false,false,0,"ng/8hrs; ng/8 hrs; nanograms per 8 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"nanogram per million","ng/10*6","NG/(10*6)","mass",1e-15,[0,0,1,0,0,0,0],"ng/(10<sup>6</sup>)",null,false,"M",null,1,false,false,0,"ng/10^6; ng per 10*6; 10^6; nanograms","LOINC","MNum","Clinical","",null,null,null,null,false],[false,"nanogram per day","ng/d","NG/D","mass",1.1574074074074075e-14,[0,-1,1,0,0,0,0],"ng/d",null,false,"M",null,1,false,false,0,"ng/dy; ng per day; nanograms ","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"nanogram per deciliter","ng/dL","NG/DL","mass",0.00001,[-3,0,1,0,0,0,0],"ng/dL",null,false,"M",null,1,false,false,0,"ng per dL; nanograms per deciliter; decilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"nanogram per gram","ng/g","NG/G","mass",1e-9,[0,0,0,0,0,0,0],"ng/g",null,false,"M",null,1,false,false,0,"ng/gm; ng per gm; nanograms per gram","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"nanogram per hour","ng/h","NG/HR","mass",2.777777777777778e-13,[0,-1,1,0,0,0,0],"ng/h",null,false,"M",null,1,false,false,0,"ng/hr; ng per hr; nanograms per hour","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"nanogram per kilogram","ng/kg","NG/KG","mass",1e-12,[0,0,0,0,0,0,0],"ng/kg",null,false,"M",null,1,false,false,0,"ng per kg; nanograms per kilogram","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"nanogram per kilogram per 8 hour","ng/kg/(8.h)","(NG/KG)/(8.HR)","mass",3.472222222222222e-17,[0,-1,0,0,0,0,0],"(ng/kg)/h",null,false,"M",null,1,false,false,0,"ng/(8.h.kg); ng/kg/8hrs; ng/kg/8 hrs; ng per kg per 8hrs; 8 hrs; nanograms per kilograms per 8 hours; shift","LOINC","MRtoRat ","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"nanogram per kilogram per hour","ng/kg/h","(NG/KG)/HR","mass",2.7777777777777775e-16,[0,-1,0,0,0,0,0],"(ng/kg)/h",null,false,"M",null,1,false,false,0,"ng/(kg.h); ng/kg/hr; ng per kg per hr; nanograms per kilograms per hour","LOINC","MRtoRat ","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"nanogram per kilogram per minute","ng/kg/min","(NG/KG)/MIN","mass",1.6666666666666667e-14,[0,-1,0,0,0,0,0],"(ng/kg)/min",null,false,"M",null,1,false,false,0,"ng/(kg.min); ng per kg per min; nanograms per kilograms per minute","LOINC","MRtoRat ","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"nanogram per liter","ng/L","NG/L","mass",0.000001,[-3,0,1,0,0,0,0],"ng/L",null,false,"M",null,1,false,false,0,"ng per L; nanograms per liter; litre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"nanogram per square meter","ng/m2","NG/M2","mass",1e-9,[-2,0,1,0,0,0,0],"ng/(m<sup>2</sup>)",null,false,"M",null,1,false,false,0,"ng/m^2; ng/sq. m; ng per m2; m^2; sq. meter; nanograms; meter squared; metre","LOINC","ArMass","Clinical","unit used to measure mass dose per patient body surface area",null,null,null,null,false],[false,"nanogram per milligram","ng/mg","NG/MG","mass",0.000001,[0,0,0,0,0,0,0],"ng/mg",null,false,"M",null,1,false,false,0,"ng per mg; nanograms","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"nanogram per milligram per hour","ng/mg/h","(NG/MG)/HR","mass",2.7777777777777777e-10,[0,-1,0,0,0,0,0],"(ng/mg)/h",null,false,"M",null,1,false,false,0,"ng/mg/hr; ng per mg per hr; nanograms per milligrams per hour","LOINC","MRtoRat ","Clinical","",null,null,null,null,false],[false,"nanogram per minute","ng/min","NG/MIN","mass",1.6666666666666667e-11,[0,-1,1,0,0,0,0],"ng/min",null,false,"M",null,1,false,false,0,"ng per min; nanograms","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"nanogram per millliiter","ng/mL","NG/ML","mass",0.001,[-3,0,1,0,0,0,0],"ng/mL",null,false,"M",null,1,false,false,0,"ng per mL; nanograms; millilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"nanogram per milliliter per hour","ng/mL/h","(NG/ML)/HR","mass",2.7777777777777776e-7,[-3,-1,1,0,0,0,0],"(ng/mL)/h",null,false,"M",null,1,false,false,0,"ng/mL/hr; ng per mL per mL; nanograms per milliliter per hour; nanogram per millilitre per hour; nanograms per millilitre per hour; enzymatic activity per volume; enzyme activity per milliliters","LOINC","CCnc","Clinical","tests that measure enzymatic activity",null,null,null,null,false],[false,"nanogram per second","ng/s","NG/S","mass",1e-9,[0,-1,1,0,0,0,0],"ng/s",null,false,"M",null,1,false,false,0,"ng/sec; ng per sec; nanograms per second","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"nanogram per enzyme unit","ng/U","NG/U","mass",9.963241120049634e-26,[0,1,1,0,0,0,0],"ng/U",null,false,"M",null,1,false,false,-1,"ng per U; nanograms per enzyme unit","LOINC","CMass","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)",null,null,null,null,false],[false,"nanokatal","nkat","NKAT","catalytic activity",602213670000000,[0,-1,0,0,0,0,0],"nkat","chemical",true,null,null,1,false,false,1,"nanokatals","LOINC","CAct","Clinical","kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.","mol/s","MOL/S","1",1,false],[false,"nanoliter","nL","NL","volume",1.0000000000000002e-12,[3,0,0,0,0,0,0],"nL","iso1000",true,null,null,1,false,false,0,"nanoliters; nanolitres","LOINC","Vol","Clinical","","l",null,"1",1,false],[false,"nanometer","nm","NM","length",1e-9,[1,0,0,0,0,0,0],"nm",null,false,"L",null,1,false,false,0,"nanometers; nanometres","LOINC","Len","Clinical","",null,null,null,null,false],[false,"nanometer per second per liter","nm/s/L","(NM/S)/L","length",0.000001,[-2,-1,0,0,0,0,0],"(nm/s)/L",null,false,"L",null,1,false,false,0,"nm/sec/liter; nm/sec/litre; nm per s per l; nm per sec per l; nanometers per second per liter; nanometre per second per litre; nanometres per second per litre","LOINC","VelCnc","Clinical","",null,null,null,null,false],[false,"nanomole","nmol","NMOL","amount of substance",602213670000000,[0,0,0,0,0,0,0],"nmol","si",true,null,null,1,false,false,1,"nanomoles","LOINC","Sub","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per 24 hour","nmol/(24.h)","NMOL/(24.HR)","amount of substance",6970065625,[0,-1,0,0,0,0,0],"nmol/h","si",true,null,null,1,false,false,1,"nmol/24hr; nmol/24 hr; nanomoles per 24 hours; nmol/day; nanomoles per day; nmol per day; nanomole/day; nanomol/day","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per day","nmol/d","NMOL/D","amount of substance",6970065625,[0,-1,0,0,0,0,0],"nmol/d","si",true,null,null,1,false,false,1,"nmol/day; nanomoles per day; nmol per day; nanomole/day; nanomol/day; nmol/24hr; nmol/24 hr; nanomoles per 24 hours; ","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per deciliter","nmol/dL","NMOL/DL","amount of substance",6022136700000000000,[-3,0,0,0,0,0,0],"nmol/dL","si",true,null,null,1,false,false,1,"nmol per dL; nanomoles per deciliter; nanomole per decilitre; nanomoles per decilitre; nanomole/deciliter; nanomole/decilitre; nanomol/deciliter; nanomol/decilitre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per gram","nmol/g","NMOL/G","amount of substance",602213670000000,[0,0,-1,0,0,0,0],"nmol/g","si",true,null,null,1,false,false,1,"nmol per gram; nanomoles per gram; nanomole/gram","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per hour per liter","nmol/h/L","(NMOL/HR)/L","amount of substance",167281575000000,[-3,-1,0,0,0,0,0],"(nmol/h)/L","si",true,null,null,1,false,false,1,"nmol/hrs/L; nmol per hrs per L; nanomoles per hours per liter; litre; enzymatic activity per volume; enzyme activities","LOINC","CCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per liter","nmol/L","NMOL/L","amount of substance",602213670000000000,[-3,0,0,0,0,0,0],"nmol/L","si",true,null,null,1,false,false,1,"nmol per L; nanomoles per liter; litre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per milligram","nmol/mg","NMOL/MG","amount of substance",602213670000000000,[0,0,-1,0,0,0,0],"nmol/mg","si",true,null,null,1,false,false,1,"nmol per mg; nanomoles per milligram","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per milligram per hour","nmol/mg/h","(NMOL/MG)/HR","amount of substance",167281575000000,[0,-1,-1,0,0,0,0],"(nmol/mg)/h","si",true,null,null,1,false,false,1,"nmol/mg/hr; nmol per mg per hr; nanomoles per milligrams per hour","LOINC","SCntRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per milligram of protein","nmol/mg{prot}","NMOL/MG","amount of substance",602213670000000000,[0,0,-1,0,0,0,0],"nmol/mg","si",true,null,null,1,false,false,1,"nanomoles; nmol/mg prot; nmol per mg prot","LOINC","Ratio; CCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per minute","nmol/min","NMOL/MIN","amount of substance",10036894500000,[0,-1,0,0,0,0,0],"nmol/min","si",true,null,null,1,false,false,1,"nmol per min; nanomoles per minute; milli enzyme units; enzyme activity per volume; enzymatic activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min. nmol/min = mU (milli enzyme unit)","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per minute per milliliter","nmol/min/mL","(NMOL/MIN)/ML","amount of substance",10036894500000000000,[-3,-1,0,0,0,0,0],"(nmol/min)/mL","si",true,null,null,1,false,false,1,"nmol per min per mL; nanomoles per minutes per milliliter; millilitre; milli enzyme units per volume; enzyme activity; enzymatic activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min. nmol/mL/min = mU/mL","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per milliliter","nmol/mL","NMOL/ML","amount of substance",602213670000000000000,[-3,0,0,0,0,0,0],"nmol/mL","si",true,null,null,1,false,false,1,"nmol per mL; nanomoles per milliliter; millilitre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per milliliter per hour","nmol/mL/h","(NMOL/ML)/HR","amount of substance",167281575000000000,[-3,-1,0,0,0,0,0],"(nmol/mL)/h","si",true,null,null,1,false,false,1,"nmol/mL/hr; nmol per mL per hr; nanomoles per milliliters per hour; millilitres; milli enzyme units per volume; enzyme activity; enzymatic activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min.","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per milliliter per minute","nmol/mL/min","(NMOL/ML)/MIN","amount of substance",10036894500000000000,[-3,-1,0,0,0,0,0],"(nmol/mL)/min","si",true,null,null,1,false,false,1,"nmol per mL per min; nanomoles per milliliters per min; millilitres; milli enzyme units per volume; enzyme activity; enzymatic activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min. nmol/mL/min = mU/mL","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per millimole","nmol/mmol","NMOL/MMOL","amount of substance",0.000001,[0,0,0,0,0,0,0],"nmol/mmol","si",true,null,null,1,false,false,0,"nmol per mmol; nanomoles per millimole","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per millimole of creatinine","nmol/mmol{creat}","NMOL/MMOL","amount of substance",0.000001,[0,0,0,0,0,0,0],"nmol/mmol","si",true,null,null,1,false,false,0,"nanomoles","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per mole","nmol/mol","NMOL/MOL","amount of substance",1e-9,[0,0,0,0,0,0,0],"nmol/mol","si",true,null,null,1,false,false,0,"nmol per mole; nanomoles","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per nanomole","nmol/nmol","NMOL/NMOL","amount of substance",1,[0,0,0,0,0,0,0],"nmol/nmol","si",true,null,null,1,false,false,0,"nmol per nmol; nanomoles","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per second","nmol/s","NMOL/S","amount of substance",602213670000000,[0,-1,0,0,0,0,0],"nmol/s","si",true,null,null,1,false,false,1,"nmol/sec; nmol per sec; nanomoles per sercond; milli enzyme units; enzyme activity; enzymatic activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min.","10*23","10*23","6.0221367",6.0221367,false],[false,"nanomole per second per liter","nmol/s/L","(NMOL/S)/L","amount of substance",602213670000000000,[-3,-1,0,0,0,0,0],"(nmol/s)/L","si",true,null,null,1,false,false,1,"nmol/sec/L; nmol per s per L; nmol per sec per L; nanomoles per seconds per liter; litre; milli enzyme units per volume; enzyme activity; enzymatic activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min.","10*23","10*23","6.0221367",6.0221367,false],[false,"nanosecond","ns","NS","time",1e-9,[0,1,0,0,0,0,0],"ns",null,false,"T",null,1,false,false,0,"nanoseconds","LOINC","Time","Clinical","",null,null,null,null,false],[false,"nanoenzyme unit per milliliter","nU/mL","NU/ML","catalytic activity",10036894500000,[-3,-1,0,0,0,0,0],"nU/mL","chemical",true,null,null,1,false,false,1,"nU per mL; nanoenzyme units per milliliter; millilitre; enzymatic activity per volume; enzyme activity","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 fU = pmol/min","umol/min","UMOL/MIN","1",1,false],[false,"Ohm meter","Ohm.m","OHM.M","electric resistance",1000,[3,-1,1,0,0,-2,0],"Ω.m","si",true,null,null,1,false,false,0,"electric resistivity; meters; metres","LOINC","","Clinical","unit of electric resistivity","V/A","V/A","1",1,false],[false,"osmole per kilogram","osm/kg","OSM/KG","amount of substance (dissolved particles)",602213670000000000000,[0,0,-1,0,0,0,0],"osm/kg","chemical",true,null,null,1,false,false,1,"osm per kg; osmoles per kilogram; osmols","LOINC","Osmol","Clinical","","mol","MOL","1",1,false],[false,"osmole per liter","osm/L","OSM/L","amount of substance (dissolved particles)",6.0221366999999994e+26,[-3,0,0,0,0,0,0],"osm/L","chemical",true,null,null,1,false,false,1,"osm per L; osmoles per liter; litre; osmols","LOINC","Osmol","Clinical","","mol","MOL","1",1,false],[false,"picoampere","pA","PA","electric current",1e-12,[0,-1,0,0,0,1,0],"pA","si",true,null,null,1,false,false,0,"picoamperes","LOINC","","Clinical","equal to 10^-12 amperes","C/s","C/S","1",1,false],[false,"picogram","pg","PG","mass",1e-12,[0,0,1,0,0,0,0],"pg",null,false,"M",null,1,false,false,0,"picograms","LOINC","Mass; EntMass","Clinical","",null,null,null,null,false],[false,"picogram per deciliter","pg/dL","PG/DL","mass",9.999999999999999e-9,[-3,0,1,0,0,0,0],"pg/dL",null,false,"M",null,1,false,false,0,"pg per dL; picograms; decilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"picogram per liter","pg/L","PG/L","mass",1e-9,[-3,0,1,0,0,0,0],"pg/L",null,false,"M",null,1,false,false,0,"pg per L; picograms; litre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"picogram per milligram","pg/mg","PG/MG","mass",1e-9,[0,0,0,0,0,0,0],"pg/mg",null,false,"M",null,1,false,false,0,"pg per mg; picograms","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"picogram per milliliter","pg/mL","PG/ML","mass",0.000001,[-3,0,1,0,0,0,0],"pg/mL",null,false,"M",null,1,false,false,0,"pg per mL; picograms per milliliter; millilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"picogram per millimeter","pg/mm","PG/MM","mass",1e-9,[-1,0,1,0,0,0,0],"pg/mm",null,false,"M",null,1,false,false,0,"pg per mm; picogram/millimeter; picogram/millimetre; picograms per millimeter; millimetre","LOINC","Lineic Mass","Clinical","",null,null,null,null,false],[false,"picokatal","pkat","PKAT","catalytic activity",602213670000,[0,-1,0,0,0,0,0],"pkat","chemical",true,null,null,1,false,false,1,"pkats; picokatals","LOINC","CAct","Clinical","kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.","mol/s","MOL/S","1",1,false],[false,"picoliter","pL","PL","volume",1e-15,[3,0,0,0,0,0,0],"pL","iso1000",true,null,null,1,false,false,0,"picoliters; picolitres","LOINC","Vol","Clinical","","l",null,"1",1,false],[false,"picometer","pm","PM","length",1e-12,[1,0,0,0,0,0,0],"pm",null,false,"L",null,1,false,false,0,"picometers; picometres","LOINC","Len","Clinical","",null,null,null,null,false],[false,"picomole","pmol","PMOL","amount of substance",602213670000,[0,0,0,0,0,0,0],"pmol","si",true,null,null,1,false,false,1,"picomoles; pmols","LOINC","Sub","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per 24 hour","pmol/(24.h)","PMOL/(24.HR)","amount of substance",6970065.625,[0,-1,0,0,0,0,0],"pmol/h","si",true,null,null,1,false,false,1,"pmol/24hrs; pmol/24 hrs; pmol per 24 hrs; 24hrs; days; dy; picomoles per 24 hours","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per day","pmol/d","PMOL/D","amount of substance",6970065.625,[0,-1,0,0,0,0,0],"pmol/d","si",true,null,null,1,false,false,1,"pmol/dy; pmol per day; 24 hours; 24hrs; 24 hrs; picomoles","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per deciliter","pmol/dL","PMOL/DL","amount of substance",6022136700000000,[-3,0,0,0,0,0,0],"pmol/dL","si",true,null,null,1,false,false,1,"pmol per dL; picomoles per deciliter; decilitre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per gram","pmol/g","PMOL/G","amount of substance",602213670000,[0,0,-1,0,0,0,0],"pmol/g","si",true,null,null,1,false,false,1,"pmol per gm; picomoles per gram; picomole/gram","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per hour per milliliter ","pmol/h/mL","(PMOL/HR)/ML","amount of substance",167281575000000,[-3,-1,0,0,0,0,0],"(pmol/h)/mL","si",true,null,null,1,false,false,1,"pmol/hrs/mL; pmol per hrs per mL; picomoles per hour per milliliter; millilitre; micro enzyme units per volume; enzymatic activity; enzyme activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min. ","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per liter","pmol/L","PMOL/L","amount of substance",602213670000000,[-3,0,0,0,0,0,0],"pmol/L","si",true,null,null,1,false,false,1,"picomole/liter; pmol per L; picomoles; litre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per minute","pmol/min","PMOL/MIN","amount of substance",10036894500,[0,-1,0,0,0,0,0],"pmol/min","si",true,null,null,1,false,false,1,"picomole/minute; pmol per min; picomoles per minute; micro enzyme units; enzymatic activity; enzyme activity","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min. pmol/min = uU (micro enzyme unit)","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per milliliter","pmol/mL","PMOL/ML","amount of substance",602213670000000000,[-3,0,0,0,0,0,0],"pmol/mL","si",true,null,null,1,false,false,1,"picomole/milliliter; picomole/millilitre; pmol per mL; picomoles; millilitre; picomols; pmols","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picomole per micromole","pmol/umol","PMOL/UMOL","amount of substance",0.000001,[0,0,0,0,0,0,0],"pmol/μmol","si",true,null,null,1,false,false,0,"pmol/mcgmol; picomole/micromole; pmol per umol; pmol per mcgmol; picomoles ","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"picosecond","ps","PS","time",1e-12,[0,1,0,0,0,0,0],"ps",null,false,"T",null,1,false,false,0,"picoseconds; psec","LOINC","Time","Clinical","",null,null,null,null,false],[false,"picotesla","pT","PT","magnetic flux density",1e-9,[0,-1,1,0,0,-1,0],"pT","si",true,null,null,1,false,false,0,"picoteslas","LOINC","","Clinical","SI unit of magnetic field strength for magnetic field B","Wb/m2","WB/M2","1",1,false],[false,"enzyme unit per 12 hour","U/(12.h)","U/(12.HR)","catalytic activity",232335520833.33334,[0,-2,0,0,0,0,0],"U/h","chemical",true,null,null,1,false,false,1,"U/12hrs; U/ 12hrs; U per 12 hrs; 12hrs; enzyme units per 12 hours; enzyme activity; enzymatic activity per time; umol per min per 12 hours; micromoles per minute per 12 hours; umol/min/12hr","LOINC","CRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per 2 hour","U/(2.h)","U/(2.HR)","catalytic activity",1394013125000,[0,-2,0,0,0,0,0],"U/h","chemical",true,null,null,1,false,false,1,"U/2hrs; U/ 2hrs; U per 2 hrs; 2hrs; enzyme units per 2 hours; enzyme activity; enzymatic activity per time; umol per minute per 2 hours; micromoles per minute; umol/min/2hr; umol per min per 2hr","LOINC","CRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per 24 hour","U/(24.h)","U/(24.HR)","catalytic activity",116167760416.66667,[0,-2,0,0,0,0,0],"U/h","chemical",true,null,null,1,false,false,1,"U/24hrs; U/ 24hrs; U per 24 hrs; 24hrs; enzyme units per 24 hours; enzyme activity; enzymatic activity per time; micromoles per minute per 24 hours; umol/min/24hr; umol per min per 24hr","LOINC","CRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per 10","U/10","U/10","catalytic activity",1003689450000000,[0,-1,0,0,0,0,0],"U","chemical",true,null,null,1,false,false,1,"enzyme unit/10; U per 10; enzyme units per 10; enzymatic activity; enzyme activity; micromoles per minute; umol/min/10","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per 10 billion","U/10*10","U/(10*10)","catalytic activity",1003689.45,[0,-1,0,0,0,0,0],"U/(10<sup>10</sup>)","chemical",true,null,null,1,false,false,1,"U per 10*10; enzyme units per 10*10; U per 10 billion; enzyme units; enzymatic activity; micromoles per minute per 10 billion; umol/min/10*10","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per trillion","U/10*12","U/(10*12)","catalytic activity",10036.8945,[0,-1,0,0,0,0,0],"U/(10<sup>12</sup>)","chemical",true,null,null,1,false,false,1,"enzyme unit/10*12; U per 10*12; enzyme units per 10*12; enzyme units per trillion; enzymatic activity; micromoles per minute per trillion; umol/min/10*12; umol per min per 10*12","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per million","U/10*6","U/(10*6)","catalytic activity",10036894500,[0,-1,0,0,0,0,0],"U/(10<sup>6</sup>)","chemical",true,null,null,1,false,false,1,"enzyme unit/10*6; U per 10*6; enzyme units per 10*6; enzyme units; enzymatic activity per volume; micromoles per minute per million; umol/min/10*6; umol per min per 10*6","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per billion","U/10*9","U/(10*9)","catalytic activity",10036894.5,[0,-1,0,0,0,0,0],"U/(10<sup>9</sup>)","chemical",true,null,null,1,false,false,1,"enzyme unit/10*9; U per 10*9; enzyme units per 10*9; enzymatic activity per volume; micromoles per minute per billion; umol/min/10*9; umol per min per 10*9","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per day","U/d","U/D","catalytic activity",116167760416.66667,[0,-2,0,0,0,0,0],"U/d","chemical",true,null,null,1,false,false,1,"U/dy; enzyme units per day; enzyme units; enzyme activity; enzymatic activity per time; micromoles per minute per day; umol/min/day; umol per min per day","LOINC","CRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per deciliter","U/dL","U/DL","catalytic activity",100368945000000000000,[-3,-1,0,0,0,0,0],"U/dL","chemical",true,null,null,1,false,false,1,"U per dL; enzyme units per deciliter; decilitre; micromoles per minute per deciliter; umol/min/dL; umol per min per dL","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per gram","U/g","U/G","catalytic activity",10036894500000000,[0,-1,-1,0,0,0,0],"U/g","chemical",true,null,null,1,false,false,1,"U/gm; U per gm; enzyme units per gram; micromoles per minute per gram; umol/min/g; umol per min per g","LOINC","CCnt","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per hour","U/h","U/HR","catalytic activity",2788026250000,[0,-2,0,0,0,0,0],"U/h","chemical",true,null,null,1,false,false,1,"U/hr; U per hr; enzyme units per hour; micromoles per minute per hour; umol/min/hr; umol per min per hr","LOINC","CRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per liter","U/L","U/L","catalytic activity",10036894500000000000,[-3,-1,0,0,0,0,0],"U/L","chemical",true,null,null,1,false,false,1,"enzyme unit/liter; enzyme unit/litre; U per L; enzyme units per liter; enzyme unit per litre; micromoles per minute per liter; umol/min/L; umol per min per L","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per minute","U/min","U/MIN","catalytic activity",167281575000000,[0,-2,0,0,0,0,0],"U/min","chemical",true,null,null,1,false,false,1,"enzyme unit/minute; U per min; enzyme units; umol/min/min; micromoles per minute per minute; micromoles per min per min; umol","LOINC","CRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per milliliter","U/mL","U/ML","catalytic activity",1.00368945e+22,[-3,-1,0,0,0,0,0],"U/mL","chemical",true,null,null,1,false,false,1,"U per mL; enzyme units per milliliter; millilitre; micromoles per minute per milliliter; umol/min/mL; umol per min per mL","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"enzyme unit per second","U/s","U/S","catalytic activity",10036894500000000,[0,-2,0,0,0,0,0],"U/s","chemical",true,null,null,1,false,false,1,"U/sec; U per second; enzyme units per second; micromoles per minute per second; umol/min/sec; umol per min per sec","LOINC","CRat","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min)","umol/min","UMOL/MIN","1",1,false],[false,"micro international unit","u[IU]","U[IU]","arbitrary",0.000001,[0,0,0,0,0,0,0],"μi.U.","chemical",true,null,null,1,false,true,0,"uIU; u IU; microinternational units","LOINC","Arb","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"micro international unit per liter","u[IU]/L","U[IU]/L","arbitrary",0.001,[-3,0,0,0,0,0,0],"(μi.U.)/L","chemical",true,null,null,1,false,true,0,"uIU/L; u IU/L; uIU per L; microinternational units per liter; litre; ","LOINC","ACnc","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"micro international unit per milliliter","u[IU]/mL","U[IU]/ML","arbitrary",1,[-3,0,0,0,0,0,0],"(μi.U.)/mL","chemical",true,null,null,1,false,true,0,"uIU/mL; u IU/mL; uIU per mL; microinternational units per milliliter; millilitre","LOINC","ACnc","Clinical","International units (IU) are analyte and reference specimen  specific arbitrary units (held at WHO)","[iU]","[IU]","1",1,false],[false,"microequivalent","ueq","UEQ","amount of substance",602213670000000000,[0,0,0,0,0,0,0],"μeq","chemical",true,null,null,1,false,false,1,"microequivalents; 10^-6 equivalents; 10-6 equivalents","LOINC","Sub","Clinical","","mol","MOL","1",1,false],[false,"microequivalent per liter","ueq/L","UEQ/L","amount of substance",602213670000000000000,[-3,0,0,0,0,0,0],"μeq/L","chemical",true,null,null,1,false,false,1,"ueq per liter; litre; microequivalents","LOINC","MCnc","Clinical","","mol","MOL","1",1,false],[false,"microequivalent per milliliter","ueq/mL","UEQ/ML","amount of substance",6.0221367000000003e+23,[-3,0,0,0,0,0,0],"μeq/mL","chemical",true,null,null,1,false,false,1,"ueq per milliliter; millilitre; microequivalents","LOINC","MCnc","Clinical","","mol","MOL","1",1,false],[false,"microgram","ug","UG","mass",0.000001,[0,0,1,0,0,0,0],"μg",null,false,"M",null,1,false,false,0,"mcg; micrograms; 10^-6 grams; 10-6 grams","LOINC","Mass","Clinical","",null,null,null,null,false],[false,"microgram per 100 gram","ug/(100.g)","UG/(100.G)","mass",1e-8,[0,0,0,0,0,0,0],"μg/g",null,false,"M",null,1,false,false,0,"ug/100gm; ug/100 gm; mcg; ug per 100g; 100 gm; mcg per 100g; micrograms per 100 grams","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"microgram per 24 hour","ug/(24.h)","UG/(24.HR)","mass",1.1574074074074074e-11,[0,-1,1,0,0,0,0],"μg/h",null,false,"M",null,1,false,false,0,"ug/24hrs; ug/24 hrs; mcg/24hrs; ug per 24hrs; mcg per 24hrs; 24 hrs; micrograms per 24 hours","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"microgram per 8 hour","ug/(8.h)","UG/(8.HR)","mass",3.472222222222222e-11,[0,-1,1,0,0,0,0],"μg/h",null,false,"M",null,1,false,false,0,"ug/8hrs; ug/8 hrs; mcg/8hrs; ug per 8hrs; mcg per 8hrs; 8 hrs; micrograms per 8 hours; shift","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"microgram per square foot (international)","ug/[sft_i]","UG/[SFT_I]","mass",0.000010763910416709721,[-2,0,1,0,0,0,0],"μg",null,false,"M",null,1,false,false,0,"ug/sft; ug/ft2; ug/ft^2; ug/sq. ft; micrograms; sq. foot; foot squared","LOINC","ArMass","Clinical","",null,null,null,null,false],[false,"microgram per day","ug/d","UG/D","mass",1.1574074074074074e-11,[0,-1,1,0,0,0,0],"μg/d",null,false,"M",null,1,false,false,0,"ug/dy; mcg/dy; ug per day; mcg; micrograms per day","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"microgram per deciliter","ug/dL","UG/DL","mass",0.009999999999999998,[-3,0,1,0,0,0,0],"μg/dL",null,false,"M",null,1,false,false,0,"ug per dL; mcg/dl; mcg per dl; micrograms per deciliter; decilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"microgram per gram","ug/g","UG/G","mass",0.000001,[0,0,0,0,0,0,0],"μg/g",null,false,"M",null,1,false,false,0,"ug per gm; mcg/gm; mcg per g; micrograms per gram","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"microgram per hour","ug/h","UG/HR","mass",2.7777777777777777e-10,[0,-1,1,0,0,0,0],"μg/h",null,false,"M",null,1,false,false,0,"ug/hr; mcg/hr; mcg per hr; ug per hr; ug per hour; micrograms","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"microgram per kilogram","ug/kg","UG/KG","mass",9.999999999999999e-10,[0,0,0,0,0,0,0],"μg/kg",null,false,"M",null,1,false,false,0,"ug per kg; mcg/kg; mcg per kg; micrograms per kilogram","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"microgram per kilogram per 8 hour","ug/kg/(8.h)","(UG/KG)/(8.HR)","mass",3.472222222222222e-14,[0,-1,0,0,0,0,0],"(μg/kg)/h",null,false,"M",null,1,false,false,0,"ug/kg/8hrs; mcg/kg/8hrs; ug/kg/8 hrs; mcg/kg/8 hrs; ug per kg per 8hrs; 8 hrs; mcg per kg per 8hrs; micrograms per kilograms per 8 hours; shift","LOINC","","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"microgram per kilogram per day","ug/kg/d","(UG/KG)/D","mass",1.1574074074074072e-14,[0,-1,0,0,0,0,0],"(μg/kg)/d",null,false,"M",null,1,false,false,0,"ug/(kg.d); ug/kg/dy; mcg/kg/day; ug per kg per dy; 24 hours; 24hrs; mcg; kilograms; microgram per kilogram and day","LOINC","","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"microgram per kilogram per hour","ug/kg/h","(UG/KG)/HR","mass",2.7777777777777774e-13,[0,-1,0,0,0,0,0],"(μg/kg)/h",null,false,"M",null,1,false,false,0,"ug/(kg.h); ug/kg/hr; mcg/kg/hr; ug per kg per hr; mcg per kg per hr; kilograms","LOINC","","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"microgram per kilogram per minute","ug/kg/min","(UG/KG)/MIN","mass",1.6666666666666664e-11,[0,-1,0,0,0,0,0],"(μg/kg)/min",null,false,"M",null,1,false,false,0,"ug/kg/min; ug/kg/min; mcg/kg/min; ug per kg per min; mcg; micrograms per kilograms per minute ","LOINC","","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"microgram per liter","ug/L","UG/L","mass",0.001,[-3,0,1,0,0,0,0],"μg/L",null,false,"M",null,1,false,false,0,"mcg/L; ug per L; mcg; micrograms per liter; litre ","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"microgram per liter per 24 hour","ug/L/(24.h)","(UG/L)/(24.HR)","mass",1.1574074074074074e-8,[-3,-1,1,0,0,0,0],"(μg/L)/h",null,false,"M",null,1,false,false,0,"ug/L/24hrs; ug/L/24 hrs; mcg/L/24hrs; ug per L per 24hrs; 24 hrs; day; dy mcg; micrograms per liters per 24 hours; litres","LOINC","","Clinical","unit used to measure mass dose rate per patient body mass",null,null,null,null,false],[false,"microgram per square meter","ug/m2","UG/M2","mass",0.000001,[-2,0,1,0,0,0,0],"μg/(m<sup>2</sup>)",null,false,"M",null,1,false,false,0,"ug/m^2; ug/sq. m; mcg/m2; mcg/m^2; mcg/sq. m; ug per m2; m^2; sq. meter; mcg; micrograms per square meter; meter squared; metre","LOINC","ArMass","Clinical","unit used to measure mass dose per patient body surface area",null,null,null,null,false],[false,"microgram per cubic meter","ug/m3","UG/M3","mass",0.000001,[-3,0,1,0,0,0,0],"μg/(m<sup>3</sup>)",null,false,"M",null,1,false,false,0,"ug/m^3; ug/cu. m; mcg/m3; mcg/m^3; mcg/cu. m; ug per m3; ug per m^3; ug per cu. m; mcg; micrograms per cubic meter; meter cubed; metre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"microgram per milligram","ug/mg","UG/MG","mass",0.001,[0,0,0,0,0,0,0],"μg/mg",null,false,"M",null,1,false,false,0,"ug per mg; mcg/mg; mcg per mg; micromilligrams per milligram","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"microgram per minute","ug/min","UG/MIN","mass",1.6666666666666667e-8,[0,-1,1,0,0,0,0],"μg/min",null,false,"M",null,1,false,false,0,"ug per min; mcg/min; mcg per min; microminutes per minute","LOINC","MRat","Clinical","",null,null,null,null,false],[false,"microgram per milliliter","ug/mL","UG/ML","mass",1,[-3,0,1,0,0,0,0],"μg/mL",null,false,"M",null,1,false,false,0,"ug per mL; mcg/mL; mcg per mL; micrograms per milliliter; millilitre","LOINC","MCnc","Clinical","",null,null,null,null,false],[false,"microgram per millimole","ug/mmol","UG/MMOL","mass",1.660540186674939e-27,[0,0,1,0,0,0,0],"μg/mmol",null,false,"M",null,1,false,false,-1,"ug per mmol; mcg/mmol; mcg per mmol; micrograms per millimole","LOINC","Ratio","Clinical","",null,null,null,null,false],[false,"microgram per nanogram","ug/ng","UG/NG","mass",999.9999999999999,[0,0,0,0,0,0,0],"μg/ng",null,false,"M",null,1,false,false,0,"ug per ng; mcg/ng; mcg per ng; micrograms per nanogram","LOINC","MCnt","Clinical","",null,null,null,null,false],[false,"microkatal","ukat","UKAT","catalytic activity",602213670000000000,[0,-1,0,0,0,0,0],"μkat","chemical",true,null,null,1,false,false,1,"microkatals; ukats","LOINC","CAct","Clinical","kat is a unit of catalytic activity with base units = mol/s. Rarely used because its units are too large to practically express catalytic activity. See enzyme unit [U] which is the standard unit for catalytic activity.","mol/s","MOL/S","1",1,false],[false,"microliter","uL","UL","volume",1e-9,[3,0,0,0,0,0,0],"μL","iso1000",true,null,null,1,false,false,0,"microliters; microlitres; mcl","LOINC","Vol","Clinical","","l",null,"1",1,false],[false,"microliter per 2 hour","uL/(2.h)","UL/(2.HR)","volume",1.388888888888889e-13,[3,-1,0,0,0,0,0],"μL/h","iso1000",true,null,null,1,false,false,0,"uL/2hrs; uL/2 hrs; mcg/2hr; mcg per 2hr; uL per 2hr; uL per 2 hrs; microliters per 2 hours; microlitres ","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"microliter per hour","uL/h","UL/HR","volume",2.777777777777778e-13,[3,-1,0,0,0,0,0],"μL/h","iso1000",true,null,null,1,false,false,0,"uL/hr; mcg/hr; mcg per hr; uL per hr; microliters per hour; microlitres","LOINC","VRat","Clinical","","l",null,"1",1,false],[false,"micrometer","um","UM","length",0.000001,[1,0,0,0,0,0,0],"μm",null,false,"L",null,1,false,false,0,"micrometers; micrometres; μm; microns","LOINC","Len","Clinical","Unit of length that is usually used in tests related to the eye",null,null,null,null,false],[false,"microns per second","um/s","UM/S","length",0.000001,[1,-1,0,0,0,0,0],"μm/s",null,false,"L",null,1,false,false,0,"um/sec; micron/second; microns/second; um per sec; micrometers per second; micrometres","LOINC","Vel","Clinical","",null,null,null,null,false],[false,"micromole","umol","UMOL","amount of substance",602213670000000000,[0,0,0,0,0,0,0],"μmol","si",true,null,null,1,false,false,1,"micromoles; umols","LOINC","Sub","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per 2 hour","umol/(2.h)","UMOL/(2.HR)","amount of substance",83640787500000,[0,-1,0,0,0,0,0],"μmol/h","si",true,null,null,1,false,false,1,"umol/2hrs; umol/2 hrs; umol per 2 hrs; 2hrs; micromoles per 2 hours","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per 24 hour","umol/(24.h)","UMOL/(24.HR)","amount of substance",6970065625000,[0,-1,0,0,0,0,0],"μmol/h","si",true,null,null,1,false,false,1,"umol/24hrs; umol/24 hrs; umol per 24 hrs; per 24hrs; micromoles per 24 hours","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per 8 hour","umol/(8.h)","UMOL/(8.HR)","amount of substance",20910196875000,[0,-1,0,0,0,0,0],"μmol/h","si",true,null,null,1,false,false,1,"umol/8hr; umol/8 hr; umol per 8 hr; umol per 8hr; umols per 8hr; umol per 8 hours; micromoles per 8 hours; shift","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per day","umol/d","UMOL/D","amount of substance",6970065625000,[0,-1,0,0,0,0,0],"μmol/d","si",true,null,null,1,false,false,1,"umol/day; umol per day; umols per day; umol per days; micromoles per days; umol/24hr; umol/24 hr; umol per 24 hr; umol per 24hr; umols per 24hr; umol per 24 hours; micromoles per 24 hours","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per deciliter","umol/dL","UMOL/DL","amount of substance",6.0221367e+21,[-3,0,0,0,0,0,0],"μmol/dL","si",true,null,null,1,false,false,1,"micromole/deciliter; micromole/decilitre; umol per dL; micromoles per deciliters; micromole per decilitres","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per gram","umol/g","UMOL/G","amount of substance",602213670000000000,[0,0,-1,0,0,0,0],"μmol/g","si",true,null,null,1,false,false,1,"micromole/gram; umol per g; micromoles per gram","LOINC","SCnt; Ratio","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per hour","umol/h","UMOL/HR","amount of substance",167281575000000,[0,-1,0,0,0,0,0],"μmol/h","si",true,null,null,1,false,false,1,"umol/hr; umol per hr; umol per hour; micromoles per hours","LOINC","SRat","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per kilogram","umol/kg","UMOL/KG","amount of substance",602213670000000,[0,0,-1,0,0,0,0],"μmol/kg","si",true,null,null,1,false,false,1,"umol per kg; micromoles per kilogram","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per liter","umol/L","UMOL/L","amount of substance",602213670000000000000,[-3,0,0,0,0,0,0],"μmol/L","si",true,null,null,1,false,false,1,"micromole/liter; micromole/litre; umol per liter; micromoles per liter; litre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per liter per hour","umol/L/h","(UMOL/L)/HR","amount of substance",167281575000000000,[-3,-1,0,0,0,0,0],"(μmol/L)/h","si",true,null,null,1,false,false,1,"umol/liter/hr; umol/litre/hr; umol per L per hr; umol per liter per hour; micromoles per liters per hour; litre","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min; umol/L/h is a derived unit of enzyme units","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per milligram","umol/mg","UMOL/MG","amount of substance",602213670000000000000,[0,0,-1,0,0,0,0],"μmol/mg","si",true,null,null,1,false,false,1,"micromole/milligram; umol per mg; micromoles per milligram","LOINC","SCnt","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per minute","umol/min","UMOL/MIN","amount of substance",10036894500000000,[0,-1,0,0,0,0,0],"μmol/min","si",true,null,null,1,false,false,1,"micromole/minute; umol per min; micromoles per minute; enzyme units","LOINC","CAct","Clinical","unit for the enzyme unit U = umol/min","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per minute per gram","umol/min/g","(UMOL/MIN)/G","amount of substance",10036894500000000,[0,-1,-1,0,0,0,0],"(μmol/min)/g","si",true,null,null,1,false,false,1,"umol/min/gm; umol per min per gm; micromoles per minutes per gram; U/g; enzyme units","LOINC","CCnt","Clinical","unit for the enzyme unit U = umol/min. umol/min/g = U/g","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per minute per liter","umol/min/L","(UMOL/MIN)/L","amount of substance",10036894500000000000,[-3,-1,0,0,0,0,0],"(μmol/min)/L","si",true,null,null,1,false,false,1,"umol/min/liter; umol/minute/liter; micromoles per minutes per liter; litre; enzyme units; U/L","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min. umol/min/L = U/L","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per milliliter","umol/mL","UMOL/ML","amount of substance",6.0221367000000003e+23,[-3,0,0,0,0,0,0],"μmol/mL","si",true,null,null,1,false,false,1,"umol per mL; micromoles per milliliter; millilitre","LOINC","SCnc","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per milliliter per minute","umol/mL/min","(UMOL/ML)/MIN","amount of substance",1.00368945e+22,[-3,-1,0,0,0,0,0],"(μmol/mL)/min","si",true,null,null,1,false,false,1,"umol per mL per min; micromoles per milliliters per minute; millilitres","LOINC","CCnc","Clinical","unit for the enzyme unit U = umol/min. umol/mL/min = U/mL","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per millimole","umol/mmol","UMOL/MMOL","amount of substance",0.001,[0,0,0,0,0,0,0],"μmol/mmol","si",true,null,null,1,false,false,0,"umol per mmol; micromoles per millimole","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per mole","umol/mol","UMOL/MOL","amount of substance",0.000001,[0,0,0,0,0,0,0],"μmol/mol","si",true,null,null,1,false,false,0,"umol per mol; micromoles per mole","LOINC","SRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"micromole per micromole","umol/umol","UMOL/UMOL","amount of substance",1,[0,0,0,0,0,0,0],"μmol/μmol","si",true,null,null,1,false,false,0,"umol per umol; micromoles per micromole","LOINC","Srto; SFr; EntSRto","Clinical","","10*23","10*23","6.0221367",6.0221367,false],[false,"microOhm","uOhm","UOHM","electric resistance",0.001,[2,-1,1,0,0,-2,0],"μΩ","si",true,null,null,1,false,false,0,"microOhms; µΩ","LOINC","","Clinical","unit of electric resistance","V/A","V/A","1",1,false],[false,"microsecond","us","US","time",0.000001,[0,1,0,0,0,0,0],"μs",null,false,"T",null,1,false,false,0,"microseconds","LOINC","Time","Clinical","",null,null,null,null,false],[false,"micro enzyme unit per gram","uU/g","UU/G","catalytic activity",10036894500,[0,-1,-1,0,0,0,0],"μU/g","chemical",true,null,null,1,false,false,1,"uU per gm; micro enzyme units per gram; micro enzymatic activity per mass; enzyme activity","LOINC","CCnt","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 uU = 1pmol/min","umol/min","UMOL/MIN","1",1,false],[false,"micro enzyme unit per liter","uU/L","UU/L","catalytic activity",10036894500000,[-3,-1,0,0,0,0,0],"μU/L","chemical",true,null,null,1,false,false,1,"uU per L; micro enzyme units per liter; litre; enzymatic activity per volume; enzyme activity ","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 uU = 1pmol/min","umol/min","UMOL/MIN","1",1,false],[false,"micro enzyme unit per milliliter","uU/mL","UU/ML","catalytic activity",10036894500000000,[-3,-1,0,0,0,0,0],"μU/mL","chemical",true,null,null,1,false,false,1,"uU per mL; micro enzyme units per milliliter; millilitre; enzymatic activity per volume; enzyme activity","LOINC","CCnc","Clinical","1 U is the standard enzyme unit which equals 1 micromole substrate catalyzed per minute (1 umol/min); 1 uU = 1pmol/min","umol/min","UMOL/MIN","1",1,false],[false,"microvolt","uV","UV","electric potential",0.001,[2,-2,1,0,0,-1,0],"μV","si",true,null,null,1,false,false,0,"microvolts","LOINC","Elpot","Clinical","unit of electric potential (voltage)","J/C","J/C","1",1,false]]}`), zs = {
  prefixes: Vs,
  units: Gs
};
var e0;
function $s() {
  if (e0) return be;
  e0 = 1, Object.defineProperty(be, "__esModule", {
    value: !0
  }), be.ucumJsonDefs = be.UcumJsonDefs = void 0;
  var f = Fs(), C = W0(), y = Y0(), p = Ae(), l = Hs().unpackArray;
  class r {
    /**
     * This method loads the JSON prefix and unit objects into the prefix and
     * unit tables.
     *
     * @returns nothing
     */
    loadJsonDefs() {
      const u = zs;
      if (u.prefixes = l(u.prefixes), u.units = l(u.units), p.UnitTables.getInstance().unitsCount() === 0) {
        let s = C.PrefixTables.getInstance(), t = u.prefixes, i = t.length;
        for (let c = 0; c < i; c++) {
          let d = new f.Prefix(t[c]);
          s.add(d);
        }
        let n = p.UnitTables.getInstance(), o = u.units, m = o.length;
        for (let c = 0; c < m; c++) {
          let d = new y.Unit(o[c]);
          n.addUnit(d);
        }
      }
    }
    // end loadJsonDefs
  }
  be.UcumJsonDefs = r;
  var e = new r();
  return be.ucumJsonDefs = e, be;
}
var He = {}, t0;
function Ks() {
  if (t0) return He;
  t0 = 1, Object.defineProperty(He, "__esModule", {
    value: !0
  }), He.UnitString = void 0;
  var f = y(Nn());
  function C() {
    if (typeof WeakMap != "function") return null;
    var s = /* @__PURE__ */ new WeakMap();
    return C = function() {
      return s;
    }, s;
  }
  function y(s) {
    if (s && s.__esModule)
      return s;
    if (s === null || typeof s != "object" && typeof s != "function")
      return { default: s };
    var t = C();
    if (t && t.has(s))
      return t.get(s);
    var i = {}, n = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var o in s)
      if (Object.prototype.hasOwnProperty.call(s, o)) {
        var m = n ? Object.getOwnPropertyDescriptor(s, o) : null;
        m && (m.get || m.set) ? Object.defineProperty(i, o, m) : i[o] = s[o];
      }
    return i.default = s, t && t.set(s, i), i;
  }
  function p(s, t, i) {
    return t in s ? Object.defineProperty(s, t, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : s[t] = i, s;
  }
  var l = Ie().Ucum, r = Y0().Unit, e = Ae().UnitTables, a = W0().PrefixTables;
  class u {
    /**
     * Constructor
     */
    constructor() {
      this.utabs_ = e.getInstance(), this.pfxTabs_ = a.getInstance(), this.openEmph_ = l.openEmph_, this.closeEmph_ = l.closeEmph_, this.bracesMsg_ = "", this.parensFlag_ = "parens_placeholder", this.pFlagLen_ = this.parensFlag_.length, this.braceFlag_ = "braces_placeholder", this.bFlagLen_ = this.braceFlag_.length, this.vcMsgStart_ = null, this.vcMsgEnd_ = null, this.retMsg_ = [], this.parensUnits_ = [], this.annotations_ = [], this.suggestions = [];
    }
    // end constructor
    // The start of an error message about an invalid annotation character.
    // A regular expression for validating annotation strings.
    /**
     * Sets the emphasis strings to the HTML used in the webpage display - or
     * blanks them out, depending on the use parameter.
     *
     * @param use flag indicating whether or not to use the html message format;
     *  defaults to true
     */
    useHTMLInMessages(t) {
      t === void 0 || t ? (this.openEmph_ = l.openEmphHTML_, this.closeEmph_ = l.closeEmphHTML_) : (this.openEmph_ = l.openEmph_, this.closeEmph_ = l.closeEmph_);
    }
    // end useHTMLInMessages
    /**
     * Sets the braces message to be displayed for each unit string validation
     * requested, as appropriate.
     *
     * @param use flag indicating whether or not to use the braces message;
     *  defaults to true
     */
    useBraceMsgForEachString(t) {
      t === void 0 || t ? this.bracesMsg_ = l.bracesMsg_ : this.bracesMsg_ = "";
    }
    /**
     * Parses a unit string, returns a unit, a possibly updated version of
     * the string passed in, and messages and suggestions where appropriate.
     *
     * The string returned may be updated if the input string contained unit
     * names, e.g., "pound".  The unit code ([lb_av] for pound) is placed in
     * the string returned, a the returned messages array includes a note
     * explaining the substitution.
     *
     * @param uStr the string defining the unit
     * @param valConv indicates what type of request this is for - a request to
     *  validate (pass in 'validate') or a request to convert (pass in 'convert');
     *  optional, defaults to 'validate'
     * @param suggest a boolean to indicate whether or not suggestions are
     *  requested for a string that cannot be resolved to a valid unit;
     *  true indicates suggestions are wanted; false indicates they are not,
     *  and is the default if the parameter is not specified;
     * @returns an array containing:
     *   the unit object or null if a unit could not be created.  In cases where
     *     a fix was found for a problem string, .e.g., 2.mg for 2mg, a unit will
     *     be returned but an error message will also be returned, describing
     *     the substitution;
     *   the possibly updated unit string passed in;
     *   an array of any user messages (informational, error or warning)
     *     generated (or an empty array); and
     *   a suggestions array of hash objects (1 or more).  Each hash contains
     *   three elements:
     *     'msg' which is a message indicating what unit expression the
     *       suggestions are for;
     *     'invalidUnit' which is the unit expression the suggestions are
     *       for; and
     *     'units' which is an array of data for each suggested unit found.
     *        Each array will contain the unit code, the unit name and the
     *        unit guidance (if any).
     *   The return array will not contain a suggestions array if a valid unit
     *   was found or if suggestions were not requested.
     * @throws an error if nothing was specified.
     */
    parseString(t, i, n) {
      if (t = t.trim(), t === "" || t === null)
        throw new Error("Please specify a unit expression to be validated.");
      i === "validate" ? (this.vcMsgStart_ = l.valMsgStart_, this.vcMsgEnd_ = l.valMsgEnd_) : (this.vcMsgStart_ = l.cnvMsgStart_, this.vcMsgEnd_ = l.cnvMsgEnd_), n === void 0 || n === !1 ? this.suggestions_ = null : this.suggestions_ = [], this.retMsg_ = [], this.parensUnits_ = [], this.annotations_ = [];
      let o = t, m = [];
      if (t = this._getAnnotations(t), this.retMsg_.length > 0)
        m[0] = null, m[1] = null;
      else {
        this.retMsg_.length > 0;
        let c = null;
        for (c in l.specUnits_)
          for (; t.indexOf(c) !== -1; ) t = t.replace(c, l.specUnits_[c]);
        if (t.indexOf(" ") > -1)
          throw new Error("Blank spaces are not allowed in unit expressions.");
        m = this._parseTheString(t, o);
        let d = m[0];
        (f.isIntegerUnit(d) || typeof d == "number") && (d = new r({
          csCode_: o,
          ciCode_: o,
          magnitude_: d,
          name_: o
        }), m[0] = d);
      }
      return m[2] = this.retMsg_, this.suggestions_ && this.suggestions_.length > 0 && (m[3] = this.suggestions_), m;
    }
    // end parseString
    /**
     * Parses a unit string, returns a unit, a possibly updated version of
     * the string passed in, and messages where appropriate.  This should
     * only be called from within this class (or by test code).
     *
     * The string returned may be updated if the input string contained unit
     * names, e.g., "pound".  The unit code ([lb_av] for pound) is placed in
     * the string returned, a the returned messages array includes a note
     * explaining the substitution.
     *
     * @param uStr the string defining the unit
     * @param origString the original unit string passed in
     *
     * @returns
     *  an array containing:
     *    the unit object (or null if there were problems creating the unit); and
     *    the possibly updated unit string passed in.
     *
     * the this.retMsg_ array will be updated with any user messages
     *   (informational, error or warning) generated by this or called methods
     * the this.parensUnits_ array is referenced and possibly populated by
     *   methods called within this one
     * the this.annotations_ array is referenced by methods called within
     *   this one
     * the this.suggestions_ array may be populated by methods called within
     *   this one
     */
    _parseTheString(t, i) {
      let n = null, o = this.retMsg_.length > 0, m = this._processParens(t, i);
      o = m[2];
      let c = [];
      if (!o) {
        t = m[0], i = m[1];
        let d = this._makeUnitsArray(t, i);
        if (o = d[2], !o) {
          c = d[0], i = d[1];
          let h = c.length;
          for (let _ = 0; _ < h; _++) {
            let T = c[_].un;
            if (f.isIntegerUnit(T))
              c[_].un = Number(T);
            else if (T.indexOf(this.parensFlag_) >= 0) {
              let M = this._getParensUnit(T, i);
              o || (o = M[1]), o || (c[_].un = M[0]);
            } else {
              let M = this._makeUnit(T, i);
              M[0] === null ? o = !0 : (c[_].un = M[0], i = M[1]);
            }
          }
        }
      }
      return o || (c[0] === null || c[0] === " " || c[0].un === void 0 || c[0].un === null) && this.retMsg_.length === 0 && (this.retMsg_.push(`Unit string (${i}) did not contain anything that could be used to create a unit, or else something that is not handled yet by this package.  Sorry`), o = !0), o || (n = this._performUnitArithmetic(c, i)), [n, i];
    }
    // end _parseTheString
    /**
     * Extracts all annotations from a unit string, replacing them with
     * placeholders for later evaluation.  The annotations are stored in the
     * this.annotations_ array.  This should only be called from within this
     * class (or by test code).
     *
     * @param uString the unit string being parsed
     * @returns the string after the annotations are replaced with placeholders
     *
     * the this.retMsg_ array will be updated with any user messages
     *   (informational, error or warning) generated by this or called methods
     * the this.annotations_ array is populated by this method
     */
    _getAnnotations(t) {
      let i = t.indexOf("{");
      for (; i >= 0; ) {
        let n = t.indexOf("}");
        if (n < 0)
          this.retMsg_.push("Missing closing brace for annotation starting at " + this.openEmph_ + t.substr(i) + this.closeEmph_), i = -1;
        else {
          let o = t.substring(i, n + 1);
          if (!u.VALID_ANNOTATION_REGEX.test(o))
            this.retMsg_.push(u.INVALID_ANNOTATION_CHAR_MSG + this.openEmph_ + o + this.closeEmph_), i = -1;
          else {
            let m = this.annotations_.length.toString();
            t = t.replace(o, this.braceFlag_ + m + this.braceFlag_), this.annotations_.push(o), i = t.indexOf("{");
          }
        }
      }
      if (this.retMsg_.length == 0) {
        let n = t.indexOf("}");
        n >= 0 && this.retMsg_.push("Missing opening brace for closing brace found at " + this.openEmph_ + t.substring(0, n + 1) + this.closeEmph_);
      }
      return t;
    }
    // end _getAnnotations
    /**
     * Finds and processes any/all parenthesized unit strings. This should only
     * be called from within this class (or by test code).
     *
     * Nested parenthesized strings are processed from the inside out.  The
     * parseString function is called from within this one for each parenthesized
     * unit string, and the resulting unit object is stored in this.parensUnits_,
     * to be processed after all strings are translated to units.
     *
     * A placeholder is placed in the unit string returned to indicate that the
     * unit object should be obtained from the this.parensUnits_ array.  The
     * placeholder consists of the parenthesis flag (this.parensFlag_) followed
     * by the index of the unit in this.parensUnits_ followed by this.parensFlag_.
     *
     * @param uString the unit string being parsed, where this will be the full
     *  string the first time this is called and parenthesized strings on any
     *  subsequent calls
     * @param origString the original string first passed in to parseString
     * @returns
     *  an array containing:
     *   the string after the parentheses are replaced;
     *   the original string; and
     *   a boolean flag indicating whether or not an error occurred that
     *     should stop processing.
     *
     * the this.retMsg_ array will be updated with any user messages
     *   (informational, error or warning) generated by this or called methods
     * this this.parensUnits_ array will be populated with units found for
     *   parenthetical unit strings
     */
    _processParens(t, i) {
      let n = [], o = 0, m = !1, c = this.parensUnits_.length, d = 0;
      for (; t !== "" && !m; ) {
        let h = 0, _ = 0, T = t.indexOf("(");
        if (T < 0) {
          let M = t.indexOf(")");
          if (M >= 0) {
            let P = `Missing open parenthesis for close parenthesis at ${t.substring(0, M + d)}${this.openEmph_}${t.substr(M, 1)}${this.closeEmph_}`;
            M < t.length - 1 && (P += `${t.substr(M + 1)}`), this.retMsg_.push(P), n[o] = t, m = !0;
          } else
            n[o] = t, t = "";
        } else {
          h += 1;
          let M = t.length;
          T > 0 && (n[o++] = t.substr(0, T));
          let P = 0, q = T + 1;
          for (; q < M && h != _; q++)
            t[q] === "(" ? h += 1 : t[q] === ")" && (_ += 1);
          if (h === _) {
            P = q, n[o++] = this.parensFlag_ + c.toString() + this.parensFlag_;
            let z = this._parseTheString(t.substring(T + 1, P - 1), i);
            z[0] === null ? m = !0 : t[T + 1] === "/" ? (this.retMsg_.push("Unary operator '/' is only allowed at the beginning of the main term, not inside a parenthesis."), m = !0) : (i = z[1], this.parensUnits_[c++] = z[0], t = t.substr(P), d = P);
          } else
            n.push(i.substr(T)), this.retMsg_.push(`Missing close parenthesis for open parenthesis at ${i.substring(0, T + d)}${this.openEmph_}${i.substr(T, 1)}${this.closeEmph_}${i.substr(T + 1)}`), m = !0;
        }
      }
      return m && (this.parensUnits_ = []), [n.join(""), i, m];
    }
    // end _processParens
    /**
     * Breaks the unit string into an array of unit descriptors and operators.
     * If a unit descriptor consists of a number preceding a unit code, with
     * no multiplication operator, e.g., 2mg instead of 2.mg, it is handled
     * as if it were a parenthetical expression.
     *
     * This should only be called from within this class (or by test code).
     *
     * @param uStr the unit string being parsed
     * @param origString the original string passed to parseString
     * @returns
     *  an array containing:
     *    the array representing the unit string;
     *    the original string passed in, possibly updated with corrections; and
     *    and a flag indicating whether or not processing can continue.
     *
     * the this.retMsg_ array will be updated with any user messages
     *   (informational, error or warning) generated by this or called methods
     */
    _makeUnitsArray(t, i) {
      let n = t.match(/([./]|[^./]+)/g), o = !1, m = [], c = /(^[0-9]+)(\[?[a-zA-Z\_0-9a-zA-Z\_]+\]?$)/;
      if (n[0] === "/" ? n.unshift("1") : n[0] === "." && (this.retMsg_.push(`${i} is not a valid UCUM code. The multiplication operator at the beginning of the expression is not valid. A multiplication operator must appear only between two codes.`), o = !0), !o) {
        if (!f.isNumericString(n[0])) {
          let d = n[0].match(c);
          if (d && d.length === 3 && d[1] !== "" && d[2] !== "" && d[2].indexOf(this.braceFlag_) !== 0) {
            let h = d[2];
            if (!o && d[2].indexOf(this.parensFlag_) !== -1) {
              let _ = this._getParensUnit(d[2], i);
              d[2] = _[0].csCode_, h = `(${d[2]})`, o = _[1];
            }
            o || (this.retMsg_.push(`${d[1]}${h} is not a valid UCUM code.  ${this.vcMsgStart_}${d[1]}.${h}${this.vcMsgEnd_}`), i = i.replace(`${d[1]}${h}`, `${d[1]}.${h}`), n[0] = d[2], n.unshift(d[1], "."));
          }
        }
        if (!o) {
          let d = n.length;
          m = [{
            op: "",
            un: n[0]
          }];
          for (let h = 1; h < d; h++) {
            let _ = n[h++];
            if (!n[h])
              this.retMsg_.push(`${i} is not a valid UCUM code. It is terminated with the operator ${this.openEmph_}${_}${this.closeEmph_}.`), h = d, o = !0;
            else if (l.validOps_.indexOf(n[h]) !== -1)
              this.retMsg_.push(`${i} is not a valid UCUM code. A unit code is missing between${this.openEmph_}${_}${this.closeEmph_}and${this.openEmph_}${n[h]}${this.closeEmph_}in${this.openEmph_}${_}${n[h]}${this.closeEmph_}.`), h = d, o = !0;
            else if (f.isNumericString(n[h]))
              m.push({
                op: _,
                un: n[h]
              });
            else {
              let T = n[h].match(c);
              if (T && T.length === 3 && T[1] !== "" && T[2] !== "" && T[2].indexOf(this.braceFlag_) !== 0) {
                let M = T[0];
                if (!o && T[2].indexOf(this.parensFlag_) !== -1) {
                  let P = this._getParensUnit(T[2], i);
                  if (T[2] = P[0].csCode_, M = `(${T[2]})`, o = P[1], !o) {
                    this.retMsg_.push(`${T[1]}${M} is not a valid UCUM code.  ${this.vcMsgStart_}${T[1]}.${M}${this.vcMsgEnd_}`);
                    let q = `(${T[1]}.${M})`;
                    i = i.replace(`${T[1]}${M}`, q);
                    let z = this._processParens(q, i);
                    o = z[2], o || m.push({
                      op: _,
                      un: z[0]
                    });
                  }
                } else {
                  let P = "(" + T[1] + "." + T[2] + ")", q = this._processParens(P, i);
                  q[2] ? (h = d, o = !0) : (this.retMsg_.push(`${T[0]} is not a valid UCUM code.  ${this.vcMsgStart_}${T[1]}.${T[2]}${this.vcMsgEnd_}`), i = i.replace(T[0], P), m.push({
                    op: _,
                    un: q[0]
                  }));
                }
              } else
                m.push({
                  op: _,
                  un: n[h]
                });
            }
          }
        }
      }
      return [m, i, o];
    }
    // end _makeUnitsArray
    /**
     * Takes a unit string containing parentheses flags and returns the unit they
     * represent.  Any text found before and/or after the parenthetical
     * expression is checked to see if we can tell what the user meant and
     * let them know what it should have been.  For example, 2(mg), which
     * would resolve to 2mg, should be 2.mg.
     *
     * This should only be called from within this class (or by test code).
     *
     * @param pStr the string being parsed
     * @param origString the original unit string passed in; passed through
     *  to _getAnnonText if annotation flags are found in any text preceding
     *  or following the parenthetical unit
     * @returns
     *   an array containing
     *     the unit object; and
     *     a flag indicating whether or not processing should be ended.
     *       True indicates that the string was invalid and no corrections
     *         (substitutions or suggestions) could be found;
     *       False indicates that it was either valid or substitutions/suggestions
     *          were made.
     *   the this.retMsg_ array will be updated with any user messages
     *     (informational, error or warning) generated by this or called methods
     *   this this.parensUnits_ array contains the units that are acquired by
     *     this method
     * @throws an error if an invalid parensUnit index was found.  This is
     *    a processing error.
     */
    _getParensUnit(t, i) {
      let n = !1, o = null, m = t.indexOf(this.parensFlag_), c = null;
      m > 0 && (c = t.substr(0, m - 1));
      let d = t.lastIndexOf(this.parensFlag_), h = null;
      d + this.pFlagLen_ < t.length && (h = t.substr(d + this.pFlagLen_));
      let _ = t.substring(m + this.pFlagLen_, d);
      if (f.isNumericString(_))
        o = this.parensUnits_[Number(_)], f.isIntegerUnit(o) ? t = o : t = o.csCode_;
      else
        throw new Error(`Processing error - invalid parens number ${_} found in ${t}.`);
      if (c)
        if (f.isNumericString(c)) {
          let T = o.getProperty("magnitude_");
          T *= Number(c), o.assignVals({
            magnitude_: T
          }), t = `${c}.${t}`, this.retMsg_.push(`${c}${t} is not a valid UCUM code.
` + this.vcMsgStart_ + t + this.vcMsgEnd_);
        } else if (c.indexOf(this.braceFlag_) >= 0) {
          let T = this._getAnnoText(c, i);
          if (T[1] || T[2])
            throw new Error(`Text found before the parentheses (${c}) included an annotation along with other text for parenthetical unit ${o.csCode_}`);
          t += T[0], this.retMsg_.push(`The annotation ${T[0]} before the unit code is invalid.
` + this.vcMsgStart_ + t + this.vcMsgEnd_);
        } else this.suggestions_ ? n = this._getSuggestions(c) !== "succeeded" : (this.retMsg_.push(`${c} preceding the unit code ${t} is invalid.  Unable to make a substitution.`), n = !0);
      if (h)
        if (h.indexOf(this.braceFlag_) >= 0) {
          let T = this._getAnnoText(h, i);
          if (T[1] || T[2])
            throw new Error(`Text found after the parentheses (${h}) included an annotation along with other text for parenthetical unit ${o.csCode_}`);
          t += T[0];
        } else if (f.isNumericString(h)) {
          o = null;
          let T = `An exponent (${h}) following a parenthesis is invalid as of revision 1.9 of the UCUM Specification.`;
          t.match(/\d$/) || (t += h, T += `
  ` + this.vcMsgStart_ + t + this.vcMsgEnd_), this.retMsg_.push(T), n = !0;
        } else this.suggestions_ ? n = this._getSuggestions(c) !== "succeeded" : (this.retMsg_.push(`Text ${h} following the unit code ${t} is invalid.  Unable to make a substitution.`), n = !0);
      return n || (o ? f.isIntegerUnit(o) ? o = new r({
        csCode_: o,
        magnitude_: o,
        name_: o
      }) : o.csCode_ = t : o = new r({
        csCode_: t,
        magnitude_: 1,
        name_: t
      })), [o, n];
    }
    // end _getParensUnit
    /**
     * Takes a unit string containing annotation flags and returns the
     * annotation they represent.  This also returns any text found before
     * the annotation and any found after the annotation.
     *
     * This should only be called from within this class (or by test code).
     * NEEDS FIX in next branch to handle string with multiple annotations.
     *
     * @param pStr the string being parsed
     * @param origString the original string being parsed; used in error msg
     *  thrown for an invalid index to the annotations array
     * @returns
     *  an array containing
     *    the annotation for the pStr;
     *    any text found before the annotation; and
     *    any text found after the annotation.
     *
     * the this.retMsg_ array will be updated with any user messages
     *   (informational, error or warning) generated by this or called methods
     * the this.annotations_ array is used as the source for the annotations text
     * @throws an error if for a processing error - an invalid annotation index.
     */
    _getAnnoText(t, i) {
      let n = t.indexOf(this.braceFlag_), o = n > 0 ? t.substring(0, n) : null;
      n !== 0 && (t = t.substr(n));
      let m = t.indexOf(this.braceFlag_, 1), c = m + this.bFlagLen_ < t.length ? t.substr(m + this.bFlagLen_) : null, d = t.substring(this.bFlagLen_, m), h = Number(d);
      if (!f.isNumericString(d) || h >= this.annotations_.length)
        throw new Error(`Processing Error - invalid annotation index ${d} found in ${t} that was created from ${i}`);
      return t = this.annotations_[h], [t, o, c];
    }
    // end _getAnnoText
    /**
     * Takes a unit string and looks for suggested units.  This should be
     * called for unit strings that cannot be resolved to unit codes.  The
     * string is searched for in the synonyms table found in the UnitTables
     * class.  That table includes all synonyms and unit names for the units
     * in the unit data table.
     *
     * @param pStr the string being parsed
     * @returns an object that contains an element named 'status', whose
     *  value indicates the status of the request:
     *   'succeeded' indicates that synonyms were found;
     *   'failed' indicates that no synonyms were found; or
     *   'error' which indicates that an error occurred
     *
     * the this.retMsg_ array will be updated with a message indicating whether
     *  or not synonyms/suggestions  were found
     * the this.suggestions_ array will be updated with a hash (added to the
     *   array if it already contains others) that contains three elements:
     *   'msg' which is a message indicating what unit expression the
     *      suggestions are for;
     *   'invalidUnit' which is the unit expression the suggestions are for; and
     *   'units' which is an array of data for each suggested unit found.
     *       Each array will contain the unit code, the unit name and the
     *       unit guidance (if any).
     */
    _getSuggestions(t) {
      let i = f.getSynonyms(t);
      if (i.status === "succeeded") {
        let n = {};
        n.msg = `${t} is not a valid UCUM code.  We found possible units that might be what was meant:`, n.invalidUnit = t;
        let o = i.units.length;
        n.units = [];
        for (let m = 0; m < o; m++) {
          let c = i.units[m], d = [c.code, c.name, c.guidance];
          n.units.push(d);
        }
        this.suggestions_.push(n);
      } else
        this.retMsg_.push(`${t} is not a valid UCUM code.  No alternatives were found.`);
      return i.status;
    }
    // end getSuggestions
    /**
     * Creates a unit object from a string defining one unit.  The string
     * should consist of a unit code for a unit already defined (base or
     * otherwise).  It may include a prefix and an exponent, e.g., cm2
     * (centimeter squared).  This should only be called from within this
     * class (or by test code).
     *
     * @params uCode the string defining the unit
     * @param origString the original string to be parsed; used to provide
     *  context for messages
     * @returns
     *  an array containing:
     *    a unit object, or null if there were problems creating the unit; and
     *    the origString passed in, which may be updated if a unit name was
     *    translated to a unit code.
     *
     *  the this.retMsg_ array will be updated with any user messages
     *    (informational, error or warning) generated by this or called methods
     *  the this.suggestions_ array will be populated if no unit (with or without
     *    substitutions) could be found and suggestions were requested
     */
    _makeUnit(t, i) {
      let n = this.utabs_.getUnitByCode(t);
      if (n)
        n = n.clone();
      else if (t.indexOf(this.braceFlag_) >= 0) {
        let o = this._getUnitWithAnnotation(t, i);
        n = o[0], n && (i = o[1]);
      } else {
        if (t.indexOf("^") > -1) {
          let o = t.replace("^", "*");
          n = this.utabs_.getUnitByCode(o), n && (n = n.clone(), n.csCode_ = n.csCode_.replace("*", "^"), n.ciCode_ = n.ciCode_.replace("*", "^"));
        }
        if (!n) {
          let o = "[" + t + "]";
          n = this.utabs_.getUnitByCode(o), n && (n = n.clone(), i = i.replace(t, o), this.retMsg_.push(`${t} is not a valid unit expression, but ${o} is.
` + this.vcMsgStart_ + `${o} (${n.name_})${this.vcMsgEnd_}`));
        }
        if (!n) {
          let o = this.utabs_.getUnitByName(t);
          if (o && o.length > 0) {
            n = o[0].clone();
            let m = "The UCUM code for " + t + " is " + n.csCode_ + `.
` + this.vcMsgStart_ + n.csCode_ + this.vcMsgEnd_, c = !1;
            for (let _ = 0; _ < this.retMsg_.length && !c; _++) c = this.retMsg_[_] === m;
            c || this.retMsg_.push(m);
            let d = new RegExp("(^|[./({])(" + t + ")($|[./)}])"), h = i.match(d);
            i = i.replace(d, h[1] + n.csCode_ + h[3]), t = n.csCode_;
          }
        }
        if (!n) {
          let o = null;
          for (o in l.specUnits_)
            t.indexOf(l.specUnits_[o]) !== -1 && (t = t.replace(l.specUnits_[o], o));
          n = this.utabs_.getUnitByCode(t), n && (n = n.clone());
        }
        if (!n) {
          let o = t, m = null, c = null, d = null, h = null, _ = null, T = null, M = this._isCodeWithExponent(t);
          if (M && (t = M[0], c = M[1], m = this.utabs_.getUnitByCode(t)), c && isNaN(c))
            n = null, this.retMsg_.push(`${o} is not a valid UCUM code.`);
          else {
            if (!m && (d = t.charAt(0), h = this.pfxTabs_.getPrefixByCode(d), h)) {
              _ = h.getValue(), T = h.getExp();
              let P = d.length;
              t = t.substr(P), m = this.utabs_.getUnitByCode(t), !m && d == "d" && t.substr(0, 1) == "a" && (d = "da", h = this.pfxTabs_.getPrefixByCode(d), _ = h.getValue(), t = t.substr(1), m = this.utabs_.getUnitByCode(t)), m && m.source_ == "LOINC" && (m = null);
            }
            if (!m)
              n = null, this.suggestions_ ? this._getSuggestions(o) : this.retMsg_.push(`${o} is not a valid UCUM code.`);
            else {
              n = m.clone(), n.resetFieldsForDerivedUnit();
              let P = n.getProperty("dim_"), q = n.getProperty("magnitude_"), z = n.getProperty("name_"), W = n.getProperty("ciCode_"), Y = n.getProperty("printSymbol_");
              if (c) {
                c = parseInt(c);
                let v = c;
                P && (P = P.mul(c)), q = Math.pow(q, c), n.assignVals({
                  magnitude_: q
                }), h && T && (v *= h.getExp(), _ = Math.pow(10, v));
              }
              h && (n.cnv_ ? n.assignVals({
                cnvPfx_: _
              }) : (q *= _, n.assignVals({
                magnitude_: q
              })));
              let w = n.csCode_;
              if (h && (z = h.getName() + z, w = d + w, W = h.getCiCode() + W, Y = h.getPrintSymbol() + Y, n.assignVals({
                name_: z,
                csCode_: w,
                ciCode_: W,
                printSymbol_: Y
              })), c) {
                let v = c.toString();
                n.assignVals({
                  name_: z + "<sup>" + v + "</sup>",
                  csCode_: w + v,
                  ciCode_: W + v,
                  printSymbol_: Y + "<sup>" + v + "</sup>"
                });
              }
            }
          }
        }
      }
      return [n, i];
    }
    // end _makeUnit
    /**
     * This method handles unit creation when an annotation is included
     * in the unit string.  This basically isolates and retrieves the
     * annotation and then calls _makeUnit to try to get a unit from
     * any text that precedes or follows the annotation.
     *
     * @param uCode the string defining the unit
     * @param origString the original full string submitted to parseString
     * @returns the unit object found, or null if one could not be found
     *
     * the this.retMsg_ array will be updated with any user messages
     *   (informational, error or warning) generated by this or called methods
     */
    _getUnitWithAnnotation(t, i) {
      let n = null, o = this._getAnnoText(t, i), m = o[0], c = o[1], d = o[2];
      this.bracesMsg_ && this.retMsg_.indexOf(this.bracesMsg_) === -1 && this.retMsg_.push(this.bracesMsg_);
      let h = this.retMsg_.length;
      if (!c && !d) {
        let _ = "[" + m.substring(1, m.length - 1) + "]", T = this._makeUnit(_, i);
        T[0] ? (n = t, this.retMsg_.push(`${m} is a valid unit expression, but did you mean ${_} (${T[0].name_})?`)) : this.retMsg_.length > h && this.retMsg_.pop(), n = new r({
          csCode_: m,
          ciCode_: m,
          magnitude_: 1,
          name_: m
        });
      } else if (c && !d)
        if (f.isIntegerUnit(c))
          n = c;
        else {
          let _ = this._makeUnit(c, i);
          _[0] ? (n = _[0], n.csCode_ += m, i = _[1]) : this.retMsg_.push(`Unable to find a unit for ${c} that precedes the annotation ${m}.`);
        }
      else if (!c && d)
        if (f.isIntegerUnit(d))
          n = d + m, this.retMsg_.push(`The annotation ${m} before the ``${d} is invalid.\n` + this.vcMsgStart_ + n + this.vcMsgEnd_);
        else {
          let _ = this._makeUnit(d, i);
          _[0] ? (n = _[0], n.csCode_ += m, i = n.csCode_, this.retMsg_.push(`The annotation ${m} before the unit code is invalid.
` + this.vcMsgStart_ + n.csCode_ + this.vcMsgEnd_)) : this.retMsg_.push(`Unable to find a unit for ${c} that follows the annotation ${m}.`);
        }
      else
        this.retMsg_.push(`Unable to find a unit for ${c}${m}${d}.
We are not sure how to interpret text both before and after the annotation.  Sorry`);
      return [n, i];
    }
    // end _getUnitWithAnnotations
    /**
     * Performs unit arithmetic for the units in the units array.  That array
     * contains units/numbers and the operators (division or multiplication) to
     * be performed on each unit/unit or unit/number pair in the array.  This
     * should only be called from within this class (or by test code).
     *
     * @params uArray the array that contains the units, numbers and operators
     *  derived from the unit string passed in to parseString
     * @param origString the original string to be parsed; used to provide
     *  context for messages
     *
     * @returns a single unit object that is the result of the unit arithmetic
     *
     * the this.retMsg_ array will be updated with any user messages
     *   (informational, error or warning) generated by this or called methods
     */
    _performUnitArithmetic(t, i) {
      let n = t[0].un;
      f.isIntegerUnit(n) && (n = new r({
        csCode_: n,
        ciCode_: n,
        magnitude_: Number(n),
        name_: n
      }));
      let o = t.length, m = !1;
      for (let c = 1; c < o && !m; c++) {
        let d = t[c].un;
        if (f.isIntegerUnit(d) && (d = new r({
          csCode_: d,
          ciCode_: d,
          magnitude_: Number(d),
          name_: d
        })), d === null || typeof d != "number" && !d.getProperty) {
          let h = `Unit string (${i}) contains unrecognized element`;
          d && (h += ` (${this.openEmph_}${d.toString()}${this.closeEmph_})`), h += "; could not parse full string.  Sorry", this.retMsg_.push(h), m = !0;
        } else
          try {
            t[c].op === "/" ? n = n.divide(d) : n = n.multiplyThese(d);
          } catch (h) {
            this.retMsg_.unshift(h.message), m = !0, n = null;
          }
      }
      return n;
    }
    // end _performUnitArithmetic
    /**
     * This tests a string to see if it starts with characters and ends with
     * digits.  This is used to test for an exponent on a UCUM code (or what
     * we think might be a UCUM code).  This is broken out to a separate
     * function so that the regular expression can be verified to provide the
     * results we expect, in case someone changes it.  (Per Paul Lynch)
     * See "Test _isCodeWithExponent method" in testUnitString.spec.js
     *
     * This particular regex has been tweaked several times.  This one
     * works with the following test strings:
     * "m[H2O]-21 gives ["m[H2O]-21", "m[H2O]", "-21"]
     * "m[H2O]+21 gives ["m[H2O]+21", "m[H2O]", "+21"]
     * "m[H2O]21 gives ["m[H2O]-21", "m[H2O]", "21"]
     * "s2" gives ["s2", "s, "2"]
     * "kg" gives null
     * "m[H2O]" gives null
     * "m[H2O]23X" gives null
     *
     * @params uCode the code being tested
     * @returns an array containing: (1) the code without the exponent (or
     *  trailing number); and (2) the exponent/trailing number.  Returns null
     *  if there is no trailing number or something follows the trailing
     *  number, or if the first part is not characters.
     */
    _isCodeWithExponent(t) {
      let i = [], n = t.match(/(^[^\-\+]+?)([\-\+\d]+)$/);
      return n && n[2] && n[2] !== "" ? (i.push(n[1]), i.push(n[2])) : i = null, i;
    }
    // end _isCodeWithExponent
  }
  return He.UnitString = u, p(u, "INVALID_ANNOTATION_CHAR_MSG", "An invalid character was found in the annotation "), p(u, "VALID_ANNOTATION_REGEX", /^\{[!-z|~]*\}$/), u.getInstance = function() {
    return new u();
  }, He;
}
var n0;
function js() {
  if (n0) return we;
  n0 = 1, Object.defineProperty(we, "__esModule", {
    value: !0
  }), we.UcumLhcUtils = void 0;
  var f = $s(), C = p(Nn());
  function y() {
    if (typeof WeakMap != "function") return null;
    var u = /* @__PURE__ */ new WeakMap();
    return y = function() {
      return u;
    }, u;
  }
  function p(u) {
    if (u && u.__esModule)
      return u;
    if (u === null || typeof u != "object" && typeof u != "function")
      return { default: u };
    var s = y();
    if (s && s.has(u))
      return s.get(u);
    var t = {}, i = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for (var n in u)
      if (Object.prototype.hasOwnProperty.call(u, n)) {
        var o = i ? Object.getOwnPropertyDescriptor(u, n) : null;
        o && (o.get || o.set) ? Object.defineProperty(t, n, o) : t[n] = u[n];
      }
    return t.default = u, s && s.set(u, t), t;
  }
  var l = Ie().Ucum, r = Ae().UnitTables, e = Ks().UnitString;
  class a {
    /**
     * Constructor.  This loads the json prefix and unit definitions if
     * they haven't been loaded already and creates itself as a singleton object.
     *
     */
    constructor() {
      r.getInstance().unitsCount() === 0 && f.ucumJsonDefs.loadJsonDefs(), this.uStrParser_ = e.getInstance();
    }
    // end constructor
    /**
     * This method calls the useHTMLInMessages method on the UnitString
     * object.  It should be called by web applications that use
     * these utilities.
     *
     * @param use flag indicating whether or not to use the braces message;
     *  defaults to true
     */
    useHTMLInMessages(s) {
      s === void 0 && (s = !0), this.uStrParser_.useHTMLInMessages(s);
    }
    /**
     * This method calls the useBraceMsgForEachString method on the UnitString
     * object.  It should be called by web applications where unit
     * strings are validated individually (as opposed to validating a whole
     * file of unit strings).
     *
     * @param use flag indicating whether or not to use the braces message;
     *  defaults to true
     */
    useBraceMsgForEachString(s) {
      s === void 0 && (s = !0), this.uStrParser_.useBraceMsgForEachString(s);
    }
    /**
     * This method validates a unit string.  It first checks to see if the
     * string passed in is a unit code that is found in the unit codes table.
     * If it is not found it parses the string to see if it resolves to a
     * valid unit string.
     *
     * If a valid unit cannot be found, the string is tested for some common
     * errors, such as missing brackets or a missing multiplication operator.
     * If found, the error is reported in the messages array that is returned.
     *
     * If a valid unit cannot be found and an error cannot be discerned, this
     * may return, if requested, a list of suggested units in the messages
     * array that is returned.  Suggestions are based on matching the expression
     * with unit names and synonyms.
     *
     * @param uStr the string to be validated
     * @param suggest a boolean to indicate whether or not suggestions are
     *  requested for a string that cannot be resolved to a valid unit;
     *  true indicates suggestions are wanted; false indicates they are not,
     *  and is the default if the parameter is not specified;
     * @param valConv a string indicating if this validation request was initiated
     *  by a validation task ('validate') or a conversion task ('convert'),
     *  used only for the demo code, and the default is 'Validator' if the
     *  parameter is not specified;
     * @returns an object with five properties:
     *  'status' will be 'valid' (the uStr is a valid UCUM code), 'invalid'
     *     (the uStr is not a valid UCUM code, and substitutions or
     *     suggestions may or may not be returned, depending on what was
     *     requested and found); or 'error' (an input or programming error
     *     occurred);
     *  'ucumCode' the valid ucum code, which may differ from what was passed
     *    in (e.g., if 'Gauss' is passed in, this will contain 'G') OR null if
     *    the string was flagged as invalid or an error occurred;
     *  'msg' is an array of one or more messages, if the string is invalid or
     *        an error occurred, indicating the problem, or an explanation of a
     *        substitution such as the substitution of 'G' for 'Gauss', or
     *        an empty array if no messages were generated;
     *  'unit' which is null if no unit is found, or a hash for a unit found:
     *    'code' is the unit's ucum code (G in the above example;
     *    'name' is the unit's name (Gauss in the above example); and
     *    'guidance' is the unit's guidance/description data; and
     *  'suggestions' if suggestions were requested and found, this is an array
     *     of one or more hash objects.  Each hash contains three elements:
     *     'msg' which is a message indicating what part of the uStr input
     *        parameter the suggestions are for;
     *     'invalidUnit' which is the unit expression the suggestions are
     *        for; and
     *     'units' which is an array of data for each suggested unit found.
     *        Each array will contain the unit code, the unit name and the
     *        unit guidance (if any).
     *     If no suggestions were requested and found, this property is not
     *     returned.
     */
    validateUnitString(s, t, i) {
      t === void 0 && (t = !1), i === void 0 && (i = "validate");
      let n = this.getSpecifiedUnit(s, i, t), o = n.unit, m = o ? {
        ucumCode: n.origString,
        unit: {
          code: o.csCode_,
          name: o.name_,
          guidance: o.guidance_
        }
      } : {
        ucumCode: null
      };
      return m.status = n.status, n.suggestions && (m.suggestions = n.suggestions), m.msg = n.retMsg, m;
    }
    // end validateUnitString
    /**
     * This method converts one unit to another
     *
     * @param fromUnitCode the unit code/expression/string of the unit to be converted
     * @param fromVal the number of "from" units to be converted to "to" units
     * @param toUnitCode the unit code/expression/string of the unit that the from
     *  field is to be converted to
     * @param suggest a boolean to indicate whether or not suggestions are
     *  requested for a string that cannot be resolved to a valid unit;
     *  true indicates suggestions are wanted; false indicates they are not,
     *  and is the default if the parameter is not specified;
     * @param molecularWeight the molecular weight of the substance in question
     *  when a conversion is being requested from mass to moles and vice versa.
     *  This is required when one of the units represents a value in moles.  It is
     *  ignored if neither unit includes a measurement in moles.
     * @returns a hash with six elements:
     *  'status' that will be: 'succeeded' if the conversion was successfully
     *     calculated; 'failed' if the conversion could not be made, e.g., if
     *     the units are not commensurable; or 'error' if an error occurred;
     *  'toVal' the numeric value indicating the conversion amount, or null
     *     if the conversion failed (e.g., if the units are not commensurable);
     *  'msg' is an array message, if the string is invalid or an error occurred,
     *        indicating the problem, or an explanation of a substitution such as
     *        the substitution of 'G' for 'Gauss', or an empty array if no
     *        messages were generated;
     *  'suggestions' if suggestions were requested and found, this is a hash
     *     that contains at most two elements:
     *     'from' which, if the fromUnitCode input parameter or one or more of
     *       its components could not be found, is an array one or more hash
     *       objects.  Each hash contains three elements:
     *         'msg' which is a message indicating what unit expression the
     *            suggestions are for;
     *         'invalidUnit' which is the unit expression the suggestions
     *            are for; and
     *         'units' which is an array of data for each suggested unit found.
     *            Each array will contain the unit code, the unit name and the
     *            unit guidance (if any).
     *       If no suggestions were found for the fromUnitCode this element
     *       will not be included.
     *     'to' which, if the "to" unit expression or one or more of its
     *       components could not be found, is an array one or more hash objects.  Each hash
     *       contains three elements:
     *         'msg' which is a message indicating what toUnitCode input
     *            parameter the suggestions are for;
     *         'invalidUnit' which is the unit expression the suggestions
     *            are for; and
     *         'units' which is an array of data for each suggested unit found.
     *            Each array will contain the unit code, the unit name and the
     *            unit guidance (if any).
     *       If no suggestions were found for the toUnitCode this element
     *       will not be included.
     *    No 'suggestions' element will be included in the returned hash
     *    object if none were found, whether or not they were requested.
     *  'fromUnit' the unit object for the fromUnitCode passed in; returned
     *     in case it's needed for additional data from the object; and
     *  'toUnit' the unit object for the toUnitCode passed in; returned
     *     in case it's needed for additional data from the object.
     */
    convertUnitTo(s, t, i, n, o) {
      n === void 0 && (n = !1), o === void 0 && (o = null);
      let m = {
        status: "failed",
        toVal: null,
        msg: []
      };
      if (s && (s = s.trim()), (!s || s == "") && (m.status = "error", m.msg.push('No "from" unit expression specified.')), this._checkFromVal(t, m), i && (i = i.trim()), (!i || i == "") && (m.status = "error", m.msg.push('No "to" unit expression specified.')), m.status !== "error")
        try {
          let c = null, d = this.getSpecifiedUnit(s, "convert", n);
          c = d.unit, d.retMsg && (m.msg = m.msg.concat(d.retMsg)), d.suggestions && (m.suggestions = {}, m.suggestions.from = d.suggestions), c || m.msg.push(`Unable to find a unit for ${s}, so no conversion could be performed.`);
          let h = null;
          if (d = this.getSpecifiedUnit(i, "convert", n), h = d.unit, d.retMsg && (m.msg = m.msg.concat(d.retMsg)), d.suggestions && (m.suggestions || (m.suggestions = {}), m.suggestions.to = d.suggestions), h || m.msg.push(`Unable to find a unit for ${i}, so no conversion could be performed.`), c && h)
            try {
              if (!o)
                m.toVal = h.convertFrom(t, c);
              else {
                if (c.moleExp_ !== 0 && h.moleExp_ !== 0)
                  throw new Error("A molecular weight was specified but a mass <-> mole conversion cannot be executed for two mole-based units.  No conversion was attempted.");
                if (c.moleExp_ === 0 && h.moleExp_ === 0)
                  throw new Error("A molecular weight was specified but a mass <-> mole conversion cannot be executed when neither unit is mole-based.  No conversion was attempted.");
                if (!c.isMoleMassCommensurable(h))
                  throw new Error(`Sorry.  ${s} cannot be converted to ${i}.`);
                c.moleExp_ !== 0 ? m.toVal = c.convertMolToMass(t, h, o) : m.toVal = c.convertMassToMol(t, h, o);
              }
              m.status = "succeeded", m.fromUnit = c, m.toUnit = h;
            } catch (_) {
              m.status = "failed", m.msg.push(_.message);
            }
        } catch (c) {
          c.message == l.needMoleWeightMsg_ ? m.status = "failed" : m.status = "error", m.msg.push(c.message);
        }
      return m;
    }
    // end convertUnitTo
    /**
     *  Converts the given unit string into its base units, their exponents, and
     *  a magnitude, and returns that data.
     * @param fromUnit the unit string to be converted to base units information
     * @param fromVal the number of "from" units to be converted
     * @returns an object with the properties:
     *  'status' indicates whether the result succeeded.  The value will be one of:
     *    'succeeded':  the conversion was successfully calculated (which can be
     *      true even if it was already in base units);
     *    'invalid':  fromUnit is not a valid UCUM code;
     *    'failed':  the conversion could not be made (e.g., if it is an "arbitrary" unit);
     *    'error':  if an error occurred (an input or programming error)
     *  'msg': an array of messages (possibly empty) if the string is invalid or
     *        an error occurred, indicating the problem, or a suggestion of a
     *        substitution such as the substitution of 'G' for 'Gauss', or
     *        an empty array if no messages were generated.  There can also be a
     *        message that is just informational or warning.
     *  'magnitude': the new value when fromVal units of fromUnits is expressed in the base units.
     *  'fromUnitIsSpecial': whether the input unit fromUnit is a "special unit"
     *         as defined in UCUM.  This means there is some function applied to convert
     *         between fromUnit and the base units, so the returned magnitude is likely not
     *         useful as a scale factor for other conversions (i.e., it only has validity
     *         and usefulness for the input values that produced it).
     *  'unitToExp': a map of base units in fromUnit to their exponent
     */
    convertToBaseUnits(s, t) {
      var n, o;
      let i = {};
      if (this._checkFromVal(t, i), !i.status) {
        let m = this.getSpecifiedUnit(s, "validate");
        i = {
          status: m.status == "valid" ? "succeeded" : m.status
        };
        let c = m.unit;
        if (i.msg = m.retMsg || [], !c)
          ((n = m.retMsg) == null ? void 0 : n.length) == 0 && i.msg.push("Could not find unit information for " + s);
        else if (c.isArbitrary_)
          i.msg.push("Arbitrary units cannot be converted to base units or other units."), i.status = "failed";
        else if (i.status == "succeeded") {
          let d = {}, h = (o = c.dim_) == null ? void 0 : o.dimVec_, _ = "1";
          if (h) {
            let P = r.getInstance().dimVecIndexToBaseUnit_;
            for (let q = 0, z = h.length; q < z; ++q) {
              let W = h[q];
              W && (d[P[q]] = W, _ += "." + P[q] + W);
            }
          }
          let T = this.getSpecifiedUnit(_, "validate"), M = T.unit;
          if (T.status !== "valid")
            i.msg.push("Unable construct base unit string; tried " + _), i.status = "error";
          else {
            try {
              i.magnitude = M.convertFrom(t, c);
            } catch (P) {
              i.msg.push(P.toString()), i.status = "error";
            }
            i.status == "succeeded" && (i.unitToExp = d, i.fromUnitIsSpecial = c.isSpecial_);
          }
        }
      }
      return i;
    }
    /**
     *  Checks the given value as to whether it is suitable as a "from" value in a
     *  unit conversion.  If it is not, the responseObj will have its status set
     *  to 'error' and a message added.
     * @param fromVal The value to check
     * @param responseObj the object that will be updated if the value is not
     *  usable.
     */
    _checkFromVal(s, t) {
      (s === null || isNaN(s) || typeof s != "number" && !C.isNumericString(s)) && (t.status = "error", t.msg || (t.msg = []), t.msg.push('No "from" value, or an invalid "from" value, was specified.'));
    }
    /**
     * This method accepts a term and looks for units that include it as
     * a synonym - or that include the term in its name.
     *
     * @param theSyn the term to search for
     * @returns a hash with up to three elements:
     *  'status' contains the status of the request, which can be 'error',
     *    'failed' or succeeded';
     *  'msg' which contains a message for an error or if no units were found; and
     *  'units' which is an array that contains one hash for each unit found:
     *    'code' is the unit's csCode_
     *    'name' is the unit's name_
     *    'guidance' is the unit's guidance_
     *
     */
    checkSynonyms(s) {
      let t = {};
      return s == null ? (t.status = "error", t.msg = "No term specified for synonym search.") : t = C.getSynonyms(s), t;
    }
    // end checkSynonyms
    /**
     * This method parses a unit string to get (or try to get) the unit
     * represented by the string.  It returns an error message if no string was specified
     * or if any errors were encountered trying to get the unit.
     *
     * @param uName the expression/string representing the unit
     * @param valConv indicates what type of request this is for - a request to
     *  validate (pass in 'validate') or a request to convert (pass in 'convert')
     * @param suggest a boolean to indicate whether or not suggestions are
     *  requested for a string that cannot be resolved to a valid unit;
     *  true indicates suggestions are wanted; false indicates they are not,
     *  and is the default if the parameter is not specified;
     * @returns a hash containing:
     *   'status' will be 'valid' (uName is a valid UCUM code), 'invalid'
     *     (the uStr is not a valid UCUM code, and substitutions or
     *     suggestions may or may not be returned, depending on what was
     *     requested and found); or 'error' (an input or programming error
     *     occurred);
     *   'unit' the unit object (or null if there were problems creating the
     *     unit);
     *   'origString' the possibly updated unit string passed in;
     *   'retMsg' an array of user messages (informational, error or warning) if
     *     any were generated (IF any were generated, otherwise will be an
     *     empty array); and
     *   'suggestions' is an array of 1 or more hash objects.  Each hash
     *     contains three elements:
     *       'msg' which is a message indicating what unit expression the
     *          suggestions are for;
     *       'invalidUnit' which is the unit expression the suggestions are
     *          for; and
     *       'units' which is an array of data for each suggested unit found.
     *          Each array will contain the unit code, the unit name and the
     *          unit guidance (if any).
     *   The return hash will not contain a suggestions array if a valid unit
     *   was found or if suggestions were not requested and found.
     */
    getSpecifiedUnit(s, t, i) {
      i === void 0 && (i = !1);
      let n = {};
      if (n.retMsg = [], !s)
        n.retMsg.push("No unit string specified.");
      else {
        let o = r.getInstance();
        s = s.trim();
        let m = o.getUnitByCode(s);
        if (m)
          n.unit = m, n.origString = s;
        else
          try {
            let c = this.uStrParser_.parseString(s, t, i);
            n.unit = c[0], n.origString = c[1], c[2] && (n.retMsg = c[2]), n.suggestions = c[3];
          } catch (c) {
            console.log(`Unit requested for unit string ${s}.request unsuccessful; error thrown = ` + c.message), n.retMsg.unshift(`${s} is not a valid unit.  ${c.message}`);
          }
      }
      return n.unit ? n.status = n.origString === s ? "valid" : "invalid" : n.status = n.origString ? "invalid" : "error", n;
    }
    // end getSpecifiedUnit
    /**
     * This method retrieves a list of units commensurable, i.e., that can be
     * converted from and to, a specified unit.  Returns an error if the "from"
     * unit cannot be found.
     *
     * @param fromName the name/unit string of the "from" unit
     * @returns an array containing two elements;
     *   first element is the list of commensurable units if any were found
     *   second element is an error message if the "from" unit is not found
     */
    commensurablesList(s) {
      let t = [], i = null, n = this.getSpecifiedUnit(s, "validate", !1), o = n.unit;
      if (n.retMsg.length > 0 && (t = n.retMsg), !o)
        t.push(`Could not find unit ${s}.`);
      else {
        let m = null, c = o.getProperty("dim_");
        if (!c)
          t.push("No commensurable units were found for " + s);
        else {
          try {
            m = c.getProperty("dimVec_");
          } catch (d) {
            t.push(d.message), d.message === "Dimension does not have requested property(dimVec_)" && (m = null);
          }
          m && (i = r.getInstance().getUnitsByDimension(m));
        }
      }
      return [i, t];
    }
    // end commensurablesList
  }
  return we.UcumLhcUtils = a, a.getInstance = function() {
    return new a();
  }, we;
}
var l0;
function On() {
  if (l0) return _e;
  l0 = 1, Object.defineProperty(_e, "__esModule", {
    value: !0
  }), _e.UnitTables = _e.UcumLhcUtils = _e.Ucum = void 0;
  var f = Ie().Ucum;
  _e.Ucum = f;
  var C = js().UcumLhcUtils;
  _e.UcumLhcUtils = C;
  var y = Ae().UnitTables;
  return _e.UnitTables = y, _e;
}
var Yt, s0;
function An() {
  if (s0) return Yt;
  s0 = 1;
  let f = {};
  function C(r) {
    const e = "" + +r, a = /(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(e);
    if (!a)
      return 0;
    const u = a[2], s = a[3];
    return Math.max(
      0,
      // lower limit.
      (u === "0" ? 0 : (u || "").length) - (s || 0)
    );
  }
  function y(r, e) {
    const a = Math.pow(10, e);
    return Math.round(r * a) / a;
  }
  const p = 1e-8, l = f.roundToMaxPrecision = function(r) {
    return Math.round(r / p) * p;
  };
  return f.isEquivalent = function(r, e) {
    if (Number.isInteger(r) && Number.isInteger(e))
      return r === e;
    const a = Math.min(C(r), C(e));
    return a === 0 ? Math.round(r) === Math.round(e) : y(r, a) === y(e, a);
  }, f.isEqual = function(r, e) {
    return l(r) === l(e);
  }, Yt = f, Yt;
}
var Zt, i0;
function Ws() {
  if (i0) return Zt;
  i0 = 1;
  var f = Qe();
  function C(y) {
    var p = f(y), l = p.getFullYear(), r = p.getMonth(), e = /* @__PURE__ */ new Date(0);
    return e.setFullYear(l, r + 1, 0), e.setHours(0, 0, 0, 0), e.getDate();
  }
  return Zt = C, Zt;
}
var Qt, r0;
function Z0() {
  if (r0) return Qt;
  r0 = 1;
  var f = Qe(), C = Ws();
  function y(p, l) {
    var r = f(p), e = Number(l), a = r.getMonth() + e, u = /* @__PURE__ */ new Date(0);
    u.setFullYear(r.getFullYear(), a, 1), u.setHours(0, 0, 0, 0);
    var s = C(u);
    return r.setMonth(a, Math.min(s, r.getDate())), r;
  }
  return Qt = y, Qt;
}
var Xt, u0;
function Js() {
  if (u0) return Xt;
  u0 = 1;
  var f = Z0();
  function C(y, p) {
    var l = Number(p);
    return f(y, l * 12);
  }
  return Xt = C, Xt;
}
var en, a0;
function Q0() {
  if (a0) return en;
  a0 = 1;
  var f = Qe();
  function C(y, p) {
    var l = f(y), r = Number(p);
    return l.setDate(l.getDate() + r), l;
  }
  return en = C, en;
}
var tn, o0;
function Ys() {
  if (o0) return tn;
  o0 = 1;
  var f = Q0();
  function C(y, p) {
    var l = Number(p), r = l * 7;
    return f(y, r);
  }
  return tn = C, tn;
}
var nn, c0;
function Zs() {
  if (c0) return nn;
  c0 = 1;
  var f = Xe(), C = 36e5;
  function y(p, l) {
    var r = Number(l);
    return f(p, r * C);
  }
  return nn = y, nn;
}
var ln, f0;
function Qs() {
  if (f0) return ln;
  f0 = 1;
  var f = Xe();
  function C(y, p) {
    var l = Number(p);
    return f(y, l * 1e3);
  }
  return ln = C, ln;
}
var sn, m0;
function ye() {
  if (m0) return sn;
  m0 = 1;
  const f = Vl(), C = On().UcumLhcUtils.getInstance(), y = An(), p = "http://unitsofmeasure.org";
  let l = "[0-9][0-9](\\:[0-9][0-9](\\:[0-9][0-9](\\.[0-9]+)?)?)?(Z|(\\+|-)[0-9][0-9]\\:[0-9][0-9])?", r = new RegExp("^T?" + l + "$"), e = new RegExp(
    "^[0-9][0-9][0-9][0-9](-[0-9][0-9](-[0-9][0-9](T" + l + ")?)?)?Z?$"
  ), a = new RegExp(
    "^[0-9][0-9][0-9][0-9](-[0-9][0-9](-[0-9][0-9])?)?$"
  ), u = new RegExp(
    "^[0-9][0-9][0-9][0-9](-[0-9][0-9](-[0-9][0-9](T[0-9][0-9](\\:[0-9][0-9](\\:[0-9][0-9](\\.[0-9]+)?))(Z|(\\+|-)[0-9][0-9]\\:[0-9][0-9]))))$"
  );
  class s {
    /**
     *  Tests whether this object is equal to another.  Returns either true,
     *  false, or undefined (where in the FHIRPath specification empty would be
     *  returned).  The undefined return value indicates that the values were the
     *  same to the shared precision, but that they had differnent levels of
     *  precision.
     */
    equals() {
      return !1;
    }
    /**
     *  Tests whether this object is equivalant to another.  Returns either true,
     *  false, or undefined (where in the FHIRPath specification empty would be
     *  returned).
     */
    equivalentTo() {
      return !1;
    }
    toString() {
      return this.asStr ? this.asStr : super.toString();
    }
    toJSON() {
      return this.toString();
    }
    /**
     *  Returns -1, 0, or 1 if this object is less then, equal to, or greater
     *  than otherObj.
     */
    compare() {
      throw "Comparison not implemented for " + this.constructor.name;
    }
    /**
     *  Adds other value to this value.
     */
    plus() {
      throw "Addition not implemented for " + this.constructor.name;
    }
    /**
     * Multiplies this value by another value.
     */
    mul() {
      throw "Multiplication not implemented for " + this.constructor.name;
    }
    /**
     * Divides this value by another value.
     */
    div() {
      throw "Division not implemented for " + this.constructor.name;
    }
  }
  class t extends s {
    constructor(v, U) {
      super(), this.asStr = v + " " + U, this.value = v, this.unit = U;
    }
    equals(v) {
      if (!(v instanceof this.constructor))
        return !1;
      const U = t._calendarDuration2Seconds[this.unit], I = t._calendarDuration2Seconds[v.unit];
      if (!U != !I && (U > 1 || I > 1))
        return null;
      if (this.unit === v.unit)
        return y.isEqual(this.value, v.value);
      const S = this._compareYearsAndMonths(v);
      if (S)
        return S.isEqual;
      const b = t.toUcumQuantity(this.value, this.unit), E = t.toUcumQuantity(v.value, v.unit), N = C.convertUnitTo(E.unit, E.value, b.unit);
      return N.status !== "succeeded" ? !1 : y.isEqual(b.value, N.toVal);
    }
    equivalentTo(v) {
      if (!(v instanceof this.constructor))
        return !1;
      if (this.unit === v.unit)
        return y.isEquivalent(this.value, v.value);
      const U = t.getEquivalentUcumUnitCode(this.unit), I = t.getEquivalentUcumUnitCode(v.unit), S = C.convertUnitTo(I, v.value, U);
      return S.status !== "succeeded" ? !1 : y.isEquivalent(this.value, S.toVal);
    }
    /**
     *  Returns a number less than 0, equal to 0 or greater than 0
     *  if this quantity is less than, equal to, or greater than otherQuantity.
     *  If the quantities could not be compared, returns null, which will be
     *  converted to an empty collection in the "doInvoke" function
     *  See https://hl7.org/fhirpath/#comparison
     *  @param {FP_Quantity} otherQuantity
     *  @return {number|null}
     */
    compare(v) {
      if (this.unit === v.unit)
        return this.value - v.value;
      const U = t._calendarDuration2Seconds[this.unit], I = t._calendarDuration2Seconds[v.unit];
      if (!U != !I && (U > 1 || I > 1))
        return null;
      const S = t.getEquivalentUcumUnitCode(this.unit), b = t.getEquivalentUcumUnitCode(v.unit), E = C.convertUnitTo(b, v.value, S);
      return E.status !== "succeeded" ? null : this.value - E.toVal;
    }
    /**
     *  Adds a quantity to this quantity.
     * @param {FP_Quantity} otherQuantity a quantity to be added to this quantity.
     * @return {FP_Quantity|null}
     */
    plus(v) {
      const U = t._yearMonthConversionFactor[this.unit], I = t._yearMonthConversionFactor[v.unit];
      if (U && I)
        return new t(this.value + v.value * I / U, this.unit);
      const S = t._calendarDuration2Seconds[this.unit], b = t._calendarDuration2Seconds[v.unit];
      if (!S != !b && (S > 1 || b > 1))
        return null;
      const E = S ? "s" : this.unit.replace(i, ""), N = (S || 1) * this.value, F = b ? "s" : v.unit.replace(i, ""), j = (b || 1) * v.value, $ = C.convertUnitTo(F, j, E);
      return $.status !== "succeeded" || $.fromUnit.isSpecial_ || $.toUnit.isSpecial_ ? null : new t(N + $.toVal, E);
    }
    /**
     * Multiplies this quantity to another quantity.
     * @param {FP_Quantity} otherQuantity a quantity by which to multiply this quantity.
     * @return {FP_Quantity}
     */
    mul(v) {
      const U = t._calendarDuration2Seconds[this.unit], I = t._calendarDuration2Seconds[v.unit];
      if (U > 1 && v.unit !== "'1'" || I > 1 && this.unit !== "'1'")
        return null;
      const S = this.convToUcumUnits(this, U);
      if (!S)
        return null;
      const b = this.convToUcumUnits(v, I);
      return b ? this.unit === "'1'" ? new t(this.value * v.value, v.unit) : v.unit === "'1'" ? new t(this.value * v.value, this.unit) : new t(
        S.value * b.value,
        `'(${S.unit}).(${b.unit})'`
      ) : null;
    }
    /**
     * Divides this quantity by another quantity.
     * @param {FP_Quantity} otherQuantity a quantity by which to divide this quantity.
     * @return {FP_Quantity}
     */
    div(v) {
      if (v.value === 0)
        return null;
      const U = t._calendarDuration2Seconds[this.unit], I = t._calendarDuration2Seconds[v.unit];
      if (U)
        if (I) {
          const F = t._yearMonthConversionFactor[this.unit], j = t._yearMonthConversionFactor[v.unit];
          if (F && j)
            return new t(this.value * F / (v.value * j), "'1'");
        } else {
          if (v.unit === "'1'")
            return new t(this.value / v.value, this.unit);
          if (U > 1)
            return null;
        }
      else if (I > 1)
        return null;
      const S = this.convToUcumUnits(this, U);
      if (!S)
        return null;
      const b = this.convToUcumUnits(v, I);
      if (!b)
        return null;
      const E = b.unit === "1" ? S.unit : `(${S.unit})/(${b.unit})`, N = C.convertToBaseUnits(E, S.value / b.value);
      return N.status !== "succeeded" ? null : new t(
        N.magnitude,
        `'${Object.keys(N.unitToExp).map((F) => F + N.unitToExp[F]).join(".") || "1"}'`
      );
    }
    /**
     * Converts a quantity to UCUM unit if possible, otherwise returns null.
     * @param {FP_Quantity} quantity - source quantity.
     * @param {number|undefined} unitInSeconds - if the source quantity is a
     *  calendar duration then the value of the quantity unit in seconds,
     *  otherwise undefined.
     * @return {{unit: string, value: number} | null}
     */
    convToUcumUnits(v, U) {
      if (U)
        return {
          value: U * v.value,
          unit: "s"
        };
      {
        const I = v.unit.replace(i, ""), S = C.convertToBaseUnits(I, v.value);
        return S.status !== "succeeded" || S.fromUnitIsSpecial ? null : {
          value: S.magnitude,
          unit: Object.keys(S.unitToExp).map((b) => b + S.unitToExp[b]).join(".") || "1"
        };
      }
    }
    /**
     * If both quantities have one of these units: year or month,
     * then a special case will apply; otherwise returns null.
     * In the special case of comparison, the fact that 1 year = 12 months is used.
     *
     * Just note: in general, for a calendar duration:
     * 1 year = 365 days
     * 12 month = 12*30 days = 360 days
     * so, 1 year != 12 month
     * That's why this special case is needed
     *
     * @param {FP_Quantity} otherQuantity
     * @return {null|{isEqual: boolean}}
     * @private
     */
    _compareYearsAndMonths(v) {
      const U = t._yearMonthConversionFactor[this.unit], I = t._yearMonthConversionFactor[v.unit];
      return U && I ? {
        isEqual: y.isEqual(this.value * U, v.value * I)
      } : null;
    }
  }
  const i = /^'|'$/g;
  t.getEquivalentUcumUnitCode = function(w) {
    return t.mapTimeUnitsToUCUMCode[w] || w.replace(i, "");
  }, t.toUcumQuantity = function(w, v) {
    const U = t._calendarDuration2Seconds[v];
    return U ? {
      value: U * w,
      unit: "s"
    } : {
      value: w,
      unit: v.replace(i, "")
    };
  }, t.convUnitTo = function(w, v, U) {
    const I = t._yearMonthConversionFactor[w], S = t._yearMonthConversionFactor[U];
    if (I && S)
      return new t(I * v / S, U);
    const b = t._calendarDuration2Seconds[w], E = t._calendarDuration2Seconds[U];
    if (E) {
      if (b)
        return new t(b * v / E, U);
      {
        const N = C.convertUnitTo(w.replace(/^'|'$/g, ""), v, "s");
        if (N.status === "succeeded")
          return new t(N.toVal / E, U);
      }
    } else {
      const N = b ? C.convertUnitTo("s", b * v, U.replace(/^'|'$/g, "")) : C.convertUnitTo(w.replace(/^'|'$/g, ""), v, U.replace(/^'|'$/g, ""));
      if (N.status === "succeeded")
        return new t(N.toVal, U);
    }
    return null;
  }, t._calendarDuration2Seconds = {
    years: 365 * 24 * 60 * 60,
    months: 30 * 24 * 60 * 60,
    weeks: 7 * 24 * 60 * 60,
    days: 24 * 60 * 60,
    hours: 60 * 60,
    minutes: 60,
    seconds: 1,
    milliseconds: 1e-3,
    year: 365 * 24 * 60 * 60,
    month: 30 * 24 * 60 * 60,
    week: 7 * 24 * 60 * 60,
    day: 24 * 60 * 60,
    hour: 60 * 60,
    minute: 60,
    second: 1,
    millisecond: 1e-3
  }, t._yearMonthConversionFactor = {
    years: 12,
    months: 1,
    year: 12,
    month: 1
  }, t.dateTimeArithmeticDurationUnits = {
    years: "year",
    months: "month",
    weeks: "week",
    days: "day",
    hours: "hour",
    minutes: "minute",
    seconds: "second",
    milliseconds: "millisecond",
    year: "year",
    month: "month",
    week: "week",
    day: "day",
    hour: "hour",
    minute: "minute",
    second: "second",
    millisecond: "millisecond",
    "'s'": "second",
    "'ms'": "millisecond"
  }, t.mapUCUMCodeToTimeUnits = {
    a: "year",
    mo: "month",
    wk: "week",
    d: "day",
    h: "hour",
    min: "minute",
    s: "second",
    ms: "millisecond"
  }, t.mapTimeUnitsToUCUMCode = Object.keys(t.mapUCUMCodeToTimeUnits).reduce(function(w, v) {
    return w[t.mapUCUMCodeToTimeUnits[v]] = v, w[t.mapUCUMCodeToTimeUnits[v] + "s"] = v, w;
  }, {});
  class n extends s {
    constructor(v) {
      super(), this.asStr = v;
    }
    /**
     *  Adds a time-based quantity to this date/time.
     * @param timeQuantity a quantity to be added to this date/time.  See the
     *  FHIRPath specification for supported units.
     */
    plus(v) {
      const U = v.unit;
      let I = t.dateTimeArithmeticDurationUnits[U];
      if (!I)
        throw new Error("For date/time arithmetic, the unit of the quantity must be one of the following time-based units: " + Object.keys(t.dateTimeArithmeticDurationUnits));
      const S = this.constructor, b = S._timeUnitToDatePrecision[I];
      if (b === void 0)
        throw new Error("Unsupported unit for +.  The unit should be one of " + Object.keys(S._timeUnitToDatePrecision).join(", ") + ".");
      let E = v.value;
      const N = S === m;
      if ((N ? b < 2 : b < 5) && (E = Math.trunc(E)), this._getPrecision() < b) {
        const Q = S._datePrecisionToTimeUnit[this._getPrecision()];
        if (Q !== "second") {
          const X = t.convUnitTo(I, E, Q);
          I = X.unit, E = Math.trunc(X.value);
        }
      }
      const F = n.timeUnitToAddFn[I](this._getDateObj(), E);
      let j = this._getPrecision();
      N && (j += 3);
      let $ = o.isoDateTime(F, j);
      return N && ($ = $.slice($.indexOf("T") + 1)), new S($);
    }
    /**
     *  Tests whether this object is equal to another.  Returns either true,
     *  false, or undefined (where in the FHIRPath specification empty would be
     *  returned).  The undefined return value indicates that the values were the
     *  same to the shared precision, but that they had differnent levels of
     *  precision.
     * @param otherDateTime any sub-type of FP_TimeBase, but it should be the same
     *  as the type of "this".
     */
    equals(v) {
      var U;
      if (!(v instanceof this.constructor) && !(this instanceof v.constructor))
        U = !1;
      else {
        var I = this._getPrecision(), S = v._getPrecision();
        if (I == S)
          U = this._getDateObj().getTime() == v._getDateObj().getTime();
        else {
          var b = I <= S ? I : S, E = this._getDateObj().toISOString(), N = v._getDateObj().toISOString();
          this.constructor === m && (b += 3, I += 3, S += 3);
          for (var F = I > 2 ? new o(E)._getTimeParts() : this._getTimeParts(), j = S > 2 ? new o(N)._getTimeParts() : v._getTimeParts(), $ = 0; $ <= b && U !== !1; ++$)
            U = F[$] == j[$];
          U && (U = void 0);
        }
      }
      return U;
    }
    /**
     *  Tests whether this object is equivalant to another.  Returns either true
     *  or false.
     */
    equivalentTo(v) {
      var U = v instanceof this.constructor;
      if (U) {
        var I = this._getPrecision(), S = v._getPrecision();
        U = I == S, U && (U = this._getDateObj().getTime() == v._getDateObj().getTime());
      }
      return U;
    }
    /**
     *  Returns a number less than 0, equal to 0 or greater than 0
     *  if this (date) time is less than, equal to, or greater than otherTime.
     *  Comparisons are made at the lesser of the two time precisions.
     *  @param {FP_TimeBase} otherTime
     *  @return {number}
     */
    compare(v) {
      var U = this._getPrecision(), I = v._getPrecision(), S = U <= I ? this._getDateObj().getTime() : this._dateAtPrecision(I).getTime(), b = I <= U ? v._getDateObj().getTime() : v._dateAtPrecision(U).getTime();
      return U !== I && S === b ? null : S - b;
    }
    /**
     *  Returns a number representing the precision of the time string given to
     *  the constructor.  (Higher means more precise).  The number is the number
     *  of components of the time string (ignoring the time zone) produced by
     *  matching against the time regular expression, except that milliseconds
     *  and seconds are counted together as a single of level of precision.
     *  @return {number}
     */
    _getPrecision() {
      return this.precision === void 0 && this._getMatchData(), this.precision;
    }
    /**
     *  Returns the match data from matching the given RegExp against the
     *  date/time string given to the constructor.
     *  Also sets this.precision.
     * @param regEx The regular expression to match against the date/time string.
     * @param maxPrecision the maximum precision possible for the type
     */
    _getMatchData(v, U) {
      if (this.timeMatchData === void 0 && (this.timeMatchData = this.asStr.match(v), this.timeMatchData))
        for (let I = U; I >= 0 && this.precision === void 0; --I)
          this.timeMatchData[I] && (this.precision = I);
      return this.timeMatchData;
    }
    /**
     *  Returns an array of the pieces of the given time string, for use in
     *  constructing lower precision versions of the time. The returned array will
     *  contain separate elements for the hour, minutes, seconds, and milliseconds
     *  (or as many of those are as present).  The length of the returned array
     *  will therefore be an indication of the precision.
     *  It will not include the timezone.
     * @timeMatchData the result of matching the time portion of the string passed
     *  into the constructor against the "timeRE" regular expression.
     */
    _getTimeParts(v) {
      var U = [];
      U = [v[0]];
      var I = v[4];
      if (I) {
        let N = U[0];
        U[0] = N.slice(0, N.length - I.length);
      }
      var S = v[1];
      if (S) {
        let N = U[0];
        U[0] = N.slice(0, N.length - S.length), U[1] = S;
        var b = v[2];
        if (b) {
          U[1] = S.slice(0, S.length - b.length), U[2] = b;
          var E = v[3];
          E && (U[2] = b.slice(0, b.length - E.length), U[3] = E);
        }
      }
      return U;
    }
    /**
     *  Returns a date object representing this time on a certain date.
     */
    _getDateObj() {
      if (!this.dateObj) {
        var v = this._getPrecision();
        this.dateObj = this._dateAtPrecision(v);
      }
      return this.dateObj;
    }
    /**
     *  Creates a date object for the given timezone.  The returned date object
     *  will have the specified date and time in the specified timezone.
     * @param year...ms Just as in the Date constructor.
     * @param timezoneOffset (optional) a string in the format (+-)HH:mm or Z, representing the
     *  timezone offset.  If not provided, the local timzone will be assumed (as the
     *  Date constructor does).
     */
    _createDate(v, U, I, S, b, E, N, F) {
      var j = new Date(v, U, I, S, b, E, N);
      if (F) {
        var $ = j.getTimezoneOffset(), Q = 0;
        if (F != "Z") {
          var X = F.split(":"), ee = parseInt(X[0]);
          Q = parseInt(X[1]), ee < 0 && (Q = -Q), Q += 60 * ee;
        }
        j = f(j, -$ - Q);
      }
      return j;
    }
  }
  n.timeUnitToAddFn = {
    year: Js(),
    month: Z0(),
    week: Ys(),
    day: Q0(),
    hour: Zs(),
    minute: Vl(),
    second: Qs(),
    millisecond: Xe()
  };
  class o extends n {
    /**
     *  Constructs an FP_DateTime, assuming dateStr is valid.  If you don't know
     *  whether a string is a valid DateTime, use FP_DateTime.checkString instead.
     */
    constructor(v) {
      super(v);
    }
    /**
     *  Returns -1, 0, or 1 if this date time is less then, equal to, or greater
     *  than otherDateTime.  Comparisons are made at the lesser of the two date time
     *  precisions.
     */
    compare(v) {
      if (!(v instanceof o))
        throw "Invalid comparison of a DateTime with something else";
      return super.compare(v);
    }
    /**
     *  Returns the match data from matching dateTimeRE against the datetime string.
     *  Also sets this.precision.
     */
    _getMatchData() {
      return super._getMatchData(e, 5);
    }
    /**
     *  Returns an array of the pieces of the date time string passed into the
     *  constructor, for use in constructing lower precision versions of the
     *  date time. The returned array will contain separate elements for the year,
     *  month, day, hour, minutes, seconds, and milliseconds (or as many of those
     *  are as present).  The length of the returned array will therefore be an
     *  indication of the precision.  It will not include the timezone.
     */
    _getTimeParts() {
      if (!this.timeParts) {
        let U = this._getMatchData(), I = U[0];
        this.timeParts = [I];
        var v = U[1];
        if (v) {
          this.timeParts[0] = I.slice(0, I.length - v.length), this.timeParts[1] = v;
          let S = U[2];
          if (S) {
            this.timeParts[1] = v.slice(0, v.length - S.length), this.timeParts[2] = S;
            let b = U[3];
            b && (this.timeParts[2] = S.slice(0, S.length - b.length), b[0] === "T" && (U[3] = b.slice(1)), this.timeParts = this.timeParts.concat(
              super._getTimeParts(U.slice(3))
            ));
          }
        }
      }
      return this.timeParts;
    }
    /**
     *  Returns a new Date object for a time equal to what this time would be if
     *  the string passed into the constructor had the given precision.
     * @param precision the new precision, which is assumed to be less than
     *  or equal to the current precision.
     */
    _dateAtPrecision(v) {
      var U = this._getTimeParts(), I = this._getMatchData()[7], S = this._getPrecision(), b = parseInt(U[0]), E = S > 0 ? parseInt(U[1].slice(1)) - 1 : 0, N = S > 1 ? parseInt(U[2].slice(1)) : 1, F = S > 2 ? parseInt(U[3]) : 0, j = S > 3 ? parseInt(U[4].slice(1)) : 0, $ = S > 4 ? parseInt(U[5].slice(1)) : 0, Q = U.length > 6 ? parseInt(U[6].slice(1)) : 0, X = this._createDate(
        b,
        E,
        N,
        F,
        j,
        $,
        Q,
        I
      );
      return v < S && (b = X.getFullYear(), E = v > 0 ? X.getMonth() : 0, N = v > 1 ? X.getDate() : 1, F = v > 2 ? X.getHours() : 0, j = v > 3 ? X.getMinutes() : 0, X = new Date(b, E, N, F, j)), X;
    }
  }
  o.checkString = function(w) {
    let v = new o(w);
    return v._getMatchData() || (v = null), v;
  }, o._timeUnitToDatePrecision = {
    year: 0,
    month: 1,
    week: 2,
    // wk is just 7*d
    day: 2,
    hour: 3,
    minute: 4,
    second: 5,
    millisecond: 6
  }, o._datePrecisionToTimeUnit = [
    "year",
    "month",
    "day",
    "hour",
    "minute",
    "second",
    "millisecond"
  ];
  class m extends n {
    /**
     *  Constructs an FP_Time, assuming dateStr is valid.  If you don't know
     *  whether a string is a valid DateTime, use FP_Time.checkString instead.
     */
    constructor(v) {
      v[0] == "T" && (v = v.slice(1)), super(v);
    }
    /**
     *  Returns -1, 0, or 1 if this time is less then, equal to, or greater
     *  than otherTime.  Comparisons are made at the lesser of the two time
     *  precisions.
     */
    compare(v) {
      if (!(v instanceof m))
        throw "Invalid comparison of a time with something else";
      return super.compare(v);
    }
    /**
     *  Returns a new Date object for a time equal to what this time would be if
     *  the string passed into the constructor had the given precision.
     *  The "date" portion of the returned Date object is not meaningful, and
     *  should be ignored.
     * @param precision the new precision, which is assumed to be less than the
     *  or equal to the current precision.  A precision of 0 means the hour.
     */
    _dateAtPrecision(v) {
      var U = this._getTimeParts(), I = this._getMatchData()[4], S = this._getPrecision(), b = 2010, E = 0, N = 1, F = parseInt(U[0]), j = S > 0 ? parseInt(U[1].slice(1)) : 0, $ = S > 1 ? parseInt(U[2].slice(1)) : 0, Q = U.length > 3 ? parseInt(U[3].slice(1)) : 0, X = this._createDate(
        b,
        E,
        N,
        F,
        j,
        $,
        Q,
        I
      );
      return I && (X.setYear(b), X.setMonth(E), X.setDate(N)), v < S && (F = X.getHours(), j = v > 0 ? X.getMinutes() : 0, X = new Date(b, E, N, F, j)), X;
    }
    /**
     *  Returns the match data from matching timeRE against the time string.
     *  Also sets this.precision.
     */
    _getMatchData() {
      return super._getMatchData(r, 2);
    }
    /**
     *  Returns an array of the pieces of the time string passed into the
     *  constructor, for use in constructing lower precision versions of the
     *  time. The returned array will contain separate elements for the hour,
     *  minutes, seconds, and milliseconds (or as many of those are as present).
     *  The length of the returned array will therefore be an indication of the
     *  precision.  It will not include the timezone.
     */
    _getTimeParts() {
      return this.timeParts || (this.timeParts = super._getTimeParts(this._getMatchData())), this.timeParts;
    }
  }
  m.checkString = function(w) {
    let v = new m(w);
    return v._getMatchData() || (v = null), v;
  }, m._timeUnitToDatePrecision = {
    hour: 0,
    minute: 1,
    second: 2,
    millisecond: 3
  }, m._datePrecisionToTimeUnit = ["hour", "minute", "second", "millisecond"];
  function c(w, v) {
    var U = w;
    return v === 3 && w < 100 && (U = "0" + w), w < 10 && (U = "0" + U), U;
  }
  o.isoDateTime = function(w, v) {
    v === void 0 && (v = 5);
    var U = "" + w.getFullYear();
    if (v > 0 && (U += "-" + c(w.getMonth() + 1), v > 1 && (U += "-" + c(w.getDate()), v > 2 && (U += "T" + o.isoTime(w, v - 3)))), v > 2) {
      var I = w.getTimezoneOffset(), S = I < 0 ? "+" : "-";
      I = Math.abs(I);
      var b = I % 60, E = (I - b) / 60;
      U += S + c(E) + ":" + c(b);
    }
    return U;
  }, o.isoTime = function(w, v) {
    v === void 0 && (v = 2);
    let U = "" + c(w.getHours());
    return v > 0 && (U += ":" + c(w.getMinutes()), v > 1 && (U += ":" + c(w.getSeconds()), w.getMilliseconds() && (U += "." + c(w.getMilliseconds(), 3)))), U;
  };
  class d extends o {
    /**
     * Constructs an FP_Date, assuming dateStr is valid.  If you don't know
     * whether a string is a valid Date, use FP_Date.checkString instead.
     */
    constructor(v) {
      super(v);
    }
    /**
     * Returns the match data from matching dateRE against the date string.
     * Also sets this.precision.
     */
    _getMatchData() {
      return n.prototype._getMatchData.apply(this, [a, 2]);
    }
  }
  d.checkString = function(w) {
    let v = new d(w);
    return v._getMatchData() || (v = null), v;
  }, d.isoDate = function(w, v) {
    return (v === void 0 || v > 2) && (v = 2), o.isoDateTime(w, v);
  };
  class h extends o {
    /**
     * Constructs an FP_Instant, assuming instantStr is valid.  If you don't know
     * whether a string is a valid "instant", use FP_Instant.checkString instead.
     */
    constructor(v) {
      super(v);
    }
    /**
     * Returns the match data from matching instantRE against the "instant" string.
     * Also sets this.precision.
     */
    _getMatchData() {
      return n.prototype._getMatchData.apply(this, [u, 5]);
    }
  }
  h.checkString = function(w) {
    let v = new h(w);
    return v._getMatchData() || (v = null), v;
  };
  class _ {
    /**
     *  Constructs a instance for the given node ("data") of a resource.  If the
     *  data is the top-level node of a resouce, the path and type parameters will
     *  be ignored in favor of the resource's resourceType field.
     * @param {*} data - the node's data or value (which might be an object with
     *  sub-nodes, an array, or FHIR data type)
     * @param {ResourceNode} parentResNode - parent ResourceNode.
     * @param {string} path - the node's path in the resource (e.g. Patient.name).
     *  If the data's type can be determined from data, that will take precedence
     *  over this parameter.
     * @param {*} _data - additional data stored in a property named with "_"
     *  prepended, see https://www.hl7.org/fhir/element.html#json for details.
     * @param {string} fhirNodeDataType - FHIR node data type, if the resource node
     *  is described in the FHIR model.
     */
    constructor(v, U, I, S, b) {
      v != null && v.resourceType && (I = v.resourceType, b = v.resourceType), this.parentResNode = U || null, this.path = I || null, this.data = v, this._data = S || {}, this.fhirNodeDataType = b || null;
    }
    /**
     * Returns resource node type info.
     * @return {TypeInfo}
     */
    getTypeInfo() {
      if (!this.typeInfo) {
        let v;
        M.model && (/^System\.(.*)$/.test(this.fhirNodeDataType) ? v = new M({ namespace: M.System, name: RegExp.$1 }) : this.fhirNodeDataType && (v = new M({
          namespace: M.FHIR,
          name: this.fhirNodeDataType
        }))), this.typeInfo = v || M.createByValueInSystemNamespace(this.data);
      }
      return this.typeInfo;
    }
    toJSON() {
      return JSON.stringify(this.data);
    }
    /**
     * Converts a resource node value to an instance of the FHIRPath system type
     * (FP_Quantity, FP_Date, FP_DateTime, or FP_Time) for use in evaluating
     * a FHIRPath expression if the node path matches the specified type in the
     * model and when conversion is possible, otherwise returns the data as is.
     * Throws an exception if the data is a Quantity that has a comparator.
     * The Mapping from FHIR Quantity to FHIRPath System.Quantity is explained here:
     * https://www.hl7.org/fhir/fhirpath.html#quantity
     * this.data is not changed, but converted value is returned.
     * @return {FP_Type|any}
     */
    convertData() {
      if (!this.convertedData) {
        var v = this.data;
        if (v != null) {
          const U = M.typeToClassWithCheckString[this.path];
          if (U)
            v = U.checkString(v) || v;
          else if (M.isType(this.path, "Quantity") && (v == null ? void 0 : v.system) === p && typeof v.value == "number" && typeof v.code == "string") {
            if (v.comparator !== void 0)
              throw new Error("Cannot convert a FHIR.Quantity that has a comparator");
            v = new t(
              v.value,
              t.mapUCUMCodeToTimeUnits[v.code] || "'" + v.code + "'"
            );
          }
        }
        this.convertedData = v;
      }
      return this.convertedData;
    }
  }
  _.makeResNode = function(w, v, U, I, S = null) {
    return w instanceof _ ? w : new _(w, v, U, I, S);
  };
  const T = /* @__PURE__ */ new Set();
  ["Boolean", "String", "Integer", "Decimal", "Date", "DateTime", "Time", "Quantity"].forEach((w) => T.add(w));
  const Y = class Y {
    constructor({ name: v, namespace: U }) {
      this.name = v, this.namespace = U;
    }
    /**
     * Checks for equality with another TypeInfo object, or that another TypeInfo
     * object specifies a superclass for the type specified by this object.
     * @param {TypeInfo} other
     * @return {boolean}
     */
    is(v) {
      return v instanceof Y && (!this.namespace || !v.namespace || this.namespace === v.namespace) ? Y.model && (!this.namespace || this.namespace === Y.FHIR) ? Y.isType(this.name, v.name) : this.name === v.name : !1;
    }
    /**
     * Returns the string representation of type info.
     * @returns {string}
     */
    toString() {
      return (this.namespace ? this.namespace + "." : "") + this.name;
    }
    /**
     * Returns true if type info represents a valid type identifier, false otherwise.
     * @returns {boolean}
     */
    isValid() {
      var U, I;
      let v = !1;
      return this.namespace === "System" ? v = T.has(this.name) : this.namespace === "FHIR" ? v = (U = Y.model) == null ? void 0 : U.availableTypes.has(this.name) : this.namespace || (v = T.has(this.name) || ((I = Y.model) == null ? void 0 : I.availableTypes.has(this.name))), v;
    }
  };
  // The "model" data object specific to a domain, e.g. R4.
  se(Y, "model", null);
  let M = Y;
  M.typeToClassWithCheckString = {
    date: d,
    dateTime: o,
    instant: h,
    time: m
  }, M.isType = function(w, v) {
    var U;
    do
      if (w === v)
        return !0;
    while (w = (U = M.model) == null ? void 0 : U.type2Parent[w]);
    return !1;
  }, M.System = "System", M.FHIR = "FHIR", M.createByValueInSystemNamespace = function(w) {
    let v = typeof w;
    return Number.isInteger(w) ? v = "integer" : v === "number" ? v = "decimal" : w instanceof d ? v = "date" : w instanceof o ? v = "dateTime" : w instanceof m ? v = "time" : w instanceof t && (v = "Quantity"), v = v.replace(/^\w/, (U) => U.toUpperCase()), new M({ namespace: M.System, name: v });
  }, M.fromValue = function(w) {
    return w instanceof _ ? w.getTypeInfo() : M.createByValueInSystemNamespace(w);
  };
  const P = /* @__PURE__ */ new Set();
  [
    "instant",
    "time",
    "date",
    "dateTime",
    "base64Binary",
    "decimal",
    "integer64",
    "boolean",
    "string",
    "code",
    "markdown",
    "id",
    "integer",
    "unsignedInt",
    "positiveInt",
    "uri",
    "oid",
    "uuid",
    "canonical",
    "url",
    "Integer",
    "Decimal",
    "String",
    "Date",
    "DateTime",
    "Time"
  ].forEach((w) => P.add(w)), M.isPrimitive = function(w) {
    return P.has(w.name);
  };
  function q(w) {
    return w.map((v) => M.fromValue(v));
  }
  function z(w, v) {
    if (w.length === 0)
      return [];
    if (w.length > 1)
      throw new Error("Expected singleton on left side of 'is', got " + JSON.stringify(w));
    return M.fromValue(w[0]).is(v);
  }
  function W(w, v) {
    if (w.length === 0)
      return [];
    if (w.length > 1)
      throw new Error("Expected singleton on left side of 'as', got " + JSON.stringify(w));
    return M.fromValue(w[0]).is(v) ? w : [];
  }
  return sn = {
    FP_Type: s,
    FP_TimeBase: n,
    FP_Date: d,
    FP_DateTime: o,
    FP_Instant: h,
    FP_Time: m,
    FP_Quantity: t,
    timeRE: r,
    dateTimeRE: e,
    dateRE: a,
    instantRE: u,
    ResourceNode: _,
    TypeInfo: M,
    typeFn: q,
    isFn: z,
    asFn: W
  }, sn;
}
var rn, h0;
function he() {
  if (h0) return rn;
  h0 = 1;
  const f = {}, C = ye(), { ResourceNode: y } = C;
  f.raiseError = function(l, r) {
    throw r = r ? r + ": " : "", r + l;
  }, f.assertOnlyOne = function(l, r) {
    l.length !== 1 && f.raiseError("Was expecting only one element but got " + JSON.stringify(l), r);
  }, f.assertType = function(l, r, e) {
    let a = this.valData(l);
    if (r.indexOf(typeof a) < 0) {
      let u = r.length > 1 ? "one of " + r.join(", ") : r[0];
      f.raiseError("Found type '" + typeof l + "' but was expecting " + u, e);
    }
    return a;
  }, f.isEmpty = function(l) {
    return Array.isArray(l) && l.length === 0;
  }, f.isSome = function(l) {
    return l != null && !f.isEmpty(l);
  }, f.isTrue = function(l) {
    return l != null && (l === !0 || l.length === 1 && f.valData(l[0]) === !0);
  }, f.isCapitalized = function(l) {
    return l && l[0] === l[0].toUpperCase();
  }, f.flatten = function(l) {
    return l.some((r) => r instanceof Promise) ? Promise.all(l).then((r) => p(r)) : p(l);
  };
  function p(l) {
    return [].concat(...l);
  }
  return f.arraify = function(l) {
    return Array.isArray(l) ? l : f.isSome(l) ? [l] : [];
  }, f.resolveAndArraify = function(l) {
    return l instanceof Promise ? l.then((r) => f.arraify(r)) : f.arraify(l);
  }, f.valData = function(l) {
    return l instanceof y ? l.data : l;
  }, f.valDataConverted = function(l) {
    return l instanceof y && (l = l.convertData()), l;
  }, f.escapeStringForRegExp = function(l) {
    return l.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&");
  }, f.pushFn = Function.prototype.apply.bind(Array.prototype.push), f.makeChildResNodes = function(l, r, e) {
    var o, m, c, d;
    let a = l.path + "." + r;
    if (e) {
      let h = e.pathsDefinedElsewhere[a];
      h && (a = h);
    }
    let u, s, t = e && e.choiceTypePaths[a];
    if (t)
      for (let h of t) {
        let _ = r + h;
        if (u = (o = l.data) == null ? void 0 : o[_], s = (m = l.data) == null ? void 0 : m["_" + _], u !== void 0 || s !== void 0) {
          a += h;
          break;
        }
      }
    else
      u = (c = l.data) == null ? void 0 : c[r], s = (d = l.data) == null ? void 0 : d["_" + r], u === void 0 && s === void 0 && (u = l._data[r]), r === "extension" && (a = "Extension");
    let i = null;
    e && (i = e.path2Type[a], a = e.path2TypeWithoutElements[a] || a);
    let n;
    if (f.isSome(u) || f.isSome(s))
      if (Array.isArray(u)) {
        n = u.map((_, T) => y.makeResNode(_, l, a, s && s[T], i));
        const h = (s == null ? void 0 : s.length) || 0;
        for (let _ = u.length; _ < h; ++_)
          n.push(y.makeResNode(null, l, a, s[_], i));
      } else u == null && Array.isArray(s) ? n = s.map((h) => y.makeResNode(null, l, a, h, i)) : n = [y.makeResNode(u, l, a, s, i)];
    else
      n = [];
    return n;
  }, rn = f, rn;
}
var d0 = {}, p0;
function Xs() {
  if (p0) return d0;
  p0 = 1;
  const f = Function.prototype.call.bind(Array.prototype.slice);
  return Number.isInteger = Number.isInteger || function(C) {
    return typeof C == "number" && isFinite(C) && Math.floor(C) === C;
  }, String.prototype.startsWith || Object.defineProperty(String.prototype, "startsWith", {
    value: function(C, y) {
      return y = y || 0, this.indexOf(C, y) === y;
    }
  }), String.prototype.endsWith || Object.defineProperty(String.prototype, "endsWith", {
    value: function(C, y) {
      var p = this.toString();
      (y === void 0 || y > p.length) && (y = p.length), y -= C.length;
      var l = p.indexOf(C, y);
      return l !== -1 && l === y;
    }
  }), String.prototype.includes || Object.defineProperty(String.prototype, "includes", {
    value: function() {
      return this.indexOf.apply(this, arguments) !== -1;
    }
  }), Object.assign || Object.defineProperty(Object, "assign", {
    value: function(C) {
      if (C == null)
        throw new TypeError("Cannot convert undefined or null to object");
      return f(arguments, 1).reduce(function(y, p) {
        return Object.keys(Object(p)).forEach(function(l) {
          y[l] = p[l];
        }), y;
      }, Object(C));
    }
  }), typeof btoa > "u" && (Dn.btoa = function(C) {
    return new Buffer.from(C, "binary").toString("base64");
  }), typeof atob > "u" && (Dn.atob = function(C) {
    return new Buffer.from(C, "base64").toString("binary");
  }), d0;
}
var un, g0;
function X0() {
  return g0 || (g0 = 1, un = {
    /**
     *  Resets the constants.  Should be called when before the engine starts its
     *  processing.
     */
    reset: function() {
      this.nowDate = /* @__PURE__ */ new Date(), this.today = null, this.now = null, this.timeOfDay = null, this.localTimezoneOffset = null;
    },
    /**
     *  The cached value of today().
     */
    today: null,
    /**
     *  The cached value of now().
     */
    now: null,
    /**
     *  The cached value of timeOfDay().
     */
    timeOfDay: null
  }), un;
}
var an, C0;
function Rn() {
  if (C0) return an;
  C0 = 1;
  const f = On().UcumLhcUtils.getInstance(), { roundToMaxPrecision: C } = An(), { valDataConverted: y } = he(), { FP_Type: p, FP_Quantity: l } = ye();
  function r(a) {
    return JSON.stringify(e(a));
  }
  function e(a) {
    if (a = y(a), a === null)
      return null;
    if (typeof a == "number")
      return C(a);
    if (a instanceof Date)
      return a.toISOString();
    if (a instanceof l) {
      const u = l._yearMonthConversionFactor[a.unit];
      if (u)
        return "_!yearMonth!_:" + u * a.value;
      {
        const s = l.toUcumQuantity(a.value, a.unit), t = f.getSpecifiedUnit(s.unit).unit;
        return "_!" + t.property_ + "!_:" + t.magnitude_ * s.value;
      }
    } else {
      if (a instanceof p)
        return a.toString();
      if (typeof a == "object")
        return Array.isArray(a) ? a.map(e) : Object.keys(a).sort().reduce(
          (u, s) => {
            const t = a[s];
            return u[s] = e(t), u;
          },
          {}
        );
    }
    return a;
  }
  return an = r, an;
}
var on, y0;
function $e() {
  if (y0) return on;
  y0 = 1;
  const { FP_Type: f, FP_Quantity: C } = ye();
  var y = he(), p = An(), l = Array.prototype.slice, r = Object.keys, e = function(o) {
    return Object.prototype.toString.call(o) == "[object Arguments]";
  };
  function a(o) {
    return typeof o == "string" || o instanceof String;
  }
  function u(o) {
    return !isNaN(parseFloat(o)) && isFinite(o);
  }
  function s(o) {
    return o.toUpperCase().replace(/\s+/, " ");
  }
  function t(o, m, c) {
    if (o = y.valDataConverted(o), m = y.valDataConverted(m), c || (c = {}), o === m)
      return !0;
    if (c.fuzzy) {
      if (a(o) && a(m))
        return s(o) == s(m);
      if (u(o) && u(m))
        return p.isEquivalent(o, m);
    } else if (typeof o == "number" && typeof m == "number")
      return p.isEqual(o, m);
    if (o instanceof Date && m instanceof Date)
      return o.getTime() === m.getTime();
    if (!o || !m || typeof o != "object" && typeof m != "object")
      return o === m;
    var d = o instanceof f, h = m instanceof f;
    if (d && h)
      return c.fuzzy ? o.equivalentTo(m) : o.equals(m);
    if (d || h) {
      let _ = !1;
      return typeof o == "number" && (o = new C(o, "'1'"), _ = !0), typeof m == "number" && (m = new C(m, "'1'"), _ = !0), _ ? c.fuzzy ? o.equivalentTo(m) : o.equals(m) : !1;
    }
    return n(o, m, c);
  }
  function i(o) {
    return o == null;
  }
  function n(o, m, c) {
    var d, h;
    if (i(o) || i(m) || o.prototype !== m.prototype) return !1;
    if (e(o) || e(m))
      return o = e(o) ? l.call(o) : o, m = e(m) ? l.call(m) : m, t(o, m, c);
    try {
      var _ = r(o), T = r(m);
    } catch {
      return !1;
    }
    if (_.length != T.length)
      return !1;
    for (_.sort(), T.sort(), d = _.length - 1; d >= 0; d--)
      if (_[d] != T[d])
        return !1;
    if (_.length === 1)
      return h = _[0], t(o[h], m[h], c);
    for (d = _.length - 1; d >= 0; d--)
      if (h = _[d], !t(o[h], m[h], c)) return !1;
    return typeof o == typeof m;
  }
  return on = {
    deepEqual: t,
    // Maximum collection length to use deepEqual(). When comparing a large number
    // of collection items, it is more efficient to convert the items to strings
    // using the hashObject() function and compare them.
    maxCollSizeForDeepEqual: 6
  }, on;
}
var cn, _0;
function wn() {
  if (_0) return cn;
  _0 = 1;
  const f = he(), { TypeInfo: C, ResourceNode: y } = ye(), p = Rn(), { deepEqual: l, maxCollSizeForDeepEqual: r } = $e();
  var e = {};
  e.whereMacro = function(u, s) {
    return u !== !1 && !u ? [] : f.flatten(u.map((t, i) => {
      this.$index = i;
      const n = s(t);
      return n instanceof Promise ? n.then((o) => o[0] ? t : []) : n[0] ? t : [];
    }));
  }, e.extension = function(u, s) {
    return u !== !1 && !u || !s ? [] : f.flatten(u.map((t, i) => {
      this.$index = i;
      const n = t && (t.data && t.data.extension || t._data && t._data.extension);
      return n ? n.filter((o) => o.url === s).map((o) => y.makeResNode(o, t, "Extension", null, "Extension")) : [];
    }));
  }, e.selectMacro = function(u, s) {
    return u !== !1 && !u ? [] : f.flatten(u.map((t, i) => (this.$index = i, s(t))));
  }, e.repeatMacro = function(u, s, t = [], i = {}) {
    if (u !== !1 && !u)
      return [];
    let n = [].concat(...u.map((o) => s(o)));
    return n.some((o) => o instanceof Promise) ? Promise.all(n).then((o) => (o = [].concat(...o), o.length ? e.repeatMacro(a(o, i, t), s, t, i) : t)) : n.length ? e.repeatMacro(a(n, i, t), s, t, i) : t;
  };
  function a(u, s, t) {
    const i = u.filter((n) => {
      const o = p(n), m = !s[o];
      return m && (s[o] = !0), m;
    });
    return t.push.apply(t, i), i;
  }
  return e.singleFn = function(u) {
    if (u.length === 1)
      return u;
    if (u.length === 0)
      return [];
    throw new Error("Expected single");
  }, e.firstFn = function(u) {
    return u[0];
  }, e.lastFn = function(u) {
    return u[u.length - 1];
  }, e.tailFn = function(u) {
    return u.slice(1, u.length);
  }, e.takeFn = function(u, s) {
    return u.slice(0, s);
  }, e.skipFn = function(u, s) {
    return u.slice(s, u.length);
  }, e.ofTypeFn = function(u, s) {
    return u.filter((t) => C.fromValue(t).is(s));
  }, e.distinctFn = function(u) {
    let s = [];
    if (u.length > 0)
      if (u.length > r) {
        let t = {};
        for (let i = 0, n = u.length; i < n; ++i) {
          let o = u[i], m = p(o);
          t[m] || (s.push(o), t[m] = !0);
        }
      } else {
        u = u.concat().reverse();
        do {
          let t = u.pop();
          s.push(t), u = u.filter((i) => !l(t, i));
        } while (u.length);
      }
    return s;
  }, cn = e, cn;
}
var fn, L0;
function kn() {
  if (L0) return fn;
  L0 = 1;
  var f = he(), C = ye();
  const { FP_Quantity: y, TypeInfo: p } = C;
  var l = {};
  l.iifMacro = function(m, c, d, h) {
    const _ = c(m);
    return _ instanceof Promise ? _.then((T) => r(m, T, d, h)) : r(m, _, d, h);
  };
  function r(m, c, d, h) {
    return f.isTrue(c) ? d(m) : h ? h(m) : [];
  }
  l.traceFn = function(m, c, d) {
    const h = d ? d(m) : null;
    return h instanceof Promise ? h.then((_) => l.traceFn(m, c, _)) : (this.customTraceFn ? d ? this.customTraceFn(d(m), c ?? "") : this.customTraceFn(m, c ?? "") : d ? console.log("TRACE:[" + (c || "") + "]", JSON.stringify(d(m), null, " ")) : console.log("TRACE:[" + (c || "") + "]", JSON.stringify(m, null, " ")), m);
  }, l.defineVariable = function(m, c, d) {
    let h = m;
    if (d && (h = d(m)), this.definedVars || (this.definedVars = {}), c in this.vars || c in this.processedVars)
      throw new Error("Environment Variable %" + c + " already defined");
    if (Object.keys(this.definedVars).includes(c))
      throw new Error("Variable %" + c + " already defined");
    return this.definedVars[c] = h, m;
  };
  var e = /^[+-]?\d+$/;
  l.toInteger = function(m) {
    if (m.length !== 1)
      return [];
    var c = f.valData(m[0]);
    return c === !1 ? 0 : c === !0 ? 1 : typeof c == "number" ? Number.isInteger(c) ? c : [] : typeof c == "string" && e.test(c) ? parseInt(c) : [];
  };
  const a = /^((\+|-)?\d+(\.\d+)?)\s*(('[^']+')|([a-zA-Z]+))?$/, u = { value: 1, unit: 5, time: 6 };
  l.toQuantity = function(m, c) {
    let d;
    if (m.length > 1)
      throw new Error("Could not convert to quantity: input collection contains multiple items");
    if (m.length === 1) {
      if (c) {
        const T = y._calendarDuration2Seconds[this.unit], M = y._calendarDuration2Seconds[c];
        if (!T != !M && (T > 1 || M > 1))
          return null;
        y.mapTimeUnitsToUCUMCode[c] || (c = `'${c}'`);
      }
      var h = f.valDataConverted(m[0]);
      let _;
      if (typeof h == "number")
        d = new y(h, "'1'");
      else if (h instanceof y)
        d = h;
      else if (typeof h == "boolean")
        d = new y(h ? 1 : 0, "'1'");
      else if (typeof h == "string" && (_ = a.exec(h))) {
        const T = _[u.value], M = _[u.unit], P = _[u.time];
        (!P || y.mapTimeUnitsToUCUMCode[P]) && (d = new y(Number(T), M || P || "'1'"));
      }
      d && c && d.unit !== c && (d = y.convUnitTo(d.unit, d.value, c));
    }
    return d || [];
  };
  var s = /^[+-]?\d+(\.\d+)?$/;
  l.toDecimal = function(m) {
    if (m.length !== 1)
      return [];
    var c = f.valData(m[0]);
    return c === !1 ? 0 : c === !0 ? 1 : typeof c == "number" ? c : typeof c == "string" && s.test(c) ? parseFloat(c) : [];
  }, l.toString = function(m) {
    if (m.length !== 1)
      return [];
    var c = f.valDataConverted(m[0]);
    return c == null ? [] : c.toString();
  };
  function t(m) {
    let c = m.slice(3);
    l["to" + c] = function(d) {
      var h = [];
      if (d.length > 1)
        throw Error("to " + c + " called for a collection of length " + d.length);
      if (d.length === 1) {
        var _ = f.valData(d[0]);
        if (typeof _ == "string") {
          var T = C[m].checkString(_);
          T && (h = T);
        }
      }
      return h;
    };
  }
  t("FP_Date"), t("FP_DateTime"), t("FP_Time");
  const i = ["true", "t", "yes", "y", "1", "1.0"].reduce((m, c) => (m[c] = !0, m), {}), n = ["false", "f", "no", "n", "0", "0.0"].reduce((m, c) => (m[c] = !0, m), {});
  l.toBoolean = function(m) {
    if (m.length !== 1)
      return [];
    const c = f.valData(m[0]);
    switch (typeof c) {
      case "boolean":
        return c;
      case "number":
        if (c === 1)
          return !0;
        if (c === 0)
          return !1;
        break;
      case "string":
        const d = c.toLowerCase();
        if (i[d])
          return !0;
        if (n[d])
          return !1;
    }
    return [];
  }, l.createConvertsToFn = function(m, c) {
    return typeof c == "string" ? function(d) {
      return d.length !== 1 ? [] : typeof m(d) === c;
    } : function(d) {
      return d.length !== 1 ? [] : m(d) instanceof c;
    };
  };
  const o = {
    Integer: function(m) {
      if (Number.isInteger(m))
        return m;
    },
    Boolean: function(m) {
      return m === !0 || m === !1 ? m : !0;
    },
    Number: function(m) {
      if (typeof m == "number")
        return m;
    },
    String: function(m) {
      if (typeof m == "string")
        return m;
    },
    StringOrNumber: function(m) {
      if (typeof m == "string" || typeof m == "number")
        return m;
    },
    AnySingletonAtRoot: function(m) {
      return m;
    }
  };
  return l.singleton = function(m, c) {
    if (m.length > 1)
      throw new Error("Unexpected collection" + JSON.stringify(m) + "; expected singleton of type " + c);
    if (m.length === 0)
      return [];
    const d = f.valData(m[0]);
    if (d == null)
      return [];
    const h = o[c];
    if (h) {
      const _ = h(d);
      if (_ !== void 0)
        return _;
      throw new Error(`Expected ${c.toLowerCase()}, but got: ${JSON.stringify(m)}`);
    }
    throw new Error("Not supported type " + c);
  }, l.hasValueFn = function(m) {
    return m.length === 1 && f.valData(m[0]) != null && p.isPrimitive(p.fromValue(m[0]));
  }, l.getValueFn = function(m) {
    if (m.length === 1) {
      const c = m[0], d = f.valData(c);
      if (d != null && p.isPrimitive(p.fromValue(c)))
        return d;
    }
    return [];
  }, fn = l, fn;
}
var mn, T0;
function ei() {
  if (T0) return mn;
  T0 = 1;
  const f = he(), { whereMacro: C, distinctFn: y } = wn(), p = kn(), l = Rn(), { deepEqual: r, maxCollSizeForDeepEqual: e } = $e(), a = {};
  a.emptyFn = f.isEmpty, a.notFn = function(s) {
    let t = p.singleton(s, "Boolean");
    return typeof t == "boolean" ? !t : [];
  }, a.existsMacro = function(s, t) {
    if (t) {
      const i = C.call(this, s, t);
      return i instanceof Promise ? i.then((n) => a.existsMacro(n)) : a.existsMacro(i);
    }
    return !f.isEmpty(s);
  }, a.allMacro = function(s, t) {
    const i = [];
    for (let n = 0, o = s.length; n < o; ++n) {
      this.$index = n;
      const m = t(s[n]);
      if (m instanceof Promise)
        i.push(m);
      else if (!f.isTrue(m))
        return [!1];
    }
    return i.length ? Promise.all(i).then((n) => n.some((o) => !f.isTrue(o)) ? [!1] : [!0]) : [!0];
  }, a.allTrueFn = function(s) {
    let t = !0;
    for (let i = 0, n = s.length; i < n && t; ++i)
      t = f.assertType(s[i], ["boolean"], "allTrue") === !0;
    return [t];
  }, a.anyTrueFn = function(s) {
    let t = !1;
    for (let i = 0, n = s.length; i < n && !t; ++i)
      t = f.assertType(s[i], ["boolean"], "anyTrue") === !0;
    return [t];
  }, a.allFalseFn = function(s) {
    let t = !0;
    for (let i = 0, n = s.length; i < n && t; ++i)
      t = f.assertType(s[i], ["boolean"], "allFalse") === !1;
    return [t];
  }, a.anyFalseFn = function(s) {
    let t = !1;
    for (let i = 0, n = s.length; i < n && !t; ++i)
      t = f.assertType(s[i], ["boolean"], "anyFalse") === !1;
    return [t];
  };
  function u(s, t) {
    const i = s.length, n = t.length;
    let o = i <= n;
    if (o)
      if (i + n > e) {
        const m = t.reduce((c, d) => (c[l(d)] = !0, c), {});
        o = !s.some((c) => !m[l(c)]);
      } else
        for (let m = 0, c = s.length; m < c && o; ++m) {
          let d = f.valData(s[m]);
          o = t.some((h) => r(d, f.valData(h)));
        }
    return o;
  }
  return a.subsetOfFn = function(s, t) {
    return [u(s, t)];
  }, a.supersetOfFn = function(s, t) {
    return [u(t, s)];
  }, a.isDistinctFn = function(s) {
    return [s.length === y(s).length];
  }, mn = a, mn;
}
var hn, U0;
function es() {
  if (U0) return hn;
  U0 = 1;
  const { FP_Quantity: f, FP_Type: C } = ye(), y = he(), p = {};
  function l(e, a) {
    let u;
    if (r(e))
      u = [];
    else {
      if (e.length !== 1)
        throw new Error("Unexpected collection" + JSON.stringify(e) + "; expected singleton of type number");
      {
        const s = y.valData(e[0]);
        if (s == null)
          u = [];
        else if (typeof s == "number")
          u = a(s);
        else
          throw new Error("Expected number, but got " + JSON.stringify(s));
      }
    }
    return u;
  }
  function r(e) {
    return typeof e == "number" ? !1 : e.length === 0;
  }
  return p.amp = function(e, a) {
    return (e || "") + (a || "");
  }, p.plus = function(e, a) {
    let u;
    if (e.length === 1 && a.length === 1) {
      const s = y.valDataConverted(e[0]), t = y.valDataConverted(a[0]);
      s == null || t == null ? u = [] : typeof s == "string" && typeof t == "string" ? u = s + t : typeof s == "number" ? typeof t == "number" ? u = s + t : t instanceof f && (u = new f(s, "'1'").plus(t)) : s instanceof C && (t instanceof f ? u = s.plus(t) : t instanceof C ? u = t.plus(s) : typeof t == "number" && (u = s.plus(new f(t, "'1'"))));
    }
    if (u === void 0)
      throw new Error("Cannot " + JSON.stringify(e) + " + " + JSON.stringify(a));
    return u;
  }, p.minus = function(e, a) {
    if (e.length === 1 && a.length === 1) {
      const u = y.valDataConverted(e[0]), s = y.valDataConverted(a[0]);
      if (u == null || s == null)
        return [];
      if (typeof u == "number") {
        if (typeof s == "number")
          return u - s;
        if (s instanceof f)
          return new f(u, "'1'").plus(new f(-s.value, s.unit));
      }
      if (u instanceof C) {
        if (s instanceof f)
          return u.plus(new f(-s.value, s.unit));
        if (typeof s == "number")
          return u.plus(new f(-s, "'1'"));
      }
    }
    throw new Error("Cannot " + JSON.stringify(e) + " - " + JSON.stringify(a));
  }, p.mul = function(e, a) {
    if (e.length === 1 && a.length === 1) {
      const u = y.valDataConverted(e[0]), s = y.valDataConverted(a[0]);
      if (u == null || s == null)
        return [];
      if (typeof u == "number") {
        if (typeof s == "number")
          return u * s;
        if (s instanceof f)
          return new f(u, "'1'").mul(s);
      }
      if (u instanceof C) {
        if (s instanceof f)
          return u.mul(s);
        if (typeof s == "number")
          return u.mul(new f(s, "'1'"));
      }
    }
    throw new Error("Cannot " + JSON.stringify(e) + " * " + JSON.stringify(a));
  }, p.div = function(e, a) {
    if (e.length === 1 && a.length === 1) {
      const u = y.valDataConverted(e[0]), s = y.valDataConverted(a[0]);
      if (u == null || s == null)
        return [];
      if (typeof u == "number") {
        if (typeof s == "number")
          return s === 0 ? [] : u / s;
        if (s instanceof f)
          return new f(u, "'1'").div(s);
      }
      if (u instanceof C) {
        if (s instanceof f)
          return u.div(s);
        if (typeof s == "number")
          return u.div(new f(s, "'1'"));
      }
    }
    throw new Error("Cannot " + JSON.stringify(e) + " / " + JSON.stringify(a));
  }, p.intdiv = function(e, a) {
    return a === 0 ? [] : Math.floor(e / a);
  }, p.mod = function(e, a) {
    return a === 0 ? [] : e % a;
  }, p.abs = function(e) {
    let a;
    if (r(e))
      a = [];
    else {
      if (e.length !== 1)
        throw new Error("Unexpected collection" + JSON.stringify(e) + "; expected singleton of type number or Quantity");
      var u = y.valData(e[0]);
      if (u == null)
        a = [];
      else if (typeof u == "number")
        a = Math.abs(u);
      else if (u instanceof f)
        a = new f(Math.abs(u.value), u.unit);
      else
        throw new Error("Expected number or Quantity, but got " + JSON.stringify(u || e));
    }
    return a;
  }, p.ceiling = function(e) {
    return l(e, Math.ceil);
  }, p.exp = function(e) {
    return l(e, Math.exp);
  }, p.floor = function(e) {
    return l(e, Math.floor);
  }, p.ln = function(e) {
    return l(e, Math.log);
  }, p.log = function(e, a) {
    return l(e, (u) => Math.log(u) / Math.log(a));
  }, p.power = function(e, a) {
    return l(e, (u) => {
      const s = Math.pow(u, a);
      return isNaN(s) ? [] : s;
    });
  }, p.round = function(e, a) {
    return l(e, (u) => {
      if (a === void 0)
        return Math.round(u);
      {
        let s = Math.pow(10, a);
        return Math.round(u * s) / s;
      }
    });
  }, p.sqrt = function(e) {
    return l(e, (a) => a < 0 ? [] : Math.sqrt(a));
  }, p.truncate = function(e) {
    return l(e, Math.trunc);
  }, hn = p, hn;
}
var dn, x0;
function ts() {
  if (x0) return dn;
  x0 = 1;
  const f = he(), { deepEqual: C } = $e(), y = ye(), p = y.FP_Type, l = y.FP_DateTime;
  var r = {};
  function e(s, t) {
    return f.isEmpty(s) || f.isEmpty(t) ? [] : C(s, t);
  }
  function a(s, t) {
    return f.isEmpty(s) && f.isEmpty(t) ? [!0] : f.isEmpty(s) || f.isEmpty(t) ? [] : C(s, t, { fuzzy: !0 });
  }
  r.equal = function(s, t) {
    return e(s, t);
  }, r.unequal = function(s, t) {
    var i = e(s, t);
    return i === void 0 ? void 0 : !i;
  }, r.equival = function(s, t) {
    return a(s, t);
  }, r.unequival = function(s, t) {
    return !a(s, t);
  };
  function u(s, t) {
    if (f.assertOnlyOne(s, "Singleton was expected"), f.assertOnlyOne(t, "Singleton was expected"), s = f.valDataConverted(s[0]), t = f.valDataConverted(t[0]), s != null && t != null) {
      let i = s instanceof l ? l : s.constructor, n = t instanceof l ? l : t.constructor;
      i !== n && f.raiseError('Type of "' + s + '" (' + i.name + ') did not match type of "' + t + '" (' + n.name + ")", "InequalityExpression");
    }
    return [s, t];
  }
  return r.lt = function(s, t) {
    const [i, n] = u(s, t);
    if (i == null || n == null)
      return [];
    if (i instanceof p) {
      const o = i.compare(n);
      return o === null ? [] : o < 0;
    }
    return i < n;
  }, r.gt = function(s, t) {
    const [i, n] = u(s, t);
    if (i == null || n == null)
      return [];
    if (i instanceof p) {
      const o = i.compare(n);
      return o === null ? [] : o > 0;
    }
    return i > n;
  }, r.lte = function(s, t) {
    const [i, n] = u(s, t);
    if (i == null || n == null)
      return [];
    if (i instanceof p) {
      const o = i.compare(n);
      return o === null ? [] : o <= 0;
    }
    return i <= n;
  }, r.gte = function(s, t) {
    const [i, n] = u(s, t);
    if (i == null || n == null)
      return [];
    if (i instanceof p) {
      const o = i.compare(n);
      return o === null ? [] : o >= 0;
    }
    return i >= n;
  }, dn = r, dn;
}
var pn, b0;
function ti() {
  if (b0) return pn;
  b0 = 1;
  let f = {};
  const C = es(), y = ts(), p = he();
  f.aggregateMacro = function(r, e, a) {
    return r.reduce((u, s, t) => u instanceof Promise ? u.then((i) => (this.$index = t, this.$total = i, this.$total = e(s))) : (this.$index = t, this.$total = e(s)), this.$total = a);
  }, f.countFn = function(r) {
    return r && r.length ? r.length : 0;
  }, f.sumFn = function(r) {
    return f.aggregateMacro.apply(this, [r.slice(1), (e) => {
      let a = p.arraify(e).filter((s) => p.valData(s) != null), u = p.arraify(this.$total).filter((s) => p.valData(s) != null);
      return a.length === 0 || u.length === 0 ? [] : C.plus(a, u);
    }, r[0]]);
  };
  function l(r, e) {
    let a;
    if (r.length === 0 || p.valData(r[0]) == null)
      a = [];
    else {
      a = [r[0]];
      for (let u = 1; u < r.length; u++) {
        if (p.valData(r[u]) == null) {
          a = [];
          break;
        }
        const s = [r[u]];
        a = p.isTrue(e(s, a)) ? s : a;
      }
    }
    return a;
  }
  return f.minFn = function(r) {
    return l(r, y.lt);
  }, f.maxFn = function(r) {
    return l(r, y.gt);
  }, f.avgFn = function(r) {
    const e = p.arraify(f.sumFn(r)), a = p.arraify(f.countFn(r));
    return e.length === 0 || a.length === 0 ? [] : C.div(e, a);
  }, pn = f, pn;
}
var gn, v0;
function ni() {
  if (v0) return gn;
  v0 = 1;
  let f = {};
  f.weight = function(p) {
    var u;
    if (p !== !1 && !p)
      return [];
    const l = this.vars.scoreExt || this.processedVars.scoreExt, r = l ? (s) => s.url === l : (s) => this.defaultScoreExts.includes(s.url), e = [], a = this.vars.questionnaire || ((u = this.processedVars.questionnaire) == null ? void 0 : u.data);
    return p.forEach((s) => {
      var t, i, n, o, m, c;
      if (s != null && s.data) {
        const d = s.data.valueCoding;
        let h = d;
        if (!h) {
          const T = Object.keys(s.data).find((M) => M.length > 5 && M.startsWith("value"));
          h = T ? s.data[T] : (t = s._data) != null && t.extension ? s._data : s.data;
        }
        const _ = (n = (i = h == null ? void 0 : h.extension) == null ? void 0 : i.find(r)) == null ? void 0 : n.valueDecimal;
        if (_ !== void 0)
          e.push(_);
        else if (d) {
          const T = C(s.parentResNode);
          if (T.length)
            if (a) {
              const M = y(a, T), P = (o = M == null ? void 0 : M.answerOption) == null ? void 0 : o.find(
                (q) => q.valueCoding.code === d.code && q.valueCoding.system === d.system
              );
              if (P) {
                const q = (c = (m = P.extension) == null ? void 0 : m.find(r)) == null ? void 0 : c.valueDecimal;
                q !== void 0 && e.push(q);
              } else
                throw new Error(
                  "Questionnaire answerOption with this linkId was not found: " + s.parentResNode.data.linkId + "."
                );
            } else
              throw new Error("%questionnaire is needed but not specified.");
        }
      }
    }), e;
  };
  function C(p) {
    var r;
    const l = [];
    for (; (r = p.data) != null && r.linkId; )
      l.push(p.data.linkId), p = p.parentResNode;
    return l;
  }
  function y(p, l) {
    var e;
    let r = p;
    for (let a = l.length - 1; a >= 0; --a)
      if (r = (e = r.item) == null ? void 0 : e.find((u) => u.linkId === l[a]), !r)
        return null;
    return r;
  }
  return gn = f, gn;
}
var Cn, I0;
function li() {
  if (I0) return Cn;
  I0 = 1;
  const f = {}, { distinctFn: C } = wn(), y = Rn(), { deepEqual: p, maxCollSizeForDeepEqual: l } = $e();
  return f.union = function(r, e) {
    return C(r.concat(e));
  }, f.combineFn = function(r, e) {
    return r.concat(e);
  }, f.intersect = function(r, e) {
    let a = [];
    const u = r.length;
    let s = e.length;
    if (u && s)
      if (u + s > l) {
        let t = {};
        e.forEach((i) => {
          const n = y(i);
          t[n] ? s-- : t[n] = !0;
        });
        for (let i = 0; i < u && s > 0; ++i) {
          let n = r[i], o = y(n);
          t[o] && (a.push(n), t[o] = !1, s--);
        }
      } else
        a = C(r).filter(
          (t) => e.some((i) => p(t, i))
        );
    return a;
  }, f.exclude = function(r, e) {
    let a = [];
    const u = r.length, s = e.length;
    if (!s)
      return r;
    if (u)
      if (u + s > l) {
        let t = {};
        e.forEach((i) => {
          const n = y(i);
          t[n] = !0;
        }), a = r.filter((i) => !t[y(i)]);
      } else
        a = r.filter((t) => !e.some((i) => p(t, i)));
    return a;
  }, Cn = f, Cn;
}
var yn, S0;
function si() {
  if (S0) return yn;
  S0 = 1;
  const { deepEqual: f } = $e(), C = {};
  function y(p, l) {
    for (var r = 0; r < p.length; r++)
      if (f(p[r], l[0]))
        return !0;
    return !1;
  }
  return C.contains = function(p, l) {
    if (l.length == 0)
      return [];
    if (p.length == 0)
      return !1;
    if (l.length > 1)
      throw new Error("Expected singleton on right side of contains, got " + JSON.stringify(l));
    return y(p, l);
  }, C.in = function(p, l) {
    if (p.length == 0)
      return [];
    if (l.length == 0)
      return !1;
    if (p.length > 1)
      throw new Error("Expected singleton on right side of in, got " + JSON.stringify(l));
    return y(l, p);
  }, yn = C, yn;
}
var _n, M0;
function ii() {
  if (M0) return _n;
  M0 = 1;
  const f = he(), C = kn(), y = {}, p = {};
  function l(e) {
    return p[e] || (p[e] = e.replace(/\./g, (a, u, s) => {
      const i = s.substr(0, u).replace(/\\\\/g, "").replace(/\\[\][]/g, ""), n = i[i.length - 1] === "\\", o = i.lastIndexOf("["), m = i.lastIndexOf("]");
      return n || o > m ? "." : "[^]";
    })), p[e];
  }
  return y.indexOf = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(a) || f.isEmpty(u) ? [] : u.indexOf(a);
  }, y.substring = function(e, a, u) {
    const s = C.singleton(e, "String");
    return f.isEmpty(s) || f.isEmpty(a) || a < 0 || a >= s.length ? [] : u === void 0 || f.isEmpty(u) ? s.substring(a) : s.substring(a, a + u);
  }, y.startsWith = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(a) || f.isEmpty(u) ? [] : u.startsWith(a);
  }, y.endsWith = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(a) || f.isEmpty(u) ? [] : u.endsWith(a);
  }, y.containsFn = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(a) || f.isEmpty(u) ? [] : u.includes(a);
  }, y.upper = function(e) {
    const a = C.singleton(e, "String");
    return f.isEmpty(a) ? [] : a.toUpperCase();
  }, y.lower = function(e) {
    const a = C.singleton(e, "String");
    return f.isEmpty(a) ? [] : a.toLowerCase();
  }, y.joinFn = function(e, a) {
    const u = [];
    return e.forEach((s) => {
      const t = f.valData(s);
      if (typeof t == "string")
        u.push(t);
      else if (t != null)
        throw new Error("Join requires a collection of strings.");
    }), f.isEmpty(u) ? [] : (a === void 0 && (a = ""), u.join(a));
  }, y.splitFn = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(u) ? [] : u.split(a);
  }, y.trimFn = function(e) {
    const a = C.singleton(e, "String");
    return f.isEmpty(a) ? [] : a.trim();
  }, y.encodeFn = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(u) ? [] : a === "urlbase64" || a === "base64url" ? btoa(u).replace(/\+/g, "-").replace(/\//g, "_") : a === "base64" ? btoa(u) : a === "hex" ? Array.from(u).map(
      (s) => s.charCodeAt(0) < 128 ? s.charCodeAt(0).toString(16) : encodeURIComponent(s).replace(/%/g, "")
    ).join("") : [];
  }, y.decodeFn = function(e, a) {
    const u = C.singleton(e, "String");
    if (f.isEmpty(u))
      return [];
    if (a === "urlbase64" || a === "base64url")
      return atob(u.replace(/-/g, "+").replace(/_/g, "/"));
    if (a === "base64")
      return atob(u);
    if (a === "hex") {
      if (u.length % 2 !== 0)
        throw new Error("Decode 'hex' requires an even number of characters.");
      return decodeURIComponent("%" + u.match(/.{2}/g).join("%"));
    }
    return [];
  }, new RegExp("").dotAll === !1 ? y.matches = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(a) || f.isEmpty(u) ? [] : new RegExp(a, "su").test(u);
  } : y.matches = function(e, a) {
    const u = C.singleton(e, "String");
    return f.isEmpty(a) || f.isEmpty(u) ? [] : new RegExp(l(a), "u").test(u);
  }, y.replace = function(e, a, u) {
    const s = C.singleton(e, "String");
    if (f.isEmpty(a) || f.isEmpty(u) || f.isEmpty(s))
      return [];
    const t = new RegExp(f.escapeStringForRegExp(a), "g");
    return s.replace(t, u);
  }, y.replaceMatches = function(e, a, u) {
    const s = C.singleton(e, "String");
    if (f.isEmpty(a) || f.isEmpty(u) || f.isEmpty(s))
      return [];
    const t = new RegExp(a, "gu");
    return s.replace(t, u);
  }, y.length = function(e) {
    const a = C.singleton(e, "String");
    return f.isEmpty(a) ? [] : a.length;
  }, y.toChars = function(e) {
    const a = C.singleton(e, "String");
    return f.isEmpty(a) ? [] : a.split("");
  }, _n = y, _n;
}
var Ln, E0;
function ri() {
  if (E0) return Ln;
  E0 = 1;
  const f = he();
  var C = {};
  return C.children = function(y) {
    let p = this.model;
    return y.reduce(function(l, r) {
      let e = f.valData(r);
      if (e == null)
        return l;
      if (typeof e == "object") {
        for (var a of Object.keys(e))
          f.pushFn(l, f.makeChildResNodes(r, a, p));
        return l;
      } else
        return l;
    }, []);
  }, C.descendants = function(y) {
    for (var p = C.children.call(this, y), l = []; p.length > 0; )
      f.pushFn(l, p), p = C.children.call(this, p);
    return l;
  }, Ln = C, Ln;
}
var Tn, N0;
function ui() {
  if (N0) return Tn;
  N0 = 1;
  var f = {};
  const C = ye(), y = X0(), p = C.FP_Date, l = C.FP_DateTime, r = C.FP_Time;
  return f.now = function() {
    if (!y.now) {
      var e = y.nowDate, a = l.isoDateTime(e);
      y.now = new l(a);
    }
    return y.now;
  }, f.today = function() {
    if (!y.today) {
      var e = y.nowDate, a = p.isoDate(e);
      y.today = new p(a);
    }
    return y.today;
  }, f.timeOfDay = function() {
    if (!y.timeOfDay) {
      const e = y.nowDate, a = l.isoTime(e);
      y.timeOfDay = new r(a);
    }
    return y.timeOfDay;
  }, Tn = f, Tn;
}
var Un, O0;
function ns() {
  if (O0) return Un;
  O0 = 1;
  const l = class l {
    constructor(e) {
      this.terminologyUrl = e, this.invocationTable = l.invocationTable;
    }
    /**
     * This example function calls the Terminology Service $validate-code operation
     * on a value set. See Terminology Service API: https://build.fhir.org/fhirpath.html#txapi
     * The source code of this function is based on this script:
     * https://gist.github.com/brianpos/97e1237470d76835ea9a35bf8e021ca6#file-fhirpath-async-ts
     * @param {Terminologies[]} self - an array with one element that refers to
     *  the current Terminology instance.
     * @param {string} valueset - a canonical URL reference to a value set. In the original
     *  specification this could also be an actual ValueSet, but I don't want to
     *  complicate this example.
     * @param {string|Object} coded - either a Coding, a CodeableConcept,
     *  or a resource element that is a code.
     * @param {string} [params] - a URL encoded string with other parameters for the
     *  validate-code operation (e.g. 'date=2011-03-04&displayLanguage=en').
     * @return {Promise<Parameters>} - a Parameters resource
     *  (https://build.fhir.org/parameters.html) with the results of the validation
     *  operation.
     */
    static validateVS(e, a, u, s = "") {
      y(s);
      const t = {
        Accept: "application/fhir+json; charset=utf-8"
      }, i = {
        Accept: "application/fhir+json; charset=utf-8",
        "Content-Type": "application/fhir+json; charset=utf-8"
      };
      let n = new Headers(t);
      const o = `${e[0].terminologyUrl}/ValueSet/$validate-code`;
      let m;
      if (u.coding) {
        const c = {
          resourceType: "Parameters",
          parameter: [
            {
              name: "url",
              valueUri: a
            },
            {
              name: "codeableConcept",
              valueCodeableConcept: u
            }
          ]
        };
        n = new Headers(i), m = fetch(
          o + (s ? "?" + s : ""),
          { method: "POST", headers: n, body: JSON.stringify(c) }
        );
      } else if (typeof u == "string") {
        const c = new URLSearchParams({
          url: a
        });
        m = fetch(
          `${e[0].terminologyUrl}/ValueSet?${c.toString() + (s ? "&" + s : "")}`,
          { headers: n }
        ).then((d) => d.json()).then((d) => {
          var _, T, M;
          const h = ((_ = d == null ? void 0 : d.entry) == null ? void 0 : _.length) === 1 && (p((T = d.entry[0].resource.expansion) == null ? void 0 : T.contains) || p((M = d.entry[0].resource.compose) == null ? void 0 : M.include));
          if (h) {
            const P = new URLSearchParams({
              url: a,
              code: u,
              system: h
            });
            return fetch(
              `${o}?${P.toString() + (s ? "&" + s : "")}`,
              { headers: n }
            );
          } else
            throw new Error("The valueset does not have a single code system.");
        });
      } else if (u.code) {
        const c = new URLSearchParams({
          url: a ?? "",
          system: u.system ?? "",
          code: u.code
        });
        m = fetch(
          `${o}?${c.toString() + (s ? "&" + s : "")}`,
          { headers: n }
        );
      }
      return Promise.resolve(m).then((c) => c.json()).then((c) => {
        if (c != null && c.parameter)
          return c;
        throw new Error(c);
      }).catch(() => {
        const c = C(u, a);
        throw new Error("Failed to check membership: " + c);
      });
    }
  };
  // Same as fhirpath.invocationTable, but for %terminologies methods
  se(l, "invocationTable", {
    validateVS: { fn: l.validateVS, arity: { 2: ["String", "AnySingletonAtRoot"], 3: ["String", "AnySingletonAtRoot", "String"] } }
  });
  let f = l;
  function C(r, e) {
    if (typeof r == "string")
      return r + " - " + e;
    if (r.code)
      return r.system + "|" + r.code + " - " + e;
    if (r.coding)
      return r.coding.map((a) => a.system + "|" + a.code).join(",") + " - " + e;
  }
  function y(r) {
    if (r != null && r.split("&").find(
      (e) => {
        const a = e.split("=");
        return a.length <= 2 && a.find((u) => encodeURIComponent(decodeURIComponent(u)) !== u);
      }
    ))
      throw new Error(`"${r}" should be a valid URL-encoded string`);
  }
  function p(r, e = void 0) {
    if (r) {
      for (let a = 0; a < r.length; ++a)
        if (!e)
          e = r[a].system;
        else if (e !== r[a].system) {
          e = void 0;
          break;
        }
    }
    return e;
  }
  return Un = f, Un;
}
var xn, A0;
function ai() {
  if (A0) return xn;
  A0 = 1;
  const f = he(), C = ns();
  let y = {};
  return y.memberOf = function(p, l) {
    if (!this.async)
      throw new Error('The asynchronous function "memberOf" is not allowed. To enable asynchronous functions, use the async=true or async="always" option.');
    if (p.length !== 1 || p[0] == null)
      return [];
    if (typeof l == "string" && /^https?:\/\/.*/.test(l)) {
      const r = this.processedVars.terminologies;
      if (!r)
        throw new Error('Option "terminologyUrl" is not specified.');
      return C.validateVS(
        [r],
        l,
        f.valData(p[0]),
        ""
      ).then((e) => e.parameter.find((a) => a.name === "result").valueBoolean, () => []);
    }
    return [];
  }, xn = y, xn;
}
var bn, R0;
function oi() {
  if (R0) return bn;
  R0 = 1;
  var f = {};
  return f.orOp = function(C, y) {
    if (Array.isArray(y)) {
      if (C === !0)
        return !0;
      if (C === !1)
        return [];
      if (Array.isArray(C))
        return [];
    }
    return Array.isArray(C) ? y === !0 ? !0 : [] : C || y;
  }, f.andOp = function(C, y) {
    if (Array.isArray(y)) {
      if (C === !0)
        return [];
      if (C === !1)
        return !1;
      if (Array.isArray(C))
        return [];
    }
    return Array.isArray(C) ? y === !0 ? [] : !1 : C && y;
  }, f.xorOp = function(C, y) {
    return Array.isArray(C) || Array.isArray(y) ? [] : C && !y || !C && y;
  }, f.impliesOp = function(C, y) {
    if (Array.isArray(y)) {
      if (C === !0)
        return [];
      if (C === !1)
        return !0;
      if (Array.isArray(C))
        return [];
    }
    return Array.isArray(C) ? y === !0 ? !0 : [] : C === !1 ? !0 : C && y;
  }, bn = f, bn;
}
var vn, w0;
function ci() {
  if (w0) return vn;
  w0 = 1;
  const f = he(), { ResourceNode: C, TypeInfo: y, instantRE: p, timeRE: l, dateRE: r, dateTimeRE: e } = ye(), u = class u {
    /**
     * Creates an extension with the given url and value
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {string} url - a string value that identifies the extension
     * @param {*} value - the value of the extension (any valid type for
     *  extension.value[x]).
     * @return {ResourceNode}
     */
    static Extension(t, i, n) {
      if (n.length !== 1) {
        if (n.length > 1)
          throw new Error("Unexpected collection " + JSON.stringify(n) + " as a value for %factory.Extension(url, value)");
        if (n.length === 0)
          throw new Error("Unexpected empty collection " + JSON.stringify(n) + " as a value for %factory.Extension(url, value)");
      } else
        return C.makeResNode(
          u.createExtensionObject(i, n[0]),
          null,
          "Extension",
          null,
          "Extension"
        );
    }
    /**
     * Creates an object to store the extension value.
     * @param {string} url - a string value that identifies the extension
     * @param {*} value - the value of the extension (any valid type for
     *  extension.value[x]).
     * @return {{[p: string]: *, url}}
     */
    static createExtensionObject(t, i) {
      const n = "value" + y.fromValue(i).name.replace(/^\w/, (o) => o.toUpperCase());
      return {
        url: t,
        [n]: f.valData(i)
      };
    }
    /**
     * Creates an identifier with the given properties.
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {string} system - a string value that goes in Identifier.system.
     * @param {string} value - a string value that goes in Identifier.value.
     * @param {string} use - a string value that goes in Identifier.use.
     * @param {ResourceNode[]} typeColl - a CodeableConcept that goes in
     *  Identifier.type.
     * @return {ResourceNode}
     */
    static Identifier(t, i, n, o, m) {
      if ((m == null ? void 0 : m.length) > 1)
        throw new Error("Unexpected collection " + JSON.stringify(m) + " as a type for %factory.Identifier{system, value, use, type)");
      const c = {};
      if (f.isSome(i) && (c.system = i), f.isSome(n) && (c.value = n), f.isSome(o) && (c.use = o), f.isSome(m)) {
        const d = y.fromValue(m[0]);
        if (!y.isType(d.name, "CodeableConcept"))
          throw new Error(`Expected "FHIR.CodeableConcept", got "${d}"`);
        c.type = m[0];
      }
      return C.makeResNode(
        c,
        null,
        "Identifier",
        null,
        "Identifier"
      );
    }
    /**
     * Create a human name with the given properties.
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {string} family - a string value that goes in HumanName.system.
     * @param {ResourceNode[]} givenColl - a collection of string values that goes
     *  in HumanName.given.
     * @param {string} prefix - a string value that goes in HumanName.prefix.
     * @param {string} suffix - a string value that goes in HumanName.suffix.
     * @param {string} text - a string value that goes in HumanName.text.
     * @param {string} use - a string value that goes in HumanName.use.
     * @return {ResourceNode}
     */
    static HumanName(t, i, n, o, m, c, d) {
      const h = {};
      return f.isSome(i) && (h.family = i), f.isSome(n) && (h.given = n.map((_) => {
        const T = f.valData(_);
        if (typeof T == "string")
          return T;
        throw new Error(`Expected string, but got: ${JSON.stringify(T)}`);
      })), f.isSome(o) && (h.prefix = o), f.isSome(m) && (h.suffix = m), f.isSome(c) && (h.text = c), f.isSome(d) && (h.use = d), C.makeResNode(
        h,
        null,
        "HumanName",
        null,
        "HumanName"
      );
    }
    /**
     * Creates a ContactPoint.
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {string} system - a string value that goes in ContactPoint.system.
     * @param {string} value - a string value that goes in ContactPoint.value.
     * @param {string} use - a string value that goes in ContactPoint.use.
     * @return {ResourceNode}
     */
    static ContactPoint(t, i, n, o) {
      const m = {};
      return f.isSome(i) && (m.system = i), f.isSome(n) && (m.value = n), f.isSome(o) && (m.use = o), C.makeResNode(
        m,
        null,
        "ContactPoint",
        null,
        "ContactPoint"
      );
    }
    /**
     * Creates an Address
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {ResourceNode[]} lineColl - a collection of string values that goes
     *  in Address.line.
     * @param {string} city - a string value that goes in Address.city.
     * @param {string} state - a string value that goes in Address.state.
     * @param {string} postalCode - a string value that goes in Address.postalCode.
     * @param {string} country - a string value that goes in Address.country.
     * @param {string} use - a string value that goes in Address.use.
     * @param {string} type - a string value that goes in Address.type.
     * @return {ResourceNode}
     */
    static Address(t, i, n, o, m, c, d, h) {
      const _ = {};
      return f.isSome(i) && (_.line = i.map((T) => {
        const M = f.valData(T);
        if (typeof M == "string")
          return M;
        throw new Error(`Expected string, but got: ${JSON.stringify(M)}`);
      })), f.isSome(n) && (_.city = n), f.isSome(o) && (_.state = o), f.isSome(m) && (_.postalCode = m), f.isSome(c) && (_.country = c), f.isSome(d) && (_.use = d), f.isSome(h) && (_.type = h), C.makeResNode(
        _,
        null,
        "Address",
        null,
        "Address"
      );
    }
    /**
     * Creates a Quantity.
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {string} system - a string value that goes in Quantity.system.
     * @param {string} code - a string value that goes in Quantity.code.
     * @param {string} value - a string or decimal value that goes in
     *  Quantity.value.
     * @param {string} unit - a string value that goes in Quantity.unit.
     * @return {ResourceNode}
     */
    static Quantity(t, i, n, o, m) {
      const c = {};
      return f.isSome(i) && (c.system = i), f.isSome(n) && (c.code = n), f.isSome(o) && (c.value = Number(o)), f.isSome(m) && (c.unit = m), C.makeResNode(
        c,
        null,
        "Quantity",
        null,
        "Quantity"
      );
    }
    /**
     * Creates a Coding.
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {string} system - a string value that goes in Coding.system.
     * @param {string} code - a string value that goes in Coding.code.
     * @param {string} display - a string value that goes in Coding.display.
     * @param {string} version - a string value that goes in Coding.version.
     * @return {ResourceNode}
     */
    static Coding(t, i, n, o, m) {
      const c = {};
      return f.isSome(i) && (c.system = i), f.isSome(n) && (c.code = n), f.isSome(o) && (c.display = o), f.isSome(m) && (c.version = m), C.makeResNode(
        c,
        null,
        "Coding",
        null,
        "Coding"
      );
    }
    /**
     * Creates a CodeableConcept.
     * @param {Factory[]} self - an array with one element, which is the Factory
     *  class.
     * @param {ResourceNode[]} valueColl - a collection of Coding that goes in
     *  CodeableConcept.coding.
     * @param {string} text - a string value that goes in CodeableConcept.text.
     * @return {ResourceNode}
     */
    static CodeableConcept(t, i, n) {
      const o = (i == null ? void 0 : i.length) > 0 ? {
        coding: i.map((m) => {
          if (m instanceof C && m.getTypeInfo().name === "Coding")
            return f.valData(m);
          throw new Error("Unexpected value " + JSON.stringify(m) + "; expected value of type Coding");
        })
      } : {};
      return f.isSome(n) && (o.text = n), C.makeResNode(
        o,
        null,
        "CodeableConcept",
        null,
        "CodeableConcept"
      );
    }
    /**
     * Create an instance of the named type.
     * @param {Factory[]} self - an array with one element that refers to
     *  the current Factory instance.
     * @param {TypeInfo} typeInfo - a value that is the type to create.
     * @return {ResourceNode}
     */
    static create(t, i) {
      if (i.namespace === y.System)
        throw new Error("%factory.create(type) doesn't support system types.");
      return C.makeResNode(
        null,
        null,
        i.name,
        null,
        i.name
      );
    }
    /**
     * Add an extension, and return the new type.
     * @param {Factory[]} self - an array with one element that refers to
     *  the current Factory instance.
     * @param {ResourceNode[]} instanceColl - a collection that should contain the
     *  instance to which the extension is to be added.
     * @param {string} url - a string value that goes in Extension.url.
     *  specification this could also be an actual ValueSet, but I don't want to
     *  complicate this example.
     * @param {ResourceNode[]} value - the value of the extension.
     * @return {ResourceNode|[]}
     */
    static withExtension(t, i, n, o) {
      var c, d;
      if (i.length > 1)
        throw new Error("Unexpected collection " + JSON.stringify(i) + " as an instance for %factory.withExtension(instance, url, value)");
      if (o.length !== 1) {
        if (o.length > 1)
          throw new Error("Unexpected collection " + JSON.stringify(o) + " as a value for %factory.withExtension(instance, url, value)");
        if (o.length === 0)
          throw new Error("Unexpected empty collection " + JSON.stringify(o) + " as a value for %factory.withExtension(instance, url, value)");
      }
      if (i.length === 0)
        return [];
      const m = i[0];
      if (m instanceof C) {
        let h = m.data, _ = m._data;
        return y.isPrimitive(m.getTypeInfo()) ? _ = {
          ...m._data || {},
          extension: [
            ...((c = m._data) == null ? void 0 : c.extension) || [],
            u.createExtensionObject(n, o[0])
          ]
        } : h = {
          ...m.data || {},
          extension: [
            ...((d = m.data) == null ? void 0 : d.extension) || [],
            u.createExtensionObject(n, o[0])
          ]
        }, C.makeResNode(
          h,
          null,
          m.path,
          _,
          m.fhirNodeDataType
        );
      } else
        throw new Error("Expected a ResourceNode.");
    }
    /**
     * Set a property value, and return the new type.
     * @param {Factory[]} self - an array with one element that refers to
     *  the current Factory instance.
     * @param {ResourceNode[]} instanceColl - a collection that should contain the
     *  instance to set the property on.
     * @param {string} name - a string value that identifies the property to set.
     * @param {string} value - the value of the property
     * @return {ResourceNode|*[]}
     */
    static withProperty(t, i, n, o) {
      var c, d;
      if (i.length > 1)
        throw new Error("Unexpected collection " + JSON.stringify(i) + " as an instance for %factory.withProperty(instance, name, value)");
      if (o.length !== 1) {
        if (o.length > 1)
          throw new Error("Unexpected collection " + JSON.stringify(o) + " as a value for %factory.withProperty(instance, name, value)");
        if (o.length === 0)
          throw new Error("Unexpected empty collection " + JSON.stringify(o) + " as a value for %factory.withProperty(instance, name, value)");
      }
      if (i.length === 0)
        return [];
      const m = i[0];
      if (m instanceof C) {
        let h = m.data, _ = m._data;
        return y.isPrimitive(m.getTypeInfo()) ? _ = {
          ...m._data || {},
          [n]: f.valData(o[0]),
          ...(c = o[0]) != null && c._data ? { ["_" + n]: o[0]._data } : {}
        } : h = {
          ...m.data || {},
          [n]: f.valData(o[0]),
          ...(d = o[0]) != null && d._data ? { ["_" + n]: o[0]._data } : {}
        }, C.makeResNode(
          h,
          null,
          m.path,
          _,
          m.fhirNodeDataType
        );
      } else
        throw new Error("Expected a ResourceNode.");
    }
  };
  // Same as fhirpath.invocationTable, but for %factory methods
  se(u, "invocationTable", {
    Extension: { fn: u.Extension, arity: { 2: ["String", "AnyAtRoot"] } },
    Identifier: {
      fn: u.Identifier,
      arity: {
        1: ["String"],
        2: ["String", "String"],
        3: ["String", "String", "String"],
        4: ["String", "String", "String", "Any"]
      }
    },
    HumanName: {
      fn: u.HumanName,
      arity: {
        1: ["String"],
        2: ["String", "AnyAtRoot"],
        3: ["String", "AnyAtRoot", "String"],
        4: ["String", "AnyAtRoot", "String", "String"],
        5: ["String", "AnyAtRoot", "String", "String", "String"],
        6: ["String", "AnyAtRoot", "String", "String", "String", "String"]
      }
    },
    ContactPoint: {
      fn: u.ContactPoint,
      arity: {
        1: ["String"],
        2: ["String", "String"],
        3: ["String", "String", "String"]
      }
    },
    Address: {
      fn: u.Address,
      arity: {
        1: ["AnyAtRoot"],
        2: ["AnyAtRoot", "String"],
        3: ["AnyAtRoot", "String", "String"],
        4: ["AnyAtRoot", "String", "String", "String"],
        5: ["AnyAtRoot", "String", "String", "String", "String"],
        6: ["AnyAtRoot", "String", "String", "String", "String", "String"],
        7: ["AnyAtRoot", "String", "String", "String", "String", "String", "String"]
      }
    },
    Quantity: {
      fn: u.Quantity,
      arity: {
        1: ["String"],
        2: ["String", "String"],
        3: ["String", "String", "StringOrNumber"],
        4: ["String", "String", "StringOrNumber", "String"]
      }
    },
    Coding: {
      fn: u.Coding,
      arity: {
        1: ["String"],
        2: ["String", "String"],
        3: ["String", "String", "String"],
        4: ["String", "String", "String", "String"]
      }
    },
    CodeableConcept: {
      fn: u.CodeableConcept,
      arity: {
        1: ["AnyAtRoot"],
        2: ["AnyAtRoot", "String"]
      }
    },
    create: {
      fn: u.create,
      arity: {
        1: ["TypeSpecifier"]
      }
    },
    withExtension: {
      fn: u.withExtension,
      arity: {
        3: ["AnyAtRoot", "String", "AnyAtRoot"]
      }
    },
    withProperty: {
      fn: u.withProperty,
      arity: {
        3: ["AnyAtRoot", "String", "AnyAtRoot"]
      }
    }
  }), [
    {
      type: "string",
      getValue: function(t) {
        if (typeof t == "string" && /^[\s\S]+$/.test(t))
          return String(t);
        throw new Error(`"${t}" is not a string.`);
      }
    },
    {
      type: "integer",
      getValue: (t) => {
        const i = Number(t);
        if (Number.isInteger(i))
          return i;
        throw new Error(`"${t}" is not an integer.`);
      }
    },
    {
      type: "unsignedInt",
      getValue: (t) => {
        const i = Number(t);
        if (Number.isInteger(i) && i >= 0)
          return i;
        throw new Error(`"${t}" is not an unsignedInt.`);
      }
    },
    {
      type: "positiveInt",
      getValue: (t) => {
        const i = Number(t);
        if (Number.isInteger(i) && i > 0)
          return i;
        throw new Error(`"${t}" is not a positiveInt.`);
      }
    },
    {
      type: "integer64",
      getValue: (t) => {
        const i = Number(t);
        if (Number.isInteger(i))
          return i;
        throw new Error(`"${t}" is not an integer.`);
      }
    },
    {
      type: "markdown",
      getValue(t) {
        if (typeof t == "string" && /^[\s\S]+$/.test(t))
          return t;
        throw new Error(`"${t}" is not a markdown.`);
      }
    },
    {
      type: "url",
      getValue(t) {
        if (typeof t == "string" && /^\S*$/.test(t))
          return t;
        throw new Error(`"${t}" is not a url.`);
      }
    },
    {
      type: "uri",
      getValue(t) {
        if (typeof t == "string" && /^\S*$/.test(t))
          return t;
        throw new Error(`"${t}" is not a uri.`);
      }
    },
    {
      type: "instant",
      getValue(t) {
        if (typeof t == "string" && p.test(t))
          return t;
        throw new Error(`"${t}" is not an instant.`);
      }
    },
    {
      type: "time",
      getValue(t) {
        if (typeof t == "string" && l.test(t))
          return t;
        throw new Error(`"${t}" is not a time.`);
      }
    },
    {
      type: "date",
      getValue(t) {
        if (typeof t == "string" && r.test(t))
          return t;
        throw new Error(`"${t}" is not a date.`);
      }
    },
    {
      type: "dateTime",
      getValue(t) {
        if (typeof t == "string" && e.test(t))
          return t;
        throw new Error(`"${t}" is not a dateTime.`);
      }
    },
    {
      type: "base64Binary",
      getValue(t) {
        if (typeof t == "string" && /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t))
          return t;
        throw new Error(`"${t}" is not a base64Binary.`);
      }
    },
    {
      type: "decimal",
      getValue(t) {
        const i = Number(t);
        if (Number.isNaN(i))
          throw new Error(`"${t}" is not an decimal.`);
        return i;
      }
    },
    {
      type: "boolean",
      getValue(t) {
        if (t === !0 || t === "true")
          return !0;
        if (t === !1 || t === "false")
          return !1;
        throw new Error(`"${t}" is not a boolean.`);
      }
    },
    {
      type: "code",
      getValue(t) {
        if (typeof t == "string" && /^\S+( \S+)*$/.test(t))
          return t;
        throw new Error(`"${t}" is not a code.`);
      }
    },
    {
      type: "id",
      getValue(t) {
        if (typeof t == "string" && /^[A-Za-z0-9\-.]{1,64}$/.test(t))
          return t;
        throw new Error(`"${t}" is not an id.`);
      }
    },
    {
      type: "oid",
      getValue(t) {
        if (typeof t == "string" && /^urn:oid:[0-2](\.(0|[1-9][0-9]*))+$/.test(t))
          return t;
        throw new Error(`"${t}" is not an oid.`);
      }
    },
    {
      type: "uuid",
      getValue(t) {
        if (typeof t == "string" && /^urn:uuid:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(t))
          return t;
        throw new Error(`"${t}" is not an uuid.`);
      }
    },
    {
      type: "canonical",
      getValue(t) {
        if (typeof t == "string" && /^\S*$/.test(t))
          return t;
        throw new Error(`"${t}" is not an canonical.`);
      }
    }
  ].forEach(({ type: t, getValue: i }) => {
    u[t] = function(n, o, m) {
      let c;
      if (o.length > 1)
        throw new Error("Unexpected collection " + JSON.stringify(o) + ` as a value for %factory.${t}(value, extensions)`);
      if (o.length === 0)
        c = null;
      else {
        const h = f.valData(o[0]);
        if (h == null && (c = null), typeof h != "object")
          c = i(h);
        else
          throw new Error(`"${h}" is not a ${t}`);
      }
      let d = null;
      return (m == null ? void 0 : m.length) > 0 && (d = {
        extension: m.map((h) => {
          const _ = y.fromValue(h);
          if (y.isType(_.name, "Extension"))
            return f.valData(h);
          throw new Error(`Expected "FHIR.Extension", got "${_}"`);
        })
      }), C.makeResNode(c, null, t, d, t);
    }, u.invocationTable[t] = {
      fn: u[t],
      arity: { 1: ["AnyAtRoot"], 2: ["AnyAtRoot", "Any"] }
    };
  });
  let a = u;
  return vn = a, vn;
}
var In, k0;
function fi() {
  if (k0) return In;
  k0 = 1;
  const { version: f } = gs, C = ws(), y = he();
  Xs();
  const p = X0();
  let l = {}, r = ei(), e = wn(), a = ti(), u = ni(), s = li(), t = kn(), i = ts(), n = si(), o = es(), m = ii(), c = ri(), d = ui(), h = ai(), _ = oi();
  const T = ye(), {
    FP_Date: M,
    FP_DateTime: P,
    FP_Time: q,
    FP_Quantity: z,
    FP_Type: W,
    ResourceNode: Y,
    TypeInfo: w
  } = T;
  let v = Y.makeResNode;
  const U = ns(), I = ci();
  l.invocationTable = {
    memberOf: { fn: h.memberOf, arity: { 1: ["String"] } },
    empty: { fn: r.emptyFn },
    not: { fn: r.notFn },
    exists: { fn: r.existsMacro, arity: { 0: [], 1: ["Expr"] } },
    all: { fn: r.allMacro, arity: { 1: ["Expr"] } },
    allTrue: { fn: r.allTrueFn },
    anyTrue: { fn: r.anyTrueFn },
    allFalse: { fn: r.allFalseFn },
    anyFalse: { fn: r.anyFalseFn },
    subsetOf: { fn: r.subsetOfFn, arity: { 1: ["AnyAtRoot"] } },
    supersetOf: { fn: r.supersetOfFn, arity: { 1: ["AnyAtRoot"] } },
    isDistinct: { fn: r.isDistinctFn },
    distinct: { fn: e.distinctFn },
    count: { fn: a.countFn },
    where: { fn: e.whereMacro, arity: { 1: ["Expr"] } },
    extension: { fn: e.extension, arity: { 1: ["String"] } },
    select: { fn: e.selectMacro, arity: { 1: ["Expr"] } },
    aggregate: { fn: a.aggregateMacro, arity: { 1: ["Expr"], 2: ["Expr", "AnyAtRoot"] } },
    sum: { fn: a.sumFn },
    min: { fn: a.minFn },
    max: { fn: a.maxFn },
    avg: { fn: a.avgFn },
    weight: { fn: u.weight },
    ordinal: { fn: u.weight },
    single: { fn: e.singleFn },
    first: { fn: e.firstFn },
    last: { fn: e.lastFn },
    type: { fn: T.typeFn, arity: { 0: [] } },
    ofType: { fn: e.ofTypeFn, arity: { 1: ["TypeSpecifier"] } },
    is: { fn: T.isFn, arity: { 1: ["TypeSpecifier"] } },
    as: { fn: T.asFn, arity: { 1: ["TypeSpecifier"] } },
    tail: { fn: e.tailFn },
    take: { fn: e.takeFn, arity: { 1: ["Integer"] } },
    skip: { fn: e.skipFn, arity: { 1: ["Integer"] } },
    combine: { fn: s.combineFn, arity: { 1: ["AnyAtRoot"] } },
    union: { fn: s.union, arity: { 1: ["AnyAtRoot"] } },
    intersect: { fn: s.intersect, arity: { 1: ["AnyAtRoot"] } },
    exclude: { fn: s.exclude, arity: { 1: ["AnyAtRoot"] } },
    iif: { fn: t.iifMacro, arity: { 2: ["Expr", "Expr"], 3: ["Expr", "Expr", "Expr"] } },
    trace: { fn: t.traceFn, arity: { 1: ["String"], 2: ["String", "Expr"] } },
    defineVariable: { fn: t.defineVariable, arity: { 1: ["String"], 2: ["String", "Expr"] } },
    toInteger: { fn: t.toInteger },
    toDecimal: { fn: t.toDecimal },
    toString: { fn: t.toString },
    toDate: { fn: t.toDate },
    toDateTime: { fn: t.toDateTime },
    toTime: { fn: t.toTime },
    toBoolean: { fn: t.toBoolean },
    toQuantity: { fn: t.toQuantity, arity: { 0: [], 1: ["String"] } },
    hasValue: { fn: t.hasValueFn },
    getValue: { fn: t.getValueFn },
    convertsToBoolean: { fn: t.createConvertsToFn(t.toBoolean, "boolean") },
    convertsToInteger: { fn: t.createConvertsToFn(t.toInteger, "number") },
    convertsToDecimal: { fn: t.createConvertsToFn(t.toDecimal, "number") },
    convertsToString: { fn: t.createConvertsToFn(t.toString, "string") },
    convertsToDate: { fn: t.createConvertsToFn(t.toDate, M) },
    convertsToDateTime: { fn: t.createConvertsToFn(t.toDateTime, P) },
    convertsToTime: { fn: t.createConvertsToFn(t.toTime, q) },
    convertsToQuantity: { fn: t.createConvertsToFn(t.toQuantity, z) },
    indexOf: { fn: m.indexOf, arity: { 1: ["String"] } },
    substring: { fn: m.substring, arity: { 1: ["Integer"], 2: ["Integer", "Integer"] } },
    startsWith: { fn: m.startsWith, arity: { 1: ["String"] } },
    endsWith: { fn: m.endsWith, arity: { 1: ["String"] } },
    contains: { fn: m.containsFn, arity: { 1: ["String"] } },
    upper: { fn: m.upper },
    lower: { fn: m.lower },
    replace: { fn: m.replace, arity: { 2: ["String", "String"] } },
    matches: { fn: m.matches, arity: { 1: ["String"] } },
    replaceMatches: { fn: m.replaceMatches, arity: { 2: ["String", "String"] } },
    length: { fn: m.length },
    toChars: { fn: m.toChars },
    join: { fn: m.joinFn, arity: { 0: [], 1: ["String"] } },
    split: { fn: m.splitFn, arity: { 1: ["String"] } },
    trim: { fn: m.trimFn },
    encode: { fn: m.encodeFn, arity: { 1: ["String"] } },
    decode: { fn: m.decodeFn, arity: { 1: ["String"] } },
    abs: { fn: o.abs },
    ceiling: { fn: o.ceiling },
    exp: { fn: o.exp },
    floor: { fn: o.floor },
    ln: { fn: o.ln },
    log: { fn: o.log, arity: { 1: ["Number"] }, nullable: !0 },
    power: { fn: o.power, arity: { 1: ["Number"] }, nullable: !0 },
    round: { fn: o.round, arity: { 0: [], 1: ["Number"] } },
    sqrt: { fn: o.sqrt },
    truncate: { fn: o.truncate },
    now: { fn: d.now },
    today: { fn: d.today },
    timeOfDay: { fn: d.timeOfDay },
    repeat: { fn: e.repeatMacro, arity: { 1: ["Expr"] } },
    children: { fn: c.children },
    descendants: { fn: c.descendants },
    "|": { fn: s.union, arity: { 2: ["Any", "Any"] } },
    "=": { fn: i.equal, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    "!=": { fn: i.unequal, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    "~": { fn: i.equival, arity: { 2: ["Any", "Any"] } },
    "!~": { fn: i.unequival, arity: { 2: ["Any", "Any"] } },
    "<": { fn: i.lt, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    ">": { fn: i.gt, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    "<=": { fn: i.lte, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    ">=": { fn: i.gte, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    containsOp: { fn: n.contains, arity: { 2: ["Any", "Any"] } },
    inOp: { fn: n.in, arity: { 2: ["Any", "Any"] } },
    isOp: { fn: T.isFn, arity: { 2: ["Any", "TypeSpecifier"] } },
    asOp: { fn: T.asFn, arity: { 2: ["Any", "TypeSpecifier"] } },
    "&": { fn: o.amp, arity: { 2: ["String", "String"] } },
    "+": { fn: o.plus, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    "-": { fn: o.minus, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    "*": { fn: o.mul, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    "/": { fn: o.div, arity: { 2: ["Any", "Any"] }, nullable: !0 },
    mod: { fn: o.mod, arity: { 2: ["Number", "Number"] }, nullable: !0 },
    div: { fn: o.intdiv, arity: { 2: ["Number", "Number"] }, nullable: !0 },
    or: { fn: _.orOp, arity: { 2: [["Boolean"], ["Boolean"]] } },
    and: { fn: _.andOp, arity: { 2: [["Boolean"], ["Boolean"]] } },
    xor: { fn: _.xorOp, arity: { 2: [["Boolean"], ["Boolean"]] } },
    implies: { fn: _.impliesOp, arity: { 2: [["Boolean"], ["Boolean"]] } }
  }, l.InvocationExpression = function(k, G, D) {
    return D.children.reduce(function(B, K) {
      return l.doEval(k, B, K);
    }, G);
  }, l.TermExpression = function(k, G, D) {
    return G && (G = G.map((B) => B instanceof Object && B.resourceType ? v(B, null, B.resourceType, null, B.resourceType) : B)), l.doEval(k, G, D.children[0]);
  }, l.PolarityExpression = function(k, G, D) {
    var B = D.terminalNodeText[0], K = l.doEval(k, G, D.children[0]);
    if (K.length !== 1)
      throw new Error("Unary " + B + " can only be applied to an individual number or Quantity.");
    if (K[0] instanceof z)
      B === "-" && (K[0] = new z(-K[0].value, K[0].unit));
    else if (typeof K[0] == "number" && !isNaN(K[0]))
      B === "-" && (K[0] = -K[0]);
    else
      throw new Error("Unary " + B + " can only be applied to a number or Quantity.");
    return K;
  }, l.TypeSpecifier = function(k, G, D) {
    let B, K;
    const H = D.text.split(".").map((A) => A.replace(/(^`|`$)/g, ""));
    switch (H.length) {
      case 2:
        [B, K] = H;
        break;
      case 1:
        [K] = H;
        break;
      default:
        throw new Error("Expected TypeSpecifier node, got " + JSON.stringify(D));
    }
    const J = new w({ namespace: B, name: K });
    if (!J.isValid())
      throw new Error('"' + J + '" cannot be resolved to a valid type identifier');
    return J;
  }, l.ExternalConstantTerm = function(k, G, D) {
    let B;
    const K = D.children[0];
    K.terminalNodeText.length === 2 ? B = S(K.terminalNodeText[1]) : B = b(K.children[0].text);
    let H;
    if (B in k.vars && !k.processedUserVarNames.has(B))
      H = k.vars[B], Array.isArray(H) ? H = H.map(
        (J) => J != null && J.__path__ ? v(
          J,
          J.__path__.parentResNode,
          J.__path__.path,
          null,
          J.__path__.fhirNodeDataType
        ) : J != null && J.resourceType ? v(J, null, null, null) : J
      ) : H = H != null && H.__path__ ? v(
        H,
        H.__path__.parentResNode,
        H.__path__.path,
        null,
        H.__path__.fhirNodeDataType
      ) : H != null && H.resourceType ? v(H, null, null, null) : H, k.processedVars[B] = H, k.processedUserVarNames.add(B);
    else if (B in k.processedVars)
      H = k.processedVars[B];
    else if (k.definedVars && B in k.definedVars)
      H = k.definedVars[B];
    else
      throw new Error(
        "Attempting to access an undefined environment variable: " + B
      );
    return H == null ? [] : H instanceof Array ? H : [H];
  }, l.LiteralTerm = function(k, G, D) {
    var B = D.children[0];
    return B ? l.doEval(k, G, B) : [D.text];
  }, l.StringLiteral = function(k, G, D) {
    return [S(D.text)];
  };
  function S(k) {
    return k.replace(/(^'|'$)/g, "").replace(/\\(u\d{4}|.)/g, function(G, D) {
      switch (G) {
        case "\\r":
          return "\r";
        case "\\n":
          return `
`;
        case "\\t":
          return "	";
        case "\\f":
          return "\f";
        default:
          return D.length > 1 ? String.fromCharCode("0x" + D.slice(1)) : D;
      }
    });
  }
  l.BooleanLiteral = function(k, G, D) {
    return D.text === "true" ? [!0] : [!1];
  }, l.QuantityLiteral = function(k, G, D) {
    var B = D.children[0], K = Number(B.terminalNodeText[0]), H = B.children[0], J = H.terminalNodeText[0];
    return !J && H.children && (J = H.children[0].terminalNodeText[0]), [new z(K, J)];
  }, l.DateTimeLiteral = function(k, G, D) {
    var B = D.text.slice(1);
    return [new P(B)];
  }, l.TimeLiteral = function(k, G, D) {
    var B = D.text.slice(1);
    return [new q(B)];
  }, l.NumberLiteral = function(k, G, D) {
    return [Number(D.text)];
  }, l.Identifier = function(k, G, D) {
    return [b(D.text)];
  };
  function b(k) {
    return k.replace(/(^`|`$)/g, "");
  }
  l.InvocationTerm = function(k, G, D) {
    return l.doEval(k, G, D.children[0]);
  }, l.MemberInvocation = function(k, G, D) {
    const B = l.doEval(k, G, D.children[0])[0], K = k.model;
    return G ? G.reduce(function(H, J) {
      var A, R, x;
      return J = v(
        J,
        null,
        (A = J.__path__) == null ? void 0 : A.path,
        null,
        (R = J.__path__) == null ? void 0 : R.fhirNodeDataType
      ), ((x = J.data) == null ? void 0 : x.resourceType) === B ? H.push(J) : y.pushFn(H, y.makeChildResNodes(J, B, K)), H;
    }, []) : [];
  }, l.IndexerExpression = function(k, G, D) {
    const B = D.children[0], K = D.children[1];
    var H = l.doEval(k, G, B), J = l.doEval(k, G, K);
    if (y.isEmpty(J))
      return [];
    var A = parseInt(J[0]);
    return H && y.isSome(A) && H.length > A && A >= 0 ? [H[A]] : [];
  }, l.Functn = function(k, G, D) {
    return D.children.map(function(B) {
      return l.doEval(k, G, B);
    });
  }, l.realizeParams = function(k, G, D) {
    return D && D[0] && D[0].children ? D[0].children.map(function(B) {
      return l.doEval(k, G, B);
    }) : [];
  };
  function E(k, G, D, B) {
    if (D === "Expr")
      return function(H) {
        const J = y.arraify(H);
        let A = { ...k, $this: J };
        return k.definedVars && (A.definedVars = { ...k.definedVars }), l.doEval(A, J, B);
      };
    if (D === "AnyAtRoot") {
      const H = k.$this || k.dataRoot;
      let J = { ...k, $this: H };
      return k.definedVars && (J.definedVars = { ...k.definedVars }), l.doEval(J, H, B);
    }
    if (D === "Identifier") {
      if (B.type === "TermExpression")
        return B.text;
      throw new Error("Expected identifier node, got " + JSON.stringify(B));
    }
    if (D === "TypeSpecifier")
      return l.TypeSpecifier(k, G, B);
    let K;
    if (D === "AnySingletonAtRoot") {
      const H = k.$this || k.dataRoot;
      let J = { ...k, $this: H };
      k.definedVars && (J.definedVars = { ...k.definedVars }), K = l.doEval(J, H, B);
    } else {
      let H = { ...k };
      if (k.definedVars && (H.definedVars = { ...k.definedVars }), K = l.doEval(H, G, B), D === "Any")
        return K;
      if (Array.isArray(D)) {
        if (K.length === 0)
          return [];
        D = D[0];
      }
    }
    return K instanceof Promise ? K.then((H) => t.singleton(H, D)) : t.singleton(K, D);
  }
  function N(k, G, D, B) {
    var L, O;
    var K = k.userInvocationTable && Object.prototype.hasOwnProperty.call(k.userInvocationTable, G) && ((L = k.userInvocationTable) == null ? void 0 : L[G]) || l.invocationTable[G] || D.length === 1 && ((O = D[0]) == null ? void 0 : O.invocationTable[G]), H;
    if (K)
      if (K.arity) {
        var J = B ? B.length : 0, A = K.arity[J];
        if (A) {
          for (var R = [], x = 0; x < J; x++) {
            var V = A[x], g = B[x];
            R.push(E(k, D, V, g));
          }
          return R.unshift(D), K.nullable && R.some(F) ? [] : R.some((Z) => Z instanceof Promise) ? Promise.all(R).then((Z) => (H = K.fn.apply(k, Z), y.resolveAndArraify(H))) : (H = K.fn.apply(k, R), y.resolveAndArraify(H));
        } else
          return console.log(G + " wrong arity: got " + J), [];
      } else {
        if (B)
          throw new Error(G + " expects no params");
        return H = K.fn.call(k, D), y.resolveAndArraify(H);
      }
    else
      throw new Error("Not implemented: " + G);
  }
  function F(k) {
    return k == null || y.isEmpty(k);
  }
  function j(k, G, D, B) {
    var K = l.invocationTable[G];
    if (K && K.fn) {
      var H = B ? B.length : 0;
      if (H !== 2)
        throw new Error("Infix invoke should have arity 2");
      var J = K.arity[H];
      if (J) {
        for (var A = [], R = 0; R < H; R++) {
          var x = J[R], V = B[R];
          A.push(E(k, D, x, V));
        }
        if (K.nullable && A.some(F))
          return [];
        if (A.some((L) => L instanceof Promise))
          return Promise.all(A).then((L) => {
            var O = K.fn.apply(k, L);
            return y.arraify(O);
          });
        var g = K.fn.apply(k, A);
        return y.arraify(g);
      } else
        return console.log(G + " wrong arity: got " + H), [];
    } else
      throw new Error("Not impl " + G);
  }
  l.FunctionInvocation = function(k, G, D) {
    var B = l.doEval(k, G, D.children[0]);
    const K = B[0];
    B.shift();
    var H = B && B[0] && B[0].children;
    return N(k, K, G, H);
  }, l.ParamList = function(k, G, D) {
    return D;
  }, l.UnionExpression = function(k, G, D) {
    return j(k, "|", G, D.children);
  }, l.ThisInvocation = function(k) {
    return k.$this;
  }, l.TotalInvocation = function(k) {
    return y.arraify(k.$total);
  }, l.IndexInvocation = function(k) {
    return y.arraify(k.$index);
  }, l.OpExpression = function(k, G, D) {
    var B = D.terminalNodeText[0];
    return j(k, B, G, D.children);
  }, l.AliasOpExpression = function(k) {
    return function(G, D, B) {
      var K = B.terminalNodeText[0], H = k[K];
      if (!H)
        throw new Error("Do not know how to alias " + K + " by " + JSON.stringify(k));
      return j(G, H, D, B.children);
    };
  }, l.NullLiteral = function() {
    return [];
  }, l.ParenthesizedTerm = function(k, G, D) {
    return l.doEval(k, G, D.children[0]);
  }, l.evalTable = {
    // not every evaluator is listed if they are defined on engine
    BooleanLiteral: l.BooleanLiteral,
    EqualityExpression: l.OpExpression,
    FunctionInvocation: l.FunctionInvocation,
    Functn: l.Functn,
    Identifier: l.Identifier,
    IndexerExpression: l.IndexerExpression,
    InequalityExpression: l.OpExpression,
    InvocationExpression: l.InvocationExpression,
    AdditiveExpression: l.OpExpression,
    MultiplicativeExpression: l.OpExpression,
    TypeExpression: l.AliasOpExpression({ is: "isOp", as: "asOp" }),
    MembershipExpression: l.AliasOpExpression({ contains: "containsOp", in: "inOp" }),
    NullLiteral: l.NullLiteral,
    EntireExpression: l.InvocationTerm,
    InvocationTerm: l.InvocationTerm,
    LiteralTerm: l.LiteralTerm,
    MemberInvocation: l.MemberInvocation,
    NumberLiteral: l.NumberLiteral,
    ParamList: l.ParamList,
    ParenthesizedTerm: l.ParenthesizedTerm,
    StringLiteral: l.StringLiteral,
    TermExpression: l.TermExpression,
    ThisInvocation: l.ThisInvocation,
    TotalInvocation: l.TotalInvocation,
    IndexInvocation: l.IndexInvocation,
    UnionExpression: l.UnionExpression,
    OrExpression: l.OpExpression,
    ImpliesExpression: l.OpExpression,
    AndExpression: l.OpExpression,
    XorExpression: l.OpExpression
  }, l.doEval = function(k, G, D) {
    return G instanceof Promise ? G.then((B) => l.doEvalSync(k, B, D)) : l.doEvalSync(k, G, D);
  }, l.doEvalSync = function(k, G, D) {
    const B = l.evalTable[D.type] || l[D.type];
    if (B)
      return B.call(l, k, G, D);
    throw new Error("No " + D.type + " evaluator ");
  };
  function $(k) {
    return C.parse(k);
  }
  function Q(k, G, D, B, K) {
    p.reset();
    let H = y.arraify(k).map(
      (R) => R != null && R.__path__ ? v(
        R,
        R.__path__.parentResNode,
        R.__path__.path,
        null,
        R.__path__.fhirNodeDataType
      ) : R != null && R.resourceType ? v(R, null, null, null) : R
    ), J = {
      dataRoot: H,
      processedVars: {
        ucum: "http://unitsofmeasure.org",
        context: H
      },
      processedUserVarNames: /* @__PURE__ */ new Set(),
      vars: D || {},
      model: B
    };
    K.traceFn && (J.customTraceFn = K.traceFn), K.userInvocationTable && (J.userInvocationTable = K.userInvocationTable), J.defaultScoreExts = [
      "http://hl7.org/fhir/StructureDefinition/ordinalValue",
      "http://hl7.org/fhir/StructureDefinition/itemWeight",
      "http://hl7.org/fhir/StructureDefinition/questionnaire-ordinalValue"
    ], K.async && (J.async = K.async), K.terminologyUrl && (J.processedVars.terminologies = new U(K.terminologyUrl)), J.processedVars.factory = I;
    const A = l.doEval(J, H, G.children[0]);
    return A instanceof Promise ? A.then((R) => X(R, K)) : K.async === "always" ? Promise.resolve(X(A, K)) : X(A, K);
  }
  function X(k, G) {
    return k.reduce((D, B) => {
      let K, H, J;
      return B instanceof Y && (K = B.path, H = B.fhirNodeDataType, J = B.parentResNode), B = y.valData(B), B instanceof W && G.resolveInternalTypes && (B = B.toString()), B != null && (K && typeof B == "object" && !B.__path__ && Object.defineProperty(B, "__path__", { value: { path: K, fhirNodeDataType: H, parentResNode: J } }), D.push(B)), D;
    }, []);
  }
  function ee(k) {
    if (Array.isArray(k))
      for (let G = 0, D = k.length; G < D; ++G)
        k[G] = ee(k[G]);
    else if (k instanceof W)
      k = k.toString();
    else if (typeof k == "object")
      for (let G of Object.keys(k))
        k[G] = ee(k[G]);
    return k;
  }
  function le(k, G, D, B, K) {
    return ae(G, B, K)(k, D);
  }
  function ae(k, G, D) {
    D = {
      resolveInternalTypes: !0,
      ...D
    };
    const B = D.userInvocationTable;
    if (B && (D.userInvocationTable = Object.keys(B).reduce(
      (K, H) => (B[H].internalStructures ? K[H] = B[H] : K[H] = {
        ...B[H],
        fn: (...J) => B[H].fn.apply(
          // When we check Array.isArray(arg), we are checking if the
          // singleton function has been called. An alternative to this is
          // to check that the type of the argument is Integer, Boolean,
          // Number, or String.
          this,
          J.map((A) => Array.isArray(A) ? A.map((R) => y.valData(R)) : A)
        )
      }, K),
      {}
    )), typeof k == "object") {
      const K = $(k.expression);
      return function(H, J) {
        if (k.base) {
          let A = G.pathsDefinedElsewhere[k.base] || k.base;
          const R = G && G.path2Type[A];
          A = R === "BackboneElement" || R === "Element" ? A : R || A, H = v(H, null, A, null, R);
        }
        return w.model = G, Q(H, K, J, G, D);
      };
    } else {
      const K = $(k);
      return function(H, J) {
        return w.model = G, Q(H, K, J, G, D);
      };
    }
  }
  function ce(k) {
    return y.arraify(k).map((G) => {
      var B, K, H;
      const D = w.fromValue(
        G != null && G.__path__ ? new Y(
          G,
          (B = G.__path__) == null ? void 0 : B.parentResNode,
          (K = G.__path__) == null ? void 0 : K.path,
          null,
          (H = G.__path__) == null ? void 0 : H.fhirNodeDataType
        ) : G
      );
      return `${D.namespace}.${D.name}`;
    });
  }
  return In = {
    version: f,
    parse: $,
    compile: ae,
    evaluate: le,
    resolveInternalTypes: ee,
    types: ce,
    // Might as well export the UCUM library, since we are using it.
    ucumUtils: On().UcumLhcUtils.getInstance(),
    // Utility functions that can be used to implement custom functions
    util: y
  }, In;
}
var ls = fi();
function mi(f) {
  return ms(f).pipe(
    Le(void 0, () => "UNKNOWN"),
    Le("http://loinc.org", () => "LOINC"),
    Le("http://snomed.info/sct", () => "SCT"),
    Le("http://www.ama-assn.org/go/cpt", () => "CPT"),
    Le("http://hl7.org/fhir/sid/icd-10", () => "ICD10"),
    Le("http://hl7.org/fhir/sid/icd-9", () => "ICD9"),
    Le(
      "http://www.nlm.nih.gov/research/umls/rxnorm",
      () => "RXNORM"
    ),
    // Match.when((cs) => cs.startsWith("http://hl7.org/fhir/sid/icd"), () => "ICD"),
    Le(
      (C) => C.startsWith("http://terminology.hl7.org"),
      () => "FHIR"
    ),
    hs((C) => (console.error(`I don't know this code system ${C}`), "UNKNOWN"))
  );
}
function hi({ reference: f }) {
  if (f === void 0)
    return null;
  if (f.startsWith("urn"))
    return f.slice(9);
  const C = f.split("/");
  return C.length === 2 ? C[1] : null;
}
const ss = {
  getResourceKey: {
    fn: (f) => f.map((C) => C.id),
    arity: { 0: [] }
  },
  getReferenceKey: {
    fn: (f, C) => f.map((y) => hi(y)),
    arity: { 0: [], 1: ["String"] }
  },
  code: {
    fn: (f) => f.flatMap((C) => {
      var y;
      return (y = C.coding) == null ? void 0 : y.map(
        (p) => `${mi(p.system)}#${p.code ?? "NOCODE"}`
      );
    }),
    arity: { 0: [] }
  }
}, di = (f, C) => ls.evaluate(f, C, void 0, void 0, {
  userInvocationTable: ss,
  async: !1
});
function is(f, C, y) {
  const p = (l, r) => cs(l, {
    ForEach: ({ forEach: e, select: a }) => r.flatMap((u) => y(u, e).flatMap(
      (t) => p(et({ select: a }), [t])
    )),
    ForEachOrNull: ({ forEachOrNull: e, select: a }) => r.flatMap((u) => {
      const s = y(u, e);
      return s.length === 0 ? p(et({ select: a }), [{}]) : s.flatMap(
        (t) => p(et({ select: a }), [t])
      );
    }),
    Select: ({ select: e }) => Fn(r, (a) => qn(
      e,
      [],
      (u, s) => {
        const t = p(s, [a]);
        return u.length === 0 ? t : Fn(u, (i) => Pn(t, (n) => ({
          ...i,
          ...n
        })));
      }
    )),
    UnionAll: ({ unionAll: e }) => e.flatMap((a) => p(a, r)),
    Column: ({ column: e }) => Pn(
      r,
      (a) => qn(e, {}, (u, s) => fs(
        y(a, s.path),
        (t) => ds(
          u,
          s.name,
          s.collection ? t : t[0] ?? null
        )
      ))
    )
  });
  return p(f, C);
}
function pi(f, C) {
  let y = C.filter(
    (l) => l.resourceType === f.resource
  );
  if (y.length === 0)
    return [];
  const p = (l, r) => ls.evaluate(l, r, {}, void 0, {
    async: !1,
    userInvocationTable: ss
  });
  for (const { path: l } of f.where ?? [])
    y = os(y, (r) => p(r, `where(${l})`).length > 0);
  return is(f, y, p);
}
const _i = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  evaluateSync: di,
  project: is,
  sof: pi
}, Symbol.toStringTag, { value: "Module" }));
export {
  di as evaluateSync,
  is as project,
  _i as s,
  pi as sof
};
