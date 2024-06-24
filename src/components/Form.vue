<script lang="ts" setup>
import { ref } from "vue"
import SearchModal from "./SearchModal.vue"
import { Position } from "../services/Wagon"
const lineName = ref<string>("")
const isSearchModalOpen = ref<boolean>(false)
const position = ref<string>("")
function fillFieldWithCurrentLocation() {
  navigator.geolocation.getCurrentPosition((p) => {
    const { latitude, longitude } = p.coords
    position.value = `${latitude}, ${longitude}`
  })
}
const handleSelection = (idLine: string, stopPosition: Position) => {
  lineName.value = idLine
  position.value = `${stopPosition.lat}, ${stopPosition.long}`
}
</script>

<template>
  <SearchModal
    :isOpen="isSearchModalOpen"
    @selection="handleSelection"
    @close="isSearchModalOpen = false"
  />
  <div class="forms">
    <form action="/" method="get">
      <section class="searchSection">
        <label>
          <p>Coordonnées GPS de l'arrêt</p>
          <input
            type="text"
            v-model="position"
            name="near"
            placeholder="48.8534, 2.3122"
            required
          />
          <button type="button" @click="fillFieldWithCurrentLocation">
            Position actuelle
          </button>
        </label>
        <div>
          <button type="button" @click="isSearchModalOpen = true">
            Chercher un arrêt par le nom
          </button>
        </div>
      </section>

      <label>
        <p>Numéro de la ligne</p>
        <input
          type="text"
          name="for"
          placeholder="T3b"
          v-model="lineName"
          required
        />
      </label>
      <label>
        <p>Nom de l'arrêt de destination <small>(Facultatif)</small></p>
        <input type="text" name="directionHint" placeholder="vincennes" />
      </label>
      <br />
      <br />
      <button>Charger</button>
    </form>
  </div>
</template>

<style scoped>
.forms {
  padding: 2rem;
}

p {
  margin-bottom: 0.5rem;
}
.results {
  display: flex;
  flex-direction: column;
  gap: min(0.2vw, 10px);
}
.searchSection {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  gap: 0.5vw;
  align-items: flex-end;
}
</style>
