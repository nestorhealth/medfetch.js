import { Schema } from "effect";
export * from "./literal";
export * as Data from "./data";
export * as Primitive from "./primitive";
export * as View from "./view";
export declare const isResourceType: (u: unknown) => u is string;
/**
 * Simple utility type to get the 'upstream'
 * type of any given Type.
 *
 * So this is just a shorthand for Schema.Schema.Encoded<typeof MySchema>;
 */
export type Upstream<TSchema extends Schema.Any> = Schema.Schema.Encoded<TSchema>;
/**
 * Since this library treats all resources the same
 * with respect to `View Definitions`, we only
 * need to handle Bundle structures
 */
export * as Bundle from "./bundle";
