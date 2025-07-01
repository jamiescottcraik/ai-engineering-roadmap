'use client';

import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Code,
  GitBranch,
  Target,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { BrowserContainer } from '@/components/BrowserContainer';
import { GlassCard } from '@/components/enhanced/GlassComponents';
import { LearningDashboard } from '@/components/LearningDashboard';

interface TimeInfo {
  currentTime: string;
  dayOfWeek: string;
  date: string;
  week: number;
  phase: string;
  daysElapsed: number;
  daysRemaining: number;
  progressPercentage: number;
}

interface DailyStatus {
  commitsMade: number;
  recallSaves: number;
  hoursLearned: number;
  tasksCompleted: number;
}

export default function Home() {
  const [timeInfo, setTimeInfo] = useState<TimeInfo>({
    currentTime: '20:10:00',
    dayOfWeek: 'Monday',
    date: '2025-06-24',
    week: 1,
    phase: 'Python Mastery & Foundations',
    daysElapsed: 4,
    daysRemaining: 332,
    progressPercentage: 0.8,
  });

  const [dailyStatus] = useState<DailyStatus>({
    commitsMade: 3,
    recallSaves: 12,
    hoursLearned: 3.5,
    tasksCompleted: 5,
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Update time info
    const updateTimeInfo = () => {
      const now = new Date();
      const startDate = new Date('2025-06-21');
      const endDate = new Date('2026-05-22');

      const daysElapsed = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalDays = Math.floor(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      const daysRemaining = totalDays - daysElapsed;

      const weekNumber = Math.ceil((daysElapsed + 1) / 7);
      const phase = getPhaseByWeek(weekNumber);

      setTimeInfo({
        currentTime: now.toLocaleTimeString('en-US', { hour12: false }),
        dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
        date: now.toISOString().split('T')[0],
        week: weekNumber,
        phase: phase,
        daysElapsed: daysElapsed,
        daysRemaining: daysRemaining,
        progressPercentage: (daysElapsed / totalDays) * 100,
      });
    };

    updateTimeInfo();
    const interval = setInterval(updateTimeInfo, 1000);

    return () => clearInterval(interval);
  }, []);

  const getPhaseByWeek = (week: number): string => {
    if (week <= 8) return 'Phase 1: Python Mastery & Foundations';
    if (week <= 20) return 'Phase 2: Machine Learning & Deep Learning';
    if (week <= 32) return 'Phase 3: LLMs & Generative AI';
    if (week <= 40) return 'Phase 4: MLOps & Production Systems';
    if (week <= 44) return 'Phase 5: AI Safety & Open Source';
    return 'Phase 6: Specialization & Leadership';
  };

  const todaysTasks = [
    { task: 'Complete LinkedIn post about journey', time: '20 min', urgent: true },
    { task: 'Finish blog post draft', time: '40 min', urgent: true },
    { task: 'Review Recall.ai saves', time: '15 min', urgent: false },
    { task: 'Push GitHub commits', time: '10 min', urgent: false },
  ];

  const quickLinks = [
    { name: 'Recall.ai', icon: Brain, url: 'https://www.getrecall.ai/', color: 'purple' },
    {
      name: 'Python Course',
      icon: Code,
      url: 'https://www.coursera.org/specializations/python',
      color: 'blue',
    },
    { name: 'GitHub', icon: GitBranch, url: 'https://github.com/jamiescottcraik', color: 'green' },
    { name: 'Dev.to Blog', icon: BookOpen, url: 'https://dev.to/jamiescottcraik', color: 'indigo' },
  ];

  if (!mounted) return null;

  return (
    <BrowserContainer title="brAInwav - AI Engineering Roadmap 2025">
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-orange-50 dark:from-slate-900 dark:via-blue-900 dark:to-gray-900">
        <div className="bg-grid-pattern absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"></div>
        <div className="container relative mx-auto px-6 py-8">
          {/* Live Status Bar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GlassCard className="bg-gradient-to-r from-blue-500/10 to-pink-500/10 p-4">
              <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    <span className="font-mono text-white">{timeInfo.currentTime} UTC</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-400" />
                    <span className="text-white">
                      {timeInfo.dayOfWeek}, {timeInfo.date}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#16C784' }}>
                      {timeInfo.week}
                    </div>
                    <div className="text-xs text-white/60">Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#FFD600' }}>
                      {dailyStatus.commitsMade}
                    </div>
                    <div className="text-xs text-white/60">Commits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#FF2D7E' }}>
                      {dailyStatus.recallSaves}
                    </div>
                    <div className="text-xs text-white/60">Recalls</div>
                  </div>{' '}
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#0F4CFF' }}>
                      {dailyStatus.hoursLearned}h
                    </div>
                    <div className="text-xs text-white/60">Learned</div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="mb-1 flex items-center justify-between text-sm text-white/60">
                  <span>Overall Progress</span>
                  <span>{timeInfo.progressPercentage.toFixed(1)}% Complete</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${timeInfo.progressPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-500 to-pink-500"
                    style={{
                      background: `linear-gradient(90deg, #0F4CFF 0%, #FF6600 100%)`,
                    }}
                  />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-white/50">
                  <span>{timeInfo.daysElapsed} days completed</span>
                  <span>{timeInfo.daysRemaining} days remaining</span>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <header className="mb-12 text-center">
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <GlassCard variant="island" className="h-24 w-24 p-4">
                <Image
                  src="/brAInwav-new.png"
                  alt="brAInwav Logo"
                  width={64}
                  height={64}
                  className="h-full w-full object-contain"
                  priority
                />
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="mb-2 text-6xl font-extrabold text-white">
                br<span style={{ color: '#FF6600' }}>AI</span>nwav
              </h1>
              <p className="mb-4 text-lg font-semibold text-pink-600 dark:text-pink-400">
                Welcome back, jamiescottcraik! 👋
              </p>
              <p className="mx-auto max-w-4xl px-4 text-xl leading-relaxed text-gray-600 dark:text-gray-300">
                {timeInfo.phase} • Building GitHub Stats CLI
              </p>
            </motion.div>

            {/* Today's Focus Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-8 max-w-2xl"
            >
              <GlassCard className="border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6">
                <h3 className="mb-4 flex items-center justify-center gap-2 text-lg font-bold text-white">
                  <Zap className="h-5 w-5" style={{ color: '#FFD600' }} />
                  Today&apos;s Immediate Actions
                </h3>
                <div className="space-y-3">
                  {todaysTasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {task.urgent ? (
                          <AlertCircle className="h-4 w-4 text-red-400" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        )}
                        <span className="text-white/80">{task.task}</span>
                      </div>
                      <span className="text-white/60">{task.time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-white/60">
                    ⏰ {4 - parseInt(timeInfo.currentTime.split(':')[0]) + 20} hours until daily
                    deadline
                  </p>
                </div>
              </GlassCard>
            </motion.div>

            {/* 2025 Roadmap CTA */}
            <motion.div
              className="mt-8 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/roadmap-2025" className="group">
                <GlassCard
                  variant="card"
                  className="border-pink-500/30 bg-gradient-to-r from-blue-500/20 to-pink-500/20 px-10 py-6 transition-all duration-300 group-hover:scale-105 group-hover:border-pink-400/50"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="text-4xl"
                      animate={{ rotate: [0, 10, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      🧩
                    </motion.div>
                    <div className="text-left">
                      <div className="flex items-center gap-2 text-xl font-bold text-white">
                        2025 AI Engineering Roadmap
                        <ArrowRight
                          className="h-5 w-5 transition-transform group-hover:translate-x-1"
                          style={{ color: '#FF2D7E' }}
                        />
                      </div>
                      <div className="text-sm text-white/70">
                        48-Week Complete Learning Path • Recall.ai Enhanced
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-xs">
                        <span className="flex items-center gap-1" style={{ color: '#16C784' }}>
                          <CheckCircle className="h-3 w-3" />
                          Week {timeInfo.week} in Progress
                        </span>
                        <span className="flex items-center gap-1" style={{ color: '#0F4CFF' }}>
                          <Target className="h-3 w-3" />
                          {100 - Number(timeInfo.progressPercentage.toFixed(0))}% to go
                        </span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>

              {/* Quick Links */}
              <div className="flex items-center gap-3">
                {quickLinks.map((link, index) => {
                  const Icon = link.icon;
                  return (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <GlassCard
                        className={`p-3 transition-all duration-200 group-hover:scale-110 bg-${link.color}-500/20 border-${link.color}-500/30`}
                      >
                        <Icon className="h-5 w-5 text-white/80" />
                      </GlassCard>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            <motion.div
              className="mx-auto mt-8 h-px max-w-2xl bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </header>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            <LearningDashboard />
          </motion.div>

          {/* Motivational Quote */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <GlassCard className="inline-block bg-gradient-to-r from-blue-500/10 to-pink-500/10 px-8 py-4">
              <p className="italic text-white/80">
                &ldquo;Every expert was once a beginner who refused to give up.&rdquo;
              </p>
              <p className="mt-2 text-sm text-white/60">- Keep building, keep learning 🚀</p>
            </GlassCard>
          </motion.div>
        </div>
      </main>
    </BrowserContainer>
  );
}
