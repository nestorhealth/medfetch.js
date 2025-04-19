var v = (t) => {
  throw TypeError(t);
};
var g = (t, e, r) => e.has(t) || v("Cannot " + r);
var f = (t, e, r) => (g(t, e, "read from private field"), r ? r.call(t) : e.get(t)), w = (t, e, r) => e.has(t) ? v("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), k = (t, e, r, o) => (g(t, e, "write to private field"), o ? o.call(t, r) : e.set(t, r), r), b = (t, e, r) => (g(t, e, "access private method"), r);
import { Effect as m, Data as S } from "effect";
import "@sqlite.org/sqlite-wasm";
import { MESSAGE_TYPES as x } from "./types.mjs";
var l, a, p, E;
class W {
  constructor() {
    w(this, p);
    w(this, l);
    w(this, a);
    k(this, l, /* @__PURE__ */ new Map()), k(this, a, Object.fromEntries(x.map((e) => [e, 0])));
  }
  /**
   * Increment the counter and get back the message id
   *
   * @param msgType The message type
   * @returns How many times msgType has been called including the ++
   */
  increment(e) {
    const r = f(this, a)[e] = (f(this, a)[e] || 0) + 1;
    return b(this, p, E).call(this, e, r);
  }
  /**
   * Wrap reading from object directly COUNT_MAP[msgType]
   * @param msgType The message type 
   * @returns How many times a request of type msgType has been called by any given promiser
   */
  messageId(e) {
    return b(this, p, E).call(this, e, f(this, a)[e]);
  }
  get(e) {
    return f(this, l).get(e);
  }
  set(e, r) {
    return f(this, l).set(e, r);
  }
}
l = new WeakMap(), a = new WeakMap(), p = new WeakSet(), E = function(e, r) {
  return `${e}#${r}`;
};
function L() {
  return typeof window < "u" && typeof Worker < "u";
}
function $([t, e]) {
  if (!t)
    throw new Error("better-worker1.main.worker1: you passed 0 args lol");
  if (typeof t == "string")
    return e || (e = {}), {
      params: [t, e],
      messageType: t
    };
  if (typeof t == "object") {
    let r;
    return Array.isArray(e) ? r = { transfer: e } : r = e, {
      params: [t],
      transfers: r,
      messageType: t.type
    };
  }
  throw new Error(
    `better-worker1.main.checkArgs: invalid arguments [${t}, ${e}]`
  );
}
function j(t, e) {
  return async function(o, u) {
    const { messageType: s, params: n, transfers: i } = $([o, u]), c = e.increment(s);
    return i && e.set(c, i), t.then((d) => d(...n));
  };
}
function I(t = !1) {
  if (L()) {
    const e = new Worker(
      new URL(
        "worker1.mjs",
        import.meta.url
      ),
      { type: "module" }
    ), r = new W(), o = e.postMessage.bind(e);
    e.postMessage = (n, i) => {
      t && console.log("better-worker1.main.w1thread: sending with ports:", i);
      const c = r.get(r.messageId(n.type));
      return c ? o(n, c) : o(n);
    };
    const u = globalThis.sqlite3Worker1Promiser.v2({ worker: e });
    let s = j(u, r);
    return s.$worker = e, s.lazy = (...n) => m.promise(() => s(...n)), s;
  } else
    return t && console.warn(
      "better-worker1.main.worker1Thread: non-browser environment detected, returning stub function..."
    ), (e, r) => {
    };
}
let _ = null;
function M(t = !1) {
  return _ || (_ = I(t)), _;
}
function q(t) {
  return new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class P extends S.TaggedError("medfetch.sqlite") {
}
let h;
function T() {
  return m.promise(() => new Promise((t, e) => {
    const { port1: r, port2: o } = new MessageChannel(), u = new Worker(
      new URL("../fetch-worker.mjs", import.meta.url),
      { type: "module" }
    ), s = (n) => {
      var i;
      n.data === "fetch-ready" || ((i = n.data) == null ? void 0 : i.type) === "fetch-ready" ? (r.removeEventListener("message", s), t(r)) : (r.removeEventListener("message", s), e(new Error(`Unexpected message: ${JSON.stringify(n.data)}`)));
    };
    r.addEventListener("message", s), r.start(), u.postMessage({
      type: "init"
    }, [o]);
  }));
}
function N(t, { trace: e = !1, filename: r, dbId: o } = {}) {
  if (!L())
    return e && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (s, ...n) => {
    };
  const u = m.gen(function* () {
    if (h)
      return h;
    {
      const s = M();
      if (!o) {
        const { dbId: c } = yield* s.lazy("open", {
          vfs: "opfs",
          filename: r
        });
        o = yield* m.fromNullable(c);
      }
      const n = yield* T(), { result: i } = yield* s.lazy({
        dbId: o,
        type: "load-module",
        args: {
          moduleURL: q().toString(),
          moduleName: "medfetch",
          aux: new TextEncoder().encode(t)
        }
      }, [n]);
      return i.rc !== 0 ? yield* new P({
        message: `medfetch.sqlite: couldn't load in the module at ${q().toString()}`,
        type: "load-module"
      }) : (h = o, h);
    }
  });
  return function(n, ...i) {
    const c = n.reduce((d, y, R) => d + y + (i[R] ?? ""), "");
    return m.gen(function* () {
      const d = yield* u, { result: y } = yield* M().lazy({
        type: "exec",
        dbId: d,
        args: {
          sql: c,
          rowMode: "object"
        }
      });
      return y.resultRows;
    });
  };
}
export {
  N as medfetch,
  I as w1thread,
  M as worker1
};
