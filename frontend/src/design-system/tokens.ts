/**
 * Design System Tokens for AI Engineering Roadmap
 * Implements semantic color meanings and consistent iconography
 * Referenced in feature_plan.md section 2.1
 */

// Color Palette with Semantic Meaning
export const colorTokens = {
  // Learning Content Types
  theoretical: {
    primary: '#2563EB', // Blue: Theoretical content
    light: '#DBEAFE',
    dark: '#1D4ED8'
  },
  practical: {
    primary: '#16A34A', // Green: Practical exercises  
    light: '#DCFCE7',
    dark: '#15803D'
  },
  portfolio: {
    primary: '#EA580C', // Orange: Projects/portfolios
    light: '#FED7AA',
    dark: '#C2410C'
  },
  completed: {
    primary: '#6B7280', // Gray: Completed items
    light: '#F3F4F6',
    dark: '#374151'
  },
  prerequisite: {
    primary: '#DC2626', // Red: Prerequisites missing
    light: '#FEE2E2',
    dark: '#B91C1C'
  },
  
  // Phase Colors (from current roadmap.json)
  phase1: '#1f4e79',
  phase2: '#4b8a36', 
  phase3: '#843c0c',
  phase4: '#7030a0',
  
  // UI States
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Neutral Colors
  background: '#FFFFFF',
  surface: '#F9FAFB',
  border: '#E5E7EB',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF'
  }
} as const

// Standardized Iconography System
export const iconMap = {
  // Content Types
  course: '🎓',
  tutorial: '📖', 
  practice: '💻',
  project: '🎯',
  assessment: '📊',
  tool: '🔧',
  book: '📚',
  documentation: '📝',
  guide: '📄',
  
  // Learning Node Types
  learn: '📚',
  portfolio: '🎯',
  keyresource: '⭐',
  
  // Status Indicators
  completed: '✅',
  inProgress: '⚙️',
  notStarted: '⏳',
  locked: '🔒',
  checkpoint: '🏁',
  optional: '🔸',
  
  // Navigation & Actions
  search: '🔍',
  filter: '🔽',
  expand: '📂',
  collapse: '📁',
  info: '💡',
  help: '❓',
  settings: '⚙️',
  
  // Phases
  foundation: '1️⃣',
  production: '2️⃣', 
  architecture: '3️⃣',
  leadership: '4️⃣'
} as const

// Typography Hierarchy
export const typography = {
  hero: {
    fontSize: '2.5rem',
    fontWeight: '700',
    lineHeight: '1.2'
  },
  h1: {
    fontSize: '2rem',
    fontWeight: '600',
    lineHeight: '1.3'
  },
  h2: {
    fontSize: '1.5rem',
    fontWeight: '600', 
    lineHeight: '1.4'
  },
  h3: {
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  body: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.6'
  },
  caption: {
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.5'
  },
  small: {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.4'
  }
} as const

// Spacing System (8px grid)
export const spacing = {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px  
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem'   // 96px
} as const

// Layout Grid System
export const layout = {
  container: {
    maxWidth: '1200px',
    padding: '0 20px'
  },
  grid: {
    columns: 12,
    gap: '1rem'
  },
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px'
  }
} as const

// Animation & Transition Tokens
export const animation = {
  duration: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.6s'
  },
  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
} as const

// Shadow System
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
} as const

// Border Radius System
export const borderRadius = {
  none: '0',
  sm: '0.125rem',
  md: '0.375rem', 
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px'
} as const

export default {
  colorTokens,
  iconMap,
  typography,
  spacing,
  layout,
  animation,
  shadows,
  borderRadius
}
