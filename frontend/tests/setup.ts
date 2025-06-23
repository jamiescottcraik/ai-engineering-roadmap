// Global test setup for Vitest
import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Configure Vue Test Utils
config.global.config.globalProperties = {
  // Add any global properties your components expect
}

// Mock CSS imports
Object.defineProperty(window, 'CSS', {
  value: {
    supports: () => false
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
})

// Mock router for components that might need it
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn()
}

config.global.mocks = {
  $router: mockRouter,
  $route: {
    params: {},
    query: {},
    path: '/',
    name: 'Home'
  }
}
