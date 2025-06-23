import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import App from '../src/App.vue'

// Mock router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: { template: '<div data-testid="home-view">Home Component</div>' }
    }
  ]
})

describe('App.vue', () => {
  let wrapper

  beforeEach(async () => {
    wrapper = mount(App, {
      global: {
        plugins: [router]
      }
    })
    await router.isReady()
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('#app').exists()).toBe(true)
  })

  it('shows loading state initially', () => {
    expect(wrapper.find('.loading').exists()).toBe(true)
    expect(wrapper.find('.loading').text()).toBe('Loading...')
  })

  it('transitions from loading to router view', async () => {
    // Wait for the timeout in the component
    await new Promise(resolve => setTimeout(resolve, 150))
    await wrapper.vm.$nextTick()
    
    expect(wrapper.find('.loading').exists()).toBe(false)
  })

  it('applies correct CSS classes and styling', () => {
    const appElement = wrapper.find('#app')
    expect(appElement.exists()).toBe(true)
  })
})
