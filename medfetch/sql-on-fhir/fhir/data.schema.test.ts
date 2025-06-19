import {
    narrow_resource_cases,
    wide_resource_cases,
    type TestCase,
    type NarrowTestCase
} from "./examples/resource.arb.js";

import { describe, it, expect } from "vitest";
import { pipe, Schema } from "effect";
import { Resource } from "./examples/data.schema.js";

describe('Resource() overload 1 validation (0 args / "wide")', () => {
    const isWideResource = Resource().pipe(Schema.is);
    wide_resource_cases.forEach(({ title, input, expected }: TestCase<unknown>) => {
        it(title, () =>
            pipe(input, isWideResource, (result) =>
                expect(result).toEqual(expected),
            ),
        );
    });
});

describe('Resource() overload 2 validation (1-2 args / "narrow")', () => {
    narrow_resource_cases.forEach(({ title, input, schema, expected }: NarrowTestCase<unknown>) =>
        it(title, () =>
            pipe(input, schema.pipe(Schema.is), (result) =>
                expect(result).toEqual(expected),
            ),
        ),
    );
});
