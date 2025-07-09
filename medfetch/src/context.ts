/**
 * Create the Error thrower function for a given tag
 * @internal
 */
export function makeError(tag: string): (...args: any[]) => never {
    return (...args: any[]): never => {
        throw new Error(`[${tag}] >> ${args.map(String).join(" ")}`);
    };
}

export function makeLogger(tag: string, enabledWhen: boolean = import.meta.env.DEV) {
    return {
        info: (...args: any[]) => {
            if (enabledWhen) {
                console.log(`[${tag}] >>`, ...args);
            }
        },
        warn: (...args: any[]) => {
            if (enabledWhen) {
                console.warn(`[${tag}] >>`, ...args);
            }
        },
        error: (...args: any[]) => {
            if (enabledWhen) {
                console.error(`[${tag}] >>`, ...args)
            }
        }
    }
}
