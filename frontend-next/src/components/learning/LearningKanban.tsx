// Learning-Focused Kanban Component (Inspired by Planka)
// This demonstrates how to adapt Planka's patterns for individual learning

import React, { useCallback, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

// Learning-specific board structure (adapted from Planka's Board.js)
interface LearningTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeEstimate: string;
  resources: string[];
  notes?: string;
  completedAt?: Date;
}

interface LearningColumn {
  id: string;
  title: string;
  topics: LearningTopic[];
  color: string;
}

// Learning board structure (better than roadmap.sh's linear approach)
const LEARNING_COLUMNS: LearningColumn[] = [
  {
    id: 'backlog',
    title: '📚 To Learn',
    topics: [
      {
        id: '1',
        title: 'Python Basics',
        description: 'Variables, functions, control structures',
        difficulty: 'beginner',
        timeEstimate: '2 weeks',
        resources: ['Python.org tutorial', 'Automate the Boring Stuff']
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        description: 'Linear regression, classification basics',
        difficulty: 'intermediate',
        timeEstimate: '3 weeks',
        resources: ['Coursera ML Course', 'Hands-on ML book']
      }
    ],
    color: 'bg-gray-100 dark:bg-gray-800'
  },
  {
    id: 'in-progress',
    title: '🔄 Learning Now',
    topics: [
      {
        id: '3',
        title: 'Neural Networks',
        description: 'Understanding backpropagation and training',
        difficulty: 'advanced',
        timeEstimate: '4 weeks',
        resources: ['Deep Learning book', 'Neural Networks course']
      }
    ],
    color: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    id: 'review',
    title: '📝 Reviewing',
    topics: [
      {
        id: '4',
        title: 'Data Structures',
        description: 'Arrays, linked lists, trees, graphs',
        difficulty: 'intermediate',
        timeEstimate: '2 weeks',
        resources: ['LeetCode', 'CLRS book']
      }
    ],
    color: 'bg-yellow-100 dark:bg-yellow-900'
  },
  {
    id: 'mastered',
    title: '✅ Mastered',
    topics: [
      {
        id: '5',
        title: 'Git & Version Control',
        description: 'Basic git commands, branching, merging',
        difficulty: 'beginner',
        timeEstimate: '1 week',
        resources: ['Git documentation', 'Pro Git book'],
        completedAt: new Date('2024-12-01')
      }
    ],
    color: 'bg-green-100 dark:bg-green-900'
  }
];

export const LearningKanban: React.FC = () => {
  const [columns, setColumns] = useState(LEARNING_COLUMNS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Droppable Column Component
  const DroppableColumn: React.FC<{ column: LearningColumn }> = ({ column }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: column.id,
    });

    return (
      <div
        ref={setNodeRef}
        className={`${column.color} rounded-xl p-6 min-h-96 backdrop-blur-sm border border-white/20 shadow-lg ${
          isOver ? 'ring-2 ring-blue-400 ring-opacity-50 bg-opacity-80 scale-105' : ''
        } transition-all duration-300`}
      >
        <h3 className="font-bold text-lg mb-6 text-gray-800 dark:text-gray-200 flex items-center gap-2">
          {column.title}
          <span className="bg-white/30 dark:bg-gray-700/50 px-2 py-1 rounded-full text-sm font-medium">
            {column.topics.length}
          </span>
        </h3>

        <SortableContext
          items={column.topics.map(topic => topic.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="min-h-80 space-y-3">
            {column.topics.map((topic) => (
              <SortableTopicItem key={topic.id} topic={topic} />
            ))}
          </div>
        </SortableContext>
      </div>
    );
  };

  // Sortable Topic Item Component
  const SortableTopicItem: React.FC<{ topic: LearningTopic }> = ({ topic }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: topic.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white dark:bg-gray-700 rounded-lg p-4 mb-3 shadow-sm hover:shadow-md cursor-grab border border-gray-200 dark:border-gray-600 transition-all duration-200 ${
          isDragging ? 'shadow-lg opacity-50 rotate-2' : ''
        }`}
      >
        <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-gray-100">{topic.title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
          {topic.description}
        </p>
        
        {/* Resources Section */}
        {topic.resources && topic.resources.length > 0 && (
          <div className="mb-3">
            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">📚 Resources:</div>
            <div className="flex flex-wrap gap-1">
              {topic.resources.slice(0, 2).map((resource, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md border border-blue-200 dark:border-blue-700"
                >
                  {resource}
                </span>
              ))}
              {topic.resources.length > 2 && (
                <span className="inline-block px-2 py-1 text-xs bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-md border border-gray-200 dark:border-gray-600">
                  +{topic.resources.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-xs mb-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            topic.difficulty === 'beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
            topic.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
            'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
          }`}>
            {topic.difficulty}
          </span>
          <span className="text-gray-500 dark:text-gray-400 font-medium">⏱️ {topic.timeEstimate}</span>
        </div>
        
        {topic.completedAt && (
          <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">
            ✅ Completed {topic.completedAt.toLocaleDateString()}
          </div>
        )}
      </div>
    );
  };

  // Educational drag handler (adapted from Planka's KanbanContent.jsx)
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the columns
    const activeColumn = columns.find(col =>
      col.topics.some(topic => topic.id === activeId)
    );
    const overColumn = columns.find(col => col.id === overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    // Move item between columns
    setColumns(prevColumns => {
      const activeTopics = activeColumn.topics;
      const overTopics = overColumn.topics;

      const activeIndex = activeTopics.findIndex(topic => topic.id === activeId);
      const topic = activeTopics[activeIndex];

      return prevColumns.map(col => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            topics: activeTopics.filter((_, index) => index !== activeIndex)
          };
        }
        if (col.id === overColumn.id) {
          return {
            ...col,
            topics: [...overTopics, topic]
          };
        }
        return col;
      });
    });
  };

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find source and destination columns
    const sourceColumn = columns.find(col =>
      col.topics.some(topic => topic.id === activeId)
    );

    if (!sourceColumn) return;

    const topic = sourceColumn.topics.find(t => t.id === activeId);
    if (!topic) return;

    // Check if dropped on a column (not on another topic)
    const destColumn = columns.find(col => col.id === overId);

    if (destColumn && sourceColumn.id !== destColumn.id) {
      // Mark completion time for mastered topics
      if (destColumn.id === 'mastered' && !topic.completedAt) {
        topic.completedAt = new Date();
      }

      // Update spaced repetition if moving from mastered back to review
      if (sourceColumn.id === 'mastered' && destColumn.id === 'review') {
        // Trigger spaced repetition algorithm
        console.log('Topic needs review - update spaced repetition schedule');
      }
    }
  }, [columns]);

  const activeItem = activeId
    ? columns.flatMap(col => col.topics).find(topic => topic.id === activeId)
    : null;

  return (
    <div className="learning-kanban w-full h-full p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
          🧠 Your AI Engineering Learning Journey
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Organize your learning path with drag-and-drop simplicity. Track progress from exploration to mastery.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {columns.map(column => (
            <DroppableColumn key={column.id} column={column} />
          ))}
        </div>

        <DragOverlay>
          {activeItem ? <SortableTopicItem topic={activeItem} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default LearningKanban;
