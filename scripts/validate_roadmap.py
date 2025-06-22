#!/usr/bin/env python3
"""
Validation script for roadmap JSON files and resource links.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

import requests  # type: ignore


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
    required_keys = ['metadata', 'phases']
    for key in required_keys:
        if key not in data:
            errors.append(f"Missing required key: {key}")
    
    # Validate metadata
    if 'metadata' in data:
        metadata = data['metadata']
        required_metadata = ['title', 'author', 'last_updated', 'version']
        for key in required_metadata:
            if key not in metadata:
                errors.append(f"Missing metadata field: {key}")
    
    # Validate phases
    if 'phases' in data:
        phases = data['phases']
        if not isinstance(phases, list):
            errors.append("Phases must be a list")
        else:
            for i, phase in enumerate(phases):
                if not isinstance(phase, dict):
                    errors.append(f"Phase {i} must be an object")
                    continue
                
                required_phase_keys = ['id', 'title', 'nodes']
                for key in required_phase_keys:
                    if key not in phase:
                        errors.append(f"Phase {i} missing required key: {key}")
                
                # Validate nodes
                if 'nodes' in phase:
                    nodes = phase['nodes']
                    if not isinstance(nodes, list):
                        errors.append(f"Phase {i} nodes must be a list")
                    else:
                        for j, node in enumerate(nodes):
                            if not isinstance(node, dict):
                                errors.append(f"Phase {i}, node {j} must be an object")
                                continue
                            
                            required_node_keys = ['id', 'title', 'type']
                            for key in required_node_keys:
                                if key not in node:
                                    errors.append(f"Phase {i}, node {j} missing required key: {key}")
    
    return len(errors) == 0, errors


def validate_url(url: str, timeout: int = 10) -> tuple[bool, str]:
    """Validate that a URL is accessible."""
    try:
        parsed = urlparse(url)
        if not parsed.scheme or not parsed.netloc:
            return False, "Invalid URL format"
        
        response = requests.head(url, timeout=timeout, allow_redirects=True)
        if response.status_code < 400:
            return True, f"URL accessible (status: {response.status_code})"
        else:
            return False, f"URL returned status: {response.status_code}"
    except requests.exceptions.RequestException as e:
        return False, f"URL validation error: {e}"


def extract_urls_from_roadmap(data: dict[str, Any]) -> list[str]:
    """Extract all URLs from roadmap data."""
    urls = []
    
    def extract_from_dict(obj):
        if isinstance(obj, dict):
            for key, value in obj.items():
                if key == 'url' and isinstance(value, str):
                    urls.append(value)
                elif isinstance(value, dict | list):
                    extract_from_dict(value)
        elif isinstance(obj, list):
            for item in obj:
                extract_from_dict(item)
    
    extract_from_dict(data)
    return urls


def main():
    """Main validation function."""
    print("🔍 Validating roadmap files and resources...")
    
    # Find all JSON files in roadmaps directory
    roadmaps_dir = Path('roadmaps')
    if not roadmaps_dir.exists():
        print("❌ Roadmaps directory not found")
        sys.exit(1)
    
    json_files = list(roadmaps_dir.glob('**/*.json'))
    if not json_files:
        print("❌ No JSON files found in roadmaps directory")
        sys.exit(1)
    
    total_errors = 0
    
    for json_file in json_files:
        print(f"\n📄 Validating {json_file}...")
        
        # Validate JSON syntax
        is_valid, message = validate_json_syntax(json_file)
        if not is_valid:
            print(f"❌ {message}")
            total_errors += 1
            continue
        
        # Load and validate structure
        with open(json_file) as f:
            data = json.load(f)
        
        is_valid, errors = validate_roadmap_structure(data)
        if not is_valid:
            print("❌ Structure validation failed:")
            for error in errors:
                print(f"   • {error}")
            total_errors += len(errors)
        else:
            print("✅ Structure validation passed")
        
        # Validate URLs
        urls = extract_urls_from_roadmap(data)
        if urls:
            print(f"🔗 Checking {len(urls)} URLs...")
            for url in urls:
                is_valid, message = validate_url(url)
                if not is_valid:
                    print(f"❌ {url}: {message}")
                    total_errors += 1
                else:
                    print(f"✅ {url}: {message}")
        else:
            print("ℹ️  No URLs found to validate")
    
    # Summary
    print("\n📊 Validation Summary:")
    print(f"   Files checked: {len(json_files)}")
    print(f"   Total errors: {total_errors}")
    
    if total_errors == 0:
        print("🎉 All validations passed!")
        sys.exit(0)
    else:
        print("❌ Validation failed with errors")
        sys.exit(1)


if __name__ == "__main__":
    main()
