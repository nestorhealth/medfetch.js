import { Data as w, Context as h, Effect as t } from "effect";
import { isBrowser as k, ow as q } from "sqliteow";
var v = Object.defineProperty, R = (e, r, n) => r in e ? v(e, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[r] = n, L = (e, r, n) => R(e, r + "", n);
class g extends w.TaggedError("BootstrapError") {
}
class M extends h.Tag("Sqlite3WasmLoader")() {
}
class C extends h.Tag("Sqlite3Promiser")() {
}
L(C, "empty", (e, r) => t.succeed(() => new Error("unimplemented promiser")));
function S(e) {
  return t.tryPromise({
    try: () => e({
      print: console.log,
      printErr: console.error
    }),
    catch: (r) => r instanceof Error ? new g({
      phase: "wasm",
      message: r.message,
      errorName: r.name
    }) : new g({
      phase: "wasm",
      message: `sqliteow: unknown error ${r} thrown while loading the wasm module`
    })
  });
}
M.pipe(
  t.andThen(S),
  t.tap((e) => e.initWorker1API())
);
function U(e) {
  return function(r, n) {
    const a = typeof r == "string" ? () => e(r, n) : () => e(r);
    return t.promise(a);
  };
}
function _(e) {
  return e || new URL(
    // namespace for extension in static folder
    "medfetch.vtab.js",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class F extends w.TaggedError("medfetch.sqlite") {
}
function O(e, { fetcher: r, moduleURL: n, trace: a = !1 }) {
  k() || a && console.warn(
    "medfetch: non-browser environment detected, returning stub function..."
  );
  const i = q(), m = U(i), { port1: y, port2: u } = new MessageChannel(), f = "FETCH_PORT", E = new Promise((o, c) => {
    u.onmessage = (s) => {
      s.data === "ready" ? (a && console.log("medfetch: Fetch Worker ready!"), o()) : c(new Error("Unexpected message from fetcher"));
    }, r.postMessage({ type: "init" }, [u]);
  }), x = new Promise((o, c) => {
    const s = (d) => {
      var l;
      ((l = d.data) == null ? void 0 : l.type) === "exec" && d.data.result.key === f && (i.$worker.removeEventListener("message", s), o());
    };
    i.$worker.addEventListener("message", s), i.$worker.postMessage(
      { type: "ow-register-port", args: { key: f } },
      [y]
    );
  }), T = Promise.all([E, x]).then(
    () => m({ type: "open" }).pipe(
      t.andThen(
        ({ dbId: o }) => m({
          type: "ow-load-module",
          dbId: o,
          args: {
            moduleURL: _(n).toString(),
            moduleName: "medfetch",
            aux: new TextEncoder().encode(e)
          }
        })
      )
    ).pipe(t.runPromise)
  );
  return function(c, ...s) {
    return t.gen(function* () {
      const { dbId: d } = yield* t.promise(() => T), l = c.reduce(
        (p, P, b) => p + P + (s[b] ?? ""),
        ""
      );
      return yield* m({
        type: "exec",
        dbId: d,
        args: {
          sql: l
        }
      }).pipe(t.andThen(({ result: p }) => p.resultRows));
    });
  };
}
export {
  F as MedfetchSqliteError,
  _ as ModuleURL,
  O as medfetch
};
