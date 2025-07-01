#!/bin/bash

# brAInwav AI Engineering Roadmap 2025 Setup Script
# Configure the platform to follow Jamie Scott Craik's complete learning path
# Last Updated: 2025-06-24 20:00:12 UTC
# Current User: jamiescottcraik

set -e

# Color codes for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Current date/time tracking
CURRENT_DATE=$(date -u +"%Y-%m-%d %H:%M:%S")
CURRENT_USER="jamiescottcraik"
WEEK_NUMBER=1
DAY_OF_WEEK=$(date +%A)
HOURS_UNTIL_DAY_END=$((24 - $(date +%H)))

echo -e "${PURPLE}🧩 brAInwav AI Engineering Roadmap 2025 Setup${NC}"
echo -e "${PURPLE}===============================================${NC}"
echo -e "${CYAN}Current Time (UTC): ${CURRENT_DATE}${NC}"
echo -e "${CYAN}User: ${CURRENT_USER}${NC}"
echo -e "${CYAN}Week: ${WEEK_NUMBER} | Day: ${DAY_OF_WEEK}${NC}"
echo -e "${YELLOW}⏰ ${HOURS_UNTIL_DAY_END} hours left today!${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# Function to create backup
create_backup() {
    if [ -f "$1" ]; then
        cp "$1" "$1.backup.$(date +%Y%m%d_%H%M%S)"
        echo -e "${BLUE}📋 Backed up existing $1${NC}"
    fi
}

# Check prerequisites
echo -e "${BLUE}🔍 Checking prerequisites...${NC}"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Please run this script from the project root.${NC}"
    exit 1
fi

# Check Node.js version
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js ${NODE_VERSION} found${NC}"
else
    echo -e "${RED}❌ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

# Check Python version
if command_exists python3; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✅ ${PYTHON_VERSION} found${NC}"
else
    echo -e "${RED}❌ Python 3 not found. Please install Python 3.9+${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}📂 Project structure validation:${NC}"
[ -d "frontend-next" ] && echo -e "${GREEN}   ✓ frontend-next/ (Next.js 15 + React 19)${NC}" || echo -e "${RED}   ✗ frontend-next/ missing${NC}"
[ -d "backend" ] && echo -e "${GREEN}   ✓ backend/ (FastAPI + AI integrations)${NC}" || echo -e "${RED}   ✗ backend/ missing${NC}"
echo ""

# Create necessary directories
echo -e "${BLUE}📁 Creating project directories...${NC}"
mkdir -p config scripts logs data/{models,datasets,checkpoints} .vscode

# Install frontend dependencies
echo -e "${PURPLE}📦 Installing enhanced learning dependencies...${NC}"

cd frontend-next

# Check if package-lock.json exists to determine package manager
if [ -f "package-lock.json" ]; then
    PKG_MANAGER="npm"
elif [ -f "yarn.lock" ]; then
    PKG_MANAGER="yarn"
elif [ -f "pnpm-lock.yaml" ]; then
    PKG_MANAGER="pnpm"
else
    PKG_MANAGER="npm"
fi

echo -e "${BLUE}📦 Using ${PKG_MANAGER} as package manager${NC}"

# Install dependencies based on package manager
case $PKG_MANAGER in
    npm)
        npm install --save recharts zustand @tanstack/react-query react-hot-toast sonner date-fns clsx tailwind-merge
        npm install --save-dev @types/react @types/react-dom
        ;;
    yarn)
        yarn add recharts zustand @tanstack/react-query react-hot-toast sonner date-fns clsx tailwind-merge
        yarn add -D @types/react @types/react-dom
        ;;
    pnpm)
        pnpm add recharts zustand @tanstack/react-query react-hot-toast sonner date-fns clsx tailwind-merge
        pnpm add -D @types/react @types/react-dom
        ;;
esac

print_status $? "Frontend dependencies installed"

cd ..

# Configure Python backend
echo -e "${PURPLE}🐍 Configuring Python backend...${NC}"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${BLUE}Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
if [ -f "venv/bin/activate" ]; then
    source venv/bin/activate

    # Upgrade pip
    pip install --upgrade pip

    # Install dependencies
    if [ -f "backend/requirements.txt" ]; then
        pip install -r backend/requirements.txt
        print_status $? "Backend dependencies installed"
    fi

    if [ -f "backend/dev-requirements.txt" ]; then
        pip install -r backend/dev-requirements.txt
        print_status $? "Dev dependencies installed"
    fi
else
    echo -e "${YELLOW}⚠️  Could not activate virtual environment${NC}"
fi

# Set up Ollama for local AI
echo -e "${PURPLE}🦙 Setting up Ollama for local AI...${NC}"

install_ollama() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command_exists brew; then
            brew install ollama
        else
            curl -fsSL https://ollama.com/install.sh | sh
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        curl -fsSL https://ollama.com/install.sh | sh
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        echo -e "${YELLOW}Please download Ollama from: https://ollama.com/download/windows${NC}"
    else
        echo -e "${YELLOW}⚠️  Unsupported OS. Please install Ollama manually from https://ollama.com/${NC}"
    fi
}

if ! command_exists ollama; then
    echo -e "${YELLOW}📥 Ollama not found. Installing...${NC}"
    install_ollama
else
    echo -e "${GREEN}✅ Ollama already installed${NC}"

    # Check if Ollama is running
    if curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
        echo -e "${GREEN}✅ Ollama service is running${NC}"
    else
        echo -e "${YELLOW}Starting Ollama service...${NC}"
        ollama serve >/dev/null 2>&1 &
        sleep 3
    fi
fi

# Configure environment variables
echo -e "${PURPLE}⚙️  Setting up environment configuration...${NC}"

# Create comprehensive .env.local for frontend
create_backup "frontend-next/.env.local"
cat > frontend-next/.env.local << EOF
# brAInwav AI Engineering Roadmap 2025 Configuration
# Generated: ${CURRENT_DATE} UTC
# User: ${CURRENT_USER}

# App Configuration
NEXT_PUBLIC_APP_VERSION=14.0
NEXT_PUBLIC_APP_NAME=brAInwav
NEXT_PUBLIC_USER_NAME=${CURRENT_USER}

# Roadmap Progress
NEXT_PUBLIC_ROADMAP_START_DATE=2025-06-21
NEXT_PUBLIC_CURRENT_DATE=${CURRENT_DATE}
NEXT_PUBLIC_CURRENT_WEEK=${WEEK_NUMBER}
NEXT_PUBLIC_CURRENT_PHASE=phase1
NEXT_PUBLIC_TOTAL_WEEKS=48

# AI Integration
NEXT_PUBLIC_AI_PROVIDER=ollama
NEXT_PUBLIC_OLLAMA_URL=http://localhost:11434
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key_here
NEXT_PUBLIC_ANTHROPIC_API_KEY=your_anthropic_key_here
NEXT_PUBLIC_ENABLE_RECALL_AI=true
NEXT_PUBLIC_RECALL_MIN_DAILY_SAVES=10

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_OFFLINE=true
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true

# Learning Configuration
NEXT_PUBLIC_ENABLE_PROGRESS_TRACKING=true
NEXT_PUBLIC_ENABLE_DAILY_REMINDERS=true
NEXT_PUBLIC_TARGET_DAILY_HOURS=5
NEXT_PUBLIC_TARGET_WEEKLY_HOURS=28
NEXT_PUBLIC_TARGET_DAILY_COMMITS=3
NEXT_PUBLIC_TARGET_WEEKLY_BLOG_POSTS=2

# GitHub Integration
NEXT_PUBLIC_GITHUB_USERNAME=${CURRENT_USER}
NEXT_PUBLIC_GITHUB_REPO=ai-learning-roadmap

# Portfolio Configuration
NEXT_PUBLIC_PORTFOLIO_URL=https://${CURRENT_USER}.ai
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/${CURRENT_USER}
NEXT_PUBLIC_BLOG_URL=https://dev.to/${CURRENT_USER}
EOF

print_status $? "Frontend environment configured"

# Create comprehensive backend .env
create_backup "backend/.env"
cat > backend/.env << EOF
# brAInwav Backend Configuration
# Generated: ${CURRENT_DATE} UTC
# User: ${CURRENT_USER}

# Application
APP_NAME=brAInwav
APP_VERSION=14.0
ENVIRONMENT=development
DEBUG=True
LOG_LEVEL=INFO

# API Keys (Replace with your actual keys)
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GROQ_API_KEY=your_groq_key_here
HUGGINGFACE_API_KEY=your_hf_key_here

# Local AI Configuration
OLLAMA_URL=http://localhost:11434
OLLAMA_MODELS=llama3:8b,codellama:13b,phi3:mini,mistral:latest

# Database
DATABASE_URL=sqlite:///./data/brainwav.db
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=168

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://${CURRENT_USER}.ai

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000

# Storage
UPLOAD_DIR=./data/uploads
MAX_UPLOAD_SIZE=10485760

# Monitoring
SENTRY_DSN=
PROMETHEUS_ENABLED=False
EOF

print_status $? "Backend environment configured"

# Configure VS Code workspace
echo -e "${PURPLE}🆚 Configuring VS Code workspace...${NC}"

# Enhanced VS Code settings
cat > .vscode/settings.json << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.organizeImports": true
  },
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "files.autoSave": "afterDelay",
  "files.autoSaveDelay": 1000,
  "typescript.preferences.importModuleSpecifier": "relative",
  "python.defaultInterpreterPath": "./venv/bin/python",
  "python.testing.pytestEnabled": true,
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "github.copilot.enable": {
    "*": true,
    "yaml": true,
    "plaintext": true,
    "markdown": true
  },
  "github.copilot.chat.welcomeMessage": "always",
  "github.copilot.inlineSuggest.enable": true,
  "workbench.colorTheme": "GitHub Dark Default",
  "workbench.iconTheme": "material-icon-theme",
  "terminal.integrated.defaultProfile.osx": "zsh",
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.defaultProfile.windows": "powershell",
  "terminal.integrated.fontSize": 14,
  "extensions.ignoreRecommendations": false,
  "git.enableSmartCommit": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "editor.minimap.enabled": false,
  "breadcrumbs.enabled": true,
  "editor.rulers": [88, 120],
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.exclude": {
    "**/__pycache__": true,
    "**/.pytest_cache": true,
    "**/node_modules": true,
    "**/.next": true
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.next": true,
    "**/coverage": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.updateImportsOnFileMove.enabled": "always",
  "editor.suggestSelection": "first",
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "workbench.startupEditor": "none",
  "workbench.statusBar.visible": true,
  "workbench.activityBar.visible": true,
  "workbench.sideBar.location": "left",
  "window.zoomLevel": 0,
  "editor.fontSize": 14,
  "editor.lineHeight": 24,
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  },
  "tailwindCSS.emmetCompletions": true,
  "editor.quickSuggestions": {
    "strings": true
  },
  "css.validate": false,
  "editor.inlineSuggest.enabled": true,
  "typescript.suggest.autoImports": true,
  "javascript.suggest.autoImports": true,
  "workbench.editor.labelFormat": "short",
  "explorer.confirmDragAndDrop": false,
  "explorer.confirmDelete": false,
  "terminal.integrated.enableMultiLinePasteWarning": false,
  "security.workspace.trust.untrustedFiles": "open",
  "redhat.telemetry.enabled": false,
  "workbench.editorAssociations": {
    "*.md": "vscode.markdown.preview.editor"
  }
}
EOF

# Create comprehensive tasks.json
cat > .vscode/tasks.json << 'EOF'
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "🚀 Start Full Dev Environment",
      "dependsOn": [
        "Start Frontend",
        "Start Backend",
        "Start Ollama"
      ],
      "group": {
        "kind": "build",
        "isDefault": true
      },
      "problemMatcher": []
    },
    {
      "label": "Start Frontend",
      "type": "shell",
      "command": "npm run dev",
      "options": {
        "cwd": "${workspaceFolder}/frontend-next"
      },
      "isBackground": true,
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "dedicated",
        "group": "development"
      },
      "problemMatcher": {
        "pattern": {
          "regexp": "^$"
        },
        "background": {
          "activeOnStart": true,
          "beginsPattern": "^.*starting.*$",
          "endsPattern": "^.*ready.*$"
        }
      }
    },
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "source venv/bin/activate && uvicorn main:app --reload --port 8000",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "isBackground": true,
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "dedicated",
        "group": "development"
      }
    },
    {
      "label": "Start Ollama",
      "type": "shell",
      "command": "ollama serve",
      "isBackground": true,
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "dedicated",
        "group": "development"
      },
      "problemMatcher": []
    },
    {
      "label": "📚 Start Learning Session",
      "type": "shell",
      "command": "./scripts/start-learning-session.sh",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "🧠 Daily Recall.ai Review",
      "type": "shell",
      "command": "open 'https://www.getrecall.ai/' && echo 'Review your daily saves and create connections!'",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "📝 Create Blog Post",
      "type": "shell",
      "command": "./scripts/create-blog-post.sh",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "🏃 Run All Tests",
      "type": "shell",
      "command": "npm test -- --coverage",
      "options": {
        "cwd": "${workspaceFolder}/frontend-next"
      },
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "dedicated",
        "group": "test"
      }
    },
    {
      "label": "🦙 Pull Ollama Models",
      "type": "shell",
      "command": "ollama pull llama3:8b && ollama pull codellama:13b && ollama pull phi3:mini && ollama pull mistral",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      },
      "problemMatcher": []
    },
    {
      "label": "📊 Show Learning Progress",
      "type": "shell",
      "command": "./scripts/show-progress.sh",
      "group": "build",
      "problemMatcher": []
    },
    {
      "label": "🔄 Daily Backup",
      "type": "shell",
      "command": "./scripts/daily-backup.sh",
      "group": "build",
      "problemMatcher": []
    }
  ]
}
EOF

# Create VS Code extensions recommendations
cat > .vscode/extensions.json << 'EOF'
{
  "recommendations": [
    // Core Development
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "ms-python.black-formatter",
    "charliermarsh.ruff",

    // AI & Productivity
    "GitHub.copilot",
    "GitHub.copilot-chat",
    "Continue.continue",
    "tabnine.tabnine-vscode",

    // Web Development
    "bradlc.vscode-tailwindcss",
    "prisma.prisma",
    "styled-components.vscode-styled-components",

    // Git & GitHub
    "eamodio.gitlens",
    "GitHub.vscode-pull-request-github",
    "mhutchie.git-graph",

    // Markdown & Documentation
    "yzhang.markdown-all-in-one",
    "DavidAnson.vscode-markdownlint",
    "bierner.markdown-mermaid",

    // Utilities
    "aaron-bond.better-comments",
    "wayou.vscode-todo-highlight",
    "gruntfuggly.todo-tree",
    "PKief.material-icon-theme",
    "GitHub.github-vscode-theme",
    "ms-azuretools.vscode-docker",
    "rangav.vscode-thunder-client",
    "humao.rest-client",

    // Data & AI
    "ms-toolsai.jupyter",
    "ms-toolsai.vscode-jupyter-cell-tags",
    "RandomFractalsInc.vscode-data-preview"
  ]
}
EOF

print_status $? "VS Code workspace configured"

# Create learning scripts
echo -e "${PURPLE}📝 Creating learning automation scripts...${NC}"

# Daily reminder script with current context
cat > scripts/daily-reminder.sh << EOF
#!/bin/bash

# Daily AI Engineering Learning Reminder
# Current User: ${CURRENT_USER}
# Generated: ${CURRENT_DATE}

CURRENT_HOUR=\$(date +%H)
CURRENT_DAY=\$(date +%A)
CURRENT_DATE=\$(date +"%Y-%m-%d")

clear

echo "🌅 Good morning, ${CURRENT_USER}!"
echo "📅 \$CURRENT_DAY, \$CURRENT_DATE"
echo ""

# Morning message based on time
if [ \$CURRENT_HOUR -lt 12 ]; then
    echo "☕ Perfect time for deep learning work!"
elif [ \$CURRENT_HOUR -lt 17 ]; then
    echo "🚀 Afternoon - great for hands-on practice!"
else
    echo "🌙 Evening - ideal for review and community engagement!"
fi

echo ""
echo "📊 Your Progress (Week ${WEEK_NUMBER} of 48):"
echo "   Phase: Python Mastery & Foundations"
echo "   Current Project: GitHub Stats CLI"
echo ""

echo "🎯 Today's Schedule:"
echo "   • 9:00-11:00: Deep work (Theory & Courses)"
echo "   • 11:30-13:30: Project work (GitHub Stats CLI)"
echo "   • 14:30-16:30: Learning (Python advanced topics)"
echo "   • 17:00-18:00: Community engagement"
echo ""

echo "✅ Daily Checklist:"
echo "   [ ] Morning: Review Recall.ai saves from yesterday"
echo "   [ ] Save 5+ new items to Recall.ai"
echo "   [ ] Make 3+ GitHub commits"
echo "   [ ] Engage on LinkedIn (1 post, 5 comments)"
echo "   [ ] Complete daily LeetCode problems (2 Easy)"
echo "   [ ] Update learning journal"
echo "   [ ] Plan tomorrow's focus"
echo ""

echo "🔗 Quick Links:"
echo "   • Recall.ai: https://www.getrecall.ai/"
echo "   • Python Course: https://www.coursera.org/specializations/python"
echo "   • GitHub: https://github.com/${CURRENT_USER}"
echo "   • LinkedIn: https://linkedin.com/in/${CURRENT_USER}"
echo ""

echo "💪 Remember: Consistency beats perfection!"
echo ""
echo "Ready to start? Press Enter to launch your dev environment..."
read -r

# Launch development environment
cd frontend-next && npm run dev
EOF

chmod +x scripts/daily-reminder.sh

# Create start learning session script
cat > scripts/start-learning-session.sh << EOF
#!/bin/bash

# Start AI Engineering Learning Session
# User: ${CURRENT_USER}

echo "🚀 Starting AI Engineering Learning Session"
echo "=========================================="

# Get current session info
SESSION_DATE=\$(date +"%Y-%m-%d")
SESSION_TIME=\$(date +"%H:%M")

# Create session log
mkdir -p logs/sessions
SESSION_LOG="logs/sessions/\$SESSION_DATE.log"

echo "Session started at \$SESSION_TIME" >> "\$SESSION_LOG"

# Open necessary resources
echo "📂 Opening learning resources..."

# Open Recall.ai
open "https://www.getrecall.ai/" || xdg-open "https://www.getrecall.ai/" 2>/dev/null

# Open current course
open "https://www.coursera.org/specializations/python" || xdg-open "https://www.coursera.org/specializations/python" 2>/dev/null

# Open GitHub
open "https://github.com/${CURRENT_USER}" || xdg-open "https://github.com/${CURRENT_USER}" 2>/dev/null

# Start timer
echo ""
echo "⏱️  Session timer started!"
echo "   Remember to take breaks:"
echo "   • 5 min break every 25 min (Pomodoro)"
echo "   • 15 min break every 2 hours"
echo ""

# Start focus mode notification
if command -v osascript &> /dev/null; then
    osascript -e 'display notification "Learning session started! Focus mode ON 🎯" with title "brAInwav"'
fi

echo "Press Ctrl+C to end session and log time."

# Trap to log session end
trap 'echo "Session ended at \$(date +%H:%M)" >> "\$SESSION_LOG"; echo "Great work! Session logged to \$SESSION_LOG"' EXIT

# Keep script running
while true; do
    sleep 60
    echo -n "."
done
EOF

chmod +x scripts/start-learning-session.sh

# Create blog post creation script
cat > scripts/create-blog-post.sh << EOF
#!/bin/bash

# Blog Post Creation Helper
# User: ${CURRENT_USER}

echo "📝 Blog Post Creation Assistant"
echo "=============================="

# Get post details
read -p "Post title: " POST_TITLE
read -p "Category (tutorial/journey/project/reflection): " POST_CATEGORY

# Generate filename
POST_DATE=\$(date +"%Y-%m-%d")
POST_FILENAME="\${POST_DATE}-\${POST_TITLE// /-}.md"
POST_PATH="content/blog/\$POST_FILENAME"

# Create blog directory if it doesn't exist
mkdir -p content/blog

# Create post template
cat > "\$POST_PATH" << 'TEMPLATE'
---
title: "\$POST_TITLE"
date: \$POST_DATE
author: "${CURRENT_USER}"
category: "\$POST_CATEGORY"
tags: ["ai-engineering", "learning-journey", "week-${WEEK_NUMBER}"]
readTime: "5 min"
---

## TL;DR

[3-sentence summary of your post]

## Introduction

[Hook your readers with why this matters]

## What I Learned

[Main content - be specific and actionable]

### Key Insight 1

[Details]

### Key Insight 2

[Details]

## Code Example

\`\`\`python
# Your code here
\`\`\`

## Challenges Faced

[Be honest about difficulties]

## Results/Outcome

[What you achieved]

## What's Next

[Your next steps]

## Resources

- [Resource 1](url)
- [Resource 2](url)

---

*This is part of my 48-week AI Engineering journey. Follow along at [GitHub](https://github.com/${CURRENT_USER}/ai-learning-roadmap)*
TEMPLATE

echo "✅ Blog post template created at: \$POST_PATH"
echo ""
echo "Next steps:"
echo "1. Edit the post: code \$POST_PATH"
echo "2. Add to your site"
echo "3. Cross-post to Dev.to, Medium, and LinkedIn"
echo ""

# Open in editor
code "\$POST_PATH" 2>/dev/null || echo "Open \$POST_PATH in your editor"
EOF

chmod +x scripts/create-blog-post.sh

# Create progress tracking script
cat > scripts/show-progress.sh << EOF
#!/bin/bash

# Show Learning Progress
# User: ${CURRENT_USER}

echo "📊 AI Engineering Learning Progress"
echo "=================================="
echo ""

# Calculate days since start
START_DATE="2025-06-21"
CURRENT_DATE=\$(date +%Y-%m-%d)
DAYS_ELAPSED=\$(( (\$(date -d "\$CURRENT_DATE" +%s) - \$(date -d "\$START_DATE" +%s)) / 86400 ))

echo "📅 Timeline:"
echo "   • Started: \$START_DATE"
echo "   • Today: \$CURRENT_DATE"
echo "   • Days elapsed: \$DAYS_ELAPSED"
echo "   • Current week: ${WEEK_NUMBER} of 48"
echo "   • Progress: \$(( (${WEEK_NUMBER} * 100) / 48 ))%"
echo ""

echo "🎯 Current Phase: Python Mastery & Foundations"
echo "   • Status: In Progress"
echo "   • Key Project: GitHub Stats CLI"
echo ""

# Check GitHub stats
if command -v gh &> /dev/null; then
    echo "📊 GitHub Stats:"
    COMMITS_TODAY=\$(git log --oneline --since="midnight" 2>/dev/null | wc -l | tr -d ' ')
    COMMITS_WEEK=\$(git log --oneline --since="7 days ago" 2>/dev/null | wc -l | tr -d ' ')
    echo "   • Commits today: \$COMMITS_TODAY"
    echo "   • Commits this week: \$COMMITS_WEEK"
    echo "   • Current streak: Check GitHub profile"
fi
echo ""

echo "🧠 Learning Metrics:"
echo "   • Target daily hours: 5"
echo "   • Target weekly hours: 28"
echo "   • Recall.ai saves target: 10/day"
echo ""

echo "📝 Content Creation:"
BLOG_COUNT=\$(find content/blog -name "*.md" 2>/dev/null | wc -l | tr -d ' ')
echo "   • Blog posts written: \$BLOG_COUNT"
echo "   • Target: 2 posts/week"
echo ""

echo "🚀 Next Milestones:"
echo "   • [ ] Complete GitHub Stats CLI (Week 1)"
echo "   • [ ] Deploy portfolio site (Week 2)"
echo "   • [ ] First Kaggle competition (Week 3)"
echo "   • [ ] 100 GitHub commits (Week 4)"
echo ""

echo "💪 Keep going! You're building something amazing!"
EOF

chmod +x scripts/show-progress.sh

# Create daily backup script
cat > scripts/daily-backup.sh << EOF
#!/bin/bash

# Daily Backup Script
# User: ${CURRENT_USER}

BACKUP_DATE=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/\$BACKUP_DATE"

echo "🔄 Creating daily backup..."

# Create backup directory
mkdir -p "\$BACKUP_DIR"

# Backup important files
cp -r frontend-next/.env.local "\$BACKUP_DIR/" 2>/dev/null
cp -r backend/.env "\$BACKUP_DIR/" 2>/dev/null
cp -r .vscode "\$BACKUP_DIR/" 2>/dev/null
cp -r content "\$BACKUP_DIR/" 2>/dev/null
cp -r logs "\$BACKUP_DIR/" 2>/dev/null

# Create backup manifest
cat > "\$BACKUP_DIR/manifest.txt" << MANIFEST
Backup created: \$(date)
User: ${CURRENT_USER}
Week: ${WEEK_NUMBER}
Files backed up:
- Environment configurations
- VS Code settings
- Content files
- Learning logs
MANIFEST

echo "✅ Backup completed: \$BACKUP_DIR"

# Clean old backups (keep last 7 days)
find backups -type d -mtime +7 -exec rm -rf {} + 2>/dev/null

echo "🧹 Old backups cleaned"
EOF

chmod +x scripts/daily-backup.sh

# Create git hooks for learning tracking
echo -e "${PURPLE}📊 Setting up learning analytics...${NC}"

mkdir -p .git/hooks

cat > .git/hooks/post-commit << 'EOF'
#!/bin/bash

# Track learning progress after each commit
COMMIT_COUNT=$(git rev-list --count HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B)
COMMIT_TIME=$(date +"%Y-%m-%d %H:%M:%S")

# Log commit
mkdir -p logs/commits
echo "[$COMMIT_TIME] Commit #$COMMIT_COUNT: $COMMIT_MSG" >> logs/commits/history.log

# Motivational message
MESSAGES=(
    "🎉 Great commit! You're making progress!"
    "💪 Another step forward in your AI journey!"
    "🚀 Keep shipping! Every commit counts!"
    "🌟 Excellent work! Your future self will thank you!"
    "🔥 On fire! Maintaining that commit streak!"
)

RANDOM_MSG=${MESSAGES[$RANDOM % ${#MESSAGES[@]}]}
echo ""
echo "$RANDOM_MSG"
echo ""
echo "📊 Total commits: $COMMIT_COUNT"
echo "📝 Remember to:"
echo "  • Update your Recall.ai knowledge base"
echo "  • Document what you learned"
echo "  • Share progress on LinkedIn"
echo ""
EOF

chmod +x .git/hooks/post-commit

# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

echo "🚀 Pre-push checklist:"
echo "  ✓ Code tested?"
echo "  ✓ Documentation updated?"
echo "  ✓ Recall.ai notes saved?"
echo "  ✓ Ready to share publicly?"
echo ""
read -p "Continue with push? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Push cancelled. Take your time! 👍"
    exit 1
fi

echo "Pushing to remote... 🚀"
EOF

chmod +x .git/hooks/pre-push

# Install initial Ollama models in background
echo -e "${PURPLE}🦙 Pulling essential Ollama models (this may take a while)...${NC}"

if command_exists ollama; then
    # Pull models in background
    {
        ollama pull llama3:8b
        ollama pull codellama:13b
        ollama pull phi3:mini
        echo -e "${GREEN}✅ Ollama models ready${NC}"
    } &

    OLLAMA_PID=$!
    echo -e "${BLUE}📥 Downloading models in background (PID: $OLLAMA_PID)${NC}"
fi

# Create initial learning log
mkdir -p logs/daily
cat > "logs/daily/$(date +%Y-%m-%d).md" << EOF
# Learning Log - $(date +"%Y-%m-%d")

## Week ${WEEK_NUMBER}, Day $(date +%u) - ${DAY_OF_WEEK}

### 🎯 Today's Goals
- [ ] Complete Python for Everybody Chapter 1-2
- [ ] Build GitHub Stats CLI basic structure
- [ ] Write first blog post
- [ ] Save 10+ items to Recall.ai
- [ ] Make 3+ GitHub commits

### 📚 Learning Sessions
- **Morning (9:00-11:00)**: [What you plan to learn]
- **Afternoon (14:30-16:30)**: [What you plan to practice]
- **Evening (17:00-18:00)**: [Community engagement plan]

### 🧠 Key Insights
- [Insight 1]
- [Insight 2]

### 💻 Code Written
- [Brief description of code/features implemented]

### 🔗 Resources
- [Links to helpful resources discovered]

### 📊 Metrics
- Hours studied: 0
- Recall.ai saves: 0
- GitHub commits: 0
- LeetCode problems: 0

### 🤔 Reflection
[What went well? What was challenging? What to improve tomorrow?]

### 📅 Tomorrow's Plan
[What will you focus on tomorrow?]
EOF

echo -e "${GREEN}✅ Initial learning log created${NC}"

# Final setup summary
echo ""
echo -e "${GREEN}===============================================${NC}"
echo -e "${GREEN}🎉 brAInwav AI Engineering Roadmap Setup Complete!${NC}"
echo -e "${GREEN}===============================================${NC}"
echo ""
echo -e "${CYAN}📋 Setup Summary:${NC}"
echo -e "   ${GREEN}✅${NC} Frontend dependencies installed"
echo -e "   ${GREEN}✅${NC} Backend environment configured"
echo -e "   ${GREEN}✅${NC} VS Code optimized for AI development"
echo -e "   ${GREEN}✅${NC} Learning scripts created"
echo -e "   ${GREEN}✅${NC} Git hooks configured"
echo -e "   ${GREEN}✅${NC} Daily tracking initialized"
echo ""
echo -e "${PURPLE}🚀 Quick Start Commands:${NC}"
echo ""
echo "1. Start full development environment:"
echo -e "   ${YELLOW}code . && npm run dev${NC}"
echo ""
echo "2. Start learning session:"
echo -e "   ${YELLOW}./scripts/start-learning-session.sh${NC}"
echo ""
echo "3. View your progress:"
echo -e "   ${YELLOW}./scripts/show-progress.sh${NC}"
echo ""
echo "4. Create a blog post:"
echo -e "   ${YELLOW}./scripts/create-blog-post.sh${NC}"
echo ""
echo -e "${BLUE}🔗 Essential Links:${NC}"
echo "   📚 Recall.ai: https://www.getrecall.ai/"
echo "   🐍 Python Course: https://www.coursera.org/specializations/python"
echo "   🐙 GitHub: https://github.com/${CURRENT_USER}"
echo "   💼 LinkedIn: https://linkedin.com/in/${CURRENT_USER}"
echo "   📊 Roadmap: http://localhost:3000/roadmap-2025"
echo ""
echo -e "${PURPLE}📅 Current Status (${CURRENT_DATE} UTC):${NC}"
echo "   • Week: ${WEEK_NUMBER} of 48"
echo "   • Day: ${DAY_OF_WEEK}"
echo "   • Phase: Python Mastery & Foundations"
echo "   • Time remaining today: ${HOURS_UNTIL_DAY_END} hours"
echo "   • Primary goal: Ship GitHub Stats CLI v1.0"
echo ""
echo -e "${GREEN}💪 Your Success Formula:${NC}"
echo -e "${YELLOW}Learn → Practice → RECALL → Project → Publish${NC}"
echo ""
echo -e "${CYAN}🎯 Today's Immediate Actions:${NC}"
echo "   1. Complete LinkedIn post about journey (20 min)"
echo "   2. Finish first blog post (40 min)"
echo "   3. Review Recall.ai saves (15 min)"
echo "   4. Push today's commits (10 min)"
echo ""
echo -e "${PURPLE}Remember: Every expert was once a beginner who refused to give up.${NC}"
echo ""
echo -e "${GREEN}Happy learning, ${CURRENT_USER}! 🚀${NC}"
echo ""

# Open essential resources
if [ "$1" != "--no-open" ]; then
    echo -e "${BLUE}Opening essential resources...${NC}"

    # Function to open URL cross-platform
    open_url() {
        if command_exists open; then
            open "$1" 2>/dev/null
        elif command_exists xdg-open; then
            xdg-open "$1" 2>/dev/null
        elif command_exists start; then
            start "$1" 2>/dev/null
        fi
    }

    # Open resources with delay to prevent overwhelming
    open_url "https://www.getrecall.ai/"
    sleep 1
    open_url "https://github.com/${CURRENT_USER}"
    sleep 1

    # Try to open local dev server
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        open_url "http://localhost:3000/roadmap-2025"
    else
        echo -e "${YELLOW}💡 Start dev server with: cd frontend-next && npm run dev${NC}"
    fi
fi

# Show notification if available
if command_exists osascript; then
    osascript -e 'display notification "Setup complete! Ready to start learning 🚀" with title "brAInwav" subtitle "Week 1, Day 4"'
elif command_exists notify-send; then
    notify-send "brAInwav" "Setup complete! Ready to start learning 🚀\nWeek 1, Day 4"
fi

exit 0
