import { ping } from "./get-nth-todo";

ping(name => new Worker(
    new URL(
        "./worker-sync",
        import.meta.url
    ),
    {
        type: 'module',
        name
    }
));