import { RESOURCE_TYPE } from "./literal";
export { RESOURCE_TYPE, } from "./literal";
export * as Data from "./data";
export * as Primitive from "./primitive";
export * as View from "./view";
export const isResourceType = (u) => typeof u === "string" && RESOURCE_TYPE.literals.includes(u);
/**
 * Since this library treats all resources the same
 * with respect to `View Definitions`, we only
 * need to handle Bundle structures
 */
export * as Bundle from "./bundle";
