import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ResultsView from '../views/ResultsView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/results',
    name: 'results',
    component: ResultsView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
