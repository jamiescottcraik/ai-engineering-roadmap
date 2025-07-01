#!/bin/bash
# Script to set up a monthly cron job for MCP maintenance

# Define paths
WORKSPACE_DIR="$HOME/repos/ai-engineering-roadmap"
MAINTENANCE_SCRIPT="$WORKSPACE_DIR/scripts/mcp-maintenance.sh"
LOG_FILE="$HOME/.vscode/mcp-maintenance.log"

# Check if the maintenance script exists
if [ ! -f "$MAINTENANCE_SCRIPT" ]; then
  echo "Error: MCP maintenance script not found at $MAINTENANCE_SCRIPT"
  exit 1
fi

# Create the log directory if it doesn't exist
mkdir -p "$(dirname "$LOG_FILE")"

# Create the crontab entry (runs on the 1st of each month at 9:00 AM)
CRON_ENTRY="0 9 1 * * $MAINTENANCE_SCRIPT >> $LOG_FILE 2>&1"

# Check if the cron job already exists
if crontab -l 2>/dev/null | grep -q "$MAINTENANCE_SCRIPT"; then
  echo "MCP maintenance cron job already exists."
else
  # Add the new cron job
  (crontab -l 2>/dev/null; echo "$CRON_ENTRY") | crontab -
  echo "MCP maintenance cron job added. It will run on the 1st of each month at 9:00 AM."
  echo "Logs will be saved to $LOG_FILE"
fi

echo "You can also run the maintenance script manually at any time:"
echo "$MAINTENANCE_SCRIPT"
