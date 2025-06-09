import { handleGetNthTodo } from "./worker-sync";

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