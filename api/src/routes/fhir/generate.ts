import type { CodeableConcept, Coding } from "fhir/r4";

const randomArrayIndex = <T>(a: T[]) => Math.floor(Math.random() * a.length)

export function generateCodeableConcept(codeMap: Map<string, Record<string, Coding>>): CodeableConcept {
    const systemEntries = Array([...codeMap.entries()]);
    const randomCodeSystemIndex = randomArrayIndex(systemEntries);
    const randomCodeSystemEntry = systemEntries[randomCodeSystemIndex];
    
    const randomCodingIndex = randomArrayIndex(randomCodeSystemEntry)
    const randomCoding = randomCodeSystemEntry[randomCodingIndex][1];
    const codingEntries = Object.entries(randomCoding);
    const codingIndex = randomArrayIndex(codingEntries);
    const coding = codingEntries[codingIndex][1];

    return {
        text: coding.display,
        coding: [
            coding
        ]
    }
}

export function codeMap(): Map<string, Record<string, Coding>> {
  return new Map<string, Record<string, Coding>>();
}