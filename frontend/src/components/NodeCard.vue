<!-- NodeCard.vue - Reusable Node Card Component -->
<template>
  <n-card 
    :title="node.title"
    :class="cardClasses"
    hoverable
    embedded
    @click="$emit('click', node)"
    style="cursor: pointer;"
  >
    <template #header-extra>
      <n-space size="small" align="center">
        <!-- Node Status Icon -->
        <div 
          class="node-status-icon" 
          @click.stop="$emit('toggle-completion', node.id)"
          :title="statusTooltip"
        >
          <n-icon size="20" :color="statusColor">
            {{ statusIcon }}
          </n-icon>
        </div>
        
        <!-- Progress Circle -->
        <div class="progress-circle-mini" :style="progressStyles">
          <span class="progress-text">{{ progress }}%</span>
        </div>
      </n-space>
    </template>
    
    <template #default>
      <n-space vertical size="small">
        <!-- Node Meta Information -->
        <n-space size="small" wrap>
          <n-tag 
            :type="nodeTypeColor" 
            size="small"
            :style="nodeTypeStyles"
          >
            {{ nodeTypeIcon }} {{ node.type }}
          </n-tag>
          <n-tag type="info" size="small">
            {{ node.estimatedHours || 0 }}h
          </n-tag>
          <n-tag v-if="node.checkpoint" type="warning" size="small">
            🏁 Checkpoint
          </n-tag>
          <n-tag v-if="node.isOptional" type="default" size="small">
            Optional
          </n-tag>
        </n-space>
        
        <!-- Description -->
        <p v-if="node.description" class="node-description">
          {{ node.description }}
        </p>
        <p v-else class="node-description-placeholder">
          Click to see details and resources
        </p>
        
        <!-- Resource Count -->
        <div v-if="node.resources && node.resources.length > 0" class="resource-summary">
          <n-space size="small" align="center">
            <n-icon>📚</n-icon>
            <n-text>{{ node.resources.length }} resource{{ node.resources.length > 1 ? 's' : '' }}</n-text>
            
            <!-- Quick Resource Type Preview -->
            <n-space size="small">
              <n-tag 
                v-for="resourceType in uniqueResourceTypes.slice(0, 3)" 
                :key="resourceType"
                size="small"
                :type="getResourceTypeColor(resourceType)"
              >
                {{ getResourceTypeIcon(resourceType) }} {{ resourceType }}
              </n-tag>
              <n-tag v-if="uniqueResourceTypes.length > 3" type="info" size="small">
                +{{ uniqueResourceTypes.length - 3 }} more
              </n-tag>
            </n-space>
          </n-space>
        </div>
        
        <!-- Deliverables Preview -->
        <div v-if="node.deliverables && node.deliverables.length > 0" class="deliverables-summary">
          <n-space size="small" align="center">
            <n-icon>🏆</n-icon>
            <n-text>{{ node.deliverables.length }} deliverable{{ node.deliverables.length > 1 ? 's' : '' }}</n-text>
          </n-space>
        </div>
      </n-space>
    </template>
    
    <template #action v-if="showActions">
      <n-space size="small">
        <n-button 
          type="primary" 
          size="small" 
          round
          @click.stop="$emit('view-details', node)"
        >
          View Details
        </n-button>
        
        <n-button 
          v-if="showProgressToggle"
          :type="isCompleted ? 'success' : 'default'"
          size="small"
          round
          @click.stop="$emit('toggle-completion', node.id)"
        >
          {{ isCompleted ? '✅ Done' : '⏳ Mark Done' }}
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag, NButton, NIcon, NSpace, NText } from 'naive-ui'
import { components } from '../design/tokens'

interface RoadmapNode {
  id: string
  title: string
  description?: string
  type: 'learn' | 'practice' | 'portfolio' | 'keyresource'
  estimatedHours?: number
  isOptional?: boolean
  checkpoint?: boolean
  resources?: Array<{
    title: string
    type: string
    url: string
    description?: string
    rationale?: string
  }>
  deliverables?: string[]
}

interface Props {
  node: RoadmapNode
  progress?: number
  isCompleted?: boolean
  showActions?: boolean
  showProgressToggle?: boolean
  variant?: 'default' | 'compact' | 'timeline'
}

const props = withDefaults(defineProps<Props>(), {
  progress: 0,
  isCompleted: false,
  showActions: true,
  showProgressToggle: true,
  variant: 'default'
})

defineEmits<{
  click: [node: RoadmapNode]
  'view-details': [node: RoadmapNode]
  'toggle-completion': [nodeId: string]
}>()

const cardClasses = computed(() => [
  'node-card',
  `node-card--${props.variant}`,
  `node-card--${props.node.type}`,
  {
    'node-card--completed': props.isCompleted,
    'node-card--in-progress': props.progress > 0 && props.progress < 100,
    'node-card--optional': props.node.isOptional,
    'node-card--checkpoint': props.node.checkpoint
  }
])

const nodeTypeColor = computed(() => {
  const typeMap: Record<string, any> = {
    'learn': 'info',
    'practice': 'warning',
    'portfolio': 'success',
    'keyresource': 'primary'
  }
  return typeMap[props.node.type] || 'default'
})

const nodeTypeIcon = computed(() => {
  return components.nodeTypes[props.node.type]?.icon || '📋'
})

const nodeTypeStyles = computed(() => {
  const typeConfig = components.nodeTypes[props.node.type]
  return typeConfig ? {
    color: typeConfig.color,
    backgroundColor: typeConfig.background,
    borderColor: typeConfig.border
  } : {}
})

const statusIcon = computed(() => {
  if (props.isCompleted) return '✅'
  if (props.progress > 0) return '⚙️'
  return '⏳'
})

const statusColor = computed(() => {
  if (props.isCompleted) return components.progress.completed.color
  if (props.progress > 0) return components.progress.inProgress.color
  return components.progress.notStarted.color
})

const statusTooltip = computed(() => {
  if (props.isCompleted) return 'Completed - Click to mark as incomplete'
  if (props.progress > 0) return 'In Progress - Click to mark as completed'
  return 'Not Started - Click to mark as completed'
})

const progressStyles = computed(() => ({
  '--progress': props.progress
}))

const uniqueResourceTypes = computed(() => {
  if (!props.node.resources) return []
  const types = [...new Set(props.node.resources.map(r => r.type))]
  return types
})

const getResourceTypeColor = (type: string) => {
  const typeMap: Record<string, any> = {
    'course': 'primary',
    'tutorial': 'info',
    'documentation': 'warning',
    'tool': 'success',
    'book': 'default',
    'guide': 'info'
  }
  return typeMap[type] || 'default'
}

const getResourceTypeIcon = (type: string) => {
  return components.resourceTypes[type as keyof typeof components.resourceTypes]?.icon || '🔗'
}
</script>

<style scoped>
.node-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  position: relative;
}

.node-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.node-card--learn {
  border-left-color: var(--color-primary-500, #3b82f6);
}

.node-card--practice {
  border-left-color: var(--color-warning-500, #f59e0b);
}

.node-card--portfolio {
  border-left-color: var(--color-success-500, #22c55e);
}

.node-card--keyresource {
  border-left-color: var(--color-primary-700, #1d4ed8);
}

.node-card--completed {
  background-color: rgba(34, 197, 94, 0.05);
  border-left-color: var(--color-success-500, #22c55e);
}

.node-card--in-progress {
  background-color: rgba(245, 158, 11, 0.05);
  border-left-color: var(--color-warning-500, #f59e0b);
}

.node-card--checkpoint {
  border: 2px solid var(--color-warning-300, #fcd34d);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(245, 158, 11, 0.1) 100%);
}

.node-card--optional {
  opacity: 0.8;
  border-style: dashed;
}

.node-card--compact {
  padding: 12px;
}

.node-card--timeline {
  margin-bottom: 16px;
  position: relative;
}

.node-card--timeline::before {
  content: '';
  position: absolute;
  left: -20px;
  top: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-gray-300, #d1d5db);
  transform: translateY(-50%);
}

.node-card--timeline.node-card--completed::before {
  background-color: var(--color-success-500, #22c55e);
}

.node-card--timeline.node-card--in-progress::before {
  background-color: var(--color-warning-500, #f59e0b);
}

.node-status-icon {
  cursor: pointer;
  transition: transform 0.2s ease;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-status-icon:hover {
  transform: scale(1.1);
  background-color: rgba(0, 0, 0, 0.05);
}

.progress-circle-mini {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    var(--color-success-500, #22c55e) 0deg,
    var(--color-success-500, #22c55e) calc(var(--progress) * 3.6deg),
    var(--color-gray-200, #e5e7eb) calc(var(--progress) * 3.6deg),
    var(--color-gray-200, #e5e7eb) 360deg
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-circle-mini::before {
  content: '';
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: white;
}

.progress-text {
  position: relative;
  font-size: 10px;
  font-weight: bold;
  color: var(--color-gray-700, #374151);
  z-index: 1;
}

.node-description {
  margin: 0;
  color: var(--color-gray-600, #4b5563);
  font-size: 0.9rem;
  line-height: 1.4;
}

.node-description-placeholder {
  margin: 0;
  color: var(--color-gray-400, #9ca3af);
  font-size: 0.9rem;
  font-style: italic;
}

.resource-summary, .deliverables-summary {
  padding: 8px 12px;
  background-color: var(--color-gray-50, #f9fafb);
  border-radius: 6px;
  border: 1px solid var(--color-gray-200, #e5e7eb);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .node-card {
    margin-bottom: 16px;
  }
  
  .progress-circle-mini {
    width: 32px;
    height: 32px;
  }
  
  .progress-circle-mini::before {
    width: 26px;
    height: 26px;
  }
  
  .progress-text {
    font-size: 8px;
  }
}
</style>
