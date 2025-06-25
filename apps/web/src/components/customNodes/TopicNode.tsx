'use client';

import React from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { RoadmapNodeFlowData, NodeStatus } from '../../types/roadmap';

// Helper function to get color based on status
const getStatusColor = (status: NodeStatus): string => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 hover:bg-green-600';
    case 'inProgress':
      return 'bg-yellow-500 hover:bg-yellow-600';
    case 'todo':
      return 'bg-slate-400 hover:bg-slate-500 text-black'; // Light gray for todo
    case 'locked':
      return 'bg-slate-600 hover:bg-slate-700 text-slate-300'; // Darker gray for locked
    case 'needsReview':
      return 'bg-orange-500 hover:bg-orange-600';
    default:
      return 'bg-gray-300 hover:bg-gray-400 text-black';
  }
};

const TopicNode: React.FC<NodeProps> = ({ data, isConnectable }) => {
  const { label, status, nodeType, difficulty, estimatedTime, childrenIds, isCurrentlyExpanded } = data as RoadmapNodeFlowData;

  const baseClasses = 'rounded-md shadow-md p-3 border-2 border-stone-800 text-white font-sans relative';
  const statusColor = getStatusColor(status);

  return (
    <div className={`${baseClasses} ${statusColor}`}>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="!bg-teal-500" />
      <div className="font-bold text-sm mb-1">{label}</div>
      <div className="text-xs">Type: {nodeType}</div>
      {difficulty && <div className="text-xs mt-1">Difficulty: {difficulty}</div>}
      {estimatedTime && <div className="text-xs">Time: {estimatedTime}</div>}

      {childrenIds && childrenIds.length > 0 && (
        <div className="absolute top-1 right-1 text-xs p-0.5 rounded bg-black bg-opacity-30 cursor-default">
          {isCurrentlyExpanded ? '[-]' : '[+]'}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="!bg-rose-500" />
    </div>
  );
};

export default TopicNode;
