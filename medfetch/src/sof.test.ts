import { describe, test, suite, expect } from "vitest";
import { rows } from "./sof";
import { Record } from "effect";
import { View } from "./schema";

describe("sof", () => {
    suite(`rows : ViewDefinition -> ResourceLike[] -> Projection[]`, () => {
        test(`if it can evaluate a constant`, () => {
            const constants: View.Constant[] = [
                { _tag: "string", valueString: "somebody", name: "one" },
                { _tag: "uuid", valueUuid: "once", name: "two" },
                { _tag: "id", valueId: "told", name: "three" },
                { _tag: "canonical", valueCanonical: "me", name: "four" },
                { _tag: "uri", valueUri: "the", name: "five" },
                { _tag: "url", valueUrl: "world", name: "six" },
                { _tag: "code", valueCode: "was", name: "seven" },
                { _tag: "string", valueString: "gonna", name: "eight" },
                { _tag: "string", valueString: "roll", name: "nine" },
                { _tag: "string", valueString: "me", name: "tenth" },
            ];
            const expected = constants.reduce(
                (acc, constant) => {
                    return Record.set(
                        acc,
                        constant.name,
                        View.getConstantValue(constant),
                    );
                },
                {} as Record<any, any>,
            );
            const columns = constants.map((constant): View.ColumnPath => {
                return {
                    name: constant.name,
                    path: `%\`${constant.name}\``,
                    collection: false,
                    type: constant._tag,
                    tags: [],
                };
            });

            const viewDefinition = View.make({
                name: "test",
                resource: "Patient",
                status: "draft",
                constant: constants,
                where: [],
                select: [
                    View.Column({
                        column: columns,
                    }),
                ],
            });

            const result = rows(viewDefinition, [{ resourceType: "Patient" }]);
            expect(result).toEqual([expected]);
        });
    });
});
