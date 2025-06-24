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
  BackgroundVariant,
} from '@xyflow/react';
import { type RoadmapNodeFlowData, type RoadmapData } from '../types/roadmap';
import TopicNode from './customNodes/TopicNode';
import { veteranRoadmapData, phaseColors } from '../data/veteranRoadmapData';

import '@xyflow/react/dist/style.css';

// Helper to create roadmap.sh-style positioned nodes and edges
const generateRoadmapFlowElements = (
  roadmap: RoadmapData,
  expandedNodes: Set<string>
): { nodes: Node<RoadmapNodeFlowData>[]; edges: Edge[] } => {
  const nodes: Node<RoadmapNodeFlowData>[] = [];
  const edges: Edge[] = [];
  const visited: Set<string> = new Set();

  // roadmap.sh-style positioning: phases in columns, topics flowing down
  const phasePositions = {
    root: { x: 400, y: 50 },
    phase1: { x: 200, y: 200 },
    phase2: { x: 400, y: 200 },
    phase3: { x: 600, y: 200 },
    phase4: { x: 800, y: 200 },
    phase5: { x: 1000, y: 200 }
  };

  function getPhaseColor(itemId: string): string {
    if (itemId.startsWith('phase1') || phaseColors.phase1) return phaseColors.phase1;
    if (itemId.startsWith('phase2')) return phaseColors.phase2;
    if (itemId.startsWith('phase3')) return phaseColors.phase3;
    if (itemId.startsWith('phase4')) return phaseColors.phase4;
    if (itemId.startsWith('phase5')) return phaseColors.phase5;
    if (itemId === 'root') return phaseColors.root;
    
    // Determine phase by parent
    const item = roadmap.items[itemId];
    if (!item) return phaseColors.todo;
    
    const getPhaseFromId = (id: string): string => {
      for (const [phaseId, items] of Object.entries(roadmap.items)) {
        if (phaseId.startsWith('phase') && items.childrenIds?.includes(id)) {
          return phaseId;
        }
      }
      return 'default';
    };
    
    const phase = getPhaseFromId(itemId);
    return phaseColors[phase as keyof typeof phaseColors] || phaseColors.todo;
  }

  function addNodesAndEdges(itemId: string, parentId?: string, phaseIndex = 0, childIndex = 0) {
    if (visited.has(itemId)) return;

    const item = roadmap.items[itemId];
    if (!item) return;

    visited.add(itemId);

    // Calculate position based on roadmap.sh style
    let position = { x: 400, y: 50 }; // default
    
    if (itemId === 'root') {
      position = phasePositions.root;
    } else if (itemId.startsWith('phase')) {
      position = phasePositions[itemId as keyof typeof phasePositions] || { x: 400 + phaseIndex * 200, y: 200 };
    } else {
      // Position children below their parents
      const parentPosition = phasePositions[parentId as keyof typeof phasePositions] || { x: 400, y: 200 };
      position = {
        x: parentPosition.x + (childIndex - 1) * 150, // Spread children horizontally
        y: parentPosition.y + 120 + Math.floor(childIndex / 3) * 100 // Stack in rows
      };
    }

    // Create the node with enhanced data
    const nodeData: RoadmapNodeFlowData = {
      ...item,
      isCurrentlyExpanded: expandedNodes.has(itemId)
    };

    const node: Node<RoadmapNodeFlowData> = {
      id: itemId,
      type: 'topicNode',
      position,
      data: nodeData,
      style: {
        background: getPhaseColor(itemId),
        border: `2px solid ${item.status === 'completed' ? phaseColors.completed : '#374151'}`,
        borderRadius: '8px',
        minWidth: '160px'
      }
    };

    nodes.push(node);

    // Create edge from parent to this node
    if (parentId) {
      const edge: Edge = {
        id: `edge-${parentId}-${itemId}`,
        source: parentId,
        target: itemId,
        type: 'smoothstep',
        style: {
          stroke: getPhaseColor(itemId),
          strokeWidth: 2,
          strokeDasharray: '5,5'
        },
        animated: item.status === 'inProgress'
      };
      edges.push(edge);
    }

    // Recursively add children if expanded
    if (item.childrenIds && expandedNodes.has(itemId)) {
      item.childrenIds.forEach((childId, index) => {
        addNodesAndEdges(childId, itemId, phaseIndex, index);
      });
    }
  }

  // Start with root items
  roadmap.rootItemIds.forEach((rootId, index) => {
    addNodesAndEdges(rootId, undefined, index, 0);
  });

  return { nodes, edges };
};

const nodeTypes: NodeTypes = {
  topicNode: TopicNode, // Register custom node
};


function RoadmapDisplay() {
  const [nodes, setNodesState] = useState<Node<RoadmapNodeFlowData>[]>([]);
  const [edges, setEdgesState] = useState<Edge[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(veteranRoadmapData.rootItemIds)); // Expand root by default

  // Memoize flow elements to prevent re-calculation on every render unless dependencies change
  const flowElements = useMemo(() => {
    return generateRoadmapFlowElements(veteranRoadmapData, expandedNodes);
  }, [expandedNodes]); // veteranRoadmapData is constant

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
    const clickedNodeData = veteranRoadmapData.items[node.id];
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
    <div style={{ height: '100vh', width: '100%' }} className="bg-slate-50 text-foreground">
      <div className="p-4 bg-white shadow-sm border-b">
        <h1 className="text-2xl font-bold text-gray-900">AI Engineering Roadmap</h1>
        <p className="text-gray-600 mt-1">Veteran-led 48-week transformation into AI engineering leadership</p>
      </div>
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
      >
        <Background 
          variant={BackgroundVariant.Dots}
          gap={20} 
          size={1} 
          color="#e2e8f0"
        />
        <Controls 
          showZoom 
          showFitView 
          showInteractive 
          className="bg-white shadow-lg border rounded-lg"
        />
        <MiniMap 
          nodeColor={(node) => {
            const item = veteranRoadmapData.items[node.id];
            return item?.status === 'completed' ? phaseColors.completed : phaseColors.todo;
          }}
          className="bg-white shadow-lg border rounded-lg"
          pannable
          zoomable
        />
      </ReactFlow>
    </div>
  );
}

export default RoadmapDisplay;
