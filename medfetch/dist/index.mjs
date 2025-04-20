import { Schema as t, ParseResult as m, Data as k, Stream as l, Effect as i, Array as w, Option as p, Chunk as P, pipe as x } from "effect";
import { flat as A } from "./sof.mjs";
import { v as E, C as T, c as D } from "./view-bvE2dEbi.mjs";
import { F as N, b as V, n as q, S as G, U as H } from "./view-bvE2dEbi.mjs";
const U = t.Struct(
  {
    id: t.String,
    resourceType: t.String
  },
  { key: t.String, value: t.Any }
);
function d(e, n) {
  if (!e) return U;
  const r = {
    id: t.String,
    resourceType: t.tag(e),
    ...n
  }, s = t.Struct(r);
  return t.declare(
    [s],
    {
      decode: (o) => (a, c, u) => m.decodeUnknown(o)(a, c),
      encode: (o) => (a, c, u) => m.encodeUnknown(o)(a, c)
    },
    {
      description: `Resource<${e}>`
    }
  );
}
function $(e) {
  return t.Struct({
    link: t.String.pipe(
      t.Array,
      t.optionalWith({ exact: !0 })
    ),
    fullUrl: t.String.pipe(t.optionalWith({ exact: !0 })),
    resource: e.pipe(t.optionalWith({ exact: !0 }))
  });
}
const v = t.Struct({
  relation: t.String,
  url: t.String
}), B = v, C = d("Bundle", {
  link: B.pipe(t.Array),
  entry: $(d()).pipe(t.Array)
}), I = t.decodeUnknown(C);
class S extends k.TaggedError("Data") {
}
const g = (e) => w.findFirst(e.link, (n) => n.relation === "next").pipe(
  p.map((n) => n.url)
), h = (e) => i.tryPromise(() => fetch(e)).pipe(
  i.andThen(
    (n) => i.liftPredicate(
      n,
      (r) => r.ok,
      (r) => new S({
        message: `Response not ok! Status: ${r.status} `
      })
    )
  ),
  i.andThen((n) => i.tryPromise(() => n.json())),
  i.flatMap(I)
), L = (e, n) => async function* (r, s) {
  const o = r < 0 ? 1 / 0 : r;
  let a = 0;
  const c = await i.runPromise(
    h(`${e}/${n}?_count=${s}`)
  );
  yield c, a += c.entry.length;
  let u = g(c);
  for (; p.isSome(u) && a < o; ) {
    const y = p.getOrThrow(u), f = await i.runPromise(h(y));
    yield f, a++, u = g(f);
  }
}, O = (e, n, r = 100, s = 250) => l.fromAsyncIterable(
  L(e, n)(r, s),
  (o) => new S({ message: String(o) })
);
function R(e) {
  return x(
    e.split("."),
    (n) => n[n.length - 1]
  );
}
function _(e, n) {
  return E({
    resource: e,
    status: "active",
    select: [
      T({
        column: n.map(
          (r) => D({
            path: r,
            name: R(r)
          })
        )
      })
    ]
  });
}
function j(e) {
  return async function(r, s) {
    return O(e, r).pipe(
      // Bundle.entry.resource
      l.map((o) => o.entry.map((a) => a.resource)),
      l.flattenIterables,
      l.filter((o) => !!o),
      l.runCollect,
      i.andThen(P.toArray),
      // Flatten it
      i.andThen(
        (o) => A(
          o,
          _(r, s)
        )
      ),
      // Run through Promise
      i.runPromise
    );
  };
}
export {
  T as column,
  D as columnPath,
  A as flat,
  N as forEach,
  V as forEachOrNull,
  j as medfetch,
  q as normalize,
  G as select,
  H as unionAll,
  E as viewDefinition
};
