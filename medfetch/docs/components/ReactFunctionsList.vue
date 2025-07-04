<script setup lang="ts">
const modules = import.meta.glob("/functions.react.*.md", {
  eager: true
});

const links = Object.keys(modules)
  .map(path => {
    // Match /functions.react.someFunction.md
    const match = path.match(/^\/functions\.react\.(.+)\.md$/);
    if (!match) return null;
    const name = match[1];
    return {
      name,
      path: path.replace(/\.md$/, "")
    };
  })
  .filter(Boolean);
</script>

<template>
  <ul>
    <li v-for="link in links" :key="link.path">
      <a :href="link.path">{{ link.name }}</a>
    </li>
  </ul>
</template>
