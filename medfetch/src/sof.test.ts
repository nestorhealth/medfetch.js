import { describe, test, suite, expect } from "vitest";
import { flat } from "./sof";
import { Record } from "effect";
import { ColumnPath, Constant, viewDefinition, column } from ".";

describe("sof", () => {
    suite(`rows : ViewDefinition -> ResourceLike[] -> Projection[]`, () => {
        test(`if it can evaluate a constant`, () => {
            const constants: Constant[] = [
                { valueString: "somebody", name: "one" },
                { valueUuid: "once", name: "two" },
                { valueId: "told", name: "three" },
                { valueCanonical: "me", name: "four" },
                { valueUri: "the", name: "five" },
                { valueUrl: "world", name: "six" },
                { valueCode: "was", name: "seven" },
                { valueString: "gonna", name: "eight" },
                { valueString: "roll", name: "nine" },
                { valueString: "me", name: "tenth" },
            ];
            const expected = constants.reduce(
                (acc, constant) => {
                    return Record.set(acc, constant.name, () => acc);
                },
                {} as Record<any, any>,
            );
            const columns = constants.map((constant): ColumnPath => {
                return {
                    name: constant.name,
                    path: `%\`${constant.name}\``,
                    collection: false,
                    type: "string",
                    tags: [],
                };
            });

            const vd = viewDefinition({
                name: "test",
                resource: "Patient",
                status: "draft",
                constant: constants,
                where: [],
                select: [
                    column({
                        column: columns,
                    }),
                ],
            });

            const result = flat([{ resourceType: "Patient" }], vd);
            expect(result).toEqual([expected]);
        });
    });
});
