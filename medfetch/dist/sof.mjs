import { Array as f, pipe as N } from "effect";
import { evaluate as m } from "fhirpath";
import { d as w, $ as M, S as h, b as C, w as c, o as O } from "./view-wKnUKvlF.mjs";
const S = /* @__PURE__ */ w(3, (r, t, e) => ({
  ...r,
  [t]: e
}));
function v(r) {
  return C(r).pipe(
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
    O((t) => (console.error(`I don't know this code system ${t}`), "UNKNOWN"))
  );
}
function I({ reference: r }) {
  if (r === void 0)
    return null;
  if (r.startsWith("urn"))
    return r.slice(9);
  const t = r.split("/");
  return t.length === 2 ? t[1] : null;
}
const d = {
  getResourceKey: {
    fn: (r) => r.map((t) => t.id),
    arity: { 0: [] }
  },
  getReferenceKey: {
    fn: (r, t) => r.map((e) => I(e)),
    arity: { 0: [], 1: ["String"] }
  },
  code: {
    fn: (r) => r.flatMap((t) => {
      var e;
      return (e = t.coding) == null ? void 0 : e.map(
        (n) => `${v(n.system)}#${n.code ?? "NOCODE"}`
      );
    }),
    arity: { 0: [] }
  }
}, T = (r, t) => m(r, t, void 0, void 0, {
  userInvocationTable: d,
  async: !1
});
function R(r, t, e) {
  const n = (p, s) => M(p, {
    ForEach: ({ forEach: l, select: o }) => s.flatMap((i) => e(i, l).flatMap(
      (u) => n(h({ select: o }), [u])
    )),
    ForEachOrNull: ({ forEachOrNull: l, select: o }) => s.flatMap((i) => {
      const a = e(i, l);
      return a.length === 0 ? n(h({ select: o }), [{}]) : a.flatMap(
        (u) => n(h({ select: o }), [u])
      );
    }),
    Select: ({ select: l }) => f.flatMap(s, (o) => f.reduce(l, [], (i, a) => {
      const u = n(a, [o]);
      return i.length === 0 ? u : f.flatMap(i, (g) => f.map(u, (y) => ({
        ...g,
        ...y
      })));
    })),
    UnionAll: ({ unionAll: l }) => l.flatMap((o) => n(o, s)),
    Column: ({ column: l }) => f.map(
      s,
      (o) => f.reduce(l, {}, (i, a) => N(
        e(o, a.path),
        (u) => S(
          i,
          a.name,
          a.collection ? u : u[0] ?? null
        )
      ))
    )
  });
  return n(r, t);
}
function W(r, t) {
  let e = r.filter(
    (p) => p.resourceType === t.resource
  );
  if (e.length === 0)
    return [];
  const n = (p, s) => m(p, s, {}, void 0, {
    async: !1,
    userInvocationTable: d
  });
  for (const { path: p } of t.where ?? [])
    e = f.filter(e, (s) => n(s, `where(${p})`).length > 0);
  return R(t, e, n);
}
export {
  T as evaluateSync,
  W as flat,
  R as project
};
