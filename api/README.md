# Medfetch API
The main server for all public medfetch related things. Comes with
a sandbox FHIR API and some more.

## Setup
1. Install dependencies:
```bash
pnpm install
```
2. Spin up postgresql:
```bash
docker compose up -d
```

3. Run migrations
```bash
pnpm run migrate-up
```

4. Run server:
```bash
pnpm run dev
```

## Other scripts
To generate the initial sql migrations from better-auth (if you change any auth config)
```bash
pnpm run auth-generate 
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
pnpm run cf-typegen
```

Then pass the `Cloudflare.Env` as to the `Bindings` field in the`Hono` generics:

```ts
// src/.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

If you need to step down a migration
```bash
pnpm run migrate-down
```

To generate openapi types for the api package exports:
```bash
pnpm run dev # To get the openapi route up
pnpm run api-typegen
```