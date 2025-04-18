import { Data as p, Effect as d } from "effect";
import { isBrowser as w, worker1 as m } from "better-worker1";
function g(r) {
  return r || new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class h extends p.TaggedError("medfetch.sqlite") {
}
let i;
function v() {
  return d.promise(() => new Promise((r, c) => {
    const { port1: n, port2: o } = new MessageChannel(), l = new Worker(
      new URL("fetch-worker.mjs", import.meta.url),
      { type: "module" }
    ), e = (t) => {
      var s;
      t.data === "fetch-ready" || ((s = t.data) == null ? void 0 : s.type) === "fetch-ready" ? (n.removeEventListener("message", e), r(n)) : (n.removeEventListener("message", e), c(new Error(`Unexpected message: ${JSON.stringify(t.data)}`)));
    };
    n.addEventListener("message", e), n.start(), l.postMessage({
      type: "init"
    }, [o]);
  }));
}
function q(r, { trace: c = !1, filename: n, dbId: o } = {}) {
  if (!w())
    return c && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (e, ...t) => {
    };
  const l = d.gen(function* () {
    if (i)
      return i;
    {
      const e = m();
      if (!o) {
        const { dbId: a } = yield* e.lazy("open", {
          vfs: "opfs",
          filename: n
        });
        o = yield* d.fromNullable(a);
      }
      const t = yield* v(), { result: s } = yield* e.lazy({
        dbId: o,
        type: "load-module",
        args: {
          moduleURL: g().toString(),
          moduleName: "medfetch",
          aux: new TextEncoder().encode(r)
        }
      }, [t]);
      return s.rc !== 0 ? yield* new h({
        message: `medfetch.sqlite: couldn't load in the module at ${g().toString()}`,
        type: "load-module"
      }) : (i = o, i);
    }
  });
  return function(t, ...s) {
    const a = t.reduce((f, u, y) => f + u + (s[y] ?? ""), "");
    return d.gen(function* () {
      const f = yield* l, { result: u } = yield* m().lazy({
        type: "exec",
        dbId: f,
        args: {
          sql: a,
          rowMode: "object"
        }
      });
      return u.resultRows;
    });
  };
}
export {
  h as MedfetchSqliteError,
  g as ModuleURL,
  q as medfetch
};
