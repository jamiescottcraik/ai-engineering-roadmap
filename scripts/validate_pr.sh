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
cd backend
if [ -d "src" ] && [ -d "tests" ]; then
    black --check src/ tests/ || (echo "❌ Black formatting failed" && exit 1)
    ruff check src/ tests/ || (echo "❌ Ruff linting failed" && exit 1)
    ruff format --check src/ tests/ || (echo "❌ Ruff formatting failed" && exit 1)
else
    echo "⚠️  Backend src/ or tests/ directory not found, skipping backend checks"
fi

echo "🔍 Running type checker on backend..."
if [ -d "src" ]; then
    mypy src/ || (echo "❌ MyPy type checking failed" && exit 1)
else
    echo "⚠️  Backend src/ directory not found, skipping type checks"
fi

echo "🧪 Running tests and coverage for backend..."
if [ -d "tests" ] && [ -f "requirements.txt" ]; then
    python -m pytest tests/ --cov=src --cov-fail-under=80 --cov-report=xml:../reports/coverage.xml || (echo "❌ Tests failed" && exit 1)
else
    echo "⚠️  Backend tests/ or requirements.txt not found, skipping tests"
fi

cd ..

echo "🏗️  Validating architectural boundaries..."
if find backend/src/features/ -name "*provider*" -type f 2>/dev/null | grep -q .; then
    echo "❌ ARCHITECTURE VIOLATION: Provider-specific logic found in core feature directory."
    exit 1
fi

echo "✅ All quality gates passed."
