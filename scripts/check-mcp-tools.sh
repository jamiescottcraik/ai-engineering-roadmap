#!/bin/bash
# Script to check MCP tool count in VS Code

# Check if we're in a VS Code terminal
if [ -z "$TERM_PROGRAM" ] || [ "$TERM_PROGRAM" != "vscode" ]; then
  echo "WARNING: This script may not work outside VS Code"
fi

# Try to get MCP server information
echo "Checking for available MCP tools..."
echo

# Try to use the VS Code CLI to get MCP info (this would need the CLI to be installed)
if command -v code &> /dev/null; then
  # This is a placeholder - VS Code doesn't have a direct CLI for this
  echo "Method 1: Using VS Code CLI (if supported)"
  echo "The VS Code CLI doesn't directly support MCP tool enumeration"
  echo
fi

# Check if the MCP settings file exists and parse it
echo "Method 2: Analyzing MCP settings files"
echo "==============================================="

# Function to parse a settings file and estimate tool count
parse_settings() {
  local file=$1
  local server_count=0
  local estimated_tools=0

  echo "Checking file: $file"

  if [ -f "$file" ]; then
    # Count servers using grep
    if grep -q "\"chat.mcp.servers\"" "$file"; then
      # New format
      server_count=$(grep -c "\"id\":" "$file")
      echo "- Found $server_count servers (new format)"
    elif grep -q "\"mcp\":" "$file"; then
      # Old format
      server_count=$(grep -c "\"type\":" "$file")
      echo "- Found $server_count servers (old format)"
    fi

    # Check for specific servers and estimate their tool count
    if grep -q "github-actions" "$file"; then
      echo "  - github-actions: ~7 tools"
      estimated_tools=$((estimated_tools + 7))
    fi

    if grep -q "db_query_tool\|postgres" "$file"; then
      echo "  - db_query_tool: ~3 tools"
      estimated_tools=$((estimated_tools + 3))
    fi

    if grep -q "context7" "$file"; then
      echo "  - context7: ~2 tools"
      estimated_tools=$((estimated_tools + 2))
    fi

    # Look for any other potential servers
    other_servers=$(grep -o "\"id\": \"[^\"]*\"" "$file" | grep -v "github-actions\|db_query_tool\|context7" | wc -l)
    if [ "$other_servers" -gt 0 ]; then
      echo "  - Other servers: $other_servers (unknown tool count)"
      # Estimate 5 tools per unknown server as a conservative guess
      estimated_tools=$((estimated_tools + (other_servers * 5)))
    fi

    echo "- Estimated total tools: $estimated_tools"

    # Check if we're approaching the limit
    if [ "$estimated_tools" -gt 100 ]; then
      echo "⚠️ WARNING: You're approaching the 128 tool limit!"
    fi
  else
    echo "File not found: $file"
  fi

  echo
}

# Check workspace settings first
parse_settings ".vscode/settings.json"

# Check global settings
USER_SETTINGS_PATH="$HOME/Library/Application Support/Code/User/settings.json"
if [ -f "$USER_SETTINGS_PATH" ]; then
  parse_settings "$USER_SETTINGS_PATH"
else
  echo "Global settings file not found at expected location"
fi

echo "==============================================="
echo "Note: This is an estimate. The actual tool count may vary."
echo "If you're hitting the 128 tool limit, try using one of the"
echo "specialized MCP profiles created in .vscode/mcp-profiles/"
