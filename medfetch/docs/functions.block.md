# `block`
Get back a synchronous version of an async function. That's it*:
::: code-group

```ts [todos-worker.ts]
import block from "medfetch/block";

export const [getTodo, setGetTodo] = block(
    ["todos-worker"],
    async (todoId: string) => {
        const response = await fetch("https://dummyjson.com/todos");
        return response.text();
    }
);
```

```ts [main.ts]
import {setGetTodo} from "./todos-worker.js";

const worker = new Worker(
    new URL("./todos-worker.js", import.meta.url),
    {
        type: "module",
        name: "todos-worker"
    }
);
await setGetTodo(worker);
```

:::