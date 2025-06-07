import { FastCheck, Schema } from "effect";
import * as fc from "effect/FastCheck";
import { Resource } from "~/core/data.schema";

const REQUIRED = {
    id: fc.string(),
    resourceType: fc.string(),
};

const extra_key = fc.string().filter((key) => !(key in REQUIRED));
const extra_value = fc.anything();
const extra_fields = fc.dictionary(extra_key, extra_value);

const wide_resource_ok = fc.record(REQUIRED);

const wide_resource_ok_extra = fc
    .tuple(wide_resource_ok, extra_fields)
    .map(([required, extras]) => ({ ...required, ...extras }));

const wide_resource_err_id = fc.record({
    id: fc.anything().filter((value) => typeof value !== "string"),
    resourceType: fc.string(),
});

const wide_resource_err_resourceType = fc.record({
    id: fc.string(),
    resourceType: fc.anything().filter((value) => typeof value !== "string"),
});

const wide_resource_err = fc.record({
    id: fc.anything().filter((value) => typeof value !== "string"),
    resourceType: fc.anything().filter((value) => typeof value !== "string"),
});

const wide_resource_ok_cases = (n: number) => [
    ...FastCheck.sample(wide_resource_ok, n).map((input, i) => ({
        title: `Wide valid resource ${i + 1}`,
        input,
        expected: true,
    })),
    ...FastCheck.sample(wide_resource_ok_extra, n).map((input, i) => ({
        title: `Wide valid resource extra ${i + 1}`,
        input,
        expected: true,
    })),
];

const wide_resource_err_cases = (n: number) => [
    ...FastCheck.sample(wide_resource_err_id, n).map((input, i) => ({
        title: `Wide invalid resource.id ${i + 1}`,
        input,
        expected: false,
    })),
    ...FastCheck.sample(wide_resource_err_resourceType, n).map((input, i) => ({
        title: `Wide invalid resource.resourceType ${i + 1}`,
        input,
        expected: false,
    })),
    ...FastCheck.sample(wide_resource_err, n).map((input, i) => ({
        title: `Wide invalid resource ${i + 1}`,
        input,
        expected: false,
    })),
];

export const wide_resource_cases = (
    n: number = Math.floor(Math.random() * 3) + 2,
) => [...wide_resource_ok_cases(n), ...wide_resource_err_cases(n)];

const shape_pool = {
    nameOnly: { name: Schema.String },
    ageOnly: { age: Schema.Number },
    contact: { email: Schema.String, phone: Schema.String },
};

const shape_or_none_arb = fc.option(
    fc.constantFrom(...Object.values(shape_pool)),
    { nil: undefined, freq: 2 }, // 2/3 chance to use undefined
);

const resource_schema_tuple_arb = fc
    .tuple(fc.string({ minLength: 1 }), shape_or_none_arb)
    .map(([type, shape]) => [type, Resource(type, shape), shape] as const);

function make_matching_input_arb(
    type: string,
    shape?: Record<string, Schema.Struct.Field>,
): fc.Arbitrary<any> {
    const extraFields: Record<string, fc.Arbitrary<any>> = {};

    if (shape) {
        for (const [key, field] of Object.entries(shape)) {
            if (field === Schema.String) extraFields[key] = fc.string();
            else extraFields[key] = fc.float();
        }
    }

    return fc.record({
        id: fc.uuid(),
        resourceType: fc.constant(type),
        ...extraFields,
    });
}

const resource_ok_case_arb = resource_schema_tuple_arb.chain(
    ([type, schema, shape]) =>
        make_matching_input_arb(type, shape).map((input) => ({
            title: `Narrow resource -> resource.resourceType="${type}"`,
            input,
            schema,
            expected: true,
        })),
);

const narrow_resource_ok_cases = (n: number) =>
    FastCheck.sample(resource_ok_case_arb, n);

export const narrow_resource_cases = (n = 3) => [
    ...narrow_resource_ok_cases(n),
];
