<script setup lang="ts">
import { computed, ref, defineEmits, watch } from "vue"
import { SimpleLine, SimpleStop } from "../services/Wagon"
import LineIndicator from "./LineIndicator.vue"

interface StopProps {
  stop: SimpleStop
  lines: SimpleLine[]
}
const emit = defineEmits<{
  (e: "selected", stopId: string, lineId: string): void
}>()

const { stop, lines } = defineProps<StopProps>()

function sortLines(lines: SimpleLine[]): SimpleLine[] {
  return lines.sort((a, b) => {
    if (!isNaN(Number(a.id)) && !isNaN(Number(b.id))) {
      return Number(a.id) - Number(b.id)
    } else if (!isNaN(Number(a.id))) {
      return -1
    } else if (!isNaN(Number(b.id))) {
      return 1
    } else {
      return a.id.localeCompare(b.id)
    }
  })
}

const groupedLines = computed(() => {
  const groups: { [key: string]: SimpleLine[] } = {}
  lines.forEach((line) => {
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
    // Reset expanded groups on lines change
    expandedGroups.value = {}
  },
  { deep: true }
)
</script>

<template>
  <div class="stop">
    <button class="stop-name" @click="$emit('selected', stop.id, '')">
      {{ stop.name }}
    </button>
    <div class="stop-lines">
      <div v-for="(lines, mode) in groupedLines" :key="mode" class="mode-group">
        <div class="lines">
          <img :src="String(mode)" alt="Mode icon" class="mode-icon" />
          <button
            class="line"
            v-for="line in expandedGroups[mode] ? lines : lines.slice(0, 6)"
            :key="line.id"
            @click="$emit('selected', stop.id, line.id)"
          >
            <LineIndicator class="line-logo" :line="line" height="2vw" />
          </button>
          <div v-if="lines.length > 6" class="more-lines">
            <button @click="toggleGroup(String(mode))">
              {{
                expandedGroups[mode]
                  ? "Masquer"
                  : `+ ${lines.length - 6} autres lignes`
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stop-name {
  color: black;
  font-size: min(2vw, 20px);
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
  height: max(10px, 2vw);
  margin-bottom: min(0.2vw, 5px);
}

.lines {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: min(0.2vw, 5px);
  align-items: center;
}
button {
  margin: 0;
  padding: 0;
}
.line {
  text-decoration: none;
}

.more-lines {
  font-size: min(1.5vw, 15px);
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
