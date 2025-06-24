import json
from pathlib import Path

import pytest

from src.services.roadmap_sequence import RoadmapSequenceFixer


@pytest.mark.asyncio
async def test_calculate_current_week(monkeypatch):
    fixer = RoadmapSequenceFixer(Path("config/roadmap-config-2025.json"))

    # Mock today's date to a known value
    from datetime import date

    class FakeDate(date):
        @classmethod
        def today(cls):
            return cls(2025, 6, 28)

    monkeypatch.setattr("src.services.roadmap_sequence.date", FakeDate)
    assert fixer.calculate_current_week() == 2


@pytest.mark.asyncio
async def test_reorder_phases():
    fixer = RoadmapSequenceFixer(Path("config/roadmap-config-2025.json"))
    phases = {
        "phase2": {"order": 2},
        "phase1": {"order": 1},
    }
    ordered = fixer.reorder_phases(phases)
    assert list(ordered.keys()) == ["phase1", "phase2"]


@pytest.mark.asyncio
async def test_fix_sequence(tmp_path):
    config_file = tmp_path / "config.json"
    config_file.write_text(
        '{"phases": {"p2": {"order": 2}, "p1": {"order": 1}}, "currentWeek": 1}'
    )
    fixer = RoadmapSequenceFixer(config_file)
    await fixer.fix_sequence()
    data = json.loads(config_file.read_text())
    assert list(data["phases"].keys()) == ["p1", "p2"]
