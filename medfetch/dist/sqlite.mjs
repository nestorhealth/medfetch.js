import { Data as g, Effect as c } from "effect";
import { isBrowser as w, worker1 as l } from "better-worker1";
function h(o) {
  return o || new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class x extends g.TaggedError("medfetch.sqlite") {
}
function L(o, { trace: f = !1, filename: a } = {}) {
  if (!w())
    return f && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (r, ...e) => {
    };
  const { port1: s, port2: m } = new MessageChannel();
  new Worker(
    new URL("fetch-worker.mjs", import.meta.url),
    { type: "module" }
  ).postMessage({
    type: "init"
  }, [m]);
  const u = new Promise((r, e) => {
    const t = (d) => {
      var n;
      d.data === "fetch-ready" || ((n = d.data) == null ? void 0 : n.type) === "fetch-ready" ? (s.removeEventListener("message", t), r()) : (s.removeEventListener("message", t), e(new Error(`Unexpected message: ${JSON.stringify(d.data)}`)));
    };
    s.addEventListener("message", t), s.start();
  }), p = c.gen(function* () {
    yield* c.promise(() => u);
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
    return yield* r.lazy({
      dbId: e,
      type: "load-module",
      args: {
        moduleURL: h().toString(),
        moduleName: "medfetch",
        aux: new TextEncoder().encode(o)
      }
    }, [s]), e;
  });
  return function(e, ...t) {
    const d = e.reduce((n, i, y) => n + i + (t[y] ?? ""), "");
    return c.gen(function* () {
      const n = yield* p, { result: i } = yield* l().lazy({
        type: "exec",
        dbId: n,
        args: {
          sql: d,
          rowMode: "object"
        }
      });
      return i.resultRows;
    });
  };
}
export {
  x as MedfetchSqliteError,
  h as ModuleURL,
  L as medfetch
};
