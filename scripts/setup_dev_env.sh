#!/bin/bash
# Development Environment Setup Script
# Following TDD workflow with comprehensive testing

set -euo pipefail

echo "🚀 Setting up development environment..."

# Get the repository root directory
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"
echo "ℹ️  Working from: $REPO_ROOT"

# Run core environment setup
echo ""
echo "🔧 Running core environment setup..."
bash scripts/setup/core_env.sh

# Setup secrets (optional 1Password integration)
echo ""
echo "🔑 Setting up secrets management..."
bash scripts/setup/secrets.sh

# Run initial tests to verify setup (if tests exist)
echo ""
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

echo ""
echo "🎉 Development environment ready!"
echo "💡 Available commands:"
echo "  - Run tests: pytest tests/"
echo "  - Quality check: bash scripts/validate_pr.sh"
echo "  - Start backend: uvicorn backend.src.main:app --reload"
echo ""
echo "🔧 Component setup scripts:"
echo "  - Core environment: bash scripts/setup/core_env.sh"
echo "  - 1Password CLI: bash scripts/setup/onepassword.sh"
echo "  - Secrets management: bash scripts/setup/secrets.sh"
echo ""
if command -v op &> /dev/null; then
    echo "🔐 1Password CLI available:"
    echo "  - Fetch secrets: python scripts/fetch_secrets.py"
    echo "  - Sign in to 1Password: op signin"
else
    echo "ℹ️  1Password CLI not available:"
    echo "  - Install 1Password CLI: bash scripts/setup/onepassword.sh"
    echo "  - Manually edit backend/.env with your secrets"
    echo "  - For 1Password setup: https://developer.1password.com/docs/cli/get-started/"
fi
