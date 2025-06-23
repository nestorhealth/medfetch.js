import block from "../../src/block-promise/block.node.js";
import { isMainThread } from "node:worker_threads";

export const [syncFetch, setSyncFetch] = block(
    ["db"],
    (...args: Parameters<typeof fetch>) =>
        fetch(...args).then((res) => res.text()),
);

if (!isMainThread) {
    console.log("before");
    const result = syncFetch(`https://dummyjson.com/todos`);
    console.log(result)
}
