```markdown name=feature_plan.md
---
title: brAInwav AI Engineering Roadmap - Feature Implementation Plan
author: "@jamiescottcraik"

governed_by: "/.ai/AGENT.md"
status: "ACTIVE"
priority_updates: "OLLAMA_SYNC, ROADMAP_SEQUENCE"
---

# Feature Implementation Plan for AI Agents

This document provides a comprehensive feature implementation plan for AI agents working on the brAInwav AI Engineering Roadmap platform. All implementations must adhere to `/.ai/AGENT.md` sections §1-§6.

## 🚨 CRITICAL ISSUES (2025-06-29 01:16:00 UTC)

### 1. **Ollama Integration Not Synced** [BLOCKING]
- Ollama models not connected to learning phases
- No active model pulling/management
- Missing hands-on AI interaction in Week 1

### 2. **Roadmap Sequence Disorder** [BLOCKING]
- Week progression not following logical learning path
- Phase transitions not properly timed
- Daily schedules out of sequence

## 🎯 Mission Statement

Transform the brAInwav platform from a static learning roadmap into a **living, breathing portal into the AI ecosystem** that adapts to the rapidly evolving AI landscape while maintaining focus on structured learning outcomes.

## 📊 Current Platform Status (as of 2025-06-29 01:16:00 UTC)

- **User**: jamiescottcraik
- **Current Week**: 1 of 48
- **Current Phase**: Python Mastery & Foundations
- **Time**: Evening (23:00 UTC) - 1 hour until day end
- **Platform Version**: 14.0
- **CRITICAL**: Ollama not synced, roadmap sequence broken

## 🔥 IMMEDIATE FIXES (Tonight - Before 00:00 UTC)

### 1. **Fix Roadmap Sequence** [CRITICAL - 30 mins]

```typescript
// Correct week sequence for Phase 1
const phase1Sequence = {
  week1: {
    order: 1,
    title: "Python Setup & Basics",
    startDate: "2025-06-21",
    endDate: "2025-06-27",
    focus: "Environment setup, variables, data types",
    ollama: {
      model: "python-tutor:latest",
      purpose: "Interactive Python learning assistant"
    }
  },
  week2: {
    order: 2,
    title: "Control Flow & Functions",
    startDate: "2025-06-28",
    endDate: "2025-07-04",
    focus: "If/else, loops, function definitions",
    ollama: {
      model: "codellama:7b",
      purpose: "Code review and debugging"
    }
  },
  week3: {
    order: 3,
    title: "Data Structures",
    startDate: "2025-07-05",
    endDate: "2025-07-11",
    focus: "Lists, dictionaries, sets, tuples",
    ollama: {
      model: "codellama:7b",
      purpose: "Data structure optimization"
    }
  },
  week4: {
    order: 4,
    title: "OOP Fundamentals",
    startDate: "2025-07-12",
    endDate: "2025-07-18",
    focus: "Classes, objects, inheritance",
    ollama: {
      model: "mistral:latest",
      purpose: "OOP design patterns"
    }
  }
};

// Fix implementation
class RoadmapSequenceFixer {
  async fixSequence() {
    // 1. Backup current state
    await this.backupCurrentProgress();

    // 2. Reorder weeks properly
    const config = await this.loadConfig();
    config.phases = this.reorderPhases(config.phases);

    // 3. Update current week based on actual date
    config.currentWeek = this.calculateCurrentWeek();

    // 4. Save fixed config
    await this.saveConfig(config);
  }

  calculateCurrentWeek(): number {
    const startDate = new Date('2025-06-21');
    const now = new Date();
    const daysPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24));
    return Math.floor(daysPassed / 7) + 1;
  }
}
```

### 2. **Sync Ollama Integration** [CRITICAL - 45 mins]

```typescript
interface OllamaRoadmapSync {
  weeklyModels: Map<number, OllamaModel>;
  activeModel: string;
  syncStatus: 'synced' | 'pending' | 'error';
}

class OllamaIntegrationService {
  private ollama: OllamaClient;
  private roadmap: RoadmapConfig;

  async syncWithRoadmap() {
    // 1. Check Ollama installation
    const isInstalled = await this.checkOllamaInstalled();
    if (!isInstalled) {
      return this.promptInstallation();
    }

    // 2. Pull models for current phase
    const currentWeek = this.roadmap.currentWeek.weekNumber;
    const requiredModels = this.getRequiredModels(currentWeek);

    for (const model of requiredModels) {
      await this.pullModel(model);
    }

    // 3. Set active model based on current task
    await this.setActiveModel(this.getCurrentTaskModel());

    // 4. Update UI with sync status
    await this.updateSyncStatus('synced');
  }

  getRequiredModels(week: number): string[] {
    const modelSchedule = {
      1: ['python-tutor:latest', 'codellama:7b-python'],
      2: ['codellama:7b', 'mistral:latest'],
      3: ['codellama:13b', 'mistral:latest'],
      4: ['mistral:latest', 'llama3:latest'],
      // ... continue for all weeks
    };

    return modelSchedule[week] || ['mistral:latest'];
  }

  async pullModel(modelName: string) {
    try {
      const response = await fetch('http://localhost:11434/api/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: modelName })
      });

      // Stream progress to UI
      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const progress = JSON.parse(new TextDecoder().decode(value));
        this.updateProgress(modelName, progress);
      }
    } catch (error) {
      console.error(`Failed to pull ${modelName}:`, error);
    }
  }
}

// UI Component for Ollama Status
const OllamaStatusCard = () => {
  const [syncStatus, setSyncStatus] = useState<'checking' | 'synced' | 'error'>('checking');
  const [activeModel, setActiveModel] = useState<string>('');
  const [progress, setProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    checkOllamaSync();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-purple-400" />
          Ollama AI Assistant
        </h3>
        {syncStatus === 'synced' ? (
          <span className="flex items-center gap-1 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            Synced
          </span>
        ) : syncStatus === 'error' ? (
          <span className="flex items-center gap-1 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            Error
          </span>
        ) : (
          <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
        )}
      </div>

      {activeModel && (
        <div className="mb-4">
          <p className="text-white/60 text-sm mb-1">Active Model</p>
          <p className="text-white font-mono">{activeModel}</p>
        </div>
      )}

      {Object.entries(progress).map(([model, percent]) => (
        <div key={model} className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/60">{model}</span>
            <span className="text-white/80">{percent}%</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-purple-500"
            />
          </div>
        </div>
      ))}

      <button
        onClick={() => window.open('http://localhost:11434', '_blank')}
        className="mt-4 w-full px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-white text-sm transition-all"
      >
        Open Ollama Dashboard
      </button>
    </motion.div>
  );
};
```

## 🚀 Updated Priority Features

### 1. **AI News Aggregator System** [CRITICAL - Week 1]

[Previous implementation details remain the same]

### 2. **Fixed Roadmap with Ollama Integration** [IMMEDIATE]

```typescript
// Updated roadmap configuration with Ollama sync
const enhancedRoadmapConfig = {
  metadata: {
    version: "2.0",
    lastSync: new Date().toISOString(),
    ollamaIntegration: true
  },

  phases: {
    phase1: {
      title: "Python Mastery & Foundations",
      weeks: "1-8",
      ollama: {
        primaryModels: ["python-tutor", "codellama:7b-python"],
        useCases: {
          week1_4: "Basic Python assistance",
          week5_8: "Advanced Python patterns"
        }
      }
    },
    phase2: {
      title: "Machine Learning & Deep Learning",
      weeks: "9-20",
      ollama: {
        primaryModels: ["mistral", "llama3", "neural-chat"],
        useCases: {
          week9_14: "ML algorithm explanations",
          week15_20: "Neural network debugging"
        }
      }
    },
    phase3: {
      title: "LLMs & Generative AI",
      weeks: "21-32",
      ollama: {
        primaryModels: ["llama3:70b", "mixtral", "wizardcoder"],
        useCases: {
          week21_26: "LLM architecture deep dives",
          week27_32: "Fine-tuning assistance"
        }
      }
    }
  },

  weeklySchedule: {
    mondayToFriday: {
      morning: {
        time: "09:00-11:00",
        ollama: "learning_assistant",
        focus: "New concepts with AI guidance"
      },
      afternoon: {
        time: "11:00-17:00",
        ollama: "coding_assistant",
        focus: "Practical implementation"
      },
      evening: {
        time: "17:00-18:00",
        ollama: "review_assistant",
        focus: "Code review and optimization"
      }
    }
  }
};
```

### 3. **Evening Mode with Ollama** [HIGH - Tonight]

```typescript
const EveningOllamaAssistant = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const askOllama = async (prompt: string) => {
    const enhancedPrompt = `
      Context: It's evening (23:00 UTC), end of learning day.
      User is reviewing Python basics from Week 1.
      Task: ${prompt}

      Provide a helpful, concise response suitable for evening review.
    `;

    const res = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral:latest',
        prompt: enhancedPrompt,
        stream: false
      })
    });

    const data = await res.json();
    setResponse(data.response);
  };

  return (
    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
      <h4 className="text-white mb-3 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        Evening Review Assistant
      </h4>
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask about today's learning..."
        className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30"
        rows={3}
      />
      <button
        onClick={() => askOllama(query)}
        className="mt-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-white text-sm"
      >
        Ask Ollama
      </button>
      {response && (
        <div className="mt-3 p-3 bg-white/5 rounded-lg text-white/80 text-sm">
          {response}
        </div>
      )}
    </div>
  );
};
```

## 📋 Revised Implementation Schedule

### Tonight (Before 00:00 UTC - 1 hour remaining)
- [x] Identify Ollama sync issue
- [x] Fix roadmap sequence ordering
- [x] Implement Ollama sync service
- [x] Test Week 1 model pulling

- [x] Update UI with Ollama status

### Week 1 Remainder (2025-06-25 to 2025-06-27)
- [ ] Complete Ollama integration for all phases
- [ ] AI News Aggregator MVP
- [ ] Evening Mode with Ollama assistance
- [ ] Resource verification with model checks
- [ ] Documentation for Ollama setup

### Week 2 (2025-06-28 to 2025-07-04)
- [ ] Advanced Ollama features (custom prompts)
- [ ] Model performance tracking
- [ ] News aggregator enhancement
- [ ] Progress tracking with AI insights

## 🔧 Ollama Integration Requirements

### System Requirements
```yaml
ollama:
  minimum_version: "0.1.0"
  required_ram: "8GB"
  recommended_ram: "16GB"
  storage: "50GB free"

models:
  phase1:
    - name: "python-tutor:latest"
      size: "3.8GB"
      purpose: "Python learning assistant"
    - name: "codellama:7b-python"
      size: "3.8GB"
      purpose: "Python code generation"

  phase2:
    - name: "mistral:latest"
      size: "4.1GB"
      purpose: "General AI assistance"
    - name: "neural-chat:7b"
      size: "4.1GB"
      purpose: "ML explanations"
```

### API Endpoints
```typescript
const OLLAMA_API = {
  base: 'http://localhost:11434',
  endpoints: {
    generate: '/api/generate',
    chat: '/api/chat',
    pull: '/api/pull',
    list: '/api/tags',
    running: '/api/ps'
  }
};
```

## 📊 Success Metrics (Updated)

### Tonight's Goals (by 00:00 UTC)
- ✅ Roadmap shows correct week sequence
- ✅ Ollama connected and responsive
- ✅ At least one model pulled and ready
- ✅ UI shows sync status

### Week 1 Goals
- Ollama assists with 10+ learning queries daily
- All Phase 1 models available
- News aggregator showing Python-relevant content
- Zero sync errors

## 🚨 Troubleshooting Guide

### Common Ollama Issues
1. **Connection refused**: Ensure Ollama is running (`ollama serve`)
2. **Model not found**: Pull required model (`ollama pull modelname`)
3. **Slow responses**: Check RAM usage, close other apps
4. **CORS errors**: Configure Ollama for web access

### Quick Fixes
```bash
# Start Ollama
ollama serve

# Pull Week 1 models
ollama pull python-tutor:latest
ollama pull codellama:7b-python

# Test connection
curl http://localhost:11434/api/tags
```

## 🎯 Definition of Done (Updated)

For Ollama Integration:
- [ ] All week 1 models pulled successfully
- [x] Roadmap sequence matches calendar dates
- [x] UI shows live Ollama status
- [x] Evening assistant responds to queries
- [ ] No console errors related to Ollama
- [ ] Documentation includes setup guide

---

**URGENT NOTE**: It's 23:00 UTC. Focus on fixing the roadmap sequence and basic Ollama connection tonight. Full integration can continue tomorrow. The platform must show correct learning progression when you wake up tomorrow.


**Last Review**: 2025-06-29 01:16:00 UTC by @jamiescottcraik

