/**
 * Design System Composables
 * Provides consistent access to design tokens and utility functions
 */

import { computed } from 'vue'
import { colorTokens, iconMap } from './tokens'

/**
 * Get color for node/resource types with semantic meaning
 */
export function useNodeTypeColor() {
  const getNodeTypeColor = (type: string): string => {
    const colorMap: Record<string, string> = {
      'learn': colorTokens.theoretical.primary,
      'practice': colorTokens.practical.primary, 
      'portfolio': colorTokens.portfolio.primary,
      'keyresource': colorTokens.info,
      'course': colorTokens.theoretical.primary,
      'tutorial': colorTokens.info,
      'documentation': colorTokens.warning,
      'tool': colorTokens.practical.primary,
      'book': colorTokens.theoretical.primary,
      'guide': colorTokens.info
    }
    return colorMap[type] || colorTokens.text.secondary
  }

  const getNodeTypeClass = (type: string): string => {
    const classMap: Record<string, string> = {
      'learn': 'node-type-theoretical',
      'practice': 'node-type-practical',
      'portfolio': 'node-type-portfolio',
      'keyresource': 'node-type-key'
    }
    return classMap[type] || 'node-type-default'
  }

  return {
    getNodeTypeColor,
    getNodeTypeClass
  }
}

/**
 * Get semantic icons with fallbacks
 */
export function useSemanticIcons() {
  const getNodeIcon = (type: string): string => {
    return iconMap[type as keyof typeof iconMap] || iconMap.course
  }

  const getResourceIcon = (type: string): string => {
    const resourceIconMap: Record<string, string> = {
      'course': iconMap.course,
      'tutorial': iconMap.tutorial,
      'documentation': iconMap.documentation,
      'tool': iconMap.tool,
      'book': iconMap.book,
      'guide': iconMap.guide
    }
    return resourceIconMap[type] || iconMap.course
  }

  const getStatusIcon = (status: 'completed' | 'in_progress' | 'not_started' | 'locked'): string => {
    const statusIconMap: Record<string, string> = {
      'completed': iconMap.completed,
      'in_progress': iconMap.inProgress,
      'not_started': iconMap.notStarted,
      'locked': iconMap.locked
    }
    return statusIconMap[status] || iconMap.notStarted
  }

  return {
    getNodeIcon,
    getResourceIcon, 
    getStatusIcon
  }
}

/**
 * Progress state management with semantic colors
 */
export function useProgressState() {
  const getProgressColor = (progress: number): string => {
    if (progress === 100) return colorTokens.completed.primary
    if (progress > 0) return colorTokens.practical.primary
    return colorTokens.text.tertiary
  }

  const getProgressStatus = (progress: number): 'completed' | 'in_progress' | 'not_started' => {
    if (progress === 100) return 'completed'
    if (progress > 0) return 'in_progress'
    return 'not_started'
  }

  const getProgressDescription = (progress: number): string => {
    if (progress === 100) return 'Completed'
    if (progress > 50) return 'Nearly Done'
    if (progress > 0) return 'In Progress'
    return 'Not Started'
  }

  return {
    getProgressColor,
    getProgressStatus,
    getProgressDescription
  }
}

/**
 * Phase-specific styling
 */
export function usePhaseStyles() {
  const getPhaseColor = (phaseId: string): string => {
    const phaseColorMap: Record<string, string> = {
      'phase1': colorTokens.phase1,
      'phase2': colorTokens.phase2,
      'phase3': colorTokens.phase3,
      'phase4': colorTokens.phase4
    }
    return phaseColorMap[phaseId] || colorTokens.text.secondary
  }

  const getPhaseIcon = (phaseIndex: number): string => {
    const phaseIcons = [
      iconMap.foundation,
      iconMap.production,
      iconMap.architecture,
      iconMap.leadership
    ]
    return phaseIcons[phaseIndex] || iconMap.foundation
  }

  return {
    getPhaseColor,
    getPhaseIcon
  }
}

/**
 * Accessibility and contrast utilities
 */
export function useAccessibility() {
  const getContrastText = (backgroundColor: string): string => {
    // Simple contrast calculation - in production would use more sophisticated method
    const darkColors = [
      '#1f4e79', // phase1
      '#843c0c', // phase3
      '#1D4ED8', // theoretical.dark
      '#15803D', // practical.dark 
      '#C2410C'  // portfolio.dark
    ]
    
    return darkColors.includes(backgroundColor) 
      ? '#FFFFFF' 
      : colorTokens.text.primary
  }

  const getAriaLabel = (nodeType: string, title: string, progress: number): string => {
    const typeLabel = nodeType === 'learn' ? 'Learning module' :
                     nodeType === 'practice' ? 'Practice exercise' :
                     nodeType === 'portfolio' ? 'Portfolio project' : 'Resource'
    
    const progressLabel = progress === 100 ? 'Completed' :
                         progress > 0 ? `${progress} percent complete` :
                         'Not started'
    
    return `${typeLabel}: ${title}. ${progressLabel}.`
  }

  return {
    getContrastText,
    getAriaLabel
  }
}

/**
 * Responsive design utilities
 */
export function useResponsive() {
  const isMobile = computed(() => window.innerWidth < 768)
  const isTablet = computed(() => window.innerWidth >= 768 && window.innerWidth < 1024)
  const isDesktop = computed(() => window.innerWidth >= 1024)

  const getResponsiveColumns = (): number => {
    if (window.innerWidth < 768) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  return {
    isMobile,
    isTablet, 
    isDesktop,
    getResponsiveColumns
  }
}

export default {
  useNodeTypeColor,
  useSemanticIcons,
  useProgressState,
  usePhaseStyles,
  useAccessibility,
  useResponsive
}
