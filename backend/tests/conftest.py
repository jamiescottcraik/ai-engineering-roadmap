"""Test configuration and fixtures."""

import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

# Ensure src is on the path for imports
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from src.main import app


@pytest.fixture
def client():
    """Test client fixture."""
    return TestClient(app)
