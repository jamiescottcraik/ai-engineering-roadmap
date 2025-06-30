'use client';

import { motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Github,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

// Modern Background with animated gradient orbs
export const ModernBackground = () => (
  <div className="pointer-events-none fixed inset-0 overflow-hidden">
    {/* Animated gradient orbs with brAInwav colors */}
    <div
      className="animate-blob absolute -right-40 -top-40 h-80 w-80 rounded-full blur-[100px]"
      style={{ backgroundColor: 'rgba(15, 76, 255, 0.3)' }}
    />
    <div
      className="animate-blob animation-delay-2000 absolute -bottom-40 -left-40 h-80 w-80 rounded-full blur-[100px]"
      style={{ backgroundColor: 'rgba(255, 102, 0, 0.3)' }}
    />
    <div
      className="animate-blob animation-delay-4000 absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
      style={{ backgroundColor: 'rgba(255, 45, 126, 0.2)' }}
    />

    {/* Grid pattern overlay */}
    <div className="bg-grid-pattern absolute inset-0 opacity-20" />

    {/* Noise texture */}
    <div className="absolute inset-0 opacity-50">
      <svg className="h-full w-full">
        <filter id="noiseFilter">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.65"
            numOctaves="4"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" opacity="0.05" />
      </svg>
    </div>
  </div>
);

// Enhanced Glass Card with brAInwav colors
interface EnhancedGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  glow?: boolean;
}

export const EnhancedGlassCard: React.FC<EnhancedGlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  glow = false,
}) => {
  const variants = {
    default: 'bg-white/5 border-white/10',
    primary: 'border-blue-500/20',
    success: 'border-green-500/20',
    warning: 'border-yellow-500/20',
    danger: 'border-red-500/20',
  };

  const glowColors = {
    default: 'shadow-purple-500/20',
    primary: 'shadow-blue-500/20',
    success: 'shadow-green-500/20',
    warning: 'shadow-yellow-500/20',
    danger: 'shadow-red-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`
        relative overflow-hidden rounded-2xl border backdrop-blur-xl
        ${variants[variant]}
        ${glow ? `shadow-2xl ${glowColors[variant]}` : 'shadow-lg shadow-black/10'}
        ${className}
      `}
      style={{
        background:
          variant === 'primary'
            ? 'rgba(15, 76, 255, 0.1)'
            : variant === 'success'
              ? 'rgba(22, 199, 132, 0.1)'
              : variant === 'warning'
                ? 'rgba(255, 214, 0, 0.1)'
                : variant === 'danger'
                  ? 'rgba(255, 62, 62, 0.1)'
                  : 'rgba(255, 255, 255, 0.05)',
      }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Hover gradient with brAInwav colors */}
      <div
        className="absolute inset-0 opacity-0 transition-all duration-500 hover:opacity-100"
        style={{
          background:
            'linear-gradient(135deg, rgba(15, 76, 255, 0.1) 0%, rgba(255, 102, 0, 0.1) 100%)',
        }}
      />
    </motion.div>
  );
};

// Modern Header Component
interface ModernHeaderProps {
  config: any;
  liveStatus: any;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ config, liveStatus }) => {
  const stats = [
    { label: 'Commits Today', value: 3, icon: Github, color: '#16C784' },
    { label: 'Recall Saves', value: 12, icon: Brain, color: '#0F4CFF' },
    { label: 'Hours Learned', value: 3.5, icon: Clock, color: '#FF2D7E' },
    { label: 'Tasks Done', value: 7, icon: CheckCircle, color: '#FFD600' },
  ];

  return (
    <header className="relative border-b border-white/5 bg-black/20 backdrop-blur-2xl">
      {/* Animated gradient line */}
      <div
        className="animate-shimmer absolute left-0 right-0 top-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, #0F4CFF, transparent)',
        }}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Live ticker */}
        <div className="mb-4 flex items-center justify-between text-sm">
          <motion.div
            className="flex items-center gap-6 text-white/60"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="flex items-center gap-2">
              <div
                className="h-2 w-2 animate-pulse rounded-full"
                style={{ backgroundColor: '#16C784' }}
              />
              LIVE • {liveStatus.currentTime} UTC
            </span>
            <span>
              {liveStatus.dayOfWeek}, {liveStatus.currentDate}
            </span>
          </motion.div>

          {/* Mini stats */}
          <div className="hidden items-center gap-4 md:flex">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2"
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                <span className="font-mono text-white/80">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main header content */}
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              className="mb-2 text-4xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span className="text-white">
                br<span style={{ color: '#FF6600' }}>AI</span>nwav Engineering Roadmap 2025
              </span>
            </motion.h1>
            <motion.p
              className="text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Week {config?.currentWeek?.weekNumber || 1} of 48 • Python Mastery Phase
            </motion.p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <EnhancedGlassCard variant="warning" className="px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 animate-pulse" style={{ color: '#FF6600' }} />
                <span className="font-medium text-white">4 day streak</span>
              </div>
            </EnhancedGlassCard>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="rounded-lg px-6 py-2 font-medium text-white shadow-lg transition-all"
              style={{
                background: 'linear-gradient(135deg, #0F4CFF 0%, #FF2D7E 100%)',
                boxShadow: '0 8px 32px rgba(15, 76, 255, 0.25)',
              }}
            >
              Start Today&apos;s Session
            </motion.button>
          </div>
        </div>

        {/* Energy bar */}
        <motion.div
          className="mt-4 rounded-lg border p-3"
          style={{
            background:
              'linear-gradient(90deg, rgba(255, 214, 0, 0.1) 0%, rgba(255, 102, 0, 0.1) 100%)',
            borderColor: 'rgba(255, 214, 0, 0.2)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-sm" style={{ color: '#FFD600' }}>
              <Sparkles className="animate-spin-slow h-4 w-4" />
              {liveStatus.focusRecommendation}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-white/60">Energy Level:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-4 w-2 rounded transition-all duration-300"
                    style={{
                      background:
                        i <=
                        (liveStatus.energyLevel === 'high'
                          ? 3
                          : liveStatus.energyLevel === 'medium'
                            ? 2
                            : 1)
                          ? 'linear-gradient(to top, #16C784, #22C55E)'
                          : 'rgba(255, 255, 255, 0.1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

// Modern Navigation Component
interface ModernNavProps {
  active: string;
  onChange: (tab: string) => void;
}

export const ModernNav: React.FC<ModernNavProps> = ({ active, onChange }) => {
  const tabs = [
    { id: 'today', label: "Today's Focus", icon: Target, urgent: true },
    { id: 'week', label: 'Week View', icon: Calendar },
    { id: 'phases', label: 'Journey', icon: BarChart3 },
    { id: 'platforms', label: 'Learn', icon: BookOpen },
    { id: 'recall', label: 'Knowledge', icon: Brain },
    { id: 'actions', label: 'Actions', icon: Zap },
    { id: 'metrics', label: 'Progress', icon: Trophy },
  ];

  return (
    <nav className="container mx-auto px-4 py-6">
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative rounded-xl px-4 py-2 font-medium transition-all"
            style={{
              background:
                active === tab.id
                  ? 'linear-gradient(135deg, #0F4CFF 0%, #FF2D7E 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
              color: active === tab.id ? '#FFFFFF' : 'rgba(255, 255, 255, 0.8)',
              boxShadow: active === tab.id ? '0 8px 32px rgba(15, 76, 255, 0.25)' : 'none',
            }}
          >
            <div className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.urgent && active !== tab.id && (
                <span
                  className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full"
                  style={{ backgroundColor: '#FF3E3E' }}
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </nav>
  );
};

// Task Item Component
interface TaskItemProps {
  task: string | { task: string; time?: string };
  index: number;
  done: Set<string>;
  toggle: (id: string) => void;
  prefix: string;
  urgent?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  index,
  done,
  toggle,
  prefix,
  urgent = false,
}) => {
  const taskId = `${prefix}-${index}`;
  const isCompleted = done.has(taskId);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ x: 5 }}
      onClick={() => toggle(taskId)}
      className="group flex cursor-pointer items-start gap-3"
    >
      <motion.div
        animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {isCompleted ? (
          <CheckCircle className="mt-0.5 h-5 w-5" style={{ color: '#16C784' }} />
        ) : (
          <Circle
            className="mt-0.5 h-5 w-5 transition-colors group-hover:text-white/60"
            style={{ color: urgent ? '#FF3E3E' : 'rgba(255, 255, 255, 0.4)' }}
          />
        )}
      </motion.div>
      <div className="flex-1">
        <p
          className={`${isCompleted ? 'line-through' : ''} transition-all`}
          style={{ color: isCompleted ? '#16C784' : '#FFFFFF' }}
        >
          {typeof task === 'string' ? task : task.task}
        </p>
        {typeof task === 'object' && task.time && (
          <span className="text-sm text-white/60">{task.time}</span>
        )}
      </div>
    </motion.div>
  );
};
