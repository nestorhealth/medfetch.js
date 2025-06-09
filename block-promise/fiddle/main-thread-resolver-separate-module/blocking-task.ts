import block from "../../src/block.browser";

export const [getNthTodo, handleGetNthTodo] = block(
    "main-thread-resolver-separate",
    async (n : number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload.todos[n];
    },
);