---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "Medfetch.js"
  text: "SQL on FHIR"
  tagline: The FHIR client you never knew you needed
  image:
    src: /demo.mp4
    alt: medfetch.js demo video
  actions:
    - theme: brand
      text: Get Started
      link: /
    - theme: alt
      text: View on Github
      link: https://github.com/nestorhealth/medfetch.js/tree/main/medfetch

features:
  - title: Run real SQL queries
    details: Query your FHIR resources over a real SQL database. Now we got "INNER JOIN"'s in javascript
  - title: 
    details: 
  - title: 
    details: 
---

<script setup>
import { ref } from "vue";
import { sqliteOnFhir } from "~/sqlite.browser";

const dialect = sqliteOnFhir<{
  Patient: {}
}>(":memory:", "http://localhost:8787/fhir", ["Patient"]);

const count = ref(0)
</script>

## Markdown Content

The count is: {{ count }}

<button :class="$style.button" @click="count++">Increment</button>

<style module>
.button {
  color: red;
  font-weight: bold;
}
</style>