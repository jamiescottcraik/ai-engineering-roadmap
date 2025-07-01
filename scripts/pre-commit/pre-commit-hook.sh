#!/bin/bash
# Pre-commit hook for validating roadmap changes
set -e

echo "🔍 Running pre-commit validation..."

# Check if we're in the right directory
if [ ! -f "roadmaps/roadmap.json" ]; then
    echo "❌ Not in the root directory of the ai-engineering-roadmap project"
    exit 1
fi

# Install Python dependencies if needed
if ! python -c "import requests" 2>/dev/null; then
    echo "📦 Installing required Python dependencies..."
    pip install requests
fi

echo "📊 Validating roadmap structure and URLs..."
if ! python scripts/validate_roadmap.py; then
    echo "❌ Roadmap validation failed. Please fix the issues above."
    exit 1
fi

echo "🎨 Generating visual roadmap..."
if ! python scripts/generate_roadmap_visual.py; then
    echo "❌ Visual roadmap generation failed."
    exit 1
fi

# Check if there are changes to visual files that need to be staged
if git diff --name-only | grep -q "docs/roadmap\.\(mmd\|svg\)"; then
    echo "📋 Visual roadmap files have been updated. Staging changes..."
    git add docs/roadmap.mmd docs/roadmap.svg
fi

echo "✅ Pre-commit validation passed!"
