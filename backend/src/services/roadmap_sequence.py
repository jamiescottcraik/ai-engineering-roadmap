from __future__ import annotations

import json
import shutil
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Any, cast


def _load_json(path: Path) -> dict[str, Any]:
    """Load JSON data from a file path."""
    with path.open("r", encoding="utf-8") as f:
        return cast(dict[str, Any], json.load(f))


def _save_json(path: Path, data: dict[str, Any]) -> None:
    """Save JSON data to a file path."""
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)


@dataclass
class RoadmapSequenceFixer:
    """Utility to ensure roadmap weeks follow the correct order."""

    config_path: Path

    async def backup_current_progress(self) -> None:
        """Create a backup of the current roadmap configuration."""
        backup = self.config_path.with_suffix(self.config_path.suffix + ".bak")
        shutil.copy(self.config_path, backup)

    async def load_config(self) -> dict[str, Any]:
        """Load roadmap configuration from disk."""
        return _load_json(self.config_path)

    def reorder_phases(self, phases: dict[str, Any]) -> dict[str, Any]:
        """Return phases ordered by their ``order`` field."""
        return dict(sorted(phases.items(), key=lambda kv: kv[1].get("order", 0)))

    def calculate_current_week(self) -> int:
        """Calculate the current week number from the start date."""
        start = date(2025, 6, 21)
        delta = date.today() - start
        return delta.days // 7 + 1

    async def save_config(self, config: dict[str, Any]) -> None:
        """Persist the updated configuration to disk."""
        _save_json(self.config_path, config)

    async def fix_sequence(self) -> None:
        """Reorder roadmap phases and update the current week."""
        await self.backup_current_progress()
        config = await self.load_config()
        config["phases"] = self.reorder_phases(config.get("phases", {}))
        config["currentWeek"] = self.calculate_current_week()
        await self.save_config(config)
