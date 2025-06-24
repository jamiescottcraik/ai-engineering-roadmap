# CI/CD Automation Documentation

## Overview

This repository uses GitHub Actions to automatically validate roadmap changes, check links, lint code, and ensure quality standards. The automation helps maintain roadmap integrity and prevents broken links or malformed data from being merged.

## Workflows

### 🔍 Validate Roadmap & Links

**File:** `.github/workflows/validate-roadmap.yml`

This workflow runs on every push and pull request and includes:

#### 📊 Roadmap Validation Job
- Validates JSON structure of `roadmaps/roadmap.json`
- Checks URL accessibility with intelligent categorization:
  - ✅ **Accessible URLs** - Return 2xx status
  - ℹ️ **Authentication Required** - DataCamp, Google Cloud Skills Boost, etc.
  - ℹ️ **Bot Detection** - LeetCode, HackerRank, LessWrong, etc.
  - ⚠️ **Rate Limited** - StratasScratch and similar platforms
  - ❌ **Broken URLs** - 404 errors, DNS failures, etc.

#### 🧹 Lint & Format Check Job
- Python code formatting with Black
- Python linting with Ruff  
- Type checking with MyPy

#### 📝 Markdown Lint Check Job
- Markdown formatting validation
- Consistent heading structure
- Proper link formatting

#### 🔗 External Link Check Job
- Validates links in documentation
- Configurable ignore patterns for known bot-blocked sites
- Retry logic for temporary failures

#### 🔒 Security Scan Job
- Trivy vulnerability scanning
- SARIF report upload to GitHub Security tab

## Local Development

### Pre-commit Hook

Install the pre-commit hook for automatic validation:

```bash
# Copy the hook to your local git hooks
cp scripts/pre-commit-hook.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

The hook will:
1. Validate roadmap JSON structure and URLs
2. Generate updated visual roadmaps
3. Stage any changes to visual files
4. Prevent commits with validation errors

### Manual Validation

Run validation scripts manually:

```bash
# Validate roadmap structure and URLs
python scripts/validate_roadmap.py

# Generate/update visual roadmaps
python scripts/generate_roadmap_visual.py

# Update all visual assets
./scripts/update_roadmap_visuals.sh
```

## URL Validation Strategy

### Categories of URLs

The validation script intelligently categorizes URLs to reduce false positives:

#### 🔒 Authentication Required
- DataCamp courses and tracks
- Google Cloud Skills Boost paths
- AWS SageMaker Studio Lab
- **Status**: ℹ️ Info (not an error)

#### 🤖 Bot Detection
- LeetCode, HackerRank, Codeforces
- LessWrong, OpenAI blog
- Elements of AI
- **Status**: ℹ️ Info (not an error)

#### ⏱️ Rate Limited
- StratasScratch
- **Status**: ℹ️ Info (not an error)

#### ❌ Actual Errors
- 404 Not Found (content removed/moved)
- DNS resolution failures
- Connection timeouts
- **Status**: ❌ Error (blocks CI in strict mode)

### CI Behavior

- **Local Development**: Only structure errors block commits
- **CI Environment**: Allows up to 5 URL errors (configurable)
- **Pull Requests**: Full validation runs with detailed reporting

## Configuration Files

### Link Check Configuration
**File:** `.github/workflows/link-check-config.json`

Configures markdown-link-check behavior:
- Ignore patterns for known problematic domains
- Custom headers for GitHub API rate limiting
- Timeout and retry settings
- Acceptable status codes

### Validation Script Settings
**File:** `scripts/validate_roadmap.py`

Domain categorization lists:
- `AUTH_REQUIRED_DOMAINS` - Sites requiring login
- `BOT_BLOCKED_DOMAINS` - Sites with bot detection
- `RATE_LIMITED_DOMAINS` - Sites with rate limiting

## Best Practices

### Adding New Resources

1. **Test URLs First**: Verify accessibility before adding
2. **Note Special Requirements**: Add "(Login required)" to descriptions
3. **Use Alternative Links**: Prefer publicly accessible alternatives
4. **Update Categories**: Add new domains to validation script if needed

### Handling URL Changes

1. **Update roadmap.json**: Fix moved/updated URLs
2. **Run Local Validation**: `python scripts/validate_roadmap.py`
3. **Regenerate Visuals**: `python scripts/generate_roadmap_visual.py`
4. **Document Changes**: Update CHANGELOG.md

### Troubleshooting CI Failures

#### Structure Validation Errors
- Check JSON syntax in roadmap.json
- Verify required metadata fields are present
- Ensure all phases have required keys

#### URL Validation Errors
- Review specific failing URLs in CI logs
- Determine if URLs moved or were removed
- Add to ignore list if authentication/bot detection issue
- Update roadmap.json with corrected URLs

#### Link Check Failures
- Check markdown-link-check logs for specific issues
- Update link-check-config.json ignore patterns if needed
- Fix broken documentation links

## Monitoring and Maintenance

### Regular Tasks

1. **Weekly**: Review CI logs for new URL issues
2. **Monthly**: Update domain categorization lists
3. **Quarterly**: Review and update ignore patterns
4. **As Needed**: Fix broken links and update resources

### Metrics to Track

- Total URLs validated
- Error/warning ratios
- Most frequently failing domains
- CI build success rates

This automation ensures the roadmap remains accurate, accessible, and valuable for learners while minimizing maintenance overhead.
