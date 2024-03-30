<script lang="ts" setup>
import type { SimpleDeparture } from "../services/Wagon"
import WaitingTime from "./WaitingTime.vue"

defineProps<{
  departure: SimpleDeparture
}>()
</script>

<template>
  <li>
    <span>{{ departure.destination }}</span>
    <WaitingTime
      font-size="max(1.5rem, 5vw)"
      :at="departure.leavesAt"
    ></WaitingTime>
  </li>
</template>

<style scoped>
li {
  padding: 0.5rem;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.5rem;
}

span {
  color: var(--station-text-color);
  font-weight: bold;
  font-size: max(1.5rem, 5vw);
}
</style>
