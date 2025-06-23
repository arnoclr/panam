<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue"
import { SimpleDisruption } from "../../services/Wagon"
import LineIndicator from "./LineIndicator.vue"

const props = defineProps<{
  disruptions: SimpleDisruption[]
}>()

const rotatingDisruptions = ref<SimpleDisruption[]>([])
const currentDisruption = ref<SimpleDisruption | null>(null)
const nextDisruption = ref<SimpleDisruption | null>(null)
const isTransitioning = ref(false)

watchEffect(() => {
  rotatingDisruptions.value = [...filterDisruptions()]
  if (rotatingDisruptions.value.length > 0 && !currentDisruption.value) {
    currentDisruption.value = rotatingDisruptions.value[0]
  }
})

function filterDisruptions() {
  if (props.disruptions.length < 6) {
    return props.disruptions
  }

  return props.disruptions.filter(
    (x) => x.type === "stoppedService" || x.type === "incident"
  )
}

function enhanceDisruptionText(text: string): string {
  const estimatedTimeRegex = /\d{1,2}(?::\d{2}|h\d{0,2})/gi
  return text.replace(estimatedTimeRegex, (match) => {
    return `<time>${match}</time>`
  })
}

function triggerTransition() {
  if (rotatingDisruptions.value.length <= 1) return
  
  // Get the next disruption
  const currentIndex = rotatingDisruptions.value.findIndex(d => d === currentDisruption.value)
  const nextIndex = (currentIndex + 1) % rotatingDisruptions.value.length
  nextDisruption.value = rotatingDisruptions.value[nextIndex]
  
  // Start transition
  isTransitioning.value = true
  
  // After transition completes, update current and reset state
  setTimeout(() => {
    currentDisruption.value = nextDisruption.value
    nextDisruption.value = null
    isTransitioning.value = false
  }, 1200) // Match the CSS animation duration
}

onMounted(() => {
  const interval = setInterval(() => {
    if (rotatingDisruptions.value.length > 1) {
      triggerTransition()
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
        <!-- Current disruption (slides out) -->
        <LineIndicator
          v-if="currentDisruption"
          class="indicator"
          :class="{ 'slide-out': isTransitioning }"
          :disruption="currentDisruption"
          size="default"
        ></LineIndicator>
        <!-- Next disruption (slides in) -->
        <LineIndicator
          v-if="nextDisruption && isTransitioning"
          class="indicator slide-in"
          :disruption="nextDisruption"
          size="default"
        ></LineIndicator>
      </div>
      <div role="row">
        <LineIndicator
          v-for="disruption in rotatingDisruptions.slice(1, 4)"
          :key="disruption.description"
          :disruption="disruption"
          size="small"
          class="indicator"
        ></LineIndicator>
      </div>
    </header>
    <div class="content">
      <!-- Current content (slides out) -->
      <p 
        v-if="currentDisruption"
        :class="{ 'slide-out': isTransitioning }"
        v-html="enhanceDisruptionText(currentDisruption.description)"
      ></p>
      <!-- Next content (slides in) -->
      <p 
        v-if="nextDisruption && isTransitioning"
        class="slide-in"
        v-html="enhanceDisruptionText(nextDisruption.description)"
      ></p>
    </div>
  </aside>
</template>

<style scoped>
aside {
  height: 100%;
  max-width: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  background-color: white;
  overflow: hidden;
  border-radius: 0.4vw 0.4vw 0 0;
}

header {
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
}

.current {
  padding: 1vw 2vw;
  padding-right: 3vw;
  padding-bottom: 0;
  background-color: white;
  overflow: hidden;
  position: relative;
}

.content {
  --font-size: 3.2vw;
  display: grid;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0.8vw 2vw;
  padding-right: calc(env(safe-area-inset-right) + 2vw);
  font-size: var(--font-size);
  position: relative;
}

.content p {
  margin: 0;
  max-height: calc(var(--font-size) * 0.98 * 6);
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
  position: absolute;
  top: 0.8vw;
  left: 2vw;
  right: calc(env(safe-area-inset-right) + 2vw);
}

.content p:deep(time) {
  padding: 0.2vw 0.5vw;
  background-color: rgb(73, 73, 73);
  border-radius: 0.5vw;
  color: white;
}

[role="row"] {
  height: 3.6vw;
  align-items: end;
  padding: 0 2vw;
  display: flex;
  gap: 1.5vw;
  overflow: hidden;
}

/* Enhanced slide animations */
.slide-out {
  animation: slide-out-left 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.slide-in {
  animation: slide-in-right 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.current .slide-in {
  position: absolute;
  top: 1vw;
  left: 2vw;
  right: 3vw;
}

@keyframes slide-out-left {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slide-in-right {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-height: 40vw) {
  header .current {
    padding-top: 2vw;
  }
}
</style>
