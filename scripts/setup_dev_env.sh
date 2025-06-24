#!/bin/bash
# Development Environment Setup Script
# Following TDD workflow with comprehensive testing

set -euo pipefail

echo "🚀 Setting up development environment..."

# Test environment
cd /workspace

# Install and configure uv (Python package manager)
echo "📦 Setting up Python environment..."
if ! command -v uv &> /dev/null; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="/root/.local/bin:$PATH"
fi

# Install dependencies
echo "📚 Installing Python dependencies..."
cd backend
if [ -f "requirements.txt" ] && [ -f "dev-requirements.txt" ]; then
    uv pip install --system --no-cache-dir -r requirements.txt -r dev-requirements.txt
else
    echo "⚠️  Requirements files not found, skipping Python dependencies"
fi

# Setup pre-commit hooks (if in git repo)
echo "🔧 Setting up pre-commit hooks..."
cd /workspace
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    if command -v pre-commit &> /dev/null; then
        pre-commit install
        echo "✅ Pre-commit hooks installed"
    else
        echo "⚠️  pre-commit not available, skipping hook installation"
    fi
else
    echo "ℹ️  Not a git repository, skipping pre-commit setup"
fi

# Run initial tests to verify setup (if tests exist)
echo "🧪 Running initial validation..."
if [ -d "tests" ] && command -v pytest &> /dev/null; then
    pytest tests/ -v --tb=short || echo "⚠️  Some tests failed, but continuing setup"
else
    echo "ℹ️  No tests found or pytest not available, skipping test validation"
fi

# Validate quality gates (if script exists)
if [ -f "scripts/validate_pr.sh" ]; then
    echo "✅ Running quality validation..."
    bash scripts/validate_pr.sh || echo "⚠️  Quality validation had issues, but continuing"
else
    echo "ℹ️  Quality validation script not found, skipping"
fi

echo "🎉 Development environment ready!"
echo "💡 Available commands:"
echo "  - Run tests: pytest tests/"
echo "  - Quality check: bash scripts/validate_pr.sh"
echo "  - Start backend: uvicorn backend.src.main:app --reload"
