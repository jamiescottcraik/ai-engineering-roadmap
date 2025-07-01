#!/bin/bash
set -euo pipefail

#==============================================================================#
#       Universal, Cross-Platform 1Password CLI Setup Script (v3)            #
#                                                                              #
#   - Uses the robust APT package manager method on Debian/Ubuntu systems.     #
#   - Falls back to direct binary download on other Linux distributions.       #
#   - Provides a unified setup for local, container, and CI environments.      #
#==============================================================================#

# --- Configuration ---
# The script will check for this vault. Override with an environment variable.
: "${OP_VAULT_NAME:="Development"}"

# --- Helper Functions ---
log() {
    echo "🔑 [1Password Setup] $1"
}
err() {
    echo "❌ [1Password Setup] ERROR: $1" >&2
    exit 1
}

# --- Main Logic ---

# Function to detect the operating system
detect_os() {
    case "$OSTYPE" in
      darwin*)  echo "macos" ;;
      linux-gnu*) echo "linux" ;;
      msys*|cygwin*) echo "windows" ;;
      *)        echo "unknown" ;;
    esac
}

# Function to install the 1Password CLI if not present
install_op_cli() {
    if command -v op &> /dev/null; then
        log "1Password CLI is already installed at: $(command -v op)"
        log "Version: $(op --version)"
        return
    fi

    log "1Password CLI not found. Starting installation..."
    local os
    os=$(detect_os)

    case "$os" in
        macos)
            if ! command -v brew &> /dev/null; then
                err "Homebrew not found. Please install it from https://brew.sh to continue."
            fi
            log "Installing with Homebrew..."
            brew install 1password-cli
            ;;
        linux)
            # Use APT if available (for Debian/Ubuntu), otherwise fall back to binary download.
            if command -v apt-get &>/dev/null && [[ -f /etc/debian_version ]]; then
                log "Debian-based system detected. Installing with APT..."
                sudo install -m 0755 -d /etc/apt/keyrings
                curl -sS https://downloads.1password.com/linux/keys/1password.asc | sudo gpg --dearmor --output /etc/apt/keyrings/1password-archive-keyring.gpg
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/1password-archive-keyring.gpg] https://downloads.1password.com/linux/debian/amd64 stable main" | sudo tee /etc/apt/sources.list.d/1password.list > /dev/null
                sudo apt-get update && sudo apt-get install -y 1password-cli
            else
                log "Non-Debian Linux detected. Installing from binary..."
                local arch op_arch
                arch=$(uname -m)
                case "$arch" in
                    x86_64) op_arch="amd64" ;;
                    aarch64|arm64) op_arch="arm64" ;;
                    *) err "Unsupported architecture: $arch" ;;
                esac
                local tmp_dir
                tmp_dir=$(mktemp -d)
                trap 'rm -rf -- "$tmp_dir"' EXIT
                curl -sSfL "https://downloads.1password.com/linux/cli/op_linux_${op_arch}_latest.tar.gz" -o "$tmp_dir/op.tar.gz"
                tar -xzf "$tmp_dir/op.tar.gz" -C "$tmp_dir"
                sudo mv "$tmp_dir/op" /usr/local/bin/
            fi
            ;;
        windows)
            log "Attempting to install with winget..."
            if command -v winget &> /dev/null; then
                winget install -e --id 1Password.CLI
            else
                err "Please install the 1Password CLI from https://1password.com/downloads/command-line/ and ensure it's in your PATH."
            fi
            ;;
        *)
            err "Unsupported OS: $os"
            ;;
    esac
    log "Installation complete."
    op --version
}

# Function to configure the CLI (primarily for user feedback)
configure_op_cli() {
    # This checks for a *local* sign-in status.
    # In CI/CD, authentication will typically happen via environment variables
    # (e.g., OP_SERVICE_ACCOUNT_TOKEN) or specific actions.
    if op account list &>/dev/null; then
        log "Already signed in to 1Password."
    else
        log "You are not signed in. For local development, you may need to run 'op signin' in your terminal."
        log "Authentication in CI workflows will be handled automatically via service account tokens."
    fi
}

# --- Main Execution ---
main() {
    log "Starting 1Password CLI setup..."
    install_op_cli
    configure_op_cli
    log "✅ Setup script finished. CLI is ready for use."
}

# Run the main function
main
