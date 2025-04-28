import { Effect, Option, Stream } from "effect";
import { kdv, Page } from "~/data";

const startURL = "https://r4.smarthealthit.org/Patient";
const response = await fetch(startURL);
const reader = response.body!.getReader();
const decoder = new TextDecoder();

const chunks: string[] = [];

while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(decoder.decode(value));
}

function *stream() {
    for (const chunk of chunks)
        yield chunk;
}

const resource1 = Page.flush(Stream.fromIterable(stream())).pipe(
    Effect.provide(Page.Default),
    Effect.runSync
);

console.log("hmmm", resource1);