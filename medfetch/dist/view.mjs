import { Schema as e, Data as v, Match as u, Array as n } from "effect";
const t = e.optionalWith, C = e.Struct({
  path: e.String,
  description: t(e.String, { exact: !0 })
}), T = e.Struct({
  name: e.String,
  valueBase64Binary: t(e.String, { exact: !0 }),
  valueBoolean: t(e.String, { exact: !0 }),
  valueCanonical: t(e.String, { exact: !0 }),
  valueCode: t(e.String, { exact: !0 }),
  valueDate: t(e.String, { exact: !0 }),
  valueDateTime: t(e.String, { exact: !0 }),
  valueDecimal: t(e.String, { exact: !0 }),
  valueId: t(e.String, { exact: !0 }),
  valueInstant: t(e.Number, { exact: !0 }),
  valueInteger: t(e.Number, { exact: !0 }),
  valueOid: t(e.String, { exact: !0 }),
  valuePositiveInt: t(e.Number, { exact: !0 }),
  valueString: t(e.String, { exact: !0 }),
  valueTime: t(e.String, { exact: !0 }),
  valueUnsignedInt: t(e.Number, { exact: !0 }),
  valueUri: t(e.String, { exact: !0 }),
  valueUrl: t(e.String, { exact: !0 }),
  valueUuid: t(e.String, { exact: !0 })
}), M = T, U = e.Struct({
  name: e.String,
  value: e.String
}), N = U, D = e.is(N), O = e.Struct({
  path: e.String,
  name: e.String,
  description: t(e.String, { exact: !0 }),
  collection: t(e.Boolean, { exact: !0 }),
  type: t(e.String, { exact: !0 }),
  tags: t(e.Array(N), { exact: !0 })
}), A = O, I = O.make, p = e.decodeOption(A), x = e.Struct({
  column: t(e.Array(A), {
    exact: !0
  }),
  select: t(
    e.Array(
      e.suspend(() => x)
    ),
    { exact: !0 }
  ),
  forEach: t(e.String, { exact: !0 }),
  forEachOrNull: t(e.String, { exact: !0 }),
  unionAll: t(
    e.Array(
      e.suspend(() => x)
    ),
    { exact: !0 }
  )
}), { Select: S, Column: h, ForEach: y, ForEachOrNull: E, UnionAll: f, $match: F } = v.taggedEnum(), d = e.Union(
  e.TaggedStruct("Column", {
    column: e.Array(e.typeSchema(A))
  }),
  e.TaggedStruct("Select", {
    select: e.Array(e.suspend(() => d))
  }),
  e.TaggedStruct("ForEach", {
    forEach: e.String,
    select: e.Array(e.suspend(() => d))
  }),
  e.TaggedStruct("ForEachOrNull", {
    forEachOrNull: e.String,
    select: e.Array(e.suspend(() => d))
  }),
  e.TaggedStruct("UnionAll", {
    unionAll: e.Array(e.suspend(() => d))
  })
);
function l(g) {
  return u.value(g).pipe(
    u.when(
      {
        forEach: u.defined,
        forEachOrNull: u.defined
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(g, null, 2)}`
        );
      }
    ),
    u.when(
      {
        forEach: u.defined
      },
      ({ forEach: r, select: a = [], unionAll: c, column: i }) => y({
        forEach: r,
        select: [
          ...c ? [
            f({
              unionAll: c.map(
                (o) => l(o)
              )
            })
          ] : [],
          ...i ? [
            h({
              column: n.filterMap(
                i,
                (o) => p(
                  o
                )
              )
            })
          ] : [],
          ...a.map(l)
        ]
      })
    ),
    u.when(
      {
        forEachOrNull: u.defined
      },
      ({ forEachOrNull: r, select: a = [], unionAll: c, column: i }) => E({
        forEachOrNull: r,
        select: [
          ...c ? [
            f({
              unionAll: c.map(
                (o) => l(o)
              )
            })
          ] : [],
          ...i ? [
            h({
              column: n.filterMap(
                i,
                (o) => p(
                  o
                )
              )
            })
          ] : [],
          ...a.map(l)
        ]
      })
    ),
    u.when(
      {
        column: n.isArray,
        select: n.isArray,
        unionAll: n.isArray
      },
      ({ column: r = [], select: a = [], unionAll: c = [] }) => S({
        select: [
          f({
            unionAll: c.map(l)
          }),
          h({
            column: n.filterMap(
              r,
              (i) => p(i)
            )
          }),
          ...a.map(l)
        ]
      })
    ),
    u.when(
      {
        unionAll: n.isArray,
        select: n.isArray
      },
      ({ unionAll: r = [], select: a = [] }) => S({
        select: [
          f({
            unionAll: r.map(l)
          }),
          ...a.map(l)
        ]
      })
    ),
    u.when(
      {
        select: n.isArray,
        column: n.isArray
      },
      ({ select: r = [], column: a = [] }) => S({
        select: [
          h({
            column: n.filterMap(
              a,
              (c) => p(c)
            )
          }),
          ...r.map(l)
        ]
      })
    ),
    u.when(
      {
        column: n.isArray,
        unionAll: n.isArray
      },
      ({ column: r = [], unionAll: a = [], select: c = [] }) => S({
        select: [
          h({
            column: n.filterMap(
              r,
              (i) => p(i)
            )
          }),
          f({
            unionAll: a.map(l)
          }),
          ...c.map(l)
        ]
      })
    ),
    u.when(
      {
        select: n.isArray
      },
      ({ select: r = [] }) => S({
        select: r.map(l)
      })
    ),
    u.orElse((r) => {
      var a, c;
      return r.unionAll ? f({
        unionAll: r.unionAll.map(l)
      }) : r.column ? h({
        column: n.filterMap(
          r.column,
          (i) => p(i)
        )
      }) : r.forEach ? y({
        forEach: r.forEach,
        select: ((a = r.select) == null ? void 0 : a.map(l)) ?? []
      }) : r.forEachOrNull ? E({
        forEachOrNull: r.forEachOrNull,
        select: ((c = r.select) == null ? void 0 : c.map(l)) ?? []
      }) : r.select ? S({
        select: r.select.map(l)
      }) : S({
        select: []
      });
    })
  );
}
const b = e.transform(x, d, {
  strict: !0,
  encode: ({ _tag: g, ...r }) => r,
  decode: (g) => l(g)
}), P = e.decodeSync(b);
e.TaggedStruct("Select", {
  status: e.Literal("draft", "active", "retired", "unknown"),
  url: t(e.String, { exact: !0 }),
  name: t(e.String, { exact: !0 }),
  title: t(e.String, { exact: !0 }),
  experimental: t(e.Boolean, { exact: !0 }),
  publisher: t(e.String, { exact: !0 }),
  description: t(e.String, { exact: !0 }),
  copyright: t(e.String, { exact: !0 }),
  resource: e.String,
  constant: t(e.Array(M), {
    exact: !0
  }),
  where: t(e.Array(C), { exact: !0 }),
  select: e.NonEmptyArray(d)
});
const _ = v.tagged("Select");
function k(g, r = (a) => !0) {
  const a = (o, w) => F(w, {
    ForEach: ({ select: s }) => s.flatMap((m) => a(o, m)),
    ForEachOrNull: ({ select: s }) => s.flatMap((m) => a(o, m)),
    Select: ({ select: s }) => s.flatMap((m) => a(o, m)),
    UnionAll: ({ unionAll: s }) => s.flatMap((m) => a(o, m)),
    Column: ({ column: s }) => n.appendAll(o, s)
  });
  return a([], g).filter(r);
}
export {
  F as $match,
  h as Column,
  A as ColumnPath,
  M as Constant,
  y as ForEach,
  E as ForEachOrNull,
  S as Select,
  N as Tag,
  f as UnionAll,
  C as Where,
  I as columnPath,
  l as decodeSelect,
  k as getColumns,
  D as isTag,
  P as normalize,
  _ as viewDefinition
};
