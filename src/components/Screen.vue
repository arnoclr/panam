<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core"
import { computed, onMounted, ref } from "vue"
import type { SimpleDeparture, SimpleLine } from "../services/Wagon"
import { Wagon } from "../services/Wagon"
import DepartureRow from "./DepartureRow.vue"
import Header from "./Header.vue"
import WaitingTime from "./WaitingTime.vue"
import EmptyState from "./EmptyState.vue"

const props = defineProps<{
  lat: number
  lon: number
  lineNumber: string
}>()

const departures = ref<SimpleDeparture[]>([])
const line = ref<SimpleLine>()

async function updateDepartures() {
  const data = await Wagon.getDeparturesNear(
    props.lat,
    props.lon,
    props.lineNumber
  )
  departures.value = data.departures
    .sort((a, b) => a.leavesAt.diff(b.leavesAt))
    .slice(0, 3)
  line.value = data.line
}

const mostCommonDestination = computed<string>(() => {
  const destinationCounts = {} as Record<string, number>

  for (const departure of departures.value) {
    if (destinationCounts[departure.destination]) {
      destinationCounts[departure.destination]++
    } else {
      destinationCounts[departure.destination] = 1
    }
  }

  const proportion =
    Math.max(...Object.values(destinationCounts)) / departures.value.length

  if (proportion < 0.5) {
    return [...Object.keys(destinationCounts)].join(" • ")
  }

  return Object.entries(destinationCounts).reduce(
    (a, b) => (b[1] > a[1] ? b : a),
    ["", 0]
  )[0]
})

const nextDeparturesGoesToSameDestination = computed<boolean>(() => {
  return departures.value.every(
    (departure) => departure.destination === mostCommonDestination.value
  )
})

useIntervalFn(async () => {
  await updateDepartures()
}, 40 * 1000)

onMounted(async () => {
  await updateDepartures()
})
</script>

<template>
  <main>
    <Header
      v-if="line"
      :line="line"
      :direction="mostCommonDestination"
    ></Header>
    <EmptyState v-if="departures.length === 0"></EmptyState>
    <TransitionGroup
      tag="section"
      name="horizontal"
      v-else-if="nextDeparturesGoesToSameDestination"
    >
      <article
        v-for="(departure, i) in departures.slice(0, 2)"
        :key="departure.id"
      >
        <span v-if="i == 0">1<sup>er</sup> métro</span>
        <span v-if="i == 1">2<sup>e</sup> métro</span>
        <WaitingTime font-size="20vw" :at="departure.leavesAt"></WaitingTime>
      </article>
    </TransitionGroup>
    <TransitionGroup name="vertical" tag="ul" v-else>
      <DepartureRow
        v-for="departure in departures"
        :departure="departure"
        :key="departure.id"
      ></DepartureRow>
    </TransitionGroup>
  </main>
</template>

<style scoped>
main {
  background-color: black;
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
}

ul {
  padding: 1rem;
  margin: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

section {
  padding: 2rem 3rem;
  display: flex;
  align-items: start;
}

article {
  display: flex;
  flex-direction: column;
  width: 50%;
}

article span {
  color: white;
}

article time {
  align-self: center;
}
</style>
