const sqliteWorker = new Worker(new URL("./sqlite-worker.ts", import.meta.url), { type: "module" });
const fetcherWorker = new Worker(new URL("./fetch-worker.ts", import.meta.url), { type: "module" });

const channel = new MessageChannel();
sqliteWorker.postMessage({ type: "init", fetcherPort: channel.port1 }, [ channel.port1 ]);
fetcherWorker.postMessage({ type: "init" }, [ channel.port2 ]);

sqliteWorker.onmessage = (e: MessageEvent) => {
    const output = document.getElementById("output");
    if (!output) {
        console.error("no such output");
        return;
    }
    if (e.data.type === "result") {
        output.textContent = e.data.results.map(row => JSON.stringify(row)).join("\n");
    } else if (e.data.type === "error") {
        output.textContent = `Error: ${e.data.error}`;
    }
}

window.runQuery = () => {
    const query = document.getElementById("query") as HTMLTextAreaElement;
    sqliteWorker.postMessage({ type: "query", sql: query.value });
}
