import { Column as ct, columnPath as ot, ForEach as ut, ForEachOrNull as st, normalize as lt, Select as dt, UnionAll as mt, viewDefinition as pt } from "./view.mjs";
import { Schema as e, String as E, pipe as v, Array as o, Data as D, identity as ne, ParseResult as S, Option as x, Match as d, Stream as _, Effect as m } from "effect";
import { sof as gt } from "./sof.mjs";
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
), re = (r) => typeof r == "string" && B.literals.includes(r), ae = e.Literal(
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
const F = e.Literal(
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
), ie = e.Literal(
  ...F.literals.map((r) => E.capitalize(r))
);
e.TemplateLiteral(e.Literal("value"), ie);
const U = (r) => `value${E.capitalize(r)}`;
F.literals.map(U);
function ce(r) {
  return v(
    r,
    Object.keys,
    o.findFirst((n) => n.startsWith("value"))
  );
}
function oe(r) {
  return v(
    r,
    E.replace("value", ""),
    E.uncapitalize
  );
}
const ue = e.String, se = e.Boolean, le = e.String, de = e.String, me = e.String, pe = e.String, Se = e.Number, ge = e.String, fe = e.String, ye = e.Int, he = e.String, xe = e.String, V = e.Positive.pipe(e.int()), ve = e.String, Ae = e.NonNegativeInt, Ee = e.String, Ce = e.String, Pe = e.String, t = e.optionalWith, $ = e.Struct({
  start: t(e.String, { exact: !0 }),
  end: t(e.String, { exact: !0 })
}), C = e.Struct({
  system: t(e.String, { exact: !0 }),
  version: t(e.String, { exact: !0 }),
  code: t(e.String, { exact: !0 }),
  display: t(e.String, { exact: !0 }),
  userSelected: t(e.Boolean, { exact: !0 })
}), q = e.Struct({
  text: e.optionalWith(e.String, { exact: !0 }),
  coding: t(e.Array(C), { exact: !0 })
}), P = e.Struct({
  value: t(e.Number, { exact: !0 }),
  comparator: t(e.Literal(">", "<=", ">=", ">"), { exact: !0 }),
  unit: t(e.String, { exact: !0 }),
  system: t(e.String, { exact: !0 }),
  code: t(e.String, { exact: !0 })
});
P.pick("value", "unit");
const De = e.Struct({
  low: t(P.pick("value", "unit"), { exact: !0 }),
  high: t(P.pick("value", "unit"), { exact: !0 })
}), Re = e.Struct({
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
}), be = e.Struct({
  name: t(e.String, { exact: !0 }),
  telecom: t(e.Array(Re), { exact: !0 })
}), Me = e.Struct({
  versionId: t(e.String, { exact: !0 }),
  lastUpdated: t(e.String, { exact: !0 }),
  source: t(e.String, { exact: !0 }),
  profile: t(e.Array(e.String), { exact: !0 }),
  security: t(e.Array(C), { exact: !0 }),
  tag: t(e.Array(C), { exact: !0 })
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
}), we = z, G = e.Struct({
  reference: t(e.String, { exact: !0 }),
  type: t(e.String, { exact: !0 }),
  identifier: t(
    e.suspend(() => z),
    { exact: !0 }
  ),
  display: t(e.String, { exact: !0 })
}), Ie = e.Struct({
  code: C,
  valueCodeableConcept: t(q, { exact: !0 }),
  valueQuantity: t(P, { exact: !0 }),
  valueRange: t(De, { exact: !0 }),
  valueReference: t(G, { exact: !0 })
}), Te = e.Struct({
  name: e.String,
  value: e.String
}), Oe = e.Struct({
  path: e.String,
  name: e.String,
  description: t(e.String, { exact: !0 }),
  collection: t(e.Boolean, { exact: !0, default: () => !1 }),
  type: t(e.String, { exact: !0 }),
  tags: t(e.Array(Te), { exact: !0, default: () => [] })
}), w = Oe, W = e.Struct({
  path: e.String,
  description: t(e.String, { exact: !0 })
}), M = e.Struct({
  column: t(e.Array(w), {
    exact: !0
  }),
  select: t(
    e.Array(
      e.suspend(
        () => M
      )
    ),
    { exact: !0 }
  ),
  forEach: t(e.String, { exact: !0 }),
  forEachOrNull: t(e.String, { exact: !0 }),
  unionAll: t(
    e.Array(
      e.suspend(
        () => M
      )
    ),
    { exact: !0 }
  )
}), K = M, Q = e.Struct({
  name: e.String,
  valueBase64Binary: t(ue, { exact: !0 }),
  valueBoolean: t(se, { exact: !0 }),
  valueCanonical: t(le, { exact: !0 }),
  valueCode: t(de, { exact: !0 }),
  valueDate: t(me, { exact: !0 }),
  valueDateTime: t(pe, { exact: !0 }),
  valueDecimal: t(Se, { exact: !0 }),
  valueId: t(ge, { exact: !0 }),
  valueInstant: t(fe, { exact: !0 }),
  valueInteger: t(ye, { exact: !0 }),
  valueOid: t(he, { exact: !0 }),
  valuePositiveInt: t(V, { exact: !0 }),
  valueString: t(xe, { exact: !0 }),
  valueTime: t(ve, { exact: !0 }),
  valueUnsignedInt: t(Ae, { exact: !0 }),
  valueUri: t(Ee, { exact: !0 }),
  valueUrl: t(Ce, { exact: !0 }),
  valueUuid: t(Pe, { exact: !0 })
}), H = Q, ke = e.Struct({
  status: e.Literal("draft", "active", "retired", "unknown"),
  url: t(e.String, { exact: !0 }),
  identifier: t(e.Array(we), { exact: !0 }),
  name: t(e.String, { exact: !0 }),
  title: t(e.String, { exact: !0 }),
  meta: t(Me, { exact: !0 }),
  experimental: t(e.Boolean, { exact: !0 }),
  publisher: t(e.String, { exact: !0 }),
  contact: t(e.Array(be), { exact: !0 }),
  description: t(e.String, { exact: !0 }),
  useContext: t(Ie, { exact: !0 }),
  copyright: t(e.String, { exact: !0 }),
  resource: e.String,
  fhirVersion: t(ae, { exact: !0 }),
  constant: t(e.Array(Q), {
    exact: !0
  }),
  where: t(e.Array(W), { exact: !0 }),
  select: e.NonEmptyArray(K)
}), A = ke;
D.case();
e.decodeUnknownSync(A);
e.decodeSync(A);
e.is(e.encodedSchema(A));
const Ne = e.Struct(
  {
    resourceType: e.String
  },
  { key: e.String, value: e.Any }
), Le = Ne, _e = e.Struct({
  name: e.Literal("sql"),
  value: e.Union(
    e.Literal("NOT NULL"),
    e.TemplateLiteral("REFERENCES ", e.String)
  )
}), j = _e, Be = e.is(j), Fe = w.pipe(
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
), Ue = Fe, Ve = e.transform(
  e.typeSchema(w),
  Ue,
  {
    strict: !0,
    decode: ({ tags: r, type: n, ...i }) => v(
      r,
      o.filter((a) => Be(a)),
      o.dedupeWith((a, c) => a.value === c.value),
      (a) => ({
        ...i,
        tags: a,
        type: re(n) ? n : "System.String"
      })
    ),
    encode: ne
  }
), J = Ve, g = e.decodeOption(J), { Select: p, Column: f, ForEach: O, ForEachOrNull: k, UnionAll: y, $match: nt } = D.taggedEnum(), h = e.Union(
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
function l(r) {
  return d.value(r).pipe(
    d.when(
      {
        forEach: d.defined,
        forEachOrNull: d.defined
      },
      () => {
        throw new TypeError(
          `Invalid SELECT node. Cannot have both a forEach and a forEachOrNull at the same level. Bad node is: ${JSON.stringify(r, null, 2)}`
        );
      }
    ),
    d.when(
      {
        forEach: d.defined
      },
      ({ forEach: n, select: i = [], unionAll: a, column: c }) => O({
        forEach: n,
        select: [
          ...a ? [
            y({
              unionAll: a.map(
                (s) => l(s)
              )
            })
          ] : [],
          ...c ? [
            f({
              column: o.filterMap(
                c,
                (s) => g(
                  s
                )
              )
            })
          ] : [],
          ...i.map(l)
        ]
      })
    ),
    d.when(
      {
        forEachOrNull: d.defined
      },
      ({ forEachOrNull: n, select: i = [], unionAll: a, column: c }) => k({
        forEachOrNull: n,
        select: [
          ...a ? [
            y({
              unionAll: a.map(
                (s) => l(s)
              )
            })
          ] : [],
          ...c ? [
            f({
              column: o.filterMap(
                c,
                (s) => g(
                  s
                )
              )
            })
          ] : [],
          ...i.map(l)
        ]
      })
    ),
    d.when(
      {
        column: o.isArray,
        select: o.isArray,
        unionAll: o.isArray
      },
      ({ column: n = [], select: i = [], unionAll: a = [] }) => p({
        select: [
          y({
            unionAll: a.map(l)
          }),
          f({
            column: o.filterMap(
              n,
              (c) => g(c)
            )
          }),
          ...i.map(l)
        ]
      })
    ),
    d.when(
      {
        unionAll: o.isArray,
        select: o.isArray
      },
      ({ unionAll: n = [], select: i = [] }) => p({
        select: [
          y({
            unionAll: n.map(l)
          }),
          ...i.map(l)
        ]
      })
    ),
    d.when(
      {
        select: o.isArray,
        column: o.isArray
      },
      ({ select: n = [], column: i = [] }) => p({
        select: [
          f({
            column: o.filterMap(
              i,
              (a) => g(a)
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
      ({ column: n = [], unionAll: i = [], select: a = [] }) => p({
        select: [
          f({
            column: o.filterMap(
              n,
              (c) => g(c)
            )
          }),
          y({
            unionAll: i.map(l)
          }),
          ...a.map(l)
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
      var i, a;
      return n.unionAll ? y({
        unionAll: n.unionAll.map(l)
      }) : n.column ? f({
        column: o.filterMap(
          n.column,
          (c) => g(c)
        )
      }) : n.forEach ? O({
        forEach: n.forEach,
        select: ((i = n.select) == null ? void 0 : i.map(l)) ?? []
      }) : n.forEachOrNull ? k({
        forEachOrNull: n.forEachOrNull,
        select: ((a = n.select) == null ? void 0 : a.map(l)) ?? []
      }) : n.select ? p({
        select: n.select.map(l)
      }) : p({
        select: []
      });
    })
  );
}
const $e = e.transform(K, h, {
  strict: !0,
  encode: ({ _tag: r, ...n }) => n,
  decode: (r) => l(r)
}), qe = e.decodeSync($e), u = (r) => H.pipe(
  e.pick(U(r), "name"),
  e.required,
  e.attachPropertySignature("_tag", r)
), ze = e.Union(
  u("boolean"),
  u("base64Binary"),
  u("canonical"),
  u("code"),
  u("date"),
  u("dateTime"),
  u("decimal"),
  u("id"),
  u("instant"),
  u("integer"),
  u("oid"),
  u("string"),
  u("positiveInt"),
  u("time"),
  u("unsignedInt"),
  u("uri"),
  u("url"),
  u("uuid")
), I = H.pipe(
  (r) => e.transformOrFail(
    e.typeSchema(r),
    e.typeSchema(ze),
    {
      strict: !0,
      decode: (n, i, a) => v(
        n,
        ce,
        x.match({
          onNone: () => S.fail(
            new S.Type(
              a,
              n,
              "Failed to extract at least 1 value[x] key"
            )
          ),
          onSome: (c) => {
            if (n[c] === void 0)
              return S.fail(
                new S.Type(
                  a,
                  n,
                  "data[value[x]] present with undefined value"
                )
              );
            const s = {
              _tag: oe(c),
              name: n.name,
              [c]: n[c]
            };
            return S.succeed(s);
          }
        })
      ),
      encode: ({ _tag: n, ...i }) => S.succeed(i)
    }
  )
), Ge = e.decodeOption(I);
e.decode(I);
const We = A.pipe(
  // strip the fields we are transforming from the Data type
  e.omit("constant", "select", "where", "name"),
  // A ViewDefinition is every a Node is and more.
  // namely it has a NonEmpty Select + is the only node
  // allowed to have a 'where' clause
  e.extend(
    e.Struct({
      _tag: e.tag("Select"),
      select: e.NonEmptyArray(h),
      constant: e.Array(I),
      where: e.Array(W),
      name: e.String
    })
  )
), Ke = e.transform(
  e.typeSchema(A),
  e.typeSchema(We),
  {
    strict: !0,
    decode: ({ name: r, where: n, constant: i, select: a, ...c }) => ({
      ...c,
      _tag: "Select",
      name: r ?? c.resource,
      select: o.map(a, (s) => qe(s)),
      constant: o.filterMap(
        i ?? [],
        (s) => Ge(s)
      ),
      where: n ?? []
    }),
    encode: ({ _tag: r, ...n }) => n
  }
), X = Ke;
e.decode(X);
e.decodeSync(X);
D.tagged("Select");
const Qe = e.Struct({
  relation: e.String,
  url: e.String
}), Y = Qe, He = e.Struct({
  fullUrl: t(e.String, { exact: !0 }),
  link: t(e.Array(Y), { exact: !0 }),
  resource: t(Le, { exact: !0 })
}), je = He;
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
  entry: t(e.Array(je), { exact: !0, default: () => [] })
}), ee = Z;
Z.make;
const Je = e.decodeUnknown(ee);
e.is(ee);
class Xe extends D.TaggedError("Data") {
}
const N = (r) => o.findFirst(r.link, (n) => n.relation === "next").pipe(
  x.map((n) => n.url)
), L = (r) => m.tryPromise(() => fetch(r)).pipe(
  m.flatMap(
    (n) => n.ok ? m.tryPromise(() => n.json()) : m.fail(
      new Error(`Response not ok! Status: ${n.status}`)
    )
  ),
  m.flatMap(Je)
), Ye = (r, n) => async function* (i, a) {
  const c = i < 0 ? 1 / 0 : i;
  let s = 0;
  const R = await m.runPromise(
    L(`${r}/${n}?_count=${a}`)
  );
  yield R, s += R.entry.length;
  let b = N(R);
  for (; x.isSome(b) && s < c; ) {
    const te = x.getOrThrow(b), T = await m.runPromise(L(te));
    yield T, s++, b = N(T);
  }
}, Ze = (r, n, i = 100, a = 250) => _.fromAsyncIterable(
  Ye(r, n)(i, a),
  (c) => new Xe({ message: String(c) })
), et = (r) => r.pipe(
  _.runFold(
    [],
    (n, i) => v(
      i.entry,
      o.filterMap(
        (a) => a.resource !== void 0 ? x.some(a.resource) : x.none()
      ),
      (a) => o.appendAll(n, a)
    )
  )
);
async function rt(...r) {
  return v(Ze(...r), et, m.runPromise);
}
export {
  ct as column,
  ot as columnPath,
  ut as forEach,
  st as forEachOrNull,
  lt as normalize,
  rt as pagen,
  dt as select,
  gt as sof,
  mt as unionAll,
  pt as viewDefinition
};
