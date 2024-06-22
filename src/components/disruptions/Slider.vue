<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watchEffect } from "vue"
import { SimpleDisruption } from "../../services/Wagon"
import LineIndicator from "./LineIndicator.vue"

const props = defineProps<{
  disruptions: SimpleDisruption[]
}>()

const rotatingDisruptions = ref<SimpleDisruption[]>([])
const isAnimating = ref(true)

watchEffect(() => {
  rotatingDisruptions.value = [...props.disruptions]
})

function triggerAnimation() {
  isAnimating.value = false
  setTimeout(() => {
    isAnimating.value = true
  }, 10)
}

onMounted(() => {
  const interval = setInterval(() => {
    if (rotatingDisruptions.value.length > 0) {
      const firstElement = rotatingDisruptions.value.shift()
      rotatingDisruptions.value.push(firstElement!)
      triggerAnimation()
    }
  }, 10_000)

  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<template>
  <aside v-if="disruptions.length > 0" :appear="isAnimating">
    <header>
      <div class="current">
        <LineIndicator
          class="indicator"
          :disruption="rotatingDisruptions[0]"
          size="default"
        ></LineIndicator>
      </div>
      <div role="row">
        <LineIndicator
          v-for="disruption in rotatingDisruptions.slice(1)"
          :disruption="disruption"
          size="small"
          class="indicator"
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
  padding-right: 3vw;
  padding-bottom: 0;
  background-color: white;
  overflow: hidden;
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

[appear="true"] .current .indicator,
[appear="true"] [role="row"] .indicator {
  animation: slide-to-left 1.6s cubic-bezier(0.21, 0.07, 0.49, 1);
}

[appear="true"] .content {
  animation: slide-to-left-light 1s cubic-bezier(0.21, 0.07, 0.49, 1);
}

@keyframes slide-to-left {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slide-to-left-light {
  0% {
    transform: translateX(4vw);
    opacity: 0.5;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-height: 40vw) {
  header .current {
    padding-top: 3vw;
  }
}
</style>
