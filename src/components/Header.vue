<script lang="ts" setup>
import type { SimpleLine } from "../services/Wagon"
import { toCSSColor } from "../utils/Colors"
import LineIndicator from "./LineIndicator.vue"

defineProps<{
  line: SimpleLine
  direction: string
}>()
</script>

<template>
  <header :style="{ '--line-color': toCSSColor(line.backgroundColor) }">
    <div role="group">
      <img :src="line.pictoPng" alt="" />
      <LineIndicator :line="line" height="8vw"></LineIndicator>
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
  padding: 1vw 2vw;
  background-color: white;
  gap: 2vw;
  border-bottom: 2vw solid var(--line-color);
}

h1 {
  color: var(--station-text-color);
  font-size: max(1.5rem, 5vw);
  margin: 0;
}

img {
  height: 8vw;
  width: auto;
}

@media (max-height: 60vw) {
  header {
    border-bottom: none;
  }
}
</style>
