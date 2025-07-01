#!/bin/bash
# Docker Environment Recovery Script
# Following TDD approach - test, fix, verify

set -euo pipefail

echo "🔧 Stabilizing Docker environment..."

# Test 1: Check Docker daemon status
echo "Testing Docker daemon..."
if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker daemon not running"
    echo "🔄 Restarting Docker Desktop..."
    sudo pkill -f docker || true
    sleep 5
    open /Applications/Docker.app
    echo "⏳ Waiting for Docker to start..."
    while ! docker info >/dev/null 2>&1; do
        sleep 2
        echo -n "."
    done
    echo "✅ Docker daemon running"
else
    echo "✅ Docker daemon already running"
fi

# Test 2: Verify CLI plugins
echo "Testing CLI plugins..."
COMPOSE_PLUGIN="/Applications/Docker.app/Contents/Resources/cli-plugins/docker-compose"
if [ -f "$COMPOSE_PLUGIN" ]; then
    echo "✅ docker-compose plugin exists"
    # Fix permissions if needed
    if [ ! -x "$COMPOSE_PLUGIN" ]; then
        echo "🔧 Fixing plugin permissions..."
        chmod +x "$COMPOSE_PLUGIN"
    fi
else
    echo "❌ docker-compose plugin missing"
    echo "Installing via Homebrew as fallback..."
    if command -v brew >/dev/null 2>&1; then
        brew install docker-compose
    else
        echo "⚠️  Homebrew not available, using pip fallback..."
        pip install docker-compose
    fi
fi

# Test 3: Verify docker-compose works
echo "Testing docker-compose functionality..."
if docker-compose --version >/dev/null 2>&1; then
    echo "✅ docker-compose working"
elif docker compose version >/dev/null 2>&1; then
    echo "✅ docker compose (v2) working"
else
    echo "❌ docker-compose not working, using Homebrew version"
    if command -v brew >/dev/null 2>&1; then
        export PATH="/opt/homebrew/bin:$PATH"
    fi
fi

# Test 4: Clean up any corrupted Docker state
echo "🧹 Cleaning Docker state..."
docker system prune -f >/dev/null 2>&1 || true

echo "🎉 Docker environment stabilized"
