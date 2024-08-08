<template>
  <div class="container">
    <router-link to="/" class="back-button">Back to Homepage</router-link>
    <div class="controls">
      <div class="controls-group">
        <fieldset class="field">
          <legend>Number of Jokes:</legend>
          <label>
            <input
              type="radio"
              value="random"
              v-model="jokeCount"
              checked="true"
            />
            1 Joke
          </label>
          <label>
            <input type="radio" value="ten" v-model="jokeCount" />
            10 Jokes
          </label>
        </fieldset>
        <fieldset class="field">
          <legend>Select Joke Type:</legend>
          <select v-model="selectedType">
            <option v-for="type in jokeTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </fieldset>
      </div>
      <fieldset class="field">
        <legend>Sort Jokes By:</legend>
        <select v-model="sortOption">
          <option value="">No Sort</option>
          <option value="setup">Setup</option>
          <option value="punchline">Punchline</option>
        </select>
      </fieldset>
    </div>
    <button @click="fetchData" class="fetch-button">Fetch Jokes</button>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="jokes-list">
      <div v-for="(joke, index) in SortedJokes" :key="index" class="joke-item">
        <p>{{ joke.setup }}</p>
        <p class="punchline">{{ joke.punchline }}</p>
      </div>
      <LoadingSpinner v-if="loading" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner.vue";

export default {
  components: {
    LoadingSpinner,
  },
  data() {
    return {
      jokes: [],
      loading: false,
      error: null,
      jokeCount: "random", // Default to 1 joke
      sortOption: "", // Default to no sorting
      jokeTypes: [], // Available joke types
      selectedType: "", // Default to showing all types
    };
  },
  computed: {
    SortedJokes() {
      let sortedJokes = [...this.jokes];

      if (this.sortOption === "setup") {
        sortedJokes.sort((a, b) => a.setup.localeCompare(b.setup));
      } else if (this.sortOption === "punchline") {
        sortedJokes.sort((a, b) => a.punchline.localeCompare(b.punchline));
      }

      return sortedJokes;
    },
  },
  methods: {
    fetchData() {
      if (this.jokeCount <= 0) {
        this.error = "Please enter a valid number of jokes.";
        return;
      }

      this.loading = true;
      this.error = null;

      const url = `https://official-joke-api.appspot.com/jokes/${this.selectedType}/${this.jokeCount}`;

      axios
        .get(url)
        .then((response) => {
          this.jokes = Array.isArray(response.data)
            ? response.data
            : [response.data];
          this.loading = false;
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          this.error = "Error fetching data. Please try again later.";
          this.loading = false;
        });
    },
    fetchJokeTypes() {
      axios
        .get("https://official-joke-api.appspot.com/types")
        .then((response) => {
          this.jokeTypes = response.data;
        })
        .catch((error) => {
          console.error("Error fetching joke types:", error);
          this.error = "Error fetching joke types. Please try again later.";
        });
    },
  },
  created() {
    this.fetchJokeTypes();
    this.selectedType = "general";
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.back-button {
  position: fixed;
  top: 10px;
  right: 10px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  z-index: 1000;
}

.back-button:hover {
  background-color: #0056b3;
}

.controls {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.controls-group {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.field {
  flex: 1;
}

.field legend {
  font-weight: bold;
  margin-bottom: 10px;
}

.field label {
  display: block;
  margin-bottom: 5px;
}

.field input,
.field select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.fetch-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}

.fetch-button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}

.jokes-list {
  margin-top: 20px;
}

.joke-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.joke-item:last-child {
  border-bottom: none;
}

.punchline {
  font-weight: bold;
}
</style>
