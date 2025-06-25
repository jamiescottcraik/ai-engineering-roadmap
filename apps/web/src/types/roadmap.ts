export type NodeType = 'topic' | 'subTopic' | 'resource' | 'projectIdea' | 'category';
export type NodeStatus = 'locked' | 'todo' | 'inProgress' | 'completed' | 'needsReview';
export type NodeDifficulty = 'beginner' | 'intermediate' | 'advanced';

// Data associated with a single roadmap item (independent of ReactFlow)
export interface RoadmapItemData {
  id: string;
  label: string;
  nodeType: NodeType;
  status: NodeStatus;
  difficulty?: NodeDifficulty;
  estimatedTime?: string;
  description?: string;
  childrenIds?: string[]; // IDs of child items for tree structure
  resourceUrls?: string[];
  prerequisites?: string[]; // IDs of nodes that must be completed first
  [key: string]: unknown; // Allow index signature for React Flow compatibility
}

// Data structure specifically for ReactFlow nodes, embedding RoadmapItemData
// This will be the `data` property of a ReactFlow Node object.
export interface RoadmapNodeFlowData extends RoadmapItemData {
  // Additional properties specific to flow rendering if needed,
  // but most will come from RoadmapItemData.
  isCurrentlyExpanded?: boolean; // Used by TopicNode to display +/-
  [key: string]: unknown; // Allow index signature for React Flow compatibility
}

// Example of how it might be used with ReactFlow's Node type:
// import { Node } from '@xyflow/react';
// type CustomRoadmapNode = Node<RoadmapNodeFlowData>;

// We will also need a way to represent the entire roadmap, likely a flat list or map of RoadmapItemData
// and then transform it into ReactFlow nodes and edges.

export interface RoadmapData {
  items: Record<string, RoadmapItemData>; // All items keyed by ID for easy lookup
  rootItemIds: string[]; // Entry points of the roadmap
}

// Example Usage (conceptual)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const exampleRoadmap: RoadmapData = {
  items: {
    '1': {
      id: '1',
      label: 'Introduction to AI',
      nodeType: 'category',
      status: 'todo',
      childrenIds: ['1.1', '1.2'],
      prerequisites: [],
    },
    '1.1': {
      id: '1.1',
      label: 'What is Machine Learning?',
      nodeType: 'topic',
      status: 'todo',
      difficulty: 'beginner',
      estimatedTime: '2h',
      prerequisites: ['1'],
    },
    '1.2': {
      id: '1.2',
      label: 'Types of AI',
      nodeType: 'topic',
      status: 'locked', // Example: locked until '1.1' is done
      difficulty: 'beginner',
      prerequisites: ['1.1'],
    },
  },
  rootItemIds: ['1'],
};
