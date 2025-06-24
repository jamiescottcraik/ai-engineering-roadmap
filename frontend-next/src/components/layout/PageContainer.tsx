/**
 * Page Container Component - Modular Layout Architecture
 *
 * Central container component with:
 * - Responsive max-width handling
 * - Generous whitespace for cognitive ergonomics
 * - Glass morphism background effects
 * - Type-safe props with React.FC
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | '8xl';
  className?: string;
  enableMotion?: boolean;
  paddingY?: 'sm' | 'md' | 'lg' | 'xl';
  background?: 'default' | 'glass' | 'grid' | 'none';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  '8xl': 'max-w-8xl',
};

const paddingClasses = {
  sm: 'py-4',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16',
};

const backgroundClasses = {
  default: '',
  glass: 'glass-card',
  grid: 'bg-grid-pattern',
  none: '',
};

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  maxWidth = '8xl',
  className = '',
  enableMotion = true,
  paddingY = 'lg',
  background = 'default',
}) => {
  const containerClasses = `
    ${maxWidthClasses[maxWidth]}
    mx-auto
    px-6
    ${paddingClasses[paddingY]}
    ${backgroundClasses[background]}
    ${className}
  `.trim();

  if (enableMotion) {
    return (
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={containerClasses}
        role="main"
      >
        {children}
      </motion.main>
    );
  }

  return (
    <main className={containerClasses} role="main">
      {children}
    </main>
  );
};
