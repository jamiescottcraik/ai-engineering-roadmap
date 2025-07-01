#!/bin/bash
# Script for MCP configuration maintenance

# Set paths
WORKSPACE_DIR="$HOME/repos/ai-engineering-roadmap"
SETTINGS_FILE="$WORKSPACE_DIR/.vscode/settings.json"
MCP_PROFILES_DIR="$WORKSPACE_DIR/.vscode/mcp-profiles"
BACKUP_DIR="$WORKSPACE_DIR/.vscode/backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Timestamp for backup files
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "==== MCP Configuration Maintenance ===="
echo "Starting maintenance process at $(date)"
echo

# Backup current settings
echo "1. Creating backup of current settings..."
cp "$SETTINGS_FILE" "$BACKUP_DIR/settings_$TIMESTAMP.json"
echo "   Backup saved to $BACKUP_DIR/settings_$TIMESTAMP.json"
echo

# Check for duplicate or conflicting MCP configurations
echo "2. Checking for duplicate MCP configurations..."
if grep -q "\"mcp\":" "$SETTINGS_FILE" && grep -q "\"chat.mcp.servers\":" "$SETTINGS_FILE"; then
  echo "   ⚠️  WARNING: Found both old 'mcp' and new 'chat.mcp.servers' configurations!"
  echo "   This could cause conflicts. Consider removing the old 'mcp' configuration."
else
  echo "   ✓ No duplicate MCP configurations found."
fi
echo

# Check if auto-discovery is disabled
echo "3. Checking MCP auto-discovery setting..."
if grep -q "\"chat.mcp.discovery.enabled\": false" "$SETTINGS_FILE"; then
  echo "   ✓ MCP auto-discovery is correctly disabled."
else
  echo "   ⚠️  WARNING: MCP auto-discovery may be enabled!"
  echo "   Consider adding 'chat.mcp.discovery.enabled': false to your settings."
fi
echo

# Check for tool filters
echo "4. Checking for tool filters..."
if grep -q "toolFilters" "$SETTINGS_FILE"; then
  echo "   ✓ Tool filters are being used. This helps limit the number of tools."
else
  echo "   ⚠️  WARNING: No tool filters found in your MCP configuration."
  echo "   Consider adding toolFilters to limit the tools each server exposes."
fi
echo

# Check MCP profiles
echo "5. Checking MCP profiles..."
if [ -d "$MCP_PROFILES_DIR" ]; then
  PROFILE_COUNT=$(ls -1 "$MCP_PROFILES_DIR"/*.json 2>/dev/null | wc -l)
  if [ "$PROFILE_COUNT" -gt 0 ]; then
    echo "   ✓ Found $PROFILE_COUNT MCP profiles:"
    ls -1 "$MCP_PROFILES_DIR"/*.json | sed 's|.*/||' | sed 's/.json$//' | sed 's/^/     - /'
  else
    echo "   ℹ️ No MCP profiles found. Consider creating task-specific profiles."
  fi
else
  echo "   ℹ️ MCP profiles directory not found. Consider creating task-specific profiles."
fi
echo

# Run the MCP tool count checker
echo "6. Running MCP tool count check..."
if [ -f "$WORKSPACE_DIR/scripts/check-mcp-tools.sh" ]; then
  "$WORKSPACE_DIR/scripts/check-mcp-tools.sh" | grep -A 2 "Estimated total tools"
else
  echo "   ❌ MCP tool count checker script not found."
fi
echo

# Check usage report
echo "7. Checking MCP usage data..."
if [ -f "$WORKSPACE_DIR/scripts/monitor-mcp-usage.sh" ]; then
  # Just show the tools not used in the last 30 days
  "$WORKSPACE_DIR/scripts/monitor-mcp-usage.sh" | grep -A 10 "Tools not used in the last 30 days:" | grep "Tool:" | head -5
else
  echo "   ❌ MCP usage monitor script not found."
fi
echo

# Recommendations
echo "==== Maintenance Recommendations ===="
echo "1. Run the full usage report: ./scripts/monitor-mcp-usage.sh"
echo "2. Remove any unused tools from your configuration"
echo "3. Ensure auto-discovery remains disabled"
echo "4. Consider creating more specialized profiles for different tasks"
echo "5. Run this maintenance script monthly to keep your MCP configuration clean"
echo
echo "Maintenance completed at $(date)"
