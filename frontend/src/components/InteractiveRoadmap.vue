<template>
  <div class="roadmap-container">
    <!-- Hero Section with Context -->
    <div v-if="roadmapData" class="roadmap-hero">
      <div class="hero-content">
        <h1>{{ roadmapData.metadata.title }}</h1>
        <p class="hero-tagline">
          🎯 <strong>Your step-by-step journey to AI engineering leadership mastery</strong> — 
          from Python foundations to production AI systems, with real deliverables and industry recognition.
        </p>
        <p class="description">{{ roadmapData.metadata.description }}</p>
        
        <!-- Call-to-Action Buttons -->
        <div class="cta-buttons">
          <button @click="scrollToRoadmap" class="btn-primary">
            🚀 Start Your Journey
          </button>
          <button @click="showFeedbackModal = true" class="btn-secondary">
            💬 Suggest Improvements
          </button>
        </div>
        
        <!-- Progress Dashboard -->
        <div class="progress-dashboard">
          <div class="progress-item">
            <div class="progress-label">Overall Progress</div>
            <div class="progress-value">{{ overallProgress }}%</div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
            </div>
          </div>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">{{ completedDeliverables }}</div>
              <div class="stat-label">Deliverables Done</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ currentPhase }}</div>
              <div class="stat-label">Current Phase</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ totalHours }}</div>
              <div class="stat-label">Total Hours</div>
            </div>
          </div>
        </div>
        
        <!-- Timeline Status -->
        <div class="timeline-status">
          <div class="timeline-item" :class="{ active: timelineStatus === 'now' }">
            <span class="timeline-dot"></span>
            <span>Now: {{ currentPhaseTitle }}</span>
          </div>
          <div class="timeline-item" :class="{ active: timelineStatus === 'next' }">
            <span class="timeline-dot"></span>
            <span>Next: {{ nextPhaseTitle }}</span>
          </div>
          <div class="timeline-item">
            <span class="timeline-dot"></span>
            <span>Goal: AI Leadership by {{ formatDate(roadmapData.metadata.startDate, 12) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading-state">
      <h1>Loading AI Engineering Roadmap...</h1>
      <div class="loading-spinner"></div>
    </div>

    <!-- Phase Cards -->
    <div v-if="roadmapData" class="phases-container">
      <div 
        v-for="(phase, index) in roadmapData.phases" 
        :key="phase.id"
        class="phase-card"
        :class="{ 
          'active': phase.status === 'in_progress',
          'completed': phase.status === 'completed',
          'locked': phase.status === 'not_started' && index > 0 && roadmapData.phases[index - 1].status !== 'completed'
        }"
      >
        <!-- Phase Header -->
        <div class="phase-header" @click="togglePhase(phase.id)">
          <div class="phase-title">
            <span class="phase-icon">{{ phase.icon || '📋' }}</span>
            <div>
              <h2>{{ phase.title }}</h2>
              <p class="phase-subtitle">{{ phase.subtitle || '' }}</p>
            </div>
          </div>
          <div class="phase-meta">
            <div class="phase-progress">
              <span>{{ phase.progress }}%</span>
              <div class="mini-progress-bar">
                <div class="mini-progress-fill" :style="{ width: phase.progress + '%' }"></div>
              </div>
            </div>
            <div class="phase-duration">{{ phase.estimatedWeeks || 0 }} weeks</div>
            <div class="expand-icon" :class="{ 'expanded': expandedPhases.includes(phase.id) }">▼</div>
          </div>
        </div>

        <!-- Phase Content -->
        <div v-if="expandedPhases.includes(phase.id)" class="phase-content">
          <p class="phase-description">{{ phase.description || '' }}</p>
          
          <!-- Enhanced Nodes -->
          <div class="nodes-container">
            <div 
              v-for="node in phase.nodes" 
              :key="node.id"
              class="node-card enhanced-node"
              :class="[
                `node-${node.type}`,
                { 
                  'active': node.isActive,
                  'completed': getNodeProgress(node, phase) === 100,
                  'locked': !node.isUnlocked
                }
              ]"
              @click="selectNode(node)"
              @mouseenter="showTooltip(node.id)"
              @mouseleave="hideTooltip"
            >
              <!-- Node Status Badge -->
              <div class="node-status-badge">
                <span v-if="getNodeProgress(node, phase) === 100" class="status-completed">✅</span>
                <span v-else-if="node.isActive" class="status-active">⚙️</span>
                <span v-else-if="!node.isUnlocked" class="status-locked">🔒</span>
                <span v-else class="status-pending">⏳</span>
              </div>

              <div class="node-header">
                <span class="node-icon">{{ getNodeIcon(node.type) }}</span>
                <div class="node-title-section">
                  <h3>{{ node.title }}</h3>
                  <!-- Why this matters tooltip trigger -->
                  <div v-if="getNodeRationale(node.type)" class="rationale-hint" 
                       :title="getNodeRationale(node.type)">
                    <span class="info-icon">💡</span>
                  </div>
                </div>
                <div class="node-progress-badge">{{ getNodeProgress(node, phase) }}%</div>
              </div>
              
              <div class="node-meta">
                <span class="node-type-badge" :class="`type-${node.type}`">
                  {{ node.type.toUpperCase() }}
                </span>
                <span class="estimated-hours">{{ node.estimatedHours || 0 }}h</span>
                <span v-if="node.checkpoint" class="checkpoint-badge">🏁 Checkpoint</span>
              </div>
              
              <div class="node-progress-bar">
                <div class="node-progress-fill" :style="{ width: getNodeProgress(node, phase) + '%' }"></div>
              </div>
              
              <p class="node-description">{{ node.description || 'No description available' }}</p>

              <!-- Deliverable Preview -->
              <div v-if="node.deliverables && node.deliverables.length > 0" class="deliverable-preview">
                <div class="deliverable-header">
                  <span class="deliverable-icon">🏆</span>
                  <span class="deliverable-text">{{ node.deliverables.length }} Deliverable{{ node.deliverables.length > 1 ? 's' : '' }}</span>
                </div>
                <!-- Example deliverable links (mock for demo) -->
                <div v-if="node.type === 'portfolio'" class="deliverable-links">
                  <a v-for="(deliverable, index) in node.deliverables.slice(0, 2)" 
                     :key="index"
                     :href="getDeliverableLink(node.id, deliverable)" 
                     class="deliverable-link"
                     target="_blank"
                     @click.stop>
                    📁 {{ deliverable }}
                  </a>
                </div>
              </div>

              <!-- Resource Count -->
              <div v-if="node.resources && node.resources.length > 0" class="resource-count">
                <span class="resource-icon">📚</span>
                <span>{{ node.resources.length }} Resource{{ node.resources.length > 1 ? 's' : '' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Node Detail Modal -->
    <div v-if="selectedNode" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedNode.title }}</h2>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="node-details">
            <div class="detail-row">
              <span class="label">Type:</span>
              <span class="node-type-badge" :class="`type-${selectedNode.type}`">
                {{ getNodeIcon(selectedNode.type) }} {{ selectedNode.type.toUpperCase() }}
              </span>
            </div>
            
            <div class="detail-row">
              <span class="label">Progress:</span>
              <div class="progress-display">
                <span>{{ selectedNodeProgress }}%</span>
                <div class="detail-progress-bar">
                  <div class="detail-progress-fill" :style="{ width: selectedNodeProgress + '%' }"></div>
                </div>
              </div>
            </div>
            
            <div class="detail-row">
              <span class="label">Estimated Time:</span>
              <span>{{ selectedNode.estimatedHours || 0 }} hours</span>
            </div>
            
            <div class="description-section">
              <h3>Description</h3>
              <p>{{ selectedNode.description || 'No description available' }}</p>
            </div>

            <!-- Resources -->
            <div v-if="selectedNode.resources" class="resources-section">
              <h3>Resources</h3>
              <div class="resources-list">
                <a 
                  v-for="resource in selectedNode.resources" 
                  :key="resource.title"
                  :href="resource.url"
                  class="resource-item"
                  target="_blank"
                >
                  <span class="resource-type">{{ resource.type }}</span>
                  <span class="resource-title">{{ resource.title }}</span>
                </a>
              </div>
            </div>

            <!-- Deliverables -->
            <div v-if="selectedNode.deliverables" class="deliverables-section">
              <h3>Deliverables</h3>
              <ul class="deliverables-list">
                <li v-for="deliverable in selectedNode.deliverables" :key="deliverable">
                  {{ deliverable }}
                </li>
              </ul>
            </div>

            <!-- Completion Criteria -->
            <div v-if="selectedNode.completionCriteria" class="criteria-section">
              <h3>Completion Criteria</h3>
              <ul class="criteria-list">
                <li v-for="criteria in selectedNode.completionCriteria" :key="criteria">
                  {{ criteria }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div v-if="showFeedbackModal" class="modal-backdrop" @click="showFeedbackModal = false">
      <div class="modal-content feedback-modal" @click.stop>
        <div class="modal-header">
          <h2>💬 Suggest Improvements</h2>
          <button @click="showFeedbackModal = false" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <p>Help make this roadmap even better! Your feedback is valuable.</p>
          
          <div class="feedback-options">
            <a href="https://github.com/jamiescottcraik/ai-engineering-roadmap/issues/new?template=feature_request.md" 
               target="_blank" 
               class="feedback-option">
              <span class="feedback-icon">🚀</span>
              <div>
                <h3>Suggest a Feature</h3>
                <p>Request new functionality or improvements</p>
              </div>
            </a>
            
            <a href="https://github.com/jamiescottcraik/ai-engineering-roadmap/issues/new?template=bug_report.md" 
               target="_blank" 
               class="feedback-option">
              <span class="feedback-icon">🐛</span>
              <div>
                <h3>Report an Issue</h3>
                <p>Found something that's not working?</p>
              </div>
            </a>
            
            <a href="https://github.com/jamiescottcraik/ai-engineering-roadmap/discussions" 
               target="_blank" 
               class="feedback-option">
              <span class="feedback-icon">💬</span>
              <div>
                <h3>Join Discussion</h3>
                <p>Share ideas and connect with others</p>
              </div>
            </a>
            
            <a href="https://github.com/jamiescottcraik/ai-engineering-roadmap/pulls" 
               target="_blank" 
               class="feedback-option">
              <span class="feedback-icon">🔧</span>
              <div>
                <h3>Contribute Code</h3>
                <p>Submit a pull request with improvements</p>
              </div>
            </a>
          </div>
          
          <div class="feedback-note">
            <p><strong>🌟 This is a living roadmap!</strong> Your contributions help keep it current and valuable for the AI engineering community.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { RoadmapData, RoadmapNode } from '../services/roadmapService'

// Reactive data
const roadmapData = ref<RoadmapData | null>(null)
const expandedPhases = ref<string[]>(['phase1']) // Start with first phase expanded
const selectedNode = ref<RoadmapNode | null>(null)
const showFeedbackModal = ref(false)

// Computed properties
const overallProgress = computed(() => {
  if (!roadmapData.value) return 0
  
  // Calculate progress based on actual time elapsed since start date
  const startDate = new Date(roadmapData.value.metadata.startDate)
  const currentDate = new Date()
  const daysElapsed = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  
  // Estimated total duration in days (let's use 450 days for 12-18 months average)
  const totalDurationDays = 450
  
  // Calculate realistic progress based on time elapsed (capped at 100%)
  const timeBasedProgress = Math.min(100, Math.round((daysElapsed / totalDurationDays) * 100))
  
  return timeBasedProgress
})

const completedDeliverables = computed(() => {
  if (!roadmapData.value) return 0
  
  // Only count deliverables as completed if enough time has passed
  const startDate = new Date(roadmapData.value.metadata.startDate)
  const currentDate = new Date()
  const daysElapsed = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  
  // Realistically, deliverables wouldn't be completed in the first few days
  if (daysElapsed < 7) return 0
  
  // Calculate a realistic number based on time elapsed
  const weeksElapsed = Math.floor(daysElapsed / 7)
  const expectedDeliverablesPerWeek = 0.5 // Half a deliverable per week is realistic
  
  return Math.floor(weeksElapsed * expectedDeliverablesPerWeek)
})

const currentPhase = computed(() => {
  if (!roadmapData.value) return 1
  const inProgressPhase = roadmapData.value.phases.find(phase => phase.status === 'in_progress')
  return inProgressPhase ? roadmapData.value.phases.indexOf(inProgressPhase) + 1 : 1
})

const totalHours = computed(() => {
  if (!roadmapData.value) return 0
  return roadmapData.value.phases.reduce((sum, phase) => 
    sum + phase.nodes.reduce((nodeSum, node) => nodeSum + (node.estimatedHours || 0), 0), 0)
})

const selectedNodeProgress = computed(() => {
  if (!selectedNode.value || !roadmapData.value) return 0
  
  // Find the phase that contains the selected node
  const phase = roadmapData.value.phases.find(p => 
    p.nodes.some(n => n.id === selectedNode.value?.id)
  )
  
  if (!phase) return 0
  
  return getNodeProgress(selectedNode.value, phase)
})

const timelineStatus = computed(() => 'now') // Can be enhanced with real logic

const currentPhaseTitle = computed(() => {
  if (!roadmapData.value) return 'Getting Started'
  const phase = roadmapData.value.phases.find(p => p.status === 'in_progress')
  return phase?.title || 'Phase 1'
})

const nextPhaseTitle = computed(() => {
  if (!roadmapData.value) return 'Coming Soon'
  const currentIndex = roadmapData.value.phases.findIndex(p => p.status === 'in_progress')
  const nextPhase = roadmapData.value.phases[currentIndex + 1]
  return nextPhase?.title || 'Final Phase'
})

// Methods
const getNodeProgress = (node: any, phase: any): number => {
  if (!roadmapData.value) return 0
  
  const startDate = new Date(roadmapData.value.metadata.startDate)
  const currentDate = new Date()
  const daysElapsed = Math.max(0, Math.floor((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)))
  
  // Find phase index to determine if this phase should have any progress
  const phaseIndex = roadmapData.value.phases.findIndex((p: any) => p.id === phase.id)
  const nodeIndex = phase.nodes.findIndex((n: any) => n.id === node.id)
  
  // Calculate when this node should start (roughly)
  const weeksPerPhase = 8 // Average from metadata
  const nodesPerPhase = phase.nodes.length
  const weeksPerNode = weeksPerPhase / nodesPerPhase
  
  const nodeStartWeek = (phaseIndex * weeksPerPhase) + (nodeIndex * weeksPerNode)
  const nodeStartDay = nodeStartWeek * 7
  
  // If current date is before this node should start, return 0
  if (daysElapsed < nodeStartDay) return 0
  
  // Calculate progress within the node timeframe
  const daysIntoNode = daysElapsed - nodeStartDay
  const nodeDurationDays = weeksPerNode * 7
  
  // Cap progress at 100%
  const progress = Math.min(100, Math.round((daysIntoNode / nodeDurationDays) * 100))
  
  return Math.max(0, progress)
}

const loadRoadmapData = async () => {
  try {
    const response = await fetch('/ai-engineering-roadmap/data/roadmap.json')
    roadmapData.value = await response.json()
  } catch (error) {
    console.error('Failed to load roadmap data:', error)
    // Fallback data or error handling
  }
}

const togglePhase = (phaseId: string) => {
  const index = expandedPhases.value.indexOf(phaseId)
  if (index > -1) {
    expandedPhases.value.splice(index, 1)
  } else {
    expandedPhases.value.push(phaseId)
  }
}

const selectNode = (node: RoadmapNode) => {
  if (node.isUnlocked) {
    selectedNode.value = node
  }
}

const closeModal = () => {
  selectedNode.value = null
}

const getNodeIcon = (type: string) => {
  const icons = {
    learn: '📘',
    practice: '🛠',
    portfolio: '📁',
    keyresource: '📎'
  }
  return icons[type as keyof typeof icons] || '📝'
}

const formatDate = (dateString: string, monthsToAdd?: number) => {
  const date = new Date(dateString)
  if (monthsToAdd) {
    date.setMonth(date.getMonth() + monthsToAdd)
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const scrollToRoadmap = () => {
  const roadmapElement = document.querySelector('.phases-container')
  if (roadmapElement) {
    roadmapElement.scrollIntoView({ behavior: 'smooth' })
  }
}

const showTooltip = (nodeId: string) => {
  // Could implement tooltip logic here
  console.log('Showing tooltip for:', nodeId)
}

const hideTooltip = () => {
  // Could implement tooltip logic here
  console.log('Hiding tooltip')
}

const getNodeRationale = (nodeType: string) => {
  const rationales = {
    learn: "Build foundational knowledge and theoretical understanding",
    practice: "Apply knowledge through hands-on coding and experimentation",
    portfolio: "Create tangible deliverables that demonstrate your skills to employers",
    keyresource: "Deep-dive into essential industry-standard resources"
  }
  return rationales[nodeType as keyof typeof rationales] || ""
}

const getDeliverableLink = (nodeId: string, deliverable: string) => {
  // Mock implementation - in real app, would link to actual project repos
  const baseUrl = "https://github.com/jamiescottcraik/ai-engineering-roadmap/projects"
  const slug = deliverable.toLowerCase().replace(/[^a-z0-9]/g, '-')
  return `${baseUrl}/${nodeId}/${slug}`
}

// Lifecycle
onMounted(() => {
  loadRoadmapData()
})
</script>

<style scoped>
/* Base styles */
.roadmap-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
  min-height: 100vh;
}

/* Hero Section */
.roadmap-hero {
  text-align: center;
  margin-bottom: 60px;
  padding: 60px 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.hero-content h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  font-weight: 800;
  background: linear-gradient(45deg, #ffffff, #e2e8f0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-tagline {
  font-size: 1.3rem;
  margin-bottom: 20px;
  font-weight: 500;
  line-height: 1.6;
}

.description {
  font-size: 1.1rem;
  margin-bottom: 40px;
  opacity: 0.9;
  line-height: 1.6;
}

/* CTA Buttons */
.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 50px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 16px 32px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: linear-gradient(45deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.6);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

/* Progress Dashboard */
.progress-dashboard {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
}

.progress-item {
  margin-bottom: 20px;
}

.progress-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-bottom: 8px;
}

.progress-value {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 12px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 6px;
  transition: width 0.8s ease;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
  margin-top: 4px;
}

/* Timeline Status */
.timeline-status {
  display: flex;
  justify-content: center;
  gap: 40px;
  flex-wrap: wrap;
}

.timeline-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.timeline-item.active {
  opacity: 1;
  font-weight: 600;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.6);
}

.timeline-item.active .timeline-dot {
  background: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 0.9rem;
  opacity: 0.9;
}

.phases-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.phase-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.phase-card.active {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.phase-card.completed {
  border-color: #10b981;
  background: linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent);
}

.phase-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.phase-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.phase-icon {
  font-size: 2rem;
}

.phase-title h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
}

.phase-subtitle {
  margin: 4px 0 0 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.phase-meta {
  display: flex;
  align-items: center;
  gap: 20px;
}

.phase-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.mini-progress-bar {
  width: 60px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.phase-duration {
  font-size: 0.9rem;
  color: #6b7280;
}

.expand-icon {
  font-size: 0.8rem;
  color: #6b7280;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.phase-content {
  padding: 0 24px 24px 24px;
}

.phase-description {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.6;
}

.nodes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.node-card {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.node-card:hover:not(.locked) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.node-card.active {
  border-color: #3b82f6;
  background: #eff6ff;
}

.node-card.completed {
  border-color: #10b981;
  background: #ecfdf5;
}

.node-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.node-learn {
  border-left: 4px solid #1f4e79;
}

.node-practice {
  border-left: 4px solid #4b8a36;
}

.node-portfolio {
  border-left: 4px solid #843c0c;
}

.node-keyresource {
  border-left: 4px solid #7030a0;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.node-icon {
  font-size: 1.2rem;
}

.node-header h3 {
  flex: 1;
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.node-progress {
  font-size: 0.9rem;
  font-weight: 600;
  color: #3b82f6;
}

.node-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.node-type {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.estimated-hours {
  font-size: 0.8rem;
  color: #6b7280;
}

.node-progress-bar {
  width: 100%;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 12px;
}

.node-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.node-description {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.4;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
}

.modal-body {
  padding: 24px;
}

.detail-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
}

.label {
  font-weight: 600;
  color: #374151;
  min-width: 120px;
}

.node-type-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.type-learn {
  background: #dbeafe;
  color: #1d4ed8;
}

.type-practice {
  background: #dcfce7;
  color: #166534;
}

.type-portfolio {
  background: #fed7aa;
  color: #9a3412;
}

.type-keyresource {
  background: #f3e8ff;
  color: #7c3aed;
}

.progress-display {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.detail-progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.detail-progress-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.description-section,
.resources-section,
.deliverables-section,
.criteria-section {
  margin-top: 24px;
}

.description-section h3,
.resources-section h3,
.deliverables-section h3,
.criteria-section h3 {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
}

.resources-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  text-decoration: none;
  color: inherit;
  transition: background 0.2s ease;
}

.resource-item:hover {
  background: #e2e8f0;
}

.resource-type {
  font-size: 0.8rem;
  padding: 2px 6px;
  background: #e5e7eb;
  border-radius: 3px;
  text-transform: uppercase;
  font-weight: 600;
}

.resource-title {
  flex: 1;
}

.deliverables-list,
.criteria-list {
  margin: 0;
  padding-left: 20px;
}

.deliverables-list li,
.criteria-list li {
  margin-bottom: 8px;
  line-height: 1.4;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-state h1 {
  color: #6b7280;
  margin-bottom: 30px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 768px) {
  .roadmap-container {
    padding: 16px;
  }
  
  .roadmap-header {
    padding: 20px;
  }
  
  .roadmap-header h1 {
    font-size: 2rem;
  }
  
  .progress-overview {
    flex-direction: column;
    gap: 20px;
  }
  
  .phase-header {
    padding: 16px;
  }
  
  .phase-meta {
    gap: 12px;
  }
  
  .nodes-container {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 100px 20px;
  color: #64748b;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Phases */
.phases-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.phase-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

.phase-card.active {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.phase-card.completed {
  border-color: #10b981;
  background: linear-gradient(to right, rgba(16, 185, 129, 0.05), transparent);
}

.phase-card.locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.phase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.3s ease;
}

.phase-header:hover {
  background: #f8fafc;
}

.phase-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.phase-icon {
  font-size: 2rem;
}

.phase-title h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
}

.phase-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin: 4px 0 0 0;
}

.phase-meta {
  display: flex;
  align-items: center;
  gap: 20px;
}

.phase-progress {
  text-align: center;
}

.mini-progress-bar {
  width: 60px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 4px;
}

.mini-progress-fill {
  height: 100%;
  background: #10b981;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.phase-duration {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.expand-icon {
  font-size: 1.2rem;
  color: #64748b;
  transition: transform 0.3s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.phase-content {
  padding: 0 30px 30px 30px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.phase-description {
  margin-bottom: 30px;
  color: #475569;
  line-height: 1.6;
}

/* Enhanced Nodes */
.nodes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.enhanced-node {
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;
}

.enhanced-node:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.enhanced-node.active {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.enhanced-node.completed {
  border-color: #10b981;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), transparent);
}

.enhanced-node.locked {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}

.node-status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
}

.status-completed, .status-active, .status-locked, .status-pending {
  font-size: 1.2rem;
}

.node-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 20px 16px 20px;
}

.node-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.node-title-section {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.node-title-section h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #1e293b;
  line-height: 1.4;
}

.rationale-hint {
  cursor: help;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.rationale-hint:hover {
  opacity: 1;
}

.info-icon {
  font-size: 0.9rem;
}

.node-progress-badge {
  background: #f1f5f9;
  color: #475569;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  flex-shrink: 0;
}

.node-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px 16px 20px;
  flex-wrap: wrap;
}

.node-type-badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.type-learn { background: #dbeafe; color: #1e40af; }
.type-practice { background: #fef3c7; color: #92400e; }
.type-portfolio { background: #d1fae5; color: #065f46; }
.type-keyresource { background: #fce7f3; color: #9d174d; }

.estimated-hours {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.checkpoint-badge {
  background: linear-gradient(45deg, #f59e0b, #d97706);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}

.node-progress-bar {
  height: 4px;
  background: #e2e8f0;
  margin: 0 20px 16px 20px;
  border-radius: 2px;
  overflow: hidden;
}

.node-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  border-radius: 2px;
  transition: width 0.8s ease;
}

.node-description {
  padding: 0 20px 16px 20px;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

/* Deliverable Preview */
.deliverable-preview {
  border-top: 1px solid #f1f5f9;
  padding: 16px 20px;
  background: #f8fafc;
}

.deliverable-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.deliverable-icon {
  font-size: 1rem;
}

.deliverable-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deliverable-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.85rem;
  padding: 6px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.deliverable-link:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  transform: translateX(4px);
}

.resource-count {
  padding: 12px 20px;
  border-top: 1px solid #f1f5f9;
  background: #f8fafc;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #64748b;
}

.resource-icon {
  font-size: 1rem;
}

/* Feedback Modal */
.feedback-modal {
  max-width: 600px;
  width: 90%;
}

.feedback-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.feedback-option {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.feedback-option:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
}

.feedback-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feedback-option h3 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

.feedback-option p {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.feedback-note {
  background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
  border: 1px solid #bae6fd;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.feedback-note p {
  margin: 0;
  color: #0c4a6e;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .roadmap-container {
    padding: 16px;
  }
  
  .roadmap-hero {
    padding: 40px 20px;
  }
  
  .hero-content h1 {
    font-size: 2rem;
  }
  
  .hero-tagline {
    font-size: 1.1rem;
  }
  
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  
  .timeline-status {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  
  .phase-header {
    padding: 20px;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .phase-meta {
    width: 100%;
    justify-content: space-between;
  }
  
  .phase-content {
    padding: 0 20px 20px 20px;
  }
  
  .nodes-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .enhanced-node {
    margin: 0;
  }
  
  .feedback-options {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
