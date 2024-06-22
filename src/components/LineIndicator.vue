<script lang="ts" setup>
import type { SimpleLine } from "../services/Wagon"
import { toCSSColor } from "../utils/Colors"
import { toCamelCase } from "../utils/Strings"

defineProps<{
  line: SimpleLine
  height: string
}>()
</script>

<template>
  <div
    :style="{
      '--background-color': toCSSColor(line.backgroundColor),
      '--text-color': toCSSColor(line.textColor),
      '--height': height,
    }"
  >
    <div
      v-if="
        ['circle-filled', 'square-filled', 'rectangle-filled'].includes(
          line.backgroundShape
        )
      "
      :class="toCamelCase(line.backgroundShape, '-')"
    >
      <span>{{ line.number }}</span>
    </div>
    <div
      v-if="line.backgroundShape === 'horizontal-lines'"
      class="horizontalLines"
    >
      <span>{{ line.number }}</span>
    </div>
  </div>
</template>

<style scoped>
.circleFilled,
.squareFilled,
.rectangleFilled,
.horizontalLines {
  display: grid;
  place-items: center;
  height: var(--height);
}
.circleFilled,
.squareFilled,
.rectangleFilled {
  background-color: var(--background-color);
  color: var(--text-color);
}

.circleFilled,
.squareFilled {
  width: var(--height);
}

.rectangleFilled {
  padding: 0 1.5em;
}

.circleFilled {
  border-radius: 50%;
}

.squareFilled,
.rectangleFilled {
  border-radius: calc(var(--height) * 0.2);
}

span {
  font-size: calc(var(--height) * 0.7);
  font-weight: bold;
}

.circleFilled span {
  letter-spacing: -0.05em;
}

.horizontalLines {
  position: relative;
}

.horizontalLines::before,
.horizontalLines::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: calc(var(--height) * 0.1);
  border-radius: 9999px;
  background-color: var(--background-color);
}

.horizontalLines::before {
  top: unset;
  bottom: 0;
}

.horizontalLines span {
  font-size: calc(var(--height) * 0.6);
}
</style>
