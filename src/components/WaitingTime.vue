<script lang="ts" setup>
import { useAnimate, useIntervalFn } from "@vueuse/core"
import dayjs, { Dayjs } from "dayjs"
import { computed, ref, watch } from "vue"

const props = defineProps<{
  fontSize: string
  at: Dayjs
}>()

const waitingMinutes = ref(props.at.diff(dayjs(), "minutes"))
const displayedMinutes = ref(waitingMinutes.value)
const isUpdating = ref(false)

const showDots = computed(() => displayedMinutes.value < 0)
const blinking = ref(false)

useIntervalFn(() => {
  waitingMinutes.value = props.at.diff(dayjs(), "minutes")
  blinking.value = props.at.isBefore(dayjs())
}, 5000)

watch(
  waitingMinutes,
  () => {
    if (isUpdating.value) {
      return
    }

    isUpdating.value = true

    // Update the value at the peak of the shrink (1.5s mark when scale is at minimum)
    setTimeout(() => {
      displayedMinutes.value = waitingMinutes.value
    }, 1500)

    // End the animation after 3 seconds
    setTimeout(() => {
      isUpdating.value = false
    }, 3000)
  },
  { immediate: false }
)
</script>

<template>
  <time :style="{ fontSize }" :datetime="at.format()">
    <div v-if="showDots" class="dots">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </div>
    <span :class="{ blinking, updating: isUpdating }">{{ displayedMinutes }}</span>
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

.updating {
  animation: waiting-time-update 3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes waiting-time-update {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

.blinking {
  animation: blink-number 1s infinite;
}

@keyframes blink-number {
  0% {
    opacity: 1;
  }
  40% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  90% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  20% {
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
