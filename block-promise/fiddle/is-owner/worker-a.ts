import { getNthTodo, handleGetNthTodo } from "./get-nth-todo";

const workerB = new Worker(
    new URL("./worker-b", import.meta.url),
    {
        type: "module"
    }
);

await handleGetNthTodo(workerB);
const result = getNthTodo(2);
console.log("is-owner worker-a:", result)