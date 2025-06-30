// Learning-Focused Kanban Component (Inspired by Planka)
// This demonstrates how to adapt Planka's patterns for individual learning

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useCallback, useState } from 'react';

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
        resources: ['Python.org tutorial', 'Automate the Boring Stuff'],
      },
      {
        id: '2',
        title: 'Machine Learning Fundamentals',
        description: 'Linear regression, classification basics',
        difficulty: 'intermediate',
        timeEstimate: '3 weeks',
        resources: ['Coursera ML Course', 'Hands-on ML book'],
      },
    ],
    color: 'bg-gray-100 dark:bg-gray-800',
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
        resources: ['Deep Learning book', 'Neural Networks course'],
      },
    ],
    color: 'bg-blue-100 dark:bg-blue-900',
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
        resources: ['LeetCode', 'CLRS book'],
      },
    ],
    color: 'bg-yellow-100 dark:bg-yellow-900',
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
        completedAt: new Date('2024-12-01'),
      },
    ],
    color: 'bg-green-100 dark:bg-green-900',
  },
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
        className={`${column.color} min-h-96 rounded-xl border border-white/20 p-6 shadow-lg backdrop-blur-sm ${
          isOver ? 'scale-105 bg-opacity-80 ring-2 ring-blue-400 ring-opacity-50' : ''
        } transition-all duration-300`}
      >
        <h3 className="mb-6 flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-gray-200">
          {column.title}
          <span className="rounded-full bg-white/30 px-2 py-1 text-sm font-medium dark:bg-gray-700/50">
            {column.topics.length}
          </span>
        </h3>

        <SortableContext
          items={column.topics.map((topic) => topic.id)}
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
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: topic.id,
    });

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
        className={`mb-3 cursor-grab rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-600 dark:bg-gray-700 ${
          isDragging ? 'rotate-2 opacity-50 shadow-lg' : ''
        }`}
      >
        <h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
          {topic.title}
        </h4>
        <p className="mb-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
          {topic.description}
        </p>

        {/* Resources Section */}
        {topic.resources && topic.resources.length > 0 && (
          <div className="mb-3">
            <div className="mb-1 text-xs font-medium text-gray-700 dark:text-gray-300">
              📚 Resources:
            </div>
            <div className="flex flex-wrap gap-1">
              {topic.resources.slice(0, 2).map((resource, index) => (
                <span
                  key={index}
                  className="inline-block rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-xs text-blue-700 dark:border-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  {resource}
                </span>
              ))}
              {topic.resources.length > 2 && (
                <span className="inline-block rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  +{topic.resources.length - 2} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mb-2 flex items-center justify-between text-xs">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              topic.difficulty === 'beginner'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : topic.difficulty === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}
          >
            {topic.difficulty}
          </span>
          <span className="font-medium text-gray-500 dark:text-gray-400">
            ⏱️ {topic.timeEstimate}
          </span>
        </div>

        {topic.completedAt && (
          <div className="rounded-md bg-green-50 px-2 py-1 text-xs text-green-600 dark:bg-green-900/20 dark:text-green-400">
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
    const activeColumn = columns.find((col) => col.topics.some((topic) => topic.id === activeId));
    const overColumn = columns.find((col) => col.id === overId);

    if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

    // Move item between columns
    setColumns((prevColumns) => {
      const activeTopics = activeColumn.topics;
      const overTopics = overColumn.topics;

      const activeIndex = activeTopics.findIndex((topic) => topic.id === activeId);
      const topic = activeTopics[activeIndex];

      return prevColumns.map((col) => {
        if (col.id === activeColumn.id) {
          return {
            ...col,
            topics: activeTopics.filter((_, index) => index !== activeIndex),
          };
        }
        if (col.id === overColumn.id) {
          return {
            ...col,
            topics: [...overTopics, topic],
          };
        }
        return col;
      });
    });
  };

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      // Find source and destination columns
      const sourceColumn = columns.find((col) => col.topics.some((topic) => topic.id === activeId));

      if (!sourceColumn) return;

      const topic = sourceColumn.topics.find((t) => t.id === activeId);
      if (!topic) return;

      // Check if dropped on a column (not on another topic)
      const destColumn = columns.find((col) => col.id === overId);

      if (destColumn && sourceColumn.id !== destColumn.id) {
        // Mark completion time for mastered topics
        if (destColumn.id === 'mastered' && !topic.completedAt) {
          topic.completedAt = new Date();
        }

        // Update spaced repetition if moving from mastered back to review
        if (sourceColumn.id === 'mastered' && destColumn.id === 'review') {
          // Trigger spaced repetition algorithm
          // TODO: Implement spaced repetition schedule update
        }
      }
    },
    [columns]
  );

  const activeItem = activeId
    ? columns.flatMap((col) => col.topics).find((topic) => topic.id === activeId)
    : null;

  return (
    <div className="learning-kanban h-full w-full p-6">
      <div className="mb-8 text-center">
        <h2 className="mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-3xl font-bold text-transparent">
          🧠 Your AI Engineering Learning Journey
        </h2>
        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          Organize your learning path with drag-and-drop simplicity. Track progress from exploration
          to mastery.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <DroppableColumn key={column.id} column={column} />
          ))}
        </div>

        <DragOverlay>{activeItem ? <SortableTopicItem topic={activeItem} /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
};

export default LearningKanban;
