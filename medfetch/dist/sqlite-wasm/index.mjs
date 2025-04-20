var E = (t) => {
  throw TypeError(t);
};
var g = (t, e, r) => e.has(t) || E("Cannot " + r);
var d = (t, e, r) => (g(t, e, "read from private field"), r ? r.call(t) : e.get(t)), p = (t, e, r) => e.has(t) ? E("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), k = (t, e, r, s) => (g(t, e, "write to private field"), s ? s.call(t, r) : e.set(t, r), r), b = (t, e, r) => (g(t, e, "access private method"), r);
import { Effect as a, Data as S } from "effect";
import "@sqlite.org/sqlite-wasm";
import { MESSAGE_TYPES as x } from "./types.mjs";
var f, u, w, v;
class I {
  constructor() {
    p(this, w);
    p(this, f);
    p(this, u);
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
    const r = d(this, u)[e] = (d(this, u)[e] || 0) + 1;
    return b(this, w, v).call(this, e, r);
  }
  /**
   * Wrap reading from object directly COUNT_MAP[msgType]
   * @param msgType The message type
   * @returns How many times a request of type msgType has been called by any given promiser
   */
  messageId(e) {
    return b(this, w, v).call(this, e, d(this, u)[e]);
  }
  get(e) {
    return d(this, f).get(e);
  }
  set(e, r) {
    return d(this, f).set(e, r);
  }
}
f = new WeakMap(), u = new WeakMap(), w = new WeakSet(), v = function(e, r) {
  return `${e}#${r}`;
};
function R() {
  return typeof window < "u" && typeof Worker < "u";
}
function U([t, e]) {
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
function W(t, e) {
  return async function(s, l) {
    const { messageType: n, params: o, transfers: i } = U([s, l]), c = e.increment(n);
    return i && e.set(c, i), t.then((m) => m(...o));
  };
}
function $(t = !1) {
  if (R()) {
    const e = new Worker(
      new URL(
        "worker1.mjs",
        import.meta.url
      ),
      { type: "module" }
    ), r = new I(), s = e.postMessage.bind(e);
    e.postMessage = (o, i) => {
      t && console.log(
        "better-worker1.main.w1thread: sending with ports:",
        i
      );
      const c = r.get(r.messageId(o.type));
      return c ? s(o, c) : s(o);
    };
    const l = globalThis.sqlite3Worker1Promiser.v2({
      worker: e
    });
    let n = W(l, r);
    return n.$worker = e, n.lazy = (...o) => a.promise(() => n(...o)), n;
  } else
    return t && console.warn(
      "better-worker1.main.worker1Thread: non-browser environment detected, returning stub function..."
    ), (e, r) => {
    };
}
let _ = null;
function M(t = !1) {
  return _ || (_ = $(t)), _;
}
function L(t) {
  return window === void 0 ? new URL("file:///dev/null") : new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class j extends S.TaggedError("medfetch.sqlite") {
}
let y;
function P() {
  return a.promise(
    () => new Promise((t, e) => {
      const { port1: r, port2: s } = new MessageChannel(), l = new Worker(
        new URL(
          "../fetch-worker.mjs",
          import.meta.url
        ),
        { type: "module" }
      ), n = (o) => {
        var i;
        o.data === "fetch-ready" || ((i = o.data) == null ? void 0 : i.type) === "fetch-ready" ? (r.removeEventListener("message", n), t(r)) : (r.removeEventListener("message", n), e(
          new Error(
            `Unexpected message: ${JSON.stringify(o.data)}`
          )
        ));
      };
      r.addEventListener("message", n), r.start(), l.postMessage(
        {
          type: "init"
        },
        [s]
      );
    })
  );
}
function N(t, { trace: e = !1, filename: r, dbId: s } = {}) {
  if (!R())
    return e && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (n, ...o) => {
    };
  const l = a.gen(function* () {
    if (y)
      return y;
    {
      const n = M();
      if (!s)
        if (r) {
          const { dbId: c } = yield* n.lazy("open", {
            vfs: "opfs",
            filename: r
          });
          s = yield* a.fromNullable(c);
        } else {
          const { dbId: c } = yield* n.lazy("open");
          s = yield* a.fromNullable(c);
        }
      const o = yield* P(), { result: i } = yield* n.lazy(
        {
          dbId: s,
          type: "load-module",
          args: {
            moduleURL: L().toString(),
            moduleName: "medfetch",
            aux: new TextEncoder().encode(t)
          }
        },
        [o]
      );
      return i.rc !== 0 ? yield* new j({
        message: `medfetch.sqlite: couldn't load in the module at ${L().toString()}`,
        type: "load-module"
      }) : (y = s, y);
    }
  });
  return function(o, ...i) {
    const c = o.reduce(
      (m, h, q) => m + h + (i[q] ?? ""),
      ""
    );
    return a.gen(function* () {
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
  $ as w1thread,
  M as worker1
};
