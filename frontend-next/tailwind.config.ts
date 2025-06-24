import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'
import typographyPlugin from '@tailwindcss/typography'

/**
 * Tailwind CSS Configuration for AI Engineering Roadmap
 *
 * Implements cognitive-adaptive UI patterns with:
 * - Semantic color tokens for learning psychology
 * - Accessible dark/light/high-contrast modes
 * - Generous whitespace and rhythm patterns
 * - Apple-inspired spatial design ergonomics
 */

// Cognitive Color System - Learning Psychology Informed
const cognitiveColors = {
  // Learning State Colors - Primary signals
  mastered: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',  // Green = completed/mastered
    600: '#16a34a',
    900: '#14532d'
  },
  progress: {
    50: '#fefce8',
    100: '#fef3c7',
    500: '#eab308',  // Yellow = in progress
    600: '#ca8a04',
    900: '#713f12'
  },
  review: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',  // Red/Orange = needs review/urgent
    600: '#dc2626',
    900: '#7f1d1d'
  },
  focus: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Blue = focus/primary actions
    600: '#2563eb',
    900: '#1e3a8a'
  },
  // Cognitive Load Minimizers - Neutral background system
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  }
}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Cognitive Color Palette
      colors: {
        ...cognitiveColors,
        // Semantic aliases for component usage
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: {
          DEFAULT: 'var(--color-focus-primary, #3b82f6)',
          50: 'var(--color-focus-50, #eff6ff)',
          500: 'var(--color-focus-500, #3b82f6)',
          600: 'var(--color-focus-600, #2563eb)',
        },
        // Learning state semantic colors
        'learning-mastered': 'var(--color-mastered, #22c55e)',
        'learning-progress': 'var(--color-progress, #eab308)',
        'learning-review': 'var(--color-review, #ef4444)',
      },

      // Typography Scale - Consistent Rhythm
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },

      // Generous Spacing Scale - Cognitive Ergonomics
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      // Container sizes for responsive design
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // Animation system for micro-interactions
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'learning-pulse': 'learningPulse 2s ease-in-out infinite',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        learningPulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)'
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.02)'
          },
        }
      },

      // Backdrop blur for glass morphism effects
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    // Cognitive Design System Plugin
    plugin(function({ addUtilities, addComponents, theme }) {
      // Learning State Utilities
      addUtilities({
        '.learning-mastered': {
          backgroundColor: theme('colors.mastered.500'),
          color: theme('colors.neutral.0'),
        },
        '.learning-progress': {
          backgroundColor: theme('colors.progress.500'),
          color: theme('colors.neutral.900'),
        },
        '.learning-review': {
          backgroundColor: theme('colors.review.500'),
          color: theme('colors.neutral.0'),
        },
        '.glass-morphism': {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-morphism-dark': {
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      })

      // Cognitive UI Components
      addComponents({
        '.cognitive-card': {
          backgroundColor: theme('colors.neutral.0'),
          borderRadius: theme('borderRadius.2xl'),
          padding: theme('spacing.8'),
          boxShadow: theme('boxShadow.xl'),
          border: `1px solid ${theme('colors.neutral.200')}`,
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: theme('boxShadow.2xl'),
            transform: 'translateY(-2px)',
          }
        },
        '.cognitive-card-dark': {
          backgroundColor: theme('colors.neutral.800'),
          borderColor: theme('colors.neutral.700'),
        },
        '.cognitive-button': {
          padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.semibold'),
          fontSize: theme('fontSize.sm[0]'),
          transition: 'all 0.2s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: theme('spacing.3'),
        }
      })
    }),

    // Typography Plugin for markdown content
    typographyPlugin({
      className: 'prose-cognitive',
    }),
  ],
}

export default config
