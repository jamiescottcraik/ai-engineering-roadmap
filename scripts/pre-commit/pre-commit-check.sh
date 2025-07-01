#!/bin/bash
# Pre-commit quality checks for the AI Engineering Roadmap
set -e

echo "🔍 Running pre-commit quality checks..."

# Check if we're in the right directory
if [ ! -f "roadmaps/roadmap.json" ]; then
    echo "❌ Must run from repository root"
    exit 1
fi

# Python linting
echo "🐍 Checking Python code..."
if command -v ruff >/dev/null 2>&1; then
    ruff check scripts/ backend/src/ || exit 1
    echo "✅ Ruff checks passed"
else
    echo "⚠️ Ruff not installed, skipping Python linting"
fi

if command -v black >/dev/null 2>&1; then
    black --check scripts/ backend/src/ || exit 1
    echo "✅ Black formatting checks passed"
else
    echo "⚠️ Black not installed, skipping formatting check"
fi

# Markdown linting
echo "📝 Checking Markdown files..."
if command -v markdownlint >/dev/null 2>&1; then
    markdownlint "**/*.md" --ignore node_modules || exit 1
    echo "✅ Markdown lint checks passed"
else
    echo "⚠️ markdownlint not installed, skipping markdown checks"
fi

# Roadmap validation
echo "🗺️ Validating roadmap data..."
if command -v python3 >/dev/null 2>&1; then
    python3 scripts/validate_roadmap.py || exit 1
    echo "✅ Roadmap validation passed"
else
    echo "❌ Python3 not found, cannot validate roadmap"
    exit 1
fi

# Generate updated visuals
echo "🎨 Updating visual roadmaps..."
if command -v mmdc >/dev/null 2>&1; then
    python3 scripts/generate_roadmap_visual.py || exit 1
    echo "✅ Visual roadmaps updated"
else
    echo "⚠️ mmdc not installed, skipping visual generation"
fi

echo "🎉 All pre-commit checks passed!"
