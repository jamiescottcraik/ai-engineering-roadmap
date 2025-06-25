# brAInwav AI Engineering Roadmap — Clean Project Structure

**Owner:** jamiescottcraik
**Status:** Production-ready, streamlined after major cleanup
**Updated:** 2025-06-24

---

## Purpose

This is the clean, streamlined structure for the AI Engineering Roadmap personal learning platform.
After major cleanup (June 2025), redundant directories and files have been removed, leaving only the essential components:

- **frontend-next/**: Next.js 15 + React 19 frontend (Glass UI, interactive roadmap)
- **backend/**: FastAPI backend with AI integrations
- **docs/**: Documentation and feature planning
- Clean configuration and development tooling

---

## Directory Structure & Commentary

```text
ai-engineering-roadmap/
├── .ai/                          # AI governance & rules
│   ├── AGENT.md                  # AI agent operational framework
│   └── RULES_OF_AI.md            # Supreme AI constitution
├── .devcontainer/
│   └── devcontainer.json         # VS Code Dev Container config
├── .github/
│   ├── workflows/
│   │   ├── backend-ci.yml        # Backend CI/CD
│   │   └── frontend-ci.yml       # Frontend CI/CD
│   ├── CODEOWNERS                # Protected file ownership
│   └── copilot-instructions.md   # GitHub Copilot guidance
├── .vscode/
│   ├── extensions.json           # Recommended VS Code extensions
│   ├── launch.json               # Debug configurations
│   ├── settings.json             # Workspace settings
│   └── tasks.json                # Development tasks
├── assets/
│   ├── brAInwav.png              # Project logo/assets
│   └── brAInwav-new.png
├── backend/                      # FastAPI Backend
│   ├── src/
│   │   ├── config.py             # Configuration management
│   │   └── main.py               # FastAPI application entry
│   ├── tests/
│   │   ├── conftest.py           # Pytest configuration
│   │   └── test_main.py          # Backend tests
│   ├── .env                      # Environment variables
│   ├── .env.example              # Environment template
│   ├── Dockerfile                # Backend container
│   ├── dev-requirements.txt      # Development dependencies
│   └── requirements.txt          # Production dependencies
├── docs/                         # Documentation
│   ├── adr/
│   │   └── 000-template-for-new-adr.md # Architecture decisions
│   ├── AGENTS/
│   │   ├── enhanced-features.md  # Feature enhancements
│   │   ├── feature_plan.md       # Main feature roadmap
│   │   └── learning-psychology-features.md # Learning features
│   ├── assets/                   # Documentation assets
│   ├── quickstart/
│   │   └── ONE_COMMAND_SETUP.md  # Quick setup guide
│   ├── AI_PARTNERSHIP.md         # Human/AI collaboration guide
│   ├── CHEAT_SHEET.md           # Development cheat sheet
│   ├── PROJECT_STRUCTURE.md     # This file
│   └── README.md                 # Documentation index
├── frontend-next/                # Next.js 15 Frontend (ACTIVE)
│   ├── src/
│   │   ├── app/                  # Next.js App Router
│   │   │   ├── api/              # API routes
│   │   │   ├── globals.css       # Global styles
│   │   │   ├── layout.tsx        # Root layout
│   │   │   ├── page.tsx          # Home page
│   │   │   └── roadmap/          # Roadmap pages
│   │   ├── components/           # React components
│   │   │   ├── layout/           # Layout components
│   │   │   ├── learning/         # Learning features
│   │   │   └── ui/               # UI components
│   │   └── lib/                  # Utilities and hooks
│   ├── public/
│   │   └── content/              # Static content (roadmap data)
│   ├── coverage/                 # Test coverage reports
│   ├── scripts/                  # Build and utility scripts
│   ├── .prettierrc.js           # Code formatting config
│   ├── Dockerfile               # Frontend container
│   ├── Dockerfile.optimized     # Optimized production build
│   ├── eslint.config.mjs        # Linting configuration
│   ├── healthcheck.js           # Docker health check
│   ├── jest.config.js           # Testing configuration
│   ├── next.config.ts           # Next.js configuration
│   ├── package.json             # Dependencies and scripts
│   ├── tailwind.config.ts       # Tailwind CSS config
│   └── tsconfig.json            # TypeScript configuration
├── reports/                      # Test and coverage reports
│   ├── coverage.xml             # Coverage data
│   └── README.md                # Reports documentation
├── scripts/                      # Utility scripts
│   ├── ai/
│   │   └── update_roadmap_progress.py # Progress tracking
│   ├── ci/                       # CI/CD scripts
│   ├── dev/                      # Development utilities
│   ├── audit-links.py           # Link validation
│   ├── fetch_secrets.py         # Secret management
│   ├── pre-commit-check.sh      # Pre-commit validation
│   └── setup_dev_env.sh         # Environment setup
├── .editorconfig                 # Editor configuration
├── .env                          # Environment variables
├── .gitignore                    # Git ignore rules
├── .pre-commit-config.yaml       # Pre-commit hooks
├── AI_CONTRIB_LOG.yaml           # AI contribution audit log
├── CHANGELOG.md                  # Project changelog
├── CONTRIBUTING.md               # Contribution guidelines
├── docker-compose.yml            # Multi-service orchestration
├── LICENSE                       # Project license
├── pyproject.toml                # Python project configuration
├── README.md                     # Main project documentation
├── RESOURCE_OVERVIEW.md          # Resource documentation
└── uv.lock                       # Python dependency lock file
```

---

## Key Principles

- **Clean Architecture:**
  Streamlined structure with only essential components after major cleanup (June 2025)

- **Modern Stack:**
  - Frontend: Next.js 15 + React 19 + TypeScript + TailwindCSS
  - Backend: FastAPI + Python with AI integrations
  - Container: Docker with optimized multi-stage builds

- **Feature-Focused:**
  - Glass UI design system (Apple-style glassmorphism)
  - Interactive learning roadmap with drag-and-drop
  - AI tutor integration with local LLM support
  - Progressive Web App capabilities

- **Development Experience:**
  - VS Code dev containers for consistent environment
  - Comprehensive testing (Jest + RTL for frontend, pytest for backend)
  - Pre-commit hooks for code quality
  - Automated CI/CD pipelines

- **Documentation-Driven:**
  All features planned and documented in `docs/AGENTS/feature_plan.md`

---

## Current Implementation Status

### ✅ Completed (Phase 1-4)

- Next.js 15 + React 19 frontend with TypeScript
- Glass UI design system with glassmorphism effects
- Interactive roadmap visualization
- Learning Kanban board with drag-and-drop
- AI tutor chat interface
- Comprehensive testing infrastructure
- Docker containerization

### 🚀 In Progress (Phase 5)

- Browser window chrome (OpenUI-style)
- Production Docker optimization
- Local data persistence
- PWA offline support

### 📋 Planned Features

- Enhanced learning psychology features
- Time tracking and analytics
- Gamification elements
- Collaborative learning tools

---

## PARA Mapping

- **Projects:** `frontend-next/`, `backend/` (active development)
- **Areas:** `.ai/`, `.github/`, `scripts/` (governance and tooling)
- **Resources:** `docs/`, `.devcontainer/`, `.vscode/` (documentation and config)
- **Archives:** `AI_CONTRIB_LOG.yaml`, `docs/adr/`, `CHANGELOG.md` (historical records)

---

**This structure represents a clean, modern personal learning platform focused on AI engineering education. Every component serves a clear purpose in delivering a beautiful, functional, and maintainable application.**
