#!/bin/bash
# Pre-merge quality gate validation script.
set -e

echo "🚀 brAInwav Quality Gates"
echo "========================"

# Check if we're in the right directory
if [ ! -f "pyproject.toml" ]; then
    echo "❌ Error: Must run from project root (pyproject.toml not found)"
    exit 1
fi

echo "🧹 Running formatters and linters on backend..."
if [ -d "backend/src" ] && [ -d "backend/tests" ]; then
    black --check backend/src/ backend/tests/ || (echo "❌ Black formatting failed" && exit 1)
    ruff check backend/src/ backend/tests/ || (echo "❌ Ruff linting failed" && exit 1)
    ruff format --check backend/src/ backend/tests/ || (echo "❌ Ruff formatting failed" && exit 1)
else
    echo "⚠️  Backend src/ or tests/ directory not found, skipping backend checks"
fi

echo "🔍 Running type checker on backend..."
if [ -d "backend/src" ]; then
    mypy backend/src/ || (echo "❌ MyPy type checking failed" && exit 1)
else
    echo "⚠️  Backend src/ directory not found, skipping type checks"
fi

echo "🧪 Running tests and coverage for backend..."
# Ensure PYTHONPATH includes backend/src for imports from project root
export PYTHONPATH="${PYTHONPATH}:$(pwd)/backend/src"
echo "   (PYTHONPATH is now: $PYTHONPATH)"

if [ -d "backend/tests" ] && [ -f "backend/requirements.txt" ]; then # Adjusted path for requirements check
    python -m pytest backend/tests/ --cov=backend/src --cov-fail-under=80 --cov-report=xml:reports/coverage.xml || (echo "❌ Tests failed" && exit 1)
else
    echo "⚠️  Backend tests/ or backend/requirements.txt not found, skipping tests"
fi

# cd .. # No longer needed as we are not changing directory

echo "🏗️  Validating architectural boundaries..."
if find backend/src/features/ -name "*provider*" -type f 2>/dev/null | grep -q .; then
    echo "❌ ARCHITECTURE VIOLATION: Provider-specific logic found in core feature directory."
    exit 1
fi

echo "✅ All quality gates passed."
