import { motion } from 'framer-motion';
import { BarChart3, Calendar, Clock, Target, TrendingUp, Trophy } from 'lucide-react';
import { useMemo } from 'react';

interface ProgressAnalyticsProps {
  className?: string;
}

export default function ProgressAnalytics({ className = '' }: ProgressAnalyticsProps) {
  // Mock data - in real app, this would come from localStorage, API, or state management
  const analyticsData = useMemo(
    () => ({
      weeklyProgress: [
        { week: 'Week 1', completed: 85, target: 100 },
        { week: 'Week 2', completed: 92, target: 100 },
        { week: 'Week 3', completed: 78, target: 100 },
        { week: 'Week 4', completed: 95, target: 100 },
      ],
      streakData: {
        current: 4,
        longest: 7,
        thisMonth: 18,
      },
      timeInvested: {
        today: 5.5,
        week: 32,
        month: 128,
      },
      skillProgress: [
        { skill: 'Python', progress: 78, target: 90 },
        { skill: 'Git/GitHub', progress: 85, target: 95 },
        { skill: 'Data Structures', progress: 65, target: 80 },
        { skill: 'Web Development', progress: 45, target: 70 },
      ],
    }),
    []
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-6 flex items-center gap-3">
          <BarChart3 className="h-6 w-6 text-purple-400" />
          <h2 className="text-xl font-light text-white">Learning Analytics</h2>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="mb-1 text-2xl font-light text-green-400">
              {analyticsData.streakData.current}
            </div>
            <p className="text-xs text-white/60">Day Streak</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="mb-1 text-2xl font-light text-blue-400">
              {analyticsData.timeInvested.today}h
            </div>
            <p className="text-xs text-white/60">Today</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="mb-1 text-2xl font-light text-purple-400">
              {analyticsData.timeInvested.week}h
            </div>
            <p className="text-xs text-white/60">This Week</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4 text-center">
            <div className="mb-1 text-2xl font-light text-amber-400">92%</div>
            <p className="text-xs text-white/60">Avg Completion</p>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg text-white/80">Weekly Progress</h3>
          <div className="space-y-3">
            {analyticsData.weeklyProgress.map((week, index) => (
              <div key={week.week} className="flex items-center gap-4">
                <div className="w-16 text-sm text-white/60">{week.week}</div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${week.completed}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                    />
                  </div>
                </div>
                <div className="w-12 text-sm text-white/60">{week.completed}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Progress */}
        <div>
          <h3 className="mb-4 text-lg text-white/80">Skill Development</h3>
          <div className="space-y-3">
            {analyticsData.skillProgress.map((skill, index) => (
              <div key={skill.skill} className="flex items-center gap-4">
                <div className="w-24 text-sm text-white/60">{skill.skill}</div>
                <div className="flex-1">
                  <div className="h-2 rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.progress}%` }}
                      transition={{ delay: index * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${
                        skill.progress >= skill.target
                          ? 'bg-green-500'
                          : skill.progress >= skill.target * 0.8
                            ? 'bg-amber-500'
                            : 'bg-purple-500'
                      }`}
                    />
                  </div>
                </div>
                <div className="w-16 text-sm text-white/60">
                  {skill.progress}/{skill.target}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-white/10 bg-white/5 p-6"
      >
        <div className="mb-4 flex items-center gap-3">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h3 className="text-lg text-white/80">Recent Achievements</h3>
        </div>
        <div className="space-y-3">
          {[
            { title: '7-Day Streak Master', date: 'Yesterday', icon: Target },
            { title: 'Python Chapter Complete', date: 'Today', icon: TrendingUp },
            { title: 'First GitHub PR', date: '2 days ago', icon: Calendar },
            { title: 'Study Marathon', date: '3 days ago', icon: Clock },
          ].map((achievement, _index) => (
            <motion.div
              key={achievement.title}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 rounded-lg bg-white/5 p-3"
            >
              <achievement.icon className="h-4 w-4 text-amber-400" />
              <div className="flex-1">
                <p className="text-sm text-white/80">{achievement.title}</p>
                <p className="text-xs text-white/50">{achievement.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6"
      >
        <h3 className="mb-4 text-lg text-white/80">AI Insights</h3>
        <div className="space-y-3 text-sm text-white/70">
          <p>
            🎯 <strong>Focus Area:</strong> Your Python progress is accelerating! Consider diving
            deeper into OOP concepts this week.
          </p>
          <p>
            📊 <strong>Pattern:</strong> You&apos;re most productive between 9-11 AM. Schedule
            challenging topics during this window.
          </p>
          <p>
            🚀 <strong>Next Goal:</strong> You&apos;re 78% to your Python milestone. 3 more focused
            sessions should get you there!
          </p>
        </div>
      </motion.div>
    </div>
  );
}
