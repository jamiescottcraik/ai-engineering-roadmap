#!/bin/bash
# Secrets Setup Script
# Handles secrets management with fallback to manual setup

set -euo pipefail

echo "🔑 Setting up secrets management..."

# Get the repository root directory
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT"

# Check if .env file already exists
if [ -f "backend/.env" ]; then
    echo "ℹ️  Found existing backend/.env file"
    echo "💡 Use 'python scripts/fetch_secrets.py' to update with 1Password secrets"
    echo "💡 Or manually edit backend/.env with your secret values"
    exit 0
fi

# Try to fetch secrets with 1Password CLI
echo "ℹ️  Attempting to fetch secrets from 1Password..."
if python scripts/fetch_secrets.py 2>/dev/null; then
    echo "✅ Secrets setup complete!"
else
    echo "⚠️  Could not fetch secrets automatically"
    
    # Check if we have an example file to copy
    if [ -f "backend/.env.example" ]; then
        echo "ℹ️  Copying .env.example to .env..."
        cp "backend/.env.example" "backend/.env"
        echo "✅ Created backend/.env from example file"
    else
        echo "ℹ️  Creating template .env file..."
        # The fetch_secrets.py script will have created a template
        if [ -f "backend/.env" ]; then
            echo "✅ Template .env file created"
        else
            echo "❌ Could not create .env file"
            exit 1
        fi
    fi
    
    echo ""
    echo "📋 Manual setup required:"
    echo "  1. Edit backend/.env and replace placeholder values"
    echo "  2. Required environment variables:"
    echo "     - POSTGRES_USER"
    echo "     - POSTGRES_PASSWORD" 
    echo "     - OPENAI_API_KEY"
    echo ""
    echo "💡 To use 1Password CLI:"
    echo "  1. Install 1Password CLI: bash scripts/setup/onepassword.sh"
    echo "  2. Sign in: op signin"
    echo "  3. Fetch secrets: python scripts/fetch_secrets.py"
fi