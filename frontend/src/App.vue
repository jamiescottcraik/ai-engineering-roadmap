<template>
  <div id="app">
    <!-- Add a simple test to verify Vue is working -->
    <div v-if="!routerReady" class="loading">
      Loading...
    </div>
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const routerReady = ref(false)

onMounted(() => {
  // Give the router a moment to initialize
  setTimeout(() => {
    routerReady.value = true
  }, 100)
})
</script>

<style>
@import './styles/design-system.css';

#app {
  font-family: var(--font-family-sans);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--color-gray-800);
  background-color: var(--color-gray-50);
  min-height: 100vh;
}

.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: var(--font-size-lg);
  color: var(--color-gray-600);
}
</style>
