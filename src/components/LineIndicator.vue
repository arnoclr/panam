<script lang="ts" setup>
import type { SimpleLine } from "../services/Wagon"

defineProps<{
  line: SimpleLine
  height: string
}>()
</script>

<template>
  <div :style="{ height }" v-html="line.numberShapeSvg"></div>
</template>
