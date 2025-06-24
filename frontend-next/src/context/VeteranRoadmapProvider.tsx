/**
 * RoadmapProvider - Enhanced context for 5-phase veteran roadmap
 * 
 * Provides state management for progress tracking, analytics, and personalization
 * features specifically designed for the veteran AI engineering learning journey.
 * 
 * @author GitHub Copilot (ai-assisted)
 * @adheresTo /.ai/AGENT.md §2 (Core Requirements), §3.2 (Error Handling)
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { veteranRoadmapData } from '../data/veteranRoadmapData';

// Enhanced types for veteran-specific learning
interface VeteranLearningProgress {
  nodeId: string;
  status: 'locked' | 'todo' | 'inProgress' | 'completed' | 'needsReview';
  completedAt?: string;
  timeSpent: number; // minutes
  masteryLevel: number; // 1-5 scale
  reviewCount: number;
  nextReviewDate?: string;
  notes: string;
  veteranInsights?: string; // Veteran-specific learning insights
}

interface StudySession {
  nodeId: string;
  date: string;
  duration: number; // minutes
  focus: 'deep-work' | 'review' | 'practice' | 'project';
  effectiveness: number; // 1-5 scale
}

interface Milestone {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  completedAt?: string;
  certificateUrl?: string;
}

interface LearningAnalytics {
  totalTimeSpent: number;
  nodesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageMastery: number;
  phaseProgress: Record<string, number>; // phase completion percentage
  weakAreas: string[];
  strongAreas: string[];
  weeklyGoals: {
    targetMinutes: number;
    targetNodes: number;
    actualMinutes: number;
    actualNodes: number;
  };
}

interface VeteranRoadmapState {
  nodeProgress: Record<string, VeteranLearningProgress>;
  studySessions: StudySession[];
  milestones: Milestone[];
  analytics: LearningAnalytics;
  preferences: {
    colorMode: 'light' | 'dark' | 'high-contrast';
    studyReminders: boolean;
    weeklyGoalMinutes: number;
    focusMode: boolean;
    veteranNetworking: boolean;
  };
  expandedNodes: Set<string>;
  isLoading: boolean;
  error: string | null;
}

type VeteranRoadmapAction =
  | { type: 'LOAD_PROGRESS_SUCCESS'; payload: Partial<VeteranRoadmapState> }
  | { type: 'LOAD_PROGRESS_ERROR'; payload: string }
  | { type: 'UPDATE_NODE_PROGRESS'; payload: { nodeId: string; progress: Partial<VeteranLearningProgress> } }
  | { type: 'COMPLETE_NODE'; payload: { nodeId: string; masteryLevel: number; veteranInsights?: string } }
  | { type: 'START_NODE'; payload: string }
  | { type: 'RECORD_STUDY_SESSION'; payload: StudySession }
  | { type: 'TOGGLE_NODE_EXPANSION'; payload: string }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<VeteranRoadmapState['preferences']> }
  | { type: 'ACHIEVE_MILESTONE'; payload: Milestone };

const initialState: VeteranRoadmapState = {
  nodeProgress: {},
  studySessions: [],
  milestones: [],
  analytics: {
    totalTimeSpent: 0,
    nodesCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageMastery: 0,
    phaseProgress: {},
    weakAreas: [],
    strongAreas: [],
    weeklyGoals: {
      targetMinutes: 600, // 10 hours per week
      targetNodes: 3,
      actualMinutes: 0,
      actualNodes: 0
    }
  },
  preferences: {
    colorMode: 'light',
    studyReminders: true,
    weeklyGoalMinutes: 600,
    focusMode: false,
    veteranNetworking: true
  },
  expandedNodes: new Set(['root']),
  isLoading: false,
  error: null
};

function calculateAnalytics(nodeProgress: Record<string, VeteranLearningProgress>, studySessions: StudySession[]): LearningAnalytics {
  const completedNodes = Object.values(nodeProgress).filter(p => p.status === 'completed');
  const totalTimeSpent = studySessions.reduce((sum, session) => sum + session.duration, 0);
  const averageMastery = completedNodes.length > 0 
    ? completedNodes.reduce((sum, node) => sum + node.masteryLevel, 0) / completedNodes.length 
    : 0;

  // Calculate phase progress
  const phaseProgress: Record<string, number> = {};
  const phases = ['phase1', 'phase2', 'phase3', 'phase4', 'phase5'];
  
  phases.forEach(phaseId => {
    const phaseItem = veteranRoadmapData.items[phaseId];
    if (phaseItem?.childrenIds) {
      const completedInPhase = phaseItem.childrenIds.filter(childId => 
        nodeProgress[childId]?.status === 'completed'
      ).length;
      phaseProgress[phaseId] = (completedInPhase / phaseItem.childrenIds.length) * 100;
    }
  });

  // Calculate current week's progress
  const currentWeek = new Date();
  const weekStart = new Date(currentWeek.setDate(currentWeek.getDate() - currentWeek.getDay()));
  const weekSessions = studySessions.filter(session => 
    new Date(session.date) >= weekStart
  );
  
  const actualMinutes = weekSessions.reduce((sum, session) => sum + session.duration, 0);
  const actualNodes = new Set(weekSessions.map(s => s.nodeId)).size;

  return {
    totalTimeSpent,
    nodesCompleted: completedNodes.length,
    currentStreak: 0, // TODO: Calculate based on daily activity
    longestStreak: 0, // TODO: Calculate from historical data
    averageMastery,
    phaseProgress,
    weakAreas: [], // TODO: Identify based on low mastery scores
    strongAreas: [], // TODO: Identify based on high mastery scores
    weeklyGoals: {
      targetMinutes: 600,
      targetNodes: 3,
      actualMinutes,
      actualNodes
    }
  };
}

function veteranRoadmapReducer(state: VeteranRoadmapState, action: VeteranRoadmapAction): VeteranRoadmapState {
  switch (action.type) {
    case 'LOAD_PROGRESS_SUCCESS':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
        error: null
      };

    case 'LOAD_PROGRESS_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'UPDATE_NODE_PROGRESS': {
      const updatedProgress = {
        ...state.nodeProgress,
        [action.payload.nodeId]: {
          ...state.nodeProgress[action.payload.nodeId],
          ...action.payload.progress
        }
      };
      
      return {
        ...state,
        nodeProgress: updatedProgress,
        analytics: calculateAnalytics(updatedProgress, state.studySessions)
      };
    }

    case 'COMPLETE_NODE': {
      const { nodeId, masteryLevel, veteranInsights } = action.payload;
      const updatedProgress = {
        ...state.nodeProgress,
        [nodeId]: {
          ...state.nodeProgress[nodeId],
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
          masteryLevel,
          veteranInsights: veteranInsights || '',
          reviewCount: (state.nodeProgress[nodeId]?.reviewCount || 0) + 1
        }
      };

      return {
        ...state,
        nodeProgress: updatedProgress,
        analytics: calculateAnalytics(updatedProgress, state.studySessions)
      };
    }

    case 'START_NODE': {
      const updatedProgress = {
        ...state.nodeProgress,
        [action.payload]: {
          ...state.nodeProgress[action.payload],
          nodeId: action.payload,
          status: 'inProgress' as const,
          timeSpent: 0,
          masteryLevel: 0,
          reviewCount: 0,
          notes: ''
        }
      };

      return {
        ...state,
        nodeProgress: updatedProgress
      };
    }

    case 'RECORD_STUDY_SESSION': {
      const updatedSessions = [...state.studySessions, action.payload];
      
      return {
        ...state,
        studySessions: updatedSessions,
        analytics: calculateAnalytics(state.nodeProgress, updatedSessions)
      };
    }

    case 'TOGGLE_NODE_EXPANSION': {
      const newExpanded = new Set(state.expandedNodes);
      if (newExpanded.has(action.payload)) {
        newExpanded.delete(action.payload);
      } else {
        newExpanded.add(action.payload);
      }
      
      return {
        ...state,
        expandedNodes: newExpanded
      };
    }

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case 'ACHIEVE_MILESTONE':
      return {
        ...state,
        milestones: [...state.milestones, action.payload]
      };

    default:
      return state;
  }
}

interface VeteranRoadmapContextType {
  state: VeteranRoadmapState;
  actions: {
    completeNode: (nodeId: string, masteryLevel: number, veteranInsights?: string) => void;
    startNode: (nodeId: string) => void;
    recordStudySession: (session: StudySession) => void;
    toggleNodeExpansion: (nodeId: string) => void;
    updatePreferences: (preferences: Partial<VeteranRoadmapState['preferences']>) => void;
    achieveMilestone: (milestone: Milestone) => void;
  };
}

const VeteranRoadmapContext = createContext<VeteranRoadmapContextType | undefined>(undefined);

export function VeteranRoadmapProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(veteranRoadmapReducer, initialState);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('veteran-roadmap-progress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        dispatch({
          type: 'LOAD_PROGRESS_SUCCESS',
          payload: {
            ...parsed,
            expandedNodes: new Set(parsed.expandedNodes || ['root'])
          }
        });
      }
    } catch (error) {
      dispatch({
        type: 'LOAD_PROGRESS_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to load progress'
      });
    }
  }, []);

  // Save progress to localStorage when state changes
  useEffect(() => {
    try {
      const saveData = {
        nodeProgress: state.nodeProgress,
        studySessions: state.studySessions,
        milestones: state.milestones,
        preferences: state.preferences,
        expandedNodes: Array.from(state.expandedNodes)
      };
      localStorage.setItem('veteran-roadmap-progress', JSON.stringify(saveData));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [state.nodeProgress, state.studySessions, state.milestones, state.preferences, state.expandedNodes]);

  const actions = {
    completeNode: (nodeId: string, masteryLevel: number, veteranInsights?: string) => {
      dispatch({ type: 'COMPLETE_NODE', payload: { nodeId, masteryLevel, veteranInsights } });
    },
    
    startNode: (nodeId: string) => {
      dispatch({ type: 'START_NODE', payload: nodeId });
    },
    
    recordStudySession: (session: StudySession) => {
      dispatch({ type: 'RECORD_STUDY_SESSION', payload: session });
    },
    
    toggleNodeExpansion: (nodeId: string) => {
      dispatch({ type: 'TOGGLE_NODE_EXPANSION', payload: nodeId });
    },
    
    updatePreferences: (preferences: Partial<VeteranRoadmapState['preferences']>) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    },
    
    achieveMilestone: (milestone: Milestone) => {
      dispatch({ type: 'ACHIEVE_MILESTONE', payload: milestone });
    }
  };

  return (
    <VeteranRoadmapContext.Provider value={{ state, actions }}>
      {children}
    </VeteranRoadmapContext.Provider>
  );
}

export function useVeteranRoadmap() {
  const context = useContext(VeteranRoadmapContext);
  if (!context) {
    throw new Error('useVeteranRoadmap must be used within VeteranRoadmapProvider');
  }
  return context;
}