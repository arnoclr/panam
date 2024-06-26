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
  display: flex;
  justify-content: center;
  align-items: center;
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
  box-sizing: border-box;
  min-width: var(--height);
  padding: calc(var(--height) * 0.14) calc(var(--height) * 0.2);
}

.circleFilled {
  border-radius: 50%;
}

.squareFilled {
  border-radius: calc(var(--height) * 0.2);
}

.rectangleFilled span {
  font-size: calc(var(--height) * 0.85);
}
span {
  font-size: calc(var(--height) * 0.7);
  font-weight: bold;
}

.horizontalLines {
  position: relative;
  min-width: var(--height);
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
