'use client';

import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
} from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  CheckCircle,
  Clock,
  Brain,
  ExternalLink,
  Zap,
  Users,
  Target,
  Award,
  Lightbulb,
  Settings,
  BookOpen,
} from 'lucide-react';
import React, { useState, useCallback } from 'react';

import { Badge } from './ui/badge';

/**
 * Interactive Roadmap Component - OpenUI-inspired browser interface
 *
 * Features similar to OpenUI:
 * - Browser-style navigation and interaction
 * - Real-time node manipulation and connections
 * - Multi-provider AI integration points
 * - Live progress tracking
 * - Collaborative learning paths
 *
 * Based on awesome-react patterns:
 * - Modern React Flow integration
 * - Framer Motion animations
 * - Accessible keyboard navigation
 * - Responsive design patterns
 */

interface LearningNodeData extends Record<string, unknown> {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'review';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  prerequisites: string[];
  skills: string[];
  resources?: string[];
  aiProvider?: 'ollama' | 'openai' | 'groq' | 'litellm';
  interactiveDemo?: boolean;
  collaborators?: number;
}

type LearningNode = Node<LearningNodeData>;

const statusColors = {
  todo: 'bg-gray-100 border-gray-300 text-gray-700',
  'in-progress': 'bg-blue-50 border-blue-300 text-blue-700',
  completed: 'bg-green-50 border-green-300 text-green-700',
  review: 'bg-yellow-50 border-yellow-300 text-yellow-700',
};

const difficultyColors = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
};

const aiProviderIcons = {
  ollama: '🦙',
  openai: '🤖',
  groq: '⚡',
  litellm: '🔄',
};

// Custom Learning Node Component
function LearningNodeComponent({ data, selected }: { data: LearningNodeData; selected?: boolean }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative min-w-[280px] max-w-[320px] cursor-pointer rounded-lg border-2 p-4 transition-all duration-200 ${
        statusColors[data.status]
      } ${selected ? 'shadow-lg ring-2 ring-blue-400' : 'shadow-sm'}`}
    >
      {/* Header with Status and AI Provider */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {data.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
          {data.status === 'in-progress' && <Play className="h-4 w-4 text-blue-600" />}
          {data.status === 'todo' && <Clock className="h-4 w-4 text-gray-400" />}
          {data.status === 'review' && <Brain className="h-4 w-4 text-yellow-600" />}

          <Badge variant="outline" className={`text-xs ${difficultyColors[data.difficulty]}`}>
            {data.difficulty}
          </Badge>
        </div>

        <div className="flex items-center space-x-1">
          {data.aiProvider && (
            <span className="text-lg" title={`AI Provider: ${data.aiProvider}`}>
              {aiProviderIcons[data.aiProvider]}
            </span>
          )}
          {data.interactiveDemo && (
            <span className="h-4 w-4 text-orange-500" title="Interactive Demo Available">
              <Zap className="h-4 w-4" />
            </span>
          )}
          {data.collaborators && data.collaborators > 0 && (
            <div className="flex items-center space-x-1 text-xs text-gray-600">
              <Users className="h-3 w-3" />
              <span>{data.collaborators}</span>
            </div>
          )}
        </div>
      </div>

      {/* Title and Description */}
      <h3 className="mb-2 text-sm font-semibold leading-tight">{data.title}</h3>
      <p className="mb-3 text-xs leading-relaxed text-gray-600">{data.description}</p>

      {/* Resources Section */}
      {data.resources && data.resources.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 flex items-center gap-1 text-xs font-medium text-gray-700">
            <BookOpen className="h-3 w-3" />
            Resources
          </div>
          <div className="flex flex-wrap gap-1">
            {data.resources.slice(0, 2).map((resource, index) => (
              <span
                key={index}
                className="inline-block rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700"
              >
                {resource}
              </span>
            ))}
            {data.resources.length > 2 && (
              <span className="inline-block rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600">
                +{data.resources.length - 2} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Skills Tags */}
      {data.skills && data.skills.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {data.skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="px-2 py-0.5 text-xs">
              {skill}
            </Badge>
          ))}
          {data.skills.length > 3 && (
            <Badge variant="secondary" className="px-2 py-0.5 text-xs">
              +{data.skills.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer with Time and Action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{data.estimatedTime}</span>
        </div>

        <div className="flex items-center space-x-1">
          {data.interactiveDemo && (
            <button className="rounded p-1 transition-colors hover:bg-gray-200">
              <ExternalLink className="h-3 w-3" />
            </button>
          )}
          <button className="rounded p-1 transition-colors hover:bg-gray-200">
            <Settings className="h-3 w-3" />
          </button>
        </div>
      </div>

        {/* Connection Handles */}
        <div className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 transform rounded-full bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
        <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 transform rounded-full bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
      </motion.div>
    </div>
  );
}

// Node types for React Flow
const nodeTypes = {
  learningNode: LearningNodeComponent,
};

// Initial roadmap data (AI Engineering focused)
const initialNodes: LearningNode[] = [
  {
    id: '1',
    type: 'learningNode',
    position: { x: 250, y: 50 },
    data: {
      title: 'Programming Foundations',
      description:
        'Master Python basics, data structures, and algorithmic thinking for AI development.',
      status: 'completed',
      difficulty: 'beginner',
      estimatedTime: '2 weeks',
      prerequisites: [],
      skills: ['Python', 'Data Structures', 'Algorithms', 'Git'],
      resources: ['Python.org tutorial', 'Learn Python the Hard Way', 'Automate the Boring Stuff'],
      collaborators: 12,
    },
  },
  {
    id: '2',
    type: 'learningNode',
    position: { x: 50, y: 200 },
    data: {
      title: 'Machine Learning Fundamentals',
      description:
        'Understanding supervised/unsupervised learning, feature engineering, and model evaluation.',
      status: 'in-progress',
      difficulty: 'intermediate',
      estimatedTime: '3 weeks',
      prerequisites: ['Programming Foundations'],
      skills: ['Scikit-learn', 'Pandas', 'NumPy', 'Statistics'],
      resources: ['Coursera ML Course', 'Hands-on ML book', 'Kaggle Learn'],
      aiProvider: 'ollama',
      interactiveDemo: true,
      collaborators: 8,
    },
  },
  {
    id: '3',
    type: 'learningNode',
    position: { x: 450, y: 200 },
    data: {
      title: 'Deep Learning with PyTorch',
      description: 'Neural networks, backpropagation, CNNs, RNNs, and modern architectures.',
      status: 'todo',
      difficulty: 'advanced',
      estimatedTime: '4 weeks',
      prerequisites: ['Machine Learning Fundamentals'],
      skills: ['PyTorch', 'Neural Networks', 'CNN', 'RNN', 'GPU'],
      resources: ['Deep Learning book', 'PyTorch tutorials', 'Fast.ai course'],
      aiProvider: 'openai',
      interactiveDemo: true,
      collaborators: 5,
    },
  },
  {
    id: '4',
    type: 'learningNode',
    position: { x: 150, y: 350 },
    data: {
      title: 'Natural Language Processing',
      description: 'Text processing, embeddings, transformers, and large language models.',
      status: 'todo',
      difficulty: 'advanced',
      estimatedTime: '3 weeks',
      prerequisites: ['Deep Learning with PyTorch'],
      skills: ['Transformers', 'BERT', 'GPT', 'HuggingFace', 'Tokenization'],
      resources: ['HuggingFace course', 'NLP with Python', 'Attention is All You Need paper'],
      aiProvider: 'groq',
      interactiveDemo: true,
      collaborators: 3,
    },
  },
  {
    id: '5',
    type: 'learningNode',
    position: { x: 350, y: 350 },
    data: {
      title: 'Computer Vision',
      description:
        'Image processing, object detection, semantic segmentation, and generative models.',
      status: 'todo',
      difficulty: 'advanced',
      estimatedTime: '3 weeks',
      prerequisites: ['Deep Learning with PyTorch'],
      skills: ['OpenCV', 'YOLO', 'Mask R-CNN', 'GANs', 'Diffusion Models'],
      resources: ['Computer Vision course', 'OpenCV docs', 'Papers with Code'],
      aiProvider: 'litellm',
      interactiveDemo: true,
      collaborators: 7,
    },
  },
  {
    id: '6',
    type: 'learningNode',
    position: { x: 250, y: 500 },
    data: {
      title: 'MLOps & Deployment',
      description: 'Model versioning, CI/CD pipelines, monitoring, and production deployment.',
      status: 'todo',
      difficulty: 'intermediate',
      estimatedTime: '2 weeks',
      prerequisites: ['Natural Language Processing', 'Computer Vision'],
      skills: ['Docker', 'MLflow', 'FastAPI', 'AWS', 'Monitoring'],
      resources: ['MLOps guide', 'Docker docs', 'FastAPI tutorial'],
      aiProvider: 'ollama',
      collaborators: 15,
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true },
  { id: 'e1-3', source: '1', target: '3', type: 'smoothstep', animated: true },
  { id: 'e2-4', source: '2', target: '4', type: 'smoothstep', animated: true },
  { id: 'e3-4', source: '3', target: '4', type: 'smoothstep', animated: true },
  { id: 'e3-5', source: '3', target: '5', type: 'smoothstep', animated: true },
  { id: 'e4-6', source: '4', target: '6', type: 'smoothstep', animated: true },
  { id: 'e5-6', source: '5', target: '6', type: 'smoothstep', animated: true },
];

export function InteractiveRoadmap() {
  const [nodes, setNodes] = useState<LearningNode[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [selectedNode, setSelectedNode] = useState<LearningNode | null>(null);
  const [viewMode, setViewMode] = useState<'roadmap' | 'progress' | 'analytics'>('roadmap');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: LearningNode) => {
    setSelectedNode(node);
  }, []);

  const updateNodeStatus = useCallback(
    (nodeId: string, newStatus: LearningNode['data']['status']) => {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, status: newStatus } } : node
        )
      );
    },
    []
  );

  // Calculate progress statistics
  const progressStats = {
    total: nodes.length,
    completed: nodes.filter((n) => n.data.status === 'completed').length,
    inProgress: nodes.filter((n) => n.data.status === 'in-progress').length,
    todo: nodes.filter((n) => n.data.status === 'todo').length,
    review: nodes.filter((n) => n.data.status === 'review').length,
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Browser-style Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Target className="h-4 w-4" />
              <span>AI Engineering Learning Roadmap</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg bg-gray-100 p-1 dark:bg-gray-700">
              {['roadmap', 'progress', 'analytics'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as 'roadmap' | 'progress' | 'analytics')}
                  className={`rounded-md px-3 py-1 text-sm transition-all ${
                    viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-600 dark:text-white'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center space-x-2 rounded-lg bg-gray-100 px-3 py-2 dark:bg-gray-700">
              <Award className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {progressStats.completed}/{progressStats.total}
              </span>
              <div className="h-2 w-16 rounded-full bg-gray-200 dark:bg-gray-600">
                <div
                  className="h-2 rounded-full bg-green-600 transition-all duration-300"
                  style={{ width: `${(progressStats.completed / progressStats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Roadmap View */}
        <div className="relative flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
          >
            <Background color="#e5e7eb" size={1} />
            <Controls className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800" />
            <MiniMap
              className="rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              nodeColor={(node) => {
                const status = (node as LearningNode).data.status;
                return status === 'completed'
                  ? '#10b981'
                  : status === 'in-progress'
                    ? '#3b82f6'
                    : '#6b7280';
              }}
            />
          </ReactFlow>
        </div>

        {/* Sidebar - Node Details */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-80 overflow-y-auto border-l border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Learning Module
                </h2>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                {/* Title and Status */}
                <div>
                  <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
                    {selectedNode.data.title}
                  </h3>
                  <div className="mb-3 flex items-center space-x-2">
                    <Badge variant="outline" className={statusColors[selectedNode.data.status]}>
                      {selectedNode.data.status.replace('-', ' ')}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={difficultyColors[selectedNode.data.difficulty]}
                    >
                      {selectedNode.data.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedNode.data.description}
                  </p>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Update Status:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['todo', 'in-progress', 'review', 'completed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateNodeStatus(selectedNode.id, status)}
                        className={`rounded px-3 py-2 text-xs transition-colors ${
                          selectedNode.data.status === status
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {status.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                {selectedNode.data.skills.length > 0 && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Skills You&apos;ll Learn:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedNode.data.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources */}
                {selectedNode.data.resources && selectedNode.data.resources.length > 0 && (
                  <div>
                    <label className="mb-2 block flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      <BookOpen className="h-4 w-4" />
                      Learning Resources:
                    </label>
                    <div className="space-y-2">
                      {selectedNode.data.resources.map((resource, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-md bg-blue-50 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                        >
                          <span>{resource}</span>
                          <ExternalLink className="h-3 w-3 opacity-60" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Provider & Features */}
                {selectedNode.data.aiProvider && (
                  <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                    <div className="mb-2 flex items-center space-x-2">
                      <span className="text-lg">
                        {aiProviderIcons[selectedNode.data.aiProvider]}
                      </span>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        AI-Enhanced Learning
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      This module includes AI-powered examples and practice using{' '}
                      {selectedNode.data.aiProvider}.
                    </p>
                  </div>
                )}

                {/* Interactive Demo */}
                {selectedNode.data.interactiveDemo && (
                  <button className="flex w-full items-center justify-center space-x-2 rounded-lg bg-orange-100 px-4 py-3 text-sm font-medium text-orange-700 transition-colors hover:bg-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:hover:bg-orange-900/30">
                    <Lightbulb className="h-4 w-4" />
                    <span>Try Interactive Demo</span>
                  </button>
                )}

                {/* Collaboration */}
                {selectedNode.data.collaborators && selectedNode.data.collaborators > 0 && (
                  <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
                    <div className="mb-1 flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {selectedNode.data.collaborators} learners currently studying this
                      </span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Join the community discussion and get help from peers.
                    </p>
                  </div>
                )}

                {/* Time Estimate */}
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Estimated time: {selectedNode.data.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
