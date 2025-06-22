import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'

// Create router
const router = createRouter({
  history: createWebHistory('/ai-engineering-roadmap/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    }
  ]
})

// Create and mount app
const app = createApp(App)
app.use(router)
app.mount('#app')
