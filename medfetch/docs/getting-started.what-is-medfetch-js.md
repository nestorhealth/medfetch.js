# What is Medfetch.js

"Make Everything (a) Database Fetch".js (med) fetch, or Medfetch.js for short, is an 
*opinionated* REST API HTTP client for Javascript. It allows you to
query JSON-based REST APIs just like a database:

```ts
import medfetch from "medfetch/sqlite-wasm";

const myAPIConnection = medfetch("https://r4.smarthealthit.org", {
});
```