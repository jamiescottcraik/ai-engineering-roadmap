# Roadmaps Directory

This directory contains all JSON/YAML curriculum and roadmap data files.

## Structure

- `roadmap.json` - Main interactive roadmap data
- `phases/` - Individual phase definitions
- `resources/` - Resource catalogs and metadata
- `versions/` - Versioned roadmap snapshots

## Data Format

All roadmap files follow a structured JSON schema with:

- Metadata (title, author, version, dates)
- Phases with nodes, progress tracking, and resources
- Resource types: courses, projects, books, tutorials, assessments

## Contributing

When adding or modifying roadmap data:

1. Validate JSON syntax
2. Test with validation scripts in `/scripts/`
3. Update version numbers appropriately
4. Document changes in commit messages
