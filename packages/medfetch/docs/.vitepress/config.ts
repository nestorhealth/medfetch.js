import { defineConfig } from "vitepress";
import { fileURLToPath } from "url";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Medfetch.js",
  description: "SQL on FHIR for the Web",
  outDir: "../../../../apps/api/public",
  base: "/docs/",
  head: [["link", { rel: "icon", type: "image/svg+xml", href: "/docs/logo.svg" }]],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/markdown-examples" },
    ],
    logo: "/logo.svg",
    sidebar: [
      {
        text: "Examples",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
  vite: {
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
    },
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("../../src", import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ["@sqlite.org/sqlite-wasm"],
    },
  },
});
