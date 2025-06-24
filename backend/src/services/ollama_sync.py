from __future__ import annotations

import shutil
from dataclasses import dataclass, field

import requests  # type: ignore


@dataclass
class RoadmapConfig:
    current_week: int


def _default_schedule() -> dict[int, list[str]]:
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
    api_base: str = "http://localhost:11434"
    schedule: dict[int, list[str]] = field(default_factory=_default_schedule)
    active_model: str | None = None
    sync_status: str = "pending"

    async def check_ollama_installed(self) -> bool:
        return shutil.which("ollama") is not None

    def get_required_models(self, week: int) -> list[str]:
        return self.schedule.get(week, ["mistral:latest"])

    async def pull_model(self, model_name: str) -> None:
        requests.post(f"{self.api_base}/api/pull", json={"name": model_name})

    async def set_active_model(self, model_name: str) -> None:
        self.active_model = model_name

    async def update_sync_status(self, status: str) -> None:
        self.sync_status = status

    async def sync_with_roadmap(self) -> None:
        if not await self.check_ollama_installed():
            await self.update_sync_status("error")
            return

        models = self.get_required_models(self.roadmap.current_week)
        for model in models:
            await self.pull_model(model)
        await self.set_active_model(models[0])
        await self.update_sync_status("synced")
