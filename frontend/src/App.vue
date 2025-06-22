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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
