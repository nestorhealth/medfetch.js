import kdv from "./kdv.js";
import { describe, it, expect } from "vitest";

describe("kdv", () => {
    it("Can parse any key after the first", () => {
        const parse = kdv("bar", 1);
        const encoded = JSON.stringify({
            foo: "foo",
            bar: "bar",
        });
        const value = parse(encoded);
        expect(value?.hd).toEqual("bar")
    });
    
    it("Can parse the first key of a complete buffer on the first go", () => {
        const parse = kdv("foo", 1);
        const encoded = JSON.stringify({
            foo: "foo",
            bar: "bar"
        });
        const value = parse(encoded);
        expect(value?.hd).toEqual("foo");
    });
    
    it("Returns object values \"parsed\"", () => {
        const parse = kdv("foobar", 1);
        const encoded = JSON.stringify({
            foo: "foo",
            bar: "bar",
            foobar: {
                foo: "foo",
                bar: "bar"
            }
        });
        const value = parse(encoded);
        expect(value?.hd).toEqual({
            foo: "foo",
            bar: "bar"
        })
    });
    
    it("Returns array values \"parsed\"", () => {
        const link = [
            {
                relation: 'next',
                url: "asdf"
            }
        ]
        const entry = [
            {
                fullUrl: "lol.com/Patient/p2",
                resource: {
                    resourceType: "Patient",
                    id: "p1"
                }
            },
            {
                fullUrl: "lol.com/Patient/p1",
                resource: {
                    resourceType: "Patient",
                    id: "p2"
                }
            },
        ];
        const parseLink = kdv("link", 1);
        const parseEntry = kdv("entry", 1);
        const bundleEncoded = JSON.stringify({
            id: "b1",
            resourceType: "Bundle",
            link: link,
            entry: entry
        });
        const linkResult = parseLink(bundleEncoded);
        const entryResult = parseEntry(bundleEncoded);

        expect(linkResult?.hd).toEqual(structuredClone(link));
        expect(entryResult?.hd).toEqual(structuredClone(entry));
    });
});