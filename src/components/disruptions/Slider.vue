<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue"
import { SimpleDisruption } from "../../services/Wagon"
import LineIndicator from "./LineIndicator.vue"

const props = defineProps<{
  disruptions: SimpleDisruption[]
}>()

const rotatingDisruptions = ref<SimpleDisruption[]>([])

watchEffect(() => {
  rotatingDisruptions.value = [...props.disruptions]
})

onMounted(() => {
  const interval = setInterval(() => {
    if (rotatingDisruptions.value.length > 0) {
      const firstElement = rotatingDisruptions.value.shift()
      rotatingDisruptions.value.push(firstElement!)
    }
  }, 10_000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <aside v-if="disruptions.length > 0">
    <header>
      <div class="current">
        <LineIndicator
          :disruption="rotatingDisruptions[0]"
          size="default"
        ></LineIndicator>
      </div>
      <div role="row">
        <LineIndicator
          v-for="disruption in rotatingDisruptions.slice(1)"
          :disruption="disruption"
          size="small"
        ></LineIndicator>
      </div>
    </header>
    <div class="content">
      <p>{{ rotatingDisruptions[0].description }}</p>
    </div>
  </aside>
</template>

<style scoped>
aside {
  height: 100%;
  background-color: white;
}

header {
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
}

.current {
  padding: 1vw 2vw;
  padding-bottom: 0;
  background-color: white;
}

.content {
  padding: 1vw 2vw;
  font-size: 3.2vw;
}

[role="row"] {
  height: 3.6vw;
  align-items: end;
  padding: 0 2vw;
  display: flex;
  gap: 1.5vw;
}
</style>
