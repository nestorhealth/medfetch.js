/**
 * Create the Error thrower function for a given tag
 * @internal
 */
export function make(tag: string): (...args: any[]) => never {
  return (...args: any[]): never => {
    throw new Error(`[${tag}] >> ${args.map(String).join(" ")}`);
  };
}
