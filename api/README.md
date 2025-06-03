# Medfetch API
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
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

## Extra
To generate openapi types for the api client for:
```bash
pnpm run dev # To get the openapi route up
pnpm run api-typegen
```