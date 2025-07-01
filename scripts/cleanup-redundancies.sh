#!/bin/bash
# Script to clean up redundant files in the project

echo "Cleaning up redundant files in the project..."

# 1. Empty Python files
echo "Removing empty Python files..."
[ -f "scripts/check-kebab-case.py" ] && [ ! -s "scripts/check-kebab-case.py" ] && rm scripts/check-kebab-case.py && echo "Removed empty scripts/check-kebab-case.py"
[ -f "scripts/naming_convention_checker.py" ] && [ ! -s "scripts/naming_convention_checker.py" ] && rm scripts/naming_convention_checker.py && echo "Removed empty scripts/naming_convention_checker.py"

# 2. Backup files
echo "Removing backup files..."
[ -f "scripts/check-kebab-case.py.backup" ] && rm scripts/check-kebab-case.py.backup && echo "Removed scripts/check-kebab-case.py.backup"
[ -f "apps/web/src/app/globals.css.backup" ] && rm apps/web/src/app/globals.css.backup && echo "Removed apps/web/src/app/globals.css.backup"

# 3. Update Docker Compose references
echo "Updating Docker Compose references..."
if [ -f "docker-compose.mcp-consolidated.yml" ]; then
  echo "Please note that docker-compose.db.yml and docker-compose.mcp.yml have been consolidated into docker-compose.mcp-consolidated.yml"
  echo "You should update any scripts or documentation that reference these files."

  # Update the VS Code tasks that reference these files
  if [ -f ".vscode/tasks.json" ]; then
    sed -i.bak 's/docker-compose -f docker-compose.db.yml/docker-compose -f docker-compose.mcp-consolidated.yml/g' .vscode/tasks.json
    echo "Updated Docker Compose references in .vscode/tasks.json"
  fi
fi

echo "Done cleaning up redundant files."
echo "NOTE: This script does not remove the original Docker Compose files."
echo "After verifying the consolidated file works correctly, you can manually remove:"
echo "  - docker-compose.db.yml"
echo "  - docker-compose.mcp.yml"
