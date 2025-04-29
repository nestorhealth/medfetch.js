import { Stream } from "effect";
import { PageSync } from "~/data";
import { Bundle } from "~/sqlite-wasm/vtab.services";

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
const fullText = chunks.reduce((acc, chunk) => acc += chunk);
const parsed: Bundle = JSON.parse(fullText);
console.log("parsed", parsed.entry.length);

const stream = function *() {
    for (const chunk of chunks)
        yield chunk;
}();

let amt = 0;
try {
    while (true) {
        const one = PageSync.flush(stream);
        console.log(one.id);
        amt++;
    }
} catch (e) {};

console.log("got amt", amt);