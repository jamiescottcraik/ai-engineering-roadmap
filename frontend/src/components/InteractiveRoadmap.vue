<template>
  <div class="roadmap-container">
    <!-- Hero Section with Context -->
    <div v-if="roadmapData" class="roadmap-hero">
      <div class="hero-content">
        <!-- brAInwav Logo -->
        <div class="brand-logo">
          <img src="/brAInwav.png" alt="brAInwav Logo" class="logo-image" />
        </div>
        
        <h1>{{ roadmapData.metadata.title }}</h1>
        <p class="hero-tagline">
          🎯 <strong>Your step-by-step journey to AI engineering leadership mastery</strong> — 
          from Python foundations to production AI systems, with real deliverables and industry recognition.
        </p>
        <p class="description">{{ roadmapData.metadata.description }}</p>
        
        <!-- Enhanced Call-to-Action Buttons with Naive UI -->
        <div class="cta-buttons">
          <n-button 
            @click="scrollToRoadmap" 
            type="primary" 
            size="large"
            round
            class="btn-primary"
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
            class="btn-secondary"
          >
            💬 Suggest Improvements
          </n-button>
        </div>
        
        <!-- Enhanced Progress Dashboard with Naive UI -->
        <div class="progress-dashboard">
          <n-grid :cols="4" :x-gap="20" responsive="screen">
            <n-grid-item :span="4">
              <n-card title="Overall Progress" embedded>
                <n-progress 
                  type="line" 
                  :percentage="overallProgress" 
                  :height="24"
                  :border-radius="12"
                  :fill-border-radius="12"
                  color="#1E90FF"
                  rail-color="#0B1016"
                  processing
                />
                <template #header-extra>
                  <n-gradient-text type="info">{{ overallProgress }}%</n-gradient-text>
                </template>
              </n-card>
            </n-grid-item>
            
            <n-grid-item>
              <n-statistic label="Deliverables Done" :value="completedDeliverables">
                <template #prefix>
                  <n-icon :component="CheckmarkCircle" color="#10B981" />
                </template>
              </n-statistic>
            </n-grid-item>
            
            <n-grid-item>
              <n-statistic label="Current Phase" :value="currentPhase">
                <template #prefix>
                  <n-icon :component="Rocket" color="#FF4A00" />
                </template>
              </n-statistic>
            </n-grid-item>
            
            <n-grid-item>
              <n-statistic label="Total Hours" :value="totalHours">
                <template #prefix>
                  <n-icon :component="Time" color="#1167B1" />
                </template>
              </n-statistic>
            </n-grid-item>
          </n-grid>
        </div>
        
        <!-- Enhanced Timeline with Naive UI Steps -->
        <div class="timeline-status">
          <n-card title="Learning Journey Progress" embedded>
            <div class="timeline-phases">
              <div 
                v-for="(phase, index) in roadmapData?.phases.slice(0, 4) || []" 
                :key="phase.id"
                class="timeline-phase"
                :class="{ 
                  'active': phase.status === 'in_progress',
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
                <div v-if="index < 3" class="phase-connector"></div>
              </div>
            </div>
          </n-card>
        </div>
      </div>
    </div>

    <!-- Loading State with Naive UI -->
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
          <!-- Search Input -->
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
          
          <!-- Filter Chips -->
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
            
            <!-- Clear filters button -->
            <n-button
              v-if="searchQuery || selectedFilters.length > 0"
              @click="clearFilters"
              type="tertiary"
              size="small"
            >
              Clear All
            </n-button>
          </n-space>
          
          <!-- Results Summary -->
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

    <!-- Vertical Roadmap (roadmap.sh style) -->
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

          <!-- Roadmap Nodes in Vertical Flow -->
          <div class="roadmap-nodes-flow">
            <n-tooltip 
              v-for="(node, nodeIndex) in phase.nodes" 
              :key="node.id"
              placement="right"
              trigger="hover"
            >
              <template #trigger>
                <div 
                  class="roadmap-node"
                  :class="[
                    `node-${node.type}`,
                    { 
                      'completed': getNodeProgress(node, phase) === 100,
                      'in-progress': getNodeProgress(node, phase) > 0 && getNodeProgress(node, phase) < 100,
                      'todo': getNodeProgress(node, phase) === 0,
                      'optional': node.isOptional,
                      'checkpoint': node.checkpoint
                    }
                  ]"
                  @click="selectNode(node)"
                >
                  <!-- Node Connector -->
                  <div v-if="nodeIndex > 0" class="node-connector"></div>
                  
                  <!-- Node Card -->
                  <div class="node-content">
                    <div class="node-header-compact">
                      <div class="node-status-icon" @click.stop="markNodeCompleted(node.id)">
                        <span v-if="isNodeCompleted(node.id)">✅</span>
                        <span v-else-if="getNodeProgress(node, phase) > 0">⚙️</span>
                        <span v-else>⏳</span>
                      </div>
                      <div class="node-main-info">
                        <h3>{{ node.title }}</h3>
                        <div class="node-meta-inline">
                          <n-tag 
                            :type="getNodeTypeColor(node.type)" 
                            size="small" 
                            round
                          >
                            {{ getNodeIcon(node.type) }} {{ node.type }}
                          </n-tag>
                          <n-tag type="info" size="small">{{ node.estimatedHours || 0 }}h</n-tag>
                          <n-badge 
                            v-if="node.resources && node.resources.length > 0" 
                            :value="node.resources.length"
                            type="success"
                          >
                            <n-tag size="small">📚 Resources</n-tag>
                          </n-badge>
                          <n-tag v-if="node.checkpoint" type="warning" size="small">🏁 Checkpoint</n-tag>
                          <n-tag v-if="node.isOptional" type="default" size="small">Optional</n-tag>
                        </div>
                      </div>
                      <div class="node-progress-indicator">
                        <div class="progress-circle" :style="{ '--progress': getNodeProgress(node, phase) }">
                          <span>{{ getNodeProgress(node, phase) }}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <p class="node-description-compact">{{ node.description || 'Click to see details and resources' }}</p>
                    
                    <!-- Quick Resource Preview -->
                    <div v-if="node.resources && node.resources.length > 0" class="quick-resources">
                      <n-space size="small">
                        <n-tag 
                          v-for="resource in node.resources.slice(0, 3)" 
                          :key="resource.title"
                          size="small"
                          :type="getResourceTypeColor(resource.type)"
                        >
                          {{ getResourceIcon(resource.type) }} {{ resource.type }}
                        </n-tag>
                        <n-tag v-if="node.resources.length > 3" type="info" size="small">
                          +{{ node.resources.length - 3 }} more
                        </n-tag>
                      </n-space>
                    </div>
                  </div>
                </div>
              </template>
              
              <div class="node-tooltip-content">
                <h4>{{ node.title }}</h4>
                <p><strong>Type:</strong> {{ node.type }}</p>
                <p><strong>Duration:</strong> {{ node.estimatedHours || 0 }} hours</p>
                <p><strong>Progress:</strong> {{ getNodeProgress(node, phase) }}%</p>
                <div v-if="node.description">
                  <strong>Description:</strong>
                  <p>{{ node.description }}</p>
                </div>
                <div v-if="node.resources && node.resources.length > 0">
                  <strong>Resources:</strong> {{ node.resources.length }} available
                </div>
                <p style="margin-top: 8px; font-style: italic;">Click to view details and resources</p>
              </div>
            </n-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- Phase Cards -->
    <div v-if="false && roadmapData" class="phases-container">
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
                <!-- Resource indicator badge -->
                <div v-if="node.resources && node.resources.length > 0" class="resource-indicator" :title="`${node.resources.length} learning resources available`">
                  📚 {{ node.resources.length }}
                </div>
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

    <!-- Node Detail Modal with Naive UI -->
    <n-modal 
      v-model:show="showNodeModal" 
      preset="card" 
      :title="selectedNode?.title || 'Node Details'"
      class="node-modal"
      :style="{ maxWidth: '800px' }"
      size="large"
      closable
      :mask-closable="true"
      @update:show="(show: boolean) => { if (!show) selectedNode = null }"
    >
      <div v-if="selectedNode" class="modal-body">
        <div class="node-details">
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

            <!-- Enhanced Resources with Naive UI Cards -->
            <div v-if="selectedNode.resources && selectedNode.resources.length > 0" class="resources-section enhanced-resources">
              <n-card title="📚 Learning Resources" size="small" embedded>
                <template #header-extra>
                  <n-tag type="info" round>
                    {{ selectedNode.resources.length }} resource{{ selectedNode.resources.length > 1 ? 's' : '' }}
                  </n-tag>
                </template>
                
                <n-scrollbar style="max-height: 400px;">
                  <n-space vertical size="small">
                    <n-card 
                      v-for="resource in selectedNode.resources" 
                      :key="resource.title"
                      :title="resource.title"
                      size="small"
                      hoverable
                      embedded
                      @click="openResource(resource.url)"
                      style="cursor: pointer;"
                    >
                      <template #header-extra>
                        <n-space size="small">
                          <n-tag 
                            :type="getResourceTypeColor(resource.type)" 
                            size="small"
                          >
                            {{ getResourceIcon(resource.type) }} {{ resource.type }}
                          </n-tag>
                          <n-tag 
                            v-if="resource.difficulty" 
                            :type="resource.difficulty === 'beginner' ? 'success' : resource.difficulty === 'intermediate' ? 'warning' : 'error'"
                            size="small"
                          >
                            {{ resource.difficulty }}
                          </n-tag>
                          <n-tag 
                            v-if="resource.estimatedTime" 
                            type="info" 
                            size="small"
                          >
                            {{ Math.round(resource.estimatedTime / 60) }}h
                          </n-tag>
                        </n-space>
                      </template>
                      
                      <template #default>
                        <n-space vertical size="small">
                          <p v-if="resource.description" style="margin: 0; color: #6B7280; font-size: 0.9rem;">
                            {{ resource.description }}
                          </p>
                          <n-alert 
                            v-if="resource.rationale" 
                            type="info" 
                            :show-icon="false"
                            size="small"
                            style="margin-top: 8px;"
                          >
                            <template #header>
                              💡 Why This Matters
                            </template>
                            {{ resource.rationale }}
                          </n-alert>
                        </n-space>
                      </template>
                      
                      <template #action>
                        <div class="resource-action-enhanced">
                          <n-button type="primary" size="small" round>
                            Open Resource →
                          </n-button>
                        </div>
                      </template>
                    </n-card>
                  </n-space>
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

            <!-- Completion Criteria -->
            <n-card 
              v-if="selectedNode.completionCriteria && selectedNode.completionCriteria.length > 0" 
              title="✅ Completion Criteria" 
              size="small" 
              embedded
            >
              <n-space vertical size="small">
                <div 
                  v-for="criteria in selectedNode.completionCriteria" 
                  :key="criteria"
                  style="display: flex; align-items: center; gap: 8px;"
                >
                  <n-icon :component="CheckmarkCircle" style="color: #18a058;" />
                  <span>{{ criteria }}</span>
                </div>
              </n-space>
            </n-card>
          </n-space>
        </div>
      </div>
    </n-modal>

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
import { 
  NProgress, 
  NCard, 
  NStatistic,
  NGrid,
  NGridItem,
  NGradientText,
  NIcon,
  NButton,
  NTooltip,
  NModal,
  NScrollbar,
  NSpin,
  NBadge,
  NTag,
  NSpace,
  NAlert,
  NInput
} from 'naive-ui'
import { 
  Rocket,
  CheckmarkCircle,
  Time
} from '@vicons/ionicons5'
import type { RoadmapData, RoadmapNode } from '../services/roadmapService'
import { 
  useSemanticIcons, 
  useNodeTypeColor, 
  useProgressState,
  usePhaseStyles,
  useAccessibility 
} from '../design-system/composables'

// Design system composables - replaces old manual implementations
const { getNodeIcon: getSemanticNodeIcon, getResourceIcon: getSemanticResourceIcon } = useSemanticIcons()
const { getNodeTypeColor: getSemanticNodeTypeColor } = useNodeTypeColor()

// Reactive data
const roadmapData = ref<RoadmapData | null>(null)
const expandedPhases = ref<string[]>(['phase1']) // Start with first phase expanded
const selectedNode = ref<RoadmapNode | null>(null)
const showFeedbackModal = ref(false)
const showNodeModal = computed(() => selectedNode.value !== null)

// Search and Filter functionality
const searchQuery = ref('')
const selectedFilters = ref<string[]>([])
const availableFilters = ref([
  { value: 'learn', label: 'Learn', color: 'info' as const },
  { value: 'practice', label: 'Practice', color: 'warning' as const },
  { value: 'portfolio', label: 'Portfolio', color: 'success' as const },
  { value: 'course', label: 'Course', color: 'primary' as const },
  { value: 'tutorial', label: 'Tutorial', color: 'default' as const }
])

// Computed properties
const overallProgress = computed(() => {
  if (!roadmapData.value) return 0
  
  // Use actual user completion data instead of misleading time-based calculation
  return userOverallProgress.value
})

const completedDeliverables = computed(() => {
  if (!roadmapData.value) return 0
  
  // Count actual completed deliverables based on user progress
  let completedCount = 0
  
  roadmapData.value.phases.forEach(phase => {
    phase.nodes.forEach(node => {
      if (isNodeCompleted(node.id) && node.deliverables && node.deliverables.length > 0) {
        completedCount += node.deliverables.length
      }
    })
  })
  
  return completedCount
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
    console.log('Progress saved to localStorage')
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
      console.log('Progress loaded from localStorage')
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

const updateNodeNotes = (nodeId: string, notes: string) => {
  if (!userProgress.value.nodeProgress[nodeId]) {
    userProgress.value.nodeProgress[nodeId] = { completed: false, timeSpent: 0, notes: '' }
  }
  userProgress.value.nodeProgress[nodeId].notes = notes
  saveProgress()
}

const isNodeCompleted = (nodeId: string): boolean => {
  return userProgress.value.nodeProgress[nodeId]?.completed || false
}

const getNodeNotes = (nodeId: string): string => {
  return userProgress.value.nodeProgress[nodeId]?.notes || ''
}

// Enhanced progress calculations based on user data
const userCompletedNodes = computed(() => {
  return Object.values(userProgress.value.nodeProgress).filter(p => p.completed).length
})

const userOverallProgress = computed(() => {
  if (!roadmapData.value) return 0
  
  const totalNodes = roadmapData.value.phases.reduce((sum, phase) => sum + phase.nodes.length, 0)
  const completedNodes = userCompletedNodes.value
  
  return totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0
})

// Search and Filter computed properties
const filteredNodes = computed(() => {
  if (!roadmapData.value) return []
  
  return roadmapData.value.phases.flatMap(phase => 
    phase.nodes.filter(node => {
      // Search filter
      const matchesSearch = searchQuery.value === '' || 
        node.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (node.description && node.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
      
      // Type filter
      const matchesFilter = selectedFilters.value.length === 0 || 
        selectedFilters.value.includes(node.type) ||
        (node.resources?.some(resource => selectedFilters.value.includes(resource.type)) ?? false)
      
      return matchesSearch && matchesFilter
    }).map(node => ({ ...node, phaseId: phase.id, phaseTitle: phase.title }))
  )
})

const filteredPhases = computed(() => {
  if (!roadmapData.value) return []
  
  if (searchQuery.value === '' && selectedFilters.value.length === 0) {
    return roadmapData.value.phases
  }
  
  return roadmapData.value.phases.map(phase => ({
    ...phase,
    nodes: phase.nodes.filter(node => {
      const matchesSearch = searchQuery.value === '' || 
        node.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (node.description && node.description.toLowerCase().includes(searchQuery.value.toLowerCase()))
      
      const matchesFilter = selectedFilters.value.length === 0 || 
        selectedFilters.value.includes(node.type) ||
        (node.resources?.some(resource => selectedFilters.value.includes(resource.type)) ?? false)
      
      return matchesSearch && matchesFilter
    })
  })).filter(phase => phase.nodes.length > 0)
})

// Missing Methods
const getNodeProgress = (node: any, phase: any): number => {
  if (!roadmapData.value) return 0
  
  // Check if user has manually marked as completed
  if (isNodeCompleted(node.id)) return 100
  
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
  return Math.min(100, Math.round((daysIntoNode / nodeDurationDays) * 100))
}

const selectNode = (node: RoadmapNode) => {
  selectedNode.value = node
}

const scrollToRoadmap = () => {
  const element = document.getElementById('roadmap-main')
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const getNodeTypeColor = (type: string): "default" | "primary" | "info" | "success" | "warning" | "error" => {
  const colorMap: Record<string, "default" | "primary" | "info" | "success" | "warning" | "error"> = {
    'learn': 'info',
    'practice': 'warning', 
    'portfolio': 'success',
    'keyresource': 'primary'
  }
  return colorMap[type] || 'default'
}

const getNodeIcon = (type: string): string => {
  // Use design system icon mapping
  return getSemanticNodeIcon(type)
}

const getResourceTypeColor = (type: string): "default" | "primary" | "info" | "success" | "warning" | "error" => {
  const colorMap: Record<string, "default" | "primary" | "info" | "success" | "warning" | "error"> = {
    'course': 'primary',
    'tutorial': 'info',
    'documentation': 'warning',
    'tool': 'success',
    'book': 'default',
    'guide': 'info'
  }
  return colorMap[type] || 'default'
}

const getResourceIcon = (type: string): string => {
  // Use design system icon mapping
  return getSemanticResourceIcon(type)
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

const openResource = (url: string) => {
  if (url && url !== '#') {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

// Missing utility functions
const togglePhase = (phaseId: string) => {
  const index = expandedPhases.value.indexOf(phaseId)
  if (index > -1) {
    expandedPhases.value.splice(index, 1)
  } else {
    expandedPhases.value.push(phaseId)
  }
  saveProgress()
}

const showTooltip = (nodeId: string) => {
  // Tooltip handling could be enhanced in the future
  console.log('Show tooltip for:', nodeId)
}

const hideTooltip = () => {
  // Tooltip handling could be enhanced in the future
}

const getNodeRationale = (type: string): string => {
  const rationales: Record<string, string> = {
    'learn': 'Essential theoretical knowledge for building AI systems',
    'practice': 'Hands-on experience applying concepts in real scenarios',
    'portfolio': 'Demonstrable projects that showcase your capabilities',
    'keyresource': 'Critical resources that form the foundation of your expertise'
  }
  return rationales[type] || ''
}

const getDeliverableLink = (nodeId: string, deliverable: string): string => {
  // This would link to actual deliverable submissions in a real system
  return `#deliverable-${nodeId}-${deliverable.toLowerCase().replace(/\s+/g, '-')}`
}

const loadRoadmapData = async () => {
  try {
    const response = await fetch('/roadmap.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    roadmapData.value = data
  } catch (error) {
    console.error('Error loading roadmap data:', error)
  }
}

onMounted(() => {
  loadRoadmapData()
  loadProgress()
})
</script>

<style scoped>
.roadmap-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.roadmap-hero {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: #fff;
  padding: 40px 20px;
  border-radius: 8px;
  margin-bottom: 40px;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.brand-logo {
  margin-bottom: 20px;
}

.logo-image {
  max-width: 150px;
}

h1 {
  font-size: 2.5rem;
  margin: 0 0 10px;
}

.hero-tagline {
  font-size: 1.2rem;
  margin: 0 0 20px;
}

.description {
  font-size: 1rem;
  margin: 0 0 30px;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
}

.btn-primary {
  background-color: #4caf50;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-secondary {
  background-color: transparent;
  color: #4caf50;
  padding: 10px 20px;
  border: 2px solid #4caf50;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.progress-dashboard {
  margin-bottom: 40px;
}

.timeline-status {
  margin-bottom: 40px;
}

.phase-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
  transition: transform 0.3s;
}

.phase-card:hover {
  transform: translateY(-2px);
}

.phase-header {
  background-color: #f7f7f7;
  padding: 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.phase-title {
  font-size: 1.2rem;
  margin: 0;
}

.phase-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.phase-progress {
  font-size: 0.9rem;
  position: relative;
}

.mini-progress-bar {
  width: 100%;
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
}

.mini-progress-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 2px;
}

.expand-icon {
  font-size: 1.2rem;
  transition: transform 0.3s;
}

.expanded {
  transform: rotate(180deg);
}

.phase-content {
  padding: 15px;
}

.nodes-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.node-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  transition: transform 0.3s;
  position: relative;
}

.node-card:hover {
  transform: translateY(-2px);
}

.node-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.node-title-section {
  flex-grow: 1;
}

.node-icon {
  font-size: 1.5rem;
  margin-right: 10px;
}

.node-progress-badge {
  background-color: #4caf50;
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.9rem;
  position: absolute;
  top: 10px;
  right: 10px;
}

.resource-indicator {
  position: absolute;
  top: 10px;
  right: 60px;
  font-size: 0.9rem;
  color: #4caf50;
}

.node-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.node-type-badge {
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.estimated-hours {
  font-size: 0.9rem;
  color: #666;
}

.checkpoint-badge {
  background-color: #ff9800;
  color: #fff;
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
}

.node-progress-bar {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
}

.node-progress-fill {
  height: 100%;
  background-color: #4caf50;
  border-radius: 4px;
}

.node-description {
  font-size: 0.9rem;
  color: #333;
}

.deliverable-preview {
  background-color: #f0f8ff;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.deliverable-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.deliverable-icon {
  font-size: 1.2rem;
  margin-right: 5px;
}

.deliverable-text {
  font-size: 0.9rem;
  color: #333;
}

.resource-count {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #666;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.feedback-modal {
  max-width: 600px;
}

.feedback-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.feedback-option {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  transition: transform 0.3s;
}

.feedback-option:hover {
  transform: translateY(-2px);
}

.feedback-icon {
  font-size: 2rem;
  margin-right: 10px;
  color: #4caf50;
}

.resources-section {
  margin-top: 20px;
}

.resources-note {
  margin-top: 10px;
  font-size: 0.9rem;
  color: #666;
}

/* Search and Filter Section */
.search-filter-section {
  margin-bottom: 30px;
}

.search-filter-section .n-card {
  margin-bottom: 20px;
}

.search-filter-section .n-input {
  margin-bottom: 16px;
}

.search-filter-section .n-tag {
  margin: 4px;
  transition: all 0.3s ease;
}

.search-filter-section .n-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(30, 144, 255, 0.2);
}

.search-filter-section .n-alert {
  border-radius: 8px;
  border-left: 4px solid #1E90FF;
}

/* Progress Persistence Indicators */
.completed-node {
  position: relative;
  opacity: 0.8;
}

.completed-node::after {
  content: '✅';
  position: absolute;
  top: -5px;
  right: -5px;
  font-size: 14px;
}

.user-progress-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(30, 144, 255, 0.1);
  border-radius: 6px;
  border-left: 3px solid #1E90FF;
}
</style>
