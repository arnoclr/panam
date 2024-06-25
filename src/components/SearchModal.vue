<template>
  <dialog id="searchStopModal" ref="searchStopModal">
    <button class="close-button" @click="closeModal">Fermer</button>
    <div class="header">
      <h1 class="title">Recherche d'arrêt</h1>
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
</template>

<script setup lang="ts">
import { ref } from "vue"
import { SimpleLine, SimpleStop, Wagon } from "../services/Wagon"
import Stop from "./Stop.vue"

const search = ref<string>("")
const stops = ref<SimpleStop[] | null>(null)
const searchStopModal = ref<HTMLDialogElement | null>(null)
const emit = defineEmits<{
  (e: "selected", stop: SimpleStop, line: SimpleLine | null): void
}>()

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

function selectStop(stop: SimpleStop, line: SimpleLine | null) {
  emit("selected", stop, line)
  if (line !== null) {
    closeModal()
  }
}

function closeModal() {
  searchStopModal.value?.close()
}
function openModal() {
  searchStopModal.value?.showModal()
}
defineExpose({ openModal })
</script>

<style scoped>
dialog[open] {
  margin: 0 auto;
  position: fixed;
  top: 10%;
  z-index: 1000;
  width: min(80%, 700px);
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(20, 18, 18, 0.1);
  border: 2px rgba(27, 27, 27, 0.3) solid;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

dialog[open] {
  animation: slide 0.3s ease;
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
  align-items: center;
}

dialog::backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.search-stops {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex-grow: 1;
}

.search {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.title {
  font-size: min(30px, 5vw);
}
.close-button {
  width: fit-content;
  margin-left: auto;
}
.results {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  overflow-y: auto;
  max-height: 50vh;
}
</style>
