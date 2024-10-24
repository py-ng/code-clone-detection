<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const code = ref('')
const k = ref(1)
const candidatesCount = ref(0)
const showInfo = ref(false)
const candidates = ref({})
const router = useRouter()

const handleFileUpload = event => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = e => {
      try {
        const jsonData = JSON.parse(e.target.result)

        // Validate JSON structure
        if (typeof jsonData !== 'object' || Array.isArray(jsonData)) {
          throw new Error(
            'The JSON structure should be an object with key-value pairs.',
          )
        }

        // Validate that each key's value is a string
        const isValidFormat = Object.entries(jsonData).every(
          ([key, value]) =>
            typeof key === 'string' && typeof value === 'string',
        )

        if (!isValidFormat) {
          throw new Error(
            'Each key must map to a string representing the code.',
          )
        }

        // If valid, assign the parsed data and update candidate count
        candidates.value = jsonData
        candidatesCount.value = Object.keys(jsonData).length
      } catch (error) {
        // Detailed error alert
        alert(
          `Invalid JSON format: ${error.message}\n\nExpected format:\n{\n  "key1": "code1",\n  "key2": "code2",\n  ...\n}`,
        )
      }
    }
    reader.readAsText(file)
  }
}

const toggleInfo = () => {
  showInfo.value = !showInfo.value
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
      <h1 class="title">Find Top K Semantically Similar Codes</h1>

      <!-- Main Code Input -->
      <div class="field">
        <label class="label">Input Code</label>
        <textarea
          class="textarea"
          v-model="code"
          placeholder="Write or Paste your code here..."
          required
        ></textarea>
      </div>

      <!-- Candidates File Upload -->
      <div class="field">
        <label class="label">
          Candidate Codes (Upload JSON File)
          <span class="icon has-text-info is-clickable" @click="toggleInfo">
            <ion-icon name="information-circle"></ion-icon>
          </span>
        </label>
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

        <!-- Toggleable explanation section for expected JSON format -->
        <div v-show="showInfo" class="content">
          <p><strong>Expected JSON format:</strong></p>
          <pre>
{
  "key1": "code1",
  "key2": "code2",
  ...
}</pre
          >
          <p>
            Each key represents a unique identifier, and the value is the
            corresponding candidate code.
          </p>
        </div>
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
