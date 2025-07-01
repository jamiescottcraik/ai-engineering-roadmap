# Project Redundancies

## Docker Compose Files

- docker-compose.db.yml and docker-compose.mcp.yml both define the same database service
- Recommend consolidating into a single file

## Script Files

- check-kebab-case.py (empty file)
- check_kebab_case.py (active file)
- naming_convention_checker.py (empty file)
- check-kebab-case.py.backup (backup of active file)

## Recommended Actions

1. Consolidate docker-compose files
2. Remove empty and backup scripts
