<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const code = ref('')
const k = ref(1)
const candidatesCount = ref(0)
const candidates = ref({})
const router = useRouter()

const handleFileUpload = event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        candidates.value = JSON.parse(e.target.result)
        candidatesCount.value = Object.keys(candidates.value).length
      } catch (error) {
        alert('Invalid JSON file.')
      }
    }
    reader.readAsText(file)
  }
}

const isValid = ref(false)
watch([code, k, candidatesCount], () => {
  isValid.value =
    code.value.length > 0 && k.value <= candidatesCount.value && k.value > 0
})

const submitForm = () => {
  if (isValid.value) {
    const payload = {
      code: code.value,
      candidates: candidates.value,
      k: k.value,
    }

    // Store the payload temporarily and navigate to the results page
    localStorage.setItem('payload', JSON.stringify(payload))
    router.push('/results')
  }
}
</script>

<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Find Similar Codes</h1>

      <!-- Main Code Input -->
      <div class="field">
        <label class="label">Input Code</label>
        <textarea
          class="textarea"
          v-model="code"
          placeholder="Paste your code here..."
          required
        ></textarea>
      </div>

      <!-- Candidates File Upload -->
      <div class="field">
        <label class="label">Candidate Codes (Upload JSON File)</label>
        <div class="file">
          <label class="file-label">
            <input
              class="file-input"
              type="file"
              @change="handleFileUpload"
              accept=".json"
            />
            <span class="file-cta">
              <span class="file-icon">
                <ion-icon name="cloud-upload"></ion-icon>
              </span>
              <span class="file-label">Choose a file…</span>
            </span>
          </label>
        </div>
        <p v-if="candidatesCount">
          Detected {{ candidatesCount }} candidates. Enter K between 1 and
          {{ candidatesCount }}.
        </p>
      </div>

      <!-- K Input -->
      <div class="field">
        <label class="label">Top K</label>
        <input
          class="input"
          type="number"
          v-model="k"
          :max="candidatesCount"
          min="1"
          required
        />
      </div>

      <!-- Submit Button -->
      <div class="field">
        <button
          class="button is-primary"
          :disabled="!isValid"
          @click="submitForm"
        >
          Find Similar Codes
        </button>
      </div>
    </div>
  </section>
</template>
