<script setup lang="ts">
import { onMounted, ref } from "vue"
import Screen from "./components/Screen.vue"
import Form from "./components/Form.vue"
import dayjs from "dayjs"

const lat = ref<number | null>(null)
const lon = ref<number | null>(null)
const lineNumber = ref<string | null>(null)
const directionHint = ref<string | null>(null)

function loadParamsFromUrl() {
  const urlParams = new URLSearchParams(window.location.search)

  const coordinates = urlParams.get("near")?.split(",")
  lat.value = coordinates?.[0] ? parseFloat(coordinates[0]) : null
  lon.value = coordinates?.[1] ? parseFloat(coordinates[1]) : null
  lineNumber.value = urlParams.get("for") ?? ""
  directionHint.value = urlParams.get("directionHint") ?? null
}

onMounted(() => {
  loadParamsFromUrl()

  const reloadAfter = dayjs().endOf("day").diff(dayjs(), "milliseconds")

  setInterval(() => {
    location.reload()
  }, reloadAfter)
})
</script>

<template>
  <Screen
    v-if="lat && lon && lineNumber"
    :lat="lat"
    :lon="lon"
    :line-number="lineNumber"
    :direction-text-hint="directionHint"
  ></Screen>
  <Form v-else></Form>
  <footer>
    <p>
      Il s'agit d'une reproduction des écrans installés dans les stations de
      métro RATP. Ce site n'est pas un site officiel et n'a aucun lien avec la
      RATP.
    </p>
  </footer>
</template>

<style scoped>
footer {
  padding: 0.5rem 2rem;
  color: gray;
}
</style>
