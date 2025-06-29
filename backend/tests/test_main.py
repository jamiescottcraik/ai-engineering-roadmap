"""Test the main API endpoints."""

from fastapi.testclient import TestClient


def test_root_endpoint(client: TestClient):
    """Test the root endpoint returns correct response."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "brAInwav API is running"
    assert data["status"] == "healthy"


def test_health_check_endpoint(client: TestClient):
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "brainwav-backend"


def test_ollama_sync_endpoint(client: TestClient, monkeypatch):
    """Ensure the /ollama/sync endpoint triggers model sync."""

    async def fake_sync(self) -> None:
        self.sync_status = "synced"
        self.active_model = "python-tutor:latest"

    monkeypatch.setattr(
        "src.main.OllamaIntegrationService.sync_with_roadmap", fake_sync
    )

    response = client.post("/ollama/sync")
    assert response.status_code == 200
    assert response.json() == {
        "status": "synced",
        "activeModel": "python-tutor:latest",
    }


def test_fix_sequence_endpoint(client: TestClient, monkeypatch):
    """Ensure the /roadmap/fix-sequence endpoint updates roadmap data."""

    async def fake_fix(self) -> None:
        pass

    monkeypatch.setattr("src.main.RoadmapSequenceFixer.fix_sequence", fake_fix)

    response = client.post("/roadmap/fix-sequence")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
