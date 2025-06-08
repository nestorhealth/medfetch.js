import { blocking } from "./connection";

export const [blockFetch, handleFetch] = blocking(
    async () => {
        const response = await fetch('https://dummyjson.com/todos');
        return await response.json();
    }
);

const result = blockFetch();
console.log("asdf", result)