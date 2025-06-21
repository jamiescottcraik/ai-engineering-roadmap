---
# Machine-readable summary of key, enforceable parameters
version: 1.2
owner: '@jamiescottcraik'
enforcement_level: 'strict'
protected_branches:
  - main
  - develop
code_quality:
  test_coverage_threshold: 90
  max_complexity: 10
  style_guides:
    - black
    - ruff
    - isort
accessibility:
  standard: 'WCAG 2.1 AA'
  automated_tools:
    - axe
    - lighthouse
---
# RULES_OF_AI.md – brAInwav MAS Platform Constitution

> **Audience:** ALL contributors, AI agents, and human collaborators. Compliance is mandatory.
> **Purpose:** This document is the **supreme, non-negotiable constitution** for this repository. It governs all code, data, documentation, workflows, and infrastructure.
> **Scope:** These rules apply to the entire repository and any submodules, which MUST inherit this policy.
> **Owner:** @jamiescottcraik
> **Last Updated:** 2025-06-19

---

## 🏆 CORE DIRECTIVES (The Non-Negotiable Principles)

1. **Mission-Bound Execution:** Only implement work defined in a tracked GitHub Issue and aligned with the current `docs/feature_plan.md`. No unapproved work.
2. **P.A.R.A. First:** All file and directory organization **MUST** conform to the P.A.R.A. method (`Projects`, `Areas`, `Resources`, `Archives`) as defined in `docs/PROJECT_STRUCTURE.md`.
3. **Principle of Least Astonishment:** Code and architecture must be simple, predictable, and behave in a way that would least surprise a new developer or agent. Avoid cleverness for its own sake.
4. **No Ambiguity:** If a requirement is unclear, incomplete, or conflicts with these rules, **STOP** work immediately and escalate by creating a "blocking" GitHub Issue.
5. **The 5-Second Rule:** Any asset (code, doc, data) must be locatable and its purpose understood within 5 seconds. If it's not, the organization is wrong.

---

### §1. Version Control

* **Branching:** Use the `develop` branch for integration. All work must be done in feature/fix branches originating from `develop`. `main` is protected and for production-only releases.
  * **Naming:** `feat/<issue-id>-short-desc`, `fix/<issue-id>-short-desc`.
* **Commits:** MUST follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.
* **Pull Requests (PRs):** All merges to `develop` require a PR. The PR description MUST be filled out using the repository template and MUST link to the corresponding GitHub Issue.

### §2. Architecture & Code Quality

* **Provider Neutrality:** Business logic (`/src/features`, `/src/agents`) MUST NOT contain provider-specific code. All provider-specific logic is isolated to modules within `/src/integrations/providers/`.
* **Type Safety:** Strict type annotations are mandatory for all function/method signatures and data models (`mypy --strict`).
* **Asynchronous by Default:** All I/O operations (network, disk, database) MUST be `async/await`.
* **Formatting:** All code MUST pass the automated linting and formatting checks (`black`, `ruff`, `isort`) defined in `.pre-commit-config.yaml`.
* **Resource Management:** Files, network connections, and other managed resources MUST be handled with context managers (`with` statement).

### §3. Security & Configuration

* **Secrets Management:** Secrets MUST ONLY be accessed via the 1Password CLI (`op`). No secrets in `.env` files, source code, tests, or logs.
* **Configuration:** All application configuration MUST be loaded and validated at startup via `pydantic-settings` from environment variables.
* **Dependency Security:** All dependencies are defined in `pyproject.toml`. The CI pipeline will run vulnerability audits; critical vulnerabilities block all merges.

### §4. Testing & Quality Gates

* **Test-Driven Development (TDD):** A failing test that reproduces a bug or defines a new feature MUST be written before the implementation code.
* **Test Coverage:** Project-wide test coverage MUST remain at or above 90%. PRs that decrease coverage will be blocked.
* **Mocking:** All external services (APIs, databases, providers) MUST be mocked during testing.
* **No Bypassing Quality Gates:** Use of `# noqa` or other linting overrides requires an inline justification comment and will be scrutinized during review.

### §5. Error Handling & Logging

* **No Silent Failures:** Operations must either succeed or raise a well-defined exception.
* **Structured Logging:** All logs, especially errors, MUST be emitted as structured JSON. The log must include a timestamp, severity, agent/module name, and stack trace if applicable.
* **Resilience:** Transient network errors MUST trigger a retry mechanism with exponential backoff and a capped number of retries.

### §6. Documentation

* **Docstrings:** All public modules, classes, methods, and functions MUST have a concise docstring explaining their purpose, arguments, and return value.
* **Decision Records:** All significant architectural decisions MUST be documented by adding a new record in the `docs/adr/` directory. (See ADR-001 for template).
* **Guides:** The `README.md` and any affected user guides MUST be updated in the same PR that introduces the change.

### §7. Accessibility

* **Standard:** All user-facing interfaces MUST conform to WCAG 2.1 AA standards.
* **Enforcement:** Automated accessibility checks (`axe`, `Lighthouse`) run in the CI pipeline. Failures will block PR merges.
* **No Accessibility Debt:** Features with known accessibility issues cannot be merged.

### §8. Escalation & Exceptions

* **Escalation Triggers:** Escalate immediately upon any security failure, ambiguity in requirements, or violation of these rules.
* **Protocol:**
    1. Create/update a GitHub Issue, tag it `escalation`, and reference the specific rule violated.
    2. Notify @jamiescottcraik directly via the primary communication channel.
    3. Once resolved, document the decision in a new Architecture Decision Record (`docs/adr/`).
* **Exceptions:** Temporary exceptions to these rules require a time-boxed PR approved by @jamiescottcraik and must be logged as a "technical debt" ADR.

### §9. Enforcement Matrix

| Rule Category       | How It's Enforced                            | Merge Blocker         |
| :------------------ | :------------------------------------------- | :-------------------- |
| §1. Version Control | `pre-commit` hooks, GitHub Branch Protection | Yes                   |
| §2. Code Quality    | CI Pipeline (Linting, Formatting, `mypy`)    | Yes                   |
| §3. Security        | CI Pipeline (Secret scanning, Vuln. audit)   | Yes                   |
| §4. Testing         | CI Pipeline (Pytest Coverage Check)          | Yes                   |
| §5. Logging         | Peer Review                                  | No (Hard to automate) |
| §6. Documentation   | Peer Review, `pre-commit` hooks (ADRs)       | No (Encouraged)       |
| §7. Accessibility   | CI Pipeline (`axe`, `Lighthouse` scans)      | Yes                   |
| §8. Escalation      | `CODEOWNERS` Review (@jamiescottcraik)       | Yes                   |

### §10. Policy Hierarchy

1. `RULES_OF_AI.md` (This file) — **Supreme Law**
2. Architecture Decision Records (`docs/adr/`) — **Binding Decisions**
3. `docs/PROJECT_STRUCTURE.md` — **Physical Layout**
4. GitHub Issues — **Work Directives**
5. All other documentation.

> All subordinate policy documents (e.g., in `docs/`) must begin with the header: *“Governed by `RULES_OF_AI.md`.”*

---

*This document is absolute. All contributors and agents must comply. Deviation is not permitted without an explicit, time-boxed, and logged exception via the process in §8.*

**Jamie Scott Craik**
Owner, brAInwav MAS Platform
