import { Data as h, Effect as c } from "effect";
import { isBrowser as w, worker1 as l } from "better-worker1";
function f(s) {
  return s || new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class v extends h.TaggedError("medfetch.sqlite") {
}
function x(s, { trace: m = !1, filename: a } = {}) {
  if (!w())
    return m && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (r, ...e) => {
    };
  const { port1: d, port2: u } = new MessageChannel();
  new Worker(
    new URL("fetch-worker.mjs", import.meta.url),
    { type: "module" }
  ).postMessage({
    type: "init"
  }, [u]);
  const y = new Promise((r, e) => {
    const o = (t) => {
      var n;
      t.data === "fetch-ready" || ((n = t.data) == null ? void 0 : n.type) === "fetch-ready" ? (d.removeEventListener("message", o), r()) : (d.removeEventListener("message", o), e(new Error(`Unexpected message: ${JSON.stringify(t.data)}`)));
    };
    d.addEventListener("message", o), d.start();
  }), p = c.gen(function* () {
    yield* c.promise(() => y);
    const r = l();
    let e;
    if (a) {
      const { dbId: t } = yield* r.lazy("open", {
        vfs: "opfs",
        filename: a
      });
      e = t;
    } else {
      const { dbId: t } = yield* r.lazy("open");
      e = t;
    }
    const { result: { rc: o } } = yield* r.lazy({
      dbId: e,
      type: "load-module",
      args: {
        moduleURL: f().toString(),
        moduleName: "medfetch",
        aux: new TextEncoder().encode(s)
      }
    }, [d]);
    return o !== 0 ? yield* new v({
      message: `medfetch.sqlite: couldn't load in the module at ${f().toString()}`,
      type: "load-module"
    }) : e;
  });
  return function(e, ...o) {
    const t = e.reduce((n, i, g) => n + i + (o[g] ?? ""), "");
    return c.gen(function* () {
      const n = yield* p, { result: i } = yield* l().lazy({
        type: "exec",
        dbId: n,
        args: {
          sql: t,
          rowMode: "object"
        }
      });
      return i.resultRows;
    });
  };
}
export {
  v as MedfetchSqliteError,
  f as ModuleURL,
  x as medfetch
};
