import { Data as l } from "effect";
import { isBrowser as p, worker1 as w } from "better-worker1";
function g(t) {
  return t || new URL(
    // namespace for extension in static folder
    "sqlite-ext/medfetch.vtab.mjs",
    // relative to source  : relative to static root
    self.location.origin
  );
}
class E extends l.TaggedError("medfetch.sqlite") {
}
async function L(t, { trace: m = !1, filename: d } = {}) {
  if (!p())
    return m && console.warn(
      "medfetch: non-browser environment detected, returning stub function..."
    ), (e, ...i) => {
    };
  const { port1: r, port2: f } = new MessageChannel();
  new Worker(
    new URL("fetch-worker.mjs", import.meta.url),
    { type: "module" }
  ).postMessage({
    type: "init"
  }, [f]), await new Promise((e, i) => {
    const s = (a) => {
      var c;
      a.data === "fetch-ready" || ((c = a.data) == null ? void 0 : c.type) === "fetch-ready" ? (r.removeEventListener("message", s), e()) : (r.removeEventListener("message", s), i(new Error(`Unexpected message: ${JSON.stringify(a.data)}`)));
    };
    r.addEventListener("message", s), r.start();
  });
  const o = w();
  let n;
  if (d) {
    const { dbId: e } = await o("open", {
      vfs: "opfs",
      filename: d
    });
    n = e;
  } else {
    const { dbId: e } = await o("open");
    n = e;
  }
  return await o({
    dbId: n,
    type: "load-module",
    args: {
      moduleURL: g().toString(),
      moduleName: "medfetch",
      aux: new TextEncoder().encode(t)
    }
  }, [r]), console.log("ok!"), o;
}
export {
  E as MedfetchSqliteError,
  g as ModuleURL,
  L as medfetch
};
