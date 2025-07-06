from pathlib import Path
from typing import Any

from fastapi import FastAPI

from .integrations.providers.ollama import (
    OllamaIntegrationService,
    RoadmapConfig,
)
from .services.roadmap_sequence import RoadmapSequenceFixer

app = FastAPI(
    title="brAInwav API",
    description="AI Engineering Roadmap Backend API",
    version="0.1.0",
)


@app.get("/")
async def root() -> dict[str, Any]:
    """Health check endpoint."""
    return {"message": "brAInwav API is running", "status": "healthy"}


@app.get("/health")
async def health_check() -> dict[str, Any]:
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "service": "brainwav-backend"}


@app.post("/roadmap/fix-sequence")
async def fix_sequence() -> dict[str, Any]:
    """Fix roadmap week ordering and update current week."""
    fixer = RoadmapSequenceFixer(Path("config/roadmap-config-2025.json"))
    await fixer.fix_sequence()
    return {"status": "ok"}


@app.post("/ollama/sync")
async def ollama_sync() -> dict[str, Any]:
    """Sync Ollama models with the current roadmap week."""
    service = OllamaIntegrationService(RoadmapConfig(current_week=1))
    await service.sync_with_roadmap()
    return {"status": service.sync_status, "activeModel": service.active_model}
