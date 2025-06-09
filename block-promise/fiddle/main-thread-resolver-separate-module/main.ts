import { handleGetNthTodo } from "./blocking-task";

handleGetNthTodo((name) => {
    return new Worker(new URL("./worker", import.meta.url), {
        type: "module",
        name,
    })
});