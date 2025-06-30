'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  BarChart3,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Code,
  Coffee,
  Cpu,
  Database,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  GitBranch,
  Layers,
  Lightbulb,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Tag,
  TrendingUp,
  Upload,
  Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { GlassCard } from './enhanced/GlassComponents';

interface RecallItem {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  url?: string;
  type: 'concept' | 'code' | 'resource' | 'insight' | 'project' | 'question' | 'idea';
  phase: string;
  createdAt: string;
  reviewCount: number;
  lastReviewed?: string;
  connections?: string[]; // IDs of connected items
  priority?: 'low' | 'medium' | 'high';
  mastery?: number; // 0-100
}

interface RecallCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: React.ElementType;
  count: number;
  phase: string;
}

interface DailyStats {
  itemsSaved: number;
  itemsReviewed: number;
  connectionsMAde: number;
  targetSaves: number;
  streak: number;
}

export default function RecallIntegration() {
  const [recallItems, setRecallItems] = useState<RecallItem[]>([]);
  const [categories] = useState<RecallCategory[]>([
    {
      id: '01_python_fundamentals',
      name: 'Python',
      description: 'Core Python concepts, syntax, and patterns',
      color: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 hover:border-blue-400/50',
      icon: Code,
      count: 0,
      phase: 'phase1',
    },
    {
      id: '02_machine_learning',
      name: 'ML',
      description: 'ML algorithms, techniques, and implementations',
      color: 'from-green-500/20 to-green-600/20 border-green-500/30 hover:border-green-400/50',
      icon: Brain,
      count: 0,
      phase: 'phase2',
    },
    {
      id: '03_deep_learning',
      name: 'Deep Learning',
      description: 'Neural networks, architectures, and frameworks',
      color: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 hover:border-purple-400/50',
      icon: Layers,
      count: 0,
      phase: 'phase2',
    },
    {
      id: '04_llms_genai',
      name: 'LLMs & GenAI',
      description: 'Large language models and generative AI',
      color: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 hover:border-pink-400/50',
      icon: Sparkles,
      count: 0,
      phase: 'phase3',
    },
    {
      id: '05_mlops_production',
      name: 'MLOps',
      description: 'Deployment, monitoring, and scaling ML systems',
      color: 'from-orange-500/20 to-orange-600/20 border-orange-500/30 hover:border-orange-400/50',
      icon: Cpu,
      count: 0,
      phase: 'phase4',
    },
    {
      id: '06_open_source',
      name: 'Open Source',
      description: 'Open source tools and contributions',
      color: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 hover:border-cyan-400/50',
      icon: GitBranch,
      count: 0,
      phase: 'phase5',
    },
    {
      id: '07_ai_security',
      name: 'AI Security',
      description: 'Security, ethics, and safety in AI',
      color: 'from-red-500/20 to-red-600/20 border-red-500/30 hover:border-red-400/50',
      icon: Shield,
      count: 0,
      phase: 'phase5',
    },
    {
      id: '08_projects',
      name: 'Projects',
      description: 'Portfolio projects and implementations',
      color: 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30 hover:border-yellow-400/50',
      icon: FolderOpen,
      count: 0,
      phase: 'all',
    },
    {
      id: '09_career',
      name: 'Career',
      description: 'Portfolio, interviews, and career development',
      color: 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 hover:border-indigo-400/50',
      icon: TrendingUp,
      count: 0,
      phase: 'all',
    },
    {
      id: '10_daily_logs',
      name: 'Daily Logs',
      description: 'Daily learning reflections and insights',
      color: 'from-teal-500/20 to-teal-600/20 border-teal-500/30 hover:border-teal-400/50',
      icon: Calendar,
      count: 0,
      phase: 'all',
    },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterType, setFilterType] = useState<'all' | RecallItem['type']>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'reviewed' | 'priority'>('recent');
  const [dailyStats] = useState<DailyStats>({
    itemsSaved: 12,
    itemsReviewed: 5,
    connectionsMAde: 3,
    targetSaves: 10,
    streak: 4,
  });

  const [newItem, setNewItem] = useState({
    title: '',
    content: '',
    category: '01_python_fundamentals',
    tags: [] as string[],
    url: '',
    type: 'concept' as RecallItem['type'],
    priority: 'medium' as RecallItem['priority'],
  });

  const itemTypes: { value: RecallItem['type']; label: string; icon: React.ElementType }[] = [
    { value: 'concept', label: 'Concept', icon: Lightbulb },
    { value: 'code', label: 'Code', icon: Code },
    { value: 'resource', label: 'Resource', icon: BookOpen },
    { value: 'insight', label: 'Insight', icon: Zap },
    { value: 'project', label: 'Project', icon: FolderOpen },
    { value: 'question', label: 'Question', icon: AlertCircle },
    { value: 'idea', label: 'Idea', icon: Sparkles },
  ];

  // Load saved items from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('brainwave-recall-items');
    if (saved) {
      try {
        setRecallItems(JSON.parse(saved));
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load recall items:', error);
      }
    }
  }, []);

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('brainwave-recall-items', JSON.stringify(recallItems));
  }, [recallItems]);

  const addRecallItem = () => {
    if (!newItem.title.trim() || !newItem.content.trim()) return;

    const item: RecallItem = {
      id: Date.now().toString(),
      title: newItem.title,
      content: newItem.content,
      category: newItem.category,
      tags: newItem.tags,
      url: newItem.url,
      type: newItem.type,
      phase: getCurrentPhase(newItem.category),
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      priority: newItem.priority,
      mastery: 0,
    };

    setRecallItems((prev) => [item, ...prev]);
    setNewItem({
      title: '',
      content: '',
      category: '01_python_fundamentals',
      tags: [],
      url: '',
      type: 'concept',
      priority: 'medium',
    });
    setShowAddForm(false);
  };

  const getCurrentPhase = (category: string): string => {
    if (category.startsWith('01_')) return 'phase1';
    if (category.startsWith('02_') || category.startsWith('03_')) return 'phase2';
    if (category.startsWith('04_')) return 'phase3';
    if (category.startsWith('05_')) return 'phase4';
    if (category.startsWith('06_') || category.startsWith('07_')) return 'phase5';
    return 'all';
  };

  const filteredItems = recallItems
    .filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchTerm === '' ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || item.type === filterType;

      return matchesCategory && matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'reviewed') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      }
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority || 'medium'] - priorityOrder[a.priority || 'medium'];
      }
      return 0;
    });

  const exportToJSON = () => {
    const dataStr = JSON.stringify(recallItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `brainwave-recall-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        setRecallItems(imported);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to import:', error);
      }
    };
    reader.readAsText(file);
  };

  const markAsReviewed = (itemId: string) => {
    setRecallItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              reviewCount: item.reviewCount + 1,
              lastReviewed: new Date().toISOString(),
              mastery: Math.min((item.mastery || 0) + 10, 100),
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <GlassCard className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-purple-500/20 p-3">
              <Brain className="h-10 w-10 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Recall.ai Knowledge Base</h2>
              <p className="text-white/70">Transform information into retained knowledge</p>
            </div>
          </div>

          {/* Daily Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{dailyStats.itemsSaved}</div>
              <div className="text-xs text-white/60">Saved Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{dailyStats.streak}</div>
              <div className="text-xs text-white/60">Day Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{recallItems.length}</div>
              <div className="text-xs text-white/60">Total Items</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddForm(true)}
              className="glass-button flex items-center gap-2 bg-purple-500/20 hover:bg-purple-500/30"
            >
              <Plus className="h-4 w-4" />
              Add Item
            </button>

            <label className="glass-button flex cursor-pointer items-center gap-2">
              <Upload className="h-4 w-4" />
              Import
              <input type="file" accept=".json" onChange={importFromJSON} className="hidden" />
            </label>

            <button onClick={exportToJSON} className="glass-button flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>

            <a
              href="https://www.getrecall.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-button flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30"
            >
              <ExternalLink className="h-4 w-4" />
              Get Recall.ai
            </a>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-white/50" />
            <input
              type="text"
              placeholder="Search your knowledge base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-white/10 py-3 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | RecallItem['type'])}
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="all" className="bg-slate-800">
                All Types
              </option>
              {itemTypes.map((type) => (
                <option key={type.value} value={type.value} className="bg-slate-800">
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'reviewed' | 'priority')}
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              <option value="recent" className="bg-slate-800">
                Recent First
              </option>
              <option value="reviewed" className="bg-slate-800">
                Most Reviewed
              </option>
              <option value="priority" className="bg-slate-800">
                By Priority
              </option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`glass-button p-4 text-center transition-all duration-200 ${
            selectedCategory === 'all'
              ? 'scale-105 border-purple-400 bg-gradient-to-r from-purple-500/30 to-blue-500/30'
              : ''
          }`}
        >
          <Database className="mx-auto mb-2 h-6 w-6 text-white/80" />
          <div className="text-sm font-medium text-white">All Items</div>
          <div className="mt-1 text-xs text-white/60">{recallItems.length}</div>
        </button>

        {categories.map((category) => {
          const Icon = category.icon;
          const count = recallItems.filter((item) => item.category === category.id).length;

          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`glass-button bg-gradient-to-br p-4 text-center transition-all duration-200 ${category.color} ${
                selectedCategory === category.id ? 'scale-105 shadow-lg' : ''
              }`}
              title={category.description}
            >
              <Icon className="mx-auto mb-2 h-6 w-6 text-white/80" />
              <div className="text-sm font-medium text-white">{category.name}</div>
              <div className="mt-1 text-xs text-white/60">{count}</div>
            </button>
          );
        })}
      </div>

      {/* Add Item Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassCard className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-6">
              <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-white">
                <Plus className="h-5 w-5" />
                Add New Knowledge Item
              </h3>

              <div className="mb-4 grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  placeholder="Item title..."
                  value={newItem.title}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, title: e.target.value }))}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />

                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-slate-800">
                      {cat.name}
                    </option>
                  ))}
                </select>

                <select
                  value={newItem.type}
                  onChange={(e) =>
                    setNewItem((prev) => ({ ...prev, type: e.target.value as RecallItem['type'] }))
                  }
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  {itemTypes.map((type) => (
                    <option key={type.value} value={type.value} className="bg-slate-800">
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <textarea
                placeholder="Content/notes..."
                value={newItem.content}
                onChange={(e) => setNewItem((prev) => ({ ...prev, content: e.target.value }))}
                rows={3}
                className="mb-4 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />

              <div className="mb-4 grid gap-4 md:grid-cols-3">
                <input
                  type="url"
                  placeholder="Source URL (optional)..."
                  value={newItem.url}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, url: e.target.value }))}
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 md:col-span-2"
                />

                <select
                  value={newItem.priority}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      priority: e.target.value as RecallItem['priority'],
                    }))
                  }
                  className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="low" className="bg-slate-800">
                    Low Priority
                  </option>
                  <option value="medium" className="bg-slate-800">
                    Medium Priority
                  </option>
                  <option value="high" className="bg-slate-800">
                    High Priority
                  </option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowAddForm(false)} className="glass-button px-6 py-2">
                  Cancel
                </button>
                <button
                  onClick={addRecallItem}
                  className="glass-button bg-purple-500/20 px-6 py-2 hover:bg-purple-500/30"
                >
                  <Plus className="mr-2 inline h-4 w-4" />
                  Add Item
                </button>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Brain className="mx-auto mb-4 h-16 w-16 text-white/30" />
            <h3 className="mb-2 text-xl text-white/70">No items found</h3>
            <p className="mb-6 text-white/50">
              {searchTerm ? 'Try a different search term' : 'Start building your knowledge base!'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="glass-button mx-auto bg-purple-500/20 px-6 py-3 hover:bg-purple-500/30"
            >
              <Plus className="mr-2 inline h-4 w-4" />
              Add Your First Item
            </button>
          </GlassCard>
        ) : (
          filteredItems.map((item) => {
            const category = categories.find((c) => c.id === item.category);
            const typeConfig = itemTypes.find((t) => t.value === item.type);
            const TypeIcon = typeConfig?.icon || FileText;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                layout
              >
                <GlassCard className={`bg-gradient-to-r p-6 ${category?.color || ''}`}>
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex flex-1 items-start gap-3">
                      <div className="mt-1">
                        <TypeIcon className="h-5 w-5 text-white/60" />
                      </div>
                      <div className="flex-1">
                        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
                          {item.title}
                          {item.priority === 'high' && (
                            <span className="rounded bg-red-500/30 px-2 py-0.5 text-xs text-red-300">
                              HIGH
                            </span>
                          )}
                        </h3>
                        <div className="mt-1 flex items-center gap-4 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          {item.reviewCount > 0 && (
                            <span className="flex items-center gap-1">
                              <RefreshCw className="h-3 w-3" />
                              Reviewed {item.reviewCount}x
                            </span>
                          )}
                          {item.mastery && item.mastery > 0 && (
                            <span className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              {item.mastery}% mastery
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mb-4 whitespace-pre-wrap text-white/80">{item.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs text-white/70">
                        {category?.icon && <category.icon className="h-3 w-3" />}
                        {category?.name}
                      </span>
                      <span className="rounded bg-white/10 px-2 py-1 text-xs capitalize text-white/70">
                        {item.type}
                      </span>
                      <span className="rounded bg-white/10 px-2 py-1 text-xs uppercase text-white/70">
                        {item.phase}
                      </span>
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded bg-white/10 px-2 py-1 text-xs text-white/70"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => markAsReviewed(item.id)}
                        className="glass-button p-2"
                        title="Mark as reviewed"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>

                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="glass-button p-2"
                          title="Open source"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Daily Review Reminder */}
      {recallItems.length > 0 && (
        <GlassCard className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-purple-500/20 p-3">
              <Coffee className="h-8 w-8 text-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold text-white">Daily Review Time!</h3>
              <p className="text-white/70">
                You have <span className="font-semibold text-purple-400">{recallItems.length}</span>{' '}
                items in your knowledge base. Review them daily to enhance retention and build
                connections. Today&apos;s goal: Save{' '}
                <span className="font-semibold text-green-400">
                  {dailyStats.targetSaves - dailyStats.itemsSaved}
                </span>{' '}
                more items!
              </p>
            </div>
            <button className="glass-button bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-6 py-3 hover:from-purple-500/30 hover:to-pink-500/30">
              <RefreshCw className="mr-2 inline h-4 w-4" />
              Start Review Session
            </button>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
