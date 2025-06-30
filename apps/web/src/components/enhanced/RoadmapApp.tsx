'use client';

import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';

import { GlassCard } from '@/components/enhanced/GlassComponents';

interface RoadmapAppProps {
  children: React.ReactNode;
}

export default function RoadmapApp({ children }: RoadmapAppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  return <div className="container relative min-h-screen">{children}</div>;
}

// Enhanced Hero Section with glass effect
interface HeroSectionProps {
  title: string;
  subtitle: string;
  logo?: React.ReactNode;
}

export function HeroSection({ title, subtitle, logo }: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative mb-16 text-center"
    >
      {logo && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-8 flex justify-center"
        >
          {logo}
        </motion.div>
      )}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-6xl font-extrabold text-transparent"
      >
        {title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mx-auto max-w-4xl px-4 text-xl leading-relaxed text-gray-600 dark:text-gray-300"
      >
        {subtitle}
      </motion.p>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mx-auto mt-8 h-px max-w-2xl bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"
      />
    </motion.section>
  );
}

// Progress Cards with enhanced glass effect
interface ProgressCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

interface ProgressCardsProps {
  cards: ProgressCard[];
}

export function ProgressCards({ cards }: ProgressCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <GlassCard key={card.title} delay={index * 0.1} variant="card">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                {card.title}
              </p>
              <p className="text-3xl font-bold text-foreground">{card.value}</p>
            </div>
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
              style={{ backgroundColor: card.color }}
            >
              {card.icon}
            </div>
          </div>

          {card.progress !== undefined && (
            <div className="mt-6 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${card.progress}%` }}
                transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                className="h-3 rounded-full shadow-sm"
                style={{ backgroundColor: card.color }}
              />
            </div>
          )}

          <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {card.description}
          </p>
        </GlassCard>
      ))}
    </div>
  );
}

// Enhanced Learning Node with iPhone-style depth
interface LearningNode {
  id: string;
  title: string;
  phase: number;
  progress: number;
  icon: React.ReactNode;
  status: 'completed' | 'in-progress' | 'planned';
}

interface LearningNodeCardProps {
  node: LearningNode;
  index: number;
}

export function LearningNodeCard({ node, index }: LearningNodeCardProps) {
  const phaseColors = {
    1: 'from-blue-400 to-blue-600',
    2: 'from-green-400 to-green-600',
    3: 'from-purple-400 to-purple-600',
    4: 'from-orange-400 to-orange-600',
    5: 'from-pink-400 to-pink-600',
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlassCard variant="card" enableShine>
        {/* Colored gradient frame */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${phaseColors[node.phase as keyof typeof phaseColors]} opacity-10`}
        >
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent" />
        </div>

        {/* Glass content */}
        <div className="relative z-10">
          <motion.div
            className="mb-4 flex justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <div className="rounded-xl bg-white/20 p-3 text-2xl">{node.icon}</div>
          </motion.div>

          <h3 className="mb-4 text-center text-lg font-bold text-foreground">{node.title}</h3>

          {/* Progress with shimmer */}
          <div className="relative h-2 rounded-full bg-neutral-200 dark:bg-neutral-700">
            <motion.div
              className="relative h-2 overflow-hidden rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${node.progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </motion.div>
          </div>

          <p className="mt-2 text-center text-sm text-neutral-500 dark:text-neutral-400">
            {node.progress}% complete
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}
