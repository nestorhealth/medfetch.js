import { ping } from "./worker-sync";

ping(name => {
    return new Worker(
        new URL(
            "./worker-sync",
            import.meta.url
        ),
        {
            type: 'module',
            name: name
        }
    );
});