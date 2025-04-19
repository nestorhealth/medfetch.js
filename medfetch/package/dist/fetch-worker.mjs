import { Effect as o } from "effect";
const f = async (n) => {
  const { sharedSignal: e, url: r, init: i } = n.data, a = new Int32Array(e, 0, 1), c = new DataView(e, 4, 4), s = new Uint8Array(e, 8), g = await (await fetch(r, i)).json(), l = JSON.stringify(g), t = new TextEncoder().encode(l);
  if (t.length > s.length)
    throw new Error(
      `Response too large for SharedArrayBuffer. Needed ${t.length + 1}, got ${s.length}`
    );
  c.setUint32(0, t.length, !0), s.set(t), Atomics.store(a, 0, 1), Atomics.notify(a, 0);
};
self.onmessage = (n) => o.fromNullable(n.ports[0]).pipe(
  o.tap((e) => {
    e.onmessage = f, e.postMessage("fetch-ready");
  })
).pipe(o.runSync);
