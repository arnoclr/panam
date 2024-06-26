<script lang="ts" setup>
import { ref } from "vue"
import SearchModal from "./SearchModal.vue"
import { SimpleLine, SimpleStop } from "../services/Wagon"
const lineName = ref<string>("")
const position = ref<string>("")
const searchStopDialog = ref<InstanceType<typeof SearchModal> | null>(null)
function fillFieldWithCurrentLocation() {
  navigator.geolocation.getCurrentPosition((p) => {
    const { latitude, longitude } = p.coords
    position.value = `${latitude}, ${longitude}`
  })
}
const handleSelection = (stop: SimpleStop, line: SimpleLine | null) => {
  lineName.value = line?.number || ""
  position.value = `${stop.position.lat}, ${stop.position.long}`
}
</script>

<template>
  <SearchModal @selected="handleSelection" ref="searchStopDialog" />
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
          <button type="button" @click="searchStopDialog?.openModal">
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
