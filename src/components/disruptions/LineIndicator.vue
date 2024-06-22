<script lang="ts" setup>
import { computed } from "vue"
import { SimpleDisruption } from "../../services/Wagon"
import LineIndicator from "../LineIndicator.vue"

const props = defineProps<{
  disruption: SimpleDisruption
  size: "default" | "small"
}>()

const sizeVw = computed(() => (props.size === "default" ? "5vw" : "2vw"))
</script>

<template>
  <div role="group" :style="{ '--size-vw': sizeVw }">
    <img :size="size" :src="disruption.line.pictoPng" />
    <LineIndicator :height="sizeVw" :line="disruption.line" />
    <div class="icon" :blink="size === 'default'">
      <template v-if="size === 'small'">
        <i v-if="disruption.type === 'incident'" class="small incident"></i>
        <i
          v-else-if="disruption.type === 'stoppedService'"
          class="small stopped"
        ></i>
        <svg
          v-else-if="disruption.type === 'worksite'"
          width="37"
          height="33"
          viewBox="0 0 37 33"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M23.696 3.99999L34.5213 22.75C36.8307 26.75 33.9439 31.75 29.3251 31.75H7.67452C3.05571 31.75 0.168952 26.75 2.47835 22.75L13.3037 4.00001C15.6131 3.44496e-06 21.3866 -3.12372e-06 23.696 3.99999Z"
            fill="#9E9E9E"
            stroke="white"
            stroke-width="4"
          />
        </svg>
      </template>
      <template v-else>
        <svg
          v-if="disruption.type === 'worksite'"
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_408_28)">
            <path
              d="M52 52H0V39.2935H5.369L21.1393 0H30.8594L46.6294 39.2935H52V52Z"
              fill="white"
            />
            <path
              d="M49.7292 49.766H2.27075V41.5275H6.9137L22.684 2.23405H29.3146L45.085 41.5275H49.7292V49.766Z"
              fill="#808080"
            />
            <path
              d="M20.959 12.6139L17.241 21.8783H34.7578L31.0398 12.6139H20.959Z"
              fill="white"
            />
            <path
              d="M13.5223 31.1425L9.80432 40.4066H42.1945L38.4765 31.1425H13.5223Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_408_28">
              <rect width="52" height="52" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <svg
          v-else-if="disruption.type === 'stoppedService'"
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="52" height="52" rx="8" fill="white" />
          <rect width="52" height="52" rx="8" fill="#FF1400" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M37.3546 42.7227L9 14.3681L14.3681 9L42.7227 37.3546L37.3546 42.7227Z"
            fill="white"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M42.7227 14.3681L14.3681 42.7227L9 37.3546L37.3546 9L42.7227 14.3681Z"
            fill="white"
          />
        </svg>
        <svg
          v-else-if="disruption.type === 'info'"
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_2781_3786)">
            <mask
              id="mask0_2781_3786"
              style="mask-type: luminance"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="30"
              height="30"
            >
              <path d="M0 0H30V30H0V0Z" fill="white" />
            </mask>
            <g mask="url(#mask0_2781_3786)">
              <path
                d="M24.9995 0.999023H4.99926C3.93846 0.999023 2.92111 1.42042 2.17101 2.17052C1.42091 2.92062 0.999512 3.93797 0.999512 4.99877V24.999C0.999512 26.0598 1.42091 27.0772 2.17101 27.8273C2.92111 28.5774 3.93846 28.9988 4.99926 28.9988H24.9995C26.0603 28.9988 27.0777 28.5774 27.8278 27.8273C28.5779 27.0772 28.9993 26.0598 28.9993 24.999V4.99877C28.9993 3.93797 28.5779 2.92062 27.8278 2.17052C27.0777 1.42042 26.0603 0.999023 24.9995 0.999023Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.99926 1.74902C4.13737 1.74902 3.31079 2.09141 2.70134 2.70085C2.0919 3.3103 1.74951 4.13689 1.74951 4.99877V24.999C1.74951 25.8609 2.0919 26.6875 2.70134 27.2969C3.31079 27.9064 4.13737 28.2488 4.99926 28.2488H24.9995C25.8614 28.2488 26.688 27.9064 27.2974 27.2969C27.9069 26.6875 28.2493 25.8609 28.2493 24.999V4.99877C28.2493 4.13689 27.9069 3.3103 27.2974 2.70085C26.688 2.09141 25.8614 1.74902 24.9995 1.74902H4.99926ZM0.249512 4.99877C0.249512 3.73906 0.74993 2.53094 1.64068 1.64019C2.53143 0.749442 3.73955 0.249023 4.99926 0.249023H24.9995C26.2592 0.249023 27.4673 0.749442 28.3581 1.64019C29.2488 2.53094 29.7493 3.73906 29.7493 4.99877V24.999C29.7493 26.2587 29.2488 27.4669 28.3581 28.3576C27.4673 29.2484 26.2592 29.7488 24.9995 29.7488H4.99926C3.73955 29.7488 2.53143 29.2484 1.64068 28.3576C0.74993 27.4669 0.249512 26.2587 0.249512 24.999V4.99877Z"
                fill="#A9A9A9"
              />
              <path
                d="M14.9996 11.2509C15.1664 11.2549 15.3322 11.2256 15.4874 11.1647C15.6426 11.1037 15.7841 11.0123 15.9034 10.8958C16.0228 10.7793 16.1176 10.6402 16.1824 10.4865C16.2472 10.3328 16.2805 10.1677 16.2805 10.001C16.2805 9.83422 16.2472 9.66914 16.1824 9.51547C16.1176 9.36179 16.0228 9.22263 15.9034 9.10616C15.7841 8.9897 15.6426 8.89828 15.4874 8.83731C15.3322 8.77633 15.1664 8.74702 14.9996 8.75111C14.6735 8.7591 14.3633 8.89429 14.1354 9.12781C13.9076 9.36134 13.78 9.6747 13.78 10.001C13.78 10.3273 13.9076 10.6406 14.1354 10.8741C14.3633 11.1077 14.6735 11.2429 14.9996 11.2509ZM16.2491 14.0004C16.2532 13.8336 16.2239 13.6678 16.1629 13.5126C16.102 13.3574 16.0106 13.2159 15.8941 13.0966C15.7776 12.9772 15.6385 12.8824 15.4848 12.8176C15.3311 12.7528 15.166 12.7195 14.9993 12.7195C14.8325 12.7195 14.6674 12.7528 14.5138 12.8176C14.3601 12.8824 14.2209 12.9772 14.1045 13.0966C13.988 13.2159 13.8966 13.3574 13.8356 13.5126C13.7746 13.6678 13.7453 13.8336 13.7494 14.0004V20.2501C13.7453 20.4168 13.7746 20.5827 13.8356 20.7379C13.8966 20.8931 13.988 21.0345 14.1045 21.1539C14.2209 21.2732 14.3601 21.3681 14.5138 21.4329C14.6674 21.4976 14.8325 21.531 14.9993 21.531C15.166 21.531 15.3311 21.4976 15.4848 21.4329C15.6385 21.3681 15.7776 21.2732 15.8941 21.1539C16.0106 21.0345 16.102 20.8931 16.1629 20.7379C16.2239 20.5827 16.2532 20.4168 16.2491 20.2501V14.0004Z"
                fill="#4255A0"
              />
            </g>
          </g>
          <defs>
            <clipPath id="clip0_2781_3786">
              <rect width="30" height="30" fill="white" />
            </clipPath>
          </defs>
        </svg>
        <svg
          v-else-if="disruption.type === 'incident'"
          width="52"
          height="52"
          viewBox="0 0 52 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="52" height="52" rx="8" fill="white" />
          <rect width="52" height="52" rx="8" fill="#FF8C00" />
          <path
            d="M25.0151 35.9614C22.4847 35.7396 20.2376 37.5426 20.0175 40.0705C19.7966 42.5951 21.6964 44.7618 24.2268 44.9829C26.6524 45.1959 28.9073 43.3936 29.1282 40.8675C29.3487 38.341 27.4404 36.1736 25.0151 35.9614Z"
            fill="white"
          />
          <path
            d="M32.4563 7.88414L22.362 7.00002L22.2076 26.4419C22.0183 28.6075 23.3027 30.5392 25.4726 30.7287C27.6288 30.9178 28.958 29.2151 29.1472 27.0501L32.4563 7.88414Z"
            fill="white"
          />
        </svg>
      </template>
    </div>
  </div>
</template>

<style scoped>
img {
  height: 100%;
}

[role="group"] {
  --stopped-color: #ff1400;
  --incident-color: #ff8c00;
  width: fit-content;
  height: var(--size-vw);
  display: flex;
  align-items: center;
  gap: 0.3rem;
  position: relative;
}

.icon {
  height: calc(var(--size-vw) * 0.6);
  width: calc(var(--size-vw) * 0.6);
  position: absolute;
  bottom: 0;
  left: calc(100% - 0.6vw);
}

[blink="true"] {
  animation: blink 1.4s infinite steps(1);
}

@keyframes blink {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

svg {
  height: 100%;
  width: 100%;
}

.small {
  box-sizing: border-box;
  display: block;
  height: 100%;
  width: 100%;
  border-radius: 20%;
  border: 0.2vw solid white;
}

.small.incident {
  background-color: var(--incident-color);
}

.small.stopped {
  background-color: var(--stopped-color);
}
</style>
