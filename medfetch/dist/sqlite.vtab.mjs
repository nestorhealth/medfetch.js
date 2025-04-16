import { flat as v } from "./sof.mjs";
import { c as $, v as A, C as Q } from "./view-CctbhzTQ.mjs";
function R({ wasm: s }, o) {
  const i = new DataView(s.heap8().buffer, o, 4).getUint32(0, !0), f = new DataView(s.heap8().buffer, o + 4, i);
  return new TextDecoder().decode(f);
}
const V = (s) => function(i) {
  const f = new Int32Array(i.sharedSignal, 0, 1);
  f[0] = 0, s.postMessage({ ...i, type: "request" }), Atomics.wait(f, 0, 0);
};
function k(s) {
  if (typeof s != "string") return s[0];
  let o = s;
  for (; o.match(/\.\w+\([^)]*\)$/); )
    o = o.replace(/\.\w+\([^)]*\)$/, "");
  const i = o.split(".");
  return i[i.length - 1];
}
function K(s) {
  const o = s.split(".");
  return o[0][0].toUpperCase() === o[0][0] ? o[1] : o[0];
}
function U(s) {
  return s.split(".").length;
}
function q(s, o) {
  const [i, f] = s;
  if (!i || typeof i != "string")
    throw new Error("medfetch: unexpected invalid resourceType in args[0]");
  if (!f)
    return null;
  const t = JSON.parse(f);
  if (!Array.isArray(t))
    return null;
  const u = /* @__PURE__ */ new Set(), g = [];
  for (let w = 0; w < o.length && u.size !== t.length; w++) {
    const d = o[w];
    for (const l of t)
      if (typeof l == "string" && K(l) in d) {
        const e = d[l], r = k(l), n = Array.isArray(e) || U(l) > 1;
        u.add(l), g.push(
          $({
            path: l,
            name: r,
            collection: n
          })
        );
      }
  }
  return A({
    status: "active",
    name: i,
    resource: i,
    constant: [],
    select: [
      Q({
        column: g
      })
    ],
    where: []
  });
}
const F = async (s, { preload: o, ports: i }) => {
  const { wasm: f, capi: t, vtab: u } = s, g = i[0];
  if (!g)
    throw new Error(
      "medfetch: expected Fetch Worker port at ports[0] but got nothing"
    );
  const w = V(g), d = (e) => u.xCursor.get(e), l = (e) => u.xVtab.get(e);
  return {
    xCreate: 0,
    xConnect(e, r, n, c, p, a) {
      let x = t.SQLITE_OK;
      if (x += t.sqlite3_declare_vtab(
        e,
        `CREATE TABLE resource(
                    id TEXT,
                    json TEXT,
                    type HIDDEN,
                    fp   HIDDEN
                )`
      ), !x) {
        const T = u.xVtab.create(p);
        T.baseUrl = R(s, r);
      }
      return x;
    },
    xBestIndex(e, r) {
      const n = u.xIndexInfo(r);
      for (let c = 0; c < n.$nConstraint; c++) {
        const p = n.nthConstraint(c), a = n.nthConstraintUsage(c);
        switch (p.$op) {
          case t.SQLITE_INDEX_CONSTRAINT_LIMIT: {
            a.$argvIndex = c + 1, a.$omit = 1;
            break;
          }
          case t.SQLITE_INDEX_CONSTRAINT_OFFSET: {
            a.$argvIndex = c + 1, a.$omit = 1;
            break;
          }
          default:
            a.$argvIndex = c + 1, a.$omit = 1;
        }
      }
      return n.dispose(), t.SQLITE_OK;
    },
    xDestroy: !0,
    xDisconnect(e) {
      return u.xVtab.unget(e), t.SQLITE_OK;
    },
    xOpen: (e, r) => {
      const n = u.xCursor.create(
        r
      );
      return n.pVtab = e, n.index = 0, n.rows = [], t.SQLITE_OK;
    },
    xClose: (e) => (u.xCursor.unget(e), t.SQLITE_OK),
    xNext: (e) => {
      const r = d(e);
      return r.index++, t.SQLITE_OK;
    },
    xColumn(e, r, n) {
      const c = d(e), p = c.rows[c.index];
      switch (n) {
        case 0: {
          t.sqlite3_result_text(
            r,
            p.id,
            -1,
            t.SQLITE_TRANSIENT
          );
          break;
        }
        case 1: {
          const a = JSON.stringify(p);
          t.sqlite3_result_text(
            r,
            a,
            -1,
            t.SQLITE_TRANSIENT
          );
          break;
        }
      }
      return t.SQLITE_OK;
    },
    xRowid: (e, r) => {
      const n = d(e);
      return u.xRowid(r, n.index), t.SQLITE_OK;
    },
    xEof: (e) => {
      const r = d(e), n = r.index >= r.rows.length;
      return Number(n);
    },
    xFilter: (e, r, n, c, p) => {
      var y, N;
      const a = t.sqlite3_values_to_js(c, p), [x] = a;
      if (typeof x != "string")
        return t.SQLITE_ERROR;
      const T = d(e), { baseUrl: E } = l(T.pVtab);
      let h = E[E.length - 1] === "/" ? `${E}${x}` : `${E}/${x}`, I = [];
      const S = new SharedArrayBuffer(8 + 3 * 1024 * 1024);
      for (; h != null; ) {
        w({ sharedSignal: S, url: h });
        const _ = new DataView(S, 4, 4).getUint32(
          0,
          !0
        ), D = new Uint8Array(S, 8, _), L = new TextDecoder().decode(
          D.slice()
        ), C = JSON.parse(L), O = C.entry.map(
          ({ resource: m }) => m
        );
        I.push(...O), h = (N = (y = C.link) == null ? void 0 : y.find(
          (m) => m.relation === "next"
        )) == null ? void 0 : N.url;
      }
      const b = q(a, I);
      if (b) {
        const _ = v(b, I);
        T.rows = _;
      } else
        T.rows = I;
      return 0;
    }
  };
};
export {
  F as default
};
