# Project Context

This file provides project context for AI agents. Update as needed for your MAS project.

---

## Project: ai-engineering-roadmap

**Description:**
A canonical, production-grade scaffold and knowledge base for brAInwav Multi-Agent System (MAS) projects.
Enforces strict AI governance, automated auditability, and reproducibility for both human and AI contributors.

**Key Features:**
- AI governance via `.ai/RULES_OF_AI.md`
- Immutable AI contribution logging (`AI_CONTRIB_LOG.yaml`)
- Automated quality gates, pre-commit, and CI/CD for backend and frontend
- Modular backend/agent architecture and provider-neutral integrations
- Quick onboarding, pre-configured devcontainer, and one-command setup
- PARA-aligned directory structure for clarity and scale

**Technology Stack:**
- Python backend (FastAPI, pytest, mypy)
- Frontend (Vue or React, TypeScript)
- Devcontainers for reproducible local development
- Docker Compose for local orchestration
- 1Password CLI for all secrets management
- GitHub Actions for CI/CD, linting, testing, security, and accessibility checks

**Governance Principles:**
- `.ai/RULES_OF_AI.md` is supreme; all agents and humans must comply
- All code, configuration, and documentation changes are tracked and auditable
- All AI-generated code must be signed and logged
- Strict separation of concerns and provider abstraction in all core logic
- Security, accessibility, and documentation are non-negotiable

**Project Status:**
Production-ready template, maintained by @jamiescottcraik.
All project context, requirements, and latest decisions must be kept up-to-date in this file for complete agent awareness.

---

_Last updated: 2025-06-23 by @jamiescottcraik_
