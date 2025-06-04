
export class Worker1Error extends Error {
    readonly _tag = "Worker1Error";
    readonly thread: "main" | "worker";
    
    constructor(thread: "main" | "worker", ...args: ConstructorParameters<typeof Error>) {
        super(...args);
        this.thread = thread;
    }
}