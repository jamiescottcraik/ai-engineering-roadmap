#!/usr/bin/env python3
"""
Validation script for roadmap JSON files and resource links.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests

# URLs that require authentication and should not fail validation
AUTH_REQUIRED_DOMAINS = {
    "www.datacamp.com",
    "app.datacamp.com",
    "www.cloudskillsboost.google",
    "studiolab.sagemaker.aws",
}

# URLs that are known to block bots but are legitimate
BOT_BLOCKED_DOMAINS = {
    "leetcode.com",
    "www.hackerrank.com",
    "codeforces.com",
    "www.lesswrong.com",
    "openai.com",
    "www.elementsofai.com",
}

# Rate limited domains that should be treated as warnings
RATE_LIMITED_DOMAINS = {"www.stratascratch.com"}


def validate_json_syntax(file_path: Path) -> tuple[bool, str]:
    """Validate JSON syntax of a file."""
    try:
        with open(file_path) as f:
            json.load(f)
        return True, "Valid JSON syntax"
    except json.JSONDecodeError as e:
        return False, f"JSON syntax error: {e}"
    except Exception as e:
        return False, f"Error reading file: {e}"


def validate_roadmap_structure(data: dict[str, Any]) -> tuple[bool, list[str]]:
    """Validate the structure of roadmap data."""
    errors = []

    # Check required top-level keys
    required_keys = ["metadata", "phases"]
    for key in required_keys:
        if key not in data:
            errors.append(f"Missing required key: {key}")

    # Validate metadata
    if "metadata" in data:
        metadata = data["metadata"]
        required_metadata = ["title", "author", "last_updated", "version"]
        for key in required_metadata:
            if key not in metadata:
                errors.append(f"Missing metadata field: {key}")

    # Validate phases
    if "phases" in data:
        phases = data["phases"]
        if not isinstance(phases, list):
            errors.append("Phases must be a list")
        else:
            for i, phase in enumerate(phases):
                if not isinstance(phase, dict):
                    errors.append(f"Phase {i} must be an object")
                    continue

                required_phase_keys = ["id", "title", "nodes"]
                for key in required_phase_keys:
                    if key not in phase:
                        errors.append(f"Phase {i} missing required key: {key}")

                # Validate nodes
                if "nodes" in phase:
                    nodes = phase["nodes"]
                    if not isinstance(nodes, list):
                        errors.append(f"Phase {i} nodes must be a list")
                    else:
                        for j, node in enumerate(nodes):
                            if not isinstance(node, dict):
                                errors.append(f"Phase {i}, node {j} must be an object")
                                continue

                            required_node_keys = ["id", "title", "type"]
                            for key in required_node_keys:
                                if key not in node:
                                    errors.append(
                                        f"Phase {i}, node {j} missing required key: {key}"
                                    )

    return len(errors) == 0, errors


def validate_url(url: str, timeout: int = 10) -> tuple[bool, str, str]:
    """
    Validate that a URL is accessible.
    Returns (is_valid, message, category) where category is 'error', 'warning', or 'info'
    """
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return False, "Invalid URL format", "error"

        domain = parsed.netloc.lower()

        # Check if URL requires authentication
        if any(auth_domain in domain for auth_domain in AUTH_REQUIRED_DOMAINS):
            return True, "Authentication required (expected)", "info"

        # Check if URL is known to block bots
        if any(bot_domain in domain for bot_domain in BOT_BLOCKED_DOMAINS):
            return True, "Bot detection (expected)", "info"

        # Check if URL is rate limited
        if any(rate_domain in domain for rate_domain in RATE_LIMITED_DOMAINS):
            return True, "Rate limited (expected)", "info"

        response = requests.head(url, timeout=timeout, allow_redirects=True)
        if response.status_code < 400:
            return True, f"URL accessible (status: {response.status_code})", "success"
        elif response.status_code == 403:
            return (
                True,
                f"Access forbidden (status: {response.status_code}) - likely bot detection",
                "warning",
            )
        elif response.status_code == 429:
            return True, f"Rate limited (status: {response.status_code})", "warning"
        elif response.status_code == 401:
            return (
                True,
                f"Authentication required (status: {response.status_code})",
                "info",
            )
        else:
            return False, f"URL returned status: {response.status_code}", "error"
    except requests.exceptions.RequestException as e:
        return False, f"URL validation error: {e}", "error"


def extract_urls_from_roadmap(data: dict[str, Any]) -> list[str]:
    """Extract all URLs from roadmap data."""
    urls = []

    def extract_from_dict(obj: Any) -> None:
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == "url" and isinstance(value, str):
                    urls.append(value)
                elif isinstance(value, dict | list):
                    extract_from_dict(value)
        elif isinstance(obj, list):
            for item in obj:
                extract_from_dict(item)

    extract_from_dict(data)
    return urls


def main() -> None:
    """Main validation function."""
    print("🔍 Validating roadmap files and resources...")

    # Check if running in CI environment
    is_ci = os.getenv("CI", "").lower() == "true"

    # Find all JSON files in roadmaps directory
    roadmaps_dir = Path("roadmaps")
    if not roadmaps_dir.exists():
        print("❌ Roadmaps directory not found")
        sys.exit(1)

    json_files = list(roadmaps_dir.glob("**/*.json"))
    if not json_files:
        print("❌ No JSON files found in roadmaps directory")
        sys.exit(1)

    url_errors = 0
    url_warnings = 0
    structure_errors = 0

    for json_file in json_files:
        print(f"\n📄 Validating {json_file}...")

        # Validate JSON syntax
        is_valid, message = validate_json_syntax(json_file)
        if not is_valid:
            print(f"❌ {message}")
            structure_errors += 1
            continue

        # Load and validate structure
        with open(json_file) as f:
            data = json.load(f)

        is_valid, errors = validate_roadmap_structure(data)
        if not is_valid:
            print("❌ Structure validation failed:")
            for error in errors:
                print(f"   • {error}")
            structure_errors += len(errors)
        else:
            print("✅ Structure validation passed")

        # Validate URLs
        urls = extract_urls_from_roadmap(data)
        if urls:
            print(f"🔗 Checking {len(urls)} URLs...")
            for url in urls:
                is_valid, message, category = validate_url(url)

                if category == "error":
                    print(f"❌ {url}: {message}")
                    url_errors += 1
                elif category == "warning":
                    print(f"⚠️ {url}: {message}")
                    url_warnings += 1
                elif category == "info":
                    print(f"ℹ️ {url}: {message}")
                else:  # success
                    print(f"✅ {url}: {message}")
        else:
            print("ℹ️  No URLs found to validate")

    # Summary
    print("\n📊 Validation Summary:")
    print(f"   Files checked: {len(json_files)}")
    print(f"   Structure errors: {structure_errors}")
    print(f"   URL errors: {url_errors}")
    print(f"   URL warnings: {url_warnings}")
    print(f"   Total critical errors: {structure_errors + url_errors}")

    # In CI, be more strict about URL errors
    if is_ci:
        max_url_errors = 5  # Allow up to 5 URL errors in CI
        if structure_errors == 0 and url_errors <= max_url_errors:
            if url_errors > 0 or url_warnings > 0:
                print(
                    f"⚠️ Structure validation passed, {url_errors} URL errors and {url_warnings} warnings (within CI tolerance)"
                )
            else:
                print("🎉 All validations passed!")
            sys.exit(0)
        else:
            print(
                f"❌ Validation failed: {structure_errors} structure errors, {url_errors} URL errors (max {max_url_errors} allowed in CI)"
            )
            sys.exit(1)
    else:
        # Local development - only fail on structure errors
        if structure_errors == 0:
            if url_errors > 0 or url_warnings > 0:
                print(
                    f"⚠️ Structure validation passed, but {url_errors} URL errors and {url_warnings} warnings detected"
                )
            else:
                print("🎉 All validations passed!")
            sys.exit(0)
        else:
            print("❌ Structure validation failed")
            sys.exit(1)


if __name__ == "__main__":
    main()
