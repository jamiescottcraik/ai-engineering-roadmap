#!/bin/bash
# Script to monitor MCP tool usage in VS Code

# Path to the log file
LOG_FILE="$HOME/.vscode/mcp-tool-usage.log"
MCP_PROFILE_DIR="$HOME/repos/ai-engineering-roadmap/.vscode/mcp-profiles"

# Create the log file if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"

# Display the current date
echo "===== MCP Tool Usage Report - $(date) ====="

# Check if the tool usage log exists and has content
if [ -s "$LOG_FILE" ]; then
  echo "MCP Tool Usage (last 30 days):"
  echo "------------------------------"

  # Get the top 10 most frequently used tools
  echo "Top 10 most used tools:"
  grep -o "Tool: [a-zA-Z0-9_-]*" "$LOG_FILE" | sort | uniq -c | sort -nr | head -10

  echo

  # Get tools used in the last 7 days
  echo "Tools used in the last 7 days:"
  LAST_WEEK=$(date -v-7d +%Y-%m-%d)
  grep "$LAST_WEEK" "$LOG_FILE" | grep -o "Tool: [a-zA-Z0-9_-]*" | sort | uniq

  echo

  # Find tools that haven't been used in 30 days
  echo "Tools not used in the last 30 days:"
  LAST_MONTH=$(date -v-30d +%Y-%m-%d)
  RECENT_TOOLS=$(grep -A "$LAST_MONTH" "$LOG_FILE" | grep -o "Tool: [a-zA-Z0-9_-]*" | sort | uniq)
  ALL_TOOLS=$(grep -o "Tool: [a-zA-Z0-9_-]*" "$LOG_FILE" | sort | uniq)

  # Print tools that are in ALL_TOOLS but not in RECENT_TOOLS
  for tool in $ALL_TOOLS; do
    if ! echo "$RECENT_TOOLS" | grep -q "$tool"; then
      echo "$tool"
    fi
  done
else
  echo "No MCP tool usage data available yet."
  echo "Tool usage will be logged as you use MCP tools in VS Code."
fi

echo
echo "MCP Profiles Available:"
echo "----------------------"
ls -1 "$MCP_PROFILE_DIR" | grep ".json" | sed 's/.json$//'

echo
echo "Recommendations:"
echo "---------------"
echo "1. Remove unused tools to stay under the 128 tool limit"
echo "2. Switch to task-specific profiles when working on specific tasks"
echo "3. Run the MCP tool check script to monitor total tool count:"
echo "   ./scripts/check-mcp-tools.sh"
echo
echo "To switch profiles, use the VS Code Command Palette:"
echo "Ctrl+Shift+P (or Cmd+Shift+P) > 'Tasks: Run Task' > 'MCP: Use...'"
