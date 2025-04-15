import { Array as p, pipe as w, Record as M, Match as l } from "effect";
import { evaluate as m } from "fhirpath";
import { $match as N, Select as f } from "./view.mjs";
function C(t) {
  return l.value(t).pipe(
    l.when(void 0, () => "UNKNOWN"),
    l.when("http://loinc.org", () => "LOINC"),
    l.when("http://snomed.info/sct", () => "SCT"),
    l.when("http://www.ama-assn.org/go/cpt", () => "CPT"),
    l.when("http://hl7.org/fhir/sid/icd-10", () => "ICD10"),
    l.when("http://hl7.org/fhir/sid/icd-9", () => "ICD9"),
    l.when(
      "http://www.nlm.nih.gov/research/umls/rxnorm",
      () => "RXNORM"
    ),
    // Match.when((cs) => cs.startsWith("http://hl7.org/fhir/sid/icd"), () => "ICD"),
    l.when(
      (r) => r.startsWith("http://terminology.hl7.org"),
      () => "FHIR"
    ),
    l.orElse((r) => (console.error(`I don't know this code system ${r}`), "UNKNOWN"))
  );
}
function O({ reference: t }) {
  if (t === void 0)
    return null;
  if (t.startsWith("urn"))
    return t.slice(9);
  const r = t.split("/");
  return r.length === 2 ? r[1] : null;
}
const d = {
  getResourceKey: {
    fn: (t) => t.map((r) => r.id),
    arity: { 0: [] }
  },
  getReferenceKey: {
    fn: (t, r) => t.map((e) => O(e)),
    arity: { 0: [], 1: ["String"] }
  },
  code: {
    fn: (t) => t.flatMap((r) => {
      var e;
      return (e = r.coding) == null ? void 0 : e.map(
        (n) => `${C(n.system)}#${n.code ?? "NOCODE"}`
      );
    }),
    arity: { 0: [] }
  }
}, E = (t, r) => m(t, r, void 0, void 0, {
  userInvocationTable: d,
  async: !1
});
function R(t, r, e) {
  const n = (h, s) => N(h, {
    ForEach: ({ forEach: i, select: o }) => s.flatMap((c) => e(c, i).flatMap(
      (a) => n(f({ select: o }), [a])
    )),
    ForEachOrNull: ({ forEachOrNull: i, select: o }) => s.flatMap((c) => {
      const u = e(c, i);
      return u.length === 0 ? n(f({ select: o }), [{}]) : u.flatMap(
        (a) => n(f({ select: o }), [a])
      );
    }),
    Select: ({ select: i }) => p.flatMap(s, (o) => p.reduce(
      i,
      [],
      (c, u) => {
        const a = n(u, [o]);
        return c.length === 0 ? a : p.flatMap(c, (g) => p.map(a, (y) => ({
          ...g,
          ...y
        })));
      }
    )),
    UnionAll: ({ unionAll: i }) => i.flatMap((o) => n(o, s)),
    Column: ({ column: i }) => p.map(
      s,
      (o) => p.reduce(i, {}, (c, u) => w(
        e(o, u.path),
        (a) => M.set(
          c,
          u.name,
          u.collection ? a : a[0] ?? null
        )
      ))
    )
  });
  return n(t, r);
}
function K(t, r) {
  let e = r.filter(
    (h) => h.resourceType === t.resource
  );
  if (e.length === 0)
    return [];
  const n = (h, s) => m(h, s, {}, void 0, {
    async: !1,
    userInvocationTable: d
  });
  for (const { path: h } of t.where ?? [])
    e = p.filter(e, (s) => n(s, `where(${h})`).length > 0);
  return R(t, e, n);
}
export {
  E as evaluateSync,
  R as project,
  K as sof
};
