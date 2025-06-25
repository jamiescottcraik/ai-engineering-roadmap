'use client';

import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Calendar, CheckCircle, Circle, Clock, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface LearningTask {
  id: string;
  title: string;
  description: string;
  phase: string;
  week: number;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  labels: string[];
  checklist: ChecklistItem[];
  attachments: Attachment[];
  progress: number;
  timeEstimate: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  learningObjectives: string[];
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'link' | 'file' | 'video' | 'article';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validColumnColors = ['gray', 'blue', 'yellow', 'orange', 'green'] as const;
type ColumnColor = (typeof validColumnColors)[number];

interface KanbanColumn {
  id: string;
  title: string;
  tasks: LearningTask[];
  color: ColumnColor;
  limit?: number;
}

/**
 * Kanban Board for Learning Task Management
 * Provides drag-and-drop interface for managing learning progress
 * Inspired by Planka and modern project management tools
 */
export default function LearningKanban() {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'backlog',
      title: 'Learning Backlog',
      tasks: [],
      color: 'gray',
    },
    {
      id: 'to-learn',
      title: 'To Learn',
      tasks: [],
      color: 'blue',
      limit: 5,
    },
    {
      id: 'learning',
      title: 'Currently Learning',
      tasks: [],
      color: 'yellow',
      limit: 3,
    },
    {
      id: 'practicing',
      title: 'Practicing',
      tasks: [],
      color: 'orange',
      limit: 4,
    },
    {
      id: 'mastered',
      title: 'Mastered',
      tasks: [],
      color: 'green',
    },
  ]);

  const [selectedTask, setSelectedTask] = useState<LearningTask | null>(null);
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);

  // Load tasks from localStorage
  useEffect(() => {
    const loadTasks = () => {
      try {
        const savedColumns = localStorage.getItem('brainwav-kanban-columns');
        if (savedColumns) {
          setColumns(JSON.parse(savedColumns));
        } else {
          // Initialize with sample tasks
          initializeSampleTasks();
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load kanban tasks:', error);
        initializeSampleTasks();
      }
    };

    loadTasks();
  }, [initializeSampleTasks]); // Added initializeSampleTasks to dependency array

  // Save tasks to localStorage whenever columns change
  useEffect(() => {
    try {
      localStorage.setItem('brainwav-kanban-columns', JSON.stringify(columns));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save kanban tasks:', error);
    }
  }, [columns]);

  // Initialize with sample learning tasks
  const initializeSampleTasks = useCallback(() => {
    const sampleTasks: LearningTask[] = [
      {
        id: 'task-1',
        title: 'Complete Python Chapter 4: Functions',
        description: 'Learn about function parameters, return values, and scope',
        phase: 'Python Mastery',
        week: 1,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        priority: 'high',
        labels: ['python', 'fundamentals'],
        checklist: [
          { id: 'c1', text: 'Read chapter 4', completed: true },
          { id: 'c2', text: 'Complete exercises', completed: false },
          { id: 'c3', text: 'Build practice project', completed: false },
        ],
        attachments: [],
        progress: 30,
        timeEstimate: 120,
        difficulty: 'medium',
        learningObjectives: [
          'Understand function scope',
          'Master parameter passing',
          'Practice return values',
        ],
      },
      {
        id: 'task-2',
        title: 'GitHub Stats CLI Project',
        description: 'Build command-line tool to analyze GitHub repository statistics',
        phase: 'Practical Projects',
        week: 1,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        labels: ['python', 'cli', 'github', 'api'],
        checklist: [
          { id: 'c4', text: 'Set up project structure', completed: true },
          { id: 'c5', text: 'Implement GitHub API integration', completed: false },
          { id: 'c6', text: 'Add CLI argument parsing', completed: false },
          { id: 'c7', text: 'Create visualization features', completed: false },
        ],
        attachments: [
          {
            id: 'a1',
            name: 'GitHub API Docs',
            url: 'https://docs.github.com/en/rest',
            type: 'link',
          },
        ],
        progress: 25,
        timeEstimate: 240,
        difficulty: 'hard',
        learningObjectives: ['API integration', 'CLI development', 'Data visualization'],
      },
      {
        id: 'task-3',
        title: 'Learn Python Decorators',
        description: 'Understand decorator syntax and implement custom decorators',
        phase: 'Advanced Python',
        week: 2,
        priority: 'low',
        labels: ['python', 'advanced', 'decorators'],
        checklist: [
          { id: 'c8', text: 'Watch decorator tutorial', completed: false },
          { id: 'c9', text: 'Practice with built-in decorators', completed: false },
          { id: 'c10', text: 'Create custom decorator', completed: false },
        ],
        attachments: [],
        progress: 0,
        timeEstimate: 90,
        difficulty: 'hard',
        learningObjectives: [
          'Understand decorator pattern',
          'Write custom decorators',
          'Apply to real projects',
        ],
      },
    ];

    const updatedColumns = columns.map((column) => {
      if (column.id === 'to-learn') {
        return { ...column, tasks: [sampleTasks[0], sampleTasks[2]] };
      } else if (column.id === 'learning') {
        return { ...column, tasks: [sampleTasks[1]] };
      }
      return column;
    });

    setColumns(updatedColumns);
  }, [columns]); // Added columns dependency

  // Handle drag end
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { destination, source, draggableId } = result;

      // Dropped outside the list
      if (!destination) return;

      // Dropped in the same position
      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }

      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find((col) => col.id === destination.droppableId);

      if (!sourceColumn || !destColumn) return;

      const draggedTask = sourceColumn.tasks.find((task) => task.id === draggableId);
      if (!draggedTask) return;

      // Check column limits
      if (
        destColumn.limit &&
        destColumn.id !== source.droppableId &&
        destColumn.tasks.length >= destColumn.limit
      ) {
        // Show warning about limit
        return;
      }

      setColumns((prevColumns) => {
        const newColumns = [...prevColumns];

        // Remove from source
        const sourceIndex = newColumns.findIndex((col) => col.id === source.droppableId);
        newColumns[sourceIndex] = {
          ...newColumns[sourceIndex],
          tasks: newColumns[sourceIndex].tasks.filter((task) => task.id !== draggableId),
        };

        // Add to destination
        const destIndex = newColumns.findIndex((col) => col.id === destination.droppableId);
        const newTasks = [...newColumns[destIndex].tasks];
        newTasks.splice(destination.index, 0, draggedTask);

        newColumns[destIndex] = {
          ...newColumns[destIndex],
          tasks: newTasks,
        };

        return newColumns;
      });
    },
    [columns]
  );

  // Add new task
  const addTask = useCallback((columnId: string, taskData: Partial<LearningTask>) => {
    const newTask: LearningTask = {
      id: `task-${Date.now()}`,
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      phase: taskData.phase || 'General',
      week: taskData.week || 1,
      priority: taskData.priority || 'medium',
      labels: taskData.labels || [],
      checklist: [],
      attachments: [],
      progress: 0,
      timeEstimate: taskData.timeEstimate || 60,
      difficulty: taskData.difficulty || 'medium',
      learningObjectives: taskData.learningObjectives || [],
    };

    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, tasks: [...column.tasks, newTask] } : column
      )
    );
  }, []);

  return (
    <div className="h-full bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-950 p-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white">Learning Kanban Board</h1>
        <p className="text-white/60">Manage your AI Engineering learning progress</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6">
          {columns.map((column) => (
            <div key={column.id} className="w-80 flex-shrink-0">
              <KanbanColumn
                column={column}
                onAddTask={addTask}
                onSelectTask={setSelectedTask}
                isAddingTask={isAddingTask === column.id}
                setIsAddingTask={setIsAddingTask}
              />
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={(updatedTask) => {
              setColumns((prevColumns) =>
                prevColumns.map((column) => ({
                  ...column,
                  tasks: column.tasks.map((task) =>
                    task.id === updatedTask.id ? updatedTask : task
                  ),
                }))
              );
              setSelectedTask(updatedTask);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Kanban Column Component
const KanbanColumn: React.FC<{
  column: KanbanColumn;
  onAddTask: (columnId: string, taskData: Partial<LearningTask>) => void;
  onSelectTask: (task: LearningTask) => void;
  isAddingTask: boolean;
  setIsAddingTask: (columnId: string | null) => void;
}> = ({ column, onAddTask, onSelectTask, isAddingTask, setIsAddingTask }) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      onAddTask(column.id, { title: newTaskTitle.trim() });
      setNewTaskTitle('');
      setIsAddingTask(null);
    }
  };

  const colorClasses = {
    gray: 'border-gray-500/30 bg-gray-500/10',
    blue: 'border-blue-500/30 bg-blue-500/10',
    yellow: 'border-yellow-500/30 bg-yellow-500/10',
    orange: 'border-orange-500/30 bg-orange-500/10',
    green: 'border-green-500/30 bg-green-500/10',
  };

  return (
    <div className={`rounded-xl border ${colorClasses[column.color]} p-4`}>
      {/* Column Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-white">{column.title}</h3>
          <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">
            {column.tasks.length}
            {column.limit && `/${column.limit}`}
          </span>
        </div>
        <button
          onClick={() => setIsAddingTask(column.id)}
          className="rounded p-1 text-white/60 hover:text-white/80"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full rounded border border-white/20 bg-white/10 p-2 text-sm text-white"
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            autoFocus
          />
          <div className="mt-2 flex gap-2">
            <button
              onClick={handleAddTask}
              className="rounded bg-blue-500/20 px-3 py-1 text-sm text-blue-400"
            >
              Add
            </button>
            <button
              onClick={() => {
                setIsAddingTask(null);
                setNewTaskTitle('');
              }}
              className="rounded bg-white/10 px-3 py-1 text-sm text-white/60"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Tasks */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-[100px] space-y-3 ${
              snapshot.isDraggingOver ? 'rounded-lg bg-white/5' : ''
            }`}
          >
            {column.tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`${snapshot.isDragging ? 'rotate-3 scale-105' : ''}`}
                  >
                    <TaskCard task={task} onSelect={onSelectTask} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

// Task Card Component
const TaskCard: React.FC<{
  task: LearningTask;
  onSelect: (task: LearningTask) => void;
}> = ({ task, onSelect }) => {
  const priorityColors = {
    low: 'border-l-green-500',
    medium: 'border-l-yellow-500',
    high: 'border-l-red-500',
  };

  const difficultyIcons = {
    easy: '⚡',
    medium: '🔥',
    hard: '💎',
  };

  const completedChecklist = task.checklist.filter((item) => item.completed).length;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(task)}
      className={`
        border-l-4 bg-white/10 p-3 ${priorityColors[task.priority]}
        cursor-pointer rounded-lg transition-all hover:bg-white/20
      `}
    >
      <div className="mb-2 flex items-start justify-between">
        <h4 className="text-sm font-medium leading-tight text-white">{task.title}</h4>
        <span className="ml-2 text-xs">{difficultyIcons[task.difficulty]}</span>
      </div>

      {task.description && (
        <p className="mb-2 line-clamp-2 text-xs text-white/60">{task.description}</p>
      )}

      {/* Progress Bar */}
      {task.progress > 0 && (
        <div className="mb-2">
          <div className="mb-1 flex items-center justify-between text-xs text-white/60">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-1 w-full rounded-full bg-white/10">
            <div
              className="h-1 rounded-full bg-blue-500 transition-all"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Checklist Progress */}
      {task.checklist.length > 0 && (
        <div className="mb-2 flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-400" />
          <span className="text-xs text-white/60">
            {completedChecklist}/{task.checklist.length}
          </span>
        </div>
      )}

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {task.labels.slice(0, 3).map((label) => (
            <span
              key={label}
              className="rounded bg-purple-500/20 px-2 py-0.5 text-xs text-purple-300"
            >
              {label}
            </span>
          ))}
          {task.labels.length > 3 && (
            <span className="text-xs text-white/40">+{task.labels.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>{task.timeEstimate}m</span>
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{task.dueDate.toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Task Detail Modal
const TaskDetailModal: React.FC<{
  task: LearningTask;
  onClose: () => void;
  onUpdate: (task: LearningTask) => void;
}> = ({ task, onClose, onUpdate }) => {
  const [editedTask, setEditedTask] = useState<LearningTask>(task);

  const updateTask = (updates: Partial<LearningTask>) => {
    const updated = { ...editedTask, ...updates };
    setEditedTask(updated);
    onUpdate(updated);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/20 bg-slate-900 p-6"
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-xl font-bold text-white">{editedTask.title}</h2>
          <button onClick={onClose} className="p-1 text-white/60 hover:text-white/80">
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-white/80">Description</label>
            <textarea
              value={editedTask.description}
              onChange={(e) => updateTask({ description: e.target.value })}
              className="w-full rounded border border-white/20 bg-white/10 p-3 text-white"
              rows={3}
            />
          </div>

          {/* Progress and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Progress ({editedTask.progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editedTask.progress}
                onChange={(e) => updateTask({ progress: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">Time Estimate</label>
              <input
                type="number"
                value={editedTask.timeEstimate}
                onChange={(e) => updateTask({ timeEstimate: parseInt(e.target.value) })}
                className="w-full rounded border border-white/20 bg-white/10 p-2 text-white"
                min="15"
                step="15"
              />
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="mb-3 text-lg font-medium text-white">Checklist</h3>
            <div className="space-y-2">
              {editedTask.checklist.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const updatedChecklist = [...editedTask.checklist];
                      updatedChecklist[index] = { ...item, completed: !item.completed };
                      updateTask({ checklist: updatedChecklist });
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-white/40" />
                    )}
                  </button>
                  <span
                    className={`${item.completed ? 'text-white/40 line-through' : 'text-white'}`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="mb-3 text-lg font-medium text-white">Learning Objectives</h3>
            <div className="space-y-2">
              {editedTask.learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-center gap-2 text-white/80">
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                  <span>{objective}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
