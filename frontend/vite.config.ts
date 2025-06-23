import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/ai-engineering-roadmap/',
  plugins: [
    vue(),
    visualizer({
      open: false, // Automatically open the report in the browser
      filename: '/app/frontend/dist/stats.html', // Absolute path for the report
      gzipSize: true, // Show Gzip size
      brotliSize: true, // Show Brotli size
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
