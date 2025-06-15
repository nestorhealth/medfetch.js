<script setup lang="ts">
import { onMounted, ref } from "vue";
import { codeToHtml } from "shiki";

const props = defineProps<{
  code: string;
  lang?: "sql" | "ts" | "js";
}>();

const html = ref("");

onMounted(async () => {
  html.value = await codeToHtml(props.code, {
    lang: "sql",
    theme: "github-dark"
  });
});
</script>

<template>
  <div v-html="html" />
</template>
