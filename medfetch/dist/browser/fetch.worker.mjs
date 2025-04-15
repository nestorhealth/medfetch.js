onmessage = (n) => {
  n.ports[0].onmessage = async (r) => {
    const { sharedSignal: t, url: a, init: i } = r.data, o = new Int32Array(t, 0, 1), c = new DataView(t, 4, 4), s = new Uint8Array(t, 8), l = await (await fetch(a, i)).json(), d = JSON.stringify(l), e = new TextEncoder().encode(d);
    if (e.length > s.length)
      throw new Error(
        `Response too large for SharedArrayBuffer. In bytes, the stringified resources are ${e.length + 1} bytes but the sqlite worker thread only allocated ${s.length} for it...`
      );
    c.setUint32(0, e.length, !0), s.set(e), Atomics.store(o, 0, 1), Atomics.notify(o, 0);
  }, n.ports[0].postMessage("ready");
};
