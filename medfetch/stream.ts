import { kdv } from "~/data";

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

const sax = kdv<any[]>("link", 1);
const { value } = stream().next();
if (value) {
    const result = sax(value);
    console.log('result', result);
}