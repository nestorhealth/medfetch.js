new Worker(
    new URL(
        "./worker-async.js",
        import.meta.url
    ),
    {
        type: "module"
    }
);