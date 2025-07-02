"""Test configuration and fixtures."""

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Ensure backend root and src directory are on the path so `src` package and
# local modules resolve correctly
backend_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(backend_root))
sys.path.insert(0, str(backend_root / "src"))

# Import must be after path manipulation
from src.main import app  # noqa: E402


@pytest.fixture
def client():
    """Test client fixture."""
    return TestClient(app)
