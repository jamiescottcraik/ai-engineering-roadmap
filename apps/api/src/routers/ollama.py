"""
Ollama integration router for the brAInwav API.
"""

from typing import Any

from fastapi import APIRouter
from integrations.providers.ollama import OllamaIntegrationService, RoadmapConfig

router = APIRouter(prefix="/ollama", tags=["ollama"])


@router.post("/sync")
async def ollama_sync() -> dict[str, Any]:
    """Sync Ollama models with the current roadmap week."""
    service = OllamaIntegrationService(RoadmapConfig(current_week=1))
    await service.sync_with_roadmap()
    return {"status": service.sync_status, "activeModel": service.active_model}
