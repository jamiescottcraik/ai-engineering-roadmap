import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
// import Home from './components/Home.vue' // No longer directly imported

// Create router
const router = createRouter({
  history: createWebHistory('/ai-engineering-roadmap/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      // component: Home // Original component import
      component: () => import('./components/Home.vue') // Lazy load Home component
    }
  ]
})

// Create and mount app
const app = createApp(App)
app.use(router)

// Add some debugging
console.log('Vue app starting...')

try {
  app.mount('#app')
  console.log('Vue app mounted!')
} catch (error) {
  console.error('Failed to mount Vue app:', error)
}
