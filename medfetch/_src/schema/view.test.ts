import { describe, expect, suite, test } from "vitest";
import {
    Effect,
    pipe,
    FastCheck as fc,
    Arbitrary,
    Array,
    String,
} from "effect";
import { View, Data, Primitive } from ".";

const testDecodeEffect =
    (expectSuccess = true) =>
    <A, E>(decoded: Effect.Effect<A, E>) =>
        pipe(decoded, Effect.either, Effect.runSync, (result) =>
            expectSuccess
                ? expect(result._tag).toBe("Right")
                : expect(result._tag).toBe("Left"),
        );

const testDecodedTag =
    (tagValue: string) =>
    <A extends View.Constant, E>(decoded: Effect.Effect<A, E>) =>
        pipe(decoded, Effect.runSync, (result) =>
            expect(result._tag).toEqual(tagValue),
        );

const MODULE_NAME = `import { View } from "medfetch-sof/schema"`;

describe(MODULE_NAME, () => {
    suite(`Function: input |> View.decodeConstant`, () => {
        test("Data.Constant.make() |> View.decodeConstant = SUCCESS on normal inputs", () =>
            pipe(
                Data.Constant.make({
                    name: "foo",
                    valueString: "foo",
                }),
                View.decodeConstant,
                testDecodeEffect(true),
            ));

        test("Data.Constant.make() |> View.decodeConstant = SUCCESS when input has > 1 value key but is correctly typed", () =>
            pipe(
                Data.Constant.make({
                    name: "foo",
                    valueString: "foo",
                    valueBoolean: false,
                }),
                View.decodeConstant,
                testDecodeEffect(true),
            ));

        test("Data.Constant.make() |> View.decodeConstant = ERROR when input has 0 value-keys", () =>
            pipe(
                Data.Constant.make({ name: "bad " }),
                View.decodeConstant,
                testDecodeEffect(false),
            ));
        test("Data.Constant.make() |> View.decodeConstant = ERROR on normal input where value key does not match the type", () =>
            pipe(
                // @ts-ignore
                { name: "asdf", valueString: 123 },
                View.decodeConstant,
                testDecodeEffect(false),
            ));
        test("Data.Constant.make() |> View.decodeConstant = ERROR on multi-keyed inputs where at least 1 key does not match its FHIR type", () =>
            pipe(
                { name: "asdf", valueString: "foo", valueInteger: 0.123 },
                View.decodeConstant,
                testDecodeEffect(false),
            ));
        test("Data.Constant.make() |> View.decodeConstant HAS { _tag: x } when value[x] is the first key of the sorted valueKeys ASC", () => {
            const entriesArb = fc
                .array(fc.constantFrom(...Primitive.valueKeys), {
                    minLength: 1,
                })
                .chain((rest) => {
                    const deduped = Array.dedupe(rest);
                    return fc.tuple(
                        ...[...deduped].map((key) =>
                            fc.tuple(
                                fc.constant(key),
                                Arbitrary.make(
                                    Primitive.get(Primitive.fromValueKey(key))
                                        .schema as any,
                                ),
                            ),
                        ),
                    );
                });
            fc.assert(
                fc.property(entriesArb, (entries) => {
                    const sortedByKeyName = Array.sort(
                        entries,
                        (e1: [string, any], e2: [string, any]) =>
                            pipe(e1[0] as string, String.localeCompare(e2[0])),
                    );
                    const expectedValueKey = sortedByKeyName[0][0];
                    const expectedTag =
                        Primitive.fromValueKey(expectedValueKey);
                    const constant = {
                        name: "lol",
                        ...Object.fromEntries(sortedByKeyName),
                    };

                    pipe(
                        constant,
                        View.decodeConstant,
                        testDecodedTag(expectedTag),
                    );
                }),
            );
        });
    });
});
