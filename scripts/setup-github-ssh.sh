#!/bin/bash

# Setup GitHub SSH with 1Password
echo "🔐 Setting up GitHub SSH with 1Password..."

# Function to load SSH key from 1Password
load_github_ssh() {
    local ssh_dir="$HOME/.ssh"
    local key_name="${1:-github_ed25519}"

    # Ensure SSH directory exists
    mkdir -p "$ssh_dir"
    chmod 700 "$ssh_dir"

    # Check if already signed in
    if ! op account list &>/dev/null; then
        echo "📝 Signing into 1Password..."
        eval $(op signin)
    fi

    # Load private key from 1Password
    echo "📥 Loading SSH private key from 1Password..."
    op document get "GitHub SSH Private Key" --vault="Personal" > "$ssh_dir/$key_name" 2>/dev/null || {
        echo "❌ Could not load GitHub SSH private key from 1Password"
        echo "Make sure you have an item named 'GitHub SSH Private Key' in your Personal vault"
        return 1
    }
    chmod 600 "$ssh_dir/$key_name"

    # Load public key from 1Password
    echo "📥 Loading SSH public key from 1Password..."
    op document get "GitHub SSH Public Key" --vault="Personal" > "$ssh_dir/${key_name}.pub" 2>/dev/null || {
        echo "❌ Could not load GitHub SSH public key from 1Password"
        return 1
    }
    chmod 644 "$ssh_dir/${key_name}.pub"

    echo "✅ GitHub SSH keys loaded from 1Password"

    # Add to SSH agent
    ssh-add "$ssh_dir/$key_name" 2>/dev/null || {
        # Start ssh-agent if needed
        eval $(ssh-agent -s)
        ssh-add "$ssh_dir/$key_name"
    }

    echo "✅ SSH key added to agent"
}

# Function to create new GitHub SSH key and store in 1Password
create_github_ssh() {
    local key_name="${1:-github_ed25519}"
    local email="${2:-jamiescottcraik@users.noreply.github.com}"

    echo "🔑 Creating new GitHub SSH key..."

    # Generate new SSH key
    ssh-keygen -t ed25519 -C "$email" -f "$HOME/.ssh/$key_name" -N ""

    # Store in 1Password
    echo "📤 Storing SSH keys in 1Password..."

    # Create private key document
    op document create "$HOME/.ssh/$key_name" \
        --title="GitHub SSH Private Key" \
        --vault="Personal" \
        --tags="ssh,github,development"

    # Create public key document
    op document create "$HOME/.ssh/${key_name}.pub" \
        --title="GitHub SSH Public Key" \
        --vault="Personal" \
        --tags="ssh,github,development"

    echo "✅ SSH keys stored in 1Password"
    echo ""
    echo "📋 Next steps:"
    echo "1. Add this public key to GitHub:"
    echo ""
    cat "$HOME/.ssh/${key_name}.pub"
    echo ""
    echo "2. Go to: https://github.com/settings/ssh/new"
}

# SSH config for GitHub
setup_ssh_config() {
    local ssh_config="$HOME/.ssh/config"

    # Check if GitHub host already configured
    if ! grep -q "Host github.com" "$ssh_config" 2>/dev/null; then
        echo "📝 Configuring SSH for GitHub..."
        cat >> "$ssh_config" << 'SSHCONFIG'

# GitHub
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_ed25519
    AddKeysToAgent yes
    UseKeychain yes
SSHCONFIG
        chmod 600 "$ssh_config"
        echo "✅ SSH config updated"
    fi
}

# Main execution
case "${1:-load}" in
    "create")
        create_github_ssh
        ;;
    "load")
        load_github_ssh
        setup_ssh_config
        ;;
    *)
        echo "Usage: $0 [create|load]"
        echo "  create - Generate new SSH key and store in 1Password"
        echo "  load   - Load existing SSH key from 1Password"
        ;;
esac
