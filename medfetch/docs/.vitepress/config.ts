import { defineConfig } from "vitepress";
import { fileURLToPath } from "url";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Medfetch.js",
  description: "SQL on FHIR for the Web",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo-dark.svg" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Guide", link: "/guide" },
      { text: "Examples", link: "/examples.filter-icd" },
    ],
    logo: {
      light: "logo.svg",
      dark: "logo-dark.svg",
    },
    footer: {
      message: "Brought to you by nestorhealth",
    },
    sidebar: [
      {
        text: "Getting Started",
        items: [
          {
            text: "What is Medfetch.js?",
            link: "/getting-started.what-is-medfetch-js",
          },
          { text: "SQLite", link: "/getting-started.sqlite" },
        ],
      },
      {
        text: "Examples",
        items: [{ text: "Filter by ICD Codes", link: "/examples.filter-icd" }],
      },
      {
        text: "Functions",
        collapsed: true,
        items: [
          {
            text: "sqlite-wasm",
            collapsed: false,
            link: "/functions.sqlite-wasm",
            items: [
              {
                text: "medfetch",
                link: "/functions.sqlite-wasm.medfetch",
              },
              {
                text: "loadExtension",
                link: "/functions.sqlite-wasm.loadExtension",
              },
            ],
          },
          {
            text: "React",
            link: "/functions.react",
            collapsed: false,
            items: [
              {
                text: "useDatabase",
                link: "/functions.react.useDatabase",
              },
            ],
          },
          {
            text: "unpromisify",
            link: "/functions.unpromisify",
          },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/nestorhealth/medfetch.js" }
    ],
  },
  vite: {
    plugins: [
      // @ts-expect-error lol
      {
        configureServer(server) {
          server.middlewares.use((_req, res, next) => {
            res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
            res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
            next();
          });
        },
      },
    ],
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("../../src", import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ["@sqlite.org/sqlite-wasm"],
    },
    envDir: fileURLToPath(new URL("../", import.meta.url)),
  },
});
