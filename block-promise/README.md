# block-promise

Block a worker thread on an async function:
```ts
// In your worker file...
import block from "block-promise";

export const [getNthTodo, handle] = block(
    async (n: number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload;
    }
)

self.onmessage = (e) => {
    ...,
    // Look mom, no await!
    const todo = getNthTodo(4);
}
```

Call the returned `handle` function to set up the message handler for the
blocked worker:
```ts
import { handle } from "./worker.js";

const worker = new Worker(new URL("./my-worker", import.meta.url), {
    type: "module"
});
handle();
```

That's it!