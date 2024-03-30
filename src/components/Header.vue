<script lang="ts" setup>
import type { SimpleLine } from "../services/Wagon"
import LineIndicator from "./LineIndicator.vue"

defineProps<{
  line: SimpleLine
  direction: string
}>()
</script>

<template>
  <header>
    <div role="group">
      <img :src="line.pictoPng" alt="" />
      <LineIndicator :line="line" height="5vw"></LineIndicator>
    </div>
    <h1>{{ direction }}</h1>
  </header>
</template>

<style scoped>
header,
[role="group"] {
  display: flex;
  align-items: center;
  gap: 6px;
}

header {
  padding: 1rem 2rem;
  background-color: white;
  gap: 2vw;
}

h1 {
  color: var(--station-text-color);
  font-size: max(1.5rem, 5vw);
  margin: 0;
}

img {
  height: 5vw;
  width: auto;
}
</style>
