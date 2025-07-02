# Project Structure

## Overview

brAInwav: The Assistive Foundry is a monorepo containing a full-stack AI-powered learning and development platform.

## Repository Structure

```text
ai-engineering-roadmap/
├── apps/                          # Application code
│   ├── api/                       # FastAPI backend service
│   │   ├── src/                   # Python source code
│   │   │   ├── core/              # Core domain models and business logic
│   │   │   │   └── models/        # SQLAlchemy models and database schemas
│   │   │   ├── integrations/      # External service integrations
│   │   │   │   └── providers/     # Provider implementations (Ollama, etc.)
│   │   │   ├── routers/           # FastAPI route handlers
│   │   │   ├── services/          # Business logic services
│   │   │   ├── config.py          # Application configuration
│   │   │   └── main.py            # FastAPI application entry point
│   │   ├── tests/                 # Python tests
│   │   │   └── services/          # Service layer tests
│   │   ├── scripts/               # API-specific scripts
│   │   ├── alembic.ini            # Database migration configuration
│   │   ├── pyproject.toml         # Python dependencies and build config
│   │   ├── uv.lock                # Dependency lock file
│   │   └── README.md              # API documentation
│   └── web/                       # Next.js frontend application
│       ├── src/                   # TypeScript/React source code
│       │   ├── app/               # Next.js App Router pages
│       │   ├── components/        # React components
│       │   ├── hooks/             # Custom React hooks
│       │   ├── lib/               # Utility libraries
│       │   └── services/          # Frontend service layer
│       ├── public/                # Static assets
│       │   ├── config/            # Configuration files
│       │   └── content/           # Content files (roadmap data, etc.)
│       ├── pages/                 # Next.js Pages Router (legacy)
│       ├── scripts/               # Web-specific scripts
│       ├── coverage/              # Test coverage reports
│       ├── package.json           # Node.js dependencies
│       ├── next.config.js         # Next.js configuration
│       ├── tailwind.config.ts     # Tailwind CSS configuration
│       ├── tsconfig.json          # TypeScript configuration
│       └── README.md              # Frontend documentation
├── packages/                      # Shared packages
│   ├── types/                     # Shared TypeScript types
│   │   └── src/                   # Type definitions
│   ├── ui/                        # Shared UI components
│   │   └── src/                   # Component library
│   └── utils/                     # Shared utilities
│       └── src/                   # Utility functions
├── scripts/                       # Development and deployment scripts
│   ├── ai/                        # AI-related automation scripts
│   ├── ci/                        # Continuous integration scripts
│   ├── dev/                       # Development helper scripts
│   ├── development/               # Development workflow scripts
│   ├── pre-commit/                # Git pre-commit hooks
│   └── setup/                     # Environment setup scripts
├── docs/                          # Documentation
│   ├── adr/                       # Architecture Decision Records
│   ├── accessibility/             # Accessibility documentation
│   │   └── guides/                # Accessibility implementation guides
│   ├── api-reference/             # API documentation
│   ├── architecture/              # System architecture docs
│   ├── assets/                    # Documentation assets
│   ├── cortex-framework/          # Cortex methodology documentation
│   ├── guides/                    # User and developer guides
│   ├── learning-paths/            # Learning content
│   ├── packages/                  # Package-specific documentation
│   └── quickstart/                # Quick start guides
├── mcp-servers/                   # Model Context Protocol servers
│   └── custom/                    # Custom MCP server implementation
├── shared/                        # Shared configurations and contracts
│   └── contracts/                 # API contracts and schemas
├── alembic/                       # Database migration files
│   └── versions/                  # Migration version files
├── assets/                        # Project assets (images, etc.)
├── reports/                       # Generated reports (coverage, etc.)
├── .ai/                          # AI agent configurations
├── .github/                      # GitHub workflows and templates
├── .migration/                   # Migration artifacts and archives
├── .vscode/                      # VS Code configuration
├── docker-compose.yml            # Main Docker Compose configuration
├── docker-compose.dev.yml        # Development environment overrides
├── pnpm-workspace.yaml           # PNPM workspace configuration
├── pyproject.toml                # Root Python configuration
├── turbo.json                    # Turborepo configuration
├── package.json                  # Root package.json for monorepo
├── pnpm-lock.yaml                # PNPM lock file
└── RULES_OF_AI.md                # AI governance rules
```

## Key Technologies

### Frontend (apps/web/)

- **Framework**: Next.js 15+ with React Server Components
- **Authentication**: Firebase Auth with GitHub provider
- **UI Framework**: shadcn/ui components
- **State Management**: Zustand for client state
- **Drag & Drop**: dnd-kit for interactive elements
- **Voice Engine**: Ultravox for voice interactions
- **Code Editor**: Monaco Editor for embedded IDE
- **Styling**: Tailwind CSS with custom configuration
- **Testing**: Jest with React Testing Library
- **Content**: Static roadmap data in public/content/

### Backend (apps/api/)

- **Framework**: FastAPI with Uvicorn
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: Firebase Auth integration
- **AI Integration**: OpenAI, Anthropic, and local Ollama via providers
- **Validation**: Pydantic for data validation
- **Migration**: Alembic for database migrations
- **Router Architecture**: Organized endpoints (health, roadmap, ollama)
- **Core Models**: SQLAlchemy Base and domain models
- **Provider Pattern**: External service abstractions in integrations/providers/

### Development Tools

- **Package Manager**: pnpm for Node.js, uv for Python
- **Code Quality**: Ruff (Python), ESLint/Prettier (TypeScript)
- **Testing**: pytest (Python), Jest (TypeScript)
- **Type Checking**: MyPy (Python), TypeScript (JavaScript/React)
- **Containerization**: Docker and Docker Compose
- **AI Integration**: Model Context Protocol (MCP) servers
- **Monorepo**: Turborepo for build orchestration
- **Pre-commit**: Automated code quality checks
- **Spell Check**: cSpell for project-wide spell checking

### Docker Compose Structure

The project uses a two-file Docker Compose setup:

- **`docker-compose.yml`**: Main services (PostgreSQL database, MCP server)
- **`docker-compose.dev.yml`**: Development overrides (hot-reload, development ports)

Usage:

```bash
# Main services only
docker-compose up -d

# Development with hot-reload
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Development with web profile
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up -d
```

## File Naming Conventions

- **All files**: kebab-case (e.g., `my-component.tsx`, `user-service.py`)
- **Exceptions**: `README.md`, `RULES_OF_AI.md`, `AGENTS.md` (documentation standards)
- **Components**: kebab-case filenames, PascalCase exports
- **Directories**: kebab-case for consistency

## Development Workflow

1. **Setup**: Run setup scripts in `scripts/setup/`
2. **Dependencies**: Install with `pnpm install` and `uv pip install -e ".[dev]"`
3. **Quality Gates**: Validate with `./scripts/validate-pr.sh`
4. **Testing**: Run tests with VS Code tasks or npm/pytest commands
5. **Documentation**: Update relevant docs with code changes
6. **Router Development**: Use organized router structure in `apps/api/src/routers/`
7. **Provider Integration**: Add new external services via provider pattern
8. **Database Changes**: Create Alembic migrations for schema changes

## Architecture Principles

- **Accessibility First**: WCAG 2.1 AA compliance, screen reader support
- **Offline Capability**: Local AI models and offline-first design
- **Ethical AI**: Transparent AI reasoning and user control
- **Modular Design**: Clear separation of concerns and reusable components
- **Type Safety**: Full TypeScript coverage and Pydantic validation
- **Provider Neutrality**: External services abstracted via provider pattern
- **Router Organization**: Clean API structure with organized endpoint groups
- **Test-Driven Development**: Comprehensive test coverage (>90%)

## Environment Requirements

- **Node.js**: LTS version (18+)
- **Python**: 3.11+
- **Docker**: For containerized services and MCP servers
- **Git**: For version control and pre-commit hooks
- **VS Code**: Recommended IDE with project-specific settings
- **pnpm**: Package manager for Node.js dependencies
- **uv**: Fast Python package manager
- **PostgreSQL**: Database (via Docker or local installation)
