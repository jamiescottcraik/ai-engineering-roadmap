import pytest

from src.integrations.providers.ollama import (
    OllamaIntegrationService,
    RoadmapConfig,
)


@pytest.mark.asyncio
async def test_get_required_models():
    service = OllamaIntegrationService(RoadmapConfig(current_week=1))
    assert service.get_required_models(1) == [
        "python-tutor:latest",
        "codellama:7b-python",
    ]
    assert service.get_required_models(99) == ["mistral:latest"]


@pytest.mark.asyncio
async def test_sync_with_missing_ollama(monkeypatch):
    service = OllamaIntegrationService(RoadmapConfig(current_week=1))

    async def fake_check():
        return False

    monkeypatch.setattr(service, "check_ollama_installed", fake_check)

    await service.sync_with_roadmap()
    assert service.sync_status == "error"


@pytest.mark.asyncio
async def test_sync_success(monkeypatch):
    service = OllamaIntegrationService(RoadmapConfig(current_week=1))

    async def fake_check():
        return True

    async def fake_pull(model_name: str):
        service.active_model = model_name

    monkeypatch.setattr(service, "check_ollama_installed", fake_check)
    monkeypatch.setattr(service, "pull_model", fake_pull)

    await service.sync_with_roadmap()
    assert service.sync_status == "synced"
    assert service.active_model == "python-tutor:latest"
