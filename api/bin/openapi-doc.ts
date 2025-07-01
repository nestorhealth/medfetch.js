/* Spins up the hono server and write the openapi doc to the public folder */
import app from '~/app';
import fs from "node:fs";

async function main() {
  // 1. Start the Hono server
  // 2. Wait until the server is ready (basic delay)
  await new Promise((r) => setTimeout(r, 200));

  // 3. Fetch the /openapi route
  const res = await app.request("/openapi", {
    headers: {
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  const outURL = new URL("../public/openapi.json", import.meta.url)

  // 4. Save result to file
  fs.writeFileSync(outURL as unknown as string, JSON.stringify(data, null, 2));

  // 5. Exit the process — server stops with the script
  process.exit(0);
}

main();
