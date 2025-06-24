'use client';

import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Clock, CheckCircle, Lock, AlertCircle, Circle, Play, Star } from 'lucide-react';
import type { NodeStatus } from '../../types/roadmap';
import { useVeteranRoadmap } from '../../context/VeteranRoadmapProvider';

// Helper function to get status icon and styling
const getStatusDisplay = (status: NodeStatus) => {
  switch (status) {
    case 'completed':
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        bgColor: 'bg-green-500 hover:bg-green-600',
        textColor: 'text-white',
        borderColor: 'border-green-400'
      };
    case 'inProgress':
      return {
        icon: <Circle className="w-4 h-4 animate-pulse" />,
        bgColor: 'bg-blue-500 hover:bg-blue-600',
        textColor: 'text-white',
        borderColor: 'border-blue-400'
      };
    case 'todo':
      return {
        icon: <Circle className="w-4 h-4" />,
        bgColor: 'bg-gray-400 hover:bg-gray-500',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-300'
      };
    case 'locked':
      return {
        icon: <Lock className="w-4 h-4" />,
        bgColor: 'bg-gray-600 hover:bg-gray-700',
        textColor: 'text-gray-300',
        borderColor: 'border-gray-500'
      };
    case 'needsReview':
      return {
        icon: <AlertCircle className="w-4 h-4" />,
        bgColor: 'bg-orange-500 hover:bg-orange-600',
        textColor: 'text-white',
        borderColor: 'border-orange-400'
      };
    default:
      return {
        icon: <Circle className="w-4 h-4" />,
        bgColor: 'bg-gray-300 hover:bg-gray-400',
        textColor: 'text-gray-800',
        borderColor: 'border-gray-200'
      };
  }
};

const getDifficultyColor = (difficulty?: string) => {
  switch (difficulty) {
    case 'beginner':
      return 'text-green-600 bg-green-100';
    case 'intermediate':
      return 'text-yellow-600 bg-yellow-100';
    case 'advanced':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

interface TopicNodeProps {
  data: {
    id: string;
    label: string;
    status: NodeStatus;
    nodeType: string;
    difficulty?: string;
    estimatedTime?: string;
    childrenIds?: string[];
    isCurrentlyExpanded?: boolean;
    description?: string;
  };
  isConnectable?: boolean;
}

const TopicNode: React.FC<TopicNodeProps> = ({ data, isConnectable = true }) => {
  const { state, actions } = useVeteranRoadmap();
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  const { id, label, status, nodeType, difficulty, estimatedTime, childrenIds, isCurrentlyExpanded, description } = data;
  
  // Get progress data from context
  const progressData = state.nodeProgress[id];
  const actualStatus = progressData?.status || status;
  
  const statusDisplay = getStatusDisplay(actualStatus);
  const isPhase = nodeType === 'category' && label.includes('Phase');
  const isRoot = label === 'AI Engineering Roadmap';

  // Determine if node can be started (prerequisites met)
  const canStart = actualStatus === 'todo'; // Simplified for demo
  const canComplete = actualStatus === 'inProgress';

  const handleStartNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canStart) {
      actions.startNode(id);
    }
  };

  const handleCompleteNode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (canComplete) {
      // For demo, auto-complete with random mastery level
      const masteryLevel = Math.floor(Math.random() * 2) + 4; // 4-5 stars
      actions.completeNode(id, masteryLevel, "Great progress using military discipline and structure!");
    }
  };

  // Determine node size based on type
  const nodeWidth = isRoot ? 'w-80' : isPhase ? 'w-64' : 'w-48';
  const nodeSize = isRoot ? 'text-lg p-4' : isPhase ? 'text-base p-3' : 'text-sm p-3';

  return (
    <div 
      className={`${nodeWidth} ${nodeSize} ${statusDisplay.bgColor} ${statusDisplay.textColor} 
                  rounded-lg shadow-lg border-2 ${statusDisplay.borderColor} 
                  font-sans relative transition-all duration-200 cursor-pointer
                  ${actualStatus === 'locked' ? 'opacity-60' : 'opacity-100'}
                  hover:shadow-xl hover:scale-105`}
      onMouseEnter={() => setShowQuickActions(true)}
      onMouseLeave={() => setShowQuickActions(false)}
    >
      
      {/* Connection handles */}
      {!isRoot && (
        <Handle 
          type="target" 
          position={Position.Top} 
          isConnectable={isConnectable} 
          className="!bg-blue-500 !border-blue-300 !w-3 !h-3" 
        />
      )}
      
      {/* Status icon */}
      <div className="absolute top-2 right-2 opacity-80">
        {statusDisplay.icon}
      </div>

      {/* Quick actions (on hover) */}
      {showQuickActions && !isPhase && !isRoot && (
        <div className="absolute top-2 left-2 flex space-x-1">
          {canStart && (
            <button
              onClick={handleStartNode}
              className="p-1 bg-green-600 hover:bg-green-700 rounded text-white opacity-90 hover:opacity-100 transition-all"
              title="Start learning"
            >
              <Play className="w-3 h-3" />
            </button>
          )}
          {canComplete && (
            <button
              onClick={handleCompleteNode}
              className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white opacity-90 hover:opacity-100 transition-all"
              title="Mark complete"
            >
              <CheckCircle className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Expansion indicator */}
      {childrenIds && childrenIds.length > 0 && !showQuickActions && (
        <div className="absolute top-2 left-2 text-xs px-1.5 py-0.5 rounded bg-black bg-opacity-20 font-mono">
          {isCurrentlyExpanded ? '−' : '+'}
        </div>
      )}

      {/* Main content */}
      <div className="space-y-2">
        <div className="font-bold leading-tight">{label}</div>
        
        {description && isPhase && (
          <div className="text-xs opacity-90 leading-relaxed">
            {description}
          </div>
        )}

        {/* Progress info for completed nodes */}
        {actualStatus === 'completed' && progressData && (
          <div className="flex items-center space-x-2 text-xs">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < progressData.masteryLevel ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="text-xs opacity-75">
              {Math.round(progressData.timeSpent / 60 * 10) / 10}h
            </span>
          </div>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap gap-2 text-xs">
          {nodeType !== 'category' && (
            <span className="px-2 py-1 rounded bg-black bg-opacity-20 capitalize">
              {nodeType}
            </span>
          )}
          
          {difficulty && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(difficulty)}`}>
              {difficulty}
            </span>
          )}
          
          {estimatedTime && (
            <span className="flex items-center gap-1 px-2 py-1 rounded bg-black bg-opacity-20">
              <Clock className="w-3 h-3" />
              {estimatedTime}
            </span>
          )}
        </div>

        {/* Child count for phases */}
        {childrenIds && childrenIds.length > 0 && isPhase && (
          <div className="text-xs opacity-75">
            {childrenIds.length} learning {childrenIds.length === 1 ? 'area' : 'areas'}
          </div>
        )}
      </div>

      {/* Bottom handle for connections */}
      {childrenIds && childrenIds.length > 0 && (
        <Handle 
          type="source" 
          position={Position.Bottom} 
          isConnectable={isConnectable} 
          className="!bg-green-500 !border-green-300 !w-3 !h-3" 
        />
      )}
    </div>
  );
};

export default TopicNode;
