import { mount } from '@vue/test-utils'
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Home from '../src/components/Home.vue'

// Mock the InteractiveRoadmapNew component since it likely has complex dependencies
const mockInteractiveRoadmapNew = {
  name: 'InteractiveRoadmapNew',
  template: '<div data-testid="interactive-roadmap">Mock Interactive Roadmap</div>'
}

describe('Home.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Home, {
      global: {
        components: {
          InteractiveRoadmapNew: mockInteractiveRoadmapNew
        }
      }
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
  })

  it('renders without crashing', () => {
    expect(wrapper.exists()).toBe(true)
  })

  it('contains the home container div', () => {
    const homeDiv = wrapper.find('.home')
    expect(homeDiv.exists()).toBe(true)
  })

  it('renders the InteractiveRoadmapNew component', () => {
    // Check that the mock component is rendered
    const mockComponent = wrapper.findComponent(mockInteractiveRoadmapNew)
    expect(mockComponent.exists()).toBe(true)
  })

  it('applies the correct CSS classes for styling', () => {
    const homeDiv = wrapper.find('.home')
    expect(homeDiv.classes()).toContain('home')
  })

  it('has the expected component structure', () => {
    // Verify the template structure
    expect(wrapper.find('.home').exists()).toBe(true)
    expect(wrapper.findComponent(mockInteractiveRoadmapNew).exists()).toBe(true)
  })
})
