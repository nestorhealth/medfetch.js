import { pingSyncWorker } from "./worker";

pingSyncWorker(name => {
    return new Worker(
        new URL(
            "./worker",
            import.meta.url
        ),
        {
            type: "module",
            name
        }
    );
});