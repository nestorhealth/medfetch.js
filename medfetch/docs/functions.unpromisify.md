---
outline: [2, 3]
---
# `unpromisify`
Get back a synchronous version of an async function. That's it.
::: code-group

```ts [todos-worker.ts]
import unpromisify from "medfetch/unpromisify";

export const [getTodo, setGetTodo] = unpromisify(
    "todos-worker",
    async (todoId: string) => {
        const response = await fetch("https://dummyjson.com/todos");
        return response.text();
    }
);

// The setGetTodo function will do this check but it never hurts to do it yourself
if (self.name === "todos-worker") {
    setGetTodo();
}

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

This only works on [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API), and
uses the [SharedArrayBuffer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/SharedArrayBuffer) API, so
you need the proper headers:

<<< ../_headers

::: tip
This function isn't necessary to call yourself in order to use Medfetch.js, as this is an
internal function called by the database extension.

It's a bit lower level than the "public" functions, but is exposed regardless
to give you a way to define your own `fetch` wrapper for the database extension, if you need that.
:::

## Parameters
```ts
const unpromisified = unpromisify(syncWorkerName, asyncFn, payloadConfig);
```

| Parameter        | Type                               | Description                                                                   |
|------------------|------------------------------------|-------------------------------------------------------------------------------|
| `syncWorkerName` | string                             | An arbitrary name for the worker that will call the sync version of `asyncFn` |
| `asyncFn`        | `(...args: any[]) => Promise<any>` | The async function to block on.                                               |
| `payloadConfig`  | [`PayloadConfig`](#payloadconfig)  | Encoding and decoding options for the promised return value.                  |

### `syncWorkerName`
This is the `name` field you set the [Web Worker]() that will block on the promise:
::: code-group

```ts [web-worker.ts] {4}
import unpromisify from "medfetch/unpromisify";

export const [syncFn, setSyncFn] = unpromisify(
    "sync-web-worker",
    ...
);
```

```ts [main.ts] {10}
import {setSyncFn} from "./web-worker.js";

const webWorker = new Worker(
    new URL(
        "./web-worker.js",
        import.meta.url
    ),
    {
        type: "module",
        name: "sync-web-worker"
    }
)
```
:::

`syncFn` checks if the current worker `name` is set to `sync-web-worker` before yielding the cpu, and returns immediately
if that isn't the case. So something like this would ***not*** work:

::: code-group
```ts [web-worker-bad.ts] {4}
import unpromisify from "medfetch/unpromisify";

export const [syncFn, setSyncFn] = unpromisify(
    "sync-web-worker",
    ...
);
```

```ts [main.ts] {10,11}
import {setSyncFn} from "./web-worker-bad.js";

const webWorker = new Worker(
    new URL(
        "./web-worker.js",
        import.meta.url
    ),
    {
        type: "module",
        // ❌ name doesn't match
        name: "sync-web-workerrrr"
    }
)
```
:::

### `asyncFn`
This is the async function you want to block your worker thread on, meaning it needs
to return some `Promise`.

You can pass in as many arguments as you want with whatever type, *just as long* as they are
serializable via the [structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/structuredClone)
API:

```ts {4-9}
export const [syncFn, setWorker] = unpromisify(
    "foo",
    async (
        arg0: string, // This is ok ✅
        arg1: {foo: "bar"}, // So is this ✅
        arg2: (...) => {...}, // This isn't ❌
        arg3: { // Neither is this ❌
            myMethod() {...}
        }
    ) => {...}
)
```

The same goes for the return value:
```ts {2-6,8-12}
export const [syncFn, setWorker] = unpromisify("foo", async () => {
    // These would be ok ✅
    let ret = "ok";
    ret = 0;
    ret = true;
    ret = {id: "foo"; bar: "ok"};
    
    // These aren't ❌
    ret = (...args: any[]) => console.log(...args);
    ret = {
        myMethod(...args: any[]) {...}
    }
    return ret;
});
```

See the [web mdn docs](https://developer.mozilla.org/en-US/docs/Web/API/WorkerGlobalScope/structuredClone) for more details.

::: info
Technically, this *doesn't* need to return a Promise (and so doesn't need to be async), 
but the types are constrained that way because there's really no reason to block on a 
synchronous function, since the "sync" thread could just call that itself.
:::

### `payloadConfig`
TODO

## Returns
You get back an [`Unpromisified`](#unpromisified) version of `asyncFn` 
passed in. This is a 2-tuple containing 2 functions. The first at index 0
is a synchronous version of `asyncFn`, and the second at index 1
is a [`SetWorker`](#setworker) function:

```ts
const asyncFn = (msg: string) => Promise.resolve(msg);
export const [syncFn, setWorker] = unpromisify("sync", asyncFn);
```

### `syncFn`
This is the "synchronous" version of `asyncFn`:
```ts
const response = syncFn("Look mom, no await!");
console.log(response);
```
The synchronous Web Worker can call it at any point after it calls the `setWorker` function.

### `setWorker`
This is a single function that returns nothing and needs to be called by both the blocked (sync) **Web Worker** 
and the blocking (async) **thread**. 

::: info
The distinction between **Web Worker** and **thread** is subtle, since
all Web Workers are (their own) threads, but not all threads are web workers. The only thread
that `unpromisfy` worries about that *is not* a web worker is the `Main` thread, sometimes
referred to as the UI thread if you're working with the browser.
:::

The thread that calls `syncFn` will **always** be a Web Worker, because you can't block via 
[Atomics](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Atomics) 
on the main thread with v8. It will also **always** call `setWorker`, and **always** does so before any calls to `syncFn` are made:

```ts
// This is OK
setWorker();
const payload = syncFn();

// So is this
const childWorker = new Worker(...);
await setWorker(childWorker);
const payload = syncFn();

// But this isn't
syncFn();
setWorker();
```

To keep things as (stupid) simple as possible, `setWorker` is designed to be called ***exactly*** like this,
regardless of the thread hierarchy context, and irrespective of the order of both calls:

::: code-group

```ts [thread-1.ts]
setWorker();
```

```ts [thread-2.ts]
await setWorker(new Worker(...))
```
:::

## Typescript Reference

### PayloadConfig
<<< ../src/unpromisify.ts#PayloadConfig

### Unpromisified
<<< ../src/unpromisify.ts#Unpromisified

### SetWorker
<<< ../src/unpromisify.ts#SetWorker