import { Data } from "effect";

export class WorkerError extends Data.TaggedError("Error.medfetch.worker")<{
    message?: string;
    phase: "init" | "running";
}> {};

export function worker(WorkerCtor: new (port: MessagePort) => void): void {
    self.onmessage = (e: MessageEvent) => {
        const port = e.ports[0];
        if (!port || e.data?.type !== "init")
            throw new WorkerError({
                phase: "init",
                message: "No MessagePort to write back to",
            });
        new WorkerCtor(port);
    };
}

export { Fetch } from "./worker.fetch.js";
