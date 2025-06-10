
new Worker(
    new URL("./worker-a", import.meta.url),
    {
        type: "module",
        name: "worker-a"
    }
)