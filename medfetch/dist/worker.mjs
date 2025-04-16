import { Data as s } from "effect";
import { Fetch as f } from "./worker.fetch.mjs";
class a extends s.TaggedError("Error.medfetch.worker") {
}
function i(r) {
  self.onmessage = (e) => {
    var t;
    const o = e.ports[0];
    if (!o || ((t = e.data) == null ? void 0 : t.type) !== "init")
      throw new a({
        phase: "init",
        message: "No MessagePort to write back to"
      });
    new r(o);
  };
}
export {
  f as Fetch,
  a as WorkerError,
  i as worker
};
