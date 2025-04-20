import { Data as p, Effect as l } from "effect";
import { isBrowser as w, worker1 as m } from "./main.mjs";
function y(s) {
  return window === void 0 ? new URL("file:///dev/null") : new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class h extends p.TaggedError("medfetch.sqlite") {
}
let d;
function v() {
  return l.promise(
    () => new Promise((s, c) => {
      const { port1: t, port2: n } = new MessageChannel(), a = new Worker(
        new URL(
          "../fetch-worker.mjs",
          import.meta.url
        ),
        { type: "module" }
      ), e = (r) => {
        var o;
        r.data === "fetch-ready" || ((o = r.data) == null ? void 0 : o.type) === "fetch-ready" ? (t.removeEventListener("message", e), s(t)) : (t.removeEventListener("message", e), c(
          new Error(
            `Unexpected message: ${JSON.stringify(r.data)}`
          )
        ));
      };
      t.addEventListener("message", e), t.start(), a.postMessage(
        {
          type: "init"
        },
        [n]
      );
    })
  );
}
function L(s, { trace: c = !1, filename: t, dbId: n } = {}) {
  if (!w())
    return c && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (e, ...r) => {
    };
  const a = l.gen(function* () {
    if (d)
      return d;
    {
      const e = m();
      if (!n)
        if (t) {
          const { dbId: i } = yield* e.lazy("open", {
            vfs: "opfs",
            filename: t
          });
          n = yield* l.fromNullable(i);
        } else {
          const { dbId: i } = yield* e.lazy("open");
          n = yield* l.fromNullable(i);
        }
      const r = yield* v(), { result: o } = yield* e.lazy(
        {
          dbId: n,
          type: "load-module",
          args: {
            moduleURL: y().toString(),
            moduleName: "medfetch",
            aux: new TextEncoder().encode(s)
          }
        },
        [r]
      );
      return o.rc !== 0 ? yield* new h({
        message: `medfetch.sqlite: couldn't load in the module at ${y().toString()}`,
        type: "load-module"
      }) : (d = n, d);
    }
  });
  return function(r, ...o) {
    const i = r.reduce(
      (f, u, g) => f + u + (o[g] ?? ""),
      ""
    );
    return l.gen(function* () {
      const f = yield* a, { result: u } = yield* m().lazy({
        type: "exec",
        dbId: f,
        args: {
          sql: i,
          rowMode: "object"
        }
      });
      return u.resultRows;
    });
  };
}
export {
  h as MedfetchSqliteError,
  L as medfetch
};
