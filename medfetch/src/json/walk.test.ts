import { describe, it } from "vitest";
import walk from "~/json/walk.js";

const obj = {
    name: "parent",
    age: 60,
    child: {
        name: "child1",
        age: 30,
        grandchild: {
            name: "grandchild",
            age: 3,
        },
    },
    children: [
        {
            name: "child2",
        },
        {
            name: "child3",
        },
    ],
};

describe("json/walk", () => {
    it("Can traverse 1 level down", () => {
        const walkName = walk("'name'");
        const walkChild = walk("'child'");
        const nameResult = walkName(obj);
        const childResult = walkChild(obj);

        expect(nameResult).toEqual(obj.name);
        expect(childResult).toEqual(obj.child);
    });

    it("Coerces '->>' paths as text when mode is set to 'postgresql'", () => {
        const walkAgeString = walk("'child'->>'age'", "postgresql");
        expect(walkAgeString(obj)).toEqual("30");
        const walkAgeNumber = walk("'child'->>'age'", "sqlite");
        expect(walkAgeNumber(obj)).toEqual(30);
    });

    it("Parses with mode set to 'sqlite' when no 'mode' parameter is passed (default)", () => {
        const walkAgeNumberDefault = walk("'child'->>'age'");
        const walkAgeNumberExplicit = walk("'child'->>'age'", "sqlite");
        expect(walkAgeNumberDefault(obj)).toEqual(30);
        expect(walkAgeNumberDefault(obj)).toEqual(walkAgeNumberExplicit(obj));
    });

    it("Doesn't care about whitespacing between delim", () => {
        const walkNoWS = walk("'child'->>'name'");
        const walkLeftWS = walk(
            `'child'${Array(Math.floor(Math.random() * 99))
                .fill(null)
                .map(() => "")
                .join(" ")}->>'name'`,
        );
        const walkRightWS = walk(
            `'child'->>${Array(Math.floor(Math.random() * 99))
                .fill(null)
                .map(() => "")
                .join(" ")}'name'`,
        );

        expect(walkNoWS(obj)).toEqual(walkLeftWS(obj));
        expect(walkNoWS(obj)).toEqual(walkRightWS(obj));
    });

    it("Can traverse an object child", () => {
        const walkChild = walk("'child'->>'name'");
        const walkGrandchild = walk("'child'->'grandchild'->>'name'");

        expect(walkChild(obj)).toEqual(obj.child.name);
        expect(walkGrandchild(obj)).toEqual(obj.child.grandchild.name);
    });

    it("Can index into an array using both the int 'literal' or squoted string", () => {
        const walk0 = walk("'children' -> 0 ->> 'name'");
        const walk0Quotes = walk("'children' -> '0' ->> 'name'");
        const result = walk0(obj);
        expect(result).toEqual(obj.children[0].name);
    });
});
