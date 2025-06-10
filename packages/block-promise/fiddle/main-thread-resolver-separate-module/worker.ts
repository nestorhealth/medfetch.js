import { getNthTodo } from "./blocking-task";

const result = getNthTodo(2);
console.log("main-thread-resolver-separate-module worker.js:", result)