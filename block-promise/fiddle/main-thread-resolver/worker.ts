import block from "../../src/block.browser";

export const [getNthTodo, handleGetNthTodo] = block(
    "main-thread-resolver",
    async (n: number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload.todos[n];
    },
);

if (self.name === "main-thread-resolver") {
    const response = getNthTodo(3);
    console.log("main-thread-resolver worker.js", response);
}
