import { Option } from "effect";
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

const write = kdv<any[]>("entry", 1);
const { value } = stream().next();
if (value) {
    const a = write(value);
    if (Option.isSome(a)) {
        const some = Option.getOrThrow(a);
        console.log(some.hd, some.tl);
    }
}