<script lang="ts" setup>
import { useAnimate, useIntervalFn } from "@vueuse/core"
import dayjs, { Dayjs } from "dayjs"
import { computed, ref, watch } from "vue"

const props = defineProps<{
  fontSize: string
  at: Dayjs
}>()

const waitingMinutes = ref(props.at.diff(dayjs(), "minutes"))
const minutes = ref<HTMLElement>()

const keyframes = [{ transform: "scale(1.4)" }, { transform: "scale(1)" }]
const { play } = useAnimate(minutes, keyframes, {
  duration: 2000,
  easing: "cubic-bezier(.21,.92,.49,.97)",
})

const showDots = computed(() => waitingMinutes.value < 0)
const blinking = ref(false)

useIntervalFn(() => {
  waitingMinutes.value = props.at.diff(dayjs(), "minutes")
  blinking.value = props.at.isBefore(dayjs())
}, 5000)

watch(
  () => waitingMinutes.value,
  () => play()
)
</script>

<template>
  <time :style="{ fontSize }" :datetime="at.format()">
    <div v-if="showDots || true" class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <span :class="{ blinking }" ref="minutes">{{ waitingMinutes }}</span>
  </time>
</template>

<style scoped>
time {
  position: relative;
  padding: 0.2rem 0;
  min-width: 12vw;
  max-width: fit-content;
  background-color: black;
  border-radius: 0.2rem;
  color: var(--waiting-time-color);
  display: grid;
  place-items: center;
  font-weight: bold;
}

.blinking {
  animation: blink 1s infinite steps(1);
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  30% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

.dots {
  position: absolute;
  bottom: 0.3em;
  display: flex;
  gap: 0.1em;
}

.dots + * {
  visibility: hidden;
}

.dot {
  width: 0.2em;
  height: 0.2em;
  background-color: var(--waiting-time-color);
  border-radius: 50%;
  animation: blink 1.4s infinite steps(1);
}

.dot:nth-child(2) {
  animation-delay: 0.3s;
}

.dot:nth-child(3) {
  animation-delay: 0.6s;
}
</style>
