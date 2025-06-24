# Continuous Integration & Quality Assurance

This document outlines the automated quality assurance processes for the AI Engineering Roadmap repository.

## 🔄 Automated Workflows

### Quality Assurance Pipeline

Our GitHub Actions workflow (`.github/workflows/quality-assurance.yml`) runs on every push and pull request to ensure code and content quality.

#### Jobs Overview

1. **🗺️ Validate Roadmap Data**
   - Validates JSON structure of `roadmaps/roadmap.json`
   - Checks all external links for accessibility
   - Ensures metadata completeness

2. **📝 Lint Markdown Files**
   - Runs `markdownlint` on all `.md` files
   - Ensures consistent formatting and style
   - Checks for common markdown issues

3. **🐍 Lint Python Code**
   - Uses `ruff` for code linting
   - Validates formatting with `black`
   - Checks import ordering with `isort`
   - Type checking with `mypy` (optional)

4. **🎨 Generate Visual Roadmaps**
   - Automatically generates `docs/roadmap.mmd` and `docs/roadmap.svg`
   - Uploads artifacts for review
   - Only runs after successful validation

5. **🔗 Check External Links**
   - Validates all external links in markdown files
   - Handles rate-limited sites gracefully
   - Configurable via `.github/workflows/mlc_config.json`

6. **🔒 Security Scan**
   - Runs Trivy vulnerability scanner
   - Uploads results to GitHub Security tab
   - Scans for known vulnerabilities

## 🛠️ Local Development

### Pre-commit Checks

Run quality checks locally before committing:

```bash
./scripts/pre-commit-check.sh
```

This script performs:

- Python linting and formatting checks
- Markdown linting
- Roadmap data validation
- Visual roadmap generation

### Manual Quality Checks

#### Validate Roadmap

```bash
python scripts/validate_roadmap.py
```

#### Generate Visuals

```bash
python scripts/generate_roadmap_visual.py
# or
./scripts/update_roadmap_visuals.sh
```

#### Lint Python Code

```bash
ruff check scripts/ backend/src/
black --check scripts/ backend/src/
isort --check-only --profile black scripts/ backend/src/
```

#### Lint Markdown

```bash
markdownlint "**/*.md" --ignore node_modules
```

## 📋 Quality Standards

### Python Code

- Must pass `ruff` linting with no errors
- Must be formatted with `black`
- Imports must be sorted with `isort`
- Type hints recommended for new code

### Markdown Files

- Must pass `markdownlint` checks
- Use consistent heading styles
- Include language specifiers for code blocks
- Wrap long lines appropriately

### Roadmap Data

- `roadmaps/roadmap.json` must have valid structure
- All required metadata fields must be present
- External URLs should be accessible (some exceptions allowed)

### Visual Assets

- Generated automatically from roadmap data
- Must not be manually edited
- SVG files should be under 1MB

## ⚙️ Configuration Files

- `.github/workflows/quality-assurance.yml` - Main CI workflow
- `.github/workflows/mlc_config.json` - Link checker configuration
- `scripts/pre-commit-check.sh` - Local quality checks
- `scripts/validate_roadmap.py` - Roadmap validation logic

## 🚨 Troubleshooting

### Common Issues

**Failed Link Checks**: Some external sites block automated requests. Add patterns to `mlc_config.json` if legitimate.

**Python Linting Errors**: Run `black scripts/ backend/src/` to auto-format code.

**Roadmap Validation Failures**: Check JSON syntax and ensure all required fields are present.

**Visual Generation Issues**: Ensure `mmdc` is installed globally: `npm install -g @mermaid-js/mermaid-cli`

### Getting Help

- Check the Actions tab for detailed error logs
- Run scripts locally to debug issues
- Review the `docs/feature_plan.md` for context on quality requirements

---

## Implementation Note

This CI system implements Section 8 of the feature plan: "Automation & Quality Assurance"
