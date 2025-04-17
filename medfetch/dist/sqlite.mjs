import { Data as p, Effect as c } from "effect";
import { isBrowser as y, worker1 as m } from "better-worker1";
function f(o) {
  return o || new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class g extends p.TaggedError("medfetch.sqlite") {
}
function h() {
  return c.promise(() => new Promise((o, l) => {
    const { port1: t, port2: a } = new MessageChannel(), r = new Worker(
      new URL("fetch-worker.mjs", import.meta.url),
      { type: "module" }
    ), e = (s) => {
      var d;
      s.data === "fetch-ready" || ((d = s.data) == null ? void 0 : d.type) === "fetch-ready" ? (t.removeEventListener("message", e), o(t)) : (t.removeEventListener("message", e), l(new Error(`Unexpected message: ${JSON.stringify(s.data)}`)));
    };
    t.addEventListener("message", e), t.start(), r.postMessage({
      type: "init"
    }, [a]);
  }));
}
function b(o, { trace: l = !1, filename: t } = {}) {
  if (!y())
    return l && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (r, ...e) => {
    };
  const a = c.gen(function* () {
    const r = m();
    let e;
    if (t) {
      const { dbId: n } = yield* r.lazy("open", {
        vfs: "opfs",
        filename: t
      });
      e = n;
    } else {
      const { dbId: n } = yield* r.lazy("open");
      e = n;
    }
    const d = yield* (yield* c.cachedFunction(h))(e), { result: { rc: i } } = yield* r.lazy({
      dbId: e,
      type: "load-module",
      args: {
        moduleURL: f().toString(),
        moduleName: "medfetch",
        aux: new TextEncoder().encode(o)
      }
    }, [d]);
    return i !== 0 ? yield* new g({
      message: `medfetch.sqlite: couldn't load in the module at ${f().toString()}`,
      type: "load-module"
    }) : e;
  });
  return function(e, ...s) {
    const d = e.reduce((i, n, u) => i + n + (s[u] ?? ""), "");
    return c.gen(function* () {
      const i = yield* a, { result: n } = yield* m().lazy({
        type: "exec",
        dbId: i,
        args: {
          sql: d,
          rowMode: "object"
        }
      });
      return n.resultRows;
    });
  };
}
export {
  g as MedfetchSqliteError,
  f as ModuleURL,
  b as medfetch
};
