# Project Redundancies

## Docker Compose Files

- docker-compose-db.yml and docker-compose-mcp.yml both define the same database service
- These have been consolidated into docker-compose-mcp-consolidated.yml
- Both redundant files have been removed

## Script Files

- check-kebab-case.py (empty file) - removed
- check_kebab_case.py (active file) - retained
- naming_convention_checker.py (empty file) - removed
- check-kebab-case.py.backup (backup of active file) - removed
- .vscode/tasks.json.bak (backup of tasks.json) - removed

## Completed Actions

1. Consolidated Docker Compose files into docker-compose-mcp-consolidated.yml
2. Removed empty and backup scripts
3. Updated scripts to reference new Docker Compose file names
4. Fixed naming convention issues by renaming files to use kebab-case

## Current Status

All redundant files have been removed and the project structure is now clean and organized.
