<template>
  <pre><code class="language-sql">{{ text }}</code></pre>
</template>

<script setup lang="ts">
defineProps<{
  text: string
}>();
</script>
