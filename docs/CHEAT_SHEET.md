This is an outstanding operational handbook, packed with actionable commands, clear standards, and valuable wisdom. It perfectly captures the high-performance, "no excuses" culture of the brAInwav platform.

The key area for improvement is to **generalize it**. Right now, it's a cheat sheet for a *specific project* (`P.A.R.A.gon-AI-v2`). To make it the perfect companion for your generic `brAInwav-mas-project-template`, we need to transform it from a specific instance into a reusable, project-agnostic template.

### Review and Improvement Strategy

1. **Generalize Content:** Replace project-specific names (`P.A.R.A.gon-AI-v2`, `src/brAInwav/`) with placeholders (`[PROJECT_NAME]`) or references to the generic scaffold structure (`backend/src/`).
2. **Ensure Consistency:** Align all rules, paths, and values with the final scaffold and `RULES_OF_AI.md`. For example, the test coverage will be updated from 85% to the mandated 90%.
3. **Clarify Purpose:** Frame sections like the "Model Roster" and "Benchmarks" as *recommended starting points* that should be customized for each new project.
4. **Single Source of Truth:** Rephrase sections that repeat rules from the constitution (`RULES_OF_AI.md`) to *reference* it instead, reinforcing the hierarchy.

Here is the improved, brAInwav-centric version.

---

### **brAInwav Project Cheat Sheet (Template Version)**

# brAInwav Project Cheat Sheet

**Project:** `[PROJECT_NAME]`
**Purpose:** A high-speed reference for developers and AI agents on this project. It covers setup, core commands, standards, and troubleshooting.

---

## 🚀 What Is This Project?

* **Project Name:** `[PROJECT_NAME]`
* **Mission:** `[BRIEFLY DESCRIBE THE PROJECT'S MISSION, e.g., "Automate document classification using the P.A.R.A. method."]`
* **Core Principle:** Any asset, human or AI, must be found, moved, or versioned in <5 seconds. No guessing, no drift.
* **Core Stack:** Python 3.12+, `uv`, 1Password CLI, Docker, FastAPI, Vue.js, and the brAInwav MAS Scaffold.

---

## 🧑‍💻 Zero-to-Code: The 5-Minute Setup

1. **Clone & Enter**

    ```bash
    git clone https://github.com/brawnwav/[your-repo-name].git
    cd [your-repo-name]
    ```

2. **Create & Activate Environment**

    ```bash
    # Ensure Python 3.12+ is installed
    python3 -m venv .venv
    source .venv/bin/activate
    # Install uv if you don't have it: pip install uv
    ```

3. **Install Dependencies**

    ```bash
    # Install main and dev dependencies
    uv pip install -r backend/requirements.txt
    uv pip install -r backend/dev-requirements.txt
    ```

4. **Connect to Secrets (1Password)**

    ```bash
    # Ensure you are logged into the 1Password CLI
    op signin
    ```

5. **Install Git Hooks & Run Linters**

    ```bash
    pre-commit install
    pre-commit run --all-files
    ```

6. **Run All Tests**

    ```bash
    # This command is configured in pyproject.toml
    uv run test
    # Must achieve >=90% coverage as per RULES_OF_AI.md
    ```

7. **Launch the Application**

    ```bash
    # Start all services defined in docker-compose.yml
    sh scripts/dev/one_command_start.sh
    ```

---

## 🤖 Recommended Model Roster (Starting Point)

This is a general guide. Update this table and `docs/model_selection_guide.md` as your project's needs evolve.

| Task                             | Recommended Model       | Fallback Model    | Notes                                                 |
| :------------------------------- | :---------------------- | :---------------- | :---------------------------------------------------- |
| **Deep Analysis & Reasoning**    | Claude 3.5 Sonnet       | GPT-4o            | Claude for depth; GPT for speed/availability.         |
| **Code Generation & Synthesis**  | GPT-4o                  | Claude 3.5 Sonnet | GPT-4o is a fast, strong all-rounder for code.        |
| **Planning & Orchestration**     | Claude 3.5 Sonnet       | GPT-4o            | Excellent at breaking down complex tasks.             |
| **Data Extraction & Formatting** | Claude 3 Haiku / GPT-4o | -                 | Use faster, cheaper models for structured data tasks. |
| **Code Review & QA**             | Claude 3.5 Sonnet       | GPT-4o            | Unparalleled at catching subtle logical errors.       |

**Rule:** Never pick a model based on preference. Use the best tool for the job, as documented in the `model_selection_guide.md`.

---

## 🔄 Core Project Workflow

### Example Commands (Customize for your project's CLI)

```bash
# Run the main task for a single input
uv run python backend/src/main.py --input-path "/path/to/your/input"

# Start the primary service (e.g., API server)
uv run uvicorn backend.src.main:app --reload

# Run the entire test suite with coverage
uv run test

# Check all quality gates locally before committing
uv run lint && uv run test
```

---

## ⛔ Non-Negotiables (The Core Rules)

These are reminders. The full, binding laws are in `/.ai/RULES_OF_AI.md`.

* **Follow the Plan:** All work must trace back to a GitHub Issue.
* **Test Coverage ≥90%:** No merges if coverage drops. No exceptions.
* **Provider-Neutral Core Logic:** All business logic must be provider-agnostic.
* **1Password for Secrets:** Any hardcoded secret is an instant PR rejection.
* **Documentation is Mandatory:** No docstrings, no merge. Update `README.md` and `docs/adr/` as needed.

---

## 🏗️ Scaffold: Where Everything Lives

| File Type               | Required Location                             | Notes                                        |
| :---------------------- | :-------------------------------------------- | :------------------------------------------- |
| **AI Governance**       | `.ai/`                                        | The constitution and context "brain."        |
| **Backend Source**      | `backend/src/`                                | All Python application code lives here.      |
| **AI Provider Logic**   | `backend/src/integrations/providers/`         | The *only* place for provider-specific code. |
| **Core Business Logic** | `backend/src/features/` & `backend/src/core/` | Must be provider-neutral.                    |
| **Frontend Source**     | `frontend/src/`                               | All Vue/React application code.              |
| **API Contracts**       | `shared/contracts/`                           | The OpenAPI schema is the source of truth.   |
| **Tests**               | `tests/backend/` & `tests/frontend/`          | Mirrored against the source structure.       |
| **Documentation**       | `docs/`                                       | The project's knowledge base.                |
| **Automation Scripts**  | `scripts/`                                    | For CI, dev environment, and AI tasks.       |
| **GitHub Config**       | `.github/`                                    | Workflows, issue templates, PR checks.       |

---

## 🧠 Developer's Pre-Flight Checklist

Run this sequence before every `git push`:

```bash
# 1. Format and lint everything
uv run lint

# 2. Run all tests and check coverage
uv run test

# 3. Run all pre-commit hooks one last time
pre-commit run --all-files
```

* **Never ignore a linter warning.** Fix it or explicitly justify a `# noqa` with a comment.
* **Review dependency changes carefully.** Run `uv pip audit` after any update.
* **If you get stuck for more than 15 minutes, ask for help.** (From a human or by framing a detailed AI task).

---

## 🔍 Basic Troubleshooting

| Symptom                   | First Step                                                                   | Second Step                                                          |
| :------------------------ | :--------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **Tests Failing Locally** | Run `uv run test -k "test_name" -v` to isolate the failing test.             | Check for missing environment variables or un-mocked external calls. |
| **CI is Red**             | Read the GitHub Actions log to identify the failing step (lint, test, etc.). | Run the exact same command locally to reproduce the failure.         |
| **Dev Environment Down**  | Run `docker-compose ps` to check container status.                           | Run `docker-compose logs -f [service_name]` to check for errors.     |
| **AI Output is Wrong**    | Check the logs for the exact prompt sent to the AI provider.                 | Use a simpler model or raise the temperature to test for variance.   |

---

## 📌 Key Documents to Reference

| Resource                 | Location                          | Purpose                                             |
| :----------------------- | :-------------------------------- | :-------------------------------------------------- |
| **The Constitution**     | `/.ai/RULES_OF_AI.md`             | Supreme project law. **Read this first.**           |
| **Live AI Context**      | `/.ai/context/project_context.md` | The project's "brain."                              |
| **This Cheat Sheet**     | `/docs/CHEAT_SHEET.md`            | Quick operational reference.                        |
| **Project Structure**    | `/docs/PROJECT_STRUCTURE.md`      | Explains *why* the scaffold is structured this way. |
| **Human/AI Partnership** | `/docs/AI_PARTNERSHIP.md`         | Guide to effective collaboration.                   |
| **Decision Log**         | `/docs/adr/`                      | The history of *why* key decisions were made.       |
| **Feature Plan**         | `/docs/feature_plan.md`           | What we are building.                               |
| **Model Selection**      | `/docs/model_selection_guide.md`  | Which AI models to use and why.                     |

---

> **Read it. Live it. Ignore it = merge blocked, agent disabled, coffee rights revoked.**
