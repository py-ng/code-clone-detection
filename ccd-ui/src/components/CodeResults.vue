<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Results for your Code</h1>

      <div class="box">
        <h2 class="subtitle">Your Input Code:</h2>
        <pre class="code">{{ code }}</pre>
      </div>

      <div
        v-for="(item, index) in sortedResults"
        :key="index"
        class="box"
        :style="getColorStyle(item.percentage)"
      >
        <h3 class="subtitle">
          Candidate {{ item.key }} - {{ item.percentage }}% Similar
        </h3>
        <pre class="code">{{ candidates[item.key] }}</pre>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const code = ref('')
const candidates = ref({})
const sortedResults = ref([])

const getColorStyle = percentage => {
  const green = Math.floor((percentage / 100) * 255)
  const red = 255 - green
  return {
    border: `2px solid rgb(${red}, ${green}, 0)`,
    boxShadow: `0px 0px 10px rgb(${red}, ${green}, 0)`,
  }
}

onMounted(() => {
  const payload = JSON.parse(localStorage.getItem('payload'))
  if (payload) {
    code.value = payload.code
    candidates.value = payload.candidates

    // Simulating a fake backend response with static top K results
    const fakeResults = [
      { key: 'key1', percentage: 90 },
      { key: 'key2', percentage: 75 },
      { key: 'key3', percentage: 50 },
    ]

    sortedResults.value = fakeResults.slice(0, payload.k)
  }
})
</script>

<style scoped>
.code {
  background-color: #f5f5f5;
  padding: 1em;
  border-radius: 5px;
  overflow-x: auto;
}
</style>
