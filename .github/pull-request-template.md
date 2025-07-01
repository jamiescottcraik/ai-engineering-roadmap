# Pull Request Definition of Done Checklist

This checklist reflects the automated quality gates in `scripts/validate_pr.sh`.

- [ ] Constitution: I have reviewed `/RULES_OF_AI.md` and this PR adheres to its principles.
- [ ] Scope: This PR's implementation exactly matches the scope defined in the linked GitHub Issue(s).
- [ ] Testing: All new code is fully tested, and I have maintained or increased the project's test coverage (target: ≥90%).
- [ ] Quality Gates: The master validation script (`/scripts/validate_pr.sh`) passes locally.
- [ ] Audit Trail: The commit message follows the Conventional Commits specification and includes the `[ai-assisted: ...]` footer. I understand the `AI_CONTRIB_LOG.yaml` will be updated automatically if required.
- [ ] Documentation: I have added/updated docstrings for all public-facing code and updated relevant documents in the `/docs` directory.
- [ ] Security: I have ensured no secrets are present in the code and have followed all security best practices.
- [ ] Accessibility: (If applicable) All UI changes meet WCAG 2.1 AA standards and include validation evidence.
- [ ] Self-explanation: The "What / Why / Impact" section below is completed.
- [ ] Linked Issues: All related issues/feature items are linked below.
- [ ] Escalation: Any blockers or questions are clearly called out in comments for @jamiescottcraik.

## What / Why / Impact

_Describe the purpose, motivation, and expected impact of this PR._

## Linked Issues

_Reference all related issues (e.g., `Closes #123`)._

## 🤖 AI Agent Declaration

- **Agent Used:** [e.g., openai_codex_platform, github_copilot, or N/A]
- **Primary Task:** [e.g., Implemented the core logic for the classification service based on the issue description.]

---

### Escalate for Reviewer: @jamiescottcraik
