import type { Context } from "hono";
import { z } from "zod";

/**
 * Maybe promiseable. Should always `await` this
 * @template T The result type that may be wrapped in a promise
 * 
 * ```ts
 * let promised: Promiseable<string>;
 * if (Math.random() < 0.5) {
 *   promised = "Not a promise!";
 * } else {
 *   promised = new Promise(res => res("A promise!"));
 * }
 * ```
 */
type Promiseable<T> = Promise<T> | T;

/**
 * For extracting out logic from the route handler into its own function
 * @template Result The result value, making this a Promise is redundant since the type wraps the return type in one
 * @template Args A tuple of argument types that follow arg0 which is the
 * typed Hono {@link Context} if any are applicable. Default to empty args
 * 
 * @example
 * ```ts
 * const greetUser: RouteHelper<string, [ string | null ]> = (c, username) => {
 *   if (!username) {
 *     throw new Error(`Can't greet a null user!`);
 *   }
 *   return `Hello ${username}!`;
 * }
 * ```
 */
export type RouteHelper<Result, Args extends unknown[] = []> = (
  c: Context<{ 
    Bindings: Env;
    Variables: Vars;
  }>,
  ...args: Args
) => Promiseable<Result>;

export const vfsTypes = z.enum([
  "opfs",
  "kvfs"
]);
export type VFSType = z.infer<typeof vfsTypes>;