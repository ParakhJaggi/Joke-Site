// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from './components/HomePage.vue';
import RandomJokesPage from './components/RandomJokePage.vue';
import RandomJokesbyTypePage from './components/RandomJokebyTypePage.vue';
const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/randomjokes',
    name: 'Random Jokes',
    component: RandomJokesPage
  },
  {
    path: '/randomjokesbytype',
    name: 'Random Jokes By Type',
    component: RandomJokesbyTypePage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
