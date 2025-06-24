/**
 * Learning Context Provider
 * 
 * Manages learning progress, spaced repetition, and analytics for the AI roadmap.
 * Integrates with the migrated roadmap data structure.
 * 
 * @author GitHub Copilot (ai-assisted)
 * @adheresTo /.ai/AGENT.md §2 (Core Requirements), §3.2 (Error Handling)
 */

'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Types for the new learning node structure
interface LearningNode {
  id: string;
  title: string;
  type: 'concept' | 'practice' | 'project' | 'assessment';
  phase: string;
  position: { x: number; y: number };
  prerequisites: string[];
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  learningObjectives: string[];
  content: {
    resources: Resource[];
    exercises?: Exercise[];
    project?: Project;
  };
  progress: {
    status: 'locked' | 'available' | 'in_progress' | 'completed';
    completedAt?: string;
    lastReviewedAt?: string;
    masteryLevel: number; // 0-100
    reviewCount: number;
    nextReviewDate?: string;
  };
  metadata: {
    tags: string[];
    skills: string[];
    createdAt: string;
    updatedAt: string;
  };
}

interface Resource {
  id: string;
  title: string;
  type: 'course' | 'tutorial' | 'documentation' | 'book' | 'video' | 'practice';
  url: string;
  description: string;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isOptional: boolean;
  provider?: string;
}

interface Exercise {
  id: string;
  title: string;
  description: string;
  type: 'coding' | 'quiz' | 'reflection' | 'analysis';
  estimatedTime: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  deliverables: string[];
  acceptanceCriteria: string[];
  estimatedHours: number;
  skills: string[];
}

interface Checkpoint {
  id: string;
  title: string;
  description: string;
  requiredNodes: string[];
  criteria: string[];
  phase: string;
  order: number;
}

interface LearningAnalytics {
  totalNodes: number;
  completedNodes: number;
  inProgressNodes: number;
  totalHours: number;
  completedHours: number;
  currentStreak: number;
  longestStreak: number;
  averageMasteryLevel: number;
  skillsAcquired: string[];
  dailyProgress: Array<{
    date: string;
    nodesCompleted: number;
    hoursStudied: number;
  }>;
}

interface LearningState {
  nodes: LearningNode[];
  checkpoints: Checkpoint[];
  analytics: LearningAnalytics;
  currentPhase: string;
  preferences: {
    dailyGoalHours: number;
    reminderTime: string;
    difficultyPreference: 'beginner' | 'intermediate' | 'advanced';
    learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  };
  isLoading: boolean;
  error: string | null;
}

type LearningAction =
  | { type: 'LOAD_ROADMAP_SUCCESS'; payload: { nodes: LearningNode[]; checkpoints: Checkpoint[] } }
  | { type: 'LOAD_ROADMAP_ERROR'; payload: string }
  | { type: 'UPDATE_NODE_PROGRESS'; payload: { nodeId: string; progress: Partial<LearningNode['progress']> } }
  | { type: 'COMPLETE_NODE'; payload: { nodeId: string; masteryLevel: number } }
  | { type: 'START_NODE'; payload: string }
  | { type: 'SCHEDULE_REVIEW'; payload: { nodeId: string; reviewDate: string } }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<LearningState['preferences']> }
  | { type: 'RECORD_STUDY_SESSION'; payload: { nodeId: string; duration: number } };

const initialState: LearningState = {
  nodes: [],
  checkpoints: [],
  analytics: {
    totalNodes: 0,
    completedNodes: 0,
    inProgressNodes: 0,
    totalHours: 0,
    completedHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageMasteryLevel: 0,
    skillsAcquired: [],
    dailyProgress: []
  },
  currentPhase: 'phase1',
  preferences: {
    dailyGoalHours: 2,
    reminderTime: '09:00',
    difficultyPreference: 'intermediate',
    learningStyle: 'mixed'
  },
  isLoading: false,
  error: null
};

function learningReducer(state: LearningState, action: LearningAction): LearningState {
  switch (action.type) {
    case 'LOAD_ROADMAP_SUCCESS':
      return {
        ...state,
        nodes: action.payload.nodes,
        checkpoints: action.payload.checkpoints,
        analytics: calculateAnalytics(action.payload.nodes),
        isLoading: false,
        error: null
      };

    case 'LOAD_ROADMAP_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    case 'UPDATE_NODE_PROGRESS':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.nodeId
            ? { ...node, progress: { ...node.progress, ...action.payload.progress } }
            : node
        )
      };

    case 'COMPLETE_NODE':
      const updatedNodes = state.nodes.map(node =>
        node.id === action.payload.nodeId
          ? {
              ...node,
              progress: {
                ...node.progress,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                masteryLevel: action.payload.masteryLevel,
                reviewCount: node.progress.reviewCount + 1,
                nextReviewDate: calculateNextReviewDate(node.progress.reviewCount + 1)
              }
            }
          : node
      );

      // Unlock dependent nodes
      const unlockedNodes = updateNodeAvailability(updatedNodes);

      return {
        ...state,
        nodes: unlockedNodes,
        analytics: calculateAnalytics(unlockedNodes)
      };

    case 'START_NODE':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload
            ? { ...node, progress: { ...node.progress, status: 'in_progress' } }
            : node
        )
      };

    case 'SCHEDULE_REVIEW':
      return {
        ...state,
        nodes: state.nodes.map(node =>
          node.id === action.payload.nodeId
            ? { ...node, progress: { ...node.progress, nextReviewDate: action.payload.reviewDate } }
            : node
        )
      };

    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };

    case 'RECORD_STUDY_SESSION':
      // Record study session and update daily progress
      const today = new Date().toISOString().split('T')[0];
      const existingProgressIndex = state.analytics.dailyProgress.findIndex(p => p.date === today);
      
      let updatedDailyProgress = [...state.analytics.dailyProgress];
      if (existingProgressIndex >= 0) {
        updatedDailyProgress[existingProgressIndex] = {
          ...updatedDailyProgress[existingProgressIndex],
          hoursStudied: updatedDailyProgress[existingProgressIndex].hoursStudied + action.payload.duration
        };
      } else {
        updatedDailyProgress.push({
          date: today,
          nodesCompleted: 0,
          hoursStudied: action.payload.duration
        });
      }

      return {
        ...state,
        analytics: {
          ...state.analytics,
          dailyProgress: updatedDailyProgress
        }
      };

    default:
      return state;
  }
}

// Helper functions

function calculateAnalytics(nodes: LearningNode[]): LearningAnalytics {
  const completedNodes = nodes.filter(n => n.progress.status === 'completed');
  const inProgressNodes = nodes.filter(n => n.progress.status === 'in_progress');
  
  const totalHours = nodes.reduce((sum, node) => sum + node.estimatedHours, 0);
  const completedHours = completedNodes.reduce((sum, node) => sum + node.estimatedHours, 0);
  
  const averageMasteryLevel = completedNodes.length > 0
    ? completedNodes.reduce((sum, node) => sum + node.progress.masteryLevel, 0) / completedNodes.length
    : 0;

  const skillsAcquired = Array.from(new Set(
    completedNodes.flatMap(node => node.metadata.skills)
  ));

  return {
    totalNodes: nodes.length,
    completedNodes: completedNodes.length,
    inProgressNodes: inProgressNodes.length,
    totalHours,
    completedHours,
    currentStreak: 0, // TODO: Calculate based on daily progress
    longestStreak: 0, // TODO: Calculate based on daily progress
    averageMasteryLevel,
    skillsAcquired,
    dailyProgress: [] // Will be populated from localStorage
  };
}

function updateNodeAvailability(nodes: LearningNode[]): LearningNode[] {
  return nodes.map(node => {
    // Check if all prerequisites are completed
    const allPrerequisitesCompleted = node.prerequisites.every(prereqId => {
      const prerequisite = nodes.find(n => n.id === prereqId);
      return prerequisite?.progress.status === 'completed';
    });

    // If node is locked and prerequisites are met, unlock it
    if (node.progress.status === 'locked' && allPrerequisitesCompleted) {
      return {
        ...node,
        progress: { ...node.progress, status: 'available' }
      };
    }

    return node;
  });
}

function calculateNextReviewDate(reviewCount: number): string {
  // Spaced repetition intervals: 1 day, 3 days, 1 week, 2 weeks, 1 month, 3 months
  const intervals = [1, 3, 7, 14, 30, 90];
  const intervalIndex = Math.min(reviewCount - 1, intervals.length - 1);
  const intervalDays = intervals[intervalIndex];
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  
  return nextReview.toISOString().split('T')[0];
}

// Context creation
const LearningContext = createContext<{
  state: LearningState;
  dispatch: React.Dispatch<LearningAction>;
  actions: {
    loadRoadmap: () => Promise<void>;
    completeNode: (nodeId: string, masteryLevel: number) => void;
    startNode: (nodeId: string) => void;
    scheduleReview: (nodeId: string, reviewDate: string) => void;
    recordStudySession: (nodeId: string, duration: number) => void;
    updatePreferences: (preferences: Partial<LearningState['preferences']>) => void;
    getNodeById: (id: string) => LearningNode | undefined;
    getAvailableNodes: () => LearningNode[];
    getNodesForReview: () => LearningNode[];
    getPhaseProgress: (phaseId: string) => number;
  };
} | null>(null);

export function LearningProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(learningReducer, initialState);

  // Load roadmap data on mount
  useEffect(() => {
    loadRoadmap();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.nodes.length > 0) {
      localStorage.setItem('learning-progress', JSON.stringify({
        nodeProgress: state.nodes.map(node => ({
          id: node.id,
          progress: node.progress
        })),
        preferences: state.preferences,
        analytics: state.analytics
      }));
    }
  }, [state]);

  const loadRoadmap = async () => {
    try {
      const response = await fetch('/content/roadmap.json');
      if (!response.ok) {
        throw new Error('Failed to load roadmap data');
      }
      
      const roadmapData = await response.json();
      
      // Load saved progress from localStorage
      const savedProgress = localStorage.getItem('learning-progress');
      let nodeProgress: Array<{ id: string; progress: LearningNode['progress'] }> = [];
      
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        nodeProgress = parsed.nodeProgress || [];
      }

      // Merge saved progress with roadmap data
      const nodesWithProgress = roadmapData.nodes.map((node: LearningNode) => {
        const savedNodeProgress = nodeProgress.find(p => p.id === node.id);
        return savedNodeProgress
          ? { ...node, progress: savedNodeProgress.progress }
          : node;
      });

      // Update node availability based on prerequisites
      const updatedNodes = updateNodeAvailability(nodesWithProgress);

      dispatch({
        type: 'LOAD_ROADMAP_SUCCESS',
        payload: {
          nodes: updatedNodes,
          checkpoints: roadmapData.checkpoints
        }
      });

    } catch (error) {
      dispatch({
        type: 'LOAD_ROADMAP_ERROR',
        payload: error instanceof Error ? error.message : 'Unknown error loading roadmap'
      });
    }
  };

  const actions = {
    loadRoadmap,
    
    completeNode: (nodeId: string, masteryLevel: number) => {
      dispatch({ type: 'COMPLETE_NODE', payload: { nodeId, masteryLevel } });
    },
    
    startNode: (nodeId: string) => {
      dispatch({ type: 'START_NODE', payload: nodeId });
    },
    
    scheduleReview: (nodeId: string, reviewDate: string) => {
      dispatch({ type: 'SCHEDULE_REVIEW', payload: { nodeId, reviewDate } });
    },
    
    recordStudySession: (nodeId: string, duration: number) => {
      dispatch({ type: 'RECORD_STUDY_SESSION', payload: { nodeId, duration } });
    },
    
    updatePreferences: (preferences: Partial<LearningState['preferences']>) => {
      dispatch({ type: 'UPDATE_PREFERENCES', payload: preferences });
    },
    
    getNodeById: (id: string) => {
      return state.nodes.find(node => node.id === id);
    },
    
    getAvailableNodes: () => {
      return state.nodes.filter(node => node.progress.status === 'available');
    },
    
    getNodesForReview: () => {
      const today = new Date().toISOString().split('T')[0];
      return state.nodes.filter(node => 
        node.progress.status === 'completed' &&
        node.progress.nextReviewDate &&
        node.progress.nextReviewDate <= today
      );
    },
    
    getPhaseProgress: (phaseId: string) => {
      const phaseNodes = state.nodes.filter(node => node.phase === phaseId);
      if (phaseNodes.length === 0) return 0;
      
      const completedNodes = phaseNodes.filter(node => node.progress.status === 'completed');
      return Math.round((completedNodes.length / phaseNodes.length) * 100);
    }
  };

  return (
    <LearningContext.Provider value={{ state, dispatch, actions }}>
      {children}
    </LearningContext.Provider>
  );
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) {
    throw new Error('useLearning must be used within a LearningProvider');
  }
  return context;
}
