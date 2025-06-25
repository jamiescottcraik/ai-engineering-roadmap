#!/bin/bash
# 1Password CLI Setup Script
# Optional setup for 1Password CLI integration

set -euo pipefail

# Define helper functions first
function show_manual_instructions_linux() {
    echo ""
    echo "📋 Manual installation for Linux:"
    echo "  1. Download from: https://downloads.1password.com/linux/debian/amd64/stable/1password-cli-amd64-latest.deb"
    echo "  2. Install with: sudo dpkg -i 1password-cli-amd64-latest.deb"
    echo "  3. Or use your package manager's instructions from:"
    echo "     https://developer.1password.com/docs/cli/get-started/"
}

function show_manual_instructions_macos() {
    echo ""
    echo "📋 Manual installation for macOS:"
    echo "  1. Install Homebrew if not available: https://brew.sh"
    echo "  2. Run: brew install --cask 1password-cli"
    echo "  3. Or download directly from:"
    echo "     https://developer.1password.com/docs/cli/get-started/"
}

function show_manual_instructions_generic() {
    echo ""
    echo "📋 Manual installation instructions:"
    echo "  Visit: https://developer.1password.com/docs/cli/get-started/"
    echo "  Follow the instructions for your operating system"
}

echo "🔐 Setting up 1Password CLI for secrets management..."

# Check if already installed
if command -v op &> /dev/null; then
    echo "✅ 1Password CLI already installed"
    echo "ℹ️  Version: $(op --version)"
    
    # Test if user is signed in
    if op account list &> /dev/null; then
        echo "✅ 1Password CLI is configured and you are signed in"
        echo "💡 You can now run: python scripts/fetch_secrets.py"
    else
        echo "ℹ️  1Password CLI installed but not signed in"
        echo "💡 Run: op signin"
    fi
    exit 0
fi

echo "ℹ️  1Password CLI not found, attempting installation..."

# Try to install 1Password CLI based on OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🐧 Detected Linux, attempting installation..."
    
    # Check if we can download and install
    if curl -sSfL https://downloads.1password.com/linux/debian/amd64/stable/1password-cli-amd64-latest.deb -o /tmp/1password-cli.deb 2>/dev/null; then
        echo "📥 Downloaded 1Password CLI package"
        
        if sudo dpkg -i /tmp/1password-cli.deb 2>/dev/null || (sudo apt-get update && sudo apt-get install -f -y 2>/dev/null); then
            rm -f /tmp/1password-cli.deb
            echo "✅ 1Password CLI installed successfully"
        else
            rm -f /tmp/1password-cli.deb
            echo "❌ Could not install 1Password CLI automatically"
            show_manual_instructions_linux
        fi
    else
        echo "❌ Could not download 1Password CLI"
        show_manual_instructions_linux
    fi
    
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🍎 Detected macOS, attempting installation..."
    
    if command -v brew &> /dev/null; then
        echo "🍺 Using Homebrew to install 1Password CLI..."
        if brew install --cask 1password-cli 2>/dev/null; then
            echo "✅ 1Password CLI installed successfully via Homebrew"
        else
            echo "❌ Could not install 1Password CLI via Homebrew"
            show_manual_instructions_macos
        fi
    else
        echo "❌ Homebrew not available"
        show_manual_instructions_macos
    fi
    
else
    echo "❌ Unsupported OS for automatic installation: $OSTYPE"
    show_manual_instructions_generic
fi

# Final check and setup instructions
if command -v op &> /dev/null; then
    echo ""
    echo "🎉 1Password CLI installation complete!"
    echo ""
    echo "📋 Next steps:"
    echo "  1. Sign in to your 1Password account:"
    echo "     op signin"
    echo "  2. Test the setup:"
    echo "     op account list"
    echo "  3. Fetch project secrets:"
    echo "     python scripts/fetch_secrets.py"
    echo ""
else
    echo ""
    echo "❌ 1Password CLI installation failed"
    echo "ℹ️  The development environment will work without it"
    echo "ℹ️  Secrets will need to be managed manually via .env files"
    echo ""
fi