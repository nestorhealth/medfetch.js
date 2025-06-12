---
layout: home

hero:
  name: "Medfetch.js"
  text: "SQL on FHIR"
  tagline: >
    Query FHIR resources just like a SQL database
  image:
    src: /medfetch-banner.png
    alt: medfetch.js banner
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View API Examples
      link: /api-examples

features:
  - title: Plain SQL
    details: Write SQL queries to real relational databases. Now we've got "INNER JOIN"'s on JSONs.
  - title: ⚡ Fast + Portable
    details: Powered by WebAssembly and SQLite in the browser, or use Node for server-side speed. Works anywhere with `fetch()`.
  - title: 🏥 Built for FHIR
    details: Supports R4 FHIR Bundles, complex joins, nested fields, and even FHIRPath-like querying patterns.

footer: Made with ❤️ by the Medfetch.js team
---
