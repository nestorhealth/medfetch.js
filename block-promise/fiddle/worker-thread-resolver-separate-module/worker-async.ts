import { handleGetNthTodo } from "./get-nth-todo";

handleGetNthTodo(name => new Worker(
    new URL(
        "./worker-sync",
        import.meta.url
    ),
    {
        type: 'module',
        name
    }
));