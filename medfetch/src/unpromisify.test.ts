// IMPORTANT: don't use `~` imports since the web-worker can't recognize that (it doesn't have vite's alias resolver like the main thread does)
import unpromisify, { forMessage } from "./unpromisify.js";

async function id<T>(t: T) {
    return Promise.resolve(t);
}

async function responsePromise(): Promise<Response> {
    return new Response(JSON.stringify({ hello: "world" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

class Foo {
    str: string;
    num: number;
    bool: boolean;

    constructor() {
        this.str = "";
        this.num = 0;
        this.bool = true;
    }

    method() {
        return "never gonna see me";
    }
}
const [syncId, setIdPromise] = unpromisify("sync-worker", id);
const [syncCtor, setSyncCtor] = unpromisify(
    "sync-worker",
    async () => new Foo(),
);
const [syncFetch, setSyncFetch] = unpromisify("sync-worker", responsePromise);

const fnMap = {
    id: syncId,
    ctor: syncCtor,
};

if (self.name === "sync-worker") {
    self.addEventListener("message", (msg) => {
        if (
            msg.data?.name === "main-resolver" &&
            msg.data?.fn &&
            msg.ports[0]
        ) {
            const parentPort = msg.ports[0];
            parentPort.start();
            const fn = (fnMap as any)[msg.data.fn];
            parentPort.addEventListener("message", (e) => {
                const result = (
                    fn ?? ((..._: any[]) => "UNKNOWN FUNCTION CALL")
                )(...e.data);
                parentPort.postMessage(result);
            });
            parentPort.postMessage("ready");
        }

        if (msg.data.name === "child-resolver" && msg.ports[0]) {
            const parentPort = msg.ports[0];
            parentPort.start();
            const childWorker = new Worker(
                new URL(import.meta.url, import.meta.url),
                {
                    type: "module",
                    name: "async-worker",
                },
            );

            setIdPromise(childWorker);
            const result = syncId(msg.data.resolve * 2);
            parentPort.postMessage(result);
        }
    });
}

if (self.name === "async-worker") {
    self.addEventListener("message", (e) => {
        if (e.ports[0]) {
            const parentPort = e.ports[0];
            parentPort.start();

        }
    })
}

if (self.name !== "sync-worker" && self.name !== "async-worker") {
    let __syncWorker: Worker | null = null;
    const getSyncWorker = () => {
        if (!__syncWorker) {
            throw new Error(`__syncWorker is null. Did you forget to set it?`);
        }
        return __syncWorker;
    };

    beforeEach(async () => {
        __syncWorker = new Worker(new URL(import.meta.url, import.meta.url), {
            name: "sync-worker",
            type: "module",
        });
    });
    afterEach(async () => {
        getSyncWorker().terminate();
    });

    describe("unpromisify", () => {
        test("Main thread can resolve the sync-worker's promise", async () => {
            const syncWorker = getSyncWorker();
            const { port1, port2 } = new MessageChannel();
            port1.start();
            await forMessage(
                () => {
                    syncWorker.postMessage(
                        {
                            case: "case1",
                            name: "main-resolver",
                            fn: "id",
                        },
                        [port2],
                    );
                },
                (e) => e.data !== undefined,
                (handler) => port1.addEventListener("message", handler),
                (handler) => port1.removeEventListener("message", handler),
            );
            await setIdPromise(syncWorker);

            const { data } = await forMessage(
                () => port1.postMessage([9]),
                (e) => e.data !== undefined,
                (handler) => port1.addEventListener("message", handler),
                (handler) => port1.removeEventListener("message", handler),
            );
            expect(data).toEqual(9);
        });

        test("Child of sync-worker thread can resolve its promise", async () => {
            const syncWorker = getSyncWorker();
            const { port1, port2 } = new MessageChannel();

            const someRandomNumber = Math.floor(Math.random() * 51);
            port1.start();
            const { data } = await forMessage(
                () =>
                    syncWorker.postMessage(
                        {
                            name: "child-resolver",
                            resolve: someRandomNumber,
                            fn: "id",
                        },
                        [port2],
                    ),
                (e) => e.data === someRandomNumber * 2,
                (handler) => {
                    port1.addEventListener("message", handler);
                },
                (handler) => {
                    port1.removeEventListener("message", handler);
                },
            );
            const payload = data;
            expect(payload).toEqual(someRandomNumber * 2);
        });

        test("Class instances have enumerable properties maintained", async () => {
            const { port1, port2 } = new MessageChannel();
            port1.start();

            await forMessage(
                () =>
                    getSyncWorker().postMessage(
                        {
                            case: "class instance case",
                            name: "main-resolver",
                            fn: "ctor",
                        },
                        [port2],
                    ),
                (e) => e.data !== undefined,
                (handler) => port1.addEventListener("message", handler),
                (handler) => port1.removeEventListener("message", handler),
            );
            setSyncCtor(getSyncWorker());
            const { data } = await forMessage(
                () => port1.postMessage([]),
                e => e.data !== undefined,
                (handler) => port1.addEventListener("message", handler),
                (handler) => port1.removeEventListener("message", handler)
            );
            expect(data).toEqual({
                str: "",
                num: 0,
                bool: true,
            });
        });
    });
}
