import block from "../../src/block";

export const [getNthTodo, handleGetNthTodo, onMessage] = block(
    "worker-a",
    async (n : number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload.todos[n];
    }
);
