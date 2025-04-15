import { compile } from "fhirpath";
import fhirpath_r4_model from "fhirpath/fhir-context/r4";

/**
 * **"typesafe"** object wrapper over
 * `evaluate` from `fhirpathjs`.
 *
 * THIS DOESNT VALIDATE YOUR RETURN TYPE!!
 * It is up to you to ensure you're working with
 * the correct type
 */
export type FP<TExpected = any> = {
    path: string;
} & ((data: unknown) => TExpected);

/**
 * If TExpected is a singleton, then it returns [TExpected]
 * Otherwise it returns the array type.
 *
 * Get an FP node to run a FHIRPath expression against
 * @param strings - template strings array
 * @param args - fp nodes
 * @returns - the fp node for this path
 */
export function fp<TExpected = unknown>(
    strings: TemplateStringsArray,
    ...args: FP[]
): FP<TExpected extends (infer U)[] ? U[] : [TExpected]> {
    let expr = "";
    // zip + concat
    for (let i = 0; i < args.length; i++) {
        expr += strings[i] + args[i].path;
    }
    // add the rest
    for (let i = args.length; i < strings.length; i++) {
        expr += strings[i];
    }

    const path = compile(expr, fhirpath_r4_model, { async: false });

    let f = (data: unknown): TExpected[] => path(data);
    return Object.assign(f, { path: expr }) as any;
}
