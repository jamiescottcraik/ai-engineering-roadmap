/**
 * ProgressTracker - Veteran AI Engineering Analytics Dashboard
 * 
 * Displays progress analytics, milestones, and motivational insights
 * specifically designed for veterans on their AI engineering journey.
 * 
 * @author GitHub Copilot (ai-assisted)
 * @adheresTo /.ai/AGENT.md §2 (Core Requirements), §3.2 (Error Handling)
 */

'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Award, 
  BookOpen, 
  Users,
  Star,
  CheckCircle,
  BarChart3,
  Trophy
} from 'lucide-react';
import { useVeteranRoadmap } from '../context/VeteranRoadmapProvider';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

function ProgressCard({ title, value, subtitle, icon, color, progress }: ProgressCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        {progress !== undefined && (
          <div className="text-sm text-gray-500">{progress}%</div>
        )}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm font-medium text-gray-700">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500">{subtitle}</div>
        )}
        {progress !== undefined && (
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

interface PhaseProgressProps {
  phaseId: string;
  title: string;
  progress: number;
  color: string;
}

function PhaseProgress({ phaseId, title, progress, color }: PhaseProgressProps) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        <div className="text-xs text-gray-500">Phase {phaseId.charAt(phaseId.length - 1)}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-gray-900">{Math.round(progress)}%</div>
        <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
          <div 
            className={`h-1.5 rounded-full transition-all duration-300 ${color.replace('bg-', 'bg-opacity-70 bg-')}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ProgressTracker() {
  const { state } = useVeteranRoadmap();
  const [activeTab, setActiveTab] = useState<'overview' | 'phases' | 'milestones' | 'insights'>('overview');

  const { analytics, nodeProgress, milestones } = state;

  // Calculate time-based metrics
  const hoursSpent = Math.round(analytics.totalTimeSpent / 60 * 10) / 10;
  const weeklyProgress = (analytics.weeklyGoals.actualMinutes / analytics.weeklyGoals.targetMinutes) * 100;

  // Phase data for visualization
  const phaseData = [
    { id: 'phase1', title: 'Technical Foundations', progress: analytics.phaseProgress.phase1 || 0, color: 'bg-blue-500' },
    { id: 'phase2', title: 'ML/DL & Production', progress: analytics.phaseProgress.phase2 || 0, color: 'bg-purple-500' },
    { id: 'phase3', title: 'Systems & MLOps', progress: analytics.phaseProgress.phase3 || 0, color: 'bg-green-500' },
    { id: 'phase4', title: 'Strategic Leadership', progress: analytics.phaseProgress.phase4 || 0, color: 'bg-orange-500' },
    { id: 'phase5', title: 'Industry Impact', progress: analytics.phaseProgress.phase5 || 0, color: 'bg-red-500' }
  ];

  // Recent achievements
  const recentCompletions = Object.entries(nodeProgress)
    .filter(([, progress]) => progress.status === 'completed' && progress.completedAt)
    .sort((a, b) => new Date(b[1].completedAt!).getTime() - new Date(a[1].completedAt!).getTime())
    .slice(0, 5);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'phases', label: 'Phases', icon: <Target className="w-4 h-4" /> },
    { id: 'milestones', label: 'Milestones', icon: <Trophy className="w-4 h-4" /> },
    { id: 'insights', label: 'Veteran Insights', icon: <Users className="w-4 h-4" /> }
  ];

  return (
    <div className="bg-white shadow-sm border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Progress Dashboard</h2>
        <p className="text-gray-600">Track your AI engineering transformation journey</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b bg-gray-50">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'overview' | 'phases' | 'milestones' | 'insights')}
            className={`px-4 py-3 flex items-center space-x-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-500 bg-white text-blue-600'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <ProgressCard
                title="Nodes Completed"
                value={analytics.nodesCompleted}
                subtitle="Learning milestones achieved"
                icon={<CheckCircle className="w-5 h-5 text-white" />}
                color="bg-green-500"
              />
              <ProgressCard
                title="Study Time"
                value={`${hoursSpent}h`}
                subtitle="Total learning investment"
                icon={<Clock className="w-5 h-5 text-white" />}
                color="bg-blue-500"
              />
              <ProgressCard
                title="Average Mastery"
                value={`${Math.round(analytics.averageMastery * 10) / 10}/5`}
                subtitle="Knowledge retention score"
                icon={<Star className="w-5 h-5 text-white" />}
                color="bg-yellow-500"
              />
              <ProgressCard
                title="Weekly Goal"
                value={`${Math.round(weeklyProgress)}%`}
                subtitle={`${analytics.weeklyGoals.actualMinutes}/${analytics.weeklyGoals.targetMinutes} min`}
                icon={<Target className="w-5 h-5 text-white" />}
                color="bg-purple-500"
                progress={weeklyProgress}
              />
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Recent Achievements
              </h3>
              {recentCompletions.length > 0 ? (
                <div className="space-y-2">
                  {recentCompletions.map(([nodeId, progress]) => (
                    <div key={nodeId} className="flex items-center justify-between p-2 bg-white rounded border">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">{nodeId.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < progress.masteryLevel ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {progress.completedAt && new Date(progress.completedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Complete your first learning node to see achievements here!</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'phases' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">5-Phase Learning Journey</h3>
            {phaseData.map((phase) => (
              <PhaseProgress
                key={phase.id}
                phaseId={phase.id}
                title={phase.title}
                progress={phase.progress}
                color={phase.color}
              />
            ))}
          </div>
        )}

        {activeTab === 'milestones' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Certification Milestones</h3>
            {milestones.length > 0 ? (
              <div className="space-y-3">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <Award className="w-5 h-5 text-yellow-600" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                      <p className="text-sm text-gray-600">{milestone.description}</p>
                      {milestone.completedAt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Completed: {new Date(milestone.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Complete phase milestones to unlock certifications!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 mb-4">Veteran Learning Insights</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Military Experience Advantage</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your military background provides strong foundations in systems thinking, 
                    discipline, and problem-solving - key skills for AI engineering success.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Learning Strategy</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Focus on hands-on projects and real-world applications. 
                    Your practical approach to learning aligns well with AI engineering demands.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom veteran insights from completed nodes */}
            {Object.entries(nodeProgress)
              .filter(([, progress]) => progress.veteranInsights)
              .map(([nodeId, progress]) => (
                <div key={nodeId} className="bg-gray-50 border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    {nodeId.replace(/_/g, ' ')} - Personal Insight
                  </h4>
                  <p className="text-sm text-gray-700 italic">&ldquo;{progress.veteranInsights}&rdquo;</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}