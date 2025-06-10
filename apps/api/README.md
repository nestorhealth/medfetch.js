# Medfetch API
FHIR API + some extras on Cloudflare Workers with Hono

```txt
pnpm install
pnpm run dev
```

```txt
pnpm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
pnpm run cf-typegen
```

Pass the `Cloudflare.Env` as to the `Bindings` field in the`Hono` generics:

```ts
// src/.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Architecture
1. Edit an existing route:

## Extra
To generate openapi types for the api client for:
```bash
pnpm run dev # To get the openapi route up
pnpm run api-typegen
```