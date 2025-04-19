import { Data as g, Context as y, Effect as o, Match as a, pipe as E } from "effect";
import N from "@sqlite.org/sqlite-wasm";
class h extends g.TaggedError("better-worker1.services.Sqlite3BootstrapError") {
}
class p extends y.Tag("better-worker1.services.Sqlite3InitModule")() {
}
class $ extends y.Tag("better-worker1.services.BetterSqlite3Static")() {
}
function L(t) {
  return o.tryPromise({
    try: () => t({
      print: console.log,
      printErr: console.error
    }),
    catch: (e) => e instanceof Error ? new h({
      phase: "wasm",
      message: e.message,
      errorName: e.name
    }) : new h({
      phase: "wasm",
      message: `sqliteow: unknown error ${e} thrown while loading the wasm module`
    })
  });
}
const T = p.pipe(
  o.andThen(L),
  o.tap((t) => t.initWorker1API())
), P = (t) => T.pipe(o.provideService(p, t));
class s extends g.TaggedError(
  "better-worker1.worker.LoadModule"
) {
}
const S = (t) => o.tryPromise({
  try: async () => await import(
    // so esbuild, rollup, and webpack static
    // analyzers do not fail at runtime
    /* @vite-ignore */
    /* webpackIgnore: true */
    t
  ),
  catch: (e) => e instanceof Error ? new s({
    message: e.message,
    errorName: e.name,
    path: t,
    code: "NO_SUCH_PATH"
  }) : new s({
    message: "sqliteow: unknown error occurred while loading dynamic import",
    code: "UNKNOWN",
    path: t
  })
});
function q(t) {
  return S(t).pipe(
    o.andThen(
      (e) => o.liftPredicate(
        e.default,
        (c) => typeof c < "u",
        () => new s({
          message: "sqliteow: no default export found",
          path: t,
          code: "NO_DEFAULT_EXPORT"
        })
      )
    )
  ).pipe(
    o.andThen(
      o.liftPredicate(
        (e) => typeof e == "function" && e.length > 0,
        (e) => new s({
          message: `better-worker1: expected a function with 2 args as the default export but got ${typeof e} with ${e.length} args`,
          path: t,
          code: "TYPE_MISMATCH_DEFAULT_EXPORT"
        })
      )
    )
  );
}
function _(t, e, c) {
  return q(e).pipe(
    o.andThen(
      (n) => o.tryPromise({
        try: () => n(t, c),
        catch: (l) => (console.error(`better-worker1: error loading user's virtual table module ${l}`), new s({
          message: "",
          path: e,
          code: "UNKNOWN"
        }))
      })
    )
  );
}
function v(t, e) {
  return a.value(t).pipe(
    a.when({ type: "open" }, e.onOpen),
    a.when({ type: "close" }, e.onClose),
    a.when({ type: "exec" }, e.onExec),
    a.when({ type: "export" }, e.onExport),
    a.when({ type: "config-get" }, e.onConfigGet),
    a.when({ type: "load-module" }, e.onLoadModule),
    a.exhaustive
  );
}
function A(t) {
  return o.succeed(postMessage(t));
}
function O(t, e, c, n) {
  return o.try({
    try: () => t.oo1.DB.checkRc(e, n),
    catch: (l) => l instanceof t.SQLite3Error ? l : new s({
      code: "UNKNOWN",
      path: c,
      message: `better-worker1.main.checkRc: (rc=${n}) unknown error thrown injecting the module:`
    })
  });
}
function C(t) {
  return E(t.split("@"), (e) => e[e.length - 1], Number);
}
const U = o.gen(function* () {
  const t = yield* p, e = yield* P(t), c = yield* o.fromNullable(self.onmessage), n = (i) => c.call(self, i);
  return { onMessage: (i) => v(i.data, {
    onOpen: () => n(i),
    onClose: () => n(i),
    onExec: () => n(i),
    onConfigGet: () => n(i),
    onExport: () => n(i),
    /* custom event handlers starts here */
    onLoadModule: async ({ dbId: m, args: r, messageId: b }) => await o.gen(function* () {
      var f;
      if (!m)
        return yield* new s({
          message: "better-worker1.worker1: you have no database opened lol",
          path: "",
          code: "BAD_CALL"
        });
      if (r === void 0)
        return yield* new s({
          message: `better-worker1.worker1: "message.args" can't be undefined when invoking load-module`,
          path: "",
          code: "BAD_CALL"
        });
      const w = C(m);
      e.wasm.allocPtr(1);
      const k = yield* _(e, r.moduleURL, {
        preload: [r.preloadAux],
        transfer: i.ports
      }), x = e.vtab.setupModule({
        methods: k
      });
      let u = 0, d = 0;
      try {
        if (r.aux) {
          const M = r.aux.byteLength;
          if (d = e.wasm.alloc(M), d === 0)
            throw u = -1, new Error();
          new DataView(
            e.wasm.heap8u().buffer,
            d,
            4
          ).setInt32(0, r.aux.byteLength, !0), e.wasm.heap8u().set(r.aux, d + 4);
        }
        u = e.capi.sqlite3_create_module(
          w,
          r.moduleName,
          x.pointer,
          d
        );
      } finally {
        if (u === -1)
          return yield* new s({
            message: `better-worker1.worker1: stack can't handle ${(f = r.aux) == null ? void 0 : f.byteLength} more bytes`,
            code: "NO_MEM",
            path: r.moduleURL
          });
      }
      return yield* O(e, w, r.moduleURL, u), yield* A({
        type: "exec",
        dbId: m,
        messageId: b,
        result: {
          rc: u,
          operation: "load-module",
          moduleName: r.moduleName
        }
      });
    }).pipe(o.runPromise)
  }) };
}), B = U.pipe(
  o.tap(({ onMessage: t }) => {
    self.onmessage = t;
  })
);
o.provideService(
  B,
  p,
  N
).pipe(o.runPromiseExit);
