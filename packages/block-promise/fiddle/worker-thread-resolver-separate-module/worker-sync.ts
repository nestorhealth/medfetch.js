import { getNthTodo } from "./get-nth-todo";

if (self.name === "worker-thread-resolver") {
    const result = getNthTodo(2);
    console.log("worker-thread-resolver-separate-module worker-sync: ", result)
}