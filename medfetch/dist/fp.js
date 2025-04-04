import { compile } from "fhirpath";
import fhirpath_r4_model from "fhirpath/fhir-context/r4";
/**
 * If TExpected is a singleton, then it returns [TExpected]
 * Otherwise it returns the array type.
 *
 * Get an FP node to run a FHIRPath expression against
 * @param strings - template strings array
 * @param args - fp nodes
 * @returns - the fp node for this path
 */
export function fp(strings, ...args) {
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
    let f = (data) => path(data);
    return Object.assign(f, { path: expr });
}
