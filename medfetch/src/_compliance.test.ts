import { describe, expect, it, suite } from "vitest";
import { Array, pipe } from "effect";
import { readdirSync, readFileSync } from "node:fs";
import { runViewSync } from "./sof";
import { Data, Upstream } from "./schema";

interface TestCase {
    title: string;
    tags?: string[];
    view: Upstream<typeof Data.ViewDefinition>;
    expect?: any[];
    expectError?: true;
}

interface Suite {
    title: string;
    description: string;
    fhirVersion: string[];
    resources: any[];
    tests: TestCase[];
}

const suites = pipe(
    readdirSync("src/examples"),
    Array.filter((filename) => filename.endsWith(".json")),
    Array.map((filename) => readFileSync(`src/examples/${filename}`, "utf8")),
    Array.map((buffer) => JSON.parse(buffer) as Suite),
    Array.map((suite) => {
        return {
            ...suite,
            tests: suite.tests.map((test) =>
                test.expectError === true
                    ? // rewrite ["status"] if the test case doesn't expect
                      // an error since some of these view defs dont come with
                      // a status field despite it being a required field in the specs
                      test
                    : {
                          ...test,
                          view: {
                              ...test.view,
                              status: test.view.status ?? "active",
                          },
                      },
            ),
        };
    }),
);

describe(`sql-on-fhir compliance`, () => {
    suites.forEach((testSuite) => {
        suite(`${testSuite.title}`, () => {
            testSuite.tests.forEach((test) => {
                if (test.expect) {
                    it(`passes ${test.title}`, () => {
                        const parsed = Data.parseSync(test.view);
                        const result = runViewSync(parsed, testSuite.resources);
                        expect(result).toEqual(test.expect);
                    });
                } else {
                    it.todo("expect error cases");
                }
            });
        });
    });
});
