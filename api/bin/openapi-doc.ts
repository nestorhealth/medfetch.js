/* Spins up a nodejs server using the Hono app so as to get the /openapi 
   route up, fetch from it, then writes the openapi.json file from the response */
import { serve } from '@hono/node-server';
import app from '~/app';
import fs from "node:fs";

const port = 9000;

async function main() {
  // 1. Start the Hono server
  const server = serve({ fetch: app.fetch, port });

  // 2. Wait until the server is ready (basic delay)
  await new Promise((r) => setTimeout(r, 200));

  // 3. Fetch the /openapi route
  const res = await fetch(`http://localhost:${port}/openapi`);
  const data = await res.json();
  const outURL = new URL("../dist/openapi.json", import.meta.url)

  // 4. Save result to file
  fs.writeFileSync(outURL as any, JSON.stringify(data, null, 2));

  // 5. Exit the process — server stops with the script
  process.exit(0);
}

main();
