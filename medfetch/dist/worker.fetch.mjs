import { Data as h } from "effect";
class p extends h.TaggedClass("medfetch.worker.fetch") {
  constructor(o) {
    super({ port: o }), this.port.onmessage = async (r) => {
      const { sharedSignal: t, url: a, init: c } = r.data, n = new Int32Array(t, 0, 1), i = new DataView(t, 4, 4), s = new Uint8Array(t, 8), d = await (await fetch(a, c)).json(), g = JSON.stringify(d), e = new TextEncoder().encode(g);
      if (e.length > s.length)
        throw new Error(
          `Response too large for SharedArrayBuffer. Needed ${e.length + 1}, got ${s.length}`
        );
      i.setUint32(0, e.length, !0), s.set(e), Atomics.store(n, 0, 1), Atomics.notify(n, 0);
    }, this.port.postMessage("ready");
  }
}
export {
  p as Fetch
};
