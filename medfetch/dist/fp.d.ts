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
export declare function fp<TExpected = unknown>(strings: TemplateStringsArray, ...args: FP[]): FP<TExpected extends (infer U)[] ? U[] : [TExpected]>;
