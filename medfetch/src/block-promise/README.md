# block-promise
Block *workers* on a promise. That's it.

## Usage
Call the default exported [./block.ts] function like so:
```ts
import block from "~/block-promise/block.js";

export const [syncFetch, ping] = block(
    [
        /* The name of the worker thread you are blocking */
        "sqlite-wasm", 

        /* Optional second element. 
           This is the name of the worker thread (the "blocker")
           that is calling the promise returning function
           on behalf of the worker thread specified in index 0.
           This is really only relevant when the blocked worker thread
           is the one creating the blocked worker thread. See below. */
        "sqlite-wasm.block"
    ],
    /* Some async function you need to block on */
    async (...args: Parameters<typeof fetch>) => {
        const response = await fetch(...args);
        const payload = await response.json();
        return JSON.stringify(payload);
    },
)
```
You get returned an array with exactly 2 elements, both are plain functions.
1. `syncFetch` above is a *synchronous* proxy function of the async function.
2. `ping` is an *asynchronous* function that 

While there isn't one correct file to place the `export`, there are a few 
patterns to follow that will make the bundler not scream at you (or do so less).

1. Place block function 

1. Main thread is the one providing the block
Then you can 
```ts
// web-worker.ts

```

Prefer this if you 