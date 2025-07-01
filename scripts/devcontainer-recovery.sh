#!/bin/bash
# Devcontainer Recovery Script
# Emergency recovery for failed devcontainer builds

set -euo pipefail

echo "🆘 Emergency devcontainer recovery..."

# Parse arguments
RESET_DOCKER=false
VERBOSE=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --reset-docker)
            RESET_DOCKER=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        *)
            echo "Unknown option $1"
            echo "Usage: $0 [--reset-docker] [--verbose]"
            exit 1
            ;;
    esac
done

# Step 1: Clean Docker state
echo "🧹 Cleaning Docker state..."
docker system prune -af --volumes || true
docker builder prune -af || true

# Step 2: Reset Docker Desktop (if requested)
if [[ "$RESET_DOCKER" == "true" ]]; then
    echo "🔄 Resetting Docker Desktop..."
    sudo pkill -f docker || true
    rm -rf ~/.docker/config.json || true
    echo "Please restart Docker Desktop manually and run this script again without --reset-docker"
    exit 0
fi

# Step 3: Rebuild with appropriate logging
echo "🔨 Rebuilding devcontainer..."
if [[ "$VERBOSE" == "true" ]]; then
    echo "Building with verbose logging..."
    docker build \
        --no-cache \
        --progress=plain \
        --file backend/Dockerfile \
        --tag brainwav-dev:latest \
        . 2>&1 | tee build.log
    echo "📋 Build log saved to build.log"
else
    echo "Building with standard logging..."
    docker build \
        --no-cache \
        --file backend/Dockerfile \
        --tag brainwav-dev:latest \
        .
fi

echo "🎯 Recovery complete!"
echo "💡 If issues persist:"
echo "  - Check build.log for specific errors (if verbose mode was used)"
echo "  - Try: $0 --reset-docker --verbose"
echo "  - Ensure sufficient disk space and memory"
