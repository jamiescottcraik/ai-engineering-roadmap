import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.{test,spec}.{js,ts}', 'src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['html', 'text', 'text-summary', 'clover'],
      include: [
        'src/**/*.{js,vue,ts}'
      ],
      exclude: [
        'src/main.ts',
        'src/router/index.ts',
        'src/design/**',
        'src/design-system/**',
        'src/theme/**',
        'src/styles/**',
        '**/*.d.ts',
        '**/node_modules/**'
      ],
      thresholds: {
        branches: 90,
        functions: 90,
        lines: 90,
        statements: 90
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
