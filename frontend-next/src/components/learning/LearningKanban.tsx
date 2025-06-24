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
        className={`${column.color} rounded-lg p-4 min-h-96 ${
          isOver ? 'ring-2 ring-blue-400 bg-opacity-70' : ''
        }`}
      >
        <h3 className="font-semibold text-lg mb-4">{column.title}</h3>

        <SortableContext
          items={column.topics.map(topic => topic.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="min-h-80">
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
        className={`bg-white dark:bg-gray-700 rounded-md p-3 mb-3 shadow-sm cursor-grab ${
          isDragging ? 'shadow-lg opacity-50' : ''
        }`}
      >
        <h4 className="font-medium text-sm mb-2">{topic.title}</h4>
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          {topic.description}
        </p>
        <div className="flex justify-between items-center text-xs">
          <span className={`px-2 py-1 rounded ${
            topic.difficulty === 'beginner' ? 'bg-green-200 text-green-800' :
            topic.difficulty === 'intermediate' ? 'bg-yellow-200 text-yellow-800' :
            'bg-red-200 text-red-800'
          }`}>
            {topic.difficulty}
          </span>
          <span className="text-gray-500">{topic.timeEstimate}</span>
        </div>
        {topic.completedAt && (
          <div className="text-xs text-green-600 mt-2">
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
      <h2 className="text-2xl font-bold mb-6 text-center">
        🧠 Your AI Engineering Learning Journey
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
