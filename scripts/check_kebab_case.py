#!/usr/bin/env python3
"""
Comprehensive naming convention checker for brAInwav MAS project.
This script validates file naming conventions based on file type and context.

Usage:
    python scripts/check-kebab-case.py [file1] [file2] ...

Exit codes:
    0: All files follow naming conventions
    1: One or more files violate naming conventions

Naming Conventions by File Type:
    - TypeScript/JavaScript: kebab-case (ai-learning-roadmap.tsx)
    - Python modules: snake_case (ollama_manager.py)
    - React components: kebab-case (cortex-gate-manager.tsx)
    - CSS files: kebab-case (focus-scenes.css)
    - Shell scripts: kebab-case (setup-ollama.sh)
    - Config files: kebab-case or standard naming
    - Governance files: UPPERCASE exceptions (RULES_OF_AI.md, README.md)
    - Next.js special files: Standard naming (layout.tsx, page.tsx)
"""

import re
import sys
from pathlib import Path
from typing import List, Set

# Files that are explicitly exempted from naming conventions
EXEMPTED_FILES: Set[str] = {
    # Governance files (UPPERCASE exceptions)
    "README.md",
    "RULES_OF_AI.md",
    "AGENTS.md",
    "CONTRIBUTING.md",
    "LICENSE",
    "CHANGELOG.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "SUPPORT.md",
    "PROJECT_STRUCTURE.md",  # Core project documentation
    # Next.js special files (standard naming)
    "layout.tsx",
    "page.tsx",
    "loading.tsx",
    "error.tsx",
    "not-found.tsx",
    "route.ts",
    "middleware.ts",
    "global.css",
    "globals.css",
    # Configuration files (standard naming)
    "Dockerfile",
    "Dockerfile.dev",
    "Dockerfile.prod",
    "Dockerfile.optimized",
    "docker-compose.yml",
    "docker-compose.dev.yml",
    "docker-compose.prod.yml",
    "Makefile",
    "Vagrantfile",
    "package.json",
    "package-lock.json",
    "pnpm-lock.yaml",
    "yarn.lock",
    "pyproject.toml",
    "requirements.txt",
    "requirements-dev.txt",
    "uv.lock",
    "tailwind.config.js",
    "tailwind.config.ts",
    "jest.config.js",
    "jest.setup.js",
    "next.config.js",
    "next-env.d.ts",
    "postcss.config.mjs",
    "eslint.config.js",
    "eslint.config.mjs",
    ".eslintrc.js",
    "tsconfig.json",
    "tsconfig.node.json",
    "vite.config.ts",
    ".cspell.json",
    ".mypy.ini",
    # Git and system files
    ".gitkeep",
    ".gitignore",
    ".gitattributes",
    ".DS_Store",
    ".editorconfig",
    ".prettierrc",
    ".prettierignore",
    ".env",
    ".env.example",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.1password",
    ".python-version",
    ".pre-commit-config.yaml",
    # Python special files
    "__init__.py",
}

# Directory patterns that should be excluded from checks
EXCLUDED_DIRS: Set[str] = {
    "__pycache__",
    "__tests__",
    ".git",
    ".vscode",
    ".devcontainer",
    ".github",
    ".next",
    ".migration",
    "node_modules",
    ".pytest_cache",
    ".ruff_cache",
    ".mypy_cache",
    ".turbo",
    "dist",
    "build",
    "coverage",
    ".venv",
    ".env",
    ".idea",
    "reports",
    "alembic",
    "brainwav_api",  # Python package (snake_case is standard)
}

# File extensions that should be excluded
EXCLUDED_EXTENSIONS: Set[str] = {
    ".pyc",
    ".pyo",
    ".pyd",
    ".so",
    ".dll",
    ".egg",
    ".whl",
    ".log",
    ".tmp",
    ".temp",
    ".cache",
    ".lock",
    ".swp",
    ".swo",
    ".bak",
    ".orig",
    ".map",  # Source maps
}


def is_kebab_case(name: str) -> bool:
    """Check if a string follows kebab-case convention."""
    if not name:
        return False
    return bool(re.match(r"^[a-z][a-z0-9]*(-[a-z0-9]+)*$", name))


def is_snake_case(name: str) -> bool:
    """Check if a string follows snake_case convention."""
    if not name:
        return False
    # Allow leading underscore for Python private methods/variables
    if name.startswith("_"):
        name = name[1:]
    return bool(re.match(r"^[a-z][a-z0-9]*(_[a-z0-9]+)*$", name))


def should_check_file(file_path: Path) -> bool:
    """Determine if a file should be checked for naming conventions."""
    # Check if any part of the path contains excluded directories
    for part in file_path.parts:
        if part in EXCLUDED_DIRS:
            return False

    # Check if the file has an excluded extension
    if file_path.suffix in EXCLUDED_EXTENSIONS:
        return False

    # Check if the filename is exempted
    if file_path.name in EXEMPTED_FILES:
        return False

    # Skip build files with hash patterns (e.g., index-Cj2EirFU.js)
    filename = file_path.name
    if re.match(r"^[a-z]+-[A-Za-z0-9]{8,}\.(js|css|js\.map|css\.map)$", filename):
        return False

    return True


def get_expected_convention(file_path: Path) -> str:
    """Determine the expected naming convention for a file."""
    extension = file_path.suffix.lower()

    # Python files should use snake_case
    if extension == ".py":
        return "snake_case"

    # TypeScript/JavaScript files should use kebab-case
    if extension in {".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"}:
        return "kebab_case"

    # CSS/SCSS files should use kebab-case
    if extension in {".css", ".scss", ".sass", ".less"}:
        return "kebab_case"

    # Shell scripts should use kebab-case
    if extension in {".sh", ".bash", ".zsh"}:
        return "kebab_case"

    # Default to kebab-case for most files
    return "kebab_case"


def convert_to_kebab_case(text: str) -> str:
    """Convert a string to kebab-case."""
    # Replace underscores and spaces with hyphens
    text = re.sub(r"[_\s]+", "-", text)
    # Insert hyphens before capital letters (camelCase -> camel-Case)
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1-\2", text)
    # Convert to lowercase
    text = text.lower()
    # Remove any leading/trailing hyphens
    text = text.strip("-")
    # Replace multiple consecutive hyphens with single hyphens
    text = re.sub(r"-+", "-", text)
    return text


def convert_to_snake_case(text: str) -> str:
    """Convert a string to snake_case."""
    # Replace hyphens and spaces with underscores
    text = re.sub(r"[-\s]+", "_", text)
    # Insert underscores before capital letters (camelCase -> camel_Case)
    text = re.sub(r"([a-z0-9])([A-Z])", r"\1_\2", text)
    # Convert to lowercase
    text = text.lower()
    # Remove any leading/trailing underscores (except single leading underscore)
    if text.startswith("__"):
        text = "_" + text.lstrip("_")
    else:
        text = text.strip("_")
    # Replace multiple consecutive underscores with single underscores
    text = re.sub(r"_+", "_", text)
    return text


def check_file_naming(file_path: Path) -> List[str]:
    """Check if a file follows the appropriate naming convention."""
    errors: List[str] = []

    if not should_check_file(file_path):
        return errors

    # Check directory components (should be kebab-case or standard names)
    for part in file_path.parts[:-1]:  # Exclude the filename
        if not is_kebab_case(part) and not part.islower():
            # Allow some standard directory names
            standard_dirs = {
                "src",
                "lib",
                "components",
                "pages",
                "api",
                "app",
                "public",
                "static",
                "assets",
            }
            if part not in standard_dirs:
                errors.append(
                    f"Directory '{part}' in path '{file_path}' should use kebab-case or lowercase"
                )

    # Check the filename
    filename = file_path.name
    stem = file_path.stem
    expected_convention = get_expected_convention(file_path)

    if expected_convention == "snake_case":
        if not is_snake_case(stem):
            suggested_name = convert_to_snake_case(stem)
            errors.append(
                f"Python file '{filename}' should use snake_case. "
                f"Expected: '{suggested_name}{file_path.suffix}'"
            )
    elif expected_convention == "kebab_case":
        if not is_kebab_case(stem):
            suggested_name = convert_to_kebab_case(stem)
            errors.append(
                f"File '{filename}' should use kebab-case. "
                f"Expected: '{suggested_name}{file_path.suffix}'"
            )

    return errors


def main() -> int:
    """Main function to check naming conventions for given files."""
    if len(sys.argv) < 2:
        print("Usage: python scripts/check-kebab-case.py [file1] [file2] ...")
        return 0

    files_to_check = sys.argv[1:]
    all_errors = []

    for file_str in files_to_check:
        file_path = Path(file_str)

        # Skip non-existent files (they might be deleted files in git)
        if not file_path.exists():
            continue

        errors = check_file_naming(file_path)
        all_errors.extend(errors)

    if all_errors:
        print("❌ Naming convention violations found:")
        print()
        for error in all_errors:
            print(f"  • {error}")
        print()
        print("💡 Naming Convention Rules:")
        print("  • TypeScript/JavaScript files: kebab-case (ai-learning-roadmap.tsx)")
        print("  • Python files: snake_case (ollama_manager.py)")
        print("  • CSS files: kebab-case (focus-scenes.css)")
        print("  • Shell scripts: kebab-case (setup-ollama.sh)")
        print("  • Governance files: UPPERCASE exceptions (RULES_OF_AI.md)")
        print("  • Next.js special files: Standard naming (layout.tsx, page.tsx)")
        print()
        print("📖 For more information, see:")
        print("  • docs/naming-conventions.md - Complete naming guide")
        print("  • ai/RULES_OF_AI.md - Project governance")
        return 1

    print("✅ All files follow project naming conventions")
    return 0


if __name__ == "__main__":
    exit(main())
