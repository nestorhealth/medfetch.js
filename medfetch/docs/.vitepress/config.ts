import { defineConfig } from "vitepress";
import { fileURLToPath } from "url";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Medfetch.js",
  description: "SQL on FHIR for the Web",
  head: [
    ["link", { rel: "icon", type: "image/svg+xml", href: "/logo.svg" }],
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/examples.filter-icd" },
    ],
    logo: "/logo.svg",
    sidebar: [
      {
        text: "Getting Started",
        items: [{ text: "SQLite on FHIR", link: "/getting-started.sqlite" }],
      },
      {
        text: "Examples",
        items: [
          { text: "Filter by ICD Codes", link: "/examples.filter-icd" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  vite: {
    plugins: [
      // @ts-ignore
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
    envDir: "../"
  },
});
