<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { sortLines } from "../utils/Lines"
import { SimpleLine, SimpleStop } from "../services/Wagon"
import LineIndicator from "./LineIndicator.vue"

const MAX_DISPLAYED_LINES = 6

interface StopProps {
  stop: SimpleStop
}
const emit = defineEmits<{
  (e: "selected", stop: SimpleStop, line: SimpleLine | null): void
}>()

const { stop } = defineProps<StopProps>()
const lines = computed<SimpleLine[]>(() => stop.lines)

const groupedLines = computed(() => {
  const groups: { [key: string]: SimpleLine[] } = {}
  lines.value.forEach((line) => {
    if (!groups[line.pictoPng]) {
      groups[line.pictoPng] = []
    }
    groups[line.pictoPng].push(line)
  })

  Object.keys(groups).forEach((mode) => {
    groups[mode] = sortLines(groups[mode])
  })

  return groups
})

const expandedGroups = ref<{ [key: string]: boolean }>({})

function toggleGroup(mode: string) {
  expandedGroups.value[mode] = !expandedGroups.value[mode]
}

watch(
  () => lines,
  () => {
    expandedGroups.value = {}
  },
  { deep: true }
)
</script>

<template>
  <div class="stop">
    <button class="stop-name" @click="$emit('selected', stop, null)">
      {{ stop.name }}
    </button>
    <div class="stop-lines">
      <div v-for="(lines, mode) in groupedLines" :key="mode" class="mode-group">
        <div class="lines">
          <img :src="String(mode)" alt="Mode icon" class="mode-icon" />
          <button
            class="line"
            v-for="line in expandedGroups[mode]
              ? lines
              : lines.slice(0, MAX_DISPLAYED_LINES)"
            :key="line.id"
            @click="$emit('selected', stop, line)"
          >
            <LineIndicator
              class="line-logo"
              :line="line"
              height="min(30px, 4vw)"
            />
          </button>
          <button
            @click="toggleGroup(String(mode))"
            v-if="lines.length > MAX_DISPLAYED_LINES"
            class="more-lines"
          >
            {{
              expandedGroups[mode]
                ? "Masquer"
                : `+ ${lines.length - MAX_DISPLAYED_LINES} autres lignes`
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stop-name {
  color: black;
  font-size: min(4vw, 25px);
  margin-bottom: min(0.5vw, 5px);
}
.stop-name:hover {
  text-decoration: none;
}
.stop-lines {
  display: flex;
  flex-direction: column;
  gap: min(0.5vw, 10px);
}

.mode-group {
  display: flex;
  flex-direction: column;
}

.mode-icon {
  height: min(30px, 4vw);
  margin-bottom: min(0.2vw, 5px);
}

.lines {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: min(0.2vw, 5px);
  align-items: flex-start;
}
button {
  margin: 0;
  padding: 0;
}
.line {
  text-decoration: none;
}

.more-lines {
  font-size: min(2vw, 15px);
  color: grey;
  align-self: center;
}

button {
  background: none;
  border: none;
  color: grey;
  cursor: pointer;
  font-size: min(1.5vw, 15px);
  text-decoration: underline;
}
</style>
