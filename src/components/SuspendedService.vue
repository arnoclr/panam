<template>
  <section class="screen">
    <article>
      <h2>Interruption temporaire de circulation</h2>
      <ul>
        <li>Service<br />suspended</li>
        <li>Hier kein<br />Zugverkehr</li>
        <li>Servicio<br />suspendido</li>
        <li>Servizio<br />sospeso</li>
      </ul>
    </article>

    <svg
      width="239"
      height="287"
      viewBox="0 0 239 287"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Group 30">
        <g id="Component 1">
          <path
            id="Vector 22"
            d="M207.5 17C193 0.067627 144.5 0.067627 119 0.067627V282.568H171C211.574 282.568 235.667 258.068 236.5 250.068C242.5 172.068 222.347 34.3372 207.5 17Z"
            fill="#FEC107"
          />
          <path
            id="Vector 23"
            d="M196.709 54.9398C184.962 52.5089 158.669 47.0676 119 47.0676V163.068C163.4 161.868 196.667 152.901 207.5 148.568C207.5 109.768 200.333 72.1667 197 55L196.709 54.9398Z"
            fill="black"
          />
          <circle id="Ellipse 5" cx="190" cy="193.568" r="13" fill="black" />
          <circle id="Ellipse 6" cx="167" cy="209" r="7" fill="black" />
          <rect
            id="Rectangle 24"
            x="119"
            y="278.568"
            width="72"
            height="8"
            fill="#FEC107"
          />
        </g>
        <g id="Component 2">
          <path
            id="Vector 22_2"
            d="M30.8335 17C45.3335 0.067627 93.8335 0.067627 119.333 0.067627V282.568H67.3335C26.7596 282.568 2.66683 258.068 1.8335 250.068C-4.1665 172.068 15.9869 34.3372 30.8335 17Z"
            fill="#FEC107"
          />
          <path
            id="Vector 23_2"
            d="M41.6243 54.9398C53.3711 52.5089 79.6643 47.0676 119.333 47.0676V163.068C74.9335 161.868 41.6668 152.901 30.8335 148.568C30.8335 109.768 38.0002 72.1667 41.3335 55L41.6243 54.9398Z"
            fill="black"
          />
          <circle
            id="Ellipse 5_2"
            cx="13"
            cy="13"
            r="13"
            transform="matrix(-1 0 0 1 61.3335 180.568)"
            fill="black"
          />
          <circle
            id="Ellipse 6_2"
            cx="7"
            cy="7"
            r="7"
            transform="matrix(-1 0 0 1 78.3335 202)"
            fill="black"
          />
          <rect
            id="Rectangle 24_2"
            width="72"
            height="8"
            transform="matrix(-1 0 0 1 119.333 278.568)"
            fill="#FEC107"
          />
        </g>
        <path
          id="second"
          d="M37 81L200 244"
          stroke="#FF1400"
          stroke-width="37"
        />
        <path
          id="first"
          d="M200 81L37 244"
          stroke="#FF1400"
          stroke-width="37"
        />
      </g>
    </svg>
  </section>
</template>

<style scoped>
section.screen {
  margin-left: 4vw;
  height: 100vh;
  max-width: 85vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 10vw;
}

article {
  max-width: 56vw;
}

svg {
  right: 6vw;
  bottom: 0;
  position: absolute;
  height: 30vw;
  width: auto;
}

svg #first {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw1 5s linear infinite;
}

svg #second {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw2 5s linear infinite;
}

@keyframes draw1 {
  92% {
    opacity: 1;
  }
  to {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

@keyframes draw2 {
  30% {
    stroke-dashoffset: 1000;
  }
  92% {
    opacity: 1;
  }
  to {
    stroke-dashoffset: 0;
    opacity: 0;
  }
}

h2,
li {
  color: var(--waiting-time-color);
}

h2 {
  font-size: 5vw;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: space-between;
}

li {
  opacity: 0.9;
  font-style: italic;
  font-size: 2vw;
}
</style>
