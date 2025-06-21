# brAInwav MAS Project Scaffold — Production-Grade Template

**Owner:** jamiescottcraik
**Status:** Production-ready, constitution-aligned
**Updated:** 2025-06-19

---

## Purpose

This scaffold is the canonical, company-critical foundation for all brAInwav Multi-Agent System (MAS) projects.
It guarantees strict AI governance, reproducible environments, and automated auditability—ready for solo or team scale.

---

## Directory Structure & Commentary

```text
brAInwav-mas-project-template/
├── .ai/                          # Centralized AI governance & dynamic context
│   ├── context/
│   │   └── project_context.md    # Live project summary for agent consumption
│   └── RULES_OF_AI.md            # Supreme, protected AI constitution
├── .devcontainer/
│   └── devcontainer.json         # VS Code Dev Container config (portable, reproducible)
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── ai_task.yml           # Task prompt template for AI agents
│   │   └── bug_report.yml        # Standardized bug report template
│   ├── workflows/
│   │   ├── backend-ci.yml        # CI/CD for backend
│   │   └── frontend-ci.yml       # CI/CD for frontend
│   ├── CODEOWNERS                # Enforces owner review for protected files
│   ├── copilot-instructions.md   # Explicit Copilot guidance for repo
│   ├── SECURITY.md               # Security policy and vulnerability disclosure
│   ├── PULL_REQUEST_TEMPLATE.md  # Checklist for AI/human PRs
│   └── CONTRIBUTING.md           # Contribution guidelines
├── .vscode/
│   └── settings.json             # Editor/AI tool config (not governance)
├── backend/
│   ├── src/
│   │   ├── agents/               # Modular AI agent implementations
│   │   ├── config.py             # Central config (env, settings)
│   │   ├── core/                 # Core logic/utilities (non-agent)
│   │   ├── features/             # Main business features
│   │   ├── integrations/
│   │   │   └── providers/        # AI/LLM provider integrations
│   │   ├── main.py               # App entrypoint
│   │   └── schemas/              # Data schemas / validation
│   ├── .env.example              # Backend environment variable template
│   └── requirements.txt          # Python dependencies
├── docs/
│   ├── adr/
│   │   └── 000-template-for-new-adr.md # Architecture decision record starter
│   ├── quickstart/
│   │   └── ONE_COMMAND_SETUP.md        # One-command dev environment setup
│   ├── AI_PARTNERSHIP.md               # Human/AI collaboration philosophy
│   ├── feature_plan.md                 # Feature planning docs
│   ├── model_selection_guide.md        # LLM/model selection & rationale
│   ├── PROJECT_STRUCTURE.md            # This canonical structure and rationale
│   └── QUALITY_GATES.md                # Release/merge quality requirements
├── frontend/
│   ├── src/
│   │   ├── assets/                     # Static assets (images, etc.)
│   │   ├── components/                 # Vue/React components
│   │   ├── services/                   # API/data services
│   │   ├── views/                      # Page views
│   │   ├── App.vue                     # Main Vue app entry
│   │   └── main.ts                     # Frontend entrypoint
│   ├── .env.example                    # Frontend environment variable template
│   └── package.json                    # Frontend dependencies/scripts
├── scripts/
│   ├── ai/
│   │   ├── sync_context.py             # Auto-sync AI context at commit/push
│   │   └── update_audit_log.py         # Auto-update AI_CONTRIB_LOG.yaml
│   └── dev/
│       └── one_command_start.sh        # Launches all core dev services at once
├── shared/
│   └── contracts/
│       └── api-schema.yaml             # OpenAPI contract (auto-generated, protected)
├── tests/
│   ├── backend/                        # Backend tests (unit/integration)
│   └── frontend/                       # Frontend tests (unit/component)
├── .editorconfig                       # Coding style unification across all editors
├── .gitignore                          # Ignore rules for Git
├── .pre-commit-config.yaml             # Pre-commit: lint, test, AI audit, context sync
├── AI_CONTRIB_LOG.yaml                 # Immutable log of all AI involvement (auto-updated)
├── CHANGELOG.md                        # Required for release and audit traceability
├── docker-compose.yml                  # Orchestrates dev/test infrastructure (DB, Ollama, etc.)
├── LICENSE                             # Open source/commercial license
├── pyproject.toml                      # Python build/config standard
└── README.md                           # Main entrypoint for project documentation
```

---

## Key Principles

- **AI Governance:**
  `.ai/RULES_OF_AI.md` is the single, protected source of truth for all agent behavior.
  `.ai/context/` is the live, dynamic “brain” for all AI agents.

- **Automation & Audit:**
  Pre-commit, scripts, and CI ensure context freshness and that every AI action is logged in `AI_CONTRIB_LOG.yaml`.

- **Separation of Concerns:**
  - `.ai/` for governance, context, and agent rules
  - `.vscode/`, `.editorconfig` for tool/editor config (not governance)
  - `backend/` and `frontend/` for business/application code only
  - `shared/` for strict, contract-first API schemas

- **Industry Leading Onboarding:**
  All critical docs (`PROJECT_STRUCTURE.md`, `AI_PARTNERSHIP.md`, `ONE_COMMAND_SETUP.md`) are included for instant clarity.

- **Self-Enforcing:**
  `.github/CODEOWNERS` ensures protected files cannot be changed without explicit owner review.

---

## PARA Mapping

- **Projects:** `backend/`, `frontend/`, `shared/`, `tests/`
- **Areas:** `.ai/`, `.github/`, `scripts/`
- **Resources:** `docs/`, `.devcontainer/`, `.vscode/`
- **Archives:** `AI_CONTRIB_LOG.yaml`, `docs/adr/`, `CHANGELOG.md`

---

**This structure is the gold standard for all brAInwav MAS and agent-based projects—every directory and file has a clear, justified purpose. All governance, audit, and automation requirements are met out-of-the-box.**
