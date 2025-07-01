/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  ChevronRight,
  Circle,
  Clock,
  Code,
  Coffee,
  ExternalLink,
  Github,
  Moon,
  Sparkles,
  Star,
  Sun,
  Target,
  Terminal,
  Timer,
  TrendingUp,
  Trophy,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { GlassCard } from './enhanced/GlassComponents';
import RecallIntegration from './recall-integration';

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

export default function AIEngineeringRoadmap2025() {
  const [config, setConfig] = useState<RoadmapConfig | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const liveStatus = useLiveStatus();

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-32 w-32 animate-spin rounded-full border-b-2 border-blue-400"></div>
          <p className="text-lg text-blue-300">Loading AI Engineering Roadmap...</p>
        </div>
      </div>
    );
  }

  if (error || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-red-900 to-purple-900">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-16 w-16 text-red-400" />
          <p className="text-lg text-red-300">Error: {error || 'Configuration not found'}</p>
        </div>
      </div>
    );
  }

  const TimeIcon =
    liveStatus.timeOfDay === 'morning' ? Sun : liveStatus.timeOfDay === 'afternoon' ? Coffee : Moon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 dark:from-slate-900 dark:via-blue-900 dark:to-gray-900">
      {/* Live Status Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Circle
                  className={`h-3 w-3 ${liveStatus.energyLevel === 'high' ? 'fill-green-400 text-green-400' : liveStatus.energyLevel === 'medium' ? 'fill-yellow-400 text-yellow-400' : 'fill-red-400 text-red-400'}`}
                />
                <TimeIcon className="h-4 w-4 text-white/70" />
                <span className="font-mono text-sm text-white/90">
                  {liveStatus.currentTime} • {liveStatus.dayOfWeek}
                </span>
              </div>
              <div className="text-sm text-white/70">
                {liveStatus.currentActivity} • {liveStatus.focusRecommendation}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-white/60">
                Week {config.metadata.currentWeek} of {config.metadata.totalWeeks}
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" style={{ color: '#FFD600' }} />
                <span className="font-semibold" style={{ color: '#FFD600' }}>
                  {config.metadata.completionPercentage}% DONE
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="mb-8 p-8 text-center">
            <div className="mb-6 flex items-center justify-center gap-4">
              <Brain className="h-12 w-12" style={{ color: '#0F4CFF' }} />
              <h1 className="text-4xl font-bold text-white">
                {config.metadata.title.includes('brAInwav') ? (
                  <>
                    {config.metadata.title.split('brAInwav')[0]}
                    br<span style={{ color: '#FF6600' }}>AI</span>nwav
                    {config.metadata.title.split('brAInwav')[1]}
                  </>
                ) : (
                  config.metadata.title
                )}
              </h1>
            </div>
            <p className="mb-4 text-lg text-white/80">{config.metadata.description}</p>
            <div className="mb-6 flex items-center justify-center gap-4 text-sm text-white/60">
              <span>📅 {config.metadata.currentPosition}</span>
              <span>📚 {config.metadata.totalResources}+ Resources</span>
              <span>🎓 {config.metadata.totalCourses}+ Courses</span>
              <span>🧠 Recall.ai Enhanced</span>
            </div>

            {/* Enhanced Learning Cycle */}
            <div className="rounded-lg border border-purple-500/30 bg-purple-500/20 p-4">
              <h3 className="mb-2 font-semibold text-purple-300">Enhanced Learning Cycle</h3>
              <p className="font-mono text-lg text-purple-200">
                {config.metadata.enhancedLearningCycle}
              </p>
            </div>
          </GlassCard>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Phase Overview', icon: Target },
            { id: 'current-week', label: 'Current Week', icon: Calendar },
            { id: 'platforms', label: 'Learning Platforms', icon: BookOpen },
            { id: 'practice', label: 'Practice & Tools', icon: Code },
            { id: 'resources', label: 'Books & Videos', icon: Sparkles },
            { id: 'community', label: 'Communities', icon: Github },
            { id: 'recall', label: 'Recall.ai', icon: Brain },
            { id: 'metrics', label: 'Success Metrics', icon: BarChart3 },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${
                activeTab === id
                  ? 'border border-blue-500/50 bg-blue-500/30 text-blue-300'
                  : 'border border-white/20 bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Object.entries(config.phases).map(([phaseId, phase]: [string, any]) => (
                  <GlassCard key={phaseId} className="p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          phaseId === config.metadata.currentPhase ? 'bg-green-400' : 'bg-gray-500'
                        }`}
                      />
                      <h3 className="text-xl font-semibold text-white">{phase.title}</h3>
                    </div>
                    <p className="mb-3 text-sm text-white/70">{phase.description}</p>
                    <div className="text-xs text-white/60">
                      <div>📅 {phase.weeks}</div>
                      <div>⏱️ {phase.duration}</div>
                    </div>
                    {phase.keyDeliverables && (
                      <div className="mt-4">
                        <h4 className="mb-2 text-sm font-medium text-white/80">
                          Key Deliverables:
                        </h4>
                        <div className="space-y-1">
                          {phase.keyDeliverables
                            .slice(0, 3)
                            .map((deliverable: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-white/60"
                              >
                                <ChevronRight className="h-3 w-3" />
                                {deliverable}
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'current-week' && (
            <motion.div
              key="current-week"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <GlassCard className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-white">
                      Week {config.currentWeek.weekNumber}: {config.currentWeek.title}
                    </h2>
                    <p className="text-white/70">{config.currentWeek.primaryGoal}</p>
                  </div>
                  <div className="text-right text-sm text-white/60">
                    <div>
                      {config.currentWeek.startDate} - {config.currentWeek.endDate}
                    </div>
                    <div className="mt-1 text-green-400">● ACTIVE</div>
                  </div>
                </div>

                {/* Daily Schedule */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
                  {Object.entries(config.currentWeek.dailySchedule).map(
                    ([day, schedule]: [string, any]) => {
                      const isToday = day === liveStatus.dayOfWeek.toLowerCase();
                      return (
                        <div
                          key={day}
                          className={`rounded-lg border p-4 ${
                            isToday
                              ? 'border-blue-500/50 bg-blue-500/20'
                              : 'border-white/20 bg-white/10'
                          }`}
                        >
                          <h3 className="mb-3 font-semibold capitalize text-white">{day}</h3>
                          <div className="space-y-2 text-sm">
                            <div>
                              <div className="text-white/60">Morning (2h)</div>
                              <div className="text-white/90">{schedule.morning}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Afternoon (2h)</div>
                              <div className="text-white/90">{schedule.afternoon}</div>
                            </div>
                            <div>
                              <div className="text-white/60">Evening (1h)</div>
                              <div className="text-white/90">{schedule.evening}</div>
                            </div>
                            <div className="border-t border-white/20 pt-2">
                              <div className="text-xs text-green-400">
                                📦 {schedule.deliverable}
                              </div>
                              <div className="text-xs text-purple-400">
                                🧠 {schedule.recallFocus}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </GlassCard>

              {/* Immediate Actions */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <GlassCard className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <Timer className="h-5 w-5 text-red-400" />
                    Next 60 Minutes
                  </h3>
                  <div className="space-y-2">
                    {config.immediateActions.next60Minutes
                      .slice(0, 4)
                      .map((action: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                          <div className="h-2 w-2 rounded-full bg-red-400" />
                          {action}
                        </div>
                      ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <Clock className="h-5 w-5 text-yellow-400" />
                    By End of Day
                  </h3>
                  <div className="space-y-2">
                    {config.immediateActions.byEndOfDay.map((action: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                        <div className="h-2 w-2 rounded-full bg-yellow-400" />
                        {action}
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
                    <Calendar className="h-5 w-5 text-green-400" />
                    This Week
                  </h3>
                  <div className="space-y-2">
                    {config.immediateActions.thisWeek.map((action: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-white/80">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        {action}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'platforms' && (
            <motion.div
              key="platforms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Coursera Courses */}
              {config.platforms.coursera && (
                <GlassCard className="p-6">
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                    <BookOpen className="h-6 w-6 text-blue-400" />
                    Coursera - Your Enrolled Courses
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {config.platforms.coursera.courses?.map((course: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4"
                      >
                        <h3 className="mb-2 font-semibold text-white">{course.title}</h3>
                        <div className="space-y-1 text-sm text-white/70">
                          <div>👨‍🏫 {course.instructor}</div>
                          <div>⏱️ {course.duration}</div>
                          <div>📚 {course.phase}</div>
                          <div className="text-purple-400">🧠 {course.recallStrategy}</div>
                        </div>
                        <a
                          href={course.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
                        >
                          Access Course <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* DeepLearning.AI Short Courses */}
              {config.platforms.deeplearning_ai && (
                <GlassCard className="p-6">
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                    <Zap className="h-6 w-6 text-orange-400" />
                    DeepLearning.AI Short Courses (ALL FREE)
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {config.platforms.deeplearning_ai.shortCourses?.map(
                      (course: any, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4"
                        >
                          <h3 className="mb-2 text-sm font-semibold text-white">{course.title}</h3>
                          <div className="space-y-1 text-xs text-white/70">
                            <div>⏱️ {course.duration}</div>
                            <div>🎯 {course.focus}</div>
                            <div className="text-purple-400">🧠 {course.recallFocus}</div>
                          </div>
                          <a
                            href={course.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300"
                          >
                            Start <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      ),
                    )}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}

          {activeTab === 'practice' && config.practicesPlatforms && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Competition Platforms */}
              <GlassCard className="p-6">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                  <Trophy className="h-6 w-6 text-yellow-400" />
                  Competition & Portfolio Platforms
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {config.practicesPlatforms.competitionPlatforms?.map(
                    (platform: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4"
                      >
                        <h3 className="mb-2 font-semibold text-white">{platform.platform}</h3>
                        <div className="space-y-1 text-sm text-white/70">
                          <div>🎯 {platform.bestFor}</div>
                          <div>💎 Portfolio Value: {platform.portfolioValue}</div>
                        </div>
                        <a
                          href={platform.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300"
                        >
                          Compete <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    ),
                  )}
                </div>
              </GlassCard>

              {/* Coding Practice */}
              <GlassCard className="p-6">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                  <Code className="h-6 w-6 text-green-400" />
                  Coding Practice Sites
                </h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                  {config.practicesPlatforms.codingPractice?.map((platform: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-green-500/30 bg-green-500/10 p-4"
                    >
                      <h3 className="mb-2 text-sm font-semibold text-white">{platform.platform}</h3>
                      <div className="space-y-1 text-xs text-white/70">
                        <div>🎯 {platform.focus}</div>
                        <div>🆓 {platform.freeTier}</div>
                      </div>
                      <a
                        href={platform.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
                      >
                        Practice <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Ollama Setup */}
              {config.openSourceAI?.ollama && (
                <GlassCard className="p-6">
                  <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                    <Terminal className="h-6 w-6 text-purple-400" />
                    Open Source AI - Ollama Setup
                  </h2>
                  <div className="mb-4 rounded border border-purple-500/30 bg-purple-500/10 p-3">
                    <code className="text-sm text-purple-300">
                      {config.openSourceAI.ollama.setupInstructions}
                    </code>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {config.openSourceAI.ollama.essentialModels?.map((model: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4"
                      >
                        <h3 className="mb-2 font-semibold text-white">{model.model}</h3>
                        <div className="space-y-1 text-sm text-white/70">
                          <div>💾 Size: {model.size}</div>
                          <div>🎯 Use Case: {model.useCase}</div>
                          <div>🧠 RAM Needed: {model.ramNeeded}</div>
                        </div>
                        <div className="mt-3 rounded bg-black/30 p-2 font-mono text-xs text-purple-300">
                          {model.command}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </motion.div>
          )}

          {activeTab === 'recall' && (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <RecallIntegration />
            </motion.div>
          )}

          {activeTab === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Technical Metrics */}
              <GlassCard className="p-6">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                  Technical Proficiency
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(config.successMetrics.technical).map(
                    ([key, metric]: [string, any]) => (
                      <div key={key} className="text-center">
                        <div className="mb-2 text-3xl font-bold text-blue-400">
                          {metric.current}/{metric.target}
                        </div>
                        <div className="text-sm capitalize text-white/70">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-blue-400"
                            style={{
                              width: `${Math.min((metric.current / metric.target) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </GlassCard>

              {/* Career Metrics */}
              <GlassCard className="p-6">
                <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                  Career & Brand
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {Object.entries(config.successMetrics.career).map(
                    ([key, metric]: [string, any]) => (
                      <div key={key} className="text-center">
                        <div className="mb-2 text-3xl font-bold text-green-400">
                          {metric.current}/{metric.target}
                        </div>
                        <div className="text-sm capitalize text-white/70">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </div>
                        <div className="mt-2 h-2 w-full rounded-full bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-green-400"
                            style={{
                              width: `${Math.min((metric.current / metric.target) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
