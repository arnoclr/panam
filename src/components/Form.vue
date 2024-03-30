<template>
  <form action="/" method="get">
    <label>
      <p>Coordonnées GPS de l'arrêt</p>
      <input type="text" name="near" placeholder="48.8534, 2.3122" />
    </label>
    <label>
      <p>Numéro de la ligne</p>
      <input type="text" name="for" placeholder="T3b" />
    </label>
    <br />
    <br />
    <button>Charger</button>
  </form>
</template>

<style scoped>
form {
  padding: 2rem;
}

p {
  margin-bottom: 0.5rem;
}
</style>
