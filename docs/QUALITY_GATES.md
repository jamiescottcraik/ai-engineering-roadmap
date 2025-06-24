---
Governed by `RULES_OF_AI.md`. See repository root for supreme policy.  
Last updated: 2025-06-23 by @jamiescottcraik
---

# Quality Gates

This document defines the required conditions ("quality gates") that must be met for any code, configuration, or documentation to be merged or released in the brAInwav UV Project.

---

## ✅ Required Quality Gates Checklist

- [ ] **Constitutional Compliance**
  - All contributions (code, config, docs) must adhere to `.ai/RULES_OF_AI.md` and all referenced governance documents.

- [ ] **PR Scope & Issue Linkage**
  - Every PR must be linked to an approved GitHub Issue that precisely defines the scope of the contribution.
  - PR description must reference and summarize the scope.

- [ ] **Branch & Commit Standards**
  - All code must be committed to a feature or fix branch with a valid name: `feat/<issue-id>-desc` or `fix/<issue-id>-desc`.
  - All commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and include an agent/human signature (see `.ai/AGENT.md`).

- [ ] **Automated Quality Scripts**
  - The pre-merge script (`scripts/validate_pr.sh`) must pass with no errors or warnings.
  - All CI jobs must pass (formatting, linting, type checking, test coverage, accessibility, secret scanning, vulnerability scanning).

- [ ] **Test Coverage**
  - Project-wide code coverage ≥90% (enforced via CI and coverage badge).
  - No untested critical paths; all new features or bugfixes have corresponding tests (unit, integration, or e2e as appropriate).

- [ ] **Code Quality**
  - No linter, formatter, or type checker errors.
  - No TODOs, commented debug code, or console.logs in production code.
  - All code in core modules is provider-agnostic; no direct provider logic outside of allowed directories.

- [ ] **Security & Secrets**
  - No hardcoded secrets, credentials, or tokens in code, configuration, or Docker/devcontainer files.
  - All secrets are managed via 1Password CLI (`op`).
  - All dependencies pass vulnerability scans; no high/critical vulnerabilities.

- [ ] **Accessibility (If Applicable)**
  - All UI changes pass automated accessibility tests (axe, Lighthouse) and conform to WCAG 2.1 AA.
  - Evidence of accessibility validation is provided in the PR.

- [ ] **Documentation**
  - All public APIs, classes, and functions have clear docstrings.
  - Major changes are reflected in the `CHANGELOG.md`, updated guides, and (if architectural) an ADR in `/docs/adr/`.
  - PR includes a summary of what was changed and why.

- [ ] **Review & Sign-Off**
  - At least one peer review/approval is required for merge to protected branches.
  - No unresolved review comments or requested changes.

- [ ] **Error Checking**
  - All error types (syntax, test failures, lint, accessibility, broken links, config, etc.) checked before commit and merge.
  - PR description includes a brief statement of error checks performed.

- [ ] **Escalation**
  - Any ambiguity, conflict, or policy violation is escalated per `.ai/RULES_OF_AI.md` §8 before proceeding.

---

## References

- [RULES_OF_AI.md](./.ai/RULES_OF_AI.md)
- [AGENT.md](./.ai/AGENT.md)
- [SECURITY.md](./SECURITY.md)
- [Accessibility Statement](./docs/accessibility.md)
- [CHANGELOG.md](./CHANGELOG.md)
- [scripts/validate_pr.sh](./scripts/validate_pr.sh)

---

_Last updated: 2025-06-23 by @jamiescottcraik_
