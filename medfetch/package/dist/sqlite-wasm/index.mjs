var v = (t) => {
  throw TypeError(t);
};
var g = (t, e, r) => e.has(t) || v("Cannot " + r);
var a = (t, e, r) => (g(t, e, "read from private field"), r ? r.call(t) : e.get(t)), w = (t, e, r) => e.has(t) ? v("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), k = (t, e, r, o) => (g(t, e, "write to private field"), o ? o.call(t, r) : e.set(t, r), r), b = (t, e, r) => (g(t, e, "access private method"), r);
import { Effect as d, Data as S } from "effect";
import "@sqlite.org/sqlite-wasm";
import { MESSAGE_TYPES as x } from "./types.mjs";
var f, u, p, E;
class I {
  constructor() {
    w(this, p);
    w(this, f);
    w(this, u);
    k(this, f, /* @__PURE__ */ new Map()), k(this, u, Object.fromEntries(
      x.map((e) => [e, 0])
    ));
  }
  /**
   * Increment the counter and get back the message id
   *
   * @param msgType The message type
   * @returns How many times msgType has been called including the ++
   */
  increment(e) {
    const r = a(this, u)[e] = (a(this, u)[e] || 0) + 1;
    return b(this, p, E).call(this, e, r);
  }
  /**
   * Wrap reading from object directly COUNT_MAP[msgType]
   * @param msgType The message type
   * @returns How many times a request of type msgType has been called by any given promiser
   */
  messageId(e) {
    return b(this, p, E).call(this, e, a(this, u)[e]);
  }
  get(e) {
    return a(this, f).get(e);
  }
  set(e, r) {
    return a(this, f).set(e, r);
  }
}
f = new WeakMap(), u = new WeakMap(), p = new WeakSet(), E = function(e, r) {
  return `${e}#${r}`;
};
function L() {
  return typeof window < "u" && typeof Worker < "u";
}
function W([t, e]) {
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
function $(t, e) {
  return async function(o, l) {
    const { messageType: n, params: s, transfers: i } = W([o, l]), c = e.increment(n);
    return i && e.set(c, i), t.then((m) => m(...s));
  };
}
function j(t = !1) {
  if (L()) {
    const e = new Worker(
      new URL(
        "worker1.mjs",
        import.meta.url
      ),
      { type: "module" }
    ), r = new I(), o = e.postMessage.bind(e);
    e.postMessage = (s, i) => {
      t && console.log(
        "better-worker1.main.w1thread: sending with ports:",
        i
      );
      const c = r.get(r.messageId(s.type));
      return c ? o(s, c) : o(s);
    };
    const l = globalThis.sqlite3Worker1Promiser.v2({
      worker: e
    });
    let n = $(l, r);
    return n.$worker = e, n.lazy = (...s) => d.promise(() => n(...s)), n;
  } else
    return t && console.warn(
      "better-worker1.main.worker1Thread: non-browser environment detected, returning stub function..."
    ), (e, r) => {
    };
}
let _ = null;
function M(t = !1) {
  return _ || (_ = j(t)), _;
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
let y;
function T() {
  return d.promise(
    () => new Promise((t, e) => {
      const { port1: r, port2: o } = new MessageChannel(), l = new Worker(
        new URL(
          "../fetch-worker.mjs",
          import.meta.url
        ),
        { type: "module" }
      ), n = (s) => {
        var i;
        s.data === "fetch-ready" || ((i = s.data) == null ? void 0 : i.type) === "fetch-ready" ? (r.removeEventListener("message", n), t(r)) : (r.removeEventListener("message", n), e(
          new Error(
            `Unexpected message: ${JSON.stringify(s.data)}`
          )
        ));
      };
      r.addEventListener("message", n), r.start(), l.postMessage(
        {
          type: "init"
        },
        [o]
      );
    })
  );
}
function N(t, { trace: e = !1, filename: r, dbId: o } = {}) {
  if (!L())
    return e && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (n, ...s) => {
    };
  const l = d.gen(function* () {
    if (y)
      return y;
    {
      const n = M();
      if (!o)
        if (r) {
          const { dbId: c } = yield* n.lazy("open", {
            vfs: "opfs",
            filename: r
          });
          o = yield* d.fromNullable(c);
        } else {
          const { dbId: c } = yield* n.lazy("open");
          o = yield* d.fromNullable(c);
        }
      const s = yield* T(), { result: i } = yield* n.lazy(
        {
          dbId: o,
          type: "load-module",
          args: {
            moduleURL: q().toString(),
            moduleName: "medfetch",
            aux: new TextEncoder().encode(t)
          }
        },
        [s]
      );
      return i.rc !== 0 ? yield* new P({
        message: `medfetch.sqlite: couldn't load in the module at ${q().toString()}`,
        type: "load-module"
      }) : (y = o, y);
    }
  });
  return function(s, ...i) {
    const c = s.reduce(
      (m, h, R) => m + h + (i[R] ?? ""),
      ""
    );
    return d.gen(function* () {
      const m = yield* l, { result: h } = yield* M().lazy({
        type: "exec",
        dbId: m,
        args: {
          sql: c,
          rowMode: "object"
        }
      });
      return h.resultRows;
    });
  };
}
export {
  N as medfetch,
  j as w1thread,
  M as worker1
};
