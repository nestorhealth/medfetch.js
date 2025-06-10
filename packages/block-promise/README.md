# block-promise

Block a worker thread on an async function. That's it.

## Getting started
Define your async task. You can do this directly from the deferring worker code:
```ts
// In your worker file...
import block from "block-promise";

export const [getNthTodo, handleGetNthTodo] = block(
    /* The `self.name` value for the worker thread 
       that the sync handle expects at runtime. */
    "my-worker", 
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
    type: "module",
    name: "my-worker" // Same name you registered in the block() function
});

handleGetNthTodo(worker);

// Save yourself from typoing the name by using the callback overload
handleGetNthTodo(workerName => new Worker(..., {
    type: "module",
    name: workerName
}));
```

You can defer the async task to another worker thread:
```ts
// Back inside your worker file... (e.g. sync-worker.js)
import block from "block-promise";

// Extract the saved worker name the block() function registered
export const [getNthTodo, handleGetNthTodo] = block(
    "my-sync-worker",
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
import { handleGetNthTodo } from "./sync-worker.js";

handleGetNthTodo(name => new Worker(
    new URL(
        "./sync-worker",
        import.meta.url
    ),
    {
        type: "module",
        name: "my-sync-worker"
    }
));
```

## Use cases
This is only useful in the very specific condition where:
1. You have a worker thread
2. It wants to call an async function inside a synchronous callback.

> This will **not** work on the main thread because the main thread can't call [`Atomics.wait`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics/wait), which effectively sleeps the thread.

If you can await the async function, just use [`Promises`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) over this.