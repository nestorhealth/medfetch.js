# block-promise

Block a worker thread on an async function. That's it.

## Getting started
Define your async task. You can do this directly from the deferring worker code:
```ts
// In your worker file...
import block from "block-promise";

export const [getNthTodo, handleGetNthTodo] = block(
    async (n: number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload.todos[n];
    }
)

self.onmessage = (e) => {
    ...,
    // Look mom, no await!
    const todo = getNthTodo(4);
}
```

Call the returned `handleGetNthTodo` function to set up the message handler for the
blocked worker:
```ts
// somewhere in your main thread
import { handleGetNthTodo } from "./my-worker.js";

const worker = new Worker(new URL("./my-worker", import.meta.url), {
    type: "module"
});
handleGetNthTodo(worker);
```

You can defer the async task to another worker thread:
```ts
// Back inside your worker file...
import block from "block-promise";

// Extract the saved worker name the block() function registered
export const [getNthTodo, handle, workerName] = block(
    async (n: number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload.todos[n];
    }
)

self.onmessage = (e) => {
    ...,
    // Look mom, no await!
    const todo = getNthTodo(4);
}
```

Then inside your *other* worker file:
```ts
// Now inside some other worker file
import { handleGetNthTodo, workerName } from "./my-worker.js";

const worker = new Worker(new URL("./my-worker", import.meta.url), {
    type: "module",
    name: workerName // <-- If you don't pass this in then the returned sync handle will always return undefined
});
handleGetNthTodo(worker);
```