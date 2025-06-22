<template>
  <div class="roadmap-container">
    <!-- Header -->
    <div v-if="roadmapData" class="roadmap-header">
      <h1>{{ roadmapData.metadata.title }}</h1>
      <p class="description">{{ roadmapData.metadata.description }}</p>
      <div class="progress-overview">
        <div class="overall-progress">
          <span>Overall Progress: {{ overallProgress }}%</span>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: overallProgress + '%' }"></div>
          </div>
        </div>
        <div class="timeline">
          <span>Started: {{ formatDate(roadmapData.metadata.startDate) }}</span>
          <span>Duration: {{ roadmapData.metadata.estimatedDuration }}</span>
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
          
          <!-- Nodes -->
          <div class="nodes-container">
            <div 
              v-for="node in phase.nodes" 
              :key="node.id"
              class="node-card"
              :class="[
                `node-${node.type}`,
                { 
                  'active': node.isActive,
                  'completed': node.progress === 100,
                  'locked': !node.isUnlocked
                }
              ]"
              @click="selectNode(node)"
            >
              <div class="node-header">
                <span class="node-icon">{{ getNodeIcon(node.type) }}</span>
                <h3>{{ node.title }}</h3>
                <div class="node-progress">{{ node.progress }}%</div>
              </div>
              
              <div class="node-meta">
                <span class="node-type">{{ node.type.toUpperCase() }}</span>
                <span class="estimated-hours">{{ node.estimatedHours || 0 }}h</span>
              </div>
              
              <div class="node-progress-bar">
                <div class="node-progress-fill" :style="{ width: node.progress + '%' }"></div>
              </div>
              
              <p class="node-description">{{ node.description || 'No description available' }}</p>
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
                <span>{{ selectedNode.progress }}%</span>
                <div class="detail-progress-bar">
                  <div class="detail-progress-fill" :style="{ width: selectedNode.progress + '%' }"></div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { RoadmapData, RoadmapNode } from '../services/roadmapService'

// Reactive data
const roadmapData = ref<RoadmapData | null>(null)
const expandedPhases = ref<string[]>(['phase1']) // Start with first phase expanded
const selectedNode = ref<RoadmapNode | null>(null)

// Computed properties
const overallProgress = computed(() => {
  if (!roadmapData.value) return 0
  const totalNodes = roadmapData.value.phases.reduce((sum, phase) => sum + phase.nodes.length, 0)
  const totalProgress = roadmapData.value.phases.reduce((sum, phase) => 
    sum + phase.nodes.reduce((nodeSum, node) => nodeSum + node.progress, 0), 0)
  return Math.round(totalProgress / totalNodes)
})

// Methods
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  loadRoadmapData()
})
</script>

<style scoped>
.roadmap-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.roadmap-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  color: white;
}

.roadmap-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 700;
}

.description {
  font-size: 1.2rem;
  margin-bottom: 30px;
  opacity: 0.9;
}

.progress-overview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.overall-progress {
  flex: 1;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-top: 8px;
}

.progress-fill {
  height: 100%;
  background: #4ade80;
  border-radius: 4px;
  transition: width 0.3s ease;
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
</style>
