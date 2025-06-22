<!-- IconLibrary.vue - Centralized Icon System -->
<template>
  <span 
    :class="iconClasses"
    :style="iconStyles"
    role="img"
    :aria-label="ariaLabel"
  >
    {{ iconContent }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  variant?: 'default' | 'outlined' | 'filled'
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'default'
})

// Icon registry with semantic names
const iconRegistry = {
  // Status icons
  'status-completed': '✅',
  'status-in-progress': '⚙️',
  'status-not-started': '⏳',
  'status-locked': '🔒',
  
  // Node type icons
  'node-learn': '📚',
  'node-practice': '💻',
  'node-portfolio': '🎯',
  'node-keyresource': '⭐',
  
  // Resource type icons
  'resource-course': '🎓',
  'resource-tutorial': '📖',
  'resource-documentation': '📝',
  'resource-tool': '🔧',
  'resource-book': '📚',
  'resource-guide': '📋',
  'resource-practice': '💻',
  'resource-project': '🎯',
  'resource-assessment': '📊',
  
  // Navigation icons
  'nav-search': '🔍',
  'nav-filter': '🏷️',
  'nav-clear': '✖️',
  'nav-expand': '▼',
  'nav-collapse': '▲',
  'nav-arrow-right': '→',
  'nav-arrow-left': '←',
  
  // Action icons
  'action-open': '🔗',
  'action-edit': '✏️',
  'action-delete': '🗑️',
  'action-save': '💾',
  'action-download': '⬇️',
  'action-upload': '⬆️',
  'action-share': '📤',
  'action-copy': '📋',
  
  // Content icons
  'content-deliverable': '🏆',
  'content-resource': '📚',
  'content-checkpoint': '🏁',
  'content-optional': '❓',
  'content-prerequisite': '⚠️',
  'content-skill': '🎯',
  
  // Phase icons
  'phase-foundations': '🏗️',
  'phase-intermediate': '⚡',
  'phase-advanced': '🚀',
  'phase-specialization': '🎓',
  
  // Feedback icons
  'feedback-content': '📝',
  'feedback-ui': '🎨',
  'feedback-feature': '🚀',
  'feedback-bug': '🐛',
  
  // General purpose
  'info': 'ℹ️',
  'warning': '⚠️',
  'error': '❌',
  'success': '✅',
  'star': '⭐',
  'heart': '❤️',
  'thumbs-up': '👍',
  'thumbs-down': '👎',
  'lightbulb': '💡',
  'rocket': '🚀',
  'target': '🎯',
  'calendar': '📅',
  'clock': '🕒',
  'timer': '⏱️',
  'trophy': '🏆',
  'medal': '🏅',
  'crown': '👑',
  'diamond': '💎',
  'gem': '💎',
  'fire': '🔥',
  'lightning': '⚡',
  'magic': '✨',
  'sparkles': '✨'
} as const

type IconName = keyof typeof iconRegistry

const iconContent = computed(() => {
  const iconName = props.name as IconName
  return iconRegistry[iconName] || props.name
})

const iconClasses = computed(() => [
  'ds-icon',
  `ds-icon--${props.size}`,
  `ds-icon--${props.variant}`
])

const iconStyles = computed(() => ({
  color: props.color || 'currentColor'
}))

const ariaLabel = computed(() => {
  return props.ariaLabel || `${props.name} icon`
})
</script>

<style scoped>
.ds-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  flex-shrink: 0;
}

.ds-icon--xs {
  font-size: var(--font-size-xs);
  width: 12px;
  height: 12px;
}

.ds-icon--sm {
  font-size: var(--font-size-sm);
  width: 16px;
  height: 16px;
}

.ds-icon--md {
  font-size: var(--font-size-base);
  width: 20px;
  height: 20px;
}

.ds-icon--lg {
  font-size: var(--font-size-lg);
  width: 24px;
  height: 24px;
}

.ds-icon--xl {
  font-size: var(--font-size-xl);
  width: 32px;
  height: 32px;
}

.ds-icon--outlined {
  filter: contrast(1.2);
}

.ds-icon--filled {
  filter: saturate(1.2);
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .ds-icon {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .ds-icon {
    filter: contrast(2);
  }
}
</style>
