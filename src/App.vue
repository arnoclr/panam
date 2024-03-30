<script setup lang="ts">
import { onMounted } from "vue"
import Screen from "./components/Screen.vue"
import dayjs from "dayjs"

onMounted(() => {
  const reloadAfter = dayjs().endOf("day").diff(dayjs(), "milliseconds")

  setInterval(() => {
    location.reload()
  }, reloadAfter)
})
</script>

<template>
  <Screen></Screen>
  <footer>
    <p>
      Il s'agit d'une reproduction des écrans installés dans les stations de
      métro RATP. Ce site n'est pas un site officiel et n'a aucun lien avec la
      RATP.
    </p>
  </footer>
</template>

<style scoped></style>
