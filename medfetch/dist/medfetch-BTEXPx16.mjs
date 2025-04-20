var E = (t) => {
  throw TypeError(t);
};
var g = (t, e, r) => e.has(t) || E("Cannot " + r);
var u = (t, e, r) => (g(t, e, "read from private field"), r ? r.call(t) : e.get(t)), p = (t, e, r) => e.has(t) ? E("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, r), k = (t, e, r, o) => (g(t, e, "write to private field"), o ? o.call(t, r) : e.set(t, r), r), b = (t, e, r) => (g(t, e, "access private method"), r);
import { Effect as d, Data as S } from "effect";
import "@sqlite.org/sqlite-wasm";
import { MESSAGE_TYPES as x } from "./sqlite-wasm/types.mjs";
var f, l, w, v;
class I {
  constructor() {
    p(this, w);
    p(this, f);
    p(this, l);
    k(this, f, /* @__PURE__ */ new Map()), k(this, l, Object.fromEntries(
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
    const r = u(this, l)[e] = (u(this, l)[e] || 0) + 1;
    return b(this, w, v).call(this, e, r);
  }
  /**
   * Wrap reading from object directly COUNT_MAP[msgType]
   * @param msgType The message type
   * @returns How many times a request of type msgType has been called by any given promiser
   */
  messageId(e) {
    return b(this, w, v).call(this, e, u(this, l)[e]);
  }
  get(e) {
    return u(this, f).get(e);
  }
  set(e, r) {
    return u(this, f).set(e, r);
  }
}
f = new WeakMap(), l = new WeakMap(), w = new WeakSet(), v = function(e, r) {
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
  return async function(o, c) {
    const { messageType: n, params: s, transfers: i } = U([o, c]), a = e.increment(n);
    return i && e.set(a, i), t.then((m) => m(...s));
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
    ), r = new I(), o = e.postMessage.bind(e);
    e.postMessage = (s, i) => {
      t && console.log(
        "better-worker1.main.w1thread: sending with ports:",
        i
      );
      const a = r.get(r.messageId(s.type));
      return a ? o(s, a) : o(s);
    };
    const c = globalThis.sqlite3Worker1Promiser.v2({
      worker: e
    });
    let n = W(c, r);
    return n.$worker = e, n.lazy = (...s) => d.promise(() => n(...s)), n;
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
  return d.promise(
    () => new Promise((t, e) => {
      const { port1: r, port2: o } = new MessageChannel(), c = new Worker(
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
      r.addEventListener("message", n), r.start(), c.postMessage(
        {
          type: "init"
        },
        [o]
      );
    })
  );
}
function N(t, { trace: e = !1, filename: r, dbId: o } = {}) {
  if (!R())
    return e && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (n, ...s) => {
    };
  const c = d.gen(function* () {
    if (y)
      return y;
    {
      const n = M();
      if (!o)
        if (r) {
          const { dbId: a } = yield* n.lazy("open", {
            vfs: "opfs",
            filename: r
          });
          o = yield* d.fromNullable(a);
        } else {
          const { dbId: a } = yield* n.lazy("open");
          o = yield* d.fromNullable(a);
        }
      const s = yield* P(), { result: i } = yield* n.lazy(
        {
          dbId: o,
          type: "load-module",
          args: {
            moduleURL: L().toString(),
            moduleName: "medfetch",
            aux: new TextEncoder().encode(t)
          }
        },
        [s]
      );
      return i.rc !== 0 ? yield* new j({
        message: `medfetch.sqlite: couldn't load in the module at ${L().toString()}`,
        type: "load-module"
      }) : (y = o, y);
    }
  });
  return function(s, ...i) {
    const a = s.reduce(
      (m, h, q) => m + h + (i[q] ?? ""),
      ""
    );
    return d.gen(function* () {
      const m = yield* c, { result: h } = yield* M().lazy({
        type: "exec",
        dbId: m,
        args: {
          sql: a,
          rowMode: "object"
        }
      });
      return h.resultRows;
    });
  };
}
export {
  j as M,
  $ as a,
  N as m,
  M as w
};
