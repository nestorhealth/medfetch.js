import block from "../../src/block";

export const [getNthTodo, ping] = block(
    "worker-thread-resolver",
    async (n : number) => {
        const response = await fetch("https://dummyjson.com/todos");
        const payload = await response.json();
        return payload.todos[n];
    }
);

if (self.name === "worker-thread-resolver") {
    const result = getNthTodo(2);
    console.log("worker-thread-resolver worker-sync: ", result)
}