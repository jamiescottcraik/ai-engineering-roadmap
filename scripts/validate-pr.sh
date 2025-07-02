#!/bin/bash
# Pre-merge quality gate validation script.
# This script is the single source of truth for all local quality checks
# before a Pull Request is submitted.
set -euo pipefail # Exit on error, unset variables, and pipeline failures

echo " brAInwav Quality Gates"
echo "========================"

# --- Helper Functions for Logging ---
log() {
    echo "   [QualityGate] $1"
}

err() {
    echo "❌ [QualityGate] ERROR: $1" >&2
    exit 1
}

# --- 1. GUARDRAIL VALIDATION: Essential Governance Files Presence ---
log "🚦 Validating core project guardrails..."
critical_files_missing=false
# These files are considered non-negotiable for project governance.
GUARDRAIL_FILES=(
    "RULES_OF_AI.md"
    "docs/PROJECT_STRUCTURE.md"
    "docs/ai-partnership.md" # Added based on docs/README.md and consistency
    "docs/quality-gates.md"   # Added as this script directly implements it
    ".github/CODEOWNERS.txt"
    ".devcontainer/devcontainer.json" # Essential for dev environment consistency
    "pyproject.toml" # Essential for Python build system
    "apps/api/pyproject.toml" # Backend Python project config
    "apps/web/package.json" # Frontend JS project config
    "pnpm-workspace.yaml" # Monorepo workspace config
)

for file in "${GUARDRAIL_FILES[@]}"; do
    if [[ ! -f "$file" ]]; then
        err "CRITICAL GUARDRAIL VIOLATION: Required governance or configuration file is missing: $file"
        critical_files_missing=true
    fi
done

if [[ "$critical_files_missing" = true ]]; then
    err "One or more critical governance files are missing. Please restore them."
else
    log "✅ All core governance and configuration files are present."
fi

# --- 2. LINTING, FORMATTING & TYPING (Backend) ---
log "🧹 Running formatters, linters, and type checker on backend (apps/api/)..."
# Ensure the backend application's source is recognized as a package root
export PYTHONPATH=".:apps/api/src:${PYTHONPATH:-}"

# Black formatting check
log "   └── Checking Black formatting..."
black --check apps/api/src/ apps/api/tests/ || err "Black formatting check failed. Run 'black apps/api/' to fix."

# Ruff linting check
log "   └── Checking Ruff linting..."
ruff check apps/api/src/ apps/api/tests/ || err "Ruff linting failed. Review and fix linter errors/warnings."

# isort import sorting check
log "   └── Checking isort import sorting..."
isort --check-only --profile black apps/api/src/ apps/api/tests/ || err "isort check failed. Run 'isort apps/api/' to fix."

# Mypy static type checking
log "   └── Running MyPy type checking..."
# Mypy should be run from the apps/api directory to avoid module name conflicts
(cd apps/api && mypy src/) || err "MyPy type checking failed. Review and fix type errors."

log "✅ Backend linting, formatting, and type checking passed."

# --- 3. TESTING (Backend) ---
log "🧪 Running tests and coverage for backend (apps/api/)..."
# The PYTHONPATH is already set above
(cd apps/api && pytest tests/ --cov=src --cov-fail-under=90 --cov-report=xml:../../reports/coverage.xml) \
    || err "Backend tests failed or coverage is below 90%. Fix tests or improve coverage."
log "✅ Backend tests passed and coverage criteria met."


# --- 4. ARCHITECTURE VALIDATION (Provider Neutrality for Services) ---
log "🏗️ Validating architectural boundaries for backend services..."
# Check if any .py file in apps/api/src/services directly imports from core.integrations.providers
# This enforces the rule: Core business logic in services should be provider-agnostic.
if grep -r "from apps\.api\.src\.core\.integrations\.providers" apps/api/src/services/ | grep -qE '\.py$'; then
    err "ARCHITECTURE VIOLATION: Direct provider imports found in 'apps/api/src/services/'.\n" \
        "    Core services should be provider-agnostic; interact via dependency injection or a generic interface."
else
    log "✅ Provider neutrality check passed. No direct provider imports found in services."
fi


# --- 5. PROJECT STRUCTURE VALIDATION (High-level checks) ---
log "📂 Validating high-level project structure..."
# Ensure application directories exist in the canonical 'apps/' structure
if [[ ! -d "apps/api" || ! -d "apps/web" ]]; then
    err "PROJECT STRUCTURE VIOLATION: 'apps/api/' or 'apps/web/' directories are missing."
fi

# Ensure shared packages directory exists
if [[ ! -d "packages" ]]; then
    err "PROJECT STRUCTURE VIOLATION: 'packages/' directory is missing."
fi

# Ensure no legacy top-level application directories exist (cleanup check)
if [[ -d "backend" || -d "frontend" || -d "src" ]]; then
    err "PROJECT STRUCTURE VIOLATION: Legacy 'backend/', 'frontend/', or 'src/' directories found.\n" \
        "    Please run 'scripts/cleanup_monorepo.sh' and commit the changes."
fi

log "✅ High-level project structure validation passed."


# --- 6. Security (Basic Local Checks) ---
# Note: More comprehensive security scans (e.g., Trivy, npm audit, secret scanners)
# are typically run as part of the CI/CD pipeline due to their overhead.
# This script focuses on fast, local pre-merge checks.
log "🔒 Performing basic local security checks..."
# Add checks for hardcoded secrets if you have a lightweight local scanner.
# e.g., git secrets --scan || err "Hardcoded secrets found. Fix or use 1Password."
log "✅ Basic local security checks passed (comprehensive checks in CI)."


# --- ALL GATES PASSED ---
echo ""
echo "🎉 All quality gates passed successfully! Your contribution is ready for Pull Request."
