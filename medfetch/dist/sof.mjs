import { pipe as M } from "effect";
import { evaluate as g } from "fhirpath";
import { d as C, f as O, $ as S, m as h, b as m, r as d, S as f, e as v, w as c, o as I } from "./view-CctbhzTQ.mjs";
const R = /* @__PURE__ */ C(3, (r, t, e) => ({
  ...r,
  [t]: e
}));
function $(r) {
  return v(r).pipe(
    c(void 0, () => "UNKNOWN"),
    c("http://loinc.org", () => "LOINC"),
    c("http://snomed.info/sct", () => "SCT"),
    c("http://www.ama-assn.org/go/cpt", () => "CPT"),
    c("http://hl7.org/fhir/sid/icd-10", () => "ICD10"),
    c("http://hl7.org/fhir/sid/icd-9", () => "ICD9"),
    c("http://www.nlm.nih.gov/research/umls/rxnorm", () => "RXNORM"),
    // Match.when((cs) => cs.startsWith("http://hl7.org/fhir/sid/icd"), () => "ICD"),
    c(
      (t) => t.startsWith("http://terminology.hl7.org"),
      () => "FHIR"
    ),
    I((t) => (console.error(`I don't know this code system ${t}`), "UNKNOWN"))
  );
}
function E({ reference: r }) {
  if (r === void 0)
    return null;
  if (r.startsWith("urn"))
    return r.slice(9);
  const t = r.split("/");
  return t.length === 2 ? t[1] : null;
}
const y = {
  getResourceKey: {
    fn: (r) => r.map((t) => t.id),
    arity: { 0: [] }
  },
  getReferenceKey: {
    fn: (r, t) => r.map((e) => E(e)),
    arity: { 0: [], 1: ["String"] }
  },
  code: {
    fn: (r) => r.flatMap((t) => {
      var e;
      return (e = t.coding) == null ? void 0 : e.map(
        (n) => `${$(n.system)}#${n.code ?? "NOCODE"}`
      );
    }),
    arity: { 0: [] }
  }
}, F = (r, t) => g(r, t, void 0, void 0, {
  userInvocationTable: y,
  async: !1
});
function K(r, t, e) {
  const n = (p, s) => S(p, {
    ForEach: ({ forEach: l, select: o }) => s.flatMap((i) => e(i, l).flatMap(
      (u) => n(f({ select: o }), [u])
    )),
    ForEachOrNull: ({ forEachOrNull: l, select: o }) => s.flatMap((i) => {
      const a = e(i, l);
      return a.length === 0 ? n(f({ select: o }), [{}]) : a.flatMap(
        (u) => n(f({ select: o }), [u])
      );
    }),
    Select: ({ select: l }) => m(s, (o) => d(l, [], (i, a) => {
      const u = n(a, [o]);
      return i.length === 0 ? u : m(i, (N) => h(u, (w) => ({
        ...N,
        ...w
      })));
    })),
    UnionAll: ({ unionAll: l }) => l.flatMap((o) => n(o, s)),
    Column: ({ column: l }) => h(
      s,
      (o) => d(l, {}, (i, a) => M(
        e(o, a.path),
        (u) => R(
          i,
          a.name,
          a.collection ? u : u[0] ?? null
        )
      ))
    )
  });
  return n(r, t);
}
function U(r, t) {
  let e = r.filter(
    (p) => p.resourceType === t.resource
  );
  if (e.length === 0)
    return [];
  const n = (p, s) => g(p, s, {}, void 0, {
    async: !1,
    userInvocationTable: y
  });
  for (const { path: p } of t.where ?? [])
    e = O(e, (s) => n(s, `where(${p})`).length > 0);
  return K(t, e, n);
}
export {
  F as evaluateSync,
  U as flat,
  K as project
};
