#!/bin/bash
set -euo pipefail

echo "🔐 Installing 1Password CLI in devcontainer..."

# Detect architecture and user
ARCH=$(dpkg --print-architecture)
OP_VERSION="2.30.0"
CONTAINER_USER=$(whoami)
USER_HOME=$(eval echo ~$CONTAINER_USER)

# Download appropriate version
if [ "$ARCH" = "amd64" ]; then
    curl -sSfLo op.zip "https://cache.agilebits.com/dist/1P/op2/pkg/v${OP_VERSION}/op_linux_amd64_v${OP_VERSION}.zip"
elif [ "$ARCH" = "arm64" ]; then
    curl -sSfLo op.zip "https://cache.agilebits.com/dist/1P/op2/pkg/v${OP_VERSION}/op_linux_arm64_v${OP_VERSION}.zip"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

# Install 1Password CLI
sudo unzip -o op.zip -d /usr/local/bin/
rm op.zip
sudo chmod +x /usr/local/bin/op

# Verify installation
op --version

# Create bash configuration directory
mkdir -p "$USER_HOME/.bashrc.d"

# Create 1Password environment configuration
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
        echo "Creating template..."
        cat > .env.1password << 'TEMPLATE'
# 1Password Secret References
# Use: op inject -i .env.1password -o .env

# API Keys
OPENAI_API_KEY="op://Personal/OpenAI/api_key"
ANTHROPIC_API_KEY="op://Personal/Anthropic/api_key"
GITHUB_TOKEN="op://Personal/GitHub/personal_access_token"

# Database
DATABASE_URL="op://Personal/Database/connection_string"
REDIS_URL="op://Personal/Redis/connection_string"

# Authentication
JWT_SECRET_KEY="op://Personal/App Secrets/jwt_secret"
SECRET_KEY="op://Personal/App Secrets/secret_key"

# External Services
SENTRY_DSN="op://Personal/Sentry/dsn"

# Development
DEBUG=true
ENVIRONMENT=development
TEMPLATE
        echo "✓ Created .env.1password template"
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
        echo "Test with: ssh -T git@github.com"
    } || {
        echo "❌ Could not load GitHub SSH keys from 1Password"
        echo "Make sure you have stored them as:"
        echo "  - 'GitHub SSH Private Key' in your Personal vault"
        echo "  - 'GitHub SSH Public Key' in your Personal vault"
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

    # Check for secrets in code
    if command -v detect-secrets &>/dev/null; then
        detect-secrets scan --baseline .secrets.baseline
    fi

    # Check 1Password template
    if [ -f ".env.1password" ]; then
        echo "✓ 1Password template found"
        # Verify no actual secrets in template
        if grep -E "(sk-|key-|token-|secret-)" .env.1password | grep -v "op://"; then
            echo "⚠️  WARNING: Possible secrets found in .env.1password!"
        fi
    fi
}

# Auto-check on startup
if [ -f ".env.1password" ] && [ ! -f ".env" ]; then
    echo "💡 1Password template found but no .env file"
    echo "   Run 'openv' to create .env from 1Password"
fi

# Show 1Password status
if op account list &>/dev/null 2>&1; then
    echo "✅ 1Password CLI is signed in"
else
    echo "🔐 1Password CLI ready. Sign in with: ops"
fi

# Export functions
export -f op_load_secret
export -f op_create_env
export -f ssh_github_load
export -f security_check
BASHENV

# Make the script executable
chmod +x "$USER_HOME/.bashrc.d/50-1password-env.sh"

# Source it in bashrc if not already
if ! grep -q "50-1password-env.sh" "$USER_HOME/.bashrc" 2>/dev/null; then
    echo "source $USER_HOME/.bashrc.d/50-1password-env.sh" >> "$USER_HOME/.bashrc"
fi

# Create sample .env.1password if it doesn't exist
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
    echo "✓ Created .env.1password template"
fi

echo "✅ 1Password CLI installation complete!"
echo ""
echo "🚀 Quick Start Commands:"
echo "  ops              - Sign in to 1Password"
echo "  openv            - Create .env from 1Password template"
echo "  ssh_github_load  - Load GitHub SSH keys"
echo "  security_check   - Run security audit"
echo ""
echo "📋 Next steps:"
echo "  1. Run 'ops' to sign in to 1Password"
echo "  2. Run 'openv' to create your .env file"
echo "  3. Start developing with secure secrets!"
