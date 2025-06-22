import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import naive from 'naive-ui'
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
app.use(naive)

// Add some debugging
console.log('Vue app starting...')

try {
  app.mount('#app')
  console.log('Vue app mounted!')
} catch (error) {
  console.error('Failed to mount Vue app:', error)
}
