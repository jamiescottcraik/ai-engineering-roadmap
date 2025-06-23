import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { loadRoadmapData, updateProgress } from '../src/services/roadmapService.ts'

// Mock fetch globally
global.fetch = vi.fn()

describe('roadmapService', () => {
  beforeEach(() => {
    fetch.mockClear()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('loadRoadmapData', () => {
    it('successfully loads data from API', async () => {
      const mockData = {
        metadata: {
          title: 'Test Roadmap',
          lastUpdated: '2024-01-01',
          version: '1.0.0'
        },
        phases: []
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData)
      })

      const result = await loadRoadmapData()
      
      expect(fetch).toHaveBeenCalledWith('./data/roadmap.json')
      expect(result).toEqual(mockData)
    })

    it('falls back to static data when API fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await loadRoadmapData()
      
      expect(fetch).toHaveBeenCalledWith('./data/roadmap.json')
      // Result should be from getStaticRoadmapData()
      expect(result).toBeDefined()
      expect(result.metadata).toBeDefined()
      expect(result.metadata.title).toBe('AI Leadership Engineering Roadmap')
      expect(result.phases).toBeDefined()
      expect(Array.isArray(result.phases)).toBe(true)
    })

    it('returns valid roadmap data structure when falling back', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await loadRoadmapData()
      
      // Verify the structure of the static fallback data
      expect(result.metadata.title).toBeDefined()
      expect(result.metadata.version).toBeDefined()
      expect(result.metadata.lastUpdated).toBeDefined()
      expect(Array.isArray(result.phases)).toBe(true)
      
      if (result.phases.length > 0) {
        const firstPhase = result.phases[0]
        expect(firstPhase.id).toBeDefined()
        expect(firstPhase.title).toBeDefined()
        expect(firstPhase.nodes).toBeDefined()
        expect(Array.isArray(firstPhase.nodes)).toBe(true)
      }
    })
  })

  describe('updateProgress', () => {
    it('updates progress for a valid node', async () => {
      const mockData = {
        metadata: { title: 'Test', lastUpdated: '2024-01-01', version: '1.0.0' },
        phases: [{
          id: 'phase1',
          nodes: [{ id: 'node1', progress: 0 }]
        }]
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData)
      })

      await expect(updateProgress('node1', 50)).resolves.toBeUndefined()
      expect(fetch).toHaveBeenCalled()
    })

    it('handles invalid node ID gracefully', async () => {
      const mockData = {
        metadata: { title: 'Test', lastUpdated: '2024-01-01', version: '1.0.0' },
        phases: []
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce(mockData)
      })

      await expect(updateProgress('invalid-node', 50)).resolves.toBeUndefined()
    })
  })
})
