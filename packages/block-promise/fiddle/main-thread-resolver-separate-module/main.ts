import { ping } from "./blocking-task";

ping((name) => {
    return new Worker(new URL("./worker", import.meta.url), {
        type: "module",
        name,
    })
});