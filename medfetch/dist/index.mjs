import { Schema as e, String as C, pipe as v, Array as o, Data as R, identity as ae, ParseResult as S, Option as E, Match as d, Stream as x, Effect as m, Chunk as re } from "effect";
import { flat as ie } from "./sof.mjs";
import { v as ce, C as oe, c as ue } from "./view-wKnUKvlF.mjs";
import { F as St, a as gt, n as ft, S as yt, U as ht } from "./view-wKnUKvlF.mjs";
const B = e.Literal(
  "Resource",
  "BackboneElement",
  "Reference",
  "Extension",
  "System.String",
  "positiveInt",
  "string",
  "boolean",
  "Period",
  "Identifier",
  "uri",
  "code",
  "Meta",
  "Narrative",
  "CodeableConcept",
  "date",
  "ContactDetail",
  "markdown",
  "dateTime",
  "Dosage",
  "Expression",
  "canonical",
  "Quantity",
  "RelatedArtifact",
  "Age",
  "Duration",
  "Range",
  "Timing",
  "UsageContext",
  "decimal",
  "Annotation",
  "instant",
  "unsignedInt",
  "base64Binary",
  "url",
  "Coding",
  "integer",
  "Attachment",
  "Signature",
  "ContactPoint",
  "Money",
  "Address",
  "time",
  "Element",
  "ProdCharacteristic",
  "ProductShelfLife",
  "Ratio",
  "id",
  "Contributor",
  "Count",
  "DataRequirement",
  "Distance",
  "HumanName",
  "oid",
  "ParameterDefinition",
  "SampledData",
  "TriggerDefinition",
  "uuid",
  "MarketingStatus",
  "Population",
  "xhtml",
  "ElementDefinition",
  "SubstanceAmount",
  "System.Boolean",
  "System.Date",
  "System.DateTime",
  "System.Decimal",
  "System.Integer",
  "System.Time"
), se = (a) => typeof a == "string" && B.literals.includes(a), le = e.Literal(
  "0.01",
  "0.05",
  "0.06",
  "0.11",
  "0.0",
  "0.0.80",
  "0.0.81",
  "0.0.82",
  "0.4",
  "0.4.0",
  "0.5",
  "0.5.0",
  "1.0",
  "1.0.0",
  "1.0.1",
  "1.0.2",
  "1.1",
  "1.1.0",
  "1.4",
  "1.4.0",
  "1.6",
  "1.6.0",
  "1.8",
  "1.8.0",
  "3.0",
  "3.0.0",
  "3.0.1",
  "3.0.2",
  "3.3",
  "3.3.0",
  "3.5",
  "3.5.0",
  "4.0",
  "4.0.0",
  "4.0.1",
  "4.1",
  "4.1.0",
  "4.2",
  "4.2.0",
  "4.3",
  "4.3.0",
  "4.3.0-cibuild",
  "4.3.0-snapshot1",
  "4.4",
  "4.4.0",
  "4.5",
  "4.5.0",
  "4.6",
  "4.6.0",
  "5.0",
  "5.0.0",
  "5.0.0-cibuild",
  "5.0.0-snapshot1",
  "5.0.0-snapshot2",
  "5.0.0-ballot",
  "5.0.0-snapshot3",
  "5.0.0-draft-final"
);
e.Literal(
  "Account",
  "ActivityDefinition",
  "AdverseEvent",
  "AllergyIntolerance",
  "Appointment",
  "AppointmentResponse",
  "AuditEvent",
  "Basic",
  "Binary",
  "BiologicallyDerivedProduct",
  "BodyStructure",
  "Bundle",
  "CapabilityStatement",
  "CarePlan",
  "CareTeam",
  "CatalogEntry",
  "ChargeItem",
  "ChargeItemDefinition",
  "Claim",
  "ClaimResponse",
  "ClinicalImpression",
  "CodeSystem",
  "Communication",
  "CommunicationRequest",
  "CompartmentDefinition",
  "Composition",
  "ConceptMap",
  "Condition",
  "Consent",
  "Contract",
  "Coverage",
  "CoverageEligibilityRequest",
  "CoverageEligibilityResponse",
  "DetectedIssue",
  "Device",
  "DeviceDefinition",
  "DeviceMetric",
  "DeviceRequest",
  "DeviceUseStatement",
  "DiagnosticReport",
  "DocumentManifest",
  "DocumentReference",
  "DomainResource",
  "EffectEvidenceSynthesis",
  "Encounter",
  "Endpoint",
  "EnrollmentRequest",
  "EnrollmentResponse",
  "EpisodeOfCare",
  "EventDefinition",
  "Evidence",
  "EvidenceVariable",
  "ExampleScenario",
  "ExplanationOfBenefit",
  "FamilyMemberHistory",
  "Flag",
  "Goal",
  "GraphDefinition",
  "Group",
  "GuidanceResponse",
  "HealthcareService",
  "ImagingStudy",
  "Immunization",
  "ImmunizationEvaluation",
  "ImmunizationRecommendation",
  "ImplementationGuide",
  "InsurancePlan",
  "Invoice",
  "Library",
  "Linkage",
  "List",
  "Location",
  "Measure",
  "MeasureReport",
  "Media",
  "Medication",
  "MedicationAdministration",
  "MedicationDispense",
  "MedicationKnowledge",
  "MedicationRequest",
  "MedicationStatement",
  "MedicinalProduct",
  "MedicinalProductAuthorization",
  "MedicinalProductContraindication",
  "MedicinalProductIndication",
  "MedicinalProductIngredient",
  "MedicinalProductInteraction",
  "MedicinalProductManufactured",
  "MedicinalProductPackaged",
  "MedicinalProductPharmaceutical",
  "MedicinalProductUndesirableEffect",
  "MessageDefinition",
  "MessageHeader",
  "MetadataResource",
  "MolecularSequence",
  "NamingSystem",
  "NutritionOrder",
  "Observation",
  "ObservationDefinition",
  "OperationDefinition",
  "OperationOutcome",
  "Organization",
  "OrganizationAffiliation",
  "Parameters",
  "Patient",
  "PaymentNotice",
  "PaymentReconciliation",
  "Person",
  "PlanDefinition",
  "Practitioner",
  "PractitionerRole",
  "Procedure",
  "Provenance",
  "Questionnaire",
  "QuestionnaireResponse",
  "RelatedPerson",
  "RequestGroup",
  "ResearchDefinition",
  "ResearchElementDefinition",
  "ResearchStudy",
  "ResearchSubject",
  "RiskAssessment",
  "RiskEvidenceSynthesis",
  "Schedule",
  "SearchParameter",
  "ServiceRequest",
  "Slot",
  "Specimen",
  "SpecimenDefinition",
  "StructureDefinition",
  "StructureMap",
  "Subscription",
  "Substance",
  "SubstanceNucleicAcid",
  "SubstancePolymer",
  "SubstanceProtein",
  "SubstanceReferenceInformation",
  "SubstanceSourceMaterial",
  "SubstanceSpecification",
  "SupplyDelivery",
  "SupplyRequest",
  "Task",
  "TerminologyCapabilities",
  "TestReport",
  "TestScript",
  "ValueSet",
  "VerificationResult",
  "VisionPrescription"
);
const U = e.Literal(
  "base64Binary",
  "boolean",
  "canonical",
  "code",
  "date",
  "dateTime",
  "decimal",
  "id",
  "instant",
  "integer",
  "oid",
  "string",
  "positiveInt",
  "time",
  "unsignedInt",
  "uri",
  "url",
  "uuid"
), de = e.Literal(
  ...U.literals.map((a) => C.capitalize(a))
);
e.TemplateLiteral(e.Literal("value"), de);
const F = (a) => `value${C.capitalize(a)}`;
U.literals.map(F);
function me(a) {
  return v(
    a,
    Object.keys,
    o.findFirst((n) => n.startsWith("value"))
  );
}
function pe(a) {
  return v(
    a,
    C.replace("value", ""),
    C.uncapitalize
  );
}
const Se = e.String, ge = e.Boolean, fe = e.String, ye = e.String, he = e.String, xe = e.String, ve = e.Number, Ae = e.String, Ce = e.String, Ee = e.Int, Pe = e.String, De = e.String, V = e.Positive.pipe(e.int()), Re = e.String, be = e.NonNegativeInt, Me = e.String, we = e.String, Ie = e.String, t = e.optionalWith, $ = e.Struct({
  start: t(e.String, { exact: !0 }),
  end: t(e.String, { exact: !0 })
}), P = e.Struct({
  system: t(e.String, { exact: !0 }),
  version: t(e.String, { exact: !0 }),
  code: t(e.String, { exact: !0 }),
  display: t(e.String, { exact: !0 }),
  userSelected: t(e.Boolean, { exact: !0 })
}), q = e.Struct({
  text: e.optionalWith(e.String, { exact: !0 }),
  coding: t(e.Array(P), { exact: !0 })
}), D = e.Struct({
  value: t(e.Number, { exact: !0 }),
  comparator: t(e.Literal(">", "<=", ">=", ">"), { exact: !0 }),
  unit: t(e.String, { exact: !0 }),
  system: t(e.String, { exact: !0 }),
  code: t(e.String, { exact: !0 })
});
D.pick("value", "unit");
const Te = e.Struct({
  low: t(D.pick("value", "unit"), { exact: !0 }),
  high: t(D.pick("value", "unit"), { exact: !0 })
}), Oe = e.Struct({
  system: t(
    e.Literal("phone", "fax", "email", "pager", "url", "sms", "other"),
    { exact: !0 }
  ),
  value: t(e.String, { exact: !0 }),
  use: t(e.Literal("home", "work", "temp", "old", "mobile"), {
    exact: !0
  }),
  rank: t(V, { exact: !0 }),
  period: t($, { exact: !0 })
}), ke = e.Struct({
  name: t(e.String, { exact: !0 }),
  telecom: t(e.Array(Oe), { exact: !0 })
}), Ne = e.Struct({
  versionId: t(e.String, { exact: !0 }),
  lastUpdated: t(e.String, { exact: !0 }),
  source: t(e.String, { exact: !0 }),
  profile: t(e.Array(e.String), { exact: !0 }),
  security: t(e.Array(P), { exact: !0 }),
  tag: t(e.Array(P), { exact: !0 })
}), z = e.Struct({
  use: e.optionalWith(
    e.Literal("usual", "official", "temp", "secondary", "old"),
    { exact: !0 }
  ),
  type: t(q, { exact: !0 }),
  system: t(e.String, { exact: !0 }),
  value: t(e.String, { exact: !0 }),
  period: t($, { exact: !0 }),
  assigner: t(
    e.suspend(() => G),
    { exact: !0 }
  )
}), Le = z, G = e.Struct({
  reference: t(e.String, { exact: !0 }),
  type: t(e.String, { exact: !0 }),
  identifier: t(
    e.suspend(() => z),
    { exact: !0 }
  ),
  display: t(e.String, { exact: !0 })
}), _e = e.Struct({
  code: P,
  valueCodeableConcept: t(q, { exact: !0 }),
  valueQuantity: t(D, { exact: !0 }),
  valueRange: t(Te, { exact: !0 }),
  valueReference: t(G, { exact: !0 })
}), Be = e.Struct({
  name: e.String,
  value: e.String
}), Ue = e.Struct({
  path: e.String,
  name: e.String,
  description: t(e.String, { exact: !0 }),
  collection: t(e.Boolean, { exact: !0, default: () => !1 }),
  type: t(e.String, { exact: !0 }),
  tags: t(e.Array(Be), { exact: !0, default: () => [] })
}), I = Ue, W = e.Struct({
  path: e.String,
  description: t(e.String, { exact: !0 })
}), w = e.Struct({
  column: t(e.Array(I), {
    exact: !0
  }),
  select: t(
    e.Array(
      e.suspend(
        () => w
      )
    ),
    { exact: !0 }
  ),
  forEach: t(e.String, { exact: !0 }),
  forEachOrNull: t(e.String, { exact: !0 }),
  unionAll: t(
    e.Array(
      e.suspend(
        () => w
      )
    ),
    { exact: !0 }
  )
}), K = w, Q = e.Struct({
  name: e.String,
  valueBase64Binary: t(Se, { exact: !0 }),
  valueBoolean: t(ge, { exact: !0 }),
  valueCanonical: t(fe, { exact: !0 }),
  valueCode: t(ye, { exact: !0 }),
  valueDate: t(he, { exact: !0 }),
  valueDateTime: t(xe, { exact: !0 }),
  valueDecimal: t(ve, { exact: !0 }),
  valueId: t(Ae, { exact: !0 }),
  valueInstant: t(Ce, { exact: !0 }),
  valueInteger: t(Ee, { exact: !0 }),
  valueOid: t(Pe, { exact: !0 }),
  valuePositiveInt: t(V, { exact: !0 }),
  valueString: t(De, { exact: !0 }),
  valueTime: t(Re, { exact: !0 }),
  valueUnsignedInt: t(be, { exact: !0 }),
  valueUri: t(Me, { exact: !0 }),
  valueUrl: t(we, { exact: !0 }),
  valueUuid: t(Ie, { exact: !0 })
}), H = Q, Fe = e.Struct({
  status: e.Literal("draft", "active", "retired", "unknown"),
  url: t(e.String, { exact: !0 }),
  identifier: t(e.Array(Le), { exact: !0 }),
  name: t(e.String, { exact: !0 }),
  title: t(e.String, { exact: !0 }),
  meta: t(Ne, { exact: !0 }),
  experimental: t(e.Boolean, { exact: !0 }),
  publisher: t(e.String, { exact: !0 }),
  contact: t(e.Array(ke), { exact: !0 }),
  description: t(e.String, { exact: !0 }),
  useContext: t(_e, { exact: !0 }),
  copyright: t(e.String, { exact: !0 }),
  resource: e.String,
  fhirVersion: t(le, { exact: !0 }),
  constant: t(e.Array(Q), {
    exact: !0
  }),
  where: t(e.Array(W), { exact: !0 }),
  select: e.NonEmptyArray(K)
}), A = Fe;
R.case();
e.decodeUnknownSync(A);
e.decodeSync(A);
e.is(e.encodedSchema(A));
const Ve = e.Struct(
  {
    resourceType: e.String
  },
  { key: e.String, value: e.Any }
), $e = Ve, qe = e.Struct({
  name: e.Literal("sql"),
  value: e.Union(
    e.Literal("NOT NULL"),
    e.TemplateLiteral("REFERENCES ", e.String)
  )
}), j = qe, ze = e.is(j), Ge = I.pipe(
  e.typeSchema,
  e.pick("path", "name", "collection"),
  e.required
).pipe(
  e.extend(
    e.Struct({
      type: B,
      tags: e.Array(j)
    })
  )
), We = Ge, Ke = e.transform(
  e.typeSchema(I),
  We,
  {
    strict: !0,
    decode: ({ tags: a, type: n, ...r }) => v(
      a,
      o.filter((i) => ze(i)),
      o.dedupeWith((i, c) => i.value === c.value),
      (i) => ({
        ...r,
        tags: i,
        type: se(n) ? n : "System.String"
      })
    ),
    encode: ae
  }
), J = Ke, g = e.decodeOption(J), { Select: p, Column: f, ForEach: k, ForEachOrNull: N, UnionAll: y, $match: lt } = R.taggedEnum(), h = e.Union(
  e.TaggedStruct("Column", {
    column: e.Array(e.typeSchema(J))
  }),
  e.TaggedStruct("Select", {
    select: e.Array(e.suspend(() => h))
  }),
  e.TaggedStruct("ForEach", {
    forEach: e.String,
    select: e.Array(e.suspend(() => h))
  }),
  e.TaggedStruct("ForEachOrNull", {
    forEachOrNull: e.String,
    select: e.Array(e.suspend(() => h))
  }),
  e.TaggedStruct("UnionAll", {
    unionAll: e.Array(e.suspend(() => h))
  })
);
function l(a) {
  return d.value(a).pipe(
    d.when(
      {
        forEach: d.defined,
        forEachOrNull: d.defined
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(a, null, 2)}`
        );
      }
    ),
    d.when(
      {
        forEach: d.defined
      },
      ({ forEach: n, select: r = [], unionAll: i, column: c }) => k({
        forEach: n,
        select: [
          ...i ? [
            y({
              unionAll: i.map(
                (u) => l(u)
              )
            })
          ] : [],
          ...c ? [
            f({
              column: o.filterMap(
                c,
                (u) => g(
                  u
                )
              )
            })
          ] : [],
          ...r.map(l)
        ]
      })
    ),
    d.when(
      {
        forEachOrNull: d.defined
      },
      ({ forEachOrNull: n, select: r = [], unionAll: i, column: c }) => N({
        forEachOrNull: n,
        select: [
          ...i ? [
            y({
              unionAll: i.map(
                (u) => l(u)
              )
            })
          ] : [],
          ...c ? [
            f({
              column: o.filterMap(
                c,
                (u) => g(
                  u
                )
              )
            })
          ] : [],
          ...r.map(l)
        ]
      })
    ),
    d.when(
      {
        column: o.isArray,
        select: o.isArray,
        unionAll: o.isArray
      },
      ({ column: n = [], select: r = [], unionAll: i = [] }) => p({
        select: [
          y({
            unionAll: i.map(l)
          }),
          f({
            column: o.filterMap(
              n,
              (c) => g(c)
            )
          }),
          ...r.map(l)
        ]
      })
    ),
    d.when(
      {
        unionAll: o.isArray,
        select: o.isArray
      },
      ({ unionAll: n = [], select: r = [] }) => p({
        select: [
          y({
            unionAll: n.map(l)
          }),
          ...r.map(l)
        ]
      })
    ),
    d.when(
      {
        select: o.isArray,
        column: o.isArray
      },
      ({ select: n = [], column: r = [] }) => p({
        select: [
          f({
            column: o.filterMap(
              r,
              (i) => g(i)
            )
          }),
          ...n.map(l)
        ]
      })
    ),
    d.when(
      {
        column: o.isArray,
        unionAll: o.isArray
      },
      ({ column: n = [], unionAll: r = [], select: i = [] }) => p({
        select: [
          f({
            column: o.filterMap(
              n,
              (c) => g(c)
            )
          }),
          y({
            unionAll: r.map(l)
          }),
          ...i.map(l)
        ]
      })
    ),
    d.when(
      {
        select: o.isArray
      },
      ({ select: n = [] }) => p({
        select: n.map(l)
      })
    ),
    d.orElse((n) => {
      var r, i;
      return n.unionAll ? y({
        unionAll: n.unionAll.map(l)
      }) : n.column ? f({
        column: o.filterMap(
          n.column,
          (c) => g(c)
        )
      }) : n.forEach ? k({
        forEach: n.forEach,
        select: ((r = n.select) == null ? void 0 : r.map(l)) ?? []
      }) : n.forEachOrNull ? N({
        forEachOrNull: n.forEachOrNull,
        select: ((i = n.select) == null ? void 0 : i.map(l)) ?? []
      }) : n.select ? p({
        select: n.select.map(l)
      }) : p({
        select: []
      });
    })
  );
}
const Qe = e.transform(K, h, {
  strict: !0,
  encode: ({ _tag: a, ...n }) => n,
  decode: (a) => l(a)
}), He = e.decodeSync(Qe), s = (a) => H.pipe(
  e.pick(F(a), "name"),
  e.required,
  e.attachPropertySignature("_tag", a)
), je = e.Union(
  s("boolean"),
  s("base64Binary"),
  s("canonical"),
  s("code"),
  s("date"),
  s("dateTime"),
  s("decimal"),
  s("id"),
  s("instant"),
  s("integer"),
  s("oid"),
  s("string"),
  s("positiveInt"),
  s("time"),
  s("unsignedInt"),
  s("uri"),
  s("url"),
  s("uuid")
), T = H.pipe(
  (a) => e.transformOrFail(
    e.typeSchema(a),
    e.typeSchema(je),
    {
      strict: !0,
      decode: (n, r, i) => v(
        n,
        me,
        E.match({
          onNone: () => S.fail(
            new S.Type(
              i,
              n,
              "Failed to extract at least 1 value[x] key"
            )
          ),
          onSome: (c) => {
            if (n[c] === void 0)
              return S.fail(
                new S.Type(
                  i,
                  n,
                  "data[value[x]] present with undefined value"
                )
              );
            const u = {
              _tag: pe(c),
              name: n.name,
              [c]: n[c]
            };
            return S.succeed(u);
          }
        })
      ),
      encode: ({ _tag: n, ...r }) => S.succeed(r)
    }
  )
), Je = e.decodeOption(T);
e.decode(T);
const Xe = A.pipe(
  // strip the fields we are transforming from the Data type
  e.omit("constant", "select", "where", "name"),
  // A ViewDefinition is every a Node is and more.
  // namely it has a NonEmpty Select + is the only node
  // allowed to have a 'where' clause
  e.extend(
    e.Struct({
      _tag: e.tag("Select"),
      select: e.NonEmptyArray(h),
      constant: e.Array(T),
      where: e.Array(W),
      name: e.String
    })
  )
), Ye = e.transform(
  e.typeSchema(A),
  e.typeSchema(Xe),
  {
    strict: !0,
    decode: ({ name: a, where: n, constant: r, select: i, ...c }) => ({
      ...c,
      _tag: "Select",
      name: a ?? c.resource,
      select: o.map(i, (u) => He(u)),
      constant: o.filterMap(
        r ?? [],
        (u) => Je(u)
      ),
      where: n ?? []
    }),
    encode: ({ _tag: a, ...n }) => n
  }
), X = Ye;
e.decode(X);
e.decodeSync(X);
R.tagged("Select");
const Ze = e.Struct({
  relation: e.String,
  url: e.String
}), Y = Ze, et = e.Struct({
  fullUrl: t(e.String, { exact: !0 }),
  link: t(e.Array(Y), { exact: !0 }),
  resource: t($e, { exact: !0 })
}), tt = et;
e.Literal(
  "document",
  "message",
  "transaction",
  "transaction-response",
  "batch",
  "batch-response",
  "history",
  "searchset",
  "collection",
  "subscription-notification"
);
const Z = e.Struct({
  resourceType: e.tag("Bundle"),
  link: t(e.Array(Y), { exact: !0, default: () => [] }),
  entry: t(e.Array(tt), { exact: !0, default: () => [] })
}), ee = Z;
Z.make;
const nt = e.decodeUnknown(ee);
e.is(ee);
class te extends R.TaggedError("Data") {
}
const L = (a) => o.findFirst(a.link, (n) => n.relation === "next").pipe(
  E.map((n) => n.url)
), _ = (a) => m.tryPromise(() => fetch(a)).pipe(
  m.andThen(
    (n) => m.liftPredicate(
      n,
      (r) => r.ok,
      (r) => new te({
        message: `Response not ok! Status: ${r.status} `
      })
    )
  ),
  m.andThen((n) => m.tryPromise(() => n.json())),
  m.flatMap(nt)
), at = (a, n) => async function* (r, i) {
  const c = r < 0 ? 1 / 0 : r;
  let u = 0;
  const b = await m.runPromise(
    _(`${a}/${n}?_count=${i}`)
  );
  yield b, u += b.entry.length;
  let M = L(b);
  for (; E.isSome(M) && u < c; ) {
    const ne = E.getOrThrow(M), O = await m.runPromise(_(ne));
    yield O, u++, M = L(O);
  }
}, rt = (a, n, r = 100, i = 250) => x.fromAsyncIterable(
  at(a, n)(r, i),
  (c) => new te({ message: String(c) })
);
function it(a) {
  return v(
    a.split("."),
    (n) => n[n.length - 1]
  );
}
function ct(a, n) {
  return ce({
    resource: a,
    status: "active",
    select: [
      oe({
        column: n.map(
          (r) => ue({
            path: r,
            name: it(r)
          })
        )
      })
    ]
  });
}
function dt(a) {
  return async function(r, i) {
    return rt(a, r).pipe(
      // Bundle.entry.resource
      x.map((c) => c.entry.map((u) => u.resource)),
      x.flattenIterables,
      x.filter((c) => !!c),
      x.runCollect,
      m.andThen(re.toArray),
      // Flatten it
      m.andThen(
        (c) => ie(
          c,
          ct(r, i)
        )
      ),
      // Run through Promise
      m.runPromise
    );
  };
}
export {
  oe as column,
  ue as columnPath,
  dt as default,
  ie as flat,
  St as forEach,
  gt as forEachOrNull,
  ft as normalize,
  yt as select,
  ht as unionAll,
  ce as viewDefinition
};
