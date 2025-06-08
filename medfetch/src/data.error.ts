import { TaggedError } from "effect/Data";

type DataModule = "main" | "auth" | "schema";
interface __DataError {
    readonly message: string;
    readonly module: DataModule;
}

/**
 * For errors from the data module
 */
export class DataError extends TaggedError("medfetch/data")<__DataError> {
    constructor(msg: string | __DataError, type: DataModule = "main") {
        if (typeof msg === "string") {
            super({ message: msg, module: type });
        } else {
            super(msg);
        }
    }
}
