#!/bin/bash
# Development startup script for brAInwav AI Platform
set -e

echo "🚀 Starting brAInwav AI Platform Development Environment"
echo "======================================================="

# Check prerequisites
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is required. Install with: npm install -g pnpm"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required"
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    pnpm install
fi

# Install Python dependencies for API
echo "🐍 Installing Python dependencies..."
cd apps/api
if ! python3 -c "import fastapi" 2>/dev/null; then
    pip install -r requirements.txt -r dev-requirements.txt
fi
cd ../..

echo "🧪 Running tests to verify setup..."
pnpm run test

echo "🏗️ Building packages..."
pnpm run build

echo "✅ Setup complete! Starting development servers..."
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 API: http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all services"

# Start development servers
pnpm run dev