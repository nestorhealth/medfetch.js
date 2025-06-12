<script setup lang="ts">
import { onMounted, ref } from "vue";
import { patients } from "../examples/icd";

type Patient = {
  patient_id: string;
  gender: string;
  age: number;
  active: string;
  fracture_code: string;
  fracture_text: string;
  onset_year: number;
};

const patientsRef = ref<Patient[]>([]);

onMounted(async () => {
  const results = await patients();
  patientsRef.value = results;
});
</script>

<template>
  <table v-if="patientsRef.length" class="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Gender</th>
        <th>Age</th>
        <th>Active</th>
        <th>Fracture Code</th>
        <th>Fracture Text</th>
        <th>Onset Year</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in results" :key="p.patient_id">
        <td>{{ p.patient_id }}</td>
        <td>{{ p.gender }}</td>
        <td>{{ p.age }}</td>
        <td>{{ p.active }}</td>
        <td>{{ p.fracture_code }}</td>
        <td>{{ p.fracture_text }}</td>
        <td>{{ p.onset_year }}</td>
      </tr>
    </tbody>
  </table>
  <p v-else>Loading patients...</p>
</template>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
th, td {
  border: 1px solid #ddd;
  padding: 0.5rem;
}
th {
  background: #f3f3f3;
}
</style>
