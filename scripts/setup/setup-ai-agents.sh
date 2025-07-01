#!/bin/bash
set -euo pipefail

#==============================================================================#
#                    Dynamic AI Agent Initialization Script                    #
#                                                                              #
#  - Automatically discovers agent configurations from the .ai/config/ dir.  #
#  - Verifies basic presence and structure; adapts to new agents.            #
#==============================================================================#

log() {
    echo "🤖 [Agent Setup] $1"
}

err() {
    echo "❌ [Agent Setup] ERROR: $1" >&2
    exit 1
}

main() {
    log "Verifying AI Agent configurations..."
    local config_dir=".ai/config"
    local agent_count=0
    local has_invalid_configs=false # Flag for semantic validation failures

    if [[ ! -d "$config_dir" ]]; then
        err "Configuration directory not found at: $config_dir"
    fi

    # Enable nullglob to ensure the loop doesn't run if no files match the glob
    shopt -s nullglob

    # Loop through all .json files in the configuration directory
    for config_file in "$config_dir"/*.json; do
        agent_count=$((agent_count + 1))
        local agent_name
        agent_name=$(basename "$config_file" .json)

        log "🔎 Checking config for agent: $agent_name ($config_file)"

        # Basic JSON validity check using jq if available
        if command -v jq &> /dev/null; then
            if ! jq -e . "$config_file" > /dev/null; then
                err "JSON is invalid for agent: $agent_name. Please fix it."
            fi
            log "   └── JSON syntax is valid."

            # Optional: Perform semantic validation for expected keys
            # This aligns with how delegate-task.py expects these configs.
            if ! jq -e '.provider_type and .model_name and .capabilities' "$config_file" > /dev/null; then
                log "   └── ⚠️ WARNING: Config for '$agent_name' is missing expected keys (provider_type, model_name, capabilities)."
                has_invalid_configs=true
            else
                log "   └── Semantic keys (provider_type, model_name, capabilities) are present."
            fi
        else
            log "   └── Skipping detailed JSON validation (jq not found). Install jq for better checks."
        fi
    done

    # Disable nullglob
    shopt -u nullglob

    if [[ "$agent_count" -eq 0 ]]; then
        err "No agent configuration files (.json) found in $config_dir. Please create them."
    fi

    if [[ "$has_invalid_configs" = true ]]; then
        err "Some agent configurations are missing critical semantic keys. Please review the warnings above."
    fi

    log "✅ All $agent_count discovered AI agents are configured and verified."
}

main
