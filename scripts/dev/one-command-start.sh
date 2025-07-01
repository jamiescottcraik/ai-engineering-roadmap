#!/bin/bash
# One-command development environment setup for monorepo
# Governed by /.ai/RULES_OF_AI.md

set -e

echo "🚀 Starting brAInwav AI Platform development environment..."

# Check prerequisites
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is required but not installed."
    echo "📦 Install with: npm install -g pnpm"
    exit 1
fi

if ! command -v uv &> /dev/null; then
    echo "❌ uv is required but not installed."
    echo "📦 Install with: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Install dependencies
echo "📦 Installing Node.js dependencies..."
pnpm install

echo "📦 Installing Python dependencies..."
cd apps/api && uv sync && cd ../..

# Build shared packages
echo "🔨 Building shared packages..."
# This command assumes a 'build' script exists in the root package.json
# that orchestrates the building of all necessary shared workspace packages.
pnpm run build

echo "✅ Setup complete!"
echo ""
echo "🚀 To start development:"
echo "   pnpm dev          # Start all services"
echo "   pnpm dev:api      # Start backend only (:8000)"
# Note: The frontend application is configured to run on port 3000 by default.
echo "   pnpm dev:web      # Start frontend only (:3000)"
echo ""
echo "📖 Documentation:"
echo "   Backend API: http://localhost:8000/docs"
echo "   Frontend:    http://localhost:3000"
