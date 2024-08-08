<!-- src/components/HomePage.vue -->
<template>
    <div>
      <h1>Qu Joke API Challenge</h1>
      <h2>by Parakh Jaggi</h2>
      <router-link to="/randomjokes">Get random jokes</router-link>
      <br/>
      <router-link to="/randomjokesbytype">Get random jokes by type</router-link>

    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage'
  };
  </script>
  