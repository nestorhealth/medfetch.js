import { Data as y, Effect as o } from "effect";
import { isBrowser as w, worker1 as f } from "better-worker1";
function h(s) {
  return s || new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class x extends y.TaggedError("medfetch.sqlite") {
}
function L(s, { trace: l = !1, filename: a } = {}) {
  if (!w())
    return l && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (r, ...e) => {
    };
  const { port1: d, port2: p } = new MessageChannel();
  new Worker(
    new URL("fetch-worker.mjs", import.meta.url),
    { type: "module" }
  ).postMessage({
    type: "init"
  }, [p]);
  const u = new Promise((r, e) => {
    const t = (i) => {
      var n;
      i.data === "fetch-ready" || ((n = i.data) == null ? void 0 : n.type) === "fetch-ready" ? (d.removeEventListener("message", t), r()) : (d.removeEventListener("message", t), e(new Error(`Unexpected message: ${JSON.stringify(i.data)}`)));
    };
    d.addEventListener("message", t), d.start();
  }), g = o.gen(function* () {
    yield* o.promise(() => u);
    const r = f();
    let e;
    if (a) {
      const { dbId: t } = yield* o.promise(() => r("open", {
        vfs: "opfs",
        filename: a
      }));
      e = t;
    } else {
      const { dbId: t } = yield* o.promise(() => r("open"));
      e = t;
    }
    return yield* o.promise(() => r({
      dbId: e,
      type: "load-module",
      args: {
        moduleURL: h().toString(),
        moduleName: "medfetch",
        aux: new TextEncoder().encode(s)
      }
    }, [d])), e;
  });
  return function(e, ...t) {
    const i = e.reduce((n, c, m) => n + c + (t[m] ?? ""), "");
    return o.gen(function* () {
      const n = yield* g, c = f(), { result: m } = yield* o.promise(() => c({
        type: "exec",
        dbId: n,
        args: {
          sql: i,
          rowMode: "object"
        }
      }));
      return m.resultRows;
    });
  };
}
export {
  x as MedfetchSqliteError,
  h as ModuleURL,
  L as medfetch
};
