'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Code,
  Play,
  Target,
  TrendingUp,
} from 'lucide-react';
import React, { useState } from 'react';

import { GlassCard, GlassNavigation } from '@/components/enhanced/GlassComponents';
import { useCognitiveTheme } from '@/lib/theme';

import { Footer, HeaderNav, PageContainer } from './layout';
import { LearningKanban } from './learning/LearningKanban';
import { Badge } from './ui/badge';

/**
 * Main Learning Dashboard - Cognitive-Adaptive Interface
 *
 * Refactored for Phase 4.5 UI Modernization:
 * - Uses semantic theme tokens instead of hardcoded colors
 * - Fixes object literal rendering issues
 * - Implements modular layout architecture
 * - TypeScript strict typing throughout
 * - Accessibility-compliant design patterns
 */

interface LearningStats {
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  weeklyGoal: number;
  weeklyProgress: number;
  nextReview?: Date;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  colorClass: string;
  action: () => void;
}

export function LearningDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'kanban' | 'analytics'>('overview');
  const { getLearningStateColor } = useCognitiveTheme();

  const [stats] = useState<LearningStats>({
    totalLessons: 47,
    completedLessons: 12,
    currentStreak: 5,
    weeklyGoal: 3,
    weeklyProgress: 2,
    nextReview: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
  });

  // Quick actions with proper string-based styling
  const quickActions: QuickAction[] = [
    {
      id: 'continue-learning',
      title: 'Continue Learning',
      description: 'Resume your current AI engineering path',
      icon: <Play className="h-5 w-5" />,
      colorClass: 'bg-focus-500 hover:bg-focus-600',
      action: () => setActiveView('kanban'),
    },
    {
      id: 'practice-coding',
      title: 'Practice Coding',
      description: 'Work on hands-on coding exercises',
      icon: <Code className="h-5 w-5" />,
      colorClass: 'bg-learning-mastered hover:opacity-90',
      action: () => setActiveView('kanban'),
    },
    {
      id: 'review-concepts',
      title: 'Review Concepts',
      description: 'Spaced repetition review session',
      icon: <Brain className="h-5 w-5" />,
      colorClass: 'bg-purple-500 hover:bg-purple-600',
      action: () => setActiveView('analytics'),
    },
    {
      id: 'interactive-roadmap',
      title: 'Interactive Roadmap',
      description: 'Explore your learning path in browser-like interface',
      icon: <Target className="h-5 w-5" />,
      colorClass: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => window.open('/roadmap', '_blank'),
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Track your learning progress',
      icon: <TrendingUp className="h-5 w-5" />,
      colorClass: 'bg-learning-progress hover:opacity-90',
      action: () => setActiveView('analytics'),
    },
  ];

  const progressPercentage = (stats.completedLessons / stats.totalLessons) * 100;
  const weeklyProgressPercentage = (stats.weeklyProgress / stats.weeklyGoal) * 100;

  // Explicit color values for dynamic styling
  const focusColor = getLearningStateColor('focus');
  const masteredColor = getLearningStateColor('mastered');

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <HeaderNav />

      <PageContainer maxWidth="8xl" className="flex-1">
        {/* Navigation Tabs */}
        <GlassNavigation className="mb-8">
          <div className="flex space-x-2 p-2">
            {[
              { key: 'overview', label: 'Overview', icon: <Target className="h-5 w-5" /> },
              { key: 'kanban', label: 'Learning Board', icon: <BookOpen className="h-5 w-5" /> },
              { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-5 w-5" /> },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key as 'overview' | 'kanban' | 'analytics')}
                className={`
                  cognitive-button flex items-center space-x-3 rounded-lg px-6 py-3 transition-all duration-300
                  ${
                    activeView === tab.key
                      ? 'scale-105 bg-focus-500 text-white shadow-lg'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-foreground dark:text-neutral-400 dark:hover:bg-neutral-800'
                  }
                `}
                aria-pressed={activeView === tab.key}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </GlassNavigation>

        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                <GlassCard delay={0.1} variant="card">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                        Overall Progress
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stats.completedLessons}/{stats.totalLessons}
                      </p>
                    </div>
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                      style={{ backgroundColor: focusColor }}
                    >
                      <Target className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="mt-6 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ delay: 0.5, duration: 1 }}
                      className="h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: focusColor }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {progressPercentage.toFixed(1)}% complete
                  </p>
                </GlassCard>

                <GlassCard delay={0.2} variant="card">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                        Current Streak
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stats.currentStreak} days
                      </p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
                      <Calendar className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <Badge
                    variant={stats.currentStreak >= 7 ? 'default' : 'secondary'}
                    className="mt-2 px-3 py-1"
                  >
                    {stats.currentStreak >= 7 ? 'On fire! 🔥' : 'Keep going!'}
                  </Badge>
                </GlassCard>

                <GlassCard delay={0.3} variant="card">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                        Weekly Goal
                      </p>
                      <p className="text-3xl font-bold text-foreground">
                        {stats.weeklyProgress}/{stats.weeklyGoal}
                      </p>
                    </div>
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                      style={{ backgroundColor: masteredColor }}
                    >
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="mt-6 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${weeklyProgressPercentage}%` }}
                      transition={{ delay: 0.7, duration: 1 }}
                      className="h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: masteredColor }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    {Math.round(weeklyProgressPercentage)}% of weekly goal
                  </p>
                </GlassCard>

                <GlassCard delay={0.4} variant="card">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <p className="mb-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                        Next Review
                      </p>
                      <p className="text-lg font-bold text-foreground">
                        {stats.nextReview
                          ? new Date(stats.nextReview).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'None scheduled'}
                      </p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-lg">
                      <Brain className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="mt-2 border-purple-200 px-3 py-1 text-purple-700 dark:border-purple-700 dark:text-purple-300"
                  >
                    Spaced Repetition
                  </Badge>
                </GlassCard>
              </div>

              {/* Quick Actions */}
              <GlassCard variant="card" className="mt-8">
                <h2 className="mb-6 text-xl font-bold text-foreground">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {quickActions.map((action, index) => (
                    <motion.button
                      key={action.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      onClick={action.action}
                      className={`
                        ${action.colorClass}
                        focus:ring-focus-200 transform rounded-2xl p-6
                        text-left text-white transition-all
                        duration-300 hover:scale-105
                        hover:shadow-xl focus:scale-105 focus:outline-none focus:ring-4
                      `}
                      aria-label={`${action.title}: ${action.description}`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <div className="rounded-xl bg-white/20 p-2">{action.icon}</div>
                        <ChevronRight className="h-5 w-5 opacity-60" />
                      </div>
                      <h3 className="mb-2 text-base font-bold">{action.title}</h3>
                      <p className="text-sm leading-relaxed opacity-90">{action.description}</p>
                    </motion.button>
                  ))}
                </div>
              </GlassCard>

              {/* Learning Path Preview */}
              <GlassCard variant="card" className="mt-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-foreground">Current Learning Path</h2>
                  <button
                    onClick={() => setActiveView('kanban')}
                    className="dark:text-focus-400 hover:text-focus-700 dark:hover:text-focus-300 cognitive-button text-sm font-semibold text-focus-600"
                  >
                    View Full Board →
                  </button>
                </div>
                <div className="text-neutral-600 dark:text-neutral-400">
                  <p className="mb-4">
                    You&apos;re currently working through:{' '}
                    <strong className="text-foreground">Machine Learning Fundamentals</strong>
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-learning-mastered"></div>
                      <span className="line-through opacity-60">Linear Regression Basics</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 rounded-full bg-learning-progress"></div>
                      <span className="font-medium">Decision Trees & Random Forests</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-learning-planned h-3 w-3 rounded-full"></div>
                      <span className="opacity-60">Neural Network Introduction</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {activeView === 'kanban' && (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <LearningKanban />
            </motion.div>
          )}

          {activeView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="cognitive-card"
            >
              <h2 className="mb-4 text-2xl font-bold text-foreground">Learning Analytics</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Detailed analytics and insights coming soon. This will include:
              </p>
              <ul className="mt-4 space-y-2 text-neutral-600 dark:text-neutral-400">
                <li>• Learning velocity and time spent per topic</li>
                <li>• Spaced repetition effectiveness</li>
                <li>• Knowledge retention curves</li>
                <li>• Personalized learning recommendations</li>
                <li>• Performance comparisons and benchmarks</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </PageContainer>

      <Footer />
    </div>
  );
}

export default LearningDashboard;
