/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriconst ModernTodayView: React.FC<ModernTodayViewProps> = ({
  config,
  liveStatus,
  completedTasks,
  toggleComplete,
  isComplete: _isComplete
}) => {
  // Remove local state as we're using the persistent hooks now
  const toggle = toggleComplete;BookOpen,
  Brain,
  Coffee,
  Github,
  Moon,
  Sparkles,
  Sun,
  Target,
  WifiOff,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { useRoadmapProgress, useUserPreferences } from '../hooks/useLocalStorage';
import { useOfflineData, useOfflineStatus } from '../hooks/useOffline';

import {
  EnhancedGlassCard,
  ModernBackground,
  ModernHeader,
  ModernNav,
  TaskItem,
} from './enhanced/ModernComponents';
import { RoadmapErrorBoundary } from './error/RoadmapErrorBoundary';
import RecallIntegration from './RecallIntegration';

interface RoadmapConfig {
  metadata: {
    title: string;
    description: string;
    currentWeek: number;
    currentPhase: string;
    totalWeeks: number;
    totalResources: number;
    totalCourses: number;
    currentPosition: string;
    completionPercentage: number;
    enhancedLearningCycle: string;
    lastUpdated: string;
  };
  currentWeek: {
    weekNumber: number;
    title: string;
    startDate: string;
    endDate: string;
    primaryGoal: string;
    dailySchedule: Record<string, any>;
  };
  phases: Record<string, any>;
  platforms: Record<string, any>;
  practicesPlatforms?: Record<string, any>;
  essentialBooks?: Record<string, any>;
  youtubeChannels?: Record<string, any>;
  newsAndBlogs?: Record<string, any>;
  communities?: Record<string, any>;
  openSourceAI?: Record<string, any>;
  recallIntegration: any;
  immediateActions: Record<string, any>;
  successMetrics: Record<string, any>;
}

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

interface LiveStatus {
  currentTime: string;
  currentDate: string;
  dayOfWeek: string;
  timeOfDay: TimeOfDay;
  hoursUntilDayEnd: number;
  currentActivity: string;
  energyLevel: 'high' | 'medium' | 'low';
  focusRecommendation: string;
}

const useLiveStatus = (): LiveStatus => {
  const [status, setStatus] = useState<LiveStatus>(() => ({
    currentTime: '--:--:--',
    currentDate: '--------',
    dayOfWeek: '',
    timeOfDay: 'night',
    hoursUntilDayEnd: 0,
    currentActivity: '',
    energyLevel: 'low',
    focusRecommendation: '',
  }));

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const hour = now.getHours();

      let timeOfDay: TimeOfDay = 'night';
      let activity = 'Rest & reflection';
      let energy: 'high' | 'medium' | 'low' = 'low';
      let focus = 'Wind down and prep for tomorrow';

      if (hour >= 6 && hour < 12) {
        timeOfDay = 'morning';
        activity = 'Deep work & learning';
        energy = 'high';
        focus = 'Tackle the hardest problems first';
      } else if (hour >= 12 && hour < 17) {
        timeOfDay = 'afternoon';
        activity = 'Practice & projects';
        energy = 'medium';
        focus = 'Build and implement';
      } else if (hour >= 17 && hour < 22) {
        timeOfDay = 'evening';
        activity = 'Community & review';
        energy = 'medium';
        focus = 'Engage with others and reflect';
      }

      setStatus({
        currentTime: now.toLocaleTimeString(),
        currentDate: now.toLocaleDateString(),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        timeOfDay,
        hoursUntilDayEnd: 24 - hour,
        currentActivity: activity,
        energyLevel: energy,
        focusRecommendation: focus,
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  return status;
};

// Modern Today's Focus View
interface ModernTodayViewProps {
  config: RoadmapConfig;
  liveStatus: LiveStatus;
  completedTasks: Set<string>;
  toggleComplete: (taskId: string) => void;
  isComplete: (taskId: string) => boolean;
}

const ModernTodayView: React.FC<ModernTodayViewProps> = ({
  config,
  liveStatus,
  completedTasks,
  toggleComplete,
  isComplete,
}) => {
  // Remove local state as we're using the persistent hooks now
  const toggle = toggleComplete;

  const todayStatus = {
    currentTask: config.currentWeek?.primaryGoal || 'Loading current mission...',
    currentPeriod: liveStatus.timeOfDay,
    morning: config.currentWeek?.dailySchedule?.monday?.morning || 'Deep learning session',
    afternoon: config.currentWeek?.dailySchedule?.monday?.afternoon || 'Practice & projects',
    evening: config.currentWeek?.dailySchedule?.monday?.evening || 'Community & review',
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content - 2 columns */}
        <div className="space-y-6 lg:col-span-2">
          {/* Current Schedule Card */}
          <EnhancedGlassCard variant="primary" glow className="p-6">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="mb-1 text-2xl font-bold text-white">Today&apos;s Mission</h2>
                <p style={{ color: '#0F4CFF' }}>{todayStatus.currentTask}</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold tabular-nums text-white">
                  {liveStatus.hoursUntilDayEnd}h
                </div>
                <div className="text-sm text-white/60">remaining</div>
              </div>
            </div>

            {/* Time blocks with progress */}
            <div className="grid gap-4">
              {['morning', 'afternoon', 'evening'].map((period) => {
                const isActive = todayStatus.currentPeriod === period;
                const Icon = period === 'morning' ? Sun : period === 'afternoon' ? Coffee : Moon;

                return (
                  <motion.div
                    key={period}
                    className="relative rounded-xl border p-4 transition-all"
                    style={{
                      background: isActive
                        ? 'linear-gradient(135deg, rgba(15, 76, 255, 0.2) 0%, rgba(255, 102, 0, 0.2) 100%)'
                        : 'rgba(255, 255, 255, 0.05)',
                      borderColor: isActive ? 'rgba(15, 76, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
                    }}
                    animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="mb-2 flex items-center gap-3">
                      <Icon
                        className="h-5 w-5"
                        style={{ color: isActive ? '#0F4CFF' : 'rgba(255, 255, 255, 0.6)' }}
                      />
                      <span className="font-medium capitalize text-white">{period}</span>
                      {isActive && (
                        <span
                          className="ml-auto rounded-full px-2 py-1 text-xs"
                          style={{
                            backgroundColor: 'rgba(15, 76, 255, 0.3)',
                            color: '#0F4CFF',
                          }}
                        >
                          NOW
                        </span>
                      )}
                    </div>
                    <p className="text-white/80">
                      {todayStatus[period as keyof typeof todayStatus]}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </EnhancedGlassCard>

          {/* Urgent Actions */}
          <EnhancedGlassCard variant="danger" className="p-6">
            <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
              <AlertTriangle className="h-5 w-5 animate-pulse" style={{ color: '#FF3E3E' }} />
              Critical Actions (Next 60 min)
            </h3>
            <div className="space-y-3">
              {(config.immediateActions?.next60Minutes || []).map((task: string, i: number) => (
                <TaskItem
                  key={`urgent-${i}`}
                  task={task}
                  index={i}
                  done={completedTasks}
                  toggle={toggle}
                  prefix="urgent"
                  urgent
                />
              ))}
            </div>
          </EnhancedGlassCard>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <EnhancedGlassCard className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Today&apos;s Progress</h3>
            <div className="space-y-4">
              {[
                { label: 'Tasks Completed', value: 7, total: 12, color: '#0F4CFF' },
                { label: 'Hours Focused', value: 3.5, total: 5, color: '#FF2D7E' },
                { label: 'Recall Saves', value: 8, total: 10, color: '#16C784' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-white/80">{stat.label}</span>
                    <span className="font-medium text-white">
                      {stat.value}/{stat.total}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(stat.value / stat.total) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full"
                      style={{ backgroundColor: stat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </EnhancedGlassCard>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                href: 'https://www.getrecall.ai/',
                icon: Brain,
                label: 'Recall.ai',
                color: '#0F4CFF',
              },
              {
                href: 'https://github.com/jamiescottcraik',
                icon: Github,
                label: 'GitHub',
                color: '#FFFFFF',
              },
              {
                href: 'https://www.coursera.org/',
                icon: BookOpen,
                label: 'Course',
                color: '#FF2D7E',
              },
              { href: 'https://linkedin.com/', icon: Target, label: 'LinkedIn', color: '#0F4CFF' },
            ].map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="group relative"
              >
                <EnhancedGlassCard className="p-4 text-center transition-all hover:border-white/20">
                  <link.icon
                    className="mx-auto mb-2 h-8 w-8 transition-transform group-hover:scale-110"
                    style={{ color: link.color }}
                  />
                  <p className="text-sm font-medium text-white/80">{link.label}</p>
                </EnhancedGlassCard>
              </motion.a>
            ))}
          </div>

          {/* Motivational Quote */}
          <EnhancedGlassCard variant="primary" className="relative overflow-hidden p-6">
            <div
              className="absolute right-0 top-0 h-20 w-20 rounded-full blur-2xl"
              style={{ backgroundColor: 'rgba(15, 76, 255, 0.2)' }}
            />
            <Sparkles className="mb-3 h-6 w-6" style={{ color: '#0F4CFF' }} />
            <p className="relative z-10 italic text-white/90">
              &ldquo;The best time to plant a tree was 20 years ago. The second best time is
              now.&rdquo;
            </p>
            <p className="mt-2 text-sm text-white/60">Keep pushing forward! 🚀</p>
          </EnhancedGlassCard>
        </div>
      </div>
    </div>
  );
};

function ModernAIEngineeringRoadmap2025() {
  const [config, setConfig] = useState<RoadmapConfig | null>(null);
  const [activeTab, setActiveTab] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const liveStatus = useLiveStatus();

  // Initialize our custom hooks
  const {
    completedTasks,
    toggleComplete,
    isComplete,
    getCompletionStats,
    isLoading: progressLoading,
  } = useRoadmapProgress();

  const { preferences, updatePreference } = useUserPreferences();
  const { isOnline, wasOffline } = useOfflineStatus();

  // Use offline-capable data loading
  const {
    data: offlineConfig,
    isLoading: configLoading,
    error: configError,
    isOffline,
    refresh,
  } = useOfflineData('roadmap-config-2025', async () => {
    const response = await fetch('/config/roadmap-config-2025.json');
    if (!response.ok) throw new Error('Failed to load roadmap config');
    return response.json();
  });

  // Use offline config if available, otherwise use regular loading
  useEffect(() => {
    if (offlineConfig) {
      setConfig(offlineConfig);
      setLoading(false);
      setError(null);
    } else if (configError) {
      setError(configError);
      setLoading(false);
    } else if (!configLoading) {
      // Fallback to original loading method
      const loadConfig = async () => {
        try {
          const response = await fetch('/config/roadmap-config-2025.json');
          if (!response.ok) throw new Error('Failed to load roadmap config');
          const data = await response.json();
          setConfig(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load roadmap');
        } finally {
          setLoading(false);
        }
      };
      loadConfig();
    }
  }, [offlineConfig, configError, configLoading]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-gray-900">
        <ModernBackground />
        <div className="relative z-10 text-center">
          <div
            className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2"
            style={{ borderColor: '#0F4CFF' }}
          />
          <p className="text-lg" style={{ color: '#0F4CFF' }}>
            Loading brAInwav Roadmap...
          </p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-gray-900">
        <ModernBackground />
        <div className="relative z-10 text-center">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16" style={{ color: '#FF3E3E' }} />
          <p className="text-lg" style={{ color: '#FF3E3E' }}>
            Error: {error || 'Configuration not found'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-gray-900">
      <ModernBackground />

      {/* Offline Status Indicator */}
      {(!isOnline || isOffline) && (
        <div className="fixed right-4 top-4 z-50">
          <div className="glass-card flex items-center gap-2 border-yellow-500/30 bg-yellow-500/20 px-4 py-2">
            <WifiOff className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">
              {isOffline ? 'Working Offline' : 'Connection Issues'}
            </span>
          </div>
        </div>
      )}

      {/* Connection Restored Notification */}
      {wasOffline && isOnline && (
        <div className="fixed right-4 top-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card flex items-center gap-2 border-green-500/30 bg-green-500/20 px-4 py-2"
          >
            <Sparkles className="h-4 w-4 text-green-400" />
            <span className="text-sm text-green-400">Back Online - Data Synced</span>
          </motion.div>
        </div>
      )}

      {/* Modern Header */}
      <ModernHeader config={config} liveStatus={liveStatus} />

      {/* Modern Navigation */}
      <ModernNav active={activeTab} onChange={setActiveTab} />

      {/* Content Area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <motion.div
              key="today"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ModernTodayView
                config={config}
                liveStatus={liveStatus}
                completedTasks={completedTasks}
                toggleComplete={toggleComplete}
                isComplete={isComplete}
              />
            </motion.div>
          )}

          {activeTab === 'recall' && (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4"
            >
              <RecallIntegration />
            </motion.div>
          )}

          {/* Add other tab content here following the same pattern */}
          {activeTab !== 'today' && activeTab !== 'recall' && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 pb-20"
            >
              <EnhancedGlassCard className="p-8 text-center">
                <h2 className="mb-4 text-2xl font-bold text-white">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} View
                </h2>
                <p className="text-white/60">
                  This section is coming soon! Building modern {activeTab} interface...
                </p>
              </EnhancedGlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Create a wrapped version with error boundary
function ModernAIEngineeringRoadmap2025WithErrorBoundary() {
  return (
    <RoadmapErrorBoundary>
      <ModernAIEngineeringRoadmap2025 />
    </RoadmapErrorBoundary>
  );
}

// Export the wrapped version as default
export { ModernAIEngineeringRoadmap2025WithErrorBoundary as default };
