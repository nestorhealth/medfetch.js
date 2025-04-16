declare const WorkerError_base: new <A extends Record<string, any> = {}>(args: import("effect/Types").Equals<A, {}> extends true ? void : { readonly [P in keyof A as P extends "_tag" ? never : P]: A[P]; }) => import("effect/Cause").YieldableError & {
    readonly _tag: "Error.medfetch.worker";
} & Readonly<A>;
export declare class WorkerError extends WorkerError_base<{
    message?: string;
    phase: "init" | "running";
}> {
}
export declare function worker(WorkerCtor: new (port: MessagePort) => void): void;
export { Fetch } from "./worker.fetch.js";
