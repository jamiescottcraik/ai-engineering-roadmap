'use client';

import { motion } from 'framer-motion';
import React from 'react';

import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  enableShine?: boolean;
  variant?: 'default' | 'nav' | 'card' | 'island';
}

export function GlassCard({
  children,
  className,
  delay = 0,
  enableShine = true,
  variant = 'default',
}: GlassCardProps) {
  const variantStyles = {
    default: 'glass-card',
    nav: 'glass-nav',
    card: 'glass-card-enhanced',
    island: 'dynamic-island',
  };

  return (
    <motion.div
      className={cn(variantStyles[variant], className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      whileHover={{
        y: variant === 'nav' ? 0 : -4,
        transition: { duration: 0.2 },
      }}
    >
      {/* Gradient border effect like iOS */}
      <div className="gradient-border" />

      {/* Content */}
      <div className="card-content">{children}</div>

      {/* Shine effect on hover */}
      {enableShine && (
        <motion.div
          className="shine-effect"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.div>
  );
}

interface LearningNodeProps {
  node: {
    id: string;
    title: string;
    icon: React.ReactNode;
    progress: number;
    phase: number;
    status: 'locked' | 'available' | 'in-progress' | 'completed';
  };
  index: number;
}

export function LearningNode({ node, index }: LearningNodeProps) {
  return (
    <motion.div
      className="node-card"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Colored gradient frame */}
      <div className={cn('node-frame', `phase-${node.phase}`)}>
        <div className="node-glow" />
      </div>

      {/* Glass content */}
      <div className="node-content">
        <motion.div
          className="node-icon"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          {node.icon}
        </motion.div>

        <h3 className="node-title">{node.title}</h3>

        {/* Progress with shimmer */}
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${node.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <div className="shimmer" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

interface GlassNavigationProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassNavigation({ children, className }: GlassNavigationProps) {
  return (
    <motion.nav
      className={cn('nav-container', className)}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      {/* Glass effect background */}
      <div className="nav-glass" />
      <div className="nav-content">{children}</div>
    </motion.nav>
  );
}
