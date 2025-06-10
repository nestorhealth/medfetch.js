import { nthTodoBlock, ping } from "./worker-b";

const workerB = new Worker(
    new URL("./worker-b", import.meta.url),
    {
        type: "module",
        name: "worker-b"
    }
);

await ping(workerB)

const result = nthTodoBlock(2);
console.log("is-owner worker-a:", result)