import { sof as L } from "../sof.mjs";
import { cq as O, co as v, cr as $ } from "../view-BCMoZj0M.mjs";
function A({ wasm: s }, n) {
  const i = new DataView(s.heap8().buffer, n, 4).getUint32(0, !0), e = new DataView(s.heap8().buffer, n + 4, i);
  return new TextDecoder().decode(e);
}
async function Q(s) {
  const { port1: n, port2: i } = new MessageChannel();
  return new Worker(s, { type: "module" }).postMessage({ type: "init" }, [i]), await new Promise((c, p) => {
    n.onmessage = (l) => {
      l.data === "ready" ? c(n) : p();
    };
  });
}
const R = (s) => function(i) {
  const e = new Int32Array(i.sharedSignal, 0, 1);
  e[0] = 0, s.postMessage({ ...i, type: "request" }), Atomics.wait(e, 0, 0);
};
function V(s) {
  if (typeof s != "string") return s[0];
  let n = s;
  for (; n.match(/\.\w+\([^)]*\)$/); )
    n = n.replace(/\.\w+\([^)]*\)$/, "");
  const i = n.split(".");
  return i[i.length - 1];
}
function k(s) {
  const n = s.split(".");
  return n[0][0].toUpperCase() === n[0][0] ? n[1] : n[0];
}
function q(s) {
  return s.split(".").length;
}
function K(s, n) {
  const [i, e] = s;
  if (!i || typeof i != "string")
    throw new Error("medfetch: unexpected invalid resourceType in args[0]");
  if (!e)
    return null;
  const c = JSON.parse(e);
  if (!Array.isArray(c))
    return null;
  const p = /* @__PURE__ */ new Set(), l = [];
  for (let x = 0; x < n.length && p.size !== c.length; x++) {
    const t = n[x];
    for (const r of c)
      if (typeof r == "string" && k(r) in t) {
        const o = t[r], a = V(r), f = Array.isArray(o) || q(r) > 1;
        p.add(r), l.push(
          O({
            path: r,
            name: a,
            collection: f
          })
        );
      }
  }
  return v({
    status: "active",
    name: i,
    resource: i,
    constant: [],
    select: [
      $({
        column: l
      })
    ],
    where: []
  });
}
async function B(s, n) {
  const { wasm: i, capi: e, vtab: c } = s, p = await Q(n[0]).then(R), l = (t) => c.xCursor.get(t), x = (t) => c.xVtab.get(t);
  return {
    xCreate: 0,
    xConnect(t, r, o, a, f, u) {
      let d = e.SQLITE_OK;
      if (d += e.sqlite3_declare_vtab(
        t,
        `CREATE TABLE resource(
                    id TEXT,
                    json TEXT,
                    type HIDDEN,
                    fp   HIDDEN
                )`
      ), !d) {
        const w = c.xVtab.create(f);
        w.baseUrl = A(s, r);
      }
      return d;
    },
    xBestIndex(t, r) {
      const o = c.xIndexInfo(r);
      for (let a = 0; a < o.$nConstraint; a++) {
        const f = o.nthConstraint(a), u = o.nthConstraintUsage(a);
        switch (f.$op) {
          case e.SQLITE_INDEX_CONSTRAINT_LIMIT: {
            u.$argvIndex = a + 1, u.$omit = 1;
            break;
          }
          case e.SQLITE_INDEX_CONSTRAINT_OFFSET: {
            u.$argvIndex = a + 1, u.$omit = 1;
            break;
          }
          default:
            u.$argvIndex = a + 1, u.$omit = 1;
        }
      }
      return o.dispose(), e.SQLITE_OK;
    },
    xDestroy: !0,
    xDisconnect(t) {
      return c.xVtab.unget(t), e.SQLITE_OK;
    },
    xOpen: (t, r) => {
      const o = c.xCursor.create(
        r
      );
      return o.pVtab = t, o.index = 0, o.rows = [], e.SQLITE_OK;
    },
    xClose: (t) => (c.xCursor.unget(t), e.SQLITE_OK),
    xNext: (t) => {
      const r = l(t);
      return r.index++, e.SQLITE_OK;
    },
    xColumn(t, r, o) {
      const a = l(t), f = a.rows[a.index];
      switch (o) {
        case 0: {
          e.sqlite3_result_text(
            r,
            f.id,
            -1,
            e.SQLITE_TRANSIENT
          );
          break;
        }
        case 1: {
          const u = JSON.stringify(f);
          e.sqlite3_result_text(
            r,
            u,
            -1,
            e.SQLITE_TRANSIENT
          );
          break;
        }
      }
      return e.SQLITE_OK;
    },
    xRowid: (t, r) => {
      const o = l(t);
      return c.xRowid(r, o.index), e.SQLITE_OK;
    },
    xEof: (t) => {
      const r = l(t), o = r.index >= r.rows.length;
      return Number(o);
    },
    xFilter: (t, r, o, a, f) => {
      var _, m;
      const u = e.sqlite3_values_to_js(a, f), [d] = u;
      if (typeof d != "string")
        return e.SQLITE_ERROR;
      const w = l(t), { baseUrl: g } = x(w.pVtab);
      let T = g[g.length - 1] === "/" ? `${g}${d}` : `${g}/${d}`, h = [];
      const E = new SharedArrayBuffer(8 + 3 * 1024 * 1024);
      for (; T != null; ) {
        p({ sharedSignal: E, url: T });
        const I = new DataView(E, 4, 4).getUint32(
          0,
          !0
        ), N = new Uint8Array(E, 8, I), C = new TextDecoder().decode(
          N.slice()
        ), b = JSON.parse(C), D = b.entry.map(
          ({ resource: S }) => S
        );
        h.push(...D), T = (m = (_ = b.link) == null ? void 0 : _.find(
          (S) => S.relation === "next"
        )) == null ? void 0 : m.url;
      }
      const y = K(u, h);
      if (y) {
        const I = L(y, h);
        w.rows = I;
      } else
        w.rows = h;
      return 0;
    }
  };
}
export {
  B as default
};
