#!/bin/bash
# Core Development Environment Setup
# Sets up Python, dependencies, and basic development tools

set -euo pipefail

echo "📦 Setting up core Python development environment..."

# Get the repository root directory
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

# Install and configure uv (Python package manager)
echo "📦 Setting up Python package manager..."
if ! command -v uv &> /dev/null; then
    echo "ℹ️  UV not found, attempting installation..."
    if curl -LsSf https://astral.sh/uv/install.sh | sh 2>/dev/null; then
        export PATH="/root/.local/bin:$PATH"
        echo "✅ UV installed successfully"
    else
        echo "⚠️  Could not install UV automatically (network restricted or missing curl)"
        echo "ℹ️  For manual installation, see: https://docs.astral.sh/uv/getting-started/installation/"
        echo "ℹ️  Continuing with pip for Python dependencies..."
    fi
else
    echo "✅ UV already available"
fi

# Install dependencies
echo "📚 Installing Python dependencies..."
cd backend
if [ -f "requirements.txt" ] && [ -f "dev-requirements.txt" ]; then
    if command -v uv &> /dev/null; then
        echo "ℹ️  Using UV to install dependencies..."
        uv pip install --system --no-cache-dir -r requirements.txt -r dev-requirements.txt 2>/dev/null || \
        (echo "⚠️  UV failed, falling back to pip..." && pip install --no-cache-dir -r requirements.txt -r dev-requirements.txt 2>/dev/null) || \
        echo "⚠️  Could not install Python dependencies (network restricted)"
    else
        echo "ℹ️  Using pip to install dependencies..."
        pip install --no-cache-dir -r requirements.txt -r dev-requirements.txt 2>/dev/null || \
        echo "⚠️  Could not install Python dependencies (network restricted)"
    fi
else
    echo "⚠️  Requirements files not found, skipping Python dependencies"
fi
cd "$REPO_ROOT"

# Setup pre-commit hooks (if in git repo)
echo "🔧 Setting up pre-commit hooks..."
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

echo "✅ Core development environment setup complete!"