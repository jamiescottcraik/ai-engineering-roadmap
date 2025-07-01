# Contributing to the brAInwav MAS Platform

First off, thank you for considering contributing to this project. Your involvement is essential to our mission of building tools that are inclusive, automated, and led by lived experience.

This document serves as a central guide to help you get started. It provides a map to our key documents and outlines the core workflow for making contributions.

## Our Philosophy

We are building tools that don't assume a neurotypical brain. Our work is guided by three core pillars: **Inclusive Design by Default**, **Ethical AI Automation**, and being **Lived-Experience Led**. To learn more about the "why" behind this project, we highly recommend reading our guide to the [**Human-AI Partnership**](../docs/AI_PARTNERSHIP.md).

## Getting Started: The 5-Minute Setup

Our goal is to get you from a clean checkout to a running, fully-configured development environment with zero cognitive tax. We have two primary setup paths:

1. **The Recommended Path (VS Code Dev Containers):** For the fastest, most reliable setup, please follow the [**One-Command Setup Guide**](../docs/quickstart/ONE_COMMAND_SETUP.md).

2. **Local Environment Setup:** If you prefer to work on your local machine, run the automated setup script:

    ```bash
    bash scripts/dev/setup-local-env.sh
    ```

## How to Contribute

We have a highly structured and automated development process to ensure all contributions meet our quality standards.

### Step 1: Find or Create an Issue

All work must be tracked by a GitHub Issue.

- **Propose a new feature or task:** Use our [**🤖 New AI Agent Task** template](../.github/ISSUE_TEMPLATE/ai_task.yml).
- **Report a bug:** Use our [**🐞 Bug Report** template](../.github/ISSUE_TEMPLATE/bug_report.yml).

### Step 2: Understand the Rules

Before writing any code, familiarize yourself with our core governance documents:

- **The Constitution (`RULES_OF_AI.md`):** The supreme law of the repository.
- **The Project Structure (`docs/PROJECT_STRUCTURE.md`):** Explains where everything lives.
- **The Quality Gates (`docs/QUALITY_GATES.md`):** Defines what "done" means.

### Step 3: The Development Workflow

1. **Branching:** Create a new branch from `develop` using the naming convention `type/issue-id-description` (e.g., `feat/BRAIN-123-user-profile`).

2. **Code:** Write your code, adhering to the patterns in our [**AI Code Generation Rules**](./AI_CODEGEN_RULES.md).

3. **Validate Locally:** Before pushing, run the master quality gate script to ensure all checks pass:

    ```bash
    bash scripts/validate_pr.sh
    ```

4. **Commit:** Use the [Conventional Commits](https://www.conventionalcommits.org/) specification for your commit messages.

5. **Pull Request:** Open a pull request against the `develop` branch. Fill out the [**Pull Request Template**](./PULL_REQUEST_TEMPLATE.md) completely. The CI pipelines will automatically run, and AI agents may provide reviews.

## Reporting a Security Vulnerability

Please do not report security vulnerabilities in public issues. Refer to our [**Security Policy**](./SECURITY.md) for the private disclosure process.

---

We look forward to your contributions. If you have any questions, don't hesitate to open an issue and start a discussion.
