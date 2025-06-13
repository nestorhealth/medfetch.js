<style src="./DataTable.css"></style>
<template>
  <div>
    <table>
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.name"
          >
            {{ col.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in paginatedRows" :key="i">
          <td
            v-for="col in columns"
            :key="col.name"
          >
            {{ formatCell(row[col.name]) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div>
      <button
        @click="page--"
        :disabled="page === 1"
      >
        Prev
      </button>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <button
        @click="page++"
        :disabled="page >= totalPages"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";

const props = defineProps<{
  columns: { name: string; dataType?: string }[];
  rows: Record<string, unknown>[];
}>();

const rowsPerPage = 5;
const page = ref(1);

const totalPages = computed(() =>
  Math.ceil(props.rows.length / rowsPerPage)
);

const paginatedRows = computed(() => {
  const start = (page.value - 1) * rowsPerPage;
  return props.rows.slice(start, start + rowsPerPage);
});

watch(
  () => props.rows.length,
  () => {
    // Reset to page 1 if data changes
    page.value = 1;
  }
);

function formatCell(val: unknown) {
  if (val == null) return "—";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}
</script>
