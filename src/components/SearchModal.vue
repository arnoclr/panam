<template>
  <div v-if="isOpen" class="backdrop" @click.self="closeDialog">
    <dialog open>
      <div class="header">
        <h1>Recherche d'arrêt</h1>
        <button class="close-button" @click="closeDialog">Fermer</button>
      </div>
      <div class="search-stops">
        <div class="search">
          <form @submit="onSubmitSearchStops">
            <input
              type="text"
              name="search"
              placeholder="Vincennes"
              v-model="search"
            />
            <button type="submit">Chercher</button>
          </form>
        </div>
        <div class="results" v-if="stops !== null">
          <template v-for="stop in stops" :key="stop.id">
            <Stop :stop="stop" @selected="selectStop" />
          </template>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { Position, SimpleStop, Wagon } from "../services/Wagon"
import Stop from "./Stop.vue"

const search = ref<string>("")
const stops = ref<SimpleStop[] | null>(null)
const { isOpen } = defineProps<{ isOpen: boolean }>()

const emits = defineEmits<{
  selection: [idLine: string, stopPosition: Position]
  close: []
}>()

function selectStop(stopId: string, lineId: string) {
  const stop = stops.value?.find((stop) => stop.id === stopId)
  const lineNumber =
    stops.value
      ?.find((stop) => stop.id === stopId)
      ?.lines.find((line) => line.id === lineId)?.number || ""
  if (!stop || !stop.position) {
    throw new Error("Impossible de trouver la position de l'arrêt")
  }
  if (lineNumber !== "" && stop.position) {
    closeDialog()
  }
  emits("selection", lineNumber, stop.position)
}

function onSubmitSearchStops(event: Event) {
  event.preventDefault()
  searchStops()
}

async function searchStops() {
  if (search.value.trim() === "") {
    return
  }
  const response = await Wagon.searchStops(search.value.trim())
  stops.value = response
}

function closeDialog() {
  emits("close")
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeDialog()
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeyDown)
})
</script>

<style scoped>
dialog {
  z-index: 1000;
  position: fixed;
  top: 5%;
  width: min(80%, 700px);
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

dialog[open] {
  animation: slide 0.3s ease;
}

/* dialog not open */
dialog:not([open]) {
  animation: slide 0.5s ease reverse;
}

@keyframes slide {
  0% {
    opacity: 0;
    scale: 0.5;
  }

  100% {
    opacity: 1;
    scale: 1;
  }
}

.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  /* Ensure the backdrop is behind the dialog */
}

.search-stops {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
  /* Ensures the search-stops section takes up available space */
}

.search {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow-y: auto;
  max-height: 50vh;
  /* Adjust this value to control the scrollable area */
}
</style>
