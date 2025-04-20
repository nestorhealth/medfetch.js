import { flat as A } from "../sof.mjs";
import { T as Q, c as _, v as R, C as V } from "../view-bvE2dEbi.mjs";
class b extends Q(
  "medfetch/sqlite-wasm/medfetch.vtab"
) {
  constructor(r) {
    typeof r == "string" ? super({ message: r }) : super(r);
  }
}
function k({ wasm: o }, r) {
  const c = new DataView(o.heap8().buffer, r, 4).getUint32(0, !0), f = new DataView(o.heap8().buffer, r + 4, c);
  return new TextDecoder().decode(f);
}
const K = (o) => function(c) {
  const f = new Int32Array(c.sharedSignal, 0, 1);
  f[0] = 0, o.postMessage({ ...c, type: "request" }), Atomics.wait(f, 0, 0);
};
function q(o) {
  if (typeof o != "string") return o[0];
  let r = o;
  for (; r.match(/\.\w+\([^)]*\)$/); )
    r = r.replace(/\.\w+\([^)]*\)$/, "");
  const c = r.split(".");
  return c[c.length - 1];
}
function U(o) {
  const r = o.split(".");
  return r[0][0].toUpperCase() === r[0][0] ? r[1] : r[0];
}
function z(o) {
  return o.split(".").length;
}
function B(o, r) {
  const [c, f] = o;
  if (!c || typeof c != "string")
    throw new Error("medfetch: unexpected invalid resourceType in args[0]");
  if (!f)
    return null;
  const n = JSON.parse(f);
  if (!Array.isArray(n))
    return null;
  const i = /* @__PURE__ */ new Set(), p = [];
  for (let g = 0; g < r.length && i.size !== n.length; g++) {
    const d = r[g];
    for (const a of n)
      if (typeof a == "string") {
        if (U(a) in d) {
          const e = d[a], t = q(a), s = Array.isArray(e) || z(a) > 1;
          i.add(a), p.push(
            _({
              path: a,
              name: t,
              collection: s
            })
          );
        }
      } else if (Array.isArray(a))
        if (a.length === 2) {
          const [e, t] = a;
          i.add(t), p.push(
            _({
              path: t,
              name: e,
              collection: !0
            })
          );
        } else if (a.length === 3) {
          const [e, t, s] = a;
          throw new b(
            `medfetch.vtab: ${e} currently not supported!`
          );
        } else
          throw new b(
            `medfetch.vtab: i don't know what to do with an array of length ${a.length}`
          );
      else
        throw new b(
          `medfetch.vtab: Can't fp parse that: ${a}`
        );
  }
  return (!i.has("id") || !i.has("getResourceKey()")) && p.unshift(
    _({
      name: "id",
      path: "id",
      collection: !1
    })
  ), R({
    status: "active",
    name: c,
    resource: c,
    constant: [],
    select: [
      V({
        column: p
      })
    ],
    where: []
  });
}
const X = async (o, { preload: r, transfer: c }) => {
  const { wasm: f, capi: n, vtab: i } = o, p = c[0];
  if (!p)
    throw new Error(
      "medfetch: expected Fetch Worker port at ports[0] but got nothing"
    );
  const g = K(p), d = (e) => i.xCursor.get(e), a = (e) => i.xVtab.get(e);
  return {
    xCreate: 0,
    xConnect(e, t, s, u, h, l) {
      let w = n.SQLITE_OK;
      if (w += n.sqlite3_declare_vtab(
        e,
        `CREATE TABLE resource(
                    id TEXT,
                    json TEXT,
                    type HIDDEN,
                    fp   HIDDEN
                )`
      ), !w) {
        const x = i.xVtab.create(h);
        x.baseUrl = k(o, t);
      }
      return w;
    },
    xBestIndex(e, t) {
      const s = i.xIndexInfo(t);
      for (let u = 0; u < s.$nConstraint; u++) {
        const h = s.nthConstraint(u), l = s.nthConstraintUsage(u);
        switch (h.$op) {
          case n.SQLITE_INDEX_CONSTRAINT_LIMIT: {
            l.$argvIndex = u + 1, l.$omit = 1;
            break;
          }
          case n.SQLITE_INDEX_CONSTRAINT_OFFSET: {
            l.$argvIndex = u + 1, l.$omit = 1;
            break;
          }
          default:
            l.$argvIndex = u + 1, l.$omit = 1;
        }
      }
      return s.dispose(), n.SQLITE_OK;
    },
    xDestroy: !0,
    xDisconnect(e) {
      return i.xVtab.unget(e), n.SQLITE_OK;
    },
    xOpen: (e, t) => {
      const s = i.xCursor.create(
        t
      );
      return s.pVtab = e, s.index = 0, s.rows = [], n.SQLITE_OK;
    },
    xClose: (e) => (i.xCursor.unget(e), n.SQLITE_OK),
    xNext: (e) => {
      const t = d(e);
      return t.index++, n.SQLITE_OK;
    },
    xColumn(e, t, s) {
      const u = d(e), h = u.rows[u.index];
      switch (s) {
        case 0: {
          n.sqlite3_result_text(
            t,
            h.id,
            -1,
            n.SQLITE_TRANSIENT
          );
          break;
        }
        case 1: {
          const l = JSON.stringify(h);
          n.sqlite3_result_text(
            t,
            l,
            -1,
            n.SQLITE_TRANSIENT
          );
          break;
        }
      }
      return n.SQLITE_OK;
    },
    xRowid: (e, t) => {
      const s = d(e);
      return i.xRowid(t, s.index), n.SQLITE_OK;
    },
    xEof: (e) => {
      const t = d(e), s = t.index >= t.rows.length;
      return Number(s);
    },
    xFilter: (e, t, s, u, h) => {
      var v, C;
      const l = n.sqlite3_values_to_js(u, h), [w] = l;
      if (typeof w != "string")
        return n.SQLITE_ERROR;
      const x = d(e), { baseUrl: T } = a(x.pVtab);
      let m = T[T.length - 1] === "/" ? `${T}${w}` : `${T}/${w}`, E = [];
      const I = new SharedArrayBuffer(8 + 3 * 1024 * 1024);
      for (; m != null; ) {
        g({ sharedSignal: I, url: m });
        const y = new DataView(I, 4, 4).getUint32(
          0,
          !0
        ), D = new Uint8Array(I, 8, y), L = new TextDecoder().decode(
          D.slice()
        ), $ = JSON.parse(L), O = $.entry.map(
          ({ resource: S }) => S
        );
        E.push(...O), m = (C = (v = $.link) == null ? void 0 : v.find(
          (S) => S.relation === "next"
        )) == null ? void 0 : C.url;
      }
      const N = B(l, E);
      if (N) {
        const y = A(E, N);
        x.rows = y;
      } else
        x.rows = E;
      return 0;
    }
  };
};
export {
  X as default
};
