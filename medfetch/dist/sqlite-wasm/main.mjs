var y = (r) => {
  throw TypeError(r);
};
var d = (r, e, t) => e.has(r) || y("Cannot " + t);
var f = (r, e, t) => (d(r, e, "read from private field"), t ? t.call(r) : e.get(r)), w = (r, e, t) => e.has(r) ? y("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(r) : e.set(r, t), h = (r, e, t, n) => (d(r, e, "write to private field"), n ? n.call(r, t) : e.set(r, t), t), k = (r, e, t) => (d(r, e, "access private method"), t);
import "@sqlite.org/sqlite-wasm";
import { MESSAGE_TYPES as _ } from "./types.mjs";
import { Effect as $ } from "effect";
var c, i, a, b;
class A {
  constructor() {
    w(this, a);
    w(this, c);
    w(this, i);
    h(this, c, /* @__PURE__ */ new Map()), h(this, i, Object.fromEntries(
      _.map((e) => [e, 0])
    ));
  }
  /**
   * Increment the counter and get back the message id
   *
   * @param msgType The message type
   * @returns How many times msgType has been called including the ++
   */
  increment(e) {
    const t = f(this, i)[e] = (f(this, i)[e] || 0) + 1;
    return k(this, a, b).call(this, e, t);
  }
  /**
   * Wrap reading from object directly COUNT_MAP[msgType]
   * @param msgType The message type
   * @returns How many times a request of type msgType has been called by any given promiser
   */
  messageId(e) {
    return k(this, a, b).call(this, e, f(this, i)[e]);
  }
  get(e) {
    return f(this, c).get(e);
  }
  set(e, t) {
    return f(this, c).set(e, t);
  }
}
c = new WeakMap(), i = new WeakMap(), a = new WeakSet(), b = function(e, t) {
  return `${e}#${t}`;
};
function M() {
  return typeof window < "u" && typeof Worker < "u";
}
function g([r, e]) {
  if (!r)
    throw new Error("better-worker1.main.worker1: you passed 0 args lol");
  if (typeof r == "string")
    return e || (e = {}), {
      params: [r, e],
      messageType: r
    };
  if (typeof r == "object") {
    let t;
    return Array.isArray(e) ? t = { transfer: e } : t = e, {
      params: [r],
      transfers: t,
      messageType: r.type
    };
  }
  throw new Error(
    `better-worker1.main.checkArgs: invalid arguments [${r}, ${e}]`
  );
}
function v(r, e) {
  return async function(n, p) {
    const { messageType: u, params: s, transfers: m } = g([n, p]), l = e.increment(u);
    return m && e.set(l, m), r.then((E) => E(...s));
  };
}
function I(r = !1) {
  if (M()) {
    const e = new Worker(
      new URL(
        "worker1.mjs",
        import.meta.url
      ),
      { type: "module" }
    ), t = new A(), n = e.postMessage.bind(e);
    e.postMessage = (s, m) => {
      r && console.log(
        "better-worker1.main.w1thread: sending with ports:",
        m
      );
      const l = t.get(t.messageId(s.type));
      return l ? n(s, l) : n(s);
    };
    const p = globalThis.sqlite3Worker1Promiser.v2({
      worker: e
    });
    let u = v(p, t);
    return u.$worker = e, u.lazy = (...s) => $.promise(() => u(...s)), u;
  } else
    return r && console.warn(
      "better-worker1.main.worker1Thread: non-browser environment detected, returning stub function..."
    ), (e, t) => {
    };
}
let o = null;
function j(r = !1) {
  return o || (o = I(r)), o;
}
function R() {
  const r = +(o === null);
  return o && o.$worker.terminate(), o = null, r;
}
export {
  M as isBrowser,
  R as kill,
  I as w1thread,
  j as worker1
};
