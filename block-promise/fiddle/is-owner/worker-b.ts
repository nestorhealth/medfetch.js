import block from "../../src/block";

export const [nthTodoBlock, ping] = block(
    ["worker-a", "worker-b"],
    async (n : number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload.todos[n];
    }
);