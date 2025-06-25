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

# Install 1Password CLI
echo "🔐 Setting up 1Password CLI..."
if ! command -v op &> /dev/null; then
    ARCH=$(dpkg --print-architecture)
    OP_VERSION="2.30.0"

    if [ "$ARCH" = "amd64" ]; then
        curl -sSfLo op.zip "https://cache.agilebits.com/dist/1P/op2/pkg/v${OP_VERSION}/op_linux_amd64_v${OP_VERSION}.zip"
    elif [ "$ARCH" = "arm64" ]; then
        curl -sSfLo op.zip "https://cache.agilebits.com/dist/1P/op2/pkg/v${OP_VERSION}/op_linux_arm64_v${OP_VERSION}.zip"
    else
        echo "Unsupported architecture: $ARCH"
        exit 1
    fi

    sudo unzip -o op.zip -d /usr/local/bin/
    rm op.zip
    sudo chmod +x /usr/local/bin/op
    echo "✅ 1Password CLI installed: $(op --version)"
else
    echo "✅ 1Password CLI already installed: $(op --version)"
fi

# Setup 1Password environment helpers
echo "🔐 Configuring 1Password environment..."
CONTAINER_USER=$(whoami)
USER_HOME=$(eval echo ~$CONTAINER_USER)
mkdir -p "$USER_HOME/.bashrc.d"

cat > "$USER_HOME/.bashrc.d/50-1password-env.sh" << 'BASHENV'
#!/bin/bash
# brAInwav 1Password Environment Configuration

# 1Password CLI aliases
alias ops="eval \$(op signin)"
alias openv="op inject -i .env.1password -o .env && echo '✓ Loaded secrets from 1Password'"
alias opcheck="op account list"
alias opvault="op vault list"

# Function to load secrets from 1Password
op_load_secret() {
    local secret_ref="$1"
    if op account list &>/dev/null; then
        op read "$secret_ref"
    else
        echo "⚠️  1Password CLI not signed in. Run: ops"
        return 1
    fi
}

# Function to create .env from 1Password template
op_create_env() {
    if [ ! -f ".env.1password" ]; then
        echo "⚠️  No .env.1password template found"
        return 1
    fi

    if ! op account list &>/dev/null; then
        echo "🔐 Please sign in to 1Password first..."
        eval $(op signin)
    fi

    echo "🔐 Creating .env from 1Password secrets..."
    op inject -i .env.1password -o .env && {
        echo "✓ .env created with secrets from 1Password"
        # Ensure .env is in gitignore
        if ! grep -q "^\.env$" .gitignore 2>/dev/null; then
            echo ".env" >> .gitignore
            echo "✓ Added .env to .gitignore"
        fi
    }
}

# GitHub SSH key management
ssh_github_load() {
    if ! op account list &>/dev/null; then
        echo "⚠️  Sign in to 1Password first: ops"
        return 1
    fi

    echo "🔐 Loading GitHub SSH keys from 1Password..."
    mkdir -p ~/.ssh
    chmod 700 ~/.ssh

    # Load private key
    op document get "GitHub SSH Private Key" --vault="Personal" > ~/.ssh/github_ed25519 2>/dev/null && {
        chmod 600 ~/.ssh/github_ed25519

        # Load public key
        op document get "GitHub SSH Public Key" --vault="Personal" > ~/.ssh/github_ed25519.pub 2>/dev/null
        chmod 644 ~/.ssh/github_ed25519.pub

        # Configure SSH
        if ! grep -q "Host github.com" ~/.ssh/config 2>/dev/null; then
            cat >> ~/.ssh/config << 'SSHCONFIG'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_ed25519
    AddKeysToAgent yes
    StrictHostKeyChecking accept-new
SSHCONFIG
            chmod 600 ~/.ssh/config
        fi

        # Add to SSH agent
        eval $(ssh-agent -s) >/dev/null 2>&1
        ssh-add ~/.ssh/github_ed25519 2>/dev/null

        echo "✓ GitHub SSH keys loaded and added to agent"
    } || {
        echo "❌ Could not load GitHub SSH keys from 1Password"
    }
}

# Quick security check
security_check() {
    echo "🔍 Running security check..."

    # Check for .env in git
    if git ls-files .env --error-unmatch &>/dev/null; then
        echo "❌ CRITICAL: .env is tracked by git!"
        echo "Run: git rm --cached .env"
    else
        echo "✓ .env is not tracked by git"
    fi

    # Check 1Password template
    if [ -f ".env.1password" ]; then
        echo "✓ 1Password template found"
    fi
}

# Export functions
export -f op_load_secret
export -f op_create_env
export -f ssh_github_load
export -f security_check
BASHENV

chmod +x "$USER_HOME/.bashrc.d/50-1password-env.sh"

# Source it in bashrc if not already
if ! grep -q "50-1password-env.sh" "$USER_HOME/.bashrc" 2>/dev/null; then
    echo "source $USER_HOME/.bashrc.d/50-1password-env.sh" >> "$USER_HOME/.bashrc"
fi

# Create .env.1password template if it doesn't exist
if [ ! -f "/workspace/.env.1password" ]; then
    cat > /workspace/.env.1password << 'ENVTEMPLATE'
# 1Password Secret References for brAInwav
# Use: op inject -i .env.1password -o .env

# Core API Keys
OPENAI_API_KEY="op://Personal/OpenAI/api_key"
ANTHROPIC_API_KEY="op://Personal/Anthropic/api_key"
GITHUB_TOKEN="op://Personal/GitHub/personal_access_token"

# Database Configuration
DATABASE_URL="op://Personal/Database/postgresql_url"
REDIS_URL="op://Personal/Redis/connection_string"
POSTGRES_USER="op://Personal/Database/username"
POSTGRES_PASSWORD="op://Personal/Database/password"
POSTGRES_DB="op://Personal/Database/database_name"

# Authentication & Security
JWT_SECRET_KEY="op://Personal/App Secrets/jwt_secret"
SECRET_KEY="op://Personal/App Secrets/django_secret_key"
SESSION_SECRET="op://Personal/App Secrets/session_secret"

# Third-Party Services
STRIPE_API_KEY="op://Personal/Stripe/api_key"
STRIPE_WEBHOOK_SECRET="op://Personal/Stripe/webhook_secret"
SENDGRID_API_KEY="op://Personal/SendGrid/api_key"
SENTRY_DSN="op://Personal/Sentry/dsn"

# AWS Services
AWS_ACCESS_KEY_ID="op://Personal/AWS/access_key_id"
AWS_SECRET_ACCESS_KEY="op://Personal/AWS/secret_access_key"
AWS_REGION="us-east-1"

# Ollama Configuration (if using local AI)
OLLAMA_API_BASE="http://localhost:11434"
OLLAMA_MODEL="llama3.2"

# Development Settings
DEBUG=true
ENVIRONMENT=development
LOG_LEVEL=DEBUG
ENVTEMPLATE
    echo "✅ Created .env.1password template"
fi

# Update .gitignore to ensure .env is never committed
if [ -f "/workspace/.gitignore" ]; then
    if ! grep -q "^\.env$" /workspace/.gitignore; then
        echo -e "\n# Environment files\n.env\n.env.*\n!.env.1password\n!.env.example" >> /workspace/.gitignore
        echo "✅ Updated .gitignore to exclude .env files"
    fi
fi

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
echo ""
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
