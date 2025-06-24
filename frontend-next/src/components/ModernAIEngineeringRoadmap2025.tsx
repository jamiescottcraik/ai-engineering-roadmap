// Enhanced ModernAIEngineeringRoadmap2025 - Evening Mode Edition
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BedDouble,
  BookOpen,
  Brain,
  CheckCircle,
  Circle,
  Coffee,
  Flame,
  Github,
  Kanban,
  Linkedin,
  MessageSquare,
  Moon,
  Sparkles,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import MCPAIAssistant from '@/components/ai/MCPAIAssistant';
import ProgressAnalytics from '@/components/analytics/ProgressAnalytics';
import LearningKanban from '@/components/kanban/LearningKanban';
import RecallIntegration from '@/components/RecallIntegration';

// Type definitions
interface RoadmapConfig {
  currentWeek: {
    weekNumber: number;
    title: string;
    dailySchedule: {
      tuesday: {
        morning: string;
        afternoon: string;
        evening: string;
        deliverable: string;
      };
    };
  };
}

// Evening-optimized theme
const eveningTheme = {
  bg: 'bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950',
  card: 'bg-white/[0.03] border-white/[0.08]',
  text: {
    primary: 'text-white/90',
    secondary: 'text-white/60',
    muted: 'text-white/40',
  },
  accent: {
    purple: 'rgb(147, 51, 234)',
    blue: 'rgb(59, 130, 246)',
    amber: 'rgb(245, 158, 11)',
  },
};

export default function ModernAIEngineeringRoadmap2025() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [config, setConfig] = useState<RoadmapConfig>();
  const [done, setDone] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('evening-review');
  const [configError, setConfigError] = useState<string>('');

  // Proper evening mode calculation using UTC (22:19 UTC = evening)
  const currentHour = currentTime.getUTCHours();
  const currentMinute = currentTime.getUTCMinutes();
  const isEvening = currentHour >= 20 || currentHour < 6;
  const hoursUntilBedtime = currentHour >= 20 ? 24 - currentHour : 6 - currentHour;
  const minutesRemaining = 60 - currentMinute;

  // LinkedIn post deadline (23:00 UTC)
  const linkedinDeadlineHour = 23;
  const minutesUntilLinkedIn = (linkedinDeadlineHour - currentHour) * 60 - currentMinute;
  const isLinkedInUrgent = minutesUntilLinkedIn > 0 && minutesUntilLinkedIn <= 120; // Within 2 hours

  // Load config and saved state with error handling
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/config/roadmap-config-2025.json');
        if (!response.ok) {
          throw new Error(`Config not found: ${response.status}`);
        }
        const data = await response.json();
        setConfig(data);

        // Load saved progress with error handling
        try {
          const saved = localStorage.getItem('roadmap-jamie-progress');
          if (saved) {
            setDone(new Set(JSON.parse(saved)));
          }
        } catch {
          setConfigError('Progress tracking unavailable');
        }
      } catch {
        setConfigError('Configuration not available');
      }
    };

    loadConfig();
  }, []);

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      // Better persistence with error handling
      try {
        localStorage.setItem('roadmap-jamie-progress', JSON.stringify([...next]));
        localStorage.setItem('last-save', new Date().toISOString());
      } catch {
        // Handle storage errors gracefully
        setConfigError('Unable to save progress');
      }

      return next;
    });
  }, []);

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <motion.div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto mb-4"
          >
            <Brain className="h-12 w-12 text-purple-400" />
          </motion.div>
          <p className="text-white/60">Loading brAInwav platform...</p>
          {configError && <p className="mt-2 text-sm text-red-400">{configError}</p>}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${eveningTheme.bg}`}>
      {/* Ambient evening lighting */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute right-20 top-20 h-96 w-96 rounded-full bg-purple-600/10 blur-[120px]" />
        <div className="absolute bottom-20 left-20 h-96 w-96 rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Evening-optimized Header */}
        <EveningHeader
          config={config}
          currentTime={currentTime}
          hoursUntilBedtime={hoursUntilBedtime}
        />

        {/* Smart Navigation - Evening focused */}
        <EveningNav activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="container mx-auto px-6 pb-20">
          <AnimatePresence mode="wait">
            {activeTab === 'evening-review' && (
              <EveningReviewView
                _config={config}
                done={done}
                toggle={toggleTask}
                hoursLeft={hoursUntilBedtime}
                minutesLeft={minutesRemaining}
              />
            )}

            {activeTab === 'tomorrow-prep' && <TomorrowPrepView config={config} />}

            {activeTab === 'ai-assistant' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <MCPAIAssistant />
              </motion.div>
            )}

            {activeTab === 'kanban' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <LearningKanban />
              </motion.div>
            )}

            {activeTab === 'analytics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ProgressAnalytics />
              </motion.div>
            )}

            {activeTab === 'recall' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <RecallIntegration />
              </motion.div>
            )}

            {activeTab === 'reflection' && <ReflectionView _config={config} done={done} />}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// Evening-specific Header
const EveningHeader = ({
  config,
  currentTime,
  hoursUntilBedtime,
}: {
  config: RoadmapConfig;
  currentTime: Date;
  hoursUntilBedtime: number;
}) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="sticky top-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-2xl"
  >
    <div className="container mx-auto px-6 py-4">
      {/* brAInwav branding with evening greeting */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <Image
              src="/brAInwav-new.png"
              alt="brAInwav - Signals from Lived Minds"
              width={60}
              height={60}
              className="rounded-xl object-contain"
            />
            <div className="absolute inset-0 animate-pulse rounded-xl bg-purple-500/10" />
          </motion.div>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Good {isEvening ? 'Evening' : 'Day'}, Jamie
            </h1>
            <p className="text-sm text-white/70">
              {isEvening ? 'Time to wind down and reflect' : 'Signals from Lived Minds'}
              {isLinkedInUrgent && ' • LinkedIn post due soon!'}
            </p>
          </div>
        </div>

        {/* Evening stats */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-light tabular-nums text-white">
              {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-400">
              <BedDouble className="h-3 w-3" />
              {hoursUntilBedtime}h until rest
            </div>
          </div>

          <motion.div
            className="flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1.5"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Flame className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-white/80">4 day streak</span>
          </motion.div>
        </div>
      </div>

      {/* Evening progress summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-light text-white">
            Week {config.currentWeek.weekNumber} - Day 0 (Pre-Launch)
          </h2>
          <p className="text-sm text-white/60">
            Getting Ready to Launch • {config.currentWeek.title}
          </p>
        </div>

        {/* Today's achievement badges */}
        <div className="flex gap-2">
          {[
            { icon: CheckCircle, count: 7, label: 'Tasks' },
            { icon: Brain, count: 12, label: 'Recalls' },
            { icon: Github, count: 3, label: 'Commits' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/5 px-3 py-1">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white/80">{stat.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </motion.header>
);

// Evening-focused Navigation
const EveningNav = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  const tabs = [
    { id: 'evening-review', label: 'Evening Review', icon: Moon },
    { id: 'tomorrow-prep', label: 'Tomorrow', icon: Coffee },
    { id: 'ai-assistant', label: 'AI Assistant', icon: MessageSquare },
    { id: 'kanban', label: 'Tasks', icon: Kanban },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'recall', label: 'Recall.ai', icon: Brain },
    { id: 'reflection', label: 'Reflect', icon: Star },
  ];

  return (
    <nav className="container mx-auto px-6 py-6">
      <div className="mx-auto flex w-fit items-center gap-2 rounded-full bg-white/5 p-1">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center gap-2 rounded-full px-6 py-3 transition-all
              ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-white'
                  : 'text-white/50 hover:text-white/80'
              }
            `}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-sm">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

// Evening Review View
const EveningReviewView = ({
  _config,
  done,
  toggle,
  hoursLeft,
  minutesLeft,
}: {
  _config: RoadmapConfig;
  done: Set<string>;
  toggle: (id: string) => void;
  hoursLeft: number;
  minutesLeft: number;
}) => {
  // Get current time context for urgency
  const currentHour = new Date().getUTCHours();
  const currentMinute = new Date().getUTCMinutes();
  const minutesUntilLinkedIn = (23 - currentHour) * 60 - currentMinute; // LinkedIn deadline 23:00 UTC

  const eveningTasks = [
    {
      id: 'linkedin-post-draft',
      task: 'Draft LinkedIn reflection post (DUE: 23:00 UTC)',
      time: `${Math.max(0, minutesUntilLinkedIn)} min left`,
      urgent: minutesUntilLinkedIn > 0 && minutesUntilLinkedIn <= 120,
      critical: minutesUntilLinkedIn <= 40,
    },
    {
      id: 'blog-post-draft',
      task: "Complete blog post draft - Today's deliverable",
      time: '30 min',
      urgent: true,
      critical: false,
    },
    {
      id: 'recall-ai-review',
      task: 'Review and organize Recall.ai saves from today',
      time: '15 min',
      urgent: true,
      critical: false,
    },
    {
      id: 'tomorrow-planning',
      task: "Plan tomorrow's focus areas and priorities",
      time: '10 min',
      urgent: false,
      critical: false,
    },
    {
      id: 'reflection-journal',
      task: 'Write evening reflection and learning notes',
      time: '15 min',
      urgent: false,
      critical: false,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      {/* Critical LinkedIn Alert */}
      {minutesUntilLinkedIn > 0 && minutesUntilLinkedIn <= 120 && (
        <motion.div
          className={`rounded-xl border p-4 ${
            minutesUntilLinkedIn <= 40
              ? 'border-red-500/40 bg-red-500/10'
              : 'border-amber-500/20 bg-amber-500/10'
          }`}
          animate={{
            borderColor:
              minutesUntilLinkedIn <= 40
                ? ['rgba(239,68,68,0.4)', 'rgba(239,68,68,0.8)', 'rgba(239,68,68,0.4)']
                : ['rgba(245,158,11,0.2)', 'rgba(245,158,11,0.4)', 'rgba(245,158,11,0.2)'],
          }}
          transition={{ duration: minutesUntilLinkedIn <= 40 ? 1 : 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Linkedin
                className={`h-5 w-5 ${minutesUntilLinkedIn <= 40 ? 'text-red-400' : 'text-amber-400'}`}
              />
              <div>
                <p
                  className={`font-medium ${minutesUntilLinkedIn <= 40 ? 'text-red-300' : 'text-white'}`}
                >
                  {minutesUntilLinkedIn <= 40
                    ? 'CRITICAL: LinkedIn Post Due!'
                    : 'LinkedIn Post Reminder'}
                </p>
                <p className="text-sm text-white/60">
                  {minutesUntilLinkedIn} minutes until 23:00 UTC deadline
                </p>
              </div>
            </div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <MessageSquare
                className={`h-6 w-6 ${minutesUntilLinkedIn <= 40 ? 'text-red-400' : 'text-amber-400'}`}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* General Evening Alert */}
      <motion.div
        className="rounded-xl border border-purple-500/20 bg-purple-500/10 p-4"
        animate={{
          borderColor: ['rgba(147,51,234,0.2)', 'rgba(147,51,234,0.4)', 'rgba(147,51,234,0.2)'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-purple-400" />
            <div>
              <p className="font-medium text-white">Evening Workflow Active</p>
              <p className="text-sm text-white/60">
                {hoursLeft}h {minutesLeft}m until rest period
              </p>
            </div>
          </div>
          <Coffee className="h-6 w-6 text-purple-400/50" />
        </div>
      </motion.div>

      {/* Today's Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <h3 className="mb-3 text-lg font-light text-white">Today&apos;s Prep</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <Circle className="h-4 w-4" />
              <span className="text-sm">Roadmap platform setup</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Circle className="h-4 w-4" />
              <span className="text-sm">Development environment planning</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Circle className="h-4 w-4" />
              <span className="text-sm">Learning tools evaluation</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <h3 className="mb-3 text-lg font-light text-white">To Learn</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>• Python development environment setup</p>
            <p>• Git workflow and version control basics</p>
            <p>• Development tools and IDE configuration</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-xl border border-white/10 bg-white/5 p-4"
        >
          <h3 className="mb-3 text-lg font-light text-white">Tomorrow&apos;s Focus</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>• Start Python fundamentals (Week 1, Day 1)</p>
            <p>• Complete development environment setup</p>
            <p>• Begin first Python exercises</p>
          </div>
        </motion.div>
      </div>

      {/* Evening Tasks with Urgency */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-light text-white/60">Evening Workflow</h3>
          {eveningTasks.filter((t) => t.critical).length > 0 && (
            <div className="flex items-center gap-1 text-red-400">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-400" />
              <span className="text-xs">Critical tasks</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {eveningTasks.map((task) => (
            <motion.div
              key={task.id}
              whileHover={{ x: 4 }}
              onClick={() => toggle(task.id)}
              className={`
                relative flex cursor-pointer items-center gap-3 rounded-xl p-3 transition-all
                ${
                  done.has(task.id)
                    ? 'border border-green-500/20 bg-green-500/5'
                    : task.critical
                      ? 'border border-red-500/30 bg-red-500/5 hover:border-red-500/40'
                      : task.urgent
                        ? 'border border-amber-500/30 bg-amber-500/5 hover:border-amber-500/40'
                        : 'border border-white/10 bg-white/5 hover:border-white/20'
                }
              `}
            >
              {/* Urgency indicator */}
              {task.critical && !done.has(task.id) && (
                <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-red-500" />
              )}
              {task.urgent && !task.critical && !done.has(task.id) && (
                <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-amber-500" />
              )}

              {done.has(task.id) ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <Circle
                  className={`h-5 w-5 ${
                    task.critical
                      ? 'text-red-400'
                      : task.urgent
                        ? 'text-amber-400'
                        : 'text-white/30'
                  }`}
                />
              )}
              <span
                className={`flex-1 text-sm ${
                  done.has(task.id)
                    ? 'text-green-400'
                    : task.critical
                      ? 'text-red-200'
                      : task.urgent
                        ? 'text-amber-200'
                        : 'text-white/80'
                }`}
              >
                {task.task}
              </span>
              <span
                className={`text-xs ${
                  task.critical ? 'text-red-300' : task.urgent ? 'text-amber-300' : 'text-white/40'
                }`}
              >
                {task.time}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Links for Evening */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { href: 'https://www.getrecall.ai/', icon: Brain, label: 'Recall.ai' },
          { href: 'https://github.com/jamiescottcraik', icon: Github, label: 'GitHub' },
          { href: 'https://linkedin.com/in/jamiescottcraik', icon: Linkedin, label: 'LinkedIn' },
          { href: '#', icon: BookOpen, label: 'Journal' },
        ].map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : '_self'}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:border-purple-500/30"
          >
            <link.icon className="h-5 w-5 text-white/60" />
            <span className="text-xs text-white/60">{link.label}</span>
          </motion.a>
        ))}
      </div>

      {/* Pre-Launch Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6"
      >
        <Sparkles className="mb-3 h-6 w-6 text-purple-400" />
        <p className="italic text-white/90">
          &ldquo;The best time to plant a tree was 20 years ago. The second best time is now. Your
          AI Engineering journey starts tomorrow - but the foundation begins tonight.&rdquo;
        </p>
        <p className="mt-2 text-sm text-white/60">— Ready to Launch</p>
      </motion.div>
    </motion.div>
  );
};

// Tomorrow Prep View
const TomorrowPrepView = ({ config }: { config: RoadmapConfig }) => {
  const tomorrowSchedule = config.currentWeek.dailySchedule.tuesday;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <h2 className="mb-6 text-2xl font-light text-white">Tomorrow&apos;s Game Plan</h2>

      <div className="grid gap-4">
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="rounded-xl border border-white/10 bg-white/5 p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <Coffee className="h-6 w-6 text-amber-400" />
            <h3 className="text-lg text-white">Tuesday, June 25th</h3>
          </div>

          <div className="grid gap-4">
            <div className="rounded-lg bg-white/5 p-4">
              <p className="mb-1 text-sm text-amber-400">Morning Focus (9:00-11:00)</p>
              <p className="text-white/80">{tomorrowSchedule.morning}</p>
            </div>

            <div className="rounded-lg bg-white/5 p-4">
              <p className="mb-1 text-sm text-blue-400">Afternoon Sprint (11:00-17:00)</p>
              <p className="text-white/80">{tomorrowSchedule.afternoon}</p>
            </div>

            <div className="rounded-lg bg-white/5 p-4">
              <p className="mb-1 text-sm text-purple-400">Evening Wrap-up (17:00-18:00)</p>
              <p className="text-white/80">{tomorrowSchedule.evening}</p>
            </div>
          </div>

          <div className="mt-4 border-t border-white/10 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/60">Main Deliverable</p>
                <p className="text-white">{tomorrowSchedule.deliverable}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-white/40" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Preparation Checklist */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 text-lg text-white">Set Yourself Up for Success</h3>
        <div className="space-y-3">
          {[
            'Charge all devices tonight',
            'Prepare healthy snacks and water',
            'Review GitHub Stats CLI requirements',
            'Set 3 clear goals for tomorrow',
            'Get 7-8 hours of sleep',
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-white/70">
              <Circle className="h-4 w-4 text-white/30" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Reflection View
const ReflectionView = ({ _config, done }: { _config: RoadmapConfig; done: Set<string> }) => {
  const completionRate = ((done.size / 20) * 100).toFixed(0); // Assuming 20 tasks today

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-6"
    >
      <h2 className="mb-6 text-2xl font-light text-white">Daily Reflection</h2>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <div className="mb-2 text-3xl font-light text-green-400">{completionRate}%</div>
          <p className="text-sm text-white/60">Task Completion</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <div className="mb-2 text-3xl font-light text-purple-400">5.5h</div>
          <p className="text-sm text-white/60">Time Invested</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
          <div className="mb-2 text-3xl font-light text-blue-400">A-</div>
          <p className="text-sm text-white/60">Daily Grade</p>
        </div>
      </div>

      {/* Reflection Prompts */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        <h3 className="mb-4 text-lg text-white">Reflection Prompts</h3>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm text-white/60">What was your biggest win today?</p>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white/80 placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
              placeholder="Successfully implemented async functions in Python..."
              rows={2}
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-white/60">What challenged you the most?</p>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white/80 placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
              placeholder="Understanding decorators took longer than expected..."
              rows={2}
            />
          </div>
          <div>
            <p className="mb-2 text-sm text-white/60">What will you do differently tomorrow?</p>
            <textarea
              className="w-full rounded-lg border border-white/10 bg-white/5 p-3 text-white/80 placeholder-white/30 focus:border-purple-500/50 focus:outline-none"
              placeholder="Start with the hardest task when energy is highest..."
              rows={2}
            />
          </div>
        </div>

        <button className="mt-4 rounded-lg border border-purple-500/30 bg-purple-500/20 px-6 py-2 text-white transition-all hover:bg-purple-500/30">
          Save Reflection
        </button>
      </div>
    </motion.div>
  );
};
