export interface RoadmapNode {
  id: string
  title: string
  type: 'learn' | 'practice' | 'portfolio' | 'keyresource'
  progress: number
  isActive: boolean
  isUnlocked: boolean
  position?: { x: number; y: number }
  estimatedHours?: number
  description?: string
  resources?: Array<{ title: string; url: string; type: string }>
  deliverables?: string[]
  completionCriteria?: string[]
  checkpoint?: boolean
  isOptional?: boolean
  prerequisiteIds?: string[]
}

export interface RoadmapPhase {
  id: string
  title: string
  subtitle?: string
  icon?: string
  status: 'not_started' | 'in_progress' | 'completed'
  progress: number
  estimatedWeeks?: number
  description?: string
  nodes: RoadmapNode[]
  x?: number
  y?: number
  width?: number
  height?: number
  color: string
}

export interface RoadmapData {
  metadata: {
    title: string
    description: string
    startDate: string
    estimatedDuration: string
    lastUpdated: string
  }
  phases: RoadmapPhase[]
  milestones?: Array<{
    id: string
    title: string
    description: string
    phaseId: string
    targetDate: string
  }>
}

export async function loadRoadmapData(): Promise<any> {
  try {
    // First try to load from GitHub API (for real-time data)
    const response = await fetch('/data/roadmap.json')
    return await response.json()
  } catch (error) {
    // Fallback to static data
    return getStaticRoadmapData()
  }
}

export async function updateProgress(nodeId: string, progress: number): Promise<void> {
  // Update progress via GitHub API or local storage
  const data = await loadRoadmapData()
  
  // Find and update the node
  for (const phase of data.phases) {
    const node = phase.nodes.find(n => n.id === nodeId)
    if (node) {
      node.progress = progress
      if (progress === 100) {
        node.isActive = false
        // Unlock next nodes
        unlockNextNodes(data, nodeId)
      }
      break
    }
  }
  
  // Save updated data
  localStorage.setItem('roadmap-progress', JSON.stringify(data))
}

function getStaticRoadmapData() {
  return {
    metadata: {
      title: "AI Leadership Engineering Roadmap",
      lastUpdated: new Date().toISOString(),
      version: "2.1"
    },
    phases: [
      {
        id: "phase-1",
        title: "Advanced Technical Foundations",
        status: "in_progress",
        progress: 25,
        x: 50,
        y: 100,
        width: 1000,
        height: 200,
        color: "#1f4e79",
        nodes: [
          {
            id: "learn-python-math",
            title: "Advanced Python & Math",
            type: "learn",
            progress: 25,
            isActive: true,
            isUnlocked: true,
            position: { x: 100, y: 150 },
            resources: [
              {
                title: "DataCamp: Associate Python Developer",
                url: "https://www.datacamp.com/tracks/associate-python-developer",
                type: "course"
              },
              {
                title: "Coursera: Mathematics for ML",
                url: "https://www.coursera.org/specializations/mathematics-machine-learning",
                type: "course"
              }
            ],
            completionCriteria: [
              "Complete DataCamp track",
              "Finish Math for ML specialization",
              "Solve 20 LeetCode problems"
            ]
          },
          {
            id: "build-github-stats",
            title: "GitHub Profile Stats Generator",
            type: "practice",
            progress: 0,
            isActive: false,
            isUnlocked: true,
            position: { x: 350, y: 150 },
            resources: [
              {
                title: "GitHub API Documentation",
                url: "https://docs.github.com/en/rest",
                type: "documentation"
              }
            ],
            deliverables: [
              "Python script using GitHub API",
              "SVG generation functionality",
              "CI/CD pipeline setup"
            ]
          }
        ]
      }
    ]
  }
}

function unlockNextNodes(data: any, completedNodeId: string): void {
  // Logic to unlock subsequent nodes based on dependencies
  // This would implement your roadmap's prerequisite system
}