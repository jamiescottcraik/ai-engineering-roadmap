<!-- ResourceCard.vue - Reusable Resource Card Component -->
<template>
  <n-card 
    :title="resource.title"
    :class="cardClasses"
    hoverable
    embedded
    @click="$emit('click', resource)"
    style="cursor: pointer;"
  >
    <template #header-extra>
      <n-space size="small">
        <n-tag 
          :type="resourceTypeColor" 
          size="small"
          :style="resourceTypeStyles"
        >
          {{ resourceTypeIcon }} {{ resource.type }}
        </n-tag>
        <n-tag 
          v-if="resource.difficulty" 
          :type="difficultyColor"
          size="small"
        >
          {{ resource.difficulty }}
        </n-tag>
        <n-tag 
          v-if="resource.estimatedTime" 
          type="info" 
          size="small"
        >
          {{ formattedTime }}
        </n-tag>
      </n-space>
    </template>
    
    <template #default>
      <n-space vertical size="small">
        <p v-if="resource.description" class="resource-description">
          {{ resource.description }}
        </p>
        <n-alert 
          v-if="resource.rationale" 
          type="info" 
          :show-icon="false"
          size="small"
          class="resource-rationale"
        >
          <template #header>
            💡 Why This Matters
          </template>
          {{ resource.rationale }}
        </n-alert>
        
        <!-- Prerequisites if any -->
        <div v-if="resource.prerequisites && resource.prerequisites.length > 0" class="prerequisites">
          <n-text strong>Prerequisites:</n-text>
          <n-space size="small" style="margin-top: 4px;">
            <n-tag 
              v-for="prereq in resource.prerequisites" 
              :key="prereq"
              size="small"
              type="warning"
            >
              {{ prereq }}
            </n-tag>
          </n-space>
        </div>
        
        <!-- Skills gained -->
        <div v-if="resource.skills && resource.skills.length > 0" class="skills">
          <n-text strong>Skills Gained:</n-text>
          <n-space size="small" style="margin-top: 4px;">
            <n-tag 
              v-for="skill in resource.skills" 
              :key="skill"
              size="small"
              type="success"
            >
              {{ skill }}
            </n-tag>
          </n-space>
        </div>
      </n-space>
    </template>
    
    <template #action>
      <div class="resource-actions">
        <n-button 
          type="primary" 
          size="small" 
          round
          :title="`Open resource: ${resource.title}`"
          :aria-label="`Open resource: ${resource.title}`"
          @click.stop="$emit('open', resource)"
        >
          <template #icon>
            <n-icon>🔗</n-icon>
          </template>
          Open Resource
        </n-button>
        
        <n-button 
          v-if="showProgressToggle"
          :type="isCompleted ? 'success' : 'default'"
          size="small"
          round
          @click.stop="$emit('toggle-completion', resource)"
          :title="isCompleted ? 'Mark as incomplete' : 'Mark as completed'"
        >
          <template #icon>
            <n-icon>{{ isCompleted ? '✅' : '⏳' }}</n-icon>
          </template>
          {{ isCompleted ? 'Completed' : 'Mark Done' }}
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NTag, NButton, NIcon, NAlert, NSpace, NText } from 'naive-ui'
import { components } from '../design/tokens'

interface LearningResource {
  id?: string
  title: string
  description?: string
  type: 'course' | 'tutorial' | 'practice' | 'project' | 'assessment' | 'documentation' | 'tool' | 'book' | 'guide'
  url: string
  estimatedTime?: number // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  prerequisites?: string[]
  skills?: string[]
  rationale?: string
}

interface Props {
  resource: LearningResource
  isCompleted?: boolean
  showProgressToggle?: boolean
  variant?: 'default' | 'compact' | 'featured'
}

const props = withDefaults(defineProps<Props>(), {
  isCompleted: false,
  showProgressToggle: true,
  variant: 'default'
})

defineEmits<{
  click: [resource: LearningResource]
  open: [resource: LearningResource]
  'toggle-completion': [resource: LearningResource]
}>()

const cardClasses = computed(() => [
  'resource-card',
  `resource-card--${props.variant}`,
  `resource-card--${props.resource.type}`,
  {
    'resource-card--completed': props.isCompleted
  }
])

const resourceTypeColor = computed(() => {
  const typeMap: Record<string, any> = {
    'course': 'primary',
    'tutorial': 'info',
    'documentation': 'warning',
    'tool': 'success',
    'book': 'default',
    'guide': 'info',
    'practice': 'warning',
    'project': 'success',
    'assessment': 'error'
  }
  return typeMap[props.resource.type] || 'default'
})

const resourceTypeIcon = computed(() => {
  return components.resourceTypes[props.resource.type as keyof typeof components.resourceTypes]?.icon || '🔗'
})

const resourceTypeStyles = computed(() => {
  const typeConfig = components.resourceTypes[props.resource.type as keyof typeof components.resourceTypes]
  return typeConfig ? {
    color: typeConfig.color,
    borderColor: typeConfig.color + '40'
  } : {}
})

const difficultyColor = computed(() => {
  const difficultyMap: Record<string, any> = {
    'beginner': 'success',
    'intermediate': 'warning', 
    'advanced': 'error'
  }
  return difficultyMap[props.resource.difficulty || 'beginner']
})

const formattedTime = computed(() => {
  if (!props.resource.estimatedTime) return ''
  const hours = Math.floor(props.resource.estimatedTime / 60)
  const minutes = props.resource.estimatedTime % 60
  
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
  }
  return `${minutes}m`
})
</script>

<style scoped>
.resource-card {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.resource-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resource-card--learn {
  border-left-color: var(--color-primary-500, #3b82f6);
}

.resource-card--practice {
  border-left-color: var(--color-warning-500, #f59e0b);
}

.resource-card--course {
  border-left-color: var(--color-primary-600, #2563eb);
}

.resource-card--tutorial {
  border-left-color: var(--color-primary-500, #3b82f6);
}

.resource-card--documentation {
  border-left-color: var(--color-warning-600, #d97706);
}

.resource-card--tool {
  border-left-color: var(--color-success-600, #16a34a);
}

.resource-card--completed {
  background-color: rgba(34, 197, 94, 0.05);
  border-left-color: var(--color-success-500, #22c55e);
}

.resource-card--compact {
  padding: 12px;
}

.resource-card--featured {
  border: 2px solid var(--color-primary-200, #bfdbfe);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(59, 130, 246, 0.1) 100%);
}

.resource-description {
  margin: 0;
  color: var(--color-gray-600, #4b5563);
  font-size: 0.9rem;
  line-height: 1.4;
}

.resource-rationale {
  margin-top: 8px;
}

.prerequisites, .skills {
  margin-top: 8px;
}

.resource-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .resource-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .resource-actions > * {
    width: 100%;
  }
}
</style>
