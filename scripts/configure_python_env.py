#!/usr/bin/env python3
"""
Python Environment Configuration Script for brAInwav MCP

This script configures the Python environment for use with MCP servers.
It ensures the correct Python executable is used and creates a virtual
environment if one doesn't exist.
"""

import json
import platform
import subprocess
import sys
from pathlib import Path


def main():
    """Main function to configure the Python environment."""
    print("Configuring Python environment for brAInwav MCP...")

    # Get the repository root directory
    repo_root = get_repo_root()
    print(f"Repository root: {repo_root}")

    # Check if virtual environment exists
    venv_path = repo_root / ".venv"
    if not venv_path.exists():
        print("Virtual environment not found. Creating one...")
        create_venv(repo_root)
    else:
        print(f"Found existing virtual environment at {venv_path}")

    # Get Python executable path
    python_path = get_python_path(venv_path)
    print(f"Using Python executable: {python_path}")

    # Create a configuration file for MCP servers to use
    config = {
        "python_executable": str(python_path),
        "venv_path": str(venv_path),
        "platform": platform.system(),
        "python_version": sys.version,
    }

    config_path = repo_root / "mcp-servers" / "custom" / "python-config.json"
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)

    print(f"Created Python configuration at {config_path}")

    # Check if required packages are installed
    check_packages(python_path)

    print("Python environment configuration complete!")


def get_repo_root():
    """Get the repository root directory."""
    current_dir = Path.cwd()
    while current_dir.name and not (current_dir / ".git").exists():
        parent = current_dir.parent
        if parent == current_dir:  # Reached filesystem root
            break
        current_dir = parent

    return current_dir


def create_venv(repo_root):
    """Create a virtual environment in the repository."""
    try:
        subprocess.run([sys.executable, "-m", "venv", ".venv"], cwd=repo_root, check=True)
        print("Virtual environment created successfully")
    except subprocess.CalledProcessError as e:
        print(f"Error creating virtual environment: {e}")
        sys.exit(1)


def get_python_path(venv_path):
    """Get the Python executable path from the virtual environment."""
    if platform.system() == "Windows":
        python_path = venv_path / "Scripts" / "python.exe"
    else:
        python_path = venv_path / "bin" / "python"

    if not python_path.exists():
        print(f"Python executable not found at {python_path}")
        print("Using system Python instead")
        return Path(sys.executable)

    return python_path


def check_packages(python_path):
    """Check if required packages are installed in the virtual environment."""
    required_packages = ["fastapi", "uvicorn", "sqlalchemy", "psycopg2-binary"]

    try:
        # Get installed packages
        result = subprocess.run(
            [python_path, "-m", "pip", "freeze"], capture_output=True, text=True, check=True
        )

        installed = result.stdout.lower()

        # Check required packages
        missing = []
        for pkg in required_packages:
            if pkg.lower() not in installed:
                missing.append(pkg)

        if missing:
            print(f"Missing required packages: {', '.join(missing)}")
            print("You may want to install them with:")
            print(f"{python_path} -m pip install {' '.join(missing)}")
        else:
            print("All required packages are installed")

    except subprocess.CalledProcessError as e:
        print(f"Error checking packages: {e}")


if __name__ == "__main__":
    main()
