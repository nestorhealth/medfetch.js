// IMPORTANT: don't use `~` imports since the web-worker can't recognize that (it doesn't have vite's alias resolver like the main thread does)
import unpromisify, { forMessage } from "./unpromisify.js";

async function id<T>(t: T) {
    return Promise.resolve(t);
}
const [syncId, setIdPromise] = unpromisify("sync-worker", id);

if (self.name === "sync-worker") {
    self.addEventListener("message", (msg) => {
        if (msg.data === "main-resolver-case" && msg.ports[0]) {
            setIdPromise();
            const parentPort = msg.ports[0];
            parentPort.addEventListener("message", (e) => {
                const result = syncId(e.data);
                parentPort.postMessage(result);
            });
            parentPort.start();
            parentPort.postMessage("ready");
        }

        if (msg.data.type === "child-resolver-case" && msg.ports[0]) {
            const parentPort = msg.ports[0];
            parentPort.start();
            const childWorker = new Worker(
                new URL(import.meta.url, import.meta.url),
                {
                    type: "module",
                    name: "async-worker",
                },
            );

            setIdPromise(childWorker).then(() => {
                const result = syncId(msg.data.resolve * 2);
                parentPort.postMessage(result);
            });
        }
    });
}

if (self.name === "async-worker") {
    setIdPromise();
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
            syncWorker.postMessage("main-resolver-case", [port2]);
            port1.start();
            await forMessage(
                (e) => e.data === "ready",
                (handler) => port1.addEventListener("message", handler),
                (handler) => port1.removeEventListener("message", handler),
            );

            await setIdPromise(syncWorker);

            const TEST_DATA = 9;
            port1.postMessage(TEST_DATA);
            const { data } = await forMessage(
                (e) => e.data === TEST_DATA,
                (handler) => port1.addEventListener("message", handler),
                (handler) => port1.removeEventListener("message", handler),
            );
            expect(data).toEqual(TEST_DATA);
        });

        test("Child of sync-worker thread can resolve its promise", async () => {
            const syncWorker = getSyncWorker();
            const { port1, port2 } = new MessageChannel();

            const someRandomNumber = Math.floor(Math.random() * 51);
            console.log(
                "Generated random number",
                someRandomNumber,
                "for the async-worker to wrap in a promise",
            );
            syncWorker.postMessage(
                {
                    type: "child-resolver-case",
                    resolve: someRandomNumber,
                },
                [port2],
            );
            port1.start();
            const { data } = await forMessage(
                (e) => e.data === someRandomNumber * 2,
                (handler) => {
                    port1.addEventListener("message", handler);
                },
                (handler) => {
                    port1.removeEventListener("message", handler);
                },
            );
            const payload = data;
            console.log("Received message", payload);
            expect(payload).toEqual(someRandomNumber * 2)
        });
    });
}
