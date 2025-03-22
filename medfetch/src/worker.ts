import { Data, Effect, pipe } from "effect";

/* Error handling */
export class WorkerUnexpectedError extends Data.TaggedError("WorkerUnexpectedError")<{ 
    url: URL | string;
}> {};
export class WorkerInvalidURLError extends Data.TaggedError("WorkerInvalidURLError")<{
    url: URL | string;
}> {};
export class WorkerNotAllowedError extends Data.TaggedError("WorkerNotAllowed")<{
    url: URL
}> {};

export const url = (path: string) => Effect.try({
    try: () => new URL(path, import.meta.url),
    catch: (e) => {
        if (e instanceof TypeError) {
            return new WorkerInvalidURLError({ 
                url: `${import.meta.url}/${path}`
            })
        }
        return new WorkerUnexpectedError({ url: `${import.meta.url}/${path}` });
    }
});

export const worker = (url: URL) => Effect.try({
    try: () => new Worker(url, { type: "module" }),
    catch: (e) => {
        if (e instanceof DOMException) {
            switch (e.name) {
                case ("SecurityError"): {
                    return new WorkerNotAllowedError({ url });
                }
                case("NetworkError"): {
                    return new WorkerUnexpectedError({ url });
                }
                case("SyntaxError"): {
                    return new WorkerInvalidURLError({ url });
                }
                default: {
                    return new WorkerUnexpectedError({ url });
                }
            }
        }
        return new WorkerUnexpectedError({ url });
    }
})

export const spawn = (path: string) => url(path).pipe(url => Effect.flatMap(url, worker));
