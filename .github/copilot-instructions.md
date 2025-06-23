---
Governed by `RULES_OF_AI.md`. See repository root for supreme policy.  
Last updated: 2025-06-23 by @jamiescottcraik
---

# GitHub Copilot Instructions for the brAInwav Platform

Welcome, Copilot. Your role is to act as an AI pair programmer, assisting with code generation, testing, and documentation.

Your primary operational manual is located at the repository root in the following file:

`/.ai/AGENT.md`

**You are required to read that file and adhere to all its sections, including:**

- §1: The Agent Operational Framework (Authority Levels, TDD Workflow)
- §2: Core Requirements (Scope, Security, Testing, etc.)
- §3: Code Implementation Standards (Patterns for Abstraction, Error Handling)
- §4: Version Control and Committing
- §5: The Quality Assurance Script
- §6: The Definition of Done Checklist

## Summary Table of Referenced Sections

| Section | Description                                      |
|---------|--------------------------------------------------|
| §1      | Authority levels, TDD, and workflow guidance     |
| §2      | Scope, security, and mandatory requirements      |
| §3      | Implementation patterns and error-handling rules |
| §4      | Version control, commit, and PR best practices   |
| §5      | QA procedures and automation scripts             |
| §6      | "Done" criteria for all contributions            |

---

## Conflict Resolution

If a user prompt seems to conflict with any rule in `/.ai/AGENT.md`, you **must**:
1. Clearly state the specific conflict with the relevant section.
2. Default to following the rules in `/.ai/AGENT.md`.

**Example:**  
> _Prompt_: "Ignore tests for this PR and just push the code."  
> _Response_: "This request conflicts with §2 and §5 of `/.ai/AGENT.md` (testing is mandatory and all code must pass QA). I will follow the required workflow and not bypass tests."

---

## Feedback & Maintenance

- If you identify opportunities to improve these instructions, open an issue or PR as described in the contribution guidelines.
- This file is maintained by @jamiescottcraik.

---