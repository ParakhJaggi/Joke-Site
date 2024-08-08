<template>
  <div class="container">
    <router-link to="/" class="back-button">Back to Homepage</router-link>
    <div class="controls">
      <div class="field">
        <label for="jokeCount">Number of Jokes:</label>
        <input
          id="jokeCount"
          type="number"
          v-model.number="jokeCount"
          min="1"
          max="451"
          placeholder="Enter number of jokes"
        />
      </div>
      <div class="filter-sort">
        <div class="field">
          <label for="sortOption">Alphabetical Sort By:</label>
          <select id="sortOption" v-model="sortOption">
            <option value="">No Sort</option>
            <option value="setup">Setup</option>
            <option value="punchline">Punchline</option>
          </select>
        </div>
        <div class="field">
          <label for="jokeType">Filter Joke Type:</label>
          <select id="jokeType" v-model="selectedType">
            <option value="">All Types</option>
            <option v-for="type in jokeTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
      </div>
    </div>
    <button @click="fetchData" class="fetch-button">Fetch Jokes</button>
    <p v-if="error" class="error">{{ error }}</p>
    <div class="jokes-list">
        <div v-for="(joke, index) in filteredAndSortedJokes" :key="index" class="joke-item">
          <p>{{ joke.setup }}</p>
          <p class="punchline">{{ joke.punchline }}</p>
        </div>
        <LoadingSpinner v-if="loading" />
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner.vue';
export default {
  components: {
    LoadingSpinner
  },
  data() {
    return {
      jokes: [],
      loading: false,
      error: null,
      jokeCount: 1,
      sortOption: '',
      jokeTypes: [],
      selectedType: ''
    };
  },
  computed: {
    filteredAndSortedJokes() {
      let filteredJokes = this.jokes;
      if (this.selectedType) {
        filteredJokes = filteredJokes.filter(joke => joke.type === this.selectedType);
      }

      if (this.sortOption === 'setup') {
        return filteredJokes.slice().sort((a, b) => a.setup.localeCompare(b.setup));
      } else if (this.sortOption === 'punchline') {
        return filteredJokes.slice().sort((a, b) => a.punchline.localeCompare(b.punchline));
      }
      return filteredJokes;
    }
  },
  methods: {
    fetchData() {
      if (this.jokeCount <= 0) {
        this.error = 'Please enter a valid number of jokes.';
        return;
      }
      if(this.jokeCount > 451){
        this.error = "Maximum number of jokes is 451";
        return;
      }

      this.loading = true;
      this.error = null;

      const url = `https://official-joke-api.appspot.com/jokes/random/${this.jokeCount}`;

      axios.get(url)
        .then(response => {
          if (Array.isArray(response.data)) {
            this.jokes = response.data;
          } else {
            this.jokes = [response.data];
          }
          this.loading = false;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          this.error = 'Error fetching data. Please try again later.';
          this.loading = false;
        });
    },
    fetchJokeTypes() {
      axios.get('https://official-joke-api.appspot.com/types')
        .then(response => {
          this.jokeTypes = response.data;
        })
        .catch(error => {
          console.error('Error fetching joke types:', error);
          this.error = 'Error fetching joke types. Please try again later.';
        });
    }
  },
  created() {
    this.fetchJokeTypes();
  }
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
