# GitHub Stats CLI

A beautiful command-line tool that generates statistical analysis cards from GitHub data.

## 🎯 Project Overview

This CLI tool is part of the AI Leadership Engineering Roadmap (Phase 1 deliverable). It demonstrates advanced Python programming, API integration, and professional software development practices.

## ✨ Features

- 📊 Comprehensive GitHub user statistics
- 🎨 Beautiful terminal output with Rich library
- 📤 Multiple export formats (JSON, CSV, PNG cards)
- 🔒 Secure GitHub API authentication
- ⚡ Optimized performance with caching
- 🧪 Comprehensive test coverage (90%+)

## 🚀 Installation

```bash
pip install github-stats-cli
```

## 📖 Usage

```bash
# Basic usage
github-stats analyze jamiescottcraik

# With specific output format
github-stats analyze jamiescottcraik --format card

# Export to file
github-stats analyze jamiescottcraik --format json --output stats.json
```

## 🛠️ Development Status

**Current Progress: 25%**

- [x] Basic CLI structure with Click framework
- [x] GitHub API integration and authentication
- [x] Repository statistics collection
- [ ] Beautiful terminal output with Rich library
- [ ] Export to multiple formats (JSON, CSV, PNG cards)
- [ ] Comprehensive test suite
- [ ] CI/CD pipeline
- [ ] PyPI publishing

## 📊 Technical Specifications

- **Language:** Python 3.11+
- **Framework:** Click (CLI), Rich (Terminal UI)
- **API:** GitHub REST API v4
- **Testing:** pytest, coverage.py
- **Quality:** black, ruff, mypy
- **CI/CD:** GitHub Actions

## 🎯 Success Criteria

- [ ] CLI with multiple output formats (JSON, CSV, visual cards)
- [ ] 90%+ test coverage with CI/CD
- [ ] Published on PyPI with 10+ downloads
- [ ] Complete documentation with usage examples

## 🔗 Links

- [Project Repository](../../projects/github-stats-cli/)
- [Development Log](../../progress/weekly-reviews/week-04-review.md)
- [Roadmap Context](../../README.md#phase-1-core-engineering-foundations-8-weeks)
