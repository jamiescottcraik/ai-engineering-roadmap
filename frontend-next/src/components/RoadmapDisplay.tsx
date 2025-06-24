'use client';

import React, { useCallback, useState, useMemo } from 'react';
import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  type NodeMouseHandler,
  type NodeTypes,
} from '@xyflow/react';
import { type RoadmapData, type RoadmapNodeFlowData } from '../types/roadmap';
import TopicNode from './customNodes/TopicNode'; // Assuming TopicNode is in this path

import '@xyflow/react/dist/style.css';

// --- Sample Data ---
const sampleRoadmapData: RoadmapData = {
  items: {
    'root': { id: 'root', label: 'AI Engineering Roadmap', nodeType: 'category', status: 'inProgress', childrenIds: ['ml_basics', 'tools'] },
    'ml_basics': { id: 'ml_basics', label: 'Machine Learning Basics', nodeType: 'topic', status: 'completed', childrenIds: ['data_preprocessing', 'supervised_learning'] },
    'data_preprocessing': { id: 'data_preprocessing', label: 'Data Preprocessing', nodeType: 'subTopic', status: 'completed' },
    'supervised_learning': { id: 'supervised_learning', label: 'Supervised Learning', nodeType: 'subTopic', status: 'inProgress', childrenIds: ['regression', 'classification'] },
    'regression': { id: 'regression', label: 'Regression', nodeType: 'resource', status: 'todo' },
    'classification': { id: 'classification', label: 'Classification', nodeType: 'resource', status: 'locked' },
    'tools': { id: 'tools', label: 'Tools & Frameworks', nodeType: 'topic', status: 'todo', childrenIds: ['python', 'tensorflow'] },
    'python': { id: 'python', label: 'Python for AI', nodeType: 'subTopic', status: 'todo' },
    'tensorflow': { id: 'tensorflow', label: 'TensorFlow/Keras', nodeType: 'subTopic', status: 'todo' },
  },
  rootItemIds: ['root'],
};
// --- End Sample Data ---

const nodeTypes: NodeTypes = {
  topicNode: TopicNode, // Register custom node
};

// Helper to create ReactFlow nodes and edges from RoadmapData
const generateFlowElements = (
  roadmap: RoadmapData,
  expandedNodes: Set<string>,
  itemPositions: Record<string, { x: number; y: number }> // Pre-calculated or dynamic positions
): { nodes: Node<RoadmapNodeFlowData>[]; edges: Edge[] } => {
  const nodes: Node<RoadmapNodeFlowData>[] = [];
  const edges: Edge[] = [];
  const visited: Set<string> = new Set();

  function addNodesAndEdges(itemId: string, parentId?: string, level = 0, siblingIndex = 0) {
    if (visited.has(itemId)) return; // Avoid processing already added nodes (though hierarchy should prevent cycles)

    const item = roadmap.items[itemId];
    if (!item) return;

    visited.add(itemId);

    // Basic positioning - can be improved with a layout algorithm (e.g., Dagre)
    const xOffset = level * 250;
    const yOffset = siblingIndex * 150;

    nodes.push({
      id: item.id,
      type: 'topicNode', // Use our custom node type
      data: {
        ...item,
        childrenIds: item.childrenIds || [],
        isCurrentlyExpanded: expandedNodes.has(item.id)
      } as RoadmapNodeFlowData,
      position: itemPositions[item.id] || { x: xOffset, y: yOffset + (level * 50) }, // Use predefined or calculated
    });

    if (parentId) {
      edges.push({
        id: `e-${parentId}-${item.id}`,
        source: parentId,
        target: item.id,
        animated: item.status === 'inProgress',
      });
    }

    if (item.childrenIds && (expandedNodes.has(item.id) || level === 0)) { // Root children always shown or if expanded
      item.childrenIds.forEach((childId, index) => {
        addNodesAndEdges(childId, item.id, level + 1, index);
      });
    }
  }

  roadmap.rootItemIds.forEach((rootId, index) => addNodesAndEdges(rootId, undefined, 0, index));
  return { nodes, edges };
};


// Simple initial positioning (replace with a layout algorithm for better results)
const initialPositions: Record<string, { x: number; y: number }> = {
  'root': { x: 50, y: 50 },
  'ml_basics': { x: 300, y: 0 },
  'data_preprocessing': { x: 550, y: -50 },
  'supervised_learning': { x: 550, y: 50 },
  'regression': { x: 800, y: 25 },
  'classification': { x: 800, y: 75 },
  'tools': { x: 300, y: 200 },
  'python': { x: 550, y: 175 },
  'tensorflow': { x: 550, y: 225 },
};


function RoadmapDisplay() {
  const [nodes, setNodesState] = useState<Node<RoadmapNodeFlowData>[]>([]);
  const [edges, setEdgesState] = useState<Edge[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(sampleRoadmapData.rootItemIds)); // Expand root by default

  // Memoize flow elements to prevent re-calculation on every render unless dependencies change
  const flowElements = useMemo(() => {
    return generateFlowElements(sampleRoadmapData, expandedNodes, initialPositions);
  }, [expandedNodes]); // Removed sampleRoadmapData, initialPositions as they are constant here

  React.useEffect(() => {
    setNodesState(flowElements.nodes);
    setEdgesState(flowElements.edges);
  }, [flowElements]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodesState((nds) => applyNodeChanges(changes, nds) as Node<RoadmapNodeFlowData>[]);
    },
    []
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdgesState((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => setEdgesState((eds) => addEdge(connection, eds)),
    []
  );

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    const clickedNodeData = sampleRoadmapData.items[node.id];
    if (clickedNodeData && clickedNodeData.childrenIds && clickedNodeData.childrenIds.length > 0) {
      setExpandedNodes((prevExpanded) => {
        const newExpanded = new Set(prevExpanded);
        if (newExpanded.has(node.id)) {
          newExpanded.delete(node.id);
        } else {
          newExpanded.add(node.id);
        }
        return newExpanded;
      });
    }
  }, []); // Removed sampleRoadmapData from deps as it's constant

  return (
    <div style={{ height: '100vh', width: '100%' }} className="bg-background text-foreground">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick} // Handle node clicks for expansion
        nodeTypes={nodeTypes} // Register custom node types
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background gap={16} size={1.5} color="#374151" />
      </ReactFlow>
    </div>
  );
}

export default RoadmapDisplay;
