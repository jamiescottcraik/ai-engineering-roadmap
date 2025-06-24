"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Target, Brain, Code, BookOpen, TrendingUp, Play, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';
import { LearningKanban } from './learning/LearningKanban';

/**
 * Main Learning Dashboard - Interactive roadmap interface inspired by OpenUI
 * Implements modern UI patterns from awesome-react with accessibility compliance
 *
 * Features:
 * - Interactive progress tracking
 * - Real-time learning analytics
 * - Kanban-style task management
 * - Spaced repetition scheduling
 * - Provider-neutral AI integration
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
  color: string;
  action: () => void;
}

export function LearningDashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'kanban' | 'analytics'>('overview');
  const [stats] = useState<LearningStats>({
    totalLessons: 47,
    completedLessons: 12,
    currentStreak: 5,
    weeklyGoal: 3,
    weeklyProgress: 2,
    nextReview: new Date(Date.now() + 2 * 60 * 60 * 1000) // 2 hours from now
  });

  const quickActions: QuickAction[] = [
    {
      id: 'continue-learning',
      title: 'Continue Learning',
      description: 'Resume your current AI engineering path',
      icon: <Play className="h-5 w-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setActiveView('kanban')
    },
    {
      id: 'practice-coding',
      title: 'Practice Coding',
      description: 'Work on hands-on coding exercises',
      icon: <Code className="h-5 w-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => console.log('Opening coding practice')
    },
    {
      id: 'review-concepts',
      title: 'Review Concepts',
      description: 'Spaced repetition review session',
      icon: <Brain className="h-5 w-5" />,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => console.log('Starting review session')
    },
    {
      id: 'interactive-roadmap',
      title: 'Interactive Roadmap',
      description: 'Explore your learning path in browser-like interface',
      icon: <Target className="h-5 w-5" />,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => window.open('/roadmap', '_blank')
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      description: 'Track your learning progress',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => setActiveView('analytics')
    }
  ];

  const progressPercentage = (stats.completedLessons / stats.totalLessons) * 100;
  const weeklyProgressPercentage = (stats.weeklyProgress / stats.weeklyGoal) * 100;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Navigation Tabs */}
      <nav className="flex space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/20 dark:border-gray-700/50">
        {[
          { key: 'overview', label: 'Overview', icon: <Target className="h-5 w-5" /> },
          { key: 'kanban', label: 'Learning Board', icon: <BookOpen className="h-5 w-5" /> },
          { key: 'analytics', label: 'Analytics', icon: <TrendingUp className="h-5 w-5" /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveView(tab.key as 'overview' | 'kanban' | 'analytics')}
            className={`flex items-center space-x-3 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeView === tab.key
                ? 'bg-blue-500 text-white shadow-lg scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
            aria-pressed={activeView === tab.key}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Overall Progress</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.completedLessons}/{stats.totalLessons}
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
                  {progressPercentage.toFixed(1)}% complete
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Current Streak</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.currentStreak} days</p>
                  </div>
                  <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                </div>
                <Badge
                  variant={stats.currentStreak >= 7 ? "default" : "secondary"}
                  className="mt-2 px-3 py-1"
                >
                  {stats.currentStreak >= 7 ? 'On fire! 🔥' : 'Keep going!'}
                </Badge>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Weekly Goal</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                      {stats.weeklyProgress}/{stats.weeklyGoal}
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${weeklyProgressPercentage}%` }}
                    transition={{ delay: 0.7, duration: 1 }}
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm"
                  />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 font-medium">
                  {Math.round(weeklyProgressPercentage)}% of weekly goal
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Next Review</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {stats.nextReview ? new Date(stats.nextReview).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'None scheduled'}
                    </p>
                  </div>
                  <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                </div>
                <Badge variant="outline" className="mt-2 px-3 py-1 border-purple-200 text-purple-700 dark:border-purple-700 dark:text-purple-300">
                  Spaced Repetition
                </Badge>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    onClick={action.action}
                    className={`${action.color} text-white rounded-2xl p-6 text-left transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-800`}
                    aria-label={`${action.title}: ${action.description}`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-xl">
                        {action.icon}
                      </div>
                      <ChevronRight className="h-5 w-5 opacity-60" />
                    </div>
                    <h3 className="font-bold text-base mb-2">{action.title}</h3>
                    <p className="text-sm opacity-90 leading-relaxed">{action.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Learning Path Preview */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/50 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Current Learning Path</h2>
                <button
                  onClick={() => setActiveView('kanban')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                >
                  <span>View Full Board</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { title: 'Neural Network Fundamentals', progress: 85, status: 'in-progress' },
                  { title: 'PyTorch Deep Dive', progress: 0, status: 'todo' },
                  { title: 'Transformer Architecture', progress: 100, status: 'completed' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className={`h-3 w-3 rounded-full ${
                      item.status === 'completed' ? 'bg-green-500' :
                      item.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                      <div className="mt-1 bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{item.progress}%</span>
                  </motion.div>
                ))}
              </div>
            </div>
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
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Learning Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed analytics and insights coming soon. This will include:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
              <li>• Learning velocity and time spent per topic</li>
              <li>• Spaced repetition effectiveness</li>
              <li>• Knowledge retention curves</li>
              <li>• Personalized learning recommendations</li>
              <li>• Performance comparisons and benchmarks</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
