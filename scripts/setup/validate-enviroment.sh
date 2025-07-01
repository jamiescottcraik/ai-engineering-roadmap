#!/bin/bash
set -euo pipefail

#==============================================================================#
#                Master Environment Validation & Setup Script                  #
#                                                                              #
#   - Acts as the single entry point for validating the development environment. #
#   - Checks for core dependencies (Python, Git, jq).                          #
#   - Delegates to specific setup scripts for modular validation.              #
#==============================================================================#

log() {
    echo "🔬 [Validator] $1"
}

err() {
    echo "❌ [Validator] ERROR: $1" >&2
    exit 1
}

# Function to check for the presence of a command
check_command() {
    if ! command -v "$1" &> /dev/null; then
        err "'$1' is not installed, but is required to continue."
    fi
    log "✅ Verified command: $1"
}

main() {
    log "🔎 Starting environment validation..."

    # --- 1. Validate Core System Dependencies ---
    log "Checking for core system dependencies..."
    check_command "python3"
    check_command "git"
    check_command "jq" # Useful for JSON parsing in other scripts

    # --- 2. Delegate to Specific Setup/Validation Scripts ---
    local script_dir
    script_dir=$(dirname "$0") # Assumes this script is in the same dir as others

    log "Handing off to 1Password setup script..."
    if ! bash "${script_dir}/setup-1password.sh"; then
        err "1Password setup/validation failed. Please check the logs above."
    fi

    log "Handing off to AI Agent setup script..."
    if ! bash "${script_dir}/setup-ai-agents.sh"; then
        err "AI Agent setup/validation failed. Please check the logs above."
    fi

    log "✅ Environment validation complete. All systems go!"
}

main
