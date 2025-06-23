<!-- InteractiveRoadmap.vue - Updated with Design System -->
<template>
  <div class="roadmap-container ds-container">
    <!-- Hero Section -->
    <div v-if="roadmapData" class="roadmap-hero">
      <div class="hero-content">
        <div class="brand-logo">
          <img src="/brAInwav.png" alt="brAInwav Logo" class="logo-image" />
        </div>
        
        <h1>{{ roadmapData.metadata.title }}</h1>
        <p class="hero-tagline">
          🎯 <strong>Your step-by-step journey to AI engineering leadership mastery</strong> — 
          from Python foundations to production AI systems, with real deliverables and industry recognition.
        </p>
        <p class="description">{{ roadmapData.metadata.description }}</p>
        
        <div class="cta-buttons ds-flex ds-flex--center">
          <n-button 
            @click="scrollToRoadmap" 
            type="primary" 
            size="large"
            round
          >
            <template #icon>
              <n-icon :component="Rocket" />
            </template>
            Start Your Journey
          </n-button>
          <n-button 
            @click="showFeedbackModal = true" 
            type="info"
            size="large"
            round
            ghost
          >
            💬 Suggest Improvements
          </n-button>
        </div>
        
        <!-- Progress Dashboard -->
        <div class="progress-dashboard">
          <n-grid :cols="4" :x-gap="20" responsive="screen">
            <n-grid-item :span="4">
              <n-card title="Overall Progress" embedded>
                <n-progress 
                  type="line" 
                  :percentage="userOverallProgress" 
                  :show-indicator="true"
                  processing
                />
                <n-space justify="space-between" style="margin-top: 12px;">
                  <n-statistic label="Completed" :value="userCompletedNodes" suffix=" nodes" />
                  <n-statistic label="Total Hours" :value="totalHours" suffix="h" />
                  <n-statistic label="Current Phase" :value="currentPhase" suffix="" />
                </n-space>
              </n-card>
            </n-grid-item>
          </n-grid>
        </div>
        
        <!-- Timeline Status Overview -->
        <div class="timeline-status">
          <n-card title="Learning Track Status" embedded>
            <div class="phases-timeline">
              <div 
                v-for="(phase, index) in roadmapData.phases" 
                :key="phase.id"
                class="timeline-phase"
                :class="{
                  'in_progress': phase.status === 'in_progress',
                  'completed': phase.status === 'completed'
                }"
              >
                <div class="phase-step">
                  <div class="step-icon">
                    <span v-if="phase.status === 'completed'">✅</span>
                    <span v-else-if="phase.status === 'in_progress'">⚙️</span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div class="step-content">
                    <h4>{{ phase.title }}</h4>
                    <p>{{ phase.subtitle || `Week ${index * 8 + 1}-${(index + 1) * 8}` }}</p>
                  </div>
                </div>
                <div v-if="index < roadmapData.phases.length - 1" class="phase-connector"></div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="loadingError" class="error-state">
      <n-card title="Error Loading Roadmap" embedded>
        <n-space vertical align="center" style="padding: 60px 20px;">
          <n-alert type="error" :title="loadingError" />
          <n-button type="primary" @click="loadRoadmapData()">Retry</n-button>
        </n-space>
      </n-card>
    </div>
    <!-- Loading State -->
    <div v-else class="loading-state">
      <n-card title="Loading AI Engineering Roadmap..." embedded>
        <n-space vertical align="center" style="padding: 60px 20px;">
          <n-spin size="large" />
          <n-gradient-text type="info">
            Preparing your personalized learning journey...
          </n-gradient-text>
        </n-space>
      </n-card>
    </div>

    <!-- Search and Filter Section -->
    <div v-if="roadmapData" class="search-filter-section">
      <n-card title="🔍 Find Your Path" embedded>
        <n-space vertical>
          <n-input
            v-model:value="searchQuery"
            type="text"
            placeholder="Search courses, topics, skills..."
            clearable
            size="large"
          >
            <template #prefix>
              <n-icon>🔍</n-icon>
            </template>
          </n-input>
          
          <n-space>
            <n-tag
              v-for="filter in availableFilters"
              :key="filter.value"
              :type="selectedFilters.includes(filter.value) ? filter.color : 'default'"
              :bordered="!selectedFilters.includes(filter.value)"
              clickable
              @click="toggleFilter(filter.value)"
              style="cursor: pointer;"
            >
              {{ filter.label }}
            </n-tag>
            
            <n-button
              v-if="searchQuery || selectedFilters.length > 0"
              @click="clearFilters"
              type="tertiary"
              size="small"
            >
              Clear All
            </n-button>
          </n-space>
          
          <n-alert 
            v-if="searchQuery || selectedFilters.length > 0"
            type="info"
            :show-icon="false"
          >
            Found {{ filteredNodes.length }} learning resources
            {{ searchQuery ? `matching "${searchQuery}"` : '' }}
            {{ selectedFilters.length > 0 ? `in categories: ${selectedFilters.join(', ')}` : '' }}
          </n-alert>
        </n-space>
      </n-card>
    </div>

    <!-- Vertical Roadmap -->
    <div v-if="roadmapData" class="roadmap-vertical" id="roadmap-main">
      <div class="roadmap-track">
        <div 
          v-for="(phase, phaseIndex) in roadmapData.phases" 
          :key="phase.id"
          class="roadmap-phase"
        >
          <!-- Phase Section Header -->
          <div class="phase-section-header">
            <div class="phase-connector" v-if="phaseIndex > 0"></div>
            <div class="phase-title-bar">
              <span class="phase-icon">{{ phase.icon || '📋' }}</span>
              <div class="phase-info">
                <h2>{{ phase.title }}</h2>
                <p class="phase-subtitle">{{ phase.subtitle || '' }} • {{ phase.estimatedWeeks || 0 }} weeks</p>
              </div>
              <div class="phase-status" :class="phase.status">
                {{ phase.status === 'completed' ? '✅' : phase.status === 'in_progress' ? '⚙️' : '⏳' }}
              </div>
            </div>
          </div>

          <!-- Roadmap Nodes using NodeCard component -->
          <div class="roadmap-nodes-flow ds-grid ds-grid--2">
            <NodeCard
              v-for="node in phase.nodes"
              :key="node.id"
              :node="node"
              :progress="getNodeProgress(node, phase)"
              :is-completed="isNodeCompleted(node.id)"
              variant="timeline"
              @click="selectNode"
              @view-details="selectNode"
              @toggle-completion="markNodeCompleted"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Node Detail Modal -->
    <n-modal 
      v-model:show="showNodeModal" 
      preset="card" 
      :title="selectedNode?.title || 'Node Details'"
      class="node-modal"
      :style="{ maxWidth: '800px' }"
      size="large"
      closable
      :mask-closable="true"
      @update:show="handleModalClose"
    >
      <div v-if="selectedNode" class="modal-body">
        <n-space vertical size="medium">
          <n-card title="Node Information" size="small" embedded>
            <n-space size="medium">
              <n-statistic label="Type">
                <template #default>
                  <n-tag :type="getNodeTypeColor(selectedNode.type)" size="medium">
                    {{ getNodeIcon(selectedNode.type) }} {{ selectedNode.type.toUpperCase() }}
                  </n-tag>
                </template>
              </n-statistic>
              
              <n-statistic label="Progress" :value="selectedNodeProgress" suffix="%">
                <template #prefix>
                  <n-icon :component="CheckmarkCircle" v-if="selectedNodeProgress === 100" style="color: #18a058;" />
                  <n-icon :component="Time" v-else style="color: #2080f0;" />
                </template>
              </n-statistic>
              
              <n-statistic label="Estimated Time" :value="selectedNode.estimatedHours || 0" suffix=" hours">
                <template #prefix>
                  <n-icon :component="Time" style="color: #f0a020;" />
                </template>
              </n-statistic>
            </n-space>
          </n-card>
          
          <n-card title="Description" size="small" embedded v-if="selectedNode.description">
            <p>{{ selectedNode.description }}</p>
          </n-card>

          <!-- Resources using ResourceCard component -->
          <div v-if="selectedNode.resources && selectedNode.resources.length > 0" class="resources-section">
            <n-card title="📚 Learning Resources" size="small" embedded>
              <template #header-extra>
                <n-tag type="info" round>
                  {{ selectedNode.resources.length }} resource{{ selectedNode.resources.length > 1 ? 's' : '' }}
                </n-tag>
              </template>
              
              <n-scrollbar style="max-height: 400px;">
                <div class="ds-space-y-2">
                  <ResourceCard
                    v-for="resource in selectedNode.resources"
                    :key="resource.title"
                    :resource="resource"
                    variant="compact"
                    @open="openResource"
                  />
                </div>
              </n-scrollbar>
              
              <div class="resources-note" style="margin-top: 16px;">
                <n-alert type="info" :show-icon="false">
                  💡 <strong>Start with these resources</strong> to build the knowledge needed for this milestone
                </n-alert>
              </div>
            </n-card>
          </div>

          <!-- Deliverables -->
          <n-card 
            v-if="selectedNode.deliverables && selectedNode.deliverables.length > 0" 
            title="🏆 Deliverables" 
            size="small" 
            embedded
          >
            <n-space vertical size="small">
              <n-tag 
                v-for="deliverable in selectedNode.deliverables" 
                :key="deliverable"
                type="success"
                size="medium"
              >
                {{ deliverable }}
              </n-tag>
            </n-space>
          </n-card>
        </n-space>
      </div>
    </n-modal>

    <!-- Feedback Modal -->
    <n-modal 
      v-model:show="showFeedbackModal" 
      preset="card" 
      title="💬 Help Us Improve" 
      class="feedback-modal"
      :style="{ maxWidth: '600px' }"
    >
      <n-space vertical size="large">
        <n-alert type="info">
          Your feedback helps us create better learning experiences for everyone in the AI engineering community.
        </n-alert>
        
        <div class="feedback-options ds-space-y-4">
          <div class="feedback-option ds-card" style="padding: 16px; cursor: pointer;">
            <span class="feedback-icon">📝</span>
            <div>
              <h4>Content Feedback</h4>
              <p>Suggest improvements to learning resources, content quality, or missing topics</p>
            </div>
          </div>
          
          <div class="feedback-option ds-card" style="padding: 16px; cursor: pointer;">
            <span class="feedback-icon">🎨</span>
            <div>
              <h4>User Experience</h4>
              <p>Report UI/UX issues, accessibility concerns, or usability improvements</p>
            </div>
          </div>
          
          <div class="feedback-option ds-card" style="padding: 16px; cursor: pointer;">
            <span class="feedback-icon">🚀</span>
            <div>
              <h4>Feature Requests</h4>
              <p>Suggest new features, integrations, or functionality enhancements</p>
            </div>
          </div>
        </div>
      </n-space>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { loadRoadmapData as fetchRoadmapData } from '../services/roadmapService'
import { 
  NCard, NButton, NProgress, NStatistic, NTag, NIcon, NModal, NSpace, 
  NGradientText, NSpin, NInput, NAlert, NGrid, NGridItem, NScrollbar
} from 'naive-ui'
import { Rocket, CheckmarkCircle, Time } from '@vicons/ionicons5'
import NodeCard from './NodeCard.vue'
import ResourceCard from './ResourceCard.vue'
import { components } from '../design/tokens'

interface RoadmapResource {
  title: string
  type: string
  url: string
  description?: string
  rationale?: string
}
interface RoadmapNode {
  id: string
  title: string
  description?: string
  type: 'learn' | 'practice' | 'portfolio' | 'keyresource'
  estimatedHours?: number
  isOptional?: boolean
  checkpoint?: boolean
  resources?: RoadmapResource[]
  deliverables?: string[]
}

interface RoadmapPhase {
  id: string
  title: string
  subtitle?: string
  description?: string
  status: 'not_started' | 'in_progress' | 'completed'
  estimatedWeeks?: number
  icon?: string
  nodes: RoadmapNode[]
}

interface RoadmapData {
  metadata: {
    title: string
    description: string
    startDate: string
    totalWeeks: number
    totalHours: number
  }
  phases: RoadmapPhase[]
}

// Reactive state
const roadmapData = ref<RoadmapData | null>(null)
const isLoading = ref(false)
const loadingError = ref<string | null>(null)
const selectedNode = ref<RoadmapNode | null>(null)
const showNodeModal = computed(() => selectedNode.value !== null)
const showFeedbackModal = ref(false)
const expandedPhases = ref<string[]>(['phase1'])
const searchQuery = ref('')
const selectedFilters = ref<string[]>([])

// Filter options
const availableFilters = [
  { label: '📚 Learn', value: 'learn', color: 'info' as const },
  { label: '💻 Practice', value: 'practice', color: 'warning' as const },
  { label: '🎯 Portfolio', value: 'portfolio', color: 'success' as const },
  { label: '⭐ Key Resource', value: 'keyresource', color: 'primary' as const },
  { label: '🎓 Course', value: 'course', color: 'primary' as const },
  { label: '📖 Tutorial', value: 'tutorial', color: 'info' as const },
  { label: '🔧 Tool', value: 'tool', color: 'success' as const }
]

// Computed properties
const currentPhase = computed(() => {
  if (!roadmapData.value) return 1
  const inProgressPhase = roadmapData.value.phases.find((phase: RoadmapPhase) => phase.status === 'in_progress')
  return inProgressPhase ? roadmapData.value.phases.indexOf(inProgressPhase) + 1 : 1
})

const totalHours = computed(() => {
  if (!roadmapData.value) return 0
  return roadmapData.value.phases.reduce((sum: number, phase: RoadmapPhase) => 
    sum + phase.nodes.reduce((nodeSum: number, node: RoadmapNode) => nodeSum + (node.estimatedHours || 0), 0), 0)
})

const selectedNodeProgress = computed(() => {
  if (!selectedNode.value || !roadmapData.value) return 0
  
  const phase = roadmapData.value.phases.find((p: RoadmapPhase) => 
    p.nodes.some((n: RoadmapNode) => n.id === selectedNode.value?.id)
  )
  
  if (!phase) return 0
  return getNodeProgress(selectedNode.value, phase)
})

// Local Storage Progress Persistence
const STORAGE_KEY = 'ai-roadmap-progress'
const userProgress = ref<{
  expandedPhases: string[]
  nodeProgress: Record<string, { completed: boolean, timeSpent: number, notes: string }>
  lastUpdated: string
}>({
  expandedPhases: ['phase1'],
  nodeProgress: {},
  lastUpdated: new Date().toISOString()
})

const saveProgress = () => {
  try {
    const progressData = {
      expandedPhases: expandedPhases.value,
      nodeProgress: userProgress.value.nodeProgress,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData))
  } catch (error) {
    console.error('Failed to save progress:', error)
  }
}

const loadProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const data = JSON.parse(saved)
      expandedPhases.value = data.expandedPhases || ['phase1']
      userProgress.value.nodeProgress = data.nodeProgress || {}
      userProgress.value.lastUpdated = data.lastUpdated || new Date().toISOString()
    }
  } catch (error) {
    console.error('Failed to load progress:', error)
  }
}

const markNodeCompleted = (nodeId: string) => {
  if (!userProgress.value.nodeProgress[nodeId]) {
    userProgress.value.nodeProgress[nodeId] = { completed: false, timeSpent: 0, notes: '' }
  }
  userProgress.value.nodeProgress[nodeId].completed = !userProgress.value.nodeProgress[nodeId].completed
  saveProgress()
}

const isNodeCompleted = (nodeId: string): boolean => {
  return userProgress.value.nodeProgress[nodeId]?.completed || false
}

// Enhanced progress calculations
const userCompletedNodes = computed(() => {
  return Object.values(userProgress.value.nodeProgress).filter(p => p.completed).length
})

const userOverallProgress = computed(() => {
  if (!roadmapData.value) return 0
  
  const totalNodes = roadmapData.value.phases.reduce((sum, phase) => sum + phase.nodes.length, 0)
  const completedNodes = userCompletedNodes.value
  
  return totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0
})

// Search and Filter
const filteredNodes = computed(() => {
  if (!roadmapData.value) return []
  
  return roadmapData.value.phases.flatMap(phase => 
    phase.nodes.filter(node => {
      const matchesSearch = searchQuery.value === '' || 
        node.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (node.description && node.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
      
      const matchesFilter = selectedFilters.value.length === 0 || 
        selectedFilters.value.includes(node.type) ||
        (node.resources?.some(resource => selectedFilters.value.includes(resource.type)) ?? false)
      
      return matchesSearch && matchesFilter
    }).map(node => ({ ...node, phaseId: phase.id, phaseTitle: phase.title }))
  )
})

// Methods
const getNodeProgress = (node: RoadmapNode, phase: RoadmapPhase): number => {
  if (!roadmapData.value) return 0
  
  if (isNodeCompleted(node.id)) return 100
  
  const startDate = new Date(roadmapData.value.metadata.startDate)
  const currentDate = new Date()
  const daysElapsed = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  
  const phaseIndex = roadmapData.value.phases.findIndex((p: RoadmapPhase) => p.id === phase.id)
  const nodeIndex = phase.nodes.findIndex((n: RoadmapNode) => n.id === node.id)
  
  const weeksPerPhase = 8
  const nodesPerPhase = phase.nodes.length
  const weeksPerNode = weeksPerPhase / nodesPerPhase
  
  const nodeStartWeek = (phaseIndex * weeksPerPhase) + (nodeIndex * weeksPerNode)
  const nodeStartDay = nodeStartWeek * 7
  
  if (daysElapsed < nodeStartDay) return 0
  
  const daysIntoNode = daysElapsed - nodeStartDay
  const nodeDurationDays = weeksPerNode * 7
  
  return Math.min(100, Math.round((daysIntoNode / nodeDurationDays) * 100))
}

const selectNode = (node: RoadmapNode) => {
  selectedNode.value = node
}

const handleModalClose = (show: boolean) => {
  if (!show) selectedNode.value = null
}

const scrollToRoadmap = () => {
  const element = document.getElementById('roadmap-main')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const getNodeTypeColor = (type: string) => {
  const typeMap: Record<string, any> = {
    'learn': 'info',
    'practice': 'warning', 
    'portfolio': 'success',
    'keyresource': 'primary'
  }
  return typeMap[type] || 'default'
}

const getNodeIcon = (type: string): string => {
  const nodeType = type as keyof typeof components.nodeTypes
  return components.nodeTypes[nodeType]?.icon || '📋'
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedFilters.value = []
}

const toggleFilter = (filterValue: string) => {
  const index = selectedFilters.value.indexOf(filterValue)
  if (index > -1) {
    selectedFilters.value.splice(index, 1)
  } else {
    selectedFilters.value.push(filterValue)
  }
}

const openResource = (resource: any) => {
  console.log("openResource called with:", resource);
  if (resource.url && resource.url !== '#') {
    window.open(resource.url, '_blank', 'noopener,noreferrer')
  }
}

const loadRoadmapData = async (retries = 3) => {
  isLoading.value = true
  loadingError.value = null
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const data = await fetchRoadmapData()
      roadmapData.value = data
      isLoading.value = false
      return
    } catch (error) {
      loadingError.value = 'Failed to load roadmap data. Retrying...'
    }
  }
  isLoading.value = false
  loadingError.value = 'Unable to load roadmap data. Please try again later.'
}

onMounted(() => {
  loadRoadmapData()
  loadProgress()
})
</script>

<style scoped>
.roadmap-container {
  padding-bottom: var(--spacing-16);
}

.roadmap-hero {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #fff;
  padding: var(--spacing-10) var(--spacing-5);
  border-radius: var(--border-radius-xl);
  margin-bottom: var(--spacing-10);
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.brand-logo {
  margin-bottom: var(--spacing-5);
}

.logo-image {
  max-width: 150px;
  height: auto;
}

h1 {
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-bold);
  margin: 0 0 var(--spacing-4) 0;
  line-height: var(--line-height-tight);
}

.hero-tagline {
  font-size: var(--font-size-lg);
  margin: 0 0 var(--spacing-4) 0;
  line-height: var(--line-height-normal);
}

.description {
  font-size: var(--font-size-base);
  margin: 0 0 var(--spacing-6) 0;
  opacity: 0.9;
}

.cta-buttons {
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.progress-dashboard {
  margin-bottom: var(--spacing-8);
}

.timeline-status {
  margin-bottom: var(--spacing-8);
}

.phases-timeline {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-4);
  flex-wrap: wrap;
}

.timeline-phase {
  display: flex;
  align-items: center;
  opacity: 0.6;
  transition: opacity var(--transition-normal);
}

.timeline-phase.in_progress,
.timeline-phase.completed {
  opacity: 1;
}

.phase-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-gray-200);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-600);
}

.timeline-phase.completed .step-icon {
  background: var(--color-success-500);
  color: white;
}

.timeline-phase.in_progress .step-icon {
  background: var(--color-warning-500);
  color: white;
}

.step-content h4 {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-gray-800);
}

.step-content p {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-gray-600);
}

.phase-connector {
  width: 40px;
  height: 2px;
  background: var(--color-gray-300);
  margin: 0 var(--spacing-2);
}

.search-filter-section {
  margin-bottom: var(--spacing-8);
}

.roadmap-vertical {
  margin-bottom: var(--spacing-8);
}

.roadmap-phase {
  margin-bottom: var(--spacing-12);
}

.phase-section-header {
  position: relative;
  margin-bottom: var(--spacing-6);
}

.phase-title-bar {
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  padding: var(--spacing-4) var(--spacing-6);
  background: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  border-left: 4px solid var(--color-primary-500);
}

.phase-icon {
  font-size: var(--font-size-2xl);
}

.phase-info h2 {
  margin: 0;
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-gray-800);
}

.phase-subtitle {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

.phase-status {
  margin-left: auto;
  font-size: var(--font-size-lg);
}

.roadmap-nodes-flow {
  margin-top: var(--spacing-6);
}

.loading-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-state {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.resources-section {
  margin-top: var(--spacing-4);
}

.feedback-options .feedback-option {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  transition: all var(--transition-fast);
}

.feedback-options .feedback-option:hover {
  transform: translateY(-2px);
}

.feedback-icon {
  font-size: var(--font-size-2xl);
  flex-shrink: 0;
}

.feedback-option h4 {
  margin: 0 0 var(--spacing-1) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.feedback-option p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-gray-600);
}

/* Responsive Design */
@media (max-width: 768px) {
  .roadmap-hero {
    padding: var(--spacing-6) var(--spacing-4);
  }
  
  h1 {
    font-size: var(--font-size-3xl);
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: stretch;
  }
  
  .phases-timeline {
    flex-direction: column;
    gap: var(--spacing-3);
  }
  
  .phase-connector {
    display: none;
  }
  
  .phase-title-bar {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-2);
  }
}
</style>
