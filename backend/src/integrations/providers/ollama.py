from __future__ import annotations

import shutil
from dataclasses import dataclass, field

# Default Ollama API configuration
from typing import Any

import requests

OLLAMA_API: dict[str, Any] = {
    "base": "http://localhost:11434",
    "endpoints": {
        "generate": "/api/generate",
        "chat": "/api/chat",
        "pull": "/api/pull",
        "list": "/api/tags",
        "running": "/api/ps",
    },
}


@dataclass
class RoadmapConfig:
    """Configuration for the current roadmap progress."""

    current_week: int


def _default_schedule() -> dict[int, list[str]]:
    """Return default mapping of weeks to required Ollama models."""
    return {
        1: ["python-tutor:latest", "codellama:7b-python"],
        2: ["codellama:7b", "mistral:latest"],
        3: ["codellama:13b", "mistral:latest"],
        4: ["mistral:latest", "llama3:latest"],
    }


@dataclass
class OllamaIntegrationService:
    """Sync Ollama models with the current roadmap week."""

    roadmap: RoadmapConfig
    api_base: str = OLLAMA_API["base"]
    schedule: dict[int, list[str]] = field(default_factory=_default_schedule)
    active_model: str | None = None
    sync_status: str = "pending"

    async def check_ollama_installed(self) -> bool:
        """Return True if the Ollama CLI is available on the system."""
        return shutil.which("ollama") is not None

    def get_required_models(self, week: int) -> list[str]:
        """Get the models required for the given week."""
        return self.schedule.get(week, ["mistral:latest"])

    async def pull_model(self, model_name: str) -> None:
        """Request Ollama to pull the specified model."""
        requests.post(f"{self.api_base}/api/pull", json={"name": model_name})

    async def set_active_model(self, model_name: str) -> None:
        """Mark the given model as active."""
        self.active_model = model_name

    async def update_sync_status(self, status: str) -> None:
        """Update the sync status value."""
        self.sync_status = status

    async def sync_with_roadmap(self) -> None:
        """Pull models for the current week and update status."""
        if not await self.check_ollama_installed():
            await self.update_sync_status("error")
            return

        models = self.get_required_models(self.roadmap.current_week)
        for model in models:
            await self.pull_model(model)
        await self.set_active_model(models[0])
        await self.update_sync_status("synced")
