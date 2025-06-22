<template>
  <n-config-provider :theme-overrides="brainwavTheme">
    <div id="app">
      <router-view />
    </div>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider } from 'naive-ui'
import { brainwavTheme } from './theme/brainwav-theme'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #f8fafc;
  min-height: 100vh;
}

body {
  margin: 0;
  background: #f8fafc;
}
</style>
