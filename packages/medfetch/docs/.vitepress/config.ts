import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "~": fileURLToPath(new URL("../../src", import.meta.url)),
      },
    },
  },
  title: "Medfetch.js",
  description: "SQL on FHIR on javascript!",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Examples", link: "/icd-example" },
    ],

    sidebar: [
      {
        text: "Template",
        items: [
          { text: "Markdown Examples", link: "/markdown-examples" },
          { text: "Runtime API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "Examples",
        items: [{ text: "ICD dataset", link: "/icd-example" }],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});
