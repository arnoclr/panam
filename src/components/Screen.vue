<script setup lang="ts">
import { useIntervalFn } from "@vueuse/core"
import { computed, onMounted, ref } from "vue"
import type {
  SimpleDeparture,
  SimpleDisruption,
  SimpleLine,
} from "../services/Wagon"
import { Wagon } from "../services/Wagon"
import CurrentTime from "./CurrentTime.vue"
import DepartureRow from "./DepartureRow.vue"
import EmptyState from "./EmptyState.vue"
import Header from "./Header.vue"
import WaitingTime from "./WaitingTime.vue"
import Slider from "./disruptions/Slider.vue"

const props = defineProps<{
  lat: number
  lon: number
  lineNumber: string
  directionTextHint: string | null
}>()

const departures = ref<SimpleDeparture[]>([])
const disruptions = ref<SimpleDisruption[]>([])
const line = ref<SimpleLine>()

async function updateDepartures() {
  const data = await Wagon.getDeparturesNear(
    props.lat,
    props.lon,
    props.lineNumber
  )

  const branchHashOfDirectionHint = data.departures.find(
    (x) =>
      props.directionTextHint !== null &&
      x.destination
        .toLocaleLowerCase()
        .includes(props.directionTextHint.toLocaleLowerCase())
  )?.branchHash

  departures.value = data.departures
    .filter((x) =>
      branchHashOfDirectionHint
        ? x.branchHash === branchHashOfDirectionHint
        : true
    )
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

async function updateDisruptions() {
  const lineId = line.value?.id

  if (!lineId) {
    return
  }

  disruptions.value = await Wagon.getDisruptions(
    props.lat,
    props.lon,
    lineId,
    "",
    ""
  )
}

useIntervalFn(async () => {
  await updateDepartures()
}, 61 * 1000)

useIntervalFn(async () => {
  await updateDisruptions()
}, 5 * 60 * 1000)

onMounted(async () => {
  await updateDepartures()
  await updateDisruptions()
})
</script>

<template>
  <main>
    <CurrentTime class="clock"></CurrentTime>
    <Header
      class="header"
      v-if="line"
      :line="line"
      :direction="mostCommonDestination"
    ></Header>
    <EmptyState v-if="departures.length === 0"></EmptyState>
    <div class="withDisruptions">
      <TransitionGroup
        tag="section"
        name="horizontal"
        v-if="nextDeparturesGoesToSameDestination"
      >
        <article
          v-for="(departure, i) in departures.slice(0, 2)"
          :key="departure.id"
        >
          <span v-if="i == 0">1<sup>er</sup> métro</span>
          <span v-if="i == 1">2<sup>e</sup> métro</span>
          <WaitingTime font-size="18vw" :at="departure.leavesAt"></WaitingTime>
        </article>
      </TransitionGroup>
      <TransitionGroup name="vertical" tag="ul" v-else>
        <DepartureRow
          v-for="departure in departures"
          :departure="departure"
          :key="departure.id"
        ></DepartureRow>
      </TransitionGroup>
      <Slider :disruptions="disruptions"></Slider>
    </div>
  </main>
</template>

<style scoped>
main {
  background-color: black;
  height: 100vh;
  display: grid;
  grid-template-rows: auto 1fr;
}

.clock {
  position: absolute;
  top: 0;
  right: calc(env(safe-area-inset-left) + 2vw);
  z-index: 1;
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
  height: 100%;
  padding: 0 0.5rem;
  padding-left: env(safe-area-inset-left);
  display: flex;
  align-items: center;
  overflow: hidden;
}

article {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 50%;
}

article:last-child::before {
  --offset: 25%;
  content: "";
  position: absolute;
  top: var(--offset);
  left: 0;
  bottom: var(--offset);
  width: 1vw;
  background-color: white;
  border-radius: 999px;
}

article span {
  margin-left: 2vw;
  color: white;
  font-size: 2vw;
}

article time {
  align-self: center;
}

.withDisruptions {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

@media (max-height: 40vw) {
  main {
    grid-template-rows: 1fr;
  }

  .header {
    display: none;
  }
}

@media (max-height: 60vw) {
  .withDisruptions {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
