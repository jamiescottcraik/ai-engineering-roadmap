/**
 * Design Tokens for AI Engineering Roadmap
 * Centralized design system tokens for consistent styling
 */

// Color Palette
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  
  // Success/Completion Colors  
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0', 
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  
  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d', 
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  
  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  },
  
  // Semantic Colors
  semantic: {
    info: '#3b82f6',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#ffffff',
    surface: '#f9fafb',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb'
  }
} as const

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
    mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace']
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },
  
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75'
  }
} as const

// Spacing Scale
export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
} as const

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',  // 2px
  base: '0.25rem', // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  '2xl': '1rem',   // 16px
  '3xl': '1.5rem', // 24px
  full: '9999px'
} as const

// Shadows
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090
} as const

// Animation/Transition
export const transitions = {
  duration: {
    fast: '150ms',
    normal: '300ms', 
    slow: '500ms'
  },
  timing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out'
  }
} as const

// Component-specific tokens
export const components = {
  // Node Type Colors
  nodeTypes: {
    learn: {
      color: colors.primary[500],
      background: colors.primary[50],
      border: colors.primary[200],
      icon: '📚'
    },
    practice: {
      color: colors.warning[600],
      background: colors.warning[50],
      border: colors.warning[200],
      icon: '💻'
    },
    portfolio: {
      color: colors.success[600],
      background: colors.success[50],
      border: colors.success[200],
      icon: '🎯'
    },
    keyresource: {
      color: colors.primary[700],
      background: colors.primary[100],
      border: colors.primary[300],
      icon: '⭐'
    }
  },
  
  // Resource Type Colors  
  resourceTypes: {
    course: {
      color: colors.primary[600],
      icon: '🎓'
    },
    tutorial: {
      color: colors.primary[500],
      icon: '📖'
    },
    documentation: {
      color: colors.warning[600],
      icon: '📝'
    },
    tool: {
      color: colors.success[600],
      icon: '🔧'
    },
    book: {
      color: colors.gray[700],
      icon: '📚'
    },
    guide: {
      color: colors.primary[500],
      icon: '📋'
    }
  },
  
  // Progress Indicators
  progress: {
    notStarted: {
      color: colors.gray[400],
      background: colors.gray[100],
      icon: '⏳'
    },
    inProgress: {
      color: colors.warning[500],
      background: colors.warning[100],
      icon: '⚙️'
    },
    completed: {
      color: colors.success[500],
      background: colors.success[100],
      icon: '✅'
    }
  }
} as const

// Utility function to create CSS variables
export const createCSSVariables = () => {
  const variables: Record<string, string> = {}
  
  // Add color variables
  Object.entries(colors).forEach(([category, shades]) => {
    if (typeof shades === 'object') {
      Object.entries(shades).forEach(([shade, value]) => {
        variables[`--color-${category}-${shade}`] = value
      })
    }
  })
  
  // Add spacing variables
  Object.entries(spacing).forEach(([key, value]) => {
    variables[`--spacing-${key}`] = value
  })
  
  // Add typography variables
  variables['--font-family-sans'] = typography.fontFamily.sans.join(', ')
  variables['--font-family-mono'] = typography.fontFamily.mono.join(', ')
  
  Object.entries(typography.fontSize).forEach(([key, value]) => {
    variables[`--font-size-${key}`] = value
  })
  
  return variables
}

export type Colors = typeof colors
export type Typography = typeof typography
export type Spacing = typeof spacing
export type Components = typeof components
