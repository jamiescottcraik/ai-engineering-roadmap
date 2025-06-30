'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Bot, Brain, CheckCircle, Code, Lightbulb, Send, User } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface MCPServer {
  id: string;
  name: string;
  endpoint: string;
  models: string[];
  status: 'connected' | 'disconnected' | 'error';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  context?: {
    currentWeek?: number;
    currentTask?: string;
    learningArea?: string;
  };
}

interface LearningContext {
  currentWeek: number;
  currentPhase: string;
  completedTasks: string[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  strugglingWith?: string[];
}

/**
 * AI Assistant Integration using Model Context Protocol (MCP)
 * Provides context-aware AI assistance for the brAInwav learning platform
 */
export default function MCPAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServer, setSelectedServer] = useState<string>('local-ollama');
  const [learningContext, setLearningContext] = useState<LearningContext | null>(null);

  // Available MCP servers
  const mcpServers: MCPServer[] = [
    {
      id: 'local-ollama',
      name: 'Ollama (Local)',
      endpoint: 'http://localhost:11434',
      models: ['llama3.1', 'codellama', 'phi3'],
      status: 'connected',
    },
    {
      id: 'openai-gpt',
      name: 'OpenAI GPT',
      endpoint: 'https://api.openai.com/v1',
      models: ['gpt-4', 'gpt-3.5-turbo'],
      status: 'connected',
    },
    {
      id: 'anthropic-claude',
      name: 'Anthropic Claude',
      endpoint: 'https://api.anthropic.com/v1',
      models: ['claude-3-opus', 'claude-3-sonnet'],
      status: 'disconnected',
    },
  ];

  // Load learning context from localStorage and roadmap state
  useEffect(() => {
    const loadContext = () => {
      try {
        const completedTasks = JSON.parse(
          localStorage.getItem('brainwav-roadmap-completed') || '[]'
        );
        const currentWeek = parseInt(localStorage.getItem('brainwav-current-week') || '1');

        setLearningContext({
          currentWeek,
          currentPhase: 'Python Mastery & Foundations',
          completedTasks,
          userLevel: 'intermediate',
          interests: ['python', 'machine-learning', 'llms', 'web-development'],
          strugglingWith: ['async-programming', 'decorators'],
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load learning context:', error);
      }
    };

    loadContext();
  }, []);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0 && learningContext) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome-' + Date.now(),
        role: 'assistant',
        content: `Hi Jamie! I'm your AI learning assistant. I can see you're in Week ${learningContext.currentWeek} of your AI Engineering journey, focusing on ${learningContext.currentPhase}.

I can help you with:
• Explaining complex concepts
• Code review and debugging
• Study strategies and planning
• Progress analysis and recommendations

What would you like to work on today?`,
        timestamp: new Date(),
        context: {
          currentWeek: learningContext.currentWeek,
          learningArea: learningContext.currentPhase,
        },
      };

      setMessages([welcomeMessage]);
    }
  }, [learningContext, messages.length]);

  // Send message to AI assistant
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: 'user-' + Date.now(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      setIsLoading(true);

      try {
        const response = await queryMCPServer(content, learningContext);

        const assistantMessage: ChatMessage = {
          id: 'assistant-' + Date.now(),
          role: 'assistant',
          content: response,
          timestamp: new Date(),
          context: learningContext
            ? {
                currentWeek: learningContext.currentWeek,
                learningArea: learningContext.currentPhase,
              }
            : undefined,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        const errorMessage: ChatMessage = {
          id: 'error-' + Date.now(),
          role: 'assistant',
          content:
            'I apologize, but I encountered an error processing your request. Please try again or check if the AI service is available.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [learningContext, isLoading]
  );

  // Handle key press for sending messages
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage(inputValue);
      }
    },
    [inputValue, sendMessage]
  );

  // Quick action buttons
  const quickActions = [
    {
      id: 'explain-concept',
      label: 'Explain Concept',
      icon: Lightbulb,
      prompt: 'Can you explain Python decorators in simple terms with examples?',
    },
    {
      id: 'code-review',
      label: 'Code Review',
      icon: Code,
      prompt: 'Can you review my latest Python code and suggest improvements?',
    },
    {
      id: 'study-plan',
      label: 'Study Plan',
      icon: BookOpen,
      prompt: 'What should I focus on this week to stay on track with my roadmap?',
    },
    {
      id: 'progress-check',
      label: 'Progress Check',
      icon: CheckCircle,
      prompt: 'How am I doing with my learning goals? Any recommendations?',
    },
  ];

  if (!isOpen) {
    return (
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 rounded-full border border-white/20 bg-gradient-to-r from-purple-500 to-blue-500 p-4 shadow-lg"
      >
        <div className="relative">
          <Brain className="h-6 w-6 text-white" />
          <motion.div
            className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="fixed bottom-6 right-6 z-50 flex h-[600px] w-96 flex-col rounded-xl border border-white/20 bg-black/90 shadow-2xl backdrop-blur-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Brain className="h-6 w-6 text-purple-400" />
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-green-400" />
          </div>
          <div>
            <h3 className="font-medium text-white">AI Learning Assistant</h3>
            <p className="text-xs text-white/60">Powered by MCP</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Server Selection */}
          <select
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
            className="rounded border border-white/20 bg-white/10 px-2 py-1 text-xs text-white/80"
          >
            {mcpServers.map((server) => (
              <option key={server.id} value={server.id} className="bg-gray-800">
                {server.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-white/60 hover:text-white/80"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-purple-500/20">
                  <Bot className="h-4 w-4 text-purple-400" />
                </div>
              )}

              <div
                className={`
                max-w-[80%] rounded-lg p-3 text-sm
                ${
                  message.role === 'user'
                    ? 'ml-auto bg-blue-500/20 text-blue-100'
                    : 'bg-white/10 text-white/90'
                }
              `}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className="mt-2 text-xs opacity-60">
                  {message.timestamp.toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-500/20">
                  <User className="h-4 w-4 text-blue-400" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20">
              <Bot className="h-4 w-4 text-purple-400" />
            </div>
            <div className="rounded-lg bg-white/10 p-3">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-white/60" />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-white/60"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="h-2 w-2 animate-bounce rounded-full bg-white/60"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-white/10 p-3">
        <div className="mb-3 grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => sendMessage(action.prompt)}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2 text-xs text-white/80 transition-all hover:bg-white/10"
            >
              <action.icon className="h-3 w-3" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your learning..."
            className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/80 placeholder-white/40 focus:border-purple-500/50 focus:outline-none"
          />
          <button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            className="rounded-lg border border-purple-500/30 bg-purple-500/20 p-2 text-purple-400 transition-all hover:bg-purple-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Query MCP server with context-aware prompts
 */
async function queryMCPServer(prompt: string, context: LearningContext | null): Promise<string> {
  // In a real implementation, this would connect to the actual MCP server
  // For now, we'll simulate AI responses with context awareness

  // Build contextual prompt for better responses
  buildContextualPrompt(prompt, context);

  try {
    // Simulate API call to MCP server
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay

    return generateContextualResponse(prompt, context);
  } catch {
    throw new Error('Failed to query MCP server');
  }
}

/**
 * Build context-aware prompt for AI assistant
 */
function buildContextualPrompt(userPrompt: string, context: LearningContext | null): string {
  if (!context) return userPrompt;

  return `
Context: The user is Jamie, currently in Week ${context.currentWeek} of an AI Engineering roadmap,
focusing on "${context.currentPhase}". They have completed ${context.completedTasks.length} tasks.
Their skill level is ${context.userLevel} and they're interested in: ${context.interests.join(', ')}.
${context.strugglingWith ? `They're currently struggling with: ${context.strugglingWith.join(', ')}.` : ''}

User Question: ${userPrompt}

Please provide a helpful, context-aware response that considers their current learning stage and struggles.
`;
}

/**
 * Generate contextual AI response (simulated)
 */
function generateContextualResponse(prompt: string, context: LearningContext | null): string {
  // This is a simplified simulation - in reality, this would be handled by the MCP server

  const responses = {
    explain: `I'd be happy to explain that concept! Given that you're in Week ${context?.currentWeek} and working on ${context?.currentPhase}, let me break this down in a way that connects to what you're currently learning...`,

    code: `Looking at your current progress in ${context?.currentPhase}, I can help review your code. Based on your skill level (${context?.userLevel}), here are some suggestions...`,

    study: `Great question! Since you're in Week ${context?.currentWeek} of your roadmap, I recommend focusing on consolidating your Python foundations while preparing for the upcoming ML concepts...`,

    progress: `You're doing well! With ${context?.completedTasks.length} tasks completed in Week ${context?.currentWeek}, you're on track. Let me suggest some areas to strengthen...`,

    default: `I understand you're asking about that topic. Given your current position in Week ${context?.currentWeek} focusing on ${context?.currentPhase}, here's my recommendation...`,
  };

  // Simple keyword matching for demo
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('explain') || lowerPrompt.includes('what is')) {
    return responses.explain;
  } else if (lowerPrompt.includes('code') || lowerPrompt.includes('review')) {
    return responses.code;
  } else if (
    lowerPrompt.includes('study') ||
    lowerPrompt.includes('plan') ||
    lowerPrompt.includes('focus')
  ) {
    return responses.study;
  } else if (lowerPrompt.includes('progress') || lowerPrompt.includes('doing')) {
    return responses.progress;
  } else {
    return responses.default;
  }
}
