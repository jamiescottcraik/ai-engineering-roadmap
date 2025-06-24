---
Governed by `RULES_OF_AI.md`. See repository root for supreme policy.  
Last updated: 2025-06-23 by @jamiescottcraik
---

# Advanced Confidence Log

This document captures detailed confidence assessments, decision rationales, and risk analysis for all significant actions, predictions, and outputs by both human and AI agents in the brAInwav UV Project.

---

## 📋 Purpose

To provide a transparent, auditable record of the certainty, context, and justification behind key project decisions and AI outputs, supporting continuous improvement and responsible governance as required by `RULES_OF_AI.md`.

---

## 🧮 Confidence Log Entry Format

Each entry should use the following template:

```yaml
date: YYYY-MM-DD
actor: <agent or human name>
scope: <file/module/feature/task>
confidence: <High|Medium|Low>
rationale: |
  <A concise but detailed explanation for the confidence level and decision.>
risk_assessment: |
  <Known or potential risks, mitigations, and fallback plans.>
references:
  - <Optional: Related issues, PRs, docs, or policy sections>
```

---

## 📝 Example Entry

```yaml
date: 2025-06-23
actor: github-copilot
scope: backend/src/agents/classifier.py
confidence: High
rationale: |
  Implementation follows the provider abstraction and error handling patterns specified in AGENT.md §3.
  All unit and integration tests pass with >95% coverage.
risk_assessment: |
  Minimal; potential future risk if provider interface changes upstream.
references:
  - https://github.com/brainwav/brainwav/issues/123
  - .ai/AGENT.md
  - .ai/RULES_OF_AI.md
```

---

## ⚡ Logging Guidelines

- **When to Log:**  
  - After major decisions, predictions, or automated actions with non-obvious consequences.
  - When confidence is below "High"—logging is mandatory.
  - When human override or escalation occurs.
  - When required by `.ai/RULES_OF_AI.md` or project policy.

- **How to Log:**  
  - Append new entries in YAML format, most recent first.
  - Do not edit or remove previous entries; all logs are immutable.

- **Review:**  
  - Logs are reviewed in code review and audit processes as evidence of due diligence.

---

## 📚 References

- [RULES_OF_AI.md](./.ai/RULES_OF_AI.md)
- [AGENT.md](./.ai/AGENT.md)
- [AI_CONTRIB_LOG.yaml](./AI_CONTRIB_LOG.yaml)

---

_Last updated: 2025-06-23 by @jamiescottcraik_