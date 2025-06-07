# Medfetch.js Docs
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
that uses [Nextra](http://nextra.site/) as the content generator for the documentation.

## Getting Started

First, run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Building
You need a built version of the [medfetch](../medfetch/README.md) package:
```bash
pnpm run build:sof
```
Run the build script:
```bash
pnpm run build
pnpm run build:docs # Monorepo alias
```

You can preview it:
```bash
pnpm run preview
```